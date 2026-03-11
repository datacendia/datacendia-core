// =============================================================================
// FEPCMAC DEMO SEED SCRIPT
// Creates a Peruvian microfinance institution demo for FEPCMAC / Sarmiento call
// Run with: npx ts-node prisma/seed-fepcmac-demo.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Demo Organization
const DEMO_ORG_ID = 'demo-cmac-cusco';
const DEMO_PASSWORD = 'CmacDemo2026!';

const USER_IDS = {
  gerente: 'user-gerente-carlos',
  riesgos: 'user-riesgos-jorge',
  creditos: 'user-creditos-maria',
  cumplimiento: 'user-cumplimiento-ana',
  tecnologia: 'user-tecnologia-luis',
};

function randomDate(daysAgo: number): Date {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// =============================================================================
// ORGANIZATION — CMAC Cusco
// =============================================================================

async function seedOrganization() {
  console.log('Creando organización...');

  const existing = await prisma.organizations.findUnique({
    where: { id: DEMO_ORG_ID }
  });

  if (existing) {
    console.log('  ↳ Organización existe');
    return;
  }

  await prisma.organizations.create({
    data: {
      id: DEMO_ORG_ID,
      name: 'CMAC Cusco S.A.',
      slug: 'cmac-cusco',
      industry: 'Financial Services',
      company_size: '501-1000',
      settings: {
        timezone: 'America/Lima',
        currency: 'PEN',
        fiscalYearStart: 'January',
        regulator: 'SBS',
        country: 'PE',
        language: 'es',
      },
      updated_at: new Date()
    }
  });

  console.log('  ✓ CMAC Cusco creada');
}

// =============================================================================
// USERS — Caja Roles
// =============================================================================

async function seedUsers() {
  console.log('Creando usuarios...');

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);

  const users = [
    { id: USER_IDS.gerente, email: 'carlos.quispe@cmac-cusco.demo', name: 'Carlos Quispe Huamán', role: 'ADMIN' as const },
    { id: USER_IDS.riesgos, email: 'jorge.mendoza@cmac-cusco.demo', name: 'Jorge Mendoza Vargas', role: 'ADMIN' as const },
    { id: USER_IDS.creditos, email: 'maria.flores@cmac-cusco.demo', name: 'María Flores Condori', role: 'ANALYST' as const },
    { id: USER_IDS.cumplimiento, email: 'ana.huaman@cmac-cusco.demo', name: 'Ana Huamán Soto', role: 'ADMIN' as const },
    { id: USER_IDS.tecnologia, email: 'luis.paredes@cmac-cusco.demo', name: 'Luis Paredes Ramos', role: 'ADMIN' as const },
  ];

  for (const u of users) {
    const existing = await prisma.users.findUnique({ where: { email: u.email } });
    if (!existing) {
      await prisma.users.create({
        data: {
          id: u.id,
          organization_id: DEMO_ORG_ID,
          email: u.email,
          name: u.name,
          password_hash: passwordHash,
          role: u.role,
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
          preferences: { theme: 'dark', notifications: true, language: 'es' },
          updated_at: new Date()
        }
      });
    }
  }

  console.log('  ✓ Usuarios creados');
}

// =============================================================================
// COUNCIL AGENTS — Peruvian Microfinance Roles
// =============================================================================

