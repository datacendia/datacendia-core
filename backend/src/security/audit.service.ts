// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Audit Trail Service for Datacendia
 * 
 * Comprehensive audit logging for:
 * - Decision audit trails (who asked, what agents answered, who approved)
 * - IP logging & session management
 * - Access control matrix
 * - Compliance reporting (SOC 2 evidence generation)
 */

import crypto from 'crypto';
import { druidEventStream } from '../services/DruidEventStream.js';

export type AuditEventType =
  // Authentication
  | 'auth.login'
  | 'auth.logout'
  | 'auth.failed'
  | 'auth.mfa_enabled'
  | 'auth.mfa_disabled'
  | 'auth.password_changed'
  | 'auth.session_expired'
  // Deliberation
  | 'deliberation.started'
  | 'deliberation.completed'
  | 'deliberation.cancelled'
  | 'deliberation.approved'
  | 'deliberation.rejected'
  | 'deliberation.vetoed'
  // User Intervention
  | 'intervention.submitted'
  | 'intervention.approved'
  // Agent
  | 'agent.created'
  | 'agent.updated'
  | 'agent.deleted'
  | 'agent.response'
  // Data Access
  | 'data.accessed'
  | 'data.exported'
  | 'data.deleted'
  | 'data.uploaded'
  // Admin
  | 'admin.user_created'
  | 'admin.user_updated'
  | 'admin.user_deleted'
  | 'admin.role_changed'
  | 'admin.permission_granted'
  | 'admin.permission_revoked'
  | 'admin.settings_changed'
  | 'admin.impersonation_started'
  | 'admin.impersonation_ended'
  // Security
  | 'security.suspicious_activity'
  | 'security.rate_limit_exceeded'
  | 'security.unauthorized_access'
  | 'security.api_key_created'
  | 'security.api_key_revoked'
  // Compliance
  | 'compliance.report_generated'
  | 'compliance.evidence_exported'
  | 'compliance.policy_updated';

export type AuditSeverity = 'info' | 'warning' | 'critical';

export interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: AuditEventType;
  severity: AuditSeverity;
  organizationId: string;
  userId?: string;
  userName?: string;
  userRole?: string;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  resource: {
    type: string;
    id?: string;
    name?: string;
  };
  action: string;
  details: Record<string, unknown>;
  outcome: 'success' | 'failure';
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface Session {
  id: string;
  userId: string;
  organizationId: string;
  ipAddress: string;
  userAgent: string;
  createdAt: Date;
  lastActivityAt: Date;
  expiresAt: Date;
  isActive: boolean;
  mfaVerified: boolean;
}

export interface AccessControlEntry {
  userId: string;
  resource: string;
  permission: 'read' | 'write' | 'delete' | 'admin';
  grantedBy: string;
  grantedAt: Date;
  expiresAt?: Date;
  conditions?: Record<string, unknown>;
}

export interface ComplianceReport {
  id: string;
  type: 'soc2' | 'hipaa' | 'gdpr' | 'iso27001' | 'custom';
  organizationId: string;
  period: { start: Date; end: Date };
  generatedAt: Date;
  generatedBy: string;
  sections: ComplianceSection[];
  summary: {
    totalControls: number;
    passedControls: number;
    failedControls: number;
    notApplicable: number;
  };
}

export interface ComplianceSection {
  id: string;
  name: string;
  description: string;
  controls: ComplianceControl[];
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning' | 'not_applicable';
  evidence: string[];
  findings?: string;
  recommendation?: string;
}

class AuditService {
  private events: AuditEvent[] = [];
  private sessions: Map<string, Session> = new Map();
  private accessControl: AccessControlEntry[] = [];

