import test from "node:test";
import assert from "node:assert/strict";
import {
  InternalAuthError,
  signInternalRequest,
  signInternalResponse,
  verifyInternalRequest
} from "../src/internal-auth.js";
import {
  assertAggregateSnapshotSafe,
  buildAdminSnapshot,
  SnapshotSafetyError
} from "../src/admin-snapshot.js";

const SECRET = "test-only-secret-with-at-least-thirty-two-bytes";
const TIMESTAMP = 1_800_000_000;
const REQUEST = Object.freeze({
  secret: SECRET,
  keyId: "neuromap-dashboard-v1",
  timestamp: TIMESTAMP,
  nonce: "n_0123456789abcdefghijk",
  method: "GET",
  requestTarget: "/internal/admin/v1/snapshot",
  body: ""
});

test("internal auth signs and verifies exact request bytes with replay callback", async () => {
  const signed = signInternalRequest(REQUEST);
  let consumed = null;
  const result = await verifyInternalRequest({
    ...REQUEST,
    signature: signed.signature,
    now: TIMESTAMP * 1000,
    consumeNonce: async (value) => {
      consumed = value;
      return true;
    }
  });
  assert.equal(result.authenticated, true);
  assert.equal(result.bodyHash, signed.bodyHash);
  assert.equal(consumed.nonce, REQUEST.nonce);
  assert.equal(consumed.expiresAtEpochSeconds, TIMESTAMP + 60);
});

test("internal auth rejects tampering before consuming the nonce", async () => {
  const signed = signInternalRequest(REQUEST);
  let called = false;
  await assert.rejects(
    verifyInternalRequest({
      ...REQUEST,
      body: "tampered",
      signature: signed.signature,
      now: TIMESTAMP * 1000,
      consumeNonce: async () => {
        called = true;
        return true;
      }
    }),
    (error) => error instanceof InternalAuthError && error.code === "INVALID_AUTH_SIGNATURE"
  );
  assert.equal(called, false);
});

test("internal auth enforces 60 second timestamp window and fail-closed replay check", async () => {
  const signed = signInternalRequest(REQUEST);
  await assert.rejects(
    verifyInternalRequest({
      ...REQUEST,
      signature: signed.signature,
      now: (TIMESTAMP + 61) * 1000,
      consumeNonce: async () => true
    }),
    (error) => error.code === "AUTH_TIMESTAMP_OUTSIDE_WINDOW"
  );
  await assert.rejects(
    verifyInternalRequest({
      ...REQUEST,
      signature: signed.signature,
      now: TIMESTAMP * 1000,
      consumeNonce: async () => false
    }),
    (error) => error.code === "AUTH_REPLAY_DETECTED"
  );
  await assert.rejects(
    verifyInternalRequest({
      ...REQUEST,
      signature: signed.signature,
      now: TIMESTAMP * 1000
    }),
    (error) => error.code === "REPLAY_PROTECTION_NOT_CONFIGURED" && error.status === 500
  );
});

test("internal snapshot responses are signed over status and exact body bytes", () => {
  const first = signInternalResponse({
    secret: SECRET,
    keyId: REQUEST.keyId,
    timestamp: TIMESTAMP,
    requestNonce: REQUEST.nonce,
    statusCode: 200,
    body: '{"ok":true}'
  });
  const changed = signInternalResponse({
    secret: SECRET,
    keyId: REQUEST.keyId,
    timestamp: TIMESTAMP,
    requestNonce: REQUEST.nonce,
    statusCode: 200,
    body: '{"ok":false}'
  });
  assert.match(first.bodyHash, /^[a-f0-9]{64}$/);
  assert.notEqual(first.bodyHash, changed.bodyHash);
  assert.notEqual(first.signature, changed.signature);
  assert.equal(first.headers["x-cogniva-response-request-nonce"], REQUEST.nonce);
});

