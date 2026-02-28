// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CRUCIBLE MODES - Stress Test Severity Levels
// Different intensity levels for stress testing decisions and systems
// Includes industry-specific failure benchmarks and resilience metrics
// =============================================================================

// Industry failure benchmarks for stress testing
export interface IndustryFailureBenchmarks {
  id: string;
  name: string;
  // Failure rate baselines
  systemFailureRate: number; // Annual major system failures (0-1)
  processFailureRate: number; // Process breakdown frequency (0-1)
  humanErrorRate: number; // Human error contribution (0-1)
  // Recovery metrics
  avgRecoveryHours: number; // Mean time to recover
  maxTolerableDowntime: number; // Hours before critical impact
  dataLossToleranceHours: number; // RPO in hours
  // Stress factors
  peakLoadMultiplier: number; // Normal to peak load ratio
  seasonalVariance: number; // Seasonal demand swing (0-1)
  regulatoryStressFactor: number; // Regulatory stress test requirements
  // Historical incidents
  majorIncidentsPerYear: number;
  avgIncidentCostM: number; // Average incident cost in millions
  // Resilience requirements
  requiredUptime: number; // SLA requirement (0.99, 0.999, etc.)
  redundancyLevel: 'none' | 'basic' | 'n+1' | 'active-active' | 'multi-region';
}

export const INDUSTRY_FAILURE_BENCHMARKS: Record<string, IndustryFailureBenchmarks> = {
  'financial-services': {
    id: 'financial-services',
    name: 'Financial Services',
    systemFailureRate: 0.02,
    processFailureRate: 0.05,
    humanErrorRate: 0.15,
    avgRecoveryHours: 2,
    maxTolerableDowntime: 4,
    dataLossToleranceHours: 0,
    peakLoadMultiplier: 10,
    seasonalVariance: 0.3,
    regulatoryStressFactor: 1.5,
    majorIncidentsPerYear: 2,
    avgIncidentCostM: 5.2,
    requiredUptime: 0.9999,
    redundancyLevel: 'active-active',
  },
  'healthcare': {
    id: 'healthcare',
    name: 'Healthcare',
    systemFailureRate: 0.03,
    processFailureRate: 0.08,
    humanErrorRate: 0.2,
    avgRecoveryHours: 4,
    maxTolerableDowntime: 1,
    dataLossToleranceHours: 0,
    peakLoadMultiplier: 3,
    seasonalVariance: 0.4,
    regulatoryStressFactor: 1.3,
    majorIncidentsPerYear: 3,
    avgIncidentCostM: 10.9,
    requiredUptime: 0.9999,
    redundancyLevel: 'active-active',
  },
  'technology': {
    id: 'technology',
    name: 'Technology / SaaS',
    systemFailureRate: 0.05,
    processFailureRate: 0.1,
    humanErrorRate: 0.25,
    avgRecoveryHours: 1,
    maxTolerableDowntime: 4,
    dataLossToleranceHours: 1,
    peakLoadMultiplier: 5,
    seasonalVariance: 0.2,
    regulatoryStressFactor: 1.0,
    majorIncidentsPerYear: 4,
    avgIncidentCostM: 2.5,
    requiredUptime: 0.999,
    redundancyLevel: 'n+1',
  },
  'ecommerce': {
    id: 'ecommerce',
    name: 'E-Commerce / Retail',
    systemFailureRate: 0.04,
    processFailureRate: 0.12,
    humanErrorRate: 0.2,
    avgRecoveryHours: 2,
    maxTolerableDowntime: 1,
    dataLossToleranceHours: 0.5,
    peakLoadMultiplier: 20,
    seasonalVariance: 0.8,
    regulatoryStressFactor: 1.0,
    majorIncidentsPerYear: 5,
    avgIncidentCostM: 3.8,
    requiredUptime: 0.999,
    redundancyLevel: 'active-active',
  },
  'manufacturing': {
    id: 'manufacturing',
    name: 'Manufacturing / Industrial',
    systemFailureRate: 0.06,
    processFailureRate: 0.08,
    humanErrorRate: 0.18,
    avgRecoveryHours: 8,
    maxTolerableDowntime: 24,
    dataLossToleranceHours: 4,
    peakLoadMultiplier: 2,
    seasonalVariance: 0.3,
    regulatoryStressFactor: 1.2,
    majorIncidentsPerYear: 3,
    avgIncidentCostM: 4.5,
    requiredUptime: 0.99,
    redundancyLevel: 'n+1',
  },
  'energy': {
    id: 'energy',
    name: 'Energy / Utilities',
    systemFailureRate: 0.02,
    processFailureRate: 0.04,
    humanErrorRate: 0.12,
    avgRecoveryHours: 6,
    maxTolerableDowntime: 0.5,
    dataLossToleranceHours: 0,
    peakLoadMultiplier: 3,
    seasonalVariance: 0.5,
    regulatoryStressFactor: 2.0,
    majorIncidentsPerYear: 1,
    avgIncidentCostM: 15.0,
    requiredUptime: 0.99999,
    redundancyLevel: 'multi-region',
  },
  'logistics': {
    id: 'logistics',
    name: 'Logistics / Supply Chain',
    systemFailureRate: 0.05,
    processFailureRate: 0.15,
    humanErrorRate: 0.22,
    avgRecoveryHours: 4,
    maxTolerableDowntime: 8,
    dataLossToleranceHours: 2,
    peakLoadMultiplier: 8,
    seasonalVariance: 0.6,
    regulatoryStressFactor: 1.1,
    majorIncidentsPerYear: 4,
    avgIncidentCostM: 2.8,
    requiredUptime: 0.995,
    redundancyLevel: 'n+1',
  },
  'general': {
    id: 'general',
    name: 'General / Cross-Industry',
    systemFailureRate: 0.04,
    processFailureRate: 0.1,
    humanErrorRate: 0.2,
    avgRecoveryHours: 4,
    maxTolerableDowntime: 8,
    dataLossToleranceHours: 2,
    peakLoadMultiplier: 5,
    seasonalVariance: 0.3,
    regulatoryStressFactor: 1.0,
    majorIncidentsPerYear: 3,
    avgIncidentCostM: 4.4,
    requiredUptime: 0.99,
    redundancyLevel: 'basic',
  },
};