async function seedAgents() {
  console.log('Creando agentes del Council...');

  const agents = [
    {
      code: 'RIESGO_CREDITICIO',
      name: 'Analista de Riesgo Crediticio',
      role: 'risk',
      desc: 'Especialista en evaluación de riesgo crediticio, modelos de scoring, y clasificación de deudores según normativa SBS (Normal/CPP/Deficiente/Dudoso/Pérdida)',
    },
    {
      code: 'CUMPLIMIENTO_SBS',
      name: 'Oficial de Cumplimiento SBS',
      role: 'compliance',
      desc: 'Responsable de cumplimiento regulatorio ante la SBS, DS 115-2025-PCM, ISO/IEC 42001, y Ley 31814. Experto en reportes R01/R02/R04/R05/R12',
    },
    {
      code: 'MICROFINANZAS',
      name: 'Asesor de Microfinanzas',
      role: 'strategist',
      desc: 'Especialista en microcréditos, créditos agropecuarios, y productos financieros para poblaciones no bancarizadas del Perú rural',
    },
    {
      code: 'GUARDIAN_ETICA',
      name: 'Guardián de Ética',
      role: 'ethics',
      desc: 'Vigila equidad en decisiones crediticias, previene sesgos contra poblaciones vulnerables, y asegura inclusión financiera responsable',
    },
    {
      code: 'LAFT',
      name: 'Oficial LAFT',
      role: 'analyst',
      desc: 'Oficial de Prevención de Lavado de Activos y Financiamiento del Terrorismo. Experto en Resolución SBS N° 2660-2015 y reportes UIF',
    },
    {
      code: 'ADVERSARIO',
      name: 'Agente Adversarial',
      role: 'advocate',
      desc: 'Desafía todas las recomendaciones, busca debilidades en el análisis, y presenta escenarios de riesgo que otros agentes omiten',
    },
  ];

  for (const a of agents) {
    const existing = await prisma.agents.findUnique({ where: { code: a.code } });
    if (!existing) {
      await prisma.agents.create({
        data: {
          id: `agent-${a.code.toLowerCase()}`,
          code: a.code,
          name: a.name,
          role: a.role,
          description: a.desc,
          system_prompt: `Eres ${a.name}, un asesor de IA especializado en el sistema de Cajas Municipales del Perú. ${a.desc}. Respondes en español y citas regulaciones peruanas específicas cuando es relevante.`,
          capabilities: ['análisis', 'recomendación', 'evaluación regulatoria'],
          constraints: ['Debe ser objetivo', 'Debe citar normativa SBS aplicable', 'Debe considerar impacto en inclusión financiera'],
          model_config: { model: 'gpt-4o', temperature: 0.7 },
          is_active: true,
          updated_at: new Date()
        }
      });
    }
  }

  console.log('  ✓ Agentes creados');
}

// =============================================================================
// DELIBERATIONS — Real Caja Decision Scenarios
// =============================================================================

async function seedDeliberations() {
  console.log('Creando deliberaciones...');

  const count = await prisma.deliberations.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Deliberaciones existen');
    return;
  }

  const deliberations = [
    {
      question: '¿Debemos aprobar una línea de crédito agropecuario de S/180,000 para la Cooperativa Agrícola Valle Sagrado para financiar la campaña de quinua 2026, considerando la volatilidad del precio internacional y el historial de la cooperativa?',
      status: 'COMPLETED' as const,
      confidence: 0.84,
      decision: {
        recommendation: 'Aprobar con condiciones — desembolso en dos tramos vinculados a hitos de producción',
        consensus: 'MAJORITY',
        dissent: 'Guardián de Ética recomienda incluir cláusula de acompañamiento técnico agrícola para mitigar riesgo de dependencia del pequeño agricultor. El Agente Adversarial advierte que un solo evento climático adverso podría convertir el crédito en deficiente.',
        regulatory_notes: 'Conforme a Resolución SBS N° 11356-2008 Art. 17 — créditos agropecuarios. Provisión inicial: 1% (categoría Normal)',
        evidence_hash: hash('deliberation-valle-sagrado-2026'),
        agents_participated: ['RIESGO_CREDITICIO', 'CUMPLIMIENTO_SBS', 'MICROFINANZAS', 'GUARDIAN_ETICA', 'ADVERSARIO'],
      },
    },
    {
      question: '¿Cuál es la estrategia óptima para reducir la tasa de morosidad del 5.2% al objetivo del 4.5% en el portafolio de créditos MYPE sin contraer el volumen de colocaciones?',
      status: 'COMPLETED' as const,
      confidence: 0.79,
      decision: {
        recommendation: 'Implementar scoring predictivo con variables alternativas (comportamiento transaccional, historial de pagos de servicios) para mejorar la selección sin excluir segmentos',
        consensus: 'UNANIMOUS',
        dissent: null,
        regulatory_notes: 'Alineado con Resolución SBS N° 11356-2008 sobre evaluación del deudor. El scoring alternativo debe documentarse según DS 115-2025-PCM.',
        evidence_hash: hash('deliberation-morosidad-mype-2026'),
        agents_participated: ['RIESGO_CREDITICIO', 'MICROFINANZAS', 'CUMPLIMIENTO_SBS'],
      },
    },
    {
      question: 'La UIF ha solicitado información sobre 3 operaciones inusuales detectadas en la agencia de Quillabamba. ¿Cuál es el protocolo de respuesta y qué documentación debemos generar?',
      status: 'COMPLETED' as const,
      confidence: 0.92,
      decision: {
        recommendation: 'Activar protocolo LAFT completo: (1) Congelar cuentas involucradas, (2) Generar ROS a UIF en plazo de 24 horas, (3) Documentar cadena de análisis con evidencia criptográfica',
        consensus: 'UNANIMOUS',
        dissent: null,
        regulatory_notes: 'Conforme a Resolución SBS N° 2660-2015 Arts. 30-35 — Sistema de Prevención LAFT. Reporte de Operación Sospechosa (ROS) obligatorio.',
        evidence_hash: hash('deliberation-uif-quillabamba-2026'),
        agents_participated: ['LAFT', 'CUMPLIMIENTO_SBS', 'RIESGO_CREDITICIO'],
      },
    },
    {
      question: '¿Debemos implementar un modelo de scoring alternativo basado en datos transaccionales para atender al 23% de solicitantes que no tienen historial crediticio en la Central de Riesgos SBS?',
      status: 'COMPLETED' as const,
      confidence: 0.88,
      decision: {
        recommendation: 'Implementar scoring alternativo como piloto en 2 agencias rurales (Calca y Urubamba) durante 90 días, con límite de crédito máximo de S/15,000 por operación',
        consensus: 'MAJORITY',
        dissent: 'Guardián de Ética apoya fuertemente la inclusión financiera pero advierte que el modelo debe ser auditado trimestralmente para detectar sesgos contra comunidades indígenas. El Agente Adversarial señala que sin historial crediticio la tasa de default esperada podría superar el 8%.',
        regulatory_notes: 'Requiere documentación completa según DS 115-2025-PCM para uso de IA en decisiones de alto riesgo (Ley 31814). La SBS debe ser notificada del piloto.',
        evidence_hash: hash('deliberation-scoring-alternativo-2026'),
        agents_participated: ['RIESGO_CREDITICIO', 'MICROFINANZAS', 'GUARDIAN_ETICA', 'ADVERSARIO', 'CUMPLIMIENTO_SBS'],
      },
    },
  ];

  for (const d of deliberations) {
    await prisma.deliberations.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        question: d.question,
        config: { agents: d.decision.agents_participated },
        status: d.status,
        current_phase: null,
        progress: 100,
        decision: d.decision,
        confidence: d.confidence,
        started_at: randomDate(30),
        completed_at: randomDate(7),
        created_at: randomDate(60)
      }
    });
  }

  console.log('  ✓ Deliberaciones creadas');
}

