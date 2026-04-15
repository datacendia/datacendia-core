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
3. **Express middleware chain**: Helmet → CORS → Rate Limit → Body Parse → Cookie Parse → Compression → Request Logger → Security Middleware → CSRF
4. **Auth middleware** validates JWT, resolves user/org from PostgreSQL, caches in Redis; calls `blockIfDemo()` — write-protects demo orgs
5. **`requireOrgScope`** verifies `req.organizationId` is set; also calls `blockIfDemo()` as belt-and-suspenders (v0.2.4+)
6. **Domain router** dispatches to the appropriate route handler
7. **Route handler** validates input (Zod), calls service layer
8. **Service layer** executes business logic, queries Prisma/Redis/Neo4j
9. **Response** returns JSON with standard envelope format

### AI Route Middleware Chain (additional layers on `/api/v1/council`, `/api/v1/deliberations`, `/api/v1/inference`, `/api/v1/platform-assistant`)

```
Request
  ↓
[Auth Middleware]          ← validates JWT, resolves org
  ↓
[aiRegulatoryMiddleware]   ← classifies AI use-case against CO SB 205, NYC LL 144,
                              IL AIVIA, EU AI Act Annex III, GDPR Art. 22, BDSG §26
                              Hard-blocks prohibited practices (HTTP 451)
                              Hard-blocks IL AIVIA without consent (HTTP 451)
                              Attaches X-AI-Regulatory-Risk header
  ↓
[phiEnforcementMiddleware] ← if health domain: requires X-PHI-Deidentified: true
                              OR org.preferences.hipaaBAASigned: true
                              Otherwise blocks (HTTP 451) per HIPAA §164.502 + FTC HBNR
  ↓
[Route Handler / Council Engine]
  ↓
[AuditService.log()]       ← all regulatory decisions logged with severity
```

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

### Paid Tier Services (gated in Community Edition)

The following services are available in paid tiers (`datacendia-components`) and show an upgrade page in the Community Edition. All sidebar items for gated features show a lock icon and redirect to `/cortex/upgrade`.

| Service | Route | Tier | Purpose |
|---------|-------|------|----------|
| **CendiaCompliance™** | `/cortex/compliance/continuous-monitor` | Foundation | Continuous compliance monitoring |
| **CendiaGapScan™** | `/cortex/compliance/gap-scanner` | Foundation | Gap analysis across 8+ frameworks |
| **CendiaEcho™** | `/cortex/crown/echo` | Foundation | Decision outcome tracking |
| **CendiaGnosis™** | `/cortex/crown/gnosis` | Foundation | Cross-decision knowledge graph |
| **OmniTranslate** | via API | Foundation | 26-language compliance translation |
| **CendiaRedTeam™** | `/cortex/crown/red-team` | Enterprise | Automated adversarial testing |
| **CendiaEscrow™** | `/cortex/crypto/escrow` | Enterprise | Shamir SSS + VDF time-locks |
| **CendiaCourt™** | `/cortex/governance/constitutional-court` | Enterprise | Constitutional court / dispute resolution |
| **CendiaPulse™** | `/cortex/monitor/live` | Enterprise | Real-time agent monitor |
| **Shadow Council** | via API | Enterprise | Parallel adversarial deliberation |
| **SSO/MFA** | via Keycloak | Enterprise | Enterprise authentication |
| **SIEM Integration** | via API | Enterprise | Splunk, Sentinel, QRadar, Elastic |
| **ZK Proofs** | `/cortex/security/zkp` | Enterprise | Zero-knowledge compliance proofs |
| **COLLAPSE** | `/cortex/sovereign/collapse` | Strategic | Policy stress-testing (12 adversarial agents) |
| **SGAS** | `/cortex/sovereign/sgas` | Strategic | Synthetic governance agents |
| **Verticals** | `/verticals/*` | Strategic | 30 full vertical packs (12+ agents each) |
| **Federated Mesh** | via API | Strategic | Multi-org governance federation |
| **Air-Gapped** | via sovereign toggle | Strategic | Data diode, TPM, portable instances |

