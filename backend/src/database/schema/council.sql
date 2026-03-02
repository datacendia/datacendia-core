-- =============================================================================
-- DATACENDIA COUNCIL - ENTERPRISE DATABASE SCHEMA
-- PostgreSQL Schema for AI Deliberations, Sessions, and Agent Memory
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- For embedding-based memory search

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

CREATE TYPE deliberation_status AS ENUM (
  'pending',
  'initial_analysis',
  'cross_examination',
  'synthesis',
  'ethics_check',
  'completed',
  'cancelled',
  'error'
);

CREATE TYPE agent_status AS ENUM (
  'online',
  'offline',
  'busy',
  'error'
);

CREATE TYPE message_type AS ENUM (
  'analysis',
  'challenge',
  'rebuttal',
  'consensus',
  'synthesis',
  'concern',
  'recommendation'
);

CREATE TYPE memory_type AS ENUM (
  'factual',
  'procedural',
  'contextual',
  'preference',
  'insight'
);

-- =============================================================================
-- CORE TABLES
-- =============================================================================

-- Users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  organization_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  domain VARCHAR(255),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AGENT CONFIGURATION
-- =============================================================================

CREATE TABLE council_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  avatar VARCHAR(10),
  color VARCHAR(20),
  capabilities TEXT[],
  system_prompt TEXT NOT NULL,
  model VARCHAR(100) DEFAULT 'llama3.2',
  temperature DECIMAL(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2048,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 5, -- Lower = higher priority in deliberations
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Agent status tracking (real-time)
CREATE TABLE agent_status_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES council_agents(id) ON DELETE CASCADE,
  status agent_status NOT NULL,
  latency_ms INTEGER,
  error_message TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- SESSIONS & DELIBERATIONS
-- =============================================================================

-- User sessions with the Council
CREATE TABLE council_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  title VARCHAR(500),
  context JSONB DEFAULT '{}', -- Session-level context
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Individual deliberations within a session
CREATE TABLE deliberations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES council_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
  
  -- Query details
  question TEXT NOT NULL,
  context TEXT, -- Additional context provided
  
  -- Status tracking
  status deliberation_status DEFAULT 'pending',
  current_phase VARCHAR(50),
  phase_started_at TIMESTAMP WITH TIME ZONE,
  
  -- Participating agents
  requested_agents UUID[], -- Agents requested by user
  participating_agents UUID[], -- Agents actually participating
  
  -- Configuration
  config JSONB DEFAULT '{
    "max_duration_seconds": 300,
    "require_consensus": false,
    "enable_cross_examination": true,
    "min_confidence_threshold": 0.7,
    "max_rounds": 3
  }',
  
  -- Results
  synthesis TEXT,
  confidence_score DECIMAL(5,4),
  consensus_reached BOOLEAN,
  key_insights JSONB,
  recommendations JSONB,
  dissenting_views JSONB,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  
  -- Metadata
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- AGENT RESPONSES & CROSS-EXAMINATION
-- =============================================================================

-- Individual agent responses in a deliberation
CREATE TABLE agent_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliberation_id UUID REFERENCES deliberations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES council_agents(id) ON DELETE CASCADE,
  
  -- Response details
  phase VARCHAR(50) NOT NULL, -- 'initial_analysis', 'cross_examination', 'synthesis'
  round INTEGER DEFAULT 1,
  message_type message_type DEFAULT 'analysis',
  
  -- Content
  response TEXT NOT NULL,
  reasoning TEXT, -- Chain of thought
  confidence DECIMAL(5,4),
  
  -- For cross-examination
  target_agent_id UUID REFERENCES council_agents(id), -- Agent being challenged
  target_response_id UUID REFERENCES agent_responses(id), -- Response being challenged
  challenge_type VARCHAR(50), -- 'question', 'disagreement', 'clarification', 'support'
  
  -- Metadata
  tokens_used INTEGER,
  latency_ms INTEGER,
  model_used VARCHAR(100),
  
  -- Streaming support
  is_streaming BOOLEAN DEFAULT false,
  stream_completed BOOLEAN DEFAULT false,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cross-examination threads
