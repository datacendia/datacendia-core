// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA APOTHEOSIS MODES - Red-Team Intensity Levels
// Different intensity levels for adversarial stress testing
// Includes industry-specific threat profiles and attack vectors
// =============================================================================

// Industry threat profiles for red-teaming
export interface IndustryThreatProfile {
  id: string;
  name: string;
  // Primary threat vectors
  topThreats: string[];
  // Attack surface characteristics
  dataExposure: 'low' | 'medium' | 'high' | 'critical';
  regulatoryScrutiny: 'low' | 'medium' | 'high' | 'extreme';
  nationStateInterest: 'low' | 'medium' | 'high';
  insiderThreatRisk: 'low' | 'medium' | 'high';
  // Historical breach data
  avgBreachCostM: number; // Average breach cost in millions
  avgDetectionDays: number; // Average days to detect breach
  // Compliance frameworks
  requiredFrameworks: string[];
}

export const INDUSTRY_THREAT_PROFILES: Record<string, IndustryThreatProfile> = {
  'financial-services': {
    id: 'financial-services',
    name: 'Financial Services',
    topThreats: ['Account takeover', 'Wire fraud', 'Insider trading', 'Ransomware', 'API abuse'],
    dataExposure: 'critical',
    regulatoryScrutiny: 'extreme',
    nationStateInterest: 'high',
    insiderThreatRisk: 'high',
    avgBreachCostM: 5.9,
    avgDetectionDays: 233,
    requiredFrameworks: ['SOX', 'PCI-DSS', 'GLBA', 'FFIEC'],
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    topThreats: ['Ransomware', 'PHI theft', 'Medical device compromise', 'Insider access abuse', 'Supply chain'],
    dataExposure: 'critical',
    regulatoryScrutiny: 'extreme',
    nationStateInterest: 'medium',
    insiderThreatRisk: 'high',
    avgBreachCostM: 10.9,
    avgDetectionDays: 329,
    requiredFrameworks: ['HIPAA', 'HITECH', 'FDA 21 CFR Part 11'],
  },
  'technology': {
    id: 'technology',
    name: 'Technology / SaaS',
    topThreats: ['Supply chain attacks', 'Zero-days', 'API vulnerabilities', 'Credential stuffing', 'IP theft'],
    dataExposure: 'high',
    regulatoryScrutiny: 'medium',
    nationStateInterest: 'high',
    insiderThreatRisk: 'medium',
    avgBreachCostM: 4.5,
    avgDetectionDays: 197,
    requiredFrameworks: ['SOC 2', 'ISO 27001', 'GDPR'],
  },
  'government': {
    id: 'government',
    name: 'Government / Defense',
    topThreats: ['Nation-state APT', 'Espionage', 'Supply chain', 'Insider threats', 'Critical infrastructure'],
    dataExposure: 'critical',
    regulatoryScrutiny: 'extreme',
    nationStateInterest: 'high',
    insiderThreatRisk: 'high',
    avgBreachCostM: 2.6,
    avgDetectionDays: 287,
    requiredFrameworks: ['FedRAMP', 'FISMA', 'NIST 800-53', 'CMMC'],
  },
  'retail': {
    id: 'retail',
    name: 'Retail / E-Commerce',
    topThreats: ['Payment card fraud', 'Account takeover', 'Bot attacks', 'Inventory manipulation', 'Gift card fraud'],
    dataExposure: 'high',
    regulatoryScrutiny: 'medium',
    nationStateInterest: 'low',
    insiderThreatRisk: 'medium',
    avgBreachCostM: 3.3,
    avgDetectionDays: 212,
    requiredFrameworks: ['PCI-DSS', 'CCPA', 'GDPR'],
  },
  'manufacturing': {
    id: 'manufacturing',
    name: 'Manufacturing / Industrial',
    topThreats: ['OT/ICS attacks', 'IP theft', 'Ransomware', 'Supply chain', 'Sabotage'],
    dataExposure: 'medium',
    regulatoryScrutiny: 'medium',
    nationStateInterest: 'high',
    insiderThreatRisk: 'medium',
    avgBreachCostM: 4.5,
    avgDetectionDays: 220,
    requiredFrameworks: ['NIST CSF', 'IEC 62443', 'ISO 27001'],
  },
  'energy': {
    id: 'energy',
    name: 'Energy / Utilities',
    topThreats: ['Critical infrastructure attacks', 'SCADA compromise', 'Nation-state APT', 'Ransomware', 'Physical-cyber'],
    dataExposure: 'high',
    regulatoryScrutiny: 'high',
    nationStateInterest: 'high',
    insiderThreatRisk: 'medium',
    avgBreachCostM: 4.7,
    avgDetectionDays: 254,
    requiredFrameworks: ['NERC CIP', 'TSA Pipeline', 'NIST CSF'],
  },
  'general': {
    id: 'general',
    name: 'General / Cross-Industry',
    topThreats: ['Phishing', 'Ransomware', 'Credential theft', 'Insider threats', 'Third-party risk'],
    dataExposure: 'medium',
    regulatoryScrutiny: 'medium',
    nationStateInterest: 'low',
    insiderThreatRisk: 'medium',
    avgBreachCostM: 4.4,
    avgDetectionDays: 277,
    requiredFrameworks: ['SOC 2', 'ISO 27001', 'NIST CSF'],
  },
};

