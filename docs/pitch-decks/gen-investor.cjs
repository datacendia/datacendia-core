const e = require('./engine.cjs');
const path = require('path');
const base = __dirname;

console.log('Generating 10 Investor Pitch Decks...');

const decks = [
  { id:'01-series-a-overview', title:'Series A Overview', sub:'Decision Crisis Immunization Infrastructure for the Enterprise', dt:'INVESTOR DECK' },
  { id:'02-ai-governance-market', title:'The AI Governance Imperative', sub:'Why regulated enterprises need accountable AI — and why now', dt:'INVESTOR — AI GOVERNANCE' },
  { id:'03-sovereign-ai', title:'Sovereign AI Infrastructure', sub:'The only platform that runs air-gapped with hardware-rooted trust', dt:'INVESTOR — SOVEREIGN AI' },
  { id:'04-multi-agent-tech', title:'Multi-Agent Decision Intelligence', sub:'Why single AI models fail for high-stakes decisions', dt:'INVESTOR — TECHNOLOGY' },
  { id:'05-compliance-platform', title:'Enterprise Compliance at Scale', sub:'Automated evidence for SOC 2, ISO 27001, GDPR, FedRAMP, HIPAA', dt:'INVESTOR — COMPLIANCE' },
  { id:'06-healthcare', title:'Healthcare AI Governance', sub:'Clinical decision support with HIPAA-compliant audit trails', dt:'INVESTOR — HEALTHCARE' },
  { id:'07-financial-services', title:'Financial Services Decision Intelligence', sub:'Risk management and audit-ready AI for banking', dt:'INVESTOR — FINSERV' },
  { id:'08-gov-defense', title:'Government & Defense AI', sub:'Sovereign AI for national security — air-gapped, ITAR-compliant', dt:'INVESTOR — GOV/DEFENSE' },
  { id:'09-business-model', title:'Platform Economics & Revenue Model', sub:'High-margin enterprise SaaS with sovereign premium', dt:'INVESTOR — BUSINESS MODEL' },
  { id:'10-competitive-moat', title:'Competitive Landscape & Moat', sub:'Seven layers of defensibility in sovereign decision intelligence', dt:'INVESTOR — COMPETITIVE' },
];

