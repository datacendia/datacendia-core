# Datacendia Product Roadmap

> Last audited: March 21, 2026
> Source: Automated audit of `datacendia-core` and `datacendia-components`

---

## Two Products, Two Tracks

| | datacendia-core | datacendia-components |
|--|----------------|----------------------|
| **What** | Community Edition | Full Platform |
| **License** | Apache 2.0 (free, open-source) | Paid (Enterprise + Strategic tiers) |
| **Focus** | Cloud AI governance — governing interactions with online AI APIs | Full AI governance — cloud, local LLMs, on-prem, sovereign, air-gapped |
| **Gateway** | Reverse proxy for cloud AI (OpenAI, Anthropic, Gemini, etc.) + browser extension | Everything in core + inbound scope proxy, OAuth2 agent scoping, local LLM governance |
| **Backend** | 290 service files (~4.2 MB) — Foundation tier | **1,747 .ts/.tsx files (27.5 MB)** — 454 services, 160 routes, 200,000+ tests, 35 connectors, 321 frontend pages/components |
| **Stubs** | 49 (Enterprise/Strategic features gated → UpgradePage) | 0 (everything implemented) |
| **Target user** | Developer trying Datacendia, open-source community, design partner pilot | Paying enterprise customer, regulated industry, sovereign deployment |

---

# 🟢 CORE TRACK — `datacendia-core`

> Community Edition. Free. Open-source. Focused on **cloud AI governance**.
> Goal: Drive adoption, attract design partners, prove the product works.

## What's Already Built in Core

| Service Area | Files | Size | Status |
|-------------|-------|------|--------|
| **CendiaGateway** (reverse proxy, PII, policies, browser ext, network proxy) | 16 | 213 KB | ✅ Production |
| **Council** (50+ agent deliberation, WebSocket, decision packets) | 8 | 218 KB | ✅ Production |
| **Evidence** (vault, export, ledger, compliance dashboard, signed reports) | 8 | 236 KB | ✅ Production |
| **Compliance** (enforcer, continuous monitor, cross-jurisdiction, sandbox) | 7 | 174 KB | ✅ Production |
| **Crypto** (Merkle forest, ZKP, escrow, key mgmt, content-addressed receipts) | 14 | 152 KB | ✅ Production |
| **Inference** (OpenAI, Anthropic, Gemini, Ollama, NIM, Triton, Together) | 10 | 80 KB | ✅ Production |
| **Pillars** (Helm, Lineage, Predict, Flow, Health, Guard, Ethics, Agents) | 9 | 161 KB | ✅ Production |
| **Legal** (legal research, tool executor, compliance guard) | 9 | 247 KB | ✅ Production |
| **Security** (8 services + Sentry 50KB) | 10 | 192 KB | ✅ Production |
| **SGAS** (8 services) | 8 | 232 KB | ✅ Production |

## Core Roadmap

### C1. Gateway Hardening (Now — 4 weeks)

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Agent Identity** | Add `agentId` field to gateway interactions — track which AI agent performed each action, not just which user | 2 days | 🔨 Build new |
| **Scope Visibility UX** | Dashboard showing "this agent can access X but not Y" in plain language — the trust UX that the a16z post says is missing | 3 days | 🔨 Build new |
| **Scope Audit Trail** | Log every scope check (allowed/denied) with cryptographic evidence — already have the signing infra, just need the scope events | 3 days | 🔧 Harden |
| **Presidio PII Integration** | `PresidioPIIService.ts` (10KB) exists — wire ML-based NER into the regex-based `PIIDetector.ts` | 3 days | 🔗 Wire up |
| **PII Evaluation Metrics** | `PIIEvaluationMetrics.ts` (15KB) exists — surface precision/recall/F1 on the gateway dashboard | 2 days | 🔗 Wire up |
| **Custom PII Patterns** | Let orgs define industry-specific PII patterns (medical record numbers, IBANs, etc.) | 3 days | 🔨 Build new |
| **HIPAA PII rules** | Healthcare-specific PII blocking rules for design partner #1 | 3 days | 🔨 Build new |

