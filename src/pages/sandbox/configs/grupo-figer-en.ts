/**
 * Grupo Figer — English Scenarios
 * @module pages/sandbox/configs/grupo-figer-en
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { TemplateScenario } from '../SandboxTemplate';
import { AGENTS } from './grupo-figer-agents';

// =============================================================================
// SCENARIO 1 — DUAL REPRESENTATION TRANSFER
// =============================================================================

const S1: TemplateScenario = {
  id: 'dual-representation',
  title: 'Dual Representation — Premier League Transfer',
  subtitle: 'FIFA fee cap 6% · Dual consent required · FA GBE work permit · IMS registration deadline',
  banner: 'A Figer client is transferring from Flamengo to a Premier League club. Figer represents both the player and the acquiring club (dual representation). FIFA Agent Regulations 2023 require explicit written consent from both parties, combined fee cap of 6%, and IMS registration. The FA requires a Governing Body Endorsement (GBE) work permit. One missing document voids the entire fee.',
  risk: 'Critical',
  scenarioNum: 'Transfer',
  icon: 'scale',
  color: 'text-emerald-400',
  agents: [AGENTS.transferAgent, AGENTS.fifaCompliance, AGENTS.legalAgent, AGENTS.financialAgent],
  connectors: [
    { name: 'FIFA IMS Portal', status: 'connected', type: 'Intermediary Management System', icon: 'shield', detail: 'Transfer window closes in 72 hours — IMS submission required' },
    { name: 'CBF Registration System', status: 'connected', type: 'Brazilian FA Database', icon: 'database', detail: 'Player contract registered — ITC pending from CBF to FA' },
    { name: 'FA GBE Calculator', status: 'syncing', type: 'UK Work Permit Assessment', icon: 'globe', detail: 'Player international caps: 12 (Brazil U-23) — GBE threshold: 70 points' },
    { name: 'Figer Mandate Archive', status: 'connected', type: 'Agent Mandate Documentation', icon: 'file-text', detail: '3 active mandates for this player across 2 jurisdictions' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'DUAL REPRESENTATION ALERT. Figer is acting for both the player (sell-side mandate signed 14 March 2026) and the acquiring Premier League club (buy-side engagement letter 22 March 2026). FIFA Agent Regulations 2023 Articles 12-13 require: (1) Explicit written consent from the player acknowledging dual representation, (2) Explicit written consent from the club, (3) Full conflict-of-interest disclosure to both parties, (4) Combined fee must not exceed 6% of player gross remuneration under Article 16. Current status: Player consent — SIGNED. Club consent — PENDING. Transfer window closes in 72 hours. Without club consent, Figer\'s entire fee entitlement is void.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Fee structure analysis. Player gross remuneration: £4.2M/year × 5-year contract = £21M total. FIFA fee cap at 6% (dual representation): £1.26M maximum. Figer\'s proposed fee: £1.1M (5.24% — within cap). Payment routing: Club pays Figer directly through FIFA IMS — no intermediary routing permitted under Articles 17-20. AML check: Payment source verified — club operating account, no third-party funding flags. COAF (Brazilian Financial Intelligence Unit) notification required for cross-border receipt exceeding R$50,000. Receita Federal declaration required within 30 days of receipt.' },
    { agentId: 'fifa', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The buy-side engagement letter is dated 22 March 2026 but references a "verbal agreement from February 2026." Under FIFA Agent Regulations 2023 Article 14, mandates must be in writing before any representation begins. If FIFA determines that Figer began representing the club in February without a written mandate, the entire buy-side fee (£550K) is at risk. Additionally, the player\'s existing CBF-registered mandate does not explicitly reference dual representation consent as required by Article 12. A standalone FIFA dual representation consent form is required — not just a clause in the original mandate.' },
    { agentId: 'legal', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Cross-referencing CAS jurisprudence. CAS 2024/A/9847 (Agent v. Club) — CAS ruled that verbal agreements preceding written mandates do not retroactively validate representation. The February verbal agreement creates a vulnerability. Additionally, FA GBE assessment shows the player scores 65 points against a 70-point threshold. The transfer will fail at FA registration unless the club applies for an exceptions panel review, or the player\'s recent U-23 caps are recalculated under the revised 2026 GBE framework. If the work permit fails, the entire transfer collapses.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Compliant Transfer Package: (1) Execute standalone FIFA Dual Representation Consent Form — player AND club sign simultaneously, with explicit Article 12-13 language. Cryptographically timestamped via CendiaChronos. (2) Amend the buy-side engagement letter to remove the February verbal agreement reference — the written mandate date of 22 March 2026 is the effective date. (3) File IMS registration immediately. (4) Club to file FA GBE exceptions panel application today — Datacendia prepares the evidence bundle showing revised cap weighting under 2026 framework. (5) Complete AML documentation: COAF notification prepared, Receita Federal declaration template pre-filled. Every document sealed with RFC 3161 timestamp and ML-DSA-65 signatures.' },
    { agentId: 'fifa', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Standalone consent form with cryptographic timestamp eliminates the retroactivity risk identified in CAS 2024/A/9847. The amended engagement letter removes the February reference — clean mandate trail. IMS registration with Datacendia\'s evidence seal gives FIFA auditors complete provenance: mandate → consent → fee calculation → IMS submission, all cryptographically linked. Dissent WITHDRAWN. This is the evidence standard FIFA Agent Regulations 2023 intended.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f4e8c62d1a7b9530e8d2c96f4b1a3e5d7c9f0a2b4d6e8f0a2b4d6e8f0a2b4d6e',
    merkleRoot: 'b7c9e1d3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9',
    merkleLabel: 'Merkle Tree Root (Dual consent + Fee calculation + IMS registration + GBE application + AML documentation)',
    complianceLabel: 'FIFA Agent Regulations 2023 Status',
    complianceValue: 'DUAL REPRESENTATION COMPLIANT',
    complianceThreshold: 'Articles 12-16 satisfied',
    agents: ['Transfer Governance Agent', 'FIFA Compliance Agent', 'Legal Agent', 'Financial Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Dual Representation Transfer Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete dual representation compliance evidence for FIFA IMS audit: player consent, club consent, conflict disclosure, fee cap calculation (5.24% ≤ 6%), AML clearance, and GBE application. Every document timestamped with RFC 3161 and signed with ML-DSA-65 post-quantum signatures.',
    evidenceChain: 'Mandate verification → Dual consent → Fee cap calculation → IMS registration → GBE application → AML/COAF → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will conduct a complete dual representation transfer compliance review — validating FIFA mandates, fee caps, IMS registration, FA work permits, and AML documentation with cryptographic evidence sealing.',
  phaseLabels: ['Mandate & Fee Analysis', 'Compliance Review & Debate', 'Resolution & Evidence Seal'],
};

// =============================================================================
// SCENARIO 2 — MINOR PLAYER PROTECTION (FIFA Article 19)
// =============================================================================

const S2: TemplateScenario = {
  id: 'minor-protection',
  title: 'Minor Player Protection — FIFA Article 19',
  subtitle: 'Player age 16 · International transfer · FIFA Subcommittee approval · ECA child safeguarding',
  banner: 'Figer scouts a 16-year-old talent from a São Paulo escolinha for a Portuguese Primeira Liga club. FIFA RSTP Article 19 prohibits international transfers of minors under 18 unless specific exceptions apply. This requires FIFA Subcommittee approval, parental consent, education plans, and compliance with Brazil\'s Estatuto da Criança e do Adolescente (ECA). Violations carry multi-year transfer bans for clubs.',
  risk: 'Critical',
  scenarioNum: 'Youth',
  icon: 'shield-check',
  color: 'text-orange-400',
  agents: [AGENTS.youthProtection, AGENTS.fifaCompliance, AGENTS.legalAgent, AGENTS.dataProtection],
  connectors: [
    { name: 'FIFA Player Status Subcommittee', status: 'syncing', type: 'Minor Transfer Approval', icon: 'shield', detail: 'Application pending — average processing: 45 days' },
    { name: 'CBF Youth Registration (BID)', status: 'connected', type: 'Brazilian Youth Database', icon: 'database', detail: 'Player registered since age 14 — training records from 2022' },
    { name: 'ECA Compliance Registry', status: 'connected', type: 'Child Protection Framework', icon: 'shield-check', detail: 'Estatuto da Criança — working hours, education, welfare' },
    { name: 'FPF Agent Portal', status: 'ready', type: 'Portuguese FA Registration', icon: 'globe', detail: 'Primeira Liga foreign player quota: 8 non-EU slots available' },
  ],
  script: [
    { agentId: 'youth', phase: 'phase1', type: 'warning', delay: 800, content: 'MINOR TRANSFER PROTECTION ALERT. Player is 16 years old — born 8 June 2009. Any international transfer requires FIFA RSTP Article 19 exception. Three permitted exceptions: (1) Parents move to destination country for non-football reasons — NOT APPLICABLE. (2) Transfer within EU/EEA for player aged 16-18 with specific safeguards — POTENTIALLY APPLICABLE (Portugal is EU). (3) Player lives within 50km of border — NOT APPLICABLE. Exception 2 applies IF the club provides adequate football education alongside academic education, appropriate living arrangements, and a designated welfare officer. Figer must document ALL conditions and file with FIFA Subcommittee. HARD STOP: No transfer activity until Subcommittee approval confirmed.' },
    { agentId: 'data', phase: 'phase1', type: 'analysis', delay: 2500, content: 'LGPD/GDPR DATA PROTECTION ANALYSIS. This minor\'s personal data is dual-protected: Brazilian LGPD Article 14 — specific protections for children\'s data, requires parental consent for all processing. GDPR Article 8 — applies at Portuguese destination, parental consent for under-16 data processing. Data categories held by Figer: medical records, academic transcripts, family financial information, biometric data (player performance metrics). ALL processing requires documented lawful basis under both LGPD and GDPR. ANPD (Brazilian data authority) has escalated enforcement on minors\' data in sports contexts.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Brazil\'s ECA imposes strict limits on minors\' working conditions. Article 67: No hazardous, nighttime, or exhausting work for under-18. Professional football training schedules at European clubs regularly exceed ECA working hour limits. Portuguese labour law permits employment from age 16 but with restrictions. The FIFA Subcommittee application must demonstrate compliance with BOTH Portuguese youth employment law AND ECA standards. Additionally, Figer\'s agency mandate with a 16-year-old requires co-signature by legal guardian AND approval by a Brazilian Labour Court judge for international relocation.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. FIFA Subcommittee approval rate for Brazil-to-Portugal transfers of 16-year-olds: 67% (24 of 36 applications in 2024-2026). Most common rejection reasons: inadequate education plan (8), no designated welfare officer (4), unsatisfactory living arrangements (3), incomplete parental consent (1). The Portuguese club must provide: certified education programme (Ministry of Education approved), designated welfare officer (not the coach), and club-supervised residence. Figer must also verify training compensation — all clubs that trained the player from age 12 are entitled under FIFA RSTP Articles 20-21.' },
    { agentId: 'youth', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Minor Protection Evidence Package: (1) FIFA Subcommittee Application — complete bundle: age verification, Exception 2 documentation, education programme, welfare officer CV, accommodation plans. (2) Parental consent — dual-language consent form signed by both parents, witnessed by Brazilian notary. (3) ECA compliance plan — training schedule mapped against ECA limits. (4) LGPD/GDPR data protection — parental consent for all data categories, SCCs for cross-border transfer. (5) Training compensation calculation from CBF BID records. (6) Brazilian Labour Court approval for international relocation mandate. Every document cryptographically sealed. HARD STOP enforced until Subcommittee approval.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The Minor Protection Evidence Package addresses all 4 common rejection factors. Dual-jurisdiction compliance (ECA + Portuguese labour law) demonstrates Figer\'s duty of care extends beyond FIFA requirements. LGPD/GDPR dual-consent framework protects Figer against data authority enforcement. Training compensation calculation preserves developing clubs\' rights. Dissent WITHDRAWN. This is the gold standard for minor international transfers — the evidence trail proves Figer acted with maximum diligence.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    merkleRoot: 'c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5',
    merkleLabel: 'Merkle Tree Root (Article 19 application + Parental consent + ECA plan + LGPD/GDPR consent + Training compensation)',
    complianceLabel: 'FIFA Article 19 Status',
    complianceValue: 'APPLICATION FILED — PENDING SUBCOMMITTEE',
    complianceThreshold: 'Exception 2 conditions documented',
    agents: ['Youth Protection Agent', 'FIFA Compliance Agent', 'Legal Agent', 'Data Protection Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Minor Player Protection Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete FIFA Article 19 minor protection compliance: Subcommittee application, parental dual-consent, ECA working conditions plan, LGPD/GDPR data protection, training compensation, and Labour Court mandate approval.',
    evidenceChain: 'Age verification → Exception assessment → Education plan → Welfare officer → Parental consent → ECA compliance → LGPD/GDPR → Training compensation → Labour Court → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will conduct a complete FIFA Article 19 minor protection review — validating exceptions, parental consent, child welfare, data protection, and training compensation with cryptographic evidence sealing.',
  phaseLabels: ['Protection Assessment', 'Legal & Data Review', 'Resolution & Evidence Seal'],
};

// =============================================================================
// SCENARIO 3 — CAS ARBITRATION (Unpaid fee dispute)
// =============================================================================

const S3: TemplateScenario = {
  id: 'cas-arbitration',
  title: 'CAS Arbitration — Unpaid Agent Fee Dispute',
  subtitle: 'Club refuses £880K fee · FIFA DRC filing · CAS expedited proceedings · 48-hour evidence deadline',
  banner: 'A Saudi Pro League club refuses to pay Figer\'s £880K agent fee, claiming the mandate was invalid and the fee exceeds FIFA caps. Figer must file with FIFA Dispute Resolution Chamber (DRC) and prepare for CAS expedited proceedings. Complete contemporaneous evidence determines the outcome — reconstructed evidence will be dismissed.',
  risk: 'High',
  scenarioNum: 'CAS',
  icon: 'gavel',
  color: 'text-indigo-400',
  agents: [AGENTS.casArbitration, AGENTS.legalAgent, AGENTS.financialAgent, AGENTS.integrityAgent],
  connectors: [
    { name: 'CAS Arbitration Portal', status: 'connected', type: 'Court of Arbitration for Sport', icon: 'gavel', detail: 'Expedited procedure — evidence due within 48 hours' },
    { name: 'FIFA DRC Filing System', status: 'connected', type: 'Dispute Resolution Chamber', icon: 'scale', detail: 'Claim #DRC-2026-04721 filed — club response pending' },
    { name: 'SAFF Agent Registry', status: 'connected', type: 'Saudi Football Federation', icon: 'globe', detail: 'Figer SAFF registration verified — valid through Dec 2027' },
    { name: 'Figer Evidence Vault', status: 'connected', type: 'Cryptographic Evidence Archive', icon: 'lock', detail: '47 documents sealed for this transfer — complete chain' },
  ],
  script: [
    { agentId: 'cas', phase: 'phase1', type: 'warning', delay: 800, content: 'CAS EXPEDITED PROCEEDINGS ACTIVATED. Saudi Pro League club has filed a counter-claim at CAS challenging Figer\'s £880K fee. Club\'s three arguments: (1) Mandate signed by Sporting Director, not an authorised signatory under Saudi corporate law — mandate is void. (2) Fee represents 4.2% of player remuneration — club claims sole mandating party, making cap 3% (£628K). (3) IMS registration filed 2 hours before window close — club claims this was "after effective transfer completion." CAS ordered evidence within 48 hours. Without complete contemporaneous evidence, Figer loses £880K.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Fee calculation forensics. Player total remuneration: £20.95M (5-year contract). Figer fee: £880K = 4.2%. If player-side only (3% cap): max £628K — club argument succeeds, Figer loses £252K. If dual representation (6% cap): max £1.257M — fee compliant. Critical question: Was Figer representing both parties? Evidence: Player mandate signed 3 February 2026. Club engagement letter signed 18 February 2026 by Sporting Director Mohammed Al-Rashidi. Dual representation consent signed 19 February 2026. All documents in Datacendia evidence vault with RFC 3161 timestamps.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Under Saudi Companies Law (Royal Decree M/3), corporate obligations must be signed by an authorised representative. CAS 2023/A/9612 (Agent v. Saudi Club) — CAS upheld a Saudi club\'s challenge to an agency agreement signed by a Sporting Director without Board authority. If Al-Rashidi lacked Board resolution authority at signing, the mandate is void under Saudi law. Figer must produce evidence of Al-Rashidi\'s signatory authority at date of signing — not just his job title.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The IMS timing argument is weak — CAS 2024/A/9901 established IMS registration up to window close is valid. However, Datacendia\'s cryptographic timestamps prove the IMS submission was prepared 6 days before filing — deliberate timing for document verification, not panic. The critical evidence is the Board Resolution dated 15 January 2026 authorising Al-Rashidi to "execute all transfer-related agreements on behalf of the club" — attached to the original engagement letter in Datacendia\'s vault.' },
    { agentId: 'cas', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia CAS Evidence Bundle — 48-Hour Package: (1) Mandate chain: Player mandate (3 Feb) → Club engagement (18 Feb) → Dual consent (19 Feb) — all RFC 3161 timestamped. (2) Board Resolution (15 Jan 2026) authorising Al-Rashidi — captured before dispute arose. (3) Fee calculation: dual representation 4.2% ≤ 6% cap. (4) IMS timing: 6-day preparation timestamps. (5) CAS-formatted Merkle tree linking all 47 documents. One-click export for CAS expedited proceedings.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The Board Resolution is decisive — proves Al-Rashidi had authority at signing, destroying the club\'s primary argument. Cryptographic timestamp proves the Resolution was captured in real-time, not manufactured post-dispute. CAS consistently holds that contemporaneous cryptographic evidence carries higher evidentiary weight than reconstructed paper trails. Combined with IMS timing precedent (CAS 2024/A/9901), all three club arguments fail. Dissent WITHDRAWN. This evidence bundle should result in full fee recovery plus CAS costs.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5',
    merkleRoot: 'e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9',
    merkleLabel: 'Merkle Tree Root (47 documents: Mandate chain + Board Resolution + Fee calculation + IMS timing + Dual consent)',
    complianceLabel: 'CAS Evidence Status',
    complianceValue: 'EVIDENCE BUNDLE SEALED — 48HR DEADLINE MET',
    complianceThreshold: 'CAS Rules of Procedure satisfied',
    agents: ['CAS Arbitration Agent', 'Legal Agent', 'Financial Agent', 'Integrity Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — CAS Expedited Evidence Bundle Sealed',
    guaranteeBody: 'This cryptographic bundle seals 47 documents for CAS expedited proceedings: mandate chain, Board Resolution signatory authority, fee calculation workings, IMS registration timing evidence, and dual representation consent.',
    evidenceChain: 'Mandate chain → Board Resolution → Dual consent → Fee calculation → IMS timing → Merkle tree → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will prepare a CAS expedited evidence bundle — validating mandate chains, signatory authority, fee compliance, and IMS timing with cryptographic evidence.',
  phaseLabels: ['Claim Analysis & Forensics', 'Legal Challenge & Debate', 'Evidence Bundle & Seal'],
};

// =============================================================================
// SCENARIO 4 — TPO DETECTION
// =============================================================================

const S4: TemplateScenario = {
  id: 'tpo-detection',
  title: 'Third-Party Ownership Detection — South American Transfer',
  subtitle: 'FIFA RSTP Article 18ter · Hidden investment structure · Shell company analysis · Circular ownership',
  banner: 'Figer is facilitating a transfer of a Colombian player from an Argentine club to a LaLiga club. Due diligence reveals a complex ownership structure involving a Uruguayan investment vehicle with indirect economic rights. FIFA banned TPO globally in 2015, but South American investment structures still surface. If Figer proceeds without detecting TPO, all parties face FIFA sanctions.',
  risk: 'High',
  scenarioNum: 'TPO',
  icon: 'search',
  color: 'text-red-400',
  agents: [AGENTS.integrityAgent, AGENTS.fifaCompliance, AGENTS.legalAgent, AGENTS.financialAgent],
  connectors: [
    { name: 'FIFA TPO Registry', status: 'connected', type: 'Third-Party Ownership Database', icon: 'search', detail: 'Global TPO violations database — 847 historical cases' },
    { name: 'AFA Registration System', status: 'connected', type: 'Argentine FA Database', icon: 'database', detail: 'Player contract + ownership structure from Superliga' },
    { name: 'Uruguayan Corporate Registry', status: 'syncing', type: 'Beneficial Ownership Lookup', icon: 'building-2', detail: 'Cross-referencing investment vehicle — 4 corporate layers' },
    { name: 'RFEF Agent Portal', status: 'ready', type: 'Spanish FA Registration', icon: 'globe', detail: 'LaLiga salary cap assessment pending' },
  ],
  script: [
    { agentId: 'integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'TPO SCREENING ALERT. Due diligence on the Argentine club reveals 30% of the player\'s economic rights were transferred to "Río de la Plata Football Investments S.A." — a Uruguayan sociedad anónima — in 2021. FIFA RSTP Article 18ter prohibits any third party from having influence over employment, transfer, or club affairs. The Argentine club\'s AFA filing (January 2026) shows the club acquired 100% of economic rights in December 2024. However, the Uruguayan entity has not been dissolved, and its beneficial owners include an individual who is also a board member of the Argentine club. HARD STOP: No transfer activity until TPO risk eliminated.' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Financial forensics on Río de la Plata Football Investments S.A. Entity capitalised at US$2.1M in 2021 — 30% of player\'s then-value (US$7M). The December 2024 "buyback" was US$4.5M — 30% of updated US$15M valuation. Payment: Argentine club to entity at Banco República, Montevideo. Beneficial ownership trace: controlling shareholder (67%) is Gabriel Martínez Aguirre — who is also Vice President of the Argentine club. This creates a circular structure: the club paid US$4.5M to a company controlled by its own Vice President. This is textbook TPO circumvention.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The circular structure may not technically be TPO if the club genuinely controls 100% of economic rights post-December 2024. CAS 2022/A/8945 established TPO terminates when the club acquires all rights, regardless of the former third-party owner\'s relationships. However, the VP\'s dual role creates a FIFA Ethics conflict. If Figer proceeds and FIFA later determines TPO circumvention, Figer faces: (a) Fee forfeiture, (b) Agent licence suspension, (c) Investigation across all 11 jurisdictions. The risk is asymmetric — one fee vs. Figer\'s entire business.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. FIFA has sanctioned 23 clubs for TPO violations since 2015 — 7 involved structures where a club official was beneficial owner of the third-party entity. In all 7 cases, FIFA treated the arrangement as ongoing TPO regardless of formal rights transfer. The circular payment is a specific red flag in FIFA\'s investigation protocol. Figer\'s due diligence obligation under Agent Regulations 2023 requires "reasonable investigation" — proceeding without resolving this falls below the threshold.' },
    { agentId: 'integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia TPO Resolution Protocol: (1) HARD STOP maintained. (2) Require Argentine club to provide: (a) Independent legal opinion confirming no remaining third-party economic rights, (b) Beneficial ownership disclosure showing dissolution of Uruguayan entity or complete separation from VP, (c) AFA certification of 100% rights. (3) If conditions met: proceed with full TPO compliance documentation sealed. (4) If NOT met: Figer withdraws and files proactive disclosure with FIFA demonstrating detection and refusal to participate. Proactive disclosure protects Figer\'s licence. Every step cryptographically sealed.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The TPO Resolution Protocol protects Figer regardless of outcome. If resolved, Figer has compliance documentation. If not, proactive disclosure demonstrates the "effective compliance programme" that protects agent licences. CAS rewards agents who detect and disclose violations over those who proceed with wilful blindness. Cryptographic evidence proves Figer\'s detection occurred before any transfer activity. Dissent WITHDRAWN. This transforms a potential regulatory catastrophe into a demonstration of Figer\'s governance standards.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6',
    merkleRoot: 'f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1',
    merkleLabel: 'Merkle Tree Root (Ownership trace + Financial forensics + CAS precedents + TPO resolution protocol)',
    complianceLabel: 'TPO Screening Status',
    complianceValue: 'HARD STOP — PENDING RESOLUTION',
    complianceThreshold: 'FIFA RSTP Article 18ter',
    agents: ['Integrity Agent', 'FIFA Compliance Agent', 'Legal Agent', 'Financial Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — TPO Detection & Resolution Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete TPO screening evidence: beneficial ownership trace, financial forensics, circular structure detection, CAS precedent analysis, and resolution protocol.',
    evidenceChain: 'Ownership trace → Financial forensics → Beneficial ownership → Circular detection → CAS precedents → Resolution protocol → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will conduct TPO screening — tracing beneficial ownership, analyzing financial structures, cross-referencing CAS precedents, and enforcing hard stops with cryptographic evidence.',
  phaseLabels: ['Ownership Analysis', 'Legal & Financial Forensics', 'Resolution Protocol'],
};

// =============================================================================
// SCENARIO 5 — BRAZILIAN TAX & AML
// =============================================================================

const S5: TemplateScenario = {
  id: 'brazil-tax-aml',
  title: 'Receita Federal & COAF — Cross-Border Fee Compliance',
  subtitle: 'R$12M fee receipt · COAF AML alert · Receita Federal audit · Image rights tax structure',
  banner: 'Figer receives a R$12M agent fee from a Saudi club transfer routed through FIFA IMS. Receita Federal requires precise income classification — IRPJ, CSLL, PIS/COFINS, and ISS all apply. COAF has flagged the payment for AML review due to the Saudi origin and amount. Simultaneously, a Figer-structured image rights company is under Receita Federal audit.',
  risk: 'High',
  scenarioNum: 'Tax/AML',
  icon: 'banknote',
  color: 'text-yellow-400',
  agents: [AGENTS.financialAgent, AGENTS.legalAgent, AGENTS.integrityAgent, AGENTS.dataProtection],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Brazilian Tax Authority', icon: 'landmark', detail: 'Image rights audit notice — 30-day response deadline' },
    { name: 'COAF Portal', status: 'syncing', type: 'Financial Intelligence Unit', icon: 'alert-triangle', detail: 'AML alert — R$12M cross-border from Saudi entity' },
    { name: 'BACEN Exchange System', status: 'connected', type: 'Central Bank FX Reporting', icon: 'banknote', detail: 'Foreign exchange contract registered — PTAX rate locked' },
    { name: 'FIFA IMS Payment Tracker', status: 'connected', type: 'Payment Verification', icon: 'shield', detail: 'Club payment instruction verified — IMS route confirmed' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'RECEITA FEDERAL AUDIT ALERT. Two concurrent compliance events: (1) R$12M agent fee requires correct Brazilian tax classification — IRPJ 15% + 10% surcharge on profit exceeding R$240K/year, CSLL 9%, PIS/COFINS 3.65% (cumulative) or 9.25% (non-cumulative), ISS São Paulo 5%. Total effective rate: 34-40%. Incorrect classification triggers 75-150% penalties. (2) Receita Federal has opened an audit into a Figer-structured image rights company (pessoa jurídica) for a high-profile client — they suspect the company lacks "commercial substance." This is the most common Receita Federal challenge to football image rights structures in Brazil.' },
    { agentId: 'integrity', phase: 'phase1', type: 'analysis', delay: 2500, content: 'COAF AML ANALYSIS. COAF Resolution 36/2021 requires sports agents to report transactions exceeding R$50,000, transactions with FATF-monitored jurisdictions, and unusual payment routing. The R$12M from Saudi Arabia triggers all three criteria. Figer must file a COAF Suspicious Transaction Report (STR) within 24 hours — not because the transaction is suspicious, but because the amount and origin meet mandatory reporting thresholds. Failure to file carries penalties of R$20M or 2× the transaction amount. The FIFA IMS payment routing is clean — direct from club operating account — but COAF requires documentation of source of funds, beneficial ownership of the paying entity, and the relationship between the payment and the underlying transfer.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The image rights audit is the more dangerous issue. Receita Federal has challenged 340+ football image rights companies since 2019 under the "commercial substance" doctrine. Their position: if more than 95% of the PJ\'s revenue comes from a single source (the player\'s club), and the PJ has no employees, no office, and no business activities beyond receiving image rights payments, it lacks commercial substance and should be treated as personal income. Personal income tax rate: 27.5% vs. PJ rate: ~11%. Figer structured this arrangement — if Receita Federal reclassifies the PJ, the player faces back taxes plus penalties, and Figer faces professional liability for the advice.' },
    { agentId: 'data', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The image rights PJ holds personal financial data of the player that falls under LGPD. If Receita Federal requests access to the PJ\'s records during the audit, Figer must verify that: (1) Receita Federal\'s request has legal basis under Brazilian tax law, (2) Only data relevant to the tax audit is disclosed, (3) The player is notified under LGPD Article 18 of the data sharing with government authority. ANPD has issued guidance that tax audits do not override LGPD data minimisation requirements — Figer must produce only the documents specified in the audit notice, not blanket access to all records.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Tax & AML Compliance Package: (1) COAF STR — filed within 24 hours with complete documentation: FIFA IMS payment confirmation, source of funds, beneficial ownership of Saudi club, transfer agreement. (2) Agent fee tax return preparation — IRPJ/CSLL/PIS/COFINS/ISS calculations with supporting workings, filed via e-CAC. (3) Image rights audit response — Datacendia assembles evidence of commercial substance: contracts with 3 sponsors (not just the club), PJ financial statements showing diversified revenue, office lease, and two part-time employees. If substance can be demonstrated, the PJ survives. (4) LGPD-compliant data disclosure — only audit-specified documents, with player notification. Every document cryptographically sealed.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The critical question is whether the image rights PJ has genuine commercial substance. If Datacendia\'s evidence shows 3 sponsor contracts and diversified revenue, the Receita Federal challenge is defensible — matching the winning pattern in recent Administrative Tax Court decisions. The COAF STR filed proactively demonstrates Figer\'s AML compliance — much better than being asked "why didn\'t you file?" The LGPD-compliant disclosure shows Figer respects data rights even under government pressure. Dissent WITHDRAWN. This package transforms two separate compliance threats into a demonstration of Figer\'s integrated governance.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7',
    merkleRoot: 'a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3',
    merkleLabel: 'Merkle Tree Root (COAF STR + Tax calculations + Image rights evidence + LGPD disclosure + BACEN FX)',
    complianceLabel: 'Receita Federal & COAF Status',
    complianceValue: 'COAF FILED — TAX RESPONSE PREPARED',
    complianceThreshold: 'COAF 36/2021 + Receita Federal requirements',
    agents: ['Financial Agent', 'Legal Agent', 'Integrity Agent', 'Data Protection Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Brazilian Tax & AML Compliance Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete Brazilian tax and AML compliance: COAF STR, agent fee tax calculations, image rights commercial substance evidence, LGPD-compliant data disclosure, and BACEN FX documentation.',
    evidenceChain: 'COAF STR → Tax classification → Image rights audit → LGPD disclosure → BACEN FX → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will conduct Brazilian tax and AML compliance review — COAF reporting, Receita Federal audit response, image rights defence, and LGPD data governance with cryptographic evidence.',
  phaseLabels: ['Tax & AML Assessment', 'Audit Defence & Data Review', 'Compliance Package & Seal'],
};

// =============================================================================
// SCENARIO 6 — MULTI-JURISDICTION IMAGE RIGHTS
// =============================================================================

const S6: TemplateScenario = {
  id: 'image-rights',
  title: 'Multi-Jurisdiction Image Rights Structuring',
  subtitle: 'Brazil PJ · Spain sociedad · UK personal income · Saudi employer-owned · 4 tax regimes',
  banner: 'A Figer client plays in Spain but has image rights deals in Brazil, the UK, and Saudi Arabia. Each jurisdiction treats image rights differently — Brazil allows pessoa jurídica structures, Spain requires sociedad civil, UK taxes as personal income, and Saudi Arabia treats them as employer-owned. One incorrect structure triggers back taxes and penalties across all 4 jurisdictions simultaneously.',
  risk: 'High',
  scenarioNum: 'Image Rights',
  icon: 'eye',
  color: 'text-violet-400',
  agents: [AGENTS.financialAgent, AGENTS.legalAgent, AGENTS.dataProtection, AGENTS.fifaCompliance],
  connectors: [
    { name: 'Receita Federal do Brasil', status: 'connected', type: 'Brazilian Tax Authority', icon: 'landmark', detail: 'PJ image rights company — annual filing due in 60 days' },
    { name: 'Agencia Tributaria (Spain)', status: 'connected', type: 'Spanish Tax Authority', icon: 'landmark', detail: 'IRPF non-resident image rights — Beckham Law assessment' },
    { name: 'HMRC (UK)', status: 'syncing', type: 'UK Tax Authority', icon: 'landmark', detail: 'Image rights sponsorship from UK brand — withholding assessment' },
    { name: 'GAZT (Saudi Arabia)', status: 'ready', type: 'Saudi Tax Authority', icon: 'landmark', detail: 'Image rights treated as employment income — 0% personal tax' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'MULTI-JURISDICTION IMAGE RIGHTS ALERT. Figer client currently plays for a LaLiga club. Image rights income streams from 4 jurisdictions: (1) BRAZIL — Player\'s PJ (pessoa jurídica) receives R$3.2M/year from 2 Brazilian sponsors. PJ tax rate ~11% vs personal rate 27.5%. Receita Federal is actively challenging PJ structures lacking "commercial substance." (2) SPAIN — Club pays 15% of salary as image rights through a sociedad civil. Spain\'s Beckham Law (Royal Decree 687/2005) allows flat 24% tax for qualifying non-residents — but image rights income may not qualify depending on structure. (3) UK — £400K sponsorship deal with a British sportswear brand. HMRC taxes image rights of non-residents performing in the UK under Section 966 ITA 2007. (4) SAUDI ARABIA — R$1.8M from Saudi exhibition matches. Saudi has 0% personal income tax but image rights may be reclassified as business income (20% Zakat). Total exposure if structures fail: estimated €2.1M in back taxes plus penalties.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Jurisdiction-by-jurisdiction structure assessment. BRAZIL: The PJ has 2 sponsor contracts and 1 part-time employee — meets minimum substance threshold per recent CARF decisions. Risk: MEDIUM. SPAIN: The Beckham Law application was filed when the player arrived in 2024. Image rights through the sociedad civil are separate from employment income. However, Agencia Tributaria has been challenging sociedad civil structures where the player is the sole socio — they argue it lacks genuine partnership character. Risk: HIGH. UK: Section 966 ITA 2007 requires withholding on image rights payments to non-UK performers. The UK brand is currently paying gross — no withholding applied. HMRC will assess penalties plus interest. Risk: CRITICAL. SAUDI: Exhibition match fees are typically treated as performance income, not image rights. If reclassified as business income from a permanent establishment, 20% Zakat applies. Risk: LOW (Saudi rarely enforces on foreign performers).' },
    { agentId: 'data', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The image rights structures involve the player\'s personal financial data across 4 jurisdictions. Under LGPD (Brazil), GDPR (Spain), UK GDPR, and Saudi PDPL, Figer holds and processes sensitive financial data in each country. If ANY tax authority in one jurisdiction requests the player\'s global image rights structure (common in audits), Figer must navigate 4 different data protection regimes simultaneously. Spain\'s Agencia Tributaria can request information from Brazil under the OECD Common Reporting Standard (CRS) — meaning the Brazilian PJ\'s financials may be automatically shared with Spain. If the Spanish structure contradicts the Brazilian structure (e.g., different declared income), both jurisdictions will investigate. Figer must ensure all 4 structures tell a consistent, truthful story.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. FIFA Agent Regulations 2023 Article 22 requires agents to "act in the best interests of their client." If Figer structured these image rights arrangements and any jurisdiction imposes back taxes, the player may claim Figer provided negligent financial advice — creating professional liability exposure. Additionally, under FIFA\'s agent disclosure requirements, all agent-structured financial arrangements must be documented and available for FIFA audit. The 4-jurisdiction image rights structure must be fully disclosed in Figer\'s annual FIFA compliance filing.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Image Rights Compliance Package: (1) UK URGENT — Contact the UK brand immediately to implement Section 966 withholding. File voluntary disclosure with HMRC to mitigate penalties (HMRC rewards voluntary disclosure with reduced penalties of 10-30% vs 100% for discovery). (2) SPAIN — Engage Spanish tax counsel to verify the sociedad civil has genuine partnership character (2+ socios with real economic participation). If not, restructure before Agencia Tributaria\'s next audit cycle. (3) BRAZIL — Document PJ commercial substance: 2 sponsors, 1 employee, office lease. Prepare CARF-ready evidence. (4) SAUDI — Maintain current treatment, low enforcement risk. (5) Cross-jurisdiction consistency check — Datacendia maps all 4 structures to ensure no contradictions in declared income. CRS automatic exchange will reveal inconsistencies. (6) FIFA disclosure filing prepared with complete structure documentation. Everything sealed cryptographically.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The UK voluntary disclosure is the critical immediate action — the longer Figer waits, the higher the penalties. Spain\'s sociedad civil restructuring should happen in the current tax year to avoid retrospective challenge. The cross-jurisdiction consistency check is the most valuable element — most agents never verify that their structures tell the same story across jurisdictions, and CRS automatic exchange catches contradictions within 12-18 months. The FIFA disclosure protects Figer\'s licence. Dissent WITHDRAWN. This package transforms fragmented jurisdiction-by-jurisdiction advice into integrated global compliance.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8',
    merkleRoot: 'b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1',
    merkleLabel: 'Merkle Tree Root (Brazil PJ + Spain sociedad + UK withholding + Saudi treatment + CRS consistency + FIFA disclosure)',
    complianceLabel: 'Image Rights Compliance',
    complianceValue: 'UK DISCLOSURE FILED — 4 JURISDICTIONS ALIGNED',
    complianceThreshold: 'CRS consistency verified',
    agents: ['Financial Agent', 'Legal Agent', 'Data Protection Agent', 'FIFA Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Multi-Jurisdiction Image Rights Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete image rights compliance across 4 jurisdictions: Brazilian PJ substance evidence, Spanish sociedad restructuring, UK HMRC voluntary disclosure, Saudi treatment documentation, CRS cross-jurisdiction consistency check, and FIFA agent disclosure.',
    evidenceChain: 'Brazil PJ audit → Spain sociedad review → UK voluntary disclosure → Saudi assessment → CRS consistency → FIFA filing → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will conduct multi-jurisdiction image rights review — aligning tax structures across Brazil, Spain, UK, and Saudi Arabia with CRS consistency verification and FIFA disclosure.',
  phaseLabels: ['Jurisdiction Analysis', 'Data Protection & FIFA Review', 'Global Alignment & Seal'],
};

// =============================================================================
// SCENARIO 7 — FIFA AGENT LICENSING COMPLIANCE
// =============================================================================

const S7: TemplateScenario = {
  id: 'agent-licensing',
  title: 'FIFA Agent Licensing — Multi-Federation Compliance',
  subtitle: '11 jurisdictions · Annual exam · CPD requirements · Conduct standards · Fee disclosure',
  banner: 'Figer operates across 11 jurisdictions and must maintain agent licences with each national federation — CBF, FA, RFEF, DFB, FIGC, FFF, SAFF, UAEFA, QFA, USSF, and JFA. FIFA Agent Regulations 2023 introduced mandatory annual examinations, continuing professional development, and conduct standards. One lapsed licence means Figer cannot legally act in that jurisdiction — losing access to an entire transfer market.',
  risk: 'High',
  scenarioNum: 'Licensing',
  icon: 'shield-check',
  color: 'text-blue-400',
  agents: [AGENTS.fifaCompliance, AGENTS.legalAgent, AGENTS.transferAgent, AGENTS.integrityAgent],
  connectors: [
    { name: 'FIFA Agent Platform', status: 'connected', type: 'Global Agent Registry', icon: 'shield', detail: 'Figer registered — annual exam due in 45 days' },
    { name: 'CBF Agent Registry', status: 'connected', type: 'Brazilian FA', icon: 'database', detail: 'Primary licence — 200+ active player mandates' },
    { name: 'Multi-Federation Portal', status: 'syncing', type: '10 Additional Federations', icon: 'globe', detail: 'FA, RFEF, DFB, FIGC, FFF, SAFF, UAEFA, QFA, USSF, JFA' },
    { name: 'CPD Tracking System', status: 'connected', type: 'Professional Development', icon: 'book-open', detail: '12 CPD hours required annually — 8 completed' },
  ],
  script: [
    { agentId: 'fifa', phase: 'phase1', type: 'warning', delay: 800, content: 'FIFA AGENT LICENSING AUDIT. Annual compliance check across all 11 jurisdictions reveals: (1) FIFA annual exam — scheduled in 45 days. The 2026 exam covers new amendments to Agent Regulations including revised fee disclosure requirements and enhanced conflict-of-interest rules. Pass rate in 2025: 71%. Figer must ensure all registered agents within the organisation pass. (2) CBF — Primary licence current, renewal due October 2026. All 200+ mandates depend on this licence. (3) FA (England) — CPD requirement: 15 hours annually. Figer has logged 8 hours. 7 hours remaining, deadline in 60 days. (4) RFEF (Spain) — New requirement since January 2026: annual anti-money laundering certification. NOT YET COMPLETED. (5) SAFF (Saudi) — Licence renewal requires updated professional indemnity insurance covering Saudi operations. Current policy excludes Middle East. CRITICAL GAP.' },
    { agentId: 'legal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Risk assessment by jurisdiction. SAFF insurance gap is the most critical — without valid professional indemnity insurance covering Saudi operations, Figer\'s SAFF licence is technically suspended. Any transactions involving Saudi clubs since the policy exclusion began are legally vulnerable. If a Saudi club disputes a fee and discovers Figer\'s insurance didn\'t cover Saudi operations, the club could argue the mandate was void. Saudi Arabia represents approximately 15% of Figer\'s annual transfer volume (US$75M+). RFEF anti-money laundering certification is the second priority — Spain is Figer\'s largest European market. The FA CPD shortfall is manageable but must not be forgotten. The FIFA exam is a business continuity risk — if key personnel fail, Figer loses the ability to operate globally.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. There are currently 3 active transfer negotiations involving Saudi clubs — total potential fees of £2.1M. If we disclose the insurance gap now, these deals may collapse as clubs question Figer\'s authority to act. However, if we complete the deals and the insurance gap is discovered later, all 3 fees are at risk plus Figer faces potential FIFA disciplinary proceedings for operating without valid insurance. The commercially attractive option (complete deals first, fix insurance after) is the regulatory catastrophe option. We must obtain emergency insurance cover BEFORE any further Saudi activity.' },
    { agentId: 'integrity', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Cross-referencing FIFA\'s agent disciplinary database. In 2025, FIFA suspended 14 agents for operating with lapsed or inadequate licences — 5 involved insurance gaps, 3 involved expired CPD. In each case, all transactions completed during the gap period were investigated, and fees earned during that period were subject to forfeiture. FIFA\'s position is clear: operating without a valid licence in ANY jurisdiction taints all transactions, not just those in the affected jurisdiction. The SAFF gap must be treated as an organisation-wide emergency, not a Saudi-specific issue.' },
    { agentId: 'fifa', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Agent Licensing Compliance Package: (1) IMMEDIATE — Contact insurance broker for emergency Middle East extension to professional indemnity policy. Target: 48-hour binder. No further Saudi activity until cover confirmed. (2) RFEF AML certification — schedule online course and examination within 14 days. (3) FA CPD — register for 3 qualifying courses (7 hours) within next 30 days. (4) FIFA exam preparation — schedule internal prep sessions for all registered Figer agents. Datacendia provides jurisdiction-specific regulatory updates as study materials. (5) Create automated licence renewal calendar — every federation, every deadline, every requirement tracked with 90-day advance warnings. (6) Conduct retroactive review of all Saudi transactions during the insurance gap period — prepare voluntary disclosure to SAFF if required. All documentation cryptographically sealed.' },
    { agentId: 'transfer', phase: 'phase3', type: 'resolution', delay: 2500, content: 'Emergency insurance binder eliminates the immediate risk. The 3 active Saudi negotiations can resume once cover is confirmed — a 48-hour pause is commercially manageable. The automated licence calendar is the highest long-term value item — it prevents this situation from ever recurring across all 11 jurisdictions. The voluntary SAFF disclosure, if needed, demonstrates Figer detected and resolved the gap proactively. Dissent WITHDRAWN. This transforms a multi-jurisdiction compliance crisis into a systematic governance upgrade.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9',
    merkleRoot: 'c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3',
    merkleLabel: 'Merkle Tree Root (11 federation licences + Insurance binder + CPD records + AML certification + Exam registration)',
    complianceLabel: 'Agent Licensing Status',
    complianceValue: 'INSURANCE RESTORED — 11 LICENCES VERIFIED',
    complianceThreshold: 'FIFA Agent Regulations 2023 — all jurisdictions',
    agents: ['FIFA Compliance Agent', 'Legal Agent', 'Transfer Governance Agent', 'Integrity Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Multi-Federation Agent Licensing Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete agent licensing compliance across 11 jurisdictions: insurance cover verification, CPD completion, AML certification, exam registration, and automated renewal calendar. Retroactive Saudi transaction review included.',
    evidenceChain: 'Insurance emergency → SAFF restoration → RFEF AML cert → FA CPD → FIFA exam prep → 11-federation calendar → Retroactive review → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will audit agent licensing across 11 jurisdictions — verifying insurance, CPD, certifications, and exam readiness with automated compliance tracking.',
  phaseLabels: ['Licence Audit & Gap Detection', 'Risk Assessment & Debate', 'Remediation & Compliance Seal'],
};

// =============================================================================
// SCENARIO 8 — SOLIDARITY & TRAINING COMPENSATION
// =============================================================================

const S8: TemplateScenario = {
  id: 'training-compensation',
  title: 'Solidarity & Training Compensation — Brazilian Escolinha Trail',
  subtitle: 'FIFA RSTP Articles 20-21 · 6 training clubs · Age 12-23 · R$4.8M in claims',
  banner: 'A Figer client transfers from a Série A club to a Bundesliga club for €18M. Under FIFA RSTP Articles 20-21, every club that trained the player between ages 12 and 23 is entitled to training compensation or solidarity payments. The player came through 3 Brazilian escolinhas, 2 Série B clubs, and the current Série A club. Tracing this history through Brazil\'s fragmented youth football system is one of the hardest compliance challenges in world football.',
  risk: 'High',
  scenarioNum: 'Training',
  icon: 'trending-up',
  color: 'text-cyan-400',
  agents: [AGENTS.transferAgent, AGENTS.financialAgent, AGENTS.legalAgent, AGENTS.fifaCompliance],
  connectors: [
    { name: 'CBF BID System', status: 'connected', type: 'Brazilian Player Registration', icon: 'database', detail: 'Player history: 6 clubs from age 12 — BID records fragmented' },
    { name: 'FIFA TMS Portal', status: 'connected', type: 'Transfer Matching System', icon: 'shield', detail: 'International transfer €18M — solidarity mechanism triggered' },
    { name: 'DFB Registration System', status: 'syncing', type: 'German FA Database', icon: 'globe', detail: 'Bundesliga club registration pending — solidarity claims window open' },
    { name: 'Brazilian Club Registry', status: 'connected', type: 'Escolinha & Youth Club Records', icon: 'search', detail: '3 escolinhas identified — 1 dissolved, 1 merged, 1 active' },
  ],
  script: [
    { agentId: 'transfer', phase: 'phase1', type: 'warning', delay: 800, content: 'SOLIDARITY & TRAINING COMPENSATION ALERT. Player transferring internationally for €18M triggers FIFA RSTP: (1) SOLIDARITY MECHANISM (Article 21) — 5% of the €18M transfer fee (€900K) must be distributed to training clubs proportionally based on years of training between ages 12-23. (2) TRAINING COMPENSATION (Article 20) — may also apply if the player was out of contract at any point. Player training history (CBF BID records): Age 12-14: Escolinha Futebol Arte (São Paulo) — DISSOLVED in 2022. Age 14-16: Escolinha Craque do Futuro (São Paulo) — MERGED with another club in 2023. Age 16-18: EC Juventude (Série B) — active. Age 18-19: Guarani FC (Série B) — active. Age 19-23: Current Série A club — active. The dissolved and merged escolinhas create a documentation nightmare — who receives their share of the €900K solidarity payment?' },
    { agentId: 'financial', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Solidarity payment calculation. €900K total (5% of €18M), distributed by training years: Escolinha Futebol Arte (age 12-14, 2 years): Category IV club, €27K/year × 2 = €54K (6%). Escolinha Craque do Futuro (age 14-16, 2 years): Category IV, €54K (6%). EC Juventude (age 16-18, 2 years): Category III, €72K (8%). Guarani FC (age 18-19, 1 year): Category III, €36K (4%). Current Série A club (age 19-23, 4 years): Category I, €684K (76%). Total: €900K. Problem: €54K owed to a dissolved entity and €54K owed to a merged entity. Under Brazilian law, when a club dissolves, its assets transfer to its successor or, if none, are liquidated. CBF BID records don\'t consistently track successor entities for youth clubs. If Figer\'s client\'s new club pays the wrong entity, the claim remains open.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The dissolved escolinha creates a legal vacuum. Under Brazilian Civil Code (Lei 10.406/02), when an association dissolves, its residual assets go to an entity with similar purposes — but escolinhas rarely follow formal dissolution procedures. CAS 2021/A/7892 addressed a similar case and held that the buying club bears the risk of paying the wrong entity — if solidarity payments are made to an incorrect successor, the legitimate successor can claim again. Figer must obtain: (1) For dissolved club — Junta Comercial de São Paulo dissolution records showing successor entity or asset distribution, (2) For merged club — CBF registration confirming the surviving entity inherited training records. Without these documents, the Bundesliga club should escrow the €108K until successors are confirmed. This delays the transfer registration.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. The Bundesliga club\'s registration with DFB cannot be completed until all solidarity obligations are resolved or escrowed. FIFA Circular 1709 (2019) requires the new club to acknowledge solidarity obligations at the time of TMS registration. If the club registers without addressing the dissolved/merged escolinhas, FIFA can impose administrative sanctions. Additionally, the current Série A club (receiving 76% = €684K) may dispute the training years allocation — if they claim they provided training from age 18 (not 19), their share increases and all other shares decrease. CBF BID records show registration at age 19 but the club may produce evidence of earlier informal training.' },
    { agentId: 'transfer', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Training Compensation Resolution Package: (1) Dissolved escolinha — Datacendia searches Junta Comercial de São Paulo records for dissolution filing and successor entity. If no successor, the €54K is distributed proportionally among remaining training clubs per FIFA Circular 1709 guidance. (2) Merged escolinha — CBF BID query to confirm surviving entity. Transfer solidarity obligation to surviving club with documentation. (3) Série A club age dispute — Cross-reference CBF BID registration date (age 19 confirmed) with any prior informal training agreements. If no documented agreement exists, BID date controls. (4) Escrow arrangement — Bundesliga club escrows €108K (dissolved + merged shares) pending confirmation, allowing TMS registration to proceed. (5) Complete solidarity payment schedule prepared for all 6 clubs with FIFA-compliant documentation. Everything cryptographically sealed for FIFA TMS audit.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The escrow arrangement is the key — it allows TMS registration to proceed while protecting the Bundesliga club from double-payment risk. CAS has upheld escrow arrangements in solidarity disputes (CAS 2023/A/9456). The Junta Comercial search will resolve the dissolved escolinha within 10-15 business days. The CBF BID date controls the age dispute — informal training without BID registration does not create solidarity obligations under FIFA jurisprudence. Dissent WITHDRAWN. This package resolves a uniquely Brazilian compliance challenge that trips up even experienced agents.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0',
    merkleRoot: 'd3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5',
    merkleLabel: 'Merkle Tree Root (6 training clubs + Solidarity calculation + Dissolved club search + Escrow arrangement + CBF BID verification)',
    complianceLabel: 'Solidarity & Training Status',
    complianceValue: 'ESCROW ARRANGED — TMS REGISTRATION PROCEEDING',
    complianceThreshold: 'FIFA RSTP Articles 20-21 satisfied',
    agents: ['Transfer Governance Agent', 'Financial Agent', 'Legal Agent', 'FIFA Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Solidarity & Training Compensation Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete solidarity mechanism compliance: 6-club training history, proportional calculation, dissolved/merged escolinha resolution, escrow arrangement, and CBF BID verification. FIFA TMS audit-ready.',
    evidenceChain: 'CBF BID trace → 6-club identification → Solidarity calculation → Dissolved club search → Merged club confirmation → Escrow arrangement → TMS registration → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will trace a player\'s complete Brazilian training history — calculating solidarity payments, resolving dissolved clubs, and arranging escrow for FIFA TMS compliance.',
  phaseLabels: ['Training History & Calculation', 'Dissolved Club & Dispute Resolution', 'Escrow & TMS Registration'],
};

// =============================================================================
// SCENARIO 9 — LALIGA SALARY CAP (European Market Entry)
// =============================================================================

const S9: TemplateScenario = {
  id: 'laliga-salary-cap',
  title: 'LaLiga Salary Cap — Transfer Viability Assessment',
  subtitle: 'LaLiga LCFP · Club at 95% cap · €8M salary demand · Squad registration deadline',
  banner: 'Figer is negotiating the transfer of a Brazilian international to a LaLiga club. The player demands €8M/year gross salary. LaLiga\'s unique Liga de Control Financiero para el Fútbol Profesional (LCFP) imposes hard salary caps — unlike other leagues where financial fair play is advisory. The target club is already at 95% of its salary cap. If the deal is structured incorrectly, LaLiga will reject the squad registration and the player cannot play.',
  risk: 'High',
  scenarioNum: 'LaLiga',
  icon: 'trending-up',
  color: 'text-amber-400',
  agents: [AGENTS.financialAgent, AGENTS.transferAgent, AGENTS.legalAgent, AGENTS.fifaCompliance],
  connectors: [
    { name: 'LaLiga LCFP Portal', status: 'connected', type: 'Salary Cap Management', icon: 'banknote', detail: 'Club at 95% of €120M cap — €6M headroom remaining' },
    { name: 'RFEF Registration System', status: 'connected', type: 'Spanish FA Database', icon: 'database', detail: 'Squad registration deadline: 31 August 2026' },
    { name: 'CBF Transfer System', status: 'connected', type: 'Brazilian FA Exit', icon: 'globe', detail: 'ITC request pending — CBF processing (5-7 business days)' },
    { name: 'Figer Contract Modelling', status: 'connected', type: 'Salary Structure Engine', icon: 'trending-up', detail: 'Player demands €8M gross — €2M over club headroom' },
  ],
  script: [
    { agentId: 'financial', phase: 'phase1', type: 'warning', delay: 800, content: 'LALIGA SALARY CAP CRISIS. The club\'s LCFP position: Total salary cap: €120M. Current commitments: €114M (95%). Available headroom: €6M. Player salary demand: €8M gross/year. SHORTFALL: €2M. LaLiga\'s LCFP is a HARD CAP — not a guideline. If the club exceeds its cap, LaLiga will reject the squad registration and the player cannot be registered for competition. Unlike Premier League or Bundesliga, there is no "comply or explain" mechanism. Options: (1) Club sells or loans out a player to free cap space — but window closes in 14 days. (2) Player accepts €6M (25% reduction) — unlikely without significant signing bonus or performance incentives. (3) Creative structuring — deferred compensation, image rights separation, or variable pay. Each option has LCFP implications.' },
    { agentId: 'transfer', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Contract structure analysis. LaLiga LCFP counts: (a) Fixed salary — full amount against cap, (b) Performance bonuses — counted at "expected" value (typically 50-70% of maximum), (c) Image rights — EXCLUDED from salary cap if paid through a separate image rights entity and capped at 15% of total remuneration, (d) Signing bonus — amortised over contract length for cap purposes. Proposed structure: Fixed salary: €5M/year (within cap). Image rights: €1.5M/year through sociedad civil (excluded from cap, within 15% threshold). Performance bonuses: €3M maximum, LCFP counts at 60% = €1.8M. Total player value: €8.5M (exceeds demand). LCFP impact: €5M + €1.8M = €6.8M against cap. Still €800K over €6M headroom. The club MUST free €800K in cap space through a departure.' },
    { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The 15% image rights exclusion is being aggressively scrutinised by LaLiga. In 2025, LaLiga challenged 12 clubs\' image rights structures, arguing that payments exceeding the player\'s demonstrable commercial value are disguised salary. If LaLiga reclassifies the €1.5M image rights as salary, the LCFP impact jumps from €6.8M to €8.3M — catastrophically over cap. The player must have genuine, documentable commercial value supporting €1.5M in image rights. For a Brazilian international with social media following and sponsorship deals, this is likely supportable — but Figer must compile the evidence NOW, not after LaLiga challenges. Additionally, the signing bonus amortisation assumes a 4-year contract — if the player leaves after 2 years, the remaining amortisation accelerates against the cap in the departure year.' },
    { agentId: 'fifa', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. CBF ITC processing takes 5-7 business days. The squad registration deadline is 31 August 2026 — 14 days away. If the ITC arrives late, the player misses the registration window entirely and cannot play until January 2027. Figer must contact CBF directly to expedite. Additionally, FIFA Agent Regulations 2023 require that Figer\'s fee is disclosed to LaLiga as part of the LCFP assessment — agent fees are included in "transfer cost" calculations that affect future cap adjustments. Figer\'s fee must be structured to avoid inflating the club\'s LCFP transfer cost.' },
    { agentId: 'financial', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia LaLiga Transfer Viability Package: (1) Contract structure: €5M fixed + €1.5M image rights (sociedad civil) + €3M performance bonuses. LCFP impact: €6.8M. (2) Image rights evidence bundle — player commercial valuation: social media reach, existing sponsor contracts, comparable player image rights in LaLiga. Prepared for LaLiga challenge. (3) Club must release Player Y (€900K salary, currently transfer-listed) to free cap space. Datacendia models the cap impact of the departure + arrival simultaneously. (4) CBF ITC expedition — direct contact with CBF\'s international department with completed documentation. (5) Agent fee structuring — Figer\'s fee paid by the selling club (not the buying club) to minimise LaLiga LCFP transfer cost impact. (6) Signing bonus: €2M amortised over 4-year contract = €500K/year LCFP impact. Total LCFP: €6.8M + €500K = €7.3M. With Player Y departure (€900K freed): net LCFP impact €6.4M against €6.9M available headroom. VIABLE. All calculations sealed.' },
    { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The structure works if and only if: (a) Player Y departs before registration deadline, (b) image rights evidence supports €1.5M commercial value, and (c) CBF ITC arrives by August 28. Datacendia\'s simultaneous departure/arrival modelling is critical — LaLiga assesses cap compliance at the moment of registration, not after the window closes. The image rights evidence bundle pre-empts LaLiga\'s challenge pattern. Selling-club agent fee payment is standard practice in LaLiga and avoids LCFP inflation. Dissent WITHDRAWN. This is a viable deal structure — tight, but defensible.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1',
    merkleRoot: 'e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7',
    merkleLabel: 'Merkle Tree Root (LCFP calculation + Contract structure + Image rights valuation + ITC timeline + Cap space modelling)',
    complianceLabel: 'LaLiga LCFP Status',
    complianceValue: 'STRUCTURE VIABLE — €6.4M vs €6.9M HEADROOM',
    complianceThreshold: 'LaLiga LCFP hard cap satisfied',
    agents: ['Financial Agent', 'Transfer Governance Agent', 'Legal Agent', 'FIFA Compliance Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — LaLiga Salary Cap Compliance Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete LaLiga LCFP compliance: contract structure modelling, image rights commercial valuation, cap space departure/arrival simulation, CBF ITC timeline, and agent fee structuring.',
    evidenceChain: 'LCFP assessment → Contract modelling → Image rights valuation → Departure modelling → CBF ITC → Agent fee structure → Registration timeline → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will assess LaLiga salary cap viability — modelling contract structures, image rights exclusions, cap space departures, and registration timelines.',
  phaseLabels: ['Cap Analysis & Contract Modelling', 'Image Rights & Risk Review', 'Viability Confirmation & Seal'],
};

// =============================================================================
// SCENARIO 10 — LEI PELÉ vs FIFA RSTP (Cross-Border Contract Dispute)
// =============================================================================

const S10: TemplateScenario = {
  id: 'lei-pele-rstp',
  title: 'Lei Pelé vs FIFA RSTP — Unilateral Termination Dispute',
  subtitle: 'Brazilian player invokes Lei Pelé · Club claims FIFA RSTP protection · CAS jurisdiction battle · €6M compensation',
  banner: 'A Figer client wants to leave his Brazilian club for a European offer. Under Brazilian Lei Pelé (9.615/98), players can unilaterally terminate contracts after a "protected period" with compensation capped by Brazilian labour law. Under FIFA RSTP Article 17, unilateral termination within the protected period carries uncapped compensation. The club invokes FIFA RSTP; the player invokes Lei Pelé. This jurisdictional conflict is the most contested issue in Brazilian football law.',
  risk: 'Critical',
  scenarioNum: 'Lei Pelé',
  icon: 'gavel',
  color: 'text-rose-400',
  agents: [AGENTS.legalAgent, AGENTS.casArbitration, AGENTS.transferAgent, AGENTS.financialAgent],
  connectors: [
    { name: 'CBF Legal Department', status: 'connected', type: 'Brazilian FA', icon: 'scale', detail: 'Player contract registered — 3 years remaining of 5-year deal' },
    { name: 'Brazilian Labour Court (TRT)', status: 'syncing', type: 'Justiça do Trabalho', icon: 'gavel', detail: 'Lei Pelé Art. 28 — "rescisão cláusula penal" provisions' },
    { name: 'FIFA DRC', status: 'connected', type: 'Dispute Resolution Chamber', icon: 'shield', detail: 'Club filed RSTP Article 17 claim — €6M compensation demanded' },
    { name: 'CAS Registry', status: 'ready', type: 'Court of Arbitration for Sport', icon: 'gavel', detail: 'Appeal jurisdiction — CAS or Brazilian labour court?' },
  ],
  script: [
    { agentId: 'legal', phase: 'phase1', type: 'warning', delay: 800, content: 'LEI PELÉ vs FIFA RSTP JURISDICTIONAL CONFLICT. Player signed a 5-year contract in January 2024. Contract is now 2 years and 3 months old — within the FIFA "protected period" (3 years for players over 28, or 2 years if no protected period specified for domestic transfers). The player wants to accept a Bundesliga offer. Two conflicting legal frameworks: LEI PELÉ (Brazilian law): Article 28 — the "cláusula penal" (penalty clause) in the contract sets compensation for early termination. Player\'s contract has a cláusula penal of R$25M (≈€4.2M). Additionally, Lei Pelé Article 28 §1 allows the player to terminate after the first year by paying the penalty clause. LEGAL under Brazilian law. FIFA RSTP: Article 17 — unilateral termination during the protected period requires compensation calculated based on "the specificity of sport" — which can exceed the contractual penalty. The club has filed a FIFA DRC claim demanding €6M (not the contractual R$25M/€4.2M). FIFA DRC vs Brazilian Labour Court — which has jurisdiction?' },
    { agentId: 'cas', phase: 'phase1', type: 'analysis', delay: 2500, content: 'CAS JURISDICTION ANALYSIS. This is the most litigated issue in South American football. CAS 2020/A/7156 (Brazilian Club v. Player) — CAS held that FIFA RSTP applies to international transfers even when the player\'s domestic contract is governed by Brazilian law. The club\'s €6M claim under RSTP Article 17 is procedurally valid at FIFA DRC. However, CAS 2022/A/8234 (Player v. Brazilian Club) introduced nuance: where Brazilian labour law provides specific protections (Lei Pelé cláusula penal), CAS must consider the player\'s "legitimate expectations" under domestic law. The player signed the contract believing Brazilian law governed termination — the cláusula penal was negotiated as part of the deal. CAS\'s emerging position: RSTP Article 17 compensation should not "substantially exceed" the cláusula penal agreed under domestic law. This suggests compensation closer to €4.2M than €6M — but it\'s not certain.' },
    { agentId: 'transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The Bundesliga club will not sign the player if there is an unresolved FIFA DRC/CAS dispute — they become jointly liable for compensation under RSTP Article 17(2) as the "inducing club." The Bundesliga club\'s legal team has stated they will only proceed if: (a) The Brazilian club agrees to a negotiated transfer fee, OR (b) The FIFA DRC dispute is resolved with a fixed compensation amount. The player invoking Lei Pelé unilateral termination without the Bundesliga club\'s agreement to accept joint liability is a dead end. Figer must negotiate a commercial resolution — the legal route destroys the deal.' },
    { agentId: 'financial', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Financial modelling of the negotiation space. Brazilian club\'s position: €6M (FIFA RSTP Article 17 claim). Player/Figer position: R$25M/€4.2M (Lei Pelé cláusula penal). CAS likely outcome: €4.5-5.5M based on recent jurisprudence. Bundesliga club\'s budget: €12M total (transfer fee + agent fees). Proposed negotiation: If Figer can negotiate a consensual transfer at €5M, the Bundesliga club saves €7M vs their budget, the Brazilian club gets more than the cláusula penal, and the player avoids a 12-18 month CAS dispute. Additionally, under Lei Pelé Article 29, the training clubs are entitled to solidarity payments on international transfers — the Brazilian club may have training compensation claims against ITSELF from earlier youth clubs. This creates a counterclaim lever.' },
    { agentId: 'legal', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Lei Pelé Resolution Strategy: (1) DO NOT invoke Lei Pelé unilateral termination — this triggers the Bundesliga club\'s joint liability concern and kills the deal. (2) Instead, negotiate a consensual transfer using the Lei Pelé cláusula penal as the FLOOR and FIFA RSTP Article 17 as the CEILING. Target: €5M. (3) Present the CAS jurisprudence trend (CAS 2022/A/8234) to the Brazilian club — showing that CAS is unlikely to award the full €6M. A €5M negotiated transfer is better than a €4.5M CAS award after 18 months of litigation. (4) Use the solidarity payment counterclaim as leverage — if the Brazilian club has unresolved training compensation obligations, Datacendia documents them for use in negotiation. (5) Structure the €5M as a transfer fee (not termination compensation) — this allows Figer to earn a standard agent fee and avoids the RSTP Article 17 disciplinary risks. (6) Complete transfer documentation sealed with Datacendia for CAS evidence — if negotiation fails, Figer has a pre-built evidence bundle for DRC/CAS proceedings. Every step cryptographically timestamped.' },
    { agentId: 'cas', phase: 'phase3', type: 'resolution', delay: 2500, content: 'The commercial negotiation strategy is the correct approach. CAS proceedings take 12-18 months, cost €50-100K in legal fees, and create uncertainty for all parties. A €5M consensual transfer delivers value to all sides: the Brazilian club exceeds their cláusula penal recovery, the Bundesliga club is under budget, and the player avoids being stuck in a contract dispute. The solidarity counterclaim is a genuine negotiation lever — most Brazilian clubs have imperfect training compensation records. The Datacendia evidence bundle serves as insurance if negotiation fails. Dissent WITHDRAWN. This transforms a jurisdictional battle into a commercial deal — which is what transfers should be.' },
  ],
  receiptTemplate: {
    hash: 'SHA-256:e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2',
    merkleRoot: 'f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9',
    merkleLabel: 'Merkle Tree Root (Lei Pelé analysis + RSTP Article 17 + CAS jurisprudence + Negotiation modelling + Solidarity counterclaim)',
    complianceLabel: 'Dispute Resolution Status',
    complianceValue: 'CONSENSUAL TRANSFER NEGOTIATED — €5M',
    complianceThreshold: 'Lei Pelé + FIFA RSTP reconciled',
    agents: ['Legal Agent', 'CAS Arbitration Agent', 'Transfer Governance Agent', 'Financial Agent'],
    dissents: 1,
    dissentResolved: true,
    guaranteeTitle: 'Grupo Figer — Lei Pelé vs FIFA RSTP Resolution Evidence Sealed',
    guaranteeBody: 'This cryptographic bundle seals complete dispute resolution evidence: Lei Pelé cláusula penal analysis, FIFA RSTP Article 17 assessment, CAS jurisprudence trend, financial negotiation modelling, solidarity counterclaim documentation, and consensual transfer agreement.',
    evidenceChain: 'Lei Pelé analysis → RSTP Article 17 → CAS precedents → Financial modelling → Solidarity counterclaim → Negotiation → Consensual transfer → Evidence seal → ML-DSA-65',
  },
  idleTitle: 'Ready to Deliberate',
  idleDesc: '4 AI agents will navigate the Lei Pelé vs FIFA RSTP conflict — modelling CAS outcomes, structuring negotiation strategy, and sealing evidence for dispute resolution.',
  phaseLabels: ['Jurisdictional Analysis', 'Negotiation Strategy & Modelling', 'Resolution & Evidence Seal'],
};

export const EN_SCENARIOS: TemplateScenario[] = [S1, S2, S3, S4, S5, S6, S7, S8, S9, S10];
