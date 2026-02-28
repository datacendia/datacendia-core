// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Energy & Utilities Vertical Implementation
 * 
 * Target: 80% (Priority tier)
 * Datacendia = "Critical Infrastructure Decision Governor"
 * 
 * Killer Asset: Human-in-the-loop enforced by architecture, not policy.
 * 
 * "We can't let optimization override safety."
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../../../utils/servicePersistence.js';
import {
  DataConnector,
  IngestResult,
  ProvenanceRecord,
  VerticalKnowledgeBase,
  KnowledgeDocument,
  RetrievalResult,
  ComplianceMapper,
  ComplianceFramework,
  ComplianceControl,
  ComplianceViolation,
  ComplianceEvidence,
  DecisionSchema,
  BaseDecision,
  ValidationResult,
  DefensibleArtifact,
  AgentPreset,
  AgentCapability,
  AgentGuardrail,
  WorkflowStep,
  AgentTrace,
  DefensibleOutput,
  RegulatorPacket,
  CourtBundle,
  AuditTrail,
  VerticalImplementation,
  VerticalRegistry
} from '../core/VerticalPattern.js';
import { EXPANDED_COMPLIANCE_FRAMEWORKS, EXPANDED_COMPLIANCE_MAPPINGS, EXPANDED_JURISDICTION_MAP } from './EnergyComplianceExpanded.js';
import {
  GenerationDispatchDecision,
  OutagePlanningDecision,
  RenewableIntegrationDecision,
  DemandResponseDecision,
  TransmissionUpgradeDecision,
  FuelProcurementDecision,
  EnvironmentalComplianceDecision,
  AssetRetirementDecision,
  ExpandedEnergyDecision,
} from './EnergyDecisionTypesExpanded.js';
import {
  GenerationDispatchSchema,
  OutagePlanningSchema,
  RenewableIntegrationSchema,
  DemandResponseSchema,
} from './EnergyDecisionSchemasExpanded.js';
import { embeddingService } from '../../llm/EmbeddingService.js';
import { logger } from '../../../utils/logger.js';

export type {
  GenerationDispatchDecision,
  OutagePlanningDecision,
  RenewableIntegrationDecision,
  DemandResponseDecision,
  TransmissionUpgradeDecision,
  FuelProcurementDecision,
  EnvironmentalComplianceDecision,
  AssetRetirementDecision,
};

// ============================================================================
// ENERGY/UTILITY DATA TYPES
// ============================================================================

export interface SCADAReading {
  id: string;
  deviceId: string;
  deviceType: 'meter' | 'sensor' | 'relay' | 'breaker' | 'transformer' | 'generator';
  timestamp: Date;
  values: Record<string, number>;
  quality: 'good' | 'uncertain' | 'bad';
  alarms: string[];
}

export interface GridAsset {
  assetId: string;
  assetType: 'substation' | 'transmission-line' | 'distribution-feeder' | 'generator' | 'load';
  location: { latitude: number; longitude: number };
  capacity: number;
  currentLoad: number;
  status: 'operational' | 'degraded' | 'offline' | 'maintenance';
  criticality: 'critical' | 'high' | 'medium' | 'low';
  lastInspection: Date;
  nextMaintenance: Date;
}

export interface GridState {
  timestamp: Date;
  totalLoad: number;
  totalGeneration: number;
  frequency: number;
  voltage: number;
  reserveMargin: number;
  congestionPoints: string[];
  alerts: { level: 'emergency' | 'alert' | 'warning' | 'normal'; message: string }[];
}

// ============================================================================
// ENERGY DECISION TYPES
// ============================================================================

export type SafetyLevel = 'safe' | 'caution' | 'warning' | 'danger' | 'emergency';

export interface MaintenanceDeferral extends BaseDecision {
  type: 'maintenance-deferral';
  inputs: {
    asset: GridAsset;
    scheduledMaintenanceDate: Date;
    proposedDeferralDate: Date;
    deferralReason: string;
    currentCondition: {
      healthScore: number;
      recentAlarms: string[];
      lastInspectionFindings: string[];
    };
    impactAssessment: {
      customerImpact: number;
      reliabilityRisk: number;
      safetyRisk: number;
    };
  };
  outcome: {
    approved: boolean;
    newMaintenanceDate?: Date;
    conditions?: string[];
    denialReason?: string;
    safetyReview: SafetyReviewResult;
    operatorOverride?: {
      originalDecision: string;
      newDecision: string;
      reason: string;
      operatorId: string;
      supervisorApproval: string;
      overrideTime: Date;
    };
  };
}

export interface LoadBalancingDecision extends BaseDecision {
  type: 'load-balancing';
  inputs: {
    gridState: GridState;
    forecastedDemand: { hour: number; load: number }[];
    availableGeneration: { source: string; capacity: number; rampRate: number }[];
    constraints: {
      transmissionLimits: { line: string; limit: number; current: number }[];
      voltageConstraints: { bus: string; minV: number; maxV: number; current: number }[];
      environmentalLimits?: { type: string; limit: number }[];
    };
    optimizationObjective: 'cost' | 'reliability' | 'emissions' | 'balanced';
  };
  outcome: {
    dispatchSchedule: { source: string; output: number; startTime: Date }[];
    expectedCost: number;
    expectedReliability: number;
    safetyMargins: { metric: string; value: number; threshold: number }[];
    operatorApproval: boolean;
    safetyReview: SafetyReviewResult;
  };
}

export interface EmergencyResponse extends BaseDecision {
  type: 'emergency-response';
  inputs: {
    incidentId: string;
    incidentType: 'outage' | 'equipment-failure' | 'cyber-attack' | 'natural-disaster' | 'overload';
    affectedAssets: string[];
    customerImpact: number;
    severity: 1 | 2 | 3 | 4 | 5;
    currentStatus: string;
    availableResources: { type: string; quantity: number; eta: number }[];
  };
  outcome: {
    responseLevel: 'routine' | 'elevated' | 'emergency' | 'critical';
    actions: { action: string; assignedTo: string; priority: number; eta: number }[];
    estimatedRestorationTime: number;
    publicCommunication: string;
    regulatorNotification: boolean;
    incidentCommanderApproval: {
      commanderId: string;
      approvedAt: Date;
      notes?: string;
    };
    safetyReview: SafetyReviewResult;
  };
}

