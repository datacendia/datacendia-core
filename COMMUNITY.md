# Datacendia Community vs Enterprise

Datacendia follows an **open-core model**. The Community Edition is free and open-source (Apache 2.0). Enterprise features require a paid license.

## Community Edition (Free, Apache 2.0)

Everything in this repository is Community Edition:

| Component | Description |
|-----------|-------------|
| `backend/src/services/council/` | **Council Engine** — multi-agent deliberation, the heart of the platform |
| `backend/src/services/core/` | Core platform services (event bus, decision lifecycle) |
| `backend/src/services/DecisionService.ts` | Decision CRUD and lifecycle management |
| `backend/src/services/DeliberationService.ts` | Deliberation orchestration |
| `backend/src/services/ollama.ts` | Local LLM inference via Ollama |
| `backend/src/routes/auth.ts` | Authentication (login, register, JWT) |
| `backend/src/routes/council.ts` | Council deliberation API |
| `backend/src/routes/decisions.ts` | Decision management API |
| `backend/prisma/schema.prisma` | Database schema |
| `src/pages/` | All frontend pages |
| `src/components/` | All UI components |
| `src/lib/` | API client, utilities |
| `docker-compose.yml` | Full development stack |

### What's Included Free

- The Council — multi-agent deliberation engine (5 agents)
- Immutable audit ledger with Merkle tree integrity
- Knowledge Graph explorer (Neo4j)
- 29 industry vertical frameworks
- Local LLM inference via Ollama
- PostgreSQL + Redis + Neo4j stack
- React 18 frontend
- REST API
- Docker Compose deployment
- Quick Brief and basic deliberation modes

## Enterprise Edition (Paid License)

Enterprise features are available in the [datacendia-components](https://github.com/datacendia/datacendia-components) repository (private) and require a Foundation ($499/mo), Enterprise ($1,499/mo), or Strategic (custom) license.

### Enterprise-Only Features

| Feature | Tier |
|---------|------|
| 15 C-Suite AI agents (full roster) | Foundation |
| 35+ deliberation modes | Foundation |
| DCII evidence infrastructure | Foundation |
| CendiaCrucible adversarial testing | Enterprise |
| 10 compliance frameworks | Enterprise |
| CendiaCourt dispute resolution | Enterprise |
| Sovereign/air-gap deployment patterns | Enterprise |
| 19 department AI co-pilots | Enterprise |
| SSO, CAC/PIV authentication | Enterprise |
| COLLAPSE simulation | Strategic |
| SGAS population modeling | Strategic |
| CendiaNation multi-agency coordination | Strategic |

## Contributing Guidelines

- Community contributions should target **community-edition code only** (this repository)
- Do not import enterprise-only modules in community code
- If unsure whether something is community or enterprise, open an issue and ask
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow

## License

- **Community Edition**: Apache 2.0 (see [LICENSE](LICENSE))
- **Enterprise Edition**: Commercial license — contact sales@datacendia.com
