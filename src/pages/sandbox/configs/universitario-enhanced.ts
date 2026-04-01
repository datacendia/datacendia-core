/**
 * Universitario de Deportes Enhanced Sandbox Config
 *
 * Sports-specific scenarios with transfer analytics and player governance
 * Access: /sandbox/universitario (Key: UDEP-26)
 *
 * @module pages/sandbox/configs/universitario-enhanced
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'UNIVERSITARIO DE DEPORTES',
  accessKey: 'UDEP-26',
  sessionKey: 'universitario-sandbox-unlocked',

  accent: 'amber',
  accentColor: 'text-amber-400',
  accentHover: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
  ringColor: 'focus:ring-amber-500/30',
  borderColor: 'border-amber-500/30',
  gradientFrom: 'from-amber-600/20',
  gradientTo: 'to-amber-900/20',

  footerNote: 'Transfer market analytics + Player contract compliance + Financial Fair Play for Universitario × Datacendia',

  scenarios: [
    // SCENARIO 1 — TRANSFER MARKET ANALYTICS
    {
      id: 'transfer-market-analytics',
      title: 'Transfer Market Analytics & Compliance',
      subtitle: 'Player valuation models · FFP compliance · Multi-club ownership · Transfer window governance',
      banner: 'Universitario faces complex transfer decisions: AI analyzes player valuations against market benchmarks, ensures Financial Fair Play compliance, detects potential multi-club ownership conflicts, and provides cryptographic evidence for FPF and CONMEBOL audits.',
      risk: 'High',
      scenarioNum: 'TRN-01',
      icon: 'trending-up',
      color: 'text-amber-400',
      agents: [
        { id: 'transfer-ai', name: 'Transfer Analytics AI', role: 'Player Valuation & Market Analysis', icon: '🤖', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'financial', name: 'Financial Director Agent', role: 'FFP Compliance & Budget Management', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal', name: 'Legal Compliance Agent', role: 'Transfer Regulations & Contract Law', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'scouting', name: 'Technical Director Agent', role: 'Player Assessment & Team Needs', icon: '👥', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'Transfer Market API', status: 'connected', type: 'Global Player Database', icon: 'database', detail: '23,847 players tracked • 1,247 active transfers • Real-time valuations' },
        { name: 'FFP Calculator', status: 'connected', type: 'Financial Fair Play Engine', icon: 'calculator', detail: 'Budget: $8.2M • Available: $3.4M • FFP score: 87/100' },
        { name: 'Ownership Registry', status: 'syncing', type: 'Multi-Club Detection', icon: 'users', detail: 'Scanning 47 agents for conflicts • 3 potential conflicts flagged' },
        { name: 'CONMEBOL Gateway', status: 'connected', type: 'Regulatory Interface', icon: 'send', detail: 'Transfer documentation ready • Compliance certificates prepared' },
      ],
      script: [
        { agentId: 'transfer-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Transfer market analysis complete for Universitario. Target players identified: (1) striker from Alianza Lima - valuation $2.8M, market comp $3.2M, 15 goals/season, (2) midfielder from Sporting Cristal - valuation $1.9M, market comp $2.1M, 89% pass accuracy, (3) defender from Cusco FC - valuation $1.2M, market comp $1.5M, 78% tackle success. AI recommendation: All three players undervalued by 10-15% relative to market. Total transfer cost: $5.9M. Budget available: $3.4M. Gap: $2.5M.' },
        { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 2500, content: 'FINANCIAL FAIR PLAY COMPLIANCE ALERT. Current transfer activity: (1) Total expenditure proposed: $5.9M, (2) FFP limit: 70% of revenue ($8.2M), (3) Current utilization: 62%, (4) Proposed utilization: 89% - EXCEEDS LIMIT. CONMEBOL FFP regulations require clubs to maintain maximum 70% revenue-to-expenditure ratio. Violation consequences: (a) Transfer ban for 2 windows, (b) $500K fine, (c) European competition exclusion. Need player sales or alternative financing to maintain compliance.' },
        { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — REGULATORY COMPLIANCE GAPS. Transfer analysis reveals critical issues: (1) Multi-club ownership conflict: Target striker shares agent with 2 Universitario players, (2) Third-party ownership: Cusco FC defender 40% owned by investment fund, (3) Contract duration: Sporting Cristal midfielder has 18 months remaining - below FPF minimum 2 years for international transfers, (4) Work permit complications: 2 targets non-EU, require special CONMEBOL approval. Current compliance process manual - high error risk, no audit trail.' },
        { agentId: 'scouting', phase: 'phase2', type: 'flag', delay: 2500, content: 'TECHNICAL ASSESSMENT COMPLETE. Player analysis: (1) Striker - Perfect fit for 4-3-3 formation, 89% conversion rate in box, but injury history: 3 hamstring injuries in 18 months, (2) Midfielder - Excellent pressing stats, covers 12.4km/game, but tactical flexibility limited to central role, (3) Defender - Strong aerial dominance (78% won), but pace below Liga 1 average. Technical recommendation: Proceed with midfielder only, seek alternatives for striker and defender. Total cost: $1.9M - within budget and FFP compliance.' },
        { agentId: 'transfer-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PROPOSING UNIVERSITARIO + CENDIA TRANSFER GOVERNANCE: (1) REAL-TIME VALUATION: AI continuously monitors global market, updates valuations hourly, (2) FFP COMPLIANCE ENGINE: Automatic calculation of revenue-to-expenditure ratio, prevents violations before they occur, (3) MULTI-CLUB DETECTION: Blockchain registry of agent relationships prevents conflicts of interest, (4) REGULATORY AUTOMATION: CONMEBOL/FPF documentation generated automatically, (5) CRYPTOGRAPHIC AUDIT TRAIL: Every decision, valuation, and compliance check sealed for regulatory review.' },
        { agentId: 'financial', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Cendia Transfer Governance provides complete compliance: (1) FFP compliance guaranteed through real-time monitoring, (2) Multi-club conflicts prevented through blockchain registry, (3) Regulatory documentation automated and error-free, (4) Audit trail provides complete evidence for FPF and CONMEBOL. This transforms transfer management from reactive compliance to architectural governance. Universitario can demonstrate to regulators that every transfer is compliant, fairly valued, and properly documented.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ud10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ud20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (3 player valuations + FFP compliance + Multi-club checks + Regulatory approvals)',
        complianceLabel: 'Transfer Compliance Status',
        complianceValue: 'GOVERNANCE COMPLIANT',
        complianceThreshold: '1 transfer approved, FFP maintained, 0 conflicts detected',
        agents: ['Transfer Analytics AI', 'Financial Director Agent', 'Legal Compliance Agent', 'Technical Director Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Universitario Transfers — AI-Powered Analytics, Cryptographically Compliant',
        guaranteeBody: 'This cryptographic bundle seals the complete transfer governance chain: Real-time player valuations, FFP compliance monitoring, multi-club ownership detection, and regulatory documentation. Transfer market advantage, compliance assurance, and audit protection — all architecturally guaranteed.',
        evidenceChain: 'Market analysis → Player valuations → FFP calculation → Conflict detection → Regulatory approval → Ed25519 + RFC 3161 seal',
        complianceScore: 85,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 180000).toISOString(),
            type: 'analysis',
            title: 'Transfer Market Analysis Started',
            description: 'AI began analyzing 23,847 players for Universitario transfer targets',
            agent: 'Transfer Analytics AI',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 120000).toISOString(),
            type: 'warning',
            title: 'FFP Compliance Alert',
            description: 'Proposed $5.9M expenditure would exceed 70% revenue-to-expenditure ratio',
            agent: 'Financial Director Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 90000).toISOString(),
            type: 'dissent',
            title: 'Regulatory Gaps Identified',
            description: 'Multi-club ownership conflicts and third-party ownership issues detected',
            agent: 'Legal Compliance Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'flag',
            title: 'Technical Assessment Complete',
            description: 'Only midfielder recommended due to injury concerns and tactical fit',
            agent: 'Technical Director Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'proposal',
            title: 'Transfer Governance Proposed',
            description: 'AI-powered compliance engine with real-time FFP monitoring',
            agent: 'Transfer Analytics AI',
            impact: 'high'
          },
          {
            timestamp: new Date().toISOString(),
            type: 'resolution',
            title: 'Compliant Transfer Approved',
            description: '1 transfer approved within FFP limits, 0 regulatory conflicts',
            agent: 'Financial Director Agent',
            impact: 'high'
          }
        ]
      },
      idleTitle: 'Ready to Analyze',
      idleDesc: '4 AI agents will demonstrate transfer market analytics with FFP compliance and regulatory governance.',
      phaseLabels: ['Market Analysis & Player Valuation', 'Compliance Assessment & Technical Review', 'Automated Governance & Regulatory Approval'],
    },

    // SCENARIO 2 — PLAYER CONTRACT GOVERNANCE
    {
      id: 'player-contract-governance',
      title: 'Player Contract Governance & Salary Cap',
      subtitle: 'Contract compliance · Salary cap management · Performance incentives · Regulatory reporting',
      banner: 'Universitario manages complex player contracts: AI ensures compliance with Liga 1 salary cap, performance-based incentive structures, and regulatory reporting requirements while protecting both player and club interests through smart contract governance.',
      risk: 'Medium',
      scenarioNum: 'CTR-02',
      icon: 'file-text',
      color: 'text-emerald-400',
      agents: [
        { id: 'contract-ai', name: 'Contract AI Agent', role: 'Smart Contract Analysis & Compliance', icon: '🤖', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'hr', name: 'HR Director Agent', role: 'Player Relations & Contract Negotiations', icon: '👥', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'financial', name: 'Financial Controller Agent', role: 'Salary Cap & Budget Management', icon: '💰', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal', name: 'Legal Counsel Agent', role: 'Contract Law & Labor Compliance', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'Contract Database', status: 'connected', type: 'Player Agreement Repository', icon: 'database', detail: '47 active contracts • $12.3M total commitments • 4 expiring this month' },
        { name: 'Salary Cap Engine', status: 'connected', type: 'Liga 1 Compliance', icon: 'calculator', detail: 'Cap: $15M • Used: $12.3M (82%) • Available: $2.7M' },
        { name: 'Performance Metrics', status: 'connected', type: 'Player Analytics', icon: 'trending-up', detail: 'Goals/assists tracked • Bonus triggers calculated • Inflation adjustments applied' },
        { name: 'FPF Registry', status: 'syncing', type: 'Regulatory Reporting', icon: 'send', detail: 'Quarterly reports ready • Compliance certificates generated' },
      ],
      script: [
        { agentId: 'contract-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Contract portfolio analysis complete. Universitario player commitments: (1) 47 active contracts, total value $12.3M, (2) Liga 1 salary cap: $15M, current utilization 82%, (3) 4 contracts expiring in 30 days requiring renewal decisions, (4) Performance bonus triggers: 12 players eligible for $890K in bonuses, (5) Inflation adjustment clauses: 8 contracts with annual 3% increases. Contract compliance status: 94% compliant, 3 contracts require amendment for Liga 1 regulations.' },
        { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 2500, content: 'SALARY CAP RISK ASSESSMENT. Current situation: (1) Cap utilization: 82% ($12.3M/$15M), (2) Pending renewals: 4 contracts estimated $2.1M total, (3) Bonus obligations: $890K triggered this quarter, (4) Inflation adjustments: $240K additional annual cost. Without contract optimization: Cap utilization will reach 91% - exceeds Liga 1 warning threshold of 85%. Consequences: (a) Transfer restrictions, (b) $250K fine, (c) Reduced bonus pool for next season. Need strategic contract management.' },
        { agentId: 'hr', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — PLAYER RELATIONS CONCERNS. Current contract management creates player dissatisfaction: (1) Manual bonus calculations delayed by 3-4 weeks, (2) Inflation adjustments inconsistently applied, (3) Performance metrics disputed by 6 players, (4) Contract amendments lack transparency. Impact: (a) Player morale declining, (b) 3 key players considering transfers, (c) Negotiation leverage lost, (d) Potential $4.7M in player value loss. Need automated, transparent contract governance system.' },
        { agentId: 'legal', phase: 'phase2', type: 'flag', delay: 2500, content: 'CONTRACT COMPLIANCE ISSUES IDENTIFIED. Legal review reveals: (1) 3 contracts violate Liga 1 maximum duration rules, (2) 2 bonus structures not compliant with FPF performance metrics, (3) 1 third-party ownership agreement not properly disclosed, (4) 4 contracts missing required injury protection clauses. Regulatory exposure: FPF fines up to $100K per violation, potential contract nullification, player registration suspension. Current manual review process error rate: 17% - unacceptable for regulatory compliance.' },
        { agentId: 'contract-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PROPOSING UNIVERSITARIO + CENDIA CONTRACT GOVERNANCE: (1) SMART CONTRACT ENGINE: Automated compliance checking against Liga 1 and FPF rules, (2) REAL-TIME SALARY CAP: Continuous monitoring with automatic alerts for cap breaches, (3) PERFORMANCE BONUS AUTOMATION: Instant calculation and payment based on verified metrics, (4) TRANSPARENT AMENDMENTS: All contract changes logged and communicated to players, (5) REGULATORY REPORTING: Automated generation of FPF compliance certificates and quarterly reports.' },
        { agentId: 'financial', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Cendia Contract Governance solves all issues: (1) Salary cap maintained at 82% with automated optimization, (2) Player satisfaction improved through transparent bonus calculations, (3) Regulatory compliance 100% through automated rule checking, (4) $4.7M player value preserved through better relations. This transforms contract management from administrative burden to strategic advantage. Universitario can demonstrate to players and regulators that contracts are fair, compliant, and professionally managed.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ud30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ud40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (47 contracts + Salary cap compliance + Bonus automation + Regulatory approval)',
        complianceLabel: 'Contract Compliance Status',
        complianceValue: 'SALARY CAP COMPLIANT',
        complianceThreshold: '82% cap utilization, 100% regulatory compliance, $0 player disputes',
        agents: ['Contract AI Agent', 'HR Director Agent', 'Financial Controller Agent', 'Legal Counsel Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Universitario Contracts — Smart Governance, Player-Centric Compliance',
        guaranteeBody: 'This cryptographic bundle seals the complete contract governance chain: Smart contract compliance checking, real-time salary cap monitoring, automated bonus calculations, and regulatory reporting. Player satisfaction guaranteed, compliance assured, and value protected — all architecturally managed.',
        evidenceChain: 'Contract analysis → Compliance checking → Salary cap monitoring → Bonus automation → Regulatory approval → Ed25519 + RFC 3161 seal',
        complianceScore: 87,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 150000).toISOString(),
            type: 'analysis',
            title: 'Contract Portfolio Analysis',
            description: 'AI began analyzing 47 contracts worth $12.3M for compliance and optimization',
            agent: 'Contract AI Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 90000).toISOString(),
            type: 'warning',
            title: 'Salary Cap Risk Identified',
            description: 'Pending renewals would push utilization to 91% exceeding Liga 1 limits',
            agent: 'Financial Controller Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'dissent',
            title: 'Player Relations Issues',
            description: 'Manual bonus calculations causing dissatisfaction and transfer consideration',
            agent: 'HR Director Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'flag',
            title: 'Regulatory Compliance Gaps',
            description: '3 contracts violate Liga 1 rules, $100K fine risk per violation',
            agent: 'Legal Counsel Agent',
            impact: 'high'
          },
          {
            timestamp: new Date().toISOString(),
            type: 'resolution',
            title: 'Smart Contract Governance Active',
            description: 'All contracts compliant, salary cap optimized, player satisfaction restored',
            agent: 'Contract AI Agent',
            impact: 'high'
          }
        ]
      },
      idleTitle: 'Ready to Govern',
      idleDesc: '4 AI agents will demonstrate smart contract governance with salary cap compliance and player relations optimization.',
      phaseLabels: ['Contract Analysis & Compliance Check', 'Financial Assessment & Player Relations', 'Smart Governance & Regulatory Compliance'],
    },
  ],
};

export default config;
