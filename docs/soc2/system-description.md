# System Description
## Datacendia Platform — SOC 2 Type I
**Prepared by:** Management of Datacendia, LLC
**As of Date:** April 15, 2026
**Description Criteria:** DC1–DC9 (AICPA 2017 Trust Services Criteria)
**In-Scope Trust Services Criteria:** Security (CC), Availability (A)

---

## DC1 — Nature of Services Provided

Datacendia is a cloud-based AI Governance and Decision Intelligence platform. It provides organisations with tools to:

- **AI Council deliberations** — structured multi-agent AI deliberation workflows for high-stakes decisions
- **Governance & Compliance** — policy authoring, regulatory intelligence, audit trails, and compliance reporting
- **Data Intelligence** — privacy-preserving analytics, anomaly detection, and federated learning capabilities
- **Access Management** — role-based multi-tenant access control with MFA enforcement
- **Audit Logging** — immutable 7-year audit trail for SOC 2 and regulatory evidence

The platform is delivered entirely as a SaaS service over HTTPS. Customer data is logically isolated by organisation (tenant) and never commingled.

**Service commitment:** 99.9% monthly uptime for Tier 1 services (authentication, deliberation API, audit logging).

---

## DC2 — Principal Service Commitments and System Requirements

### Security Commitments
- Customer data is encrypted in transit (TLS 1.2+) and at rest (AES-256 via Neon)
- Access is limited to authorised users via JWT authentication + optional MFA
- Privileged accounts (ADMIN, OWNER, SUPER_ADMIN) require MFA
- All security events are logged to an immutable audit trail
- Account lockout after 10 failed authentication attempts (30-minute lockout)
- Password complexity: minimum 12 characters with mixed character classes

### Availability Commitments
- RPO ≤ 24 hours (continuous PITR via Neon + daily pg_dump)
- RTO ≤ 4 hours (documented in Business Continuity Policy)
- System health monitored via `/health`, `/liveness`, `/readiness` endpoints

### Confidentiality Commitments
- Customer data is not shared with other tenants or third parties except as described in the DPA
- Data is retained for the period specified in customer agreements; deleted upon contract termination per the Data Retention Policy

---

## DC3 — Components of the System

### Infrastructure

| Component | Provider | Purpose |
|---|---|---|
| Application server | Railway (cloud) | Express.js API + static frontend serving |
| PostgreSQL database | Neon | Primary persistent data store |
| Redis cache | Upstash / Railway Redis | Session cache, rate limiting, MFA state |
| Object storage | AWS S3 / Cloudflare R2 | Daily encrypted backup exports |
| Email delivery | SendGrid | Transactional email (password reset, notifications) |
| DNS / CDN | Namecheap + Railway Edge | Domain resolution, TLS termination |
| Error tracking | Sentry (optional) | Exception monitoring |
| AI inference | OpenAI API / Ollama | Council deliberation AI responses |

### Software Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite, TailwindCSS |
| Backend API | Node.js 20, Express.js, TypeScript |
| ORM | Prisma (PostgreSQL) |
| Authentication | JWT (HS256, 1-hour TTL) + bcrypt (cost 12) |
| Containerisation | Docker (multi-stage `Dockerfile.allinone`) |
| CI/CD | Railway CD (auto-deploy on push to `production` branch) |

### Data Flows
1. User authenticates → JWT issued → stored client-side
2. API requests include `Authorization: Bearer <JWT>` → validated in `authenticate` middleware
3. All writes go through Prisma ORM → PostgreSQL (Neon)
4. Audit events written synchronously to `audit_logs` table + async to Druid stream
5. Backups: nightly pg_dump → AES-256 encrypted → S3 upload
6. MFA: TOTP secret encrypted (AES-256-GCM, PBKDF2-derived key) before DB storage

---

## DC4 — Boundaries of the System

**In scope:**
- Datacendia backend API (`backend/`) deployed on Railway
- Datacendia frontend SPA (`src/`) served as static assets
- Neon PostgreSQL database
- Redis instance (session/rate limit store)
- Railway deployment infrastructure

