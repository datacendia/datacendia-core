/**
 * API Routes — Eu Banking
 *
 * Express route handler defining REST endpoints.
 * @module routes/eu-banking
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * EU Banking Compliance API Routes
 * 
 * Basel III capital/liquidity calculations and EU AI Act compliance
 * for mid-tier EU banks (€5B–€30B assets).
 * All calculations are genuine regulatory formulas.
 */

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { authenticate } from '../middleware/auth.js';
import { logger } from '../utils/logger.js';
import { basel3Engine } from '../services/verticals/eu-banking/Basel3Engine.js';
import { euAIActEngine } from '../services/verticals/eu-banking/EUAIActEngine.js';
import type {
  CET1Components, AT1Components, Tier2Components,
  CreditRiskExposure, MarketRiskPosition, OperationalRiskData,
  LCRComponents, NSFRComponents,
  AISystemDescriptor, BankingAIDomain,
  FundamentalRightAssessment, MitigationMeasure,
} from '../services/verticals/eu-banking/index.js';

const router = Router();
router.use(authenticate);

// =============================================================================
// BASEL III — CAPITAL ADEQUACY
// =============================================================================

router.post('/basel3/capital-adequacy', async (req: Request, res: Response) => {
  try {
    const { cet1Components, at1Components, tier2Components, creditExposures, marketPositions, operationalRiskData, totalExposureMeasure, buffers } = req.body;
    if (!cet1Components || !at1Components || !tier2Components) {
      return res.status(400).json({ error: 'Capital components (cet1, at1, tier2) required' });
    }
    const result = basel3Engine.calculateCapitalAdequacy(
      cet1Components as CET1Components,
      at1Components as AT1Components,
      tier2Components as Tier2Components,
      (creditExposures || []) as CreditRiskExposure[],
      (marketPositions || []) as MarketRiskPosition[],
      (operationalRiskData || { method: 'BIA', grossIncomeHistory: [0, 0, 0] }) as OperationalRiskData,
      totalExposureMeasure || 0,
      buffers || { countercyclicalRate: 0, systemicRiskRate: 0 },
    );
    logger.info('[EU-Banking] Capital adequacy calculated', { cet1Ratio: (result.cet1Ratio * 100).toFixed(2) + '%', breaches: result.breaches.length });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] Capital adequacy calculation failed', error);
    res.status(500).json({ error: 'Capital adequacy calculation failed' });
  }
});

router.post('/basel3/credit-rwa', async (req: Request, res: Response) => {
  try {
    const { exposures } = req.body;
    if (!Array.isArray(exposures)) return res.status(400).json({ error: 'exposures array required' });
    const rwa = basel3Engine.calculateCreditRWA(exposures as CreditRiskExposure[]);
    res.json({ rwa, exposureCount: exposures.length, timestamp: new Date() });
  } catch (error) {
    logger.error('[EU-Banking] Credit RWA calculation failed', error);
    res.status(500).json({ error: 'Credit RWA calculation failed' });
  }
});

router.post('/basel3/lcr', async (req: Request, res: Response) => {
  try {
    const { components } = req.body;
    if (!components) return res.status(400).json({ error: 'LCR components required' });
    const result = basel3Engine.calculateLCR(components as LCRComponents);
    logger.info('[EU-Banking] LCR calculated', { lcr: (result.lcr * 100).toFixed(2) + '%' });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] LCR calculation failed', error);
    res.status(500).json({ error: 'LCR calculation failed' });
  }
});

router.post('/basel3/nsfr', async (req: Request, res: Response) => {
  try {
    const { components } = req.body;
    if (!components) return res.status(400).json({ error: 'NSFR components required' });
    const result = basel3Engine.calculateNSFR(components as NSFRComponents);
    logger.info('[EU-Banking] NSFR calculated', { nsfr: (result.nsfr * 100).toFixed(2) + '%' });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] NSFR calculation failed', error);
    res.status(500).json({ error: 'NSFR calculation failed' });
  }
});

