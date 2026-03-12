/**
 * Page — CendiaGateway Dashboard
 *
 * AI Governance Gateway — reverse proxy, PII detection, policy engine,
 * cryptographic signing, Shadow AI detection, compliance manifest.
 *
 * @exports CendiaGatewayPage
 * @module pages/cortex/gateway/CendiaGatewayPage
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield, Activity, AlertTriangle, Lock, Eye, EyeOff, Search,
  Server, Zap, FileSignature, RefreshCw, ChevronRight,
  Globe, Cpu, ShieldAlert, ShieldCheck, FileText, Send,
  BarChart3, Clock, Users, Building2, Hash, Loader2, Copy,
  CheckCircle, XCircle, Fingerprint, Network, ScanLine, Ban,
} from 'lucide-react';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface GatewayStats {
  totalInteractions: number;
  blockedRequests: number;
  piiDetections: number;
  totalTokens: number;
  totalCostUsd: number;
  avgLatencyMs: number;
  providers: number;
  activePolicies: number;
  byProvider: Record<string, { requests: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, number>;
}

interface GatewayInteraction {
  id: string;
  provider: string;
  model: string;
  userId: string;
  userEmail: string;
  userDepartment: string;
  piiDetected: boolean;
  piiTypes: string[];
  policyAction: string;
  policyReason: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
  latencyMs: number;
  statusCode: number;
  integrityHash: string;
  requestedAt: string;
}

interface GatewayPolicy {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  departments: string[];
  blockPIITypes: string[];
  redactPIITypes: string[];
  blockKeywords: string[];
  defaultAction: string;
}

interface PIIResult {
  hasPII: boolean;
  types: string[];
  detections: Array<{ type: string; redacted: string; confidence: number }>;
  redactedText: string;
  scanDurationMs: number;
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_STATS: GatewayStats = {
  totalInteractions: 14_847,
  blockedRequests: 312,
  piiDetections: 1_043,
  totalTokens: 28_491_200,
  totalCostUsd: 847.32,
  avgLatencyMs: 42,
  providers: 8,
  activePolicies: 12,
  byProvider: {
    'OpenAI': { requests: 6_234, tokens: 12_400_000, costUsd: 372.00 },
    'Anthropic': { requests: 3_891, tokens: 8_200_000, costUsd: 246.00 },
    'Google AI': { requests: 2_012, tokens: 4_100_000, costUsd: 82.00 },
    'Ollama (Local)': { requests: 1_547, tokens: 2_800_000, costUsd: 0 },
    'Groq': { requests: 891, tokens: 780_000, costUsd: 1.56 },
    'Mistral': { requests: 272, tokens: 211_200, costUsd: 145.76 },
  },
  byDepartment: {
    'Engineering': 5_234,
    'Product': 3_102,
    'Legal': 2_891,
    'Finance': 1_789,
    'Marketing': 1_234,
    'HR': 597,
  },
};

const DEMO_INTERACTIONS: GatewayInteraction[] = [
  { id: 'gw-001', provider: 'OpenAI', model: 'gpt-4o', userId: 'user-12', userEmail: 'j.garcia@acme.com', userDepartment: 'Engineering', piiDetected: false, piiTypes: [], policyAction: 'allow', policyReason: '', promptTokens: 1240, responseTokens: 890, totalTokens: 2130, estimatedCostUsd: 0.032, latencyMs: 1847, statusCode: 200, integrityHash: 'sha256:a1b2c3d4...', requestedAt: new Date(Date.now() - 120000).toISOString() },
  { id: 'gw-002', provider: 'Anthropic', model: 'claude-3.5-sonnet', userId: 'user-07', userEmail: 'm.lopez@acme.com', userDepartment: 'Legal', piiDetected: true, piiTypes: ['email', 'phone'], policyAction: 'redact', policyReason: 'PII detected: email, phone — redacted before forwarding', promptTokens: 2100, responseTokens: 1560, totalTokens: 3660, estimatedCostUsd: 0.055, latencyMs: 2341, statusCode: 200, integrityHash: 'sha256:e5f6g7h8...', requestedAt: new Date(Date.now() - 300000).toISOString() },
  { id: 'gw-003', provider: 'OpenAI', model: 'gpt-4o', userId: 'user-03', userEmail: 'r.chen@acme.com', userDepartment: 'Finance', piiDetected: true, piiTypes: ['ssn', 'bank_account'], policyAction: 'block', policyReason: 'Critical PII: SSN and bank account detected — blocked per Finance policy', promptTokens: 890, responseTokens: 0, totalTokens: 890, estimatedCostUsd: 0, latencyMs: 12, statusCode: 403, integrityHash: 'sha256:i9j0k1l2...', requestedAt: new Date(Date.now() - 600000).toISOString() },
  { id: 'gw-004', provider: 'Google AI', model: 'gemini-1.5-pro', userId: 'user-19', userEmail: 'a.patel@acme.com', userDepartment: 'Product', piiDetected: false, piiTypes: [], policyAction: 'allow', policyReason: '', promptTokens: 3200, responseTokens: 2100, totalTokens: 5300, estimatedCostUsd: 0.021, latencyMs: 1234, statusCode: 200, integrityHash: 'sha256:m3n4o5p6...', requestedAt: new Date(Date.now() - 900000).toISOString() },
  { id: 'gw-005', provider: 'Ollama (Local)', model: 'llama3.3:70b', userId: 'user-12', userEmail: 'j.garcia@acme.com', userDepartment: 'Engineering', piiDetected: false, piiTypes: [], policyAction: 'allow', policyReason: '', promptTokens: 1800, responseTokens: 950, totalTokens: 2750, estimatedCostUsd: 0, latencyMs: 3200, statusCode: 200, integrityHash: 'sha256:q7r8s9t0...', requestedAt: new Date(Date.now() - 1200000).toISOString() },
  { id: 'gw-006', provider: 'OpenAI', model: 'gpt-4o-mini', userId: 'user-31', userEmail: 's.kim@acme.com', userDepartment: 'HR', piiDetected: true, piiTypes: ['name', 'address'], policyAction: 'redact', policyReason: 'PII: name, address redacted per HR data policy', promptTokens: 560, responseTokens: 420, totalTokens: 980, estimatedCostUsd: 0.001, latencyMs: 890, statusCode: 200, integrityHash: 'sha256:u1v2w3x4...', requestedAt: new Date(Date.now() - 1800000).toISOString() },
];

const DEMO_POLICIES: GatewayPolicy[] = [
  { id: 'pol-001', name: 'Block Critical PII', enabled: true, priority: 1, departments: [], blockPIITypes: ['ssn', 'bank_account', 'credit_card'], redactPIITypes: [], blockKeywords: [], defaultAction: 'block' },
  { id: 'pol-002', name: 'Redact Personal Data', enabled: true, priority: 2, departments: [], blockPIITypes: [], redactPIITypes: ['email', 'phone', 'address', 'name'], blockKeywords: [], defaultAction: 'redact' },
  { id: 'pol-003', name: 'Finance Dept Strict', enabled: true, priority: 3, departments: ['Finance'], blockPIITypes: ['ssn', 'bank_account', 'credit_card', 'tax_id'], redactPIITypes: ['email', 'phone'], blockKeywords: ['confidential', 'board materials'], defaultAction: 'block' },
  { id: 'pol-004', name: 'HR Sensitive Data', enabled: true, priority: 4, departments: ['HR'], blockPIITypes: ['ssn', 'medical'], redactPIITypes: ['name', 'address', 'phone', 'email'], blockKeywords: ['termination', 'salary', 'performance review'], defaultAction: 'redact' },
  { id: 'pol-005', name: 'Legal Compliance', enabled: true, priority: 5, departments: ['Legal'], blockPIITypes: [], redactPIITypes: ['name', 'email'], blockKeywords: ['privileged', 'attorney-client'], defaultAction: 'allow' },
  { id: 'pol-006', name: 'Shadow AI Detection', enabled: true, priority: 10, departments: [], blockPIITypes: [], redactPIITypes: [], blockKeywords: [], defaultAction: 'monitor' },
];

// =============================================================================
// STAT CARD
// =============================================================================

const StatCard: React.FC<{
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtext?: string;
}> = ({ label, value, icon, color, subtext }) => (
  <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-5 hover:border-opacity-60 transition-colors">
    <div className="flex items-start justify-between mb-3">
      <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', color)}>
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold text-white mb-1">
      {typeof value === 'number' ? value.toLocaleString() : value}
    </div>
    <div className="text-xs text-gray-500">{label}</div>
    {subtext && <div className="text-xs text-gray-600 mt-1">{subtext}</div>}
  </div>
);

// =============================================================================
// PII TESTER
// =============================================================================

const PIITester: React.FC = () => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<PIIResult | null>(null);
  const [testing, setTesting] = useState(false);

  const handleTest = async () => {
    if (!text.trim()) return;
    setTesting(true);
    try {
      const res = await fetch('/api/v1/gateway/test-pii', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      // Demo fallback
      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text);
      const hasPhone = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/.test(text);
      const hasSSN = /\b\d{3}-\d{2}-\d{4}\b/.test(text);
      const types: string[] = [];
      const detections: PIIResult['detections'] = [];
      if (hasEmail) { types.push('email'); detections.push({ type: 'email', redacted: '[EMAIL]', confidence: 0.98 }); }
      if (hasPhone) { types.push('phone'); detections.push({ type: 'phone', redacted: '[PHONE]', confidence: 0.95 }); }
      if (hasSSN) { types.push('ssn'); detections.push({ type: 'ssn', redacted: '[SSN]', confidence: 0.99 }); }
      let redacted = text;
      if (hasEmail) redacted = redacted.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
      if (hasPhone) redacted = redacted.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]');
      if (hasSSN) redacted = redacted.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN]');
      setResult({ hasPII: types.length > 0, types, detections, redactedText: redacted, scanDurationMs: 3 });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
        <ScanLine className="w-4 h-4 text-cyan-400" />
        Live PII Scanner — Try It
      </h3>
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Paste any text to test PII detection...&#10;&#10;Example: Please send the contract to john.doe@acme.com, his SSN is 123-45-6789 and phone is 555-123-4567."
          rows={4}
          className="w-full bg-sovereign-elevated border border-sovereign-border rounded-lg p-3 text-sm text-white placeholder-gray-600 focus:border-cyan-500/50 focus:outline-none resize-none"
        />
        <button
          onClick={handleTest}
          disabled={testing || !text.trim()}
          className="px-4 py-2 bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-600/30 transition-colors flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
        >
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Scan for PII
        </button>
        {result && (
          <div className={cn(
            'rounded-lg border p-4 space-y-3',
            result.hasPII ? 'bg-red-500/10 border-red-500/30' : 'bg-emerald-500/10 border-emerald-500/30'
          )}>
            <div className="flex items-center gap-2">
              {result.hasPII ? (
                <><ShieldAlert className="w-5 h-5 text-red-400" /><span className="font-semibold text-red-400">PII Detected</span></>
              ) : (
                <><ShieldCheck className="w-5 h-5 text-emerald-400" /><span className="font-semibold text-emerald-400">No PII Found</span></>
              )}
              <span className="text-xs text-gray-500 ml-auto">Scanned in {result.scanDurationMs}ms</span>
            </div>
            {result.detections.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {result.detections.map((d, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-red-500/20 text-red-300 rounded-full flex items-center gap-1">
                    <Ban className="w-3 h-3" /> {d.type} ({Math.round(d.confidence * 100)}%)
                  </span>
                ))}
              </div>
            )}
            {result.hasPII && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Redacted Output:</div>
                <code className="text-xs text-cyan-300 bg-sovereign-elevated p-2 rounded block whitespace-pre-wrap">
                  {result.redactedText}
                </code>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const CendiaGatewayPage: React.FC = () => {
  const [stats, setStats] = useState<GatewayStats>(DEMO_STATS);
  const [interactions, setInteractions] = useState<GatewayInteraction[]>(DEMO_INTERACTIONS);
  const [policies, setPolicies] = useState<GatewayPolicy[]>(DEMO_POLICIES);
  const [activeTab, setActiveTab] = useState<'overview' | 'interactions' | 'policies' | 'pii'>('overview');
  const [loading, setLoading] = useState(false);

  // Try loading real data from the API
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, interactionsRes, policiesRes] = await Promise.all([
          fetch('/api/v1/gateway/stats').then(r => r.json()).catch(() => null),
          fetch('/api/v1/gateway/interactions?limit=20').then(r => r.json()).catch(() => null),
          fetch('/api/v1/gateway/policies').then(r => r.json()).catch(() => null),
        ]);
        if (statsRes && !statsRes.error) setStats(statsRes);
        if (interactionsRes?.interactions) setInteractions(interactionsRes.interactions);
        if (policiesRes?.policies) setPolicies(policiesRes.policies);
      } catch { /* Use demo data */ }
      setLoading(false);
    };
    load();
  }, []);

  const blockRate = stats.totalInteractions > 0
    ? ((stats.blockedRequests / stats.totalInteractions) * 100).toFixed(1)
    : '0';

  const piiRate = stats.totalInteractions > 0
    ? ((stats.piiDetections / stats.totalInteractions) * 100).toFixed(1)
    : '0';

  return (
    <div className="min-h-screen bg-sovereign-base text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center">
              <Shield className="w-7 h-7 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">CendiaGateway</h1>
                <span className="text-[10px] px-2 py-0.5 bg-cyan-500/20 text-cyan-400 rounded-full font-mono">v2.0</span>
              </div>
              <p className="text-sm text-gray-400">
                AI Governance Gateway — Every AI interaction logged, scanned, signed, and auditable
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Gateway Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-sovereign-elevated rounded-lg p-1 w-fit">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'interactions', label: 'Interaction Log', icon: <Activity className="w-4 h-4" /> },
          { id: 'policies', label: 'Policies', icon: <FileText className="w-4 h-4" /> },
          { id: 'pii', label: 'PII Scanner', icon: <ScanLine className="w-4 h-4" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-md flex items-center gap-2 transition-colors',
              activeTab === tab.id
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-gray-200'
            )}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Interactions" value={stats.totalInteractions} icon={<Activity className="w-5 h-5 text-cyan-400" />} color="bg-cyan-500/15" />
            <StatCard label="PII Detections" value={stats.piiDetections} icon={<EyeOff className="w-5 h-5 text-amber-400" />} color="bg-amber-500/15" subtext={`${piiRate}% of interactions`} />
            <StatCard label="Blocked Requests" value={stats.blockedRequests} icon={<Ban className="w-5 h-5 text-red-400" />} color="bg-red-500/15" subtext={`${blockRate}% block rate`} />
            <StatCard label="Avg Latency" value={`${stats.avgLatencyMs}ms`} icon={<Zap className="w-5 h-5 text-emerald-400" />} color="bg-emerald-500/15" subtext="Gateway overhead" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Tokens" value={`${(stats.totalTokens / 1_000_000).toFixed(1)}M`} icon={<Cpu className="w-5 h-5 text-purple-400" />} color="bg-purple-500/15" />
            <StatCard label="Total Cost" value={`$${stats.totalCostUsd.toFixed(2)}`} icon={<BarChart3 className="w-5 h-5 text-blue-400" />} color="bg-blue-500/15" />
            <StatCard label="AI Providers" value={stats.providers} icon={<Globe className="w-5 h-5 text-indigo-400" />} color="bg-indigo-500/15" />
            <StatCard label="Active Policies" value={stats.activePolicies} icon={<Shield className="w-5 h-5 text-teal-400" />} color="bg-teal-500/15" />
          </div>

          {/* Provider Breakdown + How It Works */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Provider Usage */}
            <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                Provider Usage
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.byProvider).map(([name, data]) => {
                  const pct = stats.totalInteractions > 0 ? (data.requests / stats.totalInteractions) * 100 : 0;
                  return (
                    <div key={name}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-white">{name}</span>
                        <span className="text-gray-500">{data.requests.toLocaleString()} req · ${data.costUsd.toFixed(2)}</span>
                      </div>
                      <div className="h-2 bg-sovereign-elevated rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Architecture Diagram */}
            <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
              <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
                <Network className="w-4 h-4 text-cyan-400" />
                Three Layers of Coverage
              </h3>
              <div className="space-y-4">
                {[
                  { layer: 'Layer 1', title: 'API Gateway (Reverse Proxy)', desc: 'Intercepts all AI API calls. OpenAI, Anthropic, Google, Azure, Mistral, Cohere, Groq, Ollama.', icon: <Server className="w-5 h-5" />, color: 'border-cyan-500/40 bg-cyan-500/5' },
                  { layer: 'Layer 2', title: 'Browser Extensions', desc: '15+ AI sites monitored: ChatGPT, Claude, Gemini, Copilot, Perplexity, DeepSeek. Chrome, Firefox, Safari.', icon: <Globe className="w-5 h-5" />, color: 'border-blue-500/40 bg-blue-500/5' },
                  { layer: 'Layer 3', title: 'Network HTTP Proxy', desc: 'Network-level interception via PAC file. Browser-agnostic, works with any application.', icon: <Network className="w-5 h-5" />, color: 'border-purple-500/40 bg-purple-500/5' },
                ].map(item => (
                  <div key={item.layer} className={cn('border rounded-lg p-4', item.color)}>
                    <div className="flex items-center gap-3">
                      <div className="text-cyan-400">{item.icon}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-gray-500">{item.layer}</span>
                          <span className="text-sm font-semibold text-white">{item.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Key Features Grid */}
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">What CendiaGateway Does</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: <ScanLine className="w-6 h-6 text-red-400" />, title: 'PII Detection & Redaction', desc: 'Detects names, emails, SSNs, bank accounts, health data — blocks or redacts before reaching AI models.' },
                { icon: <FileText className="w-6 h-6 text-blue-400" />, title: 'Policy Engine', desc: 'Department-level rules controlling which models, data, and keywords are allowed. Real-time enforcement.' },
                { icon: <Fingerprint className="w-6 h-6 text-emerald-400" />, title: 'Cryptographic Signing', desc: 'Every interaction signed with Ed25519, hashed SHA-256. Immutable audit trail that cannot be altered retroactively.' },
                { icon: <Eye className="w-6 h-6 text-amber-400" />, title: 'Shadow AI Detection', desc: 'Identifies unauthorized AI tool usage by employees across the organization.' },
                { icon: <FileSignature className="w-6 h-6 text-purple-400" />, title: 'Governance Receipt', desc: 'Generates compliance documentation ready for regulators — DS 115-2025-PCM, ISO 42001, EU AI Act.' },
                { icon: <Zap className="w-6 h-6 text-cyan-400" />, title: '30-min DNS Deploy', desc: 'No client software required. Single DNS change routes all AI traffic through the gateway. Zero workflow disruption.' },
              ].map(f => (
                <div key={f.title} className="bg-sovereign-elevated rounded-lg p-4 border border-sovereign-border">
                  <div className="mb-3">{f.icon}</div>
                  <h4 className="text-sm font-semibold text-white mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* INTERACTIONS TAB */}
      {activeTab === 'interactions' && (
        <div className="bg-sovereign-card border border-sovereign-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-sovereign-border flex items-center justify-between">
            <span className="text-sm text-gray-400">{interactions.length} recent interactions</span>
            <div className="flex gap-2">
              <span className="px-2 py-1 text-[10px] bg-emerald-500/20 text-emerald-400 rounded">Allowed: {interactions.filter(i => i.policyAction === 'allow').length}</span>
              <span className="px-2 py-1 text-[10px] bg-amber-500/20 text-amber-400 rounded">Redacted: {interactions.filter(i => i.policyAction === 'redact').length}</span>
              <span className="px-2 py-1 text-[10px] bg-red-500/20 text-red-400 rounded">Blocked: {interactions.filter(i => i.policyAction === 'block').length}</span>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-sovereign-border text-gray-500 text-xs">
                  <th className="px-4 py-3 text-left">Time</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Provider / Model</th>
                  <th className="px-4 py-3 text-left">PII</th>
                  <th className="px-4 py-3 text-left">Action</th>
                  <th className="px-4 py-3 text-right">Tokens</th>
                  <th className="px-4 py-3 text-right">Cost</th>
                  <th className="px-4 py-3 text-right">Latency</th>
                  <th className="px-4 py-3 text-left">Hash</th>
                </tr>
              </thead>
              <tbody>
                {interactions.map(i => (
                  <tr key={i.id} className="border-b border-sovereign-border/50 hover:bg-sovereign-elevated/50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(i.requestedAt).toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-xs">{i.userEmail}</div>
                      <div className="text-gray-600 text-[10px]">{i.userDepartment}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-white text-xs">{i.provider}</div>
                      <div className="text-gray-600 text-[10px] font-mono">{i.model}</div>
                    </td>
                    <td className="px-4 py-3">
                      {i.piiDetected ? (
                        <div className="flex flex-wrap gap-1">
                          {i.piiTypes.map(t => (
                            <span key={t} className="px-1.5 py-0.5 text-[10px] bg-red-500/20 text-red-400 rounded">{t}</span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-gray-600 text-[10px]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 text-[10px] rounded font-medium',
                        i.policyAction === 'allow' ? 'bg-emerald-500/20 text-emerald-400' :
                        i.policyAction === 'redact' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      )}>
                        {i.policyAction}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400 font-mono">
                      {i.totalTokens.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400">
                      ${i.estimatedCostUsd.toFixed(3)}
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-gray-400">
                      {i.latencyMs}ms
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-[10px] text-cyan-500/70 font-mono">{i.integrityHash.slice(0, 16)}...</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* POLICIES TAB */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          {policies.map(p => (
            <div key={p.id} className="bg-sovereign-card border border-sovereign-border rounded-xl p-5 hover:border-cyan-500/20 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-2 h-2 rounded-full', p.enabled ? 'bg-emerald-400' : 'bg-gray-600')} />
                  <h4 className="text-sm font-semibold text-white">{p.name}</h4>
                  <span className="text-[10px] text-gray-600 font-mono">Priority {p.priority}</span>
                </div>
                <span className={cn('px-2 py-0.5 text-[10px] rounded font-medium',
                  p.defaultAction === 'block' ? 'bg-red-500/20 text-red-400' :
                  p.defaultAction === 'redact' ? 'bg-amber-500/20 text-amber-400' :
                  p.defaultAction === 'monitor' ? 'bg-blue-500/20 text-blue-400' :
                  'bg-emerald-500/20 text-emerald-400'
                )}>
                  {p.defaultAction}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                {p.departments.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> {p.departments.join(', ')}
                  </span>
                )}
                {p.blockPIITypes.length > 0 && (
                  <span className="flex items-center gap-1 text-red-400">
                    <Ban className="w-3 h-3" /> Blocks: {p.blockPIITypes.join(', ')}
                  </span>
                )}
                {p.redactPIITypes.length > 0 && (
                  <span className="flex items-center gap-1 text-amber-400">
                    <EyeOff className="w-3 h-3" /> Redacts: {p.redactPIITypes.join(', ')}
                  </span>
                )}
                {p.blockKeywords.length > 0 && (
                  <span className="flex items-center gap-1 text-orange-400">
                    <AlertTriangle className="w-3 h-3" /> Keywords: {p.blockKeywords.join(', ')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PII SCANNER TAB */}
      {activeTab === 'pii' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PIITester />
          <div className="bg-sovereign-card border border-sovereign-border rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Supported PII Types
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Email Address', 'Phone Number', 'SSN / National ID',
                'Credit Card', 'Bank Account', 'Tax ID',
                'Passport Number', 'Driver License', 'IP Address',
                'Street Address', 'Date of Birth', 'Medical Record',
                'Full Name', 'Employee ID', 'Biometric Data',
              ].map(type => (
                <div key={type} className="flex items-center gap-2 px-3 py-2 bg-sovereign-elevated rounded-lg text-xs text-gray-300">
                  <ShieldCheck className="w-3 h-3 text-cyan-500" /> {type}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compliance Footer */}
      <div className="mt-8 bg-sovereign-card border border-sovereign-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
          <FileSignature className="w-4 h-4 text-purple-400" />
          Regulatory Compliance
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            'DS 115-2025-PCM', 'ISO/IEC 42001:2023', 'EU AI Act Art. 12',
            'GDPR Art. 22', 'SOC 2 Type II', 'Ley 31814 (Peru)',
          ].map(reg => (
            <span key={reg} className="px-3 py-1.5 text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 rounded-lg">
              {reg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CendiaGatewayPage;
