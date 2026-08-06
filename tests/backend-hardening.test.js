import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  applyResendDeliveryState,
  checkoutPublicResponse,
  ResendWebhookRequestError,
  resendWebhookHttpStatus,
  retentionCanRedact
} from "../src/commerce.js";
import { validateGeneratedReport } from "../src/report.js";

test("checkout response never exposes the raw order access token", () => {
  const response = checkoutPublicResponse(
    "00000000-0000-4000-8000-000000000001",
    "https://checkout.stripe.com/example"
  );
  assert.deepEqual(Object.keys(response).sort(), ["checkoutUrl", "orderId"]);
  assert.equal("orderToken" in response, false);
  assert.equal(Object.isFrozen(response), true);
  const commerce = fs.readFileSync(new URL("../src/commerce.js", import.meta.url), "utf8");
  assert.match(commerce, /currency: validatedPrice\.currency\.toLowerCase\(\)/);
  assert.match(commerce, /adaptive_pricing: \{ enabled: false \}/);
});

test("retention redaction permits only terminal report states", () => {
  for (const reportStatus of ["generated", "failed"]) {
    assert.equal(retentionCanRedact("paid", reportStatus), true);
  }
  for (const paymentStatus of ["failed", "expired", "refunded", "disputed"]) {
    assert.equal(retentionCanRedact(paymentStatus, "not_queued"), true);
  }
  for (const reportStatus of ["queued", "processing", "retry"]) {
    assert.equal(retentionCanRedact("paid", reportStatus), false);
  }
  for (const paymentStatus of ["pending", "checkout_created", "paid"]) {
    assert.equal(retentionCanRedact(paymentStatus, "not_queued"), false);
  }
});

test("retention migration and SQL preserve active jobs until terminal", () => {
  const migration = fs.readFileSync(new URL("../src/db/migrations/001_commerce.sql", import.meta.url), "utf8");
  const commerce = fs.readFileSync(new URL("../src/commerce.js", import.meta.url), "utf8");
  assert.match(migration, /personal_data_redacted_at TIMESTAMPTZ/);
  assert.match(commerce, /report_status = ANY\(\$1::text\[\]\)/);
  assert.match(commerce, /personal_data_redacted_at IS NULL/);
  assert.match(commerce, /personal_data_expires_at > NOW\(\)/);
});

test("Resend request errors are 4xx while operational errors remain retryable 5xx", () => {
  const requestError = new ResendWebhookRequestError("invalid", "INVALID_RESEND_WEBHOOK");
  assert.equal(resendWebhookHttpStatus(requestError), 400);
  assert.equal(resendWebhookHttpStatus(new Error("database unavailable")), 500);
  const server = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");
  assert.match(server, /const status = resendWebhookHttpStatus\(error\)/);
  assert.match(server, /res\.status\(status\)\.json\(\{ received: false \}\)/);
});

test("public legal readiness includes durable receipt storage", () => {
  const server = fs.readFileSync(new URL("../src/server.js", import.meta.url), "utf8");
  assert.match(server, /legalReady:\s*legal\.legalReady\s*&&\s*hasDatabase\(\)/);
  assert.match(server, /legalStorageReady:\s*hasDatabase\(\)/);
});

test("legacy price label and implicit OpenAI model defaults are absent from runtime configuration", () => {
  const config = fs.readFileSync(new URL("../src/config.js", import.meta.url), "utf8");
  assert.doesNotMatch(config, /REPORT_PRICE_LABEL|reportPriceLabel/);
  assert.doesNotMatch(config, /gpt-5-mini/);
  assert.match(config, /Boolean\(config\.openAiModel\)/);
});

test("optional OpenAI wording receives only a relative, non-numeric profile", () => {
  const report = fs.readFileSync(new URL("../src/report.js", import.meta.url), "utf8");
  const safeInput = report.slice(report.indexOf("const safeInput ="), report.indexOf("const response =", report.indexOf("const safeInput =")));
  assert.match(safeInput, /relativePattern/);
  assert.match(safeInput, /mostVisibleDomains/);
  assert.doesNotMatch(safeInput, /overallTaskPattern|responsePattern/);
  assert.match(report, /store:\s*false/);
  assert.match(report, /Do not state, change or recompute numeric scores, percentages, bands or thresholds/);
  assert.match(report, /\\d\+\(\?:\[\.,\]\\d\+\)\?\\s\*\(\?:%\|\\\/\\s\*100\)/);
});

test("AI wording validation rejects numeric and multilingual diagnostic claims", () => {
  const safe = {
    summary: "This short reflection suggests possibilities to notice in everyday situations.",
    observations: ["One area seemed more visible in this sample.", "Context and energy may influence the pattern."],
    experiments: ["Pause before one routine response this week.", "Try a similar task after resting.", "Write down one counterexample to the pattern."],
    questions: ["What felt natural today?", "What changed with context?", "What would you like to try next?"]
  };
  assert.doesNotThrow(() => validateGeneratedReport(safe));
  for (const unsafeSummary of [
    "Your result is 88% and therefore confirms a stable ability.",
    "Diese Diagnose beschreibt Ihre Fähigkeit eindeutig.",
    "该结果构成诊断并说明一种稳定能力，因此可以用于重要的人生决定。"
  ]) {
    assert.throws(
      () => validateGeneratedReport({ ...safe, summary: unsafeSummary }),
      /prohibited interpretation boundary/i
    );
  }
});

test("an older delivered event cannot stamp email_delivered_at", async () => {
  let captured = null;
  const client = {
    async query(text, params) {
      captured = { text, params };
      return { rowCount: 1 };
    }
  };
  const providerCreatedAt = new Date("2026-07-26T10:00:00.000Z");
  const matched = await applyResendDeliveryState(
    client,
    "email_123",
    "email.delivered",
    providerCreatedAt
  );
  assert.equal(matched, 1);
  assert.deepEqual(captured.params, ["email_123", "delivered", "email.delivered", providerCreatedAt, null]);
  assert.match(
    captured.text,
    /WHEN \$2='delivered' AND \([\s\S]*\$4 >= email_last_event_at[\s\S]*\) THEN COALESCE\(email_delivered_at,\$4,NOW\(\)\)/
  );
});
