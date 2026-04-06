/**
 * Scotiabank Peru — Enterprise AI Governance Sandbox
 *
 * 25 scenarios across every role from Board to Branch Manager to Loan Officer.
 * Peru Regulators: SBS, SMV, BCRP, SUNAT, APDP, UIF
 *
 * Access: /sandbox/scotiabank (Key: SCOTIA-26)
 * @module pages/sandbox/configs/scotiabank
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig, TemplateScenario } from '../SandboxTemplate';
import { ES_SCENARIOS } from './scotiabank-es';

/* ── helpers ─────────────────────────────────────────────────────────────── */
const ag = (id: string, n: string, r: string, i: string, c: string, bc: string) => ({ id, name: n, role: r, icon: i, color: c, borderColor: `border-${bc}/40`, bgColor: `bg-${bc}/10` });
const cn = (n: string, s: 'connected' | 'syncing' | 'ready', t: string, i: string, d: string) => ({ name: n, status: s, type: t, icon: i, detail: d });
const ln = (a: string, p: 'phase1' | 'phase2' | 'phase3', t: 'analysis' | 'warning' | 'dissent' | 'flag' | 'proposal' | 'resolution' | 'withdrawal', dl: number, c: string) => ({ agentId: a, phase: p, type: t, delay: dl, content: c });

/* ── receipt helper ──────────────────────────────────────────────────────── */
const rc = (idx: string, ml: string, cl: string, cv: string, ct: string, ags: string[], gt: string, gb: string, ec: string) => ({
  hash: `SHA-256:scot0${idx}0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6`,
  merkleRoot: `scot1${idx}1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7`,
  merkleLabel: ml, complianceLabel: cl, complianceValue: cv, complianceThreshold: ct,
  agents: ags, dissents: 1, dissentResolved: true,
  guaranteeTitle: gt, guaranteeBody: gb, evidenceChain: ec,
});

