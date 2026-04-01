/**
 * Club Sporting Cristal Sandbox Config
 *
 * 5 fully scripted scenarios for Peru's corporate-governed club.
 * Access: /sandbox/sporting-cristal (Key: SCRI-26)
 *
 * @module pages/sandbox/configs/sporting-cristal
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';
import { ES_SCENARIOS } from './sporting-cristal-es';

const config: OrgSandboxConfig = {
  orgLabel: 'CLUB SPORTING CRISTAL',
  accessKey: 'SCRI-26',
  sessionKey: 'sporting-cristal-sandbox-unlocked',

  accent: 'sky',
  accentColor: 'text-sky-400',
  accentHover: 'from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600',
  ringColor: 'focus:ring-sky-500/30',
  borderColor: 'border-sky-500/30',
  gradientFrom: 'from-sky-600/20',
  gradientTo: 'to-sky-900/20',

  footerNote: '100 regulatory scenarios mapped for Sporting Cristal · Grupo Romero corporate governance · FPF, CONMEBOL, FIFA, SUNAT, SMV',

  i18n: {
    footerNote: '100 escenarios regulatorios mapeados para Sporting Cristal · Gobernanza corporativa Grupo Romero · FPF, CONMEBOL, FIFA, SUNAT, SMV',
    labels: {
      dataConnectors: 'Conectores de Datos',
      activeCouncil: 'Consejo Activo',
      deliberationTitle: 'Deliberación Multi-Agente',
      readyToBegin: 'Listo para comenzar',
      phase: 'Fase',
      deliberationComplete: 'Deliberación Completa — Consenso Alcanzado',
      runDeliberation: 'Iniciar Deliberación',
      generateReceipt: 'Generar Recibo del Regulador',
      generatingBundle: 'Generando Paquete de Evidencia Criptográfica...',
      simulationNote: 'NOTA DE SIMULACIÓN:',
      selectScenario: 'Seleccionar Escenario',
      reset: 'Reiniciar',
      confidential: 'CONFIDENCIAL',
      executiveSandbox: 'SANDBOX EJECUTIVO',
      connectorLive: 'ACTIVO',
      connectorSync: 'SYNC',
      connectorReady: 'LISTO',
      complianceScore: 'Puntuación de Cumplimiento',
      timeline: 'Línea de Tiempo',
      evidenceExplorer: 'Explorador de Evidencia',
      shareReport: 'Compartir Informe',
      exportData: 'Exportar Datos',
      viewDetails: 'Ver Detalles',
      hideDetails: 'Ocultar Detalles',
    },
    scenarios: ES_SCENARIOS,
  },

  scenarios: [
    // SCENARIO 1 — GRUPO ROMERO CORPORATE GOVERNANCE
    {
      id: 'grupo-romero-governance',
      title: 'Grupo Romero Corporate Governance — SOX-Equivalent Obligations',
      subtitle: 'BCP · Alicorp · Ransa · SMV reporting · Materiality thresholds · Related-party transactions',
      banner: 'Simulating corporate governance for Peru\'s most corporate-owned football club. Grupo Romero — one of Peru\'s largest conglomerates (BCP, Alicorp, Ransa) — requires SOX-equivalent governance standards for Sporting Cristal\'s material AI-assisted decisions.',
      risk: 'High',
      scenarioNum: 'Corporate',
      icon: 'building',
      color: 'text-sky-400',
      agents: [
        { id: 'corporate-gov', name: 'Corporate Governance Agent', role: 'Grupo Romero Standards & SMV', icon: '🏢', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'financial-cristal', name: 'Financial Agent', role: 'Materiality & Threshold Monitoring', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'related-party', name: 'Related-Party Agent', role: 'BCP/Alicorp Transaction Governance', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'audit-cristal', name: 'Audit Agent', role: 'Override Accountability & Audit Trail', icon: '📊', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
      ],
      connectors: [
        { name: 'Grupo Romero Compliance', status: 'connected', type: 'Corporate', icon: 'building', detail: 'Internal governance standards — materiality threshold PEN 2M' },
        { name: 'SMV Portal', status: 'connected', type: 'Regulator', icon: 'landmark', detail: 'Superintendencia del Mercado de Valores — listed entity requirements' },
        { name: 'SUNAT', status: 'connected', type: 'Tax', icon: 'database', detail: 'Corporate group tax consolidation active' },
        { name: 'CONMEBOL Licensing', status: 'syncing', type: 'Football', icon: 'check-circle', detail: 'Club licensing — all financial indicators GREEN' },
      ],
      script: [
        { agentId: 'corporate-gov', phase: 'phase1', type: 'warning', delay: 800, content: 'CORPORATE GOVERNANCE — GRUPO ROMERO STANDARDS. Sporting Cristal operates under dual governance: (1) Football regulations (FPF, CONMEBOL, FIFA) and (2) Grupo Romero corporate standards equivalent to SOX for publicly-listed subsidiaries. Every AI-assisted decision above PEN 2M materiality threshold requires: board-level documentation, override accountability (human decision-maker identified), audit trail accessible to Grupo Romero compliance. Current decisions pending governance review: (a) €1.2M transfer fee — above threshold. (b) Stadium Gallardo renovation Phase 2 — PEN 8M. (c) Alicorp sponsorship renewal — related-party transaction requiring independent valuation.' },
        { agentId: 'financial-cristal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'MATERIALITY ANALYSIS. (1) Transfer (€1.2M / ~PEN 5.4M): Well above PEN 2M threshold. Grupo Romero requires: independent valuation, board approval minute, override accountability record naming decision-maker. CONMEBOL also requires transfer documentation. Dual compliance needed. (2) Gallardo Phase 2 (PEN 8M): Capital expenditure requires Grupo Romero investment committee approval. Business case with 5-year ROI projection required. (3) Alicorp sponsorship (PEN 4.5M/year): Related-party transaction — Alicorp and Sporting Cristal are both Grupo Romero entities. SUNAT and SMV require arm\'s-length pricing evidence. An independent benchmarking study must confirm the sponsorship value is commercially reasonable.' },
        { agentId: 'related-party', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — RELATED-PARTY CONCENTRATION. (1) Alicorp sponsorship PEN 4.5M — 35% of total commercial revenue. (2) BCP banking services — Cristal\'s primary bank is BCP (Grupo Romero). Transaction fees, credit facilities, and financial services are all related-party. (3) Ransa logistics — team travel logistics contract with Ransa (Grupo Romero). (4) Combined related-party exposure: ~55% of Cristal\'s commercial revenue comes from Grupo Romero entities. This exceeds SMV related-party concentration guidelines (40% recommended maximum). My dissent: the club must commission an INDEPENDENT review of all Grupo Romero commercial relationships to demonstrate arm\'s-length pricing. Without this, SUNAT transfer pricing risk and SMV disclosure risk are both elevated.' },
        { agentId: 'audit-cristal', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — OVERRIDE ACCOUNTABILITY GAP. (1) 3 AI-assisted decisions in the last quarter exceeded materiality threshold but were NOT documented with override accountability: youth player contract (PEN 2.1M total value), training facility equipment (PEN 2.3M), and a loan fee (PEN 2.5M). (2) Grupo Romero audit found these gaps in the last quarterly review — compliance score dropped from 94% to 87%. (3) The gap is procedural, not substantive — the decisions were sound. But SOX-equivalent governance requires documentation REGARDLESS of outcome quality. (4) If Cristal\'s compliance score drops below 85%, Grupo Romero\'s internal policy triggers enhanced oversight — monthly reviews instead of quarterly.' },
        { agentId: 'corporate-gov', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Grupo Romero Governance Protocol: (1) THRESHOLD AUTOMATION: All AI-assisted decisions automatically flagged when approaching PEN 2M. Override accountability form required before execution — names decision-maker, documents rationale, records any dissent. (2) RELATED-PARTY (accepting dissent): Independent review of all Grupo Romero commercial relationships commissioned. Arm\'s-length pricing evidence for Alicorp, BCP, and Ransa contracts. SMV disclosure updated. (3) RETROACTIVE: 3 undocumented decisions receive retroactive override accountability documentation with board ratification. (4) TRANSFER: €1.2M transfer documented with independent valuation + board approval + CONMEBOL filing simultaneously. (5) GALLARDO: Investment committee business case prepared. (6) All decisions sealed with ML-DSA-65 — accessible to Grupo Romero compliance, SMV, SUNAT, and CONMEBOL.' },
        { agentId: 'related-party', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Independent review of all Grupo Romero commercial relationships addresses the concentration risk. Arm\'s-length evidence protects against SUNAT transfer pricing challenge and SMV disclosure concern. Cristal is unique in Peruvian football — the only club with corporate governance obligations of this sophistication. This protocol makes Cristal\'s governance the benchmark for corporate-owned football clubs in South America.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Corporate governance + Materiality + Related-party + Override accountability + SMV)',
        complianceLabel: 'Corporate Governance',
        complianceValue: 'GRUPO ROMERO COMPLIANCE 87%',
        complianceThreshold: 'PEN 2M materiality · SMV 40% related-party',
        agents: ['Corporate Governance Agent', 'Financial Agent', 'Related-Party Agent', 'Audit Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sporting Cristal — Grupo Romero Corporate Governance',
        guaranteeBody: 'Seals: SOX-equivalent override accountability, related-party independent review, materiality threshold automation, SMV disclosure, SUNAT transfer pricing defence.',
        evidenceChain: 'Materiality flag → Override accountability → Related-party review → Arm\'s-length evidence → Board approval → SMV disclosure → ML-DSA-65 seal',
        complianceScore: 87,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.198Z",
            "type": "analysis",
            "title": "System Assessment - Grupo Romero Corporate Governance — SOX-Equivalent Obligations",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Sporting Cristal completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.198Z",
            "type": "warning",
            "title": "Privacy Compliance - Grupo Romero Corporate Governance — SOX-Equivalent Obligations",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Sporting Cristal completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.198Z",
            "type": "dissent",
            "title": "Security Risk - Grupo Romero Corporate Governance — SOX-Equivalent Obligations",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Sporting Cristal completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.198Z",
            "type": "proposal",
            "title": "Governance Framework - Grupo Romero Corporate Governance — SOX-Equivalent Obligations",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Sporting Cristal completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.198Z",
            "type": "resolution",
            "title": "Compliance Certified - Grupo Romero Corporate Governance — SOX-Equivalent Obligations",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Sporting Cristal completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Sporting Cristal under Grupo Romero\'s corporate standards — SOX-equivalent compliance, related-party governance, and dual football/corporate regulatory obligations.',
      phaseLabels: ['Corporate Standards & Materiality', 'Related-Party & Override Accountability', 'Governance Protocol'],
    },

    // SCENARIO 2 — YOUTH ACADEMY PIPELINE
    {
      id: 'youth-academy-pipeline',
      title: 'Youth Academy — Corporate-Standard Development Governance',
      subtitle: 'Peru\'s top pipeline · Grupo Romero standards · CNA compliance · European transfers',
      banner: 'Simulating youth governance for Cristal\'s academy — one of Peru\'s most productive. Grupo Romero corporate standards require systematic documentation of safeguarding, education, talent identification, and transfer pipeline governance.',
      risk: 'High',
      scenarioNum: 'Youth',
      icon: 'users',
      color: 'text-emerald-400',
      agents: [
        { id: 'youth-cristal', name: 'Youth Development Agent', role: 'Academy Pipeline & FIFA Art. 19', icon: '👦', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'corporate-youth', name: 'Corporate Standards Agent', role: 'Grupo Romero Youth Governance', icon: '🏢', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'safeguarding-cristal', name: 'Safeguarding Agent', role: 'CNA & Child Protection', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'education-cristal', name: 'Education Agent', role: 'School Coordination & MINEDU', icon: '📚', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
      ],
      connectors: [
        { name: 'FPF Youth Registry', status: 'connected', type: 'Registration', icon: 'database', detail: '52 academy players aged 12-18 — top 3 pipeline in Peru' },
        { name: 'FIFA TMS', status: 'connected', type: 'International', icon: 'globe', detail: 'Article 19 compliance — 4 international youth transfers pending' },
        { name: 'Grupo Romero HR', status: 'connected', type: 'Corporate', icon: 'building', detail: 'Corporate youth employment standards apply to academy' },
        { name: 'MINEDU Portal', status: 'syncing', type: 'Education', icon: 'book-open', detail: 'School partnership — 3 formal MOUs active' },
      ],
      script: [
        { agentId: 'youth-cristal', phase: 'phase1', type: 'warning', delay: 800, content: 'YOUTH PIPELINE — CORPORATE STANDARDS. 52 academy minors (12-18): (1) 4 players aged 16-17 with European club interest — potential international transfers subject to FIFA Art. 19 (minor international transfer restrictions). (2) Pipeline metrics: 8 academy graduates in first team squad (highest in Liga 1). Revenue from academy sales last 3 years: $4.2M. (3) Grupo Romero standard: youth development must follow corporate HR frameworks adapted for football — documented performance reviews, development plans, welfare checks. (4) FIFA Art. 19 compliance: 3 of 4 pending transfers have complete documentation. 1 (player aged 16, Argentine nationality) requires additional verification — parents\' employment in Peru must be independently confirmed.' },
        { agentId: 'corporate-youth', phase: 'phase1', type: 'analysis', delay: 2500, content: 'GRUPO ROMERO YOUTH GOVERNANCE. Corporate standards require: (1) Documented development plan for every academy player (like corporate employee development). 48/52 complete. 4 missing (recent intakes). (2) Quarterly welfare reports to Grupo Romero HR — last submission: compliant. (3) Annual safeguarding audit by independent assessor — due in 6 weeks. (4) Financial governance: academy budget PEN 3.2M/year. All expenditure tracked through Grupo Romero financial systems. (5) Corporate ESG reporting: Cristal\'s academy is featured in Grupo Romero\'s ESG report as social impact. This creates ADDITIONAL documentation obligation — academy outcomes must be verifiable for ESG audit.' },
        { agentId: 'safeguarding-cristal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — SAFEGUARDING INDEPENDENCE. (1) Grupo Romero corporate HR standards are designed for adult employees, not children. Adapting corporate frameworks is useful but CANNOT replace child-specific safeguarding. (2) The annual independent audit is insufficient — CNA Ley 27337 and international best practice recommend continuous safeguarding monitoring, not annual snapshots. (3) 4 players with European interest face unique vulnerability — agents, scouts, and families may pressure them. These players need independent welfare support separate from the club\'s commercial interest in their transfer. (4) My dissent: Cristal must appoint an INDEPENDENT safeguarding officer (not a Grupo Romero HR employee) whose sole mandate is child welfare — reporting to an independent board committee, not club management.' },
        { agentId: 'education-cristal', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — EDUCATION METRICS. (1) 3 formal school MOUs — better than any other Liga 1 club. But: 7 of 52 players below 70% attendance. (2) 2 players aged 16 considering early school departure to focus on football — CNA requires education until 16 (minimum) and Grupo Romero standard requires until 18. (3) Corporate ESG reporting claims "100% education compliance" — current data shows 87%. This creates ESG reporting risk if not addressed. (4) The FIFA Art. 19 transfer for the 16-year-old Argentine requires education provision documentation in Peru — school enrollment must be confirmed before transfer approval.' },
        { agentId: 'youth-cristal', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Youth Academy Protocol: (1) FIFA ART. 19: Argentine player transfer — independent employment verification for parents commissioned. Education enrollment confirmed. 3 other transfers: documentation complete. (2) SAFEGUARDING (accepting dissent): Independent safeguarding officer appointed — reports to board committee, not management. Continuous monitoring replaces annual-only audit. (3) DEVELOPMENT PLANS: 4 missing plans completed within 2 weeks. Quarterly Grupo Romero HR reports maintained. (4) EDUCATION: 7 low-attendance players — individual intervention plans with schools. ESG reporting corrected to 87% with improvement plan. (5) TRANSFER PIPELINE: Independent welfare support for 4 players with European interest. (6) All sealed — evidence for FIFA, FPF, Grupo Romero compliance, MINEDU, and ESG audit.' },
        { agentId: 'safeguarding-cristal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Independent safeguarding officer with board-level reporting addresses the structural gap. Continuous monitoring is the right standard for 52 children. Cristal\'s academy is Peru\'s best — the governance should match. Grupo Romero\'s corporate resources make this achievable in a way other Liga 1 clubs cannot. For FIFA: Art. 19 compliance with enhanced documentation. For ESG: honest reporting builds credibility.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (FIFA Art. 19 + Safeguarding + Corporate HR + Education + ESG)',
        complianceLabel: 'Youth Development',
        complianceValue: '4 INTERNATIONAL TRANSFERS PENDING',
        complianceThreshold: 'FIFA Art. 19 · CNA Ley 27337 · Grupo Romero ESG',
        agents: ['Youth Development Agent', 'Corporate Standards Agent', 'Safeguarding Agent', 'Education Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sporting Cristal — Youth Academy Governance',
        guaranteeBody: 'Seals: FIFA Art. 19 transfers, independent safeguarding officer, Grupo Romero HR compliance, education MOUs, ESG reporting accuracy.',
        evidenceChain: 'Academy audit → FIFA Art. 19 → Safeguarding officer → Development plans → Education intervention → ESG correction → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Cristal\'s academy — Peru\'s top pipeline — under dual FIFA and Grupo Romero corporate standards.',
      phaseLabels: ['Pipeline & Corporate Standards', 'Safeguarding & Education', 'Academy Protocol'],
    },

    // SCENARIO 3 — BCP/ALICORP RELATED-PARTY
    {
      id: 'related-party-transactions',
      title: 'BCP & Alicorp — Related-Party Transaction Governance',
      subtitle: 'Grupo Romero entities · SUNAT transfer pricing · SMV disclosure · Arm\'s-length evidence',
      banner: 'Simulating related-party governance unique to Sporting Cristal — the only Liga 1 club where the owner\'s corporate subsidiaries (BCP, Alicorp, Ransa) are also commercial partners. Every transaction requires documented arm\'s-length evidence.',
      risk: 'High',
      scenarioNum: 'Related-Party',
      icon: 'landmark',
      color: 'text-amber-400',
      agents: [
        { id: 'sunat-cristal', name: 'SUNAT Agent', role: 'Transfer Pricing & Tax', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'smv-agent', name: 'SMV Agent', role: 'Securities Market Disclosure', icon: '📊', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'commercial-cristal', name: 'Commercial Agent', role: 'Sponsorship & Banking Governance', icon: '💼', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'conmebol-cristal', name: 'CONMEBOL Agent', role: 'Club Licensing Related-Party', icon: '🏆', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'SUNAT Transfer Pricing', status: 'connected', type: 'Tax', icon: 'landmark', detail: 'Art. 32-A — all Grupo Romero transactions auditable' },
        { name: 'SMV Disclosure', status: 'connected', type: 'Securities', icon: 'bar-chart', detail: 'Listed entity related-party reporting active' },
        { name: 'Alicorp Contract', status: 'connected', type: 'Sponsor', icon: 'building', detail: 'PEN 4.5M/year — independent valuation required' },
        { name: 'BCP Services', status: 'syncing', type: 'Banking', icon: 'database', detail: 'Primary banking — fees and credit facilities under review' },
      ],
      script: [
        { agentId: 'sunat-cristal', phase: 'phase1', type: 'warning', delay: 800, content: 'TRANSFER PRICING REVIEW. Grupo Romero related-party transactions: (1) Alicorp sponsorship: PEN 4.5M/year. Industry benchmark for clubs of Cristal\'s profile: PEN 3.0-4.0M. Current value is at the HIGH end — defensible but requires independent study. (2) BCP banking: below-market credit facility rate. Benefit to Cristal: ~PEN 280K/year in interest savings vs. market rate. SUNAT may view this as an indirect benefit requiring disclosure. (3) Ransa travel logistics: PEN 1.2M/year. Market comparison pending. (4) Combined: PEN 5.98M in related-party transactions annually. SUNAT transfer pricing rules require documented arm\'s-length evidence for EACH transaction.' },
        { agentId: 'smv-agent', phase: 'phase1', type: 'analysis', delay: 2500, content: 'SMV DISCLOSURE. Grupo Romero\'s listed entities (BCP via Credicorp) must disclose material related-party transactions in quarterly and annual filings. (1) Cristal\'s sponsorship with Alicorp: disclosed in Alicorp\'s financial statements. But Cristal\'s treatment of the sponsorship in its own accounts has not been independently verified for consistency. (2) BCP credit facility: NOT separately disclosed in BCP\'s related-party notes — classified as immaterial. But the aggregate of all Grupo Romero cross-entity transactions may be material. (3) CONMEBOL also requires related-party disclosure — but uses different materiality thresholds than SMV. Cristal must maintain dual-compliant documentation.' },
        { agentId: 'commercial-cristal', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — COMMERCIAL INDEPENDENCE. (1) Alicorp sponsorship at PEN 4.5M is above market benchmark upper end. If SUNAT challenges, Cristal would need to demonstrate the PREMIUM is justified by specific deliverables. Current sponsorship agreement has generic activation clauses — insufficient for SUNAT defence. (2) The below-market BCP credit facility may be the most significant tax risk — it\'s an indirect benefit not documented as compensation. (3) My dissent: Cristal must renegotiate ALL Grupo Romero contracts with DOCUMENTED specific deliverables justifying each price. Generic "brand association" is not a SUNAT-defensible justification for above-market pricing.' },
        { agentId: 'conmebol-cristal', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — CONMEBOL RELATED-PARTY. (1) CONMEBOL Club Licensing requires disclosure of transactions with entities sharing common ownership. Cristal\'s current submission lists Alicorp only. BCP and Ransa are NOT listed. (2) This creates a disclosure gap — not because the transactions are improper, but because they weren\'t flagged as related-party. (3) CONMEBOL\'s financial review in advance of Copa Libertadores is 8 weeks away. If the gap is identified during review: conditional licence or enhanced monitoring. (4) Voluntary disclosure before the review prevents sanction and demonstrates governance maturity.' },
        { agentId: 'sunat-cristal', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Related-Party Protocol: (1) INDEPENDENT STUDY: Commission Big 4 transfer pricing study for ALL Grupo Romero transactions — Alicorp, BCP, Ransa. Arm\'s-length pricing documented. (2) ALICORP (accepting dissent): Renegotiate with specific activation deliverables. Document unique value proposition justifying premium. (3) BCP: Below-market credit facility documented as related-party benefit with SUNAT implications assessed. (4) CONMEBOL: Voluntary disclosure of BCP and Ransa as related parties before Copa Libertadores review. (5) SMV: Updated related-party note prepared for next quarterly filing. (6) All contracts, valuations, and disclosures sealed — evidence for SUNAT, SMV, CONMEBOL simultaneously.' },
        { agentId: 'commercial-cristal', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Independent transfer pricing study and specific deliverable renegotiation address the SUNAT risk. Cristal\'s corporate ownership is a STRENGTH — it brings resources, governance capability, and commercial partnerships no other Liga 1 club has. But corporate ownership also creates unique regulatory obligations. This protocol ensures Cristal\'s Grupo Romero relationships are transparent, defensible, and compliant across all regulators.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (SUNAT transfer pricing + SMV disclosure + CONMEBOL related-party + Arm\'s-length)',
        complianceLabel: 'Related-Party Governance',
        complianceValue: 'PEN 5.98M ANNUAL — 3 ENTITIES',
        complianceThreshold: 'SUNAT Art. 32-A · SMV materiality · CONMEBOL',
        agents: ['SUNAT Agent', 'SMV Agent', 'Commercial Agent', 'CONMEBOL Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sporting Cristal — Related-Party Governance',
        guaranteeBody: 'Seals: Alicorp/BCP/Ransa arm\'s-length evidence, transfer pricing study, SMV quarterly disclosure, CONMEBOL voluntary disclosure, contract renegotiation.',
        evidenceChain: 'Transaction audit → Transfer pricing study → Arm\'s-length evidence → Contract renegotiation → CONMEBOL disclosure → SMV filing → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern related-party transactions between Sporting Cristal and Grupo Romero entities — SUNAT, SMV, and CONMEBOL compliance simultaneously.',
      phaseLabels: ['Transfer Pricing & Disclosure', 'Commercial Independence', 'Related-Party Protocol'],
    },

    // SCENARIO 4 — ESTADIO GALLARDO RENOVATION
    {
      id: 'gallardo-renovation',
      title: 'Estadio Gallardo — Copa Libertadores Venue Certification',
      subtitle: '18,076 capacity · CONMEBOL gaps · Corporate capital approval · Rímac district',
      banner: 'Simulating venue governance for Estadio Alberto Gallardo — Cristal\'s compact Rímac home requiring CONMEBOL Copa Libertadores certification upgrades under Grupo Romero capital expenditure governance.',
      risk: 'Medium',
      scenarioNum: 'Stadium',
      icon: 'building',
      color: 'text-blue-400',
      agents: [
        { id: 'venue-gallardo', name: 'Venue Agent', role: 'CONMEBOL Standards & Certification', icon: '🏟️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'capex-agent', name: 'Capital Expenditure Agent', role: 'Grupo Romero Investment Committee', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'safety-gallardo', name: 'Safety Agent', role: 'INDECI & Rímac Municipality', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'planning-gallardo', name: 'Planning Agent', role: 'Rímac District & Permits', icon: '📋', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'CONMEBOL Venue', status: 'connected', type: 'Certification', icon: 'check-circle', detail: '6 items below Copa Libertadores standard' },
        { name: 'Grupo Romero CapEx', status: 'connected', type: 'Investment', icon: 'building', detail: 'Investment committee — PEN 12M renovation proposal' },
        { name: 'INDECI', status: 'connected', type: 'Safety', icon: 'shield', detail: '18,076 capacity — evacuation plan under review' },
        { name: 'Rímac Municipality', status: 'syncing', type: 'Planning', icon: 'landmark', detail: 'District planning permissions — zoning constraints' },
      ],
      script: [
        { agentId: 'venue-gallardo', phase: 'phase1', type: 'warning', delay: 800, content: 'GALLARDO GAP ANALYSIS. 6 CONMEBOL Copa Libertadores gaps: (1) Floodlighting: 1,100 lux vs 1,400 required. (2) Media: 80 positions vs 200 required. (3) Hospitality below CONMEBOL minimum. (4) VAR room needs climate control upgrade. (5) Mixed zone insufficient for CONMEBOL post-match media requirements. (6) Disability access: 30 wheelchair positions vs 75 required. Small footprint (18,076) limits expansion options. Estimated cost: PEN 12M.' },
        { agentId: 'capex-agent', phase: 'phase1', type: 'analysis', delay: 2500, content: 'GRUPO ROMERO CAPEX GOVERNANCE. PEN 12M requires investment committee approval: (1) Business case: ROI projection based on Copa Libertadores match revenue uplift. (2) Alternative analysis: rent Estadio Nacional for Copa matches vs. upgrade Gallardo. Nacional rental: ~PEN 500K per match, 3-6 matches/year = PEN 1.5-3M. Upgrading Gallardo: PEN 12M upfront but 10+ year useful life. (3) Grupo Romero standard: NPV analysis required. At 12% discount rate and 10-year horizon, Gallardo upgrade is NPV-positive only if Cristal qualifies for Copa Libertadores 6+ times in 10 years. Historical qualification rate: 70%. (4) Investment committee meets in 4 weeks. Documentation deadline: 2 weeks.' },
        { agentId: 'safety-gallardo', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — SAFETY BEFORE COMMERCIAL. (1) Gallardo\'s Rímac location constrains evacuation — narrow streets, dense residential neighbourhood. Current INDECI plan has been flagged for "limited egress capacity" in the last 2 inspections. (2) Any renovation that increases hospitality (enclosed spaces) without improving egress actually WORSENS evacuation capacity. (3) Disability access at 30 vs 75 is not just CONMEBOL — it\'s CONADIS Ley 29973 non-compliance. This is a current legal violation, not a future requirement. My dissent: renovation plan must prioritise safety (evacuation, disability) BEFORE commercial upgrades (hospitality, media). If budget is constrained, commercial items should be deferred.' },
        { agentId: 'planning-gallardo', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — RÍMAC PLANNING. (1) Gallardo sits in dense residential Rímac — construction impacts neighbours. Rímac Municipality requires: construction impact assessment, noise mitigation, traffic management plan. (2) Zoning: current zoning permits sports facility. But hospitality expansion may trigger commercial zoning review. (3) Timeline: planning approval typically 3-4 months in Rímac. Expedited process possible but requires early engagement. (4) Community relations: Rímac residents have previously complained about match-day parking and noise. Renovation provides opportunity to address AND document community engagement.' },
        { agentId: 'venue-gallardo', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Gallardo Protocol: (1) SAFETY-FIRST (accepting dissent): Phase 1 (PEN 5M): evacuation improvements, disability access (30→75), INDECI egress resolution. Phase 2 (PEN 7M): floodlighting, VAR, media, hospitality. Safety compliance before commercial upgrades. (2) CAPEX: Business case with safety-first phasing submitted to investment committee. NPV analysis showing Copa qualification benefit. (3) ALTERNATIVE: Nacional rental as interim for Phase 1 period. (4) PLANNING: Early engagement with Rímac Municipality. Construction impact assessment commissioned. Community consultation documented. (5) All sealed for Grupo Romero, CONMEBOL, INDECI, CONADIS, and Rímac.' },
        { agentId: 'safety-gallardo', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Safety-first phasing ensures evacuation and disability access are resolved before commercial upgrades. CONADIS compliance is legally required — not optional. For Grupo Romero: phased approach with interim Nacional rental is financially prudent. For CONMEBOL: clear certification timeline. Gallardo is a compact jewel — the renovation makes it South America\'s best small-capacity Copa venue.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sc80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CONMEBOL gaps + CapEx approval + INDECI + CONADIS + Rímac planning)',
        complianceLabel: 'Venue Certification',
        complianceValue: '2-PHASE PEN 12M — SAFETY FIRST',
        complianceThreshold: 'CONMEBOL venue · CONADIS Ley 29973 · INDECI',
        agents: ['Venue Agent', 'Capital Expenditure Agent', 'Safety Agent', 'Planning Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sporting Cristal — Gallardo Renovation',
        guaranteeBody: 'Seals: 6-item CONMEBOL gap analysis, Grupo Romero CapEx business case, safety-first phasing, CONADIS compliance, Rímac community consultation.',
        evidenceChain: 'CONMEBOL gaps → NPV analysis → Safety-first phasing → Investment committee → Rímac planning → Community → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Gallardo\'s renovation — CONMEBOL certification under Grupo Romero investment governance with safety-first approach.',
      phaseLabels: ['CONMEBOL Gaps & CapEx', 'Safety & Planning', 'Phased Renovation Protocol'],
    },

    // SCENARIO 5 — ESG REPORTING
    {
      id: 'esg-reporting',
      title: 'Grupo Romero ESG — Football Club Social Impact Reporting',
      subtitle: 'Corporate ESG · Academy metrics · Community CSR · Environmental compliance',
      banner: 'Simulating ESG reporting governance unique to Cristal — the only Liga 1 club whose social impact must be documented for a publicly-listed corporate group\'s ESG disclosures. Academy outcomes, community programmes, and environmental compliance require verified evidence.',
      risk: 'Medium',
      scenarioNum: 'ESG',
      icon: 'bar-chart',
      color: 'text-emerald-400',
      agents: [
        { id: 'esg-agent', name: 'ESG Reporting Agent', role: 'Grupo Romero Sustainability', icon: '🌱', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'social-impact', name: 'Social Impact Agent', role: 'Community & Academy Metrics', icon: '👥', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'environmental', name: 'Environmental Agent', role: 'Stadium & Operations Compliance', icon: '🌍', color: 'text-sky-400', borderColor: 'border-sky-500/40', bgColor: 'bg-sky-500/10' },
        { id: 'verification', name: 'Verification Agent', role: 'Data Accuracy & Audit', icon: '✅', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
      ],
      connectors: [
        { name: 'Grupo Romero ESG', status: 'connected', type: 'Corporate', icon: 'building', detail: 'Annual sustainability report — Cristal section due in 8 weeks' },
        { name: 'Academy Metrics', status: 'connected', type: 'Social', icon: 'users', detail: '52 youth players, 8 graduates, education tracking' },
        { name: 'Community Programmes', status: 'connected', type: 'Impact', icon: 'globe', detail: '4 CSR programmes — 12,000 beneficiaries claimed' },
        { name: 'Environmental Data', status: 'syncing', type: 'Environment', icon: 'check-circle', detail: 'Gallardo energy, water, waste metrics collection active' },
      ],
      script: [
        { agentId: 'esg-agent', phase: 'phase1', type: 'warning', delay: 800, content: 'ESG REPORTING — GRUPO ROMERO DEADLINE. Annual sustainability report due in 8 weeks. Cristal\'s section covers: (1) SOCIAL: Academy youth development (52 players, education outcomes, safeguarding compliance). Community CSR (4 programmes, 12,000 beneficiaries). Employment (120 staff, diversity metrics). (2) ENVIRONMENTAL: Gallardo energy consumption, water usage, waste management. Match-day environmental impact. (3) GOVERNANCE: Board composition, anti-corruption, ethical conduct. (4) Last year\'s report: Cristal section was 14 pages. This year Grupo Romero has adopted GRI Standards — requiring verifiable metrics, not narrative claims.' },
        { agentId: 'social-impact', phase: 'phase1', type: 'analysis', delay: 2500, content: 'SOCIAL METRICS VERIFICATION. (1) Academy: "52 youth players in development" — verified. "8 academy graduates in first team" — verified. "100% education compliance" — INCORRECT (actual: 87%, 7 players below 70% attendance). (2) Community CSR: "12,000 beneficiaries" — methodology unclear. 4 programmes: school football (3,200 registered), community coaching (1,800), matchday access (estimated 5,000), health screenings (1,200 documented). Documented beneficiaries: 7,200. The 5,000 matchday figure is an estimate, not documented. (3) Employment diversity: 22% female staff. Grupo Romero target: 30%. (4) Under GRI Standards, unverified claims must be excluded or clearly labeled as estimates.' },
        { agentId: 'environmental', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — ENVIRONMENTAL DATA GAPS. (1) Gallardo energy: smart meters installed 6 months ago — only 6 months of data. Previous energy consumption was estimated, not measured. GRI requires 12-month data minimum. (2) Water: sub-metering for pitch irrigation vs. building use NOT separated. Cannot report stadium water usage accurately. (3) Waste: match-day waste data collected for 4 matches only — insufficient for annual reporting. (4) Carbon footprint: team travel carbon has never been calculated. Copa Libertadores travel generates significant emissions. My dissent: Cristal cannot publish environmental metrics that don\'t meet GRI verification standards. Better to report "baseline year — data collection in progress" than publish inaccurate figures.' },
        { agentId: 'verification', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — AUDIT RISK. (1) Grupo Romero\'s ESG report is subject to limited assurance by external auditor. If Cristal\'s metrics are found to be unverifiable, it reflects on the entire Grupo Romero report. (2) Last year: Cristal\'s section was narrative (no verification needed). This year under GRI: every metric requires documented evidence chain. (3) The 12,000 beneficiary claim and 100% education compliance are the highest-risk items — both are currently inaccurate. (4) Timeline: 8 weeks to report deadline. External assurance engagement starts in 4 weeks. All data must be finalized by Week 4.' },
        { agentId: 'esg-agent', phase: 'phase3', type: 'proposal', delay: 2000, content: 'ESG Protocol: (1) SOCIAL CORRECTION: Education revised to 87% with improvement plan documented. Beneficiaries revised to 7,200 documented + 5,000 estimated (clearly labeled). Employment diversity gap acknowledged with 30% target timeline. (2) ENVIRONMENTAL (accepting dissent): "Baseline year" declaration. 6-month energy data published with annualization methodology. Water sub-metering installed — full data next year. Waste collection expanded to all remaining matches. Travel carbon calculation commissioned. (3) GOVERNANCE: Board composition, anti-corruption, and ethical conduct sections verified. (4) VERIFICATION: All metrics with evidence chain documented. Week 4 deadline met. (5) Sealed for Grupo Romero compliance, GRI audit, and external assurance.' },
        { agentId: 'environmental', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. "Baseline year" approach is honest and GRI-compliant. Better to set a credible foundation than overstate current metrics. Cristal is the first Peruvian football club producing GRI-standard ESG reporting — there\'s no precedent to match. For Grupo Romero: accurate reporting protects corporate reputation. For football: this sets the standard for how clubs should report social and environmental impact.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:sc90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'sca0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (GRI metrics + Social correction + Environmental baseline + Audit evidence)',
        complianceLabel: 'ESG Reporting',
        complianceValue: 'GRI BASELINE YEAR — VERIFIED',
        complianceThreshold: 'GRI Standards · Grupo Romero sustainability',
        agents: ['ESG Reporting Agent', 'Social Impact Agent', 'Environmental Agent', 'Verification Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Sporting Cristal — ESG Governance',
        guaranteeBody: 'Seals: GRI-standard social metrics (corrected), environmental baseline declaration, beneficiary methodology, education accuracy, external assurance evidence.',
        evidenceChain: 'Metric collection → Social verification → Environmental baseline → Correction → Audit evidence → GRI compliance → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Cristal\'s ESG reporting — the first GRI-standard sustainability disclosure for a Peruvian football club.',
      phaseLabels: ['Social Metrics & Verification', 'Environmental Baseline', 'ESG Protocol'],
    },
  ],

        complianceScore: 92,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 180000).toISOString(),
            type: 'analysis',
            title: 'Grupo Romero Corporate Governance — SOX-Equivalent Obligations Analysis Started',
            description: 'AI governance analysis initiated',
            agent: 'AI Governance Agent',
            impact: 'high'
          },
          {
            timestamp: new Date(Date.now() - 120000).toISOString(),
            type: 'warning',
            title: 'Compliance Requirements Identified',
            description: 'Industry-specific compliance requirements detected',
            agent: 'Compliance Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'dissent',
            title: 'Risk Assessment Required',
            description: 'Potential compliance gaps need attention',
            agent: 'Risk Agent',
            impact: 'medium'
          },
          {
            timestamp: new Date(Date.now() - 30000).toISOString(),
            type: 'proposal',
            title: 'Enhanced Governance Proposed',
            description: 'Datacendia governance protocol recommended',
            agent: 'Datacendia Agent',
            impact: 'high'
          },
          {
            timestamp: new Date().toISOString(),
            type: 'resolution',
            title: 'Compliance Achieved',
            description: 'All requirements met with cryptographic evidence',
            agent: 'Compliance Agent',
            impact: 'high'
          }
        ]};

export default config;
