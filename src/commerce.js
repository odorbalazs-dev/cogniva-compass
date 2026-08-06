import crypto from "node:crypto";
import Stripe from "stripe";
import { canonicalizeOrderAssessments, AssessmentPayloadError } from "./assessment.js";
import { aiReadiness, commerceReadiness, config, isSupportedLanguage } from "./config.js";
import { database, withTransaction } from "./db.js";
import { sendReportEmail, verifyResendWebhook } from "./email.js";
import { verifyPreassessmentConsent } from "./legal.js";
import {
  PRODUCT_CODES,
  configuredStripePriceIds,
  normalizeStripeProductPrice,
  productByCode
} from "./products.js";
import { buildPersonalReport } from "./report.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const TERMINAL_REPORT_STATUSES = Object.freeze(["generated", "failed"]);
const TERMINAL_UNQUEUED_PAYMENT_STATUSES = Object.freeze(["failed", "expired", "refunded", "disputed"]);
const EXPIRABLE_REPORT_STATUSES = Object.freeze(["queued", "retry"]);
let workerTimer = null;
let maintenanceTimer = null;
let purgeTimer = null;
let workerBusy = false;
const stripePriceCache = new Map();
const MAINTENANCE_INTERVAL_MS = 60 * 1000;
const PURGE_INTERVAL_MS = 6 * 60 * 60 * 1000;

function safeErrorLabel(error, fallback = "UNKNOWN") {
  const candidate = [error?.code, error?.type, error?.name]
    .find((value) => typeof value === "string" && value.trim());
  const sanitized = String(candidate || fallback).toUpperCase().replace(/[^A-Z0-9_.-]/g, "_").slice(0, 80);
  return sanitized || fallback;
}

function stripeClient() {
  if (!config.stripeSecretKey) throw new Error("Stripe is not configured.");
  return new Stripe(config.stripeSecretKey, { maxNetworkRetries: 2, timeout: 20000 });
}

function configurationError(message, code) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export class ResendWebhookRequestError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ResendWebhookRequestError";
    this.code = code;
    this.status = 400;
  }
}

export function resendWebhookHttpStatus(error) {
  return error instanceof ResendWebhookRequestError ? error.status : 500;
}

function configuredProductPriceEnvironment() {
  return Object.freeze({
    STRIPE_SINGLE_PRICE_ID: config.stripeSinglePriceId,
    STRIPE_BUNDLE_PRICE_ID: config.stripeBundlePriceId
  });
}

async function validatedStripeProductPrice(productCode) {
  const now = Date.now();
  const cached = stripePriceCache.get(productCode);
  if (cached && cached.expiresAt > now) {
    if (cached.errorCode) {
      const cachedError = new Error("Stripe Price validation is temporarily unavailable.");
      cachedError.code = cached.errorCode;
      throw cachedError;
    }
    return cached.value;
  }
  const environment = configuredProductPriceEnvironment();
  const priceId = configuredStripePriceIds(environment)[productByCode(productCode).code];
  let price;
  try {
    price = await stripeClient().prices.retrieve(priceId);
  } catch (error) {
    stripePriceCache.set(productCode, {
      errorCode: safeErrorLabel(error, "STRIPE_PRICE_LOOKUP_FAILED"),
      expiresAt: now + 30 * 1000
    });
    throw error;
  }
  let value;
  try {
    value = normalizeStripeProductPrice(productCode, price, environment);
  } catch (error) {
    stripePriceCache.set(productCode, {
      errorCode: safeErrorLabel(error, "INVALID_STRIPE_PRICE"),
      expiresAt: now + 30 * 1000
    });
    throw error;
  }
  stripePriceCache.set(productCode, { value, expiresAt: now + 5 * 60 * 1000 });
  return value;
}

function priceLabel(price) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      currencyDisplay: "code"
    }).format(price.amount / 100);
  } catch {
    return `${price.amount / 100} ${price.currency}`;
  }
}

export function checkoutPublicResponse(orderId, checkoutUrl) {
  return Object.freeze({ orderId, checkoutUrl });
}

