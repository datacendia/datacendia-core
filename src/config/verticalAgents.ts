// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * VERTICAL AI AGENTS CONFIGURATION
 * Specialized AI agents for each of 24 industry verticals
 * Each vertical has 3-5 specialized agents with distinct roles
 */

export interface VerticalAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  specializations: string[];
  icon: string;
}

export interface VerticalAgentConfig {
  verticalId: string;
  verticalName: string;
  agents: VerticalAgent[];
}

// =============================================================================
// FINANCIAL SERVICES AGENTS
// =============================================================================
export const financialAgents: VerticalAgentConfig = {
  verticalId: 'financial',
  verticalName: 'Financial Services',
  agents: [
    {
      id: 'risk-sentinel',
      name: 'RiskSentinel',
      role: 'Chief Risk Officer AI',
      description: 'Real-time portfolio risk monitoring and hedging recommendations',
      capabilities: ['VaR calculation', 'Stress testing', 'Hedging strategies', 'Counterparty risk'],
      specializations: ['Market risk', 'Credit risk', 'Operational risk'],
      icon: '🛡️',
    },
    {
      id: 'alpha-hunter',
      name: 'AlphaHunter',
      role: 'Investment Strategy AI',
      description: 'Identifies alpha-generating opportunities across asset classes',
      capabilities: ['Pattern recognition', 'Sentiment analysis', 'Factor investing', 'Alternative data'],
      specializations: ['Equities', 'Fixed income', 'Derivatives'],
      icon: '🎯',
    },
    {
      id: 'compliance-guardian',
      name: 'ComplianceGuardian',
      role: 'Regulatory Compliance AI',
      description: 'Ensures adherence to SEC, FINRA, and global financial regulations',
      capabilities: ['Trade surveillance', 'KYC/AML', 'Regulatory reporting', 'Audit trails'],
      specializations: ['Dodd-Frank', 'MiFID II', 'Basel III'],
      icon: '⚖️',
    },
    {
      id: 'market-pulse',
      name: 'MarketPulse',
      role: 'Market Intelligence AI',
      description: 'Real-time market analysis and event-driven trading signals',
      capabilities: ['News parsing', 'Earnings analysis', 'Macro indicators', 'Volatility forecasting'],
      specializations: ['Event trading', 'Momentum', 'Mean reversion'],
      icon: '📊',
    },
  ],
};

// =============================================================================
// HEALTHCARE AGENTS
// =============================================================================
export const healthcareAgents: VerticalAgentConfig = {
  verticalId: 'healthcare',
  verticalName: 'Healthcare',
  agents: [
    {
      id: 'care-coordinator',
      name: 'CareCoordinator',
      role: 'Patient Journey Optimizer',
      description: 'Orchestrates patient care across departments and providers',
      capabilities: ['Care pathways', 'Discharge planning', 'Referral management', 'Follow-up scheduling'],
      specializations: ['Chronic disease', 'Post-acute care', 'Care transitions'],
      icon: '🩺',
    },
    {
      id: 'clinical-advisor',
      name: 'ClinicalAdvisor',
      role: 'Clinical Decision Support AI',
      description: 'Evidence-based treatment recommendations and drug interactions',
      capabilities: ['Diagnosis support', 'Treatment protocols', 'Drug interactions', 'Clinical trials'],
      specializations: ['Oncology', 'Cardiology', 'Infectious disease'],
      icon: '💊',
    },
    {
      id: 'capacity-oracle',
      name: 'CapacityOracle',
      role: 'Hospital Operations AI',
      description: 'Optimizes bed management, staffing, and resource allocation',
      capabilities: ['Bed forecasting', 'Staff scheduling', 'OR utilization', 'Equipment tracking'],
      specializations: ['ICU capacity', 'ED flow', 'Surgical services'],
      icon: '🏥',
    },
    {
      id: 'quality-sentinel',
      name: 'QualitySentinel',
      role: 'Quality & Safety AI',
      description: 'Monitors quality metrics and patient safety indicators',
      capabilities: ['HCAHPS analysis', 'Infection prevention', 'Fall risk', 'Medication errors'],
      specializations: ['CMS quality measures', 'Leapfrog', 'Joint Commission'],
      icon: '⭐',
    },
  ],
};

// =============================================================================
// MANUFACTURING AGENTS
// =============================================================================
export const manufacturingAgents: VerticalAgentConfig = {
  verticalId: 'manufacturing',
  verticalName: 'Manufacturing',
  agents: [
    {
      id: 'production-master',
      name: 'ProductionMaster',
      role: 'Production Optimization AI',
      description: 'Maximizes OEE through real-time process adjustments',
      capabilities: ['Cycle time optimization', 'Changeover reduction', 'Bottleneck detection', 'Yield improvement'],
      specializations: ['Discrete manufacturing', 'Process manufacturing', 'Assembly'],
      icon: '🏭',
    },
    {
      id: 'predict-maintain',
      name: 'PredictMaintain',
      role: 'Predictive Maintenance AI',
      description: 'Anticipates equipment failures before they occur',
      capabilities: ['Vibration analysis', 'Thermal imaging', 'Oil analysis', 'Acoustic monitoring'],
      specializations: ['Rotating equipment', 'Hydraulics', 'Electrical systems'],
      icon: '🔧',
    },
    {
      id: 'quality-vision',
      name: 'QualityVision',
      role: 'Quality Inspection AI',
      description: 'Computer vision-powered defect detection and root cause analysis',
      capabilities: ['Visual inspection', 'Dimensional analysis', 'SPC/SQC', 'Root cause analysis'],
      specializations: ['Surface defects', 'Assembly verification', 'Metrology'],
      icon: '🔍',
    },
    {
      id: 'supply-sync',
      name: 'SupplySync',
      role: 'Supply Chain AI',
      description: 'Optimizes inventory and supplier relationships',
      capabilities: ['Demand forecasting', 'Inventory optimization', 'Supplier scoring', 'Lead time prediction'],
      specializations: ['JIT', 'VMI', 'Global sourcing'],
      icon: '📦',
    },
  ],
};

