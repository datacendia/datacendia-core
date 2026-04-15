# SOC 2 Type II — Evidence Collection Schedule
**Trust Services Criteria: Security (CC), Availability (A1)**
**Observation Period Target:** 6 months (e.g., 1 Nov 2026 – 30 Apr 2027)
**Document Owner:** Engineering Lead
**Version:** 1.0 | April 2026

---

## Overview

SOC 2 Type II requires evidence of **control effectiveness over time** (minimum 6 months). Type I only requires controls to be designed and in place at a point-in-time. This schedule defines what evidence must be collected, at what frequency, and where it's stored.

---

## Evidence Collection by Control Category

### CC1 — Control Environment

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Board/management security risk review minutes | Quarterly | Management meeting notes | PDF/MD | 7 years |
| Employee security training completion records | Annual | Training platform (TBD) | CSV/PDF | 7 years |
| Org chart with security roles assigned | At change | HR / Engineering Lead | PDF | Current + 1 prior version |
| Signed security policy acknowledgements | At onboarding + annually | HR / Legal | PDF | 7 years |

### CC2 — Communication and Information

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Security policy publication evidence | At change | `docs/policies/` + git commit history | Git log | 7 years |
| Customer security disclosure (privacy policy URL) | At change | App frontend / `GET /api/v1/privacy/policy` | Screenshot | 7 years |
| Vendor security communications | On new vendor | DPA execution emails | Email PDF | 7 years |

### CC3 — Risk Assessment

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Risk Register (updated) | Quarterly | `docs/iso27001/risk-register.md` | MD/PDF | 7 years |
| Risk treatment completion evidence | Ongoing | GitHub PRs / deployment records | Git log | 7 years |
| New risk identified/added to register | Per event | Risk Register update + reviewer sign-off | Git commit | 7 years |

### CC4 — Monitoring Activities

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Audit log samples (security events) | Monthly | `SELECT * FROM audit_logs WHERE severity = 'critical'` | SQL export | 7 years |
| Rate limiting alerts triggered | Monthly | Redis / application logs | Log export | 7 years |
| Failed authentication attempts > threshold | Monthly | Audit logs: `action = 'auth.lockout_triggered'` | SQL export | 7 years |
| `CendiaPanopticon` monitoring alerts | Weekly | Monitoring service output | Log export | 7 years |
| Threat detection events | Monthly | Application security logs | Log export | 7 years |

### CC5 — Control Activities

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Change management records (PRs merged to production) | Per change | GitHub PR history | Git log | 7 years |
| Deployment approval evidence | Per deployment | GitHub PR review approvals | Git log | 7 years |
| Incident tickets raised and resolved | Per incident | Incident register | CSV | 7 years |

### CC6 — Logical and Physical Access Controls

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| User access reviews (active accounts vs employee list) | Quarterly | `SELECT id, email, role, status FROM users` | SQL export | 7 years |
| MFA enforcement evidence | Quarterly | `SELECT id, mfa_enabled FROM users WHERE role IN ('ADMIN','OWNER','SUPER_ADMIN')` — must be 100% | SQL export | 7 years |
| Account lockout events | Monthly | Audit logs: `action LIKE 'auth.lockout%'` | SQL export | 7 years |
| Terminated user deactivation within 24h | Per offboarding | Offboarding checklist completed + `deleted_at` timestamp | Checklist + SQL | 7 years |
| API key revocation on employee departure | Per offboarding | `SELECT * FROM api_keys WHERE revoked_at IS NOT NULL` | SQL export | 7 years |
| Privileged access listing | Quarterly | `SELECT id, email, role FROM users WHERE role IN ('ADMIN','OWNER','SUPER_ADMIN')` | SQL export | 7 years |
| GitHub branch protection rules active | Quarterly | GitHub settings screenshot | Screenshot | 7 years |

### CC7 — System Operations

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Vulnerability scan results | Monthly | `npm audit` output; Dependabot alerts | JSON/HTML | 7 years |
| Backup completion logs | Daily | Backup service logs; S3 object listing | Log/CSV | 7 years |
| Backup restore test results | Quarterly | Documented restore test from S3 | PDF | 7 years |
| Patch application records | Per patch | Dependency update PRs | Git log | 7 years |

