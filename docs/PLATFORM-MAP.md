# Datacendia Core — Platform Map

> **Community Edition (Apache 2.0)**
> Last updated: March 2026

This document lists every routable page in `datacendia-core`. Enterprise/Strategic features show the **UpgradePage** in this edition — the full implementations exist in `datacendia-components`.

---

## Public Pages (no auth required)

| Route | Page | Notes |
|-------|------|-------|
| `/` | SovereignLandingPage | Primary marketing homepage |
| `/home` | SovereignLandingPage | Alias |
| `/old-home` | LandingPage | Legacy marketing page |
| `/legacy-home` | HomePage | Legacy light-theme homepage |
| `/pricing` | PricingPage | Tier pricing |
| `/demo` | DemoRequestPage | Demo request form |
| `/product` | ProductPage | Product overview |
| `/about` | AboutPage | Company info / manifesto |
| `/contact` | ContactPage | Contact form |
| `/manifesto` | ManifestoHomePage | "Why we built this" |
| `/believe` | ManifestoHomePage | Alias |
| `/why` | ManifestoHomePage | Alias |
| `/downloads` | DownloadsPage | Desktop/mobile downloads |
| `/license` | LicensePage | Licensing info |
| `/services` | ServicesPage | Professional services |
| `/packages` | PackagesPage | Solution packages |
| `/sovereign` | SovereignEnterpriseIntelligencePage | SEI category page |
| `/honesty` | HonestyMatricesPage | Transparency matrices |
| `/showcases` | ShowcasesPage | Customer showcases |
| `/privacy` | PrivacyPolicyPage | Privacy policy |
| `/terms` | TermsPage | Terms of service |
| `/security` | SecurityPage | Security overview (public) |
| `/cookies` | CookiePolicyPage | Cookie policy |
| `/docs` | DocsPage | Documentation |
| `/blog` | BlogPage | Blog |
| `/changelog` | ChangelogPage | Release notes |
| `/support` | SupportPage | Support portal |
| `/integrations` | IntegrationsPage | Integration catalog |
| `/verify` | VerifyPage | CendiaVerify public portal |
| `/pitch` | PitchDeck | Investor pitch deck |

## Public Demos (no auth)

| Route | Page |
|-------|------|
| `/cortex/trust/regulators-receipt` | RegulatorsReceiptPage |
| `/cortex/workflows/legal` | LegalWorkflowPage |

## Apex Package (public)

| Route | Page |
|-------|------|
| `/apex/forecast` | CendiaForecastPage |
| `/apex/sentry` | CendiaSentryPage |

---

## Auth Pages

| Route | Page |
|-------|------|
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/reset-password` | ResetPasswordPage |
| `/verify-email` | VerifyEmailPage |
| `/find-account` | FindAccountPage |
| `/onboarding` | OnboardingWizard |

---

## Cortex Application (`/cortex/...`)

### Dashboard
| Route | Page |
|-------|------|
| `/cortex` | DashboardPage |
| `/cortex/dashboard` | DashboardPage |

### Council (13 pages)
| Route | Page |
|-------|------|
| `/cortex/council` | CouncilPage |
| `/cortex/council/deliberation/:id` | DeliberationViewPage |
| `/cortex/council/agent/:id` | AgentProfilePage |
| `/cortex/decisions` | DecisionsPage |
| `/cortex/council/visualization` | DeliberationVisualizationPage |
| `/cortex/council/replay-theater` | DecisionReplayTheaterPage |
| `/cortex/council/modes` | CouncilModesPage |
| `/cortex/council/post-deliberation/:id?` | PostDeliberationPanel |
| `/cortex/council/intervene/:id?` | UserInterventionPanel |
| `/cortex/council/executive-summary` | ExecutiveSummaryPage |
| `/cortex/council/history` | CouncilHistoryPage |
| `/cortex/council/analytics` | CouncilAnalyticsPage |

### DCII — Decision Crisis Immunization Infrastructure (7 pages)
| Route | Page |
|-------|------|
| `/cortex/dcii` | TruthPage |
| `/cortex/dcii/truth` | TruthPage |
| `/cortex/dcii/notary` | NotaryPage |
| `/cortex/dcii/witness` | WitnessPage |
| `/cortex/dcii/timestamp` | TimestampPage |
| `/cortex/dcii/similarity` | SimilarityPage |
| `/cortex/dcii/memory` | MemoryPage |
| `/cortex/dcii/statement-of-facts` | StatementOfFactsPage |

### DECIDE — Intelligence (Foundation: 5 pages)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/intelligence/pre-mortem` | PreMortemPage | Foundation |
| `/cortex/intelligence/ghost-board` | GhostBoardPage | Foundation |
| `/cortex/intelligence/decision-debt` | DecisionDebtPage | Foundation |
| `/cortex/intelligence/chronos` | ChronosPage | Foundation |
| `/cortex/intelligence/live-demo` | LiveDemoPage | Foundation |

