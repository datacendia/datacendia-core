// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — USER INTERVENTION PANEL
// =============================================================================
// Mid-deliberation input interface. Allows human users to inject context,
// redirect agent focus, override positions, or add constraints during live deliberations.

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Brain, Send, AlertTriangle, MessageSquare, ChevronRight, Clock,
  Users, Zap, Shield, Target, Hand, Pause, Play, RotateCcw,
} from 'lucide-react';

type InterventionType = 'context' | 'redirect' | 'override' | 'constraint' | 'escalate';

interface Intervention {
  id: string;
  type: InterventionType;
  message: string;
  timestamp: Date;
  appliedTo: string[];
  status: 'pending' | 'applied' | 'acknowledged';
}

const INTERVENTION_TYPES: { id: InterventionType; label: string; description: string; icon: React.FC<{ className?: string }>; color: string }[] = [
  { id: 'context', label: 'Add Context', description: 'Provide additional information agents may not have', icon: MessageSquare, color: 'text-blue-400' },
  { id: 'redirect', label: 'Redirect Focus', description: 'Shift agent attention to a specific aspect', icon: Target, color: 'text-purple-400' },
  { id: 'override', label: 'Override Position', description: 'Manually override an agent position with justification', icon: Hand, color: 'text-amber-400' },
  { id: 'constraint', label: 'Add Constraint', description: 'Inject a new constraint agents must consider', icon: Shield, color: 'text-green-400' },
  { id: 'escalate', label: 'Escalate', description: 'Flag for immediate human review — pauses deliberation', icon: AlertTriangle, color: 'text-red-400' },
];

interface LiveAgent {
  id: string;
  role: string;
  status: 'deliberating' | 'waiting' | 'concluded';
  currentPosition: string;
  confidence: number;
}

const DEMO_AGENTS: LiveAgent[] = [
  { id: 'strategist', role: 'Strategic Advisor', status: 'deliberating', currentPosition: 'Recommending phased approach', confidence: 85 },
  { id: 'risk', role: 'Risk Assessor', status: 'deliberating', currentPosition: 'Flagging vendor lock-in risk', confidence: 72 },
  { id: 'financial', role: 'Financial Analyst', status: 'waiting', currentPosition: 'NPV analysis complete — positive', confidence: 88 },
  { id: 'compliance', role: 'Compliance Officer', status: 'deliberating', currentPosition: 'Checking GDPR implications', confidence: 91 },
  { id: 'ethics', role: 'Ethics Guardian', status: 'concluded', currentPosition: 'No ethical concerns identified', confidence: 95 },
  { id: 'devil', role: "Devil's Advocate", status: 'deliberating', currentPosition: 'Challenging timeline assumptions', confidence: 68 },
  { id: 'ops', role: 'Operations Lead', status: 'waiting', currentPosition: 'Assessing infrastructure readiness', confidence: 80 },
];

