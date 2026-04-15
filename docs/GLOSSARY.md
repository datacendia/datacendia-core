# Datacendia Glossary
## Platform Terminology — v0.2.4-alpha (April 2026)

> Authoritative definitions for every term used across the platform, API, documentation, and sales materials. Cross-referenced with the [Datacendia Bible](./DATACENDIA-BIBLE.md) and [Services Catalog](./architecture/services-catalog.md).

---

## A

**Agent**
An AI persona within The Council™ with a distinct mandate, system prompt, and decision-making framework. Each agent analyzes a question independently before the cross-examination phase. Six default agents ship with the platform: CFO, Legal Counsel, Risk Officer, Strategist, Ethics Officer, and Operations Lead. Each has an independent `model_config` allowing per-agent model selection.

**Agent Queue**
The `AgentQueueService` — an asynchronous job queue that schedules and tracks agent tasks (deliberations, pillar assessments, NLP jobs). Backed by Redis with retry logic and dead-letter handling.

**Air-Gap Mode**
A CendiaSovereign™ deployment variant with no outbound network traffic. Uses data diodes, TPM-backed signing keys, and portable Docker instances. Required for classified defense and critical infrastructure deployments.

**AEDT (Automated Employment Decision Tool)**
Term used in NYC Local Law 144 for AI systems that substantially assist in employment decisions (hiring, promotion, discipline). Datacendia's `AIRegulatoryClassifier` detects AEDT use cases and triggers AEDT disclosure requirements. See also: `/api/v1/privacy/aedt-disclosure`.

**AIRegulatoryClassifier**
Singleton service (`backend/src/services/compliance/AIRegulatoryClassifier.ts`) that classifies AI use-cases in real-time against 6 regulatory frameworks: CO SB 205, NYC LL 144, IL AIVIA, EU AI Act Annex III, GDPR Art. 22, and BDSG §26. Returns a risk level (CRITICAL/HIGH/MEDIUM/LOW), applicable regulations, required disclosures, and recommended actions.

**AI Route**
Any API route that triggers AI inference: `/api/v1/council`, `/api/v1/deliberations`, `/api/v1/inference`, `/api/v1/platform-assistant`. These routes receive additional middleware (`aiRegulatoryMiddleware` + `phiEnforcementMiddleware`) beyond the standard auth chain.

**Apotheosis** *(CendiaApotheosis™)*
AI excellence benchmarking service. Tracks decision quality, agent consensus rates, dissent patterns, and deliberation velocity over time to produce an organizational "AI maturity score."

**Audit Log**
The tamper-evident, Merkle-chained log stored in the `audit_logs` table. Every entry is SHA-256 hashed and linked to its predecessor, making the chain cryptographically detectable if any entry is modified or deleted. Managed by `AuditService`.

**Audit Package**
A pre-built, regulator-ready evidence bundle produced by `AuditPackageService`. Contains signed decision packets, audit log excerpts, compliance certifications, and chain-of-custody documentation formatted for specific regulators (SEC, OCR/HHS, ICO, etc.).

**Autopilot** *(CendiaAutopilot™)*
Automated monitoring service that watches for decision drift, deadline breaches, and governance anomalies. Triggers alerts and optionally escalates to human reviewers without manual intervention.

---

## B

**Bible, The** *(Datacendia Bible)*
The master internal reference document (`docs/DATACENDIA-BIBLE.md`). Covers every product, service, compliance framework, security control, and architectural decision. The single source of truth for the platform.

**blockIfDemo**
The core function in `demoGuardMiddleware` (`backend/src/middleware/demoGuard.ts`). Intercepts mutating HTTP methods (POST, PUT, PATCH, DELETE) on demo organizations and returns a mock success response without writing to the database. Real client organizations (UUID IDs) are never intercepted.

**BDSG §26**
German Federal Data Protection Act, Section 26 — governs AI-assisted employment decisions. Detected by `AIRegulatoryClassifier`; requires works council agreement before deployment.

---

## C

**Cascade** *(CascadeService)*
Event propagation service that broadcasts state changes across platform modules. When a deliberation completes, Cascade fires events consumed by Audit, Evidence, Notifications, Retention, and Analytics services.

**CendiaGateway™**
The AI proxy layer consisting of 14 control modules (proxy, PII interceptor, rate limiter, audit, policy enforcer, smart router, response cache, transform pipeline, metrics collector, token counter, content filter, fallback handler, load balancer, health monitor). Sits between AI consumers and AI providers.

**CendiaVerify™**
Public-facing verification portal at `/verify` (no authentication required). Allows third parties — regulators, counterparties, auditors — to verify a cryptographic receipt produced by Datacendia without platform access.

