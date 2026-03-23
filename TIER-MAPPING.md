# Datacendia Tier Mapping

> Draft: March 22, 2026
> Source: Automated audit of `datacendia-core` (286 services) and `datacendia-components` (371 services)

---

## Tier Overview

| Tier | Price | What You Get |
|------|-------|-------------|
| **Community (Core)** | Free, Apache 2.0 | Cloud AI governance, basic Council, PII detection, evidence vault, gateway proxy |
| **Pilot (Components)** | $50K/yr | Everything in Community + managed platform, SLA, priority support, basic compliance mapping |
| **Foundation (Components)** | $150K–$500K/yr | Everything in Pilot + full compliance engines, verticals, advanced evidence, analytics |
| **Enterprise (Components)** | $500K–$1.5M/yr | Everything in Foundation + COLLAPSE stress testing, sovereign features, advanced security, red team |
| **Strategic (Components)** | $1.5M+/yr | Everything in Enterprise + air-gapped, data diode, federated mesh, defense-grade, nation-scale |

---

## Community Tier (Free) — `datacendia-core`

> What it does: Cloud AI governance for developers. Proxy cloud AI APIs, detect PII, run the Council, store evidence.
> Who it's for: Developer at a fintech startup who discovers Datacendia on GitHub.

### Gateway & Proxy
| Service | Size | Description |
|---------|------|-------------|
| CendiaGatewayService.ts | 40.6 KB | Reverse proxy for cloud AI APIs (OpenAI, Anthropic, Gemini, etc.) |
| GatewayProxyServer.ts | 19.9 KB | HTTP proxy server for AI API interception |
| ModelRouter.ts | 11.8 KB | Route requests to appropriate AI model provider |
| QueryRouter.ts | 10.5 KB | Query routing and load balancing |
| RateLimiter.ts | 10.7 KB | Rate limiting for AI API calls |

### AI Providers (Cloud)
| Service | Size | Description |
|---------|------|-------------|
| OpenAIProvider.ts | 9.2 KB | OpenAI API integration |
| AnthropicProvider.ts | 7.7 KB | Anthropic/Claude API integration |
| GeminiProvider.ts | 9.0 KB | Google Gemini API integration |
| TogetherAIProvider.ts | 7.6 KB | Together AI integration |
| InferenceService.ts | 10.5 KB | Unified inference abstraction |
| InferenceProvider.ts | 4.3 KB | Provider interface |

### Council (Basic)
| Service | Size | Description |
|---------|------|-------------|
| CouncilService.ts | 50.5 KB | Core Council orchestration — 50+ AI agents deliberate on decisions |
| CouncilWebSocket.ts | 8.5 KB | Real-time Council deliberation streaming |
| FlowService.ts | 31.2 KB | Decision flow orchestration |
| ChainOfThought.ts | 10.2 KB | Reasoning chain construction |
| AgentsService.ts | 12.3 KB | Agent management |

### PII Detection (Basic)
| Service | Size | Description |
|---------|------|-------------|
| PIIDetector.ts | 9.5 KB | Regex-based PII detection |
| PIIEvaluationMetrics.ts | 14.6 KB | PII detection quality metrics |

### Evidence & Audit (Basic)
| Service | Size | Description |
|---------|------|-------------|
| EvidenceVaultService.ts | 39.3 KB | Immutable evidence storage |
| EvidenceExportService.ts | 40.0 KB | Export evidence to PDF/JSON |
| RegulatorsReceiptService.ts | 56.9 KB | Generate regulator-ready receipts |
| SignedTestReportService.ts | 29.5 KB | Cryptographically signed test reports |
| MerkleForestService.ts | 8.3 KB | Merkle tree integrity verification |
| ContentAddressedReceiptService.ts | 7.1 KB | Content-addressed evidence receipts |
| LineageService.ts | 26.1 KB | Decision lineage tracking |

### Compliance (Basic)
| Service | Size | Description |
|---------|------|-------------|
| ComplianceService.ts | 28.2 KB | Core compliance engine |
| ComplianceEnforcer.ts | 24.4 KB | Policy enforcement |
| ComplianceDashboardService.ts | 33.9 KB | Compliance overview dashboard |
| EUAIActEngine.ts | 45.2 KB | EU AI Act compliance mapping |
| frameworks.ts | 45.2 KB | Compliance framework definitions |

