/**
 * Service Registry — Foundation Tier
 *
 * Catalogs all available Datacendia services for the workflow builder.
 * Core (Community Edition) includes Foundation-tier services only.
 *
 * @exports SERVICE_REGISTRY, getServiceById, getServicesByCategory, getServicesByTier
 * @module services/ServiceRegistry
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import type { ServiceDefinition, ServiceCategory, ServiceTier } from '../types/workflow';

// =============================================================================
// FOUNDATION SERVICES
// =============================================================================

export const SERVICE_REGISTRY: ServiceDefinition[] = [
  // ── Council ────────────────────────────────────────────────────────────────
  {
    id: 'council-deliberation',
    name: 'Council Deliberation',
    shortName: 'Deliberate',
    description: 'Multi-agent deliberation — pose a question and let agents analyze, debate, and reach consensus',
    category: 'council',
    tier: 'foundation',
    icon: 'Users',
    color: 'cyan',
    inputs: [
      { id: 'question', name: 'Question', type: 'data', description: 'The decision question to deliberate' },
      { id: 'context', name: 'Context', type: 'data', description: 'Optional background context' },
    ],
    outputs: [
      { id: 'decision', name: 'Decision', type: 'decision', description: 'The deliberated decision with rationale' },
      { id: 'score', name: 'Confidence Score', type: 'score', description: 'Consensus confidence 0-100' },
    ],
    configSchema: [
      { key: 'mode', label: 'Deliberation Mode', type: 'select', defaultValue: 'standard', options: [{ label: 'Standard', value: 'standard' }, { label: 'Adversarial', value: 'adversarial' }, { label: 'Consensus', value: 'consensus' }] },
      { key: 'maxRounds', label: 'Max Rounds', type: 'number', defaultValue: 5 },
      { key: 'requireUnanimity', label: 'Require Unanimity', type: 'boolean', defaultValue: false },
    ],
  },
  {
    id: 'council-replay',
    name: 'CendiaReplay™',
    shortName: 'Replay',
    description: 'Replay a past deliberation to review agent reasoning and decision evolution',
    category: 'council',
    tier: 'foundation',
    icon: 'Film',
    color: 'cyan',
    inputs: [{ id: 'deliberationId', name: 'Deliberation ID', type: 'data' }],
    outputs: [{ id: 'replay', name: 'Replay Data', type: 'data' }],
    configSchema: [{ key: 'speed', label: 'Playback Speed', type: 'select', defaultValue: '1x', options: [{ label: '0.5x', value: '0.5x' }, { label: '1x', value: '1x' }, { label: '2x', value: '2x' }] }],
  },
  {
    id: 'council-executive-summary',
    name: 'Executive Summary',
    shortName: 'Summary',
    description: 'Generate a board-ready executive summary from a deliberation',
    category: 'council',
    tier: 'foundation',
    icon: 'FileText',
    color: 'cyan',
    inputs: [{ id: 'deliberation', name: 'Deliberation', type: 'decision' }],
    outputs: [{ id: 'report', name: 'Executive Report', type: 'report' }],
    configSchema: [{ key: 'format', label: 'Format', type: 'select', defaultValue: 'pdf', options: [{ label: 'PDF', value: 'pdf' }, { label: 'Markdown', value: 'md' }, { label: 'HTML', value: 'html' }] }],
  },

  // ── DECIDE Intelligence ────────────────────────────────────────────────────
  {
    id: 'chronos',
    name: 'CendiaChronos™',
    shortName: 'Chronos',
    description: 'Enterprise time machine — timeline analysis, pivotal moment detection, multi-branch comparison',
    category: 'intelligence',
    tier: 'foundation',
    icon: 'Clock',
    color: 'violet',
    inputs: [{ id: 'entityId', name: 'Entity or Decision ID', type: 'data' }],
    outputs: [
      { id: 'timeline', name: 'Timeline', type: 'data' },
      { id: 'pivotalMoments', name: 'Pivotal Moments', type: 'data' },
    ],
    configSchema: [
      { key: 'dateRange', label: 'Date Range', type: 'select', defaultValue: '90d', options: [{ label: '30 days', value: '30d' }, { label: '90 days', value: '90d' }, { label: '1 year', value: '1y' }, { label: 'All time', value: 'all' }] },
      { key: 'enableDiff', label: 'Enable Diff View', type: 'boolean', defaultValue: true },
    ],
  },
  {
    id: 'pre-mortem',
    name: 'PreMortem Analysis',
    shortName: 'PreMortem',
    description: 'Anticipate failure modes before a decision is finalized',
    category: 'intelligence',
    tier: 'foundation',
    icon: 'Skull',
    color: 'violet',
    inputs: [{ id: 'decision', name: 'Proposed Decision', type: 'decision' }],
    outputs: [
      { id: 'risks', name: 'Risk Factors', type: 'data' },
      { id: 'score', name: 'Risk Score', type: 'score' },
    ],
    configSchema: [{ key: 'depth', label: 'Analysis Depth', type: 'select', defaultValue: 'standard', options: [{ label: 'Quick', value: 'quick' }, { label: 'Standard', value: 'standard' }, { label: 'Deep', value: 'deep' }] }],
  },
  {
    id: 'ghost-board',
    name: 'Ghost Board',
    shortName: 'GhostBoard',
    description: 'Simulate board-level review of a decision with synthetic directors',
    category: 'intelligence',
    tier: 'foundation',
    icon: 'Ghost',
    color: 'violet',
    inputs: [{ id: 'decision', name: 'Decision', type: 'decision' }],
    outputs: [{ id: 'boardReview', name: 'Board Review', type: 'report' }],
    configSchema: [{ key: 'boardSize', label: 'Board Size', type: 'number', defaultValue: 5 }],
  },
  {
    id: 'decision-debt',
    name: 'Decision Debt Tracker',
    shortName: 'DecisionDebt',
    description: 'Track accumulated decision debt — deferred, stale, or unresolved decisions',
    category: 'intelligence',
    tier: 'foundation',
    icon: 'TrendingUp',
    color: 'violet',
    inputs: [{ id: 'scope', name: 'Scope', type: 'data' }],
    outputs: [
      { id: 'debtReport', name: 'Debt Report', type: 'report' },
      { id: 'score', name: 'Debt Score', type: 'score' },
    ],
    configSchema: [{ key: 'threshold', label: 'Staleness Threshold (days)', type: 'number', defaultValue: 30 }],
  },

  // ── DCII (Institutional Immune System) ─────────────────────────────────────
  {
    id: 'dcii-truth',
    name: 'DCII Truth Verification',
    shortName: 'Truth',
    description: 'Verify factual claims and detect hallucinations in AI outputs',
    category: 'dcii',
    tier: 'foundation',
    icon: 'CheckCircle',
    color: 'emerald',
    inputs: [{ id: 'content', name: 'Content to Verify', type: 'data' }],
    outputs: [{ id: 'truthScore', name: 'Truth Score', type: 'score' }, { id: 'evidence', name: 'Evidence', type: 'evidence' }],
    configSchema: [{ key: 'strictness', label: 'Strictness', type: 'select', defaultValue: 'standard', options: [{ label: 'Lenient', value: 'lenient' }, { label: 'Standard', value: 'standard' }, { label: 'Strict', value: 'strict' }] }],
  },
  {
    id: 'dcii-notary',
    name: 'DCII Notary',
    shortName: 'Notary',
    description: 'Cryptographically sign and notarize decisions for immutable audit trails',
    category: 'dcii',
    tier: 'foundation',
    icon: 'FileSignature',
    color: 'emerald',
    inputs: [{ id: 'decision', name: 'Decision', type: 'decision' }],
    outputs: [{ id: 'certificate', name: 'Notary Certificate', type: 'evidence' }],
    configSchema: [{ key: 'algorithm', label: 'Signing Algorithm', type: 'select', defaultValue: 'ed25519', options: [{ label: 'Ed25519', value: 'ed25519' }, { label: 'RSA-2048', value: 'rsa-2048' }, { label: 'Dilithium (PQ)', value: 'dilithium' }] }],
  },
  {
    id: 'dcii-witness',
    name: 'DCII Witness',
    shortName: 'Witness',
    description: 'Independent witnessing of deliberation process with tamper-proof logging',
    category: 'dcii',
    tier: 'foundation',
    icon: 'Eye',
    color: 'emerald',
    inputs: [{ id: 'deliberation', name: 'Deliberation', type: 'decision' }],
    outputs: [{ id: 'witnessLog', name: 'Witness Log', type: 'evidence' }],
    configSchema: [],
  },
  {
    id: 'dcii-timestamp',
    name: 'DCII Timestamp',
    shortName: 'Timestamp',
    description: 'RFC 3161 compliant timestamping for evidence chain integrity',
    category: 'dcii',
    tier: 'foundation',
    icon: 'Clock',
    color: 'emerald',
    inputs: [{ id: 'document', name: 'Document', type: 'any' }],
    outputs: [{ id: 'timestamp', name: 'Timestamp Token', type: 'evidence' }],
    configSchema: [{ key: 'tsa', label: 'TSA Provider', type: 'select', defaultValue: 'internal', options: [{ label: 'Internal TSA', value: 'internal' }, { label: 'DigiCert', value: 'digicert' }] }],
  },
  {
    id: 'dcii-similarity',
    name: 'DCII Similarity',
    shortName: 'Similarity',
    description: 'Detect similar past decisions and precedent patterns',
    category: 'dcii',
    tier: 'foundation',
    icon: 'Search',
    color: 'emerald',
    inputs: [{ id: 'decision', name: 'Decision', type: 'decision' }],
    outputs: [{ id: 'matches', name: 'Similar Decisions', type: 'data' }, { id: 'score', name: 'Similarity Score', type: 'score' }],
    configSchema: [{ key: 'minScore', label: 'Min Similarity %', type: 'number', defaultValue: 70 }],
  },
  {
    id: 'dcii-memory',
    name: 'DCII Memory',
    shortName: 'Memory',
    description: 'Institutional memory — long-term knowledge retention and retrieval',
    category: 'dcii',
    tier: 'foundation',
    icon: 'Brain',
    color: 'emerald',
    inputs: [{ id: 'query', name: 'Query', type: 'data' }],
    outputs: [{ id: 'memories', name: 'Retrieved Memories', type: 'data' }],
    configSchema: [{ key: 'limit', label: 'Max Results', type: 'number', defaultValue: 10 }],
  },

  // ── Gateway ────────────────────────────────────────────────────────────────
  {
    id: 'gateway',
    name: 'CendiaGateway™',
    shortName: 'Gateway',
    description: 'AI governance proxy — PII detection, policy enforcement, rate limiting',
    category: 'gateway',
    tier: 'foundation',
    icon: 'Shield',
    color: 'blue',
    inputs: [{ id: 'request', name: 'AI Request', type: 'data' }],
    outputs: [
      { id: 'response', name: 'Governed Response', type: 'data' },
      { id: 'piiDetections', name: 'PII Detections', type: 'alert' },
      { id: 'policyBlocks', name: 'Policy Violations', type: 'alert' },
    ],
    configSchema: [
      { key: 'piiDetection', label: 'PII Detection', type: 'boolean', defaultValue: true },
      { key: 'policyEnforcement', label: 'Policy Enforcement', type: 'boolean', defaultValue: true },
    ],
  },

  // ── Graph ──────────────────────────────────────────────────────────────────
  {
    id: 'graph-explorer',
    name: 'Knowledge Graph',
    shortName: 'Graph',
    description: 'Decision knowledge graph — entity relationships, lineage, and impact analysis',
    category: 'graph',
    tier: 'foundation',
    icon: 'Network',
    color: 'orange',
    inputs: [{ id: 'entityId', name: 'Entity ID', type: 'data' }],
    outputs: [{ id: 'graph', name: 'Graph Data', type: 'data' }, { id: 'lineage', name: 'Lineage', type: 'data' }],
    configSchema: [{ key: 'depth', label: 'Traversal Depth', type: 'number', defaultValue: 3 }],
  },

  // ── Pulse ──────────────────────────────────────────────────────────────────
  {
    id: 'pulse-health',
    name: 'CendiaPulse™ Health',
    shortName: 'Health',
    description: 'Real-time system health monitoring — health score, latency, data freshness',
    category: 'pulse',
    tier: 'foundation',
    icon: 'HeartPulse',
    color: 'rose',
    inputs: [],
    outputs: [{ id: 'healthScore', name: 'Health Score', type: 'score' }, { id: 'alerts', name: 'Alerts', type: 'alert' }],
    configSchema: [{ key: 'interval', label: 'Check Interval (sec)', type: 'number', defaultValue: 30 }],
  },
  {
    id: 'pulse-alerts',
    name: 'CendiaPulse™ Alerts',
    shortName: 'Alerts',
    description: 'Anomaly detection and alert management',
    category: 'pulse',
    tier: 'foundation',
    icon: 'AlertTriangle',
    color: 'rose',
    inputs: [{ id: 'metrics', name: 'Metrics', type: 'data' }],
    outputs: [{ id: 'alerts', name: 'Anomaly Alerts', type: 'alert' }],
    configSchema: [{ key: 'sensitivity', label: 'Sensitivity', type: 'select', defaultValue: 'medium', options: [{ label: 'Low', value: 'low' }, { label: 'Medium', value: 'medium' }, { label: 'High', value: 'high' }] }],
  },

  // ── Compliance (Foundation) ────────────────────────────────────────────────
  {
    id: 'compliance-readiness',
    name: 'Compliance Readiness',
    shortName: 'Readiness',
    description: 'Foundation compliance overview — framework status and readiness checklist',
    category: 'compliance',
    tier: 'foundation',
    icon: 'FileCheck',
    color: 'indigo',
    inputs: [],
    outputs: [{ id: 'readinessScore', name: 'Readiness Score', type: 'score' }, { id: 'report', name: 'Readiness Report', type: 'report' }],
    configSchema: [],
  },
];

// =============================================================================
// HELPERS
// =============================================================================

export const getServiceById = (id: string): ServiceDefinition | undefined =>
  SERVICE_REGISTRY.find(s => s.id === id);

export const getServicesByCategory = (category: ServiceCategory): ServiceDefinition[] =>
  SERVICE_REGISTRY.filter(s => s.category === category);

export const getServicesByTier = (tier: ServiceTier): ServiceDefinition[] =>
  SERVICE_REGISTRY.filter(s => s.tier === tier);

export const getCategories = (): { id: ServiceCategory; label: string; color: string }[] => {
  const cats = new Map<ServiceCategory, { label: string; color: string }>();
  for (const s of SERVICE_REGISTRY) {
    if (!cats.has(s.category)) {
      const label = s.category.charAt(0).toUpperCase() + s.category.slice(1);
      cats.set(s.category, { label, color: s.color });
    }
  }
  return Array.from(cats.entries()).map(([id, v]) => ({ id, ...v }));
};

export const SERVICE_COUNT = SERVICE_REGISTRY.length;