function snapshotQuery(statements) {
  return async (sql) => {
    statements.push(sql);
    if (sql.includes("cogniva_admin_snapshot:windows")) {
      return { rows: [{
        window_key: "last30d",
        orders_created: 12,
        paid: 8,
        refunded: 1,
        disputed: 0,
        reports_generated: 7,
        reports_failed: 1,
        emails_sent: 7,
        emails_delivered: 6,
        delivery_failures: 1
      }] };
    }
    if (sql.includes("cogniva_admin_snapshot:financials")) {
      return { rows: [
        { window_key: "last30d", currency: "USD", payment_count: 7, gross_minor: 5593, refunded_minor: 799 },
        { window_key: "last30d", currency: "EUR", payment_count: 2, gross_minor: 1598, refunded_minor: 0 }
      ] };
    }
    if (sql.includes("cogniva_admin_snapshot:breakdowns")) {
      return { rows: [
        { dimension: "product", code: "single_v1", order_count: 8, paid_count: 6 },
        { dimension: "product", code: "bundle_v1", order_count: 4, paid_count: 4 },
        { dimension: "track", code: "cognitive", order_count: 7, paid_count: 2 },
        { dimension: "track", code: "emotional", order_count: 3, paid_count: 2 },
        { dimension: "language", code: "en", order_count: 5, paid_count: 5 },
        { dimension: "language", code: "hu", order_count: 1, paid_count: 1 },
        { dimension: "policy", code: "policy-2026-08", order_count: 6, paid_count: 6 },
        { dimension: "product", code: "person@example.com", order_count: 99, paid_count: 99 }
      ] };
    }
    if (sql.includes("cogniva_admin_snapshot:operations")) {
      return { rows: [{
        report_queued: 1,
        report_processing: 1,
        report_retry: 0,
        report_failed: 1,
        delivery_sending: 1,
        delivery_sent: 2,
        delivery_delivered: 6,
        delivery_delayed: 0,
        delivery_bounced: 1,
        delivery_complained: 0,
        delivery_failed: 1,
        oldest_due_age_seconds: 120
      }] };
    }
    if (sql.includes("cogniva_admin_snapshot:webhooks")) {
      return { rows: [{ stripe_24h: 9, resend_24h: 7, stripe_unprocessed: 0, resend_unprocessed: 1 }] };
    }
    throw new Error("Unexpected snapshot query.");
  };
}

test("admin snapshot exposes only explicit aggregates and suppresses cells below k=5", async () => {
  const statements = [];
  const snapshot = await buildAdminSnapshot({
    query: snapshotQuery(statements),
    now: () => new Date("2027-01-15T12:00:00.000Z"),
    serviceVersion: "2.0.0",
    bankVersion: "banks-v3",
    scoringVersion: "scoring-v2"
  });

  assert.equal(snapshot.windows.last24h.ordersCreated, 0);
  assert.equal(snapshot.windows.last30d.paid, 8);
  assert.deepEqual(snapshot.breakdowns.product.rows.map((row) => row.code), ["single_v1"]);
  assert.equal(snapshot.breakdowns.product.suppressed, true);
  assert.equal(snapshot.breakdowns.track.rows[0].paidCount, null);
  assert.equal(snapshot.breakdowns.track.rows[0].paidCountSuppressed, true);
  assert.deepEqual(snapshot.financials.last30d.currencies.map((row) => row.currency), ["USD"]);
  assert.equal(snapshot.financials.last30d.suppressed, true);
  assert.equal(snapshot.financials.last30d.currencies[0].netMinor, 4794);
  assert.equal(snapshot.operations.webhooks.resendUnprocessed, 1);
  assert.equal(assertAggregateSnapshotSafe(snapshot), true);

  for (const sql of statements) {
    assert.doesNotMatch(sql, /SELECT\s+\*/iu);
    assert.doesNotMatch(sql, /orders\.email(?!_)/iu);
    assert.doesNotMatch(sql, /\b(scores|overall|report_content|consent_record|responses|access_token_hash)\b/iu);
  }
  const serialized = JSON.stringify(snapshot);
  assert.doesNotMatch(serialized, /person@example\.com/iu);
  assert.doesNotMatch(serialized, /rawresponses|reportcontent|consentrecord/iu);
});

test("snapshot safety guard fails closed on PII-shaped fields and values", () => {
  assert.throws(
    () => assertAggregateSnapshotSafe({ email: "hidden" }),
    (error) => error instanceof SnapshotSafetyError && error.code.includes("FORBIDDEN_SNAPSHOT_FIELD")
  );
  assert.throws(
    () => assertAggregateSnapshotSafe({ label: "person@example.com" }),
    (error) => error.code.includes("FORBIDDEN_SNAPSHOT_VALUE")
  );
  assert.throws(
    () => assertAggregateSnapshotSafe({ reference: "550e8400-e29b-41d4-a716-446655440000" }),
    (error) => error.code.includes("FORBIDDEN_SNAPSHOT_VALUE")
  );
});
