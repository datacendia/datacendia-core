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

### Crown Jewels (v0.2.3+)
Advanced AI governance services with full dashboards:

| Service | Route | Purpose | Maturity |
|---------|-------|---------|----------|
| **CendiaEcho™** | `/cortex/crown/echo` | Decision outcome tracking & feedback loops | Preview |
| **CendiaGnosis™** | `/cortex/crown/gnosis` | Sovereign education engine & knowledge graph | Preview |
| **CendiaRedTeam™** | `/cortex/crown/red-team` | Automated adversarial testing dashboard | Preview |
| **CendiaPulse™** | `/cortex/monitor/live` | Real-time AI agent activity monitor | Preview |
| **CendiaLens™** | `/cortex/intelligence/lens` | AI interpretability & explainability | Preview |
| **CendiaChronos™** | `/cortex/intelligence/chronos` | Enterprise decision time machine | Preview |
| **CendiaCompliance™** | `/cortex/compliance/continuous-monitor` | Continuous compliance monitoring | Preview |
| **CendiaCourt™** | `/cortex/governance/constitutional-court` | Dispute resolution & precedent tracking | Preview |

### DCII Service UIs (v0.2.3+)
Decision Crisis Immunization Infrastructure with 6 specialized pages:

| Service | Route | Purpose | Maturity |
|---------|-------|---------|----------|
| **CendiaMemory™** | `/cortex/dcii/memory` | Institutional memory & Pantheon | Preview |
| **CendiaNotary™** | `/cortex/dcii/notary` | Digital notarization & key management | Preview |
| **CendiaTruth™** | `/cortex/dcii/truth` | Claim verification & fact validation | Preview |
| **CendiaWitness™** | `/cortex/dcii/witness` | Independent verification & blockchain proofs | Preview |
| **CendiaSimilarity™** | `/cortex/dcii/similarity` | Semantic precedent search | Preview |
| **CendiaTimestamp™** | `/cortex/dcii/timestamp` | RFC 3161 timestamp management | Preview |

### ServiceInfoDropdown (v0.2.3+)
Every service page listed above includes a collapsible `ServiceInfoDropdown` component that provides:
- **What it is** -- A concise description of the service
- **What it does** -- Key capabilities as a bullet list
- **How to use** -- Step-by-step instructions for each service

All service info is centralized in `src/config/serviceInfo.ts` (22 definitions).

### Immutable Audit Ledger
All decisions are recorded in a Merkle tree structure. Each entry is cryptographically linked to the previous one, creating a tamper-evident chain. Customer-owned signing keys ensure sovereignty.

### Domain Routers
The 156 route files are organized into 14 logical domain routers (auth, council, data, governance, security, sovereign, legal, verticals, platform, simulation, workflows, intelligence, demo, enterprise). Each domain router aggregates related routes under a single prefix.

## Community vs Enterprise

This is the **Community Edition** (Apache 2.0). Enterprise features (Apotheosis, Crucible, Collapse Orchestrator, 22 sovereign patterns, etc.) are available in the private `datacendia-components` repository. Enterprise navigation items in the UI redirect to an upgrade page.

Note: As of v0.2.3, the community edition includes all 19 service dashboards (Council, Replay, Gateway, DCII x6, Crown Jewels x3, Compliance, Escrow, GapScan, Pulse, Lens, Governance x2). The enterprise edition adds sovereign deployment patterns, full vertical packs, and advanced orchestration services.

The backend uses dynamic `import()` inside try/catch for enterprise modules, so the community edition runs without them.

## Related Repos

- [decision-governance-infrastructure](https://github.com/datacendia/decision-governance-infrastructure) -- DDGI framework specification (CC BY 4.0)
- [datacendia-marketing](https://github.com/datacendia/datacendia-marketing) -- Marketing website (datacendia.com)
