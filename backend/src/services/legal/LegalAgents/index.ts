// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export class JurorArchetype { [key: string]: any; }

interface LegalAgentDef { id: string; name: string; role: string; expertise: string[]; isDefault: boolean; isOptional: boolean; isSilentGuard: boolean; systemPrompt: string }

const AGENTS: LegalAgentDef[] = [
  { id: 'lead-counsel', name: 'Lead Counsel', role: 'strategist', expertise: ['litigation', 'negotiation'], isDefault: true, isOptional: false, isSilentGuard: false, systemPrompt: 'You are the lead legal strategist.' },
  { id: 'compliance-officer', name: 'Compliance Officer', role: 'compliance', expertise: ['regulatory', 'ethics'], isDefault: true, isOptional: false, isSilentGuard: false, systemPrompt: 'You enforce regulatory compliance.' },
  { id: 'risk-analyst', name: 'Risk Analyst', role: 'risk', expertise: ['risk-assessment', 'due-diligence'], isDefault: true, isOptional: false, isSilentGuard: false, systemPrompt: 'You analyze legal risks.' },
  { id: 'research-clerk', name: 'Research Clerk', role: 'research', expertise: ['caselaw', 'statutes'], isDefault: true, isOptional: false, isSilentGuard: false, systemPrompt: 'You research case law and statutes.' },
  { id: 'devils-advocate', name: "Devil's Advocate", role: 'challenger', expertise: ['argumentation'], isDefault: false, isOptional: true, isSilentGuard: false, systemPrompt: 'You challenge every assumption.' },
  { id: 'ethics-guardian', name: 'Ethics Guardian', role: 'ethics', expertise: ['legal-ethics', 'bar-rules'], isDefault: false, isOptional: false, isSilentGuard: true, systemPrompt: 'You silently monitor for ethical violations.' },
  { id: 'privilege-guard', name: 'Privilege Guard', role: 'privilege', expertise: ['attorney-client', 'work-product'], isDefault: false, isOptional: false, isSilentGuard: true, systemPrompt: 'You protect privileged communications.' },
];

const JUROR_ARCHETYPES: JurorArchetype[] = [
  Object.assign(new JurorArchetype(), { id: 'analytical', name: 'Analytical Juror', bias: 'evidence-focused', weight: 1.0 }),
  Object.assign(new JurorArchetype(), { id: 'empathetic', name: 'Empathetic Juror', bias: 'narrative-focused', weight: 1.0 }),
  Object.assign(new JurorArchetype(), { id: 'skeptical', name: 'Skeptical Juror', bias: 'doubt-focused', weight: 1.0 }),
  Object.assign(new JurorArchetype(), { id: 'pragmatic', name: 'Pragmatic Juror', bias: 'outcome-focused', weight: 1.0 }),
];

export const ALL_LEGAL_AGENTS = AGENTS;

export const getLegalAgent = (id: string) => AGENTS.find(a => a.id === id) || null;

export const getDefaultLegalAgents = () => AGENTS.filter(a => a.isDefault);

export const getOptionalLegalAgents = () => AGENTS.filter(a => a.isOptional);

export const getSilentGuardAgents = () => AGENTS.filter(a => a.isSilentGuard);

export const getLegalAgentsByExpertise = (expertise: string) =>
  AGENTS.filter(a => a.expertise.some(e => e.includes(expertise.toLowerCase())));

export const buildLegalAgentTeam = (opts?: { includeOptional?: boolean; expertiseFilter?: string }) => {
  let team = getDefaultLegalAgents();
  if (opts?.includeOptional) team = [...team, ...getOptionalLegalAgents()];
  if (opts?.expertiseFilter) team = team.filter(a => a.expertise.some(e => e.includes(opts.expertiseFilter!)));
  return team;
};

export const buildJuryPanel = (size = 6) => JUROR_ARCHETYPES.slice(0, size);

export const getJurorArchetypes = () => JUROR_ARCHETYPES;

export const getJurorAgents = () => JUROR_ARCHETYPES.map(a => ({ ...a, role: 'juror', systemPrompt: `You deliberate as a ${a['name'] || 'juror'}.` }));
