// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - FIFA/UEFA GOVERNANCE SCENARIO DATA
 * High-impact governance crisis scenarios for institutional demo
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ScenarioAgent {
  id: string;
  role: string;
  displayLabel: string;
  mandate: string;
  finding: string;
  confidence: number;
  citationCount: number;
  riskFlag?: 'critical' | 'high' | 'medium' | 'low';
}

export interface ScenarioOutput {
  id: string;
  label: string;
  description: string;
  type: 'decision_packet' | 'financial_simulation' | 'evidence_trail' | 'receipt' | 'risk_matrix' | 'dissent_record' | 'decision_tree' | 'reasoning_chain' | 'timeline';
}

export interface ScenarioRisk {
  label: string;
  probability: number;
  impact: 'catastrophic' | 'severe' | 'major' | 'moderate' | 'minor';
  mitigation: string;
}

export interface GovernanceScenario {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  category: 'financial' | 'integrity' | 'emergency' | 'operational' | 'policy';
  categoryLabel: string;
  icon: string;
  setup: string[];
  complications: string[];
  agents: ScenarioAgent[];
  outputs: ScenarioOutput[];
  risks: ScenarioRisk[];
  whyItMatters: string[];
  keyInsight: string;
  councilMode: string;
  estimatedDuration: string;
}

// =============================================================================
// SCENARIO 1: FFP CRISIS
// =============================================================================

