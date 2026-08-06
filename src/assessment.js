import { buildCognitiveBank } from "../scripts/bank-builders/cognitive.js";
import { buildEmotionalBank } from "../scripts/bank-builders/emotional.js";
import { BANK_VERSION } from "../scripts/bank-version.js";
import { validateProductTracks } from "./products.js";

export { BANK_VERSION };
export const SCORING_VERSION = "equal-domain-v1-provisional";

const TRACKS = Object.freeze({
  cognitive: Object.freeze({
    size: 20,
    domains: Object.freeze(["patterns", "workingMemory", "numericalReasoning", "flexibleThinking"])
  }),
  emotional: Object.freeze({
    size: 24,
    domains: Object.freeze(["selfAwareness", "regulation", "empathy", "relationships"])
  })
});

const BANKS = Object.freeze({
  cognitive: new Map(buildCognitiveBank().map((item) => [item.id, item])),
  emotional: new Map(buildEmotionalBank().map((item) => [item.id, item]))
});

export class AssessmentPayloadError extends Error {
  constructor(message, details = []) {
    super(message);
    this.name = "AssessmentPayloadError";
    this.status = 400;
    this.details = details;
  }
}

function assertTrack(value) {
  const track = String(value || "").toLowerCase();
  if (!TRACKS[track]) throw new AssessmentPayloadError("Unsupported assessment track.");
  return track;
}

function assertFormId(value, track) {
  const formId = String(value || "").trim();
  if (!new RegExp(`^${track}[-_][a-zA-Z0-9-]{8,100}$`).test(formId)) {
    throw new AssessmentPayloadError("Invalid assessment form identifier.");
  }
  return formId;
}

function countBy(items, selector) {
  return items.reduce((counts, item) => {
    const key = selector(item);
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, Object.create(null));
}

function validateBlueprint(track, items) {
  const definition = TRACKS[track];
  const domainCounts = countBy(items, (item) => item.domain);
  const expectedPerDomain = track === "cognitive" ? 5 : 6;

  for (const domain of definition.domains) {
    if (domainCounts[domain] !== expectedPerDomain) {
      throw new AssessmentPayloadError("The submitted form does not match the assessment blueprint.");
    }
  }

  if (Object.keys(domainCounts).some((domain) => !definition.domains.includes(domain))) {
    throw new AssessmentPayloadError("The submitted form contains an unsupported domain.");
  }

  if (track === "cognitive") {
    for (const domain of definition.domains) {
      const difficulties = items
        .filter((item) => item.domain === domain)
        .map((item) => Number(item.difficulty))
        .sort();
      if (difficulties.join(",") !== "1,2,3,4,5") {
        throw new AssessmentPayloadError("The submitted cognitive form has an invalid difficulty balance.");
      }
    }
    return;
  }

  for (const domain of definition.domains) {
    const directionCounts = countBy(
      items.filter((item) => item.domain === domain),
      (item) => item.direction
    );
    if (directionCounts.positive !== 3 || directionCounts.reverse !== 3) {
      throw new AssessmentPayloadError("The submitted emotional form has an invalid direction balance.");
    }
  }
}

function scoreItem(track, item, answer) {
  if (!Number.isInteger(answer)) {
    throw new AssessmentPayloadError("Every answer must be an integer option index.");
  }
  if (track === "cognitive") {
    if (answer < 0 || answer > 3) throw new AssessmentPayloadError("A cognitive answer is outside the available choices.");
    return answer === item.correctIndex ? 100 : 0;
  }
  if (answer < 0 || answer > 3) throw new AssessmentPayloadError("An emotional answer is outside the response scale.");
  const aligned = item.direction === "reverse" ? 3 - answer : answer;
  return (aligned / 3) * 100;
}

export function canonicalizeAssessment(payload = {}) {
  const track = assertTrack(payload.track);
  const formId = assertFormId(payload.formId, track);
  const responses = Array.isArray(payload.responses) ? payload.responses : null;
  const definition = TRACKS[track];

  if (!responses || responses.length !== definition.size) {
    throw new AssessmentPayloadError(`This form requires exactly ${definition.size} responses.`);
  }

  const bank = BANKS[track];
  const ids = new Set();
  const resolved = responses.map((response) => {
    const id = String(response?.id || "").trim();
    if (!/^(COG|EMO)-\d{3}$/.test(id) || ids.has(id)) {
      throw new AssessmentPayloadError("The response list contains an invalid or duplicate item identifier.");
    }
    ids.add(id);
    const item = bank.get(id);
    if (!item) throw new AssessmentPayloadError("The response list contains an unknown item.");
    const answer = response?.answer;
    if (typeof answer !== "number" || !Number.isInteger(answer)) {
      throw new AssessmentPayloadError("Every response must contain one numeric answer index.");
    }
    return { item, answer };
  });

  validateBlueprint(track, resolved.map(({ item }) => item));

  const totals = Object.fromEntries(definition.domains.map((domain) => [domain, { sum: 0, weight: 0 }]));
  for (const { item, answer } of resolved) {
    const rawWeight = Number(item.scoreWeight ?? 1);
    if (!Number.isFinite(rawWeight) || rawWeight <= 0) {
      throw new Error(`Invalid server-side score weight for ${item.id}.`);
    }
    totals[item.domain].sum += scoreItem(track, item, answer) * rawWeight;
    totals[item.domain].weight += rawWeight;
  }

  const preciseScores = Object.fromEntries(
    definition.domains.map((domain) => [domain, totals[domain].sum / totals[domain].weight])
  );
  const scores = Object.fromEntries(
    definition.domains.map((domain) => [domain, Math.round(preciseScores[domain])])
  );
  const overall = Math.round(
    definition.domains.reduce((sum, domain) => sum + preciseScores[domain], 0) /
      definition.domains.length
  );

  return Object.freeze({
    track,
    formId,
    bankVersion: BANK_VERSION,
    scoringVersion: SCORING_VERSION,
    itemIds: Object.freeze(resolved.map(({ item }) => item.id)),
    scores: Object.freeze(scores),
    preciseScores: Object.freeze(preciseScores),
    overall
  });
}

export function assessmentDefinition(track) {
  return TRACKS[assertTrack(track)];
}

export function canonicalizeOrderAssessments(packageCode, values) {
  if (!Array.isArray(values)) throw new AssessmentPayloadError("Assessments must be supplied as a list.");
  validateProductTracks(packageCode, values.map((value) => value?.track));
  const assessments = values.map((value) => canonicalizeAssessment(value));
  if (new Set(assessments.map((assessment) => assessment.formId)).size !== assessments.length) {
    throw new AssessmentPayloadError("Each assessment in an order must use a different form identifier.");
  }
  const trackOrder = Object.freeze({ cognitive: 0, emotional: 1 });
  assessments.sort((left, right) => trackOrder[left.track] - trackOrder[right.track]);
  return Object.freeze(assessments);
}
