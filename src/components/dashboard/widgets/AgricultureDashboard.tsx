// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * AGRICULTURE DASHBOARD - Agriculture Vertical
 * Crop monitoring, yield optimization, and farm management with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Wheat, Droplets, Sun, Cloud, Bot, MapPin, Thermometer } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface Field {
  id: string;
  name: string;
  crop: string;
  acres: number;
  health: 'excellent' | 'good' | 'fair' | 'poor';
  moisture: number;
  growthStage: string;
  yieldForecast: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'analyzing' | 'alert';
  action: string;
}

interface WeatherData {
  condition: string;
  temp: number;
  humidity: number;
  precipitation: number;
  forecast: string;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const FIELDS: Field[] = [
  { id: 'f1', name: 'North 40', crop: 'Corn', acres: 320, health: 'excellent', moisture: 78, growthStage: 'V12', yieldForecast: 195 },
  { id: 'f2', name: 'South Fields', crop: 'Soybeans', acres: 280, health: 'good', moisture: 65, growthStage: 'R3', yieldForecast: 52 },
  { id: 'f3', name: 'River Bottom', crop: 'Corn', acres: 180, health: 'fair', moisture: 45, growthStage: 'V10', yieldForecast: 172 },
  { id: 'f4', name: 'Hill Section', crop: 'Wheat', acres: 240, health: 'excellent', moisture: 58, growthStage: 'Heading', yieldForecast: 68 },
  { id: 'f5', name: 'East Quarters', crop: 'Soybeans', acres: 160, health: 'poor', moisture: 32, growthStage: 'R2', yieldForecast: 38 },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'crop', name: 'CropDoctor', role: 'Crop Health AI', status: 'active', action: 'Analyzing satellite imagery for pest detection' },
  { id: 'irr', name: 'IrrigationOptimizer', role: 'Water Management', status: 'alert', action: 'East Quarters needs irrigation - 32% moisture' },
  { id: 'yield', name: 'YieldPredictor', role: 'Harvest Forecasting', status: 'analyzing', action: 'Updating yield models with weather data' },
  { id: 'soil', name: 'SoilAnalyst', role: 'Soil Health AI', status: 'active', action: 'Recommending nitrogen application for North 40' },
];

const WEATHER: WeatherData = {
  condition: 'Partly Cloudy',
  temp: 78,
  humidity: 62,
  precipitation: 0.2,
  forecast: 'Rain expected in 3 days',
};

// =============================================================================
// COMPONENTS
// =============================================================================

const FieldCard: React.FC<{ field: Field }> = ({ field }) => {
  const healthColors = {
    excellent: 'bg-emerald-900/20 border-emerald-500/40 text-emerald-400',
    good: 'bg-cyan-900/20 border-cyan-500/40 text-cyan-400',
    fair: 'bg-amber-900/20 border-amber-500/40 text-amber-400',
    poor: 'bg-red-900/20 border-red-500/40 text-red-400',
  };

  return (
    <div className={cn('p-2 rounded-lg border', healthColors[field.health].split(' ').slice(0, 2).join(' '))}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Wheat className="w-3 h-3 text-amber-400" />
          <span className="text-xs font-medium text-white">{field.name}</span>
        </div>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded capitalize', healthColors[field.health].split(' ').slice(2).join(' '), 'bg-opacity-50')}>
          {field.health}
        </span>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-1">{field.crop} • {field.acres} acres • {field.growthStage}</p>
      
      <div className="grid grid-cols-3 gap-1 text-[10px]">
        <div>
          <p className="text-gray-500">Moisture</p>
          <p className={cn('font-medium', field.moisture < 40 ? 'text-red-400' : field.moisture < 60 ? 'text-amber-400' : 'text-emerald-400')}>
            {field.moisture}%
          </p>
        </div>
        <div>
          <p className="text-gray-500">Yield Est.</p>
          <p className="text-white font-medium">{field.yieldForecast} bu</p>
        </div>
        <div>
          <p className="text-gray-500">Stage</p>
          <p className="text-cyan-400 font-medium">{field.growthStage}</p>
        </div>
      </div>
    </div>
  );
};

const WeatherCard: React.FC<{ weather: WeatherData }> = ({ weather }) => (
  <div className="p-3 bg-gradient-to-br from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/30">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Cloud className="w-6 h-6 text-cyan-400" />
        <div>
          <p className="text-sm font-medium text-white">{weather.condition}</p>
          <p className="text-[10px] text-gray-400">{weather.forecast}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-white">{weather.temp}°F</p>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-2 text-[10px]">
      <div className="flex items-center gap-1">
        <Thermometer className="w-3 h-3 text-amber-400" />
        <span className="text-gray-400">Temp: {weather.temp}°F</span>
      </div>
      <div className="flex items-center gap-1">
        <Droplets className="w-3 h-3 text-cyan-400" />
        <span className="text-gray-400">Humidity: {weather.humidity}%</span>
      </div>
      <div className="flex items-center gap-1">
        <Cloud className="w-3 h-3 text-blue-400" />
        <span className="text-gray-400">Rain: {weather.precipitation}"</span>
      </div>
    </div>
  </div>
);

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'analyzing' ? 'bg-cyan-900/50 text-cyan-400' :
        'bg-amber-900/50 text-amber-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full animate-pulse',
        agent.status === 'active' ? 'bg-emerald-500' :
        agent.status === 'analyzing' ? 'bg-cyan-500' : 'bg-amber-500'
      )} />
    </div>
    <p className="text-[10px] text-cyan-400">🌾 {agent.action}</p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AgricultureDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [fields, setFields] = useState<Field[]>(FIELDS);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      setFields(prev => prev.map((f): Field => ({
        ...f,
        moisture: Math.max(20, Math.min(90, f.moisture + Math.floor((deterministicFloat('agriculture-1') - 0.5) * 5))),
      })));

      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        status: deterministicFloat('agriculture-2') > 0.8 ? 'analyzing' : 'active',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const totalAcres = fields.reduce((sum, f) => sum + f.acres, 0);
  const avgMoisture = fields.reduce((sum, f) => sum + f.moisture, 0) / fields.length;
  const avgYield = fields.reduce((sum, f) => sum + f.yieldForecast, 0) / fields.length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <MapPin className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{totalAcres.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">Total Acres</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Droplets className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgMoisture.toFixed(0)}%</p>
          <p className="text-[10px] text-gray-400">Avg Moisture</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <Wheat className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgYield.toFixed(0)} bu</p>
          <p className="text-[10px] text-gray-400">Avg Yield Est.</p>
        </div>
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <Sun className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{WEATHER.temp}°F</p>
          <p className="text-[10px] text-gray-400">Temperature</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 h-[calc(100%-80px)]">
        {/* Left - Fields & Weather */}
        <div className="overflow-y-auto space-y-3">
          <WeatherCard weather={WEATHER} />
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Wheat className="w-3 h-3" /> Fields ({fields.length})
            </h3>
            <div className="space-y-2">
              {fields.map(field => (
                <FieldCard key={field.id} field={field} />
              ))}
            </div>
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Farm Agents
          </h3>
          <div className="space-y-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live Monitoring</span>
      </div>
    </div>
  );
};

export default AgricultureDashboard;