**CCPA / CPRA**
California Consumer Privacy Act and California Privacy Rights Act. Enforced via `/api/v1/privacy/ccpa/*` endpoints (opt-out, notice, status, limit-sensitive PI).

**COLLAPSE™**
Strategic-tier simulation module. 12 adversarial AI agents simultaneously attempt to find failure modes, loopholes, and unintended consequences in a proposed policy or decision. Produces a vulnerability map ranked by severity and likelihood.

**Community Edition**
The free, Apache 2.0-licensed tier of Datacendia. Includes The Council, Replay Theater, DECIDE framework, DCII, Gateway, PII detection, Evidence package, 18+ verticals, and the full regulatory compliance engine. All features in this tier are in `datacendia-core`.

**Compliance Monitor** *(ContinuousMonitorService)*
Scheduled compliance drift detection across all active frameworks. Runs on configurable intervals and raises alerts when new regulatory gaps are detected.

**ConstitutionalCourt** *(CendiaCourt™)*
Enterprise-tier dispute resolution module. Handles governance appeals, policy challenges, and cross-department decision conflicts using a structured court-like workflow with evidence submission, deliberation, and binding rulings.

**ContentAddressedReceipt**
A public verification receipt produced by `ContentAddressedReceiptService`. Content-addressed (the content hash is the identifier) and suitable for third-party verification without requiring database access.

**Council, The** *(The Council™)*
Datacendia's multi-agent AI deliberation engine. Multiple AI agents with distinct mandates independently analyze a decision, conduct cross-examination, and produce a consensus recommendation with dissent records and a signed Decision Packet.

---

## D

**Datacendia**
AI Governance & Decision Intelligence platform for regulated enterprises. Turns high-stakes AI decisions into structured, auditable, multi-agent deliberations with cryptographic evidence chains and full regulatory compliance enforcement.

**DCII** *(Datacendia Cryptographic Integrity Index)*
A composite 0–100 integrity score measuring the cryptographic health of an organization's decision history. Factors: Merkle chain continuity, signing key validity, packet completeness, dissent acknowledgment rate, and audit log integrity.

**DDGI** *(Datacendia Decision Governance Infrastructure)*
The open-source framework specification defining how AI decisions should be structured, recorded, and governed. Published as a separate repo (`datacendia/decision-governance-infrastructure`) under CC BY 4.0.

**DECIDE Framework**
Datacendia's structured decision methodology: **D**efine the question, **E**vidence gathering, **C**ouncil deliberation, **I**ntegrity check, **D**issent recording, **E**vidence packaging. The deliberation lifecycle maps to these phases.

**Decision Packet**
A cryptographically signed, tamper-evident artifact produced at the end of every Council deliberation. Contains: full agent transcript, votes, dissent records, consensus recommendation, Merkle root, customer signature, and timestamp. Stored in `decision_packets` table with `retention_until` enforced by `RetentionService`.

**Deliberation**
A single Council session. Has states: PENDING → IN_PROGRESS → ANALYSIS → CROSS_EXAM → SYNTHESIS → COMPLETED (or ESCALATED / CANCELLED). Stored in the `deliberations` table. Produces a Decision Packet on completion.

**demoGuardMiddleware**
Express middleware (`backend/src/middleware/demoGuard.ts`) that globally protects demo organizations from accidental data mutations. Applied at two layers: (1) Auth middleware, (2) `requireOrgScope`. Returns `{ _demo: true }` for blocked writes — nothing is persisted.

**Demo Organization**
A seeded organization used for platform demonstrations. Identified by `organization_id` prefix (`demo-` or `tutorial-`) and `settings.isDemo = true`. Completely isolated from real client data. Writes are intercepted by `demoGuardMiddleware`.

**Dissent**
A formal disagreement record submitted by a Council agent or human reviewer when they disagree with the consensus recommendation. Captured by `DissentService`, stored in `dissents` table, and preserved in the Decision Packet. Cannot be deleted — dissent ledger is immutable.

**DPIA** *(Data Protection Impact Assessment)*
Required by GDPR Art. 35 for high-risk AI processing. Template available at `docs/legal/dpia-template.md`. Datacendia's `ai-impact-assessment` API endpoint generates a machine-readable version.

**DPO** *(Data Protection Officer)*
Required under GDPR Art. 37 for organisations processing personal data at scale. Pending appointment at Datacendia. Contact: `privacy@datacendia.com` (interim).

---

## E

**Echo Chamber** *(CendiaEcho™)*
Detection service that identifies groupthink patterns in Council deliberations — where agents converge on consensus too quickly without genuine analytical diversity. Scores group polarization, argument novelty, and semantic similarity across agent responses.

