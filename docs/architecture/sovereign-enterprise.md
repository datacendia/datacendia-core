# Sovereign & Enterprise Services — Architecture & Workflow Diagrams

## 1. Sovereign AI Architecture (22 modules)

```mermaid
graph TB
    subgraph Sovereign["Sovereign AI Platform"]
        direction TB
        subgraph DataSov["Data Sovereignty"]
            DS1[Data Residency<br/>Regional storage enforcement]
            DS2[Data Classification<br/>Auto-classify AI data]
            DS3[Cross-Border Control<br/>Transfer restrictions]
        end

        subgraph ModelSov["Model Sovereignty"]
            MS1[Model Registry<br/>Version tracking + provenance]
            MS2[Model Governance<br/>Approval workflows]
            MS3[Model Auditor<br/>Bias + fairness checks]
        end

        subgraph OpsSov["Operations Sovereignty"]
            OS1[Deployment Control<br/>Where models run]
            OS2[Access Governance<br/>Who uses what]
            OS3[Cost Governance<br/>Budget + allocation]
        end

        subgraph AuditSov["Audit & Evidence"]
            AS1[Decision Provenance<br/>Full decision lineage]
            AS2[Regulatory Reporter<br/>Auto-generate reports]
            AS3[Evidence Vault<br/>Tamper-proof storage]
        end
    end

    subgraph DB["Storage"]
        PG[(PostgreSQL)]
        S3[Object Storage<br/>Models + artifacts]
    end

    DataSov & ModelSov & OpsSov & AuditSov --> PG & S3

    style DS1 fill:#ef444420,stroke:#ef4444
    style MS1 fill:#3b82f620,stroke:#3b82f6
    style AS3 fill:#7c3aed20,stroke:#7c3aed
```

## 2. Enterprise Services (18 modules)

```mermaid
graph TB
    subgraph Enterprise["Enterprise Layer"]
        subgraph MultiTenant["Multi-Tenancy"]
            TENANT[TenantService<br/>Organization isolation]
            FEATURE[FeatureControlService<br/>Feature flags per tier]
        end

        subgraph AdminTools["Admin & Operations"]
            BRAND[CendiaBrandService<br/>White-label customization]
            SUPPORT[CendiaSupportService<br/>Support ticket system]
            WATCH[CendiaWatchService<br/>System health monitoring]
            FOUNDRY[CendiaFoundryService<br/>Custom model training]
            REVENUE[CendiaRevenueService<br/>Billing + usage metering]
        end

        subgraph Infra["Infrastructure"]
            CACHE[RedisCacheService<br/>Distributed caching]
            STORAGE[StorageService<br/>File + artifact storage]
            KAFKA[KafkaService<br/>Event streaming]
            STREAM[StreamingService<br/>Real-time data feeds]
            GPU_SVC[GPUService<br/>GPU resource management]
        end

        subgraph DataPipeline["Data Pipeline"]
            GRAPH[graphIngestion<br/>Knowledge graph builder]
            VECTOR[VectorDB Service<br/>Embedding storage + search]
            DOC[DocumentService<br/>Document processing]
            SAMPLE[SampleDataService<br/>Demo data generation]
        end
    end

    MultiTenant --> AdminTools
    AdminTools --> Infra
    Infra --> DataPipeline

    style TENANT fill:#7c3aed20,stroke:#7c3aed
    style FEATURE fill:#f59e0b20,stroke:#f59e0b
    style CACHE fill:#3b82f620,stroke:#3b82f6
```

## 3. Multi-Tenant Isolation Flow

```mermaid
sequenceDiagram
    participant Client
    participant Auth as JWT + RBAC
    participant Tenant as TenantService
    participant Feature as FeatureControlService
    participant Service as Business Service
    participant DB as PostgreSQL

    Client->>Auth: Request with JWT
    Auth->>Auth: Extract orgId from token
    Auth->>Tenant: resolveTenant(orgId)
    Tenant-->>Auth: Tenant config (tier, limits)

    Auth->>Feature: getFeatures(tenantTier)
    Feature-->>Auth: Enabled features

    alt Feature enabled for tier
        Auth->>Service: Forward request + tenant context
        Service->>DB: Query with tenant isolation (WHERE orgId = ?)
        DB-->>Service: Tenant-scoped data
        Service-->>Client: 200 Response
    else Feature not available
        Auth-->>Client: 403 Feature not available in your plan
    end
```

## 4. GPU Resource Management

```mermaid
flowchart TD
    REQ[Inference Request] --> GPU{GPU Available?}
    GPU -->|Yes| ALLOC[Allocate GPU Slot]
    GPU -->|No| QUEUE[Queue Request]
    QUEUE --> WAIT{Wait or Fallback?}
    WAIT -->|Wait| GPU
    WAIT -->|Fallback| CLOUD[Cloud Provider Fallback]

    ALLOC --> EXEC[Execute on GPU]
    EXEC --> RELEASE[Release GPU Slot]
    RELEASE --> METRIC[Report Metrics<br/>Utilization, latency, cost]

    CLOUD --> METRIC

    style ALLOC fill:#10b98120,stroke:#10b981
    style CLOUD fill:#f59e0b20,stroke:#f59e0b
```
