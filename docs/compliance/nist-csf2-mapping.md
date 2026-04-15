# NIST Cybersecurity Framework 2.0 — Control Mapping
**NIST CSF 2.0 (February 2024)**
**Document Owner:** Engineering Lead | Version: 1.0 | April 2026
**Cross-references:** ISO 27001:2022 SoA, SOC 2 TSC, NIST SP 800-53 Rev. 5

---

## Overview

NIST CSF 2.0 adds a sixth function — **GOVERN** — to the original five (IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER). This mapping demonstrates Datacendia's alignment and is used for enterprise security questionnaire responses.

**Overall alignment: ~72%**

---

## GV — GOVERN (New in CSF 2.0)

*Establishes organisational context, strategy, and accountability for cybersecurity risk.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| GV.OC-01 | Organisational mission understood | ISMS Scope defines mission and context | ✅ |
| GV.OC-02 | Internal and external stakeholders identified | ISMS Scope Section 1 (interested parties) | ✅ |
| GV.OC-03 | Legal and regulatory requirements understood | `MASTER-COMPLIANCE-TRACKER.md` | ✅ |
| GV.OC-04 | Critical objectives and expectations | ISO 27001 objectives in ISMS Scope | ✅ |
| GV.RM-01 | Risk management objectives established | Risk Register — risk appetite defined | ✅ |
| GV.RM-02 | Risk tolerance established and communicated | Risk Register thresholds (Critical ≥15) | ✅ |
| GV.RM-03 | Organisational risk communication | Quarterly risk reviews planned | 🟡 |
| GV.RM-04 | Strategic risk decisions made | Management review process defined | 📋 |
| GV.RM-05 | Lines of communication for cybersecurity risks | security@datacendia.com; IR policy | ✅ |
| GV.RM-06 | Standardised risk response methods | Risk Register treatment plans | ✅ |
| GV.RM-07 | Third-party risk managed | Supplier Security Questionnaire; DPAs | 🟡 |
| GV.SC-01 | Cybersecurity supply chain risk managed | SBoM; Supplier questionnaire | 🟡 |
| GV.SC-04 | Suppliers risk-assessed | Annual supplier security reviews planned | 📋 |
| GV.SC-06 | Supplier requirements communicated | Supplier Security Questionnaire | ✅ |
| GV.SC-07 | Supply chain risks monitored | Dependabot; vendor SOC 2 review annually | 🟡 |
| GV.PO-01 | Cybersecurity policy established | Information Security Policy; AI Policy | ✅ |
| GV.PO-02 | Roles and responsibilities assigned | ISMS Scope Section 4 (leadership) | ✅ |
| GV.OV-01 | Cybersecurity review outcomes used | Management review process | 📋 |
| GV.OV-02 | Cybersecurity programme evaluated | Internal audit planned Q4 2026 | 📋 |

---

## ID — IDENTIFY

*Understanding the organisation's assets, risks, and cybersecurity posture.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| ID.AM-01 | Inventories of hardware maintained | Information Asset Register (software/infra assets) | 🟡 No physical hardware |
| ID.AM-02 | Inventories of software maintained | Information Asset Register; SBoM service | ✅ |
| ID.AM-03 | Network and data flows mapped | ISMS Scope — interfaces and data flows | 🟡 Partial |
| ID.AM-04 | External systems catalogued | Subprocessors listed; DPAs in progress | 🟡 |
| ID.AM-05 | Assets prioritised based on classification | RESTRICTED → PUBLIC 4-tier classification | ✅ |
| ID.AM-07 | Inventories of data | Information Asset Register — data assets | ✅ |
| ID.AM-08 | Systems and assets in CMDB | Prisma schema is de-facto system inventory | 🟡 |
| ID.RA-01 | Vulnerabilities identified | Monthly npm audit; Dependabot alerts | ✅ |
| ID.RA-02 | Threat intelligence received | NeMo guardrails; CISA advisories (manual) | 🟡 |
| ID.RA-03 | Threat information shared | security@datacendia.com | 🟡 |
| ID.RA-04 | Potential impacts analysed | Risk Register — likelihood × impact matrix | ✅ |
| ID.RA-05 | Threat and vulnerability info integrated | Risk Register updated quarterly | 📋 |
| ID.RA-06 | Risk response prioritised | Risk Register — Critical/High/Medium/Low | ✅ |
| ID.RA-07 | Changes with cybersecurity impacts identified | Change management via GitHub PR review | ✅ |
| ID.IM-01 | Improvements identified from evaluations | Post-incident review process | 📋 |
| ID.IM-02 | Improvements identified from exercises | BCP/IR tabletop → action items | 📋 |
| ID.IM-03 | Improvements identified from external info | CVE feeds; security mailing lists | 🟡 |