### Verticals (Basic — 18+ industries)
| Service | Size | Description |
|---------|------|-------------|
| FinancialVertical.ts | 58.7 KB | Financial services vertical |
| HealthcareVertical.ts | 53.2 KB | Healthcare vertical |
| GovernmentVertical.ts | 33.4 KB | Government vertical |
| InsuranceVertical.ts | 49.2 KB | Insurance vertical |
| *(+ 14 more verticals)* | | Agriculture, Aerospace, Automotive, Construction, Education, Energy, Hospitality, Industrial, Manufacturing, Media, Nonprofit, Pharmaceutical, Retail, Telecom, Transportation |

### Infrastructure
| Service | Size | Description |
|---------|------|-------------|
| BaseService.ts | 9.5 KB | Service base class |
| HealthService.ts | 10.8 KB | Health checks |
| email.ts | 4.7 KB | Email notifications |
| RedisCacheService.ts | 2.3 KB | Basic Redis caching |
| nativeCrypto.ts | 1.6 KB | Cryptographic utilities |

### What's Gated (Stub → UpgradePage in Core)
These exist in Core as tiny stubs (0.2–0.7 KB) that redirect to the upgrade wall. Full implementations are in Components:

| Service | Core Size | Components Size | Tier |
|---------|-----------|----------------|------|
| CendiaCrucibleService.ts | 0.6 KB | 98.6 KB | Enterprise |
| CendiaApotheosisService.ts | 0.7 KB | 75.5 KB | Enterprise |
| CendiaHorizonService.ts | 0.6 KB | 72.3 KB | Enterprise |
| CendiaDissentService.ts | 0.5 KB | 47.8 KB | Enterprise |
| CendiaPanopticonService.ts | 0.5 KB | 49.7 KB | Enterprise |
| CendiaOmniTranslateService.ts | 0.5 KB | 50.1 KB | Foundation |
| CendiaSentryService.ts | 10.4 KB | 49.8 KB | Foundation |
| EnhancedLLMService.ts | 0.5 KB | 31.4 KB | Foundation |
| SIEMIntegration.ts | 0.5 KB | 13.8 KB | Enterprise |
| ShadowAIDetector.ts | stub | 13.4 KB | Enterprise |
| KeyManagementService.ts | 0.5 KB | 39.1 KB | Enterprise |
| NotificationService.ts | 0.5 KB | 19.1 KB | Pilot |
| TranslationService.ts | 0.8 KB | 27.8 KB | Foundation |
| DecisionService.ts | 0.6 KB | 25.6 KB | Pilot |
| DeliberationService.ts | 0.5 KB | 28.1 KB | Pilot |
| CarbonAwareSchedulerService.ts | 0.5 KB | 15.9 KB | Strategic |

---

## Pilot Tier ($50K/yr) — Entry Point

> What it adds: Managed platform, SLA, support, basic analytics, full deliberation.
> Who it's for: The CISO who saw the developer's demo and said "we need the real thing."

### Managed Platform & Support
| Service | Size | Description |
|---------|------|-------------|
| NotificationService.ts | 19.1 KB | Full notification system (email, Slack, Teams, webhooks) |
| UserManagementService.ts | 19.4 KB | User/team management |
| SampleDataService.ts | 19.8 KB | Sample data for onboarding and demos |
| SystemHealthService.ts | 15.9 KB | System monitoring and health dashboard |
| AdminSettingsService.ts | 8.6 KB | Admin configuration panel |
| webhook.service.ts | 8.9 KB | Webhook delivery management |

### Full Deliberation Engine
| Service | Size | Description |
|---------|------|-------------|
| DeliberationService.ts | 28.1 KB | Full deliberation orchestration (vs. stub in Core) |
| DecisionService.ts | 25.6 KB | Full decision management (vs. stub in Core) |
| DeliberationVisualizationService.ts | 18.8 KB | Visual deliberation timeline |

### Basic Analytics
| Service | Size | Description |
|---------|------|-------------|
| ROIMetricsService.ts | 11.9 KB | ROI tracking and reporting |
| ExecutiveSummaryService.ts | 16.1 KB | Executive summary generation |

