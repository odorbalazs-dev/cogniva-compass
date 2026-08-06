import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { buildCognitiveBank } from "../scripts/bank-builders/cognitive.js";
import { buildEmotionalBank } from "../scripts/bank-builders/emotional.js";
import { canonicalizeAssessment, canonicalizeOrderAssessments } from "../src/assessment.js";
import { buildPersonalReport } from "../src/report.js";
import { REPORT_COPY, REPORT_FALLBACK } from "../src/report-copy.js";

const LANGUAGES = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
const resultModelWindow = {};
vm.runInNewContext(
  fs.readFileSync(new URL("../public/result-model.js", import.meta.url), "utf8"),
  { window: resultModelWindow },
  { filename: "result-model.js" }
);

function cognitiveResponses() {
  const bank = buildCognitiveBank();
  const domains = ["patterns", "workingMemory", "numericalReasoning", "flexibleThinking"];
  return domains.flatMap((domain) => [1, 2, 3, 4, 5].map((difficulty) => {
    const item = bank.find((candidate) => candidate.domain === domain && candidate.difficulty === difficulty);
    return { id: item.id, answer: item.correctIndex };
  }));
}

function emotionalResponses() {
  const bank = buildEmotionalBank();
  const domains = ["selfAwareness", "regulation", "empathy", "relationships"];
  return domains.flatMap((domain) => ["positive", "reverse"].flatMap((direction) =>
    bank.filter((item) => item.domain === domain && item.direction === direction)
      .slice(0, 3)
      .map((item) => ({ id: item.id, answer: direction === "positive" ? 3 : 0 }))
  ));
}

test("server canonicalization recomputes a valid cognitive form", () => {
  const result = canonicalizeAssessment({
    track: "cognitive",
    formId: "cognitive-12345678-test",
    responses: cognitiveResponses()
  });
  assert.equal(result.overall, 100);
  assert.deepEqual(Object.values(result.scores), [100, 100, 100, 100]);
  assert.equal(result.itemIds.length, 20);
  assert.equal("responses" in result, false, "raw answers must not leave canonicalization");
});

test("server canonicalization recomputes reverse-keyed emotional responses", () => {
  const result = canonicalizeAssessment({
    track: "emotional",
    formId: "emotional-12345678-test",
    responses: emotionalResponses()
  });
  assert.equal(result.overall, 100);
  assert.deepEqual(Object.values(result.scores), [100, 100, 100, 100]);
  assert.equal(result.itemIds.length, 24);
});

test("browser and server scoring stay in parity", () => {
  for (const [track, makeResponses, makeBank] of [
    ["cognitive", cognitiveResponses, buildCognitiveBank],
    ["emotional", emotionalResponses, buildEmotionalBank]
  ]) {
    const responses = makeResponses();
    responses[0] = { ...responses[0], answer: 1 };
    const byId = new Map(makeBank().map((item) => [item.id, item]));
    const localizedItems = responses.map(({ id }) => {
      const item = byId.get(id);
      return { ...item, ...item.locales.en };
    });
    const browser = resultModelWindow.COGNIVA_RESULT_MODEL_V1.calculate(
      track,
      localizedItems,
      responses.map(({ answer }) => answer)
    );
    const server = canonicalizeAssessment({
      track,
      formId: `${track}-12345678-parity`,
      responses
    });
    assert.equal(server.overall, browser.overall);
    assert.deepEqual({ ...server.scores }, { ...browser.scores });
  }
});

test("server rejects duplicate, unknown and blueprint-invalid forms", () => {
  const valid = cognitiveResponses();
  assert.throws(
    () => canonicalizeAssessment({ track: "cognitive", formId: "cognitive-12345678-test", responses: [...valid.slice(0, -1), valid[0]] }),
    /duplicate/i
  );
  assert.throws(
    () => canonicalizeAssessment({ track: "cognitive", formId: "cognitive-12345678-test", responses: [...valid.slice(0, -1), { id: "COG-999", answer: 0 }] }),
    /unknown/i
  );
  const sameDomain = buildCognitiveBank().filter((item) => item.domain === "patterns").slice(0, 20)
    .map((item) => ({ id: item.id, answer: 0 }));
  assert.throws(
    () => canonicalizeAssessment({ track: "cognitive", formId: "cognitive-12345678-test", responses: sameDomain }),
    /blueprint/i
  );
});

