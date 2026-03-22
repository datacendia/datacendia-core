# Datacendia Product Roadmap

> Last audited: March 21, 2026
> Source: Automated audit of `datacendia-core` (Community Edition) and `datacendia-components` (Full Platform)

### How to Read This Roadmap

Each item is tagged with its **source repo** and **work type**:

| Tag | Meaning |
|-----|---------|
| 🟢 `core` | Work happens in datacendia-core (Community Edition, Apache 2.0) |
| 🔵 `components` | Work happens in datacendia-components (Full Platform, paid tiers) |
| 🔗 `wire-up` | Code already exists in components — needs integration/activation, not new development |
| 🔨 `build-new` | New code required — does not exist in either repo yet |
| 🔧 `harden` | Code exists but needs production hardening, testing, or UX polish |

---

## Platform Maturity Summary

| Metric | datacendia-core | datacendia-components |
|--------|----------------|----------------------|
| **Full service implementations** | 290 files | 284 files |
| **Stub services** | 49 files | 0 files |
| **Services stub in core, full in components** | 106 | — |
| **Total backend service code** | ~4.2 MB | ~8.6 MB |

### Fully Built in Core (Foundation Tier)

| Service Area | Files | Size | Status |
|-------------|-------|------|--------|
| **Gateway** (CendiaGateway) | 16 | 213 KB | Production-ready |
| **Council** (Multi-agent deliberation) | 8 | 218 KB | Production-ready |
| **Evidence** (Vault, Export, Ledger) | 8 | 236 KB | Production-ready |
| **Compliance** (Enforcer, Continuous Monitor, Cross-Jurisdiction) | 7 | 174 KB | Production-ready |
| **Crypto** (Merkle, ZKP, Escrow, Key Mgmt) | 14 | 152 KB | Production-ready |
| **Inference** (OpenAI, Anthropic, Gemini, Ollama, NIM, Triton, Together) | 10 | 80 KB | Production-ready |
| **Pillars** (Helm, Lineage, Predict, Flow, Health, Guard, Ethics, Agents) | 9 | 161 KB | Production-ready |
| **Legal** | 9 | 247 KB | Production-ready |
| **Security** | 10 | 192 KB | Production-ready |
| **SGAS** | 8 | 232 KB | Production-ready |
| **Verticals** | 89+18 | 2,573 KB | 89 full, 18 stub |

### Stub in Core / Full in Components (Enterprise + Strategic Tiers)

These are gated behind the upgrade page in core but fully implemented in components:

| Service | Components Size | Tier |
|---------|----------------|------|
| CendiaCrucible (AI Stress Testing) | 99 KB | Enterprise |
| CendiaApotheosis (Decision Transcendence) | 76 KB | Strategic |
| CendiaHorizon (Predictive Governance) | 72 KB | Enterprise |
| CendiaGuardian (AI Guardian) | 57 KB | Enterprise |
| CendiaPanopticon (Observability) | 50 KB | Enterprise |
| CendiaOmniTranslate (26-language i18n) | 50 KB | Enterprise |
| CendiaInventum (Discovery Engine) | 48 KB | Enterprise |
| CendiaTransit (Data Transit Governance) | 48 KB | Enterprise |
| CendiaDissent (Anonymous Dissent) | 48 KB | Enterprise |
| CendiaResonance (Decision Resonance) | 47 KB | Enterprise |
| echoService (Echo Decision Playback) | 45 KB | Enterprise |
| CendiaHabitat (Environment Governance) | 45 KB | Enterprise |
| CendiaAcademy (Governance Training) | 43 KB | Enterprise |
| CendiaFactory (Decision Factory) | 42 KB | Enterprise |
| FederatedMesh (Multi-org Mesh) | 43 KB | Strategic |
| CendiaScout (Threat Intelligence) | 41 KB | Enterprise |
| CendiaVox (Voice/NLP Governance) | 41 KB | Enterprise |
| CendiaDocket (Legal Docket Mgmt) | 40 KB | Enterprise |
| CrossJurisdictionConflict | 40 KB | Enterprise |
| CendiaRainmaker (Revenue Intelligence) | 34 KB | Enterprise |
| CendiaRegent (Executive Governance) | 34 KB | Enterprise |
| CendiaEquity (Equity & Fairness) | 36 KB | Enterprise |
| CendiaSymbiont (Human-AI Symbiosis) | 33 KB | Enterprise |
| CendiaEternal (Archival & Retention) | 31 KB | Enterprise |
| DecisionDNA (Decision Fingerprinting) | 35 KB | Strategic |
| DataDiode (One-way Data Flow) | 38 KB | Strategic |
| SyntheticMediaAuth (Deepfake Detection) | 36 KB | Strategic |
| LocalRLHF (Local Reinforcement Learning) | 33 KB | Strategic |
| gnosisService (Knowledge Synthesis) | 26 KB | Enterprise |
| redteamService (AI Red Teaming) | 25 KB | Enterprise |
| WarGames (Scenario Simulation) | 26 KB | Strategic |
| ZeroKnowledgeProof | 18 KB | Strategic |
| + 74 more services | — | Enterprise/Strategic |

