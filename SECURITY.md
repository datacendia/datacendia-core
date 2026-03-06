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
| 0.1.x   | Yes (current) |

## Security Features

Datacendia is built with security as a core principle:

- **Cryptographic audit trails** -- Merkle tree integrity for all decisions
- **Post-quantum KMS** -- Dilithium, SPHINCS+, Falcon signatures
- **JWT authentication** -- Access + refresh token rotation
- **bcrypt password hashing** -- 12-round salt
- **Rate limiting** -- Per-endpoint and per-IP
- **Input validation** -- Zod schemas on all API inputs
- **CORS** -- Configurable origin allowlist
- **Helmet.js** -- Security headers
- **SQL injection protection** -- Prisma ORM parameterized queries
- **Path traversal protection** -- Middleware validation
- **CSRF protection** -- Token-based (production mode)

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

We follow a 90-day responsible disclosure policy. If you report a vulnerability, we will:

1. Acknowledge within 48 hours
2. Investigate and confirm within 7 days
3. Issue a fix within 90 days