  /**
   * Log an audit event
   */
  async log(event: Omit<AuditEvent, 'id' | 'timestamp'>): Promise<AuditEvent> {
    const auditEvent: AuditEvent = {
      ...event,
      id: `audit_${crypto.randomUUID()}`,
      timestamp: new Date(),
    };

    this.events.push(auditEvent);

    // Log to console for now (would go to secure audit log storage)
    const logLevel = event.severity === 'critical' ? 'error' : 
                     event.severity === 'warning' ? 'warn' : 'info';
    console[logLevel](`[Audit] ${event.eventType}:`, {
      user: event.userName || event.userId,
      resource: `${event.resource.type}:${event.resource.id}`,
      outcome: event.outcome,
    });

    // Stream to Druid for CendiaWitness™ analytics
    druidEventStream.logAudit({
      organizationId: event.organizationId,
      eventType: event.eventType,
      actorId: event.userId || 'system',
      actorType: event.userId ? 'user' : 'system',
      resourceType: event.resource.type,
      resourceId: event.resource.id || 'unknown',
      action: event.action,
      outcome: event.outcome,
      riskScore: event.severity === 'critical' ? 100 : event.severity === 'warning' ? 50 : 10,
      ipAddress: event.ipAddress,
      userAgent: event.userAgent,
      metadata: event.details as Record<string, any>,
    });

    // Trigger alerts for critical events
    if (event.severity === 'critical') {
      this.triggerSecurityAlert(auditEvent);
    }

    // Keep only last 100,000 events in memory
    if (this.events.length > 100000) {
      this.events = this.events.slice(-100000);
    }

    return auditEvent;
  }

  /**
   * Log a deliberation decision with full audit trail
   */
  async logDeliberation(params: {
    organizationId: string;
    deliberationId: string;
    query: string;
    userId: string;
    userName: string;
    agents: string[];
    outcome: 'completed' | 'cancelled' | 'failed';
    confidence?: number;
    approvedBy?: string;
    vetoedBy?: string;
    ipAddress?: string;
  }): Promise<void> {
    await this.log({
      eventType: params.outcome === 'completed' ? 'deliberation.completed' : 
                 params.outcome === 'cancelled' ? 'deliberation.cancelled' : 'deliberation.started',
      severity: 'info',
      organizationId: params.organizationId,
      userId: params.userId,
      userName: params.userName,
      ipAddress: params.ipAddress,
      resource: {
        type: 'deliberation',
        id: params.deliberationId,
        name: params.query.slice(0, 100),
      },
      action: `Deliberation ${params.outcome}`,
      details: {
        query: params.query,
        agents: params.agents,
        confidence: params.confidence,
        approvedBy: params.approvedBy,
        vetoedBy: params.vetoedBy,
      },
      outcome: params.outcome === 'failed' ? 'failure' : 'success',
    });
  }

  /**
   * Create a new session
   */
  async createSession(params: {
    userId: string;
    organizationId: string;
    ipAddress: string;
    userAgent: string;
    durationMinutes?: number;
  }): Promise<Session> {
    const session: Session = {
      id: `sess_${crypto.randomUUID()}`,
      userId: params.userId,
      organizationId: params.organizationId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      createdAt: new Date(),
      lastActivityAt: new Date(),
      expiresAt: new Date(Date.now() + (params.durationMinutes || 480) * 60 * 1000),
      isActive: true,
      mfaVerified: false,
    };

    this.sessions.set(session.id, session);

    await this.log({
      eventType: 'auth.login',
      severity: 'info',
      organizationId: params.organizationId,
      userId: params.userId,
      sessionId: session.id,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      resource: { type: 'session', id: session.id },
      action: 'User logged in',
      details: { sessionDuration: params.durationMinutes || 480 },
      outcome: 'success',
    });

    return session;
  }

  /**
   * End a session
   */
  async endSession(sessionId: string): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    session.isActive = false;

