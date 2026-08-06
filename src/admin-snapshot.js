const WINDOW_KEYS = Object.freeze(["last24h", "last7d", "last30d"]);
const DIMENSIONS = Object.freeze(["product", "track", "language", "policy"]);
const SUPPORTED_TRACKS = new Set(["cognitive", "emotional"]);
const SUPPORTED_LANGUAGES = new Set(["hu", "en", "de", "it", "es", "zh", "ja", "ar", "pl", "pt", "fr"]);
const SAFE_CODE_PATTERN = /^[a-z0-9][a-z0-9._-]{0,63}$/u;
const EMAIL_PATTERN = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/u;
const UUID_PATTERN = /\b[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\b/iu;
const FORBIDDEN_KEYS = new Set([
  "id", "orderid", "sessionid", "email", "emailaddress", "name", "fullname",
  "ip", "ipaddress", "useragent", "accesstoken", "accesstokenhash", "responses",
  "rawresponses", "answers", "scores", "overall", "reportcontent", "consentrecord",
  "stripecheckoutsessionid", "stripepaymentintentid", "stripechargeid", "providerid",
  "errormessage"
]);

const WINDOW_METRICS_SQL = `/* cogniva_admin_snapshot:windows */
WITH metric_windows(window_key, starts_at) AS (
  VALUES
    ('last24h', $1::timestamptz - INTERVAL '24 hours'),
    ('last7d',  $1::timestamptz - INTERVAL '7 days'),
    ('last30d', $1::timestamptz - INTERVAL '30 days')
)
SELECT
  windows.window_key,
  COUNT(*) FILTER (WHERE orders.created_at >= windows.starts_at)::int AS orders_created,
  COUNT(*) FILTER (WHERE orders.paid_at >= windows.starts_at)::int AS paid,
  COUNT(*) FILTER (WHERE orders.refunded_at >= windows.starts_at)::int AS refunded,
  COUNT(*) FILTER (WHERE orders.disputed_at >= windows.starts_at)::int AS disputed,
  COUNT(*) FILTER (WHERE orders.report_generated_at >= windows.starts_at)::int AS reports_generated,
  COUNT(*) FILTER (
    WHERE orders.report_status = 'failed' AND orders.updated_at >= windows.starts_at
  )::int AS reports_failed,
  COUNT(*) FILTER (WHERE orders.email_sent_at >= windows.starts_at)::int AS emails_sent,
  COUNT(*) FILTER (WHERE orders.email_delivered_at >= windows.starts_at)::int AS emails_delivered,
  COUNT(*) FILTER (
    WHERE orders.delivery_status IN ('bounced','complained','failed','suppressed')
      AND orders.updated_at >= windows.starts_at
  )::int AS delivery_failures
FROM metric_windows AS windows
LEFT JOIN assessment_orders AS orders ON TRUE
GROUP BY windows.window_key;
`;

const FINANCIALS_SQL = `/* cogniva_admin_snapshot:financials */
WITH metric_windows(window_key, starts_at) AS (
  VALUES
    ('last24h', $1::timestamptz - INTERVAL '24 hours'),
    ('last7d',  $1::timestamptz - INTERVAL '7 days'),
    ('last30d', $1::timestamptz - INTERVAL '30 days')
)
SELECT
  windows.window_key,
  UPPER(orders.currency) AS currency,
  COUNT(*)::int AS payment_count,
  COALESCE(SUM(orders.amount_total), 0)::bigint AS gross_minor,
  COALESCE(SUM(orders.amount_refunded), 0)::bigint AS refunded_minor
FROM metric_windows AS windows
JOIN assessment_orders AS orders
  ON orders.paid_at >= windows.starts_at
WHERE orders.currency ~ '^[A-Za-z]{3}$'
  AND orders.amount_total IS NOT NULL
GROUP BY windows.window_key, UPPER(orders.currency)
ORDER BY windows.window_key, currency;
`;

const BREAKDOWNS_SQL = `/* cogniva_admin_snapshot:breakdowns */
SELECT 'product' AS dimension, package_code AS code,
       COUNT(*)::int AS order_count,
       COUNT(*) FILTER (WHERE paid_at IS NOT NULL)::int AS paid_count
FROM assessment_orders
WHERE created_at >= $1::timestamptz - INTERVAL '30 days'
GROUP BY package_code
UNION ALL
SELECT 'track', assessments.track, COUNT(*)::int,
       COUNT(*) FILTER (WHERE orders.paid_at IS NOT NULL)::int
FROM assessment_order_assessments AS assessments
JOIN assessment_orders AS orders ON orders.id=assessments.order_id
WHERE orders.created_at >= $1::timestamptz - INTERVAL '30 days'
GROUP BY assessments.track
UNION ALL
SELECT 'language', lang, COUNT(*)::int,
       COUNT(*) FILTER (WHERE paid_at IS NOT NULL)::int
FROM assessment_orders
WHERE created_at >= $1::timestamptz - INTERVAL '30 days'
GROUP BY lang
UNION ALL
SELECT 'policy', policy_version, COUNT(*)::int,
       COUNT(*) FILTER (WHERE paid_at IS NOT NULL)::int
FROM assessment_orders
WHERE created_at >= $1::timestamptz - INTERVAL '30 days'
GROUP BY policy_version;
`;

const OPERATIONS_SQL = `/* cogniva_admin_snapshot:operations */
SELECT
  COUNT(*) FILTER (WHERE report_status = 'queued')::int AS report_queued,
  COUNT(*) FILTER (WHERE report_status = 'processing')::int AS report_processing,
  COUNT(*) FILTER (WHERE report_status = 'retry')::int AS report_retry,
  COUNT(*) FILTER (WHERE report_status = 'failed')::int AS report_failed,
  COUNT(*) FILTER (WHERE delivery_status = 'sending')::int AS delivery_sending,
  COUNT(*) FILTER (WHERE delivery_status = 'sent')::int AS delivery_sent,
  COUNT(*) FILTER (WHERE delivery_status = 'delivered')::int AS delivery_delivered,
  COUNT(*) FILTER (WHERE delivery_status = 'delayed')::int AS delivery_delayed,
  COUNT(*) FILTER (WHERE delivery_status = 'bounced')::int AS delivery_bounced,
  COUNT(*) FILTER (WHERE delivery_status = 'complained')::int AS delivery_complained,
  COUNT(*) FILTER (WHERE delivery_status IN ('failed','suppressed'))::int AS delivery_failed,
  COALESCE(EXTRACT(EPOCH FROM (
    $1::timestamptz - (MIN(next_report_attempt_at) FILTER (
      WHERE report_status IN ('queued','retry') AND next_report_attempt_at IS NOT NULL
    ))
  )), 0)::bigint AS oldest_due_age_seconds
FROM assessment_orders;
`;

const WEBHOOKS_SQL = `/* cogniva_admin_snapshot:webhooks */
SELECT
  COUNT(*) FILTER (WHERE provider = 'stripe' AND received_at >= $1::timestamptz - INTERVAL '24 hours')::int AS stripe_24h,
  COUNT(*) FILTER (WHERE provider = 'resend' AND received_at >= $1::timestamptz - INTERVAL '24 hours')::int AS resend_24h,
  COUNT(*) FILTER (WHERE provider = 'stripe' AND processed_at IS NULL)::int AS stripe_unprocessed,
  COUNT(*) FILTER (WHERE provider = 'resend' AND processed_at IS NULL)::int AS resend_unprocessed
FROM provider_webhook_events;
`;

export class SnapshotSafetyError extends Error {
  constructor(code) {
    super(code);
    this.name = "SnapshotSafetyError";
    this.code = code;
  }
}

function count(value) {
  const numeric = Number(value || 0);
  return Number.isFinite(numeric) ? Math.max(0, Math.trunc(numeric)) : 0;
}

function minor(value) {
  const numeric = Number(value || 0);
  return Number.isSafeInteger(numeric) ? Math.max(0, numeric) : 0;
}

function safeCode(dimension, value) {
  const code = String(value || "").trim().toLowerCase();
  if (!SAFE_CODE_PATTERN.test(code)) return null;
  if (dimension === "track" && !SUPPORTED_TRACKS.has(code)) return null;
  if (dimension === "language" && !SUPPORTED_LANGUAGES.has(code)) return null;
  return code;
}

function safeMetadata(value, fallback) {
  return safeCode("metadata", value) || fallback;
}

function protectedCell(value, threshold) {
  const numeric = count(value);
  if (numeric === 0 || numeric >= threshold) return { value: numeric, suppressed: false };
  return { value: null, suppressed: true };
}

function emptyWindow() {
  return {
    ordersCreated: 0,
    paid: 0,
    refunded: 0,
    disputed: 0,
    reportsGenerated: 0,
    reportsFailed: 0,
    emailsSent: 0,
    emailsDelivered: 0,
    deliveryFailures: 0
  };
}

function buildWindows(rows) {
  const windows = Object.fromEntries(WINDOW_KEYS.map((key) => [key, emptyWindow()]));
  for (const row of rows || []) {
    if (!WINDOW_KEYS.includes(row.window_key)) continue;
    windows[row.window_key] = {
      ordersCreated: count(row.orders_created),
      paid: count(row.paid),
      refunded: count(row.refunded),
      disputed: count(row.disputed),
      reportsGenerated: count(row.reports_generated),
      reportsFailed: count(row.reports_failed),
      emailsSent: count(row.emails_sent),
      emailsDelivered: count(row.emails_delivered),
      deliveryFailures: count(row.delivery_failures)
    };
  }
  return windows;
}

function buildFinancials(rows, threshold) {
  const result = Object.fromEntries(WINDOW_KEYS.map((key) => [key, {
    currencies: [],
    suppressed: false,
    threshold
  }]));
  for (const row of rows || []) {
    if (!WINDOW_KEYS.includes(row.window_key)) continue;
    const currency = String(row.currency || "").toUpperCase();
    const paymentCount = count(row.payment_count);
    if (!/^[A-Z]{3}$/u.test(currency) || paymentCount < threshold) {
      result[row.window_key].suppressed = true;
      continue;
    }
    const grossMinor = minor(row.gross_minor);
    const refundedMinor = Math.min(grossMinor, minor(row.refunded_minor));
    result[row.window_key].currencies.push({
      currency,
      paymentCount,
      grossMinor,
      refundedMinor,
      netMinor: grossMinor - refundedMinor
    });
  }
  for (const value of Object.values(result)) {
    value.currencies.sort((left, right) => left.currency.localeCompare(right.currency));
  }
  return result;
}

function buildBreakdowns(rows, threshold) {
  const result = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension, {
    rows: [],
    suppressed: false,
    threshold
  }]));
  for (const row of rows || []) {
    const dimension = String(row.dimension || "").toLowerCase();
    if (!DIMENSIONS.includes(dimension)) continue;
    const code = safeCode(dimension, row.code);
    const orderCount = count(row.order_count);
    if (!code || orderCount < threshold) {
      result[dimension].suppressed = true;
      continue;
    }
    const paid = protectedCell(row.paid_count, threshold);
    result[dimension].rows.push({
      code,
      orderCount,
      paidCount: paid.value,
      paidCountSuppressed: paid.suppressed
    });
  }
  for (const value of Object.values(result)) {
    value.rows.sort((left, right) => right.orderCount - left.orderCount || left.code.localeCompare(right.code));
  }
  return result;
}

