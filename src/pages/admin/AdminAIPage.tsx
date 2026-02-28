// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// ADMIN AI - AI-Powered Administrative Assistant
// Natural language interface for platform configuration and management
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { api } from '../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  command?: {
    action: string;
    target?: string;
    params?: Record<string, unknown>;
  };
  executed?: boolean;
  suggestions?: string[];
}

interface AIResponse {
  message: string;
  command?: {
    action: string;
    target?: string;
    params?: Record<string, unknown>;
    confirmation?: boolean;
  };
  executed?: boolean;
  result?: unknown;
  suggestions?: string[];
}

// =============================================================================
// API CALLS
// =============================================================================

const API_BASE = '/admin/ai';

async function startSession(): Promise<{ sessionId: string; messages: Message[] }> {
  const res = await api.post<any>(`${API_BASE}/start`, {});
  const payload = res as any;
  if (payload.success === false && payload.error) {
    throw new Error(payload.error.message || 'Failed to start session');
  }
  const data = payload.data ?? payload;
  return data as { sessionId: string; messages: Message[] };
}

async function sendMessage(sessionId: string, message: string): Promise<AIResponse> {
  const res = await api.post<any>(`${API_BASE}/message`, { sessionId, message });
  const payload = res as any;
  if (payload.success === false && payload.error) {
    throw new Error(payload.error.message || 'Failed to send message');
  }
  const data = payload.data ?? payload;
  return data as AIResponse;
}

// =============================================================================
// MARKDOWN RENDERER (Simple)
// =============================================================================

const renderMarkdown = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, i) => {
    // Headers
    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={i} className="text-lg font-bold text-white mt-4 mb-2">
          {line.replace('## ', '')}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={i} className="text-md font-semibold text-white mt-3 mb-1">
          {line.replace('### ', '')}
        </h3>
      );
    }
    // Bold
    else if (line.includes('**')) {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(
        <p key={i} className="text-neutral-300 my-1">
          {parts.map((part, j) =>
            j % 2 === 1 ? (
              <strong key={j} className="text-white">
                {part}
              </strong>
            ) : (
              part
            )
          )}
        </p>
      );
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('• ')) {
      elements.push(
        <div key={i} className="flex gap-2 my-1 ml-4">
          <span className="text-primary-400">•</span>
          <span className="text-neutral-300">{line.slice(2)}</span>
        </div>
      );
    }
    // Code
    else if (line.startsWith('`') && line.endsWith('`')) {
      elements.push(
        <code
          key={i}
          className="bg-neutral-700 px-2 py-1 rounded text-sm text-primary-300 my-1 inline-block"
        >
          {line.slice(1, -1)}
        </code>
      );
    }
    // Regular paragraph
    else if (line.trim()) {
      elements.push(
        <p key={i} className="text-neutral-300 my-1">
          {line}
        </p>
      );
    }
  });

  return elements;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AdminAIPage: React.FC = () => {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    initSession();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const initSession = async () => {
    try {
      setInitializing(true);
      const { sessionId: newSessionId, messages: initialMessages } = await startSession();
      setSessionId(newSessionId);
      setMessages(initialMessages);
    } catch (err) {
      console.error('Failed to start session:', err);
    } finally {
      setInitializing(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !sessionId || loading) {
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await sendMessage(sessionId, input);

      const assistantMessage: Message = {
        role: 'assistant',
        content: response.message,
        timestamp: new Date().toISOString(),
        command: response.command,
        executed: response.executed,
        suggestions: response.suggestions,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Failed to send message:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  if (initializing) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Initializing CendiaAdmin™...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">🤖</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CendiaAdmin™</h1>
            <p className="text-neutral-400">AI-powered administrative assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-neutral-900 rounded-xl border border-neutral-700 p-4 mb-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn('mb-4', message.role === 'user' ? 'flex justify-end' : '')}
          >
            {message.role === 'user' ? (
              <div className="max-w-[70%] bg-primary-600 rounded-2xl rounded-br-sm px-4 py-3">
                <p className="text-white">{message.content}</p>
              </div>
            ) : (
              <div className="max-w-[85%]">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm">🤖</span>
                  </div>
                  <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-700">
                    <div className="prose prose-invert prose-sm max-w-none">
                      {renderMarkdown(message.content)}
                    </div>

                    {/* Command Indicator */}
                    {message.command && (
                      <div
                        className={cn(
                          'mt-3 px-3 py-2 rounded-lg text-sm',
                          message.executed
                            ? 'bg-success-main/20 text-success-main border border-success-main/30'
                            : 'bg-warning-main/20 text-warning-main border border-warning-main/30'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span>{message.executed ? '✅' : '⏳'}</span>
                          <span className="font-medium">
                            {message.executed ? 'Command executed' : 'Awaiting confirmation'}
                          </span>
                        </div>
                        <code className="text-xs opacity-70 mt-1 block">
                          {message.command.action}({message.command.target})
                        </code>
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, i) => (
                          <button
                            key={i}
                            onClick={() => handleSuggestion(suggestion)}
                            className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-neutral-300 text-sm rounded-lg transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex items-start gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-sm">🤖</span>
            </div>
            <div className="bg-neutral-800 rounded-2xl rounded-tl-sm px-4 py-3 border border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></span>
                  <span
                    className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></span>
                </div>
                <span className="text-neutral-400 text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-2">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything... e.g., 'Disable CendiaPredict' or 'Update pricing'"
            className="flex-1 bg-transparent text-white placeholder:text-neutral-500 px-4 py-3 focus:outline-none"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={cn(
              'px-6 py-3 rounded-lg font-medium transition-colors',
              input.trim() && !loading
                ? 'bg-primary-600 text-white hover:bg-primary-700'
                : 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            )}
          >
            Send
          </button>
        </div>

        {/* Quick Commands */}
        <div className="flex gap-2 px-2 pt-2 border-t border-neutral-700 mt-2">
          <span className="text-xs text-neutral-500">Quick:</span>
          {['Show status', 'List features', 'List agents', 'Show pricing', 'Help'].map((cmd) => (
            <button
              key={cmd}
              onClick={() => handleSuggestion(cmd)}
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAIPage;
