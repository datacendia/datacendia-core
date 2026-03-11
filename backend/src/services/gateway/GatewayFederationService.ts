/**
 * CendiaGateway™ — Federation Infrastructure Service
 *
 * Enables "one agreement, all member orgs covered" deployment model.
 * Designed for FEPCMAC-style federations where a central authority
 * governs AI compliance across multiple member organizations.
 *
 * Capabilities:
 *   - Create and manage federations (e.g. FEPCMAC → 11 Cajas Municipales)
 *   - Push shared AI governance policies to all members
 *   - Consolidated compliance reporting across the federation
 *   - Per-member interaction stats with federation-wide aggregation
 *   - Cryptographically signed compliance reports for regulatory submission
 *   - Risk scoring per member org
 *
 * @module services/gateway/GatewayFederationService
 */

import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Federation {
  id: string;
  name: string;
  slug: string;
  description?: string;
  adminOrgId: string;
  adminContact?: string;
  sharedPolicies: boolean;
  consolidatedReporting: boolean;
  dataIsolation: 'strict' | 'shared' | 'hybrid';
  regulatoryFramework?: string;
  reportingAuthority?: string;
  complianceDeadline?: Date;
  status: 'active' | 'suspended' | 'archived';
  members: FederationMember[];
  policies: FederationPolicy[];
  createdAt: Date;
}

export interface FederationMember {
  id: string;
  federationId: string;
  organizationId: string;
  orgName: string;
  orgCode?: string;
  joinedAt: Date;
  policyOverride: boolean;
  customDomains: string[];
  status: 'active' | 'suspended' | 'removed';
}

export interface FederationPolicy {
  id: string;
  federationId: string;
  name: string;
  description?: string;
  priority: number;
  action: 'allow' | 'warn' | 'block' | 'redact';
  piiTypes: string[];
  blockedKeywords: string[];
  maxPromptLength?: number;
  allowedProviders: string[];
  blockedProviders: string[];
  appliesToAll: boolean;
  memberOrgIds: string[];
  departments: string[];
  enabled: boolean;
}

export interface MemberStats {
  organizationId: string;
  orgName: string;
  orgCode?: string;
  totalInteractions: number;
  blocked: number;
  warned: number;
  allowed: number;
  piiDetected: number;
  piiByType: Record<string, number>;
  providerUsage: Record<string, number>;
  complianceScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface FederationReport {
  id: string;
  federationId: string;
  reportType: 'compliance' | 'usage' | 'risk' | 'audit' | 'sbs_submission';
  title: string;
  periodStart: Date;
  periodEnd: Date;
  totalInteractions: number;
  totalBlocked: number;
  totalPiiDetected: number;
  totalPolicyViolations: number;
  memberBreakdown: MemberStats[];
  providerBreakdown: Record<string, number>;
  piiBreakdown: Record<string, number>;
  complianceScore: number;
  findings: string[];
  recommendations: string[];
  integrityHash: string;
  signature?: string;
  merkleRoot?: string;
  status: 'draft' | 'final' | 'submitted';
  submittedTo?: string;
  generatedAt: Date;
}

// ─── In-memory store (production uses Prisma) ────────────────────────────────

const federations: Map<string, Federation> = new Map();
const memberInteractions: Map<string, { orgId: string; blocked: boolean; piiDetected: boolean; piiTypes: string[]; provider: string; timestamp: Date }[]> = new Map();

// ─── Service ─────────────────────────────────────────────────────────────────

class GatewayFederationService {
  private static instance: GatewayFederationService;

  private constructor() {
    logger.info('[GatewayFederation] Service initialized');
  }

  static getInstance(): GatewayFederationService {
    if (!GatewayFederationService.instance) {
      GatewayFederationService.instance = new GatewayFederationService();
    }
    return GatewayFederationService.instance;
  }

  // ─── Federation CRUD ─────────────────────────────────────────────────────

  createFederation(params: {
    name: string;
    adminOrgId: string;
    adminContact?: string;
    regulatoryFramework?: string;
    reportingAuthority?: string;
    complianceDeadline?: Date;
    description?: string;
    dataIsolation?: 'strict' | 'shared' | 'hybrid';
  }): Federation {
    const id = crypto.randomUUID();
    const slug = params.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const federation: Federation = {
      id,
      name: params.name,
      slug,
      description: params.description,
      adminOrgId: params.adminOrgId,
      adminContact: params.adminContact,
      sharedPolicies: true,
      consolidatedReporting: true,
      dataIsolation: params.dataIsolation || 'strict',
      regulatoryFramework: params.regulatoryFramework,
      reportingAuthority: params.reportingAuthority,
      complianceDeadline: params.complianceDeadline,
      status: 'active',
      members: [],
      policies: [],
      createdAt: new Date(),
    };

    federations.set(id, federation);
    memberInteractions.set(id, []);

    logger.info(`[GatewayFederation] Created federation: ${params.name} (${id}) admin=${params.adminOrgId} framework=${params.regulatoryFramework}`);
    return federation;
  }

