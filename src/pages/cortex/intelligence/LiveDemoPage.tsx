// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - LIVE DEMO MODE PAGE
// Connect to customer data in real-time during demos
// =============================================================================

import React, { useState } from 'react';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { AVAILABLE_CONNECTORS } from '../../../components/cortex/DataSourceSelector';

const CONNECTORS = AVAILABLE_CONNECTORS.filter((connector) => connector.oauth).map((connector) => ({
  id: connector.id || connector.type.toLowerCase(),
  name: connector.name,
  icon: connector.icon,
  color: connector.color || 'bg-blue-500',
}));

interface Session {
  id: string;
  status: 'pending' | 'connected' | 'active';
  connector: string;
  dataIngested: {
    progress: number;
    recordsScanned: number;
    contextBuilt: boolean;
  };
}

export const LiveDemoPage: React.FC = () => {
  const [selectedConnector, setSelectedConnector] = useState<string | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [question, setQuestion] = useState('');
  const [deliberationResult, setDeliberationResult] = useState<any>(null);
  const [isDeliberating, setIsDeliberating] = useState(false);

  const startSession = async () => {
    if (!selectedConnector) {
      return;
    }

    setIsConnecting(true);
    try {
      const res = await api.post<any>('/premium/live-demo/session', {
        connector: selectedConnector,
        tier: 'enterprise',
      });
      const payload = res as any;

      if (payload.success && payload.session) {
        setSession(payload.session as Session);
        // Simulate OAuth callback after 2s for demo
        setTimeout(() => simulateConnection(payload.session.id), 2000);
      }
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const simulateConnection = async (sessionId: string) => {
    try {
      const res = await api.post<any>('/premium/live-demo/connect', {
        sessionId,
        authCode: 'demo-auth-code',
      });
      const payload = res as any;

      if (payload.success && payload.session) {
        setSession(payload.session as Session);
        setIsConnecting(false);
      }
    } catch (err) {
      console.error('Connection failed:', err);
      setIsConnecting(false);
    }
  };

  const runDeliberation = async () => {
    if (!question.trim() || !selectedConnector) {
      return;
    }

    setIsDeliberating(true);
    try {
      const res = await api.post<any>('/premium/live-demo/deliberate', {
        connector: selectedConnector,
        question,
        tier: 'enterprise',
      });
      const payload = res as any;

      if (payload.success && payload.result) {
        setDeliberationResult(payload.result);
      }
    } catch (err) {
      console.error('Deliberation failed:', err);
    } finally {
      setIsDeliberating(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-4xl">⚡</span>
          <h1 className="text-3xl font-bold text-neutral-900">Live Demo Mode</h1>
        </div>
        <p className="text-neutral-600 text-lg">
          Connect to YOUR data right now and run a real deliberation.
        </p>
      </div>

      {!session?.status || session.status === 'pending' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Connector Selection */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Select a Data Source</h2>
            <div className="grid grid-cols-2 gap-3">
              {CONNECTORS.map((connector) => (
                <button
                  key={connector.id}
                  onClick={() => setSelectedConnector(connector.id)}
                  className={cn(
                    'p-4 rounded-lg border text-left transition-all',
                    selectedConnector === connector.id
                      ? 'border-yellow-500 bg-yellow-50 ring-2 ring-yellow-200'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center text-xl',
                        connector.color,
                        'text-white'
                      )}
                    >
                      {connector.icon}
                    </span>
                    <span className="font-medium">{connector.name}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="font-medium text-amber-800 flex items-center gap-2">
                🔐 Read-Only Access
              </h3>
              <ul className="mt-2 text-sm text-amber-700 space-y-1">
                <li>• No write permissions requested</li>
                <li>• Session expires in 30 minutes</li>
                <li>• Data is not stored after session</li>
              </ul>
            </div>

            <button
              onClick={startSession}
              disabled={!selectedConnector || isConnecting}
              className={cn(
                'w-full mt-6 py-3 px-4 rounded-lg font-medium text-white',
                'bg-gradient-to-r from-yellow-500 to-amber-500',
                'hover:from-yellow-600 hover:to-amber-600',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all shadow-sm hover:shadow-md'
              )}
            >
              {isConnecting ? 'Connecting...' : '⚡ Connect & Start Demo'}
            </button>
          </div>

          {/* How it Works */}
          <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-8">
            <h3 className="text-xl font-semibold text-neutral-900 mb-6">
              How Live Demo Mode Works
            </h3>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">OAuth Connect</h4>
                  <p className="text-sm text-neutral-600">
                    Grant read-only access to one of your systems
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Data Ingestion</h4>
                  <p className="text-sm text-neutral-600">
                    We scan your data and build context in seconds
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">Ask Your Question</h4>
                  <p className="text-sm text-neutral-600">
                    Run a real Council deliberation on YOUR data
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700 font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h4 className="font-medium text-neutral-900">See Real Results</h4>
                  <p className="text-sm text-neutral-600">
                    AI agents analyze YOUR actual business context
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Connected Status */}
          <div className="bg-green-50 rounded-xl border border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                  ✓
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-green-800">
                    Connected to {CONNECTORS.find((c) => c.id === selectedConnector)?.name}
                  </h2>
                  <p className="text-green-600">
                    {session.dataIngested.recordsScanned.toLocaleString()} records indexed
                  </p>
                </div>
              </div>
              <div className="text-sm text-green-600">Session expires in 28 minutes</div>
            </div>
          </div>

          {/* Question Input */}
          <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Ask Your Question</h2>
            <div className="space-y-4">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g., Which enterprise deals should we focus on this quarter?"
                className="w-full h-24 px-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-yellow-500"
              />
              <button
                onClick={runDeliberation}
                disabled={!question.trim() || isDeliberating}
                className={cn(
                  'w-full py-3 px-4 rounded-lg font-medium text-white',
                  'bg-gradient-to-r from-yellow-500 to-amber-500',
                  'hover:from-yellow-600 hover:to-amber-600',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                {isDeliberating ? 'Running Deliberation...' : '🚀 Run Council Deliberation'}
              </button>
            </div>
          </div>

          {/* Deliberation Results */}
          {deliberationResult && (
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">Deliberation Results</h2>

              <div className="mb-4 p-3 bg-neutral-50 rounded-lg">
                <div className="text-sm text-neutral-500">
                  Analyzed {deliberationResult.dataPointsAnalyzed.toLocaleString()} data points in{' '}
                  {(deliberationResult.duration / 1000).toFixed(1)}s
                </div>
              </div>

              <div className="prose prose-neutral max-w-none">
                <p>{deliberationResult.synthesis}</p>
              </div>

              {deliberationResult.realDataHighlights?.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-neutral-900 mb-3">Your Data Highlights</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {deliberationResult.realDataHighlights.map((highlight: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-yellow-50 rounded-lg border border-yellow-200"
                      >
                        <div className="text-sm font-medium text-yellow-800">{highlight.name}</div>
                        <div className="text-lg font-bold text-yellow-900">{highlight.value}</div>
                        <div className="text-xs text-yellow-700">{highlight.context}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LiveDemoPage;
