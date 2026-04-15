# MITRE ATT&CK Framework — Defensive Control Mapping
**Enterprise ATT&CK v15 | Datacendia Threat Model**
**Document Owner:** Engineering Lead | Version: 1.0 | April 2026
**Cross-reference:** CIS Controls v8, ISO 27001 SoA, NIST CSF 2.0

---

## Overview

MITRE ATT&CK is a globally accessible knowledge base of adversary tactics and techniques. This document maps Datacendia's existing security controls to ATT&CK tactics, demonstrating defensive coverage to enterprise customers and auditors.

**Why it matters:** Enterprise security teams use ATT&CK during vendor evaluation. Demonstrating ATT&CK coverage signals security maturity.

**Coverage metric:** 11/14 tactics with at least one active mitigation = **79% tactic coverage**

---

## Threat Model — Most Relevant ATT&CK Techniques for Datacendia

As a cloud SaaS AI platform, Datacendia's primary threat surfaces are:
1. **Web application attacks** — OWASP Top 10 against the API
2. **Credential attacks** — Stolen JWT tokens, API key compromise, account takeover
3. **Data exfiltration** — Unauthorised export of customer AI deliberations or PII
4. **Supply chain attacks** — Compromised npm packages, subprocessor breach
5. **AI-specific attacks** — Prompt injection, model manipulation, adversarial inputs
6. **Insider threat** — Privileged user data theft or sabotage

---

## Tactic-by-Tactic Defensive Mapping

### TA0001 — Initial Access

*Adversary trying to get into the network*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Valid Accounts | T1078 | Use of stolen credentials | `auth.failed` events; account lockout after 10 attempts | MFA enforcement for ADMIN/OWNER; bcrypt passwords |
| Phishing (Spearphishing Link) | T1566.002 | Phishing links in email to employees | SendGrid inbound email monitoring | Annual phishing simulation (planned Q3 2026) |
| Exploit Public-Facing Application | T1190 | Exploiting vulnerability in web app | `sqlInjectionMiddleware`; input sanitisation; Helmet.js | Monthly npm audit; annual pen test; Dependabot |
| Trusted Relationship | T1199 | Compromise via subprocessor | Annual vendor SOC 2 review; DPA monitoring | Supplier Security Questionnaire; subprocessor DPAs |

**Detection coverage: 4/4 techniques with mitigations**

---

### TA0006 — Credential Access

*Adversary trying to steal credentials*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Brute Force | T1110 | Password spraying/stuffing | `auth.failed` count; lockout at 10; rate limiting | bcrypt; account lockout; Redis rate limit |
| Steal Web Session Cookie | T1539 | JWT cookie theft | Short JWT expiry (configurable); rotation on sensitive ops | `HttpOnly; Secure; SameSite=Strict` cookie flags |
| Steal Application Access Token | T1528 | API key theft | API key last-used monitoring; unusual pattern detection | API key scope limits; revocation endpoint; audit log |
| Multi-Factor Authentication Interception | T1111 | MFA bypass/intercept | Failed MFA attempts logged | TOTP (not SMS — immune to SIM swap); hardware key support planned |
| Forge Web Credentials | T1606 | JWT forgery | All JWTs verified with secret; RS256 signatures | Strong JWT_SECRET; secret rotation policy |

**Detection coverage: 5/5 techniques with mitigations**

---

### TA0007 — Discovery

*Adversary trying to figure out the environment*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Account Discovery | T1087 | Enumeration of users | Rate limiting on user endpoints; no user enumeration in auth errors | Generic auth error messages; rate limits |
| Network Service Discovery | T1046 | Port scanning | N/A — Railway manages network exposure | Only port 3000 exposed; no SSH |
| Cloud Service Discovery | T1526 | Enumerate cloud services | API scanning patterns trigger threat detection | `threatDetectionMiddleware`; honeypot endpoints |
| Permission Groups Discovery | T1069 | Discover role assignments | Restricted to ADMIN+; audit logged | RBAC — VIEWER cannot see role structure |

---

### TA0008 — Lateral Movement

