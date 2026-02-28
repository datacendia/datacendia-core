// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GENOMICS™ - HEALTHCARE & LIFE SCIENCES PACK
// AI-Powered Healthcare Decision Intelligence
// "The Highest AI-Paying Sector Meets Enterprise Decision Intelligence"
//
// CAPABILITIES:
// - Patient flow processing & optimization
// - Adverse outcome prediction
// - FDA submission automation
// - Clinical pathway optimization
// - Drug R&D simulation
// - Genetic risk modeling
// - Clinical trials scenario planning
// - HIPAA-compliant data handling
// =============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ClinicalDomain =
  | 'cardiology'
  | 'oncology'
  | 'neurology'
  | 'immunology'
  | 'endocrinology'
  | 'genomics'
  | 'pharmacology';
type RiskLevel = 'critical' | 'high' | 'moderate' | 'low' | 'minimal';
type TrialPhase = 'preclinical' | 'phase1' | 'phase2' | 'phase3' | 'phase4' | 'approved';
type RegulatoryBody = 'fda' | 'ema' | 'pmda' | 'nmpa' | 'hc';

interface PatientCohort {
  id: string;
  name: string;
  size: number;
  avgAge: number;
  riskProfile: RiskLevel;
  primaryCondition: string;
  comorbidities: string[];
  avgLOS: number; // Length of stay
  readmissionRate: number;
  predictedOutcome: number;
}

interface ClinicalPathway {
  id: string;
  name: string;
  domain: ClinicalDomain;
  stages: {
    name: string;
    avgDuration: number;
    successRate: number;
    cost: number;
  }[];
  totalPatients: number;
  avgOutcomeScore: number;
  complianceRate: number;
  lastOptimized: Date;
}

interface AdverseEventPrediction {
  id: string;
  patientId: string;
  eventType: string;
  probability: number;
  timeframe: string;
  riskFactors: string[];
  recommendedActions: string[];
  confidence: number;
  modelVersion: string;
}

interface DrugCandidate {
  id: string;
  name: string;
  targetIndication: string;
  mechanism: string;
  phase: TrialPhase;
  efficacyScore: number;
  safetyScore: number;
  marketPotential: number;
  developmentCost: number;
  timeToMarket: number;
  competitorCount: number;
  patentExpiry: Date;
}

interface ClinicalTrial {
  id: string;
  name: string;
  drug: string;
  phase: TrialPhase;
  indication: string;
  enrollmentTarget: number;
  enrollmentActual: number;
  sites: number;
  countries: string[];
  primaryEndpoint: string;
  status: 'recruiting' | 'active' | 'completed' | 'suspended' | 'terminated';
  estimatedCompletion: Date;
  budget: number;
  spent: number;
}

interface FDASubmission {
  id: string;
  type: 'NDA' | 'BLA' | 'ANDA' | '510k' | 'PMA' | 'IND';
  productName: string;
  status: 'preparation' | 'submitted' | 'under-review' | 'approved' | 'crl' | 'withdrawn';
  submissionDate?: Date;
  pdufa?: Date;
  completeness: number;
  sections: {
    name: string;
    status: 'complete' | 'in-progress' | 'not-started' | 'needs-revision';
    lastUpdated: Date;
  }[];
  reviewerQuestions: number;
  openIssues: number;
}

interface GeneticRiskModel {
  id: string;
  name: string;
  condition: string;
  genes: string[];
  populationRisk: number;
  modelAccuracy: number;
  sampleSize: number;
  lastValidated: Date;
  publications: number;
}

