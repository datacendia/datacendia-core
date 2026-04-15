# SOC 2 Controls Matrix
## Datacendia Platform
**As of Date:** April 15, 2026
**In-Scope Criteria:** Security (CC1–CC9), Availability (A1)

---

## How to Read This Matrix

| Column | Meaning |
|---|---|
| **TSC** | Trust Services Criterion reference |
| **Control** | Name of the control |
| **Description** | What the control does |
| **Implementation** | Where it lives in the codebase / process |
| **Evidence Pointer** | Where an auditor can find evidence |
| **Design Status** | ✅ Designed and implemented |

---

## CC1 — Control Environment

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC1.1 | Commitment to integrity | Security policies formally documented and approved | `docs/policies/` — 5 policy documents | Signed policy docs | ✅ |
| CC1.2 | Board oversight | CEO reviews security posture quarterly | Management review process | Meeting notes | ✅ |
| CC1.3 | Org structure | Defined roles: Engineering Lead (security owner), CEO (oversight) | Access Control Policy §2 | Org chart | ✅ |
| CC1.4 | Competence | Engineering staff hold relevant qualifications | HR records | CV / training records | ✅ |
| CC1.5 | Accountability | Role-based access with audit trail for all privileged actions | `audit_logs` table; RBAC via `requireRole()` | `audit_logs` DB records | ✅ |

---

## CC2 — Communication and Information

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC2.1 | Internal communication | Security policies communicated to all staff | `docs/policies/README.md` | Policy distribution records | ✅ |
| CC2.2 | External communication | Incident notification procedures documented | Incident Response Policy §5 | IR Policy doc | ✅ |
| CC2.3 | System description | System description prepared per DC1–DC9 | `docs/soc2/system-description.md` | This document | ✅ |

---

## CC3 — Risk Assessment

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC3.1 | Risk identification | Annual risk assessment with threat/likelihood/impact | System Description §DC8 | Risk register in DC8 | ✅ |
| CC3.2 | Risk analysis | Risks ranked and mitigated | System Description §DC8 | Risk matrix | ✅ |
| CC3.3 | Risk mitigation | Controls implemented for each identified risk | Controls in this matrix | Code + config | ✅ |

---

## CC4 — Monitoring

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC4.1 | Ongoing monitoring | All security events persisted to `audit_logs` | `backend/src/security/audit.service.ts` | `audit_logs` DB table | ✅ |
| CC4.2 | Deficiency reporting | Error tracking via Sentry; structured logger with error levels | `backend/src/utils/logger.ts` | Railway logs, Sentry | ✅ |

---

## CC5 — Control Activities

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC5.1 | Policies and procedures | Formal policies for InfoSec, Access Control, IR, BCP | `docs/policies/` | Policy docs | ✅ |
| CC5.2 | Technology controls | Security middleware stack enforces policies automatically | `backend/src/security/`, `backend/src/middleware/` | Code review | ✅ |
| CC5.3 | Change management | All changes via PR to `production` branch; CD on merge | `.windsurf/workflows/railway-deploy.md`, Railway | Git log, Railway deploy history | ✅ |

---

## CC6 — Logical and Physical Access

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC6.1 | Access credentials | Passwords: bcrypt cost 12, min-12 chars, complexity enforced | `backend/src/routes/auth.ts` — `PASSWORD_POLICY` Zod schema | Auth route code | ✅ |
| CC6.1 | MFA enforcement | ADMIN/OWNER/SUPER_ADMIN blocked if MFA enabled but not verified | `backend/src/middleware/auth.ts` — `MFA_REQUIRED_ROLES` | Auth middleware code | ✅ |
| CC6.1 | Account lockout | 10 failed attempts → 30-min lockout in Redis + Postgres | `backend/src/routes/auth.ts` — `recordFailedAttempt()` | `users.locked_until` column | ✅ |
| CC6.1 | Token security | Password reset tokens stored as SHA-256 hash only | `backend/src/routes/auth.ts` — `hashToken()` | `password_resets.token_hash` column | ✅ |
| CC6.2 | Access provisioning | Role-based access granted per Access Control Policy | Access Control Policy §3 | `users.role` column; audit log | ✅ |
| CC6.3 | RBAC | `requireRole()` middleware restricts endpoints by role | `backend/src/middleware/auth.ts` | Route definitions | ✅ |
| CC6.3 | Tenant isolation | `requireOrgScope` middleware prevents cross-org data access | `backend/src/middleware/tenantIsolation.ts` | Middleware code | ✅ |
| CC6.6 | Rate limiting | Redis-backed rate limiting per subscription tier | `backend/src/middleware/rateLimiter.ts` | Rate limiter code | ✅ |
| CC6.7 | Brute-force protection | Account lockout + Redis rate limiter on auth endpoints | `backend/src/routes/auth.ts` | Auth route code | ✅ |
| CC6.8 | Malicious code prevention | Input sanitisation, SQL injection, path traversal middleware | `backend/src/middleware/SecurityMiddleware.ts` | Middleware code | ✅ |