// Unique slide content per deck
const deckSlides = {
  '01-series-a-overview': (dt,T) => [
    e.titleS('Datacendia',decks[0].sub,dt,T),
    e.quoteS(dt,2,T,'Modern enterprises have surrendered their minds. They traded ownership for convenience — until they became tenants in their own systems.','The Datacendia Manifesto'),
    e.whatWeDoS(dt,3,T),
    e.platMetrics(dt,4,T),
    e.metricsS(dt,5,T,'MARKET OPPORTUNITY',[['$47B','Decision Intelligence TAM 2030'],['$18B','AI Governance SAM 2028'],['$4.2B','Sovereign AI SOM 2027'],['38%','CAGR Enterprise AI Gov']]),
    e.councilS(dt,6,T),
    e.pricingS(dt,7,T),
    e.deployS(dt,8,T),
    e.bulletS(dt,9,T,'COMPETITIVE MOAT','Why Datacendia Wins',['<strong>Multi-agent deliberation</strong> — No competitor has 14-agent boardroom simulation','<strong>Cryptographic audit trail</strong> — Immutable evidence with Ed25519/RSA-PSS signatures','<strong>Zero-copy architecture</strong> — Data never leaves customer databases','<strong>Air-gapped deployment</strong> — Only platform running offline with hardware-rooted trust','<strong>11 sovereign patterns</strong> — Data Diode, TPM Attestation, Federated Mesh, etc.','<strong>Open-source foundation</strong> — Apache 2.0 community edition builds trust pipeline','<strong>90-day money-back guarantee</strong> — Prove value or refund']),
    e.ctaS(dt,10,T,"Let's Build the Future of Enterprise Intelligence",'Datacendia is raising to scale sovereign AI infrastructure globally.',['Schedule Deep Dive','Technical Demo','Data Room Access']),
  ],
  '02-ai-governance-market': (dt,T) => [
    e.titleS('The AI Governance Imperative',decks[1].sub,dt,T),
    e.metricsS(dt,2,T,'THE REGULATORY WAVE',[['EU AI Act',"World's First AI Law — 2024"],['DORA','Financial AI Resilience — 2025'],['€35M','Max Penalty — 7% Revenue'],['0','Enterprises Fully Compliant']]),
    e.bulletS(dt,3,T,'THE PROBLEM',"Enterprises Have AI. They Don't Have Accountability.",['No audit trail for AI-assisted decisions','No explainability — why did AI recommend X over Y?','No dissent tracking — groupthink encoded in algorithms','No regulator-ready evidence packets','No decision replay or verification','CLOUD Act exposure with every cloud AI vendor']),
    e.whatWeDoS(dt,4,T),
    e.compliS(dt,5,T),
    e.metricsS(dt,6,T,'MARKET SIZE',[['$47B','Decision Intelligence TAM 2030'],['$18B','AI Governance SAM 2028'],['38%','CAGR Enterprise AI Gov'],['$4.2B','Sovereign AI SOM 2027']]),
    e.tableS(dt,7,T,'COMPETITIVE LANDSCAPE','No One Else Does This',['Capability','Traditional BI','Cloud AI','GRC Platforms','Datacendia'],[['Multi-agent deliberation','—','—','—','✓'],['Cryptographic audit trail','—','—','Partial','✓'],['Air-gapped deployment','—','—','Rare','✓'],['Decision replay','—','—','—','✓'],['Zero-copy data architecture','—','—','—','✓'],['Dissent tracking','—','—','—','✓']]),
    e.pricingS(dt,8,T),
    e.bulletS(dt,9,T,'GO-TO-MARKET','Land & Expand Strategy',['<strong>Land</strong> — $50K pilot on single problem (90-day, money-back guarantee)','<strong>Prove</strong> — Council identifies ≥3 critical risks customer missed','<strong>Expand</strong> — Department rollout at $150K–$500K/yr','<strong>Enterprise</strong> — Full platform at $500K–$1.5M/yr','<strong>Strategic</strong> — Nation-scale at $1.5M–$100M+/yr','<strong>Open Source Pipeline</strong> — Apache 2.0 community edition drives awareness']),
    e.ctaS(dt,10,T,"The AI Governance Market Is Emerging. We're Already Here.",'First-mover in sovereign decision intelligence.',['Schedule Deep Dive','Data Room','Customer References']),
  ],
  '03-sovereign-ai': (dt,T) => [
    e.titleS('Sovereign AI Infrastructure','Your infrastructure. Your keys. Your control.',dt,T),
    e.bulletS(dt,2,T,'THE SOVEREIGNTY CRISIS','Cloud AI Is a Liability for Regulated Enterprise',['<strong>CLOUD Act</strong> — US gov can compel disclosure from US-based providers','<strong>GDPR Article 48</strong> — Prohibits transfers based on foreign government orders','<strong>ITAR/EAR</strong> — Export control prohibits foreign access to controlled data','<strong>Critical infrastructure</strong> — Power, water, telecom cannot use cloud AI','<strong>Intelligence community</strong> — Classified data cannot be exposed externally','<strong>Financial regulations</strong> — DORA requires operational resilience for AI systems']),
    e.deployS(dt,3,T),
    e.bulletS(dt,4,T,'11 SOVEREIGN PATTERNS','Enterprise-Grade Sovereign Architecture',e.SOV_PATTERNS.map(p=>`<strong>${p}</strong>`)),
    e.twoColS(dt,5,T,'ZERO-COPY ARCHITECTURE','Your Data Never Leaves Your Database','<p style="color:var(--text-secondary);font-size:16px;line-height:1.7">Query in place — PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, DB2. No ETL. No data movement. No copies.</p><ul style="margin-top:16px"><li><strong>Read-only connections</strong> — never modify origin systems</li><li><strong>Customer-owned encryption</strong> — your KMS/HSM, your keys</li><li><strong>Evidence on your infrastructure</strong> — audit ledger stays with you</li></ul>','<div class="card card--gold"><h4 class="gold">Emergency Protocols</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">Instant key lockdown, network isolation, forensic snapshot — all customer-controlled.</p></div><div class="card card--blue" style="margin-top:16px"><h4 class="blue">Hardware-Rooted Trust</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">TPM 2.0 attestation, HSM key storage, Ed25519/RSA-PSS signing.</p></div>'),
    e.metricsS(dt,6,T,'SOVEREIGN MARKET',[['$4.2B','Sovereign AI Market 2027'],['42%','CAGR Sovereign Cloud'],['140+','Countries w/ Data Sovereignty Laws'],['0','Competitors w/ Full Air-Gap+TPM']]),
    e.pricingS(dt,7,T),
    e.tableS(dt,8,T,'TARGET SEGMENTS','Who Needs Sovereign AI?',['Segment','Requirement','Deployment','Price'],[['Defense Contractors','ITAR, CUI, Classified','Air-Gapped','Custom'],['Intelligence Community','SIGINT/HUMINT','Air-Gapped','Custom'],['Critical Infrastructure','Power, Water, Telecom','On-Prem/Air-Gap','$1.5M+'],['Financial Services','DORA, PCI-DSS, SOX','Private Cloud/On-Prem','$500K–$1.5M'],['Healthcare','HIPAA, PHI','Private Cloud','$500K–$1.5M'],['EU Enterprises','GDPR, EU AI Act','Private Cloud/On-Prem','$500K+']]),
    e.guaranteeS(dt,9,T),
    e.ctaS(dt,10,T,'Own Your Intelligence. Own Your Future.','The sovereign AI market is exploding. We are the only platform ready.',['Security Briefing','Architecture Review','Pilot Program']),
  ],
  '04-multi-agent-tech': (dt,T) => [
    e.titleS('Multi-Agent Decision Intelligence','Not a chatbot. A boardroom of specialized intelligences.',dt,T),
    e.quoteS(dt,2,T,"You don't get a chatbot answer. You get a boardroom debate. 14 specialized agents — CFO, CISO, Risk, Strategy, Legal — deliberating on your data with structured dissent."),
    e.cardsS(dt,3,T,'THE COUNCIL™','14 Specialized Agents',e.AGENTS_SHORT.slice(0,6).map(a=>[`${a[0]} — ${a[1]}`,`Specialized ${a[1].toLowerCase()} analysis`,'card--gold']),3),
    e.cardsS(dt,4,T,'THE COUNCIL™ (CONT.)','Plus Risk, Legal, Revenue, Data, Red Team, and Arbiter',e.AGENTS_SHORT.slice(6).map(a=>[`${a[0]} — ${a[1]}`,`${a[1]} perspective in every deliberation`]),4),
    e.tableS(dt,5,T,'12 COUNCIL MODES','Same Agents, Different Directives = Different Outcomes',['Mode','Prime Directive'],[['War Room','Conflict before Consensus'],['Due Diligence','Evidence over Opinion'],['Innovation Lab','Possibility before Practicality'],['Compliance','Regulation before Revenue'],['Crisis','Speed before Perfection'],['Execution','Action before Analysis'],['Research','Depth before Breadth'],['Investment','Return before Risk'],['Stakeholder','Alignment before Action'],['Rapid','Decision in Minutes'],['Advisory','Guidance before Governance'],['Governance','Policy before Profit']]),
    e.twoColS(dt,6,T,'DELIBERATION PROCESS','How The Council Works','<ol style="color:var(--text-secondary)"><li style="margin-bottom:12px"><strong>Ingestion</strong> — Connect data sources (zero-copy, read-only)</li><li style="margin-bottom:12px"><strong>Agent Activation</strong> — Each agent analyzes from their domain</li><li style="margin-bottom:12px"><strong>Deliberation</strong> — Agents debate, challenge, and dissent</li><li style="margin-bottom:12px"><strong>Synthesis</strong> — Arbiter resolves conflicts</li><li style="margin-bottom:12px"><strong>Evidence</strong> — Full decision packet generated</li><li style="margin-bottom:12px"><strong>Export</strong> — PDF + JSON, cryptographically signed</li></ol>','<div class="card card--gold"><h4 class="gold">What Makes This Different</h4><ul style="margin-top:12px"><li>Not ensemble ML — <strong>structured deliberation</strong></li><li>Not RAG — <strong>multi-perspective reasoning</strong></li><li>Not prompt chaining — <strong>adversarial challenge</strong></li><li>Dissent is <strong>logged and protected</strong></li><li>Every step is <strong>replayable and auditable</strong></li></ul></div>'),
    e.bulletS(dt,7,T,'USE CASES','Real-World Council Deployments',["<strong>M&A Due Diligence</strong> — Ingest 5,000 PDFs, simulate regulatory blocks, synthesize risk-adjusted price","<strong>Supply Chain Shock</strong> — Map vendor dependencies, flag disruptions, stress-test alternatives","<strong>Regulatory Change</strong> — Absorb new regulation, map impact, generate compliance evidence","<strong>Crisis Response</strong> — Rapid multi-domain assessment with action plan","<strong>Investment Committee</strong> — Financial modeling with risk assessment and dissent tracking","<strong>Clinical Decision Support</strong> — Patient safety with regulatory compliance"]),
    e.platMetrics(dt,8,T),
    e.pricingS(dt,9,T),
    e.ctaS(dt,10,T,'The Future of Decision-Making Is Multi-Agent','Single-model AI is a chatbot. Multi-agent AI is an executive team.',['Technical Deep Dive','Live Demo','Architecture Review']),
  ],
  '05-compliance-platform': (dt,T) => [
    e.titleS('Enterprise Compliance at Scale',decks[4].sub,dt,T),
    e.metricsS(dt,2,T,'THE COMPLIANCE BURDEN',[['$5.2M','Avg Cost of Non-Compliance'],['72%','Enterprises Failing AI Audits'],['€35M','Max EU AI Act Penalty'],['1,200+','Hours/Year Manual Compliance']]),
    e.compliS(dt,3,T),
    e.twoColS(dt,4,T,'EVIDENCE GENERATION','What an Auditor Actually Receives','<ul><li><strong>Decision summary</strong> — PDF executive report</li><li><strong>Full decision trace</strong> — Inputs, evidence, tool calls, policies, rationale</li><li><strong>Data lineage</strong> — Complete provenance chain</li><li><strong>Agent dissent records</strong> — Every disagreement logged</li><li><strong>Timestamps</strong> — Cryptographic time attestation</li><li><strong>Signatures</strong> — Customer-owned key (Ed25519/RSA-PSS)</li><li><strong>manifest.json + hashes</strong> — Programmatic verification</li></ul>','<div class="card card--green"><h4 class="green">One-Click Export</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">Complete audit evidence packet exported in seconds. PDF for humans, JSON for programmatic verification. Signed with customer-owned keys.</p></div><div class="card" style="margin-top:16px"><h4>Control Mapping</h4><p style="color:var(--text-secondary);font-size:14px;margin-top:8px">Every test maps to NIST 800-53, SOC 2, and ISO 27001 control families.</p></div>'),
    e.bulletS(dt,5,T,'COMPLIANCE FEATURES','Built-In, Not Bolted On',['<strong>Immutable evidence ledger</strong> — Cryptographic proof of every decision','<strong>Continuous monitoring</strong> — Real-time compliance posture','<strong>Gap scanner</strong> — Automatic compliance gap identification','<strong>Cross-jurisdiction</strong> — 17 jurisdictions supported','<strong>Regulatory absorb</strong> — Ingest new regulations, map impact automatically','<strong>Policy engine</strong> — Automated enforcement and attestation','<strong>CendiaDissent™</strong> — Formal dissent with retaliation protection']),
    e.metricsS(dt,6,T,'MARKET OPPORTUNITY',[['$12B','GRC Market 2027'],['$8.4B','AI Compliance TAM 2028'],['34%','CAGR RegTech'],['100%','Enterprises Need This']]),
    e.pricingS(dt,7,T),
    e.deployS(dt,8,T),
    e.guaranteeS(dt,9,T),
    e.ctaS(dt,10,T,"Compliance Shouldn't Be an Afterthought",'Build evidence as you decide. Not after the auditor calls.',['Compliance Briefing','Evidence Demo','Pilot Program']),
  ],
  '06-healthcare': (dt,T) => [
    e.titleS('Healthcare AI Governance',decks[5].sub,dt,T),
    e.metricsS(dt,2,T,'HEALTHCARE AI CRISIS',[['$4.7B','Healthcare AI Market 2027'],['82%','Hospitals Using AI w/o Audit Trail'],['$2.1M','Avg HIPAA Violation Fine'],['0','AI Platforms w/ Clinical Dissent']]),
    e.bulletS(dt,3,T,'THE PROBLEM','Healthcare AI Has No Accountability Layer',['Clinical AI recommendations with <strong>no explainability</strong>','No audit trail for <strong>AI-influenced treatment decisions</strong>','HIPAA requires <strong>access logs and evidence</strong> — AI provides neither','EU AI Act classifies healthcare AI as <strong>high-risk</strong>','No way to <strong>replay and verify</strong> past recommendations','Patient safety incidents with <strong>no decision lineage</strong>']),
    e.cardsS(dt,4,T,'HEALTHCARE AGENTS','Specialized Clinical Intelligence',[['CMIO — Health IT','Clinical systems integration and health informatics','card--gold'],['PSO — Patient Safety','Safety, quality metrics, adverse event prevention','card--green'],['HCO — Health Compliance','HIPAA, FDA, CMS regulatory compliance','card--blue'],['COD — Clinical Operations','Efficiency, care coordination, resources','card--purple'],['Risk Agent','Clinical risk, malpractice exposure, safety scoring',''],['CFO Agent','Healthcare financial analysis, reimbursement optimization','']],3),
    e.bulletS(dt,5,T,'USE CASES','Healthcare Deployments',['<strong>Clinical protocol review</strong> — Multi-agent evaluation against safety, regulatory, and financial criteria','<strong>Hospital M&A due diligence</strong> — Clinical outcomes, compliance, financial health analysis','<strong>Regulatory change impact</strong> — CMS/FDA guidance mapped across operations','<strong>Patient safety incident review</strong> — Full decision replay with evidence preservation','<strong>Value-based care optimization</strong> — Balance quality metrics, outcomes, and financial sustainability']),
    e.compliS(dt,6,T),
    e.deployS(dt,7,T),
    e.pricingS(dt,8,T),
    e.guaranteeS(dt,9,T),
    e.ctaS(dt,10,T,'Healthcare AI Needs an Immune System','Patient safety, compliance, and clinical accountability in one platform.',['Healthcare Briefing','Clinical Demo','HIPAA Assessment']),
  ],
  '07-financial-services': (dt,T) => [
    e.titleS('Financial Services Decision Intelligence',decks[6].sub,dt,T),
    e.metricsS(dt,2,T,'FINANCIAL SERVICES AI GAP',[['$8.3B','FinTech AI Market 2027'],['$10.4B','Total Regulatory Fines 2024'],['DORA','AI Resilience Mandate 2025'],['94%','Banks Lack AI Audit Trails']]),
    e.cardsS(dt,3,T,'FINANCE AGENTS','Specialized Financial Intelligence',[['CFO — Financial Analysis','P&L analysis, budget forecasting, fiscal health','card--gold'],['Quant — Modeling','Financial modeling, risk quantification, scenarios','card--blue'],['Portfolio Manager','Investment strategy, asset allocation, optimization',''],['Credit Risk Officer','Credit analysis, counterparty risk, exposure','card--purple'],['Treasury Analyst','Cash management, liquidity, FX exposure',''],['Compliance Agent','SOX, PCI-DSS, DORA, Basel III compliance','card--green']],3),
    e.bulletS(dt,4,T,'USE CASES','Financial Services Deployments',['<strong>Credit decision review</strong> — Multi-agent assessment with dissent tracking','<strong>M&A due diligence</strong> — Risk-adjusted valuation with full evidence trail','<strong>DORA compliance</strong> — Operational resilience with automated evidence','<strong>Investment committee</strong> — Structured deliberation with documented rationale','<strong>Regulatory change</strong> — Map new regulations to P&L impact automatically','<strong>Fraud review</strong> — AI-flagged transactions with full decision lineage']),
    e.compliS(dt,5,T),
    e.deployS(dt,6,T),
    e.pricingS(dt,7,T),
    e.tableS(dt,8,T,'COMPETITIVE LANDSCAPE','Financial Services AI Comparison',['Capability','Bloomberg','Palantir','Kensho','Datacendia'],[['Multi-agent deliberation','—','—','—','✓'],['Audit-ready evidence','—','Partial','—','✓'],['DORA compliance evidence','—','—','—','✓'],['Air-gapped deploy','—','✓','—','✓'],['Dissent tracking','—','—','—','✓'],['Decision replay','—','—','—','✓']]),
    e.guaranteeS(dt,9,T),
    e.ctaS(dt,10,T,'Financial Decisions Deserve Financial-Grade Evidence','Prove every decision. Replay every recommendation.',['Finance Briefing','DORA Assessment','Pilot Program']),
  ],
  '08-gov-defense': (dt,T) => [
    e.titleS('Government & Defense AI',decks[7].sub,dt,T),
    e.metricsS(dt,2,T,'DEFENSE AI IMPERATIVE',[['$15.8B','US DoD AI Budget 2025'],['IL4/IL5','Impact Level Pathway'],['ITAR','Export Control Compliant'],['0','External Connectivity Required']]),
    e.bulletS(dt,3,T,'SOVEREIGN CAPABILITIES','Built for Classified Environments',['<strong>Air-gapped deployment</strong> — Zero external connectivity','<strong>TPM 2.0 attestation</strong> — Hardware-rooted trust','<strong>Customer-owned encryption</strong> — HSM/KMS, Ed25519/RSA-PSS','<strong>Portable USB instance</strong> — Deploy from secure media','<strong>QR Air-Gap Bridge</strong> — Optical data transfer across boundaries','<strong>Data Diode</strong> — One-way data flow enforcement','<strong>Canary Tripwires</strong> — Detect unauthorized access','<strong>Deterministic Replay</strong> — Reproduce any decision identically']),
    e.deployS(dt,4,T),
    e.cardsS(dt,5,T,'DEFENSE USE CASES','Mission-Critical Intelligence',[['Intelligence Analysis','Multi-source fusion with full audit trail and dissent tracking','card--gold'],['Acquisition Due Diligence','Defense contractor evaluation with ITAR-compliant evidence',''],['Operational Planning','Multi-domain scenario analysis with adversarial red-teaming','card--blue'],['Compliance Verification','CMMC, NIST 800-171/800-53, DFARS evidence generation','card--green']],2),
    e.tableS(dt,6,T,'PROCUREMENT','Government Procurement Ready',['Vehicle','Status','Detail'],[['FedRAMP Moderate','Control-Ready','Architecture designed to FedRAMP controls'],['IL4/IL5','Pathway Documented','DoD Impact Level requirements'],['CAGE Code','Available','Government contracting ready'],['AWS GovCloud','Supported','Private offers available'],['Source Code Escrow','Available','Full escrow on enterprise contracts']]),
    e.pricingS(dt,7,T),
    e.bulletS(dt,8,T,'SECURITY ARCHITECTURE','Defense-Grade Security Posture',['NIST 800-53 Rev 5 control family mapping','FIPS 140-2 validated cryptographic modules','Role-based access control with MFA','Network segmentation and micro-segmentation','Encrypted at rest (AES-256) and in transit (TLS 1.3)','Automated vulnerability scanning','Incident response playbooks and forensic snapshot']),
    e.guaranteeS(dt,9,T),
    e.ctaS(dt,10,T,'National Security Demands Sovereign Intelligence','Air-gapped. Hardware-rooted. ITAR-compliant. Mission-ready.',['Security Briefing','SCIF Demo','Clearance Verification']),
  ],
  '09-business-model': (dt,T) => [
    e.titleS('Platform Economics & Revenue Model',decks[8].sub,dt,T),
    e.metricsS(dt,2,T,'REVENUE MODEL',[['$50K','Pilot Entry Point'],['$150K+','Foundation Annual'],['$500K+','Enterprise Annual'],['$1.5M+','Strategic Annual']]),
    e.tableS(dt,3,T,'TIER ECONOMICS','Land & Expand Revenue Progression',['Stage','Price','Margin','Duration','Expansion Trigger'],[['Sandbox','$5K','90%+','2 weeks','Proves concept → Pilot'],['Pilot','$50K','80%+','90 days','Proves value → Foundation'],['Foundation','$150K–$500K/yr','85%+','Annual','Dept success → Enterprise'],['Enterprise','$500K–$1.5M/yr','80%+','Annual','Full rollout → Strategic'],['Strategic','$1.5M–$100M+/yr','75%+','Multi-year','Nation-scale']]),
    e.metricsS(dt,4,T,'UNIT ECONOMICS',[['85%+','Gross Margin Target'],['130%+','Net Revenue Retention'],['<18mo','Payback Period Target'],['4:1+','LTV:CAC Target']]),
    e.bulletS(dt,5,T,'REVENUE DRIVERS','Multiple Expansion Vectors',['<strong>Seat expansion</strong> — 10 → 50 → 500 → unlimited users','<strong>Tier upgrade</strong> — Foundation → Enterprise → Strategic','<strong>Vertical expansion</strong> — Single dept → multiple divisions','<strong>Deployment upgrade</strong> — Cloud → Private Cloud → On-Prem (premium)','<strong>Add-on revenue</strong> — Custom agents, premium support, services','<strong>Platform revenue</strong> — Marketplace for 3rd-party agents (roadmap)']),
    e.bulletS(dt,6,T,'GO-TO-MARKET','Efficient Enterprise Sales Motion',['<strong>Open-source pipeline</strong> — Apache 2.0 community edition','<strong>Content-led inbound</strong> — Technical guides, honesty matrices','<strong>Pilot-first sales</strong> — $50K with money-back guarantee','<strong>Partner channel</strong> — SI partners (Deloitte, Accenture, KPMG)','<strong>Cloud marketplace</strong> — AWS/Azure committed spend','<strong>Government channel</strong> — CAGE code, FedRAMP pathway']),
    e.metricsS(dt,7,T,'MARKET TIMING',[['EU AI Act','Enforcement 2025'],['DORA','Financial AI 2025'],['$47B','Decision Intel TAM 2030'],['First','Mover in Sovereign AI']]),
    e.bulletS(dt,8,T,'USE OF FUNDS','Capital Allocation Strategy',['<strong>Engineering (50%)</strong> — Platform, sovereign patterns, verticals','<strong>Sales & Marketing (25%)</strong> — Enterprise sales, partner program','<strong>Compliance & Security (15%)</strong> — SOC 2, FedRAMP, pen testing','<strong>Operations (10%)</strong> — Infrastructure, customer success']),
    e.bulletS(dt,9,T,'MILESTONES','Execution Roadmap',['<strong>H1 2026</strong> — SOC 2 Type II, 10 enterprise customers','<strong>H2 2026</strong> — ISO 27001, FedRAMP in process','<strong>2027</strong> — $10M ARR, 50 customers, first gov contract','<strong>2028</strong> — $25M ARR, international expansion']),
    e.ctaS(dt,10,T,'Join the Sovereign Intelligence Revolution','High-margin SaaS with regulatory tailwinds and zero competition.',['Financial Model','Customer Pipeline','Data Room']),
  ],
  '10-competitive-moat': (dt,T) => [
    e.titleS('Competitive Landscape & Moat',decks[9].sub,dt,T),
    e.tableS(dt,2,T,'CAPABILITY MATRIX','Datacendia vs. The Landscape',['Capability','Palantir','Dataiku','C3.ai','IBM Watson','Datacendia'],[['Multi-agent deliberation','—','—','—','—','✓'],['Cryptographic audit trail','Partial','—','—','Partial','✓'],['Air-gapped + TPM','✓','—','—','—','✓'],['Zero-copy data arch','—','—','—','—','✓'],['Dissent tracking','—','—','—','—','✓'],['Decision replay','—','—','—','—','✓'],['90-day guarantee','—','—','—','—','✓'],['Open-source edition','—','—','—','—','✓']]),
    e.bulletS(dt,3,T,'SEVEN-LAYER MOAT','Structural Competitive Advantages',['<strong>1. Multi-Agent Architecture</strong> — 14 domain-specific agents with formal dissent','<strong>2. Cryptographic Proof</strong> — Ed25519/RSA-PSS evidence, not just logs','<strong>3. Sovereign Deployment</strong> — 11 patterns including TPM and USB instance','<strong>4. Zero-Copy Architecture</strong> — Data stays in customer DB, 16+ connectors','<strong>5. Open-Source Foundation</strong> — Apache 2.0 builds trust pipeline','<strong>6. Regulatory Timing</strong> — EU AI Act + DORA create mandatory demand','<strong>7. Network Effects</strong> — Agent marketplace strengthens over time']),
    e.twoColS(dt,4,T,'VS PALANTIR','Different Market, Different Approach','<h4>Palantir Foundry</h4><ul style="margin-top:12px"><li>Data integration and analytics</li><li>Strong in government/defense</li><li>$1B+ revenue, established brand</li><li><span class="red">No multi-agent deliberation</span></li><li><span class="red">No formal dissent tracking</span></li><li><span class="red">No decision replay</span></li><li><span class="red">Proprietary lock-in</span></li></ul>','<h4 class="gold">Datacendia</h4><ul style="margin-top:12px"><li>Decision intelligence w/ accountability</li><li>Multi-agent deliberation engine</li><li><span class="green">Structured dissent and adversarial challenge</span></li><li><span class="green">Cryptographic evidence packets</span></li><li><span class="green">Decision replay and verification</span></li><li><span class="green">Open-source community edition</span></li><li><span class="green">Zero-copy — data never moves</span></li></ul>'),
    e.twoColS(dt,5,T,'VS CLOUD AI',"Why ChatGPT / Azure AI / Bedrock Aren't Enough",'<h4>Cloud AI Platforms</h4><ul style="margin-top:12px"><li>Single-model responses</li><li>No structured deliberation</li><li><span class="red">CLOUD Act exposure</span></li><li><span class="red">No audit trail</span></li><li><span class="red">No dissent tracking</span></li><li><span class="red">Cannot run air-gapped</span></li></ul>','<h4 class="gold">Datacendia</h4><ul style="margin-top:12px"><li>14-agent boardroom deliberation</li><li>Structured adversarial challenge</li><li><span class="green">No CLOUD Act exposure (on-prem)</span></li><li><span class="green">Immutable cryptographic audit trail</span></li><li><span class="green">Formal dissent logging</span></li><li><span class="green">Full air-gapped capability</span></li><li><span class="green">Never trains on customer data</span></li></ul>'),
    e.twoColS(dt,6,T,'VS GRC PLATFORMS','Why ServiceNow / Archer / OneTrust Fall Short','<h4>GRC Platforms</h4><ul style="margin-top:12px"><li>Workflow and checklist management</li><li>Manual evidence collection</li><li><span class="red">No AI decision-making</span></li><li><span class="red">No multi-agent analysis</span></li><li><span class="red">Evidence is manual</span></li><li><span class="red">Rarely air-gapped</span></li></ul>','<h4 class="gold">Datacendia</h4><ul style="margin-top:12px"><li>AI-powered decision intelligence</li><li>Automatic evidence generation</li><li><span class="green">Council deliberates then produces evidence</span></li><li><span class="green">14 specialized agents per decision</span></li><li><span class="green">Evidence cryptographically signed</span></li><li><span class="green">Full air-gapped deployment</span></li></ul>'),
    e.metricsS(dt,7,T,'DEFENSIBILITY',[['14','Domain-Specific Agents'],['11','Sovereign Patterns'],['12','Council Modes'],['156','Validated Endpoints']]),
    e.bulletS(dt,8,T,'BARRIERS TO ENTRY','Why Competitors Cannot Replicate Quickly',["<strong>Technical complexity</strong> — Multi-agent deliberation with formal dissent is fundamentally different architecture","<strong>Sovereign infrastructure</strong> — 11 patterns (TPM, Data Diode, USB) require deep security engineering","<strong>Compliance engineering</strong> — Control mapping across 5+ frameworks is years of work","<strong>Trust pipeline</strong> — Open-source community cannot be replicated with marketing","<strong>First-mover</strong> — EU AI Act and DORA reward the first compliant platform"]),
    e.ctaS(dt,9,T,'No One Else Has This Platform','Seven-layer moat with regulatory tailwinds.',['Deep Dive Call','Technical Architecture','Data Room Access']),
  ],
};

// Generate all 10 investor decks
decks.forEach(d => {
  const T = 10;
  const slides = deckSlides[d.id](d.dt, T);
  const html = e.hd(d.title, d.dt) + slides.join('\n\n') + e.ft();
  e.writeDeck(path.join(base, 'investor', d.id + '.html'), html);
});

console.log('Done — 10 investor decks generated.');
