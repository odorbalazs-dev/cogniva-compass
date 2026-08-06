# Cogniva Compass

Independent, privacy-first multilingual cognitive and emotional skills reflection for adults. It is not an IQ test, diagnosis, clinical assessment, or substitute for a qualified professional.

The versioned banks contain 250 cognitive and 250 emotional items in every supported language. A cognitive form contains 20 questions (5 per domain, including one at each blueprint difficulty level); an emotional form contains 24 statements (6 per domain with balanced scoring direction).

After completion, the result page gives a positive, descriptive interpretation rather than a label: a cautious within-sample pattern, four domain explanations, practical next steps and guidance on how to read the snapshot. It intentionally hides numeric totals and categorical bands. Cognitive results describe performance on the current task sample; emotional results describe the respondent's current self-reported habits.

The repository contains two connected product layers:

- a free browser-based reflection and on-screen snapshot; and
- optional paid Personal Compass reports, fulfilled through PostgreSQL, Stripe Checkout and Resend, with deterministic report copy and an optional, separately consented OpenAI wording layer.

The server-owned paid packages are:

| Code | Content | Price |
| --- | --- | --- |
| `single_v1` | One selected cognitive or emotional report | USD 7.99 |
| `bundle_v1` | One cognitive and one emotional completion in one combined report/order | USD 12.99 |

These are application price contracts, not evidence of tax, invoicing, consumer-law or market approval. The browser selects only the package code. The backend maps it to a dedicated Stripe Price and rejects any Price that is not active, fixed, one-time, tax-inclusive, USD and exactly the contracted amount.

The paid path is fail-closed. It is not offered unless all mandatory commerce, email and legal configuration is present. The code is a production-oriented implementation scaffold, not evidence that the live merchant, legal, tax or provider setup is complete.

## Languages

Hungarian, English, German, Italian, Spanish, Simplified Chinese, Japanese, Arabic (RTL), Polish, Portuguese and French.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`. Health check: `/health`; public commerce readiness: `/api/config`.

Without provider environment variables, the landing page remains viewable, but the required consent receipt cannot be persisted, so assessment start and paid checkout stay unavailable. Copy `.env.example` to `.env` only for a local environment that loads dotenv itself, or set the variables in the shell/platform; the server does not load `.env` automatically.

Build and verify the banks before release:

```bash
npm run build:banks
node scripts/audit-form-repetition.js --forms 100000 --seed 20260726
npm run audit:all
```

The seeded repetition audit is deterministic and can also emit machine-readable output with `--json`. It reads the emotional builder coordinates from `stemKey`; a positive/reverse match therefore means the same structural slot, not a clinically or psychometrically validated opposite pair.

The design and validation boundaries are documented in `docs/ASSESSMENT_BANK_STANDARD.md`. The deep product, psychometric, legal and customer-experience findings are in `docs/DEEP_AUDIT_2026-07-26.md`. Provider setup and release operations are in `docs/COMMERCE_AND_DEPLOYMENT.md`. The aggregate-only server integration for the existing NeuroMap administration dashboard is specified in `docs/NEUROMAP_DASHBOARD_INTEGRATION.md`.

## Data boundaries

During the free path, answers and the on-screen result stay in browser memory. Repeat protection stores versioned question IDs in `sessionStorage` and `localStorage`; clearing browser data or changing browser/device resets that history.

If the user explicitly chooses a paid report, the browser sends the required completed response set or sets, email address and consent choices to the backend. The backend validates every form and recomputes scores from the versioned bank. Raw item responses are processed transiently and are not stored in PostgreSQL. Immediately before the Stripe redirect, the browser keeps a one-hour, tab-scoped `sessionStorage` recovery copy so a cancelled payment can return to the completed result; it is removed on success, return home, a new assessment or consumption/expiry. A common order stores the selected package, payment and delivery state; normalized child records store one assessment for `single_v1` or the cognitive and emotional assessments for `bundle_v1`. At startup and every six hours, configured retention replaces expired email addresses with synthetic values and clears result/report fields. Because order, consent and provider references remain, this is pseudonymization and result erasure, not anonymization or full deletion; the legal retention schedule still requires an approved business policy.

Stripe receives the payment and billing data required by Checkout. Resend receives the delivery address and localized report email. If, and only if, the user separately opts in and OpenAI reporting is enabled, OpenAI receives language, track, server-derived relative domain names/pattern and version identifiers—not numeric scores, the email address, payment data, raw answers or question text. Every AI failure falls back to the deterministic localized report.

## Webflow

Create a blank Webflow page without the default navbar or footer, add a single full-width Embed element and paste the contents of `webflow/cogniva-compass-embed.html`. The Webflow embed is intentionally a one-line external loader. The loader, HTML shell, styles and questionnaire runtime remain version-controlled in GitHub and are served by the independent Railway service.

Webflow page settings should use:

- title: `Cogniva Compass | Cognitive & Emotional Skills Reflection`
- description: `Explore cognitive approaches and emotional habits with two private, non-clinical reflections in 11 languages.`
- indexing disabled until privacy, terms and final content review are complete

The referral URL can pass only the language and ordinary campaign attribution, for example:

```text
https://cogniva-compass.webflow.io/?lang=hu&utm_source=neuromap
```

Do not place the chosen track, responses, scores or result domains in URLs, UTM parameters or analytics. After a loader release, update the cache version in both `public/webflow-loader.js` and `webflow/cogniva-compass-embed.html`, deploy Railway, publish Webflow, then verify the browser is loading the same version.

## Deployment

The repository contains `railway.toml`, uses Node.js 20+ and reads Railway's `PORT` automatically. A linked Railway PostgreSQL service supplies `DATABASE_URL`. Railway does **not** issue Stripe or Resend credentials: those originate in the merchant's Stripe and Resend accounts and are stored as secret Variables on the Railway application service. The paid flow also requires both dedicated Stripe Prices, signed provider webhook secrets, a verified Resend sender and approved legal configuration. The displayed package prices are retrieved and verified server-side; neither amount nor Stripe Price ID is accepted from the browser.

The privacy notice, terms/consumer information and DPIA files in `docs/` are implementation templates marked **DRAFT**. Assessment start and paid checkout must remain disabled while required identity fields or document hashes are missing, any legal/localized-content version is a draft, professional review is outstanding, or live provider end-to-end tests have not passed. The approved `LEGAL_CONTENT_VERSION` must exactly match the deployed 11-language consent bundle.

The optional NeuroMap dashboard connection keeps the Cogniva and NeuroMap databases separate. A backend-only HMAC gateway exposes an explicit aggregate allowlist, suppresses dimensional cohorts below five, and forbids email, order IDs, answers, scores, report content and other row-level data. No shared secret or Cogniva admin endpoint may be called from Webflow/browser code.

The code and automated tests do not prove that live PostgreSQL, Stripe, Resend or OpenAI provider flows have passed end-to-end testing, and no final legal approval is recorded in this repository. Do not commit secrets. Follow `docs/COMMERCE_AND_DEPLOYMENT.md` for the exact environment variables, webhook event lists, test sequence and launch blockers.