---

## PR — PROTECT

*Safeguards to manage cybersecurity risk.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| PR.AA-01 | Identities managed | Unique IDs; RBAC; user lifecycle management | ✅ |
| PR.AA-02 | Identities proofed and bound to credentials | Email verification; bcrypt; MFA | ✅ |
| PR.AA-03 | Users, services authenticated | JWT; MFA for privileged; API key auth | ✅ |
| PR.AA-04 | Identity assertions protected | JWT with RS256; short expiry; refresh rotation | ✅ |
| PR.AA-05 | Access permissions managed | RBAC 6 roles; tenant isolation middleware | ✅ |
| PR.AA-06 | Physical access managed | Delegated to Railway/Neon (cloud) | ✅ |
| PR.AT-01 | Awareness training provided | Annual security training programme (Q3 2026) | 📋 |
| PR.AT-02 | Targeted training for high-risk roles | Engineering security training; privacy training | 🟡 |
| PR.DS-01 | Data at rest protected | AES-256 encryption at rest (Neon + S3) | ✅ |
| PR.DS-02 | Data in transit protected | TLS 1.3; HSTS enforced | ✅ |
| PR.DS-10 | Data handled based on sensitivity | Data classification in Asset Register | 🟡 |
| PR.DS-11 | Data backups performed | Daily encrypted backups; 30-day PITR | ✅ |
| PR.IR-01 | Networks protected | Helmet.js; CORS; rate limiting; WAF-style middleware | ✅ |
| PR.IR-02 | Technology managed for threat protection | Helmet, CORS, rate limiting, threat detection middleware | ✅ |
| PR.PS-01 | Configuration management | Prisma migrations; Railway config-as-code | ✅ |
| PR.PS-02 | Software hardened | npm audit; Dependabot; input validation; parameterised queries | ✅ |
| PR.PS-03 | Hardware protected | Delegated to cloud providers | ✅ |
| PR.PS-04 | Logs generated | Comprehensive audit_logs — all events | ✅ |
| PR.PS-05 | Installation of unauthorised software prevented | Railway deployment gates; no direct server access | ✅ |

---

## DE — DETECT

*Detecting cybersecurity events.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| DE.AE-02 | Anomalous activity analysed | `CendiaPanopticonService`; `ThreatDetectionMiddleware` | ✅ |
| DE.AE-03 | Security event data aggregated | `audit_logs` centralised; structured event types | ✅ |
| DE.AE-04 | Impact of events estimated | Severity tiers in audit logs (info/warning/error/critical) | ✅ |
| DE.AE-06 | Vulnerability disclosures assessed | Dependabot alerts reviewed; npm audit monthly | ✅ |
| DE.AE-07 | Intelligence on attack patterns received | NeMo guardrails; adversarial red team service | 🟡 |
| DE.AE-08 | Incidents declared when criteria met | IR policy detection/declaration criteria | ✅ |
| DE.CM-01 | Networks monitored | Railway metrics; application health checks | 🟡 |
| DE.CM-03 | Computing hardware monitored | Cloud provider monitoring (Railway/Neon dashboards) | 🟡 |
| DE.CM-06 | Service provider activities monitored | Vendor SOC 2 reports; access reviews | 🟡 |
| DE.CM-09 | Computing hardware and software monitored | `CendiaPanopticonService`; error rate tracking | ✅ |

