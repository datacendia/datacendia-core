// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CORTEX ENTERPRISE ROUTES - Enterprise Suite, Governance, Platinum Features
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from '../utils';

const SovereignPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.SovereignPage }))
);
const PersonaForgePage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.PersonaForgePage }))
);
const MeshPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.MeshPage }))
);
const GovernPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.GovernPage }))
);
const DecisionPacketsPage = lazy(() =>
  import('../../pages/cortex/governance/DecisionPacketsPage').then((m) => ({ default: m.DecisionPacketsPage }))
);
const VoicePage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.VoicePage }))
);
const AutopilotPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.AutopilotPage }))
);
const GenomicsPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.GenomicsPage }))
);
const DefenseStackPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.DefenseStackPage }))
);
const FinancialPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.FinancialPage }))
);
const SportsDecisionPage = lazy(() =>
  import('../../pages/cortex/verticals/SportsPage').then((m) => ({ default: m.default }))
);
const OmniTranslatePage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.OmniTranslatePage }))
);
const VetoPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.VetoPage }))
);
const UnionPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.UnionPage }))
);
const LedgerPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.LedgerPage }))
);
const EvidenceVaultPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.EvidenceVaultPage }))
);
const ApotheosisPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.ApotheosisPage }))
);
const DissentPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.DissentPage }))
);
const ResponsibilityPage = lazy(() =>
  import('../../pages/cortex/enterprise/ResponsibilityPage').then((m) => ({ default: m.default }))
);
const ROIMetricsPage = lazy(() =>
  import('../../pages/cortex/enterprise/ROIMetricsPage').then((m) => ({ default: m.ROIMetricsPage }))
);
const CascadePage = lazy(() =>
  import('../../pages/cortex/enterprise/CascadePage').then((m) => ({ default: m.default }))
);
const CrisisManagementPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.CrisisManagementPage }))
);
const AuditWorkflowPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.AuditWorkflowPage }))
);
const TrainingPage = lazy(() =>
  import('../../pages/cortex/enterprise').then((m) => ({ default: m.TrainingPage }))
);
const AdversarialRedTeamPage = lazy(() =>
  import('../../pages/cortex/enterprise/AdversarialRedTeamPage').then((m) => ({ default: m.default }))
);
const CommandPage = lazy(() =>
  import('../../pages/cortex/enterprise/CommandPage').then((m) => ({ default: m.default }))
);
const UEFAWalkthroughPage = lazy(() =>
  import('../../pages/cortex/verticals/UEFAWalkthroughPage').then((m) => ({ default: m.default }))
);
const FIFAGovernanceScenariosPage = lazy(() =>
  import('../../pages/cortex/verticals/FIFAGovernanceScenariosPage').then((m) => ({ default: m.default }))
);
const AuditProvenancePage = lazy(() =>
  import('../../pages/cortex/intelligence/AuditProvenancePage').then((m) => ({ default: m.default }))
);

// Enterprise Platinum Features
const ConstitutionalCourtPage = lazy(() =>
  import('../../pages/cortex/governance/ConstitutionalCourtPage').then((m) => ({ default: m.default }))
);
const RegulatorySandboxPage = lazy(() =>
  import('../../pages/cortex/compliance/RegulatorySandboxPage').then((m) => ({ default: m.default }))
);
const RegulatorsReceiptGeneratorPage = lazy(() =>
  import('../../pages/cortex/compliance/RegulatorsReceiptPage').then((m) => ({ default: m.default }))
);
const ZKPPage = lazy(() =>
  import('../../pages/cortex/security/ZKPPage').then((m) => ({ default: m.default }))
);
const AIInsurancePage = lazy(() =>
  import('../../pages/cortex/enterprise/AIInsurancePage').then((m) => ({ default: m.default }))
);
const PostQuantumKMSPage = lazy(() =>
  import('../../pages/cortex/enterprise/PostQuantumKMSPage').then((m) => ({ default: m.default }))
);
const CarbonAwareSchedulerPage = lazy(() =>
  import('../../pages/cortex/enterprise/CarbonAwareSchedulerPage').then((m) => ({ default: m.default }))
);
const CrossJurisdictionPage = lazy(() =>
  import('../../pages/cortex/compliance/CrossJurisdictionPage').then((m) => ({ default: m.default }))
);
const ContinuousComplianceMonitorPage = lazy(() =>
  import('../../pages/cortex/compliance/ContinuousComplianceMonitorPage').then((m) => ({ default: m.default }))
);
const DCIIDashboardPage = lazy(() =>
  import('../../pages/cortex/enterprise/DCIIDashboardPage').then((m) => ({ default: m.default }))
);