export interface CrucibleMode {
  id: string;
  name: string;
  emoji: string;
  color: string;
  primeDirective: string;
  description: string;
  shortDesc: string;
  useCases: string[];
  // Stress test parameters
  severity: 'gentle' | 'moderate' | 'severe' | 'extreme' | 'catastrophic';
  loadMultiplier: number; // Multiplier on normal load (1-100)
  failureInjectionRate: number; // Probability of injected failures (0-1)
  cascadeDepth: number; // How many levels of cascade to simulate (1-5)
  simultaneousFailures: number; // Number of concurrent failures to simulate
  // Test characteristics
  testDuration: 'minutes' | 'hours' | 'days' | 'weeks';
  recoveryValidation: boolean; // Whether to test recovery procedures
  dataIntegrityCheck: boolean; // Whether to validate data integrity
  // Failure scenarios to include
  scenarioTypes: ('load' | 'failure' | 'cascade' | 'security' | 'data' | 'human' | 'external')[];
  // Industry benchmark multipliers
  benchmarkMultipliers: {
    loadStress: number;
    failureRate: number;
    recoveryTime: number;
    cascadeRisk: number;
  };
  isCore?: boolean;
  fieldTooltips: {
    target: string;
    scenario: string;
    successCriteria: string;
    constraints: string;
    rollback: string;
  };
  placeholders: {
    target: string;
    scenario: string;
    successCriteria: string;
  };
}

export const CRUCIBLE_MODE_CATEGORIES = {
  'Performance': ['load-test', 'spike-test', 'soak-test', 'capacity-planning'],
  'Resilience': ['chaos-engineering', 'failover-test', 'disaster-recovery', 'data-integrity'],
  'Process': ['runbook-validation', 'incident-response', 'communication-test'],
  'Extreme': ['black-friday', 'total-outage', 'apocalypse-drill'],
} as const;

export const CORE_CRUCIBLE_MODES = [
  'load-test',
  'chaos-engineering',
  'failover-test',
  'disaster-recovery',
  'incident-response',
] as const;

