# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Datacendia, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, email **security@datacendia.com** with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

We will acknowledge your report within 48 hours and provide a timeline for a fix.

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.2.x   | ✅ Yes (current) |
| 0.1.x   | Security fixes only |

## Vulnerability Disclosure

A machine-readable vulnerability disclosure policy is available at `/.well-known/security.txt` (NYDFS 23 NYCRR §500.20 compliant).

Email **security@datacendia.com** — PGP key available on request.

## Security Features

Datacendia is built with security as a core principle:

- **Cryptographic audit trails** -- Merkle tree integrity for all decisions
- **Post-quantum KMS** -- Dilithium, SPHINCS+, Falcon signatures
- **JWT authentication** -- Access + refresh token rotation
- **bcrypt password hashing** -- 12-round salt
- **Rate limiting** -- Per-endpoint and per-IP
- **Input validation** -- Zod schemas on all API inputs
- **CORS** -- Configurable origin allowlist
- **Helmet.js** -- Security headers (HSTS, CSP, X-Frame-Options, etc.)
- **SQL injection protection** -- Prisma ORM parameterized queries
- **Path traversal protection** -- Middleware validation
- **CSRF protection** -- Token-based (production mode)
- **AI Regulatory Enforcement** -- `aiRegulatoryMiddleware` classifies all AI inference requests; hard-blocks EU AI Act Art. 5 prohibited practices and IL AIVIA non-consent requests with HTTP 451
- **PHI Enforcement** -- `phiEnforcementMiddleware` blocks health-domain AI requests unless PHI is de-identified or a HIPAA BAA is on file (FTC HBNR 2024 + HIPAA §164.502)
- **Multi-framework Breach Detection** -- `IncidentMaterialityService` generates 14-jurisdiction breach notification plans
- **7-year audit retention** -- All audit events stored in `audit_logs` with append-only policy

## Authentication Modes

Datacendia supports multiple authentication modes, selected by environment:

| Mode | `NODE_ENV` | `REQUIRE_AUTH` | Behavior |
|------|-----------|----------------|----------|
| **Production** | `production` | `true` (required) | JWT Bearer tokens only. Server refuses to start without `REQUIRE_AUTH=true`. |
| **Development** | `development` | `false` | Dev bypass active: requests without tokens are authenticated as the seeded admin user. Tokens are still validated when provided. |
| **Test** | `test` | `false` | Same as development. |
| **Enterprise SSO** | any | n/a | Keycloak OIDC/SAML via `keycloak-connect`. Bearer-only mode (no browser redirects from API). |

### Startup Guard

The server will **refuse to start** if `NODE_ENV=production` and `REQUIRE_AUTH` is not set to `true`. This prevents accidental deployment with dev auth bypass active.

## Token Persistence Threat Model

### Current Design

- **Access tokens**: JWT, stored in browser `localStorage` via Zustand persist
- **Refresh tokens**: JWT, stored in browser `localStorage`
- **Token rotation**: Access tokens expire per `JWT_EXPIRES_IN` (default 1h); refresh tokens per `JWT_REFRESH_EXPIRES_IN` (default 30d)
- **Token revocation**: Logout adds tokens to Redis blacklist

### Known Tradeoffs

| Risk | Mitigation | Residual Risk |
|------|-----------|---------------|
| XSS can steal localStorage tokens | CSP headers, input sanitization, Helmet.js | If XSS bypasses CSP, tokens are exposed |
| Token replay after theft | Short access token TTL (1h), Redis blacklist on logout | Stolen tokens valid until expiry if not explicitly revoked |
| Refresh token theft | 30-day TTL, single-use rotation planned | Long-lived refresh tokens increase exposure window |

### Recommended Hardening (Future)

- Move to `httpOnly` cookie-based sessions for browser flows
- Implement refresh token rotation (one-time use)
- Add device fingerprinting for token binding
- Consider BFF (Backend-for-Frontend) pattern for browser clients

## Trust Boundaries

