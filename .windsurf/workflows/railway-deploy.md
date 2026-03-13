---
description: How to deploy datacendia-core to Railway (all-in-one Docker deployment)
---

# Railway Deployment Guide — datacendia-core

## Prerequisites
- Railway account (Hobby plan minimum — $5/month, Free plan's 0.5 GB RAM is too small)
- GitHub repo: `datacendia/datacendia-core`
- Railway CLI (optional) or Railway dashboard

---

## Step 1: Local Build Fixes

Before deploying, the local build must pass. Fixes applied:

1. **Prisma schema duplication** — Deleted nested `backend/prisma/schema/schema/` directory (duplicate models)
2. **Prisma reverse relation** — Added `gateway_interactions` reverse relation field on `organizations` model in `backend/prisma/schema/base.prisma`
3. **PostCSS config error** — Inlined PostCSS config (tailwindcss + autoprefixer) into `vite.config.ts` to bypass Vite 7 lilconfig JSON parsing bug. Deleted `postcss.config.js`.
4. **BOM characters** — Stripped UTF-8 BOM (`\uFEFF`) from 200+ source files including `package.json`. Windows editors add these; they break `JSON.parse` in Docker/Linux.
5. **Missing enterprise component stubs** — Created stub React components in `components/` for all imports from the enterprise `datacendia-components` package:
   - `components/feedback/index.tsx` (ToastProvider, useToast)
   - `components/ui/index.tsx` (SimpleTooltip, NarrativeGuide, NarrativeSelector)
   - `components/ui/Modal.tsx`, `PageLoader.tsx`, `RedactedText.tsx`, `ThemeToggle.tsx`
   - `components/brand/Logo.tsx`, `components/brand/index.tsx`
   - `components/navigation/index.tsx` (NavigationLoader, Breadcrumbs, HealthIndicator, ConnectionBanner)
   - `components/cortex/DataSourceSelector.tsx` (DataSourceSelector, WorkflowIndicator, QuickActionsBar, AVAILABLE_CONNECTORS)
   - `components/council/UserInterventionPanel.tsx`, `WorkflowPicker.tsx`
   - `components/dashboard/index.tsx`, `LayoutMapRenderer.tsx`
   - `components/reports/DrillDownReportKit.tsx`, `ExportCompareKit.tsx`, `HeatmapTimelineKit.tsx`, `InteractionKit.tsx`, `TrendSparklineKit.tsx`
   - `components/demos/RegulatorsReceiptDemo.tsx`
   - `components/demo/index.tsx`, `components/i18n/LanguageSwitcher.tsx`
   - `components/notifications/NotificationBell.tsx`, `components/ai-assistant/PlatformAssistant.tsx`
   - `components/CommandPalette.tsx`, `components/SEO.tsx`, `components/AskCouncilButton.tsx`, `components/PageGuide.tsx`
6. **Missing lib/utils** — Created `lib/utils.ts` re-exporting `cn` from `src/lib/utils` plus stubs for `formatCurrency`, `formatNumber`, `formatBytes`, `formatRelativeTime`
7. **Missing enterprise route** — Created `src/routes/cortex/enterprise.routes.tsx` (empty route array stub)

Verify: `npm run build` should pass locally (2145+ modules).

---

## Step 2: Dockerfile (`Dockerfile.allinone`)

Three-stage Docker build to avoid OOM on limited Railway memory:

- **Stage 1 (frontend-builder):** Strips `workspaces` from `package.json` (with BOM removal), runs `npm install`, builds Vite frontend
- **Stage 2 (backend-builder):** Installs native build tools (python3, make, g++), runs `npm install` for backend, generates Prisma client
- **Stage 3 (production):** Alpine runtime with `dumb-init`, copies built frontend + backend, sets up non-root user

Key decisions:
- Use `npm install` (NOT `npm ci`) in both stages — lockfiles are often out of sync
- Strip BOM before `JSON.parse` in the Dockerfile itself (`.replace(/^\uFEFF/,'')`)
- Copy `components/` and `lib/` directories for frontend build
- Entrypoint: `dumb-init` → `docker-entrypoint.railway.sh`

---

## Step 3: Railway Configuration Files

### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "Dockerfile.allinone"
  },
  "deploy": {
    "startCommand": "./docker-entrypoint.railway.sh node --import tsx src/index.ts",
    "healthcheckPath": "/health",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### `.dockerignore`
Excludes: `node_modules`, `dist`, `.git`, `.github`, `.vscode`, `docs`, `.env*`, etc.

### `backend/docker-entrypoint.railway.sh`
- Uses `DATABASE_URL` for PostgreSQL
- Runs `npx prisma migrate deploy`
- Runs seed scripts
- Starts the backend server

---

## Step 4: Git Branch Setup

Railway watches a specific branch. Our repo uses `master` as default, but Railway was configured for `main`.

```powershell
# Push master to main (and production) for Railway
git push origin master:main
git push origin master:production
```

For ongoing work, always push to `main` after committing to `master`:
```powershell
git push origin master:main
```

---

## Step 5: Railway Dashboard Settings

1. **Source:** Connect GitHub repo `datacendia/datacendia-core`, branch `main`
2. **Builder:** `Dockerfile` → path `Dockerfile.allinone`
3. **Start Command:** `./docker-entrypoint.railway.sh node --import tsx src/index.ts`
4. **Healthcheck Path:** `/health` (timeout: 300s)
5. **Restart Policy:** On Failure, max 10 retries
6. **Config-as-code:** `railway.json`
7. **Networking:** Generate a public domain
8. **Plan:** Hobby minimum ($5/month) — Free plan's 0.5 GB RAM causes OOM during `npm install`

---

## Step 6: Environment Variables (Railway → Variables tab)

Required:
- `DATABASE_URL` — Auto-populated if you add a Railway PostgreSQL database
- `JWT_SECRET` — Any secure random string (e.g., `openssl rand -hex 32`)
- `REQUIRE_AUTH` — `true`
- `NODE_ENV` — `production`
- `PORT` — Usually auto-set by Railway (default 3001)

Optional:
- `REDIS_URL` — If using Redis for caching/sessions
- `SENTRY_DSN` — For error tracking
- `CORS_ORIGINS` — Allowed origins

---

## Step 7: Add PostgreSQL Database

In Railway dashboard:
1. Click **New** → **Database** → **PostgreSQL**
2. Railway auto-populates `DATABASE_URL` as a shared variable
3. Link it to the `proud-magic` service

---

## Step 8: Deploy & Verify

1. Push to `main` triggers auto-deploy
2. Watch Build Logs for errors
3. Once deployed, check:
   - Healthcheck: `https://<domain>/health`
   - Frontend: `https://<domain>/`
   - API: `https://<domain>/api/v1/...`

---

## Common Build Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `SyntaxError: Unexpected token '﻿'` | BOM in `package.json` | Strip BOM or use `.replace(/^\uFEFF/,'')` in Dockerfile |
| `npm ci` lockfile mismatch | `package-lock.json` out of sync | Use `npm install` instead of `npm ci` |
| OOM (exit 137) | Not enough RAM for `npm install` | Upgrade to Hobby plan; split Docker stages |
| Missing module errors | Enterprise component imports | Create stub components in `components/` |
| PostCSS JSON parse error | Vite 7 lilconfig bug | Inline PostCSS config in `vite.config.ts` |
| Prisma duplicate models | Nested schema directory | Delete `backend/prisma/schema/schema/` |
