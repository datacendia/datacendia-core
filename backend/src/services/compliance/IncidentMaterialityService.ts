/**
 * Incident Materiality & Multi-Framework Breach Notification Service
 *
 * Assesses security incidents and data breaches against every applicable
 * regulatory notification framework and generates a prioritised notification
 * plan with specific deadlines, draft notices, and regulator contacts.
 *
 * Frameworks covered:
 *   - SEC Cybersecurity Disclosure Rules 2023 (4 business days — Form 8-K Item 1.05)
 *   - NY DFS 23 NYCRR Part 500 (72 hours to NYDFS)
 *   - FTC Health Breach Notification Rule 2024 (60 days — non-HIPAA health apps)
 *   - GDPR Art. 33 (72 hours to lead supervisory authority)
 *   - GDPR Art. 34 (individual notification — no undue delay)
 *   - UK GDPR (72 hours to ICO)
 *   - HIPAA Breach Notification Rule (60 days to HHS; 60 days to individuals)
 *   - CCPA (45 days to AG if > 500 CA residents)
 *   - Japan APPI (3–5 days to PPC for serious breach; 30 days to individuals)
 *   - Singapore PDPA (3 days to PDPC if > 500 affected or significant harm)
 *   - Australia NDB (72 hours to OAIC + individuals)
 *   - New Zealand Privacy Act 2020 (72 hours to OPC NZ)
 *   - Nigeria NDPA 2023 (72 hours to NDPC)
 *   - South Korea PIPA (72 hours to PIPC)
 *   - Brazil LGPD (72 hours to ANPD — draft guidance)
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type IncidentSeverity = 'P1_CRITICAL' | 'P2_HIGH' | 'P3_MEDIUM' | 'P4_LOW';
export type DataCategory =
  | 'personal_identifiable' | 'health_phi' | 'financial_payment'
  | 'credentials_passwords' | 'biometric' | 'children_under_13'
  | 'government_id' | 'location' | 'communications' | 'general';

export interface IncidentInput {
  severity: IncidentSeverity;
  dataCategories: DataCategory[];
  estimatedAffected: number;
  affectedJurisdictions: string[];       // e.g. ['EU', 'US-NY', 'UK', 'JP', 'AU']
  isPublicCompany: boolean;              // SEC applicability
  customersAreNYDFSLicensees: boolean;   // NY DFS 500 applicability
  containmentAchieved: boolean;
  incidentDate: Date;
  discoveryDate: Date;
  description: string;
}

export interface NotificationRequirement {
  framework: string;
  statute: string;
  regulator: string;
  regulatorUrl: string;
  notificationEmail?: string;
  deadline: Date;
  deadlineHours: number;
  isBusinessDays: boolean;
  affectedThreshold: number;
  requiredActions: string[];
  draftNoticeTemplate: string;
  priority: 1 | 2 | 3;
}

export interface MaterialityAssessment {
  isMaterialSEC: boolean;
  materialityFactors: string[];
  materialityScore: number;  // 0–100
  recommendation: string;
}

export interface IncidentNotificationPlan {
  incidentId: string;
  assessedAt: string;
  overallSeverity: IncidentSeverity;
  isMaterialSEC: MaterialityAssessment;
  notifications: NotificationRequirement[];
  immediateActions: string[];
  communicationDraft: {
    customerNotice: string;
    regulatorSummary: string;
    internalEscalation: string;
  };
  retentionNote: string;
}

// ─── Business day calculator ──────────────────────────────────────────────────

function addBusinessDays(start: Date, days: number): Date {
  const result = new Date(start);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const dow = result.getDay();
    if (dow !== 0 && dow !== 6) added++;
  }
  return result;
}

function addHours(start: Date, hours: number): Date {
  return new Date(start.getTime() + hours * 60 * 60 * 1000);
}

// ─── Materiality assessment (SEC) ────────────────────────────────────────────

function assessSECMateriality(incident: IncidentInput): MaterialityAssessment {
  const factors: string[] = [];
  let score = 0;

  if (incident.dataCategories.includes('credentials_passwords')) { score += 20; factors.push('Credential compromise — potential for unauthorised access to customer accounts'); }
  if (incident.dataCategories.includes('financial_payment')) { score += 25; factors.push('Financial/payment data exposed — direct financial harm risk'); }
  if (incident.dataCategories.includes('health_phi')) { score += 20; factors.push('Health data exposed — HIPAA + FTC HBNR liability'); }
  if (incident.dataCategories.includes('biometric')) { score += 25; factors.push('Biometric data exposed — Illinois BIPA class action risk'); }
  if (incident.estimatedAffected > 10000) { score += 20; factors.push(`${incident.estimatedAffected.toLocaleString()} affected users — large scale`); }
  else if (incident.estimatedAffected > 1000) { score += 10; factors.push(`${incident.estimatedAffected.toLocaleString()} affected users — medium scale`); }
  if (incident.severity === 'P1_CRITICAL') { score += 15; factors.push('P1 Critical severity — significant operational impact'); }
  if (!incident.containmentAchieved) { score += 15; factors.push('Incident not yet contained — ongoing harm possible'); }

  const isMaterial = score >= 40;
  return {
    isMaterialSEC: isMaterial,
    materialityFactors: factors,
    materialityScore: Math.min(score, 100),
    recommendation: isMaterial
      ? `MATERIAL — File Form 8-K Item 1.05 within 4 business days of ${incident.discoveryDate.toISOString().split('T')[0]}. Deadline: ${addBusinessDays(incident.discoveryDate, 4).toDateString()}. Engage securities counsel immediately.`
      : 'NOT MATERIAL at this time — document reasoning. Re-assess if scope expands.',
  };
}

// ─── Notification builder ─────────────────────────────────────────────────────

class IncidentMaterialityServiceImpl {

  assess(incident: IncidentInput): IncidentNotificationPlan {
    const incidentId = `INC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const notifications: NotificationRequirement[] = [];
    const jurisdictions = incident.affectedJurisdictions.map(j => j.toUpperCase());

    // ── EU/EEA — GDPR Art. 33 ────────────────────────────────────────────────
    if (jurisdictions.some(j => j === 'EU' || j === 'EEA' || j.startsWith('EU-'))) {
      if (incident.dataCategories.some(c => c !== 'general')) {
        notifications.push({
          framework: 'GDPR Article 33',
          statute: 'Regulation (EU) 2016/679 Art. 33',
          regulator: 'Lead EU Supervisory Authority (DPA of Datacendia\'s EU establishment)',
          regulatorUrl: 'https://edpb.europa.eu/about-edpb/about-edpb/members_en',
          notificationEmail: 'dpa@[lead-supervisory-authority].eu',
          deadline: addHours(incident.discoveryDate, 72),
          deadlineHours: 72,
          isBusinessDays: false,
          affectedThreshold: 1,
          requiredActions: [
            'Notify lead EU supervisory authority within 72 hours of discovery',
            'Include: nature of breach, categories/approx number affected, likely consequences, measures taken/proposed',
            'If notification > 72h, document and explain delay',
            'If high risk to individuals, notify affected individuals without undue delay (Art. 34)',
          ],
          draftNoticeTemplate: this.buildGDPRNotice(incident),
          priority: 1,
        });
      }
    }

    // ── UK — UK GDPR ─────────────────────────────────────────────────────────
    if (jurisdictions.includes('UK')) {
      notifications.push({
        framework: 'UK GDPR Article 33',
        statute: 'UK GDPR Art. 33; Data Protection Act 2018',
        regulator: 'Information Commissioner\'s Office (ICO)',
        regulatorUrl: 'https://ico.org.uk/make-a-complaint/data-security-and-personal-data-breach-reports/',
        notificationEmail: 'casework@ico.org.uk',
        deadline: addHours(incident.discoveryDate, 72),
        deadlineHours: 72,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Report to ICO within 72 hours via online portal',
          'Provide: reference number ZA-XXXXXX, description, data categories, number affected, contact details',
          'Notify affected UK individuals if high risk',
        ],
        draftNoticeTemplate: this.buildGDPRNotice(incident, 'UK'),
        priority: 1,
      });
    }

    // ── US — SEC Form 8-K (public companies) ─────────────────────────────────
    if (incident.isPublicCompany) {
      const materiality = assessSECMateriality(incident);
      if (materiality.isMaterialSEC) {
        notifications.push({
          framework: 'SEC Cybersecurity Disclosure Rules 2023',
          statute: '17 CFR §229.106 / Item 1.05 Form 8-K',
          regulator: 'Securities and Exchange Commission (SEC)',
          regulatorUrl: 'https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&type=8-K',
          deadline: addBusinessDays(incident.discoveryDate, 4),
          deadlineHours: 96,
          isBusinessDays: true,
          affectedThreshold: 0,
          requiredActions: [
            'File Form 8-K Item 1.05 within 4 business days of materiality determination',
            'Include: nature, scope and timing of incident; material impact or reasonably likely material impact',
            'Annual 10-K: disclose cybersecurity risk management, strategy, governance',
            'Board oversight of cybersecurity risks must be described',
            'Engage securities counsel and auditors immediately',
          ],
          draftNoticeTemplate: this.buildSECDraftNotice(incident, materiality),
          priority: 1,
        });
      }
    }

    // ── US — NY DFS 23 NYCRR 500 ─────────────────────────────────────────────
    if (incident.customersAreNYDFSLicensees || jurisdictions.includes('US-NY')) {
      notifications.push({
        framework: 'NY DFS 23 NYCRR Part 500',
        statute: '23 NYCRR §500.17',
        regulator: 'New York Department of Financial Services (DFS)',
        regulatorUrl: 'https://www.dfs.ny.gov/industry_guidance/cybersecurity',
        notificationEmail: 'cybersecurity@dfs.ny.gov',
        deadline: addHours(incident.discoveryDate, 72),
        deadlineHours: 72,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify DFS within 72 hours via NYDFS Portal (https://myportal.dfs.ny.gov)',
          'Report: type of event, date/time, systems/data affected, response actions taken',
          'Preserve evidence and logs for DFS examination',
          'Notify DFS-regulated customers within their own notification obligations',
          'Provide annual Certification of Compliance (§500.17(b)) — next Feb 15',
        ],
        draftNoticeTemplate: this.buildNYDFSNotice(incident),
        priority: 1,
      });
    }

    // ── US — HIPAA Breach Notification Rule ──────────────────────────────────
    if (incident.dataCategories.includes('health_phi')) {
      notifications.push({
        framework: 'HIPAA Breach Notification Rule',
        statute: '45 CFR §§164.400–164.414',
        regulator: 'HHS Office for Civil Rights (OCR)',
        regulatorUrl: 'https://www.hhs.gov/hipaa/for-professionals/breach-notification/index.html',
        notificationEmail: 'OCRMail@hhs.gov',
        deadline: addHours(incident.discoveryDate, 60 * 24),
        deadlineHours: 60 * 24,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify affected individuals within 60 days of discovery (without unreasonable delay)',
          'Notify HHS within 60 days (≤500 affected: annual log; >500 affected: immediate + media notice)',
          `Prominent media notice required if >${500} affected in same state`,
          'Document breach investigation and notification in HIPAA log (6-year retention)',
          'Engage HIPAA counsel; review BAA obligations with business associates',
        ],
        draftNoticeTemplate: this.buildHIPAANotice(incident),
        priority: 1,
      });

      // FTC HBNR also applies if platform is a PHR vendor (non-HIPAA health app)
      notifications.push({
        framework: 'FTC Health Breach Notification Rule 2024',
        statute: '16 CFR Part 318',
        regulator: 'Federal Trade Commission (FTC)',
        regulatorUrl: 'https://www.ftc.gov/legal-library/browse/rules/health-breach-notification-rule',
        notificationEmail: 'hbn@ftc.gov',
        deadline: addHours(incident.discoveryDate, 60 * 24),
        deadlineHours: 60 * 24,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify affected individuals within 60 days via first-class mail or email',
          'Notify FTC within 60 days (online form at FTC.gov)',
          `If >500 affected: notify prominent media outlets in affected states`,
          'Notice must include: description of breach, types of info involved, steps individuals can take, your contact info',
          '2024 amendment: applies to health apps and connected devices beyond traditional PHRs',
        ],
        draftNoticeTemplate: this.buildFTCHBNRNotice(incident),
        priority: 2,
      });
    }

    // ── US — CCPA breach notification ────────────────────────────────────────
    if (jurisdictions.includes('US-CA') || jurisdictions.includes('US')) {
      if (incident.estimatedAffected >= 500) {
        notifications.push({
          framework: 'CCPA §1798.82 / California Civil Code',
          statute: 'Cal. Civ. Code §1798.82',
          regulator: 'California Attorney General',
          regulatorUrl: 'https://oag.ca.gov/privacy/databreach/reporting',
          deadline: addHours(incident.discoveryDate, 45 * 24),
          deadlineHours: 45 * 24,
          isBusinessDays: false,
          affectedThreshold: 500,
          requiredActions: [
            'Notify affected California residents in most expedient time possible, without unreasonable delay',
            'Notify California AG if > 500 California residents affected',
            'Notice must include specific required elements (name/contact of breached entity, types of PI, incident dates, steps to protect self)',
            'Plain language, 10pt+ font, standard title "NOTICE OF DATA BREACH"',
          ],
          draftNoticeTemplate: `NOTICE OF DATA BREACH\n\nDear [Customer],\n\nWe are writing to inform you of a security incident affecting Datacendia, LLC.\n\n[INCIDENT DESCRIPTION]\n\nWhat happened: ${incident.description}\nDate of incident: ${incident.incidentDate.toDateString()}\nDate discovered: ${incident.discoveryDate.toDateString()}\nInformation involved: [LIST DATA CATEGORIES]\n\nWhat we are doing: We have contained the incident and are taking the following steps: [ACTIONS]\n\nWhat you can do: [PROTECTIVE STEPS]\n\nContact us: privacy@datacendia.com | 1-800-XXX-XXXX`,
          priority: 2,
        });
      }
    }

    // ── Japan — APPI ─────────────────────────────────────────────────────────
    if (jurisdictions.includes('JP')) {
      notifications.push({
        framework: 'Japan APPI (Act on Protection of Personal Information)',
        statute: 'APPI Art. 26',
        regulator: 'Personal Information Protection Commission (PPC)',
        regulatorUrl: 'https://www.ppc.go.jp/en/',
        notificationEmail: 'https://www.ppc.go.jp/en/personalinfo/legal/guidelines/',
        deadline: addHours(incident.discoveryDate, 3 * 24),
        deadlineHours: 3 * 24,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Report to PPC within 3–5 days of discovery (preliminary report)',
          'Notify affected individuals "promptly" (typically within 30 days)',
          'File full report to PPC within 30 days',
          'Applies to: leakage of sensitive personal information, >1,000 individuals affected, or involving illegal access',
          'Japan PPC accepts English notifications; local counsel recommended',
        ],
        draftNoticeTemplate: this.buildGenericNotice(incident, 'PPC Japan', 'APPI Art. 26'),
        priority: 2,
      });
    }

    // ── Singapore — PDPA ─────────────────────────────────────────────────────
    if (jurisdictions.includes('SG')) {
      notifications.push({
        framework: 'Singapore PDPA 2021 Amendment',
        statute: 'PDPA Part 6A',
        regulator: 'Personal Data Protection Commission (PDPC)',
        regulatorUrl: 'https://www.pdpc.gov.sg/Overview-of-PDPA/The-Legislation/Personal-Data-Protection-Act',
        notificationEmail: 'https://www.pdpc.gov.sg/Help-and-Resources/2021/01/Guide-to-Breach-Notification',
        deadline: addHours(incident.discoveryDate, 3 * 24),
        deadlineHours: 3 * 24,
        isBusinessDays: false,
        affectedThreshold: 500,
        requiredActions: [
          'Notify PDPC within 3 calendar days if > 500 affected OR likely significant harm',
          'Notify affected individuals as soon as practicable',
          'Document: nature, categories, volume of data, circumstances, measures taken',
        ],
        draftNoticeTemplate: this.buildGenericNotice(incident, 'PDPC Singapore', 'PDPA Part 6A'),
        priority: 2,
      });
    }

    // ── Australia — NDB Scheme ───────────────────────────────────────────────
    if (jurisdictions.includes('AU')) {
      notifications.push({
        framework: 'Australia Notifiable Data Breaches (NDB) Scheme',
        statute: 'Privacy Act 1988 Part IIIC',
        regulator: 'Office of the Australian Information Commissioner (OAIC)',
        regulatorUrl: 'https://www.oaic.gov.au/privacy/notifiable-data-breaches',
        notificationEmail: 'enquiries@oaic.gov.au',
        deadline: addHours(incident.discoveryDate, 72),
        deadlineHours: 72,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify OAIC within 72 hours if "eligible data breach" (likely serious harm)',
          'Notify affected individuals as soon as practicable',
          'Eligible breach: unauthorised access/disclosure that is likely to result in serious harm to one or more individuals',
          'Use OAIC NDB notification form at oaic.gov.au',
        ],
        draftNoticeTemplate: this.buildGenericNotice(incident, 'OAIC Australia', 'Privacy Act 1988 Part IIIC'),
        priority: 2,
      });
    }

    // ── Nigeria — NDPA 2023 ──────────────────────────────────────────────────
    if (jurisdictions.includes('NG')) {
      notifications.push({
        framework: 'Nigeria Data Protection Act 2023 (NDPA)',
        statute: 'NDPA §40',
        regulator: 'Nigeria Data Protection Commission (NDPC)',
        regulatorUrl: 'https://ndpc.gov.ng',
        notificationEmail: 'info@ndpc.gov.ng',
        deadline: addHours(incident.discoveryDate, 72),
        deadlineHours: 72,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify NDPC within 72 hours of becoming aware of breach',
          'Notify affected individuals without undue delay if high risk',
          'Engage a Data Protection Compliance Organisation (DPCO) licensed by NDPC',
          'Annual audit of data processing activities required',
        ],
        draftNoticeTemplate: this.buildGenericNotice(incident, 'NDPC Nigeria', 'NDPA §40'),
        priority: 3,
      });
    }

    // ── Brazil — LGPD ────────────────────────────────────────────────────────
    if (jurisdictions.includes('BR')) {
      notifications.push({
        framework: 'Brazil LGPD',
        statute: 'LGPD Art. 48',
        regulator: 'Autoridade Nacional de Proteção de Dados (ANPD)',
        regulatorUrl: 'https://www.gov.br/anpd/',
        notificationEmail: 'https://www.gov.br/anpd/pt-br/assuntos/noticias',
        deadline: addHours(incident.discoveryDate, 72),
        deadlineHours: 72,
        isBusinessDays: false,
        affectedThreshold: 1,
        requiredActions: [
          'Notify ANPD within 72 hours (ANPD Resolução CD/ANPD 02/2022)',
          'Notify affected individuals "in a reasonable time"',
          'Include: categories of affected data, number of affected data subjects, technical/security measures',
        ],
        draftNoticeTemplate: this.buildGenericNotice(incident, 'ANPD Brazil', 'LGPD Art. 48'),
        priority: 3,
      });
    }

    // Sort by priority then by deadline
    notifications.sort((a, b) => a.priority - b.priority || a.deadline.getTime() - b.deadline.getTime());

    return {
      incidentId,
      assessedAt: new Date().toISOString(),
      overallSeverity: incident.severity,
      isMaterialSEC: assessSECMateriality(incident),
      notifications,
      immediateActions: this.buildImmediateActions(incident),
      communicationDraft: this.buildCommunicationDrafts(incident),
      retentionNote: 'Retain all incident documentation, notification records, and response evidence for minimum 7 years (HIPAA §164.530(j); GDPR accountability; SOC 2 Type II evidence).',
    };
  }

  // ─── Draft notice builders ────────────────────────────────────────────────

  private buildGDPRNotice(incident: IncidentInput, authority = 'EU'): string {
    return `GDPR Article 33 Notification — ${authority} Supervisory Authority

Organisation: Datacendia, LLC
DPO Contact: privacy@datacendia.com
Notification Date: ${new Date().toISOString()}
Incident Reference: [INCIDENT-ID]

1. NATURE OF BREACH
${incident.description}
Date of breach: ${incident.incidentDate.toDateString()}
Date of discovery: ${incident.discoveryDate.toDateString()}

2. DATA CATEGORIES AFFECTED
${incident.dataCategories.join(', ')}

3. APPROXIMATE NUMBER AFFECTED
${incident.estimatedAffected.toLocaleString()} data subjects

4. LIKELY CONSEQUENCES
[Describe likely consequences for affected individuals]

5. MEASURES TAKEN OR PROPOSED
- Containment: [describe containment steps]
- Investigation: [describe investigation ongoing]
- Remediation: [describe fix/patch deployed]
- Communication: [describe individual notifications planned]

If notification is delayed beyond 72 hours, reasons for delay:
[Explain if applicable; otherwise state "Notification provided within 72-hour window"]`;
  }

  private buildSECDraftNotice(incident: IncidentInput, materiality: MaterialityAssessment): string {
    return `FORM 8-K — CURRENT REPORT
Item 1.05. Material Cybersecurity Incidents

[DATE]

On [DISCOVERY DATE], Datacendia, LLC determined that a material cybersecurity incident had occurred.

Nature and scope of incident:
${incident.description}

Timing: Incident occurred on approximately ${incident.incidentDate.toDateString()} and was discovered on ${incident.discoveryDate.toDateString()}.

Material impact: ${materiality.materialityFactors.join('; ')}

Materiality score: ${materiality.materialityScore}/100

Status: [Describe whether incident is contained, investigation status, law enforcement notified]

The Company has engaged [cybersecurity firm] to assist with investigation. Legal counsel and insurance carrier have been notified.

The Company is unable to determine at this time whether this incident will have a material impact on financial condition or results of operations. The Company will amend this Current Report if material new information becomes available.

[FORWARD-LOOKING STATEMENT DISCLAIMER]`;
  }

  private buildNYDFSNotice(incident: IncidentInput): string {
    return `NY DFS 23 NYCRR §500.17 Notification

To: New York Department of Financial Services
Via: https://myportal.dfs.ny.gov
Date: ${new Date().toDateString()}

Reporting Entity: Datacendia, LLC
DFS License/Registration: [N/A or number]
Contact: privacy@datacendia.com

Event Type: [Cybersecurity Event / Ransomware / Unauthorised Access / Data Breach]
Date of Event: ${incident.incidentDate.toDateString()}
Date of Discovery: ${incident.discoveryDate.toDateString()}

Systems/Data Affected:
${incident.dataCategories.join(', ')}

Number of Affected Customers: ${incident.estimatedAffected.toLocaleString()}

Response Actions Taken:
1. [Containment measures]
2. [Evidence preservation]
3. [System remediation]
4. [Customer notification plan]

Is the incident ongoing? ${incident.containmentAchieved ? 'No — contained' : 'Yes — investigation ongoing'}

Third parties involved: [List if applicable]

This notification does not constitute a waiver of any privilege or work product protection.`;
  }

  private buildHIPAANotice(incident: IncidentInput): string {
    return `HIPAA BREACH NOTIFICATION — Individual Notice

[On letterhead]
Date: ${new Date().toDateString()}

Dear [Individual Name],

We are writing to inform you of a breach of your protected health information (PHI) that may affect you.

WHAT HAPPENED
${incident.description}
Date of breach: ${incident.incidentDate.toDateString()}
Date discovered: ${incident.discoveryDate.toDateString()}

WHAT INFORMATION WAS INVOLVED
[Describe specific PHI elements: e.g., names, dates of birth, medical record numbers, diagnosis information]

WHAT WE ARE DOING
We have taken the following steps to address this breach:
[List remediation actions]
We have reported this breach to the U.S. Department of Health and Human Services as required by HIPAA.

WHAT YOU CAN DO
- Place a fraud alert on your credit file by contacting Equifax, Experian, or TransUnion
- Review your explanation of benefits statements
- Contact us if you have questions

FOR MORE INFORMATION
Call: 1-800-XXX-XXXX (toll-free)
Email: privacy@datacendia.com
Website: https://app.datacendia.com/privacy

We apologise for any inconvenience this has caused.

Sincerely,
[Name, Title]
Datacendia, LLC`;
  }

  private buildFTCHBNRNotice(incident: IncidentInput): string {
    return `FTC Health Breach Notification Rule — Consumer Notice

[On company letterhead]

NOTICE OF DATA BREACH — HEALTH INFORMATION

Date: ${new Date().toDateString()}

Dear [Consumer],

We are writing to notify you that Datacendia experienced a security incident affecting health information associated with your account.

What happened: ${incident.description}
When it happened: ${incident.incidentDate.toDateString()}
When we found out: ${incident.discoveryDate.toDateString()}

Types of health information involved: [List specific health data categories]

What we are doing:
[Describe remediation and security improvements]

What you can do:
[Protective steps: change passwords, monitor accounts, etc.]

Contact us:
Email: privacy@datacendia.com
Address: [Physical address]
Phone: 1-800-XXX-XXXX

This notice is provided pursuant to the FTC Health Breach Notification Rule (16 CFR Part 318).`;
  }

  private buildGenericNotice(incident: IncidentInput, regulator: string, statute: string): string {
    return `Data Breach Notification to ${regulator}
Pursuant to ${statute}

Organisation: Datacendia, LLC | Contact: privacy@datacendia.com
Notification Date: ${new Date().toISOString()}

Incident Description: ${incident.description}
Incident Date: ${incident.incidentDate.toISOString()}
Discovery Date: ${incident.discoveryDate.toISOString()}
Data Categories: ${incident.dataCategories.join(', ')}
Estimated Affected: ${incident.estimatedAffected.toLocaleString()}
Containment Achieved: ${incident.containmentAchieved ? 'Yes' : 'In progress'}

Measures taken: [Describe containment, investigation, remediation]
Measures proposed: [Describe ongoing and planned actions]

[Attach technical details as required by ${regulator}]`;
  }

  // ─── Immediate actions ────────────────────────────────────────────────────

  private buildImmediateActions(incident: IncidentInput): string[] {
    const actions = [
      'IMMEDIATE (0–1h): Assemble incident response team; activate IR policy',
      'IMMEDIATE (0–1h): Preserve all logs, evidence, and snapshots before any remediation',
      'IMMEDIATE (0–1h): Notify CEO, Engineering Lead, Legal counsel, Cyber insurance carrier',
      'WITHIN 24h: Complete initial forensic investigation to determine scope and root cause',
      'WITHIN 24h: Contain the breach (revoke compromised credentials, patch vulnerability, isolate systems)',
      'WITHIN 48h: Determine number and jurisdictions of affected data subjects',
    ];

    if (incident.dataCategories.includes('health_phi')) {
      actions.push('WITHIN 48h: Engage HIPAA counsel — BAA obligations with subprocessors may be triggered');
    }
    if (incident.isPublicCompany) {
      actions.push('WITHIN 48h: Engage securities counsel — assess SEC materiality for Form 8-K');
    }
    actions.push('WITHIN 72h: File regulatory notifications where deadlines apply (GDPR, UK GDPR, NYDFS, NDPA, NDB, PDPA SG)');
    actions.push('WITHIN 60 DAYS: Complete individual notifications (HIPAA, FTC HBNR, CCPA)');
    actions.push('POST-INCIDENT: Conduct Post-Incident Review (PIR) within 30 days; update Risk Register');

    return actions;
  }

  // ─── Communication drafts ─────────────────────────────────────────────────

  private buildCommunicationDrafts(incident: IncidentInput): {
    customerNotice: string;
    regulatorSummary: string;
    internalEscalation: string;
  } {
    return {
      customerNotice: `Subject: Important Security Notice from Datacendia

Dear [Customer Organisation],

We are writing to inform you of a security incident that may affect data processed by Datacendia on your behalf.

Incident summary: ${incident.description}
Date of incident: ${incident.incidentDate.toDateString()}
Date of discovery: ${incident.discoveryDate.toDateString()}
Status: ${incident.containmentAchieved ? 'Contained' : 'Under investigation'}

Under our Data Processing Agreement with you, we are obligated to notify you of security incidents. We are taking the following immediate steps: [ACTIONS]

We will provide a full incident report within [X] business days. Please contact privacy@datacendia.com if you have questions.

Sincerely,
Datacendia Security Team`,

      regulatorSummary: `Multi-Regulator Notification Summary
Incident ID: [INC-ID]
Datacendia, LLC | ${new Date().toDateString()}

Nature: ${incident.description}
Affected Jurisdictions: ${incident.affectedJurisdictions.join(', ')}
Data Categories: ${incident.dataCategories.join(', ')}
Estimated Affected: ${incident.estimatedAffected.toLocaleString()}
Containment: ${incident.containmentAchieved ? 'Achieved' : 'In progress'}

Notifying authorities with 72-hour deadlines: [List from notification plan]`,

      internalEscalation: `INCIDENT ESCALATION — CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGE
Severity: ${incident.severity}
To: CEO, Legal Counsel, Cyber Insurance Carrier, Board (if material)
From: Security Team

EXECUTIVE SUMMARY
${incident.description}

SCOPE: ${incident.estimatedAffected.toLocaleString()} affected | Jurisdictions: ${incident.affectedJurisdictions.join(', ')}

IMMEDIATE DECISIONS NEEDED:
1. Approve incident response budget up to $[X]
2. Authorise engagement of [forensics firm, legal counsel]
3. Approve customer communications
4. Approve regulatory notifications

SEC MATERIALITY: ${incident.isPublicCompany ? 'Under assessment — securities counsel engaged' : 'N/A (not public company)'}

NEXT BRIEFING: [TIME]`,
    };
  }
}

export const incidentMaterialityService = new IncidentMaterialityServiceImpl();
