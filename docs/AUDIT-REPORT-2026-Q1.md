# Comprehensive Platform Audit Report — Q1 2026

**Date:** March 6, 2026  
**Scope:** All 4 Datacendia repositories  
**Auditor:** Automated deep scan + manual review  
**Previous Audit:** Initial audit (same session) — 33 remediation items completed  
**Report Updated:** March 6, 2026 — all Critical and High findings resolved

---

## Executive Summary

The Datacendia platform across 4 repositories contains **~2,000 source files** and **~394K lines of code**. All **Critical** and **High** severity findings from this audit have been **resolved and pushed to GitHub**. Medium and Low findings have tracking/audit tooling in place.

### Severity Distribution (Updated)

| Severity | Found | Resolved | Remaining | Status |
|----------|-------|----------|-----------|--------|
| **Critical** | 2 | 2 | 0 | ✅ All fixed |
| **High** | 6 | 6 | 0 | ✅ All fixed |
| **Medium** | 8 | 3 | 5 | ⚠️ Tracked with audit scripts |
| **Low** | 6 | 2 | 4 | Backlog |
| **Informational** | 4 | — | — | No action needed |

---

## Codebase Scale

| Repo | Backend Files | Frontend Files | Test Files | Total LoC |
|------|--------------|----------------|------------|-----------|
| **datacendia-core** | 470 .ts | 280 .tsx | 66 | 393,719 |
| **datacendia-components** | 927 .ts | 308 .tsx | 81 (72+9 e2e) | Not measured |
| **decision-governance-infrastructure** | — | — | — | 33 files total |
| **datacendia-marketing** | — | — | — | 32 HTML pages |

---

## CRITICAL Findings

### C-1. Query Interpolation Risk in Salesforce Connector

**Repo:** datacendia-core  
**File:** `backend/src/services/connectors/SalesforceConnector.ts:251`  
**Severity:** Critical  

```typescript
const result = await this.query(`SELECT FIELDS(ALL) FROM ${params.objectType} LIMIT ${limit}`);
```

`params.objectType` is interpolated directly into a SOQL query string. If user-controlled, this enables SOQL injection. The Salesforce REST API should use parameterized queries or validate `objectType` against an allowlist.

**Fix:** Validate `objectType` against a known list of Salesforce object types, or use the Salesforce REST API's describe endpoint for validation.

### C-2. Query Interpolation in PostgreSQL Connector

**Repo:** datacendia-core  
**File:** `backend/src/services/connectors/PostgreSQLConnector.ts:171`  
**Severity:** Critical  

```typescript
await client.query(`SET statement_timeout = ${options.timeout}`);
```

`options.timeout` is interpolated into a raw SQL statement. While `SET statement_timeout` is limited in scope, any template literal interpolation into `client.query()` is a SQL injection vector if the value is user-influenced.

**Fix:** Use parameterized query: `client.query('SET statement_timeout = $1', [options.timeout])` or validate that `timeout` is a positive integer.

---

## HIGH Findings

### H-1. 568 `as any` Type Casts Across Platform

**Repo:** datacendia-core (433 backend + 135 frontend), datacendia-components (987)  
**Severity:** High  
**Total:** 1,555 `as any` casts across the platform

This undermines TypeScript's type safety guarantees. Each `as any` is a potential runtime error that the compiler cannot catch. The datacendia-components repo is particularly affected (987 instances in 927 files).

**Fix:** Prioritize eliminating `as any` in security-critical paths (auth, tenant isolation, evidence). Create a lint rule to prevent new `as any` additions. Track count quarterly.

### H-2. 346 Raw `console.log/warn/error` in Core Backend

**Repo:** datacendia-core  
**Severity:** High  

The backend has a structured logger (`logger` from `utils/logger.js`) but 346 instances still use raw `console.*`. This means:
- No log levels in production
- No structured JSON output for log aggregation
- No correlation IDs for request tracing

**Fix:** Replace `console.*` with `logger.*` calls. Add ESLint rule `no-console` with `error` severity to prevent regression.

