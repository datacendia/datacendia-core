# Information Security Risk Register
**ISO/IEC 27001:2022 — Clause 6.1.2 (Information Security Risk Assessment)**
**Document Owner:** Engineering Lead / Acting CISO
**Version:** 1.0 | April 2026
**Review Cadence:** Quarterly (or after significant incidents/changes)

---

## Risk Methodology

### Likelihood Scale
| Score | Label | Description |
|---|---|---|
| 1 | Rare | May occur once in 5+ years |
| 2 | Unlikely | May occur once in 2–5 years |
| 3 | Possible | May occur once per year |
| 4 | Likely | May occur multiple times per year |
| 5 | Almost Certain | Expected to occur frequently |

### Impact Scale
| Score | Label | Description |
|---|---|---|
| 1 | Negligible | No customer impact; minor internal disruption |
| 2 | Minor | Limited customer impact; recoverable quickly |
| 3 | Moderate | Customer data exposure possible; regulatory notification required |
| 4 | Significant | Material data breach; customer churn; regulatory fines |
| 5 | Catastrophic | Total data loss; business failure; criminal liability |

### Risk Score = Likelihood × Impact
| Score | Rating | Response Required |
|---|---|---|
| 1–4 | **Low** | Accept or monitor |
| 5–9 | **Medium** | Mitigate within 90 days |
| 10–14 | **High** | Mitigate within 30 days |
| 15–25 | **Critical** | Immediate action required |

### Risk Treatment Options
- **Mitigate** — Implement controls to reduce likelihood or impact
- **Accept** — Acknowledge risk; within appetite; document acceptance
- **Transfer** — Shift risk via insurance or contract
- **Avoid** — Stop the activity that causes the risk

---

## Risk Register

### Authentication & Access Control Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-001 | Credential compromise via brute force | External attacker | User accounts | 3 | 4 | **12** | High | Mitigate | Account lockout (10 attempts/30 min); Redis rate limiting; MFA for privileged roles | Medium (6) | Engineering Lead |
| R-002 | JWT token theft / session hijacking | External attacker | Active sessions | 2 | 4 | **8** | Medium | Mitigate | JWT 1h expiry; refresh token rotation; HTTPS enforced; session revocation on logout | Low (4) | Engineering Lead |
| R-003 | MFA bypass for ADMIN/OWNER accounts | External attacker | Privileged accounts | 2 | 5 | **10** | High | Mitigate | MFA enforced in middleware for ADMIN/OWNER/SUPER_ADMIN; backup codes encrypted | Medium (6) | Engineering Lead |
| R-004 | Insider threat — unauthorized data access | Malicious employee | Customer data | 2 | 4 | **8** | Medium | Mitigate | RBAC + tenant isolation; audit logging of all data access; quarterly access reviews | Low (4) | Engineering Lead |
| R-005 | Privilege escalation via API vulnerabilities | External/insider | All data | 2 | 5 | **10** | High | Mitigate | `requireRole()` middleware; zod input validation; OWASP controls; CSRF protection | Medium (6) | Engineering Lead |

### Data Security Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-006 | SQL injection / ORM bypass | External attacker | Database | 2 | 5 | **10** | High | Mitigate | Prisma ORM (parameterised queries); SQL injection middleware; input sanitisation | Low (3) | Engineering Lead |
| R-007 | Cross-tenant data leakage | External attacker / bug | Customer data | 2 | 5 | **10** | High | Mitigate | Tenant isolation (`orgWhere()`); `verifyOrgOwnership()`; cross-tenant audit events | Low (4) | Engineering Lead |
| R-008 | Database credential compromise | External attacker | All data | 1 | 5 | **5** | Medium | Mitigate | Credentials in Railway encrypted env vars; rotation capability; Neon IP allowlisting | Low (2) | Engineering Lead |
| R-009 | Unencrypted data at rest | Configuration error | Database, backups | 1 | 4 | **4** | Low | Accept | Neon AES-256 storage encryption; backups encrypted AES-256-CBC; PHI de-identified | Low (2) | Engineering Lead |
| R-010 | Data exfiltration via API | External attacker | Customer data | 2 | 4 | **8** | Medium | Mitigate | `preventDataExfiltration` middleware; response size limits; rate limiting; RBAC | Low (4) | Engineering Lead |
| R-011 | PHI exposure to AI models | Configuration error | PHI (healthcare customers) | 3 | 5 | **15** | **Critical** | Mitigate | PHI de-identification endpoint (`/api/v1/privacy/deidentify`) MUST be used before AI prompts; BAA required | Medium (6) | Engineering Lead |

