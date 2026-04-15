/**
 * AI Regulatory Classifier Service
 *
 * Classifies AI use cases against multiple regulatory frameworks and returns
 * required disclosures, consent gates, bias audit requirements, and prohibited
 * practice flags. Consumed by the aiRegulatoryMiddleware and privacy routes.
 *
 * Frameworks covered:
 *   - Colorado AI Act SB 205 (consequential decisions, in force Feb 2026)
 *   - NYC Local Law 144 (AEDT employment screening, in force Jul 2023)
 *   - Illinois AI Video Interview Assessment Act (in force Jan 2020)
 *   - EU AI Act Annex III (high-risk AI systems, obligations from Aug 2026)
 *   - GDPR Article 22 (automated individual decision-making)
 *   - VA CDPA §59.1-578 / TX TDPSA §541.202 / CO CPA §6-1-1306 (profiling opt-out)
 *   - Germany BDSG Art. 26 (employee monitoring; works council)
 */

// ─── Domain classification patterns ──────────────────────────────────────────

const DOMAIN_PATTERNS = {
  EDUCATION: /educa|school|univers|college|graduat|enroll|academ|student|pupil|gpa|test\s*score|degree|curriculum|tuition|admission/i,
  EMPLOYMENT: /employ|hire|hiring|fired|terminat|promot|demot|job\s*applic|recruit|personnel|workforce|salary|compensat|layoff|performance\s*review|worker|staff/i,
  GOVERNMENT: /government\s*benefit|welfare|public\s*service|social\s*service|entitlement|benefit\s*eligib|license|permit\s*applic/i,
  FINANCIAL: /credit\s*scor|loan|mortgage|lending|insurance\s*underwrit|invest\s*decision|bank\s*applic|financ\s*eligib|underwr|risk\s*scor|creditworth/i,
  HEALTHCARE: /health|medic|diagnos|treat|clinical|patient|prescription|therapy|mental\s*health|care\s*plan|triage|drug/i,
  HOUSING: /hous|rent\s*applic|tenant|landlord|mortgage\s*applic|apartment|evict|property\s*applic/i,
  LEGAL: /legal\s*service|court|sentenc|bail|parole|probation|criminal\s*justice|recidivism|judgment|legal\s*decision/i,
};

const AEDT_EMPLOYMENT_PATTERNS = /screen|rank|score|evaluat|assess|candidat|applic|interview|shortlist/i;

const VIDEO_INTERVIEW_PATTERNS = /video\s*interview|interview\s*video|facial\s*analys|expression\s*analys|emotion\s*recogni|body\s*language\s*analys|video\s*screen|recorded\s*interview/i;

const EU_HIGH_RISK_ANNEX_III = {
  BIOMETRIC: /biometric|facial\s*recogni|voice\s*recogni|fingerprint/i,
  CRITICAL_INFRA: /critical\s*infra|power\s*grid|water\s*supply|transport\s*system/i,
  EDUCATION_AI: /student\s*assess|admission\s*decision|exam\s*monitor|academic\s*outcome/i,
  EMPLOYMENT_AI: /work\s*allocation|task\s*assign|promot\s*decision|termination/i,
  ESSENTIAL_SERVICES: /credit\s*scor|credit\s*decision|life\s*insurance|health\s*insurance/i,
  LAW_ENFORCEMENT: /law\s*enforcement|polic|criminal|forensic|immigration/i,
  MIGRATION: /asylum|visa\s*applic|border|immigration/i,
  JUSTICE: /court\s*decision|judicial|legal\s*interpret|evidence\s*evaluat/i,
};

const GERMAN_EMPLOYEE_MONITORING = /employee|worker|staff|personnel|workplace\s*monitor|work\s*performance|productivity\s*track|absence\s*monitor/i;

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConsequentialDomain =
  | 'EDUCATION' | 'EMPLOYMENT' | 'GOVERNMENT' | 'FINANCIAL'
  | 'HEALTHCARE' | 'HOUSING' | 'LEGAL' | 'NONE';

export type RegulatoryRisk = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';

export interface AIClassificationContext {
  deliberationTopic?: string;
  useCase?: string;
  targetAudience?: string;
  jurisdiction?: string;
  inputText?: string;
  customerId?: string;
  organisationType?: 'employer' | 'financial' | 'healthcare' | 'government' | 'general';
}

