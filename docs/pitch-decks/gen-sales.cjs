const e = require('./engine.cjs');
const path = require('path');
const base = __dirname;

console.log('Generating 25 Sales Pitch Decks...');

// Sales deck template: 10 slides
function salesDeck(id, cfg) {
  const dt = `SALES — ${cfg.cat.toUpperCase()}`;
  const T = 10;
  const slides = [
    e.titleS(cfg.title, cfg.sub, dt, T, false),
    cfg.slide2 || e.metricsS(dt, 2, T, cfg.metricsEye || 'THE CHALLENGE', cfg.metrics || [['72%','Enterprise AI Has No Audit Trail'],['$5.2M','Avg Cost of Non-Compliance'],['1,200+','Hours/Year Manual Compliance'],['0','Competitors with Full Solution']]),
    cfg.slide3 || e.bulletS(dt, 3, T, 'THE PROBLEM', cfg.problemTitle || 'What You\'re Facing Today', cfg.problems),
    e.whatWeDoS(dt, 4, T),
    cfg.slide5 || e.bulletS(dt, 5, T, 'YOUR SOLUTION', cfg.solutionTitle || 'How Datacendia Solves This', cfg.solutions),
    cfg.slide6 || e.pricingS(dt, 6, T),
    cfg.slide7 || e.deployS(dt, 7, T),
    cfg.slide8 || e.compliS(dt, 8, T),
    e.guaranteeS(dt, 9, T),
    e.ctaS(dt, 10, T, cfg.ctaHead || 'Ready to See It in Action?', cfg.ctaSub || 'Start with a 90-day pilot. Money-back guarantee.', cfg.ctaActs || ['Schedule Demo','Technical Deep Dive','Pilot Proposal']),
  ];
  const html = e.hd(cfg.title, dt) + slides.join('\n\n') + e.ft();
  e.writeDeck(path.join(base, 'sales', id + '.html'), html);
}

