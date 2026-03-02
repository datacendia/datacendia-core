-- CreateTable
CREATE TABLE "mesh_network_stats" (
    "id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_participants" INTEGER NOT NULL DEFAULT 0,
    "active_today" INTEGER NOT NULL DEFAULT 0,
    "data_points_shared" BIGINT NOT NULL DEFAULT 0,
    "insights_generated" INTEGER NOT NULL DEFAULT 0,
    "avg_response_ms" INTEGER NOT NULL DEFAULT 0,
    "privacy_score" DOUBLE PRECISION NOT NULL DEFAULT 99.9,
    "uptime_percent" DOUBLE PRECISION NOT NULL DEFAULT 99.99,

    CONSTRAINT "mesh_network_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_participants" (
    "id" TEXT NOT NULL,
    "anonymous_id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "employee_range" TEXT NOT NULL,
    "revenue_range" TEXT NOT NULL,
    "contribution_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "data_quality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_benchmarks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "p25_value" DOUBLE PRECISION NOT NULL,
    "p50_value" DOUBLE PRECISION NOT NULL,
    "p75_value" DOUBLE PRECISION NOT NULL,
    "p90_value" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "trend_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_risk_signals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "affected_industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "affected_regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sources" INTEGER NOT NULL DEFAULT 0,
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mesh_risk_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_twins" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "personality_config" JSONB NOT NULL DEFAULT '{}',
    "knowledge_domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "training_status" TEXT NOT NULL DEFAULT 'pending',
    "accuracy_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "interactions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_conversations" (
    "id" TEXT NOT NULL,
    "twin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "satisfaction" DOUBLE PRECISION,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govern_policies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "effective_date" TIMESTAMP(3),
    "rules" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "govern_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govern_audits" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "policy_id" TEXT,
    "audit_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "findings" JSONB NOT NULL DEFAULT '[]',
    "risk_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "govern_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_rules" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB NOT NULL DEFAULT '{}',
    "action_type" TEXT NOT NULL,
    "action_config" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_executions" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "duration_ms" INTEGER,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entry_type" TEXT NOT NULL,
    "reference_type" TEXT NOT NULL,
    "reference_id" TEXT NOT NULL,
    "actor_id" TEXT NOT NULL,
    "actor_name" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "data_hash" TEXT NOT NULL,
    "previous_hash" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veto_rules" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rule_type" TEXT NOT NULL,
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "veto_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veto_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veto_events" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veto_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "union_metrics" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "metric_name" TEXT NOT NULL,
    "metric_value" DOUBLE PRECISION NOT NULL,
    "department" TEXT,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "union_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chronos_snapshots" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "snapshot_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chronos_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ghost_board_sessions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "board_composition" JSONB NOT NULL DEFAULT '[]',
    "discussion" JSONB NOT NULL DEFAULT '[]',
    "insights" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ghost_board_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_mortem_analyses" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT,
    "title" TEXT NOT NULL,
    "failure_modes" JSONB NOT NULL DEFAULT '[]',
    "risk_factors" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "overall_risk" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pre_mortem_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_items" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "compliance_status" TEXT NOT NULL DEFAULT 'pending',
    "impact_level" TEXT NOT NULL DEFAULT 'medium',
    "required_actions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "mesh_network_stats_recorded_at_idx" ON "mesh_network_stats"("recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "mesh_participants_anonymous_id_key" ON "mesh_participants"("anonymous_id");

-- CreateIndex
CREATE INDEX "mesh_participants_industry_idx" ON "mesh_participants"("industry");

-- CreateIndex
CREATE INDEX "mesh_benchmarks_category_idx" ON "mesh_benchmarks"("category");

-- CreateIndex
CREATE UNIQUE INDEX "mesh_benchmarks_name_industry_key" ON "mesh_benchmarks"("name", "industry");

-- CreateIndex
CREATE INDEX "mesh_risk_signals_severity_idx" ON "mesh_risk_signals"("severity");

-- CreateIndex
CREATE INDEX "persona_twins_organization_id_idx" ON "persona_twins"("organization_id");

-- CreateIndex
CREATE INDEX "persona_conversations_twin_id_idx" ON "persona_conversations"("twin_id");

-- CreateIndex
CREATE INDEX "govern_policies_organization_id_idx" ON "govern_policies"("organization_id");

-- CreateIndex
CREATE INDEX "govern_audits_organization_id_idx" ON "govern_audits"("organization_id");

-- CreateIndex
CREATE INDEX "autopilot_rules_organization_id_idx" ON "autopilot_rules"("organization_id");

-- CreateIndex
CREATE INDEX "autopilot_executions_rule_id_idx" ON "autopilot_executions"("rule_id");

-- CreateIndex
CREATE INDEX "ledger_entries_organization_id_idx" ON "ledger_entries"("organization_id");

-- CreateIndex
CREATE INDEX "ledger_entries_timestamp_idx" ON "ledger_entries"("timestamp");

-- CreateIndex
CREATE INDEX "veto_rules_organization_id_idx" ON "veto_rules"("organization_id");

-- CreateIndex
CREATE INDEX "veto_events_organization_id_idx" ON "veto_events"("organization_id");

-- CreateIndex
CREATE INDEX "union_metrics_organization_id_idx" ON "union_metrics"("organization_id");

-- CreateIndex
CREATE INDEX "chronos_snapshots_organization_id_idx" ON "chronos_snapshots"("organization_id");

-- CreateIndex
CREATE INDEX "ghost_board_sessions_organization_id_idx" ON "ghost_board_sessions"("organization_id");

-- CreateIndex
CREATE INDEX "pre_mortem_analyses_organization_id_idx" ON "pre_mortem_analyses"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_items_organization_id_idx" ON "regulatory_items"("organization_id");

-- AddForeignKey
ALTER TABLE "persona_conversations" ADD CONSTRAINT "persona_conversations_twin_id_fkey" FOREIGN KEY ("twin_id") REFERENCES "persona_twins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "govern_audits" ADD CONSTRAINT "govern_audits_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "govern_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autopilot_executions" ADD CONSTRAINT "autopilot_executions_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "autopilot_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "veto_events" ADD CONSTRAINT "veto_events_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "veto_rules"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