---

## Foundation Tier ($150K–$500K/yr) — Full Platform

> What it adds: Full compliance engines, all verticals unlocked with expanded schemas, advanced evidence, translation, enhanced LLM.
> Who it's for: Regulated enterprise (Cajas Municipales, regional bank, insurer) running cloud AI governance.

### Full Compliance Suite
| Service | Size | Description |
|---------|------|-------------|
| Basel3Engine.ts | 38.9 KB | Basel III financial compliance |
| CrossJurisdictionEngineService.ts | 22.6 KB | Multi-jurisdiction compliance mapping |
| CrossJurisdictionConflictService.ts | 40.4 KB | Jurisdiction conflict resolution |
| RegulatorySandboxService.ts | 22.5 KB | Regulatory sandbox testing |
| ContinuousComplianceMonitorService.ts | 22.0 KB | Continuous compliance monitoring |
| ComplianceExportService.ts | 21.3 KB | Advanced compliance exports |
| ComplianceGuard.ts | 11.2 KB | Real-time compliance guardrails |
| LegalVertical.ts | 26.4 KB | Legal vertical |
| LegalDecisionSchemas.ts | 18.9 KB | Legal decision schemas |
| LegalDecisionTypes.ts | 14.3 KB | Legal decision type definitions |

### Advanced Evidence & Audit
| Service | Size | Description |
|---------|------|-------------|
| echoService.ts | 45.1 KB | Echo — full decision replay and time-travel |
| gnosisService.ts | 26.0 KB | Gnosis — knowledge graph across decisions |
| TestEvidenceLedgerService.ts | 36.0 KB | Full evidence ledger |
| SelfContainedEvidenceService.ts | 20.1 KB | Portable, self-contained evidence packages |
| DecisionReplayTheaterService.ts | 16.4 KB | Visual replay of decision processes |
| CendiaStampService.ts | 11.4 KB | Cryptographic decision stamping |

### Enhanced AI & Translation
| Service | Size | Description |
|---------|------|-------------|
| CendiaOmniTranslateService.ts | 50.1 KB | 26-language translation (vs. stub in Core) |
| TranslationService.ts | 27.8 KB | Translation infrastructure |
| EnhancedLLMService.ts | 31.4 KB | Enhanced LLM orchestration (vs. stub in Core) |
| PresidioPIIService.ts | 10.4 KB | ML-based PII detection (Presidio) — upgrade from regex |
| RAGService.ts | 10.5 KB | Retrieval-augmented generation |
| VectorDBService.ts | 23.2 KB | Vector database for semantic search |
| VectorService.ts | 13.2 KB | Vector embedding management |
| EmbeddingService.ts | 8.8 KB | Embedding generation |

### Full Vertical Support (Expanded)
| Service | Size | Description |
|---------|------|-------------|
| VerticalSentinelService.ts | 29.7 KB | Cross-vertical monitoring |
| VerticalPattern.ts | 16.4 KB | Vertical pattern library |
| *(All expanded verticals)* | | HealthcareExpanded, FinancialExpanded, EnergyExpanded, etc. — full decision schemas, types, agents per industry |

### Analytics & Insights
| Service | Size | Description |
|---------|------|-------------|
| CendiaSentryService.ts | 49.8 KB | Full platform monitoring (vs. 10.4 KB in Core) |
| PredictService.ts | 16.6 KB | Predictive analytics |
| AnomalySentinelService.ts | 16.6 KB | Anomaly detection |
| AnalyticsRouter.ts | 12.9 KB | Analytics routing |

### Scheduling & Operations
| Service | Size | Description |
|---------|------|-------------|
| TemporalService.ts | 30.6 KB | Temporal workflow orchestration |
| AgentQueueService.ts | 16.0 KB | Agent scheduling and queue management |
| CouncilDecisionPacketService.ts | 16.0 KB | Decision packet assembly |

---

## Enterprise Tier ($500K–$1.5M/yr) — Advanced Governance

> What it adds: COLLAPSE stress testing, adversarial red team, shadow council, sovereign deployment, advanced security, SIEM, ethics.
> Who it's for: Large enterprise, regulated industry needing advanced AI risk management.