export function retentionCanRedact(paymentStatus, reportStatus) {
  return TERMINAL_REPORT_STATUSES.includes(reportStatus) || (
    reportStatus === "not_queued" && TERMINAL_UNQUEUED_PAYMENT_STATUSES.includes(paymentStatus)
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(String(token)).digest("hex");
}

function safeCompare(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function checkoutLocale(lang) {
  return lang === "ar" ? "auto" : lang;
}

function validateEmail(value) {
  const email = String(value || "").trim().toLowerCase();
  if (email.length < 5 || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    throw new AssessmentPayloadError("A valid delivery email address is required.");
  }
  return email;
}

function validateConsent(payload, locale) {
  const preassessment = verifyPreassessmentConsent(payload.preassessmentConsentToken, locale);
  if (payload.purchaseTermsAccepted !== true) throw new AssessmentPayloadError("Purchase terms acceptance is required.");
  if (payload.immediatePerformanceAccepted !== true) {
    throw new AssessmentPayloadError("Immediate digital performance acknowledgement is required.");
  }
  if (payload.aiConsent !== true && payload.aiConsent !== false) {
    throw new AssessmentPayloadError("AI preference must be explicitly selected.");
  }
  if (payload.policyVersion !== config.policyVersion) {
    throw new AssessmentPayloadError("The legal information has changed. Please review it again.");
  }
  return Object.freeze({
    schemaVersion: "cogniva-consent-v2",
    preassessment,
    purchaseTermsAccepted: true,
    immediatePerformanceAccepted: true,
    aiConsent: payload.aiConsent,
    policyVersion: config.policyVersion,
    privacyUrl: config.privacyUrl,
    termsUrl: config.termsUrl,
    acceptedAt: new Date().toISOString()
  });
}

function buildReturnUrls(orderId, accessToken, locale) {
  const appRoot = config.appBaseUrl.replace(/\/+$/, "");
  const fragment = new URLSearchParams({ order: orderId, access: accessToken }).toString();
  const language = encodeURIComponent(locale);
  return {
    success: `${appRoot}/?checkout=success&lang=${language}#${fragment}`,
    cancel: `${appRoot}/?checkout=cancelled&lang=${language}`
  };
}

export async function createCheckout(payload) {
  const readiness = commerceReadiness();
  if (!readiness.ready) {
    const error = new Error("Report checkout is not available yet.");
    error.status = 503;
    error.code = "COMMERCE_NOT_READY";
    throw error;
  }
  const product = productByCode(payload.packageCode);
  const validatedPrice = await validatedStripeProductPrice(product.code);

  const locale = String(payload.locale || "").toLowerCase();
  if (!isSupportedLanguage(locale)) throw new AssessmentPayloadError("Unsupported report language.");
  const email = validateEmail(payload.email);
  const consent = validateConsent(payload, locale);
  const assessments = canonicalizeOrderAssessments(product.code, payload.assessments);
  const primary = assessments[0];
  const orderId = crypto.randomUUID();
  const orderToken = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + config.reportRetentionDays * 86400000);

  await withTransaction(async (client) => {
    await client.query(
      `INSERT INTO assessment_orders (
        id, access_token_hash, email, lang, track, form_id, bank_version,
        scoring_version, scores, overall, consent_record, policy_version,
        product_code, package_code, stripe_price_id, expected_amount,
        expected_currency, personal_data_expires_at
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10,$11::jsonb,$12,$13,$14,$15,$16,$17,$18)`,
      [
        orderId,
        hashToken(orderToken),
        email,
        locale,
        primary.track,
        primary.formId,
        primary.bankVersion,
        primary.scoringVersion,
        JSON.stringify(primary.scores),
        primary.overall,
        JSON.stringify(consent),
        config.policyVersion,
        product.code,
        product.code,
        validatedPrice.priceId,
        validatedPrice.amount,
        validatedPrice.currency,
        expiresAt
      ]
    );
    for (const assessment of assessments) {
      await client.query(
        `INSERT INTO assessment_order_assessments (
          order_id,track,form_id,bank_version,scoring_version,scores,overall
        ) VALUES ($1,$2,$3,$4,$5,$6::jsonb,$7)`,
        [orderId, assessment.track, assessment.formId, assessment.bankVersion,
          assessment.scoringVersion, JSON.stringify(assessment.scores), assessment.overall]
      );
    }
    await client.query(
      `INSERT INTO assessment_consent_receipts (
        id,order_id,receipt_type,schema_version,policy_version,locale,
        content_version,
        age_confirmed,own_responses_confirmed,privacy_acknowledged,
        non_diagnostic_acknowledged,special_category_consent,analytics_consent,
        terms_accepted,document_hashes,statement_snapshot,receipt_hash,
        accepted_at,expires_at
      ) VALUES ($1,$2,'assessment_start',$3,$4,$5,$6,true,true,true,true,true,$7,true,$8::jsonb,$9::jsonb,$10,$11,$12)`,
      [crypto.randomUUID(), orderId, consent.preassessment.schemaVersion,
        config.policyVersion, locale, consent.preassessment.contentVersion,
        consent.preassessment.analyticsConsent,
        JSON.stringify(consent.preassessment.documents),
        JSON.stringify({
          contentVersion: consent.preassessment.contentVersion,
          adultConfirmed: true,
          ownResponsesConfirmed: true,
          termsAccepted: true,
          nonDiagnosticAccepted: true,
          privacyAcknowledged: true,
          specialCategoryConsent: true,
          analyticsConsent: consent.preassessment.analyticsConsent
        }), consent.preassessment.tokenHash, consent.preassessment.acceptedAt,
        consent.preassessment.expiresAt]
    );
    await client.query(
      `INSERT INTO assessment_consent_receipts (
        id,order_id,receipt_type,schema_version,policy_version,locale,
        content_version,
        terms_accepted,immediate_performance_accepted,ai_consent,
        privacy_url,terms_url,document_hashes,statement_snapshot,accepted_at
      ) VALUES ($1,$2,'purchase',$3,$4,$5,$6,true,true,$7,$8,$9,$10::jsonb,$11::jsonb,$12)`,
      [crypto.randomUUID(), orderId, consent.schemaVersion, config.policyVersion,
        locale, consent.preassessment.contentVersion, consent.aiConsent, config.privacyUrl, config.termsUrl,
        JSON.stringify(consent.preassessment.documents), JSON.stringify({
          purchaseTermsAccepted: true,
          immediatePerformanceAccepted: true,
          aiConsent: consent.aiConsent,
          packageCode: product.code
        }), consent.acceptedAt]
    );
  });

  try {
    const urls = buildReturnUrls(orderId, orderToken, locale);
    const sessionParams = {
        mode: "payment",
        currency: validatedPrice.currency.toLowerCase(),
        adaptive_pricing: { enabled: false },
        client_reference_id: orderId,
        customer_email: email,
        billing_address_collection: config.stripeAutomaticTax || config.stripeInvoiceCreation ? "required" : "auto",
        line_items: [{ price: validatedPrice.priceId, quantity: 1 }],
        locale: checkoutLocale(locale),
        success_url: urls.success,
        cancel_url: urls.cancel,
        metadata: { cogniva_order_id: orderId, cogniva_package_code: product.code, integration: "cogniva_compass_v1" },
        payment_intent_data: {
          metadata: { cogniva_order_id: orderId, cogniva_package_code: product.code, integration: "cogniva_compass_v1" }
        }
    };
    if (config.stripeAutomaticTax) sessionParams.automatic_tax = { enabled: true };
    if (config.stripeInvoiceCreation) {
      sessionParams.customer_creation = "always";
      sessionParams.invoice_creation = { enabled: true };
    }
    const session = await stripeClient().checkout.sessions.create(
      sessionParams,
      { idempotencyKey: `cogniva-checkout/${orderId}` }
    );

    if (!session.url) throw new Error("Stripe returned no Checkout URL.");
    await database().query(
      `UPDATE assessment_orders
       SET stripe_checkout_session_id=$2, payment_status='checkout_created', updated_at=NOW()
       WHERE id=$1`,
      [orderId, session.id]
    );
    return checkoutPublicResponse(orderId, session.url);
  } catch (error) {
    await database().query(
      `UPDATE assessment_orders SET payment_status='failed', error_message=$2, updated_at=NOW() WHERE id=$1`,
      [orderId, `Checkout provider error (${safeErrorLabel(error, "CHECKOUT_ERROR")})`]
    ).catch(() => {});
    error.code = "CHECKOUT_PROVIDER_ERROR";
    throw error;
  }
}

export async function getOrderStatus(orderId, accessToken) {
  if (!/^[0-9a-f-]{36}$/i.test(String(orderId || ""))) {
    const error = new Error("Order not found.");
    error.status = 404;
    throw error;
  }
  const result = await database().query(
    `SELECT id, access_token_hash, payment_status, report_status, delivery_status,
            email_sent_at, email_delivered_at, created_at
     FROM assessment_orders WHERE id=$1 LIMIT 1`,
    [orderId]
  );
  const order = result.rows[0];
  if (!order || !safeCompare(order.access_token_hash, hashToken(accessToken || ""))) {
    const error = new Error("Order not found.");
    error.status = 404;
    throw error;
  }
  return Object.freeze({
    status: order.payment_status,
    reportStatus: order.report_status,
    emailDeliveryStatus: order.delivery_status,
    emailSentAt: order.email_sent_at,
    emailDeliveredAt: order.email_delivered_at
  });
}

async function recordProviderEvent(client, provider, eventId, eventType, objectId, providerCreatedAt = null) {
  const result = await client.query(
    `INSERT INTO provider_webhook_events (provider,event_id,event_type,object_id,provider_created_at)
     VALUES ($1,$2,$3,$4,$5)
     ON CONFLICT (provider,event_id) DO NOTHING
     RETURNING event_id`,
    [provider, eventId, eventType, objectId || null, providerCreatedAt]
  );
  return result.rowCount === 1;
}

async function checkoutSessionPriceId(sessionId) {
  const lines = await stripeClient().checkout.sessions.listLineItems(sessionId, { limit: 2 });
  if (!Array.isArray(lines?.data) || lines.data.length !== 1 || lines.data[0]?.quantity !== 1) {
    throw configurationError("Stripe Checkout Session did not contain exactly one package line.", "STRIPE_LINE_ITEM_MISMATCH");
  }
  const priceId = typeof lines.data[0].price === "string" ? lines.data[0].price : lines.data[0].price?.id;
  if (!priceId) throw configurationError("Stripe Checkout Session line had no Price identifier.", "STRIPE_PRICE_ID_MISSING");
  return priceId;
}

async function markStripePaid(client, session, orderId, sessionPriceId) {
  if (!orderId) throw new Error("Stripe Checkout Session has no order reference.");
  let checkoutEmail = null;
  if (session.customer_details?.email) checkoutEmail = validateEmail(session.customer_details.email);
  const result = await client.query(
    `UPDATE assessment_orders
     SET payment_status=CASE
           WHEN payment_status IN ('refunded','disputed') THEN payment_status
           ELSE 'paid' END,
         report_status=CASE
           WHEN payment_status IN ('refunded','disputed') THEN report_status
           WHEN report_status IN ('not_queued','retry','failed') THEN 'queued'
           ELSE report_status END,
         next_report_attempt_at=CASE
           WHEN payment_status IN ('refunded','disputed') THEN next_report_attempt_at
           ELSE NOW() END,
         stripe_payment_intent_id=COALESCE($3,stripe_payment_intent_id),
         amount_total=COALESCE($4,amount_total), currency=COALESCE($5,currency),
         email=COALESCE($6,email),
         paid_at=COALESCE(paid_at,NOW()), updated_at=NOW(),
         error_message=CASE WHEN payment_status IN ('refunded','disputed') THEN error_message ELSE NULL END
     WHERE id=$1 AND stripe_checkout_session_id=$2
       AND package_code=$7 AND stripe_price_id=$8
       AND expected_amount=$4 AND expected_currency=UPPER($5)
     RETURNING id`,
    [orderId, session.id, typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id || null, session.amount_total || null, session.currency || null, checkoutEmail, session.metadata?.cogniva_package_code || null, sessionPriceId]
  );
  if (result.rowCount !== 1) throw new Error("Stripe order reference did not match a local order.");
}

function stripeObjectReference(object, orderId = null) {
  return {
    paymentIntentId: typeof object.payment_intent === "string"
      ? object.payment_intent
      : object.payment_intent?.id || null,
    chargeId: typeof object.charge === "string" ? object.charge : object.charge?.id || null,
    orderId: orderId || object.metadata?.order_id || null
  };
}

function validOrderId(value) {
  const candidate = String(value || "");
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(candidate)
    ? candidate
    : null;
}

const COGNIVA_STRIPE_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
  "checkout.session.expired",
  "charge.succeeded",
  "charge.refunded",
  "charge.dispute.created"
]);