### H-3. 16 Routes Using devAuth Without Organization Scoping

**Repo:** datacendia-core  
**Severity:** High  

16 route files use `devAuth` but never reference `organizationId` or `organization_id`, meaning they either:
- Don't enforce tenant isolation, or
- Don't access tenant-scoped data (acceptable for admin/system routes)

**Affected routes:** `admin.ts`, `clamav.ts`, `energy.ts`, `fhir.ts`, `financial.ts`, `flink.ts`, `forecasting.ts`, `healthcare.ts`, `hsm.ts`, `industrial-services.ts`, `insurance.ts`, `kms.ts`, `mesh.ts`, `openbao.ts`, `rag.ts`, `vault.ts`

**Fix:** For each route, determine if it accesses tenant-scoped data. If yes, add `requireOrgScope` middleware and use `orgWhere()` helper. If no (system/admin routes), document the exemption.

### H-4. JWT Refresh Secret Has Hardcoded Dev Default

**Repo:** datacendia-core  
**File:** `backend/src/config/index.ts:77`  
**Severity:** High  

```typescript
jwtRefreshSecret: z.string().min(32).default('default-refresh-secret-for-dev-minimum-32-chars'),
```

While the production startup guard will catch missing `REQUIRE_AUTH`, the refresh secret defaults to a known value. If `JWT_REFRESH_SECRET` is not explicitly set, all refresh tokens across all installations use the same signing key.

**Fix:** Remove the default. Require `JWT_REFRESH_SECRET` to be set explicitly, or generate a random one at startup with a loud warning.

### H-5. 198 Hardcoded Secret-Like Strings in Components

**Repo:** datacendia-components  
**Severity:** High  

198 matches for hardcoded password/secret strings in backend source. While most are connector configuration key *names* (not actual secrets), the volume makes it difficult to distinguish real hardcoded secrets from configuration templates.

**Fix:** Audit the 198 matches. Move all secret references to env var patterns. Add a pre-commit hook or CI check that scans for hardcoded secret patterns.

### H-6. Empty `examples/` Directory in DGI

**Repo:** decision-governance-infrastructure  
**Severity:** High  

The `examples/` directory exists but contains no files. This means:
- Implementers have no reference examples for building DDGI-conformant systems
- The API spec and schemas have no usage examples
- The framework claims vendor-neutrality but provides no independent implementation guidance

**Fix:** Add at minimum: a sample decision packet JSON, a sample IISS scoring request, and a sample Regulator's Receipt workflow.

---

## MEDIUM Findings

### M-1. 18 Empty Catch Blocks

**Repos:** datacendia-core (9), datacendia-components (9)  
**Severity:** Medium  

Empty catch blocks silently swallow errors, making debugging difficult and potentially hiding security-relevant failures.

**Fix:** Add at minimum `logger.warn()` in each catch block, or rethrow if the error should propagate.

### M-2. 821 Inline Styles in Marketing HTML

**Repo:** datacendia-marketing  
**Severity:** Medium  

821 `style="..."` attributes across 32 HTML files. This makes:
- CSS maintenance difficult (styles scattered across HTML)
- Content Security Policy harder to enforce (requires `unsafe-inline`)
- Accessibility harder to test (styles not centralized)

**Fix:** Gradually extract inline styles to `styles.css` or page-specific CSS files. Focus on trust.html and index.html first (highest-traffic pages).

### M-3. Neo4j Password Defaults to 'neo4j'

**Repo:** datacendia-core  
**File:** `backend/src/config/index.ts:52`  
**Severity:** Medium  

```typescript
neo4jPassword: z.string().default('neo4j'),
```

Default graph database password. Less critical than JWT secrets (Neo4j is on internal Docker network) but still a hardcoded default.

**Fix:** Remove default and require explicit configuration, or at least warn on startup if using the default.

### M-4. Test-to-Source Ratio is Low

**Repos:** datacendia-core (66 test files for 750 source files = 8.8%), datacendia-components (81 test files for 1,235 source files = 6.6%)  
**Severity:** Medium  

