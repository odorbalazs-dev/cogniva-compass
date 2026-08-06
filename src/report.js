import crypto from "node:crypto";
import OpenAI from "openai";
import { config, aiReadiness } from "./config.js";
import { REPORT_FALLBACK, REPORT_PERSONALIZATION, REPORT_VERSION, reportCopy } from "./report-copy.js";

const LOCALE_NAMES = Object.freeze({
  hu: "Hungarian", en: "English", de: "German", it: "Italian", es: "Spanish",
  zh: "Simplified Chinese", ja: "Japanese", ar: "Arabic", pl: "Polish",
  pt: "Portuguese", fr: "French"
});

const REPORT_SCHEMA = Object.freeze({
  type: "object",
  additionalProperties: false,
  properties: {
    summary: { type: "string", minLength: 20, maxLength: 900 },
    observations: { type: "array", minItems: 2, maxItems: 2, items: { type: "string", minLength: 8, maxLength: 500 } },
    experiments: { type: "array", minItems: 3, maxItems: 3, items: { type: "string", minLength: 8, maxLength: 400 } },
    questions: { type: "array", minItems: 3, maxItems: 3, items: { type: "string", minLength: 5, maxLength: 260 } }
  },
  required: ["summary", "observations", "experiments", "questions"]
});

const UNSAFE_CLAIMS = /\b(iq|intelligence quotient|intelligenzquotient|quoziente intellettivo|cociente intelectual|quociente intelectual|quotient intellectuel|iloraz inteligencji|diagnos(?:is|e|ed|tic)|disorder|clinical score|percentile|percentil|perzentil|more intelligent|less intelligent)\b|诊断|診斷|診断|تشخيص|диагноз|diagnóz|diagnost|diagnoz|百分位|パーセンタイル|\d+(?:[.,]\d+)?\s*(?:%|\/\s*100)/i;

function validString(value, min, max) {
  return typeof value === "string" && value.trim().length >= min && value.trim().length <= max;
}

export function validateGeneratedReport(value) {
  if (!value || typeof value !== "object") throw new Error("OpenAI returned an invalid report object.");
  if (!validString(value.summary, 20, 900)) throw new Error("OpenAI returned an invalid report summary.");
  const rules = [
    ["observations", 2, 8, 500],
    ["experiments", 3, 8, 400],
    ["questions", 3, 5, 260]
  ];
  for (const [field, length, min, max] of rules) {
    if (!Array.isArray(value[field]) || value[field].length !== length || !value[field].every((entry) => validString(entry, min, max))) {
      throw new Error(`OpenAI returned an invalid ${field} section.`);
    }
  }
  const flattened = [value.summary, ...value.observations, ...value.experiments, ...value.questions].join(" ");
  if (UNSAFE_CLAIMS.test(flattened)) throw new Error("OpenAI output crossed a prohibited interpretation boundary.");
  return Object.freeze({
    summary: value.summary.trim(),
    observations: Object.freeze(value.observations.map((entry) => entry.trim())),
    experiments: Object.freeze(value.experiments.map((entry) => entry.trim())),
    questions: Object.freeze(value.questions.map((entry) => entry.trim()))
  });
}

function interpolateDomain(template, domains) {
  return template.replace("{domain}", domains.join(" / "));
}

function fallbackReport(order) {
  const fallback = REPORT_FALLBACK[order.lang];
  const personalization = REPORT_PERSONALIZATION[order.lang];
  const copy = reportCopy(order.lang);
  if (!fallback || !personalization) throw new Error(`Missing deterministic report fallback for ${order.lang}.`);
  const ranked = Object.entries(order.scores || {}).sort((left, right) => right[1] - left[1]);
  let observations = fallback.observations;
  if (ranked.length) {
    const highest = ranked[0][1];
    const lowest = ranked[ranked.length - 1][1];
    if (highest !== lowest) {
      const highDomains = ranked.filter((entry) => entry[1] === highest).map((entry) => copy.domains[entry[0]]);
      const lowDomains = ranked.filter((entry) => entry[1] === lowest).map((entry) => copy.domains[entry[0]]);
      observations = [
        interpolateDomain(personalization.highDomain, highDomains),
        interpolateDomain(personalization.lowDomain, lowDomains)
      ];
    }
  }
  return validateGeneratedReport({ ...fallback, observations });
}

