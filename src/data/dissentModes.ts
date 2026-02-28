// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DISSENT MODES - Anonymity & Escalation Levels
// Different modes for protected dissent and whistleblowing
// Includes industry-specific sensitivity and retaliation risk profiles
// =============================================================================

// Industry sensitivity profiles for dissent handling
export interface IndustrySensitivityProfile {
  id: string;
  name: string;
  // Retaliation risk factors
  retaliationRisk: 'low' | 'medium' | 'high' | 'extreme';
  unionPresence: 'none' | 'low' | 'moderate' | 'strong';
  whistleblowerProtections: 'weak' | 'moderate' | 'strong' | 'robust';
  // Regulatory context
  regulatoryOversight: 'minimal' | 'moderate' | 'heavy' | 'extreme';
  mandatoryReporting: string[]; // What must be reported by law
  // Cultural factors
  hierarchyRigidity: 'flat' | 'moderate' | 'hierarchical' | 'rigid';
  speakUpCulture: 'open' | 'cautious' | 'guarded' | 'suppressed';
  // Historical data
  avgResolutionDays: number;
  retaliationIncidenceRate: number; // 0-1
  // Escalation paths
  externalChannels: string[]; // Regulatory bodies, ombudsmen, etc.
}

export const INDUSTRY_SENSITIVITY_PROFILES: Record<string, IndustrySensitivityProfile> = {
  'financial-services': {
    id: 'financial-services',
    name: 'Financial Services',
    retaliationRisk: 'high',
    unionPresence: 'low',
    whistleblowerProtections: 'strong',
    regulatoryOversight: 'extreme',
    mandatoryReporting: ['Fraud', 'Money laundering', 'Market manipulation', 'Sanctions violations'],
    hierarchyRigidity: 'hierarchical',
    speakUpCulture: 'cautious',
    avgResolutionDays: 90,
    retaliationIncidenceRate: 0.35,
    externalChannels: ['SEC', 'FINRA', 'OCC', 'CFPB', 'State AG'],
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    retaliationRisk: 'high',
    unionPresence: 'moderate',
    whistleblowerProtections: 'strong',
    regulatoryOversight: 'heavy',
    mandatoryReporting: ['Patient safety', 'HIPAA violations', 'Medicare fraud', 'Clinical misconduct'],
    hierarchyRigidity: 'rigid',
    speakUpCulture: 'guarded',
    avgResolutionDays: 120,
    retaliationIncidenceRate: 0.4,
    externalChannels: ['HHS OIG', 'State Medical Board', 'CMS', 'Joint Commission'],
  },
  'technology': {
    id: 'technology',
    name: 'Technology / SaaS',
    retaliationRisk: 'medium',
    unionPresence: 'none',
    whistleblowerProtections: 'moderate',
    regulatoryOversight: 'moderate',
    mandatoryReporting: ['Data breaches', 'Privacy violations', 'Securities fraud'],
    hierarchyRigidity: 'flat',
    speakUpCulture: 'open',
    avgResolutionDays: 45,
    retaliationIncidenceRate: 0.2,
    externalChannels: ['FTC', 'State AG', 'SEC', 'Data Protection Authorities'],
  },
  'government': {
    id: 'government',
    name: 'Government / Public Sector',
    retaliationRisk: 'extreme',
    unionPresence: 'strong',
    whistleblowerProtections: 'robust',
    regulatoryOversight: 'extreme',
    mandatoryReporting: ['Waste/fraud/abuse', 'Security violations', 'Ethics violations', 'Gross mismanagement'],
    hierarchyRigidity: 'rigid',
    speakUpCulture: 'suppressed',
    avgResolutionDays: 180,
    retaliationIncidenceRate: 0.5,
    externalChannels: ['OIG', 'OSC', 'GAO', 'Congress', 'MSPB'],
  },
  'manufacturing': {
    id: 'manufacturing',
    name: 'Manufacturing / Industrial',
    retaliationRisk: 'medium',
    unionPresence: 'moderate',
    whistleblowerProtections: 'moderate',
    regulatoryOversight: 'moderate',
    mandatoryReporting: ['Safety violations', 'Environmental hazards', 'Product defects', 'OSHA violations'],
    hierarchyRigidity: 'hierarchical',
    speakUpCulture: 'cautious',
    avgResolutionDays: 60,
    retaliationIncidenceRate: 0.3,
    externalChannels: ['OSHA', 'EPA', 'NHTSA', 'State Labor Board'],
  },
  'energy': {
    id: 'energy',
    name: 'Energy / Utilities',
    retaliationRisk: 'high',
    unionPresence: 'strong',
    whistleblowerProtections: 'strong',
    regulatoryOversight: 'heavy',
    mandatoryReporting: ['Safety violations', 'Environmental incidents', 'Nuclear safety', 'Grid reliability'],
    hierarchyRigidity: 'hierarchical',
    speakUpCulture: 'guarded',
    avgResolutionDays: 90,
    retaliationIncidenceRate: 0.35,
    externalChannels: ['NRC', 'FERC', 'EPA', 'State PUC', 'DOE'],
  },
  'legal': {
    id: 'legal',
    name: 'Legal / Professional Services',
    retaliationRisk: 'high',
    unionPresence: 'none',
    whistleblowerProtections: 'moderate',
    regulatoryOversight: 'moderate',
    mandatoryReporting: ['Client fund misuse', 'Ethics violations', 'Conflicts of interest'],
    hierarchyRigidity: 'hierarchical',
    speakUpCulture: 'guarded',
    avgResolutionDays: 75,
    retaliationIncidenceRate: 0.4,
    externalChannels: ['State Bar', 'SEC', 'DOJ', 'State AG'],
  },
  'general': {
    id: 'general',
    name: 'General / Cross-Industry',
    retaliationRisk: 'medium',
    unionPresence: 'low',
    whistleblowerProtections: 'moderate',
    regulatoryOversight: 'moderate',
    mandatoryReporting: ['Fraud', 'Safety violations', 'Discrimination', 'Harassment'],
    hierarchyRigidity: 'moderate',
    speakUpCulture: 'cautious',
    avgResolutionDays: 60,
    retaliationIncidenceRate: 0.3,
    externalChannels: ['EEOC', 'OSHA', 'State Labor Board', 'DOL'],
  },
};