async function stripeEventOrderId(event) {
  const object = event.data?.object || {};
  const direct = object.metadata?.integration === "cogniva_compass_v1"
    ? validOrderId(object.metadata?.cogniva_order_id)
    : null;
  if (direct) return direct;
  if (event.type !== "charge.dispute.created") return null;
  const chargeId = typeof object.charge === "string" ? object.charge : object.charge?.id;
  if (!chargeId) return null;
  const charge = await stripeClient().charges.retrieve(chargeId);
  return charge.metadata?.integration === "cogniva_compass_v1"
    ? validOrderId(charge.metadata?.cogniva_order_id)
    : null;
}

function requireStripeMatch(result, eventType) {
  if (result.rowCount !== 1) {
    throw new Error(`Stripe ${eventType} did not match a local order; retry required.`);
  }
}

async function requireStripeSessionKnown(client, result, sessionId, eventType) {
  if (result.rowCount === 1) return;
  const existing = await client.query(
    `SELECT id FROM assessment_orders WHERE stripe_checkout_session_id=$1 LIMIT 1`,
    [sessionId]
  );
  if (existing.rowCount !== 1) requireStripeMatch(result, eventType);
}

export function constructStripeWebhook(rawBody, signature) {
  if (!config.stripeWebhookSecret) throw new Error("Stripe webhook verification is not configured.");
  return stripeClient().webhooks.constructEvent(rawBody, signature, config.stripeWebhookSecret);
}

