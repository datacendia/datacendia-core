/**
 * Design Partner & Potential Client Target Companies
 * Each entry: real company, real vertical, real pain point.
 * Organized by industry vertical matching the 25 design partner decks.
 */
module.exports = [
  // ═══════════════════════════════════════════════════════
  // HEALTHCARE (deck: 01-healthcare)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-001', company: 'Mayo Clinic', vertical: 'healthcare',
    hq: 'Rochester, MN', size: '76,000+ employees',
    painPoint: 'Clinical AI decisions require HIPAA-compliant audit trails. Mayo deploys AI across diagnostics, treatment planning, and patient safety — but has no unified decision evidence layer.',
    whyThem: 'Mayo Clinic is a global leader in clinical AI adoption. They need explainable, auditable AI for clinical protocol reviews and patient safety incident analysis.',
    deck: '01-healthcare',
  },
  {
    id: 'dp-002', company: 'Cleveland Clinic', vertical: 'healthcare',
    hq: 'Cleveland, OH', size: '80,000+ employees',
    painPoint: 'AI-assisted clinical decisions need explainable evidence trails for FDA and CMS compliance. Cleveland Clinic is expanding AI across 200+ care pathways.',
    whyThem: 'Cleveland Clinic is investing heavily in AI-driven care delivery. Datacendia provides the HIPAA-compliant decision evidence layer for clinical AI accountability.',
    deck: '01-healthcare',
  },
  {
    id: 'dp-003', company: 'Kaiser Permanente', vertical: 'healthcare',
    hq: 'Oakland, CA', size: '300,000+ employees',
    painPoint: 'Integrated care model means AI decisions cascade across insurance, clinical, and operational systems. No unified audit trail exists across these domains.',
    whyThem: 'Kaiser\'s integrated model is uniquely positioned to benefit from multi-agent deliberation across clinical, financial, and operational AI decisions.',
    deck: '01-healthcare',
  },
  {
    id: 'dp-004', company: 'NHS England', vertical: 'healthcare',
    hq: 'London, UK', size: '1.4M+ employees',
    painPoint: 'UK AI regulation and GDPR require transparent, auditable AI in public healthcare. NHS AI deployments face scrutiny from Parliament and regulators.',
    whyThem: 'NHS is the world\'s largest publicly funded health service. Sovereign deployment and EU/UK regulatory compliance are non-negotiable requirements.',
    deck: '01-healthcare',
  },

  // ═══════════════════════════════════════════════════════
  // FINANCIAL SERVICES (deck: 02-financial-services)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-005', company: 'JPMorgan Chase', vertical: 'financial-services',
    hq: 'New York, NY', size: '300,000+ employees',
    painPoint: 'DORA compliance requires operational resilience documentation for all AI systems. JPMC deploys AI across trading, risk, and credit — regulators demand evidence.',
    whyThem: 'JPMorgan is the largest US bank by assets. Every AI-assisted credit, trading, and risk decision needs cryptographic evidence for regulators.',
    deck: '02-financial-services',
  },
  {
    id: 'dp-006', company: 'Goldman Sachs', vertical: 'financial-services',
    hq: 'New York, NY', size: '45,000+ employees',
    painPoint: 'AI-driven trading and risk management decisions face SEC and OCC scrutiny. Goldman needs decision evidence for investment committee AI recommendations.',
    whyThem: 'Goldman\'s AI-driven trading and advisory operations need auditable decision trails. Multi-agent deliberation maps directly to their investment committee processes.',
    deck: '02-financial-services',
  },
  {
    id: 'dp-007', company: 'Deutsche Bank', vertical: 'financial-services',
    hq: 'Frankfurt, Germany', size: '90,000+ employees',
    painPoint: 'DORA and EU AI Act create dual regulatory pressure. Deutsche Bank needs AI governance infrastructure that satisfies both BaFin and EU-level regulation.',
    whyThem: 'Deutsche Bank faces the most aggressive AI regulatory environment in the world (DORA + EU AI Act + BaFin). Datacendia is built for exactly this.',
    deck: '02-financial-services',
  },
  {
    id: 'dp-008', company: 'HSBC', vertical: 'financial-services',
    hq: 'London, UK', size: '220,000+ employees',
    painPoint: 'Global operations across 60+ countries mean AI compliance requirements span dozens of jurisdictions. No unified governance layer exists.',
    whyThem: 'HSBC\'s multi-jurisdictional footprint makes it the ideal candidate for Datacendia\'s 23-jurisdiction compliance mapping.',
    deck: '02-financial-services',
  },
  {
    id: 'dp-009', company: 'BNY Mellon', vertical: 'financial-services',
    hq: 'New York, NY', size: '50,000+ employees',
    painPoint: 'Custody and asset servicing AI decisions require bulletproof audit trails. $46T+ in assets under custody means every AI decision has material financial impact.',
    whyThem: 'BNY Mellon is the world\'s largest custodian bank. Cryptographic decision evidence is essential when AI touches $46T+ in assets.',
    deck: '02-financial-services',
  },

  // ═══════════════════════════════════════════════════════
  // LEGAL (deck: 03-legal)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-010', company: 'Clifford Chance', vertical: 'legal',
    hq: 'London, UK', size: '6,000+ employees',
    painPoint: 'Magic Circle firm deploying AI for contract analysis and regulatory advice. Every AI recommendation needs a documented reasoning chain for client trust.',
    whyThem: 'Clifford Chance is investing in AI-powered legal services. Datacendia provides the evidence trail that turns AI-assisted advice into defensible recommendations.',
    deck: '03-legal',
  },
  {
    id: 'dp-011', company: 'Baker McKenzie', vertical: 'legal',
    hq: 'Chicago, IL', size: '13,000+ employees',
    painPoint: 'Largest global law firm with AI deployed across 46 countries. Cross-jurisdiction compliance analysis needs auditable AI with complete reasoning chains.',
    whyThem: 'Baker McKenzie\'s global footprint aligns with Datacendia\'s 23-jurisdiction compliance mapping. AI-assisted cross-border legal analysis needs evidence.',
    deck: '03-legal',
  },
  {
    id: 'dp-012', company: 'Thomson Reuters', vertical: 'legal',
    hq: 'Toronto, Canada', size: '26,000+ employees',
    painPoint: 'Legal AI products (Westlaw, CoCounsel) serve millions of lawyers. Accountability for AI-generated legal research and analysis is becoming a client requirement.',
    whyThem: 'Thomson Reuters powers AI-assisted legal research at scale. Datacendia adds the decision evidence layer their enterprise clients are starting to demand.',
    deck: '03-legal',
  },

  // ═══════════════════════════════════════════════════════
  // GOVERNMENT (deck: 04-government)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-013', company: 'U.S. General Services Administration (GSA)', vertical: 'government',
    hq: 'Washington, DC', size: '12,000+ employees',
    painPoint: 'Federal AI procurement decisions affect billions in spending. Executive Order 14110 requires AI risk management and transparency in government.',
    whyThem: 'GSA manages federal procurement. AI-assisted acquisition decisions need FedRAMP-compliant audit trails with full decision evidence.',
    deck: '04-government',
  },
  {
    id: 'dp-014', company: 'UK Government Digital Service (GDS)', vertical: 'government',
    hq: 'London, UK', size: '1,000+ employees',
    painPoint: 'UK AI governance framework requires transparent, auditable AI in public services. GDS sets the standard for government digital infrastructure.',
    whyThem: 'GDS shapes how the UK government deploys technology. Sovereign AI governance aligns with their mission of transparent, accountable public services.',
    deck: '04-government',
  },
  {
    id: 'dp-015', company: 'European Commission (DG CNECT)', vertical: 'government',
    hq: 'Brussels, Belgium', size: '32,000+ employees',
    painPoint: 'The body enforcing the EU AI Act needs AI governance tools itself. DG CNECT oversees digital policy and AI regulation across 27 member states.',
    whyThem: 'DG CNECT is enforcing the EU AI Act. Datacendia provides the exact governance infrastructure the regulation demands.',
    deck: '04-government',
  },

  // ═══════════════════════════════════════════════════════
  // DEFENSE (deck: 05-defense)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-016', company: 'Lockheed Martin', vertical: 'defense',
    hq: 'Bethesda, MD', size: '116,000+ employees',
    painPoint: 'ITAR-compliant AI for classified environments. AI-assisted defense decisions require air-gapped deployment with hardware-rooted trust.',
    whyThem: 'Lockheed Martin needs air-gapped AI governance for classified programs. Datacendia\'s TPM 2.0 attestation and sovereign deployment are purpose-built for this.',
    deck: '05-defense',
  },
  {
    id: 'dp-017', company: 'Northrop Grumman', vertical: 'defense',
    hq: 'Falls Church, VA', size: '95,000+ employees',
    painPoint: 'AI-driven autonomous systems and space programs require auditable decision evidence. CMMC compliance demands documented AI governance.',
    whyThem: 'Northrop Grumman\'s autonomous systems and space programs need AI accountability infrastructure that runs on isolated, classified networks.',
    deck: '05-defense',
  },
  {
    id: 'dp-018', company: 'BAE Systems', vertical: 'defense',
    hq: 'Farnborough, UK', size: '90,000+ employees',
    painPoint: 'UK/US defense contracts require AI governance across ITAR, UK Official Sensitive, and NATO classifications. No commercial platform handles this.',
    whyThem: 'BAE Systems operates across UK and US defense markets. Datacendia\'s 11 sovereign deployment patterns handle ITAR, UK Official Sensitive, and NATO requirements.',
    deck: '05-defense',
  },

  // ═══════════════════════════════════════════════════════
  // ENERGY & UTILITIES (deck: 06-energy-utilities)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-019', company: 'Duke Energy', vertical: 'energy-utilities',
    hq: 'Charlotte, NC', size: '28,000+ employees',
    painPoint: 'NERC CIP compliance for AI systems managing grid operations. AI-assisted load balancing and reliability decisions need auditable evidence.',
    whyThem: 'Duke Energy serves 8M+ customers. AI-driven grid operations need NERC CIP-compliant decision evidence that runs on isolated operational networks.',
    deck: '06-energy-utilities',
  },
  {
    id: 'dp-020', company: 'National Grid', vertical: 'energy-utilities',
    hq: 'London, UK', size: '30,000+ employees',
    painPoint: 'UK energy transition requires AI-driven grid management with full regulatory accountability. Ofgem increasingly scrutinizes AI-assisted operations.',
    whyThem: 'National Grid\'s UK/US operations face regulatory pressure from Ofgem and NERC. AI governance for critical infrastructure is non-negotiable.',
    deck: '06-energy-utilities',
  },

  // ═══════════════════════════════════════════════════════
  // INSURANCE (deck: 07-insurance)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-021', company: 'Allianz', vertical: 'insurance',
    hq: 'Munich, Germany', size: '159,000+ employees',
    painPoint: 'EU AI Act requires auditable AI for underwriting and claims. Allianz deploys AI across 70+ countries — each jurisdiction has different rules.',
    whyThem: 'Allianz is Europe\'s largest insurer. Every AI-assisted underwriting and claims decision needs documented reasoning under EU AI Act and DORA.',
    deck: '07-insurance',
  },
  {
    id: 'dp-022', company: 'AIG', vertical: 'insurance',
    hq: 'New York, NY', size: '36,000+ employees',
    painPoint: 'AI underwriting decisions face state insurance commissioner scrutiny across 50 US states. Claim denials need documented, defensible reasoning.',
    whyThem: 'AIG\'s complex underwriting operations span global markets. Every AI-assisted risk assessment and claim decision needs an evidence trail.',
    deck: '07-insurance',
  },
  {
    id: 'dp-023', company: 'Lloyd\'s of London', vertical: 'insurance',
    hq: 'London, UK', size: '1,000+ (marketplace)',
    painPoint: 'Marketplace model means AI governance must work across dozens of syndicates. Lloyd\'s is modernizing with AI but needs evidence infrastructure.',
    whyThem: 'Lloyd\'s marketplace structure makes AI governance uniquely complex. Multi-agent deliberation maps to how syndicates already make decisions.',
    deck: '07-insurance',
  },

  // ═══════════════════════════════════════════════════════
  // PHARMACEUTICAL (deck: 08-pharma)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-024', company: 'Pfizer', vertical: 'pharma',
    hq: 'New York, NY', size: '88,000+ employees',
    painPoint: 'FDA requires complete documentation of every AI-assisted decision in drug development. Clinical trial AI needs full decision replay capability.',
    whyThem: 'Pfizer is accelerating AI across drug discovery and clinical trials. FDA submissions require auditable evidence of how AI informed development decisions.',
    deck: '08-pharma',
  },
  {
    id: 'dp-025', company: 'Roche', vertical: 'pharma',
    hq: 'Basel, Switzerland', size: '100,000+ employees',
    painPoint: 'EMA and FDA dual submissions mean AI-assisted drug development decisions need evidence across multiple regulatory regimes simultaneously.',
    whyThem: 'Roche\'s global pharma operations need AI governance that satisfies both EMA and FDA. Datacendia\'s multi-jurisdiction compliance mapping fits perfectly.',
    deck: '08-pharma',
  },
  {
    id: 'dp-026', company: 'AstraZeneca', vertical: 'pharma',
    hq: 'Cambridge, UK', size: '89,000+ employees',
    painPoint: 'AI-driven drug discovery decisions need GxP-compliant audit trails. Regulatory submissions increasingly require evidence of AI decision-making processes.',
    whyThem: 'AstraZeneca is a leader in AI-driven drug discovery. Datacendia provides GxP-compliant decision evidence for regulatory submissions.',
    deck: '08-pharma',
  },

  // ═══════════════════════════════════════════════════════
  // BIG 4 / CONSULTING (potential channel partners)
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-027', company: 'Deloitte', vertical: 'consulting',
    hq: 'London, UK', size: '457,000+ employees',
    painPoint: 'Advising Fortune 500 clients on AI governance but has no embedded decision evidence platform to offer. Needs a technology partner, not a competitor.',
    whyThem: 'Deloitte\'s AI governance practice advises thousands of enterprises. Datacendia can be the technology layer behind their advisory engagements.',
    deck: '10-compliance-officers',
  },
  {
    id: 'dp-028', company: 'PwC', vertical: 'consulting',
    hq: 'London, UK', size: '364,000+ employees',
    painPoint: 'PwC\'s Responsible AI framework needs tooling. Currently relies on manual processes for AI governance assessments.',
    whyThem: 'PwC advises on AI risk and governance globally. Datacendia automates what their consultants currently do manually — decision evidence generation.',
    deck: '10-compliance-officers',
  },
  {
    id: 'dp-029', company: 'EY', vertical: 'consulting',
    hq: 'London, UK', size: '395,000+ employees',
    painPoint: 'EY\'s AI audit practice needs cryptographic evidence infrastructure. Auditing AI decisions without decision evidence is like auditing financials without a ledger.',
    whyThem: 'EY audits AI systems for compliance. Datacendia produces the evidence they need — cryptographic proof of decisions, not just log files.',
    deck: '10-compliance-officers',
  },
  {
    id: 'dp-030', company: 'KPMG', vertical: 'consulting',
    hq: 'Amstelveen, Netherlands', size: '265,000+ employees',
    painPoint: 'KPMG\'s Trusted AI framework needs verifiable evidence. Their AI governance assessments rely on self-reported data from clients.',
    whyThem: 'KPMG\'s Trusted AI practice assesses AI governance for enterprises. Datacendia provides the cryptographic evidence that makes those assessments verifiable.',
    deck: '10-compliance-officers',
  },

  // ═══════════════════════════════════════════════════════
  // TECHNOLOGY / AI-HEAVY ENTERPRISES
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-031', company: 'Siemens', vertical: 'technology',
    hq: 'Munich, Germany', size: '320,000+ employees',
    painPoint: 'Industrial AI across manufacturing, energy, and healthcare divisions. EU AI Act applies across all divisions with different risk classifications.',
    whyThem: 'Siemens deploys AI across industrial operations globally. Multi-domain AI governance with EU AI Act compliance is a board-level priority.',
    deck: '11-it-operations',
  },
  {
    id: 'dp-032', company: 'SAP', vertical: 'technology',
    hq: 'Walldorf, Germany', size: '107,000+ employees',
    painPoint: 'SAP embeds AI across ERP products used by 400K+ customers. Those customers need AI governance for decisions made within SAP systems.',
    whyThem: 'SAP\'s enterprise customers need AI governance within their SAP environments. The SAP Integration design partner deck was built for exactly this conversation.',
    deck: '20-sap-integration',
  },
  {
    id: 'dp-033', company: 'Salesforce', vertical: 'technology',
    hq: 'San Francisco, CA', size: '73,000+ employees',
    painPoint: 'Einstein AI makes decisions across sales, service, and marketing for 150K+ customers. Those decisions need governance and audit trails.',
    whyThem: 'Salesforce Einstein AI powers CRM decisions at massive scale. The Salesforce Integration design partner deck addresses exactly this governance gap.',
    deck: '19-salesforce-integration',
  },
  {
    id: 'dp-034', company: 'Snowflake', vertical: 'technology',
    hq: 'Bozeman, MT', size: '5,000+ employees',
    painPoint: 'Cortex AI runs ML directly in Snowflake. Customers need governance for AI decisions made on warehouse data — but Snowflake has no decision evidence layer.',
    whyThem: 'Snowflake Cortex AI creates AI decisions directly on warehouse data. The Snowflake Integration design partner deck addresses the governance gap.',
    deck: '21-snowflake-integration',
  },

  // ═══════════════════════════════════════════════════════
  // TELECOMMUNICATIONS
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-035', company: 'BT Group', vertical: 'telecom',
    hq: 'London, UK', size: '100,000+ employees',
    painPoint: 'AI-driven network operations and customer service decisions face Ofcom scrutiny. UK AI governance requirements are tightening.',
    whyThem: 'BT deploys AI across network operations and customer service. UK regulatory pressure demands auditable AI governance infrastructure.',
    deck: '11-it-operations',
  },
  {
    id: 'dp-036', company: 'Deutsche Telekom', vertical: 'telecom',
    hq: 'Bonn, Germany', size: '200,000+ employees',
    painPoint: 'EU AI Act and German AI regulation create compliance pressure across all AI-driven operations. T-Systems serves enterprise clients who also need governance.',
    whyThem: 'Deutsche Telekom faces EU AI Act compliance across all AI operations. T-Systems could also become a distribution channel for enterprise clients.',
    deck: '11-it-operations',
  },

  // ═══════════════════════════════════════════════════════
  // AUTOMOTIVE / MANUFACTURING
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-037', company: 'BMW Group', vertical: 'automotive',
    hq: 'Munich, Germany', size: '150,000+ employees',
    painPoint: 'AI in autonomous driving, manufacturing, and supply chain. EU AI Act classifies many automotive AI applications as high-risk.',
    whyThem: 'BMW\'s AI-driven manufacturing and autonomous driving programs face EU AI Act high-risk classification. Decision evidence is mandatory.',
    deck: '13-operations-leaders',
  },
  {
    id: 'dp-038', company: 'Rolls-Royce', vertical: 'aerospace',
    hq: 'Derby, UK', size: '44,000+ employees',
    painPoint: 'AI in jet engine predictive maintenance and defense systems. Safety-critical AI decisions need the highest standard of evidence and auditability.',
    whyThem: 'Rolls-Royce deploys AI in safety-critical aerospace and defense applications. Decision evidence for AI-assisted maintenance decisions is life-or-death.',
    deck: '13-operations-leaders',
  },

  // ═══════════════════════════════════════════════════════
  // RETAIL / SUPPLY CHAIN
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-039', company: 'Unilever', vertical: 'consumer-goods',
    hq: 'London, UK', size: '127,000+ employees',
    painPoint: 'AI in supply chain, pricing, and ESG reporting. Stakeholders and regulators demand accountability for AI-driven sustainability claims.',
    whyThem: 'Unilever\'s AI-driven sustainability and supply chain decisions face increasing stakeholder scrutiny. Decision evidence infrastructure proves ESG claims are real.',
    deck: '13-operations-leaders',
  },
  {
    id: 'dp-040', company: 'Maersk', vertical: 'logistics',
    hq: 'Copenhagen, Denmark', size: '100,000+ employees',
    painPoint: 'AI in global logistics and supply chain management. Decisions span 130+ countries — each with different regulatory requirements.',
    whyThem: 'Maersk\'s global logistics operations use AI across 130+ countries. Multi-jurisdiction AI governance with decision evidence is essential at this scale.',
    deck: '13-operations-leaders',
  },

  // ═══════════════════════════════════════════════════════
  // SOVEREIGN / MIDDLE EAST
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-041', company: 'NEOM', vertical: 'sovereign',
    hq: 'Tabuk, Saudi Arabia', size: 'Nation-scale project',
    painPoint: 'Saudi Vision 2030 smart city requires AI governance across all city systems. Every AI decision in public infrastructure needs auditability.',
    whyThem: 'NEOM is building an AI-first city from scratch. This is a once-in-a-generation opportunity to embed decision evidence infrastructure at the foundation layer.',
    deck: '04-government',
  },
  {
    id: 'dp-042', company: 'Abu Dhabi Digital Authority (ADDA)', vertical: 'sovereign',
    hq: 'Abu Dhabi, UAE', size: 'Government authority',
    painPoint: 'UAE AI Strategy 2031 requires governance infrastructure for government AI systems. ADDA is the digital transformation authority for Abu Dhabi.',
    whyThem: 'ADDA drives digital transformation for Abu Dhabi. Sovereign AI governance with Arabic language support aligns with UAE AI Strategy 2031.',
    deck: '04-government',
  },

  // ═══════════════════════════════════════════════════════
  // ASIA-PACIFIC
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-043', company: 'DBS Bank', vertical: 'financial-services',
    hq: 'Singapore', size: '36,000+ employees',
    painPoint: 'MAS AI governance guidelines and Singapore\'s AI Verify framework require transparent AI. DBS is Southeast Asia\'s largest bank by assets.',
    whyThem: 'DBS Bank is a leader in banking AI adoption. Singapore\'s MAS AI governance framework creates demand for exactly what Datacendia provides.',
    deck: '02-financial-services',
  },
  {
    id: 'dp-044', company: 'Mitsubishi UFJ Financial Group (MUFG)', vertical: 'financial-services',
    hq: 'Tokyo, Japan', size: '150,000+ employees',
    painPoint: 'Japan Society 5.0 AI governance requirements and FSA scrutiny demand auditable AI in financial services. MUFG is Japan\'s largest bank.',
    whyThem: 'MUFG faces Japan FSA AI governance requirements under Society 5.0. Datacendia\'s multi-jurisdiction compliance mapping includes Japanese regulatory frameworks.',
    deck: '02-financial-services',
  },

  // ═══════════════════════════════════════════════════════
  // RISK MANAGEMENT / COMPLIANCE SPECIFIC
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-045', company: 'Moody\'s', vertical: 'risk-management',
    hq: 'New York, NY', size: '15,000+ employees',
    painPoint: 'AI-driven credit ratings and risk assessments face SEC and ESMA scrutiny. Every AI-informed rating decision needs evidence.',
    whyThem: 'Moody\'s AI-powered risk assessments inform trillions in credit decisions. Decision evidence for AI-assisted ratings is becoming a regulatory requirement.',
    deck: '09-risk-management',
  },
  {
    id: 'dp-046', company: 'S&P Global', vertical: 'risk-management',
    hq: 'New York, NY', size: '40,000+ employees',
    painPoint: 'AI across ratings, market intelligence, and commodity insights. Regulatory bodies demand transparency in AI-driven financial analytics.',
    whyThem: 'S&P Global\'s AI-driven analytics inform global financial markets. Auditable decision evidence is essential for regulatory credibility.',
    deck: '09-risk-management',
  },

  // ═══════════════════════════════════════════════════════
  // COMPLIANCE / REGTECH
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-047', company: 'Refinitiv (LSEG)', vertical: 'compliance',
    hq: 'London, UK', size: '25,000+ employees',
    painPoint: 'AI-driven compliance screening and risk monitoring serve 40K+ institutions. Downstream accountability for AI-generated compliance decisions is critical.',
    whyThem: 'LSEG/Refinitiv powers compliance for financial institutions globally. Adding decision evidence to AI-driven compliance outputs creates massive value.',
    deck: '10-compliance-officers',
  },
  {
    id: 'dp-048', company: 'Wolters Kluwer', vertical: 'compliance',
    hq: 'Alphen aan den Rijn, Netherlands', size: '21,000+ employees',
    painPoint: 'Compliance and legal AI products serve millions of professionals. AI-generated regulatory advice needs auditable reasoning chains.',
    whyThem: 'Wolters Kluwer\'s compliance AI products need decision evidence layers. Their customers (regulated enterprises) are beginning to demand it.',
    deck: '10-compliance-officers',
  },

  // ═══════════════════════════════════════════════════════
  // STRATEGY / MANAGEMENT CONSULTING
  // ═══════════════════════════════════════════════════════
  {
    id: 'dp-049', company: 'McKinsey & Company', vertical: 'strategy',
    hq: 'New York, NY', size: '45,000+ employees',
    painPoint: 'McKinsey deploys AI internally and advises clients on AI strategy. Decision evidence for AI-informed strategic recommendations adds credibility.',
    whyThem: 'McKinsey\'s strategic advisory practice increasingly uses AI. Datacendia adds accountability to AI-informed recommendations for their Fortune 500 clients.',
    deck: '12-strategy-teams',
  },
  {
    id: 'dp-050', company: 'Boston Consulting Group (BCG)', vertical: 'strategy',
    hq: 'Boston, MA', size: '30,000+ employees',
    painPoint: 'BCG\'s AI consulting practice (BCG X) needs governance tooling. Clients want auditable AI alongside strategic recommendations.',
    whyThem: 'BCG X is one of the largest AI consulting practices globally. Datacendia can be the evidence infrastructure behind their AI-driven engagements.',
    deck: '12-strategy-teams',
  },
];