### COLLAPSE — AI Stress Testing Suite
| Service | Size | Description |
|---------|------|-------------|
| CendiaCrucibleService.ts | 98.6 KB | Systematic AI failure mode analysis (vs. 0.6 KB stub in Core) |
| CollapseOrchestrator.ts | 18.6 KB | COLLAPSE test orchestration |
| StressorLibraryService.ts | 12.0 KB | Library of AI stress test scenarios |
| BaseCollapseAgent.ts | 5.9 KB | Base class for COLLAPSE agents |
| MonteCarloEngine.ts | 13.1 KB | Monte Carlo simulation for risk scenarios |
| EnterpriseRedTeamService.ts | 48.7 KB | Enterprise-grade AI red teaming |
| AdversarialRedTeamService.ts | 22.0 KB | Adversarial red team attacks |
| redteamService.ts | 25.2 KB | Red team service orchestration |
| WarGamesService.ts | 26.1 KB | AI war games simulation |

### Adversarial Agent Suite (COLLAPSE Agents)
| Service | Size | Description |
|---------|------|-------------|
| FreeSpeechChillingAgent.ts | 10.4 KB | Tests for AI censorship/chilling effects |
| LegitimacyCollapseAgent.ts | 7.9 KB | Tests for institutional legitimacy erosion |
| ForeignInfluenceAmplificationAgent.ts | 7.4 KB | Tests for foreign influence amplification |
| NarrativeWeaponizationAgent.ts | 7.4 KB | Tests for narrative weaponization |
| AdversarialAbuseAgent.ts | 7.3 KB | Tests for adversarial prompt abuse |
| MarketDistortionAgent.ts | 7.2 KB | Tests for market manipulation risks |
| DemocraticProcessErosionAgent.ts | 7.1 KB | Tests for democratic process erosion |
| FreedomOfAssociationAgent.ts | 7.1 KB | Tests for freedom of association impact |
| EnvironmentalExternalityAgent.ts | 6.8 KB | Tests for environmental externality risks |
| DueProcessViolationAgent.ts | 6.7 KB | Tests for due process violations |
| DisabilityImpactAgent.ts | 6.4 KB | Tests for disability impact analysis |
| CulturalErasureAgent.ts | 6.2 KB | Tests for cultural erasure risks |

### Transcendence & Prediction
| Service | Size | Description |
|---------|------|-------------|
| CendiaApotheosisService.ts | 75.5 KB | Decision transcendence — pattern emergence (vs. 0.7 KB stub) |
| CendiaHorizonService.ts | 72.3 KB | Predictive governance — forecast risks (vs. 0.6 KB stub) |
| CendiaPredictService.ts | 41.9 KB | Advanced prediction engine |
| DecisionDNAService.ts | 35.2 KB | Decision DNA fingerprinting |
| DecisionSimilarityService.ts | 11.3 KB | Decision pattern matching |

### Shadow Council & Dissent
| Service | Size | Description |
|---------|------|-------------|
| ShadowCouncilService.ts | 21.0 KB | Shadow Council — parallel deliberation for comparison |
| CendiaDissentService.ts | 47.8 KB | Anonymous dissent system (vs. 0.5 KB stub) |
| AnonymousDissentService.ts | 14.4 KB | Anonymous dissent infrastructure |

### Security & Cryptography
| Service | Size | Description |
|---------|------|-------------|
| KeyManagementService.ts | 39.1 KB | Full key management (vs. 0.5 KB stub) |
| ZeroKnowledgeProofService.ts | 14.7 KB | Zero-knowledge proofs |
| Groth16ProofService.ts | 14.9 KB | Groth16 ZK-SNARK proofs |
| ConfidentialComputeService.ts | 19.1 KB | Confidential computing (TEE/SGX) |
| OpenBaoService.ts | 22.9 KB | HashiCorp Vault (OpenBao) secrets management |
| RuntimeSecurityService.ts | 16.7 KB | Runtime security monitoring |
| CendiaKeyService.ts | 22.4 KB | Key management infrastructure |
| TimeLockService.ts | 22.6 KB | Time-locked cryptographic operations |