// =============================================================================
// TECHNOLOGY AGENTS
// =============================================================================
export const technologyAgents: VerticalAgentConfig = {
  verticalId: 'technology',
  verticalName: 'Technology',
  agents: [
    {
      id: 'site-reliability',
      name: 'SiteReliability',
      role: 'SRE Intelligence AI',
      description: 'Ensures platform reliability through proactive monitoring',
      capabilities: ['Anomaly detection', 'Auto-scaling', 'Incident correlation', 'Chaos engineering'],
      specializations: ['Kubernetes', 'Microservices', 'Serverless'],
      icon: '🚀',
    },
    {
      id: 'security-fortress',
      name: 'SecurityFortress',
      role: 'Cybersecurity AI',
      description: 'Detects and responds to security threats in real-time',
      capabilities: ['Threat detection', 'Vulnerability scanning', 'SIEM correlation', 'Incident response'],
      specializations: ['Zero trust', 'Cloud security', 'AppSec'],
      icon: '🔒',
    },
    {
      id: 'dev-velocity',
      name: 'DevVelocity',
      role: 'Engineering Productivity AI',
      description: 'Accelerates software delivery and developer experience',
      capabilities: ['Code review', 'CI/CD optimization', 'Technical debt', 'Sprint planning'],
      specializations: ['Agile', 'DevOps', 'Platform engineering'],
      icon: '⚡',
    },
    {
      id: 'data-architect',
      name: 'DataArchitect',
      role: 'Data Platform AI',
      description: 'Designs and optimizes data infrastructure',
      capabilities: ['Schema design', 'Query optimization', 'Data lineage', 'Cost optimization'],
      specializations: ['Data lakes', 'Real-time streaming', 'ML pipelines'],
      icon: '🗄️',
    },
  ],
};

// =============================================================================
// ENERGY AGENTS
// =============================================================================
export const energyAgents: VerticalAgentConfig = {
  verticalId: 'energy',
  verticalName: 'Energy & Utilities',
  agents: [
    {
      id: 'grid-balancer',
      name: 'GridBalancer',
      role: 'Grid Optimization AI',
      description: 'Balances supply and demand across the power grid',
      capabilities: ['Load forecasting', 'Frequency regulation', 'Congestion management', 'Reserve optimization'],
      specializations: ['Transmission', 'Distribution', 'Microgrids'],
      icon: '⚡',
    },
    {
      id: 'renewable-optimizer',
      name: 'RenewableOptimizer',
      role: 'Clean Energy AI',
      description: 'Maximizes renewable energy integration and output',
      capabilities: ['Weather forecasting', 'Curtailment reduction', 'Storage dispatch', 'Carbon tracking'],
      specializations: ['Solar', 'Wind', 'Battery storage'],
      icon: '🌱',
    },
    {
      id: 'asset-guardian',
      name: 'AssetGuardian',
      role: 'Infrastructure AI',
      description: 'Monitors and maintains grid infrastructure health',
      capabilities: ['Transformer monitoring', 'Line inspection', 'Vegetation management', 'Outage prediction'],
      specializations: ['T&D assets', 'Substations', 'Smart meters'],
      icon: '🔌',
    },
    {
      id: 'demand-response',
      name: 'DemandResponse',
      role: 'Load Management AI',
      description: 'Manages demand-side resources and customer programs',
      capabilities: ['DR dispatch', 'EV charging', 'Thermostat control', 'Industrial curtailment'],
      specializations: ['Residential DR', 'C&I programs', 'Grid services'],
      icon: '📉',
    },
  ],
};

// =============================================================================
// GOVERNMENT AGENTS
// =============================================================================
export const governmentAgents: VerticalAgentConfig = {
  verticalId: 'government',
  verticalName: 'Government',
  agents: [
    {
      id: 'policy-advisor',
      name: 'PolicyAdvisor',
      role: 'Policy Analysis AI',
      description: 'Analyzes policy impacts and recommends evidence-based decisions',
      capabilities: ['Impact modeling', 'Stakeholder analysis', 'Cost-benefit analysis', 'Regulatory review'],
      specializations: ['Economic policy', 'Social policy', 'Environmental policy'],
      icon: '📜',
    },
    {
      id: 'citizen-engagement',
      name: 'CitizenEngage',
      role: 'Public Services AI',
      description: 'Optimizes citizen services and engagement',
      capabilities: ['Service routing', 'Sentiment analysis', 'Complaint resolution', 'Accessibility'],
      specializations: ['311 services', 'Permits', 'Benefits administration'],
      icon: '👥',
    },
    {
      id: 'budget-optimizer',
      name: 'BudgetOptimizer',
      role: 'Fiscal Management AI',
      description: 'Optimizes budget allocation and tracks spending efficiency',
      capabilities: ['Budget forecasting', 'Spend analysis', 'Grant management', 'Procurement optimization'],
      specializations: ['Capital planning', 'Operating budgets', 'Federal grants'],
      icon: '💰',
    },
    {
      id: 'transparency-engine',
      name: 'TransparencyEngine',
      role: 'Open Government AI',
      description: 'Ensures transparency and compliance with disclosure requirements',
      capabilities: ['FOIA processing', 'Meeting transcription', 'Document redaction', 'Open data publishing'],
      specializations: ['Records management', 'Ethics compliance', 'Public reporting'],
      icon: '👁️',
    },
    {
      id: 'infrastructure-planner',
      name: 'InfraPlanner',
      role: 'Urban Planning AI',
      description: 'Plans and optimizes public infrastructure investments',
      capabilities: ['Traffic modeling', 'Utility planning', 'Zoning analysis', 'Climate resilience'],
      specializations: ['Transportation', 'Water/sewer', 'Parks & recreation'],
      icon: '🏗️',
    },
  ],
};