### CC8 — Change Management

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| All production deployments | Per deployment | Railway deployment history | Screenshot/CSV | 7 years |
| Code review approval (≥1 reviewer) | Per PR | GitHub PR history | Git log | 7 years |
| Rollback capability demonstration | Annual | Documented rollback exercise | PDF | 7 years |

### CC9 — Risk Mitigation (Third Parties)

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Vendor SOC 2 reports | Annual | Neon, Railway, Upstash, SendGrid, OpenAI | PDF | 7 years |
| Signed DPAs for all subprocessors | On signing | `docs/legal/subprocessor-dpa-checklist.md` | PDF | 7 years |
| Supplier security questionnaire responses | Annual | `docs/iso27001/supplier-security-questionnaire.md` | PDF | 7 years |

### A1 — Availability

| Evidence Item | Frequency | Source | Format | Retention |
|---|---|---|---|---|
| Uptime monitoring data (≥99.9% SLA) | Monthly | Railway/UptimeRobot dashboard | Screenshot/CSV | 7 years |
| Incident post-mortems | Per incident | PIR documents | MD/PDF | 7 years |
| BCP test results | Annual | Business continuity tabletop | PDF | 7 years |
| Disaster recovery test results | Annual | Documented DR exercise | PDF | 7 years |

---

## Evidence Storage Structure

All evidence should be stored in a dedicated audit evidence repository:

```
docs/soc2/evidence/
├── CC1-control-environment/
│   ├── YYYY-MM_management-review-minutes.pdf
│   ├── YYYY-MM_training-completions.csv
├── CC6-access-controls/
│   ├── YYYY-QN_user-access-review.csv
│   ├── YYYY-QN_mfa-enforcement-query.csv
│   ├── YYYY-QN_privileged-users.csv
├── CC7-system-operations/
│   ├── YYYY-MM_npm-audit.json
│   ├── YYYY-MM_backup-logs.csv
│   ├── YYYY-QN_backup-restore-test.pdf
├── CC9-vendor-management/
│   ├── neon-soc2-report-YYYY.pdf
│   ├── railway-soc2-report-YYYY.pdf
│   └── signed-dpas/
└── A1-availability/
    ├── YYYY-MM_uptime-report.csv
    └── YYYY_bcp-test-results.pdf
```

---

## Automated Evidence Collection (Recommended Scripts)

Add these to a `scripts/soc2-evidence/` directory for monthly automated collection:

```bash
# Monthly access review
psql $DATABASE_URL -c "SELECT id, email, role, status, last_login_at FROM users ORDER BY role, email" > evidence/CC6/$(date +%Y-%m)_users.csv

# MFA enforcement check (should be 100% for admin roles)
psql $DATABASE_URL -c "SELECT email, role, mfa_enabled FROM users WHERE role IN ('ADMIN','OWNER','SUPER_ADMIN')" > evidence/CC6/$(date +%Y-%m)_mfa-check.csv

# Security events sample
psql $DATABASE_URL -c "SELECT created_at, action, user_id, resource_type, ip_address FROM audit_logs WHERE created_at > NOW() - INTERVAL '30 days' AND severity IN ('warning','critical') ORDER BY created_at DESC" > evidence/CC4/$(date +%Y-%m)_security-events.csv

# Vulnerability scan
npm audit --json > evidence/CC7/$(date +%Y-%m)_npm-audit.json 2>&1
```

---

## Readiness Checklist Before Engaging Auditor

| Item | Status |
|---|---|
| 6-month observation period completed | 📋 Start: Nov 2026 |
| All 5 subprocessor DPAs signed | 🔴 Pending |
| Management review minutes (×2 in period) | 📋 Pending |
| Employee security training (all staff) | 📋 Pending |
| Quarterly access reviews completed (×2 in period) | 📋 Pending |
| Monthly backup restore tests (×6 in period) | 📋 Pending |
| Incident register (any incidents documented end-to-end) | 📋 Pending |
| Vendor SOC 2 reports obtained | 📋 Pending |
| Evidence storage repository organised | 📋 Pending |
| Type I report obtained (optional but recommended) | 📋 See `docs/soc2/README.md` |
