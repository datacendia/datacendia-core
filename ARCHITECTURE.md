# Architecture Overview

This document describes the high-level architecture of Datacendia Core for contributors and integrators.

## System Architecture

```
+--------------------------------------------------+
|                   FRONTEND                        |
|  React 18 + TypeScript + Vite                     |
|                                                    |
|  src/pages/         175 page components           |
|  src/components/    91 reusable UI components     |
|  src/services/      API client services           |
|  src/stores/        Zustand state management      |
|  src/layouts/       Page layout shells            |
|                                                    |
|  Port: 5173 (dev) / 80 (production)              |
+--------------------------------------------------+
          |  HTTP/WebSocket
          v
+--------------------------------------------------+
|                   BACKEND                         |
|  Express + TypeScript + Prisma                    |
|                                                    |
|  src/routes/        158 API route files           |
|  src/services/      356 business logic services   |
|  src/middleware/     Auth, rate limit, security    |
|  src/security/      8 security hardening modules  |
|  src/connectors/    35 external integrations      |
|  src/config/        12 configuration modules      |
|  src/websocket/     Real-time Socket.IO server    |
|                                                    |
|  Port: 3001                                       |
+--------------------------------------------------+
          |
          v
+--------------------------------------------------+
|                 DATA LAYER                        |
|                                                    |
|  PostgreSQL 16   Primary database (Prisma ORM)   |
|                  260 models across 24 schema files|
|                                                    |
|  Redis 7         Caching, sessions, rate limits  |
|                                                    |
|  Neo4j 5         Knowledge graph (optional)      |
+--------------------------------------------------+
```

## Directory Structure

```
datacendia-core/
|-- src/                    # Frontend (React)
|   |-- pages/              # Route-level page components
|   |-- components/         # Reusable UI components
|   |   |-- crypto/         # CendiaEvidence, CendiaStamp
|   |   +-- council/        # CendiaPrecedent, CendiaRedTeam
|   |-- services/           # API client services
|   |-- stores/             # Zustand state stores
|   |-- hooks/              # Custom React hooks
|   |-- contexts/           # React context providers
|   |-- layouts/            # Page layout components
|   |-- routes/             # React Router definitions
|   |-- lib/                # Client-side utilities
|   |-- config/             # Frontend configuration
|   +-- data/               # Static data and constants
|
|-- backend/
|   |-- src/
|   |   |-- routes/         # Express API route handlers
|   |   |   +-- domains/    # Aggregated domain routers
|   |   |-- services/       # Business logic layer
|   |   |-- middleware/      # Request processing pipeline
|   |   |-- security/       # Security hardening modules
|   |   |-- connectors/     # External system connectors
|   |   |-- adapters/       # Data transformation adapters
|   |   |-- config/         # Configuration and initialization
|   |   |-- core/           # Core infrastructure
|   |   |-- types/          # TypeScript type definitions
|   |   |-- utils/          # Shared utilities
|   |   |-- websocket/      # Socket.IO handlers
|   |   +-- index.ts        # Express entrypoint
|   |-- prisma/
|   |   |-- schema/         # 37 Prisma schema files (260 models)
|   |   +-- migrations/     # Database migrations
|   +-- package.json        # Backend dependencies
|
|-- tests/                  # Test suites
|   |-- e2e/                # Playwright end-to-end tests
|   |-- frontend/           # React component tests
|   |-- backend/            # Backend unit tests
|   |-- contract/           # Pact consumer contract tests
|   |-- visual/             # Visual regression tests
|   |-- load/               # k6 load tests
|   +-- ai-validation/      # AI behavior validation tests
|
|-- docker-compose.yml          # Production stack
|-- docker-compose.dev.yml      # Development stack
|-- docker-compose.demo.yml     # Demo mode (5 pre-seeded decisions)
+-- docker-compose.production.yml # Production with replicas
```

## Request Flow

1. **Client** sends HTTP request to frontend (Vite dev server or Nginx)
2. **Vite proxy** forwards `/api/*` requests to backend on port 3001
3. **Express middleware chain**: Helmet -> CORS -> Rate Limit -> Body Parse -> Cookie Parse -> Compression -> Request Logger -> Security Middleware -> CSRF
4. **Auth middleware** validates JWT, resolves user/org from PostgreSQL, caches in Redis
5. **Domain router** dispatches to the appropriate route handler
6. **Route handler** validates input (Zod), calls service layer
7. **Service layer** executes business logic, queries Prisma/Redis/Neo4j
8. **Response** returns JSON with standard envelope format

## Key Concepts

### The Council
The multi-agent deliberation engine. Multiple AI agents with distinct mandates (Financial, Legal, Ethics, Risk, etc.) independently analyze a decision, then deliberate to produce a consensus recommendation with dissent records.

