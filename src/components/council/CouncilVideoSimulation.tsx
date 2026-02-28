// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * COUNCIL VIDEO SIMULATION - Realistic Multi-Agent Deliberation
 * Enterprise Platinum - Human-like avatars with animated deliberation
 */

import React, { useEffect, useState, useCallback } from 'react';
import { cn } from '../../lib/utils';
import { deterministicFloat, deterministicInt } from '../../lib/deterministic';
import { 
  Mic, MicOff, Video, VideoOff, Hand, ThumbsUp, ThumbsDown, 
  AlertTriangle, CheckCircle, XCircle, Clock, Users, Sparkles,
  MessageSquare, Volume2
} from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface CouncilMember {
  id: string;
  name: string;
  title: string;
  role: 'chief' | 'cfo' | 'coo' | 'ciso' | 'cmo' | 'cro' | 'clo' | 'chro' | 'cdo' | 'risk' | 'ethics' | 'devils-advocate';
  avatarSeed: string;
  status: 'idle' | 'speaking' | 'thinking' | 'voting' | 'agreed' | 'disagreed';
  vote?: 'approve' | 'reject' | 'abstain' | undefined;
  confidence?: number | undefined;
  currentStatement?: string | undefined;
  isMuted?: boolean | undefined;
  isVideoOff?: boolean | undefined;
  handRaised?: boolean | undefined;
}

interface DeliberationTopic {
  id: string;
  title: string;
  description: string;
  category: 'strategic' | 'operational' | 'financial' | 'risk' | 'compliance';
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

interface SimulationState {
  phase: 'intro' | 'presenting' | 'deliberating' | 'voting' | 'concluded';
  currentSpeaker?: string;
  elapsedTime: number;
  consensusLevel: number;
}

// =============================================================================
// COUNCIL MEMBER DATA
// =============================================================================

const COUNCIL_MEMBERS: CouncilMember[] = [
  { id: 'chief', name: 'Alexandra Chen', title: 'Chief Executive Officer', role: 'chief', avatarSeed: 'alexandra-chen-ceo', status: 'idle' },
  { id: 'cfo', name: 'Marcus Williams', title: 'Chief Financial Officer', role: 'cfo', avatarSeed: 'marcus-williams-cfo', status: 'idle' },
  { id: 'coo', name: 'Sarah Mitchell', title: 'Chief Operating Officer', role: 'coo', avatarSeed: 'sarah-mitchell-coo', status: 'idle' },
  { id: 'ciso', name: 'David Park', title: 'Chief Information Security Officer', role: 'ciso', avatarSeed: 'david-park-ciso', status: 'idle' },
  { id: 'cmo', name: 'Jennifer Lopez', title: 'Chief Marketing Officer', role: 'cmo', avatarSeed: 'jennifer-lopez-cmo', status: 'idle' },
  { id: 'clo', name: 'Robert Thompson', title: 'Chief Legal Officer', role: 'clo', avatarSeed: 'robert-thompson-clo', status: 'idle' },
  { id: 'chro', name: 'Michelle Obama', title: 'Chief Human Resources Officer', role: 'chro', avatarSeed: 'michelle-hr-chro', status: 'idle' },
  { id: 'risk', name: 'James Anderson', title: 'Chief Risk Officer', role: 'risk', avatarSeed: 'james-anderson-risk', status: 'idle' },
  { id: 'ethics', name: 'Dr. Emily Watson', title: 'Ethics & Compliance Officer', role: 'ethics', avatarSeed: 'emily-watson-ethics', status: 'idle' },
  { id: 'devils-advocate', name: 'Victor Reyes', title: "Devil's Advocate", role: 'devils-advocate', avatarSeed: 'victor-reyes-devil', status: 'idle' },
];

const DELIBERATION_STATEMENTS: Record<string, string[]> = {
  chief: [
    "I've reviewed the proposal and see significant strategic value here.",
    "Let's ensure we have alignment across all departments before proceeding.",
    "The long-term implications are what concern me most. Let's hear from Risk.",
  ],
  cfo: [
    "The financial projections look solid, but we need to stress-test the assumptions.",
    "I'm seeing a 23% IRR with acceptable payback period of 18 months.",
    "We should consider the impact on our Q4 guidance before committing.",
  ],
  coo: [
    "From an operational standpoint, we can execute this within the proposed timeline.",
    "Resource allocation will be tight, but manageable with proper prioritization.",
    "I'd recommend a phased rollout to minimize disruption.",
  ],
  ciso: [
    "Security implications need careful consideration here.",
    "I've identified three potential vulnerabilities that must be addressed.",
    "With proper controls in place, the risk profile is acceptable.",
  ],
  cmo: [
    "Market timing appears favorable for this initiative.",
    "Customer sentiment data supports moving forward.",
    "We should coordinate messaging carefully to maintain brand consistency.",
  ],
  clo: [
    "Legal review is complete. No significant compliance concerns identified.",
    "We'll need to update our contractual templates to reflect this change.",
    "Regulatory implications are manageable but require monitoring.",
  ],
  chro: [
    "The workforce impact assessment shows minimal disruption.",
    "We'll need to invest in training and change management.",
    "Employee sentiment is generally positive toward this direction.",
  ],
  risk: [
    "I've modeled three scenarios: base, optimistic, and stress case.",
    "Key risks include market volatility and execution complexity.",
    "Mitigation strategies are in place, but we should monitor closely.",
  ],
  ethics: [
    "From an ethical standpoint, this aligns with our values framework.",
    "Stakeholder impact analysis shows net positive outcomes.",
    "I recommend we establish clear governance guidelines.",
  ],
  'devils-advocate': [
    "Let me challenge some of the assumptions here.",
    "What happens if our key assumptions prove wrong?",
    "Have we considered the second and third-order effects?",
  ],
};

// =============================================================================
// AVATAR COMPONENT - Realistic Human-like
// =============================================================================

const RealisticAvatar: React.FC<{
  member: CouncilMember;
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}> = ({ member, size = 'md', showStatus = true }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
  };