CREATE TABLE cross_examination_threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deliberation_id UUID REFERENCES deliberations(id) ON DELETE CASCADE,
  
  -- Thread participants
  challenger_agent_id UUID REFERENCES council_agents(id),
  challenged_agent_id UUID REFERENCES council_agents(id),
  
  -- Initial challenge
  initial_response_id UUID REFERENCES agent_responses(id),
  challenge_response_id UUID REFERENCES agent_responses(id),
  
  -- Resolution
  resolved BOOLEAN DEFAULT false,
  resolution_type VARCHAR(50), -- 'consensus', 'agree_to_disagree', 'deferred', 'withdrawn'
  resolution_summary TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- =============================================================================
-- AGENT MEMORY SYSTEM
-- =============================================================================

-- Long-term agent memory (facts, preferences, insights)
CREATE TABLE agent_memories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES council_agents(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  
  -- Memory content
  memory_type memory_type NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500), -- Short summary for quick retrieval
  
  -- Vector embedding for semantic search (1536 dimensions for OpenAI, 4096 for llama)
  embedding vector(1536),
  
  -- Context
  source_deliberation_id UUID REFERENCES deliberations(id) ON DELETE SET NULL,
  related_entities JSONB, -- References to entities in knowledge graph
  tags TEXT[],
  
  -- Importance & decay
  importance_score DECIMAL(5,4) DEFAULT 0.5,
  access_count INTEGER DEFAULT 0,
  last_accessed_at TIMESTAMP WITH TIME ZONE,
  decay_rate DECIMAL(5,4) DEFAULT 0.01, -- How fast memory fades
  
  -- Validity
  is_valid BOOLEAN DEFAULT true,
  invalidated_reason TEXT,
  invalidated_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Session context (short-term memory for current session)
