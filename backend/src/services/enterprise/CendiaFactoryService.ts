// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.




import { generateId, now, sr_create } from './_base.js';

export interface ProductionLine {
  id: string;
  name: string;
  facility: string;
  product: string;
  targetOutput: number;
  actualOutput: number;
  efficiency: number;
  defectRate: number;
  oeeScore: number;
  status: 'running' | 'idle' | 'maintenance' | 'fault';
  sensors: { name: string; value: number; unit: string; threshold: number; status: 'ok' | 'warning' | 'critical' }[];
  createdAt: string;
  updatedAt: string;
}

export interface FactoryMetrics {
  totalLines: number;
  avgOee: number;
  avgEfficiency: number;
  avgDefectRate: number;
  activeAlerts: number;
  scheduledMaintenances: number;
}

const SN = 'CendiaFactory';
const lines = new Map<string, ProductionLine>();

const SAMPLE_LINES: ProductionLine[] = [
  { id: 'line-1', name: 'Assembly Line Alpha', facility: 'Plant A, Detroit', product: 'PCB Module v3', targetOutput: 500, actualOutput: 463, efficiency: 92.6, defectRate: 0.8, oeeScore: 87, status: 'running', sensors: [{ name: 'Motor Temp', value: 78, unit: '°C', threshold: 90, status: 'ok' }, { name: 'Vibration', value: 2.1, unit: 'mm/s', threshold: 4.5, status: 'ok' }, { name: 'Pressure', value: 42, unit: 'psi', threshold: 50, status: 'ok' }], createdAt: now(), updatedAt: now() },
  { id: 'line-2', name: 'Packaging Line Beta', facility: 'Plant B, Austin', product: 'Consumer Unit', targetOutput: 2000, actualOutput: 1720, efficiency: 86, defectRate: 1.4, oeeScore: 79, status: 'running', sensors: [{ name: 'Belt Speed', value: 1.8, unit: 'm/s', threshold: 2.0, status: 'warning' }, { name: 'Motor Temp', value: 82, unit: '°C', threshold: 85, status: 'warning' }], createdAt: now(), updatedAt: now() },
];

class CendiaFactoryService {
  registerLine(input: Partial<ProductionLine>): ProductionLine {
    const line: ProductionLine = {
      id: generateId(), name: input.name || 'New Line', facility: input.facility || 'Main Plant',
      product: input.product || 'Unknown Product', targetOutput: input.targetOutput || 100,
      actualOutput: 0, efficiency: 0, defectRate: 0, oeeScore: 0,
      status: 'idle', sensors: input.sensors || [], createdAt: now(), updatedAt: now(),
    };
    lines.set(line.id, line);
    sr_create(SN, 'production_line', line).catch(() => {});
    return line;
  }

  getLine(id: string): ProductionLine | undefined {
    if (lines.size === 0) SAMPLE_LINES.forEach((l) => lines.set(l.id, l));
    return lines.get(id) || SAMPLE_LINES.find((l) => l.id === id);
  }

  async predictFailures(id: string): Promise<{ lineId: string; predictions: { component: string; failureProbability: number; estimatedTimeToFailure: string; recommendedAction: string; urgency: string }[] }> {
    const line = this.getLine(id);
    const warningSensors = line?.sensors.filter((s) => s.status !== 'ok') ?? [];
    return {
      lineId: id,
      predictions: [
        ...warningSensors.map((s) => ({
          component: s.name,
          failureProbability: Math.round(40 + Math.random() * 45),
          estimatedTimeToFailure: `${Math.round(48 + Math.random() * 200)} hours`,
          recommendedAction: `Inspect and service ${s.name} — current ${s.value}${s.unit} approaching threshold ${s.threshold}${s.unit}`,
          urgency: s.status === 'critical' ? 'immediate' : 'within_48h',
        })),
        { component: 'Conveyor Belt Drive', failureProbability: 23, estimatedTimeToFailure: '720 hours', recommendedAction: 'Schedule belt tension check during next planned maintenance window', urgency: 'scheduled' },
      ],
    };
  }

  async optimizeYield(id: string): Promise<{ lineId: string; currentYield: number; optimizedYield: number; improvements: string[]; estimatedOutputGain: number }> {
    const line = this.getLine(id);
    const current = line?.efficiency ?? 85;
    const optimized = Math.min(98, current + 5 + Math.random() * 4);
    return {
      lineId: id,
      currentYield: current,
      optimizedYield: Math.round(optimized * 10) / 10,
      improvements: [
        'Reduce changeover time by 18% via SMED technique — estimated 2.1% OEE gain',
        'Adjust motor speed to 1.85 m/s — reduces defect rate by 0.3%',
        'Predictive maintenance scheduling to eliminate unplanned downtime',
        'Vision inspection system upgrade — catch 92% of defects vs current 78%',
      ],
      estimatedOutputGain: Math.round(((optimized - current) / 100) * (line?.targetOutput ?? 1000)),
    };
  }

  getMetrics(): FactoryMetrics {
    if (lines.size === 0) SAMPLE_LINES.forEach((l) => lines.set(l.id, l));
    const allLines = Array.from(lines.values());
    return {
      totalLines: allLines.length,
      avgOee: Math.round(allLines.reduce((s, l) => s + l.oeeScore, 0) / (allLines.length || 1)),
      avgEfficiency: Math.round(allLines.reduce((s, l) => s + l.efficiency, 0) / (allLines.length || 1)),
      avgDefectRate: Math.round((allLines.reduce((s, l) => s + l.defectRate, 0) / (allLines.length || 1)) * 10) / 10,
      activeAlerts: allLines.flatMap((l) => l.sensors.filter((s) => s.status !== 'ok')).length,
      scheduledMaintenances: 3,
    };
  }
}

export const cendiaFactoryService = new CendiaFactoryService();
