-- Preserve the exact localized consent-copy version separately from the
-- privacy/terms document versions. Nullable is required for legacy receipts
-- where that evidence was never collected.

ALTER TABLE assessment_consent_receipts
  ADD COLUMN IF NOT EXISTS content_version TEXT;

UPDATE assessment_consent_receipts
SET content_version = NULLIF(statement_snapshot->>'contentVersion', '')
WHERE content_version IS NULL
  AND statement_snapshot ? 'contentVersion';

CREATE INDEX IF NOT EXISTS assessment_consent_receipts_content_version_idx
  ON assessment_consent_receipts (receipt_type, content_version, accepted_at);
