// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA LENS™ - AI Interpretability & Explainability Dashboard
// Why did the AI decide this? Token confidence, attention patterns,
// reasoning pathways, bias markers, and EU AI Act compliance.
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  SearchCode,
  Eye,
  Brain,
  Shield,
  AlertTriangle,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  Layers,
  Target,
  BarChart3,
  Fingerprint,
  Scale,
  Zap,
  FileText,
  Download,
  RefreshCw,
  Lock,
  Activity,
  type LucideIcon,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface TokenExplanation {
  token: string;
  confidence: number;
  influence: 'high' | 'medium' | 'low' | 'neutral';
  reasoning?: string;
}

interface AttentionHead {
  id: string;
  label: string;
  description: string;
  weight: number;
  sourceTokens: string[];
  targetTokens: string[];
}

interface ReasoningStep {
  id: string;
  step: number;
  agentName: string;
  agentRole: string;
  reasoning: string;
  confidence: number;
  evidenceSources: string[];
  biasFlags: string[];
  conclusion: string;
}

interface BiasMarker {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  affectedAgent: string;
  mitigationApplied: boolean;
  mitigationDescription?: string;
}

interface LensAnalysis {
  decisionId: string;
  decisionTitle: string;
  decisionSummary: string;
  overallConfidence: number;
  explainabilityScore: number;
  euAiActCompliant: boolean;
  tokens: TokenExplanation[];
  attentionHeads: AttentionHead[];
  reasoningChain: ReasoningStep[];
  biasMarkers: BiasMarker[];
  modelInfo: { name: string; version: string; parameters: string; architecture: string };
}

// =============================================================================
// DEMO DATA - TR Petrov Transfer Lens Analysis
// =============================================================================