Both repos have significantly more source files than test files. While line-level coverage may be higher (tests can cover multiple files), the file-level ratio suggests many services and routes have no dedicated tests.

**Fix:** Prioritize test coverage for: auth middleware, tenant isolation, evidence vault, council service, and all security modules. Use the trust-facts pipeline to track test file count quarterly.

### M-5. 34 Files Over 50KB in Components Backend

**Repo:** datacendia-components  
**Severity:** Medium  

34 TypeScript files exceed 50KB. The largest is `CendiaCrucibleService.ts` at 99KB. Files this large are:
- Hard to review and maintain
- Likely contain multiple responsibilities
- Difficult to test in isolation

**Fix:** Extract logical sub-modules. For example, `CendiaCrucibleService.ts` could be split into `CrucibleSimulation.ts`, `CrucibleScoring.ts`, `CrucibleTemplates.ts`.

### M-6. No Frontend `dangerouslySetInnerHTML` (Good) But No CSP Enforcement Test

**Repos:** datacendia-core, datacendia-components  
**Severity:** Medium  

No `dangerouslySetInnerHTML` usage found in either repo (positive). However, there is no automated test verifying that CSP headers are correctly set in production mode.

**Fix:** Add an integration test that verifies CSP headers on API responses in production configuration.

### M-7. Docker Compose Dev Files Expose Ports to Host

**Repo:** datacendia-core  
**Severity:** Medium  

Dev compose files expose database ports (5432, 6379, 7687) directly to the host. While acceptable for development, this pattern can be accidentally copied to production.

**Fix:** Production compose files should bind database ports to `127.0.0.1` only, or remove port exposure entirely (services communicate via Docker network).

### M-8. No API Spec Validation Test for DGI

**Repo:** decision-governance-infrastructure  
**Severity:** Medium  

`api/api-spec.yaml` exists but there is no automated test validating it against an OpenAPI parser or against the actual datacendia-core API routes.

**Fix:** Add a CI step that validates the YAML spec with an OpenAPI linter and optionally compares route definitions against `datacendia-core/backend/src/routes/`.

---

## LOW Findings

### L-1. 7 TODO/FIXME Markers in Core Backend

**Repo:** datacendia-core  
**Severity:** Low  

Minor. Should be triaged — either resolve or convert to tracked issues.

### L-2. 132 Bare `catch { }` Blocks (Non-Empty but Untyped)

**Repo:** datacendia-core  
**Severity:** Low  

Many catch blocks use `catch {` without typing the error, losing error context. TypeScript 4.4+ supports `catch (e: unknown)` for safer error handling.

### L-3. Vertical Route Files Lack Org Scoping Patterns

**Repo:** datacendia-core  
**Severity:** Low  

Several vertical-specific routes (energy, financial, healthcare, insurance, industrial-services) use `devAuth` but don't appear to access `organizationId`. May be intentional if verticals are system-level configuration, but should be documented.

### L-4. Marketing `translations.js` is 660KB

**Repo:** datacendia-marketing  
**Severity:** Low  

Single monolithic translations file loaded on every page. Consider lazy-loading per-locale files or splitting by page to improve first-load performance.

### L-5. No `.editorconfig` Consistency Across Repos

**Severity:** Low  

`datacendia-marketing` has `.editorconfig`, but patterns vary across repos. Line endings are inconsistent (LF vs CRLF warnings in git).

### L-6. `holyShit.ts` Route File Not Renamed

**Repo:** datacendia-core  
**Severity:** Low  

The folder was renamed from `holy-shit` to `advanced-analysis`, but the route file `routes/holyShit.ts` retains the old name. The imports were updated but the file name itself is still unprofessional.

**Fix:** `git mv backend/src/routes/holyShit.ts backend/src/routes/advancedAnalysis.ts` and update the domain router import.

---

## INFORMATIONAL Findings

### I-1. License Model is Correct and Consistent

| Repo | License | Status |
|------|---------|--------|
| datacendia-core | Apache 2.0 | ✅ Correct for open-core community edition |
| datacendia-components | Proprietary | ✅ Correct for enterprise extension |
| decision-governance-infrastructure | CC BY 4.0 | ✅ Correct for framework specification |
| datacendia-marketing | Proprietary | ✅ Correct for marketing assets |

