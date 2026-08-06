import express from "express";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  constructStripeWebhook,
  createCheckout,
  getOrderStatus,
  handleResendEvent,
  handleStripeEvent,
  publicCommerceConfig,
  resendWebhookHttpStatus,
  startCommerceWorkers,
  stopCommerceWorkers
} from "./commerce.js";
import { AssessmentPayloadError, BANK_VERSION, SCORING_VERSION } from "./assessment.js";
import { buildAdminSnapshot } from "./admin-snapshot.js";
import { commerceReadiness, config, legalReadiness } from "./config.js";
import { closeDatabase, database, hasDatabase, migrate } from "./db.js";
import {
  INTERNAL_AUTH_HEADERS,
  INTERNAL_AUTH_VERSION,
  InternalAuthError,
  signInternalResponse,
  verifyInternalRequest
} from "./internal-auth.js";
import { createPreassessmentConsent, publicLegalConfig } from "./legal.js";

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const checkoutAttempts = new Map();
const legalConsentAttempts = new Map();
const internalAdminAttempts = new Map();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=(self)");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  if (req.path === "/" || req.path.endsWith(".html")) res.setHeader("X-Robots-Tag", "noindex, nofollow");

  const allowedOrigins = new Set([
    config.appBaseUrl,
    "https://cogniva-compass.webflow.io",
    config.serviceBaseUrl
  ].filter(Boolean));
  const origin = req.get("origin");
  if (origin && allowedOrigins.has(origin.replace(/\/+$/, ""))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Order-Token");
  }
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.post("/api/webhooks/stripe", express.raw({ type: "application/json", limit: "1mb" }), async (req, res) => {
  try {
    const event = constructStripeWebhook(req.body, req.get("stripe-signature"));
    const result = await handleStripeEvent(event);
    res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    const signatureError = error?.type === "StripeSignatureVerificationError" || /signature/i.test(error.message || "");
    console.error("[stripe-webhook] rejected", { signatureError, message: error.message });
    res.status(signatureError ? 400 : 500).json({ received: false });
  }
});

app.post("/api/webhooks/resend", express.raw({ type: "application/json", limit: "512kb" }), async (req, res) => {
  try {
    const result = await handleResendEvent(req.body.toString("utf8"), req.headers);
    res.status(200).json({ received: true, duplicate: result.duplicate });
  } catch (error) {
    const status = resendWebhookHttpStatus(error);
    console.error("[resend-webhook] rejected", {
      clientError: status >= 400 && status < 500,
      code: error?.code || error?.name || "UNKNOWN"
    });
    res.status(status).json({ received: false });
  }
});

app.use(express.json({ limit: "64kb" }));

function checkoutRateLimit(req, res, next) {
  const now = Date.now();
  const key = String(req.ip || "unknown");
  const previous = checkoutAttempts.get(key) || [];
  const recent = previous.filter((timestamp) => timestamp > now - 10 * 60 * 1000);
  if (recent.length >= 10) {
    res.setHeader("Retry-After", "600");
    return res.status(429).json({ ok: false, error: "Too many checkout attempts. Please try again later." });
  }
  recent.push(now);
  checkoutAttempts.set(key, recent);
  if (checkoutAttempts.size > 5000) {
    for (const [candidate, timestamps] of checkoutAttempts) {
      if (!timestamps.some((timestamp) => timestamp > now - 10 * 60 * 1000)) checkoutAttempts.delete(candidate);
    }
  }
  next();
}

function legalConsentRateLimit(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  const now = Date.now();
  const key = String(req.ip || "unknown");
  const previous = legalConsentAttempts.get(key) || [];
  const recent = previous.filter((timestamp) => timestamp > now - 10 * 60 * 1000);
  if (recent.length >= 20) {
    res.setHeader("Retry-After", "600");
    return res.status(429).json({ ok: false, error: "Too many consent requests. Please try again later." });
  }
  recent.push(now);
  legalConsentAttempts.set(key, recent);
  if (legalConsentAttempts.size > 5000) {
    for (const [candidate, timestamps] of legalConsentAttempts) {
      if (!timestamps.some((timestamp) => timestamp > now - 10 * 60 * 1000)) {
        legalConsentAttempts.delete(candidate);
      }
    }
  }
  next();
}