// =============================================================================
// DECISIONS — Caja Credit Decisions
// =============================================================================

async function seedDecisions() {
  console.log('Creando decisiones...');

  const count = await prisma.decisions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Decisiones existen');
    return;
  }

  const decisions = [
    { title: 'Crédito Agropecuario Valle Sagrado', desc: 'Línea de crédito S/180,000 para campaña quinua 2026', status: 'APPROVED' as const, priority: 'HIGH' as const, category: 'Créditos', dept: 'Créditos Agropecuarios', budget: 180000 },
    { title: 'Reducción Morosidad MYPE', desc: 'Estrategia para reducir morosidad de 5.2% a 4.5%', status: 'IMPLEMENTED' as const, priority: 'CRITICAL' as const, category: 'Riesgos', dept: 'Gestión de Riesgos', budget: 0 },
    { title: 'Respuesta UIF Quillabamba', desc: 'Protocolo de respuesta ante solicitud UIF por operaciones inusuales', status: 'APPROVED' as const, priority: 'CRITICAL' as const, category: 'Cumplimiento', dept: 'Cumplimiento', budget: 0 },
    { title: 'Piloto Scoring Alternativo', desc: 'Modelo de scoring para no bancarizados en agencias rurales', status: 'PENDING' as const, priority: 'HIGH' as const, category: 'Innovación', dept: 'Tecnología', budget: 45000 },
    { title: 'Apertura Agencia Sicuani', desc: 'Evaluación de apertura de nueva agencia en Sicuani', status: 'PENDING' as const, priority: 'MEDIUM' as const, category: 'Expansión', dept: 'Planificación', budget: 350000 },
    { title: 'Migración Core Bancario', desc: 'Evaluación de migración de BANTOTAL a versión cloud', status: 'BLOCKED' as const, priority: 'HIGH' as const, category: 'Tecnología', dept: 'Tecnología', budget: 800000 },
    { title: 'Programa Educación Financiera', desc: 'Programa de educación financiera para comunidades rurales de Cusco', status: 'APPROVED' as const, priority: 'MEDIUM' as const, category: 'RSE', dept: 'Responsabilidad Social', budget: 25000 },
  ];

  for (const d of decisions) {
    const decisionId = randomUUID();
    await prisma.decisions.create({
      data: {
        id: decisionId,
        organization_id: DEMO_ORG_ID,
        user_id: USER_IDS.gerente,
        title: d.title,
        description: d.desc,
        category: d.category,
        priority: d.priority,
        status: d.status,
        department: d.dept,
        owner_name: 'Carlos Quispe Huamán',
        owner_email: 'carlos.quispe@cmac-cusco.demo',
        budget: d.budget,
        timeframe: 'Q1 2026',
        stakeholders: ['Directorio', 'Gerencia', 'Cumplimiento'],
        created_at: randomDate(90),
        updated_at: new Date()
      }
    });

    await prisma.decision_activities.create({
      data: {
        id: randomUUID(),
        decision_id: decisionId,
        actor: 'Carlos Quispe Huamán',
        action: 'created',
        details: { note: 'Decisión creada y registrada en sistema de gobernanza' },
        timestamp: randomDate(90)
      }
    });
  }

  console.log('  ✓ Decisiones creadas');
}