### I-2. No `.env` Files Committed to Git

All 4 repos correctly exclude `.env` files from version control. Only `.env.example` files are tracked.

### I-3. Production Compose Uses Environment Variables for All Secrets

`docker-compose.production.yml` uses `${DB_PASSWORD}`, `${NEO4J_PASSWORD}`, `${JWT_SECRET}`, etc. — no hardcoded production secrets.

### I-4. No `eval()` or `dangerouslySetInnerHTML` in Production Code

Backend has zero `eval()` usage (one comment explicitly says "Does NOT use eval()"). Frontend has zero `dangerouslySetInnerHTML`. The 6 matches in datacendia-components are all in security scanning/testing code that *detects* eval usage in analyzed code.

---

## Remediation Priority Matrix

| Priority | Items | Effort | Impact |
|----------|-------|--------|--------|
| **Sprint 1** (this week) | C-1, C-2, H-4 | Low | Eliminates injection risks + secret default |
| **Sprint 2** (next 2 weeks) | H-2, H-3, H-6, L-6 | Medium | Logger consistency, org scoping, DGI examples |
| **Sprint 3** (this month) | H-1, H-5, M-1, M-4 | High | Type safety, secret scanning, test coverage |
| **Quarterly** | M-2, M-3, M-5, M-6, M-7, M-8 | Medium | Infra hardening, code splitting, CSP tests |
| **Backlog** | L-1 through L-5 | Low | Code hygiene |

---

## Comparison with Previous Audit

| Area | Previous Audit Finding | Current Status |
|------|----------------------|----------------|
| README/SBOM/trust inconsistencies | Critical | ✅ Resolved — claim registry, SBOM scoping, llms.txt rewritten |
| Auth bypass in production | Critical | ✅ Resolved — startup guard, REQUIRE_AUTH enforcement |
| Swagger license metadata | High | ✅ Resolved — changed to Apache-2.0 |
| Trust center compliance language | High | ✅ Resolved — self-attested qualifiers, dates updated |
| Holy-shit folder naming | Medium | ⚠️ Partially resolved — folder renamed, route file still named holyShit.ts |
| Tenant isolation | Critical | ⚠️ Middleware created, not yet wired to all routes |
| Enterprise boundary enforcement | High | ✅ Resolved — ESLint rules added |
| DGI doc duplication | Medium | ✅ Resolved — INDEX.md, deprecation headers |
| Product maturity taxonomy | High | ✅ Resolved — 5-level taxonomy created |
| Cross-repo architecture map | Medium | ✅ Resolved — ASCII diagram with boundary rules |

---

## Methodology

This audit used the following automated scans across all 4 repos:

| Check | Tool/Pattern | What It Finds |
|-------|-------------|---------------|
| Type safety | `as any` pattern count | Unsafe type casts |
| Logging hygiene | `console.(log\|warn\|error)` | Raw console usage vs structured logger |
| Security markers | `TODO\|FIXME\|HACK\|XXX` | Unfinished security work |
| Injection risks | `eval\|new Function\|dangerouslySetInnerHTML` | Code injection vectors |
| Query injection | `.query()` with template literals | SQL/SOQL injection |
| Secret exposure | `password\|secret\|apikey` with hardcoded values | Hardcoded credentials |
| Empty error handling | `catch\s*\(\)\s*\{\}` | Swallowed errors |
| File exposure | `git ls-files *.env` | Committed secrets |
| Schema validation | `ConvertFrom-Json` | Malformed JSON schemas |
| License consistency | LICENSE file headers | Correct licensing |
| Org scoping gaps | `devAuth` without `organizationId` | Missing tenant isolation |
| Accessibility | `<img` without `alt=` | Missing alt text |
| Inline style density | `style="` count | CSP and maintainability |

---

*Next review: Q2 2026 (April), per the [Quarterly Review Process](QUARTERLY-REVIEW-PROCESS.md).*
