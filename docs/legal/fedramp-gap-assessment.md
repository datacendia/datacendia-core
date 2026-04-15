# FedRAMP — Readiness Gap Assessment
**Federal Risk and Authorization Management Program**
**NIST SP 800-53 Rev. 5 / FedRAMP Rev. 5 Baseline**
**Document Owner:** Engineering Lead
**Version:** 1.0 | April 2026

---

## Executive Summary

FedRAMP authorisation is required to sell cloud services to US federal agencies. It is the most rigorous cloud security compliance programme in existence, typically requiring **12–24 months** and **$500K–$2M+** in preparation costs for a new entrant.

**Datacendia's current FedRAMP readiness: ~15% (Pre-Readiness)**

FedRAMP should be targeted **only when there is a specific federal agency customer opportunity** that justifies the investment. This assessment identifies what would be required.

---

## FedRAMP Impact Level Selection

| Impact Level | Description | Datacendia Applicability |
|---|---|---|
| **FedRAMP Low** | Systems where loss of CIA has limited adverse effect | Possible — if platform used for non-sensitive gov work |
| **FedRAMP Moderate** | Most federal information not classified (96% of federal systems) | **Target level** — most realistic for SaaS platform |
| **FedRAMP High** | Law enforcement, emergency services, financial systems | Out of scope currently |

**Recommended Target:** FedRAMP Moderate Baseline (325 controls from NIST SP 800-53 Rev. 5)

---

## Authorization Path Options

| Path | Description | Timeline | Cost | Recommendation |
|---|---|---|---|---|
| **Agency ATO** | One federal agency sponsors and grants ATO; others can reuse | 12–18 months | $500K–$1M | **Best for Datacendia** — when first federal customer identified |
| **JAB P-ATO** | Joint Authorization Board (DoD, DHS, GSA) reviews; broader reuse | 18–24 months | $1M–$2M+ | Long-term goal |
| **FedRAMP Ready** | Pre-authorization designation; shows readiness to agencies | 6–12 months | $200K–$500K | **First milestone** |

---

## Current Control Status vs. FedRAMP Moderate Baseline

### Controls Already Implemented (Green Zone)

| Control Family | FedRAMP Controls | Datacendia Implementation | Status |
|---|---|---|---|
| **AC — Access Control** | AC-2 (Account Management), AC-3 (Access Enforcement), AC-7 (Unsuccessful Logon Attempts), AC-17 (Remote Access) | RBAC, tenant isolation, account lockout (10 attempts), MFA, JWT | ✅ Largely compliant |
| **AU — Audit and Accountability** | AU-2 (Event Logging), AU-3 (Audit Record Content), AU-9 (Protection of Audit Information), AU-11 (Audit Record Retention) | Comprehensive audit_logs; 7-year retention; immutable records | ✅ Strong |
| **IA — Identification and Authentication** | IA-2 (Identification and Authentication), IA-5 (Authenticator Management), IA-8 (Identification and Authentication — Non-Org Users) | Unique user IDs; bcrypt cost 12; TOTP MFA; password complexity | ✅ Compliant |
| **SC — System and Communications Protection** | SC-8 (Transmission Confidentiality), SC-28 (Protection of Information at Rest) | TLS 1.3; AES-256 encryption at rest and in transit | ✅ Compliant |
| **SI — System and Information Integrity** | SI-2 (Flaw Remediation), SI-3 (Malware Protection), SI-10 (Information Input Validation) | npm audit; input validation; SQL injection protection | 🟡 Partial |
| **CP — Contingency Planning** | CP-9 (System Backup), CP-10 (System Recovery) | Daily encrypted backups; Neon PITR; BCP documented | ✅ Compliant |

### Significant Gaps (Red Zone — Must Address for FedRAMP)

