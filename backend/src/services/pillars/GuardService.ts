// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - THE GUARD SERVICE
// Security Posture - Security controls and compliance monitoring
// Enterprise Platinum Intelligence - PostgreSQL Persistent Storage
// =============================================================================

import { PrismaClient, Prisma } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type ComplianceStatus = 'compliant' | 'in_progress' | 'non_compliant' | 'not_applicable';
export type ThreatSeverity = 'critical' | 'high' | 'medium' | 'low';
export type ThreatStatus = 'active' | 'investigating' | 'mitigated' | 'resolved';

export interface SecurityPosture {
  organizationId: string;
  securityScore: number;
  openVulnerabilities: number;
  complianceScore: number;
  daysSinceIncident: number;
  frameworks: ComplianceFramework[];
  threats: ThreatEvent[];
  lastAssessment: Date;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  status: ComplianceStatus;
  totalControls: number;
  implementedControls: number;
  lastAudit?: Date;
  nextAudit?: Date;
}

export interface ThreatEvent {
  id: string;
  organizationId: string;
  type: string;
  severity: ThreatSeverity;
  status: ThreatStatus;
  source: string;
  description: string;
  detectedAt: Date;
  resolvedAt?: Date;
  affectedAssets?: string[];
  mitigationSteps?: string[];
}

export interface SecurityPolicy {
  id: string;
  organizationId: string;
  name: string;
  category: string;
  enabled: boolean;
  lastUpdated: Date;
  violations: number;
}

export interface AuditLogEntry {
  id: string;
  organizationId: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure' | 'denied';
  ipAddress: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

// Type mappings
const threatTypeMap: Record<string, string> = {
  'Anomalous Login': 'INSIDER_THREAT', 'Unusual Data Access': 'DATA_EXFILTRATION',
  'Intrusion': 'INTRUSION', 'Malware': 'MALWARE', 'Policy Violation': 'POLICY_VIOLATION'
};
const severityMap: Record<ThreatSeverity, string> = { critical: 'CRITICAL', high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };
const reverseSeverityMap: Record<string, ThreatSeverity> = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low', INFO: 'low' };
const statusMap: Record<ThreatStatus, string> = { active: 'ACTIVE', investigating: 'INVESTIGATING', mitigated: 'MITIGATED', resolved: 'RESOLVED' };
const reverseStatusMap: Record<string, ThreatStatus> = { ACTIVE: 'active', INVESTIGATING: 'investigating', CONTAINED: 'mitigated', MITIGATED: 'mitigated', RESOLVED: 'resolved', FALSE_POSITIVE: 'resolved' };

// =============================================================================
// THE GUARD SERVICE - PRISMA BACKED
// =============================================================================

export class GuardService extends BaseService {
  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'guard-service',
      version: '2.0.0',
      dependencies: ['prisma'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Guard service initializing with PostgreSQL...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Guard service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const activeThreats = await prisma.security_threats.count({ where: { status: 'ACTIVE' } });
    const activePolicies = await prisma.security_policies.count({ where: { enabled: true } });
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { activeThreats, activePolicies },
    };
  }

  // ===========================================================================
  // SECURITY POSTURE - PRISMA BACKED
  // ===========================================================================

  async getSecurityPosture(organizationId: string): Promise<SecurityPosture> {
    const threats = await this.getThreats(organizationId, false);
    const policies = await this.getPolicies(organizationId);
    
    // Calculate scores from real data
    const enabledPolicies = policies.filter(p => p.enabled).length;
    const complianceScore = policies.length > 0 ? Math.round((enabledPolicies / policies.length) * 100) : 0;
    const securityScore = Math.max(0, 100 - (threats.length * 10));

    // Get last resolved threat for days since incident
    const lastIncident = await prisma.security_threats.findFirst({
      where: { organization_id: organizationId, status: 'RESOLVED' },
      orderBy: { resolved_at: 'desc' },
    });
    const daysSinceIncident = lastIncident?.resolved_at
      ? Math.floor((Date.now() - lastIncident.resolved_at.getTime()) / (24 * 60 * 60 * 1000))
      : 365;

    return {
      organizationId,
      securityScore,
      openVulnerabilities: threats.filter(t => t.severity === 'critical' || t.severity === 'high').length,
      complianceScore,
      daysSinceIncident,
      frameworks: [], // Loaded from ComplianceMapper when configured
      threats,
      lastAssessment: new Date(),
    };
  }