// 25 Sales decks
const sales = [
  // BY COMPANY SIZE (1-3)
  { id:'01-fortune-500', cat:'Fortune 500', title:'Datacendia for Fortune 500 Enterprises', sub:'Enterprise-scale decision intelligence with sovereign deployment',
    metrics:[['$50K','Pilot Entry — 90 Days'],['$500K+','Enterprise Annual License'],['500+','Users Per Deployment'],['99.99%','SLA Uptime']],
    problems:['Decision-making fragmented across dozens of tools and vendors','No unified audit trail for AI-assisted decisions','CLOUD Act exposure with current cloud AI vendors','Regulatory compliance evidence is manual and fragmented','No way to replay or verify past AI recommendations','Board and regulators demanding AI accountability'],
    solutions:['<strong>50+ agent Council</strong> — Unified decision intelligence across all domains','<strong>Cryptographic evidence</strong> — Immutable audit trail for every decision','<strong>Sovereign deployment</strong> — Private cloud or on-prem, no CLOUD Act exposure','<strong>One-click compliance</strong> — Automated evidence for SOC 2, ISO 27001, GDPR','<strong>Decision replay</strong> — Reproduce and verify any past decision','<strong>Zero-copy architecture</strong> — Data never leaves your infrastructure'],
    ctaHead:'Enterprise Intelligence Starts Here', ctaSub:'Join the enterprises building accountable AI.', ctaActs:['Executive Briefing','Architecture Review','Pilot Program'] },

  { id:'02-mid-market', cat:'Mid-Market', title:'Datacendia for Mid-Market Companies', sub:'Enterprise-grade decision intelligence at mid-market scale',
    metrics:[['$50K','Pilot — 90 Day Proof of Value'],['$150K','Foundation Annual License'],['50','Users Included'],['99.9%','SLA Uptime']],
    problems:['Growing complexity outpacing current decision tools','AI recommendations without documentation or rationale','Upcoming compliance requirements (EU AI Act, industry regs)','Data scattered across multiple systems and databases','No structured process for high-stakes decisions','Limited budget for enterprise-class platforms'],
    solutions:['<strong>Foundation tier</strong> — Full Council + DECIDE + DCII at $150K/yr','<strong>90-day pilot</strong> — Prove value on one strategic problem for $50K','<strong>Money-back guarantee</strong> — If Council doesn\'t find 3+ risks you missed, full refund','<strong>Zero-copy architecture</strong> — No expensive data warehouse needed','<strong>Cloud deployment</strong> — Fast setup, no infrastructure investment','<strong>26 languages</strong> — Support international operations from day one'],
    ctaHead:'Enterprise Intelligence, Mid-Market Pricing', ctaSub:'Start with a $50K pilot. Prove value in 90 days.', ctaActs:['Schedule Demo','ROI Calculator','Pilot Proposal'] },

  { id:'03-regulated-industries', cat:'Regulated Industries', title:'Datacendia for Regulated Industries', sub:'Compliance-first decision intelligence for healthcare, finance, energy, and government',
    metrics:[['€35M','Max EU AI Act Penalty'],['$5.2M','Avg Non-Compliance Cost'],['17','Jurisdictions Supported'],['5','Compliance Frameworks Mapped']],
    problems:['AI decisions without regulatory evidence','Manual compliance evidence collection taking 1,200+ hours/year','Cross-jurisdiction compliance complexity growing','Auditors demanding AI explainability and documentation','EU AI Act and DORA creating new mandatory requirements','Current tools don\'t generate compliance evidence automatically'],
    solutions:['<strong>Automatic evidence generation</strong> — Every decision produces auditor-ready packets','<strong>Control mapping</strong> — SOC 2, ISO 27001, GDPR, FedRAMP, HIPAA','<strong>Cross-jurisdiction</strong> — 17 jurisdictions tracked automatically','<strong>Gap scanner</strong> — Automatic identification of compliance gaps','<strong>Continuous monitoring</strong> — Real-time compliance posture tracking','<strong>Regulatory absorb</strong> — Ingest new regulations and map impact automatically'],
    ctaHead:'Compliance Without Compromise', ctaSub:'Build evidence as you decide. Not after the auditor calls.', ctaActs:['Compliance Briefing','Evidence Demo','Pilot Program'] },

  // BY INDUSTRY (4-8)
  { id:'04-banking', cat:'Banking & Capital Markets', title:'Datacendia for Banking & Capital Markets', sub:'Risk management, DORA compliance, and audit-ready AI for financial institutions',
    metrics:[['DORA','AI Resilience Mandate 2025'],['$10.4B','Regulatory Fines 2024'],['94%','Banks Lack AI Audit Trails'],['Basel III','Capital Requirements Tightening']],
    problems:['Credit decisions lack documented AI rationale','DORA requires operational resilience evidence for AI systems','Trading and risk AI without audit trail','Regulatory fines escalating year over year','No way to replay AI-influenced investment decisions','Cross-border compliance complexity (MiFID II, SOX, Basel)'],
    solutions:['<strong>Credit decision evidence</strong> — Multi-agent assessment with documented rationale and dissent','<strong>DORA compliance</strong> — Operational resilience testing with automated evidence','<strong>Investment committee</strong> — Structured deliberation with documented tradeoffs','<strong>Cross-border compliance</strong> — Multi-jurisdiction regulatory tracking','<strong>Fraud review</strong> — AI-flagged transactions with full decision lineage','<strong>Stress testing</strong> — Adversarial scenario modeling with evidence'],
    ctaHead:'Financial-Grade Evidence for Financial Decisions', ctaSub:'Prove every decision. Replay every recommendation.', ctaActs:['Finance Briefing','DORA Assessment','Pilot Program'] },

  { id:'05-insurance', cat:'Insurance', title:'Datacendia for Insurance Carriers', sub:'Underwriting, claims, and risk assessment with auditable AI decisions',
    metrics:[['$2.8B','InsurTech AI Market 2027'],['67%','Claims Using AI w/o Audit'],['$4.1M','Avg Regulatory Fine'],['0','Insurers w/ AI Dissent Tracking']],
    problems:['Underwriting AI recommendations without documented rationale','Claims decisions lacking audit trail for regulators','State-by-state compliance complexity growing','Fraud detection AI without explainability','Actuarial models without transparent evidence','Regulatory scrutiny increasing on AI-driven pricing'],
    solutions:['<strong>Underwriting intelligence</strong> — Multi-agent risk assessment with evidence','<strong>Claims review</strong> — Documented deliberation for every significant claim','<strong>Regulatory compliance</strong> — State-by-state evidence generation','<strong>Fraud analysis</strong> — AI-flagged cases with full decision lineage','<strong>Actuarial support</strong> — Scenario modeling with transparent assumptions','<strong>Catastrophe modeling</strong> — Multi-scenario impact assessment'],
    ctaHead:'Insure Your AI Decisions', ctaSub:'Every underwriting decision documented. Every claim auditable.', ctaActs:['Insurance Briefing','Claims Demo','Pilot Program'] },

  { id:'06-pharma', cat:'Pharma & Life Sciences', title:'Datacendia for Pharma & Life Sciences', sub:'Drug development, clinical trials, and FDA compliance with AI audit trails',
    metrics:[['$2.6B','Avg Drug Development Cost'],['12 yrs','Avg Time to Market'],['FDA','AI Documentation Requirements'],['ICH','Good Practice Standards']],
    problems:['FDA requires complete documentation of decision processes','Clinical trial decisions lack structured evidence','Drug interaction analysis without transparent reasoning','Manufacturing compliance evidence is manual','Patent strategy decisions without documented rationale','Cross-functional alignment fragmented across departments'],
    solutions:['<strong>Clinical trial design</strong> — Multi-agent protocol evaluation with safety focus','<strong>FDA submission support</strong> — Evidence-based documentation with complete audit trail','<strong>Drug interaction analysis</strong> — Multi-perspective safety assessment','<strong>Manufacturing compliance</strong> — GMP evidence generation','<strong>Patent strategy</strong> — IP landscape analysis with competitive intelligence','<strong>R&D prioritization</strong> — Investment analysis with risk assessment'],
    ctaHead:'Document Every Decision in the Pipeline', ctaSub:'FDA-ready evidence from research through commercialization.', ctaActs:['Pharma Briefing','Clinical Demo','Pilot Program'] },

  { id:'07-manufacturing', cat:'Manufacturing & Supply Chain', title:'Datacendia for Manufacturing & Supply Chain', sub:'Operational intelligence, vendor risk, and supply chain resilience',
    metrics:[['$4.4T','Global Supply Chain Disruption Cost'],['73%','Manufacturers Lack AI Governance'],['6-18mo','Avg Disruption Recovery'],['0','AI Tools w/ Supply Chain Evidence']],
    problems:['Supply chain decisions without documented risk assessment','Vendor selection lacking structured evaluation evidence','Quality issues without root cause traceability','Capital expenditure decisions without multi-perspective analysis','Production planning without scenario modeling','Compliance gaps across multi-site operations'],
    solutions:['<strong>Supply chain risk</strong> — Multi-tier vendor analysis with contingency planning','<strong>Vendor evaluation</strong> — Structured assessment with documented criteria','<strong>Quality analysis</strong> — Root cause identification with evidence trail','<strong>CapEx planning</strong> — Multi-agent investment analysis with scenarios','<strong>Production optimization</strong> — Capacity planning with risk modeling','<strong>Multi-site compliance</strong> — Unified evidence across facilities'],
    ctaHead:'Resilient Decisions for Resilient Supply Chains', ctaSub:'Map risks before they hit. Prove every decision.', ctaActs:['Manufacturing Briefing','Supply Chain Demo','Pilot Program'] },

  { id:'08-retail', cat:'Retail & Consumer', title:'Datacendia for Retail & Consumer Goods', sub:'Customer analytics, pricing, and inventory decisions with evidence',
    metrics:[['$5.9T','Global Retail Market'],['68%','Retailers Using AI w/o Governance'],['$3.2M','Avg Data Breach Cost Retail'],['GDPR/CCPA','Consumer Privacy Mandates']],
    problems:['Pricing decisions without documented rationale','Customer segmentation AI without explainability','Inventory decisions lacking risk assessment evidence','GDPR/CCPA compliance for AI-driven customer analytics','Omnichannel strategy decisions without structured analysis','Vendor and supplier selection without documented criteria'],
    solutions:['<strong>Pricing intelligence</strong> — Multi-agent pricing analysis with market context','<strong>Customer analytics</strong> — GDPR-compliant customer intelligence with evidence','<strong>Inventory optimization</strong> — Scenario-based demand planning','<strong>Privacy compliance</strong> — Consumer data handling with audit evidence','<strong>Omnichannel strategy</strong> — Multi-perspective channel optimization','<strong>Vendor management</strong> — Structured evaluation with documented criteria'],
    ctaHead:'Smarter Retail Decisions with Evidence', ctaSub:'From pricing to supply chain, every decision documented.', ctaActs:['Retail Briefing','Demo','Pilot Program'] },

  // BY PAIN POINT (9-15)
  { id:'09-compliance-risk', cat:'Compliance Risk', title:'Eliminate Compliance Risk with Datacendia', sub:'Automated compliance evidence — stop paying fines for AI you can\'t explain',
    metricsEye:'THE COMPLIANCE CRISIS',
    metrics:[['€35M','Max EU AI Act Penalty'],['$5.2M','Avg Non-Compliance Cost'],['72%','Failing AI Audits'],['1,200+','Hours/Year Manual Evidence']],
    problems:['AI decisions with zero audit trail','Manual compliance evidence taking months to compile','Auditors demanding AI explainability you cannot provide','EU AI Act enforcement starting 2025','DORA mandating AI operational resilience for finance','No way to prove AI recommendations were sound'],
    solutions:['<strong>Automatic evidence</strong> — Every decision generates auditor-ready packets','<strong>Control mapping</strong> — SOC 2, ISO 27001, GDPR, FedRAMP, HIPAA','<strong>One-click export</strong> — PDF + JSON, cryptographically signed','<strong>Continuous monitoring</strong> — Real-time compliance posture','<strong>Gap scanner</strong> — Automatic gap identification','<strong>Regulatory absorb</strong> — New regulations mapped to impact automatically'],
    ctaHead:'Stop Paying for Compliance You Don\'t Have', ctaSub:'Evidence as you decide. Not after the audit.', ctaActs:['Compliance Demo','Gap Assessment','Pilot Program'] },

  { id:'10-decision-speed', cat:'Decision Speed', title:'Accelerate Decisions with Datacendia', sub:'From weeks to hours — structured multi-agent deliberation at enterprise speed',
    metricsEye:'THE SPEED PROBLEM',
    metrics:[['23 days','Avg Enterprise Decision Cycle'],['67%','Decisions Delayed by Missing Data'],['$1.8M','Cost of Delayed Strategic Decisions'],['12','Council Modes for Every Speed']],
    problems:['Strategic decisions taking weeks or months','Missing data from key stakeholders causing delays','No structured process for cross-functional decisions','Slow consensus-building across departments','Information scattered across dozens of systems','Analysis paralysis on high-stakes decisions'],
    solutions:['<strong>Rapid mode</strong> — Decisions in minutes, not weeks','<strong>50+ agents simultaneously</strong> — Every perspective analyzed in parallel','<strong>Zero-copy data</strong> — Query all systems without waiting for ETL','<strong>12 council modes</strong> — Right process for every decision type','<strong>Structured dissent</strong> — Disagreements surfaced immediately, not weeks later','<strong>Evidence packets</strong> — Documentation generated automatically, not manually'],
    ctaHead:'Decisions in Hours, Not Weeks', ctaSub:'50+ agents. 12 modes. Zero delays.', ctaActs:['Speed Demo','ROI Calculator','Pilot Program'] },

  { id:'11-ai-trust', cat:'AI Trust & Accountability', title:'Build Trust in AI with Datacendia', sub:'Explainable, auditable, replayable AI — not a black box',
    metricsEye:'THE TRUST DEFICIT',
    metrics:[['78%','Executives Don\'t Trust AI Recommendations'],['82%','AI Decisions Cannot Be Explained'],['91%','Boards Demanding AI Accountability'],['0','Competitors w/ Full Accountability']],
    problems:['AI recommendations are a black box — no one knows why','Board demanding AI governance and accountability','Employees don\'t trust AI-generated recommendations','No way to explain AI decisions to regulators','Cannot replay past AI recommendations to verify correctness','AI outputs inconsistent and unexplainable'],
    solutions:['<strong>Multi-agent deliberation</strong> — See every agent\'s reasoning, not just the answer','<strong>Dissent tracking</strong> — Know who disagreed and why','<strong>Decision replay</strong> — Reproduce any past decision identically','<strong>Evidence packets</strong> — Complete reasoning chain for every recommendation','<strong>Adversarial challenge</strong> — Red Team agent attacks every recommendation','<strong>Cryptographic proof</strong> — Tamper-evident evidence ledger'],
    ctaHead:'AI You Can Explain. AI You Can Trust.', ctaSub:'Every recommendation comes with proof.', ctaActs:['Trust Demo','Architecture Review','Pilot Program'] },

  { id:'12-data-silos', cat:'Data Silos', title:'Eliminate Data Silos with Datacendia', sub:'Zero-copy architecture — query everywhere without moving anything',
    metricsEye:'THE SILO PROBLEM',
    metrics:[['16','Production Connectors'],['0','ETL Pipelines Required'],['0','Data Copies Created'],['Minutes','Time to First Insight']],
    problems:['Data scattered across PostgreSQL, MySQL, Oracle, MongoDB, Salesforce, SAP','ETL pipelines breaking, stale, or months behind','Data warehouse projects over budget and over time','Cannot get unified view without massive data integration','Each department has its own data silo','Data movement creates compliance and security risks'],
    solutions:['<strong>Zero-copy architecture</strong> — Query data in place, never move it','<strong>16 production connectors</strong> — PostgreSQL, MySQL, Oracle, MongoDB, Salesforce, SAP, Snowflake, etc.','<strong>Read-only connections</strong> — Never modify source systems','<strong>No ETL required</strong> — Direct queries, no pipeline maintenance','<strong>Cross-database analysis</strong> — Unified intelligence without centralization','<strong>Compliance-safe</strong> — Data stays in controlled environments'],
    ctaHead:'Intelligence Without Data Movement', ctaSub:'Query everything. Move nothing. Decide faster.', ctaActs:['Architecture Demo','Connector Catalog','Pilot Program'] },

  { id:'13-audit-readiness', cat:'Audit Readiness', title:'Always Audit-Ready with Datacendia', sub:'One-click evidence packets — never scramble for an audit again',
    metricsEye:'THE AUDIT BURDEN',
    metrics:[['1,200+','Hours/Year Manual Evidence'],['$340K','Avg Audit Preparation Cost'],['6 weeks','Avg Audit Prep Time'],['1 click','Datacendia Evidence Export']],
    problems:['Audit evidence scattered across emails, spreadsheets, and shared drives','Manual evidence collection takes weeks for each audit','Cannot prove who made which decision and why','No timestamp verification on decision records','Evidence inconsistencies between departments','Audit findings increasing year over year'],
    solutions:['<strong>Automatic evidence</strong> — Generated as decisions are made, not retroactively','<strong>Cryptographic timestamps</strong> — Tamper-evident time attestation','<strong>One-click export</strong> — Complete evidence packet in PDF + JSON','<strong>Customer-owned signatures</strong> — Ed25519/RSA-PSS via your KMS/HSM','<strong>Control mapping</strong> — Evidence mapped to SOC 2, ISO 27001, NIST controls','<strong>Independent verification</strong> — CendiaWitness™ verifies without trusting us'],
    ctaHead:'Audit-Ready. Always.', ctaSub:'Evidence as you decide. Export in one click.', ctaActs:['Evidence Demo','Control Mapping Review','Pilot Program'] },

  { id:'14-vendor-lock-in', cat:'Vendor Lock-In', title:'Escape Vendor Lock-In with Datacendia', sub:'Open-source foundation, sovereign deployment, customer-owned data',
    metricsEye:'THE LOCK-IN PROBLEM',
    metrics:[['CLOUD Act','US Gov Access to Cloud Data'],['Apache 2.0','Open-Source Community Edition'],['4','Deployment Modes'],['0','Vendor Access Required']],
    problems:['Cloud AI vendors have access to your data and decisions','CLOUD Act allows US government to compel disclosure','Switching costs increase with every year of vendor dependency','No data portability — your intelligence locked in vendor systems','Vendor pricing increases with no alternative','Cannot run AI offline or in classified environments'],
    solutions:['<strong>Apache 2.0 community edition</strong> — Open-source foundation, no lock-in','<strong>4 deployment modes</strong> — Cloud to air-gapped, your choice','<strong>Customer-owned data</strong> — Zero-copy, data never leaves your systems','<strong>Customer-owned keys</strong> — Your KMS/HSM, your encryption','<strong>Full export capability</strong> — All data and evidence exportable at any time','<strong>On-prem option</strong> — No external connectivity required'],
    ctaHead:'Own Your Intelligence', ctaSub:'Open source. Sovereign deployment. Your data. Your keys.', ctaActs:['Architecture Review','Open Source Tour','Pilot Program'] },

  { id:'15-ai-governance-gap', cat:'AI Governance', title:'Close the AI Governance Gap with Datacendia', sub:'CendiaGateway — control, audit, and govern every AI interaction',
    metricsEye:'THE GOVERNANCE GAP',
    metrics:[['83%','Enterprises Have Shadow AI'],['0','Organizations w/ Full AI Governance'],['EU AI Act','Enforcement Starting 2025'],['$0','Shadow AI Audit Trail']],
    problems:['Employees using ChatGPT, Copilot, Claude without oversight','Sensitive data leaking to external AI services','No audit trail for AI-assisted decisions','No policy enforcement on AI usage','Cannot measure AI adoption or costs','Regulators will demand AI governance you don\'t have'],
    solutions:['<strong>CendiaGateway</strong> — Route all AI through governance layer','<strong>Policy enforcement</strong> — Automatic compliance gates on AI interactions','<strong>Browser extensions</strong> — Govern AI across all browsers and tools','<strong>Usage analytics</strong> — Track adoption, costs, and patterns','<strong>DLP integration</strong> — Prevent sensitive data reaching external AI','<strong>Complete audit trail</strong> — Every AI interaction logged and searchable'],
    ctaHead:'Govern AI Before Regulators Force You To', ctaSub:'From shadow AI to governed AI in weeks.', ctaActs:['Gateway Demo','Shadow AI Assessment','Pilot Program'] },

  // VS COMPETITORS (16-20)
  { id:'16-vs-traditional-bi', cat:'vs Traditional BI', title:'Datacendia vs. Traditional BI', sub:'Why Tableau, Power BI, and Looker aren\'t enough for high-stakes decisions',
    slide2: null, slide3: null, slide5: null,
    problems:null, solutions:null },

  { id:'17-vs-cloud-ai', cat:'vs Cloud AI', title:'Datacendia vs. Cloud AI Platforms', sub:'Why ChatGPT Enterprise, Azure AI, and AWS Bedrock fall short',
    slide2: null, slide3: null, slide5: null,
    problems:null, solutions:null },

  { id:'18-vs-data-platforms', cat:'vs Data Platforms', title:'Datacendia vs. Data Platforms', sub:'Why Palantir, Databricks, and Snowflake aren\'t decision intelligence',
    slide2: null, slide3: null, slide5: null,
    problems:null, solutions:null },

  { id:'19-vs-grc', cat:'vs GRC Platforms', title:'Datacendia vs. GRC Platforms', sub:'Why ServiceNow GRC, Archer, and OneTrust don\'t solve AI accountability',
    slide2: null, slide3: null, slide5: null,
    problems:null, solutions:null },

  { id:'20-vs-chatbots', cat:'vs AI Chatbots', title:'Datacendia vs. AI Chatbots', sub:'Why ChatGPT, Copilot, and Claude aren\'t enterprise decision systems',
    slide2: null, slide3: null, slide5: null,
    problems:null, solutions:null },

  // BY DEPLOYMENT (21-25)
  { id:'21-cloud-deploy', cat:'Cloud Deployment', title:'Datacendia Cloud Deployment', sub:'Full SaaS — fastest time to value, fully managed',
    metricsEye:'CLOUD DEPLOYMENT',
    metrics:[['Hours','Time to First Value'],['99.99%','SLA Uptime'],['Full','Managed Infrastructure'],['SOC 2','Security Controls']],
    problems:['Need enterprise AI but don\'t want infrastructure overhead','Want fastest possible time to value','IT team focused on core business, not managing AI platforms','Need automatic updates and security patches','Want predictable costs with no surprise infrastructure bills','Need immediate availability across global teams'],
    solutions:['<strong>Fully managed</strong> — We handle infrastructure, updates, security','<strong>Hours to deploy</strong> — Connect data sources and start deliberating','<strong>Automatic scaling</strong> — Handle peak loads without capacity planning','<strong>Global availability</strong> — Low-latency access worldwide','<strong>Continuous updates</strong> — New features and security patches automatically','<strong>Predictable pricing</strong> — Annual license, no infrastructure surprises'] },

  { id:'22-private-cloud', cat:'Private Cloud', title:'Datacendia Private Cloud Deployment', sub:'Your VPC, your control — with metadata-only telemetry',
    metricsEye:'PRIVATE CLOUD',
    metrics:[['Your VPC','Data Location'],['Metadata','Our Access Level'],['Days','Setup Time'],['99.99%','SLA Uptime']],
    problems:['Need sovereign control but don\'t want on-prem complexity','Regulators require data residency in specific regions','CLOUD Act concerns with standard SaaS providers','Need to demonstrate data never leaves your environment','Want cloud convenience with sovereign control','Compliance requires your own encryption keys'],
    solutions:['<strong>Your VPC</strong> — Deployed in your AWS/Azure/GCP account','<strong>Metadata-only access</strong> — We see usage metrics, never your data','<strong>Customer-owned keys</strong> — Your KMS, your encryption','<strong>Data residency</strong> — Choose your region, data never leaves','<strong>Network isolation</strong> — Private endpoints, no public access','<strong>Days to deploy</strong> — Terraform/CloudFormation templates provided'] },

  { id:'23-on-prem', cat:'On-Premises', title:'Datacendia On-Premises Deployment', sub:'Your data center — zero external access, full sovereignty',
    metricsEye:'ON-PREMISES',
    metrics:[['Your DC','Data Location'],['None','Our Access'],['Weeks','Setup Time'],['Full','Sovereignty']],
    problems:['Regulatory requirements prohibit cloud deployment','Data cannot leave your physical data center','Need complete control over all infrastructure','Zero external connectivity requirements','Industry regulations mandate on-premises AI','Board mandates no third-party data access'],
    solutions:['<strong>Your data center</strong> — Deployed on your hardware','<strong>Zero external access</strong> — No outbound connectivity required','<strong>Customer-managed</strong> — Full control over updates and configuration','<strong>HSM/TPM support</strong> — Hardware security modules for key management','<strong>Network isolation</strong> — Completely isolated from external networks','<strong>Air-gap ready</strong> — Can be upgraded to full air-gapped if needed'] },

  { id:'24-air-gapped', cat:'Air-Gapped', title:'Datacendia Air-Gapped Deployment', sub:'Physically isolated — zero connectivity, hardware-rooted trust',
    metricsEye:'AIR-GAPPED DEPLOYMENT',
    metrics:[['0','External Connectivity'],['TPM 2.0','Hardware-Rooted Trust'],['11','Sovereign Patterns'],['USB','Portable Deployment Option']],
    problems:['Classified data cannot be exposed to any external system','ITAR/export control prohibits foreign access','Critical infrastructure must operate in isolation','Intelligence operations require zero external dependency','Regulatory environment mandates physical isolation','No existing AI platform supports true air-gap'],
    solutions:['<strong>Zero connectivity</strong> — Physically isolated, no external network','<strong>TPM attestation</strong> — Hardware-rooted trust, not software-only','<strong>Portable USB instance</strong> — Deploy from secure media in field conditions','<strong>QR Air-Gap Bridge</strong> — Optical data transfer across classification boundaries','<strong>Data Diode</strong> — One-way data flow enforcement','<strong>Deterministic Replay</strong> — Reproduce decisions without connectivity'] },

  { id:'25-hybrid', cat:'Hybrid Deployment', title:'Datacendia Hybrid Deployment', sub:'Mix deployment modes — cloud for some, on-prem for sensitive',
    metricsEye:'HYBRID DEPLOYMENT',
    metrics:[['4','Deployment Modes Available'],['Mix','Cloud + On-Prem + Air-Gap'],['Unified','Single Management Plane'],['Flexible','Scale Per Department']],
    problems:['Different departments have different security requirements','Some data can be in cloud, other data must stay on-prem','Acquisitions bring mixed infrastructure environments','Regulations vary by geography and business unit','Need unified intelligence across deployment modes','Want to start in cloud and migrate sensitive workloads on-prem'],
    solutions:['<strong>Mixed deployment</strong> — Cloud, private cloud, on-prem, air-gapped per department','<strong>Unified management</strong> — Single pane of glass across all deployments','<strong>Gradual migration</strong> — Start cloud, move sensitive workloads on-prem over time','<strong>Per-department control</strong> — Different security postures per business unit','<strong>Consistent experience</strong> — Same interface and features regardless of deployment','<strong>Flexible scaling</strong> — Scale each deployment independently'] },
];