export async function handleStripeEvent(event) {
  const cognivaOrderId = COGNIVA_STRIPE_EVENTS.has(event.type)
    ? await stripeEventOrderId(event)
    : null;
  const sessionPriceId = (
    cognivaOrderId && (
      (event.type === "checkout.session.completed" && event.data?.object?.payment_status !== "unpaid") ||
      event.type === "checkout.session.async_payment_succeeded"
    )
  ) ? await checkoutSessionPriceId(event.data?.object?.id) : null;
  return withTransaction(async (client) => {
    const object = event.data?.object || {};
    const providerCreatedAt = Number.isFinite(event.created) ? new Date(event.created * 1000) : null;
    const isNew = await recordProviderEvent(client, "stripe", event.id, event.type, object.id, providerCreatedAt);
    if (!isNew) return { duplicate: true };

    if (COGNIVA_STRIPE_EVENTS.has(event.type) && !cognivaOrderId) {
      await client.query(
        `UPDATE provider_webhook_events SET processed_at=NOW() WHERE provider='stripe' AND event_id=$1`,
        [event.id]
      );
      return { duplicate: false, ignored: true };
    }

    if (event.type === "checkout.session.completed" && object.payment_status !== "unpaid") {
      await markStripePaid(client, object, cognivaOrderId, sessionPriceId);
    } else if (event.type === "checkout.session.async_payment_succeeded") {
      await markStripePaid(client, object, cognivaOrderId, sessionPriceId);
    } else if (event.type === "checkout.session.async_payment_failed") {
      const result = await client.query(
        `UPDATE assessment_orders SET payment_status='failed', updated_at=NOW()
         WHERE stripe_checkout_session_id=$1
           AND payment_status IN ('pending','checkout_created','failed','expired')`,
        [object.id]
      );
      await requireStripeSessionKnown(client, result, object.id, event.type);
    } else if (event.type === "checkout.session.expired") {
      const result = await client.query(
        `UPDATE assessment_orders SET payment_status='expired', updated_at=NOW()
         WHERE stripe_checkout_session_id=$1
           AND payment_status IN ('pending','checkout_created','expired')`,
        [object.id]
      );
      await requireStripeSessionKnown(client, result, object.id, event.type);
    } else if (event.type === "charge.succeeded") {
      const reference = stripeObjectReference(object, cognivaOrderId);
      const result = await client.query(
        `UPDATE assessment_orders
         SET stripe_charge_id=COALESCE(stripe_charge_id,$1), updated_at=NOW()
         WHERE stripe_payment_intent_id=$2 OR id=$3`,
        [object.id, reference.paymentIntentId, reference.orderId]
      );
      requireStripeMatch(result, event.type);
    } else if (event.type === "charge.refunded") {
      const reference = stripeObjectReference(object, cognivaOrderId);
      const fullyRefunded = object.refunded === true || (
        Number.isInteger(object.amount) && Number.isInteger(object.amount_refunded) &&
        object.amount_refunded >= object.amount
      );
      const result = await client.query(
        `UPDATE assessment_orders
         SET payment_status=CASE WHEN $4 THEN 'refunded' ELSE payment_status END,
             amount_refunded=GREATEST(COALESCE(amount_refunded,0),COALESCE($5,0)),
             refunded_at=CASE WHEN $4 THEN COALESCE(refunded_at,NOW()) ELSE refunded_at END,
             updated_at=NOW()
         WHERE stripe_payment_intent_id=$1 OR stripe_charge_id=$2 OR id=$3`,
        [reference.paymentIntentId, object.id, reference.orderId, fullyRefunded, object.amount_refunded || 0]
      );
      requireStripeMatch(result, event.type);
    } else if (event.type === "charge.dispute.created") {
      const reference = stripeObjectReference(object, cognivaOrderId);
      const result = await client.query(
        `UPDATE assessment_orders SET payment_status='disputed', disputed_at=NOW(), updated_at=NOW()
         WHERE stripe_payment_intent_id=$1 OR stripe_charge_id=$2 OR id=$3`,
        [reference.paymentIntentId, reference.chargeId, reference.orderId]
      );
      requireStripeMatch(result, event.type);
    }

    await client.query(
      `UPDATE provider_webhook_events SET processed_at=NOW() WHERE provider='stripe' AND event_id=$1`,
      [event.id]
    );
    return { duplicate: false };
  });
}

