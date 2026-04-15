// =============================================================================
// DATACENDIA — MULTI-INDUSTRY DEMO SEED
// =============================================================================
// Creates 7 realistic industry demo organisations + 1 tutorial org.
//
// ISOLATION GUARANTEE
//   All demo org IDs / slugs carry a "demo-" prefix (or "tutorial-").
//   Real user organisations are created at sign-up with UUID IDs and
//   user-chosen slugs, so there is zero risk of collision.
//
// DEMO SETTINGS FLAG
//   Each org has settings.isDemo = true so the UI can badge them
//   and exclude them from "real" aggregations.
//
// USAGE
//   npx ts-node --project tsconfig.json prisma/seed-industry-demos.ts
//   (or via: npm run seed:demos  — see package.json)
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 86_400_000);
}

function hashPw(pw: string): string {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

// Generate 30 days of daily metric values with a realistic trend/noise
function generateMetricSeries(
  metricId: string,
  baseValue: number,
  dailyDrift: number,   // e.g. +0.005 = 0.5% growth per day
  noisePct: number,     // e.g. 0.03 = ±3% random noise
  days = 30
): Array<{ id: string; metric_id: string; value: number; dimensions: object; timestamp: Date; created_at: Date }> {
  const rows = [];
  for (let d = days; d >= 0; d--) {
    // deterministic noise via day-index seed
    const seed = (metricId.charCodeAt(0) + d) % 97;
    const noise = ((seed - 48) / 48) * noisePct; // range roughly -noisePct..+noisePct
    const trend = 1 + dailyDrift * (days - d);
    const value = Math.max(0, baseValue * trend * (1 + noise));
    rows.push({
      id: randomUUID(),
      metric_id: metricId,
      value: Math.round(value * 100) / 100,
      dimensions: {},
      timestamp: daysAgo(d),
      created_at: daysAgo(d),
    });
  }
  return rows;
}

const DEMO_PW = hashPw('DemoAccess2026!');

// ---------------------------------------------------------------------------
// SHARED: upsert helpers
// ---------------------------------------------------------------------------

async function upsertOrg(data: {
  id: string;
  name: string;
  slug: string;
  industry: string;
  company_size: string;
  settings: object;
}) {
  const existing = await prisma.organizations.findUnique({ where: { slug: data.slug } });
  if (existing) {
    console.log(`  ↳ org already exists: ${data.name}`);
    return existing;
  }
  return prisma.organizations.create({
    data: { ...data, settings: data.settings as any, updated_at: new Date() },
  });
}

async function upsertUser(data: {
  id: string;
  organization_id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'ANALYST' | 'VIEWER';
}) {
  const existing = await prisma.users.findUnique({ where: { email: data.email } });
  if (existing) return existing;
  return prisma.users.create({
    data: {
      id: data.id,
      organization_id: data.organization_id,
      email: data.email,
      name: data.name,
      password_hash: DEMO_PW,
      role: data.role,
      status: 'ACTIVE',
      email_verified: true,
      email_verified_at: daysAgo(60),
      preferences: { theme: 'dark', notifications: true },
      updated_at: new Date(),
    },
  });
}

async function seedMetrics(
  orgId: string,
  ownerId: string,
  metrics: Array<{
    id: string;
    name: string;
    code: string;
    unit: string;
    category: string;
    baseValue: number;
    dailyDrift: number;
    noisePct: number;
  }>
) {
  for (const m of metrics) {
    const existing = await prisma.metric_definitions.findUnique({
      where: { organization_id_code: { organization_id: orgId, code: m.code } },
    });
    let defId = m.id;
    if (!existing) {
      await prisma.metric_definitions.create({
        data: {
          id: defId,
          organization_id: orgId,
          name: m.name,
          code: m.code,
          unit: m.unit,
          category: m.category,
          formula: { type: 'expression', expression: m.code } as any,
          thresholds: {} as any,
          owner_id: ownerId,
          updated_at: new Date(),
        },
      });
    } else {
      defId = existing.id;
    }

    // Only insert values if none exist yet
    const valCount = await prisma.metric_values.count({ where: { metric_id: defId } });
    if (valCount === 0) {
      const rows = generateMetricSeries(defId, m.baseValue, m.dailyDrift, m.noisePct);
      await prisma.metric_values.createMany({ data: rows });
    }
  }
}

async function seedDecisions(
  orgId: string,
  userId: string,
  decisions: Array<{
    title: string;
    description: string;
    category: string;
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    status: 'PENDING' | 'APPROVED' | 'IMPLEMENTED' | 'BLOCKED' | 'DEFERRED';
    department: string;
    budget?: number;
    timeframe?: string;
  }>
) {
  const count = await prisma.decisions.count({ where: { organization_id: orgId } });
  if (count > 0) { console.log('  ↳ decisions exist'); return; }

  for (const d of decisions) {
    await prisma.decisions.create({
      data: {
        id: randomUUID(),
        organization_id: orgId,
        user_id: userId,
        title: d.title,
        description: d.description,
        category: d.category,
        priority: d.priority,
        status: d.status,
        department: d.department,
        budget: d.budget ?? null,
        timeframe: d.timeframe ?? null,
        updated_at: daysAgo(Math.floor(Math.random() * 25) + 1),
      },
    });
  }
}

async function seedAlerts(
  orgId: string,
  alerts: Array<{
    severity: 'CRITICAL' | 'WARNING' | 'INFO';
    status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';
    title: string;
    source: string;
  }>
) {
  const count = await prisma.alerts.count({ where: { organization_id: orgId } });
  if (count > 0) { console.log('  ↳ alerts exist'); return; }

  for (const a of alerts) {
    await prisma.alerts.create({
      data: {
        id: randomUUID(),
        organization_id: orgId,
        severity: a.severity,
        status: a.status,
        title: a.title,
        message: `${a.title} — requires attention.`,
        source: a.source,
        metadata: { triggered_by: 'system', demo: true } as any,
        created_at: daysAgo(Math.floor(Math.random() * 14)),
      },
    });
  }
}

async function seedHealthScore(
  orgId: string,
  score: { overall: number; data_score: number; ops_score: number; security_score: number; people_score: number }
) {
  const count = await prisma.health_scores.count({ where: { organization_id: orgId } });
  if (count > 0) return;
  await prisma.health_scores.create({
    data: {
      id: randomUUID(),
      organization_id: orgId,
      overall: score.overall,
      data_score: score.data_score,
      ops_score: score.ops_score,
      security_score: score.security_score,
      people_score: score.people_score,
      calculated_at: new Date(),
      details: { calculatedBy: 'seed', isDemo: true } as any,
    },
  });
}

// =============================================================================
// INDUSTRY 1 — TECHNOLOGY: NovaSoft Inc. (B2B SaaS, 200 employees)
// =============================================================================

async function seedNovaSoft() {
  console.log('\n📦 Industry: Technology — NovaSoft Inc.');
  const ORG_ID = 'demo-novasoft';
  const ADMIN_ID = 'demo-novasoft-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'NovaSoft Inc.',
    slug: 'demo-novasoft',
    industry: 'Technology',
    company_size: '51-200',
    settings: {
      isDemo: true,
      demoIndustry: 'Technology',
      demoScenario: 'B2B SaaS Startup — Series A, 200 employees, expanding to EU',
      timezone: 'America/Los_Angeles',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@novasoft.demo', name: 'Jordan Rivera', role: 'ADMIN' });
  await upsertUser({ id: 'demo-novasoft-user-cfo', organization_id: ORG_ID, email: 'cfo@novasoft.demo', name: 'Priya Nair', role: 'ADMIN' });
  await upsertUser({ id: 'demo-novasoft-user-cto', organization_id: ORG_ID, email: 'cto@novasoft.demo', name: 'Marcus Lee', role: 'ADMIN' });
  await upsertUser({ id: 'demo-novasoft-user-analyst', organization_id: ORG_ID, email: 'analyst@novasoft.demo', name: 'Sofia Huang', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-arr`,   name: 'Annual Recurring Revenue',   code: 'arr',    unit: 'USD',   category: 'revenue',    baseValue: 4_200_000,  dailyDrift: 0.003,  noisePct: 0.02 },
    { id: `${ORG_ID}-m-mrr`,   name: 'Monthly Recurring Revenue',  code: 'mrr',    unit: 'USD',   category: 'revenue',    baseValue: 350_000,    dailyDrift: 0.003,  noisePct: 0.02 },
    { id: `${ORG_ID}-m-churn`, name: 'Monthly Churn Rate',         code: 'churn',  unit: '%',     category: 'customer',   baseValue: 2.1,        dailyDrift: -0.001, noisePct: 0.1  },
    { id: `${ORG_ID}-m-nps`,   name: 'Net Promoter Score',         code: 'nps',    unit: 'pts',   category: 'customer',   baseValue: 62,         dailyDrift: 0.001,  noisePct: 0.04 },
    { id: `${ORG_ID}-m-cac`,   name: 'Customer Acquisition Cost',  code: 'cac',    unit: 'USD',   category: 'sales',      baseValue: 1_240,      dailyDrift: -0.001, noisePct: 0.05 },
    { id: `${ORG_ID}-m-ltv`,   name: 'Customer Lifetime Value',    code: 'ltv',    unit: 'USD',   category: 'sales',      baseValue: 18_700,     dailyDrift: 0.002,  noisePct: 0.03 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'EU Market Expansion — Phase 1', description: 'Launch NovaSoft platform in Germany and Netherlands. Requires GDPR compliance review, local entity setup, and localised go-to-market.', category: 'Strategy', priority: 'HIGH', status: 'APPROVED', department: 'Executive', budget: 1_200_000, timeframe: 'Q3 2026' },
    { title: 'Series B Fundraise Timing', description: 'Determine optimal window for Series B based on ARR milestones ($6M threshold), market conditions, and investor appetite.', category: 'Finance', priority: 'CRITICAL', status: 'PENDING', department: 'Finance', timeframe: 'Q4 2026' },
    { title: 'AI-Powered Analytics Module', description: 'Build native AI analytics using embedded LLM to surface insights from customer usage data. Estimated 4-month build.', category: 'Product', priority: 'HIGH', status: 'APPROVED', department: 'Product', budget: 380_000, timeframe: 'Q2-Q3 2026' },
    { title: 'Engineering Team Expansion (+20 hires)', description: 'Scale engineering from 42 to 62 to support platform growth. Focus on backend, ML, and DevOps roles.', category: 'People', priority: 'MEDIUM', status: 'PENDING', department: 'Engineering', budget: 2_800_000, timeframe: '12 months' },
    { title: 'SOC 2 Type II Certification', description: 'Achieve SOC 2 Type II to unlock enterprise deals. Requires 6-month audit window and security programme maturation.', category: 'Security', priority: 'HIGH', status: 'IMPLEMENTED', department: 'Security', budget: 95_000 },
    { title: 'Customer Success Platform Overhaul', description: 'Replace Zendesk with in-house CS portal powered by CendiaRainmaker to reduce churn and improve expansion revenue.', category: 'Operations', priority: 'MEDIUM', status: 'DEFERRED', department: 'Customer Success', budget: 140_000 },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Database CPU sustained at 94% — prod cluster',         source: 'Infrastructure' },
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Payment gateway latency > 2 s (SLA breach)',           source: 'Performance' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Churn rate up 0.4 pp month-over-month',                source: 'Analytics' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'AWS cost overrun — 22% above budget for the month',    source: 'Finance' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Enterprise contract renewal due in 18 days (€320K ARR)', source: 'Sales' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Weekly automated backup completed successfully',        source: 'Operations' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 79, data_score: 88, ops_score: 74, security_score: 82, people_score: 72 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 2 — FINANCIAL SERVICES: Atlas Capital Group (Regional Bank, 500 emp)
// =============================================================================

async function seedAtlasCapital() {
  console.log('\n🏦 Industry: Financial Services — Atlas Capital Group');
  const ORG_ID = 'demo-atlas-capital';
  const ADMIN_ID = 'demo-atlas-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'Atlas Capital Group',
    slug: 'demo-atlas-capital',
    industry: 'Financial Services',
    company_size: '201-500',
    settings: {
      isDemo: true,
      demoIndustry: 'Financial Services',
      demoScenario: 'Regional commercial bank — $2.1B assets, multi-state presence',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@atlascapital.demo', name: 'Diana Okafor', role: 'ADMIN' });
  await upsertUser({ id: 'demo-atlas-user-cro', organization_id: ORG_ID, email: 'cro@atlascapital.demo', name: 'Richard Bloom', role: 'ADMIN' });
  await upsertUser({ id: 'demo-atlas-user-cco', organization_id: ORG_ID, email: 'compliance@atlascapital.demo', name: 'Yuki Tanaka', role: 'ADMIN' });
  await upsertUser({ id: 'demo-atlas-user-analyst', organization_id: ORG_ID, email: 'analyst@atlascapital.demo', name: 'Carlos Mendez', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-assets`,  name: 'Total Assets Under Management', code: 'total_assets',     unit: 'USD',  category: 'financial',    baseValue: 2_100_000_000, dailyDrift: 0.0008, noisePct: 0.01 },
    { id: `${ORG_ID}-m-npl`,     name: 'Non-Performing Loan Ratio',     code: 'npl_ratio',        unit: '%',    category: 'risk',         baseValue: 1.8,           dailyDrift: 0.001,  noisePct: 0.06 },
    { id: `${ORG_ID}-m-capital`, name: 'Capital Adequacy Ratio',        code: 'capital_ratio',    unit: '%',    category: 'regulatory',   baseValue: 14.2,          dailyDrift: -0.0005, noisePct: 0.02 },
    { id: `${ORG_ID}-m-loans`,   name: 'Total Loan Volume',             code: 'loan_volume',      unit: 'USD',  category: 'revenue',      baseValue: 890_000_000,   dailyDrift: 0.001,  noisePct: 0.015 },
    { id: `${ORG_ID}-m-nim`,     name: 'Net Interest Margin',           code: 'net_interest_margin', unit: '%', category: 'revenue',      baseValue: 3.4,           dailyDrift: -0.0003, noisePct: 0.03 },
    { id: `${ORG_ID}-m-cir`,     name: 'Cost-to-Income Ratio',          code: 'cost_income_ratio', unit: '%',  category: 'efficiency',   baseValue: 58.3,          dailyDrift: -0.0005, noisePct: 0.02 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'Core Banking Digital Transformation', description: 'Migrate legacy Temenos T24 core to cloud-native platform. $18M programme over 24 months. Critical for competitive positioning.', category: 'Technology', priority: 'CRITICAL', status: 'APPROVED', department: 'Technology', budget: 18_000_000, timeframe: '24 months' },
    { title: 'Credit Risk Model Update (Basel IV)', description: 'Update internal credit risk models to comply with Basel IV requirements effective Jan 2027. External consultant engagement required.', category: 'Regulatory', priority: 'HIGH', status: 'PENDING', department: 'Risk', budget: 2_200_000 },
    { title: 'Branch Network Rationalisation', description: 'Close 8 underperforming branches and consolidate into 3 flagship locations. Projected $4.2M annual savings.', category: 'Operations', priority: 'HIGH', status: 'PENDING', department: 'Operations', budget: 800_000, timeframe: 'Q4 2026' },
    { title: 'SME Digital Lending Product Launch', description: 'Launch automated SME loan origination with 24-hour decisioning. Targets $120M new loan book in Year 1.', category: 'Product', priority: 'HIGH', status: 'APPROVED', department: 'Retail Banking', budget: 3_500_000, timeframe: 'Q3 2026' },
    { title: 'AML/CFT Technology Upgrade', description: 'Replace legacy transaction monitoring system with AI-driven solution. Required following FINCEN guidance issued Q1 2026.', category: 'Compliance', priority: 'CRITICAL', status: 'APPROVED', department: 'Compliance', budget: 4_800_000 },
    { title: 'ESG Reporting Framework Implementation', description: 'Develop Scope 1-3 emissions tracking and ESG disclosure aligned to TCFD and SEC climate rules.', category: 'Governance', priority: 'MEDIUM', status: 'PENDING', department: 'Strategy', budget: 650_000 },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Regulatory examination notice received — 45-day window',     source: 'Compliance' },
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Fraud cluster detected: 14 suspicious transactions ($2.3M)',  source: 'Risk' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'NPL ratio trending up — 0.3 pp above quarterly target',      source: 'Risk' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'Basel IV parallel run reporting deadline in 30 days',         source: 'Regulatory' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Core banking DR test failed — fallback RTO exceeded by 40%',  source: 'Technology' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Q1 financial close completed and filed on schedule',          source: 'Finance' },
    { severity: 'INFO',     status: 'ACTIVE',       title: 'New FX hedging facility approved by board',                   source: 'Treasury' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 73, data_score: 82, ops_score: 68, security_score: 76, people_score: 66 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 3 — HEALTHCARE: Meridian Health System (Hospital network, 1 500 emp)
// =============================================================================

async function seedMeridianHealth() {
  console.log('\n🏥 Industry: Healthcare — Meridian Health System');
  const ORG_ID = 'demo-meridian-health';
  const ADMIN_ID = 'demo-meridian-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'Meridian Health System',
    slug: 'demo-meridian-health',
    industry: 'Healthcare',
    company_size: '1001-5000',
    settings: {
      isDemo: true,
      demoIndustry: 'Healthcare',
      demoScenario: 'Non-profit hospital network — 3 campuses, 420 licensed beds',
      timezone: 'America/Chicago',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@meridianhealth.demo', name: 'Dr. Elena Vasquez', role: 'ADMIN' });
  await upsertUser({ id: 'demo-meridian-user-cmo', organization_id: ORG_ID, email: 'cmo@meridianhealth.demo', name: 'Dr. Samuel Park', role: 'ADMIN' });
  await upsertUser({ id: 'demo-meridian-user-cfo', organization_id: ORG_ID, email: 'cfo@meridianhealth.demo', name: 'Laura Kimani', role: 'ADMIN' });
  await upsertUser({ id: 'demo-meridian-user-cno', organization_id: ORG_ID, email: 'nursing@meridianhealth.demo', name: 'James O\'Brien', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-sat`,    name: 'Patient Satisfaction Score',   code: 'patient_satisfaction', unit: '/5',   category: 'quality',    baseValue: 4.2,    dailyDrift: 0.0005, noisePct: 0.03 },
    { id: `${ORG_ID}-m-occ`,    name: 'Bed Occupancy Rate',           code: 'bed_occupancy',        unit: '%',    category: 'operations', baseValue: 78,     dailyDrift: 0.0004, noisePct: 0.05 },
    { id: `${ORG_ID}-m-wait`,   name: 'Average ED Wait Time',         code: 'avg_wait_time',        unit: 'min',  category: 'operations', baseValue: 24,     dailyDrift: 0.002,  noisePct: 0.12 },
    { id: `${ORG_ID}-m-rev`,    name: 'Revenue per Patient Visit',    code: 'revenue_per_visit',    unit: 'USD',  category: 'financial',  baseValue: 3_400,  dailyDrift: 0.001,  noisePct: 0.04 },
    { id: `${ORG_ID}-m-readm`,  name: '30-Day Readmission Rate',      code: 'readmission_rate',     unit: '%',    category: 'quality',    baseValue: 8.2,    dailyDrift: -0.002, noisePct: 0.08 },
    { id: `${ORG_ID}-m-staff`,  name: 'Nurse-to-Patient Ratio',       code: 'nurse_patient_ratio',  unit: 'ratio', category: 'staffing',  baseValue: 1/4.8,  dailyDrift: -0.001, noisePct: 0.06 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'EHR System Replacement (Epic)',    description: 'Replace legacy Cerner system with Epic across all 3 campuses. Improves interoperability, care coordination, and HIPAA posture.', category: 'Technology', priority: 'CRITICAL', status: 'APPROVED', department: 'IT', budget: 22_000_000, timeframe: '30 months' },
    { title: 'Nursing Staff Expansion (+85 FTE)', description: 'Hire 85 additional registered nurses to achieve 1:4 target ratio across all wards. Critical for Joint Commission reaccreditation.', category: 'Staffing', priority: 'HIGH', status: 'APPROVED', department: 'Human Resources', budget: 9_100_000 },
    { title: 'Telehealth Service Line Launch',   description: 'Launch asynchronous telehealth for primary care and behavioural health. Target 12,000 virtual visits in Year 1.', category: 'Clinical', priority: 'HIGH', status: 'PENDING', department: 'Clinical Operations', budget: 1_800_000, timeframe: 'Q3 2026' },
    { title: 'MRI Fleet Upgrade — 3T Systems',  description: 'Replace two 1.5T MRI units with 3T systems. Increases throughput by 35% and enables advanced neurological imaging.', category: 'Capital Equipment', priority: 'MEDIUM', status: 'PENDING', department: 'Radiology', budget: 6_400_000 },
    { title: 'Sepsis Early Warning Programme',   description: 'Deploy AI-driven sepsis alert integrated with Epic. Target 30% reduction in mortality from sepsis within 12 months.', category: 'Patient Safety', priority: 'HIGH', status: 'IMPLEMENTED', department: 'Clinical', budget: 420_000 },
    { title: 'Revenue Cycle Management Overhaul', description: 'Engage external RCM partner to reduce denial rate from 12% to <6% and accelerate days-in-AR from 48 to <35.', category: 'Finance', priority: 'HIGH', status: 'APPROVED', department: 'Finance', budget: 3_200_000 },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'ED at 112% capacity — diversion protocol activated',         source: 'Operations' },
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'ICU nurse staffing below safe ratio threshold on 2 units',   source: 'Staffing' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'CMS star rating risk: readmission metric approaching 4-star boundary', source: 'Quality' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'Sterilisation equipment Failure — OR 4 and 5 taken offline', source: 'Facilities' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Supply chain disruption — IV fluid shortage (7-day reserve)',  source: 'Supply Chain' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Joint Commission preparedness survey completed — no findings', source: 'Compliance' },
    { severity: 'INFO',     status: 'ACTIVE',       title: 'Q1 charity care threshold exceeded — positive community benefit', source: 'Finance' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 71, data_score: 76, ops_score: 63, security_score: 78, people_score: 67 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 4 — LOGISTICS: FlowRoute Logistics (Fleet + supply chain, 800 emp)
// =============================================================================

async function seedFlowRoute() {
  console.log('\n🚚 Industry: Logistics — FlowRoute Logistics');
  const ORG_ID = 'demo-flowroute';
  const ADMIN_ID = 'demo-flowroute-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'FlowRoute Logistics',
    slug: 'demo-flowroute',
    industry: 'Logistics',
    company_size: '501-1000',
    settings: {
      isDemo: true,
      demoIndustry: 'Transportation & Logistics',
      demoScenario: 'Last-mile & long-haul fleet — 342 vehicles, 6 depots, 48 states',
      timezone: 'America/Chicago',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@flowroute.demo', name: 'Angela Torres', role: 'ADMIN' });
  await upsertUser({ id: 'demo-flowroute-user-coo', organization_id: ORG_ID, email: 'coo@flowroute.demo', name: 'Derek Osei', role: 'ADMIN' });
  await upsertUser({ id: 'demo-flowroute-user-cfo', organization_id: ORG_ID, email: 'cfo@flowroute.demo', name: 'Mei Zhang', role: 'ADMIN' });
  await upsertUser({ id: 'demo-flowroute-user-ops', organization_id: ORG_ID, email: 'ops@flowroute.demo', name: 'Travis Holt', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-otd`,    name: 'On-Time Delivery Rate',       code: 'on_time_delivery',    unit: '%',    category: 'operations', baseValue: 91.3,  dailyDrift: 0.0003,  noisePct: 0.04 },
    { id: `${ORG_ID}-m-util`,   name: 'Fleet Utilisation Rate',      code: 'fleet_utilisation',   unit: '%',    category: 'operations', baseValue: 84,    dailyDrift: 0.001,   noisePct: 0.05 },
    { id: `${ORG_ID}-m-cpm`,    name: 'Cost per Mile',               code: 'cost_per_mile',       unit: 'USD',  category: 'financial',  baseValue: 1.87,  dailyDrift: 0.001,   noisePct: 0.04 },
    { id: `${ORG_ID}-m-csat`,   name: 'Customer Satisfaction',       code: 'csat',                unit: '/5',   category: 'customer',   baseValue: 4.1,   dailyDrift: 0.0005,  noisePct: 0.03 },
    { id: `${ORG_ID}-m-routes`, name: 'Active Routes Daily',         code: 'active_routes',       unit: 'count', category: 'operations', baseValue: 142,  dailyDrift: 0.002,   noisePct: 0.06 },
    { id: `${ORG_ID}-m-fuel`,   name: 'Fuel Efficiency (mpg fleet avg)', code: 'fuel_efficiency', unit: 'mpg',  category: 'sustainability', baseValue: 7.8, dailyDrift: 0.0002, noisePct: 0.03 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'EV Fleet Transition — Phase 1 (50 vehicles)', description: 'Convert 50 last-mile delivery vans to BEV (Rivian EDV 700). Projected $2.1M fuel/maintenance savings over 5 years. Requires depot charging infrastructure.', category: 'Sustainability', priority: 'HIGH', status: 'APPROVED', department: 'Fleet', budget: 7_500_000, timeframe: '18 months' },
    { title: 'Dynamic Route Optimisation Platform', description: 'Deploy AI-driven route optimisation (Routific Enterprise) to reduce cost-per-mile by 12% and improve on-time delivery from 91% to 96%.', category: 'Technology', priority: 'HIGH', status: 'PENDING', department: 'Operations', budget: 480_000, timeframe: 'Q3 2026' },
    { title: 'Nashville Depot — New Site', description: 'Open 6th distribution depot in Nashville, TN to service Southeast corridor. Reduces last-mile distance by avg 38 miles per delivery.', category: 'Infrastructure', priority: 'MEDIUM', status: 'PENDING', department: 'Real Estate', budget: 12_000_000, timeframe: 'Q1 2027' },
    { title: 'Driver Retention & Compensation Programme', description: 'Address 34% annual driver turnover through salary benchmarking, sign-on bonuses, and career progression tracks. ROI: $3.2M saved in recruitment costs.', category: 'People', priority: 'CRITICAL', status: 'APPROVED', department: 'HR', budget: 4_400_000 },
    { title: 'Intermodal Rail Partnership — Union Pacific', description: 'Evaluate long-haul intermodal option with UP for lanes >800 miles. Potential 22% cost reduction and CO₂ savings.', category: 'Partnerships', priority: 'MEDIUM', status: 'PENDING', department: 'Strategy', timeframe: 'Q4 2026' },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Diesel price spike +18% — weekly fuel budget exceeded',     source: 'Finance' },
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'I-80 corridor closure — 23 routes impacted, ETA delays 4h', source: 'Operations' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Driver shortage: 18 routes unfilled for tomorrow AM',        source: 'Dispatch' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: '14 vehicles overdue for scheduled maintenance',              source: 'Fleet' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Customer SLA breach: 3 enterprise accounts at risk',         source: 'Customer Success' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Q1 safety audit completed — 0 OSHA recordable incidents',   source: 'Safety' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 76, data_score: 80, ops_score: 72, security_score: 79, people_score: 73 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 5 — RETAIL: Nexus Commerce (Omnichannel, 300 employees)
// =============================================================================

async function seedNexusRetail() {
  console.log('\n🛒 Industry: Retail — Nexus Commerce');
  const ORG_ID = 'demo-nexus-retail';
  const ADMIN_ID = 'demo-nexus-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'Nexus Commerce',
    slug: 'demo-nexus-retail',
    industry: 'Retail',
    company_size: '201-500',
    settings: {
      isDemo: true,
      demoIndustry: 'Retail',
      demoScenario: 'Omnichannel retail — 28 stores, e-commerce, $180M GMV',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@nexuscommerce.demo', name: 'Isabelle Fontaine', role: 'ADMIN' });
  await upsertUser({ id: 'demo-nexus-user-cmdo', organization_id: ORG_ID, email: 'cmo@nexuscommerce.demo', name: 'Ben Adeyemi', role: 'ADMIN' });
  await upsertUser({ id: 'demo-nexus-user-cfo', organization_id: ORG_ID, email: 'cfo@nexuscommerce.demo', name: 'Rachel Stein', role: 'ADMIN' });
  await upsertUser({ id: 'demo-nexus-user-buyer', organization_id: ORG_ID, email: 'buying@nexuscommerce.demo', name: 'Omar Hassan', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-sss`,    name: 'Same-Store Sales Growth',     code: 'same_store_sales',    unit: '%',    category: 'revenue',    baseValue: 3.4,   dailyDrift: 0.001,   noisePct: 0.15 },
    { id: `${ORG_ID}-m-inv`,    name: 'Inventory Turnover',          code: 'inventory_turnover',  unit: 'x/yr', category: 'operations', baseValue: 8.2,   dailyDrift: 0.0005,  noisePct: 0.06 },
    { id: `${ORG_ID}-m-roas`,   name: 'Return on Ad Spend',          code: 'roas',                unit: 'x',    category: 'marketing',  baseValue: 4.1,   dailyDrift: 0.001,   noisePct: 0.08 },
    { id: `${ORG_ID}-m-ret`,    name: 'Customer Retention Rate',     code: 'customer_retention',  unit: '%',    category: 'customer',   baseValue: 64,    dailyDrift: 0.0005,  noisePct: 0.04 },
    { id: `${ORG_ID}-m-aov`,    name: 'Average Order Value',         code: 'avg_order_value',     unit: 'USD',  category: 'revenue',    baseValue: 87,    dailyDrift: 0.001,   noisePct: 0.05 },
    { id: `${ORG_ID}-m-gmv`,    name: 'Gross Merchandise Value',     code: 'gmv',                 unit: 'USD',  category: 'revenue',    baseValue: 15_000_000, dailyDrift: 0.002, noisePct: 0.12 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'E-Commerce Platform Replatform (Shopify Plus)', description: 'Migrate from custom PHP platform to Shopify Plus. Target: 40% faster page load, 15% CVR uplift, headless CMS. Go-live Q3 2026.', category: 'Technology', priority: 'HIGH', status: 'APPROVED', department: 'Digital', budget: 1_200_000, timeframe: 'Q3 2026' },
    { title: 'Private Label Product Line Launch', description: 'Develop 3 private-label categories (home, wellness, apparel) targeting 65% gross margin vs 38% branded average.', category: 'Product', priority: 'HIGH', status: 'PENDING', department: 'Buying', budget: 3_800_000, timeframe: 'Q1 2027' },
    { title: 'Store Network Expansion — 4 New Locations', description: 'Open stores in Austin TX, Denver CO, Raleigh NC, and Portland OR. Average unit economics: 18-month payback.', category: 'Real Estate', priority: 'MEDIUM', status: 'APPROVED', department: 'Real Estate', budget: 6_400_000, timeframe: '18 months' },
    { title: 'Unified Loyalty Programme Relaunch', description: 'Replace 3 fragmented loyalty schemes with one cross-channel programme powered by Salesforce Loyalty Management.', category: 'Marketing', priority: 'HIGH', status: 'PENDING', department: 'Marketing', budget: 960_000 },
    { title: 'AI Demand Forecasting Implementation', description: 'Deploy ML demand forecasting to reduce out-of-stocks by 30% and markdown losses by 18%. Integrate with ERP.', category: 'Technology', priority: 'MEDIUM', status: 'IMPLEMENTED', department: 'Supply Chain', budget: 380_000 },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Core SKU (top 10) out-of-stock across 11 stores — peak season', source: 'Inventory' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Key apparel supplier delayed — 6-week import backlog',           source: 'Supply Chain' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'ROAS dropped 0.8x — paid search performance below target',       source: 'Marketing' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'Returns rate 18% — 4 pp above benchmark for e-comm',            source: 'Operations' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Black Friday campaign delivered 32% YoY GMV uplift',            source: 'Marketing' },
    { severity: 'INFO',     status: 'ACTIVE',       title: 'Austin store — lease heads-of-terms agreed',                    source: 'Real Estate' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 74, data_score: 78, ops_score: 70, security_score: 75, people_score: 73 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 6 — LEGAL: Harrington & Associates (Law firm, 150 employees)
// =============================================================================

async function seedHarrington() {
  console.log('\n⚖️  Industry: Legal — Harrington & Associates');
  const ORG_ID = 'demo-harrington-law';
  const ADMIN_ID = 'demo-harrington-user-mp';

  await upsertOrg({
    id: ORG_ID,
    name: 'Harrington & Associates LLP',
    slug: 'demo-harrington-law',
    industry: 'Legal',
    company_size: '51-200',
    settings: {
      isDemo: true,
      demoIndustry: 'Legal',
      demoScenario: 'Full-service law firm — 38 partners, 312 active matters, AmLaw 200',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'mp@harrington.demo', name: 'Catherine Harrington', role: 'ADMIN' });
  await upsertUser({ id: 'demo-harrington-user-coo', organization_id: ORG_ID, email: 'coo@harrington.demo', name: 'Patrick Walsh', role: 'ADMIN' });
  await upsertUser({ id: 'demo-harrington-user-cfo', organization_id: ORG_ID, email: 'cfo@harrington.demo', name: 'Sandra Yip', role: 'ADMIN' });
  await upsertUser({ id: 'demo-harrington-user-assoc', organization_id: ORG_ID, email: 'associate@harrington.demo', name: 'Michael Tran', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-bill`,   name: 'Billable Hours Utilisation',  code: 'billable_utilisation',  unit: '%',   category: 'productivity', baseValue: 85,      dailyDrift: -0.0003, noisePct: 0.04 },
    { id: `${ORG_ID}-m-real`,   name: 'Realisation Rate',            code: 'realisation_rate',      unit: '%',   category: 'financial',    baseValue: 92,      dailyDrift: 0.0001,  noisePct: 0.03 },
    { id: `${ORG_ID}-m-csat`,   name: 'Client Satisfaction Score',   code: 'client_satisfaction',   unit: '/5',  category: 'customer',     baseValue: 4.6,     dailyDrift: 0.0002,  noisePct: 0.02 },
    { id: `${ORG_ID}-m-cases`,  name: 'Active Matters',              code: 'active_matters',        unit: 'count', category: 'operations', baseValue: 312,     dailyDrift: 0.003,   noisePct: 0.05 },
    { id: `${ORG_ID}-m-rpp`,    name: 'Revenue per Equity Partner',  code: 'revenue_per_partner',   unit: 'USD', category: 'financial',    baseValue: 1_200_000, dailyDrift: 0.002, noisePct: 0.04 },
    { id: `${ORG_ID}-m-wip`,    name: 'WIP Days Outstanding',        code: 'wip_days',              unit: 'days', category: 'financial',   baseValue: 42,      dailyDrift: 0.001,   noisePct: 0.06 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'Data Privacy Practice Group Launch', description: 'Establish a dedicated data privacy and cybersecurity practice. 4 lateral partner hires required. Market opportunity: $8M Year 2 revenue.', category: 'Strategy', priority: 'HIGH', status: 'APPROVED', department: 'Partners Committee', budget: 3_200_000, timeframe: 'Q4 2026' },
    { title: 'Legal AI Platform Adoption (Harvey AI)', description: 'Firm-wide rollout of Harvey AI for document review, contract analysis, and research. 30% efficiency gain modelled. Client billing implications to resolve.', category: 'Technology', priority: 'HIGH', status: 'PENDING', department: 'IT', budget: 780_000 },
    { title: 'Partner Compensation Structure Reform', description: 'Move from lockstep to modified merit system. Requires partner vote (75% threshold). Consulting engagement with Hildebrandt.', category: 'Governance', priority: 'CRITICAL', status: 'PENDING', department: 'Partners Committee' },
    { title: 'London Office Expansion', description: 'Increase London headcount from 18 to 35 to service EU clients post-Brexit. Focus on M&A, PE, and data privacy.', category: 'Real Estate', priority: 'MEDIUM', status: 'APPROVED', department: 'Management Committee', budget: 2_400_000, timeframe: '12 months' },
    { title: 'Billing Rate Increase (7% across board)', description: 'Implement 7% rate increase effective January 2027. Benchmarked against peer AmLaw 200 firms. Client communication strategy required.', category: 'Finance', priority: 'MEDIUM', status: 'APPROVED', department: 'Finance', timeframe: 'Jan 2027' },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Court filing deadline in 72 hours — Matter #2847 (M&A dispute)', source: 'Docket' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Conflict check flagged on new $12M client intake',             source: 'Conflicts' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'WIP exceeding 60 days on 8 matters — write-off risk $340K',    source: 'Finance' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'Associate attrition at 28% annualised — above 20% target',    source: 'HR' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Successful trial verdict — Harrington wins $42M arbitration', source: 'Litigation' },
    { severity: 'INFO',     status: 'ACTIVE',       title: 'Legal 500 ranking submission window open — deadline 30 days', source: 'Marketing' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 81, data_score: 84, ops_score: 78, security_score: 80, people_score: 82 });
  console.log('  ✓ health score');
}

// =============================================================================
// INDUSTRY 7 — MANUFACTURING: Vertex Industrial (Factory/production, 600 emp)
// =============================================================================

async function seedVertexIndustrial() {
  console.log('\n🏭 Industry: Manufacturing — Vertex Industrial');
  const ORG_ID = 'demo-vertex-industrial';
  const ADMIN_ID = 'demo-vertex-user-ceo';

  await upsertOrg({
    id: ORG_ID,
    name: 'Vertex Industrial Corp.',
    slug: 'demo-vertex-industrial',
    industry: 'Manufacturing',
    company_size: '501-1000',
    settings: {
      isDemo: true,
      demoIndustry: 'Manufacturing',
      demoScenario: 'Precision components manufacturer — 3 plants, aerospace & automotive OEM supply',
      timezone: 'America/Detroit',
      currency: 'USD',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'ceo@vertexindustrial.demo', name: 'Robert Chen', role: 'ADMIN' });
  await upsertUser({ id: 'demo-vertex-user-coo', organization_id: ORG_ID, email: 'coo@vertexindustrial.demo', name: 'Natasha Petrov', role: 'ADMIN' });
  await upsertUser({ id: 'demo-vertex-user-cfo', organization_id: ORG_ID, email: 'cfo@vertexindustrial.demo', name: 'Wei Liu', role: 'ADMIN' });
  await upsertUser({ id: 'demo-vertex-user-ops', organization_id: ORG_ID, email: 'plantmgr@vertexindustrial.demo', name: 'Dave Kowalski', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-oee`,    name: 'Overall Equipment Effectiveness (OEE)', code: 'oee',            unit: '%',     category: 'operations',   baseValue: 76,    dailyDrift: 0.001,   noisePct: 0.05 },
    { id: `${ORG_ID}-m-defect`, name: 'Defect / Scrap Rate',                  code: 'defect_rate',    unit: '%',     category: 'quality',      baseValue: 0.82,  dailyDrift: -0.003,  noisePct: 0.12 },
    { id: `${ORG_ID}-m-cap`,    name: 'Production Capacity Utilisation',       code: 'capacity_util',  unit: '%',     category: 'operations',   baseValue: 82,    dailyDrift: 0.0005,  noisePct: 0.05 },
    { id: `${ORG_ID}-m-safe`,   name: 'OSHA Recordable Incident Rate',         code: 'incident_rate',  unit: '/100 FTE', category: 'safety',   baseValue: 1.8,   dailyDrift: -0.005,  noisePct: 0.20 },
    { id: `${ORG_ID}-m-ots`,    name: 'On-Time Shipment Rate',                 code: 'on_time_ship',   unit: '%',     category: 'delivery',     baseValue: 94.2,  dailyDrift: 0.0003,  noisePct: 0.03 },
    { id: `${ORG_ID}-m-takt`,   name: 'Takt Time Adherence',                  code: 'takt_adherence', unit: '%',     category: 'operations',   baseValue: 88,    dailyDrift: 0.0005,  noisePct: 0.04 },
  ]);
  console.log('  ✓ metrics (6 KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'Robotic Cell Automation — Plant 2 Assembly Line', description: 'Install 6-axis robotic welding cells on Plant 2 final assembly. Reduces headcount by 18, eliminates ergonomic injury risk, improves OEE by 8pp.', category: 'Capital Investment', priority: 'HIGH', status: 'APPROVED', department: 'Operations', budget: 8_400_000, timeframe: '14 months' },
    { title: 'Tier-1 Supplier Diversification (Taiwan dependency)', description: 'Reduce dependency on single Taiwan CNC supplier from 68% to <30%. Qualify 2 nearshore alternatives in Mexico and Czech Republic.', category: 'Supply Chain', priority: 'CRITICAL', status: 'APPROVED', department: 'Procurement', budget: 1_100_000, timeframe: '18 months' },
    { title: 'AS9100 Rev D Recertification', description: 'Aerospace quality management recertification required before Boeing contract renewal (Nov 2026). 8-month audit preparation programme.', category: 'Quality', priority: 'HIGH', status: 'APPROVED', department: 'Quality', budget: 380_000 },
    { title: 'Energy Efficiency Programme (ISO 50001)', description: 'Implement ISO 50001 energy management to reduce plant energy consumption by 20%. Projected $1.8M annual saving.', category: 'Sustainability', priority: 'MEDIUM', status: 'PENDING', department: 'Facilities', budget: 940_000 },
    { title: 'ERP Migration — SAP S/4HANA', description: 'Migrate from SAP ECC 6.0 (end of mainstream maintenance 2027) to S/4HANA. 3 plants, full go-live Q1 2028.', category: 'Technology', priority: 'HIGH', status: 'PENDING', department: 'IT', budget: 14_000_000, timeframe: '24 months' },
    { title: 'Voluntary Protection Programme (OSHA VPP) Application', description: 'Apply for OSHA VPP Star status. Requires 3-year incident-free track record and comprehensive safety management system.', category: 'Safety', priority: 'MEDIUM', status: 'IMPLEMENTED', department: 'EHS', budget: 210_000 },
  ]);
  console.log('  ✓ decisions');

  await seedAlerts(ORG_ID, [
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'CNC machining centre Plant 1 — unplanned downtime 8h, $180K loss', source: 'Maintenance' },
    { severity: 'CRITICAL', status: 'ACTIVE',       title: 'Titanium billet supply disruption — 3-week inventory remaining',   source: 'Procurement' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'OEE Plant 3 at 61% — 15pp below target, root cause analysis open', source: 'Operations' },
    { severity: 'WARNING',  status: 'ACKNOWLEDGED', title: 'Defect rate spike on Lot #4421 (Boeing parts) — quarantine active', source: 'Quality' },
    { severity: 'WARNING',  status: 'ACTIVE',       title: 'Near-miss safety event reported — Plant 2 press area',              source: 'EHS' },
    { severity: 'INFO',     status: 'RESOLVED',     title: 'Q1 shipments 100% on-time — new record performance',               source: 'Logistics' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 77, data_score: 82, ops_score: 75, security_score: 74, people_score: 77 });
  console.log('  ✓ health score');
}

// =============================================================================
// TUTORIAL ORG — Datacendia Tutorial Co. (guided walkthrough data)
// =============================================================================

async function seedTutorialOrg() {
  console.log('\n🎓 Tutorial Org — Datacendia Tutorial Co.');
  const ORG_ID = 'tutorial-datacendia';
  const ADMIN_ID = 'tutorial-user-admin';

  await upsertOrg({
    id: ORG_ID,
    name: 'Datacendia Tutorial Co.',
    slug: 'tutorial-datacendia',
    industry: 'Technology',
    company_size: '11-50',
    settings: {
      isDemo: true,
      isTutorial: true,
      demoIndustry: 'Technology',
      demoScenario: 'Tutorial walkthrough organisation — clean, guided data for onboarding',
      timezone: 'America/New_York',
      currency: 'USD',
      tutorialNote: 'This organisation contains guided tutorial data. It is safe to explore, edit, and reset. Your real organisation data is kept completely separate.',
    },
  });

  await upsertUser({ id: ADMIN_ID, organization_id: ORG_ID, email: 'admin@tutorial.demo', name: 'Tutorial Admin', role: 'ADMIN' });
  await upsertUser({ id: 'tutorial-user-analyst', organization_id: ORG_ID, email: 'analyst@tutorial.demo', name: 'Tutorial Analyst', role: 'ANALYST' });
  console.log('  ✓ users');

  await seedMetrics(ORG_ID, ADMIN_ID, [
    { id: `${ORG_ID}-m-rev`,   name: 'Monthly Revenue',             code: 'revenue',    unit: 'USD', category: 'revenue',  baseValue: 280_000, dailyDrift: 0.005,  noisePct: 0.03 },
    { id: `${ORG_ID}-m-cust`,  name: 'Active Customers',            code: 'customers',  unit: 'count', category: 'customer', baseValue: 1_240, dailyDrift: 0.003,  noisePct: 0.02 },
    { id: `${ORG_ID}-m-nps`,   name: 'Net Promoter Score',          code: 'nps',        unit: 'pts', category: 'customer', baseValue: 58,      dailyDrift: 0.002,  noisePct: 0.04 },
    { id: `${ORG_ID}-m-health`, name: 'System Health',              code: 'sys_health', unit: '%',   category: 'ops',      baseValue: 97.4,    dailyDrift: -0.001, noisePct: 0.01 },
  ]);
  console.log('  ✓ metrics (4 tutorial KPIs, 30d series)');

  await seedDecisions(ORG_ID, ADMIN_ID, [
    { title: 'Step 1 — Review Your First Decision', description: 'This is a sample decision for the tutorial. Try opening it, running it through the AI Council, and viewing the deliberation output.', category: 'Tutorial', priority: 'HIGH', status: 'PENDING', department: 'All Teams', budget: 50_000, timeframe: 'This quarter' },
    { title: 'Step 2 — Set Up a Workflow', description: 'Create a workflow that automatically routes budget approvals through the CFO agent and COO agent before escalating to human sign-off.', category: 'Tutorial', priority: 'MEDIUM', status: 'PENDING', department: 'Operations' },
    { title: 'Step 3 — Explore the Data Lineage', description: 'Use the Lineage view to trace where the "Monthly Revenue" metric comes from and understand how data flows through the platform.', category: 'Tutorial', priority: 'LOW', status: 'PENDING', department: 'Data' },
  ]);
  console.log('  ✓ decisions (tutorial steps)');

  await seedAlerts(ORG_ID, [
    { severity: 'WARNING', status: 'ACTIVE',   title: 'Tutorial Alert: High API response time detected (sample)',   source: 'Tutorial' },
    { severity: 'INFO',    status: 'RESOLVED', title: 'Tutorial Alert: Weekly data sync completed successfully',    source: 'Tutorial' },
  ]);
  console.log('  ✓ alerts');

  await seedHealthScore(ORG_ID, { overall: 85, data_score: 90, ops_score: 83, security_score: 88, people_score: 79 });
  console.log('  ✓ health score');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('🌱 Datacendia — Multi-Industry Demo Seed');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('All demo organisations use "demo-" / "tutorial-" prefixed IDs.');
  console.log('Real user organisations are NEVER modified by this script.');
  console.log('═══════════════════════════════════════════════════════════════\n');

  await seedNovaSoft();
  await seedAtlasCapital();
  await seedMeridianHealth();
  await seedFlowRoute();
  await seedNexusRetail();
  await seedHarrington();
  await seedVertexIndustrial();
  await seedTutorialOrg();

  console.log('\n\n✅ Multi-industry demo seed completed!');
  console.log('\n📋 Demo credentials (all orgs share the same password):');
  console.log('   Password: DemoAccess2026!');
  console.log('\n📊 Organisations seeded:');
  console.log('   demo-novasoft           — Technology     (NovaSoft Inc.)');
  console.log('   demo-atlas-capital      — Finance        (Atlas Capital Group)');
  console.log('   demo-meridian-health    — Healthcare     (Meridian Health System)');
  console.log('   demo-flowroute          — Logistics      (FlowRoute Logistics)');
  console.log('   demo-nexus-retail       — Retail         (Nexus Commerce)');
  console.log('   demo-harrington-law     — Legal          (Harrington & Associates LLP)');
  console.log('   demo-vertex-industrial  — Manufacturing  (Vertex Industrial Corp.)');
  console.log('   tutorial-datacendia     — Tutorial       (Datacendia Tutorial Co.)');
  console.log('\n💡 Each org has: 4-5 users, 6 KPIs (30-day time series), 5-7 decisions, 6-7 alerts, health scores.');
  console.log('   Real user data is stored in separate org IDs and is completely unaffected.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
