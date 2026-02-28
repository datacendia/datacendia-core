// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// PLATFORM AI ASSISTANT
// Conversational guide that helps users navigate the platform and complete tasks
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../lib/api';
import {
  MessageCircle,
  Send,
  X,
  Minimize2,
  Maximize2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  workflow?: WorkflowStep[];
  quickActions?: QuickAction[];
}

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  service: string;
  route: string;
  whatToSay?: string;
  whatToClick?: string;
  expectedResult?: string;
}

interface QuickAction {
  label: string;
  route: string;
  icon: string;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PlatformAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your Datacendia AI Assistant. I can help you navigate the platform and complete any task. Just describe what you want to do, and I'll guide you step-by-step.\n\nExamples:\n• \"I need to make a decision about hiring a new VP\"\n• \"How do I check compliance with EU AI Act?\"\n• \"I want to generate a regulator's receipt\"\n• \"Show me how to create a custom agent\"",
        timestamp: new Date(),
        quickActions: [
          { label: 'Start a Council Deliberation', route: '/cortex/council', icon: '🏛️' },
          { label: 'Check Compliance Status', route: '/cortex/compliance/continuous-monitor', icon: '📊' },
          { label: 'View Decision History', route: '/cortex/governance/decision-packets', icon: '📜' },
          { label: 'Generate Marketing Content', route: '/admin/marketing-studio', icon: '🎬' },
        ],
      }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) {return;}

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/platform-assistant/query', {
        query: input,
        conversationHistory: messages.slice(-5).map(m => ({
          role: m.role,
          content: m.content,
        })),
      });

      const data = (response.data as any).data;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        workflow: data.workflow,
        quickActions: data.quickActions,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to get assistant response:', err);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or navigate directly using the menu.",
        timestamp: new Date(),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const navigateToRoute = (route: string) => {
    navigate(route);
    setIsMinimized(true);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-50"
      >
        <Sparkles className="w-6 h-6" />
      </button>
    );
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center gap-2 transition-all z-50"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="font-medium">AI Assistant</span>
        {messages.filter(m => m.role === 'assistant').length > 1 && (
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[450px] h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          <span className="font-semibold">Datacendia AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/20 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
              }`}
            >
              <div className="text-sm whitespace-pre-wrap">{message.content}</div>

              {/* Workflow Steps */}
              {message.workflow && message.workflow.length > 0 && (
                <div className="mt-3 space-y-2">
                  <div className="text-xs font-semibold opacity-75">Step-by-Step Guide:</div>
                  {message.workflow.map((step) => (
                    <div
                      key={step.step}
                      className="bg-white dark:bg-gray-800 rounded p-3 text-gray-900 dark:text-white"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="flex-shrink-0 w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-xs font-bold">
                          {step.step}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-sm mb-1">{step.title}</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {step.description}
                          </div>
                          {step.whatToSay && (
                            <div className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100 p-2 rounded mb-1">
                              <span className="font-semibold">Say:</span> "{step.whatToSay}"
                            </div>
                          )}
                          {step.whatToClick && (
                            <div className="text-xs bg-green-50 dark:bg-green-900/20 text-green-900 dark:text-green-100 p-2 rounded mb-1">
                              <span className="font-semibold">Click:</span> {step.whatToClick}
                            </div>
                          )}
                          {step.expectedResult && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              <CheckCircle className="w-3 h-3 inline mr-1" />
                              Expected: {step.expectedResult}
                            </div>
                          )}
                          <button
                            onClick={() => navigateToRoute(step.route)}
                            className="mt-2 text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                          >
                            Go to {step.service} <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Actions */}
              {message.quickActions && message.quickActions.length > 0 && (
                <div className="mt-3 space-y-1">
                  {message.quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => navigateToRoute(action.route)}
                      className="w-full text-left px-3 py-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded text-xs font-medium text-gray-900 dark:text-white flex items-center gap-2 transition-colors"
                    >
                      <span>{action.icon}</span>
                      <span className="flex-1">{action.label}</span>
                      <ExternalLink className="w-3 h-3 opacity-50" />
                    </button>
                  ))}
                </div>
              )}

              <div className="text-xs opacity-50 mt-2">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about using Datacendia..."
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}
