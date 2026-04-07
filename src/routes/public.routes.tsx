/**
 * Route Config — Public Routes
 *
 * React Router route definitions and lazy-loaded imports.
 *
 * @exports publicRoutes
 * @module routes/public.routes
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// PUBLIC ROUTES - Marketing, Landing Pages, Legal, Docs
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from './utils';

// Public Pages
const SovereignLandingPage = lazy(() => import('../pages/marketing/SovereignLandingPage'));
const ManifestoHomePage = lazy(() => import('../pages/marketing/ManifestoHomePage'));
const LandingPage = lazy(() =>
  import('../pages/marketing').then((m) => ({ default: m.LandingPage }))
);
const HomePage = lazy(() => import('../pages/public').then((m) => ({ default: m.HomePage })));
const ProductPage = lazy(() => import('../pages/public').then((m) => ({ default: m.ProductPage })));
const AboutPage = lazy(() => import('../pages/public').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/public').then((m) => ({ default: m.ContactPage })));
const ManifestoPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.ManifestoPage }))
);
const DownloadsPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.DownloadsPage }))
);
const LicensePage = lazy(() => import('../pages/public').then((m) => ({ default: m.LicensePage })));
const SecurityPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.SecurityPage }))
);
const CookiePolicyPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.CookiePolicyPage }))
);
const DocsPage = lazy(() => import('../pages/public').then((m) => ({ default: m.DocsPage })));
const BlogPage = lazy(() => import('../pages/public').then((m) => ({ default: m.BlogPage })));
const ChangelogPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.ChangelogPage }))
);
const SupportPage = lazy(() => import('../pages/public').then((m) => ({ default: m.SupportPage })));
const IntegrationsPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.IntegrationsPage }))
);
const DemoRequestPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.DemoRequestPage }))
);
const ShowcasesPage = lazy(() => import('../pages/public/ShowcasesPage'));
const VerifyPage = lazy(() => import('../pages/public/VerifyPage'));
const ServicesPage = lazy(() =>
  import('../pages/public/services-packages').then((m) => ({ default: m.ServicesPage }))
);
const PackagesPage = lazy(() =>
  import('../pages/public/services-packages').then((m) => ({ default: m.PackagesPage }))
);
const HonestyMatricesPage = lazy(() => import('../pages/public/HonestyMatricesPage'));
const SovereignEnterpriseIntelligencePage = lazy(
  () => import('../pages/public/SovereignEnterpriseIntelligencePage')
);

// Legal
const PrivacyPolicyPage = lazy(() =>
  import('../pages/legal').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() => import('../pages/legal').then((m) => ({ default: m.TermsPage })));

// Pricing
const PricingPage = lazy(() => import('../pages/pricing').then((m) => ({ default: m.PricingPage })));

// Demos
const RegulatorsReceiptPage = lazy(() => import('../pages/cortex/trust/RegulatorsReceiptPage'));
const LegalWorkflowPage = lazy(() => import('../pages/cortex/workflows/LegalWorkflowPage'));

// Apex Package
const CendiaForecastPage = lazy(() =>
  import('../pages/apex').then((m) => ({ default: m.CendiaForecastPage }))
);
const CendiaSentryPage = lazy(() =>
  import('../pages/apex').then((m) => ({ default: m.CendiaSentryPage }))
);

// Sandbox
const CelticSandboxPage = lazy(() => import('../pages/sandbox/CelticSandboxPage'));
const UefaSandboxPage = lazy(() => import('../pages/sandbox/UefaSandboxPage'));
const FifaSandboxPage = lazy(() => import('../pages/sandbox/FifaSandboxPage'));
const ConmebolSandboxPage = lazy(() => import('../pages/sandbox/ConmebolSandboxPage'));

// Product Showcase
const ProductShowcase = lazy(() => import('../pages/sandbox/ProductShowcase').then((m) => ({ default: m.ProductShowcase })));
const UfcSandboxPage = lazy(() => import('../pages/sandbox/UfcSandboxPage'));
const MilanSandboxPage = lazy(() => import('../pages/sandbox/MilanSandboxPage'));
const Formula1SandboxPage = lazy(() => import('../pages/sandbox/Formula1SandboxPage'));
const NflSandboxPage = lazy(() => import('../pages/sandbox/NflSandboxPage'));
const GrupoFigerSandboxPage = lazy(() => import('../pages/sandbox/GrupoFigerSandboxPage'));
const BurnleySandboxPage = lazy(() => import('../pages/sandbox/BurnleySandboxPage'));
const FpfPeruSandboxPage = lazy(() => import('../pages/sandbox/FpfPeruSandboxPage'));
const ThomsonReutersSandboxPage = lazy(() => import('../pages/sandbox/ThomsonReutersSandboxPage'));
const LexisNexisSandboxPage = lazy(() => import('../pages/sandbox/LexisNexisSandboxPage'));
const HarveyAiSandboxPage = lazy(() => import('../pages/sandbox/HarveyAiSandboxPage'));
const WoltersKluwerSandboxPage = lazy(() => import('../pages/sandbox/WoltersKluwerSandboxPage'));
const BloombergLawSandboxPage = lazy(() => import('../pages/sandbox/BloombergLawSandboxPage'));
const VlexSandboxPage = lazy(() => import('../pages/sandbox/VlexSandboxPage'));
const RelativitySandboxPage = lazy(() => import('../pages/sandbox/RelativitySandboxPage'));
const IroncladIcertisSandboxPage = lazy(() => import('../pages/sandbox/IroncladIcertisSandboxPage'));
const ClioSandboxPage = lazy(() => import('../pages/sandbox/ClioSandboxPage'));

// Asia & Africa Sandboxes
const SamsungSandboxPage = lazy(() => import('../pages/sandbox/SamsungSandboxPage'));
const InfosysSandboxPage = lazy(() => import('../pages/sandbox/InfosysSandboxPage'));
const ToyotaSandboxPage = lazy(() => import('../pages/sandbox/ToyotaSandboxPage'));
const GrabSandboxPage = lazy(() => import('../pages/sandbox/GrabSandboxPage'));
const MtnSandboxPage = lazy(() => import('../pages/sandbox/MtnSandboxPage'));
const SafaricomSandboxPage = lazy(() => import('../pages/sandbox/SafaricomSandboxPage'));
const DangoteSandboxPage = lazy(() => import('../pages/sandbox/DangoteSandboxPage'));
const AfdbSandboxPage = lazy(() => import('../pages/sandbox/AfdbSandboxPage'));

// Game-Changer Sandboxes
const BinanceSandboxPage = lazy(() => import('../pages/sandbox/BinanceSandboxPage'));
const RocketLawyerSandboxPage = lazy(() => import('../pages/sandbox/RocketLawyerSandboxPage'));
const CanvaSandboxPage = lazy(() => import('../pages/sandbox/CanvaSandboxPage'));

// Financial AI Sandboxes
const DanelfinSandboxPage = lazy(() => import('../pages/sandbox/DanelfinSandboxPage'));
const KavoutSandboxPage = lazy(() => import('../pages/sandbox/KavoutSandboxPage'));

// Peru Liga 1 Club Sandboxes
const UniversitarioSandboxPage = lazy(() => import('../pages/sandbox/UniversitarioSandboxPage'));
const AlianzaLimaSandboxPage = lazy(() => import('../pages/sandbox/AlianzaLimaSandboxPage'));
const SportingCristalSandboxPage = lazy(() => import('../pages/sandbox/SportingCristalSandboxPage'));
const MelgarSandboxPage = lazy(() => import('../pages/sandbox/MelgarSandboxPage'));
const CuscoFcSandboxPage = lazy(() => import('../pages/sandbox/CuscoFcSandboxPage'));
const AdtSandboxPage = lazy(() => import('../pages/sandbox/AdtSandboxPage'));

// Investor Sandboxes
const MozillaSandboxPage = lazy(() => import('../pages/sandbox/MozillaSandboxPage'));
const LuxCapitalSandboxPage = lazy(() => import('../pages/sandbox/LuxCapitalSandboxPage'));
const WingVcSandboxPage = lazy(() => import('../pages/sandbox/WingVcSandboxPage'));
const NfxSandboxPage = lazy(() => import('../pages/sandbox/NfxSandboxPage'));
const IndexVenturesSandboxPage = lazy(() => import('../pages/sandbox/IndexVenturesSandboxPage'));
const GeneralCatalystSandboxPage = lazy(() => import('../pages/sandbox/GeneralCatalystSandboxPage'));

// Banking Sandboxes
const ScotiabankSandboxPage = lazy(() => import('../pages/sandbox/ScotiabankSandboxPage'));

// EU & Latin America Sandboxes
const SapSandboxPage = lazy(() => import('../pages/sandbox/SapSandboxPage'));
const FepcmacSandboxPage = lazy(() => import('../pages/sandbox/FepcmacSandboxPage'));

// Wedge Products — Lead-gen pages, no auth required
const ShadowAIScannerPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.ShadowAIScannerPage }))
);
const GovernanceReportPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.GovernanceReportPage }))
);
const IncidentForensicsPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.IncidentForensicsPage }))
);

// Ops Agents
const OpsAgentsPage = lazy(() =>
  import('../pages/cortex/ops').then((m) => ({ default: m.OpsAgentsPage }))
);

// Pitch
const PitchDeck = lazy(() => import('../pages/pitch').then((m) => ({ default: m.PitchDeck })));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const publicRoutes: RouteObject[] = [
  { path: '/', element: w(SovereignLandingPage) },
  { path: '/home', element: w(SovereignLandingPage) },
  { path: '/old-home', element: w(LandingPage) },
  { path: '/legacy-home', element: w(HomePage) },
  { path: '/pricing', element: w(PricingPage) },

  // Wedge Products — Free tools that drive client acquisition
  { path: '/shadow-scan', element: w(ShadowAIScannerPage) },
  { path: '/shadow-ai', element: w(ShadowAIScannerPage) },
  { path: '/governance-report', element: w(GovernanceReportPage) },
  { path: '/ai-governance-report', element: w(GovernanceReportPage) },
  { path: '/incident-forensics', element: w(IncidentForensicsPage) },
  { path: '/ai-forensics', element: w(IncidentForensicsPage) },
  { path: '/demo', element: w(DemoRequestPage) },
  { path: '/product', element: w(ProductPage) },
  { path: '/products', element: <Navigate to="/product" replace /> },
  { path: '/about', element: w(AboutPage) },
  { path: '/contact', element: w(ContactPage) },
  { path: '/contact-us', element: w(ContactPage) },
  { path: '/manifesto', element: w(ManifestoHomePage) },
  { path: '/believe', element: w(ManifestoHomePage) },
  { path: '/why', element: w(ManifestoHomePage) },
  { path: '/downloads', element: w(DownloadsPage) },
  { path: '/license', element: w(LicensePage) },
  { path: '/licenses', element: w(LicensePage) },
  { path: '/services', element: w(ServicesPage) },
  { path: '/packages', element: w(PackagesPage) },
  { path: '/sovereign', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/sovereign-enterprise-intelligence', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/sei', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/category', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/honesty', element: w(HonestyMatricesPage) },
  { path: '/honesty-matrices', element: w(HonestyMatricesPage) },
  { path: '/transparency', element: w(HonestyMatricesPage) },
  { path: '/showcases', element: w(ShowcasesPage) },
  { path: '/cortex/trust/regulators-receipt', element: w(RegulatorsReceiptPage) },
  { path: '/cortex/workflows/legal', element: w(LegalWorkflowPage) },
  { path: '/case-studies', element: w(ShowcasesPage) },
  { path: '/customers', element: w(ShowcasesPage) },
  { path: '/privacy', element: w(PrivacyPolicyPage) },
  { path: '/terms', element: w(TermsPage) },
  { path: '/terms-of-service', element: w(TermsPage) },
  { path: '/security', element: w(SecurityPage) },
  { path: '/cookies', element: w(CookiePolicyPage) },
  { path: '/cookie-policy', element: w(CookiePolicyPage) },
  { path: '/docs', element: w(DocsPage) },
  { path: '/documentation', element: w(DocsPage) },
  { path: '/api', element: w(DocsPage) },
  { path: '/blog', element: w(BlogPage) },
  { path: '/changelog', element: w(ChangelogPage) },
  { path: '/releases', element: w(ChangelogPage) },
  { path: '/support', element: w(SupportPage) },
  { path: '/help', element: w(SupportPage) },
  { path: '/integrations', element: w(IntegrationsPage) },

  // CendiaVerify — Public Verification Portal (no auth)
  { path: '/verify', element: w(VerifyPage) },
  { path: '/verify-receipt', element: w(VerifyPage) },

  // Apex Package
  { path: '/apex/forecast', element: w(CendiaForecastPage) },
  { path: '/apex/sentry', element: w(CendiaSentryPage) },
  { path: '/products/cendia-forecast', element: w(CendiaForecastPage) },
  { path: '/products/cendia-sentry', element: w(CendiaSentryPage) },

  // Product Showcase
  { path: '/showcase', element: w(ProductShowcase) },
  // Sandbox — Design Partner Demos
  { path: '/sandbox/celtic', element: w(CelticSandboxPage) },
  { path: '/sandbox/uefa', element: w(UefaSandboxPage) },
  { path: '/sandbox/fifa', element: w(FifaSandboxPage) },
  { path: '/sandbox/conmebol', element: w(ConmebolSandboxPage) },
  // Template-driven sandboxes (config-based)
  { path: '/sandbox/ufc', element: w(UfcSandboxPage) },
  { path: '/sandbox/milan', element: w(MilanSandboxPage) },
  { path: '/sandbox/f1', element: w(Formula1SandboxPage) },
  { path: '/sandbox/nfl', element: w(NflSandboxPage) },
  { path: '/sandbox/figer', element: w(GrupoFigerSandboxPage) },
  { path: '/sandbox/grupo-figer', element: w(GrupoFigerSandboxPage) },
  { path: '/sandbox/burnley', element: w(BurnleySandboxPage) },
  { path: '/sandbox/fpf-peru', element: w(FpfPeruSandboxPage) },
  { path: '/sandbox/peru', element: w(FpfPeruSandboxPage) },
  { path: '/sandbox/universitario', element: w(UniversitarioSandboxPage) },
  { path: '/sandbox/la-u', element: w(UniversitarioSandboxPage) },
  { path: '/sandbox/alianza-lima', element: w(AlianzaLimaSandboxPage) },
  { path: '/sandbox/alianza', element: w(AlianzaLimaSandboxPage) },
  { path: '/sandbox/sporting-cristal', element: w(SportingCristalSandboxPage) },
  { path: '/sandbox/cristal', element: w(SportingCristalSandboxPage) },
  { path: '/sandbox/melgar', element: w(MelgarSandboxPage) },
  { path: '/sandbox/fbc-melgar', element: w(MelgarSandboxPage) },
  { path: '/sandbox/cusco-fc', element: w(CuscoFcSandboxPage) },
  { path: '/sandbox/cusco', element: w(CuscoFcSandboxPage) },
  { path: '/sandbox/adt', element: w(AdtSandboxPage) },
  { path: '/sandbox/tarma', element: w(AdtSandboxPage) },
  { path: '/sandbox/thomson-reuters', element: w(ThomsonReutersSandboxPage) },
  { path: '/sandbox/tr', element: w(ThomsonReutersSandboxPage) },
  { path: '/sandbox/lexisnexis', element: w(LexisNexisSandboxPage) },
  { path: '/sandbox/lexis', element: w(LexisNexisSandboxPage) },
  { path: '/sandbox/harvey', element: w(HarveyAiSandboxPage) },
  { path: '/sandbox/harvey-ai', element: w(HarveyAiSandboxPage) },
  { path: '/sandbox/wolters-kluwer', element: w(WoltersKluwerSandboxPage) },
  { path: '/sandbox/wk', element: w(WoltersKluwerSandboxPage) },
  { path: '/sandbox/bloomberg-law', element: w(BloombergLawSandboxPage) },
  { path: '/sandbox/bloomberg', element: w(BloombergLawSandboxPage) },
  { path: '/sandbox/vlex', element: w(VlexSandboxPage) },
  { path: '/sandbox/relativity', element: w(RelativitySandboxPage) },
  { path: '/sandbox/ironclad', element: w(IroncladIcertisSandboxPage) },
  { path: '/sandbox/icertis', element: w(IroncladIcertisSandboxPage) },
  { path: '/sandbox/clio', element: w(ClioSandboxPage) },

  // Asia Sandboxes
  { path: '/sandbox/samsung', element: w(SamsungSandboxPage) },
  { path: '/sandbox/infosys', element: w(InfosysSandboxPage) },
  { path: '/sandbox/toyota', element: w(ToyotaSandboxPage) },
  { path: '/sandbox/grab', element: w(GrabSandboxPage) },

  // Africa Sandboxes
  { path: '/sandbox/mtn', element: w(MtnSandboxPage) },
  { path: '/sandbox/safaricom', element: w(SafaricomSandboxPage) },
  { path: '/sandbox/mpesa', element: w(SafaricomSandboxPage) },
  { path: '/sandbox/dangote', element: w(DangoteSandboxPage) },
  { path: '/sandbox/afdb', element: w(AfdbSandboxPage) },

  // Game-Changer Sandboxes
  { path: '/sandbox/binance', element: w(BinanceSandboxPage) },
  { path: '/sandbox/rocket-lawyer', element: w(RocketLawyerSandboxPage) },
  { path: '/sandbox/rocketlawyer', element: w(RocketLawyerSandboxPage) },
  { path: '/sandbox/canva', element: w(CanvaSandboxPage) },

  // Financial AI Sandboxes
  { path: '/sandbox/danelfin', element: w(DanelfinSandboxPage) },
  { path: '/sandbox/kavout', element: w(KavoutSandboxPage) },

  // Peru Liga 1 Club Sandboxes
  { path: '/sandbox/universitario', element: w(UniversitarioSandboxPage) },
  { path: '/sandbox/u', element: w(UniversitarioSandboxPage) },
  { path: '/sandbox/alianza-lima', element: w(AlianzaLimaSandboxPage) },
  { path: '/sandbox/alianza', element: w(AlianzaLimaSandboxPage) },
  { path: '/sandbox/sporting-cristal', element: w(SportingCristalSandboxPage) },
  { path: '/sandbox/cristal', element: w(SportingCristalSandboxPage) },
  { path: '/sandbox/melgar', element: w(MelgarSandboxPage) },
  { path: '/sandbox/cusco-fc', element: w(CuscoFcSandboxPage) },
  { path: '/sandbox/adt', element: w(AdtSandboxPage) },

  // Investor Sandboxes
  { path: '/sandbox/mozilla', element: w(MozillaSandboxPage) },
  { path: '/sandbox/mozilla-ventures', element: w(MozillaSandboxPage) },
  { path: '/sandbox/moz', element: w(MozillaSandboxPage) },
  { path: '/sandbox/lux', element: w(LuxCapitalSandboxPage) },
  { path: '/sandbox/lux-capital', element: w(LuxCapitalSandboxPage) },
  { path: '/sandbox/wing', element: w(WingVcSandboxPage) },
  { path: '/sandbox/wing-vc', element: w(WingVcSandboxPage) },
  { path: '/sandbox/nfx', element: w(NfxSandboxPage) },
  { path: '/sandbox/nfx-currier', element: w(NfxSandboxPage) },
  { path: '/sandbox/index', element: w(IndexVenturesSandboxPage) },
  { path: '/sandbox/index-ventures', element: w(IndexVenturesSandboxPage) },
  { path: '/sandbox/gc', element: w(GeneralCatalystSandboxPage) },
  { path: '/sandbox/general-catalyst', element: w(GeneralCatalystSandboxPage) },

  // Banking Sandboxes
  { path: '/sandbox/scotiabank', element: w(ScotiabankSandboxPage) },
  { path: '/sandbox/scotia', element: w(ScotiabankSandboxPage) },

  // EU & Latin America Sandboxes
  { path: '/sandbox/sap', element: w(SapSandboxPage) },
  { path: '/sandbox/fepcmac', element: w(FepcmacSandboxPage) },
  { path: '/sandbox/cajas', element: w(FepcmacSandboxPage) },

  // Ops Agents — Everyday AI task agents
  { path: '/ops-agents', element: w(OpsAgentsPage) },
  { path: '/ops', element: w(OpsAgentsPage) },
  { path: '/agents/ops', element: w(OpsAgentsPage) },

  // Pitch
  { path: '/pitch', element: w(PitchDeck) },
  { path: '/investors', element: w(PitchDeck) },
  { path: '/deck', element: w(PitchDeck) },
];