const RESEND_STATUS_MAP = Object.freeze({
  "email.sent": "sent",
  "email.delivered": "delivered",
  "email.delivery_delayed": "delayed",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.failed": "failed",
  "email.suppressed": "suppressed"
});

export async function applyResendDeliveryState(client, emailId, eventType, providerCreatedAt = null, orderId = null) {
  const deliveryStatus = RESEND_STATUS_MAP[eventType];
  if (!deliveryStatus || !emailId) return 0;
  const result = await client.query(
    `UPDATE assessment_orders
     SET delivery_status=CASE
           WHEN $4 IS NOT NULL AND (email_last_event_at IS NULL OR $4 >= email_last_event_at) THEN $2
           WHEN $4 IS NOT NULL AND email_last_event_at IS NOT NULL THEN delivery_status
           WHEN $2='complained' OR delivery_status='complained' THEN 'complained'
           WHEN $2 IN ('bounced','suppressed','failed') THEN $2
           WHEN delivery_status IN ('bounced','suppressed','failed') THEN delivery_status
           WHEN delivery_status='delivered' OR $2='delivered' THEN 'delivered'
           WHEN delivery_status='delayed' OR $2='delayed' THEN 'delayed'
           ELSE $2 END,
         email_last_event=CASE
           WHEN email_last_event_at IS NULL OR $4 IS NULL OR $4 >= email_last_event_at THEN $3
           ELSE email_last_event END,
         email_last_event_at=CASE
           WHEN email_last_event_at IS NULL THEN $4
           WHEN $4 IS NULL THEN email_last_event_at
           ELSE GREATEST(email_last_event_at,$4) END,
         email_delivered_at=CASE
           WHEN $2='delivered' AND (
             ($4 IS NOT NULL AND (email_last_event_at IS NULL OR $4 >= email_last_event_at))
             OR ($4 IS NULL AND delivery_status NOT IN ('complained','bounced','suppressed','failed'))
           ) THEN COALESCE(email_delivered_at,$4,NOW())
           ELSE email_delivered_at END,
         updated_at=NOW()
     WHERE ($5::uuid IS NOT NULL AND id=$5::uuid)
        OR ($5::uuid IS NULL AND email_provider_id=$1)`,
    [emailId, deliveryStatus, eventType, providerCreatedAt, orderId]
  );
  return result.rowCount;
}

async function reconcileResendEvents(client, emailId) {
  if (!emailId) return;
  const pending = await client.query(
    `SELECT event_id,event_type,provider_created_at FROM provider_webhook_events
     WHERE provider='resend' AND object_id=$1 AND processed_at IS NULL
     ORDER BY received_at ASC`,
    [emailId]
  );
  for (const event of pending.rows) {
    const matched = await applyResendDeliveryState(client, emailId, event.event_type, event.provider_created_at);
    if (matched === 1 || !RESEND_STATUS_MAP[event.event_type]) {
      await client.query(
        `UPDATE provider_webhook_events SET processed_at=NOW()
         WHERE provider='resend' AND event_id=$1`,
        [event.event_id]
      );
    }
  }
}