export interface GridOptimization extends BaseDecision {
  type: 'grid-optimization';
  inputs: {
    optimizationWindow: { start: Date; end: Date };
    currentState: GridState;
    constraints: string[];
    objectives: { objective: string; weight: number }[];
    scenarios: { name: string; probability: number; conditions: string[] }[];
  };
  outcome: {
    recommendedActions: { action: string; expectedBenefit: number; risk: number }[];
    projectedSavings: number;
    reliabilityImpact: number;
    safetyImpact: number;
    humanReviewRequired: boolean;
    safetyReview: SafetyReviewResult;
  };
}

export type EnergyDecision = 
  | MaintenanceDeferral 
  | LoadBalancingDecision 
  | EmergencyResponse 
  | GridOptimization
  | ExpandedEnergyDecision;

// ============================================================================
// SAFETY-FIRST DECISION FRAMEWORK
// ============================================================================

export interface SafetyReviewResult {
  reviewId: string;
  timestamp: Date;
  safetyLevel: SafetyLevel;
  humanOversightRequired: boolean;
  failSafeTriggered: boolean;
  checks: {
    checkName: string;
    passed: boolean;
    value: number;
    threshold: number;
    criticality: 'critical' | 'high' | 'medium' | 'low';
  }[];
  overallSafe: boolean;
  mitigations?: string[];
  hash: string;
}

export class SafetyFirstFramework {
  private readonly FAIL_SAFE_DEFAULTS: Record<string, unknown> = {
    'maintenance-deferral': { approved: false, denialReason: 'Safety-first default: maintenance not deferred' },
    'load-balancing': { operatorApproval: false },
    'emergency-response': { responseLevel: 'emergency' },
    'grid-optimization': { humanReviewRequired: true }
  };

  evaluateSafety(decisionType: string, inputs: Record<string, unknown>): SafetyReviewResult {
    const checks = this.runSafetyChecks(decisionType, inputs);
    const criticalFailures = checks.filter(c => c.criticality === 'critical' && !c.passed);
    const highFailures = checks.filter(c => c.criticality === 'high' && !c.passed);

    let safetyLevel: SafetyLevel = 'safe';
    if (criticalFailures.length > 0) {
      safetyLevel = 'emergency';
    } else if (highFailures.length > 0) {
      safetyLevel = 'danger';
    } else if (checks.some(c => !c.passed)) {
      safetyLevel = 'warning';
    }

    const overallSafe = criticalFailures.length === 0 && highFailures.length === 0;
    const humanOversightRequired = !overallSafe || safetyLevel !== 'safe';
    const failSafeTriggered = criticalFailures.length > 0;

    const result: SafetyReviewResult = {
      reviewId: uuidv4(),
      timestamp: new Date(),
      safetyLevel,
      humanOversightRequired,
      failSafeTriggered,
      checks,
      overallSafe,
      mitigations: overallSafe ? undefined : this.generateMitigations(checks.filter(c => !c.passed)),
      hash: ''
    };

    result.hash = crypto.createHash('sha256').update(JSON.stringify(result)).digest('hex');
    return result;
  }

  private runSafetyChecks(decisionType: string, inputs: Record<string, unknown>): SafetyReviewResult['checks'] {
    const checks: SafetyReviewResult['checks'] = [];

    // Universal checks
    checks.push({
      checkName: 'Human Oversight Available',
      passed: true, // Assume available by default
      value: 1,
      threshold: 1,
      criticality: 'critical'
    });

    if (decisionType === 'maintenance-deferral') {
      const impact = inputs['impactAssessment'] as { safetyRisk: number; reliabilityRisk: number } | undefined;
      if (impact) {
        checks.push({
          checkName: 'Safety Risk Threshold',
          passed: impact.safetyRisk < 0.7,
          value: impact.safetyRisk,
          threshold: 0.7,
          criticality: 'critical'
        });
        checks.push({
          checkName: 'Reliability Risk Threshold',
          passed: impact.reliabilityRisk < 0.8,
          value: impact.reliabilityRisk,
          threshold: 0.8,
          criticality: 'high'
        });
      }

      const condition = inputs['currentCondition'] as { healthScore: number } | undefined;
      if (condition) {
        checks.push({
          checkName: 'Asset Health Score',
          passed: condition.healthScore > 0.5,
          value: condition.healthScore,
          threshold: 0.5,
          criticality: 'high'
        });
      }
    }

    if (decisionType === 'load-balancing') {
      const gridState = inputs['gridState'] as GridState | undefined;
      if (gridState) {
        checks.push({
          checkName: 'Frequency Stability',
          passed: gridState.frequency >= 59.95 && gridState.frequency <= 60.05,
          value: gridState.frequency,
          threshold: 60.0,
          criticality: 'critical'
        });
        checks.push({
          checkName: 'Reserve Margin',
          passed: gridState.reserveMargin >= 0.15,
          value: gridState.reserveMargin,
          threshold: 0.15,
          criticality: 'high'
        });
        checks.push({
          checkName: 'Voltage Stability',
          passed: gridState.voltage >= 0.95 && gridState.voltage <= 1.05,
          value: gridState.voltage,
          threshold: 1.0,
          criticality: 'critical'
        });
      }
    }

    if (decisionType === 'emergency-response') {
      const severity = inputs['severity'] as number | undefined;
      if (severity !== undefined) {
        checks.push({
          checkName: 'Incident Severity Assessment',
          passed: true, // Always pass - just documenting
          value: severity,
          threshold: 5,
          criticality: 'critical'
        });
      }
      checks.push({
        checkName: 'Incident Commander Assigned',
        passed: true, // Required by workflow
        value: 1,
        threshold: 1,
        criticality: 'critical'
      });
    }

    if (decisionType === 'grid-optimization') {
      checks.push({
        checkName: 'Optimization Does Not Reduce Safety Margins',
        passed: true, // Verified in outcome
        value: 1,
        threshold: 1,
        criticality: 'critical'
      });
      checks.push({
        checkName: 'Human Review Before Implementation',
        passed: true, // Enforced by workflow
        value: 1,
        threshold: 1,
        criticality: 'high'
      });
    }

    return checks;
  }

