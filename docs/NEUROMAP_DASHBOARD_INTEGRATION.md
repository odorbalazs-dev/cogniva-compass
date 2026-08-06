# Cogniva Compass → NeuroMap dashboard integration

Last updated: 2026-07-31
Status: technical contract; **not a production activation record**

This document defines a privacy-preserving way to show Cogniva operational and commercial aggregates in the existing NeuroMap administration dashboard. It is not permission to combine respondent records, and it does not establish legal approval. The controller must add the real data flow to its ROPA/DPIA, access-control register, incident plan and retention schedule before enabling it.

## Non-negotiable boundary

- Cogniva and NeuroMap keep separate Railway services and separate PostgreSQL databases.
- No Cogniva database URL, database user or provider credential is copied into NeuroMap.
- No cross-database query, shared table, browser-side fetch or public CORS integration is allowed.
- The NeuroMap **backend** requests a read-only snapshot from the Cogniva **backend**. Only the resulting approved aggregates flow from Cogniva to NeuroMap.
- Webflow and dashboard browser code never receive the HMAC secret. The browser continues to authenticate only to the existing NeuroMap admin backend.
- The gateway has no row-level lookup, drill-through, export or write/control operation.

The safe flow is:

```text
authorized admin browser
  -> existing NeuroMap backend/session controls
  -> NeuroMap backend signs one fixed Cogniva snapshot request
  -> Cogniva verifies HMAC + time window + one-use nonce
  -> Cogniva queries only its own PostgreSQL database
  -> explicit aggregate allowlist + k<5 suppression + PII guard
  -> NeuroMap backend validates the schema and displays/caches aggregates only
```

## Allowed snapshot

The response schema is versioned as `cogniva-admin-snapshot-v1`. It may contain only:

- total operational counts for rolling 24-hour, 7-day and 30-day windows;
- paid/refunded/disputed totals and generated/failed report totals;
- sent/delivered/failure counts for transactional email;
- gross/refunded/net minor-unit totals grouped by currency;
- 30-day package, track, language and policy-version breakdowns;
- current queue, retry, delivery and provider-webhook health counts;
- service, bank and scoring version identifiers.

The following are forbidden anywhere in keys or values:

- email, name, address, IP address or user-agent;
- Cogniva order, Stripe session/payment/charge or Resend provider identifiers;
- access tokens, hashes usable as respondent identifiers or raw authorization values;
- form IDs, question IDs/text, answers or raw responses;
- domain scores, overall scores, report content or consent records;
- error text that may contain submitted/provider data;
- UUID-shaped row identifiers or free-form strings not in the allowlist.

The Cogniva response must pass the recursive PII/schema guard before serialization. NeuroMap must independently reject unknown top-level fields and incompatible schema versions; it must not render arbitrary metadata supplied by Cogniva.

## Small-cell rule

The minimum dimensional cohort size is **k=5**:

- a package, track, language, policy or currency cohort containing 1–4 records is omitted or marked `suppressed` with a `null` value;
- zero may be represented as zero because it identifies no respondent;
- the threshold must never be lowered below five by a request parameter;
- the dashboard must not calculate complements, differences, ratios or overlapping filters that reconstruct a suppressed cell;
- suppression is applied before the response leaves Cogniva, not only in the UI.

Global queue/webhook health counters are system-state metrics rather than person dimensions. They still receive no row identifiers and must not support filtering into respondent cohorts. If future filters or drill-downs are added, the DPIA and disclosure-control design must be reopened first.

## HMAC request contract

Implemented Cogniva provider route:

```text
GET /internal/admin/v1/snapshot
```

Required headers:

| Header | Meaning |
| --- | --- |
| `x-cogniva-auth-version` | Exactly `cogniva-hmac-v1` |
| `x-cogniva-key-id` | Rotation identifier, not a secret |
| `x-cogniva-timestamp` | Unix timestamp in seconds |
| `x-cogniva-nonce` | Cryptographically random base64url value, 16–128 characters |
| `x-cogniva-signature` | Base64url HMAC-SHA-256 signature |

Canonical bytes, joined with a single LF and no final LF:

```text
cogniva-hmac-v1
<key-id>
<unix-seconds>
<nonce>
<UPPERCASE-METHOD>
<exact-path-and-query>
<lowercase-sha256-of-exact-body-bytes>
```

For the GET snapshot, the body is empty but its SHA-256 is still signed. Both services must sign/verify the exact request target; proxies must not rewrite it after signing.

Verification order on Cogniva:

1. require the fixed route/method and supported auth version;
2. validate header formats and configured key ID;
3. reject timestamps outside the configured 30–300 second window (default 60);
4. recompute HMAC and compare in constant time;
5. atomically insert/consume the SHA-256 nonce hash in Cogniva PostgreSQL;
6. reject a duplicate nonce or replay fail-closed;
7. build and validate the aggregate snapshot;
8. append an audit event containing only opaque IDs/hashes, outcome and status.

Do not record the raw nonce, signature, secret, body, authorization headers or response payload. Expired nonce records should be deleted on a documented short operational schedule; audit retention requires a separate approved period.