router.post('/basel3/large-exposures', async (req: Request, res: Response) => {
  try {
    const { exposures, tier1Capital, isGSII } = req.body;
    if (!Array.isArray(exposures) || typeof tier1Capital !== 'number') {
      return res.status(400).json({ error: 'exposures array and tier1Capital required' });
    }
    const results = basel3Engine.checkLargeExposures(exposures, tier1Capital, isGSII || false);
    res.json({ results, totalExposures: results.length, breaches: results.filter(r => !r.compliant).length, timestamp: new Date() });
  } catch (error) {
    logger.error('[EU-Banking] Large exposure check failed', error);
    res.status(500).json({ error: 'Large exposure check failed' });
  }
});

router.post('/basel3/stress-test', async (req: Request, res: Response) => {
  try {
    const { baselineResult, scenario } = req.body;
    if (!baselineResult || !scenario) return res.status(400).json({ error: 'baselineResult and scenario required' });
    const result = basel3Engine.runStressTest(baselineResult, scenario);
    logger.info('[EU-Banking] Stress test completed', { scenario: scenario.name, stressedCET1: (result.cet1Ratio * 100).toFixed(2) + '%' });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] Stress test failed', error);
    res.status(500).json({ error: 'Stress test failed' });
  }
});

// =============================================================================
// EU AI ACT — CLASSIFICATION & FRIA
// =============================================================================

router.post('/ai-act/classify', async (req: Request, res: Response) => {
  try {
    const { system } = req.body;
    if (!system || !system.id || !system.domain) return res.status(400).json({ error: 'AI system descriptor with id and domain required' });
    const result = euAIActEngine.classifySystem(system as AISystemDescriptor);
    logger.info('[EU-Banking] AI system classified', { systemId: result.systemId, riskLevel: result.riskLevel });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] AI classification failed', error);
    res.status(500).json({ error: 'AI system classification failed' });
  }
});

router.post('/ai-act/classify-batch', async (req: Request, res: Response) => {
  try {
    const { systems } = req.body;
    if (!Array.isArray(systems)) return res.status(400).json({ error: 'systems array required' });
    const summary = euAIActEngine.generateComplianceSummary(systems as AISystemDescriptor[]);
    logger.info('[EU-Banking] AI inventory classified', { total: summary.totalSystems, highRisk: summary.byRiskLevel.high });
    res.json({ summary });
  } catch (error) {
    logger.error('[EU-Banking] Batch classification failed', error);
    res.status(500).json({ error: 'Batch classification failed' });
  }
});

router.post('/ai-act/fria', async (req: Request, res: Response) => {
  try {
    const { system, assessor, rightsAssessments, mitigationMeasures } = req.body;
    if (!system || !assessor) return res.status(400).json({ error: 'system and assessor required' });
    const result = euAIActEngine.conductFRIA(
      system as AISystemDescriptor, assessor,
      (rightsAssessments || []) as FundamentalRightAssessment[],
      (mitigationMeasures || []) as MitigationMeasure[],
    );
    logger.info('[EU-Banking] FRIA completed', { systemId: result.systemId, recommendation: result.recommendation });
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] FRIA failed', error);
    res.status(500).json({ error: 'FRIA failed' });
  }
});

router.post('/ai-act/fria-template', async (req: Request, res: Response) => {
  try {
    const { system } = req.body;
    if (!system || !system.domain) return res.status(400).json({ error: 'AI system descriptor with domain required' });
    const template = euAIActEngine.generateFRIATemplate(system as AISystemDescriptor);
    res.json({ template });
  } catch (error) {
    logger.error('[EU-Banking] FRIA template generation failed', error);
    res.status(500).json({ error: 'FRIA template generation failed' });
  }
});

router.post('/ai-act/documentation-assessment', async (req: Request, res: Response) => {
  try {
    const { documentation } = req.body;
    if (!documentation) return res.status(400).json({ error: 'documentation object required' });
    const result = euAIActEngine.assessDocumentation(documentation);
    res.json({ result });
  } catch (error) {
    logger.error('[EU-Banking] Documentation assessment failed', error);
    res.status(500).json({ error: 'Documentation assessment failed' });
  }
});

// =============================================================================
// COMBINED DASHBOARD — Demo mid-tier EU bank (€12B assets)
// =============================================================================

