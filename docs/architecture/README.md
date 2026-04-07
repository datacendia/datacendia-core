# Datacendia Architecture & Workflow Diagrams

> Mermaid diagrams covering all major service domains. Renders natively on GitHub, VS Code (Mermaid extension), and most Markdown viewers.

## Diagram Index

| # | Document | Services Covered | Diagrams |
|---|----------|-----------------|----------|
| 1 | [Platform Overview](./platform-overview.md) | Full platform architecture, open-core model, deployment | 4 |
| 2 | [Council & Deliberation](./council-deliberation.md) | CouncilService, DeliberationService, DecisionService, PostDeliberation, Dissent, Echo, Gnosis, Red Team | 3 |
| 3 | [Ops Agents](./ops-agents.md) | OpsAgentService (Report, Analytics, NLP, Pipeline), community vs enterprise | 4 |
| 4 | [Shadow AI Scanner](./shadow-ai-scanner.md) | ShadowAIScannerService, real data ingestion, dynamic compliance gaps | 4 |
| 5 | [Governance Report](./governance-report.md) | GovernanceReportService, questionnaire engine, framework mapping | 2 |
| 6 | [Incident Forensics](./incident-forensics.md) | IncidentForensicsService, evidence chain, severity classification | 3 |
| 7 | [Inference Layer](./inference-layer.md) | InferenceService, OpenAI/Ollama/Triton/NIM providers, health check | 4 |
| 8 | [Crypto & Evidence](./crypto-evidence.md) | KeyManagement, Merkle, Stamp, SelfContainedEvidence, ContentAddressedReceipt, DecisionEscrow, DCII, Red Team | 3 |
| 9 | [Compliance & Legal](./compliance-services.md) | ComplianceService, ContinuousMonitor, CrossJurisdiction, RegulatorySandbox, Legal (8 modules) | 3 |
| 10 | [Cendia Product Services](./cendia-product-services.md) | Sentry, Aegis, Crucible, Panopticon, Horizon, ChronosAI, Vox, Dissent, Recall, Symbiont, Eternal, OmniTranslate, HR, Salary, Apotheosis | 4 |
| 11 | [Gateway & Security](./gateway-security.md) | CendiaGateway (14 modules), Security middleware (8 modules), Vault, KeyManagement | 4 |
| 12 | [Pillars, Flow & Queue](./pillars-flow-queue.md) | FlowService, PipelineService, AgentQueueService, Scheduler (9 pillar modules) | 3 |
| 13 | [Sovereign & Enterprise](./sovereign-enterprise.md) | Sovereign AI (22 modules), Enterprise (18 modules), Multi-tenancy, GPU management | 4 |
| 14 | [Vertical Industry Agents](./vertical-agents.md) | VerticalAgentsService (107 modules), Healthcare, Finance, Legal, Manufacturing, Sports, Insurance | 3 |
| 15 | [Data & Infrastructure](./data-infrastructure.md) | PostgreSQL, Redis, VectorDB, Kafka, Streaming, Email, Notifications, Backup, servicePersistence | 5 |
| 16 | [Strategic & Forecasting](./strategic-forecasting.md) | Strategic Intelligence (7 modules), Forecasting, EnhancedLLM, ExecutiveSummary, PostDeliberation | 3 |

**Total: 16 documents · ~54 Mermaid diagrams · Covering 350+ service files**

## Service Count by Domain

| Domain | Service Files | Status |
|--------|-------------|--------|
| Verticals (Industry Agents) | 107 | Documented |
| Sovereign AI | 22 | Documented |
| Enterprise | 18 | Documented |
| Crypto / DCII | 14 | Documented |
| Gateway | 14 | Documented |
| Inference | 10 | Documented |
| Pillars / Flow | 9 | Documented |
| Security | 8 | Documented |
| Legal | 8 | Documented |
| Council | 7 | Documented |
| Compliance | 7 | Documented |
| DCII | 7 | Documented |
| Strategic | 7 | Documented |
| Core | 7 | Documented |
| LLM | 6 | Documented |
| Storage | 6 | Documented |
| Evidence | 7 | Documented |
| Wedge (3 products) | 3 | Documented |
| Ops Agents | 1 | Documented |
| + 26 top-level services | 26 | Documented |
