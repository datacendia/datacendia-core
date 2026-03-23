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

## Tier Architecture (5 Tiers)

```
┌────────────────────────────────────────────────────────────────────┐
│                  STRATEGIC — $1.5M+/yr (components)                 │
│  Air-gapped · Data diode · TPM attestation · Federated mesh       │
│  Post-quantum crypto · Portable instances · CendiaBlackBox        │
│  CendiaMirage · Nation-scale deployment · Defense-grade            │
│  ──────────────────────────────────────────────────────────────────│
│                  ENTERPRISE — $500K–$1.5M/yr (components)           │
│  COLLAPSE stress testing · Shadow Council · 12 adversarial agents  │
│  SSO/MFA (Keycloak) · SIEM (Splunk, Sentinel, QRadar)            │
│  Zero-Knowledge Proofs · Multi-tenant · Constitutional Court       │
│  Sovereign LLM providers · Sovereign online toggle                │
│  CendiaRedTeam · Decision DNA · CendiaApotheosis                 │
│  ──────────────────────────────────────────────────────────────────│
│                  FOUNDATION — $150K–$500K/yr (components)           │
│  Full compliance engines (Basel III, EU AI Act, cross-jurisdiction) │
│  ML-based PII (Presidio) · Echo/Gnosis evidence · OmniTranslate  │
│  Expanded verticals (30, full decision schemas, 12+ agents each)  │
│  Gap Scanner · Regulatory Sandbox · Advanced analytics            │
│  ──────────────────────────────────────────────────────────────────│
│                  PILOT — $50K/yr (components)                       │
│  Managed deployment · 99.5% SLA · Priority support                │
│  Full deliberation engine · 90-day money-back guarantee           │
│  Dedicated onboarding · Basic compliance mapping                  │
│  ──────────────────────────────────────────────────────────────────│
│                  COMMUNITY — Free (datacendia-core, Apache 2.0)     │
│  The Council™ · CendiaReplay™ · CendiaGateway™                    │
│  DECIDE: Chronos · PreMortem · Ghost Board · Decision Debt        │
│  DCII: Truth · Notary · Witness · Timestamp · Similarity · Memory │
│  Pulse (monitoring) · Bridge (workflows) · Graph (knowledge)      │
│  PII detection (regex) · Immutable audit ledger · Evidence vault  │
│  18+ industry verticals (basic) · Browser extensions              │
│  Service Orchestration Workflow Builder (17 services)             │
│  Self-hosted · No SLA · No managed support                       │
└────────────────────────────────────────────────────────────────────┘
```

## Sovereign Online Toggle (Enterprise+)

Enterprise and Strategic tiers support fully sovereign deployments via a master environment toggle:

```
DATACENDIA_ONLINE_MODE=false         → All external calls blocked
DATACENDIA_CLOUD_AI_FALLBACK=error   → Hard 503 (auditor-safe default)
DATACENDIA_CLOUD_AI_FALLBACK=local   → Silent route to Ollama/NIM/Triton
```

When offline mode is active:
- Cloud AI providers (OpenAI, Anthropic) → blocked or routed to local LLM
- External data feeds (FRED) → cached/local datasets
- External notifications (email, webhook, SIEM) → internal event bus only
- System validates at startup that local providers are configured

The `SovereignModeService` lives in `datacendia-components/backend/src/services/sovereign/SovereignModeService.ts` and is wired into the InferenceService, FREDDataService, SIEMIntegration, email, and WebhookNotifier.

## Cross-Repo Comparison: Core vs Components

| Dimension | Community (Core) | Pilot+ (Components) |
|-----------|-----------------|---------------------|
| **License** | Apache 2.0 (open source) | Commercial |
| **Price** | Free | $50K – $1.5M+/yr |
| **Deliberation Engine** | ✅ Full (13 pages) | ✅ (included via Core) |
| **Decision Intelligence** | 4 core (Chronos, PreMortem, GhostBoard, DecisionDebt) | +8 advanced (Lens, Regulatory, Orbit, Consensus, What-If, Synthesis, RDP, Decision DNA) |
| **DCII Services** | ✅ Full (7 pages) | ✅ (included via Core) |
| **CendiaGateway** | ✅ + browser extensions | ✅ (included via Core) |
| **PII Detection** | Regex (10 types) | ML-based (Presidio, 40+ types) — Foundation+ |
| **Compliance** | Basic (enforcer + dashboard) | Full engines (Basel III, EU AI Act, cross-jurisdiction) — Foundation+ |
| **Evidence** | Basic (vault + export) | Echo/Gnosis audit replay — Foundation+ |
| **Industry Verticals** | 18 basic templates | 30 expanded (12+ agents each) — Foundation+ |
| **Stress Testing** | ❌ (gated → UpgradePage) | COLLAPSE + 12 adversarial agents — Enterprise+ |
| **Crown Jewels** | ❌ (gated → UpgradePage) | Echo, Gnosis, RedTeam — Foundation+ |
| **SSO/MFA** | ❌ | Keycloak integration — Enterprise+ |
| **SIEM** | ❌ | Splunk, Sentinel, QRadar, Elastic — Enterprise+ |
| **Sovereign/Air-gapped** | ❌ | Online toggle + air-gapped deployment — Enterprise+/Strategic |
| **ZK Proofs** | ❌ (gated → UpgradePage) | ✅ — Enterprise+ |
| **Federated Mesh** | ❌ | Multi-org governance — Strategic |
| **Post-Quantum Crypto** | ❌ | Dilithium, SPHINCS+ — Strategic |
| **Managed Platform** | Self-hosted only | Managed deployment + SLA — Pilot+ |
