CREATE TABLE cases (
  id TEXT PRIMARY KEY,
  dispute_id TEXT NOT NULL UNIQUE,
  payment_id TEXT,
  merchant_name TEXT NOT NULL,
  amount DOUBLE PRECISION NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  reason_code TEXT,
  dispute_reason TEXT NOT NULL DEFAULT 'item_not_received',
  respond_by TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'New',
  external_status TEXT DEFAULT 'open',
  phase TEXT,
  network TEXT,
  amount_deducted DOUBLE PRECISION,
  recommendation TEXT,
  confidence_band TEXT,
  evidence_completeness_score DOUBLE PRECISION NOT NULL DEFAULT 0,
  approval_state TEXT NOT NULL DEFAULT 'Not Needed',
  scenario_type TEXT NOT NULL DEFAULT 'slam_dunk_contest',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE events (
  id TEXT PRIMARY KEY,
  external_event_id TEXT NOT NULL,
  case_id TEXT,
  event_type TEXT NOT NULL,
  payload_json JSONB NOT NULL DEFAULT '{}',
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ,
  dedupe_key TEXT NOT NULL UNIQUE
);

CREATE TABLE evidence_items (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  evidence_type TEXT NOT NULL,
  source_name TEXT NOT NULL,
  title TEXT NOT NULL,
  summary_text TEXT NOT NULL DEFAULT '',
  raw_content_json JSONB NOT NULL DEFAULT '{}',
  preview_text TEXT NOT NULL DEFAULT '',
  file_url TEXT,
  status TEXT NOT NULL DEFAULT 'found',
  confidence DOUBLE PRECISION NOT NULL DEFAULT 1.0,
  collected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_runs (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running',
  step_count INTEGER NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  final_summary TEXT
);

CREATE TABLE agent_trace_steps (
  id TEXT PRIMARY KEY,
  agent_run_id TEXT NOT NULL REFERENCES agent_runs(id) ON DELETE CASCADE,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  action_type TEXT NOT NULL,
  tool_name TEXT,
  input_json JSONB NOT NULL DEFAULT '{}',
  output_json JSONB NOT NULL DEFAULT '{}',
  observation_text TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'success',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE policy_decisions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  recommended_action TEXT NOT NULL,
  confidence_band TEXT NOT NULL,
  rationale_json JSONB NOT NULL DEFAULT '[]',
  missing_items_json JSONB NOT NULL DEFAULT '[]',
  approval_required BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE drafts (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  version INTEGER NOT NULL DEFAULT 1,
  summary_text TEXT NOT NULL DEFAULT '',
  response_text TEXT NOT NULL DEFAULT '',
  attachments_json JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  draft_id TEXT REFERENCES drafts(id) ON DELETE SET NULL,
  actor_role TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  decision TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  actor_type TEXT NOT NULL,
  actor_name TEXT NOT NULL,
  action_type TEXT NOT NULL,
  details_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
