/**
 * Thomson Reuters Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for legal AI governance.
 * Access: /sandbox/thomson-reuters (Key: TR-26)
 *
 * @module pages/sandbox/configs/thomson-reuters
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Thomson Reuters',
  accessKey: 'TR-26',
  sessionKey: 'thomson-reuters-sandbox-unlocked',

  accent: 'orange',
  accentColor: 'text-orange-400',
  accentHover: 'from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
  ringColor: 'focus:ring-orange-500/30',
  borderColor: 'border-orange-500/30',
  gradientFrom: 'from-orange-600/20',
  gradientTo: 'to-orange-900/20',

  footerNote: '200 regulatory scenarios mapped for Thomson Reuters × Datacendia · Full architecture document available on request',

  scenarios: [
    // SCENARIO 1 — COCOUNSEL BRIEF SUPERVISION: ABA OPINION 512
    {
      id: 'cocounsel-aba512',
      title: 'CoCounsel Brief Supervision — ABA Opinion 512 Compliance',
      subtitle: 'Rule 11 sanctions risk · Mata v. Avianca precedent · Attorney supervision · Malpractice defence',
      banner: 'Simulating the core Thomson Reuters × Datacendia value proposition: CoCounsel drafts a motion to dismiss for an AmLaw 50 litigation partner. ABA Opinion 512 requires documented attorney supervision before filing. Without Datacendia, the supervision is invisible. With Datacendia, it is cryptographically proven.',
      risk: 'Critical',
      scenarioNum: 'ABA 512',
      icon: 'file-text',
      color: 'text-orange-400',
      agents: [
        { id: 'attorney', name: 'Supervising Attorney Agent', role: 'ABA Opinion 512 Compliance & Brief Review', icon: '⚖️', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'cocounsel', name: 'CoCounsel AI Agent', role: 'AI Brief Drafting & Legal Research', icon: '🤖', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'ethics', name: 'Ethics Agent', role: 'Model Rules Compliance & Bar Standards', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'risk-tr', name: 'Risk Agent', role: 'Malpractice & Sanctions Risk Assessment', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'CoCounsel API', status: 'connected', type: 'Legal AI Platform', icon: 'cpu', detail: 'Motion to dismiss drafted — 14 case citations, 3 statutory refs' },
        { name: 'Westlaw Verification', status: 'connected', type: 'Citation Verification', icon: 'check-circle', detail: '14 citations queued for attorney verification — 0 of 14 confirmed' },
        { name: 'Court AI Disclosure', status: 'connected', type: 'Filing Requirements', icon: 'file-text', detail: 'SDNY: AI disclosure required per Standing Order (Jan 2024)' },
        { name: 'Bar Ethics Database', status: 'syncing', type: 'Professional Responsibility', icon: 'shield', detail: 'ABA Opinion 512 + 30+ federal court AI rules indexed' },
      ],
      script: [
        { agentId: 'cocounsel', phase: 'phase1', type: 'analysis', delay: 800, content: 'CoCounsel has completed the motion to dismiss draft for Case No. 24-cv-3847 (SDNY). The AI-generated brief contains: (1) 14 case citations — 11 from federal courts, 3 from New York state courts, (2) 3 statutory references — FRCP 12(b)(6), 28 U.S.C. § 1332, N.Y. CPLR § 3211, (3) AI-generated legal analysis of the standing issue, including a circuit split characterisation, (4) AI-proposed argument structure across 4 sections. Current status: ZERO attorney review documented. The brief exists as AI output. Under ABA Opinion 512, this brief CANNOT be filed without documented attorney supervision. The Mata v. Avianca precedent (2023): attorneys filed AI-generated brief with fabricated citations — $5,000 sanctions, public humiliation, bar complaints. FRCP Rule 11 requires the signing attorney to certify that "the claims, defences, and other legal contentions are warranted by existing law."' },
        { agentId: 'ethics', phase: 'phase1', type: 'warning', delay: 2500, content: 'ABA OPINION 512 COMPLIANCE CHECK — FAIL. ABA Formal Opinion 512 (July 2024) establishes four obligations for lawyers using generative AI: (1) Model Rule 1.1 (Competence): The lawyer must "competently supervise" AI outputs — meaning independent review of legal analysis, not just skimming. (2) Model Rule 1.6 (Confidentiality): The lawyer must ensure client data processed by CoCounsel is protected. (3) FRCP Rule 11: The signing attorney must certify legal contentions are "warranted by existing law or by a nonfrivolous argument." AI-generated analysis is NOT the attorney\'s certification. (4) Court-specific AI disclosure: SDNY requires disclosure of AI use in any filing since January 2024. Current state: CoCounsel produced the brief. No attorney has reviewed a single citation, confirmed the legal analysis, or verified the circuit split characterisation. If this brief is filed as-is, the signing partner violates Rule 11, ABA 512, and SDNY\'s standing order simultaneously.' },
        { agentId: 'risk-tr', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — QUANTIFIED RISK. If this brief is filed without documented supervision: (1) RULE 11 SANCTIONS: $5,000-$50,000 per fabricated or unverified citation. With 14 citations unverified, maximum exposure: $700,000. The Mata v. Avianca sanctions were $5,000 — but that was pro se-adjacent. An AmLaw 50 firm filing unverified AI citations faces exemplary sanctions. (2) MALPRACTICE: If the motion is denied because the circuit split characterisation is wrong, the client faces trial on claims that should have been dismissed. Malpractice exposure: case value ($12M) + wasted legal fees ($400K). (3) BAR COMPLAINT: The supervising partner faces a bar complaint under Rule 1.1 and 5.1. Character and fitness implications for the associate. (4) CLIENT LOSS: The Fortune 100 client\'s outside counsel guidelines now require AI supervision documentation. Filing without it violates the engagement letter. The client moves $8M in annual billings to a competing firm. (5) INSURANCE: The firm\'s malpractice insurer is now requiring AI supervision documentation. Undocumented AI use may void coverage.' },
        { agentId: 'attorney', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SUPERVISION WORKFLOW REQUIRED. As the supervising partner, I need to review this brief but the current CoCounsel workflow provides no structured way to document my supervision. Here\'s what I actually do: (1) Read the AI draft — 45 minutes, (2) Verify each citation on Westlaw — 14 citations × 5 minutes = 70 minutes, (3) Confirm the circuit split characterisation — 30 minutes checking current federal reporter, (4) Modify 3 sections based on my strategic judgment — 40 minutes, (5) Review final version — 20 minutes. Total supervision time: 3.5 hours. But WITHOUT Datacendia, none of this is documented. If the court asks "did you verify Citation 7?" I can only say "yes, I did" — my word against a sanctions motion. With Datacendia: each citation verification is timestamped, my modifications are sealed, my final approval is cryptographically signed with my bar number. My 3.5 hours of work becomes EVIDENCE, not just testimony.' },
        { agentId: 'cocounsel', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing CoCounsel + CendiaSupervision Integration Protocol: (1) AI DRAFT CAPTURE: CoCounsel output is hashed at generation — the AI draft is immutable evidence of what the AI produced vs what the attorney modified. (2) CITATION VERIFICATION HARD-STOP: Each of the 14 citations receives a verification requirement. The attorney must click "Verified on Westlaw [date]" for each citation. Unverified citations CANNOT appear in the final filed document — architectural enforcement, not policy. (3) ATTORNEY MODIFICATIONS: Every change the partner makes to the AI draft is captured as a diff — proving the attorney exercised independent judgment, not rubber-stamped AI output. (4) COURT DISCLOSURE AUTOMATION: The SDNY AI disclosure statement is generated automatically from the supervision record: "CoCounsel AI was used to assist in drafting. All citations were independently verified by [Partner Name, Bar #] on [dates]. Attorney modifications documented." (5) FILING CERTIFICATION: The partner\'s Rule 11 certification is sealed with Ed25519 signature and RFC 3161 timestamp — proving review was completed BEFORE the filing deadline.' },
        { agentId: 'risk-tr', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The CoCounsel + CendiaSupervision protocol eliminates every quantified risk: (1) Rule 11: All 14 citations verified individually — sanctions risk reduced to zero for citation accuracy. (2) Malpractice: Attorney modifications documented — proving independent judgment, not AI reliance. (3) Bar complaint: Supervision evidence shows 3.5 hours of documented review — far exceeding minimum competence. (4) Client retention: AI supervision documentation satisfies the Fortune 100 client\'s outside counsel guidelines — the $8M relationship is protected. (5) Insurance: Malpractice insurer receives firm-wide AI supervision metrics — premium reduction, not surcharge. This is the Thomson Reuters × Datacendia value proposition in one brief: CoCounsel saves 6 hours of drafting time. Datacendia proves the 3.5 hours of supervision actually happened. The brief is AI-assisted, lawyer-verified, and cryptographically proven. ABA Opinion 512 satisfied by architecture, not policy.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:tr10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'tr20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CoCounsel draft + 14 citation verifications + Attorney modifications + Rule 11 certification)',
        complianceLabel: 'ABA 512 Status',
        complianceValue: 'FULLY SUPERVISED',
        complianceThreshold: '14/14 citations verified, 3 sections modified',
        agents: ['Supervising Attorney Agent', 'CoCounsel AI Agent', 'Ethics Agent', 'Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'CoCounsel Brief — AI-Assisted, Lawyer-Verified, Cryptographically Proven',
        guaranteeBody: 'This cryptographic bundle seals the complete ABA Opinion 512 supervision chain: CoCounsel AI draft (hashed at generation), 14 individual citation verifications on Westlaw, attorney modifications (diff captured), SDNY AI disclosure statement, and Rule 11 certification with bar number and Ed25519 timestamp. Malpractice defence, bar complaint defence, and client governance — all from one supervision workflow.',
        evidenceChain: 'CoCounsel draft generated → AI output hashed → 14 citations queued → Each citation verified on Westlaw → Attorney modifications captured → Circuit split confirmed → SDNY disclosure generated → Rule 11 certification → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate why CoCounsel needs CendiaSupervision — proving that ABA Opinion 512 compliance is architectural, not aspirational, when AI drafts a motion to dismiss for an AmLaw 50 firm.',
      phaseLabels: ['AI Draft & Ethics Assessment', 'Risk Quantification & Supervision Gap', 'CendiaSupervision Integration'],
    },

    // SCENARIO 2 — WESTLAW CITATION HALLUCINATION PREVENTION
    {
      id: 'citation-hallucination',
      title: 'Westlaw AI — Citation Hallucination Hard-Stop',
      subtitle: 'Mata v. Avianca · Rule 11 · Fabricated citations · Architectural prevention',
      banner: 'Simulating the nightmare scenario: Westlaw AI surfaces a case citation that appears legitimate but is actually hallucinated. The Datacendia hard-stop prevents the fabricated citation from reaching a filed document — the structural solution to legal AI\'s most dangerous failure mode.',
      risk: 'Critical',
      scenarioNum: 'Rule 11',
      icon: 'alert-triangle',
      color: 'text-red-400',
      agents: [
        { id: 'westlaw', name: 'Westlaw AI Agent', role: 'Legal Research & Citation Generation', icon: '📚', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'verify', name: 'Verification Agent', role: 'Citation Verification & Hard-Stop Enforcement', icon: '✅', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'sanctions', name: 'Sanctions Risk Agent', role: 'FRCP Rule 11 & Court Sanctions Analysis', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'associate', name: 'Associate Supervision Agent', role: 'Junior Attorney Workflow & Partner Review', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Westlaw AI Research', status: 'connected', type: 'Legal Research', icon: 'search', detail: '23 citations surfaced for appellate brief — 22 verified, 1 FLAGGED' },
        { name: 'CendiaSupervision Hard-Stop', status: 'connected', type: 'Verification Enforcement', icon: 'shield', detail: 'Citation #17 blocked — no matching reporter entry found' },
        { name: 'Mata v. Avianca Precedent', status: 'connected', type: 'Sanctions Database', icon: 'alert-triangle', detail: '2023: $5K sanctions for fabricated AI citations — SDNY' },
        { name: 'Court Filing System', status: 'syncing', type: 'ECF Integration', icon: 'file-text', detail: 'Brief cannot be filed until all citations pass verification' },
      ],
      script: [
        { agentId: 'westlaw', phase: 'phase1', type: 'analysis', delay: 800, content: 'Westlaw AI research complete for Second Circuit appellate brief. 23 citations surfaced across federal courts, state courts, and secondary sources. Verification status: (1) 22 citations VERIFIED — each confirmed against Westlaw\'s official reporter database with matching volume, page number, court, and year, (2) Citation #17 FLAGGED — "Morrison v. Digital Compliance Corp., 847 F.3d 291 (2d Cir. 2021)." This citation appears syntactically correct: proper volume (847), reporter (F.3d), page (291), court (2d Cir.), and year (2021). However: (a) No matching case exists at 847 F.3d 291, (b) No case with the name "Morrison v. Digital Compliance Corp." exists in any federal reporter, (c) The case appears to be a hallucinated composite — the AI synthesised a plausible-looking citation from real case elements. This is exactly the Mata v. Avianca failure mode. The citation looks real. It isn\'t.' },
        { agentId: 'verify', phase: 'phase1', type: 'warning', delay: 2500, content: 'HARD-STOP ACTIVATED — CITATION #17 BLOCKED. CendiaSupervision verification protocol: every AI-surfaced citation must be independently confirmed against Westlaw\'s official reporter database before it can enter any final document. Citation #17 failed automated verification. It also failed manual verification by the associate (who searched 847 F.3d 291 and found a different case — "Ramirez v. County of San Bernardino"). The hard-stop means: (1) Citation #17 CANNOT appear in the appellate brief — the filing system will reject any document containing an unverified citation, (2) The associate CANNOT override the hard-stop — only a partner with a documented override can allow an unverified citation (and no partner would), (3) The blocked citation is logged with the reason for blocking — evidence that the system detected and prevented the hallucination. Without this hard-stop: the associate might have included Citation #17 because it "looked right." The brief would have been filed. The Second Circuit panel would have discovered the fabrication. Sanctions, bar complaints, and malpractice would follow.' },
        { agentId: 'associate', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. As a third-year associate, I need to explain why this hard-stop matters for my career: (1) I am responsible for the first draft of this brief. I relied on Westlaw AI to surface relevant cases. Without the hard-stop, I would have included Citation #17 — it looked completely legitimate. (2) The partner would have reviewed my draft, but partner review of citations is often cursory — they focus on argument quality, not citation verification. (3) If Citation #17 had been filed and discovered: (a) I would face a bar complaint at the start of my career, (b) The partner would face Rule 5.1 supervision liability, (c) My name would be associated with fabricated citations for the rest of my legal career — like the Mata v. Avianca attorneys. (4) The hard-stop protected me. Not from laziness — from a failure mode that is invisible to human review. The citation LOOKED REAL. That\'s what makes AI hallucination so dangerous in legal practice.' },
        { agentId: 'sanctions', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SANCTIONS EXPOSURE ANALYSIS. If Citation #17 had been filed: (1) FRCP Rule 11(b)(2): The signing attorney certifies that legal contentions are "warranted by existing law." A fabricated citation is, by definition, not warranted by existing law. Sanctions: $5,000-$50,000 per citation. (2) Second Circuit Standing Order: AI-assisted filings require disclosure. Filing a fabricated AI citation without disclosure COMPOUNDS the violation — it\'s not just a bad citation, it\'s an undisclosed AI-generated fabrication. (3) Mata v. Avianca (SDNY, 2023): $5,000 sanctions + public identification + CLE requirement. But that case involved pro se-adjacent attorneys. An AmLaw 50 firm filing fabricated citations in the Second Circuit faces: exemplary sanctions ($25,000+), judicial referral to bar disciplinary committee, and potential withdrawal of pro hac vice for out-of-state attorneys. (4) The reputational damage: "AmLaw 50 Firm Files Fabricated AI Citation in Second Circuit" is a headline that costs $50M+ in client departures.' },
        { agentId: 'verify', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Westlaw AI + CendiaSupervision Citation Governance: (1) AUTOMATED VERIFICATION: Every AI-surfaced citation is automatically checked against Westlaw\'s official reporter database. Citations that match: green status. Citations that don\'t match: red status with hard-stop. (2) ATTORNEY VERIFICATION: Even green-status citations require attorney click-through verification — "I have confirmed this citation is accurate and supports the proposition for which it is cited." This catches cases where the citation EXISTS but doesn\'t support the argument (a different hallucination type). (3) HARD-STOP ENFORCEMENT: No unverified citation can reach a filed document. The filing system rejects documents containing red-status citations. This is architectural — not a policy that can be ignored under deadline pressure. (4) VERIFICATION RECORD: Every citation\'s verification status, the verifying attorney, and the timestamp are sealed. If the court asks "did you verify Citation 7?" — the answer is a cryptographic receipt, not testimony. (5) The associate is protected. The partner is protected. The firm is protected. The client is protected. The court is protected.' },
        { agentId: 'sanctions', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT framework RESOLVED. The hard-stop is the most valuable feature Datacendia adds to Thomson Reuters\' legal AI platform. It converts a POLICY problem ("lawyers should verify citations") into an ARCHITECTURAL solution ("lawyers cannot file unverified citations"). For Thomson Reuters\' 97 AmLaw 100 clients: every firm that has hesitated to deploy CoCounsel because of hallucination risk can now adopt it — the hard-stop makes hallucination reaching a filed document architecturally impossible. For malpractice insurers: the verification record provides the evidence basis for AI-specific underwriting. Firms with CendiaSupervision receive premium reductions. For the legal profession: Mata v. Avianca was the warning. CoCounsel + CendiaSupervision is the answer. "AI-assisted legal research with every citation verified, every verification documented, and the hallucination structurally prevented from reaching a court."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:tr30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'tr40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (23 citations + Automated verification + Hard-stop log + Attorney attestations)',
        complianceLabel: 'Citation Status',
        complianceValue: '22 VERIFIED, 1 BLOCKED',
        complianceThreshold: 'Hard-stop: 0 unverified citations in filing',
        agents: ['Westlaw AI Agent', 'Verification Agent', 'Sanctions Risk Agent', 'Associate Supervision Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Westlaw AI Citation Governance — Hallucination Structurally Prevented',
        guaranteeBody: 'This cryptographic bundle seals the complete citation verification chain: 23 AI-surfaced citations, 22 verified against Westlaw official reporter, 1 hallucinated citation detected and hard-stopped (Morrison v. Digital Compliance Corp. — does not exist), associate protection documentation, and partner review attestation. The fabricated citation never reached the filed brief. Mata v. Avianca prevention by architecture.',
        evidenceChain: 'Westlaw AI research → 23 citations surfaced → Automated reporter check → 22 verified / 1 flagged → Hard-stop activated on Citation #17 → Associate notified → Partner review → Alternative citation sourced → Brief finalized → Ed25519 + RFC 3161 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate the hallucination hard-stop — preventing a fabricated AI citation from reaching a Second Circuit brief and protecting an associate\'s career, a partner\'s reputation, and the firm\'s $50M+ in client relationships.',
      phaseLabels: ['AI Research & Hallucination Detection', 'Career Risk & Sanctions Exposure', 'Hard-Stop Architecture'],
    },

    // SCENARIO 3 — CHECKPOINT AI TAX: CIRCULAR 230 COMPLIANCE
    {
      id: 'checkpoint-circular230',
      title: 'Checkpoint AI — Circular 230 Tax Practitioner Supervision',
      subtitle: 'Revoked PLR risk · Big Four deployment · IRS accuracy penalties · $1.2M exposure',
      banner: 'Simulating the tax practitioner governance challenge: a Big Four tax partner uses Checkpoint AI for a complex partnership allocation issue. The AI cites a Private Letter Ruling that was revoked in 2019. Without CendiaSupervision, the revoked PLR enters client advice. With it, the revocation is caught before the client adopts a $1.2M penalty-exposed tax position.',
      risk: 'High',
      scenarioNum: 'Circular 230',
      icon: 'calculator',
      color: 'text-emerald-400',
      agents: [
        { id: 'checkpoint', name: 'Checkpoint AI Agent', role: 'Tax Research & Authority Analysis', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'tax-partner', name: 'Tax Partner Agent', role: 'Circular 230 Practitioner Supervision', icon: '⚖️', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'irs-risk', name: 'IRS Risk Agent', role: 'Accuracy Penalty & Audit Exposure', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'quality', name: 'Quality Control Agent', role: 'Big Four Enterprise QC & Propagation Risk', icon: '🔍', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'Checkpoint AI Research', status: 'connected', type: 'Tax Authority Database', icon: 'database', detail: 'Partnership allocation research: 8 authorities cited, 1 PLR FLAGGED' },
        { name: 'IRS Revocation Database', status: 'connected', type: 'PLR Status Verification', icon: 'alert-triangle', detail: 'PLR 2017-28-004: REVOKED by Notice 2019-57' },
        { name: 'Circular 230 Compliance', status: 'connected', type: 'Practitioner Standards', icon: 'shield', detail: 'Reasonable basis standard: must rely on current, valid authorities' },
        { name: 'Big Four QC System', status: 'syncing', type: 'Enterprise Quality Control', icon: 'users', detail: 'Same Checkpoint query used across 47 client engagements' },
      ],
      script: [
        { agentId: 'checkpoint', phase: 'phase1', type: 'analysis', delay: 800, content: 'Checkpoint AI research complete for partnership special allocation issue under IRC §704(b). The AI surfaced 8 authorities supporting the proposed allocation structure: (1) IRC §704(b) and regulations — current, verified. (2) Treas. Reg. §1.704-1(b)(2) — current, verified. (3-6) Four Tax Court cases — all verified, current, and on point. (7) Rev. Rul. 2009-17 — verified, current. (8) PLR 2017-28-004 — FLAGGED. CendiaSupervision verification check: PLR 2017-28-004 was REVOKED by IRS Notice 2019-57, effective for taxable years beginning after December 31, 2019. The PLR\'s conclusion on partnership special allocations was explicitly rejected by the IRS. However: the PLR still appears in Checkpoint\'s database with its original content. The revocation is noted but not prominently flagged in the AI\'s research output. Without CendiaSupervision\'s authority currency check, a practitioner could cite this revoked PLR as support for a tax position that the IRS has specifically rejected.' },
        { agentId: 'irs-risk', phase: 'phase1', type: 'warning', delay: 2500, content: 'IRS PENALTY EXPOSURE — $1.2M. If the client adopts a partnership allocation based on the revoked PLR: (1) IRC §6662(a) accuracy-related penalty: 20% of the underpayment attributable to the position. Estimated underpayment: $6M in disallowed allocations × effective rate = $1.2M penalty. (2) The penalty defence under §6664(c)(1) requires "reasonable cause" and "good faith." Relying on a REVOKED PLR is the opposite of reasonable cause — it demonstrates the practitioner did NOT verify the currency of their authorities. (3) Circular 230 §10.34: A practitioner must not sign a return or advise a position unless there is a "reasonable basis" for the position. A revoked PLR cannot provide reasonable basis. (4) If the IRS discovers the firm relied on a revoked PLR: the practitioner faces Circular 230 sanctions (censure, suspension, or disbarment from IRS practice), and the firm faces reputational damage with 200+ other IRS-related clients.' },
        { agentId: 'quality', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED — ENTERPRISE PROPAGATION RISK. The Big Four firm\'s Checkpoint AI deployment serves 2,400 tax professionals across 47 offices. Enterprise QC analysis reveals: (1) The same partnership allocation research query has been run by 12 different tax professionals across 47 client engagements in the past 6 months. (2) Of those 47 engagements: 31 have already delivered client advice that may have cited or relied on PLR 2017-28-004. (3) Without CendiaSupervision\'s authority hash: the firm CANNOT identify which of the 47 engagements cited the revoked PLR without manually reviewing all 47 engagement files. (4) With CendiaSupervision\'s authority hash: every engagement that received the same Checkpoint output is INSTANTLY identifiable. The firm can identify all 31 affected clients, review the specific advice given, and issue corrections within 48 hours instead of 6 weeks. This is the Big Four QC problem at scale: when AI errors propagate across thousands of engagements, identification speed is the difference between a manageable correction and a firm-threatening crisis.' },
        { agentId: 'tax-partner', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CIRCULAR 230 PRACTITIONER DUTY. As the supervising tax partner, my Circular 230 obligations are personal — not delegable to AI. §10.35 requires that I exercise "due diligence" in determining the correctness of representations made to the IRS. If I sign a return or provide written advice based on a revoked PLR that I didn\'t independently verify: (1) I personally face Circular 230 sanctions — censure, suspension, or disbarment, (2) My firm faces vicarious Circular 230 liability, (3) The client faces accuracy penalties with NO penalty defence (because the advice was not based on "reasonable basis"). The CendiaSupervision authority verification solved this BEFORE I even saw the research. The revoked PLR was flagged automatically. But more importantly: every authority I DO rely on is documented as verified, current, and supporting the position taken. If the IRS audits this return in 3 years, I don\'t need to remember what I reviewed — the supervision record proves it.' },
        { agentId: 'checkpoint', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Checkpoint AI + CendiaSupervision Tax Governance: (1) AUTHORITY CURRENCY CHECK: Every AI-surfaced authority (PLR, Rev. Rul., case, regulation) is verified for current status — revocations, modifications, overruled status, and sunset provisions flagged automatically. (2) PRACTITIONER SIGN-OFF: The tax partner must confirm "I have reviewed and verified the currency and applicability of each authority" with their PTIN and firm ID. (3) ENTERPRISE QC HASH: Every Checkpoint research output receives a unique hash. When an error is discovered, all engagements using the same research output are instantly identified — firm-wide correction in 48 hours, not 6 weeks. (4) CIRCULAR 230 EVIDENCE: The complete supervision chain (research → verification → sign-off → client advice) is sealed. IRS audit in Year 3 receives the same evidence that existed at the time of filing — proving reasonable basis and due diligence at the moment of advice, not reconstructed after audit notification. (5) MALPRACTICE DEFENCE: If a client sues, the supervision record proves the practitioner verified every authority and exercised independent judgment.' },
        { agentId: 'quality', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The enterprise QC hash is the decisive innovation for Big Four deployment. Without it: a single AI error can propagate across hundreds of client engagements before anyone notices — the Checkpoint version of the "fabricated citation at scale" problem. With it: error detection triggers instant identification of every affected engagement. The firm\'s response time drops from weeks to hours. For Thomson Reuters\' Big Four relationships: Checkpoint + CendiaSupervision = the first AI tax research platform with enterprise-grade quality control. Every one of the 4 Big Four firms already using Checkpoint can demonstrate to the PCAOB, IRS, and their own national office that AI-assisted tax advice is governed, verified, and documented. The revoked PLR never reached a single client. 47 engagements were protected simultaneously. That is the power of architectural governance versus policy-based oversight.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:tr50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'tr60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (8 tax authorities + PLR revocation check + Practitioner sign-off + Enterprise QC hash)',
        complianceLabel: 'Circular 230',
        complianceValue: 'REVOKED PLR CAUGHT',
        complianceThreshold: '7/8 authorities verified, 1 revoked PLR blocked',
        agents: ['Checkpoint AI Agent', 'Tax Partner Agent', 'IRS Risk Agent', 'Quality Control Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Checkpoint AI Tax Governance — Circular 230 Compliant',
        guaranteeBody: 'This cryptographic bundle seals the complete tax research supervision: 8 AI-surfaced authorities, 7 verified current, 1 revoked PLR detected and blocked (PLR 2017-28-004, revoked by Notice 2019-57), practitioner PTIN sign-off, and enterprise QC hash protecting 47 simultaneous engagements. Circular 230 due diligence proven. IRS audit defence ready. $1.2M accuracy penalty prevented.',
        evidenceChain: 'Checkpoint AI research → 8 authorities surfaced → Currency verification → PLR 2017-28-004 flagged (revoked) → Partner notified → Alternative authority sourced → Practitioner sign-off (PTIN) → Enterprise QC hash → 47 engagements protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Checkpoint AI + CendiaSupervision catches a revoked PLR before it enters client advice — protecting a Big Four tax partner from Circular 230 sanctions and 47 client engagements from IRS accuracy penalties.',
      phaseLabels: ['Authority Research & Verification', 'Penalty Exposure & Enterprise Risk', 'Practitioner Governance Protocol'],
    },
  ],
};

export default config;
