/**
 * Dynamic Data Sovereignty Routing
 * 
 * Policy-driven, real-time routing for data/AI workloads by region, user, or regulation.
 * @module services/enterprise/DataSovereigntyService
 */

import { logger } from '../../utils/logger.js';

export interface SovereigntyPolicy {
  id: string;
  name: string;
  description: string;
  regions: string[];
  dataClassifications: string[];
  rules: SovereigntyRule[];
  enabled: boolean;
  createdAt: string;
}

export interface SovereigntyRule {
  id: string;
  condition: { field: string; operator: string; value: any };
  targetRegion: string;
  fallbackRegion?: string;
  blockIfUnavailable: boolean;
}

export interface RoutingDecision {
  id: string;
  policyId: string;
  dataClassification: string;
  sourceRegion: string;
  targetRegion: string;
  decision: 'routed' | 'blocked' | 'fallback';
  reason: string;
  timestamp: string;
  latencyMs: number;
}

export interface RegionStatus {
  region: string;
  status: 'online' | 'degraded' | 'offline';
  latencyMs: number;
  complianceFrameworks: string[];
  dataCenter: string;
  lastCheck: string;
}

class DataSovereigntyService {
  private policies: Map<string, SovereigntyPolicy> = new Map();
  private decisions: RoutingDecision[] = [];
  private regions: Map<string, RegionStatus> = new Map();

  constructor() {
    this.loadDefaultRegions();
  }

  async createPolicy(input: Omit<SovereigntyPolicy, 'id' | 'createdAt'>): Promise<SovereigntyPolicy> {
    const id = `sp_${crypto.randomUUID().split('-')[0]}`;
    const policy: SovereigntyPolicy = { id, ...input, createdAt: new Date().toISOString() };
    this.policies.set(id, policy);
    return policy;
  }

  async listPolicies(): Promise<SovereigntyPolicy[]> {
    return Array.from(this.policies.values());
  }

  async routeData(dataClassification: string, sourceRegion: string, userContext: Record<string, any>): Promise<RoutingDecision> {
    const startTime = Date.now();
    let targetRegion = sourceRegion;
    let decision: RoutingDecision['decision'] = 'routed';
    let reason = 'Default: route to source region';
    let policyId = '';

    for (const policy of this.policies.values()) {
      if (!policy.enabled) continue;
      if (!policy.dataClassifications.includes(dataClassification)) continue;

      for (const rule of policy.rules) {
        const fieldValue = userContext[rule.condition.field];
        let matches = false;
        if (rule.condition.operator === 'equals') matches = fieldValue === rule.condition.value;
        if (rule.condition.operator === 'in') matches = Array.isArray(rule.condition.value) && rule.condition.value.includes(fieldValue);

        if (matches) {
          const regionStatus = this.regions.get(rule.targetRegion);
          if (regionStatus?.status === 'online') {
            targetRegion = rule.targetRegion;
            reason = `Policy "${policy.name}": routed to ${rule.targetRegion}`;
            policyId = policy.id;
          } else if (rule.fallbackRegion) {
            targetRegion = rule.fallbackRegion;
            decision = 'fallback';
            reason = `Policy "${policy.name}": fallback to ${rule.fallbackRegion} (${rule.targetRegion} unavailable)`;
            policyId = policy.id;
          } else if (rule.blockIfUnavailable) {
            decision = 'blocked';
            reason = `Policy "${policy.name}": blocked — ${rule.targetRegion} unavailable, no fallback`;
            policyId = policy.id;
          }
          break;
        }
      }
    }

    const routingDecision: RoutingDecision = {
      id: `rd_${crypto.randomUUID().split('-')[0]}`,
      policyId,
      dataClassification,
      sourceRegion,
      targetRegion,
      decision,
      reason,
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
    };

    this.decisions.push(routingDecision);
    return routingDecision;
  }

  async getRegionStatuses(): Promise<RegionStatus[]> {
    return Array.from(this.regions.values());
  }

  async getRoutingHistory(limit = 100): Promise<RoutingDecision[]> {
    return this.decisions.slice(-limit).reverse();
  }

  private loadDefaultRegions(): void {
    const regions: RegionStatus[] = [
      { region: 'eu-west-1', status: 'online', latencyMs: 12, complianceFrameworks: ['GDPR', 'EU AI Act', 'DORA'], dataCenter: 'Frankfurt', lastCheck: new Date().toISOString() },
      { region: 'eu-central-1', status: 'online', latencyMs: 8, complianceFrameworks: ['GDPR', 'EU AI Act', 'DORA'], dataCenter: 'Dublin', lastCheck: new Date().toISOString() },
      { region: 'us-east-1', status: 'online', latencyMs: 45, complianceFrameworks: ['SOC 2', 'HIPAA', 'SOX'], dataCenter: 'Virginia', lastCheck: new Date().toISOString() },
      { region: 'us-west-2', status: 'online', latencyMs: 62, complianceFrameworks: ['SOC 2', 'HIPAA'], dataCenter: 'Oregon', lastCheck: new Date().toISOString() },
      { region: 'ap-southeast-1', status: 'online', latencyMs: 120, complianceFrameworks: ['PDPA'], dataCenter: 'Singapore', lastCheck: new Date().toISOString() },
      { region: 'ap-northeast-1', status: 'online', latencyMs: 95, complianceFrameworks: ['APPI'], dataCenter: 'Tokyo', lastCheck: new Date().toISOString() },
    ];
    for (const r of regions) this.regions.set(r.region, r);
  }
}

export const dataSovereignty = new DataSovereigntyService();
export { DataSovereigntyService };