// =============================================================================
// LOGISTICS AGENTS
// =============================================================================
export const logisticsAgents: VerticalAgentConfig = {
  verticalId: 'logistics',
  verticalName: 'Logistics & Supply Chain',
  agents: [
    {
      id: 'route-optimizer',
      name: 'RouteOptimizer',
      role: 'Fleet Routing AI',
      description: 'Optimizes delivery routes in real-time',
      capabilities: ['Dynamic routing', 'Traffic prediction', 'Time windows', 'Multi-stop optimization'],
      specializations: ['Last mile', 'LTL', 'Dedicated fleet'],
      icon: '🗺️',
    },
    {
      id: 'warehouse-brain',
      name: 'WarehouseBrain',
      role: 'Warehouse Operations AI',
      description: 'Optimizes warehouse layout, picking, and inventory',
      capabilities: ['Slotting optimization', 'Wave planning', 'Labor allocation', 'Inventory positioning'],
      specializations: ['E-commerce fulfillment', 'B2B distribution', 'Cold chain'],
      icon: '🏭',
    },
    {
      id: 'demand-predictor',
      name: 'DemandPredictor',
      role: 'Demand Planning AI',
      description: 'Forecasts demand and optimizes inventory levels',
      capabilities: ['Demand sensing', 'Safety stock', 'Seasonal planning', 'Promotion impact'],
      specializations: ['SKU forecasting', 'Network inventory', 'Replenishment'],
      icon: '📈',
    },
    {
      id: 'carrier-manager',
      name: 'CarrierManager',
      role: 'Transportation AI',
      description: 'Manages carrier relationships and freight optimization',
      capabilities: ['Rate benchmarking', 'Mode selection', 'Carrier scoring', 'Claims management'],
      specializations: ['Truckload', 'Intermodal', 'Parcel'],
      icon: '🚛',
    },
  ],
};

// =============================================================================
// RETAIL AGENTS
// =============================================================================
export const retailAgents: VerticalAgentConfig = {
  verticalId: 'retail',
  verticalName: 'Retail',
  agents: [
    {
      id: 'merchandising-ai',
      name: 'MerchandisingAI',
      role: 'Assortment Planning AI',
      description: 'Optimizes product assortment and placement',
      capabilities: ['Assortment optimization', 'Planogram design', 'Seasonal planning', 'Local assortment'],
      specializations: ['Apparel', 'Grocery', 'General merchandise'],
      icon: '🛍️',
    },
    {
      id: 'pricing-engine',
      name: 'PricingEngine',
      role: 'Dynamic Pricing AI',
      description: 'Real-time pricing optimization across channels',
      capabilities: ['Competitive pricing', 'Markdown optimization', 'Promotion effectiveness', 'Price elasticity'],
      specializations: ['Regular price', 'Promotional', 'Clearance'],
      icon: '💵',
    },
    {
      id: 'customer-insight',
      name: 'CustomerInsight',
      role: 'Customer Intelligence AI',
      description: 'Understands and predicts customer behavior',
      capabilities: ['Segmentation', 'CLV prediction', 'Churn prevention', 'Next best action'],
      specializations: ['Loyalty programs', 'Personalization', 'Journey mapping'],
      icon: '👤',
    },
    {
      id: 'omnichannel-sync',
      name: 'OmniSync',
      role: 'Omnichannel AI',
      description: 'Synchronizes inventory and experience across channels',
      capabilities: ['BOPIS optimization', 'Ship-from-store', 'Inventory visibility', 'Order routing'],
      specializations: ['E-commerce', 'Store operations', 'Marketplace'],
      icon: '🔄',
    },
  ],
};

// =============================================================================
// EDUCATION AGENTS
// =============================================================================
export const educationAgents: VerticalAgentConfig = {
  verticalId: 'education',
  verticalName: 'Education',
  agents: [
    {
      id: 'student-success',
      name: 'StudentSuccess',
      role: 'Student Retention AI',
      description: 'Identifies at-risk students and recommends interventions',
      capabilities: ['Early warning', 'Intervention matching', 'Progress tracking', 'Outcome prediction'],
      specializations: ['Retention', 'Completion', 'Transfer'],
      icon: '🎓',
    },
    {
      id: 'learning-advisor',
      name: 'LearningAdvisor',
      role: 'Adaptive Learning AI',
      description: 'Personalizes learning paths and content recommendations',
      capabilities: ['Learning analytics', 'Content recommendation', 'Competency mapping', 'Assessment design'],
      specializations: ['K-12', 'Higher ed', 'Professional development'],
      icon: '📚',
    },
    {
      id: 'enrollment-optimizer',
      name: 'EnrollmentOptimizer',
      role: 'Enrollment Management AI',
      description: 'Optimizes recruitment, admissions, and financial aid',
      capabilities: ['Lead scoring', 'Yield prediction', 'Net tuition optimization', 'Scholarship allocation'],
      specializations: ['Undergraduate', 'Graduate', 'Online programs'],
      icon: '📋',
    },
    {
      id: 'workforce-connector',
      name: 'WorkforceConnector',
      role: 'Career Services AI',
      description: 'Connects students with career opportunities',
      capabilities: ['Job matching', 'Skills gap analysis', 'Employer engagement', 'Outcome tracking'],
      specializations: ['Internships', 'Job placement', 'Alumni relations'],
      icon: '💼',
    },
  ],
};

