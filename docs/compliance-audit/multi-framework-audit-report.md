# Datacendia Platform — Multi-Framework Compliance Audit Report
**Prepared by:** Cascade AI (Internal Automated Deep-Dive)
**Date:** April 15, 2026
**Scope:** Full codebase review of `backend/src/`, `backend/prisma/schema/`, and `docs/`
**Frameworks Assessed:** HIPAA, ISO 27001:2022, EU AI Act (2024/1689), ISO 42001, GDPR, FedRAMP, PCI DSS v4.0, CCPA/CPRA, NIST AI RMF, SOC 2 (reference)

---

## Executive Summary

Datacendia has a **strong security and governance foundation** with several enterprise-grade capabilities already implemented (AES-256-GCM cryptography, multi-layer defence-in-depth middleware, FHIR R4 healthcare connector, a genuine EU AI Act engine, bias detection, PII scanning, tenant isolation, and a rich 35+ framework compliance catalog). However, **significant operational and procedural gaps exist** across every regulated framework. The platform is well-positioned architecturally but needs targeted work before claiming compliance with HIPAA, ISO 27001, EU AI Act, or GDPR.

### Overall Scorecard

| Framework | Technical Readiness | Procedural Readiness | Overall | Priority |
|---|---|---|---|---|
| **SOC 2 Type I** | 85% | 70% | **78%** | ✅ Closest to ready |
| **GDPR** | 55% | 30% | **43%** | 🔴 Critical gaps |
| **EU AI Act** | 60% | 25% | **43%** | 🔴 Critical gaps |
| **ISO 27001:2022** | 50% | 20% | **35%** | 🔴 Critical gaps |
| **HIPAA** | 45% | 15% | **30%** | 🔴 Critical gaps |
| **ISO 42001** | 55% | 20% | **38%** | 🟡 Medium gaps |
| **NIST AI RMF** | 65% | 30% | **48%** | 🟡 Medium gaps |
| **CCPA/CPRA** | 40% | 15% | **28%** | 🔴 Critical gaps |
| **PCI DSS v4.0** | 30% | 10% | **20%** | 🟠 Not in scope unless payments added |
| **FedRAMP** | 45% | 5% | **25%** | 🟠 Multi-year project if pursuing |

---

## Section 1 — What's Already Strong (What You Have)

These capabilities were found in the codebase and represent genuine compliance assets:

### 1.1 Security Infrastructure
- **AES-256-GCM** encryption with PBKDF2-SHA512 (310,000 iterations), RSA-4096, HMAC-SHA512 — `SecurityHardening.ts` (`CryptoConfig`)
- **Defence-in-depth middleware** — SQL injection, XSS, CSRF, path traversal, replay attack, data exfiltration prevention — `DefenseInDepth.ts`
- **Account lockout** (10 attempts / 30 min) + **Redis-backed rate limiting** — `auth.ts`, `rateLimiter.ts`
- **MFA enforcement** for ADMIN/OWNER/SUPER_ADMIN — `auth.ts`
- **Tenant isolation** at both middleware and data layer — `tenantIsolation.ts`
- **Password complexity** (NIST SP 800-63B compliant) + bcrypt cost 12 — `auth.ts`
- **Hashed reset tokens** (SHA-256) — `auth.ts`
- **CSRF protection** — `csrf.ts`
- **Security headers** (HSTS, CSP, X-Frame-Options etc.) — `headers.ts`

### 1.2 Audit & Evidence
- **Immutable audit trail** persisted to Postgres `audit_logs` — `audit.service.ts`
- **7-year retention scheduler** — `RetentionService.ts` + `index.ts`
- **Cryptographic evidence packages** with Merkle roots — `SelfContainedEvidenceService.ts`
- **Regulators Receipt** service — `RegulatorsReceiptService.ts`
- **Evidence Vault** — `EvidenceVaultService.ts`
- **ZKP compliance proofs** — `ZKPComplianceService.ts`

