# Changelog

All notable changes to Datacendia Core will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.4-alpha] - 2026-04-15

### Added

#### Global Privacy & Regulatory Compliance Sprint

- **`AIRegulatoryClassifier`** (`backend/src/services/compliance/AIRegulatoryClassifier.ts`) — Runtime AI use-case classifier covering Colorado SB 205, NYC Local Law 144, Illinois AIVIA, EU AI Act Annex III, GDPR Art. 22, and Germany BDSG §26. Detects consequential domains (EMPLOYMENT, HEALTHCARE, FINANCIAL, LEGAL, EDUCATION, etc.), AEDT status, video-consent requirements, EU prohibited practices, and GDPR Art. 22 automated decision flags. Singleton exported as `aiRegulatoryClassifier`.

- **`IncidentMaterialityService`** (`backend/src/services/compliance/IncidentMaterialityService.ts`) — Multi-framework breach notification planning service. Assesses incidents against 14 regulatory frameworks and generates a prioritised notification plan with deadlines, draft notices, and regulator contacts. Frameworks: SEC Form 8-K (4 business days), NYDFS 500 (72h), FTC HBNR 2024 (60 days), GDPR Art. 33 (72h), UK GDPR (72h), HIPAA (60 days), CCPA (45 days), Japan APPI (3–5 days), Singapore PDPA (3 days), Australia NDB (72h), NZ Privacy Act (72h), Nigeria NDPA (72h), South Korea PIPA (72h), Brazil LGPD (72h).

- **`aiRegulatoryMiddleware`** (`backend/src/middleware/aiRegulatoryMiddleware.ts`) — Applied to all AI inference routes (`/api/v1/council`, `/api/v1/deliberations`, `/api/v1/inference`, `/api/v1/platform-assistant`). Hard-blocks IL AIVIA requests missing `illinoisAIVIAConsent` (HTTP 451). Hard-blocks EU AI Act Art. 5 prohibited practices (HTTP 451). Attaches `X-AI-Regulatory-Risk`, `X-AI-Consequential-Domain`, and `X-NYC-LL144-Warning` headers. Logs CRITICAL/HIGH classifications to audit trail.

- **`phiEnforcementMiddleware`** (`backend/src/middleware/phiEnforcementMiddleware.ts`) — Enforces HIPAA §164.502 + FTC HBNR 2024 PHI before AI rule. Applied after `aiRegulatoryMiddleware` on all AI routes. Blocks health-domain AI requests (HTTP 451) unless: `X-PHI-Deidentified: true` header is present, or the org has `hipaaBAASigned: true` in preferences. Includes keyword scanner for 30+ health terms as secondary trigger. Logs all blocked and allowed health-domain requests to audit trail.

- **Privacy API endpoints** (`backend/src/routes/privacy.ts`):
  - `POST /api/v1/privacy/appeal-ai-decision` — CO SB 205 §6-1-1703 / VA CDPA human review appeal with 45-day SLA
  - `GET /api/v1/privacy/aedt-disclosure` — NYC LL 144 machine-readable AEDT disclosure notice
  - `GET /api/v1/privacy/org-export` — EU Data Act Art. 23 full org export (users, deliberations, agent configs) for cloud switching portability
  - `POST /api/v1/privacy/ai-impact-assessment` — CO SB 205 §6-1-1702 / EU AI Act Art. 9 annual AI impact assessment generator
  - `POST /api/v1/privacy/classify-ai-use-case` — Developer tool: full `AIRegulatoryClassifier` output for any described use case
  - `POST /api/v1/privacy/ccpa/limit-sensitive` — CPRA §1798.121 right to limit use and disclosure of sensitive personal information
  - `POST /api/v1/privacy/wa-mhmda-consent` — Washington My Health MY Data Act (RCW 70.02) consumer health data consent flag
  - `GET /api/v1/privacy/ccpa/status` — Updated to include all CPRA rights including limit-sensitive PI

- **`public/.well-known/security.txt`** — NYDFS 23 NYCRR §500.20 vulnerability disclosure file with contact, acknowledgements, policy URL, and expiration.