export interface ApotheosisMode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  primeDirective: string;
  description: string;
  shortDesc: string;
  useCases: string[];
  // Red-team parameters
  intensity: 'gentle' | 'moderate' | 'aggressive' | 'ruthless' | 'apocalyptic';
  attackSophistication: 1 | 2 | 3 | 4 | 5; // 1=script kiddie, 5=nation-state
  persistenceLevel: 'one-shot' | 'campaign' | 'apt'; // How long attacks persist
  insiderAccess: 'none' | 'basic' | 'privileged' | 'admin'; // Assumed insider access
  budgetAssumption: 'minimal' | 'moderate' | 'well-funded' | 'unlimited';
  // What to target
  targetPriorities: ('data' | 'availability' | 'integrity' | 'reputation' | 'financial')[];
  // Industry threat multipliers
  threatMultipliers: {
    technical: number;
    social: number;
    physical: number;
    insider: number;
  };
  isCore?: boolean;
  fieldTooltips: {
    target: string;
    scope: string;
    constraints: string;
    objectives: string;
    timeline: string;
  };
  placeholders: {
    target: string;
    scope: string;
    objectives: string;
  };
}

export const APOTHEOSIS_MODE_CATEGORIES = {
  'Compliance': ['compliance-check', 'audit-prep', 'framework-validation'],
  'Vulnerability': ['gentle-probe', 'vulnerability-scan', 'penetration-test'],
  'Adversarial': ['red-team', 'purple-team', 'assumed-breach'],
  'Extreme': ['nation-state', 'insider-threat', 'apocalypse'],
} as const;

export const CORE_APOTHEOSIS_MODES = [
  'gentle-probe',
  'red-team',
  'assumed-breach',
  'compliance-check',
  'insider-threat',
] as const;

