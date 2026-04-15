# NY DFS 23 NYCRR 500 & SEC Cybersecurity Disclosure Rules
**Implementation Guide for Financial Sector Compliance**
**Document Owner:** Legal + Engineering Lead | Version: 1.0 | April 2026

---

## Part 1 — NY DFS 23 NYCRR Part 500

### Overview

- **Statute:** 23 NYCRR Part 500 (New York Codes, Rules and Regulations)
- **Enforcer:** New York Department of Financial Services (DFS)
- **Amended:** Major amendments effective November 2023 and May 2024
- **Applies to:** Covered entities (CE) — entities licensed/registered by NYDFS: banks, insurers, money transmitters, mortgage companies, premium finance agencies, virtual currency businesses
- **Applies to Datacendia as:** ICT Service Provider / Third-Party Service Provider (TPSP) to NYDFS CEs

### Applicability Matrix

| Scenario | Datacendia Role | Obligations |
|---|---|---|
| Datacendia's customer is a NYDFS-licensed bank | Third-Party Service Provider | Customer must contractually impose cybersecurity requirements on Datacendia |
| Datacendia's customer is a NY money transmitter | Third-Party Service Provider | Customer must assess Datacendia's cybersecurity annually |
| Datacendia itself obtains NYDFS license | Covered Entity | Full 500.x compliance directly |
| Datacendia has no NYDFS-regulated customers | None | No direct obligation |

**At current stage:** Datacendia is a TPSP. Obligations flow through customer contracts.

---

### TPSP Contractual Requirements (What Customers Must Impose)

Per 23 NYCRR §500.11, NYDFS CEs must require their TPSPs (Datacendia) to implement:

| Requirement | Datacendia Implementation | Evidence |
|---|---|---|
| Multi-factor authentication | TOTP MFA enforced for ADMIN/OWNER roles | MFA enforcement code in auth middleware |
| Encryption in transit | TLS 1.3; HSTS | Helmet.js + Railway SSL |
| Encryption at rest | AES-256 (Neon + S3 backups) | Neon PostgreSQL encryption docs |
| Access controls | RBAC 6 roles; tenant isolation | auth middleware; RBAC policy |
| Audit logging | 7-year retention; structured events | audit_logs table; RetentionService |
| Penetration testing | Annual (first test scheduled Q4 2026) | Scope in SOC 2 prep |
| Vulnerability management | Monthly npm audit; Dependabot | npm audit JSON evidence |
| Incident notification to CE within 72 hours | IR policy §3 — customer notification SLA | IR policy |
| Business continuity | BCP + DR documented | business-continuity-policy.md |

### NYDFS Vendor Security Addendum Template

Add to all contracts with NYDFS CE customers:

```
NYDFS CYBERSECURITY COMPLIANCE ADDENDUM

This Addendum supplements the Master Services Agreement between
[Customer] ("Covered Entity") and Datacendia, LLC ("Service Provider").

1. CYBERSECURITY PROGRAMME
Service Provider maintains a cybersecurity programme designed to protect
Covered Entity's information systems and Nonpublic Information (NPI) in
accordance with 23 NYCRR Part 500. Current certifications and controls:
- ISO 27001:2022 alignment (certification in progress, target Q1 2027)
- SOC 2 Type II (observation period begins Nov 2026, report expected Jul 2027)
- MFA enforced for all privileged access
- TLS 1.3 in transit; AES-256 at rest
- 7-year audit log retention

2. THIRD-PARTY AUDIT RIGHT
Covered Entity may, upon 30 days' written notice and at its own expense,
conduct or commission an audit of Service Provider's cybersecurity controls
relevant to services provided under the MSA. Service Provider will cooperate
and provide reasonable access to documentation.

3. INCIDENT NOTIFICATION
Service Provider will notify Covered Entity of a Cybersecurity Event affecting
Covered Entity's NPI within 72 hours of discovery. Notification will include:
type of event, systems/data affected, estimated scope, and initial response
actions taken.

4. ANNUAL ASSESSMENT
Service Provider will complete Covered Entity's vendor security questionnaire
annually upon request, using the Datacendia Supplier Security Questionnaire
as the baseline response.

5. PENETRATION TESTING
Service Provider conducts or commissions an annual penetration test of its
production environment. Results summary available to Covered Entity under NDA.

6. SUBPROCESSORS
Service Provider's subprocessors (Neon, Railway, Upstash, SendGrid, OpenAI)
are listed in the Data Processing Agreement and the Privacy Policy at
GET /api/v1/privacy/policy. Material subprocessor changes: 30-day advance notice.
```

### Annual Certification of Compliance (§500.17(b))

NYDFS CEs must certify compliance annually by **February 15**. As a TPSP:
- Provide evidence package to customers annually in January
- Include: SOC 2 report (or bridge letter), penetration test executive summary, MFA evidence, npm audit results

### Key 2023–2024 Amendment Changes

| Change | Effective | Datacendia Impact |
|---|---|---|
| New "Class A" company tier (>500 employees OR >$10M annual revenue) | Nov 2023 | Monitor — if Datacendia reaches threshold, enhanced controls required |
| CISO must report to board annually on material cybersecurity matters | Nov 2023 | For CE customers — Datacendia incident reports feed their CISO report |
| Vulnerability disclosure policy required | May 2024 | Add security.txt to datacendia.com and app.datacendia.com |
| Social engineering / phishing testing required | May 2024 | Annual phishing simulation (add to SOC 2 evidence programme) |
| Password policy: no commonly used passwords | May 2024 | Already enforced via bcrypt; add dictionary check |

