// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA OPA (Open Policy Agent) SERVICE
// Policy-as-code engine for complex data-driven authorization and compliance.
//
// Complements the existing Casbin RBAC engine:
//   - Casbin: Role-based access control, decision approvals, veto permissions
//   - OPA:    Data-driven policies, compliance rules, vertical regulations,
//             cross-cutting concerns, attribute-based access control (ABAC)
//
// Deployment modes:
//   1. Self-hosted OPA server (OPA_URL) — full Rego evaluation
//   2. Embedded evaluation — JavaScript-based policy evaluation
//   3. Bundle server — OPA pulls policy bundles from a server
//
// Configuration:
//   OPA_ENABLED     — 'true' to activate (default: false)
//   OPA_URL         — OPA server URL (default: http://localhost:8181)
//   OPA_MODE        — 'server' | 'embedded' (default: embedded)
//   OPA_BUNDLE_URL  — Bundle server URL for policy distribution (optional)
// =============================================================================

import { logger } from '../../utils/logger.js';
import crypto from 'crypto';

// ---------------------------------------------------------------------------
// TYPES
// ---------------------------------------------------------------------------

export interface OPAInput {
  /** The subject (user, service, agent) requesting access */
  subject: {
    id: string;
    roles?: string[];
    attributes?: Record<string, unknown>;
    organizationId?: string;
    department?: string;
    clearanceLevel?: string;
  };
  /** The action being performed */
  action: string;
  /** The resource being accessed */
  resource: {
    type: string;
    id?: string;
    attributes?: Record<string, unknown>;
    owner?: string;
    classification?: string;
    vertical?: string;
  };
  /** Additional context for policy evaluation */
  context?: {
    timestamp?: string;
    ipAddress?: string;
    environment?: string;
    riskScore?: number;
    complianceFrameworks?: string[];
    [key: string]: unknown;
  };
}

export interface OPAResult {
  /** Whether the request is allowed */
  allow: boolean;
  /** Detailed reasons for the decision */
  reasons: string[];
  /** Policy violations found */
  violations: PolicyViolation[];
  /** Obligations the caller must fulfill */
  obligations: PolicyObligation[];
  /** Evaluation metadata */
  metadata: {
    policyVersion: string;
    evaluationTimeMs: number;
    policiesEvaluated: number;
    decisionId: string;
  };
}

export interface PolicyViolation {
  policyId: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  remediation?: string;
  complianceFramework?: string;
}

export interface PolicyObligation {
  type: 'log' | 'notify' | 'encrypt' | 'redact' | 'approve' | 'audit';
  description: string;
  parameters?: Record<string, unknown>;
}

