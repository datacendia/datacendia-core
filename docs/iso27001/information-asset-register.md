# Information Asset Register
**ISO/IEC 27001:2022 — Annex A Control A.5.9 (Inventory of Information and Other Assets)**
**Document Owner:** Engineering Lead
**Version:** 1.0 | April 2026
**Review Cadence:** Quarterly

---

## Asset Classification Scheme

| Classification | Definition | Examples |
|---|---|---|
| **RESTRICTED** | Highly sensitive; disclosure would cause severe harm | Encryption keys, MFA secrets, database credentials, PII, PHI |
| **CONFIDENTIAL** | Sensitive; for internal/authorised use only | Source code, customer data, audit logs, API keys, security config |
| **INTERNAL** | Internal use; not for public disclosure | Architecture diagrams, runbooks, internal docs |
| **PUBLIC** | Intended for public access | Marketing materials, public API docs, open-source code |

---

## Data Assets

| ID | Asset Name | Description | Classification | Owner | Location | Retention | Controls |
|---|---|---|---|---|---|---|---|
| DA-001 | User Personal Data | Names, emails, roles, preferences, MFA secrets, login metadata | RESTRICTED | Engineering Lead | Neon PostgreSQL (users table) | Account lifetime + 30 days | Encryption at rest (Neon AES-256), TLS in transit, RBAC, GDPR Art.17 erasure |
| DA-002 | Authentication Credentials | Password hashes, reset token hashes, session tokens | RESTRICTED | Engineering Lead | Neon PostgreSQL | Session: 30 days; PWD reset: 24h | bcrypt (cost 12), SHA-256 hashing, Redis TTL expiry |
| DA-003 | MFA Secrets | TOTP secrets, backup codes | RESTRICTED | Engineering Lead | Neon PostgreSQL (encrypted field) | Account lifetime | Application-level encryption (AES-256-GCM) |
| DA-004 | Customer Deliberation Data | AI deliberation inputs, council outputs, decisions | CONFIDENTIAL | Customer (controller); Datacendia (processor) | Neon PostgreSQL | Per customer DPA | Tenant isolation (org_id scoping), RBAC |
| DA-005 | Audit Logs | Security events, access logs, compliance events | CONFIDENTIAL | Engineering Lead | Neon PostgreSQL (audit_logs) | 7 years | Append-only, RBAC (read-only for most roles), retention scheduler |
| DA-006 | API Keys | Customer API keys for programmatic access | RESTRICTED | Customer | Neon PostgreSQL (hashed) | Until revoked | SHA-256 hashed at rest, revocation endpoint |
| DA-007 | Encryption Keys | AES-256 master keys, HMAC keys | RESTRICTED | Engineering Lead | Env vars (Railway encrypted secrets) | Rotated annually | Never logged, not in source code, Railway secrets vault |
| DA-008 | PHI (if healthcare enabled) | FHIR resources, patient data from EHR connectors | RESTRICTED | Customer (HIPAA Covered Entity) | Neon (if persisted); in-memory processing preferred | Per HIPAA BAA | De-identification before AI processing, PHI access audit log, BAA required |
| DA-009 | AI Model Prompts | Prompts sent to OpenAI/Groq for inference | CONFIDENTIAL | Customer | OpenAI API (in-transit only; not persisted by Datacendia) | Not retained | PII de-identification, OpenAI data processing agreement |
| DA-010 | Backup Archives | Encrypted pg_dump exports | RESTRICTED | Engineering Lead | AWS S3 (encrypted at rest) | 90 days | AES-256-CBC encryption, S3 server-side encryption, signed URLs only |
| DA-011 | Source Code | All application code | CONFIDENTIAL | Engineering Lead | GitHub (private repo) | Indefinite | MFA enforced, branch protection, no hardcoded secrets |
| DA-012 | Environment Variables / Secrets | DATABASE_URL, JWT_SECRET, API keys | RESTRICTED | Engineering Lead | Railway encrypted environment | Per key lifecycle | Never in source control, Railway secrets management, rotation schedule |

---

## Software Assets

| ID | Asset Name | Description | Version | Owner | Criticality | Patch Cadence |
|---|---|---|---|---|---|---|
| SA-001 | Node.js runtime | Backend application runtime | 22.x LTS | Engineering Lead | Critical | Within 7 days of CVE |
| SA-002 | PostgreSQL (via Neon) | Primary database | 16.x | Neon (managed) | Critical | Managed by Neon |
| SA-003 | Redis (via Upstash) | Session/cache store | 7.x | Upstash (managed) | High | Managed by Upstash |
| SA-004 | Prisma ORM | Database access layer | 5.x | Engineering Lead | High | Monthly |
| SA-005 | Express.js | HTTP server framework | 4.x | Engineering Lead | High | Monthly |
| SA-006 | React / Vite | Frontend framework | 18.x / 5.x | Engineering Lead | Medium | Monthly |
| SA-007 | bcryptjs | Password hashing | 2.x | Engineering Lead | Critical | On CVE |
| SA-008 | jsonwebtoken | JWT signing/verification | 9.x | Engineering Lead | Critical | On CVE |
| SA-009 | zod | Input validation | 3.x | Engineering Lead | High | Quarterly |
| SA-010 | Presidio (Docker sidecar) | ML-based PII detection | Latest | Engineering Lead | Medium | Monthly |
| SA-011 | OpenAI SDK | AI inference client | 4.x | Engineering Lead | Medium | Quarterly |

---

## Infrastructure Assets

| ID | Asset Name | Description | Provider | Criticality | Owner | Controls |
|---|---|---|---|---|---|---|
| IA-001 | Railway Application Service | Container hosting (Node.js + React) | Railway | Critical | Engineering Lead | Railway SOC 2, TLS, health checks |
| IA-002 | Neon PostgreSQL | Primary database (serverless Postgres) | Neon | Critical | Engineering Lead | Neon SOC 2, AES-256 at rest, TLS, PITR |
| IA-003 | Upstash Redis | Cache, sessions, rate limiting | Upstash | High | Engineering Lead | Upstash SOC 2, TLS, token auth |
| IA-004 | SendGrid | Transactional email delivery | Twilio | Medium | Engineering Lead | Twilio SOC 2, DKIM/DMARC, API key auth |
| IA-005 | OpenAI API | Cloud AI inference (optional) | OpenAI | Medium | Engineering Lead | OpenAI SOC 2, API key auth, DPA |
| IA-006 | GitHub | Source control, CI/CD | GitHub | High | Engineering Lead | MFA enforced, branch protection, secret scanning |
| IA-007 | AWS S3 | Encrypted backup storage | AWS | High | Engineering Lead | S3 SSE-S3, signed URLs, lifecycle policies |
| IA-008 | Custom Domain (app.datacendia.com) | Production DNS | Namecheap / Railway | High | Engineering Lead | SSL/TLS, HSTS, Railway CNAME |

---

## Asset Disposal Procedure

When assets are decommissioned or a customer account is closed:

1. **Data:** Execute GDPR erasure procedure (`DELETE /api/v1/privacy/erasure`) — pseudonymise PII, delete sessions and API keys
2. **Backups:** S3 lifecycle policy deletes backups after 90 days automatically
3. **API Keys:** Revoked immediately via platform; hashed keys have no value when revoked
4. **Encryption Keys:** Rotated and old versions deleted from Railway secrets
5. **PHI (if applicable):** Return or destroy per HIPAA BAA Article 4.3

---

## Review Log

| Date | Reviewer | Changes |
|---|---|---|
| April 2026 | Engineering Lead | Initial asset register created |