- **Compliance documentation** (`docs/compliance/`):
  - `state-ai-laws-implementation.md` — CO SB 205, NYC LL 144, IL AIVIA full implementation guide with API templates
  - `nydfs-sec-compliance.md` — NYDFS 500 vendor addendum template + SEC Form 8-K Item 1.05 draft
  - `cmmc-ftc-hbnr.md` — CMMC 2.0 gap assessment (72%, 110 controls) + FTC HBNR 2024 compliance guide
  - `eu-data-act-ai-liability.md` — EU Data Act Art. 23 portability obligations + AI Liability Directive preview
  - `germany-bdsg-france-cnil.md` — BDSG §26 works council agreement template + CNIL AI guidance
  - `asia-pacific-supplement-2.md` — Vietnam PDPD, Philippines DPA, Taiwan PDPA, Hong Kong PDPO, Malaysia PDPA
  - `nigeria-ndpa.md` — Nigeria NDPA 2023 + DPCO registration + Africa regulatory overview
  - `cis-controls-v8.md` — Full IG1+IG2 mapping (57% compliant), quick-win gap remediation plan
  - `mitre-attack-mapping.md` — ATT&CK v15 79% tactic coverage + ATLAS AI threat framework + Navigator JSON
  - `emerging-regulations-watchlist.md` — 15-item watch list (Canada CPPA, Brazil AI Bill, India DPDP, Australia Privacy Act reform, etc.)
  - `MASTER-COMPLIANCE-TRACKER.md` — Comprehensive 10-section tracker covering 50+ regulatory obligations with status, owner, and target dates

- **ISO 27017/27018 documentation** (`docs/iso27017/cloud-security-controls.md`) — 7 CLD controls mapping (ISO 27017) + A.1–A.8 PII processor controls (ISO 27018) with shared responsibility matrix

- **Legal document templates** (`docs/legal/`):
  - `dpia-template.md` — GDPR Art. 35 / Quebec Law 25 DPIA — 7-part template with pre-filled Datacendia technical measures
  - `quebec-pia-template.md` — Quebec Law 25 §3.3 PIA — 10-section template including cross-border transfer assessment and CAI contacts
  - `ropa-record-of-processing-activities.md` — GDPR Art. 30 ROPA — 4 Controller activities, 3 Processor activities, sub-processor register

- **ISO 27001 operational templates** (`docs/iso27001/`):
  - `management-review-template.md` — ISO 27001 Clause 9.3 / SOC 2 CC1.2 management review minutes form
  - `employee-security-training-record.md` — ISO 27001 §7.2 / NYDFS 500 §500.14 training register + phishing simulation log

- **Incident Response Policy v2.0** (`docs/policies/incident-response-policy.md`) — Added 13-jurisdiction regulatory notification matrix (GDPR, UK GDPR, HIPAA, FTC HBNR, CCPA, SEC, Japan APPI, Singapore PDPA, Australia NDB, Nigeria NDPA, Philippines DPA, South Africa POPIA, Brazil LGPD) with regulator contacts, escalation deadlines, and FTC HBNR-specific section.

- **NIST AI RMF profile updated** (`docs/nist-ai-rmf/ai-rmf-profile.md`) — MAP 1.3, MEASURE 2.8, GOVERN 1.7 marked complete; overall alignment updated to 68%.

### Changed

- **`backend/src/index.ts`** — Wired `aiRegulatoryMiddleware` on `/api/v1/council`, `/api/v1/deliberations`, `/api/v1/inference`, `/api/v1/platform-assistant`. Wired `phiEnforcementMiddleware` after `aiRegulatoryMiddleware` on same routes.
- **`backend/src/security/audit.service.ts`** — Added event types: `ai.inference`, `ai.regulatory_blocked`, `ai.regulatory_classified`, `ai.prohibited_practice_blocked`, `security.threat_detected`, `security.breach_detected`, `security.incident_created`. Added `error` severity level.
- **CCPA status endpoint** — Updated `GET /api/v1/privacy/ccpa/status` to enumerate CPRA right to limit sensitive PI.

### Fixed

- Removed unused `NextFunction` import from `backend/src/routes/privacy.ts`.

---

## [0.2.3-alpha] - 2026-03-14

### Added
- **ServiceInfoDropdown Component** -- Reusable collapsible dropdown showing "What it is", "What it does", and "How to use" (step-by-step) for every service page. Centralized config in `src/config/serviceInfo.ts` with 22 service definitions
- **Service Info on 19 Pages** -- Added ServiceInfoDropdown to: Council, Replay, Gateway, DCII (Memory, Notary, Truth, Witness, Similarity, Timestamp), GapScanner, Escrow, Compliance Monitor, CendiaLens, DecisionPackets, ConstitutionalCourt, Echo, Gnosis, RedTeam, CendiaPulse
- **Decision Replay Theater Sidebar Entry** -- Added CendiaReplay™ to Foundation tier navigation in CortexLayout