const FFP_CRISIS: GovernanceScenario = {
  id: 'fifa-001',
  number: 1,
  title: 'The €180M Transfer That Breaks the Wage Cap',
  subtitle: 'Financial Fair Play Crisis',
  category: 'financial',
  categoryLabel: 'Financial Sustainability',
  icon: '💰',
  setup: [
    'A top-tier European club signs a €180M player',
    'Payment structured across 6 years via deferred installments',
    'Related-party sponsorship revenue used to offset costs',
    'Club claims full FFP compliance via amortization',
    'Whistleblower files formal complaint alleging:',
    '  — Inflated commercial revenue from related entities',
    '  — Hidden agent fees routed through intermediary companies',
    '  — Deferred bonus clauses not disclosed in FFP submission',
  ],
  complications: [
    'Club has significant political influence within UEFA committees',
    'Multiple CAS precedents create ambiguity on related-party valuation',
    'Media coverage is already active — timeline pressure is real',
    'Three other clubs are monitoring for precedent implications',
  ],
  agents: [
    {
      id: 'cfo-agent',
      role: 'financial_analysis',
      displayLabel: 'Financial Analysis Function',
      mandate: 'Model amortization, assess true cost, validate revenue classification',
      finding: 'Amortization model is technically compliant under Art. 65, but related-party revenue of €47.2M requires independent fair market value assessment. Current valuation exceeds comparable market rates by 340%. Net cost over 6 years: €312M including undisclosed bonus triggers.',
      confidence: 91,
      citationCount: 8,
      riskFlag: 'critical',
    },
    {
      id: 'compliance-agent',
      role: 'ffp_compliance',
      displayLabel: 'FFP Compliance Function',
      mandate: 'Map against UEFA Financial Sustainability Regulations (2022)',
      finding: 'Articles 70-77 apply. Squad cost ratio at 78% (threshold: 70%). Break-even deviation exceeds €30M acceptable limit. Three specific disclosure violations identified under Club Licensing Manual Section 5.3.',
      confidence: 94,
      citationCount: 14,
      riskFlag: 'critical',
    },
    {
      id: 'legal-agent',
      role: 'legal_precedent',
      displayLabel: 'Legal Precedent Function',
      mandate: 'Cross-reference CAS rulings, identify defense vectors',
      finding: 'CAS 2020/A/6785 established that amortization alone does not satisfy FFP if underlying revenue is artificially inflated. However, CAS 2019/A/6298 found procedural errors invalidated a similar sanction. Club will likely argue (1) commercial justification, (2) retroactive rule application, (3) proportionality. All three are addressable with documented evidence chain.',
      confidence: 87,
      citationCount: 12,
    },
    {
      id: 'regulator-agent',
      role: 'sanction_modeling',
      displayLabel: 'Regulatory Outcome Function',
      mandate: 'Model probable sanctions and CAS appeal resilience',
      finding: 'Based on 23 comparable CFCB decisions: 72% probability of settlement agreement, 18% probability of formal sanction (squad restriction + fine), 10% probability of dismissal on procedural grounds. CAS appeal survival rate with current evidence chain: 84%.',
      confidence: 82,
      citationCount: 9,
      riskFlag: 'high',
    },
    {
      id: 'media-agent',
      role: 'media_risk',
      displayLabel: 'Media & Reputation Function',
      mandate: 'Model public narrative risk and stakeholder exposure',
      finding: 'Leaked investigation would generate estimated 2,400+ articles within 48 hours. Perceived inaction creates "two-tier system" narrative. Premature action creates "politically motivated" counter-narrative. Optimal window: announce investigation within 72 hours of formal complaint receipt with structured communication plan.',
      confidence: 76,
      citationCount: 5,
      riskFlag: 'high',
    },
    {
      id: 'dissent-agent',
      role: 'institutional_dissent',
      displayLabel: 'Minority Compliance Objection',
      mandate: 'Log structural objections and alternative interpretations',
      finding: 'DISSENT LOGGED: The current FFP framework creates inherent asymmetry — clubs with state-affiliated ownership can generate compliant-appearing revenue that privately-owned clubs cannot. This structural issue means enforcement action risks appearing discriminatory unless proportionality proof addresses the framework gap explicitly. Recommend: acknowledge structural limitation in decision reasoning.',
      confidence: 79,
      citationCount: 6,
    },
  ],
  outputs: [
    { id: 'out-1', label: 'Decision Packet', description: 'Full deliberation record with citations, confidence scores, and consensus recommendation', type: 'decision_packet' },
    { id: 'out-2', label: 'Financial Simulation (3 Seasons)', description: 'Break-even projection under current structure vs. corrective scenarios', type: 'financial_simulation' },
    { id: 'out-3', label: 'Cryptographic Evidence Trail', description: 'SHA-256 timestamped discovery chain for all evidence items', type: 'evidence_trail' },
    { id: 'out-4', label: "Regulator's Receipt", description: 'Court-admissible artifact proving procedural integrity', type: 'receipt' },
    { id: 'out-5', label: 'Dissent Record', description: 'Logged minority objection with structural framework critique', type: 'dissent_record' },
  ],
  risks: [
    { label: 'CAS Overturn on Procedural Grounds', probability: 16, impact: 'severe', mitigation: 'Full procedural compliance verification with 6/6 checks passed' },
    { label: 'Political Backlash (Bias Perception)', probability: 45, impact: 'major', mitigation: 'Proportionality proof showing identical treatment across comparable cases' },
    { label: 'Retroactive Rule Challenge', probability: 28, impact: 'major', mitigation: 'Evidence chain proves regulations in force at time of transactions' },
    { label: 'Media "Two-Tier System" Narrative', probability: 62, impact: 'severe', mitigation: 'Structured communication plan with 72-hour window' },
  ],
  whyItMatters: [
    'UEFA/FIFA fear perceived bias more than actual rule breaches',
    'CAS appeals have overturned sanctions on procedural gaps, not substance',
    'The system proves: "Here is the defensible reasoning chain" — that shifts the burden',
    'Dissent logging acknowledges structural limitations transparently',
  ],
  keyInsight: 'Football doesn\'t lack intelligence. It lacks defensible deliberation.',
  councilMode: 'governance',
  estimatedDuration: '20 min walkthrough',
};

// =============================================================================
// SCENARIO 2: WORLD CUP HOST SELECTION
// =============================================================================

