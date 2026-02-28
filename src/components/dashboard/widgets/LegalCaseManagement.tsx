// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * LEGAL CASE MANAGEMENT - Legal Vertical
 * Case tracking, matter management, and litigation analytics with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Scale, FileText, Clock, DollarSign, AlertTriangle, Bot, Users, Briefcase } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface LegalMatter {
  id: string;
  title: string;
  type: 'litigation' | 'contract' | 'regulatory' | 'ip' | 'employment';
  client: string;
  status: 'active' | 'discovery' | 'negotiation' | 'trial' | 'closed';
  risk: 'low' | 'medium' | 'high' | 'critical';
  fees: number;
  hours: number;
  daysToDeadline: number;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'reviewing' | 'alert';
  documentsProcessed: number;
  action: string;
}

interface DeadlineItem {
  id: string;
  matter: string;
  task: string;
  dueIn: number;
  priority: 'urgent' | 'high' | 'normal';
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const MATTERS: LegalMatter[] = [
  { id: 'm1', title: 'TechCorp v. DataSys Patent', type: 'ip', client: 'TechCorp Inc.', status: 'discovery', risk: 'high', fees: 2450000, hours: 3420, daysToDeadline: 14 },
  { id: 'm2', title: 'Meridian Acquisition', type: 'contract', client: 'Meridian Holdings', status: 'negotiation', risk: 'medium', fees: 890000, hours: 1240, daysToDeadline: 7 },
  { id: 'm3', title: 'SEC Investigation', type: 'regulatory', client: 'FinServ Partners', status: 'active', risk: 'critical', fees: 1780000, hours: 2100, daysToDeadline: 21 },
  { id: 'm4', title: 'Employment Class Action', type: 'employment', client: 'RetailMax Corp', status: 'trial', risk: 'high', fees: 3200000, hours: 4800, daysToDeadline: 3 },
  { id: 'm5', title: 'Product Liability Defense', type: 'litigation', client: 'ManuTech Inc.', status: 'discovery', risk: 'medium', fees: 1120000, hours: 1680, daysToDeadline: 45 },
  { id: 'm6', title: 'IP Licensing Agreement', type: 'contract', client: 'InnoSoft Labs', status: 'active', risk: 'low', fees: 340000, hours: 520, daysToDeadline: 30 },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'strat', name: 'CaseStrategist', role: 'Litigation Strategy', status: 'active', documentsProcessed: 12400, action: 'Analyzing precedent for TechCorp v. DataSys' },
  { id: 'contract', name: 'ContractAnalyzer', role: 'Contract Intelligence', status: 'reviewing', documentsProcessed: 847, action: 'Reviewing 23 clauses in Meridian deal' },
  { id: 'discovery', name: 'DiscoveryEngine', role: 'E-Discovery AI', status: 'active', documentsProcessed: 89000, action: 'TAR review 94% complete on class action' },
  { id: 'compliance', name: 'ComplianceTracker', role: 'Regulatory AI', status: 'alert', documentsProcessed: 2340, action: 'SEC filing deadline in 48 hours' },
];