  getFederation(id: string): Federation | undefined {
    return federations.get(id);
  }

  getFederationBySlug(slug: string): Federation | undefined {
    for (const fed of federations.values()) {
      if (fed.slug === slug) return fed;
    }
    return undefined;
  }

  listFederations(): Federation[] {
    return Array.from(federations.values()).filter(f => f.status !== 'archived');
  }

  // ─── Member Management ───────────────────────────────────────────────────

  addMember(federationId: string, params: {
    organizationId: string;
    orgName: string;
    orgCode?: string;
    customDomains?: string[];
  }): FederationMember | null {
    const federation = federations.get(federationId);
    if (!federation) return null;

    // Check for duplicate
    if (federation.members.some(m => m.organizationId === params.organizationId)) {
      logger.warn(`[GatewayFederation] Org ${params.organizationId} already a member of ${federation.name}`);
      return federation.members.find(m => m.organizationId === params.organizationId)!;
    }

    const member: FederationMember = {
      id: crypto.randomUUID(),
      federationId,
      organizationId: params.organizationId,
      orgName: params.orgName,
      orgCode: params.orgCode,
      joinedAt: new Date(),
      policyOverride: false,
      customDomains: params.customDomains || [],
      status: 'active',
    };

    federation.members.push(member);
    logger.info(`[GatewayFederation] Added member: ${params.orgName} (${params.orgCode || params.organizationId}) to ${federation.name}`);
    return member;
  }

  removeMember(federationId: string, organizationId: string): boolean {
    const federation = federations.get(federationId);
    if (!federation) return false;

    const member = federation.members.find(m => m.organizationId === organizationId);
    if (!member) return false;

    member.status = 'removed';
    logger.info(`[GatewayFederation] Removed member: ${member.orgName} from ${federation.name}`);
    return true;
  }

  getMembers(federationId: string): FederationMember[] {
    const federation = federations.get(federationId);
    if (!federation) return [];
    return federation.members.filter(m => m.status === 'active');
  }

  // ─── Federation Policies ─────────────────────────────────────────────────

  addPolicy(federationId: string, params: {
    name: string;
    description?: string;
    priority?: number;
    action: 'allow' | 'warn' | 'block' | 'redact';
    piiTypes?: string[];
    blockedKeywords?: string[];
    maxPromptLength?: number;
    allowedProviders?: string[];
    blockedProviders?: string[];
    departments?: string[];
    memberOrgIds?: string[];
  }): FederationPolicy | null {
    const federation = federations.get(federationId);
    if (!federation) return null;

    const policy: FederationPolicy = {
      id: crypto.randomUUID(),
      federationId,
      name: params.name,
      description: params.description,
      priority: params.priority || 100,
      action: params.action,
      piiTypes: params.piiTypes || [],
      blockedKeywords: params.blockedKeywords || [],
      maxPromptLength: params.maxPromptLength,
      allowedProviders: params.allowedProviders || [],
      blockedProviders: params.blockedProviders || [],
      appliesToAll: !params.memberOrgIds || params.memberOrgIds.length === 0,
      memberOrgIds: params.memberOrgIds || [],
      departments: params.departments || [],
      enabled: true,
    };

    federation.policies.push(policy);
    logger.info(`[GatewayFederation] Added policy: "${params.name}" (${params.action}) to ${federation.name}`);
    return policy;
  }

  getPoliciesForOrg(federationId: string, organizationId: string): FederationPolicy[] {
    const federation = federations.get(federationId);
    if (!federation) return [];

    return federation.policies
      .filter(p => p.enabled)
      .filter(p => p.appliesToAll || p.memberOrgIds.includes(organizationId))
      .sort((a, b) => a.priority - b.priority);
  }

  // ─── Interaction Tracking ────────────────────────────────────────────────

  recordInteraction(federationId: string, orgId: string, interaction: {
    blocked: boolean;
    piiDetected: boolean;
    piiTypes: string[];
    provider: string;
  }): void {
    const interactions = memberInteractions.get(federationId);
    if (!interactions) return;

    interactions.push({
      orgId,
      blocked: interaction.blocked,
      piiDetected: interaction.piiDetected,
      piiTypes: interaction.piiTypes,
      provider: interaction.provider,
      timestamp: new Date(),
    });
  }

