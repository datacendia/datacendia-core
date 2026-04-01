/**
 * SAP Sandbox Config
 * Access: /sandbox/sap (Key: SP-84)
 * @module pages/sandbox/configs/sap
 */
// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';

const config: OrgSandboxConfig = {
  orgLabel: 'SAP',
  accessKey: 'SP-84',
  sessionKey: 'sap-sandbox-unlocked',
  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',
  footerNote: 'SAP AI Governance Sandbox — CendiaSupervision demonstration environment. Scenarios are illustrative and do not represent actual SAP systems or incidents.',

  scenarios: [
    // SCENARIO 1 — SAP: EU AI ACT HIGH-RISK CLASSIFICATION
    {
      id: 'sap-euaia-hr',
      title: 'SAP SuccessFactors — EU AI Act High-Risk HR System',
      subtitle: 'AI recruitment filtering · Annex III high-risk · Conformity assessment · €35M fine exposure',
      banner: 'Simulating the EU AI Act compliance crisis: SAP SuccessFactors uses AI to screen, rank, and filter job applicants for 12,000 enterprise customers. Under the EU AI Act, AI systems used in employment decisions are classified as HIGH-RISK (Annex III, §6). SAP has not completed the mandatory conformity assessment. The European AI Office opens an investigation.',
      risk: 'Critical',
      scenarioNum: 'EUAIA',
      icon: 'shield',
      color: 'text-blue-400',
      agents: [
        { id: 'sf-ai', name: 'SuccessFactors AI Agent', role: 'Recruitment AI Screening & Ranking', icon: '👥', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'euaia-counsel', name: 'EU AI Act Counsel Agent', role: 'Annex III Classification & Conformity', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'aioffice-agent', name: 'European AI Office Agent', role: 'Market Surveillance & Enforcement', icon: '🇪🇺', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'deployer-agent', name: 'Enterprise Deployer Agent', role: 'Customer Compliance & Shared Obligations', icon: '🏢', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'SuccessFactors AI', status: 'connected', type: 'HR Screening', icon: 'cpu', detail: 'AI screens 48M applications/year across 12,000 enterprise customers' },
        { name: 'EU AI Act Registry', status: 'connected', type: 'High-Risk DB', icon: 'database', detail: 'Annex III §6(a): employment AI = HIGH-RISK, requires conformity assessment' },
        { name: 'Conformity Status', status: 'connected', type: 'Assessment', icon: 'check-circle', detail: 'Conformity assessment: NOT COMPLETED — risk management system incomplete' },
        { name: 'AI Office Portal', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'European AI Office: formal investigation opened after NGO complaint' },
      ],
      script: [
        { agentId: 'sf-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'SAP SuccessFactors recruitment AI: screens 48M job applications per year across 12,000 enterprise customers in 130 countries. The AI performs: (1) CV parsing and skills extraction, (2) candidate-job matching using NLP, (3) ranking and shortlisting (top 20% forwarded to human recruiters), (4) interview scheduling optimisation, (5) predictive success scoring based on historical hire data. 80% of applications are filtered OUT by the AI — never seen by a human. EU AI ACT CLASSIFICATION: Article 6(2) + Annex III, Area 6(a): "AI systems intended to be used for recruitment or selection of natural persons, in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates." This is a HIGH-RISK AI system. HIGH-RISK OBLIGATIONS (Articles 8-15): (1) Risk management system (Art. 9), (2) Data governance (Art. 10), (3) Technical documentation (Art. 11), (4) Record-keeping (Art. 12), (5) Transparency to deployers (Art. 13), (6) Human oversight (Art. 14), (7) Accuracy, robustness, cybersecurity (Art. 15). SAP STATUS: Partially compliant. Risk management system: drafted but incomplete. Conformity assessment: NOT STARTED. EU database registration: NOT COMPLETED.' },
        { agentId: 'euaia-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'EU AI ACT COMPLIANCE ALERT. (1) Article 6(2): AI systems listed in Annex III are high-risk. Recruitment AI is EXPLICITLY listed. No ambiguity. No exemption. (2) Article 16 — Provider obligations: SAP, as the provider, MUST: (a) ensure conformity with Articles 8-15 BEFORE placing the system on the EU market, (b) draw up technical documentation (Art. 11), (c) undergo conformity assessment (Art. 43), (d) register in the EU database (Art. 49), (e) affix the CE marking (Art. 48). SAP has done NONE of these for the recruitment AI. (3) Article 43 — Conformity assessment: For employment AI, SAP must complete the assessment based on internal control (Annex VI) or with a notified body (Annex VII). The assessment verifies ALL requirements of Articles 8-15 are met. (4) Penalties — Article 99: Non-compliance with high-risk obligations: up to €35M or 7% of global annual turnover, whichever is higher. SAP revenue: €31.2B. 7% = €2.18B. (5) The 12,000 enterprise customers who DEPLOY SuccessFactors also have obligations under Article 26 (deployer obligations). They rely on SAP\'s conformity. If SAP hasn\'t completed it: 12,000 customers are also non-compliant. Mass liability cascade.' },
        { agentId: 'aioffice-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. European AI Office investigation: (1) AlgorithmWatch (NGO) filed a complaint: "SAP SuccessFactors recruitment AI filters 48M applications annually without a conformity assessment under the EU AI Act." (2) Investigation scope: has SAP completed Articles 8-15 compliance? Has the conformity assessment been performed? Is the system registered in the EU AI database? (3) If the AI Office finds non-compliance: (a) Corrective action order: SAP must complete conformity within 6 months or withdraw the AI from the EU market. (b) Fine: up to €35M for the missing conformity assessment. (c) Market withdrawal: if SAP cannot demonstrate conformity, the recruitment AI must be withdrawn from ALL EU deployments. 12,000 customers lose the AI screening function. (4) Reputational: "SAP deploys illegal AI in HR for 12,000 companies" — the headline that damages SAP\'s enterprise trust. Competitors (Workday, Oracle HCM) who HAVE completed conformity gain massive advantage. (5) The deployer cascade: each of the 12,000 EU customers must assess whether they can continue using SuccessFactors AI. Legal departments at BMW, Siemens, Unilever, Deutsche Bank issue internal advisories.' },
        { agentId: 'deployer-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — ENTERPRISE DEPLOYER IMPACT. SAP\'s 12,000 enterprise customers are DEPLOYERS under the EU AI Act. Article 26 — Deployer obligations: (1) Use the AI in accordance with provider instructions. (2) Ensure human oversight as specified by the provider. (3) Monitor the AI for risks during operation. (4) Inform the provider of serious incidents. If SAP hasn\'t provided conformity documentation: deployers CANNOT fulfil their obligations. They are operating a non-conforming high-risk AI system. Their liability: up to €15M or 3% of turnover under Art. 99(4). A Fortune 500 deployer with €50B revenue: 3% = €1.5B exposure. Without CendiaSupervision: SAP loses the conformity assessment race. 12,000 customers face liability. Enterprise trust collapses. With CendiaSupervision: SAP demonstrates conformity through documented AI governance — risk management, bias testing, human oversight logging, and transparency documentation — all required by Articles 8-15.' },
        { agentId: 'sf-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing SAP + CendiaSupervision EU AI Act Governance: (1) RISK MANAGEMENT SYSTEM (Art. 9): CendiaSupervision implements continuous risk identification, estimation, and evaluation for the recruitment AI. Bias testing across protected characteristics (gender, age, ethnicity, disability). Risk mitigation measures documented and verified. (2) DATA GOVERNANCE (Art. 10): Training data documentation — source, selection criteria, bias examination, data gaps, representativeness. CendiaSupervision verifies training datasets meet Art. 10 requirements. (3) TECHNICAL DOCUMENTATION (Art. 11): CendiaSupervision generates Annex IV-compliant technical documentation: system description, design specifications, risk management, testing results, monitoring plan. (4) HUMAN OVERSIGHT (Art. 14): Every AI screening decision is logged with human oversight capability. Deployers receive "meaningful human oversight" documentation showing they can effectively oversee the AI. (5) CONFORMITY ASSESSMENT PACKAGE: CendiaSupervision assembles the complete Annex VI internal control documentation — ready for the conformity assessment. EU database registration data prepared.' },
        { agentId: 'aioffice-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Conformity assessment completed with CendiaSupervision documentation. Risk management system: operational. Bias testing: gender gap reduced from 12% to 2%. Technical documentation: Annex IV compliant. Human oversight: logged for all 48M decisions. EU database registration: completed. CE marking: affixed. 12,000 deployer customers receive conformity certificates. For SAP: CendiaSupervision = EU AI Act compliance at enterprise scale. "SAP SuccessFactors: EU AI Act conforming, CE-marked recruitment AI" — the competitive advantage that wins every enterprise RFP in Europe. Workday and Oracle HCM must now match this standard or lose EU market share.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sp10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sp20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (SuccessFactors AI + Risk mgmt + Data governance + Conformity assessment)',
        complianceLabel: 'EU AI Act Status',
        complianceValue: 'HIGH-RISK CONFORMITY COMPLETED',
        complianceThreshold: 'Art. 8-15 met, Annex VI assessment, CE marking affixed',
        agents: ['SuccessFactors AI Agent', 'EU AI Act Counsel Agent', 'European AI Office Agent', 'Enterprise Deployer Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'SAP — EU AI Act High-Risk Governance',
        guaranteeBody: 'Conformity assessment completed. Risk management: operational. Bias: 12% → 2%. Technical documentation: Annex IV. Human oversight: 48M decisions logged. 12,000 deployers covered. CE marking affixed.',
        evidenceChain: 'SuccessFactors AI (no conformity) → Art. 9 risk mgmt → Art. 10 data gov → Art. 11 tech docs → Art. 14 oversight → Annex VI assessment → CE marking → EU database registered → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how SAP + CendiaSupervision completes the EU AI Act conformity assessment for high-risk recruitment AI — protecting 12,000 enterprise customers.',
      phaseLabels: ['Annex III High-Risk & Missing Conformity', 'AI Office Investigation & Deployer Cascade', 'Articles 8-15 Compliance & CE Marking'],
    },

    // SCENARIO 2 — SAP: GDPR AUTOMATED DECISION-MAKING
    {
      id: 'sap-gdpr-art22',
      title: 'SAP S/4HANA — GDPR Art. 22 Automated Decision Violation',
      subtitle: 'AI credit scoring in ERP · No human review · Data subject access · €20M DPA fine',
      banner: 'Simulating the GDPR enforcement crisis: SAP S/4HANA\'s AI credit management module automatically rejects supplier payment terms for 34,000 businesses across the EU. The AI makes fully automated decisions with legal effects — violating GDPR Article 22. A German SME files a complaint with the BfDI. The DPA finds systematic Art. 22 violations.',
      risk: 'High',
      scenarioNum: 'GDPR',
      icon: 'lock',
      color: 'text-purple-400',
      agents: [
        { id: 'erp-ai', name: 'S/4HANA Credit AI Agent', role: 'Supplier Credit Scoring & Payment Terms', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'gdpr-counsel', name: 'GDPR Counsel Agent', role: 'Art. 22 Automated Decisions & Data Subject Rights', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'dpa-agent', name: 'BfDI Investigation Agent', role: 'German Federal Data Protection Authority', icon: '🇩🇪', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'sme-agent', name: 'SME Impact Agent', role: 'Business Impact & Economic Harm', icon: '🏭', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'S/4HANA Credit AI', status: 'connected', type: 'Supplier Scoring', icon: 'cpu', detail: 'AI scores 34,000 EU suppliers — auto-sets payment terms, credit limits' },
        { name: 'GDPR Module', status: 'connected', type: 'Art. 22 Check', icon: 'shield', detail: 'Art. 22(1): solely automated decisions with legal effects require safeguards' },
        { name: 'DSAR Portal', status: 'connected', type: 'Data Subject Rights', icon: 'user', detail: 'SME requests explanation of rejection — no meaningful info provided' },
        { name: 'BfDI Portal', status: 'syncing', type: 'Complaint', icon: 'alert-triangle', detail: 'BfDI complaint: automated decision with legal effects, no human review' },
      ],
      script: [
        { agentId: 'erp-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'SAP S/4HANA credit management AI. Enterprise customers use S/4HANA to manage supplier relationships. The AI module: (1) scores supplier creditworthiness using financial data, payment history, industry risk, and market signals; (2) automatically sets payment terms (net-30, net-60, net-90, or cash-in-advance); (3) automatically sets credit limits; (4) can automatically BLOCK purchase orders if the supplier\'s credit score drops below threshold. 34,000 EU suppliers are scored. The AI is FULLY AUTOMATED — no human reviews individual decisions. A German SME supplier (machine parts, €2.4M annual revenue) is scored by the AI. Score drops from 72 to 41 (below threshold) due to: (a) a news article mentioning the SME\'s industry sector facing headwinds, (b) a delayed payment from the SME\'s OWN customer affecting the SME\'s cash flow data. The AI automatically: (1) reduces payment terms from net-60 to cash-in-advance, (2) reduces credit limit from €500K to €50K, (3) blocks 3 pending purchase orders worth €340K. The SME receives NO notification explaining WHY. The system simply stops processing their orders.' },
        { agentId: 'gdpr-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'GDPR COMPLIANCE ALERT. (1) Article 22(1): "The data subject shall have the right not to be subject to a decision based solely on automated processing... which produces legal effects concerning him or her or similarly significantly affects him or her." The S/4HANA credit AI: (a) is solely automated (no human review), (b) produces legal effects (contract terms changed, orders blocked), (c) significantly affects the data subject (€340K in orders blocked, business operations disrupted). This is a TEXTBOOK Art. 22 violation. (2) Article 22(3): Where automated decisions are permitted (consent, contract, or law), the controller must implement "suitable measures to safeguard the data subject\'s rights and freedoms and legitimate interests, at least the right to obtain human intervention... to express his or her point of view and to contest the decision." SAP\'s system provides NONE of these safeguards. (3) Article 15(1)(h): the data subject has the right to "meaningful information about the logic involved" in automated decisions. The SME requested an explanation. The SAP system returned: "Your credit score has been updated." This is NOT meaningful information. (4) Fines: Art. 83(5): up to €20M or 4% of global turnover. SAP: 4% of €31.2B = €1.25B.' },
        { agentId: 'dpa-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. BfDI investigation: (1) The German SME filed a complaint with BfDI (Bundesbeauftragter für den Datenschutz und die Informationsfreiheit). Ground: "SAP\'s automated system blocked our orders without explanation or human review. We cannot contest the decision." (2) BfDI investigation scope: does S/4HANA\'s credit AI constitute solely automated decision-making under Art. 22? Are safeguards implemented? Is meaningful information provided? (3) BfDI\'s likely finding: YES — Art. 22 violated. The AI is sole decision-maker. Effects are significant. No safeguards. No meaningful explanation. (4) BfDI can: (a) order SAP to implement human review for all credit decisions with significant effects, (b) order SAP to provide meaningful explanations for every automated decision, (c) fine SAP up to €20M. (5) Cross-border dimension: under Art. 56 (one-stop-shop), BfDI coordinates with DPAs in all 27 member states. If the violation is found for German suppliers, it applies to ALL 34,000 EU suppliers. This becomes an EU-wide enforcement action.' },
        { agentId: 'sme-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SME IMPACT. The German SME: 45 employees. €2.4M revenue. The SAP credit AI\'s automated decision: (1) €340K in orders blocked — 14% of annual revenue gone overnight. (2) Cash-in-advance terms: the SME must now fund production BEFORE receiving payment. Working capital strain: €180K. (3) Other SAP customers see the downgraded score through SAP\'s shared supplier intelligence. Three other customers also reduce terms. Cascade effect. (4) The SME lays off 8 employees. Without CendiaSupervision: the AI makes a decision that destroys a business. No human reviews it. No one explains it. No one can be held accountable. With CendiaSupervision: the automated decision triggers Art. 22 safeguards — human review before significant effects. The credit analyst reviews the news article (sector headwind, not SME-specific) and the delayed payment (one-off, customer-caused). Score maintained. Orders processed. 45 jobs preserved.' },
        { agentId: 'erp-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing SAP + CendiaSupervision GDPR Art. 22 Governance: (1) AUTOMATED DECISION DETECTION: CendiaSupervision identifies all AI decisions that are (a) solely automated and (b) produce legal effects or significant impact. These are flagged for Art. 22 compliance. (2) HUMAN-IN-THE-LOOP: For Art. 22-flagged decisions, CendiaSupervision requires human review before the decision takes effect. The credit analyst sees: the AI score, the factors, and the recommended action. They approve, modify, or reject. (3) MEANINGFUL EXPLANATION: Every automated decision generates an Art. 15(1)(h)-compliant explanation: "Your credit score changed because: [factor 1 with weight], [factor 2 with weight]. This affected: [payment terms], [credit limit], [order status]." In the supplier\'s language. (4) CONTEST MECHANISM: Suppliers receive a portal to contest decisions. Art. 22(3) compliant: human intervention, express point of view, contest the decision. (5) DSAR AUTOMATION: When a supplier exercises Art. 15 rights, CendiaSupervision generates the complete response — processing purposes, categories, recipients, retention, logic, significance — within the 30-day deadline.' },
        { agentId: 'dpa-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Human-in-the-loop implemented for all significant credit decisions. Meaningful explanations generated automatically. Contest mechanism operational. The German SME\'s score: reviewed by human analyst, news article context assessed, score maintained. Orders processed. BfDI finds SAP compliant with Art. 22. For SAP: CendiaSupervision = GDPR automated decision governance for the world\'s largest ERP. "SAP S/4HANA: GDPR Art. 22 compliant AI with human oversight and meaningful explanations" — the feature that gives 34,000 EU suppliers confidence that AI decisions are fair, explainable, and contestable.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sp30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sp40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (S/4HANA AI + Art. 22 detection + Human review + Meaningful explanation)',
        complianceLabel: 'GDPR Status',
        complianceValue: 'ART. 22 SAFEGUARDS IMPLEMENTED',
        complianceThreshold: 'Human review, meaningful explanation, contest mechanism',
        agents: ['S/4HANA Credit AI Agent', 'GDPR Counsel Agent', 'BfDI Investigation Agent', 'SME Impact Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'SAP — GDPR Art. 22 Automated Decision Governance',
        guaranteeBody: 'Automated decision detection implemented. Human review for significant effects. Meaningful explanations in supplier language. Contest portal operational. BfDI compliant. 34,000 EU suppliers protected.',
        evidenceChain: 'S/4HANA AI (auto-block) → Art. 22 flagged → Human review → News context assessed → Score maintained → Orders processed → Explanation generated → BfDI compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how SAP + CendiaSupervision implements GDPR Art. 22 safeguards — preventing automated credit decisions from destroying EU businesses.',
      phaseLabels: ['Fully Automated Decision & No Explanation', 'BfDI Investigation & SME Harm', 'Human-in-the-Loop & Meaningful Explanations'],
    },

    // SCENARIO 3 — SAP: SUPPLY CHAIN AI & EU CSDDD
    {
      id: 'sap-csddd',
      title: 'SAP Ariba — CSDDD Supply Chain Due Diligence AI Failure',
      subtitle: 'AI supplier risk scoring · Forced labour undetected · CSDDD liability · €48M civil claim',
      banner: 'Simulating the EU supply chain due diligence crisis: SAP Ariba\'s AI supplier risk scoring rates a tier-2 supplier as "low risk" despite forced labour indicators. The EU Corporate Sustainability Due Diligence Directive (CSDDD) requires companies to identify and mitigate adverse human rights impacts in their supply chains. SAP\'s customer faces CSDDD liability.',
      risk: 'High',
      scenarioNum: 'CSDDD',
      icon: 'truck',
      color: 'text-emerald-400',
      agents: [
        { id: 'ariba-ai', name: 'SAP Ariba AI Agent', role: 'Supplier Risk Scoring & Due Diligence', icon: '🔗', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'csddd-counsel', name: 'CSDDD Counsel Agent', role: 'EU Due Diligence Directive & Human Rights', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'hrights-agent', name: 'Human Rights Agent', role: 'ILO Standards & Forced Labour Indicators', icon: '✊', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'buyer-agent', name: 'Enterprise Buyer Agent', role: 'Procurement Compliance & Liability', icon: '🏢', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Ariba Risk AI', status: 'connected', type: 'Supplier Scoring', icon: 'cpu', detail: 'AI scores 5.4M suppliers — financial, compliance, ESG risk' },
        { name: 'CSDDD Module', status: 'connected', type: 'Due Diligence', icon: 'shield', detail: 'Art. 7: identify actual/potential adverse human rights impacts' },
        { name: 'ILO Indicators', status: 'connected', type: 'Forced Labour', icon: 'alert-triangle', detail: '11 ILO indicators: excessive overtime, wage withholding, document retention' },
        { name: 'Tier-2 Supplier', status: 'syncing', type: 'Supply Chain', icon: 'git-branch', detail: 'Tier-2 garment factory: 3 ILO indicators present, scored "low risk"' },
      ],
      script: [
        { agentId: 'ariba-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'SAP Ariba supplier risk AI: scores 5.4M suppliers across financial, compliance, and ESG dimensions. A European fashion company uses Ariba for procurement. Their tier-2 supplier (garment factory in Southeast Asia) is scored by the AI. AI risk score: 28/100 (LOW RISK). The AI assessed: financial stability (profitable), compliance (no regulatory actions), and ESG (published sustainability report, industry certifications). CRITICAL GAP: The AI evaluated SELF-REPORTED data and public records. It did NOT assess ILO forced labour indicators. The garment factory: (1) Workers\' passports are held by factory management (ILO indicator: retention of identity documents). (2) Workers report 78-hour weeks (ILO indicator: excessive overtime). (3) Wage deductions for "accommodation" reduce pay below minimum wage (ILO indicator: wage manipulation). Three of the 11 ILO forced labour indicators are present. The AI scored this as "low risk" because: no public enforcement actions (the country doesn\'t enforce labour law against exporters), the factory has ISO 14001 (environmental, not labour), and the sustainability report says "we comply with all applicable laws."' },
        { agentId: 'csddd-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'CSDDD COMPLIANCE ALERT. The EU Corporate Sustainability Due Diligence Directive (2024/1760): (1) Article 7: Companies must "identify actual and potential adverse human rights impacts... arising from their own operations, those of their subsidiaries, and those of their business partners in the chains of activities." Tier-2 suppliers are IN SCOPE. (2) Article 8: Companies must take "appropriate measures to prevent or adequately mitigate potential adverse impacts." Using AI that doesn\'t check ILO forced labour indicators is NOT appropriate. (3) Article 22 (civil liability): Companies are liable for damages if they fail to comply with due diligence obligations AND this failure leads to adverse impact. The fashion company relied on SAP Ariba\'s "low risk" score. If forced labour is confirmed: €48M civil liability claim from affected workers (under Art. 22). (4) The CSDDD applies to companies with >1,000 employees and >€450M turnover. The fashion company: 12,000 employees, €3.2B turnover. Squarely in scope. (5) National supervisory authorities can impose fines of up to 5% of net worldwide turnover. For the fashion company: 5% of €3.2B = €160M.' },
        { agentId: 'hrights-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Human rights assessment: (1) The ILO has defined 11 indicators of forced labour. The garment factory exhibits 3: document retention, excessive overtime, and wage manipulation. Any ONE indicator warrants investigation. Three indicates a HIGH probability of forced labour. (2) 1,200 workers are affected. They cannot leave (passports held). They work 78-hour weeks (legal maximum: 48). Their wages, after deductions, are below subsistence. (3) An NGO investigation reveals the conditions and traces the supply chain to the European fashion company. Media coverage: "European brand sells clothes made with forced labour — AI rated the factory as low risk." (4) The reputational damage is existential. The fashion company\'s brand is built on "ethical fashion." Their customers pay premium prices for "responsibly sourced" products. The AI due diligence was supposed to guarantee this. (5) For SAP: every Ariba customer using the supplier risk AI for CSDDD compliance is now questioning whether the AI is fit for purpose. If the AI misses forced labour: what else does it miss?' },
        { agentId: 'buyer-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — ENTERPRISE BUYER. The fashion company\'s procurement team relied on SAP Ariba\'s "low risk" score. They did not conduct additional due diligence because the AI said it was unnecessary. Under CSDDD Art. 7: the company must identify adverse impacts "through appropriate means." Relying solely on AI that doesn\'t check ILO indicators is NOT appropriate. The company is liable. Without CendiaSupervision: the AI scores "low risk." Procurement proceeds. 1,200 workers remain in forced labour conditions. NGO exposé. €48M civil claim. Brand destroyed. With CendiaSupervision: the AI checks all 11 ILO forced labour indicators. Three indicators flagged. Score upgraded to HIGH RISK. Procurement team notified. Factory audit ordered. Conditions discovered. Remediation required before any orders placed. Workers protected.' },
        { agentId: 'ariba-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing SAP Ariba + CendiaSupervision CSDDD Governance: (1) ILO FORCED LABOUR SCREENING: CendiaSupervision integrates all 11 ILO forced labour indicators into supplier risk scoring. Indicators checked against: worker reports, NGO databases, labour inspection records, media monitoring, and satellite imagery (for restricted movement patterns). (2) TIER-N SUPPLY CHAIN MAPPING: CendiaSupervision traces supply chains beyond tier-1 to tier-2 and tier-3 suppliers. Each tier is assessed for adverse human rights impacts. (3) CSDDD COMPLIANCE PACKAGE: For each supplier, CendiaSupervision generates CSDDD-compliant due diligence documentation: risk identification, impact assessment, mitigation measures, monitoring plan. Ready for national supervisory authority examination. (4) ADVERSE IMPACT ALERTS: When indicators are detected, CendiaSupervision: flags the supplier, notifies the procurement team, recommends specific actions (audit, remediation plan, engagement, or disengagement), and documents the response. (5) ANNUAL REPORTING: CSDDD Art. 11 requires annual reporting on due diligence. CendiaSupervision generates the report: supply chain map, risks identified, actions taken, outcomes achieved.' },
        { agentId: 'hrights-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. ILO screening catches 3 indicators at the tier-2 factory. Score: LOW → HIGH RISK. Factory audit ordered. Forced labour conditions confirmed. Remediation: (1) passports returned, (2) overtime reduced to legal maximum, (3) wage deductions eliminated. 1,200 workers\' conditions improved. CSDDD compliance documented. For SAP: CendiaSupervision = supply chain human rights governance for 5.4M suppliers. "SAP Ariba: CSDDD-compliant supply chain AI with ILO forced labour screening" — the feature that makes SAP the default procurement platform for EU companies facing mandatory due diligence.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sp50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sp60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Ariba AI + ILO screening + Tier-N mapping + CSDDD documentation)',
        complianceLabel: 'CSDDD Status',
        complianceValue: '3 ILO INDICATORS CAUGHT — AUDIT ORDERED',
        complianceThreshold: 'ILO forced labour: document retention, overtime, wage manipulation',
        agents: ['SAP Ariba AI Agent', 'CSDDD Counsel Agent', 'Human Rights Agent', 'Enterprise Buyer Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'SAP — CSDDD Supply Chain Governance',
        guaranteeBody: 'Tier-2 factory: 3 ILO indicators detected. Score: low → high risk. Audit ordered. Forced labour remediated: passports returned, overtime reduced, wages restored. 1,200 workers protected. CSDDD Art. 7 compliant.',
        evidenceChain: 'Ariba AI (low risk — wrong) → ILO screening → 3 indicators → HIGH RISK → Audit ordered → Forced labour confirmed → Remediation → Workers protected → CSDDD compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how SAP Ariba + CendiaSupervision catches forced labour indicators in a tier-2 supplier — protecting 1,200 workers and €48M in CSDDD liability.',
      phaseLabels: ['ILO Indicators Missed & Low Risk Score', 'CSDDD Liability & NGO Exposé', 'ILO Screening & Tier-N Supply Chain Mapping'],
    },

    // SCENARIO 4 — SAP: AI PREDICTIVE ANALYTICS ENABLES WORKFORCE SURVEILLANCE
    {
      id: 'sap-workforce-surveillance',
      title: 'SAP SuccessFactors AI — Productivity Prediction Becomes Illegal Employee Surveillance',
      subtitle: 'Workforce analytics AI · Keystroke monitoring · Works council violation · €24M GDPR fine',
      banner: 'Simulating the workforce surveillance crisis: SAP SuccessFactors\' AI productivity analytics collects keystroke patterns, mouse movements, email sentiment, and calendar data to predict "employee engagement." German works councils and DPAs determine this constitutes illegal employee surveillance. €24M GDPR fine. 340 enterprise customers exposed.',
      risk: 'Critical',
      scenarioNum: 'SURV',
      icon: 'eye',
      color: 'text-red-400',
      agents: [
        { id: 'workforce-ai', name: 'SuccessFactors AI Agent', role: 'Productivity Analytics & Engagement Prediction', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'gdpr-counsel', name: 'GDPR Compliance Agent', role: 'Employee Data Protection & Works Council Rights', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'dpa-agent', name: 'German DPA Agent', role: 'Hessian Data Protection Authority', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'worker-agent', name: 'Employee Rights Agent', role: 'Worker Dignity & Privacy', icon: '👷', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Workforce AI', status: 'connected', type: 'Productivity Analytics', icon: 'cpu', detail: 'AI collects: keystrokes/hour, mouse idle time, email sentiment, meeting frequency' },
        { name: 'Employee Data', status: 'connected', type: 'Behavioural Profile', icon: 'database', detail: '84 behavioural signals per employee per day — "engagement score" generated hourly' },
        { name: 'Works Council', status: 'connected', type: 'Co-determination', icon: 'users', detail: 'BetrVG §87(1)(6): works council has co-determination right on technical monitoring' },
        { name: 'DPA Complaint', status: 'syncing', type: 'Investigation', icon: 'alert-triangle', detail: 'Hessian DPA: "Continuous behavioural monitoring of employees violates GDPR Art. 5(1)(c)"' },
      ],
      script: [
        { agentId: 'workforce-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'SAP SuccessFactors AI productivity analytics. Deployed to 340 enterprise customers across Europe. The AI collects 84 behavioural signals per employee per day: keystrokes per hour, mouse movement patterns, idle time, email response time, email sentiment analysis, calendar utilisation, Slack/Teams activity, document creation velocity. From these: the AI generates an hourly "engagement score" for each employee (0-100). Managers see: real-time dashboards of team engagement. HR sees: "flight risk" predictions, "quiet quitting" detection, "burnout indicators." CRITICAL ISSUE: Employees were not told about the 84 signals. The privacy notice says: "We may collect usage data to improve our services." It does NOT say: "We monitor your keystrokes, analyse your email sentiment, and score your engagement every hour." 2.8M employees across 340 companies are under continuous AI surveillance without informed consent.' },
        { agentId: 'gdpr-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'GDPR & EMPLOYMENT LAW ALERT. (1) GDPR Art. 5(1)(c) — Data minimisation: collecting 84 behavioural signals per employee per day is not minimised. Most are unnecessary for any legitimate HR purpose. (2) GDPR Art. 6 — Legal basis: employee consent is not freely given (power imbalance). Legitimate interest: surveillance is not proportionate. No valid legal basis. (3) German BetrVG §87(1)(6): works councils have CO-DETERMINATION rights on "introduction and use of technical devices designed to monitor employee behaviour." SAP deployed without works council agreement — a direct violation. (4) German Federal Labour Court (BAG): "Continuous performance monitoring that creates a comprehensive behavioural profile violates employee dignity." (5) GDPR Art. 22: automated individual decision-making (flight risk, quiet quitting) based on profiling requires explicit consent and right to human review. Neither provided. (6) Penalty exposure: €24M (GDPR) + German employment law remedies + individual employee claims.' },
        { agentId: 'dpa-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. Hessian DPA investigation (SAP is headquartered in Walldorf, Hessen): (1) DPA conducts technical audit of SuccessFactors data collection. Findings: 84 signals collected continuously. No valid consent. No data minimisation. No works council agreement at any customer site. (2) DPA issues preliminary finding: "SAP\'s workforce analytics constitutes unlawful employee surveillance under GDPR." (3) DPA orders: cease collection of behavioural signals until GDPR compliance demonstrated. Proposed fine: €24M. (4) 340 enterprise customers receive DPA notifications: "Your use of SAP SuccessFactors productivity analytics may constitute unlawful employee monitoring. Review immediately." (5) IG Metall (Germany\'s largest industrial union, 2.3M members) issues public statement: "SAP is surveilling German workers. This is unacceptable."' },
        { agentId: 'worker-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A software developer at a Munich company. She noticed her manager knew she had "low engagement" on a Thursday afternoon — when she was thinking through a complex architecture problem (low keystrokes, high idle time). The AI scored her as disengaged. Her manager asked: "Is everything okay? Your engagement has been low." She felt surveilled. She checked her contract: nothing about keystroke monitoring. Without CendiaSupervision: 84 signals. Hourly scoring. No consent. Workers treated as productivity data points. With CendiaSupervision: workforce analytics limited to AGGREGATE, ANONYMISED metrics. No individual behavioural profiling. Works council agreement required. The developer: her thinking time is respected, not surveilled.' },
        { agentId: 'workforce-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing SAP + CendiaSupervision Workforce Analytics Governance: (1) DATA MINIMISATION: CendiaSupervision reduces signals from 84 to 12 — only those with clear, documented HR purpose. No keystroke monitoring. No email sentiment. No idle time tracking. (2) AGGREGATE ONLY: Individual "engagement scores" eliminated. Only team-level and department-level anonymous metrics. No individual behavioural profiles. (3) WORKS COUNCIL INTEGRATION: CendiaSupervision requires works council agreement (BetrVG §87) before any workforce analytics deployment. No agreement = feature disabled. (4) TRANSPARENT DISCLOSURE: Plain-language employee notice: exactly what is collected, why, how it\'s used. GDPR Art. 13/14 compliant. (5) PURPOSE LIMITATION: Analytics used ONLY for organisational improvement — never for individual performance evaluation, termination, or disciplinary decisions.' },
        { agentId: 'dpa-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Signals: 84 → 12. Individual profiling: eliminated. Works council agreement: required. Transparent disclosure: implemented. Hessian DPA: "SAP demonstrates that workforce analytics can be GDPR-compliant." Fine: reduced to €2.4M (cooperation credit). IG Metall: "SAP respects worker dignity." For SAP: CendiaSupervision = workforce analytics governance. "SAP SuccessFactors: insights that respect employee privacy" — the message that keeps SAP\'s enterprise customers safe from DPA enforcement.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sp70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sp80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Workforce AI + Data minimisation + Aggregate only + Works council)',
        complianceLabel: 'GDPR Status',
        complianceValue: 'SIGNALS: 84 → 12, INDIVIDUAL PROFILING ELIMINATED',
        complianceThreshold: 'Data minimised, aggregate only, works council required, transparent',
        agents: ['SuccessFactors AI Agent', 'GDPR Compliance Agent', 'German DPA Agent', 'Employee Rights Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'SAP — Workforce Analytics Governance',
        guaranteeBody: 'Signals: 84 → 12. Individual profiling: eliminated. Works council: required. GDPR compliant. 2.8M employees protected. DPA fine: €24M → €2.4M.',
        evidenceChain: 'Workforce AI (84 signals) → Minimised to 12 → Aggregate only → Works council → Transparent → DPA compliant → IG Metall satisfied → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how SAP + CendiaSupervision transforms illegal workforce surveillance into GDPR-compliant anonymous analytics.',
      phaseLabels: ['84 Signals & Hourly Engagement Scoring', 'DPA Investigation & Works Council Violation', 'Data Minimisation & Aggregate Analytics'],
    },

    // SCENARIO 5 — SAP: AI INVOICE MATCHING ENABLES CAROUSEL VAT FRAUD
    {
      id: 'sap-vat-carousel',
      title: 'SAP S/4HANA AI — Invoice Matching Fails to Detect €180M Carousel VAT Fraud',
      subtitle: 'Invoice AI · Cross-border matching · Missing trader fraud · OLAF investigation',
      banner: 'Simulating the VAT fraud crisis: SAP S/4HANA\'s AI invoice matching system processes cross-border invoices automatically. A criminal network exploits this to execute carousel VAT fraud — claiming €180M in false VAT refunds across 6 EU member states. OLAF investigates. SAP\'s AI was the unwitting processing engine for one of the EU\'s largest VAT fraud schemes.',
      risk: 'Critical',
      scenarioNum: 'OLAF',
      icon: 'file-warning',
      color: 'text-red-400',
      agents: [
        { id: 'invoice-ai', name: 'S/4HANA Invoice Agent', role: 'AI Invoice Matching & Automated Posting', icon: '🧾', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'vat-counsel', name: 'VAT Compliance Agent', role: 'EU VAT Directive & Anti-Fraud', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
        { id: 'olaf-agent', name: 'OLAF Investigation Agent', role: 'European Anti-Fraud Office', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'treasury-agent', name: 'EU Treasury Agent', role: 'Member State Revenue Protection', icon: '💶', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Invoice AI', status: 'connected', type: 'Matching Engine', icon: 'cpu', detail: 'AI processes 4.2M cross-border invoices/month — matches PO, delivery, and invoice' },
        { name: 'VAT Data', status: 'connected', type: 'Cross-Border', icon: 'database', detail: 'Carousel: goods circle between 6 countries. Same goods, 340 invoices. VAT claimed each time.' },
        { name: 'OLAF Portal', status: 'connected', type: 'Investigation', icon: 'shield', detail: 'OLAF: "SAP systems processed the invoices that enabled €180M in fraudulent VAT claims"' },
        { name: 'VIES System', status: 'syncing', type: 'EU VAT Verification', icon: 'globe', detail: 'VIES: VAT Information Exchange System — carousel traders use valid VAT numbers' },
      ],
      script: [
        { agentId: 'invoice-ai', phase: 'phase1', type: 'analysis', delay: 800, content: 'SAP S/4HANA AI invoice matching. Processes 4.2M cross-border invoices per month for enterprise customers. The AI matches: purchase order → goods receipt → invoice. When all three match: automatic posting and payment. CRITICAL BLIND SPOT: Carousel VAT fraud. A criminal network creates a chain: Company A (Germany) sells electronics to Company B (Netherlands). B sells to C (Belgium). C sells to D (France). D sells back to A. The SAME goods circle between countries. Each transaction generates a cross-border invoice. Each buyer claims input VAT. The "missing trader" (usually Company B) collects VAT from its buyer but never remits it to the tax authority — then disappears. SAP\'s AI matches each invoice correctly — PO matches delivery matches invoice. The AI approves payment. It doesn\'t detect: the same serial numbers circling. The same goods crossing borders repeatedly. The suspicious velocity (340 invoices for the same goods in 6 months). €180M in false VAT refunds claimed across 6 EU states.' },
        { agentId: 'vat-counsel', phase: 'phase1', type: 'warning', delay: 2500, content: 'EU VAT FRAUD ALERT. (1) EU VAT Directive 2006/112/EC: Member states must implement measures to prevent VAT fraud. Companies that "knew or should have known" they were part of a fraudulent chain can lose their right to VAT deduction. (2) SAP\'s enterprise customers who used the AI to process carousel invoices may be liable: if they "should have known" the transactions were fraudulent. The AI SHOULD have detected the circular pattern. (3) Carousel fraud costs the EU €50B annually. It\'s the EU\'s single largest source of tax fraud. An AI that processes 4.2M cross-border invoices without carousel detection is negligent. (4) OLAF (European Anti-Fraud Office): investigates cross-border VAT fraud. OLAF can refer cases to national prosecutors. SAP and its customers face: VAT reassessment, penalties, and criminal investigation. (5) SAP\'s liability: if SAP marketed the AI as "intelligent invoice processing" but it can\'t detect the EU\'s most common invoice fraud pattern — that\'s a product liability question.' },
        { agentId: 'olaf-agent', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT LOGGED. OLAF investigation: (1) OLAF traces the carousel through 6 EU member states. All invoices processed through SAP S/4HANA at 4 of the 5 companies in the chain. (2) OLAF report: "SAP\'s AI invoice matching processed 340 invoices for the same goods circling between countries without flagging any anomaly. The AI treated each invoice as an independent, legitimate transaction." (3) OLAF recommends: national tax authorities reassess VAT deductions claimed by companies in the chain. Total reassessment: €180M + penalties. (4) German BKA (Federal Criminal Office) opens fraud investigation into the network. SAP\'s invoice processing logs are evidence. (5) 12 SAP enterprise customers are notified: "Your VAT deductions may be disallowed because your SAP system processed carousel invoices without detection."' },
        { agentId: 'treasury-agent', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — A legitimate German manufacturer. Uses SAP S/4HANA. Unknowingly bought electronics from a carousel trader (looked legitimate: valid VAT number, real goods delivered). SAP\'s AI matched the invoice perfectly. The manufacturer claimed €2.4M in input VAT. OLAF investigation: the manufacturer\'s VAT deduction is disallowed. €2.4M reassessed plus 12% penalty. The manufacturer did nothing wrong — but SAP\'s AI didn\'t warn them about the suspicious supplier. Without CendiaSupervision: the AI processes carousel invoices without detection. Legitimate customers lose VAT deductions. With CendiaSupervision: circular trading pattern detected. Alert: "This supplier is part of a cross-border chain with carousel indicators. Enhanced due diligence recommended before VAT claim." The manufacturer: warned. Does not claim VAT. Avoids €2.4M reassessment.' },
        { agentId: 'invoice-ai', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Proposing SAP + CendiaSupervision Invoice Fraud Governance: (1) CIRCULAR TRADING DETECTION: CendiaSupervision tracks goods across the supply chain. If the same goods (serial numbers, lot numbers) appear in a circular pattern between countries: ALERT. Carousel indicator flagged before VAT claim. (2) VELOCITY ANALYSIS: If the same goods change hands more than 3 times in 6 months across borders: suspicious. CendiaSupervision flags for human review. (3) MISSING TRADER INDICATORS: CendiaSupervision monitors supplier characteristics: newly registered VAT number, no physical presence, trading volume disproportionate to company size. Match 3+ indicators: enhanced due diligence required. (4) VIES INTEGRATION: Real-time VIES (VAT Information Exchange System) checks: is this VAT number still valid? Has it been flagged by any member state? (5) OLAF REPORTING: CendiaSupervision generates transaction intelligence reports compatible with OLAF reporting standards. SAP becomes part of the EU anti-fraud infrastructure.' },
        { agentId: 'olaf-agent', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Circular trading detection: active. Carousel indicators identified in 3 transactions (not 340). The legitimate manufacturer: warned before VAT claim. €2.4M preserved. OLAF: "SAP\'s invoice intelligence represents a significant advancement in EU VAT fraud prevention." For SAP: CendiaSupervision = invoice governance that protects customers from carousel liability. "SAP S/4HANA: intelligent invoicing that detects fraud before you claim VAT" — the feature that enterprise CFOs demand.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sp90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'spa0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Invoice AI + Circular detection + Velocity + Missing trader + VIES)',
        complianceLabel: 'OLAF Status',
        complianceValue: 'CAROUSEL DETECTED AT 3 INVOICES (NOT 340)',
        complianceThreshold: 'Circular detection, velocity, missing trader, VIES integrated',
        agents: ['S/4HANA Invoice Agent', 'VAT Compliance Agent', 'OLAF Investigation Agent', 'EU Treasury Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'SAP — Invoice Fraud Governance',
        guaranteeBody: 'Carousel detected early. €180M fraud prevented. Legitimate customers protected. VIES integrated. OLAF-compatible reporting. EU anti-fraud standard set.',
        evidenceChain: 'Invoice AI (no fraud check) → Circular detection → Velocity analysis → Missing trader → VIES check → Carousel flagged → Customer warned → OLAF compliant → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will demonstrate how SAP + CendiaSupervision detects carousel VAT fraud at 3 invoices — not 340 — protecting enterprise customers from €180M in reassessments.',
      phaseLabels: ['Blind Invoice Matching & 340 Carousel Invoices', 'OLAF Investigation & €180M Reassessment', 'Circular Detection & Missing Trader Indicators'],
    },
  ],

        complianceScore: 89,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.193Z",
            "type": "analysis",
            "title": "System Assessment - SAP SuccessFactors — EU AI Act High-Risk HR System",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Sap completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.193Z",
            "type": "warning",
            "title": "Privacy Compliance - SAP SuccessFactors — EU AI Act High-Risk HR System",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Sap completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.193Z",
            "type": "dissent",
            "title": "Security Risk - SAP SuccessFactors — EU AI Act High-Risk HR System",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Sap completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.193Z",
            "type": "proposal",
            "title": "Governance Framework - SAP SuccessFactors — EU AI Act High-Risk HR System",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Sap completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.193Z",
            "type": "resolution",
            "title": "Compliance Certified - SAP SuccessFactors — EU AI Act High-Risk HR System",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Sap completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]};

export default config;
