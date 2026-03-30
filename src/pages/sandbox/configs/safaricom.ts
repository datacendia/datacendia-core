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
  ],
};

export default config;
