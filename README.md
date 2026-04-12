# Dispute Defense Engine (DDE)

A production-style AI-native dispute workflow engine for e-commerce Item Not Received (INR) payment disputes.

## Architecture

```text
Frontend (React + Vite)
- InboxPage
- CaseDetailPage
- SimulationPage
  |
  +-- ~backend/client (auto-generated)
      |
      +-- Encore.ts API Gateway
          +- cases
          +- evidence
          +- agent
          +- policy
          +- drafts
          +- approvals
          +- audit
          +- ingest
          +- simulation
              |
              +-- PostgreSQL (Encore SQLDatabase "db")
                  +- cases
                  +- events
                  +- evidence_items
                  +- agent_runs
                  +- agent_trace_steps
                  +- policy_decisions
                  +- drafts
                  +- approvals
                  +- audit_logs
```

## Services

| Service | Responsibility |
|---|---|
| `cases` | Case CRUD, status management, stats |
| `evidence` | Evidence item CRUD |
| `agent` | Autonomous evidence-gathering agent execution |
| `policy` | Deterministic non-LLM rule-based decision engine |
| `drafts` | Bank-facing response generation and editing |
| `approvals` | Approval workflow for demo roles |
| `audit` | Immutable audit trail |
| `ingest` | Idempotent event ingestion |
| `simulation` | Demo scenario seeding and environment reset |

## Demo Mode

This project intentionally runs in demo mode so reviewers can inspect the full workflow without an auth wall.

- The role switcher is for walkthrough purposes.
- Core state transitions are still validated on the backend.
- A production version would add real authentication and server-enforced RBAC.

## Seeded Scenarios

| # | Scenario | Merchant | Expected | Score |
|---|---|---|---|---|
| 1 | `slam_dunk_contest` | Urban Cart | Contest (High) | 100% |
| 2 | `vernacular_evidence_contest` | House of Sarees | Contest (Medium) | 87.5% |
| 3 | `rto_accept` | Gadget Lane | Accept (High) | 50% |
| 4 | `weak_evidence_escalate` | Fresh Nest | Escalate (Low) | 25% |

## Using The Simulation Panel

1. Navigate to **Simulation** in the sidebar.
2. Click **Seed All Scenarios** to create all 4 demo cases at once.
3. Or click **Simulate Dispute** on any individual scenario card.
4. Click the case link to open the full Case Detail page.
5. Use the **Role Switcher** to walkthrough Operator / Approver / Admin actions.
6. Use **Reset Environment** to clear all generated data.
7. Use **Seed All Scenarios** again when you want to repopulate the demo.

## Tech Stack

- Frontend: React, TypeScript, Vite, TanStack Query
- Backend: Encore.ts, TypeScript
- Database: PostgreSQL via Encore SQLDatabase
- Routing: react-router-dom
- UI: custom React components with Lucide icons
