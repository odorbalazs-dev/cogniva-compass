import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const LANGUAGES = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
const TRACKS = ["cognitive", "emotional"];
const BANDS = ["emerging", "developing", "established"];
const DOMAINS = [
  "patterns",
  "workingMemory",
  "numericalReasoning",
  "flexibleThinking",
  "selfAwareness",
  "regulation",
  "empathy",
  "relationships"
];
const LOCALE_KEYS = [
  "interpretationTitle",
  "interpretationLead",
  "howTitle",
  "howPoints",
  "domainAnalysisTitle",
  "nextStepLabel",
  "overallBands",
  "domainBands",
  "domainDescriptions",
  "domainTips"
];

function sorted(values) {
  return [...values].sort();
}

function assertExactKeys(value, keys, path) {
  assert.deepEqual(sorted(Object.keys(value)), sorted(keys), `${path} has an unexpected schema`);
}

function assertNonEmptyStrings(value, path) {
  if (typeof value === "string") {
    assert.ok(value.trim().length > 0, `${path} must not be empty`);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((entry, index) => assertNonEmptyStrings(entry, `${path}[${index}]`));
    return;
  }

  assert.ok(value && typeof value === "object", `${path} must contain text or nested text`);
  for (const [key, entry] of Object.entries(value)) {
    assertNonEmptyStrings(entry, `${path}.${key}`);
  }
}

function loadInsights() {
  const source = fs.readFileSync(new URL("../public/result-insights.js", import.meta.url), "utf8");
  const window = {};
  vm.runInNewContext(source, { window }, { filename: "result-insights.js" });
  return window.COGNIVA_RESULT_INSIGHTS_V1;
}

const insights = loadInsights();

test("result insights export exactly the eleven supported languages", () => {
  assert.ok(insights, "COGNIVA_RESULT_INSIGHTS_V1 must be exported");
  assert.equal(insights.version, "v1");
  assertExactKeys(insights.languages, LANGUAGES, "languages");
});

test("every locale follows the complete result-insight schema", () => {
  for (const language of LANGUAGES) {
    const locale = insights.languages[language];
    assertExactKeys(locale, LOCALE_KEYS, language);
    assertExactKeys(locale.interpretationLead, TRACKS, `${language}.interpretationLead`);
    assertExactKeys(locale.howPoints, TRACKS, `${language}.howPoints`);
    assertExactKeys(locale.domainBands, TRACKS, `${language}.domainBands`);
  }
});

test("every locale has three how-points and all three result bands for both tracks", () => {
  for (const language of LANGUAGES) {
    const locale = insights.languages[language];

    for (const track of TRACKS) {
      assert.equal(locale.howPoints[track].length, 3, `${language}.${track} must have three how-points`);
      assert.ok(
        locale.howPoints[track].every((point) => typeof point === "string" && point.trim().length > 0),
        `${language}.${track} how-points must be non-empty strings`
      );
      assertExactKeys(locale.domainBands[track], BANDS, `${language}.domainBands.${track}`);
    }

    assertExactKeys(locale.overallBands, BANDS, `${language}.overallBands`);
    for (const band of BANDS) {
      assertExactKeys(locale.overallBands[band], ["label", "summary"], `${language}.overallBands.${band}`);
    }
  }
});

test("every locale describes all eight domains and provides a tip for each", () => {
  for (const language of LANGUAGES) {
    const locale = insights.languages[language];
    assertExactKeys(locale.domainDescriptions, DOMAINS, `${language}.domainDescriptions`);
    assertExactKeys(locale.domainTips, DOMAINS, `${language}.domainTips`);
  }
});

test("all localized result-insight text is non-empty", () => {
  for (const language of LANGUAGES) {
    assertNonEmptyStrings(insights.languages[language], language);
  }
});