### C2. Design Partner Readiness (Weeks 2–6)

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Usage dashboard polish** | Self-service view of governance stats, PII detections, cost tracking — already exists, needs UX polish | 3 days | 🔧 Harden |
| **Evidence export (PDF)** | One-click Governance Receipt export — `ManifestExporter.ts` (17KB) and `RegulatorsReceiptService.ts` (58KB) exist | 2 days | 🔗 Wire up |
| **Splunk/Elastic SIEM** | `SIEMIntegration.ts` (15KB) exists — productize for design partners who need SIEM forwarding | 3 days | 🔗 Wire up |
| **Prometheus /metrics** | `metrics/` directory exists — expose standard /metrics endpoint for Grafana | 2 days | 🔗 Wire up |
| **Horizontal scaling** | Make gateway stateless behind a load balancer for production deployments | 1 week | 🔧 Harden |
| **Redis caching** | `cache.service.ts` exists — wire up Redis for session/policy caching | 3 days | 🔗 Wire up |
| **GitHub Actions CI/CD** | Governance checks for AI model deployments in CI pipelines | 1 week | 🔨 Build new |

### C3. Community & Ecosystem (Weeks 7–24)

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Documentation site** | Developer docs, API reference, quickstart guides | 2 weeks | 🔨 Build new |
| **Helm chart (basic)** | Single-node Kubernetes deployment for core | 1 week | 🔨 Build new |
| **Plugin SDK** | Let community build custom PII detectors, policy rules, and integrations | 2 weeks | 🔨 Build new |
| **E2E test suite** | 200,000+ unit tests exist across both repos — add integration/E2E coverage | 2 weeks | 🔨 Build new |
| **18 vertical stubs** | Fill the remaining vertical index stubs (aerospace, agriculture, automotive, etc.) | 1 week | 🔧 Harden |

---

# 🔵 COMPONENTS TRACK — `datacendia-components`

> Full Platform. Paid. Enterprise + Strategic tiers.
> Goal: Revenue. Everything customers pay for lives here.
> **454 services (9.1 MB), 160 API routes, 200,000+ tests, 35 connectors, 321 frontend pages/components — 1,747 files totalling 27.5 MB of production code.**

## What's Already Built in Components (on top of everything in Core)

### Enterprise Tier — Already Implemented

| Service | Size | What It Does |
|---------|------|-------------|
| CendiaCrucible (COLLAPSE) | 99 KB | AI stress testing — systematic failure mode analysis |
| CendiaApotheosis | 76 KB | Decision transcendence — pattern emergence across decisions |
| CendiaHorizon | 72 KB | Predictive governance — forecast risks before they materialize |
| CendiaGuardian | 57 KB | AI guardian — continuous AI system monitoring |
| CendiaPanopticon | 50 KB | Full-stack AI observability |
| CendiaOmniTranslate | 50 KB | 26-language governance i18n |
| CendiaInventum | 48 KB | Discovery engine — find governance gaps automatically |
| CendiaTransit | 48 KB | Data transit governance — track data flows |
| CendiaDissent | 48 KB | Anonymous dissent — protected whistleblower channels |
| CendiaResonance | 47 KB | Decision resonance — cross-org pattern detection |
| Echo (Decision Playback) | 45 KB | Full replay of any historical decision with all context |
| CendiaHabitat | 45 KB | Environment governance — dev/staging/prod governance |
| CendiaAcademy | 43 KB | Governance training platform |
| CendiaFactory | 42 KB | Decision factory — templated governance workflows |
| CendiaScout | 41 KB | Threat intelligence — emerging AI governance threats |
| CendiaVox | 41 KB | Voice/NLP governance |
| CendiaDocket | 40 KB | Legal docket management |
| CrossJurisdictionConflict | 40 KB | Multi-jurisdiction conflict resolution |
| CendiaEquity | 36 KB | Equity & fairness analysis |
| CendiaRainmaker | 34 KB | Revenue intelligence — governance ROI |
| CendiaRegent | 34 KB | Executive governance dashboard |
| CendiaSymbiont | 33 KB | Human-AI symbiosis optimization |
| CendiaEternal | 31 KB | Archival & retention governance |
| Gnosis (Knowledge Synthesis) | 26 KB | Cross-decision knowledge graph |
| RedTeam | 25 KB | Adversarial AI governance testing |
| + 40 more enterprise services | — | All fully implemented |

