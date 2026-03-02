/**
 * Core — Platform Catalog
 *
 * Core platform infrastructure and shared utilities.
 *
 * @exports getPillarsForTier, getServicesForTier, getTierForPillar, getServiceCountByTier, getTotalServiceCount, getAllPillarIds, getAllTierIds, isPillarIncludedInTier
 * @module core/PlatformCatalog
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM CATALOG — Single Source of Truth
 * 
 * 3-Tier Architecture:
 *   Tier 1: FOUNDATION — "Make decisions → Understand them → Prove them"
 *   Tier 2: ENTERPRISE — "Harden, automate, and scale across the entire organization"
 *   Tier 3: STRATEGIC  — "From enterprise tool to strategic weapon"
 * 
 * 12 Pillars across 3 Tiers:
 *   FOUNDATION (3):  Council, Decide, DCII
 *   ENTERPRISE (5):  StressTest, Comply, Govern, Sovereign, Operate
 *   STRATEGIC  (4):  Collapse, SGAS, Verticals, Frontier
 * 
 * Identity: Decision Crisis Immunization Infrastructure (DCII)
 * Model: Sovereign-first enterprise software. Not SaaS. Annual licenses.
 */

// =============================================================================
// TIER DEFINITIONS
// =============================================================================

export type PlatformTier = 'foundation' | 'enterprise' | 'strategic';

export type PillarId =
  // Tier 1: Foundation
  | 'council'
  | 'decide'
  | 'dcii'
  // Tier 2: Enterprise
  | 'stress_test'
  | 'comply'
  | 'govern'
  | 'sovereign'
  | 'operate'
  // Tier 3: Strategic
  | 'collapse'
  | 'sgas'
  | 'verticals'
  | 'frontier';

export interface PlatformTierDefinition {
  id: PlatformTier;
  name: string;
  tagline: string;
  description: string;
  pillars: PillarId[];
  pricing: {
    pilot: string;
    annual: string;
    label: string;
  };
  color: string;
  icon: string;
}

export interface PillarDefinition {
  id: PillarId;
  tier: PlatformTier;
  name: string;
  displayName: string;
  tagline: string;
  description: string;
  icon: string;
  color: string;
  services: ServiceDefinition[];
}

export interface ServiceDefinition {
  id: string;
  name: string;
  trademarkedName?: string;
  description: string;
  category: 'core' | 'agent' | 'tool' | 'integration' | 'visualization' | 'infrastructure' | 'copilot' | 'vertical';
}

// =============================================================================
// TIER CATALOG
// =============================================================================

export const PLATFORM_TIERS: Record<PlatformTier, PlatformTierDefinition> = {
  foundation: {
    id: 'foundation',
    name: 'Foundation',
    tagline: 'Make decisions → Understand them → Prove them',
    description: 'The minimum viable platform. Every organization needs these three capabilities. The Council produces decisions, DECIDE analyzes them, DCII proves them.',
    pillars: ['council', 'decide', 'dcii'],
    pricing: {
      pilot: '$50,000 (90 days, 1 business unit)',
      annual: '$150,000–$500,000',
      label: 'Foundation License',
    },
    color: '#3B82F6',
    icon: '🏛️',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    tagline: 'Harden, automate, and scale across the entire organization',
    description: 'Stress-test decisions before reality does. Stay compliant across jurisdictions. Enforce governance. Own the infrastructure. Put AI co-pilots in every department.',
    pillars: ['stress_test', 'comply', 'govern', 'sovereign', 'operate'],
    pricing: {
      pilot: 'Included with Enterprise license',
      annual: '$500,000–$1,500,000',
      label: 'Enterprise License',
    },
    color: '#8B5CF6',
    icon: '⚡',
  },
  strategic: {
    id: 'strategic',
    name: 'Strategic',
    tagline: 'From enterprise tool to strategic weapon',
    description: 'Simulate institutional failure. Model societal-scale impacts. Dominate your industry with turn-key verticals. Operate at nation-scale.',
    pillars: ['collapse', 'sgas', 'verticals', 'frontier'],
    pricing: {
      pilot: 'Custom engagement',
      annual: '$2,000,000–$100,000,000+',
      label: 'Strategic License',
    },
    color: '#F59E0B',
    icon: '👑',
  },
};

// =============================================================================
// PILLAR CATALOG
// =============================================================================