  const statusColors = {
    idle: 'border-gray-600',
    speaking: 'border-emerald-500 ring-2 ring-emerald-500/50',
    thinking: 'border-amber-500 ring-2 ring-amber-500/50',
    voting: 'border-violet-500 ring-2 ring-violet-500/50',
    agreed: 'border-emerald-500',
    disagreed: 'border-red-500',
  };

  // Generate consistent avatar URL using DiceBear for realistic avatars
  const avatarUrl = `https://api.dicebear.com/7.x/personas/svg?seed=${member.avatarSeed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=50`;

  return (
    <div className="relative">
      <div className={cn(
        'rounded-full border-4 overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 transition-all duration-300',
        sizeClasses[size],
        statusColors[member.status]
      )}>
        <img 
          src={avatarUrl} 
          alt={member.name}
          className="w-full h-full object-cover"
        />
        
        {/* Speaking animation overlay */}
        {member.status === 'speaking' && (
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <div className="flex items-end gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full animate-pulse"
                  style={{
                    height: `${deterministicFloat('councilvideosimulation-5') * 12 + 4}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.5s',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Thinking animation */}
        {member.status === 'thinking' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status indicators */}
      {showStatus && (
        <>
          {member.isMuted && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <MicOff className="w-3 h-3 text-white" />
            </div>
          )}
          {member.handRaised && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center animate-bounce">
              <Hand className="w-3 h-3 text-white" />
            </div>
          )}
          {member.vote === 'approve' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center">
              <ThumbsUp className="w-3 h-3 text-white" />
            </div>
          )}
          {member.vote === 'reject' && (
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <ThumbsDown className="w-3 h-3 text-white" />
            </div>
          )}
        </>
      )}
    </div>
  );
};

// =============================================================================
// VIDEO TILE COMPONENT
// =============================================================================

const VideoTile: React.FC<{
  member: CouncilMember;
  isActive?: boolean;
  isMainSpeaker?: boolean;
}> = ({ member, isActive = false, isMainSpeaker = false }) => {
  return (
    <div className={cn(
      'relative rounded-xl overflow-hidden transition-all duration-300',
      isMainSpeaker ? 'col-span-2 row-span-2' : '',
      isActive ? 'ring-2 ring-emerald-500' : 'ring-1 ring-sovereign-border',
      'bg-gradient-to-br from-sovereign-elevated to-sovereign-base'
    )}>
      {/* Video background - simulated with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-gray-900/80" />
      
      {/* Avatar centered */}
      <div className="relative h-full flex flex-col items-center justify-center p-4">
        <RealisticAvatar 
          member={member} 
          size={isMainSpeaker ? 'lg' : 'md'} 
        />
        
        {/* Name plate */}
        <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full">
          <p className="text-xs font-medium text-white">{member.name}</p>
          <p className="text-[10px] text-gray-400 text-center">{member.title}</p>
        </div>

        {/* Speaking indicator */}
        {member.status === 'speaking' && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-1 bg-emerald-600/90 rounded-full">
            <Volume2 className="w-3 h-3 text-white animate-pulse" />
            <span className="text-[10px] text-white font-medium">Speaking</span>
          </div>
        )}

        {/* Confidence meter */}
        {member.confidence !== undefined && (
          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-black/60 rounded-full">
            <span className="text-[10px] text-gray-300">Confidence:</span>
            <span className={cn(
              'text-[10px] font-bold',
              member.confidence >= 80 ? 'text-emerald-400' :
              member.confidence >= 60 ? 'text-amber-400' : 'text-red-400'
            )}>
              {member.confidence}%
            </span>
          </div>
        )}
      </div>

      {/* Speech bubble */}
      {member.currentStatement && member.status === 'speaking' && (
        <div className="absolute bottom-16 left-4 right-4 p-3 bg-white/95 rounded-lg shadow-xl">
          <div className="flex items-start gap-2">
            <MessageSquare className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-800 leading-relaxed">
              "{member.currentStatement}"
            </p>
          </div>
          <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white/95 rotate-45" />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

interface CouncilVideoSimulationProps {
  topic?: DeliberationTopic;
  autoStart?: boolean;
  className?: string;
  onComplete?: (result: { approved: boolean; consensus: number }) => void;
}

export const CouncilVideoSimulation: React.FC<CouncilVideoSimulationProps> = ({
  topic,
  autoStart = true,
  className,
  onComplete,
}) => {
  const [members, setMembers] = useState<CouncilMember[]>(COUNCIL_MEMBERS);
  const [simulation, setSimulation] = useState<SimulationState>({
    phase: 'intro',
    elapsedTime: 0,
    consensusLevel: 0,
  });
  const [isRunning, setIsRunning] = useState(autoStart);

  const defaultTopic: DeliberationTopic = topic || {
    id: 'demo',
    title: 'Q1 Market Expansion Strategy',
    description: 'Proposal to expand into three new regional markets with $2.4M investment',
    category: 'strategic',
    urgency: 'high',
  };

  // Simulate speaking
  const simulateSpeaking = useCallback(() => {
    if (!isRunning) {return;}

    const speakerOrder = ['chief', 'cfo', 'risk', 'coo', 'ciso', 'cmo', 'clo', 'ethics', 'devils-advocate'];
    const currentIndex = simulation.elapsedTime % speakerOrder.length;
    const currentSpeakerId = speakerOrder[currentIndex];

    setMembers(prev => prev.map(m => {
      if (m.id === currentSpeakerId) {
        const statements = DELIBERATION_STATEMENTS[m.role] || DELIBERATION_STATEMENTS.chief;
        const statementIndex = Math.floor(deterministicFloat('councilvideosimulation-6') * statements.length);
        return {
          ...m,
          status: 'speaking' as const,
          currentStatement: statements[statementIndex],
          confidence: deterministicInt(0, 29, 'councilvideosimulation-1') + 70,
        };
      } else if (m.status === 'speaking') {
        return { ...m, status: 'idle' as const, currentStatement: undefined };
      }
      return m;
    }));

    setSimulation(prev => ({
      ...prev,
      currentSpeaker: currentSpeakerId,
      phase: 'deliberating',
      consensusLevel: Math.min(100, prev.consensusLevel + deterministicInt(0, 9, 'councilvideosimulation-2') + 5),
    }));
  }, [isRunning, simulation.elapsedTime]);

  // Voting phase
  const startVoting = useCallback(() => {
    setSimulation(prev => ({ ...prev, phase: 'voting' }));
    
    // Assign votes to members
    setMembers(prev => prev.map(m => ({
      ...m,
      status: 'voting' as const,
      vote: deterministicFloat('councilvideosimulation-3') > 0.2 ? 'approve' as const : (deterministicFloat('councilvideosimulation-4') > 0.5 ? 'reject' as const : 'abstain' as const),
    })));

    // Conclude after votes
    setTimeout(() => {
      setSimulation(prev => ({ ...prev, phase: 'concluded' }));
      const votes = members.filter(m => m.vote === 'approve').length;
      const consensus = (votes / members.length) * 100;
      onComplete?.({ approved: consensus >= 60, consensus });
    }, 3000);
  }, [members, onComplete]);

  // Main simulation loop
  useEffect(() => {
    if (!isRunning) {return;}

    const interval = setInterval(() => {
      setSimulation(prev => {
        const newTime = prev.elapsedTime + 1;
        
        // After 10 rounds, start voting
        if (newTime >= 10 && prev.phase === 'deliberating') {
          startVoting();
          return prev;
        }
        
        return { ...prev, elapsedTime: newTime };
      });

      if (simulation.phase === 'deliberating' || simulation.phase === 'intro') {
        simulateSpeaking();
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isRunning, simulation.phase, simulateSpeaking, startVoting]);

  // Initial speaker
  useEffect(() => {
    if (autoStart && simulation.phase === 'intro') {
      setTimeout(() => {
        simulateSpeaking();
      }, 2000);
    }
  }, [autoStart, simulation.phase, simulateSpeaking]);

  const currentSpeaker = members.find(m => m.id === simulation.currentSpeaker);
  const approvalCount = members.filter(m => m.vote === 'approve').length;
  const rejectCount = members.filter(m => m.vote === 'reject').length;

  return (
    <div className={cn('relative rounded-xl overflow-hidden bg-sovereign-base border border-sovereign-border', className)}>
      {/* Header */}
      <div className="p-4 border-b border-sovereign-border bg-gradient-to-r from-violet-900/20 to-cyan-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                Council Deliberation
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                <span className="text-[10px] text-red-400 font-normal">LIVE</span>
              </h3>
              <p className="text-xs text-gray-400">{defaultTopic.title}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(simulation.elapsedTime * 4 / 60)}:{String((simulation.elapsedTime * 4) % 60).padStart(2, '0')}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Consensus:</span>
              <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${simulation.consensusLevel}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">{simulation.consensusLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Topic Banner */}
      <div className="px-4 py-2 bg-gradient-to-r from-violet-900/30 to-transparent border-b border-sovereign-border">
        <div className="flex items-center gap-2">
          <span className={cn(
            'px-2 py-0.5 rounded text-[10px] font-medium uppercase',
            defaultTopic.urgency === 'critical' ? 'bg-red-900/50 text-red-400' :
            defaultTopic.urgency === 'high' ? 'bg-amber-900/50 text-amber-400' :
            'bg-cyan-900/50 text-cyan-400'
          )}>
            {defaultTopic.urgency}
          </span>
          <span className="text-xs text-gray-300">{defaultTopic.description}</span>
        </div>
      </div>

      {/* Video Grid */}
      <div className="p-4">
        <div className="grid grid-cols-5 gap-3" style={{ minHeight: '400px' }}>
          {members.map((member) => (
            <VideoTile
              key={member.id}
              member={member}
              isActive={member.status === 'speaking'}
              isMainSpeaker={member.id === simulation.currentSpeaker && simulation.phase === 'deliberating'}
            />
          ))}
        </div>
      </div>

      {/* Current Speaker Highlight */}
      {currentSpeaker && simulation.phase === 'deliberating' && (
        <div className="px-4 pb-4">
          <div className="p-4 bg-gradient-to-r from-emerald-900/30 to-cyan-900/30 rounded-lg border border-emerald-500/30">
            <div className="flex items-start gap-4">
              <RealisticAvatar member={currentSpeaker} size="sm" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">{currentSpeaker.name}</span>
                  <span className="text-xs text-gray-400">• {currentSpeaker.title}</span>
                </div>
                <p className="text-sm text-gray-200 leading-relaxed">
                  "{currentSpeaker.currentStatement}"
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-cyan-400">{currentSpeaker.confidence}% confident</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voting Results */}
      {simulation.phase === 'voting' || simulation.phase === 'concluded' && (
        <div className="px-4 pb-4">
          <div className={cn(
            'p-4 rounded-lg border',
            simulation.phase === 'concluded' && approvalCount > rejectCount
              ? 'bg-emerald-900/20 border-emerald-500/30'
              : simulation.phase === 'concluded'
              ? 'bg-red-900/20 border-red-500/30'
              : 'bg-violet-900/20 border-violet-500/30'
          )}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">
                {(simulation.phase as string) === 'voting' ? 'Voting in Progress...' : 'Decision Reached'}
              </span>
              {simulation.phase === 'concluded' && (
                <span className={cn(
                  'flex items-center gap-1 text-sm font-bold',
                  approvalCount > rejectCount ? 'text-emerald-400' : 'text-red-400'
                )}>
                  {approvalCount > rejectCount ? (
                    <><CheckCircle className="w-4 h-4" /> APPROVED</>
                  ) : (
                    <><XCircle className="w-4 h-4" /> REJECTED</>
                  )}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-5 h-5 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400">{approvalCount}</span>
                <span className="text-xs text-gray-400">Approve</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsDown className="w-5 h-5 text-red-400" />
                <span className="text-lg font-bold text-red-400">{rejectCount}</span>
                <span className="text-xs text-gray-400">Reject</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-gray-400" />
                <span className="text-lg font-bold text-gray-400">{members.length - approvalCount - rejectCount}</span>
                <span className="text-xs text-gray-400">Abstain</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="p-4 border-t border-sovereign-border bg-sovereign-elevated/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsRunning(!isRunning)}
              className={cn(
                'px-4 py-2 rounded-lg text-xs font-medium transition-colors',
                isRunning 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              )}
            >
              {isRunning ? 'Pause Simulation' : 'Start Simulation'}
            </button>
            <button className="p-2 rounded-lg bg-sovereign-elevated hover:bg-sovereign-border transition-colors">
              <Video className="w-4 h-4 text-gray-400" />
            </button>
            <button className="p-2 rounded-lg bg-sovereign-elevated hover:bg-sovereign-border transition-colors">
              <Mic className="w-4 h-4 text-gray-400" />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{members.length} Participants</span>
            <span>•</span>
            <span>Phase: {simulation.phase.charAt(0).toUpperCase() + simulation.phase.slice(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilVideoSimulation;
