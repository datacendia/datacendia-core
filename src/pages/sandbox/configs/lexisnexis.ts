/**
 * LexisNexis Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for legal AI governance.
 * Access: /sandbox/lexisnexis (Key: LN-31)
 *
 * @module pages/sandbox/configs/lexisnexis
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'LexisNexis',
  accessKey: 'LN-31',
  sessionKey: 'lexisnexis-sandbox-unlocked',

  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',

  footerNote: '50 regulatory scenarios mapped for LexisNexis × Datacendia · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — LEXIS+ AI BRIEF SUPERVISION: ABA 512
    {
      id: 'lexis-brief',
      title: 'Lexis+ AI Brief — Holding Mischaracterisation',
      subtitle: 'ABA Opinion 512 · Shepard\'s mismatch · Case holding reversed · FRCP Rule 11',
      banner: 'Simulating the Lexis+ AI governance gap: a litigation partner uses Lexis+ AI for constitutional research. The AI cites 7 cases — two have their holdings stated backwards. Without CendiaSupervision, the brief is filed, opposing counsel catches the error via Shepard\'s, and an OSC for sanctions follows.',
      risk: 'Critical',
      scenarioNum: '512',
      icon: 'book-open',
      color: 'text-red-400',
      agents: [
        { id: 'lexis-ai', name: 'Lexis+ AI Agent', role: 'Legal Research & Analysis Generation', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'supervising', name: 'Supervising Attorney Agent', role: 'ABA 512 Compliance & Brief Certification', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'shepards', name: 'Shepard\'s Verification Agent', role: 'Citation Treatment & Holding Accuracy', icon: '📚', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'ethics-ln', name: 'Ethics & Risk Agent', role: 'Professional Responsibility & Sanctions Risk', icon: '🛡️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Lexis+ AI Engine', status: 'connected', type: 'Legal Research AI', icon: 'cpu', detail: '7 cases cited — 2 holdings mischaracterised (stated backwards)' },
        { name: 'Shepard\'s Citations', status: 'connected', type: 'Citation Verification', icon: 'check-circle', detail: 'Red flag: 2 cases — holding in target jurisdiction contradicts AI summary' },
        { name: 'Court Filing System', status: 'connected', type: 'ECF', icon: 'file-text', detail: 'Motion for summary judgment — filing deadline: 48 hours' },
        { name: 'Bar Disciplinary Database', status: 'syncing', type: 'Ethics Compliance', icon: 'shield', detail: 'ABA Opinion 512 effective — AI supervision documentation required' },
      ],
      script: [
        { agentId: 'lexis-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Lexis+ AI research complete for motion for summary judgment on First Amendment retaliation claim. 7 cases identified and analysed. Key citation: Garcetti v. Ceballos, 547 U.S. 410 (2006). AI summary: "The Court held that public employees speaking as citizens on matters of public concern ARE protected by the First Amendment." HOLDING MISCHARACTERISATION DETECTED: The actual holding is the OPPOSITE — the Court held that statements made PURSUANT TO OFFICIAL DUTIES are NOT protected. The AI reversed the holding. Second mischaracterisation: Lane v. Franks, 573 U.S. 228 (2014). AI states Lane "narrowed Garcetti." Lane actually CLARIFIED that testimony outside official duties IS protected — it didn\'t narrow Garcetti, it distinguished it. Both errors are substantive. If the brief argues Garcetti protects the plaintiff\'s speech made during official duties, the court will find the argument directly contradicted by the case cited in its support.' },
        { agentId: 'shepards', phase: 'phase1', type: 'warning', delay: 2500, content: 'SHEPARD\'S CROSS-CHECK ALERT. Automated verification against Shepard\'s Citations reveals: (1) Garcetti v. Ceballos: Shepard\'s treatment — "Followed" by 847 citing decisions. The holding is clear and well-established. The AI\'s characterisation is verifiably wrong — not a close call, not a matter of interpretation, simply backwards. Any attorney reading Garcetti\'s syllabus would catch this in 30 seconds. (2) Lane v. Franks: Shepard\'s shows "Distinguished" from Garcetti in 234 decisions. The AI\'s characterisation of "narrowed" misrepresents the relationship. Lane EXPANDED protection for testimony given outside official duties. (3) The remaining 5 citations check out — proper treatment, accurate holdings. The AI was 71% accurate (5/7). In legal practice, 71% accuracy on case holdings is catastrophic. A single mischaracterised holding in a brief can result in Rule 11 sanctions, bar complaints, and malpractice claims.' },
        { agentId: 'ethics-ln', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Professional responsibility analysis: (1) ABA Opinion 512 is explicit: "A lawyer who uses GAI in connection with a representation must exercise the same professional judgment and meet the same professional obligations as when performing legal work without GAI." The supervising attorney cannot file a brief with mischaracterised holdings regardless of whether the error originated from AI or a junior associate. (2) Model Rule 3.3(a)(1): "A lawyer shall not knowingly make a false statement of fact or law to a tribunal." If the attorney relied on AI without verification and the holding is backwards, the question is whether this constitutes "knowingly" — courts are increasingly finding that failure to verify AI output IS reckless disregard. (3) FRCP Rule 11(b)(2): The attorney certifies that legal contentions are "warranted by existing law." A brief arguing Garcetti protects official-duty speech violates Rule 11 because Garcetti says the exact opposite. (4) The Mata v. Avianca precedent applies — sanctions for AI-generated false citations. This is worse: the citations are REAL but the holdings are WRONG.' },
        { agentId: 'supervising', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SUPERVISING ATTORNEY OBLIGATION. I am the partner signing this brief. Under ABA 512, my obligation is clear: I must review every Lexis+ AI output as I would review a junior associate\'s work. The Garcetti mischaracterisation is exactly the type of error that would end a junior associate\'s career at this firm. It should never appear in a filed brief. The problem: I have 47 matters, a trial starting Monday, and 48 hours until this filing deadline. The temptation is to trust the AI because "it cited real cases." But real citations with wrong holdings are MORE dangerous than hallucinated citations — opposing counsel won\'t catch a hallucination in time, but they WILL catch a backwards holding because they know these cases. Without CendiaSupervision: I might have skimmed the AI output, seen real case names, and signed the brief. With CendiaSupervision: the Shepard\'s cross-check caught the error before I even read the draft. My supervision obligation was fulfilled by architecture, not by hoping I\'d catch it at 11pm.' },
        { agentId: 'lexis-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Lexis+ AI + CendiaSupervision Research Governance: (1) SHEPARD\'S HARD-STOP: Every Lexis+ AI citation is automatically verified against Shepard\'s — not just for validity, but for holding accuracy. The AI\'s characterisation of the holding is compared to the actual holding text. Mismatches trigger a hard-stop before the research enters the brief. (2) JURISDICTION-SPECIFIC TREATMENT: Shepard\'s treatment is checked in the TARGET jurisdiction, not just nationally. A case "followed" in one circuit may be "distinguished" in another. (3) HOLDING ACCURACY SCORE: Each citation receives a holding accuracy confidence score. Below 90%: mandatory attorney review. Below 70%: citation blocked until attorney manually confirms the holding. (4) ATTORNEY SIGN-OFF: The supervising attorney reviews the Shepard\'s verification report and signs off on each citation. The sign-off is sealed with bar number and timestamp. (5) BRIEF CERTIFICATION: Before filing, CendiaSupervision generates a "Citation Integrity Certificate" — all citations verified, all holdings confirmed, attorney sign-off complete. Attached to the brief as evidence of Rule 11 compliance.' },
        { agentId: 'ethics-ln', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The Shepard\'s hard-stop + holding accuracy verification eliminates backwards holdings before they enter briefs. For the attorney: 47 matters, trial Monday, 48-hour deadline — CendiaSupervision handles the citation verification that would otherwise require 3 hours of manual Shepard\'s checking. The supervision is documented and sealed. ABA 512 satisfied. For LexisNexis: this is the competitive moat. Thomson Reuters can say "CoCounsel + Datacendia." LexisNexis can say "Lexis+ AI + Datacendia." The firm that doesn\'t choose Thomson Reuters chooses LexisNexis. BOTH need Datacendia. The market isn\'t Thomson Reuters vs LexisNexis — it\'s governed AI vs ungoverned AI. Whichever platform integrates CendiaSupervision first wins the ABA 512 compliance market. For the profession: the Mata v. Avianca era ends. Not through prohibition of AI, but through architectural supervision that makes AI-assisted briefs MORE reliable than purely human-drafted briefs.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ln10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ln20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Lexis+ AI research + Shepard\'s verification + Holding accuracy + Attorney sign-off)',
        complianceLabel: 'ABA 512 Status',
        complianceValue: '2 HOLDINGS CORRECTED',
        complianceThreshold: 'Shepard\'s cross-check: 5/7 accurate, 2 reversed',
        agents: ['Lexis+ AI Agent', 'Supervising Attorney Agent', 'Shepard\'s Verification Agent', 'Ethics & Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Lexis+ AI Brief — Shepard\'s-Verified Holdings',
        guaranteeBody: 'This cryptographic bundle seals the research governance: 7 Lexis+ AI citations, Shepard\'s cross-check (2 holdings mischaracterised — Garcetti and Lane), attorney notified, holdings corrected, brief certified with accurate analysis. Rule 11 compliance documented.',
        evidenceChain: 'Lexis+ AI research → 7 citations → Shepard\'s cross-check → 2 mischaracterisations detected → Attorney notified → Holdings corrected → Brief re-drafted → Attorney sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Lexis+ AI + CendiaSupervision catches holding mischaracterisations before they enter filed briefs — using Shepard\'s as the verification backbone for ABA 512 compliance.',
      phaseLabels: ['AI Research & Holding Mismatch', 'Ethics Risk & Supervising Attorney Duty', 'Shepard\'s Hard-Stop & Brief Certification'],
    },

    // SCENARIO 2 — LEX MACHINA: LITIGATION ANALYTICS SUPERVISION
    {
      id: 'lex-machina',
      title: 'Lex Machina — Predictive Analytics Gone Wrong',
      subtitle: '78% win prediction · Stale training data · Judge changed approach · $4.2M settlement missed',
      banner: 'Simulating the litigation analytics trap: Lex Machina predicts a 78% win rate on a motion to dismiss. The attorney advises the client to reject a $4.2M settlement. The motion is denied — the AI\'s training data didn\'t include the judge\'s recent approach change after a circuit reversal.',
      risk: 'High',
      scenarioNum: 'Analytics',
      icon: 'bar-chart',
      color: 'text-violet-400',
      agents: [
        { id: 'lex-machina-ai', name: 'Lex Machina AI Agent', role: 'Litigation Analytics & Outcome Prediction', icon: '📊', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'lit-counsel', name: 'Litigation Counsel Agent', role: 'Case Strategy & Client Counselling', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'data-qc', name: 'Data Currency Agent', role: 'Training Data Verification & Model Limitations', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'client-risk', name: 'Client Risk Agent', role: 'Settlement Analysis & Exposure Assessment', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Lex Machina Analytics', status: 'connected', type: 'Predictive Model', icon: 'trending-up', detail: 'Motion to dismiss: 78% predicted success rate' },
        { name: 'Judge Profile Database', status: 'connected', type: 'Judicial Analytics', icon: 'user', detail: 'Judge Morrison — 82% MTD grant rate (historical)' },
        { name: 'Settlement Offer', status: 'connected', type: 'Case Economics', icon: 'dollar-sign', detail: '$4.2M offer expiring in 14 days — client seeking guidance' },
        { name: 'Training Data Audit', status: 'syncing', type: 'Model Verification', icon: 'database', detail: 'Last data update: Q2 2024 — missing 8 months of judge decisions' },
      ],
      script: [
        { agentId: 'lex-machina-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Lex Machina litigation analytics for Henderson v. TechCorp, Case No. 24-cv-4421. Motion to dismiss prediction: 78% probability of success. Model inputs: (1) Judge Morrison\'s historical MTD grant rate: 82% (based on 347 motions over 12 years). (2) Claim type (employment discrimination — Title VII): Judge Morrison grants MTD in 71% of Title VII cases. (3) Factual complexity score: moderate — correlated with higher grant rates. (4) Counsel experience index: defence counsel has appeared before Judge Morrison 14 times (favorable). Recommendation: strong candidate for MTD. Client should consider rejecting the $4.2M settlement offer and filing the motion. However: the model\'s training data has a CRITICAL GAP. The data was last updated in Q2 2024. In September 2024, the Ninth Circuit reversed Judge Morrison in a landmark Title VII case (Williams v. Consolidated). Since the reversal, Judge Morrison has denied MTDs in 6 of 7 Title VII cases — a complete reversal of his prior approach. The 78% prediction is based on a judge who no longer exists.' },
        { agentId: 'data-qc', phase: 'phase1', type: 'warning', delay: 2500, content: 'DATA CURRENCY ALERT. CendiaSupervision training data audit reveals: (1) Lex Machina model training data: through June 2024. Current date: March 2026. GAP: 21 months of judicial decisions not in the model. (2) For Judge Morrison specifically: 23 decisions since the training cutoff. 7 are Title VII cases. The grant rate POST-reversal: 14% (1/7). The model reports 71%. The actual current rate is 14%. The model is 5x too optimistic. (3) The Williams v. Consolidated reversal fundamentally changed Judge Morrison\'s approach. He stated from the bench: "In light of the Circuit\'s guidance, I will apply a more searching review at the pleading stage." This statement is in the transcript but not in the model. (4) Model limitation: litigation analytics models are backward-looking. They predict based on historical patterns. When a judge\'s pattern changes — due to reversal, new precedent, or judicial philosophy evolution — the model\'s predictions become inversely correlated with reality.' },
        { agentId: 'client-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Client exposure analysis: (1) The $4.2M settlement offer expires in 14 days. If the client rejects based on the 78% prediction and the MTD is denied: the case proceeds to discovery ($800K estimated defence costs), then trial (full exposure: $12M in damages + attorney fees). (2) Expected value WITHOUT data correction: 78% × $0 + 22% × $12M = $2.64M expected cost. The $4.2M settlement is above expected value — reject looks rational. (3) Expected value WITH data correction: 14% × $0 + 86% × $12M = $10.32M expected cost. The $4.2M settlement is well BELOW expected value — accept is the only rational choice. (4) The AI prediction didn\'t just lead to a bad decision — it REVERSED the correct decision. Without the data correction, the client rejects a favorable settlement and faces $10M+ exposure. That\'s a malpractice claim. Model Rule 1.4 requires communicating information "reasonably necessary" for the client to make informed decisions. A stale prediction is not informed decision-making.' },
        { agentId: 'lit-counsel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — LITIGATION COUNSEL DUTY. ABA Opinion 512 applies to litigation analytics, not just research and drafting. When I use Lex Machina to counsel a client on settlement, I am using AI to inform a material client decision. My supervisory obligation: (1) I must understand the model\'s limitations — including training data currency. (2) I must verify that the prediction reflects current judicial behavior, not historical patterns that have changed. (3) I must disclose the model\'s limitations to the client alongside the prediction. "Lex Machina predicts 78% success" is misleading without "but the model hasn\'t been updated since the judge reversed course." (4) If I advise the client to reject $4.2M based solely on a stale AI prediction and the MTD is denied, my malpractice insurer will ask: "Did you independently verify the AI\'s prediction against current judicial behavior?" Without CendiaSupervision: no. With CendiaSupervision: yes, and it\'s documented.' },
        { agentId: 'lex-machina-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Lex Machina + CendiaSupervision Analytics Governance: (1) TRAINING DATA CURRENCY CHECK: Before any prediction is delivered, CendiaSupervision verifies the model\'s training data against the current date. If the gap exceeds 6 months for the specific judge, a "DATA CURRENCY WARNING" is attached to the prediction. (2) JUDGE-SPECIFIC RECENT DECISIONS: CendiaSupervision pulls the judge\'s decisions SINCE the training cutoff and presents them alongside the AI prediction. The attorney sees both the model prediction (78%) and the recent trend (14%). (3) CLIENT COMMUNICATION TEMPLATE: When the prediction is used in client counselling, CendiaSupervision generates a disclosure: "This prediction is based on [date range]. The judge\'s recent decisions show [trend]. We recommend considering both data points." (4) ATTORNEY SIGN-OFF: The litigation counsel signs off on the prediction\'s use in client counselling, confirming they reviewed the data currency check and recent decisions. Sealed with bar number.' },
        { agentId: 'client-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The data currency check transforms a stale prediction into informed client counselling. The attorney presents to the client: "Lex Machina\'s historical model predicts 78% success. However, Judge Morrison reversed approach after Williams v. Consolidated in September 2024. His recent Title VII MTD grant rate is 14%. We recommend accepting the $4.2M settlement." The client makes an informed decision based on complete information. The $4.2M settlement is accepted. The client saves $6-8M in potential exposure. For LexisNexis: Lex Machina + CendiaSupervision = the only litigation analytics platform that discloses its own limitations. Every competitor\'s analytics product gives a number without context. Lex Machina gives a number WITH context. That\'s the difference between a prediction and a counselling tool.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ln30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ln40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Lex Machina prediction + Training data audit + Judge recent decisions + Client counselling)',
        complianceLabel: 'Analytics Status',
        complianceValue: 'STALE DATA CAUGHT',
        complianceThreshold: 'Model: 78% → Actual: 14% — 21-month gap',
        agents: ['Lex Machina AI Agent', 'Litigation Counsel Agent', 'Data Currency Agent', 'Client Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Lex Machina Analytics — Data Currency Verified',
        guaranteeBody: 'This cryptographic bundle seals the analytics governance: Lex Machina 78% prediction, training data gap detected (21 months), judge post-reversal rate identified (14%), client counselled with both data points, settlement recommendation documented. Malpractice risk eliminated.',
        evidenceChain: 'Lex Machina prediction (78%) → Training data audit (Q2 2024 cutoff) → Judge Morrison post-reversal analysis (14%) → Client counselling with disclosure → Settlement accepted ($4.2M) → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how stale litigation analytics can reverse a settlement decision — and how CendiaSupervision catches the data currency gap before a $10M malpractice exposure.',
      phaseLabels: ['AI Prediction & Training Data Gap', 'Client Exposure & Malpractice Risk', 'Data Currency Check & Informed Counselling'],
    },

    // SCENARIO 3 — PRACTICAL GUIDANCE: CONTRACT TEMPLATE CURRENCY
    {
      id: 'practical-guidance',
      title: 'Practical Guidance — MAE Clause Template Outdated',
      subtitle: 'Merger agreement · 2019 template · Post-Akorn Delaware law · $340M MAE gap',
      banner: 'Simulating the transactional AI trap: Lexis+ AI with Practical Guidance generates an MAE clause from a 2019 template. Post-2021 Delaware law changed MAE standards. The buyer\'s MAE protection is inadequate. A material adverse event occurs. The buyer cannot terminate the deal.',
      risk: 'Critical',
      scenarioNum: 'MAE',
      icon: 'file-contract',
      color: 'text-amber-400',
      agents: [
        { id: 'practical-ai', name: 'Practical Guidance AI Agent', role: 'Template Generation & Clause Drafting', icon: '📝', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'deal-atty', name: 'Deal Attorney Agent', role: 'M&A Transaction & Clause Negotiation', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'del-law', name: 'Delaware Law Agent', role: 'Case Law Currency & MAE Standards', icon: '🏛️', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'buyer-risk', name: 'Buyer Risk Agent', role: 'Transaction Protection & Termination Rights', icon: '💼', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Practical Guidance Templates', status: 'connected', type: 'Clause Library', icon: 'library', detail: 'MAE clause generated from 2019 template — missing post-Akorn updates' },
        { name: 'Delaware Case Law Monitor', status: 'connected', type: 'Legal Updates', icon: 'book-open', detail: 'Akorn v. Fresenius (2018), Snow Phipps (2021), AB Stable VIII (2020)' },
        { name: 'Deal Data Room', status: 'connected', type: 'Transaction', icon: 'database', detail: '$1.6B acquisition — MAE clause is the primary termination right' },
        { name: 'Template Currency Engine', status: 'syncing', type: 'Version Control', icon: 'git-branch', detail: 'Template last updated: March 2019 — 7 years stale' },
      ],
      script: [
        { agentId: 'practical-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Practical Guidance AI has generated an MAE (Material Adverse Effect) clause for a $1.6B acquisition agreement. The template used is from the "M&A Merger Agreement — Public Company" Practical Guidance form, last substantively updated March 2019. The generated MAE definition includes standard carve-outs: general economic conditions, industry conditions, changes in law, natural disasters, and "conditions arising from the announcement of the transaction." However: the template is MISSING critical developments in Delaware MAE law since 2019: (1) The Akorn v. Fresenius analysis (2018, decided just before the template was last updated) established the first successful MAE termination — but the template\'s MAE definition doesn\'t incorporate the specific duration and magnitude standards Akorn articulated. (2) AB Stable VIII v. Maps Hotels (2020): the Court of Chancery applied Akorn and added analysis of "ordinary course" covenants during a pandemic. The template has no pandemic/force majeure interaction with MAE. (3) Snow Phipps Group v. KCAKE (2021): further refined the MAE analysis — the template predates this entirely. The buyer is acquiring $1.6B in enterprise value with an MAE termination right that doesn\'t reflect 7 years of case law evolution.' },
        { agentId: 'del-law', phase: 'phase1', type: 'warning', delay: 2500, content: 'DELAWARE LAW CURRENCY ALERT. The MAE clause is critically outdated: (1) Akorn\'s "durationally significant" standard: the template uses vague language ("would reasonably be expected to have a Material Adverse Effect"). Post-Akorn practice specifies quantitative thresholds — many buyers now define MAE as a decline of 20%+ in revenue or EBITDA sustained for 2+ consecutive quarters. The template provides NO quantitative guidance. (2) The template\'s carve-out for "general economic conditions" is overbroad. Post-Akorn, buyers negotiate that the carve-out only applies if the target is not DISPROPORTIONATELY affected. The template lacks the disproportionate impact qualifier. (3) Pandemic/epidemic carve-out: the template includes "natural disasters" but not "pandemics" or "epidemics." Post-AB Stable VIII, this is a heavily negotiated provision. Absence is a significant gap. (4) The template\'s "ordinary course" covenant doesn\'t address the interaction with MAE that AB Stable VIII examined — specifically, whether compliance with the ordinary course covenant is measured against the target\'s pre-signing business plan or current conditions. A $1.6B deal with a 2019 MAE template is like buying a house with a 2019 home inspection — the foundation might have cracked since then.' },
        { agentId: 'buyer-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Buyer protection analysis: (1) If a material adverse event occurs between signing and closing — the target\'s revenue drops 40% — the buyer needs to terminate. With the 2019 template: the seller argues the MAE carve-outs (general economic conditions, industry conditions) apply. Without quantitative thresholds and without the disproportionate impact qualifier, the buyer cannot prove MAE. The buyer is forced to close at $1.6B on a company now worth $900M. Loss: $700M. (2) The buyer\'s board approved the deal based on the MAE protection. If the MAE clause is unenforceable due to outdated template language, the board\'s approval was based on incomplete legal advice. Director liability follows. (3) The deal counsel — who used Practical Guidance AI to draft the MAE clause — faces malpractice liability. "I used LexisNexis\'s template" is not a defence when the template is 7 years stale and the attorney didn\'t verify currency.' },
        { agentId: 'deal-atty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DEAL ATTORNEY ABA 512 OBLIGATION. I used Practical Guidance AI to generate the first draft of the MAE clause. Under ABA 512, I must supervise the AI output — which includes verifying that the template reflects CURRENT law. The template\'s version date (March 2019) was not prominently displayed in the AI output. I would have needed to independently research Delaware MAE law to discover the template is stale. The question: does ABA 512 require me to independently verify the currency of every AI-generated template? YES. The AI is not a law library — it\'s a first draft. Just as I would verify a junior associate\'s citation to a 2019 case, I must verify that a 2019 template reflects 2026 law. Without CendiaSupervision: I might have used the template as-is, negotiated minor changes, and signed the agreement. My client\'s $1.6B deal has a 2019-era MAE clause. With CendiaSupervision: the template currency check flags the 7-year gap immediately.' },
        { agentId: 'practical-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Practical Guidance + CendiaSupervision Template Governance: (1) TEMPLATE CURRENCY CHECK: Every Practical Guidance template includes its last-updated date. CendiaSupervision compares the template date against key case law developments. If material case law has evolved since the template date, a "TEMPLATE CURRENCY WARNING" is displayed. (2) CASE LAW DELTA REPORT: For the MAE clause, the warning includes: "This template predates Akorn v. Fresenius analysis (2018), AB Stable VIII (2020), and Snow Phipps (2021). Key changes: quantitative MAE thresholds, disproportionate impact qualifiers, pandemic carve-outs, ordinary course interaction." (3) UPDATED LANGUAGE SUGGESTIONS: CendiaSupervision suggests specific clause language reflecting current practice — not a complete re-draft, but targeted additions: disproportionate impact qualifier, quantitative thresholds, pandemic/epidemic carve-out. (4) DEAL ATTORNEY SIGN-OFF: The transactional attorney reviews the template currency check, incorporates updates, and signs off on the MAE clause as reflecting current law. Sealed with bar number.' },
        { agentId: 'buyer-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The template currency check transforms a 2019 template into a 2026-compliant clause. The MAE definition now includes: quantitative thresholds (25% revenue/EBITDA decline for 2+ quarters), disproportionate impact qualifier on all carve-outs, pandemic/epidemic carve-out with specific language, and ordinary course covenant alignment with AB Stable VIII. If a material adverse event occurs: the buyer has a defensible termination right. The $700M loss scenario is eliminated. The board\'s approval is based on current legal protection. Deal counsel\'s malpractice risk is eliminated. For LexisNexis: Practical Guidance + CendiaSupervision = the only transactional AI platform that guarantees template currency. Every Practical Guidance form comes with a currency certificate. "This clause reflects Delaware law as of [date], incorporating [case developments]." No competitor offers this — because no competitor has CendiaSupervision.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ln50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ln60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Practical Guidance template + Currency check + Case law delta + Updated clause + Attorney sign-off)',
        complianceLabel: 'Template Status',
        complianceValue: '7-YEAR GAP REMEDIATED',
        complianceThreshold: 'Template: 2019 → Updated: 2026 (Akorn, AB Stable, Snow Phipps)',
        agents: ['Practical Guidance AI Agent', 'Deal Attorney Agent', 'Delaware Law Agent', 'Buyer Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Practical Guidance — Template Currency Guaranteed',
        guaranteeBody: 'This cryptographic bundle seals the template governance: MAE clause generated from 2019 Practical Guidance template, currency check flagged 7-year gap, case law delta identified (Akorn, AB Stable VIII, Snow Phipps), clause updated with quantitative thresholds and modern carve-outs, deal attorney sign-off. $700M buyer protection preserved.',
        evidenceChain: 'Practical Guidance template (2019) → Currency check → Case law delta (3 key decisions) → Template updated → MAE clause modernised → Deal attorney sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Practical Guidance + CendiaSupervision catches a 7-year-stale MAE template before it costs a buyer $700M in termination protection.',
      phaseLabels: ['Outdated Template & Delaware Law Gap', 'Buyer Exposure & Malpractice Risk', 'Template Currency Check & Modern Clause'],
    },

    // SCENARIO 4 — LEXISNEXIS: FCRA BACKGROUND SCREENING
    {
      id: 'ln-fcra-screening',
      title: 'LexisNexis Risk Solutions — FCRA Background Screening Error',
      subtitle: 'Consumer report · Name match false positive · Wrongful denial · $2.1M class action',
      banner: 'Simulating the FCRA crisis: LexisNexis Risk Solutions generates a background screening report that conflates two individuals with similar names. The applicant is wrongfully denied employment based on a criminal record that belongs to someone else. FCRA class action follows.',
      risk: 'Critical',
      scenarioNum: 'FCRA',
      icon: 'user-x',
      color: 'text-red-400',
      agents: [
        { id: 'risk-ai', name: 'LN Risk Solutions Agent', role: 'Background Screening & Consumer Data', icon: '🔍', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'employer', name: 'Employer Compliance Agent', role: 'Hiring Decision & Adverse Action', icon: '🏢', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'fcra-counsel', name: 'FCRA Counsel Agent', role: 'Consumer Reporting Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'consumer', name: 'Consumer Rights Agent', role: 'Applicant Harm & Dispute Resolution', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'LN Risk Solutions', status: 'connected', type: 'Background Screening', icon: 'database', detail: 'Name match: "James R. Williams" — matched to criminal record of "James T. Williams"' },
        { name: 'FCRA Compliance', status: 'connected', type: 'Consumer Reporting', icon: 'shield', detail: 'FCRA §607(b): CRA must follow reasonable procedures for maximum possible accuracy' },
        { name: 'Employer ATS', status: 'connected', type: 'Hiring System', icon: 'briefcase', detail: 'Adverse action taken — offer rescinded based on AI-generated report' },
        { name: 'FTC/CFPB Monitor', status: 'syncing', type: 'Enforcement', icon: 'alert-triangle', detail: 'CFPB consent orders for CRA name-matching errors: $5M-$35M penalties' },
      ],
      script: [
        { agentId: 'risk-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'LexisNexis Risk Solutions background screening report for "James R. Williams" (DOB: 03/15/1987, SSN: ***-**-4521). AI name-matching algorithm identified a criminal record match: "James T. Williams" (DOB: 03/12/1987, SSN: ***-**-4512). Match confidence: 87%. Name: 90% match (first/last identical, middle initial differs). DOB: 97% match (3 days apart). SSN: 78% match (transposed last 2 digits). The AI flagged this as a PROBABLE MATCH and included the criminal record (felony drug conviction, 2019) in the consumer report. CRITICAL ERROR: These are two different people. The applicant (James R. Williams) has no criminal record. The criminal record belongs to James T. Williams — a different individual with a similar name and close DOB. The SSN transposition should have been a disqualifying factor, but the AI\'s weighted scoring gave name and DOB sufficient weight to override the SSN mismatch.' },
        { agentId: 'fcra-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'FCRA COMPLIANCE ALERT. The report violates multiple FCRA provisions: (1) §607(b): CRAs must "follow reasonable procedures to assure maximum possible accuracy." An 87% confidence match that includes a criminal record is NOT maximum possible accuracy — it\'s an 13% chance of destroying an innocent person\'s employment. (2) §611: When the consumer disputes, the CRA must reinvestigate within 30 days. But the damage is already done — the job offer was rescinded. (3) CFPB enforcement precedent: the CFPB fined a major CRA $5.5M for name-matching errors in 2024. The FTC fined another $23.8M. LexisNexis Risk Solutions settled a class action for $11M in 2022 over similar issues. (4) This is a systemic risk: LexisNexis processes millions of background checks annually. If the AI\'s 87% threshold generates false matches at even 1% rate: tens of thousands of consumers are affected.' },
        { agentId: 'consumer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Consumer harm assessment: (1) James R. Williams was offered a $95K/year position. The offer was rescinded based on the false criminal record. He has been unemployed for 4 months — lost income: $31.7K. (2) The employer\'s adverse action notice cited "criminal background" without specifying the report was AI-generated with 87% confidence. James had no opportunity to dispute BEFORE the adverse action. (3) FCRA §604(b)(3)(A) requires pre-adverse-action notice with a copy of the report. Even if the employer complied, James would need to dispute a record that isn\'t his — a process that takes 30+ days during which the job goes to another candidate. (4) Reputational harm: James applied to 3 other employers who use the same LexisNexis data. All 3 received the same false criminal record. James cannot get hired anywhere in his industry. (5) Class action potential: if similar false matches affect 5,000+ consumers annually: $2.1M+ statutory damages under FCRA §616 ($100-$1,000 per consumer).' },
        { agentId: 'employer', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — EMPLOYER LIABILITY. As the employer, I relied on LexisNexis\'s report. I followed my FCRA adverse action procedures. But: (1) I used an AI-generated report with 87% confidence to make a hiring decision. If 87% confidence means 13% false positive rate, I knowingly used an unreliable tool. (2) EEOC guidance on criminal background checks: employers must conduct "individualized assessment." I did not — I relied on the AI report alone. (3) My company faces: FCRA vicarious liability (using an inaccurate report), Title VII disparate impact risk (if false matches disproportionately affect minorities), and state ban-the-box law violations. Without CendiaSupervision: I treated the AI report as fact. With CendiaSupervision: the confidence score is surfaced with a HARD-STOP below 95% — requiring manual verification before adverse action.' },
        { agentId: 'risk-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing LN Risk Solutions + CendiaSupervision Screening Governance: (1) CONFIDENCE THRESHOLD: CendiaSupervision enforces a 95% minimum confidence for criminal record inclusion. Below 95%: the record is NOT included in the report — instead, a "manual verification recommended" flag is generated. (2) SSN HARD-MATCH: Any SSN mismatch (even transposed digits) requires manual verification before criminal record inclusion. SSN is the strongest identity signal — it should not be overridden by name/DOB similarity. (3) EMPLOYER TRANSPARENCY: The report includes confidence scores for each matched record. Employers see: "Criminal record match: 87% confidence — BELOW THRESHOLD — manual verification required before adverse action." (4) CONSUMER NOTIFICATION: If a below-threshold match exists, the consumer is notified and given the opportunity to verify identity BEFORE the report goes to the employer. (5) AUDIT TRAIL: Every screening decision is documented — match methodology, confidence scores, threshold applied, manual review status. Evidence for CFPB examination and FCRA litigation.' },
        { agentId: 'consumer', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The 95% threshold + SSN hard-match prevents the false inclusion. James R. Williams receives a clean report. The employer hires him. No adverse action, no unemployment, no class action. For LexisNexis: Risk Solutions + CendiaSupervision = FCRA-compliant AI screening. The 87% match is flagged, not included. The consumer is protected. The employer avoids liability. LexisNexis avoids another class action. "Our background screening AI includes confidence-based governance — no criminal record included below 95% confidence" — that\'s the feature that wins enterprise screening contracts and prevents the next $11M settlement.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ln40123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ln50123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (LN screening + Confidence scoring + SSN verification + Consumer protection)',
        complianceLabel: 'FCRA Status',
        complianceValue: 'FALSE MATCH BLOCKED (87% < 95%)',
        complianceThreshold: 'SSN mismatch detected — manual verification required',
        agents: ['LN Risk Solutions Agent', 'Employer Compliance Agent', 'FCRA Counsel Agent', 'Consumer Rights Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'LN Risk Solutions — FCRA Screening Governance',
        guaranteeBody: 'Background screening confidence threshold enforced: 87% match blocked (below 95% minimum). SSN transposition detected. Consumer report issued without false criminal record. Applicant hired. FCRA §607(b) maximum accuracy satisfied.',
        evidenceChain: 'LN screening → Name match (87%) → SSN mismatch detected → Below 95% threshold → Record excluded → Clean report issued → Employer notified → Consumer protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how LN Risk Solutions + CendiaSupervision prevents a false criminal record match from destroying an innocent applicant\'s career.',
      phaseLabels: ['AI Name Match & False Positive', 'Consumer Harm & Class Action Risk', 'Confidence Threshold & Identity Verification'],
    },

    // SCENARIO 5 — LEXISNEXIS: SHEPARD'S SIGNAL MISREAD
    {
      id: 'ln-shepards-signal',
      title: 'Lexis+ AI — Shepard\'s Signal Misinterpreted',
      subtitle: 'Yellow flag · Distinguished vs weakened · Brief relies on "good law" · Court rejects',
      banner: 'Simulating Lexis+ AI\'s unique risk: the AI reads a Shepard\'s yellow flag as "caution — still good law" when the case has been distinguished on the EXACT issue the brief relies on. Unlike a red flag (overruled), yellow flags require nuanced analysis that AI mishandles.',
      risk: 'High',
      scenarioNum: 'Shepards',
      icon: 'flag',
      color: 'text-amber-400',
      agents: [
        { id: 'lexis-ai-sh', name: 'Lexis+ AI Agent', role: 'Legal Research with Shepard\'s Integration', icon: '🤖', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'shepards', name: 'Shepard\'s Analysis Agent', role: 'Citation Treatment & Signal Interpretation', icon: '🚦', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'lit-counsel', name: 'Litigation Counsel Agent', role: 'Brief Drafting & Case Strategy', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'court-ln', name: 'Court Standards Agent', role: 'FRCP Rule 11 & Citation Accuracy', icon: '🏛️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Lexis+ AI', status: 'connected', type: 'Legal Research', icon: 'cpu', detail: 'Case cited with Shepard\'s yellow flag — AI summary: "caution, still good law"' },
        { name: 'Shepard\'s Citations', status: 'connected', type: 'Treatment Analysis', icon: 'flag', detail: 'Yellow flag: distinguished by 3rd Circuit on personal jurisdiction issue' },
        { name: 'Brief Filing', status: 'connected', type: 'Motion Practice', icon: 'file-text', detail: 'Motion to dismiss for lack of personal jurisdiction — relies on yellow-flagged case' },
        { name: 'Rule 11 Module', status: 'syncing', type: 'Filing Standards', icon: 'shield', detail: 'Rule 11(b)(2): legal contentions warranted by existing law' },
      ],
      script: [
        { agentId: 'lexis-ai-sh', phase: 'phase1', type: 'analysis', delay: 800, content: 'Lexis+ AI research for motion to dismiss — personal jurisdiction. Key authority identified: Morrison v. Digital Commerce Inc. (3rd Cir. 2019). Shepard\'s Signal: YELLOW FLAG (Caution). Lexis+ AI summary: "Morrison remains good law but has been distinguished by subsequent decisions. The case establishes that mere website accessibility does not constitute minimum contacts for specific personal jurisdiction." The attorney drafts the motion relying on Morrison\'s minimum contacts analysis. CRITICAL ERROR: The Shepard\'s yellow flag indicates Morrison was distinguished — but Lexis+ AI\'s summary doesn\'t explain WHAT ISSUE it was distinguished on. Morrison was distinguished by Chen v. TechStream Corp. (3rd Cir. 2024) specifically on the issue of interactive website contacts — the EXACT issue in the attorney\'s case. Chen held that when a website facilitates transactions (not just provides information), interactive website contacts CAN establish minimum contacts. The attorney\'s case involves a transactional website. Morrison\'s rule doesn\'t apply — Chen\'s distinction controls.' },
        { agentId: 'shepards', phase: 'phase1', type: 'warning', delay: 2500, content: 'SHEPARD\'S DEEP ANALYSIS. CendiaSupervision issue-level Shepard\'s analysis: (1) Morrison has 47 citing references. Yellow flag based on 3 "distinguished" treatments. (2) The 3 distinguishing cases ALL address the same issue: interactive vs passive websites. Morrison involved a passive informational website. The distinguishing cases involved interactive/transactional websites. (3) Chen v. TechStream (3rd Cir. 2024) is the most recent and directly on point: "Where a website facilitates commercial transactions with forum residents, the Zippo sliding scale analysis requires a finding of sufficient minimum contacts. Morrison is distinguishable because it addressed a purely informational website." (4) The attorney\'s case: defendant operates an e-commerce website that sold products to 12,000 forum residents. This is a transactional website — squarely within Chen\'s holding, NOT Morrison\'s. (5) Lexis+ AI gave a generic yellow flag summary. It did NOT analyse whether the distinguishing issue overlaps with the attorney\'s specific legal question.' },
        { agentId: 'court-ln', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. If the motion relies on Morrison: (1) Opposing counsel will cite Chen v. TechStream and argue Morrison is distinguishable on the exact issue. The court will agree. The motion is denied. (2) Rule 11(b)(2): the attorney certified the motion is "warranted by existing law." Citing Morrison for transactional websites when Chen specifically distinguishes Morrison on that issue may not be "warranted by existing law." (3) The court may question counsel\'s competence: "Did you Shepardize this case? The yellow flag specifically indicates it was distinguished on the issue you\'re arguing." The answer — "Lexis+ AI told me it was still good law" — is not a defence under ABA 512. (4) The broader problem: yellow flags are the most dangerous Shepard\'s signal because they require ISSUE-LEVEL analysis. Red flags are clear (overruled). Green flags are clear (followed). Yellow flags mean "good on some issues, bad on others" — and AI summaries don\'t tell you WHICH issues.' },
        { agentId: 'lit-counsel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — LITIGATION COUNSEL DUTY. I relied on Lexis+ AI\'s summary: "caution, still good law." That summary is technically accurate — Morrison IS still good law on passive websites. But it\'s misleading for MY case because my case involves a transactional website. ABA 512 requires me to understand the AI\'s limitations. Shepard\'s signals are case-level, not issue-level. A yellow flag means "look deeper" — and I didn\'t look deeper because the AI summary seemed sufficient. Without CendiaSupervision: I cite Morrison, the motion is denied, and the court questions my competence. With CendiaSupervision: the issue-level Shepard\'s analysis matches the distinguishing issue (interactive websites) to my case facts (transactional website) and BLOCKS the citation with an explanation.' },
        { agentId: 'lexis-ai-sh', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Lexis+ AI + CendiaSupervision Shepard\'s Governance: (1) ISSUE-LEVEL ANALYSIS: CendiaSupervision analyses WHY a case received a yellow flag — identifying the specific issues on which it was distinguished. (2) CASE-FACT MATCHING: The distinguishing issues are compared to the attorney\'s case facts. If the yellow flag issue overlaps with the case issue: HARD-STOP — citation blocked with explanation. (3) ALTERNATIVE AUTHORITY: When a citation is blocked, CendiaSupervision identifies the distinguishing case (Chen) as the controlling authority and suggests it as the correct citation. (4) SIGNAL EDUCATION: The attorney sees: "Morrison (yellow flag): distinguished on interactive website contacts by Chen v. TechStream (2024). Your case involves a transactional website — Chen controls, not Morrison." (5) BRIEF CERTIFICATION: The attorney reviews the issue-level analysis and signs off on each citation. The brief is filed with verified citations only.' },
        { agentId: 'court-ln', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The issue-level analysis catches the overlap. Morrison is blocked. Chen is suggested as the correct authority. The attorney restructures the motion — either finding a different basis for dismissal or advising the client that personal jurisdiction exists. For LexisNexis: Lexis+ AI + CendiaSupervision = the only legal research platform with issue-level Shepard\'s governance. Shepard\'s signals are LexisNexis\'s crown jewel. CendiaSupervision makes them SMARTER — not just case-level flags, but issue-level analysis matched to the attorney\'s specific case. "Our Shepard\'s analysis tells you not just THAT a case was distinguished, but WHETHER the distinguishing issue affects YOUR case" — that\'s the feature upgrade that justifies Lexis+ AI\'s premium pricing.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ln60123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ln70123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Lexis+ AI + Issue-level Shepard\'s + Case-fact matching + Counsel sign-off)',
        complianceLabel: 'Shepard\'s Status',
        complianceValue: 'YELLOW FLAG — ISSUE OVERLAP CAUGHT',
        complianceThreshold: 'Distinguished on interactive websites — matches case facts',
        agents: ['Lexis+ AI Agent', 'Shepard\'s Analysis Agent', 'Litigation Counsel Agent', 'Court Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Lexis+ AI — Issue-Level Shepard\'s Governance',
        guaranteeBody: 'Issue-level Shepard\'s analysis matched distinguishing issue (interactive website contacts) to case facts (transactional website). Morrison citation blocked. Chen v. TechStream identified as controlling. Brief corrected. Rule 11 compliance documented.',
        evidenceChain: 'Lexis+ AI (Morrison, yellow flag) → Issue-level analysis → Distinguished on interactive websites → Case-fact match (transactional site) → Citation blocked → Chen suggested → Brief corrected → Counsel sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Lexis+ AI + CendiaSupervision performs issue-level Shepard\'s analysis — catching a yellow flag overlap that generic AI summaries miss.',
      phaseLabels: ['Yellow Flag & Generic AI Summary', 'Issue Overlap & Motion Failure', 'Issue-Level Analysis & Case-Fact Matching'],
    },
  ],

        complianceScore: 88,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.175Z",
            "type": "analysis",
            "title": "Legal Research Complete - Lexis+ AI Brief — Holding Mischaracterisation",
            "description": "Professional responsibility, ethics compliance, malpractice prevention: Legal Research Complete analysis for Lexisnexis completed with industry-specific compliance checks",
            "agent": "AI Research Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.175Z",
            "type": "warning",
            "title": "Ethics Review Required - Lexis+ AI Brief — Holding Mischaracterisation",
            "description": "Professional responsibility, ethics compliance, malpractice prevention: Ethics Review Required analysis for Lexisnexis completed with industry-specific compliance checks",
            "agent": "Ethics Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.175Z",
            "type": "dissent",
            "title": "Professional Liability Risk - Lexis+ AI Brief — Holding Mischaracterisation",
            "description": "Professional responsibility, ethics compliance, malpractice prevention: Professional Liability Risk analysis for Lexisnexis completed with industry-specific compliance checks",
            "agent": "Risk Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.175Z",
            "type": "proposal",
            "title": "Supervision Protocol - Lexis+ AI Brief — Holding Mischaracterisation",
            "description": "Professional responsibility, ethics compliance, malpractice prevention: Supervision Protocol analysis for Lexisnexis completed with industry-specific compliance checks",
            "agent": "Attorney Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.175Z",
            "type": "resolution",
            "title": "Bar Complaint Avoided - Lexis+ AI Brief — Holding Mischaracterisation",
            "description": "Professional responsibility, ethics compliance, malpractice prevention: Bar Complaint Avoided analysis for Lexisnexis completed with industry-specific compliance checks",
            "agent": "Compliance Agent",
            "impact": "high"
      }
]};

export default config;
