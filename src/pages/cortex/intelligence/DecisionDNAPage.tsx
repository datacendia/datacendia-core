// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA - DECISION DNA TIMELINE
// Full lifecycle visualization for enterprise decisions
// "Black Box Flight Recorder" with step-by-step replay
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { api } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';
import { useAuth } from '../../../contexts/AuthContext';

interface DecisionEvent {
  id: string;
  timestamp: string;
  type:
    | 'created'
    | 'context_added'
    | 'premortem_run'
    | 'council_session'
    | 'ghost_board'
    | 'decision_made'
    | 'outcome_recorded'
    | 'reopened';
  title: string;
  summary: string;
  data: Record<string, any>;
  userId: string;
  agentsInvolved?: string[];
}

interface Decision {
  id: string;
  decisionId?: string; // Human-readable ID like DC-2025-0003
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  budget?: number;
  timeframe?: string;
  owner?: { name: string; role: string };
  councilConfidence?: number;
  linkedWorkflows?: { id: string; name: string }[];
  timeline: DecisionEvent[];
  preMortems: any[];
  councilSessions: any[];
  ghostBoardSimulations: any[];
  finalDecision?: string;
  decisionMadeAt?: string;
  outcome?: {
    actualResult: string;
    notes: string;
    lessonsLearned: string[];
  };
  auditHash?: string;
}

interface DecisionSummary {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  riskScore?: number;
  eventCount: number;
}

const EVENT_ICONS: Record<string, string> = {
  created: '🎯',
  context_added: '📝',
  premortem_run: '💀',
  council_session: '🏛️',
  ghost_board: '👻',
  decision_made: '✅',
  outcome_recorded: '📊',
  reopened: '🔄',
};

const EVENT_COLORS: Record<string, string> = {
  created: 'bg-blue-500',
  context_added: 'bg-purple-500',
  premortem_run: 'bg-amber-500',
  council_session: 'bg-indigo-500',
  ghost_board: 'bg-pink-500',
  decision_made: 'bg-green-500',
  outcome_recorded: 'bg-teal-500',
  reopened: 'bg-orange-500',
};

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500',
  analyzing: 'bg-amber-500',
  deliberating: 'bg-indigo-500',
  decided: 'bg-green-500',
  implemented: 'bg-teal-500',
  closed: 'bg-neutral-500',
};

// Sample decisions to demonstrate the feature
const SAMPLE_DECISIONS: DecisionSummary[] = [
  {
    id: 'sample-1',
    title: 'Q2 Market Expansion Strategy',
    status: 'decided',
    priority: 'high',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 65,
    eventCount: 8,
  },
  {
    id: 'sample-2',
    title: 'Enterprise Pricing Model Revision',
    status: 'deliberating',
    priority: 'high',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 42,
    eventCount: 5,
  },
  {
    id: 'sample-3',
    title: 'Engineering Team Restructure',
    status: 'analyzing',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    riskScore: 78,
    eventCount: 3,
  },
];

