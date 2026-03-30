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
  ],
};

export default config;
