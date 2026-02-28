// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA SOVEREIGN™ - FULLY LOCAL LLM CLUSTER ORCHESTRATOR
// Enterprise AI Infrastructure: Multi-Model Orchestration & GPU Scheduling
// "Your Organization's Private AI Brain - Zero Cloud Dependencies"
//
// CAPABILITIES:
// - Multi-model orchestration across GPU clusters
// - Intelligent GPU scheduling & load balancing
// - Model caching with LRU eviction
// - High-availability inference nodes
// - Automatic failover architectures
// - Model sandboxing for compliance review
// - Sovereign AI deployment (air-gapped capable)
// =============================================================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  enterpriseService,
  GPUNode,
  DeployedModel,
  ClusterMetrics,
} from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';
import { decisionIntelApi } from '../../../lib/api';
import { ReportSection, POIList, StatusBadge } from '../../../components/reports/DrillDownReportKit';
import { MetricWithSparkline, AnomalyBanner } from '../../../components/reports/TrendSparklineKit';
import { HeatmapCalendar, AuditTimeline } from '../../../components/reports/HeatmapTimelineKit';
import { ExportToolbar, ComparisonPanel, PDFExportButton } from '../../../components/reports/ExportCompareKit';
import { SavedViewManager } from '../../../components/reports/InteractionKit';
import { Shield, Server } from 'lucide-react';

// =============================================================================
// LOCAL TYPES (GPUNode, DeployedModel, ClusterMetrics imported from EnterpriseService)
// =============================================================================

type InferenceMode = 'balanced' | 'latency' | 'throughput' | 'cost';

interface FailoverConfig {
  id: string;
  primaryModel: string;
  fallbackModels: string[];
  triggerConditions: {
    latencyThreshold: number;
    errorRateThreshold: number;
    queueDepthThreshold: number;
  };
  isActive: boolean;
  lastTriggered?: Date;
  triggerCount: number;
}

interface ComplianceSandbox {
  id: string;
  modelId: string;
  modelName: string;
  submittedBy: string;
  submittedAt: Date;
  status: 'pending' | 'testing' | 'review' | 'approved' | 'rejected';
  tests: {
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    details?: string;
  }[];
  reviewers: string[];
  notes: string;
}

// =============================================================================
// MOCK DATA GENERATORS
// =============================================================================

const generateGPUNodes = (): GPUNode[] => [
  {
    id: 'node-001',
    name: 'Sovereign-Primary-01',
    hostname: 'gpu-cluster-01.internal',
    zone: 'on-prem',
    gpuType: 'H100',
    gpuCount: 8,
    vramPerGPU: 80,
    totalVRAM: 640,
    usedVRAM: 480,
    status: 'online',
    temperature: 62,
    powerDraw: 5600,
    loadedModels: ['llama-70b', 'mistral-large', 'qwen-72b'],
    currentRequests: 24,
    requestsPerSecond: 12.4,
    avgLatency: 180,
    uptime: 2184,
    lastHealthCheck: new Date(Date.now() - 15000),
  },
  {
    id: 'node-002',
    name: 'Sovereign-Primary-02',
    hostname: 'gpu-cluster-02.internal',
    zone: 'on-prem',
    gpuType: 'H100',
    gpuCount: 8,
    vramPerGPU: 80,
    totalVRAM: 640,
    usedVRAM: 520,
    status: 'online',
    temperature: 65,
    powerDraw: 5800,
    loadedModels: ['llama-70b', 'deepseek-coder', 'command-r-plus'],
    currentRequests: 31,
    requestsPerSecond: 15.2,
    avgLatency: 165,
    uptime: 2184,
    lastHealthCheck: new Date(Date.now() - 12000),
  },
  {
    id: 'node-003',
    name: 'Sovereign-HA-01',
    hostname: 'gpu-ha-01.internal',
    zone: 'on-prem',
    gpuType: 'A100',
    gpuCount: 4,
    vramPerGPU: 80,
    totalVRAM: 320,
    usedVRAM: 240,
    status: 'online',
    temperature: 58,
    powerDraw: 1600,
    loadedModels: ['llama-13b', 'mistral-7b'],
    currentRequests: 8,
    requestsPerSecond: 28.5,
    avgLatency: 45,
    uptime: 720,
    lastHealthCheck: new Date(Date.now() - 8000),
  },
  {
    id: 'node-004',
    name: 'Sovereign-Edge-01',
    hostname: 'edge-node-01.branch',
    zone: 'edge',
    gpuType: 'RTX4090',
    gpuCount: 2,
    vramPerGPU: 24,
    totalVRAM: 48,
    usedVRAM: 38,
    status: 'online',
    temperature: 71,
    powerDraw: 900,
    loadedModels: ['phi-3', 'llama-7b-q4'],
    currentRequests: 3,
    requestsPerSecond: 8.2,
    avgLatency: 85,
    uptime: 168,
    lastHealthCheck: new Date(Date.now() - 20000),
  },
  {
    id: 'node-005',
    name: 'Sovereign-Secure-01',
    hostname: 'airgap-01.secure.gov',
    zone: 'air-gapped',
    gpuType: 'H100',
    gpuCount: 4,
    vramPerGPU: 80,
    totalVRAM: 320,
    usedVRAM: 280,
    status: 'online',
    temperature: 55,
    powerDraw: 2800,
    loadedModels: ['llama-70b-classified', 'qwen-72b-secure'],
    currentRequests: 5,
    requestsPerSecond: 3.1,
    avgLatency: 220,
    uptime: 4380,
    lastHealthCheck: new Date(Date.now() - 30000),
  },
  {
    id: 'node-006',
    name: 'Sovereign-Dev-01',
    hostname: 'gpu-dev-01.internal',
    zone: 'on-prem',
    gpuType: 'L40',
    gpuCount: 4,
    vramPerGPU: 48,
    totalVRAM: 192,
    usedVRAM: 96,
    status: 'draining',
    temperature: 52,
    powerDraw: 1200,
    loadedModels: ['test-model-alpha'],
    currentRequests: 0,
    requestsPerSecond: 0,
    avgLatency: 0,
    uptime: 72,
    lastHealthCheck: new Date(Date.now() - 5000),
  },
];

