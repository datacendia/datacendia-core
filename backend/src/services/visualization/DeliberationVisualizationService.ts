// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

interface AgentVizState { id: string; status: string; statement?: string; confidence?: number; citations: any[]; dissents: any[] }
interface VizState { deliberationId: string; topic: string; agents: AgentVizState[]; currentRound: number; maxRounds: number; status: string; timeline: any[]; createdAt: string }

class DeliberationVisualizationServiceImpl {
  private states = new Map<string, VizState>();

  initializeVisualization(deliberationId: string, topic: string, agents: string[], maxRounds = 5): VizState {
    const state: VizState = {
      deliberationId, topic,
      agents: agents.map(id => ({ id, status: 'waiting', citations: [], dissents: [] })),
      currentRound: 1, maxRounds, status: 'active', timeline: [],
      createdAt: new Date().toISOString(),
    };
    this.states.set(deliberationId, state);
    return state;
  }

  getVisualizationState(id: string): VizState | undefined { return this.states.get(id); }

  updateAgentStatus(deliberationId: string, agentId: string, status: string, statement?: string) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    const agent = state.agents.find(a => a.id === agentId);
    if (agent) { agent.status = status; if (statement) agent.statement = statement; }
    state.timeline.push({ type: 'agent-status', agentId, status, statement, round: state.currentRound, timestamp: new Date().toISOString() });
  }

  updateConfidence(deliberationId: string, agentId: string, confidence: number) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    const agent = state.agents.find(a => a.id === agentId);
    if (agent) agent.confidence = confidence;
    state.timeline.push({ type: 'confidence', agentId, confidence, round: state.currentRound, timestamp: new Date().toISOString() });
  }

  addCitation(deliberationId: string, agentId: string, citation: any) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    const agent = state.agents.find(a => a.id === agentId);
    agent?.citations.push(citation);
    state.timeline.push({ type: 'citation', agentId, citation, round: state.currentRound, timestamp: new Date().toISOString() });
  }

  registerDissent(deliberationId: string, agentId: string, reason: string, severity: string) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    const agent = state.agents.find(a => a.id === agentId);
    agent?.dissents.push({ reason, severity, round: state.currentRound });
    state.timeline.push({ type: 'dissent', agentId, reason, severity, round: state.currentRound, timestamp: new Date().toISOString() });
  }

  advanceRound(deliberationId: string) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    state.currentRound = Math.min(state.currentRound + 1, state.maxRounds);
    state.agents.forEach(a => { a.status = 'waiting'; });
    state.timeline.push({ type: 'round-advance', round: state.currentRound, timestamp: new Date().toISOString() });
  }

  concludeWithConsensus(deliberationId: string, decision: string) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    state.status = 'concluded';
    state.timeline.push({ type: 'consensus', decision, round: state.currentRound, timestamp: new Date().toISOString() });
  }

  concludeDeliberation(deliberationId: string) {
    const state = this.states.get(deliberationId);
    if (!state) return;
    state.status = 'concluded';
    state.timeline.push({ type: 'concluded', round: state.currentRound, timestamp: new Date().toISOString() });
  }

  getTimeline(deliberationId: string): any[] { return this.states.get(deliberationId)?.timeline || []; }

  getActiveVisualizations(): VizState[] { return [...this.states.values()].filter(s => s.status === 'active'); }
}

export const deliberationVisualizationService = new DeliberationVisualizationServiceImpl();