### Application Security Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-012 | Prompt injection attack on AI agents | External attacker | AI deliberations | 3 | 3 | **9** | Medium | Mitigate | Input sanitisation middleware on `/api/v1/council`; NeMo guardrails; `AdversarialRedTeamService` | Low (4) | Engineering Lead |
| R-013 | Cross-Site Scripting (XSS) | External attacker | User browsers | 2 | 3 | **6** | Medium | Mitigate | React auto-escaping; CSP headers; Helmet.js; input sanitisation | Low (3) | Engineering Lead |
| R-014 | Cross-Site Request Forgery (CSRF) | External attacker | State-changing endpoints | 2 | 3 | **6** | Medium | Mitigate | CSRF tokens (`ensureCsrfToken`, `csrfProtection`); SameSite cookie attribute | Low (2) | Engineering Lead |
| R-015 | Path traversal / directory traversal | External attacker | File system | 1 | 4 | **4** | Low | Mitigate | `pathTraversalMiddleware`; no user-controlled file paths | Low (1) | Engineering Lead |
| R-016 | Dependency supply chain attack | Third-party npm package | Application | 2 | 4 | **8** | Medium | Mitigate | `npm audit` at build; GitHub Dependabot; lockfile; SBOM (`crucible_sbom`) | Medium (4) | Engineering Lead |
| R-017 | Secret / API key leak in source code | Developer error | All external services | 2 | 5 | **10** | High | Mitigate | GitHub secret scanning; env vars only in Railway; `.env` in `.gitignore`; pre-commit hooks | Low (3) | Engineering Lead |

### Infrastructure & Availability Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-018 | Railway service outage | Cloud provider failure | Platform availability | 2 | 4 | **8** | Medium | Transfer/Mitigate | Railway SLA; multi-region capability; BCP with RTO 4h/RPO 1h; Neon PITR | Medium (4) | Engineering Lead |
| R-019 | Database loss / corruption | Hardware failure, human error | All data | 1 | 5 | **5** | Medium | Mitigate | Neon PITR 7 days; daily pg_dump backups; S3 90-day retention; tested restore | Low (2) | Engineering Lead |
| R-020 | DDoS attack | External attacker | Platform availability | 2 | 3 | **6** | Medium | Mitigate | Redis rate limiting; Railway DDoS protection; burst and hourly limits | Low (3) | Engineering Lead |
| R-021 | Ransomware targeting backup storage | External attacker | Backups | 1 | 5 | **5** | Medium | Mitigate | S3 versioning; backups encrypted; S3 access via signed URLs only; MFA delete on S3 | Low (2) | Engineering Lead |