## HMAC response contract

A successful `200` response is also signed so the NeuroMap backend can reject a tampered or substituted payload. It carries:

| Header | Meaning |
| --- | --- |
| `x-cogniva-response-auth-version` | Exactly `cogniva-hmac-response-v1` |
| `x-cogniva-response-key-id` | The authenticated request key ID |
| `x-cogniva-response-timestamp` | Unix timestamp in seconds |
| `x-cogniva-response-request-nonce` | Exact nonce from the authenticated request |
| `x-cogniva-response-body-sha256` | Lowercase SHA-256 of the exact response bytes |
| `x-cogniva-response-signature` | Base64url HMAC-SHA-256 signature |

Response canonical bytes, joined with a single LF and no final LF:

```text
cogniva-hmac-response-v1
<key-id>
<unix-seconds>
<request-nonce>
<http-status>
<lowercase-sha256-of-exact-response-body-bytes>
```

NeuroMap must buffer at most 64 KiB, verify the content type and status, hash the exact received bytes, compare the request nonce, enforce the same short timestamp window and verify the HMAC in constant time before parsing JSON. An unsigned error body is never a usable snapshot.

## Variables and ownership

On the Cogniva Railway backend:

```text
COGNIVA_ADMIN_INTEGRATION_KEY_ID=cogniva-dashboard-v1
COGNIVA_ADMIN_INTEGRATION_SECRET=<random value of at least 32 bytes>
COGNIVA_ADMIN_CLOCK_SKEW_SECONDS=60
```

The NeuroMap backend needs the fixed Cogniva service base URL plus the same active key ID/secret in its own Railway Variables. Receiver-side variable names depend on the NeuroMap codebase; document them there rather than exposing them in this repository.

Generate the secret with an approved cryptographic generator. Never paste it into Git, Webflow, a ticket, analytics, chat transcript or screenshot. Limit Railway access, enable MFA and maintain named owners for creation, rotation and emergency revocation.

Recommended rotation:

1. create a new key ID and secret;
2. temporarily allow both key IDs on Cogniva;
3. update NeuroMap and verify signed test requests;
4. remove the old key from both services;
5. record the rotation without recording either secret.

If only one key can be configured at a time, coordinate an atomic maintenance-window switch and accept fail-closed dashboard unavailability rather than bypassing authentication.

## Receiver requirements

The NeuroMap backend must:

- call only the configured HTTPS Cogniva origin; no user-controlled URL or redirect following;
- use a short connect/response timeout and bounded retry with a new nonce per attempt;
- verify HTTP status, content type, response-size limit and exact schema version;
- verify the successful response signature, timestamp, key ID, exact body hash and echoed request nonce before JSON parsing;
- avoid logging the signed headers or full response;
- cache only the aggregate snapshot for a short documented TTL, if caching is needed;
- show stale/unavailable state instead of falling back to direct database access;
- apply the existing NeuroMap admin authentication, authorization, MFA/session and audit controls;
- never expose a generic proxy endpoint capable of forwarding browser-supplied paths to Cogniva.

The Cogniva endpoint should additionally enforce a tight server-side rate limit. Network allowlisting may be added as defense in depth, but it does not replace HMAC, freshness or replay protection because Railway egress addresses and proxy topology can change.

## Failure behavior

- Unknown key/version, malformed signature, stale timestamp and replay: generic `401`; no detail useful for signature probing.
- Valid authentication but disallowed operation: `403` or `404`.
- Nonce database/replay-check failure: `503`, fail closed and return no snapshot.
- Snapshot validation/PII-guard failure: `500`, return no partial payload and alert the owner.
- Cogniva unavailable: NeuroMap displays an unavailable/stale indicator; it must not query Cogniva PostgreSQL directly.

## Production gate

- [ ] Both services use test/staging Variables first; no production secret is in repository history.
- [ ] The Cogniva migration containing nonce and integration-audit tables has run and been verified.
- [ ] The internal route is backend-only and absent from public browser/Webflow code.
- [ ] Correct signature succeeds; changed method/path/query/body fails.
- [ ] Timestamp outside the window fails.
- [ ] First nonce use succeeds and an exact replay fails, including across multiple Cogniva instances.
- [ ] Failure of the nonce database check fails closed.
- [ ] Snapshot schema rejects every forbidden PII/identifier field and UUID/email-shaped value.
- [ ] Every 1–4 dimensional or financial cohort is suppressed at source; k=5 is visible.
- [ ] Differential/subtraction attacks through filters are impossible because the endpoint exposes no arbitrary filters.
- [ ] Cogniva and NeuroMap databases/backups remain separate and no database credential is shared.
- [ ] Logs, tracing, error monitoring and audit rows contain no signed headers, PII or result data.
- [ ] Key rotation and emergency revocation are tested.
- [ ] ROPA/DPIA, access-control, retention and incident-response documentation includes this data flow.
- [ ] Production activation and its responsible approvers are recorded outside the source-code defaults.