router.get('/dashboard', async (_req: Request, res: Response) => {
  try {
    const capitalResult = basel3Engine.calculateCapitalAdequacy(
      {
        paidUpCapital: 800_000_000, sharePremiun: 200_000_000, retainedEarnings: 450_000_000,
        accumulatedOCI: -15_000_000, otherReserves: 50_000_000, minorityInterests: 10_000_000,
        deductions: { goodwill: 120_000_000, otherIntangibles: 45_000_000, deferredTaxAssets: 30_000_000,
          definedBenefitPension: 5_000_000, ownSharesHeld: 0, reciprocalCrossHoldings: 0,
          significantInvestments: 15_000_000, securitisationPositions: 0, insufficientCoverage: 8_000_000 },
      },
      { perpetualInstruments: 150_000_000, sharePremiumAT1: 0, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } },
      { subordinatedDebt: 200_000_000, sharePremiumT2: 0, generalCreditRiskAdjustments: 25_000_000,
        amortisationAdjustment: 10_000_000, deductions: { ownInstrumentsHeld: 0, reciprocalHoldings: 0, significantInvestments: 0 } },
      [
        { id: 'govt', exposureClass: 'central-governments' as const, exposureValue: 2_000_000_000, riskWeight: 0, collateralValue: 0, collateralType: 'none' as const, maturity: 5, defaulted: false, counterpartyName: 'German Sovereign' },
        { id: 'inst', exposureClass: 'institutions' as const, exposureValue: 1_500_000_000, riskWeight: 0.20, collateralValue: 0, collateralType: 'none' as const, maturity: 2, defaulted: false, counterpartyName: 'EU Banks' },
        { id: 'corp', exposureClass: 'corporates' as const, exposureValue: 3_000_000_000, riskWeight: 1.0, collateralValue: 500_000_000, collateralType: 'financial-collateral' as const, maturity: 4, defaulted: false, counterpartyName: 'Corporate Book' },
        { id: 'retail', exposureClass: 'retail' as const, exposureValue: 2_500_000_000, riskWeight: 0.75, collateralValue: 0, collateralType: 'none' as const, maturity: 3, defaulted: false, counterpartyName: 'Retail Portfolio' },
        { id: 'mortgage', exposureClass: 'secured-by-property' as const, exposureValue: 2_200_000_000, riskWeight: 0.35, collateralValue: 3_000_000_000, collateralType: 'immovable-property' as const, maturity: 20, defaulted: false, counterpartyName: 'Mortgage Book' },
        { id: 'pastdue', exposureClass: 'past-due' as const, exposureValue: 180_000_000, riskWeight: 1.5, collateralValue: 0, collateralType: 'none' as const, maturity: 1, defaulted: true, counterpartyName: 'NPE Portfolio' },
      ],
      [
        { id: 'ir', assetClass: 'interest-rate' as const, notionalValue: 5_000_000_000, netPosition: 50_000_000, deltaEquivalent: 50_000_000, specificRiskCharge: 2_000_000, generalRiskCharge: 8_000_000 },
        { id: 'fx', assetClass: 'fx' as const, notionalValue: 1_000_000_000, netPosition: 30_000_000, deltaEquivalent: 30_000_000, specificRiskCharge: 0, generalRiskCharge: 2_400_000 },
      ],
      { method: 'BIA' as const, grossIncomeHistory: [380_000_000, 395_000_000, 410_000_000] as [number, number, number] },
      14_500_000_000,
      { countercyclicalRate: 0.005, systemicRiskRate: 0.01 },
    );

    const lcrResult = basel3Engine.calculateLCR({
      hqla: {
        level1: { cash: 200_000_000, centralBankReserves: 800_000_000, govtBonds: 1_200_000_000 },
        level2a: { govtBonds20: 300_000_000, coveredBonds: 200_000_000, corporateBonds: 150_000_000 },
        level2b: { rmbs: 100_000_000, corporateBonds: 50_000_000, equities: 80_000_000 },
      },
      cashOutflows: {
        retailStableDeposits: 3_000_000_000, retailLessStable: 1_500_000_000,
        unsecuredWholesaleOperational: 800_000_000, unsecuredWholesaleNonOperational: 1_200_000_000,
        securedFundingCentral: 500_000_000, securedFundingGovt: 300_000_000, securedFundingOther: 400_000_000,
        creditFacilitiesDrawdown: 2_000_000_000, liquidityFacilitiesDrawdown: 300_000_000,
        derivativesOutflows: 50_000_000, otherContractualOutflows: 100_000_000,
      },
      cashInflows: { retailInflows: 150_000_000, wholesaleInflows: 200_000_000, securedLendingMaturing: 300_000_000, otherInflows: 50_000_000 },
    });

    const nsfrResult = basel3Engine.calculateNSFR({
      availableStableFunding: {
        regulatoryCapital: capitalResult.totalCapital, stableRetailDeposits: 3_000_000_000,
        lessStableRetailDeposits: 1_500_000_000, wholesaleFundingOver1Y: 2_000_000_000,
        wholesaleFunding6mTo1Y: 800_000_000, operationalDeposits: 500_000_000, otherFundingUnder6m: 1_200_000_000,
      },
      requiredStableFunding: {
        cash: 200_000_000, centralBankReserves: 800_000_000, unencumberedGovtBonds: 1_200_000_000,
        unencumberedCorpBondsAA: 350_000_000, residentialMortgages: 2_200_000_000,
        retailLoansUnder1Y: 800_000_000, corporateLoansUnder1Y: 1_000_000_000,
        corporateLoansOver1Y: 2_000_000_000, equities: 150_000_000, otherAssetsOver1Y: 500_000_000, offBalanceSheet: 2_300_000_000,
      },
    });

    const demoAISystems: AISystemDescriptor[] = [
      { id: 'ai-credit-001', name: 'CreditScore Pro', version: '3.2.1', description: 'XGBoost credit scoring model for retail lending',
        provider: 'internal', providerName: 'Internal ML Team', deploymentDate: new Date('2023-06-15'), lastUpdated: new Date('2025-11-01'),
        purpose: 'Automated credit scoring for retail loan applications', domain: 'credit-scoring' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: false,
        outputType: 'score', modelType: 'XGBoost', trainingDataSize: 2_500_000, trainingDataSources: ['Core Banking', 'Credit Bureau'],
        performanceMetrics: { accuracy: 0.91, auc: 0.87, gini: 0.74 }, monthlyInferences: 45_000, averageLatencyMs: 120,
        humanOversightLevel: 'human-on-the-loop', fallbackProcess: 'Manual underwriting by credit analyst' },
      { id: 'ai-fraud-002', name: 'FraudShield RT', version: '5.0.3', description: 'Real-time transaction fraud detection neural network',
        provider: 'third-party', providerName: 'FraudTech GmbH', deploymentDate: new Date('2024-01-10'), lastUpdated: new Date('2025-09-20'),
        purpose: 'Real-time fraud detection on card and wire transactions', domain: 'fraud-detection' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: true,
        outputType: 'classification', modelType: 'Deep Neural Network', trainingDataSize: 50_000_000, trainingDataSources: ['Transaction DB', 'Fraud Reports'],
        performanceMetrics: { precision: 0.94, recall: 0.88, f1: 0.91 }, monthlyInferences: 12_000_000, averageLatencyMs: 15,
        humanOversightLevel: 'human-over-the-loop', fallbackProcess: 'Transaction queued for manual review' },
      { id: 'ai-aml-003', name: 'AML Sentinel', version: '2.1.0', description: 'AML/KYC screening and suspicious activity detection',
        provider: 'third-party', providerName: 'RegTech Solutions', deploymentDate: new Date('2023-11-01'), lastUpdated: new Date('2025-07-15'),
        purpose: 'Screening transactions and customers against sanctions lists and suspicious patterns', domain: 'aml-screening' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: false,
        outputType: 'classification', modelType: 'Ensemble (RF + Rules)', trainingDataSize: 5_000_000, trainingDataSources: ['Transaction DB', 'Sanctions Lists', 'PEP Lists'],
        performanceMetrics: { precision: 0.82, recall: 0.95, f1: 0.88 }, monthlyInferences: 2_000_000, averageLatencyMs: 250,
        humanOversightLevel: 'human-in-the-loop', fallbackProcess: 'All alerts escalated to compliance officer' },
      { id: 'ai-chatbot-004', name: 'BankAssist', version: '1.5.0', description: 'Customer service chatbot powered by LLM',
        provider: 'third-party', providerName: 'ConvoAI Ltd', deploymentDate: new Date('2025-03-01'), lastUpdated: new Date('2025-12-01'),
        purpose: 'Automated customer service for account inquiries and FAQ', domain: 'customer-service-chatbot' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: false,
        outputType: 'generation', modelType: 'LLM (GPT-4 class)', trainingDataSize: 0, trainingDataSources: ['Knowledge Base'],
        performanceMetrics: { csat: 0.78, containmentRate: 0.65 }, monthlyInferences: 150_000, averageLatencyMs: 800,
        humanOversightLevel: 'human-on-the-loop', fallbackProcess: 'Escalation to human agent' },
      { id: 'ai-collections-005', name: 'CollectIQ', version: '1.2.0', description: 'Collections prioritisation and strategy optimisation',
        provider: 'internal', providerName: 'Internal Analytics', deploymentDate: new Date('2024-09-01'), lastUpdated: new Date('2025-10-15'),
        purpose: 'Prioritise collections cases and recommend contact strategy', domain: 'collections' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: false,
        outputType: 'recommendation', modelType: 'Gradient Boosting', trainingDataSize: 500_000, trainingDataSources: ['Loan Book', 'Collections History'],
        performanceMetrics: { accuracy: 0.84, recoveryRateImprovement: 0.12 }, monthlyInferences: 25_000, averageLatencyMs: 200,
        humanOversightLevel: 'human-in-the-loop', fallbackProcess: 'Standard collections workflow' },
      { id: 'ai-hr-006', name: 'TalentMatch', version: '2.0.0', description: 'CV screening and candidate ranking for recruitment',
        provider: 'third-party', providerName: 'HireAI Inc', deploymentDate: new Date('2025-01-15'), lastUpdated: new Date('2025-08-01'),
        purpose: 'Automated screening and ranking of job applicants', domain: 'hr-recruitment' as BankingAIDomain,
        usesPersonalData: true, usesSpecialCategoryData: false, affectsNaturalPersons: true, isAutonomous: false,
        outputType: 'score', modelType: 'NLP + Logistic Regression', trainingDataSize: 200_000, trainingDataSources: ['Historical Applications', 'Performance Data'],
        performanceMetrics: { accuracy: 0.79 }, monthlyInferences: 2_000, averageLatencyMs: 500,
        humanOversightLevel: 'human-in-the-loop', fallbackProcess: 'Manual CV review by HR' },
    ];

    const aiActSummary = euAIActEngine.generateComplianceSummary(demoAISystems);

    // Stress test: EBA adverse scenario
    const adverseStress = basel3Engine.runStressTest(capitalResult, {
      name: 'EBA Adverse 2026', gdpShock: -0.031, creditLossRate: 0.025, marketLossPct: 0.18, rwaInflation: 0.12,
    });

    res.json({
      bank: { name: 'Demo Mid-Tier EU Bank', totalAssets: 12_000_000_000, jurisdiction: 'EU/EEA', complianceStaff: 150 },
      basel3: {
        capital: capitalResult,
        liquidity: { lcr: lcrResult, nsfr: nsfrResult },
        stressTest: { adverse: adverseStress },
      },
      aiAct: aiActSummary,
      regulatoryDeadlines: [
        { regulation: 'EU AI Act — Prohibited practices', date: '2025-02-02', status: 'in-force' },
        { regulation: 'EU AI Act — GPAI obligations', date: '2025-08-02', status: 'in-force' },
        { regulation: 'EU AI Act — High-risk obligations', date: '2026-08-02', status: 'upcoming' },
        { regulation: 'Basel III — Final reforms (CRR3)', date: '2025-01-01', status: 'in-force' },
        { regulation: 'DORA — Digital Operational Resilience', date: '2025-01-17', status: 'in-force' },
      ],
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('[EU-Banking] Dashboard generation failed', error);
    res.status(500).json({ error: 'Dashboard generation failed' });
  }
});

export default router;
