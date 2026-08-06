# Cogniva Compass commerce and deployment runbook

Last updated: 2026-07-31
Scope: Railway, PostgreSQL, Stripe Checkout, Resend, optional OpenAI, legal readiness, the Webflow loader and the aggregate NeuroMap dashboard gateway

> This runbook describes the implementation in this repository. It is not legal, tax, accounting or psychometric advice. It intentionally contains no live secret. USD 7.99 and USD 12.99 are the versioned application price contracts requested for this product; they remain subject to merchant, tax, invoicing and consumer-law approval before sale.

> Verification status: repository-level implementation and automated checks are documented here. No live-provider PostgreSQL/Stripe/Resend/OpenAI end-to-end pass or professional legal approval is evidenced by this repository; every corresponding launch item remains an explicit gate.

## Release posture

The free adult reflection can run without commerce providers. Paid reporting is fail-closed: `GET /api/config` returns `commerceReady: false` and no public price until every mandatory readiness field is configured and the server can retrieve and validate the configured Stripe Price. A server or provider configuration alone does not authorize a public sale; the launch gates below must also be signed off.

Current product boundary:

- the cognitive path is a non-standardized task sample, not an IQ test;
- the emotional path is an educational self-reflection, not a clinical EQ test;
- the on-screen summary remains free;
- `single_v1` is one selected cognitive or emotional email report for USD 7.99;
- `bundle_v1` is one cognitive and one emotional completion, one common order and one combined email report for USD 12.99;
- OpenAI may help phrase that report only after a separate opt-in. It never scores the assessment.

The price contracts above are enforced by server code against two dedicated Stripe Price objects. They do not mean that VAT treatment, invoicing, withdrawal wording, target markets or localized legal documents have been approved. All three legal files—`PRIVACY_NOTICE_TEMPLATE.md`, `TERMS_AND_CONSUMER_INFORMATION_TEMPLATE.md` and `DPIA.md`—remain drafts until every placeholder and approval field is completed.

## Architecture and data flow

```text
NeuroMap referral / Webflow page
  -> Railway-hosted loader, CSS, application and versioned banks
  -> free questionnaire and deterministic on-screen snapshot in the browser
  -> optional paid-report form with exact price and separate acknowledgements
  -> POST /api/checkout
       server validates form IDs/items and recomputes scores
       raw item responses are discarded after this request
       PostgreSQL stores one common order, normalized assessment rows and consent receipts
       Stripe creates one hosted Checkout Session from the server-side package Price
  -> signed Stripe webhook marks payment paid and queues the report
  -> database-backed worker claims the job with retry/backoff
  -> deterministic localized report OR separately consented OpenAI wording
  -> Resend sends the transactional email with an idempotency key
  -> signed Resend events update delivery/bounce state
  -> token-protected order status is shown after return from Checkout
```

The Stripe success redirect is not treated as proof of payment. Fulfilment starts only from a verified, idempotently recorded Stripe webhook. Cogniva tags the Checkout Session and PaymentIntent with only the opaque local `cogniva_order_id` plus `integration=cogniva_compass_v1`; it does not place email, answers, scores or result domains in Stripe metadata. The order access token is high-entropy, stored only as a SHA-256 hash in PostgreSQL and returned in a URL fragment so browsers do not send it as an HTTP referrer.

PostgreSQL stores email, language, the common order/package, normalized assessment rows, form/bank/scoring versions, domain summaries, consent receipts, provider IDs and payment/report/delivery states. `single_v1` has one cognitive or emotional child assessment; `bundle_v1` has one of each. It does not store raw response arrays or question text. Immediately before redirecting to Stripe, the Webflow-origin tab stores a one-hour checkout-recovery copy of the submitted completion in `sessionStorage`; this exists only to restore the result after cancellation and is cleared on success, return home, a new assessment or consumption/expiry. Application logs should never add email addresses, responses or scores.

## Railway and PostgreSQL

