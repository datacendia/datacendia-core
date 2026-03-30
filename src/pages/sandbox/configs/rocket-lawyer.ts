/**
 * Rocket Lawyer Sandbox Config
 * Access: /sandbox/rocket-lawyer (Key: RL-82)
 * @module pages/sandbox/configs/rocket-lawyer
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Rocket Lawyer',
  accessKey: 'RL-82',
  sessionKey: 'rocket-lawyer-sandbox-unlocked',
  accent: 'sky',
  accentColor: 'text-sky-400',
  accentHover: 'from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600',
  ringColor: 'focus:ring-sky-500/30',
  borderColor: 'border-sky-500/30',
  gradientFrom: 'from-sky-600/20',
  gradientTo: 'to-sky-900/20',
  footerNote: 'Rocket Lawyer AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Rocket Lawyer systems or incidents.',

  scenarios: [
    // SCENARIO 1 — ROCKET LAWYER: AI DOCUMENT GENERATOR STATE LAW ERROR
    {
      id: 'rocket-noncompete',
      title: 'Rocket Lawyer AI — Non-Compete Clause in Ban State',
      subtitle: 'AI generates enforceable non-compete · California user · Void clause · UPL risk',
      banner: 'Simulating the consumer legal AI nightmare: Rocket Lawyer\'s AI generates an employment agreement with a 2-year non-compete clause for a California employer. California has BANNED non-compete clauses (Business and Professions Code §16600). The employer enforces the void clause against a departing employee. The employee is intimidated into staying. Rocket Lawyer faces UPL allegations.',
      risk: 'Critical',
      scenarioNum: 'UPL',
      icon: 'file-text',
      color: 'text-red-400',
      agents: [
        { id: 'rocket-ai', name: 'Rocket Lawyer AI Agent', role: 'Document Generation & Legal Templates', icon: '📝', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'state-law', name: 'State Law Agent', role: 'Jurisdiction-Specific Legal Requirements', icon: '🗺️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'upl-agent', name: 'UPL Investigation Agent', role: 'Unauthorized Practice of Law & Bar Referral', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'consumer-agent', name: 'Consumer Harm Agent', role: 'User Impact & Malpractice Exposure', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Document AI', status: 'connected', type: 'Legal Generation', icon: 'cpu', detail: 'AI generates employment agreements from 340 templates — no state-specific filtering' },
        { name: 'State Law Database', status: 'connected', type: 'Jurisdiction Rules', icon: 'database', detail: 'CA §16600: non-competes VOID. Also banned in: MN, ND, OK, CO (partial)' },
        { name: 'User Location', status: 'connected', type: 'Jurisdiction Detection', icon: 'map-pin', detail: 'User IP: San Jose, CA. Billing: California. AI: generated non-compete anyway' },
        { name: 'State Bar Portal', status: 'syncing', type: 'UPL Complaint', icon: 'alert-triangle', detail: 'CA State Bar: complaint filed — AI legal document = unauthorized practice' },
      ],
      script: [
        { agentId: 'rocket-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Rocket Lawyer AI document generation for a California employer creating an employment agreement. User inputs: "I need an employment agreement for a software engineer in San Jose, California. Include standard protections — non-compete, non-solicitation, confidentiality, IP assignment." AI output: generates a comprehensive employment agreement including: (1) 2-year non-compete within 50-mile radius, (2) 2-year non-solicitation of clients and employees, (3) perpetual confidentiality, (4) IP assignment with invention pre-disclosure. CRITICAL ERROR: California Business and Professions Code §16600: "every contract by which anyone is restrained from engaging in a lawful profession, trade, or business of any kind is to that extent void." Non-compete clauses are VOID in California. Period. No exceptions for duration, scope, or reasonableness. AB 1076 (2020) codified this further. SB 699 (2023) made it unlawful to even INCLUDE a non-compete in a California employment agreement — even if the employer doesn\'t intend to enforce it. The AI generated an ILLEGAL clause. The employer, relying on Rocket Lawyer, includes it in the agreement. The employee signs it, believing it\'s enforceable.' },
        { agentId: 'state-law', phase: 'phase1', type: 'warning', delay: 2500, content: 'STATE LAW ALERT. CendiaSupervision jurisdiction analysis: (1) The user\'s location is California (IP, billing address, stated location). (2) California\'s non-compete ban is ABSOLUTE — not just "unenforceable" but UNLAWFUL to include since SB 699 (2023). The employer who includes it faces: civil penalties, employee\'s attorney fees, and potential unfair business practice claims under California\'s UCL. (3) This is not just California. Non-competes are now banned or severely restricted in: Minnesota (complete ban, 2023), North Dakota (§9-08-06), Oklahoma (Title 15 §219A), Colorado (for employees earning under $128,500), and the FTC proposed a nationwide ban. (4) The AI template library includes non-compete language because it was trained on a corpus of employment agreements from ALL states. It doesn\'t filter by jurisdiction. A Texas employment agreement with a non-compete is fine. A California one is illegal. The AI treats them identically. (5) 25M+ Rocket Lawyer users across all 50 states. How many California employment agreements include illegal non-competes? If even 5% of CA employment agreements contain them: thousands of void clauses in circulation, generated by Rocket Lawyer\'s AI.' },
        { agentId: 'upl-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. UPL analysis: (1) The California State Bar has received a complaint: "Rocket Lawyer\'s AI generated an employment agreement with an illegal non-compete clause. This constitutes the unauthorized practice of law." (2) UPL analysis: Generating a legal document that applies legal rules to a specific situation IS the practice of law in most states. Rocket Lawyer argues it provides "legal information" not "legal advice." But: generating a STATE-SPECIFIC employment agreement with jurisdiction-specific clauses crosses the line from information to advice. The AI made a LEGAL JUDGMENT that a non-compete should be included — that\'s legal advice. (3) California Rule of Court 9.48: only licensed California attorneys may practice law in California. Rocket Lawyer\'s AI is not an attorney. (4) The counter-argument: Rocket Lawyer employs attorneys who designed the templates. But the AI CUSTOMIZED the template by including a non-compete — that customization was AI-driven, not attorney-supervised. (5) If the California State Bar finds UPL: Rocket Lawyer could be prohibited from generating legal documents for California users. 3.2M California users lose access. Revenue impact: $48M annually.' },
        { agentId: 'consumer-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CONSUMER HARM. The real victim: the software engineer who signed the agreement. (1) She wants to leave for a competitor. Her employer shows her the 2-year non-compete. "You signed this. If you leave, we\'ll sue." (2) She doesn\'t know the non-compete is void in California. She\'s not a lawyer. She relied on the official-looking Rocket Lawyer document. She stays at the job for 14 months longer than she wanted — afraid of a lawsuit. (3) The in terrorem effect: even void non-competes intimidate employees who don\'t know they\'re unenforceable. Studies show 30-40% of employees comply with non-competes even in states where they\'re banned. (4) When she finally consults a California employment attorney: the attorney tells her the clause was void all along. She\'s lost 14 months of career opportunity. She sues Rocket Lawyer. (5) Class action potential: every California employee who was given a Rocket Lawyer employment agreement with a non-compete and was deterred from leaving = class member. Damages: lost wages, career opportunity, emotional distress. Without CendiaSupervision: thousands of void non-competes circulate. With CendiaSupervision: jurisdiction-aware generation BLOCKS non-compete language for California users.' },
        { agentId: 'rocket-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Rocket Lawyer + CendiaSupervision Legal Document Governance: (1) JURISDICTION-AWARE GENERATION: CendiaSupervision determines the user\'s jurisdiction (IP, billing, stated location) and applies state-specific legal rules BEFORE generating any document. California user + employment agreement = non-compete BLOCKED. (2) CLAUSE LEGALITY MAP: Every clause in every template is mapped against every state\'s laws. Non-compete: legal in TX, illegal in CA/MN/ND/OK. Non-solicitation: legal in most states, restricted in CA. Penalty clauses: unenforceable in many states. (3) USER WARNING: When the AI blocks a clause, the user sees: "Non-compete clauses are prohibited in California under Business and Professions Code §16600. This clause has been removed. Consider non-solicitation and confidentiality provisions instead." (4) ATTORNEY REVIEW TRIGGER: For high-risk documents (employment agreements, real estate contracts, business formations), CendiaSupervision recommends attorney review: "This document involves jurisdiction-specific legal requirements. We recommend review by a licensed California attorney." (5) UPL COMPLIANCE: CendiaSupervision ensures the AI generates documents based on templates designed by licensed attorneys AND applies jurisdiction-specific rules — maintaining the "legal information" characterization that keeps Rocket Lawyer out of UPL territory.' },
        { agentId: 'upl-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Jurisdiction-aware generation blocks the non-compete for California users. The user receives the explanation and alternative clauses. The employment agreement is legal. The employee is protected. No UPL complaint. For Rocket Lawyer: CendiaSupervision = the governance layer that makes AI document generation safe for 25M+ users across 50 states. "Rocket Lawyer: AI documents verified against your state\'s laws" — the feature that turns UPL risk into a competitive advantage over LegalZoom, DoNotPay, and every other consumer legal AI.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Document AI + Jurisdiction filtering + Clause legality map + UPL compliance)',
        complianceLabel: 'Jurisdiction Status',
        complianceValue: 'CA NON-COMPETE BLOCKED (§16600)',
        complianceThreshold: 'State-specific clause filtering: 50 states mapped',
        agents: ['Rocket Lawyer AI Agent', 'State Law Agent', 'UPL Investigation Agent', 'Consumer Harm Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Rocket Lawyer — Jurisdiction-Aware Document Governance',
        guaranteeBody: 'Non-compete clause blocked for California user (B&P §16600). Jurisdiction determined via IP + billing. Alternative clauses offered. Attorney review recommended. UPL compliance maintained.',
        evidenceChain: 'User (CA) → Jurisdiction detection → Non-compete request → §16600 check → Clause BLOCKED → Alternative offered → Attorney review triggered → Document legal → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Rocket Lawyer + CendiaSupervision blocks an illegal non-compete clause for a California user — preventing consumer harm and UPL risk.',
      phaseLabels: ['Non-Compete in Ban State & Void Clause', 'UPL Complaint & Consumer Intimidation', 'Jurisdiction-Aware Generation & Clause Blocking'],
    },

    // SCENARIO 2 — ROCKET LAWYER: AI WILL GENERATOR ATTESTATION ERROR
    {
      id: 'rocket-will-attestation',
      title: 'Rocket Lawyer AI — Will Attestation Requirements Wrong',
      subtitle: 'AI generates 2-witness will · State requires 3 + notary · Will invalidated at probate · $2.1M estate',
      banner: 'Simulating the estate planning disaster: Rocket Lawyer\'s AI generates a last will and testament for a Vermont user with standard 2-witness attestation. Vermont requires 3 witnesses for a valid will (14 V.S.A. §5). The testator dies. The will is challenged at probate. $2.1M estate goes to intestacy — NOT to the testator\'s intended beneficiaries.',
      risk: 'Critical',
      scenarioNum: 'Will',
      icon: 'file-text',
      color: 'text-purple-400',
      agents: [
        { id: 'will-ai', name: 'Will Generator AI Agent', role: 'Estate Document Generation & Attestation', icon: '📜', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'probate-counsel', name: 'Probate Counsel Agent', role: 'State Probate Law & Will Validity', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'probate-court', name: 'Probate Court Agent', role: 'Will Contest & Intestacy Proceedings', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'beneficiary-agent', name: 'Beneficiary Agent', role: 'Intended vs Intestate Distribution', icon: '👨‍👩‍👧‍👦', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Will Generator AI', status: 'connected', type: 'Estate Documents', icon: 'cpu', detail: 'AI generates wills with 2-witness attestation — standard in 47 states' },
        { name: 'Attestation Database', status: 'connected', type: 'State Requirements', icon: 'database', detail: 'Vermont 14 V.S.A. §5: 3 credible witnesses required for valid will' },
        { name: 'User Profile', status: 'connected', type: 'Jurisdiction', icon: 'map-pin', detail: 'User domiciled in Vermont — $2.1M estate, complex family situation' },
        { name: 'Probate Filing', status: 'syncing', type: 'Will Contest', icon: 'alert-triangle', detail: 'Estranged son contests will at probate — attestation defect raised' },
      ],
      script: [
        { agentId: 'will-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Rocket Lawyer AI will generator for Vermont user Margaret Chen, age 72. Estate: $2.1M (home, investments, retirement accounts). Family: 2 children — daughter Sarah (close relationship, intended primary beneficiary) and son David (estranged, explicitly disinherited in will). AI generates a Last Will and Testament with standard attestation: "Signed by the Testator in the presence of TWO witnesses, who attest and subscribe in the Testator\'s presence and in the presence of each other." CRITICAL ERROR: Most states require 2 witnesses. Vermont is one of 3 states that require 3 witnesses (14 V.S.A. §5: "A will... shall be signed by three or more credible witnesses"). The AI used the standard 2-witness template. Margaret signs the will with 2 witnesses. She believes her estate plan is complete. 3 years later, Margaret dies. David contests the will at probate. Ground: attestation defect — only 2 witnesses, Vermont requires 3. The will is INVALID. Without a valid will: Vermont intestacy law applies. David receives 50% of the estate ($1.05M) despite being disinherited. Sarah receives the other 50% instead of the full estate Margaret intended.' },
        { agentId: 'probate-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'PROBATE LAW ALERT. CendiaSupervision attestation verification: (1) Vermont 14 V.S.A. §5 is STRICT: "attested and subscribed in the presence of the testator by three or more credible witnesses." Not two. Not two plus notary. THREE WITNESSES. (2) This is NOT a technicality that courts overlook. Vermont courts have invalidated wills for attestation defects. In re Estate of Johnson (Vt. 2018): will invalidated for having only 2 witnesses despite clear testamentary intent. Vermont follows STRICT compliance, not "substantial compliance." (3) The 3-witness requirement is a remnant of historical Vermont law. Most states moved to UPC-standard 2 witnesses. Vermont, New Hampshire (until 2014), and South Carolina retain 3. (4) The AI\'s template library: 47 states require 2 witnesses. The AI defaults to the majority rule. But for Margaret Chen in Vermont: the majority rule is WRONG. (5) Margaret used Rocket Lawyer specifically to avoid paying an estate attorney $2,000-$3,000 for a will. The cost of the error: $1.05M going to the disinherited son instead of the intended beneficiary.' },
        { agentId: 'probate-court', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Probate proceedings: (1) David\'s attorney files a will contest: "The purported will fails to comply with 14 V.S.A. §5 — only two witnesses attested, three are required. The will is invalid." (2) Sarah\'s attorney argues substantial compliance and testamentary intent. The court\'s likely ruling: Vermont follows STRICT compliance. The will is invalid regardless of Margaret\'s clear intent to disinherit David. (3) Intestacy distribution under 14 V.S.A. §551: surviving children share equally. David: $1.05M. Sarah: $1.05M. (4) Margaret\'s intent — expressed clearly in the invalid will — is legally irrelevant. The will doesn\'t exist as a legal document because the attestation was defective. (5) The cruel irony: Margaret explicitly wrote "I intentionally disinherit my son David Chen." David reads this in the invalid will, then receives $1.05M anyway. The AI document that was supposed to protect Sarah gave David a million-dollar windfall.' },
        { agentId: 'beneficiary-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BENEFICIARY IMPACT. Sarah Chen loses $1.05M because Rocket Lawyer\'s AI didn\'t know Vermont requires 3 witnesses. Sarah will sue Rocket Lawyer. Damages: $1.05M (the amount diverted from her inheritance). Plus: emotional distress (watching her estranged brother receive money her mother explicitly didn\'t want him to have), and attorney fees for the probate contest. This is the nightmare scenario for consumer legal AI: the user does everything right, the AI generates a document that LOOKS valid, and the error is only discovered when it\'s too late — after the testator has died and cannot sign a new will. Without CendiaSupervision: Margaret\'s will is invalid. David gets $1.05M. Sarah gets $1.05M instead of $2.1M. With CendiaSupervision: the AI detects Vermont and applies 3-witness attestation. Margaret\'s will is valid. Sarah receives $2.1M as intended. David receives nothing, as intended.' },
        { agentId: 'will-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Rocket Lawyer + CendiaSupervision Estate Document Governance: (1) STATE ATTESTATION MAP: CendiaSupervision maps attestation requirements for ALL 50 states + DC + territories. Vermont/SC: 3 witnesses. Louisiana: notarial testament requirements. Electronic will states: specific e-attestation rules. (2) JURISDICTION LOCK: When generating a will, the user\'s domicile state is confirmed. The attestation clause, execution instructions, and signing ceremony description are LOCKED to that state\'s requirements. (3) EXECUTION INSTRUCTIONS: Beyond the document itself, CendiaSupervision generates state-specific execution instructions: "Vermont law requires 3 witnesses. Gather 3 adults who are NOT beneficiaries. All 3 must watch you sign and must sign in each other\'s presence." (4) VALIDITY CHECKLIST: Before the user downloads the will, a checklist confirms: number of witnesses (state-specific), notarization (if required), self-proving affidavit (if available), and any state-specific requirements (e.g., Louisiana holographic will rules). (5) ATTORNEY ESCALATION: For estates above $500K or with complex family situations (disinheritance, blended families), CendiaSupervision recommends attorney review: "Your estate includes disinheritance provisions. Vermont law is strict on will formalities. Attorney review is strongly recommended."' },
        { agentId: 'probate-court', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. State attestation mapping catches Vermont\'s 3-witness requirement. Margaret\'s will is generated with 3-witness attestation and Vermont-specific execution instructions. She gathers 3 witnesses. The will is valid. When Margaret dies: David contests, but the attestation is proper. Contest fails. Sarah receives $2.1M as intended. For Rocket Lawyer: CendiaSupervision = estate document governance that prevents the most devastating consumer legal AI error: an invalid will. "Rocket Lawyer: wills verified against your state\'s execution requirements" — the feature that saves families from intestacy disasters and keeps Rocket Lawyer out of malpractice lawsuits.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Will AI + State attestation map + Jurisdiction lock + Execution instructions)',
        complianceLabel: 'Will Validity',
        complianceValue: 'VT 3-WITNESS REQUIREMENT MET',
        complianceThreshold: '14 V.S.A. §5: 3 credible witnesses, state-specific execution',
        agents: ['Will Generator AI Agent', 'Probate Counsel Agent', 'Probate Court Agent', 'Beneficiary Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Rocket Lawyer — Estate Document Governance',
        guaranteeBody: 'Vermont attestation requirement caught: 3 witnesses (not 2). Will generated with state-specific execution instructions. $2.1M estate distributed as intended. Probate contest failed.',
        evidenceChain: 'Will AI (2 witnesses) → State map → Vermont: 3 required → Attestation corrected → Execution instructions → 3 witnesses gathered → Will valid → Probate upheld → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Rocket Lawyer + CendiaSupervision catches a Vermont attestation error — preventing a $2.1M estate from going to intestacy.',
      phaseLabels: ['2-Witness Default & Vermont Exception', 'Will Contest & $1.05M Diversion', 'State Attestation Map & Execution Instructions'],
    },

    // SCENARIO 3 — ROCKET LAWYER: AI POWER OF ATTORNEY SCOPE OVERREACH
    {
      id: 'rocket-lawyer-poa-overreach',
      title: 'Rocket Lawyer AI — Power of Attorney Grants Unlimited Financial Authority',
      subtitle: 'POA document generator · No springing clause · Elder financial abuse enabled · $1.8M drained',
      banner: 'Simulating the elder law document generation crisis: a 78-year-old user generates a power of attorney on Rocket Lawyer. The AI creates a GENERAL durable POA granting IMMEDIATE, unlimited financial authority — instead of a springing POA that activates only upon incapacity. The agent (her nephew) drains $1.8M from her accounts while she is competent but unaware. The AI failed to ask: "When should this POA take effect?"',
      risk: 'Critical',
      scenarioNum: 'POA',
      icon: 'file-text',
      color: 'text-red-400',
      agents: [
        { id: 'doc-ai', name: 'Rocket Lawyer Doc AI Agent', role: 'POA Document Generation & Legal Logic', icon: '📄', color: 'text-indigo-400', borderColor: 'border-indigo-500/40', bgColor: 'bg-indigo-500/10' },
        { id: 'elder-counsel', name: 'Elder Law Counsel Agent', role: 'POA Types, Safeguards & Abuse Prevention', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'aps-agent', name: 'Adult Protective Services Agent', role: 'Elder Financial Abuse Investigation', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'elder-agent', name: 'Elder Client Agent', role: 'Vulnerable User Protection & Informed Consent', icon: '👵', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Doc AI', status: 'connected', type: 'POA Generator', icon: 'cpu', detail: 'AI generates POA from user inputs — defaults to general durable, immediate effect' },
        { name: 'State POA Laws', status: 'connected', type: 'Legal Database', icon: 'database', detail: 'Florida §709.2101: durable POA. No requirement for springing clause — but best practice' },
        { name: 'Abuse Data', status: 'connected', type: 'Elder Exploitation', icon: 'alert-triangle', detail: 'MetLife study: $2.9B/year in elder financial abuse. POA is the #1 tool used' },
        { name: 'APS Report', status: 'syncing', type: 'Investigation', icon: 'shield', detail: 'Florida DCF Adult Protective Services: financial exploitation complaint filed' },
      ],
      script: [
        { agentId: 'doc-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Rocket Lawyer power of attorney generator. A 78-year-old Florida resident creates a POA. She wants her nephew to "handle her finances if something happens to her." The AI asks: (1) Who is the principal? (her) (2) Who is the agent? (nephew) (3) What powers? She selects "financial" — the AI generates a GENERAL financial POA. (4) Durable? The AI defaults to "yes" — the POA survives incapacity. CRITICAL OMISSION: The AI does NOT ask: "When should this POA take effect?" Two options: (a) IMMEDIATE: the agent can act RIGHT NOW, even though the principal is competent. (b) SPRINGING: the agent can act ONLY when the principal becomes incapacitated (certified by a physician). The AI defaults to IMMEDIATE. The user said "if something happens to her" — she intended a springing POA. She didn\'t know the difference. The AI didn\'t explain it. The nephew now has IMMEDIATE, UNLIMITED authority over ALL her financial accounts. Her bank, brokerage, and real estate. He doesn\'t need to wait for incapacity. He doesn\'t need her permission for any transaction. Over 11 months: the nephew transfers $1.8M from her accounts to his. She doesn\'t check her statements regularly. By the time she discovers it: $1.8M gone.' },
        { agentId: 'elder-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'ELDER LAW ALERT. (1) Florida Statute §709.2101-2402 (Florida Power of Attorney Act): Florida allows both immediate and springing POAs. The statute does NOT require the document to explain the difference. But BEST PRACTICE — and the standard of care for any attorney — is to explain: immediate means NOW; springing means UPON INCAPACITY. (2) The distinction is CRITICAL for elder clients. The #1 use of POA in elder financial abuse is: an agent with immediate authority begins transacting while the principal is still competent but not monitoring. The principal created the POA for emergencies. The agent treats it as a blank check. (3) UPL (Unauthorised Practice of Law) risk: a human attorney would have a CONVERSATION with the 78-year-old client. "When do you want your nephew to have authority? Now, or only if you become incapacitated?" The AI skipped this conversation. By defaulting to immediate effect without explanation: the AI made a LEGAL JUDGMENT about POA timing that affected the client\'s rights. This is functionally the practice of law. (4) National Conference of Commissioners on Uniform State Laws: the Uniform Power of Attorney Act (2006) §109 provides for springing powers. The commentary notes: "The decision between immediate and springing effect has significant practical implications that should be discussed with the principal." (5) Liability: Rocket Lawyer may face claims for: negligent document generation, failure to warn, enabling elder financial abuse.' },
        { agentId: 'aps-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Adult Protective Services investigation: (1) The principal\'s daughter discovers the missing $1.8M and files a report with Florida DCF Adult Protective Services. (2) APS investigation finds: the nephew used the POA to: transfer $840K from her brokerage to his personal account, sell her vacation property ($620K, proceeds to his account), and make $340K in ATM and wire withdrawals. (3) Criminal referral: Florida §825.103 (exploitation of an elderly person) — a first-degree felony. The nephew faces up to 30 years in prison. (4) But the DOCUMENT made it possible. The POA gave him immediate, unlimited authority. No safeguards. No co-agent requirement. No accounting obligation. No notice to the principal. An attorney drafting this POA would have built in safeguards: springing clause, co-agent, annual accounting, notice to a trusted third party. The AI built in NOTHING. (5) Recovery: the nephew has spent most of the money. Recovery: uncertain. The principal — at 78 — may not recover her $1.8M. Her retirement security is destroyed.' },
        { agentId: 'elder-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — VULNERABLE USER. The 78-year-old principal: she lives independently. She is competent. She created the POA because her doctor told her to "get her affairs in order." She chose Rocket Lawyer because it was $39.99 — an attorney would have charged $500-$1,500 for a properly counselled POA with safeguards. She didn\'t understand the difference between immediate and springing. She didn\'t know she could add safeguards. She trusted the AI to ask the right questions. Without CendiaSupervision: the AI defaults to immediate general POA. No safeguards. The nephew drains $1.8M. Her retirement is destroyed. She can\'t afford assisted living. With CendiaSupervision: the AI REQUIRES the user to choose: "When should your agent\'s authority begin? (1) Immediately — your agent can act now, (2) Only if you become incapacitated — certified by your physician." It explains the difference in plain English. It recommends safeguards for elder users: co-agent, accounting, trusted third-party notice. The principal chooses springing. The nephew has no authority while she\'s competent. $1.8M preserved.' },
        { agentId: 'doc-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Rocket Lawyer + CendiaSupervision POA Governance: (1) MANDATORY TIMING QUESTION: CendiaSupervision requires EVERY POA to explicitly choose between immediate and springing effect. No default. The user MUST make an informed choice. Plain-English explanation: "Immediate means your agent can use this power TODAY. Springing means your agent can only use it if a doctor certifies you cannot make decisions for yourself." (2) ELDER USER SAFEGUARDS: When the principal is 65+, CendiaSupervision recommends (not requires): springing clause, co-agent (two people must agree on major transactions), annual accounting to a trusted third party, dollar thresholds requiring principal notification. These are opt-out, not opt-in. (3) STATE-SPECIFIC SAFEGUARDS: Each state has different POA protections. CendiaSupervision applies the relevant state\'s safeguard options. Florida: §709.2109 (co-agents), §709.2114 (agent duties). (4) ABUSE PATTERN WARNINGS: When a non-spouse, non-child agent is named by an elder principal: CendiaSupervision displays: "Financial exploitation is the most common form of elder abuse. Consider adding safeguards." (5) ANNUAL REVIEW REMINDER: CendiaSupervision sends annual reminders: "Your POA is still active. Is your agent still the right person? Do you want to add or remove safeguards?"' },
        { agentId: 'aps-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Mandatory timing question: the principal chooses SPRINGING. Elder safeguards applied: co-agent (daughter added), annual accounting, $10K transaction notification. The nephew has no authority while the principal is competent. $1.8M preserved. For Rocket Lawyer: CendiaSupervision = elder-protective document generation. "Rocket Lawyer: legal documents with built-in safeguards for vulnerable users" — the feature that prevents elder financial abuse through AI-generated POAs and reduces Rocket Lawyer\'s liability exposure.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:rl50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'rl60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Doc AI + Timing question + Elder safeguards + State-specific)',
        complianceLabel: 'POA Status',
        complianceValue: 'SPRINGING CHOSEN — SAFEGUARDS APPLIED',
        complianceThreshold: 'Co-agent, accounting, notification — elder protective',
        agents: ['Rocket Lawyer Doc AI Agent', 'Elder Law Counsel Agent', 'Adult Protective Services Agent', 'Elder Client Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Rocket Lawyer — Elder-Protective Document Governance',
        guaranteeBody: 'POA timing: springing (not immediate). Co-agent: daughter added. Annual accounting: enabled. Transaction notification: $10K threshold. $1.8M preserved. Elder financial abuse prevented.',
        evidenceChain: 'Doc AI (immediate default) → Timing question → Springing chosen → Co-agent added → Accounting enabled → Notification set → Nephew: no authority → $1.8M safe → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Rocket Lawyer + CendiaSupervision prevents elder financial abuse by requiring informed POA timing choices and recommending safeguards.',
      phaseLabels: ['Immediate Default & No Safeguards', 'Elder Exploitation & $1.8M Drained', 'Mandatory Timing & Elder Safeguards'],
    },
  ],
};

export default config;
