CREATE TABLE IF NOT EXISTS assessment_orders (
  id UUID PRIMARY KEY,
  access_token_hash TEXT NOT NULL,
  email TEXT NOT NULL,
  lang TEXT NOT NULL,
  track TEXT NOT NULL,
  form_id TEXT NOT NULL,
  bank_version TEXT NOT NULL,
  scoring_version TEXT NOT NULL,
  scores JSONB NOT NULL,
  overall INTEGER NOT NULL CHECK (overall BETWEEN 0 AND 100),
  consent_record JSONB NOT NULL,
  policy_version TEXT NOT NULL,
  product_code TEXT NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending',
  report_status TEXT NOT NULL DEFAULT 'not_queued',
  delivery_status TEXT NOT NULL DEFAULT 'not_sent',
  stripe_checkout_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  stripe_charge_id TEXT,
  amount_total INTEGER,
  amount_refunded INTEGER,
  currency TEXT,
  report_content JSONB,
  report_source TEXT,
  report_version TEXT,
  report_attempts INTEGER NOT NULL DEFAULT 0,
  next_report_attempt_at TIMESTAMPTZ,
  report_last_attempt_at TIMESTAMPTZ,
  email_provider_id TEXT UNIQUE,
  email_last_event TEXT,
  email_last_event_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  report_generated_at TIMESTAMPTZ,
  email_sent_at TIMESTAMPTZ,
  email_delivered_at TIMESTAMPTZ,
  refunded_at TIMESTAMPTZ,
  disputed_at TIMESTAMPTZ,
  personal_data_expires_at TIMESTAMPTZ NOT NULL,
  personal_data_redacted_at TIMESTAMPTZ
);

ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS amount_total INTEGER;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS amount_refunded INTEGER;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS currency TEXT;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS email_last_event_at TIMESTAMPTZ;
ALTER TABLE assessment_orders ADD COLUMN IF NOT EXISTS personal_data_redacted_at TIMESTAMPTZ;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_lang_check
    CHECK (lang IN ('hu','en','de','it','es','zh','ja','ar','pl','pt','fr'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_track_check
    CHECK (track IN ('cognitive','emotional'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_payment_status_check
    CHECK (payment_status IN ('pending','checkout_created','paid','failed','expired','refunded','disputed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_report_status_check
    CHECK (report_status IN ('not_queued','queued','processing','retry','generated','failed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE assessment_orders
    ADD CONSTRAINT assessment_orders_delivery_status_check
    CHECK (delivery_status IN ('not_sent','sending','sent','delivered','delayed','bounced','complained','failed','suppressed'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE INDEX IF NOT EXISTS assessment_orders_report_queue_idx
  ON assessment_orders (report_status, next_report_attempt_at, paid_at);
CREATE INDEX IF NOT EXISTS assessment_orders_expiry_idx
  ON assessment_orders (personal_data_expires_at);
CREATE INDEX IF NOT EXISTS assessment_orders_payment_intent_idx
  ON assessment_orders (stripe_payment_intent_id);
CREATE UNIQUE INDEX IF NOT EXISTS assessment_orders_payment_intent_unique_idx
  ON assessment_orders (stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS assessment_orders_charge_unique_idx
  ON assessment_orders (stripe_charge_id) WHERE stripe_charge_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS provider_webhook_events (
  provider TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  object_id TEXT,
  provider_created_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  PRIMARY KEY (provider, event_id)
);

ALTER TABLE provider_webhook_events ADD COLUMN IF NOT EXISTS provider_created_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS provider_webhook_events_received_idx
  ON provider_webhook_events (received_at);
CREATE INDEX IF NOT EXISTS provider_webhook_events_pending_idx
  ON provider_webhook_events (provider, object_id, received_at)
  WHERE processed_at IS NULL;