1. Connect the GitHub repository `odorbalazs-dev/cogniva-compass` to the existing Cogniva Compass Railway service.
2. Keep the repository root as the service root. `railway.toml` selects Nixpacks, runs `npm start`, checks `/health` and restarts failed instances.
3. Add a Railway PostgreSQL service to the same project.
4. In the application service, define `DATABASE_URL` as a Railway reference to the Postgres service's `DATABASE_URL` (for example `${{Postgres.DATABASE_URL}}`; use the actual service name shown in the project).
5. Set `DATABASE_SSL` according to the connection supplied by the provider. A private Railway connection normally does not need forced TLS; set it to `true` only when the selected connection requires SSL. The present client uses `rejectUnauthorized: false` when this flag is enabled, so document and review that decision before production.
6. Railway provides the linked PostgreSQL reference and its own `PORT`; it does not create Stripe keys, Stripe webhook secrets, Stripe Prices, Resend keys or Resend webhook secrets. Obtain those values from the corresponding vendor accounts, then store them as secret Variables on the Railway application service. Never put them in Git or Webflow.
7. Deploy. Verify that the migration runner applies `001_commerce.sql`, `002_products_legal_integration.sql` and `003_consent_content_version.sql` in order. The migrations are additive/idempotent; they add package snapshots, normalized child assessments, consent receipts, localized-content evidence and integration nonce/audit tables. Do not assume that the presence of a migration file proves it has run in the production database.
8. Verify `GET https://cogniva-compass-production.up.railway.app/health`. Expect `ok: true`, `databaseConfigured: true`, and—only after the full mandatory configuration—`commerceReady: true`.

The current report worker runs inside every web-service instance and coordinates claims with PostgreSQL `FOR UPDATE SKIP LOCKED`. This tolerates multiple instances, but production autoscaling, deploy overlap and alerting still need an operations test. Failed jobs retry with exponential backoff; stale `processing` jobs are recovered after 15 minutes. On startup and then every minute, maintenance recovers stale jobs and reconciles Resend events that arrived before the provider email ID was persisted. Personal-data expiry cleanup runs on startup and every six hours.

## Environment variables

Use `.env.example` as the non-secret checklist. Railway supplies `PORT`; do not set it unless a non-Railway host requires it.

