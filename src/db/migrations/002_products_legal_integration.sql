-- Cogniva product packages, normalized assessments, legal receipts and replay-safe
-- dashboard integration primitives. This migration is intentionally additive and
-- may be executed repeatedly.

ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS package_code TEXT;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS stripe_price_id TEXT;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS expected_amount INTEGER;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS expected_currency TEXT;

UPDATE assessment_orders
SET package_code = 'single_v1'
WHERE package_code IS NULL;

ALTER TABLE assessment_orders ALTER COLUMN package_code SET DEFAULT 'single_v1';
ALTER TABLE assessment_orders ALTER COLUMN package_code SET NOT NULL;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_package_code_check
    CHECK (package_code IN ('single_v1','bundle_v1'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_expected_amount_check
    CHECK (expected_amount IS NULL OR expected_amount > 0);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_expected_currency_check
    CHECK (expected_currency IS NULL OR expected_currency = 'USD');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS assessment_orders_package_idx
  ON assessment_orders (package_code, created_at);

CREATE TABLE IF NOT EXISTS assessment_order_assessments (
  order_id UUID NOT NULL REFERENCES assessment_orders(id) ON DELETE CASCADE,
  track TEXT NOT NULL,
  form_id TEXT NOT NULL,
  bank_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  scores JSONB NOT NULL,
  overall INTEGER NOT NULL CHECK (overall BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (order_id, track),
  UNIQUE (order_id, form_id),
  CHECK (track IN ('cognitive','emotional')),
  CHECK (jsonb_typeof(scores) = 'object')
);

-- Existing orders were all single-assessment orders. DO NOTHING is deliberate:
-- a rerun must never overwrite a normalized child that the new runtime has written.
INSERT INTO assessment_order_assessments (
  order_id, track, form_id, bank_version, scoring_version, scores, overall, created_at
)
SELECT id, track, form_id, bank_version, scoring_version, scores, overall, created_at
FROM assessment_orders
WHERE track IS NOT NULL
  AND form_id IS NOT NULL
  AND bank_version IS NOT NULL
  AND scoring_version IS NOT NULL
  AND scores IS NOT NULL
  AND overall IS NOT NULL
ON CONFLICT (order_id, track) DO NOTHING;

-- Permit the normalized child table to become the only assessment source for new
-- orders while retaining legacy columns long enough for a rolling deployment.
ALTER TABLE assessment_orders ALTER COLUMN track DROP NOT NULL;
ALTER TABLE assessment_orders ALTER COLUMN form_id DROP NOT NULL;
ALTER TABLE assessment_orders ALTER COLUMN bank_version DROP NOT NULL;
ALTER TABLE assessment_orders ALTER COLUMN scoring_version DROP NOT NULL;
ALTER TABLE assessment_orders ALTER COLUMN scores DROP NOT NULL;
ALTER TABLE assessment_orders ALTER COLUMN overall DROP NOT NULL;

CREATE TABLE IF NOT EXISTS assessment_consent_receipts (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES assessment_orders(id) ON DELETE CASCADE,
  receipt_type TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  locale TEXT NOT NULL,
  age_confirmed BOOLEAN,
  own_responses_confirmed BOOLEAN,
  privacy_acknowledged BOOLEAN,
  non_diagnostic_acknowledged BOOLEAN,
  special_category_consent BOOLEAN,
  analytics_consent BOOLEAN,
  terms_accepted BOOLEAN,
  immediate_performance_accepted BOOLEAN,
  ai_consent BOOLEAN,
  privacy_url TEXT,
  terms_url TEXT,
  document_hashes JSONB NOT NULL DEFAULT '{}'::jsonb,
  statement_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  receipt_hash TEXT,
  link_token_hash TEXT UNIQUE,
  accepted_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  CHECK (receipt_type IN ('assessment_start','purchase')),
  CHECK (locale IN ('hu','en','de','it','es','zh','ja','ar','pl','pt','fr')),
  CHECK (jsonb_typeof(document_hashes) = 'object'),
  CHECK (jsonb_typeof(statement_snapshot) = 'object'),
  CHECK (receipt_hash IS NULL OR receipt_hash ~ '^[a-f0-9]{64}$'),
  CHECK (link_token_hash IS NULL OR link_token_hash ~ '^[a-f0-9]{64}$'),
  CHECK (expires_at IS NULL OR expires_at > accepted_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS assessment_consent_receipts_order_type_idx
  ON assessment_consent_receipts (order_id, receipt_type, policy_version)
  WHERE order_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS assessment_consent_receipts_expiry_idx
  ON assessment_consent_receipts (expires_at)
  WHERE expires_at IS NOT NULL;

-- Preserve each existing checkout consent as a purchase receipt. The order UUID is
-- a deterministic receipt UUID, making the backfill safe to rerun. Unknown legacy
-- fields stay NULL rather than being represented as consent that was never given.
INSERT INTO assessment_consent_receipts (
  id, order_id, receipt_type, schema_version, policy_version, locale,
  age_confirmed, privacy_acknowledged, non_diagnostic_acknowledged,
  terms_accepted, immediate_performance_accepted, ai_consent,
  privacy_url, terms_url, statement_snapshot, accepted_at, created_at, expires_at
)
SELECT
  id,
  id,
  'purchase',
  COALESCE(NULLIF(consent_record->>'schemaVersion',''), 'cogniva-consent-v1'),
  policy_version,
  lang,
  CASE WHEN consent_record ? 'ageConfirmed' THEN consent_record->'ageConfirmed' = 'true'::jsonb ELSE NULL END,
  CASE WHEN consent_record ? 'privacyAccepted' THEN consent_record->'privacyAccepted' = 'true'::jsonb ELSE NULL END,
  NULL,
  CASE WHEN consent_record ? 'termsAccepted' THEN consent_record->'termsAccepted' = 'true'::jsonb ELSE NULL END,
  CASE WHEN consent_record ? 'immediatePerformanceAccepted' THEN consent_record->'immediatePerformanceAccepted' = 'true'::jsonb ELSE NULL END,
  CASE WHEN consent_record ? 'aiConsent' THEN consent_record->'aiConsent' = 'true'::jsonb ELSE NULL END,
  NULLIF(consent_record->>'privacyUrl',''),
  NULLIF(consent_record->>'termsUrl',''),
  consent_record,
  created_at,
  created_at,
  personal_data_expires_at
FROM assessment_orders
WHERE consent_record IS NOT NULL
ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS integration_nonces (
  integration_code TEXT NOT NULL,
  nonce_hash TEXT NOT NULL,
  request_hash TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  consumed_at TIMESTAMPTZ,
  PRIMARY KEY (integration_code, nonce_hash),
  CHECK (integration_code ~ '^[a-z0-9][a-z0-9_.-]{2,79}$'),
  CHECK (nonce_hash ~ '^[a-f0-9]{64}$'),
  CHECK (request_hash ~ '^[a-f0-9]{64}$'),
  CHECK (expires_at > issued_at),
  CHECK (consumed_at IS NULL OR consumed_at >= issued_at)
);

CREATE INDEX IF NOT EXISTS integration_nonces_expiry_idx
  ON integration_nonces (expires_at);

CREATE TABLE IF NOT EXISTS integration_audit_events (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  integration_code TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  outcome TEXT NOT NULL,
  order_id UUID REFERENCES assessment_orders(id) ON DELETE SET NULL,
  nonce_hash TEXT,
  request_hash TEXT,
  http_status INTEGER,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (integration_code, event_id),
  CHECK (integration_code ~ '^[a-z0-9][a-z0-9_.-]{2,79}$'),
  CHECK (char_length(event_id) BETWEEN 8 AND 200),
  CHECK (char_length(event_type) BETWEEN 3 AND 100),
  CHECK (outcome IN ('accepted','rejected','duplicate','failed')),
  CHECK (nonce_hash IS NULL OR nonce_hash ~ '^[a-f0-9]{64}$'),
  CHECK (request_hash IS NULL OR request_hash ~ '^[a-f0-9]{64}$'),
  CHECK (http_status IS NULL OR http_status BETWEEN 100 AND 599),
  CHECK (jsonb_typeof(metadata) = 'object'),
  CHECK (NOT (metadata ?| ARRAY[
    'email','responses','answers','scores','accessToken','rawBody','authorization'
  ]))
);

CREATE INDEX IF NOT EXISTS integration_audit_events_order_idx
  ON integration_audit_events (order_id, recorded_at);
CREATE INDEX IF NOT EXISTS integration_audit_events_time_idx
  ON integration_audit_events (integration_code, recorded_at);
