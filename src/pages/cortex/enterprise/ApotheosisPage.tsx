// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA APOTHEOSIS™ — ORGANIZATIONAL SUPERINTELLIGENCE ENGINE
// "We don't just make your company smarter today. We make it literally
// impossible for you to stay stupid tomorrow."
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  apotheosisService,
  ApotheosisScore,
  ApotheosisRun,
  Escalation,
  PatternBan,
  UpskillAssignment,
} from '../../../services/ApotheosisService';
import {
  APOTHEOSIS_MODES,
  INDUSTRY_THREAT_PROFILES,
  CORE_APOTHEOSIS_MODES,
  calculateThreatScore,
  getIndustryThreatInsight,
  type ApotheosisMode,
} from '../../../data/apotheosisModes';
import {
  ModeSelector,
  IndustrySelector,
  ModeInfoBanner,
  IndustryInsight,
} from '../../../components/modes';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatCurrency = (amount: number): string => {
  if (amount >= 1000000) {return `$${(amount / 1000000).toFixed(1)}M`;}
  if (amount >= 1000) {return `$${(amount / 1000).toFixed(0)}K`;}
  return `$${amount.toFixed(0)}`;
};

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

const getTimeRemaining = (deadline: Date | string): string => {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days > 0) {return `${days} days remaining`;}
  if (hours > 0) {return `${hours} hours remaining`;}
  return 'Overdue';
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ApotheosisPage: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState<ApotheosisScore | null>(null);
  const [latestRun, setLatestRun] = useState<ApotheosisRun | null>(null);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [bannedPatterns, setBannedPatterns] = useState<PatternBan[]>([]);
  const [upskillAssignments, setUpskillAssignments] = useState<UpskillAssignment[]>([]);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'escalations' | 'patterns' | 'upskill' | 'history'
  >('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedModeId, setSelectedModeId] = useState<string>('red-team');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('general');
  
  const currentMode = APOTHEOSIS_MODES[selectedModeId];
  const currentIndustry = INDUSTRY_THREAT_PROFILES[selectedIndustryId];
  const threatScore = currentMode && currentIndustry 
    ? calculateThreatScore(currentMode, currentIndustry) 
    : null;
  const industryInsight = currentMode && currentIndustry
    ? getIndustryThreatInsight(currentMode, currentIndustry)
    : '';

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [scoreData, runData, escData, patternData, upskillData] = await Promise.all([
        apotheosisService.getScore(),
        apotheosisService.getLatestRun(),
        apotheosisService.getEscalations(),
        apotheosisService.getBannedPatterns(),
        apotheosisService.getUpskillAssignments(),
      ]);

      setScore(scoreData);
      setLatestRun(runData);
      setEscalations(escData);
      setBannedPatterns(patternData);
      setUpskillAssignments(upskillData);
    } catch (error) {
      console.error('Error loading Apotheosis data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleEscalationResponse = async (
    id: string,
    response: 'approved' | 'rejected' | 'deferred'
  ) => {
    const reason = prompt(`Enter reason for ${response}:`);
    if (reason) {
      await apotheosisService.respondToEscalation(id, response, reason);
      loadData();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <h1 className="text-xl font-bold">CendiaApotheosis™</h1>
                  <p className="text-sm text-white/60">Organizational Superintelligence Engine</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ModeSelector
                  label=""
                  modes={APOTHEOSIS_MODES}
                  selectedModeId={selectedModeId}
                  onModeChange={setSelectedModeId}
                  coreModeIds={[...CORE_APOTHEOSIS_MODES]}
                  className="w-64"
                />
                <IndustrySelector
                  label=""
                  industries={INDUSTRY_THREAT_PROFILES}
                  selectedIndustryId={selectedIndustryId}
                  onIndustryChange={setSelectedIndustryId}
                  className="w-48"
                />
              </div>
              <button
                onClick={() => apotheosisService.triggerManualRun()}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors"
              >
                Trigger Manual Run
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-purple-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'escalations', label: 'Escalations', icon: '⚠️', count: escalations.length },
              {
                id: 'patterns',
                label: 'Banned Patterns',
                icon: '🚫',
                count: bannedPatterns.length,
              },
              { id: 'upskill', label: 'Upskilling', icon: '📚', count: upskillAssignments.length },
              { id: 'history', label: 'Run History', icon: '📜' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-white bg-purple-500/10'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-purple-500/30 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Mode Info Banner */}
        {currentMode && (
          <ModeInfoBanner 
            mode={currentMode} 
            primeDirective={currentMode.primeDirective} 
          />
        )}
        
        {/* Industry Insight */}
        {industryInsight && <IndustryInsight insight={industryInsight} />}
        
        {/* Threat Score Summary */}
        {threatScore && (
          <div className="mt-4 mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: currentMode?.color }}>
                    {threatScore.score}
                  </div>
                  <div className="text-xs text-gray-500">Threat Score</div>
                </div>
                <div className="h-8 w-px bg-gray-700" />
                <div>
                  <div className="text-sm text-gray-300">Top Threats for {currentIndustry?.name}:</div>
                  <div className="flex gap-2 mt-1">
                    {threatScore.topThreats.map((threat, i) => (
                      <span key={i} className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded">
                        {threat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Confidence: {(threatScore.confidence * 100).toFixed(0)}%</div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && score && latestRun && (
              <DashboardView
                score={score}
                latestRun={latestRun}
                escalations={escalations}
                upskillAssignments={upskillAssignments}
                bannedPatterns={bannedPatterns}
                onEscalationResponse={handleEscalationResponse}
              />
            )}

            {activeTab === 'escalations' && (
              <EscalationsView escalations={escalations} onResponse={handleEscalationResponse} />
            )}

            {activeTab === 'patterns' && <BannedPatternsView patterns={bannedPatterns} />}

            {activeTab === 'upskill' && <UpskillView assignments={upskillAssignments} />}

            {activeTab === 'history' && <HistoryView />}
          </>
        )}
      </main>
    </div>
  );
};

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

interface DashboardViewProps {
  score: ApotheosisScore;
  latestRun: ApotheosisRun;
  escalations: Escalation[];
  upskillAssignments: UpskillAssignment[];
  bannedPatterns: PatternBan[];
  onEscalationResponse: (id: string, response: 'approved' | 'rejected' | 'deferred') => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({
  score,
  latestRun,
  escalations,
  upskillAssignments,
  bannedPatterns,
  onEscalationResponse,
}) => {
  return (
    <div className="space-y-8">
      {/* Apotheosis Score */}
      <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-2xl border border-purple-500/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg text-white/60 mb-2">APOTHEOSIS SCORE</h2>
          <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            {score.overall}%
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000"
                style={{ width: `${score.overall}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-white/60">
            "{score.overall}% immune to self-inflicted destruction"
          </p>
          <p className="mt-2 text-purple-400">
            ↑ {score.improvementPoints} points in {score.improvementPeriod}
          </p>
        </div>

        {/* Score Components */}
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(score.components).map(([key, comp]) => (
            <div key={key} className="text-center">
              <div className="text-2xl font-bold text-white">{comp.value}%</div>
              <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${comp.value}%` }}
                />
              </div>
              <div className="text-xs text-white/50 mt-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-xs text-white/30">
                ({(comp.weight * 100).toFixed(0)}% weight)
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Last Night's Run */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Last Night's Run</h3>
          <span className="text-white/50 text-sm">
            {formatDate(latestRun.startedAt)} {formatTime(latestRun.startedAt)}
          </span>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">
              {latestRun.scenariosTested.toLocaleString()}
            </div>
            <div className="text-sm text-white/50 mt-1">Scenarios Tested</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">
              {latestRun.criticalCount +
                latestRun.highCount +
                latestRun.mediumCount +
                latestRun.lowCount}
            </div>
            <div className="text-sm text-white/50 mt-1">Weaknesses Found</div>
            <div className="text-xs text-white/30 mt-1">
              {latestRun.criticalCount} critical · {latestRun.highCount} high
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">44</div>
            <div className="text-sm text-white/50 mt-1">Auto-Patched</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{escalations.length}</div>
            <div className="text-sm text-white/50 mt-1">Escalated to Humans</div>
          </div>
        </div>
      </div>

      {/* Pending Human Decisions */}
      {escalations.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Human Decisions</h3>
          <div className="space-y-4">
            {escalations.slice(0, 3).map((esc) => (
              <div
                key={esc.id}
                className={`rounded-xl p-4 border ${
                  esc.severity === 'critical'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-amber-500/10 border-amber-500/30'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{esc.severity === 'critical' ? '⚠️' : '🟡'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            esc.severity === 'critical' ? 'bg-red-500/30' : 'bg-amber-500/30'
                          }`}
                        >
                          {esc.severity.toUpperCase()}
                        </span>
                        <h4 className="font-semibold">{esc.title}</h4>
                      </div>
                      <p className="text-sm text-white/60 mt-1">{esc.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-white/50">
                        <span>Cost to fix: {formatCurrency(esc.estimatedCostToFix)}</span>
                        <span>Risk if not fixed: {formatCurrency(esc.riskIfNotFixed)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEscalationResponse(esc.id, 'approved')}
                      className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors"
                    >
                      Approve Fix
                    </button>
                    <button
                      onClick={() => onEscalationResponse(esc.id, 'rejected')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => onEscalationResponse(esc.id, 'deferred')}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
                    >
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Humans Requiring Upskill */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Humans Requiring Upskill</h3>
          <div className="space-y-3">
            {upskillAssignments.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
              >
                <div>
                  <div className="font-medium">{assignment.userName}</div>
                  <div className="text-sm text-white/50">{assignment.gapIdentified}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{assignment.trainingDuration} min</div>
                  <div className="text-xs text-white/50">
                    {getTimeRemaining(assignment.deadline)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Banned Patterns */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Banned Patterns</h3>
          <div className="space-y-3">
            {bannedPatterns.map((pattern) => (
              <div
                key={pattern.id}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
              >
                <div>
                  <div className="font-medium">{pattern.pattern}</div>
                  <div className="text-sm text-white/50">Banned {formatDate(pattern.bannedAt)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-400">{pattern.failureRate}% failure</div>
                  <div className="text-xs text-white/50">{pattern.instances.length} instances</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ESCALATIONS VIEW
// =============================================================================

interface EscalationsViewProps {
  escalations: Escalation[];
  onResponse: (id: string, response: 'approved' | 'rejected' | 'deferred') => void;
}

const EscalationsView: React.FC<EscalationsViewProps> = ({ escalations, onResponse }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pending Escalations</h2>
        <span className="text-white/50">{escalations.length} items requiring human decision</span>
      </div>

      {escalations.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          <span className="text-4xl mb-4 block">✓</span>
          No pending escalations. All clear!
        </div>
      ) : (
        escalations.map((esc) => (
          <div
            key={esc.id}
            className={`rounded-xl p-6 border ${
              esc.severity === 'critical'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-amber-500/10 border-amber-500/30'
            }`}
          >
            <div className="flex items-start gap-4">
              <span className="text-2xl">{esc.severity === 'critical' ? '⚠️' : '🟡'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      esc.severity === 'critical' ? 'bg-red-500/30' : 'bg-amber-500/30'
                    }`}
                  >
                    {esc.severity.toUpperCase()}
                  </span>
                  <h3 className="text-lg font-semibold">{esc.title}</h3>
                </div>

                <p className="text-white/70 mb-4">{esc.description}</p>

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Reason for escalation</div>
                    <div className="font-medium">{esc.reason}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Estimated cost to fix</div>
                    <div className="font-medium text-green-400">
                      {formatCurrency(esc.estimatedCostToFix)}
                    </div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Risk if not fixed</div>
                    <div className="font-medium text-red-400">
                      {formatCurrency(esc.riskIfNotFixed)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    Deadline: {getTimeRemaining(esc.deadline)}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onResponse(esc.id, 'approved')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                    >
                      Approve Fix
                    </button>
                    <button
                      onClick={() => onResponse(esc.id, 'rejected')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                    >
                      Reject with Reason
                    </button>
                    <button
                      onClick={() => onResponse(esc.id, 'deferred')}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
                    >
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// =============================================================================
// BANNED PATTERNS VIEW
// =============================================================================

interface BannedPatternsViewProps {
  patterns: PatternBan[];
}

const BannedPatternsView: React.FC<BannedPatternsViewProps> = ({ patterns }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Banned Decision Patterns</h2>
        <span className="text-white/50">{patterns.length} patterns banned</span>
      </div>

      {patterns.map((pattern) => (
        <div key={pattern.id} className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-red-400">🚫</span>
                {pattern.pattern}
              </h3>
              <p className="text-white/60 mt-1">{pattern.description}</p>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">{pattern.failureRate}% failure rate</div>
              <div className="text-sm text-white/50">
                Total cost: {formatCurrency(pattern.totalCost)}
              </div>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-white/50 mb-3">
              Instances that led to this ban:
            </h4>
            <div className="space-y-2">
              {pattern.instances.map((instance, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span
                      className={instance.outcome === 'failure' ? 'text-red-400' : 'text-green-400'}
                    >
                      {instance.outcome === 'failure' ? '❌' : '✓'}
                    </span>
                    <span>{instance.decisionTitle}</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/50">
                    <span>{formatDate(instance.date)}</span>
                    {instance.cost && (
                      <span className="text-red-400">{formatCurrency(instance.cost)}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="text-white/50">
              Banned: {formatDate(pattern.bannedAt)} by {pattern.bannedBy}
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg">
              Override requires: {pattern.overrideRequires}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// UPSKILL VIEW
// =============================================================================

interface UpskillViewProps {
  assignments: UpskillAssignment[];
}

const UpskillView: React.FC<UpskillViewProps> = ({ assignments }) => {
  const getStatusColor = (status: UpskillAssignment['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400 bg-green-500/20';
      case 'in_progress':
        return 'text-blue-400 bg-blue-500/20';
      case 'overdue':
        return 'text-red-400 bg-red-500/20';
      default:
        return 'text-amber-400 bg-amber-500/20';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Human Upskill Assignments</h2>
        <span className="text-white/50">{assignments.length} active assignments</span>
      </div>

      {assignments.map((assignment) => (
        <div key={assignment.id} className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold">{assignment.userName}</h3>
                  <p className="text-sm text-white/50">Gap: {assignment.gapIdentified}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}
              >
                {assignment.status.replace('_', ' ').toUpperCase()}
              </span>
              {assignment.blockingActions && (
                <div className="mt-2 text-xs text-red-400">⚠️ Blocking actions</div>
              )}
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{assignment.trainingTopic}</h4>
              <span className="text-sm text-white/50">{assignment.trainingDuration} min total</span>
            </div>
            <div className="space-y-2">
              {assignment.modules.map((module, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>
                      {module.type === 'video' ? '🎥' : module.type === 'quiz' ? '📝' : '📖'}
                    </span>
                    <span>{module.title}</span>
                  </div>
                  <span className="text-white/50">{module.duration} min</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Deadline: {getTimeRemaining(assignment.deadline)}</span>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              Start Training
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// =============================================================================
// HISTORY VIEW
// =============================================================================

const HistoryView: React.FC = () => {
  const [runs, setRuns] = useState<ApotheosisRun[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRuns = async () => {
      const data = await apotheosisService.getRunHistory(14);
      setRuns(data);
      setIsLoading(false);
    };
    loadRuns();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Run History</h2>
        <span className="text-white/50">Last 14 days</span>
      </div>

      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/20">
            <tr className="text-left text-sm text-white/50">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Scenarios</th>
              <th className="px-4 py-3">Survival</th>
              <th className="px-4 py-3">Weaknesses</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runs.map((run) => (
              <tr key={run.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div>{formatDate(run.startedAt)}</div>
                  <div className="text-xs text-white/50">{formatTime(run.startedAt)}</div>
                </td>
                <td className="px-4 py-3 text-white/70">{run.duration} min</td>
                <td className="px-4 py-3">{run.scenariosTested.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={run.survivalRate >= 90 ? 'text-green-400' : 'text-amber-400'}>
                    {run.survivalRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-red-400">{run.criticalCount}</span> /
                  <span className="text-amber-400"> {run.highCount}</span> /
                  <span className="text-white/50"> {run.mediumCount + run.lowCount}</span>
                </td>
                <td className="px-4 py-3 font-medium">{run.apotheosisScore.toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={run.scoreDelta >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {run.scoreDelta >= 0 ? '+' : ''}
                    {run.scoreDelta.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApotheosisPage;
