// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Enforcer - Active Compliance Engine
 * Real-time violation detection with framework citations
 * 
 * "Blocked per Ring 3 (Privacy), Framework HIPAA, Control §164.312"
 */

import { ComplianceDomain, PillarId, ALL_FRAMEWORKS, ComplianceFramework } from './frameworks';

// ============================================================================
// TYPES
// ============================================================================

export interface ComplianceViolation {
  id: string;
  timestamp: Date;
  ring: number;
  domain: ComplianceDomain;
  framework: string;
  frameworkCode: string;
  control: string;
  controlTitle: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  action: string;
  reason: string;
  citation: string;
  recommendation: string;
  blocked: boolean;
}

export interface ComplianceCheck {
  allowed: boolean;
  violations: ComplianceViolation[];
  citations: string[];
  recommendation: string;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
}

export interface ActionContext {
  action: string;
  description: string;
  pillar?: PillarId;
  dataTypes?: string[];
  targetSystem?: string;
  userId?: string;
  agentId?: string;
  metadata?: Record<string, any>;
}

// ============================================================================
// COMPLIANCE RULES DATABASE
// ============================================================================

interface ComplianceRule {
  id: string;
  ring: number;
  domain: ComplianceDomain;
  framework: string;
  frameworkCode: string;
  control: string;
  controlTitle: string;
  keywords: string[];
  dataTypes: string[];
  blockedActions: string[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  citation: string;
  reason: string;
  recommendation: string;
}

const COMPLIANCE_RULES: ComplianceRule[] = [
  // ========================================
  // RING 3: PRIVACY & DATA PROTECTION
  // ========================================
  
  // HIPAA Rules
  {
    id: 'hipaa-phi-public',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(a)(1)',
    controlTitle: 'Access Control',
    keywords: ['patient', 'health', 'medical', 'phi', 'hipaa', 'healthcare', 'diagnosis', 'treatment'],
    dataTypes: ['phi', 'health_records', 'patient_data', 'medical_records'],
    blockedActions: ['upload_public', 'share_public', 'expose', 'publish', 'public_bucket', 'public_storage'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(1)',
    reason: 'Protected Health Information (PHI) cannot be stored in publicly accessible locations',
    recommendation: 'Use HIPAA-compliant encrypted storage with access controls and audit logging',
  },
  {
    id: 'hipaa-phi-encryption',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(a)(2)(iv)',
    controlTitle: 'Encryption and Decryption',
    keywords: ['patient', 'health', 'medical', 'phi', 'unencrypted', 'plaintext'],
    dataTypes: ['phi', 'health_records', 'patient_data'],
    blockedActions: ['transmit_unencrypted', 'store_unencrypted', 'email_plaintext'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(a)(2)(iv)',
    reason: 'PHI must be encrypted at rest and in transit',
    recommendation: 'Enable TLS 1.3 for transmission and AES-256 for storage encryption',
  },
  {
    id: 'hipaa-audit',
    ring: 3,
    domain: 'privacy',
    framework: 'HIPAA',
    frameworkCode: 'HIPAA',
    control: '§164.312(b)',
    controlTitle: 'Audit Controls',
    keywords: ['patient', 'health', 'medical', 'phi', 'access', 'view', 'modify'],
    dataTypes: ['phi', 'health_records', 'patient_data'],
    blockedActions: ['access_without_logging', 'disable_audit'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework HIPAA, Control §164.312(b)',
    reason: 'All PHI access must be logged and auditable',
    recommendation: 'Enable comprehensive audit logging for all PHI access events',
  },

  // GDPR Rules
  {
    id: 'gdpr-consent',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 7',
    controlTitle: 'Conditions for Consent',
    keywords: ['personal', 'pii', 'user', 'customer', 'consent', 'gdpr', 'eu', 'european'],
    dataTypes: ['pii', 'personal_data', 'user_data', 'customer_data'],
    blockedActions: ['process_without_consent', 'collect_without_consent', 'share_without_consent'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework GDPR, Article 7',
    reason: 'Personal data processing requires valid consent or legitimate basis',
    recommendation: 'Obtain explicit consent or document legitimate interest before processing',
  },
  {
    id: 'gdpr-transfer',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 44-49',
    controlTitle: 'Cross-Border Transfer',
    keywords: ['transfer', 'export', 'offshore', 'third-country', 'non-eu', 'international'],
    dataTypes: ['pii', 'personal_data', 'eu_data'],
    blockedActions: ['transfer_non_adequate', 'export_without_safeguards', 'offshore_processing'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework GDPR, Articles 44-49',
    reason: 'Cross-border transfers require adequacy decision or appropriate safeguards',
    recommendation: 'Use Standard Contractual Clauses (SCCs) or verify adequacy decision exists',
  },
  {
    id: 'gdpr-erasure',
    ring: 3,
    domain: 'privacy',
    framework: 'GDPR',
    frameworkCode: 'GDPR',
    control: 'Article 17',
    controlTitle: 'Right to Erasure',
    keywords: ['delete', 'erase', 'forget', 'removal', 'right to be forgotten'],
    dataTypes: ['pii', 'personal_data'],
    blockedActions: ['ignore_deletion_request', 'permanent_retention', 'block_erasure'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework GDPR, Article 17',
    reason: 'Data subjects have the right to request erasure of their personal data',
    recommendation: 'Implement data deletion workflows that honor erasure requests within 30 days',
  },

  // PCI-DSS Rules
  {
    id: 'pci-card-storage',
    ring: 3,
    domain: 'privacy',
    framework: 'PCI-DSS',
    frameworkCode: 'PCI-DSS',
    control: 'Requirement 3.2',
    controlTitle: 'Cardholder Data Protection',
    keywords: ['credit card', 'payment', 'cardholder', 'pan', 'cvv', 'card number'],
    dataTypes: ['payment_card', 'pan', 'cardholder_data', 'cvv'],
    blockedActions: ['store_cvv', 'log_full_pan', 'store_unencrypted_pan', 'public_storage'],
    severity: 'critical',
    citation: 'Ring 3 (Privacy), Framework PCI-DSS, Requirement 3.2',
    reason: 'Sensitive authentication data (CVV, full track data) must never be stored',
    recommendation: 'Use tokenization and never store CVV; mask PAN in logs (show only last 4 digits)',
  },

  // CCPA Rules
  {
    id: 'ccpa-opt-out',
    ring: 3,
    domain: 'privacy',
    framework: 'CCPA',
    frameworkCode: 'CCPA',
    control: '§1798.120',
    controlTitle: 'Right to Opt-Out',
    keywords: ['california', 'ccpa', 'sell', 'share', 'consumer', 'opt-out'],
    dataTypes: ['california_consumer_data', 'pii'],
    blockedActions: ['sell_data_after_optout', 'ignore_opt_out', 'share_after_optout'],
    severity: 'high',
    citation: 'Ring 3 (Privacy), Framework CCPA, §1798.120',
    reason: 'California consumers have the right to opt-out of data sales',
    recommendation: 'Honor opt-out requests immediately and maintain opt-out registry',
  },

  // ========================================
  // RING 2: CYBERSECURITY & RISK
  // ========================================

  // NIST 800-53 Rules
  {
    id: 'nist-access-control',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'AC-3',
    controlTitle: 'Access Enforcement',
    keywords: ['access', 'permission', 'authorization', 'privilege', 'admin'],
    dataTypes: ['sensitive_data', 'classified'],
    blockedActions: ['bypass_access_control', 'grant_excessive_permissions', 'disable_rbac'],
    severity: 'critical',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AC-3',
    reason: 'Access must be enforced according to policy',
    recommendation: 'Implement role-based access control (RBAC) with least privilege principle',
  },
  {
    id: 'nist-audit-events',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'AU-2',
    controlTitle: 'Audit Events',
    keywords: ['audit', 'log', 'event', 'security', 'monitoring'],
    dataTypes: ['system_events', 'security_events'],
    blockedActions: ['disable_logging', 'delete_audit_logs', 'bypass_monitoring'],
    severity: 'high',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control AU-2',
    reason: 'Security-relevant events must be logged and retained',
    recommendation: 'Maintain audit logs for minimum 1 year with tamper-proof storage',
  },
  {
    id: 'nist-encryption',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'NIST 800-53',
    frameworkCode: 'NIST-800-53',
    control: 'SC-13',
    controlTitle: 'Cryptographic Protection',
    keywords: ['encrypt', 'crypto', 'key', 'certificate', 'tls', 'ssl'],
    dataTypes: ['sensitive_data', 'credentials'],
    blockedActions: ['use_weak_crypto', 'disable_encryption', 'store_plaintext_secrets'],
    severity: 'critical',
    citation: 'Ring 2 (Cybersecurity), Framework NIST 800-53, Control SC-13',
    reason: 'FIPS-validated cryptography must be used for sensitive data',
    recommendation: 'Use AES-256, TLS 1.3, and FIPS 140-2 validated modules',
  },

  // Zero Trust Rules
  {
    id: 'zt-implicit-trust',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'Zero Trust',
    frameworkCode: 'NIST-800-207',
    control: 'Tenet 1',
    controlTitle: 'Never Trust, Always Verify',
    keywords: ['trust', 'internal', 'network', 'perimeter', 'vpn'],
    dataTypes: ['any'],
    blockedActions: ['trust_based_on_network', 'skip_auth_internal', 'implicit_trust'],
    severity: 'high',
    citation: 'Ring 2 (Cybersecurity), Framework Zero Trust (NIST 800-207), Tenet 1',
    reason: 'Never trust implicitly; always verify identity and authorization',
    recommendation: 'Implement continuous verification regardless of network location',
  },

  // SOC 2 Rules
  {
    id: 'soc2-availability',
    ring: 2,
    domain: 'cybersecurity',
    framework: 'SOC 2',
    frameworkCode: 'SOC-2',
    control: 'A1.1',
    controlTitle: 'System Availability',
    keywords: ['availability', 'uptime', 'sla', 'downtime', 'outage'],
    dataTypes: ['production_systems'],
    blockedActions: ['disable_redundancy', 'remove_backup', 'skip_failover_test'],
    severity: 'medium',
    citation: 'Ring 2 (Cybersecurity), Framework SOC 2, Control A1.1',
    reason: 'Systems must maintain committed availability levels',
    recommendation: 'Maintain redundancy and regularly test failover procedures',
  },

  // ========================================
  // RING 1: ETHICAL AI
  // ========================================

  // NIST AI RMF Rules
  {
    id: 'nist-ai-bias',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'NIST AI RMF',
    frameworkCode: 'NIST-AI-RMF',
    control: 'MEASURE 2.6',
    controlTitle: 'Bias Testing',
    keywords: ['bias', 'fairness', 'discrimination', 'demographic', 'protected class'],
    dataTypes: ['model_outputs', 'predictions'],
    blockedActions: ['deploy_untested_model', 'skip_bias_testing', 'ignore_bias_metrics'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control MEASURE 2.6',
    reason: 'AI models must be tested for bias before deployment',
    recommendation: 'Run fairness metrics (demographic parity, equalized odds) before deployment',
  },
  {
    id: 'nist-ai-transparency',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'NIST AI RMF',
    frameworkCode: 'NIST-AI-RMF',
    control: 'GOVERN 4.1',
    controlTitle: 'Transparency',
    keywords: ['explainability', 'transparency', 'black box', 'interpretability'],
    dataTypes: ['model_decisions', 'predictions'],
    blockedActions: ['deploy_unexplainable', 'hide_decision_logic', 'no_explanation'],
    severity: 'medium',
    citation: 'Ring 1 (Ethical AI), Framework NIST AI RMF, Control GOVERN 4.1',
    reason: 'AI decisions affecting individuals must be explainable',
    recommendation: 'Implement SHAP/LIME explanations or use inherently interpretable models',
  },

  // EU AI Act Rules
  {
    id: 'eu-ai-prohibited',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'EU AI Act',
    frameworkCode: 'EU-AI-ACT',
    control: 'Article 5',
    controlTitle: 'Prohibited AI Practices',
    keywords: ['manipulation', 'social scoring', 'biometric', 'subliminal', 'exploitation'],
    dataTypes: ['user_behavior', 'biometric_data'],
    blockedActions: ['subliminal_manipulation', 'social_scoring', 'exploit_vulnerability', 'mass_surveillance'],
    severity: 'critical',
    citation: 'Ring 1 (Ethical AI), Framework EU AI Act, Article 5',
    reason: 'This AI practice is prohibited under EU AI Act',
    recommendation: 'Discontinue prohibited practice immediately; consult legal counsel',
  },
  {
    id: 'eu-ai-high-risk',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'EU AI Act',
    frameworkCode: 'EU-AI-ACT',
    control: 'Article 9',
    controlTitle: 'Risk Management for High-Risk AI',
    keywords: ['high-risk', 'employment', 'credit', 'law enforcement', 'education', 'healthcare'],
    dataTypes: ['high_risk_decisions'],
    blockedActions: ['deploy_without_risk_assessment', 'skip_conformity_assessment'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework EU AI Act, Article 9',
    reason: 'High-risk AI systems require risk management and conformity assessment',
    recommendation: 'Complete risk assessment and register in EU database before deployment',
  },

  // OECD AI Principles
  {
    id: 'oecd-human-oversight',
    ring: 1,
    domain: 'ethical_ai',
    framework: 'OECD AI Principles',
    frameworkCode: 'OECD-AI',
    control: 'Principle 1.4',
    controlTitle: 'Human Oversight',
    keywords: ['autonomous', 'human-in-loop', 'override', 'intervention', 'control'],
    dataTypes: ['autonomous_decisions'],
    blockedActions: ['remove_human_oversight', 'fully_autonomous_critical', 'disable_override'],
    severity: 'high',
    citation: 'Ring 1 (Ethical AI), Framework OECD AI Principles, Principle 1.4',
    reason: 'AI systems should enable human oversight and intervention',
    recommendation: 'Implement human-in-the-loop for critical decisions; enable override capability',
  },

  // ========================================
  // RING 4: GOVERNANCE & AUDIT
  // ========================================

  // SOX Rules
  {
    id: 'sox-financial-controls',
    ring: 4,
    domain: 'governance',
    framework: 'SOX',
    frameworkCode: 'SOX',
    control: 'Section 404',
    controlTitle: 'Internal Controls',
    keywords: ['financial', 'accounting', 'revenue', 'reporting', 'audit'],
    dataTypes: ['financial_data', 'accounting_records'],
    blockedActions: ['bypass_approval', 'modify_without_audit', 'delete_financial_records'],
    severity: 'critical',
    citation: 'Ring 4 (Governance), Framework SOX, Section 404',
    reason: 'Financial data modifications require proper controls and audit trail',
    recommendation: 'Implement separation of duties and dual approval for financial changes',
  },

  // COBIT Rules
  {
    id: 'cobit-change-management',
    ring: 4,
    domain: 'governance',
    framework: 'COBIT',
    frameworkCode: 'COBIT',
    control: 'BAI06',
    controlTitle: 'Managed IT Changes',
    keywords: ['change', 'deployment', 'release', 'production', 'update'],
    dataTypes: ['production_systems'],
    blockedActions: ['deploy_without_approval', 'skip_change_review', 'emergency_change_abuse'],
    severity: 'medium',
    citation: 'Ring 4 (Governance), Framework COBIT, Control BAI06',
    reason: 'Changes to production require formal change management process',
    recommendation: 'Submit change request through CAB; document rollback plan',
  },

  // ========================================
  // RING 5: INDUSTRY REGULATION
  // ========================================

  // Basel III/IV Rules
  {
    id: 'basel-model-risk',
    ring: 5,
    domain: 'industry',
    framework: 'Basel III/IV',
    frameworkCode: 'BASEL-III',
    control: 'BCBS 239',
    controlTitle: 'Risk Data Aggregation',
    keywords: ['risk', 'capital', 'liquidity', 'model', 'stress test', 'banking'],
    dataTypes: ['risk_data', 'capital_calculations'],
    blockedActions: ['use_unvalidated_model', 'skip_backtesting', 'modify_risk_calculations'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework Basel III/IV, BCBS 239',
    reason: 'Risk models require validation and ongoing monitoring',
    recommendation: 'Complete model validation and obtain Model Risk Management approval',
  },

  // FedRAMP Rules
  {
    id: 'fedramp-data-location',
    ring: 5,
    domain: 'industry',
    framework: 'FedRAMP',
    frameworkCode: 'FEDRAMP',
    control: 'AC-7',
    controlTitle: 'Data Residency',
    keywords: ['federal', 'government', 'fedramp', 'fisma', 'data location', 'sovereignty'],
    dataTypes: ['federal_data', 'government_data'],
    blockedActions: ['store_outside_boundary', 'process_non_authorized', 'transfer_unauthorized'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework FedRAMP, Control AC-7',
    reason: 'Federal data must remain within authorized FedRAMP boundary',
    recommendation: 'Use only FedRAMP-authorized services and document all data flows',
  },

  // CJIS Rules
  {
    id: 'cjis-criminal-data',
    ring: 5,
    domain: 'industry',
    framework: 'CJIS',
    frameworkCode: 'CJIS',
    control: '5.4',
    controlTitle: 'Access Control',
    keywords: ['criminal', 'justice', 'law enforcement', 'cjis', 'ncic', 'fingerprint'],
    dataTypes: ['criminal_justice_data', 'law_enforcement_data'],
    blockedActions: ['access_without_clearance', 'share_unauthorized', 'store_non_compliant'],
    severity: 'critical',
    citation: 'Ring 5 (Industry), Framework CJIS, Policy 5.4',
    reason: 'Criminal justice information requires CJIS-compliant handling',
    recommendation: 'Verify personnel clearance and use CJIS-compliant infrastructure',
  },
];

// ============================================================================
// COMPLIANCE ENFORCER SERVICE
// ============================================================================

export class ComplianceEnforcer {
  private rules: ComplianceRule[] = COMPLIANCE_RULES;

  /**
   * Check an action against all compliance rules
   * Returns detailed violations with citations
   */
  checkAction(context: ActionContext): ComplianceCheck {
    const violations: ComplianceViolation[] = [];
    const actionLower = context.action.toLowerCase();
    const descLower = context.description.toLowerCase();
    const dataTypes = context.dataTypes || [];

    for (const rule of this.rules) {
      // Check if action matches blocked actions
      const actionMatch = rule.blockedActions.some(blocked => 
        actionLower.includes(blocked.replace(/_/g, ' ')) ||
        actionLower.includes(blocked.replace(/_/g, ''))
      );

      // Check keywords in description
      const keywordMatch = rule.keywords.some(kw => descLower.includes(kw));

      // Check data types
      const dataTypeMatch = rule.dataTypes.some(dt => 
        dataTypes.includes(dt) || dt === 'any'
      );

      // If we have both an action match and either keyword or data type match
      if (actionMatch && (keywordMatch || dataTypeMatch)) {
        violations.push({
          id: `violation-${rule.id}-${Date.now()}`,
          timestamp: new Date(),
          ring: rule.ring,
          domain: rule.domain,
          framework: rule.framework,
          frameworkCode: rule.frameworkCode,
          control: rule.control,
          controlTitle: rule.controlTitle,
          severity: rule.severity,
          action: context.action,
          reason: rule.reason,
          citation: rule.citation,
          recommendation: rule.recommendation,
          blocked: rule.severity === 'critical' || rule.severity === 'high',
        });
      }
    }

    // Sort by severity
    const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    violations.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    const blocked = violations.some(v => v.blocked);
    const citations = violations.map(v => v.citation);
    const riskLevel = this.calculateRiskLevel(violations);
    
    let recommendation = 'Action approved';
    if (violations.length > 0) {
      recommendation = violations[0].recommendation;
    }

    return {
      allowed: !blocked,
      violations,
      citations,
      recommendation,
      riskLevel,
    };
  }

  /**
   * Quick check for Council agents - returns formatted response
   */
  enforceForCouncil(
    agentId: string,
    action: string,
    description: string,
    dataTypes: string[] = []
  ): { allowed: boolean; response: string; violations: ComplianceViolation[] } {
    const check = this.checkAction({ action, description, dataTypes, agentId });

    if (check.allowed && check.violations.length === 0) {
      return {
        allowed: true,
        response: `✅ Action permitted. No compliance violations detected.`,
        violations: [],
      };
    }

    if (!check.allowed) {
      const topViolation = check.violations[0];
      const response = `🚫 **BLOCKED** per ${topViolation.citation}

**Reason:** ${topViolation.reason}

**Recommendation:** ${topViolation.recommendation}

${check.violations.length > 1 ? `\n⚠️ ${check.violations.length - 1} additional violation(s) detected.` : ''}`;

      return {
        allowed: false,
        response,
        violations: check.violations,
      };
    }

    // Allowed but with warnings
    const warnings = check.violations.map(v => `- ⚠️ ${v.citation}: ${v.reason}`).join('\n');
    return {
      allowed: true,
      response: `⚠️ Action permitted with warnings:\n${warnings}\n\n**Recommendation:** ${check.recommendation}`,
      violations: check.violations,
    };
  }

  /**
   * Get formatted citation for a specific violation
   */
  formatCitation(violation: ComplianceViolation): string {
    return `Blocked per Ring ${violation.ring} (${this.getDomainName(violation.domain)}), Framework ${violation.framework}, Control ${violation.control}`;
  }

  /**
   * Get all rules for a specific domain
   */
  getRulesByDomain(domain: ComplianceDomain): ComplianceRule[] {
    return this.rules.filter(r => r.domain === domain);
  }

  /**
   * Get all rules for a specific framework
   */
  getRulesByFramework(frameworkCode: string): ComplianceRule[] {
    return this.rules.filter(r => r.frameworkCode === frameworkCode);
  }

  private calculateRiskLevel(violations: ComplianceViolation[]): ComplianceCheck['riskLevel'] {
    if (violations.length === 0) return 'none';
    if (violations.some(v => v.severity === 'critical')) return 'critical';
    if (violations.some(v => v.severity === 'high')) return 'high';
    if (violations.some(v => v.severity === 'medium')) return 'medium';
    return 'low';
  }

  private getDomainName(domain: ComplianceDomain): string {
    const names: Record<ComplianceDomain, string> = {
      ethical_ai: 'Ethical AI',
      cybersecurity: 'Cybersecurity',
      privacy: 'Privacy',
      governance: 'Governance',
      industry: 'Industry',
    };
    return names[domain];
  }
}

export const complianceEnforcer = new ComplianceEnforcer();
