# Dispute Defense Engine

Dispute Defense Engine is a Razorpay-aligned dispute operations console for INR payment disputes. It ingests dispute events, normalizes them into reviewer-friendly cases, walks through evidence and decisioning, and produces bank-facing drafts with approvals and audit history.

This repo is optimized for a zero-friction demo:
- backend services run as a single Encore app from the repo root
- frontend is a separate Vite app in `.frontend`
- seeded scenarios let reviewers explore the full workflow without wiring live webhooks

## What The App Shows

- dispute intake and normalization from Razorpay-style webhook payloads
- evidence gathering and case readiness scoring
- deterministic policy decisioning with explicit rationale
- editable bank-facing drafts
- operator / approver / admin review flow
- audit history and agent trace visibility

## Repo Layout

```text
.
├─ agent/                  AI-style workflow orchestration and trace generation
├─ approvals/              Approval creation and review actions
├─ audit/                  Audit log events
├─ cases/                  Case listing, detail, updates, and stats
├─ db/                     Encore SQL database and migrations
├─ drafts/                 Draft creation and editing
├─ evidence/               Evidence item APIs
├─ ingest/                 Dispute webhook ingestion and normalization
├─ policy/                 Deterministic decision engine
├─ simulation/             Demo seed/reset/simulate flows
├─ .frontend/              Vite frontend deployed to Vercel
├─ encore.app              Encore app linkage
├─ package.json            Root backend package
└─ DEVELOPMENT.md          Local development and deployment notes
```

## Demo Mode

This project intentionally runs in demo mode so a reviewer can inspect the full workflow without an authentication wall.

- the role switcher is for walkthrough purposes
- core workflow transitions are still validated on the backend
- a production build would add real auth, RBAC, webhook signature verification, and direct dispute API integration

## Seeded Scenarios

The simulation service seeds four curated disputes:

1. `slam_dunk_contest`
2. `vernacular_evidence_contest`
3. `rto_accept`
4. `weak_evidence_escalate`

These cover strong defense, vernacular customer evidence, smart acceptance, and manual-review escalation.

## Local Development

### Backend

Run the Encore app from the repo root:

```bash
encore run
```

### Frontend

Run the Vite app from `.frontend`:

```bash
cd .frontend
bun install
bun dev
```

The frontend expects `VITE_CLIENT_TARGET` to point at the Encore backend. The local dev value lives in `.frontend/.env.development` and the current production target lives in `.frontend/.env.production`.

## Deployment

### Backend

- platform: Encore Cloud
- current app id: `dispute-defense-hq-7dki`
- current repo branch used for staged deploy flow: `feature/hardening-verification`

Deploys can be triggered either through the linked Git branch in Encore Cloud or by pushing to the `encore` remote.

### Frontend

- platform: Vercel
- current project: `dispute-defense-engine-ui`
- app source root: `.frontend`

Vercel production is configured to deploy from the linked Git branch, and the frontend includes a Vercel SPA rewrite so direct refreshes on deep routes resolve to `index.html`.

## Notes On AI

The current product is AI-shaped rather than model-connected:

- seeded scenarios simulate the workflow where AI would sit
- evidence gathering, trace, and drafting are scripted/demo flows today
- final recommendationing is governed by a deterministic policy engine

That makes the app a strong workflow and product demo while still being honest about what is simulated versus live.