### Strategic Tier — Already Implemented

| Service | Size | What It Does |
|---------|------|-------------|
| FederatedMesh | 43 KB | Multi-org governance without centralized data |
| DataDiode | 38 KB | One-way data flow for classified environments |
| SyntheticMediaAuth | 36 KB | Deepfake detection for evidence integrity |
| DecisionDNA | 35 KB | Decision fingerprinting — unique pattern ID |
| LocalRLHF | 33 KB | Fine-tune governance models on-prem |
| WarGames | 26 KB | Scenario simulation / war gaming |
| QRAirGapBridge | 25 KB | USB/QR-based updates for disconnected environments |
| PortableInstance | 25 KB | Single-binary edge deployment |
| TPMAttestation | 24 KB | Hardware-rooted trust |
| TimeLock | 23 KB | Time-delayed decryption |
| ShadowCouncil | 21 KB | Adversarial deliberation |
| PostQuantumKMS | 20 KB | Lattice-based key management |
| ZeroKnowledgeProof | 18 KB | Prove compliance without revealing data |
| NLPBiasDetection | 17 KB | Language-level bias analysis |
| CogBiasMitigation | 27 KB | Cognitive bias detection in AI decisions |
| + 30 more strategic services | — | All fully implemented |

## Components Roadmap

### E1. Packaging & Productization (Now — 4 weeks)

These services are built but need packaging for customers:

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Single-tenant deployment script** | Docker Compose + .env template for design partner environments | 3 days | 🔧 Harden |
| **Onboarding wizard** | First-run setup: connect AI providers, set policies, invite users, pick tier | 1 week | 🔨 Build new |
| **Tier licensing enforcement** | `licensing.service.ts` (18KB) exists — wire into route middleware | 3 days | 🔗 Wire up |
| **Feature flags** | `FeatureControlService.ts` (43KB) exists — expose in admin UI | 3 days | 🔗 Wire up |
| **Tenant isolation** | `TenantService.ts` (18KB) exists — multi-tenant data isolation | 1 week | 🔗 Wire up |

### E2. Inbound Scope Proxy — The "Scoped Gmail" Play (Weeks 2–8)

This is the a16z opportunity. Core handles outbound (User → AI). Components handles inbound (AI Agent → Enterprise Systems):

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Inbound scope definitions** | Define what enterprise data an agent can read (by resource type, department, data classification) | 1 week | 🔨 Build new |
| **OAuth2 Scope Proxy** | Wrap Gmail/Outlook/Salesforce/ServiceNow APIs with CendiaGateway-enforced scopes | 2 weeks | 🔨 Build new |
| **Local LLM governance** | Extend gateway to govern Ollama, vLLM, and on-prem model servers — not just cloud APIs | 1 week | 🔧 Harden |
| **Agent credential vault** | Each AI agent gets its own scoped credentials, separate from user identity | 1 week | 🔨 Build new |

### E3. Compliance Automation (Weeks 5–12)

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **EU AI Act Article 12** | Automated logging requirements compliance check — frameworks.ts (46KB) has the rules | 1 week | 🔧 Harden |
| **SOC 2 Type II evidence package** | Auto-generate SOC 2 evidence from gateway logs + evidence vault | 2 weeks | 🔨 Build new |
| **ISO 42001 gap scanner** | Map governance posture to ISO 42001 — `ComplianceService.ts` (28KB) has framework | 1 week | 🔧 Harden |
| **DORA operational resilience** | Financial services compliance package | 1 week | 🔧 Harden |

### E4. Integration Connectors (Weeks 8–24)