const HOST_SELECTION: GovernanceScenario = {
  id: 'fifa-002',
  number: 2,
  title: 'The Bid That Triggers Political Scrutiny',
  subtitle: 'World Cup Host Selection Integrity',
  category: 'integrity',
  categoryLabel: 'Institutional Integrity',
  icon: '🏟️',
  setup: [
    'Three nations submit bids to host the World Cup',
    'Country A: Strong infrastructure, human rights concerns, $14B budget',
    'Country B: Moderate infrastructure, strong governance record, $9B budget',
    'Country C: Excellent commercial case, political instability risk, $11B budget',
    'Each offers infrastructure guarantees, commercial incentives, political backing',
    'Evaluation must withstand public, media, and legal scrutiny for decades',
  ],
  complications: [
    'Historical precedent: previous selections faced corruption allegations',
    'Human rights organizations are actively monitoring the process',
    'Commercial broadcast partners have financial preferences',
    'Climate commitments add new evaluation dimensions not in legacy criteria',
    'Voting members face individual political pressure',
  ],
  agents: [
    {
      id: 'ethics-agent',
      role: 'ethics_governance',
      displayLabel: 'Ethics & Human Rights Function',
      mandate: 'Assess human rights record, labor standards, and governance commitments',
      finding: 'Country A: 3 active ILO complaints, 2 UN special rapporteur concerns. Has committed to independent monitoring body. Country B: Clean record, 2 minor historic issues resolved. Country C: Mixed — progress on labor law, but independent judiciary concerns persist. Recommendation: weight human rights at minimum 15% of total score.',
      confidence: 88,
      citationCount: 18,
      riskFlag: 'high',
    },
    {
      id: 'infra-agent',
      role: 'infrastructure_risk',
      displayLabel: 'Infrastructure Risk Function',
      mandate: 'Model construction timeline, budget overrun probability, legacy viability',
      finding: 'Country A: 82% probability of delivery on time (existing infrastructure). Budget overrun risk: 15-20%. Country B: 64% on-time probability (requires 4 new stadiums). Overrun risk: 35-50%. Country C: 71% on-time. Overrun risk: 25-35%. Legacy viability best for Country A (existing demand), worst for Country B (population density concerns).',
      confidence: 85,
      citationCount: 11,
      riskFlag: 'medium',
    },
    {
      id: 'financial-exposure-agent',
      role: 'financial_exposure',
      displayLabel: 'Financial Exposure Function',
      mandate: 'Model total cost, revenue projection, and sovereign guarantee risk',
      finding: 'Country A total exposure: $14.2B with sovereign guarantee. Revenue projection: $7.8B (net cost: $6.4B). Country B: $9.1B, revenue: $5.2B (net: $3.9B). Country C: $11.4B, revenue: $6.9B (net: $4.5B). Currency risk highest for Country C. All three bids are financially viable but Country B has lowest taxpayer exposure.',
      confidence: 83,
      citationCount: 9,
    },
    {
      id: 'legal-liability-agent',
      role: 'legal_liability',
      displayLabel: 'Legal Liability Function',
      mandate: 'Assess litigation exposure, contractual enforceability, and precedent risk',
      finding: 'Country A: High litigation probability from human rights NGOs (estimated 8-12 lawsuits). Country B: Low litigation risk. Country C: Moderate — contractual enforceability concerns due to legal system independence metrics. FIFA liability: if selection process is challenged, procedural documentation is the primary defense.',
      confidence: 80,
      citationCount: 14,
      riskFlag: 'high',
    },
    {
      id: 'reputation-agent',
      role: 'reputation_modeling',
      displayLabel: 'Institutional Reputation Function',
      mandate: 'Model 10-year reputation trajectory for FIFA under each selection',
      finding: 'Country A selection: 67% probability of sustained negative media cycle (12-18 months). Brand partnership risk: 3 major sponsors flagged concerns. Country B: Neutral to positive. Country C: Mixed — initial positive, risk of negative shift if political instability materializes. Reputation recovery cost from poor selection: estimated $200-400M in sponsor renegotiation.',
      confidence: 74,
      citationCount: 7,
      riskFlag: 'medium',
    },
    {
      id: 'dissent-host-agent',
      role: 'institutional_dissent',
      displayLabel: 'Independent Dissent Function',
      mandate: 'Log structural objections and challenge consensus assumptions',
      finding: 'DISSENT LOGGED: The evaluation framework underweights post-tournament legacy value and overweights short-term commercial return. Country B scores lowest on commercial metrics but highest on sustainable legacy and governance. If FIFA\'s stated reform agenda is genuine, the evaluation criteria should reflect it. Current weighting favors commercial over institutional credibility.',
      confidence: 81,
      citationCount: 4,
    },
  ],
  outputs: [
    { id: 'out-1', label: 'Board-Level Decision Summary', description: 'Structured evaluation with weighted scoring across all dimensions', type: 'decision_packet' },
    { id: 'out-2', label: 'Chronos: 5-Year Host Trajectory', description: 'Simulated outcomes: budget overrun, media crisis, litigation per host', type: 'financial_simulation' },
    { id: 'out-3', label: 'Risk Matrix', description: 'Probability × impact grid for each bid across 6 risk categories', type: 'risk_matrix' },
    { id: 'out-4', label: 'Minority Dissent Record', description: 'Logged dissent challenging commercial-first evaluation weighting', type: 'dissent_record' },
    { id: 'out-5', label: 'Signed Vote Explanation', description: 'Each evaluator\'s rationale cryptographically sealed', type: 'receipt' },
  ],
  risks: [
    { label: 'Corruption Allegation (Process)', probability: 35, impact: 'catastrophic', mitigation: 'Cryptographic vote explanation seals every evaluator\'s rationale' },
    { label: 'Human Rights Legal Challenge', probability: 55, impact: 'severe', mitigation: 'Ethics function scoring documented with international law citations' },
    { label: 'Budget Overrun (Host)', probability: 48, impact: 'major', mitigation: 'Infrastructure function flags risk upfront in decision record' },
    { label: 'Sponsor Withdrawal Threat', probability: 22, impact: 'severe', mitigation: 'Reputation function models commercial impact per selection' },
  ],
  whyItMatters: [
    'Host selections define FIFA\'s reputation for decades',
    'If FIFA says: "The decision was deliberated by structured governance simulation with logged dissent" — that shifts the narrative from political to procedural',
    'Previous selections faced DOJ investigations and Swiss criminal proceedings',
    'Documented deliberation is the difference between defensible and indefensible',
  ],
  keyInsight: 'Host selections that cannot prove their reasoning will always be questioned. Ones that can, won\'t.',
  councilMode: 'governance',
  estimatedDuration: '25 min walkthrough',
};

