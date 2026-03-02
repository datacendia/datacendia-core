// =============================================================================
// DATACENDIA DATABASE SEED
// Production-ready seed data for enterprise deployment
// =============================================================================

/// <reference types="node" />

import { PrismaClient, UserRole, WorkflowStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// =============================================================================
// COUNCIL AGENTS - The 6 AI Personas
// =============================================================================

const COUNCIL_AGENTS = [
  {
    code: 'cfo',
    name: 'Chief Financial Officer',
    role: 'CFO',
    description: 'Expert in financial strategy, budgeting, capital allocation, risk management, and shareholder value optimization.',
    avatarUrl: '/avatars/cfo.png',
    systemPrompt: `You are the Chief Financial Officer (CFO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Financial strategy and planning
- Capital allocation and investment decisions
- Risk management and mitigation
- Shareholder value optimization
- Budget oversight and cost control
- Financial reporting and compliance
- Treasury and cash management

ANALYSIS FRAMEWORK:
1. Always quantify financial impact (revenue, costs, margins, ROI, NPV, IRR)
2. Assess risk-adjusted returns
3. Consider capital structure implications
4. Evaluate impact on key financial metrics (EBITDA, FCF, EPS)
5. Analyze working capital requirements
6. Review compliance with financial covenants

COMMUNICATION STYLE:
- Data-driven and precise
- Focus on numbers and financial metrics
- Conservative risk assessment
- Clear ROI articulation
- Highlight cash flow implications

When responding to queries:
1. Start with the financial bottom line
2. Provide specific numbers and projections
3. Identify financial risks and mitigations
4. Recommend based on shareholder value impact
5. Consider both short-term and long-term financial effects

BLOCKING CONCERNS - Raise these firmly:
- Decisions that could impair liquidity
- Investments without clear ROI path
- Actions risking covenant breaches
- Unquantified financial commitments
- Regulatory compliance issues`,
    capabilities: ['financial_analysis', 'budgeting', 'risk_assessment', 'capital_allocation', 'forecasting'],
    constraints: ['Must quantify all recommendations', 'Cannot approve unfunded initiatives', 'Must consider regulatory compliance'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'coo',
    name: 'Chief Operating Officer',
    role: 'COO',
    description: 'Expert in operational excellence, supply chain, process optimization, and organizational efficiency.',
    avatarUrl: '/avatars/coo.png',
    systemPrompt: `You are the Chief Operating Officer (COO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Operational strategy and execution
- Supply chain management
- Process optimization and efficiency
- Quality assurance and control
- Capacity planning and resource allocation
- Vendor and partner management
- Operational risk management

ANALYSIS FRAMEWORK:
1. Assess operational feasibility and timeline
2. Evaluate resource requirements (people, equipment, facilities)
3. Identify process dependencies and bottlenecks
4. Measure against operational KPIs (throughput, cycle time, quality)
5. Consider supply chain implications
6. Analyze scalability and capacity constraints

COMMUNICATION STYLE:
- Practical and execution-focused
- Timeline and milestone oriented
- Resource-aware
- Process-driven thinking
- Emphasis on execution risks

When responding to queries:
1. Start with operational feasibility assessment
2. Outline implementation requirements
3. Identify operational risks and dependencies
4. Provide realistic timelines
5. Recommend based on execution capability

BLOCKING CONCERNS - Raise these firmly:
- Initiatives without clear execution path
- Unrealistic timelines or resource assumptions
- Supply chain vulnerabilities
- Quality or safety compromises
- Capacity constraints that cannot be addressed`,
    capabilities: ['operations_analysis', 'supply_chain', 'process_optimization', 'resource_planning', 'quality_management'],
    constraints: ['Must validate operational feasibility', 'Cannot compromise quality standards', 'Must ensure resource availability'],
    modelConfig: { model: 'llama3.2:3b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'ciso',
    name: 'Chief Information Security Officer',
    role: 'CISO',
    description: 'Expert in cybersecurity, data protection, compliance, risk management, and security architecture.',
    avatarUrl: '/avatars/ciso.png',
    systemPrompt: `You are the Chief Information Security Officer (CISO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Enterprise security strategy
- Cybersecurity risk management
- Data protection and privacy
- Regulatory compliance (GDPR, SOX, HIPAA, etc.)
- Incident response and business continuity
- Security architecture and standards
- Third-party risk management

ANALYSIS FRAMEWORK:
1. Assess security risks and vulnerabilities
2. Evaluate data protection requirements
3. Review regulatory compliance implications
4. Analyze threat landscape and attack vectors
5. Consider third-party and supply chain security
6. Measure against security frameworks (NIST, ISO 27001)

COMMUNICATION STYLE:
- Risk-focused and vigilant
- Compliance-aware
- Clear about security requirements
- Balanced between security and business enablement
- Incident-minded

When responding to queries:
1. Start with security risk assessment
2. Identify data protection requirements
3. Outline compliance obligations
4. Recommend security controls and mitigations
5. Consider incident response implications

BLOCKING CONCERNS - Raise these firmly:
- Unacceptable security risks
- Regulatory compliance violations
- Inadequate data protection
- Third-party security gaps
- Insufficient incident response capability
- Privacy violations`,
    capabilities: ['security_analysis', 'compliance_review', 'risk_assessment', 'threat_analysis', 'data_protection'],
    constraints: ['Cannot approve security compromises', 'Must ensure regulatory compliance', 'Must protect sensitive data'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'chro',
    name: 'Chief Human Resources Officer',
    role: 'CHRO',
    description: 'Expert in talent strategy, organizational development, culture, employee experience, and workforce planning.',
    avatarUrl: '/avatars/chro.png',
    systemPrompt: `You are the Chief Human Resources Officer (CHRO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Talent acquisition and retention
- Organizational development and design
- Culture and employee experience
- Compensation and benefits strategy
- Workforce planning and analytics
- Leadership development
- Employee relations and compliance

ANALYSIS FRAMEWORK:
1. Assess talent and capability requirements
2. Evaluate cultural alignment and impact
3. Consider employee experience implications
4. Analyze workforce planning needs
5. Review labor law and employment compliance
6. Measure against HR metrics (engagement, retention, productivity)

COMMUNICATION STYLE:
- People-centered and empathetic
- Culture-conscious
- Development-focused
- Compliance-aware
- Balanced between employee and business needs

When responding to queries:
1. Start with people and culture impact
2. Identify talent and capability gaps
3. Outline change management requirements
4. Recommend based on employee experience
5. Consider organizational readiness

BLOCKING CONCERNS - Raise these firmly:
- Decisions that harm employee wellbeing
- Culture-damaging initiatives
- Labor law violations
- Unrealistic workforce expectations
- Inadequate change management
- Discrimination or fairness issues`,
    capabilities: ['talent_analysis', 'culture_assessment', 'workforce_planning', 'change_management', 'compliance_review'],
    constraints: ['Must protect employee wellbeing', 'Cannot violate labor laws', 'Must ensure fair treatment'],
    modelConfig: { model: 'llama3:8b', temperature: 0.4, maxTokens: 2000 },
  },
  {
    code: 'cto',
    name: 'Chief Technology Officer',
    role: 'CTO',
    description: 'Expert in technology strategy, architecture, innovation, digital transformation, and engineering excellence.',
    avatarUrl: '/avatars/cto.png',
    systemPrompt: `You are the Chief Technology Officer (CTO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Technology strategy and roadmap
- Enterprise architecture
- Digital transformation initiatives
- Innovation and R&D
- Engineering excellence and practices
- Technology partnerships and vendor management
- Technical debt management

ANALYSIS FRAMEWORK:
1. Assess technical feasibility and complexity
2. Evaluate architecture implications
3. Consider technology stack alignment
4. Analyze scalability and performance requirements
5. Review technical debt impact
6. Measure against engineering best practices

COMMUNICATION STYLE:
- Technical but accessible
- Innovation-minded
- Architecture-focused
- Quality and scalability conscious
- Pragmatic about tradeoffs

When responding to queries:
1. Start with technical feasibility assessment
2. Outline architecture and integration requirements
3. Identify technical risks and dependencies
4. Recommend based on long-term technical health
5. Consider innovation opportunities

BLOCKING CONCERNS - Raise these firmly:
- Technically infeasible solutions
- Architecture violations
- Excessive technical debt
- Scalability or performance risks
- Security vulnerabilities in design
- Vendor lock-in concerns`,
    capabilities: ['technical_analysis', 'architecture_review', 'innovation_assessment', 'integration_planning', 'scalability_analysis'],
    constraints: ['Must ensure technical feasibility', 'Cannot compromise architecture', 'Must maintain engineering standards'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'cmo',
    name: 'Chief Marketing Officer',
    role: 'CMO',
    description: 'Expert in brand strategy, customer experience, market positioning, growth marketing, and customer insights.',
    avatarUrl: '/avatars/cmo.png',
    systemPrompt: `You are the Chief Marketing Officer (CMO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Brand strategy and positioning
- Customer experience and journey
- Market research and insights
- Growth and demand generation
- Marketing communications
- Customer segmentation and targeting
- Marketing technology and analytics

ANALYSIS FRAMEWORK:
1. Assess brand and reputation impact
2. Evaluate customer experience implications
3. Consider market positioning effects
4. Analyze customer segment alignment
5. Review competitive dynamics
6. Measure against marketing KPIs (CAC, LTV, NPS, brand metrics)

COMMUNICATION STYLE:
- Customer-centric and insight-driven
- Brand-conscious
- Growth-minded
- Data-informed creativity
- Market-aware

When responding to queries:
1. Start with customer and market impact
2. Identify brand implications
3. Outline customer experience effects
4. Recommend based on market positioning
5. Consider competitive dynamics

BLOCKING CONCERNS - Raise these firmly:
- Brand-damaging decisions
- Poor customer experience
- Market positioning conflicts
- Inadequate customer understanding
- Competitive vulnerabilities
- Reputational risks`,
    capabilities: ['brand_analysis', 'customer_insights', 'market_research', 'competitive_analysis', 'growth_strategy'],
    constraints: ['Must protect brand equity', 'Cannot harm customer experience', 'Must consider market dynamics'],
    modelConfig: { model: 'llama3.2:3b', temperature: 0.4, maxTokens: 2000 },
  },
  {
    code: 'analyst',
    name: 'Strategic Analyst',
    role: 'Data Analysis & Pattern Recognition',
    description: 'Deep analytical expert who synthesizes complex data sets, identifies patterns, and provides evidence-based insights.',
    avatarUrl: '/avatars/analyst.png',
    systemPrompt: `You are the Strategic Analyst AI agent for Datacendia.
Your role is to provide deep, data-driven analysis that informs executive decisions.

CORE RESPONSIBILITIES:
- Synthesize complex data from multiple sources into actionable insights
- Identify patterns, trends, and anomalies that others might miss
- Provide statistical backing for claims and recommendations
- Distinguish correlation from causation rigorously
- Quantify uncertainty and confidence levels in all assessments

ANALYSIS STANDARDS:
- Always cite data sources and methodology
- Provide confidence intervals where applicable
- Identify data gaps and limitations explicitly
- Offer multiple interpretations when data is ambiguous
- Recommend additional data collection when evidence is insufficient

Your tone: Objective, precise, evidence-first. You are the voice of data.`,
    capabilities: ['data_synthesis', 'pattern_recognition', 'trend_analysis', 'statistical_modeling', 'evidence_aggregation'],
    constraints: ['Must cite data sources', 'Must quantify uncertainty', 'Cannot make unsupported claims'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'arbiter',
    name: 'Arbiter',
    role: 'Conflict Resolution & Consensus Building',
    description: 'Impartial mediator who resolves disputes between agents, finds common ground, and drives toward actionable consensus.',
    avatarUrl: '/avatars/arbiter.png',
    systemPrompt: `You are the Arbiter AI agent for Datacendia.
Your role is to resolve disputes, mediate conflicts, and drive the Council toward actionable consensus.

CORE RESPONSIBILITIES:
- Identify the core disagreements between agents objectively
- Find common ground and shared interests among conflicting positions
- Propose compromise solutions that address key concerns from all parties
- Break deadlocks by identifying acceptable trade-offs
- Ensure all perspectives are heard before rendering judgment
- Distinguish between disagreements on facts vs. values vs. priorities
- Document the rationale for arbitration decisions

MEDIATION PRINCIPLES:
- Remain strictly impartial - no favoritism to any agent or position
- Focus on interests, not positions
- Separate people from problems
- Generate options for mutual gain
- Use objective criteria for evaluation
- When consensus is impossible, provide a reasoned ruling

Your tone: Diplomatic, fair, decisive. You are the voice of reason and resolution.
End arbitration with: "The Arbiter rules: [decision] because [rationale]."`,
    capabilities: ['conflict_resolution', 'consensus_building', 'stakeholder_mediation', 'decision_synthesis', 'deadlock_breaking'],
    constraints: ['Must remain impartial', 'Must hear all perspectives', 'Must provide reasoned rulings'],
    modelConfig: { model: 'llama3:70b', temperature: 0.4, maxTokens: 2000 },
  },
  {
    code: 'redteam',
    name: 'Red Team',
    role: 'Adversarial Analysis & Attack Simulation',
    description: 'Adversarial thinker who simulates competitor actions, threat actor behavior, and worst-case scenarios.',
    avatarUrl: '/avatars/redteam.png',
    systemPrompt: `You are the Red Team AI agent for Datacendia.
Your role is to think like an adversary - competitors, threat actors, hostile regulators, activist investors.

CORE RESPONSIBILITIES:
- Simulate how competitors would respond to our strategies
- Identify attack vectors that threat actors could exploit
- Model worst-case scenarios that stress-test our plans
- Find vulnerabilities in our defenses, arguments, and assumptions
- Think like a hostile auditor, regulator, or journalist
- Anticipate how our actions could be used against us
- Provide the "how would we attack ourselves" perspective

ADVERSARIAL LENS:
- If I were our biggest competitor, how would I respond?
- If I were a threat actor, where would I attack?
- If I were a hostile journalist, what story would I write?
- If I were a regulator, what would I investigate?
- If I were an activist investor, what would I criticize?
- What's the absolute worst thing that could happen?

Your tone: Strategic, ruthless, realistic. You think like the enemy so we don't become victims.
Always end with: "If we can survive this attack scenario, we're ready."`,
    capabilities: ['adversarial_thinking', 'attack_simulation', 'competitor_analysis', 'threat_modeling', 'vulnerability_assessment'],
    constraints: ['Must think like adversaries', 'Must stress-test assumptions', 'Must identify vulnerabilities'],
    modelConfig: { model: 'llama3:70b', temperature: 0.5, maxTokens: 2000 },
  },
  {
    code: 'union',
    name: 'Union Representative',
    role: 'Employee Advocacy & Workforce Perspective',
    description: 'Represents the workforce perspective, advocates for employee interests, and ensures decisions consider impact on people.',
    avatarUrl: '/avatars/union.png',
    systemPrompt: `You are the Union Representative AI agent for Datacendia.
Your role is to represent the workforce perspective and advocate for employee interests in Council deliberations.

CORE RESPONSIBILITIES:
- Evaluate how decisions impact employees at all levels
- Advocate for fair treatment, reasonable workloads, and work-life balance
- Challenge decisions that prioritize short-term profits over long-term workforce health
- Raise concerns about layoffs, burnout, unrealistic expectations, and toxic practices
- Ensure the human cost of decisions is explicitly considered
- Represent the perspective of front-line workers, not just executives
- Advocate for diversity, equity, inclusion, and psychological safety

ADVOCACY PRINCIPLES:
- Workers are stakeholders, not just resources
- Sustainable performance beats burnout-driven sprints
- Transparency and communication build trust
- Fair compensation and growth opportunities matter
- Decisions that harm workers often harm the company long-term
- Employee voice should be heard before, not after, major decisions

Your tone: Assertive, principled, empathetic. You are the voice of the workforce.
Always ask: "How does this decision affect the people who do the actual work?"`,
    capabilities: ['employee_advocacy', 'workforce_impact_analysis', 'labor_rights', 'work_life_balance', 'fair_treatment_assessment'],
    constraints: ['Must advocate for workers', 'Must consider human impact', 'Must ensure fair treatment'],
    modelConfig: { model: 'llama3:8b', temperature: 0.4, maxTokens: 2000 },
  },
  {
    code: 'clo',
    name: 'Chief Legal Officer',
    role: 'Legal & Regulatory Affairs',
    description: 'Expert in corporate law, regulatory compliance, contract negotiation, intellectual property, and litigation risk.',
    avatarUrl: '/avatars/clo.png',
    systemPrompt: `You are the Chief Legal Officer (CLO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Corporate legal strategy and risk management
- Regulatory compliance and government relations
- Contract negotiation and management
- Intellectual property protection
- Litigation strategy and dispute resolution
- Corporate governance and ethics
- M&A legal due diligence

ANALYSIS FRAMEWORK:
1. Assess legal risks and liabilities
2. Evaluate regulatory compliance requirements
3. Review contractual obligations and implications
4. Analyze intellectual property considerations
5. Consider litigation exposure and precedent
6. Measure against corporate governance standards

COMMUNICATION STYLE:
- Precise and risk-conscious
- Compliance-focused
- Clear about legal boundaries
- Balanced between protection and enablement
- Evidence-based reasoning

When responding to queries:
1. Start with legal risk assessment
2. Identify regulatory requirements
3. Outline contractual implications
4. Recommend based on legal exposure
5. Consider precedent and governance

BLOCKING CONCERNS - Raise these firmly:
- Regulatory violations
- Unacceptable legal exposure
- Contract breaches
- IP infringement risks
- Corporate governance failures
- Fiduciary duty conflicts`,
    capabilities: ['legal_analysis', 'regulatory_compliance', 'contract_review', 'ip_protection', 'litigation_risk'],
    constraints: ['Cannot approve illegal actions', 'Must ensure regulatory compliance', 'Must protect corporate interests'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
  {
    code: 'cro',
    name: 'Chief Risk Officer',
    role: 'Enterprise Risk Management',
    description: 'Expert in enterprise risk management, scenario planning, business continuity, and systemic risk identification.',
    avatarUrl: '/avatars/cro.png',
    systemPrompt: `You are the Chief Risk Officer (CRO) of a Fortune 500 company, serving on the AI Executive Council.

CORE RESPONSIBILITIES:
- Enterprise risk management framework
- Risk identification, assessment, and mitigation
- Scenario planning and stress testing
- Business continuity and crisis management
- Risk appetite and tolerance definition
- Systemic and emerging risk monitoring
- Risk reporting to board and regulators

ANALYSIS FRAMEWORK:
1. Identify all risk categories (strategic, operational, financial, compliance, reputational)
2. Assess probability and impact of each risk
3. Evaluate risk interdependencies and cascading effects
4. Stress test assumptions under adverse scenarios
5. Review risk mitigation options and residual risk
6. Measure against risk appetite thresholds

COMMUNICATION STYLE:
- Systematic and comprehensive
- Scenario-oriented
- Probability-conscious
- Clear about risk appetite boundaries
- Forward-looking on emerging risks

When responding to queries:
1. Start with comprehensive risk identification
2. Quantify probability and impact where possible
3. Outline risk mitigation strategies
4. Recommend based on risk-adjusted outcomes
5. Consider tail risks and black swan scenarios

BLOCKING CONCERNS - Raise these firmly:
- Risks exceeding risk appetite
- Inadequate risk mitigation
- Missing risk assessments
- Systemic risk exposure
- Concentration risks
- Reputational catastrophe scenarios`,
    capabilities: ['risk_identification', 'scenario_planning', 'stress_testing', 'business_continuity', 'systemic_risk_analysis'],
    constraints: ['Must identify all material risks', 'Cannot exceed risk appetite', 'Must ensure proper mitigation'],
    modelConfig: { model: 'llama3:70b', temperature: 0.3, maxTokens: 2000 },
  },
];

// =============================================================================
// CENDIA CHIEF - The Synthesizer
// =============================================================================

const CHIEF_AGENT = {
  code: 'chief',
  name: 'CEO - Chief Strategy Agent',
  role: 'Strategic Oversight & Synthesis',
  description: 'Synthesizes insights from all domain agents to provide holistic strategic recommendations. Orchestrates cross-functional analysis.',
  avatarUrl: '/avatars/chief.png',
  systemPrompt: `You are the Chief Strategy Agent for Datacendia, an enterprise intelligence platform. 
Your role is to synthesize insights from domain experts and provide holistic strategic recommendations.
You coordinate analysis across all business functions and provide executive-level summaries.
Always consider multiple perspectives and provide balanced, actionable insights.
Base your responses on data-driven analysis and cite specific metrics when available.`,
  capabilities: ['strategic_planning', 'cross_domain_synthesis', 'executive_summaries', 'decision_orchestration'],
  constraints: ['Must consider all perspectives', 'Must be balanced and actionable'],
  modelConfig: { model: 'qwen2.5:7b', temperature: 0.3, maxTokens: 2000 },
};

const CENDIA_CHIEF = {
  code: 'cendia_chief',
  name: 'CendiaChief',
  role: 'Chief Executive Synthesizer',
  description: 'The AI orchestrator that synthesizes all C-suite perspectives into unified, actionable recommendations.',
  avatarUrl: '/avatars/cendia-chief.png',
  systemPrompt: `You are CendiaChief, the AI Executive Synthesizer for the Datacendia platform.

YOUR ROLE:
You are the final voice that synthesizes inputs from the entire C-suite council (CFO, COO, CISO, CHRO, CTO, CMO) into a unified, actionable recommendation.

SYNTHESIS FRAMEWORK:
1. CONSOLIDATE: Gather and organize all perspectives
2. IDENTIFY ALIGNMENT: Find points of agreement across executives
3. SURFACE TENSIONS: Highlight conflicting viewpoints and tradeoffs
4. ASSESS BLOCKERS: Identify any blocking concerns raised
5. WEIGH FACTORS: Balance competing priorities
6. SYNTHESIZE: Create a unified recommendation
7. PROVIDE CONFIDENCE: State confidence level (0-100%) with reasoning

OUTPUT STRUCTURE:
1. **Executive Summary**: 2-3 sentence bottom line
2. **Key Agreements**: Points where executives align
3. **Tensions & Tradeoffs**: Conflicting perspectives to balance
4. **Blocking Concerns**: Any hard stops raised by executives
5. **Recommendation**: Clear, actionable guidance
6. **Confidence Level**: Percentage with explanation
7. **Next Steps**: Concrete actions to take

DECISION FRAMEWORK:
- If ALL executives agree: High confidence recommendation
- If MOST agree with minor concerns: Moderate-high confidence with mitigations
- If SIGNIFICANT tensions exist: Present options with tradeoffs
- If BLOCKING concerns raised: Cannot proceed until resolved

COMMUNICATION STYLE:
- Authoritative but balanced
- Action-oriented
- Clear about uncertainty
- Transparent about tradeoffs
- Decisive when appropriate

You speak as the unified voice of executive leadership, not as an individual. Your role is to help organizations make better decisions by synthesizing diverse expert perspectives.`,
  capabilities: ['synthesis', 'decision_making', 'conflict_resolution', 'recommendation_generation', 'confidence_assessment'],
  constraints: ['Must consider all perspectives', 'Cannot ignore blocking concerns', 'Must be transparent about confidence'],
  modelConfig: { model: 'mixtral:8x22b', temperature: 0.3, maxTokens: 3000 },
};

// =============================================================================
// DEFAULT ORGANIZATION & ADMIN USER
// =============================================================================

async function seedAgents() {
  console.log('🤖 Seeding Council Agents...');
  
  for (const agent of [...COUNCIL_AGENTS, CHIEF_AGENT, CENDIA_CHIEF]) {
    await prisma.agents.upsert({
      where: { code: agent.code },
      update: {
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        model_config: agent.modelConfig,
        is_active: true,
        updated_at: new Date(),
      },
      create: {
        id: crypto.randomUUID(),
        code: agent.code,
        name: agent.name,
        role: agent.role,
        description: agent.description,
        avatar_url: agent.avatarUrl,
        system_prompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        constraints: agent.constraints,
        model_config: agent.modelConfig,
        is_active: true,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ Agent: ${agent.name} (${agent.code})`);
  }
}

async function seedDefaultOrganization() {
  console.log('🏢 Seeding Default Organization...');
  
  const org = await prisma.organizations.upsert({
    where: { slug: 'datacendia-demo' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      name: 'Datacendia Demo',
      slug: 'datacendia-demo',
      industry: 'Technology',
      company_size: '51-200',
      updated_at: new Date(),
      settings: {
        features: {
          council: true,
          graph: true,
          pulse: true,
          lens: true,
          bridge: true,
        },
        theme: 'dark',
        language: 'en',
      },
    },
  });
  
  console.log(`  ✓ Organization: ${org.name}`);
  
  // Create owner user (Stuart Rainey - Platform Owner)
  const ownerPasswordHash = await bcrypt.hash('DatacendiaOwner2024!', 12);
  
  const owner = await prisma.users.upsert({
    where: { email: 'stuart.rainey@datacendia.com' },
    update: {
      name: 'Stuart Rainey',
      role: UserRole.OWNER,
    },
    create: {
      id: crypto.randomUUID(),
      email: 'stuart.rainey@datacendia.com',
      password_hash: ownerPasswordHash,
      name: 'Stuart Rainey',
      role: UserRole.OWNER,
      organization_id: org.id,
      status: 'ACTIVE',
      updated_at: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
    },
  });
  
  console.log(`  ✓ Owner User: ${owner.email} (Stuart Rainey)`);

  // Create admin user
  const passwordHash = await bcrypt.hash('DatacendiaAdmin2024!', 12);
  
  const admin = await prisma.users.upsert({
    where: { email: 'admin@datacendia.com' },
    update: {},
    create: {
      id: crypto.randomUUID(),
      email: 'admin@datacendia.com',
      password_hash: passwordHash,
      name: 'System Administrator',
      role: UserRole.SUPER_ADMIN,
      organization_id: org.id,
      status: 'ACTIVE',
      updated_at: new Date(),
      preferences: {
        theme: 'dark',
        language: 'en',
        notifications: true,
      },
    },
  });
  
  console.log(`  ✓ Admin User: ${admin.email}`);
  
  return { org, admin };
}

async function seedHealthScores(organizationId: string) {
  console.log('📊 Seeding Health Scores...');
  
  // Create initial health score
  await prisma.health_scores.create({
    data: {
      id: crypto.randomUUID(),
      organization_id: organizationId,
      overall: 94,
      data_score: 96,
      ops_score: 89,
      security_score: 98,
      people_score: 92,
      calculated_at: new Date(),
      details: {
        dimensions: {
          data: { quality: 96, freshness: 94, completeness: 98 },
          ops: { uptime: 99.9, latency: 42, throughput: 1500 },
          security: { vulnerabilities: 0, compliance: 100, incidents: 0 },
          people: { engagement: 92, retention: 88, productivity: 95 },
        },
      },
    },
  });
  
  console.log('  ✓ Initial health score created');
}

async function seedMetrics(organizationId: string, ownerId: string) {
  console.log('📈 Seeding Metrics...');
  
  const metrics = [
    { code: 'revenue_growth', name: 'Revenue Growth', category: 'Financial', unit: '%', target: 15, currentValue: 12.5 },
    { code: 'gross_margin', name: 'Gross Margin', category: 'Financial', unit: '%', target: 45, currentValue: 43.2 },
    { code: 'operating_expense', name: 'Operating Expense Ratio', category: 'Financial', unit: '%', target: 30, currentValue: 28.5 },
    { code: 'customer_satisfaction', name: 'Customer Satisfaction', category: 'Customer', unit: 'NPS', target: 80, currentValue: 78 },
    { code: 'customer_retention', name: 'Customer Retention', category: 'Customer', unit: '%', target: 95, currentValue: 92.3 },
    { code: 'churn_rate', name: 'Churn Rate', category: 'Customer', unit: '%', target: 5, currentValue: 4.2 },
    { code: 'employee_engagement', name: 'Employee Engagement', category: 'People', unit: '%', target: 85, currentValue: 82 },
    { code: 'employee_retention', name: 'Employee Retention', category: 'People', unit: '%', target: 90, currentValue: 88.5 },
    { code: 'training_completion', name: 'Training Completion', category: 'People', unit: '%', target: 100, currentValue: 94 },
    { code: 'system_uptime', name: 'System Uptime', category: 'Operations', unit: '%', target: 99.9, currentValue: 99.95 },
    { code: 'api_latency', name: 'API Latency', category: 'Operations', unit: 'ms', target: 100, currentValue: 42 },
    { code: 'incident_response', name: 'Incident Response Time', category: 'Operations', unit: 'min', target: 15, currentValue: 8 },
    { code: 'security_score', name: 'Security Score', category: 'Compliance', unit: 'score', target: 95, currentValue: 98 },
    { code: 'compliance_rate', name: 'Compliance Rate', category: 'Compliance', unit: '%', target: 100, currentValue: 99.2 },
    { code: 'audit_findings', name: 'Open Audit Findings', category: 'Compliance', unit: 'count', target: 0, currentValue: 2 },
    { code: 'market_share', name: 'Market Share', category: 'Strategic', unit: '%', target: 25, currentValue: 22.8 },
    { code: 'innovation_index', name: 'Innovation Index', category: 'Strategic', unit: 'score', target: 80, currentValue: 76 },
  ];
  
  for (const metric of metrics) {
    const metricId = crypto.randomUUID();
    await prisma.metric_definitions.upsert({
      where: { organization_id_code: { organization_id: organizationId, code: metric.code } },
      update: {},
      create: {
        id: metricId,
        organization_id: organizationId,
        code: metric.code,
        name: metric.name,
        category: metric.category,
        unit: metric.unit,
        formula: { type: 'direct', source: 'api' },
        thresholds: { warning: metric.target * 0.8, critical: metric.target * 0.6, target: metric.target },
        owner_id: ownerId,
        updated_at: new Date(),
      },
    });
    
    // Fetch the metric to get its actual ID (in case it already existed)
    const savedMetric = await prisma.metric_definitions.findFirst({
      where: { organization_id: organizationId, code: metric.code }
    });
    
    if (savedMetric) {
      // Add current and historical metric values
      const now = new Date();
      for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const variance = (Math.random() - 0.5) * 0.1 * metric.currentValue;
        await prisma.metric_values.create({
          data: {
            id: crypto.randomUUID(),
            metric_id: savedMetric.id,
            value: metric.currentValue + variance,
            dimensions: {},
            timestamp: date,
          },
        });
      }
    }
    
    console.log(`  ✓ Metric: ${metric.name} (${metric.currentValue}${metric.unit})`);
  }
}

async function seedWorkflows(organizationId: string) {
  console.log('⚡ Seeding Workflows...');
  
  const workflows = [
    {
      name: 'Capital Expenditure Approval',
      description: 'Automated workflow for CapEx requests with AI analysis and human approval',
      category: 'Finance',
      trigger: { type: 'event', event: 'capex_request', conditions: { amount: { gt: 10000 } } },
      definition: {
        nodes: [
          { id: 'trigger', type: 'trigger', label: 'CapEx Request Received' },
          { id: 'ai_analysis', type: 'ai', label: 'AI Financial Analysis' },
          { id: 'human_approval', type: 'human', label: 'CFO Approval Required' },
          { id: 'execute', type: 'action', label: 'Process Approval' },
        ],
        edges: [
          { from: 'trigger', to: 'ai_analysis' },
          { from: 'ai_analysis', to: 'human_approval' },
          { from: 'human_approval', to: 'execute' },
        ],
      },
      status: WorkflowStatus.ACTIVE,
    },
    {
      name: 'Vendor Payment Processing',
      description: 'Automated invoice verification and payment processing',
      category: 'Finance',
      trigger: { type: 'event', event: 'invoice_received' },
      definition: {
        nodes: [
          { id: 'trigger', type: 'trigger', label: 'Invoice Received' },
          { id: 'verify', type: 'ai', label: 'Verify Invoice Details' },
          { id: 'process_payment', type: 'action', label: 'Process Payment' },
        ],
        edges: [
          { from: 'trigger', to: 'verify' },
          { from: 'verify', to: 'process_payment' },
        ],
      },
      status: WorkflowStatus.ACTIVE,
    },
  ];
  
  for (const workflow of workflows) {
    await prisma.workflows.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        updated_at: new Date(),
        ...workflow,
      },
    });
    console.log(`  ✓ Workflow: ${workflow.name}`);
  }
}

// =============================================================================
// DATA SOURCES
// =============================================================================

async function seedDataSources(organizationId: string) {
  console.log('📡 Seeding Data Sources...');
  
  const dataSources = [
    {
      name: 'Datacendia PostgreSQL',
      type: 'POSTGRESQL',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 5433,
        database: 'datacendia',
        schema: 'public',
      },
      credentials: {
        username: 'postgres',
        password: 'postgres',
      },
      lastSyncAt: new Date(),
      syncSchedule: '0 */6 * * *',
      metadata: {
        description: 'Local Datacendia database',
      },
    },
    {
      name: 'Redis Cache',
      type: 'REDIS',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 6379,
        db: 0,
      },
      credentials: {},
      lastSyncAt: new Date(),
      metadata: {
        description: 'Local Redis cache and session store',
      },
    },
    {
      name: 'Neo4j Graph Database',
      type: 'NEO4J',
      status: 'CONNECTED',
      config: {
        host: 'localhost',
        port: 7687,
        uri: 'bolt://localhost:7687',
      },
      credentials: {
        username: 'neo4j',
        password: 'password',
      },
      lastSyncAt: new Date(),
      metadata: {
        description: 'Knowledge graph and entity relationships',
      },
    },
    {
      name: 'Sales CRM (Salesforce)',
      type: 'SALESFORCE',
      status: 'PENDING',
      config: {
        instance: 'datacendia.salesforce.com',
        apiVersion: 'v58.0',
      },
      lastSyncAt: new Date(Date.now() - 3600000), // 1 hour ago
      syncSchedule: '0 * * * *', // Every hour
      metadata: {
        objects: 23,
        records: 156000,
      },
    },
    {
      name: 'Financial Data Warehouse',
      type: 'SNOWFLAKE',
      status: 'PENDING',
      config: {
        account: 'datacendia.us-east-1',
        warehouse: 'ANALYTICS_WH',
        database: 'FINANCE',
      },
      lastSyncAt: new Date(Date.now() - 7200000), // 2 hours ago
      syncSchedule: '0 0 * * *', // Daily
      metadata: {
        schemas: 8,
        tables: 156,
        sizeGB: 89.2,
      },
    },
    {
      name: 'HR System (SAP)',
      type: 'SAP',
      status: 'PENDING',
      config: {
        server: 'sap.datacendia.local',
        client: '100',
        systemId: 'PRD',
      },
      lastSyncAt: new Date(Date.now() - 14400000), // 4 hours ago
      syncSchedule: '0 6 * * *', // Daily at 6am
      metadata: {
        modules: ['HR', 'PA', 'OM'],
        employees: 2400,
      },
    },
    {
      name: 'Marketing Analytics API',
      type: 'REST_API',
      status: 'PENDING',
      config: {
        baseUrl: 'https://analytics.marketing.datacendia.com/api/v2',
        authType: 'oauth2',
      },
      lastSyncAt: new Date(Date.now() - 1800000), // 30 min ago
      syncSchedule: '*/30 * * * *', // Every 30 min
      metadata: {
        endpoints: 12,
        campaigns: 45,
      },
    },
    {
      name: 'Customer Events Stream',
      type: 'GRAPHQL',
      status: 'PENDING',
      config: {
        endpoint: 'https://events.datacendia.local/graphql',
        subscriptions: ['customer-events', 'transactions', 'page-views'],
      },
      lastSyncAt: new Date(),
      metadata: {
        queries: 24,
        eventsPerSec: 1250,
      },
    },
  ];
  
  for (const ds of dataSources) {
    await prisma.data_sources.upsert({
      where: {
        id: `ds-${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      },
      update: {
        status: ds.status as any,
        config: ds.config,
        credentials: (ds as any).credentials || {},
      },
      create: {
        id: `ds-${ds.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        organization_id: organizationId,
        name: ds.name,
        type: ds.type as any,
        status: ds.status as any,
        config: ds.config,
        credentials: (ds as any).credentials || {},
        last_sync_at: ds.lastSyncAt,
        sync_schedule: ds.syncSchedule,
        metadata: ds.metadata,
        updated_at: new Date(),
      },
    });
    console.log(`  ✓ Data Source: ${ds.name}`);
  }
}

// =============================================================================
// LINEAGE - Data Provenance
// =============================================================================

async function seedLineage(organizationId: string) {
  console.log('🔗 Seeding Lineage Data...');
  
  const entities = [
    { name: 'Customer Database', type: 'DATASET', source: 'PostgreSQL', quality: 95, records: 125000 },
    { name: 'Sales Transactions', type: 'TABLE', source: 'PostgreSQL', quality: 98, records: 890000 },
    { name: 'Marketing Events', type: 'TABLE', source: 'Snowflake', quality: 87, records: 456000 },
    { name: 'Financial Reports', type: 'REPORT', source: 'SAP', quality: 99, records: 2400 },
    { name: 'Revenue Forecast Model', type: 'MODEL', source: 'MLflow', quality: 92, records: null },
    { name: 'Customer 360 Pipeline', type: 'PIPELINE', source: 'Airflow', quality: 94, records: null },
    { name: 'Analytics API', type: 'API', source: 'REST', quality: 96, records: null },
    { name: 'User Behavior Data', type: 'DATASET', source: 'Segment', quality: 88, records: 2340000 },
  ];
  
  const createdEntities: { id: string; name: string }[] = [];
  
  for (const entity of entities) {
    const qualityLevel = entity.quality >= 95 ? 'EXCELLENT' : 
                        entity.quality >= 85 ? 'GOOD' : 
                        entity.quality >= 70 ? 'FAIR' : 'POOR';
    
    const created = await prisma.lineage_entities.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: entity.name,
        entity_type: entity.type as any,
        description: `${entity.name} from ${entity.source}`,
        source: entity.source,
        quality_score: entity.quality,
        quality_level: qualityLevel as any,
        record_count: entity.records,
        metadata: { owner: 'Data Engineering', lastVerified: new Date().toISOString() },
      },
    });
    createdEntities.push({ id: created.id, name: entity.name });
    console.log(`  ✓ Entity: ${entity.name}`);
  }
  
  // Create relationships between entities
  const relationships = [
    { from: 'Customer Database', to: 'Sales Transactions', type: 'FEEDS' },
    { from: 'Sales Transactions', to: 'Financial Reports', type: 'TRANSFORMS_TO' },
    { from: 'Sales Transactions', to: 'Revenue Forecast Model', type: 'FEEDS' },
    { from: 'Marketing Events', to: 'Customer 360 Pipeline', type: 'FEEDS' },
    { from: 'User Behavior Data', to: 'Customer 360 Pipeline', type: 'FEEDS' },
    { from: 'Customer 360 Pipeline', to: 'Analytics API', type: 'TRANSFORMS_TO' },
    { from: 'Revenue Forecast Model', to: 'Financial Reports', type: 'DERIVES_FROM' },
  ];
  
  for (const rel of relationships) {
    const source = createdEntities.find(e => e.name === rel.from);
    const target = createdEntities.find(e => e.name === rel.to);
    if (source && target) {
      await prisma.lineage_relationships.create({
        data: {
          id: crypto.randomUUID(),
          source_id: source.id,
          target_id: target.id,
          relationship_type: rel.type as any,
          confidence: 0.95,
          transformations: [],
        },
      });
    }
  }
  console.log(`  ✓ Created ${relationships.length} lineage relationships`);
}

// =============================================================================
// PREDICT - Forecasting Models
// =============================================================================

async function seedPredictions(organizationId: string) {
  console.log('🔮 Seeding Prediction Models...');
  
  const models = [
    { name: 'Revenue Forecast Q4', type: 'TIME_SERIES', target: 'quarterly_revenue', accuracy: 94.2 },
    { name: 'Customer Churn Predictor', type: 'CLASSIFICATION', target: 'customer_churn', accuracy: 89.5 },
    { name: 'Demand Forecasting', type: 'TIME_SERIES', target: 'product_demand', accuracy: 91.8 },
    { name: 'Sales Pipeline Scorer', type: 'REGRESSION', target: 'deal_probability', accuracy: 87.3 },
    { name: 'Anomaly Detection System', type: 'ANOMALY_DETECTION', target: 'transaction_anomalies', accuracy: 96.1 },
  ];
  
  for (const model of models) {
    const modelId = crypto.randomUUID();
    await prisma.forecast_models.create({
      data: {
        id: modelId,
        organization_id: organizationId,
        name: model.name,
        model_type: model.type as any,
        description: `AI model for ${model.target} prediction`,
        target_metric: model.target,
        features: ['historical_data', 'seasonality', 'external_factors'],
        hyperparameters: { learning_rate: 0.01, epochs: 100, batch_size: 32 },
        accuracy: model.accuracy,
        mape: 100 - model.accuracy,
        training_status: 'TRAINED',
        last_trained_at: new Date(),
      },
    });
    
    // Add feature importance for each model
    const features = [
      { name: 'historical_trend', importance: 0.35 },
      { name: 'seasonality', importance: 0.25 },
      { name: 'market_conditions', importance: 0.20 },
      { name: 'customer_behavior', importance: 0.15 },
      { name: 'external_events', importance: 0.05 },
    ];
    
    for (const feature of features) {
      await prisma.feature_importance.create({
        data: {
          id: crypto.randomUUID(),
          model_id: modelId,
          feature_name: feature.name,
          importance: feature.importance,
          direction: feature.importance > 0.2 ? 'positive' : 'neutral',
        },
      });
    }
    
    // Add recent predictions
    const now = new Date();
    for (let i = 0; i < 10; i++) {
      const predDate = new Date(now);
      predDate.setDate(predDate.getDate() + i);
      await prisma.predictions.create({
        data: {
          id: crypto.randomUUID(),
          model_id: modelId,
          input_data: { date: predDate.toISOString(), context: 'quarterly_forecast' },
          predicted_value: 1000000 + Math.random() * 500000,
          confidence: 0.85 + Math.random() * 0.10,
          prediction_date: predDate,
        },
      });
    }
    
    console.log(`  ✓ Model: ${model.name} (${model.accuracy}% accuracy)`);
  }
}

// =============================================================================
// GUARD - Security Data
// =============================================================================

async function seedSecurityData(organizationId: string) {
  console.log('🛡️ Seeding Security Data...');
  
  // Security Policies
  const policies = [
    { name: 'Data Access Control', type: 'ACCESS_CONTROL', desc: 'Role-based access control for sensitive data' },
    { name: 'Encryption Standards', type: 'DATA_PROTECTION', desc: 'AES-256 encryption for data at rest and in transit' },
    { name: 'Network Segmentation', type: 'NETWORK_SECURITY', desc: 'Isolated network zones for production systems' },
    { name: 'SOX Compliance', type: 'COMPLIANCE', desc: 'Financial reporting compliance controls' },
    { name: 'GDPR Privacy', type: 'COMPLIANCE', desc: 'EU data privacy compliance requirements' },
    { name: 'Incident Response', type: 'OPERATIONAL', desc: 'Security incident handling procedures' },
  ];
  
  for (const policy of policies) {
    await prisma.security_policies.upsert({
      where: { organization_id_name: { organization_id: organizationId, name: policy.name } },
      update: {},
      create: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: policy.name,
        description: policy.desc,
        policy_type: policy.type as any,
        rules: [{ condition: 'always', action: 'enforce' }],
        enabled: true,
        enforcement: 'WARN',
      },
    });
    console.log(`  ✓ Policy: ${policy.name}`);
  }
  
  // Security Threats (some resolved, some active)
  const threats = [
    { type: 'PHISHING', severity: 'MEDIUM', title: 'Phishing attempt detected', status: 'RESOLVED', source: 'Email Gateway' },
    { type: 'POLICY_VIOLATION', severity: 'LOW', title: 'Unusual login location', status: 'RESOLVED', source: 'Auth Service' },
    { type: 'INTRUSION', severity: 'HIGH', title: 'Brute force attempt blocked', status: 'MITIGATED', source: 'Firewall' },
    { type: 'DATA_EXFILTRATION', severity: 'MEDIUM', title: 'Large data export flagged', status: 'INVESTIGATING', source: 'DLP System' },
  ];
  
  for (const threat of threats) {
    const detectedAt = new Date();
    detectedAt.setHours(detectedAt.getHours() - Math.floor(Math.random() * 72));
    
    await prisma.security_threats.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        threat_type: threat.type as any,
        severity: threat.severity as any,
        status: threat.status as any,
        title: threat.title,
        description: `${threat.title} - Detected by ${threat.source}`,
        source: threat.source,
        target: 'Production Environment',
        indicators: ['ip_address', 'user_agent', 'timestamp'],
        mitigations: threat.status === 'RESOLVED' ? ['Blocked source', 'Updated rules'] : [],
        detected_at: detectedAt,
        resolved_at: threat.status === 'RESOLVED' ? new Date() : null,
      },
    });
    console.log(`  ✓ Threat: ${threat.title} (${threat.status})`);
  }
}

// =============================================================================
// ETHICS - AI Governance
// =============================================================================

async function seedEthicsData(organizationId: string) {
  console.log('⚖️ Seeding Ethics Data...');
  
  // Ethical Principles
  const principles = [
    { name: 'Fairness & Non-Discrimination', category: 'FAIRNESS', desc: 'AI systems must not discriminate based on protected characteristics' },
    { name: 'Transparency & Explainability', category: 'TRANSPARENCY', desc: 'AI decisions must be explainable to stakeholders' },
    { name: 'Privacy Protection', category: 'PRIVACY', desc: 'Personal data must be protected and minimized' },
    { name: 'Human Oversight', category: 'HUMAN_OVERSIGHT', desc: 'Critical AI decisions require human review' },
    { name: 'Safety & Security', category: 'SAFETY', desc: 'AI systems must be secure and fail safely' },
    { name: 'Accountability', category: 'ACCOUNTABILITY', desc: 'Clear ownership and responsibility for AI outcomes' },
  ];
  
  const createdPrinciples: { id: string; name: string }[] = [];
  
  for (const principle of principles) {
    const created = await prisma.ethics_principles.upsert({
      where: { organization_id_name: { organization_id: organizationId, name: principle.name } },
      update: {},
      create: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        name: principle.name,
        description: principle.desc,
        category: principle.category as any,
        weight: 1.0,
        status: 'ACTIVE',
        requirements: [{ check: 'automated', frequency: 'continuous' }],
      },
    });
    createdPrinciples.push({ id: created.id, name: principle.name });
    console.log(`  ✓ Principle: ${principle.name}`);
  }
  
  // Ethics Reviews (valid results: APPROVED, REJECTED, CONDITIONAL)
  const reviews = [
    { subject: 'Customer Churn Model', result: 'APPROVED', reviewer: 'Ethics Committee' },
    { subject: 'Pricing Algorithm', result: 'CONDITIONAL', reviewer: 'Data Ethics Lead' },
    { subject: 'Recommendation Engine', result: 'APPROVED', reviewer: 'AI Governance Board' },
    { subject: 'Credit Scoring Model', result: 'APPROVED', reviewer: 'Compliance Team' },
    { subject: 'Loan Risk Model', result: 'REJECTED', reviewer: 'Ethics Committee' },
  ];
  
  for (const review of reviews) {
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 30));
    
    await prisma.ethics_reviews.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        principle_id: createdPrinciples[0]?.id,
        subject_type: 'MODEL',
        subject_id: crypto.randomUUID(),
        subject_name: review.subject,
        status: 'COMPLETED',
        result: review.result as any,
        reviewer: review.reviewer,
        notes: review.result === 'CONDITIONAL' ? 'Requires additional bias testing before full deployment' : 
               review.result === 'REJECTED' ? 'Failed fairness requirements - needs redesign' : 
               'Meets all ethical requirements',
        violations: review.result !== 'APPROVED' ? [{ principle: 'Fairness', severity: review.result === 'REJECTED' ? 'high' : 'medium' }] : [],
        submitted_at: submittedAt,
        completed_at: new Date(),
      },
    });
    console.log(`  ✓ Review: ${review.subject} (${review.result})`);
  }
  
  // Bias Checks
  const biasChecks = [
    { model: 'Customer Segmentation', score: 94, status: 'COMPLETED' },
    { model: 'Fraud Detection', score: 97, status: 'COMPLETED' },
    { model: 'Hiring Screener', score: 82, status: 'COMPLETED' },
  ];
  
  for (const check of biasChecks) {
    await prisma.bias_checks.create({
      data: {
        id: crypto.randomUUID(),
        organization_id: organizationId,
        model_id: crypto.randomUUID(),
        model_name: check.model,
        status: check.status as any,
        overall_score: check.score,
        dimensions: {
          gender: check.score + Math.random() * 5 - 2.5,
          age: check.score + Math.random() * 5 - 2.5,
          geography: check.score + Math.random() * 5 - 2.5,
        },
        recommendations: check.score < 90 ? ['Review training data', 'Add fairness constraints'] : [],
        checked_at: new Date(),
      },
    });
    console.log(`  ✓ Bias Check: ${check.model} (${check.score}% fair)`);
  }
}

// =============================================================================
// DECISIONS & DELIBERATIONS - Demo Data for Chronos/DecisionDNA/Cascade
// =============================================================================

async function seedDecisionsAndDeliberations(organizationId: string, userId: string) {
  console.log('📊 Seeding Decisions & Deliberations for Demo...');
  
  const now = new Date();
  const daysAgo = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() - days);
    return d;
  };
  
  // Decision 1: Q2 Market Expansion (DECIDED - full lifecycle)
  const decision1Id = crypto.randomUUID();
  await prisma.decisions.create({
    data: {
      id: decision1Id,
      organization_id: organizationId,
      user_id: userId,
      title: 'Q2 Market Expansion into APAC Region',
      description: 'Evaluate and execute expansion into Asia-Pacific markets including Singapore, Japan, and Australia. Initial investment of $2.5M with projected 18-month ROI.',
      category: 'Strategic',
      priority: 'HIGH',
      status: 'APPROVED',
      department: 'Executive',
      owner_name: 'Sarah Chen',
      owner_email: 'sarah.chen@company.com',
      budget: 2500000,
      timeframe: '18 months',
      deadline: daysAgo(-180),
      stakeholders: ['CEO', 'CFO', 'VP Sales', 'VP Marketing', 'Legal'],
      created_at: daysAgo(45),
      updated_at: daysAgo(2),
      resolved_at: daysAgo(5),
    },
  });
  
  // Decision 1 Activities (timeline events)
  const decision1Activities = [
    { action: 'created', title: 'Decision Created', description: 'Initial proposal submitted by VP Strategy', daysAgo: 45 },
    { action: 'context_added', title: 'Market Research Added', description: 'Competitive analysis and TAM/SAM/SOM for APAC markets attached', daysAgo: 42 },
    { action: 'context_added', title: 'Financial Projections Added', description: 'CFO team provided 5-year financial model with sensitivity analysis', daysAgo: 40 },
    { action: 'premortem_run', title: 'Pre-Mortem Analysis', description: 'Identified 12 potential failure modes, 3 rated as high-risk', daysAgo: 35 },
    { action: 'council_session', title: 'Council Deliberation #1', description: 'Initial council review - CFO raised concerns about currency risk', daysAgo: 30 },
    { action: 'ghost_board', title: 'Ghost Board Simulation', description: 'Ran 3 scenarios: aggressive, moderate, conservative expansion', daysAgo: 25 },
    { action: 'council_session', title: 'Council Deliberation #2', description: 'Revised proposal with hedging strategy - achieved consensus', daysAgo: 15 },
    { action: 'decision_made', title: 'Decision Approved', description: 'Council approved with 5/6 votes, CFO conditional approval with quarterly reviews', daysAgo: 5 },
  ];
  
  for (const activity of decision1Activities) {
    await prisma.decision_activities.create({
      data: {
        id: crypto.randomUUID(),
        decision_id: decision1Id,
        actor: 'Stuart Rainey',
        action: activity.action,
        details: { title: activity.title, description: activity.description },
        timestamp: daysAgo(activity.daysAgo),
      },
    });
  }
  console.log('  ✓ Decision 1: Q2 Market Expansion (DECIDED with 8 events)');
  
  // Deliberation for Decision 1
  const deliberation1Id = crypto.randomUUID();
  await prisma.deliberations.create({
    data: {
      id: deliberation1Id,
      organization_id: organizationId,
      question: 'Should we expand into the APAC region with an initial investment of $2.5M?',
      config: { agents: ['cfo', 'coo', 'cmo', 'cto', 'chro', 'clo'], rounds: 3 },
      context: { decision_id: decision1Id, budget: 2500000, timeline: '18 months' },
      mode: 'STANDARD',
      status: 'COMPLETED',
      current_phase: 'CONSENSUS',
      progress: 100,
      decision: { approved: true, confidence: 0.87, dissenting: ['CFO'], conditions: ['Quarterly budget reviews', 'Currency hedging required'] },
      confidence: 0.87,
      started_at: daysAgo(30),
      completed_at: daysAgo(15),
      created_at: daysAgo(30),
    },
  });
  
  // Add deliberation messages
  const agents = await prisma.agents.findMany({ take: 6 });
  const phases = ['ANALYSIS', 'DEBATE', 'SYNTHESIS', 'CONSENSUS'];
  for (const agent of agents) {
    for (const phase of phases) {
      await prisma.deliberation_messages.create({
        data: {
          id: crypto.randomUUID(),
          deliberation_id: deliberation1Id,
          agent_id: agent.id,
          phase,
          content: `[${agent.role}] ${phase} phase analysis for APAC expansion. Considering ${agent.role === 'CFO' ? 'financial risks and currency exposure' : agent.role === 'COO' ? 'operational complexity and supply chain' : agent.role === 'CMO' ? 'market positioning and brand localization' : 'strategic implications'}.`,
          confidence: 0.75 + Math.random() * 0.2,
          created_at: daysAgo(30 - phases.indexOf(phase) * 3),
        },
      });
    }
  }
  
  // Decision 2: Enterprise Pricing Model (DELIBERATING)
  const decision2Id = crypto.randomUUID();
  await prisma.decisions.create({
    data: {
      id: decision2Id,
      organization_id: organizationId,
      user_id: userId,
      title: 'Enterprise Pricing Model Revision',
      description: 'Restructure enterprise pricing tiers based on usage-based model vs. current seat-based licensing. Analysis shows potential 23% revenue uplift.',
      category: 'Revenue',
      priority: 'HIGH',
      status: 'PENDING',
      department: 'Product',
      owner_name: 'Michael Torres',
      owner_email: 'michael.torres@company.com',
      budget: 150000,
      timeframe: '6 months',
      stakeholders: ['CFO', 'VP Sales', 'VP Product', 'Customer Success'],
      created_at: daysAgo(20),
      updated_at: daysAgo(1),
    },
  });
  
  const decision2Activities = [
    { action: 'created', title: 'Decision Created', description: 'Pricing strategy review initiated by Product team', daysAgo: 20 },
    { action: 'context_added', title: 'Competitive Analysis', description: 'Benchmarking against 15 competitors completed', daysAgo: 18 },
    { action: 'context_added', title: 'Customer Survey Results', description: '500 enterprise customers surveyed on pricing preferences', daysAgo: 15 },
    { action: 'premortem_run', title: 'Pre-Mortem Analysis', description: 'Risk analysis: churn risk identified for legacy customers', daysAgo: 10 },
    { action: 'council_session', title: 'Council Deliberation In Progress', description: 'Active discussion on transition strategy and grandfathering', daysAgo: 1 },
  ];
  
  for (const activity of decision2Activities) {
    await prisma.decision_activities.create({
      data: {
        id: crypto.randomUUID(),
        decision_id: decision2Id,
        actor: 'Michael Torres',
        action: activity.action,
        details: { title: activity.title, description: activity.description },
        timestamp: daysAgo(activity.daysAgo),
      },
    });
  }
  console.log('  ✓ Decision 2: Enterprise Pricing (IN PROGRESS with 5 events)');
  
  // Decision 3: Engineering Restructure (ANALYZING)
  const decision3Id = crypto.randomUUID();
  await prisma.decisions.create({
    data: {
      id: decision3Id,
      organization_id: organizationId,
      user_id: userId,
      title: 'Engineering Team Restructure to Product Squads',
      description: 'Evaluate reorganizing 120-person engineering team from functional teams to product-aligned squads. Goal: reduce handoffs by 40% and improve velocity.',
      category: 'Organizational',
      priority: 'MEDIUM',
      status: 'DEFERRED',
      department: 'Engineering',
      owner_name: 'David Kim',
      owner_email: 'david.kim@company.com',
      budget: 75000,
      timeframe: '9 months',
      stakeholders: ['CTO', 'VP Engineering', 'CHRO', 'Product Leads'],
      created_at: daysAgo(12),
      updated_at: daysAgo(2),
    },
  });
  
  const decision3Activities = [
    { action: 'created', title: 'Decision Created', description: 'CTO proposed restructure based on Spotify model', daysAgo: 12 },
    { action: 'context_added', title: 'Current State Analysis', description: 'Mapped existing team structure and dependencies', daysAgo: 10 },
    { action: 'context_added', title: 'Industry Research', description: 'Case studies from 8 similar-sized tech companies added', daysAgo: 7 },
  ];
  
  for (const activity of decision3Activities) {
    await prisma.decision_activities.create({
      data: {
        id: crypto.randomUUID(),
        decision_id: decision3Id,
        actor: 'David Kim',
        action: activity.action,
        details: { title: activity.title, description: activity.description },
        timestamp: daysAgo(activity.daysAgo),
      },
    });
  }
  console.log('  ✓ Decision 3: Engineering Restructure (ANALYZING with 3 events)');
  
  // Decision 4: Data Center Migration (DECIDED)
  const decision4Id = crypto.randomUUID();
  await prisma.decisions.create({
    data: {
      id: decision4Id,
      organization_id: organizationId,
      user_id: userId,
      title: 'Cloud Migration - AWS to Multi-Cloud Strategy',
      description: 'Migrate from single AWS deployment to multi-cloud architecture (AWS + GCP) for redundancy and cost optimization. Projected 18% cost reduction.',
      category: 'Technology',
      priority: 'HIGH',
      status: 'APPROVED',
      department: 'IT',
      owner_name: 'Jennifer Walsh',
      owner_email: 'jennifer.walsh@company.com',
      budget: 1200000,
      timeframe: '12 months',
      stakeholders: ['CTO', 'VP Infrastructure', 'Security', 'Finance'],
      created_at: daysAgo(60),
      updated_at: daysAgo(10),
      resolved_at: daysAgo(15),
    },
  });
  
  const decision4Activities = [
    { action: 'created', title: 'Decision Created', description: 'Infrastructure team proposed multi-cloud strategy', daysAgo: 60 },
    { action: 'context_added', title: 'Cost Analysis', description: 'TCO comparison across cloud providers completed', daysAgo: 55 },
    { action: 'context_added', title: 'Security Assessment', description: 'Security team approved multi-cloud architecture', daysAgo: 50 },
    { action: 'premortem_run', title: 'Pre-Mortem Analysis', description: 'Migration risks identified: data transfer, vendor lock-in, team skills', daysAgo: 45 },
    { action: 'ghost_board', title: 'Scenario Simulation', description: 'Simulated phased vs. big-bang migration approaches', daysAgo: 40 },
    { action: 'council_session', title: 'Council Deliberation', description: 'Full council review with technical deep-dive', daysAgo: 30 },
    { action: 'decision_made', title: 'Migration Approved', description: 'Phased approach approved with 3 pilot workloads first', daysAgo: 15 },
    { action: 'outcome_recorded', title: 'Phase 1 Complete', description: 'First 3 workloads migrated successfully, 22% cost savings achieved', daysAgo: 5 },
  ];
  
  for (const activity of decision4Activities) {
    await prisma.decision_activities.create({
      data: {
        id: crypto.randomUUID(),
        decision_id: decision4Id,
        actor: 'Jennifer Walsh',
        action: activity.action,
        details: { title: activity.title, description: activity.description },
        timestamp: daysAgo(activity.daysAgo),
      },
    });
  }
  console.log('  ✓ Decision 4: Cloud Migration (DECIDED with 8 events)');
  
  // Decision 5: Vendor Contract Renewal (DECIDED)
  const decision5Id = crypto.randomUUID();
  await prisma.decisions.create({
    data: {
      id: decision5Id,
      organization_id: organizationId,
      user_id: userId,
      title: 'Salesforce Enterprise Agreement Renewal',
      description: 'Negotiate 3-year enterprise agreement renewal with Salesforce. Current spend $1.8M/year, targeting 15% reduction through consolidation.',
      category: 'Procurement',
      priority: 'HIGH',
      status: 'APPROVED',
      department: 'IT',
      owner_name: 'Robert Chen',
      owner_email: 'robert.chen@company.com',
      budget: 4860000,
      timeframe: '36 months',
      stakeholders: ['CFO', 'VP Sales', 'VP IT', 'Procurement', 'Legal'],
      created_at: daysAgo(90),
      updated_at: daysAgo(30),
      resolved_at: daysAgo(35),
    },
  });
  console.log('  ✓ Decision 5: Salesforce Renewal (DECIDED)');
  
  console.log('  ✅ Seeded 5 decisions with 27+ timeline events');
}

// =============================================================================
// ADMIN PLATFORM DATA - Tenants, Licenses, Feature Flags
// =============================================================================

async function seedAdminPlatformData() {
  console.log('🏢 Seeding Admin Platform Data...');

  // Seed Tenants
  const tenants = [
    {
      id: 'tenant_acme_2024',
      name: 'Acme Corporation',
      slug: 'acme',
      plan: 'STRATEGIC' as const,
      status: 'ACTIVE' as const,
      user_count: 145,
      user_limit: 200,
      mrr: 35000,
      billing_email: 'billing@acme.com',
      primary_contact: 'John Smith',
      industry: 'technology',
      company_size: '501-1000',
      country: 'US',
      timezone: 'America/New_York',
    },
    {
      id: 'tenant_techstart_2024',
      name: 'TechStart Inc',
      slug: 'techstart',
      plan: 'FOUNDATION' as const,
      status: 'ACTIVE' as const,
      user_count: 32,
      user_limit: 50,
      mrr: 7500,
      billing_email: 'billing@techstart.io',
      primary_contact: 'Sarah Chen',
      industry: 'software',
      company_size: '51-200',
      country: 'US',
      timezone: 'America/Los_Angeles',
    },
    {
      id: 'tenant_globalco_2024',
      name: 'GlobalCo',
      slug: 'globalco',
      plan: 'ENTERPRISE' as const,
      status: 'ACTIVE' as const,
      user_count: 89,
      user_limit: 100,
      mrr: 15000,
      billing_email: 'accounts@globalco.com',
      primary_contact: 'James Wilson',
      industry: 'finance',
      company_size: '1001-5000',
      country: 'UK',
      timezone: 'Europe/London',
    },
    {
      id: 'tenant_healthtech_2024',
      name: 'HealthTech Labs',
      slug: 'healthtech',
      plan: 'TRIAL' as const,
      status: 'TRIAL' as const,
      user_count: 12,
      user_limit: 25,
      mrr: 0,
      billing_email: 'emily@healthtechlabs.com',
      primary_contact: 'Dr. Emily Davis',
      industry: 'healthcare',
      company_size: '11-50',
      country: 'US',
      timezone: 'America/Chicago',
      trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'tenant_financefirst_2024',
      name: 'FinanceFirst',
      slug: 'financefirst',
      plan: 'FOUNDATION' as const,
      status: 'ACTIVE' as const,
      user_count: 54,
      user_limit: 75,
      mrr: 7500,
      billing_email: 'ap@financefirst.com',
      primary_contact: 'Mike Thompson',
      industry: 'financial_services',
      company_size: '201-500',
      country: 'US',
      timezone: 'America/New_York',
    },
  ];

  for (const tenant of tenants) {
    await prisma.tenants.upsert({
      where: { slug: tenant.slug },
      update: tenant,
      create: tenant,
    });
  }
  console.log(`  ✓ Seeded ${tenants.length} tenants`);

  // Seed Licenses
  const licenses = [
    {
      id: 'lic_acme_001',
      tenant_id: 'tenant_acme_2024',
      license_key: 'DC-SOV-ACME2024-XYZW1234',
      type: 'STRATEGIC' as const,
      status: 'ACTIVE' as const,
      seats: 200,
      seats_used: 145,
      billing_cycle: 'ANNUAL' as const,
      revenue: 420000,
      start_date: new Date('2024-01-15'),
      expires_at: new Date('2025-12-31'),
      auto_renew: true,
      renewal_price: 420000,
    },
    {
      id: 'lic_techstart_001',
      tenant_id: 'tenant_techstart_2024',
      license_key: 'DC-PRO-TECH2024-ABCD5678',
      type: 'FOUNDATION' as const,
      status: 'ACTIVE' as const,
      seats: 50,
      seats_used: 32,
      billing_cycle: 'ANNUAL' as const,
      revenue: 90000,
      start_date: new Date('2024-02-03'),
      expires_at: new Date('2026-01-15'),
      auto_renew: true,
      renewal_price: 90000,
    },
    {
      id: 'lic_globalco_001',
      tenant_id: 'tenant_globalco_2024',
      license_key: 'DC-ENT-GLOB2024-QRST9012',
      type: 'ENTERPRISE' as const,
      status: 'EXPIRING' as const,
      seats: 100,
      seats_used: 89,
      billing_cycle: 'ANNUAL' as const,
      revenue: 180000,
      start_date: new Date('2024-03-22'),
      expires_at: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      auto_renew: false,
      renewal_price: 180000,
      notes: 'Customer reviewing renewal options',
    },
    {
      id: 'lic_healthtech_001',
      tenant_id: 'tenant_healthtech_2024',
      license_key: 'DC-TRL-HLTH2024-UVWX3456',
      type: 'TRIAL' as const,
      status: 'ACTIVE' as const,
      seats: 25,
      seats_used: 12,
      billing_cycle: 'ANNUAL' as const,
      revenue: 0,
      start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      auto_renew: false,
    },
    {
      id: 'lic_financefirst_001',
      tenant_id: 'tenant_financefirst_2024',
      license_key: 'DC-PRO-FINF2024-MNOP7890',
      type: 'FOUNDATION' as const,
      status: 'ACTIVE' as const,
      seats: 75,
      seats_used: 54,
      billing_cycle: 'ANNUAL' as const,
      revenue: 90000,
      start_date: new Date('2024-04-08'),
      expires_at: new Date('2025-04-08'),
      auto_renew: true,
      renewal_price: 90000,
    },
  ];

  for (const license of licenses) {
    await prisma.licenses.upsert({
      where: { license_key: license.license_key },
      update: license,
      create: license,
    });
  }
  console.log(`  ✓ Seeded ${licenses.length} licenses`);

  // Seed Feature Flags
  const featureFlags = [
    { key: 'council_ai', name: 'Council AI', description: 'AI Executive Council deliberation', enabled: true, category: 'core' },
    { key: 'enterprise_suite', name: 'Enterprise Suite', description: 'Full enterprise features', enabled: true, category: 'enterprise' },
    { key: 'sovereign_deployment', name: 'Sovereign Deployment', description: 'On-premise sovereign deployment', enabled: true, category: 'sovereign' },
    { key: 'advanced_analytics', name: 'Advanced Analytics', description: 'Advanced analytics and reporting', enabled: true, category: 'analytics' },
    { key: 'api_access', name: 'API Access', description: 'REST API access', enabled: true, category: 'integration' },
    { key: 'sso_integration', name: 'SSO Integration', description: 'Single sign-on via SAML/OIDC', enabled: true, category: 'security' },
    { key: 'audit_logging', name: 'Audit Logging', description: 'Comprehensive audit trail', enabled: true, category: 'compliance' },
    { key: 'custom_branding', name: 'Custom Branding', description: 'White-label branding options', enabled: true, category: 'enterprise' },
    { key: 'beta_features', name: 'Beta Features', description: 'Early access to beta features', enabled: false, category: 'beta', rollout_percentage: 10 },
    { key: 'new_dashboard', name: 'New Dashboard', description: 'Redesigned dashboard experience', enabled: false, category: 'beta', rollout_percentage: 25 },
  ];

  for (const flag of featureFlags) {
    await prisma.feature_flags.upsert({
      where: { key: flag.key },
      update: flag,
      create: { ...flag, type: 'BOOLEAN' as const },
    });
  }
  console.log(`  ✓ Seeded ${featureFlags.length} feature flags`);

  // Seed some usage data
  const currentPeriod = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 7);

  const usageData = [
    { tenant_id: 'tenant_acme_2024', period: currentPeriod, api_calls: 125000, deliberations: 450, active_users: 142, storage_used_mb: 45000, agent_invocations: 2800 },
    { tenant_id: 'tenant_acme_2024', period: lastMonth, api_calls: 118000, deliberations: 420, active_users: 138, storage_used_mb: 42000, agent_invocations: 2650 },
    { tenant_id: 'tenant_techstart_2024', period: currentPeriod, api_calls: 28000, deliberations: 85, active_users: 30, storage_used_mb: 8500, agent_invocations: 540 },
    { tenant_id: 'tenant_globalco_2024', period: currentPeriod, api_calls: 65000, deliberations: 180, active_users: 85, storage_used_mb: 22000, agent_invocations: 1200 },
    { tenant_id: 'tenant_healthtech_2024', period: currentPeriod, api_calls: 5200, deliberations: 15, active_users: 10, storage_used_mb: 1200, agent_invocations: 95 },
    { tenant_id: 'tenant_financefirst_2024', period: currentPeriod, api_calls: 42000, deliberations: 120, active_users: 52, storage_used_mb: 15000, agent_invocations: 780 },
  ];

  for (const usage of usageData) {
    await prisma.tenant_usage.upsert({
      where: { tenant_id_period: { tenant_id: usage.tenant_id, period: usage.period } },
      update: usage,
      create: usage,
    });
  }
  console.log(`  ✓ Seeded ${usageData.length} usage records`);

  console.log('  ✅ Admin platform data seeded successfully');
}

// =============================================================================
// MAIN SEED FUNCTION
// =============================================================================

async function main() {
  console.log('🌱 Starting Datacendia Database Seed...\n');
  
  try {
    // Seed agents first (no dependencies)
    await seedAgents();
    console.log('');
    
    // Seed organization and admin
    const { org, admin } = await seedDefaultOrganization();
    console.log('');
    
    // Seed admin platform data (tenants, licenses, feature flags)
    await seedAdminPlatformData();
    console.log('');
    
    // Seed health scores
    await seedHealthScores(org.id);
    console.log('');
    
    // Seed metrics
    await seedMetrics(org.id, admin.id);
    console.log('');
    
    // Seed workflows
    await seedWorkflows(org.id);
    console.log('');
    
    // Seed data sources
    await seedDataSources(org.id);
    console.log('');
    
    // Seed lineage data
    await seedLineage(org.id);
    console.log('');
    
    // Seed prediction models
    await seedPredictions(org.id);
    console.log('');
    
    // Seed security data
    await seedSecurityData(org.id);
    console.log('');
    
    // Seed ethics data
    await seedEthicsData(org.id);
    console.log('');
    
    // Seed decisions and deliberations for demo
    await seedDecisionsAndDeliberations(org.id, admin.id);
    console.log('');
    
    console.log('✅ Database seeding completed successfully!\n');
    console.log('📋 Default Credentials:');
    console.log('   Email: admin@datacendia.com');
    console.log('   Password: DatacendiaAdmin2024!');
    console.log('');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
