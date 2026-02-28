// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CIVIC SIMULATION - Government Vertical
 * Hierarchical simulation of towns, districts, cities, and countries
 * with AI agents managing each level
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Bot, Users, Building, MapPin, Globe, AlertTriangle } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'processing' | 'idle';
  lastAction: string;
  decisionsToday: number;
}

interface CivicEntity {
  id: string;
  name: string;
  type: 'country' | 'state' | 'city' | 'district' | 'town';
  population: number;
  budget: number;
  satisfaction: number;
  issues: number;
  agents: AIAgent[];
  children?: CivicEntity[];
  metrics: {
    safety: number;
    education: number;
    infrastructure: number;
    economy: number;
    environment: number;
  };
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const generateAgents = (level: CivicEntity['type']): AIAgent[] => {
  const agentConfigs: Record<string, { names: string[]; roles: string[] }> = {
    country: {
      names: ['Atlas', 'Sovereign', 'Nexus'],
      roles: ['National Policy Coordinator', 'Federal Budget Optimizer', 'Interstate Relations'],
    },
    state: {
      names: ['Governor-AI', 'StateWatch', 'RegionMind'],
      roles: ['State Resource Allocator', 'Regional Development', 'State Compliance'],
    },
    city: {
      names: ['CityCore', 'UrbanFlow', 'MetroMind'],
      roles: ['Urban Planning AI', 'Traffic Optimization', 'Emergency Response'],
    },
    district: {
      names: ['DistrictBot', 'LocalGov', 'AreaWatch'],
      roles: ['District Services', 'Community Liaison', 'Local Budget'],
    },
    town: {
      names: ['TownHelper', 'CivicBot', 'LocalAI'],
      roles: ['Municipal Services', 'Citizen Support', 'Town Planning'],
    },
  };

  const config = agentConfigs[level];
  if (!config) {return [];}
  return config.names.map((name, i): AIAgent => {
    const actions = [
      'Analyzing citizen feedback',
      'Optimizing resource allocation',
      'Processing permit request',
      'Reviewing budget proposal',
      'Monitoring service levels',
      'Coordinating with other agents',
    ];
    const statusRand = deterministicFloat('civicsimulation-8');
    return {
      id: `${level}-agent-${i}`,
      name,
      role: config.roles[i] || 'Agent',
      status: statusRand > 0.3 ? 'active' : statusRand > 0.15 ? 'processing' : 'idle',
      lastAction: actions[Math.floor(deterministicFloat('civicsimulation-9') * actions.length)] || 'Processing',
      decisionsToday: deterministicInt(0, 49, 'civicsimulation-1') + 10,
    };
  });
};

const generateMetrics = () => ({
  safety: 70 + deterministicFloat('civicsimulation-3') * 25,
  education: 65 + deterministicFloat('civicsimulation-4') * 30,
  infrastructure: 60 + deterministicFloat('civicsimulation-5') * 35,
  economy: 55 + deterministicFloat('civicsimulation-6') * 40,
  environment: 50 + deterministicFloat('civicsimulation-7') * 45,
});

const SAMPLE_HIERARCHY: CivicEntity = {
  id: 'usa',
  name: 'United States',
  type: 'country',
  population: 331000000,
  budget: 6200000000000,
  satisfaction: 72,
  issues: 1247,
  agents: generateAgents('country'),
  metrics: generateMetrics(),
  children: [
    {
      id: 'ca',
      name: 'California',
      type: 'state',
      population: 39500000,
      budget: 300000000000,
      satisfaction: 68,
      issues: 342,
      agents: generateAgents('state'),
      metrics: generateMetrics(),
      children: [
        {
          id: 'sf',
          name: 'San Francisco',
          type: 'city',
          population: 870000,
          budget: 14000000000,
          satisfaction: 65,
          issues: 89,
          agents: generateAgents('city'),
          metrics: generateMetrics(),
          children: [
            { id: 'mission', name: 'Mission District', type: 'district', population: 45000, budget: 120000000, satisfaction: 71, issues: 12, agents: generateAgents('district'), metrics: generateMetrics() },
            { id: 'soma', name: 'SoMa', type: 'district', population: 38000, budget: 95000000, satisfaction: 68, issues: 18, agents: generateAgents('district'), metrics: generateMetrics() },
            { id: 'castro', name: 'Castro', type: 'district', population: 22000, budget: 65000000, satisfaction: 78, issues: 6, agents: generateAgents('district'), metrics: generateMetrics() },
          ],
        },
        {
          id: 'la',
          name: 'Los Angeles',
          type: 'city',
          population: 3970000,
          budget: 12800000000,
          satisfaction: 62,
          issues: 156,
          agents: generateAgents('city'),
          metrics: generateMetrics(),
          children: [
            { id: 'hollywood', name: 'Hollywood', type: 'district', population: 87000, budget: 180000000, satisfaction: 64, issues: 24, agents: generateAgents('district'), metrics: generateMetrics() },
            { id: 'dtla', name: 'Downtown LA', type: 'district', population: 72000, budget: 220000000, satisfaction: 59, issues: 31, agents: generateAgents('district'), metrics: generateMetrics() },
          ],
        },
      ],
    },
    {
      id: 'tx',
      name: 'Texas',
      type: 'state',
      population: 29000000,
      budget: 250000000000,
      satisfaction: 74,
      issues: 287,
      agents: generateAgents('state'),
      metrics: generateMetrics(),
      children: [
        {
          id: 'austin',
          name: 'Austin',
          type: 'city',
          population: 978000,
          budget: 4500000000,
          satisfaction: 76,
          issues: 45,
          agents: generateAgents('city'),
          metrics: generateMetrics(),
          children: [
            { id: 'downtown-austin', name: 'Downtown Austin', type: 'district', population: 12000, budget: 85000000, satisfaction: 72, issues: 8, agents: generateAgents('district'), metrics: generateMetrics() },
          ],
        },
      ],
    },
  ],
};

// =============================================================================
// COMPONENTS
// =============================================================================

const formatNumber = (num: number): string => {
  if (num >= 1e12) {return `$${(num / 1e12).toFixed(1)}T`;}
  if (num >= 1e9) {return `$${(num / 1e9).toFixed(1)}B`;}
  if (num >= 1e6) {return `${(num / 1e6).toFixed(1)}M`;}
  if (num >= 1e3) {return `${(num / 1e3).toFixed(1)}K`;}
  return num.toString();
};

const EntityIcon: React.FC<{ type: CivicEntity['type'] }> = ({ type }) => {
  const icons = {
    country: <Globe className="w-4 h-4" />,
    state: <MapPin className="w-4 h-4" />,
    city: <Building className="w-4 h-4" />,
    district: <Users className="w-4 h-4" />,
    town: <MapPin className="w-4 h-4" />,
  };
  return icons[type];
};

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="flex items-center gap-2 p-2 bg-sovereign-base/50 rounded-lg border border-sovereign-border-subtle">
    <div className={cn(
      'w-8 h-8 rounded-full flex items-center justify-center',
      agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
      agent.status === 'processing' ? 'bg-cyan-900/50 text-cyan-400' :
      'bg-gray-900/50 text-gray-400'
    )}>
      <Bot className="w-4 h-4" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="text-xs font-medium text-white truncate">{agent.name}</p>
        <span className={cn(
          'w-1.5 h-1.5 rounded-full',
          agent.status === 'active' ? 'bg-emerald-500 animate-pulse' :
          agent.status === 'processing' ? 'bg-cyan-500 animate-pulse' :
          'bg-gray-500'
        )} />
      </div>
      <p className="text-[10px] text-gray-500 truncate">{agent.role}</p>
    </div>
    <div className="text-right">
      <p className="text-xs text-cyan-400">{agent.decisionsToday}</p>
      <p className="text-[10px] text-gray-500">today</p>
    </div>
  </div>
);

