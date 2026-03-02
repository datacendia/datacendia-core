// =============================================================================
// PERSONALITY TRAITS TESTS
// =============================================================================

import { describe, it, expect } from 'vitest';

// Import personality system
import {
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
} from '../../src/lib/agents/personality';

import {
  AGENT_PERSONALITY_PROFILES,
  PERSONALITY_PRESETS,
  getSuggestedTraits,
  getAllProfiles,
  getAllPresets,
  getPreset,
} from '../../src/lib/agents/agentPersonalityDefaults';

describe('Personality Traits System', () => {
  describe('Trait Library', () => {
    it('should have 50+ personality traits defined', () => {
      expect(PERSONALITY_TRAITS.length).toBeGreaterThanOrEqual(50);
      expect(TOTAL_TRAIT_COUNT).toBeGreaterThanOrEqual(50);
    });

    it('should have unique trait IDs', () => {
      const ids = PERSONALITY_TRAITS.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have all required fields for each trait', () => {
      PERSONALITY_TRAITS.forEach(trait => {
        expect(trait.id).toBeDefined();
        expect(trait.name).toBeDefined();
        expect(trait.category).toBeDefined();
        expect(trait.description).toBeDefined();
        expect(trait.promptModifier).toBeDefined();
        expect(trait.intensity).toMatch(/^(subtle|moderate|strong)$/);
        expect(trait.icon).toBeDefined();
      });
    });

    it('should have traits in all 10 categories', () => {
      const categories = getTraitCategories();
      expect(categories.length).toBe(10);
      
      categories.forEach(category => {
        const categoryTraits = getTraitsByCategory(category.id);
        expect(categoryTraits.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Trait Retrieval', () => {
    it('should get all available traits', () => {
      const traits = getAvailableTraits();
      expect(traits.length).toBe(PERSONALITY_TRAITS.length);
    });

    it('should get trait by ID', () => {
      const trait = getTrait('assertive');
      expect(trait).toBeDefined();
      expect(trait?.name).toBe('Assertive');
    });

    it('should return undefined for invalid trait ID', () => {
      const trait = getTrait('invalid-trait-id');
      expect(trait).toBeUndefined();
    });

    it('should get traits by category', () => {
      const communicationTraits = getTraitsByCategory('communication_style');
      expect(communicationTraits.length).toBeGreaterThan(5);
      communicationTraits.forEach(t => {
        expect(t.category).toBe('communication_style');
      });
    });
  });

  describe('Trait Conflicts', () => {
    it('should detect conflicts between opposing traits', () => {
      expect(traitsConflict('assertive', 'passive')).toBe(true);
      expect(traitsConflict('optimistic', 'pessimistic')).toBe(true);
      expect(traitsConflict('aggressive', 'diplomatic')).toBe(true);
    });

    it('should not report conflicts for compatible traits', () => {
      expect(traitsConflict('analytical', 'methodical')).toBe(false);
      expect(traitsConflict('curious', 'empathetic')).toBe(false);
    });

    it('should validate trait combinations', () => {
      // Valid combination
      const validResult = validateTraitCombination(['analytical', 'methodical', 'curious']);
      expect(validResult.valid).toBe(true);
      expect(validResult.conflicts).toHaveLength(0);

      // Invalid combination (conflicts)
      const invalidResult = validateTraitCombination(['assertive', 'passive', 'analytical']);
      expect(invalidResult.valid).toBe(false);
      expect(invalidResult.conflicts.length).toBeGreaterThan(0);
    });
  });

  describe('Prompt Modification', () => {
    const basePrompt = 'You are a helpful AI assistant.';

    it('should not modify prompt when no traits enabled', () => {
      const result = applyPersonalityToPrompt(basePrompt, []);
      expect(result).toBe(basePrompt);
    });

    it('should add personality modifiers when traits enabled', () => {
      const result = applyPersonalityToPrompt(basePrompt, ['assertive']);
      expect(result).toContain(basePrompt);
      expect(result).toContain('PERSONALITY MODIFIERS');
      expect(result).toContain('assertive');
    });

    it('should add multiple trait modifiers', () => {
      const result = applyPersonalityToPrompt(basePrompt, ['assertive', 'analytical']);
      expect(result).toContain('assertive');
      expect(result).toContain('analytical');
    });

    it('should ignore invalid trait IDs', () => {
      const result = applyPersonalityToPrompt(basePrompt, ['invalid-id']);
      expect(result).toBe(basePrompt);
    });
  });

  describe('Trait Categories', () => {
    it('should return all 10 categories', () => {
      const categories = getTraitCategories();
      expect(categories.length).toBe(10);
    });

    it('should have category names and descriptions', () => {
      const categories = getTraitCategories();
      categories.forEach(cat => {
        expect(cat.id).toBeDefined();
        expect(cat.name).toBeDefined();
        expect(cat.description).toBeDefined();
      });
    });

    it('should count traits by category correctly', () => {
      const counts = getTraitCountByCategory();
      let total = 0;
      Object.values(counts).forEach(count => {
        expect(count).toBeGreaterThan(0);
        total += count;
      });
      expect(total).toBe(TOTAL_TRAIT_COUNT);
    });
  });
});

describe('Agent Personality Profiles', () => {
  describe('Profile Definitions', () => {
    it('should have profiles for all 30 agents', () => {
      expect(AGENT_PERSONALITY_PROFILES.length).toBe(28); // 14 core + 14 premium pack agents
    });

    it('should have unique agent codes', () => {
      const codes = AGENT_PERSONALITY_PROFILES.map(p => p.agentCode);
      const uniqueCodes = new Set(codes);
      expect(uniqueCodes.size).toBe(codes.length);
    });

    it('should have suggested traits for each agent', () => {
      AGENT_PERSONALITY_PROFILES.forEach(profile => {
        expect(profile.suggestedTraits.length).toBeGreaterThan(0);
        expect(profile.description).toBeDefined();
      });
    });

    it('should reference valid trait IDs', () => {
      AGENT_PERSONALITY_PROFILES.forEach(profile => {
        profile.suggestedTraits.forEach(traitId => {
          const trait = getTrait(traitId);
          expect(trait, `Invalid trait ${traitId} in ${profile.agentCode}`).toBeDefined();
        });
      });
    });
  });

  describe('Profile Retrieval', () => {
    it('should get suggested traits for an agent', () => {
      const traits = getSuggestedTraits('chief');
      expect(traits.length).toBeGreaterThan(0);
      expect(traits).toContain('assertive');
    });

    it('should return empty array for unknown agent', () => {
      const traits = getSuggestedTraits('unknown-agent');
      expect(traits).toEqual([]);
    });

    it('should get all profiles', () => {
      const profiles = getAllProfiles();
      expect(profiles.length).toBe(AGENT_PERSONALITY_PROFILES.length);
    });
  });
});

describe('Personality Presets', () => {
  describe('Preset Definitions', () => {
    it('should have 10 personality presets', () => {
      expect(PERSONALITY_PRESETS.length).toBe(10);
    });

    it('should have unique preset IDs', () => {
      const ids = PERSONALITY_PRESETS.map(p => p.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('should have required fields for each preset', () => {
      PERSONALITY_PRESETS.forEach(preset => {
        expect(preset.id).toBeDefined();
        expect(preset.name).toBeDefined();
        expect(preset.description).toBeDefined();
        expect(preset.traits.length).toBeGreaterThan(0);
        expect(preset.icon).toBeDefined();
      });
    });

    it('should reference valid trait IDs', () => {
      PERSONALITY_PRESETS.forEach(preset => {
        preset.traits.forEach(traitId => {
          const trait = getTrait(traitId);
          expect(trait, `Invalid trait ${traitId} in preset ${preset.id}`).toBeDefined();
        });
      });
    });
  });

  describe('Preset Retrieval', () => {
    it('should get preset by ID', () => {
      const preset = getPreset('devils-advocate');
      expect(preset).toBeDefined();
      expect(preset?.name).toBe("Devil's Advocate");
    });

    it('should return undefined for invalid preset ID', () => {
      const preset = getPreset('invalid-preset');
      expect(preset).toBeUndefined();
    });

    it('should get all presets', () => {
      const presets = getAllPresets();
      expect(presets.length).toBe(PERSONALITY_PRESETS.length);
    });
  });

  describe('Preset Combinations', () => {
    it("should have valid Devil's Advocate combination", () => {
      const preset = getPreset('devils-advocate');
      expect(preset?.traits).toContain('contrarian');
      expect(preset?.traits).toContain('argumentative');
    });

    it('should have valid Risk Hawk combination', () => {
      const preset = getPreset('risk-hawk');
      expect(preset?.traits).toContain('paranoid');
      expect(preset?.traits).toContain('pessimistic');
    });

    it('should have valid presets without internal conflicts', () => {
      PERSONALITY_PRESETS.forEach(preset => {
        const validation = validateTraitCombination(preset.traits);
        expect(validation.valid, `Preset ${preset.id} has internal conflicts`).toBe(true);
      });
    });
  });
});

describe('Specific Trait Tests', () => {
  describe('Communication Style Traits', () => {
    const traits = ['assertive', 'passive', 'aggressive', 'diplomatic', 'blunt'];
    
    traits.forEach(traitId => {
      it(`should have ${traitId} trait defined`, () => {
        const trait = getTrait(traitId);
        expect(trait).toBeDefined();
        expect(trait?.category).toBe('communication_style');
      });
    });
  });

  describe('Disposition Traits', () => {
    const traits = ['optimistic', 'pessimistic', 'cynical', 'trusting', 'suspicious'];
    
    traits.forEach(traitId => {
      it(`should have ${traitId} trait defined`, () => {
        const trait = getTrait(traitId);
        expect(trait).toBeDefined();
        expect(trait?.category).toBe('disposition');
      });
    });
  });

  describe('Conflict Approach Traits', () => {
    const traits = ['argumentative', 'agreeable', 'contrarian', 'confrontational'];
    
    traits.forEach(traitId => {
      it(`should have ${traitId} trait defined`, () => {
        const trait = getTrait(traitId);
        expect(trait).toBeDefined();
        expect(trait?.category).toBe('conflict_approach');
      });
    });
  });

  describe('Risk Attitude Traits', () => {
    const traits = ['risk_seeking', 'risk_averse', 'cautious', 'bold', 'paranoid'];
    
    traits.forEach(traitId => {
      it(`should have ${traitId} trait defined`, () => {
        const trait = getTrait(traitId);
        expect(trait).toBeDefined();
        expect(trait?.category).toBe('risk_attitude');
      });
    });
  });
});