  // ─── Member Stats ────────────────────────────────────────────────────────

  getMemberStats(federationId: string, organizationId: string, periodStart?: Date, periodEnd?: Date): MemberStats | null {
    const federation = federations.get(federationId);
    if (!federation) return null;

    const member = federation.members.find(m => m.organizationId === organizationId);
    if (!member) return null;

    const interactions = (memberInteractions.get(federationId) || [])
      .filter(i => i.orgId === organizationId)
      .filter(i => !periodStart || i.timestamp >= periodStart)
      .filter(i => !periodEnd || i.timestamp <= periodEnd);

    const piiByType: Record<string, number> = {};
    const providerUsage: Record<string, number> = {};

    for (const i of interactions) {
      for (const t of i.piiTypes) {
        piiByType[t] = (piiByType[t] || 0) + 1;
      }
      providerUsage[i.provider] = (providerUsage[i.provider] || 0) + 1;
    }

    const blocked = interactions.filter(i => i.blocked).length;
    const piiDetected = interactions.filter(i => i.piiDetected).length;
    const total = interactions.length;

    // Risk scoring
    const blockRate = total > 0 ? blocked / total : 0;
    const piiRate = total > 0 ? piiDetected / total : 0;
    let riskLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    if (blockRate > 0.15 || piiRate > 0.30) riskLevel = 'critical';
    else if (blockRate > 0.08 || piiRate > 0.20) riskLevel = 'high';
    else if (blockRate > 0.03 || piiRate > 0.10) riskLevel = 'medium';

    // Compliance score (100 = perfect)
    const complianceScore = Math.max(0, Math.round(100 - (blockRate * 200) - (piiRate * 100)));

    return {
      organizationId,
      orgName: member.orgName,
      orgCode: member.orgCode,
      totalInteractions: total,
      blocked,
      warned: 0, // TODO: track warns separately
      allowed: total - blocked,
      piiDetected,
      piiByType,
      providerUsage,
      complianceScore,
      riskLevel,
    };
  }

  // ─── Consolidated Reporting ──────────────────────────────────────────────

  generateReport(federationId: string, params: {
    reportType: 'compliance' | 'usage' | 'risk' | 'audit' | 'sbs_submission';
    periodStart: Date;
    periodEnd: Date;
    title?: string;
  }): FederationReport | null {
    const federation = federations.get(federationId);
    if (!federation) return null;

    const activeMembers = federation.members.filter(m => m.status === 'active');

    // Gather per-member stats
    const memberBreakdown: MemberStats[] = [];
    let totalInteractions = 0;
    let totalBlocked = 0;
    let totalPiiDetected = 0;
    const providerBreakdown: Record<string, number> = {};
    const piiBreakdown: Record<string, number> = {};

    for (const member of activeMembers) {
      const stats = this.getMemberStats(federationId, member.organizationId, params.periodStart, params.periodEnd);
      if (!stats) continue;

      memberBreakdown.push(stats);
      totalInteractions += stats.totalInteractions;
      totalBlocked += stats.blocked;
      totalPiiDetected += stats.piiDetected;

      for (const [provider, count] of Object.entries(stats.providerUsage)) {
        providerBreakdown[provider] = (providerBreakdown[provider] || 0) + count;
      }
      for (const [piiType, count] of Object.entries(stats.piiByType)) {
        piiBreakdown[piiType] = (piiBreakdown[piiType] || 0) + count;
      }
    }

    // Compliance scoring
    const blockRate = totalInteractions > 0 ? totalBlocked / totalInteractions : 0;
    const complianceScore = Math.max(0, Math.round(100 - (blockRate * 200)));

    // Generate findings
    const findings: string[] = [];
    const recommendations: string[] = [];

    if (totalBlocked > 0) {
      findings.push(`${totalBlocked} AI interactions were blocked due to policy violations across ${activeMembers.length} member organizations.`);
    }
    if (totalPiiDetected > 0) {
      findings.push(`PII was detected in ${totalPiiDetected} interactions. Types: ${Object.keys(piiBreakdown).join(', ')}.`);
    }

    const highRiskMembers = memberBreakdown.filter(m => m.riskLevel === 'high' || m.riskLevel === 'critical');
    if (highRiskMembers.length > 0) {
      findings.push(`${highRiskMembers.length} member org(s) flagged as high/critical risk: ${highRiskMembers.map(m => m.orgName).join(', ')}.`);
      recommendations.push(`Recommend additional AI governance training for: ${highRiskMembers.map(m => m.orgName).join(', ')}.`);
    }

    if (complianceScore >= 90) {
      findings.push(`Federation compliance score: ${complianceScore}/100 — Excellent.`);
    } else if (complianceScore >= 70) {
      findings.push(`Federation compliance score: ${complianceScore}/100 — Acceptable.`);
      recommendations.push('Review and reinforce AI usage policies with member organizations.');
    } else {
      findings.push(`Federation compliance score: ${complianceScore}/100 — Below threshold.`);
      recommendations.push('Urgent: Schedule federation-wide AI governance review.');
    }

    // Cryptographic integrity
    const reportData = JSON.stringify({
      federationId, totalInteractions, totalBlocked, totalPiiDetected,
      memberBreakdown, providerBreakdown, piiBreakdown, complianceScore,
      periodStart: params.periodStart.toISOString(),
      periodEnd: params.periodEnd.toISOString(),
    });
    const integrityHash = crypto.createHash('sha256').update(reportData).digest('hex');
    const signature = crypto.createHmac('sha256', process.env.GATEWAY_SIGNING_KEY || 'datacendia-gateway-default')
      .update(reportData).digest('hex');

    const defaultTitle = `${federation.name} — ${params.reportType.charAt(0).toUpperCase() + params.reportType.slice(1)} Report`;

    const report: FederationReport = {
      id: crypto.randomUUID(),
      federationId,
      reportType: params.reportType,
      title: params.title || defaultTitle,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      totalInteractions,
      totalBlocked,
      totalPiiDetected,
      totalPolicyViolations: totalBlocked,
      memberBreakdown,
      providerBreakdown,
      piiBreakdown,
      complianceScore,
      findings,
      recommendations,
      integrityHash,
      signature,
      status: 'draft',
      generatedAt: new Date(),
    };

    logger.info(`[GatewayFederation] Generated ${params.reportType} report for ${federation.name}: ${totalInteractions} interactions, score=${complianceScore}`);
    return report;
  }