### Enterprise Monitoring & Integration
| Service | Size | Description |
|---------|------|-------------|
| CendiaPanopticonService.ts | 49.7 KB | Full platform observability (vs. 0.5 KB stub) |
| SIEMIntegration.ts | 13.8 KB | SIEM integration (Splunk, Sentinel, etc.) |
| ShadowAIDetector.ts | 13.4 KB | Shadow AI usage detection |
| CendiaWatchService.ts | 76.2 KB | Full platform monitoring |
| WebhookNotifier.ts | 10.5 KB | Webhook notification delivery |
| KafkaService.ts | 21.1 KB | Kafka event streaming |
| KafkaEventBridge.ts | 13.7 KB | Kafka event bridge |
| KafkaTopics.ts | 6.6 KB | Kafka topic definitions |
| FlinkCEPService.ts | 15.3 KB | Flink complex event processing |
| DruidService.ts | 12.6 KB | Druid analytics |
| ClickHouseService.ts | 12.3 KB | ClickHouse analytics |

### Ethics & Governance
| Service | Size | Description |
|---------|------|-------------|
| EthicsService.ts | 26.8 KB | Ethics evaluation engine |
| AIConstitutionalCourtService.ts | 20.3 KB | AI constitutional court — appeals process |
| CendiaEquityService.ts | 36.0 KB | Equity and fairness analysis |
| CognitiveBiasMitigationService.ts | 26.6 KB | Cognitive bias detection and mitigation |
| NLPBiasDetectionService.ts | 16.7 KB | NLP bias detection |
| DecisionEscrowService.ts | 13.7 KB | Decision escrow for high-stakes decisions |
| VerifiableDelayService.ts | 11.8 KB | Verifiable delay functions for tamper resistance |

### Licensing & Multi-Tenant
| Service | Size | Description |
|---------|------|-------------|
| licensing.service.ts | 18.1 KB | License management |
| LicenseService.ts | 16.7 KB | License validation |
| TenantService.ts | 17.8 KB | Multi-tenant isolation |
| MFAService.ts | 12.8 KB | Multi-factor authentication |
| SSOService.ts | 17.3 KB | Single sign-on (SAML, OIDC) |

### Sovereign Features (Online Toggle)
| Service | Size | Description | Online Required? |
|---------|------|-------------|-----------------|
| OllamaProvider.ts | 11.4 KB | Local LLM via Ollama | ❌ No |
| NIMProvider.ts | 10.7 KB | NVIDIA NIM local inference | ❌ No |
| TritonProvider.ts | 11.5 KB | NVIDIA Triton inference server | ❌ No |
| LocalRLHFService.ts | 32.9 KB | Local RLHF fine-tuning | ❌ No |
| HelmService.ts | 15.5 KB | Kubernetes Helm deployment | ❌ No |

---

## Strategic Tier ($1.5M+/yr) — Nation-Scale

> What it adds: Air-gapped deployment, data diode, federated mesh, TPM attestation, defense-grade, portable instances.
> Who it's for: National government, defense, sovereign AI deployment.

### Air-Gapped & Sovereign Deployment
| Service | Size | Description |
|---------|------|-------------|
| DataDiodeService.ts | 38.0 KB | Hardware data diode for air-gapped environments |
| QRAirGapBridgeService.ts | 25.1 KB | QR-code air-gap bridge for evidence transfer |
| PortableInstanceService.ts | 25.0 KB | Portable Datacendia instance (USB/offline) |
| TPMAttestationService.ts | 24.0 KB | TPM hardware attestation |
| PostQuantumKMSService.ts | 19.6 KB | Post-quantum key management |

### Federated & Mesh
| Service | Size | Description |
|---------|------|-------------|
| FederatedMeshService.ts | 42.6 KB | Federated mesh governance across jurisdictions |
| CendiaMeshService.ts | 43.7 KB | Mesh network orchestration |
| GatewayFederationService.ts | 20.4 KB | Gateway federation across instances |
| CendiaTransitService.ts | 48.4 KB | Secure transit between federated nodes |
| CendiaBridgeService.ts | 23.3 KB | Bridge between isolated environments |
| UnionService.ts | 24.6 KB | Union of federated governance policies |