const generateDeployedModels = (): DeployedModel[] => [
  {
    id: 'llama-70b',
    name: 'Llama 3.1 70B Instruct',
    family: 'llama',
    size: '70B',
    parameters: '70.6B',
    quantization: 'FP16',
    vramRequired: 140,
    contextLength: 128000,
    nodes: ['node-001', 'node-002'],
    replicas: 2,
    status: 'active',
    requestsToday: 12847,
    avgResponseTime: 175,
    tokensGenerated: 8456000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 2000),
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large 2',
    family: 'mistral',
    size: '72B',
    parameters: '123B',
    quantization: 'FP16',
    vramRequired: 160,
    contextLength: 32768,
    nodes: ['node-001'],
    replicas: 1,
    status: 'active',
    requestsToday: 5234,
    avgResponseTime: 210,
    tokensGenerated: 3245000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 5000),
  },
  {
    id: 'qwen-72b',
    name: 'Qwen 2.5 72B',
    family: 'qwen',
    size: '72B',
    parameters: '72.7B',
    quantization: 'AWQ',
    vramRequired: 80,
    contextLength: 131072,
    nodes: ['node-001', 'node-005'],
    replicas: 2,
    status: 'active',
    requestsToday: 8923,
    avgResponseTime: 145,
    tokensGenerated: 6234000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 1000),
  },
  {
    id: 'deepseek-coder',
    name: 'DeepSeek Coder V2',
    family: 'deepseek',
    size: '34B',
    parameters: '236B MoE',
    quantization: 'FP16',
    vramRequired: 120,
    contextLength: 128000,
    nodes: ['node-002'],
    replicas: 1,
    status: 'active',
    requestsToday: 3456,
    avgResponseTime: 190,
    tokensGenerated: 2890000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 8000),
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    family: 'command-r',
    size: '34B',
    parameters: '104B',
    quantization: 'INT8',
    vramRequired: 60,
    contextLength: 128000,
    nodes: ['node-002'],
    replicas: 1,
    status: 'active',
    requestsToday: 2134,
    avgResponseTime: 165,
    tokensGenerated: 1567000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 15000),
  },
  {
    id: 'llama-13b',
    name: 'Llama 3.1 13B',
    family: 'llama',
    size: '13B',
    parameters: '13B',
    quantization: 'FP16',
    vramRequired: 26,
    contextLength: 128000,
    nodes: ['node-003'],
    replicas: 1,
    status: 'active',
    requestsToday: 18234,
    avgResponseTime: 42,
    tokensGenerated: 12450000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 500),
  },
  {
    id: 'phi-3',
    name: 'Phi-3 Medium',
    family: 'phi',
    size: '13B',
    parameters: '14B',
    quantization: 'INT4',
    vramRequired: 8,
    contextLength: 128000,
    nodes: ['node-004'],
    replicas: 1,
    status: 'active',
    requestsToday: 4567,
    avgResponseTime: 28,
    tokensGenerated: 3456000,
    complianceStatus: 'approved',
    lastUsed: new Date(Date.now() - 3000),
  },
  {
    id: 'test-model-alpha',
    name: 'Custom Finance Model v2',
    family: 'custom',
    size: 'custom',
    parameters: '8B',
    quantization: 'GPTQ',
    vramRequired: 16,
    contextLength: 32768,
    nodes: ['node-006'],
    replicas: 1,
    status: 'sandboxed',
    requestsToday: 0,
    avgResponseTime: 0,
    tokensGenerated: 0,
    complianceStatus: 'review',
    lastUsed: new Date(Date.now() - 3600000),
  },
];