// =============================================================================
// LEGAL AGENTS (Enterprise Platinum - 8 Default + 6 Optional)
// =============================================================================
export const legalAgents: VerticalAgentConfig = {
  verticalId: 'legal',
  verticalName: 'Legal / Law Firms',
  agents: [
    // DEFAULT AGENTS (8) - Always on for every matter
    {
      id: 'matter-lead',
      name: 'MatterLead',
      role: 'Matter Lead (Arbiter)',
      description: 'Final synthesis, scopes questions, produces recommendation + decision packet',
      capabilities: ['Decision synthesis', 'Matter scoping', 'Recommendation drafting', 'Packet assembly'],
      specializations: ['M&A', 'Litigation', 'Regulatory', 'Corporate'],
      icon: '👨‍⚖️',
    },
    {
      id: 'research-counsel',
      name: 'ResearchCounsel',
      role: 'Research Counsel',
      description: 'Retrieves and summarizes authorities/precedent from ingested case law library',
      capabilities: ['Case law research', 'Precedent analysis', 'Citation verification', 'Authority ranking'],
      specializations: ['Federal courts', 'State courts', 'Administrative law', 'International'],
      icon: '📚',
    },
    {
      id: 'contract-counsel',
      name: 'ContractCounsel',
      role: 'Contract / Transaction Counsel',
      description: 'Clause-level review, playbook enforcement, fallback language, commercial reasonableness',
      capabilities: ['Clause extraction', 'Risk identification', 'Playbook enforcement', 'Fallback drafting'],
      specializations: ['M&A', 'Commercial contracts', 'Licensing', 'Employment'],
      icon: '📝',
    },
    {
      id: 'litigation-strategist',
      name: 'LitigationStrategist',
      role: 'Litigation Strategist',
      description: 'Case theory, arguments, discovery posture, deposition outline logic',
      capabilities: ['Case theory development', 'Argument mapping', 'Discovery strategy', 'Deposition prep'],
      specializations: ['Civil litigation', 'Commercial disputes', 'Class actions', 'Arbitration'],
      icon: '⚔️',
    },
    {
      id: 'risk-counsel',
      name: 'RiskCounsel',
      role: 'Risk & Liability Counsel',
      description: 'Damages exposure, indemnity posture, limitation of liability, insurance implications',
      capabilities: ['Damages assessment', 'Indemnity analysis', 'Insurance review', 'Exposure mapping'],
      specializations: ['Professional liability', 'Product liability', 'D&O', 'E&O'],
      icon: '⚠️',
    },
    {
      id: 'opposing-counsel',
      name: 'OpposingCounsel',
      role: 'Opposing Counsel (Red Team)',
      description: 'Adversarial challenge: "How would the other side attack this?"',
      capabilities: ['Adversarial analysis', 'Weakness identification', 'Counter-argument generation', 'Stress testing'],
      specializations: ['Cross-examination', 'Motion practice', 'Settlement negotiation'],
      icon: '🎯',
    },
    {
      id: 'privilege-officer',
      name: 'PrivilegeOfficer',
      role: 'Privilege & Confidentiality Officer',
      description: 'Privilege screening, redaction guidance, confidentiality tiering, export restrictions',
      capabilities: ['Privilege review', 'Redaction guidance', 'Confidentiality classification', 'Export control'],
      specializations: ['Attorney-client privilege', 'Work product', 'Common interest', 'Waiver analysis'],
      icon: '🔒',
    },
    {
      id: 'evidence-officer',
      name: 'EvidenceOfficer',
      role: 'Evidence & Audit Officer',
      description: 'Ensures every claim links to source artifact; assembles Decision Packet / Ledger Export',
      capabilities: ['Citation enforcement', 'Evidence assembly', 'Audit trail generation', 'Packet export'],
      specializations: ['eDiscovery', 'Document management', 'Chain of custody', 'Defensibility'],
      icon: '📋',
    },
    // OPTIONAL SPECIALIST AGENTS (6) - Toggle per matter type
    {
      id: 'regulatory-counsel',
      name: 'RegulatoryCounsel',
      role: 'Regulatory/Compliance Counsel',
      description: 'Financial services, healthcare, privacy-heavy work, DPA/AI Act/HIPAA/GLBA',
      capabilities: ['Regulatory mapping', 'Compliance assessment', 'Filing preparation', 'Enforcement response'],
      specializations: ['SEC/FINRA', 'HIPAA', 'GDPR/CCPA', 'AI Act'],
      icon: '🏛️',
    },
    {
      id: 'employment-counsel',
      name: 'EmploymentCounsel',
      role: 'Employment Counsel',
      description: 'HR disputes, investigations, termination, workplace policies',
      capabilities: ['Policy review', 'Investigation support', 'Termination analysis', 'Discrimination assessment'],
      specializations: ['Wrongful termination', 'Discrimination', 'Wage & hour', 'NLRA'],
      icon: '👥',
    },
    {
      id: 'ip-counsel',
      name: 'IPCounsel',
      role: 'IP Counsel',
      description: 'Patents, licensing, open-source compliance, infringement risk',
      capabilities: ['Patent analysis', 'License review', 'Infringement assessment', 'Freedom to operate'],
      specializations: ['Patents', 'Trademarks', 'Copyright', 'Trade secrets'],
      icon: '💡',
    },
    {
      id: 'tax-counsel',
      name: 'TaxCounsel',
      role: 'Tax Counsel',
      description: 'Deal structuring, cross-border, entity formation, transfer pricing',
      capabilities: ['Tax structuring', 'Cross-border analysis', 'Entity optimization', 'Transfer pricing'],
      specializations: ['M&A tax', 'International tax', 'State & local', 'Tax controversy'],
      icon: '💰',
    },
    {
      id: 'antitrust-counsel',
      name: 'AntitrustCounsel',
      role: 'Competition/Antitrust Counsel',
      description: 'M&A clearance, exclusivity, market power language, HSR filings',
      capabilities: ['Merger analysis', 'Market definition', 'HSR filing', 'Conduct review'],
      specializations: ['Horizontal mergers', 'Vertical restraints', 'Price fixing', 'Monopolization'],
      icon: '🏆',
    },
    {
      id: 'commercial-advisor',
      name: 'CommercialAdvisor',
      role: 'Client/Business Advisor',
      description: 'Business trade-offs, commercial strategy, client relationship context',
      capabilities: ['Business analysis', 'Commercial strategy', 'Stakeholder mapping', 'Negotiation support'],
      specializations: ['Deal strategy', 'Client relations', 'Business development'],
      icon: '💼',
    },
  ],
};

