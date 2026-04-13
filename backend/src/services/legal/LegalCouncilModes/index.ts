// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export class LegalModeCategory { [key: string]: any; }

interface LegalMode { id: string; name: string; description: string; category: string; leadAgent: string; agents: string[]; maxRounds: number }

const MODES: LegalMode[] = [
  { id: 'litigation-strategy', name: 'Litigation Strategy', description: 'Full litigation analysis and strategy', category: 'litigation', leadAgent: 'lead-counsel', agents: ['lead-counsel', 'risk-analyst', 'research-clerk'], maxRounds: 5 },
  { id: 'contract-review', name: 'Contract Review', description: 'Contract analysis and risk assessment', category: 'transactional', leadAgent: 'compliance-officer', agents: ['compliance-officer', 'risk-analyst', 'lead-counsel'], maxRounds: 3 },
  { id: 'regulatory-compliance', name: 'Regulatory Compliance', description: 'Compliance assessment', category: 'compliance', leadAgent: 'compliance-officer', agents: ['compliance-officer', 'research-clerk', 'ethics-guardian'], maxRounds: 4 },
  { id: 'due-diligence', name: 'Due Diligence', description: 'M&A and transaction due diligence', category: 'transactional', leadAgent: 'risk-analyst', agents: ['risk-analyst', 'compliance-officer', 'research-clerk'], maxRounds: 5 },
  { id: 'mock-trial', name: 'Mock Trial', description: 'Jury simulation with juror archetypes', category: 'litigation', leadAgent: 'lead-counsel', agents: ['lead-counsel', 'devils-advocate'], maxRounds: 7 },
  { id: 'ip-analysis', name: 'IP Analysis', description: 'Intellectual property review', category: 'ip', leadAgent: 'research-clerk', agents: ['research-clerk', 'lead-counsel'], maxRounds: 3 },
];

export const ALL_LEGAL_MODES = MODES;

export const getLegalMode = (id: string) => MODES.find(m => m.id === id) || null;

export const getLegalModesByCategory = (category: string) => MODES.filter(m => m.category === category);

export const getLegalModesByLeadAgent = (agentId: string) => MODES.filter(m => m.leadAgent === agentId);