CREATE TABLE session_context (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES council_sessions(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES council_agents(id) ON DELETE CASCADE,
  
  -- Context data
  context_key VARCHAR(255) NOT NULL,
  context_value JSONB NOT NULL,
  
  -- Metadata
  source VARCHAR(100), -- 'user_input', 'agent_inference', 'system'
  confidence DECIMAL(5,4),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(session_id, agent_id, context_key)
);

-- =============================================================================
-- AUDIT & ANALYTICS
-- =============================================================================

-- Comprehensive audit log
CREATE TABLE council_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- What happened
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  
  -- Who/what did it
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  agent_id UUID REFERENCES council_agents(id) ON DELETE SET NULL,
  session_id UUID REFERENCES council_sessions(id) ON DELETE SET NULL,
  
  -- Details
  old_value JSONB,
  new_value JSONB,
  metadata JSONB,
  
  -- Context
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics aggregations
CREATE TABLE council_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Time bucket
  time_bucket TIMESTAMP WITH TIME ZONE NOT NULL,
  granularity VARCHAR(20) NOT NULL, -- 'hour', 'day', 'week', 'month'
  
  -- Dimensions
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  agent_id UUID REFERENCES council_agents(id) ON DELETE CASCADE,
  
  -- Metrics
  total_deliberations INTEGER DEFAULT 0,
  completed_deliberations INTEGER DEFAULT 0,
  avg_confidence DECIMAL(5,4),
  avg_duration_ms INTEGER,
  total_tokens_used BIGINT DEFAULT 0,
  consensus_rate DECIMAL(5,4),
  user_satisfaction_avg DECIMAL(3,2),
  
  -- Cross-examination metrics
  challenges_initiated INTEGER DEFAULT 0,
  challenges_resolved INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(time_bucket, granularity, organization_id, agent_id)
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Deliberations
CREATE INDEX idx_deliberations_session ON deliberations(session_id);
CREATE INDEX idx_deliberations_user ON deliberations(user_id);
CREATE INDEX idx_deliberations_org ON deliberations(organization_id);
CREATE INDEX idx_deliberations_status ON deliberations(status);
CREATE INDEX idx_deliberations_created ON deliberations(created_at DESC);

-- Agent responses
CREATE INDEX idx_agent_responses_deliberation ON agent_responses(deliberation_id);
CREATE INDEX idx_agent_responses_agent ON agent_responses(agent_id);
CREATE INDEX idx_agent_responses_phase ON agent_responses(phase, round);
CREATE INDEX idx_agent_responses_created ON agent_responses(created_at);

-- Agent memories - optimized for semantic search
CREATE INDEX idx_agent_memories_agent ON agent_memories(agent_id);
CREATE INDEX idx_agent_memories_org ON agent_memories(organization_id);
CREATE INDEX idx_agent_memories_type ON agent_memories(memory_type);
CREATE INDEX idx_agent_memories_embedding ON agent_memories USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_agent_memories_tags ON agent_memories USING gin(tags);

-- Session context
CREATE INDEX idx_session_context_session ON session_context(session_id);
CREATE INDEX idx_session_context_agent ON session_context(agent_id);

-- Audit log
CREATE INDEX idx_audit_log_entity ON council_audit_log(entity_type, entity_id);
CREATE INDEX idx_audit_log_user ON council_audit_log(user_id);
CREATE INDEX idx_audit_log_created ON council_audit_log(created_at DESC);

-- Analytics
CREATE INDEX idx_analytics_time ON council_analytics(time_bucket, granularity);
CREATE INDEX idx_analytics_org ON council_analytics(organization_id);

-- =============================================================================
-- FUNCTIONS & TRIGGERS
-- =============================================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to relevant tables
CREATE TRIGGER update_deliberations_timestamp
  BEFORE UPDATE ON deliberations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_agent_memories_timestamp
  BEFORE UPDATE ON agent_memories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_council_agents_timestamp
  BEFORE UPDATE ON council_agents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Calculate deliberation duration on completion
CREATE OR REPLACE FUNCTION calculate_deliberation_duration()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status IN ('completed', 'cancelled', 'error') AND NEW.completed_at IS NOT NULL AND NEW.started_at IS NOT NULL THEN
    NEW.duration_ms = EXTRACT(EPOCH FROM (NEW.completed_at - NEW.started_at)) * 1000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_duration_trigger
  BEFORE UPDATE ON deliberations
  FOR EACH ROW EXECUTE FUNCTION calculate_deliberation_duration();

-- Auto-decay memory importance over time
CREATE OR REPLACE FUNCTION decay_memory_importance()
RETURNS void AS $$
BEGIN
  UPDATE agent_memories
  SET importance_score = GREATEST(0.1, importance_score * (1 - decay_rate))
  WHERE is_valid = true
    AND last_accessed_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Semantic memory search function
CREATE OR REPLACE FUNCTION search_agent_memories(
  p_agent_id UUID,
  p_query_embedding vector(1536),
  p_limit INTEGER DEFAULT 10,
  p_min_similarity DECIMAL DEFAULT 0.7
)
RETURNS TABLE (
  memory_id UUID,
  content TEXT,
  summary VARCHAR(500),
  memory_type memory_type,
  importance_score DECIMAL,
  similarity DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    am.id as memory_id,
    am.content,
    am.summary,
    am.memory_type,
    am.importance_score,
    (1 - (am.embedding <=> p_query_embedding))::DECIMAL as similarity
  FROM agent_memories am
  WHERE am.agent_id = p_agent_id
    AND am.is_valid = true
    AND (1 - (am.embedding <=> p_query_embedding)) >= p_min_similarity
  ORDER BY 
    (1 - (am.embedding <=> p_query_embedding)) * am.importance_score DESC
  LIMIT p_limit;
  
  -- Update access count for retrieved memories
  UPDATE agent_memories
  SET access_count = access_count + 1,
      last_accessed_at = NOW()
  WHERE id IN (
    SELECT am.id
    FROM agent_memories am
    WHERE am.agent_id = p_agent_id
      AND am.is_valid = true
      AND (1 - (am.embedding <=> p_query_embedding)) >= p_min_similarity
    ORDER BY (1 - (am.embedding <=> p_query_embedding)) * am.importance_score DESC
    LIMIT p_limit
  );
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- SEED DATA - Default Agents
-- =============================================================================

INSERT INTO council_agents (code, name, role, description, avatar, color, capabilities, system_prompt, model, priority) VALUES
('chief', 'Chief Strategy Agent', 'Strategic Oversight & Synthesis', 
 'Synthesizes insights from all domain agents to provide holistic strategic recommendations. Orchestrates cross-functional analysis.',
 '👔', '#6366F1', 
 ARRAY['Strategic Planning', 'Cross-Domain Synthesis', 'Executive Summaries', 'Decision Orchestration'],
 'You are the Chief Strategy Agent for Datacendia, an enterprise intelligence platform. Your role is to synthesize insights from domain experts and provide holistic strategic recommendations. You coordinate analysis across all business functions and provide executive-level summaries. Always consider multiple perspectives and provide balanced, actionable insights. Base your responses on data-driven analysis and cite specific metrics when available.',
 'llama3.2', 1),

('cfo', 'Financial Intelligence Agent', 'Financial Analysis & Risk',
 'Analyzes financial data, budgets, forecasts, and provides insights on fiscal health, ROI calculations, and financial risk assessment.',
 '💰', '#10B981',
 ARRAY['Financial Analysis', 'Budget Forecasting', 'ROI Calculations', 'Risk Assessment'],
 'You are the Financial Intelligence Agent for Datacendia. Your expertise covers financial analysis, budgeting, forecasting, P&L analysis, cash flow management, and financial risk. Provide precise financial insights with relevant metrics, percentages, and dollar amounts. Always consider ROI, cost-benefit analysis, and financial sustainability in your recommendations. Be conservative in estimates and highlight financial risks clearly.',
 'llama3.2', 2),

('coo', 'Operations Intelligence Agent', 'Operational Efficiency',
 'Focuses on operational metrics, process efficiency, supply chain optimization, and resource allocation.',
 '⚙️', '#F59E0B',
 ARRAY['Process Optimization', 'Supply Chain', 'Resource Allocation', 'Efficiency Metrics'],
 'You are the Operations Intelligence Agent for Datacendia. Your domain covers operational efficiency, process optimization, supply chain management, logistics, and resource allocation. Focus on metrics like throughput, cycle time, utilization rates, and operational costs. Provide actionable recommendations for improving operational efficiency. Consider dependencies between processes and potential bottlenecks.',
 'llama3.2', 3),

('ciso', 'Security & Compliance Agent', 'Security & Risk Management',
 'Monitors security posture, compliance requirements, threat assessment, and data protection policies.',
 '🔒', '#EF4444',
 ARRAY['Security Assessment', 'Compliance Monitoring', 'Threat Analysis', 'Data Protection'],
 'You are the Security & Compliance Agent for Datacendia. Your expertise covers cybersecurity, data protection, regulatory compliance (GDPR, SOC2, HIPAA, etc.), and risk management. Prioritize security implications in all recommendations. Identify potential vulnerabilities, compliance gaps, and security risks. Provide specific, actionable security measures and compliance guidance. When you identify a critical security concern, clearly mark it as a BLOCKING CONCERN.',
 'llama3.2', 2),

('cmo', 'Market Intelligence Agent', 'Marketing & Customer Insights',
 'Analyzes market trends, customer behavior, campaign performance, and competitive intelligence.',
 '📢', '#EC4899',
 ARRAY['Market Analysis', 'Customer Insights', 'Campaign Analytics', 'Competitive Intelligence'],
 'You are the Market Intelligence Agent for Datacendia. Your domain covers marketing analytics, customer behavior, market trends, competitive analysis, and campaign performance. Focus on metrics like customer acquisition cost, lifetime value, conversion rates, and market share. Provide insights on customer segments, market opportunities, and competitive positioning. Base recommendations on customer data and market intelligence.',
 'llama3.2', 4),

('cro', 'Revenue Intelligence Agent', 'Revenue & Growth',
 'Focuses on revenue optimization, sales performance, pricing strategies, and growth opportunities.',
 '📈', '#8B5CF6',
 ARRAY['Revenue Analysis', 'Sales Performance', 'Pricing Strategy', 'Growth Opportunities'],
 'You are the Revenue Intelligence Agent for Datacendia. Your expertise covers revenue optimization, sales analytics, pricing strategies, pipeline management, and growth forecasting. Focus on metrics like revenue growth, deal velocity, win rates, and average deal size. Identify revenue opportunities and provide data-driven pricing recommendations. Consider market dynamics and competitive pricing in your analysis.',
 'llama3.2', 3),

('cdo', 'Data Quality Agent', 'Data Governance & Quality',
 'Monitors data quality, governance policies, data lineage, and ensures data integrity across the platform.',
 '📊', '#06B6D4',
 ARRAY['Data Quality', 'Data Governance', 'Data Lineage', 'Master Data Management'],
 'You are the Data Quality Agent for Datacendia. Your domain covers data governance, data quality metrics, data lineage, metadata management, and data integrity. Focus on metrics like data accuracy, completeness, consistency, and timeliness. Identify data quality issues and recommend remediation strategies. Ensure all data-driven decisions are based on trustworthy, well-governed data.',
 'llama3.2', 4),

('risk', 'Risk Assessment Agent', 'Enterprise Risk Analysis',
 'Evaluates enterprise risks, performs impact analysis, and provides risk mitigation strategies.',
 '⚠️', '#F97316',
 ARRAY['Risk Assessment', 'Impact Analysis', 'Mitigation Strategies', 'Scenario Planning'],
 'You are the Risk Assessment Agent for Datacendia. Your expertise covers enterprise risk management, risk identification, impact analysis, and mitigation strategies. Evaluate risks across multiple dimensions: financial, operational, strategic, compliance, and reputational. Provide risk scores, probability assessments, and prioritized mitigation recommendations. Consider interconnected risks and cascading effects in your analysis.',
 'llama3.2', 2)

ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  description = EXCLUDED.description,
  system_prompt = EXCLUDED.system_prompt,
  updated_at = NOW();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Active deliberations view
CREATE OR REPLACE VIEW v_active_deliberations AS
SELECT 
  d.*,
  cs.title as session_title,
  u.name as user_name,
  o.name as organization_name,
  (SELECT COUNT(*) FROM agent_responses ar WHERE ar.deliberation_id = d.id) as response_count
FROM deliberations d
LEFT JOIN council_sessions cs ON d.session_id = cs.id
LEFT JOIN users u ON d.user_id = u.id
LEFT JOIN organizations o ON d.organization_id = o.id
WHERE d.status NOT IN ('completed', 'cancelled', 'error');

-- Agent performance view
CREATE OR REPLACE VIEW v_agent_performance AS
SELECT 
  ca.id,
  ca.code,
  ca.name,
  COUNT(ar.id) as total_responses,
  AVG(ar.confidence) as avg_confidence,
  AVG(ar.latency_ms) as avg_latency_ms,
  COUNT(DISTINCT ar.deliberation_id) as deliberations_participated
FROM council_agents ca
LEFT JOIN agent_responses ar ON ca.id = ar.agent_id
WHERE ar.created_at > NOW() - INTERVAL '30 days'
GROUP BY ca.id, ca.code, ca.name;

COMMENT ON SCHEMA public IS 'Datacendia Council - Enterprise AI Deliberation System';
