/**
 * Samsung Electronics Sandbox Config
 *
 * 3 fully scripted multi-agent deliberation scenarios for AI governance.
 * Access: /sandbox/samsung (Key: SE-71)
 *
 * @module pages/sandbox/configs/samsung
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Samsung Electronics',
  accessKey: 'SE-71',
  sessionKey: 'samsung-sandbox-unlocked',

  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',
  footerNote: 'Samsung Electronics AI Governance Sandbox — CendiaSupervision demonstration  environment. Scenarios are illustrative and do not represent actual Samsung systems or incidents.',

  scenarios: [
    // SCENARIO 1 — SAMSUNG: KOREAN PIPA AI PROFILING
    {
      id: 'samsung-pipa-profiling',
      title: 'Samsung AI — Korean PIPA Automated Profiling Violation',
      subtitle: 'Galaxy AI · User behaviour profiling · PIPC investigation · ₩4.8B fine',
      banner: 'Simulating the Korean data protection crisis: Samsung Galaxy AI profiles user behaviour across devices (phone, TV, fridge, watch) to deliver personalised recommendations. The profiling constitutes "automated decision-making" under Korea\'s amended PIPA. Users were not informed of their right to refuse profiling. The Personal Information Protection Commission (PIPC) investigates.',
      risk: 'Critical',
      scenarioNum: 'PIPA',
      icon: 'smartphone',
      color: 'text-blue-400',
      agents: [
        { id: 'galaxy-ai', name: 'Galaxy AI Agent', role: 'Cross-Device Profiling & Recommendations', icon: '📱', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'pipa-counsel', name: 'PIPA Counsel Agent', role: 'Korean Data Protection Compliance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'pipc-agent', name: 'PIPC Investigation Agent', role: 'Regulatory Enforcement & Penalties', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'consumer-kr', name: 'Consumer Rights Agent', role: 'User Autonomy & Opt-Out Rights', icon: '👤', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Galaxy AI Platform', status: 'connected', type: 'Cross-Device AI', icon: 'cpu', detail: 'Profiling across 5 device categories — 340M active users globally' },
        { name: 'PIPA Compliance', status: 'connected', type: 'Korean Privacy', icon: 'shield', detail: 'Amended PIPA Art. 37-2: automated decision-making rights' },
        { name: 'PIPC Portal', status: 'connected', type: 'Enforcement', icon: 'alert-triangle', detail: 'Consumer complaints: 12,000+ about unwanted profiling' },
        { name: 'EU AI Act Module', status: 'syncing', type: 'Export Compliance', icon: 'globe', detail: 'Galaxy devices sold in EU — AI Act high-risk classification possible' },
      ],
      script: [
        { agentId: 'galaxy-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Galaxy AI cross-device intelligence platform — active across 340M devices globally. The system profiles user behaviour across Samsung ecosystem: Galaxy phone (app usage, location, browsing), Samsung TV (viewing habits, content preferences), Samsung refrigerator (food purchasing patterns, family size inference), Galaxy Watch (health data, activity patterns, sleep). AI combines these signals into a unified user profile for "personalised experiences": targeted ads, content recommendations, smart home automation, health insights. CRITICAL ISSUE: Korea\'s amended Personal Information Protection Act (PIPA), effective September 2023, added Article 37-2: "Rights related to automated decision-making." Under Art. 37-2: (1) Data subjects have the RIGHT TO BE INFORMED when they are subject to automated profiling. (2) Data subjects have the RIGHT TO REFUSE automated profiling. (3) Data subjects can REQUEST EXPLANATION of the automated decision logic. Samsung\'s Galaxy AI setup flow does NOT inform users about cross-device profiling. There is no opt-out mechanism for unified profiling. 12,000+ complaints filed with the PIPC.' },
        { agentId: 'pipa-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'PIPA COMPLIANCE ALERT. The amended PIPA creates specific obligations: (1) Art. 37-2(1): "A data subject has the right to refuse a decision based solely on automated processing, including profiling, which produces legal effects or significantly affects the data subject." Cross-device profiling that determines ad pricing, content access, insurance premiums, or credit offers "significantly affects" the user. (2) Art. 37-2(2): The data controller must PROACTIVELY inform data subjects of automated profiling — not bury it in a 47-page privacy policy. (3) The PIPC interpretation: cross-device profiling that combines health data (watch) with purchasing data (fridge) with location data (phone) is EXACTLY the type of profiling Art. 37-2 was designed to regulate. (4) Additionally: health data from Galaxy Watch is "sensitive information" under PIPA Art. 23. Processing sensitive information requires EXPLICIT consent — not the general consent obtained during device setup. (5) EU AI Act exposure: Galaxy devices sold in the EU may classify this profiling as "high-risk AI" under Annex III — requiring conformity assessment, risk management, and human oversight.' },
        { agentId: 'pipc-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. PIPC enforcement analysis: (1) 12,000+ complaints trigger a mandatory investigation under PIPA Art. 64. The PIPC has authority to: conduct on-site inspections of Samsung\'s AI systems, order corrective measures including system shutdown, and impose administrative fines. (2) Fine calculation: PIPA Art. 75 allows fines of up to 3% of related revenue. Samsung\'s connected device ecosystem generates approximately ₩160T ($120B) annually. 3% = ₩4.8T ($3.6B) maximum. Realistic fine: ₩4.8B-₩48B ($3.6M-$36M) based on PIPC precedent. (3) The PIPC ordered Meta/Facebook to pay ₩6.7B in 2022 for similar profiling violations. Samsung\'s violation is larger in scale (340M users vs Meta Korea\'s ~18M). (4) Corrective order: the PIPC will likely require Samsung to implement opt-out mechanisms within 90 days, re-obtain consent for cross-device profiling, and delete profiles of users who don\'t re-consent. The operational cost of re-consent across 340M users is enormous.' },
        { agentId: 'consumer-kr', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CONSUMER RIGHTS. Korean consumers expect Samsung to lead on privacy — Samsung is Korea\'s national champion. The profiling scandal damages Samsung\'s brand in its home market. Specific consumer harms: (1) A Galaxy Watch user\'s health data (irregular heartbeat detection) was combined with their phone browsing data (searching for life insurance). The unified profile was used to serve insurance ads at HIGHER premiums — the AI inferred the user was a health risk. (2) A Samsung TV user\'s viewing habits (children\'s programming) were combined with fridge data (baby food purchases) to infer a new baby — the profile was sold to third-party advertisers for baby product targeting before the user publicly announced the pregnancy. (3) These are not hypothetical — they are the exact scenarios Korean consumer groups cited in their PIPC complaints. Without CendiaSupervision: Samsung continues profiling until PIPC enforcement. With CendiaSupervision: profiling governance is built into Galaxy AI from the start.' },
        { agentId: 'galaxy-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Galaxy AI + CendiaSupervision PIPA Governance: (1) PROFILING TRANSPARENCY: Every cross-device profiling decision is logged and explainable. Users see: "Galaxy AI combined your phone, TV, and watch data to recommend [X]. Here\'s why." (2) GRANULAR OPT-OUT: Users can opt out of cross-device profiling entirely OR selectively (e.g., "use my phone data but not my watch health data for recommendations"). (3) SENSITIVE DATA ISOLATION: Health data from Galaxy Watch is NEVER combined with other device data without explicit Art. 23 consent. A separate consent flow for health data profiling. (4) EU AI ACT PRE-COMPLIANCE: For Galaxy devices sold in the EU, CendiaSupervision applies the higher EU AI Act standard — conformity assessment documentation, risk management, and human oversight for high-risk profiling. (5) PIPC AUDIT READINESS: Every profiling decision is sealed with evidence — consent basis, data sources, opt-out status, sensitive data handling. Ready for PIPC inspection.' },
        { agentId: 'pipc-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The profiling governance satisfies Art. 37-2. Users are informed, can refuse, and can request explanations. Sensitive health data is isolated. The PIPC investigation finds Samsung\'s governance exceeds requirements. No fine. No corrective order. For Samsung: Galaxy AI + CendiaSupervision = privacy governance that works across Korea, EU, and all 70+ markets where Galaxy devices are sold. "Samsung Galaxy AI: cross-device intelligence with user-controlled profiling" — the message that turns a privacy liability into a competitive advantage over Apple and Google.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:se10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'se20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Galaxy AI profiling + PIPA Art. 37-2 + Opt-out + Sensitive data isolation)',
        complianceLabel: 'PIPA Status',
        complianceValue: 'ART. 37-2 COMPLIANT — OPT-OUT ENABLED',
        complianceThreshold: 'Cross-device profiling: transparent, refusable, explainable',
        agents: ['Galaxy AI Agent', 'PIPA Counsel Agent', 'PIPC Investigation Agent', 'Consumer Rights Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Galaxy AI — PIPA Profiling Governance',
        guaranteeBody: 'Cross-device profiling governance: users informed per Art. 37-2, granular opt-out enabled, health data isolated under Art. 23, EU AI Act pre-compliance applied. PIPC audit-ready.',
        evidenceChain: 'Galaxy AI (5 devices) → Profiling logged → Art. 37-2 notice → Opt-out enabled → Health data isolated → EU AI Act documented → PIPC audit-ready → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Galaxy AI + CendiaSupervision implements PIPA-compliant cross-device profiling with granular user controls.',
      phaseLabels: ['Cross-Device Profiling & PIPA Gap', 'PIPC Investigation & Consumer Harm', 'Profiling Transparency & Opt-Out Governance'],
    },

    // SCENARIO 2 — SAMSUNG: SEMICONDUCTOR YIELD AI & EXPORT CONTROLS
    {
      id: 'samsung-export-control',
      title: 'Samsung Foundry — AI Yield Data & Export Control Violation',
      subtitle: 'Advanced node yield AI · China customer · BIS Entity List · $2.4B contract at risk',
      banner: 'Simulating the semiconductor export control crisis: Samsung Foundry uses AI to optimise chip yield at advanced nodes (3nm). The AI system contains proprietary yield data that constitutes controlled technology under US Export Administration Regulations (EAR). A Chinese customer requests yield optimisation data. Providing it may violate BIS export controls.',
      risk: 'Critical',
      scenarioNum: 'Export',
      icon: 'cpu',
      color: 'text-red-400',
      agents: [
        { id: 'foundry-ai', name: 'Samsung Foundry AI Agent', role: 'Yield Optimisation & Process Control', icon: '🔬', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'export-counsel', name: 'Export Control Agent', role: 'EAR/BIS Compliance & Classification', icon: '🌐', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'bis-enforce', name: 'BIS Enforcement Agent', role: 'Entity List & Denial Orders', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'commercial', name: 'Commercial Agent', role: 'Customer Relations & Revenue Impact', icon: '💼', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Foundry AI', status: 'connected', type: 'Yield Optimisation', icon: 'cpu', detail: '3nm yield data — ECCN 3E991 controlled technology' },
        { name: 'BIS Entity List', status: 'connected', type: 'Export Controls', icon: 'shield', detail: 'Customer subsidiary: Entity List designated (Oct 2022)' },
        { name: 'Customer Portal', status: 'connected', type: 'Foundry Services', icon: 'briefcase', detail: 'Chinese fabless customer — $2.4B annual foundry contract' },
        { name: 'KITA/MOTIE', status: 'syncing', type: 'Korean Export', icon: 'flag', detail: 'Korean Strategic Trade Act compliance — dual-use technology' },
      ],
      script: [
        { agentId: 'foundry-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Samsung Foundry AI yield optimisation system for 3nm GAA (Gate-All-Around) process. The AI analyses wafer-level defect patterns, lithography alignment data, and process variation to optimise yield from 68% to 84%. Customer request: ChipDesign Corp (Chinese fabless company, $2.4B annual contract) requests access to yield optimisation reports for their 3nm tape-out. Standard foundry practice: customers receive yield data to optimise their chip designs for the foundry\'s process. CRITICAL ISSUE: (1) The yield optimisation AI contains Samsung\'s proprietary process technology — specifically, defect density maps, EUV lithography calibration data, and process window parameters for 3nm GAA. (2) This data is classified under ECCN 3E991 ("technology for the production of semiconductor devices") — controlled for export to certain destinations. (3) ChipDesign Corp\'s parent company was added to the BIS Entity List in October 2022. While ChipDesign Corp itself is not listed, the Entity List restriction extends to "related entities" — subsidiaries and affiliates. (4) Additionally: Korea\'s Strategic Trade Act requires Samsung to obtain MOTIE approval for transfer of controlled semiconductor technology. Samsung\'s export compliance team has not been consulted on this customer request.' },
        { agentId: 'export-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'EXPORT CONTROL ALERT. Multi-jurisdictional analysis: (1) US EAR: The 3nm yield data is ECCN 3E991 controlled technology. Export to an Entity List-designated entity requires a BIS license. License applications for advanced semiconductor technology to Entity List Chinese companies face a "presumption of denial." (2) The "foreign direct product rule" (FDPR): Samsung\'s 3nm process uses US-origin EUV lithography equipment (ASML systems with US components). Under the FDPR: any technology produced using US-origin equipment is subject to EAR — even when Samsung (a Korean company) transfers it to a Chinese customer. (3) Korean Strategic Trade Act: 3nm semiconductor technology is on Korea\'s strategic items list. Transfer requires MOTIE pre-approval. Samsung needs BOTH US BIS license AND Korean MOTIE approval. (4) Risk: if Samsung provides the yield data without licenses: US sanctions (denial order barring Samsung from purchasing US equipment — catastrophic for a foundry that depends on ASML, Applied Materials, Lam Research), Korean penalties (criminal liability under Strategic Trade Act), and loss of CHIPS Act subsidy eligibility for Samsung\'s $17B Texas fab.' },
        { agentId: 'bis-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. BIS enforcement consequences: (1) A denial order would prohibit Samsung from purchasing ANY US-origin items — including EUV lithography equipment, etch tools, deposition systems, and inspection equipment. Samsung\'s entire foundry operation depends on US equipment. A denial order is existential. (2) BIS has enforced against non-US companies: the 2020 Huawei FDPR action demonstrated that BIS will restrict foreign companies using US technology. Samsung is equally vulnerable. (3) The $2.4B customer contract is insignificant compared to: Samsung\'s $17B CHIPS Act investment in Texas (which requires export control compliance), Samsung\'s $100B+ annual semiconductor revenue (which depends on US equipment access), and Samsung\'s foundry competitiveness (which requires continued access to next-gen EUV from ASML). (4) Even ATTEMPTING to obtain a license for this transfer signals to BIS that Samsung is doing business with Entity List entities — increasing scrutiny on ALL Samsung export activities.' },
        { agentId: 'commercial', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — COMMERCIAL IMPACT. The $2.4B contract with ChipDesign Corp is significant — but losing US equipment access destroys $100B+ in revenue. The commercial calculus is clear: decline the data request. But the commercial team didn\'t know about the Entity List connection — ChipDesign Corp\'s ownership structure is complex (3 layers of holding companies between ChipDesign and the listed parent). Without CendiaSupervision: the yield data request goes through normal channels. A foundry engineer shares the data because "it\'s standard customer service." The export control violation is discovered months later during an internal audit. By then: the data has been transferred, the violation is complete, and Samsung must self-disclose to BIS. With CendiaSupervision: the customer request triggers an automatic Entity List screen. The ownership chain is traced. The request is blocked before any data is shared.' },
        { agentId: 'foundry-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Samsung Foundry + CendiaSupervision Export Control Governance: (1) AUTOMATIC ENTITY LIST SCREENING: Every customer data request is screened against BIS Entity List, OFAC SDN, Korean strategic trade lists, and EU sanctions lists. Screening includes ownership chain analysis (parent companies, subsidiaries, affiliates). (2) ECCN CLASSIFICATION: All foundry AI output is pre-classified by ECCN. 3nm yield data = ECCN 3E991 = controlled. The system knows BEFORE a request arrives whether the data is controlled. (3) FDPR TRACKING: CendiaSupervision tracks which foundry processes use US-origin equipment. Any output from those processes is automatically flagged for FDPR analysis. (4) DUAL-JURISDICTION COMPLIANCE: Both US BIS and Korean MOTIE requirements are checked simultaneously. If either jurisdiction requires a license: HARD STOP until both licenses are obtained. (5) ENGINEER TRAINING GATE: Foundry engineers cannot share controlled data without export compliance sign-off. The system blocks the transfer at the technical level — not just the policy level.' },
        { agentId: 'bis-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Entity List screening catches the ownership chain. The data request is blocked. Samsung\'s export compliance team is notified. The customer is informed that the request cannot be fulfilled due to export control restrictions. The $2.4B contract continues for non-controlled services. Samsung\'s CHIPS Act eligibility is preserved. US equipment access is maintained. For Samsung: CendiaSupervision = export control governance that protects the entire semiconductor business. "Every foundry data request is screened against 4 sanctions lists with ownership chain analysis" — the feature that prevents a $2.4B customer request from becoming a $100B+ existential threat.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:se30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'se40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Foundry AI + Entity List screen + ECCN classification + FDPR check)',
        complianceLabel: 'Export Control Status',
        complianceValue: 'ENTITY LIST MATCH — TRANSFER BLOCKED',
        complianceThreshold: 'ChipDesign Corp → parent on Entity List (Oct 2022)',
        agents: ['Samsung Foundry AI Agent', 'Export Control Agent', 'BIS Enforcement Agent', 'Commercial Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Samsung Foundry — Export Control Governance',
        guaranteeBody: 'Entity List screening caught ownership chain (3 layers). ECCN 3E991 data transfer blocked. FDPR analysis: US-origin equipment in process. Dual-jurisdiction (BIS + MOTIE) compliance documented. CHIPS Act eligibility preserved.',
        evidenceChain: 'Customer request → Entity List screen → Ownership chain traced → Parent listed (Oct 2022) → ECCN 3E991 → FDPR flagged → Transfer blocked → Compliance sign-off → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Samsung Foundry + CendiaSupervision catches an Entity List connection buried 3 layers deep — preventing an export control violation that could cost $100B+.',
      phaseLabels: ['Yield Data Request & Entity List Gap', 'Denial Order & CHIPS Act Risk', 'Screening & Dual-Jurisdiction Compliance'],
    },

    // SCENARIO 3 — SAMSUNG: EU AI ACT GALAXY BIXBY CLASSIFICATION
    {
      id: 'samsung-eu-ai-act',
      title: 'Samsung Bixby — EU AI Act High-Risk Misclassification',
      subtitle: 'Bixby health recommendations · Annex III category · CE marking gap · Market access risk',
      banner: 'Simulating the EU market access crisis: Samsung\'s Bixby AI assistant provides health-related recommendations through Galaxy Watch integration. Under the EU AI Act, AI systems that make health-related inferences may be classified as "high-risk" under Annex III. Samsung classified Bixby as "limited risk." The EU Commission disagrees.',
      risk: 'High',
      scenarioNum: 'EUAI',
      icon: 'shield',
      color: 'text-violet-400',
      agents: [
        { id: 'bixby-ai', name: 'Bixby AI Agent', role: 'Voice Assistant & Health Recommendations', icon: '🗣️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'euai-counsel', name: 'EU AI Act Agent', role: 'Risk Classification & Conformity Assessment', icon: '🇪🇺', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'market-access', name: 'Market Access Agent', role: 'CE Marking & EU Distribution', icon: '🏪', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'product-mgr', name: 'Product Management Agent', role: 'Feature Design & Compliance Integration', icon: '📱', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Bixby Platform', status: 'connected', type: 'AI Assistant', icon: 'cpu', detail: 'Bixby health features: sleep coaching, stress management, heart rhythm alerts' },
        { name: 'EU AI Act Database', status: 'connected', type: 'Classification', icon: 'database', detail: 'Annex III, Category 5(b): AI in health — potential high-risk' },
        { name: 'CE Marking System', status: 'connected', type: 'Market Access', icon: 'check-circle', detail: 'Current: limited-risk classification — no conformity assessment' },
        { name: 'EU Market Data', status: 'syncing', type: 'Revenue', icon: 'bar-chart', detail: 'EU Galaxy device revenue: €18.4B annually — at risk if non-compliant' },
      ],
      script: [
        { agentId: 'bixby-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Bixby AI health features on Galaxy Watch Ultra and Galaxy Ring: (1) Sleep Coaching: AI analyses sleep patterns and provides personalised recommendations ("You should go to bed 45 minutes earlier based on your circadian rhythm analysis"). (2) Stress Management: AI monitors heart rate variability and suggests interventions ("Your stress level is elevated. Try the guided breathing exercise."). (3) Heart Rhythm Alerts: AI detects irregular heart rhythms and recommends actions ("Irregular heart rhythm detected 3 times this week. Consider consulting a healthcare provider."). Samsung classified these features as "limited risk" under the EU AI Act — requiring only transparency obligations (telling users they\'re interacting with AI). CRITICAL ISSUE: The EU AI Act Annex III, Category 5(b) lists "AI systems intended to be used as safety components in the management and operation of... medical devices" as HIGH-RISK. Samsung\'s Galaxy Watch has a CE-marked ECG feature (medical device). Bixby\'s heart rhythm alerts use ECG data from the medical device feature to make health recommendations. This integration may classify Bixby\'s health features as high-risk AI — requiring full conformity assessment, risk management system, data governance, human oversight, and registration in the EU AI database.' },
        { agentId: 'euai-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'EU AI ACT CLASSIFICATION ALERT. Analysis of Bixby health features against Annex III: (1) The heart rhythm alert uses data from a CE-marked medical device (Galaxy Watch ECG). Any AI that processes medical device output to make health recommendations falls within Annex III, Category 5(b). Classification: HIGH-RISK. (2) Sleep coaching and stress management: these use biometric data (heart rate, HRV, accelerometer) to make health-related inferences. Under Annex III, Category 5(a): "AI systems intended to be used for making inferences about the physical or mental health status of natural persons." Classification: likely HIGH-RISK. (3) Samsung\'s "limited risk" classification assumes Bixby is just a "general-purpose AI assistant." But when Bixby processes health data and makes health recommendations, it\'s operating as a health AI system — not a general assistant. (4) Consequences of misclassification: Article 49 — placing a non-compliant high-risk AI system on the EU market. Fine: up to €35M or 7% of global turnover. Samsung\'s global turnover: ~€200B. Maximum fine: €14B. Realistic: €35M-€200M plus potential market withdrawal of non-compliant devices.' },
        { agentId: 'market-access', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. EU market consequences: (1) If the EU Commission determines Bixby health features are high-risk and Samsung hasn\'t completed conformity assessment: Samsung must either disable health features on EU Galaxy devices or withdraw devices from the EU market until compliance is achieved. (2) Disabling health features: Galaxy Watch loses its key differentiator in the EU. Apple Watch retains health features (Apple likely classified correctly). Samsung loses EU wearable market share. (3) Device withdrawal: €18.4B annual EU revenue at risk. Even temporary withdrawal damages retailer relationships and consumer confidence. (4) Timeline: conformity assessment for high-risk AI takes 6-12 months. During that period: Samsung\'s EU health features are offline. Apple, Google, and Huawei fill the gap. (5) The classification question will be public. Tech media: "Samsung misclassified its health AI — EU forces feature removal." The brand damage extends beyond Europe to every market where consumers compare Samsung and Apple.' },
        { agentId: 'product-mgr', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PRODUCT MANAGEMENT. I designed Bixby\'s health features for the Galaxy Watch launch. I didn\'t consult with the EU AI Act compliance team because "Bixby is just an assistant — limited risk." The EU AI Act classification depends on the FUNCTION, not the product label. Bixby IS a general assistant — but its health features are a health AI system that happens to be delivered through an assistant interface. Without CendiaSupervision: we launch with "limited risk" classification. The EU Commission challenges it 6 months later. We spend 12 months on conformity assessment while competitors capture our EU health wearable market. With CendiaSupervision: feature-level AI Act classification catches the health features as high-risk BEFORE launch. Conformity assessment is completed pre-launch. We enter the EU market compliant from day one.' },
        { agentId: 'bixby-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Bixby + CendiaSupervision EU AI Act Governance: (1) FEATURE-LEVEL CLASSIFICATION: CendiaSupervision classifies each Bixby feature independently against Annex III — not the entire Bixby platform. Health features = high-risk. General assistant = limited risk. (2) CONFORMITY ASSESSMENT: For high-risk features, CendiaSupervision generates the required documentation: risk management system, data governance measures, technical documentation, human oversight mechanisms, accuracy/robustness testing. (3) EU AI DATABASE REGISTRATION: High-risk features are registered in the EU AI database before market placement — as required by Article 51. (4) HUMAN OVERSIGHT: Health recommendations include a mandatory disclaimer and a "consult healthcare provider" pathway — satisfying the human oversight requirement. (5) MARKET-SPECIFIC FEATURE GATING: CendiaSupervision gates features by market. EU users get the conformity-assessed version. Other markets get the standard version. Feature parity is maintained while compliance differs by jurisdiction.' },
        { agentId: 'market-access', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Feature-level classification identifies health features as high-risk pre-launch. Conformity assessment completed. EU AI database registration filed. Galaxy Watch launches in the EU with FULL health features — compliant from day one. Samsung is the FIRST wearable manufacturer with EU AI Act-compliant health AI. For Samsung: CendiaSupervision = EU market access governance. "Samsung Galaxy Watch: the first EU AI Act-compliant health wearable" — that\'s the marketing message that turns regulatory compliance into competitive advantage. While competitors scramble to classify their health AI, Samsung is already selling.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:se50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'se60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Bixby health AI + EU AI Act classification + Conformity assessment + Market access)',
        complianceLabel: 'EU AI Act Status',
        complianceValue: 'HIGH-RISK — CONFORMITY ASSESSED',
        complianceThreshold: 'Annex III Cat. 5(a)(b): health features classified correctly',
        agents: ['Bixby AI Agent', 'EU AI Act Agent', 'Market Access Agent', 'Product Management Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Bixby AI — EU AI Act Compliance',
        guaranteeBody: 'Feature-level classification: health features = high-risk (Annex III Cat. 5). Conformity assessment completed pre-launch. EU AI database registered. Human oversight implemented. €18.4B EU market access preserved.',
        evidenceChain: 'Bixby health features → Feature-level classification → Annex III match → High-risk → Conformity assessment → EU database registered → CE marking updated → Market access preserved → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Bixby + CendiaSupervision performs feature-level EU AI Act classification — ensuring Galaxy Watch launches compliant in the EU from day one.',
      phaseLabels: ['Limited Risk Misclassification & Health AI', 'EU Market Withdrawal & Revenue Risk', 'Feature-Level Classification & Conformity'],
    },
  ],
};

export default config;