interface HealthcareMetrics {
  totalPatients: number;
  avgOutcomeScore: number;
  readmissionRate: number;
  adverseEventRate: number;
  avgLOS: number;
  patientSatisfaction: number;
  clinicalTrialsActive: number;
  fdaSubmissionsPending: number;
  drugCandidatesPipeline: number;
  researchSpend: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const DOMAIN_CONFIG: Record<ClinicalDomain, { icon: string; color: string; name: string }> = {
  cardiology: { icon: '❤️', color: 'from-red-600 to-rose-600', name: 'Cardiology' },
  oncology: { icon: '🎗️', color: 'from-purple-600 to-pink-600', name: 'Oncology' },
  neurology: { icon: '🧠', color: 'from-blue-600 to-indigo-600', name: 'Neurology' },
  immunology: { icon: '🛡️', color: 'from-green-600 to-emerald-600', name: 'Immunology' },
  endocrinology: { icon: '⚗️', color: 'from-amber-600 to-orange-600', name: 'Endocrinology' },
  genomics: { icon: '🧬', color: 'from-cyan-600 to-blue-600', name: 'Genomics' },
  pharmacology: { icon: '💊', color: 'from-teal-600 to-cyan-600', name: 'Pharmacology' },
};

const generatePatientCohorts = (): PatientCohort[] => [
  {
    id: 'cohort-001',
    name: 'High-Risk Cardiac',
    size: 2847,
    avgAge: 68.5,
    riskProfile: 'high',
    primaryCondition: 'Heart Failure',
    comorbidities: ['Diabetes', 'Hypertension', 'CKD'],
    avgLOS: 5.2,
    readmissionRate: 18.5,
    predictedOutcome: 72,
  },
  {
    id: 'cohort-002',
    name: 'Oncology - Breast Cancer',
    size: 1923,
    avgAge: 55.2,
    riskProfile: 'moderate',
    primaryCondition: 'Breast Cancer Stage II-III',
    comorbidities: ['Anxiety', 'Osteoporosis'],
    avgLOS: 3.8,
    readmissionRate: 8.2,
    predictedOutcome: 85,
  },
  {
    id: 'cohort-003',
    name: 'Neurodegenerative',
    size: 892,
    avgAge: 72.1,
    riskProfile: 'critical',
    primaryCondition: "Alzheimer's Disease",
    comorbidities: ['Depression', 'Falls Risk', 'Malnutrition'],
    avgLOS: 12.4,
    readmissionRate: 32.1,
    predictedOutcome: 45,
  },
  {
    id: 'cohort-004',
    name: 'Diabetes Management',
    size: 5623,
    avgAge: 52.8,
    riskProfile: 'moderate',
    primaryCondition: 'Type 2 Diabetes',
    comorbidities: ['Obesity', 'Hypertension', 'Dyslipidemia'],
    avgLOS: 2.1,
    readmissionRate: 12.3,
    predictedOutcome: 78,
  },
];

const generateClinicalTrials = (): ClinicalTrial[] => [
  {
    id: 'trial-001',
    name: 'CARDIAC-REGEN Phase III',
    drug: 'CDX-4521',
    phase: 'phase3',
    indication: 'Chronic Heart Failure',
    enrollmentTarget: 3200,
    enrollmentActual: 2847,
    sites: 145,
    countries: ['USA', 'Germany', 'UK', 'Japan', 'Canada'],
    primaryEndpoint: 'Reduction in cardiovascular death or HF hospitalization',
    status: 'active',
    estimatedCompletion: new Date('2025-12-31'),
    budget: 285000000,
    spent: 198000000,
  },
  {
    id: 'trial-002',
    name: 'NEURO-PROTECT Phase II',
    drug: 'CDX-7892',
    phase: 'phase2',
    indication: "Alzheimer's Disease",
    enrollmentTarget: 800,
    enrollmentActual: 623,
    sites: 48,
    countries: ['USA', 'Netherlands', 'Australia'],
    primaryEndpoint: 'Change in ADAS-Cog score at 18 months',
    status: 'recruiting',
    estimatedCompletion: new Date('2026-06-30'),
    budget: 156000000,
    spent: 67000000,
  },
  {
    id: 'trial-003',
    name: 'ONCO-TARGET Phase I',
    drug: 'CDX-1234',
    phase: 'phase1',
    indication: 'Non-Small Cell Lung Cancer',
    enrollmentTarget: 120,
    enrollmentActual: 89,
    sites: 12,
    countries: ['USA'],
    primaryEndpoint: 'Maximum tolerated dose, safety profile',
    status: 'active',
    estimatedCompletion: new Date('2025-03-31'),
    budget: 42000000,
    spent: 28000000,
  },
];

const generateDrugCandidates = (): DrugCandidate[] => [
  {
    id: 'drug-001',
    name: 'CDX-4521',
    targetIndication: 'Chronic Heart Failure',
    mechanism: 'Myocardial regeneration via stem cell activation',
    phase: 'phase3',
    efficacyScore: 78,
    safetyScore: 85,
    marketPotential: 4500000000,
    developmentCost: 890000000,
    timeToMarket: 2.5,
    competitorCount: 3,
    patentExpiry: new Date('2038-06-15'),
  },
  {
    id: 'drug-002',
    name: 'CDX-7892',
    targetIndication: "Alzheimer's Disease",
    mechanism: 'Tau protein aggregation inhibitor',
    phase: 'phase2',
    efficacyScore: 65,
    safetyScore: 92,
    marketPotential: 12000000000,
    developmentCost: 1200000000,
    timeToMarket: 5.5,
    competitorCount: 8,
    patentExpiry: new Date('2041-03-22'),
  },
  {
    id: 'drug-003',
    name: 'CDX-1234',
    targetIndication: 'Non-Small Cell Lung Cancer',
    mechanism: 'Bispecific T-cell engager',
    phase: 'phase1',
    efficacyScore: 72,
    safetyScore: 68,
    marketPotential: 8500000000,
    developmentCost: 950000000,
    timeToMarket: 6.0,
    competitorCount: 12,
    patentExpiry: new Date('2042-09-08'),
  },
];

const generateFDASubmissions = (): FDASubmission[] => [
  {
    id: 'fda-001',
    type: 'NDA',
    productName: 'CDX-4521 (Cardiogenix)',
    status: 'preparation',
    completeness: 78,
    sections: [
      { name: 'Module 1: Administrative', status: 'complete', lastUpdated: new Date() },
      { name: 'Module 2: Summaries', status: 'in-progress', lastUpdated: new Date() },
      { name: 'Module 3: Quality', status: 'complete', lastUpdated: new Date() },
      { name: 'Module 4: Nonclinical', status: 'complete', lastUpdated: new Date() },
      { name: 'Module 5: Clinical', status: 'in-progress', lastUpdated: new Date() },
    ],
    reviewerQuestions: 0,
    openIssues: 12,
  },
  {
    id: 'fda-002',
    type: '510k',
    productName: 'CardioMonitor AI v3.0',
    status: 'under-review',
    submissionDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    completeness: 100,
    sections: [
      { name: 'Device Description', status: 'complete', lastUpdated: new Date() },
      { name: 'Substantial Equivalence', status: 'complete', lastUpdated: new Date() },
      { name: 'Performance Testing', status: 'complete', lastUpdated: new Date() },
      { name: 'Software Documentation', status: 'complete', lastUpdated: new Date() },
    ],
    reviewerQuestions: 3,
    openIssues: 1,
  },
];

const generateAdverseEventPredictions = (): AdverseEventPrediction[] => [
  {
    id: 'ae-001',
    patientId: 'PT-28471',
    eventType: 'Cardiac Arrest',
    probability: 0.23,
    timeframe: '72 hours',
    riskFactors: ['Elevated troponin', 'Arrhythmia history', 'Low EF'],
    recommendedActions: ['ICU transfer', 'Continuous monitoring', 'Cardiology consult'],
    confidence: 0.89,
    modelVersion: 'CardioPredict v4.2',
  },
  {
    id: 'ae-002',
    patientId: 'PT-19283',
    eventType: 'Sepsis',
    probability: 0.18,
    timeframe: '48 hours',
    riskFactors: ['Post-surgical', 'Elevated WBC', 'Fever trend'],
    recommendedActions: ['Blood cultures', 'Broad-spectrum antibiotics', 'Fluid resuscitation'],
    confidence: 0.92,
    modelVersion: 'SepsisAlert v2.8',
  },
  {
    id: 'ae-003',
    patientId: 'PT-34521',
    eventType: 'Fall',
    probability: 0.45,
    timeframe: '24 hours',
    riskFactors: ['Age >75', 'Sedative medication', 'Cognitive impairment', 'History of falls'],
    recommendedActions: ['Bed alarm', 'Fall precautions', 'PT evaluation', 'Medication review'],
    confidence: 0.85,
    modelVersion: 'FallRisk v3.1',
  },
];

const generateGeneticModels = (): GeneticRiskModel[] => [
  {
    id: 'gen-001',
    name: 'BRCA Comprehensive',
    condition: 'Breast/Ovarian Cancer',
    genes: ['BRCA1', 'BRCA2', 'PALB2', 'CHEK2', 'ATM'],
    populationRisk: 12.5,
    modelAccuracy: 94.2,
    sampleSize: 287000,
    lastValidated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    publications: 847,
  },
  {
    id: 'gen-002',
    name: 'Cardiovascular PRS',
    condition: 'Coronary Artery Disease',
    genes: ['PCSK9', 'LDLR', 'APOB', 'LPA', '9p21'],
    populationRisk: 8.2,
    modelAccuracy: 87.5,
    sampleSize: 1200000,
    lastValidated: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    publications: 1234,
  },
  {
    id: 'gen-003',
    name: "Alzheimer's Risk Panel",
    condition: "Alzheimer's Disease",
    genes: ['APOE', 'TREM2', 'CLU', 'PICALM', 'CR1'],
    populationRisk: 10.7,
    modelAccuracy: 82.1,
    sampleSize: 456000,
    lastValidated: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    publications: 2341,
  },
];

const calculateMetrics = (): HealthcareMetrics => ({
  totalPatients: 11285,
  avgOutcomeScore: 76.5,
  readmissionRate: 14.2,
  adverseEventRate: 3.8,
  avgLOS: 4.8,
  patientSatisfaction: 87.3,
  clinicalTrialsActive: 12,
  fdaSubmissionsPending: 3,
  drugCandidatesPipeline: 8,
  researchSpend: 890000000,
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GenomicsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'patients' | 'trials' | 'pipeline' | 'regulatory' | 'genomics'
  >('overview');
  const [patientCohorts] = useState<PatientCohort[]>(generatePatientCohorts);
  const [clinicalTrials] = useState<ClinicalTrial[]>(generateClinicalTrials);
  const [drugCandidates] = useState<DrugCandidate[]>(generateDrugCandidates);
  const [fdaSubmissions] = useState<FDASubmission[]>(generateFDASubmissions);
  const [adverseEvents] = useState<AdverseEventPrediction[]>(generateAdverseEventPredictions);
  const [geneticModels] = useState<GeneticRiskModel[]>(generateGeneticModels);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from API
  useEffect(() => {
    const fetchGenomicsData = async () => {
      try {
        const [regulatoryRes, preMortemRes] = await Promise.all([
          decisionIntelApi.getRegulatoryItems(),
          decisionIntelApi.getPreMortemAnalyses(),
        ]);

        if (regulatoryRes.success && regulatoryRes.data) {
          console.log('[Genomics] Loaded', regulatoryRes.data.length, 'regulatory items');
        }
        if (preMortemRes.success && preMortemRes.data) {
          console.log('[Genomics] Loaded', preMortemRes.data.length, 'risk analyses');
        }
      } catch (error) {
        console.log('[Genomics] Using local generators (API unavailable)');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenomicsData();
  }, []);

  const metrics = useMemo(() => calculateMetrics(), []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-teal-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/cortex/dashboard')}
                className="text-white/60 hover:text-white transition-colors"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🧬</span>
                  CendiaGenomics™
                  <span className="text-xs bg-gradient-to-r from-teal-500 to-cyan-500 px-2 py-0.5 rounded-full font-medium">
                    HEALTHCARE
                  </span>
                </h1>
                <p className="text-teal-300 text-sm">
                  Healthcare & Life Sciences Pack • HIPAA Compliant
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg">
                <span className="text-green-400 text-sm font-medium">🔒 HIPAA Compliant</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-white/60">Pipeline Value</div>
                <div className="text-xl font-bold text-teal-400">
                  ${(drugCandidates.reduce((s, d) => s + d.marketPotential, 0) / 1e9).toFixed(1)}B
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 border-b border-teal-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">
                {metrics.totalPatients.toLocaleString()}
              </div>
              <div className="text-xs text-teal-300">Total Patients</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.avgOutcomeScore}%</div>
              <div className="text-xs text-teal-300">Outcome Score</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.readmissionRate}%</div>
              <div className="text-xs text-teal-300">Readmission</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.adverseEventRate}%</div>
              <div className="text-xs text-teal-300">Adverse Events</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.clinicalTrialsActive}</div>
              <div className="text-xs text-teal-300">Active Trials</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">
                {metrics.drugCandidatesPipeline}
              </div>
              <div className="text-xs text-teal-300">Pipeline Drugs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {metrics.fdaSubmissionsPending}
              </div>
              <div className="text-xs text-teal-300">FDA Pending</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">
                ${(metrics.researchSpend / 1e6).toFixed(0)}M
              </div>
              <div className="text-xs text-teal-300">R&D Spend</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-teal-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'patients', label: 'Patient Intelligence', icon: '👥' },
              { id: 'trials', label: 'Clinical Trials', icon: '🔬' },
              { id: 'pipeline', label: 'Drug Pipeline', icon: '💊' },
              { id: 'regulatory', label: 'FDA Submissions', icon: '📋' },
              { id: 'genomics', label: 'Genetic Models', icon: '🧬' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-teal-400 text-white bg-teal-900/20'
                    : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Adverse Event Alerts */}
            <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <span className="text-red-400">🚨</span> AI-Predicted Adverse Events
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {adverseEvents.map((ae) => (
                  <div
                    key={ae.id}
                    className={`p-4 rounded-xl border ${
                      ae.probability > 0.3
                        ? 'bg-red-900/20 border-red-700/50'
                        : ae.probability > 0.15
                          ? 'bg-amber-900/20 border-amber-700/50'
                          : 'bg-yellow-900/20 border-yellow-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-sm text-white/60">{ae.patientId}</span>
                      <span
                        className={`text-xl font-bold ${
                          ae.probability > 0.3
                            ? 'text-red-400'
                            : ae.probability > 0.15
                              ? 'text-amber-400'
                              : 'text-yellow-400'
                        }`}
                      >
                        {(ae.probability * 100).toFixed(0)}%
                      </span>
                    </div>
                    <h4 className="font-semibold mb-1">{ae.eventType}</h4>
                    <div className="text-xs text-white/50 mb-2">Within {ae.timeframe}</div>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {ae.riskFactors.slice(0, 2).map((rf) => (
                        <span key={rf} className="text-xs px-2 py-0.5 bg-black/30 rounded">
                          {rf}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-white/40">
                      Model: {ae.modelVersion} • {(ae.confidence * 100).toFixed(0)}% conf.
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Clinical Domains */}
            <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
              <h2 className="text-lg font-semibold mb-4">Clinical Domains</h2>
              <div className="grid grid-cols-7 gap-4">
                {(
                  Object.entries(DOMAIN_CONFIG) as [
                    ClinicalDomain,
                    (typeof DOMAIN_CONFIG)[ClinicalDomain],
                  ][]
                ).map(([key, config]) => (
                  <div
                    key={key}
                    className="text-center p-4 bg-black/20 rounded-xl hover:bg-black/30 transition-colors cursor-pointer"
                  >
                    <div
                      className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl mb-2`}
                    >
                      {config.icon}
                    </div>
                    <div className="font-medium text-sm">{config.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-6">
              {/* Active Trials */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">Active Clinical Trials</h3>
                <div className="space-y-3">
                  {clinicalTrials.slice(0, 3).map((trial) => (
                    <div key={trial.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{trial.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            trial.phase === 'phase3'
                              ? 'bg-green-600'
                              : trial.phase === 'phase2'
                                ? 'bg-blue-600'
                                : 'bg-purple-600'
                          }`}
                        >
                          {trial.phase.toUpperCase()}
                        </span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{trial.indication}</div>
                      <div className="flex justify-between text-xs">
                        <span>
                          Enrollment: {trial.enrollmentActual}/{trial.enrollmentTarget}
                        </span>
                        <span>
                          {trial.sites} sites • {trial.countries.length} countries
                        </span>
                      </div>
                      <div className="mt-2 h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-teal-500"
                          style={{
                            width: `${(trial.enrollmentActual / trial.enrollmentTarget) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FDA Submissions */}
              <div className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <h3 className="text-lg font-semibold mb-4">FDA Submissions</h3>
                <div className="space-y-3">
                  {fdaSubmissions.map((sub) => (
                    <div key={sub.id} className="p-4 bg-black/20 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className="font-semibold">{sub.productName}</span>
                          <span className="ml-2 text-xs px-2 py-0.5 bg-teal-900 rounded">
                            {sub.type}
                          </span>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            sub.status === 'approved'
                              ? 'bg-green-600'
                              : sub.status === 'under-review'
                                ? 'bg-blue-600'
                                : sub.status === 'preparation'
                                  ? 'bg-amber-600'
                                  : 'bg-neutral-600'
                          }`}
                        >
                          {sub.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-white/60 mb-2">
                        <span>Completeness: {sub.completeness}%</span>
                        <span>{sub.openIssues} open issues</span>
                      </div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                          style={{ width: `${sub.completeness}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'patients' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-teal-900/30 to-cyan-900/30 rounded-2xl p-6 border border-teal-700/50">
              <h2 className="text-lg font-semibold mb-2">🏥 Patient Intelligence Platform</h2>
              <p className="text-white/60">
                AI-powered patient flow optimization, outcome prediction, and risk stratification.
                All data is HIPAA-compliant and de-identified for analytics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {patientCohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className="bg-black/30 rounded-2xl p-6 border border-teal-800/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">{cohort.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        cohort.riskProfile === 'critical'
                          ? 'bg-red-600'
                          : cohort.riskProfile === 'high'
                            ? 'bg-amber-600'
                            : cohort.riskProfile === 'moderate'
                              ? 'bg-yellow-600'
                              : 'bg-green-600'
                      }`}
                    >
                      {cohort.riskProfile} risk
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="text-sm text-white/60">{cohort.primaryCondition}</div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {cohort.comorbidities.map((c) => (
                        <span key={c} className="text-xs px-2 py-0.5 bg-teal-900/50 rounded">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">
                        {cohort.size.toLocaleString()}
                      </div>
                      <div className="text-xs text-white/50">Patients</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{cohort.avgAge}</div>
                      <div className="text-xs text-white/50">Avg Age</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-amber-400">{cohort.avgLOS}</div>
                      <div className="text-xs text-white/50">Avg LOS (days)</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div
                        className={`text-xl font-bold ${cohort.predictedOutcome >= 70 ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {cohort.predictedOutcome}%
                      </div>
                      <div className="text-xs text-white/50">Predicted Outcome</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'genomics' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">🧬 Genetic Risk Models</h2>
              <p className="text-white/60">
                Population-scale genetic risk prediction models for major disease categories.
                Validated against large cohorts with peer-reviewed accuracy.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {geneticModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-black/30 rounded-2xl p-6 border border-teal-800/50"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-2xl">
                      🧬
                    </div>
                    <div>
                      <h3 className="font-semibold">{model.name}</h3>
                      <div className="text-sm text-white/50">{model.condition}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-white/60">Model Accuracy</span>
                      <span className="font-bold text-green-400">{model.modelAccuracy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Population Risk</span>
                      <span className="font-bold">{model.populationRisk}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Sample Size</span>
                      <span className="font-bold">{(model.sampleSize / 1000).toFixed(0)}K</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Publications</span>
                      <span className="font-bold text-cyan-400">{model.publications}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-white/50 mb-2">Target Genes</div>
                    <div className="flex flex-wrap gap-1">
                      {model.genes.map((gene) => (
                        <span
                          key={gene}
                          className="text-xs px-2 py-1 bg-purple-900/50 rounded font-mono"
                        >
                          {gene}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'trials' && (
          <div className="space-y-4">
            {clinicalTrials.map((trial) => (
              <div key={trial.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{trial.name}</h3>
                    <div className="text-sm text-white/50">
                      {trial.drug} • {trial.indication}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-lg text-sm ${
                        trial.status === 'active'
                          ? 'bg-green-600'
                          : trial.status === 'recruiting'
                            ? 'bg-blue-600'
                            : trial.status === 'completed'
                              ? 'bg-purple-600'
                              : 'bg-neutral-600'
                      }`}
                    >
                      {trial.status}
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm bg-teal-900`}>
                      {trial.phase.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">
                      {trial.enrollmentActual}/{trial.enrollmentTarget}
                    </div>
                    <div className="text-xs text-white/50">Enrollment</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.sites}</div>
                    <div className="text-xs text-white/50">Sites</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{trial.countries.length}</div>
                    <div className="text-xs text-white/50">Countries</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">
                      ${(trial.spent / 1e6).toFixed(0)}M
                    </div>
                    <div className="text-xs text-white/50">Spent</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">${(trial.budget / 1e6).toFixed(0)}M</div>
                    <div className="text-xs text-white/50">Budget</div>
                  </div>
                </div>

                <div className="p-3 bg-black/20 rounded-xl">
                  <div className="text-xs text-white/50 mb-1">Primary Endpoint</div>
                  <div className="text-sm">{trial.primaryEndpoint}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            {drugCandidates.map((drug) => (
              <div key={drug.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold">{drug.name}</h3>
                    <div className="text-sm text-white/50">{drug.targetIndication}</div>
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      drug.phase === 'phase3'
                        ? 'bg-green-600'
                        : drug.phase === 'phase2'
                          ? 'bg-blue-600'
                          : drug.phase === 'phase1'
                            ? 'bg-purple-600'
                            : 'bg-neutral-600'
                    }`}
                  >
                    {drug.phase.toUpperCase()}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-white/50 mb-1">Mechanism of Action</div>
                  <div className="text-sm">{drug.mechanism}</div>
                </div>

                <div className="grid grid-cols-6 gap-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-green-400">{drug.efficacyScore}%</div>
                    <div className="text-xs text-white/50">Efficacy</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-cyan-400">{drug.safetyScore}%</div>
                    <div className="text-xs text-white/50">Safety</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-purple-400">
                      ${(drug.marketPotential / 1e9).toFixed(1)}B
                    </div>
                    <div className="text-xs text-white/50">Market Potential</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">
                      ${(drug.developmentCost / 1e6).toFixed(0)}M
                    </div>
                    <div className="text-xs text-white/50">Dev Cost</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold text-amber-400">{drug.timeToMarket}y</div>
                    <div className="text-xs text-white/50">Time to Market</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-xl font-bold">{drug.competitorCount}</div>
                    <div className="text-xs text-white/50">Competitors</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'regulatory' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-2xl p-6 border border-blue-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 FDA Submission Automation</h2>
              <p className="text-white/60">
                AI-assisted regulatory submission preparation with automated document generation,
                completeness checking, and reviewer question prediction.
              </p>
            </div>

            {fdaSubmissions.map((sub) => (
              <div key={sub.id} className="bg-black/30 rounded-2xl p-6 border border-teal-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{sub.productName}</h3>
                      <span className="px-2 py-0.5 bg-blue-900 rounded text-sm">{sub.type}</span>
                    </div>
                    {sub.submissionDate && (
                      <div className="text-sm text-white/50">
                        Submitted: {sub.submissionDate.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <span
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      sub.status === 'approved'
                        ? 'bg-green-600'
                        : sub.status === 'under-review'
                          ? 'bg-blue-600'
                          : sub.status === 'preparation'
                            ? 'bg-amber-600'
                            : 'bg-neutral-600'
                    }`}
                  >
                    {sub.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Sections
                    </h4>
                    <div className="space-y-2">
                      {sub.sections.map((section) => (
                        <div
                          key={section.name}
                          className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                        >
                          <span className="text-sm">{section.name}</span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              section.status === 'complete'
                                ? 'bg-green-900 text-green-300'
                                : section.status === 'in-progress'
                                  ? 'bg-amber-900 text-amber-300'
                                  : section.status === 'needs-revision'
                                    ? 'bg-red-900 text-red-300'
                                    : 'bg-neutral-800 text-neutral-300'
                            }`}
                          >
                            {section.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">
                      Status
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Completeness</span>
                          <span className="font-bold">{sub.completeness}%</span>
                        </div>
                        <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-teal-500 to-cyan-500"
                            style={{ width: `${sub.completeness}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-amber-400">
                            {sub.reviewerQuestions}
                          </div>
                          <div className="text-xs text-white/50">Reviewer Questions</div>
                        </div>
                        <div className="p-3 bg-black/20 rounded-xl text-center">
                          <div className="text-xl font-bold text-red-400">{sub.openIssues}</div>
                          <div className="text-xs text-white/50">Open Issues</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GenomicsPage;
