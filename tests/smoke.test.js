import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const app = fs.readFileSync(new URL("../public/app.js", import.meta.url), "utf8");
const index = fs.readFileSync(new URL("../public/index.html", import.meta.url), "utf8");
const loader = fs.readFileSync(new URL("../public/webflow-loader.js", import.meta.url), "utf8");
const embed = fs.readFileSync(new URL("../webflow/cogniva-compass-embed.html", import.meta.url), "utf8");
const legalContent = fs.readFileSync(new URL("../public/legal-content.js", import.meta.url), "utf8");

function localizedCopy() {
  const start = app.indexOf("var I18N = ") + "var I18N = ".length;
  const end = app.indexOf("\n  };\n\n  function safeStorageGet", start) + 4;
  assert.ok(start > 10 && end > start, "localized copy object should be discoverable");
  return vm.runInNewContext(`(${app.slice(start, end)})`);
}

test("all eleven languages have the complete UI and domain schema", () => {
  const locales = localizedCopy();
  const languages = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
  assert.deepEqual(Object.keys(locales).sort(), languages.sort());
  const expectedKeys = Object.keys(locales.en).sort();
  for (const language of languages) {
    assert.deepEqual(Object.keys(locales[language]).sort(), expectedKeys, `${language} UI schema`);
    assert.deepEqual(Object.keys(locales[language].domains).sort(), Object.keys(locales.en.domains).sort(), `${language} domain schema`);
    for (const [key, value] of Object.entries(locales[language])) {
      if (key === "domains") continue;
      assert.equal(typeof value, "string", `${language}.${key}`);
      assert.ok(value.trim(), `${language}.${key} must not be empty`);
    }
  }
});