function allowInternalAdminAttempt(req) {
  const now = Date.now();
  const key = String(req.ip || "unknown");
  const previous = internalAdminAttempts.get(key) || [];
  const recent = previous.filter((timestamp) => timestamp > now - 15 * 60 * 1000);
  if (recent.length >= 120) return false;
  recent.push(now);
  internalAdminAttempts.set(key, recent);
  if (internalAdminAttempts.size > 5000) {
    for (const [candidate, timestamps] of internalAdminAttempts) {
      if (!timestamps.some((timestamp) => timestamp > now - 15 * 60 * 1000)) {
        internalAdminAttempts.delete(candidate);
      }
    }
  }
  return true;
}

function sha256(value) {
  return createHash("sha256").update(String(value || ""), "utf8").digest("hex");
}

function safeErrorCode(error, fallback = "UNKNOWN") {
  return String(error?.code || error?.name || fallback)
    .toUpperCase()
    .replace(/[^A-Z0-9_.-]/g, "_")
    .slice(0, 80) || fallback;
}

function adminIntegrationReadiness() {
  const missing = [];
  if (!hasDatabase()) missing.push("DATABASE_URL");
  if (!/^[a-z0-9][a-z0-9_.-]{2,79}$/u.test(config.adminIntegration.keyId)) {
    missing.push("COGNIVA_ADMIN_INTEGRATION_KEY_ID");
  }
  if (Buffer.byteLength(config.adminIntegration.secret || "", "utf8") < 32) {
    missing.push("COGNIVA_ADMIN_INTEGRATION_SECRET");
  }
  return Object.freeze({ ready: missing.length === 0, missing: Object.freeze(missing) });
}

function integrationCode() {
  return /^[a-z0-9][a-z0-9_.-]{2,79}$/u.test(config.adminIntegration.keyId)
    ? config.adminIntegration.keyId
    : "neuromap_dashboard";
}

function integrationRequestHashes(req) {
  const nonce = String(req.get(INTERNAL_AUTH_HEADERS.nonce) || "");
  const timestamp = String(req.get(INTERNAL_AUTH_HEADERS.timestamp) || "");
  const keyId = String(req.get(INTERNAL_AUTH_HEADERS.keyId) || "");
  const bodyHash = sha256("");
  return Object.freeze({
    nonceHash: sha256(nonce),
    requestHash: sha256([
      String(req.method || "").toUpperCase(),
      String(req.originalUrl || req.path || ""),
      keyId,
      timestamp,
      nonce,
      bodyHash
    ].join("\n"))
  });
}

async function consumeAdminIntegrationNonce({ keyId, nonce, timestamp, bodyHash, method, requestTarget }) {
  const nonceHash = sha256(nonce);
  const requestHash = sha256([
    method,
    requestTarget,
    keyId,
    String(timestamp),
    nonce,
    bodyHash
  ].join("\n"));
  const result = await database().query(
    `WITH cleanup AS (
       DELETE FROM integration_nonces
       WHERE expires_at < NOW() - INTERVAL '5 minutes'
     )
     INSERT INTO integration_nonces (
       integration_code, nonce_hash, request_hash, issued_at, expires_at, consumed_at
     ) VALUES (
       $1, $2, $3, NOW(), NOW() + ($4::int * INTERVAL '1 second'), NOW()
     )
     ON CONFLICT (integration_code, nonce_hash) DO NOTHING
     RETURNING nonce_hash`,
    [keyId, nonceHash, requestHash, config.adminIntegration.clockSkewSeconds]
  );
  return result.rowCount === 1;
}