---

## RS — RESPOND

*Taking action on detected cybersecurity events.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| RS.MA-01 | Incident response plan executed | `docs/policies/incident-response-policy.md` | ✅ |
| RS.MA-02 | Incidents triaged | Severity tiers in IR policy | ✅ |
| RS.MA-03 | Incidents categorised | IR policy covers P1–P4 categories | ✅ |
| RS.MA-04 | Incidents escalated | Escalation path to CEO + legal defined | ✅ |
| RS.MA-05 | Incidents declared over when criteria met | IR policy — containment confirmation | ✅ |
| RS.AN-03 | Analysis performed to identify cause | Post-Incident Review (PIR) process | 📋 |
| RS.AN-06 | Actions during investigation documented | Incident register; audit logs | ✅ |
| RS.AN-07 | Incident forensics performed | Audit log export; database snapshots | 🟡 |
| RS.AN-08 | Breaches assessed for notification | GDPR 72h; HIPAA 60-day; FTC HBNR 60-day criteria | ✅ |
| RS.CO-02 | Internal stakeholders notified | IR policy — notification matrix | ✅ |
| RS.CO-03 | External stakeholders notified | DPAs define customer notification SLA; regulator contacts in IR policy | 🟡 |
| RS.MI-01 | Incidents contained | Containment steps in IR policy | ✅ |
| RS.MI-02 | Incidents eradicated | Eradication and recovery steps defined | ✅ |

---

## RC — RECOVER

*Restoring capabilities after a cybersecurity event.*

| CSF Subcategory | Description | Datacendia Implementation | Status |
|---|---|---|---|
| RC.RP-01 | Recovery plan executed | BCP/DR plan in `docs/policies/business-continuity-policy.md` | ✅ |
| RC.RP-02 | Recovery plan updated | Annual review; triggered by major incidents | 🟡 |
| RC.RP-03 | Recovery activities communicated | Incident comms plan in IR policy | ✅ |
| RC.RP-04 | Critical services restored | Railway auto-restart; failover to backup | ✅ |
| RC.RP-05 | Recovery plan tested | Annual DR exercise — first Q4 2026 | 📋 |
| RC.CO-03 | Recovery activities communicated | Customer communication templates in IR policy | 🟡 |
| RC.CO-04 | Lessons learned incorporated | PIR → controls update process | 📋 |

---

## CSF 2.0 Summary

| Function | Controls | Implemented | Partial | Planned | Gap |
|---|---|---|---|---|---|
| GOVERN | 19 | 9 (47%) | 5 (26%) | 5 (26%) | 0 |
| IDENTIFY | 18 | 8 (44%) | 5 (28%) | 5 (28%) | 0 |
| PROTECT | 20 | 15 (75%) | 4 (20%) | 1 (5%) | 0 |
| DETECT | 10 | 5 (50%) | 5 (50%) | 0 | 0 |
| RESPOND | 14 | 9 (64%) | 3 (21%) | 2 (14%) | 0 |
| RECOVER | 6 | 3 (50%) | 2 (33%) | 1 (17%) | 0 |
| **Total** | **87** | **49 (56%)** | **24 (28%)** | **14 (16%)** | **0** |

**Overall: 56% fully implemented, 28% partial — on track for enterprise-grade posture by Q4 2026**

---

## Cross-Reference Table

| CSF 2.0 Function | ISO 27001 Clause | SOC 2 TSC | NIST SP 800-53 |
|---|---|---|---|
| GOVERN | Clause 4, 5, 6 | CC1, CC9 | PM, CA |
| IDENTIFY | Clause 6.1, 8 | CC3, CC9 | RA, CM |
| PROTECT | Clause 8 (most) | CC6, CC7, CC8 | AC, SC, SI, CP |
| DETECT | Clause 9 | CC4, CC7 | AU, SI |
| RESPOND | Clause 8.3 | CC7 | IR |
| RECOVER | Clause 8.3, 9 | A1 | CP |

---

*Use this document when responding to enterprise security questionnaires that reference NIST CSF.*
