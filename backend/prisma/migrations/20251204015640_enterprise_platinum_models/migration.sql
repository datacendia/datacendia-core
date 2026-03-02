/*
  Warnings:

  - The primary key for the `embeddings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `collection` on the `embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `embeddings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `embeddings` table. All the data in the column will be lost.
  - You are about to alter the column `embedding` on the `embeddings` table. The data in that column could be lost. The data in that column will be cast from `Unsupported("vector")` to `ByteA`.
  - The primary key for the `llm_cache` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `cache_key` on the `llm_cache` table. All the data in the column will be lost.
  - You are about to drop the column `generation_time_ms` on the `llm_cache` table. All the data in the column will be lost.
  - You are about to drop the column `prompt_hash` on the `llm_cache` table. All the data in the column will be lost.
  - You are about to drop the column `tokens_used` on the `llm_cache` table. All the data in the column will be lost.
  - The primary key for the `query_classifications` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actual_model_used` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `classified_complexity` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `classified_domain` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `classified_type` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `query_preview` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `response_quality_score` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `suggested_model` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the column `user_feedback` on the `query_classifications` table. All the data in the column will be lost.
  - You are about to drop the `model_performance` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[content_hash]` on the table `embeddings` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[query_hash]` on the table `llm_cache` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `content_hash` to the `embeddings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_id` to the `embeddings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `source_type` to the `embeddings` table without a default value. This is not possible if the table is not empty.
  - Made the column `embedding` on table `embeddings` required. This step will fail if there are existing NULL values in that column.
  - Made the column `metadata` on table `embeddings` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `latency_ms` to the `llm_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `llm_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `query_hash` to the `llm_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens_in` to the `llm_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokens_out` to the `llm_cache` table without a default value. This is not possible if the table is not empty.
  - Added the required column `classification` to the `query_classifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `confidence` to the `query_classifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `query` to the `query_classifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `routed_model` to the `query_classifications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CrucibleSimulationType" AS ENUM ('FINANCIAL_STRESS', 'OPERATIONAL_SHOCK', 'CYBER_ATTACK', 'REGULATORY_CHANGE', 'CULTURAL_SHIFT', 'ESG_EVENT', 'MA_SCENARIO', 'MARKET_DISRUPTION', 'SUPPLY_CHAIN', 'TALENT_EXODUS', 'TECHNOLOGY_FAILURE', 'BLACK_SWAN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CrucibleSimulationStatus" AS ENUM ('DRAFT', 'CONFIGURING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CrucibleOutcomeSentiment" AS ENUM ('CATASTROPHIC', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'OPTIMAL');

-- CreateEnum
CREATE TYPE "CrucibleImpactCategory" AS ENUM ('FINANCIAL', 'OPERATIONAL', 'SECURITY', 'COMPLIANCE', 'CULTURAL', 'REPUTATIONAL', 'STRATEGIC', 'TECHNOLOGICAL');

-- CreateEnum
CREATE TYPE "CrucibleSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL');

-- CreateEnum
CREATE TYPE "PanopticonRegulationStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUPERSEDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "PanopticonRequirementType" AS ENUM ('MANDATORY', 'RECOMMENDED', 'OPTIONAL', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "PanopticonPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PanopticonAutomationStatus" AS ENUM ('FULLY_AUTOMATED', 'PARTIALLY_AUTOMATED', 'MANUAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "PanopticonViolationType" AS ENUM ('PROCESS_VIOLATION', 'DATA_VIOLATION', 'DOCUMENTATION_GAP', 'TIMELINE_BREACH', 'CONTROL_FAILURE');

-- CreateEnum
CREATE TYPE "PanopticonViolationStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'REMEDIATION', 'RESOLVED', 'ACCEPTED_RISK');

-- CreateEnum
CREATE TYPE "PanopticonForecastType" AS ENUM ('NEW_REGULATION', 'AMENDMENT', 'ENFORCEMENT_ACTION', 'INDUSTRY_TREND', 'GEOPOLITICAL');

-- CreateEnum
CREATE TYPE "AegisSignalType" AS ENUM ('CYBER', 'GEOPOLITICAL', 'INFRASTRUCTURE', 'SUPPLY_CHAIN', 'FINANCIAL', 'ENVIRONMENTAL', 'SOCIAL', 'REGULATORY');

-- CreateEnum
CREATE TYPE "AegisSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL');

-- CreateEnum
CREATE TYPE "AegisThreatType" AS ENUM ('CYBER_ATTACK', 'DATA_BREACH', 'INSIDER_THREAT', 'SUPPLY_CHAIN_ATTACK', 'PHYSICAL_SECURITY', 'GEOPOLITICAL_RISK', 'NATURAL_DISASTER', 'MARKET_DISRUPTION', 'REGULATORY_ACTION', 'REPUTATIONAL_CRISIS');

-- CreateEnum
CREATE TYPE "AegisThreatStatus" AS ENUM ('ACTIVE', 'MONITORING', 'CONTAINED', 'MITIGATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AegisCountermeasureType" AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'DETERRENT', 'RECOVERY');

-- CreateEnum
CREATE TYPE "AegisCountermeasureStatus" AS ENUM ('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'IMPLEMENTED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AegisBriefingType" AS ENUM ('DAILY_INTEL', 'THREAT_ALERT', 'INCIDENT_REPORT', 'STRATEGIC_ASSESSMENT', 'EXECUTIVE_SUMMARY');

-- CreateEnum
CREATE TYPE "AegisClassification" AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'TOP_SECRET');

-- CreateEnum
CREATE TYPE "EternalArtifactType" AS ENUM ('STRATEGIC_DECISION', 'POLICY_DOCUMENT', 'FINANCIAL_RECORD', 'LEGAL_AGREEMENT', 'INTELLECTUAL_PROPERTY', 'HISTORICAL_RECORD', 'CULTURAL_ARTIFACT', 'LEADERSHIP_WISDOM', 'CRISIS_RESPONSE', 'LESSONS_LEARNED');

-- CreateEnum
CREATE TYPE "EternalAccessLevel" AS ENUM ('PUBLIC', 'ORGANIZATION', 'LEADERSHIP', 'BOARD', 'FOUNDER', 'SUCCESSION');

-- CreateEnum
CREATE TYPE "EternalVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'DRIFT_DETECTED', 'CORRECTED', 'QUARANTINED');

-- CreateEnum
CREATE TYPE "EternalValidationType" AS ENUM ('SCHEDULED', 'MANUAL', 'TRIGGERED', 'MIGRATION');

-- CreateEnum
CREATE TYPE "EternalMigrationType" AS ENUM ('FORMAT_UPGRADE', 'PLATFORM_MIGRATION', 'ENCRYPTION_UPDATE', 'SCHEMA_EVOLUTION');

-- CreateEnum
CREATE TYPE "EternalMigrationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "EternalSuccessorType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'FOUNDATION', 'GOVERNMENT', 'TRUST');

-- CreateEnum
CREATE TYPE "SymbiontEntityType" AS ENUM ('PARTNER', 'VENDOR', 'COMPETITOR', 'CUSTOMER', 'INVESTOR', 'REGULATOR', 'INDUSTRY_BODY', 'RESEARCH_INSTITUTION', 'STARTUP');

-- CreateEnum
CREATE TYPE "SymbiontSizeCategory" AS ENUM ('STARTUP', 'SMB', 'MID_MARKET', 'ENTERPRISE', 'CONGLOMERATE');

-- CreateEnum
CREATE TYPE "SymbiontOpportunityType" AS ENUM ('STRATEGIC_PARTNERSHIP', 'JOINT_VENTURE', 'ACQUISITION', 'MERGER', 'LICENSING', 'DISTRIBUTION', 'CO_DEVELOPMENT', 'INVESTMENT', 'DIVESTITURE');

-- CreateEnum
CREATE TYPE "SymbiontOpportunityStatus" AS ENUM ('IDENTIFIED', 'ANALYZING', 'QUALIFIED', 'PURSUING', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "SymbiontRelationshipType" AS ENUM ('PARTNERSHIP', 'VENDOR', 'CUSTOMER', 'COMPETITOR', 'INVESTOR', 'SUBSIDIARY', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "SymbiontSentiment" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE');

-- CreateEnum
CREATE TYPE "SymbiontSimulationType" AS ENUM ('PARTNERSHIP_MODEL', 'JV_STRUCTURE', 'ACQUISITION_INTEGRATION', 'MARKET_ENTRY', 'TECHNOLOGY_TRANSFER');

-- CreateEnum
CREATE TYPE "VoxStakeholderType" AS ENUM ('EMPLOYEES', 'CUSTOMERS', 'SHAREHOLDERS', 'COMMUNITY', 'ENVIRONMENT', 'FUTURE_GENERATIONS', 'SUPPLIERS', 'REGULATORS', 'CIVIL_SOCIETY');

-- CreateEnum
CREATE TYPE "VoxSignalType" AS ENUM ('SURVEY', 'SOCIAL_MEDIA', 'ESG_FEED', 'COMPLAINT', 'FEEDBACK', 'NEWS', 'REGULATORY', 'INTERNAL');

-- CreateEnum
CREATE TYPE "VoxSentiment" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE');

-- CreateEnum
CREATE TYPE "VoxUrgency" AS ENUM ('CRITICAL', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "VoxImpactType" AS ENUM ('FINANCIAL', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'SOCIAL', 'PSYCHOLOGICAL', 'EMPLOYMENT', 'RIGHTS', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "VoxSeverity" AS ENUM ('CATASTROPHIC', 'SEVERE', 'MODERATE', 'MINOR', 'NEGLIGIBLE');

-- CreateEnum
CREATE TYPE "VoxVoteType" AS ENUM ('APPROVAL', 'ADVISORY', 'VETO', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "VoxVoteValue" AS ENUM ('APPROVE', 'APPROVE_WITH_CONDITIONS', 'OPPOSE', 'ABSTAIN', 'VETO');

-- CreateEnum
CREATE TYPE "VoxAssemblyType" AS ENUM ('EMERGENCY', 'SCHEDULED', 'AD_HOC', 'ANNUAL');

-- CreateEnum
CREATE TYPE "LineageEntityType" AS ENUM ('DATASET', 'TABLE', 'COLUMN', 'REPORT', 'METRIC', 'MODEL', 'PIPELINE', 'API');

-- CreateEnum
CREATE TYPE "LineageRelationType" AS ENUM ('DERIVES_FROM', 'TRANSFORMS_TO', 'DEPENDS_ON', 'FEEDS', 'USES');

-- CreateEnum
CREATE TYPE "DataQualityLevel" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ForecastModelType" AS ENUM ('TIME_SERIES', 'REGRESSION', 'CLASSIFICATION', 'ANOMALY_DETECTION', 'NEURAL_NETWORK');

-- CreateEnum
CREATE TYPE "ModelTrainingStatus" AS ENUM ('UNTRAINED', 'TRAINING', 'TRAINED', 'FAILED', 'STALE');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "ThreatType" AS ENUM ('INTRUSION', 'MALWARE', 'PHISHING', 'DATA_EXFILTRATION', 'PRIVILEGE_ESCALATION', 'DENIAL_OF_SERVICE', 'INSIDER_THREAT', 'POLICY_VIOLATION');

-- CreateEnum
CREATE TYPE "ThreatSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "ThreatStatus" AS ENUM ('ACTIVE', 'INVESTIGATING', 'CONTAINED', 'MITIGATED', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('ACCESS_CONTROL', 'DATA_PROTECTION', 'NETWORK_SECURITY', 'COMPLIANCE', 'OPERATIONAL');

-- CreateEnum
CREATE TYPE "PolicyEnforcement" AS ENUM ('BLOCK', 'WARN', 'LOG', 'DISABLED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "EthicsCategory" AS ENUM ('FAIRNESS', 'TRANSPARENCY', 'PRIVACY', 'ACCOUNTABILITY', 'SAFETY', 'HUMAN_OVERSIGHT');

-- CreateEnum
CREATE TYPE "PrincipleStatus" AS ENUM ('ACTIVE', 'DRAFT', 'DEPRECATED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReviewResult" AS ENUM ('APPROVED', 'REJECTED', 'CONDITIONAL', 'NEEDS_REVISION');

-- CreateEnum
CREATE TYPE "BiasCheckStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "TwinEntityType" AS ENUM ('SYSTEM', 'TEAM', 'WORKFLOW', 'PROCESS', 'ASSET');

-- CreateEnum
CREATE TYPE "SnapshotTrigger" AS ENUM ('SCHEDULED', 'MANUAL', 'EVENT');

-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('DRAFT', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WitnessEventType" AS ENUM ('DECISION', 'TRANSACTION', 'COMMUNICATION', 'AGREEMENT', 'AUDIT', 'DISCLOSURE');

-- CreateEnum
CREATE TYPE "LegalRelevance" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "LegalHoldStatus" AS ENUM ('ACTIVE', 'RELEASED');

-- CreateEnum
CREATE TYPE "CustodyAction" AS ENUM ('CREATED', 'ACCESSED', 'MODIFIED', 'EXPORTED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ClaimCategory" AS ENUM ('DATA', 'METRIC', 'EVENT', 'STATEMENT', 'FORECAST');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'VERIFIED', 'DISPUTED', 'FALSE', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('DATA_SOURCE', 'DOCUMENT', 'WITNESS', 'AUDIT_LOG', 'CALCULATION');

-- CreateEnum
CREATE TYPE "VoteValue" AS ENUM ('SUPPORT', 'OPPOSE', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('POLICY', 'PROCEDURE', 'BEST_PRACTICE', 'LESSON_LEARNED', 'HISTORICAL', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('SUCCESS', 'FAILURE', 'PIVOT', 'CRISIS', 'INNOVATION', 'MILESTONE', 'LESSON_LEARNED');

-- CreateEnum
CREATE TYPE "ConfidentialityLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "HoneytokenType" AS ENUM ('CREDENTIAL', 'API_KEY', 'DOCUMENT', 'DATABASE_RECORD', 'SSH_KEY', 'TOKEN');

-- CreateEnum
CREATE TYPE "CanaryType" AS ENUM ('SERVER', 'DATABASE', 'APPLICATION', 'API_ENDPOINT', 'FILE_SHARE');

-- CreateEnum
CREATE TYPE "CanaryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRIGGERED', 'COMPROMISED');

-- CreateEnum
CREATE TYPE "CanaryEventType" AS ENUM ('CONNECTION', 'AUTHENTICATION', 'DATA_ACCESS', 'EXFILTRATION', 'LATERAL_MOVEMENT');

-- CreateEnum
CREATE TYPE "AlertLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "HardwareKeyType" AS ENUM ('USB', 'NFC', 'SMARTCARD', 'BIOMETRIC');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOST', 'REVOKED');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('LARGE_TRANSACTION', 'CONFIG_CHANGE', 'DATA_EXPORT', 'USER_MANAGEMENT', 'SYSTEM_ACCESS');

-- CreateEnum
CREATE TYPE "KeyEvent" AS ENUM ('REGISTERED', 'ASSIGNED', 'USED', 'LOST', 'REVOKED', 'RECOVERED');

-- CreateEnum
CREATE TYPE "MeshNodeType" AS ENUM ('DCU', 'GATEWAY', 'ENDPOINT', 'SENSOR');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DEGRADED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "EncryptionLevel" AS ENUM ('STANDARD', 'HIGH', 'QUANTUM_RESISTANT');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEGRADED');

-- CreateEnum
CREATE TYPE "ChannelProtocol" AS ENUM ('AES256', 'CHACHA20', 'KYBER', 'DILITHIUM');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BlackboxStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'OFFLINE', 'RECOVERY_MODE');

-- CreateEnum
CREATE TYPE "BackupSourceType" AS ENUM ('LEDGER', 'CHRONOS', 'WITNESS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BackupPriority" AS ENUM ('CRITICAL', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "ARDeviceType" AS ENUM ('VISION_PRO', 'META_QUEST', 'HOLOLENS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ARDeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAIRING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SecurityClearance" AS ENUM ('BASIC', 'STANDARD', 'ELEVATED', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "OverlayType" AS ENUM ('HEALTH_SCORE', 'RISK_INDICATOR', 'COUNCIL_INSIGHT', 'METRIC', 'ALERT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('INDIVIDUAL', 'COLLABORATIVE', 'PRESENTATION');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- DropIndex
DROP INDEX "embeddings_collection_idx";

-- DropIndex
DROP INDEX "embeddings_embedding_idx";

-- DropIndex
DROP INDEX "embeddings_source_idx";

-- DropIndex
DROP INDEX "llm_cache_cache_key_key";

-- DropIndex
DROP INDEX "query_classifications_query_hash_idx";

-- DropIndex
DROP INDEX "query_classifications_type_idx";

-- AlterTable
ALTER TABLE "embeddings" DROP CONSTRAINT "embeddings_pkey",
DROP COLUMN "collection",
DROP COLUMN "source",
DROP COLUMN "updated_at",
ADD COLUMN     "content_hash" TEXT NOT NULL,
ADD COLUMN     "dimensions" INTEGER NOT NULL DEFAULT 768,
ADD COLUMN     "embedding_model" TEXT NOT NULL DEFAULT 'nomic-embed-text',
ADD COLUMN     "organization_id" TEXT,
ADD COLUMN     "source_id" TEXT NOT NULL,
ADD COLUMN     "source_type" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "embedding" DROP NOT NULL,
ALTER COLUMN "embedding" TYPE BYTEA USING NULL,
ALTER COLUMN "embedding" SET NOT NULL,
ALTER COLUMN "metadata" SET NOT NULL,
ADD CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "llm_cache" DROP CONSTRAINT "llm_cache_pkey",
DROP COLUMN "cache_key",
DROP COLUMN "generation_time_ms",
DROP COLUMN "prompt_hash",
DROP COLUMN "tokens_used",
ADD COLUMN     "hit_count" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "latency_ms" INTEGER NOT NULL,
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "query_hash" TEXT NOT NULL,
ADD COLUMN     "system_prompt" TEXT,
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
ADD COLUMN     "tokens_in" INTEGER NOT NULL,
ADD COLUMN     "tokens_out" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "llm_cache_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "query_classifications" DROP CONSTRAINT "query_classifications_pkey",
DROP COLUMN "actual_model_used",
DROP COLUMN "classified_complexity",
DROP COLUMN "classified_domain",
DROP COLUMN "classified_type",
DROP COLUMN "query_preview",
DROP COLUMN "response_quality_score",
DROP COLUMN "suggested_model",
DROP COLUMN "user_feedback",
ADD COLUMN     "actual_model" TEXT,
ADD COLUMN     "classification" TEXT NOT NULL,
ADD COLUMN     "confidence" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "latency_ms" INTEGER,
ADD COLUMN     "metadata" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "organization_id" TEXT,
ADD COLUMN     "query" TEXT NOT NULL,
ADD COLUMN     "routed_model" TEXT NOT NULL,
ADD COLUMN     "user_id" TEXT,
ADD COLUMN     "was_correct" BOOLEAN,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "query_classifications_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "model_performance";

-- CreateTable
CREATE TABLE "chain_of_thought_logs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "session_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "steps" JSONB NOT NULL,
    "final_answer" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION,
    "model" TEXT NOT NULL,
    "tokens_used" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chain_of_thought_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "simulation_type" "CrucibleSimulationType" NOT NULL,
    "status" "CrucibleSimulationStatus" NOT NULL DEFAULT 'DRAFT',
    "config" JSONB NOT NULL,
    "digital_twin_snapshot" JSONB,
    "scenario_definition" JSONB NOT NULL,
    "monte_carlo_runs" INTEGER NOT NULL DEFAULT 1000,
    "confidence_level" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "time_horizon_days" INTEGER NOT NULL DEFAULT 365,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "results_summary" JSONB,

    CONSTRAINT "crucible_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_universes" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "universe_number" INTEGER NOT NULL,
    "parent_universe" TEXT,
    "branch_point" TEXT,
    "probability" DOUBLE PRECISION NOT NULL,
    "state_snapshot" JSONB NOT NULL,
    "kpi_projections" JSONB NOT NULL,
    "risk_scores" JSONB NOT NULL,
    "outcome_summary" TEXT,
    "outcome_sentiment" "CrucibleOutcomeSentiment" NOT NULL DEFAULT 'NEUTRAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_universes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_impacts" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "impact_category" "CrucibleImpactCategory" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "entity_name" TEXT NOT NULL,
    "baseline_value" DOUBLE PRECISION,
    "projected_value" DOUBLE PRECISION,
    "change_percent" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "severity" "CrucibleSeverity" NOT NULL DEFAULT 'LOW',
    "description" TEXT,
    "propagation_path" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_failure_cascades" (
    "id" TEXT NOT NULL,
    "universe_id" TEXT NOT NULL,
    "trigger_event" TEXT NOT NULL,
    "cascade_depth" INTEGER NOT NULL DEFAULT 0,
    "affected_nodes" JSONB NOT NULL,
    "propagation_time" INTEGER,
    "total_impact" DOUBLE PRECISION,
    "visualization" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_failure_cascades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_council_deliberations" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "universe_id" TEXT,
    "scenario_context" TEXT NOT NULL,
    "agent_responses" JSONB NOT NULL,
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "final_recommendation" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "deliberation_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_council_deliberations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_regulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "framework_code" TEXT NOT NULL,
    "framework_name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3),
    "sunset_date" TIMESTAMP(3),
    "source_url" TEXT,
    "raw_content" TEXT,
    "parsed_content" JSONB,
    "status" "PanopticonRegulationStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panopticon_regulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_obligations" (
    "id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "obligation_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirement_type" "PanopticonRequirementType" NOT NULL,
    "priority" "PanopticonPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMP(3),
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_pattern" TEXT,
    "controls" JSONB NOT NULL DEFAULT '[]',
    "evidence_required" JSONB NOT NULL DEFAULT '[]',
    "automation_status" "PanopticonAutomationStatus" NOT NULL DEFAULT 'MANUAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panopticon_obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_alignments" (
    "id" TEXT NOT NULL,
    "obligation_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "alignment_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gap_analysis" JSONB,
    "remediation_plan" JSONB,
    "last_assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_alignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_violations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "obligation_id" TEXT,
    "violation_type" "PanopticonViolationType" NOT NULL,
    "severity" "PanopticonPriority" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "affected_entities" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB,
    "status" "PanopticonViolationStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_forecasts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "forecast_type" "PanopticonForecastType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "impact_score" DOUBLE PRECISION NOT NULL,
    "affected_frameworks" JSONB NOT NULL DEFAULT '[]',
    "recommended_actions" JSONB NOT NULL DEFAULT '[]',
    "horizon_days" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_signals" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "signal_type" "AegisSignalType" NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "severity" "AegisSeverity" NOT NULL DEFAULT 'LOW',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "location" TEXT,
    "entities_mentioned" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "raw_data" JSONB,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_threats" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "signal_id" TEXT,
    "threat_type" "AegisThreatType" NOT NULL,
    "threat_actor" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "AegisSeverity" NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "impact_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "affected_assets" JSONB NOT NULL DEFAULT '[]',
    "attack_vectors" JSONB NOT NULL DEFAULT '[]',
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "status" "AegisThreatStatus" NOT NULL DEFAULT 'ACTIVE',
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mitigated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_scenarios" (
    "id" TEXT NOT NULL,
    "threat_id" TEXT NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trigger_conditions" JSONB NOT NULL,
    "cascade_effects" JSONB NOT NULL,
    "affected_systems" JSONB NOT NULL DEFAULT '[]',
    "financial_impact" DOUBLE PRECISION,
    "operational_impact" DOUBLE PRECISION,
    "reputational_impact" DOUBLE PRECISION,
    "recovery_time_hours" INTEGER,
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "simulation_results" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_countermeasures" (
    "id" TEXT NOT NULL,
    "threat_id" TEXT NOT NULL,
    "countermeasure_type" "AegisCountermeasureType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation" JSONB NOT NULL,
    "cost_estimate" DOUBLE PRECISION,
    "effectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "time_to_implement" INTEGER,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "status" "AegisCountermeasureStatus" NOT NULL DEFAULT 'PROPOSED',
    "implemented_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_countermeasures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_briefings" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "threat_id" TEXT,
    "briefing_type" "AegisBriefingType" NOT NULL,
    "title" TEXT NOT NULL,
    "executive_summary" TEXT NOT NULL,
    "detailed_analysis" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "classification" "AegisClassification" NOT NULL DEFAULT 'INTERNAL',
    "recipients" JSONB NOT NULL DEFAULT '[]',
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_artifacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "artifact_type" "EternalArtifactType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "importance_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "retention_years" INTEGER NOT NULL DEFAULT 100,
    "access_level" "EternalAccessLevel" NOT NULL DEFAULT 'ORGANIZATION',
    "format_version" TEXT NOT NULL DEFAULT '1.0',
    "original_format" TEXT,
    "migrated_formats" JSONB NOT NULL DEFAULT '[]',
    "verification_status" "EternalVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "last_verified_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eternal_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_validations" (
    "id" TEXT NOT NULL,
    "artifact_id" TEXT NOT NULL,
    "validation_type" "EternalValidationType" NOT NULL,
    "validator" TEXT NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "current_hash" TEXT NOT NULL,
    "integrity_check" BOOLEAN NOT NULL DEFAULT true,
    "drift_detected" BOOLEAN NOT NULL DEFAULT false,
    "drift_details" JSONB,
    "correction_applied" BOOLEAN NOT NULL DEFAULT false,
    "validated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_migrations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "migration_type" "EternalMigrationType" NOT NULL,
    "source_format" TEXT NOT NULL,
    "target_format" TEXT NOT NULL,
    "artifacts_affected" INTEGER NOT NULL,
    "status" "EternalMigrationStatus" NOT NULL DEFAULT 'PENDING',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_succession" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "successor_type" "EternalSuccessorType" NOT NULL,
    "successor_name" TEXT NOT NULL,
    "successor_contact" TEXT NOT NULL,
    "verification_method" TEXT NOT NULL,
    "access_conditions" JSONB NOT NULL,
    "artifacts_scope" JSONB NOT NULL DEFAULT '[]',
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_succession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_entities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_type" "SymbiontEntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT,
    "website" TEXT,
    "location" TEXT,
    "size_category" "SymbiontSizeCategory",
    "financial_health" DOUBLE PRECISION,
    "reputation_score" DOUBLE PRECISION,
    "data_sources" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "last_analyzed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_opportunities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_id" TEXT,
    "opportunity_type" "SymbiontOpportunityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "strategic_fit" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "financial_potential" DOUBLE PRECISION,
    "risk_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "synergy_areas" JSONB NOT NULL DEFAULT '[]',
    "required_resources" JSONB NOT NULL DEFAULT '[]',
    "timeline_months" INTEGER,
    "status" "SymbiontOpportunityStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "ai_analysis" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_relationships" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "related_entity_id" TEXT NOT NULL,
    "relationship_type" "SymbiontRelationshipType" NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "sentiment" "SymbiontSentiment" NOT NULL DEFAULT 'NEUTRAL',
    "interaction_history" JSONB NOT NULL DEFAULT '[]',
    "health_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "last_interaction" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_simulations" (
    "id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "simulation_type" "SymbiontSimulationType" NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "projected_outcomes" JSONB NOT NULL,
    "financial_model" JSONB,
    "risk_analysis" JSONB,
    "integration_plan" JSONB,
    "success_probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "recommendation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbiont_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_stakeholders" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "stakeholder_type" "VoxStakeholderType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "population_size" INTEGER,
    "representation_method" TEXT NOT NULL,
    "voice_weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "veto_rights" JSONB NOT NULL DEFAULT '[]',
    "data_sources" JSONB NOT NULL DEFAULT '[]',
    "ai_proxy_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vox_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_signals" (
    "id" TEXT NOT NULL,
    "stakeholder_id" TEXT NOT NULL,
    "signal_type" "VoxSignalType" NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment" "VoxSentiment" NOT NULL,
    "sentiment_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "urgency" "VoxUrgency" NOT NULL DEFAULT 'NORMAL',
    "topics" JSONB NOT NULL DEFAULT '[]',
    "raw_data" JSONB,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_impacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT,
    "stakeholder_id" TEXT NOT NULL,
    "impact_type" "VoxImpactType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "VoxSeverity" NOT NULL DEFAULT 'MODERATE',
    "affected_count" INTEGER,
    "financial_impact" DOUBLE PRECISION,
    "duration" TEXT,
    "mitigation_options" JSONB NOT NULL DEFAULT '[]',
    "stakeholder_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_votes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "stakeholder_id" TEXT NOT NULL,
    "vote_type" "VoxVoteType" NOT NULL,
    "vote_value" "VoxVoteValue" NOT NULL,
    "reasoning" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "weight_applied" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "veto_exercised" BOOLEAN NOT NULL DEFAULT false,
    "veto_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_assemblies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "assembly_type" "VoxAssemblyType" NOT NULL,
    "title" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "deliberation_log" JSONB NOT NULL DEFAULT '[]',
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "final_verdict" "VoxVoteValue",
    "dissenting_voices" JSONB NOT NULL DEFAULT '[]',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "scheduled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_assemblies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineage_entities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_type" "LineageEntityType" NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "schema_def" JSONB NOT NULL DEFAULT '{}',
    "quality_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quality_level" "DataQualityLevel" NOT NULL DEFAULT 'UNKNOWN',
    "record_count" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lineage_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineage_relationships" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "relationship_type" "LineageRelationType" NOT NULL,
    "transformations" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lineage_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_reports" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "completeness" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "consistency" DOUBLE PRECISION NOT NULL,
    "timeliness" DOUBLE PRECISION NOT NULL,
    "validity" DOUBLE PRECISION NOT NULL,
    "issues" JSONB NOT NULL DEFAULT '[]',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_quality_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_models" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model_type" "ForecastModelType" NOT NULL,
    "description" TEXT,
    "target_metric" TEXT NOT NULL,
    "features" JSONB NOT NULL DEFAULT '[]',
    "hyperparameters" JSONB NOT NULL DEFAULT '{}',
    "accuracy" DOUBLE PRECISION,
    "mape" DOUBLE PRECISION,
    "training_status" "ModelTrainingStatus" NOT NULL DEFAULT 'UNTRAINED',
    "last_trained_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "input_data" JSONB NOT NULL,
    "predicted_value" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "prediction_date" TIMESTAMP(3) NOT NULL,
    "actual_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_importance" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "feature_name" TEXT NOT NULL,
    "importance" DOUBLE PRECISION NOT NULL,
    "direction" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_importance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_checks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "status" "HealthStatus" NOT NULL,
    "latency_ms" INTEGER,
    "error_message" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_incidents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "affected_components" JSONB NOT NULL DEFAULT '[]',
    "root_cause" TEXT,
    "resolution" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_threats" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "threat_type" "ThreatType" NOT NULL,
    "severity" "ThreatSeverity" NOT NULL,
    "status" "ThreatStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "target" TEXT,
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "security_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_policies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "policy_type" "PolicyType" NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "enforcement" "PolicyEnforcement" NOT NULL DEFAULT 'WARN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audit_logs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethics_principles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EthicsCategory" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "PrincipleStatus" NOT NULL DEFAULT 'ACTIVE',
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ethics_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethics_reviews" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "principle_id" TEXT,
    "subject_type" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "result" "ReviewResult",
    "reviewer" TEXT,
    "notes" TEXT,
    "violations" JSONB NOT NULL DEFAULT '[]',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "ethics_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bias_checks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "status" "BiasCheckStatus" NOT NULL DEFAULT 'PENDING',
    "overall_score" DOUBLE PRECISION,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "checked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bias_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "digital_twins" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_type" "TwinEntityType" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "current_state" JSONB NOT NULL DEFAULT '{}',
    "health_score" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "sync_frequency" INTEGER NOT NULL DEFAULT 60,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "last_sync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "digital_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "twin_snapshots" (
    "id" TEXT NOT NULL,
    "twin_id" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "trigger" "SnapshotTrigger" NOT NULL,
    "changes_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "twin_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseline_snapshot" TEXT NOT NULL,
    "modifications" JSONB NOT NULL DEFAULT '[]',
    "results" JSONB,
    "status" "SimulationStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "witness_records" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" "WitnessEventType" NOT NULL,
    "event_id" TEXT NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "content" JSONB NOT NULL,
    "content_hash" TEXT NOT NULL,
    "attestations" JSONB NOT NULL DEFAULT '[]',
    "legal_relevance" "LegalRelevance" NOT NULL DEFAULT 'LOW',
    "retention_policy" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "witness_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_holds" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scope" JSONB NOT NULL DEFAULT '[]',
    "custodians" JSONB NOT NULL DEFAULT '[]',
    "status" "LegalHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custody_events" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" "CustodyAction" NOT NULL,
    "actor" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custody_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "truth_claims" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category" "ClaimCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "claimant" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "verification" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "truth_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "evidence_type" "EvidenceType" NOT NULL,
    "source" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "reliability" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "submitted_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_votes" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "voter_role" TEXT NOT NULL,
    "vote" "VoteValue" NOT NULL,
    "rationale" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "knowledge_articles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" "ArticleCategory" NOT NULL,
    "tags" JSONB NOT NULL DEFAULT '[]',
    "author" TEXT NOT NULL,
    "contributors" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "views" INTEGER NOT NULL DEFAULT 0,
    "usefulness" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "published_at" TIMESTAMP(3),
    "archived_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knowledge_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_versions" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "changes" TEXT,
    "changed_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "institutional_memories" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "memory_type" "MemoryType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date_occurred" TIMESTAMP(3) NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "lessons" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "related_articles" JSONB NOT NULL DEFAULT '[]',
    "confidentiality" "ConfidentialityLevel" NOT NULL DEFAULT 'INTERNAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "institutional_memories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expertise_profiles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "expertise_areas" JSONB NOT NULL DEFAULT '[]',
    "contributions" INTEGER NOT NULL DEFAULT 0,
    "mentor_available" BOOLEAN NOT NULL DEFAULT false,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expertise_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "honeytokens" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "token_type" "HoneytokenType" NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "alert_level" "AlertLevel" NOT NULL DEFAULT 'HIGH',
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "trigger_count" INTEGER NOT NULL DEFAULT 0,
    "last_triggered" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "honeytokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canary_systems" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "system_type" "CanaryType" NOT NULL,
    "status" "CanaryStatus" NOT NULL DEFAULT 'ACTIVE',
    "configuration" JSONB NOT NULL DEFAULT '{}',
    "interactions" INTEGER NOT NULL DEFAULT 0,
    "last_interaction" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canary_systems_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canary_alerts" (
    "id" TEXT NOT NULL,
    "canary_id" TEXT NOT NULL,
    "event_type" "CanaryEventType" NOT NULL,
    "source_ip" TEXT NOT NULL,
    "source_port" INTEGER,
    "details" JSONB NOT NULL DEFAULT '{}',
    "severity" "AlertLevel" NOT NULL,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canary_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware_keys" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "key_type" "HardwareKeyType" NOT NULL,
    "assigned_to" TEXT,
    "assigned_name" TEXT,
    "status" "KeyStatus" NOT NULL DEFAULT 'ACTIVE',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "public_key" TEXT NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "last_used" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hardware_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "high_risk_operations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "operation_type" "OperationType" NOT NULL,
    "description" TEXT NOT NULL,
    "threshold" JSONB NOT NULL DEFAULT '{}',
    "requires_key" BOOLEAN NOT NULL DEFAULT true,
    "requires_biometric" BOOLEAN NOT NULL DEFAULT false,
    "cooldown_seconds" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "high_risk_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_audit_logs" (
    "id" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,
    "event" "KeyEvent" NOT NULL,
    "details" TEXT,
    "actor" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "key_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_nodes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "node_type" "MeshNodeType" NOT NULL,
    "status" "NodeStatus" NOT NULL DEFAULT 'ONLINE',
    "location" JSONB NOT NULL DEFAULT '{}',
    "public_key" TEXT NOT NULL,
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "bandwidth_mbps" INTEGER NOT NULL DEFAULT 100,
    "latency_ms" INTEGER NOT NULL DEFAULT 10,
    "encryption_level" "EncryptionLevel" NOT NULL DEFAULT 'HIGH',
    "last_heartbeat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_connections" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_node_id" TEXT NOT NULL,
    "target_node_id" TEXT NOT NULL,
    "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',
    "encryption_protocol" TEXT NOT NULL,
    "bandwidth_util" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "latency_ms" INTEGER NOT NULL DEFAULT 0,
    "packet_loss" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "established_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_connections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "secure_channels" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "encryption_key" TEXT NOT NULL,
    "protocol" "ChannelProtocol" NOT NULL,
    "status" "ChannelStatus" NOT NULL DEFAULT 'ACTIVE',
    "message_count" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "secure_channels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blackbox_units" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BlackboxStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "location" JSONB NOT NULL DEFAULT '{}',
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "health_metrics" JSONB NOT NULL DEFAULT '{}',
    "last_sync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_verification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blackbox_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "backup_jobs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "blackbox_id" TEXT NOT NULL,
    "source_type" "BackupSourceType" NOT NULL,
    "source_path" TEXT NOT NULL,
    "status" "BackupStatus" NOT NULL DEFAULT 'SCHEDULED',
    "priority" "BackupPriority" NOT NULL DEFAULT 'NORMAL',
    "bytes_transferred" BIGINT NOT NULL DEFAULT 0,
    "error_message" TEXT,
    "scheduled_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "backup_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stored_records" (
    "id" TEXT NOT NULL,
    "blackbox_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "data_hash" TEXT NOT NULL,
    "encryption_key" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL,
    "retention_policy" TEXT,
    "expires_at" TIMESTAMP(3),
    "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stored_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_devices" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "device_type" "ARDeviceType" NOT NULL,
    "serial_number" TEXT NOT NULL,
    "assigned_to" TEXT,
    "assigned_name" TEXT,
    "status" "ARDeviceStatus" NOT NULL DEFAULT 'PAIRING',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "security_clearance" "SecurityClearance" NOT NULL DEFAULT 'BASIC',
    "last_connected" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ar_devices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_overlays" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "overlay_type" "OverlayType" NOT NULL,
    "data_source" TEXT NOT NULL,
    "refresh_interval" INTEGER NOT NULL DEFAULT 60,
    "visual_config" JSONB NOT NULL DEFAULT '{}',
    "permissions" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ar_overlays_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ar_sessions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "device_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_type" "SessionType" NOT NULL DEFAULT 'INDIVIDUAL',
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "active_overlays" JSONB NOT NULL DEFAULT '[]',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "interactions" JSONB NOT NULL DEFAULT '[]',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),

    CONSTRAINT "ar_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "chain_of_thought_logs_agent_id_idx" ON "chain_of_thought_logs"("agent_id");

-- CreateIndex
CREATE INDEX "chain_of_thought_logs_organization_id_idx" ON "chain_of_thought_logs"("organization_id");

-- CreateIndex
CREATE INDEX "chain_of_thought_logs_session_id_idx" ON "chain_of_thought_logs"("session_id");

-- CreateIndex
CREATE INDEX "crucible_simulations_organization_id_status_idx" ON "crucible_simulations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "crucible_simulations_simulation_type_idx" ON "crucible_simulations"("simulation_type");

-- CreateIndex
CREATE INDEX "crucible_universes_simulation_id_idx" ON "crucible_universes"("simulation_id");

-- CreateIndex
CREATE UNIQUE INDEX "crucible_universes_simulation_id_universe_number_key" ON "crucible_universes"("simulation_id", "universe_number");

-- CreateIndex
CREATE INDEX "crucible_impacts_simulation_id_impact_category_idx" ON "crucible_impacts"("simulation_id", "impact_category");

-- CreateIndex
CREATE INDEX "crucible_failure_cascades_universe_id_idx" ON "crucible_failure_cascades"("universe_id");

-- CreateIndex
CREATE INDEX "crucible_council_deliberations_simulation_id_idx" ON "crucible_council_deliberations"("simulation_id");

-- CreateIndex
CREATE INDEX "panopticon_regulations_organization_id_status_idx" ON "panopticon_regulations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "panopticon_regulations_framework_code_idx" ON "panopticon_regulations"("framework_code");

-- CreateIndex
CREATE INDEX "panopticon_regulations_jurisdiction_idx" ON "panopticon_regulations"("jurisdiction");

-- CreateIndex
CREATE UNIQUE INDEX "panopticon_regulations_organization_id_framework_code_versi_key" ON "panopticon_regulations"("organization_id", "framework_code", "version");

-- CreateIndex
CREATE INDEX "panopticon_obligations_regulation_id_idx" ON "panopticon_obligations"("regulation_id");

-- CreateIndex
CREATE INDEX "panopticon_obligations_requirement_type_idx" ON "panopticon_obligations"("requirement_type");

-- CreateIndex
CREATE UNIQUE INDEX "panopticon_obligations_regulation_id_obligation_code_key" ON "panopticon_obligations"("regulation_id", "obligation_code");

-- CreateIndex
CREATE INDEX "panopticon_alignments_obligation_id_idx" ON "panopticon_alignments"("obligation_id");

-- CreateIndex
CREATE INDEX "panopticon_alignments_entity_type_entity_id_idx" ON "panopticon_alignments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "panopticon_violations_organization_id_status_idx" ON "panopticon_violations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "panopticon_violations_severity_idx" ON "panopticon_violations"("severity");

-- CreateIndex
CREATE INDEX "panopticon_forecasts_organization_id_idx" ON "panopticon_forecasts"("organization_id");

-- CreateIndex
CREATE INDEX "panopticon_forecasts_forecast_type_idx" ON "panopticon_forecasts"("forecast_type");

-- CreateIndex
CREATE INDEX "aegis_signals_organization_id_signal_type_idx" ON "aegis_signals"("organization_id", "signal_type");

-- CreateIndex
CREATE INDEX "aegis_signals_severity_idx" ON "aegis_signals"("severity");

-- CreateIndex
CREATE INDEX "aegis_signals_created_at_idx" ON "aegis_signals"("created_at");

-- CreateIndex
CREATE INDEX "aegis_threats_organization_id_status_idx" ON "aegis_threats"("organization_id", "status");

-- CreateIndex
CREATE INDEX "aegis_threats_threat_type_idx" ON "aegis_threats"("threat_type");

-- CreateIndex
CREATE INDEX "aegis_threats_severity_idx" ON "aegis_threats"("severity");

-- CreateIndex
CREATE INDEX "aegis_scenarios_threat_id_idx" ON "aegis_scenarios"("threat_id");

-- CreateIndex
CREATE INDEX "aegis_countermeasures_threat_id_idx" ON "aegis_countermeasures"("threat_id");

-- CreateIndex
CREATE INDEX "aegis_countermeasures_status_idx" ON "aegis_countermeasures"("status");

-- CreateIndex
CREATE INDEX "aegis_briefings_organization_id_idx" ON "aegis_briefings"("organization_id");

-- CreateIndex
CREATE INDEX "aegis_briefings_briefing_type_idx" ON "aegis_briefings"("briefing_type");

-- CreateIndex
CREATE INDEX "eternal_artifacts_organization_id_artifact_type_idx" ON "eternal_artifacts"("organization_id", "artifact_type");

-- CreateIndex
CREATE INDEX "eternal_artifacts_importance_score_idx" ON "eternal_artifacts"("importance_score");

-- CreateIndex
CREATE INDEX "eternal_artifacts_retention_years_idx" ON "eternal_artifacts"("retention_years");

-- CreateIndex
CREATE INDEX "eternal_validations_artifact_id_idx" ON "eternal_validations"("artifact_id");

-- CreateIndex
CREATE INDEX "eternal_validations_validated_at_idx" ON "eternal_validations"("validated_at");

-- CreateIndex
CREATE INDEX "eternal_migrations_organization_id_idx" ON "eternal_migrations"("organization_id");

-- CreateIndex
CREATE INDEX "eternal_migrations_status_idx" ON "eternal_migrations"("status");

-- CreateIndex
CREATE INDEX "eternal_succession_organization_id_idx" ON "eternal_succession"("organization_id");

-- CreateIndex
CREATE INDEX "symbiont_entities_organization_id_entity_type_idx" ON "symbiont_entities"("organization_id", "entity_type");

-- CreateIndex
CREATE INDEX "symbiont_entities_domain_idx" ON "symbiont_entities"("domain");

-- CreateIndex
CREATE INDEX "symbiont_opportunities_organization_id_status_idx" ON "symbiont_opportunities"("organization_id", "status");

-- CreateIndex
CREATE INDEX "symbiont_opportunities_opportunity_type_idx" ON "symbiont_opportunities"("opportunity_type");

-- CreateIndex
CREATE INDEX "symbiont_relationships_organization_id_idx" ON "symbiont_relationships"("organization_id");

-- CreateIndex
CREATE INDEX "symbiont_relationships_relationship_type_idx" ON "symbiont_relationships"("relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "symbiont_relationships_entity_id_related_entity_id_key" ON "symbiont_relationships"("entity_id", "related_entity_id");

-- CreateIndex
CREATE INDEX "symbiont_simulations_opportunity_id_idx" ON "symbiont_simulations"("opportunity_id");

-- CreateIndex
CREATE INDEX "vox_stakeholders_organization_id_stakeholder_type_idx" ON "vox_stakeholders"("organization_id", "stakeholder_type");

-- CreateIndex
CREATE INDEX "vox_signals_stakeholder_id_idx" ON "vox_signals"("stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_signals_signal_type_idx" ON "vox_signals"("signal_type");

-- CreateIndex
CREATE INDEX "vox_signals_created_at_idx" ON "vox_signals"("created_at");

-- CreateIndex
CREATE INDEX "vox_impacts_organization_id_idx" ON "vox_impacts"("organization_id");

-- CreateIndex
CREATE INDEX "vox_impacts_stakeholder_id_idx" ON "vox_impacts"("stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_impacts_decision_id_idx" ON "vox_impacts"("decision_id");

-- CreateIndex
CREATE INDEX "vox_votes_organization_id_idx" ON "vox_votes"("organization_id");

-- CreateIndex
CREATE INDEX "vox_votes_decision_id_idx" ON "vox_votes"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "vox_votes_decision_id_stakeholder_id_key" ON "vox_votes"("decision_id", "stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_assemblies_organization_id_idx" ON "vox_assemblies"("organization_id");

-- CreateIndex
CREATE INDEX "vox_assemblies_decision_id_idx" ON "vox_assemblies"("decision_id");

-- CreateIndex
CREATE INDEX "lineage_entities_organization_id_idx" ON "lineage_entities"("organization_id");

-- CreateIndex
CREATE INDEX "lineage_entities_entity_type_idx" ON "lineage_entities"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "lineage_relationships_source_id_target_id_relationship_type_key" ON "lineage_relationships"("source_id", "target_id", "relationship_type");

-- CreateIndex
CREATE INDEX "data_quality_reports_entity_id_idx" ON "data_quality_reports"("entity_id");

-- CreateIndex
CREATE INDEX "forecast_models_organization_id_idx" ON "forecast_models"("organization_id");

-- CreateIndex
CREATE INDEX "forecast_models_model_type_idx" ON "forecast_models"("model_type");

-- CreateIndex
CREATE INDEX "predictions_model_id_idx" ON "predictions"("model_id");

-- CreateIndex
CREATE INDEX "predictions_prediction_date_idx" ON "predictions"("prediction_date");

-- CreateIndex
CREATE UNIQUE INDEX "feature_importance_model_id_feature_name_key" ON "feature_importance"("model_id", "feature_name");

-- CreateIndex
CREATE INDEX "health_checks_organization_id_idx" ON "health_checks"("organization_id");

-- CreateIndex
CREATE INDEX "health_checks_component_idx" ON "health_checks"("component");

-- CreateIndex
CREATE INDEX "health_checks_checked_at_idx" ON "health_checks"("checked_at");

-- CreateIndex
CREATE INDEX "health_incidents_organization_id_idx" ON "health_incidents"("organization_id");

-- CreateIndex
CREATE INDEX "health_incidents_status_idx" ON "health_incidents"("status");

-- CreateIndex
CREATE INDEX "security_threats_organization_id_idx" ON "security_threats"("organization_id");

-- CreateIndex
CREATE INDEX "security_threats_status_idx" ON "security_threats"("status");

-- CreateIndex
CREATE INDEX "security_threats_severity_idx" ON "security_threats"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "security_policies_organization_id_name_key" ON "security_policies"("organization_id", "name");

-- CreateIndex
CREATE INDEX "security_audit_logs_organization_id_idx" ON "security_audit_logs"("organization_id");

-- CreateIndex
CREATE INDEX "security_audit_logs_action_idx" ON "security_audit_logs"("action");

-- CreateIndex
CREATE INDEX "security_audit_logs_created_at_idx" ON "security_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ethics_principles_organization_id_name_key" ON "ethics_principles"("organization_id", "name");

-- CreateIndex
CREATE INDEX "ethics_reviews_organization_id_idx" ON "ethics_reviews"("organization_id");

-- CreateIndex
CREATE INDEX "ethics_reviews_status_idx" ON "ethics_reviews"("status");

-- CreateIndex
CREATE INDEX "bias_checks_organization_id_idx" ON "bias_checks"("organization_id");

-- CreateIndex
CREATE INDEX "bias_checks_model_id_idx" ON "bias_checks"("model_id");

-- CreateIndex
CREATE INDEX "digital_twins_organization_id_idx" ON "digital_twins"("organization_id");

-- CreateIndex
CREATE INDEX "digital_twins_entity_type_idx" ON "digital_twins"("entity_type");

-- CreateIndex
CREATE INDEX "twin_snapshots_twin_id_idx" ON "twin_snapshots"("twin_id");

-- CreateIndex
CREATE INDEX "twin_snapshots_created_at_idx" ON "twin_snapshots"("created_at");

-- CreateIndex
CREATE INDEX "simulations_organization_id_idx" ON "simulations"("organization_id");

-- CreateIndex
CREATE INDEX "simulations_status_idx" ON "simulations"("status");

-- CreateIndex
CREATE INDEX "witness_records_organization_id_idx" ON "witness_records"("organization_id");

-- CreateIndex
CREATE INDEX "witness_records_event_type_idx" ON "witness_records"("event_type");

-- CreateIndex
CREATE INDEX "witness_records_legal_relevance_idx" ON "witness_records"("legal_relevance");

-- CreateIndex
CREATE INDEX "legal_holds_organization_id_idx" ON "legal_holds"("organization_id");

-- CreateIndex
CREATE INDEX "legal_holds_status_idx" ON "legal_holds"("status");

-- CreateIndex
CREATE INDEX "custody_events_record_id_idx" ON "custody_events"("record_id");

-- CreateIndex
CREATE INDEX "truth_claims_organization_id_idx" ON "truth_claims"("organization_id");

-- CreateIndex
CREATE INDEX "truth_claims_status_idx" ON "truth_claims"("status");

-- CreateIndex
CREATE INDEX "truth_claims_category_idx" ON "truth_claims"("category");

-- CreateIndex
CREATE INDEX "claim_evidence_claim_id_idx" ON "claim_evidence"("claim_id");

-- CreateIndex
CREATE UNIQUE INDEX "claim_votes_claim_id_voter_id_key" ON "claim_votes"("claim_id", "voter_id");

-- CreateIndex
CREATE INDEX "knowledge_articles_organization_id_idx" ON "knowledge_articles"("organization_id");

-- CreateIndex
CREATE INDEX "knowledge_articles_category_idx" ON "knowledge_articles"("category");

-- CreateIndex
CREATE INDEX "knowledge_articles_status_idx" ON "knowledge_articles"("status");

-- CreateIndex
CREATE UNIQUE INDEX "article_versions_article_id_version_key" ON "article_versions"("article_id", "version");

-- CreateIndex
CREATE INDEX "institutional_memories_organization_id_idx" ON "institutional_memories"("organization_id");

-- CreateIndex
CREATE INDEX "institutional_memories_memory_type_idx" ON "institutional_memories"("memory_type");

-- CreateIndex
CREATE UNIQUE INDEX "expertise_profiles_organization_id_user_id_key" ON "expertise_profiles"("organization_id", "user_id");

-- CreateIndex
CREATE INDEX "honeytokens_organization_id_idx" ON "honeytokens"("organization_id");

-- CreateIndex
CREATE INDEX "honeytokens_triggered_idx" ON "honeytokens"("triggered");

-- CreateIndex
CREATE INDEX "canary_systems_organization_id_idx" ON "canary_systems"("organization_id");

-- CreateIndex
CREATE INDEX "canary_systems_status_idx" ON "canary_systems"("status");

-- CreateIndex
CREATE INDEX "canary_alerts_canary_id_idx" ON "canary_alerts"("canary_id");

-- CreateIndex
CREATE INDEX "canary_alerts_created_at_idx" ON "canary_alerts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "hardware_keys_serial_number_key" ON "hardware_keys"("serial_number");

-- CreateIndex
CREATE INDEX "hardware_keys_organization_id_idx" ON "hardware_keys"("organization_id");

-- CreateIndex
CREATE INDEX "hardware_keys_status_idx" ON "hardware_keys"("status");

-- CreateIndex
CREATE INDEX "auth_challenges_key_id_idx" ON "auth_challenges"("key_id");

-- CreateIndex
CREATE INDEX "high_risk_operations_organization_id_idx" ON "high_risk_operations"("organization_id");

-- CreateIndex
CREATE INDEX "key_audit_logs_key_id_idx" ON "key_audit_logs"("key_id");

-- CreateIndex
CREATE INDEX "key_audit_logs_created_at_idx" ON "key_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "mesh_nodes_organization_id_idx" ON "mesh_nodes"("organization_id");

-- CreateIndex
CREATE INDEX "mesh_nodes_status_idx" ON "mesh_nodes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "mesh_connections_source_node_id_target_node_id_key" ON "mesh_connections"("source_node_id", "target_node_id");

-- CreateIndex
CREATE INDEX "secure_channels_organization_id_idx" ON "secure_channels"("organization_id");

-- CreateIndex
CREATE INDEX "secure_channels_status_idx" ON "secure_channels"("status");

-- CreateIndex
CREATE UNIQUE INDEX "blackbox_units_serial_number_key" ON "blackbox_units"("serial_number");

-- CreateIndex
CREATE INDEX "blackbox_units_organization_id_idx" ON "blackbox_units"("organization_id");

-- CreateIndex
CREATE INDEX "blackbox_units_status_idx" ON "blackbox_units"("status");

-- CreateIndex
CREATE INDEX "backup_jobs_organization_id_idx" ON "backup_jobs"("organization_id");

-- CreateIndex
CREATE INDEX "backup_jobs_status_idx" ON "backup_jobs"("status");

-- CreateIndex
CREATE INDEX "stored_records_blackbox_id_idx" ON "stored_records"("blackbox_id");

-- CreateIndex
CREATE INDEX "stored_records_organization_id_idx" ON "stored_records"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "ar_devices_serial_number_key" ON "ar_devices"("serial_number");

-- CreateIndex
CREATE INDEX "ar_devices_organization_id_idx" ON "ar_devices"("organization_id");

-- CreateIndex
CREATE INDEX "ar_devices_status_idx" ON "ar_devices"("status");

-- CreateIndex
CREATE INDEX "ar_overlays_organization_id_idx" ON "ar_overlays"("organization_id");

-- CreateIndex
CREATE INDEX "ar_overlays_overlay_type_idx" ON "ar_overlays"("overlay_type");

-- CreateIndex
CREATE INDEX "ar_sessions_organization_id_idx" ON "ar_sessions"("organization_id");

-- CreateIndex
CREATE INDEX "ar_sessions_status_idx" ON "ar_sessions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_content_hash_key" ON "embeddings"("content_hash");

-- CreateIndex
CREATE INDEX "embeddings_organization_id_idx" ON "embeddings"("organization_id");

-- CreateIndex
CREATE INDEX "embeddings_source_id_idx" ON "embeddings"("source_id");

-- CreateIndex
CREATE INDEX "embeddings_source_type_idx" ON "embeddings"("source_type");

-- CreateIndex
CREATE UNIQUE INDEX "llm_cache_query_hash_key" ON "llm_cache"("query_hash");

-- CreateIndex
CREATE INDEX "llm_cache_model_idx" ON "llm_cache"("model");

-- CreateIndex
CREATE INDEX "query_classifications_classification_idx" ON "query_classifications"("classification");

-- CreateIndex
CREATE INDEX "query_classifications_organization_id_idx" ON "query_classifications"("organization_id");

-- CreateIndex
CREATE INDEX "query_classifications_routed_model_idx" ON "query_classifications"("routed_model");

-- AddForeignKey
ALTER TABLE "crucible_simulations" ADD CONSTRAINT "crucible_simulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_simulations" ADD CONSTRAINT "crucible_simulations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_universes" ADD CONSTRAINT "crucible_universes_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_impacts" ADD CONSTRAINT "crucible_impacts_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_failure_cascades" ADD CONSTRAINT "crucible_failure_cascades_universe_id_fkey" FOREIGN KEY ("universe_id") REFERENCES "crucible_universes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_council_deliberations" ADD CONSTRAINT "crucible_council_deliberations_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_regulations" ADD CONSTRAINT "panopticon_regulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_obligations" ADD CONSTRAINT "panopticon_obligations_regulation_id_fkey" FOREIGN KEY ("regulation_id") REFERENCES "panopticon_regulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_alignments" ADD CONSTRAINT "panopticon_alignments_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "panopticon_obligations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_regulation_id_fkey" FOREIGN KEY ("regulation_id") REFERENCES "panopticon_regulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "panopticon_obligations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_forecasts" ADD CONSTRAINT "panopticon_forecasts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_signals" ADD CONSTRAINT "aegis_signals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_threats" ADD CONSTRAINT "aegis_threats_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_threats" ADD CONSTRAINT "aegis_threats_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "aegis_signals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_scenarios" ADD CONSTRAINT "aegis_scenarios_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_countermeasures" ADD CONSTRAINT "aegis_countermeasures_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_artifacts" ADD CONSTRAINT "eternal_artifacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_artifacts" ADD CONSTRAINT "eternal_artifacts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_validations" ADD CONSTRAINT "eternal_validations_artifact_id_fkey" FOREIGN KEY ("artifact_id") REFERENCES "eternal_artifacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_migrations" ADD CONSTRAINT "eternal_migrations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_succession" ADD CONSTRAINT "eternal_succession_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_entities" ADD CONSTRAINT "symbiont_entities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_related_entity_id_fkey" FOREIGN KEY ("related_entity_id") REFERENCES "symbiont_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_simulations" ADD CONSTRAINT "symbiont_simulations_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "symbiont_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_stakeholders" ADD CONSTRAINT "vox_stakeholders_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_signals" ADD CONSTRAINT "vox_signals_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_assemblies" ADD CONSTRAINT "vox_assemblies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineage_relationships" ADD CONSTRAINT "lineage_relationships_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineage_relationships" ADD CONSTRAINT "lineage_relationships_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_reports" ADD CONSTRAINT "data_quality_reports_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "forecast_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_importance" ADD CONSTRAINT "feature_importance_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "forecast_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ethics_reviews" ADD CONSTRAINT "ethics_reviews_principle_id_fkey" FOREIGN KEY ("principle_id") REFERENCES "ethics_principles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "twin_snapshots" ADD CONSTRAINT "twin_snapshots_twin_id_fkey" FOREIGN KEY ("twin_id") REFERENCES "digital_twins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custody_events" ADD CONSTRAINT "custody_events_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "witness_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "truth_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_votes" ADD CONSTRAINT "claim_votes_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "truth_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_versions" ADD CONSTRAINT "article_versions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "knowledge_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "canary_alerts" ADD CONSTRAINT "canary_alerts_canary_id_fkey" FOREIGN KEY ("canary_id") REFERENCES "canary_systems"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_challenges" ADD CONSTRAINT "auth_challenges_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "hardware_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_audit_logs" ADD CONSTRAINT "key_audit_logs_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "hardware_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesh_connections" ADD CONSTRAINT "mesh_connections_source_node_id_fkey" FOREIGN KEY ("source_node_id") REFERENCES "mesh_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mesh_connections" ADD CONSTRAINT "mesh_connections_target_node_id_fkey" FOREIGN KEY ("target_node_id") REFERENCES "mesh_nodes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "backup_jobs" ADD CONSTRAINT "backup_jobs_blackbox_id_fkey" FOREIGN KEY ("blackbox_id") REFERENCES "blackbox_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stored_records" ADD CONSTRAINT "stored_records_blackbox_id_fkey" FOREIGN KEY ("blackbox_id") REFERENCES "blackbox_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ar_sessions" ADD CONSTRAINT "ar_sessions_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "ar_devices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