```
┌─────────────────────────────────────────────────────┐
│                    PUBLIC INTERNET                    │
│  (untrusted)                                         │
└──────────────────────┬──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Rate Limiter   │
              │   CORS / CSP     │
              │   Helmet.js      │
              └────────┬────────┘
                       │
         ┌─────────────▼──────────────┐
         │     API BOUNDARY (Express)  │
         │  ┌──────────────────────┐   │
         │  │  Auth Middleware      │   │
         │  │  (JWT / devAuth)      │   │
         │  └──────────┬───────────┘   │
         │             │               │
         │  ┌──────────▼───────────┐   │
         │  │  CSRF Protection      │   │
         │  │  (double-submit)      │   │
         │  └──────────┬───────────┘   │
         │             │               │
         │  ┌──────────▼───────────┐   │
         │  │  Input Validation     │   │
         │  │  (Zod, sanitization)  │   │
         │  └──────────┬───────────┘   │
         │             │               │
         │  ┌──────────▼───────────┐   │
         │  │  Route Handlers       │   │
         │  │  (org-scoped)         │   │
         │  └──────────┬───────────┘   │
         └─────────────┼──────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │          INTERNAL SERVICES           │
    │                                      │
    │  ┌──────────┐  ┌──────────┐         │
    │  │ Postgres │  │  Redis   │         │
    │  │ (Prisma) │  │ (cache)  │         │
    │  └──────────┘  └──────────┘         │
    │  ┌──────────┐  ┌──────────┐         │
    │  │  Neo4j   │  │  Ollama  │         │
    │  │ (graph)  │  │  (LLM)   │         │
    │  └──────────┘  └──────────┘         │
    │  ┌──────────┐  ┌──────────┐         │
    │  │  Qdrant  │  │ Socket.IO│         │
    │  │ (vector) │  │ (realtime│         │
    │  └──────────┘  └──────────┘         │
    └─────────────────────────────────────┘
```

### Boundary Rules

1. **Public → API**: All requests pass through rate limiter, CORS, auth middleware
2. **API → Services**: Internal services (Postgres, Redis, Neo4j, Ollama) are not directly exposed
3. **Webhook ingress**: Separate auth path (API key + HMAC signature), own rate limit
4. **CSRF exemptions**: Only `/webhooks`, `/integrations/webhook`, `/contact`, `/health`
5. **Community vs Enterprise**: Enterprise features gated by subscription tier checks, not network isolation
6. **Tenant scoping**: `req.organizationId` set by auth middleware; route handlers must enforce org-scoped queries

### Tenant Isolation Model

- **Auth layer**: JWT contains `organizationId`; verified against database
- **Cache layer**: Cache keys prefixed with org ID (`org:{id}:...`)
- **Query layer**: Route handlers check `simulation.organization_id !== req.organizationId`
- **Admin**: Impersonation requires `SUPER_ADMIN` role; audit log generated
- **Status**: Tenant-awareness is implemented; full row-level enforcement is being hardened

## Responsible Disclosure

We follow a **90-day responsible disclosure policy** (coordinated disclosure). If you report a vulnerability, we will:

1. Acknowledge within **48 hours**
2. Investigate and confirm within **7 business days**
3. Issue a fix within **90 days** (critical vulnerabilities: 30 days)
4. Credit the reporter in the CHANGELOG unless anonymity is requested

Hall of Fame: researchers who have responsibly disclosed vulnerabilities are acknowledged in [CHANGELOG.md](CHANGELOG.md).

## Regulatory Compliance

Datacendia's security controls are mapped to:

| Framework | Document | Status |
|---|---|---|
| ISO 27001:2022 | `docs/iso27001/` | In progress — cert target Q1 2027 |
| SOC 2 Type II | `docs/soc2/` | Observation starts Nov 2026 |
| NIST CSF 2.0 | `docs/compliance/nist-csf2-mapping.md` | Mapped |
| NIST AI RMF | `docs/nist-ai-rmf/ai-rmf-profile.md` | 68% aligned |
| CIS Controls v8 | `docs/compliance/cis-controls-v8.md` | 57% IG1+IG2 |
| MITRE ATT&CK v15 | `docs/compliance/mitre-attack-mapping.md` | 79% tactic coverage |
| NYDFS 23 NYCRR 500 | `docs/compliance/nydfs-sec-compliance.md` | Substantially compliant |
| HIPAA | `docs/legal/hipaa-baa-template.md` | BAA template ready |

See [MASTER-COMPLIANCE-TRACKER.md](docs/compliance/MASTER-COMPLIANCE-TRACKER.md) for the full status of all 50+ regulatory obligations.