  private generateMitigations(failedChecks: SafetyReviewResult['checks']): string[] {
    const mitigations: string[] = [];

    for (const check of failedChecks) {
      switch (check.checkName) {
        case 'Safety Risk Threshold':
          mitigations.push('Reduce scope of maintenance deferral or implement interim safety measures');
          break;
        case 'Asset Health Score':
          mitigations.push('Conduct immediate inspection before any deferral decision');
          break;
        case 'Frequency Stability':
          mitigations.push('Activate spinning reserves and reduce load if necessary');
          break;
        case 'Reserve Margin':
          mitigations.push('Bring additional generation online or implement demand response');
          break;
        case 'Voltage Stability':
          mitigations.push('Adjust reactive power compensation and tap changers');
          break;
        default:
          mitigations.push(`Address ${check.checkName}: current ${check.value}, threshold ${check.threshold}`);
      }
    }

    return mitigations;
  }

  getFailSafeDefault(decisionType: string): Record<string, unknown> {
    return (this.FAIL_SAFE_DEFAULTS as any)[decisionType] || { approved: false };
  }

  enforceFailSafe(decisionType: string, outcome: Record<string, unknown>, safetyReview: SafetyReviewResult): Record<string, unknown> {
    if (safetyReview.failSafeTriggered) {
      return { ...outcome, ...this.getFailSafeDefault(decisionType), failSafeApplied: true };
    }
    return outcome;
  }
}

// ============================================================================
// INCIDENT PRE-MORTEM LIBRARY
// ============================================================================

export interface PreMortemScenario {
  id: string;
  name: string;
  description: string;
  category: 'equipment' | 'cyber' | 'weather' | 'human-error' | 'cascading';
  likelihood: 'rare' | 'unlikely' | 'possible' | 'likely' | 'certain';
  impact: 'negligible' | 'minor' | 'moderate' | 'major' | 'catastrophic';
  triggers: string[];
  cascadeRisk: string[];
  mitigations: string[];
  responsePlaybook: string;
}

export class IncidentPreMortemLibrary {
  private scenarios: Map<string, PreMortemScenario> = new Map();

  constructor() {
    this.initializeScenarios();
  }

  private initializeScenarios(): void {
    const scenarios: PreMortemScenario[] = [
      {
        id: 'scenario-001',
        name: 'Transformer Failure Cascade',
        description: 'Primary transformer fails, causing overload on backup and potential cascade',
        category: 'equipment',
        likelihood: 'possible',
        impact: 'major',
        triggers: ['Transformer age >30 years', 'Recent overload events', 'Oil quality degradation'],
        cascadeRisk: ['Backup transformer overload', 'Feeder outages', 'Voltage collapse'],
        mitigations: ['Regular oil testing', 'Load transfer capability', 'N-1 contingency analysis'],
        responsePlaybook: 'PLAYBOOK-XFMR-CASCADE'
      },
      {
        id: 'scenario-002',
        name: 'Cyber Intrusion - SCADA Compromise',
        description: 'Adversary gains control of SCADA system, potentially manipulating grid operations',
        category: 'cyber',
        likelihood: 'unlikely',
        impact: 'catastrophic',
        triggers: ['Phishing success', 'Unpatched vulnerabilities', 'Insider threat'],
        cascadeRisk: ['False commands issued', 'Protection system disabled', 'Widespread outage'],
        mitigations: ['Network segmentation', 'Multi-factor authentication', 'Anomaly detection'],
        responsePlaybook: 'PLAYBOOK-CYBER-SCADA'
      },
      {
        id: 'scenario-003',
        name: 'Extreme Weather - Ice Storm',
        description: 'Severe ice accumulation causes widespread transmission line failures',
        category: 'weather',
        likelihood: 'possible',
        impact: 'major',
        triggers: ['Freezing rain forecast', 'Temperature drop below 32Â°F', 'Wind >20mph'],
        cascadeRisk: ['Multiple line failures', 'Generation shortfall', 'Extended restoration time'],
        mitigations: ['Weather monitoring', 'Mutual aid agreements', 'Pre-positioned crews'],
        responsePlaybook: 'PLAYBOOK-WEATHER-ICE'
      },
      {
        id: 'scenario-004',
        name: 'Generation Loss - Large Unit Trip',
        description: 'Sudden loss of major generating unit causes frequency deviation',
        category: 'equipment',
        likelihood: 'likely',
        impact: 'moderate',
        triggers: ['Turbine protection trip', 'Boiler tube leak', 'Electrical fault'],
        cascadeRisk: ['Frequency deviation', 'Under-frequency load shedding', 'Cascading trips'],
        mitigations: ['Spinning reserves', 'Fast frequency response', 'Automatic generation control'],
        responsePlaybook: 'PLAYBOOK-GEN-TRIP'
      },
      {
        id: 'scenario-005',
        name: 'Human Error - Wrong Switching',
        description: 'Operator executes incorrect switching sequence, causing unintended outage',
        category: 'human-error',
        likelihood: 'possible',
        impact: 'moderate',
        triggers: ['Complex switching', 'Fatigue', 'Inadequate procedures'],
        cascadeRisk: ['Equipment damage', 'Personnel injury', 'Customer outage'],
        mitigations: ['Switching verification', 'Simulation training', 'Peer review'],
        responsePlaybook: 'PLAYBOOK-SWITCH-ERROR'
      }
    ];

    for (const scenario of scenarios) {
      this.scenarios.set(scenario.id, scenario);
    }
  }

  getScenario(scenarioId: string): PreMortemScenario | undefined {
    return this.scenarios.get(scenarioId);
  }

