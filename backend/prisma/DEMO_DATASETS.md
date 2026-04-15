# Datacendia — Multi-Industry Demo Datasets

## Overview

`seed-industry-demos.ts` creates **7 industry-specific demo organisations** and **1 tutorial organisation** in your database.  
Each is fully isolated from real user data by design.

---

## Running the Seed

```bash
# From backend/
npm run seed:demos
```

That's it. The script is **idempotent** — running it twice will skip records that already exist without overwriting anything.

---

## What Gets Created

| Org slug                   | Industry           | Company                        | Size      |
|----------------------------|--------------------|--------------------------------|-----------|
| `demo-novasoft`            | Technology         | NovaSoft Inc.                  | 51–200    |
| `demo-atlas-capital`       | Financial Services | Atlas Capital Group            | 201–500   |
| `demo-meridian-health`     | Healthcare         | Meridian Health System         | 1 001–5 000 |
| `demo-flowroute`           | Logistics          | FlowRoute Logistics            | 501–1 000 |
| `demo-nexus-retail`        | Retail             | Nexus Commerce                 | 201–500   |
| `demo-harrington-law`      | Legal              | Harrington & Associates LLP    | 51–200    |
| `demo-vertex-industrial`   | Manufacturing      | Vertex Industrial Corp.        | 501–1 000 |
| `tutorial-datacendia`      | Tutorial           | Datacendia Tutorial Co.        | 11–50     |

**Per organisation you get:**
- 4–5 team members (Admin + Analyst roles)
- 6 industry-specific KPI metric definitions with **30 days of daily time-series values** (realistic trends + noise)
- 5–7 decisions (mix of PENDING / APPROVED / IMPLEMENTED)
- 6–7 alerts (mix of CRITICAL / WARNING / INFO / ACTIVE / RESOLVED)
- 1 health score record (overall + 4 dimension scores)

**Shared login password:** `DemoAccess2026!`

---

## Read-Only Demo Data (No Persistent Saves)

Demo organisations are **read-only for all end users**. This means:

- ✅ **GET requests always work** — users can browse all seeded data freely
- 🚫 **POST / PUT / PATCH / DELETE are silently intercepted** — the database is never written to; users see a fake success response so the UI still feels interactive
- ♻️ **Data resets automatically** — because writes are never committed, the seeded state is always intact on the next visit/refresh
- 📢 **A toast notification appears** in the UI informing the user that the action was not saved ("Demo organisation — read only")

**SUPER_ADMIN** users are exempt and can write to demo orgs (for data maintenance / resets).

**How it works (for engineers):**
1. `backend/src/middleware/demoGuard.ts` — `blockIfDemo()` checks if `req.organizationId` starts with `demo-` or `tutorial-`. If so + mutating method → returns `{ success: true, data: req.body, _demo: true }` without calling `next()`.
2. `backend/src/middleware/auth.ts` — `blockIfDemo()` is called inside `authenticate` and `devAuth`, after the user/org is resolved, before the route handler runs.
3. `src/lib/api/client.ts` — detects `_demo: true` in any response and fires a Zustand toast notification.

---

## Isolation Guarantee

| Demo data                    | Real user data                    |
|------------------------------|-----------------------------------|
| IDs prefixed `demo-` / `tutorial-` | UUID IDs (e.g. `b3e7f1...`) |
| Slugs prefixed `demo-` / `tutorial-` | User-chosen slugs at sign-up |
| Emails use `.demo` domain    | Real user emails                  |
| `settings.isDemo = true`     | No `isDemo` key                   |

The database is **multi-tenant by `organization_id`** — every query is scoped to the authenticated user's org. A user in `demo-novasoft` can never see data from `demo-atlas-capital` or a real org, and vice versa.

---

## Tutorial Organisation

`tutorial-datacendia` is a special lightweight org designed for **onboarding walkthroughs**:

- Clean, simple data (4 KPIs, 3 step-by-step decisions)
- `settings.isTutorial = true` (UI can show a guided banner)
- Safe to explore, modify, and reset — real orgs are unaffected
- Comes with a `tutorialNote` in settings explaining the isolation to end users

---

## Resetting Demo Data

To wipe and re-seed a specific demo org:

```sql
-- Replace 'demo-novasoft' with the org you want to reset
DELETE FROM metric_values WHERE metric_id IN (
  SELECT id FROM metric_definitions WHERE organization_id = 'demo-novasoft'
);
DELETE FROM metric_definitions WHERE organization_id = 'demo-novasoft';
DELETE FROM decisions        WHERE organization_id = 'demo-novasoft';
DELETE FROM alerts           WHERE organization_id = 'demo-novasoft';
DELETE FROM health_scores    WHERE organization_id = 'demo-novasoft';
DELETE FROM users            WHERE organization_id = 'demo-novasoft';
DELETE FROM organizations    WHERE id = 'demo-novasoft';
```

Then re-run `npm run seed:demos`.

---

## Adding Your Own Real Data

To use the platform with your organisation's real data:

1. **Sign up / log in** — your org is created automatically with a UUID ID and your chosen slug.
2. **Import metrics** — use `POST /api/v1/metrics` to create metric definitions, then `POST /api/v1/metrics/:id/values` to push historical values.
3. **Create decisions** — use the Council UI or `POST /api/v1/decisions`.
4. **Set up alerts** — use `POST /api/v1/alerts` or connect a data source via the Connectors panel.

Your real org data lives in a completely separate partition of the database and is never touched by demo seeds.
