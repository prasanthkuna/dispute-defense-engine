# Dispute Defense Engine

Dispute Defense Engine is a Razorpay-aligned dispute operations console for INR payment disputes. It is designed as a production-style reviewer workflow: a dispute arrives, the system normalizes it into a case, gathers evidence, produces a governed recommendation, drafts a bank-facing response, and routes the case through approval and audit controls.

The app is intentionally optimized for demoability:
- the backend runs as a single Encore application from the repo root
- the frontend is a separate Vite app in `.frontend`
- seeded scenarios let a reviewer explore the full workflow without wiring live webhooks or real merchant systems

## Product Goal

The goal is not to show "LLM magic." The goal is to show what a high-trust dispute operations system could look like for an Indian payments context:

- Razorpay-style dispute intake
- normalized case records with payment and SLA metadata
- evidence collection across merchant and logistics artifacts
- deterministic policy-based decisioning
- bank-facing drafting with human oversight
- explicit workflow, approvals, and auditability

## What The App Demonstrates

### Core workflow

1. Dispute webhook is ingested
2. Payload is normalized into a dispute case
3. Evidence is gathered and scored
4. Policy engine recommends `Contest`, `Accept`, or `Escalate`
5. Draft response is prepared
6. Demo roles review and approve
7. Submission and lifecycle changes are tracked with audit history

### Reviewer-facing features

- command-center dashboard with money and SLA metrics
- dispute queue sorted by urgency
- case detail workspace with tabs for:
  - overview
  - intake
  - agent trace
  - evidence
  - drafting
  - approvals
  - audit
- seeded demo scenarios covering different operational outcomes
- refresh-safe Vercel routing for deep links like `/ledger` and `/cases/:id`

## Why This Exists

Most dispute handling tools either stop at a raw queue or bury operational judgment inside opaque systems. This project explores a more explicit model:

- keep the reviewer in control
- expose the evidence used for a decision
- separate workflow logic from drafting
- make the system legible enough for operations, risk, and compliance teams

The result is closer to a dispute-ops cockpit than a toy AI demo.

## Architecture

### Backend

The backend is an Encore app running from the repo root. Services are separated by responsibility:

- `ingest/`
  - receives Razorpay-style dispute events
  - deduplicates events
  - normalizes webhook payloads into `cases`
- `cases/`
  - case list, detail, updates, and dashboard stats
- `evidence/`
  - stores evidence records and evidence metadata
- `agent/`
  - runs the scenario-driven evidence-gathering flow
  - records trace steps for the UI
- `policy/`
  - deterministic decision engine
  - recommendation and rationale generation
- `drafts/`
  - bank-facing draft creation and editing
- `approvals/`
  - demo approval workflow
- `audit/`
  - immutable operational log
- `simulation/`
  - seed, simulate, and reset flows for demo scenarios
- `db/`
  - Encore SQL database and migrations

### Frontend

The frontend lives in `.frontend/` and is deployed separately to Vercel.

Stack:
- React 19
- TypeScript
- Vite
- TanStack Query
- React Router
- Lucide icons

The frontend calls the Encore backend through generated client bindings and presents the case workflow as a review console rather than a generic dashboard.

## Repo Layout

```text
.
|- agent/
|- approvals/
|- audit/
|- cases/
|- db/
|- drafts/
|- evidence/
|- ingest/
|- policy/
|- simulation/
|- .frontend/
|- encore.app
|- package.json
|- README.md
`- DEVELOPMENT.md
```

Notes:
- The active backend source is at the repo root.
- The active frontend source is in `.frontend/`.
- The legacy root `backend/` directory is treated as ignored local-only material and is not part of the live app structure.

## Data Model At A Glance

The system centers around `cases`, with related operational records:

- `cases`
  - dispute identifiers
  - payment metadata
  - reason code
  - phase
  - respond-by deadline
  - recommendation
  - approval state
  - lifecycle status
- `events`
  - raw ingested webhook payloads
- `evidence_items`
  - evidence artifacts and completeness metadata
- `agent_trace_steps`
  - operational trace of the scenario flow
- `policy_decisions`
  - deterministic decision output and rationale
- `drafts`
  - bank-facing response drafts
- `approvals`
  - review actions by role
- `audit_logs`
  - immutable history of operational actions

## Seeded Scenarios

The simulation service seeds four curated disputes:

1. `slam_dunk_contest`
   - strong evidence-backed contest path
2. `vernacular_evidence_contest`
   - OCR/translation-style recovery path with vernacular customer communication
3. `rto_accept`
   - high-confidence accept/refund path
4. `weak_evidence_escalate`
   - low-confidence manual review path

These are designed to show different product behaviors, not just a single happy path.

## Demo Mode

This repo intentionally runs in demo mode so reviewers can inspect the full workflow without an auth wall.

What that means:
- the role switcher is for walkthrough purposes
- backend workflow transitions are still validated
- seeded scenarios are used instead of live payment operations

What it does not mean:
- it is not pretending to be a production-integrated Razorpay dispute console
- it does not currently wire a live model provider for drafting or evidence interpretation
- it does not ask reviewers to configure webhooks or credentials

## Notes On AI

This project is AI-shaped more than model-connected today.

What is present:
- an agent-style workflow and trace surface
- structured evidence synthesis
- decision support paired with human review
- draft generation flow inside a governed process

What is still simulated:
- scenario-driven evidence gathering
- scripted trace and evidence outcomes
- template-driven drafting rather than live LLM output

What is deliberately not delegated to AI:
- final workflow control
- approval routing
- policy guardrails

That balance is intentional. The product is designed around "AI-assisted dispute operations with controls," not a fully autonomous black-box agent.

## Local Development

### Prerequisites

- Encore CLI
- Bun

Install Encore on Windows:

```powershell
iwr https://encore.dev/install.ps1 | iex
```

Install Bun if needed:

```bash
npm install -g bun
```

### Run the backend

From the repo root:

```bash
encore run
```

### Run the frontend

From `.frontend`:

```bash
cd .frontend
bun install
bun dev
```

The frontend reads the backend target from environment configuration:
- local dev target: `.frontend/.env.development`
- deployed target: `.frontend/.env.production`

## Validation Commands

### Backend

```bash
encore check
```

### Frontend

```bash
cd .frontend
bun x tsc --noEmit -p tsconfig.json
bun run build
```

There is currently no `lint` script in the frontend package.

## Deployment

### Backend

- platform: Encore Cloud
- app id: `dispute-defense-hq-7dki`

Deploys can be triggered through:
- the linked Git branch in Encore Cloud
- or the `encore` Git remote

### Frontend

- platform: Vercel
- project: `dispute-defense-engine-ui`
- source root: `.frontend`

The frontend includes a Vercel rewrite configuration so client-side routes like `/ledger` and `/cases/:id` survive direct refreshes.

## Current Strengths

- clear operations-oriented workflow
- strong visibility into evidence, policy, and audit trail
- realistic dispute metadata and queue design
- separate frontend and backend deploy flows
- low-friction reviewer experience

## Current Limitations

- no live Razorpay dispute API integration
- no live LLM integration yet
- no production auth or RBAC
- no real document upload pipeline for dispute evidence
- simulation remains the primary source of demo data

## If This Were Continued

The next product steps would likely be:

- direct Razorpay dispute accept/contest API integration
- webhook signature verification
- action-required rework loop refinement
- live OCR / translation / drafting model integration
- document upload and evidence packet assembly
- real authentication and server-enforced RBAC

## Development Notes

See [DEVELOPMENT.md](./DEVELOPMENT.md) for current run, validation, and deployment notes.