export interface DissentMode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  primeDirective: string;
  description: string;
  shortDesc: string;
  useCases: string[];
  // Anonymity parameters
  anonymityLevel: 'identified' | 'confidential' | 'anonymous' | 'cryptographic';
  identityProtection: 'none' | 'limited' | 'strong' | 'absolute';
  traceability: 'full' | 'limited' | 'minimal' | 'none';
  // Escalation parameters
  escalationPath: 'internal-only' | 'internal-first' | 'parallel' | 'external-direct';
  autoEscalationDays: number; // Days before auto-escalation (0 = manual only)
  escalationThreshold: 'any' | 'pattern' | 'severity' | 'retaliation';
  // Response parameters
  responseRequired: boolean;
  responseDeadlineDays: number;
  retaliationMonitoring: boolean;
  // Industry sensitivity multipliers
  sensitivityMultipliers: {
    anonymityWeight: number;
    escalationSpeed: number;
    documentationLevel: number;
    externalChannelAccess: number;
  };
  isCore?: boolean;
  fieldTooltips: {
    concern: string;
    evidence: string;
    parties: string;
    desiredOutcome: string;
    urgency: string;
  };
  placeholders: {
    concern: string;
    evidence: string;
    desiredOutcome: string;
  };
}

export const DISSENT_MODE_CATEGORIES = {
  'Feedback': ['suggestion-box', 'process-improvement', 'culture-feedback'],
  'Concerns': ['confidential-concern', 'ethics-report', 'safety-report'],
  'Escalation': ['formal-grievance', 'executive-escalation', 'board-escalation'],
  'Whistleblower': ['protected-disclosure', 'regulatory-report', 'legal-hold'],
} as const;