const TR_LENS: LensAnalysis = {
  decisionId: 'dec-petrov-2024-001',
  decisionTitle: 'Petrov Holdings $2.5M Cyprus Transfer',
  decisionSummary: 'AI Council recommended PROCEED WITH CONDITIONS for $2.5M wire transfer to Viktor Petrov (Cyprus), requiring enhanced due diligence, 24-hour compliance hold, and senior officer sign-off.',
  overallConfidence: 0.87,
  explainabilityScore: 94,
  euAiActCompliant: true,
  modelInfo: { name: 'Cendia Council v3.2', version: '3.2.1', parameters: '8 specialist agents', architecture: 'Multi-Agent Deliberative (MAD)' },
  tokens: [
    { token: 'PEP', confidence: 0.95, influence: 'high', reasoning: 'Politically Exposed Person designation triggered enhanced due diligence protocols across all agents' },
    { token: 'Cyprus', confidence: 0.88, influence: 'high', reasoning: 'Jurisdiction flagged by FATF as requiring enhanced monitoring; triggered geopolitical risk assessment' },
    { token: '$2.5M', confidence: 0.92, influence: 'medium', reasoning: 'Amount exceeds $1M threshold for mandatory senior review under Basel III §4.2.1' },
    { token: 'wire transfer', confidence: 0.85, influence: 'medium', reasoning: 'Transfer mechanism assessed for correspondent banking chain risk' },
    { token: 'Petrov', confidence: 0.91, influence: 'high', reasoning: 'Name match against OFAC SDN list returned near-match; required manual verification' },
    { token: 'Holdings', confidence: 0.72, influence: 'low', reasoning: 'Corporate structure assessed for beneficial ownership transparency' },
    { token: 'enhanced', confidence: 0.78, influence: 'neutral', reasoning: 'Modifier indicating elevated review standard applied' },
    { token: 'due diligence', confidence: 0.94, influence: 'high', reasoning: 'Core compliance requirement; all 8 agents contributed to EDD assessment' },
  ],
  attentionHeads: [
    { id: 'ah-1', label: 'Regulatory Focus', description: 'Cross-references entity against global sanctions databases and regulatory frameworks', weight: 0.32, sourceTokens: ['PEP', 'Cyprus', 'Petrov'], targetTokens: ['Basel III', 'OFAC', 'FATF'] },
    { id: 'ah-2', label: 'Risk Aggregation', description: 'Combines individual risk signals into composite risk score', weight: 0.28, sourceTokens: ['$2.5M', 'PEP', 'wire transfer'], targetTokens: ['risk score', 'threshold', 'escalation'] },
    { id: 'ah-3', label: 'Precedent Matching', description: 'Finds similar past decisions and their outcomes', weight: 0.22, sourceTokens: ['Cyprus', 'PEP', 'transfer'], targetTokens: ['case-2023-047', 'case-2023-112', 'enforcement action'] },
    { id: 'ah-4', label: 'Mitigation Synthesis', description: 'Generates actionable conditions to reduce residual risk', weight: 0.18, sourceTokens: ['risk', 'compliance', 'review'], targetTokens: ['24-hour hold', 'senior sign-off', 'enhanced monitoring'] },
  ],
  reasoningChain: [
    { id: 'rs-1', step: 1, agentName: 'Compliance Sentinel', agentRole: 'Regulatory compliance verification', reasoning: 'Entity Viktor Petrov flagged as PEP per World-Check database (confidence: 0.97). Cyprus jurisdiction requires enhanced monitoring under FATF Grey List protocols. Basel III §4.2.1 mandates 24-hour review period for PEP transactions exceeding $1M.', confidence: 0.95, evidenceSources: ['World-Check', 'OFAC SDN List', 'Basel III Framework', 'FATF Country Reports'], biasFlags: [], conclusion: 'HOLD — Mandatory enhanced due diligence required before proceeding.' },
    { id: 'rs-2', step: 2, agentName: 'Financial Analyst', agentRole: 'Financial risk assessment', reasoning: 'Transfer amount $2.5M represents 4.2% of client total AUM ($59.2M). Transaction pattern consistent with client historical behavior (quarterly rebalancing). No anomalous velocity or structuring detected. Source of funds documentation complete.', confidence: 0.88, evidenceSources: ['Client AUM Records', 'Transaction History (7yr)', 'Source of Funds Declaration'], biasFlags: ['anchoring-risk'], conclusion: 'CONDITIONAL PROCEED — Financial metrics within normal parameters.' },
    { id: 'rs-3', step: 3, agentName: 'Geopolitical Analyst', agentRole: 'Jurisdiction and sanctions risk', reasoning: 'Cyprus banking sector under EU observation but not sanctioned. No active OFAC designations on entity. Secondary sanctions risk assessed at 12% based on Russia-Cyprus financial corridor analysis. Correspondent banking chain (3 hops) verified clean.', confidence: 0.82, evidenceSources: ['OFAC SDN/SSI Lists', 'EU Sanctions Map', 'Correspondent Bank Registry'], biasFlags: ['geographic-profiling'], conclusion: 'CONDITIONAL PROCEED — Geopolitical risk elevated but manageable with monitoring.' },
    { id: 'rs-4', step: 4, agentName: 'Ethics Officer', agentRole: 'Reputational and ethical assessment', reasoning: 'Media scan reveals 3 articles mentioning Petrov in connection with government infrastructure contracts (2019-2021). No allegations of corruption or sanctions evasion. Reputational risk rated MEDIUM based on PEP status and media profile. Enhanced documentation recommended for defensibility.', confidence: 0.79, evidenceSources: ['LexisNexis Media Scan', 'Dow Jones Adverse Media', 'Public Records'], biasFlags: [], conclusion: 'CONDITIONAL PROCEED — Document all EDD steps for regulatory defensibility.' },
    { id: 'rs-5', step: 5, agentName: 'Council Arbiter', agentRole: 'Final synthesis and recommendation', reasoning: 'Aggregating 4 specialist assessments: Compliance (HOLD), Financial (CONDITIONAL), Geopolitical (CONDITIONAL), Ethics (CONDITIONAL). Composite risk score: 67/100. No single critical blocker identified. Consensus: proceed with conditions to mitigate identified risks while preserving client relationship.', confidence: 0.87, evidenceSources: ['Agent Reports 1-4', 'Risk Aggregation Model', 'Precedent Database'], biasFlags: [], conclusion: 'PROCEED WITH CONDITIONS: 24-hour hold, senior officer sign-off, enhanced monitoring for 90 days.' },
  ],
  biasMarkers: [
    { id: 'bm-1', type: 'Anchoring Bias', severity: 'medium', description: 'Financial Analyst may have anchored on historical transaction patterns, potentially underweighting the PEP designation as a novel risk factor.', affectedAgent: 'Financial Analyst', mitigationApplied: true, mitigationDescription: 'De-anchoring protocol applied: agent re-evaluated with PEP status as primary input before financial metrics.' },
    { id: 'bm-2', type: 'Geographic Profiling', severity: 'low', description: 'Geopolitical Analyst flagged Cyprus-Russia corridor which could reflect geographic profiling bias if applied uniformly to all Cyprus transactions.', affectedAgent: 'Geopolitical Analyst', mitigationApplied: true, mitigationDescription: 'Calibration check: verified that flag was entity-specific (PEP + jurisdiction combination) not jurisdiction-only.' },
    { id: 'bm-3', type: 'Automation Complacency', severity: 'medium', description: 'Risk that human reviewers may defer excessively to AI recommendation without independent verification.', affectedAgent: 'System-wide', mitigationApplied: true, mitigationDescription: 'Mandatory human-in-the-loop: senior compliance officer must independently verify before executing.' },
  ],
};

