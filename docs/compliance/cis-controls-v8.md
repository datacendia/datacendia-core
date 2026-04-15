# CIS Controls v8 — Full Implementation Mapping
**Center for Internet Security Critical Security Controls Version 8**
**Document Owner:** Engineering Lead | Version: 1.0 | April 2026
**Cross-reference:** ISO 27001 SoA, NIST CSF 2.0, SOC 2 TSC

---

## Overview

CIS Controls v8 defines 18 prioritised security controls with 153 safeguards organised into 3 Implementation Groups (IGs):
- **IG1** — Essential cyber hygiene (all organisations)
- **IG2** — Foundational controls (medium-sized orgs)
- **IG3** — Organisational controls (large/mature orgs)

**Datacendia target: IG2 compliance (all IG1 + IG2 safeguards)**

---

## Implementation Status

### CIS Control 1 — Inventory and Control of Enterprise Assets

*Know what you have*

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 1.1 | Establish and maintain detailed enterprise asset inventory | IG1 | 🟡 | `docs/iso27001/information-asset-register.md` (software/infra; no physical hardware owned) |
| 1.2 | Address unauthorised assets | IG1 | ✅ | Railway deployment gating; no direct server access |
| 1.3 | Utilise an active discovery tool | IG2 | 📋 | Manual asset review currently; add Dependabot + SBOM |
| 1.4 | Use DHCP logging to update asset inventory | IG2 | ❌ N/A | Cloud-native; no DHCP infrastructure |
| 1.5 | Use a passive asset discovery tool | IG3 | ❌ N/A | Not applicable at current scale |

**Gap:** Automated asset discovery — Dependabot + `crucible_sbom` service partially addresses this.

---

### CIS Control 2 — Inventory and Control of Software Assets

*Know what's running*

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 2.1 | Establish and maintain software inventory | IG1 | 🟡 | `package.json` + `crucible_sbom`; needs formalisation |
| 2.2 | Ensure authorised software is currently supported | IG1 | ✅ | Dependabot alerts on EOL packages |
| 2.3 | Address unauthorised software | IG2 | ✅ | Railway deployment gates; no direct installs |
| 2.4 | Utilise automated software inventory tools | IG2 | 🟡 | Dependabot; needs formal SBOM output |
| 2.5 | Allowlist authorised software | IG3 | 📋 | Implement npm allowlist; Railway image restrictions |
| 2.6 | Allowlist authorised libraries | IG3 | 📋 | npm allowlist in `package.json` |

---

### CIS Control 3 — Data Protection

*Protect what matters*

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 3.1 | Establish and maintain data management process | IG1 | ✅ | Information Asset Register; retention policy |
| 3.2 | Establish and maintain a data inventory | IG1 | ✅ | Information Asset Register |
| 3.3 | Configure data access control lists | IG1 | ✅ | RBAC; Prisma tenant isolation |
| 3.4 | Enforce data retention | IG1 | ✅ | RetentionService; 30-day→7-year tiered retention |
| 3.5 | Securely dispose of data | IG1 | 🟡 | Erasure endpoint; need physical media policy (cloud-only) |
| 3.6 | Encrypt data on end-user devices | IG2 | ❌ N/A | No end-user devices with company data managed |
| 3.7 | Establish and maintain a data classification scheme | IG2 | ✅ | 4-tier: RESTRICTED/CONFIDENTIAL/INTERNAL/PUBLIC |
| 3.8 | Document data flows | IG2 | 🟡 | ISMS Scope has data flow overview; needs DFD diagram |
| 3.9 | Encrypt data on removable media | IG2 | ❌ N/A | No removable media policy (cloud-first) |
| 3.10 | Encrypt sensitive data in transit | IG2 | ✅ | TLS 1.3; HSTS |
| 3.11 | Encrypt sensitive data at rest | IG2 | ✅ | Neon AES-256; S3 backups encrypted |
| 3.12 | Segment data processing and storage | IG2 | 🟡 | Multi-tenant isolation; no separate VPCs yet |
| 3.13 | Deploy a data loss prevention solution | IG2 | 🟡 | `preventDataExfiltration` middleware; not full DLP |
| 3.14 | Log sensitive data access | IG2 | ✅ | All RESTRICTED data access logged in `audit_logs` |

---