export interface RequiredConsent {
  framework: string;
  consentType: string;
  gate: 'HARD_BLOCK' | 'SOFT_WARN' | 'LOG_ONLY';
  message: string;
  apiField: string;
}

export interface RequiredDisclosure {
  framework: string;
  statute: string;
  disclosureText: string;
  timing: 'BEFORE_USE' | 'IN_RESPONSE' | 'ON_REQUEST';
  endpoint?: string;
}

export interface BiasAuditRequirement {
  required: boolean;
  framework: string;
  frequency: string;
  auditBy: string;
  guidance: string;
}

export interface AIClassificationResult {
  consequentialDomain: ConsequentialDomain;
  overallRisk: RegulatoryRisk;
  isHighRiskAI: boolean;
  isAEDT: boolean;
  requiresVideoConsent: boolean;
  isGDPRArticle22: boolean;
  isEUAIActHighRisk: boolean;
  isGermanEmployeeMonitoring: boolean;
  requiredConsents: RequiredConsent[];
  requiredDisclosures: RequiredDisclosure[];
  biasAuditRequirements: BiasAuditRequirement[];
  prohibitedFlags: string[];
  applicableFrameworks: string[];
  regulatoryMetadata: Record<string, unknown>;
}

// ─── Classification Engine ────────────────────────────────────────────────────

class AIRegulatoryClassifierService {

  /**
   * Main entry point — classify an AI use case against all applicable frameworks.
   */
  classify(ctx: AIClassificationContext): AIClassificationResult {
    const text = [
      ctx.deliberationTopic, ctx.useCase, ctx.targetAudience, ctx.inputText,
    ].filter(Boolean).join(' ');

    const domain = this.classifyConsequentialDomain(text);
    const isAEDT = this.detectAEDT(text, domain);
    const requiresVideoConsent = VIDEO_INTERVIEW_PATTERNS.test(text);
    const isGDPRArticle22 = this.isGDPRAutomatedDecision(text, domain);
    const euHighRisk = this.classifyEUAIActHighRisk(text, domain);
    const isGermanEmployeeMonitoring = GERMAN_EMPLOYEE_MONITORING.test(text);

    const consents = this.buildRequiredConsents(text, domain, isAEDT, requiresVideoConsent, ctx.jurisdiction);
    const disclosures = this.buildRequiredDisclosures(domain, isAEDT, requiresVideoConsent, isGDPRArticle22, ctx.jurisdiction);
    const biasAudits = this.buildBiasAuditRequirements(domain, isAEDT, euHighRisk.isHighRisk);
    const prohibited = this.detectProhibitedPractices(text);
    const frameworks = this.deriveApplicableFrameworks(domain, isAEDT, requiresVideoConsent, euHighRisk.isHighRisk, ctx.jurisdiction);

    const overallRisk = this.deriveOverallRisk(domain, prohibited, isAEDT, euHighRisk.isHighRisk);

    return {
      consequentialDomain: domain,
      overallRisk,
      isHighRiskAI: domain !== 'NONE' || euHighRisk.isHighRisk,
      isAEDT,
      requiresVideoConsent,
      isGDPRArticle22,
      isEUAIActHighRisk: euHighRisk.isHighRisk,
      isGermanEmployeeMonitoring,
      requiredConsents: consents,
      requiredDisclosures: disclosures,
      biasAuditRequirements: biasAudits,
      prohibitedFlags: prohibited,
      applicableFrameworks: frameworks,
      regulatoryMetadata: {
        coloradoSB205: { applies: domain !== 'NONE', domain, appealEndpoint: 'POST /api/v1/privacy/appeal-ai-decision' },
        nycLL144: { applies: isAEDT, disclosureEndpoint: 'GET /api/v1/privacy/aedt-disclosure' },
        illinoisAIVIA: { applies: requiresVideoConsent, consentRequired: requiresVideoConsent },
        euAIAct: { highRisk: euHighRisk.isHighRisk, triggeringCategory: euHighRisk.category, obligationsFrom: '2026-08-02' },
        gdprArticle22: { applies: isGDPRArticle22, humanReviewAvailable: true },
        germanyBDSG: { applies: isGermanEmployeeMonitoring, worksCouncilDisclosureRequired: isGermanEmployeeMonitoring },
        classifiedAt: new Date().toISOString(),
      },
    };
  }

  // ─── Domain classification ──────────────────────────────────────────────────

