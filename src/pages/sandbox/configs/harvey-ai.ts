/**
 * Harvey AI Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for legal AI governance.
 * Access: /sandbox/harvey (Key: HV-42)
 *
 * @module pages/sandbox/configs/harvey-ai
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Harvey AI',
  accessKey: 'HV-42',
  sessionKey: 'harvey-ai-sandbox-unlocked',

  accent: 'purple',
  accentColor: 'text-purple-400',
  accentHover: 'from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600',
  ringColor: 'focus:ring-purple-500/30',
  borderColor: 'border-purple-500/30',
  gradientFrom: 'from-purple-600/20',
  gradientTo: 'to-purple-900/20',

  footerNote: '50 regulatory scenarios mapped for Harvey AI × Datacendia · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — HARVEY: NO VERIFICATION BACKBONE
    {
      id: 'harvey-no-backbone',
      title: 'Harvey Research — No Verification Backbone',
      subtitle: 'Pure LLM output · No Westlaw · No Shepard\'s · Hallucinated citations · ICC arbitration',
      banner: 'Simulating Harvey\'s core vulnerability: unlike CoCounsel (Westlaw) or Lexis+ AI (Shepard\'s), Harvey has NO proprietary legal database. Every output is unchecked LLM generation. A Magic Circle associate includes 2 hallucinated English cases in an arbitral submission.',
      risk: 'Critical',
      scenarioNum: 'Backbone',
      icon: 'alert-triangle',
      color: 'text-purple-400',
      agents: [
        { id: 'harvey-ai', name: 'Harvey AI Agent', role: 'Generative Legal Research (No Database)', icon: '🤖', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'solicitor', name: 'Supervising Solicitor Agent', role: 'SRA Code Compliance & Case Verification', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'verifier', name: 'External Verification Agent', role: 'Citation Existence & Holding Confirmation', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'tribunal', name: 'Tribunal Standards Agent', role: 'ICC/LCIA Submission Integrity', icon: '🏛️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Harvey Platform', status: 'connected', type: 'Generative AI', icon: 'cpu', detail: '5 English cases cited — 2 do not exist (hallucinations)' },
        { name: 'External Legal Database', status: 'connected', type: 'Verification Layer', icon: 'database', detail: 'BAILII/Westlaw UK cross-check: 2 cases not found' },
        { name: 'ICC Case File', status: 'connected', type: 'Arbitration', icon: 'file-text', detail: 'Memorial due in 21 days — English law governing' },
        { name: 'SRA Compliance Module', status: 'syncing', type: 'Professional Standards', icon: 'shield', detail: 'SRA Principle 2 (competence) — AI supervision required' },
      ],
      script: [
        { agentId: 'harvey-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Harvey research complete for ICC Arbitration No. 27891/JPA. English law analysis on the doctrine of estoppel by convention. 5 cases identified: (1) Amalgamated Investment v. Texas Commerce International [1982] QB 84 — REAL, correctly characterised. (2) Republic of India v. India Steamship Co (The Indian Endurance) [1993] AC 410 — REAL, correctly characterised. (3) Baird Textiles Holdings v. Marks & Spencer [2001] EWCA Civ 274 — REAL, correctly characterised. (4) Fenwick & Elliott v. Construction Alliance Ltd [2019] EWHC 1147 — HALLUCINATION. This case does not exist. Harvey generated a plausible-sounding English case citation with realistic neutral citation format. (5) Meridian Global Investments v. Barclays Capital [2021] EWCA Civ 883 — HALLUCINATION. This case also does not exist. Harvey\'s critical vulnerability: it has NO internal database to verify whether its citations exist. CoCounsel can cross-check against Westlaw. Lexis+ AI can cross-check against Shepard\'s. Harvey cannot cross-check against anything. Every Harvey citation is an unverified LLM generation.' },
        { agentId: 'verifier', phase: 'phase1', type: 'warning', delay: 2500, content: 'EXTERNAL VERIFICATION ALERT. CendiaSupervision cross-checked all 5 Harvey citations against BAILII, Westlaw UK, and LexisNexis UK databases: (1) Amalgamated Investment v. Texas Commerce — CONFIRMED. Found in [1982] QB 84. (2) Republic of India v. India Steamship — CONFIRMED. Found in [1993] AC 410. (3) Baird Textiles v. M&S — CONFIRMED. Found in [2001] EWCA Civ 274. (4) Fenwick & Elliott v. Construction Alliance — NOT FOUND in any database. No EWHC case with this citation exists. No case with these party names exists. HALLUCINATION CONFIRMED. (5) Meridian Global v. Barclays Capital — NOT FOUND. No EWCA Civ case with this citation exists. A different case "Meridian Global Funds v. Securities Commission" exists (Privy Council, 1995) — Harvey may have confused it. HALLUCINATION CONFIRMED. Without CendiaSupervision: these 2 hallucinations would appear in the memorial. The opposing party would find them immediately. The tribunal would question counsel\'s credibility on every other citation in the submission. The case could be lost on credibility, not merits.' },
        { agentId: 'tribunal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ICC arbitration standards: (1) ICC Rules Article 22(4): The tribunal "shall make every effort to conduct the arbitration in an expeditious and cost-effective manner." Fabricated citations waste tribunal time and opposing party resources. Tribunals are increasingly sanctioning counsel for AI-generated false citations. (2) IBA Guidelines on Party Representation (2013) Guideline 11: "A Party Representative shall not make any knowingly false submission of fact or law to the Arbitral Tribunal." If the solicitor includes hallucinated cases, even unknowingly, the question is whether AI reliance constitutes sufficient diligence. (3) The reputational damage to a Magic Circle firm of presenting fabricated citations to an ICC tribunal is incalculable. The firm\'s arbitration practice — worth hundreds of millions in annual revenue — is built on credibility. One hallucination incident destroys that credibility.' },
        { agentId: 'solicitor', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SRA OBLIGATION. As the supervising solicitor: (1) SRA Principle 2 (Acting with competence): I must competently supervise AI output. Harvey\'s lack of verification backbone means EVERY citation requires independent verification — not just sampling. (2) SRA Code of Conduct 3.3: I must ensure work is "of the quality and timeliness to meet the client\'s needs." An arbitral submission with fabricated citations fails quality requirements. (3) Harvey is uniquely dangerous compared to Westlaw/Lexis competitors because it CANNOT tell me which citations are verified. With CoCounsel, at least the citation exists in Westlaw. With Lexis+ AI, Shepard\'s provides treatment. With Harvey, I am on my own. Without CendiaSupervision: I must manually verify every citation against BAILII/Westlaw UK — the exact work Harvey was supposed to save me. With CendiaSupervision: automatic verification against external databases catches the hallucinations before I even review the output.' },
        { agentId: 'harvey-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Harvey + CendiaSupervision Verification Layer: (1) EXTERNAL DATABASE CROSS-CHECK: Every Harvey citation is automatically verified against external legal databases (BAILII, Westlaw, LexisNexis, caselaw.nationalarchives.gov.uk). Citations are marked: VERIFIED (found), UNVERIFIED (not found — potential hallucination), or UNCERTAIN (partial match — requires attorney review). (2) HALLUCINATION HARD-STOP: Any UNVERIFIED citation is blocked from entering the final work product. The attorney receives the research with hallucinations removed and flagged. (3) HOLDING VERIFICATION: For VERIFIED citations, the holding is cross-checked against the actual case text. Mischaracterisations flagged. (4) JURISDICTION MATCHING: Citations are verified against the correct jurisdiction\'s database (English law against BAILII/Westlaw UK, not US databases). (5) ATTORNEY SIGN-OFF: The solicitor reviews the verification report and signs off on each citation. The memorial is filed with a sealed "Citation Integrity Certificate."' },
        { agentId: 'tribunal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The external verification layer eliminates Harvey\'s core vulnerability. Harvey\'s strength: creative legal analysis, fast drafting, pattern recognition across jurisdictions. Harvey\'s weakness: no internal verification. CendiaSupervision IS the verification backbone Harvey lacks. For the Magic Circle firm: Harvey + CendiaSupervision = generative AI creativity + citation integrity. The firm gets Harvey\'s speed without Harvey\'s hallucination risk. For the ICC tribunal: the memorial is filed with verified citations and a sealed integrity certificate. The firm\'s credibility is preserved. For Harvey: this is existential. Without CendiaSupervision, Harvey is a liability for any firm facing ABA 512 or SRA obligations. With CendiaSupervision, Harvey becomes a governed AI platform that competes with CoCounsel and Lexis+ AI on equal footing — because it now has a verification backbone it was born without.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:hv10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'hv20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Harvey output + External verification + 2 hallucinations caught + Solicitor sign-off)',
        complianceLabel: 'Verification Status',
        complianceValue: '2 HALLUCINATIONS BLOCKED',
        complianceThreshold: '3/5 verified, 2/5 hallucinated — blocked',
        agents: ['Harvey AI Agent', 'Supervising Solicitor Agent', 'External Verification Agent', 'Tribunal Standards Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Harvey AI — External Verification Backbone',
        guaranteeBody: 'This cryptographic bundle seals Harvey\'s verification gap: 5 citations generated, 3 verified against BAILII/Westlaw UK, 2 hallucinations caught and blocked (Fenwick & Elliott, Meridian Global), solicitor notified, memorial filed with verified citations only. ICC arbitration credibility preserved.',
        evidenceChain: 'Harvey research → 5 citations → External DB cross-check → 3 verified → 2 hallucinations blocked → Solicitor notified → Memorial corrected → Sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will expose Harvey\'s core vulnerability — no verification backbone — and demonstrate how CendiaSupervision provides the citation integrity layer Harvey was born without.',
      phaseLabels: ['Pure LLM Output & Hallucination Risk', 'Tribunal Credibility & SRA Duty', 'External Verification Backbone'],
    },

    // SCENARIO 2 — HARVEY: CONFIDENTIALITY & ETHICAL WALLS
    {
      id: 'harvey-confidentiality',
      title: 'Harvey — Client Confidentiality Breach via AI',
      subtitle: 'Information barrier · Training data leakage · Competitor clients · Model Rule 1.6',
      banner: 'Simulating the ethical wall nightmare: Harvey processes confidential merger details for Client A. When asked about a similar deal for Client B (a competitor), Harvey\'s response includes language patterns and structural insights that reflect Client A\'s confidential terms. The information barrier has been breached by AI.',
      risk: 'Critical',
      scenarioNum: 'Walls',
      icon: 'shield-off',
      color: 'text-red-400',
      agents: [
        { id: 'harvey-conf', name: 'Harvey AI Agent', role: 'Generative AI with Multi-Client Data', icon: '🤖', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'ethics-wall', name: 'Ethical Wall Agent', role: 'Information Barrier & Conflict Detection', icon: '🧱', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'gc-firm', name: 'Firm GC Agent', role: 'Risk Management & Bar Complaint Defence', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'client-trust', name: 'Client Trust Agent', role: 'Client Relationship & Confidentiality Assurance', icon: '🔒', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Harvey Session Log', status: 'connected', type: 'AI Activity', icon: 'activity', detail: 'Client A: merger terms processed 3 days ago by Partner X' },
        { name: 'Conflict Check System', status: 'connected', type: 'Ethical Walls', icon: 'shield', detail: 'Client A ↔ Client B: information barrier active' },
        { name: 'Harvey Response Analyser', status: 'connected', type: 'Pattern Detection', icon: 'search', detail: 'Client B response contains 3 structural similarities to Client A terms' },
        { name: 'Bar Disciplinary Monitor', status: 'syncing', type: 'Ethics Compliance', icon: 'alert-triangle', detail: 'Model Rule 1.6 — confidentiality obligation absolute' },
      ],
      script: [
        { agentId: 'harvey-conf', phase: 'phase1', type: 'analysis', delay: 800, content: 'Harvey session analysis reveals a potential confidentiality breach: (1) Monday: Partner X (M&A team) uses Harvey to analyse a $2.1B merger agreement for Client A (AcquireCo). Harvey processes the entire agreement including pricing structure, earn-out terms, and non-compete provisions. (2) Thursday: Associate Y (different team, same firm) uses Harvey to draft a merger agreement for Client B (TargetCo — a competitor of AcquireCo). The firm has an ethical wall between the two matters. (3) Harvey\'s response to Associate Y includes: (a) An earn-out structure with identical milestone triggers to Client A\'s agreement. (b) A non-compete geographic scope that mirrors Client A\'s terms. (c) A specific indemnification basket size ($15M) that matches Client A\'s negotiated amount — an unusual number that wouldn\'t appear randomly. (4) Harvey didn\'t "leak" a document. It did something more subtle: the AI\'s weights were influenced by Client A\'s terms, and when asked to generate similar content for Client B, the model produced output that reflects what it recently processed. This is not traditional data leakage — it\'s PATTERN leakage. The ethical wall was maintained for humans but not for the AI.' },
        { agentId: 'ethics-wall', phase: 'phase1', type: 'warning', delay: 2500, content: 'ETHICAL WALL BREACH ALERT. Analysis of Harvey\'s output for Client B: (1) The $15M indemnification basket is statistically anomalous. For a deal this size, standard market baskets range from $8M-$25M. The probability of Harvey independently generating exactly $15M — the same number negotiated for Client A — is approximately 6%. Not proof, but a red flag. (2) The earn-out milestone structure uses identical revenue thresholds ($50M, $75M, $100M). These are Client A\'s specific negotiated milestones, not market standard. (3) The non-compete scope ("North America excluding Quebec") is an unusual geographic definition that matches Client A\'s scope exactly. Quebec exclusion is a rare negotiating outcome — Harvey generating it independently is highly unlikely. (4) Any ONE of these could be coincidence. All THREE together indicate pattern leakage. The AI was influenced by Client A\'s terms when generating content for Client B. The ethical wall failed at the AI layer.' },
        { agentId: 'gc-firm', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Firm GC risk assessment: (1) Model Rule 1.6 (Confidentiality): "A lawyer shall not reveal information relating to the representation of a client." If Harvey\'s output for Client B contains patterns from Client A\'s confidential terms, the firm has revealed confidential information — even if no document was shared. (2) Model Rule 1.10 (Imputed Conflicts): The ethical wall was supposed to prevent information flow. If the AI bypasses the wall, the wall is inadequate. The entire firm may be conflicted. (3) If Client A discovers that its confidential deal terms appeared in work product for a competitor: (a) Bar complaint against both Partner X and the firm. (b) Malpractice claim. (c) Injunctive relief — Client A seeks to enjoin the Client B transaction as tainted. (d) Client A fires the firm across all matters. Revenue loss: $12M+. (4) The firm\'s malpractice insurer will ask: "Did your ethical wall extend to AI systems?" Without CendiaSupervision: no. The wall stopped at human access controls.' },
        { agentId: 'client-trust', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CLIENT TRUST. Both clients chose this firm because of its reputation. Client A trusted that its $2.1B deal terms would remain confidential. Client B trusted that its legal advice would be independent. Both trusts are broken: Client A\'s terms influenced Client B\'s agreement (confidentiality breach). Client B\'s "independent" legal advice is actually derivative of Client A\'s negotiation (independence compromise). If either client runs their agreement through AI analysis and discovers the similarities, the firm loses both relationships. In the Magic Circle, reputation IS the product. One AI confidentiality breach can cascade: Client A tells other clients. The firm\'s conflict management is questioned. GC roundtables discuss the incident. The damage is not one client — it\'s the firm\'s market position.' },
        { agentId: 'harvey-conf', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Harvey + CendiaSupervision AI Ethical Wall: (1) MATTER-LEVEL ISOLATION: CendiaSupervision enforces ethical walls at the AI level. When a wall exists between two matters, Harvey sessions for those matters are ISOLATED — the AI cannot access, reference, or be influenced by data from the walled matter. (2) PATTERN LEAKAGE DETECTION: CendiaSupervision analyses Harvey output for statistical similarity to walled matter content. If the similarity exceeds a threshold (based on unusual term matching, identical numerical values, or rare clause structures), the output is flagged before delivery. (3) CONFLICT-AWARE ROUTING: When a new Harvey session starts, CendiaSupervision checks the matter against the firm\'s conflict database. If an ethical wall exists involving any related matter, AI isolation is enforced automatically. (4) AUDIT TRAIL: Every Harvey session is logged with matter ID, attorney ID, and wall status. The firm GC can audit AI ethical wall compliance across all matters. (5) CLIENT ASSURANCE: The firm can certify to clients: "Our AI ethical walls are documented and auditable."' },
        { agentId: 'gc-firm', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The AI ethical wall transforms Harvey from a confidentiality liability into a governed platform. The pattern leakage detection catches the $15M basket, the milestone triggers, and the Quebec exclusion BEFORE the output reaches Associate Y. Client A\'s terms remain confidential. Client B receives independent advice. For the firm: "Our ethical walls extend to AI" is a competitive differentiator. Other firms using Harvey without CendiaSupervision cannot make this claim. For Harvey: this is a survival feature. If a Magic Circle firm suffers an AI confidentiality breach, Harvey will be blamed and banned. CendiaSupervision makes Harvey safe for multi-client firms. Without it, Harvey is only safe for firms with no conflicts — which is no firm. For both clients: the Regulator\'s Receipt seals the ethical wall compliance. If Client A ever asks "did our terms influence your work for others?" — the answer is documented.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:hv30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'hv40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Harvey sessions + Ethical wall enforcement + Pattern detection + Matter isolation)',
        complianceLabel: 'Ethical Wall',
        complianceValue: 'PATTERN LEAKAGE BLOCKED',
        complianceThreshold: '3 anomalies detected, output quarantined',
        agents: ['Harvey AI Agent', 'Ethical Wall Agent', 'Firm GC Agent', 'Client Trust Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Harvey AI — AI Ethical Wall Enforcement',
        guaranteeBody: 'This cryptographic bundle seals the ethical wall governance: Harvey sessions for Client A and Client B isolated, pattern leakage detected (3 anomalies: $15M basket, milestone triggers, Quebec exclusion), output quarantined before delivery, matter isolation confirmed, firm GC audit trail complete.',
        evidenceChain: 'Harvey session (Client A) → Ethical wall check → Client B session → Pattern analysis → 3 anomalies detected → Output quarantined → Matter isolation enforced → Independent output generated → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Harvey\'s multi-client processing creates ethical wall risks — and how CendiaSupervision enforces information barriers at the AI layer.',
      phaseLabels: ['Pattern Leakage & AI Wall Bypass', 'Confidentiality Breach & Firm Risk', 'AI Ethical Wall Enforcement'],
    },

    // SCENARIO 3 — HARVEY: BILLING ETHICS
    {
      id: 'harvey-billing',
      title: 'Harvey Billing — 2 Hours of AI, 8 Hours Billed',
      subtitle: 'Model Rule 1.5 · AI efficiency discount · Client detection · CounselLink analytics',
      banner: 'Simulating the legal AI billing ethics crisis: an associate uses Harvey for 2 hours to produce work that would have taken 8 hours manually. The partner bills 8 hours. The client\'s legal spend AI detects the discrepancy. Fee dispute and bar complaint follow.',
      risk: 'High',
      scenarioNum: 'Billing',
      icon: 'clock',
      color: 'text-emerald-400',
      agents: [
        { id: 'harvey-bill', name: 'Harvey AI Agent', role: 'AI-Assisted Work Product Generation', icon: '🤖', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'billing-partner', name: 'Billing Partner Agent', role: 'Fee Arrangement & Time Entry Review', icon: '💰', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'client-gc', name: 'Client GC Agent', role: 'Legal Spend Management & Outside Counsel', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'bar-ethics', name: 'Bar Ethics Agent', role: 'Model Rule 1.5 & Fee Reasonableness', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Harvey Usage Analytics', status: 'connected', type: 'AI Session Data', icon: 'activity', detail: 'Associate used Harvey for 2.3 hours — produced 45-page memo' },
        { name: 'Time & Billing System', status: 'connected', type: 'Fee Management', icon: 'clock', detail: 'Partner billed 8.0 hours for the memo — $4,800 at $600/hr' },
        { name: 'CounselLink Analytics', status: 'connected', type: 'Client Spend AI', icon: 'bar-chart', detail: 'Client AI flagged: 45-page memo typically takes 12-15 hours, billed 8' },
        { name: 'Bar Fee Dispute Portal', status: 'syncing', type: 'Ethics Compliance', icon: 'shield', detail: 'Model Rule 1.5 — fees must be reasonable' },
      ],
      script: [
        { agentId: 'harvey-bill', phase: 'phase1', type: 'analysis', delay: 800, content: 'Harvey usage data for Matter 2026-1847: (1) Associate started Harvey session at 9:14 AM. 47 prompts over 2.3 hours. Harvey generated: research analysis (12 pages), contract review summary (18 pages), and risk assessment memo (15 pages). Total: 45 pages of work product. (2) Without Harvey: this work would require approximately 8-12 hours of associate time (research: 4 hours, drafting: 3 hours, review: 1-2 hours, cite-checking: 2-3 hours). (3) The billing entry submitted by the partner: "Legal research and memorandum re: contract dispute — 8.0 hours — $4,800." (4) The billing APPEARS reasonable for the work product — 45 pages of quality legal analysis. But the ACTUAL time spent was 2.3 hours. The question: does Model Rule 1.5 require the firm to bill for TIME SPENT or for VALUE DELIVERED? This is the central billing ethics question of the AI era. And the answer is: it depends on the fee arrangement, but undisclosed AI assistance that inflates apparent time spent is deceptive under any arrangement.' },
        { agentId: 'client-gc', phase: 'phase1', type: 'warning', delay: 2500, content: 'CLIENT DETECTION. Our CounselLink legal spend AI flagged this invoice: (1) The 45-page memo was billed at 8 hours. CounselLink\'s benchmarking data shows that comparable memos from this firm average 12-15 hours. The 8-hour entry is actually BELOW average — which is why the partner thought it was safe. (2) However: CounselLink also tracks the firm\'s billing patterns over time. Six months ago, before the firm deployed Harvey, similar memos were billed at 12-15 hours. Now they\'re consistently billed at 7-9 hours. The TREND suggests AI efficiency gains are being captured by the firm, not passed to the client. (3) More concerning: CounselLink detects that 3 different associates at the firm submitted nearly identical research memos for 3 different clients on related topics in the same week — each billed 7-8 hours. Harvey likely generated the base analysis once and each associate customised it minimally. The client is paying $4,800 for what was effectively a Harvey template with minor customisation.' },
        { agentId: 'bar-ethics', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Bar ethics analysis of AI billing: (1) Model Rule 1.5(a): "A lawyer shall not make an agreement for, charge, or collect an unreasonable fee." Factors include "the time and labour required" and "the skill requisite to perform the legal service properly." (2) If the fee arrangement is hourly: billing 8 hours when 2.3 hours were spent is padding — regardless of the work product quality. The client hired the lawyer at $600/hour for the lawyer\'s TIME. AI reduced the time. The fee should reflect the time. (3) If the fee arrangement is value-based: billing $4,800 for a 45-page quality memo MAY be reasonable regardless of time spent. But the firm must disclose the AI assistance — the client has a right to know what they\'re paying for. (4) ABA Formal Opinion 93-379: "It goes without saying that a lawyer who spends four hours researching a question should not bill eight hours for that research." Replace "four hours" with "AI-assisted two hours" — the principle is identical. (5) The 3-client duplication issue is worse: billing each client 7-8 hours for work that was generated once by AI and minimally customised is per se unreasonable.' },
        { agentId: 'billing-partner', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BILLING PARTNER DILEMMA. I face a genuine business problem: (1) My associates now produce 3x more work in the same time using Harvey. If I bill for actual time, my revenue drops 60%. The firm\'s financial model is built on hourly billing. AI efficiency destroys that model. (2) If I bill for value delivered (45-page quality memo = $4,800), I need to restructure the fee arrangement with every client. Most clients are on hourly agreements. Switching to value billing requires client consent and renegotiation. (3) If I don\'t disclose AI assistance and continue billing hourly: I am deceiving the client about what they\'re paying for. Model Rule 1.5 violation. Bar complaint risk. (4) The 3-client duplication is indefensible. Each client is paying full price for AI-generated work product that was produced once. This is the legal equivalent of selling the same house to three different buyers. Without CendiaSupervision: I might not even know my associates are duplicating Harvey output across clients. The billing system doesn\'t track AI usage.' },
        { agentId: 'harvey-bill', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Harvey + CendiaSupervision Billing Governance: (1) AI USAGE TRANSPARENCY: CendiaSupervision tracks Harvey usage per matter — prompts, time, output volume. When the billing entry is submitted, the system shows: "Harvey-assisted time: 2.3 hours. Manual time: 0 hours. Work product: 45 pages." (2) BILLING DISCLOSURE: For hourly clients, the invoice includes: "This work product was prepared with AI assistance. AI-assisted time: 2.3 hours. Attorney review and supervision: [X] hours." The client sees what they\'re paying for. (3) DUPLICATION DETECTION: CendiaSupervision detects when Harvey generates substantially similar output across different client matters. Alert: "This research is 87% similar to Matter 2026-1845 (Client B). Billing adjustment recommended." (4) FEE MODEL TRANSITION: CendiaSupervision provides data for the firm to transition from hourly to value-based billing. "This type of memo was previously billed at $7,200 (12 hours). With AI, the fair value is $3,600 (efficiency passed to client) to $5,400 (efficiency shared)." (5) PARTNER SIGN-OFF: The billing partner reviews AI usage data and signs off on each invoice as "reasonable" under Model Rule 1.5.' },
        { agentId: 'bar-ethics', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The billing governance framework solves the ethical crisis: (1) Transparency: the client knows AI was used. No deception. Model Rule 1.5 satisfied. (2) Reasonable fees: the billing reflects actual effort (AI time + attorney review), not fictional manual time. (3) Duplication caught: the 3-client issue is flagged before invoices are sent. Each client pays for their unique work, not for shared AI output. (4) Fee model evolution: the firm transitions to value billing over time, preserving revenue while passing AI efficiency to clients. For Harvey: billing governance is essential for market survival. If GCs discover firms are billing 8 hours for 2 hours of Harvey work, the backlash will kill Harvey adoption. CendiaSupervision makes Harvey billing transparent — which paradoxically INCREASES Harvey adoption because clients trust the billing. "We use Harvey AND we disclose it on every invoice" is the firm that wins clients in the AI era.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:hv50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'hv60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Harvey usage + Billing entry + AI disclosure + Duplication check + Partner sign-off)',
        complianceLabel: 'Billing Status',
        complianceValue: 'AI DISCLOSED, FEE ADJUSTED',
        complianceThreshold: '2.3 hrs AI + 1.5 hrs review = $2,280 billed',
        agents: ['Harvey AI Agent', 'Billing Partner Agent', 'Client GC Agent', 'Bar Ethics Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Harvey Billing — AI Transparency & Fee Ethics',
        guaranteeBody: 'This cryptographic bundle seals the billing governance: Harvey usage (2.3 hours, 47 prompts, 45 pages), billing disclosure (AI-assisted), duplication detection (87% similarity flagged), fee adjustment (8.0 hrs → 3.8 hrs actual), partner sign-off on reasonableness. Model Rule 1.5 satisfied by transparency.',
        evidenceChain: 'Harvey session (2.3 hrs) → Work product (45 pages) → Billing entry (8.0 hrs) → AI disclosure generated → Duplication check (3 clients flagged) → Fee adjusted → Partner sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will confront the billing ethics crisis of legal AI — proving that CendiaSupervision makes Harvey billing transparent, ethical, and client-trusted.',
      phaseLabels: ['AI Efficiency & Time Discrepancy', 'Model Rule 1.5 & Client Detection', 'Billing Transparency & Fee Governance'],
    },
  ],
};

export default config;
