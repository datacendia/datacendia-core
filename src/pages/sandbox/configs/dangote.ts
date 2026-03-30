/**
 * Dangote Group Sandbox Config
 * Access: /sandbox/dangote (Key: DG-77)
 * @module pages/sandbox/configs/dangote
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Dangote Group',
  accessKey: 'DG-77',
  sessionKey: 'dangote-sandbox-unlocked',
  accent: 'orange',
  accentColor: 'text-orange-400',
  accentHover: 'from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600',
  ringColor: 'focus:ring-orange-500/30',
  borderColor: 'border-orange-500/30',
  gradientFrom: 'from-orange-600/20',
  gradientTo: 'to-orange-900/20',
  footerNote: 'Dangote Group AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Dangote systems or incidents.',

  scenarios: [
    // SCENARIO 1 — DANGOTE: NDPR AI EMPLOYEE SURVEILLANCE
    {
      id: 'dangote-ndpr-surveillance',
      title: 'Dangote AI — NDPR Employee Surveillance Violation',
      subtitle: 'Refinery worker monitoring · Biometric tracking · NITDA investigation · ₦10M fine',
      banner: 'Simulating the Nigerian data protection crisis: Dangote Refinery deploys AI-powered worker surveillance across the 650,000 bpd refinery complex — facial recognition, productivity tracking, and biometric attendance. The system processes employee personal data without adequate NDPR consent. NITDA investigates after a worker union complaint.',
      risk: 'High',
      scenarioNum: 'NDPR',
      icon: 'camera',
      color: 'text-orange-400',
      agents: [
        { id: 'dangote-ai', name: 'Dangote Refinery AI Agent', role: 'Worker Surveillance & Productivity Analytics', icon: '🏭', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'ndpr-counsel', name: 'NDPR Counsel Agent', role: 'Nigeria Data Protection Regulation', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'nitda-agent', name: 'NITDA Investigation Agent', role: 'National IT Development Agency Enforcement', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'worker-agent', name: 'Worker Rights Agent', role: 'Labour Law & Union Representation', icon: '👷', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Refinery AI', status: 'connected', type: 'Worker Monitoring', icon: 'cpu', detail: 'AI surveillance: 11,400 refinery workers tracked via facial recognition' },
        { name: 'NDPR Compliance', status: 'connected', type: 'Data Protection', icon: 'shield', detail: 'NDPR 2019: lawful basis for biometric processing not established' },
        { name: 'NITDA Portal', status: 'connected', type: 'Investigation', icon: 'alert-triangle', detail: 'PENGASSAN union complaint: mass surveillance without consent' },
        { name: 'Labour Module', status: 'syncing', type: 'Employment Law', icon: 'briefcase', detail: 'Nigeria Labour Act: worker privacy protections in employment' },
      ],
      script: [
        { agentId: 'dangote-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Dangote Refinery AI surveillance system: deployed across the 650,000 bpd Lekki refinery complex. 11,400 workers monitored via: (1) Facial recognition at 340 checkpoints — tracking movement, time at stations, break duration. (2) Helmet-mounted sensors — monitoring head movement, alertness, posture. (3) Biometric attendance — fingerprint + facial scan at shift start/end. (4) Productivity scoring — AI calculates a daily "efficiency score" for each worker based on movement patterns and station time. CRITICAL ISSUE: Nigeria Data Protection Regulation (NDPR) 2019, Section 2.3: processing of personal data requires a lawful basis — consent, contract necessity, legal obligation, vital interest, public interest, or legitimate interest. Dangote\'s lawful basis for biometric surveillance: NONE ESTABLISHED. (1) Consent: workers signed employment contracts that mention "workplace safety monitoring" — but NOT facial recognition, movement tracking, or productivity scoring. Consent was not specific, informed, or freely given (employment context = power imbalance). (2) Legitimate interest: requires a balancing test. Mass biometric surveillance of 11,400 workers is DISPROPORTIONATE to the safety interest. Less intrusive alternatives exist.' },
        { agentId: 'ndpr-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'NDPR COMPLIANCE ALERT. (1) The Nigeria Data Protection Act 2023 (which replaced NDPR) strengthens requirements: Section 26 requires "specific, informed, and unambiguous" consent for processing. Employment contracts with vague "safety monitoring" language do NOT satisfy this standard. (2) Section 30: processing of biometric data (facial recognition, fingerprints) is "sensitive personal data" requiring EXPLICIT consent — a higher standard than regular consent. (3) Section 28: the data controller must conduct a Data Protection Impact Assessment (DPIA) before deploying high-risk processing. Mass biometric surveillance = high-risk. No DPIA was conducted. (4) Section 44: data subjects have the right to object to processing. Workers who object to surveillance face implicit termination threats — violating the "freely given" consent requirement. (5) NITDA\'s enforcement powers under the Act: administrative fines of up to ₦10M ($6,500) or 2% of annual gross revenue — whichever is HIGHER. Dangote Group revenue: ₦4.6T ($3B). 2% = ₦92B ($60M). The fine structure incentivises compliance by large corporations.' },
        { agentId: 'nitda-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. NITDA investigation: (1) The Petroleum and Natural Gas Senior Staff Association of Nigeria (PENGASSAN) filed a formal complaint with NITDA: "mass surveillance of refinery workers using facial recognition and biometric tracking without informed consent." (2) NITDA investigation scope: lawful basis assessment, DPIA review (none exists), consent validity, biometric data safeguards, and data retention policies. (3) NITDA can order: immediate suspension of facial recognition pending DPIA completion, deletion of all biometric data collected without valid consent, and corrective measures within 90 days. (4) The refinery CANNOT operate without worker monitoring for safety — but it CAN operate with LESS INTRUSIVE monitoring. Badge-based access (not facial recognition), manual safety checks (not AI alertness monitoring), and standard attendance systems (not biometric tracking). (5) If NITDA suspends the AI system: Dangote must revert to manual safety monitoring for 11,400 workers. Cost: ₦4.8B ($3.1M) annually in additional safety personnel.' },
        { agentId: 'worker-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — WORKER RIGHTS. Refinery workers operate in a high-risk environment. Some monitoring is necessary for safety. But: (1) The "efficiency score" is NOT safety monitoring — it\'s productivity surveillance. Workers with low scores receive warnings. Three warnings = termination review. This is workplace control dressed as safety. (2) Break monitoring: the AI flags workers who take breaks longer than 12 minutes. In a refinery operating at 45°C ambient temperature: breaks are a safety necessity. The AI\'s break limit is not medically validated. (3) Facial recognition at 340 checkpoints means the system knows EXACTLY where every worker is at every moment. This is panopticon-level surveillance. Without CendiaSupervision: workers endure total surveillance. Union complaints escalate to industrial action — shutting down the refinery. With CendiaSupervision: surveillance is scoped to genuine safety needs. Productivity scoring is separated from safety monitoring. Worker privacy is preserved where safety doesn\'t require surveillance.' },
        { agentId: 'dangote-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Dangote Refinery + CendiaSupervision NDPR Governance: (1) LAWFUL BASIS ASSESSMENT: CendiaSupervision maps each surveillance function to a lawful basis. Safety monitoring = legitimate interest (with balancing test). Productivity scoring = requires explicit consent (separate from safety). Break monitoring = must be medically validated. (2) DPIA COMPLETION: CendiaSupervision generates the required DPIA for all biometric processing — assessing necessity, proportionality, and risk mitigation. (3) PROPORTIONALITY REVIEW: Each surveillance function is assessed for proportionality. Can the safety objective be achieved with less intrusive means? If yes: the less intrusive method is required. (4) WORKER CONSENT PORTAL: Workers access a portal showing exactly what data is collected, why, and their rights. Consent for non-safety functions (productivity scoring) is separate and truly voluntary — no employment consequences for declining. (5) NITDA REPORTING: Quarterly compliance reports showing lawful basis, DPIA status, consent rates, and data retention.' },
        { agentId: 'nitda-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Surveillance scoped to safety: facial recognition retained for emergency mustering ONLY (not continuous tracking). Productivity scoring: made voluntary (68% of workers opt in for bonus eligibility). Break monitoring: medically validated for heat conditions. DPIA completed. NITDA finds Dangote compliant. For Dangote: CendiaSupervision = worker surveillance governance for Africa\'s largest industrial complex. "Dangote Refinery: safety monitoring that respects worker dignity" — the message that prevents union action and demonstrates responsible AI in Nigeria\'s most important industrial project.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dg10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'dg20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Refinery AI + Lawful basis + DPIA + Proportionality + Worker consent)',
        complianceLabel: 'NDPR Status',
        complianceValue: 'DPIA COMPLETED — SCOPE REDUCED',
        complianceThreshold: 'Safety-only surveillance, voluntary productivity, DPIA filed',
        agents: ['Dangote Refinery AI Agent', 'NDPR Counsel Agent', 'NITDA Investigation Agent', 'Worker Rights Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Dangote Refinery — NDPR Surveillance Governance',
        guaranteeBody: 'Surveillance scoped: facial recognition for emergency mustering only. Productivity scoring: voluntary (68% opt-in). Break monitoring: medically validated. DPIA completed. NITDA compliant. Worker dignity preserved.',
        evidenceChain: 'Refinery AI (total surveillance) → Lawful basis mapped → DPIA completed → Proportionality review → Safety-only scope → Voluntary productivity → NITDA compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Dangote Refinery + CendiaSupervision scopes AI surveillance to genuine safety needs — preserving worker dignity and NDPR compliance.',
      phaseLabels: ['Mass Surveillance & Missing DPIA', 'NITDA Investigation & Union Complaint', 'Proportionality Review & Safety Scoping'],
    },

    // SCENARIO 2 — DANGOTE: AfCFTA AI SUPPLY CHAIN COMPLIANCE
    {
      id: 'dangote-afcfta',
      title: 'Dangote Cement — AfCFTA Rules of Origin AI Error',
      subtitle: 'Pan-African trade · Origin misclassification · Tariff preference denied · $18M duties',
      banner: 'Simulating the African Continental Free Trade crisis: Dangote Cement uses AI to classify products for AfCFTA preferential tariff treatment. The AI misclassifies cement exported from Nigeria to Kenya as meeting Rules of Origin requirements. Kenya Customs denies the preference — $18M in retroactive duties assessed.',
      risk: 'High',
      scenarioNum: 'AfCFTA',
      icon: 'globe',
      color: 'text-blue-400',
      agents: [
        { id: 'dangote-trade', name: 'Dangote Trade AI Agent', role: 'AfCFTA Classification & Origin Determination', icon: '🌍', color: 'text-orange-400', borderColor: 'border-orange-500/40', bgColor: 'bg-orange-500/10' },
        { id: 'afcfta-counsel', name: 'AfCFTA Counsel Agent', role: 'Rules of Origin & Tariff Schedules', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'customs-agent', name: 'Kenya Customs Agent', role: 'KRA Verification & Duty Assessment', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'trade-ops', name: 'Trade Operations Agent', role: 'Pan-African Logistics & Compliance', icon: '🚢', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Trade AI', status: 'connected', type: 'Origin Classification', icon: 'cpu', detail: 'AI classifies cement as "wholly obtained" in Nigeria — incorrect' },
        { name: 'AfCFTA Rules', status: 'connected', type: 'Rules of Origin', icon: 'database', detail: 'Annex 2: cement requires 40% local value addition for preference' },
        { name: 'KRA Portal', status: 'connected', type: 'Customs Assessment', icon: 'shield', detail: 'Kenya Revenue Authority: preference denied, duties assessed $18M' },
        { name: 'Input Analysis', status: 'syncing', type: 'Value Chain', icon: 'bar-chart', detail: 'Clinker imported from China: 45% of input value — exceeds threshold' },
      ],
      script: [
        { agentId: 'dangote-trade', phase: 'phase1', type: 'analysis', delay: 800, content: 'Dangote Cement AfCFTA trade classification AI. Dangote exports Portland cement from Nigeria to 14 African countries under AfCFTA preferential tariffs (0% duty vs 25-35% MFN rate). The AI classifies Dangote cement as eligible for AfCFTA preference based on: manufacturing in Nigeria (Obajana plant), Nigerian company ownership, and HS code 2523.29 (Portland cement). Classification: ELIGIBLE — "wholly obtained or produced" in Nigeria. CRITICAL ERROR: The AfCFTA Rules of Origin (Annex 2) do NOT use "wholly obtained" for manufactured goods. For cement (HS 2523): the product-specific rule requires EITHER: (a) change in tariff heading (CTH) — the cement must be manufactured from inputs classified under a different HS heading, OR (b) 40% minimum local value addition. Dangote\'s Obajana plant imports clinker from China for 45% of its input value. Clinker IS classified under HS 2523 (same heading as cement). Therefore: (a) CTH is NOT satisfied (same heading). (b) Local value addition is 55% — this DOES satisfy the 40% threshold. BUT: the AI classified under "wholly obtained" (wrong category) instead of the value addition test. The Certificate of Origin submitted to Kenya Customs cites the wrong rule.' },
        { agentId: 'afcfta-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'AfCFTA RULES OF ORIGIN ALERT. (1) The Certificate of Origin states: "Product qualifies under Rule 2 — wholly obtained or produced." Rule 2 applies to agricultural products, minerals, and natural resources — NOT manufactured goods. Cement is manufactured. The correct basis is Rule 5 — product-specific rules (Annex 2). (2) Kenya Revenue Authority (KRA) customs officers are TRAINED to check the claimed rule against the product category. A manufactured product claiming "wholly obtained" is an immediate red flag. (3) When KRA denies the preference: Dangote must pay the MFN rate (25%) on ALL cement imported into Kenya under AfCFTA preference in the past 12 months. Kenya imports: $72M. Duty at 25%: $18M. (4) The AfCFTA Secretariat will be notified. This creates a precedent that affects ALL Dangote cement exports to ALL 14 African markets. Each market\'s customs authority will re-examine Dangote\'s Certificates of Origin. (5) Total exposure across 14 markets: $240M in cement exports × 25% average MFN rate = $60M in potential retroactive duties.' },
        { agentId: 'customs-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. KRA enforcement: (1) KRA denies the AfCFTA preference for the Kenya shipment. Duty assessment: $18M. (2) KRA issues an alert to the AfCFTA Committee on Rules of Origin — requesting verification from Nigeria Customs Service (NCS). If NCS cannot verify the origin claim: ALL Dangote cement AfCFTA certificates are suspended pending verification. (3) Verification process: 6-12 months. During this period: Dangote cement enters African markets at MFN rates (25-35%). Dangote\'s price advantage disappears. Competitors (LafargeHolcim Africa, ARM Cement) capture market share. (4) The irony: Dangote cement DOES qualify for AfCFTA preference under the value addition test (55% local value). The AI just cited the WRONG RULE. The product qualifies — the paperwork doesn\'t. This is a compliance failure, not a trade fraud. (5) But customs authorities treat incorrect origin certificates seriously. Accidental misclassification and intentional fraud look the same on the certificate.' },
        { agentId: 'trade-ops', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — TRADE OPERATIONS. Dangote is the first major African manufacturer to use AfCFTA at scale. The AfCFTA is designed to boost intra-African trade — and Dangote is the poster child. An origin classification error that results in $60M in retroactive duties undermines both Dangote and the AfCFTA itself. Without CendiaSupervision: the wrong rule is cited on certificates across 14 markets. KRA catches it. $60M exposure. 6-12 month verification suspension. Competitors fill the gap. With CendiaSupervision: the classification AI is checked against product-specific rules. "Wholly obtained" is corrected to "value addition (55%)." Certificates are issued with the correct rule. KRA verifies and confirms. Zero duties.' },
        { agentId: 'dangote-trade', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Dangote + CendiaSupervision AfCFTA Governance: (1) PRODUCT-SPECIFIC RULE MATCHING: CendiaSupervision maps each product (by HS code) to its specific AfCFTA Rules of Origin requirement. No generic classifications. Cement HS 2523 → CTH or 40% value addition. (2) VALUE CHAIN VERIFICATION: For the value addition test, CendiaSupervision calculates local value from actual input costs, verifying against customs declarations and supplier invoices. (3) CERTIFICATE VALIDATION: Before a Certificate of Origin is submitted, CendiaSupervision validates: correct rule cited, calculation documented, supporting evidence attached. (4) MULTI-MARKET MONITORING: AfCFTA tariff schedules differ by country (based on liberalisation category). CendiaSupervision tracks which products have preferential access in which markets. (5) NCS COORDINATION: CendiaSupervision generates verification-ready documentation that NCS can use to confirm origin claims when destination customs inquires.' },
        { agentId: 'customs-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Product-specific rule matching corrects the classification. Certificates now cite Rule 5 with 55% value addition. KRA verifies and confirms. No retroactive duties. No verification suspension. For Dangote: CendiaSupervision = AfCFTA compliance at scale for Africa\'s largest manufacturer. "Dangote: AfCFTA-certified with CendiaSupervision origin governance" — the message that protects $240M in intra-African trade and positions Dangote as the model for African manufacturers using AfCFTA.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dg30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'dg40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Trade AI + Product-specific rules + Value chain + Certificate validation)',
        complianceLabel: 'AfCFTA Status',
        complianceValue: 'RULE 5 — 55% VALUE ADDITION VERIFIED',
        complianceThreshold: 'HS 2523: CTH or 40% local value — 55% achieved',
        agents: ['Dangote Trade AI Agent', 'AfCFTA Counsel Agent', 'Kenya Customs Agent', 'Trade Operations Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Dangote — AfCFTA Rules of Origin Governance',
        guaranteeBody: 'Origin classification corrected: "wholly obtained" → Rule 5 value addition (55%). Certificates reissued. KRA verified. No retroactive duties. $240M intra-African trade protected.',
        evidenceChain: 'Trade AI (wholly obtained — wrong) → Product-specific rules → HS 2523 → Value addition test → 55% verified → Certificate corrected → KRA confirmed → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Dangote + CendiaSupervision corrects an AfCFTA origin misclassification — preventing $60M in retroactive duties across 14 African markets.',
      phaseLabels: ['Wrong Origin Rule & Certificate Error', 'KRA Denial & $60M Exposure', 'Product-Specific Rules & Value Chain Verification'],
    },

    // SCENARIO 3 — DANGOTE: AI EMISSIONS MONITORING UNDERREPORTING
    {
      id: 'dangote-emissions-ai',
      title: 'Dangote Cement — AI Emissions Monitoring Underreports by 340%',
      subtitle: 'Continuous emissions AI · Sensor drift · NESREA enforcement · Carbon tax exposure $18M',
      banner: 'Simulating the industrial emissions crisis: Dangote Cement\'s AI-powered continuous emissions monitoring system (CEMS) at the Obajana plant underreports CO2 and particulate emissions by 340% due to sensor calibration drift. NESREA (National Environmental Standards and Regulations Enforcement Agency) audit discovers the discrepancy. $18M in carbon tax liability and community health lawsuits.',
      risk: 'Critical',
      scenarioNum: 'NESREA',
      icon: 'cloud',
      color: 'text-red-400',
      agents: [
        { id: 'cems-ai', name: 'Dangote CEMS AI Agent', role: 'Continuous Emissions Monitoring & Reporting', icon: '🏭', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'env-counsel', name: 'Environmental Counsel Agent', role: 'NESREA Regulations & EIA Compliance', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'nesrea-agent', name: 'NESREA Enforcement Agent', role: 'Environmental Standards & Penalties', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'community-agent', name: 'Community Health Agent', role: 'Public Health & Environmental Justice', icon: '🫁', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'CEMS AI', status: 'connected', type: 'Emissions Monitoring', icon: 'cpu', detail: 'AI processes data from 48 stack sensors — calibration drift undetected' },
        { name: 'NESREA Portal', status: 'connected', type: 'Emissions Reporting', icon: 'shield', detail: 'Quarterly reports: CO2 440K tonnes reported — actual: 1.94M tonnes' },
        { name: 'Sensor Array', status: 'connected', type: 'Stack Monitoring', icon: 'activity', detail: '48 sensors: 31 drifted beyond ±15% calibration tolerance over 14 months' },
        { name: 'Community Health', status: 'syncing', type: 'Impact Data', icon: 'alert-triangle', detail: 'Obajana community: respiratory illness rate 3.2x national average' },
      ],
      script: [
        { agentId: 'cems-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Dangote Cement Obajana plant — Africa\'s largest cement factory. Annual production: 16.25M tonnes. The AI-powered CEMS monitors emissions from 4 kiln stacks: CO2, NOx, SOx, particulate matter (PM2.5/PM10). 48 sensors feed real-time data to the AI, which generates quarterly NESREA compliance reports. CRITICAL FAILURE: Over 14 months, 31 of 48 sensors drifted beyond the ±15% calibration tolerance. The sensors degraded due to: high-temperature cement kiln environment (1,450°C), calcium oxide dust coating optical sensors, and moisture ingress in gas analysers. The AI continued reporting based on drifted sensor data. It had NO sensor health monitoring — it trusted whatever the sensors reported. Reported CO2: 440,000 tonnes/year. Actual CO2 (verified by NESREA portable analyser): 1.94M tonnes/year. Underreporting: 340%. Particulate matter: reported 42 µg/m³ (within NESREA standard of 50 µg/m³). Actual: 186 µg/m³ — 3.7x the legal limit. The AI generated "compliant" reports for 14 months while the plant was massively exceeding legal emission limits.' },
        { agentId: 'env-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'ENVIRONMENTAL COMPLIANCE ALERT. (1) NESREA Act 2007, Section 7: NESREA shall "enforce compliance with environmental laws, guidelines, policies, standards and regulations." Dangote Cement submitted falsely low emissions data for 14 months. This is a NESREA Act violation regardless of whether the underreporting was intentional or negligent. (2) National Environmental (Air Quality Control) Regulations 2014: particulate matter limit is 50 µg/m³. Actual: 186 µg/m³ — 3.7x violation. Each day of violation: a penalty. 14 months = 420 days of violation. (3) Environmental Impact Assessment Act 1992: the Obajana plant EIA specified emissions limits. The plant has been operating outside its EIA conditions. NESREA can: revoke the EIA certificate, requiring a new assessment (cost: $4M, delay: 18 months). (4) Carbon tax exposure: Nigeria\'s Energy Transition Plan includes carbon pricing. At even a modest $15/tonne: 1.5M unreported tonnes × $15 = $22.5M in retroactive carbon tax. (5) The community health dimension: Obajana and surrounding communities (population 180,000) have been exposed to 3.7x legal PM2.5 levels for 14 months. Respiratory illness, asthma, and COPD rates have spiked. Class action potential: $18M in health-related damages.' },
        { agentId: 'nesrea-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. NESREA enforcement: (1) NESREA conducted a surprise audit with portable stack analysers. Findings: "CO2 emissions 340% higher than reported. PM2.5: 3.7x legal limit. Sensor calibration: 31 of 48 sensors beyond tolerance." (2) NESREA actions: (a) Improvement Notice: Dangote must recalibrate ALL sensors within 30 days. (b) Abatement Notice: reduce PM2.5 to legal limits within 90 days or face production curtailment. (c) Financial penalty: ₦500M ($340K) — the maximum under current law (widely considered too low). (d) Referral to the Attorney General for potential prosecution under NESREA Act Section 20. (3) Dangote\'s response options: argue sensor drift was beyond their control (weak — they\'re responsible for calibration), or acknowledge the failure and implement comprehensive monitoring governance. (4) Reputational impact: "Africa\'s largest cement plant massively underreporting emissions" — headline that damages Dangote\'s ESG profile and threatens international partnerships. IFC and AfDB have environmental lending conditions.' },
        { agentId: 'community-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — COMMUNITY HEALTH. 180,000 people in Obajana and surrounding communities. PM2.5 at 186 µg/m³ — 3.7x the legal limit — for 14 months. Health impact: respiratory illness rate in Obajana: 3.2x national average. Hospital admissions for asthma and COPD: up 280%. Children under 5: most vulnerable — particulate matter penetrates developing lungs. A mother in Obajana: her 3-year-old daughter has been hospitalised twice for respiratory distress. The clinic is overwhelmed. The community suspects the cement plant but had no data — because the AI said emissions were within limits. Without CendiaSupervision: 180,000 people breathe toxic air for 14 months. The AI says "compliant." Children are hospitalised. With CendiaSupervision: sensor drift detected at month 2 (not month 14). Calibration triggered. True emissions revealed. Abatement measures implemented. PM2.5 reduced to within limits. Community health protected.' },
        { agentId: 'cems-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Dangote + CendiaSupervision Emissions Governance: (1) SENSOR HEALTH MONITORING: CendiaSupervision monitors sensor calibration state — detecting drift before it exceeds tolerance. Drift alerts at ±5% (well before the ±15% failure threshold). Automatic recalibration triggers. (2) CROSS-VALIDATION: CendiaSupervision cross-validates sensor readings against fuel consumption, production output, and stoichiometric calculations. If the AI reports 440K tonnes CO2 but fuel consumption implies 1.9M tonnes: discrepancy alert. The physics must match. (3) REFERENCE METHOD COMPARISON: Quarterly portable analyser spot-checks are compared to CEMS data. Any deviation >10% triggers full calibration audit. (4) NESREA REPORTING INTEGRITY: CendiaSupervision flags any report where underlying data quality is degraded. Reports marked: "Sensor confidence: HIGH/MEDIUM/LOW." LOW confidence reports trigger recalibration before submission. (5) COMMUNITY AIR QUALITY: Real-time ambient air quality data shared with community via public dashboard. Transparency builds trust.' },
        { agentId: 'nesrea-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Sensor drift caught at month 2. All 48 sensors recalibrated. Cross-validation: fuel-based CO2 matches sensor CO2 within 4%. PM2.5: abatement measures implemented, reduced to 38 µg/m³ (below 50 limit). Community air quality dashboard live. NESREA: "Dangote Obajana now operates the most transparent emissions monitoring in Nigeria." For Dangote: CendiaSupervision = environmental governance that protects communities and preserves Dangote\'s operating licence. "Dangote: industrial emissions governance that protects 180,000 neighbours" — the message that satisfies NESREA, protects the community, and maintains ESG credibility with IFC and AfDB.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:dg50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'dg60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CEMS AI + Sensor health + Cross-validation + Community dashboard)',
        complianceLabel: 'NESREA Status',
        complianceValue: 'DRIFT CAUGHT MONTH 2 — PM2.5 WITHIN LIMITS',
        complianceThreshold: 'Sensors calibrated, cross-validated, PM2.5: 38 µg/m³ (<50)',
        agents: ['Dangote CEMS AI Agent', 'Environmental Counsel Agent', 'NESREA Enforcement Agent', 'Community Health Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Dangote — Environmental Emissions Governance',
        guaranteeBody: 'Sensor drift detected month 2. Calibration restored. CO2: accurately reported. PM2.5: 186 → 38 µg/m³. Community dashboard live. 180,000 people protected. NESREA compliant.',
        evidenceChain: 'CEMS AI (drifted sensors) → Sensor health monitor → Drift ±5% alert → Recalibrated → Cross-validated → PM2.5 abated → Community dashboard → NESREA compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Dangote + CendiaSupervision catches sensor drift in emissions monitoring — preventing 14 months of toxic air for 180,000 people.',
      phaseLabels: ['Sensor Drift & 340% Underreporting', 'NESREA Audit & Community Health Crisis', 'Sensor Health Monitoring & Cross-Validation'],
    },
  ],
};

export default config;
