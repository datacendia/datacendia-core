// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// REAL-TIME DELIBERATION VISUALIZATION PAGE
// Watch AI agents deliberate in real-time with animated avatars
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '@/hooks/useWebSocket';
import { api } from '../../../lib/api';
import { deterministicFloat, deterministicInt } from '../../../lib/deterministic';
import {
  Users,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Settings,
  Eye,
  BookOpen,
  ThumbsUp,
  ThumbsDown,
  Minus,
  Activity,
  Zap,
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface AgentVisualization {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  status: 'idle' | 'thinking' | 'speaking' | 'listening' | 'dissenting' | 'agreeing';
  confidence: number;
  currentStatement?: string;
  citationCount: number;
  dissenting: boolean;
}

interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: 'statement' | 'citation' | 'dissent' | 'agreement' | 'round_complete';
  agentName?: string;
  content: string;
}

// =============================================================================
// TR DEMO DATA - Petrov Transfer Deliberation
// =============================================================================

const TR_DEMO_AGENTS: AgentVisualization[] = [
  { id: 'cfo', name: 'CFO Advisor', role: 'Financial Analysis', avatarColor: 'bg-emerald-500', status: 'speaking', confidence: 78, currentStatement: 'This $2.5M transfer represents routine transaction size, but PEP status requires Basel III scrutiny...', citationCount: 2, dissenting: false },
  { id: 'risk', name: 'Risk Analyzer', role: 'Risk Assessment', avatarColor: 'bg-amber-500', status: 'dissenting', confidence: 67, currentStatement: 'FORMAL OBJECTION: PEP exposure + cross-border jurisdiction = unacceptable regulatory risk', citationCount: 4, dissenting: true },
  { id: 'legal', name: 'Legal Counsel', role: 'Legal Analysis', avatarColor: 'bg-pink-500', status: 'thinking', confidence: 82, citationCount: 3, dissenting: false },
  { id: 'compliance', name: 'Compliance Bot', role: 'Automated Compliance', avatarColor: 'bg-cyan-500', status: 'listening', confidence: 91, citationCount: 5, dissenting: false },
];

const TR_DEMO_TIMELINE: TimelineEvent[] = [
  { id: 'tr-1', timestamp: new Date(Date.now() - 300000), type: 'statement', agentName: 'CFO Advisor', content: 'Initiating Basel III compliance review for $2.5M PEP transfer to Viktor Petrov...' },
  { id: 'tr-2', timestamp: new Date(Date.now() - 240000), type: 'citation', agentName: 'Compliance Bot', content: 'OFAC Screening: PASS | PEP Database: FLAG (Former Deputy Minister)' },
  { id: 'tr-3', timestamp: new Date(Date.now() - 180000), type: 'dissent', agentName: 'Risk Analyzer', content: 'FORMAL OBJECTION FILED - Cumulative risk score 67% exceeds threshold' },
  { id: 'tr-4', timestamp: new Date(Date.now() - 120000), type: 'statement', agentName: 'Legal Counsel', content: 'Basel III PEP requirements PARTIALLY MET. Recommend 24-hour hold.' },
  { id: 'tr-5', timestamp: new Date(Date.now() - 60000), type: 'agreement', agentName: 'CFO Advisor', content: 'Proposed compromise: Execute with compliance hold, document deliberation as due diligence' },
  { id: 'tr-6', timestamp: new Date(), type: 'dissent', agentName: 'Risk Analyzer', content: 'DISSENT MAINTAINED - Will accept IF deliberation preserved in audit trail' },
];

// Fallback agents for non-TR demo scenarios
const FALLBACK_AGENTS: AgentVisualization[] = [
  { id: 'chief', name: 'CendiaChief', role: 'Chief Strategist', avatarColor: 'bg-blue-500', status: 'speaking', confidence: 85, currentStatement: 'Based on the analysis, I recommend we proceed...', citationCount: 3, dissenting: false },
  { id: 'cfo', name: 'CendiaCFO', role: 'Financial Advisor', avatarColor: 'bg-green-500', status: 'listening', confidence: 72, citationCount: 2, dissenting: false },
  { id: 'risk', name: 'CendiaRisk', role: 'Risk Analyst', avatarColor: 'bg-orange-500', status: 'thinking', confidence: 78, citationCount: 4, dissenting: false },
  { id: 'ethics', name: 'CendiaEthics', role: 'Ethics Officer', avatarColor: 'bg-purple-500', status: 'agreeing', confidence: 90, citationCount: 2, dissenting: false },
];

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const AgentAvatar: React.FC<{ agent: AgentVisualization }> = ({ agent }) => {
  const statusColors: Record<string, string> = {
    idle: 'ring-gray-300',
    thinking: 'ring-yellow-400 animate-pulse',
    speaking: 'ring-blue-500 ring-4 animate-pulse',
    listening: 'ring-green-400',
    dissenting: 'ring-red-500 ring-4',
    agreeing: 'ring-green-500 ring-4',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    thinking: <Activity className="w-3 h-3 text-yellow-500 animate-spin" />,
    speaking: <MessageCircle className="w-3 h-3 text-blue-500" />,
    dissenting: <ThumbsDown className="w-3 h-3 text-red-500" />,
    agreeing: <ThumbsUp className="w-3 h-3 text-green-500" />,
  };

  return (
    <div className="relative">
      <div className={`w-16 h-16 rounded-full ${agent.avatarColor} ${statusColors[agent.status]} ring-2 flex items-center justify-center text-white font-bold text-lg shadow-lg transition-all duration-300`}>
        {agent.name.charAt(6)}
      </div>
      {statusIcons[agent.status] && (
        <div className="absolute -bottom-1 -right-1 p-1 bg-white dark:bg-gray-800 rounded-full shadow">
          {statusIcons[agent.status]}
        </div>
      )}
      {agent.dissenting && (
        <div className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full">
          <AlertTriangle className="w-3 h-3 text-white" />
        </div>
      )}
    </div>
  );
};