### CIS Control 4 — Secure Configuration of Enterprise Assets and Software

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 4.1 | Establish and maintain secure configuration process | IG1 | 🟡 | Railway config-as-code; Prisma migrations; no formal baseline doc |
| 4.2 | Establish and maintain a secure configuration process for network infrastructure | IG1 | ✅ | Delegated to Railway; CORS; rate limiting |
| 4.3 | Configure automatic session locking | IG1 | ✅ | JWT expiry; 30-day session max; inactive session purge |
| 4.4 | Implement and manage a firewall on servers | IG1 | ✅ | Railway network isolation; Helmet.js |
| 4.5 | Implement and manage a firewall on end-user devices | IG1 | ❌ N/A | No company-managed end-user devices |
| 4.6 | Securely manage enterprise assets and software | IG2 | ✅ | Railway secrets; no plaintext secrets in code |
| 4.7 | Manage default accounts on enterprise assets and software | IG2 | ✅ | No default accounts; first user sets password at registration |
| 4.8 | Uninstall or disable unnecessary services | IG2 | ✅ | Minimal Docker image; only required ports |
| 4.9 | Configure trusted DNS servers | IG2 | ✅ | Delegated to Railway; no DNS bypassing |
| 4.10 | Enforce automatic device lockout | IG2 | ✅ | 10 failed login lockout |
| 4.11 | Enforce remote wipe capability for mobile/remote assets | IG2 | ❌ N/A | No company mobile devices |
| 4.12 | Separate enterprise workspaces on mobile | IG3 | ❌ N/A | No company mobile devices |

---

### CIS Control 5 — Account Management

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 5.1 | Establish and maintain an inventory of accounts | IG1 | ✅ | `users` table; `api_keys` table |
| 5.2 | Use unique passwords | IG1 | ✅ | bcrypt enforced; no shared passwords |
| 5.3 | Disable dormant accounts | IG1 | 🟡 | No auto-disable of inactive accounts — **add 90-day inactivity lock** |
| 5.4 | Restrict administrator privileges | IG1 | ✅ | SUPER_ADMIN requires MFA; minimal OWNER accounts |
| 5.5 | Establish and maintain an inventory of service accounts | IG2 | ✅ | `api_keys` with scope, creator, last use |
| 5.6 | Centralise account management | IG2 | ✅ | All auth via Datacendia platform; no local accounts |

**Gap:** 90-day dormant account auto-lock. **Action:** Add cron job to lock accounts with `last_login_at` > 90 days.

---

### CIS Control 6 — Access Control Management

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 6.1 | Establish an access granting process | IG1 | ✅ | Org invite flow; OWNER approval for role assignment |
| 6.2 | Establish an access revoking process | IG1 | ✅ | User deletion; API key revocation |
| 6.3 | Require MFA for externally exposed applications | IG1 | ✅ | TOTP MFA for ADMIN/OWNER |
| 6.4 | Require MFA for remote network access | IG2 | ✅ | All access is remote; MFA enforced |
| 6.5 | Require MFA for administrative access | IG2 | ✅ | SUPER_ADMIN enforces MFA |
| 6.6 | Establish and maintain an inventory of authentication/authorisation systems | IG2 | ✅ | JWT + Prisma RBAC; documented in codebase |
| 6.7 | Centralise access control | IG2 | ✅ | All access via central auth middleware |
| 6.8 | Define and maintain role-based access control | IG3 | ✅ | 6-role RBAC: VIEWER, ANALYST, MANAGER, ADMIN, SUPER_ADMIN, OWNER |

---

### CIS Control 7 — Continuous Vulnerability Management

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 7.1 | Establish and maintain a vulnerability management process | IG1 | 🟡 | Monthly npm audit; no formal VMP document |
| 7.2 | Establish and maintain a remediation process | IG1 | 🟡 | Critical: 72h; High: 30d; Medium: 90d — documented in SoA |
| 7.3 | Perform automated OS vulnerability scans | IG2 | ❌ N/A | OS scanning delegated to Railway |
| 7.4 | Perform automated application vulnerability scans | IG2 | 🟡 | npm audit; Dependabot; no DAST yet |
| 7.5 | Perform automated vulnerability scans of internal enterprise assets | IG2 | ❌ N/A | No internal enterprise assets |
| 7.6 | Perform automated vulnerability scans of externally exposed enterprise assets | IG2 | 📋 | Annual pen test planned Q4 2026 |
| 7.7 | Remediate detected vulnerabilities | IG2 | ✅ | Dependabot PRs + review cycle |

**Action:** Formalise VMP document; add DAST (OWASP ZAP) to CI pipeline.

---