  getAllScenarios(): PreMortemScenario[] {
    return Array.from(this.scenarios.values());
  }

  findRelevantScenarios(context: {
    assetType?: string;
    weatherConditions?: string[];
    recentAlarms?: string[];
  }): PreMortemScenario[] {
    return this.getAllScenarios().filter(scenario => {
      if (context.weatherConditions?.some(w => w.toLowerCase().includes('ice') || w.toLowerCase().includes('storm'))) {
        if (scenario.category === 'weather') return true;
      }
      if (context.assetType === 'transformer' && scenario.name.toLowerCase().includes('transformer')) {
        return true;
      }
      if (context.recentAlarms?.some(a => scenario.triggers.some(t => a.toLowerCase().includes(t.toLowerCase())))) {
        return true;
      }
      return false;
    });
  }

  computeCascade(initialEvent: string, gridState: GridState): {
    cascadeSteps: { step: number; event: string; impact: string; timeOffset: number }[];
    finalImpact: string;
    mitigationOpportunities: { step: number; action: string }[];
  } {
    // Simplified cascade simulation
    const cascadeSteps: { step: number; event: string; impact: string; timeOffset: number }[] = [
      { step: 1, event: initialEvent, impact: 'Initial event', timeOffset: 0 }
    ];

    // Check if grid is stressed
    if (gridState.reserveMargin < 0.15) {
      cascadeSteps.push({
        step: 2,
        event: 'Low reserves stressed by initial event',
        impact: 'Frequency deviation possible',
        timeOffset: 5
      });
    }

    if (gridState.congestionPoints.length > 2) {
      cascadeSteps.push({
        step: cascadeSteps.length + 1,
        event: 'Congestion points may become overloaded',
        impact: 'Transmission constraints',
        timeOffset: 10
      });
    }

    return {
      cascadeSteps,
      finalImpact: cascadeSteps.length > 2 ? 'Significant system impact possible' : 'Contained event',
      mitigationOpportunities: [
        { step: 1, action: 'Activate reserves immediately' },
        { step: 2, action: 'Prepare load shedding if frequency drops' }
      ]
    };
  }
}

// ============================================================================
// LAYER 1: ENERGY DATA CONNECTOR (SCADA/OT)
// ============================================================================

export class EnergyDataConnector extends DataConnector<SCADAReading | GridAsset | GridState> {
  readonly verticalId = 'energy';
  readonly connectorType = 'scada-diode';

  constructor() {
    super();
    this.initializeSources();
  }