**EscrowService** *(CendiaEscrow™)*
Combines Shamir's Secret Sharing (M-of-N threshold) with Verifiable Delay Functions (VDF) to create time-locked, split-key decision escrows. Used for: regulatory holds, board-level decisions requiring multi-party authorization, and anti-coercion mechanisms.

**Eternal** *(CendiaEternal™)*
Long-term AI knowledge preservation service. Archives deliberation summaries, agent reasoning patterns, and organizational decision knowledge in a format designed for retrieval decades into the future (format-agnostic, schema-free).

**Evidence Chain**
The sequence of cryptographic hashes linking deliberation artifacts from raw transcript through to final Decision Packet. Managed by `EvidenceChainService`. Each link in the chain is verifiable independently via `CendiaVerify™`.

---

## F

**Federation** *(CendiaMesh™)*
Multi-organization governance layer where multiple independent Datacendia instances share policies, compliance postures, and aggregated risk reports without sharing raw deliberation data. Used in holding companies, regulatory consortiums, and multi-agency government deployments.

**Foundation Tier**
Paid subscription tier ($150K–$500K/year) that adds CendiaCompliance™, GapScan™, Echo™, Gnosis™, OmniTranslate™, and advanced analytics to the Community Edition. See `TIER-MAPPING.md`.

---

## G

**GapScan** *(CendiaGapScan™)*
Compliance gap analysis tool at `/cortex/compliance/gap-scanner`. Analyzes an organization's current posture against 8+ frameworks (EU AI Act, NIST AI RMF, ISO 42001, GDPR, HIPAA, SOX, SR 11-7, Basel III/IV) and produces a prioritized remediation roadmap.

**Gnosis** *(CendiaGnosis™)*
Cross-decision knowledge synthesis service. Builds a semantic graph of past deliberations to surface relevant precedents, identify recurring risk patterns, and generate institutional memory summaries.

**GPU Management** *(GPUManagementService)*
Resource management layer for NVIDIA GPU clusters used in sovereign deployments. Handles CUDA kernel scheduling, RAPIDS pipeline management, and model loading for Triton/NIM providers.

---

## H

**Honeypot**
The `honeypotMiddleware` (`security/Honeypot.ts`) — invisible trap endpoints that attract and fingerprint automated scanners and attackers. Any request to a honeypot endpoint logs the source IP, request fingerprint, and timing pattern to the audit chain.

---

## I

**IncidentMaterialityService**
Singleton service that accepts an incident description and returns a prioritized multi-jurisdiction breach notification plan. Covers 14 frameworks with computed deadlines, draft notices, and regulator contact information. Used by legal teams immediately after a security incident.

**InferenceService**
The singleton AI inference facade. All 45+ platform consumers call `InferenceService` — never a provider directly. Auto-detects provider based on `OPENAI_API_KEY` (uses OpenAI-compatible) or falls back to Ollama. Supports OpenAI, Groq, Together AI, Mistral, Ollama, NVIDIA Triton, and NIM.

**Integrity Index**
See **DCII**.

---

## J

**JWT** *(JSON Web Token)*
The authentication token format used by Datacendia. Signed with `JWT_SECRET`, contains `userId`, `organizationId`, and `role`. Validated by `auth.ts` middleware on every authenticated request. Cached in Redis to avoid repeated database lookups.

---

## K

**KMS** *(Key Management Service)*
`KeyManagementService` in `backend/src/services/crypto/`. Manages customer-owned RSA-2048 / ECDSA P-256 signing keys. Keys are used to sign Decision Packets, creating customer-owned cryptographic proof of every deliberation.

---

## L

**Legal Domain**
The API domain router that aggregates all legal service routes: `/api/v1/legal`, `/api/v1/legal-research`, `/api/v1/legal-services`. All routes in this domain use `requireOrgScope` and are protected by `demoGuardMiddleware`.

---

## M

**Merkle Tree**
A binary hash tree where each leaf is the SHA-256 hash of a deliberation artifact (agent message, vote, dissent), and each parent node is the hash of its two children. The root hash (`merkle_root`) is stored in the Decision Packet and provides tamper-evidence: modifying any artifact changes the root.

**Mesh** *(CendiaMesh™)*
See **Federation**.

**Model Config**
JSON blob stored per agent in the `agents` table (`model_config` column). Allows per-agent model selection, temperature, max tokens, and context window configuration. Enables mixing GPT-4o for strategic analysis with lighter models for routine synthesis.

