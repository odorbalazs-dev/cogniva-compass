# Cogniva Compass — deep product, psychometric, UX and legal audit

Audit date: 2026-07-26<br>
Baseline reviewed: commit `7f542c5`
Audience: product owner, engineering, psychometric reviewers, legal counsel and release manager

> This document is a technical and product-risk audit, not legal advice or a psychometric validation study.

> Verification boundary: the repository implementation and automated/local checks were reviewed. No live PostgreSQL/Stripe/Resend/OpenAI provider end-to-end pass or professional legal approval is claimed here.

## 2026-07-31 implementation delta

The engineering controls below were added after the original 2026-07-26 baseline review:

- immutable application packages: `single_v1` (one assessment, USD 7.99) and `bundle_v1` (one cognitive plus one emotional assessment, USD 12.99), each mapped to a different exact Stripe Price and revalidated server-side;
- normalized child-assessment records so a bundle remains one order with two independently verified assessment results;
- a two-step pre-assessment gate in all 11 languages, including Arabic RTL, with separate required acknowledgements, optional analytics, no locale fallback and a signed 24-hour receipt;
- receipt binding to locale, the exact localized content-bundle version, policy/privacy/terms versions, and SHA-256 hashes of the published privacy and terms documents;
- checkout-only purchase terms, immediate-performance acknowledgement and optional AI wording choice;
- deterministic combined reports and a single combined email for the bundle;
- an aggregate-only NeuroMap dashboard provider endpoint with HMAC request and response authentication, a 60-second window, atomically consumed nonces, audited outcomes, a 64 KiB response limit and k<5 dimensional suppression;
- fulfillment continuity that does not stop already-paid report jobs merely because checkout/legal configuration is later rotated.

These controls are fail-closed for production. `public/legal-content.js`, the legal templates and the DPIA remain drafts, so production assessment start stays unavailable until the controller data, exact published documents/hashes, approved non-draft localized bundle version and professional sign-offs are supplied. A separately signalled `ASSESSMENT_ACCESS_MODE=preview` permits only browser-local pre-launch QA: it creates no consent receipt and exposes no checkout, email, analytics or AI processing. The NeuroMap repository still needs a separate reviewed server-side consumer/UI change; no browser-to-Cogniva dashboard call is permitted.

Final local verification on 2026-07-31: `npm run audit:all` passed the 250+250 bank audit, the seeded 100,000-form repetition audit, syntax checks and all 66 automated tests. `npm audit --omit=dev` reported 0 known dependency vulnerabilities. These are engineering checks, not psychometric, legal, tax or live-provider approval; the repetition simulation continues to show the material emotional content-family limitation documented below.

## Executive conclusion

Cogniva Compass is a well-structured multilingual educational prototype. Its 250 + 250 item banks, blueprint-based form assembly, browser-local exposure history and complete 11-language runtime are useful engineering foundations. It is **not yet a validated IQ/EQ test or standardized psychological measurement product**.

The safe near-term product is:

1. a free, explicitly non-standardized **cognitive task sample** or **emotional self-reflection**;
2. a descriptive, positive on-screen snapshot;
3. an optional paid Personal Compass report delivered by email;
4. deterministic server-side score verification;
5. optional OpenAI-assisted narrative only after separate informed consent, with a deterministic fallback.

Public paid launch remains blocked until the trader identity, target markets, tax/invoicing approach, privacy notice, terms, withdrawal/refund wording, localized consent copy and production secrets are completed and professionally reviewed. The package prices are fixed in code, but that does not approve their tax or consumer-law treatment.

## Maturity scorecard

| Area | Current maturity | Release implication |
| --- | --- | --- |
| Bank structure and automated checks | Strong prototype | Suitable for development and pilot use |
| Repeat protection | Good at item-ID level | Content-family repetition still needs work |
| Reliability, validity and norms | Not established | Blocks IQ/EQ, percentile and stable-trait claims |
| Cross-language measurement equivalence | Technically complete, empirically untested | Blocks equivalence claims across languages |
| Result UX | Qualitative-first local implementation | Numeric totals and categorical bands are hidden; psychometric claims remain blocked |
| Landing/customer journey | Rebuilt locally in the adult NeuroMap visual family | Needs live Webflow publication, approved legal destinations and production QA |
| Payment/email backend | Two exact packages and bundle fulfillment implemented | Needs live secrets, DB, provider webhooks and end-to-end test |
| Privacy/legal governance | Incomplete | Blocks paid launch |
| OpenAI narrative | Appropriate only as optional wording layer | Requires DPIA decision, DPA/vendor review and 11-language evals |

