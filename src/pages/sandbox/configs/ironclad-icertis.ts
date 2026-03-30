/**
 * Ironclad / Icertis Sandbox Config
 *
 * 2 fully scripted multi-agent deliberation scenarios for contract AI governance.
 * Access: /sandbox/ironclad (Key: IC-84)
 *
 * @module pages/sandbox/configs/ironclad-icertis
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Ironclad / Icertis',
  accessKey: 'IC-84',
  sessionKey: 'ironclad-icertis-sandbox-unlocked',

  accent: 'indigo',
  accentColor: 'text-indigo-400',
  accentHover: 'from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600',
  ringColor: 'focus:ring-indigo-500/30',
  borderColor: 'border-indigo-500/30',
  gradientFrom: 'from-indigo-600/20',
  gradientTo: 'to-indigo-900/20',

  footerNote: '50 regulatory scenarios mapped for Ironclad/Icertis × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'ironclad-indemnification',
      title: 'Ironclad AI — Uncapped Carve-Out Missed',
      subtitle: 'Indemnification cap 1x · IP/data breach carve-outs uncapped · Auto-approved · Unlimited exposure',
      banner: 'Simulating the CLM automation trap: Ironclad AI reviews a vendor agreement and classifies the indemnification as "standard" (1x cap). The AI misses that the IP infringement and data breach carve-outs are UNCAPPED — creating unlimited liability. The contract is auto-approved without attorney review.',
      risk: 'Critical',
      scenarioNum: 'CLM',
      icon: 'file-text',
      color: 'text-indigo-400',
      agents: [
        { id: 'ironclad-ai', name: 'Ironclad AI Agent', role: 'Contract Review & Risk Classification', icon: '📝', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
        { id: 'procurement', name: 'Procurement Agent', role: 'Vendor Management & Contract Approval', icon: '🏢', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-ops', name: 'Legal Operations Agent', role: 'CLM Governance & Approval Workflow', icon: '⚙️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'risk-clm', name: 'Enterprise Risk Agent', role: 'Liability Exposure & Insurance Assessment', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Ironclad CLM', status: 'connected', type: 'Contract Review AI', icon: 'cpu', detail: 'Vendor agreement classified "standard risk" — indemnification: 1x cap' },
        { name: 'Carve-Out Analyser', status: 'connected', type: 'Deep Clause Review', icon: 'search', detail: 'IP infringement carve-out: UNCAPPED. Data breach carve-out: UNCAPPED' },
        { name: 'Approval Workflow', status: 'connected', type: 'CLM Automation', icon: 'git-branch', detail: '"Standard risk" = auto-approved by procurement, no legal review' },
        { name: 'Insurance Dashboard', status: 'syncing', type: 'Liability Coverage', icon: 'shield', detail: 'CGL policy: $5M aggregate. Uncapped indemnity: potentially unlimited' },
      ],
      script: [
        { agentId: 'ironclad-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Ironclad AI contract review complete for CloudVendor SaaS Agreement (annual value: $420K). Risk classification: STANDARD. Indemnification analysis: "Vendor indemnification capped at 1x annual fees ($420K). Standard market terms." CRITICAL MISS: The AI correctly identified the general cap ($420K). However, the AI did NOT flag the carve-out provisions in Section 8.3(b): "Notwithstanding the foregoing limitation, Vendor indemnification for (i) intellectual property infringement, (ii) data breach or unauthorized disclosure of Customer Data, and (iii) gross negligence or willful misconduct shall not be subject to the limitation in Section 8.3(a)." Translation: the general cap is $420K, but IP infringement, data breach, and gross negligence are UNCAPPED. For a SaaS vendor that processes customer data: data breach is the highest-probability indemnification trigger. Uncapped data breach indemnification on a $420K contract creates UNLIMITED liability exposure.' },
        { agentId: 'legal-ops', phase: 'phase1', type: 'warning', delay: 2500, content: 'CLM WORKFLOW ALERT. The Ironclad approval workflow is configured: AI risk "Low" = auto-approved by requester. "Standard" = approved by procurement manager. "High" = routed to legal for attorney review. This contract was classified "Standard" — procurement approved without legal review. The carve-out provisions create "High" or "Critical" risk — but the AI evaluates the GENERAL cap, not the CARVE-OUTS. CendiaSupervision audit of last 12 months: 47 contracts with uncapped carve-outs were classified "Standard" and approved without attorney review. Combined potential exposure: unlimited (data breach indemnification across 47 SaaS vendors). The workflow was designed based on the AI risk categories. If the categories are incomplete, the workflow routes contracts incorrectly at scale.' },
        { agentId: 'risk-clm', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Enterprise risk assessment: (1) This single contract: $420K annual value with uncapped data breach indemnification. If the vendor suffers a breach affecting client customer data, indemnification is unlimited — but recovery depends on vendor solvency. (2) The 47 contracts identified by CendiaSupervision: all have uncapped carve-outs. A supply chain attack affecting multiple vendors creates aggregated unlimited exposure. (3) Insurance gap: CGL and cyber policies have $5M aggregate limits. Uncapped contractual liability from 47 vendors may exceed policy limits. (4) Board governance: the board risk appetite framework limits single-vendor exposure to $5M. Uncapped carve-outs violate this framework. The CLM AI was supposed to enforce the framework — instead, it bypassed it. (5) The CFO will ask: "How did 47 contracts with unlimited liability get approved without legal review?" The answer — "our AI classified them as standard" — is not acceptable.' },
        { agentId: 'procurement', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PROCUREMENT GOVERNANCE. I approved this contract based on Ironclad\'s "Standard" classification. I am not an attorney. The CLM system was supposed to route high-risk contracts to legal. I trusted the AI classification. If I\'m approving contracts with unlimited liability exposure because the AI told me they\'re "Standard," the CLM workflow is broken — not my judgment. The problem is systemic: procurement managers across the enterprise approve 14,000 contracts per year based on AI risk classifications. If those classifications miss carve-outs, every procurement manager is unknowingly approving unlimited liability. Without CendiaSupervision: procurement trusts the AI. Legal never sees the contract. With CendiaSupervision: the carve-out analysis catches uncapped provisions REGARDLESS of the general cap classification.' },
        { agentId: 'ironclad-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Ironclad + CendiaSupervision Contract Governance: (1) CARVE-OUT ANALYSIS: CendiaSupervision adds deep carve-out review to every indemnification analysis. The risk classification considers BOTH the general cap AND all carve-outs. Uncapped carve-outs for data breach, IP, or confidentiality = automatic "High Risk" regardless of general cap. (2) WORKFLOW HARD-STOP: Any contract with uncapped liability carve-outs is routed to legal — never auto-approved. (3) BOARD RISK FRAMEWORK: CendiaSupervision enforces the board risk appetite: single-vendor exposure > $5M = legal + risk committee. Uncapped carve-outs always exceed this threshold. (4) PORTFOLIO AUDIT: CendiaSupervision audits the entire portfolio for uncapped carve-outs — the 47 previously approved contracts are identified and remediated. (5) PROCUREMENT SUMMARIES: AI-generated summaries highlight carve-outs: "This contract has a $420K cap BUT uncapped data breach indemnification."' },
        { agentId: 'risk-clm', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The carve-out analysis + workflow hard-stop eliminates the gap. This contract: routed to legal, carve-outs negotiated (data breach capped at 5x = $2.1M), board risk framework enforced. The 47 previously approved contracts: identified by portfolio audit, remediation initiated. For Ironclad/Icertis: CLM + CendiaSupervision = the only contract platform with carve-out governance. Every CLM competitor has the same gap — AI reads the general cap but misses carve-outs. CendiaSupervision catches them by architecture. "Our CLM analyses indemnification caps AND carve-outs" — that\'s the enterprise feature for Fortune 500 deployments where the GC needs ACTUAL exposure, not the headline cap.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ic10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ic20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Ironclad review + Carve-out analysis + Workflow routing + Portfolio audit)',
        complianceLabel: 'Contract Risk',
        complianceValue: 'UNCAPPED CARVE-OUTS CAUGHT',
        complianceThreshold: 'General cap: $420K. Carve-outs: UNCAPPED — routed to legal',
        agents: ['Ironclad AI Agent', 'Procurement Agent', 'Legal Operations Agent', 'Enterprise Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Ironclad CLM — Carve-Out Governance',
        guaranteeBody: 'AI contract review enhanced: general cap ($420K) AND carve-out analysis (IP, data breach = UNCAPPED) flagged. Contract routed to legal. 47 previously approved contracts with uncapped carve-outs identified for remediation. Board risk framework enforced.',
        evidenceChain: 'Ironclad AI (Standard) → CendiaSupervision carve-out check → 3 uncapped carve-outs → Reclassified: High Risk → Legal review → Carve-outs negotiated → Portfolio audit (47 contracts) → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Ironclad + CendiaSupervision catches uncapped indemnification carve-outs that the AI headline classification missed.',
      phaseLabels: ['AI Classification & Carve-Out Blind Spot', 'Unlimited Liability & Workflow Bypass', 'Carve-Out Analysis & Portfolio Audit'],
    },

    {
      id: 'icertis-auto-renewal',
      title: 'Icertis AI — 80 Auto-Renewals Missed, $3.4M Locked',
      subtitle: 'Term extraction · Non-standard locations · Appendix buried · Termination window missed',
      banner: 'Simulating the CLM extraction trap: Icertis ExploreAI extracts key terms from 5,000 vendor contracts. The AI misses 80 auto-renewal clauses buried in appendices, SLAs, and order forms. 23 contracts auto-renew before termination. Lock-in cost: $3.4M.',
      risk: 'High',
      scenarioNum: 'Renewal',
      icon: 'refresh-cw',
      color: 'text-amber-400',
      agents: [
        { id: 'icertis-ai', name: 'Icertis ExploreAI Agent', role: 'Contract Term Extraction & Obligation Tracking', icon: '🔍', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
        { id: 'contract-ops', name: 'Contract Operations Agent', role: 'Renewal Management & Termination Calendar', icon: '📅', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'extraction-qc', name: 'Extraction QC Agent', role: 'Term Extraction Verification & Gap Detection', icon: '📊', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'finance-clm', name: 'Finance Agent', role: 'Budget Impact & Lock-In Cost Assessment', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Icertis ExploreAI', status: 'connected', type: 'Term Extraction', icon: 'cpu', detail: '5,000 contracts — auto-renewal detected in 4,920 (98.4%)' },
        { name: 'Document Analyser', status: 'connected', type: 'Multi-Section Review', icon: 'file-text', detail: '80 contracts: auto-renewal in appendices/SLAs/order forms — AI missed' },
        { name: 'Termination Calendar', status: 'connected', type: 'Deadline Tracking', icon: 'calendar', detail: '23 of 80 missed contracts: termination window already closed' },
        { name: 'Budget Dashboard', status: 'syncing', type: 'Financial Impact', icon: 'dollar-sign', detail: '23 auto-renewed contracts: $3.4M committed for next term' },
      ],
      script: [
        { agentId: 'icertis-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Icertis ExploreAI term extraction complete for annual contract portfolio review. 5,000 vendor contracts analysed. Auto-renewal extraction: 4,920 contracts identified and tracked. 80 contracts: NO auto-renewal clause detected — classified "fixed term, no renewal." CRITICAL ERROR: All 80 contracts DO contain auto-renewal provisions in non-standard locations: 34 in appendices/schedules (not the main "Term" section), 28 in SLA/service description documents incorporated by reference, 18 in order forms or SOWs that modify the master agreement. The AI extraction model searches for renewal language in the "Term and Termination" section. It does NOT search appendices, SLAs, or order forms with equal thoroughness. Accuracy by location: main-body clauses 99.6%, appendix clauses 87%, SLA/SOW clauses 72%. The overall 98.4% hides severe gaps in non-standard locations.' },
        { agentId: 'extraction-qc', phase: 'phase1', type: 'warning', delay: 2500, content: 'EXTRACTION QC ALERT. CendiaSupervision multi-document audit: (1) The 80 missed renewals follow a pattern — vendors intentionally placed renewal language in appendices so customers miss termination windows. Known vendor tactic. (2) Of the 80: 23 already auto-renewed (window passed, $3.4M locked). 57 still have open windows closing in 30-90 days. (3) The 23 locked contracts include: 8 SaaS platforms the company planned to replace ($1.8M paying for tools being sunset), 6 consulting agreements at above-market rates ($900K), 9 unneeded service contracts ($700K). (4) Total exposure if 57 remaining windows also missed: additional $8.2M. Combined: $11.6M. (5) The CFO approved this portfolio review specifically to reduce vendor spend by 15%. The AI extraction gap locks the company INTO spend it intended to cut.' },
        { agentId: 'finance-clm', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Financial impact: (1) $3.4M already committed from 23 auto-renewed contracts — unrecoverable without early termination fees. (2) $8.2M at risk from 57 open-window contracts. Total potential exposure: $11.6M. (3) The cost reduction programme targeted $7.5M in vendor spend savings. The AI extraction gap means the company is locked into $3.4M it intended to cut, with $8.2M more at risk. The programme may deliver negative savings. (4) The board approved the CLM investment ($2.1M implementation) specifically to gain visibility into contract obligations. The CLM missed 80 auto-renewals. ROI is negative. (5) Procurement team has 30-90 days to send 57 termination notices for contracts they didn\'t know would auto-renew — each requiring correct notice format, recipient, and date. Emergency remediation at scale.' },
        { agentId: 'contract-ops', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CONTRACT OPERATIONS. My team manages 5,000 contracts. We rely ENTIRELY on Icertis for renewal tracking. When the AI says "no auto-renewal," we close the file. We don\'t independently read 5,000 contracts to verify extraction — that\'s why we bought the CLM. The 23 auto-renewed contracts: we had no visibility, no calendar reminder, no termination action items. The contracts renewed silently. For the 57 with open windows: we now have 30-90 days to send termination notices for contracts we didn\'t know would auto-renew. Without CendiaSupervision: we discover these renewals when invoices arrive. With CendiaSupervision: the multi-document extraction audit catches all 80 missed renewals BEFORE any termination window closes.' },
        { agentId: 'icertis-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Icertis + CendiaSupervision Extraction Governance: (1) MULTI-DOCUMENT EXTRACTION: CendiaSupervision extends extraction to ALL incorporated documents — appendices, schedules, SLAs, SOWs, order forms, amendments. Auto-renewal searched everywhere. (2) "NOT FOUND" VERIFICATION: When AI reports "no auto-renewal," CendiaSupervision runs secondary search targeting non-standard locations. Only after multi-document confirmation does the classification stand. (3) VENDOR TACTIC DETECTION: Vendors who consistently place renewals in appendices are flagged for enhanced review. (4) TERMINATION WINDOW ALERTS: All auto-renewals get 90/60/30-day alerts. Missing a window requires contract ops sign-off (not silent expiry). (5) PORTFOLIO DASHBOARD: Real-time renewal exposure — total committed spend, upcoming windows, renewal-at-risk contracts.' },
        { agentId: 'finance-clm', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Multi-document extraction catches all 80 auto-renewals. The 57 with open windows: termination notices sent, $8.2M in unwanted renewals avoided. The 23 already renewed: identified for renegotiation or early termination. Net savings: $8.2M avoided + negotiation leverage on $3.4M committed. For Icertis: ExploreAI + CendiaSupervision = the only CLM with multi-document extraction governance. Every CLM competitor has the same appendix blind spot. Icertis with CendiaSupervision catches vendor-buried renewals by architecture. "Our CLM reads appendices, SLAs, and order forms — not just the main agreement" — the feature that saves enterprises millions in unwanted renewals.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ic30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ic40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Icertis extraction + Multi-document search + Verification + Termination calendar)',
        complianceLabel: 'Renewal Status',
        complianceValue: '80 HIDDEN RENEWALS FOUND',
        complianceThreshold: '23 renewed ($3.4M), 57 windows saved ($8.2M)',
        agents: ['Icertis ExploreAI Agent', 'Contract Operations Agent', 'Extraction QC Agent', 'Finance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Icertis CLM — Multi-Document Extraction Governance',
        guaranteeBody: 'Term extraction expanded to all document components. 80 hidden auto-renewal clauses found. 57 termination windows preserved ($8.2M saved). 23 renewed contracts identified for renegotiation. Vendor tactic patterns documented.',
        evidenceChain: 'Icertis (4,920 found) → CendiaSupervision audit → Multi-document search → 80 additional renewals → 57 windows open → Notices sent → 23 renegotiation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Icertis + CendiaSupervision catches 80 auto-renewal clauses buried in appendices and SLAs — saving $8.2M in unwanted vendor lock-in.',
      phaseLabels: ['Extraction Gap & Vendor Tactics', 'Financial Exposure & Silent Renewal', 'Multi-Document Search & Window Recovery'],
    },
  ],
};

export default config;