const MetricsBar: React.FC<{ metrics: CivicEntity['metrics'] }> = ({ metrics }) => (
  <div className="grid grid-cols-5 gap-1">
    {Object.entries(metrics).map(([key, value]) => (
      <div key={key} className="text-center">
        <div className="h-12 bg-sovereign-base rounded relative overflow-hidden">
          <div 
            className={cn(
              'absolute bottom-0 left-0 right-0 rounded transition-all',
              value >= 80 ? 'bg-emerald-500/60' :
              value >= 60 ? 'bg-cyan-500/60' :
              value >= 40 ? 'bg-amber-500/60' : 'bg-red-500/60'
            )}
            style={{ height: `${value}%` }}
          />
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
            {value.toFixed(0)}
          </span>
        </div>
        <p className="text-[8px] text-gray-500 mt-0.5 capitalize">{key.slice(0, 4)}</p>
      </div>
    ))}
  </div>
);

const EntityCard: React.FC<{ 
  entity: CivicEntity; 
  depth: number;
  selected: CivicEntity | null;
  onSelect: (e: CivicEntity) => void;
}> = ({ entity, depth, selected, onSelect }) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const isSelected = selected?.id === entity.id;
  
  const typeColors = {
    country: 'border-violet-500/50 bg-violet-900/10',
    state: 'border-blue-500/50 bg-blue-900/10',
    city: 'border-cyan-500/50 bg-cyan-900/10',
    district: 'border-emerald-500/50 bg-emerald-900/10',
    town: 'border-amber-500/50 bg-amber-900/10',
  };

  return (
    <div className={cn('border-l-2 pl-2', depth > 0 && 'ml-3 mt-2', typeColors[entity.type])}>
      <button
        onClick={() => onSelect(entity)}
        className={cn(
          'w-full text-left p-2 rounded-lg transition-all',
          isSelected ? 'bg-sovereign-elevated ring-1 ring-cyan-500/50' : 'hover:bg-sovereign-hover'
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <EntityIcon type={entity.type} />
            <div>
              <p className="text-sm font-medium text-white">{entity.name}</p>
              <p className="text-[10px] text-gray-500">
                Pop: {formatNumber(entity.population)} • Budget: {formatNumber(entity.budget)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {entity.issues > 20 && (
              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-900/50 rounded text-[10px] text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                {entity.issues}
              </span>
            )}
            <span className={cn(
              'px-1.5 py-0.5 rounded text-[10px] font-medium',
              entity.satisfaction >= 70 ? 'bg-emerald-900/50 text-emerald-400' :
              entity.satisfaction >= 50 ? 'bg-amber-900/50 text-amber-400' :
              'bg-red-900/50 text-red-400'
            )}>
              {entity.satisfaction}% 😊
            </span>
          </div>
        </div>
      </button>
      
      {entity.children && entity.children.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-cyan-400 hover:text-cyan-300 ml-2 mt-1"
          >
            {expanded ? '▼' : '▶'} {entity.children.length} sub-regions
          </button>
          {expanded && (
            <div className="space-y-1">
              {entity.children.map(child => (
                <EntityCard 
                  key={child.id} 
                  entity={child} 
                  depth={depth + 1}
                  selected={selected}
                  onSelect={onSelect}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CivicSimulation: React.FC<{ className?: string }> = ({ className }) => {
  const [hierarchy, setHierarchy] = useState<CivicEntity>(SAMPLE_HIERARCHY);
  const [selected, setSelected] = useState<CivicEntity | null>(SAMPLE_HIERARCHY);
  const [agentActivity, setAgentActivity] = useState<string[]>([]);

  // Simulate agent activity
  useEffect(() => {
    const activities = [
      '🤖 Atlas approved interstate highway funding allocation',
      '🏛️ Governor-AI optimized school district boundaries',
      '🏙️ CityCore resolved zoning conflict in downtown area',
      '📊 UrbanFlow reduced traffic congestion by 12%',
      '🚨 MetroMind coordinated emergency response drill',
      '💰 StateWatch identified $2.3M in budget savings',
      '📋 DistrictBot processed 47 permit applications',
      '🌳 LocalAI approved park renovation project',
      '🔍 Sovereign analyzed policy impact across 12 states',
      '🏥 CivicBot coordinated healthcare resource sharing',
    ];

    const interval = setInterval(() => {
      const newActivity = activities[Math.floor(deterministicFloat('civicsimulation-10') * activities.length)];
      if (newActivity) {
        setAgentActivity(prev => [newActivity, ...prev.slice(0, 4)]);
      }
      
      // Update satisfaction randomly
      setHierarchy(prev => ({
        ...prev,
        satisfaction: Math.max(50, Math.min(95, prev.satisfaction + (deterministicFloat('civicsimulation-2') - 0.5) * 2)),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalAgents = selected?.agents.length || 0;
  const activeAgents = selected?.agents.filter(a => a.status === 'active').length || 0;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base', className)}>
      <div className="grid grid-cols-2 h-full">
        {/* Left Panel - Hierarchy */}
        <div className="border-r border-sovereign-border p-3 overflow-y-auto">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Globe className="w-4 h-4 text-violet-400" />
            Civic Hierarchy
          </h3>
          <EntityCard 
            entity={hierarchy} 
            depth={0} 
            selected={selected}
            onSelect={setSelected}
          />
        </div>

        {/* Right Panel - Details */}
        <div className="p-3 overflow-y-auto">
          {selected && (
            <>
              {/* Header */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <EntityIcon type={selected.type} />
                  <h3 className="text-lg font-semibold text-white">{selected.name}</h3>
                </div>
                <p className="text-xs text-gray-400 capitalize">{selected.type} • {formatNumber(selected.population)} population</p>
              </div>

              {/* Metrics */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Performance Metrics</p>
                <MetricsBar metrics={selected.metrics} />
              </div>

              {/* AI Agents */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-400">AI Governance Agents</p>
                  <span className="text-xs text-emerald-400">{activeAgents}/{totalAgents} active</span>
                </div>
                <div className="space-y-2">
                  {selected.agents.map(agent => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <p className="text-xs text-gray-400 mb-2">Recent Agent Activity</p>
                <div className="space-y-1">
                  {agentActivity.map((activity, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        'text-xs p-2 rounded bg-sovereign-elevated/50 border border-sovereign-border-subtle',
                        i === 0 && 'ring-1 ring-cyan-500/30'
                      )}
                    >
                      {activity}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-sovereign-elevated/95 backdrop-blur-sm border-t border-sovereign-border px-4 py-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Total Regions: <span className="text-white font-medium">12</span></span>
            <span className="text-gray-400">Active Agents: <span className="text-emerald-400 font-medium">28</span></span>
            <span className="text-gray-400">Decisions Today: <span className="text-cyan-400 font-medium">1,247</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-gray-300">Simulation Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicSimulation;