  private classifyConsequentialDomain(text: string): ConsequentialDomain {
    for (const [domain, pattern] of Object.entries(DOMAIN_PATTERNS)) {
      if (pattern.test(text)) return domain as ConsequentialDomain;
    }
    return 'NONE';
  }

  // ─── AEDT detection (NYC LL 144) ────────────────────────────────────────────

  private detectAEDT(text: string, domain: ConsequentialDomain): boolean {
    return domain === 'EMPLOYMENT' && AEDT_EMPLOYMENT_PATTERNS.test(text);
  }

  // ─── GDPR Art. 22 automated decision detection ──────────────────────────────

  private isGDPRAutomatedDecision(text: string, domain: ConsequentialDomain): boolean {
    const legalEffect = /solely\s*automat|automat\s*decision|no\s*human|without\s*human|legal\s*effect|significant\s*effect/i.test(text);
    return domain !== 'NONE' && (legalEffect || domain === 'FINANCIAL' || domain === 'LEGAL');
  }

  // ─── EU AI Act Annex III classification ────────────────────────────────────

  private classifyEUAIActHighRisk(text: string, domain: ConsequentialDomain): { isHighRisk: boolean; category: string } {
    for (const [category, pattern] of Object.entries(EU_HIGH_RISK_ANNEX_III)) {
      if (pattern.test(text)) return { isHighRisk: true, category };
    }
    const domainMap: Partial<Record<ConsequentialDomain, string>> = {
      EMPLOYMENT: 'EMPLOYMENT_AI', EDUCATION: 'EDUCATION_AI',
      FINANCIAL: 'ESSENTIAL_SERVICES', LEGAL: 'JUSTICE', HEALTHCARE: 'ESSENTIAL_SERVICES',
    };
    if (domainMap[domain]) return { isHighRisk: true, category: domainMap[domain]! };
    return { isHighRisk: false, category: 'NONE' };
  }

  // ─── Prohibited practice detection (EU AI Act Art. 5) ──────────────────────

  private detectProhibitedPractices(text: string): string[] {
    const flags: string[] = [];
    if (/social\s*(?:credit|scor(?:e|ing))|citizen\s*scor(?:e|ing)/i.test(text)) flags.push('SOCIAL_SCORING_EU_AI_ACT_ART5');
    if (/subliminal|subconscious\s*manipulat/i.test(text)) flags.push('SUBLIMINAL_MANIPULATION_EU_AI_ACT_ART5');
    if (/emotion\s*(?:recogni|detect|analys).*(?:workplace|classroom|employ|student)/i.test(text)) flags.push('EMOTION_RECOGNITION_WORKPLACE_EU_AI_ACT_ART5');
    if (/(?:real.time|live|mass)\s*(?:biometric|facial).*(?:public|crowd|street)/i.test(text)) flags.push('MASS_BIOMETRIC_SURVEILLANCE_EU_AI_ACT_ART5');
    if (/predict(?:ive)?\s*polic.*(?:ethnic|racial|profile)/i.test(text)) flags.push('PREDICTIVE_POLICING_EU_AI_ACT_ART5');
    return flags;
  }

  // ─── Required consents ──────────────────────────────────────────────────────

  private buildRequiredConsents(
    text: string,
    domain: ConsequentialDomain,
    isAEDT: boolean,
    requiresVideoConsent: boolean,
    jurisdiction?: string,
  ): RequiredConsent[] {
    const consents: RequiredConsent[] = [];

    if (requiresVideoConsent) {
      consents.push({
        framework: 'Illinois AI Video Interview Assessment Act (820 ILCS 42)',
        consentType: 'Explicit informed consent before AI video analysis',
        gate: 'HARD_BLOCK',
        message: 'Illinois law requires explicit written consent before AI analysis of video interviews. The candidate must be informed of: (1) AI will be used, (2) the traits/characteristics AI will evaluate, (3) who will view AI analysis. Consent must be obtained before any recording begins.',
        apiField: 'illinoisAIVIAConsent',
      });
    }

    if (isAEDT && (jurisdiction === 'US-NY' || !jurisdiction)) {
      consents.push({
        framework: 'NYC Local Law 144 (Admin. Code §20-870)',
        consentType: 'Prior notice to candidates/employees of AEDT use',
        gate: 'HARD_BLOCK',
        message: 'NYC LL 144 requires employers to notify job candidates and employees at least 10 business days before using an AEDT. Notice must include: (1) that an AEDT will be used, (2) job qualifications/characteristics the AEDT will assess, (3) instructions for requesting alternative process.',
        apiField: 'nycLL144NoticeProvided',
      });
    }

    if (domain !== 'NONE') {
      consents.push({
        framework: 'Colorado AI Act SB 205 §6-1-1703',
        consentType: 'Notification and appeal right for consequential decisions',
        gate: 'SOFT_WARN',
        message: `Colorado SB 205 requires deployers to notify consumers when a consequential decision (${domain} domain) is made using an AI system, and provide an opportunity to appeal or request human review within 45 days.`,
        apiField: 'coloradoSB205NoticeAcknowledged',
      });
    }

    if (domain !== 'NONE' && /EU|europe|gdpr/i.test(text)) {
      consents.push({
        framework: 'GDPR Article 22',
        consentType: 'Explicit consent or human review for automated individual decisions',
        gate: 'HARD_BLOCK',
        message: 'GDPR Art. 22 prohibits solely automated decisions with legal or significant effects without: (a) necessity for contract, (b) explicit consent, or (c) EU/member state law authorisation. Human review must be available on request.',
        apiField: 'gdprArticle22ConsentOrExclusion',
      });
    }

    return consents;
  }

