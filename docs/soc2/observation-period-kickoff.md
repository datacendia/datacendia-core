# SOC 2 Type II — Observation Period Kickoff
**Target Period: 1 November 2026 – 30 April 2027 (6 months)**
**Auditor Engagement: Target May 2027**

---

## Before the Observation Period Starts (Actions Now → Oct 2026)

All controls must be **designed and in operation** before Day 1 of the observation period. Fix gaps before November 2026.

### Pre-Kickoff Checklist

| # | Action | Owner | Deadline | Status |
|---|---|---|---|---|
| 1 | Sign all 5 subprocessor DPAs | Legal | May 2026 | ⬜ |
| 2 | Complete employee security training (all staff) | Engineering Lead | Sep 2026 | ⬜ |
| 3 | Conduct first quarterly access review | Engineering Lead | Aug 2026 | ⬜ |
| 4 | Implement quarterly backup restore test | Engineering Lead | Aug 2026 | ⬜ |
| 5 | Obtain vendor SOC 2 reports (Neon, Railway, Upstash, SendGrid, OpenAI) | Legal | May 2026 | ⬜ |
| 6 | Document baseline system configurations | Engineering Lead | Sep 2026 | ⬜ |
| 7 | Formalise post-incident review process | Engineering Lead | Jul 2026 | ⬜ |
| 8 | Conduct management review meeting + document minutes | CEO + Engineering Lead | Oct 2026 | ⬜ |
| 9 | Enable GitHub Dependabot on all repos | Engineering Lead | May 2026 | ⬜ |
| 10 | Create `docs/soc2/evidence/` folder structure | Engineering Lead | Oct 2026 | ⬜ |
| 11 | Engage SOC 2 auditor / CPA firm (get quotes) | CEO | Sep 2026 | ⬜ |

### Recommended Auditor Firms (SOC 2 Type II for SaaS startups)

| Firm | Typical Cost | Notes |
|---|---|---|
| **A-LIGN** | $15K–$40K | Startup-friendly; FedRAMP-capable |
| **Drata + Auditor** | $10K–$25K + Drata license | Continuous monitoring + automated evidence |
| **Vanta + Auditor** | $12K–$30K + Vanta license | Popular with YC/a16z-backed companies |
| **Schellman** | $20K–$50K | Enterprise-grade; FedRAMP 3PAO |
| **Johanson Group** | $8K–$20K | Cost-effective for early-stage |

**Recommendation:** Use **Vanta or Drata** for automated evidence collection ($12–20K/year total) — dramatically reduces manual effort. They integrate with GitHub, Railway (via API), and Neon.

---

## Month-by-Month Evidence Collection Schedule

### November 2026 — Month 1

**Day 1 — System snapshot (critical)**
```sql
-- User access listing
SELECT id, email, role, status, mfa_enabled, last_login_at
FROM users ORDER BY role, email;

-- Privileged users (must ALL have mfa_enabled = true)
SELECT email, role, mfa_enabled FROM users
WHERE role IN ('OWNER','SUPER_ADMIN','ADMIN');

-- Active API keys
SELECT ak.id, ak.name, u.email, ak.created_at, ak.last_used_at
FROM api_keys ak JOIN users u ON ak.user_id = u.id
WHERE ak.revoked_at IS NULL;
```

Save as: `docs/soc2/evidence/CC6/2026-11_user-access-review.csv`

**npm vulnerability scan:**
```powershell
cd backend && npm audit --json | Out-File docs/soc2/evidence/CC7/2026-11_npm-audit.json
```

**Uptime report:** Screenshot Railway dashboard uptime for October 2026.

---

### December 2026 — Month 2

```sql
-- Security events (monthly sample)
SELECT created_at, event_type, action, user_id, ip_address, outcome, severity
FROM audit_logs
WHERE created_at >= '2026-11-01' AND severity IN ('warning','critical','error')
ORDER BY created_at DESC LIMIT 500;
```

Save as: `docs/soc2/evidence/CC4/2026-12_security-events.csv`

Backup verification:
```powershell
# List S3 backup objects (confirms backups ran)
aws s3 ls s3://datacendia-backups/postgres/ --recursive | Out-File docs/soc2/evidence/CC7/2026-12_backup-listing.txt
```

---

### January 2027 — Month 3 (Quarterly Review)

**Quarterly Access Review:**
- Compare user list to current employee list
- Verify all departed employees deactivated within 24h
- Verify all privileged users have MFA enabled
- Document reviewer sign-off

```sql
-- Terminated user check (should have deleted_at set)
SELECT email, role, deleted_at, status FROM users
WHERE status = 'INACTIVE' OR deleted_at IS NOT NULL;
```

**Change management sample:** Export last 90 days of GitHub PRs merged to `production` branch.

**Management review:** Hold Q4 2026 management review meeting. Document:
- Security metrics (incidents, vulnerabilities, access review results)
- Risk register status
- ISMS objectives progress
- Decisions and action items

Save minutes as: `docs/soc2/evidence/CC1/2027-01_management-review-minutes.pdf`

---

### February 2027 — Month 4

Standard monthly evidence:
- User access CSV
- Security events CSV
- npm audit JSON
- Backup listing
- Uptime screenshot

**Penetration test (recommended):** Engage external pen tester for annual test. Results needed before audit.

---

### March 2027 — Month 5

Standard monthly evidence.

**Vendor SOC 2 report renewal:** Check if Neon, Railway, Upstash, SendGrid, OpenAI SOC 2 reports have been renewed. Obtain latest versions.

**Disaster recovery test:** Execute documented DR scenario and record results.

---

### April 2027 — Month 6 (Final Month)

Standard monthly evidence.

**Quarterly access review #2:**
- Same process as January
- Must show two independent access reviews during the observation period

**Employee training:** Confirm 100% completion of security awareness training.

**Compile evidence package:** Organise all evidence by TSC category:

```
docs/soc2/evidence/
├── CC1-control-environment/     (×2 management reviews, training records)
├── CC2-communication/           (policy publication evidence)
├── CC3-risk-assessment/         (quarterly risk register updates)
├── CC4-monitoring/              (×6 monthly security events)
├── CC5-control-activities/      (GitHub PR history, deployment records)
├── CC6-access-controls/         (×2 quarterly access reviews, MFA evidence)
├── CC7-system-operations/       (×6 monthly scans, ×2 backup restore tests)
├── CC8-change-management/       (PR history, deployment approvals)
├── CC9-risk-mitigation/         (vendor SOC 2 reports, signed DPAs)
└── A1-availability/             (×6 uptime reports, incident records, DR test)
```

---

## Auditor Engagement Timeline

| Date | Milestone |
|---|---|
| Sep 2026 | Issue RFP to 3 auditor firms |
| Oct 2026 | Select auditor; sign engagement letter |
| Nov 1, 2026 | **Observation period begins** |
| Nov 2026 | Auditor conducts Type I readiness assessment (optional but recommended) |
| Apr 30, 2027 | **Observation period ends** |
| May 2027 | Auditor fieldwork begins (evidence review, walkthroughs) |
| Jun 2027 | Management comments on draft report |
| Jul 2027 | **SOC 2 Type II report issued** |

---

## Evidence Naming Convention

```
YYYY-MM_[control-category]_[description].[ext]

Examples:
2026-11_CC6_user-access-review.csv
2026-12_CC4_security-events.csv
2027-01_CC1_management-review-minutes.pdf
2027-01_CC6_privileged-access-review.csv
2027-03_A1_dr-test-results.pdf
```
