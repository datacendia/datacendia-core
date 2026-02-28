// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * TELECOM NETWORK DASHBOARD - Telecommunications Vertical
 * Network performance, subscriber analytics, and 5G rollout with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Radio, Users, Signal, Bot, Wifi, Activity } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface CellSite {
  id: string;
  name: string;
  type: '5G' | '4G LTE' | '3G';
  status: 'online' | 'degraded' | 'offline';
  load: number;
  subscribers: number;
  throughput: number;
  latency: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'optimizing' | 'alert';
  action: string;
  metric: string;
}

interface NetworkMetric {
  name: string;
  value: string;
  trend: number;
  status: 'good' | 'warning' | 'critical';
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const CELL_SITES: CellSite[] = [
  { id: 'cs1', name: 'Downtown Tower A', type: '5G', status: 'online', load: 78, subscribers: 12400, throughput: 2.4, latency: 8 },
  { id: 'cs2', name: 'Financial District', type: '5G', status: 'online', load: 92, subscribers: 18200, throughput: 2.8, latency: 6 },
  { id: 'cs3', name: 'Airport Terminal', type: '5G', status: 'degraded', load: 95, subscribers: 24100, throughput: 1.8, latency: 15 },
  { id: 'cs4', name: 'Industrial Zone', type: '4G LTE', status: 'online', load: 45, subscribers: 3200, throughput: 0.8, latency: 22 },
  { id: 'cs5', name: 'Suburban Node 7', type: '4G LTE', status: 'online', load: 62, subscribers: 8900, throughput: 1.2, latency: 18 },
  { id: 'cs6', name: 'Highway Corridor', type: '4G LTE', status: 'offline', load: 0, subscribers: 0, throughput: 0, latency: 0 },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'net', name: 'NetworkOptimizer', role: 'RAN Optimization', status: 'active', action: 'Balancing load across 5G cells', metric: '12% efficiency gain' },
  { id: 'churn', name: 'ChurnPredictor', role: 'Subscriber Retention', status: 'optimizing', action: 'Analyzing 847 at-risk subscribers', metric: '94% accuracy' },
  { id: 'cap', name: 'CapacityPlanner', role: 'Network Planning', status: 'active', action: 'Modeling 5G expansion scenarios', metric: '23 sites recommended' },
  { id: 'exp', name: 'ExperienceGuardian', role: 'QoE Management', status: 'alert', action: 'Investigating latency spike at Airport', metric: '15ms above SLA' },
];