### Changed
- **COSS Tier Gating** -- Datacendia Core now correctly represents the **Foundation tier** only. Enterprise and Strategic tier features (Comply, Gap Scan, Escrow, Govern, Sovereign, Operate, Crown Jewels, COLLAPSE, SGAS, Verticals, Frontier) are gated behind an upgrade page. The full platform is available in `datacendia-components`
- **UpgradePage Redesign** -- Rebuilt the enterprise upgrade page with tier-aware messaging (detects which feature the user tried to access), dual-column Enterprise/Strategic feature lists, Foundation tier summary, and on-brand dark theme with Tailwind + Lucide icons
- **Sidebar Lock Icons** -- Enterprise and Strategic tier sidebar items now show dimmed text with a lock icon, all pointing to `/cortex/upgrade`. Foundation items remain fully accessible
- **Route Gating** -- All Enterprise+Strategic routes (`/cortex/compliance/*`, `/cortex/crypto/escrow`, `/cortex/governance/*`, `/cortex/crown/*`, `/cortex/monitor/live`, `/cortex/sovereign/*`) now render the UpgradePage instead of actual components
- **CendiaReplay™ Branding** -- Replaced purple/pink gradient theme with dark emerald/zinc theme to match platform design language across all UI elements (header, agent avatars, progress bars, playback controls, timeline)
- **Demo Session Handling** -- Added `isDemoSession()`/`setDemoSession()` to TokenManager, skip hard `/login` redirect for demo sessions in API client, skip `/auth/me` backend validation for demo sessions in AuthContext, persist demo user to localStorage
- **Documentation Overhaul** -- Updated README, ARCHITECTURE, COMMUNITY, CROSS-REPO-ARCHITECTURE, MATURITY-TAXONOMY, and CONTRIBUTING to reflect Foundation-only core with correct tier boundaries

### Fixed
- **Demo Redirect Loop** -- Demo users were being redirected to `/login` after page refresh because client-generated tokens failed backend validation. Fixed by flagging demo sessions in localStorage and bypassing backend token verification

## [0.2.2-alpha] - 2026-03-13

### Added
- **CendiaVerify™ Public Verification Portal** -- `/verify` route (no auth required) for third-party cryptographic receipt verification with step-by-step validation UI and CLI instructions
- **CendiaEvidence™ Evidence Package Download** -- Reusable component for downloading evidence packages in ZIP, standalone HTML verifier, or raw JSON formats with client-side fallback generation
- **CendiaGapScan™ Compliance Gap Scanner** -- `/cortex/compliance/gap-scanner` dashboard analyzing compliance gaps across EU AI Act, NIST AI RMF, ISO 42001, GDPR, HIPAA, SOX, SR 11-7, and Basel III/IV frameworks
- **CendiaStamp™ Cryptographic Seal** -- SVG seal renderer fetching from backend API with client-side fallback showing receipt hash, verification date, and dual-signature badge
- **CendiaPrecedent™ Similar Decisions Panel** -- TF-IDF precedent matching panel showing similarity scores, outcomes, key differences, and cross-deliberation insights
- **CendiaRedTeam™ Red Team Report Panel** -- 6-vector adversarial analysis report (prompt injection, data poisoning, model extraction, membership inference, evasion attacks, supply chain) with gate decision and risk scoring
- **CendiaEscrow™ Shamir Share Management** -- `/cortex/crypto/escrow` page for Shamir Secret Sharing (3-of-5 threshold), VDF time-locks, shareholder management, and share submission workflow
- **Sidebar Navigation** -- Added Gap Scan and Escrow to Enterprise tier navigation in CortexLayout

### Changed
- **RegulatorsReceiptPage** -- Integrated EvidencePackageDownload and CendiaStampSeal components into the receipt view
- **PostDeliberationPanel** -- Integrated RedTeamReportPanel and SimilarDecisionsPanel after formal dissents section
- **CendiaReplay™** -- Confirmed existing 611-line Decision Replay Theater implementation is complete (no changes needed)

## [0.2.1-alpha] - 2026-03-12

### Added
- **CRO Landing Page Overhaul** -- Weaponized hero headline ("Cryptographic Proof for Every AI Decision"), Regulator's Receipt artifact in hero, dual-funnel CTAs (Request Architecture Review + View GitHub Repo), trust bar (NVIDIA Inception, EU AI Act, NIST AI RMF, ISO 42001, DDGI), Kill Room 4-stage banking-style decision architecture diagram, COSS pricing anchor (Community vs Enterprise Edition)
- **Together AI Provider** -- BYO-Key cloud inference via OpenAI-compatible API (`TOGETHER_API_KEY`)
- **Anthropic Claude Provider** -- BYO-Key cloud inference via Messages API (`ANTHROPIC_API_KEY`)
- **Google Gemini Provider** -- BYO-Key cloud inference via Generative Language API (`GEMINI_API_KEY`)
- **Ed25519 Cryptographic Signing** -- Replaced RSA-SHA256 with Ed25519 in TestEvidenceLedgerService, SignedTestReportService, and EvidenceExportService

