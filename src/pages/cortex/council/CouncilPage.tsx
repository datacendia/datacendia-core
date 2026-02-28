// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - THE COUNCIL PAGE (Real Ollama Integration)
// =============================================================================

// File: src/pages/cortex/council/CouncilPage.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { councilApi } from '../../../lib/api';
import { ollamaService, type DomainAgent } from '../../../lib/ollama';
import { sovereignApi, enterpriseApi, vaultApi } from '../../../lib/sovereignApi';
import { COUNCIL_MODES } from '../../../data/councilModes';
import { ledgerService } from '../../../services/LedgerService';
import { useLanguage } from '@/contexts/LanguageContext';
import PremiumFeaturesModal from '../../../components/premium/PremiumFeaturesModal';
import { usePremiumFeatures } from '../../../hooks/usePremiumFeatures';
import { PageGuide, GUIDES } from '../../../components/PageGuide';
import { WorkflowPicker } from '../../../components/council/WorkflowPicker';
import councilPacketApi from '../../../services/CouncilPacketService';
import { useWebSocket } from '@/hooks/useWebSocket';

// =============================================================================
// TYPES
// =============================================================================

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  // Premium add-on fields
  premium?: boolean;
  premiumPackage?: string;
  premiumPrice?: string;
  // Custom agent fields
  isCustom?: boolean;
  systemPrompt?: string;
}

interface Deliberation {
  id: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  phase: string;
  agents: string[];
  startedAt: Date;
  completedAt?: Date;
  confidence?: number;
}

interface AgentResponse {
  agentId: string;
  agentName: string;
  agentAvatar: string;
  agentColor: string;
  agentRole: string;
  response: string;
  duration: number;
  isStreaming?: boolean;
  timestamp?: number; // When the response was received (ms since epoch)
  reactions?: Record<string, number>; // emoji -> count
}

interface UserMessage {
  id: string;
  content: string;
  timestamp: number;
  targetAgentId?: string; // If replying to specific agent
}

interface CrossExamination {
  challengerId: string;
  challengerName: string;
  challengerAvatar: string;
  challengerColor: string;
  targetId: string;
  targetName: string;
  challenge: string;
  rebuttal: string;
}

interface QueryResult {
  id: string;
  query: string;
  response: string; // Final synthesis
  confidence: number;
  agents: { id: string; name: string }[];
  agentResponses: AgentResponse[]; // Individual agent responses
  crossExaminations: CrossExamination[]; // Cross-examination threads
  userMessages: UserMessage[]; // Human user interjections
  answeredAt: Date;
  mode: 'quick' | 'deliberation';
  currentPhase?: string;
}


// =============================================================================
// EMOJI PICKER FOR CUSTOM AGENTS
// =============================================================================
const AGENT_EMOJIS = [
  '🧠',
  '💡',
  '🎯',
  '📊',
  '💼',
  '🔧',
  '⚡',
  '🌟',
  '🎨',
  '📈',
  '🔬',
  '🏆',
  '🛡️',
  '⚙️',
  '💰',
  '📋',
  '🔎',
  '🎓',
  '🌐',
  '🤝',
  '📱',
  '🖥️',
  '🔐',
  '📦',
  '🚀',
  '💎',
  '🏭',
  '🌱',
  '⚖️',
  '🔔',
  '📝',
  '🎪',
  '🧪',
  '🔮',
  '🎭',
  '🏛️',
  '🌍',
  '🤖',
  '👤',
  '👥',
];

const AGENT_COLORS = [
  '#6366F1',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#EC4899',
  '#8B5CF6',
  '#06B6D4',
  '#F97316',
  '#14B8A6',
  '#3B82F6',
  '#A855F7',
  '#22C55E',
  '#0EA5E9',
  '#D946EF',
  '#84CC16',
  '#F43F5E',
  '#7C3AED',
  '#0D9488',
];