### 1.3 AI Governance
- **EU AI Act Engine** implementing genuine Regulation (EU) 2024/1689 Article references — `EUAIActEngine.ts`
- **Bias detection** (NLP bias + cognitive bias mitigation) — `NLPBiasDetectionService.ts`, `CognitiveBiasMitigationService.ts`
- **Ethics service** with fairness scoring — `EthicsService.ts`
- **Adversarial red-teaming** — `AdversarialRedTeamService.ts`
- **Model registry** with lifecycle management — `ModelRegistryService.ts`
- **NeMo guardrails** integration — `NeMoGuardrailsEngine.ts`
- **Human oversight** via deliberation workflow (human-in-the-loop by design)

### 1.4 Privacy
- **PII detection** via Microsoft Presidio ML + regex fallback — `PresidioPIIService.ts`, `PIIDetector.ts`
- **Anonymous dissent** service (cryptographic anonymity) — `AnonymousDissentService.ts`
- **FHIR R4 consent management** endpoint — `fhir.ts` `/consent`
- **Cross-jurisdiction engine** for multi-country data rules — `CrossJurisdictionEngineService.ts`

### 1.5 Healthcare
- **FHIR R4 connector** with SMART on FHIR OAuth 2.0 — `FHIRConnector.ts`
- **FHIR access log** with PHI access audit trail — `fhir.ts` `/access-log`
- **Healthcare Council Modes** for clinical/regulatory decisions — `HealthcareCouncilModes.ts`

---

## Section 2 — HIPAA Deep-Dive

**Status: 🔴 NOT COMPLIANT — Healthcare customers cannot be onboarded without addressing critical gaps**

HIPAA applies to Datacendia if any customer uses the platform to process, store, or transmit Protected Health Information (PHI). Given the FHIR connector and healthcare vertical, this is likely.

### 2.1 Gaps — CRITICAL

| Gap | HIPAA Rule | Details |
|---|---|---|
| **No Business Associate Agreement (BAA) template or management system** | 45 CFR §164.308(b) | Datacendia is a Business Associate when handling PHI. Every healthcare customer MUST sign a BAA before PHI can be processed. No BAA template exists in the codebase or docs. |
| **No PHI field-level encryption in the database schema** | 45 CFR §164.312(a)(2)(iv) | The Postgres schema has no encrypted columns for PHI. FHIR resources fetched from EHRs are logged/stored without column-level encryption. |
| **No de-identification service** | 45 CFR §164.514(b) | No Safe Harbor or Expert Determination de-identification process. PHI passed to AI deliberations is not de-identified. |
| **No minimum necessary rule enforcement** | 45 CFR §164.514(d) | FHIR connector fetches `system/*.read` by default (all resources). No per-request scope minimisation. |

### 2.2 Gaps — HIGH

| Gap | HIPAA Rule | Details |
|---|---|---|
| **No Breach Notification workflow** | 45 CFR §164.400–414 | IR policy covers it manually, but no automated 60-day breach notification workflow or HHS reporting process exists |
| **No workforce security training records** | 45 CFR §164.308(a)(5) | Platform has no training record management |
| **FHIR `/health` and `/status` endpoints are public** | 45 CFR §164.312(c) | These expose service status without authentication and could reveal PHI system availability |
| **No Contingency Plan specifically for PHI** | 45 CFR §164.308(a)(7) | BCP policy exists but doesn't address PHI-specific backup, emergency access, or testing |

### 2.3 What to Build

```
Priority 1 (BLOCKER — cannot go live with healthcare customers without):
  □ BAA template document (legal — 1 day)
  □ PHI flag on FHIR resources in DB (schema change)
  □ De-identification endpoint using Safe Harbor method
  □ Scope minimisation: enforce per-request FHIR scopes

Priority 2 (Required within 30 days of BAA signing):
  □ Column-level encryption for PHI fields (AES-256 via application layer)
  □ Breach notification workflow in IR system
  □ HIPAA-specific audit log export endpoint
```

---

