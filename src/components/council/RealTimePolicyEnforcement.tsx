// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * REAL-TIME POLICY ENFORCEMENT - Veto-Based Proactive Governance
 * Enterprise Platinum - Live rule monitoring and automatic holds
 */

import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Clock, 
  Eye, Lock, Unlock, TrendingUp, Bot,
  AlertOctagon, Scale, Gavel
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface PolicyRule {
  id: string;
  name: string;
  category: 'budget' | 'risk' | 'compliance' | 'security' | 'ethics' | 'operational';
  description: string;
  threshold?: number;
  thresholdType?: 'max' | 'min' | 'range';
  severity: 'info' | 'warning' | 'critical' | 'block';
  isActive: boolean;
  triggeredCount: number;
  lastTriggered?: Date;
}

interface PolicyViolation {
  id: string;
  ruleId: string;
  ruleName: string;
  decision: string;
  violation: string;
  severity: 'warning' | 'critical' | 'block';
  action: 'hold' | 'veto' | 'escalate' | 'notify';
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
}

interface LiveDecision {
  id: string;
  title: string;
  department: string;
  amount?: number;
  riskScore: number;
  status: 'pending' | 'approved' | 'held' | 'vetoed';
  violations: string[];
}

interface GovernanceAgent {
  id: string;
  name: string;
  role: string;
  status: 'monitoring' | 'reviewing' | 'enforcing';
  rulesMonitored: number;
  action: string;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const POLICY_RULES: PolicyRule[] = [
  { id: 'r1', name: 'Budget Threshold', category: 'budget', description: 'Single expenditure exceeds $100K without VP approval', threshold: 100000, thresholdType: 'max', severity: 'critical', isActive: true, triggeredCount: 23 },
  { id: 'r2', name: 'Risk Score Limit', category: 'risk', description: 'Decision risk score exceeds 7.5/10', threshold: 7.5, thresholdType: 'max', severity: 'warning', isActive: true, triggeredCount: 45 },
  { id: 'r3', name: 'Compliance Check', category: 'compliance', description: 'Missing required compliance documentation', severity: 'block', isActive: true, triggeredCount: 12 },
  { id: 'r4', name: 'Security Clearance', category: 'security', description: 'Action requires elevated security clearance', severity: 'critical', isActive: true, triggeredCount: 8 },
  { id: 'r5', name: 'Ethics Review', category: 'ethics', description: 'Decision requires ethics committee review', severity: 'warning', isActive: true, triggeredCount: 15 },
  { id: 'r6', name: 'Headcount Limit', category: 'operational', description: 'Hiring exceeds approved headcount', threshold: 0, thresholdType: 'max', severity: 'critical', isActive: true, triggeredCount: 5 },
  { id: 'r7', name: 'Vendor Approval', category: 'compliance', description: 'New vendor requires procurement review', severity: 'warning', isActive: true, triggeredCount: 34 },
  { id: 'r8', name: 'Data Privacy', category: 'security', description: 'Action involves PII without DPA review', severity: 'block', isActive: true, triggeredCount: 7 },
];

const GOVERNANCE_AGENTS: GovernanceAgent[] = [
  { id: 'g1', name: 'PolicyGuardian', role: 'Rule Enforcement', status: 'monitoring', rulesMonitored: 47, action: 'Scanning 23 pending decisions for violations' },
  { id: 'g2', name: 'ComplianceWatcher', role: 'Regulatory Monitor', status: 'reviewing', rulesMonitored: 89, action: 'Reviewing SOX compliance for Q4 decisions' },
  { id: 'g3', name: 'RiskSentinel', role: 'Risk Assessment', status: 'enforcing', rulesMonitored: 34, action: 'Enforcing hold on high-risk acquisition' },
  { id: 'g4', name: 'EthicsAdvisor', role: 'Ethics Oversight', status: 'monitoring', rulesMonitored: 12, action: 'Monitoring stakeholder impact metrics' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const RuleCard: React.FC<{ rule: PolicyRule; onToggle: (id: string) => void }> = ({ rule, onToggle }) => {
  const categoryColors = {
    budget: 'text-emerald-400 bg-emerald-900/30',
    risk: 'text-amber-400 bg-amber-900/30',
    compliance: 'text-cyan-400 bg-cyan-900/30',
    security: 'text-red-400 bg-red-900/30',
    ethics: 'text-violet-400 bg-violet-900/30',
    operational: 'text-blue-400 bg-blue-900/30',
  };

  const severityColors = {
    info: 'bg-gray-600',
    warning: 'bg-amber-600',
    critical: 'bg-orange-600',
    block: 'bg-red-600',
  };

  return (
    <div className={cn(
      'p-3 rounded-lg border transition-all',
      rule.isActive 
        ? 'bg-sovereign-elevated/50 border-sovereign-border' 
        : 'bg-sovereign-base/30 border-sovereign-border/50 opacity-60'
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={cn('px-2 py-0.5 rounded text-[10px] font-medium uppercase', categoryColors[rule.category])}>
            {rule.category}
          </span>
          <span className={cn('px-1.5 py-0.5 rounded text-[10px] text-white', severityColors[rule.severity])}>
            {rule.severity}
          </span>
        </div>
        <button 
          onClick={() => onToggle(rule.id)}
          className={cn(
            'p-1 rounded transition-colors',
            rule.isActive ? 'text-emerald-400 hover:bg-emerald-900/30' : 'text-gray-500 hover:bg-gray-800'
          )}
        >
          {rule.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
        </button>
      </div>
      
      <h4 className="text-sm font-medium text-white mb-1">{rule.name}</h4>
      <p className="text-[10px] text-gray-400 mb-2">{rule.description}</p>
      
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-500">
          {rule.threshold && `Threshold: ${rule.thresholdType === 'max' ? '≤' : '≥'} ${rule.threshold.toLocaleString()}`}
        </span>
        <span className="text-amber-400">Triggered {rule.triggeredCount}x</span>
      </div>
    </div>
  );
};

const ViolationCard: React.FC<{ violation: PolicyViolation }> = ({ violation }) => {
  const actionColors = {
    hold: 'bg-amber-900/30 border-amber-500/40 text-amber-400',
    veto: 'bg-red-900/30 border-red-500/40 text-red-400',
    escalate: 'bg-violet-900/30 border-violet-500/40 text-violet-400',
    notify: 'bg-cyan-900/30 border-cyan-500/40 text-cyan-400',
  };

  const actionIcons = {
    hold: <Clock className="w-4 h-4" />,
    veto: <XCircle className="w-4 h-4" />,
    escalate: <TrendingUp className="w-4 h-4" />,
    notify: <Eye className="w-4 h-4" />,
  };

  return (
    <div className={cn(
      'p-3 rounded-lg border',
      actionColors[violation.action]
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {actionIcons[violation.action]}
          <span className="text-xs font-medium uppercase">{violation.action}</span>
        </div>
        <span className="text-[10px] text-gray-400">
          {new Date(violation.timestamp).toLocaleTimeString()}
        </span>
      </div>
      
      <h4 className="text-sm font-medium text-white mb-1">{violation.decision}</h4>
      <p className="text-[10px] text-gray-300 mb-2">
        <span className="text-gray-500">Rule:</span> {violation.ruleName}
      </p>
      <p className="text-[10px] text-gray-400">{violation.violation}</p>
      
      {violation.resolved && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400">
          <CheckCircle className="w-3 h-3" />
          Resolved by {violation.resolvedBy}
        </div>
      )}
    </div>
  );
};

const LiveDecisionCard: React.FC<{ decision: LiveDecision }> = ({ decision }) => {
  const statusConfig = {
    pending: { color: 'text-cyan-400', bg: 'bg-cyan-900/20', icon: <Clock className="w-3 h-3" /> },
    approved: { color: 'text-emerald-400', bg: 'bg-emerald-900/20', icon: <CheckCircle className="w-3 h-3" /> },
    held: { color: 'text-amber-400', bg: 'bg-amber-900/20', icon: <AlertTriangle className="w-3 h-3" /> },
    vetoed: { color: 'text-red-400', bg: 'bg-red-900/20', icon: <XCircle className="w-3 h-3" /> },
  };

  const config = statusConfig[decision.status];

  return (
    <div className={cn('p-2 rounded-lg border border-sovereign-border-subtle', config.bg)}>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-white truncate max-w-[150px]">{decision.title}</span>
        <span className={cn('flex items-center gap-1 text-[10px]', config.color)}>
          {config.icon}
          {decision.status}
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px]">
        <span className="text-gray-400">{decision.department}</span>
        <span className={cn(
          'font-medium',
          decision.riskScore > 7 ? 'text-red-400' : decision.riskScore > 5 ? 'text-amber-400' : 'text-emerald-400'
        )}>
          Risk: {decision.riskScore}/10
        </span>
      </div>
      {decision.violations.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1">
          {decision.violations.map((v, i) => (
            <span key={i} className="px-1 py-0.5 bg-red-900/30 text-red-400 text-[9px] rounded">
              {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

const AgentCard: React.FC<{ agent: GovernanceAgent }> = ({ agent }) => (
  <div className="p-2 bg-sovereign-elevated/50 rounded-lg border border-sovereign-border-subtle">
    <div className="flex items-center gap-2 mb-1">
      <div className={cn(
        'w-6 h-6 rounded-full flex items-center justify-center',
        agent.status === 'monitoring' ? 'bg-cyan-900/50 text-cyan-400' :
        agent.status === 'reviewing' ? 'bg-amber-900/50 text-amber-400' :
        'bg-red-900/50 text-red-400'
      )}>
        <Bot className="w-3 h-3" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-white">{agent.name}</p>
        <p className="text-[10px] text-gray-500">{agent.role}</p>
      </div>
      <span className={cn(
        'w-1.5 h-1.5 rounded-full animate-pulse',
        agent.status === 'monitoring' ? 'bg-cyan-500' :
        agent.status === 'reviewing' ? 'bg-amber-500' : 'bg-red-500'
      )} />
    </div>
    <p className="text-[10px] text-gray-400 mb-1">{agent.rulesMonitored} rules monitored</p>
    <p className="text-[10px] text-cyan-400">⚡ {agent.action}</p>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const RealTimePolicyEnforcement: React.FC<{ className?: string }> = ({ className }) => {
  const [rules, setRules] = useState<PolicyRule[]>(POLICY_RULES);
  const [violations, setViolations] = useState<PolicyViolation[]>([]);
  const [decisions, setDecisions] = useState<LiveDecision[]>([]);
  const [agents, setAgents] = useState<GovernanceAgent[]>(GOVERNANCE_AGENTS);

  // Generate random violations
  const generateViolation = useCallback(() => {
    if (rules.length === 0) {return;}
    const randomRule = rules[Math.floor(deterministicFloat('realtimepolicyenforcement-7') * rules.length)];
    if (!randomRule) {return;}
    
    const decisionNames = [
      'Marketing Campaign Budget',
      'New Vendor Contract',
      'Hiring Request',
      'Data Migration Project',
      'Cloud Infrastructure Upgrade',
      'Customer Data Export',
    ];
    const decisionName = decisionNames[Math.floor(deterministicFloat('realtimepolicyenforcement-8') * decisionNames.length)] || 'Decision';
    
    const newViolation: PolicyViolation = {
      id: `v-${Date.now()}`,
      ruleId: randomRule.id,
      ruleName: randomRule.name,
      decision: decisionName,
      violation: randomRule.description,
      severity: randomRule.severity === 'block' ? 'block' : randomRule.severity === 'critical' ? 'critical' : 'warning',
      action: randomRule.severity === 'block' ? 'veto' : randomRule.severity === 'critical' ? 'hold' : 'notify',
      timestamp: new Date(),
      resolved: false,
    };

    setViolations(prev => [newViolation, ...prev.slice(0, 9)]);
  }, [rules]);

  // Generate live decisions
  const generateDecision = useCallback(() => {
    const titles = ['Q1 Budget Reallocation', 'New Hire Approval', 'Vendor Agreement', 'System Upgrade', 'Policy Amendment'];
    const departments = ['Finance', 'Engineering', 'Marketing', 'HR', 'Operations'];
    
    const newDecision: LiveDecision = {
      id: `d-${Date.now()}`,
      title: titles[Math.floor(deterministicFloat('realtimepolicyenforcement-9') * titles.length)] || 'Decision',
      department: departments[Math.floor(deterministicFloat('realtimepolicyenforcement-10') * departments.length)] || 'General',
      amount: deterministicInt(0, 499999, 'realtimepolicyenforcement-1'),
      riskScore: deterministicInt(0, 9, 'realtimepolicyenforcement-2') + 1,
      status: 'pending',
      violations: deterministicFloat('realtimepolicyenforcement-3') > 0.6 ? ['Budget', 'Compliance'] : [],
    };

    setDecisions(prev => {
      const updated = [newDecision, ...prev.slice(0, 7)];
      // Auto-resolve some
      return updated.map(d => {
        if (d.status === 'pending' && deterministicFloat('realtimepolicyenforcement-4') > 0.7) {
          return { ...d, status: d.violations.length > 0 ? 'held' : 'approved' as const };
        }
        return d;
      });
    });
  }, []);

  useEffect(() => {
    const violationInterval = setInterval(generateViolation, 5000);
    const decisionInterval = setInterval(generateDecision, 3000);
    
    // Initial data
    generateViolation();
    generateDecision();
    generateDecision();

    return () => {
      clearInterval(violationInterval);
      clearInterval(decisionInterval);
    };
  }, [generateViolation, generateDecision]);

  // Simulate agent status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents(prev => prev.map(a => ({
        ...a,
        status: deterministicFloat('realtimepolicyenforcement-5') > 0.7 ? 'reviewing' : deterministicFloat('realtimepolicyenforcement-6') > 0.5 ? 'enforcing' : 'monitoring',
      })));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
  };

  const activeRules = rules.filter(r => r.isActive).length;
  const pendingViolations = violations.filter(v => !v.resolved).length;

  return (
    <div className={cn('rounded-xl overflow-hidden bg-sovereign-base border border-sovereign-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-sovereign-border bg-gradient-to-r from-red-900/20 to-amber-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                Real-Time Policy Enforcement
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </h3>
              <p className="text-xs text-gray-400">Proactive governance & automatic holds</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-emerald-400">{activeRules}</p>
              <p className="text-[10px] text-gray-400">Active Rules</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-amber-400">{pendingViolations}</p>
              <p className="text-[10px] text-gray-400">Pending</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 p-4">
        {/* Policy Rules */}
        <div className="col-span-1 overflow-y-auto max-h-[500px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Scale className="w-3 h-3" /> Policy Rules ({rules.length})
          </h4>
          <div className="space-y-2">
            {rules.slice(0, 6).map(rule => (
              <RuleCard key={rule.id} rule={rule} onToggle={toggleRule} />
            ))}
          </div>
        </div>

        {/* Live Violations */}
        <div className="col-span-1 overflow-y-auto max-h-[500px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <AlertOctagon className="w-3 h-3" /> Live Violations
          </h4>
          <div className="space-y-2">
            {violations.slice(0, 5).map(v => (
              <ViolationCard key={v.id} violation={v} />
            ))}
          </div>
        </div>

        {/* Live Decisions */}
        <div className="col-span-1 overflow-y-auto max-h-[500px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Gavel className="w-3 h-3" /> Live Decisions
          </h4>
          <div className="space-y-2">
            {decisions.map(d => (
              <LiveDecisionCard key={d.id} decision={d} />
            ))}
          </div>
        </div>

        {/* Governance Agents */}
        <div className="col-span-1 overflow-y-auto max-h-[500px]">
          <h4 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> Governance Agents
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

export default RealTimePolicyEnforcement;
