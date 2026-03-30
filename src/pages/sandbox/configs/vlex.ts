/**
 * vLex Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for international/mid-market AI governance.
 * Access: /sandbox/vlex (Key: VX-71)
 *
 * @module pages/sandbox/configs/vlex
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'vLex',
  accessKey: 'VX-71',
  sessionKey: 'vlex-sandbox-unlocked',

  accent: 'orange',
  accentColor: 'text-orange-400',
  accentHover: 'from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
  ringColor: 'focus:ring-orange-500/30',
  borderColor: 'border-orange-500/30',
  gradientFrom: 'from-orange-600/20',
  gradientTo: 'to-orange-900/20',

  footerNote: '50 regulatory scenarios mapped for vLex × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'vincent-jurisdiction',
      title: 'Vincent AI — Multi-Jurisdiction Research Confusion',
      subtitle: 'US asylum brief · UK case cited as US authority · Immigration judge catches error',
      banner: 'Simulating Vincent AI\'s cross-jurisdiction risk: an immigration attorney researches asylum law across US, UK, and Canada. The AI conflates UK refugee convention interpretations with US asylum standards. A UK case is presented as US authority in a BIA brief.',
      risk: 'Critical',
      scenarioNum: 'Jurisdiction',
      icon: 'globe',
      color: 'text-orange-400',
      agents: [
        { id: 'vincent-ai', name: 'Vincent AI Agent', role: 'Multi-Jurisdiction Legal Research', icon: '🤖', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'immigration', name: 'Immigration Counsel Agent', role: 'Asylum Law & BIA Practice', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'jurisdiction-check', name: 'Jurisdiction Verification Agent', role: 'Source Country Confirmation & Authority Classification', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'client-impact', name: 'Client Impact Agent', role: 'Asylum Seeker Rights & Deportation Risk', icon: '👤', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Vincent AI Engine', status: 'connected', type: 'Multi-Jurisdiction Research', icon: 'database', detail: '6 cases cited across US, UK, Canada — 1 UK case presented as US' },
        { name: 'Jurisdiction Classifier', status: 'connected', type: 'Source Verification', icon: 'check-circle', detail: 'R v. Secretary of State (UK) cited as US BIA authority' },
        { name: 'BIA Filing System', status: 'connected', type: 'Immigration Court', icon: 'file-text', detail: 'Appeal brief due in 30 days — asylum claim at stake' },
        { name: 'UNHCR Standards', status: 'syncing', type: 'International Framework', icon: 'globe', detail: 'Refugee Convention interpreted differently in US vs UK vs Canada' },
      ],
      script: [
        { agentId: 'vincent-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Vincent AI research complete for BIA appeal — asylum claim based on persecution for political opinion. 6 authorities identified across jurisdictions: (1) INS v. Elias-Zacarias, 502 U.S. 478 (1992) — US Supreme Court. Correct jurisdiction. (2) Cardoza-Fonseca v. INS, 480 U.S. 421 (1987) — US Supreme Court. Correct jurisdiction. (3) Matter of Mogharrabi, 19 I&N Dec. 439 (BIA 1987) — US BIA. Correct jurisdiction. (4) R v. Secretary of State for the Home Department, ex parte Sivakumaran [1988] AC 958 — UK HOUSE OF LORDS. WRONG JURISDICTION. Vincent AI cited this UK case alongside US authorities without distinguishing it as foreign law. The AI\'s summary: "Sivakumaran establishes that asylum applicants must demonstrate a \'real risk\' of persecution." This is the UK standard — the US standard under Cardoza-Fonseca is "well-founded fear" (a lower threshold). The AI conflated the two standards, using the UK\'s higher "real risk" threshold in a US asylum analysis. (5-6) Two Canadian Federal Court decisions — correctly identified as Canadian but presented alongside US authorities without clarification of their non-binding status.' },
        { agentId: 'jurisdiction-check', phase: 'phase1', type: 'warning', delay: 2500, content: 'JURISDICTION VERIFICATION ALERT. CendiaSupervision cross-checked all 6 Vincent AI citations: (1-3) US authorities: CONFIRMED — correct jurisdiction, correct characterization. (4) Sivakumaran: UK HOUSE OF LORDS — NOT US authority. Not binding on BIA. Not even persuasive authority in US immigration proceedings without specific citation as comparative law. The AI presented it as if it were part of the US asylum framework. (5-6) Canadian Federal Court: FOREIGN LAW — not binding on BIA. May be cited as persuasive comparative law but must be clearly identified as foreign authority. The critical issue: the "real risk" standard from Sivakumaran is HIGHER than the US "well-founded fear" standard. If the brief argues the client must meet a "real risk" standard, the brief is arguing AGAINST the client by applying a higher threshold than US law requires. This is the opposite of effective advocacy — the AI is helping the opposing side.' },
        { agentId: 'client-impact', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The stakes could not be higher: (1) The client is an asylum seeker fleeing political persecution. Deportation means return to danger. (2) The brief\'s error isn\'t just academic — it applies a HIGHER standard than required. Under US law (Cardoza-Fonseca), the client needs to show "well-founded fear" — a 10% probability of persecution may suffice. Under the UK standard (Sivakumaran), the client would need to show "real risk" — generally interpreted as requiring a higher probability. (3) If the immigration judge applies the UK standard (because the brief argued it), the client may lose an asylum claim they would have WON under the correct US standard. (4) The attorney who files this brief faces a potential Strickland-equivalent claim in immigration: ineffective assistance of counsel (Matter of Lozada). The client was harmed by counsel\'s error. The error was AI-generated, but the responsibility is the attorney\'s.' },
        { agentId: 'immigration', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — IMMIGRATION COUNSEL DUTY. I am a mid-market immigration attorney managing 80 active cases. I used Vincent AI because I cannot spend 8 hours researching every BIA appeal. The AI gave me a clean-looking research memo with 6 citations. Without CendiaSupervision: I would have incorporated the citations, filed the brief, and the IJ or BIA would have caught the UK case — or worse, applied the wrong standard without catching it. My client\'s asylum depends on the correct legal standard. With CendiaSupervision: the jurisdiction check caught the UK case immediately. I remove it, restructure the argument around the correct US standard, and my client has the best possible brief. For solo and mid-market attorneys: Vincent AI + CendiaSupervision is the difference between AI-assisted competence and AI-assisted malpractice.' },
        { agentId: 'vincent-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Vincent AI + CendiaSupervision Multi-Jurisdiction Governance: (1) JURISDICTION TAGGING: Every Vincent AI citation is tagged with its source jurisdiction (US, UK, Canada, EU, etc.) and its authority classification (binding, persuasive, comparative). Foreign authorities are clearly marked. (2) STANDARD COMPARISON: When multiple jurisdictions are involved, CendiaSupervision compares the legal standards — "well-founded fear" (US) vs "real risk" (UK) vs "balance of probabilities" (Canada). The attorney sees the differences, not conflated standards. (3) BINDING AUTHORITY FILTER: For jurisdiction-specific filings (BIA, state court, federal court), CendiaSupervision filters to binding authority and clearly separates persuasive/comparative citations. (4) ATTORNEY SIGN-OFF: Immigration counsel reviews the jurisdiction-verified research and signs off. Evidence for Lozada defence if challenged.' },
        { agentId: 'client-impact', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The jurisdiction verification eliminates the UK case and the Canadian authorities from the binding authority section. The brief argues the correct "well-founded fear" standard under Cardoza-Fonseca. The asylum seeker gets the most effective advocacy possible. For vLex: Vincent AI + CendiaSupervision = the only multi-jurisdiction legal research platform with jurisdiction governance. vLex covers 100+ jurisdictions — which is a strength AND a risk. Without governance, multi-jurisdiction coverage means multi-jurisdiction confusion. With CendiaSupervision, it means verified multi-jurisdiction research with clear authority classification. "Our AI researches 100+ jurisdictions and TAGS every citation with jurisdiction and authority level" — that\'s the differentiator for the mid-market and international firms that rely on vLex.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:vx10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'vx20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Vincent AI research + Jurisdiction tagging + Authority classification + Counsel sign-off)',
        complianceLabel: 'Jurisdiction Status',
        complianceValue: 'UK CASE REMOVED FROM US BRIEF',
        complianceThreshold: '3 US binding, 1 UK removed, 2 Canadian separated',
        agents: ['Vincent AI Agent', 'Immigration Counsel Agent', 'Jurisdiction Verification Agent', 'Client Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Vincent AI — Multi-Jurisdiction Governance',
        guaranteeBody: 'This cryptographic bundle seals the jurisdiction governance: 6 Vincent AI citations, jurisdiction verified (3 US binding, 1 UK removed, 2 Canadian separated as comparative), correct "well-founded fear" standard applied, immigration counsel sign-off. Asylum brief filed with correct US authority only.',
        evidenceChain: 'Vincent AI research → 6 citations → Jurisdiction check → Sivakumaran (UK) removed → Canadian cases separated → US standard confirmed → Brief corrected → Counsel sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Vincent AI + CendiaSupervision catches a UK case cited as US authority — preventing an asylum seeker from being judged under the wrong legal standard.',
      phaseLabels: ['Cross-Jurisdiction Confusion & Wrong Standard', 'Client Risk & Higher Threshold Applied', 'Jurisdiction Tagging & Correct Authority'],
    },

    {
      id: 'vincent-solo',
      title: 'Vincent AI — Solo Practitioner Without Safety Net',
      subtitle: 'No associates · No verification team · Personal injury · Wrong jurisdiction standard',
      banner: 'Simulating the solo practitioner trap: a solo PI attorney uses Vincent AI with no one to verify the output. The AI cites a neighbouring state\'s standard of care. The filing misapplies the standard. The solo has no associates, no verification infrastructure — only CendiaSupervision.',
      risk: 'High',
      scenarioNum: 'Solo',
      icon: 'user',
      color: 'text-blue-400',
      agents: [
        { id: 'vincent-solo', name: 'Vincent AI Agent', role: 'Solo Practice Research & Drafting', icon: '🤖', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'solo-atty', name: 'Solo Attorney Agent', role: 'General Practice & Case Management', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'state-check', name: 'State Law Verification Agent', role: 'Forum-Specific Standard Confirmation', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'malpractice-solo', name: 'Malpractice Risk Agent', role: 'Solo Practitioner Exposure Assessment', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Vincent AI', status: 'connected', type: 'Legal Research', icon: 'cpu', detail: 'PI research — neighbouring state case cited as forum state law' },
        { name: 'State Law Database', status: 'connected', type: 'Jurisdiction Verification', icon: 'database', detail: 'Forum: State A (modified comparative fault). Cited: State B (pure comparative)' },
        { name: 'Case File', status: 'connected', type: 'PI Litigation', icon: 'file-text', detail: 'Slip and fall — $340K in medical bills — contributory negligence defence raised' },
        { name: 'Malpractice Insurer', status: 'syncing', type: 'Solo Coverage', icon: 'shield', detail: 'Solo practitioner policy: $500K coverage, AI exclusion under review' },
      ],
      script: [
        { agentId: 'vincent-solo', phase: 'phase1', type: 'analysis', delay: 800, content: 'Vincent AI research complete for slip-and-fall personal injury case. Forum: State A. Issue: contributory negligence defence — defendant argues plaintiff was 60% at fault. Vincent AI analysis: "Under the applicable comparative fault standard, a plaintiff\'s recovery is reduced by their percentage of fault. A plaintiff who is 60% at fault may still recover 40% of damages." CRITICAL ERROR: Vincent AI cited State B\'s pure comparative fault standard. State A applies MODIFIED comparative fault with a 50% bar — a plaintiff who is MORE than 50% at fault recovers NOTHING. Under State A law, a 60% at-fault plaintiff gets $0. Under State B law (which the AI applied), a 60% at-fault plaintiff gets 40% of damages ($136K on $340K). The AI applied the WRONG state\'s rule. The difference: $136K recovery vs $0 recovery. If the solo attorney advises the client they\'ll recover $136K based on the AI analysis, and the court applies the correct standard resulting in $0, the client has a malpractice claim.' },
        { agentId: 'state-check', phase: 'phase1', type: 'warning', delay: 2500, content: 'STATE LAW VERIFICATION ALERT. CendiaSupervision forum-specific check: (1) Filed in: State A Superior Court. (2) State A comparative fault rule: MODIFIED comparative fault with 50% bar. Plaintiff must be LESS than or equal to 50% at fault to recover. At 60% fault: recovery BARRED. (3) Vincent AI cited: Johnson v. Metro Properties (State B Supreme Court, 2020) — State B uses PURE comparative fault. No bar regardless of plaintiff\'s fault percentage. (4) The case names are similar to State A cases (Johnson is a common party name in PI), and both states border each other — the AI\'s training data likely conflated the two states\' standards. (5) For a solo practitioner: this is the exact type of error that an associate at a large firm would catch during cite-checking. The solo has no associate. Vincent AI was supposed to be the verification layer — but without CendiaSupervision, it became the error source.' },
        { agentId: 'malpractice-solo', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Solo practitioner malpractice exposure: (1) If the attorney advises the client they have a $136K recovery and the client relies on that advice (rejecting a $80K settlement offer), then the court applies State A\'s 50% bar and awards $0: the client\'s malpractice claim is $80K (rejected settlement) to $136K (expected recovery). (2) Solo practitioner malpractice insurance: $500K policy, $50K deductible. The insurer will investigate whether AI was used and whether the attorney verified the AI output. (3) EMERGING TREND: malpractice insurers are adding "AI exclusion" riders — claims arising from unverified AI output may be excluded from coverage. If the solo\'s policy has this exclusion, the $136K claim is uninsured. (4) Bar disciplinary risk: Model Rule 1.1 (competence) requires understanding the applicable law of the forum. Applying a neighbouring state\'s standard is a competence failure regardless of whether AI caused it.' },
        { agentId: 'solo-atty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SOLO PRACTITIONER REALITY. I manage 35 active cases. I don\'t have associates. I don\'t have a research department. I use Vincent AI because I physically cannot spend 4 hours researching every case. The AI is my associate, my research department, and my cite-checker — all in one tool. When the AI gives me the wrong state\'s law, I have no backup. I am the filing attorney AND the only reviewer. ABA 512 says I must supervise AI "as I would supervise a junior associate." But I don\'t HAVE a junior associate to supervise — I have AI that I rely on precisely because I can\'t afford a junior associate. Without CendiaSupervision: I am using AI without a safety net. Every AI error becomes a filed error. My 35 cases each contain potential AI-generated mistakes that I cannot independently verify. With CendiaSupervision: I have the safety net. The forum-specific check catches the wrong state before I advise the client.' },
        { agentId: 'vincent-solo', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Vincent AI + CendiaSupervision Solo Practice Governance: (1) FORUM-SPECIFIC VERIFICATION: Every Vincent AI research output is verified against the FILING JURISDICTION\'s law. Citations from other states are flagged and separated. (2) STANDARD COMPARISON: When Vincent AI cites law from a neighbouring state, CendiaSupervision compares the standard: "State A: modified comparative fault (50% bar). State B citation: pure comparative fault (no bar). CONFLICT DETECTED." (3) SOLO-OPTIMISED WORKFLOW: One-click review — the solo attorney sees verified citations, flagged conflicts, and recommended corrections in a single dashboard. Designed for attorneys without research departments. (4) MALPRACTICE SHIELD: The verification documentation provides "reasonable supervision" evidence for malpractice insurers. The solo can prove they used AI WITH governance. (5) AFFORDABLE PRICING: vLex serves the mid-market. CendiaSupervision for solo/small firm must be priced for solo economics.' },
        { agentId: 'malpractice-solo', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The forum-specific verification catches the wrong state standard. The solo attorney advises the client correctly: "At 60% fault, State A\'s modified comparative fault bars your recovery. The $80K settlement offer is the best outcome." The client accepts. No malpractice claim. For vLex: Vincent AI + CendiaSupervision = AI governance for the 90% of attorneys who aren\'t at AmLaw firms. The solo practitioner market (150,000+ in the US alone) needs AI governance MORE than big firms because solos have LESS capacity for manual verification. CendiaSupervision is the second pair of eyes that every solo needs. "Vincent AI: now with built-in verification for solo practitioners" — that\'s the feature that transforms vLex from a research tool into a governed practice platform.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:vx30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'vx40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Vincent AI research + Forum verification + State standard comparison + Solo attorney sign-off)',
        complianceLabel: 'Forum Status',
        complianceValue: 'WRONG STATE LAW CAUGHT',
        complianceThreshold: 'State B (pure comparative) → State A (modified, 50% bar)',
        agents: ['Vincent AI Agent', 'Solo Attorney Agent', 'State Law Verification Agent', 'Malpractice Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Vincent AI — Solo Practitioner Safety Net',
        guaranteeBody: 'Forum-specific verification caught neighbouring state citation. State A modified comparative fault (50% bar) correctly identified vs State B pure comparative fault (no bar). Client advised correctly. Settlement accepted. Malpractice claim avoided.',
        evidenceChain: 'Vincent AI research → State B case cited → Forum check (State A) → Standard conflict detected → Attorney notified → Advice corrected → Client counselled → Settlement accepted → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Vincent AI + CendiaSupervision provides the safety net solo practitioners need — catching a wrong-state citation before it costs a client their recovery.',
      phaseLabels: ['Wrong State Standard & Solo Vulnerability', 'Malpractice Risk & Insurance Exclusion', 'Forum Verification & Solo Safety Net'],
    },

    {
      id: 'vincent-legal-aid',
      title: 'Vincent AI — Legal Aid Deployment at Scale',
      subtitle: '200 volunteer attorneys · Expired moratorium · 15 tenants given wrong advice',
      banner: 'Simulating the legal aid AI disaster: a legal aid organisation deploys Vincent AI to 200 volunteer attorneys handling housing cases. The AI generates eviction defence analysis citing a COVID-era moratorium that expired. 15 volunteer attorneys use the stale analysis. 15 tenants receive incorrect legal advice.',
      risk: 'High',
      scenarioNum: 'Aid',
      icon: 'heart',
      color: 'text-rose-400',
      agents: [
        { id: 'vincent-aid', name: 'Vincent AI Agent', role: 'Legal Aid Research at Scale', icon: '🤖', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'supervising-aid', name: 'Supervising Attorney Agent', role: 'Legal Aid Quality Control & Volunteer Oversight', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'regulatory-aid', name: 'Regulatory Currency Agent', role: 'Moratorium Status & Legislative Tracking', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'tenant-impact', name: 'Tenant Impact Agent', role: 'Client Harm Assessment & Remediation', icon: '🏠', color: 'text-rose-400', borderColor: 'border-rose-500/40', bgColor: 'bg-rose-500/10' },
      ],
      connectors: [
        { name: 'Vincent AI (Legal Aid)', status: 'connected', type: 'Batch Research', icon: 'cpu', detail: 'Eviction defence template generated — citing expired CDC moratorium' },
        { name: 'Legislative Tracker', status: 'connected', type: 'Regulatory Status', icon: 'check-circle', detail: 'CDC eviction moratorium: EXPIRED August 2021 (SCOTUS vacated)' },
        { name: 'Legal Aid Case Management', status: 'connected', type: 'Volunteer Deployment', icon: 'users', detail: '200 volunteers handling 800+ eviction cases — 15 used stale template' },
        { name: 'Tenant Hotline', status: 'syncing', type: 'Client Services', icon: 'phone', detail: '15 tenants advised they have moratorium protection — INCORRECT' },
      ],
      script: [
        { agentId: 'vincent-aid', phase: 'phase1', type: 'analysis', delay: 800, content: 'Vincent AI legal aid deployment: housing law template generated for volunteer attorneys handling eviction defence. The template includes a section: "Federal Moratorium Protection — The CDC eviction moratorium (published September 4, 2020) provides that tenants who submit a declaration to their landlord cannot be evicted for nonpayment of rent. Tenants should immediately submit the CDC declaration form." CRITICAL ERROR: The CDC eviction moratorium was vacated by the Supreme Court on August 26, 2021 (Alabama Association of Realtors v. HHS). The moratorium has been expired for over 4 years. Vincent AI generated the template from training data that included the moratorium without its expiration. The template was distributed to 200 volunteer attorneys. 15 volunteer attorneys used the moratorium section in their client advice before the error was detected. 15 tenants were told they have federal moratorium protection that does not exist. Those tenants may have declined to negotiate with landlords, relying on non-existent federal protection. Eviction proceedings continue while tenants believe they\'re protected.' },
        { agentId: 'regulatory-aid', phase: 'phase1', type: 'warning', delay: 2500, content: 'REGULATORY CURRENCY ALERT. CendiaSupervision legislative tracking: (1) CDC Eviction Moratorium: EXPIRED. Vacated by SCOTUS, August 26, 2021. No longer in effect at ANY level — federal, state, or local (the CDC order was the basis for most local moratoriums too). (2) State-level moratoriums: ALL expired. The last state moratorium (New York) expired January 15, 2022. (3) Local moratoriums: a handful of localities had extensions through 2022, all expired. (4) Current tenant protections: state-specific only — just cause eviction requirements, notice periods, rental assistance programmes. These are DIFFERENT from moratorium protection and require different legal strategies. (5) The 15 affected tenants need IMMEDIATE corrective advice: the moratorium defence will fail. Their attorneys must pivot to state-specific defences (notice deficiency, habitability, rental assistance). Every day of delay increases the risk of default judgments in the eviction proceedings.' },
        { agentId: 'tenant-impact', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Tenant harm assessment: (1) 15 tenants were told they have federal protection from eviction. They do not. (2) Some tenants may have stopped negotiating with landlords based on this advice. Negotiation window may have closed. (3) Some tenants may have skipped court dates believing the moratorium protects them. Default judgments may have been entered. (4) Eviction records — even for cases later dismissed — can follow tenants for years, affecting future housing applications. (5) The legal aid organisation\'s mission is to HELP vulnerable tenants. AI-generated stale legal advice does the opposite — it creates false hope, delays effective action, and may result in worse outcomes than no legal aid at all. (6) The volunteer attorneys — who donated their time in good faith — now face potential bar complaints for providing incorrect legal advice, even though the error was AI-generated.' },
        { agentId: 'supervising-aid', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SUPERVISING ATTORNEY OBLIGATION. As the legal aid organisation\'s supervising attorney, I am responsible for the quality of advice given by 200 volunteers. I deployed Vincent AI to help volunteers provide faster, more consistent advice. Instead, the AI distributed an error to 15 cases simultaneously. Without AI: if one volunteer gave wrong advice, it would affect 1 client. With unsupervised AI: one AI error propagates to every case that uses the template. The error-to-client ratio is 1:15, not 1:1. This is the SCALABILITY PROBLEM of legal AI in access-to-justice: AI errors scale faster than AI benefits. Without CendiaSupervision: the stale moratorium advice reached 15 clients before anyone caught it. With CendiaSupervision: the regulatory currency check catches the expired moratorium before the template is distributed. Zero clients receive stale advice.' },
        { agentId: 'vincent-aid', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Vincent AI + CendiaSupervision Legal Aid Governance: (1) REGULATORY CURRENCY CHECK: Every Vincent AI template is verified for regulatory currency — expired moratoriums, repealed statutes, superseded regulations. Stale law is blocked before distribution. (2) BATCH QC: When a template is distributed to multiple attorneys, CendiaSupervision runs batch quality control — verifying all legal assertions against current law BEFORE distribution, not after. (3) IMMEDIATE REMEDIATION: If a stale template is detected after distribution, CendiaSupervision identifies ALL cases that used the template and triggers remediation — updated template distributed, affected attorneys notified, corrective client communication generated. (4) VOLUNTEER PROTECTION: Each volunteer\'s use of the verified template is documented with CendiaSupervision seal — protecting volunteers from bar complaints by showing they used quality-controlled resources. (5) SUPERVISING ATTORNEY DASHBOARD: The supervising attorney sees real-time quality metrics across all 200 volunteers — template accuracy, currency status, case outcomes.' },
        { agentId: 'tenant-impact', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The batch QC prevents the moratorium error from reaching any client. For the 15 affected tenants: remediation protocol activates — corrective advice distributed, attorneys pivot to state-specific defences, court dates confirmed. For vLex: Vincent AI + CendiaSupervision = safe AI for access to justice. Legal aid organisations serve the most vulnerable clients — clients who cannot afford to receive wrong legal advice. AI that scales errors is worse than no AI. AI that scales VERIFIED advice transforms legal aid. "Vincent AI for Legal Aid: every template verified, every moratorium checked, every volunteer protected" — that\'s the mission-aligned feature that wins legal aid deployments and foundation grants.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:vx50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'vx60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Vincent AI template + Regulatory currency + Batch QC + Remediation + Supervising attorney sign-off)',
        complianceLabel: 'Legal Aid Status',
        complianceValue: 'EXPIRED MORATORIUM BLOCKED',
        complianceThreshold: 'CDC moratorium expired Aug 2021 — caught before distribution',
        agents: ['Vincent AI Agent', 'Supervising Attorney Agent', 'Regulatory Currency Agent', 'Tenant Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Vincent AI — Legal Aid Batch Quality Control',
        guaranteeBody: 'Regulatory currency check caught expired CDC eviction moratorium before template distribution to 200 volunteer attorneys. Zero clients received stale advice. Remediation protocol for 15 previously affected cases activated. Volunteer attorneys protected with documented QC.',
        evidenceChain: 'Vincent AI template → Regulatory check → CDC moratorium: EXPIRED (2021) → Template blocked → Corrected template generated → Batch QC passed → Distribution to 200 volunteers → Supervising attorney sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Vincent AI + CendiaSupervision prevents an expired moratorium from being distributed to 200 volunteer attorneys — protecting vulnerable tenants from stale legal advice.',
      phaseLabels: ['Expired Moratorium & Batch Error', 'Tenant Harm & Scalability Problem', 'Batch QC & Regulatory Currency'],
    },
  ],
};

export default config;
