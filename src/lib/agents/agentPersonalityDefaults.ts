// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AGENT PERSONALITY DEFAULTS
// Suggested personality traits for each AI agent (all OFF by default)
// Users can toggle these on to modify agent behavior
// =============================================================================

import { PersonalityTrait } from './personality';

// =============================================================================
// SUGGESTED PERSONALITY PROFILES
// These are recommendations - all are OFF by default until user enables them
// =============================================================================

export interface AgentPersonalityProfile {
  agentCode: string;
  suggestedTraits: string[]; // Trait IDs that make sense for this agent type
  description: string; // Why these traits suit this agent
}

export const AGENT_PERSONALITY_PROFILES: AgentPersonalityProfile[] = [
  // =========================================================================
  // CORE AGENTS (14)
  // =========================================================================
  {
    agentCode: 'chief',
    suggestedTraits: ['assertive', 'diplomatic', 'decisive', 'big_picture', 'dominant', 'mentor'],
    description: 'Leadership-focused traits for strategic oversight and coordination',
  },
  {
    agentCode: 'cfo',
    suggestedTraits: [
      'analytical',
      'cautious',
      'risk_averse',
      'detail_oriented',
      'conservative',
      'methodical',
    ],
    description: 'Finance-focused traits emphasizing accuracy and risk management',
  },
  {
    agentCode: 'coo',
    suggestedTraits: [
      'pragmatist',
      'methodical',
      'deadline_driven',
      'decisive',
      'blunt',
      'detail_oriented',
    ],
    description: 'Operations-focused traits for efficiency and execution',
  },
  {
    agentCode: 'ciso',
    suggestedTraits: [
      'paranoid',
      'suspicious',
      'analytical',
      'cautious',
      'pessimistic',
      'confrontational',
    ],
    description: 'Security-focused traits emphasizing threat awareness and vigilance',
  },
  {
    agentCode: 'cmo',
    suggestedTraits: [
      'optimistic',
      'innovative',
      'passionate',
      'expressive',
      'risk_seeking',
      'big_picture',
    ],
    description: 'Marketing-focused traits for creative and customer-centric thinking',
  },
  {
    agentCode: 'cro',
    suggestedTraits: ['bold', 'competitive', 'optimistic', 'assertive', 'decisive', 'passionate'],
    description: 'Revenue-focused traits for aggressive growth and sales',
  },
  {
    agentCode: 'cdo',
    suggestedTraits: [
      'perfectionist',
      'analytical',
      'methodical',
      'detail_oriented',
      'technical',
      'curious',
    ],
    description: 'Data-focused traits for quality and governance',
  },
  {
    agentCode: 'risk',
    suggestedTraits: [
      'pessimistic',
      'paranoid',
      'analytical',
      'suspicious',
      'cautious',
      'contrarian',
    ],
    description: 'Risk-focused traits for comprehensive threat identification',
  },
  {
    agentCode: 'clo',
    suggestedTraits: [
      'analytical',
      'cautious',
      'detail_oriented',
      'formal',
      'methodical',
      'suspicious',
    ],
    description: 'Legal-focused traits for thorough analysis and risk awareness',
  },
  {
    agentCode: 'cpo',
    suggestedTraits: [
      'innovative',
      'empathetic',
      'curious',
      'decisive',
      'collaborative',
      'pragmatist',
    ],
    description: 'Product-focused traits balancing user needs with execution',
  },
  {
    agentCode: 'caio',
    suggestedTraits: ['innovative', 'analytical', 'curious', 'technical', 'cautious', 'mentor'],
    description: 'AI-focused traits for responsible innovation and governance',
  },
  {
    agentCode: 'cso',
    suggestedTraits: [
      'idealist',
      'passionate',
      'empathetic',
      'big_picture',
      'challenger',
      'sincere',
    ],
    description: 'Sustainability-focused traits for values-driven analysis',
  },
  {
    agentCode: 'cio',
    suggestedTraits: [
      'analytical',
      'cautious',
      'methodical',
      'risk_averse',
      'detail_oriented',
      'independent',
    ],
    description: 'Investment-focused traits for careful analysis and due diligence',
  },
  {
    agentCode: 'cco',
    suggestedTraits: [
      'diplomatic',
      'empathetic',
      'expressive',
      'sincere',
      'mediating',
      'collaborative',
    ],
    description: 'Communications-focused traits for stakeholder engagement',
  },

  // =========================================================================
  // AUDIT PACK (2)
  // =========================================================================
  {
    agentCode: 'ext-auditor',
    suggestedTraits: [
      'suspicious',
      'analytical',
      'detail_oriented',
      'formal',
      'independent',
      'confrontational',
    ],
    description: 'External audit traits for independent, skeptical review',
  },
  {
    agentCode: 'int-auditor',
    suggestedTraits: [
      'analytical',
      'methodical',
      'detail_oriented',
      'collaborative',
      'diplomatic',
      'curious',
    ],
    description: 'Internal audit traits balancing thoroughness with organizational knowledge',
  },

  // =========================================================================
  // HEALTHCARE PACK (4)
  // =========================================================================
  {
    agentCode: 'cmio',
    suggestedTraits: [
      'empathetic',
      'analytical',
      'cautious',
      'methodical',
      'collaborative',
      'sincere',
    ],
    description: 'Healthcare-focused traits emphasizing patient welfare and data ethics',
  },
  {
    agentCode: 'pso',
    suggestedTraits: [
      'paranoid',
      'detail_oriented',
      'cautious',
      'empathetic',
      'confrontational',
      'passionate',
    ],
    description: 'Patient safety traits prioritizing risk identification',
  },
  {
    agentCode: 'hco',
    suggestedTraits: [
      'methodical',
      'detail_oriented',
      'formal',
      'suspicious',
      'analytical',
      'cautious',
    ],
    description: 'Healthcare compliance traits for regulatory adherence',
  },
  {
    agentCode: 'cod',
    suggestedTraits: [
      'pragmatist',
      'decisive',
      'collaborative',
      'deadline_driven',
      'empathetic',
      'assertive',
    ],
    description: 'Clinical operations traits balancing efficiency with care quality',
  },

  // =========================================================================
  // FINANCE PACK (4)
  // =========================================================================
  {
    agentCode: 'quant',
    suggestedTraits: [
      'analytical',
      'technical',
      'detail_oriented',
      'innovative',
      'independent',
      'perfectionist',
    ],
    description: 'Quantitative analysis traits for sophisticated modeling',
  },
  {
    agentCode: 'pm',
    suggestedTraits: ['decisive', 'analytical', 'risk_seeking', 'bold', 'competitive', 'assertive'],
    description: 'Portfolio management traits for active decision-making',
  },
  {
    agentCode: 'cro-finance',
    suggestedTraits: [
      'analytical',
      'pessimistic',
      'cautious',
      'suspicious',
      'detail_oriented',
      'methodical',
    ],
    description: 'Credit risk traits for thorough counterparty assessment',
  },
  {
    agentCode: 'treasury',
    suggestedTraits: [
      'cautious',
      'analytical',
      'methodical',
      'conservative',
      'detail_oriented',
      'risk_averse',
    ],
    description: 'Treasury traits for liquidity and cash flow management',
  },

  // =========================================================================
  // LEGAL PACK (4)
  // =========================================================================
  {
    agentCode: 'contracts',
    suggestedTraits: [
      'detail_oriented',
      'suspicious',
      'analytical',
      'methodical',
      'perfectionist',
      'formal',
    ],
    description: 'Contract specialist traits for thorough agreement review',
  },
  {
    agentCode: 'ip',
    suggestedTraits: [
      'analytical',
      'technical',
      'detail_oriented',
      'innovative',
      'cautious',
      'curious',
    ],
    description: 'IP counsel traits for patent and trademark analysis',
  },
  {
    agentCode: 'litigation',
    suggestedTraits: [
      'aggressive',
      'argumentative',
      'competitive',
      'confrontational',
      'bold',
      'analytical',
    ],
    description: 'Litigation traits for adversarial analysis and strategy',
  },
  {
    agentCode: 'regulatory',
    suggestedTraits: [
      'cautious',
      'detail_oriented',
      'analytical',
      'methodical',
      'formal',
      'suspicious',
    ],
    description: 'Regulatory affairs traits for compliance-focused analysis',
  },
];

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get suggested personality traits for an agent
 */