export const CORE_DISSENT_MODES = [
  'confidential-concern',
  'ethics-report',
  'protected-disclosure',
  'formal-grievance',
  'safety-report',
] as const;

export const DISSENT_MODES: Record<string, DissentMode> = {
  'suggestion-box': {
    id: 'suggestion-box',
    name: 'Suggestion Box',
    emoji: '💡',
    color: '#10B981',
    primeDirective: 'Every Voice Matters',
    description: 'Low-stakes feedback channel for ideas and improvements. Optional anonymity, no formal process.',
    shortDesc: 'Ideas & suggestions',
    useCases: ['Process improvements', 'Product ideas', 'Workplace suggestions', 'General feedback'],
    anonymityLevel: 'confidential',
    identityProtection: 'limited',
    traceability: 'limited',
    escalationPath: 'internal-only',
    autoEscalationDays: 0,
    escalationThreshold: 'any',
    responseRequired: false,
    responseDeadlineDays: 30,
    retaliationMonitoring: false,
    sensitivityMultipliers: { anonymityWeight: 0.5, escalationSpeed: 0.3, documentationLevel: 0.4, externalChannelAccess: 0.0 },
    fieldTooltips: {
      concern: 'What idea or suggestion do you want to share? This is a low-pressure channel for any feedback.',
      evidence: 'Optional: Include any supporting information, data, or examples that illustrate your point.',
      parties: 'Optional: Who should see this? Leave blank for general submission.',
      desiredOutcome: 'What would you like to see happen? Be specific about the change you\'re suggesting.',
      urgency: 'How time-sensitive is this? Suggestions are typically reviewed monthly.',
    },
    placeholders: {
      concern: 'e.g., I think we could improve our onboarding process by adding a buddy system...',
      evidence: 'e.g., New hires have mentioned feeling lost in their first week. Survey data attached.',
      desiredOutcome: 'e.g., Implement a formal buddy program for all new hires within 90 days',
    },
  },

  'process-improvement': {
    id: 'process-improvement',
    name: 'Process Improvement',
    emoji: '⚙️',
    color: '#3B82F6',
    primeDirective: 'Better Ways to Work',
    description: 'Structured channel for operational improvements. Identified submissions routed to process owners.',
    shortDesc: 'Operational feedback',
    useCases: ['Workflow inefficiencies', 'Tool improvements', 'Policy updates', 'Cross-team friction'],
    anonymityLevel: 'identified',
    identityProtection: 'none',
    traceability: 'full',
    escalationPath: 'internal-only',
    autoEscalationDays: 14,
    escalationThreshold: 'pattern',
    responseRequired: true,
    responseDeadlineDays: 14,
    retaliationMonitoring: false,
    sensitivityMultipliers: { anonymityWeight: 0.3, escalationSpeed: 0.5, documentationLevel: 0.6, externalChannelAccess: 0.0 },
    fieldTooltips: {
      concern: 'What process or workflow needs improvement? Be specific about the pain point.',
      evidence: 'Provide data: time wasted, errors caused, customer impact, team frustration.',
      parties: 'Who owns this process? Who else is affected?',
      desiredOutcome: 'What does the improved process look like? Quantify the benefit if possible.',
      urgency: 'How much is this costing us? Daily, weekly, per-incident?',
    },
    placeholders: {
      concern: 'e.g., Our expense approval process takes 3 weeks and requires 5 signatures for any amount...',
      evidence: 'e.g., Average approval time: 18 days. 40% of expenses are under $100. Team spends 2hrs/week on this.',
      desiredOutcome: 'e.g., Implement tiered approval: <$100 auto-approve, <$500 single manager, >$500 current process',
    },
  },

  'culture-feedback': {
    id: 'culture-feedback',
    name: 'Culture Feedback',
    emoji: '🌱',
    color: '#8B5CF6',
    primeDirective: 'Shape Our Culture',
    description: 'Channel for feedback on workplace culture, values, and environment. Confidential by default.',
    shortDesc: 'Workplace culture',
    useCases: ['Culture concerns', 'Values alignment', 'Team dynamics', 'Leadership feedback'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'minimal',
    escalationPath: 'internal-only',
    autoEscalationDays: 0,
    escalationThreshold: 'pattern',
    responseRequired: false,
    responseDeadlineDays: 30,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 0.8, escalationSpeed: 0.4, documentationLevel: 0.5, externalChannelAccess: 0.0 },
    fieldTooltips: {
      concern: 'What cultural issue or observation do you want to share? Your identity is protected.',
      evidence: 'Describe specific situations or patterns. Avoid naming individuals unless necessary.',
      parties: 'Who is affected by this cultural issue? Teams, departments, the whole company?',
      desiredOutcome: 'What cultural change would you like to see? How would we know it\'s working?',
      urgency: 'Is this a growing trend or isolated incident? How long has this been happening?',
    },
    placeholders: {
      concern: 'e.g., There\'s a growing culture of presenteeism where people feel they can\'t take PTO...',
      evidence: 'e.g., Multiple team members have mentioned guilt about taking vacation. PTO usage is down 30%.',
      desiredOutcome: 'e.g., Leadership models healthy PTO usage, managers actively encourage time off',
    },
  },

  'confidential-concern': {
    id: 'confidential-concern',
    name: 'Confidential Concern',
    emoji: '🔒',
    color: '#F59E0B',
    primeDirective: 'Safe to Speak',
    description: 'Protected channel for sensitive concerns. Identity known only to designated recipients. Retaliation monitoring enabled.',
    shortDesc: 'Protected feedback',
    useCases: ['Sensitive issues', 'Management concerns', 'Policy violations', 'Interpersonal conflicts'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'limited',
    escalationPath: 'internal-first',
    autoEscalationDays: 14,
    escalationThreshold: 'severity',
    responseRequired: true,
    responseDeadlineDays: 7,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 1.0, escalationSpeed: 0.7, documentationLevel: 0.8, externalChannelAccess: 0.3 },
    isCore: true,
    fieldTooltips: {
      concern: 'Describe your concern in detail. Your identity is protected and only shared with designated investigators.',
      evidence: 'Provide any evidence: emails, documents, dates, witnesses. This strengthens your report.',
      parties: 'Who is involved? Who else has witnessed this? Names help investigation but are optional.',
      desiredOutcome: 'What resolution would address your concern? Investigation, mediation, policy change?',
      urgency: 'Is anyone at immediate risk? Is evidence at risk of being destroyed?',
    },
    placeholders: {
      concern: 'e.g., My manager has been pressuring the team to misreport hours to meet budget targets...',
      evidence: 'e.g., Email from manager dated 3/15 attached. Three team members can corroborate.',
      desiredOutcome: 'e.g., Investigation into timesheet practices, correction of any misreported hours',
    },
  },

  'ethics-report': {
    id: 'ethics-report',
    name: 'Ethics Report',
    emoji: '⚖️',
    color: '#EF4444',
    primeDirective: 'Do the Right Thing',
    description: 'Formal channel for ethics and compliance concerns. Routed to Ethics/Compliance team. Full documentation.',
    shortDesc: 'Ethics & compliance',
    useCases: ['Code of conduct violations', 'Conflicts of interest', 'Fraud concerns', 'Compliance violations'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'limited',
    escalationPath: 'internal-first',
    autoEscalationDays: 7,
    escalationThreshold: 'severity',
    responseRequired: true,
    responseDeadlineDays: 5,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 1.0, escalationSpeed: 1.0, documentationLevel: 1.0, externalChannelAccess: 0.5 },
    isCore: true,
    fieldTooltips: {
      concern: 'Describe the ethics or compliance concern. Be specific about what policy or law may be violated.',
      evidence: 'Document everything: dates, amounts, communications, witnesses. Preserve original evidence.',
      parties: 'Who is involved? Include titles and departments. Who authorized the action?',
      desiredOutcome: 'What should happen? Investigation, remediation, policy change, regulatory notification?',
      urgency: 'Is the violation ongoing? Is there financial or legal exposure? Is evidence at risk?',
    },
    placeholders: {
      concern: 'e.g., I believe our sales team is offering unauthorized discounts that violate our revenue recognition policy...',
      evidence: 'e.g., Three contracts with unapproved terms attached. Pattern started in Q2.',
      desiredOutcome: 'e.g., Audit of all Q2-Q3 contracts, retraining on discount authority, policy clarification',
    },
  },

  'safety-report': {
    id: 'safety-report',
    name: 'Safety Report',
    emoji: '🚨',
    color: '#DC2626',
    primeDirective: 'Safety First, Always',
    description: 'Urgent channel for safety concerns. Immediate routing to Safety team. Auto-escalation if unaddressed.',
    shortDesc: 'Safety concerns',
    useCases: ['Physical safety hazards', 'Psychological safety', 'Product safety', 'Environmental hazards'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'limited',
    escalationPath: 'parallel',
    autoEscalationDays: 3,
    escalationThreshold: 'any',
    responseRequired: true,
    responseDeadlineDays: 2,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 0.9, escalationSpeed: 1.5, documentationLevel: 1.0, externalChannelAccess: 0.8 },
    isCore: true,
    fieldTooltips: {
      concern: 'Describe the safety hazard. Be specific about location, conditions, and who is at risk.',
      evidence: 'Photos, incident reports, near-miss documentation. Include dates and frequency.',
      parties: 'Who is exposed to this hazard? Who is responsible for the area/process?',
      desiredOutcome: 'What needs to happen to eliminate the hazard? Immediate vs. long-term fixes.',
      urgency: 'CRITICAL: Is anyone in immediate danger? Has anyone been injured? Call emergency services if needed.',
    },
    placeholders: {
      concern: 'e.g., The emergency exit on Floor 3 has been blocked by storage boxes for two weeks...',
      evidence: 'e.g., Photos attached showing blocked exit. Reported verbally to facilities on 3/10, no action.',
      desiredOutcome: 'e.g., Immediate removal of obstruction, policy reminder to all staff, weekly safety walks',
    },
  },

  'formal-grievance': {
    id: 'formal-grievance',
    name: 'Formal Grievance',
    emoji: '📜',
    color: '#6366F1',
    primeDirective: 'Your Rights Protected',
    description: 'Formal HR grievance process. Full documentation, defined timelines, appeal rights. Legal protections apply.',
    shortDesc: 'HR grievance',
    useCases: ['Discrimination', 'Harassment', 'Wrongful treatment', 'Policy violations affecting employment'],
    anonymityLevel: 'identified',
    identityProtection: 'limited',
    traceability: 'full',
    escalationPath: 'internal-first',
    autoEscalationDays: 10,
    escalationThreshold: 'any',
    responseRequired: true,
    responseDeadlineDays: 5,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 0.6, escalationSpeed: 1.0, documentationLevel: 1.2, externalChannelAccess: 0.7 },
    isCore: true,
    fieldTooltips: {
      concern: 'State your grievance formally. Reference specific policies, dates, and actions that violated your rights.',
      evidence: 'Compile all evidence: emails, performance reviews, witness statements, HR communications.',
      parties: 'Name all individuals involved. Include HR contacts you\'ve already spoken with.',
      desiredOutcome: 'State your requested remedy: reinstatement, compensation, policy change, apology.',
      urgency: 'Note any deadlines: statute of limitations, appeal windows, upcoming decisions.',
    },
    placeholders: {
      concern: 'e.g., I am filing a formal grievance regarding discriminatory treatment in the promotion process...',
      evidence: 'e.g., Performance reviews (attached), promotion criteria, comparative data on promotions by demographic.',
      desiredOutcome: 'e.g., Reconsideration of promotion decision, review of promotion criteria for bias, training for hiring managers',
    },
  },

  'executive-escalation': {
    id: 'executive-escalation',
    name: 'Executive Escalation',
    emoji: '📈',
    color: '#0EA5E9',
    primeDirective: 'Leadership Must Know',
    description: 'Direct escalation to executive leadership. For issues that require C-suite attention or have been unresolved.',
    shortDesc: 'C-suite escalation',
    useCases: ['Unresolved critical issues', 'Systemic problems', 'Leadership blind spots', 'Strategic concerns'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'limited',
    escalationPath: 'internal-first',
    autoEscalationDays: 5,
    escalationThreshold: 'severity',
    responseRequired: true,
    responseDeadlineDays: 3,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 0.9, escalationSpeed: 1.2, documentationLevel: 1.0, externalChannelAccess: 0.4 },
    fieldTooltips: {
      concern: 'Why does this require executive attention? What has been tried and failed at lower levels?',
      evidence: 'Document the escalation history: who you\'ve contacted, when, what response (or lack thereof).',
      parties: 'Which executive(s) should see this? Who has failed to address it so far?',
      desiredOutcome: 'What executive action is needed? Decision, intervention, resource allocation?',
      urgency: 'What is the cost of continued inaction? Financial, reputational, legal, human?',
    },
    placeholders: {
      concern: 'e.g., Our compliance team has been raising concerns about GDPR violations for 6 months with no action...',
      evidence: 'e.g., Timeline of escalations attached. Legal opinion from outside counsel. Potential fine exposure: €20M.',
      desiredOutcome: 'e.g., CEO-sponsored compliance initiative, budget allocation, board notification',
    },
  },

  'board-escalation': {
    id: 'board-escalation',
    name: 'Board Escalation',
    emoji: '🏛️',
    color: '#7C3AED',
    primeDirective: 'Fiduciary Duty',
    description: 'Direct channel to Board of Directors. For issues of fiduciary concern, executive misconduct, or existential risk.',
    shortDesc: 'Board-level concerns',
    useCases: ['Executive misconduct', 'Fiduciary breaches', 'Existential risks', 'Governance failures'],
    anonymityLevel: 'confidential',
    identityProtection: 'strong',
    traceability: 'minimal',
    escalationPath: 'parallel',
    autoEscalationDays: 3,
    escalationThreshold: 'severity',
    responseRequired: true,
    responseDeadlineDays: 5,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 1.0, escalationSpeed: 1.5, documentationLevel: 1.2, externalChannelAccess: 0.6 },
    fieldTooltips: {
      concern: 'Why must the Board know? Is this a fiduciary issue, executive misconduct, or existential risk?',
      evidence: 'Board-quality evidence: financial impact, legal exposure, documented misconduct, expert opinions.',
      parties: 'Which Board members or committees should receive this? Audit Committee? Full Board?',
      desiredOutcome: 'What Board action is required? Investigation, executive action, disclosure, strategic change?',
      urgency: 'What is the timeline for harm? Upcoming filings, transactions, or decisions?',
    },
    placeholders: {
      concern: 'e.g., The CEO has been directing accounting to defer expense recognition to meet quarterly targets...',
      evidence: 'e.g., Internal audit findings, CFO resignation letter, external auditor concerns documented.',
      desiredOutcome: 'e.g., Independent investigation, potential restatement, executive accountability',
    },
  },

  'protected-disclosure': {
    id: 'protected-disclosure',
    name: 'Protected Disclosure',
    emoji: '🛡️',
    color: '#B91C1C',
    primeDirective: 'Truth to Power',
    description: 'Full whistleblower protection. Cryptographic anonymity available. Legal protections documented. External escalation path.',
    shortDesc: 'Whistleblower channel',
    useCases: ['Fraud', 'Illegal activity', 'Public safety', 'Securities violations', 'Government contract fraud'],
    anonymityLevel: 'cryptographic',
    identityProtection: 'absolute',
    traceability: 'none',
    escalationPath: 'parallel',
    autoEscalationDays: 7,
    escalationThreshold: 'retaliation',
    responseRequired: true,
    responseDeadlineDays: 5,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 1.5, escalationSpeed: 1.3, documentationLevel: 1.5, externalChannelAccess: 1.0 },
    isCore: true,
    fieldTooltips: {
      concern: 'Describe the wrongdoing. Be specific: what law, regulation, or public interest is being violated?',
      evidence: 'Preserve and document all evidence. Consider secure storage. Note chain of custody.',
      parties: 'Who is responsible? Who authorized it? Who else knows? (Names optional for your protection)',
      desiredOutcome: 'What should happen? Internal investigation, regulatory notification, public disclosure?',
      urgency: 'Is the wrongdoing ongoing? Is evidence being destroyed? Are you at risk of retaliation?',
    },
    placeholders: {
      concern: 'e.g., Our company has been systematically overbilling government contracts by misclassifying labor...',
      evidence: 'e.g., Billing records, internal emails directing misclassification, whistleblower attorney consultation.',
      desiredOutcome: 'e.g., Internal investigation with external counsel, voluntary disclosure to DOJ, remediation',
    },
  },

  'regulatory-report': {
    id: 'regulatory-report',
    name: 'Regulatory Report',
    emoji: '🏢',
    color: '#1F2937',
    primeDirective: 'The Law Requires It',
    description: 'Channel for mandatory regulatory reporting. Guides through required disclosures. Documents good-faith reporting.',
    shortDesc: 'Mandatory reporting',
    useCases: ['SEC violations', 'OSHA incidents', 'Environmental violations', 'Healthcare fraud', 'Financial crimes'],
    anonymityLevel: 'identified',
    identityProtection: 'strong',
    traceability: 'full',
    escalationPath: 'external-direct',
    autoEscalationDays: 0,
    escalationThreshold: 'any',
    responseRequired: true,
    responseDeadlineDays: 1,
    retaliationMonitoring: true,
    sensitivityMultipliers: { anonymityWeight: 0.7, escalationSpeed: 2.0, documentationLevel: 1.5, externalChannelAccess: 1.5 },
    fieldTooltips: {
      concern: 'What must be reported? Reference the specific regulation or mandatory reporting requirement.',
      evidence: 'Compile all required documentation. Regulatory reports have specific evidence requirements.',
      parties: 'Who is the designated reporter? Who must be notified internally before external filing?',
      desiredOutcome: 'Regulatory compliance. Note any remediation already underway.',
      urgency: 'What is the reporting deadline? Many regulations have 24-72 hour requirements.',
    },
    placeholders: {
      concern: 'e.g., We experienced a data breach affecting 10,000+ customers, triggering state notification requirements...',
      evidence: 'e.g., Incident report, affected customer list, forensic analysis, remediation steps taken.',
      desiredOutcome: 'e.g., Timely notification to all required regulators and affected individuals',
    },
  },

  'legal-hold': {
    id: 'legal-hold',
    name: 'Legal Hold Notice',
    emoji: '⚠️',
    color: '#CA8A04',
    primeDirective: 'Preserve Everything',
    description: 'Triggers legal hold on relevant documents and communications. For anticipated litigation or investigation.',
    shortDesc: 'Document preservation',
    useCases: ['Anticipated litigation', 'Regulatory investigation', 'Internal investigation', 'Subpoena response'],
    anonymityLevel: 'identified',
    identityProtection: 'limited',
    traceability: 'full',
    escalationPath: 'internal-only',
    autoEscalationDays: 0,
    escalationThreshold: 'any',
    responseRequired: true,
    responseDeadlineDays: 1,
    retaliationMonitoring: false,
    sensitivityMultipliers: { anonymityWeight: 0.3, escalationSpeed: 2.0, documentationLevel: 2.0, externalChannelAccess: 0.5 },
    fieldTooltips: {
      concern: 'What matter requires document preservation? Reference case name, investigation, or anticipated action.',
      evidence: 'Define the scope: date ranges, custodians, systems, document types to be preserved.',
      parties: 'Who are the custodians? Who needs to receive the legal hold notice?',
      desiredOutcome: 'Successful preservation of all relevant documents and communications.',
      urgency: 'IMMEDIATE. Spoliation of evidence can result in severe sanctions.',
    },
    placeholders: {
      concern: 'e.g., We have received a litigation hold notice regarding the Smith v. Company employment matter...',
      evidence: 'e.g., All emails, documents, and communications involving Jane Smith from 2023-present.',
      desiredOutcome: 'e.g., Legal hold implemented within 24 hours, all custodians notified, IT preservation confirmed',
    },
  },
};

