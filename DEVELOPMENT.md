# Development Notes

This repo has two active parts:

- the Encore backend app at the repo root
- the Vite frontend app in `.frontend`

The legacy root `backend/` directory is not part of the active source tree and should be treated as ignored local-only material.

## Prerequisites

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

## Run Locally

### Backend

From the repo root:

```bash
encore run
```

This starts the Encore API and local database for the app linked by `encore.app`.

### Frontend

From `.frontend`:

```bash
cd .frontend
bun install
bun dev
```

## Useful Checks

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

## Current Deployment Targets

### Backend

- Encore app: `dispute-defense-hq-7dki`
- Encore remote: `encore://dispute-defense-hq-7dki`

### Frontend

- Vercel project: `dispute-defense-engine-ui`
- Vercel source root: `.frontend`

## Environment Notes

### Frontend API target

- local dev target is set in `.frontend/.env.development`
- current deployed frontend target is set in `.frontend/.env.production`

### Vercel routing

The frontend uses `BrowserRouter`, so `.frontend/vercel.json` contains the SPA rewrite required for direct refreshes on routes such as `/ledger` and `/cases/:id`.

## Git Hygiene

Only human-authored source, config, migrations, and docs should stay tracked.

Generated and local-only artifacts are ignored:

- `.encore/`
- `encore.gen/`
- `.frontend/dist/`
- `.frontend/.vercel/`
- `node_modules/`
- `tsconfig.tsbuildinfo`

If these ever reappear in `git status`, they should be untracked rather than recommitted.