### Advanced Platform Services
| Service | Size | Description |
|---------|------|-------------|
| CendiaGuardianService.ts | 56.6 KB | Guardian — platform-wide security orchestration |
| CendiaAegisService.ts | 60.0 KB | Aegis — defense-grade protection |
| CendiaCommandService.ts | 40.6 KB | Command — enterprise operations center |
| CendiaCommandPlatinumService.ts | 24.7 KB | Command Platinum — strategic operations |
| CendiaRegentService.ts | 34.1 KB | Regent — governance delegation |
| CendiaGovernService.ts | 31.5 KB | Govern — policy orchestration |
| CendiaVetoService.ts | 19.9 KB | Veto — emergency override system |

### Intelligence & Knowledge
| Service | Size | Description |
|---------|------|-------------|
| CendiaInventumService.ts | 48.3 KB | Inventum — discovery engine |
| CendiaScoutService.ts | 41.1 KB | Scout — threat intelligence |
| CendiaResonanceService.ts | 46.5 KB | Resonance — cross-decision pattern amplification |
| CendiaNexusService.ts | 34.5 KB | Nexus — knowledge nexus |
| CendiaOracleService.ts | 25.2 KB | Oracle — predictive intelligence |
| CendiaGraphService.ts | 29.6 KB | Graph — relationship intelligence |
| PantheonMemoryService.ts | 23.7 KB | Pantheon — institutional memory |

### Specialized Agent Services
| Service | Size | Description |
|---------|------|-------------|
| VerticalAgentsService.ts | 49.5 KB | Vertical-specific agent orchestration |
| InstitutionalAgentsService.ts | 36.3 KB | Institutional governance agents |
| MetaGovernanceAgentsService.ts | 36.2 KB | Meta-governance agents |
| AdversarialAgentsService.ts | 35.2 KB | Adversarial testing agents |
| ObserverAgentsService.ts | 34.9 KB | Observer and audit agents |
| DecisionAgentsService.ts | 29.4 KB | Specialized decision agents |

### Advanced Audit & Legal
| Service | Size | Description |
|---------|------|-------------|
| CendiaAuditService.ts | 41.3 KB | Enterprise audit management |
| ImmutableAuditLedger.ts | 26.4 KB | Immutable audit ledger (blockchain-grade) |
| TimestampAuthorityService.ts | 27.6 KB | RFC 3161 timestamp authority |
| StatementOfFactsService.ts | 25.7 KB | Legal statement of facts generation |
| CendiaDocketService.ts | 40.0 KB | Legal docket management |
| LegalAgents.ts | 48.0 KB | Legal AI agents |
| LegalCouncilModes.ts | 46.7 KB | Legal council modes |
| LegalResearchService.ts | 31.0 KB | Legal research automation |
| LegalVerticalService.ts | 22.6 KB | Full legal vertical service |
| CaseImportService.ts | 21.9 KB | Legal case import |

### Advanced Operations
| Service | Size | Description |
|---------|------|-------------|
| CendiaFactoryService.ts | 42.2 KB | Factory — automated deployment pipeline |
| CendiaHabitatService.ts | 45.4 KB | Habitat — environment management |
| CendiaNerveService.ts | 44.4 KB | Nerve — real-time event nervous system |
| CendiaEternalService.ts | 30.6 KB | Eternal — long-term evidence preservation |
| CendiaRewindService.ts | 37.5 KB | Rewind — full system time-travel |
| CendiaRecallService.ts | 25.2 KB | Recall — decision retrieval |
| DatabaseBackupService.ts | 20.8 KB | Enterprise database backup |
| EnterpriseSchedulerService.ts | 31.4 KB | Enterprise job scheduling |

### Revenue & Business (Internal)
| Service | Size | Description |
|---------|------|-------------|
| CendiaRevenueService.ts | 38.9 KB | Revenue tracking and analytics |
| CendiaRainmakerService.ts | 34.2 KB | Sales pipeline intelligence |
| CendiaProcureService.ts | 27.8 KB | Procurement management |
| AIInsuranceService.ts | 24.5 KB | AI insurance and liability |
| MarketSalaryService.ts | 24.8 KB | Market salary benchmarking |

### Carbon & Sustainability
| Service | Size | Description |
|---------|------|-------------|
| CarbonAwareSchedulerService.ts | 15.9 KB | Carbon-aware workload scheduling |

