const LANGUAGES = Object.freeze([
  "hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"
]);

function clean(value, fallback = "") {
  const text = String(value ?? "").trim();
  return text || fallback;
}

function boolean(value, fallback = false) {
  if (value === undefined || value === null || value === "") return fallback;
  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
}

function integer(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function publicUrl(value, fallback = "") {
  const candidate = clean(value, fallback).replace(/\/+$/, "");
  if (!candidate) return "";
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.hostname === "localhost" ? url.toString().replace(/\/+$/, "") : "";
  } catch {
    return "";
  }
}

export const config = Object.freeze({
  languages: LANGUAGES,
  port: integer(process.env.PORT, 3000, 1, 65535),
  databaseUrl: clean(process.env.DATABASE_URL),
  databaseSsl: boolean(process.env.DATABASE_SSL),
  appBaseUrl: publicUrl(process.env.APP_BASE_URL, "https://cogniva-compass.webflow.io"),
  serviceBaseUrl: publicUrl(
    process.env.SERVICE_BASE_URL,
    "https://cogniva-compass-production.up.railway.app"
  ),
  stripeSecretKey: clean(process.env.STRIPE_SECRET_KEY),
  stripeWebhookSecret: clean(process.env.STRIPE_WEBHOOK_SECRET),
  stripeSinglePriceId: clean(process.env.STRIPE_SINGLE_PRICE_ID, process.env.STRIPE_PRICE_ID),
  stripeBundlePriceId: clean(process.env.STRIPE_BUNDLE_PRICE_ID),
  stripeAutomaticTax: boolean(process.env.STRIPE_AUTOMATIC_TAX),
  stripeInvoiceCreation: boolean(process.env.STRIPE_INVOICE_CREATION),
  resendApiKey: clean(process.env.RESEND_API_KEY),
  resendWebhookSecret: clean(process.env.RESEND_WEBHOOK_SECRET),
  emailFrom: clean(process.env.EMAIL_FROM),
  emailReplyTo: clean(process.env.EMAIL_REPLY_TO),
  openAiApiKey: clean(process.env.OPENAI_API_KEY),
  openAiEnabled: boolean(process.env.OPENAI_REPORT_ENABLED),
  openAiModel: clean(process.env.OPENAI_REPORT_MODEL),
  privacyUrl: publicUrl(process.env.PRIVACY_URL),
  termsUrl: publicUrl(process.env.TERMS_URL),
  contactUrl: publicUrl(process.env.CONTACT_URL),
  policyVersion: clean(process.env.POLICY_VERSION, "2026-07-26-draft"),
  privacyVersion: clean(process.env.PRIVACY_VERSION, "2026-07-31-draft"),
  termsVersion: clean(process.env.TERMS_VERSION, "2026-07-31-draft"),
  legalContentVersion: clean(process.env.LEGAL_CONTENT_VERSION, "2026-07-31-draft-v1"),
  privacyDocumentSha256: clean(process.env.PRIVACY_DOCUMENT_SHA256).toLowerCase(),
  termsDocumentSha256: clean(process.env.TERMS_DOCUMENT_SHA256).toLowerCase(),
  legalConsentSecret: clean(process.env.LEGAL_CONSENT_SECRET),
  controller: Object.freeze({
    legalName: clean(process.env.CONTROLLER_LEGAL_NAME),
    registeredAddress: clean(process.env.REGISTERED_ADDRESS),
    country: clean(process.env.CONTROLLER_COUNTRY),
    registrationNumber: clean(process.env.REGISTRATION_NO),
    taxNumber: clean(process.env.TAX_NO),
    privacyEmail: clean(process.env.PRIVACY_EMAIL),
    supportEmail: clean(process.env.SUPPORT_EMAIL),
    dpoEmail: clean(process.env.DPO_EMAIL),
    supervisoryAuthorityName: clean(process.env.SUPERVISORY_AUTHORITY_NAME),
    supervisoryAuthorityUrl: publicUrl(process.env.SUPERVISORY_AUTHORITY_URL)
  }),
  adminIntegration: Object.freeze({
    keyId: clean(process.env.COGNIVA_ADMIN_INTEGRATION_KEY_ID),
    secret: clean(process.env.COGNIVA_ADMIN_INTEGRATION_SECRET),
    clockSkewSeconds: integer(process.env.COGNIVA_ADMIN_CLOCK_SKEW_SECONDS, 60, 30, 300)
  }),
  reportRetentionDays: integer(process.env.REPORT_RETENTION_DAYS, 30, 1, 365),
  maxReportAttempts: integer(process.env.MAX_REPORT_ATTEMPTS, 5, 1, 12),
  reportWorkerIntervalMs: integer(process.env.REPORT_WORKER_INTERVAL_MS, 5000, 1000, 60000)
});