// =============================================================================
// SCENARIO 3: MATCH-FIXING EMERGENCY
// =============================================================================

const MATCH_FIXING: GovernanceScenario = {
  id: 'fifa-003',
  number: 3,
  title: 'The Match-Fixing Allegation 48 Hours Before a Final',
  subtitle: 'Emergency Governance Crisis',
  category: 'emergency',
  categoryLabel: 'Crisis Response',
  icon: '🚨',
  setup: [
    'Anonymous tip received: referee has undisclosed conflict of interest',
    'Betting monitoring detects suspicious activity on specific match outcomes',
    'Player agent linked to individual under investigation in separate jurisdiction',
    'Media outlet contacts FIFA for comment — story publishing in 24 hours',
    'The match is a continental final with 400M+ global viewers expected',
  ],
  complications: [
    'Postponement costs: estimated €85M in broadcast, commercial, and logistics',
    'Proceeding without investigation risks "cover-up" narrative',
    'Investigation without evidence risks defamation liability',
    'Player agent threatens legal action if allegations become public',
    'Betting data is probabilistic, not conclusive',
  ],
  agents: [
    {
      id: 'integrity-agent',
      role: 'integrity_assessment',
      displayLabel: 'Integrity Assessment Function',
      mandate: 'Evaluate evidence quality, source reliability, and corroboration',
      finding: 'Anonymous tip: unverified, but source has provided accurate information in 2 previous cases. Betting anomaly: 3.2 standard deviations above expected volume on specific market. Referee conflict: confirmed — financial relationship with entity connected to one competing club. Agent link: circumstantial, under investigation in separate jurisdiction. Overall evidence grade: MODERATE — sufficient to warrant precautionary measures, insufficient for formal charges.',
      confidence: 78,
      citationCount: 6,
      riskFlag: 'critical',
    },
    {
      id: 'legal-crisis-agent',
      role: 'legal_crisis',
      displayLabel: 'Legal Crisis Function',
      mandate: 'Model litigation exposure for each decision path',
      finding: 'POSTPONE: Litigation risk from clubs (€85M claim), broadcasters (€120M), but defensible if integrity concern documented. PROCEED: If manipulation later confirmed, FIFA faces negligence claim and reputational catastrophe. QUIET INVESTIGATION: If leaked, "cover-up" liability. PUBLIC STATEMENT: Defamation risk from named individuals. Recommendation: Replace referee (precautionary, low litigation exposure) + initiate formal investigation + prepare contingency statement.',
      confidence: 85,
      citationCount: 11,
      riskFlag: 'high',
    },
    {
      id: 'crucible-agent',
      role: 'adversarial_stress_test',
      displayLabel: 'Adversarial Red Team Function',
      mandate: 'Attack each decision option and identify collapse points',
      finding: 'RED TEAM ANALYSIS — Option 1 (Postpone): Collapses if evidence proves unfounded → "FIFA destroyed the biggest match of the year on a rumor." Option 2 (Proceed): Collapses if evidence proves founded → "FIFA knew and let it happen." Option 3 (Quiet investigate): Collapses if media publishes → "FIFA tried to hide it." Option 4 (Public statement): Collapses if individuals are innocent → defamation. LEAST VULNERABLE: Replace referee + proceed + parallel investigation. This option has no single point of total collapse.',
      confidence: 82,
      citationCount: 8,
    },
    {
      id: 'premortem-agent',
      role: 'pre_mortem',
      displayLabel: 'Pre-Mortem Function',
      mandate: 'If we proceed and evidence later confirms manipulation — what collapses?',
      finding: 'PRE-MORTEM: If match proceeds AND manipulation is later confirmed: (1) Competition integrity of entire tournament invalidated, (2) FIFA faces class-action from defeated club, (3) Betting industry regulatory bodies initiate sanctions, (4) Broadcast partners demand contractual remedies, (5) Public trust index drops by estimated 35-45 points. Total estimated exposure: €400-600M. If match proceeds with precautionary referee replacement: exposure drops to €15-30M.',
      confidence: 88,
      citationCount: 7,
      riskFlag: 'critical',
    },
    {
      id: 'trust-agent',
      role: 'public_trust',
      displayLabel: 'Public Trust Function',
      mandate: 'Model fan and stakeholder trust impact per decision path',
      finding: 'Fan trust modeling across 10,000 simulated news cycles: Postpone (trust: +12 if justified, -45 if unjustified). Proceed with replacement (trust: +8 stable). Proceed without action (trust: -62 if later confirmed). Cover-up attempt (trust: -78). Public transparency with proportionate action scores highest on long-term trust preservation.',
      confidence: 73,
      citationCount: 4,
      riskFlag: 'medium',
    },
  ],
  outputs: [
    { id: 'out-1', label: 'Decision Tree', description: '4 paths with probability-weighted outcomes and collapse points', type: 'decision_tree' },
    { id: 'out-2', label: 'Risk-Weighted Path Recommendation', description: 'Optimal action under uncertainty with pre-mortem analysis', type: 'decision_packet' },
    { id: 'out-3', label: 'Formalized Accountability Record', description: 'Who decided what, when, and why — sealed and immutable', type: 'receipt' },
    { id: 'out-4', label: 'Red Team Attack Summary', description: 'Every option stress-tested with collapse scenarios', type: 'risk_matrix' },
    { id: 'out-5', label: 'Pre-Mortem Report', description: '"If we proceed and it fails — here is what collapses"', type: 'reasoning_chain' },
  ],
  risks: [
    { label: 'Match Result Invalidated (Post-Facto)', probability: 18, impact: 'catastrophic', mitigation: 'Precautionary referee replacement eliminates primary vector' },
    { label: 'Defamation Lawsuit from Named Individuals', probability: 42, impact: 'major', mitigation: 'No public naming — confidential investigation with documented cause' },
    { label: '"Cover-Up" Media Narrative', probability: 55, impact: 'severe', mitigation: 'Transparent precautionary action with prepared statement' },
    { label: 'Broadcast Partner Contractual Claim', probability: 30, impact: 'major', mitigation: 'Integrity clause in broadcast agreements covers precautionary action' },
  ],
  whyItMatters: [
    'FIFA\'s biggest fear is not incidents — it\'s mishandled incidents',
    'The system doesn\'t tell you what to decide — it shows what collapses under each path',
    'Formalized accountability means no individual carries unreasonable personal liability',
    'Pre-mortem analysis is the difference between "we considered it" and "we didn\'t think of that"',
  ],
  keyInsight: 'In crisis, the decision you can prove you deliberated is the only one that survives scrutiny.',
  councilMode: 'crisis',
  estimatedDuration: '20 min walkthrough',
};

