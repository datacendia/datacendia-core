/**
 * Binance Enhanced Sandbox Config
 *
 * Banking/Finance-specific scenarios with live data features
 * Access: /sandbox/binance (Key: BN-81)
 *
 * @module pages/sandbox/configs/binance-enhanced
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Binance',
  accessKey: 'BN-81',
  sessionKey: 'binance-sandbox-unlocked',

  accent: 'amber',
  accentColor: 'text-amber-400',
  accentHover: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
  ringColor: 'focus:ring-amber-500/30',
  borderColor: 'border-amber-500/30',
  gradientFrom: 'from-amber-600/20',
  gradientTo: 'to-amber-900/20',

  footerNote: 'Real-time transaction monitoring + AML compliance + Market surveillance for Binance × Datacendia',

  scenarios: [
    // SCENARIO 1 — REAL-TIME AML TRANSACTION MONITORING
    {
      id: 'aml-transaction-monitoring',
      title: 'Real-Time AML Transaction Monitoring',
      subtitle: 'Suspicious pattern detection · $2.3M in flagged transactions · Regulatory reporting · Live data feeds',
      banner: 'Simulating Binance\'s AML compliance challenge: Real-time transaction monitoring detects suspicious patterns across multiple trading pairs. AI identifies potential money laundering activities, generates SARs, and provides cryptographic evidence for regulatory audits.',
      risk: 'Critical',
      scenarioNum: 'AML-01',
      icon: 'shield',
      color: 'text-amber-400',
      agents: [
        { id: 'aml-ai', name: 'AML AI Agent', role: 'Pattern Recognition & Risk Scoring', icon: '🤖', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'compliance', name: 'Compliance Officer Agent', role: 'Regulatory Reporting & SAR Generation', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'risk-analyst', name: 'Risk Analyst Agent', role: 'Transaction Analysis & Threshold Monitoring', icon: '📊', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'regulatory', name: 'Regulatory Interface Agent', role: 'FIU Reporting & Audit Trail', icon: '🏛️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'Binance Trading API', status: 'connected', type: 'Live Transaction Feed', icon: 'database', detail: '15,423 transactions/sec processed • 47 flagged patterns detected' },
        { name: 'AML Pattern Engine', status: 'connected', type: 'AI Pattern Recognition', icon: 'brain', detail: 'Neural network analyzing 200+ risk indicators in real-time' },
        { name: 'FIU Reporting Gateway', status: 'syncing', type: 'Regulatory Interface', icon: 'send', detail: 'SAR template ready • FIU connection established' },
        { name: 'Blockchain Analytics', status: 'connected', type: 'On-Chain Analysis', icon: 'link', detail: 'Wallet clustering • Transaction graph analysis • Fund tracing' },
      ],
      script: [
        { agentId: 'aml-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AML AI monitoring active. Real-time analysis of Binance trading flow: 15,423 transactions/second across 487 trading pairs. Pattern detection algorithm identified 47 suspicious transactions totaling $2.3M USD. Key risk indicators detected: (1) Rapid account-to-account transfers below reporting threshold, (2) Structured deposits across multiple accounts, (3) High-frequency trading with no profit motive, (4) Cross-chain transfers to privacy wallets. Current risk score: 8.7/10. Immediate SAR generation recommended for 12 high-priority accounts.' },
        { agentId: 'risk-analyst', phase: 'phase1', type: 'warning', delay: 2500, content: 'RISK THRESHOLD BREACH DETECTED. Transaction volume exceeds established AML thresholds: (1) Single account receiving 473 deposits under $10K threshold totaling $4.7M in 24 hours, (2) 12 accounts exhibiting identical trading patterns suggesting coordinated activity, (3) $890K transferred to mixers within 2 hours of deposit. FINCEN guidance requires SAR filing within 30 days of detection. Current time-to-SAR: 2 hours 14 minutes. Pattern matches known money laundering typologies: (a) Chain hopping, (b) Smurfing, (c) Layering through multiple accounts.' },
        { agentId: 'compliance', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — REGULATORY EXPOSURE CONCERN. Current SAR generation process has critical gaps: (1) Manual review bottleneck — 47 suspicious transactions, only 12 SARs prepared, (2) Inconsistent narrative quality across SARs, (3) Missing blockchain evidence links, (4) No cryptographic proof of detection timing. If audited: Potential $100M+ fines for inadequate AML program, possible license suspension in key jurisdictions. Binance faces regulatory action in 5 jurisdictions for similar deficiencies in 2023. Need immediate architectural solution for SAR generation and evidence preservation.' },
        { agentId: 'regulatory', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — FIU REPORTING REQUIREMENTS. Multiple Financial Intelligence Units require enhanced due diligence: (1) US FinCEN — Complete transaction history, blockchain analysis, and beneficial ownership information, (2) EU FIUs — GDPR-compliant data sharing with evidence preservation, (3) Asia-Pacific FIUs — Real-time reporting capabilities. Current system cannot provide: (a) Immutable evidence of when patterns were detected, (b) Complete audit trail of analyst decisions, (c) Cryptographic verification of data integrity. Regulatory penalties for inadequate reporting: Up to 10% of global revenue per jurisdiction.' },
        { agentId: 'aml-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PROPOSING BINANCE + CENDIA AML GOVERNANCE: (1) REAL-TIME DETECTION HASHING: Every suspicious pattern detection is cryptographically hashed with timestamp, creating immutable evidence of when AI identified the risk. (2) AUTOMATED SAR GENERATION: AI drafts SAR narratives with required regulatory elements, compliance officer reviews and signs digitally. (3) BLOCKCHAIN EVIDENCE CHAIN: All on-chain analysis, wallet clustering, and fund tracing sealed in evidence bundle. (4) MULTI-JURISDICTIONAL REPORTING: Single detection generates jurisdiction-specific reports for all relevant FIUs simultaneously. (5) AUDIT TRAIL VERIFICATION: Every analyst decision, override, or escalation is cryptographically logged.' },
        { agentId: 'compliance', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Cendia AML governance architecture addresses all regulatory concerns: (1) Detection timing is cryptographically proven — no disputes about when patterns were identified, (2) SAR quality is consistent — AI ensures all required elements are included, (3) Evidence preservation is complete — blockchain analysis and transaction graphs are sealed, (4) Multi-jurisdictional compliance is automated — no missed reporting deadlines. This transforms AML from manual compliance to architectural compliance. Binance can demonstrate to regulators that AML is built into the system architecture, not just added as an afterthought.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (47 suspicious transactions + AI detection hash + SAR narratives + FIU submissions)',
        complianceLabel: 'AML Compliance Status',
        complianceValue: 'REAL-TIME MONITORING ACTIVE',
        complianceThreshold: '47/47 patterns detected, 12 SARs generated, 5 FIUs notified',
        agents: ['AML AI Agent', 'Compliance Officer Agent', 'Risk Analyst Agent', 'Regulatory Interface Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance AML — Real-Time Detection, Cryptographically Proven Compliance',
        guaranteeBody: 'This cryptographic bundle seals the complete AML compliance chain: Real-time transaction monitoring (15,423 TPS), AI pattern detection (47 suspicious transactions), automated SAR generation, blockchain evidence preservation, and multi-jurisdictional FIU reporting. Regulatory audit defense, penalty protection, and license security — all architecturally guaranteed.',
        evidenceChain: 'Transaction feed → AI pattern detection → Risk scoring → SAR generation → Compliance review → FIU submission → Ed25519 + RFC 3161 seal',
        complianceScore: 88,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 180000).toISOString(),
            type: 'analysis',
            title: 'Real-Time Monitoring Started',
            description: 'AML AI began analyzing 15,423 transactions/second across 487 trading pairs',
            agent: 'AML AI Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 120000).toISOString(),
            type: 'warning',
            title: 'Suspicious Patterns Detected',
            description: '47 transactions flagged totaling $2.3M with structured deposit patterns',
            agent: 'Risk Analyst Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'dissent',
            title: 'Compliance Gap Identified',
            description: 'Manual SAR process bottleneck creates regulatory exposure risk',
            agent: 'Compliance Officer Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'proposal',
            title: 'Cendia AML Architecture Proposed',
            description: 'Automated SAR generation with cryptographic evidence preservation',
            agent: 'AML AI Agent',
            impact: 'high'
          },
          {
            timestamp: new Date().toISOString(),
            type: 'resolution',
            title: 'Regulatory Compliance Achieved',
            description: 'All 47 patterns documented, 12 SARs filed, 5 FIUs notified simultaneously',
            agent: 'Regulatory Interface Agent',
            impact: 'high'
          }
        ]
      },
      idleTitle: 'Ready to Monitor',
      idleDesc: '4 AI agents will demonstrate real-time AML monitoring with pattern detection, SAR generation, and multi-jurisdictional compliance.',
      phaseLabels: ['Transaction Monitoring & Pattern Detection', 'Risk Assessment & Compliance Gaps', 'Automated SAR Generation & FIU Reporting'],
    },

    // SCENARIO 2 — MARKET MANIPULATION DETECTION
    {
      id: 'market-manipulation',
      title: 'AI Market Manipulation Detection',
      subtitle: 'Spoofing patterns · Wash trading detection · Order book analysis · Regulatory enforcement',
      banner: 'Advanced AI surveillance detects sophisticated market manipulation: Spoofing algorithms creating fake order depth, wash trading across multiple accounts, and pump-and-dump schemes. Real-time analysis protects market integrity and provides evidence for regulatory enforcement.',
      risk: 'High',
      scenarioNum: 'MKT-02',
      icon: 'trending-up',
      color: 'text-red-400',
      agents: [
        { id: 'market-ai', name: 'Market Surveillance AI', role: 'Order Book Analysis & Pattern Detection', icon: '🤖', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'trading-analyst', name: 'Trading Analyst Agent', role: 'Market Microstructure Analysis', icon: '📈', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'enforcement', name: 'Enforcement Agent', role: 'Regulatory Action & Evidence Collection', icon: '⚖️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'exchange', name: 'Exchange Operations Agent', role: 'Trading Halt & Market Protection', icon: '🏢', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'Order Book Feed', status: 'connected', type: 'Real-Time Market Data', icon: 'database', detail: 'Level 2 data for 487 pairs • 1.2M orders/sec analyzed' },
        { name: 'Pattern Recognition Engine', status: 'connected', type: 'AI Market Surveillance', icon: 'brain', detail: 'Spoofing detection • Wash trading identification • Cross-market analysis' },
        { name: 'Regulatory Alert System', status: 'syncing', type: 'SEC/CFTC Interface', icon: 'alert-triangle', detail: 'Manipulation alerts ready • Evidence bundle prepared' },
        { name: 'Trading Control API', status: 'connected', type: 'Market Intervention', icon: 'pause', detail: 'Account freeze capability • Trading halt authority' },
      ],
      script: [
        { agentId: 'market-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Market surveillance AI active. Analyzing order book data for BTC/USDT: 1.2M orders/second, 473 active traders. Manipulation patterns detected: (1) Spoofing algorithm placing 10,000+ fake orders then canceling within 200ms, creating artificial depth, (2) Wash trading across 12 accounts with identical timestamps, (3) Coordinated pump activity in low-volume altcoins, (4) Cross-market arbitrage manipulation. Estimated market impact: $4.7M in artificial volume, legitimate traders affected: 2,847. Regulatory violation probability: 94%.' },
        { agentId: 'trading-analyst', phase: 'phase1', type: 'flag', delay: 2500, content: 'MANIPULATION CONFIRMED. Technical analysis reveals sophisticated spoofing bot: (1) Pattern repeats every 3.7 seconds with 87% accuracy, (2) Orders placed at 0.1% intervals to create fake support/resistance, (3) Cancel rate: 98.3% (normal: 15-20%), (4) Account cluster analysis shows single operator controlling 12 accounts via API keys. This violates CFTC Rule 1.59 (prohibition on spoofing) and SEC Rule 10b-5 (market manipulation). Immediate action required to prevent further market damage.' },
        { agentId: 'exchange', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — EXCHANGE RISK ASSESSMENT. Current response capabilities insufficient: (1) Manual review takes 45+ minutes while manipulation continues, (2) No automated trading halt for detected spoofing, (3) Evidence collection is retrospective, not real-time, (4) Regulatory reporting requires manual compilation. If manipulation continues: Market integrity damage estimated at $12M/hour, potential regulatory fines $50M+, loss of trader confidence irreversible. Need immediate architectural solution for real-time intervention.' },
        { agentId: 'enforcement', phase: 'phase2', type: 'warning', delay: 2500, content: 'REGULATORY ENFORCEMENT REQUIREMENTS. SEC and CFTC require: (1) Real-time detection and intervention capabilities, (2) Complete evidence preservation including order book snapshots, (3) Trading halts within 5 minutes of manipulation detection, (4) Automated regulatory reporting with all evidence. Current system provides none of these. Enforcement actions taken against exchanges for inadequate surveillance in 2023: Binance $4.3B, Coinbase $100M, Kraken undisclosed. Binance cannot afford another enforcement action.' },
        { agentId: 'market-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PROPOSING BINANCE + CENDIA MARKET INTEGRITY: (1) REAL-TIME SPOOFING DETECTION: AI identifies manipulation patterns within 100ms of order placement, (2) AUTOMATED TRADING HALTS: Immediate suspension of identified accounts, (3) EVIDENCE PRESERVATION: Complete order book snapshots sealed cryptographically, (4) REGULATORY REPORTING: Automated generation of SEC/CFTC reports with all required evidence, (5) MARKET PROTECTION: Coordinated halts across affected trading pairs to prevent cascading damage.' },
        { agentId: 'enforcement', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Cendia Market Integrity provides architectural protection: (1) Manipulation detected and stopped in real-time, preventing $12M/hour damage, (2) Complete evidence preserved for regulatory enforcement, (3) Automated reporting satisfies SEC/CFTC requirements, (4) Trading halts protect market integrity and legitimate traders. This transforms market surveillance from reactive enforcement to proactive protection. Binance can demonstrate to regulators that market integrity is architecturally guaranteed.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:bn30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'bn40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Spoofing detection + Account halts + Order book evidence + Regulatory reports)',
        complianceLabel: 'Market Integrity Status',
        complianceValue: 'MANIPULATION STOPPED',
        complianceThreshold: '12 accounts halted, $4.7M artificial volume removed, SEC/CFTC notified',
        agents: ['Market Surveillance AI', 'Trading Analyst Agent', 'Enforcement Agent', 'Exchange Operations Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Binance Market Integrity — Real-Time Protection, Architectural Enforcement',
        guaranteeBody: 'This cryptographic bundle seals the complete market protection chain: Real-time spoofing detection (100ms response), automated account halts, order book evidence preservation, and regulatory reporting. Market integrity protection, enforcement defense, and trader confidence — all architecturally guaranteed.',
        evidenceChain: 'Order book feed → AI pattern detection → Spoofing confirmed → Accounts halted → Evidence preserved → Regulatory reports → Ed25519 + RFC 3161 seal',
        complianceScore: 91,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 150000).toISOString(),
            type: 'analysis',
            title: 'Market Surveillance Initiated',
            description: 'AI began analyzing 1.2M orders/sec for manipulation patterns',
            agent: 'Market Surveillance AI',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 90000).toISOString(),
            type: 'flag',
            title: 'Spoofing Pattern Confirmed',
            description: '98.3% cancel rate across 12 accounts indicates sophisticated manipulation',
            agent: 'Trading Analyst Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'dissent',
            title: 'Exchange Response Gap',
            description: 'Manual intervention too slow, $12M/hour market damage continues',
            agent: 'Exchange Operations Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'proposal',
            title: 'Automated Protection Proposed',
            description: 'Real-time detection with immediate account halts and evidence preservation',
            agent: 'Market Surveillance AI',
            impact: 'high'
          },
          {
            timestamp: new Date().toISOString(),
            type: 'resolution',
            title: 'Market Integrity Restored',
            description: 'All spoofing accounts halted, $4.7M artificial volume removed, regulators notified',
            agent: 'Enforcement Agent',
            impact: 'high'
          }
        ]
      },
      idleTitle: 'Ready to Protect',
      idleDesc: '4 AI agents will demonstrate real-time market manipulation detection with automated intervention and regulatory compliance.',
      phaseLabels: ['Market Surveillance & Pattern Detection', 'Risk Assessment & Exchange Response', 'Automated Protection & Regulatory Reporting'],
    },
  ],
};

export default config;