  // ===========================================================================
  // THREAT MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async reportThreat(threat: Omit<ThreatEvent, 'id' | 'detectedAt'>): Promise<ThreatEvent> {
    const created = await prisma.security_threats.create({
      data: {
        organization_id: threat.organizationId,
        threat_type: (threatTypeMap[threat.type] || 'POLICY_VIOLATION') as any,
        severity: severityMap[threat.severity] as any,
        status: statusMap[threat.status] as any,
        title: threat.type,
        description: threat.description,
        source: threat.source,
        indicators: threat.affectedAssets || [],
        mitigations: threat.mitigationSteps || [],
      },
    });

    return this.mapThreat(created);
  }

  async getThreats(organizationId: string, includeResolved: boolean = false): Promise<ThreatEvent[]> {
    const where: any = { organization_id: organizationId };
    if (!includeResolved) {
      where.status = { notIn: ['RESOLVED', 'FALSE_POSITIVE'] };
    }

    const threats = await prisma.security_threats.findMany({
      where,
      orderBy: { detected_at: 'desc' },
    });

    return threats.map((t: any) => this.mapThreat(t));
  }

  async updateThreatStatus(threatId: string, status: ThreatStatus): Promise<ThreatEvent | null> {
    const data: any = { status: statusMap[status] as any };
    if (status === 'resolved') data.resolved_at = new Date();

    const updated = await prisma.security_threats.update({
      where: { id: threatId },
      data,
    });

    return this.mapThreat(updated);
  }

  // ===========================================================================
  // POLICIES - PRISMA BACKED
  // ===========================================================================

  async createPolicy(policy: Omit<SecurityPolicy, 'id' | 'lastUpdated' | 'violations'>): Promise<SecurityPolicy> {
    const created = await prisma.security_policies.create({
      data: {
        organization_id: policy.organizationId,
        name: policy.name,
        policy_type: 'OPERATIONAL' as any,
        description: policy.category,
        enabled: policy.enabled,
      },
    });

    return this.mapPolicy(created);
  }

  async getPolicies(organizationId: string): Promise<SecurityPolicy[]> {
    const policies = await prisma.security_policies.findMany({
      where: { organization_id: organizationId },
    });

    return policies.map((p: any) => this.mapPolicy(p));
  }

  async togglePolicy(policyId: string, enabled: boolean): Promise<SecurityPolicy | null> {
    const updated = await prisma.security_policies.update({
      where: { id: policyId },
      data: { enabled },
    });

    return this.mapPolicy(updated);
  }

  // ===========================================================================
  // AUDIT LOGGING - PRISMA BACKED
  // ===========================================================================

  async logAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<AuditLogEntry> {
    const riskMap: Record<string, string> = { success: 'LOW', failure: 'MEDIUM', denied: 'HIGH' };
    
    const created = await prisma.security_audit_logs.create({
      data: {
        organization_id: entry.organizationId,
        action: entry.action,
        actor: entry.userId,
        resource_type: entry.resource,
        ip_address: entry.ipAddress,
        details: (entry.metadata as unknown as Prisma.InputJsonValue) || {},
        risk_level: riskMap[entry.result] as any,
      },
    });

    return {
      id: created.id,
      organizationId: created.organization_id,
      userId: created.actor,
      action: created.action,
      resource: created.resource_type,
      result: entry.result,
      ipAddress: created.ip_address || '',
      timestamp: created.created_at,
      metadata: created.details as unknown as Record<string, unknown>,
    };
  }

  async getAuditLogs(organizationId: string, limit: number = 100): Promise<AuditLogEntry[]> {
    const logs = await prisma.security_audit_logs.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return logs.map((l: any) => ({
      id: l.id,
      organizationId: l.organization_id,
      userId: l.actor,
      action: l.action,
      resource: l.resource_type,
      result: l.risk_level === 'HIGH' ? 'denied' : 'success' as any,
      ipAddress: l.ip_address || '',
      timestamp: l.created_at,
      metadata: l.details as unknown as Record<string, unknown>,
    }));
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private mapThreat(t: any): ThreatEvent {
    return {
      id: t.id,
      organizationId: t.organization_id,
      type: t.title || t.threat_type,
      severity: reverseSeverityMap[t.severity] || 'medium',
      status: reverseStatusMap[t.status] || 'active',
      source: t.source || 'unknown',
      description: t.description,
      detectedAt: t.detected_at,
      resolvedAt: t.resolved_at || undefined,
      affectedAssets: t.indicators as string[],
      mitigationSteps: t.mitigations as string[],
    };
  }

  private mapPolicy(p: any): SecurityPolicy {
    return {
      id: p.id,
      organizationId: p.organization_id,
      name: p.name,
      category: p.description || p.policy_type,
      enabled: p.enabled,
      lastUpdated: p.updated_at,
      violations: 0,
    };
  }

  // No seed method - Enterprise Platinum standard

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getSecurityDashboard(organizationId: string): Promise<any> {
    const posture = await this.getSecurityPosture(organizationId);
    const threats = await this.getThreats(organizationId);
    const policies = await this.getPolicies(organizationId);
    
    return {
      securityScore: posture.securityScore,
      vulnerabilities: posture.openVulnerabilities,
      activeThreats: threats.filter(t => t.status === 'active' || t.status === 'investigating').length,
      totalPolicies: policies.length,
      enabledPolicies: policies.filter(p => p.enabled).length,
    };
  }

  async getAccessPolicies(organizationId: string): Promise<any[]> {
    const policies = await this.getPolicies(organizationId);
    return policies.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      enabled: p.enabled,
    }));
  }

  // ===========================================================================
  // VULNERABILITY SCANNING
  // ===========================================================================

  async scanVulnerabilities(organizationId: string, scope?: string): Promise<{
    scanId: string;
    organizationId: string;
    scope: string;
    startedAt: Date;
    completedAt: Date;
    vulnerabilities: Array<{
      id: string;
      severity: ThreatSeverity;
      category: string;
      title: string;
      description: string;
      affectedComponent: string;
      remediation: string;
      cveId?: string;
    }>;
    summary: { critical: number; high: number; medium: number; low: number; total: number };
  }> {
    const scanId = `scan-${Date.now()}`;
    const startedAt = new Date();

    // Real vulnerability checks based on security policies and threat intelligence
    const policies = await this.getPolicies(organizationId);
    const threats = await this.getThreats(organizationId, true);

    const vulnerabilities: Array<{
      id: string; severity: ThreatSeverity; category: string; title: string;
      description: string; affectedComponent: string; remediation: string; cveId?: string;
    }> = [];

    // Check for policy gaps
    const disabledPolicies = policies.filter(p => !p.enabled);
    for (const policy of disabledPolicies) {
      vulnerabilities.push({
        id: `vuln-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        severity: 'medium',
        category: 'Configuration',
        title: `Security policy "${policy.name}" is disabled`,
        description: `The security policy "${policy.name}" (${policy.category}) is currently disabled, potentially leaving a gap in security coverage.`,
        affectedComponent: policy.category,
        remediation: `Review and re-enable the "${policy.name}" security policy`,
      });
    }

    // Check for unresolved threats
    const activeThreats = threats.filter(t => t.status === 'active');
    for (const threat of activeThreats) {
      vulnerabilities.push({
        id: `vuln-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        severity: threat.severity,
        category: 'Active Threat',
        title: `Unresolved threat: ${threat.type}`,
        description: threat.description,
        affectedComponent: (threat.affectedAssets || []).join(', ') || 'Unknown',
        remediation: (threat.mitigationSteps || []).join('; ') || 'Investigate and resolve the active threat',
      });
    }

    // Check for missing essential policies
    const essentialPolicies = ['Access Control', 'Data Encryption', 'Incident Response', 'Audit Logging', 'Network Security'];
    const existingCategories = new Set(policies.map(p => p.category));
    for (const essential of essentialPolicies) {
      if (!existingCategories.has(essential)) {
        vulnerabilities.push({
          id: `vuln-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          severity: 'high',
          category: 'Policy Gap',
          title: `Missing "${essential}" policy`,
          description: `No security policy found for ${essential}. This is a required security domain.`,
          affectedComponent: essential,
          remediation: `Create and enable a ${essential} security policy`,
        });
      }
    }

    const summary = {
      critical: vulnerabilities.filter(v => v.severity === 'critical').length,
      high: vulnerabilities.filter(v => v.severity === 'high').length,
      medium: vulnerabilities.filter(v => v.severity === 'medium').length,
      low: vulnerabilities.filter(v => v.severity === 'low').length,
      total: vulnerabilities.length,
    };

    // Log the scan as an audit event
    await this.logAuditEvent({
      organizationId,
      userId: 'system',
      action: 'vulnerability_scan',
      resource: scope || 'full',
      result: summary.critical > 0 ? 'failure' : 'success',
      ipAddress: '127.0.0.1',
      metadata: { scanId, summary },
    });

    return {
      scanId,
      organizationId,
      scope: scope || 'full',
      startedAt,
      completedAt: new Date(),
      vulnerabilities,
      summary,
    };
  }

  // ===========================================================================
  // COMPLIANCE FRAMEWORKS
  // ===========================================================================

  async getComplianceFrameworks(organizationId: string): Promise<ComplianceFramework[]> {
    const policies = await this.getPolicies(organizationId);
    const enabledCount = policies.filter(p => p.enabled).length;
    const totalCount = policies.length;

    // Generate compliance framework status from real policy data
    const frameworks: ComplianceFramework[] = [
      {
        id: `fw-soc2-${organizationId.slice(0, 8)}`,
        name: 'SOC 2 Type II',
        status: enabledCount >= 5 ? 'compliant' : enabledCount >= 3 ? 'in_progress' : 'non_compliant',
        totalControls: 8,
        implementedControls: Math.min(enabledCount, 8),
      },
      {
        id: `fw-gdpr-${organizationId.slice(0, 8)}`,
        name: 'GDPR',
        status: enabledCount >= 4 ? 'compliant' : enabledCount >= 2 ? 'in_progress' : 'non_compliant',
        totalControls: 6,
        implementedControls: Math.min(enabledCount, 6),
      },
      {
        id: `fw-hipaa-${organizationId.slice(0, 8)}`,
        name: 'HIPAA',
        status: enabledCount >= 6 ? 'compliant' : 'not_applicable',
        totalControls: 10,
        implementedControls: Math.min(enabledCount, 10),
      },
      {
        id: `fw-iso27001-${organizationId.slice(0, 8)}`,
        name: 'ISO 27001',
        status: totalCount >= 8 && enabledCount === totalCount ? 'compliant' : 'in_progress',
        totalControls: 12,
        implementedControls: Math.min(enabledCount, 12),
      },
    ];

    return frameworks;
  }

  // ===========================================================================
  // INCIDENT RESPONSE
  // ===========================================================================

  async createIncidentResponse(threatId: string, params: {
    responderId: string;
    responseType: 'isolate' | 'investigate' | 'mitigate' | 'escalate';
    notes: string;
    affectedSystems?: string[];
  }): Promise<{
    incidentId: string;
    threatId: string;
    response: typeof params;
    threatUpdated: boolean;
    auditLogged: boolean;
    timestamp: Date;
  }> {
    const threat = await prisma.security_threats.findUnique({ where: { id: threatId } });
    if (!threat) throw new Error(`Threat not found: ${threatId}`);

    // Update threat status based on response type
    let newStatus: ThreatStatus;
    switch (params.responseType) {
      case 'isolate': newStatus = 'investigating'; break;
      case 'investigate': newStatus = 'investigating'; break;
      case 'mitigate': newStatus = 'mitigated'; break;
      case 'escalate': newStatus = 'active'; break;
      default: newStatus = 'investigating';
    }

    await this.updateThreatStatus(threatId, newStatus);

    // Log the incident response
    await this.logAuditEvent({
      organizationId: threat.organization_id,
      userId: params.responderId,
      action: `incident_response:${params.responseType}`,
      resource: threatId,
      result: 'success',
      ipAddress: '127.0.0.1',
      metadata: {
        threatId,
        responseType: params.responseType,
        notes: params.notes,
        affectedSystems: params.affectedSystems,
      },
    });

    return {
      incidentId: `inc-${Date.now()}`,
      threatId,
      response: params,
      threatUpdated: true,
      auditLogged: true,
      timestamp: new Date(),
    };
  }

  // ===========================================================================
  // DASHBOARD & HEALTH
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    serviceName: string;
    status: string;
    securityScore: number;
    complianceScore: number;
    threats: { active: number; investigating: number; mitigated: number; resolved: number; bySeverity: Record<string, number> };
    policies: { total: number; enabled: number; disabled: number; violationCount: number };
    auditLogs: { total: number; recent: number; denied: number };
    vulnerabilities: { lastScan: Date | null; total: number; critical: number; high: number };
    compliance: { frameworks: number; compliant: number; inProgress: number };
    insights: string[];
  }> {
    const posture = await this.getSecurityPosture(organizationId);
    const threats = await this.getThreats(organizationId, true);
    const policies = await this.getPolicies(organizationId);
    const logs = await this.getAuditLogs(organizationId, 1000);
    const frameworks = await this.getComplianceFrameworks(organizationId);

    const bySeverity: Record<string, number> = {};
    for (const t of threats) {
      bySeverity[t.severity] = (bySeverity[t.severity] || 0) + 1;
    }

    const recentLogs = logs.filter(l => l.timestamp.getTime() > Date.now() - 24 * 60 * 60 * 1000);

    const insights: string[] = [];
    const activeThreats = threats.filter(t => t.status === 'active');
    if (activeThreats.length > 0) insights.push(`${activeThreats.length} active threat(s) require attention`);
    const criticalThreats = threats.filter(t => t.severity === 'critical' && t.status !== 'resolved');
    if (criticalThreats.length > 0) insights.push(`${criticalThreats.length} critical severity threat(s) unresolved`);
    const disabledPolicies = policies.filter(p => !p.enabled);
    if (disabledPolicies.length > 0) insights.push(`${disabledPolicies.length} security policy/policies disabled`);
    const nonCompliant = frameworks.filter(f => f.status === 'non_compliant');
    if (nonCompliant.length > 0) insights.push(`${nonCompliant.length} compliance framework(s) non-compliant`);
    if (insights.length === 0) insights.push('Security posture is healthy');

    return {
      serviceName: 'Guard',
      status: activeThreats.length > 0 ? 'alert' : 'secure',
      securityScore: posture.securityScore,
      complianceScore: posture.complianceScore,
      threats: {
        active: threats.filter(t => t.status === 'active').length,
        investigating: threats.filter(t => t.status === 'investigating').length,
        mitigated: threats.filter(t => t.status === 'mitigated').length,
        resolved: threats.filter(t => t.status === 'resolved').length,
        bySeverity,
      },
      policies: {
        total: policies.length,
        enabled: policies.filter(p => p.enabled).length,
        disabled: disabledPolicies.length,
        violationCount: policies.reduce((sum, p) => sum + p.violations, 0),
      },
      auditLogs: {
        total: logs.length,
        recent: recentLogs.length,
        denied: logs.filter(l => l.result === 'denied').length,
      },
      vulnerabilities: {
        lastScan: null,
        total: 0,
        critical: 0,
        high: 0,
      },
      compliance: {
        frameworks: frameworks.length,
        compliant: frameworks.filter(f => f.status === 'compliant').length,
        inProgress: frameworks.filter(f => f.status === 'in_progress').length,
      },
      insights,
    };
  }
}

export const guardService = new GuardService();
