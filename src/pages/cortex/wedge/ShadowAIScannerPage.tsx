/**
 * Page — Shadow AI Scanner
 *
 * Wedge 1: Scan your organization for unauthorized AI tool usage.
 * Quantifies data leakage risk with dollar exposure estimates.
 * Free scan → paid continuous monitoring upsell.
 *
 * @exports ShadowAIScannerPage
 * @module pages/cortex/wedge/ShadowAIScannerPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useCallback } from 'react';
import {
  Shield, AlertTriangle, Eye, Search, Users, Building2,
  DollarSign, Activity, ChevronRight, Loader2, BarChart3,
  ShieldAlert, ShieldCheck, XCircle, Lock, FileText,
  Download, RefreshCw, Cpu, Globe, Ban, Zap, TrendingUp,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface ScanConfig {
  organizationName: string;
  industry: string;
  employeeCount: number;
  authorizedTools: string[];
  departments: string[];
}

interface ScanSummary {
  totalEmployees: number;
  employeesUsingAI: number;
  unauthorizedToolsDetected: number;
  totalInteractions: number;
  piiExposures: number;
  sourceCodeLeaks: number;
  confidentialDataLeaks: number;
  estimatedExposureUsd: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
}

interface ToolData {
  tool: string;
  provider: string;
  authorized: boolean;
  userCount: number;
  interactionCount: number;
  piiExposures: number;
  estimatedCostUsd: number;
}

interface DeptData {
  department: string;
  userCount: number;
  interactionCount: number;
  piiExposures: number;
  topTools: string[];
  riskLevel: string;
}

interface RiskItem {
  severity: string;
  category: string;
  description: string;
  affectedUsers: number;
  estimatedExposureUsd: number;
  recommendation: string;
}

interface ComplianceGap {
  framework: string;
  requirement: string;
  status: string;
  finding: string;
}

interface ScanResult {
  scanId: string;
  scanDurationMs: number;
  summary: ScanSummary;
  byTool: ToolData[];
  byDepartment: DeptData[];
  topRisks: RiskItem[];
  complianceGaps: ComplianceGap[];
  integrityHash: string;
  generatedAt: string;
}

// =============================================================================
// INDUSTRY OPTIONS
// =============================================================================

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Legal', 'Technology', 'Manufacturing',
  'Government', 'Defense', 'Retail', 'Education', 'Insurance', 'Energy',
  'Telecommunications', 'Real Estate', 'Consulting', 'Pharmaceutical',
];

const AI_TOOLS = [
  'ChatGPT', 'Claude', 'Gemini', 'Copilot', 'Perplexity', 'Midjourney',
  'Cursor', 'Jasper AI', 'DeepSeek', 'Grok', 'Ollama', 'HuggingChat',
];

const DEPARTMENTS = [
  'Engineering', 'Product', 'Legal', 'Finance', 'Marketing',
  'HR', 'Sales', 'Operations', 'Executive', 'Customer Support',
];

// =============================================================================
// COMPONENTS
// =============================================================================

const RiskBadge: React.FC<{ level: string }> = ({ level }) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-green-500/20 text-green-400 border-green-500/30',
  };
  return (
    <span className={cn('px-2.5 py-0.5 text-xs font-semibold rounded-full border', colors[level] || colors.medium)}>
      {level.toUpperCase()}
    </span>
  );
};

const StatCard: React.FC<{
  label: string; value: string | number; icon: React.ReactNode;
  color: string; subtext?: string; alert?: boolean;
}> = ({ label, value, icon, color, subtext, alert }) => (
  <div className={cn(
    'bg-sovereign-card border rounded-xl p-5 transition-all duration-300',
    alert ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-sovereign-border hover:border-opacity-60'
  )}>
    <div className="flex items-start justify-between mb-3">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
      {alert && <AlertTriangle className="w-5 h-5 text-red-400 animate-pulse" />}
    </div>
    <div className="text-2xl font-bold text-white mb-1">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs text-gray-500">{label}</div>
    {subtext && <div className="text-xs text-gray-600 mt-1">{subtext}</div>}
  </div>
);

// =============================================================================
// SCAN CONFIG FORM
// =============================================================================

const ScanConfigForm: React.FC<{ onSubmit: (config: ScanConfig) => void; loading: boolean }> = ({ onSubmit, loading }) => {
  const [config, setConfig] = useState<ScanConfig>({
    organizationName: '',
    industry: 'Financial Services',
    employeeCount: 500,
    authorizedTools: ['Copilot'],
    departments: [...DEPARTMENTS],
  });

  const toggleTool = (tool: string) => {
    setConfig(prev => ({
      ...prev,
      authorizedTools: prev.authorizedTools.includes(tool)
        ? prev.authorizedTools.filter(t => t !== tool)
        : [...prev.authorizedTools, tool],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
          <ShieldAlert className="w-4 h-4" />
          Free Security Assessment
        </div>
        <h1 className="text-4xl font-bold text-white mb-4">Shadow AI Scanner</h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Discover what AI tools your employees are really using — and what data they're leaking.
          Get your risk exposure quantified in under 60 seconds.
        </p>
      </div>

      {/* Form */}
      <div className="bg-sovereign-card border border-sovereign-border rounded-2xl p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Organization Name</label>
            <input
              type="text"
              value={config.organizationName}
              onChange={e => setConfig(prev => ({ ...prev, organizationName: e.target.value }))}
              placeholder="Acme Corporation"
              className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white placeholder-gray-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Industry</label>
            <select
              value={config.industry}
              onChange={e => setConfig(prev => ({ ...prev, industry: e.target.value }))}
              className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            >
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Employee Count</label>
            <input
              type="number"
              value={config.employeeCount}
              onChange={e => setConfig(prev => ({ ...prev, employeeCount: parseInt(e.target.value) || 100 }))}
              min={10}
              max={100000}
              className="w-full bg-sovereign-dark border border-sovereign-border rounded-lg px-4 py-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Which AI tools are <span className="text-green-400">authorized</span> in your organization?
          </label>
          <div className="flex flex-wrap gap-2">
            {AI_TOOLS.map(tool => (
              <button
                key={tool}
                onClick={() => toggleTool(tool)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors',
                  config.authorizedTools.includes(tool)
                    ? 'bg-green-500/20 border-green-500/40 text-green-400'
                    : 'bg-sovereign-dark border-sovereign-border text-gray-500 hover:text-gray-300'
                )}
              >
                {tool}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            Click to toggle. Unselected tools will be flagged as unauthorized.
          </p>
        </div>

        <button
          onClick={() => config.organizationName && onSubmit(config)}
          disabled={loading || !config.organizationName}
          className={cn(
            'w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all flex items-center justify-center gap-3',
            loading
              ? 'bg-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-500/20'
          )}
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Scanning your organization...
            </>
          ) : (
            <>
              <Search className="w-5 h-5" />
              Run Free Shadow AI Scan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// =============================================================================
// SCAN RESULTS DASHBOARD
// =============================================================================

const ScanResults: React.FC<{ result: ScanResult; onRescan: () => void }> = ({ result, onRescan }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tools' | 'departments' | 'risks' | 'compliance'>('overview');
  const { summary } = result;

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'tools' as const, label: `AI Tools (${result.byTool.length})`, icon: <Cpu className="w-4 h-4" /> },
    { id: 'departments' as const, label: 'Departments', icon: <Building2 className="w-4 h-4" /> },
    { id: 'risks' as const, label: `Risks (${result.topRisks.length})`, icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'compliance' as const, label: 'Compliance', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Shadow AI Scan Results</h1>
          <p className="text-gray-500 mt-1">
            Scan ID: <span className="font-mono text-gray-400">{result.scanId}</span>
            {' · '}Completed in {(result.scanDurationMs / 1000).toFixed(1)}s
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={onRescan} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sovereign-card border border-sovereign-border text-gray-300 hover:text-white transition-colors">
            <RefreshCw className="w-4 h-4" />
            New Scan
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Alert Banner */}
      {(summary.riskLevel === 'critical' || summary.riskLevel === 'high') && (
        <div className={cn(
          'rounded-xl p-4 border flex items-start gap-4',
          summary.riskLevel === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-orange-500/10 border-orange-500/30'
        )}>
          <ShieldAlert className={cn('w-6 h-6 mt-0.5 flex-shrink-0', summary.riskLevel === 'critical' ? 'text-red-400' : 'text-orange-400')} />
          <div>
            <div className={cn('font-semibold text-lg', summary.riskLevel === 'critical' ? 'text-red-400' : 'text-orange-400')}>
              {summary.riskLevel === 'critical' ? 'Critical' : 'High'} Risk Exposure Detected
            </div>
            <p className="text-gray-300 text-sm mt-1">
              {summary.employeesUsingAI} employees are using {summary.unauthorizedToolsDetected} unauthorized AI tools.
              {' '}{summary.piiExposures} PII exposures and {summary.sourceCodeLeaks} source code leaks detected.
              {' '}Estimated financial exposure: <strong className="text-white">${summary.estimatedExposureUsd.toLocaleString()}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Employees Using AI" value={summary.employeesUsingAI} icon={<Users className="w-5 h-5 text-blue-400" />} color="bg-blue-500/20" subtext={`of ${summary.totalEmployees} total`} />
        <StatCard label="Unauthorized Tools" value={summary.unauthorizedToolsDetected} icon={<Ban className="w-5 h-5 text-red-400" />} color="bg-red-500/20" alert={summary.unauthorizedToolsDetected > 3} />
        <StatCard label="PII Exposures" value={summary.piiExposures} icon={<Eye className="w-5 h-5 text-orange-400" />} color="bg-orange-500/20" alert={summary.piiExposures > 10} />
        <StatCard label="Estimated Exposure" value={`$${(summary.estimatedExposureUsd / 1_000_000).toFixed(1)}M`} icon={<DollarSign className="w-5 h-5 text-red-400" />} color="bg-red-500/20" alert />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total AI Interactions" value={summary.totalInteractions} icon={<Activity className="w-5 h-5 text-purple-400" />} color="bg-purple-500/20" subtext="Last 7 days" />
        <StatCard label="Source Code Leaks" value={summary.sourceCodeLeaks} icon={<Lock className="w-5 h-5 text-yellow-400" />} color="bg-yellow-500/20" alert={summary.sourceCodeLeaks > 5} />
        <StatCard label="Confidential Data Leaks" value={summary.confidentialDataLeaks} icon={<ShieldAlert className="w-5 h-5 text-red-400" />} color="bg-red-500/20" alert={summary.confidentialDataLeaks > 5} />
        <StatCard label="Risk Level" value={summary.riskLevel.toUpperCase()} icon={<Shield className="w-5 h-5 text-red-400" />} color={summary.riskLevel === 'critical' ? 'bg-red-500/20' : summary.riskLevel === 'high' ? 'bg-orange-500/20' : 'bg-yellow-500/20'} />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-sovereign-dark rounded-xl p-1 border border-sovereign-border">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all',
              activeTab === tab.id ? 'bg-sovereign-card text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-sovereign-card border border-sovereign-border rounded-xl overflow-hidden">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white">Executive Summary</h3>
            <p className="text-gray-400 leading-relaxed">
              Your organization has <strong className="text-white">{summary.employeesUsingAI}</strong> employees actively using AI tools,
              of which <strong className="text-red-400">{summary.unauthorizedToolsDetected}</strong> are unauthorized.
              In the last 7 days, we detected <strong className="text-orange-400">{summary.piiExposures}</strong> instances of personally
              identifiable information being sent to external AI providers, and <strong className="text-yellow-400">{summary.sourceCodeLeaks}</strong> instances
              of proprietary source code being exposed.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Based on industry benchmarks for <strong className="text-white">{summary.totalEmployees.toLocaleString()}</strong>-employee organizations,
              the estimated financial exposure from data leakage is <strong className="text-red-400">${summary.estimatedExposureUsd.toLocaleString()}</strong>.
              This includes direct damages, regulatory fines, litigation costs, and reputational impact.
            </p>
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-blue-400">Recommended: Deploy CendiaGateway</span>
              </div>
              <p className="text-sm text-gray-300">
                CendiaGateway acts as an AI governance proxy — intercepting, scanning, and logging every AI interaction
                across your organization. It blocks PII leakage in real-time, enforces usage policies, and creates
                court-admissible audit trails for every AI-assisted decision.
              </p>
              <button className="mt-3 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors inline-flex items-center gap-2">
                Learn More <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'tools' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sovereign-border">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Tool</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Provider</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Users</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Interactions</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">PII Exposures</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sovereign-border">
                {result.byTool.map((tool, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-medium text-white">{tool.tool}</td>
                    <td className="px-6 py-3 text-gray-400">{tool.provider}</td>
                    <td className="px-6 py-3 text-center">
                      {tool.authorized
                        ? <span className="inline-flex items-center gap-1 text-green-400 text-xs"><ShieldCheck className="w-3.5 h-3.5" /> Authorized</span>
                        : <span className="inline-flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3.5 h-3.5" /> Unauthorized</span>
                      }
                    </td>
                    <td className="px-6 py-3 text-right text-gray-300">{tool.userCount}</td>
                    <td className="px-6 py-3 text-right text-gray-300">{tool.interactionCount}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={tool.piiExposures > 0 ? 'text-red-400 font-semibold' : 'text-gray-500'}>{tool.piiExposures}</span>
                    </td>
                    <td className="px-6 py-3 text-right text-gray-400">${tool.estimatedCostUsd.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sovereign-border">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Department</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Users</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Interactions</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">PII Exposures</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Top Tools</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-6 py-3">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sovereign-border">
                {result.byDepartment.map((dept, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-medium text-white flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      {dept.department}
                    </td>
                    <td className="px-6 py-3 text-right text-gray-300">{dept.userCount}</td>
                    <td className="px-6 py-3 text-right text-gray-300">{dept.interactionCount}</td>
                    <td className="px-6 py-3 text-right">
                      <span className={dept.piiExposures > 0 ? 'text-red-400 font-semibold' : 'text-gray-500'}>{dept.piiExposures}</span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{dept.topTools.join(', ')}</td>
                    <td className="px-6 py-3 text-center"><RiskBadge level={dept.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'risks' && (
          <div className="p-6 space-y-4">
            {result.topRisks.map((risk, i) => (
              <div key={i} className={cn(
                'rounded-xl p-5 border',
                risk.severity === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                risk.severity === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                'bg-yellow-500/5 border-yellow-500/20'
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <RiskBadge level={risk.severity} />
                    <span className="font-semibold text-white">{risk.category}</span>
                  </div>
                  {risk.estimatedExposureUsd > 0 && (
                    <span className="text-red-400 font-semibold">${risk.estimatedExposureUsd.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-3">{risk.description}</p>
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 font-medium">Recommendation:</span>
                  <span className="text-gray-300">{risk.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'compliance' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-sovereign-border">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Framework</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Requirement</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sovereign-border">
                {result.complianceGaps.map((gap, i) => (
                  <tr key={i} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-3 font-medium text-white">{gap.framework}</td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{gap.requirement}</td>
                    <td className="px-6 py-3 text-center">
                      <span className={cn(
                        'px-2 py-0.5 text-xs font-semibold rounded-full',
                        gap.status === 'non_compliant' ? 'bg-red-500/20 text-red-400' :
                        gap.status === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      )}>
                        {gap.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-400 text-sm">{gap.finding}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-3">Stop Shadow AI Before It Costs You Millions</h3>
        <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
          Deploy CendiaGateway for continuous monitoring — intercept PII leakage in real-time,
          enforce AI usage policies, and create court-admissible audit trails for every AI interaction.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors inline-flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Request a Demo
          </button>
          <button className="px-6 py-3 rounded-xl bg-sovereign-card border border-sovereign-border text-gray-300 hover:text-white font-semibold transition-colors inline-flex items-center gap-2">
            <Globe className="w-5 h-5" />
            View CendiaGateway
          </button>
        </div>
      </div>

      {/* Attestation */}
      <div className="text-center text-xs text-gray-600 font-mono">
        Integrity: {result.integrityHash} · Generated: {new Date(result.generatedAt).toLocaleString()}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const ShadowAIScannerPage: React.FC = () => {
  const [result, setResult] = useState<ScanResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleScan = useCallback(async (config: ScanConfig) => {
    setLoading(true);
    try {
      const res = await fetch('/api/v1/wedge/shadow-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          organizationId: config.organizationName.toLowerCase().replace(/\s+/g, '-'),
          ...config,
        }),
      });
      const data = await res.json();
      if (data.success) setResult(data.data);
    } catch (err) {
      console.error('Scan failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-sovereign-dark p-6 md:p-8">
      {result ? (
        <ScanResults result={result} onRescan={() => setResult(null)} />
      ) : (
        <ScanConfigForm onSubmit={handleScan} loading={loading} />
      )}
    </div>
  );
};

export default ShadowAIScannerPage;
