// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LOAD OPTIMIZATION DASHBOARD - Air-Gapped Scaling
 * Enterprise Platinum - Resource management for sovereign deployments
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import { 
  Cpu, MemoryStick, HardDrive, Activity, Server, 
  Gauge, Bot, Zap, Clock, TrendingUp, AlertTriangle
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface NodeStatus {
  id: string;
  name: string;
  type: 'primary' | 'inference' | 'storage' | 'gateway';
  status: 'healthy' | 'busy' | 'overloaded' | 'offline';
  cpu: number;
  memory: number;
  disk: number;
  activeRequests: number;
  queueDepth: number;
  avgLatency: number;
}

interface ModelInstance {
  id: string;
  model: string;
  node: string;
  status: 'loaded' | 'loading' | 'idle' | 'swapping';
  memoryUsed: number;
  requestsPerMin: number;
  avgLatency: number;
}

interface QueueMetrics {
  totalPending: number;
  avgWaitTime: number;
  throughput: number;
  rejectedRate: number;
}

interface OptimizationAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'optimizing' | 'idle';
  action: string;
  impact: string;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const NODES: NodeStatus[] = [
  { id: 'n1', name: 'sovereign-primary-01', type: 'primary', status: 'healthy', cpu: 45, memory: 62, disk: 34, activeRequests: 12, queueDepth: 3, avgLatency: 142 },
  { id: 'n2', name: 'inference-gpu-01', type: 'inference', status: 'busy', cpu: 87, memory: 91, disk: 45, activeRequests: 24, queueDepth: 18, avgLatency: 89 },
  { id: 'n3', name: 'inference-gpu-02', type: 'inference', status: 'healthy', cpu: 52, memory: 78, disk: 41, activeRequests: 8, queueDepth: 2, avgLatency: 95 },
  { id: 'n4', name: 'storage-vault-01', type: 'storage', status: 'healthy', cpu: 23, memory: 45, disk: 78, activeRequests: 5, queueDepth: 0, avgLatency: 12 },
  { id: 'n5', name: 'gateway-edge-01', type: 'gateway', status: 'healthy', cpu: 34, memory: 28, disk: 15, activeRequests: 45, queueDepth: 8, avgLatency: 23 },
];

const MODEL_INSTANCES: ModelInstance[] = [
  { id: 'm1', model: 'qwen2.5:7b', node: 'inference-gpu-01', status: 'loaded', memoryUsed: 8.2, requestsPerMin: 45, avgLatency: 89 },
  { id: 'm2', model: 'qwq:32b', node: 'inference-gpu-01', status: 'loaded', memoryUsed: 22.4, requestsPerMin: 12, avgLatency: 340 },
  { id: 'm3', model: 'qwen2.5-coder:32b', node: 'inference-gpu-02', status: 'loaded', memoryUsed: 21.8, requestsPerMin: 8, avgLatency: 280 },
  { id: 'm4', model: 'llama3.2:3b', node: 'inference-gpu-02', status: 'idle', memoryUsed: 4.1, requestsPerMin: 0, avgLatency: 0 },
  { id: 'm5', model: 'nomic-embed-text', node: 'inference-gpu-01', status: 'loaded', memoryUsed: 1.2, requestsPerMin: 120, avgLatency: 15 },
];

const OPTIMIZATION_AGENTS: OptimizationAgent[] = [
  { id: 'o1', name: 'LoadBalancer', role: 'Request Distribution', status: 'active', action: 'Routing heavy inference to gpu-02', impact: '-23% latency' },
  { id: 'o2', name: 'ModelSwapper', role: 'Memory Management', status: 'optimizing', action: 'Unloading idle llama3.2:3b', impact: '+4.1GB freed' },
  { id: 'o3', name: 'QueueManager', role: 'Request Prioritization', status: 'active', action: 'Prioritizing council deliberations', impact: '98% SLA met' },
  { id: 'o4', name: 'CapacityPlanner', role: 'Resource Forecasting', status: 'idle', action: 'Peak load expected at 14:00', impact: 'Pre-warming models' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const NodeCard: React.FC<{ node: NodeStatus }> = ({ node }) => {
  const statusColors = {
    healthy: 'border-emerald-500/40 bg-emerald-900/10',
    busy: 'border-amber-500/40 bg-amber-900/10',
    overloaded: 'border-red-500/40 bg-red-900/10',
    offline: 'border-gray-500/40 bg-gray-900/10',
  };

  const typeIcons = {
    primary: <Server className="w-4 h-4" />,
    inference: <Cpu className="w-4 h-4" />,
    storage: <HardDrive className="w-4 h-4" />,
    gateway: <Zap className="w-4 h-4" />,
  };

  return (
    <div className={cn('p-3 rounded-lg border', statusColors[node.status])}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn(
            'p-1.5 rounded',
            node.status === 'healthy' ? 'bg-emerald-900/50 text-emerald-400' :
            node.status === 'busy' ? 'bg-amber-900/50 text-amber-400' :
            node.status === 'overloaded' ? 'bg-red-900/50 text-red-400' :
            'bg-gray-900/50 text-gray-400'
          )}>
            {typeIcons[node.type]}
          </span>
          <div>
            <p className="text-xs font-medium text-white">{node.name}</p>
            <p className="text-[10px] text-gray-500 capitalize">{node.type}</p>
          </div>
        </div>
        <span className={cn(
          'text-[10px] px-1.5 py-0.5 rounded capitalize',
          node.status === 'healthy' ? 'bg-emerald-900/50 text-emerald-400' :
          node.status === 'busy' ? 'bg-amber-900/50 text-amber-400' :
          node.status === 'overloaded' ? 'bg-red-900/50 text-red-400' :
          'bg-gray-900/50 text-gray-400'
        )}>
          {node.status}
        </span>
      </div>

      {/* Resource bars */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <Cpu className="w-3 h-3 text-gray-500" />
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full', node.cpu > 80 ? 'bg-red-500' : node.cpu > 60 ? 'bg-amber-500' : 'bg-emerald-500')}
              style={{ width: `${node.cpu}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 w-8">{node.cpu}%</span>
        </div>
        <div className="flex items-center gap-2">
          <MemoryStick className="w-3 h-3 text-gray-500" />
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full', node.memory > 80 ? 'bg-red-500' : node.memory > 60 ? 'bg-amber-500' : 'bg-cyan-500')}
              style={{ width: `${node.memory}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 w-8">{node.memory}%</span>
        </div>
        <div className="flex items-center gap-2">
          <HardDrive className="w-3 h-3 text-gray-500" />
          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className={cn('h-full rounded-full', node.disk > 80 ? 'bg-red-500' : node.disk > 60 ? 'bg-amber-500' : 'bg-violet-500')}
              style={{ width: `${node.disk}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-400 w-8">{node.disk}%</span>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-sovereign-border-subtle">
        <div className="text-center">
          <p className="text-sm font-bold text-white">{node.activeRequests}</p>
          <p className="text-[9px] text-gray-500">Active</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-amber-400">{node.queueDepth}</p>
          <p className="text-[9px] text-gray-500">Queue</p>
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-cyan-400">{node.avgLatency}ms</p>
          <p className="text-[9px] text-gray-500">Latency</p>
        </div>
      </div>
    </div>
  );
};

const ModelCard: React.FC<{ model: ModelInstance }> = ({ model }) => {
  const statusColors = {
    loaded: 'text-emerald-400',
    loading: 'text-amber-400',
    idle: 'text-gray-400',
    swapping: 'text-cyan-400',
  };

  return (
    <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white">{model.model}</span>
        <span className={cn('text-[10px] capitalize', statusColors[model.status])}>
          {model.status === 'loading' || model.status === 'swapping' ? (
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              {model.status}
            </span>
          ) : model.status}
        </span>
      </div>
      <p className="text-[10px] text-gray-500 mb-1">{model.node}</p>
      <div className="grid grid-cols-3 gap-1 text-[10px]">
        <div>
          <p className="text-gray-500">Memory</p>
          <p className="text-white font-medium">{model.memoryUsed}GB</p>
        </div>
        <div>
          <p className="text-gray-500">Req/min</p>
          <p className="text-cyan-400 font-medium">{model.requestsPerMin}</p>
        </div>
        <div>
          <p className="text-gray-500">Latency</p>
          <p className="text-white font-medium">{model.avgLatency}ms</p>
        </div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: OptimizationAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'optimizing' ? 'bg-cyan-900/50 text-cyan-400' :
        'bg-gray-900/50 text-gray-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full',
        agent.status === 'active' ? 'bg-emerald-500 animate-pulse' :
        agent.status === 'optimizing' ? 'bg-cyan-500 animate-pulse' : 'bg-gray-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{agent.action}</p>
    <p className="text-[10px] text-emerald-400 bg-emerald-900/20 rounded px-1.5 py-0.5 inline-block">
      {agent.impact}
    </p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LoadOptimizationDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [nodes, setNodes] = useState<NodeStatus[]>(NODES);
  const [models, setModels] = useState<ModelInstance[]>(MODEL_INSTANCES);
  const [agents, setAgents] = useState<OptimizationAgent[]>(OPTIMIZATION_AGENTS);
  const [queue, setQueue] = useState<QueueMetrics>({
    totalPending: 28,
    avgWaitTime: 340,
    throughput: 156,
    rejectedRate: 0.02,
  });

  // Simulate metrics changes
  useEffect(() => {
    const interval = setInterval(() => {
      setNodes(prev => prev.map(n => ({
        ...n,
        cpu: Math.max(10, Math.min(95, n.cpu + Math.floor((deterministicFloat('loadoptimization-1') - 0.5) * 15))),
        memory: Math.max(20, Math.min(95, n.memory + Math.floor((deterministicFloat('loadoptimization-2') - 0.5) * 8))),
        activeRequests: Math.max(0, n.activeRequests + Math.floor((deterministicFloat('loadoptimization-3') - 0.5) * 5)),
        queueDepth: Math.max(0, n.queueDepth + Math.floor((deterministicFloat('loadoptimization-4') - 0.5) * 4)),
        avgLatency: Math.max(10, n.avgLatency + Math.floor((deterministicFloat('loadoptimization-5') - 0.5) * 30)),
        status: n.cpu > 85 ? 'overloaded' : n.cpu > 70 ? 'busy' : 'healthy',
      })));

      setModels(prev => prev.map(m => ({
        ...m,
        requestsPerMin: Math.max(0, m.requestsPerMin + Math.floor((deterministicFloat('loadoptimization-6') - 0.5) * 10)),
      })));

      setQueue(prev => ({
        ...prev,
        totalPending: Math.max(0, prev.totalPending + Math.floor((deterministicFloat('loadoptimization-7') - 0.5) * 8)),
        throughput: Math.max(50, prev.throughput + Math.floor((deterministicFloat('loadoptimization-8') - 0.5) * 20)),
      }));

      setAgents(prev => prev.map(a => ({
        ...a,
        status: deterministicFloat('loadoptimization-9') > 0.7 ? 'optimizing' : 'active',
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const totalCpu = nodes.reduce((sum, n) => sum + n.cpu, 0) / nodes.length;
  const totalMemory = nodes.reduce((sum, n) => sum + n.memory, 0) / nodes.length;
  const totalRequests = nodes.reduce((sum, n) => sum + n.activeRequests, 0);
  const healthyNodes = nodes.filter(n => n.status === 'healthy').length;

  return (
    <div className={cn('rounded-xl overflow-hidden bg-sovereign-base border border-sovereign-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-sovereign-border bg-gradient-to-r from-cyan-900/20 to-violet-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Gauge className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                Load Optimization
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-gray-400">Air-gapped sovereign deployment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-6 gap-3 p-4 border-b border-sovereign-border bg-sovereign-elevated/30">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Server className="w-4 h-4 text-emerald-400" />
            <span className="text-lg font-bold text-white">{healthyNodes}/{nodes.length}</span>
          </div>
          <p className="text-[10px] text-gray-400">Nodes Healthy</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className={cn('text-lg font-bold', totalCpu > 80 ? 'text-red-400' : 'text-white')}>{totalCpu.toFixed(0)}%</span>
          </div>
          <p className="text-[10px] text-gray-400">Avg CPU</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <MemoryStick className="w-4 h-4 text-violet-400" />
            <span className={cn('text-lg font-bold', totalMemory > 80 ? 'text-amber-400' : 'text-white')}>{totalMemory.toFixed(0)}%</span>
          </div>
          <p className="text-[10px] text-gray-400">Avg Memory</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Activity className="w-4 h-4 text-amber-400" />
            <span className="text-lg font-bold text-white">{totalRequests}</span>
          </div>
          <p className="text-[10px] text-gray-400">Active Requests</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-lg font-bold text-white">{queue.avgWaitTime}ms</span>
          </div>
          <p className="text-[10px] text-gray-400">Avg Wait</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-lg font-bold text-emerald-400">{queue.throughput}</span>
          </div>
          <p className="text-[10px] text-gray-400">Req/min</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 p-4">
        {/* Nodes */}
        <div className="col-span-1 overflow-y-auto max-h-[400px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Server className="w-3 h-3" /> Cluster Nodes ({nodes.length})
          </h4>
          <div className="space-y-2">
            {nodes.map(node => (
              <NodeCard key={node.id} node={node} />
            ))}
          </div>
        </div>

        {/* Models */}
        <div className="col-span-1 overflow-y-auto max-h-[400px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Cpu className="w-3 h-3" /> Loaded Models ({models.length})
          </h4>
          <div className="space-y-2">
            {models.map(model => (
              <ModelCard key={model.id} model={model} />
            ))}
          </div>

          {/* Queue Status */}
          <div className="mt-4 p-3 bg-gradient-to-r from-amber-900/20 to-red-900/20 rounded-lg border border-amber-500/30">
            <h4 className="text-xs font-semibold text-amber-400 mb-2 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Request Queue
            </h4>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div>
                <p className="text-gray-500">Pending</p>
                <p className="text-white font-bold text-lg">{queue.totalPending}</p>
              </div>
              <div>
                <p className="text-gray-500">Rejected Rate</p>
                <p className="text-emerald-400 font-bold text-lg">{(queue.rejectedRate * 100).toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Optimization Agents */}
        <div className="col-span-1 overflow-y-auto max-h-[400px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> Optimization Agents
          </h4>
          <div className="space-y-2">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadOptimizationDashboard;
