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
| 0.1.x   | ✅ Current |

## Security Features

Datacendia is built with security as a core principle:

- **Cryptographic audit trails** — Merkle tree integrity for all decisions
- **Post-quantum KMS** — Dilithium, SPHINCS+, Falcon signatures
- **JWT authentication** — Access + refresh token rotation
- **bcrypt password hashing** — 12-round salt
- **Rate limiting** — Per-endpoint and per-IP
- **Input validation** — Zod schemas on all API inputs
- **CORS** — Configurable origin allowlist
- **Helmet.js** — Security headers
- **SQL injection protection** — Prisma ORM parameterized queries
- **Path traversal protection** — Middleware validation
- **CSRF protection** — Token-based (production mode)

## Responsible Disclosure

We follow a 90-day responsible disclosure policy. If you report a vulnerability, we will:

1. Acknowledge within 48 hours
2. Investigate and confirm within 7 days
3. Issue a fix within 90 days
4. Credit you in the changelog (unless you prefer anonymity)
