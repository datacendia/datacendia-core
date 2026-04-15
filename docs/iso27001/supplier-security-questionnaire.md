# Supplier Security Questionnaire
**ISO/IEC 27001:2022 — Annex A Controls A.5.19–A.5.22**
**For use with all suppliers/subprocessors that access or process Datacendia data**
**Version:** 1.0 | April 2026

---

## Instructions

This questionnaire must be completed by any supplier or subprocessor that:
- Accesses, processes, stores, or transmits Datacendia customer data or personal data, OR
- Provides infrastructure or software components critical to the Datacendia platform

Return completed questionnaire to: **security@datacendia.com**

---

## Part A — Organisation Details

| Field | Response |
|---|---|
| Organisation Name | |
| Registered Address | |
| Primary Contact (Security) | |
| Contact Email | |
| Date Completed | |
| Questionnaire Version | 1.0 |

---

## Part B — Information Security Certifications

| # | Question | Response | Evidence Required |
|---|---|---|---|
| B1 | Does your organisation hold ISO 27001:2022 certification? | Yes / No / In progress | Certificate (scope + expiry) |
| B2 | Does your organisation hold SOC 2 Type II? | Yes / No / In progress | SOC 2 report (last 12 months) |
| B3 | Does your organisation hold any other relevant certifications? | List: | Certificates |
| B4 | When was your last third-party security assessment? | Date: | Executive summary |
| B5 | Are you willing to complete a customer security assessment annually? | Yes / No | |

---

## Part C — Data Protection & Privacy

| # | Question | Response | Evidence |
|---|---|---|---|
| C1 | Is your organisation subject to GDPR? | Yes / No | |
| C2 | Do you have a documented Data Protection Policy? | Yes / No | Policy reference |
| C3 | Do you appoint a Data Protection Officer (DPO)? | Yes / No | DPO contact |
| C4 | Do you have Standard Contractual Clauses (SCCs) in place for international data transfers? | Yes / No | DPA template |
| C5 | Do you have a formal data breach notification procedure that can meet 72-hour GDPR notification? | Yes / No | Procedure summary |
| C6 | Do you maintain a Record of Processing Activities (ROPA)? | Yes / No | |
| C7 | Do you support HIPAA BAA signing if processing PHI? | Yes / No / N/A | BAA template |
| C8 | Do you de-identify personal data in test/dev environments? | Yes / No | |

---

## Part D — Access Control

| # | Question | Response |
|---|---|---|
| D1 | Do you enforce Multi-Factor Authentication (MFA) for all employees accessing production systems? | Yes / No / Partial |
| D2 | Do you follow least-privilege principles for access provisioning? | Yes / No |
| D3 | Do you conduct quarterly access reviews? | Yes / No / Annual |
| D4 | Do you have a formal offboarding process that revokes access within 24 hours? | Yes / No |
| D5 | Do you use privileged access management (PAM) for administrator accounts? | Yes / No |
| D6 | Do you allow shared/generic accounts for production access? | Yes / No (No is preferred) |

---

## Part E — Vulnerability Management

| # | Question | Response |
|---|---|---|
| E1 | Do you have a formal vulnerability management programme? | Yes / No |
| E2 | How frequently do you conduct vulnerability scans? | Weekly / Monthly / Quarterly / Ad hoc |
| E3 | What is your SLA for patching critical vulnerabilities (CVSS 9.0+)? | Days: |
| E4 | Do you conduct annual penetration testing by an independent third party? | Yes / No |
| E5 | Do you have a responsible disclosure / bug bounty programme? | Yes / No |
| E6 | Do you subscribe to CVE/NVD alerts for your technology stack? | Yes / No |

---

## Part F — Incident Response

| # | Question | Response |
|---|---|---|
| F1 | Do you have a documented Incident Response Policy? | Yes / No |
| F2 | Do you have a 24/7 security incident response capability? | Yes / No |
| F3 | What is your SLA to notify Datacendia of a security incident affecting our data? | Hours: |
| F4 | Have you had any data breaches in the last 3 years? | Yes / No |
| F5 | If yes, provide brief description and resolution | |
| F6 | Do you conduct annual incident response exercises (tabletop/live-fire)? | Yes / No |

---

## Part G — Encryption & Data Security

| # | Question | Response |
|---|---|---|
| G1 | Do you encrypt data at rest? | Yes / No — Algorithm: |
| G2 | Do you encrypt data in transit? | Yes / No — Protocol/version: |
| G3 | Do you have a key management policy including key rotation? | Yes / No |
| G4 | Do you use FIPS 140-2/3 validated cryptographic modules? | Yes / No |
| G5 | Is production data ever replicated to non-production environments? | Yes / No |

---

## Part H — Business Continuity

| # | Question | Response |
|---|---|---|
| H1 | Do you have a Business Continuity Plan (BCP)? | Yes / No |
| H2 | What is your RTO (Recovery Time Objective)? | Hours: |
| H3 | What is your RPO (Recovery Point Objective)? | Hours: |
| H4 | Do you conduct annual BCP testing? | Yes / No |
| H5 | What is your uptime SLA? | %: |
| H6 | Do you have redundant infrastructure across multiple availability zones? | Yes / No |

---

## Part I — Subcontracting

| # | Question | Response |
|---|---|---|
| I1 | Do you subcontract any services that involve access to Datacendia data? | Yes / No |
| I2 | If yes, list all sub-subprocessors and their roles | |
| I3 | Do you conduct security assessments of your own subcontractors? | Yes / No |
| I4 | Will you notify Datacendia before engaging new subcontractors? | Yes / No |

---

## Part J — Artificial Intelligence (if applicable)

| # | Question | Response |
|---|---|---|
| J1 | Do you use AI/ML models in delivering your services to Datacendia? | Yes / No |
| J2 | If yes, which models/providers? | |
| J3 | Do you have policies on AI ethics, fairness, and transparency? | Yes / No |
| J4 | Are you compliant with EU AI Act obligations applicable to your role? | Yes / No / In progress |
| J5 | Do you use customer data to train AI models? | Yes / No |

---

## Scoring & Decision

Completed questionnaires are scored by the Security Lead:

| Score | Decision |
|---|---|
| All critical controls (B, C, D, F, G) answered Yes | **Approved** — execute DPA and proceed |
| 1–2 critical gaps | **Conditional** — agree remediation timeline; DPA includes remediation clause |
| 3+ critical gaps or recent breach | **Rejected** — seek alternative supplier |

**Critical controls:** B1 or B2 (certification), C5 (breach notification), D1 (MFA), G1+G2 (encryption), F1 (IR policy)

---

## Assessment Results

| Supplier | Date | Assessor | Result | DPA Signed | Next Review |
|---|---|---|---|---|---|
| Neon | Pending | | | ❌ | 2026-07-01 |
| Railway | Pending | | | ❌ | 2026-07-01 |
| Upstash | Pending | | | ❌ | 2026-07-01 |
| SendGrid (Twilio) | Pending | | | ❌ | 2026-07-01 |
| OpenAI | Pending | | | ❌ | 2026-07-01 |