export interface PolicyBundle {
  id: string;
  name: string;
  version: string;
  description: string;
  policies: PolicyDefinition[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PolicyDefinition {
  id: string;
  name: string;
  description: string;
  category: PolicyCategory;
  /** Rego policy source (for OPA server mode) */
  rego?: string;
  /** JavaScript evaluation function (for embedded mode) */
  evaluator?: (input: OPAInput) => PolicyEvalResult;
  enabled: boolean;
  priority: number;
  /** Which compliance frameworks this policy supports */
  complianceFrameworks: string[];
  /** Which verticals this policy applies to (empty = all) */
  verticals: string[];
}

export type PolicyCategory =
  | 'access_control'
  | 'data_governance'
  | 'compliance'
  | 'operational'
  | 'financial'
  | 'healthcare'
  | 'defense'
  | 'privacy'
  | 'ai_governance'
  | 'custom';

export interface PolicyEvalResult {
  allow: boolean;
  violations: PolicyViolation[];
  obligations: PolicyObligation[];
  reasons: string[];
}

export interface OPAHealth {
  enabled: boolean;
  mode: string;
  connected: boolean;
  policyCount: number;
  bundleCount: number;
  serverVersion?: string;
  latencyMs?: number;
}

// ---------------------------------------------------------------------------
// DEFAULT POLICIES (Embedded JavaScript Evaluators)
// ---------------------------------------------------------------------------

const DEFAULT_POLICIES: PolicyDefinition[] = [
  // ── Access Control ─────────────────────────────────────────────────────
  {
    id: 'ac-data-classification',
    name: 'Data Classification Access Control',
    description: 'Enforces access based on data classification levels',
    category: 'access_control',
    enabled: true,
    priority: 10,
    complianceFrameworks: ['ISO27001', 'NIST-800-53', 'SOC2'],
    verticals: [],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const classification = input.resource.classification || 'internal';
      const clearance = input.subject.clearanceLevel || 'internal';

      const levels: Record<string, number> = {
        'public': 0, 'internal': 1, 'confidential': 2, 'restricted': 3, 'top_secret': 4,
      };

      const resourceLevel = levels[classification] ?? 1;
      const subjectLevel = levels[clearance] ?? 1;

      if (subjectLevel < resourceLevel) {
        violations.push({
          policyId: 'ac-data-classification',
          severity: 'error',
          message: `Insufficient clearance: requires '${classification}', subject has '${clearance}'`,
          remediation: `Request elevated access or contact data steward`,
          complianceFramework: 'ISO27001',
        });
        reasons.push(`Classification mismatch: ${clearance} < ${classification}`);
        return { allow: false, violations, obligations, reasons };
      }

      if (resourceLevel >= 2) {
        obligations.push({
          type: 'audit',
          description: `Access to ${classification} resource must be logged`,
        });
      }

      reasons.push(`Clearance ${clearance} permits access to ${classification} data`);
      return { allow: true, violations, obligations, reasons };
    },
  },
  {
    id: 'ac-time-based',
    name: 'Time-Based Access Control',
    description: 'Restricts access outside business hours for certain operations',
    category: 'access_control',
    enabled: true,
    priority: 20,
    complianceFrameworks: ['SOX', 'DORA'],
    verticals: ['financial'],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const sensitiveActions = ['delete', 'export', 'bulk_modify', 'admin_override'];
      if (!sensitiveActions.includes(input.action)) {
        return { allow: true, violations, obligations, reasons: ['Non-sensitive action, time check skipped'] };
      }

      const now = new Date();
      const hour = now.getUTCHours();
      const day = now.getUTCDay();
      const isBusinessHours = day >= 1 && day <= 5 && hour >= 8 && hour < 18;

      if (!isBusinessHours) {
        violations.push({
          policyId: 'ac-time-based',
          severity: 'warning',
          message: `Sensitive action '${input.action}' attempted outside business hours`,
          remediation: 'Request after-hours approval or wait for business hours',
          complianceFramework: 'SOX',
        });
        obligations.push({
          type: 'approve',
          description: 'After-hours sensitive operation requires manager approval',
        });
        reasons.push('Outside business hours — elevated approval required');
      }

      return { allow: true, violations, obligations, reasons };
    },
  },

