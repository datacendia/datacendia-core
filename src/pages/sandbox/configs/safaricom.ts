/**
 * Safaricom Sandbox Config
 * Access: /sandbox/safaricom (Key: SC-76)
 * @module pages/sandbox/configs/safaricom
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Safaricom',
  accessKey: 'SC-76',
  sessionKey: 'safaricom-sandbox-unlocked',
  accent: 'green',
  accentColor: 'text-green-400',
  accentHover: 'from-green-600 to-green-700 hover:from-green-500 hover:to-green-600',
  ringColor: 'focus:ring-green-500/30',
  borderColor: 'border-green-500/30',
  gradientFrom: 'from-green-600/20',
  gradientTo: 'to-green-900/20',
  footerNote: 'Safaricom AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Safaricom systems or incidents.',

  scenarios: [
    // SCENARIO 1 — M-PESA: CBK AI LENDING GOVERNANCE
    {
      id: 'mpesa-cbk-lending',
      title: 'M-Pesa Fuliza — CBK Predatory AI Lending',
      subtitle: 'Overdraft AI · Vulnerable borrowers · CBK directive · KES 4.2B exposure',
      banner: 'Simulating the Kenyan mobile lending crisis: M-Pesa\'s Fuliza overdraft AI extends credit to users who cannot afford repayment. The AI optimises for loan volume, not borrower welfare. Kenya\'s Central Bank (CBK) finds the AI violates the CBK/PG/48 Digital Credit Providers Regulations — predatory lending to 3.2M vulnerable borrowers.',
      risk: 'Critical',
      scenarioNum: 'CBK',
      icon: 'credit-card',
      color: 'text-green-400',
      agents: [
        { id: 'fuliza-ai', name: 'Fuliza AI Agent', role: 'Overdraft Scoring & Credit Extension', icon: '💰', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'cbk-counsel', name: 'CBK Compliance Agent', role: 'Digital Credit Provider Regulations', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'cbk-enforce', name: 'CBK Enforcement Agent', role: 'Prudential Supervision & Sanctions', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'borrower-ke', name: 'Borrower Welfare Agent', role: 'Financial Inclusion & Consumer Protection', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Fuliza AI', status: 'connected', type: 'Overdraft Engine', icon: 'cpu', detail: 'AI extends overdraft to 18M users — KES 4.2B outstanding' },
        { name: 'CBK Regulations', status: 'connected', type: 'DCP Rules', icon: 'shield', detail: 'CBK/PG/48: affordability assessment mandatory for digital credit' },
        { name: 'CRB Data', status: 'connected', type: 'Credit Reference', icon: 'database', detail: '3.2M users with multiple concurrent digital loans — over-indebted' },
        { name: 'CBK Portal', status: 'syncing', type: 'Enforcement', icon: 'alert-triangle', detail: 'CBK directive: review ALL Fuliza lending for affordability compliance' },
      ],
      script: [
        { agentId: 'fuliza-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Fuliza overdraft AI: extends instant overdraft credit to M-Pesa users when their balance is insufficient for a transaction. 18M active Fuliza users. KES 4.2B ($32M) outstanding. The AI determines overdraft limits based on: M-Pesa transaction volume, frequency of M-Pesa use, repayment history on previous Fuliza advances, and airtime purchase patterns. CRITICAL ISSUE: The AI optimises for USAGE (more overdrafts = more fees) rather than BORROWER WELFARE. It does NOT assess: (1) Whether the borrower has concurrent loans from other digital lenders (Tala, Branch, KCB M-Pesa). (2) Whether the borrower\'s income supports the cumulative debt. (3) Whether the borrower is in a debt spiral — using Fuliza to repay other digital loans. CRB data shows: 3.2M Fuliza users have 3+ concurrent digital loans. 1.4M are in active debt spirals — borrowing from one platform to repay another. The AI keeps extending credit to these users because their M-Pesa transaction volume (driven by loan cycling) makes them look like active, healthy users.' },
        { agentId: 'cbk-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CBK COMPLIANCE ALERT. (1) CBK/PG/48 Digital Credit Providers Regulations (2022), Section 14: "A digital credit provider shall, before granting credit, conduct an affordability assessment of the borrower." Fuliza\'s AI does NOT conduct an affordability assessment — it assesses transaction patterns, which is a USAGE metric, not an AFFORDABILITY metric. (2) Section 15: "A digital credit provider shall not engage in predatory lending practices." Extending credit to users who are demonstrably over-indebted (3+ concurrent loans, debt spiral indicators) IS predatory lending. (3) Section 18: digital credit providers must share borrower data with licensed CRBs. But the AI doesn\'t CHECK CRB data before extending credit — it only reports after. This defeats the purpose of CRB. (4) The Data Protection Act 2019 (Kenya): using transaction data for credit scoring without explicit consent for that specific purpose may violate data protection principles. M-Pesa\'s consent covers "payment services" — not "credit scoring based on your spending patterns."' },
        { agentId: 'cbk-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. CBK enforcement: (1) The CBK issued a directive to ALL digital credit providers in 2023: conduct affordability assessments, check CRB before lending, and stop lending to over-indebted borrowers. Safaricom\'s DCP license is conditional on compliance. (2) If CBK finds systematic non-compliance: license suspension. Fuliza generates KES 12B ($92M) in annual fees — 8% of Safaricom\'s revenue. (3) The 3.2M over-indebted borrowers: Kenya\'s negative credit listing system means these users are flagged on CRBs. They cannot access formal banking. They are permanently excluded from the financial system — the opposite of M-Pesa\'s financial inclusion mission. (4) Political dimension: Kenya\'s digital lending crisis is a parliamentary concern. The Finance and National Planning Committee has held hearings on predatory digital lending. Safaricom testifying that its AI extends credit without affordability assessment would be catastrophic. (5) NPL risk: of the KES 4.2B outstanding, KES 1.8B is from over-indebted borrowers. Default rate for this segment: 34%. Write-off exposure: KES 612M ($4.7M).' },
        { agentId: 'borrower-ke', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BORROWER WELFARE. M-Pesa transformed Kenya by bringing 31M people into the financial system. Fuliza extended this by providing emergency credit. But the AI turned emergency credit into a debt trap. A typical debt spiral user: borrows KES 500 from Fuliza, uses it to repay KES 500 on Tala, borrows KES 600 from Branch to repay Fuliza + fees, cycle continues. Monthly debt service: KES 3,200 on an income of KES 15,000. The user is trapped. Without CendiaSupervision: the AI sees high transaction volume (the debt cycling) and INCREASES the overdraft limit. The spiral deepens. With CendiaSupervision: the AI checks CRB data before extending credit. Debt spiral indicators trigger a HARD STOP on new credit and a referral to Safaricom\'s financial literacy programme.' },
        { agentId: 'fuliza-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Fuliza + CendiaSupervision CBK Lending Governance: (1) AFFORDABILITY ASSESSMENT: Before extending Fuliza credit, CendiaSupervision estimates borrower income (from M-Pesa deposits, not spending) and checks total debt burden across ALL digital platforms via CRB. Debt-to-income above 40% = HARD STOP. (2) DEBT SPIRAL DETECTION: CendiaSupervision identifies loan cycling patterns — borrowing from one platform to repay another. Users in debt spirals receive a credit pause and a financial literacy referral instead of more credit. (3) CRB PRE-CHECK: CRB data is checked BEFORE credit extension, not just reported after. Users with 3+ concurrent digital loans are paused. (4) VULNERABLE BORROWER PROTECTION: Users under 25, users in rural areas with limited income sources, and users with irregular income patterns receive enhanced affordability checks. (5) CBK REPORTING: Monthly compliance reports showing affordability assessment rates, debt spiral detection, and vulnerable borrower protection metrics.' },
        { agentId: 'cbk-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Affordability assessment implemented. Debt spiral detection pauses 1.4M users and refers them to financial literacy. CRB pre-check prevents lending to over-indebted users. NPL rate drops from 34% to 8% for the at-risk segment. CBK compliance confirmed. For Safaricom: CendiaSupervision = responsible AI lending that preserves the DCP license and M-Pesa\'s financial inclusion mission. "M-Pesa Fuliza: AI credit that checks before it lends" — the message that satisfies CBK, protects borrowers, and maintains Safaricom\'s position as Kenya\'s financial inclusion champion.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Fuliza AI + Affordability check + CRB pre-check + Debt spiral detection)',
        complianceLabel: 'CBK Status',
        complianceValue: 'AFFORDABILITY COMPLIANT — SPIRALS PAUSED',
        complianceThreshold: 'CBK/PG/48: affordability assessed, CRB checked, DTI <40%',
        agents: ['Fuliza AI Agent', 'CBK Compliance Agent', 'CBK Enforcement Agent', 'Borrower Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'M-Pesa Fuliza — CBK Lending Governance',
        guaranteeBody: 'Affordability assessment implemented for 18M users. 1.4M debt spiral users paused and referred. CRB pre-check enabled. NPL rate: 34% → 8%. DCP license secured.',
        evidenceChain: 'Fuliza AI (no affordability) → CRB pre-check → DTI analysis → 1.4M spirals detected → Credit paused → Literacy referral → NPL dropped → CBK compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how M-Pesa Fuliza + CendiaSupervision implements CBK-compliant affordability assessment — protecting 3.2M vulnerable borrowers.',
      phaseLabels: ['No Affordability Check & Debt Spirals', 'CBK Directive & License Risk', 'Affordability Assessment & Spiral Detection'],
    },

    // SCENARIO 2 — SAFARICOM: KENYA DATA PROTECTION ACT AI CONSENT
    {
      id: 'safaricom-dpa-consent',
      title: 'Safaricom AI — Location Data Monetisation Without Consent',
      subtitle: 'Cell tower location · Third-party data sales · ODPC investigation · KES 5M fine',
      banner: 'Simulating the Kenyan privacy crisis: Safaricom\'s AI aggregates cell tower location data from 35M subscribers to create population movement analytics sold to third parties — advertisers, urban planners, and political campaigns. Subscribers consented to "network optimisation" — not data monetisation. The Office of the Data Protection Commissioner investigates.',
      risk: 'High',
      scenarioNum: 'DPA',
      icon: 'map-pin',
      color: 'text-amber-400',
      agents: [
        { id: 'safari-ai', name: 'Safaricom Analytics Agent', role: 'Location Intelligence & Data Products', icon: '📡', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'dpa-counsel', name: 'DPA Counsel Agent', role: 'Kenya Data Protection Act 2019', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'odpc-agent', name: 'ODPC Investigation Agent', role: 'Data Commissioner Enforcement', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'sub-rights', name: 'Subscriber Rights Agent', role: 'Privacy & Consent Integrity', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Location AI', status: 'connected', type: 'Population Analytics', icon: 'cpu', detail: 'Cell tower data from 35M subscribers aggregated for movement patterns' },
        { name: 'DPA Compliance', status: 'connected', type: 'Consent Basis', icon: 'shield', detail: 'Consent: "network optimisation" — monetisation NOT covered' },
        { name: 'Data Buyers', status: 'connected', type: 'Third Parties', icon: 'briefcase', detail: '14 data buyers: advertisers, urban planners, political consultants' },
        { name: 'ODPC Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'ODPC complaint: location data sold to political campaign without consent' },
      ],
      script: [
        { agentId: 'safari-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Safaricom location intelligence product: AI aggregates cell tower connection data from 35M subscribers to produce population movement analytics — heatmaps, flow patterns, peak activity zones. Revenue: KES 840M ($6.5M) annually from 14 data buyers. Data is "aggregated and anonymised" — individual subscriber identifiers are removed. CRITICAL ISSUE: (1) Kenya Data Protection Act 2019, Section 30: consent must be "specific" to the purpose. Subscribers consented to "network optimisation and service improvement." Location data monetisation is a DIFFERENT purpose. (2) The "anonymisation" is questionable. Academic research shows that 4 cell tower data points can uniquely identify 95% of individuals. The aggregation level (grid cells of 500m) in urban areas like Nairobi allows re-identification. (3) One data buyer is a political consulting firm. Selling population movement data to political campaigns raises concerns under the Elections Act — voter targeting using telecom data without consent. (4) The ODPC received a complaint from a civil society group after a political campaign\'s targeted messaging suspiciously correlated with Safaricom subscriber movement patterns.' },
        { agentId: 'dpa-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'DPA COMPLIANCE ALERT. (1) Section 30(1): "Consent of a data subject... shall be specific to the data processing requested." "Network optimisation" consent does NOT cover "selling movement patterns to advertisers and political consultants." Each new purpose requires new consent. (2) Section 35: Purpose limitation — personal data must be collected for "explicit, specified and legitimate purposes" and NOT processed in a manner incompatible with those purposes. (3) Section 40: data controllers must not transfer personal data to third parties without consent OR a legal basis. "Aggregated" data that can be re-identified IS personal data under the DPA. (4) Section 53: the ODPC can impose penalties of up to KES 5M ($38K) or 1% of annual turnover — whichever is lower. For Safaricom: 1% of KES 298B = KES 2.98B ($23M). But the reputational damage of selling subscriber location data to political campaigns is far worse than any fine. (5) Election Act interaction: using telecom data for political targeting may constitute an election offence. The Independent Electoral and Boundaries Commission (IEBC) has authority to investigate.' },
        { agentId: 'odpc-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ODPC enforcement: (1) The civil society complaint alleges: Safaricom sold location data that was used by a political party to target voters in specific constituencies with SMS campaigns timed to when those voters were at home (evening hours identified from movement patterns). (2) ODPC investigation will examine: the consent basis for location data monetisation, the adequacy of anonymisation, the identity of all 14 data buyers and their use purposes, and whether any data buyer is connected to political parties or campaigns. (3) If the ODPC finds the political targeting allegation substantiated: referral to the IEBC and potentially the Director of Public Prosecutions. Criminal liability under the Elections Act. (4) Regardless of the political angle: 35M subscribers\' location data monetised without consent = the largest privacy violation in Kenyan history. (5) Trust impact: M-Pesa\'s success is built on trust. If subscribers believe Safaricom sells their location data: M-Pesa adoption in underserved populations stalls. Financial inclusion regresses.' },
        { agentId: 'sub-rights', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SUBSCRIBER RIGHTS. 35M subscribers did not consent to their movement patterns being sold. They trusted Safaricom with their location data for the purpose of making phone calls and using mobile money. The consent form said "network optimisation." Subscribers reasonably understood this as: "Safaricom uses my data to make the network work better." NOT: "Safaricom creates a commercial product from my movement patterns and sells it to political campaigns." Without CendiaSupervision: the data product continues generating KES 840M while exposing Safaricom to criminal liability and trust destruction. With CendiaSupervision: every data product is checked against the consent basis. Location monetisation is flagged as outside consent scope. Safaricom obtains explicit consent or discontinues the product.' },
        { agentId: 'safari-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Safaricom + CendiaSupervision DPA Governance: (1) PURPOSE-CONSENT MAPPING: Every data product is mapped against the subscriber consent basis. Products outside consent = HARD STOP until new consent obtained. (2) ANONYMISATION VERIFICATION: CendiaSupervision applies k-anonymity and differential privacy tests. If re-identification is possible at the product\'s aggregation level: the aggregation is increased until re-identification drops below 5%. (3) THIRD-PARTY BUYER SCREENING: All data buyers are screened for political connections, sanctions, and use purpose verification. Political use = absolute prohibition. (4) CONSENT REFRESH: Subscribers receive a clear, plain-language consent request for any new data purpose: "Safaricom would like to use your anonymised location patterns for urban planning research. Your data cannot identify you personally. Do you consent? Reply YES or NO." (5) ODPC REPORTING: Quarterly data product reports showing consent basis, anonymisation level, buyer identity, and use verification.' },
        { agentId: 'odpc-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Purpose-consent mapping stops the unconsented monetisation. Political consulting contract terminated immediately. Remaining 13 data buyers: consent refresh sent to 35M subscribers. 22M consent to anonymised urban planning use. 13M decline — their data is excluded. Anonymisation level increased (2km grid, not 500m). ODPC investigation finds Safaricom now exceeds DPA requirements. For Safaricom: CendiaSupervision = data governance that protects the trust on which M-Pesa was built. "Safaricom: your data, your consent" — the message that maintains 35M subscribers\' trust.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Location AI + Purpose-consent mapping + Anonymisation + Buyer screening)',
        complianceLabel: 'DPA Status',
        complianceValue: 'CONSENT-BASED — POLITICAL USE BLOCKED',
        complianceThreshold: 'Sec. 30 specific consent, k-anonymity verified, political use prohibited',
        agents: ['Safaricom Analytics Agent', 'DPA Counsel Agent', 'ODPC Investigation Agent', 'Subscriber Rights Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Safaricom — Kenya DPA Data Governance',
        guaranteeBody: 'Location data monetisation: consent refresh completed (22M consent, 13M excluded). Political buyer terminated. Anonymisation: 500m → 2km grid. ODPC compliant. Subscriber trust preserved.',
        evidenceChain: 'Location AI (35M, no consent) → Purpose mapping → Outside consent → Political buyer terminated → Consent refresh → 22M consented → Anonymisation upgraded → ODPC compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Safaricom + CendiaSupervision catches unconsented location data monetisation — terminating political data sales and refreshing consent for 35M subscribers.',
      phaseLabels: ['Unconsented Monetisation & Political Targeting', 'ODPC Investigation & Trust Crisis', 'Purpose-Consent Mapping & Buyer Screening'],
    },

    // SCENARIO 3 — SAFARICOM: M-PESA FULIZA AI DEBT SPIRAL
    {
      id: 'safaricom-fuliza-spiral',
      title: 'M-Pesa Fuliza — AI Overdraft Creates Debt Spiral for 4M Kenyans',
      subtitle: 'Instant AI overdraft · 1.083% daily fee · Salary capture · CBK consumer protection',
      banner: 'Simulating the digital lending crisis: M-Pesa\'s Fuliza AI overdraft facility automatically extends credit to users who have exhausted their balance. The AI optimises for loan volume — not borrower welfare. Daily fees of 1.083% compound to 395% annual effective rate. 4M Kenyans trapped in a debt spiral where Fuliza captures their salary the moment it arrives.',
      risk: 'Critical',
      scenarioNum: 'CBK',
      icon: 'repeat',
      color: 'text-red-400',
      agents: [
        { id: 'fuliza-ai', name: 'Fuliza AI Agent', role: 'Overdraft Decisioning & Limit Allocation', icon: '💳', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'cbk-counsel', name: 'CBK Compliance Agent', role: 'Central Bank Digital Lending Regulations', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'cbk-enforce', name: 'CBK Enforcement Agent', role: 'Digital Credit Provider Supervision', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'borrower-agent', name: 'Borrower Welfare Agent', role: 'Consumer Protection & Debt Distress', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Fuliza AI', status: 'connected', type: 'Overdraft Engine', icon: 'cpu', detail: 'AI extends overdraft to 28M users — limit based on M-Pesa transaction history' },
        { name: 'CBK Regulations', status: 'connected', type: 'Digital Lending', icon: 'shield', detail: 'CBK/PG/19: digital credit providers must assess ability to repay' },
        { name: 'Debt Data', status: 'connected', type: 'Borrower Analysis', icon: 'alert-triangle', detail: '4M users in persistent Fuliza: salary captured within 24hrs, re-borrow immediately' },
        { name: 'CRB Portal', status: 'syncing', type: 'Credit Bureau', icon: 'database', detail: 'Negative listing: 2.1M Kenyans blacklisted from formal banking due to Fuliza defaults' },
      ],
      script: [
        { agentId: 'fuliza-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'M-Pesa Fuliza AI overdraft system. 28M users have Fuliza access. When an M-Pesa user\'s balance is insufficient for a transaction, Fuliza automatically completes it by extending an overdraft. Limit: KES 500 to KES 70,000 — set by AI based on M-Pesa transaction history. Daily fee: 1.083% on outstanding balance. On a KES 5,000 overdraft held for 30 days: fee = KES 1,625 (32.5% monthly). Annualised: 395% effective rate. THE DEBT SPIRAL: A typical user — a Nairobi matatu driver earning KES 30,000/month. His M-Pesa receives his salary. Fuliza immediately captures KES 18,000 (outstanding overdraft + fees). He has KES 12,000 left for the month. By day 15: he\'s spent it. Fuliza extends another KES 15,000 automatically. Fees accrue. Next salary: Fuliza captures KES 22,000. He has KES 8,000. The spiral tightens. After 6 months: his entire salary is captured by Fuliza within 24 hours of receipt. He re-borrows immediately. He is effectively paying 395% APR on a permanent loan. 4M Kenyans are in this pattern — persistent Fuliza users whose salary is captured and re-lent every month.' },
        { agentId: 'cbk-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CBK CONSUMER PROTECTION ALERT. (1) CBK/PG/19 (Digital Credit Providers Regulations 2022): "A digital credit provider shall... assess the ability of the borrower to repay the digital credit." Fuliza\'s AI assesses TRANSACTION HISTORY, not ABILITY TO REPAY. A user with high M-Pesa volume may have high transactions but no disposable income — they\'re cycling money, not saving it. (2) Section 12: "A digital credit provider shall not engage in... predatory lending practices." When 4M users are trapped in a debt spiral where their salary is automatically captured: this is predatory by definition. (3) Section 15: "The total cost of credit shall be disclosed... in a manner that is clear and easily understood." The daily fee of 1.083% obscures the true cost. Most users do not understand that 1.083%/day = 395%/year. (4) CRB (Credit Reference Bureau) negative listing: 2.1M Kenyans have been blacklisted from formal banking because of Fuliza defaults. They can\'t get a bank loan, a mortgage, or even a job that requires a CRB clearance. Digital lending has EXCLUDED them from the formal financial system. (5) CBK can: revoke Safaricom\'s digital credit provider licence, cap interest rates, require affordability assessments, and impose fines.' },
        { agentId: 'cbk-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. CBK enforcement action: (1) CBK\'s Financial Sector Regulators Forum identified digital lending debt spirals as "a systemic risk to financial inclusion." (2) CBK audit of Fuliza: the AI extends credit to users who are ALREADY in distress. When a user\'s salary is captured and they immediately re-borrow: the AI sees "high engagement" — it INCREASES the limit. The AI rewards debt distress with more debt. (3) CBK can impose: (a) mandatory affordability assessment before each overdraft, (b) interest rate cap (CBK base rate + margin), (c) cooling-off period: if a user\'s Fuliza is captured from salary 3 months in a row, automatic limit reduction. (4) The scale: Fuliza is the largest digital credit product in Africa. KES 1.12T disbursed in 2023. Revenue to Safaricom: KES 34B ($260M). This is Safaricom\'s fastest-growing revenue line. CBK action directly impacts Safaricom\'s profitability. (5) International attention: the World Bank and CGAP have published reports on Kenya\'s digital lending crisis. Kenya is a CAUTIONARY TALE for digital lending globally.' },
        { agentId: 'borrower-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BORROWER WELFARE. The matatu driver: KES 30,000/month salary. After 6 months of Fuliza: he pays KES 8,400/month in Fuliza fees alone — 28% of his income on debt service for a facility he never chose to have (Fuliza auto-activates). He has 3 children. School fees: KES 12,000/term. He can\'t pay. His children are sent home. His wife takes informal work. He borrows from a shylock at 20%/month. The debt spiral extends beyond Fuliza into the informal lending market. And the CRB blacklist: he applied for a bank loan to buy his own matatu (KES 1.5M). Denied — CRB shows Fuliza defaults. The digital lending product that was supposed to enable financial inclusion has EXCLUDED him from formal finance permanently. Without CendiaSupervision: 4M Kenyans in debt spirals. 2.1M blacklisted. Financial inclusion regresses. With CendiaSupervision: affordability assessment prevents over-lending. Salary capture detected: limit reduced. Cooling-off enforced. The matatu driver\'s Fuliza: capped at KES 5,000 (affordable). Fees: KES 1,200/month (4% of income, not 28%). CRB listing: avoided.' },
        { agentId: 'fuliza-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Safaricom + CendiaSupervision Digital Lending Governance: (1) AFFORDABILITY ASSESSMENT: Before extending Fuliza, CendiaSupervision assesses ABILITY TO REPAY — not just transaction history. Disposable income estimation: salary minus fixed expenses minus existing debt. Fuliza limit: capped at 30% of estimated disposable income. (2) DEBT SPIRAL DETECTION: CendiaSupervision monitors for spiral patterns: salary capture within 24hrs + immediate re-borrow + increasing balance over 3 months = SPIRAL. Automatic intervention: limit reduction, cooling-off period, financial literacy nudge. (3) TRUE COST DISCLOSURE: Instead of "1.083% daily fee," CendiaSupervision displays: "This overdraft costs KES 1,625 per month on KES 5,000. That\'s 395% per year. Are you sure?" Plain language, in Swahili and English. (4) CRB PROTECTION: Before negative listing, CendiaSupervision requires: hardship assessment, restructuring offer, and 90-day grace period. Preventing 2.1M Kenyans from being blacklisted. (5) CBK REPORTING: Quarterly reports: average APR, spiral rate, CRB listing rate, affordability compliance. Demonstrating responsible digital lending.' },
        { agentId: 'cbk-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Affordability assessment implemented. Debt spirals: 4M → 800K (80% reduction). Average Fuliza APR: disclosed transparently. CRB blacklisting: 2.1M → 400K (restructuring offered first). CBK: "Safaricom has demonstrated responsible digital lending practices." For Safaricom: CendiaSupervision = digital lending governance that protects 28M M-Pesa users. Revenue impact: Fuliza fees decrease 18% short-term, but user retention increases 34% and formal banking partnerships (M-Shwari, KCB-M-Pesa) grow. "Safaricom M-Pesa: digital lending that builds prosperity, not debt" — the message that preserves CBK\'s licence and Kenya\'s financial inclusion leadership.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sf50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sf60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Fuliza AI + Affordability assessment + Spiral detection + CRB protection)',
        complianceLabel: 'CBK Status',
        complianceValue: 'DEBT SPIRALS: 4M → 800K (−80%)',
        complianceThreshold: 'Affordability assessed, APR disclosed, CRB protection active',
        agents: ['Fuliza AI Agent', 'CBK Compliance Agent', 'CBK Enforcement Agent', 'Borrower Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Safaricom — Digital Lending Governance',
        guaranteeBody: 'Affordability gates implemented. Debt spirals: 4M → 800K. CRB blacklisting: 2.1M → 400K. True cost disclosed (395% APR). Cooling-off enforced. CBK compliant. Financial inclusion restored.',
        evidenceChain: 'Fuliza AI (volume optimised) → Affordability gate → Spiral detection → Limit reduction → True cost disclosure → CRB protection → Spirals −80% → CBK compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Safaricom + CendiaSupervision breaks the Fuliza debt spiral — protecting 4M Kenyans from predatory overdraft lending.',
      phaseLabels: ['Auto-Overdraft & 395% APR Debt Spiral', 'CBK Audit & 2.1M CRB Blacklisted', 'Affordability Assessment & Spiral Detection'],
    },

    // SCENARIO 4 — SAFARICOM: AI NETWORK OPTIMIZATION DROPS EMERGENCY CALLS
    {
      id: 'safaricom-emergency-drop',
      title: 'Safaricom AI — Network Load Balancing Drops 112 Emergency Calls in Rural Kenya',
      subtitle: 'Network AI · Traffic prioritisation · Emergency call failure · CA Kenya investigation',
      banner: 'Simulating the network safety crisis: Safaricom\'s AI network load balancer deprioritises low-ARPU rural cell towers during congestion. Emergency 112 calls from rural areas are dropped or delayed. A maternal emergency in Turkana: the call didn\'t connect for 18 minutes. Communications Authority of Kenya investigates.',
      risk: 'Critical',
      scenarioNum: '112',
      icon: 'phone-off',
      color: 'text-red-400',
      agents: [
        { id: 'network-ai', name: 'Safaricom Network Agent', role: 'AI Load Balancing & Traffic Prioritisation', icon: '📡', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'ca-counsel', name: 'CA Compliance Agent', role: 'Communications Authority & Emergency Standards', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'ca-agent', name: 'CA Enforcement Agent', role: 'Licence Conditions & Emergency Obligations', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'rural-agent', name: 'Rural Community Agent', role: 'Emergency Access & Health Outcomes', icon: '🏥', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Network AI', status: 'connected', type: 'Load Balancer', icon: 'cpu', detail: 'AI manages traffic across 8,400 cell sites — prioritises by revenue per cell' },
        { name: 'Emergency Data', status: 'connected', type: '112 Calls', icon: 'phone', detail: '342 emergency calls failed/delayed in rural areas over 3 months' },
        { name: 'CA Portal', status: 'connected', type: 'Investigation', icon: 'alert-triangle', detail: 'CA: "Emergency calls must connect within 5 seconds regardless of network load"' },
        { name: 'Health Impact', status: 'syncing', type: 'Outcomes', icon: 'heart', detail: 'Turkana maternal death linked to 18-minute 112 delay — coroner investigation' },
      ],
      script: [
        { agentId: 'network-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Safaricom AI network load balancer. Manages traffic across 8,400 cell sites serving 43M subscribers. During congestion, the AI prioritises traffic by cell site revenue. Urban sites (Nairobi, Mombasa): high ARPU, high priority. Rural sites (Turkana, Marsabit, Garissa): low ARPU, deprioritised. CRITICAL FAILURE: When rural sites are deprioritised during congestion, ALL traffic is affected — including emergency 112 calls. The AI has no emergency call carve-out. 342 emergency calls from rural areas failed or were delayed beyond 30 seconds over 3 months. One case: a pregnant woman in Turkana experiencing complications. Her family called 112. The call didn\'t connect for 18 minutes. By the time the ambulance was dispatched: she had lost too much blood. She died at the health centre. The coroner\'s investigation: "delay in emergency communication was a contributing factor."' },
        { agentId: 'ca-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'EMERGENCY COMMUNICATIONS ALERT. (1) Kenya Information and Communications Act, Section 23: licensees must maintain "quality of service standards" including emergency call completion. (2) CA Quality of Service Regulations: emergency calls must connect within 5 seconds. No exception for network congestion. (3) ITU-T E.161: international standard — emergency calls receive ABSOLUTE PRIORITY over all other traffic. Safaricom\'s AI does the opposite — it deprioritises the tower, deprioritising everything including emergencies. (4) The maternal death: if the family can establish causation (the 18-minute delay contributed to death), Safaricom faces: wrongful death liability, CA enforcement action, and criminal negligence investigation. (5) CA can: impose fines, require network modifications, and revoke spectrum if emergency obligations aren\'t met.' },
        { agentId: 'ca-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. CA investigation: (1) CA technical audit confirms: Safaricom\'s AI load balancer has NO emergency call priority. During congestion, 112 calls compete with TikTok streams and WhatsApp video calls for the same deprioritised capacity. (2) CA emergency order: "Safaricom must implement emergency call priority on ALL cell sites within 30 days. Emergency calls must ALWAYS connect within 5 seconds regardless of congestion level." (3) CA penalty: KES 100M ($770K) for each month of non-compliance. (4) CA refers the Turkana death to the Director of Public Prosecutions for criminal negligence investigation.' },
        { agentId: 'rural-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — Rural Kenya: 15M people depend on Safaricom as their ONLY communication channel. No landlines. No alternatives. When the cell tower is deprioritised: they have NO way to call for help. The Turkana mother: 24 years old. First child. Complications that are survivable with timely medical intervention. The 18-minute delay: the difference between life and death. Without CendiaSupervision: revenue-based prioritisation. Emergency calls fail. People die. With CendiaSupervision: emergency calls get ABSOLUTE PRIORITY. Dedicated emergency bandwidth reserved on every tower. The Turkana call: connects in 3 seconds. Ambulance dispatched. Mother survives.' },
        { agentId: 'network-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Safaricom + CendiaSupervision Network Safety Governance: (1) EMERGENCY PRIORITY: CendiaSupervision enforces ITU-T E.161: emergency calls get absolute priority. Dedicated bandwidth reserved on every cell site — never deprioritised. (2) RURAL MINIMUM SERVICE: During congestion, rural sites maintain minimum service level for voice calls. Data may be throttled but voice (especially emergency) is NEVER dropped. (3) REAL-TIME 112 MONITORING: CendiaSupervision monitors every 112 call: connection time, completion rate, rural vs urban performance. Any 112 failure: immediate alert to network operations. (4) CA COMPLIANCE DASHBOARD: Real-time emergency call metrics visible to CA. Connection time SLA: 5 seconds. Compliance rate target: 99.99%. (5) HEALTH OUTCOME TRACKING: CendiaSupervision correlates emergency call performance with health outcomes in rural areas — evidence for continued investment.' },
        { agentId: 'ca-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Emergency priority implemented. 112 connection time: rural 18min → 3.2 seconds. Zero emergency call failures in 90 days. CA: "Safaricom now operates the most reliable emergency network in East Africa." The Turkana community: every 112 call connects. Lives saved. For Safaricom: CendiaSupervision = network governance where emergency calls ALWAYS get through. "Safaricom: every emergency call connects, everywhere in Kenya."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sf70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sf80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Network AI + Emergency priority + Rural minimum + 112 monitoring)',
        complianceLabel: '112 Status',
        complianceValue: 'EMERGENCY PRIORITY — 3.2s CONNECTION',
        complianceThreshold: '112 connects <5s, zero failures, rural minimum service',
        agents: ['Safaricom Network Agent', 'CA Compliance Agent', 'CA Enforcement Agent', 'Rural Community Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Safaricom — Emergency Network Governance',
        guaranteeBody: 'Emergency priority: absolute. 112 connection: 3.2s (was 18min). Zero failures. Rural minimum service maintained. CA compliant. Lives saved.',
        evidenceChain: 'Network AI (revenue priority) → Emergency carve-out → Dedicated bandwidth → 112: 3.2s → Zero failures → Rural protected → CA compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Safaricom + CendiaSupervision ensures emergency calls ALWAYS connect — even in rural Kenya during network congestion.',
      phaseLabels: ['Revenue-Based Priority & Emergency Failure', 'Turkana Death & CA Investigation', 'Emergency Priority & Rural Minimum Service'],
    },

    // SCENARIO 5 — SAFARICOM: AI CUSTOMER CHURN PREDICTION DISCRIMINATES
    {
      id: 'safaricom-churn-discrimination',
      title: 'Safaricom AI — Churn Prediction Gives Retention Offers Only to Wealthy Subscribers',
      subtitle: 'Churn AI · High-ARPU retention · Low-ARPU ignored · ODPC discrimination complaint',
      banner: 'Simulating the customer discrimination crisis: Safaricom\'s AI churn prediction model identifies subscribers likely to leave and triggers retention offers (data bonuses, rate discounts). The AI targets ONLY high-ARPU subscribers. Low-income subscribers who churn: no retention attempt. Effectively a two-tier service discriminating by wealth.',
      risk: 'High',
      scenarioNum: 'ODPC',
      icon: 'users',
      color: 'text-amber-400',
      agents: [
        { id: 'churn-ai', name: 'Churn Prediction Agent', role: 'Subscriber Retention & Offer Targeting', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'odpc-counsel', name: 'ODPC Compliance Agent', role: 'Data Protection & Non-Discrimination', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'odpc-agent', name: 'ODPC Investigation Agent', role: 'Office of Data Protection Commissioner', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'subscriber-agent', name: 'Subscriber Equity Agent', role: 'Service Fairness & Digital Access', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Churn AI', status: 'connected', type: 'Retention Model', icon: 'cpu', detail: 'AI predicts churn for 43M subscribers — retention offers ONLY for top 15% ARPU' },
        { name: 'Offer Data', status: 'connected', type: 'Retention Spend', icon: 'gift', detail: 'KES 2.8B/year retention budget: 94% to high-ARPU, 6% to everyone else' },
        { name: 'ODPC Portal', status: 'connected', type: 'Complaint', icon: 'alert-triangle', detail: 'Consumer group files: "Safaricom AI discriminates against low-income Kenyans"' },
        { name: 'Churn Data', status: 'syncing', type: 'Demographics', icon: 'trending-down', detail: 'Low-ARPU churn: 34%/year. High-ARPU churn: 8%/year. Gap widening.' },
      ],
      script: [
        { agentId: 'churn-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Safaricom AI churn prediction. Monitors 43M subscribers for churn signals: reduced usage, competitor SIM detected, complaint history. When high churn risk detected, the AI triggers retention: data bonuses, rate discounts, loyalty rewards. CRITICAL BIAS: The AI calculates retention ROI. High-ARPU subscribers (KES 2,000+/month, top 15%): retention offer value KES 500. Lifetime value saved: KES 48,000. ROI: 96x. Low-ARPU subscribers (KES 200/month, bottom 60%): retention offer value KES 100. Lifetime value saved: KES 4,800. ROI: 48x. The AI sends retention offers ONLY to subscribers where ROI exceeds a threshold. Result: 94% of the KES 2.8B retention budget goes to top 15% ARPU subscribers. The bottom 60%: zero retention effort. They churn at 34%/year. Nobody tries to keep them. The AI creates a two-tier Safaricom: premium service for the wealthy, disposable service for the poor.' },
        { agentId: 'odpc-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'DATA PROTECTION & DISCRIMINATION ALERT. (1) Kenya Data Protection Act 2019, Section 35: "A data controller shall not process personal data in a manner that discriminates against a data subject on any ground." Using ARPU (which proxies for income/wealth) to determine service level is discriminatory processing. (2) Kenya Consumer Protection Act: consumers are entitled to "equal treatment regardless of economic status." Differential retention offers based on spending creates unequal treatment. (3) Kenya Constitution, Article 27: "Every person is equal before the law and has the right to equal protection." Algorithmic discrimination by income level may violate constitutional equality. (4) Reputational risk: "Safaricom only cares about rich customers" — a devastating narrative for a brand built on "democratising communication for all Kenyans." (5) Competitive risk: Airtel Kenya targets dissatisfied low-ARPU churners with aggressive offers. Safaricom loses market share in the mass market — the foundation of its mobile money ecosystem.' },
        { agentId: 'odpc-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ODPC investigation: a Kenyan consumer rights group filed a complaint. "Safaricom\'s AI decides which customers deserve retention efforts based on how much they spend. Low-income Kenyans — farmers, boda-boda riders, market women — are systematically ignored. This is algorithmic discrimination." ODPC review of Safaricom\'s churn model confirms: ARPU is the primary variable in retention targeting. ODPC position: using personal financial data to create differential service tiers without disclosure violates the Data Protection Act.' },
        { agentId: 'subscriber-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A boda-boda rider in Kisumu: ARPU KES 180/month. He\'s been with Safaricom for 6 years. His M-Pesa: his entire financial life. He starts getting Airtel offers. He\'s considering switching. Safaricom\'s AI: no retention offer. He\'s "not worth retaining." He switches. Loses his M-Pesa transaction history. His M-Shwari credit score: reset. The AI\'s decision cost him financial continuity. Without CendiaSupervision: wealthy subscribers get offers, poor subscribers get ignored. Mass market erodes. M-Pesa ecosystem shrinks. With CendiaSupervision: retention offers scaled to SUBSCRIBER VALUE (not just ARPU) — including M-Pesa usage, network tenure, and community influence. The boda-boda rider: high M-Pesa usage, 6-year tenure. Gets a retention offer. Stays.' },
        { agentId: 'churn-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Safaricom + CendiaSupervision Retention Equity: (1) HOLISTIC VALUE: CendiaSupervision replaces ARPU-only targeting with holistic subscriber value: ARPU + M-Pesa transactions + tenure + community influence + growth potential. A low-ARPU subscriber with high M-Pesa usage and 6-year tenure: HIGH retention value. (2) UNIVERSAL RETENTION: Every subscriber at churn risk receives SOME retention effort — scaled to value but never zero. Minimum: an SMS thank-you and a small data bonus. (3) FAIRNESS MONITORING: CendiaSupervision monitors retention offer distribution by income quintile. If bottom quintiles receive disproportionately less: alert and rebalancing. (4) NON-DISCRIMINATORY PROCESSING: ODPC compliance: retention decisions documented and auditable. No discriminatory processing. (5) ECOSYSTEM VALUE: M-Pesa depends on network effects — every subscriber matters. Losing low-ARPU subscribers weakens the ecosystem for everyone.' },
        { agentId: 'odpc-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Holistic value model: bottom 60% now receive retention offers. Low-ARPU churn: 34% → 22%. Boda-boda rider: retained. M-Pesa ecosystem: strengthened. ODPC: "Safaricom demonstrates non-discriminatory AI in customer management." For Safaricom: CendiaSupervision = retention governance that serves ALL 43M subscribers. "Safaricom: every customer matters, every customer stays" — the message that protects the mass market foundation of M-Pesa.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sf90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sfa0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Churn AI + Holistic value + Universal retention + Fairness monitoring)',
        complianceLabel: 'ODPC Status',
        complianceValue: 'LOW-ARPU CHURN: 34% → 22%',
        complianceThreshold: 'Holistic value, universal retention, fairness monitored',
        agents: ['Churn Prediction Agent', 'ODPC Compliance Agent', 'ODPC Investigation Agent', 'Subscriber Equity Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Safaricom — Retention Equity Governance',
        guaranteeBody: 'Holistic value: replaces ARPU-only. Universal retention: every subscriber gets offers. Low-ARPU churn: 34% → 22%. ODPC compliant. M-Pesa ecosystem protected.',
        evidenceChain: 'Churn AI (ARPU-only) → Holistic value → Universal retention → Fairness monitored → Low-ARPU churn 22% → ODPC compliant → Ecosystem protected → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Safaricom + CendiaSupervision ensures retention offers reach ALL subscribers — not just the wealthy 15%.',
      phaseLabels: ['ARPU-Only Targeting & Two-Tier Service', 'ODPC Discrimination Complaint & Market Erosion', 'Holistic Value & Universal Retention'],
    },
  ],

        complianceScore: 87,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.187Z",
            "type": "analysis",
            "title": "Transaction Monitoring - M-Pesa Fuliza — CBK Predatory AI Lending",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Transaction Monitoring analysis for Safaricom completed with industry-specific compliance checks",
            "agent": "AML Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.187Z",
            "type": "warning",
            "title": "Regulatory Alert - M-Pesa Fuliza — CBK Predatory AI Lending",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Alert analysis for Safaricom completed with industry-specific compliance checks",
            "agent": "Compliance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.187Z",
            "type": "dissent",
            "title": "Risk Assessment - M-Pesa Fuliza — CBK Predatory AI Lending",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Risk Assessment analysis for Safaricom completed with industry-specific compliance checks",
            "agent": "Risk Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.187Z",
            "type": "proposal",
            "title": "Control Enhancement - M-Pesa Fuliza — CBK Predatory AI Lending",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Control Enhancement analysis for Safaricom completed with industry-specific compliance checks",
            "agent": "Governance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.187Z",
            "type": "resolution",
            "title": "Regulatory Approval - M-Pesa Fuliza — CBK Predatory AI Lending",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Approval analysis for Safaricom completed with industry-specific compliance checks",
            "agent": "Supervisor Agent",
            "impact": "high"
      }
]};

export default config;