**Multi-Tenancy**
The platform's data isolation architecture. All database queries include `WHERE organization_id = req.organizationId`, enforced at the service layer by Prisma. `verifyOrgOwnership()` in `tenantIsolation.ts` enforces per-resource access checks. Demo data is further isolated by `demoGuardMiddleware`.

---

## N

**NIM** *(NVIDIA NIM)*
NVIDIA's inference microservices platform. Supported as an inference provider via `NIMProvider`. Used in sovereign deployments requiring on-premise GPU inference with enterprise SLAs.

**NIST AI RMF**
National Institute of Standards and Technology AI Risk Management Framework. Current alignment: 68% (MAP 1.3, MEASURE 2.8, GOVERN 1.7 complete). Profile at `docs/nist-ai-rmf/ai-rmf-profile.md`.

---

## O

**OmniTranslate** *(CendiaOmniTranslate™)*
26-language compliance translation service. Specialized for legal and regulatory terminology — not general translation. Translates GDPR notices, compliance reports, deliberation summaries, and regulatory filings while preserving legal precision.

**Open Core**
Datacendia's licensing model: `datacendia-core` (Apache 2.0, free, community-run) + `datacendia-components` (proprietary, paid tiers). The Community Edition is fully functional for governance, deliberation, cryptographic evidence, and compliance. Paid tiers add advanced analytics, enterprise integrations, and strategic simulation.

**OPA** *(Open Policy Agent)*
Policy-as-code engine integrated via `services/opa/`. Evaluates declarative YAML/JSON access policies used by `PolicyEngine` in the security layer.

**Organization** *(org)*
The multi-tenant root entity. Every user, deliberation, decision, metric, and audit event belongs to exactly one organization. Identified by a UUID (`organization_id`). Demo organizations use `demo-` or `tutorial-` prefixed IDs.

---

## P

**Panopticon** *(CendiaPanopticon™)*
Organization-wide AI visibility dashboard. Monitors all AI activity across the enterprise — authorized and unauthorized (Shadow AI). The entry point for AI governance program management.

**PHI** *(Protected Health Information)*
Under HIPAA, individually identifiable health information. `phiEnforcementMiddleware` blocks health-domain AI requests unless PHI has been de-identified (`X-PHI-Deidentified: true`) or the org has a signed BAA (`hipaaBAASigned: true`).

**Pillars**
The 9-domain AI governance assessment model. Each pillar corresponds to a dimension of AI responsibility: Transparency, Fairness, Safety, Privacy, Accountability, Reliability, Explainability, Societal Impact, Human Oversight. Evaluated by `PillarsService` via the Agent Queue.

**Post-Quantum** *(Post-Quantum Cryptography)*
Route at `/api/v1/security/post-quantum`. Provides lattice-based cryptographic operations (CRYSTALS-Kyber, CRYSTALS-Dilithium) for future-proof key exchange and signing. Part of the sovereign security stack.

**Precedent** *(CendiaPrecedent™)*
TF-IDF-based similar decisions matching component. Surfaces relevant past deliberations when a new question is submitted, enabling institutional memory and preventing repeat analysis of settled questions.

**Privacy API**
17 endpoints at `/api/v1/privacy` covering GDPR Art. 15–22, CCPA/CPRA, HIPAA §164.514(b), CO SB 205, NYC LL 144, WA MHMDA, and TX TDPSA. All routes now require `requireOrgScope` (wired in v0.2.4), which means `demoGuardMiddleware` applies.

---

## R

**RBAC** *(Role-Based Access Control)*
Four platform roles: `SUPER_ADMIN` (full platform access, bypasses demoGuard), `ADMIN` (org management + all features), `ANALYST` (deliberation + analytics, no admin), `VIEWER` (read-only). Enforced by `RBACEngine` (`security/rbac.ts`).

**Recall** *(CendiaRecall™)*
Decision outcome tracking service. After a deliberation is complete and a decision is implemented, Recall tracks actual outcomes against the Council's recommendation — enabling feedback loops and decision quality improvement.

**Red Team** *(CendiaRedTeam™)*
6-vector adversarial analysis: prompt injection, data poisoning, model extraction, membership inference, evasion attacks, supply chain vulnerabilities. Generates a structured report with risk scores and remediation recommendations.

**Relay Theater** *(CendiaReplay™)*
Decision deliberation playback theater at `/cortex/council/replay-theater`. Replays any past deliberation with agent-by-agent animation, phase transitions, and the full cryptographic evidence trail. Used for audits, retrospectives, and stakeholder demonstrations.

**requireOrgScope**
Express middleware (`backend/src/middleware/tenantIsolation.ts`) that verifies `req.organizationId` is set on every tenant-bound request. As of v0.2.4, also calls `blockIfDemo()` as a belt-and-suspenders demo guard.