export const CRUCIBLE_MODES: Record<string, CrucibleMode> = {
  'load-test': {
    id: 'load-test',
    name: 'Load Test',
    emoji: '📊',
    color: '#3B82F6',
    primeDirective: 'Know Your Limits',
    description: 'Baseline performance testing under expected load. Identifies bottlenecks and establishes performance benchmarks.',
    shortDesc: 'Performance baseline',
    useCases: ['Capacity planning', 'Performance benchmarking', 'Bottleneck identification', 'SLA validation'],
    severity: 'gentle',
    loadMultiplier: 1.5,
    failureInjectionRate: 0,
    cascadeDepth: 1,
    simultaneousFailures: 0,
    testDuration: 'hours',
    recoveryValidation: false,
    dataIntegrityCheck: true,
    scenarioTypes: ['load'],
    benchmarkMultipliers: { loadStress: 1.0, failureRate: 0.5, recoveryTime: 0.8, cascadeRisk: 0.5 },
    isCore: true,
    fieldTooltips: {
      target: 'What system or service are you testing? Define the specific endpoints, APIs, or processes.',
      scenario: 'Describe the load profile: concurrent users, requests per second, data volume.',
      successCriteria: 'Define pass/fail criteria: response time thresholds, error rates, resource utilization limits.',
      constraints: 'Specify test boundaries: production vs. staging, time windows, data considerations.',
      rollback: 'How will you stop the test if issues arise? Define abort criteria.',
    },
    placeholders: {
      target: 'e.g., Order processing API and payment gateway integration',
      scenario: 'e.g., 1000 concurrent users, 500 orders/minute, 2-hour sustained load',
      successCriteria: 'e.g., P95 latency <500ms, error rate <0.1%, CPU <80%',
    },
  },

  'spike-test': {
    id: 'spike-test',
    name: 'Spike Test',
    emoji: '⚡',
    color: '#F59E0B',
    primeDirective: 'Handle the Surge',
    description: 'Tests system behavior under sudden load spikes. Validates auto-scaling and graceful degradation.',
    shortDesc: 'Sudden load spikes',
    useCases: ['Auto-scaling validation', 'Flash sale preparation', 'Viral content handling', 'DDoS resilience'],
    severity: 'moderate',
    loadMultiplier: 10,
    failureInjectionRate: 0.05,
    cascadeDepth: 2,
    simultaneousFailures: 1,
    testDuration: 'minutes',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['load', 'cascade'],
    benchmarkMultipliers: { loadStress: 2.0, failureRate: 0.8, recoveryTime: 1.0, cascadeRisk: 1.0 },
    fieldTooltips: {
      target: 'What system needs to handle sudden traffic spikes? Include all components in the request path.',
      scenario: 'Define the spike: magnitude (10x, 50x, 100x), ramp time (instant, 1 min, 5 min), duration.',
      successCriteria: 'How should the system behave? Scale up time, graceful degradation, queue behavior.',
      constraints: 'Define cost limits for auto-scaling, acceptable degradation modes.',
      rollback: 'How will you drain traffic if the system fails? Load balancer controls, feature flags.',
    },
    placeholders: {
      target: 'e.g., Product catalog and checkout flow for flash sale',
      scenario: 'e.g., 50x normal traffic spike over 30 seconds, sustained for 15 minutes',
      successCriteria: 'e.g., Scale to handle spike within 2 minutes, no data loss, graceful queue if overwhelmed',
    },
  },

  'soak-test': {
    id: 'soak-test',
    name: 'Soak Test',
    emoji: '🕐',
    color: '#8B5CF6',
    primeDirective: 'Endurance Matters',
    description: 'Extended duration testing to identify memory leaks, resource exhaustion, and degradation over time.',
    shortDesc: 'Long-duration stability',
    useCases: ['Memory leak detection', 'Resource exhaustion', 'Long-running process stability', 'Connection pool issues'],
    severity: 'moderate',
    loadMultiplier: 1.2,
    failureInjectionRate: 0.01,
    cascadeDepth: 2,
    simultaneousFailures: 0,
    testDuration: 'days',
    recoveryValidation: false,
    dataIntegrityCheck: true,
    scenarioTypes: ['load', 'data'],
    benchmarkMultipliers: { loadStress: 0.8, failureRate: 1.2, recoveryTime: 1.0, cascadeRisk: 0.8 },
    fieldTooltips: {
      target: 'What system needs long-term stability validation? Focus on stateful components.',
      scenario: 'Define the sustained load and duration: typical load for 24/48/72 hours.',
      successCriteria: 'What metrics indicate degradation? Memory growth, response time drift, error rate increase.',
      constraints: 'Define monitoring frequency, alerting thresholds, and intervention criteria.',
      rollback: 'How will you handle degradation? Restart procedures, failover triggers.',
    },
    placeholders: {
      target: 'e.g., Background job processing system and message queue',
      scenario: 'e.g., Normal production load sustained for 72 hours with hourly metric snapshots',
      successCriteria: 'e.g., No memory growth >10%, no response time degradation >20%, zero OOM events',
    },
  },

  'capacity-planning': {
    id: 'capacity-planning',
    name: 'Capacity Planning',
    emoji: '📈',
    color: '#10B981',
    primeDirective: 'Plan for Growth',
    description: 'Determines system capacity limits and growth headroom. Informs infrastructure investment decisions.',
    shortDesc: 'Growth planning',
    useCases: ['Infrastructure planning', 'Budget forecasting', 'Growth preparation', 'SLA commitment'],
    severity: 'gentle',
    loadMultiplier: 3,
    failureInjectionRate: 0,
    cascadeDepth: 1,
    simultaneousFailures: 0,
    testDuration: 'hours',
    recoveryValidation: false,
    dataIntegrityCheck: true,
    scenarioTypes: ['load'],
    benchmarkMultipliers: { loadStress: 1.5, failureRate: 0.5, recoveryTime: 0.8, cascadeRisk: 0.6 },
    fieldTooltips: {
      target: 'What system\'s capacity are you measuring? Include all bottleneck candidates.',
      scenario: 'Define growth scenarios: 2x, 5x, 10x current load. Include data growth projections.',
      successCriteria: 'What capacity do you need? Define target headroom (e.g., 50% buffer above peak).',
      constraints: 'Define budget constraints, timeline for capacity additions, acceptable degradation points.',
      rollback: 'N/A for capacity planning - this is measurement, not stress.',
    },
    placeholders: {
      target: 'e.g., Database cluster, API gateway, and CDN for projected 3x growth',
      scenario: 'e.g., Simulate 2x, 3x, 5x current peak load to find breaking points',
      successCriteria: 'e.g., Identify capacity ceiling, cost per additional 1000 users, scaling timeline',
    },
  },

  'chaos-engineering': {
    id: 'chaos-engineering',
    name: 'Chaos Engineering',
    emoji: '🎲',
    color: '#EF4444',
    primeDirective: 'Embrace Failure',
    description: 'Controlled failure injection to test system resilience. Validates fault tolerance and recovery mechanisms.',
    shortDesc: 'Controlled chaos',
    useCases: ['Fault tolerance validation', 'Resilience testing', 'Failure mode discovery', 'Recovery validation'],
    severity: 'severe',
    loadMultiplier: 1.5,
    failureInjectionRate: 0.2,
    cascadeDepth: 3,
    simultaneousFailures: 2,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['failure', 'cascade', 'data'],
    benchmarkMultipliers: { loadStress: 1.0, failureRate: 2.0, recoveryTime: 1.2, cascadeRisk: 1.5 },
    isCore: true,
    fieldTooltips: {
      target: 'What system\'s resilience are you testing? Define the blast radius boundaries.',
      scenario: 'What failures will you inject? Server crashes, network partitions, disk failures, latency.',
      successCriteria: 'How should the system respond? Automatic recovery, graceful degradation, alerting.',
      constraints: 'Define blast radius limits, customer impact boundaries, abort criteria.',
      rollback: 'How will you stop chaos and restore normal operation? Kill switches, feature flags.',
    },
    placeholders: {
      target: 'e.g., Microservices cluster with focus on payment and inventory services',
      scenario: 'e.g., Random pod termination, network latency injection, database failover',
      successCriteria: 'e.g., Auto-recovery within 30 seconds, no customer-visible errors, alerts fire correctly',
    },
  },

  'failover-test': {
    id: 'failover-test',
    name: 'Failover Test',
    emoji: '🔄',
    color: '#06B6D4',
    primeDirective: 'Seamless Transition',
    description: 'Tests failover to backup systems. Validates high availability configuration and recovery time.',
    shortDesc: 'HA validation',
    useCases: ['DR validation', 'HA testing', 'Database failover', 'Region failover'],
    severity: 'moderate',
    loadMultiplier: 1.0,
    failureInjectionRate: 1.0,
    cascadeDepth: 2,
    simultaneousFailures: 1,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['failure', 'data'],
    benchmarkMultipliers: { loadStress: 0.8, failureRate: 1.5, recoveryTime: 1.5, cascadeRisk: 1.0 },
    isCore: true,
    fieldTooltips: {
      target: 'What primary system are you failing over? Define primary and secondary/backup systems.',
      scenario: 'What failure triggers failover? Complete outage, degraded performance, manual trigger.',
      successCriteria: 'Define RTO (recovery time) and RPO (data loss) requirements.',
      constraints: 'Define acceptable customer impact, maintenance window requirements.',
      rollback: 'How will you fail back to primary? Automatic or manual? Data sync requirements.',
    },
    placeholders: {
      target: 'e.g., Primary database cluster failing over to read replica',
      scenario: 'e.g., Simulate primary database failure, validate automatic promotion of replica',
      successCriteria: 'e.g., Failover complete in <60 seconds, zero data loss, all connections re-established',
    },
  },

  'disaster-recovery': {
    id: 'disaster-recovery',
    name: 'Disaster Recovery',
    emoji: '🏚️',
    color: '#DC2626',
    primeDirective: 'Rise from the Ashes',
    description: 'Full disaster recovery drill. Tests complete system restoration from backups in alternate location.',
    shortDesc: 'Full DR drill',
    useCases: ['DR plan validation', 'Backup restoration', 'Region recovery', 'Compliance requirement'],
    severity: 'extreme',
    loadMultiplier: 0.5,
    failureInjectionRate: 1.0,
    cascadeDepth: 5,
    simultaneousFailures: 10,
    testDuration: 'days',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['failure', 'cascade', 'data', 'external'],
    benchmarkMultipliers: { loadStress: 0.5, failureRate: 3.0, recoveryTime: 2.0, cascadeRisk: 2.0 },
    isCore: true,
    fieldTooltips: {
      target: 'What is the scope of the DR drill? Full environment or specific critical systems?',
      scenario: 'What disaster scenario? Data center loss, region outage, ransomware, natural disaster.',
      successCriteria: 'Define RTO and RPO. What functionality must be restored? In what order?',
      constraints: 'Define DR budget, alternate site capabilities, data sovereignty requirements.',
      rollback: 'How will you return to normal operations after the drill? Data sync, DNS cutover.',
    },
    placeholders: {
      target: 'e.g., Complete production environment recovery in DR region',
      scenario: 'e.g., Simulate complete loss of primary data center, recover from backups in DR site',
      successCriteria: 'e.g., Full recovery in <4 hours, data loss <1 hour, all critical functions operational',
    },
  },

  'data-integrity': {
    id: 'data-integrity',
    name: 'Data Integrity',
    emoji: '🔐',
    color: '#6366F1',
    primeDirective: 'Trust Your Data',
    description: 'Tests data consistency and integrity under stress. Validates ACID properties and replication.',
    shortDesc: 'Data consistency',
    useCases: ['Database validation', 'Replication testing', 'Consistency checks', 'Corruption detection'],
    severity: 'moderate',
    loadMultiplier: 2.0,
    failureInjectionRate: 0.1,
    cascadeDepth: 2,
    simultaneousFailures: 1,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['data', 'failure'],
    benchmarkMultipliers: { loadStress: 1.0, failureRate: 1.0, recoveryTime: 1.0, cascadeRisk: 0.8 },
    fieldTooltips: {
      target: 'What data stores are you testing? Include all replicas and caches.',
      scenario: 'What integrity scenarios? Concurrent writes, network partitions, partial failures.',
      successCriteria: 'Define consistency requirements: strong, eventual, causal. Acceptable lag.',
      constraints: 'Define data sensitivity, compliance requirements, audit needs.',
      rollback: 'How will you detect and recover from data corruption? Checksums, reconciliation.',
    },
    placeholders: {
      target: 'e.g., Primary database, read replicas, and Redis cache layer',
      scenario: 'e.g., High write load with simulated network partitions between replicas',
      successCriteria: 'e.g., Zero data loss, replication lag <5 seconds, automatic corruption detection',
    },
  },

  'runbook-validation': {
    id: 'runbook-validation',
    name: 'Runbook Validation',
    emoji: '📖',
    color: '#22C55E',
    primeDirective: 'Procedures That Work',
    description: 'Tests operational runbooks and procedures. Validates that documented steps actually work.',
    shortDesc: 'Procedure testing',
    useCases: ['Runbook accuracy', 'On-call preparation', 'Knowledge transfer', 'Compliance documentation'],
    severity: 'gentle',
    loadMultiplier: 1.0,
    failureInjectionRate: 0.5,
    cascadeDepth: 2,
    simultaneousFailures: 1,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: false,
    scenarioTypes: ['failure', 'human'],
    benchmarkMultipliers: { loadStress: 0.5, failureRate: 1.0, recoveryTime: 1.5, cascadeRisk: 0.8 },
    fieldTooltips: {
      target: 'Which runbooks are you validating? List specific procedures and scenarios.',
      scenario: 'What failure scenario does the runbook address? Recreate the trigger conditions.',
      successCriteria: 'Can the runbook be followed by someone unfamiliar? Time to resolution?',
      constraints: 'Define who should be able to execute: on-call, any engineer, specific team.',
      rollback: 'What if the runbook fails? Escalation path, backup procedures.',
    },
    placeholders: {
      target: 'e.g., Database failover runbook and cache invalidation procedure',
      scenario: 'e.g., Simulate primary database failure, have on-call follow runbook to recover',
      successCriteria: 'e.g., Junior engineer can complete in <30 minutes, all steps accurate and current',
    },
  },

  'incident-response': {
    id: 'incident-response',
    name: 'Incident Response',
    emoji: '🚨',
    color: '#B91C1C',
    primeDirective: 'Respond Under Pressure',
    description: 'Tests incident response process end-to-end. Validates detection, communication, and resolution.',
    shortDesc: 'IR drill',
    useCases: ['IR process validation', 'Communication testing', 'Escalation paths', 'Post-incident review'],
    severity: 'severe',
    loadMultiplier: 1.5,
    failureInjectionRate: 0.3,
    cascadeDepth: 3,
    simultaneousFailures: 2,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['failure', 'cascade', 'human', 'security'],
    benchmarkMultipliers: { loadStress: 1.0, failureRate: 1.5, recoveryTime: 1.3, cascadeRisk: 1.2 },
    isCore: true,
    fieldTooltips: {
      target: 'What incident scenario are you drilling? Define the simulated incident.',
      scenario: 'Describe the incident: symptoms, root cause, affected systems, customer impact.',
      successCriteria: 'Define success: detection time, response time, communication quality, resolution.',
      constraints: 'Define drill scope: tabletop vs. live, customer notification, external communication.',
      rollback: 'How will you end the drill? Clear communication that drill is complete.',
    },
    placeholders: {
      target: 'e.g., Simulated security incident with data exfiltration indicators',
      scenario: 'e.g., Inject anomalous data access patterns, test SOC detection and IR team response',
      successCriteria: 'e.g., Detection in <15 minutes, IR team engaged in <30 minutes, contained in <2 hours',
    },
  },

  'communication-test': {
    id: 'communication-test',
    name: 'Communication Test',
    emoji: '📢',
    color: '#0EA5E9',
    primeDirective: 'Everyone Knows',
    description: 'Tests incident communication channels and procedures. Validates stakeholder notification.',
    shortDesc: 'Comms drill',
    useCases: ['Status page testing', 'Escalation paths', 'Customer communication', 'Internal notification'],
    severity: 'gentle',
    loadMultiplier: 1.0,
    failureInjectionRate: 0.1,
    cascadeDepth: 1,
    simultaneousFailures: 0,
    testDuration: 'minutes',
    recoveryValidation: false,
    dataIntegrityCheck: false,
    scenarioTypes: ['human'],
    benchmarkMultipliers: { loadStress: 0.3, failureRate: 0.5, recoveryTime: 0.8, cascadeRisk: 0.5 },
    fieldTooltips: {
      target: 'What communication channels are you testing? Status page, email, Slack, phone tree.',
      scenario: 'What incident type requires this communication? Define the message content.',
      successCriteria: 'Define success: delivery time, reach, acknowledgment, accuracy.',
      constraints: 'Define who should NOT be notified (customers, press) during drill.',
      rollback: 'How will you clarify this was a drill? Follow-up communication.',
    },
    placeholders: {
      target: 'e.g., Internal incident Slack channel, status page, and executive notification',
      scenario: 'e.g., Simulate P1 outage, test notification delivery and acknowledgment',
      successCriteria: 'e.g., All stakeholders notified in <5 minutes, 90% acknowledgment in <15 minutes',
    },
  },

  'black-friday': {
    id: 'black-friday',
    name: 'Black Friday',
    emoji: '🛒',
    color: '#1F2937',
    primeDirective: 'Peak Performance',
    description: 'Simulates peak seasonal load. Tests system behavior at maximum expected capacity.',
    shortDesc: 'Peak load simulation',
    useCases: ['Holiday preparation', 'Launch day readiness', 'Peak event planning', 'Capacity validation'],
    severity: 'extreme',
    loadMultiplier: 20,
    failureInjectionRate: 0.1,
    cascadeDepth: 3,
    simultaneousFailures: 2,
    testDuration: 'hours',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['load', 'cascade', 'failure'],
    benchmarkMultipliers: { loadStress: 3.0, failureRate: 1.5, recoveryTime: 1.2, cascadeRisk: 1.5 },
    fieldTooltips: {
      target: 'What systems face peak load? Include all components in the critical path.',
      scenario: 'Define peak scenario: expected traffic, transaction volume, data growth.',
      successCriteria: 'Define success: response times, error rates, revenue protection.',
      constraints: 'Define budget for temporary capacity, acceptable degradation modes.',
      rollback: 'How will you shed load if overwhelmed? Queue, throttle, feature disable.',
    },
    placeholders: {
      target: 'e.g., Complete e-commerce stack: catalog, cart, checkout, payment, fulfillment',
      scenario: 'e.g., 20x normal traffic, 50x checkout volume, sustained for 8 hours',
      successCriteria: 'e.g., <2 second page loads, <0.1% checkout errors, zero payment failures',
    },
  },

  'total-outage': {
    id: 'total-outage',
    name: 'Total Outage',
    emoji: '💀',
    color: '#7F1D1D',
    primeDirective: 'Survive the Worst',
    description: 'Simulates complete system failure. Tests cold start recovery and business continuity.',
    shortDesc: 'Complete failure',
    useCases: ['Business continuity', 'Cold start validation', 'Manual fallback', 'Insurance assessment'],
    severity: 'catastrophic',
    loadMultiplier: 0,
    failureInjectionRate: 1.0,
    cascadeDepth: 5,
    simultaneousFailures: 100,
    testDuration: 'days',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['failure', 'cascade', 'data', 'external', 'human'],
    benchmarkMultipliers: { loadStress: 0.0, failureRate: 5.0, recoveryTime: 3.0, cascadeRisk: 3.0 },
    fieldTooltips: {
      target: 'What is the scope of total outage? All systems, specific region, specific service.',
      scenario: 'What causes total outage? Data center loss, ransomware, catastrophic bug, vendor failure.',
      successCriteria: 'Define recovery priorities: what comes back first? In what order? Timeline.',
      constraints: 'Define manual fallback procedures, communication plans, customer expectations.',
      rollback: 'N/A - this tests recovery from total failure.',
    },
    placeholders: {
      target: 'e.g., Complete loss of primary data center and all running services',
      scenario: 'e.g., Simulate total data center failure, recover from cold backups',
      successCriteria: 'e.g., Critical services in 4 hours, full recovery in 24 hours, data loss <1 hour',
    },
  },

  'apocalypse-drill': {
    id: 'apocalypse-drill',
    name: 'Apocalypse Drill',
    emoji: '☠️',
    color: '#450A0A',
    primeDirective: 'When Everything Fails',
    description: 'Maximum severity test combining multiple simultaneous failures. Tests organizational resilience.',
    shortDesc: 'Everything fails',
    useCases: ['Ultimate resilience test', 'Board demonstration', 'Insurance validation', 'Regulatory stress test'],
    severity: 'catastrophic',
    loadMultiplier: 10,
    failureInjectionRate: 0.5,
    cascadeDepth: 5,
    simultaneousFailures: 10,
    testDuration: 'days',
    recoveryValidation: true,
    dataIntegrityCheck: true,
    scenarioTypes: ['load', 'failure', 'cascade', 'security', 'data', 'human', 'external'],
    benchmarkMultipliers: { loadStress: 2.5, failureRate: 4.0, recoveryTime: 2.5, cascadeRisk: 3.0 },
    fieldTooltips: {
      target: 'EVERYTHING. This tests organizational resilience, not just systems.',
      scenario: 'Combine scenarios: DDoS + ransomware + key person unavailable + vendor outage.',
      successCriteria: 'Define survival: what must remain operational? What losses are acceptable?',
      constraints: 'CRITICAL: Define safety boundaries, real vs. simulated, abort criteria.',
      rollback: 'Define clear end-of-drill procedures and return to normal operations.',
    },
    placeholders: {
      target: 'e.g., Full organization: systems, processes, people, vendors, communications',
      scenario: 'e.g., Simultaneous DDoS, ransomware detection, key engineer unavailable, cloud provider degraded',
      successCriteria: 'e.g., Maintain customer communication, protect data, recover critical functions in 8 hours',
    },
  },
};