export const UserInterventionPanel: React.FC = () => {
  const { deliberationId } = useParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState<InterventionType>('context');
  const [message, setMessage] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [interventions, setInterventions] = useState<Intervention[]>([]);
  const [agents] = useState<LiveAgent[]>(DEMO_AGENTS);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(342); // seconds

  useEffect(() => {
    if (!isPaused) {
      const timer = setInterval(() => setElapsed(e => e + 1), 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isPaused]);

  const handleSubmit = async () => {
    if (!message.trim()) {return;}
    const intervention: Intervention = {
      id: `int-${Date.now()}`,
      type: selectedType,
      message: message.trim(),
      timestamp: new Date(),
      appliedTo: selectedAgents.length > 0 ? selectedAgents : agents.map(a => a.id),
      status: 'pending',
    };

    // Send to backend
    if (deliberationId) {
      await apiClient.api.post(`/deliberations/${deliberationId}/intervene`, {
        type: selectedType,
        message: message.trim(),
        targetAgents: selectedAgents,
      });
    }

    setInterventions(prev => [intervention, ...prev]);
    setMessage('');
    setTimeout(() => {
      setInterventions(prev => prev.map(i => i.id === intervention.id ? { ...i, status: 'applied' } : i));
    }, 1500);
  };

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">The Council</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">User Intervention Panel</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Inject context, redirect agents, or override positions mid-deliberation</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700">
            <Clock className="w-4 h-4 text-neutral-400" />
            <span className="text-sm font-mono text-neutral-200">{formatTime(elapsed)}</span>
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className={cn(
              'px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 border',
              isPaused ? 'border-green-500/30 text-green-400 hover:bg-green-500/10' : 'border-amber-500/30 text-amber-400 hover:bg-amber-500/10'
            )}
          >
            {isPaused ? <><Play className="w-4 h-4" /> Resume</> : <><Pause className="w-4 h-4" /> Pause</>}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: Agent Status */}
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-700/50">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Live Agents
            </h3>
            <p className="text-[10px] text-neutral-500 mt-0.5">Click to target specific agents</p>
          </div>
          <div className="divide-y divide-neutral-800/50">
            {agents.map(agent => (
              <button
                key={agent.id}
                onClick={() => toggleAgent(agent.id)}
                className={cn(
                  'w-full px-5 py-3 text-left transition-colors',
                  selectedAgents.includes(agent.id) ? 'bg-blue-500/10' : 'hover:bg-neutral-800/30'
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-neutral-200">{agent.role}</span>
                  <span className={cn('w-2 h-2 rounded-full',
                    agent.status === 'deliberating' ? 'bg-green-400 animate-pulse' :
                    agent.status === 'waiting' ? 'bg-amber-400' : 'bg-neutral-600'
                  )} />
                </div>
                <p className="text-[10px] text-neutral-500 truncate">{agent.currentPosition}</p>
                <div className="mt-1 w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500/50 rounded-full" style={{ width: `${agent.confidence}%` }} />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Center: Intervention Input */}
        <div className="space-y-4">
          {/* Type Selector */}
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-4">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">Intervention Type</h3>
            <div className="space-y-2">
              {INTERVENTION_TYPES.map(type => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={cn(
                    'w-full p-3 rounded-lg border text-left transition-colors flex items-start gap-3',
                    selectedType === type.id
                      ? 'border-blue-500/30 bg-blue-500/5'
                      : 'border-neutral-700/50 hover:border-neutral-600'
                  )}
                >
                  <type.icon className={cn('w-4 h-4 mt-0.5 shrink-0', type.color)} />
                  <div>
                    <p className="text-xs font-semibold text-neutral-200">{type.label}</p>
                    <p className="text-[10px] text-neutral-500">{type.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Enter your ${selectedType} message...`}
              className="w-full h-24 bg-neutral-800/50 border border-neutral-700/50 rounded-lg p-3 text-sm text-neutral-200 placeholder:text-neutral-600 resize-none focus:outline-none focus:border-blue-500/50"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-[10px] text-neutral-600">
                {selectedAgents.length > 0 ? `Targeting ${selectedAgents.length} agent(s)` : 'Targeting all agents'}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!message.trim()}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2',
                  message.trim()
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
                )}
              >
                <Send className="w-4 h-4" /> Send Intervention
              </button>
            </div>
          </div>
        </div>

        {/* Right: Intervention History */}
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-neutral-700/50">
            <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Intervention Log
            </h3>
          </div>
          {interventions.length === 0 ? (
            <div className="p-8 text-center">
              <Hand className="w-8 h-8 text-neutral-700 mx-auto mb-2" />
              <p className="text-xs text-neutral-600">No interventions yet</p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800/50 max-h-[500px] overflow-y-auto">
              {interventions.map(int => (
                <div key={int.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-[10px] font-bold uppercase px-1.5 py-0.5 rounded',
                      int.type === 'context' ? 'bg-blue-500/10 text-blue-400' :
                      int.type === 'redirect' ? 'bg-purple-500/10 text-purple-400' :
                      int.type === 'override' ? 'bg-amber-500/10 text-amber-400' :
                      int.type === 'constraint' ? 'bg-green-500/10 text-green-400' :
                      'bg-red-500/10 text-red-400'
                    )}>{int.type}</span>
                    <span className={cn('text-[10px]',
                      int.status === 'applied' ? 'text-green-400' : int.status === 'pending' ? 'text-amber-400' : 'text-neutral-500'
                    )}>
                      {int.status === 'applied' ? '✓ Applied' : int.status === 'pending' ? '⏳ Pending' : 'Acknowledged'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-300">{int.message}</p>
                  <p className="text-[10px] text-neutral-600 mt-1">
                    {int.timestamp.toLocaleTimeString()} · {int.appliedTo.length} agent(s)
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInterventionPanel;