| Variable | Production status | Purpose / accepted value |
| --- | --- | --- |
| `PORT` | Platform | HTTP port; Railway supplies it, local default is `3000` |
| `APP_BASE_URL` | Verify | Public Webflow origin and Stripe return destination, currently `https://cogniva-compass.webflow.io` |
| `SERVICE_BASE_URL` | Verify | Railway asset/API origin, currently `https://cogniva-compass-production.up.railway.app` |
| `ASSESSMENT_ACCESS_MODE` | Yes | `disabled` by default; `preview` permits browser-only pre-launch QA with commerce off; `production` enables the full legal gate only when every approval/readiness condition passes |
| `DATABASE_URL` | Yes | Railway reference to the linked PostgreSQL service; this is the only listed provider credential Railway can supply through service linking |
| `DATABASE_SSL` | Conditional | `true` only when the selected connection requires SSL; default `false` |
| `STRIPE_SECRET_KEY` | Yes | Stripe test/live secret key for the matching deployment mode |
| `STRIPE_WEBHOOK_SECRET` | Yes | Signing secret for this deployment's Stripe endpoint |
| `STRIPE_SINGLE_PRICE_ID` | Yes | Stripe Price for `single_v1`; exactly USD 7.99, active, fixed, one-time and tax-inclusive |
| `STRIPE_BUNDLE_PRICE_ID` | Yes | Different Stripe Price for `bundle_v1`; exactly USD 12.99, active, fixed, one-time and tax-inclusive |
| `STRIPE_AUTOMATIC_TAX` | Decision | `true` only after tax registration and automatic-tax setup are approved |
| `STRIPE_INVOICE_CREATION` | Decision | `true` only after invoice flow is approved; a Stripe invoice is not automatically a compliant Hungarian invoice |
| `RESEND_API_KEY` | Yes | API key for the verified Resend account/domain |
| `RESEND_WEBHOOK_SECRET` | Yes | Signing secret for Resend delivery events; missing it makes `commerceReady` false |
| `EMAIL_FROM` | Yes | Verified sender, for example `Cogniva Compass <reports@approved-domain.example>` |
| `EMAIL_REPLY_TO` | Optional | Monitored support reply address |
| `PRIVACY_URL` | Yes | Public approved privacy notice URL; use an HTTPS or localhost URL |
| `TERMS_URL` | Yes | Public approved terms/purchase/withdrawal information URL |
| `CONTACT_URL` | Yes | Public support, complaints and rights-request route |
| `POLICY_VERSION` | Yes | Immutable approved version/date; values ending in `-draft` disable checkout |
| `PRIVACY_VERSION` | Yes | Approved privacy notice version; `-draft` disables checkout |
| `TERMS_VERSION` | Yes | Approved terms/consumer information version; `-draft` disables checkout |
| `LEGAL_CONTENT_VERSION` | Yes | Exact approved 11-language consent-bundle version; any value containing `draft` disables production assessment start and checkout |
| `PRIVACY_DOCUMENT_SHA256` | Yes | Lowercase SHA-256 of the exact published privacy text |
| `TERMS_DOCUMENT_SHA256` | Yes | Lowercase SHA-256 of the exact published terms text |
| `LEGAL_CONSENT_SECRET` | Yes | Random server-only secret of at least 32 bytes used for tamper-evident consent proof |
| `CONTROLLER_LEGAL_NAME` | Yes | Approved full legal identity of the controller/trader |
| `REGISTERED_ADDRESS` | Yes | Approved registered/postal address |
| `CONTROLLER_COUNTRY` | Yes | Controller establishment country |
| `REGISTRATION_NO` | Legal decision | Company/registration number where applicable |
| `TAX_NO` | Tax decision | Tax/VAT number where applicable |
| `PRIVACY_EMAIL` | Yes | Monitored data-subject-rights address |
| `SUPPORT_EMAIL` | Yes | Monitored customer support/complaint address |
| `DPO_EMAIL` | Conditional | DPO contact if a DPO is appointed/required |
| `SUPERVISORY_AUTHORITY_NAME` | Yes | Competent authority identified after establishment/market review |
| `SUPERVISORY_AUTHORITY_URL` | Yes | Public HTTPS authority URL |
| `COGNIVA_ADMIN_INTEGRATION_KEY_ID` | Optional integration | Non-secret rotation identifier shared by the two backend services |
| `COGNIVA_ADMIN_INTEGRATION_SECRET` | Optional integration | Random shared HMAC secret of at least 32 bytes; backend Variables only |
| `COGNIVA_ADMIN_CLOCK_SKEW_SECONDS` | Optional integration | Signed-request time window, 30–300 seconds; default 60 |
| `REPORT_RETENTION_DAYS` | Policy | Personal-data expiry recorded on the order, 1–365 days; default 30; cleanup runs at startup and every six hours |
| `MAX_REPORT_ATTEMPTS` | Operations | Queue attempts, 1–12; default 5 |
| `REPORT_WORKER_INTERVAL_MS` | Operations | Queue poll interval, 1,000–60,000 ms; default 5,000 |
| `OPENAI_REPORT_ENABLED` | No | `false` by default; set `true` only after the AI launch gate |
| `OPENAI_API_KEY` | Only for AI | Server-side API key; never expose it to Webflow/browser code |
| `OPENAI_REPORT_MODEL` | Only for AI | Explicitly approved and evaluated model ID; there is intentionally no runtime default |

`commerceReady` requires `ASSESSMENT_ACCESS_MODE=production`, the database URL, Stripe secret/webhook secret and both Price IDs, Resend API key/webhook secret/sender, all public legal/support URLs, controller/contact fields, document hashes, a sufficiently long legal-consent secret and non-draft policy/privacy/terms/localized-content versions. `LEGAL_CONTENT_VERSION` must exactly match `window.COGNIVA_LEGAL_CONTENT_V1.version`; the API rejects stale or different localized copy. `/api/config` must keep checkout disabled unless both Prices pass their exact package contracts. The public label, amount, currency and tax behavior are derived from those verified Stripe Prices; there is no browser-supplied amount or separate price-label variable. A technical `true` still does not replace owner, legal or tax sign-off.