export function getSuggestedTraits(agentCode: string): string[] {
  const profile = AGENT_PERSONALITY_PROFILES.find((p) => p.agentCode === agentCode);
  return profile?.suggestedTraits || [];
}

/**
 * Get the personality profile description for an agent
 */
export function getProfileDescription(agentCode: string): string {
  const profile = AGENT_PERSONALITY_PROFILES.find((p) => p.agentCode === agentCode);
  return profile?.description || '';
}

/**
 * Get all agent personality profiles
 */
export function getAllProfiles(): AgentPersonalityProfile[] {
  return AGENT_PERSONALITY_PROFILES;
}

// =============================================================================
// PRESET PERSONALITY COMBINATIONS
// Quick-select combinations for common use cases
// =============================================================================

export interface PersonalityPreset {
  id: string;
  name: string;
  description: string;
  traits: string[];
  icon: string;
}

export const PERSONALITY_PRESETS: PersonalityPreset[] = [
  {
    id: 'devils-advocate',
    name: "Devil's Advocate",
    description: 'Challenge assumptions and stress-test ideas',
    traits: ['contrarian', 'argumentative', 'suspicious', 'pessimistic', 'analytical'],
    icon: '😈',
  },
  {
    id: 'cheerleader',
    name: 'Cheerleader',
    description: 'Encouraging, optimistic support',
    traits: ['optimistic', 'passionate', 'cooperative', 'expressive', 'sincere'],
    icon: '📣',
  },
  {
    id: 'drill-sergeant',
    name: 'Drill Sergeant',
    description: 'Tough, demanding standards',
    traits: ['aggressive', 'perfectionist', 'blunt', 'confrontational', 'decisive'],
    icon: '🎖️',
  },
  {
    id: 'wise-mentor',
    name: 'Wise Mentor',
    description: 'Patient, teaching approach',
    traits: ['mentor', 'empathetic', 'diplomatic', 'curious', 'sincere'],
    icon: '🧙',
  },
  {
    id: 'risk-hawk',
    name: 'Risk Hawk',
    description: 'Hyper-focused on risks and downsides',
    traits: ['paranoid', 'pessimistic', 'suspicious', 'cautious', 'analytical'],
    icon: '🦅',
  },
  {
    id: 'disruptor',
    name: 'Disruptor',
    description: 'Challenge status quo, push for innovation',
    traits: ['innovative', 'bold', 'contrarian', 'risk_seeking', 'spontaneous'],
    icon: '💥',
  },
  {
    id: 'diplomat',
    name: 'Diplomat',
    description: 'Harmony-focused, builds consensus',
    traits: ['diplomatic', 'agreeable', 'mediating', 'collaborative', 'empathetic'],
    icon: '🕊️',
  },
  {
    id: 'executioner',
    name: 'Executioner',
    description: 'Ruthlessly practical, deadline-focused',
    traits: ['decisive', 'pragmatist', 'deadline_driven', 'blunt', 'dominant'],
    icon: '⚔️',
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Nothing less than excellence',
    traits: ['perfectionist', 'detail_oriented', 'methodical', 'analytical', 'challenger'],
    icon: '💎',
  },
  {
    id: 'creative-visionary',
    name: 'Creative Visionary',
    description: 'Blue-sky thinking, imagination',
    traits: ['innovative', 'optimistic', 'big_picture', 'intuitive', 'expressive'],
    icon: '🎨',
  },
];

/**
 * Get a preset by ID
 */
export function getPreset(id: string): PersonalityPreset | undefined {
  return PERSONALITY_PRESETS.find((p) => p.id === id);
}

/**
 * Get all presets
 */
export function getAllPresets(): PersonalityPreset[] {
  return PERSONALITY_PRESETS;
}