const FIFA_LENS: LensAnalysis = {
  decisionId: 'dec-ffp-2024-003',
  decisionTitle: 'FFP Compliance — €180M Transfer with Sponsorship Offsets',
  decisionSummary: 'AI Council recommended RECONSIDER for €180M player acquisition due to related-party sponsorship concerns and whistleblower FFP allegations.',
  overallConfidence: 0.72,
  explainabilityScore: 91,
  euAiActCompliant: true,
  modelInfo: { name: 'Cendia Council v3.2', version: '3.2.1', parameters: '8 specialist agents', architecture: 'Multi-Agent Deliberative (MAD)' },
  tokens: [
    { token: '€180M', confidence: 0.94, influence: 'high', reasoning: 'Transfer fee exceeds FFP break-even threshold; triggers mandatory financial sustainability review' },
    { token: 'related-party', confidence: 0.96, influence: 'high', reasoning: 'Sponsorship revenue from related parties requires CAS fair value test under FFP Art. 58bis' },
    { token: 'whistleblower', confidence: 0.89, influence: 'high', reasoning: 'Active allegations escalate investigation risk from routine to elevated' },
    { token: 'sponsorship', confidence: 0.85, influence: 'medium', reasoning: 'Revenue classification critical for FFP break-even calculation' },
    { token: 'wage-to-revenue', confidence: 0.91, influence: 'high', reasoning: 'Projected ratio of 73% exceeds UEFA 70% soft cap' },
  ],
  attentionHeads: [
    { id: 'ah-f1', label: 'FFP Framework', description: 'Maps financial data against UEFA Financial Fair Play regulations', weight: 0.35, sourceTokens: ['€180M', 'wage-to-revenue', 'related-party'], targetTokens: ['Art. 58bis', 'break-even', 'settlement'] },
    { id: 'ah-f2', label: 'Legal Risk', description: 'Assesses CAS appeal vulnerability and sanction likelihood', weight: 0.30, sourceTokens: ['whistleblower', 'related-party'], targetTokens: ['CAS precedent', 'competition ban', 'points deduction'] },
    { id: 'ah-f3', label: 'Financial Projection', description: 'Models wage bill impact and asset depreciation', weight: 0.20, sourceTokens: ['€180M', 'wages', 'age 28'], targetTokens: ['depreciation', 'resale value', 'amortization'] },
    { id: 'ah-f4', label: 'Reputational Analysis', description: 'Assesses fan sentiment and sponsor reaction probability', weight: 0.15, sourceTokens: ['whistleblower', 'financial doping'], targetTokens: ['fan protests', 'sponsor withdrawal', 'media coverage'] },
  ],
  reasoningChain: [
    { id: 'rs-f1', step: 1, agentName: 'FFP Compliance Agent', agentRole: 'UEFA financial regulation analysis', reasoning: 'Related-party sponsorship of €45M unlikely to pass CAS fair value test. Comparable independent sponsorships for clubs of similar profile average €18-22M. Differential of €23-27M would be excluded from FFP calculation, pushing club into break-even deficit.', confidence: 0.92, evidenceSources: ['UEFA FFP Regulations', 'CAS Jurisprudence Database', 'Sponsorship Benchmarks'], biasFlags: [], conclusion: 'RED FLAG — Related-party revenue likely fails fair value test.' },
    { id: 'rs-f2', step: 2, agentName: 'Legal Risk Agent', agentRole: 'Sanctions and litigation assessment', reasoning: 'Whistleblower allegations of hidden agent fees create material investigation risk. UEFA Investigation Board has opened preliminary inquiries on similar allegations in 4 cases (2022-2024), resulting in sanctions in 3 of 4. CAS appeal success rate for clubs: 28%.', confidence: 0.78, evidenceSources: ['UEFA Investigation Board Records', 'CAS Case Database', 'Whistleblower Filing'], biasFlags: ['selection-bias'], conclusion: 'HIGH RISK — Active allegations significantly increase sanction probability.' },
    { id: 'rs-f3', step: 3, agentName: 'Council Arbiter', agentRole: 'Final synthesis', reasoning: 'Two critical risk vectors (FFP fair value failure + whistleblower investigation) create compounding exposure. Combined probability of adverse outcome: 62%. Financial impact of worst case (competition ban + fine): €150-200M. Risk-adjusted expected loss exceeds acceptable threshold.', confidence: 0.72, evidenceSources: ['Agent Reports 1-2', 'Risk Model', 'Financial Projections'], biasFlags: [], conclusion: 'RECONSIDER — Risk-adjusted analysis suggests this acquisition destroys more value than it creates.' },
  ],
  biasMarkers: [
    { id: 'bm-f1', type: 'Selection Bias', severity: 'medium', description: 'Legal Risk Agent selected 4 most recent cases for comparison, which may not be representative of full historical sanction rate.', affectedAgent: 'Legal Risk Agent', mitigationApplied: true, mitigationDescription: 'Expanded case sample to all FFP investigations since 2015 (n=23); sanction rate remained consistent at 71%.' },
    { id: 'bm-f2', type: 'Sunk Cost Framing', severity: 'low', description: 'Financial analysis may be influenced by negotiations already conducted, creating pressure to justify proceeding.', affectedAgent: 'Financial Projection Agent', mitigationApplied: true, mitigationDescription: 'Zero-base analysis applied: decision re-evaluated as if no prior negotiations had occurred.' },
  ],
};