test("the landing is lightweight and assessment assets load only after a CTA", () => {
  assert.doesNotMatch(index, /cogniva-banks|selection-engine|result-model|result-insights/);
  assert.match(index, /\/legal-content\.js\?v=/);
  assert.match(index, /\/app\.js\?v=/);
  assert.ok(index.indexOf("/legal-content.js?v=") < index.indexOf("/app.js?v="));
  assert.match(app, /loadScript\("banks\/cogniva-banks\.v1\.js"/);
  assert.match(app, /loadScript\("selection-engine\.js"/);
  assert.match(app, /loadScript\("result-model\.js"/);
  assert.match(app, /loadScript\("result-insights\.js"/);
  assert.ok(app.indexOf('loadScript("banks/cogniva-banks.v1.js"') < app.indexOf('loadScript("selection-engine.js"'));
  assert.ok(app.indexOf('loadScript("selection-engine.js"') < app.indexOf('loadScript("result-model.js"'));
  assert.ok(app.indexOf('loadScript("result-model.js"') < app.indexOf('loadScript("result-insights.js"'));
});

test("questionnaire and result UI preserve accessibility and cautious interpretation", () => {
  assert.match(app, /role=\"progressbar\"/);
  assert.match(app, /aria-valuenow=/);
  assert.match(app, /aria-valuetext=/);
  assert.match(app, /querySelector\("#ccQuestionTitle"\)\.focus\(\{ preventScroll: true \}\)/);
  assert.match(app, /querySelector\("#ccResultTitle"\)\.focus\(\{ preventScroll: true \}\)/);
  assert.match(app, /beforeunload/);
  assert.match(app, /leaveWarning/);
  assert.match(app, /Most visible in this sample/);
  assert.doesNotMatch(app, /Current strength|Area to explore/);
  assert.doesNotMatch(app, /\/100|cc-domain-value|cc-domain-bar/);
  assert.doesNotMatch(app, /safeStorageSet\([^\n]*(answer|score|result)/i);
});

test("language selection is modal, keyboard accessible and Arabic direction is root-scoped", () => {
  const styles = fs.readFileSync(new URL("../public/styles.css", import.meta.url), "utf8");
  assert.match(app, /role=\"dialog\" aria-modal=\"true\"/);
  assert.match(app, /event\.key === \"Escape\"/);
  assert.match(app, /event\.key !== \"Tab\"/);
  assert.match(app, /setAttribute\("inert", ""\)/);
  assert.match(app, /aria-expanded/);
  assert.match(app, /shouldAutoOpenLanguage = !queryLanguage && !savedLanguage/);
  assert.match(app, /root\.dir = language === \"ar\" \? \"rtl\" : \"ltr\"/);
  assert.match(styles, /#cognivaCompassRoot\[dir=\"rtl\"\]/);
  assert.doesNotMatch(styles, /(^|\n)\s*\[dir=\"rtl\"\]/);
  assert.doesNotMatch(index + loader, /fonts\.googleapis|fonts\.gstatic/);
});

test("paid report checkout uses the documented consent and server-verifiable payload", () => {
  for (const field of [
    "email", "purchaseTermsAccepted", "immediatePerformanceAccepted",
    "aiConsent", "locale", "packageCode", "assessments",
    "preassessmentConsentToken", "policyVersion"
  ]) assert.match(app, new RegExp(`${field}:`));
  assert.match(app, /function assessmentsForPackage/);
  assert.match(app, /checkoutAssessment\(completedAssessments\.cognitive\)/);
  assert.match(app, /checkoutAssessment\(completedAssessments\.emotional\)/);
  assert.match(app, /name="packageCode" value="single_v1"/);
  assert.match(app, /name="packageCode" value="bundle_v1"/);
  assert.match(app, /name="confirmEmail"/);
  assert.match(app, /\/api\/checkout/);
  assert.match(app, /\/api\/orders\//);
  assert.match(app, /"X-Order-Token": order\.access/);
  assert.match(app, /saveCheckoutRecovery\(completion, packageCode\)/);
  assert.match(app, /searchParams\.get\("checkout"\) !== "cancelled"/);
  assert.match(app, /safeSessionRemove\(CHECKOUT_RECOVERY_KEY\)/);
  assert.doesNotMatch(app, /\$\s*\d|€\s*\d|\d[.,]\d{2}\s*(USD|EUR)/);
});

test("assessment start is gated by localized, fail-closed consent", () => {
  for (const marker of [
    "/api/legal/config", "/api/legal/consent", "adultConfirmed",
    "ownResponsesConfirmed", "nonDiagnosticAccepted", "termsAccepted",
    "privacyAcknowledged", "specialCategoryConsent", "analyticsConsent"
  ]) assert.ok(app.includes(marker), `${marker} should be present`);
  assert.match(app, /legalBundle\(\)\.isProductionReady === true/);
  assert.match(app, /legalDocumentsMatch\(record\.documents, config\)/);
  assert.match(app, /receipt\.contentVersion === bundle\.version/);
  assert.match(legalContent, /isProductionReady:\s*false/);
  assert.ok(loader.indexOf('addScript("/legal-content.js?v="') < loader.indexOf('addScript("/app.js?v="'));
});

test("privacy boundaries distinguish the free path from explicit paid submission", () => {
  const readme = fs.readFileSync(new URL("../README.md", import.meta.url), "utf8");
  assert.match(readme, /During the free path, answers and the on-screen result stay in browser memory/i);
  assert.match(readme, /explicitly chooses a paid report/i);
  assert.match(readme, /not an IQ test/i);
  assert.match(app, /not a standardized IQ test/);
});

test("Webflow embeds only the independent, versioned Cogniva loader", () => {
  assert.match(embed, /cogniva-compass-production\.up\.railway\.app\/webflow-loader\.js\?v=/);
  assert.ok(embed.length < 300, "Webflow embed should stay small");
  assert.doesNotMatch(embed, /neuromap/i);
  assert.match(loader, /\/styles\.css/);
  assert.match(loader, /\/result-styles\.css/);
  assert.match(loader, /\/app\.js\?v=/);
  assert.match(loader, /Promise\.all\(\[/);
  assert.doesNotMatch(loader, /cogniva-banks|selection-engine|result-model|result-insights/);
});