---

## Sovereign Online Toggle

> For the **Enterprise** and **Strategic** tiers, the platform must support being fully sovereign.
> This means all online/cloud AI services must be toggleable OFF without breaking the platform.

### Services That Require Online Access (Must Be Toggleable)
| Service | What It Calls | Sovereign Alternative |
|---------|--------------|----------------------|
| OpenAIProvider.ts | OpenAI API | OllamaProvider / NIMProvider / TritonProvider |
| AnthropicProvider.ts | Anthropic API | OllamaProvider / NIMProvider / TritonProvider |
| GeminiProvider.ts | Google Gemini API | OllamaProvider / NIMProvider / TritonProvider |
| TogetherAIProvider.ts | Together AI API | OllamaProvider / NIMProvider / TritonProvider |
| FREDDataService.ts | Federal Reserve API | Local data cache / offline datasets |
| SIEMIntegration.ts | External SIEM (Splunk Cloud) | On-prem SIEM / local log aggregation |
| email.ts | SMTP relay | On-prem SMTP / disabled |
| WebhookNotifier.ts | External webhook URLs | Internal event bus / disabled |
| NeMoGuardrailsEngine.ts | NVIDIA NeMo Cloud | Local NeMo container |
| RAPIDSService.ts | NVIDIA RAPIDS Cloud | Local RAPIDS installation |

### Services That Work Offline (No Toggle Needed)
Everything else — Council, Evidence, Compliance, PII, Verticals, COLLAPSE, RedTeam, Federated Mesh, Data Diode, etc. — runs entirely locally.

### Proposed Toggle Implementation
```
DATACENDIA_ONLINE_MODE=true|false        # Master toggle — overrides all below
DATACENDIA_CLOUD_AI=true|false           # Cloud AI providers specifically
DATACENDIA_CLOUD_AI_FALLBACK=error|local # What happens when cloud AI is invoked while disabled
DATACENDIA_EXTERNAL_DATA=true|false      # External data feeds (FRED, etc.)
DATACENDIA_EXTERNAL_NOTIFY=true|false    # External notifications (email, webhook, SIEM)
```

When `DATACENDIA_ONLINE_MODE=false`:
- All cloud AI providers disabled → behaviour depends on `DATACENDIA_CLOUD_AI_FALLBACK`
- External data feeds disabled → uses cached/local datasets
- External notifications disabled → internal event bus only
- Gateway cloud proxy disabled → only local LLM governance active
- All evidence, compliance, Council, verticals continue working normally

### Fallback Behaviour When Cloud AI Is Disabled

| `CLOUD_AI_FALLBACK` | Behaviour | When To Use |
|---------------------|-----------|-------------|
| `error` **(default)** | Hard error: `CloudAIDisabledError: Cloud AI providers are disabled (DATACENDIA_ONLINE_MODE=false). Configure a local LLM provider.` Returns HTTP 503 with structured error body. | **Air-gapped / SCIF / audited environments.** Predictable. Auditor-friendly. No ambiguity about what the system is doing. |
| `local` | Silent fallback: routes to the first available local provider (Ollama → NIM → Triton, in priority order). Logs a warning: `WARN: Cloud provider [OpenAI] unavailable in offline mode, routing to [Ollama/llama3]`. | **Sovereign but flexible environments.** The Caja's IT team wants the system to keep working even if someone misconfigures a route. |

**Why `error` is the default:** In a regulated, air-gapped deployment, silent fallback is dangerous. If a user expects GPT-4 and silently gets Llama 3, the output quality changes and nobody knows. The hard error forces explicit configuration — every AI route must be mapped to a local provider before the system starts. This is a compliance artifact: the deployment manifest proves exactly which models are in use.

### Startup Validation (Air-Gapped Mode)

When `DATACENDIA_ONLINE_MODE=false`, the system should validate at startup:

1. **At least one local LLM provider is configured and reachable** (Ollama, NIM, or Triton)
2. **All model routes have local provider mappings** (no route points to a cloud-only model)
3. **External data caches are populated** (FRED data, compliance framework updates)
4. **SMTP is either on-prem or disabled** (not pointing to an external relay)