const SAMPLE_DECISIONS_DETAIL: Record<string, Decision> = {
  'sample-1': {
    id: 'sample-1',
    decisionId: 'DC-2025-0003',
    title: 'Q2 Market Expansion Strategy',
    description:
      'Evaluate and decide on expanding into European markets, specifically Germany and UK, with a focus on enterprise clients.',
    status: 'decided',
    priority: 'high',
    category: 'strategy',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 500000,
    timeframe: 'Q2 2025',
    owner: { name: 'Jane Doe', role: 'CEO' },
    councilConfidence: 92,
    linkedWorkflows: [
      { id: 'wf-1', name: 'EU Market Entry Checklist' },
      { id: 'wf-2', name: 'UK Entity Formation' },
      { id: 'wf-3', name: 'GDPR Compliance Review' },
    ],
    timeline: [
      {
        id: 'e1',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'created',
        title: 'Decision Created',
        summary: 'Strategic decision initiated by CEO',
        data: {},
        userId: 'user-1',
      },
      {
        id: 'e2',
        timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'context_added',
        title: 'Market Research Added',
        summary: 'Added competitive analysis for EU markets',
        data: { documents: 3 },
        userId: 'user-2',
      },
      {
        id: 'e3',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'premortem_run',
        title: 'Pre-Mortem Analysis',
        summary: 'Identified 12 potential failure modes, 4 high-risk',
        data: {
          riskScore: 42,
          totalExposure: 1850000,
          recommendation: 'proceed',
          failureModes: [
            {
              title: 'Regulatory compliance delays',
              probability: 65,
              costImpact: 450000,
              category: 'Legal',
            },
            {
              title: 'Currency fluctuation impact',
              probability: 55,
              costImpact: 320000,
              category: 'Financial',
            },
            {
              title: 'Talent acquisition challenges',
              probability: 70,
              costImpact: 280000,
              category: 'Operations',
            },
            {
              title: 'Brand localization missteps',
              probability: 35,
              costImpact: 180000,
              category: 'Marketing',
            },
          ],
        },
        userId: 'user-1',
        agentsInvolved: ['CendiaCFO', 'CendiaCRO'],
      },
      {
        id: 'e4',
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'council_session',
        title: 'Council Deliberation',
        summary: 'AI Council evaluated options with 85% confidence',
        data: {
          confidence: 0.85,
          recommendation: 'Proceed with UK first',
          deliberation: [
            {
              agent: 'CendiaCEO',
              stance: 'support',
              summary:
                'Strategic alignment with 3-year growth plan. UK market offers lower regulatory friction than Germany.',
              confidence: 0.88,
            },
            {
              agent: 'CendiaCFO',
              stance: 'cautious',
              summary:
                'ROI projections solid but currency exposure needs hedging. Recommend phased capital deployment.',
              confidence: 0.82,
            },
            {
              agent: 'CendiaCRO',
              stance: 'support',
              summary:
                'Pipeline analysis shows 12 enterprise prospects in UK already engaged. Sales cycle ~6 months shorter than DACH.',
              confidence: 0.91,
            },
            {
              agent: 'CendiaCMO',
              stance: 'support',
              summary:
                'Brand recognition higher in UK. Existing content can be repurposed with minimal localization.',
              confidence: 0.85,
            },
          ],
          consensus: 'Proceed with UK expansion in Q2, defer Germany to Q4 pending UK validation.',
          voteSummary: { support: 3, cautious: 1, oppose: 0 },
        },
        userId: 'user-1',
        agentsInvolved: ['CendiaCEO', 'CendiaCFO', 'CendiaCRO', 'CendiaCMO'],
      },
      {
        id: 'e5',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'ghost_board',
        title: 'Ghost Board Simulation',
        summary: 'Simulated board review - 3 concerns raised',
        data: {
          preparednessScore: 78,
          questions: [
            {
              member: 'Board Chair',
              question: 'What is the exit strategy if UK expansion underperforms?',
              difficulty: 'hard',
              answered: true,
            },
            {
              member: 'Lead Investor',
              question: 'How does this affect our runway and next funding round?',
              difficulty: 'medium',
              answered: true,
            },
            {
              member: 'Independent Director',
              question: 'What are the regulatory risks with Brexit implications?',
              difficulty: 'hard',
              answered: false,
            },
          ],
          concerns: ['Timeline aggressive', 'Currency risk', 'Talent acquisition'],
        },
        userId: 'user-1',
      },
      {
        id: 'e6',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'context_added',
        title: 'Financial Model Updated',
        summary: 'Added 3-year projection with sensitivity analysis',
        data: { npv: 2400000 },
        userId: 'user-3',
      },
      {
        id: 'e7',
        timestamp: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'council_session',
        title: 'Final Council Review',
        summary: 'Updated recommendation with mitigations',
        data: {
          confidence: 0.92,
          recommendation: 'Proceed with mitigations in place',
          deliberation: [
            {
              agent: 'CendiaCEO',
              stance: 'support',
              summary:
                'Risk mitigations address key concerns. Ready to proceed with phased approach.',
              confidence: 0.94,
            },
            {
              agent: 'CendiaCFO',
              stance: 'support',
              summary:
                'Currency hedging strategy approved. Budget milestones provide adequate controls.',
              confidence: 0.9,
            },
          ],
          consensus: 'Full approval to proceed. Mitigations validated by finance.',
          voteSummary: { support: 2, cautious: 0, oppose: 0 },
        },
        userId: 'user-1',
        agentsInvolved: ['CendiaCEO', 'CendiaCFO'],
      },
      {
        id: 'e8',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'decision_made',
        title: 'Decision Finalized',
        summary: 'Approved: UK expansion Q2, Germany Q4',
        data: { approved: true },
        userId: 'user-1',
      },
    ],
    preMortems: [{ id: 'pm-1', risks: 12, highRisk: 4 }],
    councilSessions: [{ id: 'cs-1', confidence: 0.92 }],
    ghostBoardSimulations: [{ id: 'gb-1', concerns: 3 }],
    finalDecision:
      'Proceed with UK market expansion in Q2 2025, followed by Germany in Q4 2025. Initial investment capped at $500K with milestone-based releases.',
    decisionMadeAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    auditHash: 'sha256:a1b2c3d4e5f6...',
  },
  'sample-2': {
    id: 'sample-2',
    title: 'Enterprise Pricing Model Revision',
    description:
      'Review and update enterprise pricing tiers based on competitive analysis and customer feedback.',
    status: 'deliberating',
    priority: 'high',
    category: 'revenue',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 0,
    timeframe: 'Q1 2025',
    timeline: [
      {
        id: 'e1',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'created',
        title: 'Decision Created',
        summary: 'Pricing review initiated by CRO',
        data: {},
        userId: 'user-1',
      },
      {
        id: 'e2',
        timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'context_added',
        title: 'Competitive Analysis',
        summary: 'Added pricing benchmarks from 8 competitors',
        data: { competitors: 8 },
        userId: 'user-2',
      },
      {
        id: 'e3',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'premortem_run',
        title: 'Pre-Mortem Analysis',
        summary: 'Identified churn risk with aggressive pricing',
        data: { risks: 8, highRisk: 2 },
        userId: 'user-1',
        agentsInvolved: ['CendiaCFO', 'CendiaCRO'],
      },
      {
        id: 'e4',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'council_session',
        title: 'Council Deliberation',
        summary: 'AI Council analyzing pricing options',
        data: {
          confidence: 0.72,
          recommendation: 'Implement value-based pricing',
          deliberation: [
            {
              agent: 'CendiaCFO',
              stance: 'support',
              summary:
                'Value-based model aligns with enterprise expectations. 15% margin improvement projected.',
              confidence: 0.78,
            },
            {
              agent: 'CendiaCRO',
              stance: 'cautious',
              summary:
                'Concerned about mid-market churn. Suggest grandfather clause for existing customers.',
              confidence: 0.68,
            },
            {
              agent: 'CendiaCMO',
              stance: 'support',
              summary: 'Premium positioning strengthens brand. Competitors moving same direction.',
              confidence: 0.75,
            },
            {
              agent: 'CendiaChro',
              stance: 'cautious',
              summary:
                'Sales team needs training on value selling. 30-day ramp period recommended.',
              confidence: 0.65,
            },
          ],
          consensus:
            'Proceed with value-based pricing but include transition support for existing customers.',
          voteSummary: { support: 2, cautious: 2, oppose: 0 },
        },
        userId: 'user-1',
        agentsInvolved: ['CendiaCFO', 'CendiaCRO', 'CendiaCMO', 'CendiaChro'],
      },
      {
        id: 'e5',
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'context_added',
        title: 'Customer Survey Results',
        summary: 'Added feedback from 50 enterprise customers',
        data: { responses: 50, satisfaction: 0.72 },
        userId: 'user-3',
      },
    ],
    preMortems: [{ id: 'pm-1', risks: 8, highRisk: 2 }],
    councilSessions: [{ id: 'cs-1', confidence: 0.72 }],
    ghostBoardSimulations: [],
    auditHash: 'sha256:b2c3d4e5f6g7...',
  },
  'sample-3': {
    id: 'sample-3',
    title: 'Engineering Team Restructure',
    description:
      'Evaluate restructuring engineering into product-aligned squads vs current functional teams.',
    status: 'analyzing',
    priority: 'medium',
    category: 'operations',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(),
    budget: 50000,
    timeframe: 'Q1 2025',
    timeline: [
      {
        id: 'e1',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'created',
        title: 'Decision Created',
        summary: 'Restructure proposal from VP Engineering',
        data: {},
        userId: 'user-1',
      },
      {
        id: 'e2',
        timestamp: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'context_added',
        title: 'Current State Analysis',
        summary: 'Documented existing team structure and dependencies',
        data: { teams: 6, engineers: 42 },
        userId: 'user-2',
      },
      {
        id: 'e3',
        timestamp: new Date(Date.now() - 0.2 * 24 * 60 * 60 * 1000).toISOString(),
        type: 'council_session',
        title: 'Initial Council Review',
        summary: 'AI Council providing initial assessment',
        data: {
          confidence: 0.58,
          recommendation: 'More analysis needed',
          deliberation: [
            {
              agent: 'CendiaCEO',
              stance: 'cautious',
              summary:
                'Timing concern - Q1 is critical for product launches. Consider Q2 implementation.',
              confidence: 0.55,
            },
            {
              agent: 'CendiaChro',
              stance: 'support',
              summary:
                'Squad model improves ownership and reduces handoffs. Similar transitions successful at peer companies.',
              confidence: 0.72,
            },
            {
              agent: 'CendiaCTO',
              stance: 'support',
              summary:
                'Technical debt reduction will accelerate with product-aligned ownership. Recommend pilot with Platform team.',
              confidence: 0.68,
            },
          ],
          consensus:
            'Recommend pilot program before full restructure. Need more data on productivity impact.',
          voteSummary: { support: 2, cautious: 1, oppose: 0 },
        },
        userId: 'user-1',
        agentsInvolved: ['CendiaCEO', 'CendiaChro', 'CendiaCTO'],
      },
    ],
    preMortems: [],
    councilSessions: [{ id: 'cs-1', confidence: 0.58 }],
    ghostBoardSimulations: [],
    auditHash: 'sha256:c3d4e5f6g7h8...',
  },
};

