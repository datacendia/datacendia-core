/**
 * African Development Bank Sandbox Config
 * Access: /sandbox/afdb (Key: AF-78)
 * @module pages/sandbox/configs/afdb
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'African Development Bank',
  accessKey: 'AF-78',
  sessionKey: 'afdb-sandbox-unlocked',
  accent: 'teal',
  accentColor: 'text-teal-400',
  accentHover: 'from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600',
  ringColor: 'focus:ring-teal-500/30',
  borderColor: 'border-teal-500/30',
  gradientFrom: 'from-teal-600/20',
  gradientTo: 'to-teal-900/20',
  footerNote: 'African Development Bank AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual AfDB systems or incidents.',

  scenarios: [
    // SCENARIO 1 — AfDB: AI LOAN UNDERWRITING BIAS
    {
      id: 'afdb-loan-bias',
      title: 'AfDB AI — Sovereign Loan Underwriting Gender Bias',
      subtitle: 'Development finance AI · Gender-coded indicators · Board review · $340M portfolio affected',
      banner: 'Simulating the development finance AI crisis: AfDB uses AI to assess sovereign loan applications for infrastructure projects. The AI systematically scores projects with female-led implementation teams lower — using proxy indicators (sector, team composition) that correlate with gender. $340M in women-led infrastructure projects are underfunded.',
      risk: 'High',
      scenarioNum: 'Gender',
      icon: 'trending-up',
      color: 'text-teal-400',
      agents: [
        { id: 'afdb-ai', name: 'AfDB Underwriting AI Agent', role: 'Sovereign Loan Assessment & Risk Scoring', icon: '🏦', color: 'text-teal-400', borderColor: 'border-teal-500/40', bgColor: 'bg-teal-500/10' },
        { id: 'gender-policy', name: 'Gender Policy Agent', role: 'AfDB Gender Strategy & Mainstreaming', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'board-agent', name: 'Board Oversight Agent', role: 'AfDB Board of Directors & Governance', icon: '🏛️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'beneficiary', name: 'Beneficiary Impact Agent', role: 'Project Outcomes & Development Impact', icon: '🌍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Underwriting AI', status: 'connected', type: 'Loan Assessment', icon: 'cpu', detail: 'AI scores 240 sovereign loan applications/year — $8.2B portfolio' },
        { name: 'Gender Analysis', status: 'connected', type: 'Bias Audit', icon: 'bar-chart', detail: 'Female-led projects: avg score 62/100 vs male-led: 78/100' },
        { name: 'AfDB Gender Strategy', status: 'connected', type: 'Policy', icon: 'file-text', detail: '2021-2025 Gender Strategy: 40% of approvals must be gender-tagged' },
        { name: 'Board Review', status: 'syncing', type: 'Governance', icon: 'users', detail: 'Board review triggered by civil society gender audit report' },
      ],
      script: [
        { agentId: 'afdb-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AfDB sovereign loan underwriting AI: processes 240 applications annually for infrastructure projects across 54 African member countries. Total portfolio: $8.2B. The AI assesses: country credit risk, project feasibility, implementation capacity, economic return, and environmental/social safeguards. Overall model performance: 89% accuracy on project outcome prediction. CRITICAL ISSUE: CendiaSupervision gender disaggregated analysis reveals: Projects with female project directors: average AI score 62/100. Projects with male project directors: average AI score 78/100. Projects in "female-dominated" sectors (water/sanitation, primary healthcare, education): average score 64/100. Projects in "male-dominated" sectors (energy, transport, telecoms): average score 81/100. The AI was trained on 15 years of AfDB loan data. Historical pattern: female-led projects received smaller loans and shorter tenures — NOT because they performed worse, but because of institutional bias in the loan approval process. The AI learned this pattern and perpetuates it. Female-led projects that were approved performed EQUALLY well (3.2% default rate for both). The lower scores are bias, not risk.' },
        { agentId: 'gender-policy', phase: 'phase1', type: 'warning', delay: 2500, content: 'GENDER POLICY ALERT. (1) AfDB Gender Strategy 2021-2025: "At least 40% of approved operations will be gender-tagged (Gender Marker 1 or 2)." The AI\'s lower scores for female-led projects directly undermines this target — projects that should be gender-tagged receive lower scores and are less likely to be approved. (2) AfDB\'s own research: "Closing Africa\'s gender gap would add $316B annually to GDP." The AI is working against AfDB\'s core development mandate. (3) The proxy indicators: "implementation team composition" and "sector" are GENDER PROXIES. Water/sanitation projects are disproportionately led by women. Scoring them lower = scoring women lower. (4) Institutional credibility: AfDB positions itself as a gender-responsive development institution. If a civil society audit reveals the AI systematically disadvantages women-led projects: AfDB\'s credibility with bilateral donors (who earmark funds for gender-responsive lending) is destroyed. (5) IDA/GCF/GEF co-financing often requires gender mainstreaming. AfDB projects scored lower by the AI may lose co-financing eligibility.' },
        { agentId: 'board-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Board governance implications: (1) A civil society consortium published a report: "AI Bias in Development Finance: How AfDB\'s Algorithm Disadvantages Women-Led Projects." The report uses publicly available AfDB approval data to demonstrate the scoring disparity. (2) The Board of Directors must respond. Agenda item: "Review of AI-assisted underwriting for gender bias." (3) Board concerns: (a) Donor confidence: bilateral donors providing $2.8B annually in concessional resources require gender mainstreaming. If the AI undermines gender targets: donors redirect to institutions that achieve them. (b) Reputational: AfDB competes with World Bank IDA, Asian Development Bank, and new development finance from China. Gender-responsive lending is a differentiator. Losing it = losing relevance. (c) Internal: 340 approved projects in the last 3 years may have been scored with gender bias. Retrospective review required. (4) The Board will likely require: immediate AI audit, corrective action plan, and quarterly gender-disaggregated reporting on AI scores.' },
        { agentId: 'beneficiary', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — BENEFICIARY IMPACT. The $340M in underfunded women-led projects represents: 12 water/sanitation projects serving 4.2M people (mostly women and girls who carry water), 8 primary healthcare projects serving 1.8M maternal/child health beneficiaries, and 6 education projects serving 320,000 girls. When the AI scores these projects lower: they receive smaller loans, shorter tenures, or are not approved. The REAL cost is measured in: women walking further for clean water, maternal mortality rates that don\'t improve, and girls who don\'t access education. Without CendiaSupervision: the AI perpetuates historical bias. $340M in development impact is lost. With CendiaSupervision: gender proxy bias is caught. Projects are scored on merit. 6.3M beneficiaries receive the infrastructure they need.' },
        { agentId: 'afdb-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing AfDB + CendiaSupervision Development Finance AI Governance: (1) GENDER-DISAGGREGATED SCORING: Every AI score is reported with gender disaggregation. Disparities above 10% trigger automatic review. (2) PROXY DEBIASING: CendiaSupervision identifies features that proxy for gender (sector, team composition, beneficiary profile). These features are debiased — the AI scores on project quality, not historical patterns. (3) OUTCOME-BASED CALIBRATION: The AI is recalibrated using ACTUAL project outcomes (default rates, development impact scores) rather than historical approval patterns. Since female-led projects perform equally well: outcome-based calibration eliminates the bias. (4) GENDER STRATEGY ALIGNMENT: CendiaSupervision tracks whether AI scores are consistent with the 40% gender-tagged target. If the AI is systematically scoring gender-tagged projects lower: alert to the Gender Department. (5) BOARD REPORTING: Quarterly gender-disaggregated AI performance reports for the Board — demonstrating that the AI supports, rather than undermines, AfDB\'s gender strategy.' },
        { agentId: 'board-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Gender proxy debiasing eliminates the scoring disparity. Female-led projects: 62/100 → 76/100. Male-led: 78/100 → 77/100 (slight adjustment from debiasing). The 340 retrospective projects are re-scored: 18 projects receive additional funding. The Board approves the AI governance framework. For AfDB: CendiaSupervision = development finance AI that advances gender equality. "AfDB: AI-assisted lending with gender-responsive governance" — the message that strengthens donor confidence, maintains institutional credibility, and delivers development impact to 6.3M beneficiaries.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:af10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'af20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Underwriting AI + Gender debiasing + Outcome calibration + Board reporting)',
        complianceLabel: 'Gender Status',
        complianceValue: 'BIAS ELIMINATED — SCORES EQUALISED',
        complianceThreshold: 'Female-led: 62 → 76, within 10% of male-led (77)',
        agents: ['AfDB Underwriting AI Agent', 'Gender Policy Agent', 'Board Oversight Agent', 'Beneficiary Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AfDB — Gender-Responsive AI Governance',
        guaranteeBody: 'Gender proxy bias eliminated. Female-led project scores: 62 → 76. Outcome-based calibration applied. 18 retrospective projects receive additional funding. $340M in women-led infrastructure properly scored. 6.3M beneficiaries served.',
        evidenceChain: 'Underwriting AI (16-point gender gap) → Proxy detection → Sector/team debiased → Outcome calibration → Scores equalised → Board approved → Gender strategy aligned → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how AfDB + CendiaSupervision eliminates gender bias in sovereign loan underwriting — ensuring $340M in women-led infrastructure is properly funded.',
      phaseLabels: ['Gender Scoring Gap & Historical Bias', 'Board Review & Donor Confidence', 'Proxy Debiasing & Outcome Calibration'],
    },

    // SCENARIO 2 — AfDB: ESG AI GREENWASHING DETECTION
    {
      id: 'afdb-esg-greenwash',
      title: 'AfDB Green Bonds — AI ESG Score Greenwashing',
      subtitle: 'Green bond framework · AI ESG ratings inflated · Investor complaint · $1.2B issuance at risk',
      banner: 'Simulating the green finance credibility crisis: AfDB issues green bonds to finance climate-resilient infrastructure. The AI ESG scoring system inflates project ratings — classifying a coal-adjacent transport project as "green." Investors discover the misclassification. AfDB\'s $1.2B green bond framework credibility is at risk.',
      risk: 'High',
      scenarioNum: 'ESG',
      icon: 'leaf',
      color: 'text-emerald-400',
      agents: [
        { id: 'esg-ai', name: 'AfDB ESG AI Agent', role: 'Green Bond Classification & ESG Scoring', icon: '🌿', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'green-bond', name: 'Green Bond Agent', role: 'ICMA Principles & Use of Proceeds', icon: '💚', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'investor-agent', name: 'Investor Oversight Agent', role: 'ESG Fund Mandates & Due Diligence', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'climate-agent', name: 'Climate Impact Agent', role: 'Paris Agreement Alignment & NDC Tracking', icon: '🌍', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'ESG AI Platform', status: 'connected', type: 'Green Classification', icon: 'cpu', detail: 'AI scores 84 projects for green bond eligibility — $1.2B framework' },
        { name: 'ICMA Standards', status: 'connected', type: 'Green Bond Principles', icon: 'check-circle', detail: 'Use of proceeds must be exclusively for eligible green projects' },
        { name: 'Investor Portal', status: 'connected', type: 'ESG Reporting', icon: 'bar-chart', detail: 'Institutional investors: 42 ESG-mandated funds holding AfDB green bonds' },
        { name: 'Climate Module', status: 'syncing', type: 'Paris Alignment', icon: 'thermometer', detail: 'Project: coal transport rail link classified as "green transport"' },
      ],
      script: [
        { agentId: 'esg-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AfDB ESG AI green bond classification system. 84 projects assessed for inclusion in AfDB\'s $1.2B green bond framework. The AI classifies projects as: Dark Green (transformative climate impact), Medium Green (significant climate benefit), Light Green (some climate benefit), or Not Eligible. Project under review: "Mozambique Southern Corridor Rail Modernisation" — $180M. AI classification: MEDIUM GREEN. Rationale: "Rail transport reduces road freight emissions. The project modernises 340km of rail, reducing CO2 by an estimated 42,000 tonnes annually." CRITICAL ISSUE: The Mozambique Southern Corridor rail line\'s PRIMARY purpose is transporting coal from the Moatize coal basin to the Nacala port for export. 78% of freight on this line is coal. The rail modernisation INCREASES coal transport capacity by 40% — from 18M to 25M tonnes annually. The 42,000 tonne CO2 reduction from rail vs road is dwarfed by the ADDITIONAL coal that will be burned: 25M tonnes of coal = approximately 62.5M tonnes of CO2 when combusted. The project enables 62.5M tonnes of Scope 3 emissions while "saving" 42,000 tonnes of transport emissions.' },
        { agentId: 'green-bond', phase: 'phase1', type: 'warning', delay: 2500, content: 'GREEN BOND ALERT. (1) ICMA Green Bond Principles: "Use of Proceeds" must be exclusively for eligible green projects. A project that increases coal transport capacity by 40% is NOT eligible under any credible green taxonomy. (2) AfDB\'s own Green Bond Framework (verified by Sustainalytics): explicitly excludes "projects directly related to fossil fuel production, processing, or transportation." A coal transport rail link is DIRECTLY related to fossil fuel transportation. (3) The AI focused on the DIRECT emissions (transport mode shift) and ignored INDIRECT emissions (increased coal capacity). This is a category error — the AI was trained on transport projects without a fossil fuel exclusion filter. (4) EU Taxonomy alignment: the EU Taxonomy (which many AfDB green bond investors use as a benchmark) applies a "do no significant harm" (DNSH) test. A project that enables 62.5M tonnes of coal combustion FAILS DNSH categorically. (5) If this project is included in the green bond: the entire $1.2B framework is tainted. Investors who hold the bond under ESG mandates must divest. AfDB\'s green bond pricing premium (greenium) disappears.' },
        { agentId: 'investor-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Investor consequences: (1) 42 institutional investors hold AfDB green bonds under ESG mandates. These mandates prohibit holding bonds that finance fossil fuel infrastructure. If the coal rail link is included: 42 investors must sell — $480M in forced selling. (2) The "greenium" — the lower yield that green bonds achieve vs conventional bonds — disappears. AfDB\'s cost of green bond funding increases by 15-25 basis points. On a $1.2B framework: $1.8M-$3M additional annual interest cost. (3) Second-party opinion provider (Sustainalytics) will downgrade AfDB\'s green bond framework if the coal rail link is included. A downgrade from "aligned" to "partially aligned" = loss of eligibility for most ESG indices. (4) Reputational: "African Development Bank finances coal infrastructure with green bonds" is a headline that damages AfDB\'s climate credibility permanently. COP negotiations, GCF access, and bilateral climate finance all require climate credibility. (5) Other MDBs (World Bank, ADB) have explicitly excluded coal from green bond frameworks. AfDB including it = outlier status.' },
        { agentId: 'climate-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CLIMATE IMPACT. Africa is the continent MOST vulnerable to climate change and LEAST responsible for it. AfDB\'s green bond programme finances climate resilience — flood defences, drought-resistant agriculture, renewable energy. Including a coal rail link undermines the entire programme. The Mozambique rail project: 62.5M tonnes of enabled coal combustion vs the REST of the green bond portfolio: 2.8M tonnes of avoided emissions. ONE misclassified project wipes out the climate benefit of the other 83 projects combined. Without CendiaSupervision: the coal rail link is included. Investor revolt. Framework downgraded. Climate credibility destroyed. With CendiaSupervision: the Scope 3 emissions analysis catches the coal connection. The project is excluded. The framework maintains integrity. AfDB\'s climate finance leadership is preserved.' },
        { agentId: 'esg-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing AfDB + CendiaSupervision Green Bond AI Governance: (1) SCOPE 3 ANALYSIS: Every project is assessed for Scope 1, 2, AND 3 emissions. Projects that enable fossil fuel production, transport, or combustion are AUTOMATICALLY excluded — regardless of direct emission benefits. (2) FOSSIL FUEL EXCLUSION FILTER: CendiaSupervision applies a hard exclusion for any project with >10% fossil fuel connection (freight composition, energy source, end use). The Mozambique rail: 78% coal = excluded. (3) EU TAXONOMY ALIGNMENT: Every green bond project is assessed against the EU Taxonomy DNSH criteria — ensuring eligibility for ESG-mandated investors. (4) SECOND-PARTY OPINION PRE-CHECK: Before final classification, CendiaSupervision verifies the project would pass Sustainalytics/CICERO review. Projects that would fail SPO = excluded. (5) INVESTOR REPORTING: Quarterly green bond impact reports with project-level Scope 1-3 analysis, taxonomy alignment, and exclusion documentation.' },
        { agentId: 'investor-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Coal rail link excluded. The green bond framework maintains 83 eligible projects ($1.02B). Sustainalytics confirms "aligned" rating. Greenium preserved. 42 ESG investors maintain positions. For AfDB: CendiaSupervision = green bond AI governance that maintains the credibility of Africa\'s climate finance. "AfDB Green Bonds: AI-verified with Scope 3 analysis and fossil fuel exclusion" — the feature that makes AfDB green bonds the gold standard for development finance climate integrity.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:af30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'af40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (ESG AI + Scope 3 analysis + Fossil fuel exclusion + Taxonomy alignment)',
        complianceLabel: 'Green Bond Status',
        complianceValue: 'COAL RAIL EXCLUDED — FRAMEWORK INTACT',
        complianceThreshold: 'Scope 3 analysis: 62.5M tCO2 enabled, DNSH failed',
        agents: ['AfDB ESG AI Agent', 'Green Bond Agent', 'Investor Oversight Agent', 'Climate Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AfDB — Green Bond AI Governance',
        guaranteeBody: 'Coal transport rail excluded via Scope 3 analysis. 83 projects retained ($1.02B). Sustainalytics: "aligned." EU Taxonomy DNSH: passed. Greenium preserved. 42 ESG investors maintained. Climate credibility intact.',
        evidenceChain: 'ESG AI (Medium Green — wrong) → Scope 3 analysis → 62.5M tCO2 enabled → Fossil fuel exclusion → DNSH failed → Project excluded → SPO confirmed → Greenium preserved → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how AfDB + CendiaSupervision catches a greenwashed coal transport project — protecting $1.2B in green bond credibility.',
      phaseLabels: ['Coal Rail Misclassified as Green', 'Investor Revolt & Framework Downgrade', 'Scope 3 Analysis & Fossil Fuel Exclusion'],
    },

    // SCENARIO 3 — AfDB: AI PROJECT SELECTION BIAS AGAINST FRAGILE STATES
    {
      id: 'afdb-fragile-state-bias',
      title: 'AfDB AI — Project Pipeline Systematically Excludes Fragile States',
      subtitle: 'AI project scoring · Country risk overweight · Sahel excluded · Board governance failure',
      banner: 'Simulating the development finance paradox: AfDB\'s AI project scoring system ranks infrastructure proposals by expected development impact and risk. The AI overweights country risk — systematically deprioritising projects in fragile states (Sahel, Horn of Africa) that need development finance MOST. Board discovers that 78% of AI-prioritised projects go to 8 stable economies while 24 fragile states receive 6%.',
      risk: 'High',
      scenarioNum: 'GOV',
      icon: 'bar-chart',
      color: 'text-amber-400',
      agents: [
        { id: 'pipeline-ai', name: 'AfDB Pipeline AI Agent', role: 'Project Scoring & Portfolio Prioritisation', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'mandate-counsel', name: 'Mandate Governance Agent', role: 'AfDB Charter & Fragile States Strategy', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'board-agent', name: 'Board Oversight Agent', role: 'Board of Directors & Shareholder Governance', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'fragile-agent', name: 'Fragile States Agent', role: 'Transition States Facility & Conflict Recovery', icon: '🌍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Pipeline AI', status: 'connected', type: 'Project Scoring', icon: 'cpu', detail: 'AI ranks 840 project proposals — scores combine impact, risk, and readiness' },
        { name: 'Country Risk Module', status: 'connected', type: 'Risk Assessment', icon: 'alert-triangle', detail: 'Country risk: 45% weight in score — fragile states score 2.1/10 avg vs stable 7.8/10' },
        { name: 'Fragile States Strategy', status: 'connected', type: 'Board Policy', icon: 'shield', detail: 'AfDB Strategy 2025: "increase financing to fragile states to 24% of approvals"' },
        { name: 'Portfolio Data', status: 'syncing', type: 'Allocation Analysis', icon: 'pie-chart', detail: 'AI-prioritised portfolio: 78% to 8 stable economies, 6% to 24 fragile states' },
      ],
      script: [
        { agentId: 'pipeline-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AfDB project pipeline AI. Evaluates 840 infrastructure project proposals annually across 54 African member states. Scoring dimensions: (1) Development impact (30%): jobs, GDP contribution, poverty reduction. (2) Country risk (45%): political stability, governance, debt sustainability, conflict. (3) Implementation readiness (25%): project design quality, procurement, counterpart funding. CRITICAL BIAS: Country risk receives 45% weight — nearly half the score. Fragile states (Mali, Burkina Faso, Niger, Somalia, South Sudan, CAR, DRC, Chad, etc.) score 1.4-2.8/10 on country risk. Stable economies (Morocco, Egypt, Nigeria, South Africa, Kenya, Côte d\'Ivoire, Senegal, Rwanda) score 6.8-8.4/10. Even if a fragile state project has MAXIMUM development impact (10/10) and HIGH readiness (8/10): total score = 10×0.3 + 2.0×0.45 + 8×0.25 = 3.0 + 0.9 + 2.0 = 5.9. A mediocre project in Morocco with moderate impact (6/10) and moderate readiness (6/10): total = 6×0.3 + 7.5×0.45 + 6×0.25 = 1.8 + 3.375 + 1.5 = 6.675. The Moroccan project ALWAYS outscores the fragile state project — regardless of impact. Result: 78% of AI-prioritised projects go to 8 stable economies. 24 fragile states receive 6%. The countries that need development finance MOST get the LEAST.' },
        { agentId: 'mandate-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'AfDB MANDATE ALERT. (1) AfDB Agreement (Charter), Article 1: "The purpose of the Bank shall be to contribute to the sustainable economic development and social progress of its regional members individually and jointly." ALL members — not just stable ones. (2) AfDB Strategy for Addressing Fragility and Building Resilience (2022): "The Bank will increase its financing to countries affected by fragility to reach 24% of total approvals by 2025." Current AI-driven allocation: 6%. The AI is working AGAINST the Board-approved strategy. (3) The Transition States Facility (TSF): created specifically to channel resources to fragile states with concessional terms. The AI doesn\'t incorporate TSF eligibility — it treats fragile states the same as stable ones in the scoring, then penalises them for being fragile. (4) Donor expectations: ADF (African Development Fund) contributors — US, UK, Germany, Japan, France — contribute specifically to support fragile states. If the AI diverts resources to stable economies: donors may reduce ADF replenishments. ADF-16 raised $8.9B. The next replenishment is at risk. (5) The development paradox: the AI optimises for SUCCESS (high-probability projects in stable countries). Development finance should optimise for NEED (high-impact projects in difficult environments).' },
        { agentId: 'board-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Board of Directors review: (1) An Executive Director representing fragile state shareholders raises: "My countries — Mali, Burkina Faso, Niger — submitted 34 project proposals. The AI ranked ALL of them in the bottom quartile. Not one was prioritised. These countries are in conflict. They need roads, hospitals, electricity. The AI says they\'re too risky. But the Bank was CREATED for situations like this." (2) Board review reveals: the AI\'s country risk weighting (45%) was set by the operations team without Board approval. The Board\'s fragile states strategy (24% target) was never encoded into the AI. The AI and the Board strategy are in direct conflict. (3) Board resolution: "The AI project scoring system must be recalibrated to reflect the Board\'s strategic priorities, including the fragile states allocation target." (4) Governance failure: an AI system that determines $12B in annual lending was deployed without Board oversight of its parameters. The country risk weighting — the most consequential parameter — was a technical decision that had STRATEGIC consequences. (5) Media: "AfDB AI prioritises wealthy African nations over conflict zones" — the headline that threatens AfDB\'s reputation as Africa\'s development bank.' },
        { agentId: 'fragile-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — FRAGILE STATES IMPACT. Niger: GDP per capita $542 (one of the world\'s poorest). The AI deprioritised a solar electrification project that would bring power to 340,000 people. Why: country risk score 1.8/10. The project was technically sound, community-supported, and co-financed by the EU. But the AI scored it below a luxury hotel renovation in Casablanca. Chad: a maternal health hospital in N\'Djamena. Maternal mortality: 1,140 per 100,000 (vs 72 in Morocco). The AI ranked it 684th out of 840 proposals. Country risk: 2.1/10. DRC: a road connecting two provincial capitals (population 4M). No road = no trade, no access to hospitals, no economic development. AI rank: 712th. Without CendiaSupervision: the countries that need development finance most continue to be excluded by an algorithm that optimises for safety, not impact. With CendiaSupervision: fragile states allocation is a HARD CONSTRAINT. The AI optimises impact WITHIN the 24% fragile state target.' },
        { agentId: 'pipeline-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing AfDB + CendiaSupervision Development AI Governance: (1) MANDATE-ALIGNED SCORING: CendiaSupervision recalibrates the AI: development impact weight increased to 50%. Country risk reduced to 20% (still considered, but not dominant). Implementation readiness: 30%. Projects scored on NEED and IMPACT, not just safety. (2) FRAGILE STATES ALLOCATION CONSTRAINT: The Board\'s 24% target is encoded as a hard constraint. The AI must prioritise projects until 24% of the pipeline is from fragile states. Within the fragile state allocation: optimise for impact and feasibility. (3) RISK-ADAPTED ASSESSMENT: Fragile state projects are assessed against FRAGILE STATE benchmarks, not stable country standards. A road project in DRC is compared to other DRC projects, not to a highway in Morocco. (4) TSF INTEGRATION: Transition States Facility eligibility is automatically applied. Fragile state projects get concessional terms — reducing financial risk and improving project viability. (5) BOARD DASHBOARD: Real-time portfolio allocation visible to the Board. Fragile state percentage tracked against target. Any deviation triggers Board notification.' },
        { agentId: 'board-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Mandate-aligned scoring implemented. Fragile state allocation: 6% → 23% (approaching 24% target). Niger solar: funded — 340,000 people get electricity. Chad hospital: funded — maternal mortality programme operational. DRC road: funded — 4M people connected. Board governance: AI parameters now require Board approval. Country risk weight changes are strategic decisions, not technical ones. For AfDB: CendiaSupervision = development AI governance that serves the Bank\'s mandate. "AfDB: AI-driven development finance that reaches the countries that need it most" — the message that satisfies the Board, donors, and 24 fragile member states.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:af50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'af60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Pipeline AI + Mandate alignment + Fragile allocation + Board governance)',
        complianceLabel: 'Mandate Status',
        complianceValue: 'FRAGILE STATES: 6% → 23%',
        complianceThreshold: 'Board target: 24%, mandate-aligned scoring, TSF integrated',
        agents: ['AfDB Pipeline AI Agent', 'Mandate Governance Agent', 'Board Oversight Agent', 'Fragile States Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AfDB — Development AI Governance',
        guaranteeBody: 'Project scoring recalibrated. Fragile state allocation: 6% → 23%. Niger solar funded. Chad hospital funded. DRC road funded. Board governance restored. Donor confidence maintained.',
        evidenceChain: 'Pipeline AI (country risk 45%) → Mandate review → Recalibrated (impact 50%) → Fragile constraint 24% → Niger/Chad/DRC funded → Board dashboard → Allocation 23% → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how AfDB + CendiaSupervision recalibrates project scoring to reach fragile states — funding solar power, hospitals, and roads where they\'re needed most.',
      phaseLabels: ['Country Risk Overweight & Fragile Exclusion', 'Board Governance Failure & Donor Risk', 'Mandate-Aligned Scoring & Fragile Allocation'],
    },

    // SCENARIO 4 — AfDB: AI CLIMATE ADAPTATION FUNDING IGNORES MOST VULNERABLE
    {
      id: 'afdb-climate-vulnerable',
      title: 'AfDB AI — Climate Adaptation Fund Bypasses Most Climate-Vulnerable Nations',
      subtitle: 'Climate AI allocation · Absorption capacity bias · Island states excluded · COP commitment breach',
      banner: 'Simulating the climate justice crisis: AfDB\'s AI allocates climate adaptation funding based on "absorption capacity" — ability to spend funds efficiently. The most climate-vulnerable nations (Comoros, Madagascar, Eritrea) have the lowest absorption capacity. The AI sends 82% of adaptation funds to countries that need them LEAST. COP commitments violated.',
      risk: 'High',
      scenarioNum: 'COP',
      icon: 'cloud-rain',
      color: 'text-amber-400',
      agents: [
        { id: 'climate-ai', name: 'AfDB Climate AI Agent', role: 'Adaptation Fund Allocation & Disbursement', icon: '🌍', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'cop-counsel', name: 'Climate Governance Agent', role: 'Paris Agreement & COP Commitments', icon: '⚖️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'donor-agent', name: 'Donor Accountability Agent', role: 'Green Climate Fund & Bilateral Donors', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'island-agent', name: 'Vulnerable Nations Agent', role: 'SIDS & LDC Climate Adaptation Needs', icon: '🏝️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Climate AI', status: 'connected', type: 'Fund Allocation', icon: 'cpu', detail: 'AI allocates $2.4B climate adaptation fund — absorption capacity: 55% weight' },
        { name: 'Vulnerability Index', status: 'connected', type: 'Climate Risk', icon: 'thermometer', detail: 'ND-GAIN Index: Comoros, Madagascar, Eritrea most vulnerable — lowest adaptation funding' },
        { name: 'COP Commitments', status: 'connected', type: 'Paris Agreement', icon: 'shield', detail: 'COP28: "Prioritise adaptation funding for most vulnerable nations"' },
        { name: 'Disbursement Data', status: 'syncing', type: 'Allocation Analysis', icon: 'pie-chart', detail: '82% of funds to 12 stable economies. 18 most-vulnerable nations: 8% combined.' },
      ],
      script: [
        { agentId: 'climate-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AfDB Climate Adaptation Fund AI. Allocates $2.4B across African member states for climate adaptation: sea walls, drought-resistant agriculture, flood infrastructure, early warning systems. AI allocation criteria: (1) Climate vulnerability (25%): how exposed is the country. (2) Absorption capacity (55%): can the country spend the money effectively — procurement systems, project management, audit capability. (3) Co-financing (20%): can the country contribute matching funds. CRITICAL BIAS: Absorption capacity at 55% weight dominates. The most climate-vulnerable nations (Comoros: rising seas, Madagascar: cyclones, Eritrea: drought, Chad: desertification) have the WEAKEST institutions and LOWEST absorption capacity. The AI penalises them for being poor and under-resourced — the very conditions that make them climate-vulnerable. Result: 82% of adaptation funds go to 12 countries with strong institutions (Morocco, Egypt, South Africa, Kenya, etc.). 18 most-vulnerable nations share 8%.' },
        { agentId: 'cop-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CLIMATE GOVERNANCE ALERT. (1) Paris Agreement Art. 7.2: "Parties recognize that adaptation is a global challenge faced by all with local, subnational, national, regional and international dimensions, and that it is a key component of and makes a contribution to the long-term global response to climate change to protect people, livelihoods and ecosystems, taking into account the urgent and immediate needs of those developing country Parties that are particularly vulnerable." AfDB\'s AI contradicts "urgent and immediate needs of particularly vulnerable" parties. (2) COP28 UAE Consensus: signatories committed to "prioritise adaptation funding for the most vulnerable nations." AfDB is a COP implementing partner. Its AI does the opposite. (3) Green Climate Fund mandate: "allocate 50% of adaptation funding to LDCs, SIDS, and African states." The AI allocates 8% to the most vulnerable African states. (4) Donor expectations: bilateral donors (EU, UK, Germany) contributed to the adaptation fund specifically for vulnerable nations. Misallocation risks donor withdrawal.' },
        { agentId: 'donor-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Donor review: (1) Germany\'s BMZ contributed €340M to AfDB\'s climate fund "for the most vulnerable African nations." BMZ audit finds: only 6% reached vulnerable nations. Germany demands corrective action or fund redirection. (2) Green Climate Fund review: AfDB\'s allocation methodology contradicts GCF requirements. GCF may redirect future funding away from AfDB to bilateral channels. (3) At COP29: African SIDS bloc raises the issue publicly. "AfDB — Africa\'s own development bank — sends climate money to the countries that need it least." The headline embarrasses AfDB leadership and African Union.' },
        { agentId: 'island-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — Comoros: sea level rise threatens 60% of the population. The AI allocated $2.1M (0.09% of the fund). A sea wall for Moroni would cost $18M. Madagascar: Cyclone Batsirai destroyed 120,000 homes. AI allocation: $4.8M. Reconstruction need: $420M. These nations will bear the worst climate impacts. The AI says they can\'t spend money effectively — so it doesn\'t give them any. Without CendiaSupervision: climate money goes where it\'s easy to spend, not where it\'s needed. With CendiaSupervision: vulnerability is the PRIMARY criterion. Absorption capacity is addressed through IMPLEMENTATION SUPPORT, not funding denial.' },
        { agentId: 'climate-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing AfDB + CendiaSupervision Climate Justice AI: (1) VULNERABILITY-FIRST ALLOCATION: Climate vulnerability weight: 55% (was 25%). Absorption capacity: 20% (was 55%). Co-financing: 5%. Implementation support: 20% (NEW — funds allocated for project management support in low-capacity nations). (2) MINIMUM VULNERABLE ALLOCATION: 50% of the fund MUST go to the 18 most-vulnerable nations. Hard constraint. (3) IMPLEMENTATION SUPPORT: Instead of denying funds to low-capacity nations, CendiaSupervision pairs funding with AfDB-provided project management, procurement support, and audit capacity. Build capacity WHILE funding adaptation. (4) COP COMPLIANCE DASHBOARD: Real-time tracking against COP commitments. Vulnerable nation allocation visible to donors and COP secretariat. (5) CLIMATE URGENCY SCORING: Time-sensitive projects (sea walls before next cyclone season) get priority regardless of absorption capacity.' },
        { agentId: 'donor-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Vulnerability-first allocation. Most-vulnerable nations: 8% → 48%. Comoros sea wall: funded ($18M + implementation support). Madagascar reconstruction: $86M allocated. Germany: "AfDB\'s climate governance now matches COP commitments." GCF: increased AfDB allocation for next cycle. For AfDB: CendiaSupervision = climate AI that serves the Paris Agreement. "AfDB: climate finance where it\'s needed most."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:af70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'af80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Climate AI + Vulnerability-first + Implementation support + COP compliance)',
        complianceLabel: 'COP Status',
        complianceValue: 'VULNERABLE ALLOCATION: 8% → 48%',
        complianceThreshold: 'Vulnerability-first, 50% minimum, implementation support paired',
        agents: ['AfDB Climate AI Agent', 'Climate Governance Agent', 'Donor Accountability Agent', 'Vulnerable Nations Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AfDB — Climate Justice Governance',
        guaranteeBody: 'Vulnerable allocation: 8% → 48%. Comoros sea wall funded. Madagascar reconstruction funded. COP commitments met. Donor confidence restored.',
        evidenceChain: 'Climate AI (absorption-first) → Vulnerability-first → 48% to vulnerable → Implementation support → Comoros funded → COP compliant → Donors satisfied → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how AfDB + CendiaSupervision allocates climate adaptation funding to the most vulnerable — not the most capable.',
      phaseLabels: ['Absorption Capacity Bias & Vulnerable Excluded', 'COP Breach & Donor Withdrawal', 'Vulnerability-First & Implementation Support'],
    },

    // SCENARIO 5 — AfDB: AI PROCUREMENT SCORING EXCLUDES AFRICAN FIRMS
    {
      id: 'afdb-procurement-bias',
      title: 'AfDB AI — Procurement Scoring Systematically Favours International Over African Firms',
      subtitle: 'Procurement AI · Track record bias · African firms excluded · Africa50 mandate conflict',
      banner: 'Simulating the procurement governance crisis: AfDB\'s AI procurement scoring evaluates bids for infrastructure projects. The AI gives heavy weight to "track record" and "financial capacity" — systematically favouring large international firms over African companies. 91% of AfDB-funded contracts go to non-African firms. Board raises: "Shouldn\'t Africa\'s bank build African capacity?"',
      risk: 'High',
      scenarioNum: 'PROC',
      icon: 'briefcase',
      color: 'text-amber-400',
      agents: [
        { id: 'proc-ai', name: 'AfDB Procurement Agent', role: 'Bid Evaluation & Contract Award', icon: '📋', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'capacity-counsel', name: 'African Capacity Agent', role: 'Local Content & Firm Development', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'au-agent', name: 'African Union Agent', role: 'Agenda 2063 & Industrialisation Strategy', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'firm-agent', name: 'African Firm Agent', role: 'Local Contractor Impact & Job Creation', icon: '🏗️', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Procurement AI', status: 'connected', type: 'Bid Scoring', icon: 'cpu', detail: 'AI scores bids: track record 35%, financial capacity 30%, technical 25%, price 10%' },
        { name: 'Contract Data', status: 'connected', type: 'Award Analysis', icon: 'bar-chart', detail: '91% of $8.4B contracts to non-African firms. African firms: 9%.' },
        { name: 'AU Agenda 2063', status: 'connected', type: 'Policy', icon: 'shield', detail: 'AU: "30% of infrastructure contracts to African firms by 2030"' },
        { name: 'Africa50', status: 'syncing', type: 'Investment Platform', icon: 'trending-up', detail: 'Africa50: AfDB\'s infrastructure investment platform — mandate includes African firm development' },
      ],
      script: [
        { agentId: 'proc-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'AfDB AI procurement scoring. Evaluates bids for AfDB-funded infrastructure projects ($8.4B annually). Scoring: (1) Track record (35%): number of similar projects completed, portfolio size, years in business. (2) Financial capacity (30%): annual revenue, bonding capacity, bank guarantees. (3) Technical proposal (25%): methodology, team, equipment. (4) Price (10%). SYSTEMIC BIAS: Track record and financial capacity (65% combined) inherently favour large international firms. A French construction company: 40 years, 200 projects, €2B revenue. Score: 92/100. A Kenyan construction company: 8 years, 12 projects, $40M revenue. Score: 54/100. The Kenyan company\'s technical proposal may be equally good — but it CAN\'T compete on track record and financial capacity. It\'s younger and smaller. Result: 91% of contracts go to non-African firms. The AI perpetuates a cycle: African firms can\'t win contracts → can\'t build track record → can\'t win future contracts.' },
        { agentId: 'capacity-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CAPACITY BUILDING ALERT. (1) AfDB Strategy 2025: "industrialise Africa" — including building African construction and engineering capacity. The procurement AI works AGAINST this strategy. (2) AU Agenda 2063 Aspiration 1: "A prosperous Africa based on inclusive growth and sustainable development." 91% of AfDB contracts going to non-African firms is not inclusive growth. (3) AfDB Local Content Policy: "encourage the participation of local firms in Bank-financed projects." The AI scoring makes local participation nearly impossible. (4) Economic leakage: when international firms win contracts, 70-80% of the contract value leaves Africa (expatriate staff, imported equipment, profit repatriation). When African firms win: 85-90% stays in Africa. $8.4B × 91% international × 75% leakage = $5.7B annually leaving Africa through AfDB-funded projects. (5) Job creation: African firms employ 8x more local workers per dollar than international firms.' },
        { agentId: 'au-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. AU Commission raises at AfDB Board: "Africa\'s development bank spends $8.4B/year on infrastructure. 91% goes to non-African firms. This is not building Africa — it\'s building contracts for international firms with African money." AU target: 30% of infrastructure contracts to African firms by 2030. Current: 9%. AfDB\'s AI procurement system makes the target impossible. Board resolution: "Review procurement scoring to align with African capacity building objectives."' },
        { agentId: 'firm-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — An Ethiopian road construction company. 15 years experience. Built 340km of roads in Ethiopia. Bid for an AfDB-funded 80km highway. Technical proposal: excellent. Price: 12% lower than the French competitor. But track record score: 48 (vs French: 94). Financial capacity: 42 (vs French: 91). Total score: 62 vs 89. The Ethiopian company: rejected. The French company builds the highway with imported equipment and expatriate engineers. Local jobs: 120 (labourers). If the Ethiopian company had won: local jobs 840 (engineers, managers, operators, labourers). Without CendiaSupervision: perpetual exclusion. With CendiaSupervision: scored on capability relative to project size. Joint ventures encouraged. African firms grow.' },
        { agentId: 'proc-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing AfDB + CendiaSupervision Fair Procurement AI: (1) PROPORTIONAL TRACK RECORD: Score track record relative to PROJECT SIZE, not absolute. A firm that built 10 similar-sized projects scores the same as a firm that built 200. Experience beyond project requirements: no additional points. (2) AFRICAN FIRM PREFERENCE: 10-point scoring bonus for African firms (similar to US SBA small business preference). Not a set-aside — firms still must be technically competent. (3) JOINT VENTURE INCENTIVE: International-African JV bids scored favourably when the African partner has a meaningful role (>30% of scope). Builds capacity through partnership. (4) CAPACITY DEVELOPMENT SCORE: Bids evaluated on local job creation, technology transfer, and training plans. The bid that builds the most African capacity scores higher. (5) PIPELINE VISIBILITY: African firms see upcoming projects 12 months ahead — time to form JVs and prepare.' },
        { agentId: 'au-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Proportional scoring + African preference + JV incentive. African firm contract share: 9% → 28% (approaching AU 30% target). Ethiopian company: wins next highway bid in JV with mentoring from international partner. 840 local jobs. $5.7B leakage reduced by 40%. AU: "AfDB procurement now builds African capacity." For AfDB: CendiaSupervision = procurement governance that develops Africa while delivering infrastructure. "AfDB: building Africa with African firms."' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:af90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'afa0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Procurement AI + Proportional scoring + African preference + JV incentive)',
        complianceLabel: 'Procurement',
        complianceValue: 'AFRICAN FIRMS: 9% → 28%',
        complianceThreshold: 'Proportional track record, preference, JV incentive, AU 30% target',
        agents: ['AfDB Procurement Agent', 'African Capacity Agent', 'African Union Agent', 'African Firm Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'AfDB — Fair Procurement Governance',
        guaranteeBody: 'African firm share: 9% → 28%. Proportional scoring. JV incentive. Economic leakage reduced 40%. AU Agenda 2063 aligned. African capacity built.',
        evidenceChain: 'Procurement AI (track record bias) → Proportional scoring → African preference → JV incentive → 28% African → Leakage reduced → AU aligned → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how AfDB + CendiaSupervision reforms procurement scoring to build African firm capacity — increasing African contracts from 9% to 28%.',
      phaseLabels: ['Track Record Bias & 91% International', 'AU Confrontation & Capacity Building Failure', 'Proportional Scoring & African Preference'],
    },
  ],

        complianceScore: 85,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.112Z",
            "type": "analysis",
            "title": "Transaction Monitoring - AfDB AI — Sovereign Loan Underwriting Gender Bias",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Transaction Monitoring analysis for Afdb completed with industry-specific compliance checks",
            "agent": "AML Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.112Z",
            "type": "warning",
            "title": "Regulatory Alert - AfDB AI — Sovereign Loan Underwriting Gender Bias",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Alert analysis for Afdb completed with industry-specific compliance checks",
            "agent": "Compliance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.112Z",
            "type": "dissent",
            "title": "Risk Assessment - AfDB AI — Sovereign Loan Underwriting Gender Bias",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Risk Assessment analysis for Afdb completed with industry-specific compliance checks",
            "agent": "Risk Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.112Z",
            "type": "proposal",
            "title": "Control Enhancement - AfDB AI — Sovereign Loan Underwriting Gender Bias",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Control Enhancement analysis for Afdb completed with industry-specific compliance checks",
            "agent": "Governance Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.112Z",
            "type": "resolution",
            "title": "Regulatory Approval - AfDB AI — Sovereign Loan Underwriting Gender Bias",
            "description": "Regulatory compliance, AML/KYC, financial risk management: Regulatory Approval analysis for Afdb completed with industry-specific compliance checks",
            "agent": "Supervisor Agent",
            "impact": "high"
      }
]};

export default config;