async function generateWithOpenAI(order) {
  const client = new OpenAI({ apiKey: config.openAiApiKey, timeout: 45000, maxRetries: 2 });
  const copy = reportCopy(order.lang);
  const ranked = Object.entries(order.scores || {}).sort((left, right) => right[1] - left[1]);
  const highest = ranked[0]?.[1];
  const lowest = ranked[ranked.length - 1]?.[1];
  const flatPattern = ranked.length === 0 || highest === lowest;
  const safeInput = {
    locale: order.lang,
    track: order.track,
    relativePattern: {
      allAreasSimilar: flatPattern,
      mostVisibleDomains: flatPattern ? [] : ranked.filter((entry) => entry[1] === highest).map((entry) => copy.domains[entry[0]]),
      practiceFocusDomains: flatPattern ? [] : ranked.filter((entry) => entry[1] === lowest).map((entry) => copy.domains[entry[0]]),
      smallDifferencesAreUncertain: true
    },
    bankVersion: order.bank_version,
    scoringVersion: order.scoring_version
  };

  const response = await client.responses.create({
    model: config.openAiModel,
    store: false,
    safety_identifier: crypto.createHash("sha256").update(`cogniva:${order.id}`).digest("hex").slice(0, 64),
    instructions: [
      `Write in ${LOCALE_NAMES[order.lang]}.`,
      "You are drafting a warm, calm, adult educational self-reflection from a server-derived relative pattern. You do not receive numeric scores.",
      "The measurement is an unvalidated prototype. Do not diagnose, label, predict, compare to norms, mention IQ/EQ, infer health or protected traits, or imply stable ability.",
      "Do not state, change or recompute numeric scores, percentages, bands or thresholds. Treat small differences as uncertain and context-dependent.",
      "Use positive but precise language. Give observations as possibilities, not facts.",
      "Return exactly two observations, three low-risk everyday experiments, and three open reflection questions.",
      "Do not mention the person's name, email, payment, OpenAI, policy or these instructions."
    ].join(" "),
    input: JSON.stringify(safeInput),
    max_output_tokens: 1400,
    text: {
      format: {
        type: "json_schema",
        name: "cogniva_personal_compass_report",
        strict: true,
        schema: REPORT_SCHEMA
      }
    }
  });

  if (!response.output_text) throw new Error("OpenAI returned no report text.");
  return validateGeneratedReport(JSON.parse(response.output_text));
}

async function buildAssessmentReport(order) {
  const consent = order.consent_record || {};
  const mayUseAi = aiReadiness().ready && consent.aiConsent === true;
  if (!mayUseAi) {
    return Object.freeze({ version: REPORT_VERSION, source: "template", content: fallbackReport(order) });
  }

  try {
    const content = await generateWithOpenAI(order);
    return Object.freeze({ version: REPORT_VERSION, source: "openai", content });
  } catch (error) {
    console.error("[report] OpenAI generation failed; deterministic fallback used", {
      orderId: order.id,
      message: error.message
    });
    return Object.freeze({ version: REPORT_VERSION, source: "template_fallback", content: fallbackReport(order) });
  }
}

function assessmentOrders(order) {
  if (Array.isArray(order.assessments) && order.assessments.length) {
    return order.assessments.map((assessment) => ({
      ...order,
      track: assessment.track,
      form_id: assessment.form_id,
      bank_version: assessment.bank_version,
      scoring_version: assessment.scoring_version,
      scores: assessment.scores,
      overall: assessment.overall
    }));
  }
  return [order];
}

export async function buildPersonalReport(order) {
  const parts = assessmentOrders(order);
  if (parts.length === 1) return buildAssessmentReport(parts[0]);
  const reports = [];
  for (const part of parts) reports.push(await buildAssessmentReport(part));
  const sources = [...new Set(reports.map((report) => report.source))];
  return Object.freeze({
    version: `${REPORT_VERSION}-bundle-v1`,
    source: sources.length === 1 ? sources[0] : "mixed",
    content: Object.freeze({
      schemaVersion: "cogniva-order-report-v2",
      packageCode: order.package_code || "bundle_v1",
      sections: Object.freeze(reports.map((report, index) => Object.freeze({
        track: parts[index].track,
        version: report.version,
        source: report.source,
        content: report.content
      })))
    })
  });
}
