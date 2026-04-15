# CSA STAR — Consensus Assessments Initiative Questionnaire (CAIQ)
**Cloud Security Alliance STAR Level 1 (Self-Assessment)**
**CSA Cloud Controls Matrix (CCM) v4.0**
**Document Owner:** Engineering Lead | Version: 1.0 | April 2026
**Submit to:** https://cloudsecurityalliance.org/star/registry

---

## Instructions

Complete this questionnaire and submit to the CSA STAR Registry (free). This demonstrates cloud security transparency and satisfies enterprise customer due diligence requirements. Many enterprise buyers require CSA STAR alongside SOC 2.

**Submission steps:**
1. Create account at [https://cloudsecurityalliance.org](https://cloudsecurityalliance.org)
2. Navigate to STAR → STAR Registry → Submit Self-Assessment
3. Upload this completed questionnaire as the CAIQ response
4. Listing appears publicly in the CSA STAR Registry within 5 business days

---

## A — Audit Assurance & Compliance

| Question | Answer |
|---|---|
| A1.1 — Do you provide transparency into your security controls via published reports (SOC 2, ISO 27001, etc.)? | ISO 27001 certification in progress (Q4 2026 target). SOC 2 Type II observation period begins Nov 2026. |
| A1.2 — Do you undergo independent third-party assessments of your security posture? | Annual penetration testing planned. SOC 2 audit engagement Q4 2026. |
| A1.3 — Do you allow customers to audit your security controls? | Yes — upon reasonable request and NDA execution, controlled access to security documentation is provided. |
| A1.4 — Do you maintain an information security management system (ISMS)? | Yes — ISO 27001:2022-aligned ISMS, documented in full at `docs/iso27001/`. |

---

## BCR — Business Continuity Management & Operational Resilience

| Question | Answer |
|---|---|
| BCR-01 — Is a business continuity management policy established? | Yes — Business Continuity Policy in `docs/policies/business-continuity-policy.md`. |
| BCR-02 — Are BCP and DR plans tested periodically? | Annual BCP tabletop and DR test. First test scheduled Q4 2026. |
| BCR-03 — Are business continuity plans updated after significant changes? | Yes — policy mandates review after major infrastructure or organisational changes. |
| BCR-04 — Is data backed up? Backup frequency and retention? | Daily encrypted automated backups via Neon PostgreSQL. 30-day PITR. Geo-redundant S3 storage. |
| BCR-05 — Are backups tested for restoration? | Quarterly restore test. First documented test scheduled Q3 2026. |

---

## CCC — Change Control & Configuration Management

| Question | Answer |
|---|---|
| CCC-01 — Is there a change management policy? | Yes — all changes via GitHub Pull Requests with ≥1 reviewer approval required before merge to `production` branch. |
| CCC-02 — Are changes tested before production deployment? | Yes — CI pipeline runs tests; staging validation before production deploy. |
| CCC-03 — Are emergency change procedures defined? | Yes — emergency changes require post-hoc documentation within 24 hours. |
| CCC-04 — Is configuration management maintained? | Infrastructure-as-code via Railway; database schema managed via Prisma migrations in version control. |

---

## CEK — Cryptography, Encryption & Key Management

| Question | Answer |
|---|---|
| CEK-01 — Is a cryptography and key management policy defined? | Yes — covered in ISO 27001 SoA controls A.8.24 (cryptography) and A.8.25 (key management). |
| CEK-02 — Is data encrypted in transit? | Yes — TLS 1.3 enforced for all connections. HSTS enabled. |
| CEK-03 — Is data encrypted at rest? | Yes — AES-256 encryption at rest for all storage (Neon PostgreSQL, S3 backups). |
| CEK-04 — Are encryption keys managed securely? | Keys managed via Railway environment variables and Neon's managed encryption. Key rotation policy defined annually. |
| CEK-05 — Is FIPS 140-2 validated cryptography used? | No — standard Node.js crypto. FIPS validation targeted for FedRAMP preparation only. |

---

## DCS — Datacenter Security

| Question | Answer |
|---|---|
| DCS-01 — Are datacentre facilities physically secured? | Yes — delegated to Railway (application hosting) and Neon (database). Both maintain SOC 2 Type II certification covering physical security. Datacendia does not operate physical infrastructure. |
| DCS-02 — Is access to datacentre facilities restricted and monitored? | Yes — managed by Railway and Neon. Physical access controls in each vendor's SOC 2 report. |
| DCS-03 — Are environmental controls (fire, flood, power) in place? | Yes — delegated to Railway/Neon infrastructure providers. |

---

## DSP — Data Security & Privacy Lifecycle Management

| Question | Answer |
|---|---|
| DSP-01 — Is a data classification policy defined? | Yes — four tiers: RESTRICTED, CONFIDENTIAL, INTERNAL, PUBLIC. Documented in Information Asset Register. |
| DSP-02 — Is personal data identified and classified? | Yes — Information Asset Register classifies all 20 major assets. PII identified and labelled RESTRICTED. |
| DSP-03 — Is data retention and deletion policy defined? | Yes — retention policy: account data 30 days post-closure; audit logs 7 years; sessions 30 days. |
| DSP-04 — Are data subject rights implemented? | Yes — full GDPR DSR API: access, rectification, erasure, restriction, portability, objection, profiling opt-out, CCPA opt-out. |
| DSP-05 — Are DPAs in place with all subprocessors? | In progress — 5 subprocessors identified; DPA signing in progress (target May 2026). |
| DSP-06 — Is data transfer between regions secured? | Yes — TLS in transit; SCCs used for EEA→US transfers; UK IDTA pending. |
| DSP-07 — Is data minimisation practiced? | Yes — only minimum necessary data collected per service purpose. Privacy-by-design approach. |
| DSP-08 — Is a privacy impact assessment process defined? | Yes — DPIA/PIA process defined in ISO 42001 AI Policy and ISMS documentation. |

---

## GRC — Governance, Risk & Compliance

| Question | Answer |
|---|---|
| GRC-01 — Is there a documented information security policy? | Yes — `docs/policies/information-security-policy.md`. |
| GRC-02 — Is the security policy reviewed at least annually? | Yes — annual review cycle mandated. |
| GRC-03 — Is a risk management programme in place? | Yes — ISO 27001-aligned risk register with 30 identified risks, likelihood/impact scoring, treatment plans. |
| GRC-04 — Is compliance with applicable laws tracked? | Yes — `docs/compliance/MASTER-COMPLIANCE-TRACKER.md` tracks 9 regulatory frameworks. |
| GRC-05 — Are employees trained on security policies? | Annual security awareness training programme (first cycle planned Q3 2026). |

---

## HRS — Human Resources Security

| Question | Answer |
|---|---|
| HRS-01 — Are background checks conducted for employees? | Pre-employment screening conducted for employees with privileged system access. |
| HRS-02 — Are NDAs signed by employees? | Yes — NDAs required as part of employment contracts. |
| HRS-03 — Are security responsibilities included in job descriptions? | Yes — security responsibilities documented in role descriptions for engineering staff. |
| HRS-04 — Is there a security awareness training programme? | Annual programme. First delivery scheduled Q3 2026. |
| HRS-05 — Is there a formal offboarding procedure? | Yes — offboarding checklist: account deactivation within 24h; API key revocation; access removal. |

---

## IAM — Identity & Access Management

| Question | Answer |
|---|---|
| IAM-01 — Is there an identity management policy? | Yes — Access Control Policy; RBAC with 6 roles (VIEWER, ANALYST, MANAGER, ADMIN, SUPER_ADMIN, OWNER). |
| IAM-02 — Is multi-factor authentication (MFA) required? | Yes — TOTP-based MFA enforced for all ADMIN and OWNER roles. |
| IAM-03 — Is least privilege access enforced? | Yes — RBAC with tenant isolation middleware; no cross-tenant access possible. |
| IAM-04 — Are access reviews conducted periodically? | Quarterly access reviews (first scheduled Q3 2026; SOC 2 evidence collection from Q4 2026). |
| IAM-05 — Is privileged access managed separately? | Yes — SUPER_ADMIN and OWNER roles require MFA; logged at higher severity in audit logs. |
| IAM-06 — Are service accounts managed and monitored? | Yes — API keys with scope, expiry, and revocation. Listed in Information Asset Register. |
| IAM-07 — Is user access reviewed after role changes? | Yes — role changes trigger audit log entry; quarterly reviews validate current access. |
| IAM-08 — Is account lockout policy implemented? | Yes — 10 failed attempts triggers lockout. Configurable per organisation. |

---

## IPY — Interoperability & Portability

| Question | Answer |
|---|---|
| IPY-01 — Do you support data portability for customers? | Yes — `GET /api/v1/privacy/export` (user data), `GET /api/v1/privacy/org-export` (full org data per EU Data Act Art. 23). |
| IPY-02 — Is data exportable in standard formats? | Yes — JSON export. CSV for structured data. |
| IPY-03 — Do you support migration to other providers? | Yes — Data Act Art. 23 compliant export. No lock-in by design. |

---

## IVS — Infrastructure & Virtualisation Security

| Question | Answer |
|---|---|
| IVS-01 — Is network segregation implemented? | Yes — Railway provides network isolation between services. API and database on separate segments. |
| IVS-02 — Is a vulnerability management programme in place? | Yes — `npm audit` monthly; Dependabot alerts; penetration testing annually. |
| IVS-03 — Are system components hardened? | Yes — Helmet.js security headers; CORS restrictions; rate limiting; SQL injection prevention. |
| IVS-04 — Are security patches applied promptly? | Yes — dependency updates via Dependabot; critical patches within 72 hours. |

---

## LOG — Logging & Monitoring

| Question | Answer |
|---|---|
| LOG-01 — Are security events logged? | Yes — comprehensive audit_logs table capturing all authentication, authorisation, data access, and admin events. |
| LOG-02 — Are logs retained for sufficient period? | Yes — audit logs retained 7 years per GDPR Art. 17 / HIPAA §164.530(j). |
| LOG-03 — Are logs protected from tampering? | Yes — audit logs are append-only; database role restrictions prevent deletion. |
| LOG-04 — Are logs reviewed regularly? | Monthly security event review. Automated alerting via `CendiaPanopticonService`. |
| LOG-05 — Is privileged access logged? | Yes — all SUPER_ADMIN and OWNER actions logged at 'warning' severity minimum. |

---

## SEF — Security Incident Management, E-Discovery & Cloud Forensics

| Question | Answer |
|---|---|
| SEF-01 — Is there an incident response plan? | Yes — `docs/policies/incident-response-policy.md` covering detection, containment, eradication, recovery, PIR. |
| SEF-02 — Are incidents logged and tracked? | Yes — AI Incident Registry in `docs/iso42001/ai-policy.md`; general incidents in incident register. |
| SEF-03 — Is breach notification capability in place? | Yes — 72-hour GDPR/UK GDPR notification process; 60-day FTC HBNR process; customer notification SLA defined. |
| SEF-04 — Are incident response procedures tested? | Annual tabletop exercise planned. First test scheduled Q4 2026. |

---

## STA — Supply Chain Management, Transparency & Accountability

| Question | Answer |
|---|---|
| STA-01 — Are third-party security risks assessed? | Yes — Supplier Security Questionnaire for all critical subprocessors; annual review. |
| STA-02 — Are DPAs in place with all subprocessors? | In progress — all 5 DPAs targeted by May 2026. |
| STA-03 — Are subprocessor SOC 2 reports reviewed annually? | Yes — annual collection of vendor SOC 2 reports planned as part of SOC 2 Type II evidence programme. |
| STA-04 — Is a software bill of materials (SBOM) maintained? | Yes — `crucible_sbom` service tracks component inventory; Dependabot monitors for CVEs. |

---

## TVM — Threat & Vulnerability Management

| Question | Answer |
|---|---|
| TVM-01 — Is there a vulnerability management policy? | Yes — documented in ISO 27001 SoA control A.8.8. |
| TVM-02 — Are vulnerability scans conducted regularly? | Monthly `npm audit`; Dependabot; annual penetration test. |
| TVM-03 — Are identified vulnerabilities remediated promptly? | Critical: 72 hours; High: 30 days; Medium: 90 days. |
| TVM-04 — Is threat intelligence used? | Yes — NeMo guardrails evaluate adversarial patterns; threat detection middleware active. |

---

## Submission Checklist

- [ ] Create CSA account at cloudsecurityalliance.org
- [ ] Navigate to STAR Registry → Submit Self-Assessment
- [ ] Complete CAIQ online form using responses above
- [ ] Upload any supporting documents (SOC 2 report when available)
- [ ] Listing appears in CSA STAR Registry (public, searchable by enterprise buyers)
- [ ] Set calendar reminder: Update CAIQ annually
