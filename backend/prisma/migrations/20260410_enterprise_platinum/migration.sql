-- Enterprise Platinum Schema Migration
-- Creates tables for all enterprise platinum services
-- April 10, 2026

-- =============================================================================
-- POLICY AUTHORING
-- =============================================================================

CREATE TABLE IF NOT EXISTS compliance_policies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    domain TEXT NOT NULL CHECK (domain IN ('governance', 'compliance', 'security', 'data_protection', 'ai_ethics', 'financial', 'operational')),
    version TEXT NOT NULL DEFAULT '1.0.0',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'active', 'deprecated', 'archived')),
    rules JSONB NOT NULL DEFAULT '[]',
    conditions JSONB NOT NULL DEFAULT '[]',
    actions JSONB NOT NULL DEFAULT '[]',
    metadata JSONB NOT NULL DEFAULT '{}',
    created_by TEXT NOT NULL,
    approved_by TEXT,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_versions (
    id SERIAL PRIMARY KEY,
    policy_id TEXT NOT NULL REFERENCES compliance_policies(id) ON DELETE CASCADE,
    version TEXT NOT NULL,
    changes TEXT,
    changed_by TEXT NOT NULL,
    diff JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS policy_simulation_results (
    id TEXT PRIMARY KEY,
    policy_id TEXT NOT NULL REFERENCES compliance_policies(id) ON DELETE CASCADE,
    policy_version TEXT NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_ms INTEGER NOT NULL DEFAULT 0,
    summary JSONB NOT NULL DEFAULT '{}',
    results JSONB NOT NULL DEFAULT '[]'
);

-- =============================================================================
-- AI MODEL REGISTRY
-- =============================================================================

CREATE TABLE IF NOT EXISTS ai_models (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('classification', 'regression', 'generation', 'embedding', 'multi_modal', 'reinforcement', 'other')),
    version TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'testing', 'pending_approval', 'approved', 'deployed', 'deprecated', 'retired')),
    owner TEXT NOT NULL,
    team TEXT,
    provider TEXT,
    framework TEXT,
    tags TEXT[] DEFAULT '{}',
    metrics JSONB NOT NULL DEFAULT '{}',
    lineage JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_approvals (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    stage TEXT NOT NULL CHECK (stage IN ('technical_review', 'bias_review', 'compliance_review', 'business_review', 'final_approval')),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'revisions_requested')),
    reviewer TEXT,
    reviewed_at TIMESTAMPTZ,
    comments TEXT,
    conditions TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_deployments (
    id TEXT PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    environment TEXT NOT NULL CHECK (environment IN ('development', 'staging', 'production')),
    endpoint TEXT,
    deployed_by TEXT NOT NULL,
    deployed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'failed')),
    traffic_percent DECIMAL(5,2) DEFAULT 100,
    config JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS model_bias_audits (
    id SERIAL PRIMARY KEY,
    model_id TEXT NOT NULL REFERENCES ai_models(id) ON DELETE CASCADE,
    audit_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    auditor TEXT NOT NULL,
    overall_score DECIMAL(5,2),
    protected_attributes JSONB NOT NULL DEFAULT '[]',
    recommendations TEXT[],
    next_audit_date TIMESTAMPTZ
);

-- =============================================================================
-- REMEDIATION TICKETS
-- =============================================================================

CREATE TABLE IF NOT EXISTS remediation_connectors (
    id TEXT PRIMARY KEY,
    provider TEXT NOT NULL CHECK (provider IN ('servicenow', 'jira', 'azure_devops', 'github', 'internal')),
    name TEXT NOT NULL,
    base_url TEXT NOT NULL,
    project_key TEXT,
    mappings JSONB NOT NULL DEFAULT '[]',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sync_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    sync_interval INTEGER DEFAULT 0,
    last_sync_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS remediation_tickets (
    id TEXT PRIMARY KEY,
    external_id TEXT,
    external_url TEXT,
    provider TEXT NOT NULL,
    connector_id TEXT REFERENCES remediation_connectors(id),
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT NOT NULL CHECK (priority IN ('p1_critical', 'p2_high', 'p3_medium', 'p4_low')),
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'assigned', 'in_progress', 'pending_verification', 'resolved', 'closed', 'reopened')),
    assignee TEXT,
    trigger_source TEXT NOT NULL,
    trigger_entity_id TEXT,
    sla JSONB NOT NULL DEFAULT '{}',
    evidence JSONB NOT NULL DEFAULT '[]',
    timeline JSONB NOT NULL DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ
);

