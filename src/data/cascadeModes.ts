// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CASCADE MODES - Butterfly Effect Analysis Contexts
// Different lenses for analyzing organizational change consequences
// =============================================================================

export interface CascadeMode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  primeDirective: string;
  description: string;
  shortDesc: string;
  useCases: string[];
  focusAreas: string[]; // What categories to prioritize in analysis
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  timeHorizon: 'short' | 'medium' | 'long'; // How far to project consequences
  analysisDepth: number; // 1-5, how many orders of consequence to explore
  defaultConstraints: string[]; // Auto-added no-go lines
  isCore?: boolean;
  // Field tooltips - contextual help for each form field based on mode
  fieldTooltips: {
    title: string;
    description: string;
    affectedAssets: string;
    expectedBenefit: string;
    constraints: string;
  };
  // Placeholder examples for each field
  placeholders: {
    title: string;
    description: string;
    expectedBenefit: string;
  };
}

export const CASCADE_MODE_CATEGORIES = {
  'Risk Assessment': ['due-diligence', 'compliance-check', 'security-audit'],
  'Strategic Planning': ['m-and-a', 'market-expansion', 'transformation'],
  'Operations': ['cost-reduction', 'restructuring', 'vendor-change'],
  'Crisis': ['damage-control', 'rapid-response'],
} as const;

export const CORE_CASCADE_MODES = [
  'due-diligence',
  'cost-reduction', 
  'transformation',
  'compliance-check',
  'rapid-response',
] as const;

