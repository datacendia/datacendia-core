# Cross-Repo Architecture Map

**Scope:** All 4 Datacendia repositories  
**Last Updated:** March 2026  
**Owner:** Engineering

## Repository Roles

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     DATACENDIA PLATFORM PORTFOLIO                       │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │              decision-governance-infrastructure                  │    │
│  │                                                                  │    │
│  │   DDGI Framework Specification (Normative, vendor-neutral)       │    │
│  │   ─────────────────────────────────────────────────────────      │    │
│  │   • 5 governance primitives (A–E)                                │    │
│  │   • Decision lifecycle architecture                              │    │
│  │   • Standards gap analysis & regulatory mapping                  │    │
│  │   • JSON schemas, OpenAPI spec, examples                         │    │
│  │                                                                  │    │
│  │   License: CC BY 4.0 │ Status: Candidate (self-published)       │    │
│  └──────────────────────────┬──────────────────────────────────────┘    │
│                              │ implements                               │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                      datacendia-core                             │    │
│  │                                                                  │    │
│  │   Community Edition — Open-Source Platform Runtime                │    │
│  │   ─────────────────────────────────────────────────────────      │    │
│  │                                                                  │    │
│  │   FRONTEND (React 18 + Vite + Tailwind)                          │    │
│  │   ├── Components, Pages, Services, Stores                       │    │
│  │   └── Admin UI, Council UI, Dashboard                            │    │
│  │                                                                  │    │
│  │   BACKEND (Express + TypeScript)                                 │    │
│  │   ├── Routes (domain-grouped, 14 logical domains)                │    │
│  │   ├── Services (council, evidence, inference, verticals)         │    │
│  │   ├── Security (auth, CSRF, rate limiting, policy engine)        │    │
│  │   └── Middleware (tenant isolation, input validation)             │    │
│  │                                                                  │    │
│  │   INFRASTRUCTURE                                                 │    │
│  │   ├── PostgreSQL 16 (Prisma ORM)                                 │    │
│  │   ├── Redis 7 (cache, pub/sub)                                   │    │
│  │   ├── Neo4j 5 (knowledge graph)                                  │    │
│  │   ├── Ollama (local LLM inference)                               │    │
│  │   ├── Qdrant (vector search)                                     │    │
│  │   └── Docker Compose (dev/demo/production)                       │    │
│  │                                                                  │    │
│  │   License: Apache 2.0 │ Branch: master                           │    │
│  └──────────────────────────┬──────────────────────────────────────┘    │
│                              │ extends                                  │
│                              ▼                                          │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    datacendia-components                         │    │
│  │                                                                  │    │
│  │   Enterprise Edition — Private Extension Layer                   │    │
│  │   ─────────────────────────────────────────────────────────      │    │
│  │                                                                  │    │
│  │   ENTERPRISE SERVICES (18 services)                              │    │
│  │   ├── Procure, Scout, Habitat, Rainmaker, Guardian               │    │
│  │   ├── Nerve, Docket, Equity, Mesh, Factory                       │    │
│  │   ├── Transit, Academy, Resonance, Inventum, Regent              │    │
│  │   ├── Nexus, SSO                                                 │    │
│  │   └── Feature gating via SubscriptionTiers.ts                    │    │
│  │                                                                  │    │
│  │   SOVEREIGN SERVICES (22 patterns)                               │    │
│  │   ├── Data Diode, Shadow Council, QR Air-Gap Bridge              │    │
│  │   ├── TPM Attestation, Federated Mesh, Time Lock                 │    │
│  │   └── Air-gapped deployment support                              │    │
│  │                                                                  │    │
│  │   DEPLOYMENT                                                     │    │
│  │   ├── Production, HA, Sovereign compose files                    │    │
│  │   ├── Dockerfiles (frontend, backend, all-in-one)                │    │
│  │   └── Monitoring stack (Prometheus, Grafana, Jaeger)              │    │
│  │                                                                  │    │
│  │   License: Proprietary │ Branch: main                            │    │
│  └─────────────────────────────────────────────────────────────────┘    │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────────┐    │
│  │                    datacendia-marketing                          │    │
│  │                                                                  │    │
│  │   GTM Surface — Static Marketing Website                         │    │
│  │   ─────────────────────────────────────────────────────────      │    │
│  │   • Static HTML/CSS/JS (vanilla, no framework)                   │    │
│  │   • 11 language locales (i18n via translations.js)               │    │
│  │   • Interactive demos (14 self-contained HTML demos)              │    │
│  │   • Trust center + conformance PDFs + SBOM                       │    │
│  │   • SEO/GEO (llms.txt, sitemap, learn/ articles)                 │    │
│  │   • Claim registry + governance process                          │    │
│  │                                                                  │    │
│  │   Hosting: Namecheap (Apache) │ License: Proprietary             │    │
│  └─────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow

```
                    ┌──────────────┐
                    │   Browser    │
                    └──────┬───────┘
                           │ HTTPS
                    ┌──────▼───────┐
                    │    Nginx     │ (datacendia-components: Dockerfile)
                    │  (frontend)  │
                    └──────┬───────┘
                           │ /api/v1/*
                    ┌──────▼───────┐
                    │   Express    │ (datacendia-core: backend/)
                    │  (backend)   │
                    └──┬───┬───┬───┘
              ┌────────┘   │   └────────┐
              ▼            ▼            ▼
        ┌──────────┐ ┌──────────┐ ┌──────────┐
        │PostgreSQL│ │  Redis   │ │  Neo4j   │
        │ (data)   │ │ (cache)  │ │ (graph)  │
        └──────────┘ └──────────┘ └──────────┘
              │
              ▼
        ┌──────────┐     ┌──────────┐
        │  Ollama  │     │  Qdrant  │
        │  (LLM)   │     │ (vector) │
        └──────────┘     └──────────┘
```

## Boundary Rules

| Boundary | Rule |
|----------|------|
| **DGI → Core** | Core implements DGI primitives; DGI does not reference Core code |
| **Core → Components** | Core never imports from Components; Components extends Core |
| **Components → Core** | Components can import Core modules; enforced via ESLint `no-restricted-imports` |
| **Marketing → Platform** | Marketing claims must match platform capability; governed by Claim Registry |
| **SBOM scope** | `trust/sbom.json` in marketing covers the **platform** (Core + Components), not the marketing site |

## Cross-Repo Artifacts

| Artifact | Location | Scope |
|----------|----------|-------|
| **Claim Registry** | `datacendia-marketing/docs/CLAIM-REGISTRY.md` | All 4 repos |
| **Maturity Taxonomy** | `datacendia-core/docs/MATURITY-TAXONOMY.md` | All 4 repos |
| **Trust Facts** | `datacendia-core/docs/TRUST-FACTS.json` | Core (CI-generated) |
| **Enterprise Inventory** | `datacendia-components/docs/ENTERPRISE-INVENTORY.md` | Components (CI-generated) |
| **Tier-Feature Matrix** | `datacendia-components/docs/TIER-FEATURE-MATRIX.md` | Components (CI-generated) |
| **Traceability Matrix** | `decision-governance-infrastructure/docs/TRACEABILITY-MATRIX.md` | DGI → Core mapping |
| **SBOM** | `datacendia-marketing/trust/sbom.json` | Platform (CycloneDX) |

## Tier Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                        STRATEGIC                               │
│  Collapse · SGAS · Deep Verticals · Frontier · Nation-Scale   │
│  ─────────────────────────────────────────────────────────────│
│                        ENTERPRISE                              │
│  StressTest · Comply · Govern · Sovereign · Operate            │
│  Crucible · Red Team · War Games · Compliance Monitor          │
│  Autopilot · PQ-KMS · 19 Co-Pilots · OmniTranslate           │
│  ─────────────────────────────────────────────────────────────│
│                        FOUNDATION                              │
│  The Council™ · DECIDE™ · DCII™                               │
│  PreMortem · Ghost Board · Decision Debt · Chronos             │
│  Evidence Vault · Regulator's Receipt · IISS Scoring           │
│  ─────────────────────────────────────────────────────────────│
│                     COMMUNITY (Apache 2.0)                     │
│  Core Council Engine · Decision Ledger · Basic Trust Layer     │
│  Local Ollama Inference · Docker Compose                       │
└───────────────────────────────────────────────────────────────┘
```