// =============================================================================
// CUSTOM AGENT CREATOR MODAL
// =============================================================================
const CustomAgentCreator: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (agent: Agent) => void;
  onDelete?: (agentId: string) => void;
  editingAgent: Agent | null;
  t: (key: string) => string;
}> = ({ isOpen, onClose, onSave, onDelete, editingAgent, t }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [expertise, setExpertise] = useState('');
  const [avatar, setAvatar] = useState('🧠');
  const [color, setColor] = useState('#6366F1');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [newCapability, setNewCapability] = useState('');

  // Load editing agent data
  useEffect(() => {
    if (editingAgent) {
      setName(editingAgent.name);
      setRole(editingAgent.role);
      setDescription(editingAgent.description);
      setAvatar(editingAgent.avatar);
      setColor(editingAgent.color);
      setCapabilities(editingAgent.capabilities || []);
      // Extract expertise from system prompt if custom agent
      const customData = (editingAgent as any).systemPrompt;
      if (customData) {
        setExpertise(customData);
      }
    } else {
      // Reset form
      setName('');
      setRole('');
      setDescription('');
      setExpertise('');
      setAvatar('🧠');
      setColor('#6366F1');
      setCapabilities([]);
    }
  }, [editingAgent, isOpen]);

  const addCapability = () => {
    if (newCapability.trim() && capabilities.length < 6) {
      setCapabilities([...capabilities, newCapability.trim()]);
      setNewCapability('');
    }
  };

  const removeCapability = (index: number) => {
    setCapabilities(capabilities.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!name.trim() || !role.trim()) {
      return;
    }

    const agent: Agent & { systemPrompt?: string; isCustom?: boolean } = {
      id: editingAgent?.id || `custom-agent-${Date.now()}`,
      code: editingAgent?.code || `custom-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      description: description.trim() || `Custom agent: ${role}`,
      avatar,
      color,
      status: 'online',
      capabilities: capabilities.length > 0 ? capabilities : [role],
      isCustom: true,
      systemPrompt:
        expertise.trim() ||
        `You are ${name}, a custom AI agent. Your role is: ${role}. ${description}`,
    };

    onSave(agent as Agent);
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-neutral-900">
                  {editingAgent
                    ? t('council.customAgent.editTitle')
                    : `✨ ${t('council.customAgent.title')}`}
                </h2>
                <span className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  ⭐ PREMIUM
                </span>
              </div>
              <p className="text-neutral-600">{t('council.customAgent.subtitle')}</p>
              <p className="text-xs text-purple-600 font-medium mt-1">
                Agent Builder Pack • $199/month
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-lg text-neutral-500">
              ✕
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Avatar & Color Selection */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.avatar')}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg max-h-32 overflow-y-auto">
                {AGENT_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setAvatar(emoji)}
                    className={cn(
                      'w-10 h-10 text-xl rounded-lg flex items-center justify-center transition-all',
                      avatar === emoji
                        ? 'bg-primary-500 shadow-md scale-110'
                        : 'bg-white hover:bg-neutral-100'
                    )}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.color')}
              </label>
              <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 rounded-lg">
                {AGENT_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-10 h-10 rounded-lg transition-all',
                      color === c ? 'ring-2 ring-offset-2 ring-neutral-900 scale-110' : ''
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="p-4 bg-neutral-50 rounded-xl flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${color}20` }}
            >
              {avatar}
            </div>
            <div>
              <h3 className="font-semibold text-neutral-900">{name || 'Agent Name'}</h3>
              <p className="text-sm text-neutral-500">{role || 'Agent Role'}</p>
            </div>
          </div>

          {/* Name & Role */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.name')} *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Market Analyst"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                {t('council.customAgent.role')} *
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Market Research & Analysis"
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={100}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              {t('council.customAgent.description')}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('council.customAgent.descriptionPlaceholder')}
              rows={2}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              maxLength={200}
            />
          </div>

          {/* Expertise / System Prompt */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              {t('council.customAgent.expertise')}
            </label>
            <textarea
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Define the agent's expertise, knowledge areas, and how it should respond..."
              rows={5}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none font-mono text-sm"
            />
          </div>

          {/* Capabilities */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Capabilities (up to 6)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newCapability}
                onChange={(e) => setNewCapability(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCapability()}
                placeholder="e.g., Market Analysis"
                className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                maxLength={30}
              />
              <button
                onClick={addCapability}
                disabled={capabilities.length >= 6}
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm flex items-center gap-2"
                >
                  {cap}
                  <button onClick={() => removeCapability(i)} className="hover:text-red-500">
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
          <div>
            {editingAgent && onDelete && (
              <button
                onClick={() => {
                  if (confirm('Delete this custom agent?')) {
                    onDelete(editingAgent.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Delete Agent
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!name.trim() || !role.trim()}
              className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 font-medium"
            >
              {editingAgent ? 'Save Changes' : 'Create Agent'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// SUB-COMPONENTS
// =============================================================================

// Agent Card with translations
const AgentCard: React.FC<{
  agent: Agent;
  isSelected: boolean;
  onSelect: () => void;
  onEdit?: () => void;
  onUnlock?: () => void;
  isLocked?: boolean;
  compact?: boolean;
}> = ({ agent, isSelected, onSelect, onEdit, onUnlock, isLocked = false, compact = false }) => {
  const { t } = useLanguage();

  // Get translated name/role/description, fallback to agent data
  const displayName =
    t(`agent.${agent.code}.name`) !== `agent.${agent.code}.name`
      ? t(`agent.${agent.code}.name`)
      : agent.name;
  const displayRole =
    t(`agent.${agent.code}.role`) !== `agent.${agent.code}.role`
      ? t(`agent.${agent.code}.role`)
      : agent.role;
  const displayDescription =
    t(`agent.${agent.code}.description`) !== `agent.${agent.code}.description`
      ? t(`agent.${agent.code}.description`)
      : agent.description;
  return (
    <button
      onClick={isLocked ? onUnlock : onSelect}
      className={cn(
        'relative p-4 rounded-xl border-2 transition-all text-left w-full',
        isLocked
          ? 'border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400'
          : isSelected
            ? 'border-primary-500 bg-primary-50'
            : agent.premium
              ? 'border-amber-300 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-400 hover:shadow-md'
              : agent.isCustom
                ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md'
                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm'
      )}
    >
      {/* Locked Overlay */}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
          <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
            <span>🔒</span>
            <span className="text-xs font-semibold text-neutral-700">Unlock</span>
          </div>
        </div>
      )}

      {/* Premium Badge */}
      {agent.premium && (
        <div
          className={cn(
            'absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1',
            isLocked
              ? 'bg-gradient-to-r from-neutral-400 to-neutral-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          )}
        >
          <span>{isLocked ? '🔒' : '👑'}</span>
          <span>{isLocked ? 'LOCKED' : 'PREMIUM'}</span>
        </div>
      )}

      {/* Custom Badge */}
      {agent.isCustom && !agent.premium && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1">
          <span>✨</span>
          <span>CUSTOM</span>
        </div>
      )}

      {/* Edit button for custom agents */}
      {agent.isCustom && onEdit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="absolute top-3 left-3 w-6 h-6 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center text-purple-600 text-xs transition-colors"
          title="Edit agent"
        >
          ✏️
        </button>
      )}

      {/* Status indicator */}
      <div
        className={cn(
          'absolute top-3 right-3 w-2.5 h-2.5 rounded-full',
          (agent.premium || agent.isCustom) && 'top-5', // Move down if badge present
          agent.status === 'online' && 'bg-success-main',
          agent.status === 'offline' && 'bg-neutral-300',
          agent.status === 'busy' && 'bg-warning-main'
        )}
      />

      {/* Avatar */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
        style={{ backgroundColor: `${agent.color}20` }}
      >
        {agent.avatar}
      </div>

      {/* Info - Using translated values */}
      <h3 className="font-semibold text-neutral-900">{displayName}</h3>
      <p className="text-sm text-neutral-500">{displayRole}</p>

      {!compact && (
        <>
          <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{displayDescription}</p>
          {agent.premium && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                {agent.premiumPackage}
              </span>
              <span className="text-[10px] text-amber-600 font-semibold">{agent.premiumPrice}</span>
            </div>
          )}
        </>
      )}
    </button>
  );
};

// Deliberation Card
const DeliberationCard: React.FC<{
  deliberation: Deliberation;
  agents: Agent[];
  onClick: () => void;
}> = ({ deliberation, agents, onClick }) => {
  const phaseLabels: Record<string, string> = {
    initial_analysis: 'Initial Analysis',
    cross_examination: 'Cross-Examination',
    synthesis: 'Synthesis',
    ethics_check: 'Ethics Check',
  };

  const phaseProgress: Record<string, number> = {
    initial_analysis: 25,
    cross_examination: 50,
    synthesis: 75,
    ethics_check: 90,
  };

  const participatingAgents = agents.filter((a) => deliberation.agents.includes(a.id));

  return (
    <button
      onClick={onClick}
      className="w-full p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-sm transition-all text-left"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">🔄</span>
            <span className="text-sm font-medium text-primary-600">
              {phaseLabels[deliberation.phase] || deliberation.phase}
            </span>
          </div>
          <h3 className="font-medium text-neutral-900 line-clamp-2">"{deliberation.question}"</h3>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-neutral-100 rounded-full mb-3">
        <div
          className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${phaseProgress[deliberation.phase] || 50}%` }}
        />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex -space-x-2">
          {participatingAgents.slice(0, 4).map((agent) => (
            <div
              key={agent.id}
              className="w-7 h-7 rounded-full flex items-center justify-center text-sm border-2 border-white"
              style={{ backgroundColor: `${agent.color}20` }}
              title={agent.name}
            >
              {agent.avatar}
            </div>
          ))}
          {participatingAgents.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-neutral-100 flex items-center justify-center text-xs text-neutral-600 border-2 border-white">
              +{participatingAgents.length - 4}
            </div>
          )}
        </div>
        <span className="text-neutral-400">{formatRelativeTime(deliberation.startedAt)}</span>
      </div>
    </button>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

async function safeJson<T = any>(res: any, context: string): Promise<T> {
  if (!res) {
    throw new Error(`Empty response for ${context}`);
  }

  if (res.success === false && res.error) {
    const message = res.error.message || res.error.code || 'Unknown error';
    throw new Error(`Request failed for ${context}: ${message}`);
  }

  if (res.data !== undefined) {
    return res.data as T;
  }

  return res as T;
}

// Mode translation helper
const MODE_TRANSLATIONS: Record<string, Record<string, { name: string; directive: string }>> = {
  es: {
    'war-room': { name: 'Sala de Guerra', directive: 'Conflicto antes del Consenso' },
    rapid: { name: 'Decisión Rápida', directive: 'Velocidad con Datos' },
    'due-diligence': { name: 'Debida Diligencia', directive: 'Verificar Todo' },
    'innovation-lab': {
      name: 'Laboratorio de Innovación',
      directive: 'Posibilidades antes de Restricciones',
    },
    crisis: { name: 'Crisis', directive: 'Contener y Comunicar' },
    execution: { name: 'Ejecución', directive: 'Plazos son Ley' },
    governance: { name: 'Gobernanza', directive: 'Proceso Protege' },
    compliance: { name: 'Cumplimiento', directive: 'Letra de la Ley' },
    research: { name: 'Investigación', directive: 'Datos Impulsan Decisiones' },
  },
};

export const CouncilPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryInputRef = useRef<HTMLTextAreaElement>(null);
  const { t, language } = useLanguage();

  // Helper to get translated mode name
  const getModeName = (modeId: string) => {
    if (language !== 'en' && MODE_TRANSLATIONS[language]?.[modeId]) {
      return MODE_TRANSLATIONS[language][modeId].name;
    }
    return COUNCIL_MODES[modeId]?.name || modeId;
  };

  const getModeDirective = (modeId: string) => {
    if (language !== 'en' && MODE_TRANSLATIONS[language]?.[modeId]) {
      return MODE_TRANSLATIONS[language][modeId].directive;
    }
    return COUNCIL_MODES[modeId]?.primeDirective || '';
  };

  // State
  const [agents, setAgents] = useState<Agent[]>([]);
  const [deliberations, setDeliberations] = useState<Deliberation[]>([]);
  // Persist deliberation state in localStorage to survive navigation
  const [recentDecisions, setRecentDecisions] = useState<QueryResult[]>(() => {
    try {
      const saved = localStorage.getItem('council_deliberations');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Service integration panel state
  const [showServicePanel, setShowServicePanel] = useState(false);
  const [activeService, setActiveService] = useState<string | null>(null);
  const [serviceResults, setServiceResults] = useState<any>(null);
  
  // Save deliberations to localStorage whenever they change
  useEffect(() => {
    if (recentDecisions.length > 0) {
      try {
        localStorage.setItem('council_deliberations', JSON.stringify(recentDecisions.slice(0, 5)));
      } catch (e) {
        console.warn('Failed to save deliberations to localStorage:', e);
      }
    }
  }, [recentDecisions]);

  const [queryInput, setQueryInput] = useState(searchParams.get('q') || '');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [queryMode, setQueryMode] = useState<'quick' | 'deliberation'>('quick');
  const [selectedMode, setSelectedMode] = useState<string>('war-room');
  const [contextFromPage, setContextFromPage] = useState<{
    sourcePage: string;
    contextSummary: string;
    contextData?: Record<string, any>;
  } | null>(null);
  const [showModesLibrary, setShowModesLibrary] = useState(false);
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showWorkflowPicker, setShowWorkflowPicker] = useState(false);
  const modesLibraryRef = useRef<HTMLDivElement>(null);

  // Document attachments for deliberation
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [extractedContent, setExtractedContent] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drop to Deliberate - Drag & Drop state
  const [isDragging, setIsDragging] = useState(false);
  const [droppedFile, setDroppedFile] = useState<File | null>(null);
  const [agentActivations, setAgentActivations] = useState<
    Record<string, { status: string; color: string }>
  >({});
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Custom Agent Creator
  const [showAgentCreator, setShowAgentCreator] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  
  // Interactive circular diagram - selected agent for personality display
  const [highlightedAgent, setHighlightedAgent] = useState<Agent | null>(null);

  // Collapsible agent sections
  const [expandedAgentSections, setExpandedAgentSections] = useState<Record<string, boolean>>({
    audit: false,
    healthcare: false,
    finance: false,
    legal: false,
    custom: false,
  });

  const toggleAgentSection = (section: string) => {
    setExpandedAgentSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Premium Features Modal & Hook
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showPantheon, setShowPantheon] = useState(false);
  const premium = usePremiumFeatures();

  // Policy-based permissions (Casbin integration)
  const [canVeto, setCanVeto] = useState(false);
  const [canApprove, setCanApprove] = useState(false);
  const [policyReason, setPolicyReason] = useState('');

  // Check user permissions on mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const [vetoResult, approveResult] = await Promise.all([
          enterpriseApi.canVetoDecision('strategic'),
          enterpriseApi.canApproveDecision('operational'),
        ]);
        setCanVeto(vetoResult.allowed);
        setCanApprove(approveResult.allowed);
        setPolicyReason(vetoResult.reason || approveResult.reason || '');
      } catch (error) {
        // Default to NOT showing governance badge if policy service unavailable
        setCanVeto(false);
        setCanApprove(false);
      }
    };
    checkPermissions();
  }, []);

  // Pick up context from other pages (e.g., Chronos, Ledger, Witness)
  useEffect(() => {
    const fromContext = searchParams.get('fromContext');
    if (fromContext === 'true') {
      try {
        const storedContext = sessionStorage.getItem('councilQueryContext');
        if (storedContext) {
          const ctx = JSON.parse(storedContext);
          // Pre-fill the question
          if (ctx.question) {
            setQueryInput(ctx.question);
          }
          // Set suggested mode if provided
          if (ctx.suggestedMode && COUNCIL_MODES[ctx.suggestedMode]) {
            setSelectedMode(ctx.suggestedMode);
          }
          // Store context for display
          if (ctx.contextSummary || ctx.sourcePage) {
            setContextFromPage({
              sourcePage: ctx.sourcePage || 'Unknown',
              contextSummary: ctx.contextSummary || '',
              contextData: ctx.contextData,
            });
          }
          // Clear the stored context
          sessionStorage.removeItem('councilQueryContext');
          // Focus the input
          setTimeout(() => queryInputRef.current?.focus(), 100);
        }
      } catch (e) {
        console.warn('Failed to parse council query context:', e);
      }
    }
  }, [searchParams]);

  // Support direct URL prefill (e.g., /cortex/council?q=...&mode=crisis)
  useEffect(() => {
    const fromContext = searchParams.get('fromContext');
    if (fromContext === 'true') {
      return;
    }

    const q = searchParams.get('q') || searchParams.get('question');
    const mode = searchParams.get('mode');
    const vertical = searchParams.get('vertical');
    const matter = searchParams.get('matter');

    // Legacy params coming from older links (/cortex/intelligence/council?...) and deep links
    const briefing = searchParams.get('briefing');
    const context = searchParams.get('context');
    const escalate = searchParams.get('escalate');
    const appeal = searchParams.get('appeal');
    const assembly = searchParams.get('assembly');

    // Handle vertical-specific agent selection
    if (vertical === 'legal') {
      // Select legal-specific agents (from LEGAL_AGENTS in src/lib/ollama/agents/legal.ts)
      // Matter Lead = judge (arbiter), Research = clo, Litigation = prosecutor, Risk = defense-attorney, Red Team = juror-skeptic
      const legalAgentIds = ['agent-clo', 'agent-judge', 'agent-prosecutor', 'agent-defense-attorney', 'agent-juror-skeptic'];
      setSelectedAgents(legalAgentIds);
      if (!mode) {
        setSelectedMode('legal-research');
      }
      if (matter && !q) {
        setQueryInput(matter);
      }
    }

    if (mode && COUNCIL_MODES[mode]) {
      setSelectedMode(mode);
    }

    if (q) {
      setQueryInput(q);
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }

    // If q/question not provided, derive a reasonable prompt from legacy params
    if (escalate) {
      if (!mode && COUNCIL_MODES['crisis']) {
        setSelectedMode('crisis');
      }
      setQueryInput(
        `Escalation request (${escalate}). Assess severity, likely root causes, immediate containment actions, and a 24-hour plan.`
      );
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }

    if (appeal) {
      if (!mode && COUNCIL_MODES['due-diligence']) {
        setSelectedMode('due-diligence');
      }
      setQueryInput(
        `Appeal request (${appeal}). Re-evaluate the decision with explicit pros/cons, risk posture, and recommended next steps.`
      );
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }

    if (briefing) {
      if (!mode && COUNCIL_MODES['executive']) {
        setSelectedMode('executive');
      }
      setQueryInput(`Provide an executive briefing on: ${briefing}`);
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }

    if (context) {
      setQueryInput(`Deliberate on this context: ${context}. Provide analysis and recommended actions.`);
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }

    if (assembly === 'true') {
      setQueryInput('Assemble the Council for a full deliberation. Propose the agenda, key questions, and decision criteria.');
      setTimeout(() => queryInputRef.current?.focus(), 100);
      return;
    }
  }, [searchParams]);

  // Handle premium purchase (simulated - would integrate with Stripe in production)
  const handlePremiumPurchase = (itemId: string, type: 'feature' | 'bundle') => {
    if (type === 'feature') {
      premium.purchaseFeature(itemId);
      alert(`✅ ${itemId} activated! Thank you for your purchase.`);
    } else {
      premium.purchaseBundle(itemId);
      alert(`🎉 Bundle ${itemId} activated! All included features are now available.`);
    }
  };
  const [customAgents, setCustomAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('datacendia_custom_agents');
    return saved ? JSON.parse(saved) : [];
  });

  // Save custom agents to localStorage
  useEffect(() => {
    localStorage.setItem('datacendia_custom_agents', JSON.stringify(customAgents));
  }, [customAgents]);

  // Auto-select relevant agents when mode changes
  useEffect(() => {
    const mode = COUNCIL_MODES[selectedMode];
    if (mode?.defaultAgents) {
      // Convert agent codes to agent IDs (e.g., 'chief' -> 'agent-chief')
      const defaultAgentIds = mode.defaultAgents.map((code) => `agent-${code}`);
      setSelectedAgents(defaultAgentIds);
    }
  }, [selectedMode]);

  // Load agents from Ollama service
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Check Ollama availability and get agents
        await ollamaService.checkAvailability();
        const ollamaAgents = ollamaService.getAgents();

        setAgents(
          ollamaAgents.map((a: DomainAgent) => ({
            id: a.id,
            code: a.code,
            name: a.name,
            role: a.role,
            description: a.description,
            avatar: a.avatar,
            color: a.color,
            status: a.status,
            capabilities: a.capabilities,
            ...(a.premium !== undefined && { premium: a.premium }),
            ...(a.premiumPackage !== undefined && { premiumPackage: a.premiumPackage }),
            ...(a.premiumPrice !== undefined && { premiumPrice: a.premiumPrice }),
          }))
        );

        const status = ollamaService.getStatus();
        if (!status.available) {
          setError(
            'Ollama is not running. Please start Ollama to enable AI agents. Run: ollama serve'
          );
        } else {
          // Pre-warm all models in background for instant deliberations
          console.log('[Council] Pre-warming models in background...');
          ollamaService.preWarmModels((model, index, total) => {
            console.log(`[Council] Warming model ${index}/${total}: ${model}`);
          }).then(() => {
            console.log('[Council] All models pre-warmed - deliberations will be instant');
          });
        }
      } catch (err) {
        setError('Failed to connect to Ollama. Please ensure Ollama is running on localhost:11434');
        console.error('Ollama connection error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();

    // Refresh agent status every 10 seconds
    const interval = setInterval(async () => {
      await ollamaService.checkAvailability();
      const ollamaAgents = ollamaService.getAgents();
      setAgents(
        ollamaAgents.map((a: DomainAgent) => ({
          id: a.id,
          code: a.code,
          name: a.name,
          role: a.role,
          description: a.description,
          avatar: a.avatar,
          color: a.color,
          status: a.status,
          capabilities: a.capabilities,
          ...(a.premium !== undefined && { premium: a.premium }),
          ...(a.premiumPackage !== undefined && { premiumPackage: a.premiumPackage }),
          ...(a.premiumPrice !== undefined && { premiumPrice: a.premiumPrice }),
        }))
      );
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const toggleAgentSelection = (agentId: string) => {
    setSelectedAgents((prev) =>
      prev.includes(agentId) ? prev.filter((id) => id !== agentId) : [...prev, agentId]
    );
  };

  const selectAllAgents = () => {
    const allAgentsList = [...agents, ...customAgents];
    const onlineAgents = allAgentsList.filter((a) => a.status === 'online').map((a) => a.id);
    setSelectedAgents(onlineAgents);
  };

  // Combined agents list (Ollama agents + Custom agents)
  const allAgents = [...agents, ...customAgents];

  // Custom Agent Management Functions
  const handleSaveCustomAgent = (agent: Agent) => {
    setCustomAgents((prev) => {
      const existingIndex = prev.findIndex((a) => a.id === agent.id);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = agent;
        return updated;
      }
      // Add new
      return [...prev, agent];
    });
  };

  const handleDeleteCustomAgent = (agentId: string) => {
    setCustomAgents((prev) => prev.filter((a) => a.id !== agentId));
    setSelectedAgents((prev) => prev.filter((id) => id !== agentId));
  };

  const handleEditCustomAgent = (agent: Agent) => {
    setEditingAgent(agent);
    setShowAgentCreator(true);
  };

  // ==========================================================================
  // DROP TO DELIBERATE - File Type Detection & Agent Auto-Wake
  // ==========================================================================

  const detectFileTypeAndWakeAgents = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const mimeType = file.type.toLowerCase();

    // Define which agents wake up for which file types
    const activations: Record<string, { status: string; color: string }> = {};

    // Legal/Contract Documents (PDF, DOCX)
    if (
      ['pdf', 'docx', 'doc'].includes(ext) ||
      mimeType.includes('pdf') ||
      mimeType.includes('word')
    ) {
      activations['risk'] = { status: 'Analyzing Risk Clauses', color: '#F97316' };
      activations['ciso'] = { status: 'Scanning Security Terms', color: '#EF4444' };
      activations['cfo'] = { status: 'Reviewing Financial Terms', color: '#10B981' };
      activations['chief'] = { status: 'Strategic Assessment', color: '#6366F1' };
      // Auto-select Deal Room mode for contracts
      setSelectedMode('deal-room');
    }

    // Financial Data (CSV, XLSX, XLS)
    if (
      ['csv', 'xlsx', 'xls'].includes(ext) ||
      mimeType.includes('spreadsheet') ||
      mimeType.includes('csv')
    ) {
      activations['cfo'] = { status: 'Parsing Financial Data', color: '#10B981' };
      activations['cdo'] = { status: 'Analyzing Data Structure', color: '#06B6D4' };
      activations['cro'] = { status: 'Revenue Analysis', color: '#8B5CF6' };
      // Auto-select Due Diligence mode for data
      setSelectedMode('due-diligence');
    }

    // Presentations (PPTX, PPT)
    if (['pptx', 'ppt'].includes(ext) || mimeType.includes('presentation')) {
      activations['cmo'] = { status: 'Reviewing Messaging', color: '#EC4899' };
      activations['chief'] = { status: 'Strategic Alignment', color: '#6366F1' };
      activations['coo'] = { status: 'Operational Feasibility', color: '#F59E0B' };
    }

    // Code/Technical (JSON, MD, TXT)
    if (['json', 'md', 'txt', 'js', 'ts', 'py'].includes(ext)) {
      activations['cdo'] = { status: 'Technical Analysis', color: '#06B6D4' };
      activations['ciso'] = { status: 'Security Review', color: '#EF4444' };
      // Auto-select Innovation Lab mode for technical docs
      setSelectedMode('innovation-lab');
    }

    return activations;
  };

  const handleFileDrop = async (file: File) => {
    setIsProcessingDrop(true);
    setDroppedFile(file);

    // Detect file type and wake relevant agents
    const activations = detectFileTypeAndWakeAgents(file);
    setAgentActivations(activations);

    // Auto-select the awakened agents
    const agentIds = Object.keys(activations);
    setSelectedAgents((prev) => {
      const newSelection = new Set([...prev, ...agentIds]);
      return Array.from(newSelection);
    });

    // Add to attached files
    setAttachedFiles((prev) => [...prev, file]);

    // Upload to CendiaVault (MinIO) - sovereign storage
    let vaultDoc: any = null;
    try {
      vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', {
        uploadedBy: 'council-user',
        deliberationType: selectedMode,
        agentsActivated: agentIds,
      });
      console.log('[CendiaVault] Document stored:', vaultDoc?.path);
    } catch (err) {
      console.log('[CendiaVault] Upload deferred, continuing with local processing');
    }

    // Extract text content using Tika
    try {
      const mimeType = file.type || 'application/octet-stream';
      let result: any = null;

      if (vaultDoc && typeof vaultDoc.id === 'string' && !vaultDoc.id.startsWith('local-')) {
        result = await enterpriseApi.extractDocumentFromVault(
          vaultDoc.bucket,
          vaultDoc.path,
          mimeType,
          file.name
        );
      } else if (file.size <= 5 * 1024 * 1024) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const r = reader.result as string;
            resolve(r.split(',')[1] || r);
          };
          reader.readAsDataURL(file);
        });
        result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
      }

      if (result?.text) {
        setExtractedContent(
          (prev) => prev + (prev ? '\n\n---\n\n' : '') + `[Document: ${file.name}]\n${result.text}`
        );
      }
    } catch (err) {
      console.log('Document extraction not available, file staged for deliberation');
    }

    // Auto-switch to deliberation mode
    setQueryMode('deliberation');

    // Clear activations after 3 seconds (agents stay selected)
    setTimeout(() => {
      setAgentActivations({});
      setIsProcessingDrop(false);
    }, 3000);
  };

  // Drag event handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set dragging to false if we're leaving the drop zone entirely
    if (dropZoneRef.current && !dropZoneRef.current.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && files[0]) {
      // Process the first file (or could handle multiple)
      await handleFileDrop(files[0]);
    }
  };

  // State for streaming deliberation - used for real-time agent response display
  const [streamingDecision, setStreamingDecision] = useState<QueryResult | null>(null);
  const [currentStreamingAgent, setCurrentStreamingAgent] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<string>('');

  // WebSocket for real-time deliberation updates
  const { socket, connected, on, emit } = useWebSocket();

  // WebSocket: Join deliberation room when active
  useEffect(() => {
    if (connected && socket && streamingDecision) {
      emit('join-deliberation', streamingDecision.id);
      
      on('deliberation-update', (update: any) => {
        if (update.phase) {
          setCurrentPhase(update.phase);
        }
        if (update.agentResponse) {
          setStreamingDecision(prev => prev ? {
            ...prev,
            agentResponses: [...(prev.agentResponses || []), update.agentResponse]
          } : null);
        }
      });
    }
  }, [connected, socket, streamingDecision, emit, on]);

  // C) Progressive disclosure - collapsible sections state
  const [expandedSections, setExpandedSections] = useState<Record<string, Record<string, boolean>>>(
    {}
  );

  const toggleSection = (decisionId: string, section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [decisionId]: {
        ...prev[decisionId],
        [section]: !prev[decisionId]?.[section],
      },
    }));
  };

  const isSectionExpanded = (decisionId: string, section: string) => {
    return expandedSections[decisionId]?.[section] ?? false;
  };

  // D) Agent selection - lock roster for audit
  const [isRosterLocked, setIsRosterLocked] = useState(false);

  // Get mode selection rationale for "Why these agents?" tooltip
  const getModeRationale = (modeKey: string) => {
    const rationales: Record<string, string> = {
      'war-room':
        'War Room mode auto-selects CFO, COO, and Risk agents for crisis response scenarios requiring financial, operational, and risk expertise.',
      'deal-room':
        'Deal Room mode selects Chief Strategy, CFO, and Legal agents for M&A and contract review requiring strategic, financial, and legal analysis.',
      'board-prep':
        'Board Prep mode includes Chief Strategy, CFO, and CMO for executive presentations requiring strategic narrative and financial accuracy.',
      'risk-review':
        'Risk Review mode prioritizes CISO, Risk, and COO agents for security and operational risk assessment.',
      'strategy-session':
        'Strategy Session selects Chief Strategy, CMO, and CDO agents for market analysis and strategic planning.',
    };
    return (
      rationales[modeKey] || 'Agents selected based on current deliberation mode and query context.'
    );
  };

  const handleSubmit = async () => {
    if (!queryInput.trim()) {
      return;
    }

    const onlineAgents = agents.filter((a) => a.status === 'online');
    if (onlineAgents.length === 0) {
      setError(
        'No agents are online. Please start Ollama and ensure you have a model installed (e.g., ollama pull llama3.2)'
      );
      return;
    }

    setIsProcessing(true);
    setError(null);

    // Build question with document context if files are attached
    let questionAsked = queryInput;
    if (extractedContent && attachedFiles.length > 0) {
      questionAsked = `${queryInput}\n\n--- ATTACHED DOCUMENTS FOR REVIEW ---\n${extractedContent}`;
    }

    setQueryInput('');
    setAttachedFiles([]);
    setExtractedContent('');

    try {
      if (queryMode === 'deliberation') {
        // Create initial streaming decision
        const decisionId = `decision-${Date.now()}`;
        const agentIds = selectedAgents.length > 0 ? selectedAgents : onlineAgents.map((a) => a.id);

        // Queue the deliberation job in the sovereign stack (BullMQ)
        try {
          await sovereignApi.queue.queueDeliberation({
            sessionId: decisionId,
            question: questionAsked,
            agents: agentIds,
            context: { mode: queryMode },
            priority: 'normal',
          });
          console.log('[Council] Deliberation queued in sovereign stack:', decisionId);
        } catch (queueError) {
          console.warn(
            '[Council] Queue service unavailable, proceeding with direct execution:',
            queueError
          );
        }

        const initialDecision: QueryResult = {
          id: decisionId,
          query: questionAsked,
          response: '',
          confidence: 0,
          agents: [],
          agentResponses: [],
          crossExaminations: [],
          userMessages: [],
          answeredAt: new Date(),
          mode: 'deliberation',
          currentPhase: 'initial_analysis',
        };

        setStreamingDecision(initialDecision);
        setRecentDecisions((prev) => [initialDecision, ...prev].slice(0, 10));

        // Track active deliberation
        setDeliberations(prev => [...prev, {
          id: decisionId,
          question: questionAsked,
          status: 'in_progress',
          phase: 'initial_analysis',
          agents: agentIds,
          startedAt: new Date(),
        }]);

        // Run deliberation with streaming and cross-examination
        const result = await ollamaService.deliberateWithStreaming(questionAsked, agentIds, {
          onPhaseChange: (phase) => {
            setCurrentPhase(phase);
            setStreamingDecision((prev) => (prev ? { ...prev, currentPhase: phase } : null));
            setRecentDecisions((prev) =>
              prev.map((d) => (d.id === decisionId ? { ...d, currentPhase: phase } : d))
            );
          },
          onAgentStart: (agent) => {
            setCurrentStreamingAgent(agent.id);
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                const existingIdx = d.agentResponses.findIndex((ar) => ar.agentId === agent.id);
                if (existingIdx === -1) {
                  return {
                    ...d,
                    agentResponses: [
                      ...d.agentResponses,
                      {
                        agentId: agent.id,
                        agentName: agent.name,
                        agentAvatar: agent.avatar,
                        agentColor: agent.color,
                        agentRole: agent.role,
                        response: '',
                        duration: 0,
                        isStreaming: true,
                        timestamp: Date.now(),
                        reactions: {},
                      },
                    ],
                    agents: [...d.agents, { id: agent.id, name: agent.name }],
                  };
                }
                return d;
              })
            );
          },
          onToken: (agent, token) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  agentResponses: d.agentResponses.map((ar) =>
                    ar.agentId === agent.id ? { ...ar, response: ar.response + token } : ar
                  ),
                };
              })
            );
          },
          onAgentComplete: (agent, response, duration) => {
            setCurrentStreamingAgent(null);
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  agentResponses: d.agentResponses.map((ar) =>
                    ar.agentId === agent.id ? { ...ar, response, duration, isStreaming: false } : ar
                  ),
                };
              })
            );
          },
          onChallenge: (challenger, target, challenge) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                return {
                  ...d,
                  crossExaminations: [
                    ...d.crossExaminations,
                    {
                      challengerId: challenger.id,
                      challengerName: challenger.name,
                      challengerAvatar: challenger.avatar,
                      challengerColor: challenger.color,
                      targetId: target.id,
                      targetName: target.name,
                      challenge,
                      rebuttal: '',
                    },
                  ],
                };
              })
            );
          },
          onRebuttal: (target, rebuttal) => {
            setRecentDecisions((prev) =>
              prev.map((d) => {
                if (d.id !== decisionId) {
                  return d;
                }
                const lastCrossExam = d.crossExaminations[d.crossExaminations.length - 1];
                if (lastCrossExam && lastCrossExam.targetId === target.id) {
                  return {
                    ...d,
                    crossExaminations: d.crossExaminations.map((ce, i) =>
                      i === d.crossExaminations.length - 1 ? { ...ce, rebuttal } : ce
                    ),
                  };
                }
                return d;
              })
            );
          },
          onSynthesisStart: () => {
            setCurrentStreamingAgent('synthesis');
          },
          onSynthesisToken: (token) => {
            setRecentDecisions((prev) =>
              prev.map((d) => (d.id === decisionId ? { ...d, response: d.response + token } : d))
            );
          },
          onComplete: async (synthesis, confidence) => {
            setCurrentStreamingAgent(null);
            setCurrentPhase('');
            setStreamingDecision(null);
            setRecentDecisions((prev) =>
              prev.map((d) =>
                d.id === decisionId
                  ? { ...d, response: synthesis, confidence, currentPhase: 'completed' }
                  : d
              )
            );
            // Mark deliberation as completed
            setDeliberations(prev => prev.map(d => 
              d.id === decisionId 
                ? { ...d, status: 'completed', completedAt: new Date(), confidence }
                : d
            ));
            
          },
        });

        // Log result for debugging/analytics
        console.log('[Council] Deliberation completed:', { decisionId, result });

        // Save to backend for Chronos timeline integration (after await returns)
        const agentResponses = result.responses || [];
        const crossExams = result.crossExaminations || [];
        
        // Save deliberation to backend database
        councilApi.saveDeliberation({
          question: questionAsked,
          mode: selectedMode,
          agentResponses,
          crossExaminations: crossExams,
          synthesis: result.synthesis,
          confidence: result.confidence,
        }).then(() => {
          console.log('[Council] Deliberation saved to backend for Chronos');
        }).catch(err => {
          console.warn('[Council] Failed to save deliberation to backend:', err);
        });

        // Store in Vector DB for agent memory
        sovereignApi.vector.storeDecisionContext({
          decisionId,
          title: questionAsked.slice(0, 100),
          context: questionAsked,
          outcome: result.synthesis,
          confidence: result.confidence,
          participants: agentResponses.map((ar: any) => ar.agentId || ar.agentCode || 'agent'),
        }).then(() => {
          console.log('[Council] Decision context stored in Vector DB');
        }).catch(err => {
          console.warn('[Council] Failed to store decision context:', err);
        });

        // Record to CendiaLedger for immutable audit trail
        try {
          const ledgerDecision = ledgerService.createDecision(
            questionAsked.slice(0, 100),
            questionAsked,
            'AI Council',
            agentResponses.map((ar: any) => ar.agentId || ar.agentCode || 'agent')
          );
          agentResponses.forEach((ar: any) => {
            ledgerService.recordDeliberation(
              ledgerDecision.id,
              ar.agentId || ar.agentCode || 'agent',
              (ar.response || ar.content || '').slice(0, 500),
              result.confidence
            );
          });
          ledgerService.finalizeDecision(ledgerDecision.id, 'approved', result.confidence);
          console.log('[Council] Decision recorded to CendiaLedger:', ledgerDecision.id);
        } catch (ledgerErr) {
          console.warn('[Council] Failed to record to Ledger:', ledgerErr);
        }
      } else {
        // Quick query - use first online agent or Chief Strategy Agent
        const targetAgent =
          selectedAgents.length > 0
            ? onlineAgents.find((a) => selectedAgents.includes(a.id)) || onlineAgents[0]
            : onlineAgents.find((a) => a.code === 'chief') || onlineAgents[0];

        if (!targetAgent) {
          setError('No agents available for query');
          return;
        }

        const result = await ollamaService.queryAgent(targetAgent.id, questionAsked);

        // Add to recent decisions
        const newDecision: QueryResult = {
          id: `decision-${Date.now()}`,
          query: questionAsked,
          response: result.response,
          confidence: 85,
          agents: [{ id: result.agent.id, name: result.agent.name }],
          agentResponses: [
            {
              agentId: result.agent.id,
              agentName: result.agent.name,
              agentAvatar: result.agent.avatar,
              agentColor: result.agent.color,
              agentRole: result.agent.role,
              response: result.response,
              duration: result.duration,
              timestamp: Date.now(),
            },
          ],
          crossExaminations: [],
          userMessages: [],
          answeredAt: new Date(),
          mode: 'quick',
        };

        setRecentDecisions((prev) => [newDecision, ...prev].slice(0, 10));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process request. Ensure Ollama is running.');
      console.error('Query error:', err);
    } finally {
      setIsProcessing(false);
      // Note: Decision context storage moved to onComplete callback for accurate data
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">{t('council.title')}</h1>
            <p className="text-neutral-300 mt-1">
              {t('council.subtitle')} — 24 {t('council.pre_built_modes')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Active Deliberations Badge */}
            {deliberations.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                <span className="animate-pulse">🔄</span>
                <span className="text-sm font-medium">{deliberations.length} Active</span>
              </div>
            )}
            
            {/* Governance Permissions Badge - Only shows when user has actual permissions */}
            {(canVeto || canApprove) && (
              <div 
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200 cursor-help"
                title={
                  canVeto && canApprove 
                    ? `Full Authority: You can approve or veto council decisions. ${policyReason ? `Reason: ${policyReason}` : ''}`
                    : canVeto 
                    ? `Veto Power: You can block council decisions that don't meet governance standards. ${policyReason ? `Reason: ${policyReason}` : ''}`
                    : `Approval Power: You can approve council decisions for implementation. ${policyReason ? `Reason: ${policyReason}` : ''}`
                }
              >
                <span>🏛️</span>
                <span className="text-sm font-medium">
                  {canVeto && canApprove ? 'Full Authority' : canVeto ? 'Veto Power' : 'Approval Power'}
                </span>
              </div>
            )}
            
            {/* Pantheon Button */}
            <button
              onClick={() => setShowPantheon(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              <span>🏛️</span>
              <span className="font-medium">Pantheon</span>
            </button>
            
            {/* Premium Features Button */}
            <button
              onClick={() => setShowPremiumModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-all shadow-md hover:shadow-lg"
            >
              <span>✨</span>
              <span className="font-medium">Premium</span>
              <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">30 AI Agents</span>
            </button>
            <button
              onClick={() => setShowModesLibrary(!showModesLibrary)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <span>📚</span>
              <span className="font-medium">{t('council.modes_library')}</span>
            </button>
            {agents.some((a) => a.status === 'online') ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-success-light text-success-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />
                {t('council.ollama_connected')}
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-error-light text-error-dark rounded-full text-sm">
                <span className="w-2 h-2 rounded-full bg-error-main" />
                {t('council.ollama_disconnected')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* MODES LIBRARY (Expandable) */}
      {/* ================================================================= */}
      {showModesLibrary && (
        <div ref={modesLibraryRef} className="mb-6 bg-white rounded-xl border border-neutral-200 overflow-hidden">
          <div className="p-6 border-b border-neutral-100 bg-gradient-to-r from-primary-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-neutral-900">{t('council.modes.title')}</h2>
                <p className="text-neutral-600 mt-1">
                  {t('council.modes.subtitle')}
                  <span className="font-semibold text-primary-600 ml-1">
                    {t('council.modes.cultureNote')}
                  </span>
                </p>
              </div>
              <button
                onClick={() => setShowModesLibrary(false)}
                className="p-2 hover:bg-white/50 rounded-lg"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Reference Table */}
          <div className="p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {t('council.modes.quickReference')}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.mode')}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.primeDirective')}
                    </th>
                    <th className="text-left py-2 px-3 font-semibold text-neutral-700">
                      {t('council.modes.bestFor')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.values(COUNCIL_MODES).map((mode) => (
                    <tr
                      key={mode.id}
                      className={cn(
                        'border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors',
                        selectedMode === mode.id && 'bg-primary-50'
                      )}
                      onClick={() => {
                        setSelectedMode(mode.id);
                        setShowModesLibrary(false);
                      }}
                    >
                      <td className="py-3 px-3">
                        <span className="inline-flex items-center gap-2">
                          <span className="text-lg">{mode.emoji}</span>
                          <span className="font-medium">{mode.name}</span>
                        </span>
                      </td>
                      <td className="py-3 px-3 text-neutral-600 italic">"{mode.primeDirective}"</td>
                      <td className="py-3 px-3 text-neutral-500">{mode.shortDesc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Selected Mode Details */}
          {selectedMode && COUNCIL_MODES[selectedMode] && (
            <div className="p-6 bg-neutral-50 border-t border-neutral-200">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                  style={{ backgroundColor: `${COUNCIL_MODES[selectedMode]?.color ?? '#6366f1'}20` }}
                >
                  {COUNCIL_MODES[selectedMode]?.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-neutral-900">
                    {COUNCIL_MODES[selectedMode]?.name} Mode
                  </h3>
                  <p className="text-primary-600 font-medium italic mb-2">
                    "{COUNCIL_MODES[selectedMode]?.primeDirective}"
                  </p>
                  <p className="text-neutral-600 mb-4">{COUNCIL_MODES[selectedMode]?.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        {t('council.modes.bestFor')}:
                      </h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode]?.useCases?.map((uc, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="text-primary-500">•</span> {uc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-neutral-700 mb-2">
                        {t('council.modes.agentBehavior')}:
                      </h4>
                      <ul className="text-sm text-neutral-600 space-y-1">
                        {COUNCIL_MODES[selectedMode]?.agentBehaviors?.slice(0, 4).map((ab, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-amber-500">→</span>
                            <span>{ab}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Example Scenarios for this Mode */}
                  <div className="mt-4 pt-4 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-neutral-700">
                        📋 Example Scenarios for {COUNCIL_MODES[selectedMode]?.name}:
                      </h4>
                      <button
                        onClick={() => {
                          setShowModesLibrary(false);
                          setShowWorkflowPicker(true);
                        }}
                        className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Browse All Scenarios →
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(() => {
                        const modeScenarios: Record<string, string[]> = {
                          'war-room': ['Strategic M&A evaluation', 'Competitive response planning', 'Market entry decisions'],
                          'due-diligence': ['Vendor contract review', 'Investment analysis', 'Partnership evaluation'],
                          'innovation-lab': ['New product ideation', 'Technology exploration', 'Process innovation'],
                          'compliance': ['Regulatory audit prep', 'Policy gap analysis', 'Risk assessment'],
                          'crisis': ['Incident response', 'Reputation management', 'Emergency planning'],
                          'execution': ['Project kickoff', 'Implementation planning', 'Resource allocation'],
                          'research': ['Market research', 'Competitive analysis', 'Trend forecasting'],
                          'investment': ['Budget allocation', 'Capital planning', 'ROI analysis'],
                          'stakeholder': ['Change management', 'Communication planning', 'Alignment sessions'],
                          'rapid': ['Quick decisions', 'Time-sensitive issues', 'Urgent approvals'],
                          'advisory': ['Strategic consulting', 'Expert recommendations', 'Best practices'],
                          'governance': ['Policy creation', 'Framework development', 'Standards setting'],
                        };
                        const scenarios = modeScenarios[selectedMode] || ['General deliberation'];
                        return scenarios.map((scenario, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-3 py-1 bg-white border border-neutral-200 rounded-full text-xs text-neutral-600"
                          >
                            {scenario}
                          </span>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-error-light border border-error-main rounded-lg">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-error-dark">{error}</p>
              <p className="text-sm text-error-dark/80 mt-1">
                To enable AI agents, run:{' '}
                <code className="px-1 py-0.5 bg-white/50 rounded">ollama serve</code> and ensure you
                have a model:{' '}
                <code className="px-1 py-0.5 bg-white/50 rounded">ollama pull llama3.2</code>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* STREAMING PROGRESS INDICATOR */}
      {/* ================================================================= */}
      {streamingDecision && currentPhase && (
        <div className="mb-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
          <div className="flex items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-indigo-900">Deliberation in Progress</span>
                <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                  {currentPhase.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </span>
              </div>
              {currentStreamingAgent && (
                <p className="text-sm text-indigo-600">
                  🤖 {agents.find(a => a.id === currentStreamingAgent)?.name || currentStreamingAgent} is analyzing...
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-indigo-500">
                {streamingDecision.agentResponses?.length || 0} / {streamingDecision.agents?.length || 0} agents
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* AGENT GRID */}
      {/* ================================================================= */}
      {isLoading ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
          <div className="animate-pulse">
            <div className="h-6 bg-neutral-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-24 bg-neutral-100 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-neutral-900">{t('council.agents.domain')}</h2>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-success-main animate-pulse" />{' '}
              {t('label.online')}
            </span>
            <span className="flex items-center gap-1 text-neutral-500">
              <span className="w-2 h-2 rounded-full bg-neutral-300" /> {t('label.offline')}
            </span>
          </div>
        </div>

        {/* Core C-Suite Agents */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Core C-Suite
            </span>
            <div className="flex-1 h-px bg-neutral-200" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {allAgents
              .filter(
                (a) =>
                  !a.premium &&
                  !a.isCustom &&
                  ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk', 'clo', 'cpo', 'caio', 'cso', 'cio', 'cco', 'actuary', 'partnerships', 'devils-advocate'].includes(a.code)
              )
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  compact
                />
              ))}
          </div>
        </div>

        {/* External & Audit Agents - Collapsible */}
        {allAgents.filter(
          (a) => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)
        ).length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => toggleAgentSection('audit')}
              className="w-full flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className={cn(
                'text-neutral-400 transition-transform',
                expandedAgentSections.audit && 'rotate-90'
              )}>▶</span>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                External & Audit Agents
              </span>
              <span className="text-xs text-neutral-400">
                ({allAgents.filter(a => a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)).length})
              </span>
              <div className="flex-1" />
              <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                Premium
              </span>
            </button>
            {expandedAgentSections.audit && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pl-6">
                {allAgents
                  .filter(
                    (a) =>
                      a.premium && a.premiumPackage?.includes('Audit') && premium.hasAgentAccess(a.id)
                  )
                  .map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgents.includes(agent.id)}
                      onSelect={() => toggleAgentSelection(agent.id)}
                      compact
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Clinical / Healthcare Agents - Collapsible */}
        {allAgents.filter(
          (a) =>
            a.premium &&
            (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) &&
            premium.hasAgentAccess(a.id)
        ).length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => toggleAgentSection('healthcare')}
              className="w-full flex items-center gap-2 p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <span className={cn(
                'text-neutral-400 transition-transform',
                expandedAgentSections.healthcare && 'rotate-90'
              )}>▶</span>
              <span className="text-xs font-semibold text-neutral-600 uppercase tracking-wider">
                Clinical / Healthcare Agents
              </span>
              <span className="text-xs text-neutral-400">
                ({allAgents.filter(a => a.premium && (a.premiumPackage?.includes('Healthcare') || a.premiumPackage?.includes('Clinical')) && premium.hasAgentAccess(a.id)).length})
              </span>
              <div className="flex-1" />
              <span className="text-[10px] bg-cyan-100 text-cyan-700 px-2 py-0.5 rounded-full font-medium">
                Healthcare Pack
              </span>
            </button>
            {expandedAgentSections.healthcare && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pl-6">
                {allAgents
                  .filter(
                    (a) =>
                      a.premium &&
                      (a.premiumPackage?.includes('Healthcare') ||
                        a.premiumPackage?.includes('Clinical')) &&
                      premium.hasAgentAccess(a.id)
                  )
                  .map((agent) => (
                    <AgentCard
                      key={agent.id}
                      agent={agent}
                      isSelected={selectedAgents.includes(agent.id)}
                      onSelect={() => toggleAgentSelection(agent.id)}
                      compact
                    />
                  ))}
              </div>
            )}
          </div>
        )}

        {/* Legal Agents - Collapsible */}
        {allAgents.filter(
          (a) => !a.premium && !a.isCustom && 
            ['prosecutor', 'defense-attorney', 'judge', 'juror-skeptic', 'juror-emotional', 'juror-analytical', 'juror-foreperson', 
             'matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'litigation-strategist', 
             'regulatory-specialist', 'privilege-officer', 'evidence-officer', 'ip-specialist', 'employment-specialist', 
             'opposing-counsel', 'commercial-advisor'].includes(a.code)
        ).length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => toggleAgentSection('legal')}
              className={cn(
                "w-full flex items-center gap-2 p-3 rounded-lg transition-colors",
                searchParams.get('vertical') === 'legal'
                  ? "bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border border-blue-300"
                  : "bg-neutral-50 hover:bg-neutral-100"
              )}
            >
              <span className={cn(
                'transition-transform',
                searchParams.get('vertical') === 'legal' ? 'text-blue-500' : 'text-neutral-400',
                expandedAgentSections.legal && 'rotate-90'
              )}>▶</span>
              <span className="text-lg">⚖️</span>
              <span className={cn(
                "text-xs font-semibold uppercase tracking-wider",
                searchParams.get('vertical') === 'legal' ? "text-blue-700" : "text-neutral-600"
              )}>
                Legal AI Agents
              </span>
              <span className="text-xs text-neutral-400">
                ({allAgents.filter(a => !a.premium && !a.isCustom && 
                  ['prosecutor', 'defense-attorney', 'judge', 'juror-skeptic', 'juror-emotional', 'juror-analytical', 'juror-foreperson', 
                   'matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'litigation-strategist', 
                   'regulatory-specialist', 'privilege-officer', 'evidence-officer', 'ip-specialist', 'employment-specialist', 
                   'opposing-counsel', 'commercial-advisor'].includes(a.code)).length})
              </span>
              <div className="flex-1" />
              {searchParams.get('vertical') === 'legal' && (
                <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-medium">
                  Active Vertical
                </span>
              )}
            </button>
            {(expandedAgentSections.legal || searchParams.get('vertical') === 'legal') && (
              <div className="mt-3 pl-6">
                {/* Courtroom Roles */}
                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Courtroom</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {allAgents
                      .filter((a) => !a.premium && !a.isCustom && 
                        ['prosecutor', 'defense-attorney', 'judge'].includes(a.code))
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isSelected={selectedAgents.includes(agent.id)}
                          onSelect={() => toggleAgentSelection(agent.id)}
                          compact
                        />
                      ))}
                  </div>
                </div>
                {/* Jury */}
                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Jury Panel</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {allAgents
                      .filter((a) => !a.premium && !a.isCustom && 
                        ['juror-skeptic', 'juror-emotional', 'juror-analytical', 'juror-foreperson'].includes(a.code))
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isSelected={selectedAgents.includes(agent.id)}
                          onSelect={() => toggleAgentSelection(agent.id)}
                          compact
                        />
                      ))}
                  </div>
                </div>
                {/* Practice Specialists */}
                <div className="mb-3">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">Practice Specialists</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                    {allAgents
                      .filter((a) => !a.premium && !a.isCustom && 
                        ['matter-lead', 'research-counsel', 'contract-counsel', 'risk-counsel', 'litigation-strategist', 
                         'regulatory-specialist', 'privilege-officer', 'evidence-officer', 'ip-specialist', 
                         'employment-specialist', 'opposing-counsel', 'commercial-advisor'].includes(a.code))
                      .map((agent) => (
                        <AgentCard
                          key={agent.id}
                          agent={agent}
                          isSelected={selectedAgents.includes(agent.id)}
                          onSelect={() => toggleAgentSelection(agent.id)}
                          compact
                        />
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Custom Agents & Unlocked Industry Agents - Collapsible - Fix #5: More prominent */}
        <div className="mb-4">
          <button
            onClick={() => toggleAgentSection('custom')}
            className={cn(
              "w-full flex items-center gap-2 p-3 rounded-lg transition-colors",
              customAgents.length > 0 
                ? "bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 border border-purple-200" 
                : "bg-neutral-50 hover:bg-neutral-100"
            )}
          >
            <span className={cn(
              'transition-transform',
              customAgents.length > 0 ? 'text-purple-500' : 'text-neutral-400',
              expandedAgentSections.custom && 'rotate-90'
            )}>▶</span>
            <span className="text-lg">✨</span>
            <span className={cn(
              "text-xs font-semibold uppercase tracking-wider",
              customAgents.length > 0 ? "text-purple-700" : "text-neutral-600"
            )}>
              Custom Agents
            </span>
            {/* Prominent count badge */}
            {customAgents.length > 0 && (
              <span className="px-2 py-0.5 bg-purple-500 text-white text-xs font-bold rounded-full animate-pulse">
                {customAgents.length}
              </span>
            )}
            <span className="text-xs text-neutral-400">
              {allAgents.filter(a => a.isCustom || (a.premium && !a.premiumPackage?.includes('Audit') && !a.premiumPackage?.includes('Healthcare') && !a.premiumPackage?.includes('Clinical') && premium.hasAgentAccess(a.id))).length > customAgents.length && (
                <>+ {allAgents.filter(a => !a.isCustom && a.premium && !a.premiumPackage?.includes('Audit') && !a.premiumPackage?.includes('Healthcare') && !a.premiumPackage?.includes('Clinical') && premium.hasAgentAccess(a.id)).length} unlocked</>
              )}
            </span>
            <div className="flex-1" />
            {customAgents.length === 0 && (
              <span className="text-xs text-purple-500 font-medium">
                + Create your first agent
              </span>
            )}
          </button>
          {expandedAgentSections.custom && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 pl-6">
            {/* Show custom agents */}
            {allAgents
              .filter((a) => a.isCustom)
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  onEdit={() => handleEditCustomAgent(agent)}
                  compact
                />
              ))}
            {/* Show unlocked industry agents */}
            {allAgents
              .filter((a) => {
                if (a.isCustom) {return false;}
                if (!a.premium) {return false;}
                if (a.premiumPackage?.includes('Audit')) {return false;}
                if (
                  a.premiumPackage?.includes('Healthcare') ||
                  a.premiumPackage?.includes('Clinical')
                )
                  {return false;}
                return premium.hasAgentAccess(a.id);
              })
              .map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  isSelected={selectedAgents.includes(agent.id)}
                  onSelect={() => toggleAgentSelection(agent.id)}
                  compact
                />
              ))}

            {/* Create Custom Agent Button - Premium Feature */}
            <button
              onClick={() => {
                if (premium.canCreateCustomAgents()) {
                  setEditingAgent(null);
                  setShowAgentCreator(true);
                } else {
                  setShowPremiumModal(true);
                }
              }}
              className={cn(
                'relative p-4 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2 min-h-[120px]',
                premium.canCreateCustomAgents()
                  ? 'border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 hover:border-purple-400 hover:shadow-md'
                  : 'border-neutral-300 bg-neutral-100 opacity-75 hover:opacity-100 hover:border-amber-400'
              )}
            >
              {/* Premium/Locked Badge */}
              <div
                className={cn(
                  'absolute -top-2 -right-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md flex items-center gap-1',
                  premium.canCreateCustomAgents()
                    ? 'bg-gradient-to-r from-purple-500 to-indigo-500'
                    : 'bg-gradient-to-r from-neutral-400 to-neutral-500'
                )}
              >
                <span>{premium.canCreateCustomAgents() ? '⭐' : '🔒'}</span>
                <span>{premium.canCreateCustomAgents() ? 'PREMIUM' : 'LOCKED'}</span>
              </div>

              {/* Locked Overlay */}
              {!premium.canCreateCustomAgents() && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/10 rounded-xl z-10">
                  <div className="bg-white/95 px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                    <span>🔒</span>
                    <span className="text-xs font-semibold text-neutral-700">Unlock</span>
                  </div>
                </div>
              )}

              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-2xl',
                  premium.canCreateCustomAgents()
                    ? 'bg-gradient-to-br from-purple-200 to-indigo-200'
                    : 'bg-neutral-200'
                )}
              >
                {premium.canCreateCustomAgents() ? '✨' : '🔒'}
              </div>
              <span
                className={cn(
                  'text-sm font-medium',
                  premium.canCreateCustomAgents() ? 'text-purple-700' : 'text-neutral-600'
                )}
              >
                Create Agent
              </span>
              <span
                className={cn(
                  'text-xs',
                  premium.canCreateCustomAgents() ? 'text-purple-500' : 'text-neutral-500'
                )}
              >
                Agent Builder Pack
              </span>
              {!premium.canCreateCustomAgents() && (
                <span className="text-[10px] text-amber-600 font-semibold">$199/month</span>
              )}
            </button>
          </div>
          )}
        </div>
      </div>
      )}

      {/* ================================================================= */}
      {/* DROP TO DELIBERATE - Central Council Table */}
      {/* ================================================================= */}
      <div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'relative mb-6 rounded-2xl border-2 border-dashed transition-all duration-300',
          isDragging
            ? 'border-amber-400 bg-gradient-to-br from-amber-900/30 to-orange-900/30 scale-[1.02] shadow-2xl shadow-amber-500/20'
            : droppedFile
              ? 'border-emerald-500/50 bg-gradient-to-br from-emerald-900/20 to-teal-900/20'
              : 'border-neutral-600/30 bg-gradient-to-br from-neutral-800/50 to-neutral-900/50 hover:border-neutral-500/50'
        )}
      >
        {/* Council Table Visual */}
        <div className="p-6">
          {/* Drop Zone Header */}
          <div className="text-center mb-4">
            <div
              className={cn(
                'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all',
                isDragging
                  ? 'bg-amber-500/20 text-amber-300 animate-pulse'
                  : droppedFile
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : 'bg-neutral-700/50 text-neutral-400'
              )}
            >
              {isDragging ? (
                <>
                  <span className="text-xl animate-bounce">📥</span>
                  <span>Release to analyze with Council</span>
                </>
              ) : droppedFile ? (
                <>
                  <span className="text-xl">✅</span>
                  <span>Document staged: {droppedFile.name}</span>
                </>
              ) : (
                <>
                  <span className="text-xl">📋</span>
                  <span>Attach Evidence to Deliberation</span>
                </>
              )}
            </div>
          </div>

          {/* Circular Council Table with Agent Seats */}
          <div className="relative mx-auto" style={{ width: '320px', height: '200px' }}>
            {/* Center Table */}
            <div
              className={cn(
                'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 rounded-full flex items-center justify-center transition-all duration-500',
                isDragging
                  ? 'bg-gradient-to-br from-amber-600/40 to-orange-600/40 shadow-lg shadow-amber-500/30 scale-110'
                  : droppedFile
                    ? 'bg-gradient-to-br from-emerald-600/30 to-teal-600/30'
                    : 'bg-gradient-to-br from-neutral-700/40 to-neutral-800/40'
              )}
            >
              {isDragging ? (
                <div className="text-center">
                  <span className="text-3xl animate-bounce">📄</span>
                  <div className="text-xs text-amber-300 font-medium mt-1">Drop Here</div>
                </div>
              ) : droppedFile ? (
                <div className="text-center px-2 relative">
                  <span className="text-2xl">📁</span>
                  <div className="text-[10px] text-emerald-300 truncate max-w-[100px]">
                    {droppedFile.name}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDroppedFile(null);
                      setAttachedFiles([]);
                      setExtractedContent('');
                    }}
                    className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full text-white text-xs flex items-center justify-center transition-colors"
                    title="Remove document"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <span className="text-2xl opacity-50">🪑</span>
                  <div className="text-[10px] text-neutral-500">Council Table</div>
                </div>
              )}
            </div>

            {/* Agent Seats Around Table */}
            {agents
              .filter((a) => ['chief', 'cfo', 'coo', 'ciso', 'risk', 'cdo'].includes(a.code))
              .slice(0, 6)
              .map((agent, idx) => {
                const angle = (idx * 60 - 90) * (Math.PI / 180);
                const radius = 90;
                const x = Math.cos(angle) * radius + 160;
                const y = Math.sin(angle) * radius + 100;
                const activation = agentActivations[agent.code];
                const isHighlighted = highlightedAgent?.id === agent.id;

                return (
                  <div
                    key={agent.id}
                    className={cn(
                      'absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 cursor-pointer',
                      (activation || isHighlighted) && 'scale-110 z-10'
                    )}
                    style={{ left: x, top: y }}
                    onClick={() => setHighlightedAgent(isHighlighted ? null : agent)}
                  >
                    <div
                      className={cn(
                        'relative w-12 h-12 rounded-full flex items-center justify-center text-lg border-2 transition-all duration-300',
                        activation
                          ? 'shadow-lg animate-pulse'
                          : isHighlighted
                            ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-900'
                            : selectedAgents.includes(agent.id)
                              ? 'opacity-100'
                              : 'opacity-50 hover:opacity-80'
                      )}
                      style={{
                        backgroundColor: activation ? `${activation.color}30` : `${agent.color}20`,
                        borderColor: activation ? activation.color : agent.color,
                        boxShadow: activation ? `0 0 20px ${activation.color}50` : isHighlighted ? `0 0 15px ${agent.color}60` : undefined,
                      }}
                    >
                      {agent.avatar}

                      {/* Activation Status Badge */}
                      {activation && (
                        <div
                          className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded text-[9px] font-medium animate-fade-in"
                          style={{
                            backgroundColor: `${activation.color}20`,
                            color: activation.color,
                          }}
                        >
                          {activation.status}
                        </div>
                      )}
                    </div>
                    <div className="text-center mt-1">
                      <div
                        className={cn(
                          'text-[10px] font-medium',
                          activation ? 'text-white' : isHighlighted ? 'text-white' : 'text-neutral-500'
                        )}
                      >
                        {agent.code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          {/* Agent Personality Panel - Shows when agent is clicked */}
          {highlightedAgent && (
            <div 
              className="mt-4 p-4 rounded-xl border transition-all animate-fade-in"
              style={{ 
                backgroundColor: `${highlightedAgent.color}15`,
                borderColor: `${highlightedAgent.color}40`
              }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ backgroundColor: `${highlightedAgent.color}30` }}
                >
                  {highlightedAgent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{highlightedAgent.name}</h4>
                    <span 
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${highlightedAgent.color}30`, color: highlightedAgent.color }}
                    >
                      {highlightedAgent.role}
                    </span>
                  </div>
                  <p className="text-sm text-neutral-400 mb-2">{highlightedAgent.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {highlightedAgent.capabilities?.slice(0, 4).map((cap, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded">
                        {cap}
                      </span>
                    ))}
                  </div>
                  {/* Personality Traits */}
                  <div className="mt-3 pt-3 border-t border-neutral-700/50">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5">Deliberation Style</div>
                    <div className="flex flex-wrap gap-2">
                      {highlightedAgent.code === 'chief' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded">🎯 Synthesizer</span>
                          <span className="text-xs px-2 py-0.5 bg-indigo-900/50 text-indigo-300 rounded">⚖️ Balanced</span>
                        </>
                      )}
                      {highlightedAgent.code === 'cfo' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded">📊 Data-Driven</span>
                          <span className="text-xs px-2 py-0.5 bg-emerald-900/50 text-emerald-300 rounded">🔍 Skeptic</span>
                        </>
                      )}
                      {highlightedAgent.code === 'coo' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">⚡ Execution-Focused</span>
                          <span className="text-xs px-2 py-0.5 bg-blue-900/50 text-blue-300 rounded">📋 Pragmatic</span>
                        </>
                      )}
                      {highlightedAgent.code === 'ciso' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-300 rounded">🛡️ Risk-Averse</span>
                          <span className="text-xs px-2 py-0.5 bg-red-900/50 text-red-300 rounded">🔒 Compliance-First</span>
                        </>
                      )}
                      {highlightedAgent.code === 'risk' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded">⚠️ Cautious</span>
                          <span className="text-xs px-2 py-0.5 bg-orange-900/50 text-orange-300 rounded">🎲 Scenario Planner</span>
                        </>
                      )}
                      {highlightedAgent.code === 'cdo' && (
                        <>
                          <span className="text-xs px-2 py-0.5 bg-cyan-900/50 text-cyan-300 rounded">📈 Evidence-Based</span>
                          <span className="text-xs px-2 py-0.5 bg-cyan-900/50 text-cyan-300 rounded">🧪 Analytical</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setHighlightedAgent(null)}
                  className="text-neutral-500 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Drop Instructions */}
          {!droppedFile && !isDragging && !highlightedAgent && (
            <div className="text-center mt-6">
              <p className="text-sm text-neutral-500">
                Drag a <span className="text-amber-400">PDF</span>,{' '}
                <span className="text-emerald-400">Excel</span>, or{' '}
                <span className="text-blue-400">Document</span> here
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                The Council will auto-detect the document type and wake relevant agents
              </p>
              <p className="text-xs text-neutral-600 mt-1">
                💡 <span className="text-neutral-500">Click an agent above to see their personality</span>
              </p>
            </div>
          )}

          {/* Processing Indicator */}
          {isProcessingDrop && (
            <div className="text-center mt-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/20 rounded-full text-emerald-400 text-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                <span>Extracting document content...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* QUERY INPUT */}
      {/* ================================================================= */}
      <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{t('council.ask')}</h2>

          {/* Mode Selector with Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/70">{t('label.mode')}:</span>
            <div className="relative">
              <button 
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowModeDropdown(!showModeDropdown); }}
                className="flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span className="text-lg">{COUNCIL_MODES[selectedMode]?.emoji}</span>
                <span className="font-medium">{getModeName(selectedMode)}</span>
                <span className="text-white/50">▼</span>
              </button>
              {/* Dropdown Menu - Core modes only, with link to full library */}
              {showModeDropdown && (
              <div className="absolute top-full left-0 mt-1 w-72 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                <div className="px-3 py-1.5 text-[10px] text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                  Core Modes
                </div>
                {Object.values(COUNCIL_MODES)
                  .filter((mode) => mode.isCore)
                  .map((mode) => (
                    <button
                      type="button"
                      key={mode.id}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedMode(mode.id);
                        setShowModeDropdown(false);
                      }}
                      className={cn(
                        'w-full text-left px-3 py-2 flex items-center gap-3 hover:bg-neutral-800 transition-colors',
                        selectedMode === mode.id &&
                          'bg-primary-900/50 border-l-2 border-primary-500'
                      )}
                    >
                      <span className="text-lg">{mode.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{getModeName(mode.id)}</div>
                        <div className="text-xs text-neutral-400 truncate">
                          {getModeDirective(mode.id)}
                        </div>
                      </div>
                    </button>
                  ))}
                <div className="border-t border-neutral-700 p-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowModeDropdown(false);
                      setShowModesLibrary(true);
                      setTimeout(() => modesLibraryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                    }}
                    className="w-full text-center text-xs text-primary-400 hover:text-primary-300 py-1.5 bg-neutral-800/50 rounded"
                  >
                    📚 {language === 'es' ? 'Ver Biblioteca Completa' : 'View Full Modes Library'} (
                    {Object.keys(COUNCIL_MODES).length} modes) →
                  </button>
                </div>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Selected Mode Info Banner */}
        <div
          className="mb-4 px-4 py-3 rounded-lg border"
          style={{
            backgroundColor: `${COUNCIL_MODES[selectedMode]?.color}20`,
            borderColor: `${COUNCIL_MODES[selectedMode]?.color}40`,
          }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{COUNCIL_MODES[selectedMode]?.emoji}</span>
              <div>
                <div className="font-semibold">
                  {getModeName(selectedMode)} {language === 'es' ? 'Modo' : 'Mode'}
                </div>
                <div className="text-sm text-white/80 italic">
                  "{getModeDirective(selectedMode)}"
                </div>
                <div className="text-xs text-white/60 mt-0.5">
                  {language === 'es' ? 'Ideal para' : 'Best for'}:{' '}
                  {COUNCIL_MODES[selectedMode]?.shortDesc || 'Strategic decisions'}
                </div>
              </div>
            </div>
            <div className="text-sm text-white/60">
              {language === 'es' ? 'Líder' : 'Lead'}:{' '}
              {COUNCIL_MODES[selectedMode]?.leadAgent.toUpperCase()}
            </div>
          </div>
          
          {/* Quick Mode Alternatives - Fix #4 */}
          <div className="mt-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-white/50">Quick switch:</span>
              {Object.values(COUNCIL_MODES)
                .filter((mode) => mode.isCore && mode.id !== selectedMode)
                .slice(0, 3)
                .map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setSelectedMode(mode.id)}
                    className="flex items-center gap-1.5 px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 rounded text-xs transition-colors"
                  >
                    <span>{mode.emoji}</span>
                    <span>{getModeName(mode.id)}</span>
                  </button>
                ))}
              <button
                onClick={() => setShowModesLibrary(true)}
                className="text-xs text-primary-300 hover:text-primary-200 underline"
              >
                +{Object.keys(COUNCIL_MODES).length - 4} more
              </button>
            </div>
          </div>
        </div>

        {/* Context from another page (Chronos, Ledger, etc.) */}
        {contextFromPage && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-blue-500/20 border border-blue-500/40">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <span className="text-xl">📊</span>
                <div>
                  <div className="text-sm font-medium text-blue-300">
                    Context from {contextFromPage.sourcePage}
                  </div>
                  {contextFromPage.contextSummary && (
                    <div className="text-sm text-white/80 mt-1">
                      {contextFromPage.contextSummary}
                    </div>
                  )}
                  {contextFromPage.contextData && Object.keys(contextFromPage.contextData).length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(contextFromPage.contextData).slice(0, 5).map(([key, value]) => (
                        <span key={key} className="text-xs bg-blue-500/30 px-2 py-0.5 rounded">
                          {key}: {String(value).substring(0, 30)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setContextFromPage(null)}
                className="text-white/60 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        <div className="mb-4">
          <textarea
            ref={queryInputRef}
            value={queryInput}
            onChange={(e) => setQueryInput(e.target.value)}
            placeholder={t('council.placeholder')}
            rows={3}
            className={cn(
              'w-full px-4 py-3 rounded-lg resize-none',
              'bg-white/10 border border-white/20',
              'text-white placeholder:text-white/60',
              'focus:outline-none focus:ring-2 focus:ring-white/30'
            )}
          />

          {/* Demo Scenario Quick-Start Templates */}
          {!queryInput && (
            <div className="mt-3 mb-2">
              <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Quick-start scenarios</p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { label: 'Thomson Reuters', icon: '🏦', q: '$2.5M PEP Transfer to Viktor Petrov (Cyprus) — Basel III Compliance Review. The transfer involves a Politically Exposed Person with ties to sanctioned entities. Evaluate AML risk, regulatory exposure, and recommend proceed/block/escalate with full compliance documentation.' },
                  { label: 'FIFA / UEFA', icon: '⚽', q: 'A top-tier European club has signed a €180M player with payment structured across 6 years. Related-party sponsorship revenue offsets costs. A whistleblower alleges inflated commercial revenue and hidden agent fees. Evaluate FFP compliance, CAS appeal resilience, and recommended sanctions.' },
                  { label: 'Celtic FC', icon: '🏴', q: 'Should Celtic FC proceed with the £12M acquisition of a 23-year-old Portuguese midfielder from Benfica given current FFP constraints, January transfer window timing, squad depth at CM, and the player\'s loan performance metrics? Include agent fee analysis and sell-on clause recommendations.' },
                  { label: 'Luxury / ESG', icon: '💎', q: 'Should LUX proceed with sourcing high-value raw materials from Supplier X given recent human rights allegations in their supply chain, pending EU Due Diligence Directive requirements, and brand reputation exposure? Evaluate ESG compliance, alternative sourcing viability, and stakeholder communication strategy.' },
                  { label: 'VC Investment', icon: '📈', q: 'Should the fund proceed with a $15M Series B investment in an AI governance startup given current market correction (-22% sector valuations), strong product-market fit signals (40% MoM growth), founder concentration risk, and competitive landscape with 3 well-funded competitors? Model 3-year return scenarios.' },
                  { label: 'M&A Strategy', icon: '🏢', q: 'Should we proceed with the acquisition of DataShield Corp for $50M given regulatory approval risks in 3 jurisdictions, integration complexity with our existing platform, $12M annual synergy target, and current cash position of $80M? Evaluate deal structure, integration timeline, and antitrust exposure.' },
                ].map((tmpl) => (
                  <button
                    key={tmpl.label}
                    onClick={() => setQueryInput(tmpl.q)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg text-xs text-white/60 hover:text-white/90 transition-all"
                    title={tmpl.q.substring(0, 120) + '...'}
                  >
                    <span>{tmpl.icon}</span>
                    <span>{tmpl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Document Attachment Section */}
          <div className="mt-3">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt,.xlsx,.xls,.pptx,.ppt,.csv,.json,.md"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  setAttachedFiles((prev) => [...prev, ...files]);
                  // Extract text content using Tika
                  for (const file of files) {
                    try {
                      const mimeType = file.type || 'application/octet-stream';
                      let result: any = null;

                      let vaultDoc: any = null;
                      try {
                        vaultDoc = await vaultApi.uploadDocument(file, 'council-documents', {
                          uploadedBy: 'council-user',
                          deliberationType: selectedMode,
                        });
                      } catch {
                        vaultDoc = null;
                      }

                      if (
                        vaultDoc &&
                        typeof vaultDoc.id === 'string' &&
                        !vaultDoc.id.startsWith('local-')
                      ) {
                        result = await enterpriseApi.extractDocumentFromVault(
                          vaultDoc.bucket,
                          vaultDoc.path,
                          mimeType,
                          file.name
                        );
                      } else if (file.size <= 5 * 1024 * 1024) {
                        // Convert file to base64 (small files only)
                        const base64 = await new Promise<string>((resolve) => {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const r = reader.result as string;
                            resolve(r.split(',')[1] || r);
                          };
                          reader.readAsDataURL(file);
                        });
                        result = await enterpriseApi.extractDocument(base64, mimeType, file.name);
                      }

                      if (result?.text) {
                        setExtractedContent(
                          (prev) =>
                            prev +
                            (prev ? '\n\n---\n\n' : '') +
                            `[Document: ${file.name}]\n${result.text}`
                        );
                      }
                    } catch (err) {
                      console.log('Document extraction not available, using filename only');
                    }
                  }
                }
                e.target.value = '';
              }}
              className="hidden"
            />

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setShowWorkflowPicker(true)}
                className="flex items-center gap-2 px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded-lg text-sm transition-colors text-amber-200"
              >
                <span>📋</span>
                <span>Load Scenario</span>
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-sm transition-colors"
              >
                <span>📎</span>
                <span>Attach Documents</span>
              </button>

              {attachedFiles.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                  {attachedFiles.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 px-2 py-1 bg-white/20 rounded text-xs"
                    >
                      <span>📄</span>
                      <span className="max-w-[150px] truncate">{file.name}</span>
                      <button
                        onClick={() => {
                          setAttachedFiles((prev) => prev.filter((_, i) => i !== idx));
                          setExtractedContent('');
                        }}
                        className="hover:text-red-300"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {attachedFiles.length > 0 && (
              <p className="text-xs text-white/60 mt-2">
                📋 {attachedFiles.length} document{attachedFiles.length > 1 ? 's' : ''} attached.
                The Council will analyze{' '}
                {attachedFiles.length > 1 ? 'these documents' : 'this document'} during
                deliberation.
              </p>
            )}
          </div>
        </div>

        {/* D) Explicit Agent Selection - Auditable Roster */}
        <div className="mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">🧠 Selected Agents</span>
              {/* Why these agents? tooltip */}
              <div className="group relative">
                <button className="text-xs text-white/50 hover:text-white/80 underline">
                  Why these agents?
                </button>
                <div className="absolute bottom-full left-0 mb-2 w-72 p-3 bg-neutral-800 rounded-lg shadow-xl border border-neutral-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {getModeRationale(selectedMode)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {/* Lock roster for audit toggle */}
              <label className="flex items-center gap-2 text-xs text-white/70 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRosterLocked}
                  onChange={(e) => setIsRosterLocked(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-amber-500 focus:ring-amber-500 focus:ring-offset-0"
                />
                <span className={isRosterLocked ? 'text-amber-400' : ''}>
                  {isRosterLocked ? '🔒 Roster Locked' : '🔓 Lock for Audit'}
                </span>
              </label>
              <button
                onClick={selectAllAgents}
                disabled={isRosterLocked}
                className={cn(
                  'text-xs underline',
                  isRosterLocked
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/70 hover:text-white'
                )}
              >
                Select all online
              </button>
            </div>
          </div>

          {/* Selected Agents Pill Row */}
          <div className="flex flex-wrap gap-2">
            {selectedAgents.length === 0 ? (
              <span className="text-sm text-white/50 italic">
                All available agents will be consulted
              </span>
            ) : (
              selectedAgents.map((id) => {
                const agent = agents.find((a) => a.id === id);
                if (!agent) {return null;}
                return (
                  <div
                    key={id}
                    className={cn(
                      'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
                      isRosterLocked
                        ? 'bg-amber-900/30 border border-amber-700/50'
                        : 'bg-white/10 border border-white/20 hover:border-red-500/50 group'
                    )}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-xs"
                      style={{ backgroundColor: agent.color }}
                    >
                      {agent.avatar}
                    </div>
                    <span className="text-white/90">
                      {agent.name.replace('Cendia', '').replace(' Agent', '').trim()}
                    </span>
                    {!isRosterLocked && (
                      <button
                        onClick={() => setSelectedAgents((prev) => prev.filter((a) => a !== id))}
                        className="text-white/40 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        title="Remove agent"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {isRosterLocked && (
            <p className="mt-2 text-xs text-amber-400/80">
              🔒 Agent roster is locked for audit compliance. Unlock to modify.
            </p>
          )}
        </div>

        {/* Query mode and submit */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setQueryMode('quick')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                queryMode === 'quick'
                  ? 'bg-white text-primary-600'
                  : 'text-white/70 hover:text-white'
              )}
            >
              ⚡ Quick Brief
            </button>
            <button
              onClick={() => setQueryMode('deliberation')}
              className={cn(
                'px-4 py-2 rounded-md text-sm font-medium transition-colors',
                queryMode === 'deliberation'
                  ? 'bg-white text-primary-600'
                  : 'text-white/70 hover:text-white'
              )}
            >
              ⚖️ Governed Deliberation
            </button>
          </div>

          {/* Generate Minutes & Brief toggle - shown for Full Deliberation */}
          {queryMode === 'deliberation' && (
            <label className="flex items-center gap-2 text-sm text-white/80 cursor-pointer group">
              <input
                type="checkbox"
                defaultChecked={true}
                className="w-4 h-4 rounded border-white/30 bg-white/10 text-primary-500 focus:ring-primary-500 focus:ring-offset-0"
              />
              <span className="group-hover:text-white transition-colors">
                📝 Generate Minutes & Brief
              </span>
            </label>
          )}

          <button
            onClick={handleSubmit}
            disabled={!queryInput.trim() || isProcessing}
            className={cn(
              'flex-1 lg:flex-none px-8 py-2.5 rounded-lg font-medium transition-colors',
              'bg-white text-primary-600 hover:bg-white/90',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                Processing...
              </span>
            ) : queryMode === 'quick' ? (
              '⚡ Get Quick Brief'
            ) : (
              '⚖️ Start Deliberation'
            )}
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* RECENT DECISIONS - Full Width with All Agent Responses */}
      {/* ================================================================= */}
      <div className="bg-neutral-900 rounded-xl border border-neutral-700 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-700">
          <h2 className="text-lg font-semibold text-white">{t('council.recent_decisions')}</h2>
          <button 
            onClick={() => navigate('/cortex/decisions')}
            className="text-sm text-primary-400 hover:text-primary-300 font-medium"
          >
            {t('button.view_all')} →
          </button>
        </div>

        <div className="divide-y divide-neutral-800">
          {recentDecisions.length > 0 ? (
            recentDecisions.map((result) => (
              <div key={result.id} id={`decision-${result.id}`} className="p-6 transition-all duration-300">
                {/* Session Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        result.mode === 'deliberation'
                          ? 'bg-orange-900/50 text-orange-400'
                          : 'bg-blue-900/50 text-blue-400'
                      )}
                    >
                      {result.mode === 'deliberation'
                        ? '⚖️ GOVERNED DELIBERATION'
                        : '⚡ QUICK BRIEF'}
                    </span>
                    <span
                      className={cn(
                        'px-2 py-1 rounded text-xs font-medium',
                        !result.confidence || result.confidence === 0
                          ? 'bg-neutral-800 text-neutral-400'
                          : result.confidence >= 90
                            ? 'bg-green-900/50 text-green-400'
                            : result.confidence >= 70
                              ? 'bg-yellow-900/50 text-yellow-400'
                              : result.confidence >= 50
                                ? 'bg-orange-900/50 text-orange-400'
                                : 'bg-neutral-700 text-neutral-300'
                      )}
                    >
                      {!result.confidence || result.confidence === 0
                        ? result.currentPhase && result.currentPhase !== 'completed'
                          ? '◐ Calibrating...'
                          : result.agentResponses?.length === 0
                            ? '○ Pending Evidence'
                            : '—'
                        : result.confidence >= 90
                          ? '● High Confidence'
                          : result.confidence >= 70
                            ? '◑ Medium Confidence'
                            : '○ Low Confidence'}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatRelativeTime(result.answeredAt)}
                  </span>
                </div>

                {/* B) Decision Header - Executive framing layer */}
                <div className="mb-4 p-4 bg-gradient-to-r from-neutral-800 to-neutral-800/50 rounded-xl border border-neutral-700 sticky top-0 z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Decision Statement */}
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                        {result.query.length > 80
                          ? result.query.slice(0, 80) + '...'
                          : result.query}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Owner */}
                        <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                          👤 Owner: <span className="text-white font-medium">Current User</span>
                        </span>
                        {/* Mode */}
                        <span
                          className={cn(
                            'px-2 py-1 rounded',
                            result.mode === 'deliberation'
                              ? 'bg-orange-900/30 text-orange-400'
                              : 'bg-blue-900/30 text-blue-400'
                          )}
                        >
                          {result.mode === 'deliberation'
                            ? '⚖️ Governed Deliberation'
                            : '⚡ Quick Brief'}
                        </span>
                        {/* Inputs */}
                        <span className="px-2 py-1 bg-neutral-700 rounded text-neutral-300">
                          📎 Inputs:{' '}
                          <span className="text-white font-medium">
                            {result.agentResponses?.length || 0} analyses
                          </span>
                        </span>
                      </div>
                    </div>
                    {/* Status */}
                    <div className="flex flex-col items-end gap-2">
                      <span
                        className={cn(
                          'px-3 py-1.5 rounded-full text-xs font-semibold',
                          result.currentPhase === 'completed' || !result.currentPhase
                            ? 'bg-green-900/50 text-green-400 border border-green-700'
                            : 'bg-yellow-900/50 text-yellow-400 border border-yellow-700'
                        )}
                      >
                        {result.currentPhase === 'completed' || !result.currentPhase
                          ? '✓ Logged'
                          : '◐ In Review'}
                      </span>
                      {/* Impacted Domains */}
                      <div className="flex gap-1">
                        {['Finance', 'Ops', 'Risk']
                          .slice(0, Math.min(3, result.agents?.length || 1))
                          .map((domain, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400"
                            >
                              {domain}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Agent Progress Tracker */}
                {result.agentResponses && result.agentResponses.length > 0 && (
                  <div className="sticky top-[72px] z-10 -mx-6 px-6 py-3 bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-700 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-neutral-400 font-medium">Agent Progress:</span>
                      <span className="text-xs text-neutral-500">
                        {result.agentResponses.filter(ar => !ar.isStreaming && ar.response).length}/{result.agentResponses.length} complete
                      </span>
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {result.agentResponses.map((ar, idx) => (
                        <button
                          key={ar.agentId}
                          onClick={() => {
                            // Scroll to agent response
                            const el = document.getElementById(`agent-response-${result.id}-${ar.agentId}`);
                            if (el) {el.scrollIntoView({ behavior: 'smooth', block: 'center' });}
                          }}
                          className={cn(
                            'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs transition-all cursor-pointer',
                            ar.isStreaming
                              ? 'bg-green-900/50 text-green-400 ring-2 ring-green-500 ring-offset-1 ring-offset-neutral-900 animate-pulse'
                              : ar.response
                                ? 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                                : 'bg-neutral-800 text-neutral-500'
                          )}
                          title={`${ar.agentName} - ${ar.agentRole || 'Council Member'}`}
                        >
                          <span 
                            className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
                            style={{ backgroundColor: ar.agentColor || '#6366F1' }}
                          >
                            {ar.agentAvatar || '🤖'}
                          </span>
                          <span className="font-medium max-w-[80px] truncate">
                            {ar.agentName?.split(' ')[0] || `Agent ${idx + 1}`}
                          </span>
                          {ar.isStreaming && <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />}
                          {!ar.isStreaming && ar.response && <span className="text-green-400">✓</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* User Question */}
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm text-white font-medium">
                    U
                  </div>
                  <div className="flex-1 bg-neutral-800 rounded-lg px-4 py-3">
                    <p className="text-white font-medium">{result.query}</p>
                  </div>
                </div>

                {/* Phase Indicator */}
                {result.currentPhase && result.currentPhase !== 'completed' && (
                  <div className="flex items-center gap-2 mb-4 ml-14">
                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-xs text-orange-400 font-mono uppercase">
                      {result.currentPhase.replace('_', ' ')} in progress...
                    </span>
                  </div>
                )}

                {/* C) Conversational Flow - Chat-style deliberation */}
                <div className="space-y-4">
                  {/* INLINE: Agent Responses as Chat Messages */}
                  {result.agentResponses && result.agentResponses.length > 0 && (
                    <div className="space-y-4">
                      {result.agentResponses.map((agentResp, idx) => (
                        <div 
                          key={agentResp.agentId} 
                          id={`agent-response-${result.id}-${agentResp.agentId}`}
                          className={cn(
                            'flex items-start gap-3 scroll-mt-32 transition-all group',
                            agentResp.isStreaming && 'animate-in fade-in slide-in-from-bottom-2'
                          )}
                        >
                          {/* Agent Avatar with Online Indicator */}
                          <div className="flex-shrink-0 relative">
                            <div
                              className={cn(
                                'w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg transition-transform',
                                agentResp.isStreaming && 'ring-2 ring-green-500 ring-offset-2 ring-offset-neutral-900 scale-105'
                              )}
                              style={{ backgroundColor: agentResp.agentColor || '#6366F1' }}
                              title={`${agentResp.agentName} - ${agentResp.agentRole || 'Council Member'}`}
                            >
                              {agentResp.agentAvatar || '🤖'}
                            </div>
                            {/* Online/Active indicator */}
                            <div className={cn(
                              'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-neutral-900',
                              agentResp.isStreaming ? 'bg-green-500 animate-pulse' : 
                              agentResp.response ? 'bg-emerald-500' : 'bg-neutral-500'
                            )} />
                          </div>
                          
                          {/* Message Bubble */}
                          <div className="flex-1 min-w-0">
                            {/* Agent Name, Role & Timestamp */}
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-sm font-semibold text-white">
                                {agentResp.agentName}
                              </span>
                              <span className="text-[11px] text-neutral-500 px-1.5 py-0.5 bg-neutral-800 rounded">
                                {agentResp.agentRole || 'Council Member'}
                              </span>
                              {/* Real Timestamp */}
                              <span className="text-[10px] text-neutral-600">
                                {agentResp.isStreaming ? 'now' : 
                                  agentResp.timestamp ? (() => {
                                    const elapsed = Math.floor((Date.now() - agentResp.timestamp) / 1000);
                                    if (elapsed < 5) {return 'just now';}
                                    if (elapsed < 60) {return `${elapsed}s ago`;}
                                    if (elapsed < 3600) {return `${Math.floor(elapsed / 60)}m ago`;}
                                    return new Date(agentResp.timestamp).toLocaleTimeString();
                                  })() : 'just now'}
                              </span>
                              {agentResp.isStreaming && (
                                <span className="flex items-center gap-1.5 text-xs text-green-400 ml-auto">
                                  <span className="flex gap-0.5">
                                    <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <span className="w-1 h-1 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                  </span>
                                  typing
                                </span>
                              )}
                            </div>
                            
                            {/* Message Content */}
                            <div
                              className={cn(
                                'rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] relative',
                                agentResp.isStreaming 
                                  ? 'bg-green-900/30 border border-green-700/50' 
                                  : 'bg-neutral-800 hover:bg-neutral-750 transition-colors'
                              )}
                              style={{
                                borderLeftColor: !agentResp.isStreaming ? agentResp.agentColor : undefined,
                                borderLeftWidth: !agentResp.isStreaming ? '3px' : undefined,
                              }}
                            >
                              <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                {agentResp.response || (agentResp.isStreaming ? '▌' : '')}
                              </p>
                              
                              {/* Message Footer: Duration + Reactions */}
                              {!agentResp.isStreaming && agentResp.response && (
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-700/50">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-neutral-500">
                                      ⏱️ {agentResp.duration > 0 ? `${(agentResp.duration / 1000).toFixed(1)}s` : '< 1s'}
                                    </span>
                                    {/* Show existing reactions */}
                                    {agentResp.reactions && Object.entries(agentResp.reactions).filter(([, count]) => count > 0).map(([emoji, count]) => (
                                      <span key={emoji} className="px-1.5 py-0.5 bg-neutral-700 rounded text-xs flex items-center gap-1">
                                        {emoji} <span className="text-neutral-400">{count}</span>
                                      </span>
                                    ))}
                                  </div>
                                  {/* Quick Reactions - Functional */}
                                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {['👍', '🤔', '💡', '⚠️'].map((emoji) => (
                                      <button 
                                        key={emoji}
                                        onClick={() => {
                                          setRecentDecisions(prev => prev.map(d => {
                                            if (d.id !== result.id) {return d;}
                                            return {
                                              ...d,
                                              agentResponses: d.agentResponses.map(ar => {
                                                if (ar.agentId !== agentResp.agentId) {return ar;}
                                                const reactions = { ...(ar.reactions || {}) };
                                                reactions[emoji] = (reactions[emoji] || 0) + 1;
                                                return { ...ar, reactions };
                                              })
                                            };
                                          }));
                                        }}
                                        className={cn(
                                          'p-1 hover:bg-neutral-700 rounded text-xs transition-transform hover:scale-110',
                                          agentResp.reactions?.[emoji] && 'bg-neutral-700'
                                        )} 
                                        title={emoji === '👍' ? 'Helpful' : emoji === '🤔' ? 'Needs review' : emoji === '💡' ? 'Key insight' : 'Flag concern'}
                                      >
                                        {emoji}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Read receipt indicator */}
                            {!agentResp.isStreaming && agentResp.response && idx < result.agentResponses.length - 1 && (
                              <div className="flex items-center gap-1 mt-1 ml-2">
                                <span className="text-[9px] text-neutral-600">✓✓ Read by Council</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* USER MESSAGES - Human interjections (Teams/WhatsApp style - right aligned) */}
                  {result.userMessages && result.userMessages.length > 0 && (
                    <div className="space-y-3">
                      {result.userMessages.map((msg) => (
                        <div key={msg.id} className="flex items-start gap-3 justify-end">
                          <div className="flex-1 min-w-0 flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] text-neutral-600">
                                {(() => {
                                  const elapsed = Math.floor((Date.now() - msg.timestamp) / 1000);
                                  if (elapsed < 5) {return 'just now';}
                                  if (elapsed < 60) {return `${elapsed}s ago`;}
                                  return `${Math.floor(elapsed / 60)}m ago`;
                                })()}
                              </span>
                              <span className="text-sm font-semibold text-blue-400">You</span>
                            </div>
                            <div className="rounded-2xl rounded-tr-sm px-4 py-3 max-w-[85%] bg-blue-600 text-white shadow-lg">
                              <p className="whitespace-pre-wrap leading-relaxed text-sm">
                                {msg.content}
                              </p>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg">
                              You
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* USER INPUT - Sticky at bottom like Teams/WhatsApp */}
                  {result.currentPhase !== 'completed' && (
                    <div className="sticky bottom-0 bg-neutral-900/95 backdrop-blur-sm pt-3 pb-2 -mx-5 px-5 mt-4 border-t border-neutral-700/50">
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const input = e.currentTarget.querySelector('input') as HTMLInputElement;
                          const content = input?.value.trim();
                          if (!content) {return;}
                          
                          setRecentDecisions(prev => prev.map(d => {
                            if (d.id !== result.id) {return d;}
                            return {
                              ...d,
                              userMessages: [
                                ...(d.userMessages || []),
                                { id: `user-msg-${Date.now()}`, content, timestamp: Date.now() }
                              ]
                            };
                          }));
                          
                          input.value = '';
                        }}
                        className="flex gap-2 items-center"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                          You
                        </div>
                        <input
                          type="text"
                          placeholder="Type a message..."
                          className="flex-1 px-4 py-2.5 bg-neutral-800 border border-neutral-700 rounded-full text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-sm font-medium transition-colors"
                        >
                          Send
                        </button>
                      </form>
                    </div>
                  )}

                  {/* INLINE: Cross-Examination as Chat Messages */}
                  {result.crossExaminations && result.crossExaminations.length > 0 && (
                    <div className="space-y-3 mt-4 pt-4 border-t border-neutral-700/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">⚔️</span>
                        <span className="text-xs font-semibold text-yellow-400 uppercase tracking-wider">
                          Cross-Examination Phase
                        </span>
                      </div>
                      {result.crossExaminations.map((ce, idx) => (
                        <div key={idx} className="space-y-2">
                          {/* Challenge Message */}
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <div
                                className="w-9 h-9 rounded-full flex items-center justify-center text-lg shadow-lg"
                                style={{ backgroundColor: ce.challengerColor || '#EAB308' }}
                              >
                                {ce.challengerAvatar || '⚔️'}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-semibold text-yellow-400">
                                  {ce.challengerName}
                                </span>
                                <span className="text-xs text-neutral-500">
                                  challenges {ce.targetName}
                                </span>
                              </div>
                              <div className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] bg-yellow-900/20 border-l-3 border-yellow-500">
                                <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                  {ce.challenge}
                                </p>
                              </div>
                            </div>
                          </div>
                          {/* Rebuttal Message */}
                          {ce.rebuttal && (
                            <div className="flex items-start gap-3 ml-6">
                              <div className="flex-shrink-0">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-cyan-600 shadow-lg">
                                  💬
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm font-semibold text-cyan-400">
                                    {ce.targetName}
                                  </span>
                                  <span className="text-xs text-neutral-500">responds</span>
                                </div>
                                <div className="rounded-2xl rounded-tl-sm px-4 py-3 max-w-[95%] bg-cyan-900/20 border-l-3 border-cyan-500">
                                  <p className="text-neutral-200 whitespace-pre-wrap leading-relaxed text-sm">
                                    {ce.rebuttal}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* FINAL: Council Synthesis/Recommendation */}
                  {result.response && (
                    <div className="mt-4 pt-4 border-t border-neutral-700/50">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 flex items-center justify-center text-xl shadow-lg ring-2 ring-primary-500/50">
                            🎯
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-primary-400">
                              Council Synthesis
                            </span>
                            <span className="px-2 py-0.5 bg-primary-900/50 text-primary-300 rounded text-xs">
                              Final Recommendation
                            </span>
                            {result.confidence > 0 && (
                              <span className={cn(
                                'px-2 py-0.5 rounded text-xs font-medium',
                                result.confidence >= 80 ? 'bg-green-900/50 text-green-400' :
                                result.confidence >= 60 ? 'bg-yellow-900/50 text-yellow-400' :
                                'bg-red-900/50 text-red-400'
                              )}>
                                {result.confidence}% confidence
                              </span>
                            )}
                          </div>
                          <div className="rounded-2xl rounded-tl-sm px-4 py-4 max-w-[98%] bg-gradient-to-r from-primary-900/30 to-emerald-900/30 border-l-4 border-primary-500">
                            <p className="text-neutral-100 whitespace-pre-wrap leading-relaxed">
                              {result.response}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Document Actions */}
                  {result.mode === 'deliberation' &&
                    result.currentPhase === 'completed' &&
                    result.response && (
                      <div className="flex items-center gap-3 mt-6 pt-4 border-t border-neutral-700">
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id in save response');
                              }

                              // Generate summary
                              const summaryRes =
                                await councilApi.generateExecutiveSummary(deliberationId);
                              const summaryData = await safeJson<any>(
                                summaryRes,
                                'generate executive summary'
                              );

                              // Show in new window
                              const summaryWindow = window.open('', '_blank');
                              if (summaryWindow) {
                                summaryWindow.document.write(`
                              <html><head><title>Executive Summary</title>
                              <style>
                                body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
                                h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                                h2 { color: #374151; margin-top: 24px; }
                                .rec { background: #f0fdf4; padding: 16px; border-radius: 8px; border-left: 4px solid #22c55e; }
                                ul { line-height: 1.8; }
                              </style></head><body>
                              <h1>📋 ${summaryData.summary.title}</h1>
                              <p><strong>Date:</strong> ${new Date(summaryData.summary.date).toLocaleDateString()}</p>
                              <p><strong>Confidence:</strong> ${summaryData.summary.confidence}%</p>
                              <h2>Question</h2><p>${summaryData.summary.question}</p>
                              <h2>Recommendation</h2><div class="rec">${summaryData.summary.recommendation}</div>
                              <h2>Key Findings</h2><ul>${summaryData.summary.keyFindings.map((f: string) => '<li>' + f + '</li>').join('')}</ul>
                              <h2>Risk Factors</h2><ul>${summaryData.summary.riskFactors.map((r: string) => '<li>' + r + '</li>').join('')}</ul>
                              <h2>Next Steps</h2><ul>${summaryData.summary.nextSteps.map((s: string) => '<li>' + s + '</li>').join('')}</ul>
                              </body></html>
                            `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to generate summary:', msg);
                              alert(`Failed to generate summary: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          📋 Executive Summary
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id in save response');
                              }

                              // Generate minutes
                              const minutesRes = await councilApi.generateMinutes(deliberationId);
                              const minutesData = await safeJson<any>(
                                minutesRes,
                                'generate deliberation minutes'
                              );

                              // Show in new window
                              const minutesWindow = window.open('', '_blank');
                              if (minutesWindow) {
                                minutesWindow.document.write(`
                              <html><head><title>Deliberation Minutes</title>
                              <style>
                                body { font-family: system-ui; max-width: 800px; margin: 40px auto; padding: 20px; }
                                h1 { color: #1a1a1a; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
                                h2 { color: #374151; margin-top: 24px; }
                                .entry { padding: 12px; margin: 8px 0; border-radius: 8px; }
                                .statement { background: #f3f4f6; border-left: 3px solid #6b7280; }
                                .challenge { background: #fef3c7; border-left: 3px solid #f59e0b; }
                                .response { background: #e0f2fe; border-left: 3px solid #0ea5e9; }
                                .resolution { background: #dcfce7; border-left: 3px solid #22c55e; }
                                .speaker { font-weight: 600; color: #374151; }
                                .time { font-size: 12px; color: #9ca3af; }
                              </style></head><body>
                              <h1>📝 ${minutesData.minutes.title}</h1>
                              <p><strong>Date:</strong> ${new Date(minutesData.minutes.date).toLocaleDateString()}</p>
                              <p><strong>Agenda:</strong> ${minutesData.minutes.agenda}</p>
                              <h2>Attendees</h2>
                              <ul>${minutesData.minutes.attendees.map((a: any) => '<li><strong>' + a.name + '</strong> - ' + a.role + '</li>').join('')}</ul>
                              <h2>Proceedings</h2>
                              ${minutesData.minutes.proceedings
                                .map(
                                  (p: any) =>
                                    '<div class="entry ' +
                                    p.type +
                                    '">' +
                                    '<span class="speaker">' +
                                    p.speaker +
                                    '</span> <span class="time">(' +
                                    p.speakerRole +
                                    ')</span>' +
                                    '<p>' +
                                    p.content +
                                    '</p></div>'
                                )
                                .join('')}
                              <h2>Resolutions</h2>
                              <ul>${minutesData.minutes.resolutions.map((r: string) => '<li>' + r + '</li>').join('')}</ul>
                              <h2>Action Items</h2>
                              <ul>${minutesData.minutes.actionItems.map((a: any) => '<li><strong>' + a.action + '</strong> - Owner: ' + a.owner + '</li>').join('')}</ul>
                              </body></html>
                            `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to generate minutes:', msg);
                              alert(`Failed to generate minutes: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          📝 Generate Minutes
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              alert('Deliberation saved! ID: ' + deliberationId);
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to save:', msg);
                              alert(`Failed to save: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          💾 Save
                        </button>
                        
                        {/* Regulator's Receipt Button */}
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId =
                                (saveData as any).deliberation?.id ?? (saveData as any).id;
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id in save response');
                              }

                              // Build decision packet
                              const packet = await councilPacketApi.buildPacket({
                                deliberationId,
                                regulatoryFrameworks: ['SOX', 'GDPR', 'EU AI Act'],
                                retentionYears: 7,
                              });

                              // Sign the packet
                              const signedPacket = await councilPacketApi.signPacket(packet.id);

                              // Display the Regulator's Receipt
                              const receiptWindow = window.open('', '_blank');
                              if (receiptWindow) {
                                receiptWindow.document.write(`
                                  <html><head><title>Regulator's Receipt - ${signedPacket.runId}</title>
                                  <style>
                                    body { font-family: 'SF Mono', 'Consolas', monospace; max-width: 900px; margin: 40px auto; padding: 20px; background: #0f172a; color: #e2e8f0; }
                                    h1 { color: #22c55e; border-bottom: 2px solid #22c55e; padding-bottom: 10px; display: flex; align-items: center; gap: 12px; }
                                    h2 { color: #60a5fa; margin-top: 24px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
                                    .badge { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: 600; }
                                    .signed { background: #166534; color: #86efac; }
                                    .verified { background: #1e40af; color: #93c5fd; }
                                    .section { background: #1e293b; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #3b82f6; }
                                    .hash { font-family: monospace; font-size: 11px; color: #94a3b8; word-break: break-all; background: #0f172a; padding: 8px; border-radius: 4px; }
                                    .agent { display: flex; align-items: center; gap: 8px; padding: 8px; background: #334155; border-radius: 6px; margin: 4px 0; }
                                    .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
                                    .meta-item { background: #1e293b; padding: 12px; border-radius: 6px; }
                                    .meta-label { font-size: 10px; color: #64748b; text-transform: uppercase; }
                                    .meta-value { font-size: 14px; color: #f1f5f9; margin-top: 4px; }
                                    .timestamp { color: #94a3b8; font-size: 12px; }
                                    ul { list-style: none; padding: 0; }
                                    li { padding: 6px 0; border-bottom: 1px solid #334155; }
                                    .signature-block { background: linear-gradient(135deg, #166534 0%, #14532d 100%); padding: 20px; border-radius: 12px; margin-top: 24px; }
                                    .sig-label { font-size: 10px; color: #86efac; text-transform: uppercase; letter-spacing: 2px; }
                                    .sig-value { font-family: monospace; font-size: 10px; color: #dcfce7; word-break: break-all; margin-top: 8px; }
                                  </style></head><body>
                                  <h1>🔐 Regulator's Receipt <span class="badge signed">✓ SIGNED</span></h1>
                                  
                                  <div class="meta">
                                    <div class="meta-item">
                                      <div class="meta-label">Run ID</div>
                                      <div class="meta-value">${signedPacket.runId}</div>
                                    </div>
                                    <div class="meta-item">
                                      <div class="meta-label">Packet ID</div>
                                      <div class="meta-value">${signedPacket.id}</div>
                                    </div>
                                    <div class="meta-item">
                                      <div class="meta-label">Created</div>
                                      <div class="meta-value">${new Date(signedPacket.createdAt).toLocaleString()}</div>
                                    </div>
                                    <div class="meta-item">
                                      <div class="meta-label">Confidence</div>
                                      <div class="meta-value">${signedPacket.confidence}% (${signedPacket.confidenceBounds.lower}-${signedPacket.confidenceBounds.upper}%)</div>
                                    </div>
                                  </div>

                                  <h2>📋 Decision Question</h2>
                                  <div class="section">${signedPacket.question}</div>

                                  <h2>🎯 Recommendation</h2>
                                  <div class="section">${signedPacket.recommendation}</div>

                                  <h2>🧠 Agent Contributions (${signedPacket.agentContributions.length})</h2>
                                  <div class="section">
                                    ${signedPacket.agentContributions.map(ac => `
                                      <div class="agent">
                                        <strong>${ac.agentName}</strong> 
                                        <span style="color: #94a3b8">(${ac.agentRole})</span>
                                        <span class="badge verified">${ac.confidence}% conf</span>
                                      </div>
                                    `).join('')}
                                  </div>

                                  <h2>📜 Regulatory Frameworks</h2>
                                  <div class="section">
                                    ${signedPacket.regulatoryFrameworks.map(rf => `<span class="badge" style="background:#1e40af;color:#93c5fd;margin-right:8px">${rf}</span>`).join('')}
                                  </div>

                                  <h2>🔗 Merkle Root (Integrity Hash)</h2>
                                  <div class="hash">${signedPacket.merkleRoot}</div>

                                  <div class="signature-block">
                                    <div class="sig-label">Cryptographic Signature</div>
                                    <div class="sig-value">${signedPacket.signature?.signature || 'Pending signature'}</div>
                                    <div style="margin-top:12px;display:flex;gap:16px">
                                      <div><span class="sig-label">Algorithm:</span> <span style="color:#dcfce7">${signedPacket.signature?.algorithm || 'N/A'}</span></div>
                                      <div><span class="sig-label">Key ID:</span> <span style="color:#dcfce7">${signedPacket.signature?.keyId || 'N/A'}</span></div>
                                      <div><span class="sig-label">Provider:</span> <span style="color:#dcfce7">${signedPacket.signature?.provider || 'N/A'}</span></div>
                                    </div>
                                    <div style="margin-top:8px"><span class="sig-label">Signed At:</span> <span style="color:#dcfce7">${signedPacket.signature?.timestamp || 'N/A'}</span></div>
                                  </div>

                                  <h2>📁 Artifact Hashes</h2>
                                  <div class="section">
                                    ${Object.entries(signedPacket.artifactHashes || {}).map(([k, v]) => `
                                      <div style="margin:4px 0"><strong>${k}:</strong> <code class="hash" style="display:inline;padding:2px 6px">${v}</code></div>
                                    `).join('')}
                                  </div>

                                  <p class="timestamp" style="margin-top:24px;text-align:center">
                                    Retention Until: ${new Date(signedPacket.retentionUntil).toLocaleDateString()} • 
                                    Generated by Datacendia Decision DNA™
                                  </p>
                                </body></html>
                              `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to generate Regulator\'s Receipt:', msg);
                              alert(`Failed to generate Regulator's Receipt: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                          🔐 Regulator's Receipt
                        </button>

                        {/* CendiaNotary - Sign & Authenticate */}
                        <button
                          onClick={async () => {
                            try {
                              // Sign the deliberation with KMS
                              const dataToSign = JSON.stringify({
                                question: result.query,
                                response: result.response,
                                confidence: result.confidence,
                                agents: result.agents,
                                timestamp: new Date().toISOString(),
                              });
                              
                              const signResult = await councilPacketApi.signData(dataToSign);
                              
                              // Display notarization certificate
                              const notaryWindow = window.open('', '_blank');
                              if (notaryWindow) {
                                notaryWindow.document.write(`
                                  <html><head><title>CendiaNotary™ Certificate</title>
                                  <style>
                                    body { font-family: 'Georgia', serif; max-width: 700px; margin: 40px auto; padding: 40px; background: linear-gradient(135deg, #fefce8 0%, #fef9c3 100%); }
                                    .certificate { background: white; padding: 40px; border: 3px double #b45309; border-radius: 8px; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
                                    h1 { color: #92400e; text-align: center; font-size: 28px; margin-bottom: 8px; letter-spacing: 2px; }
                                    .subtitle { text-align: center; color: #a16207; font-style: italic; margin-bottom: 30px; }
                                    .seal { text-align: center; font-size: 64px; margin: 20px 0; }
                                    .field { margin: 16px 0; padding: 12px; background: #fffbeb; border-left: 4px solid #f59e0b; }
                                    .label { font-size: 10px; color: #92400e; text-transform: uppercase; letter-spacing: 1px; }
                                    .value { font-size: 14px; color: #1f2937; margin-top: 4px; word-break: break-all; }
                                    .signature-box { margin-top: 30px; padding: 20px; background: #fef3c7; border-radius: 8px; text-align: center; }
                                    .sig { font-family: monospace; font-size: 9px; color: #78350f; word-break: break-all; }
                                    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #a16207; }
                                  </style></head><body>
                                  <div class="certificate">
                                    <h1>CERTIFICATE OF AUTHENTICITY</h1>
                                    <p class="subtitle">CendiaNotary™ Cryptographic Signing Authority</p>
                                    <div class="seal">🔏</div>
                                    
                                    <div class="field">
                                      <div class="label">Decision Summary</div>
                                      <div class="value">${result.query.slice(0, 200)}${result.query.length > 200 ? '...' : ''}</div>
                                    </div>
                                    
                                    <div class="field">
                                      <div class="label">Signing Algorithm</div>
                                      <div class="value">${signResult.algorithm}</div>
                                    </div>
                                    
                                    <div class="field">
                                      <div class="label">Key Identifier</div>
                                      <div class="value">${signResult.keyId}</div>
                                    </div>
                                    
                                    <div class="field">
                                      <div class="label">Timestamp</div>
                                      <div class="value">${new Date(signResult.timestamp).toLocaleString()}</div>
                                    </div>
                                    
                                    <div class="field">
                                      <div class="label">Provider</div>
                                      <div class="value">${signResult.provider}</div>
                                    </div>
                                    
                                    <div class="signature-box">
                                      <div class="label" style="margin-bottom: 8px">Digital Signature</div>
                                      <div class="sig">${signResult.signature}</div>
                                    </div>
                                    
                                    <p class="footer">
                                      This document has been cryptographically signed and authenticated.<br/>
                                      Verify at: datacendia.com/verify/${signResult.keyId.slice(0, 8)}
                                    </p>
                                  </div>
                                </body></html>
                              `);
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to notarize:', msg);
                              alert(`Failed to notarize: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                          🔏 CendiaNotary
                        </button>

                        {/* CendiaVault - Archive to Evidence Storage */}
                        <button
                          onClick={async () => {
                            try {
                              // Create a JSON blob of the deliberation
                              const deliberationData = {
                                id: result.id,
                                question: result.query,
                                response: result.response,
                                confidence: result.confidence,
                                agents: result.agents,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                mode: result.mode,
                                answeredAt: result.answeredAt,
                                archivedAt: new Date().toISOString(),
                              };
                              
                              const blob = new Blob([JSON.stringify(deliberationData, null, 2)], { type: 'application/json' });
                              const file = new File([blob], `deliberation-${result.id}.json`, { type: 'application/json' });
                              
                              // Upload to CendiaVault
                              const vaultDoc = await vaultApi.uploadDocument(file, 'evidence-vault', {
                                type: 'deliberation',
                                deliberationId: result.id,
                                confidence: result.confidence,
                                agentCount: result.agents.length,
                              });
                              
                              if (vaultDoc) {
                                alert(`✅ Archived to CendiaVault™\n\nBucket: ${vaultDoc.bucket}\nPath: ${vaultDoc.path}\nSize: ${vaultDoc.size} bytes\n\nThis deliberation is now stored in immutable evidence storage.`);
                              } else {
                                alert('Archived locally (vault service unavailable)');
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to archive:', msg);
                              alert(`Failed to archive: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                          📦 CendiaVault
                        </button>

                        {/* Decision DNA - Export Full Lineage */}
                        <button
                          onClick={async () => {
                            try {
                              // Save deliberation first to get ID
                              const saveRes = await councilApi.saveDeliberation({
                                question: result.query,
                                mode: result.mode,
                                agentResponses: result.agentResponses,
                                crossExaminations: result.crossExaminations,
                                synthesis: result.response,
                                confidence: result.confidence,
                              });
                              const saveData = await safeJson<any>(saveRes, 'save deliberation');
                              const deliberationId = (saveData as any).deliberation?.id ?? (saveData as any).id;
                              
                              if (!deliberationId) {
                                throw new Error('Missing deliberation id');
                              }

                              // Call Decision DNA export endpoint
                              const dnaRes = await fetch(`http://localhost:3000/api/v1/sovereign-arch/dna/export/${deliberationId}`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ includeRawResponses: true }),
                              });
                              const dnaData = await dnaRes.json();
                              
                              if (dnaData.success) {
                                // Display DNA summary
                                const dnaWindow = window.open('', '_blank');
                                if (dnaWindow) {
                                  const dna = dnaData.data.dna;
                                  dnaWindow.document.write(`
                                    <html><head><title>Decision DNA™ - ${dna.id}</title>
                                    <style>
                                      body { font-family: system-ui; max-width: 900px; margin: 40px auto; padding: 20px; background: #030712; color: #e5e7eb; }
                                      h1 { color: #a78bfa; display: flex; align-items: center; gap: 12px; }
                                      h2 { color: #818cf8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-top: 24px; border-bottom: 1px solid #374151; padding-bottom: 8px; }
                                      .dna-helix { font-size: 48px; animation: spin 3s linear infinite; }
                                      @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                                      .section { background: #111827; padding: 16px; border-radius: 8px; margin: 12px 0; border-left: 4px solid #8b5cf6; }
                                      .hash { font-family: monospace; font-size: 11px; color: #9ca3af; word-break: break-all; background: #1f2937; padding: 8px; border-radius: 4px; }
                                      .participant { display: inline-block; padding: 4px 12px; background: #1e1b4b; color: #c4b5fd; border-radius: 16px; margin: 4px; font-size: 12px; }
                                      .meta-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
                                      .meta-item { background: #111827; padding: 12px; border-radius: 6px; }
                                      .meta-label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
                                      .meta-value { font-size: 16px; color: #f3f4f6; margin-top: 4px; }
                                      .bundle-link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: linear-gradient(135deg, #7c3aed, #4f46e5); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; }
                                    </style></head><body>
                                    <h1><span class="dna-helix">🧬</span> Decision DNA™</h1>
                                    
                                    <div class="meta-grid">
                                      <div class="meta-item">
                                        <div class="meta-label">DNA ID</div>
                                        <div class="meta-value">${dna.id.slice(0, 12)}...</div>
                                      </div>
                                      <div class="meta-item">
                                        <div class="meta-label">Version</div>
                                        <div class="meta-value">${dna.version}</div>
                                      </div>
                                      <div class="meta-item">
                                        <div class="meta-label">Generated</div>
                                        <div class="meta-value">${new Date(dna.generatedAt).toLocaleString()}</div>
                                      </div>
                                    </div>

                                    <h2>📋 Decision</h2>
                                    <div class="section">${dna.deliberation?.question || result.query}</div>

                                    <h2>🎯 Outcome</h2>
                                    <div class="section">${dna.deliberation?.synthesis || result.response}</div>

                                    <h2>👥 Participants</h2>
                                    <div class="section">
                                      ${(dna.participants || result.agents).map((p: any) => 
                                        '<span class="participant">' + (p.name || p) + '</span>'
                                      ).join('')}
                                    </div>

                                    <h2>🔗 Merkle Root (Integrity Proof)</h2>
                                    <div class="hash">${dna.merkleRoot}</div>

                                    <h2>📁 Artifact Hashes</h2>
                                    <div class="section">
                                      ${Object.entries(dna.artifactHashes || {}).map(([k, v]) => 
                                        '<div style="margin:4px 0"><strong>' + k + ':</strong> <code class="hash" style="display:inline;padding:2px 6px">' + v + '</code></div>'
                                      ).join('')}
                                    </div>

                                    <h2>📦 Export Bundle</h2>
                                    <div class="section">
                                      <p>Bundle saved to: <code>${dnaData.data.bundlePath || 'local storage'}</code></p>
                                      <p style="color:#9ca3af;font-size:12px;margin-top:8px">Contains: PDF report, JSON data, agent responses, cross-examinations, and Merkle proof</p>
                                    </div>

                                    <p style="text-align:center;margin-top:30px;color:#6b7280;font-size:12px">
                                      Decision DNA™ provides immutable lineage tracking for regulatory compliance.<br/>
                                      Generated by Datacendia Enterprise Platform
                                    </p>
                                  </body></html>
                                `);
                                }
                              } else {
                                throw new Error(dnaData.error || 'Failed to generate DNA');
                              }
                            } catch (err) {
                              const msg = err instanceof Error ? err.message : String(err);
                              console.error('[ERROR] Failed to export Decision DNA:', msg);
                              alert(`Failed to export Decision DNA: ${msg}`);
                            }
                          }}
                          className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg"
                        >
                          🧬 Decision DNA
                        </button>
                        
                        {/* Service Integration Dropdown */}
                        <div className="relative group">
                          <button className="flex items-center gap-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
                            🔗 Services ▾
                          </button>
                          <div className="absolute right-0 mt-1 w-56 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <button
                              onClick={async () => {
                                const res = await fetch('http://localhost:3000/api/v1/consolidated/pre-mortem/analyze', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ decision: result.query, context: result.response }),
                                });
                                const data = await res.json();
                                setServiceResults(data);
                                setActiveService('pre-mortem');
                                setShowServicePanel(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-amber-300 hover:bg-neutral-700 rounded-t-lg"
                            >
                              ⚠️ Pre-Mortem Analysis
                            </button>
                            <button
                              onClick={async () => {
                                const res = await fetch('http://localhost:3000/api/v1/consolidated/crucible/status');
                                const data = await res.json();
                                setServiceResults({ ...data, deliberation: result });
                                setActiveService('crucible');
                                setShowServicePanel(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-neutral-700"
                            >
                              🔥 Crucible Stress Test
                            </button>
                            <button
                              onClick={async () => {
                                const res = await fetch('http://localhost:3000/api/v1/consolidated/oversight/status');
                                const data = await res.json();
                                setServiceResults({ ...data, deliberation: result });
                                setActiveService('oversight');
                                setShowServicePanel(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-300 hover:bg-neutral-700"
                            >
                              🛡️ Oversight Compliance
                            </button>
                            <button
                              onClick={async () => {
                                const res = await fetch('http://localhost:3000/api/v1/consolidated/ghost-board/rehearse', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ topic: result.query, presentationNotes: result.response }),
                                });
                                const data = await res.json();
                                setServiceResults(data);
                                setActiveService('ghost-board');
                                setShowServicePanel(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-purple-300 hover:bg-neutral-700"
                            >
                              👻 Ghost Board Rehearsal
                            </button>
                            <button
                              onClick={async () => {
                                const res = await fetch('http://localhost:3000/api/v1/consolidated/decision-debt/list');
                                const data = await res.json();
                                setServiceResults(data);
                                setActiveService('decision-debt');
                                setShowServicePanel(true);
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-orange-300 hover:bg-neutral-700 rounded-b-lg"
                            >
                              ⏰ Decision Debt Tracker
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-neutral-500">
              <p className="text-4xl mb-3">💭</p>
              <p className="mb-4">{t('council.no_decisions')}</p>
              
              {/* Starter Prompts */}
              <div className="mt-6 space-y-2">
                <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Try a sample question:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { emoji: '🌍', prompt: 'Should we expand into the EU market given current regulations?' },
                    { emoji: '💰', prompt: 'Analyze the ROI of our AI investment over the next 3 years' },
                    { emoji: '⚠️', prompt: 'What are the top 5 risks to our Q4 revenue targets?' },
                    { emoji: '🤝', prompt: 'How should we respond to the competitor acquisition?' },
                  ].map((starter, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQueryInput(starter.prompt);
                        queryInputRef.current?.focus();
                      }}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:text-white transition-colors"
                    >
                      <span>{starter.emoji}</span>
                      <span className="max-w-[200px] truncate">{starter.prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ACTIVE DELIBERATIONS */}
      {/* ================================================================= */}
      {deliberations.length > 0 && (
        <div className="bg-white rounded-xl border border-neutral-200 p-6 mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Active Deliberations</h2>
            <span className="text-xs text-neutral-500">Click to scroll to live view ↑</span>
          </div>
          <div className="space-y-4">
            {deliberations.map((deliberation) => (
              <DeliberationCard
                key={deliberation.id}
                deliberation={deliberation}
                agents={allAgents}
                onClick={() => {
                  // Find the corresponding decision in Recent Decisions and scroll to it
                  const decisionElement = document.getElementById(`decision-${deliberation.id}`);
                  if (decisionElement) {
                    decisionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add highlight effect
                    decisionElement.classList.add('ring-2', 'ring-primary-500', 'ring-offset-2');
                    setTimeout(() => {
                      decisionElement.classList.remove('ring-2', 'ring-primary-500', 'ring-offset-2');
                    }, 2000);
                  } else {
                    // Fallback: navigate to deliberation page
                    navigate(`/cortex/council/deliberation/${deliberation.id}`);
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* CUSTOM AGENT CREATOR MODAL */}
      {/* ================================================================= */}
      <CustomAgentCreator
        isOpen={showAgentCreator}
        onClose={() => {
          setShowAgentCreator(false);
          setEditingAgent(null);
        }}
        onSave={handleSaveCustomAgent}
        onDelete={handleDeleteCustomAgent}
        editingAgent={editingAgent}
        t={t}
      />

      {/* ================================================================= */}
      {/* PREMIUM FEATURES MODAL */}
      {/* ================================================================= */}
      <PremiumFeaturesModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePremiumPurchase}
        currentFeatures={premium.getUnlockedFeatures()}
      />

      {/* Page Guide */}
      <PageGuide {...GUIDES.council} />

      {/* ================================================================= */}
      {/* WORKFLOW PICKER MODAL */}
      {/* ================================================================= */}
      <WorkflowPicker
        isOpen={showWorkflowPicker}
        onClose={() => setShowWorkflowPicker(false)}
        onSelect={(scenario) => {
          // Auto-fill the question
          setQueryInput(scenario.councilQuestion);
          // Set the council mode
          if (scenario.councilMode && COUNCIL_MODES[scenario.councilMode]) {
            setSelectedMode(scenario.councilMode);
          }
          // Focus the input
          queryInputRef.current?.focus();
        }}
        currentMode={selectedMode}
      />

      {/* ================================================================= */}
      {/* PANTHEON - AI AGENT SHOWCASE */}
      {/* ================================================================= */}
      {showPantheon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-purple-950 rounded-2xl shadow-2xl w-[95vw] max-w-6xl max-h-[90vh] overflow-hidden border border-indigo-500/30">
            {/* Header */}
            <div className="relative p-6 border-b border-indigo-500/30 bg-gradient-to-r from-indigo-900/50 to-purple-900/50">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAzMHYySDI0di0yaDEyek0zNiAyNnYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg shadow-amber-500/30">
                    🏛️
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">The Pantheon</h2>
                    <p className="text-indigo-300 text-sm">Your Council of AI Executives</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-indigo-300">Active Agents</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {allAgents.filter(a => a.status === 'online').length} / {allAgents.length}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPantheon(false)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Agent Grid */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Core C-Suite */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/30 flex items-center justify-center text-lg">👔</div>
                  <h3 className="text-lg font-semibold text-white">Core C-Suite</h3>
                  <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/50 to-transparent" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {allAgents
                    .filter(a => !a.premium && !a.isCustom)
                    .map((agent) => (
                      <div
                        key={agent.id}
                        className={cn(
                          'relative p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer group',
                          agent.status === 'online'
                            ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-emerald-500/50 shadow-lg shadow-emerald-500/10'
                            : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                        )}
                        onClick={() => {
                          toggleAgentSelection(agent.id);
                          setShowPantheon(false);
                        }}
                      >
                        {/* Status indicator */}
                        <div className={cn(
                          'absolute top-3 right-3 w-3 h-3 rounded-full',
                          agent.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                        )} />
                        
                        {/* Avatar */}
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                          style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}40` }}
                        >
                          {agent.avatar}
                        </div>
                        
                        {/* Info */}
                        <div className="text-white font-semibold text-sm mb-1 group-hover:text-indigo-300 transition-colors">
                          {agent.name}
                        </div>
                        <div className="text-slate-400 text-xs mb-2">{agent.role}</div>
                        
                        {/* Capabilities */}
                        <div className="flex flex-wrap gap-1">
                          {agent.capabilities.slice(0, 2).map((cap, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded">
                              {cap}
                            </span>
                          ))}
                        </div>
                        
                        {/* Selection indicator */}
                        {selectedAgents.includes(agent.id) && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                            ✓
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* Premium Agents */}
              {allAgents.filter(a => a.premium && premium.hasAgentAccess(a.id)).length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/30 flex items-center justify-center text-lg">⭐</div>
                    <h3 className="text-lg font-semibold text-white">Premium Agents</h3>
                    <span className="text-xs px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-full">Unlocked</span>
                    <div className="flex-1 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allAgents
                      .filter(a => a.premium && premium.hasAgentAccess(a.id))
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className={cn(
                            'relative p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer group',
                            agent.status === 'online'
                              ? 'bg-gradient-to-br from-amber-900/30 to-orange-900/30 border-amber-500/50 shadow-lg shadow-amber-500/10'
                              : 'bg-slate-900/50 border-slate-700/50 opacity-60'
                          )}
                          onClick={() => {
                            toggleAgentSelection(agent.id);
                            setShowPantheon(false);
                          }}
                        >
                          <div className={cn(
                            'absolute top-3 right-3 w-3 h-3 rounded-full',
                            agent.status === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                          )} />
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                            style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}40` }}
                          >
                            {agent.avatar}
                          </div>
                          <div className="text-white font-semibold text-sm mb-1 group-hover:text-amber-300 transition-colors">
                            {agent.name}
                          </div>
                          <div className="text-slate-400 text-xs mb-2">{agent.role}</div>
                          <div className="flex flex-wrap gap-1">
                            {agent.capabilities.slice(0, 2).map((cap, i) => (
                              <span key={i} className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded">
                                {cap}
                              </span>
                            ))}
                          </div>
                          {selectedAgents.includes(agent.id) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Custom Agents */}
              {allAgents.filter(a => a.isCustom).length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-lg">✨</div>
                    <h3 className="text-lg font-semibold text-white">Custom Agents</h3>
                    <div className="flex-1 h-px bg-gradient-to-r from-purple-500/50 to-transparent" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {allAgents
                      .filter(a => a.isCustom)
                      .map((agent) => (
                        <div
                          key={agent.id}
                          className={cn(
                            'relative p-4 rounded-xl border transition-all hover:scale-105 cursor-pointer group',
                            'bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border-purple-500/50 shadow-lg shadow-purple-500/10'
                          )}
                          onClick={() => {
                            toggleAgentSelection(agent.id);
                            setShowPantheon(false);
                          }}
                        >
                          <div className="absolute top-3 right-3 w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3"
                            style={{ backgroundColor: `${agent.color}20`, border: `2px solid ${agent.color}40` }}
                          >
                            {agent.avatar}
                          </div>
                          <div className="text-white font-semibold text-sm mb-1 group-hover:text-purple-300 transition-colors">
                            {agent.name}
                          </div>
                          <div className="text-slate-400 text-xs mb-2">{agent.role}</div>
                          {selectedAgents.includes(agent.id) && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                              ✓
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-indigo-500/30 bg-slate-900/50 flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Click an agent to add them to your deliberation roster
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-indigo-300">
                  {selectedAgents.length} agents selected
                </span>
                <button
                  onClick={() => setShowPantheon(false)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Service Integration Panel - Slide-out */}
      {showServicePanel && serviceResults && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowServicePanel(false)} />
          <div className="relative w-full max-w-lg bg-neutral-900 border-l border-neutral-700 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 bg-neutral-900 border-b border-neutral-700 p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                {activeService === 'pre-mortem' && '⚠️ Pre-Mortem Analysis'}
                {activeService === 'crucible' && '🔥 Crucible Stress Test'}
                {activeService === 'oversight' && '🛡️ Oversight Compliance'}
                {activeService === 'ghost-board' && '👻 Ghost Board Rehearsal'}
                {activeService === 'decision-debt' && '⏰ Decision Debt Tracker'}
              </h2>
              <button onClick={() => setShowServicePanel(false)} className="text-neutral-400 hover:text-white text-xl">✕</button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* Pre-Mortem Results */}
              {activeService === 'pre-mortem' && serviceResults.failureModes && (
                <>
                  <div className="bg-amber-900/30 border border-amber-600/30 rounded-lg p-4">
                    <div className="text-amber-300 font-medium mb-2">Overall Risk Score</div>
                    <div className="text-3xl font-bold text-amber-400">{Math.round((serviceResults.overallRiskScore || 0) * 100)}%</div>
                  </div>
                  <div className="text-sm text-neutral-300 mb-2">{serviceResults.recommendation}</div>
                  <div className="space-y-2">
                    {serviceResults.failureModes.map((fm: any, i: number) => (
                      <div key={i} className="bg-neutral-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-white">{fm.mode}</span>
                          <span className={`text-xs px-2 py-0.5 rounded ${fm.impact === 'Critical' ? 'bg-red-600' : fm.impact === 'High' ? 'bg-orange-600' : 'bg-yellow-600'}`}>
                            {fm.impact}
                          </span>
                        </div>
                        <div className="text-xs text-neutral-400 mb-1">Probability: {Math.round(fm.probability * 100)}%</div>
                        <div className="text-sm text-green-400">💡 {fm.mitigation}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Ghost Board Results */}
              {activeService === 'ghost-board' && serviceResults.aiQuestions && (
                <>
                  <div className="bg-purple-900/30 border border-purple-600/30 rounded-lg p-4">
                    <div className="text-purple-300 font-medium mb-2">Board Rehearsal</div>
                    <div className="text-sm text-neutral-300">{serviceResults.topic}</div>
                  </div>
                  <div className="text-sm text-neutral-400 mb-2">AI Directors will ask:</div>
                  <div className="space-y-2">
                    {serviceResults.aiQuestions.map((q: any, i: number) => (
                      <div key={i} className="bg-neutral-800 rounded-lg p-3">
                        <div className="text-xs text-purple-400 mb-1">{q.director}</div>
                        <div className="text-sm text-white">{q.question}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 bg-green-900/30 border border-green-600/30 rounded-lg p-3">
                    <div className="text-green-400 font-medium text-sm mb-2">Recommendations</div>
                    <ul className="text-sm text-neutral-300 space-y-1">
                      {serviceResults.recommendations?.map((r: string, i: number) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              
              {/* Decision Debt Results */}
              {activeService === 'decision-debt' && serviceResults.stuckDecisions && (
                <>
                  <div className="bg-orange-900/30 border border-orange-600/30 rounded-lg p-4">
                    <div className="text-orange-300 font-medium mb-2">Total Decision Debt</div>
                    <div className="text-3xl font-bold text-orange-400">{serviceResults.summary?.totalEstimatedCost}</div>
                    <div className="text-sm text-neutral-400">{serviceResults.summary?.totalDebtDays} days stuck</div>
                  </div>
                  <div className="space-y-2">
                    {serviceResults.stuckDecisions.map((d: any, i: number) => (
                      <div key={i} className="bg-neutral-800 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-white">{d.title}</span>
                          <span className="text-xs text-orange-400">{d.daysStuck} days</span>
                        </div>
                        <div className="text-xs text-neutral-400">Owner: {d.owner} • Cost: {d.estimatedDailyCost}/day</div>
                        <div className="text-xs text-red-400 mt-1">Blockers: {d.blockers.join(', ')}</div>
                      </div>
                    ))}
                  </div>
                </>
              )}
              
              {/* Crucible Results */}
              {activeService === 'crucible' && serviceResults.status && (
                <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
                  <div className="text-red-300 font-medium mb-2">Adversarial Testing</div>
                  <div className="text-sm text-neutral-300 mb-2">{serviceResults.description}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-neutral-800 p-2 rounded">
                      <div className="text-neutral-400">Red Team Attacks</div>
                      <div className="text-white font-medium">{serviceResults.status.redTeam?.attacksRun || 0}</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded">
                      <div className="text-neutral-400">Vulnerabilities</div>
                      <div className="text-red-400 font-medium">{serviceResults.status.redTeam?.vulnerabilitiesFound || 0}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Oversight Results */}
              {activeService === 'oversight' && serviceResults.status && (
                <div className="bg-blue-900/30 border border-blue-600/30 rounded-lg p-4">
                  <div className="text-blue-300 font-medium mb-2">Regulatory Compliance</div>
                  <div className="text-sm text-neutral-300 mb-2">{serviceResults.description}</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-neutral-800 p-2 rounded">
                      <div className="text-neutral-400">Compliance Score</div>
                      <div className="text-green-400 font-medium">{serviceResults.status.panopticon?.complianceScore || 95}%</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded">
                      <div className="text-neutral-400">Active Policies</div>
                      <div className="text-white font-medium">{serviceResults.status.govern?.activePolicies || 12}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouncilPage;
