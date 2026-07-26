import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

function loadResultModel() {
  const source = fs.readFileSync(new URL("../public/result-model.js", import.meta.url), "utf8");
  const window = {};
  vm.runInNewContext(source, { window }, { filename: "result-model.js" });
  return window.COGNIVA_RESULT_MODEL_V1;
}

function cognitiveItem({ domain = "patterns", correctIndex = 1, scoreWeight = 1 } = {}) {
  return { domain, choices: ["A", "B", "C"], correctIndex, scoreWeight };
}

function emotionalItem({ domain = "selfAwareness", direction = "positive", scoreWeight = 1 } = {}) {
  return { domain, direction, scoreWeight };
}

const model = loadResultModel();

test("cognitive scoring handles correct, incorrect and weighted answers", () => {
  const correct = model.calculate("cognitive", [cognitiveItem()], [1]);
  const incorrect = model.calculate("cognitive", [cognitiveItem()], [0]);

  assert.equal(correct.preciseScores.patterns, 100);
  assert.equal(correct.scores.patterns, 100);
  assert.equal(correct.overall, 100);
  assert.equal(incorrect.preciseScores.patterns, 0);
  assert.equal(incorrect.scores.patterns, 0);
  assert.equal(incorrect.overall, 0);

  const weighted = model.calculate(
    "cognitive",
    [
      cognitiveItem({ scoreWeight: 1 }),
      cognitiveItem({ scoreWeight: 3 })
    ],
    [1, 0]
  );

  assert.equal(weighted.preciseScores.patterns, 25);
  assert.equal(weighted.scores.patterns, 25);
  assert.equal(weighted.overall, 25);
});

test("emotional scoring maps every 0-3 response for positive and reverse items", () => {
  const positiveExpected = [0, 100 / 3, 200 / 3, 100];
  const reverseExpected = [100, 200 / 3, 100 / 3, 0];

  for (let answer = 0; answer <= 3; answer += 1) {
    const positive = model.calculate("emotional", [emotionalItem({ direction: "positive" })], [answer]);
    const reverse = model.calculate("emotional", [emotionalItem({ direction: "reverse" })], [answer]);

    assert.ok(Math.abs(positive.preciseScores.selfAwareness - positiveExpected[answer]) < 1e-10);
    assert.ok(Math.abs(reverse.preciseScores.selfAwareness - reverseExpected[answer]) < 1e-10);
    assert.equal(positive.scores.selfAwareness, Math.round(positiveExpected[answer]));
    assert.equal(reverse.scores.selfAwareness, Math.round(reverseExpected[answer]));
  }
});

test("score bands use the documented inclusive boundaries", () => {
  const cases = [
    [0, "emerging"],
    [39, "emerging"],
    [40, "developing"],
    [69, "developing"],
    [70, "established"],
    [100, "established"]
  ];

  for (const [score, expectedBand] of cases) {
    assert.equal(model.scoreBand(score), expectedBand, `unexpected band for ${score}`);
  }
});

test("overall is calculated from precise domain values before domain scores are rounded", () => {
  const result = model.calculate(
    "emotional",
    [
      emotionalItem({ domain: "selfAwareness" }),
      emotionalItem({ domain: "empathy" })
    ],
    [2, 0]
  );

  assert.ok(Math.abs(result.preciseScores.selfAwareness - 200 / 3) < 1e-10);
  assert.equal(result.preciseScores.empathy, 0);
  assert.equal(result.scores.selfAwareness, 67);
  assert.equal(result.scores.empathy, 0);
  assert.equal(result.overall, 33);
  assert.equal(Math.round((result.scores.selfAwareness + result.scores.empathy) / 2), 34);
});

test("missing and invalid answers are rejected", () => {
  const item = cognitiveItem();

  assert.throws(
    () => model.calculate("cognitive", [item], []),
    /exactly one answer/
  );
  assert.throws(
    () => model.calculate("cognitive", [item], [undefined]),
    /integer option index/
  );
  assert.throws(
    () => model.calculate("cognitive", [item], [1.5]),
    /integer option index/
  );
  assert.throws(
    () => model.calculate("cognitive", [item], [3]),
    /outside the available choices/
  );
  assert.throws(
    () => model.calculate("emotional", [emotionalItem()], [4]),
    /four-point 0-3 scale/
  );
});

test("invalid emotional directions are rejected", () => {
  assert.throws(
    () => model.calculate("emotional", [emotionalItem({ direction: "sideways" })], [2]),
    /positive or reverse direction/
  );
});

test("zero, negative and non-finite score weights are rejected", () => {
  for (const scoreWeight of [0, -1, "not-a-number", Infinity]) {
    assert.throws(
      () => model.calculate("cognitive", [cognitiveItem({ scoreWeight })], [1]),
      /positive numbers/,
      `scoreWeight ${String(scoreWeight)} should be rejected`
    );
  }
});

test("calculation results and their score maps are frozen", () => {
  const result = model.calculate("cognitive", [cognitiveItem()], [1]);

  assert.equal(Object.isFrozen(result), true);
  assert.equal(Object.isFrozen(result.scores), true);
  assert.equal(Object.isFrozen(result.preciseScores), true);
  assert.equal(Reflect.set(result, "overall", 0), false);
  assert.equal(Reflect.set(result.scores, "patterns", 0), false);
  assert.equal(Reflect.set(result.preciseScores, "patterns", 0), false);
  assert.equal(result.overall, 100);
  assert.equal(result.scores.patterns, 100);
  assert.equal(result.preciseScores.patterns, 100);
});
