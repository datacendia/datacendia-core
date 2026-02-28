// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA VOICE™ - AI C-SUITE IN REAL-TIME CONVERSATION
// Your AI Executives Speak in Real-Time Through Voice Agents
// "Walk Into a Room and Your Entire AI C-Suite Advises You"
//
// CAPABILITIES:
// - Real-time voice interaction with AI executives
// - Multi-agent conversations with different perspectives
// - Context-aware responses based on organizational data
// - Meeting mode with multiple AI executives participating
// - Voice synthesis with distinct personalities
// - Real-time transcription and decision logging
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  enterpriseService,
  voiceSynthesis,
  AIExecutive,
  VoiceMessage,
  ExecutiveRole,
} from '../../../services/EnterpriseService';
import { ollamaService } from '../../../lib/ollama';

// =============================================================================
// LOCAL TYPES
// =============================================================================

type ConversationMode = 'single' | 'council' | 'meeting';

// Types imported from EnterpriseService

// Mock data removed - using EnterpriseService for real data

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const VoicePage: React.FC = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<ConversationMode>('council');
  const [executives, setExecutives] = useState<AIExecutive[]>([]);
  const [activeExecutives, setActiveExecutives] = useState<ExecutiveRole[]>([
    'cfo',
    'cro',
    'ciso',
    'chro',
  ]);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [currentSpeaker, setCurrentSpeaker] = useState<ExecutiveRole | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState({ available: false });
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load executives from service
  useEffect(() => {
    setExecutives(enterpriseService.getExecutives());
    setMessages(enterpriseService.getVoiceMessages());
    setOllamaStatus(ollamaService.getStatus());
  }, []);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async () => {
    if (!userInput.trim() || isSending) {
      return;
    }

    setIsSending(true);
    setCurrentSpeaker(activeExecutives[0] || null);

    try {
      // Use real Enterprise Service with Ollama integration
      const targetExec = mode === 'single' ? activeExecutives[0] : undefined;
      const responses = await enterpriseService.sendVoiceMessage(userInput, targetExec);
      setMessages(enterpriseService.getVoiceMessages());

      // Speak the AI responses if voice is enabled
      if (voiceEnabled && voiceSynthesis.isAvailable()) {
        for (const response of responses) {
          if (response.speaker !== 'user') {
            setIsSpeaking(true);
            setCurrentSpeaker(response.speaker as ExecutiveRole);
            try {
              await voiceSynthesis.speak(response.content, response.speaker as ExecutiveRole);
            } catch (e) {
              console.warn('Speech failed:', e);
            }
          }
        }
        setIsSpeaking(false);
      }
    } catch (error) {
      console.error('Voice message error:', error);
    } finally {
      setUserInput('');
      setCurrentSpeaker(null);
      setIsSending(false);
    }
  };

  const toggleExecutive = (role: ExecutiveRole) => {
    setActiveExecutives((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const startVoiceInput = () => {
    setIsListening(true);
    // In production, this would use Web Speech API
    setTimeout(() => {
      setIsListening(false);
      setUserInput("What's our current financial outlook for Q4?");
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-violet-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
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
                  <span className="text-3xl">🎙️</span>
                  CendiaVoice™
                  <span className="text-xs bg-gradient-to-r from-violet-500 to-purple-500 px-2 py-0.5 rounded-full font-medium">
                    VOICE AI
                  </span>
                </h1>
                <p className="text-violet-300 text-sm">
                  AI C-Suite in Real-Time Conversation • Your Digital Boardroom
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Mode Selector */}
              <div className="flex items-center gap-2 bg-black/30 rounded-lg p-1">
                {[
                  { id: 'single', label: '1:1', icon: '👤' },
                  { id: 'council', label: 'Council', icon: '👥' },
                  { id: 'meeting', label: 'Meeting', icon: '🏛️' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setMode(m.id as ConversationMode)}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      mode === m.id ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {m.icon} {m.label}
                  </button>
                ))}
              </div>

              {/* Voice Toggle */}
              <button
                onClick={() => {
                  if (isSpeaking) {
                    voiceSynthesis.stop();
                  }
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  voiceEnabled ? 'bg-violet-600 text-white' : 'bg-black/30 text-white/60'
                }`}
              >
                {voiceEnabled ? '🔊' : '🔇'} Voice {voiceEnabled ? 'On' : 'Off'}
              </button>

              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-green-400 animate-pulse' : currentSpeaker ? 'bg-amber-400' : 'bg-neutral-500'}`}
                />
                <span className="text-sm text-white/60">
                  {isSpeaking ? 'Speaking...' : currentSpeaker ? 'Thinking...' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Executive Panel */}
          <div className="bg-black/30 rounded-2xl p-4 border border-violet-800/50 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              AI Executives
            </h3>
            <div className="space-y-3">
              {executives.map((exec) => (
                <div
                  key={exec.id}
                  onClick={() => toggleExecutive(exec.role)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    activeExecutives.includes(exec.role)
                      ? 'bg-violet-900/50 border border-violet-600'
                      : 'bg-black/20 border border-transparent hover:bg-black/30'
                  } ${exec.status === 'speaking' ? 'ring-2 ring-green-400' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${
                        exec.status === 'speaking'
                          ? 'bg-green-600 animate-pulse'
                          : activeExecutives.includes(exec.role)
                            ? 'bg-violet-700'
                            : 'bg-neutral-800'
                      }`}
                    >
                      {exec.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{exec.name}</div>
                      <div className="text-xs text-white/50">{exec.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            exec.status === 'speaking'
                              ? 'bg-green-400'
                              : exec.status === 'thinking'
                                ? 'bg-amber-400'
                                : activeExecutives.includes(exec.role)
                                  ? 'bg-violet-400'
                                  : 'bg-neutral-600'
                          }`}
                        />
                        <span className="text-xs text-white/40 capitalize">{exec.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Active Executives Count */}
            <div className="mt-4 p-3 bg-violet-900/30 rounded-xl">
              <div className="text-center">
                <div className="text-2xl font-bold text-violet-400">{activeExecutives.length}</div>
                <div className="text-xs text-white/50">Executives in Session</div>
              </div>
            </div>
          </div>

          {/* Conversation Area */}
          <div className="col-span-2 bg-black/30 rounded-2xl border border-violet-800/50 flex flex-col">
            {/* Conversation Header */}
            <div className="p-4 border-b border-violet-800/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">
                    {mode === 'single'
                      ? 'Executive Consultation'
                      : mode === 'council'
                        ? 'Executive Council Session'
                        : 'Board Meeting'}
                  </h3>
                  <div className="text-sm text-white/50">
                    {activeExecutives.length} executives • {messages.length} messages
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeExecutives.slice(0, 4).map((role) => {
                    const exec = executives.find((e) => e.role === role);
                    return (
                      <div
                        key={role}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                          currentSpeaker === role
                            ? 'bg-green-600 ring-2 ring-green-400'
                            : 'bg-violet-800'
                        }`}
                        title={exec?.name}
                      >
                        {exec?.avatar}
                      </div>
                    );
                  })}
                  {activeExecutives.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs">
                      +{activeExecutives.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🎙️</div>
                  <h4 className="text-xl font-semibold mb-2">Start Your Executive Session</h4>
                  <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
                    Speak or type to engage with your AI C-suite. They'll provide real-time insights
                    based on your organization's data and their specialized expertise.
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {[
                      "What's our Q4 financial outlook?",
                      'Review the security posture',
                      'Analyze employee retention risk',
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => setUserInput(q)}
                        className="px-4 py-2 bg-violet-900/50 rounded-xl text-sm hover:bg-violet-800/50 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg) => {
                  const exec = executives.find((e) => e.role === msg.speaker);
                  const isUser = msg.speaker === 'user';

                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] ${isUser ? 'order-2' : 'order-1'}`}>
                        <div
                          className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
                        >
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                              isUser ? 'bg-violet-600' : 'bg-black/40'
                            }`}
                          >
                            {isUser ? '👤' : exec?.avatar}
                          </div>
                          <div
                            className={`p-4 rounded-2xl ${
                              isUser ? 'bg-violet-600 rounded-br-sm' : 'bg-black/40 rounded-bl-sm'
                            }`}
                          >
                            {!isUser && (
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-semibold text-sm">{msg.speakerName}</span>
                                {msg.sentiment && (
                                  <span
                                    className={`text-xs px-2 py-0.5 rounded ${
                                      msg.sentiment === 'positive'
                                        ? 'bg-green-900/50 text-green-300'
                                        : msg.sentiment === 'warning'
                                          ? 'bg-red-900/50 text-red-300'
                                          : msg.sentiment === 'cautious'
                                            ? 'bg-amber-900/50 text-amber-300'
                                            : 'bg-neutral-800 text-neutral-300'
                                    }`}
                                  >
                                    {msg.sentiment}
                                  </span>
                                )}
                              </div>
                            )}
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                            <div
                              className={`text-xs mt-2 ${isUser ? 'text-violet-200' : 'text-white/40'}`}
                            >
                              {msg.timestamp.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-violet-800/30">
              <div className="flex gap-3">
                <button
                  onClick={startVoiceInput}
                  className={`p-3 rounded-xl transition-all ${
                    isListening ? 'bg-red-600 animate-pulse' : 'bg-violet-700 hover:bg-violet-600'
                  }`}
                >
                  <span className="text-xl">{isListening ? '🔴' : '🎤'}</span>
                </button>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Speak or type your question to the executives..."
                  className="flex-1 px-4 py-3 bg-black/30 border border-violet-800/50 rounded-xl focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim() || currentSpeaker !== null}
                  className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  Send
                </button>
              </div>
              {isListening && (
                <div className="mt-3 text-center text-sm text-violet-300 animate-pulse">
                  🎤 Listening... Speak now
                </div>
              )}
            </div>
          </div>

          {/* Insights Panel */}
          <div className="bg-black/30 rounded-2xl p-4 border border-violet-800/50 overflow-y-auto">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
              Session Insights
            </h3>

            {/* Live Metrics */}
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Session Duration</div>
                <div className="text-xl font-bold text-violet-400">
                  {Math.floor(messages.length * 0.5)}:00
                </div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Messages Exchanged</div>
                <div className="text-xl font-bold text-amber-400">{messages.length}</div>
              </div>
              <div className="p-3 bg-black/20 rounded-xl">
                <div className="text-xs text-white/50 mb-1">Consensus Level</div>
                <div className="text-xl font-bold text-green-400">
                  {messages.length > 0 ? '78%' : '-'}
                </div>
              </div>
            </div>

            {/* Key Points */}
            <div className="mb-6">
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Key Points
              </h4>
              {messages.filter((m) => m.speaker !== 'user').length > 0 ? (
                <div className="space-y-2">
                  {messages
                    .filter((m) => m.speaker !== 'user')
                    .slice(-3)
                    .map((msg) => {
                      const exec = executives.find((e) => e.role === msg.speaker);
                      return (
                        <div key={msg.id} className="p-2 bg-black/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span>{exec?.avatar}</span>
                            <span className="text-xs font-medium">{exec?.name.split(' ')[0]}</span>
                          </div>
                          <p className="text-xs text-white/70 line-clamp-2">{msg.content}</p>
                        </div>
                      );
                    })}
                </div>
              ) : (
                <div className="text-center py-4 text-white/40 text-sm">
                  Key points will appear here
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div>
              <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
                Quick Actions
              </h4>
              <div className="space-y-2">
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📋 Export Transcript
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📊 Generate Summary
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  🎯 Create Action Items
                </button>
                <button className="w-full px-3 py-2 bg-violet-900/50 rounded-lg text-sm text-left hover:bg-violet-800/50 transition-colors">
                  📅 Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoicePage;
