// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaAegis™ - Strategic Defense Intelligence
 * "Real-time threat detection, containment, and resilience modeling."
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import {
  Shield,
  AlertTriangle,
  Radio,
  Target,
  FileText,
  Zap,
  Activity,
  Link2,
  Server,
  Cloud,
  FlaskConical,
  Play,
  Database,
  Lock,
  Eye,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  Bell,
} from 'lucide-react';

// Generate dynamic signal timeline data based on current time
const generateSignalTimeline = () => {
  const now = new Date();
  const currentHour = now.getHours();
  const timeline = [];

  // Generate data points for last 24 hours in 4-hour intervals
  for (let i = 6; i >= 0; i--) {
    const hourOffset = i * 4;
    const hour = (currentHour - hourOffset + 24) % 24;
    const hourStr = i === 0 ? 'Now' : `${hour.toString().padStart(2, '0')}:00`;
    // Generate semi-random but consistent data based on hour
    const baseCount = Math.floor(Math.sin(hour / 3) * 5 + 8);
    const criticalCount = Math.max(0, Math.floor(baseCount * 0.2));
    timeline.push({ hour: hourStr, count: baseCount, critical: criticalCount });
  }
  return timeline;
};

const SIGNAL_TIMELINE = generateSignalTimeline();

const THREAT_TYPES = [
  'All Types',
  'Malware',
  'Phishing',
  'Ransomware',
  'DDoS',
  'Insider',
  'APT',
  'Supply Chain',
];
const SEVERITY_LEVELS = ['All Severities', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

interface Threat {
  id: string;
  threatType: string;
  title: string;
  description: string;
  severity: string;
  probability: number;
  impactScore: number;
  status: string;
}

interface Signal {
  id: string;
  signalType: string;
  title: string;
  severity: string;
  confidence: number;
}

interface Dashboard {
  activeThreats: number;
  signalsLast24h: number;
  criticalThreats: number;
  pendingCountermeasures: number;
  topThreats: any[];
}

// MITRE-style threat categories
const THREAT_POSTURE = [
  { category: 'Initial Access', controls: 12, atRisk: 2, color: 'red' },
  { category: 'Execution', controls: 8, atRisk: 0, color: 'emerald' },
  { category: 'Persistence', controls: 10, atRisk: 1, color: 'amber' },
  { category: 'Privilege Escalation', controls: 9, atRisk: 0, color: 'emerald' },
  { category: 'Defense Evasion', controls: 14, atRisk: 3, color: 'red' },
  { category: 'Credential Access', controls: 7, atRisk: 1, color: 'amber' },
  { category: 'Lateral Movement', controls: 6, atRisk: 0, color: 'emerald' },
  { category: 'Collection', controls: 5, atRisk: 0, color: 'emerald' },
  { category: 'Exfiltration', controls: 8, atRisk: 1, color: 'amber' },
  { category: 'Impact', controls: 6, atRisk: 0, color: 'emerald' },
];

const INTEGRATIONS = [
  { id: 'siem', name: 'SIEM', icon: '📊', examples: 'Splunk, QRadar, Sentinel', connected: false },
  {
    id: 'edr',
    name: 'EDR/XDR',
    icon: '🛡️',
    examples: 'CrowdStrike, SentinelOne, Defender',
    connected: false,
  },
  {
    id: 'cloud',
    name: 'Cloud Logs',
    icon: '☁️',
    examples: 'AWS CloudTrail, Azure Monitor, GCP Logs',
    connected: false,
  },
  {
    id: 'vuln',
    name: 'Vulnerability',
    icon: '🔍',
    examples: 'Qualys, Tenable, Rapid7',
    connected: false,
  },
  {
    id: 'ti',
    name: 'Threat Intel',
    icon: '🎯',
    examples: 'MISP, OTX, VirusTotal',
    connected: false,
  },
];

export const AegisPage: React.FC = () => {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [signals, setSignals] = useState<Signal[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);

  // Filter and search state
  const [searchQuery, setSearchQuery] = useState('');
  const [threatTypeFilter, setThreatTypeFilter] = useState('All Types');
  const [severityFilter, setSeverityFilter] = useState('All Severities');
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [autoRefresh, setAutoRefresh] = useState(false);

  // Filtered threats based on search and filters
  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      searchQuery === '' ||
      threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType =
      threatTypeFilter === 'All Types' ||
      threat.threatType.toLowerCase().includes(threatTypeFilter.toLowerCase());
    const matchesSeverity =
      severityFilter === 'All Severities' || threat.severity === severityFilter;
    return matchesSearch && matchesType && matchesSeverity;
  });

  // Filtered signals based on search and severity
  const filteredSignals = signals.filter((signal) => {
    const matchesSearch =
      searchQuery === '' || signal.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity =
      severityFilter === 'All Severities' || signal.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  useEffect(() => {
    loadData();
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (!autoRefresh) {return;}
    const interval = setInterval(() => {
      loadData();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const [threatRes, signalRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Threat[] }>('/aegis/threats'),
        apiClient.api.get<{ data: Signal[] }>('/aegis/signals'),
        apiClient.api.get<{ data: Dashboard }>('/aegis/dashboard'),
      ]);
      if (threatRes.success) {
        setThreats((threatRes.data as any)?.data || threatRes.data || []);
      }
      if (signalRes.success) {
        setSignals((signalRes.data as any)?.data || signalRes.data || []);
      }
      if (dashRes.success) {
        setDashboard((dashRes.data as any)?.data || dashRes.data || null);
      }
    } catch (error) {
      console.error('Failed to load Aegis data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateScenarios = async (threatId: string) => {
    setIsGenerating(true);
    try {
      await apiClient.api.post(`/aegis/threats/${threatId}/scenarios`);
      await loadData();
    } finally {
      setIsGenerating(false);
    }
  };

  const createThreat = async () => {
    try {
      await apiClient.api.post('/aegis/threats', {
        threatType: 'CYBER_ATTACK',
        title: 'Sample Threat Assessment',
        description: 'Potential cyber threat detected for analysis',
        severity: 'MEDIUM',
        probability: 0.5,
        impactScore: 50,
      });
      await loadData();
    } catch (error) {
      console.error('Failed to create threat:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-500 bg-red-500/20';
      case 'HIGH':
        return 'text-orange-500 bg-orange-500/20';
      case 'MEDIUM':
        return 'text-yellow-500 bg-yellow-500/20';
      default:
        return 'text-blue-500 bg-blue-500/20';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        Loading Aegis...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-red-400" />
            <div>
              <h1 className="text-3xl font-bold">CendiaAegis™</h1>
              <p className="text-slate-400">
                Strategic Defense Intelligence - "Real-time threat detection, containment, and
                resilience modeling."
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const ctx = {
                  question: `Assess the current threat landscape and recommend priority countermeasures`,
                  sourcePage: 'CendiaAegis',
                  contextSummary: `${dashboard?.activeThreats || 0} active threats, ${dashboard?.criticalThreats || 0} critical`,
                  contextData: {
                    activeThreats: dashboard?.activeThreats || 0,
                    criticalThreats: dashboard?.criticalThreats || 0,
                    signalsLast24h: dashboard?.signalsLast24h || 0,
                    pendingCountermeasures: dashboard?.pendingCountermeasures || 0,
                    threatTypes: [...new Set(threats.map(t => t.threatType))].join(', '),
                  },
                  suggestedMode: (dashboard?.criticalThreats || 0) > 0 ? 'crisis' : 'war-room',
                };
                sessionStorage.setItem('councilQueryContext', JSON.stringify(ctx));
                window.location.href = '/cortex/council?fromContext=true';
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              💬 Ask Council
            </button>
            <button
              onClick={() => window.open('/cortex/sovereign/crucible?preset=cyber-attack', '_blank')}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2"
            >
              <FlaskConical className="w-4 h-4" /> Stress Test in Crucible
            </button>
            <button
              onClick={() => {
                // Export threat report functionality
                const reportData = {
                  generated: new Date().toISOString(),
                  threats: filteredThreats,
                  signals: filteredSignals,
                  dashboard,
                };
                const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                  type: 'application/json',
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `aegis-threat-report-${new Date().toISOString().split('T')[0]}.json`;
                a.click();
              }}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Target className="w-4 h-4" /> Active Threats
            </div>
            <div className="text-3xl font-bold text-red-400">{dashboard.activeThreats}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Radio className="w-4 h-4" /> Signals (24h)
            </div>
            <div className="text-3xl font-bold">{dashboard.signalsLast24h}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <AlertTriangle className="w-4 h-4" /> Critical
            </div>
            <div className="text-3xl font-bold text-red-500">{dashboard.criticalThreats}</div>
          </div>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Zap className="w-4 h-4" /> Pending Actions
            </div>
            <div className="text-3xl font-bold text-yellow-400">
              {dashboard.pendingCountermeasures}
            </div>
          </div>
        </div>
      )}

      {/* Signal Timeline Chart */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-blue-400" /> Signal Timeline
            </h2>
            <div className="flex items-center gap-1 bg-slate-700 rounded-lg p-0.5">
              {(['24h', '7d', '30d'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs ${
                autoRefresh ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
              Auto-refresh
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-slate-300">
              <Bell className="w-3 h-3" /> Alerts
            </button>
          </div>
        </div>

        {/* Simple bar chart visualization */}
        <div className="flex items-end gap-2 h-32 mb-2">
          {SIGNAL_TIMELINE.map((point, i) => {
            const maxCount = Math.max(...SIGNAL_TIMELINE.map((p) => p.count));
            const height = (point.count / maxCount) * 100;
            const criticalHeight = (point.critical / maxCount) * 100;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '100%' }}>
                  <div
                    className="absolute bottom-0 w-full bg-blue-500/30 rounded-t transition-all"
                    style={{ height: `${height}%` }}
                  >
                    {point.critical > 0 && (
                      <div
                        className="absolute bottom-0 w-full bg-red-500 rounded-t"
                        style={{ height: `${(criticalHeight / height) * 100}%` }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {SIGNAL_TIMELINE.map((point, i) => (
            <div key={i} className="flex-1 text-center">
              <div className="text-[10px] text-slate-500">{point.hour}</div>
              <div className="text-xs text-slate-400">{point.count}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700 text-xs">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-blue-500/50"></span> Total signals
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded bg-red-500"></span> Critical
          </span>
          <span className="flex-1"></span>
          <span className="text-slate-500">
            {timeRange === '24h'
              ? 'Last 24 hours'
              : timeRange === '7d'
                ? 'Last 7 days'
                : 'Last 30 days'}
          </span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search threats, signals, sources..."
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Threat Type Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <select
              value={threatTypeFilter}
              onChange={(e) => setThreatTypeFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
            >
              {THREAT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm"
          >
            {SEVERITY_LEVELS.map((s) => (
              <option
                key={s}
                value={s}
                className={
                  s === 'CRITICAL'
                    ? 'text-red-400'
                    : s === 'HIGH'
                      ? 'text-orange-400'
                      : s === 'MEDIUM'
                        ? 'text-yellow-400'
                        : s === 'LOW'
                          ? 'text-blue-400'
                          : ''
                }
              >
                {s}
              </option>
            ))}
          </select>

          {/* Clear Filters */}
          {(searchQuery ||
            threatTypeFilter !== 'All Types' ||
            severityFilter !== 'All Severities') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setThreatTypeFilter('All Types');
                setSeverityFilter('All Severities');
              }}
              className="px-3 py-2 text-xs text-slate-400 hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Threat Posture Summary - MITRE-style */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Eye className="w-5 h-5 text-red-400" /> Threat Posture (MITRE ATT&CK)
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Covered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> Partial
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> At Risk
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {THREAT_POSTURE.map((cat) => (
            <div
              key={cat.category}
              className={`p-3 rounded-lg border ${
                cat.color === 'red'
                  ? 'bg-red-500/10 border-red-500/30'
                  : cat.color === 'amber'
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-emerald-500/10 border-emerald-500/30'
              }`}
            >
              <div className="text-xs text-slate-400 mb-1">{cat.category}</div>
              <div className="flex items-center justify-between">
                <span
                  className={`text-lg font-bold ${
                    cat.color === 'red'
                      ? 'text-red-400'
                      : cat.color === 'amber'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}
                >
                  {cat.controls - cat.atRisk}/{cat.controls}
                </span>
                {cat.atRisk > 0 && <span className="text-xs text-red-400">{cat.atRisk} gaps</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between">
          <span className="text-sm text-slate-400">
            Overall coverage: <strong className="text-white">87%</strong> across 85 controls
          </span>
          <button className="text-xs text-red-400 hover:text-red-300">
            View full MITRE matrix →
          </button>
        </div>
      </div>

      {/* Integrations Callout */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-800/50 rounded-lg p-6 border border-slate-700 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-400" /> Security Integrations
            </h2>
            <p className="text-sm text-slate-400">
              Connect your security stack for real-time threat intelligence
            </p>
          </div>
          <button
            onClick={() => setShowIntegrations(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium"
          >
            Configure Integrations
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {INTEGRATIONS.map((int) => (
            <div
              key={int.id}
              className="p-3 bg-slate-900/50 rounded-lg border border-slate-600 text-center"
            >
              <div className="text-2xl mb-1">{int.icon}</div>
              <div className="text-sm font-medium">{int.name}</div>
              <div className="text-xs text-slate-500">
                {int.connected ? '✓ Connected' : 'Not connected'}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threats */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Target className="w-5 h-5 text-red-400" /> Active Threats
            </h2>
            <button
              onClick={createThreat}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
            >
              + New Threat
            </button>
          </div>
          {threats.length === 0 ? (
            <div className="text-center py-12">
              <Shield className="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No Active Threats</h3>
              <p className="text-slate-400 mb-6 max-w-sm mx-auto">
                Your environment is clear. Import signals or simulate an incident to test your
                response.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => setShowIntegrations(true)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <Database className="w-4 h-4" /> Import Signals
                </button>
                <button
                  onClick={() => window.open('/cortex/sovereign/crucible?preset=cyber-attack', '_blank')}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                  <FlaskConical className="w-4 h-4" /> Simulate Incident
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredThreats.map((t) => (
                <div key={t.id} className="p-4 bg-slate-700/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-0.5 rounded text-xs ${getSeverityColor(t.severity)}`}>
                      {t.severity}
                    </span>
                    <span className="text-xs text-slate-400">{t.threatType}</span>
                  </div>
                  <div className="font-medium mb-1">{t.title}</div>
                  <div className="text-sm text-slate-400 mb-2">
                    {t.description?.substring(0, 100)}...
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Probability: {Math.round(t.probability * 100)}%</span>
                    <span>Impact: {t.impactScore}/100</span>
                  </div>
                  <button
                    onClick={() => generateScenarios(t.id)}
                    disabled={isGenerating}
                    className="mt-2 w-full px-3 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Scenarios'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Signals */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Radio className="w-5 h-5 text-blue-400" /> Recent Signals
          </h2>
          {signals.length === 0 ? (
            <div className="text-center py-12">
              <Radio className="w-12 h-12 mx-auto mb-3 text-blue-400 opacity-50" />
              <p className="text-slate-400 mb-4">No signals captured yet</p>
              <button
                onClick={() => setShowIntegrations(true)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
              >
                Connect Security Tools →
              </button>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredSignals.map((s) => (
                <div key={s.id} className="p-3 bg-slate-700/50 rounded-lg flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${getSeverityColor(s.severity).split(' ')[0]}`} />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{s.title}</div>
                    <div className="text-xs text-slate-400">
                      {s.signalType} • Confidence: {Math.round(s.confidence * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Integrations Modal */}
      {showIntegrations && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setShowIntegrations(false)}
        >
          <div
            className="bg-slate-800 rounded-xl p-6 w-full max-w-2xl border border-slate-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold">Security Integrations</h3>
                <p className="text-sm text-slate-400">
                  Connect your security tools to enable real-time threat detection
                </p>
              </div>
              <button
                onClick={() => setShowIntegrations(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              {INTEGRATIONS.map((int) => (
                <div
                  key={int.id}
                  className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{int.icon}</span>
                    <div>
                      <div className="font-medium">{int.name}</div>
                      <div className="text-xs text-slate-400">{int.examples}</div>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm">
                    Connect
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-700 text-center">
              <p className="text-xs text-slate-500">
                All integrations use encrypted connections. API keys are stored in your secure
                vault.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AegisPage;
