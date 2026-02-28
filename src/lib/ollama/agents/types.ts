// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA DOMAIN AGENT TYPES
 */

export type PersonalityTraitId = string;

export interface DomainAgent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities: string[];
  systemPrompt: string;
  model: string;
  defaultPersonality?: PersonalityTraitId[];
  enabledTraits?: PersonalityTraitId[];
  premium?: boolean;
  premiumTier?: 'pilot' | 'foundation' | 'enterprise' | 'strategic';
  premiumPackage?: string;
  premiumPrice?: string;
  isCustom?: boolean;
  vertical?: 'legal' | 'healthcare' | 'finance' | 'government' | 'insurance' | 'pharmaceutical' | 'manufacturing' | 'energy' | 'technology' | 'retail' | 'real-estate' | 'transportation' | 'media' | 'professional-services' | 'education' | 'sports';
}
