/**
 * Wolters Kluwer Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for tax/accounting/arbitration AI governance.
 * Access: /sandbox/wolters-kluwer (Key: WK-55)
 *
 * @module pages/sandbox/configs/wolters-kluwer
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Wolters Kluwer',
  accessKey: 'WK-55',
  sessionKey: 'wolters-kluwer-sandbox-unlocked',

  accent: 'teal',
  accentColor: 'text-teal-400',
  accentHover: 'from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600',
  ringColor: 'focus:ring-teal-500/30',
  borderColor: 'border-teal-500/30',
  gradientFrom: 'from-teal-600/20',
  gradientTo: 'to-teal-900/20',

  footerNote: '50 regulatory scenarios mapped for Wolters Kluwer × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'cch-circular230',
      title: 'CCH AnswerConnect AI — Modified Revenue Ruling',
      subtitle: 'Circular 230 · Modified ruling not flagged · $890K accuracy penalty · Big Four engagement',
      banner: 'Simulating the Circular 230 crisis: CCH AnswerConnect AI cites a Revenue Ruling that was modified by a subsequent Notice. The tax advice is based on the original ruling without the limitation. IRS challenges the position. Accuracy penalty: $890K.',
      risk: 'Critical',
      scenarioNum: 'C230',
      icon: 'calculator',
      color: 'text-teal-400',
      agents: [
        { id: 'cch-ai', name: 'CCH AI Agent', role: 'Tax Research & Authority Surfacing', icon: '🤖', color: 'text-teal-400', borderColor: 'border-teal-500/40', bgColor: 'bg-teal-500/10' },
        { id: 'tax-partner', name: 'Tax Partner Agent', role: 'Circular 230 Practitioner Supervision', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'currency-check', name: 'Authority Currency Agent', role: 'Ruling Modification & Revocation Detection', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'irs-risk', name: 'IRS Risk Agent', role: 'Penalty Exposure & Audit Defence', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'CCH AnswerConnect', status: 'connected', type: 'Tax Research AI', icon: 'database', detail: 'Rev. Rul. 2019-14 cited — modified by Notice 2022-38' },
        { name: 'Authority Currency Engine', status: 'connected', type: 'Verification', icon: 'check-circle', detail: 'Modification detected: original ruling limited by subsequent notice' },
        { name: 'Client Engagement File', status: 'connected', type: 'Tax Advisory', icon: 'file-text', detail: 'Big Four partnership allocation advisory — 200+ partners affected' },
        { name: 'Circular 230 Module', status: 'syncing', type: 'Practitioner Standards', icon: 'shield', detail: 'Due diligence requirement: §10.22 — verify authority currency' },
      ],
      script: [
        { agentId: 'cch-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'CCH AnswerConnect AI research complete for partnership special allocation advisory. 6 authorities identified. Key citation: Rev. Rul. 2019-14, which addresses the treatment of guaranteed payments in tiered partnership structures. CCH AI summary: "Rev. Rul. 2019-14 provides that guaranteed payments in tiered partnerships are allocated based on the economic arrangement reflected in the partnership agreement." MODIFICATION NOT FLAGGED: Notice 2022-38 modified Rev. Rul. 2019-14 by limiting the ruling\'s application to partnerships with fewer than 50 partners. The client\'s partnership has 200+ partners — the ruling does NOT apply as stated. CCH AI cited the original ruling without the limitation because the modification was in a Notice, not an amendment to the ruling itself. The AI treated the ruling as current. The partnership\'s special allocation, if structured based on the unmodified ruling, will be challenged by the IRS under §704(b) substantial economic effect regulations.' },
        { agentId: 'currency-check', phase: 'phase1', type: 'warning', delay: 2500, content: 'AUTHORITY CURRENCY ALERT. CendiaSupervision cross-checked all 6 CCH AI citations: (1) Rev. Rul. 2019-14: MODIFIED by Notice 2022-38 (partner count limitation added). The AI did not flag this modification. (2) Reg. §1.704-1(b)(2): CURRENT — no modifications. (3) Rev. Proc. 2020-23: SUPERSEDED by Rev. Proc. 2024-08 — different safe harbour requirements. Another currency gap. (4) Remaining 3 authorities: CURRENT and correctly characterized. The modification pattern is subtle: Notices that modify Revenue Rulings are cross-referenced in the IRS system but may not appear in the ruling text itself. CCH\'s database links them, but the AI\'s summarization layer didn\'t flag the modification in its output. This is not a database error — it\'s an AI summarization failure. The data exists in CCH; the AI just didn\'t surface it prominently.' },
        { agentId: 'irs-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. IRS penalty exposure: (1) If the partnership relies on Rev. Rul. 2019-14 without the Notice 2022-38 limitation: the special allocation fails substantial economic effect. IRS adjustment: reallocation of income across 200+ partners. Aggregate adjustment: $4.5M. (2) Accuracy penalty under §6662: 20% penalty on underpayment. If the position lacks "substantial authority" (because the relied-upon ruling was modified): penalty applies. Estimated: $890K. (3) Circular 230 §10.34: A practitioner must not sign a return or advise a position unless there is a "reasonable basis" for the position. Relying on a modified ruling without the modification is NOT reasonable basis. The practitioner faces Circular 230 sanctions: censure, suspension, or monetary penalty. (4) The Big Four firm deployed CCH AI to 2,400 tax professionals. If the same unmodified ruling was cited in other engagements: enterprise exposure multiplied.' },
        { agentId: 'tax-partner', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PRACTITIONER DUTY. Under Circular 230 §10.22, I have a duty of due diligence: "A practitioner must exercise due diligence in preparing or assisting in the preparation of, approving, and filing tax returns, documents, affidavits, and other papers relating to Internal Revenue Service matters." Due diligence includes verifying that cited authorities are CURRENT. CCH AI gave me the original ruling. My Circular 230 obligation required me to verify its current status. Without CendiaSupervision: I would need to manually check each citation against IRS modification history — the exact task I used CCH AI to avoid. With CendiaSupervision: the currency check caught the modification automatically. My due diligence is documented and sealed.' },
        { agentId: 'cch-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing CCH AnswerConnect + CendiaSupervision Tax Governance: (1) AUTHORITY CURRENCY HARD-STOP: Every CCH AI citation is verified for modifications, supersessions, and revocations. Modified authorities are flagged with the modification details before the research enters the work product. (2) CIRCULAR 230 DOCUMENTATION: Each research session generates a "Practitioner Due Diligence Certificate" — authorities verified, currency confirmed, practitioner PTIN sign-off. Evidence for IRS audit and Circular 230 investigation. (3) ENTERPRISE QC: When a modified authority is discovered, CendiaSupervision identifies ALL engagements that cited the same authority across the firm. Instant enterprise-wide remediation. (4) PENALTY SHIELD: The sealed due diligence documentation provides "reasonable cause" defence against §6662 accuracy penalties — the practitioner took documented steps to verify authority currency.' },
        { agentId: 'irs-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The currency hard-stop catches the modification before the advice is delivered. The partnership receives correct advice: Rev. Rul. 2019-14 does NOT apply to partnerships with 200+ partners. Alternative structuring is recommended. $890K penalty avoided. Circular 230 compliance documented. For Wolters Kluwer: CCH + CendiaSupervision = Circular 230-compliant AI tax research. The identical pitch to Thomson Reuters\' Checkpoint — because the identical regulatory gap exists. Whichever platform integrates CendiaSupervision first captures the Circular 230 compliance market. "Our AI tax research comes with practitioner due diligence documentation" — that\'s the sales line that wins Big Four deployments.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:wk10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'wk20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CCH research + Currency verification + Modification detection + Practitioner sign-off)',
        complianceLabel: 'Circular 230',
        complianceValue: 'MODIFIED RULING CAUGHT',
        complianceThreshold: 'Rev. Rul. 2019-14 modified by Notice 2022-38',
        agents: ['CCH AI Agent', 'Tax Partner Agent', 'Authority Currency Agent', 'IRS Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'CCH AnswerConnect — Circular 230 Compliant Research',
        guaranteeBody: 'This cryptographic bundle seals the tax research governance: 6 CCH AI citations, 2 currency issues detected (Rev. Rul. modification, Rev. Proc. supersession), practitioner notified, alternative analysis provided, PTIN sign-off. $890K penalty avoided.',
        evidenceChain: 'CCH AI research → 6 citations → Currency check → Rev. Rul. 2019-14 modification detected → Notice 2022-38 flagged → Practitioner notified → Advice corrected → PTIN sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how CCH AnswerConnect + CendiaSupervision catches a modified Revenue Ruling before it enters client advice — protecting practitioners from Circular 230 sanctions.',
      phaseLabels: ['AI Research & Modification Gap', 'Penalty Exposure & Practitioner Duty', 'Currency Hard-Stop & Due Diligence'],
    },

    {
      id: 'kluwer-arbitration',
      title: 'Kluwer AI — Wrong UNCITRAL Model Law Version',
      subtitle: 'Investment arbitration · 1985 vs 2006 amendments · Procedural application fails',
      banner: 'Simulating the arbitration procedural trap: Kluwer AI advises that a jurisdiction adopted the 2006 UNCITRAL Model Law amendments when it only adopted the 1985 version. The procedural application relies on a provision that doesn\'t exist in the applicable version.',
      risk: 'High',
      scenarioNum: 'Arb',
      icon: 'globe',
      color: 'text-blue-400',
      agents: [
        { id: 'kluwer-ai', name: 'Kluwer AI Agent', role: 'Arbitration Research & Procedural Analysis', icon: '📚', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'arb-counsel', name: 'Arbitration Counsel Agent', role: 'Procedural Strategy & Submission Drafting', icon: '⚖️', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'jurisdiction', name: 'Jurisdiction Verification Agent', role: 'Model Law Adoption Status & Version', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'tribunal-wk', name: 'Tribunal Standards Agent', role: 'Procedural Integrity & Counsel Credibility', icon: '🏛️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Kluwer Arbitration', status: 'connected', type: 'Arbitration Database', icon: 'database', detail: 'Jurisdiction analysis: "Country X adopted 2006 amendments" — INCORRECT' },
        { name: 'UNCITRAL Status Database', status: 'connected', type: 'Adoption Tracking', icon: 'check-circle', detail: 'Country X: 1985 Model Law ONLY — 2006 amendments NOT adopted' },
        { name: 'ICSID Case File', status: 'connected', type: 'Investment Arbitration', icon: 'file-text', detail: '$340M BIT claim — seat in Country X' },
        { name: 'IBA Guidelines Module', status: 'syncing', type: 'Procedural Standards', icon: 'book-open', detail: 'Procedural application relies on Article 17J (2006 only)' },
      ],
      script: [
        { agentId: 'kluwer-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Kluwer Arbitration AI research for ICSID Case No. ARB/25/12 ($340M bilateral investment treaty claim). Seat of arbitration: Country X. Procedural analysis: counsel seeks an interim measure of protection under the domestic arbitration law of the seat. Kluwer AI identifies: "Country X has adopted the UNCITRAL Model Law on International Commercial Arbitration, including the 2006 amendments on interim measures." Based on this analysis, counsel prepares an application under Article 17J of the Model Law (court-ordered interim measures in aid of arbitration — a provision that exists ONLY in the 2006 amendments). CRITICAL ERROR: Country X adopted the UNCITRAL Model Law in 1999 based on the 1985 version. The 2006 amendments were NEVER adopted. Article 17J does not exist in Country X\'s arbitration law. The domestic court will reject the application because the provision cited doesn\'t exist in the applicable statute. The interim measure is denied. The opposing party dissipates assets during the 3-month delay required to file a corrected application.' },
        { agentId: 'jurisdiction', phase: 'phase1', type: 'warning', delay: 2500, content: 'JURISDICTION VERIFICATION ALERT. CendiaSupervision cross-checked Kluwer AI\'s adoption status against UNCITRAL\'s official Model Law status database: (1) Country X: Adopted Model Law in 1999. Version: 1985 text. 2006 amendments: NOT ADOPTED. Status confirmed as of February 2026. (2) The Kluwer AI error likely stems from: Country X\'s arbitration law commission PROPOSED adopting the 2006 amendments in 2018, and several academic articles discuss the proposal as if it were enacted. The AI may have trained on these articles. (3) The specific provisions missing from Country X\'s law: Article 17A-17J (interim measures framework), Article 2A (interpretation principles), and Article 7 (revised form of arbitration agreement). (4) The interim measure application under Article 17J will be rejected on its face. The domestic court will note that no such provision exists in the national arbitration act. Counsel\'s credibility with both the domestic court and the ICSID tribunal is damaged.' },
        { agentId: 'tribunal-wk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The procedural consequences are severe: (1) The interim measure application is denied. 3 months lost. The opposing party (the host state) uses the time to transfer assets out of reach. (2) The $340M claim\'s enforceability is compromised — even if the tribunal awards damages, collection requires assets within reach. (3) Counsel\'s credibility before the ICSID tribunal is damaged. The tribunal will question whether counsel competently researched the applicable law of the seat. (4) The client (the investor) has a potential malpractice claim: "My lawyers cited a provision that doesn\'t exist in the jurisdiction\'s law. They relied on AI without verifying the most basic jurisdictional question." (5) In investment arbitration, procedural errors are amplified because the stakes are sovereign — the opposing party is a government with resources to exploit every mistake.' },
        { agentId: 'arb-counsel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — ARBITRATION COUNSEL DUTY. The applicable version of the Model Law in the seat jurisdiction is among the most fundamental questions in international arbitration. It determines available interim measures, form requirements, court assistance, and challenge procedures. Getting this wrong is equivalent to filing in the wrong court in domestic litigation. My ABA 512 / SRA obligation: I must verify AI output on jurisdictional questions. Kluwer AI is the gold standard for arbitration research — but even gold-standard databases can contain errors on jurisdiction-specific adoption status. Without CendiaSupervision: I would have filed the Article 17J application, it would have been rejected, and $340M in assets would have dissipated during the correction period. With CendiaSupervision: the adoption status check catches the error before the application is filed.' },
        { agentId: 'kluwer-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Kluwer Arbitration + CendiaSupervision Procedural Governance: (1) MODEL LAW VERSION CHECK: For every jurisdictional analysis, CendiaSupervision verifies the Model Law adoption status against UNCITRAL\'s official database. Version (1985 vs 2006), adoption date, and any modifications confirmed. (2) PROVISION EXISTENCE VERIFICATION: When the AI cites a specific Model Law article, CendiaSupervision confirms the article exists in the adopted version. Article 17J cited + 1985 version adopted = HARD-STOP. (3) SEAT-SPECIFIC ANALYSIS: The procedural application is reviewed against the actual domestic arbitration act of the seat, not just the Model Law version. Local modifications and reservations flagged. (4) COUNSEL SIGN-OFF: Arbitration counsel reviews the jurisdictional verification and signs off before filing any procedural application. Sealed with practitioner credentials.' },
        { agentId: 'tribunal-wk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The version check catches the error. Counsel files the interim measure application under the CORRECT provisions of Country X\'s 1985-based arbitration law — using the court\'s inherent power to grant interim measures (which exists in the 1985 version, just under a different framework). The application succeeds. Assets are preserved. The $340M claim remains enforceable. For Wolters Kluwer: Kluwer Arbitration + CendiaSupervision = the only arbitration research platform with jurisdictional verification. Every competitor (vLex, Westlaw International, LexisNexis) faces the same adoption-status risk. Kluwer with CendiaSupervision catches it by architecture. "Our arbitration research verifies the applicable law of the seat" — that\'s the differentiator for a $1,800/year subscription.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:wk30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'wk40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Kluwer research + UNCITRAL status check + Version verification + Counsel sign-off)',
        complianceLabel: 'Arbitration Status',
        complianceValue: 'WRONG VERSION CAUGHT',
        complianceThreshold: '2006 amendments not adopted — 1985 only',
        agents: ['Kluwer AI Agent', 'Arbitration Counsel Agent', 'Jurisdiction Verification Agent', 'Tribunal Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Kluwer Arbitration — Jurisdictional Verification',
        guaranteeBody: 'This cryptographic bundle seals the arbitration governance: Kluwer AI cited 2006 Model Law amendments, UNCITRAL status check confirmed 1985 version only, Article 17J flagged as non-existent in jurisdiction, application corrected, counsel sign-off. $340M claim enforceability preserved.',
        evidenceChain: 'Kluwer AI research → Article 17J cited → UNCITRAL status check → 1985 version confirmed → Article 17J blocked → Application corrected → Counsel sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Kluwer Arbitration + CendiaSupervision catches a Model Law version error before a $340M investment arbitration procedural application fails.',
      phaseLabels: ['AI Research & Version Mismatch', 'Procedural Failure & Asset Risk', 'Version Check & Corrected Application'],
    },

    {
      id: 'teammate-audit',
      title: 'TeamMate+ AI — Audit Fraud Detection Gaps',
      subtitle: 'Journal entry analysis · 98% false positive rate · 2 genuine frauds missed · PCAOB',
      banner: 'Simulating the audit AI trap: TeamMate+ AI flags 47 journal entries as suspicious. 44 are false positives. The 3 genuine issues are buried in noise. Meanwhile, 2 truly fraudulent entries worth $3.8M are MISSED because they were structured to evade AI pattern detection.',
      risk: 'High',
      scenarioNum: 'Audit',
      icon: 'search',
      color: 'text-amber-400',
      agents: [
        { id: 'teammate-ai', name: 'TeamMate+ AI Agent', role: 'Journal Entry Analysis & Anomaly Detection', icon: '📊', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'audit-partner', name: 'Audit Partner Agent', role: 'PCAOB Standards & Engagement Quality', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'fraud-analyst', name: 'Fraud Analysis Agent', role: 'False Positive/Negative Assessment & Evasion Detection', icon: '🔍', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'pcaob-risk', name: 'PCAOB Standards Agent', role: 'Inspection Readiness & AS 2401 Compliance', icon: '🏛️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'TeamMate+ Analytics', status: 'connected', type: 'Audit AI', icon: 'bar-chart', detail: '47 journal entries flagged — 44 false positives, 3 genuine issues' },
        { name: 'Fraud Detection Engine', status: 'connected', type: 'Pattern Analysis', icon: 'alert-triangle', detail: '2 fraudulent entries missed ($3.8M) — structured to evade detection' },
        { name: 'Engagement File', status: 'connected', type: 'Audit Documentation', icon: 'file-text', detail: 'Public company audit — PCAOB AS 2401 fraud consideration required' },
        { name: 'PCAOB Inspection Module', status: 'syncing', type: 'Quality Standards', icon: 'shield', detail: 'PCAOB inspection asks: "How did the engagement team use AI in fraud testing?"' },
      ],
      script: [
        { agentId: 'teammate-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'TeamMate+ AI journal entry analysis complete for FY2025 audit of PublicCo. Population: 142,000 journal entries. AI flagged 47 entries (0.033%) as suspicious based on anomaly detection: unusual amounts, off-hours posting, round numbers, manual entries, and management override indicators. Results after manual review: 44 of 47 are FALSE POSITIVES — legitimate business transactions that triggered anomaly rules. 3 of 47 are GENUINE issues — improper revenue recognition timing ($340K). However: TeamMate+ AI MISSED 2 entries that are genuinely fraudulent: (1) A series of 12 journal entries totaling $2.1M that adjust inventory valuation. Each entry is below the AI\'s $200K individual threshold, posted during business hours, with proper approvals. Structured to evade every AI detection rule. (2) A revenue entry of $1.7M that mirrors a legitimate customer transaction — the fraudster copied the format of a real entry. The AI classified it as "matching established pattern." Total missed fraud: $3.8M. The AI caught $340K and missed $3.8M — a 10:1 miss ratio.' },
        { agentId: 'fraud-analyst', phase: 'phase1', type: 'warning', delay: 2500, content: 'FRAUD ANALYSIS ALERT. The 2 missed frauds demonstrate AI evasion: (1) STRUCTURED EVASION: The $2.1M inventory fraud was split into 12 entries, each designed to be below detection thresholds: amounts vary ($125K-$210K), posted during business hours, different account codes used, proper approval chains followed. This is deliberate AI evasion by someone who understands the detection rules. (2) PATTERN MIMICRY: The $1.7M revenue fraud copied the exact format of a legitimate $1.7M transaction from the same customer. The AI classified it as "consistent with established customer pattern." The fraudster exploited the AI\'s pattern-matching logic. (3) The 98% false positive rate (44/47) creates "alert fatigue" — the audit team spends 400+ hours investigating false positives, reducing time available for substantive fraud testing. The real frauds hide behind the noise.' },
        { agentId: 'pcaob-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. PCAOB standards require: (1) AS 2401 §15: "The auditor should identify and assess the risks of material misstatement due to fraud." AI-assisted fraud testing is acceptable but the auditor must understand and document the AI\'s LIMITATIONS. (2) The 98% false positive rate is itself a finding — it means the AI detection model is poorly calibrated. The PCAOB inspector will ask: "What did the engagement team do about the AI\'s known limitations?" (3) AS 2401 §46: The auditor must test journal entries "particularly those made at the end of a reporting period." The missed entries were made at quarter-end — exactly when AS 2401 expects heightened scrutiny. (4) The PCAOB inspection finding will be: "The engagement team used AI for journal entry testing but did not adequately address the AI\'s known false negative risk. The team relied on AI flags without supplementing with targeted manual testing designed to detect AI evasion patterns."' },
        { agentId: 'audit-partner', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — AUDIT PARTNER RESPONSIBILITY. I signed off on the journal entry testing workpaper. The workpaper states: "TeamMate+ AI tested all 142,000 journal entries. 47 flagged. 3 genuine issues identified and resolved." The workpaper does NOT disclose: the 98% false positive rate, the AI\'s known limitations regarding structured evasion, or the absence of supplemental testing. If the $3.8M fraud is discovered (by regulators, whistleblower, or subsequent audit), the question is: "Did the audit partner understand and address the AI\'s limitations?" Without CendiaSupervision: my workpaper says "AI tested, no material fraud found." That\'s a clean workpaper built on undocumented AI limitations. With CendiaSupervision: the workpaper includes AI methodology documentation, known limitations, false positive/negative rates, and my documented decision to supplement AI testing with targeted manual procedures.' },
        { agentId: 'teammate-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing TeamMate+ AI + CendiaSupervision Audit Governance: (1) AI METHODOLOGY DOCUMENTATION: Every TeamMate+ analysis includes documented methodology: detection rules, thresholds, known limitations, false positive/negative rates from prior periods. (2) EVASION PATTERN TESTING: CendiaSupervision supplements AI detection with tests specifically designed to detect AI evasion: sub-threshold structuring detection, pattern mimicry analysis, and approval chain anomaly detection. (3) FALSE POSITIVE CALIBRATION: Track false positive rates across engagements. If the rate exceeds 80%, flag for model recalibration before results are used. (4) SUPPLEMENTAL MANUAL TESTING: Based on AI limitations, CendiaSupervision recommends targeted manual testing procedures — specifically designed to catch what the AI misses. (5) AUDIT PARTNER SIGN-OFF: The partner reviews AI methodology, limitations, supplemental testing, and signs off on the COMBINED (AI + manual) fraud testing as adequate under AS 2401.' },
        { agentId: 'pcaob-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The combined AI + manual testing framework catches what neither alone would catch: TeamMate+ AI catches the $340K revenue timing issue (AI strength: pattern detection at scale). Supplemental evasion testing catches the $2.1M structured inventory fraud (manual strength: detecting deliberate evasion). Combined: $4.14M in fraud detected vs $340K with AI alone. For the PCAOB inspector: the engagement file shows documented AI methodology, known limitations, supplemental testing designed to address those limitations, and partner sign-off on the combined approach. This is exactly what PCAOB expects — AI as a tool, not a replacement for professional judgment. For Wolters Kluwer: TeamMate+ + CendiaSupervision = PCAOB-ready audit AI. The Big Four need this for every engagement where AI is used in audit procedures.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:wk50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'wk60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (TeamMate+ analysis + Methodology doc + Evasion testing + Supplemental procedures + Partner sign-off)',
        complianceLabel: 'Audit Status',
        complianceValue: '$3.8M FRAUD CAUGHT (SUPPLEMENTAL)',
        complianceThreshold: 'AI alone: $340K. AI + manual: $4.14M',
        agents: ['TeamMate+ AI Agent', 'Audit Partner Agent', 'Fraud Analysis Agent', 'PCAOB Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'TeamMate+ Audit — PCAOB-Ready AI Governance',
        guaranteeBody: 'This cryptographic bundle seals the audit AI governance: 142K entries tested, 47 AI flags (44 false positives, 3 genuine), 2 AI misses caught by supplemental evasion testing ($3.8M), combined detection: $4.14M. Methodology documented, limitations disclosed, partner sign-off. AS 2401 satisfied.',
        evidenceChain: 'TeamMate+ AI (142K entries) → 47 flagged → Manual review → 3 genuine ($340K) → Evasion testing → 2 additional frauds ($3.8M) → Combined detection: $4.14M → Partner sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how TeamMate+ AI alone misses $3.8M in structured fraud — and how CendiaSupervision\'s supplemental evasion testing catches what AI cannot.',
      phaseLabels: ['AI Detection & Evasion Patterns', 'PCAOB Standards & Partner Duty', 'Supplemental Testing & Combined Detection'],
    },

    // SCENARIO 4 — CCH AI: OECD PILLAR TWO TOP-UP TAX
    {
      id: 'cch-pillar-two',
      title: 'CCH AI — OECD Pillar Two Calculation Error',
      subtitle: 'Global minimum tax · Qualified domestic top-up · $18M unintended liability · BEPS 2.0',
      banner: 'Simulating the international tax trap: CCH AI analyses a cross-border structure under OECD Pillar Two. The AI applies outdated GloBE rules from the initial framework without accounting for administrative guidance changes. The structure creates $18M in unintended qualified domestic minimum top-up tax.',
      risk: 'Critical',
      scenarioNum: 'Pillar2',
      icon: 'globe',
      color: 'text-teal-400',
      agents: [
        { id: 'cch-p2', name: 'CCH AI Agent', role: 'International Tax Research & GloBE Analysis', icon: '🤖', color: 'text-teal-400', borderColor: 'border-teal-500/40', bgColor: 'bg-teal-500/10' },
        { id: 'intl-tax', name: 'International Tax Agent', role: 'OECD/BEPS Compliance & Structure Review', icon: '🌐', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'globe-verify', name: 'GloBE Rules Agent', role: 'Administrative Guidance & Safe Harbour Verification', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'cfo-risk', name: 'CFO Risk Agent', role: 'Financial Statement Impact & Provision', icon: '💰', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'CCH AnswerConnect', status: 'connected', type: 'Tax Research AI', icon: 'database', detail: 'Pillar Two analysis based on December 2021 Model Rules — outdated' },
        { name: 'OECD GloBE Database', status: 'connected', type: 'Current Guidance', icon: 'check-circle', detail: 'Administrative Guidance July 2025 — changes to QDMTT safe harbour' },
        { name: 'Client Structure', status: 'connected', type: 'International Tax', icon: 'git-branch', detail: 'MNE with €890M revenue — 14 jurisdictions — Pillar Two in scope' },
        { name: 'Tax Provision', status: 'syncing', type: 'ASC 740', icon: 'bar-chart', detail: 'QDMTT liability not provisioned — potential restatement' },
      ],
      script: [
        { agentId: 'cch-p2', phase: 'phase1', type: 'analysis', delay: 800, content: 'CCH AI Pillar Two analysis for MegaCorp International (consolidated revenue: €890M — above €750M threshold). 14 jurisdictions analysed. CCH AI conclusion: "The group qualifies for the transitional CbCR safe harbour in 12 of 14 jurisdictions. Top-up tax liability: €0 in safe harbour jurisdictions. Estimated top-up tax in 2 non-safe-harbour jurisdictions: €2.3M." CRITICAL ERROR: CCH AI applied the ORIGINAL transitional safe harbour rules from the December 2021 Model Rules. The OECD Administrative Guidance (July 2025) modified the safe harbour conditions — specifically, the simplified ETR calculation methodology changed. Under the updated methodology: (1) 4 jurisdictions no longer qualify for the safe harbour (not 2). (2) The QDMTT calculation in those jurisdictions uses a different substance-based income exclusion formula. (3) Total top-up tax liability: €20.3M, not €2.3M. The CCH AI error: €18M in unidentified top-up tax.' },
        { agentId: 'globe-verify', phase: 'phase1', type: 'warning', delay: 2500, content: 'GloBE RULES VERIFICATION ALERT. CendiaSupervision cross-checked CCH AI against current OECD Administrative Guidance: (1) July 2025 Guidance changed the simplified ETR calculation for transitional safe harbour — the revenue and profit figures must be adjusted for specific intercompany transactions that the original rules excluded. (2) With the adjustment: Jurisdictions 5, 7, 11, and 13 fail the safe harbour (simplified ETR drops below 15% when intercompany adjustments are applied). CCH AI only identified jurisdictions 7 and 13. (3) The substance-based income exclusion (SBIE) formula was also modified — the payroll component percentage changed from 5% to 4.8% for 2026, and the tangible asset component from 5% to 4.6%. These small percentage changes compound across 14 jurisdictions. (4) CCH AI used the 2021 percentages, not the transitional phase-down schedule. Every SBIE calculation is overstated, increasing top-up tax in every non-safe-harbour jurisdiction.' },
        { agentId: 'cfo-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Financial impact: (1) The €18M top-up tax gap is material for a company with €890M revenue. This is 2% of revenue — above most materiality thresholds. (2) If the tax provision under ASC 740 was based on the CCH AI analysis: the provision is understated by €18M. The quarterly financial statements are misstated. (3) The external auditor will require restatement of the tax provision. SOX 302/404 implications for the CFO and CEO certifications. (4) The 4 jurisdictions that lost safe harbour status: each requires a full GloBE calculation — ETR computation, top-up tax allocation, QDMTT interaction. This is the most complex international tax calculation that exists. Getting it wrong in a financial statement is a material weakness. (5) The board will ask: "Why did our tax department miss €18M in tax liability?" The answer: "Our AI used outdated OECD rules" is a competence failure at the tax director level.' },
        { agentId: 'intl-tax', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — INTERNATIONAL TAX PRACTITIONER. Pillar Two is the most rapidly evolving area of international tax law. The OECD has issued 5 rounds of Administrative Guidance since the Model Rules. Each round changes calculations. No AI can stay current without continuous updates verified against OECD publications. My Circular 230 obligation: I must verify AI output against current guidance. But the guidance is 400+ pages of technical rules — verifying CCH AI output requires re-doing the calculation manually. Without CendiaSupervision: I trusted CCH AI. The €18M gap would appear when tax returns are filed and authorities assess additional tax. With CendiaSupervision: the guidance currency check identified 3 specific changes that affect the calculation. I recalculate with current rules. The provision is correct.' },
        { agentId: 'cch-p2', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing CCH + CendiaSupervision Pillar Two Governance: (1) OECD GUIDANCE CURRENCY: Every Pillar Two calculation is verified against the LATEST Administrative Guidance. When new guidance is published, all existing analyses are flagged for review. (2) SAFE HARBOUR VALIDATION: Each jurisdiction\'s safe harbour qualification is verified with the current simplified ETR methodology — including intercompany adjustments per the latest guidance. (3) SBIE PHASE-DOWN TRACKING: The substance-based income exclusion uses the correct transitional percentages per year — auto-updated as the phase-down schedule progresses. (4) JURISDICTION-BY-JURISDICTION SEAL: Each jurisdiction\'s calculation is individually verified and sealed. The tax director reviews a dashboard showing: safe harbour status, top-up tax, and QDMTT per jurisdiction. (5) PROVISION INTEGRATION: The verified Pillar Two calculation feeds directly into the ASC 740 provision — ensuring the financial statements reflect current OECD rules.' },
        { agentId: 'cfo-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The guidance currency check catches all 3 methodology changes. The provision reflects €20.3M, not €2.3M. No restatement needed. SOX compliance maintained. For Wolters Kluwer: CCH + CendiaSupervision is essential for Pillar Two — the most complex and rapidly changing area of international tax. Every MNE above €750M needs this. "Our Pillar Two calculations are verified against the latest OECD Administrative Guidance" — that\'s the feature that wins Big Four and mid-market international tax engagements.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:wk70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'wk80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CCH Pillar Two + OECD guidance check + Safe harbour validation + CFO sign-off)',
        complianceLabel: 'Pillar Two Status',
        complianceValue: '€18M GAP CAUGHT',
        complianceThreshold: 'Administrative Guidance July 2025 applied',
        agents: ['CCH AI Agent', 'International Tax Agent', 'GloBE Rules Agent', 'CFO Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'CCH AI — OECD Pillar Two Governance',
        guaranteeBody: 'Pillar Two calculation verified against latest OECD Administrative Guidance. Safe harbour: 4 jurisdictions failed (not 2). SBIE phase-down percentages corrected. Top-up tax: €20.3M (not €2.3M). €18M gap caught before financial statement filing.',
        evidenceChain: 'CCH AI (€2.3M) → OECD guidance check → 3 methodology changes → Safe harbour recalculated → 4 jurisdictions fail → SBIE corrected → €20.3M total → Provision updated → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how CCH + CendiaSupervision catches an €18M Pillar Two calculation error caused by outdated OECD Administrative Guidance.',
      phaseLabels: ['Outdated GloBE Rules & Safe Harbour Error', 'Financial Statement Gap & SOX Risk', 'Guidance Currency & Jurisdiction Validation'],
    },

    // SCENARIO 5 — ONESUMX: BASEL IV OUTPUT FLOOR
    {
      id: 'onesumx-basel',
      title: 'OneSumX AI — Basel IV Output Floor Misapplication',
      subtitle: 'CRR III · Output floor 72.5% · ECB SREP deficiency · Capital raise at unfavourable terms',
      banner: 'Simulating the regulatory capital trap: OneSumX AI analyses Basel IV capital requirements for a European bank. The AI misapplies the output floor calculation during the transitional period, understating the bank\'s capital requirement. ECB SREP review identifies the deficiency.',
      risk: 'Critical',
      scenarioNum: 'Basel',
      icon: 'building',
      color: 'text-blue-400',
      agents: [
        { id: 'onesumx-ai', name: 'OneSumX AI Agent', role: 'Regulatory Capital Calculation & Basel IV', icon: '🏦', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'capital-mgr', name: 'Capital Management Agent', role: 'RWA Optimization & Buffer Strategy', icon: '📊', color: 'text-teal-400', borderColor: 'border-teal-500/40', bgColor: 'bg-teal-500/10' },
        { id: 'ecb-srep', name: 'ECB SREP Agent', role: 'Supervisory Review & Pillar 2 Requirements', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'investor-rel', name: 'Investor Relations Agent', role: 'Capital Adequacy & Market Confidence', icon: '📈', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'OneSumX Platform', status: 'connected', type: 'Regulatory Calculation', icon: 'cpu', detail: 'Output floor: 65% applied (2026 transitional) — should be 67.5%' },
        { name: 'CRR III Database', status: 'connected', type: 'Basel IV Rules', icon: 'database', detail: 'Transitional schedule: 65% (2025) → 67.5% (2026) → 70% (2027) → 72.5% (2028)' },
        { name: 'ECB SREP Portal', status: 'connected', type: 'Supervisory Review', icon: 'shield', detail: 'Annual SREP assessment: capital adequacy under review' },
        { name: 'Capital Markets', status: 'syncing', type: 'Funding', icon: 'trending-up', detail: 'If capital shortfall identified: AT1/Tier 2 issuance at market terms' },
      ],
      script: [
        { agentId: 'onesumx-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'OneSumX AI regulatory capital calculation for EuroBank SA (total assets: €340B). Basel IV output floor analysis: The output floor limits the benefit of internal models by requiring that the bank\'s total RWA cannot fall below a percentage of the standardised approach RWA. OneSumX AI applied 65% output floor for Q1 2026. Internal models RWA: €112B. Standardised approach RWA: €187B. Output floor (65% × €187B): €121.55B. Since internal models RWA (€112B) is below the floor (€121.55B): the binding constraint is the floor. CET1 requirement: €121.55B × 4.5% = €5.47B. CRITICAL ERROR: The 65% floor is the 2025 transitional rate. The 2026 rate is 67.5%. Correct floor: 67.5% × €187B = €126.2B. Correct CET1 requirement: €126.2B × 4.5% = €5.68B. The difference: €210M in additional CET1 capital required. OneSumX reported the bank as adequately capitalised. Under the correct calculation: the bank has a €210M CET1 shortfall.' },
        { agentId: 'ecb-srep', phase: 'phase1', type: 'warning', delay: 2500, content: 'ECB SREP ASSESSMENT. The ECB identified the output floor error during the annual SREP review: (1) The bank\'s ICAAP submission uses the 65% floor. The ECB applies 67.5% for 2026. (2) The €210M CET1 shortfall triggers a Pillar 2 Requirement (P2R) add-on: the ECB requires the bank to hold additional CET1 until the shortfall is remediated. (3) SREP score downgrade: from 2b (adequate) to 3a (insufficient). This triggers enhanced supervisory monitoring — quarterly reporting instead of semi-annual. (4) The ECB will publish the aggregate SREP results. While individual bank scores aren\'t disclosed, market analysts infer score changes from capital actions. A sudden capital raise signals a SREP downgrade. (5) The bank must submit a capital remediation plan within 90 days. Options: retained earnings (slow), AT1 issuance (expensive in current market), asset sales (fire-sale risk).' },
        { agentId: 'investor-rel', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Market impact: (1) If the bank issues AT1 bonds to cover the €210M shortfall: at current spreads (Euribor + 450bps), the annual cost is €9.45M. This reduces ROE by approximately 15bps — meaningful for a bank already near target ROE. (2) The AT1 issuance signals capital weakness to the market. CDS spreads will widen. Equity price will drop. The cost of ALL future capital issuance increases. (3) Analysts will ask: "How did your regulatory capital model miss €210M?" The answer — "our OneSumX system used the wrong transitional rate" — destroys confidence in the bank\'s risk management. (4) Peer comparison: if competing banks correctly applied 67.5%, they reported higher capital requirements but maintained SREP scores. EuroBank\'s peers look stronger. (5) The output floor phase-in continues through 2028. If the calculation error persists: the shortfall grows each year as the floor increases.' },
        { agentId: 'capital-mgr', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CAPITAL MANAGEMENT. I relied on OneSumX for the output floor calculation. The transitional phase-in schedule is publicly available — but applying it correctly requires knowing which year\'s rate applies to which reporting period. OneSumX applied the previous year\'s rate. My obligation: the CRO certification on the ICAAP submission certifies the capital calculations are accurate. I certified based on OneSumX output without independently verifying the transitional rate. Without CendiaSupervision: the error reaches the ECB. SREP downgrade. Capital raise. Market impact. With CendiaSupervision: the transitional schedule verification catches the wrong rate before the ICAAP is submitted. €210M shortfall identified internally. Remediation through retained earnings allocation — no market-visible capital action needed.' },
        { agentId: 'onesumx-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing OneSumX + CendiaSupervision Regulatory Capital Governance: (1) TRANSITIONAL SCHEDULE VERIFICATION: Every output floor calculation verified against the CRR III transitional phase-in schedule. The correct year\'s rate is confirmed before any capital calculation. (2) YEAR-OVER-YEAR COMPARISON: CendiaSupervision compares the current period\'s output floor rate against the prior period. If the rate hasn\'t increased per the schedule: ALERT — wrong rate applied. (3) ECB SREP PRE-CHECK: Before ICAAP submission, CendiaSupervision runs the capital calculation against ECB-published supervisory expectations — catching discrepancies before the ECB does. (4) CAPITAL PLANNING INTEGRATION: The correct output floor feeds into the bank\'s capital planning model — ensuring capital buffers account for the increasing floor through 2028. (5) CRO SIGN-OFF: The CRO reviews the verified calculation and signs off on the ICAAP. Sealed evidence for ECB examination.' },
        { agentId: 'investor-rel', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The transitional schedule verification catches the wrong rate. The ICAAP is filed with the correct 67.5% floor. The €210M shortfall is identified internally and addressed through retained earnings — no AT1 issuance, no market signal, no SREP downgrade. For Wolters Kluwer: OneSumX + CendiaSupervision = regulatory capital governance for European banks. The output floor phase-in is a one-time transition event — getting it wrong is unrecoverable. "Our regulatory capital calculations are verified against the CRR III transitional schedule" — that\'s the feature that wins OneSumX renewals across the Eurozone banking sector.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:wk90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'wka0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (OneSumX calculation + Transitional rate + Output floor + CRO sign-off)',
        complianceLabel: 'Basel IV Status',
        complianceValue: '€210M SHORTFALL CAUGHT INTERNALLY',
        complianceThreshold: 'Output floor: 67.5% (2026), not 65% (2025)',
        agents: ['OneSumX AI Agent', 'Capital Management Agent', 'ECB SREP Agent', 'Investor Relations Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'OneSumX — Basel IV Output Floor Governance',
        guaranteeBody: 'Output floor transitional rate verified: 67.5% for 2026 (not 65%). €210M CET1 shortfall identified internally. Remediated via retained earnings. ICAAP filed correctly. SREP score maintained. No market-visible capital action.',
        evidenceChain: 'OneSumX (65%) → CendiaSupervision schedule check → 67.5% correct rate → €210M shortfall → Internal remediation → ICAAP corrected → CRO sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how OneSumX + CendiaSupervision catches a Basel IV output floor transitional rate error — preventing a €210M capital shortfall from reaching the ECB.',
      phaseLabels: ['Wrong Transitional Rate & Capital Shortfall', 'SREP Downgrade & Market Impact', 'Schedule Verification & Internal Remediation'],
    },
  ],

        complianceScore: 92,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.216Z",
            "type": "analysis",
            "title": "System Assessment - CCH AnswerConnect AI — Modified Revenue Ruling",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Wolters Kluwer completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.216Z",
            "type": "warning",
            "title": "Privacy Compliance - CCH AnswerConnect AI — Modified Revenue Ruling",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Wolters Kluwer completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.216Z",
            "type": "dissent",
            "title": "Security Risk - CCH AnswerConnect AI — Modified Revenue Ruling",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Wolters Kluwer completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.216Z",
            "type": "proposal",
            "title": "Governance Framework - CCH AnswerConnect AI — Modified Revenue Ruling",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Wolters Kluwer completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.216Z",
            "type": "resolution",
            "title": "Compliance Certified - CCH AnswerConnect AI — Modified Revenue Ruling",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Wolters Kluwer completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export default config;
