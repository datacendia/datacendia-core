/**
 * Custom Policy Authoring & Simulation Service
 * 
 * Visual policy editor backend with simulation sandbox for testing policies
 * on sample data before deployment.
 * 
 * Enterprise Platinum Standard:
 * - Policy CRUD with versioning and approval workflows
 * - Template library for common compliance domains
 * - Simulation engine: test policies against sample data
 * - Inline validation with error reporting
 * - Full audit trail of all policy changes
 * - Role-based access for policy management
 * 
 * @module services/governance/PolicyAuthoringService
 */

import { logger } from '../../utils/logger.js';
import prisma from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PolicyDefinition {
  id: string;
  name: string;
  description: string;
  domain: PolicyDomain;
  version: string;
  status: PolicyStatus;
  rules: PolicyRule[];
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  metadata: PolicyMetadata;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export type PolicyDomain = 'governance' | 'compliance' | 'security' | 'data_protection' | 'ai_ethics' | 'financial' | 'operational';
export type PolicyStatus = 'draft' | 'pending_review' | 'approved' | 'active' | 'deprecated' | 'archived';
export type RuleOperator = 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'matches' | 'between';
export type ActionType = 'allow' | 'deny' | 'flag' | 'escalate' | 'notify' | 'log' | 'quarantine' | 'redact' | 'require_approval';

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  priority: number;
  enabled: boolean;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  exceptions: PolicyException[];
}

export interface PolicyCondition {
  field: string;
  operator: RuleOperator;
  value: any;
  logicalOperator?: 'AND' | 'OR';
}

export interface PolicyAction {
  type: ActionType;
  params: Record<string, any>;
  notifyRoles?: string[];
  message?: string;
}

export interface PolicyException {
  id: string;
  description: string;
  conditions: PolicyCondition[];
  expiresAt?: string;
  approvedBy: string;
}

export interface PolicyMetadata {
  tags: string[];
  regulatoryFrameworks: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  effectiveDate?: string;
  expirationDate?: string;
  reviewFrequency: 'monthly' | 'quarterly' | 'annually';
  lastReviewDate?: string;
  nextReviewDate?: string;
}

export interface PolicyTemplate {
  id: string;
  name: string;
  description: string;
  domain: PolicyDomain;
  framework: string;
  rules: Omit<PolicyRule, 'id'>[];
  tags: string[];
}

export interface SimulationRequest {
  policyId: string;
  testData: SimulationTestCase[];
  options: SimulationOptions;
}

export interface SimulationTestCase {
  id: string;
  name: string;
  data: Record<string, any>;
  expectedOutcome?: 'pass' | 'fail' | 'flag';
}

export interface SimulationOptions {
  stopOnFirstFailure: boolean;
  includeExplanation: boolean;
  evaluateExceptions: boolean;
}

export interface SimulationResult {
  policyId: string;
  policyVersion: string;
  executedAt: string;
  duration: number;
  summary: { total: number; passed: number; failed: number; flagged: number; errors: number };
  results: SimulationTestResult[];
}

export interface SimulationTestResult {
  testCaseId: string;
  testCaseName: string;
  outcome: 'pass' | 'fail' | 'flag' | 'error';
  triggeredRules: { ruleId: string; ruleName: string; actions: PolicyAction[] }[];
  explanation: string[];
  duration: number;
}

export interface PolicyVersionHistory {
  version: string;
  changes: string;
  changedBy: string;
  changedAt: string;
  diff: { field: string; before: any; after: any }[];
}

export interface PolicyAuditEntry {
  id: string;
  policyId: string;
  action: 'created' | 'updated' | 'approved' | 'activated' | 'deprecated' | 'simulated' | 'archived';
  userId: string;
  timestamp: string;
  details: Record<string, any>;
}

// =============================================================================
// SERVICE
// =============================================================================

class PolicyAuthoringService {
  private templates: Map<string, PolicyTemplate> = new Map();
  private templatesHydrated = false;

  constructor() {
    this.loadBuiltInTemplates();
  }