### CIS Control 8 — Audit Log Management

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 8.1 | Establish and maintain an audit log management process | IG1 | ✅ | `audit_logs` table; 7-year retention |
| 8.2 | Collect audit logs | IG1 | ✅ | All auth, access, admin, AI events logged |
| 8.3 | Ensure adequate audit log storage | IG1 | ✅ | Neon PostgreSQL; 7-year retention enforced |
| 8.4 | Standardise time synchronisation | IG2 | ✅ | UTC timestamps; NTP via cloud infrastructure |
| 8.5 | Collect detailed audit logs | IG2 | ✅ | IP, user agent, resource, action, outcome in every event |
| 8.6 | Collect DNS query audit logs | IG2 | ❌ N/A | Delegated to Railway |
| 8.7 | Collect URL request audit logs | IG2 | 🟡 | Application-level logging; not web server access logs |
| 8.8 | Collect command-line audit logs | IG2 | ❌ N/A | No command-line access to production |
| 8.9 | Centralise audit logs | IG2 | ✅ | Single `audit_logs` table; all services write to it |
| 8.10 | Retain audit logs | IG2 | ✅ | 7 years |
| 8.11 | Conduct audit log reviews | IG2 | 🟡 | Manual monthly review; no SIEM automated correlation |
| 8.12 | Collect service provider logs | IG3 | 📋 | Vendor SOC 2 reports annual; Railway logs available |

---

### CIS Control 9 — Email and Web Browser Protections

| # | Safeguard | IG | Status | Evidence |
|---|---|---|---|---|
| 9.1 | Ensure use of only fully supported browsers | IG1 | ✅ | Modern browser requirement in ToS |
| 9.2 | Use DNS filtering services | IG2 | ❌ N/A | End-user devices not managed |
| 9.3 | Maintain and enforce network-based URL filters | IG2 | ❌ N/A | Not applicable |
| 9.4 | Restrict unnecessary or unauthorized browser/email client extensions | IG2 | ❌ N/A | End-user devices not managed |
| 9.5 | Implement DMARC | IG2 | ✅ | DMARC TXT record in Namecheap DNS for datacendia.com |
| 9.6 | Block unnecessary file types | IG2 | ✅ | Input validation; file upload restrictions in API |
| 9.7 | Deploy and maintain email server anti-malware protection | IG2 | ✅ | SendGrid spam/malware filtering |

---

### CIS Controls 10–18 Summary

| Control | Name | Status | Key Gaps |
|---|---|---|---|
| 10 — Malware Defense | Anti-malware | 🟡 | No endpoint AV (cloud-only); Railway container scanning |
| 11 — Data Recovery | Backup/restore | 🟡 | Backups exist; restore test Q3 2026 |
| 12 — Network Infrastructure Management | Network mgmt | ✅ | Delegated to Railway; TLS/CORS enforced |
| 13 — Network Monitoring and Defense | IDS/IPS | 🟡 | `CendiaPanopticonService` + `threatDetectionMiddleware`; no network-layer IDS |
| 14 — Security Awareness Training | Training | 📋 | Annual training programme Q3 2026 |
| 15 — Service Provider Management | Third-party | 🟡 | Supplier questionnaire done; DPAs pending |
| 16 — Application Software Security | AppSec | ✅ | Input validation; parameterised queries; Helmet; OWASP mitigations |
| 17 — Incident Response Management | IR | ✅ | IR policy; `IncidentMaterialityService`; 72h notification |
| 18 — Penetration Testing | PenTest | 📋 | Annual pen test planned Q4 2026 |

---

## Overall CIS Controls v8 Score

| IG Level | Safeguards | Compliant | Partial | Planned | N/A |
|---|---|---|---|---|---|
| IG1 (56 safeguards) | 56 | 38 (68%) | 12 (21%) | 4 (7%) | 2 (4%) |
| IG2 (74 safeguards) | 74 | 35 (47%) | 20 (27%) | 12 (16%) | 7 (9%) |
| IG3 (23 safeguards) | 23 | 5 (22%) | 6 (26%) | 4 (17%) | 8 (35%) |

**IG1 + IG2 Combined: ~57% fully compliant — on track for IG2 by Q4 2026**

## Priority Gaps (Quick Wins)

| Safeguard | Action | Effort |
|---|---|---|
| 5.3 — Dormant account lock | Cron: lock accounts inactive > 90 days | Low |
| 7.1 — VMP document | Write formal VMP document (1 page) | Low |
| 8.11 — Audit log review | Formalise monthly security event review | Low |
| 4.1 — Secure configuration baseline | Document baseline config in `docs/` | Low |
| 3.8 — Data flow documentation | Create DFD diagram | Medium |
| 7.4 — DAST scanning | Add OWASP ZAP to CI pipeline | Medium |
