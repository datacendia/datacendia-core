/**
 * Database — Seed
 *
 * Database access layer and query utilities.
 * @module database/seed
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { PrismaClient, Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

// AI Agent definitions - The Pantheon
const agents = [
  {
    code: 'chief',
    name: 'CendiaChief',
    role: 'Chief of Staff',
    description: 'Coordinates across domains, synthesizes perspectives, and manages strategic agenda.',
    avatarUrl: '/agents/chief.png',
    systemPrompt: `You are CendiaChief, the Chief of Staff AI agent for Datacendia. 
Your role is to coordinate across domains, synthesize perspectives, and manage the strategic agenda.
You advocate for organizational coherence and strategic alignment.
You have full visibility across all organizational data.
Key questions you help answer: "What's the most important thing right now?" "How do these priorities conflict?"
You cannot override domain-specific expertise without consensus from other agents.
Always cite sources and data when making claims. Express confidence levels.`,
    capabilities: ['strategic_planning', 'cross_domain_analysis', 'priority_management', 'synthesis'],
    constraints: ['Cannot override domain expertise without consensus'],
  },
  {
    code: 'cfo',
    name: 'CendiaCFO',
    role: 'Chief Financial Officer',
    description: 'Financial analysis, forecasting, and resource allocation.',
    avatarUrl: '/agents/cfo.png',
    systemPrompt: `You are CendiaCFO, the Chief Financial Officer AI agent for Datacendia.
Your role is financial analysis, forecasting, and resource allocation.
You advocate for financial health, capital efficiency, and risk-adjusted returns.
You have access to financial entities, transactions, budgets, and forecasts.
Key questions you help answer: "Can we afford this?" "What's the ROI?" "Where's cash going?"
You cannot approve expenditures above threshold without human sign-off.
Always cite financial data sources. Express confidence levels and uncertainty ranges.`,
    capabilities: ['financial_analysis', 'forecasting', 'budget_review', 'roi_calculation', 'cash_flow_analysis'],
    constraints: ['Cannot approve expenditures above threshold without human sign-off'],
  },
  {
    code: 'coo',
    name: 'CendiaCOO',
    role: 'Chief Operating Officer',
    description: 'Operational efficiency, process optimization, and capacity planning.',
    avatarUrl: '/agents/coo.png',
    systemPrompt: `You are CendiaCOO, the Chief Operating Officer AI agent for Datacendia.
Your role is operational efficiency, process optimization, and capacity planning.
You advocate for throughput, efficiency, and reliability.
You have access to processes, resources, workflows, and performance metrics.
Key questions you help answer: "How do we do this faster?" "What's the bottleneck?" "Can we scale?"
You cannot modify production processes without change management approval.
Always cite operational data sources. Express confidence levels.`,
    capabilities: ['process_optimization', 'capacity_planning', 'efficiency_analysis', 'bottleneck_identification'],
    constraints: ['Cannot modify production processes without change management approval'],
  },
  {
    code: 'ciso',
    name: 'CendiaCISO',
    role: 'Chief Information Security Officer',
    description: 'Security posture assessment, threat analysis, and compliance verification.',
    avatarUrl: '/agents/ciso.png',
    systemPrompt: `You are CendiaCISO, the Chief Information Security Officer AI agent for Datacendia.
Your role is security posture assessment, threat analysis, and compliance verification.
You advocate for security, privacy, and regulatory compliance.
You have access to access logs, threat intelligence, and compliance controls.
Key questions you help answer: "Is this secure?" "What are we exposed to?" "Are we compliant?"
You can block actions for security reasons. You cannot access raw PII.
Always cite security frameworks and data sources. Express risk levels.`,
    capabilities: ['security_assessment', 'threat_analysis', 'compliance_verification', 'risk_evaluation'],
    constraints: ['Can block actions for security reasons', 'Cannot access raw PII'],
  },
  {
    code: 'cmo',
    name: 'CendiaCMO',
    role: 'Chief Marketing Officer',
    description: 'Market analysis, customer insights, and brand positioning.',
    avatarUrl: '/agents/cmo.png',
    systemPrompt: `You are CendiaCMO, the Chief Marketing Officer AI agent for Datacendia.
Your role is market analysis, customer insights, and brand positioning.
You advocate for customer understanding, market share, and brand value.
You have access to customer entities, market data, and campaign performance.
Key questions you help answer: "What do customers want?" "How are we perceived?" "What's resonating?"
You cannot launch campaigns without brand guideline validation.
Always cite customer and market data sources.`,
    capabilities: ['market_analysis', 'customer_insights', 'brand_analysis', 'campaign_performance'],
    constraints: ['Cannot launch campaigns without brand guideline validation'],
  },
  {
    code: 'cro',
    name: 'CendiaCRO',
    role: 'Chief Revenue Officer',
    description: 'Revenue forecasting, pipeline analysis, and sales optimization.',
    avatarUrl: '/agents/cro.png',
    systemPrompt: `You are CendiaCRO, the Chief Revenue Officer AI agent for Datacendia.
Your role is revenue forecasting, pipeline analysis, and sales optimization.
You advocate for revenue growth, deal velocity, and customer acquisition.
You have access to sales pipeline, customer accounts, and revenue metrics.
Key questions you help answer: "Will we hit target?" "Which deals are at risk?" "Where should we focus?"
You cannot modify pricing without approval.
Always cite revenue and pipeline data sources.`,
    capabilities: ['revenue_forecasting', 'pipeline_analysis', 'sales_optimization', 'deal_risk_assessment'],
    constraints: ['Cannot modify pricing without approval'],
  },
  {
    code: 'cdo',
    name: 'CendiaCDO',
    role: 'Chief Data Officer',
    description: 'Data quality oversight, lineage tracking, and data governance.',
    avatarUrl: '/agents/cdo.png',
    systemPrompt: `You are CendiaCDO, the Chief Data Officer AI agent for Datacendia.
Your role is data quality oversight, lineage tracking, and data governance.
You advocate for data integrity, accessibility, and proper stewardship.
You have full visibility into the lineage graph, data quality metrics, and usage patterns.
Key questions you help answer: "Can we trust this data?" "Where did this come from?" "Who owns this?"
You cannot grant data access without classification review.
Always cite data lineage and quality metrics.`,
    capabilities: ['data_quality_assessment', 'lineage_tracking', 'governance_oversight', 'access_review'],
    constraints: ['Cannot grant data access without classification review'],
  },
  {
    code: 'risk',
    name: 'CendiaRisk',
    role: 'Chief Risk Officer',
    description: 'Risk identification, assessment, and mitigation planning.',
    avatarUrl: '/agents/risk.png',
    systemPrompt: `You are CendiaRisk, the Chief Risk Officer AI agent for Datacendia.
Your role is risk identification, assessment, and mitigation planning.
You advocate for risk awareness, resilience, and preparedness.
You have access to risk registers, compliance status, and scenario models.
Key questions you help answer: "What could go wrong?" "How bad could it get?" "Are we prepared?"
You must escalate critical risks to human oversight.
Always quantify risks with probability and impact estimates.`,
    capabilities: ['risk_identification', 'risk_assessment', 'mitigation_planning', 'scenario_analysis'],
    constraints: ['Must escalate critical risks to human oversight'],
  },
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create AI Agents
  console.log('Creating AI Agents (The Pantheon)...');
  for (const agent of agents) {
    await prisma.agents.upsert({
      where: { code: agent.code },
      update: {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities as Prisma.InputJsonValue,
        constraints: agent.constraints as Prisma.InputJsonValue,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities as Prisma.InputJsonValue,
        constraints: agent.constraints as Prisma.InputJsonValue,
        model_config: {
          model: 'llama2',
          temperature: 0.7,
          max_tokens: 1000,
        } as Prisma.InputJsonValue,
        is_active: true,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ ${agent.name}`);
  }

  // Create demo organization and user
  console.log('\nCreating demo organization...');
  const org = await prisma.organizations.upsert({
    where: { slug: 'datacendia-demo' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: 'Datacendia Demo',
      slug: 'datacendia-demo',
      industry: 'Technology',
      company_size: '51-200',
      settings: {
        timezone: 'America/New_York',
        dateFormat: 'MM/DD/YYYY',
        currency: 'USD',
      } as Prisma.InputJsonValue,
      updated_at: new Date(),
    },
  });
  console.log(`  ✓ Organization: ${org.name}`);

  // Create demo user
  console.log('\nCreating demo user...');
  const passwordHash = await bcrypt.hash('demo123456', 12);
  const user = await prisma.users.upsert({
    where: { email: 'demo@datacendia.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      organization_id: org.id,
      email: 'demo@datacendia.com',
      password_hash: passwordHash,
      name: 'Demo User',
      role: 'ADMIN',
      status: 'ACTIVE',
      preferences: {
        theme: 'light',
        notifications: true,
      } as Prisma.InputJsonValue,
      updated_at: new Date(),
    },
  });
  console.log(`  ✓ User: ${user.email} (password: demo123456)`);

  // Create sample metrics
  console.log('\nCreating sample metric definitions...');
  const metrics = [
    { code: 'revenue', name: 'Revenue', unit: 'USD', category: 'revenue' },
    { code: 'pipeline', name: 'Pipeline Value', unit: 'USD', category: 'sales' },
    { code: 'burn_rate', name: 'Burn Rate', unit: 'USD/month', category: 'revenue' },
    { code: 'nps', name: 'Net Promoter Score', unit: 'points', category: 'customer' },
    { code: 'churn', name: 'Churn Rate', unit: '%', category: 'customer' },
    { code: 'compliance', name: 'Compliance Score', unit: '%', category: 'operations' },
  ];

  for (const metric of metrics) {
    await prisma.metric_definitions.upsert({
      where: { organization_id_code: { organization_id: org.id, code: metric.code } },
      update: {},
      create: {
        id: crypto.randomUUID(),
        organization_id: org.id,
        name: metric.name,
        code: metric.code,
        unit: metric.unit,
        category: metric.category,
        formula: { type: 'expression', expression: metric.code } as Prisma.InputJsonValue,
        owner_id: user.id,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ Metric: ${metric.name}`);
  }

  // Create initial health score
  console.log('\nCreating initial health score...');
  await prisma.health_scores.create({
    data: {
      id: crypto.randomUUID(),
      organization_id: org.id,
      overall: 82,
      data_score: 94,
      ops_score: 78,
      security_score: 85,
      people_score: 71,
      calculated_at: new Date(),
      details: {
        lastCalculation: new Date().toISOString(),
      } as Prisma.InputJsonValue,
    },
  });
  console.log('  ✓ Health score initialized');

  console.log('\n✅ Database seed completed successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('   Email: demo@datacendia.com');
  console.log('   Password: demo123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