  private async ensureTemplatesHydrated(): Promise<void> {
    if (this.templatesHydrated) return;
    this.templatesHydrated = true;
    try {
      const templates = await prisma.policy_templates.findMany({});
      for (const t of templates) {
        this.templates.set(t.id, {
          id: t.id,
          name: t.name,
          description: t.description,
          domain: t.domain as PolicyDomain,
          framework: t.framework,
          rules: (t.rules as any) || [],
          tags: (t.tags as any) || [],
        });
      }
    } catch {
      // If DB isn't migrated yet, keep using built-in templates.
    }
  }

  // ---------------------------------------------------------------------------
  // POLICY CRUD
  // ---------------------------------------------------------------------------

  async createPolicy(input: {
    name: string;
    description: string;
    domain: PolicyDomain;
    rules?: PolicyRule[];
    conditions?: PolicyCondition[];
    actions?: PolicyAction[];
    metadata?: Partial<PolicyMetadata>;
    createdBy: string;
    organizationId?: string;
    templateId?: string;
  }): Promise<PolicyDefinition> {
    await this.ensureTemplatesHydrated();
    const id = `pol_${crypto.randomUUID().split('-')[0]}`;
    const organizationId = input.organizationId || 'default';
    let rules = input.rules || [];
    let conditions = input.conditions || [];
    let actions = input.actions || [];

    if (input.templateId) {
      const template = this.templates.get(input.templateId);
      if (template) {
        rules = template.rules.map(r => ({ ...r, id: `rule_${crypto.randomUUID().split('-')[0]}` }));
      }
    }

    const policy: PolicyDefinition = {
      id,
      name: input.name,
      description: input.description,
      domain: input.domain,
      version: '1.0.0',
      status: 'draft',
      rules,
      conditions,
      actions,
      metadata: {
        tags: input.metadata?.tags || [],
        regulatoryFrameworks: input.metadata?.regulatoryFrameworks || [],
        riskLevel: input.metadata?.riskLevel || 'medium',
        reviewFrequency: input.metadata?.reviewFrequency || 'quarterly',
        ...input.metadata,
      },
      createdBy: input.createdBy,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await prisma.policy_definitions.create({
        data: {
          id: policy.id,
          organization_id: organizationId,
          name: policy.name,
          description: policy.description,
          domain: policy.domain,
          version: policy.version,
          status: policy.status,
          rules: policy.rules as any,
          conditions: policy.conditions as any,
          actions: policy.actions as any,
          metadata: policy.metadata as any,
          created_by: policy.createdBy,
          approved_by: null,
          approved_at: null,
        },
      });
      await prisma.policy_audit_entries.create({
        data: {
          policy_id: policy.id,
          action: 'created',
          user_id: input.createdBy,
          details: { name: policy.name, domain: policy.domain } as any,
        },
      });
    } catch (e) {
      logger.warn('[PolicyAuthoring] DB write failed; policy not persisted', e);
    }

    logger.info(`[PolicyAuthoring] Policy created: ${id} (${policy.name})`);
    return policy;
  }

  async updatePolicy(policyId: string, updates: Partial<PolicyDefinition>, userId: string, changeDescription: string): Promise<PolicyDefinition | null> {
    const policy = await this.getPolicy(policyId);
    if (!policy) return null;

    const diff: { field: string; before: any; after: any }[] = [];
    for (const [key, value] of Object.entries(updates)) {
      if (key !== 'id' && key !== 'createdBy' && key !== 'createdAt') {
        diff.push({ field: key, before: (policy as any)[key], after: value });
        (policy as any)[key] = value;
      }
    }

    const versionParts = policy.version.split('.').map(Number);
    versionParts[2]++;
    policy.version = versionParts.join('.');
    policy.updatedAt = new Date().toISOString();
    if (policy.status === 'approved' || policy.status === 'active') {
      policy.status = 'draft';
    }

    try {
      await prisma.policy_definitions.update({
        where: { id: policyId },
        data: {
          name: policy.name,
          description: policy.description,
          domain: policy.domain,
          version: policy.version,
          status: policy.status,
          rules: policy.rules as any,
          conditions: policy.conditions as any,
          actions: policy.actions as any,
          metadata: policy.metadata as any,
        },
      });
      await prisma.policy_version_history.create({
        data: {
          policy_id: policyId,
          version: policy.version,
          changes: changeDescription,
          changed_by: userId,
          changed_at: new Date(policy.updatedAt),
          diff: diff as any,
        },
      });
      await prisma.policy_audit_entries.create({
        data: {
          policy_id: policyId,
          action: 'updated',
          user_id: userId,
          details: { version: policy.version, changes: changeDescription } as any,
        },
      });
    } catch (e) {
      logger.warn('[PolicyAuthoring] DB update failed; policy not persisted', e);
    }

    return policy;
  }

