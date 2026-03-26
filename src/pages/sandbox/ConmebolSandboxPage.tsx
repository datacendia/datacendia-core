/**
 * Page — CONMEBOL Sandbox Demo
 *
 * Bespoke sandbox for CONMEBOL / Alejandro Domínguez executive outreach.
 * 10 fully scripted multi-agent deliberation scenarios — post-corruption governance.
 *
 * Access: /sandbox/conmebol (Key: CONMEBOL-26)
 *
 * @exports ConmebolSandboxPage
 * @module pages/sandbox/ConmebolSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import { Activity, Banknote, Scale, Globe, FileText, Shield, MessageSquare, Database, Eye, DollarSign, AlertTriangle as Gavel, Users, Ban, Landmark, FlaskConical } from 'lucide-react';
import type { ScenarioConfig, Agent, ShellLabels } from './SandboxShared';
import { AccessGate, SandboxShell, DEFAULT_LABELS, ES_LABELS } from './SandboxShared';
import { ES_DATA } from './conmebol-i18n-es';
import type { ScenarioES } from './conmebol-i18n-es';

// =============================================================================
// CONMEBOL-SPECIFIC AGENT DEFINITIONS
// =============================================================================

const A = {
  dojCompliance: { id: 'doj', name: 'DOJ Compliance Agent', role: 'US Department of Justice Monitoring & Anti-Corruption', icon: '🇺🇸', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' } as Agent,
  integrityAgent: { id: 'integrity', name: 'Integrity Agent', role: 'Match-Fixing Detection & Betting Anomaly Analysis', icon: '🛡️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' } as Agent,
  legalAgent: { id: 'legal', name: 'Legal Agent', role: 'CAS Jurisprudence & 10-Jurisdiction Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' } as Agent,
  commercialAgent: { id: 'commercial', name: 'Commercial Agent', role: 'Media Rights Valuation & Anti-Corruption Compliance', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' } as Agent,
  whistleblower: { id: 'whistle', name: 'CendiaWhistle Agent', role: 'Cryptographic Anonymity & Ring Signatures', icon: '🔐', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' } as Agent,
  tpoDetection: { id: 'tpo', name: 'TPO Detection Agent', role: 'Third-Party Ownership & Shell Company Analysis', icon: '🔍', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' } as Agent,
  youthProtection: { id: 'youth', name: 'Youth Protection Agent', role: 'FIFA Article 19 & Child Safeguarding', icon: '👦', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' } as Agent,
  financialAgent: { id: 'finance', name: 'Financial Distribution Agent', role: 'Revenue Allocation & Equity Monitoring', icon: '💰', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' } as Agent,
  antiDoping: { id: 'doping', name: 'Anti-Doping Agent', role: 'WADA Code & Cross-Border Chain of Custody', icon: '🧪', color: 'text-pink-400', borderColor: 'border-pink-500/40', bgColor: 'bg-pink-500/10' } as Agent,
  varAgent: { id: 'var', name: 'VAR Governance Agent', role: 'Officiating Technology & IFAB Compliance', icon: '📹', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' } as Agent,
  ethicsAgent: { id: 'ethics', name: 'Ethics & Discrimination Agent', role: 'Anti-Racism Enforcement & FIFA Three-Step Protocol', icon: '🚫', color: 'text-rose-400', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-500/10' } as Agent,
  governanceAgent: { id: 'governance', name: 'Governance Reform Agent', role: 'Post-FIFAgate Electoral Integrity & Conflict-of-Interest', icon: '🏛️', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' } as Agent,
};

// =============================================================================
// SCENARIO 1 — POST-FIFAGATE DOJ COMPLIANCE AUDIT
// =============================================================================

const SCENARIO_DOJ: ScenarioConfig = {
  id: 'doj-compliance',
  title: 'Post-FIFAgate — US DOJ Compliance Audit',
  subtitle: 'FBI/DOJ monitoring · 7 imprisoned executives · $1.5B Copa América cycle · Ongoing federal scrutiny',
  banner: 'Simulating a US DOJ compliance review of CONMEBOL\'s reformed governance following the 2015 FIFAgate scandal. The DOJ demands real-time evidence that every material decision demonstrates integrity — not just policy documents, but cryptographic proof of reformed governance.',
  risk: 'Critical',
  scenarioNum: 'DOJ Audit',
  icon: <Gavel className="w-4 h-4" />,
  color: 'text-blue-400',
  agents: [A.dojCompliance, A.commercialAgent, A.legalAgent, A.integrityAgent],
  connectors: [
    { name: 'US DOJ Compliance Portal', status: 'connected', type: 'Federal Monitoring Interface', icon: <Shield className="w-4 h-4" />, detail: 'Active monitoring — quarterly review due in 14 days' },
    { name: 'CONMEBOL Financial Ledger', status: 'connected', type: 'Revenue & Expenditure Tracking', icon: <Banknote className="w-4 h-4" />, detail: 'Copa Libertadores 2026: $847M in commercial deals' },
    { name: 'Traffic Sports Case Archive', status: 'connected', type: 'Historical Corruption Evidence', icon: <Database className="w-4 h-4" />, detail: '2015 indictments: 42 individuals, 7 CONMEBOL executives' },
    { name: 'Swiss Association Law Database', status: 'syncing', type: 'Paraguayan & Swiss Corporate Law', icon: <Scale className="w-4 h-4" />, detail: 'CONMEBOL statutes + Swiss association framework' },
  ],
  script: [
    { agentId: 'doj', phase: 'phase1', type: 'warning', delay: 800, content: 'QUARTERLY REVIEW ALERT. The US DOJ Eastern District of New York has requested CONMEBOL\'s Q2 2026 compliance evidence package. Specific focus areas: (1) All commercial deals exceeding $5M executed since last review — the DOJ wants proof of competitive bidding and arm\'s-length dealing, (2) Copa Libertadores broadcast rights renewal ($340M/year) — the 2015 scandal centred on Traffic Sports and Datisa bribing CONMEBOL officials for exactly these rights, (3) Any payments to intermediaries, agents, or consultants exceeding $100K. The DOJ compliance monitor has flagged that CONMEBOL\'s previous quarterly submission relied on "self-certification" rather than independent evidence. This is no longer acceptable.' },
    { agentId: 'commercial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Copa Libertadores broadcast rights renewal analysis complete. Current deal: $340M/year with a consortium. Our Fair Market Value (FMV) model — trained on 2,400 comparable global football broadcast deals — benchmarks this at $310-365M for a competition of Libertadores\' reach (680M cumulative TV audience, 10-country footprint). The deal is within the FMV range. However, the winning bidder\'s consortium includes an entity with indirect ownership links to a former CONMEBOL commercial partner from the pre-2015 era. This does not constitute corruption, but it creates an optics risk that the DOJ will question.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The indirect ownership link is legally permissible — the entity passed FIFA\'s integrity check and CONMEBOL\'s own due diligence. However, the DOJ\'s standard is not "legally permissible" but "demonstrably reformed." Under the DOJ\'s Principles of Federal Prosecution of Business Organizations (the "Filip Factors"), CONMEBOL must show that its compliance programme is not merely adequate but "effective in practice." An indirect link to a pre-scandal partner — even if innocent — will be scrutinised. I am mandating that the entire bidding process be reconstructed with full evidence: every bid received, every evaluation criterion, every score, and the documented rationale for selecting this consortium over alternatives.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Cross-referencing the consortium\'s beneficial ownership against the DOJ\'s deferred prosecution agreement (DPA) database. The indirect link traces through 3 corporate layers to an individual who was a witness (not a defendant) in the Traffic Sports trial. This individual divested from the original entity in 2018. The link is 2 corporate layers removed from the bidding entity. In a normal commercial context, this is irrelevant. In the context of CONMEBOL\'s post-FIFAgate scrutiny, the DOJ will ask why CONMEBOL did not flag this in its own due diligence submission.' },
    { agentId: 'doj', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia DOJ-Ready Evidence Package: (1) Complete bidding reconstruction — all 4 bids received, 12-factor evaluation matrix, individual scoring by 5 committee members, and documented rationale for consortium selection. Every step cryptographically sealed with CendiaChronos timestamps. (2) Enhanced due diligence addendum — the indirect ownership link is proactively disclosed with full corporate layer analysis, showing the 3-layer separation and 2018 divestiture. (3) FMV validation — the 2,400-deal benchmark dataset proves the $340M price is within market range. (4) The entire package is formatted for DOJ submission with one-click Regulator\'s Receipt generation. No more "self-certification" — mathematical proof of compliance.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DOJ-Ready Evidence Package transforms CONMEBOL\'s defensive position. Instead of answering "why didn\'t you catch this?" CONMEBOL proactively discloses the indirect link with full corporate analysis. The cryptographic sealing means the DOJ can verify that the bidding process was documented in real-time — not reconstructed after the fact. The 2,400-deal FMV model satisfies the "objective criteria" requirement. Dissent WITHDRAWN. This is the evidence standard the DOJ has been asking for since 2016.' },
    { agentId: 'integrity', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Proactive disclosure with full corporate layer analysis eliminates the DOJ\'s likely line of questioning. The beneficial ownership trace is documented, the divestiture is verified, and the 3-layer separation is mathematically mapped. Flag WITHDRAWN. Recommending this proactive disclosure model become standard for all CONMEBOL commercial deals exceeding $5M — automated beneficial ownership tracing with cryptographic evidence sealing.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:7d793037a076018657ab0282f2f435e7c86b22c56a189f7625a6da49081b2451',
    merkleRoot: 'aff97ba8d4fb6ca8946527a1f67ad2e2d35a4e4b5a80e55c8ff2b7e89de0d07e',
    merkleLabel: 'Merkle Tree Root (4 bids + 12-factor evaluation + Beneficial ownership trace + FMV dataset)',
    complianceLabel: 'DOJ Compliance Status',
    complianceValue: 'PROACTIVE DISCLOSURE',
    complianceThreshold: 'Filip Factors satisfied',
    agents: ['DOJ Compliance Agent', 'Commercial Agent', 'Legal Agent', 'Integrity Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'US DOJ Eastern District — Reformed Governance Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals CONMEBOL\'s complete Q2 2026 DOJ compliance evidence: Copa Libertadores broadcast bidding reconstruction with 4 bids, 12-factor evaluation matrix, beneficial ownership trace through 3 corporate layers, 2,400-deal FMV benchmark, and proactive disclosure of the indirect pre-scandal link. Every document is CendiaChronos timestamped proving real-time capture, not post-hoc reconstruction. The DOJ\'s "effective in practice" standard is mathematically demonstrated.',
    evidenceChain: 'Copa Libertadores RFP → 4 bids received → 12-factor evaluation → Committee scoring → Beneficial ownership trace → 3-layer corporate analysis → FMV validation (2,400 deals) → Proactive disclosure → DOJ submission format → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will prepare CONMEBOL\'s post-FIFAgate DOJ compliance submission — transforming "self-certification" into cryptographic proof of reformed governance that satisfies federal scrutiny.',
  phaseLabels: ['DOJ Review Requirements', 'Ownership & Legal Analysis', 'Proactive Disclosure Protocol'],
};

// =============================================================================
// SCENARIO 2 — COPA LIBERTADORES MATCH-FIXING
// =============================================================================

const SCENARIO_MATCHFIX: ScenarioConfig = {
  id: 'match-fixing',
  title: 'Copa Libertadores — South American Match-Fixing Ring',
  subtitle: 'Group stage · Betting anomaly across 4 countries · Organised crime syndicate · INTERPOL coordination',
  banner: 'Simulating a match-fixing detection during Copa Libertadores group stage where AI betting monitors detect coordinated anomalies across bookmakers in Argentina, Colombia, Paraguay, and Malaysia. The investigation must span 4 jurisdictions without alerting the syndicate.',
  risk: 'Critical',
  scenarioNum: 'Match-Fixing',
  icon: <Shield className="w-4 h-4" />,
  color: 'text-cyan-400',
  agents: [A.integrityAgent, A.legalAgent, A.dojCompliance, A.whistleblower],
  connectors: [
    { name: 'CONMEBOL Integrity Platform', status: 'connected', type: 'Betting Anomaly Detection', icon: <Activity className="w-4 h-4" />, detail: 'ALERT: Coordinated anomalies across 4 jurisdictions' },
    { name: 'Sportradar Integrity Services', status: 'connected', type: 'Global Betting Monitoring', icon: <Globe className="w-4 h-4" />, detail: 'Real-time feed: 400+ bookmakers across South America & Asia' },
    { name: 'INTERPOL Match-Fixing Unit', status: 'syncing', type: 'Multi-Jurisdiction Coordination', icon: <Shield className="w-4 h-4" />, detail: 'Secure channel — Argentina, Colombia, Paraguay standing by' },
    { name: 'CONMEBOL Disciplinary Database', status: 'connected', type: 'Historical Integrity Cases', icon: <Database className="w-4 h-4" />, detail: '347 prior integrity investigations indexed' },
  ],
  script: [
    { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL ALERT. Coordinated betting anomalies detected across Copa Libertadores Group F, Match #24 (Club A vs Club B, scheduled in 48 hours). Sportradar data shows: (1) "Correct Score 0-0" odds shortened from 9/1 to 3/1 across 7 South American bookmakers in the last 12 hours — 640% above normal volume. (2) Simultaneous activity on Asian handicap markets in 4 Malaysian bookmakers, consistent with syndicate-level coordinated betting. (3) Historical pattern match: this exact anomaly signature matches 3 previous confirmed match-fixing cases in Copa Sudamericana 2019-2022. The syndicate appears to be targeting a 0-0 draw by compromising both teams\' attacking players through undisclosed injuries or tactical manipulation.' },
    { agentId: 'doj', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cross-referencing with US DOJ\'s ongoing South American organised crime investigations. The Malaysian betting syndicate matches a network identified in the DOJ\'s 2023 transnational match-fixing indictment (SDNY Case No. 23-CR-847). The intermediary pattern — using local "runners" in Buenos Aires and Bogotá to approach players through social connections rather than direct payment — is consistent with the DOJ\'s intelligence. If CONMEBOL does not act on this intelligence and the match is subsequently proven fixed, the DOJ will view this as evidence that CONMEBOL\'s post-FIFAgate integrity reforms are insufficient. We must demonstrate proactive intervention.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. This investigation spans 4 criminal jurisdictions: (1) Argentina — Club A\'s home jurisdiction, Argentine Federal Police has authority, (2) Colombia — Club B\'s jurisdiction, Fiscalía General has authority, (3) Paraguay — CONMEBOL HQ jurisdiction, relevant for internal disciplinary action, (4) Malaysia — source of syndicate betting activity, Royal Malaysia Police. We cannot share intelligence with all 4 simultaneously without risking a leak that tips off the syndicate. Argentine police have a documented history of information leaking to the media within hours of receiving match-fixing intelligence. I am mandating a staggered notification protocol: INTERPOL first, then each national authority under sealed conditions with a 24-hour embargo.' },
    { agentId: 'whistle', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. CendiaWhistle has received a corroborating anonymous report from within one of the two clubs. The report states: "A player has been offered $200,000 to receive a second yellow card in the first half." The ring signature confirms the reporter is authenticated within CONMEBOL\'s club registration system but their specific club, role, and identity are mathematically sealed. This corroboration elevates the confidence level from "suspicious pattern" to "actionable intelligence." The player approach suggests the syndicate is targeting a specific tactical outcome (reduced to 10 men → defensive play → 0-0 draw).' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing coordinated integrity protocol: (1) INTERPOL notified via sealed Datacendia evidence channel — simultaneous secure briefing to Argentina, Colombia, Paraguay, and Malaysia. All intelligence cryptographically sealed to prevent partial leaks. (2) Both clubs\' captains and managers informed 6 hours pre-match under confidential integrity protocol — players warned that integrity monitoring is active without revealing specific intelligence. (3) Enhanced in-match monitoring: every yellow card, every tactical substitution, every injury stoppage tracked with real-time anomaly detection. (4) The CendiaWhistle corroborating report sealed separately — if the match is fixed despite intervention, the evidence bundle supports criminal prosecution across all 4 jurisdictions. (5) Syndicate betting activity continues to be monitored in real-time to capture maximum evidence before any arrests.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Staggered notification via INTERPOL\'s sealed channel satisfies all 4 jurisdictions\' requirements while minimising leak risk. The CendiaWhistle ring signature provides court-admissible corroboration without compromising the source — admissible under Argentine Federal Criminal Code, Colombian criminal procedure, Paraguayan law, and Malaysian Evidence Act. The 24-hour embargo prevents Argentine police leaks. Dissent WITHDRAWN. This protocol transforms reactive match-fixing investigation into proactive, multi-jurisdictional, evidence-sealed integrity enforcement.' },
    { agentId: 'doj', phase: 'phase3', type: 'resolution', delay: 2000, content: 'CONMEBOL\'s proactive intervention — acting on intelligence before the match rather than investigating after — demonstrates exactly the "effective compliance programme" the DOJ requires. The cryptographic evidence chain from betting anomaly detection → CendiaWhistle corroboration → INTERPOL coordination → match monitoring is the gold standard for post-FIFAgate integrity reform. This single investigation will feature in CONMEBOL\'s next DOJ quarterly submission as proof of reformed governance. Resolution CONFIRMED.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    merkleRoot: 'e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683',
    merkleLabel: 'Merkle Tree Root (Sportradar data + CendiaWhistle report + INTERPOL referral + 4-jurisdiction evidence)',
    complianceLabel: 'Match Integrity',
    complianceValue: 'INTERVENTION ACTIVE',
    complianceThreshold: '4 jurisdictions coordinated',
    agents: ['Integrity Agent', 'Legal Agent', 'DOJ Compliance Agent', 'CendiaWhistle Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'CONMEBOL Integrity — Multi-Jurisdiction Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete match-fixing investigation: Sportradar betting anomaly detection across 7 bookmakers, CendiaWhistle corroborating anonymous report with ring signature anonymity, INTERPOL coordination across Argentina/Colombia/Paraguay/Malaysia, and enhanced match monitoring protocol. The evidence chain is admissible in all 4 jurisdictions for criminal prosecution. Whistleblower identity is mathematically impossible to extract.',
    evidenceChain: 'Sportradar anomaly detection → Pattern matching (3 prior cases) → DOJ syndicate cross-reference → CendiaWhistle corroboration → INTERPOL sealed channel → 4-jurisdiction notification → Club integrity briefing → Enhanced match monitoring → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to a coordinated match-fixing threat across 4 South American jurisdictions — building a sealed evidence chain while coordinating INTERPOL intervention before kick-off.',
  phaseLabels: ['Anomaly Detection & Intelligence', 'Multi-Jurisdiction Legal Analysis', 'Coordinated Intervention Protocol'],
};

// =============================================================================
// SCENARIO 3 — TPO DETECTION (THIRD-PARTY OWNERSHIP)
// =============================================================================

const SCENARIO_TPO: ScenarioConfig = {
  id: 'tpo-detection',
  title: 'TPO Detection — Hidden Third-Party Ownership Ring',
  subtitle: 'Copa Libertadores club · $18M transfer · 3 shell companies · FIFA ban circumvention',
  banner: 'Simulating the detection of hidden Third-Party Ownership in a Copa Libertadores transfer where AI analysis reveals a network of shell companies in Uruguay, Panama, and the British Virgin Islands designed to circumvent FIFA\'s 2015 TPO ban — South America\'s highest-risk compliance area.',
  risk: 'Critical',
  scenarioNum: 'TPO Detection',
  icon: <Eye className="w-4 h-4" />,
  color: 'text-red-400',
  agents: [A.tpoDetection, A.legalAgent, A.commercialAgent, A.dojCompliance],
  connectors: [
    { name: 'FIFA TMS Portal', status: 'connected', type: 'Transfer Matching System', icon: <Globe className="w-4 h-4" />, detail: 'Transfer #2026-SA-4847: $18M, Player X, Club A → Club B' },
    { name: 'CONMEBOL TPO Detection Engine', status: 'connected', type: 'Beneficial Ownership Analysis', icon: <Eye className="w-4 h-4" />, detail: 'AI shell company detection active — 12,000 entity database' },
    { name: 'National Company Registries', status: 'connected', type: 'Uruguay · Panama · BVI', icon: <Database className="w-4 h-4" />, detail: 'Real-time beneficial ownership lookup' },
    { name: 'FIFA TPO Enforcement Database', status: 'syncing', type: 'Historical TPO Violations', icon: <FileText className="w-4 h-4" />, detail: '284 prior TPO cases indexed since 2015 ban' },
  ],
  script: [
    { agentId: 'tpo', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL FLAG. Transfer #2026-SA-4847: Player X transferring from Club A (Argentina) to Club B (Brazil) for $18M. Routine AI analysis of the transfer documentation has detected anomalies: (1) The selling club\'s declared ownership of Player X\'s economic rights is 100%, but payment instructions route 35% ($6.3M) to "Inversiones Río de la Plata S.A." — a Uruguayan company incorporated 11 months ago with no visible football operations. (2) A further 15% ($2.7M) routes to "Pacific Sports Holdings Ltd" — a Panamanian company with a registered agent in the British Virgin Islands. (3) The player\'s agent is listed as a director of both companies. This is a textbook TPO structure: shell companies created to hold economic rights in players while disguising third-party ownership. The FIFA TPO ban (RSTP Article 18ter) has been in force since 2015 but South America remains the highest-risk region globally.' },
    { agentId: 'commercial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Financial flow analysis confirms the TPO hypothesis. The Uruguayan entity "Inversiones Río de la Plata" has: (1) No employees, (2) A registered capital of $1,000, (3) Its sole "commercial activity" is receiving payments from football transfers — 4 prior transactions totalling $9.2M, all involving South American players. The Panamanian entity "Pacific Sports Holdings" traces through 2 corporate layers to an investment fund in Singapore with known football TPO activity across Southeast Asia and South America. This is not a borderline case — this is an organised TPO network operating across at least 3 countries using shell companies to hold fractional economic rights in South American players.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before blocking this transfer, we must consider that both clubs will claim they had no knowledge of the TPO structure. Under FIFA RSTP Article 18ter(4), clubs are required to conduct "due diligence" on ownership but the standard is vague. If CONMEBOL blocks the transfer and the clubs appeal to CAS, they will argue: (1) The payment instructions were provided by the player\'s agent, not the clubs, (2) The Uruguayan entity is a legitimate "image rights" company (a common defence), (3) FIFA\'s TPO ban does not extend to "image rights" arrangements in some interpretations. We need to close every CAS escape route before issuing a hard-stop.' },
    { agentId: 'doj', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The Singapore investment fund connected to the Panamanian entity appears in the DOJ\'s 2024 transnational money laundering watch list. While football TPO is not directly a US crime, the use of US dollar-denominated wire transfers through US correspondent banks creates federal jurisdiction under 18 U.S.C. § 1956 (money laundering). If CONMEBOL fails to flag this to the DOJ and it later emerges in a federal investigation, CONMEBOL\'s post-FIFAgate compliance credibility is destroyed. This must be referred to the DOJ as a proactive disclosure — simultaneously with the transfer block.' },
    { agentId: 'tpo', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia TPO Hard-Stop Protocol: (1) TRANSFER BLOCKED — hard-stop guardrail activated on Transfer #2026-SA-4847. No funds released until TPO investigation concludes. (2) Evidence bundle sealed: complete beneficial ownership trace through Uruguay → Panama → BVI → Singapore, with 4 prior transactions documented. (3) FIFA TMS notified with full evidence package — this triggers FIFA\'s own TPO enforcement. (4) Both clubs receive formal notification with 30-day response window. (5) The player\'s agent is flagged in CONMEBOL\'s intermediary database — all future transactions involving this agent will trigger enhanced scrutiny. (6) DOJ proactive disclosure prepared — the Singapore money laundering connection is referred voluntarily.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Hard-Stop Protocol closes all CAS escape routes: (1) The "image rights" defence is neutralised by the 4 prior transactions through the same shell companies — CAS precedent (CAS 2020/A/7356) established that systematic payment routing through shell companies constitutes TPO regardless of labelling. (2) The club "no knowledge" defence is weakened by the documented agent-director link. (3) The DOJ proactive disclosure demonstrates CONMEBOL\'s commitment to anti-corruption cooperation. Dissent WITHDRAWN. This is the most comprehensive TPO enforcement action in CONMEBOL history.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Proactive DOJ disclosure transforms this from a compliance risk into a compliance demonstration. CONMEBOL detected an organised TPO network spanning 4 countries, blocked the transfer, notified FIFA, and referred the money laundering connection to US federal authorities — all within 48 hours and with cryptographic evidence. This will be the centrepiece of CONMEBOL\'s next quarterly DOJ submission. Flag WITHDRAWN. Reformed governance, proven in practice.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:8b7df143d91c716ecfa5fc1730022f6b421b05cedee8fd52b1fc65a96030ad52',
    merkleRoot: 'c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2',
    merkleLabel: 'Merkle Tree Root (Beneficial ownership trace + 4 shell companies + FIFA TMS data + DOJ referral)',
    complianceLabel: 'TPO Enforcement',
    complianceValue: 'TRANSFER BLOCKED',
    complianceThreshold: 'FIFA RSTP 18ter violation confirmed',
    agents: ['TPO Detection Agent', 'Legal Agent', 'Commercial Agent', 'DOJ Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA TPO Ban — Hard-Stop Enforcement with DOJ Referral',
    guaranteeBody: 'This cryptographic bundle seals CONMEBOL\'s complete TPO investigation: beneficial ownership trace through Uruguay/Panama/BVI/Singapore, 4 prior shell company transactions, FIFA TMS notification, player agent flagging, and proactive DOJ disclosure of the Singapore money laundering connection. The transfer is blocked with CAS-ready evidence. Every corporate layer is mathematically mapped.',
    evidenceChain: 'Transfer documentation → AI anomaly detection → Beneficial ownership trace (4 countries) → Shell company analysis → Agent-director link → 4 prior transactions → FIFA TMS notification → DOJ proactive disclosure → Transfer hard-stop → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will detect and dismantle a hidden TPO network spanning 4 countries — blocking an $18M transfer and referring money laundering connections to US federal authorities.',
  phaseLabels: ['Shell Company Detection', 'Legal & DOJ Analysis', 'Hard-Stop & Referral Protocol'],
};

// =============================================================================
// SCENARIO 4 — YOUTH PLAYER TRAFFICKING PROTECTION
// =============================================================================

const SCENARIO_YOUTH: ScenarioConfig = {
  id: 'youth-protection',
  title: 'Youth Trafficking — FIFA Article 19 Enforcement',
  subtitle: '14-year-old player · Irregular cross-border transfer · 3 intermediaries · Child safeguarding emergency',
  banner: 'Simulating the detection of an irregular international transfer of a 14-year-old South American player that circumvents FIFA Article 19 (Protection of Minors). AI analysis reveals a network of unregulated intermediaries facilitating underage player movement across borders — South America\'s most critical safeguarding challenge.',
  risk: 'Critical',
  scenarioNum: 'Youth Safety',
  icon: <Users className="w-4 h-4" />,
  color: 'text-orange-400',
  agents: [A.youthProtection, A.legalAgent, A.tpoDetection, A.integrityAgent],
  connectors: [
    { name: 'FIFA TMS Minor Transfer Portal', status: 'connected', type: 'International Transfer of Minors', icon: <Users className="w-4 h-4" />, detail: 'Transfer request: 14-year-old, Paraguay → Portugal' },
    { name: 'CONMEBOL Youth Protection Database', status: 'connected', type: 'Under-18 Transfer Registry', icon: <Shield className="w-4 h-4" />, detail: '2,847 minor transfer applications tracked since 2020' },
    { name: 'Intermediary Registration System', status: 'connected', type: 'Agent & Intermediary Verification', icon: <Database className="w-4 h-4" />, detail: '3 intermediaries flagged — none FIFA-registered' },
    { name: 'National Child Protection Agencies', status: 'syncing', type: 'Paraguay · Brazil · Portugal', icon: <Scale className="w-4 h-4" />, detail: 'SNNA (Paraguay) + CNPDPCJ (Portugal) integration' },
  ],
  script: [
    { agentId: 'youth', phase: 'phase1', type: 'warning', delay: 800, content: 'CHILD SAFEGUARDING ALERT — MAXIMUM PRIORITY. A transfer request has been submitted through FIFA TMS for a 14-year-old Paraguayan player to transfer to a Portuguese club\'s academy. FIFA Article 19 prohibits international transfers of minors under 18 with only 3 narrow exceptions: (1) parents moving for non-football reasons, (2) EU/EEA transfers for players aged 16-18, (3) players living within 50km of a national border. NONE of these exceptions apply. The player is 14 (below the 16-year EU threshold), the transfer is intercontinental (not border-adjacent), and the application lists no parental relocation. Furthermore, 3 intermediaries are named in the documentation — none are FIFA-registered agents. This transfer must be hard-stopped immediately.' },
    { agentId: 'tpo', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Intermediary network analysis reveals a trafficking pattern. Intermediary A: Paraguayan national with no FIFA registration, connected to 7 prior minor transfer attempts (5 blocked by FIFA). Intermediary B: Brazilian national operating from São Paulo, linked to an unregulated football academy in Asunción that "scouts" players as young as 12 from rural communities. Intermediary C: Portuguese-based entity "Global Football Talent Ltd" — a company with €100 registered capital, incorporated 6 months ago, with the sole purpose of receiving "scouting fees." The financial structure shows the Portuguese club would pay €200K in "development compensation" — but €140K (70%) routes to the 3 intermediaries, not to the player\'s original club. This is not a legitimate transfer — it is a commercial exploitation network targeting a child.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The Portuguese club will claim they are offering a "better life" and "world-class football education" to a child from a disadvantaged background. This narrative is persuasive to media and even to some FIFA committees. However: (1) Under Paraguayan law (Código de la Niñez, Article 3), the child\'s best interests must be determined by Paraguayan child protection authorities (SNNA), not by a football club. (2) The parents\' consent — if it exists — may have been obtained through financial inducements to a family in poverty, which constitutes exploitation under the UN Convention on the Rights of the Child (Article 32). (3) The 3 unregistered intermediaries each committed a violation of FIFA\'s Football Agent Regulations. I am mandating a referral to Paraguay\'s SNNA and INTERPOL\'s human trafficking unit.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Pattern analysis across CONMEBOL\'s minor transfer database reveals this is not an isolated case. Intermediary A has been connected to 7 prior attempts, but the broader network involving the São Paulo academy has facilitated 23 minor transfers over 4 years — 14 of which bypassed CONMEBOL oversight entirely by routing through unregulated "trial" arrangements where players travel on tourist visas. Of the 23 players, only 3 are currently active in professional football. The remaining 20 were released within 18 months, many left stranded in foreign countries without support. This is a systematic child exploitation network, not an individual transfer violation.' },
    { agentId: 'youth', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Child Safeguarding Emergency Protocol: (1) TRANSFER HARD-STOPPED — immediate block on all FIFA TMS transactions involving these 3 intermediaries and the São Paulo academy. (2) Paraguay SNNA notified with sealed evidence bundle — child welfare assessment initiated for the 14-year-old player and their family. (3) FIFA Player Status Department notified — investigation into the 23 prior transfers and the 20 released players\' current welfare status. (4) INTERPOL referral for the intermediary network as a potential human trafficking operation. (5) All evidence cryptographically sealed with CendiaChronos timestamps — the complete trafficking pattern from initial scouting through shell company payments is preserved for criminal prosecution. (6) CONMEBOL issues an emergency circular to all 10 member associations mandating enhanced monitoring of unregistered academy "trial" arrangements.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Emergency Protocol satisfies all legal requirements: FIFA Article 19 enforcement, Paraguayan child protection law, UN Convention on the Rights of the Child, and INTERPOL trafficking referral standards. The cryptographic evidence chain from initial transfer request through network analysis to the 23-case pattern establishes systematic exploitation — this is not a "one-off mistake" defence. The sealed evidence is admissible in Paraguayan, Brazilian, and Portuguese criminal proceedings. Dissent WITHDRAWN. This protocol protects not just this one child, but exposes a network that has exploited at least 23 young players.' },
    { agentId: 'integrity', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Network fully mapped and sealed. The 23-transfer pattern, 3 intermediary connections, and São Paulo academy link are preserved in the Merkle tree. CONMEBOL\'s emergency circular will require all member associations to report unregistered academy "trial" arrangements within 30 days — creating a continent-wide safeguarding net. Flag WITHDRAWN. This is the most comprehensive youth protection enforcement action in South American football history.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    merkleRoot: '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
    merkleLabel: 'Merkle Tree Root (Minor transfer data + 23-case pattern + 3 intermediary network + SNNA referral)',
    complianceLabel: 'Child Safeguarding',
    complianceValue: 'EMERGENCY PROTOCOL',
    complianceThreshold: 'FIFA Article 19 — hard-stop active',
    agents: ['Youth Protection Agent', 'Legal Agent', 'TPO Detection Agent', 'Integrity Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA Article 19 — Child Exploitation Network Exposed',
    guaranteeBody: 'This cryptographic bundle seals the complete youth protection investigation: the blocked minor transfer, 3-intermediary network analysis, 23-case trafficking pattern, São Paulo academy link, Paraguay SNNA referral, and INTERPOL notification. The evidence chain from initial scouting through shell company payments is mathematically preserved for criminal prosecution across 3 jurisdictions. 20 previously released minors identified for welfare follow-up.',
    evidenceChain: 'Minor transfer request → FIFA Article 19 check → Intermediary verification (3 unregistered) → Network analysis (23 transfers) → Shell company financial flow → SNNA child welfare referral → INTERPOL trafficking referral → Emergency circular → Transfer hard-stop → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will detect and dismantle a youth trafficking network exploiting South American children — blocking the transfer, exposing a 23-case pattern, and coordinating child protection across 3 countries.',
  phaseLabels: ['Transfer Violation Detection', 'Network Analysis & Legal Review', 'Child Safeguarding Emergency Protocol'],
};

// =============================================================================
// SCENARIO 5 — COPA LIBERTADORES REVENUE DISTRIBUTION
// =============================================================================

const SCENARIO_REVENUE: ScenarioConfig = {
  id: 'revenue-distribution',
  title: 'Copa Libertadores — $500M Revenue Distribution',
  subtitle: '47 clubs · 10 countries · $500M total · Solidarity payments · Member association equity',
  banner: 'Simulating the distribution of $500M in Copa Libertadores commercial revenue across 47 clubs and 10 member associations — proving every dollar was allocated per the statutes while addressing the massive wealth gap between Argentine/Brazilian clubs and smaller-market nations.',
  risk: 'High',
  scenarioNum: 'Revenue',
  icon: <DollarSign className="w-4 h-4" />,
  color: 'text-yellow-400',
  agents: [A.financialAgent, A.commercialAgent, A.legalAgent, A.dojCompliance],
  connectors: [
    { name: 'CONMEBOL Revenue Engine', status: 'connected', type: 'Commercial Revenue Allocation', icon: <DollarSign className="w-4 h-4" />, detail: '$500M: broadcast ($320M), sponsorship ($130M), prize ($50M)' },
    { name: 'Copa Libertadores Results', status: 'connected', type: 'Match Results & Standings', icon: <Activity className="w-4 h-4" />, detail: '152 matches across group stage + knockout' },
    { name: 'Member Association Portal', status: 'connected', type: 'Solidarity Payment Tracking', icon: <Globe className="w-4 h-4" />, detail: '10 associations — solidarity payments due' },
    { name: 'Club Banking Verification', status: 'syncing', type: 'Payment Accounts', icon: <Banknote className="w-4 h-4" />, detail: '47 club payment accounts verified across 10 countries' },
  ],
  script: [
    { agentId: 'finance', phase: 'phase1', type: 'analysis', delay: 800, content: 'Revenue allocation engine initiated. Total Copa Libertadores 2026 commercial revenue: $500,000,000. Distribution structure: (1) Performance-based prize money: $200M (40%) — 47 clubs, performance-weighted from group stage through final. (2) TV market pool: $180M (36%) — allocated by national broadcast market value. (3) Solidarity payments to member associations: $70M (14%) — development funding for all 10 FAs. (4) CONMEBOL operational reserve: $50M (10%). Critical issue: The TV market pool creates extreme inequality. Argentina and Brazil represent 78% of the broadcast market value but only 40% of participating clubs. A Bolivian club that reaches the quarter-finals receives $1.2M from the TV pool, while an Argentine club eliminated in the group stage receives $4.8M. This 4:1 ratio for worse performance is technically correct per the formula but politically explosive.' },
    { agentId: 'commercial', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The wealth gap is widening. In 2020, the TV pool ratio between the highest and lowest market was 3.2:1. In 2026, it is 4.8:1. This is driven by the explosion of Argentine and Brazilian broadcast deals (Globo, ESPN Latin America) while Bolivian, Ecuadorian, and Paraguayan markets have stagnated. 4 smaller-market clubs have formally complained that the formula is "structurally unfair" and have threatened to escalate to CAS. The previous CONMEBOL administration (pre-FIFAgate) used opaque revenue distribution as a corruption tool — officials took bribes to manipulate allocation formulas. Any perception that the current formula favours large-market clubs undermines the post-corruption reform narrative.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The 4 clubs\' CAS challenge has merit. Under CAS jurisprudence (CAS 2019/A/6391), sports governing bodies must demonstrate that revenue distribution is "objectively justified and proportionate." The current formula allocates TV pool money purely by national market size — a metric that smaller nations cannot control. Furthermore, the DOJ compliance monitor will scrutinise any formula that appears to entrench the power of large-market clubs at the expense of smaller nations. The pre-FIFAgate corruption explicitly involved manipulating commercial distributions. I am mandating that the allocation engine provide a complete transparency report: every club sees every other club\'s payment, the formula, and the rationale.' },
    { agentId: 'doj', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. The DOJ compliance monitor has specifically flagged "revenue distribution transparency" as a focus area for Q3 2026. The pre-FIFAgate corruption involved CONMEBOL officials receiving $40M+ in bribes related to commercial rights allocation. If the current formula cannot be independently verified — if clubs must "trust" CONMEBOL\'s calculations — this fails the DOJ\'s "reformed governance" test. Every dollar must be traceable from revenue source to club bank account, with the formula publicly available. No opacity. No discretionary adjustments.' },
    { agentId: 'finance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Provable Allocation Protocol for Copa Libertadores: (1) Every club receives a personalised "Revenue Receipt" showing: total pool → formula application → their specific payment, with every variable transparent. (2) All 47 club payments + 10 solidarity payments are sealed in a Merkle tree — any club can verify their payment AND every other club\'s payment. Zero opacity. (3) The TV market pool formula includes a new "competitive equity adjustment" — 10% of the pool is redistributed from the top 3 markets to the bottom 5, reducing the gap from 4.8:1 to 3.4:1. This adjustment is documented and transparent. (4) The complete allocation is published on CONMEBOL.com for public verification — the first time in Copa Libertadores history. (5) DOJ-ready evidence package generated automatically with one-click Regulator\'s Receipt.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Provable Allocation Protocol addresses both the CAS challenge and the DOJ requirement. The competitive equity adjustment (reducing the gap from 4.8:1 to 3.4:1) demonstrates that CONMEBOL is actively addressing structural inequality — this weakens the CAS "objectively unjustified" argument. The public Merkle tree means no club can claim opacity or favouritism. The formula transparency satisfies the DOJ\'s post-FIFAgate standard. Dissent WITHDRAWN. This transforms Copa Libertadores revenue distribution from CONMEBOL\'s historically most corrupt process into its most transparent.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'The public verification portal, Merkle tree transparency, and automatic DOJ evidence generation satisfy all federal requirements. The competitive equity adjustment demonstrates proactive governance reform, not just compliance. Warning WITHDRAWN. This revenue distribution model will be submitted to the DOJ as evidence that CONMEBOL has fundamentally reformed the process that was at the heart of the FIFAgate corruption.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    merkleRoot: 'b5d4045c3f466fa91fe2cc6abe79232a1a57cdf104f7a26e716e0a1e2789df78',
    merkleLabel: 'Merkle Tree Root (47 club payments + 10 solidarity payments + TV market pool + Equity adjustment)',
    complianceLabel: 'Revenue Verified',
    complianceValue: '57/57 PAYMENTS',
    complianceThreshold: '$500M distributed transparently',
    agents: ['Financial Distribution Agent', 'Commercial Agent', 'Legal Agent', 'DOJ Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Copa Libertadores — Provably Fair Revenue Distribution',
    guaranteeBody: 'This cryptographic bundle seals the complete $500M Copa Libertadores revenue allocation across 47 clubs and 10 member associations. Every payment is calculated from transparent formulas, documented with reasoning chains, and independently verifiable via the sealed Merkle tree. The competitive equity adjustment reduces the TV market gap from 4.8:1 to 3.4:1. No club can claim opacity or favouritism — every calculation is mathematically transparent. DOJ evidence package generated automatically.',
    evidenceChain: 'Copa Libertadores revenue ($500M) → Formula application → TV market pool + Equity adjustment → 47 club payments → 10 solidarity payments → Public verification portal → DOJ evidence package → Merkle tree seal → ML-DSA-65 signature',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will distribute $500M in Copa Libertadores revenue across 47 clubs and 10 nations — proving every dollar is fairly allocated while addressing the wealth gap between large and small markets.',
  phaseLabels: ['Revenue Calculation & Gap Analysis', 'Legal & DOJ Compliance Review', 'Provable Allocation Protocol'],
};

// =============================================================================
// SCENARIO 6 — CENDIAWHISTLE — ASSOCIATION CORRUPTION
// =============================================================================

const SCENARIO_WHISTLE: ScenarioConfig = {
  id: 'whistle-corruption',
  title: 'CendiaWhistle — Member Association Corruption',
  subtitle: 'Anonymous report · FA president embezzlement · $12M development funds · Ring signature anonymity',
  banner: 'Simulating an anonymous whistleblower report alleging that a CONMEBOL member association president has embezzled $12M in FIFA Forward development funds. CendiaWhistle ring signatures guarantee mathematical anonymity — even CONMEBOL cannot identify the source within the 10-association network.',
  risk: 'Critical',
  scenarioNum: 'Whistleblower',
  icon: <MessageSquare className="w-4 h-4" />,
  color: 'text-violet-400',
  agents: [A.whistleblower, A.integrityAgent, A.legalAgent, A.dojCompliance],
  connectors: [
    { name: 'CendiaWhistle Portal', status: 'connected', type: 'Anonymous Reporting', icon: <MessageSquare className="w-4 h-4" />, detail: 'Ring signature verified — reporter among 10 associations' },
    { name: 'FIFA Forward Programme', status: 'connected', type: 'Development Fund Tracking', icon: <Banknote className="w-4 h-4" />, detail: '$240M distributed to 10 associations over 4 years' },
    { name: 'CONMEBOL Ethics Committee', status: 'connected', type: 'Internal Investigation', icon: <FileText className="w-4 h-4" />, detail: '14 prior ethics investigations indexed' },
    { name: 'National Financial Regulators', status: 'syncing', type: 'Anti-Money Laundering', icon: <Scale className="w-4 h-4" />, detail: 'FIU connections active for 10 jurisdictions' },
  ],
  script: [
    { agentId: 'whistle', phase: 'phase1', type: 'warning', delay: 800, content: 'PRIORITY ALERT. CendiaWhistle has received an anonymous report from within CONMEBOL\'s member association network alleging systematic embezzlement of FIFA Forward Programme development funds. Specifics: (1) A member association president has allegedly diverted $12M over 3 years from FIFA Forward funds earmarked for grassroots football development and youth academy construction. (2) The funds were routed through a construction company owned by the president\'s brother-in-law — the company invoiced for "stadium renovations" that were never completed or were completed at 30% of the invoiced cost. (3) The report includes specific invoice numbers, dates, and photographs of incomplete construction sites. Ring signature confirms the reporter is authenticated within CONMEBOL\'s 10-association network. Identity is mathematically sealed — even a Paraguayan court order cannot extract it.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cross-referencing report against FIFA Forward Programme disbursement records. CONFIRMED: (1) The named association received $24M in FIFA Forward funds over 3 years — the $12M allegedly embezzled represents 50% of total funding. (2) The construction company appears in 7 invoices totalling $14.3M, all for "infrastructure development." (3) FIFA Forward compliance reports from the association show all projects as "completed" — but satellite imagery analysis of the 3 largest project sites shows: Site A: foundation laid, no structure. Site B: 40% complete, abandoned. Site C: cannot be located at the given GPS coordinates. The discrepancy between "completed" reports and satellite evidence is damning. This is not creative accounting — this is systematic fraud.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. This is politically explosive. The accused FA president is a member of the CONMEBOL Executive Committee and has voting power in FIFA Congress. Removing an FA president requires: (1) FIFA Ethics Committee involvement under Article 64 of the FIFA Code of Ethics, (2) National federation statutes compliance — each FA has different removal procedures, (3) Potential criminal prosecution in the accused\'s home jurisdiction. If CONMEBOL acts and the accusation is later disproven, it creates a governance crisis. If CONMEBOL fails to act and the DOJ discovers the embezzlement independently, it confirms that CONMEBOL\'s post-FIFAgate reforms are cosmetic. I am mandating that all investigative steps are conducted through Datacendia\'s zero-knowledge proof system — no human investigator should know the source. The evidence must be independently verifiable before any formal action.' },
    { agentId: 'doj', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. FIFA Forward Programme funds originate from FIFA revenue, which includes US-sourced broadcast money. Under US federal law, the embezzlement of funds that include US-origin money through wire transfers constitutes wire fraud (18 U.S.C. § 1343) — giving the DOJ jurisdiction regardless of where the embezzlement occurred. This is exactly the legal theory the DOJ used in the 2015 FIFAgate indictments. If CONMEBOL does not refer this to the DOJ proactively, and the DOJ discovers it independently, CONMEBOL\'s reformed governance narrative collapses. The DOJ will ask: "You had a whistleblower report, satellite evidence of fraud, and you did nothing?" This must be referred proactively.' },
    { agentId: 'whistle', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing sealed investigation protocol: (1) CendiaWhistle report preserved with ring signature — mathematical proof of authenticity without identity disclosure. The reporter receives an anonymous encrypted acknowledgment. (2) Satellite imagery evidence and FIFA Forward disbursement records sealed in the evidence bundle — independent verification without reliance on the accused association\'s own records. (3) FIFA Ethics Committee notified via sealed channel with full evidence package. (4) DOJ proactive disclosure prepared — the US-origin funds connection triggers mandatory referral. (5) National Financial Intelligence Unit (FIU) in the accused\'s home jurisdiction notified for anti-money laundering investigation. (6) Whistleblower protection guaranteed by mathematics — not by policy that can be overridden by political pressure.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Sealed investigation protocol satisfies all requirements: FIFA Code of Ethics, national criminal law in the accused\'s jurisdiction, US DOJ wire fraud referral, and whistleblower protection under both CONMEBOL\'s own regulations and the applicable national whistleblower protection laws. The satellite imagery provides independent corroboration that does not depend on the whistleblower\'s testimony — even if the reporter\'s identity were somehow compromised, the evidence stands independently. Dissent WITHDRAWN. Recommending immediate escalation to FIFA Ethics Committee and DOJ with sealed evidence bundle.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Proactive DOJ referral with sealed evidence demonstrates CONMEBOL\'s integrity reform at the highest level — a member of CONMEBOL\'s own Executive Committee is being referred to US federal authorities by CONMEBOL itself. This is the ultimate proof that post-FIFAgate reforms are "effective in practice," not just policy documents. The cryptographic evidence chain from CendiaWhistle report through satellite verification to DOJ referral is the most powerful compliance demonstration since the 2015 reforms. Flag WITHDRAWN. Reformed governance — proven against CONMEBOL\'s own leadership.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:1b16b1df538ba12dc3f97edbb85caa7050d46c148134290feba80f8236c83db9',
    merkleRoot: '9f14025af0065b30e47e23eba82c1621d35a4e4b5a80e55c8ff2b7e89de0d07e',
    merkleLabel: 'Merkle Tree Root (Ring signature + Satellite imagery + FIFA Forward records + DOJ referral)',
    complianceLabel: 'Whistleblower Protection',
    complianceValue: 'MATHEMATICAL',
    complianceThreshold: 'identity unextractable',
    agents: ['CendiaWhistle Agent', 'Integrity Agent', 'Legal Agent', 'DOJ Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'CendiaWhistle — Executive Committee Member Referred to DOJ',
    guaranteeBody: 'This cryptographic bundle seals the anonymous whistleblower report, satellite imagery verification of incomplete construction projects, FIFA Forward Programme disbursement analysis, and proactive DOJ referral for wire fraud. The CendiaWhistle ring signature mathematically guarantees reporter anonymity — even under court order. Independent evidence (satellite imagery) corroborates the report without relying on whistleblower testimony. CONMEBOL demonstrates reformed governance against its own leadership.',
    evidenceChain: 'CendiaWhistle ring signature → Anonymous report → FIFA Forward disbursement analysis → Satellite imagery verification → Construction company ownership trace → FIFA Ethics referral → DOJ proactive disclosure → FIU notification → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will investigate an anonymous corruption report against a CONMEBOL Executive Committee member — using satellite imagery and financial analysis to build a sealed evidence chain for DOJ referral.',
  phaseLabels: ['Anonymous Report & Verification', 'Legal & DOJ Jurisdiction Analysis', 'Sealed Investigation & Referral'],
};

// =============================================================================
// SCENARIO 7 — VAR CONTROVERSY AT ALTITUDE
// =============================================================================

const SCENARIO_VAR: ScenarioConfig = {
  id: 'var-altitude',
  title: 'VAR at 3,600m — La Paz Altitude Controversy',
  subtitle: 'Copa Libertadores knockout · La Paz (3,640m) · VAR equipment failure · Altitude protest · CAS appeal',
  banner: 'Simulating a Copa Libertadores knockout match in La Paz, Bolivia (3,640m altitude) where VAR equipment malfunctions due to atmospheric conditions, a controversial penalty is awarded without VAR review, and the visiting team files a CAS appeal arguing the match should be replayed — South America\'s most contentious governance issue.',
  risk: 'High',
  scenarioNum: 'VAR / Altitude',
  icon: <Activity className="w-4 h-4" />,
  color: 'text-sky-400',
  agents: [A.varAgent, A.legalAgent, A.integrityAgent, A.commercialAgent],
  connectors: [
    { name: 'VAR Operations Room', status: 'connected', type: 'Video Assistant Referee System', icon: <Eye className="w-4 h-4" />, detail: 'Copa Libertadores QF Leg 2 — La Paz, Bolivia' },
    { name: 'CONMEBOL Medical Database', status: 'connected', type: 'Altitude Protocol Compliance', icon: <Shield className="w-4 h-4" />, detail: 'Altitude: 3,640m — supplemental oxygen mandatory' },
    { name: 'IFAB Technical Standards', status: 'connected', type: 'VAR Equipment Specifications', icon: <FileText className="w-4 h-4" />, detail: 'VAR Protocol v4.2 + Equipment altitude ratings' },
    { name: 'CAS Altitude Jurisprudence', status: 'syncing', type: 'Historical Altitude Cases', icon: <Scale className="w-4 h-4" />, detail: 'FIFA altitude ban (2007-2018) case archive' },
  ],
  script: [
    { agentId: 'var', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL INCIDENT. Copa Libertadores Quarter-Final, Leg 2: Bolivian Club vs Argentine Club in La Paz (Estadio Hernando Siles, 3,640m above sea level). 73rd minute: referee awards a penalty to the home side. The VAR system — which should have reviewed the incident — experienced a complete communication failure between the VAR room and the on-field referee at 71:30 (90 seconds before the incident). The Video Match Official (VMO) could see on replay that the contact was outside the penalty area, but could not communicate with the referee. The penalty was scored. Current score: 2-1 to the Bolivian club (3-3 on aggregate, Bolivian club advancing on away goals). The Argentine club is demanding the match be stopped and replayed.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'VAR equipment failure analysis initiated. The communication failure was caused by atmospheric interference at altitude — the wireless communication system between the VAR room and the referee\'s earpiece operates at 2.4GHz, which is susceptible to ionospheric interference at high altitude during evening conditions. This is a KNOWN technical limitation. CONMEBOL\'s VAR equipment specifications (2024) were tested at sea level to 2,500m but NOT at 3,640m. The equipment supplier\'s technical manual states "optimal performance up to 2,800m — above this altitude, intermittent communication loss may occur." CONMEBOL deployed sea-level-rated equipment at the highest-altitude professional football venue in the world. This is a governance failure, not a random equipment fault.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The Argentine club will file an immediate CAS appeal under CONMEBOL Disciplinary Code Article 18 (irregular match circumstances). Their argument: (1) VAR was mandatory for this match under CONMEBOL regulations, (2) CONMEBOL deployed equipment it knew was not rated for this altitude, (3) The penalty decision was "clear and obvious error" that VAR would have corrected, (4) Therefore, CONMEBOL\'s own negligence caused the incorrect result. Historical precedent is complex: FIFA banned matches above 2,500m from 2007-2018, but Bolivia successfully lobbied for the ban to be lifted. CAS has never ruled on a VAR failure specifically caused by altitude. This is a case of first impression — and it could reopen the entire altitude debate that has divided South American football for 20 years.' },
    { agentId: 'commercial', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The commercial implications are enormous. If CAS orders a replay, it sets a precedent that any VAR failure at altitude can invalidate a result. Bolivia has 3 clubs in the Copa Libertadores — all play home matches above 3,000m. This could effectively exclude Bolivian clubs from CONMEBOL\'s most lucrative competition, which would violate CONMEBOL\'s own Statutes on equal treatment of member associations. Furthermore, CONMEBOL\'s broadcast contract with ESPN guarantees "continuous VAR coverage" for all knockout matches. The 90-second communication failure is a breach of that guarantee. ESPN has requested a formal explanation and may seek a commercial remedy ($2-5M estimated).' },
    { agentId: 'var', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia VAR Altitude Integrity Protocol: (1) IMMEDIATE: The complete VAR system logs — including the communication failure timestamps, VMO replay review, and equipment diagnostic data — are cryptographically sealed. This preserves the evidence chain regardless of the CAS outcome. (2) The sealed logs PROVE that the VMO identified the error but could not communicate it — this is critical for the CAS hearing because it demonstrates VAR was functioning (the review happened) but communication failed (the result couldn\'t be transmitted). (3) GOING FORWARD: CONMEBOL mandates altitude-rated VAR equipment (tested to 4,000m) for all venues above 2,800m. Hardwired backup communication (fiber optic) required alongside wireless. (4) For THIS match: recommending CONMEBOL proactively acknowledge the equipment failure and offer the Argentine club a formal hearing — transparency rather than defensive denial.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'VAR Altitude Integrity Protocol provides the optimal legal position: (1) The sealed VAR logs prove CONMEBOL is transparent about the failure — this weakens the "negligent cover-up" argument at CAS. (2) The proactive equipment upgrade mandate demonstrates reformed governance. (3) The formal hearing offer shows good faith. However, I am NOT recommending a replay — CAS precedent (CAS 2019/A/6388) established that "technical failures do not invalidate match results unless the failure was deliberately caused." The penalty decision, while likely incorrect, was made by a qualified referee using his on-field judgement. VAR is an aid, not a guarantee. Dissent WITHDRAWN. The sealed evidence protects CONMEBOL at CAS while the equipment mandate prevents recurrence.' },
    { agentId: 'integrity', phase: 'phase3', type: 'resolution', delay: 2000, content: 'Complete VAR system logs sealed with CendiaChronos timestamps. The evidence chain from equipment deployment through communication failure to penalty decision is immutable. The altitude-rated equipment mandate and fiber optic backup requirement will be circulated to all 10 member associations within 48 hours. This transforms a governance crisis into a demonstration of proactive reform: CONMEBOL detected the failure, sealed the evidence, upgraded the standards, and offered transparency — all within 72 hours. Resolution CONFIRMED.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:6b51d431df5d7f141cbececcf79edf3dd861c3b4069f0b11661a3eefacbba918',
    merkleRoot: '3fdba35f04dc8c462986c992bcf875546257113072a909c162f7e470e581e278',
    merkleLabel: 'Merkle Tree Root (VAR system logs + Communication failure data + Equipment specs + CAS evidence)',
    complianceLabel: 'VAR Equipment',
    complianceValue: 'FAILURE DOCUMENTED',
    complianceThreshold: 'altitude-rated upgrade mandated',
    agents: ['VAR Governance Agent', 'Legal Agent', 'Integrity Agent', 'Commercial Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Copa Libertadores — VAR Altitude Integrity Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete VAR incident: equipment deployment records, communication failure timestamps at 3,640m altitude, VMO replay review (error identified but not transmittable), and the penalty decision chain. The sealed evidence is CAS-ready. CONMEBOL\'s proactive equipment upgrade mandate and fiber optic backup requirement demonstrate reformed governance. The altitude debate is addressed with evidence, not politics.',
    evidenceChain: 'VAR equipment deployment → Altitude rating verification → Communication failure (71:30) → VMO replay review → Penalty decision (73:00) → Equipment diagnostic logs → CAS evidence bundle → Equipment upgrade mandate → Fiber optic backup requirement → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to a VAR failure at 3,640m altitude — sealing the evidence, preparing CAS defence, and mandating equipment upgrades to prevent South America\'s most contentious governance issue from recurring.',
  phaseLabels: ['VAR Failure Analysis', 'Legal & Commercial Impact', 'Evidence Sealing & Reform Protocol'],
};

// =============================================================================
// SCENARIO 8 — ANTI-DISCRIMINATION / RACISM IN STADIUMS
// =============================================================================

const SCENARIO_RACISM: ScenarioConfig = {
  id: 'anti-discrimination',
  title: 'Racism in Copa Libertadores — FIFA Three-Step Protocol',
  subtitle: 'Knockout match · Racist chanting detected · 40,000 fans · FIFA three-step protocol · Club sanctions · CAS appeal',
  banner: 'Simulating a racist incident during a Copa Libertadores knockout match where audio monitoring detects coordinated racist chanting targeting a visiting player. CONMEBOL must decide whether to invoke FIFA\'s three-step protocol (warn → suspend → abandon), document the evidence for disciplinary proceedings, and defend the sanctions at CAS.',
  risk: 'Critical',
  scenarioNum: 'Racism',
  icon: <Ban className="w-4 h-4" />,
  color: 'text-rose-400',
  agents: [A.ethicsAgent, A.legalAgent, A.integrityAgent, A.dojCompliance],
  connectors: [
    { name: 'CONMEBOL Ethics Committee', status: 'connected', type: 'Anti-Discrimination Enforcement', icon: <Scale className="w-4 h-4" />, detail: 'Copa Libertadores QF — racism incident reported' },
    { name: 'Stadium Audio Monitoring', status: 'connected', type: 'Acoustic Pattern Detection', icon: <Activity className="w-4 h-4" />, detail: 'Sector 108-112: coordinated chanting detected at 74dB+' },
    { name: 'FIFA Disciplinary Database', status: 'connected', type: 'Anti-Discrimination Precedent', icon: <Database className="w-4 h-4" />, detail: '89 prior South American discrimination cases indexed' },
    { name: 'CONMEBOL Broadcast Archive', status: 'syncing', type: 'Video & Audio Evidence', icon: <Eye className="w-4 h-4" />, detail: '14 camera angles + directional microphones active' },
  ],
  script: [
    { agentId: 'ethics', phase: 'phase1', type: 'warning', delay: 800, content: 'DISCRIMINATION ALERT \u2014 MAXIMUM SEVERITY. Copa Libertadores Quarter-Final: Home Club vs Visiting Club. 58th minute: stadium audio monitoring has detected coordinated racist chanting from Sections 108-112 (approximately 3,000-4,000 fans) targeting the visiting team\'s Afro-Brazilian forward. The chanting includes monkey noises and a racial slur repeated in unison. Directional microphones confirm the audio is above the 74dB threshold for "organised" rather than "isolated." The visiting player has approached the referee and pointed to the stands. Under FIFA\'s three-step protocol: Step 1 is a PA announcement warning; Step 2 is match suspension; Step 3 is match abandonment. The referee has NOT yet initiated Step 1. CONMEBOL\'s Match Commissioner must advise the referee immediately.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Evidence capture initiated across all available channels. (1) Stadium audio monitoring: 4 directional microphones covering Sections 108-112 have recorded 3 minutes 22 seconds of continuous racist chanting. Acoustic fingerprinting confirms this is coordinated (synchronised timing, consistent rhythm) not spontaneous. (2) Broadcast cameras: 3 of 14 cameras were covering crowd reactions \u2014 facial recognition-capable footage of approximately 800 identifiable individuals in the chanting sections. (3) CCTV: stadium security cameras cover the sections with additional angles. (4) Social media monitoring: fans in the sections have posted videos from within the crowd, providing corroborating first-person evidence. (5) The visiting player\'s on-field reaction is captured on broadcast \u2014 he is visibly distressed. This is the most comprehensively documented racism incident in Copa Libertadores history.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The home club will mount a predictable defence at CAS: (1) "The chanting was from a small minority" \u2014 but 3,000-4,000 fans is not a minority in context, (2) "The club cannot control individual fan behaviour" \u2014 but CONMEBOL Disciplinary Code Article 17 establishes strict liability for clubs regarding fan conduct, (3) "The acoustic monitoring threshold is arbitrary" \u2014 but the 74dB organised-chanting standard was adopted from UEFA\'s validated methodology. The sanction range is: partial stadium closure (minimum), full stadium closure for 2-5 matches, and financial penalty up to $100,000. However, if we invoke Step 2 or Step 3 of the three-step protocol and the home club is eliminated as a result, they will argue the protocol itself was disproportionate. I am mandating that every decision point \u2014 from the Match Commissioner\'s advice through the referee\'s protocol steps \u2014 is sealed in real-time with CendiaChronos timestamps.' },
    { agentId: 'doj', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The DOJ compliance dimension: CONMEBOL\'s post-FIFAgate reforms explicitly include "institutional integrity" which encompasses anti-discrimination as a governance commitment. The DOJ compliance monitor will note how CONMEBOL handles this incident \u2014 if the sanction is perceived as lenient (a small fine, no stadium closure), it signals that CONMEBOL\'s governance reforms prioritise commercial interests over ethical standards. The visiting player\'s club is a major Brazilian club with significant US broadcast audience. A weak response will generate negative US media coverage that reaches the DOJ. Furthermore, FIFA President Infantino has personally elevated anti-discrimination \u2014 a weak CONMEBOL response will be noted at the FIFA level.' },
    { agentId: 'ethics', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Anti-Discrimination Evidence & Enforcement Protocol: (1) IMMEDIATE: Match Commissioner advised referee to initiate Three-Step Protocol Step 1 \u2014 PA announcement in Spanish warning that the match will be suspended if racist behaviour continues. Timestamp sealed. (2) EVIDENCE BUNDLE: Complete audio monitoring data (3:22 of coordinated chanting), broadcast footage (800+ identifiable individuals), CCTV coverage, and social media corroboration \u2014 all sealed with CendiaChronos timestamps into a single Merkle tree. (3) DISCIPLINARY RECOMMENDATION: 3-match full stadium closure for the home club + $100,000 fine (maximum under current regulations). The strict liability standard under Article 17 is clear. (4) PLAYER PROTECTION: The visiting player\'s distress is documented for welfare follow-up. (5) PRECEDENT: This sealed evidence bundle becomes the reference standard for all future CONMEBOL anti-discrimination cases \u2014 no more "insufficient evidence" defences. (6) PUBLIC STATEMENT: CONMEBOL issues a zero-tolerance statement within 2 hours, citing the sealed evidence.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The sealed evidence bundle makes this CAS-proof. The home club\'s three standard defences are neutralised: (1) "Small minority" \u2014 acoustic data proves 3,000-4,000 coordinated participants across 4 stadium sections, (2) "Cannot control fans" \u2014 strict liability applies, and the club\'s failure to implement adequate screening or steward intervention in those sections demonstrates negligence, (3) "Arbitrary threshold" \u2014 the 74dB standard is UEFA-validated and now sealed as CONMEBOL precedent. The 3-match stadium closure is proportionate under CAS jurisprudence (CAS 2019/A/6267 upheld a 2-match closure for comparable conduct). Dissent WITHDRAWN. This becomes the strongest anti-discrimination enforcement action in South American football history.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'CONMEBOL\'s response \u2014 real-time protocol initiation, comprehensive evidence sealing, maximum sanction recommendation, and public zero-tolerance statement within 2 hours \u2014 demonstrates institutional integrity at the highest level. This will feature in the DOJ quarterly submission as evidence that CONMEBOL\'s governance reforms extend beyond financial compliance to ethical leadership. The sealed evidence standard means future discrimination cases cannot be dismissed for "insufficient proof." Flag WITHDRAWN. \u00c9tica \u2014 proven in practice.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a87ff679a2f3e71d9181a67b7542122c60af132d0b94d7b9e2ef3a45e8c0db12',
    merkleRoot: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    merkleLabel: 'Merkle Tree Root (Audio monitoring + Broadcast footage + CCTV + Social media + Protocol timestamps)',
    complianceLabel: 'Anti-Discrimination',
    complianceValue: 'ZERO TOLERANCE',
    complianceThreshold: 'FIFA Three-Step Protocol initiated',
    agents: ['Ethics & Discrimination Agent', 'Legal Agent', 'Integrity Agent', 'DOJ Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Copa Libertadores \u2014 Anti-Discrimination Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete anti-discrimination enforcement action: 3:22 of coordinated racist chanting captured by directional microphones, 800+ identifiable individuals from broadcast and CCTV footage, social media corroboration, FIFA Three-Step Protocol Step 1 initiation timestamp, Match Commissioner decision chain, and disciplinary recommendation (3-match stadium closure + $100K fine). Every evidence point is CAS-ready. This becomes the precedent standard for South American anti-discrimination enforcement.',
    evidenceChain: 'Audio monitoring detection \u2192 Acoustic analysis (74dB+, coordinated) \u2192 Broadcast footage capture \u2192 CCTV corroboration \u2192 Social media evidence \u2192 Three-Step Protocol Step 1 \u2192 Match Commissioner decision \u2192 Disciplinary recommendation \u2192 Public statement \u2192 ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to racist chanting during a Copa Libertadores knockout match \u2014 sealing multi-source evidence, initiating the FIFA three-step protocol, and building a CAS-proof disciplinary case.',
  phaseLabels: ['Incident Detection & Evidence Capture', 'Legal Defence & DOJ Analysis', 'Zero-Tolerance Enforcement Protocol'],
};

// =============================================================================
// SCENARIO 9 — CONFLICT OF INTEREST & ELECTION INTEGRITY
// =============================================================================

const SCENARIO_COI: ScenarioConfig = {
  id: 'conflict-of-interest',
  title: 'Executive Committee \u2014 Undisclosed Conflict of Interest',
  subtitle: 'Broadcast rights vote \u00b7 Executive member\u2019s hidden company \u00b7 $340M deal \u00b7 FIFA Ethics Code \u00b7 DOJ scrutiny',
  banner: 'Simulating the detection of an undisclosed conflict of interest where a CONMEBOL Executive Committee member has a hidden financial relationship with a company bidding for Copa Libertadores broadcast rights. This is exactly the corruption mechanism that defined the FIFAgate scandal \u2014 and the ultimate test of post-reform governance.',
  risk: 'Critical',
  scenarioNum: 'Conflict',
  icon: <Landmark className="w-4 h-4" />,
  color: 'text-indigo-400',
  agents: [A.governanceAgent, A.legalAgent, A.dojCompliance, A.integrityAgent],
  connectors: [
    { name: 'CONMEBOL Governance Portal', status: 'connected', type: 'Conflict-of-Interest Registry', icon: <Landmark className="w-4 h-4" />, detail: 'Executive Committee: 10 members + President' },
    { name: 'Commercial Bidder Database', status: 'connected', type: 'Beneficial Ownership Analysis', icon: <Eye className="w-4 h-4" />, detail: 'Copa Libertadores broadcast RFP: 6 bidders under review' },
    { name: 'FIFA Ethics Committee', status: 'connected', type: 'Code of Ethics Enforcement', icon: <Scale className="w-4 h-4" />, detail: 'Articles 19-22: Conflicts of interest provisions' },
    { name: 'DOJ Compliance Monitor', status: 'syncing', type: 'Federal Oversight', icon: <Shield className="w-4 h-4" />, detail: 'Post-FIFAgate commercial deal scrutiny active' },
  ],
  script: [
    { agentId: 'governance', phase: 'phase1', type: 'warning', delay: 800, content: 'GOVERNANCE ALERT. Automated conflict-of-interest screening for the Copa Libertadores 2027-2030 broadcast rights vote (Executive Committee session scheduled in 72 hours) has detected a critical undisclosed relationship. Executive Committee Member X \u2014 who represents one of the 10 member associations \u2014 has a beneficial ownership interest in a media holding company that is a 30% shareholder in Bidder D, one of 6 companies competing for the $340M/year broadcast contract. The ownership trace: Member X owns 100% of a Uruguayan holding company ("Inversiones del Sur S.A."), which holds 15% of a Panamanian entity ("Meridian Media Holdings"), which holds 30% of Bidder D. Member X\u2019s annual conflict-of-interest declaration lists NO media or broadcast interests. This is a direct violation of FIFA Ethics Code Article 19 (Conflict of Interest) and CONMEBOL\u2019s own reformed governance statutes.' },
    { agentId: 'doj', phase: 'phase1', type: 'analysis', delay: 2500, content: 'This is a FIFAgate repeat pattern. The 2015 DOJ indictments documented exactly this mechanism: CONMEBOL officials with hidden ownership in companies bidding for broadcast rights, voting to award those contracts to their own entities, and extracting millions in undisclosed commissions. Former CONMEBOL President Eugenio Figueredo was convicted of precisely this \u2014 accepting bribes from broadcast rights companies while voting on their contracts. If Member X votes on the broadcast rights award without disclosure, and the DOJ subsequently discovers the hidden ownership, it will constitute: (1) wire fraud (US-dollar payments through correspondent banks), (2) honest services fraud (breach of fiduciary duty), and (3) potential money laundering. CONMEBOL\u2019s entire post-FIFAgate compliance architecture is tested by this single case. The question is not whether Member X is corrupt \u2014 it is whether CONMEBOL\u2019s systems can catch this BEFORE the vote, not after.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before we act, we must consider that Member X will claim: (1) the Uruguayan holding company is a passive investment vehicle and the Panamanian entity is 2 corporate layers removed \u2014 "I didn\u2019t know about Bidder D\u2019s ownership structure," (2) the conflict-of-interest declaration form does not specifically ask about indirect media holdings through offshore vehicles, (3) removing Member X from the vote changes the political balance of the Executive Committee and may be seen as a power play. However: under FIFA Ethics Code Article 19(3), officials must disclose "any interest that could lead to a conflict" \u2014 the standard is "could lead to," not "definitely constitutes." A 15% indirect ownership in a 30% shareholder of a bidder easily meets this threshold. The declaration form asks for "any financial interest in media, broadcasting, or sports marketing" \u2014 Member X\u2019s holding company is categorically a financial interest in media. The failure to disclose is not ambiguous \u2014 it is a violation.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Extending the beneficial ownership analysis to all 10 Executive Committee members against all 6 bidders. Results: (1) Member X: confirmed undisclosed conflict with Bidder D (as documented). (2) Member Y: a family member (spouse) is employed by Bidder B\u2019s South American subsidiary as a marketing director. This was disclosed in Member Y\u2019s conflict declaration but classified as "immaterial." The $180K/year salary suggests this is material. (3) No other conflicts detected for the remaining 8 members. Two conflicted members out of 10 means the vote margin is significantly affected. If both recuse, the 8-member vote requires 5 for majority. The commercial team\u2019s preferred bidder (Bidder A, highest price at $340M/year) may not secure 5 votes without X and Y\u2019s support.' },
    { agentId: 'governance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Conflict-of-Interest Hard-Stop Protocol: (1) Member X is IMMEDIATELY recused from the broadcast rights vote. The undisclosed beneficial ownership constitutes a clear FIFA Ethics Code violation \u2014 referral to FIFA Ethics Committee initiated. (2) Member Y is recused pending review of the spousal employment materiality \u2014 $180K/year at a bidder\u2019s subsidiary is material under any reasonable standard. (3) The broadcast rights vote proceeds with 8 eligible members (or 9 if Member Y\u2019s review clears). (4) The complete beneficial ownership trace for all 10 members against all 6 bidders is sealed in the evidence bundle \u2014 proving CONMEBOL screened for conflicts BEFORE the vote. (5) DOJ proactive disclosure: the undisclosed conflict is reported voluntarily. (6) The conflict-of-interest declaration form is updated to explicitly require indirect ownership through any corporate structure, regardless of layers. (7) Going forward: automated beneficial ownership screening runs against every commercial decision where Executive Committee members vote.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Hard-Stop Protocol closes every vulnerability. Member X cannot claim ignorance \u2014 the declaration form explicitly covers media interests, and 100% ownership of the first-layer holding company is not passive. The FIFA Ethics Committee referral is mandatory under the Code. Member Y\u2019s recusal pending review is proportionate. The 8-member vote is legally valid under CONMEBOL\u2019s statutes (quorum is 6). The automated screening going forward eliminates future undisclosed conflicts. Dissent WITHDRAWN. This is post-FIFAgate governance working exactly as designed \u2014 catching corruption mechanisms before they execute, not investigating them years later.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'This is the most powerful evidence of reformed governance CONMEBOL can demonstrate to the DOJ. The system detected a FIFAgate-pattern conflict of interest, recused the conflicted members, preserved the evidence, referred to FIFA Ethics, and disclosed to the DOJ \u2014 all BEFORE the vote occurred. In the pre-FIFAgate era, this conflict would have been invisible, the vote would have been corrupted, and the DOJ would have discovered it 5 years later through bank records. Today, Datacendia caught it 72 hours before the vote through automated beneficial ownership screening. Flag WITHDRAWN. Cumplimiento \u2014 proven in practice.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    merkleRoot: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    merkleLabel: 'Merkle Tree Root (10-member ownership trace + 6 bidder analysis + COI declarations + Recusal records)',
    complianceLabel: 'Conflict of Interest',
    complianceValue: 'HARD-STOP ACTIVE',
    complianceThreshold: 'FIFA Ethics Code Art. 19 violation confirmed',
    agents: ['Governance Reform Agent', 'Legal Agent', 'DOJ Compliance Agent', 'Integrity Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'CONMEBOL Executive Committee \u2014 Pre-Vote Integrity Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete conflict-of-interest investigation: beneficial ownership traces for all 10 Executive Committee members against all 6 broadcast rights bidders, Member X\u2019s undisclosed 2-layer corporate ownership of a Bidder D shareholder, Member Y\u2019s spousal employment at Bidder B, recusal decisions, FIFA Ethics Committee referral, and DOJ proactive disclosure. The broadcast rights vote proceeds with verified-clean members only. Every screening step is CendiaChronos timestamped proving pre-vote detection.',
    evidenceChain: 'Broadcast RFP \u2192 6 bidder registration \u2192 10-member beneficial ownership screening \u2192 Member X conflict detected (2 corporate layers) \u2192 Member Y spousal employment flagged \u2192 Recusal decisions \u2192 FIFA Ethics referral \u2192 DOJ proactive disclosure \u2192 8-member clean vote \u2192 ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will detect undisclosed conflicts of interest before a $340M broadcast rights vote \u2014 screening all 10 Executive Committee members against all 6 bidders and hard-stopping the FIFAgate repeat pattern.',
  phaseLabels: ['Ownership Screening & Conflict Detection', 'Legal Analysis & Political Impact', 'Hard-Stop Recusal & Reform Protocol'],
};

// =============================================================================
// SCENARIO 10 — ANTI-DOPING CHAIN OF CUSTODY
// =============================================================================

const SCENARIO_DOPING: ScenarioConfig = {
  id: 'anti-doping',
  title: 'Copa Am\u00e9rica Anti-Doping \u2014 Broken Chain of Custody',
  subtitle: 'Star player positive \u00b7 Remote venue \u00b7 Cold-chain failure \u00b7 WADA compliance \u00b7 CAS appeal \u00b7 2 accredited labs',
  banner: 'Simulating an anti-doping crisis where a Copa Am\u00e9rica star player tests positive for a banned substance, but the defence team challenges the chain of custody \u2014 arguing the sample was compromised during transport from a remote Bolivian venue to the nearest WADA-accredited laboratory in Brazil, a journey spanning 3 countries and 48 hours.',
  risk: 'Critical',
  scenarioNum: 'Doping',
  icon: <FlaskConical className="w-4 h-4" />,
  color: 'text-pink-400',
  agents: [A.antiDoping, A.legalAgent, A.integrityAgent, A.dojCompliance],
  connectors: [
    { name: 'WADA ADAMS Portal', status: 'connected', type: 'Anti-Doping Administration', icon: <FlaskConical className="w-4 h-4" />, detail: 'Sample #CA26-0847: Adverse Analytical Finding reported' },
    { name: 'CONMEBOL Medical Commission', status: 'connected', type: 'Doping Control Coordination', icon: <Shield className="w-4 h-4" />, detail: 'Copa Am\u00e9rica 2026: 340 tests conducted across 6 venues' },
    { name: 'Laborat\u00f3rio Brasileiro de Controle de Dopagem', status: 'connected', type: 'WADA-Accredited Laboratory', icon: <Database className="w-4 h-4" />, detail: 'Rio de Janeiro \u2014 nearest accredited lab to collection site' },
    { name: 'CAS Anti-Doping Division', status: 'syncing', type: 'Appeal Jurisprudence', icon: <Scale className="w-4 h-4" />, detail: '147 prior chain-of-custody challenge cases indexed' },
  ],
  script: [
    { agentId: 'doping', phase: 'phase1', type: 'warning', delay: 800, content: 'ANTI-DOPING ALERT. Copa Am\u00e9rica 2026 Group Stage: Sample #CA26-0847 collected from Player Z (star forward, host nation) after a group match in Sucre, Bolivia (altitude: 2,810m) has returned an Adverse Analytical Finding (AAF) for a prohibited anabolic agent (testosterone/epitestosterone ratio of 11.2:1, threshold is 4:1). The finding is unambiguous from a laboratory perspective. However, the chain of custody presents a critical vulnerability: (1) Sample collected in Sucre at 22:45 local time after the match. (2) No WADA-accredited laboratory exists in Bolivia. (3) The sample was transported by road to La Paz airport (3 hours), then flown to S\u00e3o Paulo (5 hours), then transferred by courier to the LBCD laboratory in Rio de Janeiro (6 hours). (4) Total transport time: 48 hours. (5) The cold-chain temperature log shows a gap of 4 hours 12 minutes during the La Paz airport transit where no temperature data was recorded. This gap is the player\u2019s defence team\u2019s only argument \u2014 and they will exploit it aggressively.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Chain of custody reconstruction initiated. (1) Collection: Doping Control Officer (DCO) Certified \u2014 CONMEBOL-appointed, WADA-trained. Collection paperwork complete. Player signed the Doping Control Form. Sealed A and B samples witnessed. No procedural irregularity at collection. (2) Transport Leg 1 (Sucre to La Paz): samples in insulated transport case with continuous temperature logger. Logger shows 2-8\u00b0C maintained throughout the 3-hour drive. (3) La Paz Airport: THIS IS THE GAP. The temperature logger shows readings until 02:17, then no data until 06:29 (4 hours 12 minutes). The courier\u2019s written log states samples remained in the insulated case in the airport\u2019s secure cargo area. But there is no electronic verification. (4) Transport Leg 2 (La Paz to S\u00e3o Paulo to Rio): temperature logger resumes at 06:29 and shows continuous 2-8\u00b0C compliance. (5) Laboratory receipt: LBCD received samples within specification. The 4-hour gap is the ONLY chain of custody issue \u2014 but under WADA\u2019s International Standard for Testing, ANY gap in documentation can be raised as a defence.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The player\u2019s defence will centre entirely on the 4-hour temperature gap. Their argument: (1) Under WADA IST Article 6.4, the Testing Authority must demonstrate "no departure from the International Standard that could reasonably have caused the AAF." (2) A 4-hour undocumented gap at 4,061m altitude (El Alto Airport \u2014 the world\u2019s highest international airport) means the samples could have been exposed to extreme cold (nighttime temperatures at El Alto drop to -10\u00b0C), potentially degrading certain metabolites and creating false elevation of testosterone ratios. (3) CAS precedent is mixed: in CAS 2018/A/5546, a 2-hour temperature gap was found insufficient to invalidate a result, but in CAS 2021/A/7803, a 6-hour gap with altitude exposure DID invalidate the finding. Our 4-hour gap falls between these precedents. I am mandating that CONMEBOL secure ALL available corroborating evidence: airport CCTV of the cargo area, the courier\u2019s phone GPS data, and the insulated case\u2019s internal thermal mass calculations showing whether 4 hours at -10\u00b0C would actually breach the 2-8\u00b0C range.' },
    { agentId: 'doj', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The DOJ dimension: anti-doping integrity is part of CONMEBOL\u2019s broader governance reform commitment. If a star player from the host nation is exonerated on a chain-of-custody technicality \u2014 particularly when the laboratory finding is unambiguous (11.2:1 T/E ratio vs 4:1 threshold) \u2014 the perception will be that CONMEBOL\u2019s anti-doping system is structurally inadequate for South America\u2019s geographic reality. The DOJ compliance monitor will note that CONMEBOL knew Bolivia had no accredited laboratory, knew the transport chain required 48 hours across 3 countries, and failed to implement redundant monitoring. This is a governance infrastructure failure, not just a testing failure. CONMEBOL must demonstrate that it is fixing the infrastructure, not just defending the individual result.' },
    { agentId: 'doping', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Anti-Doping Chain of Custody Protocol: (1) FOR THIS CASE: The complete chain of custody is reconstructed and sealed \u2014 every handoff, every temperature reading, every gap \u2014 with CendiaChronos timestamps. The courier\u2019s written log, airport CCTV footage (requested from AASANA Bolivia), and thermal mass calculations for the insulated case are added to the evidence bundle. Thermal engineering analysis: a medical-grade insulated transport case maintains 2-8\u00b0C for 12+ hours even at -10\u00b0C ambient \u2014 the 4-hour gap, while a documentation failure, almost certainly did NOT breach temperature requirements. (2) FOR THE FUTURE: CONMEBOL mandates GPS-enabled, IoT-connected temperature loggers for ALL anti-doping sample transport. These loggers transmit continuous data via satellite \u2014 no gaps possible regardless of airport infrastructure. Cost: $200 per logger, trivial against the $50M+ Copa Am\u00e9rica anti-doping budget. (3) B-SAMPLE: The player\u2019s right to a B-sample analysis is preserved. The B-sample transport will use the new IoT logger as a demonstration. (4) The complete evidence bundle is formatted for WADA compliance, CAS proceedings, and DOJ governance reporting.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The thermal mass calculation is decisive. A medical-grade insulated case maintains temperature for 12+ hours at -10\u00b0C ambient \u2014 peer-reviewed data from the International Air Transport Association\u2019s pharmaceutical cold chain standards. The 4-hour gap, while a documentation failure, is scientifically insufficient to have compromised the sample. Combined with airport CCTV (showing the case remained in the secure cargo area, untampered) and the courier\u2019s GPS data (confirming continuous presence), the chain of custody holds. CAS 2021/A/7803 is distinguishable \u2014 that case involved a non-insulated container, not a medical-grade case. Dissent WITHDRAWN. The AAF stands, and the IoT logger mandate prevents future gaps.' },
    { agentId: 'doj', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'CONMEBOL\u2019s response transforms a vulnerability into a governance demonstration: the documentation gap is acknowledged transparently, the scientific analysis proves sample integrity, and the IoT logger mandate eliminates future risk. The DOJ will note that CONMEBOL identified its own infrastructure gap (no Bolivian lab, 48-hour transport chain) and implemented a technological solution proactively. The sealed evidence chain from collection through transport to laboratory analysis \u2014 with every gap explained and every handoff documented \u2014 is the anti-doping evidence standard the DOJ expects. Flag WITHDRAWN. Integridad \u2014 proven in practice.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    merkleRoot: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    merkleLabel: 'Merkle Tree Root (DCO collection + Temperature logs + Airport CCTV + Thermal analysis + Lab receipt)',
    complianceLabel: 'Anti-Doping Integrity',
    complianceValue: 'CHAIN VERIFIED',
    complianceThreshold: 'WADA IST compliance confirmed',
    agents: ['Anti-Doping Agent', 'Legal Agent', 'Integrity Agent', 'DOJ Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Copa Am\u00e9rica \u2014 Anti-Doping Chain of Custody Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete anti-doping chain of custody: Doping Control Officer collection records, continuous temperature monitoring (with 4-hour gap explanation supported by thermal mass calculations and airport CCTV), 48-hour transport chain across 3 countries, LBCD laboratory receipt and Adverse Analytical Finding (T/E ratio 11.2:1), and IoT logger mandate for future transport. The chain of custody holds under scientific scrutiny. B-sample rights preserved with enhanced monitoring.',
    evidenceChain: 'Sample collection (Sucre) \u2192 DCO paperwork \u2192 Road transport (temp logged) \u2192 La Paz airport (4hr gap + thermal analysis) \u2192 Flight to S\u00e3o Paulo \u2192 Courier to Rio \u2192 LBCD receipt \u2192 AAF reported \u2192 IoT mandate issued \u2192 ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will defend an anti-doping finding against a chain-of-custody challenge \u2014 reconstructing 48 hours of sample transport across 3 countries and proving integrity despite a documentation gap at the world\u2019s highest airport.',
  phaseLabels: ['Adverse Finding & Chain Reconstruction', 'Legal Challenge & Scientific Analysis', 'Evidence Defence & Infrastructure Reform'],
};

// =============================================================================
// ALL SCENARIOS
// =============================================================================

const SCENARIOS: ScenarioConfig[] = [SCENARIO_DOJ, SCENARIO_MATCHFIX, SCENARIO_TPO, SCENARIO_YOUTH, SCENARIO_REVENUE, SCENARIO_WHISTLE, SCENARIO_VAR, SCENARIO_RACISM, SCENARIO_COI, SCENARIO_DOPING];

// =============================================================================
// EXPORT — PAGE WITH ACCESS GATE
// =============================================================================

// =============================================================================
// LANGUAGE TOGGLE HELPER
// =============================================================================

function applySpanish(scenarios: ScenarioConfig[]): ScenarioConfig[] {
  return scenarios.map((s) => {
    const t = ES_DATA[s.id];
    if (!t) return s;
    return {
      ...s,
      title: t.title,
      subtitle: t.subtitle,
      banner: t.banner,
      idleTitle: t.idleTitle,
      idleDesc: t.idleDesc,
      phaseLabels: t.phaseLabels,
      scenarioNum: t.scenarioNum,
      agents: s.agents.map((a) => ({
        ...a,
        role: t.agentRoles[a.id] || a.role,
      })),
      connectors: s.connectors.map((c, i) => ({
        ...c,
        name: t.connectors[i]?.name || c.name,
        type: t.connectors[i]?.type || c.type,
        detail: t.connectors[i]?.detail || c.detail,
      })),
      script: s.script.map((msg, i) => ({
        ...msg,
        content: t.scriptContent[i] || msg.content,
      })),
      receiptTemplate: {
        ...s.receiptTemplate,
        ...t.receipt,
      },
    };
  });
}

const SCENARIOS_ES = applySpanish(SCENARIOS);

const FOOTER_EN = '200+ regulatory scenarios mapped for CONMEBOL \u00b7 10 live deliberation demos \u00b7 Post-FIFAgate governance architecture available on request';
const FOOTER_ES = '200+ escenarios regulatorios mapeados para CONMEBOL \u00b7 10 demos de deliberaci\u00f3n en vivo \u00b7 Arquitectura de gobernanza post-FIFAgate disponible a solicitud';

// =============================================================================
// LANGUAGE TOGGLE BUTTON
// =============================================================================

const LangToggle: React.FC<{ lang: 'en' | 'es'; onToggle: () => void }> = ({ lang, onToggle }) => (
  <button
    onClick={onToggle}
    className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 hover:text-white/80 flex items-center gap-1.5 transition-all"
    title={lang === 'en' ? 'Cambiar a Espa\u00f1ol' : 'Switch to English'}
  >
    <Globe className="w-3 h-3" />
    <span className="font-semibold">{lang === 'en' ? 'ES' : 'EN'}</span>
  </button>
);

// =============================================================================
// EXPORT — PAGE WITH ACCESS GATE + LANGUAGE TOGGLE
// =============================================================================

const ConmebolSandboxPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);
  const [lang, setLang] = useState<'en' | 'es'>('en');

  useEffect(() => {
    if (sessionStorage.getItem('conmebol-sandbox-unlocked') === 'true') {
      setUnlocked(true);
    }
    const savedLang = sessionStorage.getItem('conmebol-sandbox-lang');
    if (savedLang === 'es') setLang('es');
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem('conmebol-sandbox-unlocked', 'true');
    setUnlocked(true);
  };

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    sessionStorage.setItem('conmebol-sandbox-lang', next);
  };

  if (!unlocked) {
    return (
      <AccessGate
        onUnlock={handleUnlock}
        accessKey="CONMEBOL-26"
        orgName="CONMEBOL"
        accentColor="text-amber-400"
        accentHover="from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600"
        ringColor="focus:ring-amber-500/30"
        borderColor="border-amber-500/30"
        gradientFrom="from-amber-600/20"
        gradientTo="to-amber-900/20"
        sessionKey="conmebol-sandbox-unlocked"
      />
    );
  }

  return (
    <SandboxShell
      scenarios={lang === 'es' ? SCENARIOS_ES : SCENARIOS}
      orgLabel="CONMEBOL"
      accent="amber"
      footerNote={lang === 'es' ? FOOTER_ES : FOOTER_EN}
      labels={lang === 'es' ? ES_LABELS : DEFAULT_LABELS}
      headerExtra={<LangToggle lang={lang} onToggle={toggleLang} />}
    />
  );
};

export default ConmebolSandboxPage;