-- =============================================================================
-- STAKEHOLDER PORTALS
-- =============================================================================

CREATE TABLE IF NOT EXISTS stakeholder_portals (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('auditor', 'regulator', 'customer', 'partner', 'internal')),
    organization_id TEXT NOT NULL,
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS portal_members (
    id TEXT PRIMARY KEY,
    portal_id TEXT NOT NULL REFERENCES stakeholder_portals(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL,
    access_level TEXT NOT NULL CHECK (access_level IN ('view', 'comment', 'edit', 'admin')),
    invited_by TEXT NOT NULL,
    invited_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_access_at TIMESTAMPTZ,
    mfa_required BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS evidence_shares (
    id TEXT PRIMARY KEY,
    portal_id TEXT NOT NULL REFERENCES stakeholder_portals(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    document_type TEXT NOT NULL,
    file_url TEXT,
    shared_by TEXT NOT NULL,
    shared_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    access_controls JSONB NOT NULL DEFAULT '[]',
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    audit_trail JSONB NOT NULL DEFAULT '[]'
);

-- =============================================================================
-- ZKP PROOFS
-- =============================================================================

CREATE TABLE IF NOT EXISTS zkp_proofs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('compliance_attestation', 'data_handling', 'age_verification', 'jurisdiction', 'certification', 'threshold', 'membership')),
    claim TEXT NOT NULL,
    proof_data JSONB NOT NULL,
    verification_key TEXT NOT NULL,
    issuer TEXT NOT NULL,
    subject TEXT NOT NULL,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'expired', 'revoked')),
    metadata JSONB NOT NULL DEFAULT '{}'
);

-- =============================================================================
-- COMPLIANCE MARKETPLACE
-- =============================================================================

CREATE TABLE IF NOT EXISTS marketplace_packages (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    long_description TEXT,
    type TEXT NOT NULL CHECK (type IN ('policy', 'template', 'playbook', 'agent_config', 'audit_framework', 'report_template', 'integration')),
    version TEXT NOT NULL,
    publisher JSONB NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    frameworks TEXT[] DEFAULT '{}',
    pricing JSONB NOT NULL DEFAULT '{}',
    downloads INTEGER DEFAULT 0,
    active_installs INTEGER DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    content JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'under_review')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_reviews (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL REFERENCES marketplace_packages(id) ON DELETE CASCADE,
    reviewer TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title TEXT,
    content TEXT,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS marketplace_installations (
    id TEXT PRIMARY KEY,
    package_id TEXT NOT NULL REFERENCES marketplace_packages(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL,
    version TEXT NOT NULL,
    installed_by TEXT NOT NULL,
    installed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled', 'update_available')),
    config JSONB NOT NULL DEFAULT '{}'
);

-- =============================================================================
-- FEEDBACK & IMPROVEMENT
-- =============================================================================

CREATE TABLE IF NOT EXISTS feedback_entries (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('bug', 'feature_request', 'improvement', 'complaint', 'praise', 'question')),
    source TEXT NOT NULL DEFAULT 'in_app',
    title TEXT NOT NULL,
    description TEXT,
    submitted_by TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'submitted',
    priority TEXT NOT NULL DEFAULT 'medium',
    category TEXT DEFAULT 'general',
    tags TEXT[] DEFAULT '{}',
    votes INTEGER DEFAULT 1,
    assignee TEXT,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    linked_incident_id TEXT,
    linked_audit_finding TEXT
);

CREATE TABLE IF NOT EXISTS improvement_items (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'deferred')),
    priority TEXT NOT NULL DEFAULT 'medium',
    target_date DATE,
    completed_date DATE,
    linked_feedback_ids TEXT[] DEFAULT '{}',
    assignee TEXT,
    category TEXT,
    visible TEXT NOT NULL DEFAULT 'internal' CHECK (visible IN ('public', 'internal', 'role_based'))
);

-- =============================================================================
-- AUTONOMOUS AGENTS
-- =============================================================================

