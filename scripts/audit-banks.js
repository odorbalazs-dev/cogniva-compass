import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { buildCognitiveBank } from "./bank-builders/cognitive.js";
import { buildEmotionalBank } from "./bank-builders/emotional.js";

export const LANGUAGES = ["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"];
export const COGNITIVE_DOMAINS = ["patterns", "workingMemory", "numericalReasoning", "flexibleThinking"];
export const EMOTIONAL_DOMAINS = ["selfAwareness", "regulation", "empathy", "relationships"];

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function validateShared(items, type, domains) {
  assert.equal(items.length, 250, `${type} bank must contain exactly 250 items`);
  assert.equal(new Set(items.map((item) => item.id)).size, 250, `${type} IDs must be unique`);
  assert.equal(new Set(items.map((item) => item.stemKey)).size, 250, `${type} stem keys must be unique`);

  for (const item of items) {
    assert.equal(item.type, type, `${item.id}: incorrect type`);
    assert.ok(domains.includes(item.domain), `${item.id}: unknown domain`);
    assert.ok(Number.isInteger(item.difficulty) && item.difficulty >= 1 && item.difficulty <= 5, `${item.id}: difficulty must be 1-5`);
    assert.equal(item.contentWeight, 1, `${item.id}: content weight must remain provisional and equal`);
    assert.equal(item.scoreWeight, 1, `${item.id}: production scoring remains equal-weight until calibration`);
    assert.equal(item.selectionWeight, 1, `${item.id}: initial exposure weight must be equal`);
    assert.equal(item.status, "expert_review_required", `${item.id}: review status missing`);
    assert.deepEqual(Object.keys(item.locales).sort(), [...LANGUAGES].sort(), `${item.id}: incomplete language set`);

    for (const lang of LANGUAGES) {
      const locale = item.locales[lang];
      assert.ok(locale && typeof locale.prompt === "string" && locale.prompt.trim().length > 4, `${item.id}/${lang}: missing prompt`);
    }
  }

  for (const lang of LANGUAGES) {
    const prompts = items.map((item) => item.locales[lang].prompt.trim());
    assert.equal(new Set(prompts).size, 250, `${type}/${lang}: prompts must be unique`);
  }

  const domainCounts = countBy(items, "domain");
  for (const domain of domains) {
    assert.ok(domainCounts[domain] >= 62 && domainCounts[domain] <= 63, `${type}/${domain}: domain blueprint must be balanced`);
  }

  assert.deepEqual(countBy(items, "difficulty"), { 1: 50, 2: 50, 3: 50, 4: 50, 5: 50 }, `${type}: difficulty blueprint must be balanced`);
}

export function auditBanks() {
  const cognitive = buildCognitiveBank();
  const emotional = buildEmotionalBank();

  validateShared(cognitive, "cognitive", COGNITIVE_DOMAINS);
  validateShared(emotional, "emotional", EMOTIONAL_DOMAINS);

  for (const item of cognitive) {
    assert.ok(Number.isInteger(item.correctIndex), `${item.id}: missing correct index`);
    for (const lang of LANGUAGES) {
      const choices = item.locales[lang].choices;
      assert.ok(Array.isArray(choices) && choices.length === 4, `${item.id}/${lang}: four choices required`);
      assert.ok(item.correctIndex >= 0 && item.correctIndex < choices.length, `${item.id}/${lang}: correct index out of range`);
      assert.equal(new Set(choices.map(String)).size, 4, `${item.id}/${lang}: choices must be distinct`);
    }
  }
  const correctPositionCounts = countBy(cognitive, "correctIndex");
  for (const position of [0, 1, 2, 3]) {
    assert.ok(correctPositionCounts[position] >= 62 && correctPositionCounts[position] <= 63, "correct answer positions must be balanced");
  }

  const directionCounts = countBy(emotional, "direction");
  assert.ok(Math.abs((directionCounts.positive || 0) - (directionCounts.reverse || 0)) <= 1, "emotional directions must be balanced");
  for (const item of emotional) {
    assert.ok(["positive", "reverse"].includes(item.direction), `${item.id}: invalid scoring direction`);
    for (const lang of LANGUAGES) {
      const options = item.locales[lang].responseOptions;
      assert.ok(Array.isArray(options) && options.length === 4, `${item.id}/${lang}: four response options required`);
      assert.equal(new Set(options).size, 4, `${item.id}/${lang}: response options must be distinct`);
    }
  }
  for (const domain of EMOTIONAL_DOMAINS) {
    const domainItems = emotional.filter((item) => item.domain === domain);
    const counts = countBy(domainItems, "direction");
    assert.ok(Math.abs((counts.positive || 0) - (counts.reverse || 0)) <= 1, `emotional/${domain}: direction balance required`);
  }

  return { cognitive, emotional };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { cognitive, emotional } = auditBanks();
  console.log(`Bank audit passed: ${cognitive.length} cognitive + ${emotional.length} emotional items, ${LANGUAGES.length} languages.`);
}
