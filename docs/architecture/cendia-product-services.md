# Cendia Product Services — Architecture & Workflow Diagrams

## 1. Product Services Map

```mermaid
graph TB
    subgraph AI_Safety["AI Safety & Guardrails"]
        SENTRY[CendiaSentry<br/>AI guardrails + content safety]
        AEGIS[CendiaAegis<br/>Defense + threat protection]
        CRUCIBLE[CendiaCrucible<br/>AI stress testing + red team]
    end

    subgraph Intelligence["Intelligence & Analytics"]
        PANOPTICON[CendiaPanopticon<br/>Organization-wide AI visibility]
        HORIZON[CendiaHorizon<br/>AI trend forecasting]
        CHRONOS[ChronosAI<br/>Temporal AI analytics]
    end

    subgraph Governance["Governance & Compliance"]
        VOX[CendiaVox<br/>Stakeholder voice + feedback]
        DISSENT[CendiaDissent<br/>Formal dissent tracking]
        RESPONSIBILITY[CendiaResponsibility<br/>AI accountability framework]
    end

    subgraph Data["Data & Knowledge"]
        RECALL[CendiaRecall<br/>AI memory + knowledge retrieval]
        SYMBIONT[CendiaSymbiont<br/>Human-AI collaboration]
        ETERNAL[CendiaEternal<br/>Long-term AI knowledge preservation]
        GNOSIS[gnosisService<br/>Knowledge synthesis]
    end

    subgraph Communication["Communication"]
        OMNI[CendiaOmniTranslate<br/>Multi-language AI translation]
        ECHO[echoService<br/>Echo chamber detection]
    end

    subgraph Business["Business Operations"]
        HR[HRIntegrationService<br/>HR system connectors]
        SALARY[MarketSalaryService<br/>Compensation intelligence]
        APOTHEOSIS[CendiaApotheosis<br/>AI excellence benchmarking]
    end

    subgraph Verticals["Vertical Industry Agents"]
        VA[VerticalAgentsService<br/>107 files, industry-specific]
        VA --> V1[Healthcare AI]
        VA --> V2[Finance AI]
        VA --> V3[Legal AI]
        VA --> V4[Manufacturing AI]
    end

    style SENTRY fill:#ef444420,stroke:#ef4444
    style PANOPTICON fill:#3b82f620,stroke:#3b82f6
    style CRUCIBLE fill:#f59e0b20,stroke:#f59e0b
    style VA fill:#7c3aed20,stroke:#7c3aed
```

## 2. CendiaSentry — AI Guardrails Pipeline

```mermaid
flowchart LR
    INPUT[AI Input/Output] --> PII{PII Detection}
    PII -->|Found| BLOCK1[Block + Redact]
    PII -->|Clean| TOXIC{Toxicity Check}
    TOXIC -->|Toxic| BLOCK2[Block + Flag]
    TOXIC -->|Safe| BIAS{Bias Detection}
    BIAS -->|Biased| WARN[Warn + Log]
    BIAS -->|Fair| HALLUC{Hallucination Score}
    HALLUC -->|High risk| REVIEW[Require Human Review]
    HALLUC -->|Low risk| PASS[✓ Approved]

    BLOCK1 & BLOCK2 & WARN & REVIEW --> LOG[Audit Log<br/>with evidence]

    style BLOCK1 fill:#ef444420,stroke:#ef4444
    style BLOCK2 fill:#ef444420,stroke:#ef4444
    style PASS fill:#10b98120,stroke:#10b981
```

## 3. CendiaCrucible — AI Stress Testing

```mermaid
sequenceDiagram
    participant User
    participant CR as CendiaCrucible
    participant RT as EnterpriseRedTeamService
    participant AI as Target AI System
    participant DB as PostgreSQL

    User->>CR: Configure stress test
    CR->>CR: Generate adversarial inputs

    loop Each test scenario
        CR->>AI: Submit adversarial input
        AI-->>CR: AI response
        CR->>RT: Evaluate response quality
        RT-->>CR: Red team assessment
        CR->>CR: Score: pass/fail/degrade
    end

    CR->>CR: Compile test report
    CR->>DB: Persist results
    CR-->>User: Crucible Report<br/>Pass rate, failure modes, recommendations
```

## 4. ChronosAI — Temporal Intelligence

```mermaid
graph TB
    subgraph Input["Data Sources"]
        TS[Time-series AI metrics]
        EVENTS[ChronosEventBus<br/>Event stream]
        HIST[Historical decisions]
    end

    subgraph Chronos["ChronosAI Engine"]
        ANAL[Temporal Analysis<br/>Pattern detection]
        FORE[Forecasting<br/>Trend projection]
        ANOM[Anomaly Detection<br/>Drift / degradation]
    end

    subgraph Output["Insights"]
        TREND[Trend Reports]
        ALERT[Anomaly Alerts]
        PRED[Predictive Insights]
    end

    TS & EVENTS & HIST --> ANAL
    ANAL --> FORE & ANOM
    FORE --> TREND & PRED
    ANOM --> ALERT

    style CHRONOS fill:#f59e0b20,stroke:#f59e0b
```