// Helper functions
export const isCoreMode = (modeId: string): boolean => 
  CORE_DISSENT_MODES.includes(modeId as any);

export const getModesByCategory = (category: keyof typeof DISSENT_MODE_CATEGORIES): DissentMode[] =>
  DISSENT_MODE_CATEGORIES[category].map(id => DISSENT_MODES[id]).filter(Boolean);

export const getCoreModes = (): DissentMode[] =>
  CORE_DISSENT_MODES.map(id => DISSENT_MODES[id]);

export const getModeForConcernType = (concernType: string): string => {
  const mapping: Record<string, string> = {
    'suggestion': 'suggestion-box',
    'process': 'process-improvement',
    'culture': 'culture-feedback',
    'sensitive': 'confidential-concern',
    'ethics': 'ethics-report',
    'safety': 'safety-report',
    'grievance': 'formal-grievance',
    'executive': 'executive-escalation',
    'board': 'board-escalation',
    'whistleblower': 'protected-disclosure',
    'regulatory': 'regulatory-report',
    'legal': 'legal-hold',
  };
  return mapping[concernType] || 'confidential-concern';
};

// Calculate protection score based on mode and industry
export const calculateProtectionScore = (
  mode: DissentMode,
  industry: IndustrySensitivityProfile
): { score: number; retaliationRisk: string; recommendedActions: string[] } => {
  // Base score from mode anonymity level
  const anonymityScores: Record<string, number> = {
    'identified': 20,
    'confidential': 50,
    'anonymous': 75,
    'cryptographic': 95,
  };
  
  const baseScore = anonymityScores[mode.anonymityLevel] || 50;
  
  // Adjust for industry retaliation risk
  const retaliationMultipliers: Record<string, number> = {
    'low': 1.1,
    'medium': 1.0,
    'high': 0.85,
    'extreme': 0.7,
  };
  
  const industryMultiplier = retaliationMultipliers[industry.retaliationRisk] || 1.0;
  const adjustedScore = Math.min(100, baseScore * industryMultiplier * mode.sensitivityMultipliers.anonymityWeight);
  
  // Determine recommended actions
  const recommendedActions: string[] = [];
  if (industry.retaliationRisk === 'high' || industry.retaliationRisk === 'extreme') {
    recommendedActions.push('Consider external legal counsel before filing');
  }
  if (mode.anonymityLevel === 'identified' && industry.retaliationRisk !== 'low') {
    recommendedActions.push('Document your current performance standing');
  }
  if (industry.externalChannels.length > 0 && mode.escalationPath !== 'internal-only') {
    recommendedActions.push(`External channels available: ${industry.externalChannels.slice(0, 2).join(', ')}`);
  }
  if (mode.retaliationMonitoring) {
    recommendedActions.push('Retaliation monitoring will be active for 12 months');
  }
  
  return {
    score: Math.round(adjustedScore),
    retaliationRisk: industry.retaliationRisk,
    recommendedActions,
  };
};

// Get industry-specific guidance
export const getIndustryGuidance = (
  mode: DissentMode,
  industry: IndustrySensitivityProfile
): string => {
  const protections = industry.whistleblowerProtections;
  const channels = industry.externalChannels.slice(0, 2).join(', ');
  const resolution = industry.avgResolutionDays;
  
  return `${industry.name}: Whistleblower protections are ${protections}. Average resolution: ${resolution} days. External channels: ${channels}.`;
};
