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

export const EN_SCENARIOS: TemplateScenario[] = [S1, S2, S3, S4, S5];
