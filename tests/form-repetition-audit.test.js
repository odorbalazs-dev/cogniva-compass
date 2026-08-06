import test from "node:test";
import assert from "node:assert/strict";
import { buildEmotionalBank } from "../scripts/bank-builders/emotional.js";
import { parseEmotionalStemKey, runFormRepetitionAudit } from "../scripts/audit-form-repetition.js";

test("emotional stem keys expose exact context and action coordinates", () => {
  const first = buildEmotionalBank()[0];
  assert.deepEqual(parseEmotionalStemKey(first), {
    domain: "selfAwareness",
    direction: "positive",
    context: 1,
    action: 1,
    behaviorFamily: "selfAwareness|positive|a01",
    contextWithinDirectionFamily: "selfAwareness|positive|c01",
    pairedContentSlot: "selfAwareness|c01|a01"
  });
});

test("the first-form repetition simulation is seeded and reproducible", () => {
  const first = runFormRepetitionAudit({ forms: 1_000, seed: 20_260_726 });
  const second = runFormRepetitionAudit({ forms: 1_000, seed: 20_260_726 });

  assert.deepEqual(second, first);
  assert.equal(first.simulation.state, "fresh first form with empty exposure history");
  assert.equal(first.results.repeatedBehaviorInAnotherContext.forms.count, 1_000);
  assert.equal(first.results.repeatedContextWithinDirectionCell.forms.count, 917);
  assert.equal(first.results.positiveReversePairedContentSlot.forms.count, 702);
  assert.equal(first.results.positiveReversePairedContentSlot.meanPairsPerForm, 1.104);
});
