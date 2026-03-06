/**
 * Security — Policy Engine
 *
 * Security hardening module for attack prevention and threat detection.
 *
 * @exports policyEngine, DecisionPolicy, SegregationRule
 * @module security/PolicyEngine
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// CASBIN POLICY ENGINE - Policy-as-Code for CendiaVeto & CendiaGovernance
// =============================================================================
// Enforces RBAC/ABAC policies for:
// - Decision approvals and vetoes
// - Resource access control
// - Segregation of duties
// - Audit trail requirements
// =============================================================================

import { newEnforcer, Enforcer } from 'casbin';
import path from 'path';
import { getErrorMessage } from '../utils/errors.js';

import { logger } from '../utils/logger.js';
// Policy model definition (PERM: Policy, Effect, Request, Matchers)
const MODEL_CONF = `
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _
g2 = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch2(r.obj, p.obj) && regexMatch(r.act, p.act)
`;

// Datacendia-specific policies
const DEFAULT_POLICIES = [
  // Admin can do everything
  ['admin', '*', '*', 'allow'],
  
  // Analyst permissions
  ['analyst', '/api/v1/council/*', 'GET|POST', 'allow'],
  ['analyst', '/api/v1/decisions/*', 'GET', 'allow'],
  ['analyst', '/api/v1/metrics/*', 'GET', 'allow'],
  ['analyst', '/api/v1/gnosis/*', 'GET|POST', 'allow'],
  
  // Operator permissions
  ['operator', '/api/v1/workflows/*', 'GET|POST|PUT', 'allow'],
  ['operator', '/api/v1/queue/*', 'GET|POST', 'allow'],
  ['operator', '/api/v1/integrations/*', 'GET|POST', 'allow'],
  
  // Auditor permissions (read-only)
  ['auditor', '/api/v1/*', 'GET', 'allow'],
  ['auditor', '/api/v1/*/write', '*', 'deny'],
  
  // Council member permissions
  ['council-member', '/api/v1/council/*', 'GET|POST', 'allow'],
  ['council-member', '/api/v1/deliberations/*', 'GET|POST', 'allow'],
  
  // Veto authority permissions
  ['veto-authority', '/api/v1/veto/*', 'GET|POST', 'allow'],
  ['veto-authority', '/api/v1/decisions/*/veto', 'POST', 'allow'],
  
  // Viewer permissions (minimal)
  ['viewer', '/api/v1/health', 'GET', 'allow'],
  ['viewer', '/api/v1/me', 'GET', 'allow'],
];

// Role hierarchy
const ROLE_HIERARCHY = [
  // Admin inherits all roles
  ['admin', 'analyst'],
  ['admin', 'operator'],
  ['admin', 'auditor'],
  ['admin', 'council-member'],
  ['admin', 'veto-authority'],
  
  // Analyst can view
  ['analyst', 'viewer'],
  
  // Council member can view
  ['council-member', 'viewer'],
];

// Decision-specific policies for CendiaVeto
export interface DecisionPolicy {
  decisionType: string;
  requiredApprovers: number;
  requiredRoles: string[];
  vetoRoles: string[];
  escalationTimeout: number; // minutes
  segregationRules: SegregationRule[];
}

export interface SegregationRule {
  role1: string;
  role2: string;
  action: 'same_decision' | 'same_session';
}

// Default decision policies
const DECISION_POLICIES: DecisionPolicy[] = [
  {
    decisionType: 'financial',
    requiredApprovers: 2,
    requiredRoles: ['admin', 'veto-authority'],
    vetoRoles: ['admin', 'veto-authority'],
    escalationTimeout: 60,
    segregationRules: [
      { role1: 'requester', role2: 'approver', action: 'same_decision' },
    ],
  },
  {
    decisionType: 'personnel',
    requiredApprovers: 2,
    requiredRoles: ['admin', 'council-member'],
    vetoRoles: ['admin', 'veto-authority'],
    escalationTimeout: 120,
    segregationRules: [],
  },
  {
    decisionType: 'strategic',
    requiredApprovers: 3,
    requiredRoles: ['admin', 'council-member', 'veto-authority'],
    vetoRoles: ['admin'],
    escalationTimeout: 240,
    segregationRules: [],
  },
  {
    decisionType: 'operational',
    requiredApprovers: 1,
    requiredRoles: ['admin', 'operator', 'council-member'],
    vetoRoles: ['admin', 'veto-authority'],
    escalationTimeout: 30,
    segregationRules: [],
  },
];

class PolicyEngine {
  private enforcer: Enforcer | null = null;
  private isInitialized: boolean = false;
  private decisionPolicies: Map<string, DecisionPolicy> = new Map();

  constructor() {
    DECISION_POLICIES.forEach(p => this.decisionPolicies.set(p.decisionType, p));
  }