async function recordAdminIntegrationAudit({ req, outcome, status, code, startedAt, responseBytes = 0 }) {
  if (!hasDatabase()) throw new Error("DATABASE_NOT_CONFIGURED");
  const hashes = integrationRequestHashes(req);
  const metadata = {
    code: String(code || "UNKNOWN").slice(0, 80),
    latencyMs: Math.max(0, Date.now() - Number(startedAt || Date.now())),
    responseBytes: Math.max(0, Number(responseBytes) || 0),
    originPresent: Boolean(req.get("origin")),
    schemaVersion: "cogniva-admin-snapshot-v1"
  };
  await database().query(
    `WITH cleanup AS (
       DELETE FROM integration_audit_events
       WHERE recorded_at < NOW() - INTERVAL '90 days'
     )
     INSERT INTO integration_audit_events (
       integration_code, event_id, event_type, outcome,
       nonce_hash, request_hash, http_status, metadata
     ) VALUES ($1,$2,'admin_snapshot_request',$3,$4,$5,$6,$7::jsonb)`,
    [
      integrationCode(),
      randomUUID(),
      outcome,
      hashes.nonceHash,
      hashes.requestHash,
      status,
      JSON.stringify(metadata)
    ]
  );
}

async function persistPreassessmentConsent({ token, record }) {
  const tokenHash = sha256(token);
  await database().query(
    `WITH cleanup AS (
       DELETE FROM assessment_consent_receipts
       WHERE order_id IS NULL
         AND expires_at < NOW() - INTERVAL '7 days'
     )
     INSERT INTO assessment_consent_receipts (
       id, order_id, receipt_type, schema_version, policy_version, locale,
       content_version,
       age_confirmed, own_responses_confirmed, privacy_acknowledged, non_diagnostic_acknowledged,
       special_category_consent, analytics_consent, terms_accepted,
       privacy_url, terms_url, document_hashes, statement_snapshot,
       receipt_hash, accepted_at, expires_at
     ) VALUES (
       $1, NULL, 'assessment_start', $2, $3, $4, $5,
       true, true, true, true, true, $6, true,
       $7, $8, $9::jsonb, $10::jsonb, $11, $12, $13
     )`,
    [
      randomUUID(),
      record.schemaVersion,
      record.documents.policyVersion,
      record.locale,
      record.contentVersion,
      record.analyticsConsent,
      config.privacyUrl,
      config.termsUrl,
      JSON.stringify(record.documents),
      JSON.stringify({
        contentVersion: record.contentVersion,
        adultConfirmed: true,
        ownResponsesConfirmed: true,
        termsAccepted: true,
        nonDiagnosticAccepted: true,
        privacyAcknowledged: true,
        specialCategoryConsent: true,
        analyticsConsent: record.analyticsConsent
      }),
      tokenHash,
      record.acceptedAt,
      record.expiresAt
    ]
  );
}

app.get("/api/legal/config", (_req, res) => {
  res.setHeader("Cache-Control", "no-store");
  const legal = publicLegalConfig();
  const productionLegalReady = legal.legalReady && hasDatabase();
  const assessmentReady = legal.assessmentMode === "preview" ||
    (legal.assessmentMode === "production" && productionLegalReady);
  return res.status(200).json({
    ok: true,
    ...legal,
    assessmentReady,
    legalReady: productionLegalReady,
    legalStorageReady: hasDatabase()
  });
});