export const DecisionDNAPage: React.FC<{ embedded?: boolean }> = ({ embedded = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [decisions, setDecisions] = useState<DecisionSummary[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [_preMortemError, setPreMortemError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [replayMode, setReplayMode] = useState(false);
  const [replayStep, setReplayStep] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [decisionFilter, setDecisionFilter] = useState<'all' | 'deciding' | 'decided' | 'at-risk'>(
    'all'
  );

  // New decision form
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newBudget, setNewBudget] = useState('');
  const [newTimeframe, setNewTimeframe] = useState('');

  // Filter decisions based on selected filter
  const filteredDecisions = decisions.filter((d) => {
    if (decisionFilter === 'all') {return true;}
    if (decisionFilter === 'deciding')
      {return ['draft', 'analyzing', 'deliberating'].includes(d.status);}
    if (decisionFilter === 'decided')
      {return ['decided', 'implemented', 'closed'].includes(d.status);}
    if (decisionFilter === 'at-risk') {return (d.riskScore || 0) >= 60;}
    return true;
  });

  // Load decisions when user changes
  useEffect(() => {
    loadDecisions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.organizationId]);

  const loadDecisions = async () => {
    setIsLoadingList(true);
    try {
      const orgId = user?.organizationId || 'demo-org-id';
      const allDecisions: DecisionSummary[] = [];
      
      // Load formal decisions
      const res = await api.get<any>('/decisions', { organizationId: orgId });
      const payload = res as any;
      if (payload.success && payload.decisions) {
        allDecisions.push(...(payload.decisions as DecisionSummary[]));
      }
      
      // Also load deliberations and convert to decision format
      const delibRes = await api.get<any>('/council/deliberations', { limit: 100 });
      const delibPayload = delibRes as any;
      if (delibPayload.success && delibPayload.deliberations) {
        const deliberationDecisions = delibPayload.deliberations.map((d: any) => ({
          id: d.id,
          title: d.question?.substring(0, 100) || 'Council Deliberation',
          status: d.status === 'COMPLETED' ? 'decided' : 'deliberating',
          priority: 'high',
          createdAt: d.createdAt || d.created_at || new Date().toISOString(),
          riskScore: d.confidence ? Math.round(100 - d.confidence) : 30,
          eventCount: d.responses?.length || 1,
        }));
        allDecisions.push(...deliberationDecisions);
      }
      
      // Sort by date descending
      allDecisions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setDecisions(allDecisions.length > 0 ? allDecisions : SAMPLE_DECISIONS);
    } catch (error) {
      console.error('Failed to load decisions:', error);
      setDecisions(SAMPLE_DECISIONS);
    } finally {
      setIsLoadingList(false);
    }
  };

  const loadDecision = async (id: string) => {
    setIsLoading(true);
    try {
      // First try loading from decisions endpoint
      const res = await api.get<any>(`/decisions/${id}`);
      const payload = res as any;
      if (payload.success && payload.decision) {
        setSelectedDecision(payload.decision as Decision);
        setReplayStep(0);
        setReplayMode(false);
        setIsLoading(false);
        return;
      }
      
      // If not found, try loading as a deliberation
      const delibRes = await api.get<any>(`/council/deliberations/${id}`);
      const delibPayload = delibRes as any;
      if (delibPayload.success && delibPayload.deliberation) {
        const d = delibPayload.deliberation;
        // Get messages from deliberation_messages field (from backend)
        const messages = d.deliberation_messages || d.responses || [];
        // Convert deliberation to Decision format
        const decision: Decision = {
          id: d.id,
          decisionId: `DELIB-${d.id.substring(0, 8).toUpperCase()}`,
          title: d.question || 'Council Deliberation',
          description: d.question || '',
          status: d.status === 'COMPLETED' ? 'decided' : 'deliberating',
          priority: 'high',
          category: 'council',
          createdAt: d.createdAt || d.created_at || new Date().toISOString(),
          updatedAt: d.completedAt || d.completed_at || d.createdAt || new Date().toISOString(),
          councilConfidence: d.confidence,
          timeline: [
            {
              id: 'e1',
              timestamp: d.createdAt || d.created_at || new Date().toISOString(),
              type: 'created',
              title: 'Deliberation Started',
              summary: 'AI Council deliberation initiated',
              data: {},
              userId: 'council',
            },
            ...messages.map((r: any, i: number) => ({
              id: `r${i}`,
              timestamp: r.created_at || r.timestamp || d.created_at || new Date().toISOString(),
              type: 'council_session' as const,
              title: `${r.agents?.name || r.agentName || r.agentCode || 'Agent'} Response`,
              summary: r.content?.substring(0, 200) || 'Agent analysis',
              data: { agentCode: r.agents?.code || r.agentCode, phase: r.phase },
              userId: 'council',
              agentsInvolved: [r.agents?.name || r.agentName || r.agentCode],
            })),
            ...(d.status === 'COMPLETED' ? [{
              id: 'final',
              timestamp: d.completedAt || d.completed_at || new Date().toISOString(),
              type: 'decision_made' as const,
              title: 'Decision Reached',
              summary: d.decision || d.synthesis || 'Council reached consensus',
              data: { confidence: d.confidence },
              userId: 'council',
            }] : []),
          ],
          preMortems: [],
          councilSessions: [{ id: d.id, confidence: d.confidence || 0 }],
          ghostBoardSimulations: [],
          finalDecision: d.decision || d.synthesis,
          auditHash: `sha256:${d.id.substring(0, 16)}...`,
        };
        setSelectedDecision(decision);
        setReplayStep(0);
        setReplayMode(false);
      }
    } catch (error) {
      console.error('Failed to load decision:', error);
      // Fallback to sample decisions for demo mode
      if (SAMPLE_DECISIONS_DETAIL[id]) {
        setSelectedDecision(SAMPLE_DECISIONS_DETAIL[id]);
        setReplayStep(0);
        setReplayMode(false);
      }
    }
    setIsLoading(false);
  };

  const createDecision = async () => {
    if (!newTitle.trim() || !newDescription.trim()) {
      return;
    }

    setIsCreating(true);
    try {
      const res = await api.post<any>('/decisions', {
        title: newTitle,
        description: newDescription,
        budget: newBudget ? parseFloat(newBudget) : undefined,
        timeframe: newTimeframe || undefined,
      });
      const payload = res as any;
      if (payload.success && payload.decision) {
        setNewTitle('');
        setNewDescription('');
        setNewBudget('');
        setNewTimeframe('');
        loadDecisions();
        loadDecision(payload.decision.id);
      }
    } catch (error) {
      console.error('Failed to create decision:', error);
    }
    setIsCreating(false);
  };

  const runPreMortem = async () => {
    if (!selectedDecision) {
      return;
    }
    setPreMortemError(null);


    setIsLoading(true);
    try {
      const res = await api.post<any>(`/decisions/${selectedDecision.id}/premortem`, {});
      if (res.success) {
        loadDecision(selectedDecision.id);
      } else {
        // Fallback: navigate to Pre-Mortem page with full decision context
        const params = new URLSearchParams({
          decision: selectedDecision.title,
          context: selectedDecision.description,
          ...(selectedDecision.budget && { budget: selectedDecision.budget.toString() }),
          ...(selectedDecision.timeframe && { timeframe: selectedDecision.timeframe }),
        });
        navigate(`/cortex/intelligence/pre-mortem?${params.toString()}`);
      }
    } catch (error) {
      console.error('Failed to run pre-mortem:', error);
      // Fallback: navigate to Pre-Mortem page with full decision context
      const params = new URLSearchParams({
        decision: selectedDecision.title,
        context: selectedDecision.description,
        ...(selectedDecision.budget && { budget: selectedDecision.budget.toString() }),
        ...(selectedDecision.timeframe && { timeframe: selectedDecision.timeframe }),
      });
      navigate(`/cortex/intelligence/pre-mortem?${params.toString()}`);
    }
    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getVisibleEvents = () => {
    if (!selectedDecision) {
      return [];
    }
    if (!replayMode) {
      return selectedDecision.timeline;
    }
    return selectedDecision.timeline.slice(0, replayStep + 1);
  };

  return (
    <div className={embedded ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6' : 'min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6'}>
      <div className="max-w-7xl mx-auto">
        {/* Header — hidden when embedded in CendiaProvenance™ */}
        {!embedded && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-4xl">🧬</span>
              <h1 className="text-3xl font-bold text-white">Decision DNA</h1>
            </div>
            <p className="text-slate-400 text-lg">
              Full lifecycle tracking with step-by-step replay. Every decision, every analysis, every
              outcome.
            </p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Left Panel - Decision List */}
          <div className="col-span-4 space-y-4">
            {/* Create New Decision */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>➕</span> New Decision
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Decision title..."
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                />
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What decision needs to be made?"
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm h-20 resize-none"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="Budget ($)"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                  />
                  <input
                    type="text"
                    value={newTimeframe}
                    onChange={(e) => setNewTimeframe(e.target.value)}
                    placeholder="Timeframe"
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 text-sm"
                  />
                </div>
                <button
                  onClick={createDecision}
                  disabled={isCreating || !newTitle.trim() || !newDescription.trim()}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium text-sm transition-colors"
                >
                  {isCreating ? 'Creating...' : 'Create Decision'}
                </button>
              </div>
            </div>

            {/* Decision List */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span>📋</span> Tracked Decisions ({filteredDecisions.length})
              </h3>

              {/* Filter Tabs */}
              <div className="flex items-center gap-1 mb-3 p-1 bg-slate-700/50 rounded-lg">
                {(['all', 'deciding', 'decided', 'at-risk'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setDecisionFilter(filter)}
                    className={cn(
                      'flex-1 px-2 py-1.5 rounded text-xs font-medium transition-all',
                      decisionFilter === filter
                        ? filter === 'at-risk'
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-600/50'
                    )}
                  >
                    {filter === 'all' && 'All'}
                    {filter === 'deciding' && 'Deciding'}
                    {filter === 'decided' && 'Decided'}
                    {filter === 'at-risk' && '⚠️ At Risk'}
                  </button>
                ))}
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredDecisions.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    {decisionFilter === 'all'
                      ? 'No decisions tracked yet. Create one above!'
                      : `No ${decisionFilter} decisions found.`}
                  </p>
                ) : (
                  filteredDecisions.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => loadDecision(d.id)}
                      className={cn(
                        'w-full p-3 rounded-lg border text-left transition-all',
                        selectedDecision?.id === d.id
                          ? 'bg-blue-600/20 border-blue-500'
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="text-white font-medium text-sm truncate">{d.title}</div>
                          <div className="text-slate-400 text-xs mt-1">
                            {d.eventCount} events • {formatDate(d.createdAt)}
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className={cn(
                              'px-2 py-0.5 rounded text-xs font-medium',
                              STATUS_COLORS[d.status] || 'bg-gray-500'
                            )}
                          >
                            {d.status}
                          </span>
                          {d.riskScore !== undefined && (
                            <span
                              className={cn(
                                'text-xs',
                                d.riskScore > 60
                                  ? 'text-red-400'
                                  : d.riskScore > 40
                                    ? 'text-yellow-400'
                                    : 'text-green-400'
                              )}
                            >
                              {d.riskScore}% risk
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Panel - Timeline */}
          <div className="col-span-8">
            {!selectedDecision ? (
              <div className="bg-slate-800/50 rounded-xl p-12 border border-slate-700 text-center">
                <span className="text-6xl mb-4 block">🧬</span>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Select or Create a Decision
                </h3>
                <p className="text-slate-400">
                  Track the full DNA of any business decision - from initial context through
                  analysis to outcome.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Status & Governance Header */}
                <div className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Status:</span>
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-medium',
                        selectedDecision.status === 'decided' || selectedDecision.status === 'implemented'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : selectedDecision.status === 'deliberating'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-500/20 text-slate-300'
                      )}>
                        {selectedDecision.status === 'decided' ? '✓ Decided' :
                         selectedDecision.status === 'implemented' ? '✓ Implemented' :
                         selectedDecision.status === 'deliberating' ? '⏳ Under Review' :
                         selectedDecision.status === 'analyzing' ? '🔍 Analyzing' : '📝 Draft'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">Mode:</span>
                      <span className="text-slate-300">DDGI</span>
                    </div>
                    {selectedDecision.owner && (
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">Owner:</span>
                        <span className="text-slate-300">{selectedDecision.owner.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    {selectedDecision.decisionId && <span>ID: {selectedDecision.decisionId}</span>}
                    <span>Updated: {formatDate(selectedDecision.updatedAt)}</span>
                  </div>
                </div>

                {/* Decision Header */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white">{selectedDecision.title}</h2>
                      <p className="text-slate-400 mt-1">{selectedDecision.description}</p>

                      {/* Decision ID & Owner Metadata Strip */}
                      <div className="flex flex-wrap items-center gap-3 mt-3 py-2 px-3 bg-slate-700/50 rounded-lg text-xs">
                        {selectedDecision.decisionId && (
                          <span className="text-slate-300">
                            <span className="text-slate-500">Decision ID:</span>{' '}
                            <span className="font-mono font-medium text-cyan-400">
                              {selectedDecision.decisionId}
                            </span>
                          </span>
                        )}
                        {selectedDecision.owner && (
                          <span className="text-slate-300">
                            <span className="text-slate-500">Owner:</span>{' '}
                            <span className="font-medium">
                              {selectedDecision.owner.role} ({selectedDecision.owner.name})
                            </span>
                          </span>
                        )}
                        <span className="text-slate-300">
                          <span className="text-slate-500">Council Status:</span>{' '}
                          <span
                            className={cn(
                              'font-medium',
                              selectedDecision.status === 'decided'
                                ? 'text-green-400'
                                : 'text-amber-400'
                            )}
                          >
                            {selectedDecision.status.charAt(0).toUpperCase() +
                              selectedDecision.status.slice(1)}
                          </span>
                          {selectedDecision.councilConfidence && (
                            <span className="relative group ml-1">
                              <span className="text-slate-300">({selectedDecision.councilConfidence}% consensus)</span>
                              <span className="ml-1 text-slate-500 cursor-help">ⓘ</span>
                              <span className="absolute bottom-full left-0 mb-2 w-64 p-2 bg-slate-800 border border-slate-600 rounded-lg text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                <strong className="text-white">Consensus Score</strong> = weighted agreement across Council agents, calibrated against historical decision outcomes.
                              </span>
                            </span>
                          )}
                        </span>
                        <span className="text-slate-300">
                          <span className="text-slate-500">Last updated:</span>{' '}
                          <span className="font-medium">
                            {formatDate(selectedDecision.updatedAt)}
                          </span>
                        </span>
                      </div>

                      {/* Status & Budget Row */}
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded font-medium',
                            STATUS_COLORS[selectedDecision.status] || 'bg-gray-500'
                          )}
                        >
                          {selectedDecision.status}
                        </span>
                        {selectedDecision.budget && (
                          <span className="text-slate-400">
                            💰 ${selectedDecision.budget.toLocaleString()}
                          </span>
                        )}
                        {selectedDecision.timeframe && (
                          <span className="text-slate-400">📅 {selectedDecision.timeframe}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <button
                        onClick={runPreMortem}
                        disabled={isLoading}
                        className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
                      >
                        💀 Pre-Mortem
                      </button>
                      <button
                        onClick={() => setReplayMode(!replayMode)}
                        className={cn(
                          'px-3 py-2 rounded-lg text-sm font-medium',
                          replayMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        )}
                        title="Replay decision timeline step-by-step in Chronos"
                      >
                        {replayMode ? '⏹️ Exit Replay' : '🎬 Replay in Chronos'}
                      </button>
                    </div>
                  </div>

                  {/* Immutable Hash Banner with Verification Details */}
                  {selectedDecision.auditHash && (
                    <div className="mt-3 p-3 bg-green-900/30 border border-green-700/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-green-400 text-lg">🔐</span>
                          <div>
                            <span className="text-green-400 text-xs font-medium">
                              Immutable Hash (Chronos Ledger)
                            </span>
                            <span className="text-green-300 text-xs font-mono ml-2">
                              {selectedDecision.auditHash}
                            </span>
                          </div>
                        </div>
                        <span className="text-green-400 text-xs px-2 py-0.5 bg-green-500/20 rounded">
                          ✓ Cryptographically anchored
                        </span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-green-700/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4 text-green-300/70">
                          <span>Signed: Ed25519</span>
                          <span>Key: Organization KMS</span>
                          <span>Chain: Chronos Ledger</span>
                        </div>
                        <code className="text-green-300/60 font-mono text-[10px]">
                          datacendia verify decision.json --ledger chronos
                        </code>
                      </div>
                    </div>
                  )}

                  {/* Linked Workflows */}
                  {selectedDecision.linkedWorkflows &&
                    selectedDecision.linkedWorkflows.length > 0 && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-slate-500 text-xs">Linked Workflows:</span>
                        <div className="flex items-center gap-1">
                          {selectedDecision.linkedWorkflows.map((wf) => (
                            <button
                              key={wf.id}
                              onClick={() =>
                                window.open(`/cortex/bridge/workflows/${wf.id}`, '_blank')
                              }
                              className="px-2 py-0.5 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/30 rounded text-xs text-indigo-300 hover:text-indigo-200 transition-colors"
                              title={`Open "${wf.name}" in Bridge`}
                            >
                              ⚙️ {wf.name}
                            </button>
                          ))}
                        </div>
                        <span
                          className="text-slate-500 text-xs ml-1"
                          title="These are the automations/actions this decision triggered"
                        >
                          ({selectedDecision.linkedWorkflows.length} workflows triggered)
                        </span>
                      </div>
                    )}
                </div>

                {/* Replay Controls */}
                {replayMode && (
                  <div className="bg-purple-900/30 rounded-xl p-4 border border-purple-700">
                    <div className="flex items-center justify-between">
                      <span className="text-purple-300 font-medium">
                        🎬 Replay Mode - Step {replayStep + 1} of {selectedDecision.timeline.length}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setReplayStep(Math.max(0, replayStep - 1))}
                          disabled={replayStep === 0}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm"
                        >
                          ◀ Prev
                        </button>
                        <button
                          onClick={() =>
                            setReplayStep(
                              Math.min(selectedDecision.timeline.length - 1, replayStep + 1)
                            )
                          }
                          disabled={replayStep >= selectedDecision.timeline.length - 1}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 text-white rounded text-sm"
                        >
                          Next ▶
                        </button>
                        <button
                          onClick={() => setReplayStep(selectedDecision.timeline.length - 1)}
                          className="px-3 py-1 bg-purple-700 hover:bg-purple-600 text-white rounded text-sm"
                        >
                          ⏭ End
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        type="range"
                        min={0}
                        max={selectedDecision.timeline.length - 1}
                        value={replayStep}
                        onChange={(e) => setReplayStep(parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}

                {/* Timeline */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <span>📜</span> Decision Timeline
                  </h3>

                  <div className="relative">
                    {/* Timeline line */}
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-slate-600" />

                    {/* Events */}
                    <div className="space-y-4">
                      {getVisibleEvents().map((event, idx) => (
                        <div
                          key={event.id}
                          className={cn(
                            'relative pl-14 transition-all',
                            replayMode && idx === replayStep && 'scale-105'
                          )}
                        >
                          {/* Event dot */}
                          <div
                            className={cn(
                              'absolute left-4 w-5 h-5 rounded-full flex items-center justify-center text-xs',
                              EVENT_COLORS[event.type] || 'bg-gray-500',
                              replayMode &&
                                idx === replayStep &&
                                'ring-2 ring-purple-400 ring-offset-2 ring-offset-slate-800'
                            )}
                          >
                            {EVENT_ICONS[event.type] || '📌'}
                          </div>

                          {/* Event card */}
                          <div
                            className={cn(
                              'bg-slate-700/50 rounded-lg p-3 border cursor-pointer transition-all group',
                              expandedEvent === event.id
                                ? 'border-blue-500'
                                : 'border-slate-600 hover:border-slate-500'
                            )}
                            onClick={() =>
                              setExpandedEvent(expandedEvent === event.id ? null : event.id)
                            }
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-white font-medium">{event.title}</span>
                                  {/* Artefact type icon */}
                                  <span
                                    className="text-slate-500 text-xs"
                                    title={`${event.type.replace('_', ' ')} artefact`}
                                  >
                                    {event.type === 'context_added' && '📄'}
                                    {event.type === 'premortem_run' && '⚠️'}
                                    {event.type === 'council_session' && '📋'}
                                    {event.type === 'ghost_board' && '🎭'}
                                  </span>
                                </div>
                                <div className="text-slate-400 text-sm mt-1">{event.summary}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-500 text-xs whitespace-nowrap">
                                  {formatDate(event.timestamp)}
                                </span>
                                {/* Open Artefact button */}
                                {(event.type === 'premortem_run' ||
                                  event.type === 'council_session' ||
                                  event.type === 'ghost_board' ||
                                  event.type === 'context_added') && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      // Navigate to the appropriate artefact
                                      if (event.type === 'premortem_run') {
                                        window.open('/cortex/sovereign/crucible', '_blank');
                                      } else if (event.type === 'council_session') {
                                        window.open('/cortex/council', '_blank');
                                      } else if (event.type === 'ghost_board') {
                                        window.open('/cortex/intelligence/ghost-board', '_blank');
                                      } else if (event.type === 'context_added') {
                                        // Could link to document viewer
                                        setExpandedEvent(event.id);
                                      }
                                    }}
                                    className="opacity-0 group-hover:opacity-100 px-2 py-1 bg-slate-600 hover:bg-slate-500 rounded text-xs text-slate-300 hover:text-white transition-all"
                                    title="Open artefact"
                                  >
                                    ↗️ Open
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Expanded data */}
                            {expandedEvent === event.id && event.data && (
                              <div className="mt-3 pt-3 border-t border-slate-600">
                                {event.agentsInvolved && event.agentsInvolved.length > 0 && (
                                  <div className="mb-3 flex items-center gap-2 flex-wrap">
                                    <span className="text-slate-400 text-xs">Agents:</span>
                                    {event.agentsInvolved.map((agent) => (
                                      <span
                                        key={agent}
                                        className="px-2 py-0.5 bg-slate-600 rounded text-xs text-white"
                                      >
                                        {agent}
                                      </span>
                                    ))}
                                  </div>
                                )}

                                {/* Council Session formatted view */}
                                {event.type === 'council_session' &&
                                (event.data.deliberation || event.data.agentResponses) ? (
                                  <div className="space-y-3">
                                    {/* Confidence & Consensus */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div
                                          className={cn(
                                            'text-2xl font-bold',
                                            (event.data.confidence ||
                                              event.data.consensusLevel / 100) >= 0.8
                                              ? 'text-green-400'
                                              : (event.data.confidence ||
                                                    event.data.consensusLevel / 100) >= 0.6
                                                ? 'text-amber-400'
                                                : 'text-red-400'
                                          )}
                                        >
                                          {Math.round(
                                            (event.data.confidence ||
                                              event.data.consensusLevel / 100) * 100
                                          )}
                                          %
                                        </div>
                                        <div className="text-xs text-slate-400">Confidence</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="flex-1">
                                        {event.data.voteSummary ? (
                                          <>
                                            <div className="flex gap-2 mb-1">
                                              <span className="px-2 py-0.5 bg-green-600/30 text-green-400 rounded text-xs">
                                                {event.data.voteSummary.support || 0} Support
                                              </span>
                                              <span className="px-2 py-0.5 bg-amber-600/30 text-amber-400 rounded text-xs">
                                                {event.data.voteSummary.cautious || 0} Cautious
                                              </span>
                                              <span className="px-2 py-0.5 bg-red-600/30 text-red-400 rounded text-xs">
                                                {event.data.voteSummary.oppose || 0} Oppose
                                              </span>
                                            </div>
                                            <div className="text-xs text-slate-400">
                                              Agent Votes
                                            </div>
                                          </>
                                        ) : (
                                          <>
                                            <div className="text-sm text-white font-medium">
                                              {(
                                                event.data.deliberation || event.data.agentResponses
                                              )?.length || 0}{' '}
                                              Agents
                                            </div>
                                            <div className="text-xs text-slate-400">
                                              Participated
                                            </div>
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {/* Consensus */}
                                    {(event.data.consensus || event.data.synthesis) && (
                                      <div className="p-3 bg-indigo-900/30 border border-indigo-700/50 rounded-lg">
                                        <div className="text-xs text-indigo-400 font-medium mb-1">
                                          🏛️ Council Consensus
                                        </div>
                                        <div className="text-white text-sm">
                                          {event.data.consensus || event.data.synthesis}
                                        </div>
                                      </div>
                                    )}

                                    {/* Agent Deliberations - supports both sample format and backend format */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Agent Deliberations (
                                        {(event.data.deliberation || event.data.agentResponses)
                                          ?.length || 0}
                                        )
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {(
                                          event.data.deliberation || event.data.agentResponses
                                        )?.map((d: any, i: number) => (
                                          <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-2">
                                              <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-indigo-600 rounded text-xs text-white font-medium">
                                                  {d.agent || d.agentName || d.agentId}
                                                </span>
                                                {d.stance && (
                                                  <span
                                                    className={cn(
                                                      'px-2 py-0.5 rounded text-xs font-medium',
                                                      d.stance === 'support'
                                                        ? 'bg-green-600/30 text-green-400'
                                                        : d.stance === 'cautious'
                                                          ? 'bg-amber-600/30 text-amber-400'
                                                          : 'bg-red-600/30 text-red-400'
                                                    )}
                                                  >
                                                    {d.stance === 'support'
                                                      ? '✓ Support'
                                                      : d.stance === 'cautious'
                                                        ? '⚠ Cautious'
                                                        : '✗ Oppose'}
                                                  </span>
                                                )}
                                              </div>
                                              <span className="text-xs text-slate-400">
                                                {Math.round((d.confidence || 0) * 100)}% confident
                                              </span>
                                            </div>
                                            <p className="text-sm text-slate-300">
                                              {d.summary || d.response}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : event.type === 'premortem_run' && event.data.failureModes ? (
                                  <div className="space-y-3">
                                    {/* Risk Summary */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div
                                          className={cn(
                                            'text-2xl font-bold',
                                            event.data.riskScore >= 70
                                              ? 'text-red-400'
                                              : event.data.riskScore >= 40
                                                ? 'text-amber-400'
                                                : 'text-green-400'
                                          )}
                                        >
                                          {event.data.riskScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Risk Score</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          ${(event.data.totalExposure / 1000000).toFixed(1)}M
                                        </div>
                                        <div className="text-xs text-slate-400">Exposure</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div
                                          className={cn(
                                            'text-lg font-semibold uppercase',
                                            event.data.recommendation === 'proceed'
                                              ? 'text-green-400'
                                              : event.data.recommendation === 'delay'
                                                ? 'text-amber-400'
                                                : 'text-red-400'
                                          )}
                                        >
                                          {event.data.recommendation}
                                        </div>
                                        <div className="text-xs text-slate-400">Recommendation</div>
                                      </div>
                                    </div>

                                    {/* Failure Modes */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Top Failure Modes ({event.data.failureModes.length})
                                      </div>
                                      <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {event.data.failureModes.map((fm: any, i: number) => (
                                          <div
                                            key={i}
                                            className="p-3 bg-slate-800 rounded-lg flex items-center justify-between"
                                          >
                                            <div className="flex items-center gap-3">
                                              <div
                                                className={cn(
                                                  'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold',
                                                  fm.probability >= 70
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : fm.probability >= 50
                                                      ? 'bg-amber-500/20 text-amber-400'
                                                      : 'bg-green-500/20 text-green-400'
                                                )}
                                              >
                                                {fm.probability}%
                                              </div>
                                              <div>
                                                <div className="text-white font-medium">
                                                  {fm.title}
                                                </div>
                                                <span className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-400">
                                                  {fm.category}
                                                </span>
                                              </div>
                                            </div>
                                            <div className="text-right">
                                              <div className="text-red-400 font-semibold">
                                                ${(fm.costImpact / 1000).toFixed(0)}K
                                              </div>
                                              <div className="text-xs text-slate-500">impact</div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ) : event.type === 'ghost_board' && event.data.questions ? (
                                  <div className="space-y-3">
                                    {/* Preparedness Score */}
                                    <div className="flex items-center gap-4 p-3 bg-slate-800 rounded-lg">
                                      <div className="text-center">
                                        <div
                                          className={cn(
                                            'text-2xl font-bold',
                                            event.data.preparednessScore >= 80
                                              ? 'text-green-400'
                                              : event.data.preparednessScore >= 60
                                                ? 'text-amber-400'
                                                : 'text-red-400'
                                          )}
                                        >
                                          {event.data.preparednessScore}%
                                        </div>
                                        <div className="text-xs text-slate-400">Preparedness</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center">
                                        <div className="text-2xl font-bold text-white">
                                          {event.data.questions?.length || 0}
                                        </div>
                                        <div className="text-xs text-slate-400">Questions</div>
                                      </div>
                                      <div className="h-10 w-px bg-slate-600" />
                                      <div className="text-center flex-1">
                                        <div className="text-lg font-semibold text-pink-400">
                                          {event.data.concerns?.length || 0} Concerns
                                        </div>
                                        <div className="text-xs text-slate-400">Raised</div>
                                      </div>
                                    </div>

                                    {/* Board Questions */}
                                    <div>
                                      <div className="text-sm font-medium text-slate-300 mb-2">
                                        Board Questions ({event.data.questions?.length || 0})
                                      </div>
                                      <div className="space-y-2 max-h-48 overflow-y-auto">
                                        {event.data.questions?.map((q: any, i: number) => (
                                          <div key={i} className="p-3 bg-slate-800 rounded-lg">
                                            <div className="flex items-center justify-between mb-1">
                                              <span className="px-2 py-0.5 bg-pink-600/30 text-pink-400 rounded text-xs font-medium">
                                                {q.member}
                                              </span>
                                              <div className="flex items-center gap-2">
                                                <span
                                                  className={cn(
                                                    'px-2 py-0.5 rounded text-xs',
                                                    q.difficulty === 'hard'
                                                      ? 'bg-red-600/30 text-red-400'
                                                      : q.difficulty === 'medium'
                                                        ? 'bg-amber-600/30 text-amber-400'
                                                        : 'bg-green-600/30 text-green-400'
                                                  )}
                                                >
                                                  {q.difficulty}
                                                </span>
                                                <span
                                                  className={cn(
                                                    'text-xs',
                                                    q.answered ? 'text-green-400' : 'text-red-400'
                                                  )}
                                                >
                                                  {q.answered ? '✓ Answered' : '✗ Unanswered'}
                                                </span>
                                              </div>
                                            </div>
                                            <p className="text-sm text-slate-300">{q.question}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Concerns */}
                                    {event.data.concerns && event.data.concerns.length > 0 && (
                                      <div className="p-3 bg-pink-900/30 border border-pink-700/50 rounded-lg">
                                        <div className="text-xs text-pink-400 font-medium mb-2">
                                          👻 Board Concerns
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {event.data.concerns.map((c: string, i: number) => (
                                            <span
                                              key={i}
                                              className="px-2 py-1 bg-pink-600/20 border border-pink-600/30 rounded text-xs text-pink-300"
                                            >
                                              {c}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : event.type === 'context_added' && event.data ? (
                                  <div className="p-3 bg-purple-900/30 border border-purple-700/50 rounded-lg">
                                    <div className="text-xs text-purple-400 font-medium mb-2">
                                      📄 Context Added
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                      {event.data.documents && (
                                        <span className="text-sm text-slate-300">
                                          <span className="text-purple-400 font-medium">
                                            {event.data.documents}
                                          </span>{' '}
                                          documents attached
                                        </span>
                                      )}
                                      {event.data.npv && (
                                        <span className="text-sm text-slate-300">
                                          NPV:{' '}
                                          <span className="text-green-400 font-medium">
                                            ${(event.data.npv / 1000000).toFixed(1)}M
                                          </span>
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                ) : Object.keys(event.data).length > 0 ? (
                                  <pre className="text-xs text-slate-300 bg-slate-800 rounded p-2 overflow-x-auto max-h-48">
                                    {JSON.stringify(event.data, null, 2)}
                                  </pre>
                                ) : null}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Summary Cards - Clickable */}
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => {
                      // Scroll to pre-mortem events in timeline
                      const pmEvent = selectedDecision.timeline.find(
                        (e) => e.type === 'premortem_run'
                      );
                      if (pmEvent) {setExpandedEvent(pmEvent.id);}
                    }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-amber-500/50 hover:bg-slate-700/50 transition-all text-left group"
                    title="Click to view Pre-Mortem details in timeline"
                  >
                    <div className="text-amber-400 text-2xl mb-2">💀</div>
                    <div className="text-white font-semibold group-hover:text-amber-300">
                      Pre-Mortems
                    </div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.preMortems.length}
                    </div>
                    {selectedDecision.preMortems.length > 0 && (
                      <div className="text-slate-400 text-sm mt-1">
                        Last risk:{' '}
                        {selectedDecision.preMortems[selectedDecision.preMortems.length - 1]
                          ?.riskScore ||
                          selectedDecision.preMortems[selectedDecision.preMortems.length - 1]
                            ?.highRisk}
                        %
                      </div>
                    )}
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      // Scroll to council events in timeline
                      const csEvent = selectedDecision.timeline.find(
                        (e) => e.type === 'council_session'
                      );
                      if (csEvent) {setExpandedEvent(csEvent.id);}
                    }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all text-left group"
                    title="Click to view Council Session details in timeline"
                  >
                    <div className="text-indigo-400 text-2xl mb-2">🏛️</div>
                    <div className="text-white font-semibold group-hover:text-indigo-300">
                      Council Sessions
                    </div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.councilSessions.length}
                    </div>
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      // Scroll to ghost board events in timeline
                      const gbEvent = selectedDecision.timeline.find(
                        (e) => e.type === 'ghost_board'
                      );
                      if (gbEvent) {setExpandedEvent(gbEvent.id);}
                    }}
                    className="bg-slate-800/50 rounded-xl p-4 border border-slate-700 hover:border-pink-500/50 hover:bg-slate-700/50 transition-all text-left group"
                    title="Click to view Ghost Board details in timeline"
                  >
                    <div className="text-pink-400 text-2xl mb-2">👻</div>
                    <div className="text-white font-semibold group-hover:text-pink-300">
                      Board Simulations
                    </div>
                    <div className="text-3xl font-bold text-white mt-1">
                      {selectedDecision.ghostBoardSimulations.length}
                    </div>
                    <div className="text-slate-500 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to view →
                    </div>
                  </button>
                </div>

                {/* Audit Export - Enhanced */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-semibold">🔒 Audit Export</h3>
                      <p
                        className="text-slate-400 text-sm"
                        title="Full decision record for regulators, auditors, or M&A diligence"
                      >
                        Export full decision record for compliance and auditing
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          // Generate a simple HTML/PDF-friendly format
                          const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Decision Audit: ${selectedDecision.title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #1e293b; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; }
    h2 { color: #334155; margin-top: 30px; }
    .meta { background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .meta span { display: block; margin: 5px 0; }
    .timeline { border-left: 3px solid #3b82f6; padding-left: 20px; }
    .event { margin: 20px 0; padding: 10px; background: #f8fafc; border-radius: 8px; }
    .event-title { font-weight: bold; color: #1e293b; }
    .event-date { color: #64748b; font-size: 12px; }
    .hash { font-family: monospace; background: #dcfce7; padding: 10px; border-radius: 4px; color: #166534; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px; }
  </style>
</head>
<body>
  <h1>📋 Decision Audit Report</h1>
  <h2>${selectedDecision.title}</h2>
  <p>${selectedDecision.description}</p>
  
  <div class="meta">
    <span><strong>Decision ID:</strong> ${selectedDecision.decisionId || selectedDecision.id}</span>
    <span><strong>Status:</strong> ${selectedDecision.status}</span>
    <span><strong>Owner:</strong> ${selectedDecision.owner?.role || 'N/A'} (${selectedDecision.owner?.name || 'N/A'})</span>
    <span><strong>Created:</strong> ${new Date(selectedDecision.createdAt).toLocaleString()}</span>
    <span><strong>Last Updated:</strong> ${new Date(selectedDecision.updatedAt).toLocaleString()}</span>
    ${selectedDecision.budget ? `<span><strong>Budget:</strong> $${selectedDecision.budget.toLocaleString()}</span>` : ''}
  </div>

  <h2>Decision Timeline</h2>
  <div class="timeline">
    ${selectedDecision.timeline
      .map(
        (e) => `
      <div class="event">
        <div class="event-title">${e.title}</div>
        <div class="event-date">${new Date(e.timestamp).toLocaleString()}</div>
        <p>${e.summary}</p>
      </div>
    `
      )
      .join('')}
  </div>

  ${
    selectedDecision.finalDecision
      ? `
    <h2>Final Decision</h2>
    <p>${selectedDecision.finalDecision}</p>
  `
      : ''
  }

  <h2>Cryptographic Verification</h2>
  <div class="hash">${selectedDecision.auditHash || 'Hash not yet generated'}</div>
  <p><em>This hash anchors the decision record to the Chronos immutable ledger. Any modification would change this hash.</em></p>

  <div class="footer">
    Generated by Datacendia Decision DNA • ${new Date().toLocaleString()} • For audit and compliance purposes
  </div>
</body>
</html>`;
                          const blob = new Blob([htmlContent], { type: 'text/html' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `decision-${selectedDecision.decisionId || selectedDecision.id}-audit.html`;
                          a.click();
                        }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium"
                        title="Board-friendly HTML format for printing/PDF"
                      >
                        📄 Export PDF
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(selectedDecision, null, 2)], {
                            type: 'application/json',
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `decision-${selectedDecision.decisionId || selectedDecision.id}-audit.json`;
                          a.click();
                        }}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium"
                        title="Machine-friendly JSON format for integrations"
                      >
                        📥 Export JSON
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page Guide */}
      <PageGuide {...GUIDES.decisionDNA} />
    </div>
  );
};

export default DecisionDNAPage;
