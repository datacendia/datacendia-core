// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// COUNCIL SHOWCASE SEED — 5 Rich Deliberations Across 5 Verticals
// Run with: npx tsx prisma/seed-council-showcase.ts
// =============================================================================

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const DEMO_ORG_ID = 'demo-acme-corp';
const SHOWCASE = 'showcase-';

const USERS = {
  sarah:   { id: 'user-ceo-sarah',    name: 'Sarah Chen' },
  michael: { id: 'user-cfo-michael',  name: 'Michael Torres' },
  david:   { id: 'user-cto-david',    name: 'David Park' },
  emily:   { id: 'user-coo-emily',    name: 'Emily Watson' },
  alex:    { id: 'user-analyst-alex', name: 'Alex Johnson' },
};

const AG = {
  strategist: { id: 'agent-strategist', code: 'STRATEGIST', name: 'Strategic Advisor',  avatar: '🎯', color: '#6366F1', role: 'strategist' },
  analyst:    { id: 'agent-analyst',    code: 'ANALYST',     name: 'Financial Analyst',  avatar: '📊', color: '#06B6D4', role: 'analyst' },
  risk:       { id: 'agent-risk',       code: 'RISK',        name: 'Risk Assessor',      avatar: '⚠️', color: '#F59E0B', role: 'risk' },
  operator:   { id: 'agent-operator',   code: 'OPERATOR',    name: 'Operations Expert',  avatar: '⚙️', color: '#10B981', role: 'operator' },
  advocate:   { id: 'agent-advocate',   code: 'ADVOCATE',    name: "Devil's Advocate",   avatar: '🔍', color: '#EF4444', role: 'advocate' },
  ethics:     { id: 'agent-ethics',     code: 'ETHICS',      name: 'Ethics Guardian',    avatar: '⚖️', color: '#8B5CF6', role: 'ethics' },
};
type AK = keyof typeof AG;

function daysAgo(d: number, h = 0): Date { return new Date(Date.now() - d*86400000 - h*3600000); }
function sha(s: string): string { return crypto.createHash('sha256').update(s).digest('hex'); }
function mid(dk: string, ph: string, ak: string): string { return `${SHOWCASE}msg-${dk}-${ph}-${ak}`; }

// Import deliberation content from separate file
import { ALL_DELIBERATIONS, type DelibDef } from './showcase-content.js';

// =============================================================================
// SEED ONE DELIBERATION
// =============================================================================

