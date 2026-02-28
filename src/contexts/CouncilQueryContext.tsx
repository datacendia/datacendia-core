// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// COUNCIL QUERY CONTEXT - Ask the Council from anywhere in the app
// =============================================================================
// Allows any page to trigger a Council deliberation with context data
// Example: From Chronos, ask "Why did revenue drop in Q3?" with the timeline data
// =============================================================================

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

export interface CouncilQueryContext {
  // The question to ask
  question: string;
  // Source page where the query originated
  sourcePage: string;
  // Contextual data to include in the deliberation
  context: {
    // Type of data being referenced
    dataType: 'timeline' | 'metrics' | 'decision' | 'audit' | 'alert' | 'graph' | 'custom';
    // Summary of the data
    summary: string;
    // Key data points
    dataPoints?: Record<string, any>;
    // Time range if applicable
    timeRange?: { start: Date; end: Date };
    // Related entities
    entities?: string[];
    // Screenshot or visual reference (base64)
    screenshot?: string;
  };
  // Suggested council mode based on context
  suggestedMode?: string;
  // Priority level
  priority?: 'low' | 'medium' | 'high' | 'critical';
}

interface CouncilQueryContextValue {
  // Current pending query
  pendingQuery: CouncilQueryContext | null;
  // Set a query and navigate to Council
  askCouncil: (query: CouncilQueryContext) => void;
  // Clear the pending query
  clearQuery: () => void;
  // Quick ask - simplified version
  quickAsk: (question: string, sourcePage: string, context?: string) => void;
}

const Context = createContext<CouncilQueryContextValue | null>(null);

export function CouncilQueryProvider({ children }: { children: ReactNode }) {
  const [pendingQuery, setPendingQuery] = useState<CouncilQueryContext | null>(null);
  const navigate = useNavigate();

  const askCouncil = useCallback((query: CouncilQueryContext) => {
    setPendingQuery(query);
    // Navigate to Council page with query indicator
    navigate('/cortex/council?fromContext=true');
  }, [navigate]);

  const clearQuery = useCallback(() => {
    setPendingQuery(null);
  }, []);

  const quickAsk = useCallback((question: string, sourcePage: string, contextSummary?: string) => {
    const query: CouncilQueryContext = {
      question,
      sourcePage,
      context: {
        dataType: 'custom',
        summary: contextSummary || `Question from ${sourcePage}`,
      },
    };
    askCouncil(query);
  }, [askCouncil]);

  return (
    <Context.Provider value={{ pendingQuery, askCouncil, clearQuery, quickAsk }}>
      {children}
    </Context.Provider>
  );
}

export function useCouncilQuery() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useCouncilQuery must be used within CouncilQueryProvider');
  }
  return context;
}

// =============================================================================
// HELPER HOOKS FOR SPECIFIC PAGE TYPES
// =============================================================================

/**
 * Hook for Chronos page to ask about timeline events
 */
