-- CreateEnum
CREATE TYPE "TenantPlan" AS ENUM ('FREE', 'TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'SOVEREIGN');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING', 'TRIAL', 'ACTIVE', 'SUSPENDED', 'CHURNED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('TRIAL', 'STARTER', 'PROFESSIONAL', 'ENTERPRISE', 'SOVEREIGN');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRING', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "FeatureFlagType" AS ENUM ('BOOLEAN', 'PERCENTAGE', 'USER_LIST', 'TENANT_LIST');

-- CreateEnum
CREATE TYPE "RegulatoryDocStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RegulatoryReviewStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "RegulatorySeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('AUTOMATIC', 'MANUAL', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "ConstraintType" AS ENUM ('MANDATORY', 'ADVISORY', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "ConflictType" AS ENUM ('DIRECT', 'POTENTIAL', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ConflictResolution" AS ENUM ('UNRESOLVED', 'RESOLVED_PRIORITY', 'RESOLVED_MERGED', 'RESOLVED_EXCEPTION', 'FALSE_POSITIVE');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'OWNER';

-- CreateTable
CREATE TABLE "decision_packets" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "organization_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT,
    "deliberation_id" TEXT,
    "question" TEXT NOT NULL,
    "context" TEXT,
    "recommendation" TEXT NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "confidence_bounds" JSONB NOT NULL DEFAULT '{}',
    "key_assumptions" JSONB NOT NULL DEFAULT '[]',
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "conditions_for_change" JSONB NOT NULL DEFAULT '[]',
    "citations" JSONB NOT NULL DEFAULT '[]',
    "agent_contributions" JSONB NOT NULL DEFAULT '[]',
    "dissents" JSONB NOT NULL DEFAULT '[]',
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "tool_calls" JSONB NOT NULL DEFAULT '[]',
    "approvals" JSONB NOT NULL DEFAULT '[]',
    "policy_gates" JSONB NOT NULL DEFAULT '[]',
    "artifact_hashes" JSONB NOT NULL DEFAULT '{}',
    "merkle_root" TEXT NOT NULL,
    "signature" JSONB,
    "signed_at" TIMESTAMP(3),
    "regulatory_frameworks" JSONB NOT NULL DEFAULT '[]',
    "retention_until" TIMESTAMP(3) NOT NULL,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "exported_at" TIMESTAMP(3),

    CONSTRAINT "decision_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_runs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "scenarios_tested" INTEGER NOT NULL DEFAULT 0,
    "scenarios_survived" INTEGER NOT NULL DEFAULT 0,
    "survival_rate" DECIMAL(5,2) NOT NULL,
    "critical_count" INTEGER NOT NULL DEFAULT 0,
    "high_count" INTEGER NOT NULL DEFAULT 0,
    "medium_count" INTEGER NOT NULL DEFAULT 0,
    "low_count" INTEGER NOT NULL DEFAULT 0,
    "apotheosis_score" DECIMAL(5,2) NOT NULL,
    "previous_score" DECIMAL(5,2) NOT NULL,
    "score_delta" DECIMAL(5,2) NOT NULL,
    "shadow_council_instances" INTEGER NOT NULL DEFAULT 0,
    "compute_hours" DECIMAL(8,2) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_weaknesses" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "exploit_scenario" TEXT NOT NULL,
    "damage_estimate" DECIMAL(12,2) NOT NULL,
    "fix_complexity" TEXT NOT NULL,
    "recommended_fix" TEXT NOT NULL,
    "auto_fixable" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "apotheosis_weaknesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_auto_patches" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "patch_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "before_state" TEXT NOT NULL,
    "after_state" TEXT NOT NULL,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "budget_impact" DECIMAL(12,2) NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "rollback_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "apotheosis_auto_patches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_escalations" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "estimated_cost_to_fix" DECIMAL(12,2) NOT NULL,
    "risk_if_not_fixed" DECIMAL(12,2) NOT NULL,
    "assigned_to" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "response_at" TIMESTAMP(3),
    "response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_upskill_assignments" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "skill_gap" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "training_module" TEXT NOT NULL,
    "estimated_hours" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_upskill_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_pattern_bans" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instances" JSONB NOT NULL DEFAULT '[]',
    "failure_rate" DECIMAL(5,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banned_by" TEXT NOT NULL DEFAULT 'apotheosis',
    "status" TEXT NOT NULL DEFAULT 'active',
    "override_requires" TEXT NOT NULL,

    CONSTRAINT "apotheosis_pattern_bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_scores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "overall" DECIMAL(5,2) NOT NULL,
    "red_team_survival" DECIMAL(5,2) NOT NULL,
    "weakness_closure" DECIMAL(5,2) NOT NULL,
    "decision_success" DECIMAL(5,2) NOT NULL,
    "human_readiness" DECIMAL(5,2) NOT NULL,
    "pattern_health" DECIMAL(5,2) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_configs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "run_frequency" TEXT NOT NULL DEFAULT 'nightly',
    "run_time" TEXT NOT NULL DEFAULT '03:00',
    "scenario_count" INTEGER NOT NULL DEFAULT 1000,
    "auto_patch_threshold" DECIMAL(12,2) NOT NULL,
    "escalation_timeout" INTEGER NOT NULL DEFAULT 72,
    "pattern_ban_threshold" INTEGER NOT NULL DEFAULT 3,
    "training_deadline" INTEGER NOT NULL DEFAULT 72,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "decision_owner" TEXT NOT NULL,
    "dissent_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "supporting_evidence" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "dissenter_id" TEXT NOT NULL,
    "dissenter_name" TEXT NOT NULL,
    "dissenter_role" TEXT,
    "dissenter_department" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "response_deadline" TIMESTAMP(3) NOT NULL,
    "outcome_verified" BOOLEAN NOT NULL DEFAULT false,
    "dissenter_was_right" BOOLEAN,
    "outcome_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ledger_hash" TEXT NOT NULL,
    "ledger_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dissents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissent_responses" (
    "id" TEXT NOT NULL,
    "dissent_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,
    "responder_name" TEXT NOT NULL,
    "responder_role" TEXT NOT NULL,
    "response_type" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "mitigating_actions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ledger_hash" TEXT NOT NULL,

    CONSTRAINT "dissent_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissent_metrics" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "total_dissents" INTEGER NOT NULL DEFAULT 0,
    "active_dissents" INTEGER NOT NULL DEFAULT 0,
    "response_rate" DECIMAL(5,2) NOT NULL,
    "avg_response_time" DECIMAL(8,2) NOT NULL,
    "acceptance_rate" DECIMAL(5,2) NOT NULL,
    "overall_accuracy" DECIMAL(5,2) NOT NULL,
    "by_type" JSONB NOT NULL DEFAULT '{}',
    "by_severity" JSONB NOT NULL DEFAULT '{}',
    "retaliation_flags" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dissent_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissenter_profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "total_dissents" INTEGER NOT NULL DEFAULT 0,
    "acknowledged" INTEGER NOT NULL DEFAULT 0,
    "accepted_dissents" INTEGER NOT NULL DEFAULT 0,
    "overruled_dissents" INTEGER NOT NULL DEFAULT 0,
    "dissent_accuracy" DECIMAL(5,2) NOT NULL,
    "verified_outcomes" INTEGER NOT NULL DEFAULT 0,
    "correct_predictions" INTEGER NOT NULL DEFAULT 0,
    "is_high_accuracy" BOOLEAN NOT NULL DEFAULT false,
    "by_type" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dissenter_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_glossaries" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_glossaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_glossary" (
    "id" TEXT NOT NULL,
    "glossary_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "translations" JSONB NOT NULL DEFAULT '{}',
    "case_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "context" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_memory" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "source_language" TEXT NOT NULL,
    "target_text" TEXT NOT NULL,
    "target_language" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT 'general',
    "quality" DECIMAL(3,2) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_contracts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "vendor_name" TEXT NOT NULL,
    "vendor_email" TEXT,
    "category" TEXT NOT NULL,
    "annual_value" DECIMAL(15,2) NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "renewal_date" TIMESTAMP(3) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "usage_percent" DECIMAL(5,2) NOT NULL,
    "market_benchmark" DECIMAL(15,2),
    "terms" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_contracts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_negotiations" (
    "id" TEXT NOT NULL,
    "contract_id" TEXT NOT NULL,
    "current_price" DECIMAL(15,2) NOT NULL,
    "target_price" DECIMAL(15,2) NOT NULL,
    "savings_estimate" DECIMAL(15,2) NOT NULL,
    "leverage" JSONB NOT NULL DEFAULT '[]',
    "negotiation_script" TEXT,
    "draft_email" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "deadline_days" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "final_price" DECIMAL(15,2),
    "savings_achieved" DECIMAL(15,2),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_negotiations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_customers" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "tier" TEXT NOT NULL,
    "arr" DECIMAL(15,2) NOT NULL,
    "mrr" DECIMAL(15,2) NOT NULL,
    "contract_start" TIMESTAMP(3) NOT NULL,
    "contract_end" TIMESTAMP(3) NOT NULL,
    "csm_id" TEXT,
    "csm_name" TEXT,
    "health_score" INTEGER NOT NULL DEFAULT 80,
    "nps_score" INTEGER,
    "last_activity" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_customer_health" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "trend" TEXT NOT NULL,
    "components" JSONB NOT NULL DEFAULT '[]',
    "risk_factors" JSONB NOT NULL DEFAULT '[]',
    "opportunities" JSONB NOT NULL DEFAULT '[]',
    "recommended_actions" JSONB NOT NULL DEFAULT '[]',
    "assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_customer_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_customer_engagements" (
    "id" TEXT NOT NULL,
    "customer_id" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "feature_adoption" JSONB NOT NULL DEFAULT '[]',
    "support_tickets" INTEGER NOT NULL DEFAULT 0,
    "nps_response" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_customer_engagements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_services" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'healthy',
    "uptime" DECIMAL(5,2) NOT NULL,
    "latency" INTEGER NOT NULL,
    "error_rate" DECIMAL(5,2) NOT NULL,
    "throughput" INTEGER NOT NULL,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "last_health_check" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_incidents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "service_id" TEXT,
    "title" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'detected',
    "description" TEXT,
    "root_cause" TEXT,
    "customer_impact" JSONB NOT NULL DEFAULT '{}',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "assignee" TEXT,
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "enterprise_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_legal_matters" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "jurisdiction" TEXT NOT NULL,
    "description" TEXT,
    "parties" JSONB NOT NULL DEFAULT '[]',
    "risk_exposure" DECIMAL(15,2) NOT NULL,
    "estimated_cost" DECIMAL(15,2) NOT NULL,
    "actual_cost" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "win_probability" INTEGER,
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "documents" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_legal_matters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_investors" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "investment_style" TEXT,
    "shares_held" BIGINT NOT NULL DEFAULT 0,
    "ownership_percent" DECIMAL(5,2) NOT NULL,
    "avg_cost_basis" DECIMAL(15,2),
    "sentiment" TEXT NOT NULL DEFAULT 'neutral',
    "last_contact" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_shareholder_outreach" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "scheduled_date" TIMESTAMP(3) NOT NULL,
    "attendees" JSONB NOT NULL DEFAULT '[]',
    "topics" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "outcome" TEXT,
    "follow_up" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_shareholder_outreach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_production_lines" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'idle',
    "shift" TEXT NOT NULL DEFAULT 'day',
    "product" TEXT,
    "capacity" INTEGER NOT NULL,
    "current_output" INTEGER NOT NULL DEFAULT 0,
    "efficiency" DECIMAL(5,2) NOT NULL,
    "quality" DECIMAL(5,2) NOT NULL,
    "equipment" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_production_lines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_predictive_failures" (
    "id" TEXT NOT NULL,
    "line_id" TEXT NOT NULL,
    "equipment_name" TEXT NOT NULL,
    "failure_type" TEXT NOT NULL,
    "probability" DECIMAL(5,2) NOT NULL,
    "confidence" DECIMAL(5,2) NOT NULL,
    "predicted_date" TIMESTAMP(3) NOT NULL,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'predicted',
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "estimated_downtime" INTEGER NOT NULL,
    "estimated_cost" DECIMAL(15,2) NOT NULL,
    "maintenance_scheduled" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_predictive_failures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_quality_events" (
    "id" TEXT NOT NULL,
    "line_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "batch_affected" TEXT,
    "units_affected" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT NOT NULL,
    "root_cause" TEXT,
    "corrective_action" TEXT,
    "status" TEXT NOT NULL DEFAULT 'investigating',
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "enterprise_quality_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_travel_requests" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "employee_name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "vip_level" TEXT NOT NULL DEFAULT 'standard',
    "destinations" JSONB NOT NULL DEFAULT '[]',
    "purpose" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "risk_assessment" JSONB,
    "emergency_contacts" JSONB NOT NULL DEFAULT '[]',
    "approved_by" TEXT,
    "approved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_travel_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_security_plans" (
    "id" TEXT NOT NULL,
    "travel_request_id" TEXT NOT NULL,
    "level" TEXT NOT NULL DEFAULT 'standard',
    "measures" JSONB NOT NULL DEFAULT '[]',
    "ground_transport" JSONB NOT NULL DEFAULT '[]',
    "safe_locations" JSONB NOT NULL DEFAULT '[]',
    "communication_protocol" JSONB NOT NULL DEFAULT '{}',
    "check_in_schedule" JSONB NOT NULL DEFAULT '[]',
    "extraction_plan" JSONB,
    "security_personnel" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_security_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_skill_profiles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "skills" JSONB NOT NULL DEFAULT '[]',
    "certifications" JSONB NOT NULL DEFAULT '[]',
    "assessments" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_skill_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_learning_paths" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "target_skill" TEXT NOT NULL,
    "current_level" INTEGER NOT NULL,
    "target_level" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "estimated_hours" INTEGER NOT NULL,
    "modules" JSONB NOT NULL DEFAULT '[]',
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_campaigns" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "objectives" JSONB NOT NULL DEFAULT '[]',
    "target_audiences" JSONB NOT NULL DEFAULT '[]',
    "channels" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_campaign_messages" (
    "id" TEXT NOT NULL,
    "campaign_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,
    "tone" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "sentiment_score" INTEGER,
    "approved_by" TEXT,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_campaign_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_crisis_responses" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "crisis_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'identified',
    "stakeholders" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "holding_statements" JSONB NOT NULL DEFAULT '[]',
    "media_inquiries" JSONB NOT NULL DEFAULT '[]',
    "social_monitoring" JSONB NOT NULL DEFAULT '{}',
    "internal_comms" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "lessons_learned" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "enterprise_crisis_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_ideas" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "inventor_id" TEXT NOT NULL,
    "inventor_name" TEXT NOT NULL,
    "department" TEXT,
    "novelty_score" INTEGER,
    "feasibility_score" INTEGER,
    "business_value" INTEGER,
    "patent_potential" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'captured',
    "linked_patents" JSONB NOT NULL DEFAULT '[]',
    "linked_projects" JSONB NOT NULL DEFAULT '[]',
    "captured_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_ideas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_patents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT NOT NULL,
    "claims" JSONB NOT NULL DEFAULT '[]',
    "inventors" JSONB NOT NULL DEFAULT '[]',
    "filing_date" TIMESTAMP(3),
    "application_number" TEXT,
    "patent_number" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "jurisdiction" TEXT NOT NULL DEFAULT 'US',
    "priority_date" TIMESTAMP(3),
    "expiration_date" TIMESTAMP(3),
    "prior_art" JSONB NOT NULL DEFAULT '[]',
    "maintenance_fees" JSONB NOT NULL DEFAULT '[]',
    "estimated_value" DECIMAL(15,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_patents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_research_projects" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "lead_name" TEXT NOT NULL,
    "team" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'proposed',
    "budget" DECIMAL(15,2) NOT NULL,
    "spent" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),
    "target_end_date" TIMESTAMP(3),
    "milestones" JSONB NOT NULL DEFAULT '[]',
    "publications" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_research_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_culture_profiles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "values" JSONB NOT NULL DEFAULT '[]',
    "work_style" JSONB NOT NULL DEFAULT '{}',
    "decision_making" JSONB NOT NULL DEFAULT '{}',
    "communication" JSONB NOT NULL DEFAULT '{}',
    "assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_culture_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_integration_roadmaps" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "acquirer_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'planning',
    "compatibility_score" INTEGER,
    "phases" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "synergies" JSONB NOT NULL DEFAULT '[]',
    "progress" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),
    "target_end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_integration_roadmaps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_habitat_zones" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "floor" INTEGER NOT NULL,
    "building" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "square_footage" INTEGER NOT NULL,
    "max_occupancy" INTEGER NOT NULL,
    "current_occupancy" INTEGER NOT NULL DEFAULT 0,
    "sensors" JSONB NOT NULL DEFAULT '{}',
    "amenities" JSONB NOT NULL DEFAULT '[]',
    "reservable" BOOLEAN NOT NULL DEFAULT false,
    "cost_per_sqft" DECIMAL(10,2) NOT NULL,
    "last_updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_habitat_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_regent_sessions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "context" TEXT,
    "advisor_responses" JSONB NOT NULL DEFAULT '[]',
    "synthesis" TEXT,
    "mirror_truth" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enterprise_regent_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_mappings" (
    "id" TEXT NOT NULL,
    "data_source_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "table_mappings" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schema_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "TenantPlan" NOT NULL DEFAULT 'TRIAL',
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "user_count" INTEGER NOT NULL DEFAULT 0,
    "user_limit" INTEGER NOT NULL DEFAULT 10,
    "mrr" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "billing_email" TEXT,
    "primary_contact" TEXT,
    "industry" TEXT,
    "company_size" TEXT,
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "trial_ends_at" TIMESTAMP(3),
    "subscription_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "license_key" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL DEFAULT 'TRIAL',
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "seats" INTEGER NOT NULL DEFAULT 10,
    "seats_used" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "billing_cycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "renewal_price" DECIMAL(10,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_usage" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "api_calls" INTEGER NOT NULL DEFAULT 0,
    "deliberations" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "storage_used_mb" INTEGER NOT NULL DEFAULT 0,
    "agent_invocations" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FeatureFlagType" NOT NULL DEFAULT 'BOOLEAN',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB NOT NULL DEFAULT 'null',
    "rollout_percentage" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'core',
    "environment" TEXT NOT NULL DEFAULT 'all',
    "created_by" TEXT,
    "last_toggled_at" TIMESTAMP(3),
    "last_toggled_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_feature_flags" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "feature_flag_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB NOT NULL DEFAULT 'null',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_alerts" (
    "id" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "service" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_documents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "regulation_type" TEXT,
    "effective_date" TIMESTAMP(3),
    "content_hash" TEXT NOT NULL,
    "content_size" INTEGER NOT NULL,
    "original_content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parent_version_id" TEXT,
    "changelog" TEXT,
    "status" "RegulatoryDocStatus" NOT NULL DEFAULT 'PENDING',
    "processing_started" TIMESTAMP(3),
    "processing_completed" TIMESTAMP(3),
    "processing_error" TEXT,
    "review_status" "RegulatoryReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_comments" TEXT,
    "detected_language" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_requirements" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "original_text" TEXT NOT NULL,
    "original_text_hash" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "RegulatorySeverity" NOT NULL DEFAULT 'MEDIUM',
    "verification_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verification_method" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "penalty_amount" DOUBLE PRECISION,
    "penalty_currency" TEXT,
    "penalty_description" TEXT,
    "affected_processes" JSONB NOT NULL DEFAULT '[]',
    "affected_agents" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_triggers" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "requirement_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trigger_type" "TriggerType" NOT NULL DEFAULT 'MANUAL',
    "condition_expression" TEXT,
    "action_type" TEXT NOT NULL,
    "action_config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_constraints" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraint_type" "ConstraintType" NOT NULL DEFAULT 'ADVISORY',
    "rule_expression" TEXT NOT NULL,
    "applies_to_agents" JSONB NOT NULL DEFAULT '[]',
    "applies_to_decisions" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "activated_at" TIMESTAMP(3),
    "activated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_conflicts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "document1_id" TEXT NOT NULL,
    "document2_id" TEXT NOT NULL,
    "conflict_type" "ConflictType" NOT NULL DEFAULT 'POTENTIAL',
    "description" TEXT NOT NULL,
    "requirement1_summary" TEXT,
    "requirement2_summary" TEXT,
    "resolution_status" "ConflictResolution" NOT NULL DEFAULT 'UNRESOLVED',
    "resolution_notes" TEXT,
    "resolved_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "ai_recommendation" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_audit_logs" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT,
    "actor_type" TEXT NOT NULL DEFAULT 'user',
    "details" JSONB NOT NULL DEFAULT '{}',
    "previous_hash" TEXT,
    "entry_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "decision_packets_run_id_key" ON "decision_packets"("run_id");

-- CreateIndex
CREATE INDEX "decision_packets_organization_id_idx" ON "decision_packets"("organization_id");

-- CreateIndex
CREATE INDEX "decision_packets_session_id_idx" ON "decision_packets"("session_id");

-- CreateIndex
CREATE INDEX "decision_packets_deliberation_id_idx" ON "decision_packets"("deliberation_id");

-- CreateIndex
CREATE INDEX "decision_packets_run_id_idx" ON "decision_packets"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_runs_organization_id_idx" ON "apotheosis_runs"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_runs_status_idx" ON "apotheosis_runs"("status");

-- CreateIndex
CREATE INDEX "apotheosis_runs_started_at_idx" ON "apotheosis_runs"("started_at");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_run_id_idx" ON "apotheosis_weaknesses"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_severity_idx" ON "apotheosis_weaknesses"("severity");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_status_idx" ON "apotheosis_weaknesses"("status");

-- CreateIndex
CREATE INDEX "apotheosis_auto_patches_run_id_idx" ON "apotheosis_auto_patches"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_auto_patches_status_idx" ON "apotheosis_auto_patches"("status");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_run_id_idx" ON "apotheosis_escalations"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_status_idx" ON "apotheosis_escalations"("status");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_deadline_idx" ON "apotheosis_escalations"("deadline");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_run_id_idx" ON "apotheosis_upskill_assignments"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_user_id_idx" ON "apotheosis_upskill_assignments"("user_id");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_status_idx" ON "apotheosis_upskill_assignments"("status");

-- CreateIndex
CREATE INDEX "apotheosis_pattern_bans_organization_id_idx" ON "apotheosis_pattern_bans"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_pattern_bans_status_idx" ON "apotheosis_pattern_bans"("status");

-- CreateIndex
CREATE INDEX "apotheosis_scores_organization_id_idx" ON "apotheosis_scores"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_scores_recorded_at_idx" ON "apotheosis_scores"("recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "apotheosis_configs_organization_id_key" ON "apotheosis_configs"("organization_id");

-- CreateIndex
CREATE INDEX "dissents_organization_id_idx" ON "dissents"("organization_id");

-- CreateIndex
CREATE INDEX "dissents_dissenter_id_idx" ON "dissents"("dissenter_id");

-- CreateIndex
CREATE INDEX "dissents_status_idx" ON "dissents"("status");

-- CreateIndex
CREATE INDEX "dissents_decision_id_idx" ON "dissents"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "dissent_responses_dissent_id_key" ON "dissent_responses"("dissent_id");

-- CreateIndex
CREATE INDEX "dissent_responses_responder_id_idx" ON "dissent_responses"("responder_id");

-- CreateIndex
CREATE UNIQUE INDEX "dissent_metrics_organization_id_key" ON "dissent_metrics"("organization_id");

-- CreateIndex
CREATE INDEX "dissenter_profiles_organization_id_idx" ON "dissenter_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "dissenter_profiles_user_id_idx" ON "dissenter_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "dissenter_profiles_user_id_organization_id_key" ON "dissenter_profiles"("user_id", "organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossaries_organization_id_idx" ON "omnitranslate_glossaries"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_glossary_id_idx" ON "omnitranslate_glossary"("glossary_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_organization_id_idx" ON "omnitranslate_glossary"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_source_text_idx" ON "omnitranslate_glossary"("source_text");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_organization_id_idx" ON "omnitranslate_memory"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_source_language_target_language_idx" ON "omnitranslate_memory"("source_language", "target_language");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_created_at_idx" ON "omnitranslate_memory"("created_at");

-- CreateIndex
CREATE INDEX "enterprise_contracts_organization_id_idx" ON "enterprise_contracts"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_contracts_status_idx" ON "enterprise_contracts"("status");

-- CreateIndex
CREATE INDEX "enterprise_contracts_renewal_date_idx" ON "enterprise_contracts"("renewal_date");

-- CreateIndex
CREATE INDEX "enterprise_negotiations_contract_id_idx" ON "enterprise_negotiations"("contract_id");

-- CreateIndex
CREATE INDEX "enterprise_negotiations_status_idx" ON "enterprise_negotiations"("status");

-- CreateIndex
CREATE INDEX "enterprise_customers_organization_id_idx" ON "enterprise_customers"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_customers_tier_idx" ON "enterprise_customers"("tier");

-- CreateIndex
CREATE INDEX "enterprise_customers_health_score_idx" ON "enterprise_customers"("health_score");

-- CreateIndex
CREATE INDEX "enterprise_customer_health_customer_id_idx" ON "enterprise_customer_health"("customer_id");

-- CreateIndex
CREATE INDEX "enterprise_customer_health_assessed_at_idx" ON "enterprise_customer_health"("assessed_at");

-- CreateIndex
CREATE INDEX "enterprise_customer_engagements_customer_id_idx" ON "enterprise_customer_engagements"("customer_id");

-- CreateIndex
CREATE INDEX "enterprise_customer_engagements_period_start_idx" ON "enterprise_customer_engagements"("period_start");

-- CreateIndex
CREATE INDEX "enterprise_services_organization_id_idx" ON "enterprise_services"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_services_status_idx" ON "enterprise_services"("status");

-- CreateIndex
CREATE INDEX "enterprise_incidents_organization_id_idx" ON "enterprise_incidents"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_incidents_severity_idx" ON "enterprise_incidents"("severity");

-- CreateIndex
CREATE INDEX "enterprise_incidents_status_idx" ON "enterprise_incidents"("status");

-- CreateIndex
CREATE INDEX "enterprise_legal_matters_organization_id_idx" ON "enterprise_legal_matters"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_legal_matters_type_idx" ON "enterprise_legal_matters"("type");

-- CreateIndex
CREATE INDEX "enterprise_legal_matters_status_idx" ON "enterprise_legal_matters"("status");

-- CreateIndex
CREATE INDEX "enterprise_investors_organization_id_idx" ON "enterprise_investors"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_investors_type_idx" ON "enterprise_investors"("type");

-- CreateIndex
CREATE INDEX "enterprise_shareholder_outreach_investor_id_idx" ON "enterprise_shareholder_outreach"("investor_id");

-- CreateIndex
CREATE INDEX "enterprise_shareholder_outreach_scheduled_date_idx" ON "enterprise_shareholder_outreach"("scheduled_date");

-- CreateIndex
CREATE INDEX "enterprise_production_lines_organization_id_idx" ON "enterprise_production_lines"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_production_lines_status_idx" ON "enterprise_production_lines"("status");

-- CreateIndex
CREATE INDEX "enterprise_predictive_failures_line_id_idx" ON "enterprise_predictive_failures"("line_id");

-- CreateIndex
CREATE INDEX "enterprise_predictive_failures_priority_idx" ON "enterprise_predictive_failures"("priority");

-- CreateIndex
CREATE INDEX "enterprise_predictive_failures_status_idx" ON "enterprise_predictive_failures"("status");

-- CreateIndex
CREATE INDEX "enterprise_quality_events_line_id_idx" ON "enterprise_quality_events"("line_id");

-- CreateIndex
CREATE INDEX "enterprise_quality_events_severity_idx" ON "enterprise_quality_events"("severity");

-- CreateIndex
CREATE INDEX "enterprise_quality_events_status_idx" ON "enterprise_quality_events"("status");

-- CreateIndex
CREATE INDEX "enterprise_travel_requests_organization_id_idx" ON "enterprise_travel_requests"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_travel_requests_employee_id_idx" ON "enterprise_travel_requests"("employee_id");

-- CreateIndex
CREATE INDEX "enterprise_travel_requests_status_idx" ON "enterprise_travel_requests"("status");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_security_plans_travel_request_id_key" ON "enterprise_security_plans"("travel_request_id");

-- CreateIndex
CREATE INDEX "enterprise_skill_profiles_organization_id_idx" ON "enterprise_skill_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_skill_profiles_department_idx" ON "enterprise_skill_profiles"("department");

-- CreateIndex
CREATE UNIQUE INDEX "enterprise_skill_profiles_organization_id_employee_id_key" ON "enterprise_skill_profiles"("organization_id", "employee_id");

-- CreateIndex
CREATE INDEX "enterprise_learning_paths_profile_id_idx" ON "enterprise_learning_paths"("profile_id");

-- CreateIndex
CREATE INDEX "enterprise_learning_paths_status_idx" ON "enterprise_learning_paths"("status");

-- CreateIndex
CREATE INDEX "enterprise_campaigns_organization_id_idx" ON "enterprise_campaigns"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_campaigns_status_idx" ON "enterprise_campaigns"("status");

-- CreateIndex
CREATE INDEX "enterprise_campaign_messages_campaign_id_idx" ON "enterprise_campaign_messages"("campaign_id");

-- CreateIndex
CREATE INDEX "enterprise_campaign_messages_status_idx" ON "enterprise_campaign_messages"("status");

-- CreateIndex
CREATE INDEX "enterprise_crisis_responses_organization_id_idx" ON "enterprise_crisis_responses"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_crisis_responses_severity_idx" ON "enterprise_crisis_responses"("severity");

-- CreateIndex
CREATE INDEX "enterprise_crisis_responses_status_idx" ON "enterprise_crisis_responses"("status");

-- CreateIndex
CREATE INDEX "enterprise_ideas_organization_id_idx" ON "enterprise_ideas"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_ideas_status_idx" ON "enterprise_ideas"("status");

-- CreateIndex
CREATE INDEX "enterprise_ideas_inventor_id_idx" ON "enterprise_ideas"("inventor_id");

-- CreateIndex
CREATE INDEX "enterprise_patents_organization_id_idx" ON "enterprise_patents"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_patents_status_idx" ON "enterprise_patents"("status");

-- CreateIndex
CREATE INDEX "enterprise_research_projects_organization_id_idx" ON "enterprise_research_projects"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_research_projects_status_idx" ON "enterprise_research_projects"("status");

-- CreateIndex
CREATE INDEX "enterprise_culture_profiles_organization_id_idx" ON "enterprise_culture_profiles"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_integration_roadmaps_organization_id_idx" ON "enterprise_integration_roadmaps"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_integration_roadmaps_status_idx" ON "enterprise_integration_roadmaps"("status");

-- CreateIndex
CREATE INDEX "enterprise_habitat_zones_organization_id_idx" ON "enterprise_habitat_zones"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_habitat_zones_type_idx" ON "enterprise_habitat_zones"("type");

-- CreateIndex
CREATE INDEX "enterprise_habitat_zones_building_idx" ON "enterprise_habitat_zones"("building");

-- CreateIndex
CREATE INDEX "enterprise_regent_sessions_organization_id_idx" ON "enterprise_regent_sessions"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_regent_sessions_created_at_idx" ON "enterprise_regent_sessions"("created_at");

-- CreateIndex
CREATE INDEX "schema_mappings_organization_id_idx" ON "schema_mappings"("organization_id");

-- CreateIndex
CREATE INDEX "schema_mappings_data_source_id_idx" ON "schema_mappings"("data_source_id");

-- CreateIndex
CREATE INDEX "schema_mappings_is_active_idx" ON "schema_mappings"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "schema_mappings_data_source_id_organization_id_key" ON "schema_mappings"("data_source_id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "tenants_plan_idx" ON "tenants"("plan");

-- CreateIndex
CREATE INDEX "tenants_created_at_idx" ON "tenants"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_license_key_key" ON "licenses"("license_key");

-- CreateIndex
CREATE INDEX "licenses_tenant_id_idx" ON "licenses"("tenant_id");

-- CreateIndex
CREATE INDEX "licenses_status_idx" ON "licenses"("status");

-- CreateIndex
CREATE INDEX "licenses_expires_at_idx" ON "licenses"("expires_at");

-- CreateIndex
CREATE INDEX "tenant_usage_tenant_id_idx" ON "tenant_usage"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_usage_period_idx" ON "tenant_usage"("period");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_usage_tenant_id_period_key" ON "tenant_usage"("tenant_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flags_category_idx" ON "feature_flags"("category");

-- CreateIndex
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags"("enabled");

-- CreateIndex
CREATE INDEX "tenant_feature_flags_tenant_id_idx" ON "tenant_feature_flags"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_feature_flags_feature_flag_id_idx" ON "tenant_feature_flags"("feature_flag_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_feature_flags_tenant_id_feature_flag_id_key" ON "tenant_feature_flags"("tenant_id", "feature_flag_id");

-- CreateIndex
CREATE INDEX "system_alerts_severity_idx" ON "system_alerts"("severity");

-- CreateIndex
CREATE INDEX "system_alerts_acknowledged_idx" ON "system_alerts"("acknowledged");

-- CreateIndex
CREATE INDEX "system_alerts_created_at_idx" ON "system_alerts"("created_at");

-- CreateIndex
CREATE INDEX "regulatory_documents_organization_id_idx" ON "regulatory_documents"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_documents_status_idx" ON "regulatory_documents"("status");

-- CreateIndex
CREATE INDEX "regulatory_documents_review_status_idx" ON "regulatory_documents"("review_status");

-- CreateIndex
CREATE INDEX "regulatory_documents_jurisdiction_idx" ON "regulatory_documents"("jurisdiction");

-- CreateIndex
CREATE INDEX "regulatory_documents_content_hash_idx" ON "regulatory_documents"("content_hash");

-- CreateIndex
CREATE INDEX "regulatory_requirements_document_id_idx" ON "regulatory_requirements"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_requirements_category_idx" ON "regulatory_requirements"("category");

-- CreateIndex
CREATE INDEX "regulatory_requirements_severity_idx" ON "regulatory_requirements"("severity");

-- CreateIndex
CREATE INDEX "regulatory_requirements_is_verified_idx" ON "regulatory_requirements"("is_verified");

-- CreateIndex
CREATE INDEX "regulatory_triggers_document_id_idx" ON "regulatory_triggers"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_triggers_trigger_type_idx" ON "regulatory_triggers"("trigger_type");

-- CreateIndex
CREATE INDEX "regulatory_triggers_is_active_idx" ON "regulatory_triggers"("is_active");

-- CreateIndex
CREATE INDEX "regulatory_constraints_document_id_idx" ON "regulatory_constraints"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_constraints_is_active_idx" ON "regulatory_constraints"("is_active");

-- CreateIndex
CREATE INDEX "regulatory_constraints_constraint_type_idx" ON "regulatory_constraints"("constraint_type");

-- CreateIndex
CREATE INDEX "regulatory_conflicts_organization_id_idx" ON "regulatory_conflicts"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_conflicts_resolution_status_idx" ON "regulatory_conflicts"("resolution_status");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_document_id_idx" ON "regulatory_audit_logs"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_action_idx" ON "regulatory_audit_logs"("action");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_created_at_idx" ON "regulatory_audit_logs"("created_at");

-- AddForeignKey
ALTER TABLE "apotheosis_runs" ADD CONSTRAINT "apotheosis_runs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_weaknesses" ADD CONSTRAINT "apotheosis_weaknesses_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_auto_patches" ADD CONSTRAINT "apotheosis_auto_patches_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_escalations" ADD CONSTRAINT "apotheosis_escalations_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_upskill_assignments" ADD CONSTRAINT "apotheosis_upskill_assignments_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_pattern_bans" ADD CONSTRAINT "apotheosis_pattern_bans_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_scores" ADD CONSTRAINT "apotheosis_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_configs" ADD CONSTRAINT "apotheosis_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissents" ADD CONSTRAINT "dissents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissent_responses" ADD CONSTRAINT "dissent_responses_dissent_id_fkey" FOREIGN KEY ("dissent_id") REFERENCES "dissents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissent_metrics" ADD CONSTRAINT "dissent_metrics_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissenter_profiles" ADD CONSTRAINT "dissenter_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossaries" ADD CONSTRAINT "omnitranslate_glossaries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossary" ADD CONSTRAINT "omnitranslate_glossary_glossary_id_fkey" FOREIGN KEY ("glossary_id") REFERENCES "omnitranslate_glossaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossary" ADD CONSTRAINT "omnitranslate_glossary_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_memory" ADD CONSTRAINT "omnitranslate_memory_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_contracts" ADD CONSTRAINT "enterprise_contracts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_negotiations" ADD CONSTRAINT "enterprise_negotiations_contract_id_fkey" FOREIGN KEY ("contract_id") REFERENCES "enterprise_contracts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_customers" ADD CONSTRAINT "enterprise_customers_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_customer_health" ADD CONSTRAINT "enterprise_customer_health_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "enterprise_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_customer_engagements" ADD CONSTRAINT "enterprise_customer_engagements_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "enterprise_customers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_services" ADD CONSTRAINT "enterprise_services_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_incidents" ADD CONSTRAINT "enterprise_incidents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_incidents" ADD CONSTRAINT "enterprise_incidents_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "enterprise_services"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_legal_matters" ADD CONSTRAINT "enterprise_legal_matters_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_investors" ADD CONSTRAINT "enterprise_investors_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_shareholder_outreach" ADD CONSTRAINT "enterprise_shareholder_outreach_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "enterprise_investors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_production_lines" ADD CONSTRAINT "enterprise_production_lines_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_predictive_failures" ADD CONSTRAINT "enterprise_predictive_failures_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "enterprise_production_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_quality_events" ADD CONSTRAINT "enterprise_quality_events_line_id_fkey" FOREIGN KEY ("line_id") REFERENCES "enterprise_production_lines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_travel_requests" ADD CONSTRAINT "enterprise_travel_requests_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_security_plans" ADD CONSTRAINT "enterprise_security_plans_travel_request_id_fkey" FOREIGN KEY ("travel_request_id") REFERENCES "enterprise_travel_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_skill_profiles" ADD CONSTRAINT "enterprise_skill_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_learning_paths" ADD CONSTRAINT "enterprise_learning_paths_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "enterprise_skill_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_campaigns" ADD CONSTRAINT "enterprise_campaigns_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_campaign_messages" ADD CONSTRAINT "enterprise_campaign_messages_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "enterprise_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_crisis_responses" ADD CONSTRAINT "enterprise_crisis_responses_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_ideas" ADD CONSTRAINT "enterprise_ideas_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_patents" ADD CONSTRAINT "enterprise_patents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_research_projects" ADD CONSTRAINT "enterprise_research_projects_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_culture_profiles" ADD CONSTRAINT "enterprise_culture_profiles_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_integration_roadmaps" ADD CONSTRAINT "enterprise_integration_roadmaps_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_habitat_zones" ADD CONSTRAINT "enterprise_habitat_zones_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_regent_sessions" ADD CONSTRAINT "enterprise_regent_sessions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schema_mappings" ADD CONSTRAINT "schema_mappings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_usage" ADD CONSTRAINT "tenant_usage_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_flags" ADD CONSTRAINT "tenant_feature_flags_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_flags" ADD CONSTRAINT "tenant_feature_flags_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_documents" ADD CONSTRAINT "regulatory_documents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_requirements" ADD CONSTRAINT "regulatory_requirements_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_triggers" ADD CONSTRAINT "regulatory_triggers_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_triggers" ADD CONSTRAINT "regulatory_triggers_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "regulatory_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_constraints" ADD CONSTRAINT "regulatory_constraints_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_conflicts" ADD CONSTRAINT "regulatory_conflicts_document1_id_fkey" FOREIGN KEY ("document1_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_conflicts" ADD CONSTRAINT "regulatory_conflicts_document2_id_fkey" FOREIGN KEY ("document2_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_audit_logs" ADD CONSTRAINT "regulatory_audit_logs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
