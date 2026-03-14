# Datacendia Community vs Enterprise

Datacendia follows an **open-core model**. The Community Edition is free and open-source (Apache 2.0). Enterprise features require a paid license.

## Community Edition (Free, Apache 2.0)

Everything in this repository is Community Edition:

| Component | Description |
|-----------|-------------|
| `backend/src/services/council/` | **Council Engine** -- multi-agent deliberation, the heart of the platform |
| `backend/src/services/core/` | Core platform services (event bus, decision lifecycle) |
| `backend/src/services/DecisionService.ts` | Decision CRUD and lifecycle management |
| `backend/src/services/DeliberationService.ts` | Deliberation orchestration |
| `backend/src/services/ollama.ts` | Local LLM inference via Ollama |
| `backend/src/routes/auth.ts` | Authentication (login, register, JWT) |
| `backend/src/routes/council.ts` | Council deliberation API |
| `backend/src/routes/decisions.ts` | Decision management API |
| `backend/prisma/schema/` | Database schema (37 schema files, 260 models) |
| `src/pages/` | All frontend pages |
| `src/components/` | All UI components |
| `src/lib/` | API client, utilities |
| `docker-compose.yml` | Full development stack |

### What's Included Free (Foundation Tier)

- **The Council** -- Multi-agent deliberation engine (5 agents)
- **CendiaReplay™** -- Decision Replay Theater with full deliberation playback
- **DECIDE** -- CendiaChronos, PreMortem, Ghost Board, Decision Debt
- **DCII** -- Decision Crisis Immunization Infrastructure (Truth, Notary, Witness, Timestamp, Similarity, Memory)
- **CendiaGateway™** -- AI governance proxy with browser extensions (Chrome, Firefox, Safari)
- Immutable audit ledger with Merkle tree integrity
- Knowledge Graph explorer (Neo4j)
- 30 industry vertical frameworks
- Local LLM inference via Ollama
- PostgreSQL + Redis + Neo4j stack
- React 18 frontend with Tailwind CSS
- REST API backend
- Docker Compose deployment
- ServiceInfoDropdown guided onboarding on Foundation pages

## Enterprise Edition (Paid License)

Enterprise features are available in the [datacendia-components](https://github.com/datacendia/datacendia-components) repository (private) and require a Foundation ($499/mo), Enterprise ($1,499/mo), or Strategic (custom) license.

### Enterprise & Strategic Features (Paid)

The full platform (`datacendia-components`) includes everything in Foundation plus:

| Feature | Tier |
|---------|------|
| Stress-Test (adversarial red team) | Enterprise |
| Comply (continuous compliance monitoring) | Enterprise |
| Gap Scan (8-framework compliance analysis) | Enterprise |
| Escrow (Shamir SSS + VDF time-locks) | Enterprise |
| Govern (constitutional court, decision packets) | Enterprise |
| Sovereign (22 deployment patterns) | Enterprise |
| Operate (CendiaPulse live agent monitor) | Enterprise |
| Crown Jewels (Echo, Gnosis, RedTeam dashboards) | Enterprise |
| 15 C-Suite AI agents (full roster) | Enterprise |
| 35+ deliberation modes | Enterprise |
| SSO, CAC/PIV authentication | Enterprise |
| CendiaApotheosis self-improvement | Enterprise |
| OmniTranslate (100+ languages) | Enterprise |
| COLLAPSE orchestrator (19 adversarial agents) | Strategic |
| SGAS population modeling | Strategic |
| Full vertical packs (12+ agents/industry) | Strategic |
| Frontier (crisis bunker, nation-scale) | Strategic |
| Defense/Pharma/Government full packs | Strategic |
| Enterprise SLA & support | Strategic |

> **Note:** Enterprise and Strategic features appear in the Community Edition sidebar with a lock icon. Clicking them shows an upgrade page explaining the feature and how to get access.

## Contributing Guidelines

- Community contributions should target **community-edition code only** (this repository)
- Do not import enterprise-only modules in community code
- If unsure whether something is community or enterprise, open an issue and ask
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow

## License

- **Community Edition**: Apache 2.0 (see [LICENSE](LICENSE))
- **Enterprise Edition**: Commercial license -- contact sales@datacendia.com