async function seedOne(def: DelibDef): Promise<void> {
  const id = `${SHOWCASE}${def.key}`;

  // Clean existing (order matters — FK constraints)
  await prisma.deliberation_messages.deleteMany({ where: { deliberation_id: id } });
  await prisma.deliberation_votes.deleteMany({ where: { deliberation_id: id } });
  await prisma.executive_summaries.deleteMany({ where: { deliberation_id: id } });
  await prisma.decision_outcomes.deleteMany({ where: { deliberation_id: id } });
  await prisma.approvals.deleteMany({ where: { reference_id: id } });
  await prisma.decision_packets.deleteMany({ where: { deliberation_id: id } });
  await prisma.audit_logs.deleteMany({ where: { resource_id: id, resource_type: 'deliberation' } });
  await prisma.deliberations.deleteMany({ where: { id } });

  const createdAt = daysAgo(def.createdDaysAgo, 4);
  const startedAt = daysAgo(def.createdDaysAgo, 3);
  const completedAt = daysAgo(def.completedDaysAgo, 1);

  // Build context for frontend
  const agentResponses = def.analyses.map((a, i) => {
    const ag = AG[a.agent];
    return {
      agentId: ag.id, agentCode: ag.code, agentName: ag.name,
      agentRole: ag.role, agentAvatar: ag.avatar, agentColor: ag.color,
      response: a.content, content: a.content,
      confidence: a.confidence, duration: 2000 + i * 800, phase: 'response',
    };
  });

  const crossExaminations = def.crossExams.map(ce => ({
    challengerId: AG[ce.challenger].id, challengerName: AG[ce.challenger].name,
    challengerAvatar: AG[ce.challenger].avatar, challengerColor: AG[ce.challenger].color,
    targetId: AG[ce.target].id, targetName: AG[ce.target].name,
    challenge: ce.challenge, rebuttal: ce.rebuttal,
  }));

  const decision = {
    recommendation: def.recommendation, status: def.status,
    keyInsight: def.keyInsight, synthesis: def.synthesis,
    ethicsGate: { passed: true, note: def.ethicsNote },
    dissent: def.dissent ? {
      agentId: AG[def.dissent.agent].id,
      agentName: AG[def.dissent.agent].name,
      position: def.dissent.position,
    } : null,
  };

  const context: Record<string, any> = {
    agentResponses, crossExaminations,
    vertical: def.vertical, verticalLabel: def.verticalLabel,
    initiatedBy: def.userName,
  };
  if (def.humanReview) {
    context.humanReview = {
      reviewer: def.humanReview.reviewer, note: def.humanReview.note,
      reviewedAt: daysAgo(def.humanReview.daysAgo).toISOString(),
      status: 'HUMAN_REVIEWED',
    };
  }

  // 1. Deliberation record
  await prisma.deliberations.create({
    data: {
      id, organization_id: DEMO_ORG_ID, question: def.question,
      config: { agents: def.agents.map(a => AG[a].code) },
      context, mode: 'council', status: 'COMPLETED',
      current_phase: 'completed', progress: 100,
      decision, confidence: def.confidence,
      started_at: startedAt, completed_at: completedAt, created_at: createdAt,
    },
  });

  // 2. Deliberation messages (initial analysis)
  for (const a of def.analyses) {
    await prisma.deliberation_messages.create({
      data: {
        id: mid(def.key, 'analysis', a.agent),
        deliberation_id: id, agent_id: AG[a.agent].id,
        phase: 'initial_analysis', content: a.content,
        confidence: a.confidence, sources: [],
        created_at: new Date(startedAt.getTime() + 60000),
      },
    });
  }

  // 3. Cross-examination messages
  for (let i = 0; i < def.crossExams.length; i++) {
    const ce = def.crossExams[i];
    await prisma.deliberation_messages.create({
      data: {
        id: mid(def.key, 'xexam-c', `${ce.challenger}-${i}`),
        deliberation_id: id, agent_id: AG[ce.challenger].id,
        phase: 'cross_examination', content: ce.challenge,
        target_agent_id: AG[ce.target].id, sources: [],
        created_at: new Date(startedAt.getTime() + 180000 + i * 30000),
      },
    });
    await prisma.deliberation_messages.create({
      data: {
        id: mid(def.key, 'xexam-r', `${ce.target}-${i}`),
        deliberation_id: id, agent_id: AG[ce.target].id,
        phase: 'cross_examination', content: ce.rebuttal,
        target_agent_id: AG[ce.challenger].id, sources: [],
        created_at: new Date(startedAt.getTime() + 210000 + i * 30000),
      },
    });
  }

  // 4. Synthesis message
  await prisma.deliberation_messages.create({
    data: {
      id: mid(def.key, 'synthesis', 'council'),
      deliberation_id: id, agent_id: AG.strategist.id,
      phase: 'synthesis', content: def.synthesis,
      sources: [], created_at: new Date(completedAt.getTime() - 60000),
    },
  });

  // 5. Votes
  for (const a of def.agents) {
    const isDissenter = def.dissent?.agent === a;
    await prisma.deliberation_votes.create({
      data: {
        deliberation_id: id, agent_role: AG[a].code,
        vote: isDissenter ? 'conditional_approve' : (def.status === 'APPROVED' ? 'approve' : 'reject'),
        reasoning: isDissenter ? def.dissent!.position : `Concurs with Council ${def.recommendation} recommendation`,
        confidence: def.analyses.find(x => x.agent === a)?.confidence ?? def.confidence,
        created_at: new Date(completedAt.getTime() - 30000),
      },
    });
  }

  // 6. Decision packet
  const runId = `${SHOWCASE}run-${def.key}`;
  const merkleData = JSON.stringify({ id, question: def.question, recommendation: def.recommendation, confidence: def.confidence });
  await prisma.decision_packets.create({
    data: {
      run_id: runId, version: 1,
      organization_id: DEMO_ORG_ID, session_id: 'demo-session-001',
      user_id: def.userId, deliberation_id: id,
      question: def.question, recommendation: def.recommendation,
      confidence: def.confidence,
      key_assumptions: def.keyPoints,
      agent_contributions: def.analyses.map(a => ({ agent: AG[a.agent].name, confidence: a.confidence })),
      dissents: def.dissent ? [{ agent: AG[def.dissent.agent].name, position: def.dissent.position }] : [],
      consensus_reached: !def.dissent,
      merkle_root: sha(merkleData),
      regulatory_frameworks: [],
      retention_until: new Date(Date.now() + 7 * 365 * 86400000),
      duration_ms: completedAt.getTime() - startedAt.getTime(),
      created_at: startedAt, completed_at: completedAt,
    },
  });

  // 7. Audit logs (chain-hashed)
  const auditActions = [
    { action: 'deliberation.created', actor: def.userId, ts: createdAt },
    { action: 'deliberation.started', actor: 'system', ts: startedAt },
    { action: 'phase.initial_analysis', actor: 'system', ts: new Date(startedAt.getTime() + 5000) },
    ...def.analyses.map((a, i) => ({ action: `agent.response.${AG[a.agent].code}`, actor: AG[a.agent].id, ts: new Date(startedAt.getTime() + 60000 + i * 15000) })),
    { action: 'phase.cross_examination', actor: 'system', ts: new Date(startedAt.getTime() + 150000) },
    { action: 'phase.synthesis', actor: 'system', ts: new Date(completedAt.getTime() - 120000) },
    { action: 'phase.ethics_check', actor: AG.ethics.id, ts: new Date(completedAt.getTime() - 60000) },
    { action: 'deliberation.completed', actor: 'system', ts: completedAt },
  ];
  if (def.humanReview) {
    auditActions.push({
      action: 'human.review',
      actor: def.userId,
      ts: daysAgo(def.humanReview.daysAgo),
    });
  }

  // audit_logs.user_id references users, so only people go there; agents and
  // the system are recorded as the actor in details.
  const humanIds = new Set(Object.values(USERS).map((u) => u.id));
  let prevHash = '0'.repeat(64);
  for (const ae of auditActions) {
    const hash = sha(JSON.stringify({ ...ae, prevHash }));
    await prisma.audit_logs.create({
      data: {
        id: `${SHOWCASE}audit-${def.key}-${ae.action.replace(/\./g, '-')}`,
        organization_id: DEMO_ORG_ID, user_id: humanIds.has(ae.actor) ? ae.actor : null,
        action: ae.action, resource_type: 'deliberation', resource_id: id,
        details: { actor: ae.actor, chain_hash: hash, previous_hash: prevHash,
          ...(ae.action === 'human.review' && def.humanReview ? { reviewer: def.humanReview.reviewer, note: def.humanReview.note } : {}),
        },
        ip_address: '10.0.1.42', user_agent: 'Datacendia-Council/1.0',
        created_at: ae.ts,
      },
    });
    prevHash = hash;
  }

  // 8. Executive summary
  await prisma.executive_summaries.create({
    data: {
      id: `${SHOWCASE}summary-${def.key}`,
      organization_id: DEMO_ORG_ID, deliberation_id: id,
      type: 'COUNCIL_DELIBERATION', title: def.summaryTitle,
      content: def.synthesis,
      key_points: def.keyPoints, risks: def.risks,
      recommendations: [def.recommendation],
      next_steps: def.nextSteps,
      participants: def.agents.map(a => AG[a].name),
      generated_by: 'council-system', language: 'en',
      created_at: completedAt, updated_at: completedAt,
    },
  });

  console.log(`  ✓ ${def.verticalLabel}: "${def.question.substring(0, 60)}..." (${def.confidence} confidence)`);
}