---

## Phase 1: Ship-Critical (Now — 4 weeks)

### P1.1 CendiaGateway — Close the "Scoped Gmail" Gap

Context: a16z's Guido Appenzeller described the need for scoped AI agent proxies. CendiaGateway governs outbound data (User → AI), but the market also needs inbound scoping (AI Agent → Enterprise Systems).

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **Agent Identity** | Add `agentId` field to interactions. Track which AI agent (not just which user) performed each action | 2 days | Critical | 🟢 `core` 🔨 `build-new` |
| **Inbound Scope Definitions** | Define what enterprise data an agent can read (by resource type, department, data classification) | 1 week | High | 🔵 `components` 🔨 `build-new` |
| **OAuth2 Scope Proxy** | Wrap Gmail/Outlook/Salesforce APIs with CendiaGateway-enforced scopes | 2 weeks | High | 🔵 `components` 🔨 `build-new` |
| **Scope Visibility UX** | Dashboard showing "this agent can access X but not Y" in plain language | 3 days | High | 🟢 `core` 🔨 `build-new` |
| **Scope Audit Trail** | Log every scope check (allowed/denied) with cryptographic evidence | 3 days | Medium | 🟢 `core` 🔧 `harden` |

### P1.2 PII Detection — Production Hardening

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **Presidio Integration** | PIIDetector.ts notes "production would add ML-based NER." PresidioPIIService.ts exists (10KB) — wire it in | 3 days | High | 🟢 `core` 🔗 `wire-up` |
| **PII Evaluation Metrics** | PIIEvaluationMetrics.ts (15KB) exists — surface precision/recall/F1 on dashboard | 2 days | Medium | 🟢 `core` 🔗 `wire-up` |
| **Custom PII Patterns** | Allow orgs to define industry-specific PII (e.g., medical record numbers, IBAN formats) | 3 days | Medium | 🟢 `core` 🔨 `build-new` |

### P1.3 Design Partner Readiness

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **Single-tenant deployment script** | One-click deploy for a design partner's environment (Docker Compose + .env template) | 3 days | Critical | 🔵 `components` 🔧 `harden` |
| **Onboarding wizard** | First-run setup: connect AI providers, set initial policies, invite users | 1 week | High | 🔵 `components` 🔨 `build-new` |
| **Usage dashboard for partner** | Self-service view of their governance stats, PII detections, cost tracking | 3 days | High | 🟢 `core` 🔧 `harden` |
| **Evidence export for partner** | One-click Governance Receipt export (PDF) for their compliance team | 2 days | High | 🟢 `core` 🔗 `wire-up` |

---

## Phase 2: Enterprise Foundation (Weeks 5–12)

### P2.1 Sovereign Deployment

106 services are stubs in core but fully implemented in components. The sovereign deployment services are critical for enterprise sales:

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **Air-gapped deployment** | QRAirGapBridge (25KB in components) — USB/QR-based update mechanism for disconnected environments | 1 week | High | 🔵 `components` 🔗 `wire-up` |
| **Data Diode** | DataDiodeService (38KB) — one-way data flow for classified environments | 1 week | High | 🔵 `components` 🔗 `wire-up` |
| **TPM Attestation** | TPMAttestationService (24KB) — hardware-rooted trust for deployment integrity | 3 days | Medium | 🔵 `components` 🔗 `wire-up` |
| **Portable Instance** | PortableInstanceService (25KB) — single-binary deployment for edge/field use | 1 week | Medium | 🔵 `components` 🔗 `wire-up` |
| **Federated Mesh** | FederatedMeshService (43KB) — multi-org governance without centralized data | 2 weeks | Medium | 🔵 `components` 🔗 `wire-up` |

### P2.2 Crown Jewels (Enterprise Tier Unlocks)

| Item | Description | Size in Components | Priority | Source |
|------|-------------|-------------------|----------|--------|
| **Echo** (Decision Playback) | Full replay of any historical decision with all context | 45 KB | High | 🔵 `components` 🔗 `wire-up` |
| **Gnosis** (Knowledge Synthesis) | Cross-decision knowledge graph + pattern detection | 26 KB | High | 🔵 `components` 🔗 `wire-up` |
| **Red Team** | Adversarial testing of AI governance policies | 25 KB | High | 🔵 `components` 🔗 `wire-up` |
| **Crucible** (AI Stress Testing / COLLAPSE) | Systematic failure mode analysis for AI systems | 99 KB | Medium | 🔵 `components` 🔗 `wire-up` |

