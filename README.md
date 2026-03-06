# Datacendia Core

<div align="center">

<img src="docs/Inception%20Badges/for-screen/nvidia-inception-program-badge-rgb-for-screen.svg" alt="NVIDIA Inception Program Member" height="60">

**The Defensible AI Platform -- open-source core, sovereign-first.**

Multi-agent deliberation &middot; Immutable audit trails &middot; 30 industry verticals &middot; Sovereign-first

[![CI](https://github.com/datacendia/datacendia-core/actions/workflows/ci.yml/badge.svg)](https://github.com/datacendia/datacendia-core/actions/workflows/ci.yml)
[![Security](https://github.com/datacendia/datacendia-core/actions/workflows/security.yml/badge.svg)](https://github.com/datacendia/datacendia-core/actions/workflows/security.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x+-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg?logo=react&logoColor=white)](https://react.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16+-4169E1.svg?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7+-DC382D.svg?logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Required-2496ED.svg?logo=docker&logoColor=white)](https://www.docker.com/)
[![NVIDIA Inception](https://img.shields.io/badge/NVIDIA-Inception%20Program-76b900.svg?logo=nvidia&logoColor=white)](https://www.nvidia.com/en-us/startups/)

[Getting Started](#getting-started) &middot; [Architecture](#architecture) &middot; [Verticals](#industry-verticals) &middot; [Infrastructure](#infrastructure-integrations) &middot; [Standards](#standards--governance) &middot; [Contributing](#contributing) &middot; [Enterprise Edition](#enterprise-edition)

</div>

---

## Requirements

| Requirement | Version | Required |
|-------------|---------|:--------:|
| **Node.js** | 20.x or later | Yes |
| **Docker** & Docker Compose | Latest | Yes |
| **PostgreSQL** | 16+ | Yes (via Docker) |
| **Redis** | 7+ | Yes (via Docker) |
| **Ollama** | Latest | Yes (or Triton/NIM) |
| **Neo4j** | 5+ | Optional (knowledge graph) |
| **NVIDIA GPU** | CUDA 12+ | Optional (RAPIDS, Triton, CC) |

> **Quickest path:** Install Node.js 20+, Docker, and Ollama. Everything else runs in Docker containers.

---

## What is Datacendia?

Datacendia is the only AI platform where every decision is auditable, explainable, and court-admissible. Multiple AI agents with distinct perspectives deliberate on your behalf -- then every decision is recorded in an immutable, auditable ledger.

**This is not another chatbot.** It's an operating system for enterprise decisions.

```
+-----------------------------------------------------------+
|                    YOUR DECISION                          |
|                                                           |
|    +----------+  +----------+  +----------+              |
|    | Financial|  | Legal    |  | Risk     |  ...agents   |
|    | Analyst  |  | Counsel  |  | Assessor |              |
|    +----+-----+  +----+-----+  +----+-----+              |
|         |             |             |                     |
|         +--------+----+-------------+                     |
|                  |                                        |
|         +--------v---------+                              |
|         |  THE COUNCIL     |  <- Multi-agent consensus    |
|         |  Deliberation    |                              |
|         +--------+---------+                              |
|                  |                                        |
|         +--------v---------+                              |
|         | DECISION PACKET  |  <- Signed, Merkle-rooted   |
|         | + Audit Trail    |     Court-admissible        |
|         +------------------+                              |
+-----------------------------------------------------------+
```

### See It in Action

<div align="center">

<img src="docs/screenshots/council-deliberation.png" alt="Datacendia Council Deliberation -- five demo decisions loaded" width="900">

*The Council deliberation dashboard with five pre-seeded decisions -- `docker compose -f docker-compose.demo.yml up -d`*

</div>

### Key Capabilities

- **The Council** -- Multi-agent deliberation with configurable agent panels (financial, legal, ethical, adversarial, domain-specific)
- **Immutable Audit Ledger** -- Every decision cryptographically signed with Merkle tree integrity
- **30 Industry Verticals** -- Financial, Healthcare, Legal, Defense, Insurance, Energy, Government, Manufacturing, Pharmaceutical, Sports, and 19 more
- **Sovereign-First** -- Runs fully air-gapped. No cloud dependency. Your data stays yours.
- **LLM-Agnostic** -- Works with Ollama, NVIDIA Triton, NVIDIA NIM, or any OpenAI-compatible API
- **Enterprise Infrastructure** -- Kafka event streaming, Temporal workflows, OPA policies, OpenBao secrets, NeMo Guardrails, RAPIDS GPU analytics, Flink CEP

---

## Getting Started

### Prerequisites

- **Node.js** 20.x+
- **Docker** & Docker Compose
- **Ollama** (or any supported LLM provider)

### Quick Start (5 minutes)

```bash
# Clone
git clone https://github.com/datacendia/datacendia-core.git
cd datacendia-core

# Copy environment config
cp backend/.env.example backend/.env

# Start infrastructure
docker compose -f docker-compose.dev.yml up -d

# Install dependencies (Prisma client auto-generates via postinstall)
npm install
cd backend && npm install && cd ..

# Run database migrations
cd backend && npx prisma migrate deploy && cd ..

# Start the platform
npm run dev              # Frontend: http://localhost:5173
cd backend && npm run dev # Backend:  http://localhost:3001
```

### Demo Mode (Docker, zero setup)

```bash
docker compose -f docker-compose.demo.yml up -d
# Open http://localhost:5173
```

---

## Architecture

```
datacendia-core/
|-- src/                          # React frontend (Vite + TypeScript + Tailwind)
|   |-- components/               # Reusable UI components
|   |-- pages/                    # Page components
|   +-- services/                 # Frontend API clients
|-- backend/                      # Node.js backend (Express + Prisma)
|   |-- src/
|   |   |-- services/
|   |   |   |-- council/          # Council deliberation engine
|   |   |   |-- inference/        # LLM provider abstraction (Ollama/Triton/NIM)
|   |   |   |-- guardrails/       # NeMo Guardrails engine
|   |   |   |-- kafka/            # Apache Kafka event streaming
|   |   |   |-- temporal/         # Temporal.io workflow orchestration
|   |   |   |-- opa/              # Open Policy Agent
|   |   |   |-- vault/            # OpenBao/Vault secrets management
|   |   |   |-- gpu/              # RAPIDS analytics + Confidential Computing
|   |   |   |-- streaming/        # Flink CEP real-time processing
|   |   |   +-- verticals/        # Industry vertical modules
|   |   |-- routes/               # API route files (domain-grouped)
|   |   |-- security/             # Casbin RBAC, Keycloak SSO
|   |   +-- middleware/           # Auth, rate limiting, security
|   +-- prisma/                   # Database schema and models
+-- docker-compose.dev.yml        # Development infrastructure
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | PostgreSQL 16 + Prisma ORM |
| **Cache** | Redis 7 |
| **Graph** | Neo4j 5 |
| **Vector** | Qdrant |
| **LLM** | Ollama / NVIDIA Triton / NVIDIA NIM |
| **Events** | Apache Kafka (opt-in) |
| **Workflows** | Temporal.io (opt-in) |
| **Policy** | OPA + Casbin |
| **Secrets** | OpenBao/Vault (opt-in) |
| **Guardrails** | NeMo Guardrails (opt-in) |
| **Analytics** | NVIDIA RAPIDS / cuGraph (opt-in) |

---

## Industry Verticals

Datacendia ships with **30 industry vertical definitions**. Each vertical provides domain-specific agents, compliance frameworks, decision schemas, and knowledge bases.

| Vertical | Compliance Frameworks | Status |
|----------|----------------------|:------:|
| **Financial Services** | Basel III, MiFID II, SOX, GLBA, DORA | 100% |
| **Healthcare** | HIPAA, FDA SaMD, HITRUST, JCAHO | 100% |
| **Legal** | ABA Ethics, privilege gates, citation enforcement | 100% |
| **Insurance** | NAIC, Solvency II, bias/fairness engine | 100% |
| **Government** | FAR, FISMA, GPRA, FedRAMP architecture | 100% |
| **Energy** | NERC CIP, IEC 62443, FERC | 100% |
| **Manufacturing** | ISO 9001, IATF 16949, OSHA | 100% |
| **Defense** | CMMC, NIST 800-171, ITAR architecture | 100% |
| **EU Banking** | Basel III CRR/CRD, EU AI Act | 100% |
| **Sports** | FIFA Agent Regs, UEFA FFP, Premier League PSR | 100% |
| + 19 more | Education, Pharma, Retail, Real Estate, etc. | Framework |

---

## Infrastructure Integrations

All infrastructure components are **opt-in** -- disabled by default, zero impact when off. Every component has an **embedded fallback** for air-gapped deployment.

| Component | Purpose | Activation |
|-----------|---------|-----------|
| **Apache Kafka** | Durable event streaming | `KAFKA_ENABLED=true` |
| **Temporal.io** | Durable workflow orchestration | `TEMPORAL_ENABLED=true` |
| **OPA** | Data-driven policy-as-code | `OPA_ENABLED=true` |
| **OpenBao/Vault** | Secrets management, PKI, transit encryption | `OPENBAO_ENABLED=true` |
| **NeMo Guardrails** | LLM input/output rail evaluation | `NEMO_GUARDRAILS_ENABLED=true` |
| **NVIDIA RAPIDS** | GPU-accelerated bias analysis & graph analytics | `RAPIDS_ENABLED=true` |
| **Confidential Computing** | GPU attestation, data-in-use protection | `CC_ENABLED=true` |
| **Apache Flink CEP** | Real-time complex event processing | `FLINK_ENABLED=true` |

---

## Security

- **Sovereign-first** -- Runs fully on-premise, air-gapped capable
- **Casbin RBAC/ABAC** -- Role and attribute-based access control
- **OPA Policies** -- GDPR, HIPAA, SOX, EU AI Act enforcement
- **Immutable Audit Ledger** -- Merkle tree integrity, cryptographic signatures
- **Post-Quantum KMS** -- Dilithium, SPHINCS+ support
- **Confidential Computing** -- NVIDIA H100/H200 GPU attestation

---

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
npm test

# Type checking
npx tsc --noEmit --skipLibCheck          # Frontend
cd backend && npx tsc --noEmit --skipLibCheck  # Backend
```

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

**Quick rules:**
- PRs to any code in this repo are welcome
- Follow [Conventional Commits](https://www.conventionalcommits.org/)
- Add tests for new functionality
- Run `npx tsc --noEmit` before submitting

See [COMMUNITY.md](COMMUNITY.md) for the full open-source boundary definition.

---

## Enterprise Edition

**Datacendia Enterprise** adds premium capabilities for regulated industries:

| Feature | Community | Enterprise |
|---------|:---------:|:----------:|
| Council Engine | Yes | Yes |
| Immutable Audit Ledger | Yes | Yes |
| 29 Vertical Frameworks | Yes | Yes |
| Infrastructure (Kafka, Temporal, etc.) | Yes | Yes |
| Full Vertical Packs (12+ agents/industry) | -- | Yes |
| 22 Sovereign Architecture Patterns | -- | Yes |
| DCII (9 Decision Primitives) | -- | Yes |
| Collapse Orchestrator (19 adversarial agents) | -- | Yes |
| CendiaApotheosis Self-Improvement | -- | Yes |
| OmniTranslate (100+ languages) | -- | Yes |
| Defense/Pharma/Government Full Packs | -- | Yes |
| Enterprise SLA & Support | -- | Yes |

**Contact:** [enterprise@datacendia.com](mailto:enterprise@datacendia.com) &middot; [datacendia.com](https://datacendia.com)

---

## Standards & Governance

Datacendia implements the **Datacendia Decision Governance Infrastructure (DDGI)** -- a vendor-neutral framework for treating institutional decisions as auditable lifecycle artifacts.

| Resource | Description |
|----------|-------------|
| [DDGI Framework](https://github.com/datacendia/decision-governance-infrastructure) | Vendor-neutral governance specification (CC BY 4.0) |
| [DCII White Paper](https://github.com/datacendia/decision-governance-infrastructure/blob/main/docs/DCII_Framework_v2.1.md) | Reference implementation specification |
| [API Specification](https://github.com/datacendia/decision-governance-infrastructure/blob/main/api/api-spec.yaml) | OpenAPI 3.0 (59 endpoints) |
| [Compliance Mapping](https://github.com/datacendia/decision-governance-infrastructure/blob/main/docs/compliance-mapping.md) | Regulation-to-primitive matrix |

DDGI is being prepared for submission to **ISO/IEC JTC 1/SC 42** (Artificial Intelligence) as a New Work Item Proposal. See [standards body engagement](https://github.com/datacendia/decision-governance-infrastructure/blob/main/docs/standards-body-engagement.md) for details.

---

## License

Apache License 2.0 -- See [LICENSE](LICENSE) for details.

Copyright 2024-2026 Datacendia, LLC

---

<div align="center">

Built by [Datacendia](https://datacendia.com) &middot; [DDGI Framework](https://github.com/datacendia/decision-governance-infrastructure) &middot; NVIDIA Inception Program Member

*Last updated: March 2, 2026*

</div>
