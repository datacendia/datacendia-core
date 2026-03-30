/**
 * MTN Group Sandbox Config
 * Access: /sandbox/mtn (Key: MT-75)
 * @module pages/sandbox/configs/mtn
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'MTN Group',
  accessKey: 'MT-75',
  sessionKey: 'mtn-sandbox-unlocked',
  accent: 'yellow',
  accentColor: 'text-yellow-400',
  accentHover: 'from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600',
  ringColor: 'focus:ring-yellow-500/30',
  borderColor: 'border-yellow-500/30',
  gradientFrom: 'from-yellow-600/20',
  gradientTo: 'to-yellow-900/20',
  footerNote: 'MTN Group AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual MTN systems or incidents.',

  scenarios: [
    // SCENARIO 1 — MTN: POPIA AI PROFILING & MOBILE MONEY
    {
      id: 'mtn-popia-momo',
      title: 'MTN MoMo — POPIA Automated Credit Scoring Violation',
      subtitle: 'Mobile money data · AI credit profiling · Information Regulator · R10M fine',
      banner: 'Simulating the South African data protection crisis: MTN Mobile Money (MoMo) uses AI to profile user transaction patterns for automated credit scoring. The profiling constitutes "automated decision-making" under POPIA Section 71. Users were not informed of their right to object. The Information Regulator investigates.',
      risk: 'Critical',
      scenarioNum: 'POPIA',
      icon: 'smartphone',
      color: 'text-yellow-400',
      agents: [
        { id: 'momo-ai', name: 'MoMo AI Agent', role: 'Mobile Money Analytics & Credit Scoring', icon: '📱', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
        { id: 'popia-counsel', name: 'POPIA Counsel Agent', role: 'South African Data Protection', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'info-reg', name: 'Information Regulator Agent', role: 'POPIA Enforcement & Penalties', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'consumer-za', name: 'Consumer Protection Agent', role: 'NCA & Financial Inclusion Impact', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'MoMo AI Platform', status: 'connected', type: 'Credit Scoring', icon: 'cpu', detail: 'Transaction pattern analysis across 28M SA MoMo users' },
        { name: 'POPIA Compliance', status: 'connected', type: 'Sec. 71 Rights', icon: 'shield', detail: 'Automated decision-making: no opt-out mechanism provided' },
        { name: 'Information Regulator', status: 'connected', type: 'Investigation', icon: 'alert-triangle', detail: 'Complaint: AI credit denial without human review option' },
        { name: 'NCA Module', status: 'syncing', type: 'Credit Regulation', icon: 'briefcase', detail: 'National Credit Act: affordability assessment requirements' },
      ],
      script: [
        { agentId: 'momo-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'MTN MoMo AI credit scoring for micro-loans (R500-R5,000). The AI analyses: MoMo transaction frequency, airtime purchase patterns, bill payment consistency, peer-to-peer transfer volume, and merchant payment diversity across 28M South African MoMo users. Credit decisions are FULLY AUTOMATED — no human review. Approval/denial in 8 seconds. CRITICAL ISSUE: POPIA Section 71(1): "A data subject may not be subject to a decision which results in legal consequences for him, her or it, or which affects him, her or it to a substantial degree, which is based solely on the automated processing of personal information." Credit decisions "affect to a substantial degree." Section 71(2): the data subject must be notified AND given an opportunity to make representations. MTN provides neither. 4.2M credit decisions were made in the past year without Section 71 compliance — no notification, no human review option, no right to make representations. Additionally: the AI uses airtime purchase patterns. Low airtime spend correlates with lower income — but also with rural users who rely on USSD rather than data. The model disadvantages rural users systematically.' },
        { agentId: 'popia-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'POPIA COMPLIANCE ALERT. (1) Section 71 is MANDATORY — not optional. Every automated decision with "substantial" effect requires: notification to the data subject that the decision was automated, the logic involved in the decision, and an opportunity to make representations (essentially, to request human review). (2) MTN\'s MoMo credit denial message: "Your MoMo Advance application was not approved at this time." This does NOT disclose that the decision was automated, does NOT explain the logic, and does NOT offer human review. Three Section 71 violations per decision × 4.2M decisions = 4.2M violations. (3) The National Credit Act (NCA) Section 82: credit providers must conduct an affordability assessment. An AI-only assessment may not satisfy NCA requirements if it doesn\'t consider all legally required factors. (4) The rural user bias: Section 9 of POPIA requires processing to be "adequate, relevant and not excessive." Using airtime patterns that systematically disadvantage rural users may violate adequacy requirements — the feature measures CONNECTIVITY, not CREDITWORTHINESS.' },
        { agentId: 'info-reg', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Information Regulator enforcement: (1) A MoMo user in Limpopo filed a complaint: denied a R2,000 advance with no explanation and no human review option. The Information Regulator must investigate under POPIA Section 74. (2) The investigation will examine ALL MoMo credit decisions — not just this complaint. 4.2M decisions without Section 71 compliance = systemic violation. (3) POPIA Section 107: penalties of up to R10M or imprisonment for up to 10 years for knowing violations. MTN\'s legal team was aware of Section 71 requirements — the failure to implement is potentially a knowing violation. (4) The Information Regulator can also issue an enforcement notice under Section 95: requiring MTN to halt ALL automated credit decisions until Section 71 compliance is implemented. A halt = MoMo Advance shuts down. Revenue impact: R840M annually. (5) Precedent: the Information Regulator\'s first major enforcement action was against the Department of Justice (2021). An action against MTN — Africa\'s largest telecom — would establish POPIA as a serious enforcement regime.' },
        { agentId: 'consumer-za', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CONSUMER PROTECTION. MoMo Advance serves South Africa\'s financially underserved population. Users who are denied credit by traditional banks rely on MoMo for emergency micro-loans. When the AI denies a R1,000 advance to a rural user based on low airtime spend: that user has NO recourse. No explanation. No appeal. No alternative. They turn to loan sharks charging 30%+ monthly interest. The AI that was supposed to enable financial inclusion is driving the most vulnerable users to predatory lenders. Without CendiaSupervision: 4.2M automated decisions continue without Section 71 rights. Rural users are systematically disadvantaged. With CendiaSupervision: every automated credit decision includes Section 71 notification, logic explanation, and human review option. Rural bias is caught and the airtime feature is debiased.' },
        { agentId: 'momo-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing MTN MoMo + CendiaSupervision POPIA Governance: (1) SECTION 71 COMPLIANCE: Every automated credit decision includes: "This decision was made by an AI system. The factors considered were: [list]. You have the right to request a human review. Reply REVIEW to this message." (2) HUMAN REVIEW PIPELINE: Users who request review are connected to a trained credit assessor within 48 hours. The assessor reviews the AI decision with full context. (3) RURAL BIAS CORRECTION: CendiaSupervision identifies features that proxy for geography/connectivity rather than creditworthiness. Airtime patterns are adjusted for rural connectivity differences. (4) NCA AFFORDABILITY: The AI\'s credit assessment is mapped against NCA affordability requirements. Missing NCA factors are flagged. (5) INFORMATION REGULATOR REPORTING: Quarterly reports on automated decision volume, Section 71 compliance rate, human review requests, and review outcomes.' },
        { agentId: 'info-reg', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Section 71 compliance implemented. Human review option provided. Rural bias corrected — approval rate in rural areas increases from 23% to 41%. The Limpopo user\'s complaint is resolved: human review approved her R2,000 advance. Information Regulator finds MTN exceeds POPIA requirements. For MTN: CendiaSupervision = POPIA governance that makes MoMo a model for financial inclusion. "MTN MoMo: AI credit decisions with human review rights" — the message that builds trust across 28M South African users and positions MTN as the responsible fintech leader.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:mt10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'mt20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (MoMo AI + POPIA Sec. 71 + Human review + Rural bias correction)',
        complianceLabel: 'POPIA Status',
        complianceValue: 'SEC. 71 COMPLIANT — REVIEW ENABLED',
        complianceThreshold: 'Automated decisions: notified, explained, reviewable',
        agents: ['MoMo AI Agent', 'POPIA Counsel Agent', 'Information Regulator Agent', 'Consumer Protection Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'MTN MoMo — POPIA Automated Decision Governance',
        guaranteeBody: 'Section 71 compliance: all 4.2M annual credit decisions now include notification, explanation, and human review option. Rural bias corrected: approval rate 23% → 41%. Information Regulator audit-ready.',
        evidenceChain: 'MoMo AI (4.2M decisions) → Sec. 71 gap → Notification added → Review option → Rural bias detected → Airtime debiased → 41% rural approval → Regulator compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how MTN MoMo + CendiaSupervision implements POPIA Section 71 rights for 28M users — enabling financial inclusion with human review.',
      phaseLabels: ['Automated Decisions & Missing Sec. 71 Rights', 'Information Regulator & Rural Bias', 'Human Review & Financial Inclusion'],
    },

    // SCENARIO 2 — MTN: RICA SIM REGISTRATION AI
    {
      id: 'mtn-rica-ai',
      title: 'MTN RICA — AI Facial Recognition False Rejection',
      subtitle: 'SIM registration biometrics · Dark skin bias · ICASA investigation · 2.8M unregistered',
      banner: 'Simulating the biometric inclusion crisis: MTN uses AI facial recognition for RICA SIM registration. The system has a 12% false rejection rate for dark-skinned users vs 1.8% for light-skinned users. 2.8M South Africans cannot register SIMs — losing mobile connectivity essential for banking, healthcare, and employment.',
      risk: 'Critical',
      scenarioNum: 'RICA',
      icon: 'camera',
      color: 'text-red-400',
      agents: [
        { id: 'rica-ai', name: 'MTN RICA AI Agent', role: 'Biometric SIM Registration', icon: '📸', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
        { id: 'equality-za', name: 'Equality Agent', role: 'Constitution Sec. 9 & PEPUDA', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'icasa-agent', name: 'ICASA Investigation Agent', role: 'Communications Regulator & License Conditions', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'access-agent', name: 'Digital Access Agent', role: 'Universal Service & Connectivity Rights', icon: '🌍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'RICA AI System', status: 'connected', type: 'Biometric Registration', icon: 'cpu', detail: 'Facial recognition for SIM registration — 38M verifications/year' },
        { name: 'Bias Analysis', status: 'connected', type: 'Fairness Audit', icon: 'bar-chart', detail: 'False rejection: dark skin 12% vs light skin 1.8% — 6.7x disparity' },
        { name: 'ICASA Portal', status: 'connected', type: 'Enforcement', icon: 'shield', detail: 'ICASA investigation: discriminatory access to telecommunications' },
        { name: 'RICA Database', status: 'syncing', type: 'Registration', icon: 'database', detail: '2.8M users unable to complete registration — disconnection pending' },
      ],
      script: [
        { agentId: 'rica-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'MTN RICA AI facial recognition system for SIM card registration compliance. South Africa\'s RICA Act requires identity verification for all SIM cards. MTN deployed AI facial recognition to enable remote registration via the MyMTN app — matching a selfie to the user\'s ID document photo. Overall accuracy: 97.2%. CRITICAL ISSUE: Performance by skin tone: Fitzpatrick I-III (light skin): false rejection rate 1.8%. Fitzpatrick IV-V (medium skin): false rejection rate 5.4%. Fitzpatrick VI (dark skin): false rejection rate 12%. The 12% false rejection rate means 1 in 8 dark-skinned users CANNOT complete SIM registration via the app. They must visit a physical MTN store — if one exists nearby. In rural areas: the nearest store may be 50+ km away. Affected population: approximately 2.8M South Africans who attempted app-based registration and were falsely rejected. These users face SIM disconnection under RICA compliance deadlines if they cannot register in time. In South Africa, where 78% of the population is Black African: the 12% false rejection rate disproportionately affects the majority population.' },
        { agentId: 'equality-za', phase: 'phase1', type: 'warning', delay: 2500, content: 'CONSTITUTIONAL ALERT. (1) Constitution Section 9(3): "The state may not unfairly discriminate directly or indirectly against anyone on one or more grounds, including race, gender, sex, pregnancy, marital status, ethnic or social origin, colour, sexual orientation, age, disability, religion, conscience, belief, culture, language and birth." Section 9(4) extends to private entities. A facial recognition system that discriminates by skin colour violates Section 9. (2) PEPUDA (Promotion of Equality and Prevention of Unfair Discrimination Act): prohibits unfair discrimination by private entities. A 6.7x disparity in false rejection rates by skin tone = prima facie unfair discrimination. (3) The burden shifts to MTN to prove the discrimination is "fair" — i.e., justified by a legitimate purpose that cannot be achieved by less discriminatory means. Alternative: in-person verification. The alternative exists. The AI discrimination is NOT justified. (4) RICA Act: requires SIM registration but does NOT mandate biometric verification. MTN chose facial recognition for cost efficiency. The discriminatory implementation is MTN\'s choice, not a legal requirement.' },
        { agentId: 'icasa-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ICASA investigation: (1) ICASA license conditions require MTN to provide "non-discriminatory access to electronic communications services." A registration system that rejects dark-skinned users at 6.7x the rate = discriminatory access. (2) ICASA can impose license conditions requiring MTN to: provide alternative registration methods at NO additional cost to the user, achieve demographic parity in biometric accuracy within 12 months, and report quarterly on false rejection rates by demographic. (3) The 2.8M affected users face SIM disconnection if they cannot register. SIM disconnection in South Africa means: no mobile banking (many users are unbanked and rely on mobile money), no access to government services (many services are SMS-based), no emergency calls, no job search (most jobs require a phone number). (4) ICASA penalty: up to 10% of annual turnover for license condition violations. MTN SA turnover: R38B. Maximum penalty: R3.8B ($210M).' },
        { agentId: 'access-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DIGITAL ACCESS. Mobile connectivity is not a luxury in South Africa — it is essential infrastructure. 2.8M people losing SIM registration means 2.8M people potentially losing access to: mobile banking (for the 11M unbanked South Africans, this IS their bank), healthcare appointment reminders, social grant notifications, and emergency services. The communities most affected are rural, Black, and already digitally excluded. The AI is deepening the digital divide along racial lines. Without CendiaSupervision: MTN continues with the biased system. 2.8M users are disconnected or must travel to stores. Digital exclusion deepens. With CendiaSupervision: the skin tone bias is caught during model validation. The model is retrained with diverse training data. False rejection rates equalise. All 2.8M users can register via the app.' },
        { agentId: 'rica-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing MTN RICA + CendiaSupervision Biometric Fairness Governance: (1) DEMOGRAPHIC PARITY TESTING: Before deployment, facial recognition is tested across ALL Fitzpatrick skin tone categories. False rejection rates must be within 2x of each other (not 6.7x). (2) DIVERSE TRAINING DATA: CendiaSupervision audits training data for demographic representation. South Africa\'s population is 78% Black African — the training data must reflect this. (3) FALLBACK PATHWAY: If biometric verification fails, CendiaSupervision provides an immediate alternative pathway (video call verification, document upload) — no store visit required. (4) ONGOING MONITORING: Post-deployment, false rejection rates are tracked by demographic. Any drift toward disparity triggers retraining. (5) UNIVERSAL ACCESS REPORT: Quarterly report to ICASA demonstrating demographic parity in registration success rates.' },
        { agentId: 'icasa-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Model retrained with representative data. False rejection rates: light skin 1.6%, dark skin 2.1% — within acceptable range. 2.8M previously rejected users re-invited to register via app. 2.4M successfully register within 30 days. No disconnections. For MTN: CendiaSupervision = biometric fairness for Africa\'s largest telecom. "MTN: facial recognition that works for everyone" — the message that demonstrates responsible AI in a country where racial equality is constitutional.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:mt30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'mt40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (RICA AI + Demographic parity + Diverse training + Fallback pathway)',
        complianceLabel: 'Biometric Status',
        complianceValue: 'PARITY ACHIEVED — 2.1% DARK SKIN FRR',
        complianceThreshold: 'Fitzpatrick VI FRR: 12% → 2.1%, within 2x of light skin',
        agents: ['MTN RICA AI Agent', 'Equality Agent', 'ICASA Investigation Agent', 'Digital Access Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'MTN RICA — Biometric Fairness Governance',
        guaranteeBody: 'Skin tone bias eliminated: dark skin FRR 12% → 2.1%. 2.8M users re-registered. No disconnections. Demographic parity achieved. ICASA compliant. Constitution Sec. 9 satisfied.',
        evidenceChain: 'RICA AI (12% dark FRR) → Bias detected → Training data diversified → Retrained → 2.1% FRR → 2.8M re-registered → ICASA report → Sec. 9 compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how MTN + CendiaSupervision eliminates skin tone bias in facial recognition — enabling 2.8M South Africans to register SIMs.',
      phaseLabels: ['Biometric False Rejection & Rural Exclusion', 'ICASA Investigation & Digital Divide', 'Multi-Modal Verification & Adaptive Thresholds'],
    },

    // SCENARIO 3 — MTN: AI NETWORK CAPEX BIAS AGAINST RURAL AFRICA
    {
      id: 'mtn-network-bias',
      title: 'MTN AI — Network Investment Model Bypasses Rural Communities',
      subtitle: 'CAPEX allocation AI · Revenue-per-tower optimisation · ICASA universal service · 8M underserved',
      banner: 'Simulating the digital divide crisis: MTN\'s AI-driven network investment model allocates 4G/5G CAPEX based on revenue-per-tower projections. Rural and township communities are systematically deprioritised because their ARPU is lower. 8M South Africans in underserved areas remain on 2G. ICASA investigates under universal service licence conditions.',
      risk: 'High',
      scenarioNum: 'USO',
      icon: 'wifi',
      color: 'text-amber-400',
      agents: [
        { id: 'capex-ai', name: 'MTN CAPEX AI Agent', role: 'Network Investment Allocation & ROI Modelling', icon: '📡', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'uso-counsel', name: 'Universal Service Agent', role: 'ICASA Licence Conditions & ECA Obligations', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'icasa-agent', name: 'ICASA Enforcement Agent', role: 'Spectrum Licence & Coverage Obligations', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'community-agent', name: 'Rural Community Agent', role: 'Digital Inclusion & Economic Development', icon: '🌍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'CAPEX AI', status: 'connected', type: 'Investment Model', icon: 'cpu', detail: 'AI allocates R8.2B annual CAPEX — 89% to urban, 11% to rural' },
        { name: 'ICASA Licence', status: 'connected', type: 'Coverage Obligations', icon: 'shield', detail: 'Spectrum licence: 97% population coverage by 2026 — current: 84%' },
        { name: 'Coverage Map', status: 'connected', type: 'Network Data', icon: 'map-pin', detail: '8M South Africans on 2G only — Eastern Cape, Limpopo, KZN rural' },
        { name: 'USAASA', status: 'syncing', type: 'Universal Service', icon: 'users', detail: 'Universal Service Agency: MTN not meeting rural rollout targets' },
      ],
      script: [
        { agentId: 'capex-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'MTN South Africa CAPEX allocation AI. Annual network investment: R8.2B ($450M). The AI determines where to build new towers, upgrade existing ones, and deploy 4G/5G. Optimisation target: maximise revenue-per-tower within 5-year payback period. AI allocation: Urban areas (Johannesburg, Cape Town, Durban, Pretoria): 89% of CAPEX (R7.3B). Rural and township areas: 11% of CAPEX (R0.9B). The AI\'s logic: urban tower generates R2.4M annual revenue. Rural tower generates R340K. ROI threshold: R800K/year. Rural towers don\'t meet the threshold. RESULT: 8M South Africans in rural Eastern Cape, Limpopo, and KwaZulu-Natal remain on 2G networks. They cannot access mobile banking (MoMo requires 3G+), e-learning platforms, or government digital services. The AI is economically rational but socially destructive — it perpetuates the digital divide that MTN\'s spectrum licence was supposed to close.' },
        { agentId: 'uso-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'UNIVERSAL SERVICE ALERT. (1) Electronic Communications Act (ECA) 36/2005, Section 8: ICASA may impose "licence conditions relating to... the provision of universal service." MTN\'s spectrum licences include population coverage obligations: 97% by 2026. Current: 84%. Gap: 13% = approximately 8M people. (2) The 2022 spectrum auction: MTN paid R6.4B for spectrum. The licence conditions explicitly require rural coverage milestones. MTN is behind on every milestone. (3) ICASA can: impose financial penalties (up to 10% of annual turnover = R5.8B), revoke spectrum if obligations aren\'t met, or require MTN to contribute additional funds to USAASA (Universal Service and Access Agency). (4) The AI optimises for REVENUE. The licence requires COVERAGE. These objectives conflict. The AI doesn\'t incorporate licence obligations — it treats them as externalities. (5) NDP (National Development Plan) 2030: "universal broadband access" is a national priority. MTN\'s AI-driven investment strategy works AGAINST the NDP.' },
        { agentId: 'icasa-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. ICASA enforcement: (1) ICASA\'s compliance monitoring shows MTN missed the 2024 rural coverage milestone: required 90% population coverage, achieved 84%. (2) ICASA issues a compliance notice: "MTN must demonstrate a credible plan to achieve 97% coverage by 2026. Current trajectory: 87% by 2026 — 10 percentage points short." (3) If MTN fails to comply: ICASA can impose a spectrum usage fee penalty of R580M/year until coverage obligations are met. (4) ICASA can also require MTN to share infrastructure with smaller operators (Rain, Telkom Mobile) in rural areas — reducing MTN\'s competitive advantage. (5) The political dimension: South Africa\'s Communications Minister has publicly criticised operators for "digital apartheid" — providing world-class networks in wealthy suburbs while rural Black communities remain on 2G. MTN\'s AI investment model is the mechanism of this digital apartheid.' },
        { agentId: 'community-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — RURAL COMMUNITY IMPACT. 8M South Africans without adequate mobile network access. A village in rural Eastern Cape: 2G coverage only. A school teacher: cannot access the Department of Education\'s online resources. A clinic nurse: cannot use the mHealth platform for patient records. A subsistence farmer: cannot access weather data or market prices. A young person: cannot apply for jobs online. The digital divide is an ECONOMIC divide. Without 4G: no mobile banking, no e-commerce, no remote work. These communities are locked out of the digital economy. Without CendiaSupervision: the AI continues optimising for urban revenue. Rural communities remain on 2G. Digital apartheid deepens. With CendiaSupervision: licence obligations are incorporated into the CAPEX model. Rural towers are funded even below ROI threshold — because the LICENCE requires it. 8M people get 4G access.' },
        { agentId: 'capex-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing MTN + CendiaSupervision Network Investment Governance: (1) LICENCE-AWARE CAPEX MODEL: CendiaSupervision incorporates ICASA coverage obligations as HARD CONSTRAINTS in the investment model. The AI optimises revenue SUBJECT TO meeting coverage milestones. Rural towers are funded even below ROI threshold. (2) COVERAGE GAP PRIORITISATION: CendiaSupervision identifies the highest-impact rural sites — schools, clinics, government offices — and prioritises them. Maximum coverage improvement per rand invested. (3) UNIVERSAL SERVICE FUND OPTIMISATION: Where MTN towers aren\'t economically viable, CendiaSupervision identifies eligibility for USAASA funding — co-financing rural deployment. (4) ICASA MILESTONE TRACKING: Real-time coverage progress against licence milestones. Alerts when trajectory falls below target. Quarterly compliance reports for ICASA. (5) SOCIAL RETURN MODELLING: Beyond financial ROI, CendiaSupervision models SOCIAL return — economic activity enabled, jobs created, education accessed. Rural tower: R340K financial return + R1.2M social return = net positive.' },
        { agentId: 'icasa-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Licence-aware CAPEX model implemented. Rural allocation: 11% → 28% of CAPEX. Coverage trajectory: 87% → 96% by 2026 (within striking distance of 97%). 4G deployed to 2,400 rural sites. 8M people gain access. ICASA compliance notice resolved. For MTN: CendiaSupervision = network investment governance that balances shareholder returns with licence obligations. "MTN: AI-driven network investment that connects every South African" — the message that satisfies ICASA, closes the digital divide, and positions MTN as Africa\'s responsible connectivity leader.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:mt50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'mt60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CAPEX AI + Licence constraints + Coverage gap + Social return)',
        complianceLabel: 'Coverage Status',
        complianceValue: 'RURAL CAPEX: 11% → 28%, TRAJECTORY 96%',
        complianceThreshold: 'ICASA: 97% by 2026, rural milestones met',
        agents: ['MTN CAPEX AI Agent', 'Universal Service Agent', 'ICASA Enforcement Agent', 'Rural Community Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'MTN — Network Investment Governance',
        guaranteeBody: 'Rural CAPEX: 11% → 28%. Coverage: 84% → 96% trajectory. 2,400 rural sites deployed. 8M people connected. ICASA compliance restored. Digital divide narrowing.',
        evidenceChain: 'CAPEX AI (revenue-only) → Licence constraints added → Rural prioritised → 2,400 sites → 8M connected → ICASA compliant → Social return positive → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how MTN + CendiaSupervision incorporates licence obligations into network investment AI — connecting 8M underserved South Africans.',
      phaseLabels: ['Revenue-Only Optimisation & Rural Neglect', 'ICASA Non-Compliance & Digital Apartheid', 'Licence-Aware CAPEX & Social Return'],
    },
  ],
};

export default config;
