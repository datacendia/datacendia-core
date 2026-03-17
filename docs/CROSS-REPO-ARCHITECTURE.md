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
│  │   ENTERPRISE SERVICES (23 services)                              │    │
│  │   ├── Procure, Scout, Habitat, Rainmaker, Guardian               │    │
│  │   ├── Nerve, Docket, Equity, Mesh, Factory                       │    │
│  │   ├── Transit, Academy, Resonance, Inventum, Regent              │    │
│  │   ├── Nexus, SSO                                                 │    │
│  │   ├── ServiceRegistry (60+ services), WorkflowPersistence        │    │
│  │   └── Feature gating via SubscriptionTiers.ts                    │    │
│  │                                                                  │    │
│  │   SOVEREIGN SERVICES (18 routes, 22 architectural patterns)      │    │
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
┌────────────────────────────────────────────────────────────────────┐
│                 STRATEGIC (datacendia-components)                    │
│  COLLAPSE · SGAS · Full Vertical Packs · Frontier                  │
│  CendiaNation · Defense/Pharma/Govt Packs                          │
│  ──────────────────────────────────────────────────────────────────│
│                ENTERPRISE (datacendia-components)                    │
│  Stress-Test · Comply · Gap Scan · Escrow · Govern                 │
│  Sovereign (18 routes / 22 patterns) · Operate (CendiaPulse)       │
│  Crown Jewels: Echo · Gnosis · RedTeam                             │
│  15 C-Suite Agents · 35+ Modes · SSO/CAC/PIV                      │
│  CendiaApotheosis · OmniTranslate · CendiaCrucible                │
│  CendiaOrchestrate (60+ services, all tiers)                      │
│  ──────────────────────────────────────────────────────────────────│
│                 FOUNDATION (datacendia-core — Apache 2.0)            │
│  The Council™ · CendiaReplay™ · CendiaGateway™                     │
│  DECIDE: Chronos · PreMortem · Ghost Board · Decision Debt         │
│  DCII: Truth · Notary · Witness · Timestamp · Similarity · Memory  │
│  Pulse (monitoring) · Bridge (workflows) · Graph (knowledge)       │
│  Compliance Readiness · Immutable Audit Ledger · Ollama/NIM        │
│  Service Orchestration Workflow Builder (17 Foundation services)    │
│  26 Vertical Frameworks (hub teaser) · Docker Compose              │
│  Browser Extensions · ServiceInfoDropdown (guided onboarding)      │
└────────────────────────────────────────────────────────────────────┘
```

## Cross-Repo Comparison: Core vs Components

| Dimension | Core (Foundation) | Components (Enterprise+Strategic) |
|-----------|-------------------|-----------------------------------|
| **License** | Apache 2.0 (open source) | Proprietary |
| **Price** | Free | From $499/mo (Enterprise) / Custom (Strategic) |
| **Total Routes** | ~170 accessible (~249 total, 79 gated) | ~274 total (~104 additional) |
| **Deliberation Engine** | ✅ Full (13 pages) | — (included via Core) |
| **Decision Intelligence** | 4 core tools (Chronos, PreMortem, GhostBoard, DecisionDebt) | +8 advanced (Lens, AuditProvenance, Regulatory, Orbit, Consensus, What-If, Synthesis, RDP) |
| **Crisis Immunization** | ✅ Full DCII (7 pages) | — (included via Core) |
| **AI Gateway** | ✅ CendiaGateway + browser extensions | — (included via Core) |
| **Knowledge Graph** | ✅ (3 pages: Explorer, Lineage, Entity) | — (included via Core) |
| **Compliance** | ✅ Basic (readiness checklist, 1 page) | ✅ 4 services (Continuous Monitor, Sandbox, Cross-Jurisdiction, Receipt) |
| **Governance/Court** | ❌ (gated → UpgradePage) | ✅ 2 services (Decision Packets, Constitutional Court) |
| **Crown Jewels** | ❌ (gated → UpgradePage) | ✅ 3 dashboards (Echo, RedTeam, Gnosis) |
| **Sovereign Deployment** | ❌ (gated → UpgradePage) | ✅ 18 routes (13 sovereign pages, 22 architectural patterns) |
| **Industry Verticals** | Hub teaser only (list visible, pages gated) | ✅ 26 full vertical packs |
| **Stress Testing** | ❌ (gated → UpgradePage) | ✅ CendiaCrucible + AdversarialRedTeam + COLLAPSE (Strategic) |
| **Live Operations** | Basic (Pulse — 3 pages) | ✅ CendiaPulse WebSocket (LiveAgentMonitor) |
| **Service Orchestration** | ✅ Workflow Builder (17 Foundation services) | ✅ Workflow Builder (60+ services, all tiers) |
| **ZKP / Crypto** | ❌ (gated → UpgradePage) | ✅ Escrow + ZKP |
| **SSO/CAC/PIV** | ❌ | ✅ SSOService + CAC/PIV auth |
| **HA / Monitoring** | Docker Compose (dev) | Production HA + Prometheus/Grafana/Jaeger |
