/**
 * Grab Sandbox Config
 * Access: /sandbox/grab (Key: GR-74)
 * @module pages/sandbox/configs/grab
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'Grab',
  accessKey: 'GR-74',
  sessionKey: 'grab-sandbox-unlocked',
  accent: 'emerald',
  accentColor: 'text-emerald-400',
  accentHover: 'from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600',
  ringColor: 'focus:ring-emerald-500/30',
  borderColor: 'border-emerald-500/30',
  gradientFrom: 'from-emerald-600/20',
  gradientTo: 'to-emerald-900/20',
  footerNote: 'Grab AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual Grab systems or incidents.',

  scenarios: [
    // SCENARIO 1 — GRAB: MAS AI LENDING DISCRIMINATION
    {
      id: 'grab-mas-lending',
      title: 'GrabFin AI — MAS Fair Lending Violation',
      subtitle: 'AI credit scoring · Ethnic proxy bias · MAS enforcement · S$2.4M fine',
      banner: 'Simulating the Singapore fintech crisis: GrabFin\'s AI credit scoring model uses postal code as a feature. In Singapore, postal codes correlate strongly with ethnicity due to the HDB ethnic integration policy. The model discriminates against Malay borrowers. MAS investigates under the Fair Dealing Guidelines.',
      risk: 'Critical',
      scenarioNum: 'MAS',
      icon: 'credit-card',
      color: 'text-emerald-400',
      agents: [
        { id: 'grabfin-ai', name: 'GrabFin AI Agent', role: 'Credit Scoring & Lending Decisions', icon: '💳', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'mas-counsel', name: 'MAS Compliance Agent', role: 'Fair Dealing & FEAT Principles', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'mas-enforce', name: 'MAS Enforcement Agent', role: 'Supervisory Actions & Penalties', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'borrower-agent', name: 'Borrower Impact Agent', role: 'Financial Inclusion & Consumer Harm', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'GrabFin Credit AI', status: 'connected', type: 'Lending', icon: 'cpu', detail: 'AI credit scoring: 2.8M applications/year across SEA' },
        { name: 'MAS FEAT Framework', status: 'connected', type: 'AI Governance', icon: 'shield', detail: 'Fairness, Ethics, Accountability, Transparency principles' },
        { name: 'Bias Analysis', status: 'connected', type: 'Fairness Audit', icon: 'bar-chart', detail: 'Malay approval rate: 31% vs Chinese: 62% — postal code proxy' },
        { name: 'MAS Portal', status: 'syncing', type: 'Enforcement', icon: 'alert-triangle', detail: 'MAS investigation: ethnic proxy discrimination in credit AI' },
      ],
      script: [
        { agentId: 'grabfin-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'GrabFin AI credit scoring for personal loans (S$1K-S$10K). Model features: GrabPay transaction history, ride frequency, merchant spending patterns, employment sector, income estimate, and POSTAL CODE. Model performance: overall approval rate 48%, default rate 3.2% — strong metrics. CRITICAL ISSUE: CendiaSupervision fairness audit by ethnicity: Chinese Singaporean approval rate: 62%. Indian Singaporean: 44%. Malay Singaporean: 31%. The disparity source: POSTAL CODE. Singapore\'s HDB Ethnic Integration Policy (EIP) ensures ethnic quotas in public housing blocks. This means postal codes in Singapore correlate strongly with the ethnic composition of the block. The AI learned: certain postal codes (Malay-majority blocks) → lower creditworthiness. This is ethnic proxy discrimination. The model doesn\'t use "ethnicity" as a feature — but postal code IS ethnicity in Singapore due to the EIP.' },
        { agentId: 'mas-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'MAS COMPLIANCE ALERT. (1) MAS FEAT Principles (Fairness): "AI-driven decisions should not systematically disadvantage individuals based on their personal attributes, including race, ethnicity, and religion." Postal code proxy for ethnicity violates FEAT Fairness. (2) MAS Notice on Fair Dealing: financial institutions must "have proper systems and controls to ensure that their representatives and agents treat customers fairly." An AI that discriminates by ethnicity is NOT fair dealing. (3) MAS Technology Risk Management (TRM) Guidelines: require "appropriate testing of AI models for bias before deployment." GrabFin did not test for ethnic proxy bias — only overall model accuracy. (4) Singapore Constitution Art. 12: equality before the law. Art. 152: government shall "recognise the special position of the Malays" — making discrimination against Malays particularly sensitive. (5) The Maintenance of Religious Harmony Act and Sedition Act: ethnic discrimination by a major platform could be treated as an act that promotes ill-will between races.' },
        { agentId: 'mas-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. MAS enforcement consequences: (1) MAS has authority under the Payment Services Act 2019 (GrabFin holds a Major Payment Institution license) to: revoke or suspend the license, impose financial penalties, and require remediation. (2) MAS penalty: up to S$1M per violation under PSA. Systematic discrimination across 2.8M applications: aggregate penalty S$2.4M+ plus remediation costs. (3) But the REAL consequence: license risk. GrabFin\'s MPI license is essential for GrabPay, GrabLend, and GrabInsure. License suspension = Grab\'s entire financial services business halts across Singapore, Malaysia, Indonesia, Thailand, Vietnam, and Philippines. (4) MAS will require: immediate removal of postal code from the model, retroactive review of ALL declined Malay applicants, and quarterly fairness audits for 3 years. (5) Political dimension: ethnic discrimination by a Singapore-headquartered "national champion" tech company is front-page news. Parliamentary questions. PM\'s office involvement.' },
        { agentId: 'borrower-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BORROWER IMPACT. 2,400 Malay borrowers were declined who would have been approved if they lived in a different postal code — same income, same spending patterns, same GrabPay history. These are GrabPay power users who chose Grab\'s financial services because of convenience and trust. The discrimination is invisible to them — they receive a generic "application declined" message. Without CendiaSupervision: the bias persists. 2,400 Malay borrowers per year are systematically excluded. Financial inclusion — Grab\'s stated mission — is undermined by Grab\'s own AI. With CendiaSupervision: the postal code proxy is caught during model validation. The feature is removed. Approval rates equalise. Grab delivers on its financial inclusion promise.' },
        { agentId: 'grabfin-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing GrabFin + CendiaSupervision FEAT Governance: (1) PROXY DETECTION: CendiaSupervision identifies features that correlate with protected attributes (postal code → ethnicity, age → gender in certain contexts). Proxy features are flagged for removal or debiasing. (2) FEAT FAIRNESS AUDIT: Every credit model is audited for disparate impact across MAS-protected categories (ethnicity, religion, age, gender) BEFORE deployment. Approval rate ratios below 80% trigger retraining. (3) ONGOING MONITORING: Post-deployment, approval and default rates are tracked by demographic. Drift toward disparity triggers automatic alerts. (4) EXPLAINABILITY: Every credit decision includes a FEAT-compliant explanation: "Your application was assessed based on: transaction history, income estimate, employment. Postal code was NOT used." (5) MAS REPORTING: Quarterly FEAT compliance reports generated automatically for MAS submission.' },
        { agentId: 'mas-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Postal code removed. Model retrained. Approval rates: Chinese 58%, Indian 52%, Malay 49% — within acceptable range. 2,400 previously declined Malay applicants re-evaluated: 1,800 approved. MAS finds GrabFin\'s FEAT governance exceeds industry standards. For Grab: CendiaSupervision = FEAT compliance that protects the MPI license across 6 SEA markets. "GrabFin: AI lending with FEAT-certified fairness" — the competitive advantage in a region where financial inclusion and ethnic harmony are government priorities.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:gr10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'gr20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (GrabFin AI + Proxy detection + FEAT audit + Ongoing monitoring)',
        complianceLabel: 'FEAT Status',
        complianceValue: 'PROXY REMOVED — RATES EQUALISED',
        complianceThreshold: 'Postal code proxy eliminated, approval rates within 80% ratio',
        agents: ['GrabFin AI Agent', 'MAS Compliance Agent', 'MAS Enforcement Agent', 'Borrower Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'GrabFin — FEAT Fair Lending Governance',
        guaranteeBody: 'Postal code ethnic proxy detected and removed. Malay approval rate: 31% → 49%. 1,800 previously declined applicants approved. MAS FEAT compliance certified. MPI license secured.',
        evidenceChain: 'GrabFin model → Proxy detection → Postal code = ethnicity → Feature removed → Retrained → Rates equalised → FEAT report → MAS audit-ready → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how GrabFin + CendiaSupervision catches ethnic proxy bias in AI lending — protecting 2,400 Malay borrowers and the MPI license.',
      phaseLabels: ['Postal Code Proxy & Ethnic Disparity', 'MAS Investigation & License Risk', 'Proxy Detection & FEAT Governance'],
    },

    // SCENARIO 2 — GRAB: CROSS-BORDER DATA LOCALISATION
    {
      id: 'grab-data-local',
      title: 'Grab Platform — Indonesia PDPL Data Localisation Breach',
      subtitle: 'Indonesian rider data in Singapore · PDPL violation · Kominfo block threat · 32M users at risk',
      banner: 'Simulating the Southeast Asian data sovereignty crisis: Grab processes Indonesian rider and driver data in Singapore-based servers. Indonesia\'s Personal Data Protection Law (PDPL) requires data localisation for certain categories. Kominfo threatens to block Grab in Indonesia — a market of 32M active users.',
      risk: 'Critical',
      scenarioNum: 'PDPL',
      icon: 'globe',
      color: 'text-red-400',
      agents: [
        { id: 'grab-platform', name: 'Grab Platform Agent', role: 'Regional Infrastructure & Data Routing', icon: '🌏', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'pdpl-counsel', name: 'PDPL Counsel Agent', role: 'Indonesian Data Protection & Localisation', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'kominfo-agent', name: 'Kominfo Enforcement Agent', role: 'Ministry of Communications & Block Authority', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'driver-impact', name: 'Driver Impact Agent', role: 'Gig Economy Livelihoods & Service Continuity', icon: '🛵', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Grab Platform', status: 'connected', type: 'Regional Infra', icon: 'cloud', detail: 'Centralised in Singapore: processes data from 8 SEA countries' },
        { name: 'Indonesia PDPL', status: 'connected', type: 'Data Localisation', icon: 'shield', detail: 'PDPL Art. 56: cross-border transfer requires equivalent protection' },
        { name: 'Kominfo Portal', status: 'connected', type: 'Enforcement', icon: 'alert-triangle', detail: 'Kominfo: 30-day compliance notice issued — block threat if non-compliant' },
        { name: 'Indonesia Operations', status: 'syncing', type: 'Market Data', icon: 'bar-chart', detail: '32M active users, 2.1M drivers — Indonesia is Grab\'s largest market' },
      ],
      script: [
        { agentId: 'grab-platform', phase: 'phase1', type: 'analysis', delay: 800, content: 'Grab platform architecture: centralised data processing in Singapore for all 8 SEA markets (Singapore, Indonesia, Malaysia, Thailand, Vietnam, Philippines, Cambodia, Myanmar). Indonesia data: 32M active users, 2.1M drivers, 840M rides/year. ALL Indonesian user data — ride history, location trails, payment data, driver identity documents, facial recognition biometrics for driver verification — is processed and stored in Singapore. CRITICAL ISSUE: Indonesia\'s Personal Data Protection Law (PDPL, Law No. 27/2022), effective October 2024: Art. 56 requires that cross-border transfers of personal data ensure "equivalent protection" in the receiving country. While Singapore has strong data protection (PDPA), the implementing regulations require SPECIFIC documentation: transfer impact assessments, data processing agreements with localisation provisions, and registration with the Ministry. Grab has NONE of these for its Indonesia-Singapore data flows. Additionally: Government Regulation No. 71/2019 (Electronic System and Transaction) requires PSEs to maintain local Indonesian data centres for "strategic electronic systems." Grab\'s ride-hailing platform likely qualifies.' },
        { agentId: 'pdpl-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'PDPL COMPLIANCE ALERT. (1) Art. 56: cross-border transfer requires the receiving country to have "equivalent" data protection OR the data controller must ensure adequate safeguards. Singapore\'s PDPA is generally considered adequate — but the implementing regulation requires a formal Transfer Impact Assessment (TIA) that Grab hasn\'t conducted. (2) GR 71/2019: strategic electronic systems must have local data centres. Ride-hailing with 32M users processing payment data = strategic. Kominfo can designate Grab as a strategic PSE requiring full localisation. (3) Biometric data (driver facial recognition): the PDPL treats biometric data as "specific personal data" (Art. 4) requiring explicit consent AND additional safeguards for cross-border transfer. Driver biometrics processed in Singapore without these safeguards = separate violation. (4) Payment data: Bank Indonesia (BI) requires payment system data to be processed and stored in Indonesia. GrabPay processing in Singapore violates BI Regulation No. 23/6/PBI/2021.' },
        { agentId: 'kominfo-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Kominfo enforcement: (1) Kominfo has issued a 30-day compliance notice under the PSE registration framework. Non-compliance: Kominfo can BLOCK Grab in Indonesia. Kominfo blocked Steam, PayPal, and Yahoo in July 2022 for PSE non-compliance — they will block Grab. (2) A Grab block in Indonesia: 32M users lose ride-hailing, food delivery, and payment services. 2.1M drivers lose their primary income source. Economic impact: $4.8B annual GMV disrupted. (3) Indonesia is Grab\'s LARGEST market — 40% of total GMV. Losing Indonesia = losing the company\'s financial viability. Investors react. Stock price impact. (4) Kominfo\'s demand: establish Indonesian data centres within 6 months, migrate all Indonesian user data to local infrastructure, and conduct TIA for any data that must be processed in Singapore for technical reasons. (5) Cost of compliance: $120M for Indonesian data centre buildout. Cost of non-compliance: $4.8B annual revenue loss + company viability threat.' },
        { agentId: 'driver-impact', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — DRIVER IMPACT. 2.1M Indonesian Grab drivers depend on the platform for their livelihood. Average driver income: Rp 4.5M/month ($280). A Kominfo block means 2.1M people lose their income overnight. These are not corporate employees with savings — they are gig workers living month to month. The human cost of data governance failure is measured in families who can\'t eat. Without CendiaSupervision: Grab delays compliance, hoping for regulatory negotiation. Kominfo blocks. 2.1M drivers lose income. Social unrest. Government intervention. With CendiaSupervision: data localisation requirements are mapped across all 8 markets. Indonesian data migration begins immediately. Compliance is achieved within 6 months. No block. No disruption. 2.1M livelihoods preserved.' },
        { agentId: 'grab-platform', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Grab + CendiaSupervision Data Sovereignty Governance: (1) MULTI-MARKET DATA MAPPING: CendiaSupervision maps every data category against every market\'s localisation requirements. Indonesia: user data localised. Malaysia: payment data localised. Thailand: certain government data localised. (2) AUTOMATIC ROUTING: Data is automatically routed to the correct jurisdiction based on user nationality and data category. Indonesian biometric data → Jakarta data centre. Payment data → Jakarta. General analytics → can be processed in Singapore with TIA. (3) TIA AUTOMATION: For data that must be processed cross-border, CendiaSupervision generates Transfer Impact Assessments compliant with each country\'s requirements. (4) REGULATORY MONITORING: CendiaSupervision monitors regulatory changes across all 8 SEA markets. When a new localisation requirement is announced: automatic impact assessment and migration timeline. (5) KOMINFO/BI REPORTING: Automated compliance reports for Indonesian regulators — demonstrating localisation status, TIA completion, and biometric safeguards.' },
        { agentId: 'kominfo-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Indonesian data centre operational. 32M user profiles migrated. Biometric data localised. Payment data: BI-compliant. TIA completed for cross-border analytics. Kominfo compliance confirmed — no block. For Grab: CendiaSupervision = data sovereignty governance across 8 SEA markets. Each market has different localisation rules. CendiaSupervision maps them all and routes data automatically. "Grab: your data stays in your country" — the trust message that strengthens Grab\'s position in every SEA market where data sovereignty is a government priority.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:gr30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'gr40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Grab platform + Data localisation + TIA + Multi-market routing)',
        complianceLabel: 'PDPL Status',
        complianceValue: 'INDONESIAN DATA LOCALISED',
        complianceThreshold: 'PDPL Art. 56 + GR 71/2019 + BI payment localisation',
        agents: ['Grab Platform Agent', 'PDPL Counsel Agent', 'Kominfo Enforcement Agent', 'Driver Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Grab — SEA Data Sovereignty Governance',
        guaranteeBody: 'Indonesian data localised: 32M user profiles, 2.1M driver biometrics, payment data. Jakarta data centre operational. TIA completed. Kominfo compliant. No block. 2.1M driver livelihoods preserved.',
        evidenceChain: 'Grab (Singapore centralised) → PDPL mapping → Indonesian data identified → Jakarta DC built → Data migrated → Biometrics localised → BI compliant → Kominfo confirmed → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Grab + CendiaSupervision implements Indonesian data localisation — preventing a Kominfo block that would affect 32M users.',
      phaseLabels: ['Centralised Architecture & PDPL Gap', 'Kominfo Block Threat & Driver Impact', 'Data Localisation & Multi-Market Routing'],
    },

    // SCENARIO 3 — GRAB: AI SURGE PRICING DISCRIMINATION
    {
      id: 'grab-surge-discrimination',
      title: 'Grab AI — Surge Pricing Targets Low-Income Neighbourhoods',
      subtitle: 'Dynamic pricing AI · Socioeconomic proxy · CCCS investigation · SGD $10M fine risk',
      banner: 'Simulating the ride-hailing fairness crisis: Grab\'s AI surge pricing algorithm charges systematically higher multipliers in low-income neighbourhoods — not because of supply/demand, but because the AI learned that price-sensitive users in these areas still accept higher prices when they have no transport alternatives. Singapore\'s CCCS investigates.',
      risk: 'High',
      scenarioNum: 'CCCS',
      icon: 'dollar-sign',
      color: 'text-red-400',
      agents: [
        { id: 'surge-ai', name: 'Grab Pricing AI Agent', role: 'Dynamic Surge Pricing & Demand Prediction', icon: '📈', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'cccs-counsel', name: 'CCCS Compliance Agent', role: 'Competition & Consumer Protection Law', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'cccs-enforce', name: 'CCCS Investigation Agent', role: 'Competition Commission Enforcement', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'rider-agent', name: 'Rider Welfare Agent', role: 'Consumer Impact & Transport Equity', icon: '👤', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Pricing AI', status: 'connected', type: 'Surge Algorithm', icon: 'cpu', detail: 'AI sets surge multipliers for 8.4M rides/month across Singapore' },
        { name: 'Zone Analysis', status: 'connected', type: 'Geographic Pricing', icon: 'map-pin', detail: 'Low-income zones: avg 2.4x surge vs high-income zones: 1.6x (same demand level)' },
        { name: 'CCCS Portal', status: 'connected', type: 'Investigation', icon: 'alert-triangle', detail: 'CCCS: possible abuse of dominant position under Competition Act §47' },
        { name: 'Transport Data', status: 'syncing', type: 'Alternatives', icon: 'truck', detail: 'Low-income zones: fewer MRT stations, fewer bus routes = captive riders' },
      ],
      script: [
        { agentId: 'surge-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Grab dynamic pricing AI. Sets surge multipliers for 8.4M rides per month in Singapore. The AI considers: real-time supply (available drivers), demand (ride requests), weather, events, and time of day. Standard surge: 1.0x–3.5x. CRITICAL DISCOVERY: CendiaSupervision geographic analysis reveals that at IDENTICAL supply-demand ratios, the AI charges different surge multipliers based on pickup location. Low-income zones (Woodlands, Yishun, Jurong West): average surge 2.4x. High-income zones (Orchard, Tanglin, Bukit Timah): average surge 1.6x. Same demand level. Same supply availability. Different price. The AI learned this from HISTORICAL DATA: riders in low-income areas have fewer transport alternatives (fewer MRT stations, fewer bus routes, no car ownership). They ACCEPT higher surges because they have no choice. The AI optimises for revenue — and "willingness to pay under duress" correlates perfectly with socioeconomic status.' },
        { agentId: 'cccs-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'COMPETITION LAW ALERT. (1) Competition Act §47: prohibition on abuse of dominant position. Grab holds 72% of Singapore\'s ride-hailing market (post-Uber acquisition). Dominant position: established. (2) §47(2)(a): directly or indirectly imposing "unfair purchase or selling prices." Charging higher prices to captive consumers (low-income, no alternatives) is unfair pricing. (3) The CCCS merger conditions from Grab-Uber (2018) specifically required Grab to maintain "fair pricing." Discriminatory surge pricing by neighbourhood socioeconomic status may violate these conditions. (4) Consumer Protection (Fair Trading) Act: "unfair practices" include charging different prices for the same service based on consumer vulnerability. Low-income riders with no alternatives are vulnerable consumers. (5) Political dimension: Singapore\'s government emphasises affordable transport. The Minister for Transport has publicly stated ride-hailing should be "accessible to all Singaporeans." Geographic price discrimination that targets HDB heartland residents = political crisis.' },
        { agentId: 'cccs-enforce', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. CCCS investigation: (1) CCCS opened a review after an NUS study found "statistically significant geographic pricing disparities in ride-hailing services that correlate with neighbourhood income levels." (2) CCCS will examine: does the pricing algorithm incorporate features that proxy for socioeconomic status? Does the surge multiplier differ at identical supply-demand conditions? Is there a legitimate business justification? (3) Grab\'s defence options: (a) "Different surge reflects different supply conditions" — but the data shows IDENTICAL supply-demand at different prices. This defence fails. (b) "The algorithm is neutral — it optimises for willingness to pay" — willingness to pay under duress (no alternatives) is not legitimate willingness. (4) CCCS penalties: up to 10% of turnover in Singapore for the years of infringement. Grab Singapore revenue: SGD $100M+. 10% = SGD $10M per year. (5) CCCS can also impose: mandatory pricing algorithm review, ongoing monitoring obligations, and public commitments on pricing fairness.' },
        { agentId: 'rider-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — RIDER WELFARE. The riders paying 2.4x surge in Woodlands and Yishun: they earn less, have fewer transport options, and pay more for ride-hailing. A healthcare worker in Yishun finishing a night shift at 11pm: no MRT, limited bus service. She needs Grab. Surge: 2.4x. Cost: SGD $38 for a ride that costs SGD $16 at 1.0x. She earns SGD $2,800/month. A banker in Orchard at the same time: surge 1.6x. Cost: SGD $25 for a comparable distance. He earns SGD $15,000/month. The AI charges the person who can least afford it MORE. Without CendiaSupervision: the pricing AI exploits captive riders. SGD $10M fine. Political crisis. With CendiaSupervision: surge multipliers are equalised at identical supply-demand levels. Geographic socioeconomic proxies are removed. The healthcare worker pays the same surge as the banker.' },
        { agentId: 'surge-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Grab + CendiaSupervision Fair Pricing Governance: (1) SURGE EQUALISATION: At identical supply-demand ratios, surge multipliers are EQUAL regardless of pickup location. CendiaSupervision monitors for geographic price disparities and alerts when zone-level surges diverge beyond 10% at same S/D ratios. (2) SOCIOECONOMIC PROXY REMOVAL: Features that correlate with neighbourhood income (zone, historical acceptance rates from captive riders) are identified and removed from the pricing model. (3) CAPTIVE RIDER PROTECTION: Zones with limited public transport alternatives receive surge CAPS — ensuring riders without options are not exploited. (4) TRANSPARENT PRICING: Riders see WHY surge is applied: "Demand is high in your area. 14 riders requesting, 3 drivers available." Not just the multiplier. (5) CCCS REPORTING: Quarterly pricing fairness reports showing surge distribution by zone, income level correlation analysis, and equalisation metrics.' },
        { agentId: 'cccs-enforce', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Surge equalised: low-income zone average 2.4x → 1.8x. High-income zone: unchanged at 1.6x. Gap: 0.8x → 0.2x (within acceptable variance from real supply differences). Socioeconomic proxies removed. CCCS: "Grab has proactively addressed pricing fairness concerns." No fine. For Grab: CendiaSupervision = fair pricing governance for Southeast Asia\'s largest ride-hailing platform. "Grab: AI pricing that\'s fair across every neighbourhood" — the message that satisfies regulators and maintains Grab\'s social licence to operate.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:gr50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'gr60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Pricing AI + Surge equalisation + Proxy removal + Captive protection)',
        complianceLabel: 'Pricing Fairness',
        complianceValue: 'SURGE GAP: 0.8x → 0.2x',
        complianceThreshold: 'Geographic proxies removed, captive zones capped',
        agents: ['Grab Pricing AI Agent', 'CCCS Compliance Agent', 'CCCS Investigation Agent', 'Rider Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Grab — Fair Pricing Governance',
        guaranteeBody: 'Surge equalised at identical S/D ratios. Low-income zone: 2.4x → 1.8x. Gap: 0.8x → 0.2x. Socioeconomic proxies removed. Captive rider caps applied. CCCS compliant.',
        evidenceChain: 'Pricing AI (geographic bias) → Zone analysis → Proxy detected → Equalisation → Captive caps → Gap 0.2x → CCCS review → Compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how Grab + CendiaSupervision catches socioeconomic surge pricing discrimination — protecting captive riders in low-income neighbourhoods.',
      phaseLabels: ['Geographic Price Discrimination & Captive Riders', 'CCCS Investigation & Dominant Position', 'Surge Equalisation & Proxy Removal'],
    },
  ],
};

export default config;