export const APOTHEOSIS_MODES: Record<string, ApotheosisMode> = {
  'gentle-probe': {
    id: 'gentle-probe',
    name: 'Gentle Probe',
    emoji: '🔍',
    color: '#10B981',
    primeDirective: 'Find the Obvious Gaps',
    description: 'Light-touch assessment to identify low-hanging fruit. Non-disruptive, suitable for production environments.',
    shortDesc: 'Light security check',
    useCases: ['Initial assessment', 'Production-safe testing', 'Quick health check', 'New system validation'],
    intensity: 'gentle',
    attackSophistication: 1,
    persistenceLevel: 'one-shot',
    insiderAccess: 'none',
    budgetAssumption: 'minimal',
    targetPriorities: ['data', 'availability'],
    threatMultipliers: { technical: 0.5, social: 0.3, physical: 0.1, insider: 0.2 },
    isCore: true,
    fieldTooltips: {
      target: 'What system, application, or process should be tested? Be specific about the scope.',
      scope: 'Define boundaries: what\'s in-scope and out-of-scope. Gentle probes stay within safe limits.',
      constraints: 'List any restrictions: no production data access, no denial-of-service, specific time windows.',
      objectives: 'What are you trying to learn? Focus on identifying obvious vulnerabilities and misconfigurations.',
      timeline: 'Gentle probes are typically completed in hours to days. Define your testing window.',
    },
    placeholders: {
      target: 'e.g., Customer-facing web application at app.example.com',
      scope: 'e.g., Web application only, no backend infrastructure, no social engineering',
      objectives: 'e.g., Identify OWASP Top 10 vulnerabilities, check SSL configuration, test authentication',
    },
  },

  'vulnerability-scan': {
    id: 'vulnerability-scan',
    name: 'Vulnerability Scan',
    emoji: '📡',
    color: '#3B82F6',
    primeDirective: 'Map the Attack Surface',
    description: 'Automated scanning to identify known vulnerabilities. Comprehensive coverage with minimal manual effort.',
    shortDesc: 'Automated scanning',
    useCases: ['Regular security hygiene', 'Compliance requirements', 'Asset inventory', 'Patch prioritization'],
    intensity: 'gentle',
    attackSophistication: 2,
    persistenceLevel: 'one-shot',
    insiderAccess: 'basic',
    budgetAssumption: 'minimal',
    targetPriorities: ['data', 'integrity'],
    threatMultipliers: { technical: 0.7, social: 0.2, physical: 0.1, insider: 0.3 },
    fieldTooltips: {
      target: 'Define the IP ranges, domains, or applications to scan. Include all assets in scope.',
      scope: 'Specify scan depth: external only, internal network, authenticated scans, specific ports.',
      constraints: 'Define scan windows, rate limits, and any systems that must be excluded.',
      objectives: 'What vulnerabilities are you prioritizing? CVEs, misconfigurations, compliance gaps?',
      timeline: 'Scans can run continuously or in scheduled windows. Define frequency and duration.',
    },
    placeholders: {
      target: 'e.g., 10.0.0.0/24 internal network, *.example.com external domains',
      scope: 'e.g., Full port scan, authenticated Windows scans, web application scanning',
      objectives: 'e.g., Identify critical CVEs, map shadow IT, validate patch compliance',
    },
  },

  'penetration-test': {
    id: 'penetration-test',
    name: 'Penetration Test',
    emoji: '🎯',
    color: '#F59E0B',
    primeDirective: 'Prove the Exploit',
    description: 'Manual exploitation of vulnerabilities to demonstrate real-world impact. Goes beyond scanning to prove exploitability.',
    shortDesc: 'Manual exploitation',
    useCases: ['Compliance requirements', 'Pre-launch security', 'Vendor assessment', 'Insurance requirements'],
    intensity: 'moderate',
    attackSophistication: 3,
    persistenceLevel: 'campaign',
    insiderAccess: 'basic',
    budgetAssumption: 'moderate',
    targetPriorities: ['data', 'integrity', 'availability'],
    threatMultipliers: { technical: 1.0, social: 0.5, physical: 0.2, insider: 0.4 },
    fieldTooltips: {
      target: 'What systems should the pen testers attempt to compromise? Define crown jewels.',
      scope: 'Define rules of engagement: what techniques are allowed, what\'s off-limits.',
      constraints: 'Specify no-go areas: production databases, customer data, specific time restrictions.',
      objectives: 'What would constitute a successful test? Data exfiltration, privilege escalation, lateral movement?',
      timeline: 'Pen tests typically run 1-4 weeks. Define start/end dates and reporting deadlines.',
    },
    placeholders: {
      target: 'e.g., Corporate network with goal of reaching financial database server',
      scope: 'e.g., External and internal testing, social engineering allowed, no physical access',
      objectives: 'e.g., Achieve domain admin, exfiltrate sample PII, demonstrate ransomware path',
    },
  },

  'red-team': {
    id: 'red-team',
    name: 'Red Team',
    emoji: '🔴',
    color: '#EF4444',
    primeDirective: 'Think Like the Enemy',
    description: 'Full adversarial simulation with realistic TTPs. Tests people, process, and technology holistically.',
    shortDesc: 'Adversarial simulation',
    useCases: ['Security program validation', 'Detection testing', 'Incident response testing', 'Executive awareness'],
    intensity: 'aggressive',
    attackSophistication: 4,
    persistenceLevel: 'campaign',
    insiderAccess: 'none',
    budgetAssumption: 'well-funded',
    targetPriorities: ['data', 'integrity', 'reputation', 'financial'],
    threatMultipliers: { technical: 1.2, social: 1.0, physical: 0.5, insider: 0.6 },
    isCore: true,
    fieldTooltips: {
      target: 'Define the ultimate objective: what would a real attacker want? Data, access, disruption?',
      scope: 'Red teams have broad scope. Define any absolute boundaries (legal, safety, reputational).',
      constraints: 'Specify deconfliction procedures, emergency contacts, and abort criteria.',
      objectives: 'What are you testing? Detection capabilities, response time, security culture?',
      timeline: 'Red team engagements typically run 4-12 weeks. Define phases and checkpoints.',
    },
    placeholders: {
      target: 'e.g., Exfiltrate customer PII without triggering SOC alerts',
      scope: 'e.g., All attack vectors including phishing, physical, and technical. No destructive actions.',
      objectives: 'e.g., Test SOC detection, measure MTTD/MTTR, identify security culture gaps',
    },
  },

  'purple-team': {
    id: 'purple-team',
    name: 'Purple Team',
    emoji: '🟣',
    color: '#8B5CF6',
    primeDirective: 'Attack and Defend Together',
    description: 'Collaborative red/blue exercise with real-time feedback. Maximizes learning and detection improvement.',
    shortDesc: 'Collaborative testing',
    useCases: ['Detection engineering', 'SOC training', 'Playbook validation', 'Tool tuning'],
    intensity: 'moderate',
    attackSophistication: 4,
    persistenceLevel: 'campaign',
    insiderAccess: 'basic',
    budgetAssumption: 'well-funded',
    targetPriorities: ['data', 'integrity'],
    threatMultipliers: { technical: 1.0, social: 0.7, physical: 0.3, insider: 0.5 },
    fieldTooltips: {
      target: 'What attack techniques should be tested? Reference MITRE ATT&CK for specific TTPs.',
      scope: 'Define which systems and detections are being tested. Include blue team participants.',
      constraints: 'Specify collaboration rules: when to pause, how to share findings, debrief schedule.',
      objectives: 'What detections are you trying to validate or create? What gaps are you closing?',
      timeline: 'Purple team exercises can be single-day or multi-week. Define session schedule.',
    },
    placeholders: {
      target: 'e.g., Test detection coverage for MITRE ATT&CK techniques T1566, T1059, T1003',
      scope: 'e.g., Windows endpoints, SIEM correlation rules, EDR alerting',
      objectives: 'e.g., Achieve 80% detection coverage for initial access techniques, tune false positives',
    },
  },

  'assumed-breach': {
    id: 'assumed-breach',
    name: 'Assumed Breach',
    emoji: '💀',
    color: '#DC2626',
    primeDirective: 'They\'re Already Inside',
    description: 'Starts from compromised position to test internal defenses. Simulates post-exploitation scenarios.',
    shortDesc: 'Post-compromise testing',
    useCases: ['Internal segmentation testing', 'Lateral movement detection', 'Data loss prevention', 'Privilege escalation paths'],
    intensity: 'aggressive',
    attackSophistication: 4,
    persistenceLevel: 'apt',
    insiderAccess: 'privileged',
    budgetAssumption: 'well-funded',
    targetPriorities: ['data', 'integrity', 'financial'],
    threatMultipliers: { technical: 1.3, social: 0.4, physical: 0.2, insider: 1.0 },
    isCore: true,
    fieldTooltips: {
      target: 'What\'s the assumed starting point? Compromised workstation, stolen credentials, rogue insider?',
      scope: 'Define what the "attacker" can do from their starting position. What access do they have?',
      constraints: 'Specify what actions are off-limits even with assumed access (destructive actions, etc.).',
      objectives: 'What are you testing? Segmentation, detection of lateral movement, data exfiltration controls?',
      timeline: 'Assumed breach tests typically run 2-4 weeks. Define starting position and objectives.',
    },
    placeholders: {
      target: 'e.g., Start with compromised developer workstation, attempt to reach production database',
      scope: 'e.g., Lateral movement, privilege escalation, data staging. No actual exfiltration.',
      objectives: 'e.g., Test network segmentation, validate PAM controls, measure detection time',
    },
  },

  'insider-threat': {
    id: 'insider-threat',
    name: 'Insider Threat',
    emoji: '🕵️',
    color: '#B91C1C',
    primeDirective: 'Trust No One',
    description: 'Simulates malicious insider with legitimate access. Tests data loss prevention and access controls.',
    shortDesc: 'Malicious insider simulation',
    useCases: ['DLP validation', 'Access control testing', 'Separation of duties', 'Audit trail verification'],
    intensity: 'aggressive',
    attackSophistication: 3,
    persistenceLevel: 'apt',
    insiderAccess: 'admin',
    budgetAssumption: 'minimal',
    targetPriorities: ['data', 'financial', 'reputation'],
    threatMultipliers: { technical: 0.8, social: 0.6, physical: 0.8, insider: 1.5 },
    isCore: true,
    fieldTooltips: {
      target: 'What role is the insider playing? Developer, admin, executive, contractor?',
      scope: 'Define the insider\'s legitimate access and what abuse scenarios to test.',
      constraints: 'Specify what the insider "wouldn\'t" do (to focus on realistic scenarios).',
      objectives: 'What controls are you testing? DLP, access logging, separation of duties, behavioral analytics?',
      timeline: 'Insider threat tests can run 1-4 weeks. Define the insider persona and objectives.',
    },
    placeholders: {
      target: 'e.g., Disgruntled senior developer with production database access',
      scope: 'e.g., Data exfiltration via approved channels, credential sharing, audit log tampering',
      objectives: 'e.g., Test DLP effectiveness, validate audit logging, check for privilege creep',
    },
  },

  'nation-state': {
    id: 'nation-state',
    name: 'Nation-State APT',
    emoji: '🏴',
    color: '#1F2937',
    primeDirective: 'Unlimited Resources, Unlimited Patience',
    description: 'Simulates advanced persistent threat with nation-state capabilities. Tests against the most sophisticated adversaries.',
    shortDesc: 'APT simulation',
    useCases: ['Critical infrastructure', 'Defense contractors', 'High-value targets', 'Supply chain security'],
    intensity: 'ruthless',
    attackSophistication: 5,
    persistenceLevel: 'apt',
    insiderAccess: 'basic',
    budgetAssumption: 'unlimited',
    targetPriorities: ['data', 'integrity', 'availability', 'reputation'],
    threatMultipliers: { technical: 1.5, social: 1.2, physical: 0.8, insider: 1.0 },
    fieldTooltips: {
      target: 'What would a nation-state want from your organization? IP, access, disruption capability?',
      scope: 'APT simulations have broad scope. Define realistic nation-state objectives for your industry.',
      constraints: 'Specify legal boundaries and coordination with authorities if required.',
      objectives: 'What are you testing? Detection of advanced TTPs, supply chain security, long-term persistence?',
      timeline: 'APT simulations can run 3-6 months. Define phases: reconnaissance, initial access, persistence, objectives.',
    },
    placeholders: {
      target: 'e.g., Establish persistent access to R&D network, exfiltrate product roadmap',
      scope: 'e.g., Full spectrum: supply chain, zero-days, social engineering, physical. Coordinated with legal.',
      objectives: 'e.g., Test detection of living-off-the-land techniques, supply chain integrity, incident response',
    },
  },

  'compliance-check': {
    id: 'compliance-check',
    name: 'Compliance Check',
    emoji: '📋',
    color: '#6366F1',
    primeDirective: 'Meet the Standard',
    description: 'Validates security controls against compliance frameworks. Structured testing aligned to specific requirements.',
    shortDesc: 'Framework validation',
    useCases: ['Audit preparation', 'Certification maintenance', 'Gap assessment', 'Control validation'],
    intensity: 'gentle',
    attackSophistication: 2,
    persistenceLevel: 'one-shot',
    insiderAccess: 'basic',
    budgetAssumption: 'moderate',
    targetPriorities: ['data', 'integrity'],
    threatMultipliers: { technical: 0.6, social: 0.4, physical: 0.3, insider: 0.5 },
    isCore: true,
    fieldTooltips: {
      target: 'What systems are in scope for compliance? Define the compliance boundary.',
      scope: 'Specify which framework(s) and controls are being tested (SOC 2, PCI-DSS, HIPAA, etc.).',
      constraints: 'Define audit timeline, evidence requirements, and stakeholder availability.',
      objectives: 'What\'s the goal? Gap identification, audit readiness, certification, or remediation validation?',
      timeline: 'Compliance checks align to audit cycles. Define assessment window and reporting deadline.',
    },
    placeholders: {
      target: 'e.g., Production SaaS environment for SOC 2 Type II audit',
      scope: 'e.g., SOC 2 Trust Services Criteria: Security, Availability, Confidentiality',
      objectives: 'e.g., Identify control gaps before auditor arrival, validate remediation effectiveness',
    },
  },

  'audit-prep': {
    id: 'audit-prep',
    name: 'Audit Preparation',
    emoji: '✅',
    color: '#22C55E',
    primeDirective: 'No Surprises',
    description: 'Pre-audit testing to identify and remediate gaps before formal assessment. Reduces audit risk.',
    shortDesc: 'Pre-audit testing',
    useCases: ['SOC 2 preparation', 'ISO certification', 'Regulatory examination', 'Customer audit'],
    intensity: 'gentle',
    attackSophistication: 2,
    persistenceLevel: 'one-shot',
    insiderAccess: 'privileged',
    budgetAssumption: 'moderate',
    targetPriorities: ['data', 'integrity'],
    threatMultipliers: { technical: 0.5, social: 0.3, physical: 0.2, insider: 0.4 },
    fieldTooltips: {
      target: 'What will the auditors examine? Define the audit scope and sample selection approach.',
      scope: 'Specify which controls, evidence, and personnel will be tested.',
      constraints: 'Define remediation timeline and resources available for gap closure.',
      objectives: 'What findings would be unacceptable? Prioritize high-risk gaps.',
      timeline: 'Work backward from audit date. Define prep phases and remediation windows.',
    },
    placeholders: {
      target: 'e.g., All systems processing customer data for upcoming SOC 2 audit in 90 days',
      scope: 'e.g., Access controls, change management, incident response, vendor management',
      objectives: 'e.g., Zero critical findings, all high-risk gaps remediated, evidence packages complete',
    },
  },

  'framework-validation': {
    id: 'framework-validation',
    name: 'Framework Validation',
    emoji: '🏛️',
    color: '#0EA5E9',
    primeDirective: 'Controls Actually Work',
    description: 'Tests whether documented controls are actually implemented and effective. Bridges policy and reality.',
    shortDesc: 'Control effectiveness',
    useCases: ['Control testing', 'Policy validation', 'Security program assessment', 'Maturity evaluation'],
    intensity: 'moderate',
    attackSophistication: 3,
    persistenceLevel: 'campaign',
    insiderAccess: 'basic',
    budgetAssumption: 'moderate',
    targetPriorities: ['data', 'integrity', 'availability'],
    threatMultipliers: { technical: 0.8, social: 0.6, physical: 0.4, insider: 0.6 },
    fieldTooltips: {
      target: 'What controls are you validating? Reference your control framework (NIST, CIS, ISO).',
      scope: 'Define which control domains and specific controls will be tested.',
      constraints: 'Specify testing methodology and evidence requirements.',
      objectives: 'What does "effective" mean for each control? Define success criteria.',
      timeline: 'Framework validation can be ongoing or point-in-time. Define assessment schedule.',
    },
    placeholders: {
      target: 'e.g., NIST CSF controls across Identify, Protect, Detect, Respond, Recover',
      scope: 'e.g., Technical controls only, excluding physical security and HR processes',
      objectives: 'e.g., Validate 80% control effectiveness, identify top 10 gaps, create remediation roadmap',
    },
  },

  'apocalypse': {
    id: 'apocalypse',
    name: 'Apocalypse Mode',
    emoji: '☠️',
    color: '#7F1D1D',
    primeDirective: 'Burn It All Down',
    description: 'Maximum intensity testing with no holds barred. Simulates worst-case coordinated attack. Use with extreme caution.',
    shortDesc: 'Maximum destruction',
    useCases: ['Business continuity validation', 'Disaster recovery testing', 'Insurance assessment', 'Board demonstration'],
    intensity: 'apocalyptic',
    attackSophistication: 5,
    persistenceLevel: 'apt',
    insiderAccess: 'admin',
    budgetAssumption: 'unlimited',
    targetPriorities: ['data', 'availability', 'integrity', 'reputation', 'financial'],
    threatMultipliers: { technical: 2.0, social: 1.5, physical: 1.0, insider: 1.5 },
    fieldTooltips: {
      target: 'What\'s the doomsday scenario? Coordinated ransomware, insider + external, supply chain + direct?',
      scope: 'Define the apocalypse scenario in detail. What simultaneous attacks are occurring?',
      constraints: 'CRITICAL: Define safety boundaries, rollback procedures, and abort criteria.',
      objectives: 'What are you testing? Survival, recovery time, communication, decision-making under pressure?',
      timeline: 'Apocalypse tests require extensive preparation. Define tabletop vs. live exercise scope.',
    },
    placeholders: {
      target: 'e.g., Simultaneous ransomware, DDoS, insider data theft, and social media attack',
      scope: 'e.g., Full business continuity test. Tabletop for destructive scenarios, live for detection/response.',
      objectives: 'e.g., Validate 4-hour RTO, test crisis communication, measure executive decision-making',
    },
  },
};

