# ISO/IEC 27001:2022 — Readiness Package

This directory contains Datacendia's Information Security Management System (ISMS) documentation for ISO 27001:2022 certification.

## Document Index

| Document | ISO 27001 Clause | Status |
|---|---|---|
| [`isms-scope.md`](./isms-scope.md) | Clause 4.3 | ✅ Draft complete |
| [`information-asset-register.md`](./information-asset-register.md) | Annex A 5.9 | ✅ Draft complete |
| [`statement-of-applicability.md`](./statement-of-applicability.md) | Clause 6.1.3 | ✅ Draft complete — 93 controls mapped |
| [`risk-register.md`](./risk-register.md) | Clause 6.1.2 | ✅ Draft complete — 30 risks identified |
| [`supplier-security-questionnaire.md`](./supplier-security-questionnaire.md) | Annex A 5.19–5.22 | ✅ Draft complete |

## Policies (in `../policies/`)

| Policy | ISO 27001 Clause | Status |
|---|---|---|
| [`information-security-policy.md`](../policies/information-security-policy.md) | Clause 5.2 | ✅ Complete |
| [`access-control-policy.md`](../policies/access-control-policy.md) | Annex A 5.15–5.18 | ✅ Complete |
| [`incident-response-policy.md`](../policies/incident-response-policy.md) | Annex A 5.24–5.28 | ✅ Complete |
| [`business-continuity-policy.md`](../policies/business-continuity-policy.md) | Annex A 5.29–5.30 | ✅ Complete |
| [`backup-recovery-policy.md`](../policies/backup-recovery-policy.md) | Annex A 8.13 | ✅ Complete |

## What's Still Needed for Stage 1 Audit

These items must be completed before engaging a certification body:

| Item | Priority | Target |
|---|---|---|
| Management sign-off on ISMS Scope + SoA | **Critical** | Before Stage 1 |
| All 5 subprocessor DPAs signed | **Critical** | Q2 2026 |
| Acceptable Use Policy (AUP) | High | Q3 2026 |
| Staff NDA template | High | Q3 2026 |
| Annual security awareness training completed | High | Q3 2026 |
| Offboarding checklist formalised | High | Q3 2026 |
| Vulnerability management schedule (weekly scans) | High | Q3 2026 |
| Secure Development Lifecycle (SDL) document | Medium | Q3 2026 |
| First Management Review minutes | **Critical** | Before Stage 2 |
| First Internal Audit | **Critical** | Before Stage 2 |

## Certification Roadmap

```
Q2 2026  — Complete DPAs, sign-off on all ISMS documents
Q3 2026  — Conduct first internal audit; close critical gaps
Q3 2026  — Engage ISO 27001 certification body (BSI, Bureau Veritas, etc.)
Q4 2026  — Stage 1 Audit (document review, ~1 day remote)
Q4 2026  — Remediate Stage 1 findings (~4–8 weeks)
Q1 2027  — Stage 2 Audit (on-site/remote, ~2–3 days)
Q1 2027  — ISO 27001:2022 Certificate issued
Q1 2027+ — Surveillance audits (annually); recertification (3 years)
```

## SoA Summary (current state)

- ✅ **28 controls fully implemented** (30%)
- 🟡 **36 controls partially implemented** (39%)
- 📋 **13 controls planned** (14%)
- ❌ **16 controls excluded** (17% — all physical controls, cloud-delegated)
