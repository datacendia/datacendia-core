/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/verticals/eu-banking/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

export { Basel3Engine, basel3Engine } from './Basel3Engine.js';
export type {
  CET1Components, AT1Components, Tier2Components,
  CreditRiskExposure, MarketRiskPosition, OperationalRiskData,
  LCRComponents, NSFRComponents,
  Basel3CapitalResult, Basel3LiquidityResult, Basel3Breach,
  LargeExposureResult,
  CRRExposureClass, CollateralType,
} from './Basel3Engine.js';

export { EUAIActEngine, euAIActEngine } from './EUAIActEngine.js';
export type {
  AIRiskLevel, AnnexIIIArea, AISystemDescriptor, BankingAIDomain,
  HumanOversightLevel, AIActClassificationResult, AIActObligation,
  ObligationCategory, FRIAResult, FundamentalRightAssessment,
  FundamentalRight, MitigationMeasure, TechnicalDocumentation,
  AISystemRegistration, ConformityRoute,
} from './EUAIActEngine.js';
