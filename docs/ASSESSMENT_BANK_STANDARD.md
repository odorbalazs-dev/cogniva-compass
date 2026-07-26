# Cogniva Compass assessment-bank standard

## Intended use and limits

Cogniva Compass is an educational reflection tool for adults. The cognitive form reports a task-performance profile and the emotional form reports a self-reflection profile. Neither form is a standardized IQ test, a clinical EQ instrument, a diagnosis, or a substitute for an assessment by a qualified professional.

The item banks and equal item weights are structured content drafts. Every item carries `status: expert_review_required`. Population norms, cut scores, reliability, construct validity, measurement invariance and calibrated item parameters must not be claimed until an appropriately sampled pilot, expert review and psychometric analysis have been completed.

## Blueprint

| Track | Bank | Form | Domains | Form quota |
| --- | ---: | ---: | --- | --- |
| Cognitive skills | 250 | 20 | patterns, working memory, numerical reasoning, flexible thinking | 5 items per domain; one item at each difficulty level 1–5 per domain |
| Emotional skills | 250 | 24 | self-awareness, regulation, empathy, relationships | 6 items per domain; positive and reverse-keyed statements balanced within each domain where the pool permits |

Across each 250-item bank, difficulty levels 1–5 contain 50 items each. Domains contain 62 or 63 items. Stable IDs and `stemKey` values are language-independent so exposure history remains valid after a language switch.

## Item and scoring rules

- Cognitive items use four distinct response choices and one explicit correct index. Items avoid specialist knowledge and aim to measure the declared task domain rather than reading complexity.
- Emotional items use a consistent four-point frequency scale without a neutral midpoint. Positive and reverse-keyed statements are balanced to reduce acquiescence effects.
- Production score weights are deliberately equal (`scoreWeight: 1`). Difficulty and selection weights control form assembly only; they do not pretend to be empirically estimated item-response parameters.
- Domain scores are weighted percentages. The overall display is the equally weighted mean of the four domain percentages, so a larger pool in one domain cannot dominate the result.
- Results are descriptive. They must not be converted to an IQ number, clinical category, percentile, diagnosis or risk label.

## Form assembly and exposure control

Forms are assembled from blueprint cells rather than by unrestricted random sampling. Within eligible cells, the engine prioritizes unseen items, then uses selection weights. When all items in a cell have been seen, it chooses the least recently exposed items. The immediately previous form remains excluded whenever the bank contains an alternative.

The active form is saved in `sessionStorage`, which prevents a refresh from changing questions mid-form. Completed/started-form exposure is stored in `localStorage` as versioned question IDs only. Answers, scores and personal data are not stored. History is browser-local; clearing browser storage or using another browser/device starts a new history.

## Multilingual equivalence

All 11 locales are required on every item: Hungarian, English, German, Italian, Spanish, Simplified Chinese, Japanese, Arabic, Polish, Portuguese and French. Arabic is rendered right-to-left. Runtime selection never substitutes an English question inside another selected language.

Before public claims, translations require independent bilingual review and reconciliation. Reviewers should verify construct meaning, difficulty, reading level, cultural relevance, response-option ordering and absence of idioms that change the task. Statistical checks should then examine differential item functioning and measurement invariance by language.

## Release gates for validated measurement

1. Expert content review and cognitive interviewing in each language.
2. Accessibility and comprehension testing across intended adult audiences.
3. Pre-registered pilot sampling and item analysis.
4. Reliability estimates appropriate to each domain and intended interpretation.
5. Evidence for content, response-process, internal-structure and relations-to-other-variables validity.
6. Cross-language measurement-invariance and differential-item-functioning review.
7. Fairness, adverse-impact, privacy and security review.
8. Norming only on a documented representative sample, with confidence intervals and a maintenance/revalidation schedule.

## Standards used as design references

- AERA, APA and NCME, *Standards for Educational and Psychological Testing* (2014): https://www.testingstandards.net/uploads/7/6/6/4/76643089/standards_2014edition.pdf
- International Test Commission, *Guidelines for Translating and Adapting Tests*, second edition: https://www.intestcom.org/files/guideline_test_adaptation_2ed.pdf
- OECD, *PISA 2022 Technical Report* (test design, scaling and quality-control context): https://www.oecd.org/en/publications/pisa-2022-technical-report_01820d6d-en.html
- COSMIN guidance on measurement properties: https://www.cosmin.nl/tools/guideline-conducting-systematic-review-outcome-measures/

These references guide the blueprint, documentation and review process. Referencing them does not make this item bank standardized or validated.
