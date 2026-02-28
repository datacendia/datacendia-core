// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LAYOUT MAP RENDERER
 * Renders interactive visual maps for vertical-specific dashboards
 * Enhanced with AI Agent discussion and Core Suite / Trust Layer services
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import type { LayoutMap, LayoutMapZone } from '../../config/verticalLayoutMaps';
import { ChevronRight, Zap, AlertTriangle, CheckCircle, Clock, MessageSquare, Shield, FileText, Brain, Users, History, Target, Lock, FlaskConical } from 'lucide-react';

// Vertical-specific AI agents for discussion
const VERTICAL_AGENTS: Record<string, { id: string; name: string; icon: string; role: string }[]> = {
  legal: [
    { id: 'matter-lead', name: 'Matter Lead', icon: '⚖️', role: 'Case strategy and coordination' },
    { id: 'research-counsel', name: 'Research Counsel', icon: '📚', role: 'Legal research and precedents' },
    { id: 'contract-counsel', name: 'Contract Counsel', icon: '📝', role: 'Contract analysis' },
    { id: 'litigation-strategist', name: 'Litigation Strategist', icon: '🎯', role: 'Trial strategy' },
  ],
  healthcare: [
    { id: 'cmio', name: 'CMIO', icon: '👨‍⚕️', role: 'Clinical informatics' },
    { id: 'patient-safety', name: 'Patient Safety', icon: '🛡️', role: 'Safety protocols' },
    { id: 'care-coordinator', name: 'Care Coordinator', icon: '🏥', role: 'Care coordination' },
    { id: 'quality-officer', name: 'Quality Officer', icon: '✅', role: 'Quality metrics' },
  ],
  financial: [
    { id: 'risk-sentinel', name: 'Risk Sentinel', icon: '🛡️', role: 'Risk assessment' },
    { id: 'alpha-hunter', name: 'Alpha Hunter', icon: '📈', role: 'Investment analysis' },
    { id: 'compliance-guardian', name: 'Compliance Guardian', icon: '⚖️', role: 'Regulatory compliance' },
    { id: 'market-pulse', name: 'Market Pulse', icon: '💹', role: 'Market intelligence' },
  ],
  manufacturing: [
    { id: 'production-master', name: 'Production Master', icon: '🏭', role: 'Production optimization' },
    { id: 'quality-vision', name: 'Quality Vision', icon: '🔍', role: 'Quality control' },
    { id: 'supply-sync', name: 'Supply Sync', icon: '📦', role: 'Supply chain' },
    { id: 'predict-maintain', name: 'Predict Maintain', icon: '🔧', role: 'Predictive maintenance' },
  ],
  government: [
    { id: 'policy-advisor', name: 'Policy Advisor', icon: '📋', role: 'Policy analysis' },
    { id: 'citizen-engage', name: 'Citizen Engage', icon: '👥', role: 'Public engagement' },
    { id: 'budget-optimizer', name: 'Budget Optimizer', icon: '💰', role: 'Budget planning' },
    { id: 'security-officer', name: 'Security Officer', icon: '🔒', role: 'Security protocols' },
  ],
  technology: [
    { id: 'site-reliability', name: 'Site Reliability', icon: '🖥️', role: 'System reliability' },
    { id: 'security-fortress', name: 'Security Fortress', icon: '🛡️', role: 'Security posture' },
    { id: 'dev-velocity', name: 'Dev Velocity', icon: '🚀', role: 'Development speed' },
    { id: 'product-vision', name: 'Product Vision', icon: '🎯', role: 'Product strategy' },
  ],
  energy: [
    { id: 'grid-balancer', name: 'Grid Balancer', icon: '⚡', role: 'Grid optimization' },
    { id: 'renewable-optimizer', name: 'Renewable Optimizer', icon: '🌱', role: 'Renewable integration' },
    { id: 'asset-guardian', name: 'Asset Guardian', icon: '🔧', role: 'Asset management' },
    { id: 'demand-forecaster', name: 'Demand Forecaster', icon: '📊', role: 'Demand prediction' },
  ],
  retail: [
    { id: 'merchandising-ai', name: 'Merchandising AI', icon: '🏷️', role: 'Product placement' },
    { id: 'pricing-engine', name: 'Pricing Engine', icon: '💲', role: 'Dynamic pricing' },
    { id: 'customer-insight', name: 'Customer Insight', icon: '👤', role: 'Customer analytics' },
    { id: 'inventory-oracle', name: 'Inventory Oracle', icon: '📦', role: 'Inventory optimization' },
  ],
};