### DECIDE — Intelligence (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/intelligence/regulatory` | CendiaRegulatory™ |
| `/cortex/intelligence/decision-dna` | Decision DNA |
| `/cortex/intelligence/lens` | CendiaLens™ |
| `/cortex/intelligence/orbit` | CendiaOrbit™ |
| `/cortex/intelligence/consensus` | Consensus Builder |
| `/cortex/intelligence/what-if` | What-If Scenarios |
| `/cortex/intelligence/synthesis` | Synthesis Engine |
| `/cortex/intelligence/rdp` | RDP Service |
| `/cortex/intelligence/audit-provenance` | CendiaProvenance™ |

### CendiaGateway™
| Route | Page |
|-------|------|
| `/cortex/gateway` | CendiaGatewayPage |

### Graph (3 pages)
| Route | Page |
|-------|------|
| `/cortex/graph` | GraphExplorerPage |
| `/cortex/graph/lineage/:entityId?` | LineageViewPage |
| `/cortex/graph/entity/:entityId` | EntityDetailsPage |

### Pulse (3 pages)
| Route | Page |
|-------|------|
| `/cortex/pulse` | PulsePage |
| `/cortex/pulse/alerts` | AlertsPage |
| `/cortex/pulse/metrics` | MetricsPage |

### Bridge (4 pages)
| Route | Page |
|-------|------|
| `/cortex/bridge` | BridgePage |
| `/cortex/bridge/workflows` | WorkflowsListPage |
| `/cortex/bridge/workflows/:id` | WorkflowBuilderPage |
| `/cortex/bridge/approvals` | ApprovalsPage |
| `/cortex/bridge/integrations` | IntegrationsPage |

### Pillars (8 pages)
| Route | Page |
|-------|------|
| `/cortex/pillars/helm` | HelmPage (The Helm) |
| `/cortex/pillars/lineage` | LineagePage |
| `/cortex/pillars/predict` | PredictPage |
| `/cortex/pillars/flow` | FlowPage |
| `/cortex/pillars/health` | HealthPage |
| `/cortex/pillars/guard` | GuardPage |
| `/cortex/pillars/ethics` | EthicsPage |
| `/cortex/pillars/agents` | AgentsPage |

### Data (4 pages)
| Route | Page |
|-------|------|
| `/cortex/data/sources` | DataSourcesPage |
| `/cortex/data/catalog` | DataCatalogPage |
| `/cortex/data/quality` | DataQualityPage |
| `/cortex/data/import-export` | DataImportExportPage |

### Compliance (Foundation: 1 page)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/compliance` | ComplianceReadinessPage | Foundation |

### Compliance (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/compliance/continuous-monitor` | CendiaCompliance™ |
| `/cortex/compliance/gap-scanner` | CendiaGapScan™ |
| `/cortex/compliance/cross-jurisdiction` | CendiaJurisdiction™ |
| `/cortex/compliance/regulatory-sandbox` | CendiaSandbox™ |

### Crypto (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/crypto/escrow` | CendiaEscrow™ |

### Governance (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/governance/decision-packets` | Decision Packets™ |
| `/cortex/governance/constitutional-court` | CendiaCourt™ |

### Security (4 pages + 1 gated)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/security` | SecurityOverviewPage | Foundation |
| `/cortex/security/access` | AccessControlPage | Foundation |
| `/cortex/security/audit` | AuditLogPage | Foundation |
| `/cortex/security/policies` | SecurityPoliciesPage | Foundation |
| `/cortex/security/zkp` | UpgradePage | Enterprise |

### Crown Jewels (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/crown/echo` | CendiaEcho™ |
| `/cortex/crown/redteam` | CendiaRedTeam™ |
| `/cortex/crown/gnosis` | CendiaGnosis™ |

