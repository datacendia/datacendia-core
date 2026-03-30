/**
 * Relativity Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for e-discovery AI governance.
 * Access: /sandbox/relativity (Key: RL-78)
 *
 * @module pages/sandbox/configs/relativity
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Relativity',
  accessKey: 'RL-78',
  sessionKey: 'relativity-sandbox-unlocked',

  accent: 'sky',
  accentColor: 'text-sky-400',
  accentHover: 'from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600',
  ringColor: 'focus:ring-sky-500/30',
  borderColor: 'border-sky-500/30',
  gradientFrom: 'from-sky-600/20',
  gradientTo: 'to-sky-900/20',

  footerNote: '50 regulatory scenarios mapped for Relativity × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'air-privilege',
      title: 'aiR for Privilege — 1,400 Documents Improperly Withheld',
      subtitle: 'FRE 502 · 96.9% precision · Motion to compel · In camera review ordered',
      banner: 'Simulating the e-discovery privilege crisis: aiR for Review classifies 45,000 documents as privileged in securities litigation. Attorney samples 5%. Extrapolating from the 3.1% false positive rate: ~1,400 non-privileged documents are improperly withheld. Opposing counsel moves to compel.',
      risk: 'Critical',
      scenarioNum: 'Privilege',
      icon: 'lock',
      color: 'text-sky-400',
      agents: [
        { id: 'air-ai', name: 'aiR for Review Agent', role: 'AI Document Classification & Privilege Detection', icon: '📁', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'priv-counsel-rel', name: 'Privilege Counsel Agent', role: 'Privilege Log & FRE 502 Compliance', icon: '🔒', color: 'text-violet-400', borderColor: 'border-violet-500/40', bgColor: 'bg-violet-500/10' },
        { id: 'opposing-rel', name: 'Opposing Counsel Agent', role: 'Motion to Compel & Privilege Challenge', icon: '⚔️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'judge-rel', name: 'Court Standards Agent', role: 'FRCP 26(b)(5) & E-Discovery Governance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'aiR for Review', status: 'connected', type: 'AI Document Review', icon: 'cpu', detail: '2M documents processed — 45,000 classified privileged' },
        { name: 'Privilege Log', status: 'connected', type: 'FRE 502', icon: 'list', detail: '45,000 entries — attorney reviewed 5% (2,250 of 45,000)' },
        { name: 'QC Dashboard', status: 'connected', type: 'Quality Metrics', icon: 'bar-chart', detail: '96.9% precision — 70 false positives in 2,250 sample' },
        { name: 'Court ECF', status: 'syncing', type: 'Motion Practice', icon: 'gavel', detail: 'Motion to compel filed — in camera review of 500 documents requested' },
      ],
      script: [
        { agentId: 'air-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'aiR for Review document classification complete for In re Securities Litigation No. 25-cv-3341. 2,000,000 documents processed from 47 custodians. AI classification results: 45,000 PRIVILEGED (attorney-client: 31,200; work product: 11,700; joint defence: 2,100). 1,955,000 classified non-privileged for production. Attorney QC protocol: 5% random sample of privileged set = 2,250 documents reviewed. Sample results: 2,180 correctly classified as privileged (96.9% precision). 70 false positives reclassified as non-privileged. The 70 false positives were produced. However: 42,750 privilege classifications were NOT reviewed by any attorney. If the 3.1% false positive rate applies uniformly: approximately 1,325 non-privileged documents remain improperly withheld. Opposing counsel\'s data analytics team has already identified statistical anomalies in the privilege log — unusual clustering of privilege claims around certain date ranges and custodians.' },
        { agentId: 'opposing-rel', phase: 'phase1', type: 'warning', delay: 2500, content: 'MOTION TO COMPEL. Opposing counsel argues: (1) "The producing party withholds 45,000 documents as privileged but only reviewed 5%. Their own QC shows a 3.1% error rate. That means approximately 1,325 documents are improperly withheld." (2) "We identified 47 documents in the privilege log that claim attorney-client privilege for communications that include non-attorney recipients with no common interest — these are facially non-privileged and the AI classification is wrong." (3) "The producing party\'s \'privilege review\' is an AI classification followed by a cursory spot-check. This is not the \'particularized showing\' required by FRCP 26(b)(5)(A)." (4) "We request: (a) in camera review of 500 randomly selected documents from the unreviewed 42,750, (b) if the error rate exceeds 3%, a complete re-review at producing party\'s expense, and (c) sanctions for inadequate privilege review methodology." (5) The motion cites Mfg. Automation & Software Sys. v. Hughes and recent AI-specific e-discovery orders requiring disclosure of AI methodology.' },
        { agentId: 'judge-rel', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Judicial analysis: (1) FRCP 26(b)(5)(A) requires the withholding party to "describe the nature of the documents, communications, or tangible things not produced" in a way that enables the requesting party to "assess the claim." An AI-generated privilege log with 95% of entries unreviewed by any attorney may not satisfy this. (2) FRE 502(b) — the "reasonable steps" question: the producing party took SOME steps (5% sample), but is 5% "reasonable" when the known error rate suggests 1,325 improperly withheld documents? (3) The Sedona Conference Principles on ESI production encourage proportionality — but proportionality in AI review means adequate QC, not minimal QC. (4) I am inclined to order the in camera review. If the 500-document sample confirms the 3.1% error rate, a broader remedy may be required. The producing party\'s methodology must be documented and defensible — not just described in a declaration, but supported by contemporaneous evidence of the QC procedures actually performed.' },
        { agentId: 'priv-counsel-rel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PRIVILEGE COUNSEL GOVERNANCE GAP. I certified the privilege log. My certification was based on: 2,250 documents I personally reviewed + 42,750 I trusted the AI to classify correctly. I cannot truthfully certify that I "reviewed" 42,750 documents I never saw. I CAN certify the methodology: "I supervised an AI-assisted privilege review using aiR for Review, personally reviewed a 5% sample achieving 96.9% precision, and reclassified 70 documents." But without CendiaSupervision: this methodology is described in my declaration but not documented contemporaneously. I wrote the declaration AFTER opposing counsel filed the motion. The court may question whether the QC was really 5% or whether I\'m reconstructing the methodology to defend the motion. With CendiaSupervision: every AI classification is hashed at creation, every attorney review is timestamped, the 70 reclassifications are documented with reasons. The methodology is sealed BEFORE the motion, not described AFTER.' },
        { agentId: 'air-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing aiR for Review + CendiaSupervision E-Discovery Governance: (1) TIERED REVIEW PROTOCOL: High-risk privileged documents (attorney custodians, litigation-related): 100% attorney review. Medium-risk (mixed custodians, date-range overlap): 20% sample. Low-risk (administrative, routine): 5% sample. Total attorney review: ~35% of privileged set instead of 5%. (2) QUALITY METRICS BY TIER: Precision/recall documented per tier. If any tier exceeds 3% error rate, sample size auto-increases to 50%. (3) SEALED METHODOLOGY: The entire QC protocol is documented and sealed BEFORE production — AI classification parameters, tiered review criteria, sample selection method, attorney review timestamps, reclassification reasons. (4) COURT-READY REPORT: When challenged, the sealed report shows the court exactly what was done, when, and by whom. No after-the-fact declarations needed. (5) OPPOSING COUNSEL TRANSPARENCY: The methodology report can be shared with opposing counsel (without privileged content) to resolve disputes without in camera review.' },
        { agentId: 'judge-rel', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The tiered review protocol addresses every concern: (1) FRCP 26(b)(5): privilege log supported by documented, tiered attorney review — not just AI classification. (2) FRE 502(b): tiered review with quality metrics constitutes "reasonable steps" — the methodology is proportional and documented. (3) Opposing counsel\'s motion: the sealed methodology report demonstrates the producing party\'s QC was real, contemporaneous, and adequate. In camera review may still be ordered for specific disputed documents, but blanket re-review is not warranted. (4) The sealed evidence transforms the privilege dispute from "did they review enough?" to "was their documented methodology reasonable?" — a much more defensible position. For Relativity: aiR + CendiaSupervision = the only e-discovery AI with court-ready governance documentation. Every privilege review, every production, every regulatory response comes with sealed methodology. "Our privilege review is documented and defensible by architecture, not by declaration."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (aiR classification + Tiered review + Quality metrics + Sealed methodology)',
        complianceLabel: 'Privilege Status',
        complianceValue: 'TIERED REVIEW — 96.9% PRECISION',
        complianceThreshold: '35% attorney review, 3 tiers, sealed methodology',
        agents: ['aiR for Review Agent', 'Privilege Counsel Agent', 'Opposing Counsel Agent', 'Court Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'aiR for Review — Court-Defensible Privilege Methodology',
        guaranteeBody: 'This cryptographic bundle seals the privilege review: 2M documents, 45,000 privileged, tiered attorney review (100%/20%/5% by risk), quality metrics per tier (96.9% precision), 70 reclassifications documented, sealed methodology report. FRCP 26(b)(5) and FRE 502(b) satisfied by architecture.',
        evidenceChain: 'aiR classification (2M docs) → 45,000 privileged → Tiered review → High-risk: 100% → Medium: 20% → Low: 5% → Quality metrics sealed → 70 reclassified → Methodology report → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate a privilege review challenge — proving aiR + CendiaSupervision creates a court-defensible methodology that survives opposing counsel\'s motion to compel.',
      phaseLabels: ['AI Classification & Sampling Gap', 'Motion to Compel & Judicial Scrutiny', 'Tiered Review & Sealed Methodology'],
    },

    {
      id: 'air-responsive',
      title: 'aiR for Review — 340 Responsive Documents Missed',
      subtitle: 'Code words · False negatives · Spoliation motion · FRCP 37(e)',
      banner: 'Simulating the production gap: aiR for Review classifies documents as responsive/non-responsive. The AI misses 340 responsive documents containing key evidence — emails using code words the AI didn\'t recognise. Opposing counsel discovers the gap through depositions. Spoliation sanctions motion filed.',
      risk: 'Critical',
      scenarioNum: 'Production',
      icon: 'file-x',
      color: 'text-red-400',
      agents: [
        { id: 'air-prod', name: 'aiR for Review Agent', role: 'Responsiveness Classification & Production', icon: '📁', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'prod-counsel', name: 'Producing Counsel Agent', role: 'Production Obligation & FRCP 26(g) Certification', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'false-neg', name: 'False Negative Agent', role: 'Code Word Detection & Supplemental Search', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sanctions', name: 'Sanctions Risk Agent', role: 'FRCP 37(e) & Spoliation Assessment', icon: '⚠️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'aiR for Review', status: 'connected', type: 'Responsiveness Model', icon: 'cpu', detail: '1.2M documents — 340 responsive missed (code word evasion)' },
        { name: 'Deposition Transcript', status: 'connected', type: 'Discovery', icon: 'file-text', detail: 'Witness used code words: "Project Sunrise" = acquisition, "the package" = financial data' },
        { name: 'Supplemental Search', status: 'connected', type: 'Code Word Detection', icon: 'search', detail: 'Code word search of non-responsive set: 340 additional responsive found' },
        { name: 'Sanctions Database', status: 'syncing', type: 'FRCP 37(e)', icon: 'alert-triangle', detail: 'Spoliation motion pending — intent vs negligence determination' },
      ],
      script: [
        { agentId: 'air-prod', phase: 'phase1', type: 'analysis', delay: 800, content: 'aiR for Review responsiveness classification for MegaCorp v. StartupCo antitrust litigation. 1,200,000 documents collected. aiR classified 180,000 as responsive (15%) and 1,020,000 as non-responsive (85%). The responsive set was produced after attorney review. However: during depositions, a key witness referred to "Project Sunrise" discussions about the alleged anticompetitive acquisition. The witness also used "the package" to refer to financial projections shared between the parties. These code words were used deliberately to avoid detection. aiR\'s responsiveness model was trained on standard antitrust terminology: "acquisition," "merger," "market share," "competition." The model did NOT recognise "Project Sunrise" or "the package" as responsive because they are arbitrary code words with no inherent legal meaning. After deposition: opposing counsel demanded a supplemental search for these code words. Results: 340 additional responsive documents found in the non-responsive set. 47 of these are highly relevant — internal discussions about the anticompetitive purpose of the acquisition.' },
        { agentId: 'false-neg', phase: 'phase1', type: 'warning', delay: 2500, content: 'FALSE NEGATIVE ANALYSIS. The 340 missed documents reveal a systemic AI limitation: (1) aiR\'s responsiveness model uses semantic similarity to the search terms and document requests. "Project Sunrise" has zero semantic similarity to "acquisition" — it\'s an arbitrary internal code name. (2) The 47 highly relevant documents include: 12 emails where executives explicitly discuss "structuring Project Sunrise to avoid antitrust scrutiny." These are smoking-gun documents. (3) The code word pattern: internal code names are COMMON in antitrust cases specifically because parties know their communications may be discovered. AI that relies on semantic similarity will systematically miss coded communications — the exact communications that are most probative. (4) This is not a calibration problem — it\'s a fundamental limitation of semantic AI in adversarial discovery. The parties most likely to use code words are the parties with the most to hide. AI misses the most important documents.' },
        { agentId: 'sanctions', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Spoliation/sanctions analysis: (1) FRCP 37(e) applies to ESI that "should have been preserved." The documents exist and were preserved — but they weren\'t PRODUCED. This is a production failure, not spoliation. However, the effect is similar: relevant evidence was withheld. (2) FRCP 26(g)(1): The producing attorney certified that the production was "complete and correct." The certification was wrong — 340 responsive documents were not produced. Was this "reasonable inquiry"? (3) The court will ask: "What was the AI review methodology? Did the producing party anticipate code word usage? Was any supplemental searching conducted beyond the AI?" (4) If the answer is "we relied entirely on aiR and did no supplemental searching": the failure to supplement AI with targeted searches (custodian interviews, code word identification) may constitute failure to make reasonable inquiry. (5) The 47 smoking-gun documents — if they would have changed the case outcome — create potential for adverse inference instruction under FRCP 37(e)(2).' },
        { agentId: 'prod-counsel', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PRODUCING COUNSEL DUTY. My FRCP 26(g) certification: I certified the production was the result of "reasonable inquiry." I used aiR for Review — a market-leading AI tool. But "reasonable inquiry" in antitrust discovery includes anticipating that parties may use code words. Standard antitrust discovery practice: custodian interviews to identify internal project names, code words, and informal terminology. I should have: (1) Interviewed key custodians about internal terminology BEFORE the AI review. (2) Added identified code words to the search parameters. (3) Conducted targeted searches for custodian-specific internal language. Without CendiaSupervision: I relied on aiR alone. The AI did its job — it found everything that looked like antitrust terminology. It couldn\'t find what it didn\'t know to look for. With CendiaSupervision: the pre-review protocol requires custodian interview results to be fed into the AI search parameters. Code words are identified BEFORE the AI runs, not discovered during depositions.' },
        { agentId: 'air-prod', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing aiR for Review + CendiaSupervision Production Governance: (1) PRE-REVIEW PROTOCOL: Before AI classification begins, CendiaSupervision requires: custodian interviews (internal terminology, project names, code words), document request analysis (anticipated search gaps), and matter-specific terminology dictionary. Results fed into aiR\'s classification model. (2) FALSE NEGATIVE SAMPLING: After AI classification, CendiaSupervision selects a stratified random sample of the NON-RESPONSIVE set for attorney review — specifically targeting high-risk custodians and date ranges. If false negatives are found, the pattern is analysed and a supplemental search conducted. (3) CODE WORD DETECTION: CendiaSupervision runs a separate analysis looking for unusual terminology patterns in non-responsive documents — clustering analysis that identifies terms used frequently by key custodians but not in the general corpus. These may be code words. (4) PRODUCTION CERTIFICATION: The producing attorney\'s 26(g) certification is supported by documented methodology: AI classification + custodian interviews + false negative sampling + code word detection + attorney review.' },
        { agentId: 'sanctions', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The pre-review protocol + false negative sampling catches the code words BEFORE depositions reveal the gap. Custodian interviews identify "Project Sunrise" and "the package" before the AI runs. The code words are added to the search parameters. The 340 documents are classified as responsive in the initial production. The 47 smoking-gun documents are produced — they hurt the client\'s case, but producing them is the legal obligation. Better to produce voluntarily than be sanctioned for withholding. For Relativity: aiR + CendiaSupervision = e-discovery AI that anticipates adversarial behaviour. Every competitor\'s AI has the same code word blind spot. aiR with CendiaSupervision catches it by requiring pre-review custodian analysis. "Our AI review includes false negative prevention" — that\'s the feature that e-discovery counsel needs for every antitrust, securities, and government investigation case.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (aiR classification + Custodian interviews + Code word detection + False negative sampling)',
        complianceLabel: 'Production Status',
        complianceValue: '340 FALSE NEGATIVES PREVENTED',
        complianceThreshold: 'Pre-review protocol: code words identified before AI run',
        agents: ['aiR for Review Agent', 'Producing Counsel Agent', 'False Negative Agent', 'Sanctions Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'aiR for Review — False Negative Prevention',
        guaranteeBody: 'Pre-review custodian interviews identified code words ("Project Sunrise," "the package"). Code words added to AI parameters. 340 additional responsive documents classified correctly in initial production. 47 smoking-gun documents produced voluntarily. FRCP 26(g) certification supported by documented methodology.',
        evidenceChain: 'Custodian interviews → Code words identified → aiR parameters updated → 1.2M classified → 180,340 responsive → False negative sampling → Production certified → 26(g) documentation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how aiR + CendiaSupervision prevents code word blind spots — catching 340 responsive documents before depositions reveal the production gap.',
      phaseLabels: ['Code Word Evasion & AI Blind Spot', 'Spoliation Risk & 26(g) Certification', 'Pre-Review Protocol & False Negative Prevention'],
    },

    {
      id: 'trace-surveillance',
      title: 'Relativity Trace — Emoji-Based Insider Trading',
      subtitle: 'Communication surveillance · Emoji code · 98% false positive · FINRA examination',
      banner: 'Simulating the compliance surveillance gap: Relativity Trace AI monitors trader communications for insider trading. The AI uses keyword and sentiment analysis. A trader communicates MNPI using emoji-only messages. The AI cannot detect non-text communication. SEC examines.',
      risk: 'High',
      scenarioNum: 'Trace',
      icon: 'eye',
      color: 'text-amber-400',
      agents: [
        { id: 'trace-ai', name: 'Relativity Trace Agent', role: 'Communication Surveillance & Alert Generation', icon: '👁️', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'cco', name: 'Chief Compliance Officer Agent', role: 'Surveillance Programme Governance & FINRA', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'channel-analysis', name: 'Channel Coverage Agent', role: 'Communication Channel Assessment & Gap Detection', icon: '📱', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sec-exam', name: 'SEC Examination Agent', role: 'Regulatory Examination Readiness', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Relativity Trace', status: 'connected', type: 'Surveillance AI', icon: 'activity', detail: '1,200 alerts/month — 98.3% false positive rate (1,180/1,200)' },
        { name: 'Channel Monitor', status: 'connected', type: 'Communication Coverage', icon: 'message-circle', detail: 'Email: covered. Chat: covered. Emoji-only: NOT DETECTED' },
        { name: 'Trading Desk Data', status: 'connected', type: 'Trade Surveillance', icon: 'trending-up', detail: 'Trader X: 3 trades correlated with emoji messages to external contact' },
        { name: 'FINRA Exam Portal', status: 'syncing', type: 'Regulatory', icon: 'shield', detail: 'FINRA examination: "Describe your surveillance programme for non-text communications"' },
      ],
      script: [
        { agentId: 'trace-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Relativity Trace surveillance summary for Q1 2026. Monitored: 4.2M communications across 340 registered representatives. Alert generation: 1,200 alerts triggered by keyword matching, sentiment analysis, and pattern detection. Manual review results: 1,180 false positives (98.3%). 20 genuine compliance concerns identified and escalated. However: Trace AI has a fundamental detection gap for NON-TEXT communications. Trader X sent 47 messages to an external contact consisting entirely of emojis: 🚀📈💰 (sent before 3 trades that preceded positive announcements — "buy, it\'s going up, money to be made"). 📉🔥⚠️ (sent before a short sale preceding a negative announcement — "stock dropping, danger, warning"). ⏰🤫👍 (sent regarding timing — "time is right, keep quiet, go ahead"). These emoji-only messages triggered ZERO alerts because Trace\'s detection engine processes TEXT. Emojis are not keywords. Emojis have no sentiment score in the model. The 3 correlated trades generated $890K in profits from apparent insider trading — all communicated via a channel the AI cannot read.' },
        { agentId: 'channel-analysis', phase: 'phase1', type: 'warning', delay: 2500, content: 'CHANNEL COVERAGE GAP ANALYSIS. CendiaSupervision communication channel audit: (1) TEXT COMMUNICATIONS: Email (covered), Bloomberg chat (covered), Teams/Slack (covered), SMS (covered). All text-based channels monitored by Trace. (2) NON-TEXT COMMUNICATIONS: Emojis (NOT covered — no semantic analysis), Images/screenshots (NOT covered — no OCR), Voice messages (NOT covered — no transcription in current deployment), Video calls (NOT covered). (3) The emoji gap is particularly dangerous: emojis are a NATURAL encoded communication method. Unlike code words (which require pre-arrangement), emojis have universally understood meanings. 🚀📈 = positive outlook is understood by anyone. No pre-arrangement needed. (4) SEC enforcement is ahead of surveillance technology: SEC v. Panuwat (2022) established that "shadow trading" based on MNPI is actionable even without traditional insider relationship. The SEC is pursuing ALL channels of MNPI communication. Emoji-based communication WILL be an enforcement focus.' },
        { agentId: 'sec-exam', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Regulatory examination risk: (1) FINRA Rule 3110 (Supervision): The firm must establish "supervisory procedures reasonably designed to prevent and detect violations." A surveillance programme that cannot detect non-text communications is NOT "reasonably designed" when traders are known to use non-text channels. (2) SEC Risk Alert (2025): The SEC specifically identified "off-channel communications" as an examination priority. Emoji-based communication is a variant of off-channel that occurs ON monitored channels — the messages are captured, but the surveillance can\'t READ them. (3) The 98.3% false positive rate is itself a surveillance failure — alert fatigue means genuine issues are buried in noise. The compliance team spent 1,180 hours investigating false positives. Those hours could have been spent on targeted surveillance for the emoji pattern. (4) If the SEC discovers the $890K insider trading via Trader X: the firm\'s defence — "our surveillance AI couldn\'t read emojis" — will be found inadequate. The penalty: the firm faces sanctions for surveillance programme deficiency IN ADDITION TO liability for the underlying trading violation.' },
        { agentId: 'cco', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CCO PERSONAL LIABILITY. As CCO, I am personally responsible for the surveillance programme. FINRA has imposed personal fines on CCOs for surveillance programme deficiencies (FINRA Matter No. 2018057, $50K personal fine). My programme: (1) Uses Trace AI for text surveillance — industry standard. (2) Does NOT cover emoji-only communications — a known gap. (3) Has a 98.3% false positive rate — creating alert fatigue that buries genuine issues. If I KNOW about the emoji gap (and after this analysis, I do), my obligation is to address it. If I don\'t address it and the SEC discovers Trader X\'s emoji-based insider trading: the SEC will argue I knew about the gap and failed to act. My personal exposure: fine, bar from serving as CCO, reputational destruction. Without CendiaSupervision: I might not have identified the emoji gap systematically. With CendiaSupervision: the channel coverage audit identified it. My obligation is now clear and documented.' },
        { agentId: 'trace-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Relativity Trace + CendiaSupervision Surveillance Governance: (1) MULTI-MODAL DETECTION: CendiaSupervision adds non-text communication analysis to Trace: emoji semantic mapping (🚀📈💰 → positive financial sentiment), image/screenshot OCR, voice message transcription. Text + non-text = comprehensive surveillance. (2) TRADE CORRELATION: CendiaSupervision correlates communication patterns (including non-text) with trading activity. If Trader X sends 🚀📈 to an external contact and then trades, the correlation is flagged — regardless of whether the message contains text. (3) FALSE POSITIVE REDUCTION: CendiaSupervision\'s correlation engine reduces false positives by requiring BOTH communication anomaly AND trading correlation. The 98.3% false positive rate drops to ~30% because most false positives don\'t correlate with suspicious trades. (4) CHANNEL COVERAGE REPORT: CendiaSupervision generates a quarterly "Surveillance Channel Coverage Report" for the CCO — documenting which channels are monitored, which aren\'t, and what risks exist in the gaps. Evidence for FINRA examination. (5) CCO SIGN-OFF: The CCO reviews the channel coverage report and signs off quarterly. Personal liability documentation.' },
        { agentId: 'sec-exam', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The multi-modal detection + trade correlation transforms the surveillance programme: (1) Emoji communications detected: 🚀📈💰 mapped to positive financial sentiment. (2) Trade correlation: Trader X\'s emoji messages to external contact correlated with 3 profitable pre-announcement trades. ALERT GENERATED. (3) False positive rate: reduced from 98.3% to ~30% through trade correlation requirement. Compliance team reviews 360 meaningful alerts instead of 1,200 noise alerts. (4) FINRA examination: "Describe your surveillance for non-text communications." CCO presents: multi-modal detection, emoji semantic mapping, trade correlation, channel coverage report — all documented and sealed. For Relativity: Trace + CendiaSupervision = the only compliance surveillance platform with documented multi-modal coverage and trade correlation. "Our surveillance reads emojis, correlates with trades, and documents coverage quarterly" — that\'s the programme FINRA wants to see.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Trace surveillance + Multi-modal detection + Trade correlation + Channel coverage + CCO sign-off)',
        complianceLabel: 'Surveillance Status',
        complianceValue: 'EMOJI TRADING DETECTED',
        complianceThreshold: 'Multi-modal: text + emoji + trade correlation',
        agents: ['Relativity Trace Agent', 'Chief Compliance Officer Agent', 'Channel Coverage Agent', 'SEC Examination Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Relativity Trace — Multi-Modal Surveillance Governance',
        guaranteeBody: 'Communication surveillance expanded: text + emoji semantic mapping + trade correlation. Trader X emoji pattern (🚀📈💰) correlated with 3 pre-announcement trades ($890K profits). False positive rate reduced from 98.3% to ~30%. Channel coverage documented quarterly. CCO sign-off sealed.',
        evidenceChain: 'Trace text surveillance → CendiaSupervision emoji mapping → Trade correlation → Trader X flagged → 3 correlated trades → $890K suspicious profits → CCO notified → Channel report → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Relativity Trace + CendiaSupervision catches emoji-based insider trading that text-only surveillance misses — while reducing false positives from 98% to 30%.',
      phaseLabels: ['Emoji Gap & False Positive Fatigue', 'FINRA/SEC Examination & CCO Liability', 'Multi-Modal Detection & Trade Correlation'],
    },
  ],
};

export default config;