function buildOperations(row = {}, webhook = {}) {
  return {
    reports: {
      queued: count(row.report_queued),
      processing: count(row.report_processing),
      retry: count(row.report_retry),
      failed: count(row.report_failed),
      oldestDueAgeSeconds: count(row.oldest_due_age_seconds)
    },
    delivery: {
      sending: count(row.delivery_sending),
      sent: count(row.delivery_sent),
      delivered: count(row.delivery_delivered),
      delayed: count(row.delivery_delayed),
      bounced: count(row.delivery_bounced),
      complained: count(row.delivery_complained),
      failed: count(row.delivery_failed)
    },
    webhooks: {
      stripe24h: count(webhook.stripe_24h),
      resend24h: count(webhook.resend_24h),
      stripeUnprocessed: count(webhook.stripe_unprocessed),
      resendUnprocessed: count(webhook.resend_unprocessed)
    }
  };
}

function normalizedKey(value) {
  return String(value || "").replace(/[^a-z0-9]/giu, "").toLowerCase();
}

export function assertAggregateSnapshotSafe(value, path = "snapshot") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertAggregateSnapshotSafe(item, `${path}[${index}]`));
    return true;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(normalizedKey(key))) {
        throw new SnapshotSafetyError(`FORBIDDEN_SNAPSHOT_FIELD:${path}.${key}`);
      }
      assertAggregateSnapshotSafe(child, `${path}.${key}`);
    }
    return true;
  }
  if (typeof value === "string" && (EMAIL_PATTERN.test(value) || UUID_PATTERN.test(value))) {
    throw new SnapshotSafetyError(`FORBIDDEN_SNAPSHOT_VALUE:${path}`);
  }
  return true;
}

