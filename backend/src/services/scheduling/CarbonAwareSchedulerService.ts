// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'node:crypto';

export type WorkloadStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'deferred';
export type WorkloadPriority = 'critical' | 'high' | 'normal' | 'low' | 'deferrable';

interface CarbonIntensity {
  region: string;
  gCO2perKWh: number;
  forecast: 'decreasing' | 'stable' | 'increasing';
  optimalWindowStart?: string;
  updatedAt: string;
}

interface Workload {
  id: string;
  name: string;
  type: string;
  priority: WorkloadPriority;
  status: WorkloadStatus;
  estimatedDurationMinutes: number;
  estimatedEnergyWh: number;
  preferredRegions?: string[];
  maxDeferralHours?: number;
  scheduledRegion?: string;
  scheduledAt?: string;
  carbonSavedGrams?: number;
  createdAt: string;
}

const REGION_INTENSITIES: Record<string, number> = {
  'us-west-2': 120, 'us-east-1': 380, 'eu-west-1': 200, 'eu-north-1': 30,
  'ap-southeast-1': 450, 'ca-central-1': 25, 'eu-central-1': 310, 'ap-northeast-1': 470,
};

class CarbonAwareSchedulerServiceImpl {
  private workloads = new Map<string, Workload>();

  async getCarbonIntensity(region: string): Promise<CarbonIntensity> {
    const intensity = REGION_INTENSITIES[region] ?? 250;
    return { region, gCO2perKWh: intensity, forecast: intensity < 100 ? 'decreasing' : intensity > 350 ? 'increasing' : 'stable', updatedAt: new Date().toISOString() };
  }

  async getAllRegionIntensities(): Promise<CarbonIntensity[]> {
    return Promise.all(Object.keys(REGION_INTENSITIES).map(r => this.getCarbonIntensity(r)));
  }

  async submitWorkload(params: { name: string; type: string; priority: WorkloadPriority; estimatedDurationMinutes: number; estimatedEnergyWh: number; preferredRegions?: string[]; maxDeferralHours?: number }): Promise<Workload> {
    const workload: Workload = { id: crypto.randomUUID(), ...params, status: 'pending', createdAt: new Date().toISOString() };
    this.workloads.set(workload.id, workload);
    return workload;
  }

  listWorkloads(status?: WorkloadStatus): Workload[] {
    const all = [...this.workloads.values()];
    return status ? all.filter(w => w.status === status) : all;
  }

  getWorkload(id: string): Workload | undefined { return this.workloads.get(id); }

  async scheduleWorkload(id: string) {
    const workload = this.workloads.get(id);
    if (!workload) throw new Error('Workload not found');
    const regions = workload.preferredRegions?.length ? workload.preferredRegions : Object.keys(REGION_INTENSITIES);
    const best = regions.reduce((a, b) => (REGION_INTENSITIES[a] ?? 999) < (REGION_INTENSITIES[b] ?? 999) ? a : b);
    const baseIntensity = REGION_INTENSITIES[regions[0] ?? 'us-east-1'] ?? 380;
    const optimalIntensity = REGION_INTENSITIES[best] ?? 250;
    workload.scheduledRegion = best;
    workload.status = 'scheduled';
    workload.scheduledAt = new Date().toISOString();
    workload.carbonSavedGrams = Math.round((baseIntensity - optimalIntensity) * workload.estimatedEnergyWh / 1000);
    return { workloadId: id, scheduledRegion: best, intensity: optimalIntensity, carbonSavedGrams: workload.carbonSavedGrams, scheduledAt: workload.scheduledAt };
  }

  async executeWorkload(id: string): Promise<Workload> {
    const workload = this.workloads.get(id);
    if (!workload) throw new Error('Workload not found');
    workload.status = 'completed';
    return workload;
  }

  async getCarbonBudget(orgId: string) {
    return { organizationId: orgId, monthlyBudgetKg: 500, usedKg: 142, remainingKg: 358, utilizationPercent: 28.4, period: new Date().toISOString().slice(0, 7) };
  }

  async generateReport(orgId: string) {
    const workloads = [...this.workloads.values()];
    const totalSaved = workloads.reduce((s, w) => s + (w.carbonSavedGrams ?? 0), 0);
    return { organizationId: orgId, generatedAt: new Date().toISOString(), totalWorkloads: workloads.length, completedWorkloads: workloads.filter(w => w.status === 'completed').length, totalCarbonSavedGrams: totalSaved, regionsUsed: [...new Set(workloads.map(w => w.scheduledRegion).filter(Boolean))] };
  }
}

export const carbonAwareSchedulerService = new CarbonAwareSchedulerServiceImpl();