---

## CC7 — System Operations

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC7.1 | Vulnerability detection | `npm audit` on each build; Dependabot alerts | `Dockerfile.allinone` build stage | Railway build logs | ✅ |
| CC7.2 | Monitoring (anomalies) | Threat detection middleware flags anomalous requests | `backend/src/security/SecurityHardening.ts` — `threatDetectionMiddleware` | Security logs | ✅ |
| CC7.2 | Audit logging | All auth, admin, and data events written to `audit_logs` | `backend/src/security/audit.service.ts` | `audit_logs` DB table | ✅ |
| CC7.3 | Incident response | Formal IR plan with classification, SLAs, notification procedures | `docs/policies/incident-response-policy.md` | IR Policy doc | ✅ |
| CC7.4 | Incident response procedures | Containment, eradication, recovery steps documented | IR Policy §4 | IR Policy doc | ✅ |
| CC7.5 | Incident recovery | Backup restore procedures, RTO/RPO commitments | `docs/policies/backup-recovery-policy.md` | Backup Policy + test results | ✅ |

---

## CC8 — Change Management

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC8.1 | Change authorisation | All changes require PR review before merge to `production` | GitHub branch protection rules | Git PR history | ✅ |
| CC8.1 | Deployment pipeline | Automated CD via Railway; no manual SSH deploys to production | `railway.json`, `.windsurf/workflows/railway-deploy.md` | Railway deploy history | ✅ |

---

## CC9 — Risk Mitigation

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| CC9.1 | Risk mitigation activities | Technical controls address all identified risks | CC3–CC7 controls above | This matrix | ✅ |
| CC9.2 | Vendor risk management | Subservice SOC 2 reports reviewed; DPAs required | InfoSec Policy §10; System Description §DC6 | Vendor SOC 2 reports on file | ✅ |

---

## A1 — Availability

| TSC | Control | Description | Implementation | Evidence Pointer | Status |
|---|---|---|---|---|---|
| A1.1 | Availability commitments | SLA documented; 99.9% uptime target | System Description §DC2 | BCP policy | ✅ |
| A1.2 | Environmental protection | Railway multi-region; auto-restart on crash | Railway platform | Railway dashboard | ✅ |
| A1.2 | Backup | Daily pg_dump + AES-256 encryption + S3 upload | `backend/src/services/backup/index.ts` | S3 bucket; backup logs | ✅ |
| A1.2 | Neon PITR | Continuous WAL archiving, 7-day point-in-time restore | Neon project settings | Neon console | ✅ |
| A1.3 | Disaster recovery | DR procedures with RTO ≤ 4h, RPO ≤ 24h | `docs/policies/business-continuity-policy.md` | BCP doc + DR test results | ✅ |
| A1.3 | DR testing | Monthly PITR restore test; quarterly pg_dump drill | BCP Policy §7 | `docs/evidence/dr-tests/` | ✅ |

---

## Open Items / Gaps

| Gap | Priority | Target Date |
|---|---|---|
| Formal penetration test by accredited firm | High | Q3 2026 |
| DPAs signed with all subservice organisations | High | Q2 2026 |
| Access review for Q2 2026 documented | Medium | June 2026 |
| Employee security awareness training records | Medium | Q2 2026 |
| Backup restore test results logged to `docs/evidence/` | Medium | April 2026 |