### P2.3 Compliance Automation

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **EU AI Act Article 12** | Automated logging requirements compliance check | 1 week | Critical | 🔵 `components` 🔧 `harden` |
| **SOC 2 Type II evidence package** | Auto-generate SOC 2 evidence from gateway logs | 2 weeks | High | 🔵 `components` 🔨 `build-new` |
| **ISO 42001 gap scanner** | Map current governance posture to ISO 42001 requirements | 1 week | High | 🔵 `components` 🔧 `harden` |
| **DORA operational resilience** | Financial services compliance package | 1 week | High | 🔵 `components` 🔧 `harden` |
| **HIPAA AI governance** | Healthcare-specific PII rules + BAA template | 3 days | High | 🟢 `core` 🔨 `build-new` |

---

## Phase 3: Platform Expansion (Weeks 13–24)

### P3.1 Intelligence Layer

| Item | Description | Size in Components | Priority | Source |
|------|-------------|-------------------|----------|--------|
| **CendiaHorizon** (Predictive Governance) | Forecast governance risks before they materialize | 72 KB | High | 🔵 `components` 🔗 `wire-up` |
| **CendiaScout** (Threat Intelligence) | Monitor for emerging AI governance threats | 41 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **DecisionDNA** (Decision Fingerprinting) | Unique fingerprint for every decision pattern | 35 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **CendiaPanopticon** (Observability) | Full-stack AI observability across the platform | 50 KB | Medium | 🔵 `components` 🔗 `wire-up` |

### P3.2 Integration Ecosystem

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **Salesforce connector** | Log AI-assisted CRM decisions | 2 weeks | High | 🔵 `components` 🔨 `build-new` |
| **ServiceNow connector** | Governance tickets + approval workflows | 2 weeks | High | 🔵 `components` 🔨 `build-new` |
| **Jira/Atlassian connector** | Decision tracking in project management | 1 week | Medium | 🔵 `components` 🔨 `build-new` |
| **Slack/Teams bot** | Real-time governance alerts + approval requests | 1 week | Medium | 🔵 `components` 🔨 `build-new` |
| **Power BI / Tableau embed** | Governance dashboards in existing BI tools | 1 week | Medium | 🔵 `components` 🔨 `build-new` |
| **Splunk/Elastic SIEM** | SIEMIntegration.ts exists (15KB) — productize | 3 days | Medium | 🟢 `core` 🔗 `wire-up` |
| **Terraform provider** | Infrastructure-as-code for gateway policies | 2 weeks | Low | 🔵 `components` 🔨 `build-new` |
| **GitHub Actions** | CI/CD governance checks for AI model deployments | 1 week | Low | 🟢 `core` 🔨 `build-new` |

### P3.3 Vertical Deep Dives

89 verticals have full implementations. Prioritize for design partner alignment:

| Vertical | Status | Design Partner Priority |
|----------|--------|----------------------|
| **Healthcare** | Full (20KB+) | #1 — HIPAA + clinical AI |
| **Financial Services** | Full (35KB+) | #2 — PGIM connection |
| **Defense** | Full (20KB+) | #3 — cleared-ready |
| **Legal** | Full (247KB total) | #4 — fastest AI adoption |
| **Energy** | Full (20KB+) | #5 — critical infrastructure |
| **Government** | Full (20KB+) | #6 — federal mandate |
| **Insurance** | Full (24KB) | #7 — AI risk |
| **Pharma** | Full (20KB+) | #8 — FDA compliance |
| Sports | Full (74KB) | Lower |
| 80+ other verticals | Full | On-demand |

---

## Phase 4: Strategic Moat (Weeks 25–52)

### P4.1 Cryptographic Sovereignty

| Item | Description | Size in Components | Priority | Source |
|------|-------------|-------------------|----------|--------|
| **Post-Quantum KMS** | PostQuantumKMSService (20KB) — lattice-based key management | 20 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **Time-Lock Encryption** | TimeLockService (23KB) — time-delayed decryption for sensitive decisions | 23 KB | Low | 🔵 `components` 🔗 `wire-up` |
| **Verifiable Delay Functions** | VerifiableDelayService (12KB in core) — provable time delays | Already built | Low | 🟢 `core` ✅ `done` |
| **Zero-Knowledge Proofs** | ZeroKnowledgeProofService (18KB) — prove compliance without revealing data | 18 KB | Medium | 🔵 `components` 🔗 `wire-up` |

### P4.2 Advanced AI Governance