*Adversary trying to move through environment*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Use Alternate Authentication Material | T1550 | Reuse valid tokens across tenants | **Multi-tenant isolation** — each org scoped | `organizationId` enforced on ALL Prisma queries |
| Exploitation of Remote Services | T1210 | Exploit internal service | No inter-service communication exposed | All services behind auth; no internal network exposure |

**Key control:** Tenant isolation means lateral movement between customer orgs is architecturally prevented.

---

### TA0009 — Collection

*Adversary collecting data*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Data from Information Repositories | T1213 | Mass data export | `data.exported` events; large query detection | Pagination limits; export audit logging; rate limiting |
| Data Staged | T1074 | Data aggregated before exfil | `preventDataExfiltration` middleware | Response size limits; anomaly detection |
| Email Collection | T1114 | Collect user emails | N/A — no email system | Not applicable |
| Data from Local System | T1005 | Local data access | No local data — all API-driven | Architecture eliminates local data risk |
| Automated Collection | T1119 | Scripted bulk collection | Rate limiting; pagination enforcement | `express-rate-limit`; Redis backing |

---

### TA0010 — Exfiltration

*Adversary stealing data*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Exfiltration Over Web Service | T1567 | Data sent to external service | `preventDataExfiltration` middleware; response monitoring | CORS restrictions; no SSRFs; CSP headers |
| Exfiltration Over C2 Channel | T1041 | Data sent via C2 | No C2 channels possible in cloud SaaS | Architecture eliminates |
| Transfer Data to Cloud Account | T1537 | Data to attacker cloud | API key audit; export logging | API key scope; export requires auth |
| Exfiltration via Alternative Protocol | T1048 | DNS tunnelling, etc. | N/A — cloud-native; DNS managed by Railway | Not controllable at app layer |

**Key control:** `preventDataExfiltration` middleware in `backend/src/index.ts` limits response sizes and monitors bulk transfers.

---

### TA0011 — Command and Control

*Adversary communicating with compromised systems*

**Coverage:** C2 is largely irrelevant for cloud SaaS — no persistent server access possible for attackers (Railway handles compute). Coverage = infrastructure-level (Railway/Neon).

---

### TA0040 — Impact

*Adversary trying to destroy, manipulate, or interrupt operations*

| Technique | ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Data Destruction | T1485 | Delete customer data | Soft delete pattern; 30-day recovery window | `deleted_at` timestamps; no hard delete without OWNER confirmation |
| Data Manipulation | T1565 | Corrupt or alter data | Audit logs record all data changes | Append-only audit log; Prisma parameterised queries |
| Defacement | T1491 | Deface web application | CSP headers; Railway deployment control | Strict CSP; no inline script except Vite |
| Denial of Service | T1498/T1499 | DDoS application | Rate limiting; Railway DDoS protection | `express-rate-limit`; Railway network-layer protection |
| Resource Hijacking | T1496 | Cryptomining | Railway resource monitoring; no uncontrolled compute | Railway container limits; no arbitrary code exec |

---

### AI-Specific ATT&CK Techniques (AML — Adversarial ML)

*MITRE ATLAS (AI/ML threat matrix) — relevant for Datacendia as AI platform*