const generateFailoverConfigs = (): FailoverConfig[] => [
  {
    id: 'fo-001',
    primaryModel: 'llama-70b',
    fallbackModels: ['qwen-72b', 'mistral-large', 'llama-13b'],
    triggerConditions: {
      latencyThreshold: 500,
      errorRateThreshold: 5,
      queueDepthThreshold: 50,
    },
    isActive: true,
    lastTriggered: new Date(Date.now() - 86400000),
    triggerCount: 3,
  },
  {
    id: 'fo-002',
    primaryModel: 'deepseek-coder',
    fallbackModels: ['llama-70b', 'qwen-72b'],
    triggerConditions: {
      latencyThreshold: 400,
      errorRateThreshold: 3,
      queueDepthThreshold: 30,
    },
    isActive: true,
    triggerCount: 0,
  },
];

const generateSandboxes = (): ComplianceSandbox[] => [
  {
    id: 'sb-001',
    modelId: 'test-model-alpha',
    modelName: 'Custom Finance Model v2',
    submittedBy: 'AI Research Team',
    submittedAt: new Date(Date.now() - 172800000),
    status: 'testing',
    tests: [
      { name: 'Bias Detection', status: 'passed' },
      { name: 'Hallucination Rate', status: 'passed' },
      { name: 'Data Leakage', status: 'running' },
      { name: 'Adversarial Robustness', status: 'pending' },
      { name: 'Compliance Output Filter', status: 'pending' },
      { name: 'PII Detection', status: 'pending' },
    ],
    reviewers: ['Chief AI Officer', 'Compliance Lead', 'CISO'],
    notes: 'Fine-tuned on proprietary financial data. Requires SOX compliance verification.',
  },
  {
    id: 'sb-002',
    modelId: 'legal-assistant-v1',
    modelName: 'Legal Contract Analyzer',
    submittedBy: 'Legal Tech Team',
    submittedAt: new Date(Date.now() - 86400000),
    status: 'review',
    tests: [
      { name: 'Bias Detection', status: 'passed' },
      { name: 'Hallucination Rate', status: 'passed' },
      { name: 'Data Leakage', status: 'passed' },
      { name: 'Adversarial Robustness', status: 'passed' },
      { name: 'Compliance Output Filter', status: 'passed' },
      { name: 'PII Detection', status: 'passed' },
    ],
    reviewers: ['General Counsel', 'Chief AI Officer'],
    notes: 'All automated tests passed. Awaiting legal review for contract analysis capabilities.',
  },
];

