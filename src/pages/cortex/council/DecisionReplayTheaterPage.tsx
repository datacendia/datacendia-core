// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CendiaReplay™ PAGE
// Watch past deliberations unfold like a movie
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '@/hooks/useWebSocket';
import { api } from '../../../lib/api';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Rewind,
  FastForward,
  Film,
  Clock,
  Users,
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Download,
  Share2,
  Maximize2,
  Volume2,
  Settings,
  FileText,
  Calendar,
  ChevronRight,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ReplayFrame {
  id: string;
  timestamp: number;
  type: 'statement' | 'citation' | 'dissent' | 'vote' | 'consensus' | 'round_change';
  agentName?: string;
  agentRole?: string;
  content: string;
  confidence?: number;
}

interface ReplaySession {
  id: string;
  title: string;
  description: string;
  duration: number;
  frameCount: number;
  agentCount: number;
  outcome: string;
  consensusReached: boolean;
  createdAt: Date;
  councilMode: string;
}

// =============================================================================
// MOCK DATA
// =============================================================================

// TR Demo Session - Petrov Transfer (seeded from backend)
const TR_DEMO_SESSION: ReplaySession = {
  id: 'tr-demo-petrov-transfer',
  title: '$2.5M PEP Transfer to Viktor Petrov - Cyprus',
  description: 'Basel III compliance deliberation for politically exposed person transfer with formal dissent',
  duration: 1822000,
  frameCount: 6,
  agentCount: 4,
  outcome: 'ESCALATE_WITH_CONDITIONS',
  consensusReached: false,
  createdAt: new Date('2026-01-29T20:15:00Z'),
  councilMode: 'regulatory-compliance',
};

// Fallback mock sessions (shown if no API data)
const FALLBACK_SESSIONS: ReplaySession[] = [
  TR_DEMO_SESSION,
  {
    id: '1',
    title: 'Q1 2026 Budget Allocation Strategy',
    description: 'Council deliberation on resource allocation across departments',
    duration: 847000,
    frameCount: 156,
    agentCount: 8,
    outcome: 'Approved with modifications',
    consensusReached: true,
    createdAt: new Date(Date.now() - 86400000 * 2),
    councilMode: 'strategic-planning',
  },
];