**Out of scope:**
- Customer's own network or endpoint devices
- Third-party AI model providers (OpenAI infrastructure)
- Customer-managed identity providers (if SSO is configured)
- Neon's internal infrastructure (covered by Neon's own SOC 2)

---

## DC5 — Complementary User Entity Controls (CUECs)

The following controls are the responsibility of **customer organisations** using the Datacendia platform:

1. **User credential management** — Customers are responsible for managing their users' passwords and revoking access when employees leave
2. **MFA enrollment** — Customers are responsible for ensuring their ADMIN and OWNER users enroll in MFA
3. **API key rotation** — Customers are responsible for rotating API keys periodically and upon suspected compromise
4. **Network security** — Customers are responsible for securing the networks from which they access Datacendia
5. **Data accuracy** — Customers are responsible for the accuracy and legality of data they input into the platform

---

## DC6 — Complementary Subservice Organisation Controls

Datacendia relies on the following subservice organisations. Their controls are not evaluated in this report (carve-out method):

| Subservice | Service | Their SOC Report |
|---|---|---|
| **Neon** | Managed PostgreSQL | Neon SOC 2 Type II (request from Neon) |
| **Railway** | Application hosting | Railway SOC 2 (request from Railway) |
| **SendGrid (Twilio)** | Email delivery | Twilio SOC 2 Type II (publicly available) |
| **Upstash** | Managed Redis | Upstash SOC 2 (request from Upstash) |

Customers should obtain and review these reports as part of their own vendor risk management.

---

## DC7 — Changes to the System During the Period

*Note: For Type I, this describes the state as of the as-of date. For Type II, list material changes during the observation period.*

Material changes implemented prior to the as-of date of April 15, 2026:

- Implemented account lockout mechanism (10 attempts / 30-minute lockout)
- Enforced MFA for all privileged roles (ADMIN, OWNER, SUPER_ADMIN)
- Migrated password reset token storage from plaintext to SHA-256 hashes
- Enhanced audit logging to persist all events to PostgreSQL (previously in-memory only)
- Migrated rate limiter from in-memory store to Redis (multi-instance safe)
- Replaced CORS origin substring match with exact hostname allowlist
- Implemented automated 7-year audit data retention scheduler
- Implemented automated daily database backup service with AES-256 encryption
- Formalized information security, access control, incident response, and BCP policies

---

## DC8 — Risk Assessment

Datacendia's management performs an annual risk assessment identifying threats to the security and availability of the platform. As of April 15, 2026, the following risks and mitigations are documented:

| Risk | Likelihood | Impact | Control |
|---|---|---|---|
| Credential brute-force | High | High | Account lockout (10 attempts / 30 min), Redis rate limiting |
| Unauthorised admin access | Medium | Critical | MFA enforcement, RBAC, audit logging |
| Data breach via SQL injection | Low | Critical | Prisma ORM (parameterised queries), input sanitisation middleware |
| Session hijacking | Low | High | Short-lived JWT (1 hour), Redis blacklist on logout |
| Insider threat | Low | High | Audit logging, RBAC, production access controls |
| Database loss | Low | Critical | Neon PITR + daily encrypted pg_dump |
| Service unavailability | Low | High | Railway auto-restart, DR plan (RTO 4 hours) |
| Third-party compromise | Medium | Medium | Vendor SOC 2 review, DPA in place |

---

## DC9 — Other Information

### Encryption Key Management
- JWT secret: stored in Railway environment variables; never committed to Git
- MFA encryption key: derived via PBKDF2-SHA512 (310,000 iterations) from `MFA_ENCRYPTION_KEY` env var
- Backup encryption key: `BACKUP_ENCRYPTION_KEY` env var; AES-256-CBC

### Penetration Testing
Penetration testing is planned annually. Results are retained in `docs/evidence/penetration-tests/`.

### Vulnerability Management
- Dependencies scanned via `npm audit` on each deployment
- Critical vulnerabilities patched within 7 days of disclosure

### Security Awareness
All engineering staff receive security awareness training annually covering phishing, credential hygiene, and incident reporting.

---

*This System Description is prepared by management of Datacendia, LLC and is intended solely for use in evaluating the SOC 2 Type I report. See the Management Assertion for the statement of responsibility.*