// =============================================================================
// DATA SOURCES — Peruvian Financial Systems
// =============================================================================

async function seedDataSources() {
  console.log('Creando fuentes de datos...');

  const count = await prisma.data_sources.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Fuentes de datos existen');
    return;
  }

  const sources = [
    { name: 'BANTOTAL Core Bancario', type: 'POSTGRESQL' as const, status: 'CONNECTED' as const },
    { name: 'Central de Riesgos SBS', type: 'API' as const, status: 'CONNECTED' as const },
    { name: 'RENIEC (Identidad)', type: 'API' as const, status: 'CONNECTED' as const },
    { name: 'SUNAT (Tributario)', type: 'API' as const, status: 'CONNECTED' as const },
    { name: 'BCRP (Banco Central)', type: 'API' as const, status: 'CONNECTED' as const },
    { name: 'UIF Perú', type: 'API' as const, status: 'CONNECTED' as const },
    { name: 'FEPCMAC Federación', type: 'API' as const, status: 'SYNCING' as const },
  ];

  for (const s of sources) {
    await prisma.data_sources.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: s.name,
        type: s.type,
        config: { autoSync: true, syncInterval: '1h' },
        credentials: {},
        status: s.status,
        last_sync_at: s.status === 'CONNECTED' ? randomDate(1) : null,
        last_sync_status: s.status === 'CONNECTED' ? 'success' : null,
        sync_schedule: '0 * * * *',
        metadata: { recordCount: Math.floor(Math.random() * 500000) },
        updated_at: new Date()
      }
    });
  }

  console.log('  ✓ Fuentes de datos creadas');
}

// =============================================================================
// METRICS — SBS-Standard KPIs
// =============================================================================

async function seedMetrics() {
  console.log('Creando métricas...');

  const count = await prisma.metric_definitions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Métricas existen');
    return;
  }

  const metrics = [
    { code: 'MOROSIDAD', name: 'Tasa de Morosidad', category: 'Riesgos', unit: '%', format: 'percentage' },
    { code: 'CAPITAL_REG', name: 'Ratio de Capital Regulatorio', category: 'Capital', unit: '%', format: 'percentage' },
    { code: 'PROVISIONES', name: 'Cobertura de Provisiones', category: 'Riesgos', unit: '%', format: 'percentage' },
    { code: 'SPREAD', name: 'Spread Financiero', category: 'Rentabilidad', unit: '%', format: 'percentage' },
    { code: 'ROE', name: 'Rentabilidad sobre Patrimonio', category: 'Rentabilidad', unit: '%', format: 'percentage' },
    { code: 'COLOCACIONES', name: 'Cartera de Colocaciones', category: 'Comercial', unit: 'PEN', format: 'currency' },
    { code: 'CAPTACIONES', name: 'Depósitos del Público', category: 'Pasivos', unit: 'PEN', format: 'currency' },
    { code: 'CLIENTES', name: 'Número de Clientes', category: 'Comercial', unit: '', format: 'number' },
  ];

  for (const m of metrics) {
    const metricId = randomUUID();
    await prisma.metric_definitions.create({
      data: {
        id: metricId,
        organization_id: DEMO_ORG_ID,
        owner_id: USER_IDS.riesgos,
        code: m.code,
        name: m.name,
        description: `${m.name} — indicador SBS`,
        category: m.category,
        unit: m.unit,
        formula: { type: 'direct', source: 'bantotal' },
        thresholds: { warning: 80, critical: 95 },
        updated_at: new Date()
      }
    });

    // 12 months of history
    for (let month = 0; month < 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);

      let value = 0;
      switch (m.code) {
        case 'MOROSIDAD': value = 5.2 - month * 0.05 + Math.random() * 0.3; break;
        case 'CAPITAL_REG': value = 14.8 + Math.random() * 0.5; break;
        case 'PROVISIONES': value = 145 + Math.random() * 10; break;
        case 'SPREAD': value = 18.5 + Math.random() * 1.5; break;
        case 'ROE': value = 12.3 + Math.random() * 2; break;
        case 'COLOCACIONES': value = 2800000000 + month * 50000000; break;
        case 'CAPTACIONES': value = 3200000000 + month * 40000000; break;
        case 'CLIENTES': value = 185000 + month * 2000; break;
      }

      await prisma.metric_values.create({
        data: {
          id: randomUUID(),
          metric_id: metricId,
          value: value,
          timestamp: date
        }
      });
    }
  }

  console.log('  ✓ Métricas creadas');
}