// =============================================================================
// REAL ESTATE AGENTS
// =============================================================================
export const realEstateAgents: VerticalAgentConfig = {
  verticalId: 'real-estate',
  verticalName: 'Real Estate',
  agents: [
    {
      id: 'valuation-engine',
      name: 'ValuationEngine',
      role: 'Property Valuation AI',
      description: 'Automated property valuation and market analysis',
      capabilities: ['AVM modeling', 'Comp analysis', 'Cap rate forecasting', 'Market timing'],
      specializations: ['Residential', 'Commercial', 'Industrial'],
      icon: '🏠',
    },
    {
      id: 'lease-optimizer',
      name: 'LeaseOptimizer',
      role: 'Lease Management AI',
      description: 'Optimizes lease terms and tenant relationships',
      capabilities: ['Rent optimization', 'Lease abstraction', 'Renewal prediction', 'Tenant scoring'],
      specializations: ['Office', 'Retail', 'Multifamily'],
      icon: '📄',
    },
    {
      id: 'property-manager',
      name: 'PropertyManager',
      role: 'Property Operations AI',
      description: 'Manages property operations and maintenance',
      capabilities: ['Work order routing', 'Preventive maintenance', 'Vendor management', 'Tenant communication'],
      specializations: ['Facilities', 'Amenities', 'Common areas'],
      icon: '🔧',
    },
    {
      id: 'investment-analyst',
      name: 'InvestmentAnalyst',
      role: 'Real Estate Investment AI',
      description: 'Analyzes investment opportunities and portfolio performance',
      capabilities: ['DCF modeling', 'Risk assessment', 'Portfolio optimization', 'Exit strategy'],
      specializations: ['Acquisitions', 'Development', 'REIT analysis'],
      icon: '📊',
    },
  ],
};

// =============================================================================
// INSURANCE AGENTS
// =============================================================================
export const insuranceAgents: VerticalAgentConfig = {
  verticalId: 'insurance',
  verticalName: 'Insurance',
  agents: [
    {
      id: 'underwriting-ai',
      name: 'UnderwritingAI',
      role: 'Risk Assessment AI',
      description: 'Automates underwriting decisions and risk pricing',
      capabilities: ['Risk scoring', 'Premium calculation', 'Coverage recommendation', 'Decline prediction'],
      specializations: ['Property', 'Casualty', 'Life & health'],
      icon: '📋',
    },
    {
      id: 'claims-processor',
      name: 'ClaimsProcessor',
      role: 'Claims Management AI',
      description: 'Accelerates claims processing and fraud detection',
      capabilities: ['FNOL triage', 'Reserve estimation', 'Fraud detection', 'Settlement optimization'],
      specializations: ['Auto claims', 'Property claims', 'Workers comp'],
      icon: '📝',
    },
    {
      id: 'actuarial-engine',
      name: 'ActuarialEngine',
      role: 'Actuarial AI',
      description: 'Supports actuarial analysis and reserving',
      capabilities: ['Loss triangles', 'IBNR estimation', 'Rate filing', 'Catastrophe modeling'],
      specializations: ['Pricing', 'Reserving', 'Capital modeling'],
      icon: '📊',
    },
    {
      id: 'policy-advisor',
      name: 'PolicyAdvisor',
      role: 'Customer Service AI',
      description: 'Assists policyholders with coverage and service',
      capabilities: ['Coverage explanation', 'Policy changes', 'Billing inquiry', 'Renewal management'],
      specializations: ['Personal lines', 'Commercial lines', 'Group benefits'],
      icon: '🛡️',
    },
  ],
};

// =============================================================================
// SPORTS / ATHLETICS AGENTS
// =============================================================================
export const sportsAgents: VerticalAgentConfig = {
  verticalId: 'sports',
  verticalName: 'Sports / Athletics',
  agents: [
    {
      id: 'sports-gm',
      name: 'GeneralManager',
      role: 'General Manager AI',
      description: 'Leads roster decisions, salary cap management, and team building strategy',
      capabilities: ['Roster construction', 'Salary cap management', 'Trade analysis', 'Draft strategy'],
      specializations: ['Team building', 'Contract negotiations', 'Player evaluation'],
      icon: '👔',
    },
    {
      id: 'sports-analytics',
      name: 'SportsAnalytics',
      role: 'Performance Analytics AI',
      description: 'Transforms data into competitive advantage through advanced metrics',
      capabilities: ['Performance metrics', 'Predictive modeling', 'Video analysis', 'Opponent scouting'],
      specializations: ['Player tracking', 'Game strategy', 'Injury prediction'],
      icon: '📊',
    },
    {
      id: 'sports-coaching',
      name: 'CoachingStrategy',
      role: 'Coaching Strategy AI',
      description: 'Develops game strategy and tactical adjustments',
      capabilities: ['Game planning', 'Opponent analysis', 'In-game adjustments', 'Play design'],
      specializations: ['Offense', 'Defense', 'Special teams'],
      icon: '📋',
    },
    {
      id: 'sports-medical',
      name: 'SportsMedicine',
      role: 'Sports Medicine AI',
      description: 'Prioritizes athlete health with injury prevention and treatment',
      capabilities: ['Injury assessment', 'Return-to-play protocols', 'Rehabilitation planning', 'Load management'],
      specializations: ['Orthopedics', 'Concussion protocol', 'Recovery optimization'],
      icon: '🏥',
    },
    {
      id: 'sports-business',
      name: 'BusinessOperations',
      role: 'Sports Business AI',
      description: 'Maximizes franchise value through revenue optimization',
      capabilities: ['Revenue optimization', 'Sponsorship valuation', 'Ticket pricing', 'Fan engagement'],
      specializations: ['Sponsorships', 'Merchandising', 'Media rights'],
      icon: '💰',
    },
    {
      id: 'sports-scouting',
      name: 'ScoutingDirector',
      role: 'Scouting AI',
      description: 'Evaluates player talent and draft prospects',
      capabilities: ['Player evaluation', 'Draft analysis', 'International scouting', 'Combine analysis'],
      specializations: ['Amateur scouting', 'Pro scouting', 'International markets'],
      icon: '🔍',
    },
    {
      id: 'sports-fan-experience',
      name: 'FanExperience',
      role: 'Fan Experience AI',
      description: 'Creates memorable experiences and drives fan loyalty',
      capabilities: ['Game day optimization', 'Customer service', 'Loyalty programs', 'Digital engagement'],
      specializations: ['In-venue experience', 'Digital fan engagement', 'Hospitality'],
      icon: '🎉',
    },
    {
      id: 'sports-venue',
      name: 'VenueOperations',
      role: 'Venue Operations AI',
      description: 'Manages stadium operations and event execution',
      capabilities: ['Event management', 'Security coordination', 'Concessions optimization', 'Crowd management'],
      specializations: ['Stadium operations', 'Safety & security', 'Food & beverage'],
      icon: '🏟️',
    },
  ],
};