export const CASCADE_MODES: Record<string, CascadeMode> = {
  'due-diligence': {
    id: 'due-diligence',
    name: 'Due Diligence',
    emoji: '🔍',
    color: '#3B82F6',
    primeDirective: 'Surface Every Hidden Risk',
    description: 'Thorough analysis for M&A, major investments, or partnerships. Explores deep consequence chains and hidden dependencies.',
    shortDesc: 'M&A & investment analysis',
    useCases: [
      'Acquiring a company',
      'Major vendor selection',
      'Strategic partnership evaluation',
      'Large capital investment',
    ],
    focusAreas: ['financial', 'compliance', 'operational', 'reputational'],
    riskTolerance: 'conservative',
    timeHorizon: 'long',
    analysisDepth: 5,
    defaultConstraints: [
      'No regulatory violations',
      'No material misstatements',
      'Preserve audit trail',
    ],
    isCore: true,
    fieldTooltips: {
      title: 'Name the acquisition, investment, or partnership being evaluated. Be specific about the target entity or asset.',
      description: 'Detail the transaction structure, valuation basis, strategic rationale, and any known risks or concerns from initial screening.',
      affectedAssets: 'Select all business units, systems, contracts, and relationships that would be impacted by this transaction.',
      expectedBenefit: 'Quantify the expected synergies, cost savings, revenue growth, or strategic value. Include timeline to realize benefits.',
      constraints: 'Define deal-breakers: regulatory red lines, valuation caps, integration non-negotiables, or cultural requirements.',
    },
    placeholders: {
      title: 'e.g., Acquire TechStartup Inc. for $50M',
      description: 'e.g., All-cash acquisition of AI startup. 40 employees, $8M ARR, key patents in NLP...',
      expectedBenefit: 'e.g., Add $15M ARR within 18 months, acquire 3 key patents, hire 12 ML engineers',
    },
  },

  'cost-reduction': {
    id: 'cost-reduction',
    name: 'Cost Reduction',
    emoji: '✂️',
    color: '#EF4444',
    primeDirective: 'Cut Fat, Not Muscle',
    description: 'Analyze layoffs, budget cuts, and efficiency programs. Surfaces morale impacts, knowledge loss, and operational risks.',
    shortDesc: 'Layoffs & budget cuts',
    useCases: [
      'Headcount reduction',
      'Budget cuts',
      'Office consolidation',
      'Benefit reduction',
      'Contractor termination',
    ],
    focusAreas: ['human', 'operational', 'financial', 'reputational'],
    riskTolerance: 'conservative',
    timeHorizon: 'medium',
    analysisDepth: 4,
    defaultConstraints: [
      'Cannot lose critical knowledge holders',
      'Must maintain production stability',
      'Cannot violate employment law',
    ],
    isCore: true,
    fieldTooltips: {
      title: 'Specify the cost reduction action: layoffs, budget cuts, consolidation. Include target savings amount or percentage.',
      description: 'Detail which roles/departments are affected, the selection criteria, timeline, and any severance or transition support planned.',
      affectedAssets: 'Select teams, systems, and processes that will be directly impacted. Include downstream dependencies.',
      expectedBenefit: 'Quantify annual savings, one-time costs (severance), and payback period. Be realistic about ramp-down time.',
      constraints: 'Define protected roles, minimum staffing levels, knowledge transfer requirements, and legal/PR boundaries.',
    },
    placeholders: {
      title: 'e.g., Reduce engineering headcount by 15%',
      description: 'e.g., Eliminate 45 positions across 3 teams. Targeting senior roles first for max savings. 60-day notice...',
      expectedBenefit: 'e.g., Save $4.2M annually after $800K severance costs. Break-even in 3 months.',
    },
  },

  'transformation': {
    id: 'transformation',
    name: 'Digital Transformation',
    emoji: '🚀',
    color: '#8B5CF6',
    primeDirective: 'Change Without Breaking',
    description: 'Major technology or process changes. Balances innovation speed against operational stability.',
    shortDesc: 'Tech & process overhauls',
    useCases: ['Cloud migration', 'ERP replacement', 'Process automation', 'Platform modernization', 'AI/ML adoption'],
    focusAreas: ['operational', 'security', 'human', 'strategic'],
    riskTolerance: 'balanced',
    timeHorizon: 'long',
    analysisDepth: 4,
    defaultConstraints: ['Zero unplanned downtime', 'No data loss', 'Maintain security posture'],
    isCore: true,
    fieldTooltips: {
      title: 'Name the transformation initiative. Include the technology or process being changed and the target state.',
      description: 'Detail the current state, target state, migration approach (big bang vs phased), and key milestones.',
      affectedAssets: 'Select all systems, teams, and processes that will be touched. Include integrations and dependencies.',
      expectedBenefit: 'Quantify efficiency gains, cost savings, capability improvements. Include timeline to value realization.',
      constraints: 'Define uptime requirements, data integrity rules, security baselines, and change freeze periods.',
    },
    placeholders: {
      title: 'e.g., Migrate from on-prem to AWS cloud',
      description: 'e.g., Move 47 applications to AWS over 18 months. Phase 1: Dev/test environments. Phase 2: Non-critical prod...',
      expectedBenefit: 'e.g., Reduce infrastructure costs 40%, improve deployment speed 10x, enable auto-scaling',
    },
  },

  'compliance-check': {
    id: 'compliance-check',
    name: 'Compliance Check',
    emoji: '⚖️',
    color: '#10B981',
    primeDirective: 'Letter and Spirit of the Law',
    description: 'Regulatory impact analysis. Surfaces compliance gaps, audit risks, and regulatory consequences.',
    shortDesc: 'Regulatory impact',
    useCases: ['New regulation response', 'Policy change', 'Geographic expansion', 'Product launch compliance', 'Audit preparation'],
    focusAreas: ['compliance', 'financial', 'reputational', 'operational'],
    riskTolerance: 'conservative',
    timeHorizon: 'long',
    analysisDepth: 5,
    defaultConstraints: ['No regulatory violations', 'Maintain audit readiness', 'Document all decisions'],
    isCore: true,
    fieldTooltips: {
      title: 'Name the regulatory change or compliance initiative. Reference specific regulations (GDPR, SOX, HIPAA, etc.).',
      description: 'Detail the regulatory requirement, current compliance status, gap analysis, and remediation approach.',
      affectedAssets: 'Select all data flows, systems, processes, and third parties subject to the regulation.',
      expectedBenefit: 'Describe compliance outcomes: audit readiness, risk reduction, market access, penalty avoidance.',
      constraints: 'Define compliance deadlines, audit schedules, documentation requirements, and approval chains.',
    },
    placeholders: {
      title: 'e.g., GDPR compliance for new EU customer data',
      description: 'e.g., Implement data subject rights, consent management, and cross-border transfer controls for EU expansion...',
      expectedBenefit: 'e.g., Enable EU market entry ($5M opportunity), avoid €20M potential fines, pass SOC 2 audit',
    },
  },

  'rapid-response': {
    id: 'rapid-response',
    name: 'Rapid Response',
    emoji: '⚡',
    color: '#F59E0B',
    primeDirective: 'Speed Over Perfection',
    description: 'Quick analysis for time-sensitive decisions. Focuses on immediate and short-term consequences only.',
    shortDesc: 'Fast decisions',
    useCases: ['Competitive response', 'Crisis containment', 'Urgent opportunity', 'Emergency change'],
    focusAreas: ['operational', 'financial', 'reputational'],
    riskTolerance: 'aggressive',
    timeHorizon: 'short',
    analysisDepth: 2,
    defaultConstraints: ['No irreversible actions without approval'],
    isCore: true,
    fieldTooltips: {
      title: 'What needs to happen RIGHT NOW? Be specific about the action and deadline.',
      description: 'Brief context only. What triggered this? What happens if we don\'t act? Skip the backstory.',
      affectedAssets: 'Select only the immediately impacted assets. Don\'t worry about distant dependencies.',
      expectedBenefit: 'What do we gain by acting fast? What do we lose by waiting?',
      constraints: 'What absolutely cannot happen? Focus on irreversible damage only.',
    },
    placeholders: {
      title: 'e.g., Counter competitor price drop by EOD',
      description: 'e.g., Competitor announced 30% price cut this morning. Sales team losing deals. Need response today.',
      expectedBenefit: 'e.g., Retain 3 deals in pipeline worth $400K, maintain market position',
    },
  },

  'm-and-a': {
    id: 'm-and-a',
    name: 'M&A Analysis',
    emoji: '🤝',
    color: '#6366F1',
    primeDirective: 'Integration is the Real Deal',
    description: 'Merger and acquisition consequence analysis. Deep focus on integration risks and synergy realization.',
    shortDesc: 'Merger integration',
    useCases: ['Acquisition integration planning', 'Merger synergy analysis', 'Divestiture impact', 'Carve-out planning'],
    focusAreas: ['strategic', 'human', 'operational', 'financial'],
    riskTolerance: 'conservative',
    timeHorizon: 'long',
    analysisDepth: 5,
    defaultConstraints: ['Preserve key talent', 'Maintain customer relationships', 'Realize stated synergies'],
    fieldTooltips: {
      title: 'Name the M&A transaction and integration phase being analyzed.',
      description: 'Detail the integration approach: Day 1 requirements, 100-day plan, synergy targets, and cultural integration strategy.',
      affectedAssets: 'Select all entities being merged: teams, systems, contracts, customers, and vendor relationships.',
      expectedBenefit: 'Quantify synergies: cost savings, revenue growth, capability gains. Include realization timeline.',
      constraints: 'Define integration non-negotiables: key person retention, customer SLAs, regulatory approvals.',
    },
    placeholders: {
      title: 'e.g., Integrate AcquiredCo sales team into existing structure',
      description: 'e.g., Merge 50-person sales team. Eliminate duplicate territories. Retain top 10 performers. 90-day timeline...',
      expectedBenefit: 'e.g., $3M cost synergy from headcount, $8M revenue synergy from cross-sell',
    },
  },

  'market-expansion': {
    id: 'market-expansion',
    name: 'Market Expansion',
    emoji: '🌍',
    color: '#06B6D4',
    primeDirective: 'Grow Without Overextending',
    description: 'New market entry analysis. Surfaces competitive, regulatory, and operational risks of expansion.',
    shortDesc: 'New market entry',
    useCases: ['Geographic expansion', 'New vertical entry', 'New customer segment', 'Channel expansion'],
    focusAreas: ['strategic', 'compliance', 'operational', 'financial'],
    riskTolerance: 'balanced',
    timeHorizon: 'long',
    analysisDepth: 4,
    defaultConstraints: ['Comply with local regulations', 'Maintain brand consistency'],
    fieldTooltips: {
      title: 'Name the market, geography, or segment you\'re entering.',
      description: 'Detail the market opportunity, competitive landscape, go-to-market strategy, and resource requirements.',
      affectedAssets: 'Select teams, products, and systems that will support the expansion.',
      expectedBenefit: 'Quantify the market opportunity: TAM, expected market share, revenue timeline, strategic value.',
      constraints: 'Define market entry requirements: regulatory, localization, partnership, or investment thresholds.',
    },
    placeholders: {
      title: 'e.g., Launch enterprise product in APAC region',
      description: 'e.g., Enter Japan, Singapore, Australia markets. Local sales team, translated product, regional data centers...',
      expectedBenefit: 'e.g., $12M ARR opportunity in Year 2, strategic foothold in fastest-growing region',
    },
  },

  'restructuring': {
    id: 'restructuring',
    name: 'Restructuring',
    emoji: '🏗️',
    color: '#EC4899',
    primeDirective: 'Rebuild Stronger',
    description: 'Organizational restructuring analysis. Maps reporting changes, role eliminations, and cultural impacts.',
    shortDesc: 'Org changes',
    useCases: ['Org chart changes', 'Department merger', 'Leadership change', 'Matrix to functional shift'],
    focusAreas: ['human', 'operational', 'strategic'],
    riskTolerance: 'balanced',
    timeHorizon: 'medium',
    analysisDepth: 4,
    defaultConstraints: ['Maintain clear accountability', 'Preserve institutional knowledge'],
    fieldTooltips: {
      title: 'Name the organizational change: reorg, merger, new structure, leadership transition.',
      description: 'Detail the current structure, target structure, rationale, and transition plan.',
      affectedAssets: 'Select all teams, roles, and reporting relationships that will change.',
      expectedBenefit: 'Describe the organizational outcomes: efficiency, clarity, capability, or cultural improvements.',
      constraints: 'Define change management requirements: communication timeline, retention targets, transition support.',
    },
    placeholders: {
      title: 'e.g., Merge Product and Engineering under single CTO',
      description: 'e.g., Combine 3 product teams and 5 engineering teams under unified leadership. Eliminate VP layer...',
      expectedBenefit: 'e.g., Faster decision-making, eliminate 2 VP roles ($600K), improve product-eng alignment',
    },
  },

  'vendor-change': {
    id: 'vendor-change',
    name: 'Vendor Change',
    emoji: '🔄',
    color: '#14B8A6',
    primeDirective: 'Transition Without Disruption',
    description: 'Vendor switch or termination analysis. Surfaces dependency risks, transition costs, and operational impacts.',
    shortDesc: 'Supplier changes',
    useCases: ['Vendor replacement', 'Insourcing decision', 'Contract renegotiation', 'Multi-vendor strategy'],
    focusAreas: ['operational', 'financial', 'security', 'compliance'],
    riskTolerance: 'conservative',
    timeHorizon: 'medium',
    analysisDepth: 3,
    defaultConstraints: ['No service interruption', 'Maintain data security', 'Honor contractual obligations'],
    fieldTooltips: {
      title: 'Name the vendor change: which vendor, what service, replacement or termination.',
      description: 'Detail the current vendor relationship, reason for change, replacement vendor (if any), and transition plan.',
      affectedAssets: 'Select all systems, processes, and teams that depend on this vendor.',
      expectedBenefit: 'Quantify the benefit: cost savings, capability improvement, risk reduction, or strategic alignment.',
      constraints: 'Define transition requirements: notice periods, data migration, SLA continuity, contractual obligations.',
    },
    placeholders: {
      title: 'e.g., Switch from Salesforce to HubSpot CRM',
      description: 'e.g., Migrate 50K contacts, 3 years of history, 15 integrations. 6-month parallel run. Training for 80 users...',
      expectedBenefit: 'e.g., Save $200K/year in licensing, better fit for SMB sales motion',
    },
  },

  'security-audit': {
    id: 'security-audit',
    name: 'Security Audit',
    emoji: '🛡️',
    color: '#DC2626',
    primeDirective: 'Assume Breach',
    description: 'Security-focused change analysis. Surfaces attack vectors, compliance gaps, and incident response impacts.',
    shortDesc: 'Security changes',
    useCases: ['Security policy change', 'Access control modification', 'Infrastructure change', 'Third-party integration'],
    focusAreas: ['security', 'compliance', 'operational'],
    riskTolerance: 'conservative',
    timeHorizon: 'medium',
    analysisDepth: 4,
    defaultConstraints: ['No security regression', 'Maintain compliance certifications', 'Preserve audit logs'],
    fieldTooltips: {
      title: 'Name the security change: policy update, access change, new integration, or infrastructure modification.',
      description: 'Detail the security context: threat model, current controls, proposed changes, and risk assessment.',
      affectedAssets: 'Select all systems, data stores, and access points affected by this change.',
      expectedBenefit: 'Describe security outcomes: risk reduction, compliance improvement, or operational efficiency.',
      constraints: 'Define security requirements: encryption standards, access controls, audit requirements, incident response.',
    },
    placeholders: {
      title: 'e.g., Implement zero-trust network access',
      description: 'e.g., Replace VPN with ZTNA. Enforce device posture checks. Implement microsegmentation for prod systems...',
      expectedBenefit: 'e.g., Reduce attack surface 60%, enable secure remote work, pass SOC 2 Type II',
    },
  },

  'damage-control': {
    id: 'damage-control',
    name: 'Damage Control',
    emoji: '🚨',
    color: '#B91C1C',
    primeDirective: 'Contain Then Communicate',
    description: 'Crisis response analysis. Focuses on immediate containment and reputational protection.',
    shortDesc: 'Crisis response',
    useCases: ['PR crisis response', 'Data breach response', 'Product recall', 'Executive departure'],
    focusAreas: ['reputational', 'operational', 'compliance', 'financial'],
    riskTolerance: 'aggressive',
    timeHorizon: 'short',
    analysisDepth: 3,
    defaultConstraints: ['Prioritize stakeholder safety', 'Preserve evidence', 'Maintain transparency'],
    fieldTooltips: {
      title: 'Name the crisis: what happened, when, and current status.',
      description: 'Detail the incident: what we know, what we don\'t know, who\'s affected, and current containment status.',
      affectedAssets: 'Select all impacted stakeholders: customers, employees, partners, regulators, media.',
      expectedBenefit: 'Define success: containment metrics, reputation recovery, legal protection, operational restoration.',
      constraints: 'Define crisis boundaries: legal holds, communication approvals, regulatory notifications, evidence preservation.',
    },
    placeholders: {
      title: 'e.g., Customer data exposed in security breach',
      description: 'e.g., 10K customer records exposed via misconfigured S3 bucket. Discovered 2 hours ago. No evidence of exfiltration yet...',
      expectedBenefit: 'e.g., Contain breach within 24 hours, notify affected customers, avoid regulatory action',
    },
  },

  'pricing-change': {
    id: 'pricing-change',
    name: 'Pricing Change',
    emoji: '💰',
    color: '#CA8A04',
    primeDirective: 'Value Over Volume',
    description: 'Price adjustment analysis. Surfaces customer churn risks, competitive responses, and revenue impacts.',
    shortDesc: 'Price adjustments',
    useCases: ['Price increase', 'Discount policy change', 'Packaging restructure', 'Free tier elimination'],
    focusAreas: ['financial', 'reputational', 'strategic'],
    riskTolerance: 'balanced',
    timeHorizon: 'medium',
    analysisDepth: 4,
    defaultConstraints: ['Honor existing contracts', 'Communicate transparently'],
    fieldTooltips: {
      title: 'Name the pricing change: what\'s changing, by how much, for which customers.',
      description: 'Detail the pricing strategy: current pricing, new pricing, rationale, grandfathering policy, and rollout plan.',
      affectedAssets: 'Select customer segments, products, and sales processes affected by the change.',
      expectedBenefit: 'Quantify revenue impact: price realization, volume impact, net revenue change, margin improvement.',
      constraints: 'Define pricing boundaries: contract obligations, competitive positioning, customer communication requirements.',
    },
    placeholders: {
      title: 'e.g., Increase enterprise tier pricing by 20%',
      description: 'e.g., Raise enterprise from $500 to $600/seat. Grandfather existing contracts for 12 months. New customers immediately...',
      expectedBenefit: 'e.g., $2M ARR increase, 15% margin improvement, fund product investment',
    },
  },

  'policy-change': {
    id: 'policy-change',
    name: 'Policy Change',
    emoji: '📋',
    color: '#7C3AED',
    primeDirective: 'Rules Shape Culture',
    description: 'Internal policy change analysis. Surfaces employee reactions, compliance impacts, and cultural shifts.',
    shortDesc: 'Internal policies',
    useCases: ['Remote work policy', 'Expense policy', 'Hiring freeze', 'Performance review changes'],
    focusAreas: ['human', 'operational', 'compliance'],
    riskTolerance: 'balanced',
    timeHorizon: 'medium',
    analysisDepth: 3,
    defaultConstraints: ['Cannot violate employment law', 'Must communicate clearly'],
    fieldTooltips: {
      title: 'Name the policy change: what policy, what\'s changing, effective date.',
      description: 'Detail the current policy, new policy, rationale for change, and implementation approach.',
      affectedAssets: 'Select all employee groups, processes, and systems affected by the policy.',
      expectedBenefit: 'Describe policy outcomes: cost savings, productivity, compliance, or cultural improvements.',
      constraints: 'Define policy requirements: legal compliance, union considerations, communication timeline, exceptions process.',
    },
    placeholders: {
      title: 'e.g., Mandate 3 days/week in-office for all employees',
      description: 'e.g., End full remote work. Require Tue/Wed/Thu in office. Exceptions for medical/caregiving. Effective Q2...',
      expectedBenefit: 'e.g., Improve collaboration, reduce real estate footprint 30%, strengthen culture',
    },
  },
};

// Helper functions
export const isCoreMode = (modeId: string): boolean => 
  CORE_CASCADE_MODES.includes(modeId as any);

export const getModesByCategory = (category: keyof typeof CASCADE_MODE_CATEGORIES): CascadeMode[] =>
  CASCADE_MODE_CATEGORIES[category].map(id => CASCADE_MODES[id]).filter(Boolean);

export const getCoreModes = (): CascadeMode[] =>
  CORE_CASCADE_MODES.map(id => CASCADE_MODES[id]);

export const getModeForChangeType = (changeType: string): string => {
  const mapping: Record<string, string> = {
    staffing: 'cost-reduction',
    pricing: 'pricing-change',
    vendor: 'vendor-change',
    technology: 'transformation',
    process: 'transformation',
    product: 'market-expansion',
    market: 'market-expansion',
    regulatory: 'compliance-check',
    security: 'security-audit',
    policy: 'policy-change',
    data: 'security-audit',
  };
  return mapping[changeType] || 'due-diligence';
};
