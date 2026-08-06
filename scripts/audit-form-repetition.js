import { pathToFileURL } from "node:url";
import { buildEmotionalBank } from "./bank-builders/emotional.js";

const DEFAULT_FORMS = 100_000;
const DEFAULT_SEED = 20_260_726;
const STEM_KEY_PATTERN = /^emotional\.([^.]+)\.(positive|reverse)\.c(\d{2})\.a(\d{2})$/;

function assertPositiveInteger(value, label) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive safe integer.`);
  }
}

function mulberry32(seed) {
  let state = seed >>> 0;
  return function randomUnit() {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  };
}

/**
 * Decode the bank builder's structural content coordinates. These coordinates
 * are explicit generation metadata, not a text-similarity heuristic.
 */
export function parseEmotionalStemKey(item) {
  const match = STEM_KEY_PATTERN.exec(String(item?.stemKey || ""));
  if (!match) {
    throw new Error(`${item?.id || "Unknown emotional item"}: stemKey does not expose context/action coordinates.`);
  }

  const [, domain, direction, context, action] = match;
  if (domain !== item.domain || direction !== item.direction) {
    throw new Error(`${item.id}: stemKey domain/direction disagrees with item metadata.`);
  }

  return {
    domain,
    direction,
    context: Number(context),
    action: Number(action),
    behaviorFamily: `${domain}|${direction}|a${action}`,
    contextWithinDirectionFamily: `${domain}|${direction}|c${context}`,
    pairedContentSlot: `${domain}|c${context}|a${action}`
  };
}

function selectionWeight(item) {
  const value = Number(item.selectionWeight);
  return Number.isFinite(value) && value > 0 ? value : 1;
}

function weightedChoice(items, randomUnit) {
  const total = items.reduce((sum, item) => sum + selectionWeight(item), 0);
  let cursor = randomUnit() * total;
  for (const item of items) {
    cursor -= selectionWeight(item);
    if (cursor < 0) return item;
  }
  return items[items.length - 1];
}

function weightedSample(items, count, randomUnit) {
  const pool = items.slice();
  const selected = [];
  while (pool.length && selected.length < count) {
    const item = weightedChoice(pool, randomUnit);
    selected.push(item);
    pool.splice(pool.indexOf(item), 1);
  }
  return selected;
}

function shuffle(items, randomUnit) {
  const copy = items.slice();
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomUnit() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function firstEmotionalForm(items, randomUnit) {
  const domains = [...new Set(items.map((item) => item.domain))];
  const selected = [];
  for (const domain of domains) {
    for (const direction of ["positive", "reverse"]) {
      const candidates = items.filter((item) => item.domain === domain && item.direction === direction);
      if (candidates.length < 3) throw new Error(`Cannot select three ${domain}/${direction} items.`);
      selected.push(...weightedSample(candidates, 3, randomUnit));
    }
  }
  // The production selector shuffles the completed form. The order is not
  // relevant to these metrics, but consuming the same PRNG calls makes the
  // deterministic simulation mirror its sampling cadence.
  return shuffle(selected, randomUnit);
}

function addToSetMap(map, key, value) {
  if (!map.has(key)) map.set(key, new Set());
  map.get(key).add(value);
}

function countRepeatedGroups(map) {
  let count = 0;
  for (const values of map.values()) {
    if (values.size > 1) count += 1;
  }
  return count;
}

function inspectForm(form, parsedById) {
  const behaviors = new Map();
  const contextsWithinDirection = new Map();
  const directionsByPairedSlot = new Map();

  for (const item of form) {
    const parsed = parsedById.get(item.id);
    addToSetMap(behaviors, parsed.behaviorFamily, parsed.context);
    addToSetMap(contextsWithinDirection, parsed.contextWithinDirectionFamily, parsed.action);
    addToSetMap(directionsByPairedSlot, parsed.pairedContentSlot, parsed.direction);
  }

  const repeatedBehaviorGroups = countRepeatedGroups(behaviors);
  const repeatedContextGroups = countRepeatedGroups(contextsWithinDirection);
  const positiveReversePairs = countRepeatedGroups(directionsByPairedSlot);

  return {
    repeatedBehaviorGroups,
    repeatedContextGroups,
    positiveReversePairs
  };
}

function incidence(count, total) {
  return {
    count,
    proportion: count / total,
    percent: Number(((count / total) * 100).toFixed(3))
  };
}

export function runFormRepetitionAudit({ forms = DEFAULT_FORMS, seed = DEFAULT_SEED } = {}) {
  assertPositiveInteger(forms, "forms");
  assertPositiveInteger(seed, "seed");

  const items = buildEmotionalBank();
  const parsedById = new Map(items.map((item) => [item.id, parseEmotionalStemKey(item)]));
  const randomUnit = mulberry32(seed);
  let formsWithRepeatedBehavior = 0;
  let formsWithRepeatedContext = 0;
  let formsWithPositiveReversePair = 0;
  let repeatedBehaviorGroups = 0;
  let repeatedContextGroups = 0;
  let positiveReversePairs = 0;

  for (let formIndex = 0; formIndex < forms; formIndex += 1) {
    const form = firstEmotionalForm(items, randomUnit);
    const inspected = inspectForm(form, parsedById);
    if (inspected.repeatedBehaviorGroups > 0) formsWithRepeatedBehavior += 1;
    if (inspected.repeatedContextGroups > 0) formsWithRepeatedContext += 1;
    if (inspected.positiveReversePairs > 0) formsWithPositiveReversePair += 1;
    repeatedBehaviorGroups += inspected.repeatedBehaviorGroups;
    repeatedContextGroups += inspected.repeatedContextGroups;
    positiveReversePairs += inspected.positiveReversePairs;
  }

  const cellSizes = {};
  for (const item of items) {
    const key = `${item.domain}/${item.direction}`;
    cellSizes[key] = (cellSizes[key] || 0) + 1;
  }

  return {
    audit: "cogniva-emotional-first-form-content-repetition",
    auditVersion: 1,
    simulation: {
      forms,
      seed,
      prng: "mulberry32",
      state: "fresh first form with empty exposure history",
      selector: "three weighted-without-replacement items per domain/direction cell, then Fisher-Yates shuffle"
    },
    bank: {
      items: items.length,
      formItems: 24,
      selectionWeights: [...new Set(items.map(selectionWeight))].sort((left, right) => left - right),
      domainDirectionCellSizes: cellSizes
    },
    metadataExtraction: {
      source: "item.stemKey",
      pattern: STEM_KEY_PATTERN.source,
      mode: "exact structural coordinates from the bank builder (no text-similarity inference)",
      definitions: {
        repeatedBehaviorInAnotherContext: "same domain + direction + action ordinal, at least two different context ordinals",
        repeatedContextWithinDirectionCell: "same domain + direction + context ordinal, at least two different action ordinals",
        positiveReversePairedContentSlot: "same domain + context ordinal + action ordinal selected in both scoring directions"
      },
      limitation: "A shared action ordinal across positive/reverse directions identifies the builder's paired structural slot; it does not establish that the two statements are validated semantic opposites or psychometrically equivalent."
    },
    results: {
      repeatedBehaviorInAnotherContext: {
        forms: incidence(formsWithRepeatedBehavior, forms),
        totalRepeatedGroups: repeatedBehaviorGroups,
        meanGroupsPerForm: Number((repeatedBehaviorGroups / forms).toFixed(6))
      },
      repeatedContextWithinDirectionCell: {
        forms: incidence(formsWithRepeatedContext, forms),
        totalRepeatedGroups: repeatedContextGroups,
        meanGroupsPerForm: Number((repeatedContextGroups / forms).toFixed(6))
      },
      positiveReversePairedContentSlot: {
        forms: incidence(formsWithPositiveReversePair, forms),
        totalPairs: positiveReversePairs,
        meanPairsPerForm: Number((positiveReversePairs / forms).toFixed(6))
      }
    }
  };
}

function formatPercent(result) {
  return `${result.percent.toFixed(3)}% (${result.count.toLocaleString("en-US")})`;
}

export function formatTextReport(report) {
  const behavior = report.results.repeatedBehaviorInAnotherContext;
  const context = report.results.repeatedContextWithinDirectionCell;
  const pairs = report.results.positiveReversePairedContentSlot;
  return [
    "Cogniva emotional first-form content-repetition audit",
    `Forms: ${report.simulation.forms.toLocaleString("en-US")}; seed: ${report.simulation.seed}; PRNG: ${report.simulation.prng}`,
    `Bank: ${report.bank.items} items; form: ${report.bank.formItems} items; selection weights: ${report.bank.selectionWeights.join(", ")}`,
    `Metadata: ${report.metadataExtraction.mode}`,
    "",
    `Repeated behavior in another context: ${formatPercent(behavior.forms)} forms; mean ${behavior.meanGroupsPerForm.toFixed(6)} repeated groups/form`,
    `Repeated context within a direction cell: ${formatPercent(context.forms)} forms; mean ${context.meanGroupsPerForm.toFixed(6)} repeated groups/form`,
    `Positive/reverse paired content slot: ${formatPercent(pairs.forms)} forms; mean ${pairs.meanPairsPerForm.toFixed(6)} pairs/form`,
    "",
    `Limitation: ${report.metadataExtraction.limitation}`
  ].join("\n");
}

function readCliOptions(argv) {
  const options = { forms: DEFAULT_FORMS, seed: DEFAULT_SEED, json: false };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--json") {
      options.json = true;
    } else if (argument === "--forms" || argument === "--seed") {
      const value = argv[index + 1];
      if (!value) throw new Error(`${argument} requires a value.`);
      options[argument.slice(2)] = Number(value);
      index += 1;
    } else if (argument.startsWith("--forms=")) {
      options.forms = Number(argument.slice("--forms=".length));
    } else if (argument.startsWith("--seed=")) {
      options.seed = Number(argument.slice("--seed=".length));
    } else if (argument === "--help" || argument === "-h") {
      options.help = true;
    } else {
      throw new Error(`Unknown argument: ${argument}`);
    }
  }
  return options;
}

function usage() {
  return [
    "Usage: node scripts/audit-form-repetition.js [options]",
    "",
    `  --forms <count>  Number of fresh first forms (default: ${DEFAULT_FORMS})`,
    `  --seed <integer> Fixed mulberry32 seed (default: ${DEFAULT_SEED})`,
    "  --json           Print machine-readable JSON",
    "  --help           Show this help"
  ].join("\n");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const options = readCliOptions(process.argv.slice(2));
    if (options.help) {
      console.log(usage());
    } else {
      const report = runFormRepetitionAudit(options);
      console.log(options.json ? JSON.stringify(report, null, 2) : formatTextReport(report));
    }
  } catch (error) {
    console.error(`Audit failed: ${error.message}`);
    process.exitCode = 1;
  }
}