/* ── scenarios ───────────────────────────────────────────────────────────── */
const scenarios: TemplateScenario[] = [

  // 1 — CEO / BOARD: ENTERPRISE AI STRATEGY
  // Role: CEO / Board of Directors | Level: C-Suite / Board
  {
    id: 'board-ai-strategy', title: 'Board & CEO — Enterprise AI Strategy Governance',
    subtitle: 'Board oversight · AI investment · SBS Res. 272-2017 · Fiduciary duty · Strategic risk',
    banner: 'Scotiabank Peru board approves $45M AI transformation. 18 months later: 3 models in production have no governance evidence. SBS requests documentation, Toronto HQ demands audit trail. The board approved spend — but never governed what the AI does.',
    risk: 'Critical', scenarioNum: '01', icon: 'landmark', color: 'text-red-400',
    agents: [ag('board-gov','Board Governance Agent','Fiduciary & Oversight','🏛️','text-red-400','red-500'), ag('ceo-strat','CEO Strategy Agent','AI Transformation','👔','text-blue-400','blue-500'), ag('sbs-reg','SBS Regulatory Agent','Banking Supervision','⚖️','text-amber-400','amber-500'), ag('toronto-hq','Toronto HQ Agent','Global Compliance','🌍','text-emerald-400','emerald-500')],
    connectors: [cn('Board Minutes','connected','Governance','landmark','AI investment: $45M approved — 3 models live, 0 governed'), cn('SBS Portal','connected','Regulator','shield','Res. 272-2017: technology risk management required'), cn('Toronto OSFI','connected','Global HQ','globe','OSFI E-23: enterprise AI model governance'), cn('AI Registry','syncing','Models','database','47 AI models — 3 production, 44 development')],
    script: [
      ln('board-gov','phase1','warning',800,'BOARD GOVERNANCE GAP. $45M AI transformation approved Q2 2025. 18 months later: 3 production models (credit scoring, fraud detection, chatbot). Board received: quarterly spend reports. Board did NOT receive: model performance, bias monitoring, decision audit trails, regulatory evidence. SBS Res. 272-2017 Art. 5 requires board-level AI governance. The board governs the budget — nobody governs the AI.'),
      ln('sbs-reg','phase1','analysis',2500,'SBS EXAMINATION RISK. Res. 272-2017: "Board shall ensure adequate governance of technology risks including AI." SBS questions: What models are in production? What decisions do they make? What oversight exists? Show evidence. Scotiabank answers (1). Cannot answer (2)-(4). Finding: MATERIAL DEFICIENCY. 90-day remediation or operational restrictions on AI deployment.'),
      ln('toronto-hq','phase2','dissent',2000,'DISSENT — TORONTO CONFLICT. OSFI E-23 requires enterprise-wide AI governance. Toronto approved Peru AI investment assuming governance. Discovery of 3 ungoverned models triggers: internal audit escalation, OSFI notification, potential capital charge. Toronto position: FREEZE all Peru AI until governance implemented. This kills $45M ROI and competitive position vs BCP.'),
      ln('ceo-strat','phase2','flag',2500,'FLAG — COMPETITIVE URGENCY. BCP: 12 AI models. Interbank: 8. BBVA Peru: 6. Scotiabank: 3. Freezing = falling further behind. Governance must be implemented WITHOUT stopping deployment. Need retroactive governance for 3 live models + prospective for 44 in development. SBS: 90 days. Toronto: immediate. Board meets in 30 days.'),
      ln('board-gov','phase3','proposal',2000,'PROPOSED: DATACENDIA BOARD AI GOVERNANCE. (1) AI REGISTRY: 47 models catalogued with risk, owner, purpose, data. (2) BOARD DASHBOARD: per-model governance evidence. (3) SBS: Res. 272-2017 evidence per model. (4) TORONTO: OSFI E-23 mapping. (5) PER-DECISION: every credit decision, fraud alert, chatbot response — sealed. Board gets governance reports, not just spend reports.'),
      ln('toronto-hq','phase3','resolution',2500,'DISSENT WITHDRAWN. Datacendia satisfies SBS Res. 272-2017 AND OSFI E-23 without freezing deployment. 3 production models governed retroactively in 30 days. 44 development models get governance-by-design. Toronto lifts freeze. SBS evidence ready in 60 days.'),
    ],
    receiptTemplate: rc('brd','Merkle Tree Root (47 AI models + Board oversight + SBS + OSFI)','Board AI Governance','BOARD-GOVERNED','SBS Res. 272-2017 + OSFI E-23',['Board Governance Agent','CEO Strategy Agent','SBS Regulatory Agent','Toronto HQ Agent'],'Scotiabank Peru Board — Enterprise AI Governance Sealed','47 AI models governed. SBS Res. 272-2017 compliance. OSFI E-23 alignment. Deployment freeze lifted.','Board Resolution → AI Registry → Risk Classification → Per-Model Governance → SBS Evidence → OSFI → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents demonstrate why Scotiabank Peru\'s board needs AI governance — $45M investment with zero evidence for SBS or Toronto.',
    phaseLabels: ['Board Governance Gap & SBS Risk', 'Toronto HQ Conflict & Competition', 'Enterprise AI Governance Framework'],
  },

  // 2 — CRO: MODEL RISK MANAGEMENT
  // Role: Chief Risk Officer | Level: C-Suite
  {
    id: 'cro-model-risk', title: 'CRO — AI Model Risk Management',
    subtitle: 'Credit scoring · SBS Res. 11356-2008 · Basel III · Model validation · Disparate impact',
    banner: 'Credit scoring AI approves 12,000 loans/day — never independently validated. SBS requires model risk management. Geographic and age bias detected: provincial Peru denied at 2-3x Lima rates.',
    risk: 'Critical', scenarioNum: '02', icon: 'shield', color: 'text-amber-400',
    agents: [ag('cro-risk','CRO Risk Agent','Model Risk Management','🛡️','text-amber-400','amber-500'), ag('credit-model','Credit Model Agent','Scoring & Decisioning','📊','text-blue-400','blue-500'), ag('sbs-model','SBS Model Agent','Regulatory Validation','⚖️','text-red-400','red-500'), ag('fairness','Fairness Agent','Bias & Disparate Impact','⚖️','text-emerald-400','emerald-500')],
    connectors: [cn('Credit Engine','connected','Scoring','calculator','12K decisions/day — 847 features, XGBoost'), cn('SBS MRM','connected','Model Risk','shield','Res. 11356-2008'), cn('Bias Monitor','connected','Fairness','scale','7 categories — 2 flagged'), cn('Validation','syncing','Review','check-circle','Last AI validation: NEVER')],
    script: [
      ln('cro-risk','phase1','warning',800,'MODEL RISK CRISIS. Credit AI: XGBoost, 847 features, 12K decisions/day, S/. 8.2B annual volume. Deployed 14 months ago. Independent validation: NEVER. Traditional scorecards validated annually per SBS Res. 11356-2008. AI treated as "tech enhancement" — no validation protocol. 5.04 MILLION unvalidated decisions.'),
      ln('fairness','phase1','analysis',2500,'BIAS DETECTED. 2.16M decisions analysed: Gender — Male 71.2%, Female 63.8% (ratio 0.90). Geography — Lima 69.4%, Provincial 54.1% (ratio 0.78 — BELOW THRESHOLD). Age — 25-34: 74.8%, 55+: 51.2% (ratio 0.68 — CRITICAL). AI amplifies Peru\'s systemic biases at 12K decisions/day.'),
      ln('sbs-model','phase2','dissent',2000,'DISSENT — SBS IMMINENT. Res. 11356-2008: model inventory, independent validation before production, ongoing monitoring, board reporting. Scotiabank has NONE for AI. Penalty: operational restriction + capital surcharge. Geographic bias (0.78): lending license conditions. CRO personal liability under Ley de Bancos Art. 361.'),
      ln('credit-model','phase2','flag',2500,'FLAG — BUSINESS IMPACT. AI: 12K apps/day in 200ms. Manual: 45 min/app = 320/day. Disabling AI = 9,000-hour daily backlog. Competitors maintain AI lending. Governance must run ON the live model, not replace it.'),
      ln('cro-risk','phase3','proposal',2000,'PROPOSED: (1) RETROACTIVE: analyse 5.04M decisions for bias and drift. (2) REAL-TIME: per-decision evidence — features, confidence, bias check. (3) SBS: Res. 11356-2008 docs auto-generated. (4) FAIRNESS: geographic (0.78→0.92) and age (0.68→0.88) corrected. (5) CRO DASHBOARD: model health, bias, regulatory readiness.'),
      ln('sbs-model','phase3','resolution',2500,'DISSENT WITHDRAWN. Governance provides SBS-ready evidence without disabling AI. Geographic bias corrected 0.78→0.92. Age 0.68→0.88. 340K potentially discriminatory decisions identified with remediation plan. CRO liability mitigated.'),
    ],
    receiptTemplate: rc('cro','Merkle Tree Root (5.04M decisions + Bias monitoring + Model validation + SBS)','Model Risk Management','CRO-VALIDATED','SBS Res. 11356-2008 + Basel III',['CRO Risk Agent','Credit Model Agent','SBS Model Agent','Fairness Agent'],'Scotiabank Peru CRO — Credit AI Model Risk Governed','12K daily decisions governed. Geographic bias 0.78→0.92. Age bias 0.68→0.88. SBS compliance achieved.','Application → AI Score → Feature Attribution → Bias Check → Confidence → Decision Sealed → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents demonstrate why the CRO needs AI model risk governance — 12K daily credit decisions with no validation and detected bias.',
    phaseLabels: ['Model Risk Gap & Bias Detection', 'SBS Examination & Business Impact', 'CRO Governance Framework'],
  },

  // 3 — CCO: AML/KYC AI
  // Role: Chief Compliance Officer | Level: C-Suite
  {
    id: 'cco-aml-kyc', title: 'CCO — AML/KYC AI Compliance',
    subtitle: 'UIF Peru · SBS Res. 2660-2015 · FATF · Suspicious activity · False positives',
    banner: 'AML AI generates 4,200 alerts/day. 94% false positives. Compliance team drowns while 3 real laundering cases (S/. 47M) slip through. UIF investigation pending.',
    risk: 'Critical', scenarioNum: '03', icon: 'search', color: 'text-red-400',
    agents: [ag('cco-aml','CCO Compliance Agent','AML/KYC Oversight','🔍','text-red-400','red-500'), ag('uif-agent','UIF Agent','Financial Intelligence','🏛️','text-amber-400','amber-500'), ag('alert-ai','Alert AI Agent','Transaction Monitoring','🔔','text-blue-400','blue-500'), ag('ops-aml','AML Ops Agent','Investigation Workflow','📋','text-emerald-400','emerald-500')],
    connectors: [cn('Transaction Monitor','connected','AML','search','4,200 alerts/day — 94% FP'), cn('UIF Peru','connected','Intelligence','shield','SBS Res. 2660-2015'), cn('KYC Database','connected','Identity','users','3.8M customers'), cn('FATF Watchlist','syncing','Sanctions','alert-triangle','FATF + OFAC + Peru PEP')],
    script: [
      ln('cco-aml','phase1','warning',800,'AML GOVERNANCE FAILURE. 2.1M daily transactions. 4,200 alerts/day, 94% false positives = 3,948 false alerts. True positives: 252. BUT: 3 significant laundering cases (S/. 47M) were generated as alerts then CLOSED by overwhelmed investigators. AI detected the crime. Human, drowning in alerts, dismissed it.'),
      ln('uif-agent','phase1','analysis',2500,'UIF INVESTIGATION. UIF-Peru found S/. 47M laundering via inter-bank analysis. Scotiabank generated alerts on all 3 accounts — closed in 4 hours (true cases need 6.2h). SBS Res. 2660-2015 Art. 12: must demonstrate adequate investigation. Penalty: 100 UIT/unreported transaction + CCO personal liability.'),
      ln('ops-aml','phase2','dissent',2000,'DISSENT — CAPACITY. 28 investigators. 4,200 alerts/day = 150/person. Proper investigation needs 312 investigators. Budget: 28. System DESIGNED to fail. Deploying AI that generates unmanageable volume without governance = willful blindness under AML law.'),
      ln('alert-ai','phase2','flag',2500,'FLAG — AI CAN IMPROVE. 94% FP because: static thresholds, no feedback loop, no contextual scoring. With governance: AI learns from 3,948 daily FP closures to REDUCE future FPs. Without sealed evidence, AI has no training signal. Governance creates the feedback loop.'),
      ln('cco-aml','phase3','proposal',2000,'PROPOSED: (1) ALERT GOVERNANCE: every alert sealed with risk score, triggers, context. (2) INVESTIGATION EVIDENCE: closure decision sealed with time, evidence, rationale. (3) FP FEEDBACK: sealed data feeds AI — FP rate 94%→71% in 90 days. (4) PRIORITY: high-confidence alerts escalated. (5) CCO DASHBOARD.'),
      ln('uif-agent','phase3','resolution',2500,'DISSENT WITHDRAWN. FP 94%→71% = 966 fewer daily false alerts. 354 hours/day freed. Priority scoring ensures S/. 47M cases get attention. UIF requirements met. CCO liability mitigated.'),
    ],
    receiptTemplate: rc('cco','Merkle Tree Root (4,200 daily alerts + Investigation evidence + UIF + FP feedback)','AML/KYC Compliance','UIF-GOVERNED','SBS Res. 2660-2015 + FATF',['CCO Compliance Agent','UIF Agent','Alert AI Agent','AML Ops Agent'],'Scotiabank Peru CCO — AML AI Governed, UIF-Ready','4,200 daily alerts governed. FP 94%→71%. S/. 47M cases prevented. UIF evidence sealed.','Transaction → AI Alert → Risk Score → Investigation → Closure → UIF Report → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents demonstrate why the CCO needs AML AI governance — 94% false positives let S/. 47M laundering through.',
    phaseLabels: ['AML Alert Failure & UIF', 'Investigator Overload & Blindness', 'CCO Governance Framework'],
  },

  // 4 — VP RETAIL: CREDIT DECISIONING
  // Role: VP Retail Banking | Level: Senior VP
  {
    id: 'vp-retail-credit', title: 'VP Retail Banking — AI Credit Decisioning',
    subtitle: 'Consumer lending · Adverse action · SBS Reglamento · Financial inclusion · INDECOPI',
    banner: 'AI denies 3,400 credit applications daily with no explanation. INDECOPI complaints spike 340%. Provincial Peru denied at 2-3x Lima rates.',
    risk: 'High', scenarioNum: '04', icon: 'credit-card', color: 'text-blue-400',
    agents: [ag('vp-retail','VP Retail Agent','Consumer Lending','💳','text-blue-400','blue-500'), ag('adverse','Adverse Action Agent','Denial Explanations','📋','text-red-400','red-500'), ag('inclusion','Inclusion Agent','Underserved Markets','🌍','text-emerald-400','emerald-500'), ag('cx','CX Agent','Satisfaction','⭐','text-amber-400','amber-500')],
    connectors: [cn('Credit Engine','connected','Decisioning','credit-card','8,400 approvals + 3,400 denials daily'), cn('SBS Créditos','connected','Regulation','shield','Reglamento de Créditos'), cn('INDECOPI','connected','Consumer','users','Complaints: 340% increase'), cn('Inclusion Data','syncing','Demographics','bar-chart','Denial rates by department')],
    script: [
      ln('vp-retail','phase1','analysis',800,'RETAIL AI. 11,800 daily applications. AI approves 8,400, denies 3,400 (71.2%). Processing: 8 seconds vs 3-5 days manual. AI INCREASED lending 6.4pp = S/. 2.1B additional/year. Problem: every denial is "did not meet criteria." No reasons, no score, no remediation. Customer cannot understand or contest.'),
      ln('adverse','phase1','warning',2500,'ADVERSE ACTION. SBS Reglamento de Créditos: clear criteria, disclosure to applicants, decision records. INDECOPI: consumers have right to know WHY. 847 complaints in 6 months. Scotiabank provides "AI: DENY." Cannot explain what AI considered or what applicant could change. Exposure: S/. 2.3M fines.'),
      ln('inclusion','phase2','dissent',2000,'DISSENT — INCLUSION CRISIS. Denial by region: Lima 24%, Arequipa 31%, Cusco 42%, Loreto 58%, Puno 61%, Rural 67%. AI trained on Lima-centric data. Provincial applicants with equivalent creditworthiness denied 2-3x. AI EXCLUDES underserved Peru. Contradicts SBS Plan Nacional de Inclusión Financiera.'),
      ln('cx','phase2','flag',2500,'FLAG — ATTRITION. Denied without explanation: 87% never apply again, 43% close accounts, 62% share negative experience. NPS for denied: -67. BCP provides denial reasons + remediation — capturing Scotiabank rejects.'),
      ln('vp-retail','phase3','proposal',2000,'PROPOSED: (1) PER-DECISION: top 5 factors, score, remediation. (2) INCLUSION: geographic approval rates real-time. (3) ADVERSE ACTION: SBS/INDECOPI letters auto-generated. (4) FAIRNESS: provincial bias corrected. (5) JOURNEY: denied applicants get path to approval.'),
      ln('inclusion','phase3','resolution',2500,'DISSENT WITHDRAWN. Provincial gap 2-3x→1.2x within 90 days. 340K additional Peruvians gain credit annually. INDECOPI complaints -78%. Attrition 87%→34%.'),
    ],
    receiptTemplate: rc('vpr','Merkle Tree Root (11,800 daily decisions + Adverse action + Geographic fairness)','Credit Governance','INCLUSION-GOVERNED','SBS + INDECOPI — per-decision explanation',['VP Retail Agent','Adverse Action Agent','Inclusion Agent','CX Agent'],'Scotiabank VP Retail — Credit AI Governed, Inclusion-First','11,800 daily decisions governed. Denials explained. Geographic bias corrected. 340K gain access.','Application → AI Score → Top 5 Factors → Fairness Check → Adverse Action → Remediation → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: 3,400 unexplained daily denials driving INDECOPI complaints and financial exclusion.',
    phaseLabels: ['Unexplained Denials & Complaints', 'Geographic Bias & Exclusion', 'Per-Decision Governance'],
  },

  // 5 — VP CORPORATE: TRADE FINANCE AI
  // Role: VP Corporate Banking | Level: Senior VP
  {
    id: 'vp-corp-trade', title: 'VP Corporate Banking — Trade Finance AI',
    subtitle: 'Letter of credit · Sanctions · SUNAT · BCRP · Export compliance · OFAC',
    banner: 'AI approves $12M letter of credit for mining exporter. Post-issuance: beneficiary linked to sanctioned entity via nested ownership. AI only matched names, not ownership chains.',
    risk: 'Critical', scenarioNum: '05', icon: 'building', color: 'text-purple-400',
    agents: [ag('vp-corp','VP Corporate Agent','Trade Finance','🏢','text-purple-400','purple-500'), ag('sanctions','Sanctions Agent','OFAC/BCRP','🚫','text-red-400','red-500'), ag('trade-ops','Trade Ops Agent','LC Processing','📦','text-blue-400','blue-500'), ag('sunat-trade','SUNAT Agent','Customs & Export','🏛️','text-amber-400','amber-500')],
    connectors: [cn('Trade Finance AI','connected','LC','building','$2.3B volume — 4,200 LCs/year'), cn('Sanctions Screen','connected','OFAC/BCRP','shield','OFAC SDN + BCRP + PEP'), cn('Ownership Graph','connected','UBO','git-branch','Beneficial ownership — 3 levels'), cn('SUNAT Customs','syncing','Export','truck','Mining exports HS 2603/2616')],
    script: [
      ln('vp-corp','phase1','analysis',800,'TRADE FINANCE AI. $2.3B volume, 4,200 LCs/year. AI processes in 4h vs 3-5 days manual. AI approved $12M LC for Minera del Pacífico — copper export to China. 72h post-issuance: 40% shareholder is BVI entity whose UBO is on OFAC SDN list. AI screened company name only. Not ownership chain.'),
      ln('sanctions','phase1','warning',2500,'SANCTIONS EXPOSURE. OFAC: civil penalty up to transaction value ($12M). BCRP additional sanctions. If pattern: correspondent banking restrictions — cutting Peru from USD clearing. Toronto OSFI notification required. Name-matching alone is NOT sanctions compliance.'),
      ln('trade-ops','phase2','dissent',2000,'DISSENT — SCALE. 4,200 LCs/year. Avg ownership: 3.2 levels. Manual UBO: 2-4h per LC. Need 34 analysts; have 12. AI deployed BECAUSE manual couldn\'t scale. But ownership analysis was "Phase 2" — never built. Running Phase 1 for 11 months.'),
      ln('sunat-trade','phase2','flag',2500,'FLAG — EXPORT CHAIN. Copper already shipped. SUNAT declaration lists counterparty. OFAC penalty triggers SUNAT investigation of ALL Scotiabank mining exports. Peru mining sector depends on trade finance — disruption risk is systemic.'),
      ln('vp-corp','phase3','proposal',2000,'PROPOSED: (1) OWNERSHIP GRAPH: AI analyses UBO to 5 levels. (2) SANCTIONS DEPTH: screen ownership chains, directors, related entities. (3) PER-LC SEAL: counterparty screening, sanctions analysis, export classification, risk score. (4) RETROACTIVE: review 4,200 LCs for nested exposure. (5) MONITORING: ownership changes trigger re-screening.'),
      ln('sanctions','phase3','resolution',2500,'DISSENT WITHDRAWN. Ownership analysis adds 45min (4h→4h45m — 80% faster than manual). Retroactive audit: 7 additional sanctions-adjacent counterparties found. OFAC voluntary self-disclosure recommended. Future exposure prevented.'),
    ],
    receiptTemplate: rc('crp','Merkle Tree Root (4,200 LCs + Ownership graph + Sanctions + SUNAT)','Trade Finance Compliance','SANCTIONS-GOVERNED','OFAC + BCRP + SUNAT — UBO to 5 levels',['VP Corporate Agent','Sanctions Agent','Trade Ops Agent','SUNAT Agent'],'Scotiabank VP Corporate — Trade Finance AI Governed','4,200 LCs governed with 5-level ownership. 7 additional exposures found. OFAC compliance achieved.','LC App → Counterparty → Ownership (5 levels) → Sanctions → SUNAT → Risk Score → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: $12M LC approved for sanctioned-entity-linked counterparty via nested ownership.',
    phaseLabels: ['Sanctions Failure & OFAC', 'Ownership Gap & Export Risk', 'Trade Finance Governance'],
  },

  // 6 — VP WEALTH: INVESTMENT SUITABILITY
  // Role: VP Wealth Management | Level: Senior VP
  {
    id: 'vp-wealth-reco', title: 'VP Wealth Management — AI Investment Suitability',
    subtitle: 'SMV · Fiduciary duty · Risk profiling · Elderly investors · Suitability',
    banner: 'Wealth AI recommends high-risk structured products to 72-year-old retiree. Portfolio drops 34%. SMV investigation: no suitability evidence. AI optimised for returns, not client protection.',
    risk: 'Critical', scenarioNum: '06', icon: 'trending-up', color: 'text-emerald-400',
    agents: [ag('vp-wealth','VP Wealth Agent','Investment Strategy','📈','text-emerald-400','emerald-500'), ag('smv-suit','SMV Suitability Agent','Securities Regulation','⚖️','text-red-400','red-500'), ag('client-prot','Client Protection Agent','Elderly & Vulnerable','🛡️','text-amber-400','amber-500'), ag('portfolio-ai','Portfolio AI Agent','Recommendation Engine','🤖','text-blue-400','blue-500')],
    connectors: [cn('Wealth AI','connected','Recommendations','trending-up','12,400 clients — AI-driven allocation'), cn('SMV Peru','connected','Securities','shield','Suitability requirements'), cn('Client Profiles','connected','KYP','users','Risk tolerance, age, income'), cn('Product Risk','syncing','Instruments','database','340 products — 47 unclassified')],
    script: [
      ln('vp-wealth','phase1','analysis',800,'WEALTH AI FAILURE. 12,400 clients, S/. 8.7B AUM. Client #S-7291: María Elena Gutiérrez, 72, retired teacher, S/. 4,200/month pension. Savings: S/. 780K. Risk profile: CONSERVATIVE. AI recommendation: 35% structured notes linked to EM commodities. 6 months later: -34%. Client loses S/. 92,820. Retirement destroyed. AI optimised for return, not suitability.'),
      ln('smv-suit','phase1','warning',2500,'SMV VIOLATION. SMV suitability requirements: recommendations must match risk profile, horizon, financial situation. 72-year-old conservative retiree in high-risk structured notes = clear violation. SMV cannot find suitability evidence. Penalty: fine + license conditions for wealth operations.'),
      ln('client-prot','phase2','dissent',2000,'DISSENT — SYSTEMIC. María Elena not alone. 847 clients 65+ have allocations exceeding risk profile. 2,340 total clients have mismatched recommendations. AI treats risk profile as input (15% weight) not constraint. Bullish market outlook (40%) overrides conservative profile. Fundamentally broken for vulnerable clients.'),
      ln('portfolio-ai','phase2','flag',2500,'FLAG — DESIGN FLAW. Objective: maximise risk-adjusted returns. Risk profile: 15% weight. Market outlook: 40%. Historical: 45%. Bullish commodities OVERRODE conservative profile. AI saw opportunity. AI did not see 72-year-old who cannot recover from 34% loss. Suitability must be HARD CONSTRAINT, not weighted input.'),
      ln('vp-wealth','phase3','proposal',2000,'PROPOSED: (1) SUITABILITY GATE: risk profile = hard constraint, no override. (2) ELDERLY PROTECTION: enhanced review for 65+ — income, liquidity, recovery horizon. (3) PER-RECOMMENDATION SEAL: suitability check, risk match, situation analysis. (4) SMV EVIDENCE per recommendation. (5) ADVISOR ALERTS before client presentation.'),
      ln('smv-suit','phase3','resolution',2500,'DISSENT WITHDRAWN. Suitability gate prevents ALL risk-profile violations. 847 elderly portfolios flagged for rebalancing. 2,340 mismatches corrected. SMV evidence per recommendation. María Elena: remediation fund created.'),
    ],
    receiptTemplate: rc('wlt','Merkle Tree Root (12,400 clients + Suitability + Risk profiles + SMV)','Investment Suitability','SUITABILITY-GOVERNED','SMV — risk profile as hard constraint',['VP Wealth Agent','SMV Suitability Agent','Client Protection Agent','Portfolio AI Agent'],'Scotiabank VP Wealth — AI Suitability-Governed','12,400 clients governed. 847 elderly rebalanced. 2,340 mismatches corrected. SMV evidence per recommendation.','Client Profile → Risk Assessment → AI Recommendation → Suitability Gate → Elderly Check → Advisor Review → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: 72-year-old retiree loses S/. 92K from unsuitable AI recommendation.',
    phaseLabels: ['Suitability Failure & Elderly Impact', 'Systemic Mismatch & Design Flaw', 'Suitability-First Governance'],
  },

  // 7 — CISO: CYBERSECURITY AI
  // Role: Chief Information Security Officer | Level: C-Suite
  {
    id: 'ciso-cybersec', title: 'CISO — AI Cybersecurity Governance',
    subtitle: 'SOC AI · Threat detection · SBS Res. 504-2021 · Ransomware · Incident response',
    banner: 'SOC AI processes 2.8M events/day. Classifies ransomware as "routine update." 847 servers encrypted. 72-hour outage. SBS and Toronto demand the AI\'s decision trail — it doesn\'t exist.',
    risk: 'Critical', scenarioNum: '07', icon: 'lock', color: 'text-cyan-400',
    agents: [ag('ciso','CISO Agent','Security Operations','🔒','text-cyan-400','cyan-500'), ag('threat-ai','Threat AI Agent','Detection','🎯','text-red-400','red-500'), ag('sbs-cyber','SBS Cyber Agent','Res. 504-2021','🏛️','text-amber-400','amber-500'), ag('incident','Incident Agent','Recovery & Forensics','🚨','text-blue-400','blue-500')],
    connectors: [cn('SOC AI','connected','Threat Detection','lock','2.8M events/day — ML classification'), cn('SBS Cyber','connected','Regulation','shield','Res. 504-2021'), cn('SIEM','connected','Logs','database','Real-time correlation'), cn('Toronto SOC','syncing','Global','globe','Scotiabank Global Security')],
    script: [
      ln('ciso','phase1','warning',800,'SOC AI FAILURE. 2.8M events/day. Tuesday 2:47 AM: encrypted payload via vendor VPN. AI: "routine update — BENIGN." It was LockBit 3.0 ransomware. 4:12 AM: 847 servers encrypted. Core banking offline. ATMs down. Mobile down. 72-hour outage. $8.4M direct + $34M business impact. AI confidence: 94% benign. No governance to flag that 94% on VPN payload at 2:47 AM deserves human review.'),
      ln('threat-ai','phase1','analysis',2500,'AI FORENSICS. Classified benign because: (1) trusted vendor IP (allowlisted) (2) file signature matched vendor updates (3) timing matched update window. Attackers crafted adversarial payload to match vendor patterns. 94% confidence. No evidence trail of what AI considered or why.'),
      ln('sbs-cyber','phase2','dissent',2000,'DISSENT — SBS Res. 504-2021 Art. 8: "comprehensive cybersecurity risk management including AI with documented decisions." Art. 12: SBS notification within 2 hours. Art. 15: post-incident with AI performance analysis. SBS demands: AI classification log, why benign, human oversight, adversarial testing. Scotiabank has: "BENIGN." Nothing else.'),
      ln('incident','phase2','flag',2500,'FLAG — TORONTO MANDATE. 72h recovery. Toronto post-mortem: "Peru relied exclusively on AI without governance. Global standard: AI + human review for external events. Peru didn\'t implement." Toronto: all Peru SOC decisions must be governed within 60 days or manual-only operations.'),
      ln('ciso','phase3','proposal',2000,'PROPOSED: (1) PER-EVENT: confidence score, factors, alternatives. (2) THRESHOLDS: <97% confidence on external events = human escalation. (3) ADVERSARIAL: continuous testing against evasion. (4) SBS: Res. 504-2021 evidence auto-generated. (5) FORENSIC READINESS: complete AI trail for any event.'),
      ln('sbs-cyber','phase3','resolution',2500,'DISSENT WITHDRAWN. Governance would have escalated ransomware — 94% from VPN at 2:47 AM = below threshold. Human review: 15 min to identify. Attack contained before encryption. $42M prevented. SBS + Toronto satisfied.'),
    ],
    receiptTemplate: rc('cis','Merkle Tree Root (2.8M events + Classifications + Confidence + SBS)','Cybersecurity Governance','SOC-GOVERNED','SBS Res. 504-2021 — per-event evidence',['CISO Agent','Threat AI Agent','SBS Cyber Agent','Incident Agent'],'Scotiabank CISO — SOC AI Governed, Adversarial-Resistant','2.8M daily events governed. Confidence thresholds. Adversarial monitoring. $42M loss prevented.','Event → AI Classification → Confidence → Threshold → Escalation → Sealed → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: ransomware classified as "routine update" causes 72-hour bank outage.',
    phaseLabels: ['Ransomware Miss & Forensics', 'SBS Regulation & Global Mandate', 'SOC Governance Framework'],
  },

  // 8 — HEAD OF HR: HIRING AI
  // Role: Head of Human Resources | Level: VP
  {
    id: 'hr-hiring-ai', title: 'Head of HR — AI Hiring & Recruitment Bias',
    subtitle: 'CV screening · Gender bias · Peru Ley 30709 · Age discrimination · SUNAFIL',
    banner: 'AI screens 34,000 CVs annually. Rejects 73% of female tech applicants vs 41% male. Indigenous surnames rejected at 1.7x rate. SUNAFIL investigation for systematic discrimination.',
    risk: 'High', scenarioNum: '08', icon: 'users', color: 'text-pink-400',
    agents: [ag('hr-head','HR Head Agent','Talent Strategy','👥','text-pink-400','pink-500'), ag('sunafil','SUNAFIL Agent','Labor Inspection','⚖️','text-red-400','red-500'), ag('dei','DEI Agent','Diversity & Inclusion','🌍','text-emerald-400','emerald-500'), ag('screen-ai','Screening AI Agent','CV Processing','🤖','text-blue-400','blue-500')],
    connectors: [cn('Screening AI','connected','Recruitment','users','34K CVs/year — NLP scoring'), cn('SUNAFIL','connected','Labor','shield','Ley 30709: gender equity'), cn('Hiring Data','connected','Analytics','bar-chart','Gender, age, university data'), cn('Toronto HR','syncing','Global DEI','globe','Scotiabank DEI standards')],
    script: [
      ln('hr-head','phase1','analysis',800,'HR AI. 34,000 CVs/year, 420 positions. AI rejects 65% initially. DISCOVERY: tech roles — Female rejection: 73%. Male: 41%. Same qualifications. Over 45: 81% rejection. Under 35: 38%. AI trained on 10 years of data when tech team was 84% male, average age 32.'),
      ln('sunafil','phase1','warning',2500,'SUNAFIL. Ley 30709 prohibits gender discrimination. DS 002-2018-TR: prevent gender bias. SUNAFIL finding: systematic AI disadvantage for women. Fine: 52.53 UIT/violation. 34K applicants × 2 years = class action exposure: S/. 8-15M.'),
      ln('dei','phase2','dissent',2000,'DISSENT — NOT JUST GENDER. (1) University: top 3 Lima schools 4.2x advancement rate vs provincial. (2) Name: Quechua/Aymara surnames 0.6x rate. (3) Address: San Isidro/Miraflores 2.1x vs Comas/SJL. AI encodes every socioeconomic bias in Peru\'s history. Toronto DEI commitment violated by AI Toronto approved.'),
      ln('screen-ai','phase2','flag',2500,'FLAG — AI DESIGN. Trained on: historical hires (84% male) + performance reviews (managers rated "culture fit" = similarity). AI learned "success = existing employees." Working as designed on biased data. Not a bug — governance is absent.'),
      ln('hr-head','phase3','proposal',2000,'PROPOSED: (1) BLIND SCREENING: gender, age, name, address, photo, university name removed. (2) BIAS MONITORING: real-time rates across all categories. (3) PER-DECISION SEAL: factors considered, excluded, bias check. (4) SUNAFIL evidence. (5) TORONTO DEI alignment.'),
      ln('sunafil','phase3','resolution',2500,'DISSENT WITHDRAWN. Blind screening eliminates gender gap within 2 hiring cycles. Provincial university bias corrected. Name bias eliminated. SUNAFIL evidence ready. Toronto DEI achieved through governance, not quotas.'),
    ],
    receiptTemplate: rc('hrs','Merkle Tree Root (34K CVs + Blind screening + Bias monitoring + SUNAFIL)','HR AI Compliance','BIAS-GOVERNED','Ley 30709 + DS 002-2018 — blind screening',['HR Head Agent','SUNAFIL Agent','DEI Agent','Screening AI Agent'],'Scotiabank HR — Hiring AI Governed, Bias-Free','34K CVs governed. Gender gap eliminated. Name/address bias removed. SUNAFIL compliant.','CV Received → Blind Processing → AI Score → Bias Check → Decision Sealed → SUNAFIL Evidence → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: 73% female tech rejection rate from biased AI training data.',
    phaseLabels: ['Gender & Age Bias Discovery', 'Systemic Discrimination & DEI', 'Blind Screening Governance'],
  },

  // 9 — HEAD OF OPS: PROCESS AUTOMATION AI
  // Role: Head of Operations | Level: VP
  {
    id: 'ops-rpa-ai', title: 'Head of Operations — AI Process Automation',
    subtitle: 'RPA · Loan processing · Error propagation · SBS operational risk · Customer impact',
    banner: 'AI-powered loan processing automates 89% of back-office operations. Undetected logic error processes 12,400 mortgage payments incorrectly for 6 weeks. S/. 34M in customer overcharges.',
    risk: 'High', scenarioNum: '09', icon: 'settings', color: 'text-orange-400',
    agents: [ag('ops-head','Ops Head Agent','Process Management','⚙️','text-orange-400','orange-500'), ag('quality','Quality Agent','Error Detection','✅','text-emerald-400','emerald-500'), ag('sbs-ops','SBS Ops Agent','Operational Risk','🏛️','text-red-400','red-500'), ag('customer','Customer Impact Agent','Remediation','👤','text-blue-400','blue-500')],
    connectors: [cn('Process AI','connected','Automation','settings','89% automated — 2.4M transactions/month'), cn('SBS OpRisk','connected','Regulation','shield','Operational risk framework'), cn('QA Pipeline','connected','Testing','check-circle','Automated testing — 340 test cases'), cn('Customer DB','syncing','Impact','users','3.8M accounts — impact tracking')],
    script: [
      ln('ops-head','phase1','analysis',800,'AUTOMATION FAILURE. AI-powered RPA handles 89% of back-office. Mortgage payment processing: AI calculates monthly payments from amortisation schedules. Software update introduced rounding logic change. AI now rounds UP instead of to nearest cent. Average overcharge: S/. 27/payment. Small enough to miss QA. 12,400 mortgages × 6 weekly cycles = 74,400 incorrect payments. Total overcharge: S/. 2.01M. Detected by customer complaint — not by monitoring.'),
      ln('quality','phase1','warning',2500,'QA GAP. 340 test cases for mortgage processing. None tested rounding to cent-level precision after updates. Test cases: payment calculated correctly (±S/. 1 tolerance). Overcharge of S/. 27 within tolerance. QA PASSED a broken process. Without per-transaction governance: impossible to detect S/. 27 drift across 12,400 accounts.'),
      ln('sbs-ops','phase2','dissent',2000,'DISSENT — SBS OPERATIONAL RISK. SBS requires: operational risk management for automated processes, change management documentation, impact assessment. Scotiabank: software update deployed without governance evidence of what changed, what was tested, what the impact threshold was. If S/. 27/payment is within tolerance, what IS the threshold? It\'s undefined. SBS finding: inadequate operational risk controls.'),
      ln('customer','phase2','flag',2500,'FLAG — CUSTOMER IMPACT. 12,400 affected customers. Remediation: S/. 2.01M in refunds + interest. But: 847 customers had auto-debit — overcharge caused 234 overdraft fees at other banks. 156 customers missed other bill payments. Customer trust: catastrophic for mortgage holders — their HOME is at stake.'),
      ln('ops-head','phase3','proposal',2000,'PROPOSED: (1) PER-TRANSACTION: every AI calculation sealed with inputs, formula, result. (2) DRIFT DETECTION: statistical monitoring of output distributions — S/. 27 shift detected in <24h. (3) CHANGE GOVERNANCE: every update sealed with before/after comparison. (4) SBS EVIDENCE: operational risk documentation auto-generated. (5) CUSTOMER IMPACT: real-time affected-customer identification.'),
      ln('sbs-ops','phase3','resolution',2500,'DISSENT WITHDRAWN. Drift detection catches S/. 27 overcharge within 24h not 6 weeks. Impact: 2,067 affected payments vs 74,400. Remediation: S/. 56K vs S/. 2.01M. Change governance prevents future unmonitored updates. SBS operational risk satisfied.'),
    ],
    receiptTemplate: rc('ops','Merkle Tree Root (2.4M monthly transactions + Drift detection + Change governance)','Operational Risk','OPS-GOVERNED','SBS OpRisk — per-transaction evidence + drift detection',['Ops Head Agent','Quality Agent','SBS Ops Agent','Customer Impact Agent'],'Scotiabank Ops — Process AI Governed, Drift-Monitored','2.4M monthly transactions governed. Drift detection <24h. Change governance sealed. Customer impact minimised.','Transaction → AI Calculation → Drift Check → Output Sealed → Change Log → SBS Evidence → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: S/. 27 rounding error undetected for 6 weeks across 12,400 mortgages.',
    phaseLabels: ['Automation Error & QA Gap', 'SBS Operational Risk & Customer Impact', 'Per-Transaction Governance'],
  },

  // 10 — VP DIGITAL: CHATBOT GOVERNANCE
  // Role: VP Digital Banking | Level: Senior VP
  {
    id: 'vp-digital-chatbot', title: 'VP Digital Banking — AI Chatbot Governance',
    subtitle: 'Customer service · Hallucination · INDECOPI · Rate misinformation · Binding statements',
    banner: 'AI chatbot tells 3,200 customers their savings rate is 8.5%. Actual rate: 4.2%. Customers deposit S/. 47M based on hallucinated rate. INDECOPI: AI statements are binding representations.',
    risk: 'Critical', scenarioNum: '10', icon: 'message-circle', color: 'text-violet-400',
    agents: [ag('vp-digital','VP Digital Agent','Digital Banking','💬','text-violet-400','violet-500'), ag('indecopi','INDECOPI Agent','Consumer Protection','🛡️','text-red-400','red-500'), ag('product','Product Agent','Rate Accuracy','📊','text-blue-400','blue-500'), ag('legal','Legal Agent','Binding Statements','⚖️','text-amber-400','amber-500')],
    connectors: [cn('AI Chatbot','connected','Customer Service','message-circle','14K queries/day — GPT-powered'), cn('INDECOPI','connected','Consumer','shield','Código de Protección'), cn('Product DB','connected','Rates','database','Current rates and terms'), cn('Conversation Log','syncing','Evidence','file-text','Unstructured text logs')],
    script: [
      ln('vp-digital','phase1','analysis',800,'CHATBOT CRISIS. AI handles 14K queries/day. Customer asks: "What\'s your best savings rate?" Chatbot: "Our Premium Savings account offers 8.5% annual rate with no minimum balance!" WRONG. Actual rate: 4.2%, minimum S/. 10K. AI hallucinated a promotional rate from 2019 training data. 3,200 customers received incorrect rate info over 12 days. S/. 47M deposited based on hallucinated rate.'),
      ln('indecopi','phase1','warning',2500,'INDECOPI. Código de Protección Art. 18: information must be truthful. AI chatbot = bank\'s agent. Hallucinated rate = binding representation. 3,200 customers have legal claim to 8.5% rate. Bank must honour or compensate. Cost to honour: S/. 20.1M/year in rate differential. INDECOPI fine: up to 450 UIT. Class action likely.'),
      ln('product','phase2','dissent',2000,'DISSENT — SCALE. 14K queries/day, chatbot handles 78%. Without AI: 4-hour wait times. But EVERY hallucinated rate creates binding liability. Rate questions: 2,400/day. If 0.8% hallucinate: 19 wrong answers daily. 12-day exposure window created 3,200 affected customers.'),
      ln('legal','phase2','flag',2500,'FLAG — NO EVIDENCE. Conversation logs: unstructured text. No verification trail — impossible to identify all affected customers or what exactly each was told. INDECOPI demands: every conversation where rate was discussed. Scotiabank cannot produce structured evidence. Manual review of 168K conversations (12 days × 14K) = 6 months of work.'),
      ln('vp-digital','phase3','proposal',2000,'PROPOSED: (1) REAL-TIME VERIFICATION: rate/product claims cross-referenced with product DB before response. (2) HALLUCINATION DETECTION: confidence scoring on factual claims. (3) PER-CONVERSATION SEAL: what was said, verified, source cited. (4) INDECOPI EVIDENCE: searchable, structured, per-conversation. (5) AFFECTED CUSTOMER ID: instant identification when issue detected.'),
      ln('indecopi','phase3','resolution',2500,'DISSENT WITHDRAWN. Verification adds 200ms — invisible. 3,200 affected customers identified in hours not months. Rate hallucination eliminated. INDECOPI evidence per conversation. Cost avoidance: S/. 20.1M/year in rate honour + S/. 2.3M fines.'),
    ],
    receiptTemplate: rc('dig','Merkle Tree Root (14K daily conversations + Rate verification + Hallucination detection)','Consumer Protection','CHATBOT-GOVERNED','INDECOPI Código — per-conversation verification',['VP Digital Agent','INDECOPI Agent','Product Agent','Legal Agent'],'Scotiabank VP Digital — Chatbot Governed, Hallucination-Free','14K daily conversations governed. Rate verification real-time. 3,200 affected identified. INDECOPI evidence per conversation.','Query → AI Response → Product DB Verify → Confidence Score → Hallucination Check → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: chatbot tells 3,200 customers wrong savings rate — S/. 47M deposited on hallucinated info.',
    phaseLabels: ['Rate Hallucination & Consumer Impact', 'Binding Statements & Evidence Gap', 'Per-Conversation Governance'],
  },

  // 11 — CDO: DATA GOVERNANCE & PRIVACY
  // Role: Chief Data Officer | Level: C-Suite
  {
    id: 'cdo-data-privacy', title: 'CDO — AI Data Governance & Privacy',
    subtitle: 'APDP · Ley 29733 · Customer profiling · Data lineage · Cross-border transfers',
    banner: 'AI profiling engine shares 3.8M customer profiles with Toronto analytics platform. Peru APDP discovers cross-border transfer without consent. Ley 29733 violation affects entire customer base.',
    risk: 'Critical', scenarioNum: '11', icon: 'database', color: 'text-teal-400',
    agents: [ag('cdo','CDO Agent','Data Strategy','🗄️','text-teal-400','teal-500'), ag('apdp','APDP Agent','Data Protection','🔒','text-red-400','red-500'), ag('analytics','Analytics Agent','Profiling Engine','📊','text-blue-400','blue-500'), ag('toronto-data','Toronto Data Agent','Global Analytics','🌍','text-amber-400','amber-500')],
    connectors: [cn('Customer Data','connected','Profiles','database','3.8M customers — behavioral data'), cn('APDP Peru','connected','Privacy','shield','Ley 29733 data protection'), cn('Toronto Platform','connected','Analytics','globe','Cross-border data pipeline'), cn('Consent DB','syncing','Permissions','check-circle','Consent records — 62% incomplete')],
    script: [
      ln('cdo','phase1','analysis',800,'DATA GOVERNANCE GAP. 3.8M customer profiles. AI profiling engine builds behavioral models: spending patterns, location data, income estimation, lifestyle classification. Data feeds Toronto global analytics for cross-sell modelling. PROBLEM: Ley 29733 (Peru Data Protection) requires explicit consent for profiling and cross-border transfer. Consent records: 62% of customers never consented to profiling. 0% consented to cross-border transfer to Canada. 3.8M profiles sent to Toronto without legal basis.'),
      ln('apdp','phase1','warning',2500,'APDP VIOLATION. Ley 29733 Art. 13: personal data processing requires informed consent. Art. 15: cross-border transfer requires adequate protection + consent. Scotiabank transferred 3.8M profiles to Canada without: (1) individual consent (2) APDP authorisation (3) adequacy assessment. Fine: up to 100 UIT per affected person. 3.8M × 100 UIT = theoretical maximum: catastrophic. Realistic: S/. 50-200M + cease processing order.'),
      ln('toronto-data','phase2','dissent',2000,'DISSENT — BUSINESS CRITICAL. Toronto analytics drives 34% of Peru cross-sell revenue (S/. 124M/year). Models require Peru behavioral data. Stopping transfer = blind cross-sell. Competitors (BCP with local analytics) gain advantage. Toronto position: data essential for global risk models too — stopping affects consolidated reporting.'),
      ln('analytics','phase2','flag',2500,'FLAG — DATA LINEAGE UNKNOWN. AI profiling uses 847 data points per customer. CDO cannot trace: which data points come from which source, which processing has consent basis, which doesn\'t. No data lineage map. APDP asks: "Show us what data you process, where it goes, who consented." CDO answer: "We don\'t know." This is not a technical problem — it\'s a governance problem.'),
      ln('cdo','phase3','proposal',2000,'PROPOSED: (1) DATA LINEAGE: every data point traced from source to use with consent basis. (2) CONSENT GOVERNANCE: per-customer consent status for each processing purpose. (3) CROSS-BORDER: sealed evidence of consent + adequacy for every transfer. (4) PROFILING TRANSPARENCY: per-customer profile sealed with data sources, consent, purpose. (5) APDP EVIDENCE: Ley 29733 compliance per customer.'),
      ln('apdp','phase3','resolution',2500,'DISSENT WITHDRAWN. Data lineage enables selective transfer — only consented data crosses border. Consent campaign: 62%→94% within 90 days. Toronto receives governed data, not ungoverned bulk. APDP evidence per customer. S/. 124M cross-sell revenue preserved with legal basis.'),
    ],
    receiptTemplate: rc('cdo','Merkle Tree Root (3.8M profiles + Data lineage + Consent + Cross-border)','Data Protection','PRIVACY-GOVERNED','Ley 29733 — per-customer consent + lineage',['CDO Agent','APDP Agent','Analytics Agent','Toronto Data Agent'],'Scotiabank CDO — Data Governance, Privacy-Compliant','3.8M profiles governed. Data lineage mapped. Consent 62%→94%. Cross-border transfers legally based.','Customer Data → Lineage Map → Consent Check → Profiling Purpose → Cross-Border Gate → APDP Evidence → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: 3.8M customer profiles transferred to Toronto without consent or APDP authorisation.',
    phaseLabels: ['Cross-Border Transfer & Privacy Gap', 'Business Impact & Data Lineage', 'Per-Customer Privacy Governance'],
  },

  // 12 — VP TREASURY: FX & LIQUIDITY AI
  // Role: VP Treasury | Level: Senior VP
  {
    id: 'vp-treasury-fx', title: 'VP Treasury — AI FX & Liquidity Management',
    subtitle: 'BCRP · FX reserves · Liquidity stress · Algorithmic trading · Market manipulation',
    banner: 'Treasury AI executes $340M in FX trades daily. AI concentrates PEN/USD positions during low-liquidity window. BCRP flags pattern as potential market manipulation. No trade rationale evidence.',
    risk: 'High', scenarioNum: '12', icon: 'bar-chart', color: 'text-yellow-400',
    agents: [ag('vp-treas','VP Treasury Agent','FX & Liquidity','💱','text-yellow-400','yellow-500'), ag('bcrp','BCRP Agent','Central Bank','🏦','text-red-400','red-500'), ag('algo','Algo Trading Agent','Execution AI','⚡','text-blue-400','blue-500'), ag('market','Market Risk Agent','Position Management','📉','text-emerald-400','emerald-500')],
    connectors: [cn('FX AI','connected','Trading','bar-chart','$340M daily — algorithmic execution'), cn('BCRP','connected','Central Bank','landmark','FX intervention monitoring'), cn('Liquidity','connected','Market','trending-up','PEN/USD depth and spread'), cn('Position','syncing','Risk','shield','Net open position limits')],
    script: [
      ln('vp-treas','phase1','analysis',800,'TREASURY AI. $340M daily FX volume. AI optimises execution timing for best rate. PATTERN: AI discovered that executing large PEN/USD orders between 12:30-13:00 (lunch hour, thin liquidity) achieves 2-4 bps better rate. AI concentrated 45% of daily volume in 30-minute window. Over 6 months: S/. 8.4M savings. PROBLEM: BCRP monitors FX market patterns. Concentrated execution in thin liquidity = market impact. BCRP flags Scotiabank pattern.'),
      ln('bcrp','phase1','warning',2500,'BCRP CONCERN. Central bank monitors FX market for manipulation and concentration. Scotiabank pattern: 45% of $340M in 30 minutes of thin liquidity = $153M market impact. BCRP Circular 006-2024: banks must not exploit low-liquidity windows for systematic advantage. Not explicitly illegal — but BCRP has discretion to restrict FX access for banks that distort the market. Loss of BCRP FX window access = catastrophic for Scotiabank Peru treasury.'),
      ln('algo','phase2','dissent',2000,'DISSENT — AI WORKED. S/. 8.4M savings over 6 months. AI found an edge. This is what trading AI is FOR. The market is open during lunch hour. Other banks can trade too. Restricting AI to suboptimal execution times costs shareholders money. My dissent: governance should document the rationale, not prevent the strategy.'),
      ln('market','phase2','flag',2500,'FLAG — SYSTEMIC RISK. Concentrated execution creates hidden risk: if market moves against position during thin liquidity, exit cost is 5-8x normal. One adverse move during concentrated window: $2-4M loss in minutes. AI optimises for average case. Governance must account for tail risk. Also: if BCRP restricts access, ALL FX operations affected — not just lunch-hour trades.'),
      ln('vp-treas','phase3','proposal',2000,'PROPOSED: (1) PER-TRADE GOVERNANCE: every FX execution sealed with: timing rationale, market depth at execution, concentration impact. (2) LIQUIDITY LIMITS: AI constrained from exceeding 20% of daily volume in any 30-min window. (3) BCRP TRANSPARENCY: proactive disclosure of AI execution strategy. (4) TAIL RISK: worst-case scenario documented per concentrated execution. (5) MARKET IMPACT: real-time monitoring of Scotiabank\'s share of FX volume.'),
      ln('bcrp','phase3','resolution',2500,'DISSENT WITHDRAWN. 20% concentration limit preserves 60% of AI\'s rate advantage (S/. 5M/year) while eliminating BCRP concern. Proactive disclosure builds BCRP trust. Trade rationale evidence prevents market manipulation allegation. Tail risk documented.'),
    ],
    receiptTemplate: rc('trs','Merkle Tree Root ($340M daily FX + Trade rationale + BCRP transparency)','Treasury Compliance','FX-GOVERNED','BCRP Circular 006-2024 — per-trade evidence',['VP Treasury Agent','BCRP Agent','Algo Trading Agent','Market Risk Agent'],'Scotiabank Treasury — FX AI Governed, BCRP-Transparent','$340M daily FX governed. Concentration limited. BCRP proactive disclosure. S/. 5M/year preserved.','FX Order → AI Timing → Market Depth → Concentration Check → Trade Sealed → BCRP Evidence → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: FX AI concentrates $153M in thin-liquidity window — BCRP flags potential manipulation.',
    phaseLabels: ['FX Concentration & BCRP Flag', 'AI Edge vs Systemic Risk', 'Per-Trade Governance Framework'],
  },

  // 13 — VP CARDS & PAYMENTS: FRAUD DETECTION
  // Role: VP Cards & Payments | Level: Senior VP
  {
    id: 'vp-cards-fraud', title: 'VP Cards & Payments — AI Fraud Detection',
    subtitle: 'Transaction fraud · False declines · Merchant impact · SBS · Customer friction',
    banner: 'Fraud AI blocks 14,000 transactions daily. 82% are legitimate purchases. Small merchants lose S/. 4.7M monthly from false declines. Customers switch to BCP cards.',
    risk: 'High', scenarioNum: '13', icon: 'credit-card', color: 'text-rose-400',
    agents: [ag('vp-cards','VP Cards Agent','Payments Strategy','💳','text-rose-400','rose-500'), ag('fraud-ai','Fraud AI Agent','Detection Engine','🔍','text-red-400','red-500'), ag('merchant','Merchant Agent','Business Impact','🏪','text-blue-400','blue-500'), ag('cx-cards','CX Agent','Customer Friction','⭐','text-emerald-400','emerald-500')],
    connectors: [cn('Fraud Engine','connected','Detection','credit-card','14K blocks/day — 82% false'), cn('Merchant DB','connected','Impact','building','47K merchants — decline tracking'), cn('Customer CX','connected','Satisfaction','users','NPS tracking per card interaction'), cn('SBS Payments','syncing','Regulation','shield','Payment system oversight')],
    script: [
      ln('vp-cards','phase1','analysis',800,'FRAUD AI. 2.1M card transactions/day. AI blocks 14,000 as potentially fraudulent. Actual fraud rate: 0.12% = 2,520 true frauds/day. AI catches 2,268 (90% detection rate). BUT: 14,000 blocks - 2,268 true = 11,732 false declines daily. False positive rate: 82%. Legitimate customers blocked from purchases 11,732 times/day. Annual false declines: 4.28M legitimate transactions blocked.'),
      ln('merchant','phase1','warning',2500,'MERCHANT IMPACT. False declines hit small merchants hardest. Customer card declined → customer pays cash or uses competitor card → merchant loses sale attribution. 47K Scotiabank merchants in Peru. Small merchants (under S/. 50K monthly): false decline rate 3.2x higher than large merchants. AI learned fraud patterns from large merchant data — small merchant transactions look "unusual." Monthly merchant revenue loss from false declines: S/. 4.7M. 340 merchants have switched to BCP acquiring.'),
      ln('cx-cards','phase2','dissent',2000,'DISSENT — CUSTOMER CHURN. Card declined in a store = humiliation. Customer survey: 34% of falsely declined customers reduce card usage. 12% cancel within 90 days. Annual churn from false declines: 51,200 cards. Revenue loss: S/. 23M/year in interchange + interest. Worse: customer tells 7 people about bad experience. Brand damage compounds. BCP\'s fraud AI has 67% false positive rate — still bad, but 15pp better than Scotiabank.'),
      ln('fraud-ai','phase2','flag',2500,'FLAG — AI TRADE-OFF. Current model tuned for HIGH recall (catch 90% of fraud). Trade-off: high false positives. Reducing false positives to 67% (matching BCP) drops fraud detection to 82%. 8% more fraud gets through = S/. 14M additional annual fraud losses. The question isn\'t "less false positives" — it\'s "which legitimate customer\'s declined purchase is worth catching one more fraud?"'),
      ln('vp-cards','phase3','proposal',2000,'PROPOSED: (1) PER-DECLINE GOVERNANCE: every block sealed with: fraud probability, contributing signals, alternative to blocking (step-up auth). (2) MERCHANT FAIRNESS: small merchant bias corrected with segment-aware thresholds. (3) STEP-UP AUTHENTICATION: instead of blocking — OTP/biometric for medium-risk. (4) CUSTOMER COMMUNICATION: instant SMS with reason + unlock path. (5) SBS EVIDENCE: fraud prevention effectiveness with fairness metrics.'),
      ln('cx-cards','phase3','resolution',2500,'DISSENT WITHDRAWN. Step-up authentication for medium-risk: false declines 82%→54%. Fraud detection maintained at 89%. Merchant revenue restored: S/. 3.1M/month. Customer churn from declines: -62%. Every decline has sealed evidence + instant customer communication.'),
    ],
    receiptTemplate: rc('crd','Merkle Tree Root (2.1M daily transactions + Fraud scoring + Merchant fairness)','Fraud Detection','FRAUD-GOVERNED','SBS Payments — per-decline evidence + step-up',['VP Cards Agent','Fraud AI Agent','Merchant Agent','CX Agent'],'Scotiabank Cards — Fraud AI Governed, Merchant-Fair','2.1M daily transactions governed. False declines 82%→54%. Merchant revenue restored. Fraud detection 89%.','Transaction → Fraud Score → Risk Category → Step-Up/Block → Merchant Check → Customer Notify → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: 82% false positive rate blocks 11,732 legitimate purchases daily.',
    phaseLabels: ['False Decline Crisis & Merchant Impact', 'Customer Churn & AI Trade-offs', 'Step-Up Governance Framework'],
  },

  // 14 — VP SME BANKING: SMALL BUSINESS LENDING AI
  // Role: VP SME Banking | Level: Senior VP
  {
    id: 'vp-sme-lending', title: 'VP SME Banking — Small Business Lending AI',
    subtitle: 'MYPE · Informal economy · SBS financial inclusion · Alternative data · Reactiva Peru',
    banner: 'AI rejects 78% of MYPE (micro/small business) applications because they lack formal financial history. Peru\'s informal economy means 72% of businesses have no bank statements. AI designed for formal economy excludes majority.',
    risk: 'High', scenarioNum: '14', icon: 'store', color: 'text-lime-400',
    agents: [ag('vp-sme','VP SME Agent','Small Business','🏪','text-lime-400','lime-500'), ag('informal','Informal Economy Agent','Alternative Data','📱','text-blue-400','blue-500'), ag('sbs-inc','SBS Inclusion Agent','Financial Inclusion','🌍','text-emerald-400','emerald-500'), ag('risk-sme','SME Risk Agent','Credit Assessment','📊','text-red-400','red-500')],
    connectors: [cn('SME AI','connected','Lending','store','4,200 applications/month — 78% rejection'), cn('SBS Inclusion','connected','Policy','shield','Plan Nacional de Inclusión'), cn('Alternative Data','connected','Sources','smartphone','Mobile payments, utilities, SUNAT'), cn('MYPE Registry','syncing','Businesses','database','2.1M registered MYPEs in Peru')],
    script: [
      ln('vp-sme','phase1','analysis',800,'SME LENDING GAP. 4,200 MYPE applications/month. AI rejection rate: 78%. Reason: AI requires 12 months bank statements, 2 years tax returns, formal financial statements. Peru reality: 72% of MYPEs are informal or semi-formal. No bank statements because they use cash. No tax returns because they\'re below SUNAT thresholds. AI designed for Lima formal businesses excludes: market vendors, provincial shops, agricultural cooperatives — Peru\'s economic backbone.'),
      ln('sbs-inc','phase1','warning',2500,'SBS INCLUSION MANDATE. Plan Nacional de Inclusión Financiera: banks must expand access to underserved segments. SBS measures: MYPE lending volume, geographic reach, product accessibility. Scotiabank MYPE lending: declining 12%/year since AI deployment. BCP using alternative data (mobile payments, utility records) has INCREASED MYPE lending 23%. SBS annual review: Scotiabank flagged for declining inclusion metrics. Reputational + regulatory consequences.'),
      ln('informal','phase2','dissent',2000,'DISSENT — ALTERNATIVE DATA EXISTS. Informal businesses leave digital traces: (1) Yape/Plin mobile payments: 4.2M+ MYPE transactions/month (2) SUNAT: even informal businesses have RUC for small purchases (3) Utility payments: consistent payment = cash flow proxy (4) Supplier references: trade credit history. This data is RICHER than bank statements for informal economy. AI ignores it because model was built on formal economy training data.'),
      ln('risk-sme','phase2','flag',2500,'FLAG — RISK IS MANAGEABLE. Analysis of 847 MYPEs approved via manual exception: default rate 4.2% vs 3.8% for AI-approved formal businesses. Difference: 0.4pp. Revenue from MYPE lending: S/. 34M/year in interest. Default cost of 0.4pp higher rate: S/. 1.4M. NET POSITIVE: S/. 32.6M. AI is rejecting profitable customers because it doesn\'t understand Peru\'s informal economy.'),
      ln('vp-sme','phase3','proposal',2000,'PROPOSED: (1) ALTERNATIVE DATA: mobile payments, utilities, SUNAT micro-records, supplier references integrated into AI. (2) INFORMAL-ECONOMY MODEL: separate scoring model trained on Peru MYPE reality, not Lima formal business data. (3) PER-DECISION: every MYPE assessment sealed with: data sources used, risk score, alternative data considered. (4) SBS INCLUSION: metrics auto-reported. (5) GRADUATED LENDING: small initial loans → build history → increase limits.'),
      ln('sbs-inc','phase3','resolution',2500,'DISSENT WITHDRAWN. Alternative data model: MYPE rejection drops 78%→41%. Default rate: 4.4% (acceptable). 1,500 additional MYPEs access credit monthly. SBS inclusion metrics reverse from decline to growth. S/. 52M additional annual lending revenue. Peru\'s informal economy included, not excluded.'),
    ],
    receiptTemplate: rc('sme','Merkle Tree Root (4,200 MYPE apps + Alternative data + Inclusion metrics)','Financial Inclusion','INCLUSION-GOVERNED','SBS Plan Nacional — alternative data scoring',['VP SME Agent','Informal Economy Agent','SBS Inclusion Agent','SME Risk Agent'],'Scotiabank SME — MYPE AI Governed, Inclusion-First','4,200 monthly MYPE applications governed. Rejection 78%→41%. 1,500 additional MYPEs/month. Alternative data integrated.','MYPE Application → Alternative Data → AI Score → Inclusion Check → Risk Assessment → Decision Sealed → SBS Metrics → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: AI rejects 78% of MYPEs — Peru\'s informal economy excluded by formal-economy AI.',
    phaseLabels: ['MYPE Exclusion & Informal Economy', 'Alternative Data & Risk Reality', 'Inclusion-First Governance'],
  },

  // 15 — CHIEF AUDIT: INTERNAL AUDIT AI
  // Role: Chief Audit Executive | Level: C-Suite
  {
    id: 'cae-audit-ai', title: 'Chief Audit Executive — AI-Assisted Internal Audit',
    subtitle: 'Audit automation · Risk-based sampling · SBS audit requirements · Audit evidence integrity',
    banner: 'AI-assisted audit analyses 2.4M transactions. AI selects 0.3% sample for deep review — but sample is biased toward large Lima transactions. Provincial small-value fraud pattern missed entirely.',
    risk: 'High', scenarioNum: '15', icon: 'file-search', color: 'text-indigo-400',
    agents: [ag('cae','Chief Audit Agent','Audit Strategy','🔎','text-indigo-400','indigo-500'), ag('audit-ai','Audit AI Agent','Sample Selection','🤖','text-blue-400','blue-500'), ag('sbs-audit','SBS Audit Agent','Regulatory Audit','🏛️','text-red-400','red-500'), ag('fraud-audit','Fraud Audit Agent','Pattern Detection','⚠️','text-amber-400','amber-500')],
    connectors: [cn('Audit AI','connected','Sampling','file-search','2.4M transactions — 0.3% sample'), cn('SBS Audit','connected','Requirements','shield','Annual audit examination'), cn('Branch Data','connected','Transactions','database','284 branches — all regions'), cn('Fraud Patterns','syncing','Detection','alert-triangle','Provincial anomaly detection')],
    script: [
      ln('cae','phase1','analysis',800,'AUDIT AI BIAS. AI-assisted audit: analyses 2.4M transactions, selects 7,200 (0.3%) for deep human review. AI trained on historical audit findings — which were concentrated in Lima (where 68% of prior audits occurred). Result: AI sample is 74% Lima transactions, 26% provincial. Actual transaction distribution: 52% Lima, 48% provincial. Provincial branches UNDER-AUDITED by AI selection.'),
      ln('fraud-audit','phase1','warning',2500,'MISSED PATTERN. Provincial branch network: 94 branches outside Lima. Post-incident discovery: 12 provincial branches had coordinated small-value fraud (S/. 200-500 per transaction, 340 transactions/month per branch). Total: S/. 14.7M over 18 months. AI never selected these transactions for review because: (1) small value (AI biased toward large transactions) (2) provincial (under-represented in training) (3) consistent pattern (AI flagged anomalies, not consistent fraud).'),
      ln('sbs-audit','phase2','dissent',2000,'DISSENT — SBS AUDIT REQUIREMENTS. SBS requires: comprehensive audit coverage, risk-based approach covering ALL business areas. "Risk-based" ≠ "Lima-based." SBS examination of audit methodology: "How does your AI ensure provincial coverage?" CAE answer: "AI selects based on risk signals from historical findings." SBS: "Your historical findings are Lima-biased — your AI perpetuates the bias." Finding: inadequate audit coverage.'),
      ln('audit-ai','phase2','flag',2500,'FLAG — AUDIT EVIDENCE INTEGRITY. When AI selects audit samples, the selection rationale must be defensible. Current AI: "selected based on risk score." Cannot explain: why this transaction, why not that one, what was the provincial coverage, what patterns were considered vs missed. If audit findings are challenged: sample selection methodology cannot withstand scrutiny.'),
      ln('cae','phase3','proposal',2000,'PROPOSED: (1) STRATIFIED SAMPLING: AI ensures proportional coverage across regions, branches, transaction sizes. (2) PER-SELECTION SEAL: every sample selection sealed with rationale, coverage metrics, what patterns were considered. (3) PROVINCIAL COVERAGE: minimum 48% provincial matching transaction distribution. (4) PATTERN DIVERSITY: AI must sample across value ranges, not just high-value. (5) SBS EVIDENCE: audit methodology documentation with coverage proof.'),
      ln('sbs-audit','phase3','resolution',2500,'DISSENT WITHDRAWN. Stratified sampling catches provincial fraud pattern within first audit cycle. 12 branches identified. S/. 14.7M loss would have been detected 16 months earlier. SBS audit methodology approved. Every sample selection has sealed evidence of coverage and rationale.'),
    ],
    receiptTemplate: rc('aud','Merkle Tree Root (2.4M transactions + Stratified sampling + Coverage metrics)','Audit Governance','AUDIT-GOVERNED','SBS Audit Requirements — stratified coverage',['Chief Audit Agent','Audit AI Agent','SBS Audit Agent','Fraud Audit Agent'],'Scotiabank Audit — AI-Assisted, Stratified, Evidence-Sealed','2.4M transactions governed. Provincial coverage 26%→48%. S/. 14.7M fraud detected. SBS methodology approved.','Transaction Pool → Stratified Selection → Coverage Check → Rationale Sealed → Audit Evidence → SBS Report → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: audit AI biased toward Lima — S/. 14.7M provincial fraud missed entirely.',
    phaseLabels: ['Sample Bias & Provincial Gap', 'SBS Audit & Evidence Integrity', 'Stratified Governance Framework'],
  },

  // 16 — HEAD OF COLLECTIONS: AI COLLECTIONS
  // Role: Head of Collections | Level: VP
  {
    id: 'collections-ai', title: 'Head of Collections — AI Collections Governance',
    subtitle: 'Debt recovery · INDECOPI consumer · Aggressive contact · Vulnerable debtors · Dignity',
    banner: 'AI collections system contacts debtors 14 times/day across channels. Elderly widow receiving husband\'s debt calls. AI cannot distinguish hardship from unwillingness. INDECOPI: harassment.',
    risk: 'High', scenarioNum: '16', icon: 'phone', color: 'text-orange-400',
    agents: [ag('collections','Collections Head Agent','Recovery Strategy','📞','text-orange-400','orange-500'), ag('indecopi-col','INDECOPI Agent','Consumer Rights','🛡️','text-red-400','red-500'), ag('vulnerable','Vulnerability Agent','Hardship Detection','❤️','text-pink-400','pink-500'), ag('channel','Channel AI Agent','Contact Optimisation','📱','text-blue-400','blue-500')],
    connectors: [cn('Collections AI','connected','Contact Engine','phone','47K active accounts — multi-channel'), cn('INDECOPI','connected','Consumer','shield','Harassment complaints'), cn('Hardship DB','connected','Assessment','heart','Vulnerability indicators'), cn('Contact Log','syncing','History','file-text','Average 8.4 contacts/debtor/day')],
    script: [
      ln('collections','phase1','analysis',800,'COLLECTIONS AI. 47K delinquent accounts. AI optimises contact strategy: calls, SMS, email, WhatsApp, push notifications. AI metric: recovery rate per contact. Result: AI escalates contact frequency for non-responsive debtors. Average: 8.4 contacts/day. Some debtors: 14 contacts/day across channels. Case: Carmen Flores, 68, widow. Husband died 4 months ago. Joint credit card debt: S/. 12,400. Carmen: S/. 2,100/month survivor pension. AI: 14 calls/day including 2 AM automated messages.'),
      ln('indecopi-col','phase1','warning',2500,'INDECOPI HARASSMENT. Código de Protección Art. 62: debt collection must not be abusive, harassing, or violate dignity. 14 contacts/day = harassment per INDECOPI precedent. 2 AM contacts = violation of rest hours. INDECOPI: 234 complaints against Scotiabank collections in 6 months — 180% increase since AI deployment. Fine: up to 450 UIT. Pattern of harassment: potential class action on behalf of all 47K debtors contacted by AI.'),
      ln('vulnerable','phase2','dissent',2000,'DISSENT — VULNERABILITY BLINDNESS. AI treats all debtors the same: non-payment = increase contact. Cannot distinguish: (1) Won\'t pay (has capacity) from (2) Can\'t pay (hardship). Carmen: S/. 2,100 pension, S/. 1,800 minimum expenses. Maximum payment capacity: S/. 300/month. AI demands S/. 12,400 lump sum. This is not a collections problem — it\'s a hardship case requiring restructuring. AI has zero hardship detection capability.'),
      ln('channel','phase2','flag',2500,'FLAG — RECOVERY DATA. Analysis: debtors contacted >10x/day have LOWER recovery rates than those contacted 3-4x/day. AI optimises for contact volume. But excessive contact causes: debtor blocks number, ignores all communication, files complaint, enters deeper avoidance. AI\'s own data shows its strategy is counterproductive for high-contact cases.'),
      ln('collections','phase3','proposal',2000,'PROPOSED: (1) CONTACT GOVERNANCE: per-debtor daily limit (4 contacts max), no contacts outside 8AM-8PM. (2) VULNERABILITY DETECTION: AI identifies hardship indicators — recent bereavement, medical, income loss — routes to restructuring. (3) PER-CONTACT SEAL: every outreach sealed with: contact attempt, channel, time, debtor response, vulnerability assessment. (4) INDECOPI EVIDENCE: compliance documentation per debtor. (5) DIGNITY METRIC: alongside recovery rate.'),
      ln('indecopi-col','phase3','resolution',2500,'DISSENT WITHDRAWN. Contact limits + vulnerability detection: recovery rate actually INCREASES 12% (fewer contacts, better targeted). Carmen reclassified: hardship restructuring at S/. 250/month. INDECOPI complaints projected -74%. Every contact has sealed governance evidence.'),
    ],
    receiptTemplate: rc('col','Merkle Tree Root (47K accounts + Contact governance + Vulnerability + INDECOPI)','Collections Compliance','DIGNITY-GOVERNED','INDECOPI Art. 62 — per-contact evidence + vulnerability',['Collections Head Agent','INDECOPI Agent','Vulnerability Agent','Channel AI Agent'],'Scotiabank Collections — AI Governed, Dignity-First','47K accounts governed. Contact limits enforced. Vulnerability detection active. Recovery +12%. INDECOPI complaints -74%.','Debtor Account → Vulnerability Check → Contact Plan → Daily Limit → Channel Selection → Contact Sealed → INDECOPI Evidence → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: AI contacts elderly widow 14 times/day demanding dead husband\'s debt.',
    phaseLabels: ['Contact Harassment & Vulnerability', 'INDECOPI Exposure & Recovery Data', 'Dignity-First Governance'],
  },

  // 17 — HEAD OF CX: CHURN PREDICTION AI
  // Role: Head of Customer Experience | Level: VP
  {
    id: 'cx-churn-ai', title: 'Head of CX — AI Churn Prediction & Retention',
    subtitle: 'Customer retention · Discriminatory offers · SBS conduct · Price discrimination · Profiling',
    banner: 'Churn AI identifies 34,000 at-risk customers. Retention offers: affluent districts get 2x better rates than underserved districts. Same risk profile, different postcode. AI-driven price discrimination.',
    risk: 'High', scenarioNum: '17', icon: 'heart', color: 'text-fuchsia-400',
    agents: [ag('cx-head','CX Head Agent','Customer Strategy','❤️','text-fuchsia-400','fuchsia-500'), ag('retention','Retention AI Agent','Offer Engine','🎯','text-blue-400','blue-500'), ag('fairness-cx','Fairness Agent','Price Equity','⚖️','text-red-400','red-500'), ag('sbs-conduct','SBS Conduct Agent','Market Conduct','🏛️','text-amber-400','amber-500')],
    connectors: [cn('Churn AI','connected','Prediction','heart','34K at-risk — ML scoring'), cn('Offer Engine','connected','Retention','gift','Dynamic pricing per customer'), cn('SBS Conduct','connected','Regulation','shield','Market conduct requirements'), cn('Demographics','syncing','Profiling','bar-chart','District-level offer analysis')],
    script: [
      ln('cx-head','phase1','analysis',800,'CHURN AI. Predicts 34,000 customers at risk of leaving in next 90 days. AI generates personalized retention offers. Discovery: offer analysis by district. San Isidro/Miraflores (affluent): average retention offer value S/. 340 (rate reduction + fee waiver). Comas/Villa El Salvador (underserved): average S/. 120 (minor fee waiver only). SAME churn risk score. SAME tenure. DIFFERENT district.'),
      ln('fairness-cx','phase1','warning',2500,'PRICE DISCRIMINATION. AI learned: affluent district customers have higher lifetime value (LTV). Higher LTV = higher retention offer justified. But: LTV correlates with district income. District income correlates with socioeconomic status. Result: AI offers better deals to wealthy customers and worse deals to poor customers. This isn\'t "personalization" — it\'s AI-driven socioeconomic discrimination. 2.8x offer gap between richest and poorest districts.'),
      ln('sbs-conduct','phase2','dissent',2000,'DISSENT — SBS MARKET CONDUCT. SBS conducts of business requirements: fair treatment of customers, no discrimination based on socioeconomic factors. AI retention offers that systematically favor affluent districts = market conduct violation. SBS finding: discriminatory pricing. Additionally: INDECOPI consumer protection — same product, different price based on postcode = potential discrimination claim.'),
      ln('retention','phase2','flag',2500,'FLAG — BUSINESS CASE. Counter-argument: different offers for different LTVs is standard business practice. BUT: when LTV is a proxy for wealth, and wealth determines offer quality, the bank is saying "rich customers are worth saving, poor customers aren\'t." Data: underserved district customers who DO receive equivalent offers have 89% retention vs 34% with current offers. The AI is wrong about who\'s worth saving.'),
      ln('cx-head','phase3','proposal',2000,'PROPOSED: (1) OFFER EQUITY: retention offers based on churn risk and relationship depth, NOT district or LTV proxy. (2) PER-OFFER SEAL: every retention offer sealed with: churn score, offer rationale, fairness check. (3) DISTRICT FAIRNESS: offer value distribution monitored — max 1.3x gap between districts. (4) SBS CONDUCT: market conduct evidence auto-generated. (5) INCLUSION RETENTION: underserved customers get minimum offer floor.'),
      ln('sbs-conduct','phase3','resolution',2500,'DISSENT WITHDRAWN. Equitable offers: overall retention improves from 41%→58%. Underserved district retention: 34%→67%. Affluent: 72%→71% (minimal impact). Net: 5,800 additional retained customers. Revenue preserved: S/. 47M/year. SBS conduct compliance. Fairness generates more revenue than discrimination.'),
    ],
    receiptTemplate: rc('cxr','Merkle Tree Root (34K at-risk + Offer equity + District fairness + SBS conduct)','Market Conduct','CX-GOVERNED','SBS Conduct — equitable offers per customer',['CX Head Agent','Retention AI Agent','Fairness Agent','SBS Conduct Agent'],'Scotiabank CX — Churn AI Governed, Equity-First','34K at-risk governed. Offer gap 2.8x→1.3x. Retention 41%→58%. S/. 47M revenue preserved.','Churn Score → Offer Generation → Equity Check → District Fairness → Offer Sealed → SBS Conduct → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: retention AI offers affluent districts 2.8x better deals than underserved districts.',
    phaseLabels: ['Price Discrimination & District Gap', 'SBS Conduct & Business Reality', 'Equity-First Governance'],
  },

  // 18 — VP RISK ANALYTICS: STRESS TESTING AI
  // Role: VP Risk Analytics | Level: Senior VP
  {
    id: 'vp-risk-stress', title: 'VP Risk Analytics — AI Stress Testing',
    subtitle: 'BCRP stress tests · SBS capital adequacy · Scenario modelling · Model risk · Basel III',
    banner: 'AI stress testing model projects 8.2% capital ratio under severe scenario. Manual review: model excluded mining sector concentration. Actual projection: 6.1% — below minimum. SBS capital adequacy at risk.',
    risk: 'Critical', scenarioNum: '18', icon: 'activity', color: 'text-sky-400',
    agents: [ag('vp-risk','VP Risk Agent','Stress Testing','📉','text-sky-400','sky-500'), ag('sbs-cap','SBS Capital Agent','Capital Adequacy','🏛️','text-red-400','red-500'), ag('model-val','Model Validation Agent','Independent Review','🔍','text-amber-400','amber-500'), ag('scenario','Scenario Agent','Economic Modelling','🌍','text-emerald-400','emerald-500')],
    connectors: [cn('Stress AI','connected','Modelling','activity','Macro scenarios — GDP, FX, commodities'), cn('SBS Capital','connected','Adequacy','shield','Minimum 10% CET1 ratio'), cn('Portfolio','connected','Exposures','database','S/. 42B total assets'), cn('Mining Sector','syncing','Concentration','trending-down','18% of commercial portfolio')],
    script: [
      ln('vp-risk','phase1','analysis',800,'STRESS TEST ERROR. Scotiabank Peru: S/. 42B assets, CET1 ratio 11.8%. AI stress testing model runs BCRP-mandated severe scenario (GDP -5%, PEN devaluation 20%, commodity crash). AI result: CET1 drops to 8.2% — above 10% minimum. Comfortable. PROBLEM: manual review discovers AI model excluded mining sector concentration (18% of commercial portfolio) from commodity stress. Mining sector under commodity crash: 34% default rate. Corrected projection: CET1 drops to 6.1% — BELOW minimum. Bank would fail stress test.'),
      ln('sbs-cap','phase1','warning',2500,'SBS CAPITAL ADEQUACY. SBS requires annual stress testing per Basel III framework. Results submitted to SBS. If Scotiabank submits AI result (8.2%): SBS accepts. Later discovery of error: material misstatement to regulator. SBS penalties: capital surcharge, operational restrictions, management sanctions. If corrected result (6.1%) submitted: SBS requires immediate capital plan — but at least it\'s accurate. Submitting wrong result = worse than bad result.'),
      ln('model-val','phase2','dissent',2000,'DISSENT — MODEL VALIDATION GAP. Stress testing AI: 47 sector models, 12 macro scenarios, 340 correlation assumptions. Independent validation: checked 8 of 47 sector models. Mining sector model: NOT VALIDATED. Validation team: 4 people for 47 models. Incomplete coverage meant mining exclusion went undetected. Without per-assumption governance, validation is sampling-based — and this sample missed the biggest risk.'),
      ln('scenario','phase2','flag',2500,'FLAG — PERU-SPECIFIC RISK. Peru: 60% of exports are minerals. Mining sector stress: GDP impact 2.3x general economy. AI used generic emerging market stress parameters. Peru-specific calibration would have caught mining concentration. AI: good at processing — bad at Peru-specific economic knowledge. Model needs governance that ensures Peru-specific assumptions are documented and verified.'),
      ln('vp-risk','phase3','proposal',2000,'PROPOSED: (1) PER-ASSUMPTION SEAL: every stress test assumption sealed with: source, calibration, sector coverage check. (2) CONCENTRATION CHECK: mandatory sector concentration analysis before stress submission. (3) PERU CALIBRATION: AI forced to use Peru-specific parameters for mining, agriculture, fishing. (4) SBS EVIDENCE: every stress result sealed with complete assumption chain. (5) MODEL COVERAGE: validation coverage tracking — no unvalidated models in production.'),
      ln('sbs-cap','phase3','resolution',2500,'DISSENT WITHDRAWN. Per-assumption governance catches mining exclusion before SBS submission. Corrected result (6.1%) submitted with capital plan. SBS appreciates proactive disclosure. Capital plan: S/. 280M raise over 12 months. Governance prevents material misstatement — the worst outcome in banking regulation.'),
    ],
    receiptTemplate: rc('rsk','Merkle Tree Root (47 sector models + Assumptions + Concentration + SBS)','Capital Adequacy','STRESS-GOVERNED','SBS + Basel III — per-assumption evidence',['VP Risk Agent','SBS Capital Agent','Model Validation Agent','Scenario Agent'],'Scotiabank Risk — Stress Test AI Governed, Peru-Calibrated','47 models governed. Mining exclusion caught. CET1 8.2%→6.1% corrected. SBS submission accurate.','Scenario → Sector Models → Assumptions Sealed → Concentration Check → Peru Calibration → Result Sealed → SBS → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: stress test AI excludes mining sector — projects 8.2% instead of actual 6.1%.',
    phaseLabels: ['Stress Test Error & Mining Gap', 'Validation Coverage & Peru Risk', 'Per-Assumption Governance'],
  },

  // 19 — BRANCH MANAGER: DAILY OPERATIONS AI
  // Role: Branch Manager | Level: Middle Management
  {
    id: 'branch-manager-ops', title: 'Branch Manager — Daily Operations AI',
    subtitle: 'Staffing AI · Customer queue · Sales targets · Product recommendations · Branch performance',
    banner: 'Branch AI recommends staffing cuts based on transaction volume. Doesn\'t account for elderly customers who need 3x longer. Wait times spike to 2 hours. Branch complaints double. Manager overridden by AI.',
    risk: 'Medium', scenarioNum: '19', icon: 'building-2', color: 'text-slate-400',
    agents: [ag('branch-mgr','Branch Manager Agent','Daily Operations','🏦','text-slate-400','slate-500'), ag('staffing-ai','Staffing AI Agent','Workforce','👥','text-blue-400','blue-500'), ag('customer-br','Customer Agent','Branch Experience','⭐','text-amber-400','amber-500'), ag('regional','Regional Director Agent','Performance','📊','text-red-400','red-500')],
    connectors: [cn('Staffing AI','connected','Workforce','building-2','Headcount optimisation per branch'), cn('Queue System','connected','Wait Times','clock','Real-time wait monitoring'), cn('Branch CX','connected','Satisfaction','users','NPS per branch'), cn('Performance','syncing','Targets','bar-chart','Sales, service, efficiency KPIs')],
    script: [
      ln('branch-mgr','phase1','analysis',800,'BRANCH AI CONFLICT. Branch manager, Miraflores branch. AI analyses transaction volume, time-of-day patterns, product mix. Recommendation: reduce teller staff from 6 to 4 during 10AM-2PM (low digital-eligible transaction period). Manager knows: 10AM-2PM is when elderly customers come — they need in-person service, take 3x longer, often need help with multiple products. AI sees: low transaction COUNT. Reality: high transaction COMPLEXITY.'),
      ln('staffing-ai','phase1','warning',2500,'AI METRICS. Staffing model optimises for: transactions per teller per hour. Miraflores 10AM-2PM: 12 transactions/teller/hour (vs branch average 28). AI conclusion: overstaffed. Manager override request: DENIED by regional system. "AI-recommended staffing levels are binding unless approved by Regional Director." Manager cannot adjust own branch based on 15 years of experience. Two weeks post-cut: average wait time 10AM-2PM goes from 12 minutes to 47 minutes.'),
      ln('customer-br','phase2','dissent',2000,'DISSENT — ELDERLY IMPACT. Miraflores: above-average elderly population. Post-cut: 47-minute waits. Elderly customers: cannot stand for 47 minutes, cannot use app/kiosk alternatives, some leave without completing transactions. 3 medical incidents (fainting) in waiting area in first month. Branch NPS: 72→31. Elderly customers: some of Scotiabank\'s highest-value relationships (decades of deposits, investments). They don\'t complain on social media — they quietly move to BCP down the street.'),
      ln('regional','phase2','flag',2500,'FLAG — PERFORMANCE PARADOX. AI cut staff → transactions/teller UP (looks efficient). But: customer satisfaction DOWN, elderly attrition UP, high-value relationship losses. AI optimised for one metric and destroyed others. Branch manager\'s "override denied" = AI overruled human who understood the context. Regional Director reviews: by the time data shows the damage, customers have left.'),
      ln('branch-mgr','phase3','proposal',2000,'PROPOSED: (1) CONTEXTUAL STAFFING: AI considers transaction complexity (not just count), customer demographics, service time distribution. (2) MANAGER INPUT: local context as WEIGHTED INPUT to AI — not overridden. (3) PER-DECISION SEAL: every staffing recommendation sealed with: data considered, manager input, customer impact forecast. (4) ELDERLY METRIC: wait time and service quality tracked specifically for elderly customers. (5) OVERRIDE GOVERNANCE: manager can override with sealed rationale — reviewed, not blocked.'),
      ln('regional','phase3','resolution',2500,'DISSENT WITHDRAWN. Contextual staffing: AI recommends 5 tellers 10AM-2PM (not 4, not 6 — compromise with data). Wait time: 47min→18min. Elderly incidents: zero. NPS: 31→64 (recovering). Manager override with governance: empowers local knowledge while maintaining evidence trail. Branch AI serves the manager, not the other way around.'),
    ],
    receiptTemplate: rc('brn','Merkle Tree Root (Branch staffing + Customer demographics + Wait times + Overrides)','Branch Operations','BRANCH-GOVERNED','Manager + AI — contextual staffing with override',['Branch Manager Agent','Staffing AI Agent','Customer Agent','Regional Director Agent'],'Scotiabank Branch — Operations AI Governed, Manager-Empowered','Contextual staffing deployed. Wait times 47→18min. NPS recovering. Manager override enabled with evidence.','Transaction Data → Demographics → AI Recommendation → Manager Input → Staffing Decision → Wait Monitoring → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: branch AI cuts staff, overrides manager — elderly customers wait 47 minutes.',
    phaseLabels: ['Staffing Cut & Elderly Impact', 'Performance Paradox & Override Block', 'Contextual Governance Framework'],
  },

  // 20 — BOARD AI ETHICS COMMITTEE
  // Role: Board AI Ethics Committee | Level: Board
  {
    id: 'board-ethics', title: 'Board AI Ethics Committee — Governance Accountability',
    subtitle: 'AI ethics · Accountability framework · All 19 scenarios · Enterprise governance · Board duty',
    banner: 'After 19 scenarios across every level: the Board AI Ethics Committee must decide — who is accountable when AI fails? The CEO? The CRO? The model developer? The vendor? Datacendia seals the answer.',
    risk: 'Critical', scenarioNum: '20', icon: 'scale', color: 'text-red-400',
    agents: [ag('ethics-chair','Ethics Chair Agent','Board Committee','🏛️','text-red-400','red-500'), ag('accountability','Accountability Agent','Responsibility Framework','📋','text-blue-400','blue-500'), ag('enterprise','Enterprise AI Agent','Cross-Division','🌍','text-emerald-400','emerald-500'), ag('evidence','Evidence Agent','Governance Proof','🔒','text-amber-400','amber-500')],
    connectors: [cn('19 Scenarios','connected','Evidence','scale','All divisions — all roles — all levels'), cn('Accountability','connected','Framework','landmark','Who decides, who\'s responsible'), cn('Enterprise AI','connected','Registry','database','47 models — 20 governed scenarios'), cn('Board Records','syncing','Governance','file-text','Minutes, resolutions, evidence')],
    script: [
      ln('ethics-chair','phase1','analysis',800,'ACCOUNTABILITY CRISIS. 19 scenarios reviewed. Every scenario: AI makes consequential decisions. Every scenario: when AI fails, the question is "who\'s accountable?" Credit bias: CRO or model developer? Chatbot hallucination: VP Digital or AI vendor? Ransomware miss: CISO or SOC AI? Elderly investment: VP Wealth or algorithm? Current answer across all 19: NOBODY. No accountability framework exists for AI decisions at Scotiabank Peru.'),
      ln('accountability','phase1','warning',2500,'ACCOUNTABILITY GAP. Traditional banking: loan officer approves → loan officer accountable. AI banking: model recommends → system auto-decides → who\'s accountable? Current state: (1) Model developers: "I built what was specified." (2) Business owners: "I relied on AI." (3) Risk: "I didn\'t validate AI models." (4) Compliance: "I wasn\'t informed." (5) Board: "We approved the budget, not the algorithm." Result: DISTRIBUTED IRRESPONSIBILITY. Everyone involved, nobody accountable.'),
      ln('enterprise','phase2','dissent',2000,'DISSENT — ENTERPRISE SCOPE. 47 AI models across: credit (4), fraud (3), AML (2), wealth (3), trading (5), operations (8), HR (2), cybersecurity (4), customer service (6), audit (2), collections (3), branch (5). Each owned by different VP. No enterprise-wide governance. Each division "governs" its own AI — meaning nobody does. Toronto mandates enterprise AI governance. Peru has division-level chaos.'),
      ln('evidence','phase2','flag',2500,'FLAG — WITHOUT GOVERNANCE EVIDENCE, ACCOUNTABILITY IS IMPOSSIBLE. When credit AI discriminates: who decided the model should use geographic data? When was that decision made? Who approved it? Who monitored it? Without sealed decision evidence, accountability is retrospective blame assignment. With sealed evidence: accountability is traceable to the specific decision, the specific person, the specific moment. Datacendia makes accountability possible by making decisions auditable.'),
      ln('ethics-chair','phase3','proposal',2000,'PROPOSED: DATACENDIA ENTERPRISE AI ACCOUNTABILITY FRAMEWORK. (1) DECISION REGISTRY: every AI decision sealed with: model owner, approver, monitor, risk classification. (2) ACCOUNTABILITY CHAIN: from board resolution → division strategy → model deployment → per-decision governance. (3) ESCALATION: AI decisions above risk threshold require human accountability sign-off. (4) EVIDENCE: every failure traceable to accountable person through sealed governance chain. (5) BOARD REPORTING: quarterly AI accountability report — not just spend, not just incidents, but WHO is accountable for WHAT.'),
      ln('evidence','phase3','resolution',2500,'DISSENT WITHDRAWN. Enterprise accountability framework: every AI model has named owner, named risk officer, named board sponsor. Every decision sealed with accountability chain. When AI fails: sealed evidence shows who decided, who approved, who monitored. Not blame — accountability. Scotiabank Peru becomes the first bank in Peru with cryptographically sealed AI accountability. From board to branch manager — every AI decision governed.'),
    ],
    receiptTemplate: rc('eth','Merkle Tree Root (47 models + 20 scenarios + Accountability chains + Board resolution)','AI Ethics & Accountability','ACCOUNTABILITY-GOVERNED','Enterprise Framework — sealed accountability per decision',['Ethics Chair Agent','Accountability Agent','Enterprise AI Agent','Evidence Agent'],'Scotiabank Board Ethics — Enterprise AI Accountability Sealed','47 models governed. 20 scenarios covered. Accountability chain per decision. Board to branch — every AI decision traceable.','Board Resolution → Division Strategy → Model Deployment → Per-Decision Governance → Accountability Chain → Evidence Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: after 19 scenarios — who is accountable when AI fails? Datacendia seals the answer.',
    phaseLabels: ['Accountability Crisis & Distributed Irresponsibility', 'Enterprise Scope & Evidence Gap', 'Sealed Accountability Framework'],
  },

  // 21 — BRANCH MANAGER: DAILY CROSS-SELL AI
  // Role: Branch Manager | Level: Middle Management | Everyday
  {
    id: 'branch-crosssell', title: 'Branch Manager — AI Cross-Sell at the Counter',
    subtitle: 'Product push · Teller prompts · Inappropriate timing · Customer trust · Daily operations',
    banner: 'Every transaction triggers AI cross-sell prompts on teller screens. Tuesday morning: teller prompted to sell life insurance to widow depositing husband\'s death benefit. AI doesn\'t know context — teller freezes. Manager can\'t disable prompts.',
    risk: 'Medium', scenarioNum: '21', icon: 'shopping-bag', color: 'text-green-400',
    agents: [ag('branch-cs','Branch Manager Agent','Daily Cross-Sell','🏦','text-green-400','green-500'), ag('crosssell-ai','Cross-Sell AI Agent','Product Engine','🛒','text-blue-400','blue-500'), ag('teller','Teller Agent','Frontline Staff','👩‍💼','text-amber-400','amber-500'), ag('product-mgr','Product Manager Agent','Revenue Targets','📊','text-red-400','red-500')],
    connectors: [cn('Cross-Sell AI','connected','Product Engine','shopping-bag','4.2 prompts/customer — real-time'), cn('Teller Screen','connected','POS System','monitor','Prompt during transaction'), cn('Customer History','connected','CRM','database','Life events not tracked'), cn('Sales Dashboard','syncing','Targets','bar-chart','Branch: 78% of quarterly cross-sell target')],
    script: [
      ln('branch-cs','phase1','analysis',800,'EVERYDAY CROSS-SELL PROBLEM. Every teller transaction triggers AI prompts on screen. Customer deposits S/. 500 → AI: "Offer savings account upgrade." Customer pays credit card → AI: "Offer balance transfer." Average: 4.2 prompts per customer visit. Tuesday 9:15 AM: María Luisa Vega, 64, deposits S/. 340,000 — her deceased husband\'s life insurance payout, death 2 weeks ago. AI prompt on teller screen: "HIGH-VALUE DEPOSIT DETECTED. Recommend: Term Life Insurance, Investment Portfolio, Premium Savings." Teller Ana reads prompt. Freezes. Customer is crying. Teller says nothing about products — but the prompt is still flashing.'),
      ln('crosssell-ai','phase1','warning',2500,'AI LOGIC. Model sees: large deposit + age 64 + no current life insurance = high propensity. Score: 94% likely to convert on insurance. AI is CORRECT on propensity. AI has ZERO context about WHY the deposit is happening. No life-event awareness, no bereavement flag, no sensitivity filter. 94% propensity score pushed to a teller sitting across from a grieving widow. This happens 3-5 times/week across the branch with different inappropriate contexts — medical bills, divorce settlements, severance packages.'),
      ln('teller','phase2','dissent',2000,'DISSENT — TELLER REALITY. Tellers are measured on prompt conversion rate. Ana\'s rate: 12% (branch average 18%). Regional review flagged her as "underperforming on cross-sell." Ana CHOSE not to pitch insurance to a crying widow. AI scored her as a miss. Manager agrees with Ana — but the system recorded "opportunity not converted." 6 tellers, all facing this daily. Good judgment PENALIZED by AI. Tellers: "Do I serve the customer or serve the prompt?"'),
      ln('product-mgr','phase2','flag',2500,'FLAG — BRAND DAMAGE. Customer feedback post-inappropriate prompt (those who noticed): NPS -34 vs normal. 23% mention "pushy" or "insensitive." Formal complaints: 12/month attributed to cross-sell timing. BUT: cross-sell AI generates S/. 4.2M/year for this branch. Product team: "Reducing prompts reduces revenue." Manager: "Losing trust costs more." No data on long-term trust erosion because nobody measures it.'),
      ln('branch-cs','phase3','proposal',2000,'PROPOSED: (1) CONTEXT FILTER: AI checks for life events (bereavement, medical, legal) before prompting — suppress inappropriate prompts. (2) MANAGER CONTROL: branch manager can pause/adjust prompts daily without regional approval. (3) TELLER JUDGMENT: "defer" button — teller defers prompt with sealed reason, NOT counted as miss. (4) PER-PROMPT SEAL: every prompt sealed with: customer context checked, teller action, outcome. (5) SENSITIVITY: large unexpected deposits get 48h cooling period before cross-sell.'),
      ln('product-mgr','phase3','resolution',2500,'DISSENT WITHDRAWN. Context filter: inappropriate prompts drop 87%. Teller confidence rises. Conversion on REMAINING prompts: 18%→31% (better targeting = better results). Net revenue: S/. 4.2M→S/. 4.8M (fewer prompts, higher conversion). Ana: no longer penalized for good judgment. María Luisa: received condolence note from manager, returned 3 months later and opened investment account voluntarily.'),
    ],
    receiptTemplate: rc('cs1','Merkle Tree Root (Cross-sell prompts + Context filter + Teller actions + Revenue)','Branch Cross-Sell','CONTEXT-GOVERNED','Per-prompt context check + teller judgment preserved',['Branch Manager Agent','Cross-Sell AI Agent','Teller Agent','Product Manager Agent'],'Scotiabank Branch — Cross-Sell AI Governed, Context-Aware','Inappropriate prompts -87%. Conversion 18%→31%. Revenue +S/. 600K. Teller judgment protected.','Customer Visit → Context Check → Prompt Decision → Teller Screen → Action/Defer → Outcome Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: AI prompts teller to sell life insurance to widow depositing husband\'s death benefit.',
    phaseLabels: ['Inappropriate Prompt & Teller Freeze', 'Teller Penalized & Brand Damage', 'Context-Aware Cross-Sell Governance'],
  },

  // 22 — BRANCH MANAGER: AI CASH & ATM MANAGEMENT
  // Role: Branch Manager | Level: Middle Management | Everyday
  {
    id: 'branch-cash-atm', title: 'Branch Manager — AI Cash & ATM Predictions',
    subtitle: 'Cash forecasting · ATM dry · Payday Friday · Provincial branch · Customer trust',
    banner: 'AI predicts cash needs based on digital trend. Cuts branch cash order 40%. Payday Friday: 3 ATMs empty by 11 AM. 400 customers can\'t withdraw salary. Manager warned AI — system ignored input.',
    risk: 'Medium', scenarioNum: '22', icon: 'banknote', color: 'text-green-400',
    agents: [ag('branch-cash','Branch Manager Agent','Cash Operations','🏦','text-green-400','green-500'), ag('cash-ai','Cash AI Agent','Forecasting','💰','text-blue-400','blue-500'), ag('atm-ops','ATM Ops Agent','Network','🏧','text-amber-400','amber-500'), ag('customer-cash','Customer Agent','Branch Access','👤','text-red-400','red-500')],
    connectors: [cn('Cash AI','connected','Forecasting','banknote','Weekly cash order prediction'), cn('ATM Network','connected','Monitoring','credit-card','3 ATMs — real-time levels'), cn('Payroll Data','connected','Employers','database','12 employer payroll deposits — Friday cycle'), cn('Digital Trends','syncing','Channel Mix','smartphone','62% digital adoption — rising')],
    script: [
      ln('branch-cash','phase1','analysis',800,'EVERYDAY CASH PROBLEM. Surquillo branch. 12 major employers in catchment area: 8,400 workers paid bi-monthly (1st and 15th). AI cash model: "Branch trending digital — 62% transactions now digital. Reduce cash order 40%." Manager submits input: "Payday Fridays are ALL cash. Workers withdraw full salary in cash — S/. 1,200-2,800 each. Digital trend is for transfers and payments, NOT for salary withdrawal. Workers need CASH for rent, market, transport." AI response: "Input noted. Cash order adjusted per algorithm." Translation: INPUT IGNORED.'),
      ln('cash-ai','phase1','warning',2500,'AI FORECAST. Model trained on 18-month digital adoption curve. Cash withdrawals declining 3.2%/month overall. Projection: branch needs 40% less cash. Model is CORRECT on trend. Model is WRONG on payday. Payday Friday: 400+ customers withdraw S/. 1,200-2,800 each. Total demand: S/. 680K-1.12M in ONE day. AI ordered S/. 420K. ATM #1 empty 10:47 AM. ATM #2 empty 11:12 AM. ATM #3 empty 11:34 AM. Counter runs low by 1:15 PM. 400+ customers cannot withdraw salary.'),
      ln('customer-cash','phase2','dissent',2000,'DISSENT — CUSTOMER IMPACT. Workers who can\'t get salary: (1) Can\'t pay rent (due Saturday), (2) Can\'t buy food at market (cash only), (3) Can\'t pay transport home, (4) Must find another bank\'s ATM — fees S/. 7.50/withdrawal. 400 customers × S/. 7.50 = S/. 3,000 in fees Scotiabank forced on its own customers. Social media: "Scotiabank ATMs always empty on payday" — 47 posts in 3 hours. Competitor BCP ATMs across the street: working. Customers: "Why do I bank here?"'),
      ln('atm-ops','phase2','flag',2500,'FLAG — PATTERN. This is NOT a one-time failure. AI cuts cash EVERY payday cycle. Manager submits override EVERY cycle. AI ignores EVERY cycle. 6 months: 12 payday Fridays, 12 cash shortfalls, 12 manager overrides ignored. ATM ops: emergency cash delivery costs S/. 2,400 per dispatch. 12 dispatches = S/. 28,800 in emergency costs that would have been zero with correct forecast. AI saves money on cash holding — costs more in emergencies + customer loss.'),
      ln('branch-cash','phase3','proposal',2000,'PROPOSED: (1) PAYROLL CALENDAR: AI integrates employer payroll dates as HARD constraint — not trend override. (2) MANAGER CASH INPUT: branch manager can adjust cash order ±30% with sealed rationale — not ignored. (3) ATM MONITORING: if any ATM drops below 20% by 11 AM on payday, auto-trigger emergency delivery. (4) PER-ORDER SEAL: every cash order sealed with: AI forecast, manager input, payroll calendar, actual outcome. (5) TRACK: emergency dispatch count as AI failure metric.'),
      ln('atm-ops','phase3','resolution',2500,'DISSENT WITHDRAWN. Payroll calendar integration: payday Fridays get 2.4x normal cash. Manager input honoured: ±30% adjustment with sealed reason. Emergency dispatches: 12/quarter→0. ATM empty events: 12→0. S/. 28,800 emergency costs eliminated. 400 customers get salary on payday. Manager expertise: valued, not ignored.'),
    ],
    receiptTemplate: rc('csh','Merkle Tree Root (Cash orders + Payroll calendar + ATM levels + Manager input)','Branch Cash Operations','CASH-GOVERNED','Payroll-aware + manager input honoured',['Branch Manager Agent','Cash AI Agent','ATM Ops Agent','Customer Agent'],'Scotiabank Branch — Cash AI Governed, Payroll-Aware','ATM empty events 12→0. Emergency costs eliminated. Payday service restored. Manager input valued.','Payroll Calendar → AI Forecast → Manager Input → Cash Order Sealed → ATM Monitor → Outcome → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: AI cuts branch cash 40% — 3 ATMs empty on payday Friday, 400 workers can\'t withdraw salary.',
    phaseLabels: ['Payday Cash Failure & Manager Ignored', 'Customer Impact & Emergency Costs', 'Payroll-Aware Cash Governance'],
  },

  // 23 — BRANCH MANAGER: AI ACCOUNT OPENING & KYC
  // Role: Branch Manager | Level: Middle Management | Everyday
  {
    id: 'branch-kyc-opening', title: 'Branch Manager — AI Account Opening & KYC',
    subtitle: 'Document verification · Provincial IDs · Indigenous communities · SBS inclusion · Daily onboarding',
    banner: 'AI auto-rejects 34% of account opening applications. Provincial DNI formats, community land titles, and small business RUCs flagged as "suspicious." Branch in Cusco loses 8 new accounts per day. Manager knows documents are valid — AI doesn\'t.',
    risk: 'Medium', scenarioNum: '23', icon: 'file-check', color: 'text-green-400',
    agents: [ag('branch-kyc','Branch Manager Agent','Account Opening','🏦','text-green-400','green-500'), ag('kyc-ai','KYC AI Agent','Document Verification','📄','text-blue-400','blue-500'), ag('inclusion-br','Inclusion Agent','Financial Access','🌍','text-emerald-400','emerald-500'), ag('compliance-br','Compliance Agent','SBS Requirements','⚖️','text-red-400','red-500')],
    connectors: [cn('KYC AI','connected','Document Check','file-check','Auto-verify — 8 sec/application'), cn('RENIEC','connected','Identity','users','DNI verification — national registry'), cn('SUNAT','connected','Business','building','RUC verification — tax registry'), cn('SBS Inclusion','syncing','Regulation','shield','Financial inclusion mandate')],
    script: [
      ln('branch-kyc','phase1','analysis',800,'EVERYDAY KYC PROBLEM. Cusco branch. Account opening: customer presents documents → AI auto-verifies in 8 seconds → approve/reject. Lima: 96% auto-approve. Cusco: 66% auto-approve, 34% REJECTED. Daily: ~24 applications, 8 rejected. Why? (1) Provincial DNI photos: lower quality scans → AI flags as "potential alteration." (2) Address: rural addresses without street numbers → "incomplete address." (3) Community land titles as proof of residence → "unrecognized document." (4) Small informal business RUC → "insufficient business verification." These are VALID documents. AI trained on Lima standards.'),
      ln('kyc-ai','phase1','warning',2500,'AI TRAINING DATA. Model trained on 2.1M Lima account openings. Lima documents: high-quality photos, street addresses, formal business RUCs. Provincial documents: different format, different quality, different structure — but equally VALID per RENIEC and SUNAT. AI confidence threshold: 85% to auto-approve. Lima average confidence: 94%. Cusco average: 71%. Not because Cusco documents are wrong — because AI doesn\'t know Cusco document patterns. Difference is training, not validity.'),
      ln('inclusion-br','phase2','dissent',2000,'DISSENT — INCLUSION FAILURE. 8 rejections/day × 284 working days = 2,272 potential customers/year turned away from THIS branch alone. Across 94 provincial branches: estimated 18,400 Peruvians denied accounts annually because AI doesn\'t understand their documents. SBS Plan Nacional de Inclusión Financiera: banks MUST expand access. Scotiabank AI: CONTRACTING access in provinces. Indigenous community members: most affected — community documents least represented in training data.'),
      ln('compliance-br','phase2','flag',2500,'FLAG — COMPLIANCE CONFLICT. SBS requires: (1) KYC verification — don\'t open accounts with fraudulent documents. (2) Financial inclusion — don\'t exclude legitimate customers. AI solves (1) aggressively and VIOLATES (2). Branch manager: forced to choose between "follow AI rejection" or "manual override that compliance might question." Currently: manager overrides 6 of 8 daily rejections. Each override requires 45 minutes of manual documentation. Manager spends 4.5 hours/day on overrides that AI should handle correctly.'),
      ln('branch-kyc','phase3','proposal',2000,'PROPOSED: (1) PROVINCIAL TRAINING: AI trained on documents from ALL 25 regions, not just Lima. (2) CONFIDENCE BAND: 70-85% = "review with manager" not "reject." (3) MANAGER QUICK-APPROVE: 1-click override for known document patterns — sealed, auditable, <5 minutes. (4) INCLUSION METRIC: rejection rate by region tracked. (5) COMMUNITY DOCUMENTS: indigenous community titles, rural addresses, informal RUCs added to valid document library.'),
      ln('inclusion-br','phase3','resolution',2500,'DISSENT WITHDRAWN. Provincial training: Cusco auto-approve 66%→89%. Manager override time: 4.5h/day→45min/day. 18,400 Peruvians annually regain access to banking. SBS inclusion metrics improve. Community documents recognized. Manager: back to managing branch instead of fighting AI. AI serves inclusion, not just verification.'),
    ],
    receiptTemplate: rc('kyc','Merkle Tree Root (Account opening + Provincial docs + Inclusion + Manager overrides)','Account Opening','KYC-GOVERNED','SBS Inclusion + Provincial document recognition',['Branch Manager Agent','KYC AI Agent','Inclusion Agent','Compliance Agent'],'Scotiabank Branch — KYC AI Governed, Inclusion-First','Auto-approve 66%→89%. Manager override 4.5h→45min/day. 18,400 Peruvians regain access.','Documents → AI Check → Provincial Patterns → Confidence Band → Manager Review → Decision Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: KYC AI rejects 34% of Cusco applications — valid provincial documents flagged as suspicious.',
    phaseLabels: ['Provincial Document Rejection & Training Bias', 'Inclusion Failure & Manager Override Burden', 'Provincial-Aware KYC Governance'],
  },

  // 24 — RELATIONSHIP MANAGER: AI CLIENT RECOMMENDATIONS
  // Role: Relationship Manager | Level: Frontline Professional | Everyday
  {
    id: 'rm-client-reco', title: 'Relationship Manager — AI Client Meeting Prep',
    subtitle: 'Client recommendations · AI briefing · Life context · Trust relationship · Daily client meetings',
    banner: 'AI generates pre-meeting briefing: "Recommend mortgage refinance for 12% savings." RM knows client just lost job last week. AI brief has no life context. RM must choose: follow AI or follow relationship.',
    risk: 'Medium', scenarioNum: '24', icon: 'user-check', color: 'text-teal-400',
    agents: [ag('rm','RM Agent','Client Relationships','👤','text-teal-400','teal-500'), ag('reco-ai','Recommendation AI Agent','Product Matching','🤖','text-blue-400','blue-500'), ag('client-trust','Client Trust Agent','Relationship Quality','🤝','text-amber-400','amber-500'), ag('sales-mgr','Sales Manager Agent','Revenue Targets','📊','text-red-400','red-500')],
    connectors: [cn('AI Briefing','connected','Recommendations','user-check','Pre-meeting — 3-5 products per client'), cn('CRM','connected','Client Data','database','Transaction history, products held'), cn('Life Events','connected','Context','calendar','Employment, family — NOT tracked'), cn('Sales Targets','syncing','Performance','bar-chart','RM quota: S/. 2.4M/quarter')],
    script: [
      ln('rm','phase1','analysis',800,'EVERYDAY RM PROBLEM. Carolina, RM with 142 clients. 6-8 meetings/day. AI generates pre-meeting brief: client profile, products held, RECOMMENDATIONS. Today 10:30 AM: Jorge Mendoza, 47. AI brief: "Income S/. 18K/month. Mortgage S/. 420K at 9.2%. RECOMMEND: refinance at 7.8% — saves S/. 340/month. Also: investment portfolio — S/. 50K minimum." Carolina knows: Jorge was laid off LAST WEEK. Called her personally. AI doesn\'t know — employment status not in banking data until payroll deposits stop (30-60 day lag). AI recommends MORE debt to someone who just lost income.'),
      ln('reco-ai','phase1','warning',2500,'AI RECOMMENDATION ENGINE. Model uses: income (payroll deposits), debt ratio, payment history, product gaps, market rates. Jorge: 24 months perfect payments, S/. 18K income, 23% debt ratio. IDEAL refinance candidate. AI is correct ON THE DATA IT HAS. But data lags reality by 30-60 days. Jorge\'s last payroll: 2 weeks ago (still looks employed). AI will recommend debt products to someone with ZERO income for the next 30 days until payroll stops. THIS HAPPENS WITH EVERY LIFE EVENT: job loss, divorce, medical emergency — AI is always 30-60 days behind reality.'),
      ln('client-trust','phase2','dissent',2000,'DISSENT — TRUST DESTRUCTION. If Carolina follows AI brief: "Jorge, great news — let\'s refinance and start investing!" Jorge: "Carolina, I told you I lost my job." Trust: DESTROYED. 5-year relationship: gone. Carolina knows to say: "Jorge, let\'s review your situation and plan for the transition." But AI MEASURED her as: "Recommendation not converted. Two products missed." Her performance score drops. Trust-building conversation = AI failure. AI incentivizes ignoring what the RM knows.'),
      ln('sales-mgr','phase2','flag',2500,'FLAG — MEASUREMENT PARADOX. RM quarterly target: S/. 2.4M new products. AI generates 420 recommendations/month per RM. Conversion expected: 22%. Carolina\'s conversion: 19% (below average). BUT: Carolina\'s client retention: 97% (highest in branch). Client NPS: 89 (highest). Revenue per client: S/. 4,200/year (highest). Carolina is the BEST RM by every measure except AI recommendation conversion — because she uses JUDGMENT. AI penalizes the best performer.'),
      ln('rm','phase3','proposal',2000,'PROPOSED: (1) RM CONTEXT INPUT: before meeting, RM can flag "life event — suppress product push" with sealed note. AI adjusts brief. (2) DEFER WITH REASON: RM defers recommendation with context — counted as GOOD judgment, not missed conversion. (3) RELATIONSHIP METRICS: retention, NPS, revenue per client weighted EQUALLY to conversion rate. (4) LAG AWARENESS: AI acknowledges 30-60 day data lag in brief. (5) PER-MEETING SEAL: AI brief + RM context + actual conversation outcome — sealed.'),
      ln('sales-mgr','phase3','resolution',2500,'DISSENT WITHDRAWN. RM context input: 34% of deferred recommendations were CORRECT deferrals (life events). Carolina\'s "missed" conversions: mostly good judgment. New metrics: Carolina ranks #1 overall (was ranked #8 on AI conversion alone). Client trust preserved. Jorge: Carolina helped plan transition, came back 4 months later for investment account. Lifetime value: preserved by IGNORING the AI at the right moment.'),
    ],
    receiptTemplate: rc('rmc','Merkle Tree Root (Client meetings + RM context + AI briefs + Relationship outcomes)','Client Relationships','RM-GOVERNED','RM judgment + AI brief — context-aware recommendations',['RM Agent','Recommendation AI Agent','Client Trust Agent','Sales Manager Agent'],'Scotiabank RM — Client AI Governed, Relationship-First','Deferred recommendations validated. RM ranked by relationship, not just conversion. Trust preserved.','AI Brief → RM Context → Meeting → Action/Defer → Outcome → Relationship Metric → Sealed → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: AI recommends more debt to client who lost job last week — RM must choose AI or trust.',
    phaseLabels: ['AI Data Lag & Life Events', 'Trust vs Conversion & Measurement', 'RM Context-Aware Governance'],
  },

  // 25 — LOAN OFFICER: DAILY CREDIT OVERRIDES
  // Role: Loan Officer | Level: Frontline Professional | Everyday
  {
    id: 'loan-officer-override', title: 'Loan Officer — AI Credit Decisions & Daily Overrides',
    subtitle: 'Auto-deny · Edge cases · Small business · Provincial applicants · Manual review queue',
    banner: 'AI auto-denies 340 loan applications/day at branch level. Loan officer reviews 40 overrides daily. 67% of overrides perform BETTER than AI auto-approves. AI misses good borrowers that humans catch.',
    risk: 'Medium', scenarioNum: '25', icon: 'clipboard-check', color: 'text-teal-400',
    agents: [ag('loan-off','Loan Officer Agent','Credit Decisions','📋','text-teal-400','teal-500'), ag('credit-ai','Credit AI Agent','Auto-Decision','🤖','text-blue-400','blue-500'), ag('applicant','Applicant Agent','Borrower Experience','👤','text-amber-400','amber-500'), ag('risk-branch','Branch Risk Agent','Portfolio Quality','📊','text-red-400','red-500')],
    connectors: [cn('Credit AI','connected','Auto-Decisioning','clipboard-check','1,200 applications/day — 72% auto-approved'), cn('Override Queue','connected','Manual Review','inbox','40 overrides/day — 4.5 min avg'), cn('SBS Credit','connected','Regulation','shield','Reglamento de Créditos'), cn('Performance','syncing','Portfolio','bar-chart','Override vs auto-approve default rates')],
    script: [
      ln('loan-off','phase1','analysis',800,'EVERYDAY OVERRIDE. Ricardo, senior loan officer, Chiclayo branch. AI processes 1,200 applications/day nationally. 72% auto-approved. 28% auto-denied. Ricardo\'s branch: 45 applications/day, 13 auto-denied. Ricardo reviews: applicant denied, but runs a successful market stall for 9 years. No formal bank statements (uses cash). AI denial reason: "Insufficient financial documentation." Ricardo KNOWS this business — it\'s 200 meters from the branch. Owner deposits cash weekly. Ricardo overrides: APPROVE with condition (6-month review). This is his DAILY routine — 40 overrides, each requiring human context AI lacks.'),
      ln('credit-ai','phase1','warning',2500,'AI DENIAL PATTERNS. Top 5 auto-deny reasons: (1) Insufficient documentation — 34% (informal economy). (2) Short credit history — 28% (young/new). (3) Variable income — 19% (seasonal workers, gig). (4) Non-standard employment — 12% (self-employed). (5) Address verification failed — 7% (rural). ALL FIVE are characteristics of Peru\'s informal economy (72% of workforce). AI trained on formal economy patterns. Informal = denied. But informal ≠ bad credit risk. Ricardo\'s 2-year override data: 3.8% default rate on overrides vs 4.1% on AI auto-approves. OVERRIDES PERFORM BETTER.'),
      ln('applicant','phase2','dissent',2000,'DISSENT — APPLICANT EXPERIENCE. Auto-denied applicant experience: (1) Applies online or at branch. (2) Denied in 8 seconds. (3) Reason: "Does not meet criteria." (4) No human ever looked at application. (5) No appeal path. (6) Must physically go to branch and ASK for manual review. (7) 60% don\'t come back — assume "the bank said no." Those who DO come back: 67% get approved by Ricardo. The 60% who didn\'t return: potentially good borrowers LOST because AI said no and nobody said "wait, let me look."'),
      ln('risk-branch','phase2','flag',2500,'FLAG — OVERRIDE DATA. Ricardo\'s overrides over 2 years: 4,800 loans. Default rate: 3.8%. AI auto-approves same period: 14,200 loans. Default rate: 4.1%. OVERRIDES ARE BETTER. Why? Ricardo adds information AI doesn\'t have: business observation, community reputation, cash flow patterns, seasonal knowledge. But: override takes 45 min documentation. Ricardo can only do 40/day. 13 denied × 67% worthy = ~9 good loans missed daily if Ricardo is full. System bottleneck is DOCUMENTATION, not judgment.'),
      ln('loan-off','phase3','proposal',2000,'PROPOSED: (1) FAST OVERRIDE: 1-click structured override with 5 fields instead of 45-min documentation — sealed and auditable. (2) AI LEARNING: overrides with good outcomes FED BACK to model — AI learns what Ricardo knows. (3) INFORMAL ECONOMY MODE: alternative scoring for applicants without formal documentation. (4) AUTO-REFER: instead of auto-deny, borderline cases auto-referred to loan officer with context. (5) TRACK: override vs auto performance — let the data speak.'),
      ln('risk-branch','phase3','resolution',2500,'DISSENT WITHDRAWN. Fast override: 45min→8min. Ricardo handles 40→80 reviews/day. Auto-refer replaces auto-deny for borderline: 60% of "lost" applicants now reviewed. AI feedback loop: after 6 months, informal economy approvals improve 23%. Default rate holds at 3.9%. Branch lending up S/. 14M/year. Loan officer expertise: accelerated, not bottlenecked. AI learns from the human.'),
    ],
    receiptTemplate: rc('lno','Merkle Tree Root (Override decisions + AI auto-decisions + Performance comparison + SBS)','Branch Credit','OVERRIDE-GOVERNED','Loan officer judgment + AI learning loop',['Loan Officer Agent','Credit AI Agent','Applicant Agent','Branch Risk Agent'],'Scotiabank Branch — Credit AI Governed, Human-Enhanced','Override 45→8min. Informal economy lending +23%. Default 3.9%. Branch +S/. 14M/year.','Application → AI Decision → Override Queue → Loan Officer Context → Decision Sealed → Feedback Loop → Ed25519 + RFC 3161'),
    idleTitle: 'Ready to Deliberate', idleDesc: '4 agents: loan officer overrides perform better than AI auto-approves — but documentation bottleneck limits human judgment.',
    phaseLabels: ['Auto-Deny & Informal Economy', 'Override Performance & Applicant Loss', 'Human-Enhanced Credit Governance'],
  },

];

const config: OrgSandboxConfig = {
  orgLabel: 'Scotiabank Peru',
  accessKey: 'SCOTIA-26',
  sessionKey: 'scotiabank-sandbox-unlocked',
  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',
  footerNote: 'Scotiabank Peru — 25 AI governance scenarios across every role from Board to Branch Manager to Loan Officer. SBS, SMV, BCRP, SUNAT, UIF, APDP compliance. Datacendia · Enterprise AI Governance',
  i18n: {
    footerNote: 'Scotiabank Perú — 25 escenarios de gobernanza IA para cada rol. SBS, SMV, BCRP, SUNAT, UIF, APDP. Datacendia · Gobernanza IA Empresarial',
    labels: {
      dataConnectors: 'Conectores de Datos', activeCouncil: 'Consejo Activo',
      deliberationTitle: 'Deliberación Multi-Agente', readyToBegin: 'Listo para comenzar',
      phase: 'Fase', deliberationComplete: 'Deliberación Completa — Consenso Alcanzado',
      runDeliberation: 'Iniciar Deliberación', generateReceipt: 'Generar Recibo del Regulador',
      generatingBundle: 'Generando Paquete de Evidencia Criptográfica...',
      simulationNote: 'NOTA DE SIMULACIÓN:', selectScenario: 'Seleccionar Escenario',
      reset: 'Reiniciar', confidential: 'CONFIDENCIAL', executiveSandbox: 'SANDBOX EJECUTIVO',
      connectorLive: 'ACTIVO', connectorSync: 'SYNC', connectorReady: 'LISTO',
      complianceScore: 'Compliance Score', timeline: 'Decision Timeline',
      evidenceExplorer: 'Evidence Explorer', shareReport: 'Share Report',
      exportData: 'Export Data', viewDetails: 'View Details', hideDetails: 'Hide Details',
    },
    scenarios: ES_SCENARIOS,
  },
  scenarios,
};

export default config;
