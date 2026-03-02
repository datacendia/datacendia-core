/**
 * Healthcare Vertical Tests
 * Comprehensive test suite for expanded Healthcare vertical
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  HealthcareVerticalImplementation,
  HealthcareDataConnector,
  HealthcareKnowledgeBase,
  HealthcareComplianceMapper,
  DiagnosisSupportSchema,
  TriageRecommendationSchema,
  DischargeAssessmentSchema,
  MedicationRecommendationSchema,
  ClinicalTriageAgentPreset,
  HealthcareDefensibleOutput,
  ConsentOverrideLedger,
  SaMDBoundaryEnforcer,
} from '../../../backend/src/services/verticals/healthcare/HealthcareVertical.js';
import {
  SurgeryAuthorizationSchema,
  ImagingOrderSchema,
  LabOrderSchema,
  SpecialistReferralSchema,
  ReadmissionRiskSchema,
  ClinicalTrialEnrollmentSchema,
  EndOfLifeCareSchema,
  BehavioralHealthAssessmentSchema,
} from '../../../backend/src/services/verticals/healthcare/HealthcareDecisionSchemasExpanded.js';

describe('Healthcare Vertical - Expanded', () => {
  let vertical: HealthcareVerticalImplementation;

  beforeEach(() => {
    vertical = new HealthcareVerticalImplementation();
  });

  it('should have 100% completion', () => {
    expect(vertical.completionPercentage).toBe(100);
  });

  it('should have 12 decision schemas', () => {
    expect(vertical.decisionSchemas.size).toBe(12);
    expect(vertical.decisionSchemas.has('diagnosis-support')).toBe(true);
    expect(vertical.decisionSchemas.has('triage')).toBe(true);
    expect(vertical.decisionSchemas.has('discharge')).toBe(true);
    expect(vertical.decisionSchemas.has('medication')).toBe(true);
    expect(vertical.decisionSchemas.has('surgery-authorization')).toBe(true);
    expect(vertical.decisionSchemas.has('imaging-order')).toBe(true);
    expect(vertical.decisionSchemas.has('lab-order')).toBe(true);
    expect(vertical.decisionSchemas.has('specialist-referral')).toBe(true);
    expect(vertical.decisionSchemas.has('readmission-risk')).toBe(true);
    expect(vertical.decisionSchemas.has('clinical-trial-enrollment')).toBe(true);
    expect(vertical.decisionSchemas.has('end-of-life-care')).toBe(true);
    expect(vertical.decisionSchemas.has('behavioral-health-assessment')).toBe(true);
  });

  it('should have 12 compliance frameworks', () => {
    expect(vertical.complianceMapper.supportedFrameworks).toHaveLength(12);
    const ids = vertical.complianceMapper.supportedFrameworks.map(f => f.id);
    expect(ids).toContain('hipaa');
    expect(ids).toContain('fda-samd');
    expect(ids).toContain('hitrust');
    expect(ids).toContain('jcaho');
    expect(ids).toContain('cms-cop');
    expect(ids).toContain('emtala');
    expect(ids).toContain('stark-law');
    expect(ids).toContain('anti-kickback');
    expect(ids).toContain('clia');
    expect(ids).toContain('oig-compliance');
    expect(ids).toContain('meaningful-use');
    expect(ids).toContain('ncqa');
  });

  it('should have all 6 layers', () => {
    const status = vertical.getStatus();
    expect(status.layers.dataConnector).toBe(true);
    expect(status.layers.knowledgeBase).toBe(true);
    expect(status.layers.complianceMapper).toBe(true);
    expect(status.layers.decisionSchemas).toBe(true);
    expect(status.layers.agentPresets).toBe(true);
    expect(status.layers.defensibleOutput).toBe(true);
  });
});

describe('Healthcare Compliance Mapper - Expanded', () => {
  let mapper: HealthcareComplianceMapper;

  beforeEach(() => {
    mapper = new HealthcareComplianceMapper();
  });

  it('should support 12 compliance frameworks', () => {
    expect(mapper.supportedFrameworks).toHaveLength(12);
  });

  it('should map surgery-authorization to CMS CoP', () => {
    const controls = mapper.mapToFramework('surgery-authorization', 'cms-cop');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'cop-patient-rights')).toBe(true);
  });

  it('should map imaging-order to Stark Law', () => {
    const controls = mapper.mapToFramework('imaging-order', 'stark-law');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'stark-referral')).toBe(true);
  });

  it('should map lab-order to CLIA', () => {
    const controls = mapper.mapToFramework('lab-order', 'clia');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'clia-certificate')).toBe(true);
  });

  it('should map specialist-referral to Anti-Kickback', () => {
    const controls = mapper.mapToFramework('specialist-referral', 'anti-kickback');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'aks-remuneration')).toBe(true);
  });
});

describe('Healthcare Decision Schemas - Expanded', () => {
  it('should validate surgery authorization', () => {
    const schema = new SurgeryAuthorizationSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P123', age: 45, sex: 'M', privilegeLevel: 'full', consentStatus: 'obtained' },
        procedureCode: 'CPT-12345',
        procedureName: 'Appendectomy',
        surgeon: { id: 'S001', name: 'Dr. Smith', credentials: ['MD', 'FACS'] },
        indication: 'Acute appendicitis',
        urgency: 'urgent',
        anesthesiaType: 'general',
        estimatedDuration: 90,
        riskFactors: [],
        alternativeTreatments: ['Conservative management'],
        insurancePreAuth: true
      },
      outcome: {
        authorized: true,
        conditions: [],
        requiredConsults: [],
        surgeonApproval: {
          surgeonId: 'S001',
          approvedAt: new Date(),
          informedConsentObtained: true
        }
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(true);
  });

  it('should validate imaging order with Stark compliance', () => {
    const schema = new ImagingOrderSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P456', age: 60, sex: 'F', privilegeLevel: 'full', consentStatus: 'obtained' },
        modality: 'MRI',
        bodyPart: 'Brain',
        indication: 'Headache evaluation',
        urgency: 'routine',
        contrast: false,
        priorStudies: [],
        clinicalQuestion: 'Rule out mass',
        orderingProvider: { id: 'P001', name: 'Dr. Jones', specialty: 'Neurology' }
      },
      outcome: {
        approved: true,
        appropriatenessScore: 8,
        protocolRecommendation: 'Brain MRI without contrast',
        radiologistReview: true,
        starkCompliance: true
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(true);
  });

  it('should block imaging order with Stark violation', () => {
    const schema = new ImagingOrderSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P456', age: 60, sex: 'F', privilegeLevel: 'full', consentStatus: 'obtained' },
        modality: 'MRI',
        bodyPart: 'Brain',
        indication: 'Headache',
        urgency: 'routine',
        contrast: false,
        priorStudies: [],
        clinicalQuestion: 'Rule out mass',
        orderingProvider: { id: 'P001', name: 'Dr. Jones', specialty: 'Neurology' }
      },
      outcome: {
        approved: true,
        appropriatenessScore: 8,
        protocolRecommendation: 'Brain MRI',
        radiologistReview: true,
        starkCompliance: false // Stark violation
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Cannot approve imaging order with Stark Law violation');
  });

  it('should validate lab order with CLIA compliance', () => {
    const schema = new LabOrderSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P789', age: 35, sex: 'M', privilegeLevel: 'full', consentStatus: 'obtained' },
        tests: [{ testCode: 'CBC', testName: 'Complete Blood Count', urgency: 'routine' }],
        indication: 'Annual physical',
        orderingProvider: { id: 'P002', name: 'Dr. Lee' },
        fastingRequired: false
      },
      outcome: {
        approved: true,
        duplicateCheck: { isDuplicate: false },
        appropriatenessFlags: [],
        estimatedCost: 50,
        cliaCompliance: true,
        collectionInstructions: ['Standard venipuncture']
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(true);
  });

  it('should validate behavioral health assessment with suicide risk', () => {
    const schema = new BehavioralHealthAssessmentSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P999', age: 28, sex: 'F', privilegeLevel: 'full', consentStatus: 'obtained' },
        screeningTool: 'PHQ-9',
        score: 22,
        symptoms: ['Depressed mood', 'Anhedonia', 'Sleep disturbance'],
        duration: '3 months',
        functionalImpairment: 'severe',
        suicidalIdeation: true,
        substanceUse: false,
        priorPsychiatricHistory: [],
        currentMedications: [],
        socialSupport: 'weak'
      },
      outcome: {
        severity: 'severe',
        recommendedLevel: 'inpatient',
        immediateRisk: true,
        safetyPlan: true,
        psychiatryReferral: true,
        therapyReferral: true,
        medicationRecommendation: true,
        followUpInterval: 1,
        crisisResources: ['988 Suicide & Crisis Lifeline']
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(true);
  });

  it('should require safety plan for suicidal ideation', () => {
    const schema = new BehavioralHealthAssessmentSchema();
    const decision: any = {
      inputs: {
        patient: { patientId: 'P999', age: 28, sex: 'F', privilegeLevel: 'full', consentStatus: 'obtained' },
        screeningTool: 'PHQ-9',
        score: 22,
        symptoms: ['Depressed mood'],
        duration: '3 months',
        functionalImpairment: 'severe',
        suicidalIdeation: true,
        substanceUse: false,
        priorPsychiatricHistory: [],
        currentMedications: [],
        socialSupport: 'weak'
      },
      outcome: {
        severity: 'severe',
        recommendedLevel: 'inpatient',
        immediateRisk: true,
        safetyPlan: false, // Missing safety plan
        psychiatryReferral: true,
        therapyReferral: true,
        medicationRecommendation: true,
        followUpInterval: 1,
        crisisResources: []
      }
    };
    const result = schema.validate(decision);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Immediate risk identified - safety plan required');
  });
});

describe('SaMD Boundary Enforcer', () => {
  let enforcer: SaMDBoundaryEnforcer;

  beforeEach(() => {
    enforcer = new SaMDBoundaryEnforcer();
  });

  it('should allow diagnosis suggestion', () => {
    const result = enforcer.checkAction('diagnosis-suggestion', 'suggest diagnosis');
    expect(result.allowed).toBe(true);
  });

  it('should block autonomous diagnosis', () => {
    const result = enforcer.checkAction('autonomous-diagnosis', 'make diagnosis');
    expect(result.allowed).toBe(false);
    expect(result.blockedBy).toBeTruthy();
  });

  it('should allow triage recommendation', () => {
    const result = enforcer.checkAction('triage-recommendation', 'recommend triage level');
    expect(result.allowed).toBe(true);
  });

  it('should block autonomous treatment', () => {
    const result = enforcer.checkAction('autonomous-treatment', 'initiate treatment');
    expect(result.allowed).toBe(false);
  });
});

describe('Consent Override Ledger', () => {
  let ledger: ConsentOverrideLedger;

  beforeEach(() => {
    ledger = new ConsentOverrideLedger();
  });

  it('should record consent', () => {
    const consent = ledger.recordConsent({
      patientId: 'P123',
      consentType: 'ai-assistance',
      status: 'obtained',
      obtainedBy: 'N001',
      obtainedAt: new Date(),
      scope: 'diagnosis support',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
    expect(consent.id).toBeTruthy();
    expect(consent.documentHash).toBeTruthy();
  });

  it('should record clinician override', () => {
    const override = ledger.recordOverride({
      decisionId: 'D123',
      decisionType: 'diagnosis-support',
      clinicianId: 'C001',
      clinicianRole: 'physician',
      originalRecommendation: 'Viral URI',
      overrideAction: 'Bacterial pneumonia',
      reason: 'Clinical presentation and imaging findings',
      clinicalJustification: 'Fever, productive cough, infiltrate on CXR',
      timestamp: new Date(),
      witnessed: true,
      witnessId: 'N002'
    });
    expect(override.id).toBeTruthy();
    expect(override.hash).toBeTruthy();
  });

  it('should retrieve patient consents', () => {
    ledger.recordConsent({
      patientId: 'P123',
      consentType: 'ai-assistance',
      status: 'obtained',
      obtainedBy: 'N001',
      obtainedAt: new Date(),
      scope: 'all',
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    });
    const consents = ledger.getPatientConsents('P123');
    expect(consents).toHaveLength(1);
  });
});

describe('Healthcare Data Connector', () => {
  let connector: HealthcareDataConnector;

  beforeEach(() => {
    connector = new HealthcareDataConnector();
  });

  it('should have 4 data sources', () => {
    const sources = connector.getSources();
    expect(sources).toHaveLength(4);
    expect(sources.map(s => s.id)).toEqual(['ehr', 'labs', 'pacs', 'pharmacy']);
  });

  it('should start disconnected', () => {
    const sources = connector.getSources();
    for (const source of sources) {
      expect(source.connectionStatus).toBe('disconnected');
    }
  });
});

describe('Healthcare Compliance Mapper', () => {
  let mapper: HealthcareComplianceMapper;

  beforeEach(() => {
    mapper = new HealthcareComplianceMapper();
  });

  it('should have 12 frameworks', () => {
    expect(mapper.supportedFrameworks).toHaveLength(12);
  });

  it('should map diagnosis-support to HIPAA', () => {
    const controls = mapper.mapToFramework('diagnosis-support', 'hipaa');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'hipaa-phi-access')).toBe(true);
  });

  it('should map triage to EMTALA', () => {
    const controls = mapper.mapToFramework('triage', 'emtala');
    expect(controls.length).toBeGreaterThan(0);
    expect(controls.some(c => c.id === 'emtala-mse')).toBe(true);
  });
});
