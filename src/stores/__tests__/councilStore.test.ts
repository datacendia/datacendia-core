/**
 * Tests for src/stores/councilStore.ts
 * Covers: agent management, deliberation state, messages, selectors
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useCouncilStore } from '../councilStore';
import type { Agent, DeliberationMessage, Deliberation } from '../councilStore';

// Mock fetch
global.fetch = vi.fn();

describe('useCouncilStore', () => {
  beforeEach(() => {
    useCouncilStore.setState({
      agents: [],
      activeDeliberation: null,
      deliberationHistory: [],
      isLoading: false,
      isDeliberating: false,
      error: null,
      selectedAgents: [],
      deliberationMode: 'consensus',
    });
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const state = useCouncilStore.getState();
      expect(state.agents).toEqual([]);
      expect(state.activeDeliberation).toBeNull();
      expect(state.deliberationHistory).toEqual([]);
      expect(state.isLoading).toBe(false);
      expect(state.isDeliberating).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedAgents).toEqual([]);
      expect(state.deliberationMode).toBe('consensus');
    });
  });

  describe('agent actions', () => {
    const mockAgents: Agent[] = [
      { id: 'agent-1', code: 'cendia-compliance', name: 'Compliance', role: 'Compliance Officer', description: 'Checks compliance', isActive: true },
      { id: 'agent-2', code: 'cendia-finance', name: 'Finance', role: 'CFO', description: 'Financial analysis', isActive: true },
    ];

    it('should set agents', () => {
      useCouncilStore.getState().setAgents(mockAgents);
      expect(useCouncilStore.getState().agents).toHaveLength(2);
    });

    it('should select an agent', () => {
      useCouncilStore.getState().selectAgent('agent-1');
      expect(useCouncilStore.getState().selectedAgents).toContain('agent-1');
    });

    it('should not duplicate selected agents', () => {
      useCouncilStore.getState().selectAgent('agent-1');
      useCouncilStore.getState().selectAgent('agent-1');
      expect(useCouncilStore.getState().selectedAgents).toHaveLength(1);
    });

    it('should deselect an agent', () => {
      useCouncilStore.getState().selectAgent('agent-1');
      useCouncilStore.getState().selectAgent('agent-2');
      useCouncilStore.getState().deselectAgent('agent-1');
      expect(useCouncilStore.getState().selectedAgents).toEqual(['agent-2']);
    });

    it('should set selected agents directly', () => {
      useCouncilStore.getState().setSelectedAgents(['agent-1', 'agent-2']);
      expect(useCouncilStore.getState().selectedAgents).toEqual(['agent-1', 'agent-2']);
    });
  });

  describe('deliberation mode', () => {
    it('should set deliberation mode', () => {
      useCouncilStore.getState().setDeliberationMode('debate');
      expect(useCouncilStore.getState().deliberationMode).toBe('debate');

      useCouncilStore.getState().setDeliberationMode('advisory');
      expect(useCouncilStore.getState().deliberationMode).toBe('advisory');

      useCouncilStore.getState().setDeliberationMode('voting');
      expect(useCouncilStore.getState().deliberationMode).toBe('voting');
    });
  });

  describe('deliberation status updates', () => {
    const mockDeliberation: Deliberation = {
      id: 'delib-1',
      organizationId: 'org-1',
      question: 'Should we expand?',
      status: 'in_progress',
      progress: 50,
      messages: [],
      createdAt: new Date(),
    };

    beforeEach(() => {
      useCouncilStore.setState({
        activeDeliberation: mockDeliberation,
        isDeliberating: true,
      });
    });

    it('should update deliberation status', () => {
      useCouncilStore.getState().updateDeliberationStatus('completed', 'final', 100);
      const state = useCouncilStore.getState();

      expect(state.activeDeliberation?.status).toBe('completed');
      expect(state.activeDeliberation?.currentPhase).toBe('final');
      expect(state.activeDeliberation?.progress).toBe(100);
      expect(state.isDeliberating).toBe(false);
      expect(state.activeDeliberation?.completedAt).toBeDefined();
    });

    it('should stop deliberating on failure', () => {
      useCouncilStore.getState().updateDeliberationStatus('failed');
      expect(useCouncilStore.getState().isDeliberating).toBe(false);
    });

    it('should stop deliberating on cancellation', () => {
      useCouncilStore.getState().updateDeliberationStatus('cancelled');
      expect(useCouncilStore.getState().isDeliberating).toBe(false);
    });

    it('should add a message to active deliberation', () => {
      const message: DeliberationMessage = {
        id: 'msg-1',
        agentId: 'agent-1',
        agentName: 'Compliance',
        phase: 'analysis',
        content: 'This meets all compliance requirements.',
        confidence: 0.95,
        timestamp: new Date(),
      };

      useCouncilStore.getState().addMessage(message);
      expect(useCouncilStore.getState().activeDeliberation?.messages).toHaveLength(1);
      expect(useCouncilStore.getState().activeDeliberation?.messages[0].content).toBe('This meets all compliance requirements.');
    });

    it('should not add message without active deliberation', () => {
      useCouncilStore.setState({ activeDeliberation: null });

      useCouncilStore.getState().addMessage({
        id: 'msg-1',
        agentId: 'agent-1',
        agentName: 'Test',
        phase: 'test',
        content: 'test',
        timestamp: new Date(),
      });

      // No error, just silently ignored
      expect(useCouncilStore.getState().activeDeliberation).toBeNull();
    });

    it('should set decision and complete deliberation', () => {
      const decision = {
        outcome: 'Approved',
        confidence: 0.87,
        rationale: 'Financial analysis shows positive ROI',
        dissents: [
          { agentId: 'agent-2', agentName: 'Risk', reason: 'High market volatility' },
        ],
      };

      useCouncilStore.getState().setDecision(decision);
      const state = useCouncilStore.getState();

      expect(state.activeDeliberation?.decision).toEqual(decision);
      expect(state.activeDeliberation?.status).toBe('completed');
      expect(state.isDeliberating).toBe(false);
    });
  });

  describe('reset', () => {
    it('should reset to clean state', () => {
      useCouncilStore.setState({
        activeDeliberation: { id: '1', organizationId: 'org', question: 'test', status: 'completed', progress: 100, messages: [], createdAt: new Date() },
        isDeliberating: true,
        error: 'some error',
        selectedAgents: ['a', 'b'],
      });

      useCouncilStore.getState().reset();
      const state = useCouncilStore.getState();

      expect(state.activeDeliberation).toBeNull();
      expect(state.isDeliberating).toBe(false);
      expect(state.error).toBeNull();
      expect(state.selectedAgents).toEqual([]);
    });
  });

  describe('utility actions', () => {
    it('should set loading state', () => {
      useCouncilStore.getState().setLoading(true);
      expect(useCouncilStore.getState().isLoading).toBe(true);
    });

    it('should set error', () => {
      useCouncilStore.getState().setError('Something failed');
      expect(useCouncilStore.getState().error).toBe('Something failed');
    });

    it('should clear error', () => {
      useCouncilStore.getState().setError('Error');
      useCouncilStore.getState().clearError();
      expect(useCouncilStore.getState().error).toBeNull();
    });
  });

  describe('selectors', () => {
    it('selectAgents should return agents', async () => {
      const { selectAgents } = await import('../councilStore');
      useCouncilStore.getState().setAgents([
        { id: '1', code: 'c1', name: 'Agent 1', role: 'role', description: 'desc', isActive: true },
      ]);
      expect(selectAgents(useCouncilStore.getState())).toHaveLength(1);
    });

    it('selectIsDeliberating should return deliberation state', async () => {
      const { selectIsDeliberating } = await import('../councilStore');
      expect(selectIsDeliberating(useCouncilStore.getState())).toBe(false);
    });

    it('selectDeliberationMessages should return empty array without active deliberation', async () => {
      const { selectDeliberationMessages } = await import('../councilStore');
      expect(selectDeliberationMessages(useCouncilStore.getState())).toEqual([]);
    });
  });
});