### Sovereign (17 routes: all gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/sovereign/crucible` | Crucible |
| `/cortex/sovereign/panopticon` | Panopticon |
| `/cortex/sovereign/aegis` | Aegis |
| `/cortex/sovereign/eternal` | Eternal |
| `/cortex/sovereign/shadow-ops` | ShadowOps |
| `/cortex/sovereign/succession` | Succession |
| `/cortex/sovereign/sanctuary` | Sanctuary |
| `/cortex/sovereign/notary` | CendiaNotary™ |
| `/cortex/sovereign/vault` | CendiaVault™ |
| `/cortex/sovereign/symbiont` | Symbiont |
| `/cortex/sovereign/vox` | Vox |
| `/cortex/sovereign/horizon` | Horizon |
| `/cortex/sovereign/defense` | Defense Vertical |
| `/cortex/sovereign/sgas` | SGAS |
| `/cortex/sovereign/scge` | SCGE |
| `/cortex/sovereign/collapse` | COLLAPSE |

### Monitor (Enterprise: gated → UpgradePage)
| Route | Feature |
|-------|---------|
| `/cortex/monitor/live` | CendiaPulse™ Live |

### Settings (9 pages)
| Route | Page |
|-------|------|
| `/cortex/settings/organization` | Organization |
| `/cortex/settings/users` | Users |
| `/cortex/settings/teams` | Teams |
| `/cortex/settings/roles` | Roles & Permissions |
| `/cortex/settings/billing` | Billing |
| `/cortex/settings/api-keys` | API Keys |
| `/cortex/settings/integrations` | Integrations |
| `/cortex/settings/preferences` | Preferences |
| `/cortex/settings/security` | Security |

### Other Cortex Pages
| Route | Page |
|-------|------|
| `/cortex/walkthroughs` | WalkthroughsPage |
| `/cortex/workflows/builder` | ServiceWorkflowBuilderPage |
| `/cortex/showcase` | ShowcaseDashboard |
| `/cortex/demo` | DemoLauncherPage |
| `/cortex/demo/legal` | LegalDemoShowcasePage |
| `/cortex/admin/vertical-config` | VerticalConfigPage |
| `/cortex/profile` | UserProfilePage |
| `/cortex/help` | GettingStartedPage |
| `/cortex/upgrade` | UpgradePage |

---

## Admin Pages (`/admin/...`)

| Route | Page |
|-------|------|
| `/admin` | AdminDashboardPage |
| `/admin/dashboard` | AdminDashboardPage |
| `/admin/tenants` | TenantsPage |
| `/admin/licenses` | LicensesPage |
| `/admin/usage` | UsageAnalyticsPage |
| `/admin/health` | SystemHealthPage |
| `/admin/features` | FeatureFlagsPage |
| `/admin/data-sources` | DataSourcesPage |
| `/admin/mode-analytics` | ModeAnalytics |
| `/admin/rd-lab` | RDLabPage |
| `/admin/core` | CorePage |
| `/admin/control-center` | ControlCenterPage |
| `/admin/ai` | AdminAIPage |
| `/admin/sovereign-stack` | SovereignStackPage |
| `/admin/marketing` | MarketingCMSPage |
| `/admin/env-config` | EnvironmentConfigPage |
| `/admin/marketing-studio` | MarketingStudioPage |

---

## Tools

| Route | Page |
|-------|------|
| `/tools/roi-calculator` | ROICalculator |

---

## Verticals Hub (Foundation: hub visible, individual pages → UpgradePage)

