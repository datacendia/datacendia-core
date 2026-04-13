// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export class JurorArchetype { [key: string]: any; }

export interface LegalAgentDef { id: string; name: string; role: string; expertise: string[]; isDefault: boolean; isOptional: boolean; isSilentGuard: boolean; systemPrompt: string }

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

export const buildLegalAgentTeam = (defaultIdsOrOpts?: string[] | { includeOptional?: boolean; expertiseFilter?: string }, optionalIds?: string[]) => {
  if (Array.isArray(defaultIdsOrOpts)) {
    const defaults = defaultIdsOrOpts.map(id => AGENTS.find(a => a.id === id)).filter(Boolean) as LegalAgentDef[];
    const optionals = (optionalIds || []).map(id => AGENTS.find(a => a.id === id)).filter(Boolean) as LegalAgentDef[];
    return { defaultAgents: defaults, optionalAgents: optionals };
  }
  const opts = defaultIdsOrOpts;
  let team = getDefaultLegalAgents();
  if (opts?.includeOptional) team = [...team, ...getOptionalLegalAgents()];
  if (opts?.expertiseFilter) team = team.filter(a => a.expertise.some(e => e.includes(opts.expertiseFilter!)));
  return { defaultAgents: team, optionalAgents: [] as LegalAgentDef[] };
};

export const buildJuryPanel = (caseIdOrSize?: string | number, _composition?: any, alternateCount = 2) => {
  const size = typeof caseIdOrSize === 'number' ? caseIdOrSize : 6;
  const jurors = JUROR_ARCHETYPES.slice(0, size);
  const alternates = JUROR_ARCHETYPES.slice(0, alternateCount);
  const foreperson = jurors[0] || { name: 'Unknown' };
  return { jurors, alternates, foreperson, composition: { total: jurors.length, alternateCount: alternates.length } };
};

export const getJurorArchetypes = () => JUROR_ARCHETYPES;

export const getJurorAgents = () => JUROR_ARCHETYPES.map(a => ({ ...a, role: 'juror', systemPrompt: `You deliberate as a ${a['name'] || 'juror'}.` }));