For pre-launch browser QA, set `ASSESSMENT_ACCESS_MODE=preview` only in the intended staging Railway environment. `/api/legal/config` then advertises preview access so the draft acknowledgement UI and local free result can be exercised without PostgreSQL. No `/api/legal/consent` call is made, no consent token is created, the Cogniva analytics option is hidden, and both the client and server prevent new checkout creation. Webflow-wide analytics/session replay must be disabled or separately assessed on the host page. Keep provider secrets empty in preview where practical. Change the mode to `production` only as part of the approved go-live checklist; an invalid or missing value fails closed as `disabled`.

Do not switch a service that has outstanding production Stripe Checkout Sessions into preview and assume they have disappeared: already-created provider URLs can remain payable and fulfillment intentionally continues for previously paid orders. Use a clean staging environment/test Stripe account, or expire and reconcile outstanding sessions before changing modes.

## Stripe setup

1. Decide the merchant entity, target countries, product classification, price, currency, tax treatment, invoice process, refunds/remedies and withdrawal wording with qualified legal/tax advisers.
2. In Stripe **test mode**, create dedicated one-time Prices for `single_v1` (USD 7.99) and `bundle_v1` (USD 12.99). Both must be active, fixed per-unit and `tax_behavior=inclusive`. Do not implement the bundle as quantity two, a coupon or a browser-calculated discount.
3. Put the resulting distinct `price_...` values in `STRIPE_SINGLE_PRICE_ID` and `STRIPE_BUNDLE_PRICE_ID`, and put the matching test secret in `STRIPE_SECRET_KEY`. The server retrieves each Price and verifies Price ID, amount, USD currency, fixed/one-time status and inclusive tax behavior before exposing it.
4. Add a webhook endpoint:

   ```text
   https://cogniva-compass-production.up.railway.app/api/webhooks/stripe
   ```

5. Subscribe it to exactly the events handled by the application:

   - `checkout.session.completed`
   - `checkout.session.async_payment_succeeded`
   - `checkout.session.async_payment_failed`
   - `checkout.session.expired`
   - `charge.succeeded`
   - `charge.refunded`
   - `charge.dispute.created`

6. Store that endpoint's signing secret as `STRIPE_WEBHOOK_SECRET`. Test-mode and live-mode endpoints have different secrets.
7. Leave `STRIPE_AUTOMATIC_TAX=false` and `STRIPE_INVOICE_CREATION=false` unless the corresponding business setup has been completed and tested. Stripe is the payment processor, not the merchant of record; enabling either flag does not replace merchant tax/invoice obligations.
8. Run a complete test purchase. Confirm that a signed webhook—not the success page—moves the local order to `paid`, queues the report and sends one email. Replay the event and verify no duplicate fulfilment.
9. Test delayed/asynchronous payment, expired Checkout, refund and dispute paths. Confirm the status endpoint never reveals an order without its access token.
10. Only after launch sign-off, repeat the Product/Price and endpoint configuration in live mode and atomically switch all Stripe values to the matching live set.

## Resend setup

1. Add and verify the approved sending domain in Resend. Complete the DNS records Resend supplies, including SPF/DKIM requirements, and choose a monitored reply/support path.
2. Create a restricted production API key and set `RESEND_API_KEY`, `EMAIL_FROM` and optionally `EMAIL_REPLY_TO`.
3. Add a webhook endpoint:

   ```text
   https://cogniva-compass-production.up.railway.app/api/webhooks/resend
   ```

4. Subscribe it to:

   - `email.sent`
   - `email.delivered`
   - `email.delivery_delayed`
   - `email.bounced`
   - `email.complained`
   - `email.failed`
   - `email.suppressed`

5. Set the endpoint signing secret as `RESEND_WEBHOOK_SECRET`.
6. Send test reports in all 11 languages, including Arabic RTL. Verify subject safety, links, plain text, price/currency, order record, spam placement, mobile rendering and reply handling.
7. Test duplicate webhook delivery and bounce/complaint/suppression operations. The send request uses `cogniva-report/<order-id>/<report-version>` as an idempotency key and tags the message with opaque `cogniva_order_id` plus `integration=cogniva_compass_v1`; PostgreSQL remains the durable source of truth.

## Optional OpenAI report wording

OpenAI is useful only as a constrained writing/localization layer for the detailed narrative. It cannot turn the current banks into validated IQ/EQ instruments and must never choose answers, calculate scores, create norms, diagnose, rank people or infer protected/health traits.

