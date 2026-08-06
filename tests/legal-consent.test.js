import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

Object.assign(process.env, {
  PRIVACY_URL: "https://example.test/privacy",
  TERMS_URL: "https://example.test/terms",
  CONTACT_URL: "https://example.test/contact",
  POLICY_VERSION: "2026-07-31",
  PRIVACY_VERSION: "2026-07-31",
  TERMS_VERSION: "2026-07-31",
  LEGAL_CONTENT_VERSION: "2026-07-31-v1",
  PRIVACY_DOCUMENT_SHA256: "a".repeat(64),
  TERMS_DOCUMENT_SHA256: "b".repeat(64),
  LEGAL_CONSENT_SECRET: "test-only-legal-consent-secret-at-least-32-bytes",
  CONTROLLER_LEGAL_NAME: "Example Controller Kft.",
  REGISTERED_ADDRESS: "Example address",
  CONTROLLER_COUNTRY: "Hungary",
  PRIVACY_EMAIL: "privacy@example.test",
  SUPPORT_EMAIL: "support@example.test",
  SUPERVISORY_AUTHORITY_NAME: "Example authority",
  SUPERVISORY_AUTHORITY_URL: "https://example.test/authority"
});

const {
  createPreassessmentConsent,
  publicLegalConfig,
  verifyPreassessmentConsent
} = await import("../src/legal.js");

const COMPLETE_CONSENT = Object.freeze({
  locale: "hu",
  contentVersion: "2026-07-31-v1",
  adultConfirmed: true,
  ownResponsesConfirmed: true,
  termsAccepted: true,
  nonDiagnosticAccepted: true,
  privacyAcknowledged: true,
  specialCategoryConsent: true,
  analyticsConsent: false
});

test("legal configuration is fail-closed but exposes approved public metadata when complete", () => {
  const value = publicLegalConfig();
  assert.equal(value.legalReady, true);
  assert.equal(value.legalContentVersion, "2026-07-31-v1");
  assert.equal(value.controller.legalName, "Example Controller Kft.");
  assert.equal(value.privacyDocumentSha256, "a".repeat(64));
  assert.equal("legalConsentSecret" in value, false);
});

test("pre-assessment consent is signed, locale-bound and document-bound", () => {
  const created = createPreassessmentConsent(COMPLETE_CONSENT);
  assert.match(created.token, /^v1\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/);
  const verified = verifyPreassessmentConsent(created.token, "hu");
  assert.equal(verified.scope, "adult_self_reflection");
  assert.equal(verified.contentVersion, "2026-07-31-v1");
  assert.equal(verified.ownResponsesConfirmed, true);
  assert.equal(verified.analyticsConsent, false);
  assert.equal(verified.documents.privacySha256, "a".repeat(64));
  assert.match(verified.tokenHash, /^[a-f0-9]{64}$/);
  assert.throws(() => verifyPreassessmentConsent(created.token, "en"), /changed|expired/i);
  const parts = created.token.split(".");
  assert.throws(
    () => verifyPreassessmentConsent(`${parts[0]}.${parts[1]}x.${parts[2]}`, "hu"),
    /invalid/i
  );
  assert.throws(() => verifyPreassessmentConsent("x".repeat(12001), "hu"), /invalid/i);
});

test("every material acknowledgement is separately required and analytics is an explicit choice", () => {
  assert.throws(
    () => createPreassessmentConsent({ ...COMPLETE_CONSENT, contentVersion: "outdated-copy" }),
    /localized legal information changed/i
  );
  for (const field of [
    "adultConfirmed",
    "ownResponsesConfirmed",
    "termsAccepted",
    "nonDiagnosticAccepted",
    "privacyAcknowledged",
    "specialCategoryConsent"
  ]) {
    assert.throws(
      () => createPreassessmentConsent({ ...COMPLETE_CONSENT, [field]: false }),
      /required|acknowledged|consent/i,
      field
    );
  }
  assert.throws(
    () => createPreassessmentConsent({ ...COMPLETE_CONSENT, analyticsConsent: undefined }),
    /analytics preference/i
  );
});

test("legal-content bundle is complete for exactly eleven locales with Arabic RTL and no fallback", () => {
  const source = fs.readFileSync(new URL("../public/legal-content.js", import.meta.url), "utf8");
  const context = { window: {} };
  vm.runInNewContext(source, context, { filename: "legal-content.js" });
  const bundle = context.window.COGNIVA_LEGAL_CONTENT_V1;
  const languages = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
  assert.deepEqual([...bundle.supportedLanguages].sort(), [...languages].sort());
  for (const language of languages) {
    const copy = bundle.get(language);
    assert.ok(copy, language);
    assert.equal(typeof copy.terms.checks.ownResponsesConfirmed, "string");
    assert.equal(typeof copy.privacy.checks.specialCategoryExplicitConsent, "string");
  }
  assert.equal(bundle.get("ar").direction, "rtl");
  assert.equal(bundle.get("unsupported"), null);
  assert.equal(bundle.status, "draft");
  assert.equal(bundle.isProductionReady, false);
});
