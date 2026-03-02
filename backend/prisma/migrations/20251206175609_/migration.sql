-- AlterTable
ALTER TABLE "deliberations" ADD COLUMN     "context" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "mode" TEXT;

-- CreateTable
CREATE TABLE "deliberation_votes" (
    "id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "agent_role" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "reasoning" TEXT,
    "confidence" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliberation_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_outcomes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "outcome_date" TIMESTAMP(3) NOT NULL,
    "predictions" JSONB NOT NULL DEFAULT '{}',
    "dollar_impact" DECIMAL(18,2),
    "roi" DECIMAL(10,4),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confidence_score" DECIMAL(5,4),
    "council_mode" TEXT,
    "participating_agents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "voting_pattern" JSONB NOT NULL DEFAULT '{}',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_weight_history" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_role" TEXT NOT NULL,
    "previous_weight" DECIMAL(5,4) NOT NULL,
    "new_weight" DECIMAL(5,4) NOT NULL,
    "adjustment" DECIMAL(5,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_weight_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "echo_patterns" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "success_rate" DECIMAL(5,2) NOT NULL,
    "sample_size" INTEGER NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "factors" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "echo_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "adversary_profile" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redteam_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_vulnerabilities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "simulation_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attack_vector" TEXT NOT NULL,
    "target_system" TEXT NOT NULL,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "damage_estimate" JSONB NOT NULL DEFAULT '{}',
    "probability_of_success" DECIMAL(5,2),
    "detection_difficulty" DECIMAL(5,2),
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mitigated_at" TIMESTAMP(3),

    CONSTRAINT "redteam_vulnerabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_patches" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "vulnerability_id" TEXT NOT NULL,
    "patch_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "original_state" JSONB,
    "applied_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redteam_patches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_scores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "breakdown" JSONB NOT NULL DEFAULT '{}',
    "vulnerabilities_count" INTEGER NOT NULL DEFAULT 0,
    "critical_count" INTEGER NOT NULL DEFAULT 0,
    "recommendations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redteam_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_learning_paths" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source_decision_id" TEXT,
    "modules" JSONB NOT NULL DEFAULT '[]',
    "estimated_duration" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'intermediate',
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "gnosis_learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_decision_impacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "affected_roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "required_skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "urgency" TEXT NOT NULL DEFAULT 'within_week',
    "impact_level" TEXT NOT NULL DEFAULT 'moderate',
    "learning_path_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimated_reskill_hours" INTEGER NOT NULL DEFAULT 0,
    "affected_employee_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gnosis_decision_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_assessments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "questions" JSONB NOT NULL DEFAULT '[]',
    "results" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "gnosis_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_skill_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "skills" JSONB NOT NULL DEFAULT '{}',
    "strengths" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "gaps" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "learning_style" TEXT NOT NULL DEFAULT 'reading',
    "preferred_pace" TEXT NOT NULL DEFAULT 'self_paced',
    "last_assessment" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gnosis_skill_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_analytics" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_learners" INTEGER NOT NULL DEFAULT 0,
    "active_learners" INTEGER NOT NULL DEFAULT 0,
    "completed_paths" INTEGER NOT NULL DEFAULT 0,
    "avg_completion" DECIMAL(5,2) NOT NULL,
    "avg_time_hours" DECIMAL(8,2) NOT NULL,
    "skill_growth" JSONB NOT NULL DEFAULT '{}',
    "decision_readiness" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gnosis_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "deliberation_votes_deliberation_id_idx" ON "deliberation_votes"("deliberation_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_organization_id_idx" ON "decision_outcomes"("organization_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_deliberation_id_idx" ON "decision_outcomes"("deliberation_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_status_idx" ON "decision_outcomes"("status");

-- CreateIndex
CREATE INDEX "agent_weight_history_organization_id_idx" ON "agent_weight_history"("organization_id");

-- CreateIndex
CREATE INDEX "agent_weight_history_agent_id_idx" ON "agent_weight_history"("agent_id");

-- CreateIndex
CREATE INDEX "echo_patterns_organization_id_idx" ON "echo_patterns"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_simulations_organization_id_idx" ON "redteam_simulations"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_simulations_status_idx" ON "redteam_simulations"("status");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_organization_id_idx" ON "redteam_vulnerabilities"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_severity_idx" ON "redteam_vulnerabilities"("severity");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_status_idx" ON "redteam_vulnerabilities"("status");

-- CreateIndex
CREATE INDEX "redteam_patches_organization_id_idx" ON "redteam_patches"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_patches_status_idx" ON "redteam_patches"("status");

-- CreateIndex
CREATE INDEX "redteam_scores_organization_id_idx" ON "redteam_scores"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_organization_id_idx" ON "gnosis_learning_paths"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_user_id_idx" ON "gnosis_learning_paths"("user_id");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_status_idx" ON "gnosis_learning_paths"("status");

-- CreateIndex
CREATE INDEX "gnosis_decision_impacts_organization_id_idx" ON "gnosis_decision_impacts"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_decision_impacts_deliberation_id_idx" ON "gnosis_decision_impacts"("deliberation_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_user_id_idx" ON "gnosis_assessments"("user_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_organization_id_idx" ON "gnosis_assessments"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_skill_idx" ON "gnosis_assessments"("skill");

-- CreateIndex
CREATE UNIQUE INDEX "gnosis_skill_profiles_user_id_key" ON "gnosis_skill_profiles"("user_id");

-- CreateIndex
CREATE INDEX "gnosis_skill_profiles_organization_id_idx" ON "gnosis_skill_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_analytics_organization_id_idx" ON "gnosis_analytics"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_analytics_period_start_period_end_idx" ON "gnosis_analytics"("period_start", "period_end");

-- AddForeignKey
ALTER TABLE "deliberation_votes" ADD CONSTRAINT "deliberation_votes_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_vulnerabilities" ADD CONSTRAINT "redteam_vulnerabilities_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "redteam_simulations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_patches" ADD CONSTRAINT "redteam_patches_vulnerability_id_fkey" FOREIGN KEY ("vulnerability_id") REFERENCES "redteam_vulnerabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