### Changed
- **SEO/GEO Updates** -- Updated title, meta description, OG tags, Twitter cards, JSON-LD schemas (Organization, SoftwareApplication, FAQPage, WebSite) to match CRO messaging and COSS dual-edition model
- **SGO Updates** -- Updated llms.txt, ai-plugin.json with DDGI standard and COSS positioning; expanded sitemap.xml with pricing, contact, docs, legal pages
- **Inference Service** -- Extended provider switch to support `together`, `anthropic`, `gemini`, `openai` with failover to Ollama
- **i18n** -- Propagated CRO landing page translations to all 26 locale files

## [0.2.0-alpha] - 2026-03-11

### Added
- **CendiaGateway™ AI Governance Proxy** -- 3-layer AI governance (API gateway, browser extensions, HTTP forward proxy) with PII detection, policy enforcement, and cryptographic audit trails
- **Federation Infrastructure** -- Multi-org governance with federation CRUD, member management, shared policies, consolidated compliance reporting, and risk scoring (12 new API endpoints)
- **Browser Extensions** -- Chrome/Edge/Brave/Arc (Manifest V3), Firefox (Manifest V2), Safari (Web Extension) for monitoring 15+ AI websites
- **HTTP Forward Proxy** -- Network-level AI traffic interception via PAC file for browser-agnostic coverage
- **Tenant Isolation Middleware** -- Cross-tenant access prevention with dedicated test suite
- **Auth Middleware Tests** -- Comprehensive authentication guard test coverage
- **Trust-Facts Pipeline** -- Automated `generate-trust-facts` script for verifiable repo metrics
- **Product Maturity Taxonomy** -- Cross-repo consistency documentation
- **Cross-Repo Architecture Map** -- `docs/CROSS-REPO-ARCHITECTURE.md` with quarterly review process
- **Q1 2026 Platform Audit Report** -- `docs/AUDIT-REPORT-2026-Q1.md` comprehensive security and quality audit
- **`as-any` Baseline Tracker** -- TypeScript `as any` cast tracking with reduction targets
- **Security workflow** -- `.github/workflows/security.yml` with dependency audit (`--audit-level=critical`), CodeQL SAST (JavaScript/TypeScript), and TruffleHog secret scanning
- **Dependabot** -- `.github/dependabot.yml` covering npm (root + backend), GitHub Actions, and Docker ecosystems with grouped updates
- **`postinstall` hook** -- `backend/package.json` now runs `prisma generate` automatically after `npm install`

### Changed
- **Security Hardening** -- SQL injection fixes, JWT refresh token hardening, logger migration (replaced all `console.*` with structured logger)
- **CI Pipeline** -- CodeQL v3→v4 upgrade, non-blocking dependency audit, non-blocking type-check/lint, JWT_REFRESH_SECRET in CI env
- **CI workflow rewrite** -- Added concurrency groups, `prisma generate` step, `--skipLibCheck`, community edition build job, infrastructure service tests, and a `ci-status` gate job
- **Build script** -- Backend `build` now runs `prisma generate && tsc` to ensure Prisma client is always fresh before compilation
- **ESLint** -- `no-console` upgraded to error, unscoped routes documented
- **Org Scoping** -- Route renaming for consistent organization-scoped endpoints

### Fixed
- **Session Security** -- Production session store warning, `saveUninitialized=false`
- **Auth Guard** -- License metadata correction, admin auth fixes
- **CircuitBreaker** -- Replaced console calls with structured logger
- **Copyright Headers** -- Updated 38 remaining proprietary headers to Apache 2.0

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

[0.2.4-alpha]: https://github.com/datacendia/datacendia-core/compare/v0.2.3-alpha...v0.2.4-alpha
[0.2.3-alpha]: https://github.com/datacendia/datacendia-core/compare/v0.2.2-alpha...v0.2.3-alpha
[0.2.2-alpha]: https://github.com/datacendia/datacendia-core/compare/v0.2.1-alpha...v0.2.2-alpha
[0.2.1-alpha]: https://github.com/datacendia/datacendia-core/compare/v0.2.0-alpha...v0.2.1-alpha
[0.2.0-alpha]: https://github.com/datacendia/datacendia-core/compare/v0.1.1...v0.2.0-alpha
[0.1.1]: https://github.com/datacendia/datacendia-core/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/datacendia/datacendia-core/releases/tag/v0.1.0