## Section 3 — ISO 27001:2022 Deep-Dive

**Status: 🔴 NOT CERTIFIED — Strong technical controls, but ISMS process is entirely absent**

ISO 27001 requires both technical controls (Annex A) AND an implemented Information Security Management System (ISMS) with documented processes, risk register, and management review.

### 3.1 What You Have (Annex A Controls)

| Control Area | Status | Evidence |
|---|---|---|
| A.5 Organisational controls | 🟡 Partial | Policies exist; no formal ISMS scope document |
| A.6 People controls | 🔴 Missing | No HR security, no NDA process, no onboarding/offboarding security checklist |
| A.7 Physical controls | 🔴 N/A | Cloud-hosted; Railway's ISO 27001 coverage required |
| A.8 Technological controls | 🟢 Strong | MFA, encryption, access control, logging, network security all implemented |

### 3.2 Critical ISMS Process Gaps

| Gap | ISO Clause | Priority |
|---|---|---|
| **No ISMS Scope Document** | Clause 4.3 | CRITICAL |
| **No Information Asset Inventory/Register** | A.5.9 | CRITICAL |
| **No Statement of Applicability (SoA)** | Clause 6.1.3 | CRITICAL — required for certification |
| **No formal Risk Register** | Clause 6.1.2 | CRITICAL — the DC8 section in SOC 2 System Description is a start, not sufficient |
| **No Management Review minutes** | Clause 9.3 | HIGH |
| **No Internal Audit programme** | Clause 9.2 | HIGH |
| **No Corrective Action process** | Clause 10.2 | HIGH |
| **No Supplier Security Questionnaire** | A.5.19–A.5.22 | HIGH |
| **No Vulnerability Management schedule** | A.8.8 | HIGH — `npm audit` at build time is not sufficient |
| **No Secure Development Lifecycle (SDL) documentation** | A.8.25–A.8.31 | MEDIUM |

### 3.3 What to Build

```
Phase 1 — ISMS Foundation (6 weeks):
  □ ISMS Scope Document (defines what's in/out of scope)
  □ Information Asset Register (all data assets, owners, classification)
  □ Formal Risk Register (threats, likelihood, impact, treatment)
  □ Statement of Applicability (map all 93 Annex A controls)

Phase 2 — Processes (8 weeks):
  □ Supplier Security Assessment questionnaire
  □ Internal Audit programme (quarterly)
  □ Management Review process (quarterly)
  □ Vulnerability Management process (weekly scans, monthly reports)

Phase 3 — Certification (ongoing):
  □ Engage a UKAS/IAF-accredited certification body (BSI, Bureau Veritas, etc.)
  □ Stage 1 audit (document review) → Stage 2 audit (on-site) → Certificate
```

---

## Section 4 — EU AI Act Deep-Dive

**Status: 🔴 GAPS — Strong engine for customers; Datacendia itself has unaddressed obligations as a provider**

### 4.1 What's Strong
- `EUAIActEngine.ts` implements genuine Regulation (EU) 2024/1689 Article references
- Risk classification engine (unacceptable/high/limited/minimal) with Annex III mapping
- Banking-sector AI system classification with Article 43 conformity assessment routes
- FRIA (Fundamental Rights Impact Assessment) methodology

### 4.2 Critical Gap: Datacendia as Provider

Datacendia itself is an AI system provider under the EU AI Act. If any customer in the EU uses Datacendia for decisions in **Annex III areas** (employment decisions, essential services including credit, insurance, public benefits), **Datacendia is a high-risk AI system provider** with the following obligations:

| Obligation | Article | Status |
|---|---|---|
| **Technical documentation for Datacendia itself** | Art. 11 + Annex IV | 🔴 Missing |
| **Conformity self-assessment for Datacendia as provider** | Art. 43 | 🔴 Missing |
| **EU database registration** (Art. 49) | Art. 49, 71 | 🔴 Missing |
| **Transparency obligations** — users must know they're interacting with AI | Art. 50 | 🟡 Partial (deliberation UI makes it clear, but no formal disclosure mechanism) |
| **Human oversight measures** embedded in the system | Art. 14 | 🟢 Strong — deliberation workflow is human-in-the-loop by design |
| **Logging of high-risk system operations** | Art. 12 | 🟡 Partial — audit_logs exist but not EU AI Act format |
| **Post-market monitoring** | Art. 72 | 🔴 Missing — no systematic monitoring of AI output quality/incidents |
| **GPAI model obligations** (OpenAI usage) | Chapter V, Art. 55 | 🟡 Partial — InferenceService tracks provider but no compliance documentation |

### 4.3 Prohibited Practices Check (Art. 5 — Applied 2 Feb 2025)

| Prohibited Practice | Datacendia Status |
|---|---|
| Subliminal manipulation | ✅ Not applicable |
| Exploitation of vulnerabilities | ✅ Not applicable |
| Real-time remote biometric ID in public spaces | ✅ Not applicable |
| Social scoring by public authorities | ✅ Not applicable |
| Emotion recognition in workplace/education | ⚠️ Depends on customer use case — no guardrail preventing this |

### 4.4 Key Timelines You Must Track

| Deadline | Obligation |
|---|---|
| **2 Feb 2025** ✅ Passed | Prohibited practices (Art. 5) — must not implement |
| **2 Aug 2025** ⏰ 3.5 months away | GPAI model obligations (Chapter V) — OpenAI usage compliance |
| **2 Aug 2026** | High-risk AI system obligations for Datacendia as a provider |

### 4.5 What to Build

```
Immediate (before 2 Aug 2025):
  □ GPAI model compliance documentation (OpenAI usage under Art. 55)
  □ AI system transparency disclosure mechanism (users know they're using AI)
  □ Emotion recognition guardrail (prevent prohibited use cases)

By 2 Aug 2026:
  □ Technical documentation per Annex IV for Datacendia's AI system
  □ Conformity self-assessment
  □ EU AI Act registration (if deploying to EU customers)
  □ Post-market monitoring system
  □ Incident reporting mechanism for AI-specific incidents
```

---

## Section 5 — ISO 42001 (AI Management System) Deep-Dive

**Status: 🟡 PARTIAL — Good AI governance building blocks; no formal AIMS**

ISO 42001 (published December 2023) is the AI equivalent of ISO 27001 — it requires an AI Management System (AIMS) with governance, risk management, and lifecycle controls.

### 5.1 What You Have

| ISO 42001 Control | Status | Evidence in Code |
|---|---|---|
| AI policy | 🔴 Missing | No formal AI policy document |
| AI risk assessment | 🟡 Partial | Risk matrix in SOC 2 System Description, bias detection services |
| AI impact assessment | 🟡 Partial | FRIA in EUAIActEngine, Ethics service |
| AI lifecycle management | 🟢 Strong | ModelRegistryService with status tracking |
| Bias monitoring | 🟢 Strong | NLPBiasDetectionService, CognitiveBiasMitigationService |
| Transparency | 🟢 Strong | Deliberation audit trail, agent response logging |
| Human oversight | 🟢 Strong | Human-in-the-loop deliberation design |
| AI incident management | 🔴 Missing | No AI-specific incident registry |
| Supplier AI assessment | 🔴 Missing | No assessment of OpenAI, Groq as AI suppliers |

### 5.2 Gaps

```
  □ Formal AI Policy document (1 page — what AI we use, how we govern it)
  □ AI Incident Registry (separate from general IT incidents)
  □ AI Supplier Assessment (OpenAI, Groq compliance status)
  □ AI Impact Assessment template/process
  □ AIMS scope document
```

---

## Section 6 — GDPR Deep-Dive

**Status: 🔴 SIGNIFICANT GAPS — Technical controls are good; Data Subject Rights are unimplemented**

### 6.1 Technical Controls (Article 32)