### Decision Packets
Every Council deliberation produces a Decision Packet -- a signed, Merkle-rooted evidence artifact containing the full deliberation transcript, agent votes, dissent records, and cryptographic proof of integrity.

### Cryptographic Service UIs (v0.2.2+)
Eight frontend components provide user-facing interfaces for the platform's cryptographic primitives:

| Service | Route / Location | Purpose | Maturity |
|---------|-----------------|---------|----------|
| **CendiaVerify™** | `/verify` (public) | Third-party receipt verification portal | Preview |
| **CendiaEvidence™** | Component (RegulatorsReceiptPage) | Evidence package download (ZIP/HTML/JSON) | Preview |
| **CendiaGapScan™** | `/cortex/compliance/gap-scanner` | Compliance gap analysis across 8 frameworks | Preview |
| **CendiaStamp™** | Component (RegulatorsReceiptPage) | Cryptographic seal SVG renderer | Preview |
| **CendiaPrecedent™** | Component (PostDeliberationPanel) | TF-IDF similar decisions matching | Preview |
| **CendiaRedTeam™** | Component (PostDeliberationPanel) | 6-vector adversarial analysis report | Preview |
| **CendiaEscrow™** | `/cortex/crypto/escrow` | Shamir SSS + VDF time-lock management | Preview |
| **CendiaReplay™** | `/cortex/council/replay-theater` | Decision deliberation playback theater | Preview |

### Enterprise Tier Services (gated in Community Edition)
The following services are available in the full platform (`datacendia-components`) and show an upgrade page in the Community Edition:

| Service | Route | Tier | Purpose |
|---------|-------|------|----------|
| **CendiaCompliance™** | `/cortex/compliance/continuous-monitor` | Enterprise | Continuous compliance monitoring |
| **CendiaGapScan™** | `/cortex/compliance/gap-scanner` | Enterprise | Gap analysis across 8 frameworks |
| **CendiaEscrow™** | `/cortex/crypto/escrow` | Enterprise | Shamir SSS + VDF time-locks |
| **CendiaCourt™** | `/cortex/governance/constitutional-court` | Enterprise | Dispute resolution |
| **CendiaPulse™** | `/cortex/monitor/live` | Enterprise | Real-time agent monitor |
| **CendiaEcho™** | `/cortex/crown/echo` | Enterprise | Decision outcome tracking |
| **CendiaGnosis™** | `/cortex/crown/gnosis` | Enterprise | Sovereign education engine |
| **CendiaRedTeam™** | `/cortex/crown/red-team` | Enterprise | Automated adversarial testing |
| **COLLAPSE** | `/cortex/sovereign/collapse` | Strategic | Policy stress-testing |
| **SGAS** | `/cortex/sovereign/sgas` | Strategic | Synthetic governance agents |
| **Verticals** | `/verticals` | Strategic | 30 full vertical packs |
| **Frontier** | `/cortex/sovereign/sanctuary` | Strategic | Crisis bunker capabilities |

### ServiceInfoDropdown (v0.2.3+)
Foundation tier service pages include a collapsible `ServiceInfoDropdown` component that provides:
- **What it is** -- A concise description of the service
- **What it does** -- Key capabilities as a bullet list
- **How to use** -- Step-by-step instructions for each service

All service info is centralized in `src/config/serviceInfo.ts` (22 definitions).

### Immutable Audit Ledger
All decisions are recorded in a Merkle tree structure. Each entry is cryptographically linked to the previous one, creating a tamper-evident chain. Customer-owned signing keys ensure sovereignty.

### Domain Routers
The 156 route files are organized into 14 logical domain routers (auth, council, data, governance, security, sovereign, legal, verticals, platform, simulation, workflows, intelligence, demo, enterprise). Each domain router aggregates related routes under a single prefix.

## Community vs Enterprise

This is the **Community Edition** (Apache 2.0), which provides the **Foundation tier**: Council, Replay, DECIDE, DCII, and Gateway. Enterprise and Strategic tier features (Comply, Escrow, Crown Jewels, COLLAPSE, Sovereign patterns, etc.) are available in the full platform via the private `datacendia-components` repository.

Enterprise and Strategic navigation items in the sidebar show a lock icon and redirect to an upgrade page explaining what's available and how to get access.

The backend uses dynamic `import()` inside try/catch for enterprise modules, so the community edition runs without them.

## Related Repos

- [decision-governance-infrastructure](https://github.com/datacendia/decision-governance-infrastructure) -- DDGI framework specification (CC BY 4.0)
- [datacendia-marketing](https://github.com/datacendia/datacendia-marketing) -- Marketing website (datacendia.com)
