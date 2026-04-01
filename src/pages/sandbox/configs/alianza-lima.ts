/**
 * Club Alianza Lima Sandbox Config
 *
 * 5 fully scripted scenarios for Peru's most popular club.
 * Access: /sandbox/alianza-lima (Key: ALIM-26)
 *
 * @module pages/sandbox/configs/alianza-lima
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import type { OrgSandboxConfig } from '../SandboxTemplate';
import { ES_SCENARIOS } from './alianza-lima-es';

const config: OrgSandboxConfig = {
  orgLabel: 'CLUB ALIANZA LIMA',
  accessKey: 'ALIM-26',
  sessionKey: 'alianza-lima-sandbox-unlocked',

  accent: 'blue',
  accentColor: 'text-blue-400',
  accentHover: 'from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600',
  ringColor: 'focus:ring-blue-500/30',
  borderColor: 'border-blue-500/30',
  gradientFrom: 'from-blue-600/20',
  gradientTo: 'to-blue-900/20',

  footerNote: '100 regulatory scenarios mapped for Club Alianza Lima · FPF, CONMEBOL, FIFA, SUNAT, Ministerio Público, INDECOPI',

  i18n: {
    footerNote: '100 escenarios regulatorios mapeados para Club Alianza Lima · FPF, CONMEBOL, FIFA, SUNAT, Ministerio Público, INDECOPI',
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
    // SCENARIO 1 — PLAYER CONDUCT SCANDAL
    {
      id: 'player-conduct',
      title: 'Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings',
      subtitle: 'Zambrano, Trauco, Peña · FPF Tribunal · Ministerio Público · Ley 30364 · Due process',
      banner: 'Simulating disciplinary governance for the 2024 player conduct crisis. Three first-team players accused of alleged sexual assault — AI governs suspension, investigation, and reinstatement decisions with evidence of due process for FPF Tribunal, Ministerio Público, and socios accountability.',
      risk: 'Critical',
      scenarioNum: 'Conduct',
      icon: 'shield-alert',
      color: 'text-red-400',
      agents: [
        { id: 'disciplinary', name: 'Disciplinary Agent', role: 'FPF Reglamento & Internal Process', icon: '⚖️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'legal-criminal', name: 'Criminal Law Agent', role: 'Código Penal & Ministerio Público', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'safeguarding', name: 'Safeguarding Agent', role: 'Victim Protection & Ley 30364', icon: '🛡️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'reputation', name: 'Institutional Integrity Agent', role: 'Socios & Public Accountability', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'FPF Tribunal', status: 'connected', type: 'Disciplinary', icon: 'scale', detail: 'Reglamento Disciplinario — proceedings active for 3 players' },
        { name: 'Ministerio Público', status: 'connected', type: 'Criminal', icon: 'landmark', detail: 'Fiscalía investigation — evidence preservation critical' },
        { name: 'Ley 30364 Registry', status: 'connected', type: 'Protection', icon: 'shield', detail: 'Violence against women — protection measures in force' },
        { name: 'Socios Portal', status: 'syncing', type: 'Governance', icon: 'users', detail: 'Member communication — transparency obligation active' },
      ],
      script: [
        { agentId: 'disciplinary', phase: 'phase1', type: 'warning', delay: 800, content: 'DISCIPLINARY GOVERNANCE — PLAYER CONDUCT CRISIS. Three players suspended under FPF Reglamento Disciplinario Art. 45-52 following sexual assault allegations. Investigation Day 12 of 30-day FPF deadline. Each player has engaged separate counsel. Every decision — suspension, findings, hearings, reinstatement — must be sealed with cryptographic evidence. If exonerated: fair process demonstrated. If convicted: club acted appropriately from day one.' },
        { agentId: 'legal-criminal', phase: 'phase1', type: 'analysis', delay: 2500, content: 'CRIMINAL LAW. Fiscalía has opened preliminary investigation under Código Penal Art. 170-174 (6-12 year sentences). Ley 30364 protection orders issued — players cannot contact complainant. Club must preserve ALL evidence (CCTV, communications, access logs) — destruction = obstruction (Art. 405). FPF and criminal proceedings run in parallel. Criminal acquittal does NOT prevent FPF sanction. Club cooperation with Fiscalía must be documented but cannot share employment records without judicial order.' },
        { agentId: 'safeguarding', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — VICTIM-CENTRED APPROACH MISSING. Current process is player-focused. But Ley 30364 requires: (1) Has the club contacted the complainant to offer support? No. (2) Risk assessment for indirect contact through teammates, agents, fans? No. Protection order prevents direct contact but not indirect pressure. My dissent: the club must document support for the complainant — ethically required and legally defensible. A victim-centred response alongside due process for the accused.' },
        { agentId: 'reputation', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — PUBLIC ACCOUNTABILITY. (1) Socios demanding transparency — only ONE statement issued. Insufficient for member-owned club. (2) 3 sponsors requesting briefings — gambling sponsor has reputational damage termination clause (PEN 1.8M/year at risk). (3) Women\'s team raised internal concern — Ley 30901 gender equality creates institutional obligation. (4) La Victoria community impact extends beyond sport. (5) No crisis communication plan existed — every statement is reactive.' },
        { agentId: 'disciplinary', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Conduct Governance Protocol: (1) DUE PROCESS: Day-by-day timeline documented. Hearings Days 20-25. Evidence packages per player. (2) VICTIM SUPPORT (accepting dissent): Independent welfare officer contacts complainant. Risk assessment for indirect contact. Support documented. (3) EVIDENCE: All CCTV, logs sealed with timestamps. Fiscalía cooperation protocol. (4) SOCIOS: Weekly process updates. Crisis communication plan implemented. (5) SPONSORS: Individual briefings documented. (6) FPF TRIBUNAL: Complete bundle. Every decision sealed — ML-DSA-65 proof of process integrity.' },
        { agentId: 'safeguarding', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Victim support through independent welfare officer addresses the gap. For Fiscalía: club preserved evidence AND supported complainant. For FPF: complete process evidence with victim-centred additions. For socios: Alianza Lima\'s La Victoria identity means this governance response defines the institution. The scandal cannot be erased — but the response sets the standard for how football clubs handle conduct crises.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:al10123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'al20123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Disciplinary + Criminal + Victim support + Evidence + Socios)',
        complianceLabel: 'Conduct Governance',
        complianceValue: 'ACTIVE INVESTIGATION — DAY 12',
        complianceThreshold: 'FPF 30-day deadline · Ley 30364 protection',
        agents: ['Disciplinary Agent', 'Criminal Law Agent', 'Safeguarding Agent', 'Institutional Integrity Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alianza Lima — Player Conduct Governance',
        guaranteeBody: 'Seals: 3-player disciplinary, Fiscalía evidence preservation, Ley 30364 victim support, socios transparency, sponsor management, FPF Tribunal bundle.',
        evidenceChain: 'Incident → Suspension → Evidence preservation → Fiscalía → Victim support → Hearings → FPF Tribunal → Socios → ML-DSA-65 seal',
        complianceScore: 82,
        timelineEvents: [
      {
            "timestamp": "2026-04-01T12:18:01.119Z",
            "type": "analysis",
            "title": "System Assessment - Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings",
            "description": "Data protection, cybersecurity, IP rights, platform governance: System Assessment analysis for Alianza Lima completed with industry-specific compliance checks",
            "agent": "Tech Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:19:01.119Z",
            "type": "warning",
            "title": "Privacy Compliance - Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Privacy Compliance analysis for Alianza Lima completed with industry-specific compliance checks",
            "agent": "Privacy Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:20:01.119Z",
            "type": "dissent",
            "title": "Security Risk - Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Security Risk analysis for Alianza Lima completed with industry-specific compliance checks",
            "agent": "Security Agent",
            "impact": "medium"
      },
      {
            "timestamp": "2026-04-01T12:21:01.119Z",
            "type": "proposal",
            "title": "Governance Framework - Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Governance Framework analysis for Alianza Lima completed with industry-specific compliance checks",
            "agent": "Platform Agent",
            "impact": "high"
      },
      {
            "timestamp": "2026-04-01T12:22:01.119Z",
            "type": "resolution",
            "title": "Compliance Certified - Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings",
            "description": "Data protection, cybersecurity, IP rights, platform governance: Compliance Certified analysis for Alianza Lima completed with industry-specific compliance checks",
            "agent": "Audit Agent",
            "impact": "high"
      }
]
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents will govern Alianza Lima\'s conduct crisis — due process, victim-centred response, evidence preservation, and institutional accountability.',
      phaseLabels: ['Investigation & Criminal Coordination', 'Victim Support & Accountability', 'Governance Protocol'],
    },

    // SCENARIO 2 — EL CLÁSICO
    {
      id: 'clasico-governance',
      title: 'El Clásico — Peru\'s Biggest Match Security & Integrity',
      subtitle: 'Alianza vs Universitario · Matute 35,000 · Betting integrity · PNP coordination',
      banner: 'Simulating match-day governance for El Clásico del fútbol peruano at Matute — the highest-security match in Peru. AI coordinates Sportradar betting monitoring, PNP police deployment, crowd management, and referee protocols.',
      risk: 'High',
      scenarioNum: 'Clásico',
      icon: 'shield',
      color: 'text-amber-400',
      agents: [
        { id: 'match-integrity', name: 'Match Integrity Agent', role: 'Betting Monitoring & Sportradar', icon: '🎯', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'security-clasico', name: 'Security Agent', role: 'PNP Coordination & Crowd Control', icon: '🔒', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'venue-matute', name: 'Venue Agent', role: 'Matute Operations & INDECI', icon: '🏟️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'referee-liaison', name: 'Referee Liaison Agent', role: 'FPF Officials & VAR', icon: '📋', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'Sportradar', status: 'connected', type: 'Integrity', icon: 'bar-chart', detail: 'El Clásico — $4.2M estimated global betting volume' },
        { name: 'PNP Command', status: 'connected', type: 'Police', icon: 'shield', detail: '800+ officers — Lima Prefecture coordination' },
        { name: 'INDECI Portal', status: 'connected', type: 'Safety', icon: 'check-circle', detail: 'Matute 35,000 — evacuation plan certified' },
        { name: 'FPF Match Centre', status: 'syncing', type: 'Officials', icon: 'users', detail: 'Referee assignment — 72h pre-match notification' },
      ],
      script: [
        { agentId: 'match-integrity', phase: 'phase1', type: 'warning', delay: 800, content: 'MATCH INTEGRITY ALERT. Sportradar monitoring: El Clásico generates ~$4.2M betting volume globally. Pre-match alert: unusual Asian handicap pattern — significant money on Alianza +1.5 from SE Asia accounts. Consistent with informed betting. Does NOT confirm match-fixing but triggers FPF integrity officer notification and enhanced monitoring. 2 prior El Clásicos had betting alerts (both resolved as legitimate) — current alert has higher confidence score.' },
        { agentId: 'security-clasico', phase: 'phase1', type: 'analysis', delay: 2500, content: 'SECURITY ASSESSMENT. PNP: 800 officers (highest domestic allocation). External 400, internal 200, visiting escort 200. Universitario fans: Sector Norte (5,000), segregated entry via Av. Isabel La Católica. History: 2023 — 12 arrests, 3 officer injuries, 2 pyrotechnics. 2024 — 8 arrests, 1 pitch invasion attempt. La Victoria barrio creates pre/post-match crowd challenges. Social media threats between barras bravas detected — PNP intelligence monitoring. Enhanced CCTV activated.' },
        { agentId: 'venue-matute', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — CAPACITY CONCERNS. (1) 50,000+ ticket requests for 35,000 capacity. Last El Clásico: 37,200 inside (2,200 over) — INDECI noted violation. (2) Turnstiles: 28 of 32 operational — 14% above design throughput per gate. (3) Medical: 5 of 7 required points. (4) La Victoria narrow streets constrain evacuation flow. My dissent: operate at REDUCED 30,000 capacity. Revenue impact ~PEN 200K but addresses safety gap and INDECI compliance.' },
        { agentId: 'referee-liaison', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — REFEREE GOVERNANCE. Assigned referee: 3 prior El Clásicos (2 red cards triggered media debate). VAR room last inspected 6 months ago — re-inspection recommended. Referee arrives 3h pre-match with PNP escort. Post-match PNP escort to hotel required. CRITICAL: betting alert must NOT be shared with referee (performance anxiety risk) — but FPF integrity officer must be present at Matute with live Sportradar feed.' },
        { agentId: 'match-integrity', phase: 'phase3', type: 'proposal', delay: 2000, content: 'El Clásico Protocol: (1) INTEGRITY: FPF officer with live Sportradar at Matute. Alert documented but NOT shared with referee/teams. Post-match integrity report sealed 24h. (2) SECURITY: PNP 800 confirmed. Social media monitoring. Barra intelligence documented. (3) CAPACITY (accepting dissent): 32,000 reduced. Counterfeit detection enhanced. 2 additional medical points. (4) REFEREE: VAR re-inspected. PNP escort documented. (5) INDECI: Updated evacuation submitted. Every match-day decision sealed for FPF, PNP, INDECI, Sportradar.' },
        { agentId: 'venue-matute', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. 32,000 capacity addresses turnstile and evacuation constraints. Revenue impact justified by safety governance. For FPF: El Clásico integrity monitoring is the gold standard. For socios: safety governance trumps commercial pressure — even for Peru\'s biggest match. Receipt exports to FPF, PNP, INDECI, Sportradar, CONMEBOL simultaneously.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:al30123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'al40123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (Betting integrity + PNP + Matute capacity + INDECI + Referee + VAR)',
        complianceLabel: 'Match Integrity',
        complianceValue: 'BETTING ALERT — ENHANCED MONITORING',
        complianceThreshold: 'FPF integrity · Sportradar threshold',
        agents: ['Match Integrity Agent', 'Security Agent', 'Venue Agent', 'Referee Liaison Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alianza Lima — El Clásico Match Governance',
        guaranteeBody: 'Seals: Sportradar betting alert, PNP 800-officer deployment, Matute reduced to 32,000, referee escort, VAR re-inspection, INDECI evacuation.',
        evidenceChain: 'Sportradar → FPF integrity → PNP briefing → Capacity reduction → Medical → Referee → Match monitoring → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern El Clásico — coordinating betting integrity, police security, venue safety, and referee protocols at Peru\'s highest-stakes match.',
      phaseLabels: ['Integrity & Security Assessment', 'Capacity & Referee Governance', 'Match-Day Protocol'],
    },

    // SCENARIO 3 — MATUTE REDEVELOPMENT
    {
      id: 'matute-redevelopment',
      title: 'Matute Redevelopment — Historic Stadium Modernisation',
      subtitle: 'Estadio Alejandro Villanueva · CONMEBOL gaps · PEN 45M · Heritage · Socios vote',
      banner: 'Simulating stadium governance for Matute — Alianza Lima\'s historic La Victoria home. AI-assisted feasibility, CONMEBOL venue certification, financing, and socios approval produce auditable evidence for Peru\'s most emotionally significant stadium project.',
      risk: 'High',
      scenarioNum: 'Stadium',
      icon: 'building',
      color: 'text-blue-400',
      agents: [
        { id: 'venue-redev', name: 'Venue Development Agent', role: 'CONMEBOL Standards & Feasibility', icon: '🏟️', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'financial-redev', name: 'Financial Agent', role: 'Cost Modelling & Financing', icon: '💰', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'heritage-gov', name: 'Heritage Agent', role: 'La Victoria Identity & Culture', icon: '🏛️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'socios-redev', name: 'Socios Governance Agent', role: 'Member Approval & Transparency', icon: '📋', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'CONMEBOL Venue', status: 'connected', type: 'Certification', icon: 'check-circle', detail: '8 items below Copa Libertadores standard' },
        { name: 'Lima Municipality', status: 'connected', type: 'Planning', icon: 'landmark', detail: 'La Victoria district — zoning and permits' },
        { name: 'Financial Model', status: 'connected', type: 'Feasibility', icon: 'database', detail: 'PEN 45M estimate — 3 scenarios modelled' },
        { name: 'Socios Assembly', status: 'syncing', type: 'Governance', icon: 'users', detail: 'Extraordinary assembly — 2/3 majority required' },
      ],
      script: [
        { agentId: 'venue-redev', phase: 'phase1', type: 'warning', delay: 800, content: 'MATUTE GAP ANALYSIS. 8 Copa Libertadores failures: (1) 4,000 standing→seated conversion. (2) Floodlighting 1,200 vs 1,400 lux required. (3) Media 120 vs 200 positions. (4) Hospitality below CONMEBOL minimum. (5) VAR climate control insufficient. (6) Drainage system 25 years old. (7) Visitor dressing room below standard. (8) Disability: 45 vs 100 wheelchair positions (also CONADIS Ley 29973). Total renovation estimate: PEN 45M.' },
        { agentId: 'financial-redev', phase: 'phase1', type: 'analysis', delay: 2500, content: 'THREE SCENARIOS. (1) Self-funded: PEN 45M from reserves + revenue. 5 years. Slashes transfer budget. (2) Bank: PEN 30M loan at ~12%, PEN 15M club. Debt PEN 540K/month for 7 years — exceeds PEN 400K monthly surplus. (3) PPP: Municipality + private investor builds to standard. Club contributes land use rights, shares commercial revenue 15 years. Least cash impact but longest commitment. All require socios 2/3 majority for expenditure above PEN 5M.' },
        { agentId: 'heritage-gov', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — HERITAGE. Matute is La Victoria\'s heart since 1974. (1) External character changes risk community backlash. (2) La Victoria consultation should be conducted — governmentally prudent. (3) PPP risk: private investor controlling commercial spaces for 15 years may dilute working-class identity with corporate hospitality that prices out local fans. My dissent: require Heritage Impact Assessment documenting character preservation, La Victoria consultation, and affordable access guarantees for barrio fans. Matute without La Victoria is not Matute.' },
        { agentId: 'socios-redev', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — SOCIOS REQUIREMENTS. Club statutes: 2/3 majority required. ~40,000 socios, 10% quorum (4,000), need 2,667 votes. Information must be provided 30 days before assembly. Previous votes: 2019 PEN 8M (78% support), 2021 PEN 3M (85%). PEN 45M is unprecedented — largest capital decision in club history. Risk: if rejected, Matute remains below CONMEBOL standard threatening Copa hosting. But forcing a vote without preparation risks trust damage.' },
        { agentId: 'venue-redev', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Matute Protocol: (1) PHASED: Phase 1 (PEN 12M, Yr 1) — lighting, VAR, drainage, visitor rooms = basic Copa cert. Phase 2 (PEN 18M, Yr 2-3) — seating, media, disability. Phase 3 (PEN 15M, Yr 3-5) — hospitality, heritage-sensitive exterior. (2) HERITAGE (accepting dissent): Heritage Impact Assessment. La Victoria consultation. 30% affordable access guarantee enshrined in socios resolution. (3) Each phase separately approved by socios. (4) Information package 45 days before assembly. (5) Every estimate, term, and consultation sealed.' },
        { agentId: 'heritage-gov', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Heritage Assessment and 30% affordable access ensures Matute remains accessible to La Victoria. Phased approach is prudent — each phase proven before next. For CONMEBOL: Phase 1 achieves certification within 12 months. For socios: separate votes per phase respects democracy. Matute is La Victoria\'s cathedral — renovation honours both CONMEBOL standards and community identity.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:al50123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'al60123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CONMEBOL gaps + Feasibility + Heritage + Socios + Phasing)',
        complianceLabel: 'Stadium Redevelopment',
        complianceValue: '3-PHASE PEN 45M PLAN',
        complianceThreshold: 'CONMEBOL venue · Socios 2/3 majority',
        agents: ['Venue Development Agent', 'Financial Agent', 'Heritage Agent', 'Socios Governance Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alianza Lima — Matute Redevelopment',
        guaranteeBody: 'Seals: 8-item CONMEBOL gap analysis, PEN 45M phased plan, Heritage Impact Assessment, La Victoria consultation, socios governance.',
        evidenceChain: 'CONMEBOL gaps → Feasibility → Heritage → Community consultation → Socios info → Assembly → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Matute\'s modernisation — CONMEBOL requirements, heritage protection, financial feasibility, and socios democracy.',
      phaseLabels: ['CONMEBOL Gaps & Feasibility', 'Heritage & Socios Governance', 'Phased Renovation Protocol'],
    },

    // SCENARIO 4 — LA VICTORIA YOUTH SAFEGUARDING
    {
      id: 'youth-la-victoria',
      title: 'Youth Academy — La Victoria Neighbourhood Safeguarding',
      subtitle: 'Working-class community · CNA compliance · Travel safety · Heightened scrutiny post-scandal',
      banner: 'Simulating youth safeguarding in La Victoria — Lima\'s working-class district where Alianza\'s academy operates. Post-conduct scandal, every safeguarding decision carries heightened institutional scrutiny.',
      risk: 'High',
      scenarioNum: 'Youth',
      icon: 'users',
      color: 'text-emerald-400',
      agents: [
        { id: 'youth-victoria', name: 'Youth Safeguarding Agent', role: 'CNA Compliance & La Victoria', icon: '👦', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
        { id: 'community-safety', name: 'Community Safety Agent', role: 'Neighbourhood Risk & Travel', icon: '🛡️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'education-al', name: 'Education Agent', role: 'School Coordination', icon: '📚', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'welfare-al', name: 'Welfare Agent', role: 'Physical & Mental Health', icon: '💚', color: 'text-cyan-400', borderColor: 'border-cyan-500/40', bgColor: 'bg-cyan-500/10' },
      ],
      connectors: [
        { name: 'FPF Youth Registry', status: 'connected', type: 'Registration', icon: 'database', detail: '38 academy players aged 12-17' },
        { name: 'MINEDU Portal', status: 'connected', type: 'Education', icon: 'book-open', detail: 'Enrollment and attendance tracking' },
        { name: 'DEMUNA La Victoria', status: 'connected', type: 'Child Protection', icon: 'shield', detail: 'District safeguarding protocol' },
        { name: 'PNP La Victoria', status: 'syncing', type: 'Safety', icon: 'landmark', detail: 'Youth travel route risk assessment' },
      ],
      script: [
        { agentId: 'youth-victoria', phase: 'phase1', type: 'warning', delay: 800, content: 'YOUTH SAFEGUARDING — LA VICTORIA. 38 minors (12-17): (1) CNA: 36/38 verified consent. 2 single-parent (mother only) — legally sufficient but father documented unknown. (2) 22 of 38 live in La Victoria or adjacent — walk/public transport to Matute. (3) Post-2024 conduct scandal: heightened scrutiny — any safeguarding failure viewed through scandal lens. (4) Staff DBS-equivalent: Peru lacks formal system. CNA requires clean record. 2 coaching staff certificates expired 6 months ago.' },
        { agentId: 'community-safety', phase: 'phase1', type: 'analysis', delay: 2500, content: 'LA VICTORIA RISK. (1) Higher crime rates than Lima average — street crime affects young commuters. (2) Training 4-7pm: players 12-14 travel home after dark in winter. (3) NO documented safe travel plan — players make own way. (4) PNP data: 3 incidents near Matute involving youth in 12 months. (5) Gang activity in adjacent blocks is documented — academy players must traverse these areas. The neighbourhood context that makes Alianza authentic also creates specific safeguarding obligations absent at suburban academies.' },
        { agentId: 'education-al', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — EDUCATION GAPS. (1) 5 of 38 players below 65% school attendance. Training schedule (4-7pm) conflicts with afternoon school sessions at 3 La Victoria colegios. (2) 2 players aged 14 have been offered informal "work" at local markets by family — child labour concern under CNA Art. 22. Academy must document awareness and intervention. (3) My dissent: post-scandal, Alianza must demonstrate PROACTIVE safeguarding. Current school coordination is reactive — no formal MOU with local schools. Without documented education agreements, any attendance failure becomes institutional responsibility.' },
        { agentId: 'welfare-al', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — WELFARE POST-SCANDAL. (1) Psychological impact: academy players are aware of the conduct scandal through media. 12-17 year olds may be confused or distressed. No documented psychological support provided. (2) Female staff in academy (physio, admin) report feeling unsafe following scandal — institutional culture concern. (3) Safeguarding training for all staff was last conducted 2 years ago — must be annual post-scandal. (4) DEMUNA inspection: last inspection 14 months ago — overdue. Given scandal context, voluntary DEMUNA re-inspection demonstrates proactive governance.' },
        { agentId: 'youth-victoria', phase: 'phase3', type: 'proposal', delay: 2000, content: 'La Victoria Youth Protocol: (1) TRAVEL SAFETY: Documented safe routes. Club minibus for 12-14 year olds during winter (dark hours). PNP coordination for high-risk areas. (2) STAFF: Expired certificates renewed immediately. Enhanced safeguarding training for ALL staff (annual). (3) EDUCATION (accepting dissent): Formal MOUs with 3 La Victoria schools. Training schedule adjusted to eliminate conflicts. Child labour intervention for 2 players documented. (4) WELFARE: Post-scandal psychological support for academy. Female staff safety assessment. (5) DEMUNA: Voluntary re-inspection requested. (6) All sealed for FPF, MIMP, MINEDU, DEMUNA.' },
        { agentId: 'education-al', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Formal school MOUs transform reactive approach to proactive. Child labour intervention documented. Post-scandal, Alianza must be the safeguarding model — not despite La Victoria\'s challenges, but because of them. 38 children deserve protection that accounts for their neighbourhood reality. The conduct scandal makes this non-negotiable — governance failure in youth safeguarding would be institutionally catastrophic.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:al70123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'al80123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (CNA + Travel safety + Education MOUs + Post-scandal welfare + DEMUNA)',
        complianceLabel: 'Youth Safeguarding',
        complianceValue: 'POST-SCANDAL ENHANCED PROTOCOL',
        complianceThreshold: 'CNA Ley 27337 · DEMUNA · Ley 30364 context',
        agents: ['Youth Safeguarding Agent', 'Community Safety Agent', 'Education Agent', 'Welfare Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alianza Lima — La Victoria Youth Safeguarding',
        guaranteeBody: 'Seals: 38-minor audit, La Victoria travel safety, school MOUs, child labour intervention, post-scandal welfare, DEMUNA re-inspection.',
        evidenceChain: 'Academy audit → La Victoria risk → Travel plan → School MOUs → Staff training → Welfare → DEMUNA → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents audit youth safeguarding in La Victoria — addressing neighbourhood risks, post-scandal scrutiny, and education obligations for 38 academy minors.',
      phaseLabels: ['Academy Audit & La Victoria Risk', 'Education & Post-Scandal Welfare', 'Enhanced Safeguarding Protocol'],
    },

    // SCENARIO 5 — SUNAT & FINANCIAL COMPLIANCE
    {
      id: 'financial-compliance',
      title: 'SUNAT & CONMEBOL Financial Compliance',
      subtitle: 'Tax governance · Image rights structures · Related-party transactions · Club licensing',
      banner: 'Simulating financial governance for Alianza Lima\'s complex SUNAT landscape — including player image rights company structures, related-party transactions, and CONMEBOL Club Licensing financial indicators.',
      risk: 'High',
      scenarioNum: 'Financial',
      icon: 'landmark',
      color: 'text-cyan-400',
      agents: [
        { id: 'sunat-al', name: 'SUNAT Agent', role: 'Tax Compliance & Image Rights', icon: '🏛️', color: 'text-red-400', borderColor: 'border-red-500/40', bgColor: 'bg-red-500/10' },
        { id: 'conmebol-al', name: 'CONMEBOL Financial Agent', role: 'Club Licensing Indicators', icon: '🏆', color: 'text-blue-400', borderColor: 'border-blue-500/40', bgColor: 'bg-blue-500/10' },
        { id: 'legal-al', name: 'Legal Agent', role: 'Related Parties & Transfer Arm\'s Length', icon: '⚖️', color: 'text-amber-400', borderColor: 'border-amber-500/40', bgColor: 'bg-amber-500/10' },
        { id: 'audit-al', name: 'Audit Agent', role: 'Financial Statements & Socios Reporting', icon: '📊', color: 'text-emerald-400', borderColor: 'border-emerald-500/40', bgColor: 'bg-emerald-500/10' },
      ],
      connectors: [
        { name: 'SUNAT Portal', status: 'connected', type: 'Tax Authority', icon: 'landmark', detail: 'Current tax status: COMPLIANT — no outstanding debts' },
        { name: 'CONMEBOL Licensing', status: 'connected', type: 'Financial Review', icon: 'check-circle', detail: 'All financial indicators: GREEN — Copa Libertadores eligible' },
        { name: 'Player Contracts', status: 'connected', type: 'Compensation', icon: 'database', detail: '28 player contracts — 6 with image rights company structures' },
        { name: 'Socios Financial', status: 'syncing', type: 'Reporting', icon: 'users', detail: 'Annual financial statement publication — socios assembly review' },
      ],
      script: [
        { agentId: 'sunat-al', phase: 'phase1', type: 'warning', delay: 800, content: 'SUNAT COMPLIANCE REVIEW. (1) 6 players have personal image rights companies (SAC structures). Payments from Alianza to these companies must be at arm\'s length — SUNAT Transfer Pricing rules (Art. 32-A, Ley del Impuesto a la Renta). If SUNAT determines payments are above market rate: disallowed deductions + 50% penalty. (2) Combined image rights payments: PEN 3.8M/year. Industry benchmark analysis needed. (3) Foreign player payments: 4 players paid in USD. Withholding obligations for non-domiciled players: 30% on Peru-source income. (4) AFP/ONP: all 28 players current. Administrative staff: 2 delayed contributions (PEN 8K). (5) ESSALUD: current for all staff.' },
        { agentId: 'conmebol-al', phase: 'phase1', type: 'analysis', delay: 2500, content: 'CONMEBOL LICENSING — GREEN. All indicators compliant: (1) No overdue payables to tax authorities. (2) Wage payments: 12 months current. (3) Transfer fees: all paid per schedule. (4) Financial statements: audited, submitted on time. However: the image rights structures create REPORTING complexity. CONMEBOL requires disclosure of all related-party transactions. If the SAC companies are owned by players under contract, every payment is a related-party transaction requiring separate disclosure. Currently: 4 of 6 disclosed. 2 recently established companies have not been flagged as related parties. This creates a disclosure gap that could be flagged in CONMEBOL\'s next review.' },
        { agentId: 'legal-al', phase: 'phase2', type: 'dissent', delay: 2000, content: 'DISSENT — RELATED-PARTY RISK. The 2 undisclosed player SAC companies create dual risk: (1) SUNAT: if SUNAT investigates and finds undisclosed related-party payments, it triggers full transfer pricing audit of ALL image rights payments — not just the 2. Penalty exposure: PEN 1.9M (50% of PEN 3.8M). (2) CONMEBOL: non-disclosure of related-party transactions is a licensing violation. Could result in conditional licence or, at worst, competition ban. My dissent: the club\'s legal department should have flagged these immediately. The gap suggests insufficient KYC on player company structures. Every player contract with an image rights component must have documented company ownership verification BEFORE first payment.' },
        { agentId: 'audit-al', phase: 'phase2', type: 'flag', delay: 2500, content: 'FLAG — AUDIT IMPLICATIONS. (1) Annual financial statements: if the 2 undisclosed related-party transactions are material (combined PEN 900K), the auditor\'s opinion may be qualified. A qualified opinion weakens CONMEBOL licensing position. (2) Socios reporting: members are entitled to accurate financial statements. Undisclosed related parties undermine socios trust. (3) The image rights structures are LEGAL — many Peruvian clubs use them. But governance requires documentation. The issue is not the structure; it\'s the failure to document ownership and disclose relationships.' },
        { agentId: 'sunat-al', phase: 'phase3', type: 'proposal', delay: 2000, content: 'Financial Compliance Protocol: (1) IMMEDIATE: Disclose 2 missing SAC companies to CONMEBOL as related parties. Voluntary disclosure before next review prevents sanction. (2) TRANSFER PRICING: Commission independent benchmarking study for all 6 image rights payments. If above market: renegotiate or document business justification. (3) KYC: Every player company ownership verified and documented before payment. New policy: no image rights payments without completed KYC. (4) AFP: PEN 8K administrative gap resolved this week. (5) CONMEBOL: Updated related-party disclosure submitted. (6) SOCIOS: Financial transparency enhanced with image rights note in annual statements. (7) All compliance actions sealed.' },
        { agentId: 'legal-al', phase: 'phase3', type: 'resolution', delay: 2500, content: 'DISSENT WITHDRAWN. Voluntary CONMEBOL disclosure prevents the gap from becoming a violation. Independent benchmarking study protects against SUNAT transfer pricing challenge. KYC policy prevents future disclosure failures. For SUNAT: proactive compliance posture documented. For CONMEBOL: GREEN indicator maintained with enhanced disclosure. For socios: financial governance that survives scrutiny. Alianza\'s financial position is strong — this protocol keeps it that way.' },
      ],
      receiptTemplate: {
        hash: 'SHA-256:al90123456789abcdef0123456789abcdef0123456789abcdef012345678abcde',
        merkleRoot: 'ala0123456789abcdef0123456789abcdef0123456789abcdef012345678abcdef',
        merkleLabel: 'Merkle Tree Root (SUNAT + Image rights + Related parties + CONMEBOL licensing + KYC)',
        complianceLabel: 'Financial Compliance',
        complianceValue: '2 RELATED-PARTY DISCLOSURES PENDING',
        complianceThreshold: 'SUNAT Art. 32-A · CONMEBOL licensing',
        agents: ['SUNAT Agent', 'CONMEBOL Financial Agent', 'Legal Agent', 'Audit Agent'],
        dissents: 1,
        dissentResolved: true,
        guaranteeTitle: 'Alianza Lima — Financial Compliance Governance',
        guaranteeBody: 'Seals: image rights benchmarking, related-party disclosure, KYC policy, CONMEBOL licensing indicators, SUNAT transfer pricing defence, socios financial transparency.',
        evidenceChain: 'Image rights audit → SAC ownership → Transfer pricing → CONMEBOL disclosure → KYC policy → AFP resolution → Socios reporting → ML-DSA-65 seal',
      },
      idleTitle: 'Ready to Deliberate',
      idleDesc: '4 AI agents govern Alianza Lima\'s financial compliance — image rights structures, SUNAT transfer pricing, CONMEBOL licensing, and socios transparency.',
      phaseLabels: ['Tax & Licensing Review', 'Related-Party & Audit Risk', 'Compliance Protocol'],
    },
  ],

        complianceScore: 91,
        timelineEvents: [
          {
            timestamp: new Date(Date.now() - 180000).toISOString(),
            type: 'analysis',
            title: 'Player Conduct Scandal — Disciplinary Governance & Criminal Proceedings Analysis Started',
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