### Compliance & Legal Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-022 | GDPR non-compliance (no Data Subject Rights) | Regulatory audit | Personal data | 3 | 4 | **12** | High | Mitigate | GDPR DSR endpoints implemented (`/api/v1/privacy/*`); privacy policy; ROPA | Medium (6) | Legal / Engineering |
| R-023 | HIPAA violation — PHI in AI models | Regulatory audit | PHI | 3 | 5 | **15** | **Critical** | Mitigate | BAA template; PHI de-identification endpoint; FHIR access audit log | Medium (8) — BAA must be signed | Legal / Engineering |
| R-024 | EU AI Act non-compliance | Regulatory audit | AI system | 2 | 4 | **8** | Medium | Mitigate | EUAIActEngine; Art. 50 transparency headers; GPAI compliance doc; emotion recognition guardrail | Medium (4) | Legal / Engineering |
| R-025 | Data breach — no notification within 72h | Data breach | Personal data | 2 | 4 | **8** | Medium | Mitigate | IR policy defines 72h GDPR notification; breach detection via audit logs and monitoring | Medium (4) | Engineering Lead |
| R-026 | Subprocessor breach (Neon, Railway, etc.) | Third-party failure | All data | 1 | 4 | **4** | Low | Transfer | DPAs with subprocessors; SOC 2 reports reviewed; BCP covers subprocessor failure | Low (2) | Legal |

### AI-Specific Risks

| ID | Risk | Threat Source | Asset | L | I | Score | Rating | Treatment | Controls | Residual | Owner |
|---|---|---|---|---|---|---|---|---|---|---|---|
| R-027 | Biased or discriminatory AI outputs | AI model defect | Customer decisions | 3 | 4 | **12** | High | Mitigate | Bias detection (`NLPBiasDetectionService`, `CognitiveBiasMitigationService`); human-in-the-loop deliberation | Medium (6) | Engineering Lead |
| R-028 | AI model hallucination causing harm | AI model limitation | Customer decisions | 3 | 3 | **9** | Medium | Mitigate | Human oversight (deliberation required); disclaimers; adversarial red-team testing | Low (4) | Engineering Lead |
| R-029 | OpenAI API outage disrupting platform | Provider failure | AI deliberation | 3 | 2 | **6** | Medium | Mitigate | Ollama fallback; multi-provider inference service (`InferenceService.ts`) | Low (2) | Engineering Lead |
| R-030 | Unauthorised AI system use (emotion recognition, social scoring) | Customer misuse | End users | 2 | 5 | **10** | High | Mitigate | EU AI Act Art. 5 guardrail in OPA/NeMo; terms of service prohibition; guardrail implementation pending | High (10) until guardrail built | Engineering Lead |

---

## Risk Treatment Plan

### Critical Risks (Immediate Action)

| Risk | Action | Owner | Target Date |
|---|---|---|---|
| R-011 PHI to AI | Enforce de-identification in FHIR → AI pipeline; add runtime guard | Engineering Lead | 2026-05-01 |
| R-023 HIPAA BAA | Execute BAA before any healthcare customer goes live | Legal | 2026-05-01 |

### High Risks (30-day target)

| Risk | Action | Owner | Target Date |
|---|---|---|---|
| R-001 Brute force | Already mitigated ✅ | — | Done |
| R-003 MFA bypass | Already mitigated ✅ | — | Done |
| R-005 Privilege escalation | Already mitigated ✅ | — | Done |
| R-017 Secret leak | Add pre-commit hook (git-secrets); confirm GitHub secret scanning enabled | Engineering Lead | 2026-05-15 |
| R-022 GDPR DSR | Already mitigated ✅ | — | Done |
| R-027 AI bias | Validate bias detection coverage; document human oversight SLA | Engineering Lead | 2026-05-30 |
| R-030 Prohibited AI | Build emotion recognition guardrail in OPA + NeMo | Engineering Lead | 2026-05-15 |

---

## Risk Acceptance Register

The following risks have been formally accepted by management:

| Risk | Rationale | Accepted By | Date |
|---|---|---|---|
| R-009 Data at rest (physical) | Neon/Railway physical controls covered by their SOC 2; application-layer encryption in place | Engineering Lead | April 2026 |
| R-015 Path traversal | Middleware control is effective; risk score low | Engineering Lead | April 2026 |

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 2026 | Engineering Lead | Initial risk assessment (30 risks identified) |

**Next Review:** July 2026 (quarterly)
**Approved By:** *(CEO signature required)*