// Custom competitor comparison slides for decks 16-20
function compSlides(id, dt, T, name, them, us, tbl) {
  return [
    e.titleS(`Datacendia vs. ${name}`, `Why ${name} isn't enough for enterprise decision intelligence`, dt, T, false),
    e.tableS(dt, 2, T, 'CAPABILITY COMPARISON', `${name} vs. Datacendia`, ['Capability', name, 'Datacendia'], tbl),
    e.twoColS(dt, 3, T, `WHAT ${name.toUpperCase()} DOES`, 'Their Approach',
      `<ul>${them.map(t=>`<li>${t}</li>`).join('')}</ul>`,
      `<h4 class="gold">What Datacendia Adds</h4><ul style="margin-top:12px">${us.map(u=>`<li><span class="green">${u}</span></li>`).join('')}</ul>`),
    e.whatWeDoS(dt, 4, T),
    e.councilS(dt, 5, T),
    e.pricingS(dt, 6, T),
    e.deployS(dt, 7, T),
    e.compliS(dt, 8, T),
    e.guaranteeS(dt, 9, T),
    e.ctaS(dt, 10, T, `Ready to Go Beyond ${name}?`, 'See the difference in a 90-day pilot.', ['Schedule Demo', 'Comparison Briefing', 'Pilot Proposal']),
  ];
}