const ConfidenceMeter: React.FC<{ value: number; label: string }> = ({ value, label }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-xs">
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-700 dark:text-gray-300">{value}%</span>
    </div>
    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-500 ${
          value >= 80 ? 'bg-green-500' : value >= 60 ? 'bg-yellow-500' : 'bg-red-500'
        }`}
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

const SpeechBubble: React.FC<{ agent: AgentVisualization }> = ({ agent }) => {
  if (!agent.currentStatement || agent.status !== 'speaking') {return null;}

  return (
    <div className="absolute left-1/2 -translate-x-1/2 -top-20 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
      <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
        {agent.currentStatement}
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full">
        <div className="w-3 h-3 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45 -translate-y-1.5" />
      </div>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DeliberationVisualizationPage: React.FC = () => {
  const { t } = useTranslation();
  const [agents, setAgents] = useState<AgentVisualization[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentRound, setCurrentRound] = useState(3);
  const [maxRounds, setMaxRounds] = useState(10);
  const [consensusLevel, setConsensusLevel] = useState(72);
  const [showTimeline, setShowTimeline] = useState(true);
  const [deliberationId, setDeliberationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load active deliberation or use TR demo data
  useEffect(() => {
    loadActiveDeliberation();
  }, []);

  const loadActiveDeliberation = async () => {
    setIsLoading(true);
    try {
      // Try to fetch active deliberations from API
      const res = await api.get<any>('/council/deliberations', { limit: 1, status: 'IN_PROGRESS' });
      const payload = res as any;
      
      if (payload.success && payload.deliberations && payload.deliberations.length > 0) {
        const d = payload.deliberations[0];
        setDeliberationId(d.id);
        
        // Convert deliberation messages to visualization format
        const messages = d.deliberation_messages || [];
        const apiAgents: AgentVisualization[] = messages.reduce((acc: AgentVisualization[], m: any) => {
          const existing = acc.find(a => a.id === m.agent_id);
          if (!existing) {
            acc.push({
              id: m.agent_id || m.agentCode,
              name: m.agents?.name || m.agentName || m.agent_id,
              role: m.agents?.role || m.phase || 'Analysis',
              avatarColor: 'bg-blue-500',
              status: 'listening',
              confidence: m.confidence || 75,
              citationCount: 1,
              dissenting: m.phase === 'dissent',
            });
          }
          return acc;
        }, []);
        
        if (apiAgents.length > 0) {
          setAgents(apiAgents);
        } else {
          // Use TR demo data as fallback
          setAgents(TR_DEMO_AGENTS);
          setTimeline(TR_DEMO_TIMELINE);
        }
      } else {
        // No active deliberation - use TR demo data
        setAgents(TR_DEMO_AGENTS);
        setTimeline(TR_DEMO_TIMELINE);
        setConsensusLevel(72);
      }
    } catch (error) {
      console.error('Failed to load deliberation:', error);
      // Use TR demo data on error
      setAgents(TR_DEMO_AGENTS);
      setTimeline(TR_DEMO_TIMELINE);
    } finally {
      setIsLoading(false);
    }
  };

  // WebSocket connection for real-time updates
  const { socket, connected, on, emit } = useWebSocket();

  // Join deliberation room when connected
  useEffect(() => {
    if (connected && socket && deliberationId) {
      emit('join-deliberation', deliberationId);
    }
  }, [connected, socket, deliberationId, emit]);

  // Listen for real-time deliberation updates
  useEffect(() => {
    if (!socket) {return;}

    const handleDeliberationUpdate = (update: any) => {
      // Update agent status based on real-time data
      setAgents(prev => prev.map(agent => 
        agent.id === update.agentId
          ? { ...agent, status: 'speaking', currentStatement: update.message, confidence: update.confidence || agent.confidence }
          : { ...agent, status: 'listening' }
      ));

      // Add to timeline
      setTimeline(prev => [{
        id: `${Date.now()}`,
        timestamp: new Date(),
        type: 'statement' as const,
        agentName: update.agentName,
        content: update.message,
      }, ...prev].slice(0, 20));
    };

    const handleDeliberationComplete = (summary: any) => {
      setIsPlaying(false);
      setConsensusLevel(summary.confidence || 100);
    };

    on('deliberation-update', handleDeliberationUpdate);
    on('deliberation-complete', handleDeliberationComplete);
  }, [socket, on]);

  // Fallback simulation when not connected to real deliberation
  useEffect(() => {
    if (!isPlaying || connected) {return;}

    const interval = setInterval(() => {
      setAgents(prev => prev.map(agent => {
        const statuses: AgentVisualization['status'][] = ['idle', 'thinking', 'speaking', 'listening', 'agreeing'];
        const randomStatus = statuses[Math.floor(deterministicFloat('deliberationvisualization-3') * statuses.length)];
        const newConfidence = Math.max(50, Math.min(100, agent.confidence + (deterministicFloat('deliberationvisualization-1') - 0.5) * 10));
        return {
          ...agent,
          status: deterministicFloat('deliberationvisualization-2') > 0.7 ? randomStatus : agent.status,
          confidence: Math.round(newConfidence),
        };
      }));

      setConsensusLevel(prev => Math.max(50, Math.min(100, prev + (deterministicFloat('deliberationvisualization-4') - 0.4) * 5)));
    }, 2000);

    return () => clearInterval(interval);
  }, [isPlaying, connected]);

  const speakingAgent = agents.find(a => a.status === 'speaking');
  const dissentingAgents = agents.filter(a => a.dissenting);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Eye className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Real-Time Deliberation Visualization</h1>
                <p className="text-indigo-200">Watch AI agents deliberate live</p>
              </div>
            </div>
            
            {/* Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <RotateCcw className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Status Bar */}
          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Round {currentRound} of {maxRounds}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{agents.length} Agents Active</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span>Consensus: {Math.round(consensusLevel)}%</span>
            </div>
            {dissentingAgents.length > 0 && (
              <div className="flex items-center gap-2 text-red-300">
                <AlertTriangle className="w-4 h-4" />
                <span>{dissentingAgents.length} Dissent{dissentingAgents.length > 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Visualization Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Agent Circle */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Council Chamber
              </h2>
              
              {/* Circular Agent Layout */}
              <div className="relative h-80 flex items-center justify-center">
                {/* Center - Consensus Indicator */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{Math.round(consensusLevel)}%</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Consensus</span>
                  </div>
                </div>

                {/* Agents positioned in a circle */}
                {agents.map((agent, index) => {
                  const angle = (index / agents.length) * 2 * Math.PI - Math.PI / 2;
                  const radius = 120;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <div
                      key={agent.id}
                      className="absolute transition-all duration-500"
                      style={{
                        transform: `translate(${x}px, ${y}px)`,
                      }}
                    >
                      <div className="relative">
                        <SpeechBubble agent={agent} />
                        <AgentAvatar agent={agent} />
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{agent.name.replace('Cendia', '')}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{agent.confidence}%</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Currently Speaking */}
            {speakingAgent && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${speakingAgent.avatarColor} flex items-center justify-center text-white font-bold`}>
                    {speakingAgent.name.charAt(6)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900 dark:text-white">{speakingAgent.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">is speaking...</span>
                      <MessageCircle className="w-4 h-4 text-blue-500 animate-pulse" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{speakingAgent.currentStatement}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Consensus Meter */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Consensus Level
              </h3>
              <div className="space-y-4">
                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${consensusLevel}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Divergent</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{Math.round(consensusLevel)}%</span>
                  <span className="text-gray-500 dark:text-gray-400">Aligned</span>
                </div>
              </div>
            </div>

            {/* Agent Confidence Levels */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Agent Confidence
              </h3>
              <div className="space-y-3">
                {agents.map(agent => (
                  <ConfidenceMeter key={agent.id} value={agent.confidence} label={agent.name.replace('Cendia', '')} />
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {timeline.map(event => (
                  <div key={event.id} className="flex items-start gap-3 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      event.type === 'dissent' ? 'bg-red-500' :
                      event.type === 'agreement' ? 'bg-green-500' :
                      event.type === 'citation' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{event.agentName}</span>
                      <p className="text-gray-500 dark:text-gray-400 line-clamp-2">{event.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliberationVisualizationPage;