  // ─── Compliance Dashboard ────────────────────────────────────────────────

  getFederationDashboard(federationId: string): {
    federation: Federation;
    memberCount: number;
    activePolicies: number;
    totalInteractions: number;
    totalBlocked: number;
    complianceScore: number;
    memberRiskSummary: { low: number; medium: number; high: number; critical: number };
    topProviders: { provider: string; count: number }[];
    topPiiTypes: { type: string; count: number }[];
  } | null {
    const federation = federations.get(federationId);
    if (!federation) return null;

    const activeMembers = federation.members.filter(m => m.status === 'active');
    const interactions = memberInteractions.get(federationId) || [];

    const providerCounts: Record<string, number> = {};
    const piiCounts: Record<string, number> = {};
    let totalBlocked = 0;

    for (const i of interactions) {
      providerCounts[i.provider] = (providerCounts[i.provider] || 0) + 1;
      if (i.blocked) totalBlocked++;
      for (const t of i.piiTypes) {
        piiCounts[t] = (piiCounts[t] || 0) + 1;
      }
    }

    const riskSummary = { low: 0, medium: 0, high: 0, critical: 0 };
    let totalComplianceScore = 0;

    for (const member of activeMembers) {
      const stats = this.getMemberStats(federationId, member.organizationId);
      if (stats) {
        riskSummary[stats.riskLevel]++;
        totalComplianceScore += stats.complianceScore;
      }
    }

    const avgCompliance = activeMembers.length > 0 ? Math.round(totalComplianceScore / activeMembers.length) : 100;

    return {
      federation,
      memberCount: activeMembers.length,
      activePolicies: federation.policies.filter(p => p.enabled).length,
      totalInteractions: interactions.length,
      totalBlocked,
      complianceScore: avgCompliance,
      memberRiskSummary: riskSummary,
      topProviders: Object.entries(providerCounts)
        .map(([provider, count]) => ({ provider, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
      topPiiTypes: Object.entries(piiCounts)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10),
    };
  }

  // ─── Org lookup ──────────────────────────────────────────────────────────

  getFederationForOrg(organizationId: string): Federation | undefined {
    for (const fed of federations.values()) {
      if (fed.members.some(m => m.organizationId === organizationId && m.status === 'active')) {
        return fed;
      }
    }
    return undefined;
  }
}

export const gatewayFederationService = GatewayFederationService.getInstance();
export default GatewayFederationService;