// =============================================================================
// MEDIA & ENTERTAINMENT AGENTS
// =============================================================================
export const mediaAgents: VerticalAgentConfig = {
  verticalId: 'media',
  verticalName: 'Media & Entertainment',
  agents: [
    {
      id: 'media-content',
      name: 'ContentStrategy',
      role: 'Content Strategy AI',
      description: 'Develops content strategy and programming decisions',
      capabilities: ['Content planning', 'Audience analysis', 'Programming optimization', 'Content acquisition'],
      specializations: ['Original content', 'Acquisitions', 'Scheduling'],
      icon: '🎬',
    },
    {
      id: 'media-streaming',
      name: 'StreamingStrategy',
      role: 'Streaming AI',
      description: 'Drives subscriber growth and retention for streaming platforms',
      capabilities: ['Subscriber analytics', 'Churn prediction', 'Content recommendation', 'Pricing optimization'],
      specializations: ['SVOD', 'AVOD', 'Hybrid models'],
      icon: '📱',
    },
    {
      id: 'media-analytics',
      name: 'AudienceAnalytics',
      role: 'Audience Analytics AI',
      description: 'Analyzes audience data and content performance',
      capabilities: ['Viewership analysis', 'Engagement metrics', 'Attribution modeling', 'Trend forecasting'],
      specializations: ['Linear TV', 'Digital', 'Cross-platform'],
      icon: '📊',
    },
    {
      id: 'media-rights',
      name: 'RightsManagement',
      role: 'Rights Management AI',
      description: 'Protects and monetizes intellectual property',
      capabilities: ['Rights tracking', 'License management', 'Royalty calculation', 'Piracy detection'],
      specializations: ['Distribution rights', 'Music licensing', 'Syndication'],
      icon: '⚖️',
    },
    {
      id: 'media-ad-ops',
      name: 'AdOperations',
      role: 'Advertising Operations AI',
      description: 'Maximizes advertising revenue across platforms',
      capabilities: ['Yield optimization', 'Inventory management', 'Programmatic', 'Campaign management'],
      specializations: ['Linear advertising', 'Digital advertising', 'Addressable TV'],
      icon: '📺',
    },
    {
      id: 'media-production',
      name: 'ProductionManager',
      role: 'Production AI',
      description: 'Delivers content on time and budget',
      capabilities: ['Production scheduling', 'Budget management', 'Resource allocation', 'Post-production'],
      specializations: ['Film', 'Television', 'Digital content'],
      icon: '🎥',
    },
    {
      id: 'media-talent',
      name: 'TalentManagement',
      role: 'Talent Management AI',
      description: 'Attracts and retains creative talent',
      capabilities: ['Talent acquisition', 'Contract negotiation', 'Career development', 'Relationship management'],
      specializations: ['On-screen talent', 'Behind-the-scenes', 'Influencers'],
      icon: '⭐',
    },
    {
      id: 'media-social',
      name: 'SocialMedia',
      role: 'Social Media AI',
      description: 'Engages audiences across social platforms',
      capabilities: ['Content creation', 'Community management', 'Influencer partnerships', 'Viral optimization'],
      specializations: ['Platform strategy', 'Engagement', 'Crisis management'],
      icon: '📲',
    },
  ],
};

// =============================================================================
// PROFESSIONAL SERVICES AGENTS
// =============================================================================
export const professionalServicesAgents: VerticalAgentConfig = {
  verticalId: 'professional-services',
  verticalName: 'Professional Services',
  agents: [
    {
      id: 'ps-engagement',
      name: 'EngagementManager',
      role: 'Engagement Management AI',
      description: 'Delivers value to clients through project excellence',
      capabilities: ['Project delivery', 'Quality assurance', 'Client communication', 'Scope management'],
      specializations: ['Consulting', 'Advisory', 'Implementation'],
      icon: '📋',
    },
    {
      id: 'ps-quality-risk',
      name: 'QualityRisk',
      role: 'Quality & Risk AI',
      description: 'Protects firm reputation through quality control',
      capabilities: ['Quality review', 'Risk assessment', 'Independence monitoring', 'Conflict checking'],
      specializations: ['Audit quality', 'Advisory risk', 'Professional standards'],
      icon: '⚖️',
    },
    {
      id: 'ps-practice',
      name: 'PracticeDevelopment',
      role: 'Practice Development AI',
      description: 'Grows practice expertise and market position',
      capabilities: ['Business development', 'Thought leadership', 'Market analysis', 'Proposal support'],
      specializations: ['Industry expertise', 'Service lines', 'Go-to-market'],
      icon: '📈',
    },
    {
      id: 'ps-talent',
      name: 'TalentManager',
      role: 'Talent Management AI',
      description: 'Attracts, develops, and retains professional talent',
      capabilities: ['Recruiting', 'Performance management', 'Career development', 'Utilization optimization'],
      specializations: ['Campus recruiting', 'Experienced hires', 'Partner development'],
      icon: '👥',
    },
    {
      id: 'ps-audit',
      name: 'AuditAssurance',
      role: 'Audit & Assurance AI',
      description: 'Provides independent assurance with professional skepticism',
      capabilities: ['Audit planning', 'Risk assessment', 'Testing procedures', 'Report drafting'],
      specializations: ['Financial audit', 'Internal audit', 'SOX compliance'],
      icon: '✅',
    },
    {
      id: 'ps-tax',
      name: 'TaxAdvisory',
      role: 'Tax Advisory AI',
      description: 'Provides tax-efficient strategies and compliance',
      capabilities: ['Tax planning', 'Compliance review', 'Controversy support', 'Transfer pricing'],
      specializations: ['Corporate tax', 'International tax', 'M&A tax'],
      icon: '📑',
    },
    {
      id: 'ps-transaction',
      name: 'TransactionAdvisory',
      role: 'Transaction Advisory AI',
      description: 'Ensures deal success through due diligence',
      capabilities: ['Due diligence', 'Valuation', 'Deal structuring', 'Integration planning'],
      specializations: ['M&A', 'Divestitures', 'Capital markets'],
      icon: '💼',
    },
    {
      id: 'ps-methodology',
      name: 'Methodology',
      role: 'Consulting Methodology AI',
      description: 'Provides structured problem-solving frameworks',
      capabilities: ['Framework application', 'Analysis structuring', 'Hypothesis development', 'Recommendation synthesis'],
      specializations: ['Strategy', 'Operations', 'Organization'],
      icon: '🧩',
    },
  ],
};