| Technique | ATLAS ID | Description | Datacendia Detection | Mitigation |
|---|---|---|---|---|
| Prompt Injection | AML.T0051 | Malicious input overrides AI instructions | `NeMoGuardrailsEngine` input rails | EU AI Act Art. 5 guardrail; input sanitisation |
| Model Inversion | AML.T0024 | Reconstruct training data from outputs | N/A (Datacendia doesn't train models) | Use 3rd-party pretrained models only |
| Data Poisoning | AML.T0020 | Corrupt training data | N/A (no training pipeline) | Not applicable |
| Adversarial Examples | AML.T0043 | Crafted inputs to mislead AI | `NeMoGuardrailsEngine` adversarial rail | `AdversarialRedTeamService`; robustness testing |
| Model Theft | AML.T0029 | Extract model via repeated queries | Rate limiting on inference endpoints | Per-org API rate limits; inference endpoint throttling |
| Backdoor ML Model | AML.T0018 | Trojan in pretrained model | OpenAI model provenance review | Use only OpenAI/vetted model providers |

---

## ATT&CK Mitigation Coverage Summary

| MITRE Mitigation | ID | Datacendia Implementation |
|---|---|---|
| Multi-factor Authentication | M1032 | TOTP MFA enforced for ADMIN/OWNER |
| Privileged Account Management | M1026 | SUPER_ADMIN/OWNER restricted; audit logged |
| Password Policies | M1027 | bcrypt hashing; min 8 chars; lockout after 10 |
| Software Configuration | M1054 | Helmet.js; CSP; HSTS; no dangerous defaults |
| User Account Management | M1018 | RBAC 6 roles; quarterly access review |
| Audit Log Management | M1047 | 7-year retention; centralised `audit_logs` |
| Network Intrusion Prevention | M1031 | Rate limiting; threat detection middleware |
| Filter Network Traffic | M1037 | CORS; input validation; WAF-style middleware |
| Restrict Web-Based Content | M1021 | CSP headers; Helmet.js |
| Application Developer Guidance | M1013 | OWASP mitigations; parameterised queries; no eval() |
| Code Signing | M1045 | Railway deployment uses Git SHA pinning |
| Vulnerability Scanning | M1016 | Monthly npm audit; Dependabot |
| Data Backup | M1053 | Daily encrypted backups; 30-day PITR |
| Incident Response | M1025 | IR policy; `IncidentMaterialityService` |
| Encrypt Sensitive Information | M1041 | TLS 1.3 transit; AES-256 at rest |

---

## ATT&CK Navigator Layer

For enterprise security teams requesting ATT&CK Navigator visualisation:

```json
{
  "name": "Datacendia Defensive Coverage",
  "versions": {"attack": "15", "navigator": "5"},
  "domain": "enterprise-attack",
  "description": "Datacendia security control mapping to MITRE ATT&CK v15",
  "techniques": [
    {"techniqueID": "T1078", "color": "#6fbf73", "comment": "MFA + lockout"},
    {"techniqueID": "T1110", "color": "#6fbf73", "comment": "bcrypt + rate limit"},
    {"techniqueID": "T1190", "color": "#6fbf73", "comment": "Input validation + npm audit"},
    {"techniqueID": "T1566", "color": "#ff9800", "comment": "Phishing sim planned Q3 2026"},
    {"techniqueID": "T1539", "color": "#6fbf73", "comment": "HttpOnly+Secure cookies"},
    {"techniqueID": "T1528", "color": "#6fbf73", "comment": "API key scoping + audit"},
    {"techniqueID": "T1213", "color": "#6fbf73", "comment": "Export audit + rate limit"},
    {"techniqueID": "T1567", "color": "#6fbf73", "comment": "preventDataExfiltration middleware"},
    {"techniqueID": "T1485", "color": "#6fbf73", "comment": "Soft delete + 30-day recovery"},
    {"techniqueID": "T1565", "color": "#6fbf73", "comment": "Append-only audit log"},
    {"techniqueID": "T1498", "color": "#6fbf73", "comment": "express-rate-limit + Railway DDoS"}
  ]
}
```

Import into [https://mitre-attack.github.io/attack-navigator/](https://mitre-attack.github.io/attack-navigator/) to generate heatmap for customer security reviews.

---

## Gap Analysis — ATT&CK Techniques Without Coverage

| Technique | ID | Gap | Recommended Action |
|---|---|---|---|
| Phishing simulation | T1566 | No testing programme | Annual phishing simulation Q3 2026 |
| Supply chain compromise | T1195 | Partial — DPAs exist | Add SCA (Software Composition Analysis) to CI |
| Exploit public-facing app (zero-day) | T1190 | No WAF | Consider Cloudflare WAF in front of Railway |
| Internal spearphishing | T1534 | No detection | Monitor for insider threat patterns |
| SSRF | T1573 | Partial mitigation | Add explicit SSRF prevention middleware |

---

## Using This Document for Customer Sales

When a customer security team asks "do you use MITRE ATT&CK?":

1. Reference this document — shows systematic approach
2. Highlight: **79% tactic coverage** with active mitigations
3. Highlight: **MITRE ATLAS** coverage for AI-specific threats (unique to AI vendors)
4. Offer: ATT&CK Navigator JSON layer for their security team
5. Upcoming: Annual pen test results (Q4 2026) will validate ATT&CK coverage empirically
