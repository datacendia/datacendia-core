// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Guard - Council Integration
 * Active compliance enforcement for AI Council deliberations
 * 
 * "Blocked per Ring 3 (Privacy), Framework HIPAA, Control §164.312"
 */

import { complianceEnforcer, ComplianceViolation } from '../compliance/index.js';

import { logger } from '../../utils/logger.js';
// ============================================================================
// TYPES
// ============================================================================

export interface CouncilProposal {
  id: string;
  agentId: string;
  action: string;
  description: string;
  dataTypes?: string[];
  targetSystems?: string[];
  affectedData?: string[];
  rationale?: string;
}

export interface ComplianceVerdict {
  proposalId: string;
  agentId: string;
  timestamp: Date;
  allowed: boolean;
  riskLevel: 'none' | 'low' | 'medium' | 'high' | 'critical';
  verdict: string;
  citations: string[];
  violations: ComplianceViolation[];
  recommendation: string;
  requiresHumanReview: boolean;
}

// ============================================================================
// DATA TYPE DETECTION
// ============================================================================

const DATA_TYPE_KEYWORDS: Record<string, string[]> = {
  phi: ['patient', 'health', 'medical', 'diagnosis', 'treatment', 'prescription', 'hospital', 'doctor', 'clinic', 'healthcare'],
  health_records: ['patient record', 'medical record', 'health record', 'ehr', 'emr'],
  pii: ['personal', 'name', 'address', 'ssn', 'social security', 'email', 'phone', 'dob', 'date of birth'],
  payment_card: ['credit card', 'debit card', 'card number', 'pan', 'cvv', 'payment'],
  financial_data: ['financial', 'account', 'balance', 'transaction', 'revenue', 'profit', 'invoice'],
  criminal_justice_data: ['criminal', 'arrest', 'conviction', 'fingerprint', 'law enforcement', 'police'],
  federal_data: ['federal', 'government', 'classified', 'secret', 'confidential'],
  eu_data: ['eu', 'european', 'gdpr', 'european union'],
  california_consumer_data: ['california', 'ccpa', 'california consumer'],
};

function detectDataTypes(text: string): string[] {
  const textLower = text.toLowerCase();
  const detected: string[] = [];

  for (const [dataType, keywords] of Object.entries(DATA_TYPE_KEYWORDS)) {
    if (keywords.some(kw => textLower.includes(kw))) {
      detected.push(dataType);
    }
  }

  return detected;
}

// ============================================================================
// COMPLIANCE GUARD
// ============================================================================

export class ComplianceGuard {
  private verdictHistory: ComplianceVerdict[] = [];

  /**
   * Evaluate a Council proposal for compliance
   * Called before any agent action is executed
   */
  evaluateProposal(proposal: CouncilProposal): ComplianceVerdict {
    // Auto-detect data types from description
    const detectedDataTypes = detectDataTypes(proposal.description);
    const allDataTypes = [...new Set([...(proposal.dataTypes || []), ...detectedDataTypes])];

    // Run compliance check
    const result = complianceEnforcer.enforceForCouncil(
      proposal.agentId,
      proposal.action,
      proposal.description,
      allDataTypes
    );

    const verdict: ComplianceVerdict = {
      proposalId: proposal.id,
      agentId: proposal.agentId,
      timestamp: new Date(),
      allowed: result.allowed,
      riskLevel: this.getRiskLevel(result.violations),
      verdict: result.response,
      citations: result.violations.map(v => v.citation),
      violations: result.violations,
      recommendation: result.violations.length > 0 ? result.violations[0].recommendation : 'Action approved',
      requiresHumanReview: this.requiresHumanReview(result.violations),
    };

    this.verdictHistory.push(verdict);
    return verdict;
  }

  /**
   * Format verdict for CendiaCISO agent response
   */
  formatCISOResponse(verdict: ComplianceVerdict): string {
    if (verdict.allowed && verdict.violations.length === 0) {
      return `✅ **APPROVED** - Action complies with all 5 Rings of Sovereignty.

No compliance violations detected. Proceed with standard security protocols.`;
    }

    if (!verdict.allowed) {
      const primary = verdict.violations[0];
      let response = `🚫 **BLOCKED** per ${primary.citation}

**Violation:** ${primary.reason}

**Framework:** ${primary.framework}
**Control:** ${primary.control} - ${primary.controlTitle}
**Severity:** ${primary.severity.toUpperCase()}

**Recommendation:** ${primary.recommendation}`;

      if (verdict.violations.length > 1) {
        response += `\n\n⚠️ **Additional Violations (${verdict.violations.length - 1}):**`;
        for (let i = 1; i < Math.min(verdict.violations.length, 4); i++) {
          const v = verdict.violations[i];
          response += `\n- ${v.citation}`;
        }
      }

      if (verdict.requiresHumanReview) {
        response += `\n\n🔒 **Human Review Required** - This action has been escalated to the Compliance Officer.`;
      }

      return response;
    }

    // Allowed with warnings
    let response = `⚠️ **APPROVED WITH WARNINGS**

The action is permitted but requires attention to the following compliance considerations:\n`;

    for (const v of verdict.violations) {
      response += `\n- **${v.framework} ${v.control}:** ${v.reason}`;
    }

    response += `\n\n**Recommendation:** ${verdict.recommendation}`;

    return response;
  }

