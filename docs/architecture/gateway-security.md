# Gateway & Security — Architecture & Workflow Diagrams

## 1. Gateway Architecture

```mermaid
graph TB
    subgraph Gateway["CendiaGateway (14 modules)"]
        PROXY[AI Proxy<br/>Route all AI traffic]
        PII[PII Interceptor<br/>Block sensitive data]
        RATE[Rate Limiter<br/>Per-user/org throttle]
        AUDIT[Audit Logger<br/>Every request logged]
        POLICY[Policy Engine<br/>Enforce usage rules]
        ROUTE[Smart Router<br/>Model selection]
        CACHE[Response Cache<br/>Reduce cost]
        TRANS[Transform Pipeline<br/>Input/output modification]
        METRIC[Metrics Collector<br/>Cost + latency tracking]
        TOKEN[Token Counter<br/>Budget enforcement]
        FILTER[Content Filter<br/>Block prohibited content]
        FALLBACK[Fallback Handler<br/>Provider failover]
        LOAD[Load Balancer<br/>Multi-provider distribution]
        HEALTH[Health Monitor<br/>Provider availability]
    end

    subgraph Clients["AI Consumers"]
        EMP[Employee Apps]
        INT[Internal Tools]
        API_C[API Clients]
    end

    subgraph Providers["AI Providers"]
        P1[OpenAI]
        P2[Anthropic]
        P3[Ollama Local]
        P4[Custom Models]
    end

    EMP & INT & API_C --> PROXY
    PROXY --> PII --> RATE --> POLICY --> ROUTE
    ROUTE --> CACHE
    CACHE -->|miss| LOAD --> P1 & P2 & P3 & P4
    CACHE -->|hit| PROXY
    LOAD --> FALLBACK --> HEALTH
    PROXY --> AUDIT & METRIC & TOKEN

    style PROXY fill:#3b82f620,stroke:#3b82f6
    style PII fill:#ef444420,stroke:#ef4444
    style POLICY fill:#7c3aed20,stroke:#7c3aed
```

## 2. Security Services Architecture

```mermaid
graph TB
    subgraph Security["Security Layer (9 modules)"]
        MASTER[masterSecurityMiddleware<br/>Central security orchestrator]
        REPLAY[preventReplayAttack<br/>Nonce + timestamp validation]
        EXFIL[preventDataExfiltration<br/>Output scanning]
        THREAT[threatDetectionMiddleware<br/>Request anomaly detection]
        RBAC[RBAC Engine<br/>Role-based access control]
        JWT_V[JWT Validator<br/>Token verification]
        CORS_V[CORS Handler<br/>Origin validation]
        HELMET[Helmet CSP<br/>Content Security Policy]
        DEMO[demoGuardMiddleware<br/>Demo org write protection]
    end

    subgraph Request["Incoming Request"]
        REQ[HTTP Request]
    end

    subgraph Static["Static Assets"]
        ASSETS[express.static<br/>Served BEFORE security]
    end

    subgraph Protected["Protected Routes"]
        API[API Endpoints]
    end

    REQ --> ASSETS
    REQ --> HELMET --> CORS_V --> JWT_V --> MASTER
    MASTER --> REPLAY --> EXFIL --> THREAT --> RBAC --> DEMO --> API

    style MASTER fill:#ef444420,stroke:#ef4444
    style ASSETS fill:#10b98120,stroke:#10b981
    style DEMO fill:#6366f120,stroke:#6366f1
```

## 3. Request Security Flow

```mermaid
sequenceDiagram
    participant Client
    participant Static as express.static
    participant Helmet as Helmet/CSP
    participant Auth as JWT + blockIfDemo①
    participant Sec as Security Middleware
    participant OrgScope as requireOrgScope + blockIfDemo②
    participant Route as API Route

    Client->>Static: GET /assets/main.js
    Static-->>Client: 200 (served before security)

    Client->>Helmet: POST /api/v1/council
    Helmet->>Helmet: Apply CSP headers
    Helmet->>Auth: Forward request

    alt Valid JWT — Real org (UUID)
        Auth->>Auth: Resolve user + org from DB
        Auth->>Auth: isDemoOrg() → false, proceed
        Auth->>Sec: Authenticated request
        Sec->>Sec: Check replay (nonce)
        Sec->>Sec: Check exfiltration patterns
        Sec->>Sec: Threat detection scoring
        Sec->>OrgScope: ✓ Security approved
        OrgScope->>OrgScope: isDemoOrg() → false, proceed
        OrgScope->>Route: ✓ Fully approved
        Route-->>Client: 200 Response
    else Valid JWT — Demo org (demo- prefix) + mutating method
        Auth->>Auth: isDemoOrg("demo-org-001") → true
        Auth-->>Client: 200 { _demo: true, _message: "Changes not persisted" }
    else Invalid JWT
        Auth-->>Client: 401 Unauthorized
    else Threat detected
        Sec-->>Client: 403 Blocked
    end
```

## 5. Demo Guard — Tenant Protection Flow

```mermaid
flowchart TD
    REQ4[Incoming Request] --> JWT2{Valid JWT?}
    JWT2 -->|No| REJECT2[401 Unauthorized]
    JWT2 -->|Yes| RESOLVE[Resolve org from DB]
    RESOLVE --> DEMO_CHK{isDemoOrg?<br/>starts with demo- or tutorial-?}
    DEMO_CHK -->|No — real UUID org| MUTATE_CHK{Mutating method?<br/>POST/PUT/PATCH/DELETE}
    MUTATE_CHK -->|No GET/HEAD| PASS2[Pass through normally]
    MUTATE_CHK -->|Yes| PASS2
    DEMO_CHK -->|Yes — demo org| ROLE_CHK{SUPER_ADMIN?}
    ROLE_CHK -->|Yes| PASS2
    ROLE_CHK -->|No| MOCK[Return mock 200<br/>_demo: true<br/>Nothing written to DB]

    style PASS2 fill:#10b98120,stroke:#10b981
    style MOCK fill:#6366f120,stroke:#6366f1
    style REJECT2 fill:#ef444420,stroke:#ef4444
```

## 4. Vault & Key Management

```mermaid
graph TB
    subgraph Vault["Vault Service"]
        VS[Vault Manager<br/>Secrets lifecycle]
        KMS[KeyManagementService<br/>Crypto keys]
    end

    subgraph Keys["Key Types"]
        SIGN[Signing Keys<br/>Evidence attestation]
        ENC[Encryption Keys<br/>Data at rest]
        JWT_K[JWT Keys<br/>Auth tokens]
        API_K[API Keys<br/>Provider access]
    end

    subgraph Consumers["Consumers"]
        STAMP[CendiaStampService]
        SCE[SelfContainedEvidenceService]
        AUTH[Auth Middleware]
        INF[InferenceService]
    end

    VS --> KMS
    KMS --> SIGN & ENC & JWT_K & API_K
    SIGN --> STAMP & SCE
    JWT_K --> AUTH
    API_K --> INF

    style VS fill:#7c3aed20,stroke:#7c3aed
    style KMS fill:#3b82f620,stroke:#3b82f6
```