### ServiceInfoDropdown (v0.2.3+)
Foundation tier service pages include a collapsible `ServiceInfoDropdown` component that provides:
- **What it is** -- A concise description of the service
- **What it does** -- Key capabilities as a bullet list
- **How to use** -- Step-by-step instructions for each service

All service info is centralized in `src/config/serviceInfo.ts` (22 definitions).

### Immutable Audit Ledger
All decisions are recorded in a Merkle tree structure. Each entry is cryptographically linked to the previous one, creating a tamper-evident chain. Customer-owned signing keys ensure sovereignty.

### Compliance Services

Two new singleton services added in v0.2.4:

| Service | File | Purpose |
|---|---|---|
| `AIRegulatoryClassifier` | `backend/src/services/compliance/AIRegulatoryClassifier.ts` | Runtime classification of AI use-cases against 6 regulatory frameworks. Used by `aiRegulatoryMiddleware` and all privacy endpoints. |
| `IncidentMaterialityService` | `backend/src/services/compliance/IncidentMaterialityService.ts` | Multi-framework breach notification planning. Accepts incident metadata and returns a prioritised plan covering 14 regulatory frameworks with deadlines, draft notices, and regulator contacts. |

Two new middleware files in v0.2.4:

| Middleware | File | Applied To |
|---|---|---|
| `aiRegulatoryMiddleware` | `backend/src/middleware/aiRegulatoryMiddleware.ts` | All AI inference + deliberation routes |
| `phiEnforcementMiddleware` | `backend/src/middleware/phiEnforcementMiddleware.ts` | All AI inference + deliberation routes (after `aiRegulatoryMiddleware`) |

### Privacy API Routes

All 17 privacy endpoints live in `backend/src/routes/privacy.ts` and are mounted at `/api/v1/privacy`:

| Endpoint | Framework |
|---|---|
| `GET /access` | GDPR Art. 15 |
| `PATCH /rectify` | GDPR Art. 16 |
| `DELETE /erasure` | GDPR Art. 17 |
| `POST /restrict` | GDPR Art. 18 |
| `GET /export` | GDPR Art. 20 |
| `POST /deidentify` | HIPAA §164.514(b) Safe Harbor |
| `POST /appeal-ai-decision` | CO SB 205 §6-1-1703 / VA CDPA |
| `GET /aedt-disclosure` | NYC LL 144 |
| `GET /org-export` | EU Data Act Art. 23 |
| `POST /opt-out-profiling` | TX TDPSA / VA CDPA / CO CPA |
| `POST /ai-impact-assessment` | CO SB 205 / EU AI Act Art. 9 |
| `POST /classify-ai-use-case` | Developer tool |
| `GET /ccpa/notice` | CCPA §1798.130 |
| `POST /ccpa/opt-out` | CCPA §1798.120 |
| `GET /ccpa/status` | CCPA status |
| `POST /ccpa/limit-sensitive` | CPRA §1798.121 |
| `POST /wa-mhmda-consent` | WA MHMDA RCW 70.02 |

### Domain Routers
The 156 route files are organized into 14 logical domain routers (auth, council, data, governance, security, sovereign, legal, verticals, platform, simulation, workflows, intelligence, demo, enterprise). Each domain router aggregates related routes under a single prefix.

## Pricing Tiers (5 Tiers)

This is the **Community Edition** (Apache 2.0, free) — **v0.2.4-alpha** — providing the base platform: Council, Replay, DECIDE, DCII, Gateway, PII (regex), Evidence, 18+ verticals, full privacy/regulatory compliance engine.

Paid tiers (Pilot $50K, Foundation $150K–$500K, Enterprise $500K–$1.5M, Strategic $1.5M+) are in `datacendia-components`. See [TIER-MAPPING.md](TIER-MAPPING.md) and [docs/PRICING.md](docs/PRICING.md) for complete details.

Gated sidebar items show a lock icon and redirect to `/cortex/upgrade` (tier-aware, detects feature from URL). The backend uses dynamic `import()` inside try/catch for paid modules, so the Community Edition runs without them.

## Related Repos

- [decision-governance-infrastructure](https://github.com/datacendia/decision-governance-infrastructure) -- DDGI framework specification (CC BY 4.0)
- [datacendia-marketing](https://github.com/datacendia/datacendia-marketing) -- Marketing website (datacendia.com)