// =============================================================================
// TRANSPORTATION / LOGISTICS AGENTS (EXPANDED)
// =============================================================================
export const transportationAgents: VerticalAgentConfig = {
  verticalId: 'transportation',
  verticalName: 'Transportation / Logistics',
  agents: [
    {
      id: 'trans-fleet',
      name: 'FleetManager',
      role: 'Fleet Management AI',
      description: 'Maximizes fleet utilization and asset management',
      capabilities: ['Fleet optimization', 'Maintenance scheduling', 'Asset tracking', 'Fuel management'],
      specializations: ['Trucking', 'Delivery', 'Heavy equipment'],
      icon: '🚛',
    },
    {
      id: 'trans-routing',
      name: 'RouteOptimizer',
      role: 'Route Optimization AI',
      description: 'Optimizes routes for efficiency and cost',
      capabilities: ['Dynamic routing', 'Traffic prediction', 'Multi-stop optimization', 'Time window management'],
      specializations: ['Last mile', 'LTL', 'Dedicated routes'],
      icon: '🗺️',
    },
    {
      id: 'trans-supply-chain',
      name: 'SupplyChainStrategy',
      role: 'Supply Chain AI',
      description: 'Optimizes end-to-end supply chain operations',
      capabilities: ['Network optimization', 'Inventory positioning', 'Demand planning', 'Visibility'],
      specializations: ['Global supply chain', 'Distribution', 'Fulfillment'],
      icon: '🔗',
    },
    {
      id: 'trans-safety',
      name: 'TransSafety',
      role: 'Transportation Safety AI',
      description: 'Achieves zero accidents through safety programs',
      capabilities: ['Safety monitoring', 'Compliance tracking', 'Driver coaching', 'Incident analysis'],
      specializations: ['DOT compliance', 'HOS management', 'Safety culture'],
      icon: '🛡️',
    },
    {
      id: 'trans-freight',
      name: 'FreightManager',
      role: 'Freight Management AI',
      description: 'Moves freight profitably with optimal carrier selection',
      capabilities: ['Rate management', 'Carrier selection', 'Load optimization', 'Claims management'],
      specializations: ['Truckload', 'LTL', 'Intermodal'],
      icon: '📦',
    },
    {
      id: 'trans-international',
      name: 'InternationalLogistics',
      role: 'International Logistics AI',
      description: 'Enables global trade and customs management',
      capabilities: ['Customs clearance', 'Trade compliance', 'Documentation', 'Duty optimization'],
      specializations: ['Import/Export', 'Free trade zones', 'Tariff classification'],
      icon: '🌍',
    },
    {
      id: 'trans-last-mile',
      name: 'LastMile',
      role: 'Last Mile Delivery AI',
      description: 'Delights customers with delivery excellence',
      capabilities: ['Delivery optimization', 'Customer communication', 'Returns management', 'Proof of delivery'],
      specializations: ['E-commerce', 'Food delivery', 'White glove'],
      icon: '🏠',
    },
    {
      id: 'trans-analytics',
      name: 'TransAnalytics',
      role: 'Transportation Analytics AI',
      description: 'Transforms transportation data into insights',
      capabilities: ['Performance analytics', 'Cost analysis', 'Benchmarking', 'Predictive modeling'],
      specializations: ['KPI tracking', 'Network analysis', 'Carrier scorecards'],
      icon: '📊',
    },
  ],
};

// =============================================================================
// PHARMACEUTICAL AGENTS
// =============================================================================
export const pharmaceuticalAgents: VerticalAgentConfig = {
  verticalId: 'pharmaceutical',
  verticalName: 'Pharmaceutical',
  agents: [
    {
      id: 'pharma-discovery',
      name: 'DrugDiscovery',
      role: 'Drug Discovery AI',
      description: 'Accelerates drug discovery through AI-driven research',
      capabilities: ['Target identification', 'Compound screening', 'Lead optimization', 'Biomarker discovery'],
      specializations: ['Small molecules', 'Biologics', 'Gene therapy'],
      icon: '🔬',
    },
    {
      id: 'pharma-clinical',
      name: 'ClinicalDevelopment',
      role: 'Clinical Development AI',
      description: 'Optimizes clinical trial design and execution',
      capabilities: ['Trial design', 'Site selection', 'Patient recruitment', 'Data analysis'],
      specializations: ['Phase I-IV', 'Adaptive trials', 'Real-world evidence'],
      icon: '🧪',
    },
    {
      id: 'pharma-regulatory',
      name: 'RegulatoryAffairs',
      role: 'Regulatory Affairs AI',
      description: 'Navigates global regulatory requirements',
      capabilities: ['Submission preparation', 'Regulatory strategy', 'Compliance monitoring', 'Label management'],
      specializations: ['FDA', 'EMA', 'Global submissions'],
      icon: '📋',
    },
    {
      id: 'pharma-commercial',
      name: 'CommercialPharma',
      role: 'Commercial Strategy AI',
      description: 'Drives commercial success for pharmaceutical products',
      capabilities: ['Launch planning', 'Market access', 'Pricing strategy', 'Sales force optimization'],
      specializations: ['Primary care', 'Specialty', 'Rare disease'],
      icon: '💊',
    },
    {
      id: 'pharma-medical',
      name: 'MedicalAffairs',
      role: 'Medical Affairs AI',
      description: 'Bridges science and commercial through medical expertise',
      capabilities: ['KOL engagement', 'Medical education', 'Publication planning', 'Advisory boards'],
      specializations: ['MSL support', 'Medical communications', 'Evidence generation'],
      icon: '👨‍⚕️',
    },
    {
      id: 'pharma-safety',
      name: 'Pharmacovigilance',
      role: 'Pharmacovigilance AI',
      description: 'Ensures drug safety through adverse event monitoring',
      capabilities: ['Signal detection', 'Case processing', 'Risk management', 'Safety reporting'],
      specializations: ['Post-market surveillance', 'REMS', 'Benefit-risk assessment'],
      icon: '🛡️',
    },
    {
      id: 'pharma-supply',
      name: 'PharmaSupplyChain',
      role: 'Pharma Supply Chain AI',
      description: 'Ensures reliable supply of pharmaceutical products',
      capabilities: ['Demand forecasting', 'Inventory optimization', 'Cold chain management', 'Serialization'],
      specializations: ['API sourcing', 'Manufacturing', 'Distribution'],
      icon: '📦',
    },
    {
      id: 'pharma-market-access',
      name: 'MarketAccess',
      role: 'Market Access AI',
      description: 'Secures reimbursement and formulary access',
      capabilities: ['Payer strategy', 'HEOR analysis', 'Contracting', 'Patient access programs'],
      specializations: ['Commercial payers', 'Government programs', 'International markets'],
      icon: '🏥',
    },
  ],
};