// Core Suite services
const CORE_SUITE_SERVICES = [
  { id: 'council', name: 'The Council', icon: '🧠', path: '/cortex/council', description: 'Multi-agent deliberation' },
  { id: 'chronos', name: 'CendiaChronos', icon: '⏰', path: '/cortex/intelligence/chronos', description: 'Replay past decisions' },
  { id: 'ghost-board', name: 'Ghost Board', icon: '👻', path: '/cortex/intelligence/ghost-board', description: 'Rehearse board meetings' },
  { id: 'pre-mortem', name: 'Pre-Mortem', icon: '💀', path: '/cortex/intelligence/pre-mortem', description: 'Analyze failure modes' },
  { id: 'decision-debt', name: 'Decision Debt', icon: '📊', path: '/cortex/intelligence/decision-debt', description: 'Track stuck decisions' },
];

// Trust Layer services
const TRUST_LAYER_SERVICES = [
  { id: 'oversight', name: 'CendiaOversight', icon: '👁️', path: '/cortex/governance/oversight', description: 'Compliance & audit' },
  { id: 'vault', name: 'CendiaVault', icon: '🔐', path: '/cortex/sovereign/vault', description: 'Evidence storage' },
  { id: 'decision-dna', name: 'Decision DNA', icon: '🧬', path: '/cortex/enterprise/ledger', description: 'Immutable lineage' },
  { id: 'crucible', name: 'CendiaCrucible', icon: '🔥', path: '/cortex/intelligence/red-team', description: 'Adversarial testing' },
];

interface LayoutMapRendererProps {
  layout: LayoutMap;
  verticalId: string;
  onZoneClick?: (zone: LayoutMapZone) => void;
  className?: string;
}

const statusColors: Record<string, { bg: string; border: string; pulse: boolean }> = {
  active: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', pulse: false },
  warning: { bg: 'bg-amber-500/20', border: 'border-amber-500/50', pulse: true },
  critical: { bg: 'bg-red-500/20', border: 'border-red-500/50', pulse: true },
  idle: { bg: 'bg-slate-500/20', border: 'border-slate-500/30', pulse: false },
};

const zoneColors: Record<string, { bg: string; border: string; text: string }> = {
  cyan: { bg: 'bg-cyan-900/30', border: 'border-cyan-500/40', text: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-900/30', border: 'border-emerald-500/40', text: 'text-emerald-400' },
  blue: { bg: 'bg-blue-900/30', border: 'border-blue-500/40', text: 'text-blue-400' },
  violet: { bg: 'bg-violet-900/30', border: 'border-violet-500/40', text: 'text-violet-400' },
  purple: { bg: 'bg-purple-900/30', border: 'border-purple-500/40', text: 'text-purple-400' },
  amber: { bg: 'bg-amber-900/30', border: 'border-amber-500/40', text: 'text-amber-400' },
  rose: { bg: 'bg-rose-900/30', border: 'border-rose-500/40', text: 'text-rose-400' },
  red: { bg: 'bg-red-900/30', border: 'border-red-500/40', text: 'text-red-400' },
  slate: { bg: 'bg-slate-900/30', border: 'border-slate-500/40', text: 'text-slate-400' },
};

const StatusIcon: React.FC<{ status?: string }> = ({ status }) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="w-3 h-3 text-emerald-400" />;
    case 'warning':
      return <AlertTriangle className="w-3 h-3 text-amber-400" />;
    case 'critical':
      return <Zap className="w-3 h-3 text-red-400 animate-pulse" />;
    case 'idle':
      return <Clock className="w-3 h-3 text-slate-400" />;
    default:
      return null;
  }
};

