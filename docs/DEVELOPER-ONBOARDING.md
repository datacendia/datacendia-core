# Datacendia — Developer Onboarding Guide
## New Engineer Reference — v0.2.4-alpha (April 2026)

> Complete guide for new contributors and engineers. Covers local setup, architecture patterns, how to add a new service, route, or middleware, naming conventions, testing requirements, and PR standards.

---

## Table of Contents

1. [Local Environment Setup](#1-local-environment-setup)
2. [Codebase Orientation](#2-codebase-orientation)
3. [Request Lifecycle](#3-request-lifecycle)
4. [How to Add a New Service](#4-how-to-add-a-new-service)
5. [How to Add a New Route](#5-how-to-add-a-new-route)
6. [How to Add a New Middleware](#6-how-to-add-a-new-middleware)
7. [Database: Prisma Patterns](#7-database-prisma-patterns)
8. [Naming Conventions](#8-naming-conventions)
9. [Testing Requirements](#9-testing-requirements)
10. [PR Checklist and Standards](#10-pr-checklist-and-standards)
11. [Common Pitfalls](#11-common-pitfalls)
12. [Key Files Reference](#12-key-files-reference)

---

## 1. Local Environment Setup

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 20.x LTS | Runtime |
| Docker Desktop | Latest | PostgreSQL, Redis, Neo4j, Ollama |
| Git | Latest | Version control |
| VS Code | Latest | Recommended IDE (Mermaid extension for diagrams) |

### Step-by-Step Setup

```bash
# 1. Clone the repository
git clone https://github.com/datacendia/datacendia-core.git
cd datacendia-core

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd backend && npm install && cd ..

# 4. Start infrastructure (PostgreSQL, Redis, Neo4j, Ollama)
docker compose up -d postgres redis neo4j ollama

# 5. Configure environment (backend)
cp backend/.env.example backend/.env
# Edit backend/.env — minimum required:
#   DATABASE_URL=postgresql://datacendia:password@localhost:5432/datacendia
#   JWT_SECRET=local-dev-secret-32-chars-minimum
#   REQUIRE_AUTH=false

# 6. Run database migrations
cd backend && npx prisma migrate deploy && cd ..

# 7. Seed demo data (optional but recommended)
cd backend && npx ts-node prisma/seed.ts && cd ..

# 8. Start development servers (two terminals)
npm run dev              # Frontend on http://localhost:5173
cd backend && npm run dev  # Backend on http://localhost:3001
```

### Environment Variables Reference

See `docs/DATACENDIA-BIBLE.md` §18 for a complete list. Minimum for local dev:

```env
DATABASE_URL=postgresql://datacendia:password@localhost:5432/datacendia
JWT_SECRET=any-string-at-least-32-characters-long
REQUIRE_AUTH=false
NODE_ENV=development
```

For AI features:
```env
OPENAI_API_KEY=sk-...        # Optional — falls back to Ollama
OPENAI_MODEL=gpt-4o-mini     # Optional
```

### Verify Setup

```bash
# Backend health check
curl http://localhost:3001/health

# Inference status
curl http://localhost:3001/api/v1/inference/status

# Frontend
open http://localhost:5173
```

---

## 2. Codebase Orientation

### Top-Level Structure

```
datacendia-core/
├── src/                      # Frontend (React 18 + TypeScript + Vite)
│   ├── pages/                # 175 route-level page components
│   ├── components/           # 91 reusable UI components
│   ├── services/             # API client (axios wrappers per domain)
│   ├── stores/               # Zustand state stores
│   ├── hooks/                # Custom React hooks
│   ├── config/               # serviceInfo.ts (ServiceInfoDropdown data)
│   └── routes/               # React Router definitions
│
├── backend/
│   └── src/
│       ├── routes/           # 158 Express route files
│       │   └── domains/      # 14 domain aggregator routers
│       ├── services/         # 356 business logic service files (60 dirs)
│       ├── middleware/       # Auth, demo guard, security, error handling
│       ├── security/         # AuditService, RBAC, threat detection, honeypot
│       ├── connectors/       # 35+ external system connectors
│       ├── prisma/           # 37 schema files, migrations
│       └── index.ts          # Express entrypoint
│
├── docs/
│   ├── DATACENDIA-BIBLE.md   # Master platform reference
│   ├── GLOSSARY.md           # All platform terms defined
│   ├── DEMO-GUIDE.md         # Sales demo playbook
│   ├── architecture/         # 19 architecture docs with Mermaid diagrams
│   └── compliance/           # 16 compliance framework guides
│
└── tests/
    ├── e2e/                  # Playwright end-to-end tests
    ├── backend/              # Backend unit tests (Jest)
    └── load/                 # k6 load tests
```

### The Most Important Files to Read First

| File | Why |
|------|-----|
| `backend/src/index.ts` | Understand the full middleware chain and route mounting order |
| `backend/src/middleware/auth.ts` | Understand how JWT, user, and org are resolved on every request |
| `backend/src/middleware/tenantIsolation.ts` | Understand multi-tenancy and the demo guard |
| `backend/src/middleware/demoGuard.ts` | Understand how demo data isolation works |
| `docs/DATACENDIA-BIBLE.md` | Platform reference for everything |
| `docs/GLOSSARY.md` | Platform terminology |

---

## 3. Request Lifecycle

Every authenticated API request follows this exact path. Know this deeply.

```
1. express.static        — serves /dist assets BEFORE any middleware (critical)
2. Helmet                — CSP, X-Frame-Options, HSTS
3. CORS                  — origin validation
4. Rate Limiter          — Redis-backed, per-IP + per-user
5. Body Parser           — JSON + URL-encoded
6. Cookie Parser
7. Compression
8. Request Logger
9. customSecurityHeaders
10. masterSecurityMiddleware  — orchestrates the security chain
11. preventReplayAttack       — nonce + timestamp
12. preventDataExfiltration   — output scanning
13. threatDetectionMiddleware — anomaly scoring
14. honeypotMiddleware        — scanner traps
15. csrfProtection
16. inputSanitizationMiddleware
17. pathTraversalMiddleware
18. sqlInjectionMiddleware
19. Auth Middleware       — JWT validation, user+org from DB (Redis cached)
                            calls blockIfDemo() — demo write protection
20. requireOrgScope       — verifies organizationId is set
                            calls blockIfDemo() — belt-and-suspenders
21. [AI routes only]
    aiRegulatoryMiddleware   — classifies AI use case, hard-blocks prohibited
    phiEnforcementMiddleware — enforces HIPAA PHI before AI rule
22. Domain Router → Route Handler → Service Layer → Database
23. AuditService.log()    — all events logged to Merkle chain
24. Error Handler
```

**Critical:** `express.static` MUST be registered before Helmet or assets return 500. This burned us in production (see Railway deployment post-mortem).

---

## 4. How to Add a New Service

### Step 1: Create the service directory and file

```bash
# Example: adding a new "scoring" service
mkdir backend/src/services/scoring
touch backend/src/services/scoring/ScoringService.ts
```

### Step 2: Write the service as a class with a singleton export

```typescript
// backend/src/services/scoring/ScoringService.ts
import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

export class ScoringService {
  private db: PrismaClient;

  constructor(db: PrismaClient = prisma) {
    this.db = db;
  }

  async computeScore(organizationId: string, params: ScoreParams): Promise<ScoreResult> {
    logger.info('ScoringService: computing score', { organizationId });
    // ALWAYS scope queries by organizationId
    const records = await this.db.someTable.findMany({
      where: { organization_id: organizationId },
    });
    return this.calculateFromRecords(records, params);
  }

  private calculateFromRecords(records: any[], params: ScoreParams): ScoreResult {
    // business logic
  }
}

export const scoringService = new ScoringService();
```

### Step 3: Export from the service index (if one exists in the domain)

### Step 4: Write a unit test

```bash
touch backend/src/__tests__/services/ScoringService.test.ts
```

### Rules for Services

- **Always scope by `organizationId`** — every query must include `WHERE organization_id = organizationId`. No exceptions.
- **Use the singleton pattern** — export a single instance as `export const scoringService = new ScoringService()`
- **Inject dependencies** — accept `PrismaClient` in the constructor for testability
- **Log with context** — always include `organizationId` and operation name in log statements
- **Never call InferenceService from middleware** — AI calls belong in services or route handlers, not middleware

---

## 5. How to Add a New Route

### Step 1: Create the route file

```bash
touch backend/src/routes/scoring.ts
```

### Step 2: Write the router

```typescript
// backend/src/routes/scoring.ts
import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { scoringService } from '../services/scoring/ScoringService.js';
import { errors } from '../middleware/errorHandler.js';

const router = Router();

const ComputeScoreSchema = z.object({
  dimension: z.string().min(1),
  period: z.enum(['7d', '30d', '90d']).default('30d'),
});

router.post('/compute', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = ComputeScoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return next(errors.validation('Invalid request', parsed.error.errors));
    }

    const result = await scoringService.computeScore(
      req.organizationId!,  // always available after requireOrgScope
      parsed.data
    );

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
```

### Step 3: Add to the appropriate domain router

```bash
# Find which domain this belongs to
# Edit: backend/src/routes/domains/platformDomain.ts (or relevant domain)
```

```typescript
// In the domain file
import scoringRoutes from '../scoring.js';
router.use('/scoring', scoringRoutes);
```

### Step 4: If it's a new domain, register in index.ts

```typescript
// backend/src/index.ts
app.use('/api/v1', requireOrgScope, newDomainRouter); // always use requireOrgScope
```

### Route Rules

- **Always validate with Zod** — never trust `req.body` without parsing
- **Use `req.organizationId!`** — always available after `requireOrgScope`, never query without it
- **Return standard envelope** — `{ success: true, data: ... }` for success, let `errorHandler` handle errors
- **Pass errors to `next(err)`** — never send 500 responses directly
- **Use `errors.*` factory** — `errors.notFound()`, `errors.forbidden()`, `errors.validation()` from `errorHandler.ts`

---

## 6. How to Add a New Middleware

### Template

```typescript
// backend/src/middleware/myMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export function myMiddleware(req: Request, res: Response, next: NextFunction): void {
  // Check condition
  if (shouldBlock(req)) {
    logger.warn('myMiddleware: blocked request', {
      path: req.path,
      method: req.method,
      organizationId: req.organizationId,
    });
    res.status(403).json({ success: false, error: { code: 'BLOCKED', message: 'Request blocked' } });
    return; // IMPORTANT: return after res.json — do NOT call next()
  }

  next(); // IMPORTANT: always call next() if not blocking
}
```

### Registering Middleware

In `backend/src/index.ts`, middleware runs in order of registration. Place it in the correct position in the chain. See §3 for the full chain order.

For **global middleware** (all routes): register before route mounting.
For **domain-specific middleware**: add to the domain router or individual routes.

### Middleware Rules

- **Always call `next()` or send a response** — never leave a request hanging
- **After `res.json()`, call `return`** — prevents "headers already sent" errors
- **Log with context** — include `path`, `method`, `organizationId` in warn/error logs
- **Test both the block path and the pass-through path**

---

## 7. Database: Prisma Patterns

### The Golden Rule: Always Scope by organizationId

```typescript
// CORRECT
const deliberations = await prisma.deliberations.findMany({
  where: {
    organization_id: organizationId, // from req.organizationId
    status: 'COMPLETED',
  },
});

// WRONG — never query without org scope (unless SUPER_ADMIN for admin ops)
const deliberations = await prisma.deliberations.findMany({
  where: { status: 'COMPLETED' },
});
```

### Ownership Verification for Individual Resources

```typescript
// Use verifyOrgOwnership from tenantIsolation.ts
import { verifyOrgOwnership } from '../middleware/tenantIsolation.js';

// Then in your route:
const record = await prisma.someTable.findUnique({ where: { id: recordId } });
if (!record || record.organization_id !== req.organizationId) {
  return next(errors.notFound('Record not found'));
}
```

### Prisma Schema Files

Schema files live in `backend/prisma/schema/`. There are 37 files — each covers a logical domain. After editing any schema file:

```bash
cd backend
npx prisma generate     # regenerate the Prisma client
npx prisma migrate dev --name describe_your_change  # create migration
```

### Migrations in Production

Migrations run automatically via `prisma migrate deploy` in the Docker build. Never run `migrate dev` in production.

---

## 8. Naming Conventions

### Files and Directories

| Item | Convention | Example |
|------|-----------|---------|
| Service class files | PascalCase | `ScoringService.ts` |
| Service directories | lowercase, hyphenated | `services/scoring/` |
| Route files | kebab-case | `scoring.ts`, `my-feature.ts` |
| Middleware files | camelCase | `myMiddleware.ts` |
| Test files | match source + `.test.ts` | `ScoringService.test.ts` |

### Code

| Item | Convention | Example |
|------|-----------|---------|
| Classes | PascalCase | `class ScoringService` |
| Singleton exports | camelCase | `export const scoringService` |
| Functions | camelCase | `computeScore()`, `blockIfDemo()` |
| Constants | UPPER_SNAKE_CASE | `MUTATING_METHODS`, `DEMO_PREFIXES` |
| Zod schemas | PascalCase + Schema | `ComputeScoreSchema` |
| Environment variables | UPPER_SNAKE_CASE | `OPENAI_API_KEY` |

### Product / Brand Names

Always capitalize Cendia brands: **CendiaVerify™**, **CendiaGateway™**, **The Council™**. Never lowercase in user-facing content.

---

## 9. Testing Requirements

### Test Coverage Standards

| Type | Minimum Coverage | Tool |
|------|-----------------|------|
| Service unit tests | 80% per new service | Jest |
| Route handler tests | Happy path + error cases | Jest + Supertest |
| E2E (new feature pages) | Critical user flow | Playwright |
| Visual regression | Screenshot for new pages | Playwright |

### Writing a Unit Test

```typescript
// backend/src/__tests__/services/ScoringService.test.ts
import { ScoringService } from '../../services/scoring/ScoringService';
import { prismaMock } from '../__mocks__/prisma';

describe('ScoringService', () => {
  let service: ScoringService;

  beforeEach(() => {
    service = new ScoringService(prismaMock);
    jest.clearAllMocks();
  });

  describe('computeScore', () => {
    it('scopes query by organizationId', async () => {
      prismaMock.someTable.findMany.mockResolvedValue([]);
      await service.computeScore('org-123', { dimension: 'quality', period: '30d' });
      expect(prismaMock.someTable.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ organization_id: 'org-123' }),
        })
      );
    });

    it('throws on invalid organizationId', async () => {
      await expect(service.computeScore('', { dimension: 'quality', period: '30d' }))
        .rejects.toThrow();
    });
  });
});
```

### Running Tests

```bash
# All backend tests
cd backend && npm test

# Watch mode
cd backend && npm run test:watch

# Frontend tests
npm test

# E2E (requires running dev server)
npm run test:e2e

# Load tests (requires k6)
k6 run tests/load/deliberation-load.js
```

---

## 10. PR Checklist and Standards

Every pull request must satisfy this checklist before review:

### Code Quality

- [ ] New service has a unit test covering at least the happy path and org-scope enforcement
- [ ] All Zod validation schemas are defined for new route inputs
- [ ] No `req.body` used without Zod parsing
- [ ] No database queries without `organization_id` scope (except SUPER_ADMIN admin routes)
- [ ] All new functions have JSDoc comments if they are exported from a service
- [ ] No `console.log` — use `logger.info/warn/error` from `utils/logger.ts`
- [ ] TypeScript strict mode: no implicit `any` in new code
- [ ] `express.static` order not changed (must remain before Helmet)

### Security

- [ ] No hardcoded secrets, API keys, or credentials in code
- [ ] New routes requiring auth use `requireAuth` middleware
- [ ] New org-scoped routes use `requireOrgScope`
- [ ] If the route handles demo-sensitive data, verify `demoGuardMiddleware` is in the chain
- [ ] Input validated with Zod before reaching service layer

### Documentation

- [ ] If adding a new service domain: update `docs/architecture/services-catalog.md`
- [ ] If adding a new named product/feature: update `docs/DATACENDIA-BIBLE.md` §3
- [ ] If adding a new middleware: update §5 (Middleware Chain) of the Bible
- [ ] If adding new terms: update `docs/GLOSSARY.md`
- [ ] Update `CHANGELOG.md` under the current version

### Commit Messages (Conventional Commits)

```
feat(council): add cross-examination phase timeout handling
fix(auth): resolve token refresh race condition on concurrent requests
docs(bible): add new Scoring service to services catalog
refactor(inference): extract provider health check into dedicated class
security(demog): extend blockIfDemo to cover PATCH methods
test(scoring): add org-scope enforcement tests for ScoringService
```

---

## 11. Common Pitfalls

### 1. Missing `return` after `res.json()`

```typescript
// WRONG — sends response, then calls next() — "headers already sent" error
if (condition) {
  res.json({ error: 'blocked' });
}
next();

// CORRECT
if (condition) {
  res.json({ error: 'blocked' });
  return;
}
next();
```

### 2. Querying without organizationId scope

```typescript
// WRONG — leaks data across organizations
const all = await prisma.deliberations.findMany();

// CORRECT
const scoped = await prisma.deliberations.findMany({
  where: { organization_id: req.organizationId },
});
```

### 3. Calling InferenceService directly (bypassing facade)

```typescript
// WRONG — bypasses provider abstraction, breaks cloud AI fallback
import { OllamaProvider } from '../services/inference/OllamaProvider.js';
const resp = await new OllamaProvider().complete(prompt);

// CORRECT — always use the singleton facade
import { inferenceService } from '../services/inference/InferenceService.js';
const resp = await inferenceService.complete(prompt);
```

### 4. Not using `.js` extension in ESM imports

```typescript
// WRONG — breaks in Node.js ESM mode
import { logger } from '../utils/logger';

// CORRECT — ESM requires explicit .js extension even for .ts files
import { logger } from '../utils/logger.js';
```

### 5. Registering express.static after security middleware

```typescript
// WRONG — assets get blocked by security middleware
app.use(helmet());
app.use(express.static(frontendDist)); // too late

// CORRECT — static assets must serve before any security checks
app.use(express.static(frontendDist)); // first
app.use(helmet());
```

### 6. Forgetting to update the domain router after creating a route

A new route file with no entry in any domain router is silently unreachable. Always trace: new route file → domain router → `index.ts` mount.

---

## 12. Key Files Reference

| File | Purpose |
|------|---------|
| `backend/src/index.ts` | Express entrypoint — middleware chain and route mounting |
| `backend/src/middleware/auth.ts` | JWT validation, user+org resolution |
| `backend/src/middleware/demoGuard.ts` | Demo org write protection |
| `backend/src/middleware/tenantIsolation.ts` | requireOrgScope, verifyOrgOwnership |
| `backend/src/middleware/errorHandler.ts` | Error factory (errors.notFound, etc.) and global error handler |
| `backend/src/middleware/aiRegulatoryMiddleware.ts` | AI route regulatory enforcement |
| `backend/src/services/inference/InferenceService.ts` | Singleton AI facade — use this, never providers directly |
| `backend/src/security/audit.service.ts` | AuditService — Merkle-chained event logging |
| `backend/src/config/database.ts` | Prisma client singleton |
| `backend/src/utils/logger.ts` | Winston logger — use this, never console.log |
| `backend/prisma/schema/` | 37 Prisma schema files — all database models |
| `src/config/serviceInfo.ts` | ServiceInfoDropdown content (22 service descriptions) |
| `docs/DATACENDIA-BIBLE.md` | Master platform reference |
| `docs/GLOSSARY.md` | All platform terms |
| `TIER-MAPPING.md` | Feature to pricing tier matrix |

---

*Last updated: April 2026 — v0.2.4-alpha*
*Questions: engineering@datacendia.com | Slack: #engineering-onboarding*
*See also: [CONTRIBUTING.md](../CONTRIBUTING.md) | [Datacendia Bible](./DATACENDIA-BIBLE.md) | [Glossary](./GLOSSARY.md)*