// =============================================================================
// SCENARIO 4: SOLIDARITY COMPENSATION DISPUTE
// =============================================================================

const SOLIDARITY_DISPUTE: GovernanceScenario = {
  id: 'fifa-004',
  number: 4,
  title: 'The Disputed Training Compensation Claim',
  subtitle: 'Solidarity & Compensation Distribution Audit',
  category: 'operational',
  categoryLabel: 'Operational Governance',
  icon: '⚖️',
  setup: [
    'Small academy club files claim for €4.2M in training compensation',
    'Player trained at academy from ages 12-18, then transferred internationally',
    'FIFA Clearing House processes dispute — multiple jurisdictions involved',
    'Receiving club contests the calculation methodology',
    'Academy lacks resources for prolonged legal challenge',
  ],
  complications: [
    'Three different jurisdictions apply different contractual interpretation rules',
    'Currency timing: training occurred over 6 years with 3 different exchange rate regimes',
    'CAS precedent from Diarra judgment creates new interpretation obligations',
    'Receiving club argues academy registration was incomplete for 14 months',
    'Solidarity mechanism formula version changed mid-training period',
  ],
  agents: [
    {
      id: 'contractual-agent',
      role: 'contractual_analysis',
      displayLabel: 'Contractual Analysis Function',
      mandate: 'Interpret registration records, training periods, and contractual chain',
      finding: 'Registration verified for 5 years, 10 months of claimed 6-year period. 14-month gap is administrative — player continued training, but federation registration lapsed due to system migration. Under FIFA Circular 1709, administrative lapses do not void training compensation rights if continuous training is evidenced. Academy has attendance records for the gap period.',
      confidence: 89,
      citationCount: 11,
    },
    {
      id: 'jurisdiction-agent',
      role: 'jurisdiction_mapping',
      displayLabel: 'Jurisdiction Alignment Function',
      mandate: 'Map applicable law per jurisdiction and identify conflicts',
      finding: 'Training jurisdiction (Country A): Domestic law recognizes full 6-year claim. Transfer jurisdiction (Country B): Applies FIFA RSTP Art. 20 directly. Receiving jurisdiction (Country C): Requires bilateral agreement validation. Conflict: Country C does not recognize administrative continuity doctrine. Resolution: FIFA RSTP takes precedence over domestic law per CAS 2021/A/7578. Full claim is defensible.',
      confidence: 86,
      citationCount: 15,
    },
    {
      id: 'financial-calc-agent',
      role: 'financial_calculation',
      displayLabel: 'Financial Calculation Function',
      mandate: 'Verify compensation formula application and currency treatment',
      finding: 'Training compensation per FIFA RSTP Annex 4: Category III academy × 6 years = €3.8M base. Add-on for international transfer premium: €400K. Total: €4.2M as claimed. Currency treatment: All calculations in EUR at date of claim filing (standard practice per FIFA Clearing House rules). Receiving club\'s counter-calculation of €2.1M uses incorrect category classification and excludes premium.',
      confidence: 93,
      citationCount: 8,
    },
    {
      id: 'precedent-agent',
      role: 'cas_precedent',
      displayLabel: 'CAS Precedent Function',
      mandate: 'Cross-reference with binding CAS decisions and Diarra implications',
      finding: '7 directly comparable CAS decisions identified. In 5/7, full training compensation was awarded where continuous training was evidenced. Diarra judgment (2024) strengthens academy position: EU free movement principles do not override training compensation rights. Key precedent: CAS 2022/A/8294 — administrative registration gaps do not extinguish rights. Appeal survival probability for academy claim: 91%.',
      confidence: 91,
      citationCount: 19,
    },
    {
      id: 'dissent-solidarity-agent',
      role: 'institutional_dissent',
      displayLabel: 'Minority Dissent Function',
      mandate: 'Challenge assumptions and log alternative interpretations',
      finding: 'DISSENT LOGGED: While the legal position favors the academy, the practical enforcement timeline disadvantages small clubs. Average resolution time: 18-24 months. Academy operating budget: €800K/year. Recommend: expedited process for claims where claimant\'s annual revenue is below €5M, to prevent procedural justice from becoming functionally inaccessible.',
      confidence: 84,
      citationCount: 3,
    },
  ],
  outputs: [
    { id: 'out-1', label: 'Structured Reasoning Chain', description: 'Step-by-step legal analysis with citations to FIFA RSTP, CAS precedent, and domestic law', type: 'reasoning_chain' },
    { id: 'out-2', label: 'Decision Export for Appeal Defense', description: 'Pre-packaged artifact for CAS submission if appealed', type: 'receipt' },
    { id: 'out-3', label: 'Minority Dissent (Access to Justice)', description: 'Logged concern about procedural timeline disadvantaging small clubs', type: 'dissent_record' },
    { id: 'out-4', label: 'Financial Calculation Proof', description: 'Formula application with version tracking and input verification', type: 'financial_simulation' },
    { id: 'out-5', label: 'Jurisdiction Map', description: 'Visual conflict resolution showing which law applies at each stage', type: 'decision_packet' },
  ],
  risks: [
    { label: 'Appeal by Receiving Club', probability: 65, impact: 'moderate', mitigation: '91% CAS survival rate with current evidence chain' },
    { label: 'Registration Gap Challenge', probability: 40, impact: 'moderate', mitigation: 'FIFA Circular 1709 + attendance records cover administrative lapse' },
    { label: 'Currency Dispute', probability: 15, impact: 'minor', mitigation: 'Standard EUR calculation at filing date per Clearing House rules' },
    { label: 'Diarra Precedent Misapplication', probability: 20, impact: 'major', mitigation: 'CAS 2022/A/8294 directly addresses this fact pattern' },
  ],
  whyItMatters: [
    'This is operational governance — not flashy, but legally critical',
    'Small clubs depend on training compensation for survival',
    'Inconsistent enforcement undermines the entire solidarity mechanism',
    'Documented, provable reasoning chains prevent precedent erosion',
  ],
  keyInsight: 'The system that protects the smallest club\'s claim with the same rigor as the biggest is the system that earns institutional trust.',
  councilMode: 'governance',
  estimatedDuration: '15 min walkthrough',
};