CREATE TABLE IF NOT EXISTS compliance_agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('monitor', 'auditor', 'remediator', 'reporter', 'sentinel')),
    domain TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    config JSONB NOT NULL DEFAULT '{}',
    stats JSONB NOT NULL DEFAULT '{}',
    last_run_at TIMESTAMPTZ,
    next_run_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS agent_findings (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL REFERENCES compliance_agents(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('gap', 'violation', 'risk', 'recommendation')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    framework TEXT,
    control TEXT,
    evidence JSONB NOT NULL DEFAULT '[]',
    recommendation TEXT,
    auto_remediable BOOLEAN DEFAULT FALSE,
    remediation_status TEXT NOT NULL DEFAULT 'pending',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS agent_runs (
    id TEXT PRIMARY KEY,
    agent_id TEXT NOT NULL REFERENCES compliance_agents(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'running',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    duration_ms INTEGER,
    findings_count INTEGER DEFAULT 0,
    remediations_count INTEGER DEFAULT 0,
    summary TEXT
);

-- =============================================================================
-- SELF-HEALING
-- =============================================================================

CREATE TABLE IF NOT EXISTS compliance_drifts (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    title TEXT NOT NULL,
    description TEXT,
    affected_resource TEXT NOT NULL,
    expected_state JSONB NOT NULL DEFAULT '{}',
    actual_state JSONB NOT NULL DEFAULT '{}',
    framework TEXT,
    control TEXT,
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS remediation_executions (
    id TEXT PRIMARY KEY,
    drift_id TEXT NOT NULL REFERENCES compliance_drifts(id) ON DELETE CASCADE,
    playbook_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'analyzing',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    steps JSONB NOT NULL DEFAULT '[]',
    verification_result JSONB,
    rollback_executed BOOLEAN DEFAULT FALSE,
    audit_trail JSONB NOT NULL DEFAULT '[]'
);

-- =============================================================================
-- GOVERNANCE GRAPH
-- =============================================================================

CREATE TABLE IF NOT EXISTS governance_nodes (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('user', 'action', 'model', 'policy', 'data', 'decision', 'outcome', 'regulation', 'evidence')),
    label TEXT NOT NULL,
    properties JSONB NOT NULL DEFAULT '{}',
    proof_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS governance_edges (
    id TEXT PRIMARY KEY,
    source_id TEXT NOT NULL REFERENCES governance_nodes(id) ON DELETE CASCADE,
    target_id TEXT NOT NULL REFERENCES governance_nodes(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('triggered', 'used_by', 'governed_by', 'produced', 'consumed', 'approved_by', 'violated', 'satisfies', 'depends_on')),
    label TEXT,
    weight DECIMAL(5,2) DEFAULT 1.0,
    properties JSONB NOT NULL DEFAULT '{}',
    proof_hash TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =============================================================================
-- TRUST SCORES
-- =============================================================================

CREATE TABLE IF NOT EXISTS trust_scores (
    id SERIAL PRIMARY KEY,
    organization_id TEXT NOT NULL,
    overall_score DECIMAL(5,2) NOT NULL,
    grade TEXT NOT NULL,
    dimensions JSONB NOT NULL DEFAULT '[]',
    certifications TEXT[] DEFAULT '{}',
    crypto_proof TEXT NOT NULL,
    verification_url TEXT,
    valid_until TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trust_scores_org ON trust_scores(organization_id);
CREATE INDEX IF NOT EXISTS idx_trust_scores_created ON trust_scores(created_at DESC);

-- =============================================================================
-- INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_policies_domain ON compliance_policies(domain);
CREATE INDEX IF NOT EXISTS idx_policies_status ON compliance_policies(status);
CREATE INDEX IF NOT EXISTS idx_models_status ON ai_models(status);
CREATE INDEX IF NOT EXISTS idx_models_team ON ai_models(team);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON remediation_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON remediation_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_zkp_proofs_subject ON zkp_proofs(subject);
CREATE INDEX IF NOT EXISTS idx_zkp_proofs_status ON zkp_proofs(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_type ON marketplace_packages(type);
CREATE INDEX IF NOT EXISTS idx_marketplace_status ON marketplace_packages(status);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback_entries(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback_entries(type);
CREATE INDEX IF NOT EXISTS idx_agents_status ON compliance_agents(status);
CREATE INDEX IF NOT EXISTS idx_findings_severity ON agent_findings(severity);
CREATE INDEX IF NOT EXISTS idx_drifts_severity ON compliance_drifts(severity);
CREATE INDEX IF NOT EXISTS idx_governance_nodes_type ON governance_nodes(type);
CREATE INDEX IF NOT EXISTS idx_governance_edges_source ON governance_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_governance_edges_target ON governance_edges(target_id);

-- Log the migration
INSERT INTO system_maintenance_logs (operation, details, executed_by)
VALUES ('migration', 'Enterprise Platinum schema — 17 services, 25 tables', 'migration_20260410')
ON CONFLICT DO NOTHING;
