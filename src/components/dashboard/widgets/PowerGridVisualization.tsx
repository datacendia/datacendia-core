// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * POWER GRID VISUALIZATION - Energy Vertical
 * Real-time power generation, transmission, and consumption with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Zap, Sun, Wind, Droplets, Atom, Factory, Home, Building2, Bot } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface PowerSource {
  id: string;
  name: string;
  type: 'solar' | 'wind' | 'hydro' | 'nuclear' | 'gas' | 'coal';
  capacity: number;
  currentOutput: number;
  status: 'online' | 'ramping' | 'offline' | 'maintenance';
  emissions: number;
  agent: {
    name: string;
    status: 'optimizing' | 'monitoring' | 'alerting';
    action: string;
  };
}

interface GridZone {
  id: string;
  name: string;
  demand: number;
  supply: number;
  frequency: number;
  voltage: number;
  status: 'stable' | 'stressed' | 'critical';
}

interface Transmission {
  from: string;
  to: string;
  capacity: number;
  load: number;
  status: 'normal' | 'congested' | 'offline';
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const POWER_SOURCES: PowerSource[] = [
  { id: 'solar-1', name: 'Desert Solar Farm', type: 'solar', capacity: 500, currentOutput: 420, status: 'online', emissions: 0, agent: { name: 'SolarMind', status: 'optimizing', action: 'Tracking sun angle for max output' } },
  { id: 'solar-2', name: 'Valley Solar Array', type: 'solar', capacity: 300, currentOutput: 245, status: 'online', emissions: 0, agent: { name: 'PhotonAI', status: 'monitoring', action: 'Cloud coverage prediction' } },
  { id: 'wind-1', name: 'Coastal Wind Farm', type: 'wind', capacity: 400, currentOutput: 380, status: 'online', emissions: 0, agent: { name: 'WindFlow', status: 'optimizing', action: 'Adjusting blade pitch' } },
  { id: 'wind-2', name: 'Mountain Turbines', type: 'wind', capacity: 250, currentOutput: 180, status: 'ramping', emissions: 0, agent: { name: 'GaleForce', status: 'alerting', action: 'High wind warning - feathering blades' } },
  { id: 'hydro-1', name: 'River Dam Complex', type: 'hydro', capacity: 600, currentOutput: 520, status: 'online', emissions: 0, agent: { name: 'HydroCore', status: 'monitoring', action: 'Water level optimal' } },
  { id: 'nuclear-1', name: 'Northfield Nuclear', type: 'nuclear', capacity: 1200, currentOutput: 1150, status: 'online', emissions: 0, agent: { name: 'AtomWatch', status: 'monitoring', action: 'All systems nominal' } },
  { id: 'gas-1', name: 'Peaker Plant Alpha', type: 'gas', capacity: 400, currentOutput: 120, status: 'ramping', emissions: 45, agent: { name: 'FlexGen', status: 'optimizing', action: 'Ramping for evening peak' } },
  { id: 'gas-2', name: 'Combined Cycle Beta', type: 'gas', capacity: 800, currentOutput: 650, status: 'online', emissions: 38, agent: { name: 'CycleAI', status: 'monitoring', action: 'Efficiency at 62%' } },
];

const GRID_ZONES: GridZone[] = [
  { id: 'north', name: 'North Region', demand: 1200, supply: 1350, frequency: 60.02, voltage: 345, status: 'stable' },
  { id: 'south', name: 'South Region', demand: 1800, supply: 1750, frequency: 59.98, voltage: 343, status: 'stressed' },
  { id: 'east', name: 'East Region', demand: 900, supply: 920, frequency: 60.00, voltage: 345, status: 'stable' },
  { id: 'west', name: 'West Region', demand: 1100, supply: 1145, frequency: 60.01, voltage: 344, status: 'stable' },
];

const TRANSMISSIONS: Transmission[] = [
  { from: 'north', to: 'south', capacity: 500, load: 420, status: 'normal' },
  { from: 'east', to: 'south', capacity: 300, load: 285, status: 'congested' },
  { from: 'west', to: 'south', capacity: 400, load: 180, status: 'normal' },
  { from: 'north', to: 'west', capacity: 200, load: 85, status: 'normal' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const SourceIcon: React.FC<{ type: PowerSource['type'] }> = ({ type }) => {
  const icons = {
    solar: <Sun className="w-4 h-4 text-amber-400" />,
    wind: <Wind className="w-4 h-4 text-cyan-400" />,
    hydro: <Droplets className="w-4 h-4 text-blue-400" />,
    nuclear: <Atom className="w-4 h-4 text-violet-400" />,
    gas: <Factory className="w-4 h-4 text-orange-400" />,
    coal: <Factory className="w-4 h-4 text-gray-400" />,
  };
  return icons[type];
};

const PowerSourceCard: React.FC<{ source: PowerSource }> = ({ source }) => {
  const utilizationPct = (source.currentOutput / source.capacity) * 100;
  
  return (
    <div className={cn(
      'p-2 rounded-lg border',
      source.status === 'online' ? 'bg-emerald-900/10 border-emerald-500/30' :
      source.status === 'ramping' ? 'bg-amber-900/10 border-amber-500/30' :
      source.status === 'maintenance' ? 'bg-violet-900/10 border-violet-500/30' :
      'bg-gray-900/10 border-gray-500/30'
    )}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <SourceIcon type={source.type} />
          <span className="text-xs font-medium text-white truncate max-w-[100px]">{source.name}</span>
        </div>
        <span className={cn(
          'text-[10px] px-1 py-0.5 rounded',
          source.status === 'online' ? 'bg-emerald-900/50 text-emerald-400' :
          source.status === 'ramping' ? 'bg-amber-900/50 text-amber-400' :
          'bg-gray-900/50 text-gray-400'
        )}>
          {source.status}
        </span>
      </div>
      
      <div className="flex items-center gap-2 mb-1">
        <div className="flex-1 h-2 bg-sovereign-base rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all',
              utilizationPct >= 80 ? 'bg-emerald-500' :
              utilizationPct >= 50 ? 'bg-cyan-500' : 'bg-amber-500'
            )}
            style={{ width: `${utilizationPct}%` }}
          />
        </div>
        <span className="text-[10px] text-gray-400 w-12 text-right">
          {source.currentOutput}/{source.capacity}MW
        </span>
      </div>
      
      <div className="flex items-center gap-1 text-[9px]">
        <Bot className="w-3 h-3 text-cyan-400" />
        <span className={cn(
          source.agent.status === 'optimizing' ? 'text-cyan-400' :
          source.agent.status === 'alerting' ? 'text-amber-400' : 'text-gray-400'
        )}>
          {source.agent.name}: {source.agent.action}
        </span>
      </div>
    </div>
  );
};

const GridZoneCard: React.FC<{ zone: GridZone }> = ({ zone }) => {
  const balance = zone.supply - zone.demand;
  
  return (
    <div className={cn(
      'p-3 rounded-lg border',
      zone.status === 'stable' ? 'bg-emerald-900/10 border-emerald-500/30' :
      zone.status === 'stressed' ? 'bg-amber-900/10 border-amber-500/30' :
      'bg-red-900/10 border-red-500/30'
    )}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-white">{zone.name}</h4>
        <span className={cn(
          'text-xs px-1.5 py-0.5 rounded font-medium',
          zone.status === 'stable' ? 'bg-emerald-900/50 text-emerald-400' :
          zone.status === 'stressed' ? 'bg-amber-900/50 text-amber-400' :
          'bg-red-900/50 text-red-400'
        )}>
          {zone.status}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <Home className="w-3 h-3 text-amber-400" />
          <span className="text-gray-400">Demand:</span>
          <span className="text-white">{zone.demand}MW</span>
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-emerald-400" />
          <span className="text-gray-400">Supply:</span>
          <span className="text-white">{zone.supply}MW</span>
        </div>
      </div>
      
      <div className="mt-2 flex items-center justify-between text-[10px]">
        <span className={cn(
          balance >= 0 ? 'text-emerald-400' : 'text-red-400'
        )}>
          {balance >= 0 ? '+' : ''}{balance}MW reserve
        </span>
        <span className="text-gray-500">{zone.frequency.toFixed(2)}Hz • {zone.voltage}kV</span>
      </div>
    </div>
  );
};

const TransmissionLine: React.FC<{ transmission: Transmission }> = ({ transmission }) => {
  const loadPct = (transmission.load / transmission.capacity) * 100;
  
  return (
    <div className="flex items-center gap-2 p-2 bg-sovereign-elevated/30 rounded border border-sovereign-border-subtle">
      <span className="text-xs text-gray-400 w-16">{transmission.from}</span>
      <div className="flex-1 h-2 bg-sovereign-base rounded-full overflow-hidden relative">
        <div 
          className={cn(
            'h-full rounded-full transition-all',
            transmission.status === 'congested' ? 'bg-amber-500' :
            transmission.status === 'offline' ? 'bg-red-500' : 'bg-cyan-500'
          )}
          style={{ width: `${loadPct}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[8px] text-white font-medium">{transmission.load}MW</span>
        </div>
      </div>
      <span className="text-xs text-gray-400 w-16 text-right">{transmission.to}</span>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PowerGridVisualization: React.FC<{ className?: string }> = ({ className }) => {
  const [sources, setSources] = useState<PowerSource[]>(POWER_SOURCES);
  const [zones, setZones] = useState<GridZone[]>(GRID_ZONES);

  // Simulate power fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setSources(prev => prev.map((source): PowerSource => ({
        ...source,
        currentOutput: Math.max(0, Math.min(source.capacity, 
          source.currentOutput + (deterministicFloat('powergridvisualization-1') - 0.5) * source.capacity * 0.05
        )),
      })));

      setZones(prev => prev.map((zone): GridZone => ({
        ...zone,
        demand: zone.demand + (deterministicFloat('powergridvisualization-2') - 0.5) * 50,
        frequency: 59.95 + deterministicFloat('powergridvisualization-3') * 0.1,
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const _totalCapacity = sources.reduce((sum, s) => sum + s.capacity, 0); // Reserved for capacity planning
  const totalOutput = sources.reduce((sum, s) => sum + s.currentOutput, 0);
  const renewablePct = (sources.filter(s => ['solar', 'wind', 'hydro'].includes(s.type))
    .reduce((sum, s) => sum + s.currentOutput, 0) / totalOutput) * 100;
  const totalDemand = zones.reduce((sum, z) => sum + z.demand, 0);

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-sovereign-elevated/50 rounded-lg p-2 text-center border border-sovereign-border-subtle">
          <p className="text-lg font-bold text-white">{(totalOutput / 1000).toFixed(1)} GW</p>
          <p className="text-[10px] text-gray-400">Generation</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <p className="text-lg font-bold text-amber-400">{(totalDemand / 1000).toFixed(1)} GW</p>
          <p className="text-[10px] text-gray-400">Demand</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <p className="text-lg font-bold text-emerald-400">{renewablePct.toFixed(0)}%</p>
          <p className="text-[10px] text-gray-400">Renewable</p>
        </div>
        <div className={cn(
          'rounded-lg p-2 text-center border',
          totalOutput >= totalDemand ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'
        )}>
          <p className={cn('text-lg font-bold', totalOutput >= totalDemand ? 'text-emerald-400' : 'text-red-400')}>
            {totalOutput >= totalDemand ? '✓' : '⚠'}
          </p>
          <p className="text-[10px] text-gray-400">Grid Status</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 h-[calc(100%-80px)]">
        {/* Left - Power Sources */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Zap className="w-3 h-3" /> Generation Sources ({sources.length})
          </h3>
          <div className="space-y-2">
            {sources.map(source => (
              <PowerSourceCard key={source.id} source={source} />
            ))}
          </div>
        </div>

        {/* Right - Grid Zones & Transmission */}
        <div className="overflow-y-auto space-y-3">
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
              <Building2 className="w-3 h-3" /> Grid Zones
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {zones.map(zone => (
                <GridZoneCard key={zone.id} zone={zone} />
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-semibold text-gray-400 mb-2">Transmission Lines</h3>
            <div className="space-y-1">
              {TRANSMISSIONS.map((t, i) => (
                <TransmissionLine key={i} transmission={t} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live indicator */}
      <div className="absolute top-3 right-3 flex items-center gap-2 bg-sovereign-elevated/95 backdrop-blur-sm rounded-full px-3 py-1.5 border border-sovereign-border">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="text-xs text-gray-300">Live Grid</span>
      </div>
    </div>
  );
};

export default PowerGridVisualization;
