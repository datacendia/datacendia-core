/**
 * AC Milan Sandbox Config
 *
 * 5 fully scripted multi-agent deliberation scenarios for Serie A club governance.
 * Access: /sandbox/ac-milan (Key: MILAN-26)
 *
 * @module pages/sandbox/configs/ac-milan
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'AC Milan',
  accessKey: 'MILAN-26',
  sessionKey: 'milan-sandbox-unlocked',

  accent: 'red',
  accentColor: 'text-red-400',
  accentHover: 'from-red-600 to-red-700 hover:from-red-500 hover:to-red-600',
  ringColor: 'focus:ring-red-500/30',
  borderColor: 'border-red-500/30',
  gradientFrom: 'from-red-600/20',
  gradientTo: 'to-red-900/20',

  footerNote: '200 regulatory scenarios mapped for AC Milan · Full architecture document available on request',

  scenarios: [
    // =========================================================================
    // SCENARIO 1 — REDBIRD CAPITAL LP GOVERNANCE
    // =========================================================================
    {
      id: 'redbird-lp',
      title: 'RedBird Capital LP Governance — €1.2B Acquisition Evidence',
      subtitle: 'US private equity · €1.2B acquisition · LP quarterly reporting · Transfer ROI accountability',
      banner: 'Simulating a RedBird Capital Partners LP quarterly review where every AI-assisted transfer, commercial deal, and stadium investment decision must be documented to US private equity governance standards. LPs demand institutional-grade evidence of investment stewardship.',
      risk: 'High',
      scenarioNum: 'LP Governance',
      icon: 'trending-up',
      color: 'text-red-400',
      agents: [
        { id: 'lp-governance', name: 'LP Governance Agent', role: 'RedBird Capital LP Reporting & Fund Returns', icon: '💼', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'financial', name: 'Financial Agent', role: 'Transfer Valuation & UEFA FSR Compliance', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal-lp', name: 'Legal Agent', role: 'Italian Corporate Law & US PE Standards', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'sporting', name: 'Sporting Director Agent', role: 'Transfer Strategy & Squad Valuation', icon: '⚽', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'RedBird LP Portal', status: 'connected', type: 'Fund Governance & Reporting', icon: 'landmark', detail: 'Q4 2025 LP report deadline: January 31, 2026' },
        { name: 'UEFA FSR Database', status: 'connected', type: 'Financial Sustainability', icon: 'banknote', detail: 'Milan FSR status: compliant (break-even +€12M)' },
        { name: 'Transfer Market Engine', status: 'connected', type: 'Player Valuation AI', icon: 'activity', detail: '€187M transfer spend vs €94M in sales (2025 window)' },
        { name: 'FIGC Licensing Portal', status: 'syncing', type: 'Italian League Compliance', icon: 'shield', detail: 'Serie A licensing: approved, next review March 2026' },
      ],
      script: [
        { agentId: 'lp-governance', phase: 'phase1', type: 'analysis', delay: 800, content: 'Q4 2025 LP governance assessment initiated. RedBird Capital Partners\' LPs require institutional-grade evidence for every material decision affecting their €1.2B investment. Key metrics this quarter: (1) Squad valuation: increased from €487M to €612M (+25.7%) — driven by AI-assisted scouting identifying undervalued talent in South American and Portuguese markets, (2) Transfer window net spend: €93M (€187M out, €94M in sales) — each transfer decision used AI valuation models requiring governance documentation, (3) New stadium project: €1.3B San Donato development advanced to planning stage — AI-driven capacity modelling, commercial projection, and environmental impact assessment, (4) Commercial revenue: +18% YoY driven by AI-optimised sponsorship pricing. LPs expect every AI-assisted decision to have a documented rationale comparable to institutional investment committee standards.' },
        { agentId: 'financial', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. UEFA Financial Sustainability Regulations create a constraint that directly impacts RedBird\'s fund returns. Milan\'s current FSR position: break-even surplus of €12M — but the Q4 transfer window spend of €93M net reduces the buffer significantly. Specific concern: the €47M acquisition of a Brazilian striker used an AI valuation model that projected the player at €65M fair market value based on xG, progressive carries, and age-curve modelling. If UEFA\'s CFCB challenges this valuation as inflated (to justify the transfer for FSR purposes), RedBird\'s LPs face: (1) potential FFP sanctions reducing Champions League revenue, (2) forced player sales at below-market value, (3) LP report that must disclose the regulatory risk. The AI valuation methodology must be defensible at both CAS and LP governance levels.' },
        { agentId: 'legal-lp', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The intersection of US PE governance and European football regulation creates a unique compliance challenge. RedBird\'s LPs are subject to US SEC oversight as qualified purchasers — they expect ILPA (Institutional Limited Partners Association) standard reporting. But Milan\'s football decisions are governed by FIGC (Italian federation), UEFA FSR, and Italian corporate law. The €47M striker acquisition must satisfy BOTH: (1) ILPA standards — documented investment thesis, comparable analysis, risk assessment, exit projection, and (2) UEFA FSR — fair market value assessment, break-even impact, and related-party transaction clearance (RedBird entities must not inflate valuations to help Milan\'s FSR position). These two governance frameworks have never been formally reconciled. If the AI valuation model serves both purposes, we must prove it\'s objective — not optimised for either audience.' },
        { agentId: 'sporting', phase: 'phase2', type: 'analysis', delay: 2500, content: 'Sporting context for the AI valuation: the Brazilian striker was identified by Milan Lab\'s predictive analytics 18 months before acquisition. The AI model tracked: (1) 2,847 match actions across Brazilian Serie A and Copa Libertadores, (2) Physical profile projection: 94th percentile for sprint speed with low injury risk markers, (3) Age-curve model: peak value window 24-28 (player is 22), (4) Style compatibility: 89% fit with Milan\'s tactical system. The €47M price represents a 28% discount to the model\'s €65M fair value — Milan\'s negotiation team secured below-model price. If this player reaches projected peak, the €47M becomes a €120M+ asset — a 2.5x return for RedBird\'s LPs. But the governance question is: can we prove the model is objective and the discount is genuine?' },
        { agentId: 'lp-governance', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Dual-Governance Protocol: (1) Every AI-assisted transfer decision produces TWO Regulator\'s Receipts from the same underlying evidence — one formatted for ILPA LP reporting standards (investment thesis, comparable analysis, IRR projection) and one for UEFA FSR (fair market value, break-even impact, related-party clearance). (2) The AI valuation model\'s methodology is cryptographically sealed — proving it was not adjusted between LP and UEFA submissions. (3) Milan Lab predictive analytics (2,847 match actions, physical profile, age-curve) are sealed as the objective basis for both governance outputs. (4) The new stadium project\'s AI-driven projections receive the same dual-governance treatment. One truth, two formats — both audiences get exactly what they need from identical underlying evidence.' },
        { agentId: 'legal-lp', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The Dual-Governance Protocol solves the reconciliation problem. Because the underlying AI model is cryptographically identical for both outputs, neither RedBird\'s LPs nor UEFA\'s CFCB can allege the valuation was "optimised for their audience." The sealed methodology proves objectivity. The €47M acquisition with €65M model value: (1) For LPs — documented 28% discount, 2.5x projected return, with risk factors and comparable analysis. (2) For UEFA — fair market value substantiated by 2,847 match actions with transparent methodology. Same truth, compliant for both. This is the first time private equity football governance has been formally reconciled with European football regulation.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ac0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'bc0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Transfer valuations + Milan Lab analytics + FSR compliance + LP reporting)',
        complianceLabel: 'Dual-Governance',
        complianceValue: 'ILPA + UEFA FSR',
        complianceThreshold: 'both standards satisfied from single evidence base',
        agents: ['LP Governance Agent', 'Financial Agent', 'Legal Agent', 'Sporting Director Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'RedBird LP + UEFA FSR — Dual-Governance from Single Truth',
        guaranteeBody: 'This cryptographic bundle seals AC Milan\'s complete Q4 2025 governance package: AI-assisted transfer valuations (€187M spend), Milan Lab predictive analytics (2,847 match actions per player), UEFA FSR break-even compliance (+€12M), and stadium project AI projections. The underlying evidence is cryptographically identical for both ILPA LP reporting and UEFA CFCB submission — proving objective valuation methodology. First formal reconciliation of US PE governance with European football regulation.',
        evidenceChain: 'Milan Lab scouting AI → Transfer valuation model (€65M FMV) → Negotiation (€47M, 28% discount) → UEFA FSR break-even impact → ILPA LP report formatting → Stadium AI projections → FIGC licensing → Dual-governance seal → ML-DSA-65',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate the unique intersection of US private equity governance and European football regulation — proving every transfer decision satisfies both RedBird\'s LPs and UEFA\'s Financial Sustainability Regulations.',
      phaseLabels: ['LP Quarterly Assessment', 'Dual-Governance Conflict', 'Evidence Reconciliation'],
    },

    // =========================================================================
    // SCENARIO 2 — MILAN LAB AI: SPORTS SCIENCE GOVERNANCE
    // =========================================================================
    {
      id: 'milan-lab',
      title: 'Milan Lab AI — Sports Science Under the EU AI Act',
      subtitle: 'Pioneering since 2002 · Injury prediction AI · EU AI Act high-risk · Maldini played until 41',
      banner: 'Simulating an EU AI Act compliance audit of Milan Lab\'s injury prediction and player longevity AI systems — classified as high-risk medical AI under the EU AI Act. The platform that helped Maldini play until 41 must now prove its AI governance to European regulators.',
      risk: 'High',
      scenarioNum: 'Milan Lab',
      icon: 'cpu',
      color: 'text-emerald-400',
      agents: [
        { id: 'milan-lab-ai', name: 'Milan Lab AI Agent', role: 'Injury Prediction & Player Longevity Analytics', icon: '🧬', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'euai', name: 'EU AI Act Agent', role: 'High-Risk AI Classification & Compliance', icon: '🇪🇺', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'medical-milan', name: 'Medical Agent', role: 'Italian Medical Law & Return-to-Play Protocols', icon: '🏥', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-milan', name: 'Legal Agent', role: 'GDPR, Italian Data Protection & Liability', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Milan Lab Database', status: 'connected', type: 'Player Medical & Performance', icon: 'database', detail: '22 years of player biometric data (2002-2026)' },
        { name: 'EU AI Act Registry', status: 'connected', type: 'High-Risk AI Compliance', icon: 'shield', detail: 'Classification: HIGH-RISK (medical AI, Annex III)' },
        { name: 'FIGC Medical Portal', status: 'connected', type: 'Italian League Medical Standards', icon: 'heart', detail: 'Serie A concussion protocol compliance: current' },
        { name: 'Garante Privacy', status: 'syncing', type: 'Italian Data Protection Authority', icon: 'lock', detail: 'GDPR audit scheduled: April 2026' },
      ],
      script: [
        { agentId: 'milan-lab-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'Milan Lab AI systems assessment. Since 2002, Milan Lab has operated the most sophisticated sports science unit in football — the system that predicted Paolo Maldini could play at elite level until age 41. Current AI capabilities: (1) Injury prediction model — analyses 347 biomarkers per player per week, predicting soft-tissue injury risk with 78% accuracy 7 days in advance, (2) Load management AI — optimises training intensity based on GPS, heart rate variability, and sleep quality data, (3) Return-to-play protocol — AI-assisted concussion and injury recovery timeline with graduated return recommendations, (4) Nutrition AI — personalised dietary plans based on metabolic profiling and genetic markers. These systems process the most sensitive category of personal data: health and biometric information for 38 first-team players, 45 academy players, and historical data for 200+ former players dating back 22 years.' },
        { agentId: 'euai', phase: 'phase1', type: 'warning', delay: 2500, content: 'CRITICAL CLASSIFICATION. Under the EU AI Act (effective August 2025), Milan Lab\'s AI systems are classified as HIGH-RISK under Annex III, Category 5(a): "AI systems intended to be used for making decisions affecting the health and safety of natural persons." Specific obligations: (1) Risk management system — documented risk assessment for each AI model, (2) Data governance — quality requirements for training data (22 years of biometric data must meet data quality standards), (3) Technical documentation — complete model architecture, training methodology, and performance metrics, (4) Human oversight — qualified medical professional must review every AI recommendation before action, (5) Accuracy and robustness — documented performance metrics with bias testing across player demographics. Non-compliance penalty: up to €35M or 7% of global turnover. Milan Lab must comply by August 2026.' },
        { agentId: 'legal-milan', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. The 22-year historical dataset creates a GDPR minefield. Former players (including Maldini, Kaká, Pirlo, Shevchenko) have biometric and medical data in Milan Lab\'s systems. Under GDPR Article 17 (right to erasure), any former player can request deletion of their data. But: (1) EU AI Act requires training data documentation — deleting historical data could compromise model performance and compliance, (2) Italian medical law requires retention of medical records for 10 years minimum, (3) Some historical data was collected before GDPR (pre-2018) under different consent frameworks. The conflict: GDPR says delete on request, EU AI Act says document training data, Italian law says retain medical records. These three obligations are irreconcilable without a sophisticated data governance framework.' },
        { agentId: 'medical-milan', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. The return-to-play AI recommendation for a current player (ACL reconstruction, 8 months recovery) illustrates the governance challenge in practice. Milan Lab\'s AI predicts the player is ready to return at 7.5 months based on biomechanical markers and load testing. The club medical staff agree. But: (1) FIGC protocol requires minimum recovery periods that may differ from AI recommendation, (2) The player\'s agent is pressuring for early return (contract year, World Cup squad selection), (3) If the player re-injures after AI-recommended early return, Milan faces medical negligence liability under Italian law. The AI recommendation must be documented as a SUPPORT tool, not a DECISION tool — the qualified medical professional makes the final call. But the AI\'s influence on that call must be transparent.' },
        { agentId: 'milan-lab-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Milan Lab Governance Protocol: (1) Every Milan Lab AI recommendation is wrapped with CendiaGateway — producing a Regulator\'s Receipt that documents the AI input data, model reasoning, confidence score, and the human medical professional\'s independent decision. (2) The 22-year historical dataset is partitioned: active player data under GDPR Article 6(1)(b) (contractual necessity), former player data under Article 6(1)(f) (legitimate interest for model training) with anonymisation where possible, pre-GDPR data under transitional provisions with documented legal basis. (3) EU AI Act technical documentation is auto-generated from the sealed model governance — risk assessment, training data documentation, performance metrics, and human oversight verification. (4) Return-to-play decisions are sealed with the AI recommendation AND the physician\'s independent assessment — proving the AI supported but did not replace human judgment.' },
        { agentId: 'legal-milan', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The data partitioning framework resolves the GDPR vs EU AI Act conflict. Anonymised historical data satisfies both GDPR erasure rights (anonymised data is no longer personal data) and EU AI Act training data requirements (model documentation preserved). The CendiaGateway wrapper around every Milan Lab recommendation creates the human oversight documentation that the EU AI Act mandates — proving the AI is a "support tool" not an autonomous decision-maker. Milan Lab becomes the first sports science unit in Europe to achieve EU AI Act compliance — a competitive advantage for player recruitment ("your health data is governed to the highest standard in world football").' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:cd0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'de0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Milan Lab AI models + 22-year dataset + EU AI Act docs + GDPR compliance)',
        complianceLabel: 'EU AI Act Status',
        complianceValue: 'HIGH-RISK COMPLIANT',
        complianceThreshold: 'Annex III Category 5(a) — Medical AI',
        agents: ['Milan Lab AI Agent', 'EU AI Act Agent', 'Medical Agent', 'Legal Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'EU AI Act + GDPR — Milan Lab Governance Sealed',
        guaranteeBody: 'This cryptographic bundle seals Milan Lab\'s complete AI governance: injury prediction model (347 biomarkers, 78% accuracy), load management AI, return-to-play protocols, and 22-year historical dataset governance. EU AI Act Annex III high-risk compliance documentation, GDPR data partitioning framework, and human oversight verification for every medical AI recommendation. Milan Lab becomes the first EU AI Act-compliant sports science unit in European football.',
        evidenceChain: 'Milan Lab AI models (4 systems) → 22-year dataset partitioning → EU AI Act risk assessment → GDPR consent framework → Human oversight documentation → Return-to-play protocol → FIGC medical compliance → Garante Privacy audit preparation → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate Milan Lab\'s EU AI Act compliance — proving that the sports science unit that helped Maldini play until 41 meets Europe\'s highest AI governance standards.',
      phaseLabels: ['Milan Lab AI Assessment', 'GDPR vs EU AI Act Conflict', 'Governance Protocol Activation'],
    },

    // =========================================================================
    // SCENARIO 3 — NEW STADIUM: €1.3B DEVELOPMENT GOVERNANCE
    // =========================================================================
    {
      id: 'new-stadium',
      title: 'New Stadium — €1.3B Development Governance',
      subtitle: 'San Donato project · Municipal planning · Environmental AI · RedBird investor evidence',
      banner: 'Simulating the AI governance layer for AC Milan\'s €1.3B new stadium project — where capacity modelling, commercial projections, and environmental impact assessments must satisfy Milan municipality, UEFA, RedBird investors, and Italian planning law simultaneously.',
      risk: 'High',
      scenarioNum: 'Stadium',
      icon: 'building-2',
      color: 'text-cyan-400',
      agents: [
        { id: 'stadium', name: 'Stadium Development Agent', role: 'Capacity Modelling & Commercial Projections', icon: '🏟️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
        { id: 'env', name: 'Environmental Agent', role: 'EU Environmental Impact & Sustainability', icon: '🌱', color: 'text-green-400', borderColor: 'border-green-500/40', bgColor: 'bg-green-500/10' },
        { id: 'legal-stadium', name: 'Legal Agent', role: 'Italian Planning Law & Municipal Approval', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'investor', name: 'Investor Relations Agent', role: 'RedBird LP & Project Finance Governance', icon: '💼', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Capacity Model Engine', status: 'connected', type: 'AI-Driven Stadium Design', icon: 'activity', detail: '70,000 capacity with AI-optimised sightlines and acoustics' },
        { name: 'Environmental Impact AI', status: 'connected', type: 'EU EIA Compliance', icon: 'shield', detail: 'Carbon footprint: -34% vs San Siro baseline' },
        { name: 'Milan Municipality Portal', status: 'connected', type: 'Planning Permission', icon: 'landmark', detail: 'San Donato zoning: approved in principle, EIA pending' },
        { name: 'Project Finance Dashboard', status: 'syncing', type: 'Investment Governance', icon: 'dollar-sign', detail: '€1.3B: 40% equity (RedBird), 60% debt financing' },
      ],
      script: [
        { agentId: 'stadium', phase: 'phase1', type: 'analysis', delay: 800, content: 'Stadium development AI governance assessment. The €1.3B San Donato project uses AI across 5 critical design decisions: (1) Capacity optimisation — AI modelled 47 configurations to determine 70,000 as the optimal capacity (balancing matchday revenue, atmosphere, and accessibility compliance), (2) Sightline engineering — AI-calculated optimal rake angles for 100% unobstructed viewing, (3) Commercial zone allocation — AI-projected revenue per square metre for hospitality, retail, museum, and conference spaces, (4) Transport modelling — AI simulation of 70,000 spectator ingress/egress across metro, road, and pedestrian routes, (5) Climate resilience — AI-driven roof design for Milan\'s increasing extreme weather events. Total project AI decisions: 2,340 design choices each with financial and safety implications exceeding €500K.' },
        { agentId: 'env', phase: 'phase1', type: 'flag', delay: 2500, content: 'FLAG RAISED. EU Environmental Impact Assessment Directive (2011/92/EU as amended) requires a full EIA for projects of this scale. Milan municipality will not grant final planning permission without a completed EIA. AI-driven environmental findings: (1) Carbon reduction: -34% vs current San Siro operations through solar, geothermal, and rainwater harvesting — exceeds EU Green Deal targets, (2) HOWEVER: the San Donato site is classified as partially brownfield with potential soil contamination from previous industrial use. AI soil analysis models predict remediation costs of €23M-€41M depending on contamination depth. (3) Biodiversity impact: 12 hectares of semi-natural habitat affected. EU Biodiversity Strategy requires net-positive biodiversity outcome. (4) The EIA\'s AI-generated projections must be independently verifiable — Italian environmental courts have rejected AI-only EIAs in 3 recent cases (Brescia logistics hub, 2024).' },
        { agentId: 'legal-stadium', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Italian planning law (Testo Unico dell\'Edilizia, DPR 380/2001) requires that AI-generated projections in EIA submissions be accompanied by "transparent methodology accessible to non-specialist municipal reviewers." The 3 rejected AI-only EIAs in Brescia were dismissed because the AI models were "black boxes" — the municipal planning committee could not understand or verify the environmental projections. For the €1.3B Milan stadium, the EIA must demonstrate: (1) AI capacity model methodology is reproducible by independent engineers, (2) Environmental projections are verifiable against measured baseline data, (3) Transport modelling assumptions are transparent and conservative. If the municipality rejects the EIA, the project delays by 12-18 months — costing RedBird €80M+ in financing costs and delayed revenue.' },
        { agentId: 'investor', phase: 'phase2', type: 'warning', delay: 2500, content: 'WARNING. RedBird\'s project finance structure (40% equity, 60% debt) has covenant triggers tied to planning milestones. If the EIA is rejected or delayed: (1) Debt drawdown is suspended — €780M in committed facilities cannot be accessed, (2) RedBird must fund continued San Siro lease costs (€12M/year) from equity, (3) LP quarterly report must disclose planning delay as material project risk, (4) Inter Milan\'s parallel new stadium plans (if they proceed with San Siro renovation) could undermine the San Donato commercial case. The planning approval is the single largest risk to RedBird\'s investment thesis. Every AI projection supporting the EIA must be bulletproof.' },
        { agentId: 'stadium', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Stadium Governance Protocol: (1) Every AI design decision produces a Regulator\'s Receipt with transparent methodology — capacity model (47 configurations evaluated), sightline calculations, commercial projections, transport simulations all with documented inputs, assumptions, and confidence intervals. (2) Environmental AI projections are sealed with the baseline measurement data — municipality reviewers can independently verify each projection against its inputs. (3) Soil contamination AI analysis is accompanied by physical sample data — the AI interprets, the samples prove. (4) The complete EIA evidence bundle is formatted for both Italian municipal review AND RedBird LP reporting — dual-governance from the same underlying truth. Project timeline risk reduced from 12-18 month delay to standard 4-month municipal review.' },
        { agentId: 'legal-stadium', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The transparent methodology approach directly addresses the Brescia precedent. Unlike the rejected "black box" EIAs, Milan\'s submission will include: (1) Every AI model input with source documentation, (2) Methodology published for independent reproduction, (3) Confidence intervals on all projections (not point estimates), (4) Physical measurement data alongside AI interpretations. The Milan municipality planning committee can verify any projection independently — the Regulator\'s Receipt is designed for non-specialist reviewers. This is not an "AI-generated EIA" — it is a "human-led EIA with AI-assisted analysis, cryptographically documented." The distinction is legally critical under Italian planning law.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:ef0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: 'f00123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (2,340 design decisions + EIA data + Transport models + Project finance)',
        complianceLabel: 'EIA Status',
        complianceValue: 'SUBMISSION READY',
        complianceThreshold: 'EU Directive 2011/92/EU compliant',
        agents: ['Stadium Development Agent', 'Environmental Agent', 'Legal Agent', 'Investor Relations Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Milan Municipality + RedBird LPs — Transparent AI Governance',
        guaranteeBody: 'This cryptographic bundle seals AC Milan\'s complete €1.3B stadium development evidence: 2,340 AI design decisions with transparent methodology, EU Environmental Impact Assessment with verifiable projections, transport modelling for 70,000 capacity, soil contamination analysis with physical samples, and dual-governance formatting for both Italian municipal review and RedBird LP reporting. Every AI projection is independently verifiable — no "black box" risk.',
        evidenceChain: 'Capacity AI (47 configurations) → Sightline engineering → Commercial zone allocation → Transport simulation → Environmental impact (carbon -34%) → Soil contamination analysis → Municipal EIA formatting → RedBird LP report → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate AC Milan\'s €1.3B new stadium project — proving every AI-driven design and environmental decision is transparent enough for Italian municipal approval and RedBird investor governance.',
      phaseLabels: ['Stadium AI Design Assessment', 'Environmental & Legal Challenges', 'Transparent Governance Protocol'],
    },

    // =========================================================================
    // SCENARIO 4 — MATCH INTEGRITY: SERIE A BETTING GOVERNANCE
    // =========================================================================
    {
      id: 'match-integrity',
      title: 'Match Integrity — Serie A\'s Calciopoli Shadow',
      subtitle: 'Italy\'s match-fixing history · Betting anomaly detection · FIGC integrity · Procura Federale',
      banner: 'Simulating a match integrity investigation where betting anomalies are detected around an AC Milan Serie A match. Italy\'s Calciopoli history means ANY integrity question receives maximum scrutiny from FIGC, prosecutors, and media.',
      risk: 'Critical',
      scenarioNum: 'Integrity',
      icon: 'shield',
      color: 'text-blue-400',
      agents: [
        { id: 'integrity-milan', name: 'Integrity Agent', role: 'Betting Anomaly Detection & Sportradar Feed', icon: '🛡️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-integrity', name: 'Legal Agent', role: 'Italian Criminal Law & FIGC Disciplinary', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'procura', name: 'Procura Federale Agent', role: 'FIGC Federal Prosecution & Evidence Standards', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'reputational', name: 'Reputational Agent', role: 'Brand Protection & Media Response', icon: '📰', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
      ],
      connectors: [
        { name: 'Sportradar Integrity Feed', status: 'connected', type: 'Betting Market Monitoring', icon: 'activity', detail: '280% anomaly in "Both Teams to Score" market — Milan vs Udinese' },
        { name: 'FIGC Integrity Portal', status: 'connected', type: 'Federal Prosecution Interface', icon: 'shield', detail: 'Procura Federale: monitoring, no active investigation' },
        { name: 'Staff Betting Monitor', status: 'connected', type: 'Employee Betting Compliance', icon: 'eye', detail: 'All staff/player betting declarations: current' },
        { name: 'Italian Prosecutor Liaison', status: 'syncing', type: 'Criminal Law Interface', icon: 'gavel', detail: 'Procura della Repubblica: no current warrant' },
      ],
      script: [
        { agentId: 'integrity-milan', phase: 'phase1', type: 'warning', delay: 800, content: 'INTEGRITY ALERT. Sportradar AI feed has detected a 280% anomaly in the "Both Teams to Score" betting market for the upcoming Milan vs Udinese Serie A match. The anomaly is concentrated in 4 Eastern European bookmakers and appeared 36 hours before kickoff. Pattern analysis: (1) The anomaly does NOT match a typical "informed insider" pattern (which would appear 2-4 hours pre-match), (2) It DOES match a "corrupted participant" pattern — where a player or official has agreed to influence a specific outcome, (3) "Both Teams to Score" is a market particularly vulnerable to defensive manipulation (a defender deliberately creates a scoring opportunity). Italy\'s Calciopoli history (2006 — Juventus relegated, Milan penalised) means ANY integrity flag involving a Serie A giant receives 10x the scrutiny.' },
        { agentId: 'procura', phase: 'phase1', type: 'analysis', delay: 2500, content: 'Procura Federale assessment: Under FIGC Justice Code (Codice di Giustizia Sportiva), Article 30, any club member who "participates directly or indirectly in betting activities related to matches played in Italian football competitions" faces sanctions from fines to relegation. The 2006 Calciopoli scandal resulted in: Juventus relegated to Serie B, Milan docked 30 points (later reduced to 8), and multiple officials banned for life. A new integrity scandal would be existential for Milan\'s Champions League participation, RedBird\'s investment thesis, and the new stadium project. The Procura Federale has independent investigative authority — they do not need Milan\'s cooperation to open proceedings. Our best defence is proactive cooperation with sealed evidence.' },
        { agentId: 'legal-integrity', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Before any external disclosure, we must consider: (1) Italian criminal law (Art. 416 c.p. — criminal association, Art. 640 c.p. — fraud) gives the Procura della Repubblica (criminal prosecutor) jurisdiction alongside FIGC. If we disclose to FIGC and a criminal investigation follows, our evidence becomes discoverable in criminal proceedings. (2) Employee privacy — Italian privacy law (D.Lgs. 196/2003, as amended by GDPR) limits our ability to investigate staff without specific legal basis. (3) False positive risk — the 280% anomaly could be explained by legitimate factors (team news leak, weather, tactical change). If we report a false positive to FIGC, the "Milan is being investigated" headline is devastating regardless of outcome. We need to VERIFY the anomaly before any external disclosure.' },
        { agentId: 'reputational', phase: 'phase2', type: 'flag', delay: 2000, content: 'FLAG RAISED. Reputational modelling: if this investigation becomes public (and in Italian football, it always does), the media narrative will be "Milan — Calciopoli Part 2" regardless of the facts. Estimated reputational impact: (1) RedBird investment writedown risk: €50-200M if Champions League participation is threatened, (2) Sponsorship partners (Puma, Emirates) have morality clauses triggered by integrity investigations, (3) New stadium municipal approval could be delayed if Milan is under investigation — political risk. The key differentiator: did Milan DETECT and REPORT the anomaly proactively, or did FIGC discover it through their own monitoring? Proactive reporting = "governance success story." Reactive discovery = "cover-up allegation."' },
        { agentId: 'integrity-milan', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Proactive Integrity Protocol: (1) The 280% betting anomaly is sealed with Sportradar raw data feed — timestamped at detection, 36 hours pre-match. (2) Internal investigation initiated: all staff and player betting declarations cross-referenced with anomaly timing — no matches found (no Milan insider appears connected). (3) The sealed evidence is submitted to FIGC Procura Federale PROACTIVELY — Milan detected, investigated, and reported before the match was played. (4) Match proceeds under enhanced monitoring — Sportradar live feed during match with real-time anomaly tracking. (5) Post-match: if "Both Teams to Score" outcome matches the betting pattern, full investigation escalates with sealed evidence chain. If it doesn\'t, the proactive report is documented as governance diligence. Either way, Milan is on the right side of the evidence.' },
        { agentId: 'legal-integrity', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The proactive disclosure with sealed evidence fundamentally changes Milan\'s legal position. Under FIGC Justice Code Article 30(7), clubs that "promptly report integrity concerns with supporting evidence" receive mitigating credit in any subsequent proceedings. The Datacendia evidence bundle proves: (1) Milan\'s AI detected the anomaly before FIGC\'s own monitoring, (2) Internal investigation found no Milan insider connection, (3) Proactive disclosure was made 36 hours pre-match — not after the fact. If this is a false positive — Milan demonstrated exemplary governance. If this is a genuine match-fixing attempt — Milan was the whistle-blower, not the conspirator. In Calciopoli terms: Milan is the prosecutor, not the defendant.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:110123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: '220123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Sportradar anomaly + Internal investigation + FIGC disclosure + Match monitoring)',
        complianceLabel: 'Integrity Status',
        complianceValue: 'PROACTIVE DISCLOSURE',
        complianceThreshold: 'FIGC Art. 30(7) mitigating credit',
        agents: ['Integrity Agent', 'Legal Agent', 'Procura Federale Agent', 'Reputational Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Proactive Integrity — Milan as Whistle-Blower, Not Defendant',
        guaranteeBody: 'This cryptographic bundle seals AC Milan\'s complete integrity response: Sportradar 280% anomaly detection (36 hours pre-match), internal investigation (no insider connection found), proactive FIGC Procura Federale disclosure, and enhanced match monitoring protocol. Evidence proves Milan detected, investigated, and reported BEFORE the match — establishing the club as integrity champion, not suspect. Calciopoli-proof governance.',
        evidenceChain: 'Sportradar 280% anomaly → Internal investigation → Staff/player declaration cross-reference → Proactive FIGC disclosure → Enhanced match monitoring → Post-match analysis → Sealed evidence chain → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will navigate a match integrity alert for AC Milan — balancing proactive disclosure against false positive risk in the shadow of Italy\'s Calciopoli history.',
      phaseLabels: ['Betting Anomaly Detection', 'Legal & Reputational Analysis', 'Proactive Integrity Protocol'],
    },

    // =========================================================================
    // SCENARIO 5 — TRANSFER WINDOW: AI SCOUTING & FFP COMPLIANCE
    // =========================================================================
    {
      id: 'transfer-ai',
      title: 'Transfer Window — AI Scouting Meets Financial Fair Play',
      subtitle: 'South American market · Milan Lab integration · UEFA FSR compliance · €47M striker acquisition',
      banner: 'Simulating a transfer window decision where Milan Lab\'s AI scouting has identified a €47M target in Brazil. The acquisition must satisfy sporting analytics, UEFA FFP compliance, FIGC registration, and RedBird LP governance — all before the window closes.',
      risk: 'High',
      scenarioNum: 'Transfer',
      icon: 'shuffle',
      color: 'text-yellow-400',
      agents: [
        { id: 'scouting', name: 'Scouting AI Agent', role: 'Milan Lab Player Identification & Valuation', icon: '🔭', color: 'text-yellow-400', borderColor: 'border-yellow-500/40', bgColor: 'bg-yellow-500/10' },
        { id: 'fsr-milan', name: 'FSR Compliance Agent', role: 'UEFA Financial Sustainability & FIGC Rules', icon: '💶', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'legal-transfer', name: 'Legal Agent', role: 'FIFA Regulations & Italian Employment Law', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'lp-transfer', name: 'LP Governance Agent', role: 'RedBird Investment Committee Approval', icon: '💼', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Milan Lab Scouting AI', status: 'connected', type: 'Player Performance Analytics', icon: 'search', detail: 'Target: Brazilian striker, 22, 2,847 match actions analysed' },
        { name: 'UEFA FSR Calculator', status: 'connected', type: 'Break-Even Compliance', icon: 'banknote', detail: 'Pre-transfer surplus: €12M — post-transfer: €2.3M' },
        { name: 'FIFA TMS', status: 'connected', type: 'Transfer Matching System', icon: 'globe', detail: 'International transfer certificate: pending' },
        { name: 'RedBird Investment Committee', status: 'syncing', type: 'LP Approval Workflow', icon: 'landmark', detail: 'Threshold: €30M+ requires IC approval' },
      ],
      script: [
        { agentId: 'scouting', phase: 'phase1', type: 'analysis', delay: 800, content: 'Milan Lab scouting AI assessment for Target Player — 22-year-old Brazilian striker currently at Santos FC. AI analysis based on 2,847 match actions across Brazilian Serie A, Copa Libertadores, and Brazil U-23: (1) xG outperformance: +0.31 per 90 (top 2% globally for U-23 strikers), (2) Progressive carries: 6.8 per 90 (elite creative threat), (3) Physical profile: 94th percentile sprint speed, 87th percentile aerial duels, (4) Age-curve projection: peak value window 24-28, current value €47M, projected peak €120-140M, (5) Milan tactical fit: 89% compatibility with Fonseca\'s 4-2-3-1 system. Milan Lab injury prediction: low risk profile (3.2% probability of >30-day injury in first season, based on workload modelling). Recommendation: ACQUIRE at €47M — projected 2.5x ROI for RedBird over 4-year contract horizon.' },
        { agentId: 'fsr-milan', phase: 'phase1', type: 'warning', delay: 2500, content: 'WARNING. UEFA FSR impact assessment: (1) Pre-transfer break-even surplus: €12M, (2) Transfer fee amortisation (€47M over 5-year contract): €9.4M per year, (3) Salary: €4.8M gross per year, (4) Total annual cost: €14.2M, (5) Post-transfer break-even: €12M - €14.2M = -€2.2M DEFICIT. However: the player\'s projected contribution to matchday revenue (+€3.1M), commercial revenue (+€1.8M through shirt sales and social media), and Champions League performance bonus (+€2.5M expected from group stage progression) totals +€7.4M — net impact: +€5.2M surplus. The FSR calculation is compliant IF the revenue projections materialise. This creates a forecasting risk: if revenue falls short, Milan breaches FSR. The projections must be independently defensible.' },
        { agentId: 'legal-transfer', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. FIFA Regulations on the Status and Transfer of Players (RSTP) Article 18 requires that the transfer fee represent fair value — not an inflated price designed to benefit the selling club\'s FFP position (a practice known as "capital gains fraud" in Italian football). Santos FC is selling to reduce their own debt — they have incentive to inflate the reported fee while receiving less in reality. We must prove: (1) The €47M represents genuine fair market value (Milan Lab\'s AI model is the evidence), (2) No side agreements exist that reduce the effective price, (3) The agent fee (estimated €4.7M) is at market rate. Italian law (D.Lgs. 91/2014) also requires disclosure of the complete fee structure in FIGC filings. Any discrepancy between the FIFA TMS submission and FIGC filing creates criminal fraud risk.' },
        { agentId: 'lp-transfer', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG RAISED. RedBird Investment Committee threshold: any acquisition exceeding €30M requires formal IC approval with documented investment thesis, comparable analysis, and exit projection. The €47M striker acquisition is RedBird\'s largest single player investment. IC requirements: (1) Comparable analysis: how does €47M compare to similar U-23 Brazilian striker acquisitions in Top 5 European leagues? (2) IRR projection: 2.5x ROI over 4 years implies ~25% IRR — what are the downside scenarios? (3) Exit strategy: if the player underperforms, what is the liquidation value? (4) Portfolio concentration: this single player represents 8.4% of Milan\'s total squad value — is that acceptable risk concentration? The IC meets in 48 hours — the transfer window closes in 72 hours. Timing is critical.' },
        { agentId: 'scouting', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing Datacendia Transfer Governance Protocol: (1) Milan Lab\'s AI valuation model (2,847 match actions, physical profile, age-curve, tactical fit) is sealed as the objective fair market value basis — satisfying FIFA RSTP, FIGC, and RedBird IC simultaneously. (2) 47 comparable U-23 striker transfers in Top 5 leagues are documented — €47M falls at the 62nd percentile (reasonable, not outlier). (3) FSR projections sealed with confidence intervals: best case +€5.2M surplus, base case +€2.1M, worst case -€3.4M (still within FSR tolerance with contingency measures). (4) RedBird IC package auto-generated from the same sealed evidence — investment thesis, comparables, IRR modelling, and risk scenarios. (5) The complete package is formatted for FIFA TMS, FIGC, UEFA CFCB, and RedBird IC. One evidence base, four governance outputs.' },
        { agentId: 'legal-transfer', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. The sealed AI valuation with 47 comparables proves fair market value conclusively — eliminating the "capital gains fraud" risk. The FIFA TMS submission, FIGC filing, UEFA FSR documentation, and RedBird IC package all derive from the same cryptographically sealed evidence base — no discrepancy is possible. The agent fee (€4.7M, 10% of transfer fee) falls within market norms. Santos FC\'s selling price matches Milan\'s independently derived AI valuation — confirming arm\'s-length transaction. Transfer ready for execution: 48 hours to IC approval, 24 hours for FIFA TMS processing, window closes in 72 hours. Evidence chain complete.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:330123456789abcdef0123456789abcdef0123456789abcdef0123456789abcd',
        merkleRoot: '440123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        merkleLabel: 'Merkle Tree Root (Milan Lab AI scouting + 47 comparables + FSR projections + RedBird IC)',
        complianceLabel: 'Transfer Governance',
        complianceValue: '4/4 CLEARED',
        complianceThreshold: 'FIFA TMS + FIGC + UEFA FSR + RedBird IC',
        agents: ['Scouting AI Agent', 'FSR Compliance Agent', 'Legal Agent', 'LP Governance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Quad-Governance Transfer — One Truth, Four Regulators',
        guaranteeBody: 'This cryptographic bundle seals AC Milan\'s complete €47M transfer governance: Milan Lab AI scouting (2,847 match actions), 47 comparable transfer analysis, UEFA FSR break-even projections (base case +€2.1M), and RedBird Investment Committee package. Single evidence base satisfies FIFA TMS, FIGC registration, UEFA CFCB, and RedBird LP governance. No discrepancy possible — one cryptographic truth for all four regulatory audiences.',
        evidenceChain: 'Milan Lab scouting (2,847 actions) → AI valuation (€47M FMV) → 47 comparable analysis → FSR projections (3 scenarios) → Agent fee verification → RedBird IC package → FIFA TMS submission → FIGC registration → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will execute a €47M transfer under maximum governance pressure — satisfying FIFA, FIGC, UEFA FFP, and RedBird investors from a single sealed evidence base.',
      phaseLabels: ['Milan Lab AI Scouting', 'FSR & Legal Compliance', 'Quad-Governance Execution'],
    },
  ],

        complianceScore: 93,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.107Z",
            "type": "analysis",
            "title": "System Assessment - RedBird Capital LP Governance — €1.2B Acquisition Evidence",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Ac Milan completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.108Z",
            "type": "warning",
            "title": "Privacy Compliance - RedBird Capital LP Governance — €1.2B Acquisition Evidence",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Ac Milan completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.108Z",
            "type": "dissent",
            "title": "Security Risk - RedBird Capital LP Governance — €1.2B Acquisition Evidence",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Ac Milan completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.108Z",
            "type": "proposal",
            "title": "Governance Framework - RedBird Capital LP Governance — €1.2B Acquisition Evidence",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Ac Milan completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.108Z",
            "type": "resolution",
            "title": "Compliance Certified - RedBird Capital LP Governance — €1.2B Acquisition Evidence",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Ac Milan completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export default config;
