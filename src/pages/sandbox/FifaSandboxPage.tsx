/**
 * Page — FIFA Sandbox Demo
 *
 * Bespoke sandbox for FIFA / Gianni Infantino executive outreach.
 * 5 fully scripted multi-agent deliberation scenarios at World Cup scale.
 *
 * Access: /sandbox/fifa (Key: FIFA-WC-26)
 *
 * @exports FifaSandboxPage
 * @module pages/sandbox/FifaSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect } from 'react';
import { Activity, Banknote, Scale, Globe, FileText, Shield, MessageSquare, Database, Eye, DollarSign, Video } from 'lucide-react';
import type { ScenarioConfig, Agent } from './SandboxShared';
import { AccessGate, SandboxShell } from './SandboxShared';

// =============================================================================
// FIFA-SPECIFIC AGENT DEFINITIONS
// =============================================================================

const A = {
  matchOfficial: { id: 'match-official', name: 'Match Official Agent', role: 'VAR Audio & SAOT Frame-Data Ingestion', icon: '🏟️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' } as Agent,
  integrityAgent: { id: 'integrity', name: 'Integrity Agent', role: 'Data Tampering Detection & API Verification', icon: '🛡️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' } as Agent,
  regulatoryAgent: { id: 'regulatory', name: 'Regulatory Agent', role: 'IFAB VAR Protocol & Laws of the Game', icon: '📋', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' } as Agent,
  legalAgent: { id: 'legal', name: 'Legal Agent', role: 'CAS Jurisprudence & Swiss Federal Tribunal', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' } as Agent,
  whistleblower: { id: 'whistle', name: 'CendiaWhistle Agent', role: 'Cryptographic Anonymity & Match-Fixing Intel', icon: '🔐', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' } as Agent,
  drawAgent: { id: 'draw', name: 'Draw & Scheduling Agent', role: 'Tournament Seeding & Fixture AI', icon: '🎱', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' } as Agent,
  distribution: { id: 'distrib', name: 'Revenue Distribution Agent', role: '$7.5B World Cup Revenue Allocation', icon: '💰', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' } as Agent,
  antiDoping: { id: 'doping', name: 'Anti-Doping Agent', role: 'WADA Code & FIFA ADR Compliance', icon: '🧪', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' } as Agent,
  publicComms: { id: 'comms', name: 'Public Communications Agent', role: 'Crisis Management & Real-Time Transparency', icon: '📡', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' } as Agent,
};

// =============================================================================
// SCENARIO 1 — "18-SECOND" VAR AUDIT
// =============================================================================

const SCENARIO_VAR: ScenarioConfig = {
  id: 'var-audit',
  title: 'The "18-Second" VAR Audit — World Cup Integrity',
  subtitle: 'Quarter-Final · SAOT offside reversal · Host nation eliminated · 1.2B viewers · Betting market spike',
  banner: 'Simulating a World Cup 2026 Quarter-Final where a goal is overturned by Semi-Automated Offside Technology. The host nation (USA) is eliminated. Fans claim the AI was "rigged" or "hacked." FIFA must prove integrity within minutes — not months.',
  risk: 'Critical',
  scenarioNum: 'VAR Audit',
  icon: <Video className="w-4 h-4" />,
  color: 'text-cyan-400',
  agents: [A.matchOfficial, A.integrityAgent, A.regulatoryAgent, A.publicComms],
  connectors: [
    { name: 'VAR Operations Room', status: 'connected', type: 'Raw VAR Audio & Video', icon: <Video className="w-4 h-4" />, detail: 'Match #52: USA v Brazil QF — 78th minute incident' },
    { name: 'SAOT System (Hawk-Eye)', status: 'connected', type: 'Semi-Automated Offside Technology', icon: <Eye className="w-4 h-4" />, detail: '12 dedicated cameras · 29 body points tracked per player' },
    { name: 'FIFA Integrity Platform', status: 'connected', type: 'Betting Market Monitoring', icon: <Activity className="w-4 h-4" />, detail: 'ALERT: 340% spike in in-play betting 18 seconds before flag' },
    { name: 'IFAB Laws Database', status: 'syncing', type: 'VAR Protocol & LOTG', icon: <FileText className="w-4 h-4" />, detail: 'Laws of the Game 2025/26 + VAR Protocol v4.2' },
  ],
  script: [
    { agentId: 'match-official', phase: 'phase1', type: 'analysis', delay: 800, content: 'Ingesting raw data from Match #52 (USA v Brazil, QF). Incident: 78th minute, USA scores to make it 2-1 in extra time. SAOT system flags offside on the goalscorer. VAR review initiated. Raw VAR audio shows the Video Match Official (VMO) requested a check at 78:12. SAOT frame-data shows the goalscorer\'s left shoulder was 11.7cm beyond the last defender at the moment of the pass. The SAOT confidence interval is ±2.1cm. Decision: goal disallowed at 78:47. Total deliberation window: 35 seconds. Brazil advances 1-0. Host nation eliminated.' },
    { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 2500, content: 'CRITICAL ALERT. FIFA Integrity Platform detected a 340% spike in in-play betting on "Next Goal: No Goal" markets across 7 bookmakers, beginning 18 seconds BEFORE the offside flag was raised. This pattern matches known indicators of information leakage — someone may have known the goal would be disallowed before the public broadcast. I am initiating a full data integrity audit of the SAOT system: (1) Verifying no external API calls were made during the 35-second deliberation window, (2) Checking all network logs for the 12 SAOT cameras, (3) Confirming the frame-data was not modified between capture and decision.' },
    { agentId: 'regulatory', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The IFAB VAR Protocol v4.2, Section 7.3 states: "The VMO must communicate the factual basis for the decision to the referee using standardised terminology." The raw VAR audio shows the VMO said "offside, left shoulder" but did NOT specify the margin (11.7cm) or the confidence interval (±2.1cm). Under the Protocol, the referee is making a decision without full information. Furthermore, with a margin of 11.7cm ± 2.1cm, there is a 4.7% probability that the goalscorer was actually onside. The Laws of the Game do not currently address AI confidence intervals. This is a regulatory gap that will be exploited in any CAS appeal.' },
    { agentId: 'comms', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Social media analysis shows 4.7 million posts in the first 3 minutes after the decision, with 78% negative sentiment. "#RiggedWorldCup" is trending #1 globally. 3 US congressional representatives have already issued statements demanding an investigation. The US Soccer Federation has announced they will file a formal protest. FIFA has approximately 60 minutes before the post-match press conference to provide a credible integrity statement. After 60 minutes, the narrative becomes "FIFA is hiding something."' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia "Public Integrity Receipt" — generated within 15 minutes: (1) SAOT data audit: CONFIRMED — zero external API calls during the 35-second window. All 12 camera feeds show unbroken SHA-256 hash chains from capture to decision. No frame modification detected. The system was not hacked. (2) Betting spike analysis: The 18-second pre-flag spike is attributable to stadium-based bettors who could see the linesman\'s delayed flag before broadcast cameras — this is a known "stadium advantage" pattern, not information leakage. (3) The complete SAOT frame-data, camera feeds, and VAR audio are cryptographically sealed and made available for independent verification.' },
    { agentId: 'regulatory', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The Public Integrity Receipt addresses the regulatory gap: while the IFAB Protocol does not require confidence intervals, the Datacendia seal INCLUDES the 11.7cm margin and ±2.1cm interval — providing more transparency than the Protocol requires. This pre-empts the CAS appeal argument. Additionally, the sealed VAR audio proves the VMO followed correct Protocol procedures. Dissent WITHDRAWN. Recommending FIFA publish the Integrity Receipt at the post-match press conference — full transparency within 60 minutes.' },
    { agentId: 'comms', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Public Integrity Receipt provides FIFA\'s press conference with: (1) Proof the SAOT system was not hacked or tampered with, (2) Explanation of the betting spike (stadium advantage, not corruption), (3) Full transparency on the offside margin and confidence interval, (4) An invitation for US Soccer to independently verify all data. This transforms the narrative from "FIFA is hiding something" to "FIFA proved integrity faster than any sports organisation in history." Flag WITHDRAWN. Press statement drafted.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a3c25c3f49ed01c7a97d7e5bbc3b4e4b39b7afc73b28e19fd8b3c31a77bb1234',
    merkleRoot: 'f4d2e91a8c76b5e3d1a9f0c2b4e8d6a3c5b7e1f0a2d4c6b8e0f2a4d6c8b0e2a4',
    merkleLabel: 'Merkle Tree Root (12 SAOT camera feeds + VAR audio + Betting data + Frame-by-frame analysis)',
    complianceLabel: 'SAOT System Integrity',
    complianceValue: 'VERIFIED CLEAN',
    complianceThreshold: '0 tampering events detected',
    agents: ['Match Official Agent', 'Integrity Agent', 'Regulatory Agent', 'Public Communications Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA World Cup 2026 — Public Integrity Receipt',
    guaranteeBody: 'This cryptographic bundle proves that the SAOT offside decision in Match #52 (USA v Brazil, QF) was made without system tampering, data modification, or information leakage. All 12 camera feeds maintain unbroken hash chains. The betting spike is attributable to stadium advantage, not corruption. The offside margin (11.7cm ± 2.1cm) and complete VAR deliberation are sealed for independent verification. The World Cup was won on the pitch, not in a server room.',
    evidenceChain: '12 SAOT cameras → Frame capture (78:12) → Body point detection (29 points) → Offside calculation → VMO audio review → Referee decision → Betting market analysis → Stadium advantage attribution → Public Integrity Receipt → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to a World Cup offside controversy in real-time — proving to 1.2 billion viewers that the technology was not rigged, hacked, or corrupt.',
  phaseLabels: ['Incident Analysis', 'Integrity & Regulatory Review', 'Public Integrity Receipt'],
};

// =============================================================================
// SCENARIO 2 — CENDIAWHISTLE MATCH-FIXING
// =============================================================================

const SCENARIO_WHISTLE: ScenarioConfig = {
  id: 'whistle-fixing',
  title: 'CendiaWhistle — World Cup Match-Fixing Intel',
  subtitle: 'Anonymous report · Referee manipulation · Organised crime syndicate · 211 member associations',
  banner: 'Simulating an anonymous match-fixing report received 72 hours before a World Cup group stage match. CendiaWhistle ring signatures protect the source while enabling a coordinated law enforcement response across 3 jurisdictions.',
  risk: 'Critical',
  scenarioNum: 'Match-Fixing',
  icon: <MessageSquare className="w-4 h-4" />,
  color: 'text-violet-400',
  agents: [A.whistleblower, A.integrityAgent, A.legalAgent, A.regulatoryAgent],
  connectors: [
    { name: 'CendiaWhistle Portal', status: 'connected', type: 'Anonymous Reporting', icon: <MessageSquare className="w-4 h-4" />, detail: 'Ring signature verified — reporter among 211 associations' },
    { name: 'FIFA Integrity Department', status: 'connected', type: 'Match-Fixing Intelligence', icon: <Shield className="w-4 h-4" />, detail: '3,400+ suspicious match reports indexed' },
    { name: 'Sportradar Integrity Services', status: 'connected', type: 'Betting Pattern Analysis', icon: <Activity className="w-4 h-4" />, detail: 'Real-time monitoring across 600+ bookmakers' },
    { name: 'INTERPOL Match-Fixing Unit', status: 'syncing', type: 'Law Enforcement Coordination', icon: <Globe className="w-4 h-4" />, detail: 'Secure channel — 3 jurisdictions standing by' },
  ],
  script: [
    { agentId: 'whistle', phase: 'phase1', type: 'warning', delay: 800, content: 'PRIORITY ALERT. CendiaWhistle has received an anonymous report from within the FIFA referee network alleging that an organised crime syndicate has approached the assistant referee assigned to Group C, Match #18 (scheduled in 72 hours). The report includes: (1) The name of the intermediary, (2) A specific instruction — "flag offside on any counter-attack in the second half if the score is level," (3) Evidence of a $400,000 payment routed through a Malaysian betting syndicate. Ring signature confirms the reporter is authenticated within FIFA\'s 211-association network. Identity is mathematically sealed.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Cross-referencing report with Sportradar data and FIFA Integrity Department records. CONFIRMED: (1) The named intermediary appears in 3 prior suspicious activity reports (SARs) from 2019-2023, all involving Asian betting markets. (2) Sportradar confirms unusual pre-match betting patterns on "Total Offsides" markets for Match #18 — 780% above normal volume, concentrated in 4 Malaysian and Vietnamese bookmakers. (3) The specific assistant referee was previously flagged in a 2021 FIFA investigation that was closed due to "insufficient evidence." Pattern confidence: 94.7% that this is a genuine match-fixing attempt.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. This is a multi-jurisdictional criminal matter involving: (1) US jurisdiction (match is in Houston, TX — US wire fraud statutes apply), (2) Swiss jurisdiction (FIFA HQ — Swiss Criminal Code Art. 322), (3) Malaysian jurisdiction (source of betting syndicate). We cannot simply replace the referee without: (a) notifying law enforcement in all 3 jurisdictions, (b) ensuring the whistleblower\'s identity is protected under each jurisdiction\'s laws, (c) avoiding "tipping off" the syndicate that we know about the fix. If we replace the referee publicly, the syndicate disappears and we lose the chance to prosecute.' },
    { agentId: 'regulatory', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Under FIFA\'s Anti-Match-Fixing Regulations, Article 14, the Secretary General has the authority to take "any appropriate measure" to protect match integrity, including last-minute referee changes. However, the FIFA Disciplinary Code requires that the accused referee be given an opportunity to respond before any sanction. If we replace the referee without due process, any subsequent prosecution could be challenged. I am recommending a covert replacement under "medical grounds" — the referee is informed they have been selected for a random medical assessment 24 hours before the match.' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing coordinated integrity protocol: (1) CendiaWhistle report sealed and transmitted to INTERPOL via encrypted channel — 3 jurisdictions simultaneously notified. (2) Assistant referee replaced under "medical assessment" protocol — no public disclosure. (3) Sportradar instructed to continue monitoring betting patterns to track syndicate activity in real-time. (4) A "honeypot" approach: allow the syndicate to believe the fix is still active, capture their betting activity as evidence, then coordinate arrests across 3 jurisdictions post-match. (5) All evidence sealed in Datacendia\'s Regulator\'s Receipt for prosecution.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Coordinated protocol satisfies all jurisdictional requirements: US DOJ (wire fraud), Swiss OAG (sports corruption), Malaysian MACC (gambling offences). The CendiaWhistle ring signature provides admissible evidence of the report without revealing the source — the mathematical anonymity guarantee means even a court cannot compel identification. The "honeypot" approach maximises prosecution success while protecting match integrity. Dissent WITHDRAWN. Evidence bundle will support criminal prosecution in all 3 jurisdictions simultaneously.' },
    { agentId: 'whistle', phase: 'phase3', type: 'resolution', delay: 2000, content: 'CendiaWhistle evidence bundle sealed for multi-jurisdictional prosecution. Reporter receives anonymous encrypted acknowledgment confirming: (1) Report received and actioned, (2) Match integrity protected, (3) Law enforcement coordinated. Reporter\'s identity remains mathematically impossible to extract — even under subpoena in any of the 3 jurisdictions. This is the strongest whistleblower protection in the history of sports integrity.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:b5bb9d8014a0f9b1d61e21e796d78dccdf1352f23cd32812f4850b878ae4944c',
    merkleRoot: '7d793037a0760186574b0282f2f435e7',
    merkleLabel: 'Merkle Tree Root (Ring signature + Match-fixing intel + Sportradar data + INTERPOL referral)',
    complianceLabel: 'Match Integrity',
    complianceValue: 'PROTECTED',
    complianceThreshold: '3-jurisdiction coordination active',
    agents: ['CendiaWhistle Agent', 'Integrity Agent', 'Legal Agent', 'Regulatory Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA Anti-Match-Fixing — Multi-Jurisdictional Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete match-fixing intelligence chain: anonymous CendiaWhistle report, Sportradar betting analysis, referee assessment protocol, and INTERPOL coordination across US/Swiss/Malaysian jurisdictions. Whistleblower identity is mathematically impossible to extract. Evidence is admissible in all 3 jurisdictions for criminal prosecution.',
    evidenceChain: 'CendiaWhistle ring signature → Anonymous report → Sportradar betting analysis → FIFA SAR cross-reference → INTERPOL notification (3 jurisdictions) → Referee medical protocol → Honeypot monitoring → Evidence seal → ML-DSA-65 signature',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to a match-fixing threat 72 hours before a World Cup match — coordinating law enforcement across 3 jurisdictions while protecting the whistleblower\'s identity with mathematical certainty.',
  phaseLabels: ['Intelligence Triage', 'Legal & Jurisdictional Analysis', 'Coordinated Response Protocol'],
};

// =============================================================================
// SCENARIO 3 — CLUB WORLD CUP DRAW INTEGRITY
// =============================================================================

const SCENARIO_DRAW: ScenarioConfig = {
  id: 'draw-cwc',
  title: 'Club World Cup 32 — Draw Integrity & Scheduling AI',
  subtitle: '32 clubs · 6 confederations · Complex seeding · Commercial constraints · $2B+ at stake',
  banner: 'Simulating the FIFA Club World Cup 2025 draw where the scheduling AI must balance sporting fairness, commercial broadcaster requirements, and venue logistics across 12 US stadiums — while proving the entire process is unbiased.',
  risk: 'High',
  scenarioNum: 'Draw Integrity',
  icon: <Activity className="w-4 h-4" />,
  color: 'text-orange-400',
  agents: [A.drawAgent, A.integrityAgent, A.legalAgent, A.publicComms],
  connectors: [
    { name: 'FIFA Draw Engine', status: 'connected', type: 'Seeding & Scheduling Algorithm', icon: <Database className="w-4 h-4" />, detail: '32 clubs from 6 confederations' },
    { name: 'Commercial Rights Database', status: 'connected', type: 'Broadcaster Requirements', icon: <Globe className="w-4 h-4" />, detail: 'Apple TV + 14 regional broadcasters' },
    { name: 'Venue Logistics System', status: 'connected', type: 'Stadium Availability', icon: <Activity className="w-4 h-4" />, detail: '12 US stadiums · 63 matches · Travel constraints' },
    { name: 'FIFA Rankings & Coefficients', status: 'syncing', type: 'Club Performance Data', icon: <FileText className="w-4 h-4" />, detail: 'Continental coefficients for all 32 clubs' },
  ],
  script: [
    { agentId: 'draw', phase: 'phase1', type: 'analysis', delay: 800, content: 'Draw algorithm initialised for the FIFA Club World Cup 2025. 32 clubs from 6 confederations loaded into 8 groups of 4. Active constraints: (1) No same-confederation group pairings, (2) Maximum 2 clubs from any single confederation per group, (3) Seeded clubs separated across groups, (4) Broadcaster "marquee match" requirements (Apple TV requires Real Madrid and Man City in separate groups for maximum matchday spread), (5) Travel distance optimisation across 12 US stadiums, (6) Rest day compliance (minimum 72 hours between matches). Constraint-satisfaction space: 8.7 × 10¹⁸ valid permutations.' },
    { agentId: 'integrity', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The broadcaster "marquee match" constraints create a perception problem. Apple TV has contractual rights to specify that certain high-profile clubs are placed in groups that maximise primetime US viewing. While this is commercially standard, it means the draw is NOT purely random — it is constrained by commercial interests. If Flamengo (Pot 2) is drawn into a "death group" with Real Madrid AND Bayern Munich, while an MLS club gets an easier group, South American media will allege favouritism. We need the commercial constraints to be declared publicly BEFORE the draw, not discovered after.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under FIFA Statutes Article 69 (Draws for FIFA Competitions), the draw procedure must be "approved by the FIFA Council" and conducted in a "transparent manner." The Apple TV commercial constraints were negotiated as part of a $1B media rights deal and are confidential. If we publish them, Apple may claim breach of commercial confidentiality. If we don\'t publish them and the constraints are later discovered, FIFA faces a transparency scandal. This is a fundamental tension between commercial confidentiality and sporting integrity.' },
    { agentId: 'comms', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. Historical precedent from the 2022 World Cup: Qatar\'s placement in Group A (the opening match group) was widely perceived as "rigged" for the host nation despite being standard FIFA protocol. The 2025 Club World Cup is FIFA\'s most commercially ambitious project — any perception of a fixed draw could undermine the entire $4.5B tournament. I am recommending a proactive transparency strategy: publish all constraints (including commercial ones) 48 hours before the draw, framing them as "standard commercial practice in all major sports."' },
    { agentId: 'draw', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Draw Integrity Protocol for Club World Cup: (1) BEFORE: All constraints (sporting, commercial, logistical) published as a cryptographically hashed document 48 hours pre-draw. Every club receives the constraint set. (2) DURING: Random seed generated from NIST Randomness Beacon. Each group allocation is sealed into a Merkle tree in real-time. The algorithm verifies every constraint at every step — and the verification is visible on a public dashboard. (3) AFTER: Any club can independently verify that their group placement was determined by the published constraints + genuine randomness. No hidden variables.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'After consultation, Apple TV has agreed to the publication of commercial constraints in anonymised form — "TV Pairing Constraint: clubs ranked #1 and #3 by commercial value must be in separate groups" without naming specific clubs. This preserves commercial confidentiality while enabling transparency. Dissent WITHDRAWN. The Draw Integrity Protocol satisfies FIFA Statutes Article 69 and creates a precedent for transparent draws in global sports.' },
    { agentId: 'integrity', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'All constraints now publicly declared. The NIST Randomness Beacon eliminates any possibility of pre-determination. Real-time Merkle sealing means every ball allocation is immutable. Post-draw verification is available to all 32 clubs within 60 seconds of the ceremony ending. Flag WITHDRAWN. This is the most transparent competition draw in the history of international sport.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:c1dfd96eea8cc2b62785275bca38ac261256e278',
    merkleRoot: 'e99a18c428cb38d5f260853678922e03',
    merkleLabel: 'Merkle Tree Root (Constraint set + NIST random seed + Group allocations + Verification logs)',
    complianceLabel: 'Draw Integrity',
    complianceValue: '32/32 CLUBS VERIFIED',
    complianceThreshold: 'all constraints satisfied',
    agents: ['Draw & Scheduling Agent', 'Integrity Agent', 'Legal Agent', 'Public Communications Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA Club World Cup 2025 — Provably Fair Draw',
    guaranteeBody: 'This cryptographic bundle seals the complete Club World Cup draw: all sporting, commercial, and logistical constraints (published 48h pre-draw), the NIST Randomness Beacon seed, every group allocation with real-time Merkle sealing, and the post-draw verification results. Any of the 32 clubs can independently verify their placement. No hidden variables, no pre-determination.',
    evidenceChain: 'Constraint publication (48h pre-draw) → NIST Randomness Beacon → Group allocation 1-32 → Real-time Merkle sealing → Constraint verification (all satisfied) → Club verification portal → Public dashboard → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will manage the Club World Cup draw — balancing sporting fairness, commercial rights, and venue logistics while proving the entire process is transparent and unbiased.',
  phaseLabels: ['Algorithm & Constraints', 'Commercial vs Integrity Tension', 'Transparent Draw Protocol'],
};

// =============================================================================
// SCENARIO 4 — $7.5B PRIZE MONEY ALLOCATION
// =============================================================================

const SCENARIO_PRIZE: ScenarioConfig = {
  id: 'prize-money',
  title: '$7.5B World Cup Revenue — Cryptographic Allocation',
  subtitle: '211 member associations · $7.5B total revenue · Statutory distribution · Zero-tolerance for misallocation',
  banner: 'Simulating the distribution of $7.5B in FIFA World Cup 2026 revenue across 211 member associations, proving every dollar was allocated exactly per the FIFA Statutes — with cryptographic proof that no association received preferential treatment.',
  risk: 'High',
  scenarioNum: 'Prize Money',
  icon: <DollarSign className="w-4 h-4" />,
  color: 'text-yellow-400',
  agents: [A.distribution, A.legalAgent, A.regulatoryAgent, A.publicComms],
  connectors: [
    { name: 'FIFA Revenue Engine', status: 'connected', type: 'World Cup Revenue Streams', icon: <DollarSign className="w-4 h-4" />, detail: '$7.5B: broadcast ($4.8B), commercial ($2.1B), ticketing ($600M)' },
    { name: 'FIFA Statutes Database', status: 'connected', type: 'Distribution Formulas', icon: <FileText className="w-4 h-4" />, detail: 'Articles 62-64: Revenue distribution rules' },
    { name: 'Member Association Portal', status: 'connected', type: 'Payment Verification', icon: <Globe className="w-4 h-4" />, detail: '211 association banking details verified' },
    { name: 'FIFA Forward Programme', status: 'syncing', type: 'Development Funding', icon: <Banknote className="w-4 h-4" />, detail: '$2.25B Forward 3.0 programme allocation' },
  ],
  script: [
    { agentId: 'distrib', phase: 'phase1', type: 'analysis', delay: 800, content: 'Revenue allocation engine initiated. Total World Cup 2026 revenue: $7,500,000,000. Distribution structure per FIFA Statutes: (1) Participating team prize money: $2,640M (35.2%) — 48 teams, performance-based. (2) Preparation funding: $480M — $10M per qualified team. (3) Club Benefits Programme: $355M — compensation to clubs releasing players. (4) FIFA Forward Programme: $2,250M — development funding to all 211 associations. (5) FIFA operational reserve: $1,775M. Each component has sub-formulas: Forward Programme splits into solidarity ($1.5B), development ($500M), and travel ($250M). Total calculation: 14,847 individual payment lines across 211 associations.' },
    { agentId: 'regulatory', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The FIFA Forward Programme has historically been the target of corruption allegations. In 2020, multiple FIFA officials were indicted for misappropriating Forward Programme funds. Current audit shows: (1) 17 associations have failed to submit required financial reports for the previous cycle, (2) 4 associations have been flagged by FIFA\'s Good Governance department for "concerning" expenditure patterns, (3) The FIFA Statutes require that Forward Programme funding be conditional on good governance compliance (Article 62.4). Releasing $2.25B without addressing these flags creates significant governance risk.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under the US DOJ\'s ongoing FIFA investigation (stemming from the 2015 indictments), FIFA is required to demonstrate "enhanced financial controls" over revenue distribution. If Forward Programme funds are released to associations with outstanding governance concerns, the DOJ may view this as evidence of insufficient reform. Additionally, the Swiss OAG has a standing investigation into FIFA finances. I am mandating that all 17 non-compliant associations receive conditional payment holds until their financial reports are submitted. The 4 flagged associations must undergo independent audit before any payment is released.' },
    { agentId: 'comms', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. If FIFA withholds Forward Programme payments from 17 associations, particularly from developing football nations in Africa and Asia, it will be framed as "rich nations punishing poor nations." The political fallout within the FIFA Congress could be severe — these 17 associations represent 17 votes. I am recommending a transparent conditional payment approach: publicly explain that payments are held pending routine compliance, provide a clear 30-day timeline for resolution, and offer FIFA technical assistance to help associations submit their reports.' },
    { agentId: 'distrib', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Provable Allocation Protocol for World Cup revenue: (1) Every association receives a personalised "Revenue Receipt" showing the exact calculation chain from total revenue to their specific payment — completely transparent. (2) All 14,847 payment lines are sealed in a Merkle tree — any association can verify their payment AND every other association\'s payment. (3) The 17 non-compliant associations receive conditional receipts showing their full entitlement with a clear compliance pathway. (4) The 4 flagged associations\' holds are documented with specific governance concerns — transparent, not punitive. (5) The complete allocation is published on FIFA.com for public verification.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Provable Allocation Protocol satisfies DOJ "enhanced financial controls" requirement and Swiss OAG transparency standards. The conditional holds are documented with clear criteria and timelines — this is defensible governance, not political punishment. The Merkle tree means any allegation of favouritism can be instantly disproven with mathematical evidence. Dissent WITHDRAWN. This transforms FIFA\'s revenue distribution from its historically most corrupt process into its most transparent one.' },
    { agentId: 'comms', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Provable Allocation Protocol provides the messaging framework: "For the first time in history, every FIFA member association can verify exactly how World Cup revenue was distributed. No favouritism. No hidden payments. Mathematical proof." The conditional holds for 17 associations are framed positively as "FIFA investing in governance support." Warning WITHDRAWN. Press release drafted for FIFA.com publication.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:1b16b1df538ba12dc3f97edbb85caa7050d46c148134290feba80f8236c83db9',
    merkleRoot: '9f14025af0065b30e47e23eba82c1621',
    merkleLabel: 'Merkle Tree Root (14,847 payment lines + Statutes formulas + Compliance status + Governance flags)',
    complianceLabel: 'Revenue Distributed',
    complianceValue: '211/211 ASSOCIATIONS',
    complianceThreshold: '$7.5B allocated (17 conditional)',
    agents: ['Revenue Distribution Agent', 'Legal Agent', 'Regulatory Agent', 'Public Communications Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA Statutes Articles 62-64 — Provably Fair World Cup Revenue',
    guaranteeBody: 'This cryptographic bundle seals the complete $7.5B World Cup 2026 revenue allocation across 211 member associations. All 14,847 payment lines are independently verifiable. 17 conditional holds are documented with clear compliance pathways. 4 governance-flagged associations require independent audit before release. No association can claim preferential treatment — every calculation is mathematically transparent.',
    evidenceChain: 'World Cup revenue ($7.5B) → Statutes formula application → 14,847 payment lines → Governance flag review (17 + 4) → Conditional hold documentation → Association payment receipts → Public verification portal → Merkle tree seal → ML-DSA-65 signature',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will distribute $7.5B in World Cup revenue across 211 member associations — proving every dollar was allocated fairly while addressing corruption risks from FIFA\'s past.',
  phaseLabels: ['Revenue Calculation', 'Governance & Compliance Review', 'Provable Allocation Sealing'],
};

// =============================================================================
// SCENARIO 5 — ANTI-DOPING EVIDENCE CHAIN
// =============================================================================

const SCENARIO_DOPING: ScenarioConfig = {
  id: 'anti-doping',
  title: 'Anti-Doping Evidence Chain — WADA Compliance',
  subtitle: 'World Cup player · Adverse analytical finding · CAS-ready chain of custody · WADA Code 2021',
  banner: 'Simulating an adverse analytical finding (positive drug test) for a World Cup player during the tournament. The evidence chain must be CAS-ready from sample collection to hearing — any break in the chain means the player walks free.',
  risk: 'Critical',
  scenarioNum: 'Anti-Doping',
  icon: <Shield className="w-4 h-4" />,
  color: 'text-red-400',
  agents: [A.antiDoping, A.legalAgent, A.integrityAgent, A.matchOfficial],
  connectors: [
    { name: 'FIFA Anti-Doping System', status: 'connected', type: 'Sample Collection & Tracking', icon: <Shield className="w-4 h-4" />, detail: 'Sample #WC26-4847: collected post-match Day 7' },
    { name: 'WADA ADAMS Database', status: 'connected', type: 'Anti-Doping Administration', icon: <Database className="w-4 h-4" />, detail: 'Athlete whereabouts + TUE history loaded' },
    { name: 'UCLA Olympic Lab', status: 'connected', type: 'WADA-Accredited Laboratory', icon: <Eye className="w-4 h-4" />, detail: 'A-sample analysis: Adverse Analytical Finding' },
    { name: 'CAS Precedent Engine', status: 'syncing', type: 'Doping Case Arbitration History', icon: <Scale className="w-4 h-4" />, detail: '1,847 CAS anti-doping decisions indexed' },
  ],
  script: [
    { agentId: 'doping', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL ALERT. Sample #WC26-4847, collected from Player X (Team Y) after the Group Stage Match on Day 7, has returned an Adverse Analytical Finding (AAF) from the UCLA Olympic Analytical Laboratory. Substance detected: recombinant erythropoietin (rEPO) at a concentration 3.2x above the decision limit. Under the WADA Code 2021, Article 7.2, FIFA must: (1) provisionally suspend the player immediately, (2) notify the player and their national federation, (3) offer the B-sample analysis. Player X is scheduled to play in the Round of 16 in 48 hours. This finding eliminates a key player from the tournament if confirmed.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Chain of custody verification initiated. Sample #WC26-4847 tracking: (1) Collection: Day 7, 22:47 local time, Mixed Zone Collection Area, Stadium #4. Doping Control Officer (DCO) ID verified. Witness present. Player signed the custody form. (2) Transport: Sealed sample shipped via FIFA-approved courier, arriving at UCLA Lab 14 hours later. Temperature monitoring shows continuous 2-8°C compliance. (3) Lab receipt: Sample logged at 12:51 next day, seal intact, chain unbroken. All 7 custody transfer points have digital signatures from authorised personnel. Chain of custody: VERIFIED.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. I have reviewed 1,847 CAS anti-doping cases. The most common successful defence is challenging the chain of custody — specifically, gaps in temperature monitoring or unsigned transfer documents. In CAS 2019/A/6148, a CAS panel overturned an AAF because the courier temperature log showed a 47-minute gap during transit. While our chain appears complete, the current system relies on PAPER signatures at 3 of the 7 transfer points. Paper signatures can be challenged as "potentially fabricated after the fact." I am mandating that ALL future chain-of-custody documents use CendiaChronos cryptographic timestamps, not paper signatures.' },
    { agentId: 'match-official', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. If Player X is provisionally suspended, Team Y must be notified before their next training session (in 6 hours). Under FIFA World Cup Regulations, Article 55, a provisional suspension during the tournament triggers an emergency replacement process — Team Y may replace Player X from their standby list if the suspension is confirmed before the Round of 16. The 48-hour window is critical. Any delay in notification or B-sample analysis could force Team Y to play without a replacement, creating a competitive fairness issue that other teams will challenge.' },
    { agentId: 'doping', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Anti-Doping Evidence Protocol: (1) The complete chain of custody is retroactively verified and sealed in a Merkle tree — all 7 transfer points, temperature logs, and personnel signatures are cryptographically linked. (2) B-sample analysis is requested from the UCLA Lab with CendiaChronos timestamping on every step. (3) Notification to Player X and Team Y is cryptographically timestamped to prove compliance with the 24-hour WADA requirement. (4) The complete evidence bundle is pre-formatted for CAS — if the player appeals, the evidence is already "trial-ready." (5) All future World Cup doping controls will use digital chain-of-custody with CendiaChronos from Day 1.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Anti-Doping Evidence Protocol eliminates the chain-of-custody vulnerability. The Merkle tree links every custody event into an immutable sequence — challenging any single transfer point requires disproving the entire cryptographic chain, which is mathematically impossible. The CAS "temperature gap" defence (CAS 2019/A/6148) is neutralised because continuous temperature monitoring is embedded in the Merkle tree with no gaps possible. Dissent WITHDRAWN. This evidence bundle has a 97.3% probability of surviving a CAS challenge, up from 82.1% with paper-based chain of custody.' },
    { agentId: 'integrity', phase: 'phase3', type: 'resolution', delay: 2000, content: 'Chain of custody sealed. Notification timestamps verified. B-sample analysis scheduled with full CendiaChronos coverage. The evidence bundle is CAS-ready from sample collection through to hearing. If Player X appeals, FIFA can present an unbroken cryptographic evidence chain that no defence lawyer can break. Anti-doping integrity for the 2026 World Cup is mathematically guaranteed. Resolution CONFIRMED.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d',
    merkleRoot: '2e7d2c03a9507ae265ecf5b5356885a53393a2029d241394997265a1a25aefc6',
    merkleLabel: 'Merkle Tree Root (7 custody points + Temperature logs + Lab analysis + WADA notification)',
    complianceLabel: 'Chain of Custody',
    complianceValue: '7/7 VERIFIED',
    complianceThreshold: 'unbroken cryptographic chain',
    agents: ['Anti-Doping Agent', 'Legal Agent', 'Integrity Agent', 'Match Official Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'WADA Code 2021 — CAS-Ready Anti-Doping Evidence',
    guaranteeBody: 'This cryptographic bundle seals the complete anti-doping evidence chain for Sample #WC26-4847: collection, transport (continuous temperature monitoring), laboratory analysis, and player notification. All 7 chain-of-custody transfer points are cryptographically linked in an immutable Merkle tree. CAS challenge survival probability: 97.3%. The evidence chain is mathematically unbreakable.',
    evidenceChain: 'Sample collection (DCO verified) → Sealed transport (2-8°C continuous) → 7 custody transfers → UCLA Lab receipt → A-sample analysis → AAF confirmation → Player notification → B-sample request → CAS-ready bundle → ML-DSA-65 seal',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will process a World Cup anti-doping case — building an unbreakable chain of custody that survives CAS appeal with 97.3% probability.',
  phaseLabels: ['Adverse Finding & Chain Audit', 'Legal & Operational Escalation', 'CAS-Ready Evidence Sealing'],
};

// =============================================================================
// ALL SCENARIOS
// =============================================================================

const SCENARIOS: ScenarioConfig[] = [SCENARIO_VAR, SCENARIO_WHISTLE, SCENARIO_DRAW, SCENARIO_PRIZE, SCENARIO_DOPING];

// =============================================================================
// EXPORT — PAGE WITH ACCESS GATE
// =============================================================================

const FifaSandboxPage: React.FC = () => {
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('fifa-sandbox-unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem('fifa-sandbox-unlocked', 'true');
    setUnlocked(true);
  };

  if (!unlocked) {
    return (
      <AccessGate
        onUnlock={handleUnlock}
        accessKey="FIFA-WC-26"
        orgName="FIFA"
        accentColor="text-indigo-400"
        accentHover="from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600"
        ringColor="focus:ring-indigo-500/30"
        borderColor="border-indigo-500/30"
        gradientFrom="from-indigo-600/20"
        gradientTo="to-indigo-900/20"
        sessionKey="fifa-sandbox-unlocked"
      />
    );
  }

  return (
    <SandboxShell
      scenarios={SCENARIOS}
      orgLabel="FIFA"
      accent="indigo"
      footerNote="200+ regulatory scenarios mapped for FIFA · World Cup 2026 integrity architecture available on request"
    />
  );
};

export default FifaSandboxPage;
