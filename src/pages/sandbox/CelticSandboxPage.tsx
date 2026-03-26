/**
 * Page — Celtic FC Sandbox Demo
 *
 * Bespoke sandbox for Celtic FC design partner outreach.
 * 5 fully scripted multi-agent deliberation scenarios.
 *
 * Access: /sandbox/celtic (Key: CELTIC-PLC-26)
 *
 * @exports CelticSandboxPage
 * @module pages/sandbox/CelticSandboxPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Shield, Lock, ChevronRight, AlertTriangle, CheckCircle, XCircle,
  Radio, Activity, FileText, Download, Clock, Users, Zap,
  ArrowRight, Hash, Database, Globe, Heart, Scale, Banknote,
  ShieldCheck, Fingerprint, Link2, Play, RotateCcw, Eye,
  UtensilsCrossed, MessageSquare,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type Phase = 'idle' | 'phase1' | 'phase2' | 'phase3' | 'complete';
type MsgType = 'analysis' | 'flag' | 'warning' | 'dissent' | 'proposal' | 'resolution' | 'withdrawal';

interface AgentMessage {
  agentId: string;
  phase: Phase;
  type: MsgType;
  content: string;
  delay: number;
}

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

interface Connector {
  name: string;
  status: 'connected' | 'syncing' | 'ready';
  type: string;
  icon: React.ReactNode;
  detail: string;
}

interface ReceiptData {
  hash: string;
  merkleRoot: string;
  merkleLabel: string;
  timestamp: string;
  complianceLabel: string;
  complianceValue: string;
  complianceThreshold: string;
  agents: string[];
  dissents: number;
  dissentResolved: boolean;
  guaranteeTitle: string;
  guaranteeBody: string;
  evidenceChain: string;
}

interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  banner: string;
  risk: string;
  scenarioNum: string;
  icon: React.ReactNode;
  color: string;
  agents: Agent[];
  connectors: Connector[];
  script: AgentMessage[];
  receiptTemplate: Omit<ReceiptData, 'timestamp'>;
  idleTitle: string;
  idleDesc: string;
  phaseLabels: [string, string, string];
}

// =============================================================================
// SHARED AGENT DEFINITIONS
// =============================================================================

const A = {
  dof: { id: 'dof', name: 'Director of Football', role: 'Squad Strength & AI Scouting', icon: '\u{1F575}\u{FE0F}', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' } as Agent,
  medical: { id: 'medical', name: 'Chief Medical Officer', role: 'Player Safety & Insurance Liability', icon: '\u{1F468}\u{200D}\u{2695}\u{FE0F}', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' } as Agent,
  legal: { id: 'legal', name: 'Legal Counsel', role: 'EU AI Act & Scottish FA Compliance', icon: '\u{2696}\u{FE0F}', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' } as Agent,
  fsr: { id: 'fsr', name: 'UEFA FSR Auditor', role: 'Financial Sustainability Regulations', icon: '\u{1F4B6}', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' } as Agent,
  cfo: { id: 'cfo', name: 'Chief Financial Officer', role: 'Financial Planning & Reporting', icon: '\u{1F4CA}', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' } as Agent,
  hr: { id: 'hr', name: 'HR Director', role: 'People & Workforce Governance', icon: '\u{1F465}', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' } as Agent,
  perf: { id: 'perf', name: 'Head of Performance', role: 'Sports Science & Rehabilitation', icon: '\u{1F3CB}\u{FE0F}', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' } as Agent,
  insurance: { id: 'insurance', name: 'Insurance Underwriter', role: 'Player Insurance & Liability', icon: '\u{1F6E1}\u{FE0F}', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' } as Agent,
  catering: { id: 'catering', name: 'Catering Director', role: 'Matchday Hospitality & Food Service', icon: '\u{1F373}', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' } as Agent,
  foodsafety: { id: 'foodsafety', name: 'Food Safety Officer', role: 'HACCP & Allergen Compliance', icon: '\u{1F9EA}', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' } as Agent,
  ops: { id: 'ops', name: 'Operations Manager', role: 'Stadium Operations & Matchday', icon: '\u{1F3DF}\u{FE0F}', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' } as Agent,
  compliance: { id: 'compliance', name: 'Compliance Officer', role: 'Corporate Governance & Ethics', icon: '\u{1F4CB}', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' } as Agent,
  dpo: { id: 'dpo', name: 'Data Protection Officer', role: 'GDPR & Data Privacy', icon: '\u{1F512}', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' } as Agent,
};

// =============================================================================
// SCENARIO 1 — ARAUJO TRANSFER
// =============================================================================

const SCENARIO_ARAUJO: ScenarioConfig = {
  id: 'araujo',
  title: 'The Juli\u00e1n Araujo Acquisition & FSR Audit',
  subtitle: 'Right Back \u00b7 24 years old \u00b7 \u00a314M transfer fee \u00b7 \u00a345,000/week wages \u00b7 4-year contract',
  banner: 'Transfer fee intentionally inflated to \u00a314M (Market Value: \u00a38.5M) to trigger UEFA FSR Article 73 stress-test. All data is simulated for demonstration purposes.',
  risk: 'Critical',
  scenarioNum: 'Transfer Audit',
  icon: <Activity className="w-4 h-4" />,
  color: 'text-cyan-400',
  agents: [A.dof, A.medical, A.legal, A.fsr],
  connectors: [
    { name: 'Hudl / Wyscout Analytics', status: 'connected', type: 'Player Performance Data', icon: <Activity className="w-4 h-4" />, detail: 'Araujo: 92nd %ile progressive carries' },
    { name: 'FIFA TMS Portal', status: 'connected', type: 'Transfer Matching System', icon: <Globe className="w-4 h-4" />, detail: 'Live connection \u2014 timestamp verification active' },
    { name: 'Celtic Finance Ledger', status: 'connected', type: 'FSR Squad Cost Ratio', icon: <Banknote className="w-4 h-4" />, detail: 'Current ratio: 68.1% (pre-acquisition)' },
    { name: 'Celtic Medical Database', status: 'syncing', type: 'MRI & Injury History', icon: <Heart className="w-4 h-4" />, detail: 'Grade 2 MCL tear (2022) \u2014 fully rehabilitated' },
  ],
  script: [
    { agentId: 'dof', phase: 'phase1', type: 'analysis', delay: 800, content: 'Wyscout AI confirms Juli\u00e1n Araujo ranks in the 92nd percentile for progressive carries among fullbacks in Europe\'s top 15 leagues. His crossing accuracy (34.2%) and sprint speed (34.8 km/h) are essential for our Champions League group stage tactics. He is 24 years old with 4+ prime seasons remaining. Recommends \u00a314M bid.' },
    { agentId: 'medical', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. Historic Grade 2 MCL tear detected in medical records (2022). While fully rehabilitated, the Scottish Premiership features 4 clubs with artificial pitches (Kilmarnock, Livingston, Ross County, Hamilton). Artificial surfaces increase MCL re-injury risk by 23% according to FIFA Medical Assessment. Insurance premium impact: +\u00a3340K/year. Recommending appearance-based contract structure to mitigate club liability.' },
    { agentId: 'fsr', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. \u00a314M fee amortised over a 4-year contract (\u00a33.5M/year) plus \u00a345,000/week guaranteed wages (\u00a32.34M/year) pushes Celtic\'s Squad Cost Ratio to 71.4%. This breaches the UEFA Financial Sustainability Regulations Article 73 threshold of 70%. Transfer BLOCKED pending restructure. Celtic\'s current ratio stands at 68.1% before this acquisition.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 3000, content: 'DISSENT LOGGED. Araujo\'s previous transfer to FC Barcelona (2023) was delayed by a FIFA TMS timestamp error of 18 seconds, resulting in a blocked transfer and a CAS appeal. This is a known compliance risk. I am mandating ML-DSA-65 post-quantum timestamping on ALL transfer documents. Additionally, the AI scouting recommendation must be audited under the EU AI Act (High-Risk System, Annex III) before acting on the \u00a314M valuation.' },
    { agentId: 'dof', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing restructured contract: \u00a310M guaranteed transfer fee + \u00a34M in Champions League appearance add-ons (triggered at 6+ CL group stage appearances). Base wage drops to \u00a335,000/week with \u00a310,000/week appearance bonus. This mitigates both the medical risk (appearance-linked) and the FSR exposure (variable cost excluded from guaranteed ratio).' },
    { agentId: 'fsr', phase: 'phase3', type: 'resolution', delay: 2500, content: 'RECALCULATING... Revised structure: \u00a310M amortised over 4 years (\u00a32.5M/year) + \u00a335K/week guaranteed wages (\u00a31.82M/year). New guaranteed Squad Cost Ratio: 69.2%. UEFA FSR Article 73 SATISFIED. Variable add-ons excluded per UEFA Regulation 2.7.3. Transfer APPROVED.' },
    { agentId: 'medical', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Risk mitigated via appearance-linked clauses. If Araujo suffers MCL recurrence, Celtic\'s guaranteed financial exposure is reduced by \u00a3780K/year. Insurance premium impact now +\u00a3180K/year (down from \u00a3340K). Medical dissent WITHDRAWN.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'ML-DSA-65 post-quantum timestamping activated on all transfer documents. CendiaChronos sequence initiated. EU AI Act audit trail generated for the Wyscout scouting model. Dissent WITHDRAWN. Transfer documents ready for execution.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    merkleRoot: 'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9',
    merkleLabel: 'Merkle Tree Root (MRI data + Financial data + UEFA FSR rulebook)',
    complianceLabel: 'FSR Squad Cost Ratio',
    complianceValue: '69.2%',
    complianceThreshold: 'threshold: 70%',
    agents: ['Director of Football', 'Chief Medical Officer', 'Legal Counsel', 'UEFA FSR Auditor'],
    dissents: 2,
    dissentResolved: true,
    guaranteeTitle: 'Court of Arbitration for Sport \u2014 Evidence Bundle Ready',
    guaranteeBody: 'This cryptographic bundle satisfies all evidentiary requirements for the Court of Arbitration for Sport. Celtic plc is indemnified. Cryptographic proof of transfer submission is time-stamped via RFC 3161. Mathematical guarantee of compliance preventing FIFA TMS deadline disputes. UEFA FSR Squad Cost Ratio verified at 69.2%.',
    evidenceChain: 'Wyscout scouting model \u2192 Celtic Medical DB (MRI) \u2192 FIFA TMS portal \u2192 Celtic Finance Ledger \u2192 UEFA FSR Article 73 \u2192 ML-DSA-65 timestamp',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will analyse the Juli\u00e1n Araujo \u00a314M transfer in real-time. Watch them debate, flag regulatory conflicts, and negotiate a compliant deal structure.',
  phaseLabels: ['Initial Assessment', 'Regulatory Conflict', 'Resolution & Structuring'],
};

// =============================================================================
// SCENARIO 2 — WAGE STRUCTURE
// =============================================================================

const SCENARIO_WAGES: ScenarioConfig = {
  id: 'wage-structure',
  title: 'UEFA FSR Wage Structure Monitoring',
  subtitle: 'Weekly wage bill review \u00b7 Squad Cost Ratio tracking \u00b7 Automated breach detection',
  banner: 'Simulating a scenario where January signing bonuses push Celtic within 0.3% of the UEFA FSR 70% threshold, triggering automated governance intervention.',
  risk: 'Critical',
  scenarioNum: 'Scenario 32',
  icon: <Banknote className="w-4 h-4" />,
  color: 'text-purple-400',
  agents: [A.cfo, A.fsr, A.hr, A.legal],
  connectors: [
    { name: 'Celtic Payroll System', status: 'connected', type: 'Weekly Wage Data', icon: <Banknote className="w-4 h-4" />, detail: 'Week 23: \u00a3892K total wage bill' },
    { name: 'UEFA FSR Portal', status: 'connected', type: 'Regulatory Threshold', icon: <Globe className="w-4 h-4" />, detail: 'Squad Cost Ratio limit: 70%' },
    { name: 'Celtic Revenue Forecast', status: 'connected', type: 'Revenue Projections', icon: <Activity className="w-4 h-4" />, detail: 'FY2026 projected: \u00a376.2M' },
    { name: 'HMRC RTI Feed', status: 'syncing', type: 'Tax & NI Reporting', icon: <Database className="w-4 h-4" />, detail: 'Real-time PAYE reconciliation' },
  ],
  script: [
    { agentId: 'cfo', phase: 'phase1', type: 'analysis', delay: 800, content: 'Weekly payroll digest processed. Current guaranteed wage bill: \u00a346.3M/year. With January transfer window signing bonuses of \u00a31.8M now amortised, the annualised guaranteed cost rises to \u00a348.1M. Against projected revenue of \u00a376.2M, this gives a Squad Cost Ratio of 69.7%.' },
    { agentId: 'fsr', phase: 'phase1', type: 'warning', delay: 2000, content: 'WARNING. Squad Cost Ratio at 69.7% \u2014 only 0.3% headroom below the UEFA FSR Article 73 threshold of 70%. Any additional guaranteed wage commitment will trigger a breach. I am recommending an immediate wage freeze on all new guaranteed contracts until the ratio drops below 68%.' },
    { agentId: 'hr', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Three first-team players are in active contract renewal negotiations with guaranteed wage increases totalling \u00a312,000/week. If signed at current terms, this adds \u00a3624K/year, pushing the ratio to 70.5%. Additionally, performance bonuses from Champions League qualification (\u00a32.1M pool) would convert to guaranteed payments on qualification.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. The three renewal offers were verbally communicated to players\' agents before this FSR alert. Withdrawing offers creates legal risk under Scottish employment law and potential constructive dismissal claims. We cannot simply freeze renewals without renegotiating terms. Recommending restructure to performance-linked contracts.' },
    { agentId: 'cfo', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing restructured renewal terms: reduce guaranteed base by 15% across all three renewals, add equivalent value as Champions League qualification bonuses (variable cost, excluded from FSR guaranteed ratio). Net guaranteed increase drops from \u00a3624K to \u00a3312K/year. New projected ratio: 69.9%.' },
    { agentId: 'fsr', phase: 'phase3', type: 'resolution', delay: 2500, content: 'RECALCULATING... With restructured renewals, guaranteed Squad Cost Ratio: 69.9%. Within threshold but critically tight. I am mandating weekly automated ratio monitoring with a hard alert at 69.5% and automatic escalation to CEO at 69.8%. UEFA FSR Article 73 SATISFIED for current period.' },
    { agentId: 'legal', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Restructured terms preserve player value while meeting legal obligations. Performance-linked bonuses align player incentives with club financial health. Dissent WITHDRAWN. Recommending all three renewal contracts include CendiaChronos timestamped FSR compliance certificates.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a7ffc6f8bf1ed76651c14756a061d662f580ff4de43b49fa82d80a4b80f8434a',
    merkleRoot: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    merkleLabel: 'Merkle Tree Root (Payroll data + FSR calculation + Revenue forecast + Renewal terms)',
    complianceLabel: 'FSR Squad Cost Ratio',
    complianceValue: '69.9%',
    complianceThreshold: 'threshold: 70%',
    agents: ['Chief Financial Officer', 'UEFA FSR Auditor', 'HR Director', 'Legal Counsel'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'UEFA Financial Sustainability \u2014 Weekly Compliance Certified',
    guaranteeBody: 'Celtic plc\'s Squad Cost Ratio has been verified at 69.9% against the UEFA FSR Article 73 threshold of 70%. All payroll data, renewal terms, and revenue projections are cryptographically sealed. Weekly automated monitoring has been activated with hard alerts at 69.5%.',
    evidenceChain: 'Celtic Payroll System \u2192 Revenue Forecast \u2192 UEFA FSR calculation \u2192 Renewal terms \u2192 CFO sign-off \u2192 Weekly monitoring schedule',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will analyse Celtic\'s weekly wage structure against UEFA FSR thresholds in real-time. Watch them detect a near-breach and negotiate compliant renewal terms.',
  phaseLabels: ['Ratio Detection', 'Contract Conflict', 'Restructure & Monitoring'],
};

// =============================================================================
// SCENARIO 3 — INJURY MANAGEMENT
// =============================================================================

const SCENARIO_INJURY: ScenarioConfig = {
  id: 'injury-mgmt',
  title: 'Injury Management AI \u2014 Return-to-Play Decision',
  subtitle: 'Key player \u00b7 Hamstring grade 2 \u00b7 Champions League quarter-final in 72 hours',
  banner: 'Simulating a high-stakes return-to-play decision where AI rehabilitation tracking recommends clearance, but the medical team must balance competitive pressure against player welfare and legal liability.',
  risk: 'High',
  scenarioNum: 'Scenario 55',
  icon: <Heart className="w-4 h-4" />,
  color: 'text-red-400',
  agents: [A.medical, A.perf, A.legal, A.insurance],
  connectors: [
    { name: 'Celtic Medical Database', status: 'connected', type: 'Clinical Records', icon: <Heart className="w-4 h-4" />, detail: 'Hamstring grade 2 tear \u2014 Day 18 of 21-day protocol' },
    { name: 'GPS & Load Monitoring', status: 'connected', type: 'Catapult / STATSports', icon: <Activity className="w-4 h-4" />, detail: 'Training load: 87% of pre-injury baseline' },
    { name: 'MRI Imaging System', status: 'syncing', type: 'Diagnostic Imaging', icon: <Eye className="w-4 h-4" />, detail: 'Latest scan: Day 17 \u2014 tissue healing at 94%' },
    { name: 'Insurance Portal', status: 'connected', type: 'Player Insurance Policy', icon: <Shield className="w-4 h-4" />, detail: 'Policy #CFC-2026-0847 \u2014 \u00a34.2M coverage' },
  ],
  script: [
    { agentId: 'perf', phase: 'phase1', type: 'analysis', delay: 800, content: 'AI rehabilitation model indicates player has reached 87% of pre-injury GPS load metrics. Sprint threshold testing shows 91% recovery. The model recommends CLEARANCE for full team training, with a 78% confidence score for match fitness within 72 hours. Historical data across 240 similar injuries shows a 6.2% re-injury rate at this recovery stage.' },
    { agentId: 'medical', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. While the AI model shows positive recovery metrics, the latest MRI (Day 17) shows residual oedema at the musculotendinous junction. Clinical assessment indicates tissue healing at 94% but not 100%. The 6.2% re-injury rate cited by the model rises to 11.8% on artificial pitches and under high-intensity match conditions. I cannot endorse clearance based solely on AI metrics without independent physician confirmation.' },
    { agentId: 'insurance', phase: 'phase2', type: 'warning', delay: 2000, content: 'WARNING. Player insurance policy #CFC-2026-0847 contains a clause requiring independent medical clearance before return to competitive play following grade 2+ muscular injuries. If the player is returned without independent sign-off and suffers re-injury, the \u00a34.2M insurance coverage is VOIDED. Celtic would bear full liability for wages, treatment costs, and potential loss-of-value claims.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT LOGGED. Under the GMC\'s Good Medical Practice guidelines, an AI recommendation cannot substitute for clinical judgement. Furthermore, GDPR Article 9 requires explicit consent for processing health data through automated decision-making. The player has not consented to AI-only clearance. An independent sports medicine consultant must examine the player before any return-to-play decision. This is non-negotiable under Scottish law.' },
    { agentId: 'medical', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing staged return protocol: (1) Independent consultant examination within 24 hours, (2) If cleared, controlled training session at 90%+ load with real-time GPS monitoring, (3) Final fitness test 6 hours before match with CMO sign-off required. AI model provides supporting data only \u2014 not the decision.' },
    { agentId: 'insurance', phase: 'phase3', type: 'resolution', delay: 2000, content: 'Staged return protocol satisfies insurance policy requirements. Independent consultant examination preserves \u00a34.2M coverage. I am issuing a conditional clearance certificate \u2014 contingent on all three protocol stages being completed and cryptographically sealed in the evidence chain.' },
    { agentId: 'legal', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Staged protocol compliant with GMC guidelines, GDPR Article 9, and FIFA Medical Regulations. Player consent form for AI-assisted monitoring has been generated. All medical data will be sealed with CendiaChronos timestamps. Dissent WITHDRAWN. Evidence bundle will protect Celtic from liability regardless of outcome.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    merkleRoot: 'd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    merkleLabel: 'Merkle Tree Root (MRI imaging + GPS load data + Insurance policy + Consent form)',
    complianceLabel: 'Medical Protocol',
    complianceValue: 'Stage 1 of 3',
    complianceThreshold: 'independent clearance required',
    agents: ['Chief Medical Officer', 'Head of Performance', 'Legal Counsel', 'Insurance Underwriter'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'FIFA Medical Regulations \u2014 Return-to-Play Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals the complete return-to-play evidence chain including AI rehabilitation metrics, MRI imaging, GPS load data, and the staged return protocol. Celtic plc\'s medical decision-making process is documented to GMC, GDPR Article 9, and FIFA Medical Regulation standards.',
    evidenceChain: 'Catapult GPS data \u2192 MRI Day 17 scan \u2192 AI rehabilitation model \u2192 CMO clinical assessment \u2192 Insurance policy verification \u2192 Player consent form \u2192 Staged protocol',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will assess a high-stakes return-to-play decision for a key player 72 hours before a Champions League quarter-final.',
  phaseLabels: ['Clinical Assessment', 'Insurance & Legal Conflict', 'Staged Return Protocol'],
};

// =============================================================================
// SCENARIO 4 — CATERING / NATASHA'S LAW
// =============================================================================

const SCENARIO_CATERING: ScenarioConfig = {
  id: 'catering',
  title: 'Stadium Catering AI \u2014 Allergen Incident Prevention',
  subtitle: 'Celtic Park \u00b7 60,000 capacity \u00b7 Matchday hospitality \u00b7 Natasha\'s Law compliance',
  banner: 'Simulating a matchday allergen management scenario where the AI system detects a cross-contamination risk in VIP hospitality catering 4 hours before kick-off.',
  risk: 'High',
  scenarioNum: 'Scenario 75',
  icon: <UtensilsCrossed className="w-4 h-4" />,
  color: 'text-amber-400',
  agents: [A.catering, A.foodsafety, A.legal, A.ops],
  connectors: [
    { name: 'Celtic Catering System', status: 'connected', type: 'Menu & Ingredient DB', icon: <UtensilsCrossed className="w-4 h-4" />, detail: 'Matchday menu: 14 items across 6 zones' },
    { name: 'Supplier Allergen Feeds', status: 'connected', type: 'Ingredient Declarations', icon: <FileText className="w-4 h-4" />, detail: 'Real-time allergen data from 8 suppliers' },
    { name: 'HACCP Monitoring', status: 'syncing', type: 'Temperature & Hygiene', icon: <Activity className="w-4 h-4" />, detail: 'All 23 checkpoints reporting' },
    { name: 'Celtic Ticketing System', status: 'connected', type: 'Dietary Preferences', icon: <Users className="w-4 h-4" />, detail: '847 VIP guests with declared allergens' },
  ],
  script: [
    { agentId: 'foodsafety', phase: 'phase1', type: 'warning', delay: 800, content: 'CRITICAL ALERT. AI allergen scanner has detected a cross-contamination risk in VIP Hospitality Zone 3. Supplier batch #2026-0417 of the "Scottish Salmon Terrine" contains traces of tree nuts (hazelnut) not declared on the original ingredient specification. The supplier updated their production line 48 hours ago but the allergen data feed was delayed. 23 VIP guests in Zone 3 have declared nut allergies.' },
    { agentId: 'catering', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. The salmon terrine was prepared 6 hours ago and is currently in cold storage for Zone 3 service. We have 4 hours until VIP hospitality opens. Alternative menu item (Smoked Trout Mousse) is available from backup stock and is certified nut-free. However, substituting requires re-labelling all 380 place settings in Zone 3 under Natasha\'s Law requirements.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under the Food Information (Scotland) Regulations 2014 and Natasha\'s Law (Allergen Labelling), serving food with undeclared allergens is a criminal offence carrying unlimited fines and potential custodial sentences. The Catering Director and Celtic plc\'s board bear personal criminal liability. This is not a risk to be managed \u2014 the contaminated item must be withdrawn immediately. No exceptions.' },
    { agentId: 'ops', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Withdrawing the salmon terrine and re-labelling 380 place settings requires 12 catering staff and approximately 2.5 hours. We have 4 hours until service. This is achievable but it eliminates our buffer for other matchday prep. I am requesting authorisation to redeploy staff from general concourse to Zone 3 hospitality.' },
    { agentId: 'catering', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Executing immediate menu substitution: (1) Salmon terrine withdrawn from Zone 3 and quarantined, (2) Smoked Trout Mousse deployed from backup stock (batch #2026-0422, certified nut-free), (3) All 380 place settings re-labelled with updated allergen declarations, (4) Supplier formally notified of allergen data delay \u2014 incident logged for HACCP review.' },
    { agentId: 'foodsafety', phase: 'phase3', type: 'resolution', delay: 2000, content: 'Menu substitution verified. Smoked Trout Mousse allergen profile cross-checked against all 23 declared nut allergies in Zone 3 \u2014 CLEAR. HACCP checkpoint temperatures verified. All 14 allergens under Natasha\'s Law accounted for in updated labelling. Food safety incident sealed with batch numbers, supplier data, and corrective action timestamps.' },
    { agentId: 'legal', phase: 'phase3', type: 'withdrawal', delay: 2000, content: 'Contaminated item withdrawn, allergen labelling updated, and full evidence chain sealed. Celtic plc\'s criminal liability exposure has been eliminated for this incident. Supplier has been formally notified and the delayed allergen feed is logged as a non-conformance. Dissent WITHDRAWN. Recommending a post-match review of all supplier allergen data agreements.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    merkleRoot: 'ca978112ca1bbdcafac231b39a23dc4da786eff8147c4e72b9807785afee48bb',
    merkleLabel: 'Merkle Tree Root (Ingredient batches + Allergen declarations + HACCP logs + Substitution records)',
    complianceLabel: 'Natasha\'s Law Status',
    complianceValue: 'COMPLIANT',
    complianceThreshold: '14/14 allergens declared',
    agents: ['Catering Director', 'Food Safety Officer', 'Legal Counsel', 'Operations Manager'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Food Safety Act 1990 \u2014 Criminal Liability Protection',
    guaranteeBody: 'This cryptographic bundle proves Celtic plc detected a cross-contamination risk, withdrew the affected item, and completed a compliant menu substitution with full allergen labelling under Natasha\'s Law. All batch numbers, supplier data, HACCP temperatures, and corrective action timestamps are immutably sealed.',
    evidenceChain: 'Supplier batch #2026-0417 \u2192 AI allergen scan \u2192 Cross-contamination detection \u2192 Item withdrawal \u2192 Substitute batch #2026-0422 \u2192 Re-labelling \u2192 HACCP verification \u2192 Legal sign-off',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will respond to a cross-contamination alert in VIP hospitality 4 hours before kick-off at Celtic Park.',
  phaseLabels: ['Allergen Detection', 'Legal & Operational Escalation', 'Menu Substitution & Sealing'],
};

// =============================================================================
// SCENARIO 5 — WHISTLEBLOWER
// =============================================================================

const SCENARIO_WHISTLE: ScenarioConfig = {
  id: 'whistleblower',
  title: 'Whistle-Blower Programme \u2014 Youth Academy Safeguarding',
  subtitle: 'Anonymous report \u00b7 Player welfare \u00b7 CendiaWhistle ring signatures',
  banner: 'Simulating an anonymous safeguarding report submitted through CendiaWhistle. The system must preserve mathematical anonymity while creating an evidence chain for potential OSCR or Police Scotland referral.',
  risk: 'Critical',
  scenarioNum: 'Scenario 88',
  icon: <MessageSquare className="w-4 h-4" />,
  color: 'text-cyan-400',
  agents: [A.compliance, A.legal, A.hr, A.dpo],
  connectors: [
    { name: 'CendiaWhistle Portal', status: 'connected', type: 'Anonymous Reporting', icon: <MessageSquare className="w-4 h-4" />, detail: 'Ring signature verified \u2014 reporter identity sealed' },
    { name: 'Celtic HR System', status: 'connected', type: 'Staff & Academy Records', icon: <Users className="w-4 h-4" />, detail: 'Youth academy: 87 registered players (U12-U18)' },
    { name: 'OSCR Reporting Portal', status: 'ready', type: 'Charity Regulator', icon: <Globe className="w-4 h-4" />, detail: 'Standing connection \u2014 ready for referral' },
    { name: 'Celtic DPO System', status: 'connected', type: 'GDPR Data Processing', icon: <Shield className="w-4 h-4" />, detail: 'Children\'s data \u2014 enhanced protection active' },
  ],
  script: [
    { agentId: 'compliance', phase: 'phase1', type: 'warning', delay: 800, content: 'PRIORITY ALERT. An anonymous report has been received via CendiaWhistle concerning a potential safeguarding issue in the Celtic FC Youth Academy. The report describes inappropriate behaviour by a coaching staff member towards U16 players. CendiaWhistle ring signatures confirm the reporter is authenticated as a Celtic FC employee but their identity is mathematically sealed \u2014 even Datacendia cannot decrypt it.' },
    { agentId: 'dpo', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. This report involves children\'s personal data under GDPR Article 8 (children\'s consent) and Article 9 (special category data). Enhanced data protection measures are mandatory. The report content must be restricted to the minimum number of people necessary. I am activating Data Protection Impact Assessment (DPIA) protocols and restricting access to the Compliance Officer, Legal Counsel, and designated Safeguarding Lead only.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under the Protection of Vulnerable Groups (Scotland) Act 2007 and the Children and Young People (Scotland) Act 2014, Celtic FC has a legal duty to refer this matter to the appropriate authorities within 24 hours if there is reasonable cause for concern. The anonymous report meets this threshold. I am mandating immediate referral to the PVG Scheme and notification to the SFA Safeguarding team. This cannot be handled internally first.' },
    { agentId: 'hr', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. While I agree the referral is mandatory, we must also protect the accused staff member\'s employment rights under the Employment Rights Act 1996 until the investigation concludes. I recommend immediate precautionary suspension (not disciplinary) with full pay, pending the external investigation. This protects both the children and the staff member\'s rights.' },
    { agentId: 'compliance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Executing mandatory protocol: (1) OSCR referral initiated within 2 hours (within 24-hour statutory requirement), (2) SFA Safeguarding team notified, (3) Police Scotland contacted for initial assessment, (4) Staff member placed on precautionary suspension, (5) CendiaWhistle evidence bundle sealed with ring signatures preserving reporter anonymity throughout.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Referral protocol satisfies Protection of Vulnerable Groups Act and OSCR reporting requirements. The CendiaWhistle ring signature mathematically guarantees reporter anonymity \u2014 even under court order, the reporter\'s identity cannot be extracted from the cryptographic proof. Evidence chain is admissible. Dissent WITHDRAWN.' },
    { agentId: 'dpo', phase: 'phase3', type: 'resolution', delay: 2000, content: 'DPIA completed. Data access restricted to 4 authorised individuals. All report data encrypted with AES-256 at rest. Access logging activated \u2014 every view of this report is cryptographically timestamped. Children\'s data protection requirements under GDPR satisfied. ICO notification prepared but not yet required (pending Police Scotland assessment).' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    merkleRoot: 'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35',
    merkleLabel: 'Merkle Tree Root (Ring signature + Report content + DPIA + Referral records)',
    complianceLabel: 'Safeguarding Protocol',
    complianceValue: 'REFERRAL INITIATED',
    complianceThreshold: 'within 24h statutory requirement',
    agents: ['Compliance Officer', 'Legal Counsel', 'HR Director', 'Data Protection Officer'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Protection of Vulnerable Groups Act \u2014 Statutory Compliance Verified',
    guaranteeBody: 'This cryptographic bundle proves Celtic plc received an anonymous safeguarding report, initiated statutory referrals within the required timeframe, and preserved reporter anonymity via CendiaWhistle ring signatures. The evidence chain is admissible in court while mathematically guaranteeing the reporter\'s identity cannot be revealed.',
    evidenceChain: 'CendiaWhistle ring signature \u2192 Anonymous report \u2192 DPIA assessment \u2192 OSCR referral \u2192 SFA notification \u2192 Police Scotland contact \u2192 Precautionary suspension \u2192 Access logging',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will process an anonymous safeguarding report, balancing whistleblower protection, children\'s data privacy, and mandatory statutory referrals.',
  phaseLabels: ['Report Triage', 'Legal & HR Escalation', 'Statutory Referral & Sealing'],
};

// =============================================================================
// ALL SCENARIOS
// =============================================================================

const SCENARIOS: ScenarioConfig[] = [SCENARIO_ARAUJO, SCENARIO_WAGES, SCENARIO_INJURY, SCENARIO_CATERING, SCENARIO_WHISTLE];

// =============================================================================
// HELPER — GENERATE RECEIPT FROM TEMPLATE
// =============================================================================

function generateReceipt(template: Omit<ReceiptData, 'timestamp'>): ReceiptData {
  return { ...template, timestamp: new Date().toISOString() };
}

// =============================================================================
// CONSTANTS — ACCESS
// =============================================================================

const SANDBOX_ACCESS_KEY = 'CELTIC-PLC-26';
const SANDBOX_PATH = '/sandbox/celtic';

// =============================================================================
// COMPONENT — ACCESS GATE
// =============================================================================

const AccessGate: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    setTimeout(() => {
      if (key.trim().toUpperCase() === SANDBOX_ACCESS_KEY) {
        onUnlock();
      } else {
        setError(true);
        setChecking(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Celtic crest placeholder + Datacendia */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600/20 to-emerald-900/20 border border-emerald-500/30 mb-6">
            <Shield className="w-10 h-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-light tracking-[0.3em] text-white/90 mb-2">DATACENDIA</h1>
          <p className="text-xs tracking-[0.2em] text-white/40 uppercase">Celtic FC &mdash; Executive Sandbox</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111118] border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-white/70">Enter your access key to continue</span>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={key}
            onChange={(e) => { setKey(e.target.value); setError(false); }}
            placeholder="ACCESS KEY"
            className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white text-center tracking-[0.2em] font-mono text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
              error ? 'border-red-500/60 focus:ring-red-500/30' : 'border-white/10 focus:ring-emerald-500/30 focus:border-emerald-500/40'
            }`}
          />

          {error && (
            <p className="text-red-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" /> Invalid access key
            </p>
          )}

          <button
            type="submit"
            disabled={checking || !key.trim()}
            className="w-full mt-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-lg font-medium text-sm tracking-wider hover:from-emerald-500 hover:to-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
          >
            {checking ? (
              <span className="animate-pulse">Verifying...</span>
            ) : (
              <>Enter Sandbox <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-white/20 mt-8 tracking-wider">
          CONFIDENTIAL &middot; FOR CELTIC FC EXECUTIVE REVIEW ONLY
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — CONNECTOR PANEL (dynamic)
// =============================================================================

const ConnectorPanel: React.FC<{ connectors: Connector[] }> = ({ connectors }) => (
  <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
    <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
      <Database className="w-3.5 h-3.5" /> Data Connectors
    </h3>
    <div className="space-y-3">
      {connectors.map((c) => (
        <div key={c.name} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className={`mt-0.5 ${c.status === 'connected' ? 'text-emerald-400' : c.status === 'syncing' ? 'text-amber-400' : 'text-blue-400'}`}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/80 truncate">{c.name}</span>
              <span className={`flex items-center gap-1 text-[10px] ${c.status === 'connected' ? 'text-emerald-400' : c.status === 'syncing' ? 'text-amber-400' : 'text-blue-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'connected' ? 'bg-emerald-400' : c.status === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
                {c.status === 'connected' ? 'LIVE' : c.status === 'syncing' ? 'SYNC' : 'READY'}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{c.type}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// COMPONENT — AGENT CARD
// =============================================================================

const AgentCard: React.FC<{ agent: Agent; active: boolean; speaking: boolean }> = ({ agent, active, speaking }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
    speaking ? `${agent.bgColor} ${agent.borderColor} shadow-lg` :
    active ? `bg-white/[0.03] ${agent.borderColor}` :
    'bg-white/[0.02] border-white/5 opacity-50'
  }`}>
    <div className="text-2xl">{agent.icon}</div>
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-semibold ${agent.color}`}>{agent.name}</p>
      <p className="text-[10px] text-white/40 truncate">{agent.role}</p>
    </div>
    {speaking && (
      <div className="flex gap-0.5">
        <span className="w-1 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-1 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    )}
    {!speaking && active && (
      <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" />
    )}
  </div>
);

// =============================================================================
// COMPONENT — MESSAGE BUBBLE (dynamic agents)
// =============================================================================

const MessageBubble: React.FC<{ msg: AgentMessage; agents: Agent[]; visible: boolean }> = ({ msg, agents, visible }) => {
  const agent = agents.find((a) => a.id === msg.agentId);
  if (!visible || !agent) return null;

  const typeStyles: Record<string, string> = {
    analysis: 'border-l-cyan-400', flag: 'border-l-red-400', warning: 'border-l-red-500',
    dissent: 'border-l-amber-400', proposal: 'border-l-emerald-400', resolution: 'border-l-emerald-500', withdrawal: 'border-l-emerald-300',
  };
  const typeBadges: Record<string, { label: string; color: string }> = {
    analysis: { label: 'ANALYSIS', color: 'text-cyan-400 bg-cyan-400/10' },
    flag: { label: 'FLAG RAISED', color: 'text-red-400 bg-red-400/10' },
    warning: { label: 'WARNING', color: 'text-red-500 bg-red-500/10' },
    dissent: { label: 'DISSENT LOGGED', color: 'text-amber-400 bg-amber-400/10' },
    proposal: { label: 'PROPOSAL', color: 'text-emerald-400 bg-emerald-400/10' },
    resolution: { label: 'RESOLVED', color: 'text-emerald-500 bg-emerald-500/10' },
    withdrawal: { label: 'DISSENT WITHDRAWN', color: 'text-emerald-300 bg-emerald-300/10' },
  };
  const badge = typeBadges[msg.type];

  return (
    <div className={`border-l-2 ${typeStyles[msg.type]} pl-4 py-3 animate-fadeIn`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{agent.icon}</span>
        <span className={`text-xs font-semibold ${agent.color}`}>{agent.name}</span>
        <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
      </div>
      <p className="text-sm text-white/80 leading-relaxed">{msg.content}</p>
    </div>
  );
};

// =============================================================================
// COMPONENT — TYPING INDICATOR (dynamic agents)
// =============================================================================

const TypingIndicator: React.FC<{ agentId: string; agents: Agent[] }> = ({ agentId, agents }) => {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return null;
  return (
    <div className="flex items-center gap-2 pl-4 py-2 animate-fadeIn">
      <span className="text-lg">{agent.icon}</span>
      <span className={`text-xs ${agent.color}`}>{agent.name}</span>
      <div className="flex gap-1 ml-1">
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — REGULATOR'S RECEIPT (generic)
// =============================================================================

const RegulatorsReceipt: React.FC<{ receipt: ReceiptData }> = ({ receipt }) => (
  <div className="bg-[#0d1117] border border-emerald-500/30 rounded-xl p-6 animate-fadeIn">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
        <Fingerprint className="w-5 h-5 text-emerald-400" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-emerald-400 tracking-wider">THE REGULATOR'S RECEIPT</h3>
        <p className="text-[10px] text-white/40">Cryptographically Sealed Decision Record</p>
      </div>
      <div className="ml-auto flex gap-2">
        <button className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 flex items-center gap-1.5">
          <Download className="w-3 h-3" /> PDF
        </button>
        <button className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 flex items-center gap-1.5">
          <FileText className="w-3 h-3" /> JSON
        </button>
      </div>
    </div>
    <div className="bg-black/40 border border-white/5 rounded-lg p-3 mb-3 font-mono">
      <p className="text-[10px] text-white/40 mb-1">Decision Hash</p>
      <p className="text-xs text-emerald-400 break-all">{receipt.hash}</p>
    </div>
    <div className="bg-black/40 border border-white/5 rounded-lg p-3 mb-3 font-mono">
      <p className="text-[10px] text-white/40 mb-1">{receipt.merkleLabel}</p>
      <p className="text-xs text-purple-400 break-all">{receipt.merkleRoot}</p>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <div className="bg-black/30 rounded-lg p-3">
        <p className="text-[10px] text-white/40 mb-1">Timestamp (RFC 3161)</p>
        <p className="text-xs text-white/80 font-mono">{receipt.timestamp}</p>
      </div>
      <div className="bg-black/30 rounded-lg p-3">
        <p className="text-[10px] text-white/40 mb-1">{receipt.complianceLabel}</p>
        <p className="text-xs text-emerald-400 font-bold">{receipt.complianceValue} <span className="text-emerald-400/60 font-normal">({receipt.complianceThreshold})</span></p>
      </div>
      <div className="bg-black/30 rounded-lg p-3">
        <p className="text-[10px] text-white/40 mb-1">Dissents Filed / Resolved</p>
        <p className="text-xs text-white/80">{receipt.dissents} filed &middot; <span className="text-emerald-400">All resolved</span></p>
      </div>
      <div className="bg-black/30 rounded-lg p-3">
        <p className="text-[10px] text-white/40 mb-1">Participating Agents</p>
        <p className="text-xs text-white/80">{receipt.agents.length} agents</p>
      </div>
    </div>
    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-400 mb-1">{receipt.guaranteeTitle}</p>
          <p className="text-xs text-white/60 leading-relaxed">{receipt.guaranteeBody}</p>
        </div>
      </div>
    </div>
    <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30">
      <Link2 className="w-3 h-3" />
      <span>Evidence chain: {receipt.evidenceChain}</span>
    </div>
  </div>
);

// =============================================================================
// COMPONENT — SCENARIO SELECTOR
// =============================================================================

const ScenarioSelector: React.FC<{ activeId: string; onSelect: (id: string) => void; disabled: boolean }> = ({ activeId, onSelect, disabled }) => (
  <div className="mb-6">
    <h3 className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase mb-3 flex items-center gap-2">
      <Zap className="w-3.5 h-3.5" /> Select Scenario
    </h3>
    <div className="flex flex-wrap gap-2">
      {SCENARIOS.map((s) => {
        const isActive = s.id === activeId;
        return (
          <button
            key={s.id}
            onClick={() => !disabled && onSelect(s.id)}
            disabled={disabled}
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 border ${
              isActive
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                : 'bg-white/[0.02] border-white/10 text-white/50 hover:border-white/20 hover:text-white/70'
            } ${disabled && !isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {s.icon}
            <span>{s.title.length > 30 ? s.title.slice(0, 30) + '...' : s.title}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${
              s.risk === 'Critical' ? 'bg-red-500/10 text-red-400' :
              s.risk === 'High' ? 'bg-amber-500/10 text-amber-400' :
              'bg-cyan-500/10 text-cyan-400'
            }`}>{s.scenarioNum}</span>
          </button>
        );
      })}
    </div>
  </div>
);

// =============================================================================
// MAIN PAGE COMPONENT
// =============================================================================

const CelticSandbox: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const copyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    return () => { timeoutsRef.current.forEach(clearTimeout); };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [visibleMessages, typingAgent]);

  const handleSelectScenario = (id: string) => {
    if (phase !== 'idle' && phase !== 'complete') return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveScenarioId(id);
    setPhase('idle');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
  };

  const runDeliberation = useCallback(() => {
    setPhase('phase1');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    let cumulativeDelay = 0;
    const phases: Phase[] = ['phase1', 'phase2', 'phase3'];
    let currentPhaseIdx = 0;

    scenario.script.forEach((msg, idx) => {
      const msgPhaseIdx = phases.indexOf(msg.phase);
      if (msgPhaseIdx > currentPhaseIdx) {
        cumulativeDelay += 1500;
        const t = setTimeout(() => setPhase(phases[msgPhaseIdx]), cumulativeDelay);
        timeoutsRef.current.push(t);
        currentPhaseIdx = msgPhaseIdx;
      }
      cumulativeDelay += msg.delay;
      timeoutsRef.current.push(setTimeout(() => setTypingAgent(msg.agentId), cumulativeDelay));
      cumulativeDelay += 1200;
      timeoutsRef.current.push(setTimeout(() => {
        setTypingAgent(null);
        setVisibleMessages(idx + 1);
      }, cumulativeDelay));
    });

    cumulativeDelay += 1000;
    timeoutsRef.current.push(setTimeout(() => setPhase('complete'), cumulativeDelay));
  }, [scenario]);

  const handleGenerateReceipt = () => {
    setGeneratingReceipt(true);
    setTimeout(() => {
      setReceipt(generateReceipt(scenario.receiptTemplate));
      setGeneratingReceipt(false);
    }, 2500);
  };

  const handleReset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPhase('idle');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
  };

  const activeAgentIds = scenario.script.slice(0, visibleMessages).map((m) => m.agentId);
  const isRunning = phase !== 'idle' && phase !== 'complete';

  const handleCopyLink = () => {
    const url = `${window.location.origin}${SANDBOX_PATH}?key=${SANDBOX_ACCESS_KEY}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Clipboard API unavailable — show a brief error label so the user knows what happened
      setCopyFailed(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopyFailed(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Top Bar */}
      <header className="border-b border-white/10 bg-[#0d0d14]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span className="text-sm font-light tracking-[0.25em] text-white/80">DATACENDIA</span>
            <span className="text-white/20">|</span>
            <span className="text-xs tracking-wider text-emerald-400/80">CELTIC FC SANDBOX</span>
          </div>
          <div className="flex items-center gap-3">
            {phase !== 'idle' && (
              <button onClick={handleReset} className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/50 hover:bg-white/10 flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
            <button
              onClick={handleCopyLink}
              title="Copy direct-access link"
              className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/50 hover:bg-white/10 flex items-center gap-1.5 transition-all"
            >
              {copied
                ? <><CheckCircle className="w-3 h-3 text-emerald-400" /> Copied!</>
                : copyFailed
                  ? <><XCircle className="w-3 h-3 text-red-400" /> Copy failed</>
                  : <><Link2 className="w-3 h-3" /> Copy link</>}
            </button>
            <span className="text-[10px] text-white/30 tracking-wider font-mono">v2.4.1</span>
          </div>
        </div>
      </header>

      {/* Simulation Banner */}
      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400/80">
            <strong>SIMULATION NOTE:</strong> {scenario.banner}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Scenario Selector */}
        <ScenarioSelector activeId={activeScenarioId} onSelect={handleSelectScenario} disabled={isRunning} />

        {/* Scenario Header */}
        <div className="mb-6">
          <h1 className="text-xl font-light tracking-wider text-white/90 mb-1">{scenario.title}</h1>
          <p className="text-sm text-white/40">{scenario.subtitle}</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Column — Connectors + Agents */}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <ConnectorPanel connectors={scenario.connectors} />
            <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
              <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Active Council
              </h3>
              <div className="space-y-2">
                {scenario.agents.map((agent) => (
                  <AgentCard
                    key={agent.id}
                    agent={agent}
                    active={phase !== 'idle' && (activeAgentIds.includes(agent.id) || typingAgent === agent.id)}
                    speaking={typingAgent === agent.id}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Center Column — Deliberation */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
              {/* Deliberation Header */}
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    Multi-Agent Deliberation
                  </h2>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {phase === 'idle' ? 'Ready to begin' :
                     phase === 'phase1' ? `Phase 1 \u2014 ${scenario.phaseLabels[0]}` :
                     phase === 'phase2' ? `Phase 2 \u2014 ${scenario.phaseLabels[1]}` :
                     phase === 'phase3' ? `Phase 3 \u2014 ${scenario.phaseLabels[2]}` :
                     'Deliberation Complete \u2014 Consensus Reached'}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['phase1', 'phase2', 'phase3', 'complete'] as Phase[]).map((p, i) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${
                        getPhaseOrder(phase) >= getPhaseOrder(p) ? 'bg-emerald-400' : 'bg-white/10'
                      }`} />
                      {i < 3 && <div className={`w-6 h-px transition-all duration-500 ${
                        getPhaseOrder(phase) > getPhaseOrder((['phase1', 'phase2', 'phase3', 'complete'] as Phase[])[i])
                          ? 'bg-emerald-400/40' : 'bg-white/10'
                      }`} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Deliberation Body */}
              <div ref={scrollRef} className="p-5 min-h-[400px] max-h-[600px] overflow-y-auto space-y-4">
                {phase === 'idle' ? (
                  <div className="flex flex-col items-center justify-center h-[380px] text-center">
                    <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6">
                      <Play className="w-8 h-8 text-emerald-400 ml-1" />
                    </div>
                    <h3 className="text-lg font-light text-white/80 mb-2">{scenario.idleTitle}</h3>
                    <p className="text-xs text-white/40 max-w-md mb-6">{scenario.idleDesc}</p>
                    <button
                      onClick={runDeliberation}
                      className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-medium text-sm tracking-wider hover:from-emerald-500 hover:to-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-900/30"
                    >
                      <Play className="w-4 h-4" /> Run Deliberation
                    </button>
                  </div>
                ) : (
                  <>
                    {renderPhaseMarker(`Phase 1 \u2014 ${scenario.phaseLabels[0]}`, 'phase1', phase)}
                    {scenario.script.filter((m) => m.phase === 'phase1').map((msg) => {
                      const gi = scenario.script.indexOf(msg);
                      return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages} />;
                    })}
                    {getPhaseOrder(phase) >= getPhaseOrder('phase2') && (
                      <>
                        {renderPhaseMarker(`Phase 2 \u2014 ${scenario.phaseLabels[1]}`, 'phase2', phase)}
                        {scenario.script.filter((m) => m.phase === 'phase2').map((msg) => {
                          const gi = scenario.script.indexOf(msg);
                          return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages} />;
                        })}
                      </>
                    )}
                    {getPhaseOrder(phase) >= getPhaseOrder('phase3') && (
                      <>
                        {renderPhaseMarker(`Phase 3 \u2014 ${scenario.phaseLabels[2]}`, 'phase3', phase)}
                        {scenario.script.filter((m) => m.phase === 'phase3').map((msg) => {
                          const gi = scenario.script.indexOf(msg);
                          return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages} />;
                        })}
                      </>
                    )}
                    {typingAgent && <TypingIndicator agentId={typingAgent} agents={scenario.agents} />}
                  </>
                )}
              </div>

              {/* Generate Receipt Button */}
              {phase === 'complete' && !receipt && (
                <div className="px-5 py-4 border-t border-white/10 bg-emerald-500/[0.03]">
                  <button
                    onClick={handleGenerateReceipt}
                    disabled={generatingReceipt}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 disabled:opacity-60"
                  >
                    {generatingReceipt ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                        Generating Cryptographic Evidence Bundle...
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        Generate Regulator's Receipt
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {receipt && (
              <div className="mt-6">
                <RegulatorsReceipt receipt={receipt} />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 tracking-wider">
            CONFIDENTIAL &middot; DATACENDIA, LLC &middot; CELTIC FC EXECUTIVE SANDBOX &middot; {new Date().getFullYear()}
          </p>
          <p className="text-[10px] text-white/15 mt-1">
            90+ regulatory scenarios mapped for Celtic plc &middot; Full architecture document available on request
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

// =============================================================================
// HELPERS
// =============================================================================

function getPhaseOrder(phase: Phase): number {
  const order: Record<Phase, number> = { idle: 0, phase1: 1, phase2: 2, phase3: 3, complete: 4 };
  return order[phase];
}

function renderPhaseMarker(label: string, phaseId: Phase, currentPhase: Phase) {
  const isActive = currentPhase === phaseId;
  const isDone = getPhaseOrder(currentPhase) > getPhaseOrder(phaseId);
  return (
    <div key={phaseId} className="flex items-center gap-3 py-2">
      <div className={`w-6 h-px flex-1 ${isDone ? 'bg-emerald-400/30' : isActive ? 'bg-white/20' : 'bg-white/5'}`} />
      <span className={`text-[10px] font-bold tracking-[0.15em] uppercase ${
        isDone ? 'text-emerald-400/60' : isActive ? 'text-white/60' : 'text-white/20'
      }`}>{label}</span>
      <div className={`w-6 h-px flex-1 ${isDone ? 'bg-emerald-400/30' : isActive ? 'bg-white/20' : 'bg-white/5'}`} />
    </div>
  );
}

// =============================================================================
// EXPORT — PAGE WITH ACCESS GATE
// =============================================================================

const CelticSandboxPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('celtic-sandbox-unlocked') === 'true') {
      setUnlocked(true);
      return;
    }
    const keyParam = searchParams.get('key');
    if (keyParam && keyParam.trim().toUpperCase() === SANDBOX_ACCESS_KEY) {
      sessionStorage.setItem('celtic-sandbox-unlocked', 'true');
      setUnlocked(true);
    }
  }, [searchParams]);

  const handleUnlock = () => {
    sessionStorage.setItem('celtic-sandbox-unlocked', 'true');
    setUnlocked(true);
  };

  if (!unlocked) {
    return <AccessGate onUnlock={handleUnlock} />;
  }

  return <CelticSandbox />;
};

export default CelticSandboxPage;