| Route | Page | Tier |
|-------|------|------|
| `/verticals` | VerticalsHubPage | Foundation (teaser) |
| `/verticals/healthcare` | UpgradePage | Strategic |
| `/verticals/financial-services` | UpgradePage | Strategic |
| `/verticals/government-legal` | UpgradePage | Strategic |
| `/verticals/legal` | UpgradePage | Strategic |
| `/verticals/insurance` | UpgradePage | Strategic |
| `/verticals/pharmaceutical` | UpgradePage | Strategic |
| `/verticals/manufacturing` | UpgradePage | Strategic |
| `/verticals/energy-utilities` | UpgradePage | Strategic |
| `/verticals/technology` | UpgradePage | Strategic |
| `/verticals/retail-hospitality` | UpgradePage | Strategic |
| `/verticals/real-estate` | UpgradePage | Strategic |
| `/verticals/transportation` | UpgradePage | Strategic |
| `/verticals/media-entertainment` | UpgradePage | Strategic |
| `/verticals/professional-services` | UpgradePage | Strategic |
| `/verticals/higher-education` | UpgradePage | Strategic |
| `/verticals/sports` | UpgradePage | Strategic |
| `/verticals/telecommunications` | UpgradePage | Strategic |
| `/verticals/aerospace` | UpgradePage | Strategic |
| `/verticals/agriculture` | UpgradePage | Strategic |
| `/verticals/automotive` | UpgradePage | Strategic |
| `/verticals/construction` | UpgradePage | Strategic |
| `/verticals/hospitality` | UpgradePage | Strategic |
| `/verticals/nonprofit` | UpgradePage | Strategic |
| `/verticals/industrial-services` | UpgradePage | Strategic |
| `/verticals/smart-city` | UpgradePage | Strategic |
| `/verticals/eu-banking` | UpgradePage | Strategic |

---

## Error Pages

| Route | Page |
|-------|------|
| `*` | NotFoundPage (404) |

---

## Components (`src/components/`)

These are reusable components, panels, widgets, and views embedded within pages. **92 .tsx files total.**

### Dashboard Widgets (`components/dashboard/widgets/`) — 15 files
Render as full views within the VerticalDashboard for each industry:
- AgricultureDashboard, CivicSimulation, FleetTrackingMap, HospitalFloorMap
- HospitalityDashboard, InsuranceClaimsDashboard, LegalCaseManagement, MarketPulse
- PowerGridVisualization, ProductionLineStatus, PropertyPortfolio, RetailStoreDashboard
- StudentSuccessDashboard, SystemHealthMatrix, TelecomNetworkDashboard

### Dashboard (`components/dashboard/`) — 2 files
- VerticalDashboard.tsx, LayoutMapRenderer.tsx

### Council (`components/council/`) — 12 files
- AgentCard, AgentDropdown, CouncilModeSelector, CouncilVideoSimulation
- DeliberationView, ExecutiveSummary, LoadOptimizationDashboard
- PostDeliberationPanel, RealTimePolicyEnforcement, RedTeamReportPanel
- SimilarDecisionsPanel, UserInterventionPanel, WorkflowPicker

### Reports (`components/reports/`) — 5 files
- DrillDownReportKit, ExportCompareKit, HeatmapTimelineKit
- InteractionKit, TrendSparklineKit

### Showcase (`components/showcase/`) — 1 file
- ShowcaseDashboard.tsx (routed as `/cortex/showcase`)

### Demo (`components/demo/` + `components/demos/`) — 4 files
- DemoModeToggle, DemoOverlay, GuidedWalkthrough, RegulatorsReceiptDemo

### Agents (`components/agents/`) — 2 files
- ModelSwitcher, PersonalityTraitsPanel

### AI Assistant (`components/ai-assistant/`) — 1 file
- PlatformAssistant

### Compliance (`components/compliance/`) — 1 file
- ComplianceEnforcerDemo

### Crypto (`components/crypto/`) — 2 files
- CendiaStampSeal, EvidencePackageDownload

### Graph (`components/graph/`) — 1 file
- GraphCanvas

### Workflow (`components/workflow/`) — 1 file
- WorkflowBuilder

### Navigation (`components/navigation/`) — 3 files
- Breadcrumbs, HealthCheck, NavigationLoader

### UI Primitives (`components/ui/`) — 22 files
- badge, button, card, checkbox, dialog, EnterpriseGate, input, label
- Modal, NarrativeGuide, PageLoader, progress, RedactedText, select
- ServiceInfoDropdown, ServiceTooltip, tabs, textarea, ThemeToggle
- Toast, UpgradeNudge

### Other Components — 10 files
- AskCouncilButton, CommandPalette, ErrorBoundary, PageGuide, SEO
- auth/ProtectedRoute, brand/Logo, common/CrossModuleActions
- common/DecisionLifecycle, common/KeyboardShortcuts, common/StatusPage
- dev/TechTeamPanel, i18n/LanguageSwitcher, layout/PageHeader
- modes/ModeSelector, notifications/NotificationBell
- onboarding/OnboardingWizard, premium/PremiumFeaturesModal

---

