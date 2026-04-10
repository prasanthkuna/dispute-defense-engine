# Dispute Defense Engine (DDE)

A production-style AI-native dispute workflow engine for e-commerce "Item Not Received" (INR) payment disputes.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React + Vite)                   │
│  InboxPage │ CaseDetailPage │ SimulationPage                     │
└───────────────────────┬─────────────────────────────────────────┘
                        │ ~backend/client (auto-generated)
┌───────────────────────▼─────────────────────────────────────────┐
│                     Encore.ts API Gateway                        │
├──────────┬──────────┬──────────┬──────────┬──────────┬──────────┤
│  cases   │ evidence │  agent   │  policy  │  drafts  │approvals │
├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│  audit   │  ingest  │simulation│                                 │
└──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│              PostgreSQL (Encore SQLDatabase "db")                │
│  cases │ events │ evidence_items │ agent_runs │ agent_trace_steps│
│  policy_decisions │ drafts │ approvals │ audit_logs             │
└─────────────────────────────────────────────────────────────────┘
```

## Services

| Service | Responsibility |
|---|---|
| `cases` | Case CRUD, status management, stats |
| `evidence` | Evidence item CRUD |
| `agent` | Autonomous evidence-gathering agent execution |
| `policy` | Deterministic (non-LLM) rule-based decision engine |
| `drafts` | Bank-facing response generation and editing |
| `approvals` | Approval workflow (Operator/Approver/Admin) |
| `audit` | Immutable audit trail |
| `ingest` | Idempotent event ingestion |
| `simulation` | Demo scenario seeding and environment reset |

## Seeded Scenarios

| # | Scenario | Merchant | Expected | Score |
|---|---|---|---|---|
| 1 | `slam_dunk_contest` | Urban Cart | Contest (High) | 100% |
| 2 | `vernacular_evidence_contest` | House of Sarees | Contest (Medium) | 87.5% |
| 3 | `rto_accept` | Gadget Lane | Accept (High) | 50% |
| 4 | `weak_evidence_escalate` | Fresh Nest | Escalate (Low) | 25% |

## Using the Simulation Panel

1. Navigate to **Simulation** in the sidebar
2. Click **Seed All Scenarios** to create all 4 demo cases at once
3. Or click **Simulate** on any individual scenario card
4. Click the case link to open the full Case Detail page
5. Use the **Role Switcher** (top-right) to switch between Operator / Approver / Admin
6. Use **Reset Environment** to wipe all data and start fresh

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS v4, shadcn/ui, Lucide React
- **Backend**: Encore.ts, TypeScript
- **Database**: PostgreSQL via Encore SQLDatabase
- **Routing**: react-router-dom
- **Fonts**: IBM Plex Mono (terminal), Inter (body)
