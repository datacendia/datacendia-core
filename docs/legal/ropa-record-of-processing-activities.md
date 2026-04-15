# Record of Processing Activities (ROPA)
**Article 30 GDPR / UK GDPR Schedule 1 §18 / LGPD Art. 37 / Quebec Law 25**
**Datacendia, LLC — Processor and Controller Record**
**Version:** 1.0 | April 2026 | **Owner:** DPO / Privacy Officer
**Update cadence:** On every new processing activity, subprocessor change, or system change

---

## Document Scope

This ROPA covers Datacendia's role as:
- **Data Controller** — for processing of employee/contractor data and prospective customer contact data
- **Data Processor** — for processing of customer personal data on behalf of enterprise customers (the Controllers)

Both records are required under GDPR Art. 30. As a processor serving enterprise customers, Datacendia must maintain records for all processing activities carried out on behalf of each Controller (customer).

---

## PART A — CONTROLLER RECORD (Datacendia as Controller)

### A.1 Organisation Details

| Field | Value |
|---|---|
| **Controller Name** | Datacendia, LLC |
| **Controller Address** | [Address] |
| **Controller Contact** | privacy@datacendia.com |
| **DPO** | [Name, email — to be appointed] |
| **EU Representative** | [Name / organisation if no EU establishment] |
| **Date of Last Review** | April 2026 |

---

### A.2 Processing Activities — Controller Role

#### PA-C-001 — User Account Management

| Field | Value |
|---|---|
| **Processing Activity** | Creation and management of platform user accounts |
| **Purpose** | Service delivery — authentication, authorisation, account management |
| **Legal Basis** | Art. 6(1)(b) — performance of contract |
| **Categories of Data Subjects** | Platform users (employees of enterprise customers) |
| **Categories of Personal Data** | Name, email address, hashed password, job title, organisation, MFA credential |
| **Special Category Data?** | No |
| **Recipients** | Engineering team (internal); Neon (DB processor); Railway (hosting processor) |
| **Third-Country Transfers** | US — Neon (EU SCCs); Railway (EU SCCs) |
| **Retention Period** | Duration of account + 30-day deletion grace period; audit logs 7 years |
| **Security Measures** | bcrypt passwords; MFA; RBAC; AES-256 at rest; TLS 1.3 in transit; audit logging |
| **DPIA Required?** | No — not large-scale; not special category |

---

#### PA-C-002 — Customer Contact / CRM

| Field | Value |
|---|---|
| **Processing Activity** | Management of prospective and existing customer contact information |
| **Purpose** | Sales outreach, account management, contract management |
| **Legal Basis** | Art. 6(1)(f) — legitimate interests (B2B prospecting); Art. 6(1)(b) — contract performance for existing customers |
| **Categories of Data Subjects** | B2B contacts (sales prospects, account contacts, procurement contacts) |
| **Categories of Personal Data** | Name, business email, job title, employer, phone number, LinkedIn URL |
| **Special Category Data?** | No |
| **Recipients** | Sales team; [CRM platform — add when adopted] |
| **Third-Country Transfers** | US — internal |
| **Retention Period** | Prospects: 3 years from last contact; Customers: 7 years from contract end |
| **Security Measures** | Access restricted to sales team; audit logging |
| **DPIA Required?** | No |

---

#### PA-C-003 — Employee / Contractor HR Data

| Field | Value |
|---|---|
| **Processing Activity** | HR administration for employees and contractors |
| **Purpose** | Employment administration, payroll, legal compliance |
| **Legal Basis** | Art. 6(1)(b) — employment contract; Art. 6(1)(c) — legal obligation (tax, employment law) |
| **Categories of Data Subjects** | Employees, contractors |
| **Categories of Personal Data** | Name, address, date of birth, bank details, tax number, NI/SSN, salary, performance records |
| **Special Category Data?** | Potentially — health data for sick leave; Art. 9(2)(b) applies (employment law) |
| **Recipients** | CEO; [payroll processor — add when adopted] |
| **Third-Country Transfers** | US — internal |
| **Retention Period** | 7 years post-employment (tax/employment law) |
| **Security Measures** | Restricted access; separate HR system (not platform DB) |
| **DPIA Required?** | No — small team; assess if health data volume increases |

---

#### PA-C-004 — Security Audit Logging

| Field | Value |
|---|---|
| **Processing Activity** | Recording of system access events, authentication events, data access events |
| **Purpose** | Security monitoring; breach detection; compliance evidence; forensic investigation |
| **Legal Basis** | Art. 6(1)(f) — legitimate interests (security); Art. 6(1)(c) — legal obligation (GDPR Art. 32; HIPAA; SOC 2) |
| **Categories of Data Subjects** | All platform users |
| **Categories of Personal Data** | User ID, IP address, timestamp, action taken, resource accessed |
| **Special Category Data?** | No (IDs not linked to special category attributes in logs) |
| **Recipients** | Security Lead; Engineering Lead; External auditors (SOC 2 / ISO 27001) |
| **Third-Country Transfers** | US — Neon (EU SCCs) |
| **Retention Period** | **7 years** — HIPAA, SOC 2, ISO 27001 compliance requirement |
| **Security Measures** | Append-only audit log; restricted DB access; no delete permissions granted |
| **DPIA Required?** | No — incidental personal data; security purpose; proportionate |