Default production recommendation: leave `OPENAI_REPORT_ENABLED=false` until the deterministic report is approved in every sold language. The deterministic localized report is not an error mode; it is the baseline product and permanent fallback.

Before enabling AI:

1. Complete the controller/processor, DPA, transfer, subprocessor, retention, DPIA and any Article 9 analysis.
2. Approve a specific model configuration and evaluate all 11 languages for diagnostic/normative claims, numerical consistency, cultural stereotyping, mistranslated negation, fear/shame and fabricated facts.
3. Ensure the purchase form presents a separate optional `aiConsent` choice. Refusal must not block purchase; it selects the deterministic report.
4. Set `OPENAI_API_KEY`, the evaluated `OPENAI_REPORT_MODEL` and then `OPENAI_REPORT_ENABLED=true`.

The implementation sends only locale, selected track, server-derived relative domain names/pattern and bank/scoring versions. It excludes numeric scores, email, identity, payment data, question text and raw answers, uses the Responses API with `store: false`, requests strict JSON Schema output, validates lengths/shape and rejects prohibited diagnostic/IQ/normative language. Timeout, refusal, schema failure or unsafe wording automatically produces the deterministic report.

## Webflow loader workflow

The public Webflow page is a host shell. Application code stays in this GitHub repository and is served from Railway.

1. In Webflow, use a blank page without a second navbar/footer and add one full-width Embed.
2. Paste the exact contents of `webflow/cogniva-compass-embed.html`; do not paste the full app or banks into Webflow.
3. Keep `https://cogniva-compass.webflow.io` in `APP_BASE_URL`. If a custom domain replaces it, update `APP_BASE_URL`, redeploy Railway and test CORS before publishing the Webflow domain.
4. A release that changes browser assets must bump the same cache version in:

   - `public/webflow-loader.js` (`VERSION`); and
   - `webflow/cogniva-compass-embed.html` (`?v=...`).

5. Push/deploy Railway first. Confirm the new loader, CSS, app and bank assets return successfully. Then publish the Webflow embed and hard-refresh desktop/mobile browsers.
6. Verify `?lang=hu` and all other supported codes (`hu`, `en`, `de`, `it`, `es`, `zh`, `ja`, `ar`, `pl`, `pt`, `fr`). Use a neutral referral such as:

   ```text
   https://cogniva-compass.webflow.io/?lang=hu&utm_source=neuromap
   ```

7. Never send track, answer, score, domain or email values to GTM, ad pixels, UTM parameters or URLs. Audit consent mode on the referring NeuroMap site separately.

## NeuroMap dashboard gateway

Cogniva and NeuroMap remain separate applications with separate PostgreSQL databases. The NeuroMap backend may request a read-only Cogniva operational snapshot, but it must never receive database credentials or execute cross-database queries. The response is an explicit aggregate allowlist only; email, name, order/session identifiers, form IDs, answers, raw responses, domain/overall scores, report content, consent records and provider IDs are forbidden.

The server-to-server request uses HMAC-SHA-256 over the exact method, request target, timestamp, nonce and body hash. The shared secret is stored only as Railway backend Variables on both services. Webflow and browser JavaScript never receive the secret and never call the internal endpoint directly. A short timestamp window and an atomically consumed hash-only nonce prevent replay. Requests and outcomes are audited using opaque event IDs and hashes, not request bodies or personal data.

Dimensional and monetary cohort rows with fewer than five records are omitted or represented as suppressed; the receiver must not derive, subtract or combine cells to reconstruct a suppressed cohort. The gateway is for operational/commercial aggregates, not individual support lookup, assessment review, profiling or automated decisions. See `docs/NEUROMAP_DASHBOARD_INTEGRATION.md` for the protocol, deployment and rotation checklist.

## Retention, privacy and support operations

`REPORT_RETENTION_DAYS` sets each order's personal-data expiry. Cleanup runs when commerce workers start and then every six hours. It replaces an expired email with `redacted+<order-id>@invalid.local`, clears scores and report content, sets the overall value to zero and clears error text. It also deletes incomplete/failed/expired unpaid orders older than two days and provider event records older than 90 days. Because payment, consent, order and provider-reference fields remain, this operation is pseudonymization and selective result erasure, not anonymization or complete erasure. Legal/accounting retention periods and data-subject workflows still need an explicit approved schedule and, where appropriate, additional operational tooling. Separately, the one-minute maintenance cycle reconciles pending Resend events and recovers report jobs stuck in `processing` for more than 15 minutes.

