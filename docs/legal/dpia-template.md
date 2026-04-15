# Data Protection Impact Assessment (DPIA) Template
**Datacendia, LLC — GDPR Article 35 / UK GDPR Schedule 1**
**Template Version:** 1.0 | April 2026
**Also satisfies:** Quebec Law 25 (Privacy Impact Assessment) · LGPD Art. 38 (Relatório de Impacto) · India DPDP (DPIA for Significant Data Fiduciaries)

---

## Instructions

Complete one DPIA per processing activity that meets **any** of the following criteria (GDPR Art. 35(3)):
- Systematic automated processing producing legal/similarly significant effects
- Large-scale processing of special category (sensitive) data (Art. 9)
- Systematic large-scale monitoring of publicly accessible areas
- **Datacendia triggers:** Any AI deliberation used for consequential hiring/credit/insurance decisions; any processing of employee health data; any new customer integration involving biometric or health data

**Who completes this:** DPO (or nominated engineer) + system owner
**Legal review required:** Yes — DPO must sign before processing begins
**Retention:** Minimum 7 years (to match audit_logs retention)

---

## PART 1 — DPIA IDENTIFICATION

| Field | Value |
|---|---|
| **DPIA Reference** | DPIA-[YYYY]-[NNN] |
| **Processing Activity Name** | _[e.g., "AI deliberation for employment screening"]_ |
| **System / Product** | _[e.g., Datacendia Council — Hiring Agent]_ |
| **Controller** | Datacendia, LLC, 123 [Address], [City, State] |
| **DPO / Privacy Lead** | _[Name, email]_ |
| **Completion Date** | _[Date]_ |
| **Next Review Date** | _[Date — max 12 months or on material change]_ |
| **Status** | Draft / In Review / Approved / Rejected |

---

## PART 2 — DESCRIPTION OF THE PROCESSING

### 2.1 Nature of Processing

Describe what personal data is processed and how:

```
[Describe in plain language: What data is collected? How is it used? How is it stored? Who has access?]

Example:
- Job applicant CV data (name, work history, education, contact details) is submitted by our 
  enterprise customer (Controller) and processed by Datacendia (Processor) through an AI 
  deliberation system to generate structured evaluation outputs.
- No automated decision is made without human review — outputs are advisory only.
- Data is retained for [X days] and deleted on customer request.
```

### 2.2 Scope of Processing

| Parameter | Details |
|---|---|
| **Data subjects** | _[e.g., job applicants; employees; platform users]_ |
| **Categories of personal data** | _[e.g., identifiers, professional data, performance data]_ |
| **Special category data?** | ☐ Yes — Article 9 applies: _[specify]_ ☐ No |
| **Volume of data subjects** | _[e.g., up to 10,000 per customer per year]_ |
| **Geographic scope** | _[e.g., EU, UK, US]_ |
| **Frequency** | _[e.g., real-time / daily / ad-hoc]_ |
| **Retention period** | _[e.g., 90 days after deliberation completion]_ |

### 2.3 Purpose and Legal Basis

| Purpose | Legal Basis (GDPR Art. 6) | Legitimate Interest Assessment Needed? |
|---|---|---|
| _[Primary purpose]_ | _[e.g., Art. 6(1)(f) legitimate interests / Art. 6(1)(b) contract]_ | _[Y/N]_ |
| _[Secondary purpose]_ | _[e.g., Art. 6(1)(c) legal obligation]_ | _[Y/N]_ |

### 2.4 Data Flows

```
[Describe the data flow — where data comes from, where it goes, and who touches it]

Example data flow:
Customer uploads CV → Datacendia API (encrypted in transit, TLS 1.3) →
  Prisma ORM → Neon PostgreSQL (encrypted at rest, AES-256) →
  AI inference via OpenAI API (no retention per BAA/DPA) →
  Deliberation result returned to customer → Deleted after [X days]

Third parties involved:
- Neon (database, DPA signed, EU SCCs)
- OpenAI (AI inference, DPA signed, no training on customer data)
- Railway (hosting, DPA in review)
```

---

## PART 3 — NECESSITY AND PROPORTIONALITY

### 3.1 Necessity Assessment

> Is the processing necessary to achieve the stated purpose? Could a less intrusive method achieve the same result?

| Question | Answer |
|---|---|
| Is processing limited to what is necessary (data minimisation)? | _[Yes/No — explain]_ |
| Is the retention period the shortest possible? | _[Yes/No — explain]_ |
| Could anonymised or pseudonymised data achieve the purpose? | _[Yes/No — explain]_ |
| Is collection of special category data strictly necessary? | _[Yes/No/N-A — explain]_ |

### 3.2 Proportionality

```
[Explain why the processing is proportionate to the purpose — i.e., the benefits outweigh 
the risks to data subjects' rights and freedoms]
```

---

## PART 4 — RISK ASSESSMENT

### 4.1 Risk Identification

Identify risks to data subjects' rights and freedoms:

| # | Risk | Likelihood (1–5) | Impact (1–5) | Risk Score | Pre-mitigation |
|---|---|---|---|---|---|
| R1 | Unauthorised access to personal data (data breach) | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R2 | Inaccurate AI output leading to unfair decision | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R3 | Algorithmic bias causing indirect discrimination | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R4 | Data processed beyond stated purpose (function creep) | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R5 | Cross-border transfer to inadequate country | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R6 | Excessive retention / failure to delete | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |
| R7 | _[Custom risk]_ | _[ ]_ | _[ ]_ | _[ ]_ | _[ ]_ |