app.post("/api/legal/consent", legalConsentRateLimit, async (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  try {
    if (!hasDatabase()) {
      const error = new Error("Legal receipt storage is unavailable.");
      error.status = 503;
      error.code = "LEGAL_STORAGE_NOT_READY";
      throw error;
    }
    const consent = createPreassessmentConsent(req.body || {});
    await persistPreassessmentConsent(consent);
    return res.status(201).json({
      ok: true,
      token: consent.token,
      receipt: {
        schemaVersion: consent.record.schemaVersion,
        locale: consent.record.locale,
        contentVersion: consent.record.contentVersion,
        scope: consent.record.scope,
        documents: consent.record.documents,
        acceptedAt: consent.record.acceptedAt,
        expiresAt: consent.record.expiresAt
      }
    });
  } catch (error) {
    const status = error instanceof AssessmentPayloadError
      ? 400
      : Number(error.status) === 503
        ? 503
        : 500;
    const internalCode = safeErrorCode(error, status === 400 ? "INVALID_CONSENT" : "LEGAL_CONSENT_FAILED");
    if (status >= 500) console.error("[legal-consent] request failed", { code: internalCode });
    return res.status(status).json({
      ok: false,
      error: status === 400 ? "Consent request is invalid." : "Consent service is temporarily unavailable.",
      code: status === 400 ? "INVALID_CONSENT" : "LEGAL_CONSENT_UNAVAILABLE"
    });
  }
});

app.get("/internal/admin/v1/snapshot", async (req, res) => {
  const startedAt = Date.now();
  res.setHeader("Cache-Control", "no-store, private");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.removeHeader("Access-Control-Allow-Origin");
  try {
    const rateAllowed = allowInternalAdminAttempt(req);
    if (req.get("origin")) {
      if (!rateAllowed) {
        res.setHeader("Retry-After", "900");
        return res.status(429).json({ ok: false, error: "Too many requests.", code: "RATE_LIMITED" });
      }
      const error = new Error("Browser-origin requests are forbidden.");
      error.status = 403;
      error.code = "ORIGIN_NOT_ALLOWED";
      throw error;
    }
    if (!rateAllowed) {
      res.setHeader("Retry-After", "900");
      return res.status(429).json({ ok: false, error: "Too many requests.", code: "RATE_LIMITED" });
    }
    const readiness = adminIntegrationReadiness();
    if (!readiness.ready) {
      const error = new Error("Admin integration is not ready.");
      error.status = 503;
      error.code = "ADMIN_INTEGRATION_NOT_READY";
      throw error;
    }
    const version = String(req.get(INTERNAL_AUTH_HEADERS.version) || "");
    const keyId = String(req.get(INTERNAL_AUTH_HEADERS.keyId) || "");
    if (version !== INTERNAL_AUTH_VERSION || keyId !== config.adminIntegration.keyId) {
      throw new InternalAuthError("INVALID_AUTH_CREDENTIALS");
    }
    const authentication = await verifyInternalRequest({
      secret: config.adminIntegration.secret,
      keyId,
      timestamp: req.get(INTERNAL_AUTH_HEADERS.timestamp),
      nonce: req.get(INTERNAL_AUTH_HEADERS.nonce),
      signature: req.get(INTERNAL_AUTH_HEADERS.signature),
      method: req.method,
      requestTarget: req.originalUrl,
      body: "",
      maxAgeSeconds: config.adminIntegration.clockSkewSeconds,
      consumeNonce: consumeAdminIntegrationNonce
    });
    const snapshot = await buildAdminSnapshot({
      query: (sql, params) => database().query(sql, params),
      minCellSize: 5,
      serviceVersion: "2.0.0",
      bankVersion: BANK_VERSION,
      scoringVersion: SCORING_VERSION
    });
    const body = JSON.stringify({ ok: true, snapshot });
    if (Buffer.byteLength(body, "utf8") > 64 * 1024) {
      const error = new Error("Admin snapshot exceeded the response-size safety limit.");
      error.status = 503;
      error.code = "SNAPSHOT_TOO_LARGE";
      throw error;
    }
    const responseAuth = signInternalResponse({
      secret: config.adminIntegration.secret,
      keyId: authentication.keyId,
      timestamp: Math.floor(Date.now() / 1000),
      requestNonce: authentication.nonce,
      statusCode: 200,
      body
    });
    for (const [header, value] of Object.entries(responseAuth.headers)) {
      res.setHeader(header, value);
    }
    await recordAdminIntegrationAudit({
      req,
      outcome: "accepted",
      status: 200,
      code: "SNAPSHOT_RETURNED",
      startedAt,
      responseBytes: Buffer.byteLength(body, "utf8")
    });
    return res.status(200).type("application/json").send(body);
  } catch (error) {
    const code = safeErrorCode(error, "ADMIN_SNAPSHOT_FAILED");
    const status = Number(error.status) === 403
      ? 403
      : Number(error.status) >= 500
        ? 503
        : error instanceof InternalAuthError
          ? 401
          : 500;
    const outcome = code === "AUTH_REPLAY_DETECTED"
      ? "duplicate"
      : status >= 500
        ? "failed"
        : "rejected";
    await recordAdminIntegrationAudit({ req, outcome, status, code, startedAt }).catch(() => {});
    if (status >= 500) console.error("[internal-admin] snapshot request failed", { code, status });
    return res.status(status).json({
      ok: false,
      error: status === 401 || status === 403 ? "Unauthorized." : "Snapshot service is temporarily unavailable.",
      code: status >= 500 ? "SNAPSHOT_UNAVAILABLE" : "AUTH_FAILED"
    });
  }
});