export function legalReadiness() {
  const missing = [];
  if (!config.privacyUrl) missing.push("PRIVACY_URL");
  if (!config.termsUrl) missing.push("TERMS_URL");
  if (!config.contactUrl) missing.push("CONTACT_URL");
  if (!config.legalConsentSecret || config.legalConsentSecret.length < 32) missing.push("LEGAL_CONSENT_SECRET");
  if (!config.controller.legalName) missing.push("CONTROLLER_LEGAL_NAME");
  if (!config.controller.registeredAddress) missing.push("REGISTERED_ADDRESS");
  if (!config.controller.country) missing.push("CONTROLLER_COUNTRY");
  if (!config.controller.privacyEmail) missing.push("PRIVACY_EMAIL");
  if (!config.controller.supportEmail) missing.push("SUPPORT_EMAIL");
  if (!config.controller.supervisoryAuthorityName) missing.push("SUPERVISORY_AUTHORITY_NAME");
  if (!config.controller.supervisoryAuthorityUrl) missing.push("SUPERVISORY_AUTHORITY_URL");
  if (!config.policyVersion || /draft/i.test(config.policyVersion)) missing.push("POLICY_VERSION");
  if (!config.privacyVersion || /draft/i.test(config.privacyVersion)) missing.push("PRIVACY_VERSION");
  if (!config.termsVersion || /draft/i.test(config.termsVersion)) missing.push("TERMS_VERSION");
  if (!config.legalContentVersion || /draft/i.test(config.legalContentVersion)) missing.push("LEGAL_CONTENT_VERSION");
  if (!/^[a-f0-9]{64}$/.test(config.privacyDocumentSha256)) missing.push("PRIVACY_DOCUMENT_SHA256");
  if (!/^[a-f0-9]{64}$/.test(config.termsDocumentSha256)) missing.push("TERMS_DOCUMENT_SHA256");
  return Object.freeze({ ready: missing.length === 0, missing: Object.freeze(missing) });
}

export function commerceReadiness() {
  const missing = [];
  if (!config.databaseUrl) missing.push("DATABASE_URL");
  if (!config.stripeSecretKey) missing.push("STRIPE_SECRET_KEY");
  if (!config.stripeWebhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!config.stripeSinglePriceId) missing.push("STRIPE_SINGLE_PRICE_ID");
  if (!config.stripeBundlePriceId) missing.push("STRIPE_BUNDLE_PRICE_ID");
  if (!config.resendApiKey) missing.push("RESEND_API_KEY");
  if (!config.resendWebhookSecret) missing.push("RESEND_WEBHOOK_SECRET");
  if (!config.emailFrom) missing.push("EMAIL_FROM");
  missing.push(...legalReadiness().missing);
  return Object.freeze({ ready: missing.length === 0, missing: Object.freeze(missing) });
}

export function aiReadiness() {
  return Object.freeze({
    enabled: config.openAiEnabled,
    ready: config.openAiEnabled && Boolean(config.openAiApiKey) && Boolean(config.openAiModel),
    model: config.openAiEnabled && config.openAiApiKey && config.openAiModel ? config.openAiModel : null
  });
}

export function isSupportedLanguage(value) {
  return config.languages.includes(String(value || "").toLowerCase());
}