// Helper functions
export const isCoreMode = (modeId: string): boolean => 
  CORE_CRUCIBLE_MODES.includes(modeId as any);

export const getModesByCategory = (category: keyof typeof CRUCIBLE_MODE_CATEGORIES): CrucibleMode[] =>
  CRUCIBLE_MODE_CATEGORIES[category].map(id => CRUCIBLE_MODES[id]).filter(Boolean);

export const getCoreModes = (): CrucibleMode[] =>
  CORE_CRUCIBLE_MODES.map(id => CRUCIBLE_MODES[id]);

export const getModeForTestType = (testType: string): string => {
  const mapping: Record<string, string> = {
    'performance': 'load-test',
    'load': 'load-test',
    'spike': 'spike-test',
    'soak': 'soak-test',
    'chaos': 'chaos-engineering',
    'failover': 'failover-test',
    'dr': 'disaster-recovery',
    'disaster': 'disaster-recovery',
    'incident': 'incident-response',
    'peak': 'black-friday',
    'outage': 'total-outage',
  };
  return mapping[testType] || 'load-test';
};

// Calculate stress score based on mode and industry
export const calculateStressScore = (
  mode: CrucibleMode,
  industry: IndustryFailureBenchmarks
): { score: number; riskLevel: string; recommendations: string[] } => {
  // Base score from mode severity
  const severityScores: Record<string, number> = {
    'gentle': 20,
    'moderate': 40,
    'severe': 60,
    'extreme': 80,
    'catastrophic': 100,
  };
  
  const baseScore = severityScores[mode.severity] || 50;
  
  // Adjust for industry requirements
  const industryMultiplier = (
    industry.regulatoryStressFactor * 
    (1 / industry.requiredUptime) * 
    mode.benchmarkMultipliers.loadStress
  );
  
  const adjustedScore = Math.min(100, baseScore * industryMultiplier);
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (mode.loadMultiplier > industry.peakLoadMultiplier) {
    recommendations.push(`Load multiplier (${mode.loadMultiplier}x) exceeds industry peak (${industry.peakLoadMultiplier}x)`);
  }
  if (mode.severity === 'extreme' || mode.severity === 'catastrophic') {
    recommendations.push('Consider tabletop exercise before live drill');
  }
  if (industry.maxTolerableDowntime < 4 && mode.testDuration === 'days') {
    recommendations.push(`Industry tolerance (${industry.maxTolerableDowntime}h) may conflict with test duration`);
  }
  if (mode.recoveryValidation) {
    recommendations.push(`Target RTO: ${industry.avgRecoveryHours} hours based on industry benchmark`);
  }
  
  // Determine risk level
  let riskLevel = 'Low';
  if (adjustedScore > 70) {riskLevel = 'Critical';}
  else if (adjustedScore > 50) {riskLevel = 'High';}
  else if (adjustedScore > 30) {riskLevel = 'Medium';}
  
  return {
    score: Math.round(adjustedScore),
    riskLevel,
    recommendations,
  };
};

// Get industry-specific benchmark insight
export const getIndustryBenchmarkInsight = (
  mode: CrucibleMode,
  industry: IndustryFailureBenchmarks
): string => {
  const uptime = (industry.requiredUptime * 100).toFixed(3);
  const recovery = industry.avgRecoveryHours;
  const incidents = industry.majorIncidentsPerYear;
  const cost = industry.avgIncidentCostM;
  
  return `${industry.name}: Required uptime ${uptime}%, avg recovery ${recovery}h, ~${incidents} major incidents/year ($${cost}M avg cost). ${mode.name} tests against ${mode.loadMultiplier}x load with ${(mode.failureInjectionRate * 100).toFixed(0)}% failure injection.`;
};
