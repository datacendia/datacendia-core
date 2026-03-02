// =============================================================================
// FULL DEMO COMPANY SEED SCRIPT
// Creates "Acme Corporation" with complete data for ALL core services
// Run with: npx ts-node prisma/seed-full-demo.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

// Demo Company IDs
const DEMO_ORG_ID = 'demo-acme-corp';
const USER_IDS = {
  ceo: 'user-ceo-sarah',
  cfo: 'user-cfo-michael',
  cto: 'user-cto-david',
  coo: 'user-coo-emily',
  analyst: 'user-analyst-alex',
};

function randomDate(daysAgo: number): Date {
  return new Date(Date.now() - Math.random() * daysAgo * 24 * 60 * 60 * 1000);
}

function hash(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// =============================================================================
// CORE ENTITIES
// =============================================================================

async function seedOrganization() {
  console.log('Creating organization...');
  
  const existing = await prisma.organizations.findUnique({
    where: { id: DEMO_ORG_ID }
  });
  
  if (existing) {
    console.log('  ↳ Organization exists');
    return;
  }

  await prisma.organizations.create({
    data: {
      id: DEMO_ORG_ID,
      name: 'Acme Corporation',
      slug: 'acme-corp',
      industry: 'Technology',
      company_size: '1001-5000',
      settings: {
        timezone: 'America/New_York',
        currency: 'USD',
        fiscalYearStart: 'January'
      },
      updated_at: new Date()
    }
  });
  
  console.log('  ✓ Organization created');
}

async function seedUsers() {
  console.log('Creating users...');
  
  const users = [
    { id: USER_IDS.ceo, email: 'sarah.chen@acme.demo', name: 'Sarah Chen', role: 'ADMIN' as const },
    { id: USER_IDS.cfo, email: 'michael.torres@acme.demo', name: 'Michael Torres', role: 'ADMIN' as const },
    { id: USER_IDS.cto, email: 'david.park@acme.demo', name: 'David Park', role: 'ADMIN' as const },
    { id: USER_IDS.coo, email: 'emily.watson@acme.demo', name: 'Emily Watson', role: 'ANALYST' as const },
    { id: USER_IDS.analyst, email: 'alex.johnson@acme.demo', name: 'Alex Johnson', role: 'ANALYST' as const },
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
          password_hash: hash('demo-password-2024'),
          role: u.role,
          status: 'ACTIVE',
          email_verified: true,
          email_verified_at: new Date(),
          preferences: { theme: 'dark', notifications: true },
          updated_at: new Date()
        }
      });
    }
  }
  
  console.log('  ✓ Users created');
}

async function seedAgents() {
  console.log('Creating Council agents...');
  
  const agents = [
    { code: 'STRATEGIST', name: 'Strategic Advisor', role: 'strategist', desc: 'Focuses on long-term business strategy and market positioning' },
    { code: 'ANALYST', name: 'Financial Analyst', role: 'analyst', desc: 'Analyzes financial data, ROI, and budget implications' },
    { code: 'RISK', name: 'Risk Assessor', role: 'risk', desc: 'Identifies potential risks, threats, and mitigation strategies' },
    { code: 'OPERATOR', name: 'Operations Expert', role: 'operator', desc: 'Evaluates operational feasibility and execution requirements' },
    { code: 'ADVOCATE', name: 'Devil\'s Advocate', role: 'advocate', desc: 'Challenges assumptions and presents alternative viewpoints' },
    { code: 'ETHICS', name: 'Ethics Guardian', role: 'ethics', desc: 'Ensures decisions align with ethical guidelines and values' },
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
          system_prompt: `You are ${a.name}, an AI advisor specializing in ${a.role}. ${a.desc}`,
          capabilities: ['analysis', 'recommendation', 'critique'],
          constraints: ['Must be objective', 'Must cite sources'],
          model_config: { model: 'llama3.3:70b', temperature: 0.7 },
          is_active: true,
          updated_at: new Date()
        }
      });
    }
  }
  
  console.log('  ✓ Agents created');
}

// =============================================================================
// ALERTS
// =============================================================================

