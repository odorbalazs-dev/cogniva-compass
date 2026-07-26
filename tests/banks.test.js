import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { auditBanks, COGNITIVE_DOMAINS, EMOTIONAL_DOMAINS, LANGUAGES } from "../scripts/audit-banks.js";

const engineSource = fs.readFileSync(new URL("../public/selection-engine.js", import.meta.url), "utf8");

function memoryStorage({ throws = false } = {}) {
  const values = new Map();
  return {
    getItem(key) { if (throws) throw new Error("storage unavailable"); return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { if (throws) throw new Error("storage unavailable"); values.set(key, String(value)); },
    removeItem(key) { if (throws) throw new Error("storage unavailable"); values.delete(key); },
    dump() { return new Map(values); }
  };
}

function makePayload() {
  const { cognitive, emotional } = auditBanks();
  return {
    schemaVersion: 1,
    bankVersion: "test-v1",
    languages: LANGUAGES,
    tracks: {
      cognitive: { formLength: 20, domains: COGNITIVE_DOMAINS, items: cognitive },
      emotional: { formLength: 24, domains: EMOTIONAL_DOMAINS, items: emotional }
    }
  };
}

function loadEngine(options = {}) {
  const localStorage = memoryStorage(options);
  const sessionStorage = memoryStorage(options);
  const window = { COGNIVA_BANKS_V1: makePayload(), localStorage, sessionStorage };
  window.window = window;
  const context = vm.createContext(window);
  vm.runInContext(engineSource, context, { filename: "selection-engine.js" });
  return { api: context.COGNIVA_SELECTION_V1, localStorage, sessionStorage };
}

function counts(items, field) {
  return items.reduce((result, item) => {
    result[item[field]] = (result[item[field]] || 0) + 1;
    return result;
  }, {});
}

test("the generated source banks pass the full structural audit", () => {
  const { cognitive, emotional } = auditBanks();
  assert.equal(cognitive.length, 250);
  assert.equal(emotional.length, 250);
});

test("the browser bundle contains both complete versioned banks", () => {
  const built = auditBanks();
  const bundle = fs.readFileSync(new URL("../public/banks/cogniva-banks.v1.js", import.meta.url), "utf8");
  const window = {};
  const context = vm.createContext({ window });
  vm.runInContext(bundle, context, { filename: "cogniva-banks.v1.js" });
  assert.equal(window.COGNIVA_BANKS_V1.tracks.cognitive.items.length, 250);
  assert.equal(window.COGNIVA_BANKS_V1.tracks.emotional.items.length, 250);
  assert.deepEqual([...window.COGNIVA_BANKS_V1.languages], LANGUAGES);
  assert.equal(JSON.stringify(window.COGNIVA_BANKS_V1.tracks.cognitive.items), JSON.stringify(built.cognitive));
  assert.equal(JSON.stringify(window.COGNIVA_BANKS_V1.tracks.emotional.items), JSON.stringify(built.emotional));
});

test("cognitive forms contain 20 unique items with exact domain and difficulty quotas", () => {
  const { api } = loadEngine();
  const form = api.getItems("cognitive", "en");
  assert.equal(form.length, 20);
  assert.equal(new Set(form.map((item) => item.id)).size, 20);
  assert.deepEqual(counts(form, "domain"), Object.fromEntries(COGNITIVE_DOMAINS.map((domain) => [domain, 5])));
  for (const domain of COGNITIVE_DOMAINS) {
    assert.deepEqual(Array.from(form.filter((item) => item.domain === domain), (item) => item.difficulty).sort(), [1, 2, 3, 4, 5]);
  }
});

test("emotional forms contain 24 unique items with balanced domains and scoring direction", () => {
  const { api } = loadEngine();
  const form = api.getItems("emotional", "en");
  assert.equal(form.length, 24);
  assert.equal(new Set(form.map((item) => item.id)).size, 24);
  assert.deepEqual(counts(form, "domain"), Object.fromEntries(EMOTIONAL_DOMAINS.map((domain) => [domain, 6])));
  for (const domain of EMOTIONAL_DOMAINS) {
    assert.deepEqual(counts(form.filter((item) => item.domain === domain), "direction"), { positive: 3, reverse: 3 });
  }
});

test("an active form keeps the same IDs across refresh and language changes", () => {
  const { api } = loadEngine();
  const english = api.getItems("cognitive", "en");
  const hungarian = api.getItems("cognitive", "hu");
  assert.deepEqual(english.map((item) => item.id), hungarian.map((item) => item.id));
  assert.ok(hungarian.every((item) => item.locale === "hu"));
  assert.ok(hungarian.every((item, index) => item.prompt !== english[index].prompt));
});

test("cognitive exposure uses all unseen blueprint-cell items before fallback and protects the last form", () => {
  const { api } = loadEngine();
  const seen = new Set();
  let previous = new Set();
  for (let formIndex = 0; formIndex < 13; formIndex++) {
    const form = api.getItems("cognitive", "en");
    const ids = form.map((item) => item.id);
    assert.ok(ids.every((id) => !previous.has(id)), `form ${formIndex + 1} repeated an item from the immediately previous form`);
    if (formIndex < 12) assert.ok(ids.every((id) => !seen.has(id)), `form ${formIndex + 1} repeated before a blueprint cell was exhausted`);
    ids.forEach((id) => seen.add(id));
    previous = new Set(ids);
    api.completeForm("cognitive");
  }
  assert.equal(seen.size, 250);
});

test("emotional exposure uses all unseen direction cells before fallback and protects the last form", () => {
  const { api } = loadEngine();
  const seen = new Set();
  let previous = new Set();
  for (let formIndex = 0; formIndex < 11; formIndex++) {
    const form = api.getItems("emotional", "en");
    const ids = form.map((item) => item.id);
    assert.ok(ids.every((id) => !previous.has(id)), `form ${formIndex + 1} repeated an item from the immediately previous form`);
    if (formIndex < 10) assert.ok(ids.every((id) => !seen.has(id)), `form ${formIndex + 1} repeated before a blueprint cell was exhausted`);
    ids.forEach((id) => seen.add(id));
    previous = new Set(ids);
    api.completeForm("emotional");
  }
  assert.equal(seen.size, 250);
});

test("persistent repeat history contains question IDs only", () => {
  const { api, localStorage } = loadEngine();
  api.getItems("cognitive", "en");
  const entries = [...localStorage.dump().entries()];
  assert.equal(entries.length, 1);
  const history = JSON.parse(entries[0][1]);
  assert.equal(history.length, 20);
  assert.ok(history.every((value) => /^COG-\d{3}$/.test(value)));
  assert.doesNotMatch(entries[0][1], /prompt|answer|score|email|name/i);
});

test("the engine remains functional when browser storage is unavailable", () => {
  const { api } = loadEngine({ throws: true });
  const first = api.getItems("emotional", "fr");
  const sameActiveForm = api.getItems("emotional", "fr");
  assert.deepEqual(first.map((item) => item.id), sameActiveForm.map((item) => item.id));
  api.completeForm("emotional");
  const next = api.getItems("emotional", "fr");
  assert.ok(next.every((item) => !first.some((oldItem) => oldItem.id === item.id)));
});
