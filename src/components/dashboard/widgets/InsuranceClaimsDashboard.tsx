// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * INSURANCE CLAIMS DASHBOARD - Insurance Vertical
 * Claims processing, fraud detection, and underwriting analytics with AI agents
 */

import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Shield, FileText, AlertTriangle, DollarSign, Clock, Bot, CheckCircle, XCircle } from 'lucide-react';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';

// =============================================================================
// TYPES
// =============================================================================

interface Claim {
  id: string;
  claimNumber: string;
  type: 'auto' | 'property' | 'health' | 'life' | 'liability';
  policyholder: string;
  amount: number;
  status: 'new' | 'investigating' | 'approved' | 'denied' | 'paid';
  fraudScore: number;
  daysOpen: number;
  adjuster: string;
}

interface AIAgent {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'processing' | 'flagging';
  claimsProcessed: number;
  action: string;
  savings: number;
}

interface ClaimMetrics {
  category: string;
  count: number;
  avgCycleTime: number;
  approvalRate: number;
}

// =============================================================================
// SAMPLE DATA
// =============================================================================

const CLAIMS: Claim[] = [
  { id: 'c1', claimNumber: 'CLM-2024-8847', type: 'auto', policyholder: 'John Anderson', amount: 24500, status: 'investigating', fraudScore: 78, daysOpen: 5, adjuster: 'Sarah M.' },
  { id: 'c2', claimNumber: 'CLM-2024-8852', type: 'property', policyholder: 'Meridian Corp', amount: 156000, status: 'new', fraudScore: 12, daysOpen: 1, adjuster: 'Unassigned' },
  { id: 'c3', claimNumber: 'CLM-2024-8823', type: 'health', policyholder: 'Maria Garcia', amount: 8400, status: 'approved', fraudScore: 5, daysOpen: 8, adjuster: 'James K.' },
  { id: 'c4', claimNumber: 'CLM-2024-8801', type: 'auto', policyholder: 'Tech Logistics Inc', amount: 89000, status: 'investigating', fraudScore: 92, daysOpen: 12, adjuster: 'Sarah M.' },
  { id: 'c5', claimNumber: 'CLM-2024-8856', type: 'liability', policyholder: 'BuildRight LLC', amount: 340000, status: 'new', fraudScore: 23, daysOpen: 0, adjuster: 'Unassigned' },
  { id: 'c6', claimNumber: 'CLM-2024-8789', type: 'property', policyholder: 'ResidentialMax', amount: 67000, status: 'paid', fraudScore: 8, daysOpen: 21, adjuster: 'Mike T.' },
];

const AI_AGENTS: AIAgent[] = [
  { id: 'uw', name: 'UnderwritingAI', role: 'Risk Assessment', status: 'active', claimsProcessed: 1247, action: 'Scoring new policy applications', savings: 2400000 },
  { id: 'claims', name: 'ClaimsProcessor', role: 'Claims Automation', status: 'processing', claimsProcessed: 3842, action: 'Auto-adjudicating low-risk claims', savings: 890000 },
  { id: 'fraud', name: 'FraudDetector', role: 'Fraud Detection', status: 'flagging', claimsProcessed: 892, action: 'Investigating CLM-2024-8801 anomalies', savings: 4200000 },
  { id: 'actuary', name: 'ActuarialEngine', role: 'Reserve Analysis', status: 'active', claimsProcessed: 0, action: 'Updating IBNR reserves for Q4', savings: 1800000 },
];