app.get("/health", (_, res) => {
  const legal = legalReadiness();
  const adminIntegration = adminIntegrationReadiness();
  const productionLegalReady = legal.ready && hasDatabase();
  const assessmentReady = config.assessmentAccessMode === "preview" ||
    (config.assessmentAccessMode === "production" && productionLegalReady);
  res.setHeader("Cache-Control", "no-store");
  res.json({
    ok: true,
    service: "cogniva-compass",
    version: "2.0.0",
    databaseConfigured: hasDatabase(),
    assessmentMode: config.assessmentAccessMode,
    assessmentReady,
    commerceConfigured: commerceReadiness().ready,
    legalConfigured: legal.ready,
    legalConsentReady: config.assessmentAccessMode === "production" && productionLegalReady,
    adminIntegrationConfigured: adminIntegration.ready
  });
});

app.get("/api/config", async (_, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.json({ ok: true, ...(await publicCommerceConfig()) });
});

app.post("/api/checkout", checkoutRateLimit, async (req, res) => {
  try {
    const result = await createCheckout(req.body || {});
    res.setHeader("Cache-Control", "no-store");
    res.status(201).json({ ok: true, ...result });
  } catch (error) {
    const status = error instanceof AssessmentPayloadError ? 400 : Number(error.status) || 502;
    if (status >= 500) console.error("[checkout] failed", { code: error.code || error.name || "UNKNOWN" });
    res.status(status).json({
      ok: false,
      error: status >= 500 ? "Checkout is temporarily unavailable." : error.message,
      code: error.code || null,
      details: error instanceof AssessmentPayloadError ? error.details : undefined
    });
  }
});

app.get("/api/orders/:id", async (req, res) => {
  try {
    const status = await getOrderStatus(req.params.id, req.get("x-order-token"));
    res.setHeader("Cache-Control", "no-store");
    res.json({ ok: true, ...status });
  } catch (error) {
    res.status(Number(error.status) || 500).json({ ok: false, error: Number(error.status) === 404 ? "Order not found." : "Order status is temporarily unavailable." });
  }
});

app.use(express.static(path.join(root, "public"), {
  extensions: ["html"],
  maxAge: "1h",
  setHeaders(res, filePath) {
    if (/\.(?:js|css)$/i.test(filePath)) res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
  }
}));

app.get("*path", (_, res) => res.sendFile(path.join(root, "public", "index.html")));

await migrate();
await startCommerceWorkers();

const server = app.listen(config.port, () => {
  console.log(`Cogniva Compass listening on ${config.port}`);
});

async function shutdown(signal) {
  console.log(`[server] ${signal} received; shutting down`);
  stopCommerceWorkers();
  server.close(async () => {
    await closeDatabase().catch(() => {});
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