export const PLATFORM_PILLARS: Record<PillarId, PillarDefinition> = {

  // ---------------------------------------------------------------------------
  // TIER 1: FOUNDATION
  // ---------------------------------------------------------------------------

  council: {
    id: 'council',
    tier: 'foundation',
    name: 'The Council',
    displayName: 'THE COUNCIL',
    tagline: 'The engine that produces decisions',
    description: 'Multi-agent AI deliberation system. 14 C-Suite agents debate decisions with cross-examination, veto powers, and real-time visualization.',
    icon: '🧠',
    color: '#3B82F6',
    services: [
      { id: 'core_agents', name: 'Core 14 C-Suite Agents', description: 'CFO, CTO, CISO, CLO, COO, CMO, CHRO, CRO, Analyst, Arbiter, Red Team, Union Rep + 2 synthesizers debate decisions', category: 'agent' },
      { id: 'premium_agent_packs', name: 'Premium Agent Packs', description: 'Industry-specialized agents (Healthcare, Finance, Legal, Audit) that join Council deliberation', category: 'agent' },
      { id: 'veto_agents', name: 'CendiaVeto™ Agents', trademarkedName: 'CendiaVeto™', description: '6 agents with blocking power during deliberation (CISO, CLO, CFO, Ethics, Risk, Compliance)', category: 'agent' },
      { id: 'union_agents', name: 'CendiaUnion™ Agents', trademarkedName: 'CendiaUnion™', description: '4 worker representation voices in deliberation (Labor, Safety, Wellbeing, Equity)', category: 'agent' },
      { id: 'ai_tech_team', name: 'AI Tech Team', description: '13 Dev, QA, DevOps, SRE agents that maintain the platform via deliberation', category: 'agent' },
      { id: 'persona_forge', name: 'PersonaForge™', trademarkedName: 'PersonaForge™', description: 'Create custom agents with personality traits — the agent factory', category: 'tool' },
      { id: 'personality_system', name: 'Personality System', description: '60 configurable traits that make agents behave like real humans', category: 'core' },
      { id: 'cendia_live', name: 'CendiaLive™', trademarkedName: 'CendiaLive™', description: 'Watch agents debate in real-time with avatars — the demo moment', category: 'visualization' },
      { id: 'cendia_replay', name: 'CendiaReplay™', trademarkedName: 'CendiaReplay™', description: 'Rewatch past deliberations with full timeline', category: 'visualization' },
      { id: 'council_video', name: 'Council Video Simulation', description: 'Human-like avatar video deliberations', category: 'visualization' },
      { id: 'council_modes', name: '12 Council Modes', description: 'War Room, Crisis, Due Diligence, Innovation Lab, Compliance, etc.', category: 'core' },
      { id: 'post_deliberation', name: 'Post-Deliberation Panel', description: 'After-action analysis of Council sessions', category: 'tool' },
      { id: 'user_intervention', name: 'User Intervention Panel', description: 'Humans intervene mid-deliberation (human-in-the-loop)', category: 'tool' },
      { id: 'workflow_picker', name: 'Workflow Picker', description: 'Pre-built decision workflows to start Council sessions', category: 'tool' },
      { id: 'mode_selector', name: 'Mode Selector', description: 'Switch between deliberation modes', category: 'tool' },
      { id: 'courtroom_layout', name: 'Courtroom Layout', description: 'Legal-style deliberation view', category: 'visualization' },
      { id: 'exec_summary_gen', name: 'Executive Summary Generator', description: 'Auto-generate summaries of deliberations', category: 'tool' },
      { id: 'live_agent_monitor', name: 'Live Agent Monitor', description: 'Real-time agent activity tracking ops dashboard', category: 'visualization' },
    ],
  },

  decide: {
    id: 'decide',
    tier: 'foundation',
    name: 'DECIDE',
    displayName: 'DECIDE',
    tagline: 'Intelligence about every decision',
    description: 'The intelligence layer. Before, during, and after every decision — predict failures, model consequences, track outcomes, and learn.',
    icon: '🔍',
    color: '#10B981',
    services: [
      { id: 'chronos', name: 'CendiaChronos™', trademarkedName: 'CendiaChronos™', description: 'Time machine — replay past decisions, fork what-if futures', category: 'core' },
      { id: 'premortem', name: 'CendiaPreMortem™', trademarkedName: 'CendiaPreMortem™', description: 'Predicts why a decision will fail BEFORE you make it', category: 'core' },
      { id: 'ghost_board', name: 'Ghost Board™', trademarkedName: 'Ghost Board™', description: 'Rehearse presentations against tough AI directors', category: 'core' },
      { id: 'decision_debt', name: 'Decision Debt™', trademarkedName: 'Decision Debt™', description: 'Shows cost of NOT deciding ($/day of delay)', category: 'core' },
      { id: 'echo', name: 'CendiaEcho™', trademarkedName: 'CendiaEcho™', description: 'Tracks actual outcomes vs. predictions', category: 'core' },
      { id: 'cascade', name: 'CendiaCascade™', trademarkedName: 'CendiaCascade™', description: 'Maps second/third-order consequences', category: 'core' },
      { id: 'lens', name: 'CendiaLens™', trademarkedName: 'CendiaLens™', description: 'Look inside AI reasoning — token confidence, attention, bias', category: 'core' },
      { id: 'gnosis', name: 'CendiaGnosis™', trademarkedName: 'CendiaGnosis™', description: 'Org learning intelligence — skills, knowledge gaps', category: 'core' },
      { id: 'genomics', name: 'CendiaGenomics™', trademarkedName: 'CendiaGenomics™', description: 'Org DNA mapping, skill matrices, capability assessment', category: 'core' },
      { id: 'deliberation_viz', name: 'Deliberation Visualization', description: 'Visual graph of agent interactions during decisions', category: 'visualization' },
      { id: 'replay_theater', name: 'Decision Replay Theater', description: 'Cinematic replay of decisions with timeline', category: 'visualization' },
      { id: 'consensus_builder', name: 'Consensus Builder', description: 'Multi-stakeholder alignment, voting mechanisms', category: 'tool' },
      { id: 'what_if', name: 'What-If Scenarios', description: 'Model multiple futures with sensitivity analysis', category: 'tool' },
      { id: 'synthesis_engine', name: 'Synthesis Engine', description: 'Multi-source intelligence fusion', category: 'core' },
      { id: 'rdp', name: 'RDP Service', description: 'Research / Discovery / Planning engine', category: 'core' },
      { id: 'orbit', name: 'CendiaOrbit™', trademarkedName: 'CendiaOrbit™', description: 'Orbital view of the organization', category: 'visualization' },
    ],
  },

  dcii: {
    id: 'dcii',
    tier: 'foundation',
    name: 'DCII',
    displayName: 'DCII',
    tagline: 'Prove decisions survive scrutiny',
    description: 'Decision Crisis Immunization Infrastructure. The 9 primitives + cryptographic proof infrastructure. When regulators, courts, or shareholders challenge your decisions, DCII is what you show them.',
    icon: '💥',
    color: '#EF4444',
    services: [
      { id: 'nine_primitives', name: '9 Decision Primitives (P1–P9)', description: 'The framework: Discovery-Time Proof, Deliberation Capture, Override Accountability, Continuity Memory, Drift Detection, Cognitive Bias Mitigation, Quantum-Resistant Integrity, Synthetic Media Authentication, Cross-Jurisdiction Compliance', category: 'core' },
      { id: 'vault', name: 'CendiaVault™', trademarkedName: 'CendiaVault™', description: 'Immutable evidence storage, SHA-256, Merkle trees (P1, P2, P7)', category: 'infrastructure' },
      { id: 'notary', name: 'CendiaNotary™', trademarkedName: 'CendiaNotary™', description: 'Customer-owned key signing — AWS KMS, Azure, HSM (P3, P7)', category: 'infrastructure' },
      { id: 'ledger', name: 'CendiaLedger™ / CendiaAudit™', trademarkedName: 'CendiaLedger™', description: 'Hash-chained audit trail (P2, P5)', category: 'infrastructure' },
      { id: 'witness', name: 'CendiaWitness™', trademarkedName: 'CendiaWitness™', description: 'Independent verification without third party (P1, P3)', category: 'infrastructure' },
      { id: 'timestamp', name: 'CendiaTimestamp™', trademarkedName: 'CendiaTimestamp™', description: 'RFC 3161 multi-provider timestamping (P1)', category: 'infrastructure' },
      { id: 'media_auth', name: 'CendiaMediaAuth™', trademarkedName: 'CendiaMediaAuth™', description: 'Deepfake/synthetic media detection, C2PA provenance (P8)', category: 'core' },
      { id: 'jurisdiction', name: 'CendiaJurisdiction™', trademarkedName: 'CendiaJurisdiction™', description: '17 jurisdictions, conflict detection, good-faith documentation (P9)', category: 'core' },
      { id: 'iiss', name: 'CendiaIISS™', trademarkedName: 'CendiaIISS™', description: '0–1000 institutional resilience score across all 9 primitives', category: 'core' },
      { id: 'similarity', name: 'CendiaSimilarity™', trademarkedName: 'CendiaSimilarity™', description: 'Semantic decision search, outcome-aware recommendations', category: 'core' },
      { id: 'responsibility', name: 'CendiaResponsibility™', trademarkedName: 'CendiaResponsibility™', description: 'TPM-signed accountability records, delegation chains (P3)', category: 'infrastructure' },
      { id: 'decision_dna', name: 'Decision DNA / Provenance', description: 'Full decision lineage, Merkle trees (P1, P2)', category: 'core' },
      { id: 'decision_packets', name: 'Decision Packets', description: 'Cryptographically signed deliberation outputs', category: 'core' },
      { id: 'evidence_export', name: 'Evidence Export', description: 'Court-admissible PDF bundles', category: 'tool' },
      { id: 'regulators_receipt', name: "Regulator's Receipt™", trademarkedName: "Regulator's Receipt™", description: 'One-click court-admissible PDF — the demo moment', category: 'tool' },
      { id: 'signed_test_reports', name: 'Signed Test Reports', description: 'Cryptographically signed test results', category: 'tool' },
      { id: 'audit_provenance', name: 'Audit Provenance', description: 'Visual audit trail viewer', category: 'visualization' },
      { id: 'statement_of_facts', name: 'Statement of Facts', description: 'Auto-generated legal statement from deliberation data', category: 'tool' },
      { id: 'memory', name: 'CendiaMemory™ / Pantheon', trademarkedName: 'CendiaMemory™', description: 'Institutional long-term memory (P4)', category: 'infrastructure' },
      { id: 'truth', name: 'CendiaTruth™', trademarkedName: 'CendiaTruth™', description: 'Claim verification, fact validation', category: 'core' },
      { id: 'bias_mitigation', name: 'CendiaBiasMitigation™', trademarkedName: 'CendiaBiasMitigation™', description: '12 cognitive bias types tested per deliberation (P6)', category: 'core' },
    ],
  },

  // ---------------------------------------------------------------------------
  // TIER 2: ENTERPRISE
  // ---------------------------------------------------------------------------

  stress_test: {
    id: 'stress_test',
    tier: 'enterprise',
    name: 'STRESS-TEST',
    displayName: 'STRESS-TEST',
    tagline: 'Attack decisions before reality does',
    description: 'Industrial-strength adversarial testing. Red-team decisions with Monte Carlo simulations, war games, and runtime security monitoring.',
    icon: '⚡',
    color: '#F97316',
    services: [
      { id: 'crucible', name: 'CendiaCrucible™', trademarkedName: 'CendiaCrucible™', description: 'Enterprise red-teaming with Monte Carlo simulation, SBOM, runtime security', category: 'core' },
      { id: 'red_team', name: 'CendiaRedTeam™', trademarkedName: 'CendiaRedTeam™', description: '8 adversarial perspectives attacking decisions', category: 'core' },
      { id: 'war_games', name: 'War Games', description: 'Strategic war game simulation — competitive scenario modeling', category: 'core' },
      { id: 'scge', name: 'SCGE (5 components)', description: 'Synthetic Crisis Governance Engine — inject crises, simulate populations', category: 'core' },
      { id: 'monte_carlo', name: 'Monte Carlo Engine', description: 'Statistical simulation of thousands of scenarios', category: 'core' },
      { id: 'runtime_security', name: 'Runtime Security', description: 'Live security monitoring and anomaly detection', category: 'infrastructure' },
      { id: 'sbom', name: 'SBOM Service', description: 'Software Bill of Materials — supply chain security', category: 'infrastructure' },
    ],
  },

  comply: {
    id: 'comply',
    tier: 'enterprise',
    name: 'COMPLY',
    displayName: 'COMPLY',
    tagline: 'Stay legal everywhere, automatically',
    description: 'Automated compliance across 17 jurisdictions and 10 frameworks. Scan, ingest, monitor, enforce, prove, insure, and future-proof.',
    icon: '✅',
    color: '#22C55E',
    services: [
      { id: 'panopticon', name: 'CendiaPanopticon™ / Oversight', trademarkedName: 'CendiaPanopticon™', description: 'Real-time regulatory radar, auto-updates policies', category: 'core' },
      { id: 'regulatory_absorb', name: 'Regulatory Absorb™ V2', trademarkedName: 'Regulatory Absorb™', description: 'Upload 500-page regulation → AI learns it in 60 seconds', category: 'core' },
      { id: 'compliance_monitor', name: 'Compliance Monitor', description: 'Always-on compliance drift detection', category: 'core' },
      { id: 'compliance_enforcer', name: 'Compliance Enforcer', description: 'Automated constraint enforcement', category: 'core' },
      { id: 'compliance_guard', name: 'ComplianceGuard', description: 'Blocks non-compliant decisions in real-time', category: 'core' },
      { id: 'compliance_frameworks', name: '10 Compliance Frameworks', description: 'SOC2, GDPR, HIPAA, ISO27001, PCI, DORA, EU AI Act, NIST AI RMF, CCPA, FDA', category: 'core' },
      { id: 'cross_jurisdiction_engine', name: 'Cross-Jurisdiction Engine', description: 'Multi-jurisdiction compliance checking', category: 'core' },
      { id: 'sandbox', name: 'CendiaSandbox™', trademarkedName: 'CendiaSandbox™', description: 'Test decisions against PROPOSED regulations', category: 'core' },
      { id: 'zkp', name: 'CendiaZKP™', trademarkedName: 'CendiaZKP™', description: 'Zero-knowledge compliance proofs', category: 'core' },
      { id: 'insure', name: 'CendiaInsure™', trademarkedName: 'CendiaInsure™', description: 'Per-decision liability coverage, real-time risk scoring', category: 'core' },
    ],
  },

  govern: {
    id: 'govern',
    tier: 'enterprise',
    name: 'GOVERN',
    displayName: 'GOVERN',
    tagline: 'Rules, oversight, and accountability',
    description: 'Internal rules: policies, approvals, veto rights, whistleblower protections. The organizational constitution.',
    icon: '⚖️',
    color: '#6366F1',
    services: [
      { id: 'govern_core', name: 'CendiaGovern™', trademarkedName: 'CendiaGovern™', description: 'Policy management, RBAC, approval workflows', category: 'core' },
      { id: 'court', name: 'CendiaCourt™', trademarkedName: 'CendiaCourt™', description: 'AI dispute resolution with precedent tracking', category: 'core' },
      { id: 'veto_system', name: 'CendiaVeto™ (system)', trademarkedName: 'CendiaVeto™', description: 'Proposal veto system with 6 specialized agents', category: 'core' },
      { id: 'dissent', name: 'CendiaDissent™', trademarkedName: 'CendiaDissent™', description: 'Protected whistleblower channels, retaliation monitoring', category: 'core' },
      { id: 'autopilot', name: 'CendiaAutopilot™', trademarkedName: 'CendiaAutopilot™', description: 'Autonomous AI decisions with human-in-the-loop', category: 'core' },
      { id: 'union_system', name: 'CendiaUnion™ (system)', trademarkedName: 'CendiaUnion™', description: 'Worker representation, burnout scoring, labor governance', category: 'core' },
      { id: 'logic_gate', name: 'Logic Gate', description: 'Auto approve/block decision rules engine', category: 'tool' },
      { id: 'realtime_policy', name: 'Real-Time Policy Enforcement', description: 'Live veto-based governance during deliberation', category: 'core' },
    ],
  },

  sovereign: {
    id: 'sovereign',
    tier: 'enterprise',
    name: 'SOVEREIGN',
    displayName: 'SOVEREIGN',
    tagline: 'Your infrastructure, your keys, your proof',
    description: 'Air-gapped, on-premises, and hybrid deployments. Customer-owned encryption keys, post-quantum cryptography, and full data sovereignty.',
    icon: '🔒',
    color: '#64748B',
    services: [
      { id: 'sovereign_patterns', name: '21 Sovereign Patterns', description: 'Data Diode, Shadow Council, QR Air-Gap, TPM, Canary, etc.', category: 'infrastructure' },
      { id: 'key_management', name: 'Key Management', description: 'AWS KMS, Azure Key Vault, HashiCorp Vault, local HSM', category: 'infrastructure' },
      { id: 'post_quantum_kms', name: 'Post-Quantum KMS', description: 'Dilithium, SPHINCS+, Falcon signatures (NIST FIPS 204/205)', category: 'infrastructure' },
      { id: 'black_box', name: 'CendiaBlackBox™', trademarkedName: 'CendiaBlackBox™', description: 'Sealed decision recording — opens only in emergencies', category: 'infrastructure' },
      { id: 'mirage', name: 'CendiaMirage™', trademarkedName: 'CendiaMirage™', description: 'Decoy/deception technology to confuse attackers', category: 'infrastructure' },
      { id: 'glass', name: 'CendiaGlass™', trademarkedName: 'CendiaGlass™', description: 'Full transparency mode for auditors', category: 'infrastructure' },
      { id: 'federated_mesh', name: 'Federated Mesh', description: 'Multi-org deployment without sharing data', category: 'infrastructure' },
      { id: 'local_rlhf', name: 'Local RLHF', description: 'On-prem AI training — no data leaves', category: 'infrastructure' },
      { id: 'portable_instance', name: 'Portable Instance', description: 'Run from USB/portable device — suitcase deployment', category: 'infrastructure' },
      { id: 'siem_integration', name: 'SIEM Integration', description: 'Feed security events to existing SIEM infrastructure', category: 'integration' },
      { id: 'security_middleware', name: 'Security Middleware', description: 'Rate limiting, CSRF, honeypots — defense-in-depth', category: 'infrastructure' },
      { id: 'load_optimization', name: 'Load Optimization', description: 'Air-gapped scaling and resource management', category: 'infrastructure' },
      { id: 'cendia_sovereign', name: 'CendiaSovereign™', trademarkedName: 'CendiaSovereign™', description: 'LLM cluster orchestration, full data sovereignty', category: 'infrastructure' },
      { id: 'cac_piv', name: 'CAC/PIV Auth', description: 'Military smart card authentication', category: 'infrastructure' },
    ],
  },

  operate: {
    id: 'operate',
    tier: 'enterprise',
    name: 'OPERATE',
    displayName: 'CendiaOps™',
    tagline: 'AI co-pilots for every department',
    description: '19 department co-pilots, enterprise tools, and self-healing infrastructure. Your organization runs on AI co-pilots.',
    icon: '🏢',
    color: '#0EA5E9',
    services: [
      // Department Co-Pilots (19)
      { id: 'ops_brand', name: 'CendiaBrand', description: 'Brand management co-pilot', category: 'copilot' },
      { id: 'ops_foundry', name: 'CendiaFoundry', description: 'Product development co-pilot', category: 'copilot' },
      { id: 'ops_revenue', name: 'CendiaRevenue', description: 'Revenue operations co-pilot', category: 'copilot' },
      { id: 'ops_support', name: 'CendiaSupport', description: 'Customer support co-pilot', category: 'copilot' },
      { id: 'ops_watch', name: 'CendiaWatch', description: 'Monitoring co-pilot', category: 'copilot' },
      { id: 'ops_procure', name: 'CendiaProcure', description: 'Procurement co-pilot', category: 'copilot' },
      { id: 'ops_scout', name: 'CendiaScout', description: 'Competitive intelligence co-pilot', category: 'copilot' },
      { id: 'ops_rainmaker', name: 'CendiaRainmaker', description: 'Sales co-pilot', category: 'copilot' },
      { id: 'ops_regent', name: 'CendiaRegent', description: 'Executive assistant co-pilot', category: 'copilot' },
      { id: 'ops_habitat', name: 'CendiaHabitat', description: 'Facilities/workspace co-pilot', category: 'copilot' },
      { id: 'ops_guardian', name: 'CendiaGuardian', description: 'Security operations co-pilot', category: 'copilot' },
      { id: 'ops_nerve', name: 'CendiaNerve', description: 'IT operations co-pilot', category: 'copilot' },
      { id: 'ops_docket', name: 'CendiaDocket', description: 'Legal operations co-pilot', category: 'copilot' },
      { id: 'ops_equity', name: 'CendiaEquity', description: 'HR/People operations co-pilot', category: 'copilot' },
      { id: 'ops_mesh_ma', name: 'CendiaMesh M&A', description: 'M&A integration co-pilot', category: 'copilot' },
      { id: 'ops_factory', name: 'CendiaFactory', description: 'Manufacturing operations co-pilot', category: 'copilot' },
      { id: 'ops_transit', name: 'CendiaTransit', description: 'Logistics co-pilot', category: 'copilot' },
      { id: 'ops_academy', name: 'CendiaAcademy', description: 'Training & development co-pilot', category: 'copilot' },
      { id: 'ops_resonance', name: 'CendiaResonance', description: 'Communications co-pilot', category: 'copilot' },
      // Enterprise Tools
      { id: 'mesh', name: 'CendiaMesh', description: 'Integration framework for enterprise systems', category: 'integration' },
      { id: 'command', name: 'CendiaCommand', description: 'CLI for platform management', category: 'tool' },
      { id: 'crisis', name: 'CendiaCrisis', description: 'Incident response automation', category: 'tool' },
      { id: 'roi', name: 'CendiaROI', description: 'Governance ROI measurement and reporting', category: 'tool' },
      { id: 'omni_translate', name: 'CendiaOmniTranslate™', trademarkedName: 'CendiaOmniTranslate™', description: '100+ language enterprise translation', category: 'tool' },
      { id: 'carbon', name: 'CendiaCarbon™', trademarkedName: 'CendiaCarbon™', description: 'Carbon-aware AI scheduling, ESG reporting', category: 'tool' },
      { id: 'voice', name: 'CendiaVoice', description: 'Voice commands for platform interaction', category: 'tool' },
      { id: 'training', name: 'CendiaTraining', description: 'Onboarding and training platform', category: 'tool' },
      { id: 'pulse', name: 'CendiaPulse', description: 'Mission control dashboard', category: 'visualization' },
      // Self-Healing
      { id: 'apotheosis', name: 'CendiaApotheosis™', trademarkedName: 'CendiaApotheosis™', description: 'Nightly AI self-improvement, red-teaming, pattern banning', category: 'core' },
      { id: 'autoheal', name: 'CendiaAutoHeal', description: 'Self-diagnosing debugging and auto-recovery', category: 'core' },
    ],
  },

  // ---------------------------------------------------------------------------
  // TIER 3: STRATEGIC
  // ---------------------------------------------------------------------------

  collapse: {
    id: 'collapse',
    tier: 'strategic',
    name: 'RESILIENCE',
    displayName: 'RESILIENCE',
    tagline: 'Institutional survival systems',
    description: 'Simulate institutional collapse, build automated recovery, preserve knowledge across centuries, and detect long-range trends before competitors.',
    icon: '�️',
    color: '#DC2626',
    services: [
      { id: 'collapse_sim', name: 'COLLAPSE (Institutional Failure Simulation)', description: 'Model institutional collapse — leadership vacuum, market failure, regulatory destruction, societal disruption', category: 'core' },
      { id: 'phoenix', name: 'CendiaPhoenix™', trademarkedName: 'CendiaPhoenix™', description: 'Institutional recovery framework — automated recovery from catastrophic events', category: 'core' },
      { id: 'eternal', name: 'CendiaEternal™', trademarkedName: 'CendiaEternal™', description: 'Century-grade preservation — knowledge survives 100+ years with format migration', category: 'core' },
      { id: 'horizon', name: 'CendiaHorizon™', trademarkedName: 'CendiaHorizon™', description: 'Long-range trend detection — 5-20 year societal, technological, economic analysis', category: 'core' },
      { id: 'succession_engine', name: 'Succession Engine', description: 'Automated leadership succession — identify, develop, and deploy successors', category: 'core' },
      { id: 'institutional_memory_arch', name: 'Institutional Memory Architecture', description: 'Multi-generational knowledge architecture surviving leadership generations', category: 'core' },
    ],
  },

  sgas: {
    id: 'sgas',
    tier: 'strategic',
    name: 'MODEL',
    displayName: 'MODEL',
    tagline: 'Understand society before you act on it',
    description: 'Agent-based population modeling, stakeholder voice assembly, societal narrative analysis, and policy impact simulation at national scale.',
    icon: '🌐',
    color: '#0D9488',
    services: [
      { id: 'sgas_core', name: 'SGAS (Societal Governance Agent System)', description: 'Agent-based population modeling — simulate millions of agents with demographic/economic/behavioral attributes', category: 'core' },
      { id: 'vox', name: 'CendiaVox™', trademarkedName: 'CendiaVox™', description: 'Stakeholder voice assembly — simulate and represent stakeholder perspectives at scale', category: 'core' },
      { id: 'narratives', name: 'CendiaNarratives™', trademarkedName: 'CendiaNarratives™', description: 'Societal narrative modeling — understand and shape public narratives', category: 'core' },
      { id: 'synthetic_population', name: 'Synthetic Population Engine', description: 'Generate statistically accurate populations for simulation', category: 'core' },
      { id: 'policy_impact', name: 'Policy Impact Simulator', description: 'Model policy effects before implementation — economic, social, behavioral', category: 'core' },
    ],
  },

  verticals: {
    id: 'verticals',
    tier: 'strategic',
    name: 'DOMINATE',
    displayName: 'DOMINATE',
    tagline: 'Own your industry',
    description: '8 deep industry verticals with 48+ modes per vertical, M&A integration, and AR deliberation overlay.',
    icon: '🏭',
    color: '#A855F7',
    services: [
      { id: 'vertical_legal', name: 'Legal Vertical', description: 'Deal Room, Litigation War Room, Contract Forge, Regulatory Tracker, eDiscovery AI, Judicial Analytics', category: 'vertical' },
      { id: 'vertical_healthcare', name: 'Healthcare Vertical', description: 'Clinical Decision Support, Patient Safety, HIPAA Automation, Clinical Trial Governance, Population Health', category: 'vertical' },
      { id: 'vertical_financial', name: 'Finance Vertical', description: 'Trading Governance, Credit Risk AI, AML/KYC Automation, Basel III Compliance, Fraud Detection', category: 'vertical' },
      { id: 'vertical_sports', name: 'Sports Vertical', description: 'Transfer Governance, Salary Cap, Player Welfare, Anti-Doping, Match Integrity, Club Licensing', category: 'vertical' },
      { id: 'vertical_energy', name: 'Energy Vertical', description: 'Grid Governance, Safety Compliance, Carbon Trading, Nuclear Regulatory, Pipeline Integrity', category: 'vertical' },
      { id: 'vertical_defense', name: 'Defense Vertical', description: 'CMMC Compliance, Weapons System Governance, Intelligence Analysis, ITAR, Mission Planning', category: 'vertical' },
      { id: 'vertical_government', name: 'Government Vertical', description: 'Public Policy, Budget Governance, Procurement Compliance, Emergency Management, Legislative Analysis', category: 'vertical' },
      { id: 'vertical_insurance', name: 'Insurance Vertical', description: 'Underwriting AI, Claims Governance, Actuarial Modeling, Risk Assessment, Fraud Detection', category: 'vertical' },
      { id: 'mesh_ma', name: 'CendiaMesh™ (M&A Integration)', trademarkedName: 'CendiaMesh™', description: 'Post-merger cultural DNA mapping, integration planning, system harmonization', category: 'core' },
      { id: 'glass_ar', name: 'CendiaGlass™ (AR Overlay)', trademarkedName: 'CendiaGlass™', description: 'Augmented reality deliberation overlay — see AI analysis in physical boardroom', category: 'visualization' },
    ],
  },

  frontier: {
    id: 'frontier',
    tier: 'strategic',
    name: 'NATION',
    displayName: 'NATION',
    tagline: 'Governance at national scale',
    description: 'National-scale governance platform — policy modeling, citizen engagement, multi-agency coordination, and sovereign national infrastructure.',
    icon: '🌍',
    color: '#B45309',
    services: [
      { id: 'nation', name: 'CendiaNation™', trademarkedName: 'CendiaNation™', description: 'National-scale governance platform — policy modeling, citizen engagement, multi-agency coordination', category: 'core' },
      { id: 'national_compliance', name: 'National Compliance Framework', description: 'Country-wide regulatory compliance across all agencies, departments, and SOEs', category: 'core' },
      { id: 'multi_agency', name: 'Multi-Agency Coordination', description: 'Cross-department coordination for national governments — budget, policy, operations', category: 'core' },
      { id: 'sovereign_national', name: 'Sovereign National Infrastructure', description: 'National-scale sovereign deployment — all data stays within borders', category: 'infrastructure' },
    ],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/** Get all pillars for a given tier */
export function getPillarsForTier(tier: PlatformTier): PillarDefinition[] {
  return PLATFORM_TIERS[tier].pillars.map(id => PLATFORM_PILLARS[id]);
}

/** Get all services for a given tier */
export function getServicesForTier(tier: PlatformTier): ServiceDefinition[] {
  return getPillarsForTier(tier).flatMap(p => p.services);
}

/** Get the tier a pillar belongs to */
export function getTierForPillar(pillarId: PillarId): PlatformTier {
  return PLATFORM_PILLARS[pillarId].tier;
}

/** Get total service count per tier */
export function getServiceCountByTier(): Record<PlatformTier, number> {
  return {
    foundation: getServicesForTier('foundation').length,
    enterprise: getServicesForTier('enterprise').length,
    strategic: getServicesForTier('strategic').length,
  };
}

/** Get total service count */
export function getTotalServiceCount(): number {
  return Object.values(PLATFORM_PILLARS).reduce((sum, p) => sum + p.services.length, 0);
}

/** Get all pillar IDs */
export function getAllPillarIds(): PillarId[] {
  return Object.keys(PLATFORM_PILLARS) as PillarId[];
}

/** Get all tier IDs */
export function getAllTierIds(): PlatformTier[] {
  return ['foundation', 'enterprise', 'strategic'];
}

/** Check if a pillar is included in a given tier (tier includes all lower tiers) */
export function isPillarIncludedInTier(pillarId: PillarId, tier: PlatformTier): boolean {
  const tierOrder: PlatformTier[] = ['foundation', 'enterprise', 'strategic'];
  const pillarTier = getTierForPillar(pillarId);
  return tierOrder.indexOf(pillarTier) <= tierOrder.indexOf(tier);
}

/** Get the complete platform summary */
export function getPlatformSummary() {
  const tiers = getAllTierIds().map(tid => {
    const tier = PLATFORM_TIERS[tid];
    const pillars = getPillarsForTier(tid);
    return {
      ...tier,
      pillarCount: pillars.length,
      serviceCount: pillars.reduce((s, p) => s + p.services.length, 0),
      pillars: pillars.map(p => ({
        id: p.id,
        name: p.displayName,
        tagline: p.tagline,
        serviceCount: p.services.length,
      })),
    };
  });

  return {
    version: '3.0.0',
    identity: 'Decision Crisis Immunization Infrastructure (DCII)',
    model: 'Sovereign-first enterprise software. Not SaaS. Annual licenses.',
    tierCount: 3,
    pillarCount: Object.keys(PLATFORM_PILLARS).length,
    totalServices: getTotalServiceCount(),
    tiers,
  };
}
