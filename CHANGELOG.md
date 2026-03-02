# Changelog

All notable changes to Datacendia Core will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.2] - 2026-03-02

### Added
- **Security workflow** -- `.github/workflows/security.yml` with dependency audit (`--audit-level=critical`), CodeQL SAST (JavaScript/TypeScript), and TruffleHog secret scanning
- **Dependabot** -- `.github/dependabot.yml` covering npm (root + backend), GitHub Actions, and Docker ecosystems with grouped updates
- **`postinstall` hook** -- `backend/package.json` now runs `prisma generate` automatically after `npm install`

### Changed
- **CI workflow rewrite** -- Added concurrency groups, `prisma generate` step, `--skipLibCheck`, community edition build job, infrastructure service tests, and a `ci-status` gate job
- **Build script** -- Backend `build` now runs `prisma generate && tsc` to ensure Prisma client is always fresh before compilation

## [0.1.1] - 2026-03-02

### Added
- **ARCHITECTURE.md** -- Full system architecture overview for contributors
- **CODEOWNERS** -- Team-based code ownership for PR reviews
- **Issue templates** -- Bug report and feature request templates
- **PR template** -- Standardized pull request checklist
- **.editorconfig** -- charset=utf-8 enforcement to prevent encoding issues
- **UpgradePage** -- Clean redirect for enterprise features in community edition
- **Docker build workflow** -- `.github/workflows/docker.yml` for Docker Hub image publishing on release
- **Standards & Governance section** in README linking to DDGI framework repo

### Changed
- **CI workflow** -- Enhanced with Postgres 16 + Redis 7 Docker services for backend integration tests, added validate-counts job
- **Copyright headers** -- Replaced "Proprietary and confidential" with "Licensed under Apache 2.0" across 913 source files
- **JSDoc documentation** -- Added module-level JSDoc headers to all 932 source files
- **CONTRIBUTING.md** -- Added community/enterprise boundary guidance with safe directories list
- **README** -- Added CI badge, Standards section, navigation link, updated counts
- **CHANGELOG** -- Updated counts to match actual repo (30 verticals, 156 routes, 210 pages)

### Removed
- **Enterprise leaks** -- Removed 29 enterprise page components, 5 enterprise services, enterprise routes from community edition
- **Enterprise test suite** -- Removed `tests/enterprise/` directory (7 files referencing enterprise-only APIs)
- **Stryker mutation script** -- Removed broken `test:mutation` npm script (no config existed)
- **`private: true`** -- Removed from package.json to enable npm publish

### Fixed
- **Encoding** -- Rewrote 6 markdown files to fix double-encoded UTF-8 corruption
- **NVIDIA badge** -- Added badge assets and URL-encoded image path
- **Navigation links** -- Fixed 5 broken anchor links with stale emoji prefixes
- **Package name** -- Changed from `datacendia-components` to `datacendia-core`
- **Broken npm scripts** -- Added missing files referenced by 6 npm scripts

## [0.1.0] - 2026-03-01

### Added
- **The Council** -- Multi-agent deliberation engine with 5 AI agents
- **Immutable Audit Ledger** -- Merkle tree integrity for all decisions
- **Knowledge Graph** -- Neo4j-powered entity and relationship explorer
- **30 Industry Verticals** -- Legal, Healthcare, Financial, Government, Defense, Sports, and more
- **Local LLM Inference** -- Ollama integration for sovereign AI
- **Authentication** -- Login, register, forgot password, find account, JWT tokens
- **Gold Sovereign UI** -- Premium dark theme with gold accents across all auth pages
- **Docker Compose** -- Development, demo, and production configurations
- **Kubernetes** -- Helm chart and k8s manifests for cluster deployment
- **Docker Hub Images** -- `datacendia/datacendia-api` and `datacendia/datacendia-frontend`
- **11 War Game Scenarios** -- SVB, Boeing 737 MAX, Wirecard, Theranos, Everton PSR, NHS maternity
- **DCII Framework** -- Decision Crisis Immunization Infrastructure with 9 primitives
- **DDGI Framework** -- Datacendia Decision Governance Infrastructure (vendor-neutral standard)
- **PostgreSQL + Redis + Neo4j** -- Full data stack with Prisma ORM
- **React 18 Frontend** -- 210 pages, TypeScript, TailwindCSS
- **REST API** -- 156 route files, Express, Zod validation
- **NVIDIA Inception** -- Program member

### Infrastructure
- PostgreSQL 16 with Prisma (260 models)
- Redis 7 for caching and real-time pub/sub
- Neo4j 5 for knowledge graph
- Ollama for local LLM inference
- Docker Compose (dev, demo, production)
- Helm chart for Kubernetes
- Nginx reverse proxy configs
- GitHub Actions CI/CD

[0.1.2]: https://github.com/datacendia/datacendia-core/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/datacendia/datacendia-core/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/datacendia/datacendia-core/releases/tag/v0.1.0