| Requirement | Status | Evidence |
|---|---|---|
| Encryption in transit | ✅ | TLS enforced by Railway/Neon |
| Encryption at rest | ✅ | Neon AES-256 storage encryption |
| Application-level field encryption (sensitive fields) | 🟡 Partial | MFA secrets encrypted; general user data not field-encrypted |
| Access control | ✅ | RBAC + MFA + tenant isolation |
| Audit logging | ✅ | audit_logs table with 7-year retention |
| Pseudonymisation | 🔴 Missing | No pseudonymisation service |
| Data minimisation | 🟡 Partial | No enforcement mechanism in API layer |

### 6.2 Data Subject Rights — ALL MISSING (Articles 15–22)

| Right | Article | Status | Impact |
|---|---|---|---|
| Right of Access (DSAR) | Art. 15 | 🔴 **No endpoint** | Must respond within 30 days |
| Right to Rectification | Art. 16 | 🟡 Partial via settings | No formal workflow |
| Right to Erasure ("Right to be Forgotten") | Art. 17 | 🔴 **No endpoint** | Must delete personal data on request |
| Right to Restriction | Art. 18 | 🔴 **No endpoint** | Must suspend processing on request |
| Right to Portability | Art. 20 | 🔴 **No endpoint** | Must export data in machine-readable format |
| Right to Object | Art. 21 | 🔴 **No mechanism** | No opt-out for profiling/analytics |
| Automated decision-making rights | Art. 22 | 🟡 Partial | Deliberation is human-in-the-loop but no Art. 22 disclosure |

### 6.3 Controller Obligations

| Requirement | Status |
|---|---|
| Privacy Policy / Privacy Notice | 🔴 Missing from platform |
| Cookie consent (frontend) | 🔴 Missing |
| Record of Processing Activities (ROPA) | 🔴 Missing |
| Data Protection Impact Assessment (DPIA) | 🔴 Missing |
| DPA with Neon, Railway, SendGrid, etc. | 🔴 Not confirmed signed |
| Data breach notification automation (72 hours) | 🔴 Manual only |
| Legal basis documentation | 🔴 Not documented |

### 6.4 What to Build — Priority Order

```
Priority 1 — Legal Blockers (cannot lawfully process EU personal data without):
  □ Privacy Policy / Privacy Notice accessible from login page
  □ Record of Processing Activities (ROPA) document
  □ DPAs signed with all subprocessors (Neon, Railway, SendGrid, Upstash)
  □ Legal basis documented for each processing activity

Priority 2 — Data Subject Rights API endpoints:
  □ GET /api/v1/privacy/export — personal data export (portability, Art. 20)
  □ DELETE /api/v1/privacy/erasure — right to erasure (Art. 17)
  □ GET /api/v1/privacy/access — DSAR response (Art. 15)
  □ POST /api/v1/privacy/restriction — restrict processing (Art. 18)

Priority 3 — Governance:
  □ DPIA for healthcare vertical (mandatory for PHI processing)
  □ Cookie consent banner (frontend)
  □ 72-hour breach notification automation
```

---

## Section 7 — NIST AI RMF Deep-Dive

**Status: 🟡 GOOD ALIGNMENT — Strong technical implementation of the four functions**

The NIST AI RMF (January 2023) organises AI risk management into four functions: GOVERN, MAP, MEASURE, MANAGE.

| Function | Status | Evidence |
|---|---|---|
| **GOVERN** — Policies, accountability, culture | 🟡 Partial | Ethics policy emerging; no formal AI governance committee |
| **MAP** — Identify and categorise risks | 🟢 Strong | EUAIActEngine risk classification, bias detection, adversarial red-team |
| **MEASURE** — Analyse, assess, prioritise risks | 🟢 Strong | EthicsService fairness scoring, PII evaluation metrics, trust scores |
| **MANAGE** — Prioritise and implement risk responses | 🟡 Partial | Guardrails (NeMo), human oversight (deliberation), ComplianceGuard |

