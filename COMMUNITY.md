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

### What's Included Free

- The Council -- multi-agent deliberation engine (5 agents)
- Immutable audit ledger with Merkle tree integrity
- Knowledge Graph explorer (Neo4j)
- 30 industry vertical frameworks
- Local LLM inference via Ollama
- PostgreSQL + Redis + Neo4j stack
- React 18 frontend (175 pages, 91 components)
- REST API (158 route files, 356 services)
- Docker Compose deployment
- Quick Brief and basic deliberation modes
- **CendiaGateway™** -- AI governance proxy with browser extensions
- **19 Service Dashboards** with guided onboarding (ServiceInfoDropdown):
  - Cryptographic: Verify, Evidence, GapScan, Stamp, Precedent, RedTeam, Escrow, Replay
  - Crown Jewels: Echo, Gnosis, RedTeam, Pulse, Lens, Chronos, Compliance, Court
  - DCII: Memory, Notary, Truth, Witness, Similarity, Timestamp

## Enterprise Edition (Paid License)

Enterprise features are available in the [datacendia-components](https://github.com/datacendia/datacendia-components) repository (private) and require a Foundation ($499/mo), Enterprise ($1,499/mo), or Strategic (custom) license.

### Enterprise-Only Features

Enterprise features live in the private `datacendia-components` repository and extend the community edition:

| Feature | Tier |
|---------|------|
| 15 C-Suite AI agents (full roster) | Foundation |
| 35+ deliberation modes | Foundation |
| DCII scoring engine (IISS computation) | Foundation |
| CendiaCrucible adversarial testing | Enterprise |
| 22 Sovereign architecture patterns | Enterprise |
| 19 department AI co-pilots | Enterprise |
| SSO, CAC/PIV authentication | Enterprise |
| CendiaApotheosis self-improvement | Enterprise |
| OmniTranslate (100+ languages) | Enterprise |
| COLLAPSE orchestrator (19 adversarial agents) | Strategic |
| SGAS population modeling | Strategic |
| CendiaNation multi-agency coordination | Strategic |
| Full vertical packs (12+ agents/industry) | Strategic |
| Defense/Pharma/Government full packs | Strategic |
| Enterprise SLA & support | Strategic |

> **Note:** Many features that were previously enterprise-only (DCII service UIs, Crown Jewels dashboards, CendiaCourt, continuous compliance monitoring) are now included in the community edition as of v0.2.3. The enterprise edition focuses on sovereign deployment patterns, full agent rosters, advanced orchestration, and premium support.

## Contributing Guidelines

- Community contributions should target **community-edition code only** (this repository)
- Do not import enterprise-only modules in community code
- If unsure whether something is community or enterprise, open an issue and ask
- See [CONTRIBUTING.md](CONTRIBUTING.md) for development workflow

## License

- **Community Edition**: Apache 2.0 (see [LICENSE](LICENSE))
- **Enterprise Edition**: Commercial license -- contact sales@datacendia.com
