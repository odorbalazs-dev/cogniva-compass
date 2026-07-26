(function exposeCognivaResultModel(global) {
  "use strict";

  const TRACKS = new Set(["cognitive", "emotional"]);

  function assertFiniteScore(value, label) {
    const score = Number(value);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      throw new RangeError(`${label} must be between 0 and 100`);
    }
    return score;
  }

  function scoreBand(value) {
    const score = assertFiniteScore(value, "score");
    if (score >= 70) return "established";
    if (score >= 40) return "developing";
    return "emerging";
  }

  function itemValue(track, item, answer) {
    if (!Number.isInteger(answer)) {
      throw new TypeError("Every answer must be an integer option index");
    }

    if (track === "cognitive") {
      if (!Array.isArray(item.choices) || !Number.isInteger(item.correctIndex)) {
        throw new TypeError("A cognitive item must define choices and correctIndex");
      }
      if (answer < 0 || answer >= item.choices.length) {
        throw new RangeError("Cognitive answer index is outside the available choices");
      }
      return answer === item.correctIndex ? 100 : 0;
    }

    if (answer < 0 || answer > 3) {
      throw new RangeError("Emotional answers must use the four-point 0-3 scale");
    }
    if (item.direction !== "positive" && item.direction !== "reverse") {
      throw new TypeError("An emotional item must define a positive or reverse direction");
    }
    const alignedAnswer = item.direction === "reverse" ? 3 - answer : answer;
    return (alignedAnswer / 3) * 100;
  }

  function calculate(track, items, answers) {
    if (!TRACKS.has(track)) throw new TypeError("Unknown Cogniva questionnaire track");
    if (!Array.isArray(items) || !Array.isArray(answers) || items.length === 0) {
      throw new TypeError("Items and answers must be non-empty arrays");
    }
    if (items.length !== answers.length) {
      throw new RangeError("Every questionnaire item must have exactly one answer");
    }

    const domainTotals = Object.create(null);
    items.forEach((item, itemIndex) => {
      const domain = typeof item.domain === "string" ? item.domain.trim() : "";
      if (!domain) throw new TypeError("Every item must have a domain");

      const rawWeight = Number(item.scoreWeight ?? 1);
      const weight = Number.isFinite(rawWeight) && rawWeight > 0 ? rawWeight : null;
      if (weight === null) throw new RangeError("Score weights must be positive numbers");

      const value = itemValue(track, item, answers[itemIndex]);
      if (!domainTotals[domain]) domainTotals[domain] = { sum: 0, weight: 0 };
      domainTotals[domain].sum += value * weight;
      domainTotals[domain].weight += weight;
    });

    const preciseScores = Object.fromEntries(
      Object.entries(domainTotals).map(([domain, total]) => [domain, total.sum / total.weight])
    );
    const scores = Object.fromEntries(
      Object.entries(preciseScores).map(([domain, value]) => [domain, Math.round(value)])
    );
    const preciseValues = Object.values(preciseScores);
    const overall = Math.round(
      preciseValues.reduce((sum, value) => sum + value, 0) / preciseValues.length
    );

    return Object.freeze({
      track,
      itemCount: items.length,
      overall,
      scores: Object.freeze(scores),
      preciseScores: Object.freeze(preciseScores)
    });
  }

  global.COGNIVA_RESULT_MODEL_V1 = Object.freeze({
    version: "v1",
    scoreBand,
    calculate
  });
})(window);