// =============================================================================
// AUDIT LOGS — SBS Event Types
// =============================================================================

async function seedAuditLogs() {
  console.log('Creando registros de auditoría...');

  const count = await prisma.audit_logs.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Registros de auditoría existen');
    return;
  }

  const events = [
    { action: 'reporte_sbs.generado', resource: 'compliance', actor: 'Ana Huamán Soto' },
    { action: 'alerta_laft.creada', resource: 'laft', actor: 'Sistema LAFT' },
    { action: 'scoring.ejecutado', resource: 'credit', actor: 'María Flores Condori' },
    { action: 'provision.calculada', resource: 'risk', actor: 'Sistema de Provisiones' },
    { action: 'credito.aprobado', resource: 'credit', actor: 'Carlos Quispe Huamán' },
    { action: 'deliberacion.iniciada', resource: 'council', actor: 'Council System' },
    { action: 'reporte_uif.enviado', resource: 'compliance', actor: 'Ana Huamán Soto' },
    { action: 'usuario.login', resource: 'auth', actor: 'Jorge Mendoza Vargas' },
    { action: 'politica_ia.actualizada', resource: 'governance', actor: 'Luis Paredes Ramos' },
    { action: 'backup_bantotal.completado', resource: 'operations', actor: 'Sistema' },
  ];

  for (let i = 0; i < 50; i++) {
    const event = events[i % events.length];
    await prisma.audit_logs.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        user_id: USER_IDS.cumplimiento,
        action: event.action,
        resource_type: event.resource,
        resource_id: randomUUID(),
        details: {
          triggered_by: event.actor,
          evidence_hash: hash(`audit-${i}-${Date.now()}`),
          regulatory_ref: 'DS 115-2025-PCM / ISO 42001',
        },
        ip_address: '192.168.1.' + Math.floor(Math.random() * 255),
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        created_at: randomDate(30)
      }
    });
  }

  console.log('  ✓ Registros de auditoría creados');
}

// =============================================================================
// ALERTS — SBS/Compliance Alerts
// =============================================================================

async function seedAlerts() {
  console.log('Creando alertas...');

  const count = await prisma.alerts.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Alertas existen');
    return;
  }

  const alerts = [
    { severity: 'CRITICAL' as const, title: 'Operación sospechosa detectada — Agencia Quillabamba', source: 'LAFT', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'Morosidad MYPE superó umbral del 5%', source: 'Riesgos', status: 'ACKNOWLEDGED' as const },
    { severity: 'CRITICAL' as const, title: 'Plazo reporte R04 vence en 48 horas', source: 'Cumplimiento SBS', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'Ratio de capital regulatorio cerca del mínimo (10.5%)', source: 'Capital', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'Reporte R01 enviado exitosamente a SBS', source: 'Cumplimiento', status: 'RESOLVED' as const },
    { severity: 'WARNING' as const, title: 'Provisión genérica insuficiente para cartera agropecuaria', source: 'Provisiones', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'Backup BANTOTAL completado', source: 'Operaciones', status: 'RESOLVED' as const },
  ];

  for (const a of alerts) {
    await prisma.alerts.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        severity: a.severity,
        status: a.status,
        title: a.title,
        message: `${a.title} — requiere atención`,
        source: a.source,
        metadata: { triggered_by: 'sistema', regulatory_ref: 'SBS' },
        created_at: randomDate(7)
      }
    });
  }

  console.log('  ✓ Alertas creadas');
}