Before launch, document and test:

- access, correction, deletion, consent withdrawal and objection request intake;
- identity verification without collecting excessive data;
- which records must be retained for accounting, legal claims or fraud and how they are separated/restricted;
- deletion/retention behavior at Railway/PostgreSQL, Stripe, Resend, OpenAI and backups;
- bounce, complaint, failed report, refund, dispute and chargeback ownership;
- incident response, provider outage, key rotation, backup/restore and permanently failed queue alerts.

## Test and release checklist

Run locally and in CI:

```bash
npm install
npm run build:banks
node scripts/audit-form-repetition.js --forms 100000 --seed 20260726
npm run audit:all
npm audit --omit=dev
```

The repetition audit is deterministic for the supplied seed and supports `--json`. It derives context/action coordinates from `item.stemKey`. A positive/reverse paired slot is therefore a structural builder match, not evidence that the statements are validated semantic opposites or psychometrically equivalent.

Then use a dedicated test environment and provider test credentials:

- [ ] `/health` reports the expected service version and database configuration.
- [ ] `/api/config` exposes only public values and stays `commerceReady: false` when a mandatory field is removed.
- [ ] All 11 landing/question/result/report languages are complete; Arabic is RTL; no English fallback leaks into another selected language.
- [ ] Desktop and mobile flows work with keyboard, screen reader names, focus trap, Escape, back/exit confirmation and reduced motion.
- [ ] Server rejects altered form IDs, unknown/duplicate items, invalid response counts and client-supplied price manipulation.
- [ ] Stripe test cards cover success, failure, delayed payment, expiration and webhook replay/out-of-order delivery.
- [ ] Report generation is not triggered by query string or success redirect alone.
- [ ] Worker restart, stale claim recovery, retry exhaustion and duplicate email prevention are tested.
- [ ] Resend success, delayed, bounce, complaint, failed and suppressed events update status once.
- [ ] Retention cleanup and a representative data-subject request are exercised on seeded test data.
- [ ] No email, raw response, score or result domain appears in application/provider logs, analytics, URLs or Stripe metadata.
- [ ] If the dashboard gateway is enabled, invalid signatures, stale timestamps and nonce replay fail closed; browser access is impossible; k<5 dimensional/financial cells are suppressed; its payload passes the PII guard.
- [ ] Every purchased report includes the agreed product, exact price/currency/tax presentation, durable contract information, support route and approved legal links.
- [ ] OpenAI-off, AI-declined, AI-success, AI-timeout, unsafe-output and malformed-output paths all deliver the deterministic fallback where required.

## Launch blockers requiring owner/adviser decisions

Do not enable live payment or indexing until all items are resolved:

- merchant/trader legal identity, address, registration/tax details and monitored contact;
- explicit target countries (11 interface languages do not authorize worldwide sales);
- approved product classification, one-time price, currency, tax/VAT/OSS and invoice flow;
- localized privacy notice, terms, withdrawal/refund/remedy, complaint and accessibility information for every sales language;
- clear order-with-obligation-to-pay wording and legally reviewed immediate-performance acknowledgement;
- data inventory, lawful bases, Article 9 position, DPIA decision, processors/DPAs, transfers, retention and data-subject workflows;
- live Railway PostgreSQL, backups and restore test;
- Stripe Product/Price, signed webhooks, refunds/disputes runbook and test-to-live checklist;
- verified Resend domain, signed delivery webhook, bounce/complaint support and inbox testing;
- deterministic report review in every sales language;
- optional OpenAI vendor/privacy approval and multilingual safety/quality evals;
- dashboard data-flow/DPIA review, backend-only HMAC key ceremony, k<5 suppression test and confirmation that no Cogniva database credential is copied to NeuroMap;
- psychometric expert review and removal of any IQ/EQ, diagnosis, norm, percentile or stable-trait claim unsupported by evidence.

The detailed evidence and recommended validation programme are in `docs/DEEP_AUDIT_2026-07-26.md`.