// =============================================================================
// INDUSTRIAL SERVICES AGENTS
// =============================================================================
export const industrialServicesAgents: VerticalAgentConfig = {
  verticalId: 'industrial-services',
  verticalName: 'Industrial Services',
  agents: [
    {
      id: 'safety-sentinel',
      name: 'SafetySentinel',
      role: 'Chief Safety Officer AI',
      description: 'Enforces OSHA, ISO 45001, and SUNAFIL safety compliance across all operations',
      capabilities: ['Hazard identification (IPERC)', 'Risk assessment matrices', 'Permit-to-work evaluation', 'Incident investigation'],
      specializations: ['OSHA 29 CFR 1926', 'ISO 45001:2018', 'SUNAFIL DS 005-2012-TR', 'Confined space', 'Working at height'],
      icon: '🦺',
    },
    {
      id: 'project-evaluator',
      name: 'ProjectEvaluator',
      role: 'Project Director AI',
      description: 'Evaluates project bids, resource capacity, schedule feasibility, and historical performance',
      capabilities: ['Bid/no-bid analysis', 'Resource capacity planning', 'Schedule risk assessment', 'Historical benchmarking'],
      specializations: ['Industrial maintenance', 'Piping & fabrication', 'Boiler repair', 'Turnaround projects'],
      icon: '📋',
    },
    {
      id: 'finance-controller',
      name: 'FinanceController',
      role: 'Finance Controller AI',
      description: 'Analyzes costs, margins, ROI, cash flow impacts, and financial viability',
      capabilities: ['Cost estimation', 'Margin analysis', 'TCO calculation', 'ROI projection'],
      specializations: ['Project costing', 'Equipment valuation', 'Contract financial terms', 'Currency risk (PEN/USD)'],
      icon: '💰',
    },
    {
      id: 'procurement-analyst',
      name: 'ProcurementAnalyst',
      role: 'Procurement & Vendor AI',
      description: 'Evaluates subcontractors, vendors, and supply chain risks using multi-criteria scoring',
      capabilities: ['Vendor scoring', 'Subcontractor qualification', 'Insurance verification', 'Price benchmarking'],
      specializations: ['Subcontractor management', 'Equipment procurement', 'Materials sourcing', 'Heavy equipment'],
      icon: '🔗',
    },
    {
      id: 'legal-advisor',
      name: 'LegalAdvisor',
      role: 'Legal & Contract AI',
      description: 'Reviews contract terms, assesses legal risks, and ensures regulatory compliance',
      capabilities: ['Contract clause analysis', 'Liability assessment', 'Force majeure evaluation', 'Multi-jurisdiction analysis'],
      specializations: ['Construction contracts', 'Service agreements', 'Peruvian labor law', 'FIDIC contracts'],
      icon: '⚖️',
    },
    {
      id: 'quality-inspector',
      name: 'QualityInspector',
      role: 'Quality & Standards AI',
      description: 'Ensures ISO 9001, ASME, and AWS compliance for welding and fabrication',
      capabilities: ['ISO 9001 verification', 'Welding procedure review', 'NDE requirements', 'Quality plan development'],
      specializations: ['ASME BPVC', 'AWS D1.1', 'ASME IX', 'NDE methods (RT/UT/MT/PT)'],
      icon: '🔍',
    },
    {
      id: 'environmental-officer',
      name: 'EnvironmentalOfficer',
      role: 'Environmental Compliance AI',
      description: 'Assesses environmental impacts and ensures ISO 14001 compliance',
      capabilities: ['Environmental impact assessment', 'ISO 14001 compliance', 'Waste management', 'Emissions monitoring'],
      specializations: ['Mining site environmental rules', 'Peru environmental law (MINAM)', 'Hazardous waste'],
      icon: '🌿',
    },
  ],
};

// =============================================================================
// EXPORT ALL AGENTS
// =============================================================================

export const VERTICAL_AGENTS: Record<string, VerticalAgentConfig> = {
  financial: financialAgents,
  healthcare: healthcareAgents,
  manufacturing: manufacturingAgents,
  technology: technologyAgents,
  energy: energyAgents,
  government: governmentAgents,
  logistics: logisticsAgents,
  retail: retailAgents,
  education: educationAgents,
  legal: legalAgents,
  'real-estate': realEstateAgents,
  insurance: insuranceAgents,
  sports: sportsAgents,
  media: mediaAgents,
  'professional-services': professionalServicesAgents,
  transportation: transportationAgents,
  pharmaceutical: pharmaceuticalAgents,
  'industrial-services': industrialServicesAgents,
};

// Helper function to get agents for a vertical
export const getAgentsForVertical = (verticalId: string): VerticalAgent[] => {
  return VERTICAL_AGENTS[verticalId]?.agents || [];
};

// Get all unique agent capabilities across all verticals
export const getAllCapabilities = (): string[] => {
  const capabilities = new Set<string>();
  Object.values(VERTICAL_AGENTS).forEach(config => {
    config.agents.forEach(agent => {
      agent.capabilities.forEach(cap => capabilities.add(cap));
    });
  });
  return Array.from(capabilities).sort();
};