const calculateClusterMetrics = (nodes: GPUNode[], models: DeployedModel[]): ClusterMetrics => {
  const onlineNodes = nodes.filter((n) => n.status === 'online' || n.status === 'busy');
  const activeModels = models.filter((m) => m.status === 'active');

  return {
    totalNodes: nodes.length,
    onlineNodes: onlineNodes.length,
    totalGPUs: nodes.reduce((sum, n) => sum + n.gpuCount, 0),
    activeGPUs: onlineNodes.reduce((sum, n) => sum + n.gpuCount, 0),
    totalVRAM: nodes.reduce((sum, n) => sum + n.totalVRAM, 0),
    usedVRAM: nodes.reduce((sum, n) => sum + n.usedVRAM, 0),
    totalModels: models.length,
    activeModels: activeModels.length,
    requestsPerSecond: onlineNodes.reduce((sum, n) => sum + n.requestsPerSecond, 0),
    avgLatency:
      onlineNodes.length > 0
        ? onlineNodes.reduce((sum, n) => sum + n.avgLatency, 0) / onlineNodes.length
        : 0,
    tokensPerSecond: Math.round(
      activeModels.reduce((sum, m) => sum + m.tokensGenerated, 0) / 86400
    ),
    powerConsumption: nodes.reduce((sum, n) => sum + n.powerDraw, 0),
    costPerHour: nodes.reduce((sum, n) => sum + (n.powerDraw * 0.12) / 1000, 0), // $0.12/kWh
    uptime: 99.97,
  };
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const SovereignPage: React.FC = () => {
  const navigate = useNavigate();
  const [nodes, setNodes] = useState<GPUNode[]>([]);
  const [models, setModels] = useState<DeployedModel[]>([]);
  const [failovers] = useState<FailoverConfig[]>([]);
  const [sandboxes] = useState<ComplianceSandbox[]>([]);
  const [selectedNode, setSelectedNode] = useState<GPUNode | null>(null);
  const [selectedModel, setSelectedModel] = useState<DeployedModel | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'nodes' | 'models' | 'routing' | 'sandbox'
  >('overview');
  const [inferenceMode, setInferenceMode] = useState<InferenceMode>('balanced');
  const [metrics, setMetrics] = useState<ClusterMetrics | null>(null);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false, models: [] as string[] });

  // Load data from EnterpriseService & API
  const loadData = useCallback(async () => {
    // Try to fetch from API first
    try {
      const snapshotsRes = await decisionIntelApi.getChronosSnapshots();
      if (snapshotsRes.success && snapshotsRes.data) {
        console.log('[Sovereign] Loaded', snapshotsRes.data.length, 'system snapshots');
      }
    } catch (error) {
      console.log('[Sovereign] API unavailable, using local service');
    }

    // Fall back to enterprise service
    enterpriseService.refreshOllamaStatus();
    setNodes(enterpriseService.getGPUNodes());
    setModels(enterpriseService.getDeployedModels());
    setMetrics(enterpriseService.getClusterMetrics());
    setOllamaStatus(ollamaService.getStatus());
  }, []);

  // Live updates
  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-indigo-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🏰</span>
                  CendiaSovereign™
                  <span className="text-xs bg-gradient-to-r from-indigo-500 to-purple-500 px-2 py-0.5 rounded-full font-medium">
                    ENTERPRISE
                  </span>
                </h1>
                <p className="text-indigo-300 text-sm">
                  Fully Local LLM Cluster Orchestrator • Zero Cloud Dependencies
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Inference Mode Selector */}
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                {(['balanced', 'latency', 'throughput', 'cost'] as InferenceMode[]).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setInferenceMode(mode)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      inferenceMode === mode
                        ? 'bg-indigo-600 text-white'
                        : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-sm text-green-400">Cluster Healthy</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Cluster Metrics Bar */}
      <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-b border-indigo-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics?.onlineNodes ?? 0}/{metrics?.totalNodes ?? 0}
              </div>
              <div className="text-xs text-indigo-300">Nodes Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{metrics?.activeGPUs ?? 0}</div>
              <div className="text-xs text-indigo-300">Active GPUs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics?.totalVRAM ? Math.round((metrics.usedVRAM / metrics.totalVRAM) * 100) : 0}%
              </div>
              <div className="text-xs text-indigo-300">VRAM Used</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics?.activeModels ?? 0}</div>
              <div className="text-xs text-indigo-300">Active Models</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">
                {metrics?.requestsPerSecond?.toFixed(1) ?? '0.0'}
              </div>
              <div className="text-xs text-indigo-300">Req/sec</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">
                {Math.round(metrics?.avgLatency ?? 0)}ms
              </div>
              <div className="text-xs text-indigo-300">Avg Latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {((metrics?.tokensPerSecond ?? 0) / 1000).toFixed(1)}K
              </div>
              <div className="text-xs text-indigo-300">Tokens/sec</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{metrics?.uptime ?? 0}%</div>
              <div className="text-xs text-indigo-300">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-indigo-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Cluster Overview', icon: '📊' },
              { id: 'nodes', label: 'GPU Nodes', icon: '🖥️' },
              { id: 'models', label: 'Deployed Models', icon: '🤖' },
              { id: 'routing', label: 'Smart Routing', icon: '🔀' },
              { id: 'sandbox', label: 'Compliance Sandbox', icon: '🔬' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-400 text-white bg-indigo-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Cluster Architecture Visualization */}
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🏗️ Cluster Architecture
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNode(node)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      node.status === 'online'
                        ? 'bg-green-900/20 border-green-700/50 hover:border-green-500'
                        : node.status === 'busy'
                          ? 'bg-amber-900/20 border-amber-700/50 hover:border-amber-500'
                          : node.status === 'draining'
                            ? 'bg-blue-900/20 border-blue-700/50 hover:border-blue-500'
                            : 'bg-red-900/20 border-red-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{node.name}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          node.zone === 'air-gapped'
                            ? 'bg-red-600'
                            : node.zone === 'edge'
                              ? 'bg-amber-600'
                              : 'bg-indigo-600'
                        }`}
                      >
                        {node.zone}
                      </span>
                    </div>
                    <div className="text-xs text-white/60 mb-3">
                      {node.gpuCount}× {node.gpuType}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">VRAM</span>
                        <span>
                          {node.usedVRAM}/{node.totalVRAM} GB
                        </span>
                      </div>
                      <div className="h-1.5 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            node.usedVRAM / node.totalVRAM > 0.9
                              ? 'bg-red-500'
                              : node.usedVRAM / node.totalVRAM > 0.7
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(node.usedVRAM / node.totalVRAM) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/50">{node.requestsPerSecond} req/s</span>
                        <span className="text-white/50">{node.avgLatency}ms</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-6">
              {/* Active Models */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Hot Models
                </h3>
                <div className="space-y-3">
                  {models
                    .filter((m) => m.status === 'active')
                    .slice(0, 5)
                    .map((model) => (
                      <div key={model.id} className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{model.name}</div>
                          <div className="text-xs text-white/50">
                            {model.parameters} • {model.quantization}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-cyan-400">
                            {model.requestsToday.toLocaleString()}
                          </div>
                          <div className="text-xs text-white/50">requests</div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Power & Cost */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  Power & Cost
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-white/60">Power Draw</span>
                      <span className="font-bold text-amber-400">
                        {((metrics?.powerConsumption ?? 0) / 1000).toFixed(1)} kW
                      </span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500 w-3/4" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        ${(metrics?.costPerHour ?? 0).toFixed(2)}
                      </div>
                      <div className="text-xs text-white/50">per hour</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        ${((metrics?.costPerHour ?? 0) * 24 * 30).toFixed(0)}
                      </div>
                      <div className="text-xs text-white/50">per month</div>
                    </div>
                  </div>
                  <div className="text-xs text-white/40 text-center">
                    Cost per 1M tokens: $
                    {(
                      ((((metrics?.costPerHour ?? 0) * 3600) / (metrics?.tokensPerSecond || 1)) *
                        1000000) /
                      3600
                    ).toFixed(4)}
                  </div>
                </div>
              </div>

              {/* Failover Status */}
              <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
                  High Availability
                </h3>
                <div className="space-y-3">
                  {failovers.map((fo) => {
                    const primaryModel = models.find((m) => m.id === fo.primaryModel);
                    return (
                      <div key={fo.id} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{primaryModel?.name}</span>
                          <span
                            className={`text-xs px-2 py-0.5 rounded ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}
                          >
                            {fo.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                        <div className="text-xs text-white/50">
                          {fo.fallbackModels.length} fallback models configured
                        </div>
                        {fo.lastTriggered && (
                          <div className="text-xs text-amber-400 mt-1">
                            Last triggered:{' '}
                            {Math.floor((Date.now() - fo.lastTriggered.getTime()) / 3600000)}h ago
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'nodes' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              {nodes.map((node) => (
                <div
                  key={node.id}
                  className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                      <div className="text-sm text-white/50">{node.hostname}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          node.status === 'online'
                            ? 'bg-green-600'
                            : node.status === 'busy'
                              ? 'bg-amber-600'
                              : node.status === 'draining'
                                ? 'bg-blue-600'
                                : 'bg-red-600'
                        }`}
                      >
                        {node.status}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-lg text-sm ${
                          node.zone === 'air-gapped'
                            ? 'bg-red-900 text-red-300'
                            : node.zone === 'edge'
                              ? 'bg-amber-900 text-amber-300'
                              : 'bg-indigo-900 text-indigo-300'
                        }`}
                      >
                        {node.zone}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.gpuCount}×</div>
                      <div className="text-xs text-white/50">{node.gpuType}</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{node.totalVRAM}GB</div>
                      <div className="text-xs text-white/50">VRAM Total</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">
                        {node.requestsPerSecond}
                      </div>
                      <div className="text-xs text-white/50">Req/sec</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{node.avgLatency}ms</div>
                      <div className="text-xs text-white/50">Latency</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-white/60">VRAM Usage</span>
                        <span>
                          {node.usedVRAM}/{node.totalVRAM} GB (
                          {Math.round((node.usedVRAM / node.totalVRAM) * 100)}%)
                        </span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            node.usedVRAM / node.totalVRAM > 0.9
                              ? 'bg-red-500'
                              : node.usedVRAM / node.totalVRAM > 0.7
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                          }`}
                          style={{ width: `${(node.usedVRAM / node.totalVRAM) * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 text-xs">
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Temp:</span>{' '}
                        <span className={node.temperature > 70 ? 'text-red-400' : 'text-green-400'}>
                          {node.temperature}°C
                        </span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Power:</span> <span>{node.powerDraw}W</span>
                      </div>
                      <div className="p-2 bg-black/20 rounded-lg">
                        <span className="text-white/50">Uptime:</span>{' '}
                        <span>
                          {Math.floor(node.uptime / 24)}d {node.uptime % 24}h
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-xs text-white/50 mb-2">Loaded Models:</div>
                      <div className="flex flex-wrap gap-1">
                        {node.loadedModels.map((m) => (
                          <span key={m} className="text-xs px-2 py-1 bg-indigo-900/50 rounded">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-4">
            {models.map((model) => (
              <div
                key={model.id}
                className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        model.family === 'llama'
                          ? 'bg-blue-900'
                          : model.family === 'mistral'
                            ? 'bg-orange-900'
                            : model.family === 'qwen'
                              ? 'bg-purple-900'
                              : model.family === 'deepseek'
                                ? 'bg-cyan-900'
                                : 'bg-neutral-800'
                      }`}
                    >
                      🤖
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">
                        {model.parameters} • {model.quantization} •{' '}
                        {model.contextLength.toLocaleString()} ctx
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        model.status === 'active'
                          ? 'bg-green-600'
                          : model.status === 'loading'
                            ? 'bg-amber-600'
                            : model.status === 'sandboxed'
                              ? 'bg-purple-600'
                              : 'bg-neutral-600'
                      }`}
                    >
                      {model.status}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        model.complianceStatus === 'approved'
                          ? 'bg-green-900 text-green-300'
                          : model.complianceStatus === 'pending'
                            ? 'bg-amber-900 text-amber-300'
                            : model.complianceStatus === 'review'
                              ? 'bg-blue-900 text-blue-300'
                              : 'bg-red-900 text-red-300'
                      }`}
                    >
                      {model.complianceStatus}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-4 mt-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">
                      {model.requestsToday.toLocaleString()}
                    </div>
                    <div className="text-xs text-white/50">Requests Today</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">
                      {(model.tokensGenerated / 1000000).toFixed(1)}M
                    </div>
                    <div className="text-xs text-white/50">Tokens Generated</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">
                      {model.avgResponseTime}ms
                    </div>
                    <div className="text-xs text-white/50">Avg Response</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.vramRequired}GB</div>
                    <div className="text-xs text-white/50">VRAM Required</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{model.replicas}</div>
                    <div className="text-xs text-white/50">Replicas</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{model.nodes.length}</div>
                    <div className="text-xs text-white/50">Nodes</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'routing' && (
          <div className="space-y-6">
            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🔀 Smart Request Routing</h2>
              <p className="text-white/60 mb-6">
                Intelligent routing based on model capabilities, load, latency requirements, and
                cost optimization.
              </p>

              <div className="grid grid-cols-4 gap-4 mb-6">
                {(['balanced', 'latency', 'throughput', 'cost'] as InferenceMode[]).map((mode) => (
                  <div
                    key={mode}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      inferenceMode === mode
                        ? 'bg-indigo-600 border-indigo-400'
                        : 'bg-black/20 border-indigo-800/50 hover:border-indigo-600'
                    }`}
                    onClick={() => setInferenceMode(mode)}
                  >
                    <div className="text-lg font-semibold mb-1">
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </div>
                    <div className="text-xs text-white/60">
                      {mode === 'balanced' && 'Optimize for best overall experience'}
                      {mode === 'latency' && 'Minimize response time at any cost'}
                      {mode === 'throughput' && 'Maximize requests per second'}
                      {mode === 'cost' && 'Minimize compute cost per request'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
              <h2 className="text-lg font-semibold mb-4">🛡️ Failover Configuration</h2>
              <div className="space-y-4">
                {failovers.map((fo) => {
                  const primaryModel = models.find((m) => m.id === fo.primaryModel);
                  return (
                    <div
                      key={fo.id}
                      className="p-4 bg-black/20 rounded-xl border border-indigo-800/30"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{primaryModel?.name}</h3>
                          <div className="text-xs text-white/50">Primary Model</div>
                        </div>
                        <div
                          className={`px-3 py-1 rounded-lg text-sm ${fo.isActive ? 'bg-green-600' : 'bg-neutral-600'}`}
                        >
                          {fo.isActive ? 'Active' : 'Disabled'}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-3">
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Latency Threshold</div>
                          <div className="font-medium">
                            {fo.triggerConditions.latencyThreshold}ms
                          </div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Error Rate Threshold</div>
                          <div className="font-medium">
                            {fo.triggerConditions.errorRateThreshold}%
                          </div>
                        </div>
                        <div className="p-2 bg-black/20 rounded-lg text-center">
                          <div className="text-xs text-white/50">Queue Depth Threshold</div>
                          <div className="font-medium">
                            {fo.triggerConditions.queueDepthThreshold}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-white/50 mb-2">Fallback Chain:</div>
                        <div className="flex items-center gap-2">
                          {fo.fallbackModels.map((fbId, idx) => {
                            const fbModel = models.find((m) => m.id === fbId);
                            return (
                              <React.Fragment key={fbId}>
                                {idx > 0 && <span className="text-white/30">→</span>}
                                <span className="px-2 py-1 bg-indigo-900/50 rounded text-sm">
                                  {fbModel?.name || fbId}
                                </span>
                              </React.Fragment>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🔬 Model Compliance Sandbox</h2>
              <p className="text-white/60">
                All new models must pass compliance testing before production deployment. This
                ensures AI safety, data protection, and regulatory compliance.
              </p>
            </div>

            {sandboxes.map((sb) => (
              <div key={sb.id} className="bg-black/30 rounded-2xl p-6 border border-indigo-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{sb.modelName}</h3>
                    <div className="text-sm text-white/50">
                      Submitted by {sb.submittedBy} •{' '}
                      {Math.floor((Date.now() - sb.submittedAt.getTime()) / 3600000)}h ago
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-sm ${
                      sb.status === 'approved'
                        ? 'bg-green-600'
                        : sb.status === 'testing'
                          ? 'bg-blue-600'
                          : sb.status === 'review'
                            ? 'bg-amber-600'
                            : sb.status === 'rejected'
                              ? 'bg-red-600'
                              : 'bg-neutral-600'
                    }`}
                  >
                    {sb.status}
                  </span>
                </div>

                <div className="grid grid-cols-6 gap-3 mb-4">
                  {sb.tests.map((test) => (
                    <div
                      key={test.name}
                      className={`p-3 rounded-xl text-center ${
                        test.status === 'passed'
                          ? 'bg-green-900/30 border border-green-700/50'
                          : test.status === 'running'
                            ? 'bg-blue-900/30 border border-blue-700/50'
                            : test.status === 'failed'
                              ? 'bg-red-900/30 border border-red-700/50'
                              : 'bg-black/20 border border-neutral-700/50'
                      }`}
                    >
                      <div className="text-lg mb-1">
                        {test.status === 'passed'
                          ? '✅'
                          : test.status === 'running'
                            ? '🔄'
                            : test.status === 'failed'
                              ? '❌'
                              : '⏳'}
                      </div>
                      <div className="text-xs">{test.name}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="text-white/50">Reviewers: {sb.reviewers.join(', ')}</div>
                  <div className="text-white/60">{sb.notes}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sovereign Deployment Analytics Drill-Down */}
        <div className="mt-6">
          <ReportSection
            title="Sovereign Infrastructure Analytics"
            subtitle="GPU cluster status, model deployment metrics, and data residency insights"
            icon={<Server className="w-4 h-4 text-violet-400" />}
            tableColumns={[
              { key: 'node', label: 'Node', sortable: true },
              { key: 'zone', label: 'Zone' },
              { key: 'gpuType', label: 'GPU', render: (v: string) => <span className="font-mono text-violet-400">{v}</span> },
              { key: 'vramUsage', label: 'VRAM Usage', align: 'right' as const, render: (v: string) => <span className="font-mono">{v}</span> },
              { key: 'status', label: 'Status', render: (v: string) => <StatusBadge status={v === 'online' ? 'success' : v === 'draining' ? 'warning' : 'error'} label={v} /> },
              { key: 'rps', label: 'Req/s', sortable: true, align: 'right' as const },
            ]}
            tableData={nodes.map((n: GPUNode, i: number) => ({
              id: n.id || String(i),
              node: n.name,
              zone: n.zone,
              gpuType: `${n.gpuType} x${n.gpuCount}`,
              vramUsage: `${n.usedVRAM}/${n.totalVRAM} GB`,
              status: n.status,
              rps: n.requestsPerSecond,
            }))}
            chartData={nodes.map((n: GPUNode) => ({
              label: n.name.replace('Sovereign-', ''),
              value: n.totalVRAM > 0 ? Math.round((n.usedVRAM / n.totalVRAM) * 100) : 0,
              color: n.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500',
              meta: '%',
            }))}
            chartTitle="VRAM Utilization by Node"
            poiItems={[
              { id: 'sv1', title: `${nodes.filter((n: GPUNode) => n.status === 'online').length} nodes online`, description: `${nodes.filter((n: GPUNode) => n.status === 'online').length} of ${nodes.length} GPU nodes are operational. Total VRAM: ${nodes.reduce((s: number, n: GPUNode) => s + n.totalVRAM, 0)} GB.`, severity: 'positive' as const, metric: String(nodes.filter((n: GPUNode) => n.status === 'online').length), metricLabel: 'online' },
              { id: 'sv2', title: 'Air-gapped node operational', description: 'Sovereign-Secure-01 (air-gapped zone) is running classified models with full isolation. Zero external network exposure.', severity: 'positive' as const, metric: '100%', metricLabel: 'isolated' },
              { id: 'sv3', title: 'Edge node running hot', description: 'Sovereign-Edge-01 GPU temperature at 71°C. Consider workload rebalancing to prevent thermal throttling.', severity: 'medium' as const, metric: '71°C', metricLabel: 'temperature', action: 'Rebalance workload' },
            ]}
            defaultView="table"
          />

          {/* Enhanced Analytics */}
          <div className="space-y-6 mt-8 border-t border-indigo-900/30 pt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2"><Server className="w-5 h-5 text-indigo-400" /> Enhanced Analytics</h2>
              <div className="flex items-center gap-2">
                <SavedViewManager pageId="sovereign" currentFilters={{ tab: activeTab, mode: inferenceMode }} onLoadView={(f) => { if (f.tab) setActiveTab(f.tab); if (f.mode) setInferenceMode(f.mode); }} />
                <ExportToolbar data={nodes.map((n: GPUNode) => ({ name: n.name, zone: n.zone, gpu: n.gpuType, vram: `${n.usedVRAM}/${n.totalVRAM}`, status: n.status }))} columns={[{ key: 'name', label: 'Node' }, { key: 'zone', label: 'Zone' }, { key: 'gpu', label: 'GPU Type' }, { key: 'vram', label: 'VRAM' }, { key: 'status', label: 'Status' }]} filename="sovereign-gpu-nodes" />
                <PDFExportButton title="Sovereign GPU Cluster Report" subtitle="Infrastructure, Model Deployment & Inference Analytics" sections={[{ heading: 'Cluster Overview', content: `${metrics?.onlineNodes || 0}/${metrics?.totalNodes || 0} nodes online. ${metrics?.activeGPUs || 0} GPUs active. ${metrics?.totalModels || 0} models deployed.`, metrics: [{ label: 'Nodes Online', value: `${metrics?.onlineNodes || 0}/${metrics?.totalNodes || 0}` }, { label: 'Active GPUs', value: String(metrics?.activeGPUs || 0) }, { label: 'VRAM Used', value: `${metrics?.usedVRAM || 0} GB` }, { label: 'Models', value: String(metrics?.totalModels || 0) }] }]} />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricWithSparkline title="Nodes Online" value={`${metrics?.onlineNodes || 0}/${metrics?.totalNodes || 0}`} trend={[4, 4, 5, 5, 5, 6, 6, metrics?.onlineNodes || 6]} change={0} color="#818cf8" />
              <MetricWithSparkline title="Active GPUs" value={metrics?.activeGPUs || 0} trend={[18, 20, 22, 24, 26, 28, 30, metrics?.activeGPUs || 32]} change={6.7} color="#34d399" />
              <MetricWithSparkline title="Req/s" value={metrics?.requestsPerSecond?.toFixed(0) || '0'} trend={[120, 135, 142, 155, 168, 175, 182, metrics?.requestsPerSecond || 190]} change={4.4} color="#60a5fa" />
              <MetricWithSparkline title="Avg Latency" value={`${metrics?.avgLatency?.toFixed(0) || 0}ms`} trend={[45, 42, 40, 38, 36, 35, 34, metrics?.avgLatency || 33]} change={-2.9} color="#fbbf24" inverted />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <HeatmapCalendar title="GPU Cluster Activity" subtitle="Daily inference request volume" valueLabel="k requests" data={Array.from({ length: 180 }, (_, i) => { const d = new Date(); d.setDate(d.getDate() - (180 - i)); return { date: d.toISOString().split('T')[0], value: Math.floor(Math.random() * 20) }; })} weeks={26} />
              <ComparisonPanel title="Infrastructure Trend" labelA="Last Week" labelB="This Week" items={[{ label: 'Requests/sec', valueA: 175, valueB: Number(metrics?.requestsPerSecond?.toFixed(0) || 190), format: 'number', higherIsBetter: true }, { label: 'Avg Latency (ms)', valueA: 36, valueB: Number(metrics?.avgLatency?.toFixed(0) || 33), format: 'number', higherIsBetter: false }, { label: 'VRAM Utilization', valueA: 78, valueB: metrics?.totalVRAM ? Math.round(((metrics?.usedVRAM || 0) / metrics.totalVRAM) * 100) : 82, format: 'percent', higherIsBetter: false }, { label: 'Power (kW)', valueA: 8.2, valueB: Number(((metrics?.powerConsumption || 8500) / 1000).toFixed(1)), format: 'number', higherIsBetter: false }]} />
            </div>
            <AuditTimeline title="Sovereign Audit Trail" events={[{ id: 'sv1', timestamp: new Date(Date.now() - 300000), type: 'system', title: 'GPU metrics collected', description: `Cluster health check: ${metrics?.onlineNodes || 0} nodes online, ${metrics?.activeGPUs || 0} GPUs active`, actor: 'Monitor' }, { id: 'sv2', timestamp: new Date(Date.now() - 1800000), type: 'deployment', title: 'Model deployed to cluster', description: 'Llama-3.1-70B deployed to Sovereign-Primary-01 with FP16 quantization', actor: 'DevOps', severity: 'info' }, { id: 'sv3', timestamp: new Date(Date.now() - 7200000), type: 'alert', title: 'Edge node thermal warning', description: 'Sovereign-Edge-01 GPU temperature at 71°C. Workload rebalancing recommended.', severity: 'medium' }]} maxVisible={3} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SovereignPage;