---

## PART B — PROCESSOR RECORD (Datacendia as Processor for Customer Controllers)

> **Note:** As a processor, Datacendia must maintain this record for **each customer Controller**. The template below represents the standard processing activities carried out on behalf of all customers. Customer-specific records should be created in `docs/legal/ropas/customer-[id]-ropa.md` where a customer's processing deviates from this standard.

### B.1 Standard Processor Processing Activities

#### PA-P-001 — AI Deliberation Processing

| Field | Value |
|---|---|
| **Processing Activity** | Processing of personal data submitted by customer for AI-assisted deliberation |
| **Controller** | Enterprise customer (named in DPA) |
| **Processor** | Datacendia, LLC |
| **Purpose** | AI-assisted decision support for customer-defined use cases (hiring, risk, policy, etc.) |
| **Legal Basis** | Processor — acts on Controller's instructions per DPA |
| **Categories of Data Subjects** | As defined by Controller — may include employees, applicants, customers, members |
| **Categories of Personal Data** | As submitted by Controller — potentially: identifiers, professional data, performance data, behavioural data |
| **Special Category Data?** | Potentially — depends on Controller's use case; PHI-gated via `phiEnforcementMiddleware` |
| **Sub-processors** | Neon (DB storage); OpenAI (AI inference); Railway (hosting) |
| **Third-Country Transfers** | US — all sub-processors; EU SCCs in place |
| **Retention Period** | Per DPA — default 90 days post deliberation; customer may configure shorter; 7 years for audit logs |
| **Security Measures** | Multi-tenant isolation (organizationId enforced); RBAC; encryption; PHI enforcement middleware; audit logging |
| **DPIA Required?** | Customer's DPIA obligation — Datacendia provides DPIA template (`docs/legal/dpia-template.md`) |

---

#### PA-P-002 — Data Subject Rights Fulfilment

| Field | Value |
|---|---|
| **Processing Activity** | Responding to data subject access/erasure/restriction/portability requests on behalf of customer Controllers |
| **Controller** | Enterprise customer |
| **Processor** | Datacendia, LLC |
| **Purpose** | Fulfilment of GDPR/UK GDPR/CCPA data subject rights within Datacendia platform |
| **Legal Basis** | Processor — legal obligation under DPA to assist Controller per GDPR Art. 28(3)(e) |
| **Categories of Personal Data** | All data held for the relevant data subject within the platform |
| **Sub-processors** | Neon (DB); Railway (hosting) |
| **Retention Period** | Request logs retained 7 years; data deleted per request |
| **Security Measures** | Authentication required; RBAC; full audit trail |

---

#### PA-P-003 — Incident / Breach Notification Support

| Field | Value |
|---|---|
| **Processing Activity** | Detection and notification of security incidents involving customer personal data |
| **Controller** | Enterprise customer |
| **Processor** | Datacendia, LLC |
| **Purpose** | GDPR Art. 33 / 34 processor obligation to notify Controller without undue delay |
| **Legal Basis** | Legal obligation per DPA; GDPR Art. 28(3)(f) |
| **Processing** | Security incident analysis; breach assessment; notification drafting |
| **Retention Period** | Incident records retained 7 years |
| **Security Measures** | IR policy v2.0; IncidentMaterialityService.ts; encrypted incident reports |

---

## PART C — SUB-PROCESSOR REGISTER

> GDPR Art. 28(2) — Processor must inform Controller of sub-processors and obtain authorisation

| Sub-processor | HQ Country | Processing | Data Transferred | Safeguard | DPA Signed | Last Review |
|---|---|---|---|---|---|---|
| **Neon, Inc.** | United States | PostgreSQL database hosting | All customer and Datacendia data | EU SCCs | 🔴 Pending | Apr 2026 |
| **OpenAI, LLC** | United States | AI model inference (GPT-4o-mini) | Deliberation input text (may contain PI) | EU SCCs; zero retention clause | 🔴 Pending | Apr 2026 |
| **Railway, Inc.** | United States | Application hosting / compute | Application traffic (encrypted) | EU SCCs | 🔴 Pending | Apr 2026 |
| **Upstash, Inc.** | United States | Redis cache (sessions, rate limits) | Session tokens (pseudonymous) | EU SCCs | 🔴 Pending | Apr 2026 |
| **SendGrid (Twilio)** | United States | Transactional email delivery | Email address, notification content | EU SCCs; DPA available | 🔴 Pending | Apr 2026 |

**Action required:** Sign DPAs with all 5 sub-processors — see `docs/legal/dpa-signing-guide.md`

---

## PART D — ROPA MAINTENANCE

### Update Triggers

This ROPA must be updated when:
- A new processing activity begins
- A new sub-processor is engaged
- An existing processing activity significantly changes
- A customer adds a new data type to their deliberation inputs
- A privacy incident reveals an unrecorded processing activity
- A regulatory change creates a new ROPA obligation

### ROPA Review Log

| Review Date | Reviewer | Changes Made |
|---|---|---|
| April 2026 | Engineering Lead | Initial ROPA created — v1.0 |
| _[Next review]_ | | |

---

*This ROPA is maintained in accordance with GDPR Art. 30. Available to supervisory authority on request.*
*Contact: privacy@datacendia.com | DPO: [to be appointed]*