const ZoneCard: React.FC<{
  zone: LayoutMapZone;
  onClick?: () => void;
  isHovered: boolean;
  onHover: (hovered: boolean) => void;
}> = ({ zone, onClick, isHovered, onHover }) => {
  const colorStyle = zoneColors[zone.color] || zoneColors.slate;
  const statusStyle = statusColors[zone.status || 'active'];

  return (
    <div
      className={cn(
        'absolute rounded-lg border-2 transition-all duration-300 cursor-pointer overflow-hidden',
        colorStyle.bg,
        isHovered ? 'border-white/60 shadow-lg shadow-white/10 scale-[1.02] z-10' : colorStyle.border,
        statusStyle.pulse && 'animate-pulse'
      )}
      style={{
        left: `${zone.x}%`,
        top: `${zone.y}%`,
        width: `${zone.width}%`,
        height: `${zone.height}%`,
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Status indicator bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-1', statusStyle.bg)} />
      
      {/* Content */}
      <div className="p-2 h-full flex flex-col">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-sm">{zone.icon}</span>
          <span className={cn('text-xs font-medium truncate', colorStyle.text)}>
            {zone.name}
          </span>
          <StatusIcon status={zone.status} />
        </div>
        
        {/* Metrics */}
        {zone.metrics && zone.metrics.length > 0 && (
          <div className="flex-1 flex flex-col justify-end">
            {zone.metrics.map((metric, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px]">
                <span className="text-gray-500 truncate">{metric.label}</span>
                <span className="text-white font-medium">{metric.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hover overlay */}
      {isHovered && (
        <div className="absolute inset-0 bg-white/5 pointer-events-none" />
      )}
    </div>
  );
};

export const LayoutMapRenderer: React.FC<LayoutMapRendererProps> = ({
  layout,
  verticalId,
  onZoneClick,
  className,
}) => {
  const navigate = useNavigate();
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [selectedZone, setSelectedZone] = useState<LayoutMapZone | null>(null);

  const handleZoneClick = (zone: LayoutMapZone) => {
    setSelectedZone(zone);
    onZoneClick?.(zone);
  };

  const handleQuickAction = (action: { id: string; label: string; icon: string; zoneId?: string }) => {
    // Navigate to council with context
    navigate(`/cortex/council?vertical=${verticalId}&context=${action.id}`);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Map Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{layout.icon}</span>
          <div>
            <h3 className="text-lg font-semibold text-white">{layout.name}</h3>
            <p className="text-xs text-gray-400">{layout.description}</p>
          </div>
        </div>
        
        {/* Status Legend */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-gray-400">Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-gray-400">Warning</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-gray-400">Critical</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-slate-500" />
            <span className="text-gray-400">Idle</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className={cn(
        'relative flex-1 min-h-[400px] rounded-xl border border-sovereign-border bg-gradient-to-br',
        layout.backgroundGradient
      )}>
        {/* Grid overlay for visual effect */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Zones */}
        {layout.zones.map((zone) => (
          <ZoneCard
            key={zone.id}
            zone={zone}
            onClick={() => handleZoneClick(zone)}
            isHovered={hoveredZone === zone.id}
            onHover={(hovered) => setHoveredZone(hovered ? zone.id : null)}
          />
        ))}
      </div>

      {/* Quick Actions Bar */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-gray-500 mr-2">Quick Actions:</span>
        {layout.quickActions.map((action) => (
          <button
            key={action.id}
            onClick={() => handleQuickAction(action)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              'bg-sovereign-card border border-sovereign-border hover:border-primary-500/50 hover:bg-primary-500/10',
              'text-gray-300 hover:text-white'
            )}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
            <ChevronRight className="w-3 h-3 opacity-50" />
          </button>
        ))}
      </div>

      {/* Selected Zone Detail Panel - Enhanced with Services */}
      {selectedZone && (
        <div className="mt-4 p-4 rounded-xl bg-sovereign-card border border-sovereign-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{selectedZone.icon}</span>
              <h4 className="font-semibold text-white">{selectedZone.name}</h4>
              <StatusIcon status={selectedZone.status} />
            </div>
            <button
              onClick={() => setSelectedZone(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          
          {/* Metrics */}
          {selectedZone.metrics && selectedZone.metrics.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              {selectedZone.metrics.map((metric, idx) => (
                <div key={idx} className="p-2 rounded-lg bg-sovereign-base border border-sovereign-border-subtle">
                  <p className="text-xs text-gray-500">{metric.label}</p>
                  <p className="text-lg font-bold text-white">{metric.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Primary Action - Launch Council */}
          <button
            onClick={() => navigate(`/cortex/council?vertical=${verticalId}&zone=${selectedZone.id}&context=${selectedZone.name}`)}
            className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors mb-4"
          >
            🧠 Launch Council for {selectedZone.name}
          </button>

          {/* AI Agents for Discussion */}
          <div className="mb-4">
            <h5 className="text-xs font-medium text-gray-400 mb-2 flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Discuss with AI Agents
            </h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {(VERTICAL_AGENTS[verticalId] || VERTICAL_AGENTS.legal).map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => navigate(`/cortex/council?vertical=${verticalId}&zone=${selectedZone.id}&agent=${agent.id}`)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-sovereign-base border border-sovereign-border-subtle hover:border-primary-500/50 hover:bg-primary-500/10 transition-all text-left"
                >
                  <span className="text-lg">{agent.icon}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-white truncate">{agent.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{agent.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Core Suite Services */}
          <div className="mb-4">
            <h5 className="text-xs font-medium text-cyan-400 mb-2 flex items-center gap-1">
              <Brain className="w-3 h-3" />
              The Core Suite
            </h5>
            <div className="flex flex-wrap gap-2">
              {CORE_SUITE_SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => navigate(`${service.path}?vertical=${verticalId}&zone=${selectedZone.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-900/20 border border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-500/20 transition-all text-xs"
                  title={service.description}
                >
                  <span>{service.icon}</span>
                  <span className="text-cyan-300">{service.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Trust Layer Services */}
          <div>
            <h5 className="text-xs font-medium text-amber-400 mb-2 flex items-center gap-1">
              <Shield className="w-3 h-3" />
              The Trust Layer
            </h5>
            <div className="flex flex-wrap gap-2">
              {TRUST_LAYER_SERVICES.map((service) => (
                <button
                  key={service.id}
                  onClick={() => navigate(`${service.path}?vertical=${verticalId}&zone=${selectedZone.id}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-900/20 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/20 transition-all text-xs"
                  title={service.description}
                >
                  <span>{service.icon}</span>
                  <span className="text-amber-300">{service.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutMapRenderer;