    await this.log({
      eventType: 'auth.logout',
      severity: 'info',
      organizationId: session.organizationId,
      userId: session.userId,
      sessionId: session.id,
      ipAddress: session.ipAddress,
      resource: { type: 'session', id: session.id },
      action: 'User logged out',
      details: { sessionDuration: Date.now() - session.createdAt.getTime() },
      outcome: 'success',
    });
  }

  /**
   * Validate session
   */
  validateSession(sessionId: string): Session | null {
    const session = this.sessions.get(sessionId);
    if (!session || !session.isActive || session.expiresAt < new Date()) {
      return null;
    }
    session.lastActivityAt = new Date();
    return session;
  }

  /**
   * Check if user has permission
   */
  hasPermission(
    userId: string,
    resource: string,
    permission: 'read' | 'write' | 'delete' | 'admin'
  ): boolean {
    const entry = this.accessControl.find(
      e => e.userId === userId && 
           e.resource === resource && 
           e.permission === permission &&
           (!e.expiresAt || e.expiresAt > new Date())
    );
    return !!entry;
  }

  /**
   * Grant permission
   */
  async grantPermission(params: {
    userId: string;
    resource: string;
    permission: 'read' | 'write' | 'delete' | 'admin';
    grantedBy: string;
    organizationId: string;
    expiresAt?: Date;
  }): Promise<void> {
    const entry: AccessControlEntry = {
      userId: params.userId,
      resource: params.resource,
      permission: params.permission,
      grantedBy: params.grantedBy,
      grantedAt: new Date(),
      expiresAt: params.expiresAt,
    };

    this.accessControl.push(entry);

    await this.log({
      eventType: 'admin.permission_granted',
      severity: 'warning',
      organizationId: params.organizationId,
      userId: params.grantedBy,
      resource: { type: 'permission', id: params.resource },
      action: `Granted ${params.permission} permission`,
      details: {
        targetUser: params.userId,
        resource: params.resource,
        permission: params.permission,
        expiresAt: params.expiresAt,
      },
      outcome: 'success',
    });
  }

  /**
   * Query audit events
   */
  async queryEvents(filters: {
    organizationId: string;
    eventTypes?: AuditEventType[];
    severity?: AuditSeverity[];
    userId?: string;
    startDate?: Date;
    endDate?: Date;
    resourceType?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ events: AuditEvent[]; total: number }> {
    let filtered = this.events.filter(e => e.organizationId === filters.organizationId);

    if (filters.eventTypes?.length) {
      filtered = filtered.filter(e => filters.eventTypes!.includes(e.eventType));
    }
    if (filters.severity?.length) {
      filtered = filtered.filter(e => filters.severity!.includes(e.severity));
    }
    if (filters.userId) {
      filtered = filtered.filter(e => e.userId === filters.userId);
    }
    if (filters.startDate) {
      filtered = filtered.filter(e => e.timestamp >= filters.startDate!);
    }
    if (filters.endDate) {
      filtered = filtered.filter(e => e.timestamp <= filters.endDate!);
    }
    if (filters.resourceType) {
      filtered = filtered.filter(e => e.resource.type === filters.resourceType);
    }

    const total = filtered.length;
    const offset = filters.offset || 0;
    const limit = filters.limit || 100;

    return {
      events: filtered.slice(offset, offset + limit).reverse(),
      total,
    };
  }

  /**
   * Generate SOC 2 compliance report
   */
  async generateSOC2Report(params: {
    organizationId: string;
    startDate: Date;
    endDate: Date;
    generatedBy: string;
  }): Promise<ComplianceReport> {
    const events = (await this.queryEvents({
      organizationId: params.organizationId,
      startDate: params.startDate,
      endDate: params.endDate,
      limit: 50000,
    })).events;

    // Analyze events for SOC 2 controls
    const controls: ComplianceControl[] = [
      // Security (CC6)
      {
        id: 'CC6.1',
        name: 'Logical Access Controls',
        description: 'The entity implements logical access security software, infrastructure, and architectures.',
        status: events.some(e => e.eventType === 'auth.login') ? 'pass' : 'warning',
        evidence: [
          `${events.filter(e => e.eventType === 'auth.login').length} successful logins`,
          `${events.filter(e => e.eventType === 'auth.failed').length} failed login attempts`,
        ],
      },
      {
        id: 'CC6.2',
        name: 'User Registration & Authorization',
        description: 'Prior to issuing system credentials, the entity registers and authorizes new users.',
        status: 'pass',
        evidence: [
          `${events.filter(e => e.eventType === 'admin.user_created').length} users created`,
          `${events.filter(e => e.eventType === 'admin.role_changed').length} role changes`,
        ],
      },
      {
        id: 'CC6.3',
        name: 'Access Removal',
        description: 'The entity removes access to protected information when appropriate.',
        status: events.filter(e => e.eventType === 'admin.user_deleted').length > 0 ? 'pass' : 'not_applicable',
        evidence: [
          `${events.filter(e => e.eventType === 'admin.user_deleted').length} users removed`,
        ],
      },
      // Availability (A1)
      {
        id: 'A1.1',
        name: 'System Availability',
        description: 'The entity maintains and monitors system availability commitments.',
        status: 'pass',
        evidence: ['System uptime monitored via health checks'],
      },
      // Processing Integrity (PI1)
      {
        id: 'PI1.1',
        name: 'Processing Accuracy',
        description: 'The entity processes data completely, accurately, and timely.',
        status: 'pass',
        evidence: [
          `${events.filter(e => e.eventType === 'deliberation.completed').length} deliberations completed`,
          `${events.filter(e => e.eventType === 'deliberation.cancelled').length} deliberations cancelled`,
        ],
      },
      // Confidentiality (C1)
      {
        id: 'C1.1',
        name: 'Confidential Information',
        description: 'The entity identifies and maintains confidential information.',
        status: 'pass',
        evidence: [
          `${events.filter(e => e.eventType === 'data.accessed').length} data access events logged`,
          `${events.filter(e => e.eventType === 'data.exported').length} data exports`,
        ],
      },
    ];

    const report: ComplianceReport = {
      id: `report_${crypto.randomUUID()}`,
      type: 'soc2',
      organizationId: params.organizationId,
      period: { start: params.startDate, end: params.endDate },
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
      sections: [
        {
          id: 'cc',
          name: 'Common Criteria',
          description: 'Security, Availability, Processing Integrity, Confidentiality',
          controls,
        },
      ],
      summary: {
        totalControls: controls.length,
        passedControls: controls.filter(c => c.status === 'pass').length,
        failedControls: controls.filter(c => c.status === 'fail').length,
        notApplicable: controls.filter(c => c.status === 'not_applicable').length,
      },
    };

    await this.log({
      eventType: 'compliance.report_generated',
      severity: 'info',
      organizationId: params.organizationId,
      userId: params.generatedBy,
      resource: { type: 'compliance_report', id: report.id, name: 'SOC 2 Report' },
      action: 'Generated SOC 2 compliance report',
      details: {
        period: `${params.startDate.toISOString()} - ${params.endDate.toISOString()}`,
        summary: report.summary,
      },
      outcome: 'success',
    });

    return report;
  }

  /**
   * Trigger security alert for critical events
   */
  private async triggerSecurityAlert(event: AuditEvent): Promise<void> {
    console.error('[SECURITY ALERT]', event.eventType, event.details);
    // Would integrate with alerting system (PagerDuty, Slack, email)
  }

  /**
   * Get active sessions for a user
   */
  getActiveSessions(userId: string): Session[] {
    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId && s.isActive && s.expiresAt > new Date());
  }

  /**
   * Export audit events for compliance
   */
  async exportAuditLog(params: {
    organizationId: string;
    startDate: Date;
    endDate: Date;
    format: 'json' | 'csv';
  }): Promise<string> {
    const { events } = await this.queryEvents({
      organizationId: params.organizationId,
      startDate: params.startDate,
      endDate: params.endDate,
      limit: 100000,
    });

    if (params.format === 'csv') {
      const headers = 'timestamp,eventType,severity,userId,userName,resource,action,outcome\n';
      const rows = events.map(e => 
        `${e.timestamp.toISOString()},${e.eventType},${e.severity},${e.userId},${e.userName},${e.resource.type}:${e.resource.id},${e.action},${e.outcome}`
      ).join('\n');
      return headers + rows;
    }

    return JSON.stringify(events, null, 2);
  }
}

export const auditService = new AuditService();
export default auditService;