const METRICS: ClaimMetrics[] = [
  { category: 'Auto', count: 1247, avgCycleTime: 8.2, approvalRate: 89 },
  { category: 'Property', count: 892, avgCycleTime: 14.5, approvalRate: 82 },
  { category: 'Health', count: 3421, avgCycleTime: 4.1, approvalRate: 94 },
  { category: 'Life', count: 234, avgCycleTime: 21.3, approvalRate: 91 },
  { category: 'Liability', count: 456, avgCycleTime: 32.8, approvalRate: 71 },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const formatCurrency = (num: number): string => {
  if (num >= 1e6) {return `$${(num / 1e6).toFixed(1)}M`;}
  if (num >= 1e3) {return `$${(num / 1e3).toFixed(0)}K`;}
  return `$${num}`;
};

const ClaimTypeIcon: React.FC<{ type: Claim['type'] }> = ({ type }) => {
  const colors = {
    auto: 'text-blue-400',
    property: 'text-amber-400',
    health: 'text-emerald-400',
    life: 'text-violet-400',
    liability: 'text-red-400',
  };
  return <Shield className={cn('w-3 h-3', colors[type])} />;
};

const FraudIndicator: React.FC<{ score: number }> = ({ score }) => {
  const getColor = () => {
    if (score >= 80) {return 'bg-red-500';}
    if (score >= 50) {return 'bg-amber-500';}
    if (score >= 25) {return 'bg-yellow-500';}
    return 'bg-emerald-500';
  };

  return (
    <div className="flex items-center gap-1">
      <div className="w-12 h-1.5 bg-sovereign-base rounded-full overflow-hidden">
        <div className={cn('h-full rounded-full', getColor())} style={{ width: `${score}%` }} />
      </div>
      <span className={cn(
        'text-[10px] font-medium',
        score >= 80 ? 'text-red-400' :
        score >= 50 ? 'text-amber-400' : 'text-emerald-400'
      )}>
        {score}
      </span>
    </div>
  );
};

const ClaimCard: React.FC<{ claim: Claim }> = ({ claim }) => {
  const statusConfig = {
    new: { bg: 'bg-cyan-900/20 border-cyan-500/40', text: 'text-cyan-400', icon: <Clock className="w-3 h-3" /> },
    investigating: { bg: 'bg-amber-900/20 border-amber-500/40', text: 'text-amber-400', icon: <AlertTriangle className="w-3 h-3" /> },
    approved: { bg: 'bg-emerald-900/20 border-emerald-500/40', text: 'text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
    denied: { bg: 'bg-red-900/20 border-red-500/40', text: 'text-red-400', icon: <XCircle className="w-3 h-3" /> },
    paid: { bg: 'bg-violet-900/20 border-violet-500/40', text: 'text-violet-400', icon: <DollarSign className="w-3 h-3" /> },
  };

  const config = statusConfig[claim.status];

  return (
    <div className={cn('p-2 rounded-lg border', config.bg)}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <ClaimTypeIcon type={claim.type} />
          <span className="text-xs font-medium text-white">{claim.claimNumber}</span>
        </div>
        <span className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded', config.text)}>
          {config.icon}
          {claim.status}
        </span>
      </div>
      
      <p className="text-[10px] text-gray-400 mb-1.5 truncate">{claim.policyholder}</p>
      
      <div className="grid grid-cols-3 gap-1 text-[10px] mb-1">
        <div>
          <p className="text-gray-500">Amount</p>
          <p className="text-white font-medium">{formatCurrency(claim.amount)}</p>
        </div>
        <div>
          <p className="text-gray-500">Days Open</p>
          <p className={cn('font-medium', claim.daysOpen > 14 ? 'text-amber-400' : 'text-white')}>{claim.daysOpen}</p>
        </div>
        <div>
          <p className="text-gray-500">Fraud Risk</p>
          <FraudIndicator score={claim.fraudScore} />
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
        agent.status === 'processing' ? 'bg-cyan-900/50 text-cyan-400' :
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
        agent.status === 'active' ? 'bg-emerald-500' :
        agent.status === 'processing' ? 'bg-cyan-500' : 'bg-red-500'
      )} />
    </div>
    <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
      <span>{agent.claimsProcessed > 0 ? `${agent.claimsProcessed.toLocaleString()} processed` : 'Analytics mode'}</span>
      <span className="text-emerald-400">{formatCurrency(agent.savings)} saved</span>
    </div>
    <p className="text-[10px] text-cyan-400">🎯 {agent.action}</p>
  </div>
);

const MetricRow: React.FC<{ metric: ClaimMetrics }> = ({ metric }) => (
  <div className="flex items-center gap-2 p-1.5 bg-sovereign-base rounded text-[10px]">
    <span className="text-gray-300 w-16">{metric.category}</span>
    <span className="text-white w-10 text-right">{metric.count}</span>
    <span className={cn('w-10 text-right', metric.avgCycleTime > 20 ? 'text-amber-400' : 'text-white')}>
      {metric.avgCycleTime}d
    </span>
    <div className="flex-1 h-2 bg-sovereign-elevated rounded-full overflow-hidden">
      <div 
        className={cn(
          'h-full rounded-full',
          metric.approvalRate >= 90 ? 'bg-emerald-500' :
          metric.approvalRate >= 80 ? 'bg-cyan-500' : 'bg-amber-500'
        )}
        style={{ width: `${metric.approvalRate}%` }}
      />
    </div>
    <span className="text-emerald-400 w-8 text-right">{metric.approvalRate}%</span>
  </div>
);

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const InsuranceClaimsDashboard: React.FC<{ className?: string }> = ({ className }) => {
  const [claims, setClaims] = useState<Claim[]>(CLAIMS);
  const [agents, setAgents] = useState<AIAgent[]>(AI_AGENTS);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate days open increment and fraud score changes
      setClaims(prev => prev.map((c): Claim => ({
        ...c,
        fraudScore: Math.max(0, Math.min(100, c.fraudScore + Math.floor((deterministicFloat('insuranceclaims-2') - 0.5) * 5))),
      })));

      // Simulate agent processing
      setAgents(prev => prev.map((a): AIAgent => ({
        ...a,
        claimsProcessed: a.claimsProcessed > 0 ? a.claimsProcessed + deterministicInt(0, 9, 'insuranceclaims-1') : 0,
        status: deterministicFloat('insuranceclaims-3') > 0.7 ? 'processing' : 'active',
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const totalClaims = claims.length;
  const totalExposure = claims.reduce((sum, c) => sum + c.amount, 0);
  const highFraudCount = claims.filter(c => c.fraudScore >= 70).length;
  const totalSavings = agents.reduce((sum, a) => sum + a.savings, 0);

  return (
    <div className={cn('relative w-full h-full min-h-[400px] rounded-lg overflow-hidden bg-sovereign-base p-3', className)}>
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="bg-violet-900/20 rounded-lg p-2 text-center border border-violet-500/30">
          <FileText className="w-4 h-4 mx-auto text-violet-400 mb-1" />
          <p className="text-lg font-bold text-white">{totalClaims}</p>
          <p className="text-[10px] text-gray-400">Active Claims</p>
        </div>
        <div className="bg-amber-900/20 rounded-lg p-2 text-center border border-amber-500/30">
          <DollarSign className="w-4 h-4 mx-auto text-amber-400 mb-1" />
          <p className="text-lg font-bold text-white">{formatCurrency(totalExposure)}</p>
          <p className="text-[10px] text-gray-400">Total Exposure</p>
        </div>
        <div className="bg-red-900/20 rounded-lg p-2 text-center border border-red-500/30">
          <AlertTriangle className="w-4 h-4 mx-auto text-red-400 mb-1" />
          <p className="text-lg font-bold text-white">{highFraudCount}</p>
          <p className="text-[10px] text-gray-400">Fraud Alerts</p>
        </div>
        <div className="bg-emerald-900/20 rounded-lg p-2 text-center border border-emerald-500/30">
          <Shield className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
          <p className="text-lg font-bold text-white">{formatCurrency(totalSavings)}</p>
          <p className="text-[10px] text-gray-400">AI Savings</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 h-[calc(100%-80px)]">
        {/* Left - Claims */}
        <div className="col-span-2 overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <FileText className="w-3 h-3" /> Recent Claims
          </h3>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {claims.map(claim => (
              <ClaimCard key={claim.id} claim={claim} />
            ))}
          </div>
          
          {/* Metrics */}
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Shield className="w-3 h-3" /> Claims by Line of Business
          </h3>
          <div className="text-[9px] text-gray-500 flex gap-2 mb-1 px-1.5">
            <span className="w-16">Line</span>
            <span className="w-10 text-right">Count</span>
            <span className="w-10 text-right">Cycle</span>
            <span className="flex-1">Approval Rate</span>
          </div>
          <div className="space-y-1">
            {METRICS.map(m => (
              <MetricRow key={m.category} metric={m} />
            ))}
          </div>
        </div>

        {/* Right - AI Agents */}
        <div className="overflow-y-auto">
          <h3 className="text-xs font-semibold text-gray-400 mb-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> AI Insurance Agents
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
        <span className="text-xs text-gray-300">Live Claims</span>
      </div>
    </div>
  );
};

export default InsuranceClaimsDashboard;
