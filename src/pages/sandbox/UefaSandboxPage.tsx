/**
 * Page — UEFA Sandbox Demo
 *
 * Bespoke sandbox for UEFA / Aleksander Čeferin executive outreach.
 * 5 fully scripted multi-agent deliberation scenarios at regulator scale.
 *
 * Access: /sandbox/uefa (Key: UEFA-FSR-26)
 *
 * @exports UefaSandboxPage
 * @module pages/sandbox/UefaSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import { Activity, Banknote, Scale, Globe, FileText, Shield, MessageSquare, Database, Shuffle, DollarSign } from 'lucide-react';
import type { ScenarioConfig, Agent } from './SandboxShared';
import { AccessGate, SandboxShell } from './SandboxShared';

// =============================================================================
// UEFA-SPECIFIC AGENT DEFINITIONS
// =============================================================================

const A = {
  financialAuditor: { id: 'fin-auditor', name: 'Financial Auditor Agent', role: 'UEFA FSR Financial Analysis & Fair Market Value', icon: '📊', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' } as Agent,
  legalAgent: { id: 'legal', name: 'Legal Agent', role: 'CJEU Jurisprudence & EU Competition Law', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' } as Agent,
  casAppeals: { id: 'cas', name: 'CAS Appeals Agent', role: 'Court of Arbitration for Sport Defence Simulation', icon: '🏛️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' } as Agent,
  fsrCompliance: { id: 'fsr', name: 'FSR Compliance Agent', role: 'Financial Sustainability Regulations 2024', icon: '💶', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' } as Agent,
  integrity: { id: 'integrity', name: 'Integrity Agent', role: 'Competition Integrity & Anti-Corruption', icon: '🛡️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' } as Agent,
  whistleblower: { id: 'whistle', name: 'CendiaWhistle Agent', role: 'Cryptographic Anonymity & Ring Signatures', icon: '🔐', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' } as Agent,
  drawMaster: { id: 'draw', name: 'Draw Ceremony Agent', role: 'Seeding Algorithm & Ball Allocation AI', icon: '🎱', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' } as Agent,
  distribution: { id: 'distrib', name: 'Prize Distribution Agent', role: 'Revenue Allocation & Statutory Compliance', icon: '💰', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' } as Agent,
  antiTrust: { id: 'antitrust', name: 'Competition Law Agent', role: 'TFEU Article 101/102 & CJEU Precedent', icon: '🇪🇺', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' } as Agent,
};

// =============================================================================
// SCENARIO 1 — "RED FLAG" FSR AUDIT
// =============================================================================

const SCENARIO_FSR_AUDIT: ScenarioConfig = {
  id: 'fsr-audit',
  title: 'The "Red Flag" FSR Audit — State-Owned Sponsorship',
  subtitle: 'Top 5 League club · £40M hidden wages · 400% above market value · State-owned entity sponsorship',
  banner: 'Simulating a UEFA Financial Control Body investigation where a Top 5 League club is suspected of hiding £40M in wages through a sponsorship agreement with a state-owned entity. All data is simulated for demonstration purposes.',
  risk: 'Critical',
  scenarioNum: 'FSR Audit',
  icon: <Activity className="w-4 h-4" />,
  color: 'text-cyan-400',
  agents: [A.financialAuditor, A.legalAgent, A.casAppeals, A.fsrCompliance],
  connectors: [
    { name: 'UEFA FSR Database', status: 'connected', type: 'Financial Sustainability Regulations', icon: <Banknote className="w-4 h-4" />, detail: 'Club X: FSR filings 2022-2026 loaded' },
    { name: 'Market Value Comparator', status: 'connected', type: 'Sponsorship Benchmarking AI', icon: <Activity className="w-4 h-4" />, detail: 'Industry avg: £9.2M for comparable sponsorships' },
    { name: 'CJEU Case Law Database', status: 'connected', type: 'European Court Jurisprudence', icon: <Scale className="w-4 h-4" />, detail: 'Super League ruling (C-333/21) indexed' },
    { name: 'CAS Precedent Engine', status: 'syncing', type: 'Arbitration Case History', icon: <Globe className="w-4 h-4" />, detail: '2,847 sports arbitration cases indexed' },
  ],
  script: [
    { agentId: 'fin-auditor', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL FLAG. Club X has declared a "Technology & Innovation Sponsorship" worth £41.2M/year from a state-owned sovereign wealth entity. Our Fair Market Value (FMV) comparator benchmarks this category of sponsorship at £9.2M for a club of equivalent reach, brand value, and commercial metrics. The declared value is 448% above market standard. This constitutes a prima facie disguised equity injection under UEFA FSR Article 12(2) — Related Party Transaction rules. The £32M excess should be reclassified as owner contribution and excluded from football revenues.' },
    { agentId: 'fsr', phase: 'phase1', type: 'analysis', delay: 2500, content: 'FSR recalculation initiated. If the £32M excess is reclassified as equity injection: Club X\'s break-even result deteriorates from +£4.1M to -£27.9M over the assessment period. This triggers a breach of UEFA FSR Article 65 (break-even requirement) and Article 73 (Squad Cost Ratio). The club\'s reported Squad Cost Ratio of 62% would recalculate to 89%, nearly 20 points above the 70% threshold. This is a Category 1 violation warranting sporting sanctions.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before issuing sanctions, we must stress-test against the CJEU "Super League" Ruling (C-333/21, December 2023). The Court ruled that UEFA must apply "transparent, objective, non-discriminatory and proportionate" criteria when exercising regulatory power. Club X\'s legal team will argue that (a) the FMV methodology is subjective, (b) the sponsorship reflects genuine Middle Eastern market rates, and (c) UEFA is acting as an illegal monopoly under TFEU Article 102. We need mathematical proof that the FMV calculation is objective and replicable.' },
    { agentId: 'cas', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. I have simulated a CAS defence for Club X using 340 comparable cases. Findings: (1) 12% probability that a human auditor\'s manual spreadsheet notes would be dismissed as "insufficiently rigorous" — this happened in CAS 2020/A/6785. (2) 23% probability that Club X successfully argues "regional market premium" for Gulf-based sponsorships. (3) 67% probability that CAS upholds UEFA\'s sanction IF the evidence bundle includes cryptographically sealed FMV calculations with transparent methodology. The key vulnerability is auditability of the methodology, not the conclusion.' },
    { agentId: 'fin-auditor', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia CAS-Ready Evidence Bundle: (1) FMV calculation uses 12-factor regression model trained on 4,200 comparable sponsorships across 55 UEFA associations — fully transparent and replicable. (2) Every data point, weighting, and calculation step is cryptographically sealed with SHA-256 hashing and ML-DSA-65 post-quantum signatures. (3) The complete reasoning chain from raw data to conclusion is embedded in the Merkle tree. No human "notes" — only mathematical proof.' },
    { agentId: 'cas', phase: 'phase3', type: 'resolution', delay: 2500, content: 'RECALCULATING defence probabilities with Datacendia evidence bundle: (1) Probability of "insufficiently rigorous" dismissal drops from 12% to 0.3% — cryptographic sealing eliminates human error arguments. (2) "Regional market premium" defence weakened to 8% — the 4,200-sponsorship dataset includes 340 Gulf-region deals. (3) Overall probability of CAS upholding UEFA sanction rises from 67% to 94.2%. The evidence is mathematically final.' },
    { agentId: 'legal', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'The 12-factor FMV model satisfies CJEU "transparent, objective, non-discriminatory" criteria. The cryptographic sealing means Club X cannot argue methodological bias — every step is verifiable. Dissent WITHDRAWN. I am recommending UEFA proceed with Category 1 sanctions: one-year Champions League exclusion, with the CAS-Ready Evidence Bundle attached to the formal charges. This sanction is unappealable on methodological grounds.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:8b7df143d91c716ecfa5fc1730022f6b421b05cedee8fd52b1fc65a96030ad52',
    merkleRoot: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
    merkleLabel: 'Merkle Tree Root (FMV model + 4,200 sponsorship dataset + FSR filings + CJEU precedent)',
    complianceLabel: 'FSR Squad Cost Ratio (Adjusted)',
    complianceValue: '89% — BREACH',
    complianceThreshold: 'threshold: 70%',
    agents: ['Financial Auditor Agent', 'Legal Agent', 'CAS Appeals Agent', 'FSR Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'CAS-Ready Evidence Bundle — Sanctions Unappealable',
    guaranteeBody: 'This cryptographic bundle seals UEFA\'s complete FSR investigation: the 12-factor Fair Market Value model, 4,200-sponsorship benchmark dataset, Club X\'s financial filings, and the reasoning chain from raw data to Category 1 violation finding. Every calculation step is SHA-256 hashed and ML-DSA-65 signed. CAS appeal probability of overturning: 5.8%. The evidence is mathematically final.',
    evidenceChain: 'Club X FSR filings → Sponsorship benchmarking (4,200 deals) → 12-factor FMV regression → Related Party reclassification → Break-even recalculation → Squad Cost Ratio → CJEU compliance check → CAS defence simulation → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will investigate a suspected £40M hidden wage scheme disguised as a state-owned entity sponsorship. Watch them build a CAS-Ready Evidence Bundle that makes UEFA\'s sanctions mathematically unappealable.',
  phaseLabels: ['Financial Red Flag Detection', 'Legal & CAS Stress-Testing', 'Evidence Sealing & Sanctions'],
};

// =============================================================================
// SCENARIO 2 — CENDIAWHISTLE FFP INVESTIGATION
// =============================================================================

const SCENARIO_WHISTLE: ScenarioConfig = {
  id: 'whistle-ffp',
  title: 'CendiaWhistle — FFP Corruption Investigation',
  subtitle: 'Anonymous report · Financial Fair Play fraud · Ring signature anonymity across 55 associations',
  banner: 'Simulating an anonymous whistleblower report from within a UEFA member association alleging systematic FFP fraud. CendiaWhistle ring signatures guarantee mathematical anonymity — even UEFA cannot identify the source.',
  risk: 'Critical',
  scenarioNum: 'Whistleblower',
  icon: <MessageSquare className="w-4 h-4" />,
  color: 'text-violet-400',
  agents: [A.whistleblower, A.integrity, A.legalAgent, A.fsrCompliance],
  connectors: [
    { name: 'CendiaWhistle Portal', status: 'connected', type: 'Anonymous Reporting', icon: <MessageSquare className="w-4 h-4" />, detail: 'Ring signature verified — reporter among 55 associations' },
    { name: 'UEFA Integrity Database', status: 'connected', type: 'Historical Investigations', icon: <Shield className="w-4 h-4" />, detail: '1,247 prior integrity cases indexed' },
    { name: 'Club Licensing Portal', status: 'connected', type: 'Licensing Submissions', icon: <FileText className="w-4 h-4" />, detail: 'All 55 association licensing data 2020-2026' },
    { name: 'UEFA Legal Archive', status: 'syncing', type: 'Disciplinary Precedent', icon: <Scale className="w-4 h-4" />, detail: 'CFCB adjudicatory chamber decisions' },
  ],
  script: [
    { agentId: 'whistle', phase: 'phase1', type: 'warning', delay: 800, content: 'PRIORITY ALERT. An anonymous report has been received via CendiaWhistle alleging that a national association\'s Club Licensing Committee has been systematically approving false financial statements for 3 clubs over 4 seasons. The report includes specific document references, meeting dates, and the names of 4 officials. CendiaWhistle ring signatures confirm the reporter is authenticated as a UEFA-affiliated individual across the 55-association network. Their specific association, role, and identity are mathematically sealed — even under Swiss court order, the identity CANNOT be extracted.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cross-referencing report details against UEFA\'s Club Licensing database. CONFIRMED: The 3 named clubs each received "clean" licensing approvals despite their published financial statements showing anomalies. Club A: reported revenue growth of 340% over 3 years with no corresponding commercial contracts. Club B: player amortisation figures inconsistent with transfer fees reported to FIFA TMS. Club C: related-party transactions totalling €67M with no independent FMV assessment. Pattern analysis suggests coordinated fraud at the association level, not isolated club misconduct.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before escalating to the CFCB Adjudicatory Chamber, we must consider the EU Whistleblower Directive (2019/1937). UEFA is headquartered in Switzerland but operates across all 27 EU member states. If this investigation becomes public and the whistleblower is identified, UEFA faces massive liability under EU law. Furthermore, the named officials may have diplomatic protections within their national football structures. I am mandating that ALL investigative actions be conducted through Datacendia\'s zero-knowledge proof system — no human investigator should know the source.' },
    { agentId: 'fsr', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. If the 3 clubs\' financial statements are fraudulent, their UCL/UEL participation over 4 seasons may have been unlawful. This creates a cascade: (1) potential prize money clawback of €43M, (2) sporting results may need to be annulled, (3) competing clubs who missed qualification may file damages claims. The financial exposure to UEFA is estimated at €120-180M including litigation costs. This must be contained before it becomes a public scandal.' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing sealed investigation protocol: (1) CendiaWhistle report preserved with ring signature — mathematical proof of authenticity without identity disclosure. (2) All cross-referencing performed within Datacendia\'s sovereign environment — no data leaves the sealed computation. (3) Investigation findings delivered to CFCB as a cryptographic evidence bundle, ready for adjudicatory proceedings. (4) Whistleblower protection guaranteed by mathematics, not by policy.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Sealed investigation protocol satisfies EU Whistleblower Directive, Swiss Federal Act on Data Protection (nDSG), and UEFA\'s own Ethics and Disciplinary Code. The ring signature system provides stronger anonymity protection than any legal framework requires — it is impossible, not merely prohibited, to identify the source. Dissent WITHDRAWN. Recommending immediate escalation to CFCB Investigatory Chamber with sealed evidence bundle.' },
    { agentId: 'whistle', phase: 'phase3', type: 'resolution', delay: 2000, content: 'CendiaWhistle evidence bundle sealed. The reporter will receive an anonymous, encrypted acknowledgment through the ring signature return channel — confirming their report has been actioned without revealing any investigation details. Mathematical anonymity preserved throughout. Zero-knowledge proof of report authenticity attached to CFCB referral.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    merkleRoot: 'e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683',
    merkleLabel: 'Merkle Tree Root (Ring signature + Report content + Cross-reference data + CFCB referral)',
    complianceLabel: 'Whistleblower Protection',
    complianceValue: 'MATHEMATICAL',
    complianceThreshold: 'identity unextractable',
    agents: ['CendiaWhistle Agent', 'Integrity Agent', 'Legal Agent', 'FSR Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'EU Whistleblower Directive — Mathematical Anonymity Guaranteed',
    guaranteeBody: 'This cryptographic bundle seals the anonymous whistleblower report, cross-referencing evidence, and CFCB investigation referral. The CendiaWhistle ring signature mathematically guarantees the reporter\'s identity cannot be extracted — even under court order, even by Datacendia itself. Investigation findings are sealed for adjudicatory proceedings.',
    evidenceChain: 'CendiaWhistle ring signature → Anonymous report → Club Licensing cross-reference → Financial anomaly detection → Pattern analysis → CFCB referral → Zero-knowledge authentication → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will process an anonymous FFP corruption report, ensuring mathematical whistleblower anonymity while building a sealed evidence chain for the UEFA CFCB.',
  phaseLabels: ['Anonymous Report Triage', 'Legal & Financial Escalation', 'Sealed Investigation Protocol'],
};

// =============================================================================
// SCENARIO 3 — UCL DRAW INTEGRITY
// =============================================================================

const SCENARIO_DRAW: ScenarioConfig = {
  id: 'draw-integrity',
  title: 'UCL Draw Integrity — Preventing a 2021 Redraw',
  subtitle: 'Champions League knockout · 36 clubs · Complex constraint-satisfaction · Live broadcast to 400M',
  banner: 'Simulating the new Champions League format draw where the seeding algorithm must satisfy dozens of constraints while proving to 400M viewers that the process was fair and unmanipulated.',
  risk: 'High',
  scenarioNum: 'Draw Integrity',
  icon: <Shuffle className="w-4 h-4" />,
  color: 'text-orange-400',
  agents: [A.drawMaster, A.integrity, A.legalAgent, A.casAppeals],
  connectors: [
    { name: 'UEFA Draw Engine', status: 'connected', type: 'Constraint-Satisfaction Algorithm', icon: <Shuffle className="w-4 h-4" />, detail: 'New format: 36-team league phase → knockout' },
    { name: 'Association & Group Database', status: 'connected', type: 'Draw Constraints', icon: <Database className="w-4 h-4" />, detail: '47 constraints active for this draw' },
    { name: 'Broadcast Partner Feed', status: 'connected', type: 'TV Pairing Requirements', icon: <Globe className="w-4 h-4" />, detail: '12 broadcaster constraint sets loaded' },
    { name: 'CAS 2021 Redraw Archive', status: 'connected', type: 'Historical Precedent', icon: <FileText className="w-4 h-4" />, detail: 'Man Utd v PSG error case study indexed' },
  ],
  script: [
    { agentId: 'draw', phase: 'phase1', type: 'analysis', delay: 800, content: 'Draw algorithm initialised for the Champions League knockout round. 36-team league phase results loaded. 47 active constraints: (1) No same-association pairings in Round of 16, (2) Group opponents cannot face each other, (3) Broadcaster pairing requirements for 12 territory-exclusive deals, (4) Seeded vs unseeded allocations, (5) Venue availability constraints for 2-leg ties. The constraint-satisfaction space has 2.4 × 10¹⁴ valid permutations. Algorithm has pre-computed all valid draw paths. Random seed will be generated from atmospheric noise at draw time.' },
    { agentId: 'integrity', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. In the 2021 UCL Round of 16 draw, a software error caused Manchester United to be incorrectly placed in the pot against Villarreal, violating the same-group constraint. The entire draw was voided and redrawn — causing global embarrassment, CAS challenges, and betting market chaos. The root cause was a manual ball-removal process that the software failed to track. I am mandating that every single ball allocation in this draw is cryptographically sealed BEFORE the next ball is drawn. Zero tolerance for software-manual desynchronisation.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The constraint-satisfaction algorithm is an AI system making decisions that affect commercial outcomes worth €2B+ in broadcasting and prize money. Under the EU AI Act (effective August 2025), this constitutes a high-risk AI system under Annex III. UEFA must provide: (1) a human-readable explanation of why each pairing was selected, (2) proof that the random seed was genuinely random and not pre-determined, (3) a full audit trail accessible to any club that challenges the result. The "atmospheric noise" random seed must be independently verifiable.' },
    { agentId: 'cas', phase: 'phase2', type: 'warning', delay: 2500, content: 'WARNING. After the 2021 redraw, Atlético Madrid filed a CAS appeal arguing that the second draw was also flawed because the "randomness" was compromised by the sequence of events. CAS dismissed the case (CAS 2022/A/8571) but noted that UEFA lacked "cryptographic proof of algorithmic integrity." If a similar error occurs with the new 36-team format, the financial exposure is 10x larger. Any club eliminated in a disputed draw could claim €50-200M in lost revenue. We need proof that is admissible BEFORE the draw begins, not after a challenge.' },
    { agentId: 'draw', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Draw Integrity Protocol: (1) BEFORE the draw: The complete constraint-satisfaction algorithm is cryptographically hashed and published to all 36 clubs — any club can verify the code. (2) DURING the draw: Each ball allocation is timestamped with CendiaChronos and sealed into a Merkle tree in real-time. The random seed is derived from NIST Randomness Beacon + atmospheric noise, independently verifiable. (3) AFTER the draw: Any club can request the full audit trail and independently verify every constraint was satisfied. Total transparency in under 60 seconds.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Draw Integrity Protocol satisfies EU AI Act requirements for high-risk systems: transparency, explainability, and human oversight are all embedded. The pre-published algorithm hash means no club can claim the code was changed mid-draw. The NIST Randomness Beacon provides independent verification of the random seed. Dissent WITHDRAWN. This protocol would have prevented the 2021 disaster entirely.' },
    { agentId: 'cas', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'With Datacendia\'s Draw Integrity Protocol, a CAS challenge becomes mathematically futile. Any challenging club can independently verify: (a) the algorithm matched the pre-published hash, (b) the random seed came from NIST, (c) every constraint was satisfied at every step. Estimated probability of a successful CAS challenge: 0.1%. The draw result becomes provably fair. Warning WITHDRAWN.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451',
    merkleRoot: 'aff97ba8d4fb6ca8946527a1f67ad2e2d35a4e4b5a80e55c8ff2b7e89de0d07e',
    merkleLabel: 'Merkle Tree Root (Algorithm hash + NIST random seed + 47 constraints + Ball allocations)',
    complianceLabel: 'Draw Integrity',
    complianceValue: '47/47 CONSTRAINTS',
    complianceThreshold: 'all satisfied',
    agents: ['Draw Ceremony Agent', 'Integrity Agent', 'Legal Agent', 'CAS Appeals Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'UEFA Draw Integrity — Provably Fair & CAS-Proof',
    guaranteeBody: 'This cryptographic bundle seals the complete Champions League draw process: the pre-published algorithm hash, NIST Randomness Beacon seed, all 47 constraint validations, and every ball allocation with CendiaChronos timestamps. Any of the 36 clubs can independently verify the entire draw. CAS challenge probability: 0.1%.',
    evidenceChain: 'Algorithm pre-publish → NIST Randomness Beacon → Atmospheric noise seed → Ball allocation 1-16 → Real-time Merkle sealing → Constraint validation (47/47) → Club verification portal → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will simulate the Champions League draw integrity protocol — preventing a repeat of the 2021 redraw disaster through cryptographic proof of fairness.',
  phaseLabels: ['Algorithm Initialisation', 'Legal & Precedent Analysis', 'Integrity Protocol Activation'],
};

// =============================================================================
// SCENARIO 4 — €2B+ PRIZE MONEY DISTRIBUTION
// =============================================================================

const SCENARIO_PRIZE: ScenarioConfig = {
  id: 'prize-money',
  title: 'Prize Money Distribution — €2B+ Provable Allocation',
  subtitle: 'UCL + UEL + UECL · 223 clubs · €2.4B total · Statutory compliance across 55 associations',
  banner: 'Simulating the allocation of €2.4B in UEFA competition prize money across 223 clubs, proving every euro was distributed exactly per the statutes and that no club received preferential treatment.',
  risk: 'High',
  scenarioNum: 'Prize Money',
  icon: <DollarSign className="w-4 h-4" />,
  color: 'text-yellow-400',
  agents: [A.distribution, A.financialAuditor, A.legalAgent, A.fsrCompliance],
  connectors: [
    { name: 'UEFA Prize Money Engine', status: 'connected', type: 'Allocation Calculation', icon: <DollarSign className="w-4 h-4" />, detail: '€2.4B across UCL/UEL/UECL' },
    { name: 'Competition Results Database', status: 'connected', type: 'Match Results & Standings', icon: <Activity className="w-4 h-4" />, detail: '1,247 matches across 3 competitions' },
    { name: 'TV Revenue Pool', status: 'connected', type: 'Market Pool Calculations', icon: <Globe className="w-4 h-4" />, detail: '55 association broadcast deals loaded' },
    { name: 'Club Banking Portal', status: 'syncing', type: 'Payment Verification', icon: <Banknote className="w-4 h-4" />, detail: '223 club payment accounts verified' },
  ],
  script: [
    { agentId: 'distrib', phase: 'phase1', type: 'analysis', delay: 800, content: 'Prize money allocation engine initiated. Total pool: €2,437,000,000. Components: (1) Performance-based payments: €1,134M (46.5%), (2) Market pool (TV revenue share): €853M (35.0%), (3) Coefficient-based allocation: €450M (18.5%). The allocation algorithm processes 223 clubs across UCL (36), UEL (36), and UECL (36) league phases plus knockout stages. Each club\'s payment is calculated from 14 variables including match results, historical coefficient, and national TV market value. Total calculations: 3,122 individual payment lines.' },
    { agentId: 'fin-auditor', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The market pool calculation shows that clubs from the top 5 broadcasting markets (England, Spain, Germany, Italy, France) receive 72% of the TV revenue pool despite representing only 31% of participating clubs. While this is mathematically correct per the statutes, 3 smaller-market clubs have formally questioned whether the allocation formula is "fair and equitable" as required by UEFA Statutes Article 50. Historical audit shows the gap has widened from 64% to 72% over 5 seasons. This is a political risk even if mathematically compliant.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The 3 clubs\' complaints may not succeed on mathematical grounds but they create a governance risk. Under the CJEU "Super League" Ruling, UEFA must demonstrate that its revenue distribution is "proportionate" and does not constitute an abuse of dominant position under TFEU Article 102. If the market pool gap continues to widen, a legal challenge becomes plausible. I am mandating that the allocation engine provide a human-readable explanation for EVERY club\'s payment — not just a number, but the reasoning chain showing exactly how it was calculated.' },
    { agentId: 'fsr', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. 17 of the 223 clubs are currently under FSR monitoring for break-even compliance. Their prize money payments are subject to conditional holds under UEFA FSR Article 68. If any payment is released to an FSR-monitored club that subsequently fails to meet its break-even target, UEFA could face a governance challenge from compliant clubs. The allocation engine must flag these 17 payments for conditional processing.' },
    { agentId: 'distrib', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Provable Allocation Protocol: (1) Every club receives a personalised "Payment Receipt" showing the exact calculation chain: match results → coefficient → market pool share → total. (2) The complete allocation algorithm and all 3,122 payment lines are sealed in a Merkle tree — any club can verify their payment AND every other club\'s payment. (3) The 17 FSR-monitored clubs receive conditional payment certificates linked to their break-even compliance status. (4) Total transparency: no club can claim preferential treatment because every calculation is independently verifiable.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Provable Allocation Protocol addresses CJEU proportionality requirements. Every club can verify the algorithm and challenge any calculation with mathematical evidence rather than speculation. The human-readable reasoning chain for each payment satisfies transparency obligations under UEFA Statutes Article 50. Dissent WITHDRAWN. This is the first time prize money distribution would be provably fair across all 223 clubs.' },
    { agentId: 'fin-auditor', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Market pool gap is acknowledged and documented within the provable allocation. Smaller-market clubs now have transparency to understand exactly why the gap exists (TV market size differential) and can advocate for formula changes with data, not speculation. Flag WITHDRAWN. All 3,122 payment lines verified and sealed.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    merkleRoot: 'b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78',
    merkleLabel: 'Merkle Tree Root (3,122 payment lines + Match results + Coefficients + Market pool data)',
    complianceLabel: 'Allocation Verified',
    complianceValue: '223/223 CLUBS',
    complianceThreshold: '€2.437B distributed',
    agents: ['Prize Distribution Agent', 'Financial Auditor Agent', 'Legal Agent', 'FSR Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'UEFA Statutes Article 50 — Provably Fair Distribution',
    guaranteeBody: 'This cryptographic bundle seals the complete €2.437B prize money allocation across 223 clubs in 3 competitions. Every payment is calculated from 14 variables, documented with a human-readable reasoning chain, and independently verifiable via the sealed Merkle tree. 17 FSR-monitored payments flagged with conditional holds. No club can claim preferential treatment — every calculation is mathematically transparent.',
    evidenceChain: 'Match results (1,247) → Historical coefficients → TV market pool (55 associations) → 14-variable calculation → 3,122 payment lines → FSR conditional holds (17 clubs) → Club payment receipts → Merkle tree seal → ML-DSA-65 signature',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will allocate €2.4B in UEFA prize money across 223 clubs, proving every calculation is transparent, fair, and independently verifiable.',
  phaseLabels: ['Allocation Calculation', 'Fairness & Compliance Challenges', 'Provable Distribution Sealing'],
};

// =============================================================================
// SCENARIO 5 — CJEU SUPER LEAGUE DEFENCE
// =============================================================================

const SCENARIO_SUPERLEAGUE: ScenarioConfig = {
  id: 'super-league',
  title: 'CJEU Super League Defence — Antitrust Compliance',
  subtitle: 'TFEU Article 101/102 · C-333/21 ruling · Proportionality framework · A22 Sports challenge',
  banner: 'Simulating UEFA\'s response to a renewed breakaway league challenge following the CJEU Super League ruling. The platform must prove that every UEFA regulatory decision satisfies the Court\'s "transparent, objective, non-discriminatory and proportionate" standard.',
  risk: 'Critical',
  scenarioNum: 'Antitrust',
  icon: <Scale className="w-4 h-4" />,
  color: 'text-sky-400',
  agents: [A.antiTrust, A.legalAgent, A.casAppeals, A.fsrCompliance],
  connectors: [
    { name: 'CJEU Case Law Engine', status: 'connected', type: 'European Court Jurisprudence', icon: <Scale className="w-4 h-4" />, detail: 'C-333/21 (Super League) fully indexed' },
    { name: 'UEFA Regulatory Archive', status: 'connected', type: 'All UEFA Decisions 2020-2026', icon: <FileText className="w-4 h-4" />, detail: '4,847 regulatory decisions indexed' },
    { name: 'EU Competition Authority', status: 'connected', type: 'DG Competition Filings', icon: <Globe className="w-4 h-4" />, detail: 'Standing connection for Article 101/102' },
    { name: 'A22 Sports Legal Filings', status: 'syncing', type: 'Breakaway League Documents', icon: <Database className="w-4 h-4" />, detail: 'All public filings and statements' },
  ],
  script: [
    { agentId: 'antitrust', phase: 'phase1', type: 'warning', delay: 800, content: 'STRATEGIC ALERT. A22 Sports (the entity behind the European Super League) has filed a new complaint with DG Competition alleging that UEFA\'s reformed Champions League format still constitutes an abuse of dominant position under TFEU Article 102. Their core argument: (1) The new 36-team format increases the number of guaranteed games for "established" clubs, (2) The coefficient-based allocation rewards historical performance, creating a "closed shop", (3) UEFA\'s dual role as regulator and competition organiser creates an inherent conflict of interest that the CJEU ruling identified but did not resolve.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'The CJEU ruling in C-333/21 established four key criteria that ALL UEFA regulatory decisions must satisfy: (1) Transparent — the rules and their application must be publicly accessible, (2) Objective — decisions must be based on measurable criteria, not subjective judgement, (3) Non-discriminatory — all clubs must be treated equally regardless of size or market, (4) Proportionate — sanctions and restrictions must not exceed what is necessary. A22\'s new challenge will focus on whether UEFA can PROVE compliance with all four criteria across every regulatory decision. This is where Datacendia becomes essential.' },
    { agentId: 'cas', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. I have simulated A22\'s legal strategy using 340 prior EU competition cases. Their strongest argument is "proportionality." Specifically: UEFA banned 3 clubs from European competition in 2023-2025 for FSR breaches. In each case, the sanction was determined by a human committee with no published methodology for how the severity was calculated. A22 will argue that a human-committee sanction is inherently subjective and therefore fails the CJEU "objective" test. They have a 34% probability of success on this specific point — which is dangerously high.' },
    { agentId: 'fsr', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. A22\'s point about FSR sanctions is valid. I have reviewed 47 CFCB sanctioning decisions from 2020-2026. The severity of sanctions (fine amount, competition exclusion period) shows a correlation with club size and media attention rather than with the mathematical severity of the breach. A small-market club that breached FSR by 3% received a 1-year ban, while a large-market club that breached by 8% received only a fine. This inconsistency is indefensible under the CJEU "non-discriminatory" criterion.' },
    { agentId: 'antitrust', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia "Sovereign Shield" for UEFA Regulatory Compliance: (1) EVERY future UEFA regulatory decision — sanctions, licensing approvals, revenue allocations — is processed through Datacendia\'s multi-agent deliberation system. (2) Each decision generates a Regulator\'s Receipt proving the decision satisfies all 4 CJEU criteria: transparent (algorithm published), objective (mathematical calculation), non-discriminatory (same formula for all clubs), proportionate (severity scaled to breach magnitude). (3) The complete archive of 4,847 historical decisions is retroactively audited and any inconsistencies are flagged for review.' },
    { agentId: 'cas', phase: 'phase3', type: 'resolution', delay: 2500, content: 'RECALCULATING A22 challenge probability with Datacendia Sovereign Shield: (1) "Subjective sanctions" argument drops from 34% to 2% — every sanction now has a mathematical severity formula. (2) "Closed shop" argument drops from 22% to 7% — coefficient allocation formula is transparent and verifiable. (3) Overall probability of A22 succeeding at EU level drops from 31% to 4.8%. The Sovereign Shield doesn\'t just defend UEFA — it makes UEFA\'s governance model the gold standard for international sports federations. Dissent WITHDRAWN.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2000, content: 'Sovereign Shield protocol transforms UEFA\'s defensive position. Instead of arguing in court that its decisions are fair, UEFA can PROVE it mathematically. Every Regulator\'s Receipt is a pre-built court exhibit. The 4 CJEU criteria become checkboxes that are automatically verified before any decision is issued. You tell Čeferin: "We don\'t just defend you from the Super League — we make you unassailable." Resolution CONFIRMED.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
    merkleRoot: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
    merkleLabel: 'Merkle Tree Root (CJEU criteria + 4,847 decisions audit + Sanction formula + A22 defence simulation)',
    complianceLabel: 'CJEU Compliance',
    complianceValue: '4/4 CRITERIA MET',
    complianceThreshold: 'transparent, objective, non-discriminatory, proportionate',
    agents: ['Competition Law Agent', 'Legal Agent', 'CAS Appeals Agent', 'FSR Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'CJEU C-333/21 — UEFA Governance Made Unassailable',
    guaranteeBody: 'This cryptographic bundle seals UEFA\'s complete antitrust defence: the Sovereign Shield framework ensuring every regulatory decision satisfies the 4 CJEU criteria, the retroactive audit of 4,847 historical decisions, and the mathematical sanction severity formula. A22 Sports challenge probability reduced from 31% to 4.8%. UEFA\'s governance model becomes the gold standard for international sports regulation.',
    evidenceChain: 'CJEU C-333/21 criteria → 4,847 decision audit → Sanction severity formula → Coefficient allocation transparency → A22 challenge simulation → DG Competition filing response → Sovereign Shield activation → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will defend UEFA against the renewed Super League antitrust challenge, transforming reactive legal defence into proactive mathematical proof of fair governance.',
  phaseLabels: ['Threat Assessment', 'Vulnerability Analysis', 'Sovereign Shield Activation'],
};

// =============================================================================
// ALL SCENARIOS
// =============================================================================

const SCENARIOS: ScenarioConfig[] = [SCENARIO_FSR_AUDIT, SCENARIO_WHISTLE, SCENARIO_DRAW, SCENARIO_PRIZE, SCENARIO_SUPERLEAGUE];

// =============================================================================
// EXPORT — PAGE WITH ACCESS GATE
// =============================================================================

const UefaSandboxPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('uefa-sandbox-unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem('uefa-sandbox-unlocked', 'true');
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <AccessGate
        onUnlock={handleUnlock}
        accessKey="UEFA-FSR-26"
        orgName="UEFA"
        accentColor="text-blue-400"
        accentHover="from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600"
        ringColor="focus:ring-blue-500/30"
        borderColor="border-blue-500/30"
        gradientFrom="from-blue-600/20"
        gradientTo="to-blue-900/20"
        sessionKey="uefa-sandbox-unlocked"
      />
    );
  }

  return (
    <SandboxShell
      scenarios={SCENARIOS}
      orgLabel="UEFA"
      accent="blue"
      footerNote="200+ regulatory scenarios mapped for UEFA · Full architecture document available on request"
    />
  );
};

export default UefaSandboxPage;
