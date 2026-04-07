# Data & Infrastructure — Architecture & Workflow Diagrams

## 1. Data Layer Architecture

```mermaid
graph TB
    subgraph Storage["Storage Services"]
        PG[(PostgreSQL<br/>Prisma ORM)]
        REDIS[RedisCacheService<br/>Hot data cache]
        VECTOR[VectorDB Service<br/>Embedding search]
        OBJ[Object Storage<br/>Files + artifacts]
    end

    subgraph Ingestion["Data Ingestion"]
        GRAPH[graphIngestion<br/>Knowledge graph builder]
        DOC[DocumentService<br/>PDF/text processing]
        SAMPLE[SampleDataService<br/>Demo data seeding]
    end

    subgraph Streaming["Event Streaming"]
        KAFKA[KafkaService<br/>Event bus (4 modules)]
        DRUID[DruidEventStream<br/>Real-time analytics]
        CHRONOS_EB[ChronosEventBus<br/>Temporal events]
        STREAM[StreamingService<br/>WebSocket feeds]
    end

    subgraph Persistence["Service Persistence"]
        SP[servicePersistence.ts<br/>Generic record store]
        SP --> |"persistServiceRecord()"| PG
        SP --> |"loadServiceRecords()"| PG
    end

    subgraph Backup["Backup & Recovery"]
        BK[BackupService<br/>Scheduled backups]
        BK --> PG
    end

    GRAPH --> PG & VECTOR
    DOC --> VECTOR & OBJ
    KAFKA --> DRUID & CHRONOS_EB

    style PG fill:#10b98120,stroke:#10b981
    style REDIS fill:#ef444420,stroke:#ef4444
    style VECTOR fill:#7c3aed20,stroke:#7c3aed
    style KAFKA fill:#f59e0b20,stroke:#f59e0b
```

## 2. Service Persistence Pattern

```mermaid
sequenceDiagram
    participant SVC as Any Service
    participant SP as servicePersistence.ts
    participant PRISMA as Prisma Client
    participant PG as PostgreSQL

    Note over SVC,PG: Write Path
    SVC->>SP: persistServiceRecord({serviceName, recordType, orgId, refId, data})
    SP->>PRISMA: upsert(service_records)
    PRISMA->>PG: INSERT/UPDATE
    PG-->>PRISMA: OK
    PRISMA-->>SP: Record
    SP-->>SVC: Persisted

    Note over SVC,PG: Read Path (lazy init)
    SVC->>SVC: loadFromDB() — first access only
    SVC->>SP: loadServiceRecords({serviceName, recordType, limit})
    SP->>PRISMA: findMany(where: {serviceName, recordType})
    PRISMA->>PG: SELECT
    PG-->>PRISMA: Rows
    PRISMA-->>SP: Records[]
    SP-->>SVC: Records[]
    SVC->>SVC: Hydrate in-memory maps
```

## 3. Caching Strategy

```mermaid
flowchart TD
    REQ[Request] --> CACHE{Redis Cache?}
    CACHE -->|Hit| RETURN[Return cached<br/>TTL-based expiry]
    CACHE -->|Miss| DB[Query PostgreSQL]
    DB --> STORE[Store in Redis<br/>Set TTL]
    STORE --> RETURN

    subgraph Invalidation["Cache Invalidation"]
        WRITE[Write Operation] --> EVICT[Evict cache key]
        EVICT --> PUBLISH[Publish invalidation<br/>event to Kafka]
    end

    style RETURN fill:#10b98120,stroke:#10b981
    style CACHE fill:#ef444420,stroke:#ef4444
```

## 4. Email Service Architecture

```mermaid
flowchart TD
    SEND[Send Email Request] --> SG{SENDGRID_API_KEY?}
    SG -->|Yes| SENDGRID[SendGrid HTTP API<br/>Primary — works on Railway]
    SG -->|No| SMTP{SMTP configured?}
    SMTP -->|Yes| NODEMAILER[Nodemailer SMTP<br/>Fallback — blocked on Railway]
    SMTP -->|No| LOG[Console Log Only<br/>Development mode]

    SENDGRID --> OK[Email Sent ✓]
    NODEMAILER --> OK
    LOG --> DEV[Logged to console]

    style SENDGRID fill:#10b98120,stroke:#10b981
    style NODEMAILER fill:#f59e0b20,stroke:#f59e0b
    style LOG fill:#64748b20,stroke:#64748b
```

## 5. Notification Service

```mermaid
graph LR
    subgraph Sources["Notification Sources"]
        COMP[Compliance Alert]
        COUNCIL[Council Decision]
        SCAN[Scan Complete]
        TASK[Task Status Change]
        SYS[System Health]
    end

    subgraph NS["NotificationService"]
        ROUTE[Router<br/>Channel selection]
        ROUTE --> EMAIL[Email Channel<br/>SendGrid]
        ROUTE --> WS[WebSocket Channel<br/>Real-time]
        ROUTE --> STORE[In-App Store<br/>Notification center]
    end

    COMP & COUNCIL & SCAN & TASK & SYS --> ROUTE

    style NS fill:#3b82f620,stroke:#3b82f6
```
