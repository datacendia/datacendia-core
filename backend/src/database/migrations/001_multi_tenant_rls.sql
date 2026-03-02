-- =============================================================================
-- MULTI-TENANT ISOLATION WITH ROW-LEVEL SECURITY
-- Enterprise requirement for data isolation between organizations
-- Ensures no customer data can be accessed by another customer
-- =============================================================================

-- Enable Row-Level Security on all tables
-- Run this migration to add multi-tenant isolation

BEGIN;

-- =============================================================================
-- 1. ADD ORG_ID TO ALL TABLES
-- =============================================================================

-- Organizations table (master tenant table)
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) DEFAULT 'enterprise',
    settings JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Add org_id to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_users_org_id ON users(org_id);

-- Add org_id to decisions table
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_decisions_org_id ON decisions(org_id);

-- Add org_id to deliberations table
ALTER TABLE deliberations ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_deliberations_org_id ON deliberations(org_id);

-- Add org_id to audit_logs table
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id ON audit_logs(org_id);

-- Add org_id to scenarios table
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_scenarios_org_id ON scenarios(org_id);

-- Add org_id to forecasts table
ALTER TABLE forecasts ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_forecasts_org_id ON forecasts(org_id);

-- Add org_id to data_sources table
ALTER TABLE data_sources ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_data_sources_org_id ON data_sources(org_id);

-- Add org_id to agents table
ALTER TABLE agents ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_agents_org_id ON agents(org_id);

-- Add org_id to workflows table
ALTER TABLE workflows ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_workflows_org_id ON workflows(org_id);

-- Add org_id to autopilot_decisions table
ALTER TABLE autopilot_decisions ADD COLUMN IF NOT EXISTS org_id UUID REFERENCES organizations(id);
CREATE INDEX IF NOT EXISTS idx_autopilot_decisions_org_id ON autopilot_decisions(org_id);

-- =============================================================================
-- 2. ENABLE ROW-LEVEL SECURITY
-- =============================================================================

-- Enable RLS on all tenant tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliberations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE autopilot_decisions ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- 3. CREATE RLS POLICIES
-- =============================================================================

-- Helper function to get current org_id from session
CREATE OR REPLACE FUNCTION current_org_id()
RETURNS UUID AS $$
BEGIN
    RETURN current_setting('app.current_org_id', true)::UUID;
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users policies
DROP POLICY IF EXISTS users_isolation_policy ON users;
CREATE POLICY users_isolation_policy ON users
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Decisions policies
DROP POLICY IF EXISTS decisions_isolation_policy ON decisions;
CREATE POLICY decisions_isolation_policy ON decisions
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Deliberations policies
DROP POLICY IF EXISTS deliberations_isolation_policy ON deliberations;
CREATE POLICY deliberations_isolation_policy ON deliberations
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Audit logs policies
DROP POLICY IF EXISTS audit_logs_isolation_policy ON audit_logs;
CREATE POLICY audit_logs_isolation_policy ON audit_logs
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Scenarios policies
DROP POLICY IF EXISTS scenarios_isolation_policy ON scenarios;
CREATE POLICY scenarios_isolation_policy ON scenarios
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Forecasts policies
DROP POLICY IF EXISTS forecasts_isolation_policy ON forecasts;
CREATE POLICY forecasts_isolation_policy ON forecasts
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Data sources policies
DROP POLICY IF EXISTS data_sources_isolation_policy ON data_sources;
CREATE POLICY data_sources_isolation_policy ON data_sources
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Agents policies
DROP POLICY IF EXISTS agents_isolation_policy ON agents;
CREATE POLICY agents_isolation_policy ON agents
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Workflows policies
DROP POLICY IF EXISTS workflows_isolation_policy ON workflows;
CREATE POLICY workflows_isolation_policy ON workflows
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- Autopilot decisions policies
DROP POLICY IF EXISTS autopilot_decisions_isolation_policy ON autopilot_decisions;
CREATE POLICY autopilot_decisions_isolation_policy ON autopilot_decisions
    FOR ALL
    USING (org_id = current_org_id())
    WITH CHECK (org_id = current_org_id());

-- =============================================================================
-- 4. ADMIN BYPASS POLICIES (for system operations)
-- =============================================================================

-- Create admin role if not exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'datacendia_admin') THEN
        CREATE ROLE datacendia_admin;
    END IF;
END
$$;

-- Admin policies for each table (bypasses RLS)
CREATE POLICY users_admin_policy ON users
    FOR ALL TO datacendia_admin
    USING (true)
    WITH CHECK (true);

CREATE POLICY decisions_admin_policy ON decisions
    FOR ALL TO datacendia_admin
    USING (true)
    WITH CHECK (true);

CREATE POLICY deliberations_admin_policy ON deliberations
    FOR ALL TO datacendia_admin
    USING (true)
    WITH CHECK (true);

CREATE POLICY audit_logs_admin_policy ON audit_logs
    FOR ALL TO datacendia_admin
    USING (true)
    WITH CHECK (true);

-- =============================================================================
-- 5. AUDIT TRIGGERS
-- =============================================================================

-- Function to automatically set org_id on insert
CREATE OR REPLACE FUNCTION set_org_id_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.org_id IS NULL THEN
        NEW.org_id := current_org_id();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables
CREATE TRIGGER users_set_org_id
    BEFORE INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER decisions_set_org_id
    BEFORE INSERT ON decisions
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER deliberations_set_org_id
    BEFORE INSERT ON deliberations
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER audit_logs_set_org_id
    BEFORE INSERT ON audit_logs
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER scenarios_set_org_id
    BEFORE INSERT ON scenarios
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER forecasts_set_org_id
    BEFORE INSERT ON forecasts
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER data_sources_set_org_id
    BEFORE INSERT ON data_sources
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER agents_set_org_id
    BEFORE INSERT ON agents
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER workflows_set_org_id
    BEFORE INSERT ON workflows
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

CREATE TRIGGER autopilot_decisions_set_org_id
    BEFORE INSERT ON autopilot_decisions
    FOR EACH ROW EXECUTE FUNCTION set_org_id_on_insert();

COMMIT;

-- =============================================================================
-- USAGE NOTES
-- =============================================================================
-- 
-- To use multi-tenant isolation, set the org_id in session before queries:
--
--   SET app.current_org_id = 'your-org-uuid';
--   SELECT * FROM decisions; -- Only returns decisions for that org
--
-- In application code (Node.js with Prisma or pg):
--
--   await pool.query("SET app.current_org_id = $1", [orgId]);
--   // All subsequent queries are automatically filtered
--
-- For admin operations, use the datacendia_admin role:
--
--   SET ROLE datacendia_admin;
--   SELECT * FROM decisions; -- Returns all decisions across all orgs
--
-- =============================================================================
