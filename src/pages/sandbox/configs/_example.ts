/**
 * EXAMPLE Sandbox Config — Template for New Orgs
 *
 * Copy this file, rename to your-org.ts, fill in the data, and add one route:
 *
 *   // In public.routes.tsx:
 *   const YourOrgSandbox = lazy(() =>
 *     import('../pages/sandbox/configs/your-org').then((m) => ({
 *       default: () => <SandboxTemplatePage config={m.default} />,
 *     }))
 *   );
 *   { path: '/sandbox/your-org', element: w(YourOrgSandbox) }
 *
 * That's it — isolated URL + unique access key = only they see their demo.
 *
 * @module pages/sandbox/configs/_example
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  // ── Identity ──────────────────────────────────────────────────────────────
  orgLabel: 'EXAMPLE ORG',
  accessKey: 'EXAMPLE-26',        // case-insensitive on entry
  sessionKey: 'example-sandbox-unlocked',

  // ── Styling (Tailwind) ────────────────────────────────────────────────────
  accent: 'blue',                  // used by SandboxShell for accent colors
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',

  // ── Footer ────────────────────────────────────────────────────────────────
  footerNote: '200+ regulatory scenarios mapped for Example Org · 10 live deliberation demos',

  // ── Scenarios ─────────────────────────────────────────────────────────────
  scenarios: [
    {
      id: 'scenario-1',
      title: 'Example Scenario — Compliance Audit',
      subtitle: 'Regulatory review · Financial oversight · Board governance',
      banner: 'Simulating a regulatory compliance audit where AI agents detect anomalies, debate legal implications, and seal evidence cryptographically.',
      risk: 'High',
      scenarioNum: 'Audit',
      icon: 'shield',             // ← icon registry key (see SandboxTemplate.tsx)
      color: 'text-blue-400',
      agents: [
        { id: 'compliance', name: 'Compliance Agent', role: 'Regulatory Monitoring & Audit', icon: '🛡️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal', name: 'Legal Agent', role: 'Legal Analysis & Jurisdiction', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'financial', name: 'Financial Agent', role: 'Transaction Monitoring & Forensics', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'integrity', name: 'Integrity Agent', role: 'Ethics & Governance Enforcement', icon: '🔒', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'Compliance Portal', status: 'connected', type: 'Regulatory Interface', icon: 'shield', detail: 'Active monitoring — quarterly review due' },
        { name: 'Financial Ledger', status: 'connected', type: 'Transaction Database', icon: 'database', detail: 'Real-time transaction feed active' },
        { name: 'Legal Database', status: 'connected', type: 'Case Law Archive', icon: 'scale', detail: '12,000+ precedent cases indexed' },
        { name: 'Board Governance', status: 'syncing', type: 'Decision Records', icon: 'landmark', detail: 'Board minutes and voting records' },
      ],
      script: [
        { agentId: 'compliance', phase: 'phase1', type: 'warning', delay: 800, content: 'COMPLIANCE ALERT. Quarterly review has identified...' },
        { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Financial analysis confirms...' },
        { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Legal review raises...' },
        { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Governance review reveals...' },
        { agentId: 'compliance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing enforcement protocol...' },
        { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Protocol satisfies all requirements. Dissent WITHDRAWN.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
        merkleRoot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
        merkleLabel: 'Merkle Tree Root (Audit data + Financial records + Legal analysis)',
        complianceLabel: 'Regulatory Compliance',
        complianceValue: 'VERIFIED',
        complianceThreshold: 'All requirements satisfied',
        agents: ['Compliance Agent', 'Legal Agent', 'Financial Agent', 'Integrity Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Example Org — Compliance Audit Evidence Sealed',
        guaranteeBody: 'This cryptographic bundle seals the complete audit evidence...',
        evidenceChain: 'Data collection → Analysis → Legal review → Governance check → Evidence seal → ML-DSA-65',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will conduct a comprehensive compliance audit — analyzing financial data, debating legal implications, and sealing evidence cryptographically.',
      phaseLabels: ['Detection & Analysis', 'Legal Review & Debate', 'Resolution & Evidence Seal'],
    },
    // Add more scenarios here...
  ],

  // ── Optional i18n (omit entirely if English-only) ─────────────────────────
  // i18n: {
  //   footerNote: '200+ escenarios regulatorios mapeados para Example Org · 10 demos en vivo',
  //   labels: ES_LABELS,  // import from SandboxShared
  //   scenarios: [ ... ]  // same structure as above, with Spanish text
  // },
};

export default config;