**Scoring:** 1 = Very Low, 5 = Very High. Risk Score = Likelihood × Impact. Scores ≥ 12 require mandatory DPO escalation.

### 4.2 Mitigation Measures

| Risk Ref | Mitigation Measure | Owner | Implementation Date | Post-mitigation Score |
|---|---|---|---|---|
| R1 | TLS 1.3 transit; AES-256 at rest; audit logging; RBAC; MFA | Engineering | Done | _[ ]_ |
| R2 | Human review required for all consequential decisions; appeal endpoint available | Engineering | Done | _[ ]_ |
| R3 | Bias testing before deployment; annual bias audit (NYC LL 144); AI impact assessment | Engineering | Q3 2026 | _[ ]_ |
| R4 | Data minimisation in Prisma queries; retention policy enforced by RetentionService | Engineering | Done | _[ ]_ |
| R5 | EU SCCs with Neon, OpenAI; no transfer to non-adequate countries without SCCs | Legal | Q2 2026 | _[ ]_ |
| R6 | Automated deletion via `RetentionService.ts`; 30-day erasure SLA | Engineering | Done | _[ ]_ |

### 4.3 Residual Risk Assessment

After mitigations, rate the overall residual risk:

- ☐ **Low** — DPIA signed and processing may proceed
- ☐ **Medium** — DPO approval required before processing begins; monitor closely
- ☐ **High** — Mandatory DPO consultation AND supervisory authority prior consultation (Art. 36)

---

## PART 5 — DATA SUBJECT RIGHTS COMPLIANCE

| Right | How Exercised | System Support |
|---|---|---|
| Access (Art. 15) | `GET /api/v1/privacy/access` | ✅ Automated |
| Rectification (Art. 16) | `PATCH /api/v1/privacy/rectify` | ✅ Automated |
| Erasure (Art. 17) | `DELETE /api/v1/privacy/erasure` | ✅ Automated |
| Restriction (Art. 18) | `POST /api/v1/privacy/restrict` | ✅ Automated |
| Portability (Art. 20) | `GET /api/v1/privacy/export` | ✅ Automated |
| Object to automated decision (Art. 22) | `POST /api/v1/privacy/appeal-ai-decision` | ✅ Automated |
| Withdraw consent | Per processing activity UI | ☐ Pending |

---

## PART 6 — CONSULTATION

### 6.1 Processor / Subprocessor Consultation

| Subprocessor | DPA Signed? | DPIA-relevant provision | Risk contribution |
|---|---|---|---|
| Neon (DB) | _[Y/N]_ | Encrypted storage; EU region; PITR | Low |
| OpenAI (AI) | _[Y/N]_ | No training on customer data; 30-day retention | Medium |
| Railway (hosting) | _[Y/N]_ | SOC 2 Type II; no data access | Low |

### 6.2 DPO Opinion

```
[DPO records their opinion here — whether processing can proceed, any conditions, 
or recommendations]
```

**DPO Opinion Date:** _____________
**DPO Name / Signature:** _____________
**Opinion:** ☐ Proceed ☐ Proceed with conditions ☐ Do not proceed

### 6.3 Supervisory Authority Prior Consultation (Art. 36)

> Required only if residual risk remains HIGH after all mitigations

☐ Not required (residual risk is Low or Medium)
☐ Required — submission to [lead supervisory authority] on [date]

---

## PART 7 — APPROVAL AND REVIEW

### 7.1 Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| System Owner | _____________ | _____________ | _____________ |
| DPO | _____________ | _____________ | _____________ |
| Legal Counsel | _____________ | _____________ | _____________ |
| CEO (high-risk only) | _____________ | _____________ | _____________ |

### 7.2 Review Triggers

This DPIA must be reviewed if any of the following occur before the scheduled review date:
- New data types are added to the processing activity
- AI model is changed or retrained on new data
- New subprocessor involved
- Regulatory change affecting the processing
- Privacy incident involving this processing activity
- Customer complaint about this processing

### 7.3 Version History

| Version | Date | Author | Change Summary |
|---|---|---|---|
| 1.0 | _[Date]_ | _[Author]_ | Initial DPIA |
| | | | |

---

## ANNEX A — Datacendia Standard Technical Measures (Pre-filled)

These measures are already implemented and apply to all processing activities on the Datacendia platform:

| Control | Implementation | Evidence |
|---|---|---|
| Encryption in transit | TLS 1.3, enforced | Railway SSL termination + HSTS |
| Encryption at rest | AES-256 | Neon PostgreSQL encryption |
| Access control | 6-role RBAC (VIEWER → SUPER_ADMIN) | `auth.middleware.ts` |
| MFA | TOTP for ADMIN/OWNER | `mfa.service.ts` |
| Audit logging | All data access logged; 7-year retention | `audit_logs` table |
| Automated deletion | Per retention schedule | `RetentionService.ts` |
| Breach detection | `threatDetectionMiddleware`; IR policy | `index.ts` |
| Data minimisation | Prisma `select` on all queries | Code review process |
| Pseudonymisation | User IDs are UUIDs (not PII) | Prisma schema |
| Backup | Daily encrypted PITR; 30-day recovery | Neon PITR |

---

*File as: `docs/legal/dpias/DPIA-[YYYY]-[NNN]-[processing-activity-name].md`*
*Retain for 7 years from last processing date.*