  // ── Data Governance ────────────────────────────────────────────────────
  {
    id: 'dg-pii-handling',
    name: 'PII Data Handling Policy',
    description: 'Enforces proper handling of personally identifiable information',
    category: 'data_governance',
    enabled: true,
    priority: 5,
    complianceFrameworks: ['GDPR', 'CCPA', 'HIPAA'],
    verticals: [],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const isPII = input.resource.attributes?.containsPII === true;
      if (!isPII) {
        return { allow: true, violations, obligations, reasons: ['Resource does not contain PII'] };
      }

      // PII export requires encryption
      if (['export', 'download', 'share'].includes(input.action)) {
        obligations.push({
          type: 'encrypt',
          description: 'PII data must be encrypted before export',
          parameters: { algorithm: 'AES-256-GCM' },
        });
        obligations.push({
          type: 'log',
          description: 'PII export event must be logged to compliance audit trail',
        });
      }

      // PII deletion requires approval
      if (input.action === 'delete') {
        obligations.push({
          type: 'approve',
          description: 'PII deletion requires DPO approval per GDPR Art. 17',
        });
      }

      // Cross-border transfer check
      const destRegion = input.context?.destinationRegion as string | undefined;
      if (destRegion && !['EU', 'EEA'].includes(destRegion)) {
        violations.push({
          policyId: 'dg-pii-handling',
          severity: 'error',
          message: `PII transfer to ${destRegion} requires adequacy decision or SCCs`,
          remediation: 'Implement Standard Contractual Clauses before transfer',
          complianceFramework: 'GDPR',
        });
      }

      reasons.push('PII handling obligations applied');
      return { allow: true, violations, obligations, reasons };
    },
  },
  {
    id: 'dg-retention',
    name: 'Data Retention Policy',
    description: 'Enforces data retention and deletion schedules',
    category: 'data_governance',
    enabled: true,
    priority: 15,
    complianceFrameworks: ['GDPR', 'SOX', 'HIPAA'],
    verticals: [],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      if (input.action !== 'delete' && input.action !== 'archive') {
        return { allow: true, violations, obligations, reasons: ['Retention check not applicable'] };
      }

      const retentionYears = (input.resource.attributes?.retentionYears as number) || 0;
      const createdAt = input.resource.attributes?.createdAt as string | undefined;

      if (createdAt && retentionYears > 0) {
        const created = new Date(createdAt);
        const retentionEnd = new Date(created.getTime() + retentionYears * 365.25 * 24 * 60 * 60 * 1000);
        const now = new Date();

        if (now < retentionEnd) {
          violations.push({
            policyId: 'dg-retention',
            severity: 'error',
            message: `Resource under retention until ${retentionEnd.toISOString().slice(0, 10)} (${retentionYears}y policy)`,
            remediation: 'Wait until retention period expires or obtain legal hold release',
            complianceFramework: 'SOX',
          });
          return { allow: false, violations, obligations, reasons: ['Retention period active'] };
        }
      }

      return { allow: true, violations, obligations, reasons: ['Retention check passed'] };
    },
  },

  // ── Compliance ─────────────────────────────────────────────────────────
  {
    id: 'comp-segregation-of-duties',
    name: 'Segregation of Duties',
    description: 'Prevents single-person execution of critical workflows',
    category: 'compliance',
    enabled: true,
    priority: 5,
    complianceFrameworks: ['SOX', 'Basel-III', 'DORA'],
    verticals: ['financial'],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const criticalActions = ['approve_transaction', 'release_funds', 'modify_controls', 'override_limit'];
      if (!criticalActions.includes(input.action)) {
        return { allow: true, violations, obligations, reasons: ['Non-critical action, SoD check skipped'] };
      }

      const initiator = input.context?.initiatorId as string | undefined;
      if (initiator && initiator === input.subject.id) {
        violations.push({
          policyId: 'comp-segregation-of-duties',
          severity: 'critical',
          message: 'Segregation of duties violation: initiator cannot approve own request',
          remediation: 'A different authorized person must approve this action',
          complianceFramework: 'SOX',
        });
        return { allow: false, violations, obligations, reasons: ['SoD violation: self-approval'] };
      }

      reasons.push('SoD check passed');
      return { allow: true, violations, obligations, reasons };
    },
  },

  // ── AI Governance ──────────────────────────────────────────────────────
  {
    id: 'ai-model-deployment',
    name: 'AI Model Deployment Policy',
    description: 'Controls which AI models can be deployed based on risk assessment',
    category: 'ai_governance',
    enabled: true,
    priority: 10,
    complianceFrameworks: ['EU-AI-Act', 'NIST-AI-RMF'],
    verticals: [],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      if (input.resource.type !== 'ai_model' || input.action !== 'deploy') {
        return { allow: true, violations, obligations, reasons: ['Not an AI model deployment'] };
      }

      const riskLevel = input.resource.attributes?.riskLevel as string | undefined;
      const hasImpactAssessment = input.resource.attributes?.hasImpactAssessment === true;
      const hasBiasAudit = input.resource.attributes?.hasBiasAudit === true;

      if (riskLevel === 'high' || riskLevel === 'unacceptable') {
        if (!hasImpactAssessment) {
          violations.push({
            policyId: 'ai-model-deployment',
            severity: 'critical',
            message: 'High-risk AI model requires Fundamental Rights Impact Assessment',
            remediation: 'Complete FRIA before deployment per EU AI Act Art. 27',
            complianceFramework: 'EU-AI-Act',
          });
        }
        if (!hasBiasAudit) {
          violations.push({
            policyId: 'ai-model-deployment',
            severity: 'error',
            message: 'High-risk AI model requires bias and fairness audit',
            remediation: 'Complete bias audit and document results',
            complianceFramework: 'EU-AI-Act',
          });
        }
        obligations.push({
          type: 'notify',
          description: 'Notify AI governance board of high-risk model deployment',
        });
      }

      if (riskLevel === 'unacceptable') {
        violations.push({
          policyId: 'ai-model-deployment',
          severity: 'critical',
          message: 'Unacceptable-risk AI system cannot be deployed per EU AI Act Art. 5',
          complianceFramework: 'EU-AI-Act',
        });
        return { allow: false, violations, obligations, reasons: ['Unacceptable risk level'] };
      }

      const hasViolations = violations.some(v => v.severity === 'critical');
      reasons.push(hasViolations ? 'Missing required assessments' : 'AI governance checks passed');
      return { allow: !hasViolations, violations, obligations, reasons };
    },
  },

  // ── Privacy ────────────────────────────────────────────────────────────
  {
    id: 'priv-consent-check',
    name: 'Consent Verification',
    description: 'Verifies data subject consent before processing personal data',
    category: 'privacy',
    enabled: true,
    priority: 5,
    complianceFrameworks: ['GDPR', 'CCPA'],
    verticals: [],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const requiresConsent = input.resource.attributes?.requiresConsent === true;
      if (!requiresConsent) {
        return { allow: true, violations, obligations, reasons: ['Consent not required for this resource'] };
      }

      const hasConsent = input.context?.consentVerified === true;
      const legalBasis = input.context?.legalBasis as string | undefined;

      if (!hasConsent && !legalBasis) {
        violations.push({
          policyId: 'priv-consent-check',
          severity: 'critical',
          message: 'No valid consent or legal basis for processing personal data',
          remediation: 'Obtain data subject consent or document legitimate interest',
          complianceFramework: 'GDPR',
        });
        return { allow: false, violations, obligations, reasons: ['No consent or legal basis'] };
      }

      obligations.push({
        type: 'log',
        description: 'Record processing activity in ROPA (Records of Processing Activities)',
      });

      reasons.push(`Processing authorized via ${hasConsent ? 'consent' : `legal basis: ${legalBasis}`}`);
      return { allow: true, violations, obligations, reasons };
    },
  },

  // ── Healthcare ─────────────────────────────────────────────────────────
  {
    id: 'hc-minimum-necessary',
    name: 'HIPAA Minimum Necessary Rule',
    description: 'Enforces minimum necessary standard for PHI access',
    category: 'healthcare',
    enabled: true,
    priority: 5,
    complianceFrameworks: ['HIPAA'],
    verticals: ['healthcare'],
    evaluator: (input: OPAInput): PolicyEvalResult => {
      const violations: PolicyViolation[] = [];
      const obligations: PolicyObligation[] = [];
      const reasons: string[] = [];

      const isPHI = input.resource.attributes?.containsPHI === true;
      if (!isPHI) {
        return { allow: true, violations, obligations, reasons: ['Resource does not contain PHI'] };
      }

      const hasTPO = input.context?.treatmentPaymentOperations === true;
      const hasAuthorization = input.context?.patientAuthorization === true;
      const requestedFields = input.context?.requestedFields as string[] | undefined;

      if (!hasTPO && !hasAuthorization) {
        violations.push({
          policyId: 'hc-minimum-necessary',
          severity: 'critical',
          message: 'PHI access requires TPO justification or patient authorization',
          remediation: 'Document treatment, payment, or operations need, or obtain patient authorization',
          complianceFramework: 'HIPAA',
        });
        return { allow: false, violations, obligations, reasons: ['No TPO or authorization for PHI access'] };
      }

      // If accessing more than minimum necessary fields
      if (requestedFields && requestedFields.length > 10) {
        obligations.push({
          type: 'audit',
          description: 'Broad PHI access: document minimum necessary justification',
        });
      }

      obligations.push({
        type: 'log',
        description: 'PHI access event logged per HIPAA accounting of disclosures',
      });

      reasons.push('PHI access authorized under minimum necessary standard');
      return { allow: true, violations, obligations, reasons };
    },
  },
];

