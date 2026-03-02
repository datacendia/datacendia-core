-- Enterprise Department Services Migration
-- Generated for Datacendia Enterprise Services

-- CENDIAPROCURE™ - Procurement & Sourcing
CREATE TABLE IF NOT EXISTS enterprise_contracts (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  vendor_name TEXT NOT NULL,
  vendor_email TEXT,
  category TEXT NOT NULL,
  annual_value DECIMAL(15, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  renewal_date TIMESTAMP NOT NULL,
  auto_renew BOOLEAN DEFAULT false,
  usage_percent DECIMAL(5, 2) NOT NULL,
  market_benchmark DECIMAL(15, 2),
  terms TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_contracts_org ON enterprise_contracts(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_contracts_status ON enterprise_contracts(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_contracts_renewal ON enterprise_contracts(renewal_date);

CREATE TABLE IF NOT EXISTS enterprise_negotiations (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  contract_id TEXT NOT NULL REFERENCES enterprise_contracts(id) ON DELETE CASCADE,
  current_price DECIMAL(15, 2) NOT NULL,
  target_price DECIMAL(15, 2) NOT NULL,
  savings_estimate DECIMAL(15, 2) NOT NULL,
  leverage JSONB DEFAULT '[]',
  negotiation_script TEXT,
  draft_email TEXT,
  priority TEXT DEFAULT 'medium',
  deadline_days INTEGER NOT NULL,
  status TEXT DEFAULT 'pending',
  final_price DECIMAL(15, 2),
  savings_achieved DECIMAL(15, 2),
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_negotiations_contract ON enterprise_negotiations(contract_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_negotiations_status ON enterprise_negotiations(status);

-- CENDIAGUARDIAN™ - Customer Success
CREATE TABLE IF NOT EXISTS enterprise_customers (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  tier TEXT NOT NULL,
  arr DECIMAL(15, 2) NOT NULL,
  mrr DECIMAL(15, 2) NOT NULL,
  contract_start TIMESTAMP NOT NULL,
  contract_end TIMESTAMP NOT NULL,
  csm_id TEXT,
  csm_name TEXT,
  health_score INTEGER DEFAULT 80,
  nps_score INTEGER,
  last_activity TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_customers_org ON enterprise_customers(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_customers_tier ON enterprise_customers(tier);
CREATE INDEX IF NOT EXISTS idx_enterprise_customers_health ON enterprise_customers(health_score);

CREATE TABLE IF NOT EXISTS enterprise_customer_health (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL REFERENCES enterprise_customers(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL,
  trend TEXT NOT NULL,
  components JSONB DEFAULT '[]',
  risk_factors JSONB DEFAULT '[]',
  opportunities JSONB DEFAULT '[]',
  recommended_actions JSONB DEFAULT '[]',
  assessed_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_customer_health_customer ON enterprise_customer_health(customer_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_customer_health_assessed ON enterprise_customer_health(assessed_at);

CREATE TABLE IF NOT EXISTS enterprise_customer_engagements (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_id TEXT NOT NULL REFERENCES enterprise_customers(id) ON DELETE CASCADE,
  period_start TIMESTAMP NOT NULL,
  period_end TIMESTAMP NOT NULL,
  login_count INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  feature_adoption JSONB DEFAULT '[]',
  support_tickets INTEGER DEFAULT 0,
  nps_response INTEGER,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_customer_engagements_customer ON enterprise_customer_engagements(customer_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_customer_engagements_period ON enterprise_customer_engagements(period_start);

-- CENDIENERVE™ - IT Operations
CREATE TABLE IF NOT EXISTS enterprise_services (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'healthy',
  uptime DECIMAL(5, 2) NOT NULL,
  latency INTEGER NOT NULL,
  error_rate DECIMAL(5, 2) NOT NULL,
  throughput INTEGER NOT NULL,
  dependencies JSONB DEFAULT '[]',
  metadata JSONB DEFAULT '{}',
  last_health_check TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_services_org ON enterprise_services(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_services_status ON enterprise_services(status);

CREATE TABLE IF NOT EXISTS enterprise_incidents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  service_id TEXT REFERENCES enterprise_services(id),
  title TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'detected',
  description TEXT,
  root_cause TEXT,
  customer_impact JSONB DEFAULT '{}',
  timeline JSONB DEFAULT '[]',
  assignee TEXT,
  detected_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enterprise_incidents_org ON enterprise_incidents(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_incidents_severity ON enterprise_incidents(severity);
CREATE INDEX IF NOT EXISTS idx_enterprise_incidents_status ON enterprise_incidents(status);

-- CENDIADOCKET™ - Legal Operations
CREATE TABLE IF NOT EXISTS enterprise_legal_matters (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  jurisdiction TEXT NOT NULL,
  description TEXT,
  parties JSONB DEFAULT '[]',
  risk_exposure DECIMAL(15, 2) NOT NULL,
  estimated_cost DECIMAL(15, 2) NOT NULL,
  actual_cost DECIMAL(15, 2) DEFAULT 0,
  win_probability INTEGER,
  timeline JSONB DEFAULT '[]',
  documents JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_legal_matters_org ON enterprise_legal_matters(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_legal_matters_type ON enterprise_legal_matters(type);
CREATE INDEX IF NOT EXISTS idx_enterprise_legal_matters_status ON enterprise_legal_matters(status);

-- CENDIAEQUITY™ - Investor Relations
CREATE TABLE IF NOT EXISTS enterprise_investors (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  investment_style TEXT,
  shares_held BIGINT DEFAULT 0,
  ownership_percent DECIMAL(5, 2) NOT NULL,
  avg_cost_basis DECIMAL(15, 2),
  sentiment TEXT DEFAULT 'neutral',
  last_contact TIMESTAMP,
  notes TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_investors_org ON enterprise_investors(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_investors_type ON enterprise_investors(type);

CREATE TABLE IF NOT EXISTS enterprise_shareholder_outreach (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  investor_id TEXT NOT NULL REFERENCES enterprise_investors(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  attendees JSONB DEFAULT '[]',
  topics JSONB DEFAULT '[]',
  status TEXT DEFAULT 'scheduled',
  outcome TEXT,
  follow_up TEXT,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_shareholder_outreach_investor ON enterprise_shareholder_outreach(investor_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_shareholder_outreach_date ON enterprise_shareholder_outreach(scheduled_date);

-- CENDIAFACTORY™ - Manufacturing
CREATE TABLE IF NOT EXISTS enterprise_production_lines (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  status TEXT DEFAULT 'idle',
  shift TEXT DEFAULT 'day',
  product TEXT,
  capacity INTEGER NOT NULL,
  current_output INTEGER DEFAULT 0,
  efficiency DECIMAL(5, 2) NOT NULL,
  quality DECIMAL(5, 2) NOT NULL,
  equipment JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_production_lines_org ON enterprise_production_lines(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_production_lines_status ON enterprise_production_lines(status);

CREATE TABLE IF NOT EXISTS enterprise_predictive_failures (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  line_id TEXT NOT NULL REFERENCES enterprise_production_lines(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  failure_type TEXT NOT NULL,
  probability DECIMAL(5, 2) NOT NULL,
  confidence DECIMAL(5, 2) NOT NULL,
  predicted_date TIMESTAMP NOT NULL,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'predicted',
  indicators JSONB DEFAULT '[]',
  estimated_downtime INTEGER NOT NULL,
  estimated_cost DECIMAL(15, 2) NOT NULL,
  maintenance_scheduled TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_predictive_failures_line ON enterprise_predictive_failures(line_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_predictive_failures_priority ON enterprise_predictive_failures(priority);
CREATE INDEX IF NOT EXISTS idx_enterprise_predictive_failures_status ON enterprise_predictive_failures(status);

CREATE TABLE IF NOT EXISTS enterprise_quality_events (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  line_id TEXT NOT NULL REFERENCES enterprise_production_lines(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  severity TEXT NOT NULL,
  batch_affected TEXT,
  units_affected INTEGER DEFAULT 0,
  description TEXT NOT NULL,
  root_cause TEXT,
  corrective_action TEXT,
  status TEXT DEFAULT 'investigating',
  timestamp TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enterprise_quality_events_line ON enterprise_quality_events(line_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_quality_events_severity ON enterprise_quality_events(severity);
CREATE INDEX IF NOT EXISTS idx_enterprise_quality_events_status ON enterprise_quality_events(status);

-- CENDIATRANSIT™ - Travel & Security
CREATE TABLE IF NOT EXISTS enterprise_travel_requests (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  department TEXT NOT NULL,
  vip_level TEXT DEFAULT 'standard',
  destinations JSONB DEFAULT '[]',
  purpose TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  risk_assessment JSONB,
  emergency_contacts JSONB DEFAULT '[]',
  approved_by TEXT,
  approved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_travel_requests_org ON enterprise_travel_requests(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_travel_requests_employee ON enterprise_travel_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_travel_requests_status ON enterprise_travel_requests(status);

CREATE TABLE IF NOT EXISTS enterprise_security_plans (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  travel_request_id TEXT UNIQUE NOT NULL REFERENCES enterprise_travel_requests(id) ON DELETE CASCADE,
  level TEXT DEFAULT 'standard',
  measures JSONB DEFAULT '[]',
  ground_transport JSONB DEFAULT '[]',
  safe_locations JSONB DEFAULT '[]',
  communication_protocol JSONB DEFAULT '{}',
  check_in_schedule JSONB DEFAULT '[]',
  extraction_plan JSONB,
  security_personnel JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now()
);

-- CENDIAACADEMY™ - Learning & Development
CREATE TABLE IF NOT EXISTS enterprise_skill_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  employee_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  skills JSONB DEFAULT '[]',
  certifications JSONB DEFAULT '[]',
  assessments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(organization_id, employee_id)
);
CREATE INDEX IF NOT EXISTS idx_enterprise_skill_profiles_org ON enterprise_skill_profiles(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_skill_profiles_dept ON enterprise_skill_profiles(department);

CREATE TABLE IF NOT EXISTS enterprise_learning_paths (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  profile_id TEXT NOT NULL REFERENCES enterprise_skill_profiles(id) ON DELETE CASCADE,
  target_skill TEXT NOT NULL,
  current_level INTEGER NOT NULL,
  target_level INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  estimated_hours INTEGER NOT NULL,
  modules JSONB DEFAULT '[]',
  progress DECIMAL(5, 2) DEFAULT 0,
  status TEXT DEFAULT 'not_started',
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_learning_paths_profile ON enterprise_learning_paths(profile_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_learning_paths_status ON enterprise_learning_paths(status);

-- CENDIARESONANCE™ - Corporate Communications
CREATE TABLE IF NOT EXISTS enterprise_campaigns (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  objectives JSONB DEFAULT '[]',
  target_audiences JSONB DEFAULT '[]',
  channels JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  metrics JSONB DEFAULT '{}',
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_campaigns_org ON enterprise_campaigns(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_campaigns_status ON enterprise_campaigns(status);

CREATE TABLE IF NOT EXISTS enterprise_campaign_messages (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  campaign_id TEXT NOT NULL REFERENCES enterprise_campaigns(id) ON DELETE CASCADE,
  version INTEGER DEFAULT 1,
  content TEXT NOT NULL,
  tone TEXT NOT NULL,
  audience TEXT NOT NULL,
  channel TEXT NOT NULL,
  status TEXT DEFAULT 'draft',
  sentiment_score INTEGER,
  approved_by TEXT,
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_campaign_messages_campaign ON enterprise_campaign_messages(campaign_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_campaign_messages_status ON enterprise_campaign_messages(status);

CREATE TABLE IF NOT EXISTS enterprise_crisis_responses (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  crisis_type TEXT NOT NULL,
  severity TEXT NOT NULL,
  status TEXT DEFAULT 'identified',
  stakeholders JSONB DEFAULT '[]',
  timeline JSONB DEFAULT '[]',
  holding_statements JSONB DEFAULT '[]',
  media_inquiries JSONB DEFAULT '[]',
  social_monitoring JSONB DEFAULT '{}',
  internal_comms JSONB DEFAULT '{}',
  recommendations JSONB DEFAULT '[]',
  lessons_learned JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  resolved_at TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_enterprise_crisis_responses_org ON enterprise_crisis_responses(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_crisis_responses_severity ON enterprise_crisis_responses(severity);
CREATE INDEX IF NOT EXISTS idx_enterprise_crisis_responses_status ON enterprise_crisis_responses(status);

-- CENDIAINVENTUM™ - R&D & IP
CREATE TABLE IF NOT EXISTS enterprise_ideas (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  inventor_id TEXT NOT NULL,
  inventor_name TEXT NOT NULL,
  department TEXT,
  novelty_score INTEGER,
  feasibility_score INTEGER,
  business_value INTEGER,
  patent_potential BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'captured',
  linked_patents JSONB DEFAULT '[]',
  linked_projects JSONB DEFAULT '[]',
  captured_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_ideas_org ON enterprise_ideas(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_ideas_status ON enterprise_ideas(status);
CREATE INDEX IF NOT EXISTS idx_enterprise_ideas_inventor ON enterprise_ideas(inventor_id);

CREATE TABLE IF NOT EXISTS enterprise_patents (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  abstract TEXT NOT NULL,
  claims JSONB DEFAULT '[]',
  inventors JSONB DEFAULT '[]',
  filing_date TIMESTAMP,
  application_number TEXT,
  patent_number TEXT,
  status TEXT DEFAULT 'draft',
  jurisdiction TEXT DEFAULT 'US',
  priority_date TIMESTAMP,
  expiration_date TIMESTAMP,
  prior_art JSONB DEFAULT '[]',
  maintenance_fees JSONB DEFAULT '[]',
  estimated_value DECIMAL(15, 2),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_patents_org ON enterprise_patents(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_patents_status ON enterprise_patents(status);

CREATE TABLE IF NOT EXISTS enterprise_research_projects (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  lead_id TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  team JSONB DEFAULT '[]',
  status TEXT DEFAULT 'proposed',
  budget DECIMAL(15, 2) NOT NULL,
  spent DECIMAL(15, 2) DEFAULT 0,
  start_date TIMESTAMP,
  target_end_date TIMESTAMP,
  milestones JSONB DEFAULT '[]',
  publications JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_research_projects_org ON enterprise_research_projects(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_research_projects_status ON enterprise_research_projects(status);

-- CENDIAMESH™ - M&A Culture Integration
CREATE TABLE IF NOT EXISTS enterprise_culture_profiles (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  company_name TEXT NOT NULL,
  dimensions JSONB DEFAULT '{}',
  values JSONB DEFAULT '[]',
  work_style JSONB DEFAULT '{}',
  decision_making JSONB DEFAULT '{}',
  communication JSONB DEFAULT '{}',
  assessed_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_culture_profiles_org ON enterprise_culture_profiles(organization_id);

CREATE TABLE IF NOT EXISTS enterprise_integration_roadmaps (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  acquirer_id TEXT NOT NULL,
  target_id TEXT NOT NULL,
  status TEXT DEFAULT 'planning',
  compatibility_score INTEGER,
  phases JSONB DEFAULT '[]',
  risks JSONB DEFAULT '[]',
  synergies JSONB DEFAULT '[]',
  progress DECIMAL(5, 2) DEFAULT 0,
  start_date TIMESTAMP,
  target_end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_integration_roadmaps_org ON enterprise_integration_roadmaps(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_integration_roadmaps_status ON enterprise_integration_roadmaps(status);

-- CENDIAHABITAT™ - Facilities & Real Estate
CREATE TABLE IF NOT EXISTS enterprise_habitat_zones (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  floor INTEGER NOT NULL,
  building TEXT NOT NULL,
  type TEXT NOT NULL,
  square_footage INTEGER NOT NULL,
  max_occupancy INTEGER NOT NULL,
  current_occupancy INTEGER DEFAULT 0,
  sensors JSONB DEFAULT '{}',
  amenities JSONB DEFAULT '[]',
  reservable BOOLEAN DEFAULT false,
  cost_per_sqft DECIMAL(10, 2) NOT NULL,
  last_updated TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_habitat_zones_org ON enterprise_habitat_zones(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_habitat_zones_type ON enterprise_habitat_zones(type);
CREATE INDEX IF NOT EXISTS idx_enterprise_habitat_zones_building ON enterprise_habitat_zones(building);

-- CENDIAREGENT™ - CEO's Office
CREATE TABLE IF NOT EXISTS enterprise_regent_sessions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  organization_id TEXT NOT NULL REFERENCES organizations(id),
  question TEXT NOT NULL,
  context TEXT,
  advisor_responses JSONB DEFAULT '[]',
  synthesis TEXT,
  mirror_truth TEXT,
  created_at TIMESTAMP DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_enterprise_regent_sessions_org ON enterprise_regent_sessions(organization_id);
CREATE INDEX IF NOT EXISTS idx_enterprise_regent_sessions_created ON enterprise_regent_sessions(created_at);