test("server rejects coercible and non-integer answer values", () => {
  const valid = cognitiveResponses();
  for (const invalidAnswer of [null, "", "0", false, true, 1.5, undefined]) {
    const responses = valid.map((response) => ({ ...response }));
    responses[0].answer = invalidAnswer;
    assert.throws(
      () => canonicalizeAssessment({
        track: "cognitive",
        formId: "cognitive-12345678-test",
        responses
      }),
      /numeric answer index/i
    );
  }
});

test("bundle canonicalization requires one complete cognitive and one complete emotional form", () => {
  const assessments = canonicalizeOrderAssessments("bundle_v1", [
    {
      track: "emotional",
      formId: "emotional-12345678-bundle",
      responses: emotionalResponses()
    },
    {
      track: "cognitive",
      formId: "cognitive-12345678-bundle",
      responses: cognitiveResponses()
    }
  ]);
  assert.deepEqual(assessments.map((assessment) => assessment.track), ["cognitive", "emotional"]);
  assert.equal(assessments.length, 2);
  assert.ok(assessments.every((assessment) => !("responses" in assessment)));
  assert.throws(
    () => canonicalizeOrderAssessments("bundle_v1", [{
      track: "cognitive",
      formId: "cognitive-12345678-bundle",
      responses: cognitiveResponses()
    }]),
    /exactly 2 assessment/i
  );
});

test("email/report copy and deterministic fallback are complete in all eleven languages", async () => {
  for (const lang of LANGUAGES) {
    const copy = REPORT_COPY[lang];
    const fallback = REPORT_FALLBACK[lang];
    assert.ok(copy && fallback, `${lang} report locale is missing`);
    assert.equal(Object.keys(copy.domains).length, 8);
    assert.equal(fallback.observations.length, 2);
    assert.equal(fallback.experiments.length, 3);
    assert.equal(fallback.questions.length, 3);
    const report = await buildPersonalReport({
      id: `00000000-0000-4000-8000-0000000000${LANGUAGES.indexOf(lang).toString().padStart(2, "0")}`,
      lang,
      track: "cognitive",
      scores: { patterns: 60, workingMemory: 40, numericalReasoning: 80, flexibleThinking: 60 },
      overall: 60,
      bank_version: "test",
      scoring_version: "test",
      consent_record: { aiConsent: false }
    });
    assert.equal(report.source, "template");
    assert.equal(report.content.questions.length, 3);
  }
});

test("bundle report contains both independently generated, deterministic sections", async () => {
  const report = await buildPersonalReport({
    id: "00000000-0000-4000-8000-000000000099",
    lang: "en",
    package_code: "bundle_v1",
    consent_record: { aiConsent: false },
    assessments: [
      {
        track: "cognitive",
        form_id: "cognitive-12345678-bundle",
        bank_version: "test",
        scoring_version: "test",
        scores: { patterns: 60, workingMemory: 40, numericalReasoning: 80, flexibleThinking: 60 },
        overall: 60
      },
      {
        track: "emotional",
        form_id: "emotional-12345678-bundle",
        bank_version: "test",
        scoring_version: "test",
        scores: { selfAwareness: 60, regulation: 40, empathy: 80, relationships: 60 },
        overall: 60
      }
    ]
  });
  assert.equal(report.source, "template");
  assert.equal(report.content.schemaVersion, "cogniva-order-report-v2");
  assert.equal(report.content.packageCode, "bundle_v1");
  assert.deepEqual(report.content.sections.map((section) => section.track), ["cognitive", "emotional"]);
  assert.ok(report.content.sections.every((section) => section.content.questions.length === 3));
});

test("the paid email keeps unvalidated numeric scores out of the customer-facing template", () => {
  const emailSource = fs.readFileSync(new URL("../src/email.js", import.meta.url), "utf8");
  assert.doesNotMatch(emailSource, /\/100|scoreRows|scoreText|order\.scores/);
  assert.match(emailSource, /domainItems/);
});
