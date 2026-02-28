// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Energy Vertical - Expanded Decision Schemas
 * 8 additional decision schema classes (12 total)
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import { DecisionSchema, ValidationResult, DefensibleArtifact } from '../core/VerticalPattern.js';
import {
  GenerationDispatchDecision,
  OutagePlanningDecision,
  RenewableIntegrationDecision,
  DemandResponseDecision,
  TransmissionUpgradeDecision,
  FuelProcurementDecision,
  EnvironmentalComplianceDecision,
  AssetRetirementDecision,
} from './EnergyDecisionTypesExpanded.js';

export class GenerationDispatchSchema extends DecisionSchema<GenerationDispatchDecision> {
  readonly verticalId = 'energy';
  readonly decisionType = 'generation-dispatch';
  readonly requiredFields = ['inputs.dispatchId', 'inputs.demandForecast', 'outcome.dispatchSchedule'];
  readonly requiredApprovers = ['system-operator', 'reliability-coordinator'];

  validate(decision: Partial<GenerationDispatchDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.dispatchId) errors.push('Dispatch ID required');
    if (!decision.inputs?.demandForecast?.length) errors.push('Demand forecast required');
    if (!decision.outcome?.dispatchSchedule?.length) errors.push('Dispatch schedule required');
    if (decision.outcome?.reliabilityMargin !== undefined && decision.outcome.reliabilityMargin < 0.15) {
      warnings.push('Reliability margin below 15% - consider additional reserves');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: GenerationDispatchDecision, signerId: string, signerRole: string, privateKey: string): Promise<GenerationDispatchDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: GenerationDispatchDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { dispatch: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class OutagePlanningSchema extends DecisionSchema<OutagePlanningDecision> {
  readonly verticalId = 'energy';
  readonly decisionType = 'outage-planning';
  readonly requiredFields = ['inputs.outageId', 'inputs.asset', 'outcome.approved'];
  readonly requiredApprovers = ['outage-coordinator', 'reliability-engineer'];

  validate(decision: Partial<OutagePlanningDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.outageId) errors.push('Outage ID required');
    if (!decision.inputs?.asset) errors.push('Asset information required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.inputs?.systemReliability?.n1) {
      errors.push('N-1 contingency not met - cannot approve outage');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: OutagePlanningDecision, signerId: string, signerRole: string, privateKey: string): Promise<OutagePlanningDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: OutagePlanningDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { outage: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class RenewableIntegrationSchema extends DecisionSchema<RenewableIntegrationDecision> {
  readonly verticalId = 'energy';
  readonly decisionType = 'renewable-integration';
  readonly requiredFields = ['inputs.projectId', 'inputs.renewableType', 'inputs.capacity', 'outcome.approved'];
  readonly requiredApprovers = ['planning-engineer', 'interconnection-manager'];

  validate(decision: Partial<RenewableIntegrationDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.projectId) errors.push('Project ID required');
    if (!decision.inputs?.renewableType) errors.push('Renewable type required');
    if (typeof decision.inputs?.capacity !== 'number') errors.push('Capacity required');
    if (typeof decision.outcome?.approved !== 'boolean') errors.push('Approval decision required');
    if (!decision.outcome?.interconnectionApproval) {
      errors.push('Interconnection approval required before project approval');
    }
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: RenewableIntegrationDecision, signerId: string, signerRole: string, privateKey: string): Promise<RenewableIntegrationDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: RenewableIntegrationDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { renewable: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 20 * 365 * 24 * 60 * 60 * 1000) };
  }
}

export class DemandResponseSchema extends DecisionSchema<DemandResponseDecision> {
  readonly verticalId = 'energy';
  readonly decisionType = 'demand-response';
  readonly requiredFields = ['inputs.eventId', 'inputs.targetReduction', 'outcome.dispatched'];
  readonly requiredApprovers = ['demand-response-manager', 'system-operator'];

  validate(decision: Partial<DemandResponseDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    if (!decision.inputs?.eventId) errors.push('Event ID required');
    if (typeof decision.inputs?.targetReduction !== 'number') errors.push('Target reduction required');
    if (typeof decision.outcome?.dispatched !== 'boolean') errors.push('Dispatch decision required');
    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: DemandResponseDecision, signerId: string, signerRole: string, privateKey: string): Promise<DemandResponseDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({ signerId, signerRole, signedAt: new Date(), signature: this.generateSignature(hash, privateKey), publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16) });
    return decision;
  }

  async toDefensibleArtifact(decision: DemandResponseDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    const content = { dr: decision.inputs, outcome: decision.outcome, deliberation: decision.deliberation };
    return { id: uuidv4(), decisionId: decision.metadata.id, type: artifactType, content, hash: crypto.createHash('sha256').update(JSON.stringify(content)).digest('hex'), generatedAt: new Date(), expiresAt: new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000) };
  }
}