## P0 release blockers

### 1. No psychometric validity evidence

Every source item is marked `expert_review_required`. There is no population norming, reliability estimate, standard error of measurement, construct validation, criterion evidence, differential item functioning analysis or cross-language measurement invariance study.

A 250-item bank does not become a validated instrument because it is large. The required evidence concerns how people respond, whether the items measure the stated constructs and whether interpretations remain valid across groups and languages.

Public claims must therefore avoid:

- IQ test, EQ test, intelligence score or clinical emotional-intelligence score;
- percentile, norm, high/low ability, stable resource or validated band;
- diagnosis, risk classification or suitability conclusions;
- comparison between people, devices, languages or randomly assembled forms.

Primary references: [AERA–APA–NCME Standards](https://www.testingstandards.net/), [ITC test-adaptation guidance](https://www.intestcom.org/page/14), [COSMIN](https://www.cosmin.nl/).

### 2. Cognitive construct labels exceed the present item content

The cognitive bank is generated from roughly 18 number-based prompt families.

- “Working memory” items leave the information visible and mainly require sequence reversal or mental arithmetic; there is no controlled presentation, delay or recall condition.
- “Flexible thinking” items mainly apply fixed arithmetic rules; they do not establish set-shifting or perspective-switching ability.
- All four domains are strongly loaded by numeracy, schooling and arithmetic familiarity.
- Difficulty is provisional and mechanically coupled to task family rather than estimated from response data.
- Some distractor sets reveal the answer format without solving the intended task.

Safe interim labels are narrower, for example “active information handling” and “rule-based problem solving.”

### 3. Emotional bank has strong content-family dependence

The 250 apparent prompts are combinations of eight contexts with four positive and four reverse behavior statements per domain. They are not 250 independent behavioral indicators.

A reproducible 100,000-form simulation with a fixed seed found:

- 99.929% of first forms repeated the same behavior content in another context;
- 92.557% repeated a context within a direction cell;
- 71.076% contained at least one positive/reverse match in the same builder content slot;
- the average form contained 1.142170 such structural pairs.

Reproduce it from the repository root with:

```bash
node scripts/audit-form-repetition.js --forms 100000 --seed 20260726
```

The audit decodes explicit `domain`, `direction`, context ordinal and action ordinal coordinates from `item.stemKey`; it does not infer similarity from translated prompt text. A shared action ordinal across positive/reverse directions identifies the builder's paired structural slot only. It does not establish that the statements are validated semantic opposites or psychometrically equivalent.

This creates local dependence and a noticeable sense of repetition even when item IDs are unique. The form builder needs explicit `family`, `facet`, `context` and `oppositePair` metadata and constraints.

Additional content issues:

- no reference period such as “during the past four weeks”;
- no not-applicable option;
- high social-desirability transparency;
- possible reverse-item method factor;
- Western, verbally explicit communication norms may be over-rewarded.

### 4. Result precision exceeds available evidence

With five binary items per cognitive domain, a domain score can only be 0, 20, 40, 60, 80 or 100. One response changes a domain by 20 points. With six four-category emotional items, a single category step changes a domain by about 5.6 points.

The previous 40/70 cut points and “emerging/developing/established” language are not norms or standard-setting results. The simple mean of four domains is not an established higher-order construct. Random forms cannot be compared without calibration and linking.

Required product change:

- make the qualitative snapshot primary;
- keep any 0–100 values secondary and call them response-pattern details;
- do not rank a top domain as a stable strength or a bottom domain as a weakness;
- say that small differences may be chance variation;
- prohibit consequential uses.

### 5. Paid commerce cannot launch without legal identity and terms

Before purchase the user must receive, in each actually sold market and language:

- trader legal name, address, contact and registration/tax details as applicable;
- exact one-time price, currency, taxes and what is included;
- delivery timing, support and complaint process;
- terms, privacy notice, refund/remedy and withdrawal information;
- a clear “order with obligation to pay” action;
- durable confirmation of the contract and any immediate-performance acknowledgement.

Counsel must classify the report as a service or digital content under the applicable law. An unconditional “no refunds” clause is not acceptable. EU guidance explains the 14-day withdrawal baseline and the conditions for losing it after expressly requested digital performance: [Your Europe — returns](https://europa.eu/youreurope/citizens/consumers/shopping/returns/index_en.htm), [Consumer Rights Directive](https://eur-lex.europa.eu/eli/dir/2011/83/oj/eng).

### 6. Privacy governance and data-subject operations are incomplete

An emailed emotional profile linked to an address is personal data and can, depending on purpose and inference, reveal health-related information. Required before launch:

- processing inventory and purpose-by-purpose lawful-basis analysis;
- Article 9 decision and, if needed, separate explicit consent;
- processor list and DPAs for Railway/PostgreSQL, Stripe, Resend and optional OpenAI;
- transfer safeguards and subprocessor review;
- retention schedule and deletion implementation;
- access, deletion, correction, withdrawal and complaint workflow;
- incident-response process and records of processing;
- DPIA decision documented before processing begins.

The privacy notice must state controller identity, purposes, data categories, recipients, transfers, retention, rights, complaint route and automated/profiling logic where applicable. See [European Commission GDPR information requirements](https://commission.europa.eu/law/law-topic/data-protection/information-individuals_en) and [GDPR](https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng/).

### 7. Market scope, VAT, invoicing and accessibility are undecided

Eleven interface languages do not automatically mean the product is ready for sale in every country using those languages. Define target countries first.

- Stripe is a payment processor, not the merchant of record.
- EU VAT/OSS and Hungarian invoicing/record-retention requirements need tax advice: [EU VAT OSS](https://europa.eu/youreurope/business/taxation/vat/one-stop-shop/index_en.htm).
- A documented European Accessibility Act applicability assessment is needed for paid e-commerce: [European Accessibility Act](https://commission.europa.eu/strategy-and-policy/policies/justice-and-fundamental-rights/disability/european-accessibility-act-eaa_en).

## P1 product and customer-experience findings

### Brand and referral journey

The relevant source experience is most likely `neuromapkids.com`, not only the older child-questionnaire Webflow page. The hub already contains cognitive and emotional service cards, but they do not currently link to Cogniva.

Recommended neutral referral:

`https://cogniva-compass.webflow.io/?lang={lang}&utm_source=neuromap`

Do not put chosen track, answers, result domains or scores in UTM parameters or analytics.

The shared visual system is:

- blue `#1197d5`, dark blue `#0b6f9c`;
- orange `#ff7a00`, green `#72be00`;
- ink `#21313a`, muted `#667985`;
- paper `#f5faf7`, line `#dce8e3`;
- system/Inter-style sans, 8 px radii, light borders and subtle shadows.

Cogniva should use a small “by NeuroMap” bridge but remain an adult product, without the child illustration or child-oriented language.

### Landing and navigation

Previous issues:

- full-viewport hero left most of the first screen empty;
- native language select did not match the source journey;
- no `?lang=` handoff;
- marketing assets and the full ~1.2 MB bank loaded before intent;
- global CSS selectors risked styling the Webflow host page;
- logo or language change during a form discarded progress without warning;
- time estimates conflicted;
- footer lacked privacy, terms and contact links.

Required UX pattern:

1. short adult hero with the next section visible;
2. one primary “choose a reflection” CTA;
3. accessible 11-language modal that auto-opens only without a URL/saved choice;
4. modal focus trap, initial focus, Escape, backdrop close, focus return, background inert and scroll lock;
5. fixed header remains while marketing hides in questionnaire mode;
6. back button and explicit exit confirmation;
7. Arabic RTL scoped to the Cogniva root;
8. banks loaded only after assessment intent;
9. fixed domain display order;
10. legal/support links always available.

Post-audit implementation status: items 1–9 are implemented in the local build. The first desktop and mobile viewport both reveal the next section; the language modal has focus management, Escape/backdrop handling, background `inert`, scroll lock and all 11 explicit choices; Arabic is root-scoped RTL; the 1.2 MB assessment runtime loads only after a CTA; form exit is guarded; result domains stay in a fixed order; and checkout cancellation restores the just-completed result from one-hour, tab-scoped session storage. The result view no longer displays 0–100 values or categorical bands. Item 10 remains fail-closed: privacy, terms and contact links appear only when approved URLs are configured, so their absence still blocks paid launch.

Local visual evidence is stored in `docs/qa/landing-desktop.png`, `docs/qa/landing-mobile.png`, `docs/qa/language-modal-mobile.png`, `docs/qa/landing-arabic-mobile.png`, `docs/qa/quiz-mobile.png` and `docs/qa/result-mobile.png`. These are local-browser checks, not proof of the published Webflow/Railway/provider flow.

### Original hub analytics risk

The live `neuromapkids.com` source loaded Google Tag Manager immediately while the visible Squarespace configuration had the cookie banner disabled. Before referral and paid-funnel measurement, the controller should audit consent-mode implementation. Assessment selection, responses, scores and result domains must never be sent to advertising systems.

The hub source also contains hidden default wellness/shop template content. Removing it from the source, not merely hiding it with CSS, reduces SEO, accessibility and maintenance risk.

### Recommended customer journey

```text
NeuroMap hub referral
→ adult Cogniva landing
→ language confirmation
→ choose cognitive task sample or emotional self-reflection
→ two-step localized method/terms/privacy/explicit-consent gate
→ questionnaire
→ free deterministic on-screen snapshot
→ optional detailed report offer with exact price
→ separate purchase-terms/immediate-performance and optional AI choices
→ Stripe-hosted Checkout
→ signed, idempotent webhook
→ durable report job with retry
→ localized payment-status screen
→ localized transactional email
→ verified delivery/bounce state and support path
```

The free summary must not be unexpectedly hidden after completion. The paid value is the more detailed, portable explanation and email delivery.

## Security and commerce architecture review

The implementation added in this work follows these boundaries:

- product price comes only from two distinct active, fixed, one-time, tax-inclusive Stripe Prices referenced by server-side `STRIPE_SINGLE_PRICE_ID` and `STRIPE_BUNDLE_PRICE_ID`; each is checked against its exact USD 7.99/USD 12.99 application contract;
- the client cannot submit amount, currency or paid status;
- Stripe Checkout Session and PaymentIntent metadata contain only opaque `cogniva_order_id` plus `integration=cogniva_compass_v1`;
- Stripe webhook uses the unmodified raw body and official signature verification;
- provider event IDs are unique in PostgreSQL;
- payment fulfillment is webhook-driven, never success-page-driven;
- report creation is a durable queue state with claim/retry/backoff and stale-job recovery;
- Resend uses a per-order/report-version idempotency key;
- Resend webhook signature and event IDs protect delivery-state updates; opaque `cogniva_order_id` and `integration` tags support out-of-order reconciliation;
- report access uses a high-entropy token stored only as a SHA-256 hash;
- URL fragments hold the order access token, so it is not sent in HTTP referrers;
- request and application logs do not include email, answers or scores;
- raw item responses are validated and scored transiently, then discarded before the order is persisted;
- the database stores only email, language, package/common order, one or two normalized assessment summaries, consent receipts and provider IDs; it never stores raw item responses or question text;
- expired result/email data is pseudonymized or cleared at startup and every six hours; the remaining order, consent and provider references mean this is not anonymization or full deletion;
- a one-minute maintenance loop reconciles pending Resend events and recovers stale report jobs;
- the optional NeuroMap connection is backend-to-backend only, signs exact request and response bytes, rejects browser origins, consumes each nonce once and returns only allowlisted aggregates with small-cell suppression.

Stripe explicitly requires webhook-based and idempotent fulfillment because success redirects are not guaranteed and events can repeat: [Stripe fulfillment](https://docs.stripe.com/checkout/fulfillment), [webhook signature verification](https://docs.stripe.com/webhooks/signature?lang=node).

Resend idempotency lasts 24 hours, so it supplements rather than replaces durable database state: [Resend idempotency keys](https://resend.com/docs/dashboard/emails/idempotency-keys). Delivery, bounce, delayed, failed, complained and suppressed events must remain configured: [Resend event types](https://resend.com/docs/webhooks/event-types).

### Remaining commerce gaps before launch

These are unresolved gates, not completed live-provider or legal validations.

- live PostgreSQL service and migration verification;
- live Stripe Product/Price and test-mode purchase;
- production webhook endpoints and secrets;
- refund/dispute operational runbook and admin tooling;
- Resend domain verification, SPF/DKIM and provider webhook;
- invoice/tax decision and end-to-end confirmation email review;
- data-subject request endpoint or documented support workflow;
- monitoring and alerting for permanently failed report jobs;
- encrypted backup/restore test and secrets rotation procedure.

## OpenAI decision

### Recommendation

OpenAI can improve fluency, tone and localization of the detailed narrative. It does **not** improve reliability, validity, norms or item quality. It must never score the assessment or become the source of truth.

The safest release sequence is:

1. launch only after the deterministic report has been reviewed in all languages;
2. evaluate optional OpenAI wording offline;
3. complete DPIA/vendor/transfer decisions;
4. enable it as an explicit opt-in enhancement;
5. retain the deterministic fallback permanently.

### Implemented safety boundary

- deterministic server-side canonical scores;
- OpenAI receives only language, track, four domain summaries and version identifiers;
- no name, email, payment data, question text or raw responses;
- Responses API with `store: false` and strict JSON Schema;
- fixed section counts and length validation;
- blocked diagnostic, IQ, clinical and normative claims;
- positive but uncertainty-aware instructions;
- deterministic localized fallback on refusal, timeout, schema error or unsafe claim;
- disclosure in the delivered report;
- separate optional AI consent;
- AI disabled by default, with no implicit model fallback: an explicit evaluated model ID is required before readiness can become true.

OpenAI states that API data is not used for training by default, while default abuse-monitoring logs can be retained for up to 30 days; Responses API state controls and Zero Data Retention eligibility must be evaluated for the account: [OpenAI API data controls](https://platform.openai.com/docs/models/default-usage-policies-by-endpoint). Structured Outputs constrain output to a supplied JSON Schema: [OpenAI Structured Outputs](https://developers.openai.com/api/docs/guides/structured-outputs).

### Required AI evals

For every language, maintain test cases covering:

- diagnosis or health inference;
- stable ability/personality claims;
- percentile/normative comparison;
- protected-trait inference and cultural stereotyping;
- fear, shame, false reassurance and excessive confidence;
- mistranslated negation or reverse meaning;
- mixed-language or English-fallback output in a non-English report;
- fabricated facts not present in the four domain values;
- numerically inconsistent narrative;
- correct disclosure and deterministic fallback.

## Psychometric validation roadmap

1. Define intended population, use, constructs and permitted interpretations.
2. Rename or redesign domains whose items do not match the construct.
3. Replace numeric clones with independently authored items and explicit family/facet metadata.
4. Run expert content review, independent key verification and distractor review.
5. Conduct cognitive interviews in each target language/culture.
6. Run independent translation review and reconciliation, not only back-translation.
7. Pilot with balanced incomplete-block/spiral forms and common anchors.
8. Estimate item quality and reliability appropriate to each track.
9. Test dimensionality, local dependence, method factors, validity and fairness.
10. Test DIF and configural/metric/scalar invariance across languages.
11. Calibrate/link forms before any longitudinal or between-person comparison.
12. Create bands only through documented standard setting or representative norms, with uncertainty intervals.
13. Version bank, form, scoring and report logic and monitor drift continuously.

As a rough planning floor, about 200 usable responses per item already implies around 2,500 cognitive and 2,084 emotional completions per language under the present form lengths; DIF and invariance objectives may require substantially more. Final sample design must be simulation-based and reviewed by a psychometrician.

## Release gates

### Pilot-only gate

- [ ] All claims use task sample/self-reflection terminology.
- [ ] Domain labels match actual item content.
- [ ] Expert review and independent answer-key review complete.
- [ ] Translation review complete for the languages in the pilot.
- [ ] Participant information, consent and deletion process approved.
- [ ] No payment or public advertising claims.

### Paid limited-release gate

- [ ] Trader identity and target countries fixed.
- [ ] Exact product, price, currency, tax and invoice flow approved.
- [ ] Privacy, terms, withdrawal/refund, complaint and accessibility texts approved in every sales language.
- [ ] DPIA/Article 9/OpenAI decisions documented.
- [ ] PostgreSQL, Stripe and Resend live test passed, including duplicate and out-of-order webhooks.
- [ ] Email delivery failure, bounce, refund and dispute runbooks tested.
- [ ] Retention purge and data-subject request workflow tested.
- [ ] Deterministic report content professionally reviewed.
- [ ] No IQ/EQ, diagnostic, norm or stable-trait claims.

### Validated-measurement gate

- [ ] Pre-registered validation plan completed.
- [ ] Reliability and uncertainty documented.
- [ ] Construct, response-process, internal-structure and external-relation evidence documented.
- [ ] Cross-language DIF/invariance evidence acceptable.
- [ ] Calibrated/linkable forms and monitoring plan established.
- [ ] Claims and scoring reviewed against the collected evidence.

## Final risk decision

The engineering work can support a careful paid educational report after the commercial and legal launch gates are met. It cannot make the current item banks a validated IQ/EQ instrument. The highest-value next investment is expert item redevelopment and a multilingual pilot—not a more powerful language model.