  async approvePolicy(policyId: string, userId: string): Promise<PolicyDefinition | null> {
    const policy = await this.getPolicy(policyId);
    if (!policy) return null;

    policy.status = 'approved';
    policy.approvedBy = userId;
    policy.approvedAt = new Date().toISOString();
    policy.updatedAt = new Date().toISOString();

    try {
      await prisma.policy_definitions.update({
        where: { id: policyId },
        data: {
          status: policy.status,
          approved_by: policy.approvedBy,
          approved_at: policy.approvedAt ? new Date(policy.approvedAt) : null,
        },
      });
      await prisma.policy_audit_entries.create({
        data: { policy_id: policyId, action: 'approved', user_id: userId, details: { version: policy.version } as any },
      });
    } catch (e) {
      logger.warn('[PolicyAuthoring] DB approve failed', e);
    }
    return policy;
  }

  async activatePolicy(policyId: string, userId: string): Promise<PolicyDefinition | null> {
    const policy = await this.getPolicy(policyId);
    if (!policy || policy.status !== 'approved') return null;

    policy.status = 'active';
    policy.metadata.effectiveDate = new Date().toISOString();
    policy.updatedAt = new Date().toISOString();

    try {
      await prisma.policy_definitions.update({
        where: { id: policyId },
        data: { status: policy.status, metadata: policy.metadata as any },
      });
      await prisma.policy_audit_entries.create({
        data: { policy_id: policyId, action: 'activated', user_id: userId, details: { version: policy.version } as any },
      });
    } catch (e) {
      logger.warn('[PolicyAuthoring] DB activate failed', e);
    }
    return policy;
  }

  async deprecatePolicy(policyId: string, userId: string): Promise<PolicyDefinition | null> {
    const policy = await this.getPolicy(policyId);
    if (!policy) return null;

    policy.status = 'deprecated';
    policy.updatedAt = new Date().toISOString();

    try {
      await prisma.policy_definitions.update({
        where: { id: policyId },
        data: { status: policy.status },
      });
      await prisma.policy_audit_entries.create({
        data: { policy_id: policyId, action: 'deprecated', user_id: userId, details: { version: policy.version } as any },
      });
    } catch (e) {
      logger.warn('[PolicyAuthoring] DB deprecate failed', e);
    }
    return policy;
  }

