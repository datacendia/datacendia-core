# Privacy Impact Assessment (PIA) Template
**Évaluation des facteurs relatifs à la vie privée (EFVP)**
**Datacendia, LLC — Quebec Law 25 (Law 25) / Act respecting the protection of personal information in the private sector**
**Template Version:** 1.0 | April 2026

> **Cross-references:**
> - This template satisfies Quebec **Law 25 §3.3** (mandatory PIA for high-risk projects)
> - Also satisfies GDPR Art. 35 DPIA requirements (see `docs/legal/dpia-template.md` for detailed GDPR version)
> - Also satisfies **PIPEDA** reasonable purpose assessment
> - Must be completed before any **high-risk processing** involving personal information of Quebec residents

---

## When Is a PIA Required Under Law 25?

A PIA is mandatory **before** any project involving personal information that:
1. Involves communicating personal information outside Quebec (cross-border transfer)
2. Involves significant profiling or automated decision-making
3. Involves acquisition, development, or redesign of an information system or electronic service delivery
4. Is assessed as "high risk" by the Privacy Officer (CAI guidance applies)

**Datacendia default triggers:**
- Any new enterprise customer integration in Quebec
- Any change to the AI deliberation system that affects Quebec residents
- Any new subprocessor relationship involving Quebec resident data

---

## SECTION 1 — PROJECT IDENTIFICATION

| Field | Value |
|---|---|
| **PIA Reference Number** | PIA-QC-[YYYY]-[NNN] |
| **Project / Processing Activity Name** | _[e.g., "AI-Assisted Hiring Deliberation for Quebec customers"]_ |
| **Department / System** | _[e.g., Datacendia Council Module]_ |
| **Privacy Officer** | _[Name, title, email — required under Law 25 §3.1]_ |
| **Project Owner** | _[Name, title]_ |
| **Date Initiated** | _[Date]_ |
| **Expected Go-Live Date** | _[Date]_ |
| **Completion Date** | _[Date]_ |
| **Next Review Date** | _[Date — max 12 months or on material change]_ |

---

## SECTION 2 — DESCRIPTION OF PERSONAL INFORMATION INVOLVED

### 2.1 Categories of Personal Information

| Category | Specific Data Elements | Sensitivity Level |
|---|---|---|
| Identity | Name, email, user ID | Standard |
| Professional | Job title, employer, work history | Standard |
| Behavioural | Platform usage, deliberation history | Standard |
| _Special (if applicable)_ | _[Health, biometric, financial, etc.]_ | **High** |

**Does this project involve sensitive personal information?**
☐ No
☐ Yes — Category: _______________ (requires enhanced protection measures)

**Does this project involve personal information of minors?**
☐ No
☐ Yes — Age range: _______________ (parental consent required; CAI notification recommended)

### 2.2 Collection Methods

☐ Directly from the individual
☐ From a third party — Source: _______________
☐ Automated collection (logs, sensors, AI inference)
☐ Other: _______________

### 2.3 Volume

| Metric | Estimate |
|---|---|
| Number of Quebec residents affected | _[e.g., up to 5,000/year]_ |
| Data volume | _[e.g., ~500KB per data subject]_ |
| Processing frequency | _[Real-time / Daily / Monthly]_ |

---

## SECTION 3 — PURPOSE AND LEGAL BASIS

### 3.1 Purpose of Collection

```
[State clearly and specifically why personal information is collected and how it will be used]

Example:
- To process deliberation requests submitted by enterprise customers for their employees
  or job applicants, generating structured AI outputs to assist (not replace) human decisions
- To provide audit trail and compliance evidence to enterprise customers
```

### 3.2 Necessity Assessment

| Question | Response |
|---|---|
| Is collection limited to what is necessary? | _[Yes/No — explain]_ |
| Can the purpose be achieved with less personal information? | _[Yes/No — explain]_ |
| Could anonymised data be used instead? | _[Yes/No — explain]_ |

**Law 25 §5:** Personal information may only be collected in a manner that respects privacy. *Collect only what is necessary for the stated purpose.*

### 3.3 Consent (if applicable)

☐ Not required — collection from enterprise customer acting as data controller; individual consent obtained by customer per their own privacy notice
☐ Required — consent obtained via: _______________
☐ Exception applies under Law 25 §9: _______________ (document exception)

---

## SECTION 4 — PRIVACY RISKS AND MITIGATION

### 4.1 Risk Table

| Risk | Description | Likelihood (H/M/L) | Impact (H/M/L) | Mitigation |
|---|---|---|---|---|
| Unauthorised access | Data breach via API or database | M | H | TLS 1.3; AES-256; RBAC; MFA; audit logs |
| Excessive collection | More data than needed collected | L | M | Prisma `select` minimisation; schema review |
| Unlawful secondary use | Data used beyond stated purpose | L | H | Access controls; purpose binding in DPA |
| Inadequate retention | Data kept beyond necessary period | L | M | `RetentionService.ts` automated deletion |
| Cross-border transfer risk | Data transferred outside Quebec without consent/protection | M | H | EU SCCs; DPAs; see Section 5 |
| Algorithmic bias | AI produces biased outputs affecting Quebec residents | M | H | Bias testing; annual audit; appeal right |
| Data subject rights | Inability to exercise rights under Law 25 | L | M | API endpoints for all rights; 30-day SLA |

### 4.2 Privacy-by-Design Measures

Datacendia implements the following measures applicable to all Quebec resident data:

| Principle | Implementation |
|---|---|
| Data minimisation | Prisma `select` limits fields fetched; unused fields not stored |
| Purpose limitation | Contractual DPA binding; audit log purpose field |
| Storage limitation | Automated deletion per `RetentionService.ts` |
| Integrity and confidentiality | AES-256 at rest; TLS 1.3 in transit; append-only audit log |
| Accountability | DPO appointed; audit trail; DPIA/PIA documented |
| Pseudonymisation | User IDs are UUIDs; no plain PII in logs |
| Default privacy | Minimal data collected by default; opt-in for additional processing |

---

## SECTION 5 — CROSS-BORDER TRANSFER ASSESSMENT

> **Law 25 §17:** Personal information may only be communicated outside Quebec if the receiving jurisdiction provides adequate privacy protection or if specific conditions are met.

### 5.1 Transfer Inventory

| Destination Country | Recipient | Purpose | Protection Mechanism |
|---|---|---|---|
| United States | Neon (database) | Storage and processing | Contractual clauses (Law 25 §17); DPA signed |
| United States | OpenAI (AI inference) | AI model inference | Contractual clauses; no data retention by OpenAI |
| United States | Railway (hosting) | Application serving | Contractual clauses; SOC 2 Type II |
| _[Other]_ | _[Vendor]_ | _[Purpose]_ | _[Mechanism]_ |

### 5.2 Adequacy Assessment

For each non-Quebec destination:

☐ Jurisdiction provides similar protection to Law 25 (adequacy determination by Privacy Officer)
☐ Contractual clauses ensure equivalent protection
☐ Individual has explicitly consented to the specific transfer
☐ Other — specify: _______________

**Privacy Officer Conclusion on Cross-Border Transfers:**
```
[Document whether transfers are permitted and on what basis]
```

---

## SECTION 6 — INDIVIDUAL RIGHTS UNDER LAW 25

| Right | Law 25 Reference | Mechanism |
|---|---|---|
| Right of access | §27 | `GET /api/v1/privacy/access` |
| Right to rectification | §28 | `PATCH /api/v1/privacy/rectify` |
| Right to de-indexing / erasure | §28.1 | `DELETE /api/v1/privacy/erasure` |
| Right to portability (by regulation) | §27 (regulations pending) | `GET /api/v1/privacy/export` |
| Right to object to automated decisions | §12.1 | `POST /api/v1/privacy/appeal-ai-decision` |
| Right to withdraw consent | §8 | Per processing activity |

**Response time commitment:** 30 calendar days (Law 25 §30)
**Contact:** privacy@datacendia.com

---

## SECTION 7 — SECURITY MEASURES

### 7.1 Technical Measures

| Measure | Detail |
|---|---|
| Encryption in transit | TLS 1.3 |
| Encryption at rest | AES-256 (Neon PostgreSQL) |
| Access control | 6-role RBAC; least privilege |
| Authentication | bcrypt passwords + TOTP MFA (ADMIN/OWNER) |
| Audit logging | All data access; 7-year retention; append-only |
| Incident response | IR policy v2.0 — 72h notification to individuals (high-risk) |
| Subprocessor security | Annual SOC 2 review; DPAs with all subprocessors |

### 7.2 Organisational Measures

| Measure | Detail |
|---|---|
| Privacy Officer | Appointed (Law 25 §3.1) |
| Privacy policy | Published at privacy@datacendia.com / app.datacendia.com/privacy |
| Employee training | Annual security + privacy training (planned Sep 2026) |
| Privacy by design | Embedded in development process; PIA required for new features |
| Vendor management | Supplier Security Questionnaire; annual review |

---

## SECTION 8 — PRIVACY OFFICER OPINION

```
[Privacy Officer records their opinion: Can this project proceed? Are conditions required?
Are any risks unmitigated?]
```

**Privacy Officer Opinion Date:** _______________
**Privacy Officer Name:** _______________

**Decision:**
☐ **Approved** — Project may proceed as described
☐ **Approved with conditions** — Conditions: _______________
☐ **Suspended** — Additional measures required before proceeding
☐ **Rejected** — Privacy risks cannot be adequately mitigated

**If suspended or rejected, describe required actions:**
```
[Required actions before project can proceed]
```

---

## SECTION 9 — APPROVAL SIGN-OFF

| Role | Name | Signature | Date |
|---|---|---|---|
| Project Owner | _____________ | _____________ | _____________ |
| Privacy Officer | _____________ | _____________ | _____________ |
| CEO (high-risk projects) | _____________ | _____________ | _____________ |

---

## SECTION 10 — VERSION HISTORY

| Version | Date | Author | Change |
|---|---|---|---|
| 1.0 | April 2026 | Engineering Lead | Initial template |
| | | | |

---

## ANNEX A — Law 25 Compliance Summary for Datacendia

| Requirement | Law 25 Reference | Status |
|---|---|---|
| Privacy Officer appointed and published | §3.1 | 🔴 Pending — CEO to appoint |
| Privacy policy published in French | §3.2 | 🔴 Pending |
| PIA for high-risk processing | §3.3 | ✅ This template |
| Cross-border transfer assessment | §17 | ✅ Section 5 above |
| Breach notification to CAI | §3.5 (72h for serious risk) | ✅ IR policy v2.0 |
| Breach notification to individuals | §3.6 | ✅ IR policy v2.0 |
| Destruction of personal information | §23 | ✅ RetentionService.ts |
| Governance framework | §3.1 | 🟡 In progress |

**CAI (Commission d'accès à l'information) Contact:**
- Phone: 1-888-528-7741
- Website: [www.cai.gouv.qc.ca](https://www.cai.gouv.qc.ca)
- Breach notification: cai.gouv.qc.ca/en/incident-confidentiality

---

*File as: `docs/legal/pias/PIA-QC-[YYYY]-[NNN]-[project-name].md`*
*Retain for 5 years from project completion (Law 25 recommendation).*
*French translation recommended for Quebec enterprise customers.*
