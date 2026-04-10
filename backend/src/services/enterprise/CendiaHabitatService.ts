// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create, sr_list, sr_get, sr_update } from './_base.js';

export interface WorkspaceZone {
  id: string;
  name: string;
  type: 'office' | 'lab' | 'warehouse' | 'data_center' | 'co_working' | 'remote';
  location: string;
  sqft: number;
  capacity: number;
  currentOccupancy: number;
  monthlyCost: number;
  utilizationRate: number;
  sensors: ZoneSensors;
  bioSyncActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ZoneSensors {
  temperature?: number;
  humidity?: number;
  co2?: number;
  noiseDb?: number;
  lightLux?: number;
  occupancy?: number;
  airQualityIndex?: number;
}

const SN = 'CendiaHabitat';
const zones = new Map<string, WorkspaceZone>();

class CendiaHabitatService {
  registerZone(input: Partial<WorkspaceZone>): WorkspaceZone {
    const zone: WorkspaceZone = {
      id: generateId(), name: input.name || 'New Zone', type: input.type || 'office',
      location: input.location || 'HQ', sqft: input.sqft || 2500, capacity: input.capacity || 50,
      currentOccupancy: 0, monthlyCost: input.monthlyCost || 15000,
      utilizationRate: 0, sensors: {}, bioSyncActive: false, createdAt: now(), updatedAt: now(),
    };
    zones.set(zone.id, zone);
    sr_create(SN, 'zone', zone).catch(() => {});
    return zone;
  }

  getAllZones(): WorkspaceZone[] {
    if (zones.size === 0) {
      const defaults: WorkspaceZone[] = [
        { id: 'zone-1', name: 'Engineering Floor 3', type: 'office', location: 'HQ, San Francisco', sqft: 8500, capacity: 120, currentOccupancy: 87, monthlyCost: 42000, utilizationRate: 72, sensors: { temperature: 72, humidity: 45, co2: 620, noiseDb: 48, lightLux: 500, occupancy: 87, airQualityIndex: 88 }, bioSyncActive: true, createdAt: now(), updatedAt: now() },
        { id: 'zone-2', name: 'Executive Suite', type: 'office', location: 'HQ, San Francisco', sqft: 3200, capacity: 25, currentOccupancy: 12, monthlyCost: 28000, utilizationRate: 48, sensors: { temperature: 70, humidity: 42, co2: 580, noiseDb: 35 }, bioSyncActive: false, createdAt: now(), updatedAt: now() },
        { id: 'zone-3', name: 'Innovation Lab', type: 'lab', location: 'HQ, San Francisco', sqft: 5000, capacity: 40, currentOccupancy: 31, monthlyCost: 35000, utilizationRate: 78, sensors: { temperature: 68, humidity: 50, co2: 700 }, bioSyncActive: true, createdAt: now(), updatedAt: now() },
      ];
      defaults.forEach((z) => zones.set(z.id, z));
    }
    return Array.from(zones.values());
  }

  async activateBioSync(zoneId: string, teamId: string, stressLevel: number): Promise<{ recommendation: string; adjustments: Record<string, any>; estimatedProductivityGain: number }> {
    const zone = zones.get(zoneId);
    const adjustments: Record<string, any> = {};
    if (stressLevel > 70) { adjustments.temperature = 68; adjustments.lightLux = 350; adjustments.noiseDb = 40; }
    else if (stressLevel > 40) { adjustments.temperature = 70; adjustments.lightLux = 450; }
    else { adjustments.temperature = 72; adjustments.lightLux = 600; }
    if (zone) { zone.bioSyncActive = true; zones.set(zoneId, zone); }
    return {
      recommendation: stressLevel > 70 ? 'Reduce sensory load — lower lights, cool temperature, minimize noise' : 'Optimize for focus — increase light, steady temperature',
      adjustments,
      estimatedProductivityGain: Math.round(8 + (100 - stressLevel) * 0.15),
    };
  }

  updateSensors(zoneId: string, sensorData: ZoneSensors): WorkspaceZone | undefined {
    const zone = zones.get(zoneId);
    if (!zone) return undefined;
    zone.sensors = { ...zone.sensors, ...sensorData };
    zone.updatedAt = now();
    if (sensorData.occupancy !== undefined) {
      zone.currentOccupancy = sensorData.occupancy;
      zone.utilizationRate = Math.round((sensorData.occupancy / zone.capacity) * 100);
    }
    zones.set(zoneId, zone);
    sr_update(SN, 'zone', zoneId, zone).catch(() => {});
    return zone;
  }

  async optimizeRealEstate(): Promise<{ currentSpend: number; optimizedSpend: number; annualSavings: number; recommendations: string[] }> {
    const allZones = this.getAllZones();
    const totalSpend = allZones.reduce((s, z) => s + z.monthlyCost * 12, 0);
    const underutilized = allZones.filter((z) => z.utilizationRate < 50);
    return {
      currentSpend: totalSpend,
      optimizedSpend: Math.round(totalSpend * 0.78),
      annualSavings: Math.round(totalSpend * 0.22),
      recommendations: [
        ...underutilized.map((z) => `Consolidate ${z.name} (${z.utilizationRate}% utilization) — sublease or repurpose`),
        'Implement hot-desking for 30% of non-assigned seats',
        'Negotiate flex lease for remote-first expansion zones',
        'Convert 2 conference rooms to focus pods — demand 3x supply',
      ],
    };
  }
}

export const cendiaHabitatService = new CendiaHabitatService();
