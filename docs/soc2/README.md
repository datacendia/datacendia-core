# SOC 2 Type I Readiness Package
**Datacendia, LLC** — As of April 15, 2026

---

## What's in This Directory

| Document | Purpose | Audience |
|---|---|---|
| [`system-description.md`](./system-description.md) | DC1–DC9 system description (required by auditor) | Auditor, customers |
| [`controls-matrix.md`](./controls-matrix.md) | Maps every control to TSC criteria + evidence pointers | Auditor, internal |
| [`management-assertion.md`](./management-assertion.md) | Signed management assertion (fill in signatures before audit) | Auditor |

---

## Type I vs Type II — Summary

| | **SOC 2 Type I** | **SOC 2 Type II** |
|---|---|---|
| **What it assesses** | Controls *designed* as of a point in time | Controls *operating effectively* over a period |
| **Period** | Single date (e.g. April 15, 2026) | Typically 6–12 months |
| **What we need** | This package + auditor engagement | Type I + operating evidence (logs, reviews, test results) |
| **Timeline** | ~4–8 weeks with auditor | ~3–6 months observation + 4–8 weeks audit |
| **Customer value** | "Controls are designed correctly" | "Controls actually worked over time" |

---

## Steps to Complete Type I Audit

### 1. Engage an Accredited Auditor
You need a licensed CPA firm with AICPA SOC 2 accreditation. Recommended options:
- **Drata / Vanta + partner auditor** — compliance automation + audit in one (fastest path, ~6–10 weeks)
- **Schellman, Coalfire, Prescient Assurance** — dedicated SOC 2 auditors
- **A-LIGN, Johanson Group** — cost-effective for early-stage companies

### 2. Pre-Audit Readiness Checklist

- [ ] All 5 policy documents signed by CEO + Engineering Lead (`docs/policies/`)
- [ ] Management assertion signed (`docs/soc2/management-assertion.md`)
- [ ] DPAs signed with: Neon, Railway, SendGrid, Upstash
- [ ] One successful backup restore test documented (`docs/evidence/dr-tests/`)
- [ ] One access review completed and documented (`docs/evidence/access-reviews/`)
- [ ] `npm audit` passing (zero critical vulnerabilities)
- [ ] Penetration test scheduled (or prior report on file)
- [ ] Employee security awareness training completed and recorded
- [ ] GitHub branch protection rules enabled on `production` branch

### 3. Provide Auditor Access

Provide the auditor with:
- Read-only access to this `docs/soc2/` directory
- Read-only access to `docs/policies/`
- Read-only access to the codebase (or specific files listed in the controls matrix)
- `audit_logs` database exports for the relevant period
- Railway deployment history screenshots
- Neon backup configuration screenshots

### 4. For Type II (After Type I)

Start the Type II observation period **immediately after Type I** is issued:
- Enable automated evidence collection (Drata/Vanta handles this)
- Run quarterly access reviews → log to `docs/evidence/access-reviews/`
- Run monthly backup restore tests → log to `docs/evidence/dr-tests/`
- Keep `npm audit` clean throughout the period
- Document any security incidents and their resolution

---

## Evidence Directory Structure

```
docs/evidence/
├── access-reviews/
│   └── 2026-Q2-access-review.md
├── backup-tests/
│   └── 2026-04-pitr-restore-test.md
├── dr-tests/
│   └── 2026-04-dr-drill.md
└── penetration-tests/
    └── 2026-pentest-report.pdf
```

Create these directories and populate with real test results before the auditor engagement.