  // ─── Required disclosures ───────────────────────────────────────────────────

  private buildRequiredDisclosures(
    domain: ConsequentialDomain,
    isAEDT: boolean,
    requiresVideoConsent: boolean,
    isGDPRArticle22: boolean,
    jurisdiction?: string,
  ): RequiredDisclosure[] {
    const disclosures: RequiredDisclosure[] = [];

    if (domain !== 'NONE') {
      disclosures.push({
        framework: 'Colorado AI Act SB 205',
        statute: 'Colo. Rev. Stat. §6-1-1702',
        disclosureText: `This decision was assisted by an artificial intelligence system. You have the right to: (1) know the principal reasons for this decision, (2) correct any inaccurate personal data, (3) request human review, and (4) appeal this decision within 45 days by contacting privacy@datacendia.com or via POST /api/v1/privacy/appeal-ai-decision.`,
        timing: 'IN_RESPONSE',
        endpoint: 'POST /api/v1/privacy/appeal-ai-decision',
      });
    }

    if (isAEDT) {
      disclosures.push({
        framework: 'NYC Local Law 144',
        statute: 'NYC Admin. Code §20-871',
        disclosureText: 'This evaluation uses an Automated Employment Decision Tool (AEDT). An independent bias audit has been/must be conducted. You may request: (1) the categories of data used, (2) the source of the data, (3) an alternative selection process.',
        timing: 'BEFORE_USE',
        endpoint: 'GET /api/v1/privacy/aedt-disclosure',
      });
    }

    if (requiresVideoConsent) {
      disclosures.push({
        framework: 'Illinois AI Video Interview Assessment Act',
        statute: '820 ILCS 42/1',
        disclosureText: 'This interview may be analysed by artificial intelligence. The AI will evaluate [list traits here]. Only [specified roles] will review the AI analysis. You may: (1) withdraw consent at any time, (2) request that your data be deleted within 30 days.',
        timing: 'BEFORE_USE',
      });
    }

    if (isGDPRArticle22) {
      disclosures.push({
        framework: 'GDPR Article 22',
        statute: 'Regulation (EU) 2016/679 Art. 22',
        disclosureText: 'This decision involves automated processing of your personal data. You have the right to: (1) obtain human intervention, (2) express your point of view, (3) contest this decision. Contact privacy@datacendia.com to exercise these rights.',
        timing: 'IN_RESPONSE',
      });
    }

    return disclosures;
  }

  // ─── Bias audit requirements ────────────────────────────────────────────────