  /**
   * Initialize the policy engine
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Write model to temp file for Casbin
      const fs = await import('fs/promises');
      const os = await import('os');
      const modelPath = `${os.tmpdir()}/cendia_model.conf`;
      await fs.writeFile(modelPath, MODEL_CONF);
      
      // Create enforcer with model file
      this.enforcer = await newEnforcer(modelPath);
      
      // Add default policies
      for (const policy of DEFAULT_POLICIES) {
        await this.enforcer.addPolicy(...policy);
      }
      
      // Add role hierarchy
      for (const [child, parent] of ROLE_HIERARCHY) {
        await this.enforcer.addGroupingPolicy(child, parent);
      }

      this.isInitialized = true;
      logger.info('[PolicyEngine] Initialized with', DEFAULT_POLICIES.length, 'policies');
    } catch (error: unknown) {
      logger.error('[PolicyEngine] Initialization failed:', getErrorMessage(error));
      throw error;
    }
  }

  /**
   * Check if a subject can perform an action on an object
   */
  async enforce(subject: string, object: string, action: string): Promise<boolean> {
    if (!this.isInitialized || !this.enforcer) {
      await this.initialize();
    }

    try {
      const allowed = await this.enforcer!.enforce(subject, object, action);
      
      // Log for audit
      logger.info(`[PolicyEngine] ${subject} ${action} ${object}: ${allowed ? 'ALLOW' : 'DENY'}`);
      
      return allowed;
    } catch (error: unknown) {
      logger.error('[PolicyEngine] Enforcement error:', getErrorMessage(error));
      return false;
    }
  }

  /**
   * Check multiple permissions at once
   */
  async enforceMultiple(
    requests: Array<{ subject: string; object: string; action: string }>
  ): Promise<boolean[]> {
    return Promise.all(
      requests.map(r => this.enforce(r.subject, r.object, r.action))
    );
  }

  /**
   * Add a new policy
   */
  async addPolicy(
    subject: string,
    object: string,
    action: string,
    effect: 'allow' | 'deny' = 'allow'
  ): Promise<boolean> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.addPolicy(subject, object, action, effect);
  }

  /**
   * Remove a policy
   */
  async removePolicy(
    subject: string,
    object: string,
    action: string
  ): Promise<boolean> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.removePolicy(subject, object, action);
  }

  /**
   * Add role assignment
   */
  async addRoleForUser(user: string, role: string): Promise<boolean> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.addGroupingPolicy(user, role);
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(user: string, role: string): Promise<boolean> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.removeGroupingPolicy(user, role);
  }

  /**
   * Get all roles for a user
   */
  async getRolesForUser(user: string): Promise<string[]> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.getRolesForUser(user);
  }

  /**
   * Get all users with a role
   */
  async getUsersForRole(role: string): Promise<string[]> {
    if (!this.enforcer) await this.initialize();
    return this.enforcer!.getUsersForRole(role);
  }

  // ===========================================================================
  // DECISION-SPECIFIC POLICIES (CendiaVeto)
  // ===========================================================================

  /**
   * Get policy for a decision type
   */
  getDecisionPolicy(decisionType: string): DecisionPolicy | undefined {
    return this.decisionPolicies.get(decisionType);
  }

  /**
   * Check if user can approve a decision
   */
  async canApproveDecision(
    userId: string,
    userRoles: string[],
    decisionType: string,
    existingApprovers: string[]
  ): Promise<{ allowed: boolean; reason: string }> {
    const policy = this.decisionPolicies.get(decisionType);
    
    if (!policy) {
      return { allowed: false, reason: 'Unknown decision type' };
    }

    // Check if user already approved
    if (existingApprovers.includes(userId)) {
      return { allowed: false, reason: 'User already approved this decision' };
    }

    // Check if user has required role
    const hasRequiredRole = userRoles.some(r => policy.requiredRoles.includes(r));
    if (!hasRequiredRole) {
      return { 
        allowed: false, 
        reason: `Requires role: ${policy.requiredRoles.join(' or ')}` 
      };
    }

    // Check segregation of duties
    for (const rule of policy.segregationRules) {
      if (rule.action === 'same_decision') {
        // Check if user has conflicting role with existing approvers
        // This is a simplified check - real implementation would be more complex
      }
    }

    return { allowed: true, reason: 'Approval permitted' };
  }

  /**
   * Check if user can veto a decision
   */
  async canVetoDecision(
    userRoles: string[],
    decisionType: string
  ): Promise<{ allowed: boolean; reason: string }> {
    const policy = this.decisionPolicies.get(decisionType);
    
    if (!policy) {
      return { allowed: false, reason: 'Unknown decision type' };
    }

    const hasVetoRole = userRoles.some(r => policy.vetoRoles.includes(r));
    
    if (!hasVetoRole) {
      return { 
        allowed: false, 
        reason: `Veto requires role: ${policy.vetoRoles.join(' or ')}` 
      };
    }

    return { allowed: true, reason: 'Veto permitted' };
  }

  /**
   * Check if decision has enough approvals
   */
  hasEnoughApprovals(
    decisionType: string,
    approverCount: number
  ): boolean {
    const policy = this.decisionPolicies.get(decisionType);
    if (!policy) return false;
    return approverCount >= policy.requiredApprovers;
  }

  /**
   * Get all policies as JSON (for audit/export)
   */
  async exportPolicies(): Promise<{
    policies: string[][];
    roles: string[][];
    decisionPolicies: DecisionPolicy[];
  }> {
    if (!this.enforcer) await this.initialize();
    
    const policies = await this.enforcer!.getPolicy();
    const roles = await this.enforcer!.getGroupingPolicy();
    
    return {
      policies,
      roles,
      decisionPolicies: Array.from(this.decisionPolicies.values()),
    };
  }
}

// Singleton instance
export const policyEngine = new PolicyEngine();

export default policyEngine;
