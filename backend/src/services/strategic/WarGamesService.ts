// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import crypto from 'crypto';
import { deterministicPick, deterministicPercentage } from '../../utils/deterministic.js';

const BUILTIN_SCENARIOS = [
  { id: 'ransomware-strike', name: 'Ransomware Strike', category: 'cyber', difficulty: 'hard', description: 'Coordinated ransomware attack during board meeting', durationMinutes: 60 },
  { id: 'data-breach', name: 'Massive Data Breach', category: 'cyber', difficulty: 'hard', description: 'Customer PII exfiltrated via supply chain', durationMinutes: 90 },
  { id: 'regulatory-raid', name: 'Regulatory Raid', category: 'compliance', difficulty: 'medium', description: 'Surprise regulatory inspection with data requests', durationMinutes: 45 },
  { id: 'key-person-loss', name: 'Key Person Departure', category: 'operational', difficulty: 'medium', description: 'CTO resignation with IP concerns', durationMinutes: 30 },
  { id: 'market-crash', name: 'Market Flash Crash', category: 'financial', difficulty: 'hard', description: 'Sudden 40% market decline affecting portfolio', durationMinutes: 60 },
  { id: 'supply-chain', name: 'Supply Chain Collapse', category: 'operational', difficulty: 'hard', description: 'Critical supplier goes bankrupt mid-delivery', durationMinutes: 75 },
];

class WarGamesServiceImpl {
  private simulations = new Map<string, any>();
  private certifications = new Map<string, any>();

  getAllScenarios() { return BUILTIN_SCENARIOS; }
  getScenario(id: string) { return BUILTIN_SCENARIOS.find(s => s.id === id) || null; }

  async startSimulation(orgId: string, operatorId: string, scenarioId: string) {
    const scenario = this.getScenario(scenarioId);
    if (!scenario) throw new Error('Scenario not found');
    const id = `sim-${crypto.randomUUID().slice(0, 8)}`;
    const sim = { id, organizationId: orgId, operatorId, scenarioId, scenario, status: 'active', elapsedSeconds: 0, events: [{ id: `evt-${crypto.randomUUID().slice(0, 6)}`, description: scenario.description, options: [{ id: 'contain', label: 'Contain immediately' }, { id: 'investigate', label: 'Investigate first' }, { id: 'escalate', label: 'Escalate to leadership' }], timestamp: new Date().toISOString() }], decisions: [], startedAt: new Date().toISOString() };
    this.simulations.set(id, sim);
    return sim;
  }

  async advanceSimulation(id: string, deltaSeconds: number) {
    const sim = this.simulations.get(id);
    if (!sim) throw new Error('Simulation not found');
    sim.elapsedSeconds += deltaSeconds;
    const seed = `advance-${id}-${sim.elapsedSeconds}`;
    const newEvent = { id: `evt-${crypto.randomUUID().slice(0, 6)}`, description: deterministicPick(['Situation escalating', 'New intelligence received', 'Stakeholder pressure increasing', 'Media inquiry incoming'], seed), options: [{ id: 'mitigate', label: 'Deploy mitigation' }, { id: 'wait', label: 'Wait and observe' }], timestamp: new Date().toISOString() };
    sim.events.push(newEvent);
    return { simulation: sim, newEvent };
  }

  async submitDecision(simId: string, eventId: string, optionId: string, reasoning: string) {
    const sim = this.simulations.get(simId);
    if (!sim) throw new Error('Simulation not found');
    const decision = { eventId, optionId, reasoning, submittedAt: new Date().toISOString() };
    sim.decisions.push(decision);
    return decision;
  }

  async completeSimulation(id: string) {
    const sim = this.simulations.get(id);
    if (!sim) throw new Error('Simulation not found');
    sim.status = 'completed';
    const seed = `score-${id}`;
    const score = { simulationId: id, overall: deterministicPercentage(72, 20, seed), categories: { responseTime: deterministicPercentage(80, 15, `${seed}-rt`), decisionQuality: deterministicPercentage(75, 15, `${seed}-dq`), communication: deterministicPercentage(70, 20, `${seed}-comm`), containment: deterministicPercentage(68, 20, `${seed}-cont`) }, completedAt: new Date().toISOString() };
    sim.score = score;
    return score;
  }

  getSimulation(id: string) { return this.simulations.get(id) || null; }

  getOperatorCertification(operatorId: string) { return this.certifications.get(operatorId) || null; }

  getMetrics() { return { totalSimulations: this.simulations.size, completed: [...this.simulations.values()].filter(s => s.status === 'completed').length, scenarios: BUILTIN_SCENARIOS.length }; }
}

export const warGamesService = new WarGamesServiceImpl();
