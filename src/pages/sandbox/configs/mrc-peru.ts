/**
 * MRC Peru Sandbox Config — Mallas, Resortes & Cables S.A.C.
 *
 * Bespoke sandbox for MRC Peru — Peruvian industrial supplier of meshes,
 * springs, and steel cables for mining, automotive, and general industry.
 * Bilingual EN/ES with 5 fully scripted multi-agent deliberation scenarios.
 *
 * Access: /sandbox/mrc (Key: MRC-26)
 *
 * @module pages/sandbox/configs/mrc-peru
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig, TemplateScenario } from '../SandboxTemplate';
import { ES_LABELS } from '../SandboxShared';

// =============================================================================
// SCENARIOS — English
// =============================================================================

const scenarios: TemplateScenario[] = [
  // ── Scenario 1: Mining Cable Certification Audit ──────────────────────────
  {
    id: 'mining-cable-cert',
    title: 'Mining Cable Certification — BRIDON Safety Compliance',
    subtitle: 'Cable integrity · Safety certification · Mining regulations · OSINERGMIN oversight',
    banner: 'A critical BRIDON high-engineering cable lot destined for Antamina copper mine shows inconsistent tensile test results. AI agents debate whether to halt shipment, request re-testing, or escalate to OSINERGMIN before the 72-hour delivery deadline.',
    risk: 'Critical',
    scenarioNum: 'S1',
    icon: 'alert-triangle',
    color: 'text-red-400',
    agents: [
      { id: 'quality', name: 'Quality Control Agent', role: 'Material Testing & Certification', icon: '🔬', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      { id: 'safety', name: 'Safety Compliance Agent', role: 'Mining Safety Regulations (DS 024-2016-EM)', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      { id: 'supply-chain', name: 'Supply Chain Agent', role: 'Logistics & Delivery Scheduling', icon: '🚛', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      { id: 'legal', name: 'Legal & Regulatory Agent', role: 'OSINERGMIN Compliance & Liability', icon: '⚖️', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
    ],
    connectors: [
      { name: 'Lab Testing System', status: 'connected', type: 'Quality Management', icon: 'activity', detail: 'Real-time tensile/fatigue test results from MRC lab' },
      { name: 'BRIDON Certification Portal', status: 'connected', type: 'Supplier Certification', icon: 'shield-check', detail: 'Product specifications and traceability data' },
      { name: 'OSINERGMIN Registry', status: 'syncing', type: 'Regulatory Database', icon: 'landmark', detail: 'Mining equipment compliance registry' },
      { name: 'Antamina ERP', status: 'ready', type: 'Customer System', icon: 'database', detail: 'Purchase order and delivery schedule' },
    ],
    script: [
      { agentId: 'quality', phase: 'phase1', type: 'warning', delay: 800, content: 'QUALITY ALERT. Tensile test batch MRC-2026-0847 shows 3 of 12 samples at 1,770 MPa — below the BRIDON specification minimum of 1,800 MPa. Standard deviation σ = 42 MPa suggests inconsistent wire drawing. Recommend halting shipment pending full re-test of the lot.' },
      { agentId: 'supply-chain', phase: 'phase1', type: 'analysis', delay: 2800, content: 'Logistics impact assessment: Antamina PO #ANT-2026-3291 requires delivery by April 14. Current lot is 48 metric tons of 6×36 Warrington-Seale cable. Re-testing adds 3 business days — delivery window is 72 hours. Alternate lot MRC-2026-0839 (32 MT) passed all tests but is insufficient for full order.' },
      { agentId: 'safety', phase: 'phase2', type: 'flag', delay: 2200, content: 'SAFETY FLAG. Under DS 024-2016-EM (Reglamento de Seguridad y Salud Ocupacional en Minería), cables used in hoisting operations must meet 100% of manufacturer specifications. Any sub-spec cable installed at elevation (4,300m at Antamina) compounds fatigue risk. This is a non-negotiable safety requirement.' },
      { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2400, content: 'DISSENT. While I agree sub-spec cables cannot ship, the 1,770 MPa readings are within 1.7% of spec. OSINERGMIN enforcement history shows tolerance for documented deviations with compensating measures. Propose: ship the conforming 32 MT immediately, file a voluntary deviation report, and expedite re-testing of remaining lot. This protects the commercial relationship while maintaining regulatory standing.' },
      { agentId: 'quality', phase: 'phase3', type: 'proposal', delay: 2000, content: 'RESOLUTION PROTOCOL: (1) Ship conforming lot MRC-2026-0839 immediately with full certification package. (2) Isolate non-conforming samples for destructive testing to determine root cause — likely die wear in drawing line 3. (3) Re-draw and re-test remaining wire from heat #H-4471. (4) Document everything in ISO 9001 nonconformance report NCR-2026-0128.' },
      { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Protocol accepted. Voluntary disclosure to OSINERGMIN filed under Article 37. Antamina commercial team notified of partial shipment with full delivery by April 18. MRC\'s proactive disclosure strengthens regulatory standing. Dissent WITHDRAWN — the split-shipment approach satisfies all constraints. Evidence sealed.' },
    ],
    receiptTemplate: {
      hash: 'SHA-256:a7f3c2e1b8d94f6721e0f53c89ab47d1e3672f8b9c01d45a6b283e7f9d810c4e',
      merkleRoot: '3b2e7d4f8a1c6e9b0d5f2a8c7e4b1d3f6a9c2e5b8d1f4a7c0e3b6d9f2a5c8e1',
      merkleLabel: 'Merkle Tree Root (Lab results + BRIDON specs + OSINERGMIN filing + Delivery records)',
      complianceLabel: 'DS 024-2016-EM Mining Safety',
      complianceValue: 'COMPLIANT — Split Shipment Protocol',
      complianceThreshold: 'All shipped cables meet 100% of BRIDON specifications',
      agents: ['Quality Control Agent', 'Safety Compliance Agent', 'Supply Chain Agent', 'Legal & Regulatory Agent'],
      dissents: 1,
      dissentResolved: true,
      guaranteeTitle: 'MRC Peru — Mining Cable Certification Evidence Sealed',
      guaranteeBody: 'This cryptographic bundle seals the complete quality control evidence chain: tensile test results, BRIDON traceability data, OSINERGMIN voluntary disclosure, and split-shipment authorization. All shipped cables meet 100% of manufacturer specifications. Evidence is court-admissible under Peruvian law.',
      evidenceChain: 'Lab testing → Specification analysis → Safety review → Regulatory filing → Partial shipment → Re-testing → Full delivery → ML-DSA-65 seal',
      complianceScore: 94,
    },
    idleTitle: 'Cable Certification Audit Ready',
    idleDesc: '4 AI agents will evaluate BRIDON cable test results against mining safety regulations, assess delivery logistics, and determine the optimal compliance path for a critical Antamina shipment.',
    phaseLabels: ['Quality Analysis & Logistics', 'Safety Review & Legal Debate', 'Resolution & Evidence Seal'],
  },

  // ── Scenario 2: Automotive Spring Recall Risk ─────────────────────────────
  {
    id: 'spring-recall',
    title: 'Automotive Spring Batch — Potential Recall Assessment',
    subtitle: 'Product liability · Automotive safety · Recall protocol · Consumer protection',
    banner: 'A major 4×4 distributor reports premature fatigue failure in MRC suspension springs installed on Toyota Hilux fleet vehicles operating in high-altitude mining roads. AI agents assess whether this warrants a voluntary recall.',
    risk: 'High',
    scenarioNum: 'S2',
    icon: 'siren',
    color: 'text-amber-400',
    agents: [
      { id: 'engineering', name: 'Engineering Agent', role: 'Metallurgical Analysis & Design', icon: '⚙️', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      { id: 'quality-auto', name: 'Automotive QA Agent', role: 'Product Testing & Standards', icon: '🔧', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      { id: 'risk', name: 'Risk Assessment Agent', role: 'Liability & Financial Impact', icon: '📊', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      { id: 'commercial', name: 'Commercial Agent', role: 'Customer Relations & Market Impact', icon: '🤝', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
    ],
    connectors: [
      { name: 'MRC Fatigue Lab', status: 'connected', type: 'Testing Facility', icon: 'activity', detail: 'Cyclic fatigue testing data — 500K+ cycles' },
      { name: 'INDECOPI Registry', status: 'connected', type: 'Consumer Protection', icon: 'shield', detail: 'Product recall database and reporting' },
      { name: 'Distributor CRM', status: 'syncing', type: 'Customer Database', icon: 'users', detail: '340 affected vehicles in fleet' },
      { name: 'Steel Mill Certs', status: 'connected', type: 'Raw Material Traceability', icon: 'database', detail: 'Heat treatment and alloy composition records' },
    ],
    script: [
      { agentId: 'engineering', phase: 'phase1', type: 'analysis', delay: 900, content: 'Metallurgical analysis of returned spring samples complete. Batch MRC-RES-4X4-2025-Q3 shows micro-cracking at the inner coil surface consistent with hydrogen embrittlement during the oil-quench phase. Affected heat numbers: H-7201 through H-7215. Production volume: 2,400 units across 15 heats.' },
      { agentId: 'quality-auto', phase: 'phase1', type: 'warning', delay: 2600, content: 'ALERT. Cross-referencing failure reports: 12 confirmed failures out of 340 installed units (3.5% failure rate) within 18 months of service. Industry threshold for voluntary recall consideration is typically 1-2%. Failure mode is catastrophic — spring fracture at operating load. This exceeds acceptable risk for suspension components.' },
      { agentId: 'risk', phase: 'phase2', type: 'flag', delay: 2200, content: 'LIABILITY ASSESSMENT. If a fractured spring causes a vehicle accident on a mining road at elevation, MRC faces: (1) Product liability under Código Civil Art. 1970 (strict liability for hazardous products), (2) Potential INDECOPI sanctions of up to 450 UIT (S/. 2.3M), (3) Loss of 4×4 distributor account (annual revenue: S/. 1.8M). Total exposure: S/. 6-12M. Voluntary recall cost estimate: S/. 380K.' },
      { agentId: 'commercial', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISSENT. A full public recall damages MRC\'s brand as Peru\'s premier spring manufacturer. Counter-proposal: Execute a "silent recall" — contact the distributor directly, replace all batch units under a "product improvement program," absorb the cost, and file with INDECOPI only if legally required. This preserves the commercial relationship and brand reputation.' },
      { agentId: 'risk', phase: 'phase3', type: 'proposal', delay: 2000, content: 'GOVERNANCE OVERRIDE. Peruvian consumer protection law (Ley 29571) requires notification to INDECOPI for known safety defects. A "silent recall" without reporting exposes MRC to penalties 3× the recall cost. RECOMMENDATION: File voluntary recall with INDECOPI, execute replacement program through distributor, and implement corrective action on oil-quench parameters. Transparency is both the ethical and financially optimal path.' },
      { agentId: 'commercial', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Dissent WITHDRAWN. The governance override is correct — transparent voluntary action with INDECOPI strengthens MRC\'s position as a responsible manufacturer. Distributor has been briefed and supports the approach. Replacement program begins Monday. Evidence package sealed for regulatory submission.' },
    ],
    receiptTemplate: {
      hash: 'SHA-256:b8e2d1f4a7c39b6e0d2f58a1c47b93e6f2871d4c5a0e38b7c162f9d8a5b40e7',
      merkleRoot: '7c4e2b9f1d8a3c6e0b5f7a2d4c8e1b3f9a6d2c5e8b1f4a7d0c3e6b9f2a5d8c1',
      merkleLabel: 'Merkle Tree Root (Metallurgical reports + Failure analysis + INDECOPI filing + Recall plan)',
      complianceLabel: 'Consumer Protection (Ley 29571)',
      complianceValue: 'VOLUNTARY RECALL FILED',
      complianceThreshold: 'Full compliance with INDECOPI reporting requirements',
      agents: ['Engineering Agent', 'Automotive QA Agent', 'Risk Assessment Agent', 'Commercial Agent'],
      dissents: 1,
      dissentResolved: true,
      guaranteeTitle: 'MRC Peru — Spring Recall Evidence Sealed',
      guaranteeBody: 'Complete evidence chain for voluntary product recall: metallurgical analysis, failure reports, risk assessment, INDECOPI filing, and corrective action plan. Transparent governance protects both consumers and MRC\'s regulatory standing.',
      evidenceChain: 'Failure reports → Metallurgical analysis → Risk assessment → INDECOPI filing → Replacement plan → Corrective action → ML-DSA-65 seal',
      complianceScore: 91,
    },
    idleTitle: 'Recall Assessment Ready',
    idleDesc: '4 AI agents will evaluate spring failure data, assess product liability, debate recall strategy, and determine the optimal path that balances safety, compliance, and commercial interests.',
    phaseLabels: ['Engineering & QA Analysis', 'Risk & Commercial Debate', 'Governance & Evidence Seal'],
  },

  // ── Scenario 3: Mining Mesh Procurement Fraud Detection ───────────────────
  {
    id: 'mesh-procurement',
    title: 'Zaranda Mesh Procurement — Bid Irregularity Investigation',
    subtitle: 'Procurement integrity · Anti-corruption · Mining operations · SUNAFIL oversight',
    banner: 'An anonymous tip alleges that a competitor submitted fraudulently low bids for zaranda (screening) mesh contracts at three Peruvian copper mines by misrepresenting wire gauge specifications. MRC must investigate whether to file a formal complaint.',
    risk: 'High',
    scenarioNum: 'S3',
    icon: 'search',
    color: 'text-purple-400',
    agents: [
      { id: 'procurement', name: 'Procurement Intelligence Agent', role: 'Bid Analysis & Market Pricing', icon: '📋', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
      { id: 'technical', name: 'Technical Standards Agent', role: 'Wire Gauge & Mesh Specifications', icon: '📐', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      { id: 'compliance-ac', name: 'Anti-Corruption Agent', role: 'Ley 30424 Compliance & Ethics', icon: '🔍', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      { id: 'strategy', name: 'Market Strategy Agent', role: 'Competitive Positioning & Response', icon: '🎯', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
    ],
    connectors: [
      { name: 'SEACE Portal', status: 'connected', type: 'Government Procurement', icon: 'landmark', detail: 'Public procurement database — bid history' },
      { name: 'MRC Cost Database', status: 'connected', type: 'Internal Pricing', icon: 'database', detail: 'Raw material costs and production margins' },
      { name: 'ASTM Standards', status: 'connected', type: 'Technical Standards', icon: 'file-text', detail: 'Wire mesh specifications (ASTM E2016)' },
      { name: 'Contraloría Portal', status: 'syncing', type: 'Audit Authority', icon: 'eye', detail: 'State procurement oversight reports' },
    ],
    script: [
      { agentId: 'procurement', phase: 'phase1', type: 'analysis', delay: 900, content: 'Bid analysis complete. Competitor X\'s winning bids at Southern Copper, Cerro Verde, and Las Bambas are 28-35% below MRC\'s cost of production for equivalent zaranda mesh. At current steel wire prices (USD $1,150/MT), it is mathematically impossible to produce ASTM E2016-compliant mesh at their bid prices without either (a) using sub-standard wire gauge, or (b) operating at a significant loss.' },
      { agentId: 'technical', phase: 'phase1', type: 'flag', delay: 2800, content: 'SPECIFICATION FLAG. I have analyzed mesh samples recovered from Cerro Verde\'s last replacement cycle. Wire diameter measures 3.8mm vs. the specified 4.5mm — a 15.6% reduction that decreases tensile strength by approximately 29% and service life by 40-50%. The mesh appears to use SAE 1045 carbon steel instead of the specified SAE 1065 high-carbon steel. This is a clear specification fraud.' },
      { agentId: 'compliance-ac', phase: 'phase2', type: 'warning', delay: 2200, content: 'LEGAL ANALYSIS. Under Ley 30424 (Corporate Criminal Liability), if Competitor X knowingly supplied sub-spec materials to mining operations, this constitutes fraud and potentially endangers worker safety. MRC has standing to file: (1) Complaint with INDECOPI for unfair competition, (2) Report to OSCE (Organismo Supervisor de las Contrataciones del Estado), (3) Criminal complaint under Art. 196 of the Penal Code (fraud).' },
      { agentId: 'strategy', phase: 'phase2', type: 'dissent', delay: 2500, content: 'CAUTION. Filing multiple simultaneous complaints could be perceived as a commercial vendetta rather than genuine safety concern. Propose a staged approach: first, present technical evidence directly to the mining companies\' procurement teams — let THEM file the complaints. This positions MRC as a trusted technical advisor rather than a litigious competitor. We win the moral high ground AND the re-bid contracts.' },
      { agentId: 'compliance-ac', phase: 'phase3', type: 'proposal', delay: 2000, content: 'INTEGRATED APPROACH: (1) Prepare comprehensive technical dossier with lab-verified evidence. (2) Present to mining companies\' quality teams directly. (3) File INDECOPI complaint for unfair competition (required by our compliance program). (4) Offer emergency replacement mesh at standard pricing — demonstrate we are the reliable alternative. Document everything in our Ley 30424 compliance system.' },
      { agentId: 'strategy', phase: 'phase3', type: 'resolution', delay: 2600, content: 'Agreed — the integrated approach covers both the ethical obligation and the commercial opportunity. Mining companies have been notified. INDECOPI complaint filed under case reference. MRC positioned as the quality benchmark. Evidence sealed.' },
    ],
    receiptTemplate: {
      hash: 'SHA-256:c9f4e2b1d8a73c6e0f5b2a9d4c7e18b3f6a2d5c8e1b4f7a0d3c6e9b2f5a8d1',
      merkleRoot: '8d5f3c1a7e2b9f4d0c6e8a3b5f1d7c2e9a4b6f0d3c5e8a1b7f2d4c6e9a3b5f1',
      merkleLabel: 'Merkle Tree Root (Bid analysis + Lab results + ASTM specs + INDECOPI filing)',
      complianceLabel: 'Anti-Corruption (Ley 30424)',
      complianceValue: 'COMPLAINT FILED — EVIDENCE PRESERVED',
      complianceThreshold: 'Full compliance with corporate criminal liability requirements',
      agents: ['Procurement Intelligence Agent', 'Technical Standards Agent', 'Anti-Corruption Agent', 'Market Strategy Agent'],
      dissents: 1,
      dissentResolved: true,
      guaranteeTitle: 'MRC Peru — Procurement Fraud Evidence Sealed',
      guaranteeBody: 'Complete investigation evidence chain: bid analysis, laboratory testing of competitor samples, ASTM specification comparison, INDECOPI complaint, and mining company notifications. Evidence is court-admissible and sealed with post-quantum cryptography.',
      evidenceChain: 'Bid analysis → Sample testing → Specification comparison → Mining co. notification → INDECOPI filing → Evidence seal → ML-DSA-65',
      complianceScore: 88,
    },
    idleTitle: 'Procurement Investigation Ready',
    idleDesc: '4 AI agents will analyze suspicious bid pricing, verify technical specifications, assess legal options, and develop a strategy that protects both market integrity and MRC\'s competitive position.',
    phaseLabels: ['Bid & Technical Analysis', 'Legal & Strategic Debate', 'Action Plan & Evidence Seal'],
  },

  // ── Scenario 4: Expanded Metal Export Compliance ──────────────────────────
  {
    id: 'export-compliance',
    title: 'Expanded Metal Export — Chile Mining Certification',
    subtitle: 'International trade · SUNAT customs · Chilean regulations · Product certification',
    banner: 'MRC receives a large order for expanded metal mesh from a Chilean mining conglomerate. AI agents navigate dual-jurisdiction compliance: Peruvian export regulations (SUNAT) and Chilean mining safety standards (SERNAGEOMIN).',
    risk: 'Medium',
    scenarioNum: 'S4',
    icon: 'globe',
    color: 'text-emerald-400',
    agents: [
      { id: 'trade', name: 'Trade Compliance Agent', role: 'SUNAT Export & Customs Regulations', icon: '🌐', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      { id: 'cert', name: 'Certification Agent', role: 'Chilean SERNAGEOMIN Standards', icon: '📋', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      { id: 'logistics', name: 'Logistics Agent', role: 'Cross-Border Shipping & Documentation', icon: '🚢', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      { id: 'finance', name: 'Finance Agent', role: 'FX Risk & Payment Terms', icon: '💰', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
    ],
    connectors: [
      { name: 'SUNAT Portal', status: 'connected', type: 'Customs Authority', icon: 'landmark', detail: 'Export declaration and tax benefits' },
      { name: 'SUNAT e-Factura', status: 'connected', type: 'Electronic Invoicing', icon: 'file-text', detail: 'Factura electrónica, guías de remisión & notas de crédito (OSE integration)' },
      { name: 'SERNAGEOMIN DB', status: 'syncing', type: 'Chilean Mining Authority', icon: 'shield', detail: 'Equipment approval registry' },
      { name: 'Shipping Broker', status: 'connected', type: 'Freight Forwarding', icon: 'globe', detail: 'Lima → Antofagasta route pricing' },
      { name: 'Bank of Credit', status: 'connected', type: 'Letter of Credit', icon: 'banknote', detail: 'USD-denominated L/C confirmation' },
    ],
    script: [
      { agentId: 'trade', phase: 'phase1', type: 'analysis', delay: 800, content: 'Export compliance review: Product classifies under HS 7314.49.00 (expanded metal). Peru-Chile trade agreement (ACE 38) provides zero-tariff access with Certificate of Origin. SUNAT drawback benefit of 3% applies to FOB value. Export license not required for standard industrial mesh. Tax benefit potential: USD $12,400 on this shipment.' },
      { agentId: 'cert', phase: 'phase1', type: 'warning', delay: 2500, content: 'CERTIFICATION GAP. Chilean mining regulation DS 132 requires SERNAGEOMIN approval for safety-critical mining equipment. Expanded metal used as walkway grating in underground mines requires a "Certificado de Conformidad" from a Chilean-accredited testing lab. MRC\'s current ISO 9001 certification alone is insufficient. Estimated timeline to obtain: 4-6 weeks via SGS Chile.' },
      { agentId: 'logistics', phase: 'phase2', type: 'analysis', delay: 2000, content: 'Shipping analysis: Optimal route is containerized via Callao → Antofagasta (7-day transit). 40 MT order fits in two 40-ft containers. Total freight: USD $3,800. The 4-6 week certification delay means we should ship product to a bonded warehouse in Antofagasta while certification is processed — avoids double handling and positions inventory for immediate release upon approval.' },
      { agentId: 'finance', phase: 'phase2', type: 'flag', delay: 2400, content: 'PAYMENT RISK FLAG. Chilean buyer requests 90-day payment terms. Current PEN/USD volatility (±4% monthly) creates FX exposure of approximately USD $8,000 on a $196K order. Recommend: (1) Price in USD with L/C confirmation from Banco de Chile, (2) Hedge via forward contract at current spot + 45 bps, (3) Include FX clause in contract allowing price adjustment if PEN moves >5%.' },
      { agentId: 'trade', phase: 'phase3', type: 'proposal', delay: 2000, content: 'INTEGRATED EXPORT PLAN: (1) Initiate SERNAGEOMIN certification via SGS Chile immediately — send samples next week. (2) Ship product to bonded warehouse in Antofagasta on Day 14. (3) Apply SUNAT drawback benefit (3% = USD $5,880). (4) Secure confirmed L/C in USD. (5) Net margin after all compliance costs: 18.4% — within MRC\'s target range for export business.' },
      { agentId: 'cert', phase: 'phase3', type: 'resolution', delay: 2600, content: 'Plan approved. SGS Chile appointment confirmed for April 22. All documentation prepared: product specifications, ISO 9001 certificate, material test reports, and manufacturing process description. Evidence package sealed for dual-jurisdiction compliance record.' },
    ],
    receiptTemplate: {
      hash: 'SHA-256:d0a5f3c2e1b8d74f9621e0f53c89ab47d1e3672f8b9c01d45a6b283e7f9d810',
      merkleRoot: '9e6g4d2b0f8a3c7e1d5f9a2c8e4b1d3f6a0c2e5b8d1f4a7c3e6b9d2f5a8c1e4',
      merkleLabel: 'Merkle Tree Root (SUNAT filing + SERNAGEOMIN application + L/C docs + Shipping manifest)',
      complianceLabel: 'Dual-Jurisdiction Export Compliance',
      complianceValue: 'EXPORT PLAN APPROVED',
      complianceThreshold: 'Peru (SUNAT) + Chile (SERNAGEOMIN) requirements satisfied',
      agents: ['Trade Compliance Agent', 'Certification Agent', 'Logistics Agent', 'Finance Agent'],
      dissents: 0,
      dissentResolved: true,
      guaranteeTitle: 'MRC Peru — Cross-Border Export Evidence Sealed',
      guaranteeBody: 'Complete trade compliance evidence: SUNAT export declaration, SERNAGEOMIN certification application, shipping documentation, Letter of Credit, and FX hedging strategy. Dual-jurisdiction compliance verified.',
      evidenceChain: 'Product classification → SUNAT filing → SERNAGEOMIN certification → Shipping → L/C → FX hedge → ML-DSA-65 seal',
      complianceScore: 92,
    },
    idleTitle: 'Export Compliance Review Ready',
    idleDesc: '4 AI agents will navigate dual-jurisdiction requirements for exporting expanded metal to Chilean mining operations, covering customs, certification, logistics, and financial risk management.',
    phaseLabels: ['Trade & Certification Analysis', 'Logistics & Financial Review', 'Integrated Plan & Evidence Seal'],
  },

  // ── Scenario 5: ISO 9001 Surveillance Audit Readiness ─────────────────────
  {
    id: 'iso-audit',
    title: 'ISO 9001:2015 Surveillance Audit — Nonconformance Resolution',
    subtitle: 'Quality management · Corrective actions · Continuous improvement · Certification maintenance',
    banner: 'MRC\'s annual ISO 9001:2015 surveillance audit is in 30 days. Previous audit identified 3 minor nonconformances and 1 major observation. AI agents assess readiness, prioritize corrective actions, and prepare the evidence package.',
    risk: 'Medium',
    scenarioNum: 'S5',
    icon: 'shield-check',
    color: 'text-blue-400',
    agents: [
      { id: 'qms', name: 'QMS Agent', role: 'Quality Management System Administration', icon: '📊', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      { id: 'production', name: 'Production Agent', role: 'Manufacturing Process Control', icon: '🏭', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      { id: 'hr-training', name: 'Training Agent', role: 'Competency & Skills Development', icon: '🎓', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      { id: 'mgmt', name: 'Management Review Agent', role: 'Leadership & Strategic Direction', icon: '📋', color: 'text-purple-400', borderColor: 'border-purple-500/40', bgColor: 'bg-purple-500/10' },
    ],
    connectors: [
      { name: 'QMS Document Control', status: 'connected', type: 'Document Management', icon: 'file-text', detail: '847 controlled documents — 23 pending review' },
      { name: 'CAPA System', status: 'connected', type: 'Corrective Action Tracking', icon: 'activity', detail: '3 open CAPAs from last audit' },
      { name: 'Training Database', status: 'syncing', type: 'HR & Competency', icon: 'users', detail: '142 employees — competency matrix' },
      { name: 'Calibration System', status: 'connected', type: 'Equipment Management', icon: 'search', detail: '67 calibrated instruments — 4 overdue' },
    ],
    script: [
      { agentId: 'qms', phase: 'phase1', type: 'analysis', delay: 800, content: 'Audit readiness assessment: NC-001 (Document control — outdated work instructions in spring tempering area) = CLOSED, evidence verified. NC-002 (Calibration — 4 micrometers past due) = IN PROGRESS, 2 of 4 completed. NC-003 (Customer complaint trending — wire mesh dimensional tolerance) = CLOSED, root cause addressed. MAJOR OBS-001 (Management review incomplete — no risk assessment documented) = OPEN, critical path item.' },
      { agentId: 'production', phase: 'phase1', type: 'warning', delay: 2600, content: 'PRODUCTION CONCERN. While NC-003 root cause was addressed (die replacement schedule updated), I\'m seeing a new trend: 3 customer returns in the last 60 days for galvanized mesh discoloration. This isn\'t a current nonconformance, but the auditor WILL review customer complaint data. We need a preventive action documented before the audit — root cause appears to be zinc bath temperature fluctuation in the second shift.' },
      { agentId: 'hr-training', phase: 'phase2', type: 'flag', delay: 2200, content: 'TRAINING GAP DETECTED. OBS-001 (Management Review) links to a deeper issue: 3 of 5 department heads have not completed the updated ISO 9001 internal auditor training. The auditor will check competency records under Clause 7.2. Additionally, 12 new production operators hired in Q1 haven\'t completed the galvanizing process qualification. These are both potential nonconformances if not addressed in 30 days.' },
      { agentId: 'mgmt', phase: 'phase2', type: 'dissent', delay: 2500, content: 'PRIORITY CHALLENGE. We cannot realistically close all gaps in 30 days while maintaining production schedules. PROPOSAL: Prioritize ruthlessly — (1) OBS-001 management review is the ONLY item that could trigger a major nonconformance and risk certification. Schedule it for next week. (2) Calibration completion: 2 days. (3) Training can be scheduled as "in progress" — the auditor needs to see a PLAN, not completion. (4) The galvanizing issue should be documented as a preventive action — shows proactive quality culture.' },
      { agentId: 'qms', phase: 'phase3', type: 'proposal', delay: 2000, content: '30-DAY ACTION PLAN: Week 1 — Complete management review with documented risk assessment (OBS-001 closure). Week 2 — Complete remaining calibrations + initiate galvanizing preventive action. Week 3 — Conduct internal audit of high-risk processes + department head training. Week 4 — Final document review, evidence compilation, audit preparation briefing for all staff. Total investment: 120 person-hours across departments.' },
      { agentId: 'mgmt', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Action plan approved. Management review scheduled for April 17 with full leadership team. Resource allocation confirmed: quality team leads the 30-day sprint, production adjusts shift schedules to accommodate training. MRC\'s ISO 9001 certification is strategically critical — it\'s required by 80% of our mining customers. Evidence package sealed.' },
    ],
    receiptTemplate: {
      hash: 'SHA-256:e1b6f4c3d2a89e7f0521d0e43b78ca36e2561f7a8b9d02c34a5b173d6e8c901f',
      merkleRoot: '0f7h5e3c1a9b4d8f2e6a0c3b7d1f5e9a2c4b6f8d0e2a7c1b5f3d9e4a8c6b0f2',
      merkleLabel: 'Merkle Tree Root (CAPA records + Calibration certs + Training records + Management review minutes)',
      complianceLabel: 'ISO 9001:2015 Surveillance Audit',
      complianceValue: 'AUDIT-READY — 30-DAY PLAN ACTIVE',
      complianceThreshold: 'All prior nonconformances addressed, new risks mitigated',
      agents: ['QMS Agent', 'Production Agent', 'Training Agent', 'Management Review Agent'],
      dissents: 1,
      dissentResolved: true,
      guaranteeTitle: 'MRC Peru — ISO 9001 Audit Readiness Evidence Sealed',
      guaranteeBody: 'Complete audit preparation evidence: CAPA closure records, calibration certificates, training plans, management review agenda, and preventive action documentation. 30-day sprint plan active with resource allocation confirmed.',
      evidenceChain: 'CAPA review → Calibration completion → Training plan → Management review → Internal audit → Evidence compilation → ML-DSA-65 seal',
      complianceScore: 85,
    },
    idleTitle: 'ISO 9001 Audit Prep Ready',
    idleDesc: '4 AI agents will assess audit readiness across quality management, production, training, and management review — creating a prioritized 30-day action plan to maintain ISO 9001 certification.',
    phaseLabels: ['Readiness Assessment', 'Gap Analysis & Prioritization', 'Action Plan & Evidence Seal'],
  },
];

// =============================================================================
// SCENARIOS — Spanish (ES)
// =============================================================================

const scenariosES: TemplateScenario[] = scenarios.map((s) => {
  const esMap: Record<string, Partial<TemplateScenario>> = {
    'mining-cable-cert': {
      title: 'Certificación de Cables Mineros — Cumplimiento de Seguridad BRIDON',
      subtitle: 'Integridad de cables · Certificación de seguridad · Regulaciones mineras · Supervisión OSINERGMIN',
      banner: 'Un lote crítico de cables de alta ingeniería BRIDON destinado a la mina de cobre Antamina muestra resultados inconsistentes en pruebas de tracción. Los agentes IA debaten si detener el envío, solicitar re-pruebas, o escalar a OSINERGMIN antes del plazo de entrega de 72 horas.',
      idleTitle: 'Auditoría de Certificación de Cables Lista',
      idleDesc: '4 agentes IA evaluarán los resultados de pruebas de cables BRIDON contra las regulaciones de seguridad minera, evaluarán la logística de entrega y determinarán la ruta óptima de cumplimiento para un envío crítico a Antamina.',
      phaseLabels: ['Análisis de Calidad y Logística', 'Revisión de Seguridad y Debate Legal', 'Resolución y Sellado de Evidencia'],
      script: [
        { agentId: 'quality', phase: 'phase1', type: 'warning', delay: 800, content: 'ALERTA DE CALIDAD. El lote de pruebas de tracción MRC-2026-0847 muestra 3 de 12 muestras a 1.770 MPa — por debajo del mínimo de especificación BRIDON de 1.800 MPa. La desviación estándar σ = 42 MPa sugiere un trefilado inconsistente. Se recomienda detener el envío hasta completar una re-prueba total del lote.' },
        { agentId: 'supply-chain', phase: 'phase1', type: 'analysis', delay: 2800, content: 'Evaluación de impacto logístico: La OC de Antamina #ANT-2026-3291 requiere entrega antes del 14 de abril. El lote actual es de 48 toneladas métricas de cable Warrington-Seale 6×36. La re-prueba agrega 3 días hábiles — la ventana de entrega es de 72 horas. El lote alternativo MRC-2026-0839 (32 TM) pasó todas las pruebas pero es insuficiente para la orden completa.' },
        { agentId: 'safety', phase: 'phase2', type: 'flag', delay: 2200, content: 'ALERTA DE SEGURIDAD. Bajo el DS 024-2016-EM (Reglamento de Seguridad y Salud Ocupacional en Minería), los cables utilizados en operaciones de izaje deben cumplir el 100% de las especificaciones del fabricante. Cualquier cable fuera de especificación instalado en altura (4.300m en Antamina) agrava el riesgo de fatiga. Este es un requisito de seguridad no negociable.' },
        { agentId: 'legal', phase: 'phase2', type: 'dissent', delay: 2400, content: 'DISENSO. Si bien estoy de acuerdo en que los cables fuera de especificación no pueden enviarse, las lecturas de 1.770 MPa están dentro del 1,7% de la especificación. El historial de OSINERGMIN muestra tolerancia para desviaciones documentadas con medidas compensatorias. Propongo: enviar los 32 TM conformes de inmediato, presentar un informe voluntario de desviación y acelerar la re-prueba del lote restante. Esto protege la relación comercial manteniendo la posición regulatoria.' },
        { agentId: 'quality', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PROTOCOLO DE RESOLUCIÓN: (1) Enviar inmediatamente el lote conforme MRC-2026-0839 con paquete completo de certificación. (2) Aislar muestras no conformes para pruebas destructivas y determinar causa raíz — probablemente desgaste de dado en línea de trefilado 3. (3) Re-trefilar y re-probar el alambre restante de la colada #H-4471. (4) Documentar todo en el informe de no conformidad ISO 9001 NCR-2026-0128.' },
        { agentId: 'legal', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Protocolo aceptado. Divulgación voluntaria a OSINERGMIN presentada bajo el Artículo 37. Equipo comercial de Antamina notificado del envío parcial con entrega completa para el 18 de abril. La divulgación proactiva de MRC fortalece su posición regulatoria. Disenso RETIRADO — el enfoque de envío dividido satisface todas las restricciones. Evidencia sellada.' },
      ],
    },
    'spring-recall': {
      title: 'Lote de Resortes Automotriz — Evaluación de Recall Potencial',
      subtitle: 'Responsabilidad del producto · Seguridad automotriz · Protocolo de recall · Protección al consumidor',
      banner: 'Un distribuidor importante de 4×4 reporta fallas prematuras por fatiga en resortes de suspensión MRC instalados en vehículos Toyota Hilux de flota minera. Los agentes IA evalúan si esto amerita un recall voluntario.',
      idleTitle: 'Evaluación de Recall Lista',
      idleDesc: '4 agentes IA evaluarán datos de fallas de resortes, analizarán responsabilidad del producto, debatirán estrategia de recall y determinarán el camino óptimo que equilibre seguridad, cumplimiento e intereses comerciales.',
      phaseLabels: ['Análisis de Ingeniería y QA', 'Debate de Riesgo y Comercial', 'Gobernanza y Sellado de Evidencia'],
      script: [
        { agentId: 'engineering', phase: 'phase1', type: 'analysis', delay: 900, content: 'Análisis metalúrgico de muestras de resortes devueltos completado. El lote MRC-RES-4X4-2025-Q3 muestra micro-fisuras en la superficie interior de la espira consistentes con fragilización por hidrógeno durante la fase de temple en aceite. Números de colada afectados: H-7201 a H-7215. Volumen de producción: 2.400 unidades en 15 coladas.' },
        { agentId: 'quality-auto', phase: 'phase1', type: 'warning', delay: 2600, content: 'ALERTA. Cruzando reportes de fallas: 12 fallas confirmadas de 340 unidades instaladas (tasa de falla del 3,5%) dentro de 18 meses de servicio. El umbral de la industria para considerar un recall voluntario es típicamente del 1-2%. El modo de falla es catastrófico — fractura del resorte bajo carga de operación. Esto excede el riesgo aceptable para componentes de suspensión.' },
        { agentId: 'risk', phase: 'phase2', type: 'flag', delay: 2200, content: 'EVALUACIÓN DE RESPONSABILIDAD. Si un resorte fracturado causa un accidente vehicular en una carretera minera de altura, MRC enfrenta: (1) Responsabilidad del producto bajo el Código Civil Art. 1970 (responsabilidad objetiva por productos peligrosos), (2) Posibles sanciones de INDECOPI de hasta 450 UIT (S/. 2,3M), (3) Pérdida de la cuenta del distribuidor 4×4 (ingreso anual: S/. 1,8M). Exposición total: S/. 6-12M. Costo estimado del recall voluntario: S/. 380K.' },
        { agentId: 'commercial', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DISENSO. Un recall público completo daña la marca de MRC como el principal fabricante de resortes del Perú. Contrapropuesta: Ejecutar un "recall silencioso" — contactar al distribuidor directamente, reemplazar todas las unidades del lote bajo un "programa de mejora de producto", absorber el costo y presentar ante INDECOPI solo si es legalmente requerido. Esto preserva la relación comercial y la reputación de marca.' },
        { agentId: 'risk', phase: 'phase3', type: 'proposal', delay: 2000, content: 'ANULACIÓN DE GOBERNANZA. La ley peruana de protección al consumidor (Ley 29571) requiere notificación a INDECOPI para defectos de seguridad conocidos. Un "recall silencioso" sin reportar expone a MRC a penalidades 3× el costo del recall. RECOMENDACIÓN: Presentar recall voluntario ante INDECOPI, ejecutar programa de reemplazo a través del distribuidor e implementar acción correctiva en parámetros de temple en aceite. La transparencia es tanto el camino ético como financieramente óptimo.' },
        { agentId: 'commercial', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Disenso RETIRADO. La anulación de gobernanza es correcta — la acción voluntaria transparente con INDECOPI fortalece la posición de MRC como fabricante responsable. El distribuidor ha sido informado y apoya el enfoque. El programa de reemplazo comienza el lunes. Paquete de evidencia sellado para presentación regulatoria.' },
      ],
    },
    'mesh-procurement': {
      title: 'Adquisición de Mallas de Zaranda — Investigación de Irregularidad en Licitación',
      subtitle: 'Integridad en adquisiciones · Anticorrupción · Operaciones mineras · Supervisión SUNAFIL',
      banner: 'Una denuncia anónima alega que un competidor presentó ofertas fraudulentamente bajas para contratos de mallas de zaranda en tres minas de cobre peruanas al falsificar especificaciones de calibre de alambre. MRC debe investigar si presenta una denuncia formal.',
      idleTitle: 'Investigación de Adquisiciones Lista',
      idleDesc: '4 agentes IA analizarán precios sospechosos de licitación, verificarán especificaciones técnicas, evaluarán opciones legales y desarrollarán una estrategia que proteja la integridad del mercado y la posición competitiva de MRC.',
      phaseLabels: ['Análisis Técnico y de Licitación', 'Debate Legal y Estratégico', 'Plan de Acción y Sellado de Evidencia'],
      script: [
        { agentId: 'procurement', phase: 'phase1', type: 'analysis', delay: 900, content: 'Análisis de licitaciones completado. Las ofertas ganadoras del Competidor X en Southern Copper, Cerro Verde y Las Bambas son 28-35% inferiores al costo de producción de MRC para malla de zaranda equivalente. A los precios actuales de alambre de acero (USD $1.150/TM), es matemáticamente imposible producir malla conforme a ASTM E2016 a sus precios de oferta sin (a) usar calibre de alambre inferior al estándar, o (b) operar con pérdida significativa.' },
        { agentId: 'technical', phase: 'phase1', type: 'flag', delay: 2800, content: 'ALERTA DE ESPECIFICACIÓN. He analizado muestras de malla recuperadas del último ciclo de reemplazo de Cerro Verde. El diámetro del alambre mide 3,8mm vs. los 4,5mm especificados — una reducción del 15,6% que disminuye la resistencia a la tracción en aproximadamente 29% y la vida útil en 40-50%. La malla parece usar acero al carbono SAE 1045 en lugar del acero de alto carbono SAE 1065 especificado. Esto es un claro fraude de especificaciones.' },
        { agentId: 'compliance-ac', phase: 'phase2', type: 'warning', delay: 2200, content: 'ANÁLISIS LEGAL. Bajo la Ley 30424 (Responsabilidad Penal Corporativa), si el Competidor X suministró materiales fuera de especificación a operaciones mineras a sabiendas, esto constituye fraude y potencialmente pone en peligro la seguridad de los trabajadores. MRC tiene legitimación para presentar: (1) Denuncia ante INDECOPI por competencia desleal, (2) Reporte al OSCE (Organismo Supervisor de las Contrataciones del Estado), (3) Denuncia penal bajo el Art. 196 del Código Penal (fraude).' },
        { agentId: 'strategy', phase: 'phase2', type: 'dissent', delay: 2500, content: 'PRECAUCIÓN. Presentar múltiples denuncias simultáneas podría percibirse como una vendetta comercial en lugar de una preocupación genuina de seguridad. Propongo un enfoque por etapas: primero, presentar la evidencia técnica directamente a los equipos de adquisiciones de las mineras — que ELLOS presenten las denuncias. Esto posiciona a MRC como un asesor técnico de confianza en lugar de un competidor litigioso. Ganamos la superioridad moral Y los contratos de re-licitación.' },
        { agentId: 'compliance-ac', phase: 'phase3', type: 'proposal', delay: 2000, content: 'ENFOQUE INTEGRADO: (1) Preparar dossier técnico completo con evidencia verificada en laboratorio. (2) Presentar a los equipos de calidad de las mineras directamente. (3) Presentar denuncia ante INDECOPI por competencia desleal (requerido por nuestro programa de cumplimiento). (4) Ofrecer malla de reemplazo de emergencia a precio estándar — demostrar que somos la alternativa confiable. Documentar todo en nuestro sistema de cumplimiento Ley 30424.' },
        { agentId: 'strategy', phase: 'phase3', type: 'resolution', delay: 2600, content: 'De acuerdo — el enfoque integrado cubre tanto la obligación ética como la oportunidad comercial. Las empresas mineras han sido notificadas. Denuncia ante INDECOPI presentada bajo referencia de caso. MRC posicionado como el referente de calidad. Evidencia sellada.' },
      ],
    },
    'export-compliance': {
      title: 'Exportación de Metal Expandido — Certificación Minería Chile',
      subtitle: 'Comercio internacional · Aduanas SUNAT · Regulaciones chilenas · Certificación de producto',
      banner: 'MRC recibe un pedido grande de malla de metal expandido de un conglomerado minero chileno. Los agentes IA navegan el cumplimiento de doble jurisdicción: regulaciones de exportación peruanas (SUNAT) y estándares de seguridad minera chilenos (SERNAGEOMIN).',
      idleTitle: 'Revisión de Cumplimiento de Exportación Lista',
      idleDesc: '4 agentes IA navegarán los requisitos de doble jurisdicción para exportar metal expandido a operaciones mineras chilenas, cubriendo aduanas, certificación, logística y gestión de riesgo financiero.',
      phaseLabels: ['Análisis Comercial y Certificación', 'Revisión Logística y Financiera', 'Plan Integrado y Sellado de Evidencia'],
      script: [
        { agentId: 'trade', phase: 'phase1', type: 'analysis', delay: 800, content: 'Revisión de cumplimiento de exportación: El producto clasifica bajo la partida arancelaria 7314.49.00 (metal expandido). El acuerdo comercial Perú-Chile (ACE 38) proporciona acceso libre de aranceles con Certificado de Origen. El beneficio de drawback de SUNAT del 3% aplica sobre el valor FOB. No se requiere licencia de exportación para malla industrial estándar. Beneficio fiscal potencial: USD $12.400 en este envío.' },
        { agentId: 'cert', phase: 'phase1', type: 'warning', delay: 2500, content: 'BRECHA DE CERTIFICACIÓN. La regulación minera chilena DS 132 requiere aprobación de SERNAGEOMIN para equipos de seguridad críticos en minería. El metal expandido usado como rejilla de pasarela en minas subterráneas requiere un "Certificado de Conformidad" de un laboratorio de ensayos acreditado en Chile. La certificación ISO 9001 actual de MRC por sí sola es insuficiente. Tiempo estimado para obtenerlo: 4-6 semanas vía SGS Chile.' },
        { agentId: 'logistics', phase: 'phase2', type: 'analysis', delay: 2000, content: 'Análisis de envío: La ruta óptima es contenedorizada vía Callao → Antofagasta (7 días de tránsito). El pedido de 40 TM cabe en dos contenedores de 40 pies. Flete total: USD $3.800. El retraso de 4-6 semanas por certificación significa que debemos enviar el producto a un depósito fiscal en Antofagasta mientras se procesa la certificación — evita doble manipulación y posiciona el inventario para liberación inmediata tras la aprobación.' },
        { agentId: 'finance', phase: 'phase2', type: 'flag', delay: 2400, content: 'ALERTA DE RIESGO DE PAGO. El comprador chileno solicita plazo de pago de 90 días. La volatilidad actual PEN/USD (±4% mensual) crea una exposición cambiaria de aproximadamente USD $8.000 sobre un pedido de $196K. Recomiendo: (1) Facturar en USD con carta de crédito confirmada del Banco de Chile, (2) Cubrir vía contrato forward al spot actual + 45 pbs, (3) Incluir cláusula cambiaria en el contrato permitiendo ajuste de precio si el PEN se mueve >5%.' },
        { agentId: 'trade', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PLAN INTEGRADO DE EXPORTACIÓN: (1) Iniciar certificación SERNAGEOMIN vía SGS Chile de inmediato — enviar muestras la próxima semana. (2) Enviar producto a depósito fiscal en Antofagasta el Día 14. (3) Aplicar beneficio de drawback SUNAT (3% = USD $5.880). (4) Asegurar carta de crédito confirmada en USD. (5) Margen neto después de todos los costos de cumplimiento: 18,4% — dentro del rango objetivo de MRC para negocio de exportación.' },
        { agentId: 'cert', phase: 'phase3', type: 'resolution', delay: 2600, content: 'Plan aprobado. Cita con SGS Chile confirmada para el 22 de abril. Toda la documentación preparada: especificaciones del producto, certificado ISO 9001, informes de ensayos de materiales y descripción del proceso de fabricación. Paquete de evidencia sellado para registro de cumplimiento de doble jurisdicción.' },
      ],
    },
    'iso-audit': {
      title: 'Auditoría de Vigilancia ISO 9001:2015 — Resolución de No Conformidades',
      subtitle: 'Gestión de calidad · Acciones correctivas · Mejora continua · Mantenimiento de certificación',
      banner: 'La auditoría anual de vigilancia ISO 9001:2015 de MRC es en 30 días. La auditoría anterior identificó 3 no conformidades menores y 1 observación mayor. Los agentes IA evalúan la preparación, priorizan acciones correctivas y preparan el paquete de evidencia.',
      idleTitle: 'Preparación para Auditoría ISO 9001 Lista',
      idleDesc: '4 agentes IA evaluarán la preparación para la auditoría en gestión de calidad, producción, capacitación y revisión de la dirección — creando un plan de acción priorizado de 30 días para mantener la certificación ISO 9001.',
      phaseLabels: ['Evaluación de Preparación', 'Análisis de Brechas y Priorización', 'Plan de Acción y Sellado de Evidencia'],
      script: [
        { agentId: 'qms', phase: 'phase1', type: 'analysis', delay: 800, content: 'Evaluación de preparación para auditoría: NC-001 (Control documental — instrucciones de trabajo desactualizadas en área de templado de resortes) = CERRADA, evidencia verificada. NC-002 (Calibración — 4 micrómetros vencidos) = EN PROGRESO, 2 de 4 completados. NC-003 (Tendencia de quejas de clientes — tolerancia dimensional de malla de alambre) = CERRADA, causa raíz atendida. OBS-001 MAYOR (Revisión por la dirección incompleta — sin evaluación de riesgos documentada) = ABIERTA, elemento de ruta crítica.' },
        { agentId: 'production', phase: 'phase1', type: 'warning', delay: 2600, content: 'PREOCUPACIÓN DE PRODUCCIÓN. Si bien la causa raíz de NC-003 fue atendida (calendario de reemplazo de dados actualizado), estoy observando una nueva tendencia: 3 devoluciones de clientes en los últimos 60 días por decoloración de malla galvanizada. Esto no es una no conformidad actual, pero el auditor SÍ revisará los datos de quejas de clientes. Necesitamos una acción preventiva documentada antes de la auditoría — la causa raíz parece ser fluctuación de temperatura del baño de zinc en el segundo turno.' },
        { agentId: 'hr-training', phase: 'phase2', type: 'flag', delay: 2200, content: 'BRECHA DE CAPACITACIÓN DETECTADA. La OBS-001 (Revisión por la Dirección) se vincula a un problema más profundo: 3 de 5 jefes de departamento no han completado la capacitación actualizada de auditor interno ISO 9001. El auditor verificará los registros de competencia bajo la Cláusula 7.2. Además, 12 nuevos operarios de producción contratados en Q1 no han completado la calificación del proceso de galvanizado. Ambos son potenciales no conformidades si no se atienden en 30 días.' },
        { agentId: 'mgmt', phase: 'phase2', type: 'dissent', delay: 2500, content: 'DESAFÍO DE PRIORIDAD. No podemos cerrar todas las brechas en 30 días manteniendo los programas de producción. PROPUESTA: Priorizar sin piedad — (1) La revisión por la dirección OBS-001 es el ÚNICO elemento que podría generar una no conformidad mayor y arriesgar la certificación. Programarla para la próxima semana. (2) Completar calibraciones: 2 días. (3) La capacitación puede programarse como "en progreso" — el auditor necesita ver un PLAN, no la finalización. (4) El tema del galvanizado debe documentarse como acción preventiva — demuestra cultura proactiva de calidad.' },
        { agentId: 'qms', phase: 'phase3', type: 'proposal', delay: 2000, content: 'PLAN DE ACCIÓN DE 30 DÍAS: Semana 1 — Completar revisión por la dirección con evaluación de riesgos documentada (cierre de OBS-001). Semana 2 — Completar calibraciones restantes + iniciar acción preventiva de galvanizado. Semana 3 — Realizar auditoría interna de procesos de alto riesgo + capacitación de jefes de departamento. Semana 4 — Revisión final de documentación, compilación de evidencia, briefing de preparación para auditoría para todo el personal. Inversión total: 120 horas-persona entre departamentos.' },
        { agentId: 'mgmt', phase: 'phase3', type: 'resolution', delay: 2800, content: 'Plan de acción aprobado. Revisión por la dirección programada para el 17 de abril con el equipo completo de liderazgo. Asignación de recursos confirmada: el equipo de calidad lidera el sprint de 30 días, producción ajusta horarios de turnos para acomodar la capacitación. La certificación ISO 9001 de MRC es estratégicamente crítica — es requerida por el 80% de nuestros clientes mineros. Paquete de evidencia sellado.' },
      ],
    },
  };
  const override = esMap[s.id] || {};
  return { ...s, ...override } as TemplateScenario;
});

// =============================================================================
// CONFIG
// =============================================================================

const config: OrgSandboxConfig = {
  orgLabel: 'MRC PERÚ — Mallas, Resortes & Cables',
  accessKey: 'MRC-26',
  sessionKey: 'mrc-peru-sandbox-unlocked',

  accent: 'amber',
  accentColor: 'text-amber-400',
  accentHover: 'from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600',
  ringColor: 'focus:ring-amber-500/30',
  borderColor: 'border-amber-500/30',
  gradientFrom: 'from-amber-600/20',
  gradientTo: 'to-amber-900/20',

  footerNote: '50+ industrial compliance scenarios mapped for MRC Perú · 5 live multi-agent deliberation demos · Mining, Automotive & Export verticals',

  scenarios,

  i18n: {
    footerNote: '50+ escenarios de cumplimiento industrial mapeados para MRC Perú · 5 demos de deliberación multi-agente en vivo · Verticales de Minería, Automotriz y Exportación',
    labels: ES_LABELS,
    scenarios: scenariosES,
  },

  complianceScore: 90,
  timelineEvents: [
    { timestamp: new Date(Date.now() - 300000).toISOString(), type: 'analysis', title: 'Cable Batch Quality Review', description: 'Tensile testing initiated for BRIDON cable lot MRC-2026-0847', agent: 'Quality Control Agent', impact: 'high' },
    { timestamp: new Date(Date.now() - 240000).toISOString(), type: 'warning', title: 'Sub-Spec Results Detected', description: '3 of 12 samples below BRIDON minimum specification', agent: 'Quality Control Agent', impact: 'high' },
    { timestamp: new Date(Date.now() - 180000).toISOString(), type: 'flag', title: 'Mining Safety Flag', description: 'DS 024-2016-EM requires 100% specification compliance for hoisting cables', agent: 'Safety Compliance Agent', impact: 'high' },
    { timestamp: new Date(Date.now() - 120000).toISOString(), type: 'dissent', title: 'Commercial Impact Assessment', description: 'Legal agent proposes split-shipment to protect delivery timeline', agent: 'Legal & Regulatory Agent', impact: 'medium' },
    { timestamp: new Date(Date.now() - 60000).toISOString(), type: 'resolution', title: 'Split-Shipment Protocol Approved', description: 'Conforming lot ships immediately, remainder after re-testing', agent: 'Quality Control Agent', impact: 'high' },
  ],
};

export default config;
