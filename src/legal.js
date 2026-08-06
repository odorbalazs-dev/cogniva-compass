import crypto from "node:crypto";
import { config, isSupportedLanguage, legalReadiness } from "./config.js";
import { AssessmentPayloadError } from "./assessment.js";

const RECEIPT_VERSION = "cogniva-preassessment-consent-v1";
const RECEIPT_TTL_MS = 24 * 60 * 60 * 1000;

function encode(value) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function decode(value) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function signature(value) {
  return crypto.createHmac("sha256", config.legalConsentSecret).update(value).digest("base64url");
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function requireLegalReady() {
  const readiness = legalReadiness();
  if (readiness.ready) return;
  const error = new Error("Legal information is not ready for assessment use.");
  error.status = 503;
  error.code = "LEGAL_NOT_READY";
  throw error;
}

function currentDocuments() {
  return Object.freeze({
    policyVersion: config.policyVersion,
    privacyVersion: config.privacyVersion,
    privacySha256: config.privacyDocumentSha256,
    termsVersion: config.termsVersion,
    termsSha256: config.termsDocumentSha256
  });
}

export function publicLegalConfig() {
  const readiness = legalReadiness();
  return Object.freeze({
    legalReady: readiness.ready,
    legalContentVersion: config.legalContentVersion,
    policyVersion: config.policyVersion,
    privacyVersion: config.privacyVersion,
    termsVersion: config.termsVersion,
    privacyDocumentSha256: readiness.ready ? config.privacyDocumentSha256 : null,
    termsDocumentSha256: readiness.ready ? config.termsDocumentSha256 : null,
    privacyUrl: config.privacyUrl || null,
    termsUrl: config.termsUrl || null,
    contactUrl: config.contactUrl || null,
    controller: readiness.ready ? Object.freeze({
      legalName: config.controller.legalName,
      registeredAddress: config.controller.registeredAddress,
      country: config.controller.country,
      registrationNumber: config.controller.registrationNumber || null,
      taxNumber: config.controller.taxNumber || null,
      privacyEmail: config.controller.privacyEmail,
      supportEmail: config.controller.supportEmail,
      dpoEmail: config.controller.dpoEmail || null,
      supervisoryAuthorityName: config.controller.supervisoryAuthorityName,
      supervisoryAuthorityUrl: config.controller.supervisoryAuthorityUrl
    }) : null
  });
}

export function createPreassessmentConsent(payload = {}) {
  requireLegalReady();
  const locale = String(payload.locale || "").toLowerCase();
  if (!isSupportedLanguage(locale)) throw new AssessmentPayloadError("Unsupported consent language.");
  if (payload.contentVersion !== config.legalContentVersion) {
    throw new AssessmentPayloadError("The localized legal information changed. Please review it again.");
  }
  if (payload.adultConfirmed !== true) throw new AssessmentPayloadError("Adult-use confirmation is required.");
  if (payload.ownResponsesConfirmed !== true) {
    throw new AssessmentPayloadError("Confirmation that the answers describe the adult respondent is required.");
  }
  if (payload.termsAccepted !== true) throw new AssessmentPayloadError("Terms acceptance is required.");
  if (payload.nonDiagnosticAccepted !== true) throw new AssessmentPayloadError("The non-diagnostic boundary must be acknowledged.");
  if (payload.privacyAcknowledged !== true) throw new AssessmentPayloadError("Privacy acknowledgement is required.");
  if (payload.specialCategoryConsent !== true) {
    throw new AssessmentPayloadError("Explicit consent for potentially sensitive reflection data is required.");
  }
  if (payload.analyticsConsent !== true && payload.analyticsConsent !== false) {
    throw new AssessmentPayloadError("Analytics preference must be explicitly selected.");
  }

  const acceptedAt = new Date();
  const record = {
    schemaVersion: RECEIPT_VERSION,
    nonce: crypto.randomUUID(),
    locale,
    contentVersion: config.legalContentVersion,
    scope: "adult_self_reflection",
    adultConfirmed: true,
    ownResponsesConfirmed: true,
    termsAccepted: true,
    nonDiagnosticAccepted: true,
    privacyAcknowledged: true,
    specialCategoryConsent: true,
    analyticsConsent: payload.analyticsConsent,
    documents: currentDocuments(),
    acceptedAt: acceptedAt.toISOString(),
    expiresAt: new Date(acceptedAt.getTime() + RECEIPT_TTL_MS).toISOString()
  };
  const body = encode(JSON.stringify(record));
  return Object.freeze({ token: `v1.${body}.${signature(`v1.${body}`)}`, record: Object.freeze(record) });
}

export function verifyPreassessmentConsent(token, locale) {
  requireLegalReady();
  const serializedToken = typeof token === "string" ? token : "";
  if (serializedToken.length === 0 || serializedToken.length > 12000) {
    throw new AssessmentPayloadError("The assessment consent receipt is invalid.");
  }
  const parts = serializedToken.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !safeEqual(parts[2], signature(`${parts[0]}.${parts[1]}`))) {
    throw new AssessmentPayloadError("The assessment consent receipt is invalid.");
  }
  let record;
  try {
    record = JSON.parse(decode(parts[1]));
  } catch {
    throw new AssessmentPayloadError("The assessment consent receipt is invalid.");
  }
  const expectedLocale = String(locale || "").toLowerCase();
  const documents = currentDocuments();
  const valid = record?.schemaVersion === RECEIPT_VERSION &&
    record.locale === expectedLocale && isSupportedLanguage(record.locale) &&
    record.contentVersion === config.legalContentVersion &&
    record.scope === "adult_self_reflection" &&
    record.adultConfirmed === true && record.ownResponsesConfirmed === true &&
    record.termsAccepted === true &&
    record.nonDiagnosticAccepted === true && record.privacyAcknowledged === true &&
    record.specialCategoryConsent === true &&
    (record.analyticsConsent === true || record.analyticsConsent === false) &&
    record.documents?.policyVersion === documents.policyVersion &&
    record.documents?.privacyVersion === documents.privacyVersion &&
    record.documents?.privacySha256 === documents.privacySha256 &&
    record.documents?.termsVersion === documents.termsVersion &&
    record.documents?.termsSha256 === documents.termsSha256 &&
    Number.isFinite(Date.parse(record.acceptedAt)) &&
    Number.isFinite(Date.parse(record.expiresAt)) && Date.parse(record.expiresAt) > Date.now();
  if (!valid) throw new AssessmentPayloadError("The legal information changed or the consent receipt expired. Please review it again.");
  return Object.freeze({
    ...record,
    tokenHash: crypto.createHash("sha256").update(serializedToken).digest("hex")
  });
}