  /**
   * Get structured data for logging/audit
   */
  getAuditRecord(verdict: ComplianceVerdict) {
    return {
      timestamp: verdict.timestamp.toISOString(),
      proposalId: verdict.proposalId,
      agentId: verdict.agentId,
      action: verdict.allowed ? 'ALLOWED' : 'BLOCKED',
      riskLevel: verdict.riskLevel,
      violationCount: verdict.violations.length,
      citations: verdict.citations,
      frameworks: [...new Set(verdict.violations.map(v => v.framework))],
      requiresReview: verdict.requiresHumanReview,
    };
  }

  /**
   * Get verdict history for analysis
   */
  getVerdictHistory(limit = 100): ComplianceVerdict[] {
    return this.verdictHistory.slice(-limit);
  }

  /**
   * Get statistics on compliance enforcement
   */
  getStatistics() {
    const total = this.verdictHistory.length;
    const blocked = this.verdictHistory.filter(v => !v.allowed).length;
    const warnings = this.verdictHistory.filter(v => v.allowed && v.violations.length > 0).length;
    const clean = this.verdictHistory.filter(v => v.allowed && v.violations.length === 0).length;

    const byFramework: Record<string, number> = {};
    const byDomain: Record<string, number> = {};

    for (const verdict of this.verdictHistory) {
      for (const violation of verdict.violations) {
        byFramework[violation.framework] = (byFramework[violation.framework] || 0) + 1;
        byDomain[violation.domain] = (byDomain[violation.domain] || 0) + 1;
      }
    }

    return {
      total,
      blocked,
      warnings,
      clean,
      blockRate: total > 0 ? Math.round((blocked / total) * 100) : 0,
      byFramework,
      byDomain,
    };
  }

  private getRiskLevel(violations: ComplianceViolation[]): ComplianceVerdict['riskLevel'] {
    if (violations.length === 0) return 'none';
    if (violations.some(v => v.severity === 'critical')) return 'critical';
    if (violations.some(v => v.severity === 'high')) return 'high';
    if (violations.some(v => v.severity === 'medium')) return 'medium';
    return 'low';
  }

  private requiresHumanReview(violations: ComplianceViolation[]): boolean {
    return violations.some(v => v.severity === 'critical');
  }
}

export const complianceGuard = new ComplianceGuard();

// ============================================================================
// COUNCIL MIDDLEWARE
// ============================================================================

/**
 * Middleware for Council deliberations
 * Intercepts proposals and checks compliance before execution
 */
export function councilComplianceMiddleware(proposal: CouncilProposal): {
  proceed: boolean;
  verdict: ComplianceVerdict;
  cisoResponse: string;
} {
  const verdict = complianceGuard.evaluateProposal(proposal);
  const cisoResponse = complianceGuard.formatCISOResponse(verdict);

  return {
    proceed: verdict.allowed,
    verdict,
    cisoResponse,
  };
}

// ============================================================================
// EXAMPLE SCENARIOS
// ============================================================================

/**
 * Example: Patient data to public bucket
 * This demonstrates the active enforcement
 */
export function exampleScenario_PatientDataPublicBucket() {
  const proposal: CouncilProposal = {
    id: 'proposal-001',
    agentId: 'user-request',
    action: 'upload to public bucket',
    description: 'Upload patient data to a public S3 bucket for sharing with external partners',
    dataTypes: ['phi', 'patient_data'],
  };

  const result = councilComplianceMiddleware(proposal);

  logger.info('='.repeat(60));
  logger.info('SCENARIO: Upload patient data to public bucket');
  logger.info('='.repeat(60));
  logger.info('\nCendiaCISO Response:');
  logger.info(result.cisoResponse);
  logger.info('\nVerdict:', result.proceed ? 'ALLOWED' : 'BLOCKED');
  logger.info('Citations:', result.verdict.citations.join(', '));

  return result;
}

/**
 * Example: Deploy untested AI model
 */
export function exampleScenario_UntestedAIModel() {
  const proposal: CouncilProposal = {
    id: 'proposal-002',
    agentId: 'data-science-team',
    action: 'deploy untested model',
    description: 'Deploy the credit scoring model to production without bias testing',
    dataTypes: ['model_outputs', 'high_risk_decisions'],
  };

  const result = councilComplianceMiddleware(proposal);

  logger.info('='.repeat(60));
  logger.info('SCENARIO: Deploy untested AI model');
  logger.info('='.repeat(60));
  logger.info('\nCendiaCISO Response:');
  logger.info(result.cisoResponse);

  return result;
}

/**
 * Example: Disable audit logging
 */
export function exampleScenario_DisableAuditLogs() {
  const proposal: CouncilProposal = {
    id: 'proposal-003',
    agentId: 'ops-team',
    action: 'disable logging',
    description: 'Turn off audit logging to improve system performance',
    dataTypes: ['security_events'],
  };

  const result = councilComplianceMiddleware(proposal);

  logger.info('='.repeat(60));
  logger.info('SCENARIO: Disable audit logging');
  logger.info('='.repeat(60));
  logger.info('\nCendiaCISO Response:');
  logger.info(result.cisoResponse);

  return result;
}