If validation fails, the system **refuses to start** with a clear error:
```
FATAL: Sovereign mode validation failed:
  - No local LLM provider configured (set OLLAMA_HOST or NIM_ENDPOINT)
  - Model route 'gpt-4o' has no local mapping (add to config/model-routes.yaml)
  - FRED data cache is empty (run: datacendia sync-offline-data)
System will not start in DATACENDIA_ONLINE_MODE=false without resolving these.
```

This startup gate becomes the deployment checklist for air-gapped installs. The IT team runs it, fixes what's missing, and the passing validation is itself an audit artifact.

---

## What Each Tier Actually Sells

> Service counts are misleading. Community has ~180 services because it's a broad, functional base — but it's self-hosted, regex-only PII, no SLA, no SSO, no support. No regulated enterprise ships Community to production. The paid tiers don't sell more services — they sell production-readiness, depth, and guarantees.

| Tier | Price | What You're Actually Buying |
|------|-------|----------------------------|
| **Community** | Free | A working AI governance platform you can try. Self-hosted. No SLA. No support. Regex PII. Basic Council. Enough to demo to your CISO. |
| **Pilot** | $50K/yr | **We run it for you.** Managed deployment, 99.5% SLA, priority support, full deliberation engine, 90-day money-back guarantee. |
| **Foundation** | $150K–$500K/yr | **Production compliance.** Full compliance engines (Basel III, EU AI Act, cross-jurisdiction), ML-based PII (Presidio), Echo/Gnosis evidence, OmniTranslate (26 languages), expanded verticals. |
| **Enterprise** | $500K–$1.5M/yr | **Advanced risk.** COLLAPSE stress testing, 12 adversarial agents, Shadow Council, sovereign LLM providers, SSO/MFA, SIEM, ZK proofs, multi-tenant. |
| **Strategic** | $1.5M+/yr | **Nation-scale.** Air-gapped, data diode, TPM attestation, federated mesh, post-quantum crypto, defense-grade, portable instances. |

### Why Community's 180 Services Isn't a Conversion Problem

Community is **breadth without depth**. The 180 services break down as:
- ~18 base verticals (industry templates, not compliance engines)
- ~30 expanded schemas/types (decision patterns, not enforcement)
- ~15 council modes (per-vertical behaviour, not Shadow Council or COLLAPSE)
- ~6 cloud AI providers (the proxy engine)
- ~7 basic evidence services (vault and export, not Echo/Gnosis/replay)
- ~5 basic compliance (enforcer and dashboard, not Basel III or cross-jurisdiction)
- ~20 infrastructure (base classes, health checks, types, indexes)
- ~5 council/flow (basic deliberation)

A Caja Municipal using Community would get: proxy intercepting their OpenAI calls, regex PII detection, a Council that deliberates, and a Regulator's Receipt. **But they'd be self-hosting with no SLA, no SSO, no MFA, regex-only PII, no managed updates, and no support.** Their compliance team would reject it on day one.

The conversion trigger isn't "they need more features." It's **"they need the production-grade version of what they already tried."**

### Why Pilot at $50K Isn't a Hard Sell

Pilot doesn't sell 15 services. It sells:
1. **Datacendia deploys and manages it** — their IT team doesn't touch infrastructure
2. **99.5% SLA** — procurement can check the box
3. **Priority support** — 4-hour response
4. **Full deliberation engine** — not the stub
5. **90-day guarantee** — money back if no value

The price jump to Foundation ($150K–$500K) is justified because Foundation adds the **compliance depth** that regulated enterprises actually need: Basel III, cross-jurisdiction, ML-based PII, Echo audit replay, and 26-language support. Pilot proves the platform works; Foundation makes it compliant.

---

## Notes

- Some services appear in both Core and Components with different sizes. The Core version is either a stub (shows UpgradePage) or a reduced implementation. The Components version is the full implementation.
- Vertical services (FinancialVertical, HealthcareVertical, etc.) exist in Core with full implementations. The *Expanded* versions (HealthcareVerticalExpanded, etc.) with additional decision schemas and agent specializations are Foundation+.
- The tier boundaries above are **proposed** and should be reviewed for commercial sense — the goal is to ensure each tier has enough differentiation to justify the price jump.