async function seedAlerts() {
  console.log('Creating alerts...');
  
  const count = await prisma.alerts.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Alerts exist');
    return;
  }

  const alerts = [
    { severity: 'CRITICAL' as const, title: 'Database CPU at 92%', source: 'Infrastructure', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'API latency spike detected', source: 'Performance', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'Weekly backup completed', source: 'Operations', status: 'RESOLVED' as const },
    { severity: 'WARNING' as const, title: 'Contract expiring in 30 days', source: 'Procurement', status: 'ACKNOWLEDGED' as const },
    { severity: 'CRITICAL' as const, title: 'Security scan: 2 vulnerabilities', source: 'Security', status: 'ACTIVE' as const },
    { severity: 'WARNING' as const, title: 'Budget threshold reached (80%)', source: 'Finance', status: 'ACTIVE' as const },
    { severity: 'INFO' as const, title: 'New team member onboarded', source: 'HR', status: 'RESOLVED' as const },
  ];
  
  for (const a of alerts) {
    await prisma.alerts.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        severity: a.severity,
        status: a.status,
        title: a.title,
        message: `${a.title} - requires attention`,
        source: a.source,
        metadata: { triggered_by: 'system' },
        created_at: randomDate(7)
      }
    });
  }
  
  console.log('  ✓ Alerts created');
}

// =============================================================================
// DECISIONS
// =============================================================================

async function seedDecisions() {
  console.log('Creating decisions...');
  
  const count = await prisma.decisions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Decisions exist');
    return;
  }

  const decisions = [
    { title: 'European Market Expansion', desc: 'Evaluate expansion into EU market', status: 'APPROVED' as const, priority: 'HIGH' as const, category: 'Strategy', dept: 'Executive', budget: 2500000 },
    { title: 'Series C Fundraise Timing', desc: 'Determine optimal timing for Series C', status: 'PENDING' as const, priority: 'CRITICAL' as const, category: 'Finance', dept: 'Finance', budget: 0 },
    { title: 'Engineering Team Restructure', desc: 'Reorganize into product-aligned squads', status: 'IMPLEMENTED' as const, priority: 'MEDIUM' as const, category: 'Operations', dept: 'Engineering', budget: 150000 },
    { title: 'AI Feature Roadmap Q1', desc: 'Prioritize AI features for Q1 2025', status: 'PENDING' as const, priority: 'HIGH' as const, category: 'Product', dept: 'Product', budget: 500000 },
    { title: 'Remote Work Policy Update', desc: 'Revise hybrid work policy', status: 'APPROVED' as const, priority: 'MEDIUM' as const, category: 'HR', dept: 'People', budget: 25000 },
    { title: 'Data Center Migration', desc: 'Migrate to new cloud provider', status: 'BLOCKED' as const, priority: 'HIGH' as const, category: 'Infrastructure', dept: 'Engineering', budget: 800000 },
    { title: 'Customer Success Platform', desc: 'Implement new CS tooling', status: 'DEFERRED' as const, priority: 'LOW' as const, category: 'Operations', dept: 'Customer Success', budget: 120000 },
  ];
  
  for (const d of decisions) {
    const decisionId = randomUUID();
    await prisma.decisions.create({
      data: {
        id: decisionId,
        organization_id: DEMO_ORG_ID,
        user_id: USER_IDS.ceo,
        title: d.title,
        description: d.desc,
        category: d.category,
        priority: d.priority,
        status: d.status,
        department: d.dept,
        owner_name: 'Sarah Chen',
        owner_email: 'sarah.chen@acme.demo',
        budget: d.budget,
        timeframe: 'Q1 2025',
        stakeholders: ['Engineering', 'Finance', 'Operations'],
        created_at: randomDate(90),
        updated_at: new Date()
      }
    });

    // Add activity
    await prisma.decision_activities.create({
      data: {
        id: randomUUID(),
        decision_id: decisionId,
        actor: 'Sarah Chen',
        action: 'created',
        details: { note: 'Initial decision created' },
        timestamp: randomDate(90)
      }
    });
  }
  
  console.log('  ✓ Decisions created');
}

// =============================================================================
// DELIBERATIONS
// =============================================================================

