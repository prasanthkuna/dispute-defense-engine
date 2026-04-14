ALTER TABLE cases
  ADD COLUMN last_webhook_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ADD COLUMN rework_reason TEXT;

UPDATE cases
SET last_webhook_at = COALESCE(last_webhook_at, updated_at, NOW());

ALTER TABLE drafts
  ADD COLUMN draft_status TEXT NOT NULL DEFAULT 'draft';

ALTER TABLE evidence_items
  ADD COLUMN purpose TEXT NOT NULL DEFAULT 'dispute_evidence';
