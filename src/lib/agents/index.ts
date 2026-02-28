// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AGENTS MODULE - AI Agent Personality & Configuration
// =============================================================================

// Personality traits system - Types
export type { PersonalityTrait, TraitCategory, AgentPersonalityConfig } from './personality';

// Personality traits system - Values & Functions
export {
  PERSONALITY_TRAITS,
  TOTAL_TRAIT_COUNT,
  getAvailableTraits,
  getTraitsByCategory,
  getTrait,
  traitsConflict,
  validateTraitCombination,
  applyPersonalityToPrompt,
  getTraitCategories,
  getTraitCountByCategory,
} from './personality';

// Agent personality defaults and presets - Types
export type { AgentPersonalityProfile, PersonalityPreset } from './agentPersonalityDefaults';

// Agent personality defaults and presets - Values & Functions
export {
  AGENT_PERSONALITY_PROFILES,
  PERSONALITY_PRESETS,
  getSuggestedTraits,
  getProfileDescription,
  getAllProfiles,
  getPreset,
  getAllPresets,
} from './agentPersonalityDefaults';

// Model switching system - Types
export type {
  OllamaModel,
  ModelCapability,
  ModelCategory,
  AgentModelConfig,
} from './modelSwitching';

// Model switching system - Values & Functions
export {
  AVAILABLE_MODELS,
  MODEL_CATEGORIES,
  AGENT_MODEL_RECOMMENDATIONS,
  DEFAULT_AGENT_MODELS,
  TOTAL_MODEL_COUNT,
  getAvailableModels,
  getModel,
  getModelsByCapability,
  getModelsByQuality,
  getModelsBySpeed,
  getRecommendedModels,
  getDefaultModel,
  getModelCategories,
  estimateTokensPerSecond,
  isModelSuitable,
} from './modelSwitching';

// Tech Team - Types
export type { ErrorAnalysis, FixSuggestion, TechTeamConfig } from './techTeam';

// Tech Team - Values & Functions
export {
  TECH_TEAM_AGENTS,
  TECH_TEAM_COUNT,
  DEFAULT_TECH_TEAM_CONFIG,
  getTechTeamAgents,
  getTechAgent,
  getAgentsByCapability,
  assignAgentForError,
  generateFixPrompt,
} from './techTeam';