async function seedDeliberations() {
  console.log('Creating deliberations...');
  
  const count = await prisma.deliberations.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Deliberations exist');
    return;
  }

  const deliberations = [
    { question: 'Should we expand into the European market next quarter?', status: 'COMPLETED' as const, confidence: 0.82 },
    { question: 'What is the optimal pricing strategy for our enterprise tier?', status: 'COMPLETED' as const, confidence: 0.78 },
    { question: 'How should we respond to the new competitor entering our market?', status: 'IN_PROGRESS' as const, confidence: 0.45 },
    { question: 'Should we acquire the startup for talent and technology?', status: 'PENDING' as const, confidence: null },
    { question: 'What is the best approach to reduce customer churn?', status: 'COMPLETED' as const, confidence: 0.85 },
  ];
  
  for (const d of deliberations) {
    await prisma.deliberations.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        question: d.question,
        config: { agents: ['STRATEGIST', 'ANALYST', 'RISK'] },
        status: d.status,
        current_phase: d.status === 'IN_PROGRESS' ? 'cross_examination' : null,
        progress: d.status === 'COMPLETED' ? 100 : d.status === 'IN_PROGRESS' ? 65 : 0,
        decision: d.status === 'COMPLETED' ? { recommendation: 'Proceed with phased approach' } : undefined,
        confidence: d.confidence,
        started_at: d.status !== 'PENDING' ? randomDate(30) : null,
        completed_at: d.status === 'COMPLETED' ? randomDate(7) : null,
        created_at: randomDate(60)
      }
    });
  }
  
  console.log('  ✓ Deliberations created');
}

// =============================================================================
// DATA SOURCES
// =============================================================================

async function seedDataSources() {
  console.log('Creating data sources...');
  
  const count = await prisma.data_sources.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Data sources exist');
    return;
  }

  const sources = [
    { name: 'Salesforce CRM', type: 'SALESFORCE' as const, status: 'CONNECTED' as const },
    { name: 'PostgreSQL (Production)', type: 'POSTGRESQL' as const, status: 'CONNECTED' as const },
    { name: 'Stripe Payments', type: 'STRIPE' as const, status: 'CONNECTED' as const },
    { name: 'Snowflake Data Warehouse', type: 'SNOWFLAKE' as const, status: 'CONNECTED' as const },
    { name: 'Jira', type: 'JIRA' as const, status: 'CONNECTED' as const },
    { name: 'Slack', type: 'SLACK' as const, status: 'SYNCING' as const },
    { name: 'HubSpot Marketing', type: 'HUBSPOT' as const, status: 'PENDING' as const },
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
        metadata: { recordCount: Math.floor(Math.random() * 1000000) },
        updated_at: new Date()
      }
    });
  }
  
  console.log('  ✓ Data sources created');
}

// =============================================================================
// METRIC DEFINITIONS & VALUES
// =============================================================================

async function seedMetrics() {
  console.log('Creating metrics...');
  
  const count = await prisma.metric_definitions.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Metrics exist');
    return;
  }

  const metrics = [
    { code: 'MRR', name: 'Monthly Recurring Revenue', category: 'Financial', unit: 'USD', format: 'currency' },
    { code: 'ARR', name: 'Annual Recurring Revenue', category: 'Financial', unit: 'USD', format: 'currency' },
    { code: 'CHURN', name: 'Customer Churn Rate', category: 'Customer', unit: '%', format: 'percentage' },
    { code: 'NPS', name: 'Net Promoter Score', category: 'Customer', unit: '', format: 'number' },
    { code: 'CAC', name: 'Customer Acquisition Cost', category: 'Sales', unit: 'USD', format: 'currency' },
    { code: 'LTV', name: 'Customer Lifetime Value', category: 'Sales', unit: 'USD', format: 'currency' },
    { code: 'HEADCOUNT', name: 'Total Employees', category: 'People', unit: '', format: 'number' },
    { code: 'UPTIME', name: 'System Uptime', category: 'Operations', unit: '%', format: 'percentage' },
  ];
  
  for (const m of metrics) {
    const metricId = randomUUID();
    await prisma.metric_definitions.create({
      data: {
        id: metricId,
        organization_id: DEMO_ORG_ID,
        owner_id: USER_IDS.analyst,
        code: m.code,
        name: m.name,
        description: `${m.name} metric`,
        category: m.category,
        unit: m.unit,
        formula: { type: 'direct', source: 'api' },
        thresholds: { warning: 80, critical: 95 },
        updated_at: new Date()
      }
    });

    // Create 12 months of history
    for (let month = 0; month < 12; month++) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);
      
      let value = 0;
      switch (m.code) {
        case 'MRR': value = 3200000 + month * 80000; break;
        case 'ARR': value = 38400000 + month * 960000; break;
        case 'CHURN': value = 2.1 + Math.random() * 0.5; break;
        case 'NPS': value = 55 + Math.random() * 10; break;
        case 'CAC': value = 1200 + Math.random() * 200; break;
        case 'LTV': value = 45000 + Math.random() * 5000; break;
        case 'HEADCOUNT': value = 2500 - month * 50; break;
        case 'UPTIME': value = 99.9 + Math.random() * 0.09; break;
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
  
  console.log('  ✓ Metrics created');
}