### Security.txt (Required for NYDFS — Vulnerability Disclosure)

Create `c:\Users\User\Desktop\datacendia-core\public\.well-known\security.txt`:

```
Contact: mailto:security@datacendia.com
Expires: 2027-01-01T00:00:00.000Z
Acknowledgments: https://app.datacendia.com/security/hall-of-fame
Preferred-Languages: en
Canonical: https://app.datacendia.com/.well-known/security.txt
Policy: https://app.datacendia.com/security/vulnerability-disclosure-policy
```

---

## Part 2 — SEC Cybersecurity Disclosure Rules (2023)

### Overview

- **Rule:** 17 CFR §229.106 (Regulation S-K, Item 106) + Form 8-K Item 1.05
- **Effective:** December 18, 2023 (large accelerated filers); June 15, 2024 (all others)
- **Enforcer:** Securities and Exchange Commission (SEC)
- **Applies to:** All SEC-registered public companies (reporting companies)

**Datacendia current status:** Not a public company — not directly subject. However:
- **Enterprise customers** who are public companies must comply
- Datacendia incidents affecting public company customers may trigger customer's Form 8-K
- Datacendia may go public in the future — implement controls now

---

### Item 1.05 — Material Cybersecurity Incident Disclosure (Form 8-K)

**Trigger:** Company determines a cybersecurity incident is "material"
**Deadline:** 4 business days from materiality determination (not discovery)
**Content required:**
- Material aspects of nature, scope, and timing of the incident
- Material impact or reasonably likely material impact on the company
- **Note:** Financial impact does not need to be disclosed if it would tip off threat actors

**Materiality standard:** Would a reasonable investor consider it important? Apply the `IncidentMaterialityService.assess()` criteria.

### Materiality Assessment Framework

```typescript
// Use IncidentMaterialityService to assess any incident
import { incidentMaterialityService } from '../services/compliance/IncidentMaterialityService';

const plan = incidentMaterialityService.assess({
  severity: 'P1_CRITICAL',
  dataCategories: ['credentials_passwords', 'personal_identifiable'],
  estimatedAffected: 5000,
  affectedJurisdictions: ['US', 'EU', 'UK'],
  isPublicCompany: false,     // Datacendia is not yet public
  customersAreNYDFSLicensees: true,
  containmentAchieved: false,
  incidentDate: new Date('2026-04-15'),
  discoveryDate: new Date('2026-04-15'),
  description: 'Unauthorised access to production database via compromised API key',
});

// plan.isMaterialSEC.isMaterialSEC → true/false
// plan.isMaterialSEC.recommendation → specific guidance
// plan.notifications → prioritised list of all regulators to notify with deadlines
```

### Item 106 — Annual Disclosure (Form 10-K)

**Due:** With each annual report (10-K)
**Content required:**

1. **Cybersecurity Risk Management and Strategy:**
   - Processes for assessing, identifying, managing material cybersecurity risks
   - Role of third-party assessors (auditors, pen testers)
   - How cybersecurity risks are integrated into overall risk management
   - Material risks identified and how they may affect business strategy

2. **Governance:**
   - Board's role in oversight of cybersecurity risk
   - How management is informed of and monitors cybersecurity risks
   - Whether CISO or equivalent reports to board

**Template for public company customers using Datacendia:**

```
CYBERSECURITY RISK MANAGEMENT AND STRATEGY (Item 106)

We use Datacendia, LLC's AI governance platform for [describe use]. 
Datacendia is a critical IT service provider subject to our third-party 
risk management programme. We assess Datacendia's cybersecurity controls 
annually via vendor questionnaire and review of their SOC 2 report 
(available from July 2027) and ISO 27001 certification.

Material cybersecurity risks associated with our use of Datacendia include:
[list applicable risks from Datacendia Risk Register]

Datacendia is contractually obligated to notify us of material cybersecurity 
incidents within 72 hours per our Data Processing Agreement. We monitor their 
security posture via annual assessments and continuous log monitoring.
```

### Delayed Disclosure (DOJ Exception)

The SEC Rule allows delay if the Attorney General determines disclosure would pose a "substantial risk to national security or public safety." This delay is extremely rare and requires formal DOJ determination. Do not attempt to apply unilaterally.

### Customer Support — SEC Disclosure Readiness

Provide public company customers with on request:
1. Current SOC 2 bridge letter (pre-report) or Type II report when available
2. Summary of Datacendia's cybersecurity controls for 10-K Item 106 description
3. Incident notification history (if any) for the reporting period
4. Penetration test executive summary (under NDA)

---

## Combined Action Plan

| Action | Framework | Owner | Target |
|---|---|---|---|
| Create security.txt file | NYDFS 500 §500.20 | Engineering | May 2026 |
| NYDFS vendor addendum in all NY financial contracts | NYDFS 500 §500.11 | Legal | Q2 2026 |
| Annual phishing simulation programme | NYDFS 500 (2024 amendment) | Engineering | Q3 2026 |
| Incident materiality assessment process in IR policy | SEC Rule / NYDFS | Legal | Q2 2026 |
| Annual evidence package for NYDFS CE customers (Jan) | NYDFS 500 §500.17 | Engineering | Jan 2027 |
| SEC Item 106 description template for customers | SEC Rule | Legal | Q3 2026 |
| Dictionary check for common passwords | NYDFS 500 (2024) | Engineering | Q2 2026 |