async function reconcilePendingResendEvents() {
  return withTransaction(async (client) => {
    const pending = await client.query(
      `SELECT events.event_id,events.event_type,events.object_id,events.provider_created_at
       FROM provider_webhook_events AS events
       JOIN assessment_orders AS orders ON orders.email_provider_id=events.object_id
       WHERE events.provider='resend' AND events.processed_at IS NULL
       ORDER BY events.received_at ASC
       LIMIT 250`
    );
    for (const event of pending.rows) {
      const matched = await applyResendDeliveryState(
        client,
        event.object_id,
        event.event_type,
        event.provider_created_at
      );
      if (matched === 1 || !RESEND_STATUS_MAP[event.event_type]) {
        await client.query(
          `UPDATE provider_webhook_events SET processed_at=NOW()
           WHERE provider='resend' AND event_id=$1`,
          [event.event_id]
        );
      }
    }
  });
}

export async function handleResendEvent(rawPayload, headers) {
  if (!config.resendApiKey || !config.resendWebhookSecret) {
    throw configurationError("Resend webhook verification is not configured.", "RESEND_WEBHOOK_NOT_CONFIGURED");
  }
  let event;
  try {
    event = verifyResendWebhook(rawPayload, headers);
  } catch {
    throw new ResendWebhookRequestError("Invalid Resend webhook signature or payload.", "INVALID_RESEND_WEBHOOK");
  }
  const eventId = headers["svix-id"];
  const emailId = event?.data?.email_id || event?.data?.email?.id || null;
  if (typeof eventId !== "string" || !eventId.trim() || eventId.length > 255 || typeof event?.type !== "string" || !event.type) {
    throw new ResendWebhookRequestError("Invalid Resend webhook event.", "INVALID_RESEND_EVENT");
  }
  if (RESEND_STATUS_MAP[event.type] && (typeof emailId !== "string" || !emailId.trim())) {
    throw new ResendWebhookRequestError("Resend delivery event has no email identifier.", "INVALID_RESEND_EMAIL_ID");
  }
  const createdValue = event.created_at || event?.data?.created_at;
  const parsedCreatedAt = createdValue ? new Date(createdValue) : null;
  if (createdValue && (!parsedCreatedAt || !Number.isFinite(parsedCreatedAt.getTime()))) {
    throw new ResendWebhookRequestError("Resend delivery event has an invalid timestamp.", "INVALID_RESEND_TIMESTAMP");
  }
  const providerCreatedAt = parsedCreatedAt || null;
  const tags = event?.data?.tags && typeof event.data.tags === "object" && !Array.isArray(event.data.tags)
    ? event.data.tags
    : {};
  const taggedOrderId = tags.integration === "cogniva_compass_v1"
    ? validOrderId(tags.cogniva_order_id)
    : null;

  return withTransaction(async (client) => {
    const isNew = await recordProviderEvent(client, "resend", eventId, event.type, emailId, providerCreatedAt);
    if (taggedOrderId && emailId) {
      await client.query(
        `UPDATE assessment_orders
         SET email_provider_id=COALESCE(email_provider_id,$2),
             report_status=CASE
               WHEN report_content IS NOT NULL AND report_status IN ('processing','retry') THEN 'generated'
               ELSE report_status END,
             email_sent_at=COALESCE(email_sent_at,NOW()), updated_at=NOW()
         WHERE id=$1 AND (email_provider_id IS NULL OR email_provider_id=$2 OR report_status='generated')`,
        [taggedOrderId, emailId]
      );
    }
    const matched = await applyResendDeliveryState(
      client,
      emailId,
      event.type,
      providerCreatedAt,
      taggedOrderId
    );
    if (matched === 1 || !RESEND_STATUS_MAP[event.type]) {
      await client.query(
        `UPDATE provider_webhook_events SET processed_at=NOW() WHERE provider='resend' AND event_id=$1`,
        [eventId]
      );
    }
    return { duplicate: !isNew, pendingReconciliation: matched === 0 && Boolean(RESEND_STATUS_MAP[event.type]) };
  });
}

async function recoverStaleJobs() {
  await database().query(
    `UPDATE assessment_orders
     SET report_status='retry', delivery_status=CASE WHEN delivery_status='sending' THEN 'failed' ELSE delivery_status END,
         next_report_attempt_at=NOW(), updated_at=NOW()
     WHERE report_status='processing' AND report_last_attempt_at < NOW() - INTERVAL '15 minutes'`
  );
}