| Control | Requirement | Current State | Effort |
|---|---|---|---|
| **FedRAMP Authorization Boundary** | Must precisely define and document the authorization boundary | Not defined | Medium |
| **FIPS 140-2/3 Validated Cryptography (SC-13)** | All cryptographic modules must be FIPS validated | Using standard Node.js crypto — not FIPS validated | **High** — requires AWS CloudHSM or FIPS-validated HSM |
| **Vulnerability Scanning (RA-5)** | Monthly authenticated scans; annual penetration test by 3PAO | No regular scanning; no 3PAO engagement | **High** |
| **Continuous Monitoring (CA-7)** | Monthly vulnerability scanning; monthly log reviews | No formal continuous monitoring programme | **High** |
| **Incident Response Plan (IR-8)** | FedRAMP-specific IR plan; US-CERT notification | IR policy exists but not FedRAMP-specific | Medium |
| **Configuration Management (CM-2, CM-6)** | Documented baseline configurations; hardened images | No formal baseline config documentation | Medium |
| **Supply Chain Risk Management (SR-*)** | SCRM plan; software bill of materials (SBOM) | `crucible_sbom` partially addresses; no formal SCRM plan | Medium |
| **Personnel Security (PS-*)** | Background checks; security clearance for privileged users | No background check policy | Medium |
| **Physical Protection (PE-*)** | Physical access controls to systems | Cloud-hosted — must use FedRAMP-authorised cloud provider | **Critical** |
| **FedRAMP-Authorised IaaS** | Must use FedRAMP-authorised infrastructure | Railway is NOT FedRAMP-authorised; Neon is NOT FedRAMP-authorised | **Critical** — must migrate to AWS GovCloud/Azure Government/GCP Government |
| **3PAO Assessment** | Third-Party Assessment Organisation must assess controls | No 3PAO engaged | **Critical** |
| **System Security Plan (SSP)** | 300+ page documented security plan | Not created | **High** |
| **Privacy Impact Assessment (PIA)** | Required for systems processing PII | Not completed | Medium |
| **Plan of Action and Milestones (POA&M)** | Track and remediate all deficiencies | Not created (Risk Register is not FedRAMP-compliant format) | Medium |

---

## Infrastructure Migration Requirement (Most Critical Gap)

**Railway and Neon are NOT FedRAMP-authorised.** For FedRAMP compliance, Datacendia must migrate to FedRAMP-authorised infrastructure:

| Current | FedRAMP-Authorised Alternative |
|---|---|
| Railway (hosting) | **AWS GovCloud (US)** — EC2, ECS, Fargate |
| Neon (PostgreSQL) | **AWS RDS** (FedRAMP Moderate) or **Azure Database for PostgreSQL** (FedRAMP Moderate) |
| Upstash (Redis) | **AWS ElastiCache** (FedRAMP Moderate) |
| SendGrid | **AWS SES** (FedRAMP Moderate) or **Twilio SendGrid** (FedRAMP Moderate — verify) |
| OpenAI | **Azure OpenAI** (FedRAMP Moderate — available) |

**Estimated migration effort:** 3–6 months engineering work

---

## FedRAMP Readiness Roadmap

### Phase 0 — Prerequisite (Now → First Federal Customer)
- Maintain ISO 27001 + SOC 2 Type II posture
- When federal opportunity identified, hire/contract a FedRAMP consultant
- Do NOT invest in FedRAMP infrastructure before customer commitment

### Phase 1 — FedRAMP Ready Designation (6–12 months, ~$200K)
1. Engage accredited 3PAO (A-LIGN, Coalfire, Schellman, etc.)
2. Complete FedRAMP Readiness Assessment Report (RAR)
3. Migrate to FedRAMP-authorised cloud (AWS GovCloud)
4. Implement FIPS 140-2 validated cryptography
5. Establish continuous monitoring programme
6. Submit RAR to FedRAMP PMO for "FedRAMP Ready" designation on marketplace

### Phase 2 — Agency ATO (12–18 months, ~$500K–$1M)
1. Identify agency sponsor
2. Complete System Security Plan (SSP) — 300+ pages
3. Complete 3PAO security assessment
4. Address all High findings; accept Moderate/Low with POA&M
5. Agency ATO issued
6. List on FedRAMP Marketplace

### Phase 3 — JAB P-ATO (Optional, 18–24 months, ~$1M+)
- Apply for Joint Authorization Board review for broader marketplace reuse

---

## Cost-Benefit Analysis

| Investment | Cost Estimate | Revenue Opportunity |
|---|---|---|
| FedRAMP Ready | ~$200K | Access to federal pilot conversations |
| Agency ATO | ~$500K–$1M | 1 federal agency contract typically worth $500K–$5M/year |
| JAB P-ATO | ~$1M–$2M | Entire federal civilian market; can be transformative |
| Annual maintenance | ~$200–$400K/year | Required to maintain ATO |

**Recommendation:** Defer FedRAMP investment until a federal agency expresses serious intent to purchase. The preparation effort is massive and only justified by confirmed federal revenue opportunity.

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 2026 | Engineering Lead | Initial FedRAMP gap assessment |

**Next Review:** When first federal customer conversation begins