const DEMO_ANALYSES: Record<string, LensAnalysis> = {
  tr: TR_LENS,
  fifa: FIFA_LENS,
};

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const ConfidenceBar: React.FC<{ value: number; color?: string }> = ({ value, color }) => {
  const barColor = color || (value >= 0.85 ? 'bg-green-500' : value >= 0.7 ? 'bg-yellow-500' : value >= 0.5 ? 'bg-orange-500' : 'bg-red-500');
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full transition-all duration-700`} style={{ width: `${value * 100}%` }} />
      </div>
      <span className="text-sm font-mono font-medium text-gray-700 dark:text-gray-300 w-12 text-right">{(value * 100).toFixed(0)}%</span>
    </div>
  );
};

const TokenPill: React.FC<{ token: TokenExplanation; onClick: () => void; selected: boolean }> = ({ token, onClick, selected }) => {
  const influenceColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700',
    medium: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-300 dark:border-orange-700',
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700',
    neutral: 'bg-gray-100 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-600',
  };
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${influenceColors[token.influence]} ${
        selected ? 'ring-2 ring-indigo-500 shadow-md scale-105' : 'hover:scale-102'
      }`}
    >
      <span className="font-mono">{token.token}</span>
      <span className="ml-1.5 text-xs opacity-70">{(token.confidence * 100).toFixed(0)}%</span>
    </button>
  );
};