// TR Demo Frames - Petrov Transfer deliberation
const TR_DEMO_FRAMES: ReplayFrame[] = [
  { id: 'tr-1', timestamp: 0, type: 'round_change', content: 'Deliberation initiated: $2.5M PEP Transfer to Viktor Petrov' },
  { id: 'tr-2', timestamp: 90000, type: 'statement', agentName: 'CFO Advisor', agentRole: 'Financial Analysis', content: 'From a financial perspective, this $2.5M transfer represents a routine transaction size for our institutional clients. However, the PEP status of Viktor Petrov introduces enhanced scrutiny requirements under Basel III. Recommendation: Proceed with transfer, but ensure all Basel III documentation requirements are met before execution.', confidence: 78 },
  { id: 'tr-3', timestamp: 285000, type: 'dissent', agentName: 'Risk Analyzer', agentRole: 'Risk Assessment', content: '**FORMAL OBJECTION FILED** - PEP exposure combined with cross-border jurisdiction creates unacceptable regulatory risk. Risk Factors: PEP Status (+25%), Cross-Border Jurisdiction (+20%), Time Pressure (+15%), Amount Threshold (+7%). Cumulative Score: 67%. This transfer should be BLOCKED until a full 24-hour compliance review is completed.' },
  { id: 'tr-4', timestamp: 552000, type: 'statement', agentName: 'Legal Counsel', agentRole: 'Legal Analysis', content: 'Legal analysis: Basel III PEP requirements PARTIALLY MET. SEC recordkeeping AT RISK. FINRA AML REQUIRES ATTENTION. I concur with Risk Analyzer that a 24-hour hold is prudent. However, if business necessity requires same-day execution, ensure compliance officer verbal approval is documented.', confidence: 82 },
  { id: 'tr-5', timestamp: 693000, type: 'statement', agentName: 'Compliance Bot', agentRole: 'Automated Compliance', content: 'AUTOMATED COMPLIANCE CHECK: OFAC Screening ✅ PASS, PEP Database ⚠️ FLAG (Viktor Petrov - Former Deputy Minister of Finance), Jurisdiction Risk ⚠️ FLAG (Cyprus - Medium-High), Amount Threshold ⚠️ FLAG (Exceeds $1M PEP threshold). Basel III Compliance Score: 62/100 (Below 75 threshold). System Recommendation: ESCALATE to human compliance officer.', confidence: 91 },
  { id: 'tr-6', timestamp: 960000, type: 'statement', agentName: 'CFO Advisor', agentRole: 'Financial Analysis', content: 'Responding to Risk Analyzer: I acknowledge the regulatory concerns, but Petrov Holdings has been a client for 7 years with no compliance incidents. Proposed Compromise: Execute transfer with compliance hold (funds released after 24-hour review), document this deliberation as evidence of due diligence.', confidence: 74 },
  { id: 'tr-7', timestamp: 1185000, type: 'dissent', agentName: 'Risk Analyzer', agentRole: 'Risk Assessment', content: '**DISSENT MAINTAINED** - I will accept the compromise IF AND ONLY IF: This deliberation is preserved as part of the audit trail, my dissent is formally recorded and acknowledged, compliance officer approval is documented (not just verbal), enhanced monitoring is implemented for 90 days minimum.' },
  { id: 'tr-8', timestamp: 1620000, type: 'vote', content: 'Voting initiated: APPROVE WITH CONDITIONS vs BLOCK' },
  { id: 'tr-9', timestamp: 1822000, type: 'consensus', content: 'Decision: ESCALATE_WITH_CONDITIONS - Approve transfer with 24-hour compliance hold, enhanced monitoring for 90 days, documented compliance officer approval. Dissent from Risk Analyzer formally recorded and acknowledged.' },
];

// Fallback mock frames
const FALLBACK_FRAMES: ReplayFrame[] = [
  { id: '1', timestamp: 0, type: 'round_change', content: 'Round 1 begins' },
  { id: '2', timestamp: 5000, type: 'statement', agentName: 'CendiaChief', agentRole: 'Chief Strategist', content: 'Let\'s begin by examining the key factors driving this decision.', confidence: 75 },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatDuration = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  }
  return `${minutes}m ${seconds % 60}s`;
};

const formatTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DecisionReplayTheaterPage: React.FC = () => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState<ReplaySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ReplaySession | null>(null);
  const [frames, setFrames] = useState<ReplayFrame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions from API on mount
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    setIsLoading(true);
    try {
      // Fetch deliberations from API
      const res = await api.get<any>('/council/deliberations', { limit: 50 });
      const payload = res as any;
      
      if (payload.success && payload.deliberations && payload.deliberations.length > 0) {
        const apiSessions: ReplaySession[] = payload.deliberations.map((d: any) => ({
          id: d.id,
          title: d.question?.substring(0, 100) || 'Council Deliberation',
          description: d.question || '',
          duration: d.duration_ms || (d.completed_at && d.started_at ? 
            new Date(d.completed_at).getTime() - new Date(d.started_at).getTime() : 600000),
          frameCount: d.deliberation_messages?.length || d.responses?.length || 1,
          agentCount: 4,
          outcome: d.decision ? JSON.parse(d.decision).outcome || 'Completed' : d.status,
          consensusReached: d.confidence >= 0.7,
          createdAt: new Date(d.created_at || d.createdAt),
          councilMode: d.mode || 'deliberation',
        }));
        setSessions(apiSessions);
      } else {
        // Use fallback with TR demo session first
        setSessions(FALLBACK_SESSIONS);
      }
    } catch (error) {
      console.error('Failed to load sessions:', error);
      setSessions(FALLBACK_SESSIONS);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFramesForSession = async (sessionId: string) => {
    // Check if this is the TR demo session
    if (sessionId === 'tr-demo-petrov-transfer') {
      setFrames(TR_DEMO_FRAMES);
      return;
    }

    try {
      // Fetch deliberation messages from API
      const res = await api.get<any>(`/council/deliberations/${sessionId}`);
      const payload = res as any;
      
      if (payload.success && payload.deliberation) {
        const d = payload.deliberation;
        const messages = d.deliberation_messages || d.responses || [];
        
        const apiFrames: ReplayFrame[] = [
          { id: 'start', timestamp: 0, type: 'round_change', content: 'Deliberation started' },
          ...messages.map((m: any, i: number) => ({
            id: m.id || `msg-${i}`,
            timestamp: (i + 1) * 60000,
            type: m.phase === 'dissent' ? 'dissent' as const : 'statement' as const,
            agentName: m.agents?.name || m.agentName || m.agent_id || 'Agent',
            agentRole: m.agents?.role || m.phase || 'Analysis',
            content: m.content?.substring(0, 500) || '',
            confidence: m.confidence,
          })),
          ...(d.status === 'COMPLETED' ? [{
            id: 'end',
            timestamp: messages.length * 60000 + 60000,
            type: 'consensus' as const,
            content: `Decision reached: ${d.decision || d.synthesis || 'Completed'}`,
          }] : []),
        ];
        setFrames(apiFrames);
      } else {
        setFrames(FALLBACK_FRAMES);
      }
    } catch (error) {
      console.error('Failed to load frames:', error);
      setFrames(FALLBACK_FRAMES);
    }
  };
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // WebSocket for real-time replay streaming
  const { socket, connected, on, emit } = useWebSocket();

  // Join decision replay room when session selected
  useEffect(() => {
    if (connected && socket && selectedSession) {
      emit('join-decision', selectedSession.id);
    }
  }, [connected, socket, selectedSession, emit]);

  // Listen for replay frame updates
  useEffect(() => {
    if (!socket) {return;}

    const handleReplayFrame = (frame: ReplayFrame) => {
      setFrames(prev => [...prev, frame]);
      if (isPlaying) {
        setCurrentFrameIndex(prev => prev + 1);
      }
    };

    on('replay-frame', handleReplayFrame);
  }, [socket, on, isPlaying]);

  const currentFrame = frames[currentFrameIndex];
  const progress = selectedSession ? (currentFrame?.timestamp || 0) / selectedSession.duration * 100 : 0;

  // Playback logic
  useEffect(() => {
    if (!isPlaying || !selectedSession) {return;}

    const interval = setInterval(() => {
      setCurrentFrameIndex(prev => {
        if (prev >= frames.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000 / playbackSpeed);

    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, selectedSession, frames.length]);

  const handleSelectSession = async (session: ReplaySession) => {
    setSelectedSession(session);
    setCurrentFrameIndex(0);
    setIsPlaying(false);
    await loadFramesForSession(session.id);
  };

  const handleSeek = (frameIndex: number) => {
    setCurrentFrameIndex(Math.max(0, Math.min(frameIndex, frames.length - 1)));
  };

  // Session List View
  if (!selectedSession) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Film className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">CendiaReplay™</h1>
                <p className="text-purple-200">Watch past deliberations unfold like a movie</p>
              </div>
            </div>
          </div>
        </div>

        {/* Session List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Deliberations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map(session => (
              <button
                key={session.id}
                onClick={() => handleSelectSession(session)}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 text-left hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <Film className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  {session.consensusReached ? (
                    <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                      <CheckCircle className="w-4 h-4" />
                      Consensus
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-sm text-yellow-600 dark:text-yellow-400">
                      <AlertTriangle className="w-4 h-4" />
                      No Consensus
                    </span>
                  )}
                </div>
                
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{session.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">{session.description}</p>
                
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatDuration(session.duration)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {session.agentCount} agents
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {session.createdAt.toLocaleDateString()}
                  </span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Outcome: </span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{session.outcome}</span>
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Replay View
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Theater Header */}
      <div className="bg-black/50 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <SkipBack className="w-5 h-5" />
              </button>
              <div>
                <h1 className="font-semibold">{selectedSession.title}</h1>
                <p className="text-sm text-gray-400">{selectedSession.councilMode}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Download className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Frame Display */}
            <div className="bg-gray-800 rounded-2xl p-8 min-h-[400px] flex flex-col">
              {currentFrame && (
                <>
                  {currentFrame.type === 'round_change' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-purple-500/20 flex items-center justify-center">
                          <Play className="w-10 h-10 text-purple-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-purple-400">{currentFrame.content}</h2>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'statement' && (
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-2xl font-bold">
                          {currentFrame.agentName?.charAt(6)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">{currentFrame.agentName}</h3>
                          <p className="text-gray-400">{currentFrame.agentRole}</p>
                        </div>
                        {currentFrame.confidence && (
                          <div className="ml-auto text-right">
                            <p className="text-sm text-gray-400">Confidence</p>
                            <p className="text-2xl font-bold text-blue-400">{currentFrame.confidence}%</p>
                          </div>
                        )}
                      </div>
                      <div className="bg-gray-700/50 rounded-xl p-6">
                        <MessageCircle className="w-6 h-6 text-gray-400 mb-3" />
                        <p className="text-lg leading-relaxed">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'dissent' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                          <AlertTriangle className="w-10 h-10 text-red-400" />
                        </div>
                        <h2 className="text-xl font-bold text-red-400 mb-2">DISSENT REGISTERED</h2>
                        <p className="text-gray-300">{currentFrame.agentName}</p>
                        <p className="mt-4 text-gray-400">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'consensus' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center max-w-lg">
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-green-400 mb-4">CONSENSUS REACHED</h2>
                        <p className="text-gray-300">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                  
                  {currentFrame.type === 'citation' && (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6 max-w-md">
                        <div className="flex items-center gap-3 mb-3">
                          <FileText className="w-6 h-6 text-yellow-400" />
                          <span className="font-medium text-yellow-400">Citation Added</span>
                        </div>
                        <p className="text-gray-300">{currentFrame.agentName}</p>
                        <p className="text-gray-400 mt-2">{currentFrame.content}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Playback Controls */}
            <div className="bg-gray-800 rounded-xl p-4">
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>{formatTimestamp(currentFrame?.timestamp || 0)}</span>
                  <span>{formatTimestamp(selectedSession.duration)}</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden cursor-pointer">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => handleSeek(0)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Rewind className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSeek(currentFrameIndex - 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-4 bg-purple-600 hover:bg-purple-700 rounded-full transition-colors"
                >
                  {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={() => handleSeek(currentFrameIndex + 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSeek(frames.length - 1)}
                  className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <FastForward className="w-5 h-5" />
                </button>

                {/* Speed Control */}
                <div className="ml-4 flex items-center gap-2">
                  <span className="text-sm text-gray-400">Speed:</span>
                  {[0.5, 1, 1.5, 2].map(speed => (
                    <button
                      key={speed}
                      onClick={() => setPlaybackSpeed(speed)}
                      className={`px-2 py-1 rounded text-sm ${
                        playbackSpeed === speed
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Sidebar */}
          <div className="bg-gray-800 rounded-xl p-5 max-h-[600px] overflow-y-auto">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-2">
              {frames.map((frame, index) => (
                <button
                  key={frame.id}
                  onClick={() => handleSeek(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    index === currentFrameIndex
                      ? 'bg-purple-600/30 border border-purple-500'
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 w-12">{formatTimestamp(frame.timestamp)}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      frame.type === 'dissent' ? 'bg-red-500' :
                      frame.type === 'consensus' ? 'bg-green-500' :
                      frame.type === 'citation' ? 'bg-yellow-500' :
                      frame.type === 'round_change' ? 'bg-purple-500' :
                      'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {frame.agentName || frame.type.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{frame.content}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecisionReplayTheaterPage;
