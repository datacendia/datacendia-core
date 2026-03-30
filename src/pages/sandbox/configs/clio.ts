/**
 * Clio Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for solo/small firm AI governance.
 * Access: /sandbox/clio (Key: CL-91)
 *
 * @module pages/sandbox/configs/clio
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Clio',
  accessKey: 'CL-91',
  sessionKey: 'clio-sandbox-unlocked',

  accent: 'cyan',
  accentColor: 'text-cyan-400',
  accentHover: 'from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600',
  ringColor: 'focus:ring-cyan-500/30',
  borderColor: 'border-cyan-500/30',
  gradientFrom: 'from-cyan-600/20',
  gradientTo: 'to-cyan-900/20',

  footerNote: '50 regulatory scenarios mapped for Clio × Datacendia · Full architecture document available on request',

  scenarios: [
    {
      id: 'clio-duo-solo',
      title: 'Clio Duo — Solo Practitioner Statute Amendment',
      subtitle: 'Family law · Child support modification · Amended statute · Wrong standard argued',
      banner: 'Simulating the solo practitioner nightmare: a solo family law attorney uses Clio Duo to research child support modification standards. The AI cites the state statute — but the statute was amended 6 months ago, changing the modification threshold. The attorney files a motion arguing the old standard. Court denies it.',
      risk: 'Critical',
      scenarioNum: 'Solo',
      icon: 'user',
      color: 'text-cyan-400',
      agents: [
        { id: 'clio-ai', name: 'Clio Duo Agent', role: 'Solo Practice Research & Case Analysis', icon: '🤖', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'solo-atty-cl', name: 'Solo Attorney Agent', role: 'Family Law Practice & Court Filings', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'statute-check', name: 'Statutory Currency Agent', role: 'Amendment Detection & Legislative Tracking', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'malpractice-cl', name: 'Malpractice Risk Agent', role: 'Solo Practitioner Exposure & Bar Compliance', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Clio Duo', status: 'connected', type: 'Practice AI', icon: 'cpu', detail: 'Child support research — citing pre-amendment statute' },
        { name: 'Legislative Database', status: 'connected', type: 'Statutory Currency', icon: 'database', detail: 'State statute amended 6 months ago — threshold changed' },
        { name: 'Court Filing System', status: 'connected', type: 'Family Court', icon: 'file-text', detail: 'Modification motion due in 14 days' },
        { name: 'Malpractice Insurer', status: 'syncing', type: 'Solo Coverage', icon: 'shield', detail: '$500K policy — AI exclusion clause under review' },
      ],
      script: [
        { agentId: 'clio-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Clio Duo research complete for child support modification motion. State Family Code Section 4057 analysis: "To modify child support, the moving party must demonstrate a material change in circumstances since the last order. Courts consider changes in income, employment status, and the needs of the child." CRITICAL ERROR: State Family Code Section 4057 was amended effective January 1, 2026. The amendment changed the modification standard from "material change in circumstances" to "substantial change in circumstances" — a higher threshold. The amendment also added specific factors: (1) minimum 20% income change required (previously no minimum), (2) documentation of changed circumstances for at least 6 months (previously no duration requirement), and (3) mandatory mediation before modification hearing (previously optional). Clio Duo cited the pre-amendment version. The solo attorney\'s motion will argue the old "material change" standard with none of the new procedural requirements. The court will deny the motion on threshold grounds.' },
        { agentId: 'statute-check', phase: 'phase1', type: 'warning', delay: 2500, content: 'STATUTORY CURRENCY ALERT. CendiaSupervision legislative tracking: (1) Family Code §4057: AMENDED effective January 1, 2026. Key changes: "material change" replaced with "substantial change." New 20% income threshold. 6-month documentation requirement. Mandatory mediation. (2) The amendment was part of a broader family law reform package (SB 1247) that also amended custody modification standards and spousal support calculation. Clio Duo did not flag any of these amendments. (3) The solo attorney\'s client: income decreased 15% (below the new 20% threshold). Under the OLD standard: 15% decrease might qualify as "material change." Under the NEW standard: 15% decrease does NOT meet the 20% threshold — motion fails on its face. (4) Even if the income met the threshold: the motion doesn\'t include the mandatory mediation certificate required by the amended statute. The court will reject the filing for procedural noncompliance.' },
        { agentId: 'malpractice-cl', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Solo practitioner exposure: (1) The motion is denied. The client paid $2,800 in legal fees for a motion that could not succeed under the amended statute. (2) The client missed the opportunity to pursue mediation first (as now required), which might have resolved the support issue without court involvement. (3) Malpractice exposure: the attorney filed a motion under a repealed legal standard. Model Rule 1.1 (competence) requires knowledge of current law. The amendment was 6 months old — a competent family law attorney should know about it. (4) Bar disciplinary risk: arguing a repealed standard to the court may violate Model Rule 3.3 (candor to the tribunal) if the court finds the attorney should have known the statute was amended. (5) Malpractice insurer: the claim is $2,800 (fees) + potential consequential damages (delayed support modification). Small claim, but the insurer\'s AI exclusion rider may apply — if the error was AI-generated and unverified, coverage may be denied. The solo pays out of pocket.' },
        { agentId: 'solo-atty-cl', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SOLO PRACTITIONER REALITY. I handle 40 active cases across family law, estate planning, and general civil. I cannot monitor every legislative amendment in every practice area. I subscribed to Clio Duo specifically because I need an AI assistant that keeps me current. When Clio Duo tells me §4057 says "material change," I trust it. I don\'t have a research department to verify. I don\'t have associates. I AM the firm. ABA Opinion 512 says I must supervise AI as I would a junior associate. But I don\'t have a junior associate. Clio Duo IS my junior associate. And my junior associate just gave me repealed law. Without CendiaSupervision: I file the motion, it\'s denied, I look incompetent, client is harmed, malpractice risk. With CendiaSupervision: the statutory currency check catches the amendment. I restructure the strategy: pursue mediation first (as required), document the income change for 6 months (as required), then file under the correct standard.' },
        { agentId: 'clio-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Clio Duo + CendiaSupervision Solo Practice Governance: (1) STATUTORY CURRENCY CHECK: Every Clio Duo statute citation is verified against the current legislative database. Amendments within the last 24 months are flagged with change summaries. Repealed or amended provisions are blocked from entering work product. (2) PROCEDURAL REQUIREMENT ALERTS: When a statute has been amended to add new procedural requirements (mediation, documentation periods, filing prerequisites), Clio Duo surfaces these requirements as actionable checklist items. (3) PRACTICE AREA UPDATES: Monthly digest of legislative changes affecting the solo\'s active practice areas — family law, estate planning, civil litigation. Targeted, not generic. (4) SOLO-OPTIMISED WORKFLOW: One-click verification — the solo sees current statute, amendment highlights, and procedural checklist in a single dashboard before drafting. (5) MALPRACTICE SHIELD: CendiaSupervision documentation provides "reasonable supervision" evidence. The solo can prove they used AI WITH governance — the malpractice insurer sees verified, sealed research.' },
        { agentId: 'malpractice-cl', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The statutory currency check catches the amendment. The solo attorney restructures: (1) Initiate mediation (new requirement). (2) Document income change for 6 months (new threshold). (3) File modification motion under "substantial change" standard with mediation certificate. The client gets the correct legal strategy. No wasted motion. No malpractice risk. For Clio: Clio Duo + CendiaSupervision = AI governance for 150,000+ solo and small firm practitioners. These attorneys need governance MORE than big firms because they have LESS capacity for manual verification. CendiaSupervision is the second pair of eyes every solo needs. "Clio Duo: now with built-in statutory verification" — the feature that transforms Clio from a practice tool into a governed practice platform.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cl10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cl20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Clio Duo research + Statutory currency + Amendment detection + Solo attorney sign-off)',
        complianceLabel: 'Statutory Status',
        complianceValue: 'AMENDED STATUTE CAUGHT',
        complianceThreshold: '§4057 amended Jan 2026 — old standard blocked',
        agents: ['Clio Duo Agent', 'Solo Attorney Agent', 'Statutory Currency Agent', 'Malpractice Risk Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Clio Duo — Solo Practitioner Statutory Governance',
        guaranteeBody: 'Statutory currency check caught Family Code §4057 amendment (6 months old). Old "material change" standard blocked. New "substantial change" standard with 20% threshold, 6-month documentation, and mandatory mediation surfaced. Solo attorney strategy corrected. Malpractice risk eliminated.',
        evidenceChain: 'Clio Duo research → §4057 cited → Currency check → Amendment detected (SB 1247) → Old standard blocked → New requirements surfaced → Strategy corrected → Solo sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Clio Duo + CendiaSupervision catches an amended statute before a solo practitioner files a motion under repealed law.',
      phaseLabels: ['Stale Statute & Solo Vulnerability', 'Malpractice Risk & Bar Exposure', 'Statutory Currency & Practice Governance'],
    },

    {
      id: 'clio-trust-account',
      title: 'Clio — Trust Account Misclassification',
      subtitle: 'IOLTA · Commingling · Bar audit · 3-month undetected deficiency',
      banner: 'Simulating the trust account nightmare: Clio\'s practice management AI misclassifies a client payment, allocating trust funds to the operating account. The error goes undetected for 3 months. Bar audit reveals the deficiency. The attorney faces disciplinary proceedings for commingling.',
      risk: 'Critical',
      scenarioNum: 'Trust',
      icon: 'credit-card',
      color: 'text-red-400',
      agents: [
        { id: 'clio-trust', name: 'Clio Manage Agent', role: 'Practice Management & Financial Classification', icon: '💼', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'trust-atty', name: 'Solo Attorney Agent', role: 'Trust Account Stewardship & IOLTA Compliance', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'reconciliation', name: 'Reconciliation Agent', role: 'Trust/Operating Separation Verification', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'bar-audit', name: 'Bar Audit Agent', role: 'Disciplinary Standards & Trust Account Rules', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Clio Manage', status: 'connected', type: 'Practice Management', icon: 'cpu', detail: 'Client payment $8,500 — classified as earned fee (operating)' },
        { name: 'Trust Account', status: 'connected', type: 'IOLTA', icon: 'lock', detail: 'Trust balance should be $8,500 higher — deficiency undetected 3 months' },
        { name: 'Operating Account', status: 'connected', type: 'Firm Revenue', icon: 'dollar-sign', detail: '$8,500 deposited to operating — should be in trust' },
        { name: 'State Bar Portal', status: 'syncing', type: 'Random Audit', icon: 'shield', detail: 'Random trust account audit scheduled — deficiency will be found' },
      ],
      script: [
        { agentId: 'clio-trust', phase: 'phase1', type: 'analysis', delay: 800, content: 'Clio Manage financial event: Client retainer payment received — $8,500 from Johnson Estate matter. Clio AI classification: EARNED FEE — deposited to operating account. CRITICAL ERROR: The $8,500 is an ADVANCE RETAINER — unearned funds that must be held in the client trust (IOLTA) account until earned through billable work. Clio\'s AI misclassified it because: (1) The payment amount ($8,500) matches the flat fee quote for the estate matter. (2) The payment memo said "Estate Planning Fee" — suggesting earned fee. (3) However, the engagement letter specifies the payment as an "advance retainer to be billed against hourly work" — NOT a flat fee. The AI read the payment memo, not the engagement letter. Result: $8,500 in client funds deposited to the operating account instead of trust. The attorney spent $3,200 of the operating balance (not from this payment specifically, but from the commingled pool). The trust account is now $8,500 short of what it should hold for the Johnson Estate matter.' },
        { agentId: 'reconciliation', phase: 'phase1', type: 'warning', delay: 2500, content: 'RECONCILIATION ALERT. CendiaSupervision trust account verification: (1) Monthly trust reconciliation check: Johnson Estate matter — engagement letter specifies "advance retainer, billable hourly." Payment of $8,500 should be in trust. Trust account balance for this matter: $0. Operating account received $8,500. MISMATCH DETECTED. (2) This error occurred 3 months ago. In the interim: the attorney billed 4 hours against the retainer ($1,400 at $350/hr) — but billed against operating, not trust. The trust transfer never happened because the funds were never in trust. (3) Net trust deficiency: $8,500 (should be in trust) minus $1,400 (properly earned) = $7,100 in client funds that should be in trust but are in operating. (4) If this had been caught immediately: a simple transfer from operating to trust would fix it. After 3 months: the commingling has been ongoing for 3 months. A bar auditor will see a 3-month pattern, not a one-time error.' },
        { agentId: 'bar-audit', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Bar disciplinary analysis: (1) Model Rule 1.15: "A lawyer shall hold property of clients separate from the lawyer\'s own property." The $8,500 advance retainer is CLIENT property until earned. Depositing it to operating is commingling — a per se violation. (2) State trust account rules typically require: (a) All client funds deposited to IOLTA within 24 hours of receipt. (b) Monthly three-way reconciliation (bank, book, client ledger). (c) No commingling of earned and unearned fees. (3) The 3-month duration aggravates the violation. A same-day correction is a bookkeeping error. 3 months of commingling suggests systemic failure in trust account management. (4) Bar random audit consequence: the auditor will find the deficiency, review 12 months of transactions, and may find additional misclassifications. If Clio\'s AI has made similar errors for other clients: the pattern becomes willful disregard. (5) Sanctions range: private reprimand (first offense, corrected) to suspension (pattern of commingling). Trust account violations are among the most common grounds for attorney discipline.' },
        { agentId: 'trust-atty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SOLO ATTORNEY TRUST OBLIGATION. Trust account management is the #1 disciplinary risk for solo practitioners. I use Clio Manage specifically to track trust funds. When Clio classifies a payment as "earned fee," I deposit it to operating. I trust the classification because I can\'t independently review every payment classification across 40 matters — that\'s why I use practice management software. My monthly reconciliation: I compare the Clio trust balance to the bank statement. But if Clio\'s balance is WRONG (because the classification was wrong), the reconciliation shows "balanced" when it\'s actually deficient. The reconciliation only catches errors if the underlying data is correct. Without CendiaSupervision: the error is invisible until the bar audit. My reconciliation shows "balanced" because Clio\'s trust ledger doesn\'t include the Johnson $8,500. With CendiaSupervision: the payment-to-engagement-letter cross-check catches the misclassification within 24 hours.' },
        { agentId: 'clio-trust', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Clio Manage + CendiaSupervision Trust Account Governance: (1) ENGAGEMENT LETTER CROSS-CHECK: Every payment classification is verified against the engagement letter. "Advance retainer" in the engagement letter + "earned fee" classification = CONFLICT ALERT. The attorney is notified before deposit. (2) TRUST/OPERATING HARD-STOP: CendiaSupervision requires attorney confirmation for every payment deposited to operating instead of trust. No automatic classification overrides for trust-eligible payments. (3) REAL-TIME RECONCILIATION: Instead of monthly reconciliation, CendiaSupervision runs continuous trust balance verification — every deposit and withdrawal is checked against the client ledger in real time. (4) BAR AUDIT READINESS: CendiaSupervision generates a "Trust Account Compliance Certificate" monthly — documenting all classifications, cross-checks, and attorney confirmations. The bar auditor sees a governed system, not just a practice management tool. (5) PATTERN DETECTION: If Clio\'s AI misclassifies trust payments for one client, CendiaSupervision checks all other clients for similar patterns — catching systemic errors before the bar audit does.' },
        { agentId: 'bar-audit', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The engagement letter cross-check catches the misclassification within 24 hours. The $8,500 is deposited to trust. The reconciliation is accurate. The bar audit finds a governed trust account system with documented classification, cross-checks, and attorney confirmations. For Clio: Clio Manage + CendiaSupervision = trust account governance for 150,000+ practitioners. Trust account violations are the #1 disciplinary action for solos. CendiaSupervision eliminates the classification errors that cause commingling. "Clio Manage: trust account classifications verified against engagement letters" — the feature that keeps solo practitioners licensed and their clients\' funds safe.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cl30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cl40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Clio classification + Engagement letter cross-check + Trust verification + Attorney sign-off)',
        complianceLabel: 'Trust Status',
        complianceValue: 'MISCLASSIFICATION CAUGHT',
        complianceThreshold: 'Advance retainer → trust, not operating',
        agents: ['Clio Manage Agent', 'Solo Attorney Agent', 'Reconciliation Agent', 'Bar Audit Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Clio Manage — Trust Account Governance',
        guaranteeBody: 'Payment classification cross-checked against engagement letter. "Advance retainer" vs "earned fee" conflict detected. $8,500 correctly deposited to trust. Commingling prevented. Bar audit readiness documented. Model Rule 1.15 satisfied.',
        evidenceChain: 'Clio payment ($8,500) → AI classification (earned) → Engagement letter check (advance retainer) → CONFLICT → Reclassified to trust → Attorney confirmed → Trust deposit → Reconciliation verified → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Clio + CendiaSupervision catches a trust account misclassification before it becomes a 3-month commingling violation.',
      phaseLabels: ['AI Misclassification & Trust Deficiency', 'Bar Audit & Disciplinary Risk', 'Engagement Letter Cross-Check & Trust Governance'],
    },

    // SCENARIO 3 — CLIO DUO: CONFLICT CHECK FAILURE
    {
      id: 'clio-conflict',
      title: 'Clio Duo — Conflict Check Name Variation Miss',
      subtitle: 'Robert J. Smith vs R. James Smith · Same person · Conflicted matter accepted · DQ motion',
      banner: 'Simulating the solo practitioner conflict crisis: Clio\'s AI-powered conflict check scans 5,000 client records. The AI misses a conflict because the adverse party\'s name appears with a variation — "Robert J. Smith" in the new matter vs "R. James Smith" in an existing client file. Same person. The firm takes on a conflicted matter.',
      risk: 'Critical',
      scenarioNum: 'Conflict',
      icon: 'users',
      color: 'text-red-400',
      agents: [
        { id: 'clio-conflict', name: 'Clio Manage Agent', role: 'Conflict Check & Client Database', icon: '🤖', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'intake-atty', name: 'Intake Attorney Agent', role: 'New Matter Acceptance & Screening', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'fuzzy-match', name: 'Name Resolution Agent', role: 'Fuzzy Matching & Identity Verification', icon: '🔍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'dq-risk', name: 'Disqualification Agent', role: 'Model Rules 1.7-1.10 & DQ Motion Risk', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Clio Manage', status: 'connected', type: 'Conflict Check', icon: 'search', detail: 'New matter: "Robert J. Smith" — no conflict found' },
        { name: 'Client Database', status: 'connected', type: 'Existing Records', icon: 'database', detail: 'Existing client: "R. James Smith" — same person, different name format' },
        { name: 'Name Resolution', status: 'connected', type: 'Fuzzy Matching', icon: 'user-check', detail: 'Robert J. = R. James — middle name/initial swap not detected' },
        { name: 'DQ Motion', status: 'syncing', type: 'Disqualification', icon: 'alert-triangle', detail: 'Opposing counsel discovers conflict — DQ motion filed' },
      ],
      script: [
        { agentId: 'clio-conflict', phase: 'phase1', type: 'analysis', delay: 800, content: 'Clio Manage conflict check for new matter: Martinez v. Robert J. Smith (employment discrimination). Conflict search run against 5,000 client records. Search term: "Robert J. Smith." Results: NO CONFLICT FOUND. CRITICAL ERROR: The existing client database contains "R. James Smith" — the SAME person. R. James Smith is a current client in an unrelated business matter. The name variation: "Robert J. Smith" = first name + middle initial. "R. James Smith" = first initial + middle name. These are the same person — Robert James Smith. Clio\'s conflict search uses exact string matching with basic variations (Bob/Robert, Bill/William). It does NOT catch the first-name-to-initial + middle-initial-to-middle-name swap. The firm now represents Martinez AGAINST its own current client R. James Smith. This is a direct conflict under Model Rule 1.7(a)(1) — the firm represents one client in a matter directly adverse to another current client.' },
        { agentId: 'fuzzy-match', phase: 'phase1', type: 'warning', delay: 2500, content: 'NAME RESOLUTION ALERT. CendiaSupervision identity matching analysis: (1) "Robert J. Smith" vs "R. James Smith" — standard conflict check sees these as different people. (2) CendiaSupervision enhanced matching: First name: Robert vs R. — "R." could be Robert, Richard, Raymond, etc. POSSIBLE MATCH. Middle: J. vs James — "J." could be James, John, Joseph, etc. POSSIBLE MATCH. Combined: Robert James Smith vs R. James Smith — HIGH PROBABILITY MATCH. (3) Additional verification: both records share the same city (Portland, OR), same phone area code (503), and overlapping date ranges. Probability of being the same person: 94%. (4) The conflict check should have flagged this as a POTENTIAL CONFLICT requiring manual verification — not cleared it as "no conflict." (5) For solo/small firms: this is the most common conflict miss. Clients provide their names differently on different matters. The AI must account for name variations beyond simple nicknames.' },
        { agentId: 'dq-risk', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Disqualification analysis: (1) Model Rule 1.7(a)(1): "A lawyer shall not represent a client if the representation involves a concurrent conflict of interest" — specifically, "the representation of one client will be directly adverse to another client." Martinez v. R. James Smith is directly adverse to the firm\'s current client R. James Smith. (2) The conflict is NON-CONSENTABLE if the two matters are related or if the firm possesses confidential information from R. James Smith that is relevant to Martinez\'s case. Employment discrimination against R. James Smith + business advisory for R. James Smith = the firm likely has confidential business information that could be relevant. (3) Opposing counsel (R. James Smith\'s counsel in the employment case) will discover the firm also represents R. James Smith in business matters. DQ motion filed immediately. (4) DQ consequences: the firm is removed from Martinez\'s case mid-litigation. Martinez must find new counsel. The firm loses the fee. The firm may face malpractice and bar discipline. (5) R. James Smith may also fire the firm from the business matter — losing both clients.' },
        { agentId: 'intake-atty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — INTAKE ATTORNEY. I ran the conflict check. Clio said "no conflict." I accepted the matter. I did NOT independently verify whether "Robert J. Smith" might be an existing client under a name variation. For a solo practitioner with 5,000 client records: I cannot manually check every name variation. That\'s why I use Clio\'s conflict check. ABA Opinion 512: I must supervise AI as I would a junior associate. If a junior associate ran a conflict check and said "clear" — I would trust them unless I had reason to doubt. Clio gave me no reason to doubt. Without CendiaSupervision: the conflict is discovered by opposing counsel. DQ motion. Lost fee. Lost clients. Bar complaint. With CendiaSupervision: the enhanced name matching flags "Robert J. Smith / R. James Smith" as a 94% probability match. I verify. Conflict confirmed. Matter declined. Both clients retained.' },
        { agentId: 'clio-conflict', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Clio Manage + CendiaSupervision Conflict Governance: (1) ENHANCED NAME MATCHING: CendiaSupervision uses fuzzy matching that accounts for: first-name/initial swaps, middle-name/initial swaps, nickname variations, hyphenated name variations, and maiden/married name changes. (2) PROBABILITY SCORING: Instead of binary "conflict/no conflict," matches receive a probability score. Above 90%: CONFLICT — manual verification required. 70-90%: POSSIBLE CONFLICT — attorney review. Below 70%: cleared with documentation. (3) MULTI-FIELD VERIFICATION: Name matches are cross-verified against: phone number, email, address, employer, and matter date ranges. Multiple field matches increase the probability score. (4) CONFLICT LOG: Every conflict check is logged with: search terms, matches found, probability scores, and attorney decision. Evidence for bar discipline defence. (5) MATTER ACCEPTANCE GATE: New matters cannot be opened until the conflict check is completed AND the attorney has signed off on any potential matches above 70%.' },
        { agentId: 'dq-risk', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The enhanced name matching catches the 94% probability match. The attorney verifies: Robert J. Smith = R. James Smith = same person. Matter declined. Both client relationships preserved. No DQ motion. No bar complaint. For Clio: Clio Manage + CendiaSupervision = conflict governance for 150,000+ practitioners. Name variation conflicts are the #1 conflict miss for solo/small firms. CendiaSupervision\'s fuzzy matching catches what exact-string matching misses. "Clio Manage: conflict checks with identity resolution" — the feature that keeps solo practitioners out of DQ motions and bar complaints.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cl50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cl60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Clio conflict check + Enhanced matching + Probability scoring + Attorney sign-off)',
        complianceLabel: 'Conflict Status',
        complianceValue: '94% MATCH — CONFLICT CONFIRMED',
        complianceThreshold: 'Robert J. Smith = R. James Smith (same person)',
        agents: ['Clio Manage Agent', 'Intake Attorney Agent', 'Name Resolution Agent', 'Disqualification Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Clio Manage — Conflict Check Governance',
        guaranteeBody: 'Enhanced name matching detected 94% probability match: "Robert J. Smith" (new matter) = "R. James Smith" (existing client). Conflict confirmed by attorney. Matter declined. Model Rule 1.7 satisfied. Both client relationships preserved.',
        evidenceChain: 'Clio search ("Robert J. Smith") → Enhanced matching → "R. James Smith" (94%) → Multi-field verification (city, phone) → Attorney review → Conflict confirmed → Matter declined → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Clio + CendiaSupervision catches a name-variation conflict that exact-string matching missed — preventing a DQ motion and bar complaint.',
      phaseLabels: ['Name Variation & Exact Match Failure', 'DQ Motion & Bar Discipline Risk', 'Enhanced Matching & Identity Resolution'],
    },

    // SCENARIO 4 — CLIO DUO: IMMIGRATION DEADLINE ERROR
    {
      id: 'clio-immigration',
      title: 'Clio Duo — Voluntary Departure Deadline Error',
      subtitle: 'IJ order: 30 days · Clio Duo: 60 days · Client misses deadline · 10-year re-entry bar',
      banner: 'Simulating the immigration deadline nightmare: a solo immigration attorney manages 80 active cases using Clio Duo. The AI misidentifies a voluntary departure deadline as 60 days when the immigration judge ordered 30 days. The client misses the deadline. Automatic removal order. 10-year re-entry bar.',
      risk: 'Critical',
      scenarioNum: 'Immig',
      icon: 'clock',
      color: 'text-red-400',
      agents: [
        { id: 'clio-immig', name: 'Clio Duo Agent', role: 'Immigration Case Management & Deadlines', icon: '🤖', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'immig-atty', name: 'Immigration Attorney Agent', role: 'Solo Practice & INA Compliance', icon: '👤', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'deadline-verify', name: 'Deadline Verification Agent', role: 'Order Cross-Check & Calendar Accuracy', icon: '📅', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'immig-consequence', name: 'Consequence Agent', role: 'Removal Orders & Re-Entry Bars', icon: '⚠️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Clio Duo', status: 'connected', type: 'Case Management', icon: 'cpu', detail: 'Voluntary departure deadline: 60 days (WRONG — IJ ordered 30 days)' },
        { name: 'IJ Order', status: 'connected', type: 'Immigration Court', icon: 'file-text', detail: 'Order grants voluntary departure: 30 days from date of order' },
        { name: 'Deadline Calendar', status: 'connected', type: 'Case Deadlines', icon: 'calendar', detail: 'Calendar shows departure date 30 days late — client will miss deadline' },
        { name: 'Removal Consequences', status: 'syncing', type: 'INA Penalties', icon: 'alert-triangle', detail: 'Missed VD: automatic removal order + 10-year re-entry bar under INA §240B(d)' },
      ],
      script: [
        { agentId: 'clio-immig', phase: 'phase1', type: 'analysis', delay: 800, content: 'Clio Duo case management for immigration matter: In re Garcia-Torres. Case status: voluntary departure granted by Immigration Judge. Clio Duo deadline calculation: "Voluntary departure period: 60 days from the date of the IJ\'s order (standard statutory maximum under INA §240B(b))." Calendar entry created: departure deadline = order date + 60 days. CRITICAL ERROR: INA §240B(b) provides a MAXIMUM of 60 days for voluntary departure granted at the conclusion of proceedings. However, the Immigration Judge may order a SHORTER period. The IJ\'s order in this case states: "Respondent is granted voluntary departure for a period of THIRTY (30) days from the date of this order." The IJ ordered 30 days, not 60. Clio Duo applied the statutory maximum instead of reading the actual order. The calendar deadline is 30 days late. If the client relies on the Clio Duo deadline: they will still be in the US on day 31 — the voluntary departure period has expired. Under INA §240B(d): failure to depart within the voluntary departure period results in: (1) automatic conversion to a removal order, (2) a civil penalty of $1,000-$5,000, and (3) a 10-YEAR BAR on eligibility for cancellation of removal, adjustment of status, change of status, and voluntary departure.' },
        { agentId: 'deadline-verify', phase: 'phase1', type: 'warning', delay: 2500, content: 'DEADLINE VERIFICATION ALERT. CendiaSupervision order cross-check: (1) The IJ order explicitly states "30 days." Clio Duo used the statutory maximum (60 days) without reading the actual order. This is the most dangerous type of AI error in immigration: the AI knows the law but doesn\'t read the specific order. (2) The 30-day vs 60-day difference: the client is making arrangements to depart (selling property, withdrawing children from school, booking flights). Based on the 60-day deadline, these arrangements are paced for departure on day 55-60. At day 30: the client hasn\'t departed. The voluntary departure period has expired. The arrangements continue but are now futile — the client is subject to a removal order. (3) The attorney won\'t discover the error until: (a) the government moves to execute the removal order, or (b) the client attempts future immigration relief and is told about the 10-year bar. Either way: too late. (4) This cannot be undone. There is no motion to reopen a missed voluntary departure deadline. The consequences are permanent.' },
        { agentId: 'immig-consequence', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The consequences are catastrophic and irreversible: (1) Mr. Garcia-Torres is a 42-year-old father of 3 US-citizen children. He has been in the US for 18 years. He was granted voluntary departure specifically to preserve his ability to apply for a visa from abroad — a path back to his family. (2) If he misses the 30-day deadline: the automatic removal order triggers a 10-year re-entry bar. He cannot apply for any immigration benefit for 10 years. His US-citizen children grow up without their father for a DECADE. (3) The malpractice exposure: a missed immigration deadline that causes permanent family separation is among the highest-damage malpractice claims in immigration law. Damages: lost earnings for the family, emotional distress, loss of consortium. (4) The solo attorney\'s malpractice insurance: $500K policy with a potential AI exclusion. If the insurer denies coverage because the error was AI-generated: the attorney pays personally. (5) Bar discipline: Model Rule 1.1 (competence) + 1.3 (diligence). Missing a deadline that the AI told you was 30 days later than reality.' },
        { agentId: 'immig-atty', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SOLO IMMIGRATION ATTORNEY. I manage 80 active immigration cases. Each case has multiple deadlines — filing deadlines, hearing dates, voluntary departure periods, work authorization expirations. I entered the IJ order into Clio and let the AI calculate the deadline. I did NOT independently verify the deadline against the order because Clio\'s deadline calculation has been reliable for 79 other cases. The one time it\'s wrong: it\'s wrong in the way that destroys a family. ABA 512 says I must supervise the AI. For 80 cases with multiple deadlines each: that\'s 200+ deadline calculations I need to verify. I don\'t have time to verify each one. That\'s why I use Clio. Without CendiaSupervision: I trust the 60-day deadline. Mr. Garcia-Torres misses the 30-day window. 10-year bar. Family separation. Malpractice. Bar discipline. With CendiaSupervision: the order cross-check catches the discrepancy. The calendar is corrected to 30 days. Mr. Garcia-Torres departs on time. His path to return is preserved.' },
        { agentId: 'clio-immig', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Clio Duo + CendiaSupervision Immigration Deadline Governance: (1) ORDER CROSS-CHECK: Every deadline calculated by Clio Duo is verified against the ACTUAL court order. If the AI calculates a statutory default but the order specifies a different period: the ORDER controls, and the attorney is alerted to the discrepancy. (2) CRITICAL DEADLINE FLAG: Immigration deadlines with irreversible consequences (voluntary departure, asylum filing, NTA response) are flagged as CRITICAL — requiring attorney confirmation before calendar entry is finalized. (3) MULTI-ALERT SEQUENCE: For critical deadlines, CendiaSupervision sends alerts at: 75%, 50%, and 25% of the remaining time. For a 30-day VD: alerts at day 8, day 15, and day 23. (4) CONSEQUENCE DOCUMENTATION: Each deadline entry includes a summary of consequences for missing it: "Missed VD: automatic removal + 10-year bar under INA §240B(d)." The attorney sees the stakes every time they view the deadline. (5) VERIFICATION SIGN-OFF: The attorney must sign off on each critical deadline after reviewing the actual order. The sign-off is sealed — evidence for malpractice defence.' },
        { agentId: 'immig-consequence', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The order cross-check catches the 60-day vs 30-day discrepancy. The calendar is corrected. Mr. Garcia-Torres departs on day 28 — within the 30-day period. His voluntary departure is valid. His path to apply for a visa from abroad is preserved. His family remains intact. For Clio: Clio Duo + CendiaSupervision = immigration deadline governance for solo practitioners. Immigration deadlines are among the most consequential in all of law — missed deadlines cause permanent family separation, deportation, and re-entry bars. CendiaSupervision is the safety net that solo immigration attorneys need. "Clio Duo: immigration deadlines verified against court orders" — the feature that saves families and keeps immigration attorneys licensed.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cl70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'cl80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Clio deadline + Order cross-check + Critical flag + Attorney sign-off)',
        complianceLabel: 'Deadline Status',
        complianceValue: '30-DAY ORDER CAUGHT (NOT 60)',
        complianceThreshold: 'IJ order: 30 days. Clio default: 60 days. Corrected.',
        agents: ['Clio Duo Agent', 'Immigration Attorney Agent', 'Deadline Verification Agent', 'Consequence Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Clio Duo — Immigration Deadline Governance',
        guaranteeBody: 'Voluntary departure deadline verified against IJ order: 30 days (not 60-day statutory default). Calendar corrected. Client departed on day 28. No removal order. No 10-year bar. Family preserved. INA §240B compliance documented.',
        evidenceChain: 'Clio Duo (60 days) → Order cross-check → IJ: 30 days → Discrepancy flagged → Calendar corrected → Multi-alert sequence → Client departs day 28 → VD valid → Attorney sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Clio Duo + CendiaSupervision catches a 30-day voluntary departure deadline that the AI calculated as 60 days — preventing permanent family separation.',
      phaseLabels: ['Statutory Default vs Actual Order', '10-Year Bar & Family Separation', 'Order Cross-Check & Critical Deadline Governance'],
    },
  ],
};

export default config;
