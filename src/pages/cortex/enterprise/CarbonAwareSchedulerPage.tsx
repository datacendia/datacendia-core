// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CARBON-AWARE AI SCHEDULER PAGE
// CendiaCarbonAware™ - Reduce Carbon Footprint of AI Operations
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import {
  Leaf,
  Cloud,
  Zap,
  TrendingDown,
  TrendingUp,
  Activity,
  BarChart3,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Calendar,
  DollarSign,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type WorkloadPriority = 'critical' | 'high' | 'normal' | 'low' | 'deferrable';
type WorkloadStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'deferred' | 'cancelled';

interface CarbonIntensity {
  region: string;
  intensity: number;
  forecast: Array<{ hour: number; intensity: number; confidence: number }>;
  source: string;
  timestamp: Date;
}

interface Workload {
  id: string;
  name: string;
  type: string;
  priority: WorkloadPriority;
  estimatedDurationMinutes: number;
  estimatedEnergyWh: number;
  preferredRegions: string[];
  maxDeferralHours: number;
  submittedAt: Date;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: WorkloadStatus;
  assignedRegion?: string;
  carbonEmitted?: number;
  carbonSaved?: number;
}

interface CarbonBudget {
  id: string;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  budgetKgCO2: number;
  usedKgCO2: number;
  remainingKgCO2: number;
  forecastKgCO2: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function CarbonAwareSchedulerPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [carbonIntensity, setCarbonIntensity] = useState<CarbonIntensity[]>([]);
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [budget, setBudget] = useState<CarbonBudget | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('us-east-1');
  const [workloadName, setWorkloadName] = useState('');
  const [workloadType, setWorkloadType] = useState('model-training');
  const [priority, setPriority] = useState<WorkloadPriority>('normal');
  const [estimatedDuration, setEstimatedDuration] = useState(60);
  const [estimatedEnergy, setEstimatedEnergy] = useState(1000);

  useEffect(() => {
    loadCarbonIntensity();
    loadWorkloads();
    loadBudget();
  }, []);

  const loadCarbonIntensity = async () => {
    try {
      const response = await api.get('/carbon-aware/intensity');
      setCarbonIntensity((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load carbon intensity, using demo data:', err);
      setCarbonIntensity([
        { region: 'us-east-1', intensity: 420, forecast: [{hour:0,intensity:400,confidence:0.9},{hour:6,intensity:350,confidence:0.85},{hour:12,intensity:480,confidence:0.8},{hour:18,intensity:390,confidence:0.75}], source: 'WattTime', timestamp: new Date() },
        { region: 'eu-west-1', intensity: 280, forecast: [{hour:0,intensity:260,confidence:0.9},{hour:6,intensity:220,confidence:0.85},{hour:12,intensity:310,confidence:0.8},{hour:18,intensity:250,confidence:0.75}], source: 'ElectricityMaps', timestamp: new Date() },
        { region: 'us-west-2', intensity: 190, forecast: [{hour:0,intensity:180,confidence:0.9},{hour:6,intensity:150,confidence:0.85},{hour:12,intensity:220,confidence:0.8},{hour:18,intensity:170,confidence:0.75}], source: 'WattTime', timestamp: new Date() },
      ]);
    }
  };

  const loadWorkloads = async () => {
    try {
      const response = await api.get('/carbon-aware/workloads');
      setWorkloads((response.data as any).data || []);
    } catch (err) {
      console.error('Failed to load workloads, using demo data:', err);
      setWorkloads([
        { id: 'wl-1', name: 'Quarterly Risk Model Training', type: 'model-training', priority: 'normal' as WorkloadPriority, estimatedDurationMinutes: 180, estimatedEnergyWh: 5400, preferredRegions: ['us-west-2'], maxDeferralHours: 12, submittedAt: new Date(Date.now()-3600000), status: 'scheduled' as WorkloadStatus, assignedRegion: 'us-west-2', carbonSaved: 1.2 },
        { id: 'wl-2', name: 'Council Deliberation Batch', type: 'inference', priority: 'high' as WorkloadPriority, estimatedDurationMinutes: 45, estimatedEnergyWh: 800, preferredRegions: ['us-east-1'], maxDeferralHours: 0, submittedAt: new Date(Date.now()-7200000), status: 'completed' as WorkloadStatus, assignedRegion: 'us-east-1', carbonEmitted: 0.34, carbonSaved: 0 },
        { id: 'wl-3', name: 'Document Translation Batch', type: 'inference', priority: 'deferrable' as WorkloadPriority, estimatedDurationMinutes: 90, estimatedEnergyWh: 2100, preferredRegions: ['eu-west-1','us-west-2'], maxDeferralHours: 24, submittedAt: new Date(), status: 'pending' as WorkloadStatus },
      ]);
    }
  };

  const loadBudget = async () => {
    try {
      const response = await api.get('/carbon-aware/budget/current');
      setBudget((response.data as any).data);
    } catch (err) {
      console.error('Failed to load budget, using demo data:', err);
      setBudget({ id: 'budget-q1', organizationId: 'datacendia', periodStart: new Date('2026-01-01'), periodEnd: new Date('2026-03-31'), budgetKgCO2: 500, usedKgCO2: 187, remainingKgCO2: 313, forecastKgCO2: 420, status: 'on_track' });
    }
  };

  const scheduleWorkload = async () => {
    if (!workloadName.trim()) {return;}

    setLoading(true);
    try {
      const response = await api.post('/carbon-aware/schedule', {
        name: workloadName,
        type: workloadType,
        priority,
        estimatedDurationMinutes: estimatedDuration,
        estimatedEnergyWh: estimatedEnergy,
        preferredRegions: [selectedRegion],
        maxDeferralHours: priority === 'deferrable' ? 24 : 0,
      });
      setWorkloads([...workloads, (response.data as any).data]);
      setWorkloadName('');
    } catch (err) {
      console.error('Failed to schedule workload:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity < 200) {return 'text-green-500';}
    if (intensity < 400) {return 'text-yellow-500';}
    if (intensity < 600) {return 'text-orange-500';}
    return 'text-red-500';
  };

  const getIntensityLabel = (intensity: number) => {
    if (intensity < 200) {return 'Very Low';}
    if (intensity < 400) {return 'Low';}
    if (intensity < 600) {return 'Moderate';}
    return 'High';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-500" />
            CendiaCarbonAware™
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Carbon-Aware AI Workload Scheduling
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="w-4 h-4" />
          <span>Enterprise Platinum</span>
        </div>
      </div>

      {/* Carbon Budget */}
      {budget && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Cloud className="w-5 h-5 text-green-600" />
              Carbon Budget
            </h2>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              budget.status === 'on_track' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
              budget.status === 'warning' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
              'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {budget.status === 'on_track' ? 'On Track' : budget.status === 'warning' ? 'Warning' : 'Exceeded'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Budget</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{budget.budgetKgCO2} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Used</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{budget.usedKgCO2.toFixed(1)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Remaining</div>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{budget.remainingKgCO2.toFixed(1)} kg</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Forecast</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{budget.forecastKgCO2.toFixed(1)} kg</div>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  budget.status === 'on_track' ? 'bg-green-500' :
                  budget.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min((budget.usedKgCO2 / budget.budgetKgCO2) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-Time Carbon Intensity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-green-500" />
            Real-Time Carbon Intensity
          </h2>
          <div className="space-y-3">
            {carbonIntensity.slice(0, 6).map((region) => (
              <div key={region.region} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{region.region}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{region.source}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getIntensityColor(region.intensity)}`}>
                    {region.intensity}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    gCO₂eq/kWh · {getIntensityLabel(region.intensity)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Schedule Workload */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-green-500" />
            Schedule Workload
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Workload Name
              </label>
              <input
                type="text"
                value={workloadName}
                onChange={(e) => setWorkloadName(e.target.value)}
                placeholder="e.g., GPT-4 Fine-tuning"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={workloadType}
                  onChange={(e) => setWorkloadType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="model-training">Model Training</option>
                  <option value="inference">Inference</option>
                  <option value="data-processing">Data Processing</option>
                  <option value="batch-analysis">Batch Analysis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as WorkloadPriority)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="normal">Normal</option>
                  <option value="low">Low</option>
                  <option value="deferrable">Deferrable</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration (min)
                </label>
                <input
                  type="number"
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Energy (Wh)
                </label>
                <input
                  type="number"
                  value={estimatedEnergy}
                  onChange={(e) => setEstimatedEnergy(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Preferred Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="us-east-1">US East (Virginia)</option>
                <option value="us-west-2">US West (Oregon)</option>
                <option value="eu-west-1">EU West (Ireland)</option>
                <option value="eu-central-1">EU Central (Frankfurt)</option>
                <option value="ap-southeast-1">Asia Pacific (Singapore)</option>
              </select>
            </div>

            <button
              onClick={scheduleWorkload}
              disabled={loading || !workloadName.trim()}
              className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  Schedule Workload
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Workloads */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-500" />
          Active Workloads ({workloads.length})
        </h2>

        {workloads.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Cloud className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No workloads scheduled yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workloads.map((workload) => (
              <div
                key={workload.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-green-300 dark:hover:border-green-600 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="font-medium text-gray-900 dark:text-white">{workload.name}</div>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                      {workload.type}
                    </span>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      workload.status === 'completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                      workload.status === 'running' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                      workload.status === 'deferred' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                      'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                      {workload.status}
                    </span>
                  </div>
                  {workload.carbonSaved && workload.carbonSaved > 0 && (
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                      <TrendingDown className="w-4 h-4" />
                      <span className="font-medium">{workload.carbonSaved.toFixed(2)} kg CO₂ saved</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {workload.estimatedDurationMinutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {workload.estimatedEnergyWh} Wh
                  </span>
                  {workload.assignedRegion && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {workload.assignedRegion}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