### Gaps
```
  □ AI Governance Committee / designated AI Risk Owner (GOVERN 1.1)
  □ AI Risk Management Policy document (GOVERN 2.1)
  □ AI incident log separate from IT incidents (MANAGE 4.1)
  □ Regular AI RMF review cadence documented
```

---

## Section 8 — CCPA/CPRA Deep-Dive

**Status: 🔴 NOT COMPLIANT for California-based users**

| Requirement | Status |
|---|---|
| Privacy Notice for California Residents | 🔴 Missing |
| "Do Not Sell or Share My Personal Information" link | 🔴 Missing |
| Consumer Request Portal (opt-out, access, deletion) | 🔴 Missing |
| Data retention schedule disclosed | 🔴 Missing |
| Sensitive Personal Information opt-out | 🔴 Missing |
| Annual employee training on CCPA | 🔴 Missing |

CCPA overlaps heavily with GDPR Data Subject Rights — implementing the GDPR rights endpoints above will cover ~80% of CCPA requirements simultaneously.

---

## Section 9 — PCI DSS v4.0

**Status: 🟠 NOT APPLICABLE unless Datacendia processes payment card data**

Datacendia does not currently process cardholder data directly. The financial vertical (`financial.ts`, Basel III engine) does analytics but not payment processing.

**If payment features are added:** PCI DSS scope would apply. Current gaps would include:
- No CDE (Cardholder Data Environment) segmentation
- No file integrity monitoring
- No quarterly ASV vulnerability scans
- No PCI DSS SAQ completed

**Recommendation:** Keep payment card data out of Datacendia's scope entirely. Use a PCI-compliant payment processor (Stripe, Braintree) and ensure Datacendia never touches raw PANs.

---

## Section 10 — FedRAMP

**Status: 🟠 MULTI-YEAR PROJECT — Not recommended unless US Federal customers are a near-term target**

FedRAMP is a 2–3 year certification process involving 325+ NIST 800-53 controls, continuous monitoring, and a 3PAO (Third-Party Assessment Organisation). Current state:

| FedRAMP Requirement | Status |
|---|---|
| FIPS 140-3 cryptography | ✅ Implemented |
| NIST 800-53 Rev 5 control baseline | 🟡 Partial (~40% coverage) |
| FedRAMP boundary documentation | 🔴 Missing |
| Continuous monitoring (NIST 800-137) | 🔴 Missing |
| POA&M (Plan of Action & Milestones) | 🔴 Missing |
| PIV/CAC authentication | 🔴 Missing |
| GovCloud deployment | 🔴 Not implemented |
| 3PAO assessment | 🔴 Not started |

**Recommendation:** Don't pursue FedRAMP until SOC 2 Type II is achieved, as SOC 2 controls map to ~60% of FedRAMP requirements.

---

## Section 11 — Prioritised Remediation Roadmap

### Tier 1 — Do Now (Q2 2026, blocks revenue)

| Item | Framework | Effort | Blocker? |
|---|---|---|---|
| GDPR Privacy Policy + Cookie consent | GDPR | 1 week | Blocks EU users |
| ROPA document | GDPR | 3 days | Regulatory requirement |
| DPAs with all subprocessors | GDPR, HIPAA | 1 week | Legal requirement |
| GDPR Data Subject Rights endpoints (export, erasure, access) | GDPR, CCPA | 2 weeks | Legal requirement |
| HIPAA BAA template | HIPAA | 2 days | Blocks healthcare customers |
| FHIR minimum necessary scope enforcement | HIPAA | 1 week | HIPAA §164.514(d) |
| PHI de-identification endpoint (Safe Harbor) | HIPAA | 2 weeks | Before any PHI into AI |
| EU AI Act GPAI compliance documentation | EU AI Act | 1 week | Deadline: 2 Aug 2025 |
| AI transparency disclosure mechanism | EU AI Act | 3 days | Art. 50 |

### Tier 2 — Q3 2026 (ISO 27001 foundation)