// =============================================================================
// MAIN
// =============================================================================

async function main() {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  COUNCIL SHOWCASE SEED — 5 Verticals                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Verify org exists
  const org = await prisma.organizations.findUnique({ where: { id: DEMO_ORG_ID } });
  if (!org) {
    console.error('❌ Organization not found. Run seed-full-demo.ts first.');
    process.exit(1);
  }

  // Delete old generic deliberations created by seed-full-demo
  const genericDelibs = await prisma.deliberations.findMany({
    where: { organization_id: DEMO_ORG_ID, NOT: { id: { startsWith: SHOWCASE } } },
    select: { id: true },
  });
  for (const gd of genericDelibs) {
    await prisma.deliberation_messages.deleteMany({ where: { deliberation_id: gd.id } });
    await prisma.deliberation_votes.deleteMany({ where: { deliberation_id: gd.id } });
    await prisma.decision_outcomes.deleteMany({ where: { deliberation_id: gd.id } });
    await prisma.approvals.deleteMany({ where: { reference_id: gd.id } });
    await prisma.executive_summaries.deleteMany({ where: { deliberation_id: gd.id } });
  }
  await prisma.deliberations.deleteMany({
    where: { organization_id: DEMO_ORG_ID, NOT: { id: { startsWith: SHOWCASE } } },
  });
  if (genericDelibs.length > 0) {
    console.log(`  ↳ Removed ${genericDelibs.length} generic placeholder deliberations\n`);
  }

  for (const def of ALL_DELIBERATIONS) {
    await seedOne(def);
  }

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║  ✅ 5 SHOWCASE DELIBERATIONS CREATED                       ║');
  console.log('║                                                            ║');
  console.log('║  🔋 Energy — Grid Emergency (yesterday)                    ║');
  console.log('║  🏭 Manufacturing — Brake Caliper (3 days ago)             ║');
  console.log('║  🏦 Financial — CRE Acquisition (5 days ago)               ║');
  console.log('║  🏥 Healthcare — SepsisSense SaMD (14 days ago)            ║');
  console.log('║  🏛️  Government — Veterans IT (10 days ago)                 ║');
  console.log('║                                                            ║');
  console.log('║  Financial Services includes HUMAN REVIEWED override       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
}

main()
  .catch(e => { console.error('❌ Showcase seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
