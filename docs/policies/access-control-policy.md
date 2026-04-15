# Access Control Policy
**Datacendia, LLC**
**Version:** 1.0 | **Effective:** April 2026 | **Owner:** Engineering Lead
**Review Cadence:** Annual + upon any role/personnel change
**SOC 2 Criteria:** CC6.1, CC6.2, CC6.3

---

## 1. Purpose

Define how access to Datacendia systems, data, and infrastructure is granted, reviewed, modified, and revoked to enforce least privilege and need-to-know principles.

---

## 2. Role Definitions

### 2.1 Application Roles

| Role | Description | MFA Required | Privileges |
|---|---|---|---|
| `SUPER_ADMIN` | Platform-level operator (Datacendia staff only) | **Yes** | Full platform access; can manage all organisations |
| `OWNER` | Organisation owner | **Yes** | Full org management; billing; can promote/demote ADMINs |
| `ADMIN` | Organisation administrator | **Yes** | Manage users, API keys, audit logs, settings within org |
| `ANALYST` | Standard analyst user | No (recommended) | Create and participate in deliberations; view dashboards |
| `VIEWER` | Read-only access | No | View deliberations and reports; no create/edit |

### 2.2 Infrastructure Roles

| System | Role | Assigned To | Access Method |
|---|---|---|---|
| Railway (Production) | Admin | Engineering Lead only | Railway dashboard + 2FA |
| Neon (Database) | Owner | Engineering Lead only | Neon console + 2FA |
| Redis/Upstash | Admin | Engineering Lead only | Upstash console + 2FA |
| SendGrid | Admin | Engineering Lead only | SendGrid dashboard + 2FA |
| GitHub (production branch) | Maintainer | Engineering Lead + CTO | GitHub SSO + 2FA enforced |

---

## 3. Access Provisioning

### 3.1 New Employees / Contractors
1. Manager submits access request specifying required role and justification
2. Engineering Lead reviews and approves within 3 business days
3. Account created with minimum role necessary (default: `ANALYST`)
4. Temporary credentials issued via email; user must change password on first login
5. MFA enrollment required within **24 hours** for ADMIN/OWNER/SUPER_ADMIN

### 3.2 Role Escalation
- Any escalation to ADMIN, OWNER, or SUPER_ADMIN requires **explicit written approval** from the Engineering Lead or CEO
- All role changes are logged to `audit_logs` (event: `admin.permission_granted`)

### 3.3 Third-Party / API Access
- External integrations use **API keys** (never user credentials)
- API keys are scoped to minimum required permissions
- API keys are stored as SHA-256 hashes in the database
- API keys expire after 1 year by default; shorter TTL required for sensitive scopes

---

## 4. Access Review

| Frequency | Scope | Owner | Evidence |
|---|---|---|---|
| **Quarterly** | All ADMIN/OWNER/SUPER_ADMIN accounts; ensure MFA is enabled, role is still appropriate | Engineering Lead | Access review log in `docs/evidence/access-reviews/` |
| **On termination** | All accounts | Engineering Lead | Must be completed within **24 hours** of termination notice |
| **On role change** | Affected user only | Manager + Engineering Lead | Role change request ticket |
| **Annually** | All users + API keys | Engineering Lead | Full access certification report |

---

## 5. Access Revocation

### 5.1 Employee Termination
1. HR notifies Engineering Lead on or before last day
2. Engineering Lead disables user account (status → `DISABLED`) within 24 hours
3. All active sessions invalidated via Redis blacklist
4. API keys owned by user revoked
5. Password reset invalidated
6. Departure documented in `docs/evidence/access-reviews/offboarding-YYYY-MM-DD.md`

### 5.2 Emergency Revocation (Suspected Compromise)
```sql
-- Immediately disable account and kill all sessions
UPDATE users SET status = 'DISABLED' WHERE id = '<user_id>';
UPDATE sessions SET expires_at = NOW() WHERE user_id = '<user_id>';
UPDATE api_keys SET revoked_at = NOW() WHERE user_id = '<user_id>';
```
Then: flush Redis keys `session:*:<user_id>` and `blacklist:*` for that user.

---

## 6. Privileged Access Controls

For ADMIN, OWNER, and SUPER_ADMIN roles:
- MFA (TOTP) **must** be enabled — enforced by `authenticate` middleware in `backend/src/middleware/auth.ts`
- All privileged actions are logged to `audit_logs` with full context
- Admin accounts must not be shared between individuals
- SUPER_ADMIN role is restricted to Datacendia staff only and requires CEO sign-off

---

## 7. Production System Access

| System | Access Method | Who | Frequency |
|---|---|---|---|
| Railway dashboard | SSO + 2FA | Engineering Lead only | As needed |
| Database (direct SQL) | Neon console + IP allowlist | Engineering Lead only | Break-glass only |
| Redis (direct) | Upstash console | Engineering Lead only | Break-glass only |
| Production logs | Railway log viewer | Engineering Lead, CTO | As needed |

**Direct database access to production is break-glass only** — all normal operations go through the application API.

---

## 8. Enforcement

The `authenticate` middleware (`backend/src/middleware/auth.ts`) enforces:
- Valid JWT required for all protected endpoints
- Blacklisted tokens rejected immediately
- MFA check for privileged roles (CC6.1)
- `requireRole()` middleware enforces role-based access per route

The `requireOrgScope` middleware enforces tenant isolation — users can only access data within their organisation.

---

## 9. Review and Approval

| Role | Name | Date |
|---|---|---|
| Engineering Lead | ___________________ | April 2026 |
| CEO | ___________________ | April 2026 |
