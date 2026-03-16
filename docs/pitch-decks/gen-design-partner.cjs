const e = require('./engine.cjs');
const path = require('path');
const base = __dirname;

console.log('Generating 25 Design Partner Pitch Decks...');

// Design partner template: generates a 10-slide deck
function dpDeck(id, cfg) {
  const dt = `DESIGN PARTNER — ${cfg.cat.toUpperCase()}`;
  const T = 10;
  const slides = [
    e.titleS(cfg.title, cfg.sub, dt, T, false),
    e.quoteS(dt, 2, T, cfg.quote),
    e.whatWeDoS(dt, 3, T),
    e.cardsS(dt, 4, T, cfg.cat.toUpperCase(), cfg.cardsTitle || 'How Datacendia Helps', cfg.cards || [
      ['Multi-Agent Deliberation','14 specialized agents analyze from every perspective','card--gold'],
      ['Cryptographic Evidence','Immutable audit trail for every decision','card--blue'],
      ['Sovereign Deployment','Cloud, private cloud, on-prem, or air-gapped','card--green'],
    ], 3),
    e.bulletS(dt, 5, T, 'USE CASES', cfg.ucTitle || 'Design Partner Scenarios', cfg.useCases),
    e.twoColS(dt, 6, T, 'DESIGN PARTNER BENEFITS', 'Why Partner Early?',
      '<ul><li><strong>Direct influence</strong> on product roadmap</li><li><strong>Priority support</strong> and dedicated engineering</li><li><strong>Preferred pricing</strong> locked at design partner rates</li><li><strong>Co-marketing</strong> — joint case studies</li><li><strong>Early access</strong> to new features</li></ul>',
      '<div class="card card--gold"><h4 class="gold">Design Partner Terms</h4><ul style="margin-top:12px"><li><strong>90-day pilot</strong> at reduced rate</li><li><strong>Weekly syncs</strong> with engineering</li><li><strong>Feature input</strong> on quarterly roadmap</li><li><strong>Case study collaboration</strong></li><li><strong>Preferred renewal pricing</strong></li></ul></div>'),
    e.platMetrics(dt, 7, T),
    e.deployS(dt, 8, T),
    e.guaranteeS(dt, 9, T),
    e.ctaS(dt, 10, T, `Become a ${cfg.cat} Design Partner`, cfg.cta || 'Shape decision intelligence for your industry.', ['Schedule Discovery','Technical Deep Dive','Pilot Proposal']),
  ];
  const html = e.hd(cfg.title, dt) + slides.join('\n\n') + e.ft();
  e.writeDeck(path.join(base, 'design-partner', id + '.html'), html);
}

