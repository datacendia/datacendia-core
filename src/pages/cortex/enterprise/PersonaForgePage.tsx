// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA PERSONAFORGE™ - ENTERPRISE-TRAINED DIGITAL TWINS
// AI Agents Trained on Your Organization's DNA
// "Your Digital C-Suite That Never Sleeps"
//
// REAL OLLAMA LLM INTEGRATION - Enterprise Platinum Ready
// =============================================================================

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  personaForgeService,
  ROLE_CONFIG,
  DigitalPersona,
  PersonaRole,
  ChatMessage,
} from '../../../services/PersonaForgeService';
import { ollamaService } from '../../../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

interface AgentPack {
  id: string;
  name: string;
  description: string;
  personas: PersonaRole[];
  price: number;
  features: string[];
  industries: string[];
  deploymentTime: string;
  supportLevel: 'standard' | 'premium' | 'enterprise';
}

// =============================================================================
// AGENT PACKS (Static Data)
// =============================================================================

const AGENT_PACKS: AgentPack[] = [
  {
    id: 'starter',
    name: 'Executive Starter Pack',
    description: 'Essential C-suite digital twins for core business functions',
    personas: ['cfo', 'cio', 'clo'],
    price: 75000,
    features: [
      '3 Digital Executives',
      'Basic Training',
      'Email & Document Integration',
      'Standard Support',
    ],
    industries: ['All Industries'],
    deploymentTime: '4-6 weeks',
    supportLevel: 'standard',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Leadership Pack',
    description: 'Complete digital C-suite for enterprise-grade decision support',
    personas: ['cfo', 'cio', 'clo', 'chro', 'coo', 'ciso'],
    price: 150000,
    features: [
      '6 Digital Executives',
      'Advanced Training',
      'Full System Integration',
      'Custom Specializations',
      'Premium Support',
      'Quarterly Updates',
    ],
    industries: ['All Industries'],
    deploymentTime: '8-12 weeks',
    supportLevel: 'premium',
  },
  {
    id: 'finance',
    name: 'Finance Excellence Pack',
    description: 'Specialized financial decision support agents',
    personas: ['cfo', 'cro'],
    price: 100000,
    features: [
      '2 Finance Executives',
      'SOX Compliance Training',
      'ERP Deep Integration',
      'Financial Modeling',
      'Audit Support',
    ],
    industries: ['Banking', 'Insurance', 'Investment', 'Corporate Finance'],
    deploymentTime: '6-8 weeks',
    supportLevel: 'premium',
  },
  {
    id: 'tech',
    name: 'Technology Leadership Pack',
    description: 'Digital technology executives for IT transformation',
    personas: ['cio', 'ciso', 'cpo'],
    price: 125000,
    features: [
      '3 Tech Executives',
      'Security Focus',
      'DevOps Integration',
      'Cloud Architecture',
      'Vendor Management',
    ],
    industries: ['Technology', 'SaaS', 'FinTech', 'Healthcare IT'],
    deploymentTime: '6-10 weeks',
    supportLevel: 'premium',
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PersonaForgePage: React.FC = () => {
  const navigate = useNavigate();
  const [personas, setPersonas] = useState<DigitalPersona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<DigitalPersona | null>(null);
  const [activeTab, setActiveTab] = useState<'gallery' | 'training' | 'interact' | 'marketplace'>(
    'gallery'
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<{ available: boolean; models: string[] }>({
    available: false,
    models: [],
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPersonaRole, setNewPersonaRole] = useState<PersonaRole>('custom');
  const [newPersonaName, setNewPersonaName] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load personas from service
  useEffect(() => {
    const loadPersonas = () => {
      setPersonas(personaForgeService.getPersonas());
    };
    loadPersonas();

    // Check Ollama status
    const status = ollamaService.getStatus();
    setOllamaStatus(status);

    // Refresh periodically
    const interval = setInterval(() => {
      loadPersonas();
      setOllamaStatus(ollamaService.getStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const readyPersonas = personas.filter((p) => p.status === 'ready');
  const trainingPersonas = personas.filter((p) => p.status !== 'ready');

  // Real Ollama-powered chat
  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !selectedPersona || isLoading) {
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userMessage,
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    // Add placeholder for assistant
    const assistantMsgId = `msg-${Date.now()}-assistant`;
    setChatMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isStreaming: true,
      },
    ]);

    try {
      // Use the service to chat with real Ollama
      const { response } = await personaForgeService.chat(
        selectedPersona.id,
        userMessage,
        (token) => {
          // Stream tokens in real-time
          setChatMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId ? { ...msg, content: msg.content + token } : msg
            )
          );
        }
      );

      // Mark streaming complete
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId ? { ...msg, isStreaming: false, content: response } : msg
        )
      );

      // Refresh personas to get updated interaction counts
      setPersonas(personaForgeService.getPersonas());
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                isStreaming: false,
                content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}. Please ensure Ollama is running.`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [inputMessage, selectedPersona, isLoading]);

  // Create new persona
  const handleCreatePersona = () => {
    if (!newPersonaName.trim()) {
      return;
    }

    const persona = personaForgeService.createPersona({
      role: newPersonaRole,
      name: newPersonaName,
      status: 'not_started',
    });

    setPersonas(personaForgeService.getPersonas());
    setShowCreateModal(false);
    setNewPersonaName('');
    setNewPersonaRole('custom');
    setSelectedPersona(persona);
    setActiveTab('training');
  };

  // Start training a persona
  const handleStartTraining = (personaId: string) => {
    personaForgeService.startTraining(personaId, (progress, status) => {
      setPersonas(personaForgeService.getPersonas());
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white">
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
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🧠</span>
                  CendiaPersonaForge™
                  <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 px-2 py-0.5 rounded-full font-medium">
                    ENTERPRISE
                  </span>
                </h1>
                <p className="text-purple-300 text-sm">
                  Enterprise-Trained Digital Twins • Your AI C-Suite
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm text-white/60">Active Personas</div>
                <div className="text-xl font-bold text-green-400">{readyPersonas.length}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Total Interactions</div>
                <div className="text-xl font-bold text-purple-400">
                  {personas.reduce((sum, p) => sum + p.totalInteractions, 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="border-b border-purple-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'gallery', label: 'Persona Gallery', icon: '👥' },
              { id: 'training', label: 'Training Studio', icon: '🏋️' },
              { id: 'interact', label: 'Interact', icon: '💬' },
              { id: 'marketplace', label: 'Agent Packs', icon: '🛒' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-400 text-white bg-purple-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'gallery' && (
          <div className="grid grid-cols-3 gap-6">
            {personas.map((persona) => {
              const config = ROLE_CONFIG[persona.role];
              return (
                <div
                  key={persona.id}
                  onClick={() => setSelectedPersona(persona)}
                  className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all hover:scale-[1.02] ${
                    selectedPersona?.id === persona.id
                      ? 'border-purple-400 ring-2 ring-purple-400/20'
                      : 'border-purple-800/50 hover:border-purple-600'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${config.color} flex items-center justify-center text-3xl`}
                    >
                      {config.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{persona.name}</h3>
                      <div className="text-sm text-white/50">{persona.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs px-2 py-0.5 rounded ${
                            persona.status === 'ready'
                              ? 'bg-green-600'
                              : persona.status === 'training'
                                ? 'bg-blue-600'
                                : persona.status === 'validating'
                                  ? 'bg-amber-600'
                                  : 'bg-neutral-600'
                          }`}
                        >
                          {persona.status}
                        </span>
                        <span className="text-xs text-white/40">v{persona.version}</span>
                      </div>
                    </div>
                  </div>

                  {persona.status !== 'ready' && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">Training Progress</span>
                        <span>{persona.trainingProgress}%</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                          style={{ width: `${persona.trainingProgress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-purple-400">
                        {persona.totalInteractions.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Interactions</div>
                    </div>
                    <div className="text-center p-2 bg-black/20 rounded-lg">
                      <div className="text-lg font-bold text-amber-400">
                        {persona.avgResponseQuality > 0 ? `${persona.avgResponseQuality}/5` : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {persona.specializations.slice(0, 3).map((spec) => (
                      <span key={spec} className="text-xs px-2 py-1 bg-purple-900/50 rounded">
                        {spec}
                      </span>
                    ))}
                    {persona.specializations.length > 3 && (
                      <span className="text-xs px-2 py-1 bg-neutral-800 rounded">
                        +{persona.specializations.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Add New Persona Card */}
            <div
              onClick={() => setShowCreateModal(true)}
              className="bg-black/20 rounded-2xl p-6 border border-dashed border-purple-800/50 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-black/30 hover:border-purple-600 transition-all"
            >
              <div className="w-16 h-16 rounded-2xl bg-purple-900/30 flex items-center justify-center text-3xl mb-4">
                ➕
              </div>
              <h3 className="text-lg font-semibold mb-1">Create New Persona</h3>
              <p className="text-sm text-white/50">Train a custom digital executive</p>
            </div>
          </div>
        )}

        {/* Create Persona Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-purple-900/90 to-slate-900/90 rounded-2xl p-8 border border-purple-700/50 w-full max-w-lg">
              <h2 className="text-2xl font-bold mb-6">Create New Digital Persona</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">
                    Persona Name
                  </label>
                  <input
                    type="text"
                    value={newPersonaName}
                    onChange={(e) => setNewPersonaName(e.target.value)}
                    placeholder="e.g., Digital CMO"
                    className="w-full px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Role Type</label>
                  <div className="grid grid-cols-5 gap-2">
                    {(
                      [
                        'cfo',
                        'cio',
                        'clo',
                        'chro',
                        'ciso',
                        'coo',
                        'cro',
                        'cso',
                        'cpo',
                        'custom',
                      ] as PersonaRole[]
                    ).map((role) => {
                      const config = ROLE_CONFIG[role];
                      return (
                        <button
                          key={role}
                          onClick={() => setNewPersonaRole(role)}
                          className={`p-3 rounded-xl border transition-all ${
                            newPersonaRole === role
                              ? 'border-purple-400 bg-purple-600/30'
                              : 'border-purple-800/50 bg-black/20 hover:bg-black/40'
                          }`}
                        >
                          <div className="text-2xl mb-1">{config.icon}</div>
                          <div className="text-xs uppercase">{role}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 bg-white/10 rounded-xl font-medium hover:bg-white/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePersona}
                    disabled={!newPersonaName.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    Create Persona
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'training' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🏋️ Training Studio</h2>
              <p className="text-white/60">
                Configure data sources, calibrate risk profiles, and fine-tune communication styles
                for your digital executives.
              </p>
            </div>

            {selectedPersona ? (
              <div className="grid grid-cols-2 gap-6">
                {/* Data Sources */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">📊 Training Data Sources</h3>
                  <div className="space-y-3">
                    {selectedPersona.dataSources.map((ds) => (
                      <div key={ds.sourceType} className="p-3 bg-black/20 rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium capitalize">
                            {ds.sourceType.replace('_', ' ')}
                          </span>
                          <span className="text-xs text-green-400">Active</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div>
                            <span className="text-white/50">Records</span>
                            <div className="font-medium">
                              {ds.recordsProcessed.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <span className="text-white/50">Tokens</span>
                            <div className="font-medium">
                              {(ds.tokensExtracted / 1000000).toFixed(0)}M
                            </div>
                          </div>
                          <div>
                            <span className="text-white/50">Patterns</span>
                            <div className="font-medium">
                              {ds.patternsIdentified.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Risk Profile */}
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">⚖️ Risk Profile Calibration</h3>
                  <div className="space-y-4">
                    {Object.entries(selectedPersona.riskProfile).map(([key, value]) => (
                      <div key={key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/60 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="text-purple-400 capitalize">{value}</span>
                        </div>
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 via-amber-500 to-red-500"
                            style={{
                              width:
                                value === 'conservative' ||
                                value === 'cautious' ||
                                value === 'deliberate' ||
                                value === 'strict'
                                  ? '25%'
                                  : value === 'moderate' ||
                                      value === 'balanced' ||
                                      value === 'pragmatic'
                                    ? '50%'
                                    : '75%',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Capabilities */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🎯 Capabilities</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {selectedPersona.capabilities.map((cap) => (
                      <div key={cap.id} className="p-4 bg-black/20 rounded-xl">
                        <h4 className="font-medium mb-1">{cap.name}</h4>
                        <p className="text-xs text-white/50 mb-2">{cap.description}</p>
                        <div className="flex justify-between text-xs">
                          <span className="text-green-400">{cap.accuracy}% accuracy</span>
                          <span className="text-white/40">{cap.usageCount} uses</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Training Controls */}
                <div className="col-span-2 bg-black/30 rounded-2xl p-6 border border-purple-800/50">
                  <h3 className="text-lg font-semibold mb-4">🚀 Training Controls</h3>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-white/60">Training Status</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-3 py-1 rounded-lg text-sm ${
                            selectedPersona.status === 'ready'
                              ? 'bg-green-600'
                              : selectedPersona.status === 'training'
                                ? 'bg-blue-600'
                                : selectedPersona.status === 'validating'
                                  ? 'bg-amber-600'
                                  : 'bg-neutral-600'
                          }`}
                        >
                          {selectedPersona.status}
                        </span>
                        <span className="text-sm text-white/50">
                          {selectedPersona.trainingProgress}% complete
                        </span>
                      </div>
                    </div>

                    {selectedPersona.status !== 'ready' && (
                      <button
                        onClick={() => handleStartTraining(selectedPersona.id)}
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all"
                      >
                        {selectedPersona.status === 'not_started'
                          ? 'Start Training'
                          : 'Resume Training'}
                      </button>
                    )}
                  </div>

                  <div className="h-3 bg-black/30 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                      style={{ width: `${selectedPersona.trainingProgress}%` }}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-purple-400">
                        {selectedPersona.totalInteractions.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Total Interactions</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-amber-400">
                        {selectedPersona.avgResponseQuality > 0
                          ? `${selectedPersona.avgResponseQuality}/5`
                          : 'N/A'}
                      </div>
                      <div className="text-xs text-white/50">Quality Score</div>
                    </div>
                    <div className="p-3 bg-black/20 rounded-xl">
                      <div className="text-2xl font-bold text-green-400">
                        v{selectedPersona.version}
                      </div>
                      <div className="text-xs text-white/50">Version</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-white/50">
                Select a persona from the gallery to view training details
              </div>
            )}
          </div>
        )}

        {activeTab === 'interact' && (
          <div className="grid grid-cols-4 gap-6 h-[calc(100vh-280px)]">
            {/* Persona Selector */}
            <div className="bg-black/30 rounded-2xl p-4 border border-purple-800/50 overflow-y-auto">
              <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                Select Persona
              </h3>
              <div className="space-y-2">
                {readyPersonas.map((persona) => {
                  const config = ROLE_CONFIG[persona.role];
                  return (
                    <button
                      key={persona.id}
                      onClick={() => {
                        setSelectedPersona(persona);
                        setChatMessages([]);
                      }}
                      className={`w-full p-3 rounded-xl text-left transition-all ${
                        selectedPersona?.id === persona.id
                          ? 'bg-purple-600 border border-purple-400'
                          : 'bg-black/20 border border-transparent hover:bg-black/40'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div>
                          <div className="font-medium text-sm">{persona.name}</div>
                          <div className="text-xs text-white/50">{persona.department}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Chat Interface */}
            <div className="col-span-3 bg-black/30 rounded-2xl border border-purple-800/50 flex flex-col">
              {selectedPersona ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-purple-800/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{ROLE_CONFIG[selectedPersona.role].icon}</span>
                        <div>
                          <h3 className="font-semibold">{selectedPersona.name}</h3>
                          <div className="text-sm text-white/50">
                            {selectedPersona.title} • {selectedPersona.department}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${ollamaStatus.available ? 'bg-green-500' : 'bg-red-500'}`}
                        />
                        <span className="text-xs text-white/50">
                          {ollamaStatus.available ? 'Ollama Connected' : 'Ollama Offline'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                    {chatMessages.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-4">
                          {ROLE_CONFIG[selectedPersona.role].icon}
                        </div>
                        <h4 className="text-lg font-semibold mb-2">
                          Start a conversation with {selectedPersona.name}
                        </h4>
                        <p className="text-white/50 text-sm max-w-md mx-auto">
                          {ollamaStatus.available
                            ? 'This digital executive is powered by real Ollama LLM. Ask questions, seek advice, or request analysis.'
                            : 'Connect Ollama for AI-powered responses. Fallback responses will be used if offline.'}
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 mt-4">
                          {[
                            'What are our biggest financial risks?',
                            'Review the Q4 budget proposal',
                            'Analyze vendor contract terms',
                          ].map((q) => (
                            <button
                              key={q}
                              onClick={() => setInputMessage(q)}
                              className="px-3 py-1.5 bg-purple-900/50 rounded-lg text-sm hover:bg-purple-800/50 transition-colors"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      chatMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] p-4 rounded-2xl ${
                              msg.role === 'user'
                                ? 'bg-purple-600 rounded-br-sm'
                                : 'bg-black/40 rounded-bl-sm'
                            }`}
                          >
                            {msg.role === 'assistant' && (
                              <div className="flex items-center gap-2 mb-2">
                                <span>{ROLE_CONFIG[selectedPersona.role].icon}</span>
                                <span className="text-sm font-medium">{selectedPersona.name}</span>
                                {msg.isStreaming && (
                                  <span className="text-xs text-purple-400 animate-pulse">
                                    thinking...
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                              {msg.content || (msg.isStreaming ? '...' : '')}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-purple-800/30">
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                        placeholder={`Ask ${selectedPersona.name} a question...`}
                        disabled={isLoading}
                        className="flex-1 px-4 py-3 bg-black/30 border border-purple-800/50 rounded-xl focus:outline-none focus:border-purple-500 disabled:opacity-50"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
                      >
                        {isLoading ? (
                          <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Thinking...
                          </>
                        ) : (
                          'Send'
                        )}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-white/50">
                  Select a persona to start a conversation
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🛒 Agent Packs Marketplace</h2>
              <p className="text-white/60">
                Pre-configured digital executive packages optimized for specific industries and use
                cases. Each pack includes trained personas, integrations, and dedicated support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {AGENT_PACKS.map((pack) => (
                <div
                  key={pack.id}
                  className="bg-black/30 rounded-2xl p-6 border border-purple-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">{pack.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        pack.supportLevel === 'enterprise'
                          ? 'bg-amber-600'
                          : pack.supportLevel === 'premium'
                            ? 'bg-purple-600'
                            : 'bg-neutral-600'
                      }`}
                    >
                      {pack.supportLevel}
                    </span>
                  </div>
                  <p className="text-white/60 mb-4">{pack.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {pack.personas.map((role) => (
                      <span
                        key={role}
                        className="flex items-center gap-1 px-2 py-1 bg-purple-900/50 rounded text-sm"
                      >
                        {ROLE_CONFIG[role].icon} {ROLE_CONFIG[role].title.split(' ').pop()}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 mb-4">
                    {pack.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-white/80">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-purple-800/30">
                    <div>
                      <div className="text-3xl font-bold">${pack.price.toLocaleString()}</div>
                      <div className="text-xs text-white/50">one-time + training</div>
                    </div>
                    <button className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                      Request Demo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PersonaForgePage;