function queryFunction(query) {
  if (typeof query !== "function") throw new TypeError("query must be a function.");
  return async (sql, params) => {
    const result = await query(sql, params);
    if (!result || !Array.isArray(result.rows)) throw new TypeError("query must return an object with rows.");
    return result.rows;
  };
}

function generatedAt(now) {
  const value = typeof now === "function" ? now() : now;
  const date = value instanceof Date ? value : new Date(value ?? Date.now());
  if (!Number.isFinite(date.getTime())) throw new TypeError("now must resolve to a valid time.");
  return date.toISOString();
}

export function createAdminSnapshotBuilder({
  query,
  now = Date.now,
  minCellSize = 5,
  serviceVersion = "unknown",
  bankVersion = "unknown",
  scoringVersion = "unknown"
}) {
  const run = queryFunction(query);
  const threshold = Number(minCellSize);
  if (!Number.isInteger(threshold) || threshold < 5 || threshold > 100) {
    throw new TypeError("minCellSize must be an integer between 5 and 100.");
  }

  return async function buildAdminSnapshot() {
    const timestamp = generatedAt(now);
    const [windowRows, financialRows, breakdownRows, operationRows, webhookRows] = await Promise.all([
      run(WINDOW_METRICS_SQL, [timestamp]),
      run(FINANCIALS_SQL, [timestamp]),
      run(BREAKDOWNS_SQL, [timestamp]),
      run(OPERATIONS_SQL, [timestamp]),
      run(WEBHOOKS_SQL, [timestamp])
    ]);
    const snapshot = {
      schemaVersion: "cogniva-admin-snapshot-v1",
      generatedAt: timestamp,
      privacy: {
        aggregateOnly: true,
        smallCellThreshold: threshold,
        breakdownSuppression: true
      },
      service: {
        key: "cogniva-compass",
        version: safeMetadata(serviceVersion, "unknown"),
        bankVersion: safeMetadata(bankVersion, "unknown"),
        scoringVersion: safeMetadata(scoringVersion, "unknown")
      },
      windows: buildWindows(windowRows),
      financials: buildFinancials(financialRows, threshold),
      breakdowns: buildBreakdowns(breakdownRows, threshold),
      operations: buildOperations(operationRows[0], webhookRows[0])
    };
    assertAggregateSnapshotSafe(snapshot);
    return snapshot;
  };
}

export async function buildAdminSnapshot(options) {
  return createAdminSnapshotBuilder(options)();
}