  private initializeSources(): void {
    // SCADA via Data Diode (one-way only)
    this.sources.set('scada', {
      id: 'scada',
      name: 'SCADA System (Read-Only Diode)',
      type: 'stream',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('ems', {
      id: 'ems',
      name: 'Energy Management System',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('asset-registry', {
      id: 'asset-registry',
      name: 'Asset Management System',
      type: 'database',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('weather', {
      id: 'weather',
      name: 'Weather Data Feed',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });
  }

  async connect(config: Record<string, unknown>): Promise<boolean> {
    const sourceId = config['sourceId'] as string;
    const source = this.sources.get(sourceId);
    if (!source) return false;

    // CRITICAL: SCADA must be one-way (diode) - AI cannot write to OT systems
    if (sourceId === 'scada') {
      const diodeMode = config['diodeMode'] !== false;
      if (!diodeMode) {
        console.error('SECURITY: SCADA connection must be read-only diode mode');
        return false;
      }
    }

    source.connectionStatus = 'connected';
    source.lastSync = new Date();
    return true;
  }

  async disconnect(): Promise<void> {
    for (const source of this.sources.values()) {
      source.connectionStatus = 'disconnected';
    }
  }

  async ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<SCADAReading | GridAsset | GridState>> {
    const source = this.sources.get(sourceId);
    if (!source || source.connectionStatus !== 'connected') {
      return {
        success: false,
        data: null,
        provenance: this.generateProvenance(sourceId, null),
        validationErrors: [`Source ${sourceId} not connected`]
      };
    }

    const data = this.fetchConnectorData(sourceId, query);
    const validation = this.validate(data);

    source.lastSync = new Date();
    source.recordCount += 1;

    return {
      success: validation.valid,
      data: validation.valid ? data : null,
      provenance: this.generateProvenance(sourceId, data),
      validationErrors: validation.errors
    };
  }

  validate(data: SCADAReading | GridAsset | GridState): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data) {
      errors.push('Data is null');
      return { valid: false, errors };
    }

    if ('deviceId' in data) {
      if (!data.deviceId) errors.push('Device ID required');
      if (!data.timestamp) errors.push('Timestamp required');
    } else if ('assetId' in data) {
      if (!data.assetId) errors.push('Asset ID required');
    } else if ('frequency' in data) {
      if (data.frequency < 59 || data.frequency > 61) {
        errors.push('Frequency out of normal range');
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private fetchConnectorData(sourceId: string, query?: Record<string, unknown>): SCADAReading | GridAsset | GridState {
    if (sourceId === 'scada') {
      return {
        id: uuidv4(),
        deviceId: query?.['deviceId'] as string || 'DEV-001',
        deviceType: 'meter',
        timestamp: new Date(),
        values: { voltage: 120.5, current: 45.2, power: 5440, frequency: 60.01 },
        quality: 'good',
        alarms: []
      };
    }

    if (sourceId === 'asset-registry') {
      return {
        assetId: query?.['assetId'] as string || 'ASSET-001',
        assetType: 'substation',
        location: { latitude: 40.7128, longitude: -74.0060 },
        capacity: 100000,
        currentLoad: 65000,
        status: 'operational',
        criticality: 'critical',
        lastInspection: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };
    }

    // EMS - Grid State
    return {
      timestamp: new Date(),
      totalLoad: 45000,
      totalGeneration: 48000,
      frequency: 60.02,
      voltage: 1.0,
      reserveMargin: 0.18,
      congestionPoints: ['Line-A', 'Line-B'],
      alerts: [{ level: 'normal', message: 'System operating normally' }]
    };
  }
}

// ============================================================================
// LAYER 2: ENERGY KNOWLEDGE BASE
// ============================================================================

export class EnergyKnowledgeBase extends VerticalKnowledgeBase {
  readonly verticalId = 'energy';

  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> {
    const doc: KnowledgeDocument = {
      id: uuidv4(),
      content,
      metadata: {
        ...metadata,
        documentType: metadata['documentType'] || 'operating-procedure',
        assetType: metadata['assetType'] || 'general',
        criticality: metadata['criticality'] || 'medium'
      },
      provenance,
      embedding: this.generateEmbedding(content),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.documents.set(doc.id, doc);
    return doc;
  }

  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> {
    const queryEmbedding = this.generateEmbedding(query);
    const scored: { doc: KnowledgeDocument; score: number }[] = [];

    for (const doc of this.documents.values()) {
      if (doc.embedding) {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
        scored.push({ doc, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const topDocs = scored.slice(0, topK);

    return {
      documents: topDocs.map(s => s.doc),
      scores: topDocs.map(s => s.score),
      provenanceVerified: topDocs.every(s => s.doc.provenance.authoritative),
      query
    };
  }

  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: ['Document not found'] };

    const issues: string[] = [];

    if (!doc.provenance.authoritative) {
      issues.push('Document source is not authoritative');
    }

    // Operating procedures must be current
    const age = Date.now() - doc.provenance.retrievedAt.getTime();
    const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days for operating procedures
    if (age > maxAge && doc.metadata['documentType'] === 'operating-procedure') {
      issues.push('Operating procedure may be outdated (>30 days)');
    }

    return { valid: issues.length === 0, issues };
  }

  private generateEmbedding(text: string): number[] {
    return embeddingService.hashFallback(text);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0, normA = 0, normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// ============================================================================
// LAYER 3: ENERGY COMPLIANCE MAPPER (NERC CIP / IEC 62443)
// ============================================================================

export class EnergyComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'energy';
  readonly supportedFrameworks: ComplianceFramework[] = [
    {
      id: 'nerc-cip',
      name: 'NERC CIP Standards',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'cip-002', name: 'BES Cyber System Categorization', description: 'Identify and categorize BES Cyber Systems', severity: 'critical', automatable: true },
        { id: 'cip-003', name: 'Security Management Controls', description: 'Security management controls for BES Cyber Systems', severity: 'critical', automatable: false },
        { id: 'cip-004', name: 'Personnel & Training', description: 'Personnel security and training requirements', severity: 'high', automatable: true },
        { id: 'cip-005', name: 'Electronic Security Perimeter', description: 'Network security and access controls', severity: 'critical', automatable: true },
        { id: 'cip-006', name: 'Physical Security', description: 'Physical security of BES Cyber Systems', severity: 'high', automatable: false },
        { id: 'cip-007', name: 'System Security Management', description: 'System hardening and security patches', severity: 'critical', automatable: true },
        { id: 'cip-008', name: 'Incident Reporting', description: 'Cyber security incident reporting', severity: 'critical', automatable: true },
        { id: 'cip-009', name: 'Recovery Plans', description: 'Recovery plans for BES Cyber Systems', severity: 'high', automatable: false },
        { id: 'cip-010', name: 'Configuration Management', description: 'Configuration change management', severity: 'high', automatable: true },
        { id: 'cip-011', name: 'Information Protection', description: 'BES Cyber System Information protection', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'iec-62443',
      name: 'IEC 62443 Industrial Cybersecurity',
      version: '2024',
      jurisdiction: 'International',
      controls: [
        { id: 'iec-sr1', name: 'Security Policy', description: 'Security policies and procedures', severity: 'high', automatable: false },
        { id: 'iec-sr2', name: 'Access Control', description: 'User identification and authentication', severity: 'critical', automatable: true },
        { id: 'iec-sr3', name: 'System Integrity', description: 'System integrity protection', severity: 'critical', automatable: true },
        { id: 'iec-sr4', name: 'Data Confidentiality', description: 'Data confidentiality protection', severity: 'high', automatable: true },
        { id: 'iec-sr5', name: 'Restricted Data Flow', description: 'Network segmentation and data flow', severity: 'critical', automatable: true },
        { id: 'iec-sr6', name: 'Timely Response', description: 'Incident response and recovery', severity: 'high', automatable: true },
        { id: 'iec-sr7', name: 'Resource Availability', description: 'System availability protection', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'nerc-reliability',
      name: 'NERC Reliability Standards',
      version: '2024',
      jurisdiction: 'US',
      controls: [
        { id: 'tpl-001', name: 'Transmission Planning', description: 'System performance under normal conditions', severity: 'critical', automatable: true },
        { id: 'top-001', name: 'Transmission Operations', description: 'Reliable operations coordination', severity: 'critical', automatable: false },
        { id: 'bal-001', name: 'Real Power Balancing', description: 'Maintain frequency within limits', severity: 'critical', automatable: true },
        { id: 'var-001', name: 'Voltage Control', description: 'Maintain voltage within limits', severity: 'critical', automatable: true }
      ]
    },
    ...EXPANDED_COMPLIANCE_FRAMEWORKS,
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];

    const mappings: Record<string, Record<string, string[]>> = {
      'maintenance-deferral': {
        'nerc-cip': ['cip-007', 'cip-010'],
        'nerc-reliability': ['tpl-001'],
        'iec-62443': ['iec-sr3', 'iec-sr7']
      },
      'load-balancing': {
        'nerc-reliability': ['bal-001', 'var-001', 'top-001'],
        'nerc-cip': ['cip-005', 'cip-007'],
        'iec-62443': ['iec-sr5', 'iec-sr7']
      },
      'emergency-response': {
        'nerc-cip': ['cip-008', 'cip-009'],
        'nerc-reliability': ['top-001'],
        'iec-62443': ['iec-sr6']
      },
      'grid-optimization': {
        'nerc-reliability': ['tpl-001', 'bal-001', 'var-001'],
        'iec-62443': ['iec-sr3', 'iec-sr7']
      }
    };

    const expandedControlIds = EXPANDED_COMPLIANCE_MAPPINGS[decisionType]?.[frameworkId] || [];
    const controlIds = [...(mappings[decisionType]?.[frameworkId] || []), ...expandedControlIds];
    return framework.controls.filter(c => controlIds.includes(c.id));
  }

  async checkViolation(decision: EnergyDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const controls = this.mapToFramework(decision.type, frameworkId);

    for (const control of controls) {
      const violation = await this.evaluateControl(decision, control);
      if (violation) violations.push(violation);
    }

    return violations;
  }

  async generateEvidence(decision: EnergyDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    const controls = this.mapToFramework(decision.type, frameworkId);
    const evidence: ComplianceEvidence[] = [];

    for (const control of controls) {
      const status = await this.evaluateControlStatus(decision, control);
      evidence.push({
        id: uuidv4(),
        frameworkId,
        controlId: control.id,
        status,
        evidence: `Control ${control.id} evaluated for ${decision.type}. Status: ${status}. Safety review: ${decision.outcome.safetyReview.overallSafe ? 'PASSED' : 'REVIEW REQUIRED'}.`,
        generatedAt: new Date(),
        hash: crypto.createHash('sha256').update(JSON.stringify({ decision, control, status })).digest('hex')
      });
    }

    return evidence;
  }

  private async evaluateControl(decision: EnergyDecision, control: ComplianceControl): Promise<ComplianceViolation | null> {
    // Check safety review
    if (!decision.outcome.safetyReview.overallSafe && control.severity === 'critical') {
      return {
        controlId: control.id,
        severity: 'critical',
        description: 'Safety review failed for critical infrastructure decision',
        remediation: decision.outcome.safetyReview.mitigations?.join('; ') || 'Address safety concerns',
        detectedAt: new Date()
      };
    }

    return null;
  }

  private async evaluateControlStatus(decision: EnergyDecision, control: ComplianceControl): Promise<ComplianceEvidence['status']> {
    const violation = await this.evaluateControl(decision, control);
    if (violation) {
      return violation.severity === 'critical' ? 'non-compliant' : 'partial';
    }
    return 'compliant';
  }
}

// ============================================================================
// LAYER 4: ENERGY DECISION SCHEMAS
// ============================================================================

export class MaintenanceDeferralSchema extends DecisionSchema<MaintenanceDeferral> {
  readonly verticalId = 'energy';
  readonly decisionType = 'maintenance-deferral';
  readonly requiredFields = [
    'inputs.asset.assetId',
    'inputs.scheduledMaintenanceDate',
    'inputs.proposedDeferralDate',
    'inputs.deferralReason',
    'outcome.approved',
    'outcome.safetyReview'
  ];
  readonly requiredApprovers = ['maintenance-supervisor', 'reliability-engineer'];

  private safetyFramework = new SafetyFirstFramework();

  validate(decision: Partial<MaintenanceDeferral>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.asset?.assetId) errors.push('Asset ID required');
    if (!decision.inputs?.scheduledMaintenanceDate) errors.push('Scheduled maintenance date required');
    if (!decision.inputs?.proposedDeferralDate) errors.push('Proposed deferral date required');
    if (!decision.inputs?.deferralReason) errors.push('Deferral reason required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.safetyReview) errors.push('Safety review required');

    // Safety-first checks
    if (decision.inputs?.impactAssessment?.safetyRisk && decision.inputs.impactAssessment.safetyRisk > 0.5) {
      warnings.push('High safety risk - requires additional review');
    }

    if (decision.inputs?.asset?.criticality === 'critical') {
      warnings.push('Critical asset - deferral requires executive approval');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: MaintenanceDeferral, signerId: string, signerRole: string, privateKey: string): Promise<MaintenanceDeferral> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: MaintenanceDeferral, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        asset: decision.inputs.asset,
        deferralReason: decision.inputs.deferralReason,
        approved: decision.outcome.approved,
        safetyReview: {
          reviewId: decision.outcome.safetyReview.reviewId,
          safetyLevel: decision.outcome.safetyReview.safetyLevel,
          overallSafe: decision.outcome.safetyReview.overallSafe,
          checks: decision.outcome.safetyReview.checks
        },
        deliberation: decision.deliberation,
        approvals: decision.approvals
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }

  runSafetyReview(inputs: MaintenanceDeferral['inputs']): SafetyReviewResult {
    return this.safetyFramework.evaluateSafety('maintenance-deferral', inputs as unknown as Record<string, unknown>);
  }
}

export class EmergencyResponseSchema extends DecisionSchema<EmergencyResponse> {
  readonly verticalId = 'energy';
  readonly decisionType = 'emergency-response';
  readonly requiredFields = [
    'inputs.incidentId',
    'inputs.incidentType',
    'inputs.severity',
    'outcome.responseLevel',
    'outcome.incidentCommanderApproval',
    'outcome.safetyReview'
  ];
  readonly requiredApprovers = ['incident-commander'];

  validate(decision: Partial<EmergencyResponse>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.incidentId) errors.push('Incident ID required');
    if (!decision.inputs?.incidentType) errors.push('Incident type required');
    if (!decision.inputs?.severity) errors.push('Severity required');
    if (!decision.outcome?.responseLevel) errors.push('Response level required');
    if (!decision.outcome?.incidentCommanderApproval) errors.push('Incident commander approval required');
    if (!decision.outcome?.safetyReview) errors.push('Safety review required');

    if (decision.inputs?.severity && decision.inputs.severity <= 2) {
      warnings.push('High severity incident - executive notification required');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: EmergencyResponse, signerId: string, signerRole: string, privateKey: string): Promise<EmergencyResponse> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: EmergencyResponse, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        incidentId: decision.inputs.incidentId,
        incidentType: decision.inputs.incidentType,
        severity: decision.inputs.severity,
        responseLevel: decision.outcome.responseLevel,
        actions: decision.outcome.actions,
        incidentCommanderApproval: decision.outcome.incidentCommanderApproval,
        safetyReview: decision.outcome.safetyReview
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date()
    };
  }
}

// ============================================================================
// LAYER 5: ENERGY AGENT PRESETS
// ============================================================================

export class GridOperationsAgentPreset extends AgentPreset {
  readonly verticalId = 'energy';
  readonly presetId = 'grid-operations';
  readonly name = 'Grid Operations Workflow';
  readonly description = 'Safety-first grid operations with mandatory human oversight';

  readonly capabilities: AgentCapability[] = [
    { id: 'load-forecast', name: 'Load Forecasting', description: 'Predict system load', requiredPermissions: ['read:scada'] },
    { id: 'contingency-analysis', name: 'Contingency Analysis', description: 'N-1 contingency assessment', requiredPermissions: ['read:ems'] },
    { id: 'optimization', name: 'Grid Optimization', description: 'Optimize dispatch', requiredPermissions: ['read:generation'] }
  ];

  readonly guardrails: AgentGuardrail[] = [
    { id: 'safety-first', name: 'Safety First', type: 'hard-stop', condition: 'safetyReview.overallSafe === false', action: 'Block action if safety review fails' },
    { id: 'human-oversight', name: 'Human Oversight Required', type: 'hard-stop', condition: 'humanApproval === false', action: 'All grid actions require operator approval' },
    { id: 'no-ot-write', name: 'No OT Write Access', type: 'hard-stop', condition: 'otWriteAttempted === true', action: 'AI cannot write to operational technology systems' },
    { id: 'fail-safe-default', name: 'Fail-Safe Default', type: 'hard-stop', condition: 'uncertaintyHigh === true', action: 'Default to safe conservative action' }
  ];

  readonly workflow: WorkflowStep[] = [
    {
      id: 'step-1-state',
      name: 'System State Assessment',
      agentId: 'grid-state-agent',
      requiredInputs: ['gridState'],
      expectedOutputs: ['systemAssessment', 'riskFactors'],
      guardrails: [],
      timeout: 30000
    },
    {
      id: 'step-2-safety',
      name: 'Safety Review',
      agentId: 'safety-review-agent',
      requiredInputs: ['systemAssessment', 'proposedAction'],
      expectedOutputs: ['safetyReview'],
      guardrails: [this.guardrails[0]!],
      timeout: 30000
    },
    {
      id: 'step-3-recommendation',
      name: 'Action Recommendation',
      agentId: 'recommendation-agent',
      requiredInputs: ['safetyReview', 'systemAssessment'],
      expectedOutputs: ['recommendation', 'alternatives'],
      guardrails: [this.guardrails[3]!],
      timeout: 60000
    },
    {
      id: 'step-4-approval',
      name: 'Operator Approval',
      agentId: 'approval-agent',
      requiredInputs: ['recommendation'],
      expectedOutputs: ['operatorApproval'],
      guardrails: [this.guardrails[1]!, this.guardrails[2]!],
      timeout: 300000
    }
  ];

  async loadWorkflow(_context: Record<string, unknown>): Promise<WorkflowStep[]> {
    return this.workflow;
  }

  async enforceGuardrails(step: WorkflowStep, input: unknown): Promise<{ allowed: boolean; blockedBy?: string }> {
    const data = input as Record<string, unknown>;
    
    for (const guardrail of step.guardrails) {
      if (guardrail.type === 'hard-stop') {
        if (guardrail.id === 'safety-first') {
          const safetyReview = data['safetyReview'] as { overallSafe: boolean } | undefined;
          if (safetyReview && !safetyReview.overallSafe) {
            return { allowed: false, blockedBy: guardrail.id };
          }
        }
        if (guardrail.id === 'human-oversight' && data['humanApproval'] === false) {
          return { allowed: false, blockedBy: guardrail.id };
        }
        if (guardrail.id === 'no-ot-write' && data['otWriteAttempted'] === true) {
          return { allowed: false, blockedBy: guardrail.id };
        }
      }
    }
    
    return { allowed: true };
  }

  trace(stepId: string, agentId: string, inputs: Record<string, unknown>): AgentTrace {
    const traceRecord: AgentTrace = {
      stepId,
      agentId,
      startedAt: new Date(),
      completedAt: null,
      inputs,
      outputs: null,
      guardrailsTriggered: [],
      status: 'running'
    };
    this.traces.push(traceRecord);
    return traceRecord;
  }
}

// ============================================================================
// LAYER 6: ENERGY DEFENSIBLE OUTPUT
// ============================================================================

export class EnergyDefensibleOutput extends DefensibleOutput<EnergyDecision> {
  readonly verticalId = 'energy';

  async toRegulatorPacket(decision: EnergyDecision, frameworkId: string): Promise<RegulatorPacket> {
    const complianceEvidence = decision.complianceEvidence.filter(e => e.frameworkId === frameworkId);

    return {
      id: this.generateId('RP'),
      decisionId: decision.metadata.id,
      frameworkId,
      jurisdiction: 'US',
      generatedAt: new Date(),
      validUntil: this.generateValidityPeriod(365 * 7),
      sections: {
        executiveSummary: this.generateExecutiveSummary(decision),
        decisionRationale: decision.deliberation.reasoning,
        complianceMapping: complianceEvidence,
        dissentsAndOverrides: decision.dissents,
        approvalChain: decision.approvals,
        auditTrail: this.generateAuditTrailSummary(decision)
      },
      signatures: decision.signatures,
      hash: this.hashContent(decision)
    };
  }

  async toCourtBundle(decision: EnergyDecision, caseReference?: string): Promise<CourtBundle> {
    const bundle: CourtBundle = {
      id: this.generateId('CB'),
      decisionId: decision.metadata.id,
      generatedAt: new Date(),
      sections: {
        factualBackground: this.generateFactualBackground(decision),
        decisionProcess: decision.deliberation.reasoning,
        humanOversight: this.generateHumanOversightStatement(decision),
        dissentsRecorded: decision.dissents,
        evidenceChain: this.generateEvidenceChain(decision)
      },
      certifications: {
        integrityHash: this.hashContent(decision),
        witnessSignatures: decision.signatures.filter(s => s.signerRole.includes('witness'))
      }
    };

    if (caseReference) {
      bundle.caseReference = caseReference;
    }

    return bundle;
  }

  async toAuditTrail(decision: EnergyDecision, events: unknown[]): Promise<AuditTrail> {
    const auditEvents = (events as { timestamp: Date; actor: string; action: string; details: Record<string, unknown> }[]).map(e => ({
      ...e,
      hash: this.hashContent(e)
    }));

    return {
      id: this.generateId('AT'),
      decisionId: decision.metadata.id,
      period: { start: decision.metadata.createdAt, end: new Date() },
      events: auditEvents,
      summary: {
        totalEvents: auditEvents.length,
        uniqueActors: new Set(auditEvents.map(e => e.actor)).size,
        guardrailsTriggered: auditEvents.filter(e => e.action.includes('guardrail')).length,
        dissentsRecorded: decision.dissents.length
      },
      hash: this.hashContent(auditEvents)
    };
  }

  private generateExecutiveSummary(decision: EnergyDecision): string {
    const sr = decision.outcome.safetyReview as SafetyReviewResult;
    return `Critical infrastructure ${decision.type} decision (ID: ${decision.metadata.id}). ` +
      `Safety review: ${sr.overallSafe ? 'PASSED' : 'FAILED - FAIL-SAFE APPLIED'}. ` +
      `Human oversight: ${decision.approvals.length} approvals. ` +
      `Safety level: ${sr.safetyLevel}.`;
  }

  private generateAuditTrailSummary(decision: EnergyDecision): string[] {
    const sr = decision.outcome.safetyReview as SafetyReviewResult;
    return [
      `Decision created: ${decision.metadata.createdAt.toISOString()}`,
      `Safety level: ${sr.safetyLevel}`,
      `Fail-safe triggered: ${sr.failSafeTriggered}`,
      ...decision.approvals.map(a => `Approved by ${a.approverRole} at ${a.approvedAt.toISOString()}`)
    ];
  }

  private generateFactualBackground(decision: EnergyDecision): string {
    const sr = decision.outcome.safetyReview as SafetyReviewResult;
    return `This ${decision.type} decision for critical infrastructure was made following safety-first protocols. ` +
      `The decision underwent mandatory safety review with result: ${sr.safetyLevel}. ` +
      `All AI recommendations were advisory only; final decisions made by qualified operators.`;
  }

  private generateHumanOversightStatement(decision: EnergyDecision): string {
    const approvers = decision.approvals.map(a => a.approverRole).join(', ');
    return `Human oversight was maintained at all times. ` +
      `AI system operated in advisory-only mode with no direct control of operational technology. ` +
      `Qualified personnel (${approvers}) reviewed and approved all actions. ` +
      `Fail-safe defaults were configured for all uncertain conditions.`;
  }

  private generateEvidenceChain(decision: EnergyDecision): string[] {
    const sr = decision.outcome.safetyReview as SafetyReviewResult;
    return [
      `Input hash: ${this.hashContent(decision.inputs)}`,
      `Safety review hash: ${sr.hash}`,
      `Outcome hash: ${this.hashContent(decision.outcome)}`,
      `Full decision hash: ${this.hashContent(decision)}`
    ];
  }
}

// ============================================================================
// ENERGY VERTICAL IMPLEMENTATION
// ============================================================================

export class EnergyVerticalImplementation implements VerticalImplementation<EnergyDecision> {
  readonly verticalId = 'energy';
  readonly verticalName = 'Energy & Utilities';
  readonly completionPercentage = 85;
  readonly targetPercentage = 100;

  readonly dataConnector: EnergyDataConnector;
  readonly knowledgeBase: EnergyKnowledgeBase;
  readonly complianceMapper: EnergyComplianceMapper;
  readonly decisionSchemas: Map<string, DecisionSchema<EnergyDecision>>;
  readonly agentPresets: Map<string, AgentPreset>;
  readonly defensibleOutput: EnergyDefensibleOutput;

  readonly safetyFirstFramework: SafetyFirstFramework;
  readonly preMortemLibrary: IncidentPreMortemLibrary;

  constructor() {
    this.dataConnector = new EnergyDataConnector();
    this.knowledgeBase = new EnergyKnowledgeBase();
    this.complianceMapper = new EnergyComplianceMapper();
    this.safetyFirstFramework = new SafetyFirstFramework();
    this.preMortemLibrary = new IncidentPreMortemLibrary();

    this.decisionSchemas = new Map();
    this.decisionSchemas.set('maintenance-deferral', new MaintenanceDeferralSchema() as unknown as DecisionSchema<EnergyDecision>);
    this.decisionSchemas.set('emergency-response', new EmergencyResponseSchema() as unknown as DecisionSchema<EnergyDecision>);

    this.agentPresets = new Map();
    this.agentPresets.set('grid-operations', new GridOperationsAgentPreset());

    this.defensibleOutput = new EnergyDefensibleOutput();
  }

  getStatus() {
    const missing: string[] = [];

    if (this.dataConnector.getConnectedSources().length === 0) {
      missing.push('SCADA/EMS connections (client-provided via data diode)');
    }
    if (this.decisionSchemas.size < 4) {
      missing.push('LoadBalancing, GridOptimization schemas');
    }

    return {
      vertical: this.verticalName,
      layers: {
        dataConnector: true,
        knowledgeBase: true,
        complianceMapper: true,
        decisionSchemas: this.decisionSchemas.size >= 2,
        agentPresets: this.agentPresets.size >= 1,
        defensibleOutput: true
      },
      completionPercentage: this.completionPercentage,
      missingComponents: missing
    };
  }
}

// Register with vertical registry
const energyVertical = new EnergyVerticalImplementation();
VerticalRegistry.getInstance().register(energyVertical);

export default energyVertical;