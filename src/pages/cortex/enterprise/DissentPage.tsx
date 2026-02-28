// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DISSENT™ — THE RIGHT TO FORMALLY, SAFELY, IMMUTABLY DISAGREE
// "Every decision includes the right to disagree — on the record, forever."
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  dissentService,
  Dissent,
  DissenterProfile,
  OrganizationDissentMetrics,
  DissentType,
  DissentSeverity,
  ResponseType,
} from '../../../services/DissentService';
import {
  DISSENT_MODES,
  INDUSTRY_SENSITIVITY_PROFILES,
  CORE_DISSENT_MODES,
  calculateProtectionScore,
  getIndustryGuidance,
} from '../../../data/dissentModes';
import {
  ModeSelector,
  IndustrySelector,
  ModeInfoBanner,
  IndustryInsight,
} from '../../../components/modes';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getTimeRemaining = (deadline: Date | string): string => {
  const now = new Date();
  const target = new Date(deadline);
  const diff = target.getTime() - now.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (diff < 0) {return 'Overdue';}
  if (days > 0) {return `${days} days remaining`;}
  if (hours > 0) {return `${hours} hours remaining`;}
  return 'Due soon';
};

const getStatusColor = (status: Dissent['status']): string => {
  switch (status) {
    case 'pending':
      return 'bg-amber-500/20 text-amber-400';
    case 'acknowledged':
      return 'bg-blue-500/20 text-blue-400';
    case 'accepted':
      return 'bg-green-500/20 text-green-400';
    case 'overruled':
      return 'bg-red-500/20 text-red-400';
    case 'clarification_requested':
      return 'bg-purple-500/20 text-purple-400';
    case 'escalated':
      return 'bg-orange-500/20 text-orange-400';
    default:
      return 'bg-white/20 text-white';
  }
};

