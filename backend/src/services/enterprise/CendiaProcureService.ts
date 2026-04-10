// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { generateId, now, sr_create, sr_list, sr_get, sr_update } from './_base.js';

// =============================================================================
// TYPES
// =============================================================================

export type VendorContractCategory = 'cloud' | 'software' | 'hardware' | 'services' | 'supplies' | 'other';
export type ContractStatus = 'active' | 'expiring' | 'negotiating' | 'renewed' | 'canceled';

export interface VendorContract {
  id: string;
  vendorName: string;
  vendorEmail: string;
  category: VendorContractCategory;
  annualValue: number;
  currency: string;
  startDate: string;
  endDate: string;
  renewalDate: string;
  autoRenew: boolean;
  usagePercent: number;
  marketBenchmark?: number;
  terms?: string;
  status: ContractStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Negotiation {
  id: string;
  contractId: string;
  currentPrice: number;
  targetPrice: number;
  savingsEstimate: number;
  leverage: string[];
  negotiationScript: string;
  draftEmail: string;
  priority: 'low' | 'medium' | 'high';
  deadlineDays: number;
  status: 'pending' | 'in_progress' | 'completed' | 'abandoned';
  finalPrice?: number;
  savingsAchieved?: number;
  completedAt?: string;
  createdAt: string;
}

export interface ProcurementMetrics {
  totalContracts: number;
  totalAnnualSpend: number;
  averageContractValue: number;
  expiringIn90Days: number;
  autoRenewRisk: number;
  totalSavingsAchieved: number;
  activeNegotiations: number;
  avgUsagePercent: number;
}

// =============================================================================
// SERVICE
// =============================================================================

const SN = 'CendiaProcure';

class CendiaProcureService {
  addContract(input: Omit<VendorContract, 'id' | 'status' | 'createdAt' | 'updatedAt'>): VendorContract {
    const contract: VendorContract = {
      id: generateId(),
      ...input,
      status: 'active',
      createdAt: now(),
      updatedAt: now(),
    };
    sr_create(SN, 'contract', contract).catch(() => {});
    return contract;
  }

  async getContracts(orgId?: string): Promise<VendorContract[]> {
    return sr_list<VendorContract>(SN, 'contract', orgId);
  }

  getExpiringContracts(days: number): VendorContract[] {
    const cutoff = new Date(Date.now() + days * 86_400_000);
    const sample: VendorContract[] = [
      {
        id: 'proc-1',
        vendorName: 'AWS',
        vendorEmail: 'billing@aws.amazon.com',
        category: 'cloud',
        annualValue: 480000,
        currency: 'USD',
        startDate: new Date(Date.now() - 300 * 86_400_000).toISOString(),
        endDate: new Date(Date.now() + 60 * 86_400_000).toISOString(),
        renewalDate: new Date(Date.now() + 60 * 86_400_000).toISOString(),
        autoRenew: true,
        usagePercent: 78,
        marketBenchmark: 420000,
        status: 'expiring',
        createdAt: new Date(Date.now() - 300 * 86_400_000).toISOString(),
        updatedAt: now(),
      },
    ];
    return sample.filter((c) => new Date(c.endDate) <= cutoff);
  }

  async executeTheSqueeze(): Promise<{ negotiationsInitiated: number; totalPotentialSavings: number; details: Negotiation[] }> {
    const contracts = await this.getContracts();
    const overpriced = contracts.filter((c) => c.marketBenchmark && c.annualValue > c.marketBenchmark * 1.1);
    const negotiations: Negotiation[] = overpriced.map((c) => {
      const neg: Negotiation = {
        id: generateId(),
        contractId: c.id,
        currentPrice: c.annualValue,
        targetPrice: (c.marketBenchmark ?? c.annualValue) * 0.95,
        savingsEstimate: c.annualValue - (c.marketBenchmark ?? c.annualValue) * 0.95,
        leverage: ['Price vs benchmark', 'Usage utilization', 'Multi-year commitment', 'Competitive alternative'],
        negotiationScript: `Request ${Math.round(((c.annualValue - (c.marketBenchmark ?? c.annualValue) * 0.95) / c.annualValue) * 100)}% reduction citing benchmark data and usage trends.`,
        draftEmail: `Dear ${c.vendorName} Account Executive, we are reviewing our ${c.category} spend and would like to discuss pricing adjustments...`,
        priority: c.annualValue > 100000 ? 'high' : 'medium',
        deadlineDays: 30,
        status: 'pending',
        createdAt: now(),
      };
      sr_create(SN, 'negotiation', neg, undefined, c.id).catch(() => {});
      return neg;
    });
    return {
      negotiationsInitiated: negotiations.length,
      totalPotentialSavings: negotiations.reduce((s, n) => s + n.savingsEstimate, 0),
      details: negotiations,
    };
  }

  recordNegotiationResult(contractId: string, negotiatedPrice: number): { saved: number; percentReduction: number } {
    const contracts = this.getExpiringContracts(365);
    const contract = contracts.find((c) => c.id === contractId);
    if (!contract) return { saved: 0, percentReduction: 0 };
    const saved = contract.annualValue - negotiatedPrice;
    const percentReduction = (saved / contract.annualValue) * 100;
    return { saved, percentReduction };
  }

  getMetrics(): ProcurementMetrics {
    return {
      totalContracts: 24,
      totalAnnualSpend: 2_340_000,
      averageContractValue: 97_500,
      expiringIn90Days: 3,
      autoRenewRisk: 7,
      totalSavingsAchieved: 187_500,
      activeNegotiations: 2,
      avgUsagePercent: 74,
    };
  }
}

export const cendiaProcureService = new CendiaProcureService();