## Layouts (`src/layouts/`) — 3 files

- CortexLayout.tsx (main app shell)
- MarketingLayout.tsx
- PublicLayout.tsx

## Contexts (`src/contexts/`) — 8 files

- AuthContext, CouncilQueryContext, DataSourceContext, DemoModeContext
- HealthContext, LanguageContext, ThemeContext, VerticalConfigContext

## Route Configs (`src/routes/`) — 10 files

- routes.lazy.tsx (root), utils.tsx
- public.routes, auth.routes, admin.routes, verticals.routes
- cortex/core.routes, cortex/intelligence.routes, cortex/enterprise.routes
- cortex/platform.routes, cortex/sovereign.routes

---

## Summary

> **176 .tsx page files** containing **~215 page components** (many `index.tsx` and `subpages.tsx` files export multiple components).

| Category | Accessible Pages | Gated (→ UpgradePage) |
|----------|------------------|-----------------------|
| Public / Marketing | 33 | — |
| Auth (login, register, forgot, reset, verify, find, onboarding) | 7 | — |
| Cortex — Council (council, deliberation, agent, decisions, visualization, replay, modes, post-delib, intervene, exec-summary, history, analytics) | 12 | — |
| Cortex — DCII (truth, notary, witness, timestamp, similarity, memory, statement-of-facts) | 7 | — |
| Cortex — DECIDE Foundation (pre-mortem, ghost-board, decision-debt, chronos, live-demo) | 5 | — |
| Cortex — DECIDE Enterprise (regulatory, decision-dna, lens, orbit, consensus, what-if, synthesis, rdp, audit-provenance) | — | 9 |
| Cortex — Gateway | 1 | — |
| Cortex — Graph (explorer, lineage, entity-details) | 3 | — |
| Cortex — Pulse (pulse, alerts, metrics) | 3 | — |
| Cortex — Bridge (bridge, workflows, workflow-builder, approvals, integrations) | 5 | — |
| Cortex — Pillars (helm, lineage, predict, flow, health, guard, ethics, agents) | 8 | — |
| Cortex — Data (sources, catalog, quality, import-export) | 4 | — |
| Cortex — Compliance Foundation (readiness) | 1 | — |
| Cortex — Compliance Enterprise (continuous-monitor, gap-scanner, cross-jurisdiction, regulatory-sandbox) | — | 4 |
| Cortex — Crypto (escrow) | — | 1 |
| Cortex — Governance (decision-packets, constitutional-court) | — | 2 |
| Cortex — Security (overview, access, audit, policies) | 4 | — |
| Cortex — Security Enterprise (ZKP) | — | 1 |
| Cortex — Crown Jewels (echo, redteam, gnosis) | — | 3 |
| Cortex — Sovereign (crucible, panopticon, aegis, eternal, shadow-ops, succession, sanctuary, notary, vault, symbiont, vox, horizon, defense, sgas, scge, collapse) | — | 16 |
| Cortex — Monitor (live) | — | 1 |
| Cortex — Walkthroughs, Workflows, Demo, Showcase | 6 | — |
| Cortex — Settings (org, users, teams, roles, billing, api-keys, integrations, preferences, security) | 9 | — |
| Cortex — Other (profile, help, upgrade, vertical-config, mission-control) | 5 | — |
| Admin (dashboard×2, tenants, licenses, usage, health, features, data-sources, mode-analytics, rd-lab, core, control-center, ai, sovereign-stack, marketing, env-config, marketing-studio, schema-mapping) | 18 | — |
| Services (catalog, request, my-requests, management) | 4 | — |
| Tools (ROI calculator) | 1 | — |
| Verticals (hub + 26 individual) | 1 (hub) | 26 |
| Legal (privacy, terms) | 2 | — |
| Pitch | 1 | — |
| Error (404) | 1 | — |
| **TOTAL page components** | **~141** | **~63** |
| **Grand total (pages)** | | **~204** |

### Full Source Tree (.tsx files)
| Directory | Files |
|-----------|-------|
| `src/pages/` (176 files → ~215 components) | 176 |
| `src/components/` (UI, panels, widgets, views) | 92 |
| `src/layouts/` | 3 |
| `src/contexts/` | 8 |
| `src/routes/` | 10 |
| `src/` root (App, main, routes.lazy) | 3 |
| **Total .tsx files in src/** | **292** |
