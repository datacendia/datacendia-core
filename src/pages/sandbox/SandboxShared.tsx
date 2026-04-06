/**
 * Shared Sandbox Components
 *
 * Reusable UI components for all sandbox demo pages (Celtic, UEFA, FIFA).
 * Eliminates code duplication across sandbox pages.
 *
 * @module pages/sandbox/SandboxShared
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Shield, Lock, ChevronRight, AlertTriangle, CheckCircle, XCircle,
  Radio, Activity, FileText, Download, Users, Zap, Info,
  Database, ShieldCheck, Fingerprint, Link2, Play, RotateCcw,
  TrendingUp, Clock, Share, Eye, BarChart3, ChevronDown,
  Search, ArrowRight, PanelRightOpen, X,
} from 'lucide-react';
import { ComplianceScore, DecisionTimeline, EvidenceExplorer, ExportSharePanel, PreMortemAnalysis, GhostBoard, DecisionDebtTracker, ChronosTimeline, LiveDemoMode } from './SandboxEnhanced';
import Rule11Certification from './Rule11Certification';
import { Rule11ExportButton } from './Rule11CertificationPro';
import { ComplianceScore as ComplianceScorePro } from './ComplianceScorePro';

// =============================================================================
// TYPES
// =============================================================================

export type Phase = 'idle' | 'phase1' | 'phase2' | 'phase3' | 'complete';
export type MsgType = 'analysis' | 'flag' | 'warning' | 'dissent' | 'proposal' | 'resolution' | 'withdrawal';

export interface AgentMessage {
  agentId: string;
  phase: Phase;
  type: MsgType;
  content: string;
  delay: number;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

export interface Connector {
  name: string;
  status: 'connected' | 'syncing' | 'ready';
  type: string;
  icon: React.ReactNode;
  detail: string;
}

export interface ReceiptData {
  hash: string;
  merkleRoot: string;
  merkleLabel: string;
  timestamp: string;
  complianceLabel: string;
  complianceValue: string;
  complianceThreshold: string;
  agents: string[];
  dissents: number;
  dissentResolved: boolean;
  guaranteeTitle: string;
  guaranteeBody: string;
  evidenceChain: string;
  complianceScore?: number;
  timelineEvents?: TimelineEvent[];
  // Cortex Intelligence properties
  preMortemFailures?: Array<{
    type: string;
    probability: number;
    impact: string;
    description: string;
  }>;
  ghostAlternatives?: Array<{
    path: string;
    probability: number;
    outcome: string;
    reason: string;
  }>;
  decisionDebt?: Array<{
    decision: string;
    date: string;
    impact: number;
    accumulated: boolean;
  }>;
  totalDecisionDebt?: number;
  chronosEvents?: Array<{
    period: string;
    change: string;
    magnitude: number;
    trend: 'improving' | 'declining' | 'stable';
  }>;
  liveDemoActive?: boolean;
  liveDemoAction?: string;
  liveDemoProgress?: number;
}

export interface TimelineEvent {
  timestamp: string;
  type: 'analysis' | 'flag' | 'warning' | 'dissent' | 'proposal' | 'resolution' | 'withdrawal';
  title: string;
  description: string;
  agent?: string;
  impact: 'high' | 'medium' | 'low';
}

export interface ScenarioConfig {
  id: string;
  title: string;
  subtitle: string;
  banner: string;
  risk: string;
  scenarioNum: string;
  icon: React.ReactNode;
  color: string;
  agents: Agent[];
  connectors: Connector[];
  script: AgentMessage[];
  receiptTemplate: Omit<ReceiptData, 'timestamp'>;
  idleTitle: string;
  idleDesc: string;
  phaseLabels: [string, string, string];
}

export interface ShellLabels {
  dataConnectors: string;
  activeCouncil: string;
  deliberationTitle: string;
  readyToBegin: string;
  phase: string;
  deliberationComplete: string;
  runDeliberation: string;
  generateReceipt: string;
  generatingBundle: string;
  simulationNote: string;
  selectScenario: string;
  reset: string;
  confidential: string;
  executiveSandbox: string;
  connectorLive: string;
  connectorSync: string;
  connectorReady: string;
  complianceScore: string;
  timeline: string;
  evidenceExplorer: string;
  shareReport: string;
  exportData: string;
  viewDetails: string;
  hideDetails: string;
}

export const DEFAULT_LABELS: ShellLabels = {
  dataConnectors: 'Data Connectors',
  activeCouncil: 'Active Council',
  deliberationTitle: 'Multi-Agent Deliberation',
  readyToBegin: 'Ready to begin',
  phase: 'Phase',
  deliberationComplete: 'Deliberation Complete — Consensus Reached',
  runDeliberation: 'Run Deliberation',
  generateReceipt: "Generate Regulator's Receipt",
  generatingBundle: 'Generating Cryptographic Evidence Bundle...',
  simulationNote: 'SIMULATION NOTE:',
  selectScenario: 'Select Scenario',
  reset: 'Reset',
  confidential: 'CONFIDENTIAL',
  executiveSandbox: 'EXECUTIVE SANDBOX',
  connectorLive: 'LIVE',
  connectorSync: 'SYNC',
  connectorReady: 'READY',
  complianceScore: 'Compliance Score',
  timeline: 'Decision Timeline',
  evidenceExplorer: 'Evidence Explorer',
  shareReport: 'Share Report',
  exportData: 'Export Data',
  viewDetails: 'View Details',
  hideDetails: 'Hide Details',
};

export const ES_LABELS: ShellLabels = {
  dataConnectors: 'Conectores de Datos',
  activeCouncil: 'Consejo Activo',
  deliberationTitle: 'Deliberación Multi-Agente',
  readyToBegin: 'Listo para comenzar',
  phase: 'Fase',
  deliberationComplete: 'Deliberación Completa — Consenso Alcanzado',
  runDeliberation: 'Iniciar Deliberación',
  generateReceipt: 'Generar Recibo del Regulador',
  generatingBundle: 'Generando Paquete de Evidencia Criptográfica...',
  simulationNote: 'NOTA DE SIMULACIÓN:',
  selectScenario: 'Seleccionar Escenario',
  reset: 'Reiniciar',
  confidential: 'CONFIDENCIAL',
  executiveSandbox: 'SANDBOX EJECUTIVO',
  connectorLive: 'ACTIVO',
  connectorSync: 'SYNC',
  connectorReady: 'LISTO',
  complianceScore: 'Puntuación de Cumplimiento',
  timeline: 'Línea de Tiempo de Decisiones',
  evidenceExplorer: 'Explorador de Evidencia',
  shareReport: 'Compartir Informe',
  exportData: 'Exportar Datos',
  viewDetails: 'Ver Detalles',
  hideDetails: 'Ocultar Detalles',
};

export const PT_LABELS: ShellLabels = {
  dataConnectors: 'Conectores de Dados',
  activeCouncil: 'Conselho Ativo',
  deliberationTitle: 'Deliberação Multi-Agente',
  readyToBegin: 'Pronto para iniciar',
  phase: 'Fase',
  deliberationComplete: 'Deliberação Concluída — Consenso Alcançado',
  runDeliberation: 'Iniciar Deliberação',
  generateReceipt: 'Gerar Recibo do Regulador',
  generatingBundle: 'Gerando Pacote de Evidência Criptográfica...',
  simulationNote: 'NOTA DE SIMULAÇÃO:',
  selectScenario: 'Selecionar Cenário',
  reset: 'Reiniciar',
  confidential: 'CONFIDENCIAL',
  executiveSandbox: 'SANDBOX EXECUTIVO',
  connectorLive: 'ATIVO',
  connectorSync: 'SYNC',
  connectorReady: 'PRONTO',
  complianceScore: 'Pontuação de Conformidade',
  timeline: 'Linha do Tempo de Decisões',
  evidenceExplorer: 'Explorador de Evidências',
  shareReport: 'Compartilhar Relatório',
  exportData: 'Exportar Dados',
  viewDetails: 'Ver Detalhes',
  hideDetails: 'Ocultar Detalhes',
};

// =============================================================================
// HELPERS
// =============================================================================

export function generateReceipt(template: Omit<ReceiptData, 'timestamp'>): ReceiptData {
  return { ...template, timestamp: new Date().toISOString() };
}

export function getPhaseOrder(phase: Phase): number {
  const order: Record<Phase, number> = { idle: 0, phase1: 1, phase2: 2, phase3: 3, complete: 4 };
  return order[phase];
}

export function renderPhaseMarker(label: string, phaseId: Phase, currentPhase: Phase) {
  const isActive = currentPhase === phaseId;
  const isDone = getPhaseOrder(currentPhase) > getPhaseOrder(phaseId);
  return (
    <div key={phaseId} className="flex items-center gap-3 py-2">
      <div className={`w-6 h-px flex-1 ${isDone ? 'bg-emerald-400/30' : isActive ? 'bg-white/20' : 'bg-white/5'}`} />
      <span className={`text-[10px] font-bold tracking-[0.15em] uppercase ${
        isDone ? 'text-emerald-400/60' : isActive ? 'text-white/60' : 'text-white/20'
      }`}>{label}</span>
      <div className={`w-6 h-px flex-1 ${isDone ? 'bg-emerald-400/30' : isActive ? 'bg-white/20' : 'bg-white/5'}`} />
    </div>
  );
}

// =============================================================================
// COMPONENT — ACCESS GATE
// =============================================================================

export const AccessGate: React.FC<{
  onUnlock: () => void;
  accessKey: string;
  orgName: string;
  accentColor: string;
  accentHover: string;
  ringColor: string;
  borderColor: string;
  gradientFrom: string;
  gradientTo: string;
  sessionKey: string;
}> = ({ onUnlock, accessKey, orgName, accentColor, accentHover, ringColor, borderColor, gradientFrom, gradientTo }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError(false);
    setTimeout(() => {
      if (key.trim().toUpperCase() === accessKey) { onUnlock(); }
      else { setError(true); setChecking(false); }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${gradientFrom} ${gradientTo} border ${borderColor} mb-6`}>
            <Shield className={`w-10 h-10 ${accentColor}`} />
          </div>
          <h1 className="text-2xl font-light tracking-[0.3em] text-white/90 mb-2">DATACENDIA</h1>
          <p className="text-xs tracking-[0.2em] text-white/40 uppercase">{orgName} &mdash; Executive Sandbox</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-[#111118] border border-white/10 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <Lock className={`w-5 h-5 ${accentColor}`} />
            <span className="text-sm text-white/70">Enter your access key to continue</span>
          </div>
          <input ref={inputRef} type="text" value={key}
            onChange={(e) => { setKey(e.target.value); setError(false); }}
            placeholder="ACCESS KEY"
            className={`w-full px-4 py-3 bg-black/50 border rounded-lg text-white text-center tracking-[0.2em] font-mono text-sm placeholder:text-white/20 focus:outline-none focus:ring-2 transition-all ${
              error ? 'border-red-500/60 focus:ring-red-500/30' : `border-white/10 ${ringColor} ${borderColor}`
            }`}
          />
          {error && (
            <p className="text-red-400 text-xs text-center mt-3 flex items-center justify-center gap-1">
              <XCircle className="w-3 h-3" /> Invalid access key
            </p>
          )}
          <button type="submit" disabled={checking || !key.trim()}
            className={`w-full mt-4 py-3 bg-gradient-to-r ${accentHover} text-white rounded-lg font-medium text-sm tracking-wider disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2`}
          >
            {checking ? <span className="animate-pulse">Verifying...</span> : <>Enter Sandbox <ChevronRight className="w-4 h-4" /></>}
          </button>
        </form>
        <p className="text-center text-[10px] text-white/20 mt-8 tracking-wider">
          CONFIDENTIAL &middot; FOR {orgName.toUpperCase()} EXECUTIVE REVIEW ONLY
        </p>
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — CONNECTOR PANEL
// =============================================================================

export const ConnectorPanel: React.FC<{ connectors: Connector[]; labels?: ShellLabels }> = ({ connectors, labels }) => {
  const L = labels || DEFAULT_LABELS;
  return (
  <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
    <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
      <Database className="w-3.5 h-3.5" /> {L.dataConnectors}
    </h3>
    <div className="space-y-3">
      {connectors.map((c) => (
        <div key={c.name} className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
          <div className={`mt-0.5 ${c.status === 'connected' ? 'text-emerald-400' : c.status === 'syncing' ? 'text-amber-400' : 'text-blue-400'}`}>
            {c.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-white/80 truncate">{c.name}</span>
              <span className={`flex items-center gap-1 text-[10px] ${c.status === 'connected' ? 'text-emerald-400' : c.status === 'syncing' ? 'text-amber-400' : 'text-blue-400'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'connected' ? 'bg-emerald-400' : c.status === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-blue-400'}`} />
                {c.status === 'connected' ? L.connectorLive : c.status === 'syncing' ? L.connectorSync : L.connectorReady}
              </span>
            </div>
            <p className="text-[10px] text-white/40 mt-0.5">{c.type}</p>
            <p className="text-[10px] text-white/30 mt-0.5">{c.detail}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
};

// =============================================================================
// COMPONENT — AGENT CARD
// =============================================================================

export const AgentCard: React.FC<{ agent: Agent; active: boolean; speaking: boolean }> = ({ agent, active, speaking }) => (
  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${
    speaking ? `${agent.bgColor} ${agent.borderColor} shadow-lg` :
    active ? `bg-white/[0.03] ${agent.borderColor}` :
    'bg-white/[0.02] border-white/5 opacity-50'
  }`}>
    <div className="text-2xl">{agent.icon}</div>
    <div className="flex-1 min-w-0">
      <p className={`text-xs font-semibold ${agent.color}`}>{agent.name}</p>
      <p className="text-[10px] text-white/40 truncate">{agent.role}</p>
    </div>
    {speaking && (
      <div className="flex gap-0.5">
        <span className="w-1 h-3 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
        <span className="w-1 h-4 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
        <span className="w-1 h-2 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
      </div>
    )}
    {!speaking && active && <CheckCircle className="w-3.5 h-3.5 text-emerald-400/60" />}
  </div>
);

// =============================================================================
// COMPONENT — MESSAGE BUBBLE
// =============================================================================

export const MessageBubble: React.FC<{
  msg: AgentMessage; agents: Agent[]; visible: boolean;
  selected?: boolean; onSelect?: () => void;
}> = ({ msg, agents, visible, selected, onSelect }) => {
  const agent = agents.find((a) => a.id === msg.agentId);
  if (!visible || !agent) return null;
  const typeStyles: Record<string, string> = {
    analysis: 'border-l-cyan-400', flag: 'border-l-red-400', warning: 'border-l-red-500',
    dissent: 'border-l-amber-400', proposal: 'border-l-emerald-400', resolution: 'border-l-emerald-500', withdrawal: 'border-l-emerald-300',
  };
  const typeBadges: Record<string, { label: string; color: string }> = {
    analysis: { label: 'ANALYSIS', color: 'text-cyan-400 bg-cyan-400/10' },
    flag: { label: 'FLAG RAISED', color: 'text-red-400 bg-red-400/10' },
    warning: { label: 'WARNING', color: 'text-red-500 bg-red-500/10' },
    dissent: { label: 'DISSENT LOGGED', color: 'text-amber-400 bg-amber-400/10' },
    proposal: { label: 'PROPOSAL', color: 'text-emerald-400 bg-emerald-400/10' },
    resolution: { label: 'RESOLVED', color: 'text-emerald-500 bg-emerald-500/10' },
    withdrawal: { label: 'DISSENT WITHDRAWN', color: 'text-emerald-300 bg-emerald-300/10' },
  };
  const badge = typeBadges[msg.type];
  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${agent.name} ${badge.label}: ${msg.content.slice(0, 80)}...`}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect?.(); } }}
      className={`border-l-2 ${typeStyles[msg.type]} pl-4 py-3 animate-fadeIn cursor-pointer transition-all duration-200 rounded-r-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 ${
        selected
          ? 'bg-white/[0.06] ring-1 ring-white/10'
          : 'hover:bg-white/[0.03]'
      }`}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-lg">{agent.icon}</span>
        <span className={`text-xs font-semibold ${agent.color}`}>{agent.name}</span>
        <span className={`text-[9px] font-bold tracking-wider px-2 py-0.5 rounded-full ${badge.color}`}>{badge.label}</span>
        {selected && <Eye className="w-3 h-3 text-white/30 ml-auto" />}
      </div>
      <p className="text-sm text-white/80 leading-relaxed">{msg.content}</p>
    </div>
  );
};

// =============================================================================
// COMPONENT — TYPING INDICATOR
// =============================================================================

export const TypingIndicator: React.FC<{ agentId: string; agents: Agent[] }> = ({ agentId, agents }) => {
  const agent = agents.find((a) => a.id === agentId);
  if (!agent) return null;
  return (
    <div className="flex items-center gap-2 pl-4 py-2 animate-fadeIn">
      <span className="text-lg">{agent.icon}</span>
      <span className={`text-xs ${agent.color}`}>{agent.name}</span>
      <div className="flex gap-1 ml-1">
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — REGULATOR'S RECEIPT (parameterised accent)
// =============================================================================

export const RegulatorsReceipt: React.FC<{ receipt: ReceiptData; accent?: string }> = ({ receipt, accent = 'emerald' }) => {
  const a = accent;
  return (
    <div className={`bg-[#0d1117] border border-${a}-500/30 rounded-xl p-6 animate-fadeIn`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-lg bg-${a}-500/10 border border-${a}-500/30 flex items-center justify-center`}>
          <Fingerprint className={`w-5 h-5 text-${a}-400`} />
        </div>
        <div>
          <h3 className={`text-sm font-bold text-${a}-400 tracking-wider`}>THE REGULATOR'S RECEIPT</h3>
          <p className="text-[10px] text-white/40">Cryptographically Sealed Decision Record</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 flex items-center gap-1.5">
            <Download className="w-3 h-3" /> PDF
          </button>
          <button className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/60 hover:bg-white/10 flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> JSON
          </button>
        </div>
      </div>
      <div className="bg-black/40 border border-white/5 rounded-lg p-3 mb-3 font-mono">
        <p className="text-[10px] text-white/40 mb-1">Decision Hash</p>
        <p className={`text-xs text-${a}-400 break-all`}>{receipt.hash}</p>
      </div>
      <div className="bg-black/40 border border-white/5 rounded-lg p-3 mb-3 font-mono">
        <p className="text-[10px] text-white/40 mb-1">{receipt.merkleLabel}</p>
        <p className="text-xs text-purple-400 break-all">{receipt.merkleRoot}</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-[10px] text-white/40 mb-1">Timestamp (RFC 3161)</p>
          <p className="text-xs text-white/80 font-mono">{receipt.timestamp}</p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-[10px] text-white/40 mb-1">{receipt.complianceLabel}</p>
          <p className={`text-xs text-${a}-400 font-bold`}>{receipt.complianceValue} <span className={`text-${a}-400/60 font-normal`}>({receipt.complianceThreshold})</span></p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-[10px] text-white/40 mb-1">Dissents Filed / Resolved</p>
          <p className="text-xs text-white/80">{receipt.dissents} filed &middot; <span className="text-emerald-400">All resolved</span></p>
        </div>
        <div className="bg-black/30 rounded-lg p-3">
          <p className="text-[10px] text-white/40 mb-1">Participating Agents</p>
          <p className="text-xs text-white/80">{receipt.agents.length} agents</p>
        </div>
      </div>
      <div className={`bg-${a}-500/5 border border-${a}-500/20 rounded-lg p-4`}>
        <div className="flex items-start gap-3">
          <ShieldCheck className={`w-5 h-5 text-${a}-400 mt-0.5 flex-shrink-0`} />
          <div>
            <p className={`text-sm font-semibold text-${a}-400 mb-1`}>{receipt.guaranteeTitle}</p>
            <p className="text-xs text-white/60 leading-relaxed">{receipt.guaranteeBody}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-[10px] text-white/30">
        <Link2 className="w-3 h-3" />
        <span>Evidence chain: {receipt.evidenceChain}</span>
      </div>
    </div>
  );
};

// =============================================================================
// HELPERS — Parse reasoning steps from message content
// =============================================================================

interface ReasoningStep {
  label: string;
  detail: string;
  status: 'complete' | 'active' | 'pending';
  icon: React.ReactNode;
}

/** Extract reasoning steps from an agent message. Parses numbered items, key statements, and conclusions. */
function deriveReasoningSteps(msg: AgentMessage, agent: Agent): ReasoningStep[] {
  const content = msg.content;
  const steps: ReasoningStep[] = [];

  // Step 1: Always starts with data ingestion
  steps.push({
    label: 'Data Ingestion',
    detail: `${agent.name} connected to governance data sources and regulatory frameworks.`,
    status: 'complete',
    icon: <Database className="w-3 h-3" />,
  });

  // Step 2: Extract numbered points from content — (1), (2), etc.
  const numbered = content.match(/\(\d+\)\s*[^(]+/g);
  if (numbered && numbered.length > 0) {
    steps.push({
      label: 'Pattern Analysis',
      detail: `Identified ${numbered.length} key factor${numbered.length > 1 ? 's' : ''}: ${numbered.slice(0, 3).map(n => n.replace(/\(\d+\)\s*/, '').split('.')[0].split('—')[0].trim()).join(', ')}${numbered.length > 3 ? '...' : ''}`,
      status: 'complete',
      icon: <Search className="w-3 h-3" />,
    });
  }

  // Step 3: Look for percentage/number citations
  const stats = content.match(/\d+\.?\d*%|\$[\d,.]+[BMK]?|€[\d,.]+[BMK]?|£[\d,.]+[BMK]?|\d+[BMK]\+?/g);
  if (stats && stats.length > 0) {
    const unique = [...new Set(stats)].slice(0, 4);
    steps.push({
      label: 'Quantitative Assessment',
      detail: `Evaluated metrics: ${unique.join(', ')}. Cross-referenced against regulatory thresholds.`,
      status: 'complete',
      icon: <Activity className="w-3 h-3" />,
    });
  }

  // Step 4: Regulatory/legal references
  const regRefs = content.match(/Article \d+|Art\. \d+|Section \d+|Rule \d+|GDPR|EU AI Act|SOC 2|HIPAA|PCI|ITAR|NIST|FCA|SEC|PSD2|DORA|DSA/g);
  if (regRefs && regRefs.length > 0) {
    const unique = [...new Set(regRefs)].slice(0, 4);
    steps.push({
      label: 'Regulatory Mapping',
      detail: `Matched against ${unique.join(', ')}. Compliance gap analysis complete.`,
      status: 'complete',
      icon: <ShieldCheck className="w-3 h-3" />,
    });
  }

  // Step 5: Cendia service references
  const services = content.match(/Cendia\w+™/g);
  if (services && services.length > 0) {
    const unique = [...new Set(services)].slice(0, 3);
    steps.push({
      label: 'Service Orchestration',
      detail: `Routed through ${unique.join(', ')} for evidence generation.`,
      status: 'complete',
      icon: <Link2 className="w-3 h-3" />,
    });
  }

  // Step 6: Risk / dissent / resolution conclusion
  const typeConclusion: Record<string, { label: string; detail: string; icon: React.ReactNode }> = {
    analysis: { label: 'Assessment Published', detail: 'Analysis sealed to governance ledger with evidence hash.', icon: <FileText className="w-3 h-3" /> },
    warning: { label: 'Warning Issued', detail: 'Risk threshold exceeded. Alert propagated to council.', icon: <AlertTriangle className="w-3 h-3" /> },
    dissent: { label: 'Dissent Registered', detail: 'Disagreement logged with cryptographic attestation. Requires resolution.', icon: <XCircle className="w-3 h-3" /> },
    flag: { label: 'Flag Raised', detail: 'Critical finding flagged for council review and human oversight.', icon: <AlertTriangle className="w-3 h-3" /> },
    proposal: { label: 'Proposal Formulated', detail: 'Governance recommendation constructed from evidence chain.', icon: <ArrowRight className="w-3 h-3" /> },
    resolution: { label: 'Consensus Reached', detail: 'All dissents addressed. Resolution sealed with multi-agent signatures.', icon: <CheckCircle className="w-3 h-3" /> },
    withdrawal: { label: 'Dissent Withdrawn', detail: 'Objection resolved through evidence. Withdrawal logged immutably.', icon: <CheckCircle className="w-3 h-3" /> },
  };
  const conclusion = typeConclusion[msg.type] || typeConclusion.analysis;
  steps.push({
    label: conclusion.label,
    detail: conclusion.detail,
    status: 'complete',
    icon: conclusion.icon,
  });

  return steps;
}

// =============================================================================
// COMPONENT — AGENT REASONING PANEL
// =============================================================================

export const AgentReasoningPanel: React.FC<{
  messages: AgentMessage[];
  agents: Agent[];
  visibleCount: number;
  typingAgent: string | null;
  phase: Phase;
  accent?: string;
  selectedIdx?: number | null;
}> = ({ messages, agents, visibleCount, typingAgent, phase, accent = 'emerald', selectedIdx }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  // Get the most recent visible message
  const visibleMessages = messages.slice(0, visibleCount);
  const latestMsg = visibleMessages.length > 0 ? visibleMessages[visibleMessages.length - 1] : null;
  const typingAgentData = typingAgent ? agents.find(a => a.id === typingAgent) : null;

  // Show reasoning for selected message, or latest if none selected
  const focusedIdx = selectedIdx != null && selectedIdx < visibleMessages.length ? selectedIdx : (visibleMessages.length > 0 ? visibleMessages.length - 1 : null);
  const focusedMsg = focusedIdx != null ? visibleMessages[focusedIdx] : null;
  const focusedAgent = focusedMsg ? agents.find(a => a.id === focusedMsg.agentId) : null;

  // Derive reasoning steps for the focused message
  const steps = useMemo(() => {
    if (!focusedMsg || !focusedAgent) return [];
    return deriveReasoningSteps(focusedMsg, focusedAgent);
  }, [focusedMsg, focusedAgent]);

  // Reset expanded step when focused message changes
  useEffect(() => { setExpandedStep(null); }, [focusedIdx]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [visibleCount, typingAgent]);

  return (
    <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/10 flex-shrink-0">
        <h3 className="text-xs font-semibold tracking-[0.15em] text-white/50 uppercase flex items-center gap-2">
          <Eye className="w-3.5 h-3.5" /> Agent Reasoning
        </h3>
        <p className="text-[10px] text-white/30 mt-0.5">Step-by-step formulation trace</p>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {phase === 'idle' ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <Eye className="w-8 h-8 text-white/10 mb-3" />
            <p className="text-[11px] text-white/30">Run a deliberation to see agent reasoning</p>
          </div>
        ) : (
          <>
            {/* History: show agent + type for each prior message */}
            {visibleMessages.slice(0, -1).map((msg, i) => {
              const a = agents.find(ag => ag.id === msg.agentId);
              if (!a) return null;
              const typeBadge: Record<string, { label: string; color: string }> = {
                analysis: { label: 'ANALYSIS', color: 'text-cyan-400' },
                warning: { label: 'WARNING', color: 'text-red-500' },
                dissent: { label: 'DISSENT', color: 'text-amber-400' },
                flag: { label: 'FLAG', color: 'text-red-400' },
                proposal: { label: 'PROPOSAL', color: 'text-emerald-400' },
                resolution: { label: 'RESOLVED', color: 'text-emerald-500' },
                withdrawal: { label: 'WITHDRAWN', color: 'text-emerald-300' },
              };
              const badge = typeBadge[msg.type] || typeBadge.analysis;
              return (
                <div key={i} className="flex items-center gap-2 opacity-40">
                  <span className="text-sm">{a.icon}</span>
                  <span className="text-[10px] text-white/60 truncate flex-1">{a.name}</span>
                  <span className={`text-[8px] font-bold tracking-wider ${badge.color}`}>{badge.label}</span>
                  <CheckCircle className="w-3 h-3 text-emerald-400/40 flex-shrink-0" />
                </div>
              );
            })}

            {/* Active: typing state */}
            {typingAgentData && !latestMsg && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{typingAgentData.icon}</span>
                  <span className={`text-[11px] font-semibold ${typingAgentData.color}`}>{typingAgentData.name}</span>
                  <span className="text-[9px] text-white/30 animate-pulse">processing...</span>
                </div>
                <div className="space-y-2 ml-5">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-white/40">Ingesting data sources...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Current: detailed reasoning steps for focused message */}
            {focusedMsg && focusedAgent && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm">{focusedAgent.icon}</span>
                  <span className={`text-[11px] font-semibold ${focusedAgent.color}`}>{focusedAgent.name}</span>
                </div>
                {selectedIdx != null && (
                  <p className="text-[9px] text-white/25 mb-3 ml-6">Message {(selectedIdx ?? 0) + 1} of {visibleMessages.length} — click steps below to expand</p>
                )}
                <div className="space-y-0 ml-1">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      role="button"
                      tabIndex={0}
                      aria-expanded={expandedStep === i}
                      aria-label={`${step.label}: ${step.detail}`}
                      className="flex items-start gap-2.5 relative cursor-pointer group focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20 rounded"
                      onClick={() => setExpandedStep(expandedStep === i ? null : i)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpandedStep(expandedStep === i ? null : i); } }}
                    >
                      {/* Vertical connector line */}
                      {i < steps.length - 1 && (
                        <div className="absolute left-[7px] top-[18px] w-px h-[calc(100%-4px)] bg-white/[0.06]" />
                      )}
                      {/* Step dot */}
                      <div className={`w-[15px] h-[15px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                        step.status === 'complete' ? 'bg-emerald-500/15 text-emerald-400' :
                        step.status === 'active' ? `bg-${accent}-500/15 text-${accent}-400` :
                        'bg-white/[0.04] text-white/20'
                      } ${expandedStep === i ? 'ring-1 ring-white/20' : ''}`}>
                        {step.icon}
                      </div>
                      {/* Step content */}
                      <div className="pb-3 flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-[10px] font-semibold transition-colors ${
                            expandedStep === i ? 'text-white/90' : 'text-white/70 group-hover:text-white/80'
                          }`}>{step.label}</p>
                          <ChevronDown className={`w-2.5 h-2.5 text-white/30 transition-transform duration-200 ${
                            expandedStep === i ? 'rotate-180' : ''
                          }`} />
                        </div>
                        <p className="text-[9px] text-white/40 leading-relaxed mt-0.5">{step.detail}</p>
                        {expandedStep === i && (
                          <div className="mt-2 p-2 bg-white/[0.03] border border-white/[0.06] rounded-md animate-fadeIn">
                            <p className="text-[9px] text-white/50 leading-relaxed">
                              <span className="font-semibold text-white/60">How it works:</span>{' '}
                              {step.label === 'Data Ingestion'
                                ? `${focusedAgent.name} connects to all configured data connectors and governance frameworks, pulling real-time regulatory feeds, internal policy documents, and market intelligence. Each data source is validated and timestamped before analysis begins.`
                                : step.label === 'Pattern Analysis'
                                ? `Advanced pattern recognition scans the ingested data for structural similarities, anomalies, and correlations across historical precedents. Key factors are ranked by relevance and impact score before being passed to quantitative models.`
                                : step.label === 'Quantitative Assessment'
                                ? `Statistical models evaluate the identified metrics against regulatory thresholds, industry benchmarks, and historical baselines. Confidence intervals and variance analysis ensure output reliability.`
                                : step.label === 'Regulatory Mapping'
                                ? `Each finding is cross-referenced against the applicable regulatory framework. Gap analysis identifies compliance shortfalls and maps remediation pathways with estimated timelines.`
                                : step.label === 'Service Orchestration'
                                ? `The agent orchestrates Cendia platform services to generate cryptographically verifiable evidence packages, route approvals, and trigger downstream compliance workflows automatically.`
                                : `${focusedAgent.name} synthesizes all prior reasoning steps into a final position, applying weighted scoring across risk, compliance, and governance dimensions. The output is sealed with a cryptographic attestation to the governance ledger.`
                              }
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Typing indicator when agent is processing next message */}
            {typingAgentData && latestMsg && (
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{typingAgentData.icon}</span>
                  <span className={`text-[11px] font-semibold ${typingAgentData.color}`}>{typingAgentData.name}</span>
                  <span className="text-[9px] text-white/30 animate-pulse">formulating response...</span>
                </div>
                <div className="space-y-1.5 ml-5 mt-2">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-[10px] text-white/40">Ingesting governance data...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" style={{ animationDelay: '300ms' }} />
                    <span className="text-[10px] text-white/30">Cross-referencing regulations...</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: '600ms' }} />
                    <span className="text-[10px] text-white/20">Formulating position...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Complete state */}
            {phase === 'complete' && (
              <div className="border-t border-white/[0.06] pt-3 mt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-semibold text-emerald-400">Deliberation Complete</span>
                </div>
                <p className="text-[9px] text-white/30 mt-1 ml-6">All agents have published positions. {visibleMessages.length} reasoning chains sealed.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// COMPONENT — SCENARIO SELECTOR
// =============================================================================

export const ScenarioSelector: React.FC<{
  scenarios: ScenarioConfig[];
  activeId: string;
  onSelect: (id: string) => void;
  disabled: boolean;
  accent?: string;
  labels?: ShellLabels;
}> = ({ scenarios, activeId, onSelect, disabled, accent = 'emerald', labels }) => {
  const L = labels || DEFAULT_LABELS;
  const [expanded, setExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const filteredScenarios = searchQuery.trim()
    ? scenarios.filter((s) => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.subtitle?.toLowerCase().includes(searchQuery.toLowerCase()))
    : scenarios;
  const visibleScenarios = expanded || searchQuery.trim() ? filteredScenarios : filteredScenarios.slice(0, 10);
  const hasMore = filteredScenarios.length > 10 && !searchQuery.trim();

  return (
  <div className="mb-6">
    {/* Section header — matches dashboard style */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-semibold tracking-[0.15em] text-white/40 uppercase flex items-center gap-2">
        <Zap className="w-3.5 h-3.5" /> {L.selectScenario}
        <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full bg-${accent}-500/10 text-${accent}-400`}>{filteredScenarios.length}</span>
      </h3>
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="w-3 h-3 text-white/30 absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scenarios..."
            className="text-[10px] bg-white/[0.04] border border-white/[0.08] rounded-lg pl-6 pr-2 py-1.5 text-white/70 placeholder:text-white/20 focus:outline-none focus:border-white/20 w-40 transition-colors"
          />
        </div>
        {hasMore && (
          <button onClick={() => setExpanded(!expanded)} className="text-[10px] text-white/30 hover:text-white/50 transition-colors flex items-center gap-1">
            {expanded ? 'Show Less' : `View All (${scenarios.length})`} <ChevronRight className={`w-3 h-3 transition-transform ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
    </div>

    {/* Card grid — dashboard-style layout */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
      {visibleScenarios.map((s) => {
        const isActive = s.id === activeId;
        const riskColor = s.risk === 'Critical' ? 'red' : s.risk === 'High' ? 'amber' : 'cyan';
        return (
          <button key={s.id} onClick={() => !disabled && onSelect(s.id)} disabled={disabled}
            className={`group relative text-left rounded-xl border p-3 transition-all ${
              isActive
                ? `bg-${accent}-500/[0.08] border-${accent}-500/30`
                : 'bg-[#111118] border-white/[0.06] hover:border-white/[0.12] hover:bg-white/[0.03]'
            } ${disabled && !isActive ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {/* Top row: icon + number */}
            <div className="flex items-center justify-between mb-2">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                isActive
                  ? `bg-${accent}-500/15 text-${accent}-400`
                  : `bg-white/[0.04] text-white/40 group-hover:text-white/60`
              }`}>
                {s.icon}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  s.risk === 'Critical' ? 'bg-red-400' : s.risk === 'High' ? 'bg-amber-400' : 'bg-cyan-400'
                }`} />
                <span className={`text-[10px] font-mono ${isActive ? `text-${accent}-400/70` : 'text-white/20'}`}>{s.scenarioNum}</span>
              </div>
            </div>

            {/* Title */}
            <p className={`text-[11px] font-medium leading-tight line-clamp-2 mb-1.5 ${
              isActive ? `text-${accent}-300` : 'text-white/70 group-hover:text-white/80'
            }`}>{s.title}</p>

            {/* Risk badge */}
            <span className={`text-[9px] font-semibold tracking-wider px-1.5 py-0.5 rounded bg-${riskColor}-500/10 text-${riskColor}-400`}>
              {s.risk.toUpperCase()}
            </span>
          </button>
        );
      })}
    </div>
  </div>
);
};