export function useChronosCouncilQuery() {
  const { askCouncil } = useCouncilQuery();

  const askAboutEvent = useCallback((event: {
    id: string;
    title: string;
    timestamp: Date;
    type: string;
    department?: string;
    impact?: string;
  }) => {
    askCouncil({
      question: `Analyze this event and its implications: "${event.title}"`,
      sourcePage: 'CendiaChronos',
      context: {
        dataType: 'timeline',
        summary: `Timeline event from ${event.timestamp.toLocaleDateString()}: ${event.title}`,
        dataPoints: {
          eventId: event.id,
          eventType: event.type,
          department: event.department,
          impact: event.impact,
        },
        timeRange: { start: event.timestamp, end: event.timestamp },
      },
      suggestedMode: event.impact === 'negative' ? 'crisis' : 'executive',
      priority: event.impact === 'negative' ? 'high' : 'medium',
    });
  }, [askCouncil]);

  const askAboutPeriod = useCallback((startDate: Date, endDate: Date, metrics: Record<string, any>) => {
    askCouncil({
      question: `Analyze the organization's performance from ${startDate.toLocaleDateString()} to ${endDate.toLocaleDateString()}`,
      sourcePage: 'CendiaChronos',
      context: {
        dataType: 'metrics',
        summary: `Performance analysis for ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
        dataPoints: metrics,
        timeRange: { start: startDate, end: endDate },
      },
      suggestedMode: 'executive',
    });
  }, [askCouncil]);

  return { askAboutEvent, askAboutPeriod };
}

/**
 * Hook for Ledger page to ask about decisions
 */
export function useLedgerCouncilQuery() {
  const { askCouncil } = useCouncilQuery();

  const askAboutDecision = useCallback((decision: {
    id: string;
    question: string;
    outcome: string;
    confidence: number;
    agents: string[];
    timestamp: Date;
  }) => {
    askCouncil({
      question: `Review and explain this past decision: "${decision.question}"`,
      sourcePage: 'CendiaLedger',
      context: {
        dataType: 'decision',
        summary: `Decision from ${decision.timestamp.toLocaleDateString()}: ${decision.outcome} (${decision.confidence}% confidence)`,
        dataPoints: {
          decisionId: decision.id,
          outcome: decision.outcome,
          confidence: decision.confidence,
          agents: decision.agents,
        },
        entities: decision.agents,
      },
      suggestedMode: 'advisory',
    });
  }, [askCouncil]);

  const askToRevisit = useCallback((decision: {
    id: string;
    question: string;
    outcome: string;
  }, reason: string) => {
    askCouncil({
      question: `Revisit this decision with new information: "${decision.question}". Reason: ${reason}`,
      sourcePage: 'CendiaLedger',
      context: {
        dataType: 'decision',
        summary: `Revisiting decision: ${decision.question}`,
        dataPoints: {
          originalDecisionId: decision.id,
          originalOutcome: decision.outcome,
          revisitReason: reason,
        },
      },
      suggestedMode: 'due-diligence',
      priority: 'high',
    });
  }, [askCouncil]);

  return { askAboutDecision, askToRevisit };
}

/**
 * Hook for Witness/Audit pages
 */
export function useWitnessCouncilQuery() {
  const { askCouncil } = useCouncilQuery();

  const askAboutAuditEvent = useCallback((event: {
    id: string;
    action: string;
    actor: string;
    resource: string;
    outcome: string;
    timestamp: Date;
    severity?: string;
  }) => {
    askCouncil({
      question: `Analyze this audit event and assess any risks: ${event.action} on ${event.resource} by ${event.actor}`,
      sourcePage: 'CendiaWitness',
      context: {
        dataType: 'audit',
        summary: `Audit event: ${event.action} - ${event.outcome}`,
        dataPoints: {
          eventId: event.id,
          action: event.action,
          actor: event.actor,
          resource: event.resource,
          outcome: event.outcome,
          severity: event.severity,
        },
        entities: [event.actor, event.resource],
      },
      suggestedMode: event.severity === 'critical' ? 'crisis' : 'compliance',
      priority: event.severity === 'critical' ? 'critical' : 'medium',
    });
  }, [askCouncil]);

  return { askAboutAuditEvent };
}

/**
 * Hook for Pulse/Metrics pages
 */
export function usePulseCouncilQuery() {
  const { askCouncil } = useCouncilQuery();

  const askAboutAlert = useCallback((alert: {
    id: string;
    title: string;
    severity: string;
    source: string;
    description: string;
  }) => {
    askCouncil({
      question: `Assess this alert and recommend actions: "${alert.title}"`,
      sourcePage: 'CendiaPulse',
      context: {
        dataType: 'alert',
        summary: `${alert.severity.toUpperCase()} Alert: ${alert.title}`,
        dataPoints: {
          alertId: alert.id,
          severity: alert.severity,
          source: alert.source,
          description: alert.description,
        },
      },
      suggestedMode: alert.severity === 'critical' ? 'crisis' : 'operational',
      priority: alert.severity as any,
    });
  }, [askCouncil]);

  const askAboutMetricAnomaly = useCallback((metric: string, value: number, expected: number, trend: string) => {
    askCouncil({
      question: `Analyze this metric anomaly: ${metric} is ${value} (expected ${expected}, trend: ${trend})`,
      sourcePage: 'CendiaPulse',
      context: {
        dataType: 'metrics',
        summary: `Metric anomaly detected: ${metric}`,
        dataPoints: {
          metric,
          currentValue: value,
          expectedValue: expected,
          trend,
          deviation: ((value - expected) / expected * 100).toFixed(1) + '%',
        },
      },
      suggestedMode: 'operational',
      priority: Math.abs(value - expected) / expected > 0.2 ? 'high' : 'medium',
    });
  }, [askCouncil]);

  return { askAboutAlert, askAboutMetricAnomaly };
}

export default CouncilQueryProvider;