**Retention**
`RetentionService` — manages multi-framework data retention policies. SEC requires 7 years, HIPAA requires 6 years, FINRA requires 3 years. Automatically schedules archival and purges expired records while preserving cryptographic integrity.

**ROPA** *(Record of Processing Activities)*
GDPR Art. 30 requirement. Template at `docs/legal/ropa-record-of-processing-activities.md`. Datacendia maintains 4 controller activities and 3 processor activities with a sub-processor register.

---

## S

**SCGE** *(Synthetic Community Governance Engine)*
Strategic-tier simulation module. Creates a synthetic community of thousands of stakeholder personas and simulates their collective response to a proposed policy or decision. Outputs: preference distribution, likely opposition, adoption barriers, and policy refinement recommendations.

**SGAS** *(Self-Governing Agent System)*
Strategic-tier agentic simulation. AI agents with the ability to create sub-agents, establish internal rules, evolve their own governance structures, and adapt behavior over time. Used to model emergent AI governance scenarios.

**Shadow AI**
Unauthorized AI tools being used within an organization without governance oversight. Detected by `ShadowAIScannerService` (part of the CendiaWedge™ product suite) via SIEM integration, proxy logs, and browser extension telemetry.

**Shadow Council**
An Enterprise-tier feature where a parallel adversarial deliberation runs simultaneously with the primary Council. The Shadow Council attempts to argue the opposite position. The gap between the two deliberations surfaces hidden assumptions and fragile reasoning.

**Shamir's Secret Sharing (SSS)**
A cryptographic scheme where a secret is split into N shares, any M of which can reconstruct the original. Used by `ShamirService` in `DecisionEscrowService` for M-of-N authorized release of time-locked decisions.

**Sovereign** *(CendiaSovereign™)*
Deployment mode for organizations requiring complete data sovereignty: air-gapped networks, customer-owned infrastructure, data diodes, TPM-backed signing, and portable Docker instances. Required for defense, intelligence agencies, and critical national infrastructure.

**Symbiont** *(CendiaSymbiont™)*
Human-AI collaborative decision workflow service. Structures the interplay between human judgment and AI recommendations — ensuring human oversight at defined checkpoints without creating bottlenecks.

---

## T

**Tenant Isolation**
See **Multi-Tenancy**.

**Triton** *(NVIDIA Triton Inference Server)*
NVIDIA's inference server supporting multiple framework backends (TensorFlow, PyTorch, TensorRT-LLM). Supported as an inference provider via `TritonProvider`. Used in high-throughput sovereign deployments.

**Trust Score**
Composite metric derived from DCII, agent consensus rate, dissent frequency, and audit chain integrity. Surfaced on organization dashboards as a single indicator of governance health.

---

## V

**VDF** *(Verifiable Delay Function)*
A cryptographic function that requires a specified minimum amount of sequential computation to evaluate, making the result unpredictable until a defined time has passed. Used in `DecisionEscrowService` to create cryptographic time-locks on escrowed decisions.

**Vault** *(VaultService)*
Secrets management service backed by OpenBao/HashiCorp Vault. Manages platform-level secrets (API keys, database credentials, signing keys) with rotation policies and audit trails.

**Verticals** *(CendiaVerticals™)*
30 full industry-specific agent packs (107 files). Each pack contains 7–12 specialized agents configured for the regulatory environment, risk profile, and decision vocabulary of a specific industry (Healthcare, Finance, Defense, Energy, Legal, etc.). Available in Strategic tier.

**Vox** *(CendiaVox™)*
Stakeholder voice capture and weighting service. Collects structured input from stakeholders before or during deliberation, quantifies consensus levels, and injects weighted stakeholder perspectives into the Council's context.

---

## W

**Wedge Products**
Three commercially positioned entry-point products bundled under the CendiaWedge™ brand: (1) Shadow AI Scanner, (2) Governance Report Generator, (3) Incident Forensics Analyzer. Each solves a specific, immediate enterprise pain point and serves as a land-and-expand mechanism toward the full platform.

---

## Z

**ZKP** *(Zero-Knowledge Proof)*
Cryptographic proof that a statement is true without revealing the underlying data. Available at `/cortex/security/zkp` (Enterprise tier). Enables compliance attestation — proving regulatory requirements are met without disclosing the underlying deliberation content to external parties.

---

*Last updated: April 2026 — v0.2.4-alpha*
*See also: [Datacendia Bible](./DATACENDIA-BIBLE.md) · [Services Catalog](./architecture/services-catalog.md)*