// New DCII Pages
const NotaryPage = lazy(() =>
  import('../../pages/cortex/dcii/NotaryPage').then((m) => ({ default: m.NotaryPage }))
);
const WitnessPage = lazy(() =>
  import('../../pages/cortex/dcii/WitnessPage').then((m) => ({ default: m.WitnessPage }))
);
const TimestampPage = lazy(() =>
  import('../../pages/cortex/dcii/TimestampPage').then((m) => ({ default: m.TimestampPage }))
);
const SimilarityPage = lazy(() =>
  import('../../pages/cortex/dcii/SimilarityPage').then((m) => ({ default: m.SimilarityPage }))
);
const MemoryPage = lazy(() =>
  import('../../pages/cortex/dcii/MemoryPage').then((m) => ({ default: m.MemoryPage }))
);
const TruthPage = lazy(() =>
  import('../../pages/cortex/dcii/TruthPage').then((m) => ({ default: m.TruthPage }))
);
const StatementOfFactsPage = lazy(() =>
  import('../../pages/cortex/dcii/StatementOfFactsPage').then((m) => ({ default: m.StatementOfFactsPage }))
);

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const cortexEnterpriseRoutes: RouteObject[] = [
  // Enterprise
  { path: 'enterprise', element: <Navigate to="/cortex/enterprise/genomics" replace /> },
  { path: 'enterprise/sovereign', element: w(SovereignPage) },
  { path: 'enterprise/persona-forge', element: w(PersonaForgePage) },
  { path: 'enterprise/mesh', element: w(MeshPage) },
  { path: 'enterprise/govern', element: w(GovernPage) },
  { path: 'enterprise/voice', element: w(VoicePage) },
  { path: 'enterprise/autopilot', element: w(AutopilotPage) },
  { path: 'enterprise/genomics', element: w(GenomicsPage) },
  { path: 'enterprise/defense-stack', element: w(DefenseStackPage) },
  { path: 'enterprise/financial', element: w(FinancialPage) },
  { path: 'verticals/sports', element: w(SportsDecisionPage) },
  { path: 'verticals/sports/uefa-walkthrough', element: w(UEFAWalkthroughPage) },
  { path: 'verticals/sports/fifa-scenarios', element: w(FIFAGovernanceScenariosPage) },
  { path: 'enterprise/omni-translate', element: w(OmniTranslatePage) },
  { path: 'enterprise/veto', element: w(VetoPage) },
  { path: 'enterprise/union', element: w(UnionPage) },
  { path: 'enterprise/ledger', element: w(LedgerPage) },
  { path: 'enterprise/evidence-vault', element: w(EvidenceVaultPage) },
  { path: 'enterprise/apotheosis', element: w(ApotheosisPage) },
  { path: 'enterprise/dissent', element: w(DissentPage) },
  { path: 'enterprise/responsibility', element: w(ResponsibilityPage) },
  { path: 'enterprise/roi-metrics', element: w(ROIMetricsPage) },
  { path: 'enterprise/cascade', element: w(CascadePage) },
  { path: 'enterprise/crisis', element: w(CrisisManagementPage) },
  { path: 'enterprise/audit-workflow', element: w(AuditWorkflowPage) },
  { path: 'enterprise/training', element: w(TrainingPage) },
  { path: 'enterprise/adversarial-redteam', element: w(AdversarialRedTeamPage) },
  { path: 'enterprise/command', element: w(CommandPage) },
  { path: 'enterprise/ai-insurance', element: w(AIInsurancePage) },
  { path: 'enterprise/post-quantum-kms', element: w(PostQuantumKMSPage) },
  { path: 'enterprise/carbon-aware', element: w(CarbonAwareSchedulerPage) },
  { path: 'enterprise/dcii', element: w(DCIIDashboardPage) },

  // DCII sub-pages
  { path: 'dcii/notary', element: w(NotaryPage) },
  { path: 'dcii/witness', element: w(WitnessPage) },
  { path: 'dcii/timestamp', element: w(TimestampPage) },
  { path: 'dcii/similarity', element: w(SimilarityPage) },
  { path: 'dcii/memory', element: w(MemoryPage) },
  { path: 'dcii/truth', element: w(TruthPage) },
  { path: 'dcii/statement-of-facts', element: w(StatementOfFactsPage) },

  // Governance
  { path: 'governance', element: <Navigate to="/cortex/governance/decision-packets" replace /> },
  { path: 'governance/decision-packets', element: w(DecisionPacketsPage) },
  { path: 'governance/constitutional-court', element: w(ConstitutionalCourtPage) },

  // CendiaProvenance™ (merged Decision DNA + Regulator's Receipt)
  { path: 'intelligence/audit-provenance', element: w(AuditProvenancePage) },
  // Legacy redirects
  { path: 'intelligence/decision-dna', element: <Navigate to="/cortex/intelligence/audit-provenance" replace /> },
  { path: 'compliance/regulators-receipt', element: w(RegulatorsReceiptGeneratorPage) },
  { path: 'compliance/regulatory-sandbox', element: w(RegulatorySandboxPage) },
  { path: 'compliance/cross-jurisdiction', element: w(CrossJurisdictionPage) },
  { path: 'compliance/continuous-monitor', element: w(ContinuousComplianceMonitorPage) },

  // Security (enterprise-related)
  { path: 'security/zkp', element: w(ZKPPage) },
];