| Item | Framework | Effort |
|---|---|---|
| ISMS Scope Document | ISO 27001 | 1 week |
| Information Asset Register | ISO 27001 | 2 weeks |
| Statement of Applicability | ISO 27001 | 2 weeks |
| Formal Risk Register | ISO 27001, ISO 42001 | 2 weeks |
| Supplier Security Questionnaire | ISO 27001 | 1 week |
| AI Policy document | ISO 42001, NIST AI RMF | 3 days |
| AI Incident Registry | ISO 42001, EU AI Act | 1 week |
| PHI field-level encryption | HIPAA | 3 weeks |
| HIPAA Breach Notification workflow | HIPAA | 1 week |

### Tier 3 — Q4 2026 (Certification pursuit)

| Item | Framework | Effort |
|---|---|---|
| ISO 27001 Internal Audit programme | ISO 27001 | Ongoing |
| ISO 27001 Stage 1 + Stage 2 audit | ISO 27001 | 3 months with auditor |
| EU AI Act Technical Documentation (Annex IV) | EU AI Act | 3 weeks |
| EU AI Act Conformity Self-Assessment | EU AI Act | 2 weeks |
| Post-market AI monitoring system | EU AI Act, ISO 42001 | 3 weeks |
| SOC 2 Type II observation period (ongoing evidence collection) | SOC 2 | 6–12 months |
| DPIA for healthcare vertical | GDPR | 2 weeks |

---

## Section 12 — Key Files to Know

| File | Compliance Relevance |
|---|---|
| `backend/src/security/SecurityHardening.ts` | FIPS 140-3, NIST 800-53, PCI DSS crypto controls |
| `backend/src/security/DefenseInDepth.ts` | NIST 800-53 SC/SI controls, ISO 27001 A.8 |
| `backend/src/security/audit.service.ts` | SOC 2 CC7.2, HIPAA audit log, ISO 27001 A.8.15 |
| `backend/src/middleware/auth.ts` | SOC 2 CC6.1, ISO 27001 A.8.5, HIPAA §164.312 |
| `backend/src/middleware/tenantIsolation.ts` | GDPR Art. 25 (data protection by design), ISO 27001 A.8.3 |
| `backend/src/services/verticals/eu-banking/EUAIActEngine.ts` | EU AI Act Reg. (EU) 2024/1689 |
| `backend/src/services/verticals/healthcare/FHIRConnector.ts` | HIPAA PHI access, FHIR R4 |
| `backend/src/services/gateway/PresidioPIIService.ts` | GDPR Art. 25, HIPAA §164.514 |
| `backend/src/services/compliance/ComplianceEnforcer.ts` | Cross-framework enforcement |
| `backend/src/services/compliance/CrossJurisdictionEngineService.ts` | Multi-jurisdiction GDPR/CCPA/PIPL |
| `backend/src/services/dcii/NLPBiasDetectionService.ts` | EU AI Act Art. 10 (data governance), ISO 42001 |
| `backend/src/services/dcii/CognitiveBiasMitigationService.ts` | NIST AI RMF MEASURE function |

---

## Appendix — Frameworks Not Yet Assessed

These frameworks were identified in `frameworks.ts` but not deeply assessed in this audit. A separate assessment is recommended if entering these markets:

| Framework | Applicable To |
|---|---|
| **DORA** (EU Digital Operational Resilience Act) | EU financial sector customers |
| **NIS2 Directive** | EU operators of essential services |
| **NERC CIP** | Energy/utility customers |
| **CMMC 2.0** | US defence contractor customers |
| **FBI CJIS** | Law enforcement customers |
| **GxP** | Pharmaceutical/clinical trial customers |
| **PIPL** | China-based customers |
| **PDPA** | Thailand/Singapore customers |
| **LGPD** | Brazil-based customers |

---

*This report reflects the state of the codebase as of April 15, 2026. It is an automated technical assessment and does not constitute legal advice. Qualified legal counsel and accredited auditors should be engaged for formal certification processes.*
