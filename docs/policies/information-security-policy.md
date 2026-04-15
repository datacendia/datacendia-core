# Information Security Policy
**Datacendia, LLC**
**Version:** 1.0 | **Effective:** April 2026 | **Owner:** Security / Engineering Lead
**Review Cadence:** Annual (or after material security incident)
**Classification:** Internal — Restricted

---

## 1. Purpose

This policy establishes the framework for protecting the confidentiality, integrity, and availability of Datacendia systems, data, and customer information. It defines the minimum security requirements all employees, contractors, and third-party vendors must follow.

This policy is designed to support compliance with **SOC 2 Type II** (Trust Services Criteria), GDPR Article 32, and NIST SP 800-53.

---

## 2. Scope

Applies to:
- All Datacendia employees, contractors, and consultants
- All systems processing Datacendia or customer data (production, staging, development)
- Third-party service providers with access to Datacendia data (Railway, Neon, SendGrid, OpenAI)

---

## 3. Information Classification

| Class | Description | Examples | Controls Required |
|---|---|---|---|
| **Restricted** | Highest sensitivity — breach would cause material harm | Customer PII, credentials, JWT secrets, MFA keys | Encryption at rest + in transit, access logging, MFA |
| **Confidential** | Internal use — not for public disclosure | Internal code, business logic, audit logs | Access control, need-to-know |
| **Internal** | General internal use | Meeting notes, non-sensitive configs | Standard access controls |
| **Public** | Approved for external publication | Marketing content, API documentation | None beyond review |

---

## 4. Access Control (CC6.1–CC6.3)

### 4.1 Principle of Least Privilege
- All system access is granted on a need-to-know, least-privilege basis.
- Access rights are reviewed quarterly and upon role change or termination.
- Privileged access (ADMIN, OWNER, SUPER_ADMIN) requires **MFA** to be enabled.

### 4.2 Password Policy
All user passwords must comply with NIST SP 800-63B:
- **Minimum 12 characters**
- At least one uppercase letter, lowercase letter, digit, and special character
- Enforced via Zod validation schema (`PASSWORD_POLICY`) in `backend/src/routes/auth.ts`
- Passwords are hashed using **bcrypt (cost factor 12)** before storage
- Password reset tokens are stored as **SHA-256 hashes only** — never plaintext

### 4.3 Account Lockout
- Accounts are locked after **10 consecutive failed login attempts**
- Lockout duration: **30 minutes**
- Lockout state tracked in Redis (fast path) and PostgreSQL (durable)
- Implemented in `backend/src/routes/auth.ts` → `recordFailedAttempt()`

### 4.4 Multi-Factor Authentication
- MFA (TOTP) is **required** for all ADMIN, OWNER, and SUPER_ADMIN accounts
- MFA secrets are encrypted using **AES-256-GCM** before storage
- The `authenticate` middleware enforces MFA verification for privileged roles

### 4.5 Session Management
- Access tokens expire after **1 hour**
- Refresh tokens expire after **30 days**, stored as bcrypt hashes
- Logout invalidates tokens via Redis blacklist
- Sessions table tracks IP, user-agent, and expiry

---

## 5. Cryptography Standards (CC6.1)

| Algorithm | Use Case | Standard |
|---|---|---|
| AES-256-GCM | Data encryption at rest (MFA secrets, sensitive fields) | FIPS 140-3 |
| PBKDF2-SHA512 (310,000 iterations) | Key derivation | OWASP 2023 |
| bcrypt (cost 12) | Password hashing | Industry standard |
| RSA-4096 | Asymmetric signing | FIPS 140-3 |
| HMAC-SHA512 | Data integrity verification | NIST |
| SHA-256 | Token hashing (reset tokens, API keys) | FIPS 180-4 |

All cryptographic operations use Node.js built-in `crypto` module (FIPS-compatible when enabled).

---

## 6. Network Security

### 6.1 Transport Security
- All traffic is encrypted via **TLS 1.2+** (enforced by Railway/CDN)
- **HSTS** with `max-age=31536000; includeSubDomains; preload` is enforced
- HTTP Strict Transport Security is set for all API responses

### 6.2 Security Headers
The following headers are set on all API responses (via `backend/src/security/headers.ts`):
- `Content-Security-Policy` (strict)
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (denies camera, microphone, geolocation, etc.)

### 6.3 CORS
- Allowed origins: `*.datacendia.com`, `datacendia.com`, `*.railway.app` (exact hostname match)
- Credentials allowed for authenticated sessions

---

## 7. Audit Logging (CC7.2)

All security-relevant events are persisted to the `audit_logs` PostgreSQL table. Events include:
- `auth.login`, `auth.logout`, `auth.failed`, `auth.account_locked`
- `auth.mfa_enabled`, `auth.mfa_disabled`, `auth.password_changed`
- `admin.permission_granted`, `admin.user_created`, `admin.user_deleted`
- `data.access`, `data.export`, `data.deletion`
- All deliberation lifecycle events

Audit logs are **retained for 7 years** per the Data Retention Policy. Log deletion is controlled by the `RetentionService` and requires SUPER_ADMIN authorization.

---

## 8. Change Management (CC8.1)

- All code changes must be submitted as Pull Requests to the `production` branch
- PRs require at least **1 approved review** before merge
- Deployments to production are automated via Railway CD on merge to `production`
- Hotfixes must still go through PR review unless a P0 incident is declared
- All infrastructure changes are version-controlled in the repository

---

## 9. Security Incident Response

See `docs/policies/incident-response-policy.md` for the full IR plan.

**Classification:**
- **P0 (Critical):** Data breach, unauthorized access, ransomware → respond within 1 hour
- **P1 (High):** Authentication bypass, privilege escalation → respond within 4 hours
- **P2 (Medium):** Failed attack attempts, unusual activity → respond within 24 hours

---

## 10. Vendor / Third-Party Risk (CC9.2)

| Vendor | Service | Data Processed | Agreement Required |
|---|---|---|---|
| Railway | Hosting / Compute | All application data | DPA required |
| Neon / PostgreSQL | Primary database | All customer data | DPA required |
| Redis / Upstash | Cache / Session store | Session tokens, rate limit state | DPA required |
| SendGrid | Transactional email | Email addresses, names | DPA in place |
| OpenAI (optional) | AI inference | Deliberation queries (no PII policy) | DPA required |
| Sentry (optional) | Error tracking | Stack traces, request metadata | DPA required |

All vendors processing personal data must sign a **Data Processing Agreement (DPA)** before being granted access.

---

## 11. Policy Violations

Violations of this policy may result in disciplinary action up to and including termination, and may be reported to relevant authorities where legally required.

---

## 12. Review and Approval

| Role | Name | Date |
|---|---|---|
| Security Lead | ___________________ | April 2026 |
| Engineering Lead | ___________________ | April 2026 |
| CEO | ___________________ | April 2026 |