const DEADLINES: DeadlineItem[] = [
  { id: 'd1', matter: 'Employment Class Action', task: 'Expert witness deadline', dueIn: 3, priority: 'urgent' },
  { id: 'd2', matter: 'Meridian Acquisition', task: 'Due diligence completion', dueIn: 7, priority: 'urgent' },
  { id: 'd3', matter: 'TechCorp v. DataSys', task: 'Discovery response', dueIn: 14, priority: 'high' },
  { id: 'd4', matter: 'SEC Investigation', task: 'Document production', dueIn: 21, priority: 'high' },
  { id: 'd5', matter: 'IP Licensing Agreement', task: 'Final review', dueIn: 30, priority: 'normal' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const formatCurrency = (num: number): string => {
  if (num >= 1e6) {return `$${(num / 1e6).toFixed(1)}M`;}
  if (num >= 1e3) {return `$${(num / 1e3).toFixed(0)}K`;}
  return `$${num}`;
};

const MatterTypeIcon: React.FC<{ type: LegalMatter['type'] }> = ({ type }) => {
  const icons = {
    litigation: <Scale className="w-3 h-3" />,
    contract: <FileText className="w-3 h-3" />,
    regulatory: <AlertTriangle className="w-3 h-3" />,
    ip: <Briefcase className="w-3 h-3" />,
    employment: <Users className="w-3 h-3" />,
  };
  return icons[type];
};

const MatterCard: React.FC<{ matter: LegalMatter }> = ({ matter }) => {
  const riskColors = {
    low: 'bg-emerald-900/50 text-emerald-400',
    medium: 'bg-amber-900/50 text-amber-400',
    high: 'bg-orange-900/50 text-orange-400',
    critical: 'bg-red-900/50 text-red-400',
  };

  const statusColors = {
    active: 'border-cyan-500/40',
    discovery: 'border-violet-500/40',
    negotiation: 'border-amber-500/40',
    trial: 'border-red-500/40',
    closed: 'border-gray-500/40',
  };

  return (
    <div className={cn('p-2 rounded-lg border bg-sovereign-elevated/30', statusColors[matter.status])}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <MatterTypeIcon type={matter.type} />
          <span className="text-xs font-medium text-white truncate max-w-[140px]">{matter.title}</span>
        </div>
        <span className={cn('text-[10px] px-1.5 py-0.5 rounded', riskColors[matter.risk])}>
          {matter.risk}
        </span>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-1.5">{matter.client}</p>
      
      <div className="grid grid-cols-4 gap-1 text-[10px]">
        <div>
          <p className="text-gray-500">Status</p>
          <p className="text-white font-medium capitalize">{matter.status}</p>
        </div>
        <div>
          <p className="text-gray-500">Fees</p>
          <p className="text-emerald-400 font-medium">{formatCurrency(matter.fees)}</p>
        </div>
        <div>
          <p className="text-gray-500">Hours</p>
          <p className="text-white font-medium">{matter.hours.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-gray-500">Deadline</p>
          <p className={cn('font-medium', matter.daysToDeadline <= 7 ? 'text-red-400' : matter.daysToDeadline <= 14 ? 'text-amber-400' : 'text-white')}>
            {matter.daysToDeadline}d
          </p>
        </div>
      </div>
    </div>
  );
};

const AgentCard: React.FC<{ agent: AIAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'active' ? 'bg-emerald-900/50 text-emerald-400' :
        agent.status === 'reviewing' ? 'bg-cyan-900/50 text-cyan-400' :
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
        agent.status === 'reviewing' ? 'bg-cyan-500' : 'bg-amber-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">📄 {agent.documentsProcessed.toLocaleString()} docs processed</p>
    <p className="text-[10px] text-cyan-400">🎯 {agent.action}</p>
  </div>
);

const DeadlineRow: React.FC<{ deadline: DeadlineItem }> = ({ deadline }) => (
  <div className={cn(
    'flex items-center gap-2 p-1.5 rounded text-[10px]',
    deadline.priority === 'urgent' ? 'bg-red-900/20 border border-red-500/30' :
    deadline.priority === 'high' ? 'bg-amber-900/20 border border-amber-500/30' :
    'bg-sovereign-base border border-sovereign-border-subtle'
  )}>
    <Clock className={cn(
      'w-3 h-3',
      deadline.priority === 'urgent' ? 'text-red-400' :
      deadline.priority === 'high' ? 'text-amber-400' : 'text-gray-400'
    )} />
    <div className="flex-1 min-w-0">
      <p className="text-white truncate">{deadline.task}</p>
      <p className="text-gray-500 truncate">{deadline.matter}</p>
    </div>
    <span className={cn(
      'font-medium',
      deadline.dueIn <= 7 ? 'text-red-400' : deadline.dueIn <= 14 ? 'text-amber-400' : 'text-gray-400'
    )}>
      {deadline.dueIn}d
    </span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const LegalCaseManagement: React.FC<{ className?: string }> = ({ className }) => {
  const [matters, setMatters] = useState<LegalMatter[]>(MATTERS);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate hours accumulation
      setMatters(prev => prev.map((m): LegalMatter => ({
        ...m,
        hours: m.status !== 'closed' ? m.hours + deterministicInt(0, 4, 'legalcasemanagement-1') : m.hours,
      })));

      // Simulate agent activity
      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        documentsProcessed: a.documentsProcessed + deterministicInt(0, 49, 'legalcasemanagement-2'),
        status: deterministicFloat('legalcasemanagement-3') > 0.7 ? 'reviewing' : 'active',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const totalFees = matters.reduce((sum, m) => sum + m.fees, 0);
  const totalHours = matters.reduce((sum, m) => sum + m.hours, 0);
  const activeMatterCount = matters.filter(m => m.status !== 'closed').length;
  const highRiskCount = matters.filter(m => m.risk === 'high' || m.risk === 'critical').length;

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <Briefcase className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{activeMatterCount}</p>
          <p className="text-[10px] text-gray-400">Active Matters</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <DollarSign className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{formatCurrency(totalFees)}</p>
          <p className="text-[10px] text-gray-400">Total Fees</p>
        </div>
        <div className="bg-cyan-900/20 rounded-lg p-2 text-center border border-cyan-500/30">
          <Clock className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
          <p className="text-lg font-bold text-white">{(totalHours / 1000).toFixed(1)}K</p>
          <p className="text-[10px] text-gray-400">Billable Hours</p>
        </div>
        <div className="bg-red-900/20 rounded-lg p-2 text-center border border-red-500/30">
          <AlertTriangle className="w-4 h-4 mx-auto text-red-400 mb-1" />
          <p className="text-lg font-bold text-white">{highRiskCount}</p>
          <p className="text-[10px] text-gray-400">High Risk</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - Matters */}
        <div className="col-span-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Scale className="w-3 h-3" /> Legal Matters ({matters.length})
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {matters.map(matter => (
              <MatterCard key={matter.id} matter={matter} />
            ))}
          </div>
          
          {/* Deadlines */}
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Upcoming Deadlines
          </h3>
          <div className="space-y-1">
            {DEADLINES.map(d => (
              <DeadlineRow key={d.id} deadline={d} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Legal Agents
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
        <span className="text-xs text-gray-300">Live Tracking</span>
      </div>
    </div>
  );
};

export default LegalCaseManagement;