  async getPolicy(policyId: string): Promise<PolicyDefinition | null> {
    try {
      const p = await prisma.policy_definitions.findUnique({ where: { id: policyId } });
      if (!p) return null;
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        domain: p.domain as PolicyDomain,
        version: p.version,
        status: p.status as PolicyStatus,
        rules: (p.rules as any) || [],
        conditions: (p.conditions as any) || [],
        actions: (p.actions as any) || [],
        metadata: (p.metadata as any) || { tags: [], regulatoryFrameworks: [], riskLevel: 'medium', reviewFrequency: 'quarterly' },
        createdBy: p.created_by,
        createdAt: p.created_at.toISOString(),
        updatedAt: p.updated_at.toISOString(),
        approvedBy: p.approved_by || undefined,
        approvedAt: p.approved_at ? p.approved_at.toISOString() : undefined,
      };
    } catch {
      return null;
    }
  }

  async listPolicies(filters?: { domain?: PolicyDomain; status?: PolicyStatus; query?: string }): Promise<PolicyDefinition[]> {
    const where: any = {};
    if (filters?.domain) where.domain = filters.domain;
    if (filters?.status) where.status = filters.status;
    if (filters?.query) {
      where.OR = [
        { name: { contains: filters.query, mode: 'insensitive' } },
        { description: { contains: filters.query, mode: 'insensitive' } },
      ];
    }
    try {
      const rows = await prisma.policy_definitions.findMany({ where, orderBy: { updated_at: 'desc' } });
      const results: PolicyDefinition[] = [];
      for (const p of rows) {
        results.push({
          id: p.id,
          name: p.name,
          description: p.description,
          domain: p.domain as PolicyDomain,
          version: p.version,
          status: p.status as PolicyStatus,
          rules: (p.rules as any) || [],
          conditions: (p.conditions as any) || [],
          actions: (p.actions as any) || [],
          metadata: (p.metadata as any) || { tags: [], regulatoryFrameworks: [], riskLevel: 'medium', reviewFrequency: 'quarterly' },
          createdBy: p.created_by,
          createdAt: p.created_at.toISOString(),
          updatedAt: p.updated_at.toISOString(),
          approvedBy: p.approved_by || undefined,
          approvedAt: p.approved_at ? p.approved_at.toISOString() : undefined,
        });
      }
      return results;
    } catch {
      return [];
    }
  }

  async getPolicyVersions(policyId: string): Promise<PolicyVersionHistory[]> {
    try {
      const rows = await prisma.policy_version_history.findMany({
        where: { policy_id: policyId },
        orderBy: { changed_at: 'desc' },
      });
      return rows.map(r => ({
        version: r.version,
        changes: r.changes,
        changedBy: r.changed_by,
        changedAt: r.changed_at.toISOString(),
        diff: (r.diff as any) || [],
      }));
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // TEMPLATES
  // ---------------------------------------------------------------------------

  async getTemplates(domain?: PolicyDomain): Promise<PolicyTemplate[]> {
    await this.ensureTemplatesHydrated();
    let results = Array.from(this.templates.values());
    if (domain) results = results.filter(t => t.domain === domain);
    return results;
  }

  async getTemplate(templateId: string): Promise<PolicyTemplate | null> {
    await this.ensureTemplatesHydrated();
    return this.templates.get(templateId) || null;
  }

  // ---------------------------------------------------------------------------
  // SIMULATION ENGINE
  // ---------------------------------------------------------------------------

  async simulatePolicy(request: SimulationRequest): Promise<SimulationResult> {
    const policy = await this.getPolicy(request.policyId);
    if (!policy) throw new Error(`Policy ${request.policyId} not found`);

    const startTime = Date.now();
    const results: SimulationTestResult[] = [];
    let passed = 0, failed = 0, flagged = 0, errors = 0;

    for (const testCase of request.testData) {
      const caseStart = Date.now();
      try {
        const result = this.evaluateTestCase(policy, testCase, request.options);
        results.push(result);

        if (result.outcome === 'pass') passed++;
        else if (result.outcome === 'fail') failed++;
        else if (result.outcome === 'flag') flagged++;
        else errors++;

        if (request.options.stopOnFirstFailure && result.outcome === 'fail') break;
      } catch (error) {
        results.push({
          testCaseId: testCase.id,
          testCaseName: testCase.name,
          outcome: 'error',
          triggeredRules: [],
          explanation: [`Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
          duration: Date.now() - caseStart,
        });
        errors++;
      }
    }

    const simResult: SimulationResult = {
      policyId: request.policyId,
      policyVersion: policy.version,
      executedAt: new Date().toISOString(),
      duration: Date.now() - startTime,
      summary: { total: request.testData.length, passed, failed, flagged, errors },
      results,
    };

    try {
      await prisma.policy_audit_entries.create({
        data: {
          policy_id: request.policyId,
          action: 'simulated',
          user_id: 'system',
          details: { testCases: request.testData.length, passed, failed, flagged, errors } as any,
        },
      });
    } catch {}

    return simResult;
  }

  private evaluateTestCase(policy: PolicyDefinition, testCase: SimulationTestCase, options: SimulationOptions): SimulationTestResult {
    const startTime = Date.now();
    const triggeredRules: SimulationTestResult['triggeredRules'] = [];
    const explanation: string[] = [];
    let outcome: 'pass' | 'fail' | 'flag' = 'pass';

    for (const rule of policy.rules.filter(r => r.enabled)) {
      const ruleMatches = this.evaluateConditions(rule.conditions, testCase.data);

      if (ruleMatches) {
        // Check exceptions
        if (options.evaluateExceptions) {
          const exceptionApplies = rule.exceptions.some(ex =>
            this.evaluateConditions(ex.conditions, testCase.data)
          );
          if (exceptionApplies) {
            explanation.push(`Rule "${rule.name}" matched but exception applies`);
            continue;
          }
        }

        triggeredRules.push({ ruleId: rule.id, ruleName: rule.name, actions: rule.actions });

        for (const action of rule.actions) {
          if (action.type === 'deny' || action.type === 'quarantine') {
            outcome = 'fail';
            explanation.push(`Rule "${rule.name}" DENIED: ${action.message || 'Policy violation detected'}`);
          } else if (action.type === 'flag' || action.type === 'escalate') {
            if (outcome !== 'fail') outcome = 'flag';
            explanation.push(`Rule "${rule.name}" FLAGGED: ${action.message || 'Requires review'}`);
          } else if (action.type === 'allow') {
            explanation.push(`Rule "${rule.name}" ALLOWED: ${action.message || 'Policy satisfied'}`);
          } else {
            explanation.push(`Rule "${rule.name}" triggered action: ${action.type}`);
          }
        }
      }
    }

    if (triggeredRules.length === 0) {
      explanation.push('No rules triggered — default allow');
    }

    return {
      testCaseId: testCase.id,
      testCaseName: testCase.name,
      outcome,
      triggeredRules,
      explanation,
      duration: Date.now() - startTime,
    };
  }

  private evaluateConditions(conditions: PolicyCondition[], data: Record<string, any>): boolean {
    if (conditions.length === 0) return true;

    let result = this.evaluateSingleCondition(conditions[0], data);

    for (let i = 1; i < conditions.length; i++) {
      const cond = conditions[i];
      const condResult = this.evaluateSingleCondition(cond, data);

      if (cond.logicalOperator === 'OR') {
        result = result || condResult;
      } else {
        result = result && condResult;
      }
    }

    return result;
  }

  private evaluateSingleCondition(condition: PolicyCondition, data: Record<string, any>): boolean {
    const fieldValue = this.getNestedValue(data, condition.field);

    switch (condition.operator) {
      case 'equals': return fieldValue === condition.value;
      case 'not_equals': return fieldValue !== condition.value;
      case 'greater_than': return Number(fieldValue) > Number(condition.value);
      case 'less_than': return Number(fieldValue) < Number(condition.value);
      case 'contains': return String(fieldValue).includes(String(condition.value));
      case 'not_contains': return !String(fieldValue).includes(String(condition.value));
      case 'in': return Array.isArray(condition.value) && condition.value.includes(fieldValue);
      case 'not_in': return Array.isArray(condition.value) && !condition.value.includes(fieldValue);
      case 'matches': return new RegExp(String(condition.value)).test(String(fieldValue));
      case 'between': return Array.isArray(condition.value) && Number(fieldValue) >= condition.value[0] && Number(fieldValue) <= condition.value[1];
      default: return false;
    }
  }

  private getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
  }

  // ---------------------------------------------------------------------------
  // AUDIT
  // ---------------------------------------------------------------------------

  async getAuditLog(policyId?: string): Promise<PolicyAuditEntry[]> {
    try {
      const where: any = {};
      if (policyId) where.policy_id = policyId;
      const rows = await prisma.policy_audit_entries.findMany({ where, orderBy: { timestamp: 'desc' } });
      return rows.map(r => ({
        id: r.id,
        policyId: r.policy_id,
        action: r.action as any,
        userId: r.user_id,
        timestamp: r.timestamp.toISOString(),
        details: (r.details as any) || {},
      }));
    } catch {
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // BUILT-IN TEMPLATES
  // ---------------------------------------------------------------------------

  private loadBuiltInTemplates(): void {
    const templates: PolicyTemplate[] = [
      {
        id: 'tmpl_gdpr_data_processing',
        name: 'GDPR Data Processing',
        description: 'Standard policy for GDPR-compliant data processing with consent checks and data minimization',
        domain: 'data_protection',
        framework: 'GDPR',
        tags: ['gdpr', 'privacy', 'data-protection', 'eu'],
        rules: [
          { name: 'Consent Required', description: 'All personal data processing requires valid consent', priority: 1, enabled: true,
            conditions: [{ field: 'data.containsPII', operator: 'equals', value: true }],
            actions: [{ type: 'require_approval', params: { approverRole: 'dpo' }, message: 'PII processing requires DPO approval' }],
            exceptions: [] },
          { name: 'Data Minimization', description: 'Only collect data necessary for stated purpose', priority: 2, enabled: true,
            conditions: [{ field: 'data.fieldsCollected', operator: 'greater_than', value: 10 }],
            actions: [{ type: 'flag', params: {}, message: 'Excessive data collection — review for minimization' }],
            exceptions: [] },
          { name: 'Retention Limit', description: 'Data must not be retained beyond stated period', priority: 3, enabled: true,
            conditions: [{ field: 'data.retentionDays', operator: 'greater_than', value: 2555 }],
            actions: [{ type: 'deny', params: {}, message: 'Retention period exceeds 7-year maximum' }],
            exceptions: [] },
        ],
      },
      {
        id: 'tmpl_eu_ai_act',
        name: 'EU AI Act High-Risk',
        description: 'Compliance policy for EU AI Act high-risk AI systems (Articles 9-15)',
        domain: 'ai_ethics',
        framework: 'EU AI Act',
        tags: ['eu-ai-act', 'high-risk', 'ai-governance', 'regulation'],
        rules: [
          { name: 'Art. 9 Risk Management', description: 'Continuous risk identification and mitigation required', priority: 1, enabled: true,
            conditions: [{ field: 'ai.riskAssessmentAge', operator: 'greater_than', value: 90 }],
            actions: [{ type: 'escalate', params: { team: 'risk-management' }, message: 'Risk assessment older than 90 days — renewal required' }],
            exceptions: [] },
          { name: 'Art. 12 Logging', description: 'Automatic event logging for traceability', priority: 1, enabled: true,
            conditions: [{ field: 'ai.auditLogEnabled', operator: 'equals', value: false }],
            actions: [{ type: 'deny', params: {}, message: 'AI system must have audit logging enabled per Art. 12' }],
            exceptions: [] },
          { name: 'Art. 14 Human Oversight', description: 'Human oversight mechanisms required', priority: 1, enabled: true,
            conditions: [{ field: 'ai.humanOversight', operator: 'equals', value: false }],
            actions: [{ type: 'deny', params: {}, message: 'Human oversight required per Art. 14' }],
            exceptions: [] },
          { name: 'Art. 15 Robustness', description: 'Appropriate accuracy and cybersecurity', priority: 2, enabled: true,
            conditions: [{ field: 'ai.accuracyScore', operator: 'less_than', value: 0.85 }],
            actions: [{ type: 'flag', params: {}, message: 'Accuracy below threshold — Art. 15 review needed' }],
            exceptions: [] },
        ],
      },
      {
        id: 'tmpl_soc2_access',
        name: 'SOC 2 Access Control',
        description: 'Access control policies aligned with SOC 2 Type II requirements',
        domain: 'security',
        framework: 'SOC 2',
        tags: ['soc2', 'access-control', 'security', 'trust-services'],
        rules: [
          { name: 'MFA Required', description: 'Multi-factor authentication required for all admin access', priority: 1, enabled: true,
            conditions: [{ field: 'auth.role', operator: 'in', value: ['admin', 'superadmin'] }, { field: 'auth.mfaEnabled', operator: 'equals', value: false, logicalOperator: 'AND' }],
            actions: [{ type: 'deny', params: {}, message: 'MFA required for admin roles' }],
            exceptions: [] },
          { name: 'Session Timeout', description: 'Sessions must expire after inactivity', priority: 2, enabled: true,
            conditions: [{ field: 'auth.sessionAge', operator: 'greater_than', value: 3600 }],
            actions: [{ type: 'deny', params: {}, message: 'Session expired — re-authentication required' }],
            exceptions: [] },
          { name: 'IP Allowlist', description: 'Production access restricted to known IPs', priority: 1, enabled: true,
            conditions: [{ field: 'auth.environment', operator: 'equals', value: 'production' }, { field: 'auth.ipAllowlisted', operator: 'equals', value: false, logicalOperator: 'AND' }],
            actions: [{ type: 'deny', params: {}, message: 'Production access requires allowlisted IP' }],
            exceptions: [] },
        ],
      },
      {
        id: 'tmpl_aml_kyc',
        name: 'AML/KYC Financial',
        description: 'Anti-money laundering and Know Your Customer compliance policy',
        domain: 'financial',
        framework: 'AML/KYC',
        tags: ['aml', 'kyc', 'financial', 'compliance', 'banking'],
        rules: [
          { name: 'High-Value Transaction', description: 'Flag transactions above threshold', priority: 1, enabled: true,
            conditions: [{ field: 'transaction.amount', operator: 'greater_than', value: 10000 }],
            actions: [{ type: 'flag', params: {}, message: 'Transaction exceeds reporting threshold' }, { type: 'notify', params: {}, notifyRoles: ['compliance-officer'] }],
            exceptions: [] },
          { name: 'Sanctioned Entity', description: 'Block transactions with sanctioned entities', priority: 1, enabled: true,
            conditions: [{ field: 'counterparty.sanctioned', operator: 'equals', value: true }],
            actions: [{ type: 'deny', params: {}, message: 'Transaction blocked — sanctioned entity' }, { type: 'quarantine', params: {} }],
            exceptions: [] },
          { name: 'PEP Check', description: 'Enhanced due diligence for politically exposed persons', priority: 2, enabled: true,
            conditions: [{ field: 'counterparty.pep', operator: 'equals', value: true }],
            actions: [{ type: 'escalate', params: { team: 'compliance' }, message: 'PEP detected — enhanced due diligence required' }],
            exceptions: [] },
        ],
      },
      {
        id: 'tmpl_hipaa_phi',
        name: 'HIPAA PHI Protection',
        description: 'Protected Health Information handling policy',
        domain: 'compliance',
        framework: 'HIPAA',
        tags: ['hipaa', 'phi', 'healthcare', 'privacy'],
        rules: [
          { name: 'PHI Encryption', description: 'All PHI must be encrypted at rest and in transit', priority: 1, enabled: true,
            conditions: [{ field: 'data.containsPHI', operator: 'equals', value: true }, { field: 'data.encrypted', operator: 'equals', value: false, logicalOperator: 'AND' }],
            actions: [{ type: 'deny', params: {}, message: 'PHI must be encrypted' }],
            exceptions: [] },
          { name: 'Minimum Necessary', description: 'Only minimum necessary PHI should be accessed', priority: 2, enabled: true,
            conditions: [{ field: 'access.scope', operator: 'equals', value: 'full_record' }],
            actions: [{ type: 'flag', params: {}, message: 'Full record access — verify minimum necessary standard' }],
            exceptions: [] },
        ],
      },
    ];

    for (const t of templates) {
      this.templates.set(t.id, t);
    }
  }
}

export const policyAuthoring = new PolicyAuthoringService();
export { PolicyAuthoringService };