| Item | Description | Effort | Work Type |
|------|-------------|--------|-----------|
| **Salesforce connector** | Log AI-assisted CRM decisions through gateway | 2 weeks | 🔨 Build new |
| **ServiceNow connector** | Governance tickets + approval workflows | 2 weeks | 🔨 Build new |
| **Jira/Atlassian connector** | Decision tracking in project management | 1 week | 🔨 Build new |
| **Slack/Teams bot** | Real-time governance alerts + approval requests | 1 week | 🔨 Build new |
| **Power BI / Tableau embed** | Governance dashboards in existing BI tools | 1 week | 🔨 Build new |
| **Terraform provider** | Infrastructure-as-code for gateway policies | 2 weeks | 🔨 Build new |
| **Kafka event streaming** | kafka/ directory (41KB) exists — productize | 1 week | 🔗 Wire up |
| **Neo4j graph database** | graphIngestion.ts (12KB) exists — connect for decision lineage | 1 week | 🔗 Wire up |
| **Kubernetes Helm chart** | Production-grade multi-node deployment | 1 week | 🔨 Build new |

### E5. Strategic Moat (Weeks 25–52)

All of these are already built — the work is **testing, documentation, and customer-facing packaging**:

| Item | Size | Work Type |
|------|------|-----------|
| Post-Quantum KMS | 20 KB | 📦 Package |
| Time-Lock Encryption | 23 KB | 📦 Package |
| Zero-Knowledge Proofs | 18 KB | 📦 Package |
| Local RLHF | 33 KB | 📦 Package |
| Shadow Council | 21 KB | 📦 Package |
| Cognitive Bias Mitigation | 27 KB | 📦 Package |
| Synthetic Media Auth | 36 KB | 📦 Package |
| NLP Bias Detection | 17 KB | 📦 Package |

---

# Shared: Certifications & Market Expansion

These apply to both repos:

| Item | Description | Effort | Priority |
|------|-------------|--------|----------|
| **SOC 2 Type II audit** | Required for enterprise procurement | 3 months | Critical |
| **EU AI Act conformity assessment** | Third-party certification | 3 months | High |
| **ISO 42001 certification** | AI management system certification | 3 months | High |
| **FedRAMP authorization** | Required for US government sales | 6+ months | High |
| **IL4/IL5 certification** | Required for DoD classified environments | 6+ months | Medium |

---

# Competitive Positioning

| Competitor | Their Strength | Our Differentiator | Action |
|-----------|---------------|-------------------|--------|
| **Palantir** | Government contracts, data integration | Multi-agent deliberation, cryptographic evidence, open-source core | Push FedRAMP |
| **C3.ai** | Enterprise AI platform | Governance-first, not model-first | "Why governance before models" whitepaper |
| **Dataiku** | Data science workflows | We govern decisions, not data prep | Build Dataiku integration |
| **H2O.ai** | AutoML | We're the accountability layer H2O lacks | "H2O builds models, Datacendia governs them" |
| **Databricks** | Data lakehouse | Governance as a complementary layer | Unity Catalog integration |

---

# Verticals

89 verticals fully implemented in components. Top 8 for design partner outreach:

| # | Vertical | Status | Why First |
|---|----------|--------|-----------|
| 1 | **Healthcare** | Full | HIPAA + clinical AI |
| 2 | **Financial Services** | Full | PGIM connection |
| 3 | **Defense** | Full | Cleared-ready |
| 4 | **Legal** | Full | Fastest AI adoption |
| 5 | **Energy** | Full | Critical infrastructure |
| 6 | **Government** | Full | Federal AI mandate |
| 7 | **Insurance** | Full | AI risk |
| 8 | **Pharma** | Full | FDA compliance |

---

# Key Dates

| Date | Milestone |
|------|-----------|
| **Now** | Send first 10 design partner decks |
| **Week 2** | First design partner call (PGIM / Matt Fitzgerald) |
| **Week 4** | Agent Identity + Presidio PII live in core gateway |
| **Week 6** | First design partner LOI signed |
| **Week 8** | SOC 2 Type II audit initiated |
| **Week 12** | 3 design partners active, investor deck update |
| **Week 16** | Pre-seed close ($1.5M) |
| **Week 24** | EU AI Act conformity assessment |
| **Week 36** | FedRAMP process initiated |
| **Week 52** | 10 paying customers, Series A prep |