// =============================================================================
// MAIN SANDBOX SHELL — Reusable across all sandbox pages
// =============================================================================

export const SandboxShell: React.FC<{
  scenarios: ScenarioConfig[];
  orgLabel: string;
  accent?: string;
  footerNote?: string;
  headerExtra?: React.ReactNode;
  labels?: ShellLabels;
}> = ({ scenarios, orgLabel, accent = 'emerald', footerNote, headerExtra, labels: _labels }) => {
  const L = _labels || DEFAULT_LABELS;
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0].id);
  const [phase, setPhase] = useState<Phase>('idle');
  const [visibleMessages, setVisibleMessages] = useState<number>(0);
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);
  const [generatingReceipt, setGeneratingReceipt] = useState(false);
  const [selectedMessageIdx, setSelectedMessageIdx] = useState<number | null>(null);
  const [mobileReasoningOpen, setMobileReasoningOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const scenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  useEffect(() => { return () => { timeoutsRef.current.forEach(clearTimeout); }; }, []);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [visibleMessages, typingAgent]);

  const handleSelectScenario = (id: string) => {
    if (phase !== 'idle' && phase !== 'complete') return;
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setActiveScenarioId(id);
    setPhase('idle');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
    setSelectedMessageIdx(null);
  };

  const runDeliberation = useCallback(() => {
    setPhase('phase1');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
    setSelectedMessageIdx(null);
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    let cumulativeDelay = 0;
    const phases: Phase[] = ['phase1', 'phase2', 'phase3'];
    let currentPhaseIdx = 0;

    scenario.script.forEach((msg, idx) => {
      const msgPhaseIdx = phases.indexOf(msg.phase);
      if (msgPhaseIdx > currentPhaseIdx) {
        cumulativeDelay += 1500;
        const t = setTimeout(() => setPhase(phases[msgPhaseIdx]), cumulativeDelay);
        timeoutsRef.current.push(t);
        currentPhaseIdx = msgPhaseIdx;
      }
      cumulativeDelay += msg.delay;
      timeoutsRef.current.push(setTimeout(() => setTypingAgent(msg.agentId), cumulativeDelay));
      cumulativeDelay += 1200;
      timeoutsRef.current.push(setTimeout(() => { setTypingAgent(null); setVisibleMessages(idx + 1); }, cumulativeDelay));
    });

    cumulativeDelay += 1000;
    timeoutsRef.current.push(setTimeout(() => setPhase('complete'), cumulativeDelay));
  }, [scenario]);

  const handleGenerateReceipt = () => {
    setGeneratingReceipt(true);
    setTimeout(() => { setReceipt(generateReceipt(scenario.receiptTemplate)); setGeneratingReceipt(false); }, 2500);
  };

  const handleReset = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setPhase('idle');
    setVisibleMessages(0);
    setTypingAgent(null);
    setReceipt(null);
    setGeneratingReceipt(false);
  };

  const activeAgentIds = scenario.script.slice(0, visibleMessages).map((m) => m.agentId);
  const isRunning = phase !== 'idle' && phase !== 'complete';

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="border-b border-white/10 bg-[#0d0d14]/80 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className={`w-5 h-5 text-${accent}-400`} />
            <span className="text-sm font-light tracking-[0.25em] text-white/80">DATACENDIA</span>
            <span className="text-white/20">|</span>
            <span className={`text-xs tracking-wider text-${accent}-400/80`}>{orgLabel} SANDBOX</span>
          </div>
          <div className="flex items-center gap-3">
            {headerExtra}
            {phase !== 'idle' && (
              <button onClick={handleReset} className="px-3 py-1.5 text-[10px] bg-white/5 border border-white/10 rounded-lg text-white/50 hover:bg-white/10 flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> {L.reset}
              </button>
            )}
            <span className="text-[10px] text-white/30 tracking-wider font-mono">v2.4.1</span>
          </div>
        </div>
      </header>

      <div className="bg-amber-500/5 border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-xs text-amber-400/80"><strong>{L.simulationNote}</strong> {scenario.banner}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <ScenarioSelector scenarios={scenarios} activeId={activeScenarioId} onSelect={handleSelectScenario} disabled={isRunning} accent={accent} labels={L} />

        <div className="mb-6">
          <h1 className="text-xl font-light tracking-wider text-white/90 mb-1">{scenario.title}</h1>
          <p className="text-sm text-white/40">{scenario.subtitle}</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <ConnectorPanel connectors={scenario.connectors} labels={L} />
            <div className="bg-[#111118] border border-white/10 rounded-xl p-4">
              <h3 className="text-xs font-semibold tracking-[0.15em] text-white/60 uppercase mb-4 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> {L.activeCouncil}
              </h3>
              <div className="space-y-2">
                {scenario.agents.map((agent) => (
                  <AgentCard key={agent.id} agent={agent}
                    active={phase !== 'idle' && (activeAgentIds.includes(agent.id) || typingAgent === agent.id)}
                    speaking={typingAgent === agent.id}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6">
            <div className="bg-[#111118] border border-white/10 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                    <Radio className={`w-4 h-4 text-${accent}-400`} /> {L.deliberationTitle}
                  </h2>
                  <p className="text-[10px] text-white/40 mt-0.5">
                    {phase === 'idle' ? L.readyToBegin :
                     phase === 'phase1' ? `${L.phase} 1 — ${scenario.phaseLabels[0]}` :
                     phase === 'phase2' ? `${L.phase} 2 — ${scenario.phaseLabels[1]}` :
                     phase === 'phase3' ? `${L.phase} 3 — ${scenario.phaseLabels[2]}` :
                     L.deliberationComplete}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['phase1', 'phase2', 'phase3', 'complete'] as Phase[]).map((p, i) => (
                    <div key={p} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full transition-all duration-500 ${getPhaseOrder(phase) >= getPhaseOrder(p) ? 'bg-emerald-400' : 'bg-white/10'}`} />
                      {i < 3 && <div className={`w-6 h-px transition-all duration-500 ${getPhaseOrder(phase) > getPhaseOrder((['phase1', 'phase2', 'phase3', 'complete'] as Phase[])[i]) ? 'bg-emerald-400/40' : 'bg-white/10'}`} />}
                    </div>
                  ))}
                </div>
              </div>

              <div ref={scrollRef} className="p-5 min-h-[400px] max-h-[600px] overflow-y-auto space-y-4">
                {phase === 'idle' ? (
                  <div className="flex flex-col items-center justify-center h-[380px] text-center">
                    <div className={`w-20 h-20 rounded-2xl bg-${accent}-500/10 border border-${accent}-500/20 flex items-center justify-center mb-6`}>
                      <Play className={`w-8 h-8 text-${accent}-400 ml-1`} />
                    </div>
                    <h3 className="text-lg font-light text-white/80 mb-2">{scenario.idleTitle}</h3>
                    <p className="text-xs text-white/40 max-w-md mb-6">{scenario.idleDesc}</p>
                    <button onClick={runDeliberation}
                      className={`px-8 py-3 bg-gradient-to-r from-${accent}-600 to-${accent}-700 text-white rounded-xl font-medium text-sm tracking-wider hover:from-${accent}-500 hover:to-${accent}-600 transition-all flex items-center gap-2 shadow-lg shadow-${accent}-900/30`}
                    >
                      <Play className="w-4 h-4" /> {L.runDeliberation}
                    </button>
                  </div>
                ) : (
                  <>
                    {renderPhaseMarker(`${L.phase} 1 — ${scenario.phaseLabels[0]}`, 'phase1', phase)}
                    {scenario.script.filter((m) => m.phase === 'phase1').map((msg) => {
                      const gi = scenario.script.indexOf(msg);
                      return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages}
                        selected={selectedMessageIdx === gi} onSelect={() => setSelectedMessageIdx(gi)} />;
                    })}
                    {getPhaseOrder(phase) >= getPhaseOrder('phase2') && (
                      <>
                        {renderPhaseMarker(`${L.phase} 2 — ${scenario.phaseLabels[1]}`, 'phase2', phase)}
                        {scenario.script.filter((m) => m.phase === 'phase2').map((msg) => {
                          const gi = scenario.script.indexOf(msg);
                          return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages}
                            selected={selectedMessageIdx === gi} onSelect={() => setSelectedMessageIdx(gi)} />;
                        })}
                      </>
                    )}
                    {getPhaseOrder(phase) >= getPhaseOrder('phase3') && (
                      <>
                        {renderPhaseMarker(`${L.phase} 3 — ${scenario.phaseLabels[2]}`, 'phase3', phase)}
                        {scenario.script.filter((m) => m.phase === 'phase3').map((msg) => {
                          const gi = scenario.script.indexOf(msg);
                          return <MessageBubble key={gi} msg={msg} agents={scenario.agents} visible={gi < visibleMessages}
                            selected={selectedMessageIdx === gi} onSelect={() => setSelectedMessageIdx(gi)} />;
                        })}
                      </>
                    )}
                    {typingAgent && <TypingIndicator agentId={typingAgent} agents={scenario.agents} />}
                  </>
                )}
              </div>

              {phase === 'complete' && !receipt && (
                <div className="px-5 py-4 border-t border-white/10 bg-emerald-500/[0.03]">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-3 h-3 text-white/20" />
                    <p className="text-[9px] text-white/30">
                      Evidence hash · Merkle proof · Compliance status · {scenario.script.length} agent signatures
                    </p>
                  </div>
                  <button onClick={handleGenerateReceipt} disabled={generatingReceipt}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl font-semibold text-sm tracking-wider hover:from-emerald-400 hover:to-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40 disabled:opacity-60"
                  >
                    {generatingReceipt ? (
                      <><span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> {L.generatingBundle}</>
                    ) : (
                      <><Fingerprint className="w-5 h-5" /> {L.generateReceipt}</>
                    )}
                  </button>
                </div>
              )}
            </div>

            {receipt && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Compliance Score & Key Metrics */}
                  <div className="space-y-6">
                    <div className="bg-black/40 border border-white/10 rounded-xl">
                      <ComplianceScorePro 
                        phase={phase}
                        citationsVerified={phase === 'phase2' ? Math.floor((visibleMessages / scenario.script.filter(m => m.phase === 'phase2').length) * 14) : phase === 'phase3' ? 14 : 0}
                        totalCitations={14}
                      />
                    </div>
                    
                    {/* Cortex Intelligence Components - Left */}
                    {receipt.preMortemFailures && receipt.preMortemFailures.length > 0 && (
                      <PreMortemAnalysis failures={receipt.preMortemFailures} accent={accent} labels={L} />
                    )}
                    {receipt.decisionDebt && receipt.totalDecisionDebt !== undefined && (
                      <DecisionDebtTracker debt={receipt.decisionDebt} totalDebt={receipt.totalDecisionDebt} accent={accent} labels={L} />
                    )}
                    {receipt.liveDemoActive !== undefined && (
                      <LiveDemoMode 
                        isActive={receipt.liveDemoActive} 
                        currentAction={receipt.liveDemoAction || 'Processing...'} 
                        progress={receipt.liveDemoProgress || 0} 
                        accent={accent} 
                        labels={L} 
                      />
                    )}
                  </div>
                  
                  {/* Right Column - Timeline & Analysis */}
                  <div className="space-y-6">
                    <DecisionTimeline 
                      events={receipt.timelineEvents || [
                        {
                          timestamp: receipt.timestamp,
                          type: 'resolution',
                          title: 'Sandbox Completed',
                          description: 'Multi-agent deliberation complete with consensus',
                          impact: 'medium'
                        }
                      ]} 
                      accent={accent} 
                    />
                    <EvidenceExplorer receipt={receipt} accent={accent} labels={L} />
                    
                    {/* Cortex Intelligence Components - Right */}
                    {receipt.ghostAlternatives && receipt.ghostAlternatives.length > 0 && (
                      <GhostBoard alternatives={receipt.ghostAlternatives} accent={accent} labels={L} />
                    )}
                    {receipt.chronosEvents && receipt.chronosEvents.length > 0 && (
                      <ChronosTimeline events={receipt.chronosEvents} accent={accent} labels={L} />
                    )}
                  </div>
                </div>
                
                {/* Bottom Row - Export/Share & Rule 11 Certification */}
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ExportSharePanel receipt={receipt} accent={accent} labels={L} />
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                    <div className="mb-3">
                      <h3 className="text-sm font-semibold tracking-[0.15em] text-white/60 uppercase flex items-center gap-2">
                        <FileText className="w-4 h-4" /> Rule 11 Certification
                      </h3>
                    </div>
                    <Rule11ExportButton 
                      caseNumber="24-cv-3847"
                      citationCount={14}
                      wordsModified={847}
                      className="w-full"
                    />
                    <div className="mt-2 text-xs text-white/30 text-center">
                      Professional court-ready certification document
                    </div>
                  </div>
                </div>
                <div className="mt-6"><RegulatorsReceipt receipt={receipt} accent={accent} /></div>
              </>
            )}
          </div>

          {/* Right column: Agent Reasoning Panel — collapsible drawer on mobile */}
          <div className="hidden lg:block col-span-3">
            <AgentReasoningPanel
              messages={scenario.script}
              agents={scenario.agents}
              visibleCount={visibleMessages}
              typingAgent={typingAgent}
              phase={phase}
              accent={accent}
              selectedIdx={selectedMessageIdx}
            />
          </div>
        </div>

        {/* Mobile: floating reasoning toggle button */}
        {phase !== 'idle' && (
          <button
            onClick={() => setMobileReasoningOpen(true)}
            className={`lg:hidden fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-${accent}-600 text-white shadow-lg shadow-${accent}-900/40 flex items-center justify-center hover:bg-${accent}-500 transition-colors`}
            aria-label="Open agent reasoning panel"
          >
            <Eye className="w-5 h-5" />
          </button>
        )}

        {/* Mobile: slide-over reasoning panel */}
        {mobileReasoningOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileReasoningOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-[#0a0a0f] border-l border-white/10 shadow-2xl overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 sticky top-0 bg-[#0a0a0f] z-10">
                <span className="text-xs font-semibold text-white/50 tracking-wider uppercase">Agent Reasoning</span>
                <button onClick={() => setMobileReasoningOpen(false)} className="p-1 text-white/40 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <AgentReasoningPanel
                messages={scenario.script}
                agents={scenario.agents}
                visibleCount={visibleMessages}
                typingAgent={typingAgent}
                phase={phase}
                accent={accent}
                selectedIdx={selectedMessageIdx}
              />
            </div>
          </div>
        )}

        <div className="mt-12 pt-6 border-t border-white/5 text-center">
          <p className="text-[10px] text-white/20 tracking-wider">
            {L.confidential} &middot; DATACENDIA, LLC &middot; {orgLabel} {L.executiveSandbox} &middot; {new Date().getFullYear()}
          </p>
          {footerNote && <p className="text-[10px] text-white/15 mt-1">{footerNote}</p>}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};