// =============================================================================
// TEAMS
// =============================================================================

async function seedTeams() {
  console.log('Creando equipos...');

  const count = await prisma.teams.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Equipos existen');
    return;
  }

  const teams = [
    { name: 'Gerencia General', desc: 'Dirección ejecutiva de la caja' },
    { name: 'Gestión de Riesgos', desc: 'Riesgo crediticio, operativo y de mercado' },
    { name: 'Créditos MYPE', desc: 'Créditos a micro y pequeña empresa' },
    { name: 'Cumplimiento Regulatorio', desc: 'Cumplimiento SBS, LAFT, y normativa vigente' },
    { name: 'Tecnología e Innovación', desc: 'Infraestructura tecnológica y transformación digital' },
  ];

  for (const t of teams) {
    await prisma.teams.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: t.name,
        description: t.desc,
        updated_at: new Date()
      }
    });
  }

  console.log('  ✓ Equipos creados');
}

// =============================================================================
// WORKFLOWS — Caja Regulatory Processes
// =============================================================================

async function seedWorkflows() {
  console.log('Creando workflows...');

  const count = await prisma.workflows.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Workflows existen');
    return;
  }

  const workflows = [
    { name: 'Reporte Regulatorio SBS (R01/R02/R04/R05/R12)', desc: 'Generación automatizada de reportes regulatorios SBS', trigger: 'schedule.monthly', status: 'ACTIVE' as const },
    { name: 'Detección LAFT', desc: 'Detección de operaciones sospechosas según Resolución SBS N° 2660-2015', trigger: 'transaction.flagged', status: 'ACTIVE' as const },
    { name: 'Cálculo de Provisiones', desc: 'Cálculo automático de provisiones por clasificación de deudores SBS', trigger: 'schedule.daily', status: 'ACTIVE' as const },
    { name: 'Evaluación Crediticia AI', desc: 'Scoring crediticio asistido por IA con registro DS 115-2025-PCM', trigger: 'credit.requested', status: 'ACTIVE' as const },
    { name: 'Alerta de Morosidad', desc: 'Alerta automática cuando morosidad supera umbrales definidos', trigger: 'metric.threshold', status: 'ACTIVE' as const },
  ];

  for (const w of workflows) {
    await prisma.workflows.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: w.name,
        description: w.desc,
        category: 'regulatory',
        trigger: { type: w.trigger, enabled: true },
        definition: {
          nodes: [
            { id: 'start', type: 'trigger', next: 'action1' },
            { id: 'action1', type: 'action', config: { type: 'notify' }, next: 'end' },
            { id: 'end', type: 'end' }
          ]
        },
        status: w.status,
        updated_at: new Date()
      }
    });
  }

  console.log('  ✓ Workflows creados');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         DATACENDIA — DEMO FEPCMAC / CMAC CUSCO           ║');
  console.log('║         Sembrando datos de microfinanzas peruanas         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    await seedOrganization();
    await seedUsers();
    await seedAgents();
    await seedTeams();
    await seedAlerts();
    await seedDecisions();
    await seedDeliberations();
    await seedDataSources();
    await seedMetrics();
    await seedAuditLogs();
    await seedWorkflows();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ DEMO FEPCMAC CREADA EXITOSAMENTE                      ║');
    console.log('║                                                            ║');
    console.log('║  Organización: CMAC Cusco S.A.                            ║');
    console.log('║  Usuarios: 5 (Gerente, Riesgos, Créditos, Cumplimiento,  ║');
    console.log('║            Tecnología)                                     ║');
    console.log('║  Agentes: 6 (Riesgo, Cumplimiento, Microfinanzas,        ║');
    console.log('║           Ética, LAFT, Adversarial)                       ║');
    console.log('║  Deliberaciones: 4 (con disidencia y evidencia crypto)    ║');
    console.log('║                                                            ║');
    console.log('║  Login: carlos.quispe@cmac-cusco.demo                     ║');
    console.log(`║  Password: ${DEMO_PASSWORD}                              ║`);
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Seed falló:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
