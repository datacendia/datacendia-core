# Datacendia Security & Compliance Policies

**Last Updated:** April 2026

All policies below are maintained in this directory and reviewed annually (or after material security events).

---

## Policy Index

| Document | SOC 2 Criteria | Owner | Status |
|---|---|---|---|
| [Information Security Policy](./information-security-policy.md) | CC6.1, CC6.2, CC6.3, CC7.2, CC8.1 | Engineering Lead | ✅ Active |
| [Access Control Policy](./access-control-policy.md) | CC6.1, CC6.2, CC6.3 | Engineering Lead | ✅ Active |
| [Incident Response Policy](./incident-response-policy.md) | CC7.3, CC7.4, CC7.5 | Security Lead | ✅ Active |
| [Business Continuity & DR Policy](./business-continuity-policy.md) | A1.2, A1.3, CC7.5 | Engineering Lead | ✅ Active |
| [Backup & Recovery Policy](./backup-recovery-policy.md) | A1.2, A1.3 | Engineering Lead | ✅ Active |

---

## SOC 2 Trust Services Criteria Coverage

| Criteria | Description | Policy |
|---|---|---|
| CC6.1 | Logical access controls / credential management | InfoSec, Access Control |
| CC6.2 | Access provisioning and deprovisioning | Access Control |
| CC6.3 | Role-based access and least privilege | Access Control |
| CC6.7 | Account lockout / brute-force protection | InfoSec |
| CC7.2 | Audit logging and monitoring | InfoSec |
| CC7.3–CC7.5 | Incident detection and response | Incident Response, BCP |
| CC8.1 | Change management | InfoSec |
| CC9.2 | Vendor risk management | InfoSec |
| A1.2 | Availability commitments and recovery | BCP, Backup |
| A1.3 | Environmental safeguards / DR testing | BCP, Backup |

---

## Evidence Artifacts

Store audit evidence in `docs/evidence/`:
- `docs/evidence/access-reviews/` — quarterly access review logs
- `docs/evidence/backup-tests/` — backup restore test results
- `docs/evidence/dr-tests/` — disaster recovery exercise reports
- `docs/evidence/penetration-tests/` — pen test reports