// =============================================================================
// SCENARIO 5: VAR POLICY REFORM
// =============================================================================

const VAR_REFORM: GovernanceScenario = {
  id: 'fifa-005',
  number: 5,
  title: 'Should VAR Expand to Offside Margins?',
  subtitle: 'VAR Policy Reform Decision',
  category: 'policy',
  categoryLabel: 'Policy & Reform',
  icon: '📐',
  setup: [
    'Debate over marginal offside tolerance — current system flags millimeter decisions',
    'Fan trust in VAR at historic low: 42% approval rating',
    'Referee association requests clearer authority boundaries',
    'Player union argues current system penalizes natural attacking movement',
    'Broadcast partners report 12% viewer drop during extended VAR reviews',
  ],
  complications: [
    'No consensus among member associations — 65% support reform, 35% oppose',
    'Technology vendors have commercial interest in current implementation',
    'Legal precedent: rule changes affecting competition outcomes face challenge risk',
    'Implementation timeline: 18 months minimum across all confederations',
    'Any margin introduces new "line drawing" problems',
  ],
  agents: [
    {
      id: 'technical-agent',
      role: 'technical_feasibility',
      displayLabel: 'Technical Feasibility Function',
      mandate: 'Assess implementation options and accuracy implications',
      finding: 'Three options evaluated: (A) 5cm tolerance margin — reduces controversial decisions by 68%, introduces 4% new edge cases. (B) "Daylight" rule (visible gap required) — subjective but reduces reviews by 82%. (C) Semi-automated offside with thicker line — cosmetic change, no statistical impact. Recommendation: Option A with 2-season trial. Technology accuracy at 5cm: 99.7%.',
      confidence: 90,
      citationCount: 7,
    },
    {
      id: 'fairness-agent',
      role: 'player_fairness',
      displayLabel: 'Competitive Fairness Function',
      mandate: 'Model impact on attacking play, scoring rates, and competitive balance',
      finding: 'Historical analysis of 12,000 offside decisions across 5 leagues: 5cm margin would have changed 312 decisions (2.6%). Of those, 78% were marginal calls against attacking players. Expected goals increase: +0.14 per match. Impact on league standings: minimal — affects bottom and top equally. Player union assessment: overwhelmingly positive. Referee association: supports clearer threshold.',
      confidence: 87,
      citationCount: 10,
    },
    {
      id: 'fan-trust-agent',
      role: 'fan_trust',
      displayLabel: 'Fan & Stakeholder Trust Function',
      mandate: 'Model public sentiment and commercial impact of reform',
      finding: 'Survey data (47,000 respondents, 12 countries): 74% support tolerance margin. Expected VAR approval rating increase: from 42% to estimated 61%. Broadcast engagement: expected 8% recovery in viewer retention during reviews. Season ticket holder sentiment: 68% say VAR reform would improve matchday experience. Commercial partner feedback: 4 of 6 major sponsors support reform.',
      confidence: 82,
      citationCount: 6,
    },
    {
      id: 'litigation-var-agent',
      role: 'litigation_modeling',
      displayLabel: 'Legal & Competition Function',
      mandate: 'Assess challenge risk from clubs affected by rule change',
      finding: 'Rule changes affecting competition outcomes have been challenged 3 times in CAS history. All 3 were dismissed — governing bodies have broad discretion over Laws of the Game. Risk: A club relegated by 1 point where a marginal offside under old rules would have saved them. Mitigation: implement at season boundary, not mid-season. Legal risk rating: LOW.',
      confidence: 91,
      citationCount: 8,
    },
    {
      id: 'dissent-var-agent',
      role: 'institutional_dissent',
      displayLabel: 'Minority Dissent Function',
      mandate: 'Challenge reform assumptions and defend status quo arguments',
      finding: 'DISSENT LOGGED: Any tolerance margin is arbitrary — 5cm is no more "fair" than 0cm or 10cm. The real issue is that offside is a binary rule being applied to continuous physical movement. A margin creates a new boundary that will generate identical controversies at the new threshold. Consider: would a phase-based offside reform (attacker must be beyond last defender at moment of pass AND at moment of reception) be more structurally sound?',
      confidence: 75,
      citationCount: 4,
    },
  ],
  outputs: [
    { id: 'out-1', label: 'Policy Decision Packet', description: 'Structured recommendation with option comparison and stakeholder impact', type: 'decision_packet' },
    { id: 'out-2', label: 'Fan Trust Simulation', description: 'Projected approval rating change across 3 implementation options', type: 'financial_simulation' },
    { id: 'out-3', label: 'Competitive Impact Analysis', description: 'Statistical impact on goals, league standings, and attacking play', type: 'risk_matrix' },
    { id: 'out-4', label: 'Structural Dissent', description: 'Minority argument that margins create new boundary problems', type: 'dissent_record' },
    { id: 'out-5', label: 'Implementation Timeline', description: '18-month rollout plan across confederations with trial phases', type: 'timeline' },
  ],
  risks: [
    { label: 'New Boundary Controversy', probability: 72, impact: 'moderate', mitigation: 'Clear communication: "margin reduces, not eliminates, controversy"' },
    { label: 'Club Legal Challenge (Relegation Case)', probability: 8, impact: 'major', mitigation: 'Implement at season boundary — CAS precedent supports governing body discretion' },
    { label: 'Technology Vendor Resistance', probability: 35, impact: 'minor', mitigation: 'Tender process for updated system — competitive procurement' },
    { label: 'Member Association Disagreement', probability: 45, impact: 'moderate', mitigation: '2-season trial with data-driven review clause' },
  ],
  whyItMatters: [
    'This shows governance beyond finance — Datacendia handles policy reform too',
    'VAR is the most visible governance decision affecting 3.5 billion fans',
    'Structured deliberation with logged dissent legitimizes controversial rule changes',
    'The dissent record protects FIFA: "we considered the counter-argument and documented it"',
  ],
  keyInsight: 'Policy decisions that document their deliberation survive public scrutiny. Ones that don\'t become "FIFA just decided."',
  councilMode: 'governance',
  estimatedDuration: '15 min walkthrough',
};

// =============================================================================
// EXPORT ALL SCENARIOS
// =============================================================================

export const FIFA_GOVERNANCE_SCENARIOS: GovernanceScenario[] = [
  FFP_CRISIS,
  HOST_SELECTION,
  MATCH_FIXING,
  SOLIDARITY_DISPUTE,
  VAR_REFORM,
];