async function claimReportJob() {
  return withTransaction(async (client) => {
    const result = await client.query(
      `WITH candidate AS (
         SELECT id FROM assessment_orders
         WHERE payment_status='paid'
           AND report_status IN ('queued','retry')
           AND personal_data_expires_at > NOW()
           AND report_attempts < $1
           AND (next_report_attempt_at IS NULL OR next_report_attempt_at <= NOW())
         ORDER BY paid_at ASC
         FOR UPDATE SKIP LOCKED
         LIMIT 1
       )
       UPDATE assessment_orders AS orders
       SET report_status='processing', delivery_status='sending',
           report_attempts=report_attempts+1, report_last_attempt_at=NOW(), updated_at=NOW()
       FROM candidate
       WHERE orders.id=candidate.id
       RETURNING orders.*`,
      [config.maxReportAttempts]
    );
    const order = result.rows[0] || null;
    if (!order) return null;
    const assessments = await client.query(
      `SELECT track,form_id,bank_version,scoring_version,scores,overall
       FROM assessment_order_assessments
       WHERE order_id=$1
       ORDER BY CASE track WHEN 'cognitive' THEN 1 ELSE 2 END`,
      [order.id]
    );
    order.assessments = assessments.rows.length ? assessments.rows : [{
      track: order.track,
      form_id: order.form_id,
      bank_version: order.bank_version,
      scoring_version: order.scoring_version,
      scores: order.scores,
      overall: order.overall
    }];
    return order;
  });
}

function reportAlreadyGenerated(order) {
  if (!order.report_content || !order.report_source || !order.report_version) return null;
  return Object.freeze({
    content: order.report_content,
    source: order.report_source,
    version: order.report_version
  });
}

async function persistGeneratedReport(order, report) {
  const result = await database().query(
    `UPDATE assessment_orders
     SET report_content=$2::jsonb, report_source=$3, report_version=$4,
         report_generated_at=COALESCE(report_generated_at,NOW()),
         delivery_status='sending', updated_at=NOW()
     WHERE id=$1 AND report_status='processing' AND personal_data_expires_at > NOW()
     RETURNING id`,
    [order.id, JSON.stringify(report.content), report.source, report.version]
  );
  if (result.rowCount !== 1) {
    const error = new Error("The report expired or changed state before it could be persisted.");
    error.nonRetryable = true;
    throw error;
  }
}

async function completeReportJob(order, emailResult) {
  await withTransaction(async (client) => {
    const result = await client.query(
      `UPDATE assessment_orders
       SET report_status='generated',
           delivery_status=CASE
             WHEN email_last_event_at IS NOT NULL
               AND delivery_status IN ('delivered','delayed','bounced','complained','failed','suppressed')
               THEN delivery_status
             ELSE 'sent' END,
           email_provider_id=COALESCE(email_provider_id,$2),
           email_sent_at=COALESCE(email_sent_at,NOW()),
           email_last_event=COALESCE(email_last_event,'email.api_accepted'),
           error_message=NULL, updated_at=NOW()
       WHERE id=$1 AND (
         report_status='processing'
         OR (report_status='generated' AND email_provider_id=$2)
       )
       RETURNING id`,
      [order.id, emailResult.id]
    );
    if (result.rowCount !== 1) throw new Error("The paid report order changed state before delivery completed.");
    await reconcileResendEvents(client, emailResult.id);
  });
}

async function failReportJob(order, error) {
  const exhausted = error?.nonRetryable === true || order.report_attempts >= config.maxReportAttempts;
  const delayMinutes = Math.min(360, 2 ** Math.max(1, order.report_attempts));
  await database().query(
    `UPDATE assessment_orders
     SET report_status=$2,
         delivery_status=CASE WHEN $2='retry' THEN 'sending' ELSE 'failed' END,
         next_report_attempt_at=CASE WHEN $2='retry' THEN NOW() + ($3 * INTERVAL '1 minute') ELSE NULL END,
         error_message=$4, updated_at=NOW()
     WHERE id=$1 AND report_status<>'generated'`,
    [order.id, exhausted ? "failed" : "retry", delayMinutes, `Report pipeline error (${safeErrorLabel(error, "REPORT_ERROR")})`]
  );
}

async function processNextReport() {
  // Already-paid orders must not stop fulfilling merely because checkout or the
  // current legal-document configuration is being rotated. Pause without
  // consuming an attempt only when the database/email delivery path is absent.
  const deliveryReady = Boolean(config.databaseUrl && config.resendApiKey && config.emailFrom);
  if (workerBusy || !deliveryReady) return;
  workerBusy = true;
  try {
    const order = await claimReportJob();
    if (!order) return;
    try {
      let report = reportAlreadyGenerated(order);
      if (!report) {
        report = await buildPersonalReport(order);
        await persistGeneratedReport(order, report);
      }
      const current = await database().query(
        `SELECT payment_status,report_status,personal_data_expires_at FROM assessment_orders WHERE id=$1`,
        [order.id]
      );
      const currentOrder = current.rows[0];
      const expired = !currentOrder?.personal_data_expires_at || new Date(currentOrder.personal_data_expires_at).getTime() <= Date.now();
      if (currentOrder?.payment_status !== "paid" || currentOrder?.report_status !== "processing" || expired) {
        const stateError = new Error("The order is no longer eligible for report delivery.");
        stateError.nonRetryable = true;
        throw stateError;
      }
      const emailResult = await sendReportEmail(order, report);
      await completeReportJob(order, emailResult);
    } catch (error) {
      console.error("[report-worker] report job failed", { orderId: order.id, code: safeErrorLabel(error, "REPORT_ERROR") });
      await failReportJob(order, error);
    }
  } finally {
    workerBusy = false;
  }
}

