/**
 * Infosys Sandbox Config
 * Access: /sandbox/infosys (Key: IN-72)
 * @module pages/sandbox/configs/infosys
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Infosys',
  accessKey: 'IN-72',
  sessionKey: 'infosys-sandbox-unlocked',
  accent: 'indigo',
  accentColor: 'text-indigo-400',
  accentHover: 'from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600',
  ringColor: 'focus:ring-indigo-500/30',
  borderColor: 'border-indigo-500/30',
  gradientFrom: 'from-indigo-600/20',
  gradientTo: 'to-indigo-900/20',
  footerNote: 'Infosys AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Infosys systems or incidents.',

  scenarios: [
    // SCENARIO 1 — INFOSYS: DPDP ACT CROSS-BORDER DATA TRANSFER
    {
      id: 'infosys-dpdp',
      title: 'Infosys AI — India DPDP Act Cross-Border Transfer Violation',
      subtitle: 'Client PII processed offshore · DPDP Act 2023 · DPB investigation · ₹250Cr penalty',
      banner: 'Simulating the Indian data protection crisis: Infosys processes Indian client personal data using AI systems hosted in its global delivery centres. The Digital Personal Data Protection Act 2023 restricts cross-border transfers to approved jurisdictions. Infosys transfers data to a delivery centre in a non-approved country without client consent.',
      risk: 'Critical',
      scenarioNum: 'DPDP',
      icon: 'globe',
      color: 'text-indigo-400',
      agents: [
        { id: 'infosys-ai', name: 'Infosys AI Platform Agent', role: 'Global Delivery & AI Processing', icon: '🤖', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
        { id: 'dpdp-counsel', name: 'DPDP Counsel Agent', role: 'Indian Data Protection Compliance', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'dpb-agent', name: 'Data Protection Board Agent', role: 'DPB Investigation & Enforcement', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'client-risk', name: 'Client Risk Agent', role: 'Enterprise Client Impact & SLA', icon: '💼', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Infosys AI Platform', status: 'connected', type: 'Global Delivery', icon: 'cpu', detail: 'AI processing across 12 delivery centres — 4 in non-approved jurisdictions' },
        { name: 'DPDP Compliance', status: 'connected', type: 'Transfer Rules', icon: 'shield', detail: 'DPDP Act Sec. 16: transfers restricted to govt-approved countries' },
        { name: 'Client PII Database', status: 'connected', type: 'Data Inventory', icon: 'database', detail: 'Indian bank client: 8.2M customer records processed by Infosys AI' },
        { name: 'DPB Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'DPB complaint filed — cross-border transfer without consent' },
      ],
      script: [
        { agentId: 'infosys-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Infosys AI-powered banking analytics for IndiaFirst Bank (client). Processing: 8.2M Indian customer records for credit scoring, fraud detection, and customer segmentation. Global delivery model: AI workloads distributed across Bangalore (India), Manila (Philippines), Brno (Czech Republic), and Monterrey (Mexico). CRITICAL ISSUE: The DPDP Act 2023, Section 16, restricts transfer of Indian personal data to countries NOT on the Central Government\'s approved list. The Philippines and Mexico are NOT on the current approved list. 3.4M of the 8.2M records were processed in Manila and Monterrey. The bank\'s data processing agreement with Infosys authorises "global delivery" but does NOT specify countries or obtain data principal consent for cross-border transfers. Under DPDP: the Data Fiduciary (IndiaFirst Bank) and the Data Processor (Infosys) are BOTH liable. Penalty: up to ₹250 crore ($30M) per violation.' },
        { agentId: 'dpdp-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'DPDP COMPLIANCE ALERT. (1) Section 16(1): "The Central Government may... restrict the transfer of personal data by a Data Fiduciary for processing to such country or territory outside India as it may notify." The approved list is still being finalised, but the draft excludes several countries where Infosys operates delivery centres. (2) Section 8(7): Data Processors must process data ONLY as instructed by the Data Fiduciary AND in compliance with DPDP. Infosys\'s routing of workloads to non-approved countries violates both the client agreement and DPDP. (3) The 8.2M records include Aadhaar-linked data — India\'s biometric ID. Aadhaar data has ADDITIONAL restrictions under the Aadhaar Act 2016. Cross-border transfer of Aadhaar data is prohibited entirely. (4) RBI circular on data localisation (April 2018): payment system data must be stored in India. If the 8.2M records include payment data processed in Manila: RBI violation in addition to DPDP violation.' },
        { agentId: 'dpb-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. DPB enforcement: (1) A data principal (bank customer) filed a complaint after discovering their data was processed in the Philippines via a right-to-information request. (2) DPB investigation scope: ALL cross-border transfers by Infosys on behalf of ALL Indian clients — not just IndiaFirst Bank. If the investigation expands: Infosys processes data for 50+ Indian enterprises. Systemic non-compliance across multiple clients. (3) Penalty calculation: ₹250Cr per violation. Multiple violations across multiple clients = potentially ₹1,000Cr+ ($120M+). (4) Reputational: Infosys is India\'s second-largest IT company. A DPDP enforcement action against Infosys would be the highest-profile data protection case in Indian history. Every Indian enterprise client re-evaluates their Infosys contract. (5) The global delivery model — Infosys\'s core business advantage — becomes a liability if cross-border compliance isn\'t governed.' },
        { agentId: 'client-risk', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CLIENT RISK. IndiaFirst Bank hired Infosys specifically because of its global delivery capabilities. The bank\'s procurement team approved "global delivery" without asking which countries. The bank is now jointly liable under DPDP. Without CendiaSupervision: Infosys continues routing workloads based on capacity and cost — not data protection compliance. The DPB investigation reveals systemic non-compliance. 50+ Indian clients are affected. With CendiaSupervision: every AI workload is tagged with data jurisdiction. Indian PII is automatically restricted to India-based or approved-country delivery centres. Non-approved routing is blocked at the infrastructure level.' },
        { agentId: 'infosys-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Infosys + CendiaSupervision DPDP Governance: (1) DATA JURISDICTION TAGGING: Every record processed by Infosys AI is tagged with origin jurisdiction. Indian PII = DPDP rules apply. (2) APPROVED-COUNTRY ROUTING: AI workloads with Indian PII are ONLY routed to delivery centres in India or approved countries. Non-approved routing = HARD STOP. (3) AADHAAR ISOLATION: Records containing Aadhaar data are flagged for India-only processing — no cross-border transfer under any circumstances. (4) RBI DATA LOCALISATION: Payment data is automatically identified and restricted to Indian infrastructure. (5) CLIENT TRANSPARENCY: Each client receives a monthly data residency report showing exactly which delivery centres processed their data.' },
        { agentId: 'dpb-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Jurisdiction tagging restricts Indian PII to compliant delivery centres. The 3.4M records in Manila and Monterrey are repatriated to Bangalore. Aadhaar data isolated. RBI payment data localised. DPB investigation finds Infosys now exceeds DPDP requirements. For Infosys: CendiaSupervision = the governance layer that makes global delivery DPDP-compliant. "Every Indian data record is jurisdiction-tagged and compliance-routed" — the enterprise feature that preserves Infosys\'s global delivery model while satisfying India\'s data sovereignty requirements.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:in10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'in20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Infosys AI + DPDP jurisdiction tagging + Approved-country routing + Aadhaar isolation)',
        complianceLabel: 'DPDP Status',
        complianceValue: 'INDIA-ONLY ROUTING ENFORCED',
        complianceThreshold: 'Sec. 16 compliant: approved countries only, Aadhaar isolated',
        agents: ['Infosys AI Platform Agent', 'DPDP Counsel Agent', 'Data Protection Board Agent', 'Client Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Infosys — DPDP Cross-Border Governance',
        guaranteeBody: 'Data jurisdiction tagging enforced. 3.4M records repatriated from non-approved countries. Aadhaar data: India-only. RBI payment localisation: compliant. 50+ client contracts updated. ₹250Cr penalty avoided.',
        evidenceChain: 'Infosys AI (global routing) → Jurisdiction tagging → Non-approved detected → Repatriation → Aadhaar isolated → RBI compliant → DPB audit-ready → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Infosys + CendiaSupervision enforces DPDP-compliant data routing across global delivery centres.',
      phaseLabels: ['Cross-Border Transfer & DPDP Gap', 'DPB Investigation & ₹250Cr Penalty', 'Jurisdiction Tagging & Compliant Routing'],
    },

    // SCENARIO 2 — INFOSYS: AI BIAS IN CLIENT HR SYSTEM
    {
      id: 'infosys-hr-bias',
      title: 'Infosys AI — Caste Proxy Bias in Client HR System',
      subtitle: 'Resume screening AI · Surname-based filtering · SC/ST discrimination · Constitutional violation',
      banner: 'Simulating the algorithmic discrimination crisis: Infosys builds an AI-powered resume screening system for a client. The AI learns to use surnames as a proxy for caste — systematically filtering out candidates from Scheduled Caste and Scheduled Tribe communities. This violates the Indian Constitution\'s equality guarantees and the SC/ST Prevention of Atrocities Act.',
      risk: 'Critical',
      scenarioNum: 'Bias',
      icon: 'users',
      color: 'text-red-400',
      agents: [
        { id: 'infosys-hr', name: 'Infosys AI HR Agent', role: 'Resume Screening & Candidate Ranking', icon: '🤖', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
        { id: 'equality-counsel', name: 'Constitutional Agent', role: 'Art. 14-16 Equality & Anti-Discrimination', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sc-commission', name: 'NCSC Agent', role: 'National Commission for Scheduled Castes', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'client-hr', name: 'Client HR Agent', role: 'Hiring Compliance & Diversity Obligations', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'AI Resume Screener', status: 'connected', type: 'HR AI', icon: 'cpu', detail: 'Trained on 5 years of hiring data — 240,000 resumes' },
        { name: 'Bias Analysis', status: 'connected', type: 'Fairness Audit', icon: 'bar-chart', detail: 'SC/ST candidates: 3.2% selection rate vs 18.4% general category' },
        { name: 'Training Data', status: 'connected', type: 'Historical Bias', icon: 'database', detail: 'Training data reflects 5 years of human reviewer bias' },
        { name: 'NCSC Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'Complaint filed: algorithmic caste discrimination' },
      ],
      script: [
        { agentId: 'infosys-hr', phase: 'phase1', type: 'analysis', delay: 800, content: 'Infosys AI resume screening system for TechMahindra Corp (client). AI trained on 240,000 historical hiring decisions (5 years). The AI ranks candidates and recommends top 15% for interview. Performance metrics: precision 82%, recall 74% — "good" by ML standards. CRITICAL ISSUE: CendiaSupervision fairness audit reveals: SC/ST candidates selected for interview at 3.2% rate. General category candidates: 18.4%. OBC candidates: 12.1%. The AI learned SURNAME PATTERNS from training data. Indian surnames often correlate with caste. The AI assigned lower scores to candidates with surnames associated with SC/ST communities — not explicitly, but through learned patterns in the training data where human reviewers had the same bias. The AI amplified and systematised 5 years of human caste bias. This is not a bug — it\'s the AI working exactly as trained. The training data IS the problem.' },
        { agentId: 'equality-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CONSTITUTIONAL ALERT. (1) Article 15(1): "The State shall not discriminate against any citizen on grounds only of... caste." While Art. 15 binds the State, Article 15(2) extends to private entities: "No citizen shall... be subject to any disability, liability, restriction or condition with regard to... access to... employment." (2) SC/ST Prevention of Atrocities Act 1989, Section 3(1)(u): "denies a member of a Scheduled Caste or Scheduled Tribe any customary right of passage to a place of public resort... or employment" is a criminal offence. Algorithmic denial of employment opportunity may fall within this section. (3) The Equal Remuneration Act and relevant labour laws prohibit discriminatory hiring practices. (4) Both Infosys (as system builder) and TechMahindra (as system user) are liable. Criminal liability under the Atrocities Act attaches to individuals — Infosys\'s project lead and TechMahindra\'s HR head personally.' },
        { agentId: 'sc-commission', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. NCSC investigation: (1) The National Commission for Scheduled Castes has Constitutional authority (Art. 338) to investigate complaints of SC discrimination. The Commission can summon Infosys and TechMahindra executives, demand the AI model and training data for audit, and recommend prosecution under the Atrocities Act. (2) If the NCSC finds systematic caste discrimination: it refers to the Ministry of Social Justice for policy action. Potential outcome: mandatory algorithmic fairness audits for ALL AI hiring systems in India. (3) The 3.2% vs 18.4% selection rate is prima facie evidence of discrimination. The burden shifts to Infosys to prove the disparity is NOT caste-based. (4) Political dimension: caste discrimination by AI will become a major political issue. Parliamentary questions. Media coverage. Both companies face sustained reputational damage.' },
        { agentId: 'client-hr', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CLIENT HR. We hired Infosys to build an AI system that improves hiring quality and reduces bias. Instead, the AI systematised and amplified caste bias from our historical data. We are now MORE discriminatory than before — and we have an auditable system that PROVES it. Without CendiaSupervision: the system runs for 2 years before the NCSC complaint. 14,000 SC/ST candidates were filtered out who should have been interviewed. Class action potential. With CendiaSupervision: the fairness audit catches the surname-caste correlation during model validation — before deployment. The model is retrained with surname-blind features. Selection rates equalise.' },
        { agentId: 'infosys-hr', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Infosys AI + CendiaSupervision Fairness Governance: (1) PRE-DEPLOYMENT FAIRNESS AUDIT: Every hiring AI is audited for disparate impact across protected categories (caste, gender, religion, disability) BEFORE deployment. Selection rate ratios below 80% (4/5ths rule) trigger retraining. (2) SURNAME DEBIASING: CendiaSupervision identifies features that correlate with protected categories (surname → caste, pin code → socioeconomic status). These features are removed or debiased. (3) TRAINING DATA AUDIT: Historical hiring data is audited for human bias before model training. Biased training data = biased model. (4) ONGOING MONITORING: Post-deployment, selection rates are monitored monthly. Drift toward disparate impact triggers alerts. (5) CONSTITUTIONAL COMPLIANCE REPORT: Each AI hiring system generates an Art. 14-16 compliance report documenting fairness metrics, debiasing steps, and ongoing monitoring.' },
        { agentId: 'sc-commission', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Surname debiasing + fairness audit equalises selection rates: SC/ST: 14.8%, OBC: 15.2%, General: 16.1%. The disparity is within acceptable range. NCSC investigation finds the system now REDUCES caste bias compared to human reviewers. For Infosys: CendiaSupervision = AI fairness governance for the Indian market. "Every Infosys AI hiring system is audited for caste, gender, and disability bias before deployment" — the enterprise guarantee that wins Indian government and MNC contracts where fairness is non-negotiable.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:in30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'in40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (HR AI + Fairness audit + Surname debiasing + Constitutional compliance)',
        complianceLabel: 'Fairness Status',
        complianceValue: 'CASTE BIAS ELIMINATED — 14.8% SC/ST',
        complianceThreshold: 'Art. 14-16 compliant: selection rates equalised',
        agents: ['Infosys AI HR Agent', 'Constitutional Agent', 'NCSC Agent', 'Client HR Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Infosys AI — Algorithmic Fairness Governance',
        guaranteeBody: 'Caste proxy bias detected: surname correlation eliminated. SC/ST selection rate: 3.2% → 14.8%. Training data debiased. Art. 14-16 compliance documented. NCSC audit-ready.',
        evidenceChain: 'Training data (240K resumes) → Bias detected (3.2% SC/ST) → Surname correlation → Debiasing applied → Retrained → 14.8% SC/ST → Constitutional report → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Infosys + CendiaSupervision catches caste proxy bias in an AI hiring system before deployment.',
      phaseLabels: ['Surname-Caste Correlation & Disparate Impact', 'NCSC Investigation & Criminal Liability', 'Fairness Audit & Surname Debiasing'],
    },
  ],
};

export default config;