// =============================================================================
// AUDIT LOGS
// =============================================================================

async function seedAuditLogs() {
  console.log('Creating audit logs...');
  
  const count = await prisma.audit_logs.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Audit logs exist');
    return;
  }

  const events = [
    { action: 'user.login', resource: 'auth', actor: 'Sarah Chen' },
    { action: 'decision.created', resource: 'decisions', actor: 'Sarah Chen' },
    { action: 'deliberation.started', resource: 'deliberations', actor: 'Council System' },
    { action: 'data_source.connected', resource: 'integrations', actor: 'David Park' },
    { action: 'alert.acknowledged', resource: 'alerts', actor: 'Emily Watson' },
    { action: 'user.invited', resource: 'users', actor: 'Sarah Chen' },
    { action: 'workflow.executed', resource: 'workflows', actor: 'Autopilot' },
    { action: 'policy.updated', resource: 'governance', actor: 'Emily Watson' },
    { action: 'report.generated', resource: 'reports', actor: 'Alex Johnson' },
    { action: 'settings.changed', resource: 'settings', actor: 'Sarah Chen' },
  ];
  
  for (let i = 0; i < 50; i++) {
    const event = events[i % events.length];
    await prisma.audit_logs.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        user_id: USER_IDS.ceo,
        action: event.action,
        resource_type: event.resource,
        resource_id: randomUUID(),
        details: { triggered_by: event.actor },
        ip_address: '10.0.0.' + Math.floor(Math.random() * 255),
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        created_at: randomDate(30)
      }
    });
  }
  
  console.log('  ✓ Audit logs created');
}

// =============================================================================
// TEAMS
// =============================================================================

async function seedTeams() {
  console.log('Creating teams...');
  
  const count = await prisma.teams.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Teams exist');
    return;
  }

  const teams = [
    { name: 'Executive Team', desc: 'C-suite and leadership' },
    { name: 'Engineering', desc: 'Product development and infrastructure' },
    { name: 'Finance', desc: 'Financial planning and accounting' },
    { name: 'Operations', desc: 'Day-to-day business operations' },
    { name: 'Data Science', desc: 'Analytics and ML initiatives' },
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
  
  console.log('  ✓ Teams created');
}

// =============================================================================
// WORKFLOWS
// =============================================================================

async function seedWorkflows() {
  console.log('Creating workflows...');
  
  const count = await prisma.workflows.count({ where: { organization_id: DEMO_ORG_ID } });
  if (count > 0) {
    console.log('  ↳ Workflows exist');
    return;
  }

  const workflows = [
    { name: 'New Employee Onboarding', desc: 'Automated onboarding workflow', trigger: 'employee.created', status: 'ACTIVE' as const },
    { name: 'Budget Approval', desc: 'Multi-level budget approval', trigger: 'budget.requested', status: 'ACTIVE' as const },
    { name: 'Security Incident Response', desc: 'Automated incident escalation', trigger: 'security.alert', status: 'ACTIVE' as const },
    { name: 'Quarterly Report Generation', desc: 'Automated quarterly reports', trigger: 'schedule.quarterly', status: 'ACTIVE' as const },
    { name: 'Vendor Onboarding', desc: 'New vendor setup workflow', trigger: 'vendor.created', status: 'DRAFT' as const },
  ];
  
  for (const w of workflows) {
    await prisma.workflows.create({
      data: {
        id: randomUUID(),
        organization_id: DEMO_ORG_ID,
        name: w.name,
        description: w.desc,
        category: 'automation',
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
  
  console.log('  ✓ Workflows created');
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║         DATACENDIA FULL DEMO SEED                          ║');
  console.log('║         Creating Acme Corporation + All Core Data          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  try {
    // Core entities
    await seedOrganization();
    await seedUsers();
    await seedAgents();
    await seedTeams();
    
    // Operational data
    await seedAlerts();
    await seedDecisions();
    await seedDeliberations();
    await seedDataSources();
    await seedMetrics();
    await seedAuditLogs();
    await seedWorkflows();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║  ✅ FULL DEMO COMPANY CREATED!                             ║');
    console.log('║                                                            ║');
    console.log('║  Organization: Acme Corporation                            ║');
    console.log('║  Users: 5 (CEO, CFO, CTO, COO, Analyst)                    ║');
    console.log('║  Data: Alerts, Decisions, Deliberations, Metrics, etc.    ║');
    console.log('╚════════════════════════════════════════════════════════════╝\n');

  } catch (error) {
    console.error('\n❌ Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