// 25 Design Partner Decks — by industry, function, use case, integration, capability
const dps = [
  // BY INDUSTRY (1-8)
  { id:'01-healthcare', cat:'Healthcare', title:'Healthcare Design Partnership', sub:'Clinical decision support with HIPAA-compliant audit trails',
    quote:'Healthcare AI has no accountability layer. Clinical decisions need explainable, auditable AI — with patient safety as the prime directive.',
    cards:[['CMIO — Health IT','Clinical systems integration and health informatics','card--gold'],['Patient Safety Officer','Safety metrics, adverse event prevention','card--green'],['Health Compliance','HIPAA, FDA, CMS regulatory compliance','card--blue']],
    useCases:['<strong>Clinical protocol review</strong> — Multi-agent evaluation against safety, regulatory, and financial criteria','<strong>Hospital M&A due diligence</strong> — Clinical outcomes, compliance, financial health analysis','<strong>Regulatory change impact</strong> — CMS/FDA guidance mapped across operations','<strong>Patient safety incident review</strong> — Full decision replay with evidence preservation','<strong>Value-based care optimization</strong> — Balance quality, outcomes, and financial sustainability'] },

  { id:'02-financial-services', cat:'Financial Services', title:'Financial Services Design Partnership', sub:'Risk management and audit-ready AI for banking and capital markets',
    quote:'When regulators ask how your AI made a credit decision, you need more than log files. You need a cryptographic evidence packet.',
    cards:[['CFO — Financial Analysis','P&L analysis, budget forecasting, fiscal health','card--gold'],['Credit Risk Officer','Credit analysis, counterparty risk, exposure','card--blue'],['Compliance Agent','SOX, PCI-DSS, DORA, Basel III','card--green']],
    useCases:['<strong>Credit decision review</strong> — Multi-agent assessment with dissent tracking','<strong>M&A due diligence</strong> — Risk-adjusted valuation with full evidence trail','<strong>DORA compliance</strong> — Operational resilience with automated evidence','<strong>Investment committee</strong> — Structured deliberation with documented rationale','<strong>Regulatory change absorption</strong> — Map new regulations to P&L impact'] },

  { id:'03-legal', cat:'Legal', title:'Legal & Law Firms Design Partnership', sub:'Contract analysis, compliance, and litigation support with AI audit trails',
    quote:'Every legal recommendation should come with a complete reasoning chain — who analyzed what, what was considered, and what was deliberately excluded.',
    cards:[['CLO — Legal Intelligence','Legal risks, contracts, regulatory compliance','card--gold'],['Compliance Analyst','Regulatory analysis across jurisdictions','card--blue'],['Risk Agent','Litigation risk, exposure assessment','card--purple']],
    useCases:['<strong>Contract analysis</strong> — Multi-agent review of terms, risks, obligations, and precedent','<strong>Regulatory compliance assessment</strong> — Cross-jurisdiction analysis with evidence','<strong>Litigation risk evaluation</strong> — Multi-perspective assessment with dissent tracking','<strong>M&A legal due diligence</strong> — IP, labor, environmental, and antitrust review','<strong>Policy drafting</strong> — Agent-assisted policy creation with regulatory alignment'] },

  { id:'04-government', cat:'Government', title:'Government Agency Design Partnership', sub:'Sovereign AI for public sector decision-making and transparency',
    quote:'Government decisions affect millions. Every recommendation should be explainable, auditable, and replayable — with cryptographic proof.',
    cards:[['Policy Analyst','Regulatory impact, cost-benefit analysis','card--gold'],['CISO — Security','FedRAMP, NIST, FISMA compliance','card--blue'],['Procurement Agent','Acquisition analysis, vendor assessment','card--green']],
    useCases:['<strong>Policy impact analysis</strong> — Multi-agent assessment of regulatory changes','<strong>Procurement decision support</strong> — Vendor evaluation with documented rationale','<strong>Compliance verification</strong> — NIST 800-53, FISMA, FedRAMP evidence','<strong>Inter-agency coordination</strong> — Multi-stakeholder deliberation with audit trail','<strong>Budget allocation</strong> — Evidence-based resource planning with dissent tracking'] },

  { id:'05-defense', cat:'Defense', title:'Defense Contractor Design Partnership', sub:'Air-gapped, ITAR-compliant AI for classified environments',
    quote:'Defense decisions cannot live on someone else\'s cloud. Sovereign deployment is not optional — it is mission-critical.',
    cards:[['ITAR Compliance','Export control and classified data handling','card--gold'],['Intel Analyst','Multi-source intelligence fusion','card--blue'],['Ops Planner','Operational scenario analysis and red-teaming','card--purple']],
    useCases:['<strong>Intelligence analysis</strong> — Multi-source fusion with full audit trail','<strong>Acquisition due diligence</strong> — ITAR-compliant contractor evaluation','<strong>Operational planning</strong> — Scenario analysis with adversarial red-teaming','<strong>CMMC compliance</strong> — Automated evidence for NIST 800-171 controls','<strong>Supply chain risk</strong> — Defense supply chain analysis with evidence'] },

  { id:'06-energy-utilities', cat:'Energy & Utilities', title:'Energy & Utilities Design Partnership', sub:'Critical infrastructure AI with sovereign deployment for power and water systems',
    quote:'Critical infrastructure AI must run on isolated networks. When the grid is at stake, cloud AI is not an option.',
    cards:[['Operations Agent','Grid operations, load balancing, reliability','card--gold'],['Safety Agent','NERC CIP, safety compliance, risk assessment','card--green'],['Environmental Agent','Environmental compliance, emissions tracking','card--blue']],
    useCases:['<strong>Grid reliability assessment</strong> — Multi-agent analysis of infrastructure health','<strong>NERC CIP compliance</strong> — Automated evidence for critical infrastructure standards','<strong>Capital expenditure planning</strong> — Investment analysis with risk modeling','<strong>Environmental compliance</strong> — Emissions tracking with regulatory evidence','<strong>Outage response</strong> — Crisis deliberation with rapid decision evidence'] },

  { id:'07-insurance', cat:'Insurance', title:'Insurance Industry Design Partnership', sub:'Underwriting, claims, and risk assessment with auditable AI decisions',
    quote:'Every underwriting decision needs a paper trail. Every claim denial needs documented reasoning. AI without evidence is a liability.',
    cards:[['Underwriting Agent','Risk assessment, pricing, policy terms','card--gold'],['Claims Analyst','Claims evaluation, fraud detection','card--blue'],['Actuarial Agent','Statistical modeling, loss projection','card--purple']],
    useCases:['<strong>Underwriting decision support</strong> — Multi-agent risk assessment with documented rationale','<strong>Claims adjudication review</strong> — Evidence-based claim evaluation with audit trail','<strong>Fraud detection review</strong> — AI-flagged cases with full decision lineage','<strong>Regulatory compliance</strong> — State-by-state insurance regulation compliance evidence','<strong>Catastrophe modeling</strong> — Multi-scenario impact assessment with dissent tracking'] },

  { id:'08-pharma', cat:'Pharmaceutical', title:'Pharmaceutical Design Partnership', sub:'Drug development, clinical trials, and FDA compliance with AI audit trails',
    quote:'FDA requires complete documentation of every decision in the drug development process. AI recommendations are no exception.',
    cards:[['Clinical Agent','Clinical trial design, patient safety','card--gold'],['Regulatory Agent','FDA, EMA, ICH compliance','card--green'],['R&D Agent','Drug discovery, molecular analysis','card--blue']],
    useCases:['<strong>Clinical trial design</strong> — Multi-agent protocol evaluation with safety focus','<strong>FDA submission support</strong> — Evidence-based documentation with complete audit trail','<strong>Drug interaction analysis</strong> — Multi-perspective safety assessment','<strong>Manufacturing compliance</strong> — GMP compliance evidence generation','<strong>Patent strategy</strong> — IP landscape analysis with competitive intelligence'] },

  // BY FUNCTION (9-13)
  { id:'09-risk-management', cat:'Risk Management', title:'Risk Management Design Partnership', sub:'Enterprise risk assessment with multi-agent analysis and evidence',
    quote:'Risk management is not a checklist. It is a continuous process of identification, assessment, and mitigation — with evidence of every step.',
    cards:[['Risk Intelligence','Identifies and quantifies organizational risks','card--gold'],['Red Team','Adversarial challenge of risk assessments','card--red'],['Compliance Agent','Regulatory risk and compliance monitoring','card--green']],
    ucTitle:'Risk Management Scenarios',
    useCases:['<strong>Enterprise risk assessment</strong> — Multi-agent analysis across operational, financial, and strategic risk','<strong>Third-party risk management</strong> — Vendor and supply chain risk evaluation with evidence','<strong>Emerging risk identification</strong> — AI-powered horizon scanning with structured deliberation','<strong>Risk appetite definition</strong> — Multi-stakeholder deliberation with documented consensus','<strong>Incident response planning</strong> — Scenario-based crisis preparation with evidence'] },

  { id:'10-compliance-officers', cat:'Compliance', title:'Compliance Officers Design Partnership', sub:'Automated compliance evidence and continuous monitoring',
    quote:'Compliance is not about checking boxes. It is about proving you did the right thing — with evidence an auditor can verify.',
    cards:[['Compliance Monitor','Real-time compliance posture tracking','card--gold'],['Gap Scanner','Automatic compliance gap identification','card--blue'],['Policy Engine','Automated enforcement and attestation','card--green']],
    ucTitle:'Compliance Scenarios',
    useCases:['<strong>SOC 2 evidence generation</strong> — Automated control evidence collection','<strong>GDPR compliance</strong> — Data processing documentation with evidence','<strong>Cross-jurisdiction compliance</strong> — Multi-regulation tracking across 17 jurisdictions','<strong>Audit preparation</strong> — One-click evidence packet export for auditors','<strong>Regulatory change management</strong> — Absorb new regulations and map impact automatically'] },

  { id:'11-it-operations', cat:'IT Operations', title:'IT & Technology Design Partnership', sub:'Architecture decisions, security posture, and operational intelligence',
    quote:'Technology decisions cascade through the entire organization. Multi-agent deliberation ensures every perspective is heard before committing.',
    cards:[['CTO Agent','Architecture decisions, digital transformation','card--gold'],['CISO Agent','Security posture, vulnerability assessment','card--blue'],['CDO Agent','Data quality, lineage, governance','card--green']],
    ucTitle:'IT Operations Scenarios',
    useCases:['<strong>Architecture decision records</strong> — Multi-agent evaluation with documented tradeoffs','<strong>Security posture assessment</strong> — Continuous monitoring with evidence generation','<strong>Vendor selection</strong> — Structured evaluation with financial, technical, and risk perspectives','<strong>Incident post-mortem</strong> — Multi-perspective analysis with complete timeline','<strong>Migration planning</strong> — Risk assessment for cloud, data center, or platform migrations'] },

  { id:'12-strategy-teams', cat:'Strategy', title:'Strategy Teams Design Partnership', sub:'Strategic planning with scenario simulation and evidence-based decisions',
    quote:'Strategy without evidence is opinion. Multi-agent deliberation turns strategic planning into a documented, replayable process.',
    cards:[['CEO Agent','Strategic synthesis and recommendation','card--gold'],['CFO Agent','Financial modeling and fiscal analysis','card--blue'],['CMO Agent','Market intelligence and competitive analysis','card--purple']],
    ucTitle:'Strategy Scenarios',
    useCases:['<strong>Strategic planning</strong> — Multi-agent scenario analysis with documented tradeoffs','<strong>Market entry analysis</strong> — Multi-perspective assessment of new market opportunities','<strong>Competitive intelligence</strong> — AI-powered competitive analysis with evidence','<strong>M&A evaluation</strong> — Comprehensive due diligence with 14-agent deliberation','<strong>Innovation pipeline</strong> — R&D investment analysis with risk assessment'] },

  { id:'13-operations-leaders', cat:'Operations', title:'Operations Leaders Design Partnership', sub:'Operational efficiency, supply chain, and workflow optimization',
    quote:'Operational decisions have second and third-order consequences. CendiaCascade maps the butterfly effects before you commit.',
    cards:[['COO Agent','Workflow optimization, resource allocation','card--gold'],['Supply Chain Agent','Vendor dependencies, logistics optimization','card--blue'],['Quality Agent','Quality metrics, process improvement','card--green']],
    ucTitle:'Operations Scenarios',
    useCases:['<strong>Supply chain risk assessment</strong> — Multi-tier vendor analysis with contingency planning','<strong>Operational efficiency review</strong> — Multi-agent analysis of process bottlenecks','<strong>Capacity planning</strong> — Resource allocation with scenario modeling','<strong>Quality improvement</strong> — Root cause analysis with multi-perspective evidence','<strong>Vendor consolidation</strong> — Cost-benefit analysis with risk assessment'] },

  // BY CAPABILITY (14-18)
  { id:'14-council-deliberation', cat:'The Council', title:'Council Deliberation Design Partnership', sub:'Multi-agent AI deliberation — structured debate, dissent, and decision',
    quote:"You don't get a chatbot answer. You get a boardroom debate. 14 specialized agents deliberating with structured dissent and adversarial challenge.",
    cardsTitle:'Council Capabilities',
    cards:[['14 Specialized Agents','CFO, CISO, CTO, Risk, Legal, Red Team, and more','card--gold'],['12 Deliberation Modes','War Room, Due Diligence, Crisis, Innovation Lab, etc.','card--blue'],['Formal Dissent','Protected disagreement logged and tracked to outcome','card--purple']],
    ucTitle:'Council Use Cases',
    useCases:['<strong>M&A due diligence</strong> — Ingest documents, simulate regulatory blocks, synthesize risk-adjusted price','<strong>Supply chain shock</strong> — Map dependencies, flag disruptions, stress-test alternatives','<strong>Regulatory change</strong> — Absorb regulation, map impact, generate compliance evidence','<strong>Crisis response</strong> — Rapid multi-domain assessment with action plan','<strong>Investment committee</strong> — Financial modeling with risk assessment and dissent tracking'] },

  { id:'15-dcii-proof', cat:'DCII Proof Infrastructure', title:'DCII Design Partnership', sub:'Cryptographic proof infrastructure — Truth, Notary, Witness, Timestamp',
    quote:'Every decision, every vote, every dissent — hashed, timestamped, and exportable. When the auditor says "prove it," hand them this.',
    cardsTitle:'DCII Components',
    cards:[['CendiaTruth™','Immutable evidence ledger with cryptographic signatures','card--gold'],['CendiaNotary™','Customer-owned key signing via KMS/HSM','card--blue'],['CendiaWitness™','Independent verification without trusting Datacendia','card--green']],
    ucTitle:'DCII Use Cases',
    useCases:['<strong>Regulatory evidence</strong> — One-click export of complete audit evidence packets','<strong>Legal discovery</strong> — Cryptographically verified decision records for litigation','<strong>Compliance audit</strong> — Control mapping with automated evidence collection','<strong>Decision verification</strong> — Independent replay and verification of past decisions','<strong>Non-repudiation</strong> — TPM-signed accountability records for executive decisions'] },

  { id:'16-chronos-simulation', cat:'CendiaChronos', title:'CendiaChronos Design Partnership', sub:'Scenario simulation — divergent futures before you commit resources',
    quote:'Most BI tools show a flat line. CendiaChronos shows divergent futures. Simulate the consequences of your decisions before you commit.',
    cardsTitle:'Chronos Capabilities',
    cards:[['Scenario Modeling','Simulate multiple decision paths simultaneously','card--gold'],['Monte Carlo Simulation','Probability-weighted outcome analysis','card--blue'],['Sensitivity Analysis','Identify which variables have the most impact','card--purple']],
    ucTitle:'Simulation Use Cases',
    useCases:['<strong>Investment scenario modeling</strong> — Multiple investment paths with probability-weighted outcomes','<strong>Market entry analysis</strong> — Simulate competitive responses and market dynamics','<strong>Regulatory impact</strong> — Model the cascading effects of regulatory changes','<strong>Crisis scenario planning</strong> — War-game crisis scenarios before they happen','<strong>Capital allocation</strong> — Optimize resource allocation across scenarios'] },

  { id:'17-gateway-governance', cat:'CendiaGateway', title:'CendiaGateway Design Partnership', sub:'AI governance proxy — control, audit, and monitor all AI interactions',
    quote:'Every AI interaction in your organization should be logged, governed, and auditable. CendiaGateway makes this automatic.',
    cardsTitle:'Gateway Capabilities',
    cards:[['AI Proxy','Route all AI requests through governance layer','card--gold'],['Policy Enforcement','Automatic policy gates on AI interactions','card--blue'],['Browser Extensions','Govern AI usage across all browsers','card--green']],
    ucTitle:'Gateway Use Cases',
    useCases:['<strong>Shadow AI prevention</strong> — Monitor and govern all AI usage across the organization','<strong>Data loss prevention</strong> — Prevent sensitive data from reaching external AI','<strong>Usage analytics</strong> — Track AI adoption, costs, and patterns across teams','<strong>Policy enforcement</strong> — Automatic compliance gates on AI interactions','<strong>Audit trail</strong> — Complete log of every AI interaction for compliance'] },

  { id:'18-zero-copy-data', cat:'Zero-Copy Architecture', title:'Zero-Copy Data Design Partnership', sub:'Query in place — your data never leaves your database',
    quote:'Most AI platforms require data copies, ETL pipelines, and data warehouses. We query your data in place. Zero copies. True sovereignty.',
    cardsTitle:'Zero-Copy Capabilities',
    cards:[['Query In Place','PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, DB2','card--gold'],['No ETL Required','Direct connections, no data movement','card--blue'],['16 Connectors','Production-ready database and API connectors','card--green']],
    ucTitle:'Zero-Copy Use Cases',
    useCases:['<strong>Regulated data analysis</strong> — Analyze PHI/PII without moving it outside controlled systems','<strong>Cross-database intelligence</strong> — Query across multiple databases without centralization','<strong>Real-time analysis</strong> — No ETL lag, query current data directly','<strong>Data sovereignty compliance</strong> — Meet residency requirements by keeping data in place','<strong>Multi-cloud analysis</strong> — Query data across cloud providers without copying'] },

  // BY INTEGRATION (19-21)
  { id:'19-salesforce-integration', cat:'Salesforce Integration', title:'Salesforce Integration Design Partnership', sub:'Multi-agent decision intelligence on your Salesforce data',
    quote:'Your CRM holds critical customer data. Datacendia analyzes it in place — objects, reports, custom fields — without data movement.',
    cardsTitle:'Salesforce Capabilities',
    cards:[['CRM Intelligence','Multi-agent analysis of customer data','card--gold'],['Pipeline Analysis','Revenue forecasting with scenario modeling','card--blue'],['Account Health','Customer risk assessment with evidence','card--green']],
    ucTitle:'Salesforce Use Cases',
    useCases:['<strong>Pipeline risk assessment</strong> — Multi-agent analysis of deal health and risks','<strong>Account prioritization</strong> — AI-powered account scoring with documented rationale','<strong>Churn prediction review</strong> — Multi-perspective analysis of at-risk customers','<strong>Territory planning</strong> — Data-driven territory optimization with evidence','<strong>Revenue forecasting</strong> — Scenario-based forecasting with confidence intervals'] },

  { id:'20-sap-integration', cat:'SAP Integration', title:'SAP Integration Design Partnership', sub:'Enterprise decision intelligence on your SAP data via RFC/BAPI',
    quote:'SAP holds your operational truth. Datacendia connects via RFC/BAPI export to analyze without disrupting production systems.',
    cardsTitle:'SAP Capabilities',
    cards:[['ERP Intelligence','Multi-agent analysis of operational data','card--gold'],['Supply Chain','Vendor risk and procurement analysis','card--blue'],['Financial Analysis','Real-time P&L and cost center analysis','card--green']],
    ucTitle:'SAP Use Cases',
    useCases:['<strong>Procurement optimization</strong> — Multi-agent vendor evaluation with cost analysis','<strong>Supply chain risk</strong> — Multi-tier dependency mapping from SAP data','<strong>Financial close review</strong> — Period-end analysis with anomaly detection','<strong>Production planning</strong> — Capacity optimization with scenario modeling','<strong>Compliance reporting</strong> — Automated evidence from SAP transactional data'] },

  { id:'21-snowflake-integration', cat:'Snowflake Integration', title:'Snowflake Integration Design Partnership', sub:'Decision intelligence on your Snowflake data warehouse',
    quote:'Your data warehouse holds your analytical truth. Datacendia queries Snowflake directly — no additional copies or ETL.',
    cardsTitle:'Snowflake Capabilities',
    cards:[['Data Warehouse Intelligence','Multi-agent analysis of warehouse data','card--gold'],['Cross-Domain Analytics','Unified analysis across Snowflake schemas','card--blue'],['Historical Analysis','Temporal analysis with trend detection','card--green']],
    ucTitle:'Snowflake Use Cases',
    useCases:['<strong>Business intelligence augmentation</strong> — AI-powered analysis on top of existing BI data','<strong>Customer 360 analysis</strong> — Multi-perspective customer intelligence','<strong>Operational analytics</strong> — Real-time operational decision support','<strong>Financial reporting review</strong> — Multi-agent analysis of financial data with evidence','<strong>Data quality assessment</strong> — Automated data quality analysis with recommendations'] },

  // BY USE CASE (22-25)
  { id:'22-decision-automation', cat:'Decision Automation', title:'Decision Automation Design Partnership', sub:'Automate routine decisions with full audit trails and human override',
    quote:'Not all decisions need a human in the loop. But every automated decision needs an audit trail and the ability to override.',
    cardsTitle:'Automation Capabilities',
    cards:[['Workflow Automation','Automate decision workflows with policy gates','card--gold'],['Human Override','Always-available human intervention','card--blue'],['Evidence Generation','Automatic evidence for every automated decision','card--green']],
    ucTitle:'Automation Use Cases',
    useCases:['<strong>Approval workflows</strong> — Automated routing with documented decision rationale','<strong>Policy-based decisions</strong> — Automatic enforcement with exception handling','<strong>Escalation management</strong> — Intelligent escalation based on risk scoring','<strong>Compliance checks</strong> — Automated compliance verification with evidence','<strong>Resource allocation</strong> — AI-optimized allocation with human override'] },

  { id:'23-ai-red-teaming', cat:'AI Red-Teaming', title:'AI Red-Teaming Design Partnership', sub:'Adversarial testing of AI decisions — CendiaApotheosis and CendiaRedTeam',
    quote:'Your AI gets stronger while you sleep. CendiaApotheosis runs nightly red-teaming, auto-patching, and continuous upskilling.',
    cardsTitle:'Red-Teaming Capabilities',
    cards:[['CendiaRedTeam™','Adversarial challenge of every recommendation','card--gold'],['CendiaApotheosis™','Nightly red-teaming with auto-patching','card--red'],['CendiaDissent™','Formal dissent with retaliation protection','card--purple']],
    ucTitle:'Red-Teaming Use Cases',
    useCases:['<strong>Decision stress-testing</strong> — Adversarial challenge of critical recommendations','<strong>AI bias detection</strong> — Systematic testing for bias in AI outputs','<strong>Security assessment</strong> — Red-teaming of AI security posture','<strong>Compliance testing</strong> — Adversarial testing against regulatory requirements','<strong>Model validation</strong> — Independent challenge of AI model recommendations'] },

  { id:'24-data-lineage', cat:'Data Lineage', title:'Data Lineage & Governance Design Partnership', sub:'Complete data lineage — from source to decision to evidence',
    quote:'If you cannot trace a decision back to its data sources, you cannot explain it. Data lineage is the foundation of accountability.',
    cardsTitle:'Lineage Capabilities',
    cards:[['Knowledge Graph','Interactive data relationship visualization','card--gold'],['Provenance Tracking','Complete data-to-decision lineage','card--blue'],['Impact Analysis','Understand downstream effects of data changes','card--green']],
    ucTitle:'Data Lineage Use Cases',
    useCases:['<strong>Regulatory lineage</strong> — Trace decisions to source data for auditors','<strong>Data quality tracking</strong> — Monitor quality across the decision pipeline','<strong>Impact analysis</strong> — Assess downstream effects of data or model changes','<strong>Migration planning</strong> — Map dependencies before system migrations','<strong>Compliance documentation</strong> — Automated lineage documentation for frameworks'] },

  { id:'25-scenario-wargaming', cat:'Scenario Wargaming', title:'Scenario & Wargaming Design Partnership', sub:'Strategic wargaming — simulate consequences before committing resources',
    quote:"Don't just predict the future. Navigate it. Simulate the consequences of your decisions before you commit resources.",
    cardsTitle:'Wargaming Capabilities',
    cards:[['War Room Mode','Conflict before Consensus — structured adversarial debate','card--gold'],['CendiaCascade™','Butterfly Effect Engine — second and third-order consequences','card--blue'],['CendiaChronos™','Divergent futures — simulate multiple paths simultaneously','card--purple']],
    ucTitle:'Wargaming Use Cases',
    useCases:['<strong>Competitive scenario planning</strong> — Simulate competitor responses to your strategies','<strong>Crisis simulation</strong> — War-game crisis scenarios with multi-agent response','<strong>Market disruption modeling</strong> — Predict cascading effects of market changes','<strong>Geopolitical risk</strong> — Scenario planning for international operations','<strong>Regulatory impact</strong> — Model effects of proposed regulations across your business'] },
];

dps.forEach(d => dpDeck(d.id, d));
console.log('Done — 25 design partner decks generated.');