const SeverityDot: React.FC<{ severity: BiasMarker['severity'] }> = ({ severity }) => {
  const colors = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-green-500' };
  return <span className={`w-2.5 h-2.5 rounded-full ${colors[severity]} inline-block`} />;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CendiaLensPage: React.FC = () => {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('tr');
  const [activeTab, setActiveTab] = useState<'tokens' | 'reasoning' | 'attention' | 'bias' | 'compliance'>('tokens');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const analysis = DEMO_ANALYSES[selectedAnalysis] || TR_LENS;

  const selectedTokenData = useMemo(
    () => analysis.tokens.find(t => t.token === selectedToken),
    [analysis, selectedToken]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-indigo-900 text-white border-b border-indigo-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl border border-white/20">
                <SearchCode className="w-8 h-8 text-indigo-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">CendiaLens&trade;</h1>
                <p className="text-indigo-300">AI Interpretability &amp; Explainability Dashboard</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6 text-sm text-indigo-300">
              <span className="flex items-center gap-1.5"><Eye className="w-4 h-4" /> Full Transparency</span>
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> EU AI Act Ready</span>
              <span className="flex items-center gap-1.5"><Fingerprint className="w-4 h-4" /> Audit-Grade Evidence</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: 'Token-Level Confidence', color: 'bg-indigo-500/20 text-indigo-200' },
              { label: 'Attention Pattern Analysis', color: 'bg-violet-500/20 text-violet-200' },
              { label: 'Reasoning Chain Replay', color: 'bg-purple-500/20 text-purple-200' },
              { label: 'Bias Detection & Mitigation', color: 'bg-pink-500/20 text-pink-200' },
              { label: 'EU AI Act Compliance', color: 'bg-emerald-500/20 text-emerald-200' },
            ].map((pill, i) => (
              <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-medium ${pill.color}`}>{pill.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Decision Selector */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Analyzing Decision:</span>
          <div className="flex gap-2">
            {[
              { key: 'tr', label: 'TR Petrov Transfer', icon: '🏦' },
              { key: 'fifa', label: 'FIFA FFP Review', icon: '⚽' },
            ].map(opt => (
              <button
                key={opt.key}
                onClick={() => { setSelectedAnalysis(opt.key); setSelectedToken(null); setExpandedStep(null); }}
                className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selectedAnalysis === opt.key
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
                    : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-indigo-300'
                }`}
              >
                <span className="mr-1.5">{opt.icon}</span>{opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Decision Summary Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{analysis.decisionTitle}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{analysis.decisionSummary}</p>
              <div className="flex items-center gap-6 text-sm">
                <span className="text-gray-500 dark:text-gray-400">Model: <strong className="text-gray-900 dark:text-white">{analysis.modelInfo.name}</strong></span>
                <span className="text-gray-500 dark:text-gray-400">Arch: <strong className="text-gray-900 dark:text-white">{analysis.modelInfo.architecture}</strong></span>
                <span className="text-gray-500 dark:text-gray-400">ID: <code className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">{analysis.decisionId}</code></span>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(analysis.overallConfidence * 100).toFixed(0)}%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
              </div>
              <div className="text-center px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <p className="text-2xl font-bold text-violet-600 dark:text-violet-400">{analysis.explainabilityScore}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Explainability</p>
              </div>
              <div className={`text-center px-4 py-3 rounded-xl ${
                analysis.euAiActCompliant ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                {analysis.euAiActCompliant ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto" />
                ) : (
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 mx-auto" />
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">EU AI Act</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-8">
          <nav className="flex gap-6 overflow-x-auto">
            {([
              { id: 'tokens', label: 'Token Analysis', icon: Layers },
              { id: 'reasoning', label: 'Reasoning Chain', icon: Brain },
              { id: 'attention', label: 'Attention Patterns', icon: Eye },
              { id: 'bias', label: 'Bias Detection', icon: Scale },
              { id: 'compliance', label: 'EU AI Act', icon: Shield },
            ] as { id: typeof activeTab; label: string; icon: LucideIcon }[]).map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'bias' && analysis.biasMarkers.length > 0 && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                      {analysis.biasMarkers.length}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* ============= TOKEN ANALYSIS TAB ============= */}
        {activeTab === 'tokens' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Input Token Influence Map</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Each token is colored by its influence on the final decision. Click any token to see why it mattered.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {analysis.tokens.map(token => (
                  <TokenPill
                    key={token.token}
                    token={token}
                    selected={selectedToken === token.token}
                    onClick={() => setSelectedToken(selectedToken === token.token ? null : token.token)}
                  />
                ))}
              </div>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 dark:bg-red-900/40" /> High Influence</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-200 dark:bg-orange-900/40" /> Medium</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-200 dark:bg-blue-900/40" /> Low</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 dark:bg-gray-700" /> Neutral</span>
              </div>
            </div>

            {/* Token Detail */}
            {selectedTokenData && (
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800/50 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <code className="text-lg font-bold text-indigo-900 dark:text-indigo-200 bg-white dark:bg-gray-800 px-3 py-1 rounded-lg border">
                    {selectedTokenData.token}
                  </code>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    selectedTokenData.influence === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                    selectedTokenData.influence === 'medium' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                  }`}>
                    {selectedTokenData.influence.toUpperCase()} INFLUENCE
                  </span>
                </div>
                <div className="mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Confidence:</span>
                  <ConfidenceBar value={selectedTokenData.confidence} />
                </div>
                <p className="text-sm text-indigo-800 dark:text-indigo-300">{selectedTokenData.reasoning}</p>
              </div>
            )}

            {/* Confidence Distribution */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Token Confidence Distribution</h3>
              <div className="space-y-3">
                {[...analysis.tokens].sort((a, b) => b.confidence - a.confidence).map(token => (
                  <div key={token.token} className="flex items-center gap-4">
                    <code className="w-28 text-sm font-mono text-gray-700 dark:text-gray-300 truncate">{token.token}</code>
                    <div className="flex-1"><ConfidenceBar value={token.confidence} /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============= REASONING CHAIN TAB ============= */}
        {activeTab === 'reasoning' && (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Complete reasoning pathway from input to final recommendation. Each step shows agent thinking, evidence sources, and bias checks.
            </p>
            {analysis.reasoningChain.map((step, i) => (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {i < analysis.reasoningChain.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800" />
                )}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    className="w-full p-5 text-left"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{step.step}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{step.agentName}</h3>
                          <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{step.agentRole}</span>
                          {step.biasFlags.length > 0 && (
                            <span className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> {step.biasFlags.length} bias flag{step.biasFlags.length > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-indigo-700 dark:text-indigo-400">{step.conclusion}</p>
                        <div className="mt-2">
                          <ConfidenceBar value={step.confidence} />
                        </div>
                      </div>
                      {expandedStep === step.id ? (
                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>

                  {expandedStep === step.id && (
                    <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4 ml-16">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Reasoning</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{step.reasoning}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Evidence Sources</h4>
                          <div className="flex flex-wrap gap-2">
                            {step.evidenceSources.map(src => (
                              <span key={src} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs rounded-lg border border-indigo-200 dark:border-indigo-800/50">
                                {src}
                              </span>
                            ))}
                          </div>
                        </div>
                        {step.biasFlags.length > 0 && (
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                            <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300 mb-1 flex items-center gap-1">
                              <AlertTriangle className="w-3.5 h-3.5" /> Bias Flags
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {step.biasFlags.map(flag => (
                                <span key={flag} className="px-2 py-0.5 bg-yellow-100 dark:bg-yellow-800/30 text-yellow-800 dark:text-yellow-300 text-xs rounded">
                                  {flag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============= ATTENTION PATTERNS TAB ============= */}
        {activeTab === 'attention' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              How the AI weighted different aspects of the input when forming its recommendation.
            </p>
            {analysis.attentionHeads.map(head => (
              <div key={head.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{head.label}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{head.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{(head.weight * 100).toFixed(0)}%</span>
                    <p className="text-xs text-gray-400">Attention Weight</p>
                  </div>
                </div>

                <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${head.weight * 100}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Source Tokens (Input)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {head.sourceTokens.map(t => (
                        <span key={t} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs rounded-lg border border-indigo-200 dark:border-indigo-800/50 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Target Concepts (Output)</p>
                    <div className="flex flex-wrap gap-1.5">
                      {head.targetTokens.map(t => (
                        <span key={t} className="px-2 py-1 bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 text-xs rounded-lg border border-violet-200 dark:border-violet-800/50 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============= BIAS DETECTION TAB ============= */}
        {activeTab === 'bias' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bias Detection Summary</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    analysis.biasMarkers.every(b => b.mitigationApplied)
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                  }`}>
                    {analysis.biasMarkers.filter(b => b.mitigationApplied).length}/{analysis.biasMarkers.length} Mitigated
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {(['critical', 'high', 'medium', 'low'] as const).map(sev => {
                  const count = analysis.biasMarkers.filter(b => b.severity === sev).length;
                  const colors = { critical: 'text-red-600', high: 'text-orange-600', medium: 'text-yellow-600', low: 'text-green-600' };
                  return (
                    <div key={sev} className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                      <p className={`text-2xl font-bold ${colors[sev]}`}>{count}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{sev}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {analysis.biasMarkers.map(marker => (
              <div key={marker.id} className={`bg-white dark:bg-gray-800 rounded-xl border overflow-hidden ${
                marker.mitigationApplied ? 'border-green-200 dark:border-green-800/50' : 'border-yellow-200 dark:border-yellow-800/50'
              }`}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <SeverityDot severity={marker.severity} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{marker.type}</h3>
                        <span className="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          {marker.affectedAgent}
                        </span>
                        {marker.mitigationApplied && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded">
                            <CheckCircle className="w-3 h-3" /> Mitigated
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{marker.description}</p>
                      {marker.mitigationApplied && marker.mitigationDescription && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/50">
                          <p className="text-sm text-green-700 dark:text-green-400 flex items-start gap-1.5">
                            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{marker.mitigationDescription}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ============= EU AI ACT COMPLIANCE TAB ============= */}
        {activeTab === 'compliance' && (
          <div className="space-y-6">
            <div className={`rounded-xl border p-6 ${
              analysis.euAiActCompliant
                ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50'
                : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50'
            }`}>
              <div className="flex items-center gap-4">
                {analysis.euAiActCompliant ? (
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertTriangle className="w-12 h-12 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <h2 className={`text-xl font-bold ${analysis.euAiActCompliant ? 'text-green-900 dark:text-green-300' : 'text-red-900 dark:text-red-300'}`}>
                    {analysis.euAiActCompliant ? 'EU AI Act Compliant' : 'Compliance Issues Detected'}
                  </h2>
                  <p className={`text-sm ${analysis.euAiActCompliant ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    This decision meets all requirements under Regulation (EU) 2024/1689 for high-risk AI systems.
                  </p>
                </div>
              </div>
            </div>

            {/* Compliance Checklist */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Article-by-Article Compliance</h3>
              <div className="space-y-3">
                {[
                  { article: 'Art. 13', title: 'Transparency & Information', description: 'Decision reasoning is fully documented with token-level explanations, confidence scores, and evidence sources.', met: true },
                  { article: 'Art. 14', title: 'Human Oversight', description: 'Human-in-the-loop enforced: senior compliance officer must independently verify before execution.', met: true },
                  { article: 'Art. 15', title: 'Accuracy, Robustness & Cybersecurity', description: 'Multi-agent deliberation with adversarial cross-examination ensures robust decision quality.', met: true },
                  { article: 'Art. 9', title: 'Risk Management System', description: 'Continuous risk assessment with bias detection, blind spot analysis, and mitigation tracking.', met: true },
                  { article: 'Art. 10', title: 'Data & Data Governance', description: 'All evidence sources documented and auditable. No training data leakage into decision rationale.', met: true },
                  { article: 'Art. 11', title: 'Technical Documentation', description: 'Full model card, architecture description, and decision provenance chain maintained.', met: true },
                  { article: 'Art. 12', title: 'Record-Keeping', description: 'Immutable audit trail with cryptographic signatures. All reasoning steps permanently recorded.', met: true },
                  { article: 'Art. 17', title: 'Quality Management System', description: `Bias detection (${analysis.biasMarkers.length} markers identified, ${analysis.biasMarkers.filter(b => b.mitigationApplied).length} mitigated). Explainability score: ${analysis.explainabilityScore}/100.`, met: analysis.biasMarkers.every(b => b.mitigationApplied) },
                ].map(item => (
                  <div key={item.article} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                    {item.met ? (
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">{item.article}</span>
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{item.title}</span>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Model Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Model Card (Art. 11 Technical Documentation)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Model Name', value: analysis.modelInfo.name },
                  { label: 'Version', value: analysis.modelInfo.version },
                  { label: 'Parameters', value: analysis.modelInfo.parameters },
                  { label: 'Architecture', value: analysis.modelInfo.architecture },
                ].map(item => (
                  <div key={item.label} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white mt-0.5">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CendiaLensPage;