const getDissentTypeLabel = (type: DissentType): string => {
  const labels: Record<DissentType, string> = {
    factual: 'Factual Concern',
    risk: 'Risk Concern',
    ethical: 'Ethical Concern',
    process: 'Process Concern',
    strategic: 'Strategic Concern',
    resource: 'Resource Concern',
    other: 'Other',
  };
  return labels[type];
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DissentPage: React.FC = () => {
  const navigate = useNavigate();
  const [dissents, setDissents] = useState<Dissent[]>([]);
  const [metrics, setMetrics] = useState<OrganizationDissentMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'file' | 'my-dissents' | 'respond' | 'analytics'
  >('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedModeId, setSelectedModeId] = useState<string>('confidential-concern');
  const [selectedIndustryId, setSelectedIndustryId] = useState<string>('general');
  
  const currentMode = DISSENT_MODES[selectedModeId];
  const currentIndustry = INDUSTRY_SENSITIVITY_PROFILES[selectedIndustryId];
  const protectionScore = currentMode && currentIndustry 
    ? calculateProtectionScore(currentMode, currentIndustry) 
    : null;
  const industryGuidance = currentMode && currentIndustry
    ? getIndustryGuidance(currentMode, currentIndustry)
    : '';

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [dissentsData, metricsData] = await Promise.all([
        dissentService.getDissents(),
        dissentService.getOrganizationMetrics(),
      ]);

      setDissents(dissentsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading Dissent data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Initialize demo data
    dissentService.initializeDemoData().catch(() => {});
  }, [loadData]);

  const activeDissents = dissents.filter((d) => d.status === 'pending');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-red-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-xl">
                  🛑
                </div>
                <div>
                  <h1 className="text-xl font-bold">CendiaDissent™</h1>
                  <p className="text-sm text-white/60">
                    Formalized, Protected, Immutable Disagreement
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <ModeSelector
                  label=""
                  modes={DISSENT_MODES}
                  selectedModeId={selectedModeId}
                  onModeChange={setSelectedModeId}
                  coreModeIds={[...CORE_DISSENT_MODES]}
                  className="w-64"
                />
                <IndustrySelector
                  label=""
                  industries={INDUSTRY_SENSITIVITY_PROFILES}
                  selectedIndustryId={selectedIndustryId}
                  onIndustryChange={setSelectedIndustryId}
                  className="w-48"
                />
              </div>
              <button
                onClick={() => setShowFileModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
              >
                File New Dissent
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-red-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              {
                id: 'respond',
                label: 'Pending Response',
                icon: '⏳',
                count: activeDissents.length,
              },
              { id: 'my-dissents', label: 'My Dissents', icon: '📝' },
              { id: 'analytics', label: 'Organization Health', icon: '📈' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-white bg-red-500/10'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="px-1.5 py-0.5 text-xs bg-red-500/30 rounded-full">
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
        
        {/* Industry Guidance */}
        {industryGuidance && <IndustryInsight insight={industryGuidance} />}
        
        {/* Protection Score Summary */}
        {protectionScore && (
          <div className="mt-4 mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: currentMode?.color }}>
                    {protectionScore.score}%
                  </div>
                  <div className="text-xs text-gray-500">Protection Score</div>
                </div>
                <div className="h-8 w-px bg-gray-700" />
                <div>
                  <div className="text-sm text-gray-300">
                    Retaliation Risk: <span className={`font-medium ${
                      protectionScore.retaliationRisk === 'low' ? 'text-green-400' :
                      protectionScore.retaliationRisk === 'medium' ? 'text-yellow-400' :
                      protectionScore.retaliationRisk === 'high' ? 'text-orange-400' : 'text-red-400'
                    }`}>{protectionScore.retaliationRisk.toUpperCase()}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {protectionScore.recommendedActions.slice(0, 2).map((action, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">
                        {action}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Anonymity: {currentMode?.anonymityLevel}</div>
                <div className="text-xs text-gray-500">Escalation: {currentMode?.escalationPath}</div>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && metrics && (
              <DashboardView
                metrics={metrics}
                activeDissents={activeDissents}
                recentDissents={dissents.slice(0, 5)}
              />
            )}

            {activeTab === 'respond' && (
              <RespondView dissents={activeDissents} onRespond={loadData} />
            )}

            {activeTab === 'my-dissents' && <MyDissentsView dissents={dissents} />}

            {activeTab === 'analytics' && metrics && <AnalyticsView metrics={metrics} />}
          </>
        )}
      </main>

      {/* File Dissent Modal */}
      {showFileModal && (
        <FileDissentModal
          onClose={() => setShowFileModal(false)}
          onSubmit={async (data) => {
            await dissentService.fileDissent(data);
            setShowFileModal(false);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

interface DashboardViewProps {
  metrics: OrganizationDissentMetrics;
  activeDissents: Dissent[];
  recentDissents: Dissent[];
}

const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  activeDissents,
  recentDissents,
}) => {
  return (
    <div className="space-y-8">
      {/* Dissent Index */}
      <div className="bg-gradient-to-br from-red-900/50 to-rose-900/50 rounded-2xl border border-red-500/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg text-white/60 mb-2">DISSENT INDEX</h2>
          <div
            className={`text-5xl font-bold ${
              metrics.healthStatus === 'healthy'
                ? 'text-green-400'
                : metrics.healthStatus === 'warning'
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}
          >
            {metrics.healthStatus.toUpperCase()}
          </div>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            {metrics.healthStatus === 'healthy'
              ? 'Your organization has healthy dissent patterns. People feel safe to disagree, and dissent is acknowledged and tracked.'
              : "There are concerns about your organization's dissent patterns."}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{metrics.activeDissents}</div>
            <div className="text-sm text-white/50 mt-1">Active Dissents</div>
            <div className="text-xs text-white/30">awaiting response</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{metrics.responseRate}%</div>
            <div className="text-sm text-white/50 mt-1">Response Rate</div>
            <div className="text-xs text-white/30">all acknowledged</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{metrics.overallAccuracy}%</div>
            <div className="text-sm text-white/50 mt-1">Dissent Accuracy</div>
            <div className="text-xs text-white/30">dissenters proven right</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{metrics.retaliationFlags}</div>
            <div className="text-sm text-white/50 mt-1">Retaliation Flags</div>
            <div className="text-xs text-white/30">no incidents</div>
          </div>
        </div>
      </div>

      {/* Active Dissents Requiring Response */}
      {activeDissents.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Dissents Requiring Response</h3>
          <div className="space-y-4">
            {activeDissents.map((dissent) => (
              <DissentCard key={dissent.id} dissent={dissent} showResponseButton />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* High Accuracy Dissenters */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⭐</span> High-Accuracy Dissenters
          </h3>
          <p className="text-sm text-white/50 mb-4">
            These people's dissents should receive priority review.
          </p>
          <div className="space-y-3">
            {metrics.highAccuracyDissenters.map((profile) => (
              <div
                key={profile.userId}
                className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <div className="font-medium">{profile.userName}</div>
                    <div className="text-xs text-white/50">{profile.totalDissents} dissents</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{profile.dissentAccuracy}%</div>
                  <div className="text-xs text-white/50">accuracy</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Dissent by Department</h3>
          <div className="space-y-3">
            {metrics.byDepartment.map((dept) => (
              <div key={dept.department} className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{dept.department}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{dept.totalDissents} dissents</span>
                    <span className={dept.accuracy >= 70 ? 'text-green-400' : 'text-white/50'}>
                      {dept.accuracy}% accuracy
                    </span>
                    <span>{dept.trend === 'up' ? '↑' : dept.trend === 'down' ? '↓' : '→'}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div
                    className="h-1.5 bg-green-500 rounded-full"
                    style={{ width: `${dept.acceptedRate}%` }}
                  />
                  <div
                    className="h-1.5 bg-red-500/50 rounded-full"
                    style={{ width: `${100 - dept.acceptedRate}%` }}
                  />
                </div>
                <div className="text-xs text-white/40 mt-1">{dept.acceptedRate}% accepted</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// DISSENT CARD COMPONENT
// =============================================================================

interface DissentCardProps {
  dissent: Dissent;
  showResponseButton?: boolean;
}

const DissentCard: React.FC<DissentCardProps> = ({ dissent, showResponseButton }) => {
  return (
    <div className="bg-black/20 rounded-xl p-4 border border-white/10">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          {dissent.isAnonymous ? '🔒' : '👤'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(dissent.status)}`}>
              {dissent.status.replace('_', ' ').toUpperCase()}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {getDissentTypeLabel(dissent.dissentType)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {dissent.severity.replace('_', ' ')}
            </span>
          </div>

          <h4 className="font-semibold">{dissent.decisionTitle}</h4>
          <p className="text-sm text-white/60 mt-1 line-clamp-2">{dissent.statement}</p>

          <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
            <span>From: {dissent.dissenterName}</span>
            <span>Filed: {formatDate(dissent.createdAt)}</span>
            <span className={new Date(dissent.responseDeadline) < new Date() ? 'text-red-400' : ''}>
              {getTimeRemaining(dissent.responseDeadline)}
            </span>
          </div>

          {dissent.response && (
            <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-white/50 mb-1">
                Response from {dissent.response.responderName}:
              </div>
              <p className="text-sm">{dissent.response.reasoning}</p>
            </div>
          )}

          {dissent.outcomeVerified && (
            <div
              className={`mt-3 px-3 py-2 rounded-lg text-sm ${
                dissent.dissenterWasRight
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/10 text-white/60'
              }`}
            >
              {dissent.dissenterWasRight
                ? '✓ Dissenter was RIGHT'
                : 'Outcome verified: dissenter was wrong'}
            </div>
          )}
        </div>

        {showResponseButton && dissent.status === 'pending' && (
          <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Respond
          </button>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// RESPOND VIEW
// =============================================================================

interface RespondViewProps {
  dissents: Dissent[];
  onRespond: () => void;
}

const RespondView: React.FC<RespondViewProps> = ({ dissents, onRespond }) => {
  const [selectedDissent, setSelectedDissent] = useState<Dissent | null>(null);
  const [responseType, setResponseType] = useState<ResponseType>('acknowledge_proceed');
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedDissent || !reasoning.trim()) {return;}

    setIsSubmitting(true);
    try {
      await dissentService.respondToDissent(selectedDissent.id, {
        responderId: 'current-user',
        responderName: 'Current User',
        responderRole: 'Decision Owner',
        responseType,
        reasoning,
      });
      setSelectedDissent(null);
      setReasoning('');
      onRespond();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Dissents Requiring Your Response</h2>
        <span className="text-white/50">{dissents.length} pending</span>
      </div>

      {dissents.length === 0 ? (
        <div className="text-center py-12 text-white/50">
          <span className="text-4xl mb-4 block">✓</span>
          No pending dissents. All clear!
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Dissent List */}
          <div className="space-y-4">
            {dissents.map((dissent) => (
              <div
                key={dissent.id}
                onClick={() => setSelectedDissent(dissent)}
                className={`cursor-pointer transition-all ${
                  selectedDissent?.id === dissent.id ? 'ring-2 ring-red-500' : 'hover:bg-white/5'
                }`}
              >
                <DissentCard dissent={dissent} />
              </div>
            ))}
          </div>

          {/* Response Form */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 sticky top-24">
            {selectedDissent ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Respond to Dissent</h3>

                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">Response Type</label>
                  <div className="space-y-2">
                    {[
                      { value: 'accept', label: 'Accept dissent (change the decision)' },
                      { value: 'partial_accept', label: 'Partial accept (modify the decision)' },
                      {
                        value: 'acknowledge_proceed',
                        label: 'Acknowledge but proceed (explain why overruling)',
                      },
                      { value: 'request_clarification', label: 'Request clarification' },
                      { value: 'escalate_together', label: 'Escalate jointly to board' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="responseType"
                          value={option.value}
                          checked={responseType === option.value}
                          onChange={() => setResponseType(option.value as ResponseType)}
                          className="text-red-500"
                        />
                        <span className="text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">
                    Your Reasoning (required)
                  </label>
                  <textarea
                    value={reasoning}
                    onChange={(e) => setReasoning(e.target.value)}
                    rows={6}
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Explain your response..."
                  />
                </div>

                <div className="text-xs text-white/40 mb-4">
                  ⚠️ This response will be permanently recorded in CendiaLedger™
                </div>

                <button
                  onClick={handleSubmit}
                  disabled={!reasoning.trim() || isSubmitting}
                  className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </>
            ) : (
              <div className="text-center py-12 text-white/50">Select a dissent to respond</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MY DISSENTS VIEW
// =============================================================================

interface MyDissentsViewProps {
  dissents: Dissent[];
}

const MyDissentsView: React.FC<MyDissentsViewProps> = ({ dissents }) => {
  const [profile, setProfile] = useState<DissenterProfile | null>(null);

  useEffect(() => {
    dissentService.getDissenterProfile('user-sarah').then(setProfile);
  }, []);

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      {profile && (
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
              {profile.isHighAccuracy ? '⭐' : '👤'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.userName}</h3>
              {profile.isHighAccuracy && (
                <div className="text-sm text-yellow-400">⭐ High-Accuracy Dissenter</div>
              )}
              <p className="text-sm text-white/50 mt-1">Your dissents receive priority review.</p>
            </div>
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">{profile.totalDissents}</div>
                <div className="text-xs text-white/50">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{profile.acceptedDissents}</div>
                <div className="text-xs text-white/50">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{profile.overruledDissents}</div>
                <div className="text-xs text-white/50">Overruled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{profile.dissentAccuracy}%</div>
                <div className="text-xs text-white/50">Accuracy</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dissent History */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="font-semibold">My Dissent History</h3>
        </div>
        <div className="divide-y divide-white/5">
          {dissents.map((dissent) => (
            <div key={dissent.id} className="p-4">
              <DissentCard dissent={dissent} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// ANALYTICS VIEW
// =============================================================================

interface AnalyticsViewProps {
  metrics: OrganizationDissentMetrics;
}

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ metrics }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Organization Dissent Health</h2>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-white">{metrics.totalDissents}</div>
          <div className="text-sm text-white/50 mt-2">Total Dissents</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-green-400">{metrics.responseRate}%</div>
          <div className="text-sm text-white/50 mt-2">Response Rate</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-purple-400">{metrics.acceptanceRate}%</div>
          <div className="text-sm text-white/50 mt-2">Acceptance Rate</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-amber-400">{metrics.overallAccuracy}%</div>
          <div className="text-sm text-white/50 mt-2">Dissent Accuracy</div>
        </div>
      </div>

      {/* Attention Required */}
      {metrics.byDepartment.some((d) => d.accuracy >= 75) && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold">Attention Required</h4>
              <p className="text-sm text-white/70 mt-1">
                {metrics.byDepartment.find((d) => d.accuracy >= 75)?.department} dissents have{' '}
                {metrics.byDepartment.find((d) => d.accuracy >= 75)?.accuracy}% accuracy —
                significantly higher than organization average. Consider elevating{' '}
                {metrics.byDepartment.find((d) => d.accuracy >= 75)?.department} concerns in Council
                weighting.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Trend Chart */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="font-semibold mb-4">Dissent Trend</h3>
        <div className="h-48 flex items-end gap-2">
          {metrics.trend.map((point, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-white/50">{point.accuracy}%</div>
              <div
                className="w-full bg-red-500/50 rounded-t"
                style={{ height: `${point.count * 8}px` }}
              />
              <div className="text-xs text-white/40">{point.date.slice(5)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="font-semibold mb-4">Dissent by Department</h3>
        <table className="w-full">
          <thead className="text-left text-sm text-white/50">
            <tr>
              <th className="pb-3">Department</th>
              <th className="pb-3">Dissents</th>
              <th className="pb-3">Accepted</th>
              <th className="pb-3">Accuracy</th>
              <th className="pb-3">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {metrics.byDepartment.map((dept) => (
              <tr key={dept.department}>
                <td className="py-3 font-medium">{dept.department}</td>
                <td className="py-3">{dept.totalDissents}</td>
                <td className="py-3">{dept.acceptedRate}%</td>
                <td className="py-3">
                  <span className={dept.accuracy >= 70 ? 'text-green-400' : 'text-white/70'}>
                    {dept.accuracy}%
                  </span>
                </td>
                <td className="py-3">
                  <span
                    className={
                      dept.trend === 'up'
                        ? 'text-green-400'
                        : dept.trend === 'down'
                          ? 'text-red-400'
                          : 'text-white/50'
                    }
                  >
                    {dept.trend === 'up' ? '↑' : dept.trend === 'down' ? '↓' : '→'}
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

// =============================================================================
// FILE DISSENT MODAL
// =============================================================================

interface FileDissentModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const FileDissentModal: React.FC<FileDissentModalProps> = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    decisionId: '',
    decisionTitle: '',
    decisionOwner: '',
    dissentType: 'ethical' as DissentType,
    severity: 'formal_objection' as DissentSeverity,
    statement: '',
    isAnonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.statement.trim()) {return;}

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dissenterId: 'current-user',
        dissenterName: formData.isAnonymous ? 'Anonymous Stakeholder' : 'Current User',
        dissenterRole: 'Team Member',
        dissenterDepartment: 'Engineering',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🛑</span> Register Formal Dissent
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Decision Info */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Decision Title</label>
            <input
              type="text"
              value={formData.decisionTitle}
              onChange={(e) => setFormData({ ...formData, decisionTitle: e.target.value })}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="e.g., Q1 Product Roadmap"
              required
            />
          </div>

          {/* Dissent Type */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Dissent Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(
                ['factual', 'risk', 'ethical', 'process', 'strategic', 'resource'] as DissentType[]
              ).map((type) => (
                <label
                  key={type}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    formData.dissentType === type
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-black/20 border-white/10'
                  } border`}
                >
                  <input
                    type="radio"
                    name="dissentType"
                    value={type}
                    checked={formData.dissentType === type}
                    onChange={() => setFormData({ ...formData, dissentType: type })}
                    className="sr-only"
                  />
                  <span className="text-sm">{getDissentTypeLabel(type)}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Statement */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Your Statement</label>
            <textarea
              value={formData.statement}
              onChange={(e) => setFormData({ ...formData, statement: e.target.value })}
              rows={6}
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Explain your objection clearly..."
              required
            />
          </div>

          {/* Severity */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Severity</label>
            <div className="space-y-2">
              {[
                { value: 'advisory', label: 'Advisory (for the record)' },
                { value: 'formal_objection', label: 'Formal objection (requires response)' },
                { value: 'blocking', label: 'Blocking (request decision halt pending review)' },
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                    formData.severity === option.value
                      ? 'bg-red-500/20 border-red-500'
                      : 'bg-black/20 border-white/10'
                  } border`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={option.value}
                    checked={formData.severity === option.value}
                    onChange={() =>
                      setFormData({ ...formData, severity: option.value as DissentSeverity })
                    }
                    className="sr-only"
                  />
                  <span className="text-sm">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Anonymous Option */}
          <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAnonymous}
              onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              className="rounded"
            />
            <div>
              <div className="font-medium">Submit Anonymously</div>
              <div className="text-xs text-white/50">
                Your identity will be encrypted and protected
              </div>
            </div>
          </label>

          {/* Warning */}
          <div className="text-sm text-white/40 border-t border-white/10 pt-4">
            ⚠️ By submitting, you confirm:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>This dissent will be permanently recorded</li>
              <li>Decision owner will be notified</li>
              <li>You are protected from retaliation</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.statement.trim() || isSubmitting}
              className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Formal Dissent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DissentPage;
