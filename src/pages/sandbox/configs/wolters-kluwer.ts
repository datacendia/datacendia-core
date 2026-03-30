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
  ],
};

export default config;