  private buildBiasAuditRequirements(
    domain: ConsequentialDomain,
    isAEDT: boolean,
    isEUHighRisk: boolean,
  ): BiasAuditRequirement[] {
    const audits: BiasAuditRequirement[] = [];

    if (isAEDT) {
      audits.push({
        required: true,
        framework: 'NYC Local Law 144',
        frequency: 'Annual (before first use; then annually)',
        auditBy: 'Independent third party (not an employee/contractor of the deployer)',
        guidance: 'Bias audit must calculate selection rate by race/sex category and compare against most-favoured group. Results published publicly on company website. Contact FairNow, Parity AI, or BABL AI.',
      });
    }

    if (domain !== 'NONE') {
      audits.push({
        required: true,
        framework: 'Colorado AI Act SB 205',
        frequency: 'Annual impact assessment before deployment and each calendar year',
        auditBy: 'Internal assessment or third-party — documented in writing',
        guidance: 'Assessment must document: (1) purpose/intended use, (2) benefits, (3) reasonably foreseeable risks of algorithmic discrimination, (4) data used in training/deployment, (5) performance metrics, (6) post-deployment monitoring plan.',
      });
    }

    if (isEUHighRisk) {
      audits.push({
        required: true,
        framework: 'EU AI Act — High-Risk AI Systems',
        frequency: 'Before deployment + substantial modification + periodic review',
        auditBy: 'Internal quality management system; third-party conformity assessment for some Annex III categories',
        guidance: 'Technical documentation (Art. 11), risk management system (Art. 9), data governance (Art. 10), human oversight (Art. 14), accuracy/robustness testing (Art. 15). Log and retain test results.',
      });
    }

    return audits;
  }

  // ─── Applicable frameworks ──────────────────────────────────────────────────

  private deriveApplicableFrameworks(
    domain: ConsequentialDomain,
    isAEDT: boolean,
    requiresVideoConsent: boolean,
    isEUHighRisk: boolean,
    jurisdiction?: string,
  ): string[] {
    const frameworks: string[] = [];
    if (domain !== 'NONE') frameworks.push('Colorado AI Act SB 205 (Feb 2026)');
    if (isAEDT) frameworks.push('NYC Local Law 144 (Jul 2023)');
    if (requiresVideoConsent) frameworks.push('Illinois AI Video Interview Assessment Act (Jan 2020)');
    if (isEUHighRisk) frameworks.push('EU AI Act — High-Risk (Aug 2026)');
    if (domain !== 'NONE') frameworks.push('GDPR Article 22 (automated decisions)');
    if (domain === 'EMPLOYMENT') frameworks.push('Germany BDSG Art. 26 (employee monitoring)');
    if (domain === 'FINANCIAL') frameworks.push('CFPB UDAAP / FRB SR 11-7 (model risk)');
    if (domain === 'HEALTHCARE') frameworks.push('HIPAA / FTC Health Breach Notification Rule');
    if (['EMPLOYMENT', 'EDUCATION', 'FINANCIAL', 'HOUSING'].includes(domain)) {
      frameworks.push('ECOA / Fair Housing Act (US discrimination law)');
    }
    return frameworks;
  }

  // ─── Overall risk derivation ────────────────────────────────────────────────

  private deriveOverallRisk(
    domain: ConsequentialDomain,
    prohibited: string[],
    isAEDT: boolean,
    isEUHighRisk: boolean,
  ): RegulatoryRisk {
    if (prohibited.length > 0) return 'CRITICAL';
    if (domain === 'LEGAL' || domain === 'HEALTHCARE') return 'CRITICAL';
    if (isAEDT || domain === 'FINANCIAL' || domain === 'HOUSING') return 'HIGH';
    if (domain !== 'NONE' || isEUHighRisk) return 'MEDIUM';
    return 'NONE';
  }

  /**
   * Quick check — returns true if a request requires a hard-block consent gate
   * before any AI processing can proceed.
   */
  requiresHardBlock(ctx: AIClassificationContext): boolean {
    const result = this.classify(ctx);
    return result.requiredConsents.some(c => c.gate === 'HARD_BLOCK')
      || result.prohibitedFlags.length > 0;
  }

  /**
   * Build the regulatory headers / metadata to attach to AI API responses.
   * Added by aiRegulatoryMiddleware to all AI inference route responses.
   */
  buildResponseHeaders(result: AIClassificationResult): Record<string, string> {
    const headers: Record<string, string> = {};
    if (result.isHighRiskAI) headers['X-AI-Regulatory-Risk'] = result.overallRisk;
    if (result.consequentialDomain !== 'NONE') headers['X-AI-Consequential-Domain'] = result.consequentialDomain;
    if (result.isAEDT) headers['X-AI-AEDT'] = 'true; see GET /api/v1/privacy/aedt-disclosure';
    if (result.isEUAIActHighRisk) headers['X-AI-EU-High-Risk'] = 'true; obligations from 2026-08-02';
    if (result.applicableFrameworks.length > 0) headers['X-AI-Frameworks'] = result.applicableFrameworks.join('; ').slice(0, 512);
    return headers;
  }
}

export const aiRegulatoryClassifier = new AIRegulatoryClassifierService();