// Helper functions
export const isCoreMode = (modeId: string): boolean => 
  CORE_APOTHEOSIS_MODES.includes(modeId as any);

export const getModesByCategory = (category: keyof typeof APOTHEOSIS_MODE_CATEGORIES): ApotheosisMode[] =>
  APOTHEOSIS_MODE_CATEGORIES[category].map(id => APOTHEOSIS_MODES[id]).filter(Boolean);

export const getCoreModes = (): ApotheosisMode[] =>
  CORE_APOTHEOSIS_MODES.map(id => APOTHEOSIS_MODES[id]);

export const getModeForThreatLevel = (threatLevel: string): string => {
  const mapping: Record<string, string> = {
    'low': 'gentle-probe',
    'medium': 'penetration-test',
    'high': 'red-team',
    'critical': 'assumed-breach',
    'extreme': 'nation-state',
  };
  return mapping[threatLevel] || 'red-team';
};

// Calculate threat score based on mode and industry
export const calculateThreatScore = (
  mode: ApotheosisMode,
  industry: IndustryThreatProfile
): { score: number; confidence: number; topThreats: string[] } => {
  // Base score from mode intensity
  const intensityScores: Record<string, number> = {
    'gentle': 20,
    'moderate': 40,
    'aggressive': 60,
    'ruthless': 80,
    'apocalyptic': 100,
  };
  
  const baseScore = intensityScores[mode.intensity] || 50;
  
  // Adjust for industry threat profile
  const industryMultiplier = (
    (industry.dataExposure === 'critical' ? 1.3 : industry.dataExposure === 'high' ? 1.1 : 1.0) +
    (industry.nationStateInterest === 'high' ? 0.2 : 0) +
    (industry.insiderThreatRisk === 'high' ? 0.1 : 0)
  ) / 1.4;
  
  const adjustedScore = Math.min(100, baseScore * industryMultiplier);
  
  // Calculate confidence based on industry data
  const confidence = Math.min(0.95, 0.6 + (industry.avgDetectionDays < 200 ? 0.2 : 0) + (industry.requiredFrameworks.length > 2 ? 0.1 : 0));
  
  return {
    score: Math.round(adjustedScore),
    confidence,
    topThreats: industry.topThreats.slice(0, 3),
  };
};

// Get industry-specific threat insight
export const getIndustryThreatInsight = (
  mode: ApotheosisMode,
  industry: IndustryThreatProfile
): string => {
  const avgCost = industry.avgBreachCostM;
  const detectionDays = industry.avgDetectionDays;
  const modeName = mode.name;
  
  return `${industry.name} average breach cost: $${avgCost}M. Detection time: ${detectionDays} days. ${modeName} tests against: ${industry.topThreats.slice(0, 3).join(', ')}.`;
};