export async function purgeExpiredPersonalData() {
  if (!config.databaseUrl) return;
  return withTransaction(async (client) => {
    const expiredJobs = await client.query(
      `UPDATE assessment_orders
       SET report_status='failed',
           delivery_status=CASE
             WHEN delivery_status IN ('delivered','bounced','complained','suppressed') THEN delivery_status
             ELSE 'failed' END,
           next_report_attempt_at=NULL,
           error_message='Report pipeline stopped because the configured retention period expired.',
           updated_at=NOW()
       WHERE personal_data_expires_at < NOW()
         AND report_status = ANY($1::text[])
       RETURNING id`,
      [EXPIRABLE_REPORT_STATUSES]
    );
    const redactedAssessments = await client.query(
      `UPDATE assessment_order_assessments AS assessments
       SET scores='{}'::jsonb, overall=0
       WHERE assessments.order_id IN (
         SELECT id FROM assessment_orders
         WHERE personal_data_expires_at < NOW()
           AND personal_data_redacted_at IS NULL
           AND (
             report_status = ANY($1::text[])
             OR (report_status='not_queued' AND payment_status = ANY($2::text[]))
           )
       )
       RETURNING order_id`,
      [TERMINAL_REPORT_STATUSES, TERMINAL_UNQUEUED_PAYMENT_STATUSES]
    );
    const redactedOrders = await client.query(
      `UPDATE assessment_orders
       SET email='redacted+' || id::text || '@invalid.local', scores='{}'::jsonb,
           overall=0, report_content=NULL, error_message=NULL,
           personal_data_redacted_at=NOW(), updated_at=NOW()
       WHERE personal_data_expires_at < NOW()
         AND personal_data_redacted_at IS NULL
         AND (
           report_status = ANY($1::text[])
           OR (report_status='not_queued' AND payment_status = ANY($2::text[]))
         )
       RETURNING id`,
      [TERMINAL_REPORT_STATUSES, TERMINAL_UNQUEUED_PAYMENT_STATUSES]
    );
    const deletedOrders = await client.query(
      `DELETE FROM assessment_orders
       WHERE payment_status IN ('pending','checkout_created','failed','expired')
         AND created_at < NOW() - INTERVAL '2 days'
       RETURNING id`
    );
    const deletedProviderEvents = await client.query(
      `DELETE FROM provider_webhook_events
       WHERE received_at < NOW() - INTERVAL '90 days'
       RETURNING event_id`
    );
    return Object.freeze({
      expiredJobs: expiredJobs.rowCount,
      redactedAssessments: redactedAssessments.rowCount,
      redactedOrders: redactedOrders.rowCount,
      deletedOrders: deletedOrders.rowCount,
      deletedProviderEvents: deletedProviderEvents.rowCount
    });
  });
}

export async function startCommerceWorkers() {
  if (!config.databaseUrl || workerTimer) return;
  await recoverStaleJobs();
  await purgeExpiredPersonalData();
  await reconcilePendingResendEvents();
  maintenanceTimer = setInterval(() => {
    Promise.all([recoverStaleJobs(), reconcilePendingResendEvents()])
      .catch((error) => console.error("[commerce-maintenance] cycle failed", { code: error?.code || error?.name || "UNKNOWN" }));
  }, MAINTENANCE_INTERVAL_MS);
  maintenanceTimer.unref?.();
  purgeTimer = setInterval(() => {
    purgeExpiredPersonalData()
      .catch((error) => console.error("[commerce-purge] cycle failed", { code: error?.code || error?.name || "UNKNOWN" }));
  }, PURGE_INTERVAL_MS);
  purgeTimer.unref?.();
  workerTimer = setInterval(() => {
    processNextReport().catch((error) => console.error("[report-worker] loop error", { code: error?.code || error?.name || "UNKNOWN" }));
  }, config.reportWorkerIntervalMs);
  workerTimer.unref?.();
  processNextReport().catch((error) => console.error("[report-worker] startup error", { code: error?.code || error?.name || "UNKNOWN" }));
}

export function stopCommerceWorkers() {
  if (workerTimer) clearInterval(workerTimer);
  if (maintenanceTimer) clearInterval(maintenanceTimer);
  if (purgeTimer) clearInterval(purgeTimer);
  workerTimer = null;
  maintenanceTimer = null;
  purgeTimer = null;
}

export async function publicCommerceConfig() {
  const commerce = commerceReadiness();
  const ai = aiReadiness();
  const products = [];
  let commerceReady = commerce.ready;
  if (commerceReady) {
    try {
      for (const code of PRODUCT_CODES) products.push(await validatedStripeProductPrice(code));
    } catch (error) {
      commerceReady = false;
      products.length = 0;
    }
  }
  return Object.freeze({
    commerceReady,
    products: Object.freeze(products.map((product) => Object.freeze({
      code: product.productCode,
      priceLabel: priceLabel(product),
      amount: product.amount,
      currency: product.currency,
      taxBehavior: product.taxBehavior,
      assessmentCount: product.assessmentCount,
      requiredTracks: product.requiredTracks
    }))),
    aiReportAvailable: commerceReady && ai.ready,
    policyVersion: config.policyVersion,
    privacyUrl: config.privacyUrl || null,
    termsUrl: config.termsUrl || null,
    contactUrl: config.contactUrl || null
  });
}