// Generate standard sales decks (1-15, 21-25)
sales.forEach(s => {
  if (s.problems === null) return; // skip competitor decks
  salesDeck(s.id, s);
});

// Generate competitor comparison decks (16-20)
const compDefs = [
  { id:'16-vs-traditional-bi', name:'Traditional BI (Tableau/Power BI)',
    them:['Data visualization and dashboards','Self-service analytics','Historical reporting','KPI monitoring','Drag-and-drop chart building'],
    us:['Multi-agent deliberation on your data','Cryptographic evidence for every insight','Future simulation, not just historical charts','Adversarial challenge of recommendations','Sovereign deployment options'],
    tbl:[['Multi-agent deliberation','—','✓'],['Cryptographic audit trail','—','✓'],['Scenario simulation','—','✓'],['Decision replay','—','✓'],['Air-gapped deployment','—','✓'],['Dissent tracking','—','✓'],['Compliance evidence','—','✓'],['Zero-copy architecture','—','✓']] },
  { id:'17-vs-cloud-ai', name:'Cloud AI (ChatGPT/Azure/Bedrock)',
    them:['Single-model AI responses','General-purpose chatbot','Cloud-only deployment','Vendor-managed infrastructure','Prompt-based interaction'],
    us:['50+ agent structured deliberation','Domain-specific decision intelligence','4 deployment modes including air-gapped','Customer-owned infrastructure option','Formal dissent and adversarial challenge'],
    tbl:[['Multi-agent deliberation','—','✓'],['Cryptographic audit trail','—','✓'],['Air-gapped deployment','—','✓'],['Dissent tracking','—','✓'],['Decision replay','—','✓'],['Zero-copy data','—','✓'],['Never trains on your data','Varies','✓'],['CLOUD Act safe (on-prem)','—','✓']] },
  { id:'18-vs-data-platforms', name:'Data Platforms (Palantir/Databricks)',
    them:['Data integration and ETL','Data lakehouse/warehouse','ML model training','Data engineering workflows','Enterprise data management'],
    us:['Decision intelligence, not just data management','Multi-agent deliberation with evidence','Zero-copy — no ETL or data movement','Compliance evidence automatic','Open-source community edition'],
    tbl:[['Multi-agent deliberation','—','✓'],['Cryptographic audit trail','Partial','✓'],['Zero-copy (no ETL)','—','✓'],['Dissent tracking','—','✓'],['Decision replay','—','✓'],['90-day guarantee','—','✓'],['Open-source edition','—','✓'],['Compliance evidence auto','—','✓']] },
  { id:'19-vs-grc', name:'GRC (ServiceNow/Archer/OneTrust)',
    them:['Risk and compliance workflows','Checklist management','Manual evidence collection','Policy management','Vendor risk management'],
    us:['AI-powered decision intelligence','Automatic evidence generation','Multi-agent analysis, not manual checklists','Cryptographic proof, not workflow tracking','Air-gapped deployment for classified'],
    tbl:[['AI decision-making','—','✓'],['Multi-agent analysis','—','✓'],['Automatic evidence','—','✓'],['Cryptographic signatures','—','✓'],['Decision replay','—','✓'],['Air-gapped deployment','Rare','✓'],['Zero-copy data','—','✓'],['Dissent tracking','—','✓']] },
  { id:'20-vs-chatbots', name:'AI Chatbots (ChatGPT/Copilot/Claude)',
    them:['General-purpose chat interface','Single-model responses','Cloud-only operation','Consumer-grade AI','Prompt-based Q&A'],
    us:['50+ agent domain-specific deliberation','Structured dissent and adversarial challenge','4 deployment modes including air-gapped','Enterprise-grade with cryptographic evidence','Formal decision process with evidence'],
    tbl:[['Multi-agent deliberation','—','✓'],['Structured dissent','—','✓'],['Cryptographic evidence','—','✓'],['Air-gapped deployment','—','✓'],['Decision replay','—','✓'],['Domain-specific agents','—','✓'],['Compliance evidence','—','✓'],['Enterprise SLA','—','✓']] },
];

compDefs.forEach(c => {
  const dt = `SALES — ${c.name.split('(')[0].trim().toUpperCase()}`;
  const T = 10;
  const slides = compSlides(c.id, dt, T, c.name, c.them, c.us, c.tbl);
  const html = e.hd(`Datacendia vs. ${c.name}`, dt) + slides.join('\n\n') + e.ft();
  e.writeDeck(path.join(base, 'sales', c.id + '.html'), html);
});

console.log('Done — 25 sales decks generated.');