const NETWORK_METRICS: NetworkMetric[] = [
  { name: 'Network Availability', value: '99.97%', trend: 0.02, status: 'good' },
  { name: 'Avg Latency', value: '12ms', trend: -2, status: 'good' },
  { name: 'Peak Throughput', value: '2.8 Gbps', trend: 15, status: 'good' },
  { name: 'Dropped Calls', value: '0.02%', trend: -0.01, status: 'good' },
  { name: 'Data Usage', value: '142 TB', trend: 8, status: 'warning' },
  { name: 'Active Sessions', value: '89.4K', trend: 12, status: 'good' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const SiteCard: React.FC<{ site: CellSite }> = ({ site }) => {
  const statusColors = {
    online: 'bg-emerald-900/20 border-emerald-500/40',
    degraded: 'bg-amber-900/20 border-amber-500/40',
    offline: 'bg-red-900/20 border-red-500/40',
  };

  const typeColors = {
    '5G': 'text-violet-400 bg-violet-900/50',
    '4G LTE': 'text-cyan-400 bg-cyan-900/50',
    '3G': 'text-gray-400 bg-gray-900/50',
  };

  return (
    <div className={cn('p-2 rounded-lg border', statusColors[site.status])}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Radio className={cn('w-3 h-3', site.status === 'online' ? 'text-emerald-400' : site.status === 'degraded' ? 'text-amber-400' : 'text-red-400')} />
          <span className="text-xs font-medium text-white truncate max-w-[100px]">{site.name}</span>
        </div>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded', typeColors[site.type])}>
          {site.type}
        </span>
      </div>
      
      {site.status !== 'offline' ? (
        <div className="grid grid-cols-4 gap-1 text-[10px]">
          <div>
            <p className="text-gray-500">Load</p>
            <p className={cn('font-medium', site.load > 90 ? 'text-red-400' : site.load > 75 ? 'text-amber-400' : 'text-white')}>
              {site.load}%
            </p>
          </div>
          <div>
            <p className="text-gray-500">Subs</p>
            <p className="text-white font-medium">{(site.subscribers / 1000).toFixed(1)}K</p>
          </div>
          <div>
            <p className="text-gray-500">Gbps</p>
            <p className="text-cyan-400 font-medium">{site.throughput}</p>
          </div>
          <div>
            <p className="text-gray-500">Latency</p>
            <p className={cn('font-medium', site.latency > 20 ? 'text-amber-400' : 'text-white')}>{site.latency}ms</p>
          </div>
        </div>
      ) : (
        <p className="text-[10px] text-red-400">Site offline - maintenance in progress</p>
      )}
    </div>
  );
};

const MetricCard: React.FC<{ metric: NetworkMetric }> = ({ metric }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center justify-between mb-0.5">
      <span className="text-[10px] text-gray-400">{metric.name}</span>
      <span className={cn(
        'text-[10px]',
        metric.trend > 0 ? 'text-emerald-400' : metric.trend < 0 ? 'text-red-400' : 'text-gray-400'
      )}>
        {metric.trend > 0 ? '+' : ''}{metric.trend}%
      </span>
    </div>
    <p className={cn(
      'text-sm font-bold',
      metric.status === 'good' ? 'text-white' : metric.status === 'warning' ? 'text-amber-400' : 'text-red-400'
    )}>
      {metric.value}
    </p>
  </div>
);

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'optimizing' ? 'bg-cyan-900/50 text-cyan-400' :
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
        agent.status === 'optimizing' ? 'bg-cyan-500' : 'bg-amber-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{agent.action}</p>
    <p className="text-[10px] text-cyan-400 bg-cyan-900/20 rounded px-1.5 py-0.5">📊 {agent.metric}</p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const TelecomNetworkDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [sites, setSites] = useState<CellSite[]>(CELL_SITES);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate load fluctuation
      setSites(prev => prev.map((s): CellSite => ({
        ...s,
        load: s.status === 'offline' ? 0 : Math.max(20, Math.min(99, s.load + Math.floor((deterministicFloat('telecomnetwork-1') - 0.5) * 10))),
        latency: s.status === 'offline' ? 0 : Math.max(5, Math.min(50, s.latency + Math.floor((deterministicFloat('telecomnetwork-2') - 0.5) * 5))),
      })));

      // Simulate agent activity
      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        status: deterministicFloat('telecomnetwork-3') > 0.8 ? 'optimizing' : 'active',
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalSubscribers = sites.reduce((sum, s) => sum + s.subscribers, 0);
  const onlineSites = sites.filter(s => s.status === 'online').length;
  const avgLoad = sites.filter(s => s.status !== 'offline').reduce((sum, s) => sum + s.load, 0) / sites.filter(s => s.status !== 'offline').length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <Radio className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{onlineSites}/{sites.length}</p>
          <p className="text-[10px] text-gray-400">Sites Online</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Users className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{(totalSubscribers / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-gray-400">Active Subscribers</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <Signal className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{avgLoad.toFixed(0)}%</p>
          <p className="text-[10px] text-gray-400">Avg Load</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <Wifi className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">99.97%</p>
          <p className="text-[10px] text-gray-400">Uptime</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - Cell Sites */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Radio className="w-3 h-3" /> Cell Sites
          </h3>
          <div className="space-y-2">
            {sites.map(site => (
              <SiteCard key={site.id} site={site} />
            ))}
          </div>
        </div>

        {/* Middle - Metrics */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Network Metrics
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {NETWORK_METRICS.map(m => (
              <MetricCard key={m.name} metric={m} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Network Agents
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
        <span className="text-xs text-gray-300">Live Network</span>
      </div>
    </div>
  );
};

export default TelecomNetworkDashboard;
