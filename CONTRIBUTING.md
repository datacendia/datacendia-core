# Contributing to Datacendia

Thank you for your interest in contributing to Datacendia -- The Defensible AI Platform.

## Quick Start

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/datacendia-core.git
cd datacendia-core

# Install dependencies (Prisma client auto-generates via postinstall)
npm install
cd backend && npm install && cd ..

# Start infrastructure
docker compose up -d postgres redis neo4j ollama

# Run migrations
cd backend && npx prisma migrate deploy && cd ..

# Start development
npm run dev          # Frontend on :5173
cd backend && npm run dev  # Backend on :3001
```

## Development Workflow

1. **Fork** the repository
2. **Create a branch** from `master`: `git checkout -b feat/my-feature`
3. **Make changes** following the coding standards below
4. **Test** your changes
5. **Commit** with conventional commits: `feat:`, `fix:`, `docs:`, `refactor:`
6. **Push** and open a Pull Request

## Branch Naming

- `feat/description` -- New features
- `fix/description` -- Bug fixes
- `docs/description` -- Documentation
- `refactor/description` -- Code refactoring
- `test/description` -- Test additions

## Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(council): add cross-examination mode
fix(auth): handle expired JWT refresh tokens
docs: update deployment guide for Kubernetes
refactor(api): consolidate route handlers
```

## Coding Standards

### TypeScript
- Strict mode enabled
- No `any` types unless absolutely necessary (document why)
- Use `interface` over `type` for object shapes
- Explicit return types on exported functions

### React
- Functional components only
- Named exports (not default) for components
- Custom hooks prefixed with `use`
- Prop interfaces named `ComponentNameProps`

### Backend
- Express route handlers in `backend/src/routes/`
- Business logic in `backend/src/services/`
- Prisma for database access
- Zod for request validation

### File Organization
- One component per file
- Co-locate tests with source (`Component.test.tsx`)
- Index files for barrel exports

## Architecture Overview

```
datacendia-core/
├── src/                    # React frontend (Vite + TailwindCSS)
│   ├── components/         # Reusable UI components
│   ├── contexts/           # React context providers (Auth, Theme, i18n)
│   ├── pages/              # Route-level page components
│   │   ├── auth/           # Login, Register, Verify
│   │   ├── cortex/         # Main app shell (Council, Decisions, Data, etc.)
│   │   └── public/         # Landing pages
│   ├── stores/             # Zustand state management
│   └── routes/             # React Router config
├── backend/
│   ├── src/
│   │   ├── routes/         # Express route handlers
│   │   ├── services/       # Business logic (Council, PII, LLM, Verticals)
│   │   ├── middleware/      # Auth, tenant isolation, error handling
│   │   ├── config/         # Database, Redis, environment config
│   │   └── __tests__/      # Vitest unit + integration tests
│   └── prisma/             # Schema + migrations
├── tests/e2e/              # Playwright E2E tests
├── docker-compose.demo.yml # One-command demo environment
└── Dockerfile.allinone     # Railway / single-container deployment
```

**Key services:**
- **The Council** — Multi-agent deliberation engine (`backend/src/services/council/`)
- **DCII** — Decision Chain Integrity Infrastructure, cryptographic audit (`backend/src/services/dcii/`)
- **PII Detector** — Regex + heuristic NER scanner (`backend/src/services/pii/`)
- **CendiaGateway** — AI governance proxy (`backend/src/services/gateway/`)
- **Tenant Isolation** — `orgWhere()` and `requireOrgScope` middleware for multi-tenant data safety

## Testing

### Unit Tests (Vitest)
```bash
cd backend && npx vitest run                         # All tests
cd backend && npx vitest run src/__tests__/pii-detector.test.ts  # PII only
cd backend && npx vitest run src/__tests__/council-api.test.ts   # Council API (needs running backend)
```

- **PII Detector**: 60 pure unit tests, no external dependencies
- **Council API**: 18 integration tests against live backend (gracefully skip if offline)

### E2E Tests (Playwright)
```bash
cd tests/e2e && npx playwright test tests/demo-mode.spec.ts  # Demo mode flow
cd tests/e2e && npx playwright test                           # All E2E tests
```

Requires `docker compose -f docker-compose.demo.yml up -d` running.

### Writing Tests
- **No mocks** for API integration tests — test against the real running backend
- Pure unit tests are fine for isolated logic (PII regex, data transforms)
- E2E tests should be resilient to timing — use `waitForLoadState('networkidle')` and generous timeouts

## What to Contribute

### Good First Issues
- Look for issues labeled `good-first-issue`
- Documentation improvements
- Test coverage additions
- Bug fixes with clear reproduction steps

### High Impact
- New council deliberation modes
- Industry vertical agents
- Compliance framework integrations
- Performance improvements
- Accessibility improvements

### Community vs Enterprise

This is the **Community Edition** (Apache 2.0). Enterprise features live in a separate private repository.

**Community-safe directories** (contribute freely):
- `src/pages/cortex/council/` -- Council deliberation UI
- `src/pages/admin/` -- Admin dashboard
- `src/pages/verticals/` -- Industry vertical pages
- `src/components/` -- All reusable UI components
- `backend/src/routes/` -- API endpoints (except `domains/enterprise.domain.ts`)
- `backend/src/services/` -- Business logic services
- `backend/src/middleware/` -- Request middleware
- `backend/src/security/` -- Security hardening
- `tests/` -- All test suites

**Enterprise-only** (do not add to this repo):
- Features referencing Apotheosis, Crucible, Ghost Board, Panopticon, Collapse Orchestrator
- Post-quantum KMS, DCII scoring engine, OmniTranslate
- Any code that imports from enterprise-only modules

**How to check**: Enterprise nav items in the UI redirect to `/cortex/upgrade`. If your feature would need to live behind that gate, it belongs in the enterprise repo.

See [COMMUNITY.md](COMMUNITY.md) and [ARCHITECTURE.md](ARCHITECTURE.md) for more details.

## Code of Conduct

Please read our [Code of Conduct](CODE_OF_CONDUCT.md). We are committed to providing a welcoming and inclusive experience for everyone.

## Questions?

- Open a [GitHub Discussion](https://github.com/datacendia/datacendia-core/discussions)
- Email: community@datacendia.com

Thank you for helping make AI decisions defensible.