| Item | Description | Size | Priority | Source |
|------|-------------|------|----------|--------|
| **Local RLHF** | LocalRLHFService (33KB) — fine-tune governance models on-prem | 33 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **Shadow Council** | ShadowCouncilService (21KB) — adversarial deliberation for stress testing | 21 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **Cognitive Bias Mitigation** | CognitiveBiasMitigationService (27KB) — detect and mitigate bias in AI decisions | 27 KB | Medium | 🔵 `components` 🔗 `wire-up` |
| **Synthetic Media Auth** | SyntheticMediaAuthService (36KB) — deepfake detection for evidence integrity | 36 KB | Low | 🔵 `components` 🔗 `wire-up` |
| **NLP Bias Detection** | NLPBiasDetectionService (17KB) — language-level bias analysis | 17 KB | Medium | 🔵 `components` 🔗 `wire-up` |

### P4.3 Market Expansion

| Item | Description | Effort | Priority | Source |
|------|-------------|--------|----------|--------|
| **FedRAMP authorization** | Required for US government sales | 6+ months | High | 🔵 `components` 🔨 `build-new` |
| **IL4/IL5 certification** | Required for DoD classified environments | 6+ months | Medium | 🔵 `components` 🔨 `build-new` |
| **EU AI Act conformity assessment** | Third-party certification | 3 months | High | Both repos |
| **ISO 42001 certification** | AI management system certification | 3 months | High | Both repos |
| **SOC 2 Type II audit** | Required for enterprise procurement | 3 months | Critical | Both repos |

---

## Infrastructure Roadmap

### Currently Built

| Component | Status | Notes |
|-----------|--------|-------|
| React + TypeScript SPA | Production | 26-language i18n, dark theme |
| Express.js backend | Production | 40+ API route files |
| PostgreSQL + Prisma ORM | Production | Full schema with indexes |
| WebSocket (Council) | Production | Real-time deliberation |
| Multi-provider LLM inference | Production | OpenAI, Anthropic, Gemini, Ollama, NIM, Triton, Together |
| Docker deployment | Production | Multi-stage builds |
| Browser extension | Built | Chrome/Firefox/Safari/Edge support |
| Network proxy (PAC) | Built | DNS-level AI traffic interception |

### Needed

| Component | Description | Priority | Source |
|-----------|-------------|----------|--------|
| **Kubernetes Helm chart** | Enterprise deployment standard | High | 🔵 `components` 🔨 `build-new` |
| **Horizontal scaling** | Stateless gateway instances behind LB | High | 🟢 `core` 🔧 `harden` |
| **Redis caching** | cache.service.ts exists but needs Redis backend | Medium | 🟢 `core` 🔗 `wire-up` |
| **Kafka event streaming** | kafka/ directory exists (41KB) — wire up | Medium | 🔵 `components` 🔗 `wire-up` |
| **Neo4j graph database** | graphIngestion.ts exists — connect for lineage | Medium | 🔵 `components` 🔗 `wire-up` |
| **Prometheus + Grafana** | metrics/ exists — expose /metrics endpoint | Medium | 🟢 `core` 🔗 `wire-up` |
| **E2E test suite** | 205K+ unit tests exist — add integration/E2E | High | Both repos 🔨 `build-new` |

---

## Competitive Positioning Roadmap

### vs. Competitors Mentioned in Pitch Decks

| Competitor | Their Strength | Our Differentiator | Roadmap Action |
|-----------|---------------|-------------------|----------------|
| **Palantir** | Government contracts, data integration | Multi-agent deliberation, cryptographic evidence, open-source core | Push FedRAMP, add Palantir-to-Datacendia migration guide |
| **C3.ai** | Enterprise AI platform | We're governance-first, not model-first | Publish "Why governance before models" whitepaper |
| **Dataiku** | Data science workflows | We govern the decisions, not the data prep | Build Dataiku integration connector |
| **H2O.ai** | AutoML | We're the accountability layer H2O lacks | Partner pitch: "H2O builds models, Datacendia governs them" |
| **Databricks** | Data lakehouse | Governance as a complementary layer | Build Databricks integration (Unity Catalog hook) |

---

## Key Dates

| Date | Milestone |
|------|-----------|
| **Now** | Send first 10 design partner decks |
| **Week 2** | First design partner call (PGIM / Matt Fitzgerald) |
| **Week 4** | Agent Identity + Presidio PII live in gateway |
| **Week 6** | First design partner LOI signed |
| **Week 8** | SOC 2 Type II audit initiated |
| **Week 12** | 3 design partners active, investor deck update |
| **Week 16** | Pre-seed close ($1.5M) |
| **Week 24** | EU AI Act conformity assessment |
| **Week 36** | FedRAMP process initiated |
| **Week 52** | 10 paying customers, Series A prep |
