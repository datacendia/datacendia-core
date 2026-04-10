// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list, sr_get } from './_base.js';

export interface CustomerAccount {
  id: string;
  company: string;
  industry: string;
  tier: 'enterprise' | 'business' | 'startup' | 'smb';
  arr: number;
  mrr: number;
  contractStart: string;
  contractEnd: string;
  csmId?: string;
  csmName?: string;
  healthScore: number;
  npsScore?: number;
  lastActivity?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthAssessment {
  customerId: string;
  overallScore: number;
  trend: 'up' | 'stable' | 'down';
  components: { name: string; score: number; weight: number }[];
  riskFactors: string[];
  opportunities: string[];
  recommendedActions: string[];
  assessedAt: string;
}

const SN = 'CendiaGuardian';
const customers = new Map<string, CustomerAccount>();

const SAMPLE_CUSTOMERS: CustomerAccount[] = [
  { id: 'cust-1', company: 'Acme Financial', industry: 'Financial Services', tier: 'enterprise', arr: 480000, mrr: 40000, contractStart: new Date(Date.now() - 400 * 86400000).toISOString(), contractEnd: new Date(Date.now() + 320 * 86400000).toISOString(), csmName: 'Sarah Chen', healthScore: 82, npsScore: 8, lastActivity: new Date(Date.now() - 3 * 86400000).toISOString(), createdAt: new Date(Date.now() - 400 * 86400000).toISOString(), updatedAt: now() },
  { id: 'cust-2', company: 'TechVenture Labs', industry: 'Technology', tier: 'business', arr: 96000, mrr: 8000, contractStart: new Date(Date.now() - 200 * 86400000).toISOString(), contractEnd: new Date(Date.now() + 160 * 86400000).toISOString(), csmName: 'James Park', healthScore: 54, npsScore: 5, lastActivity: new Date(Date.now() - 21 * 86400000).toISOString(), createdAt: new Date(Date.now() - 200 * 86400000).toISOString(), updatedAt: now() },
  { id: 'cust-3', company: 'HealthCorp Systems', industry: 'Healthcare', tier: 'enterprise', arr: 720000, mrr: 60000, contractStart: new Date(Date.now() - 600 * 86400000).toISOString(), contractEnd: new Date(Date.now() + 130 * 86400000).toISOString(), csmName: 'Maria Rodriguez', healthScore: 91, npsScore: 9, createdAt: new Date(Date.now() - 600 * 86400000).toISOString(), updatedAt: now() },
];

class CendiaGuardianService {
  addCustomer(input: Partial<CustomerAccount>): CustomerAccount {
    const customer: CustomerAccount = {
      id: generateId(), company: input.company || 'New Customer', industry: input.industry || 'Other',
      tier: input.tier || 'business', arr: input.arr || 0, mrr: input.mrr || Math.round((input.arr || 0) / 12),
      contractStart: input.contractStart || now(), contractEnd: input.contractEnd || new Date(Date.now() + 365 * 86400000).toISOString(),
      csmName: input.csmName, healthScore: 75, createdAt: now(), updatedAt: now(),
    };
    customers.set(customer.id, customer);
    sr_create(SN, 'customer', customer).catch(() => {});
    return customer;
  }

  getAllCustomers(): CustomerAccount[] {
    if (customers.size === 0) SAMPLE_CUSTOMERS.forEach((c) => customers.set(c.id, c));
    return Array.from(customers.values());
  }

  async assessHealth(id: string): Promise<HealthAssessment> {
    const customer = customers.get(id) || SAMPLE_CUSTOMERS.find((c) => c.id === id);
    const score = customer?.healthScore ?? 70;
    const components = [
      { name: 'Product Adoption', score: score + 5, weight: 0.3 },
      { name: 'Engagement', score: score - 5, weight: 0.25 },
      { name: 'Support Tickets', score: score + 10, weight: 0.2 },
      { name: 'NPS', score: (customer?.npsScore ?? 7) * 10, weight: 0.15 },
      { name: 'Contract Value', score: score, weight: 0.1 },
    ];
    const assessment: HealthAssessment & { id: string } = {
      id: generateId(), customerId: id, overallScore: score, trend: score > 75 ? 'up' : score < 55 ? 'down' : 'stable', components,
      riskFactors: score < 60 ? ['Low product adoption', 'Declining engagement', 'Support ticket spike'] : [],
      opportunities: ['Upsell to next tier', 'New module adoption', 'Executive sponsor introduction'],
      recommendedActions: score < 60 ? ['Schedule executive check-in', 'Provide adoption coaching', 'Identify internal champion'] : ['Propose expansion plan', 'Case study opportunity'],
      assessedAt: now(),
    };
    sr_create(SN, 'health_assessment', assessment, undefined, id).catch(() => {});
    return assessment;
  }

  async predictChurn(id: string): Promise<{ customerId: string; churnProbability: number; churnRisk: 'low' | 'medium' | 'high' | 'critical'; triggerFactors: string[]; retentionActions: string[] }> {
    const customer = customers.get(id) || SAMPLE_CUSTOMERS.find((c) => c.id === id);
    const score = customer?.healthScore ?? 70;
    const churnProb = Math.max(5, Math.min(90, 100 - score + Math.round((Math.random() - 0.5) * 10)));
    return {
      customerId: id, churnProbability: churnProb,
      churnRisk: churnProb > 70 ? 'critical' : churnProb > 50 ? 'high' : churnProb > 30 ? 'medium' : 'low',
      triggerFactors: churnProb > 50 ? ['No executive sponsor', 'Low feature usage', 'Upcoming contract renewal'] : ['Healthy renewal trajectory'],
      retentionActions: ['Schedule QBR with C-suite', 'Activate dedicated success engineer', 'Propose multi-year discount', 'Deliver custom ROI report'],
    };
  }

  async generateCarePackage(id: string, riskFactors: string[], opportunities: string[]): Promise<{ customerId: string; actions: { priority: string; action: string; owner: string; dueDate: string }[]; messagingGuide: string }> {
    return {
      customerId: id,
      actions: [
        { priority: 'P1', action: 'Executive sponsor alignment call', owner: 'CSM + VP CS', dueDate: new Date(Date.now() + 3 * 86400000).toISOString() },
        { priority: 'P1', action: 'Custom adoption playbook delivery', owner: 'CSM', dueDate: new Date(Date.now() + 7 * 86400000).toISOString() },
        { priority: 'P2', action: 'Product team roadmap preview session', owner: 'Product + CSM', dueDate: new Date(Date.now() + 14 * 86400000).toISOString() },
      ],
      messagingGuide: `Focus on ROI realized to date. Acknowledge their ${riskFactors[0] ?? 'concerns'}. Lead with ${opportunities[0] ?? 'expansion opportunity'}.`,
    };
  }
}

export const cendiaGuardianService = new CendiaGuardianService();