// ---------------------------------------------------------------------------
// OPA SERVICE
// ---------------------------------------------------------------------------

class OPAService {
  private enabled: boolean;
  private mode: 'server' | 'embedded';
  private serverUrl: string;
  private policies: Map<string, PolicyDefinition> = new Map();
  private bundles: Map<string, PolicyBundle> = new Map();

  // Stats
  private evaluationCount = 0;
  private denyCount = 0;
  private violationCount = 0;
  private totalLatencyMs = 0;

  constructor() {
    this.enabled = process.env['OPA_ENABLED'] === 'true';
    this.mode = (process.env['OPA_MODE'] as 'server' | 'embedded') || 'embedded';
    this.serverUrl = process.env['OPA_URL'] || 'http://localhost:8181';

    // Load default policies
    for (const policy of DEFAULT_POLICIES) {
      this.policies.set(policy.id, policy);
    }

    if (this.enabled) {
      logger.info(`[OPA] Enabled in ${this.mode} mode — ${this.policies.size} policies loaded`);
    } else {
      logger.info('[OPA] Disabled — set OPA_ENABLED=true to activate');
    }
  }

  // ─── Core Evaluation ──────────────────────────────────────────────────

  /**
   * Evaluate an authorization request against all applicable policies.
   */
  async evaluate(input: OPAInput): Promise<OPAResult> {
    const startTime = Date.now();
    const decisionId = `opa-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;

    if (!this.enabled) {
      return {
        allow: true,
        reasons: ['OPA disabled — all requests allowed by default'],
        violations: [],
        obligations: [],
        metadata: {
          policyVersion: '1.0.0',
          evaluationTimeMs: Date.now() - startTime,
          policiesEvaluated: 0,
          decisionId,
        },
      };
    }

    if (this.mode === 'server') {
      return this.evaluateWithServer(input, decisionId, startTime);
    }

    return this.evaluateEmbedded(input, decisionId, startTime);
  }

  /**
   * Evaluate using embedded JavaScript policy evaluators.
   */
  private async evaluateEmbedded(
    input: OPAInput,
    decisionId: string,
    startTime: number
  ): Promise<OPAResult> {
    const applicablePolicies = this.getApplicablePolicies(input);
    const allViolations: PolicyViolation[] = [];
    const allObligations: PolicyObligation[] = [];
    const allReasons: string[] = [];
    let allow = true;

    // Evaluate policies in priority order
    for (const policy of applicablePolicies) {
      if (!policy.evaluator) continue;

      try {
        const result = policy.evaluator(input);

        if (!result.allow) {
          allow = false;
        }

        allViolations.push(...result.violations);
        allObligations.push(...result.obligations);
        allReasons.push(...result.reasons);
      } catch (error) {
        logger.error(`[OPA] Policy ${policy.id} evaluation error:`, error);
        allReasons.push(`Policy ${policy.id} evaluation failed`);
      }
    }

    const evaluationTimeMs = Date.now() - startTime;

    // Update stats
    this.evaluationCount++;
    if (!allow) this.denyCount++;
    this.violationCount += allViolations.length;
    this.totalLatencyMs += evaluationTimeMs;

    return {
      allow,
      reasons: allReasons,
      violations: allViolations,
      obligations: allObligations,
      metadata: {
        policyVersion: '1.0.0',
        evaluationTimeMs,
        policiesEvaluated: applicablePolicies.length,
        decisionId,
      },
    };
  }

  /**
   * Evaluate using the self-hosted OPA server.
   */
  private async evaluateWithServer(
    input: OPAInput,
    decisionId: string,
    startTime: number
  ): Promise<OPAResult> {
    try {
      const response = await fetch(`${this.serverUrl}/v1/data/datacendia/authz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
        signal: AbortSignal.timeout(5_000),
      });

      if (!response.ok) {
        throw new Error(`OPA server returned ${response.status}`);
      }

      const data = await response.json() as any;
      const result = data.result || {};

      const evaluationTimeMs = Date.now() - startTime;
      this.evaluationCount++;
      if (!result.allow) this.denyCount++;
      this.totalLatencyMs += evaluationTimeMs;

      return {
        allow: result.allow ?? false,
        reasons: result.reasons || [],
        violations: result.violations || [],
        obligations: result.obligations || [],
        metadata: {
          policyVersion: result.policy_version || '1.0.0',
          evaluationTimeMs,
          policiesEvaluated: result.policies_evaluated || 0,
          decisionId,
        },
      };
    } catch (error) {
      logger.warn('[OPA] Server evaluation failed, falling back to embedded:', error);
      return this.evaluateEmbedded(input, decisionId, startTime);
    }
  }

  /**
   * Get policies applicable to the given input.
   */
  private getApplicablePolicies(input: OPAInput): PolicyDefinition[] {
    return Array.from(this.policies.values())
      .filter(p => {
        if (!p.enabled) return false;
        // Filter by vertical if specified
        if (p.verticals.length > 0 && input.resource.vertical) {
          if (!p.verticals.includes(input.resource.vertical)) return false;
        }
        return true;
      })
      .sort((a, b) => a.priority - b.priority);
  }

  // ─── Policy Management ────────────────────────────────────────────────

  /**
   * Add or update a policy.
   */
  addPolicy(policy: PolicyDefinition): void {
    this.policies.set(policy.id, policy);
    logger.info(`[OPA] Policy ${policy.id} (${policy.category}) added/updated`);
  }

  /**
   * Remove a policy.
   */
  removePolicy(policyId: string): boolean {
    const removed = this.policies.delete(policyId);
    if (removed) logger.info(`[OPA] Policy ${policyId} removed`);
    return removed;
  }

  /**
   * Enable/disable a policy.
   */
  setPolicyEnabled(policyId: string, enabled: boolean): boolean {
    const policy = this.policies.get(policyId);
    if (!policy) return false;
    policy.enabled = enabled;
    logger.info(`[OPA] Policy ${policyId} ${enabled ? 'enabled' : 'disabled'}`);
    return true;
  }

  /**
   * Get all policies.
   */
  getPolicies(): PolicyDefinition[] {
    return Array.from(this.policies.values());
  }

  /**
   * Get a policy by ID.
   */
  getPolicy(policyId: string): PolicyDefinition | undefined {
    return this.policies.get(policyId);
  }

  /**
   * Get policies by category.
   */
  getPoliciesByCategory(category: PolicyCategory): PolicyDefinition[] {
    return Array.from(this.policies.values()).filter(p => p.category === category);
  }

  /**
   * Get policies by compliance framework.
   */
  getPoliciesByFramework(framework: string): PolicyDefinition[] {
    return Array.from(this.policies.values()).filter(p => p.complianceFrameworks.includes(framework));
  }

  // ─── Bundle Management ────────────────────────────────────────────────

  /**
   * Load a policy bundle.
   */
  loadBundle(bundle: PolicyBundle): void {
    this.bundles.set(bundle.id, bundle);
    for (const policy of bundle.policies) {
      this.policies.set(policy.id, policy);
    }
    logger.info(`[OPA] Bundle '${bundle.name}' v${bundle.version} loaded (${bundle.policies.length} policies)`);
  }

  /**
   * Unload a policy bundle.
   */
  unloadBundle(bundleId: string): boolean {
    const bundle = this.bundles.get(bundleId);
    if (!bundle) return false;

    for (const policy of bundle.policies) {
      this.policies.delete(policy.id);
    }
    this.bundles.delete(bundleId);
    logger.info(`[OPA] Bundle '${bundle.name}' unloaded`);
    return true;
  }

  /**
   * Get loaded bundles.
   */
  getBundles(): PolicyBundle[] {
    return Array.from(this.bundles.values());
  }

  // ─── Health & Stats ───────────────────────────────────────────────────

  /**
   * Check OPA server health.
   */
  async checkHealth(): Promise<OPAHealth> {
    if (!this.enabled) {
      return { enabled: false, mode: this.mode, connected: false, policyCount: 0, bundleCount: 0 };
    }

    if (this.mode === 'embedded') {
      return {
        enabled: true,
        mode: 'embedded',
        connected: true,
        policyCount: this.policies.size,
        bundleCount: this.bundles.size,
      };
    }

    try {
      const start = Date.now();
      const response = await fetch(`${this.serverUrl}/health`, {
        signal: AbortSignal.timeout(3_000),
      });

      return {
        enabled: true,
        mode: 'server',
        connected: response.ok,
        policyCount: this.policies.size,
        bundleCount: this.bundles.size,
        latencyMs: Date.now() - start,
      };
    } catch {
      return {
        enabled: true,
        mode: 'server',
        connected: false,
        policyCount: this.policies.size,
        bundleCount: this.bundles.size,
      };
    }
  }

  /**
   * Get evaluation statistics.
   */
  getStats(): {
    enabled: boolean;
    mode: string;
    policyCount: number;
    activePolicies: number;
    bundleCount: number;
    evaluationCount: number;
    denyCount: number;
    denyRate: number;
    violationCount: number;
    averageLatencyMs: number;
  } {
    return {
      enabled: this.enabled,
      mode: this.mode,
      policyCount: this.policies.size,
      activePolicies: Array.from(this.policies.values()).filter(p => p.enabled).length,
      bundleCount: this.bundles.size,
      evaluationCount: this.evaluationCount,
      denyCount: this.denyCount,
      denyRate: this.evaluationCount > 0 ? this.denyCount / this.evaluationCount : 0,
      violationCount: this.violationCount,
      averageLatencyMs: this.evaluationCount > 0 ? this.totalLatencyMs / this.evaluationCount : 0,
    };
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

// Export singleton
export const opa = new OPAService();
export default opa;
