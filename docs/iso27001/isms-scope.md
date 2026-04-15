# Information Security Management System (ISMS) — Scope Document
**ISO/IEC 27001:2022 — Clause 4.3**
**Document Owner:** Engineering Lead / CISO (when appointed)
**Version:** 1.0 | April 2026
**Review Cadence:** Annually or after significant organisational change

---

## 1. Organisation Context

### 1.1 Organisation Profile
**Legal Name:** Datacendia, LLC
**Jurisdiction:** Delaware, USA
**Industry:** AI Governance, Decision Intelligence, Compliance SaaS
**Customer Base:** Enterprise organisations across financial services, healthcare, legal, energy, defence, and technology sectors
**Deployment Model:** Multi-tenant SaaS (primary), with self-hosted/on-premise options

### 1.2 Internal Context
- Engineering team of fewer than 20 people (growth-stage startup)
- Remote-first workforce across US and international locations
- Single-application monolith backend (Express/Node.js) with React frontend
- Managed infrastructure via Railway (hosting), Neon (database), Upstash (Redis), SendGrid (email)
- AI inference via OpenAI API and self-hostable Ollama

### 1.3 External Context
- Customers in regulated industries including healthcare (HIPAA), finance (SOX, PCI DSS, Basel III), and EU (GDPR, EU AI Act)
- Competitive pressure to achieve ISO 27001 certification to win enterprise deals
- Growing regulatory environment around AI systems (EU AI Act 2024/1689, ISO 42001)
- Third-party dependencies include cloud providers, AI model providers, and open-source software

### 1.4 Interested Parties
| Party | Relevant Requirements |
|---|---|
| Customers | Data security, availability SLAs, audit evidence, GDPR/HIPAA compliance |
| Investors | Risk management, regulatory compliance posture |
| Employees | Secure working environment, clear security policies |
| Regulators (FTC, ICO, EU AI Office) | GDPR, EU AI Act, CCPA, HIPAA compliance |
| Cloud Subprocessors | Contractual security obligations (DPAs) |
| Auditors | Evidence of control design and effectiveness |

---

## 2. ISMS Scope Statement

> **The ISMS covers the design, development, delivery, and operation of the Datacendia AI governance and decision intelligence platform, including all information assets, systems, personnel, and processes involved in providing the platform as a cloud service to enterprise customers.**

### 2.1 In Scope

| Category | In-Scope Items |
|---|---|
| **Services** | Datacendia SaaS platform (all pillars: Guard, Ethics, Helm, Predict, Health, Flow, Agents, Lineage) |
| **Applications** | Backend API (`backend/`), Frontend (`src/`), Admin tooling |
| **Infrastructure** | Railway (application hosting), Neon (PostgreSQL), Upstash (Redis), SendGrid (email delivery) |
| **Data** | Customer organisational data, user personal data, audit logs, deliberation data, AI model outputs |
| **Locations** | Headquarters (remote-first); Railway US-West region; Neon US-East/EU regions |
| **Personnel** | All full-time employees, part-time contractors, and third-party vendors with access to production systems |
| **Processes** | Software development, deployment, incident response, access management, vendor management, customer support |

### 2.2 Out of Scope

| Exclusion | Justification |
|---|---|
| Customer on-premise deployments | Customer manages their own infrastructure; Datacendia provides software only |
| Railway, Neon, Upstash internal operations | These are subprocessors covered by their own certifications; Datacendia relies on their SOC 2 reports |
| Customer data content (what customers input) | Customers are the data controllers for their own organisational data |

---

## 3. Interfaces and Dependencies

The ISMS boundary intersects with the following external systems. Security controls at each interface are documented in the asset register.

| Interface | Direction | Data | Controls |
|---|---|---|---|
| Customer browsers / APIs | Inbound | Requests, authentication | TLS 1.3, JWT, rate limiting, WAF-equivalent middleware |
| Neon PostgreSQL | Outbound | All application data | TLS, IP allowlisting, Neon SOC 2 |
| Upstash Redis | Outbound | Sessions, rate limits, MFA state | TLS, token auth |
| SendGrid | Outbound | Transactional email | API key auth, DKIM/DMARC |
| OpenAI API | Outbound | AI inference prompts | API key auth, PII de-identification before transmission |
| GitHub (source control) | Outbound | Source code | MFA enforced, branch protection |

---

## 4. Exclusions from ISO 27001 Annex A

The following Annex A control areas are excluded from this ISMS with justification:

| Control | Exclusion Justification |
|---|---|
| A.7.1 Physical security perimeters | Datacendia is fully cloud-hosted and remote-first; no physical offices with server rooms |
| A.7.2 Physical entry controls | Same as above |
| A.7.3 Securing offices, rooms, facilities | Same as above |
| A.7.4 Physical security monitoring | Same as above |
| A.7.5–7.14 Physical and environmental controls | Same as above — delegated to Railway/Neon via their SOC 2 certifications |

All other Annex A controls are included. Controls that are partially implemented are documented in the Statement of Applicability (SoA) with implementation status and planned completion dates.

---

## 5. ISMS Leadership and Responsibility

| Role | Responsibility | Assigned To |
|---|---|---|
| **ISMS Owner** | Overall accountability for the ISMS | CEO / Founder |
| **Security Lead / Acting CISO** | Day-to-day ISMS management, control implementation | Engineering Lead |
| **Data Protection Officer (Acting)** | Privacy compliance, GDPR, HIPAA | Engineering Lead (until DPO appointed) |
| **Internal Auditor** | Annual internal audit, non-conformity tracking | External consultant or senior engineer |
| **All Employees** | Adherence to policies, incident reporting | All staff |

---

## 6. ISMS Objectives (ISO 27001:2022 Clause 6.2)

| Objective | Metric | Target | Review |
|---|---|---|---|
| No critical data breaches | Number of breaches involving customer data | 0 per year | Quarterly |
| Maintain system availability | Uptime (Railway SLA) | ≥99.9% | Monthly |
| Audit log coverage | % of privileged actions in audit_logs | 100% | Quarterly |
| Vulnerability remediation | Critical CVEs resolved within | 7 days | Monthly |
| Employee security training | % staff completed annual security training | 100% | Annually |
| Supplier review | DPAs reviewed | Annually | Annually |
| Incident response time | Time to contain confirmed incidents | <4 hours | Per incident |

---

## 7. Document Control

| Version | Date | Author | Summary |
|---|---|---|---|
| 1.0 | April 2026 | Engineering Lead | Initial ISMS Scope established |

**Approved By:** *(CEO signature required)*
**Next Review:** April 2027
