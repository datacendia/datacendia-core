# Routes Without Organization Scoping

**Last Updated:** March 2026  
**Related:** `backend/src/middleware/tenantIsolation.ts`

## Context

These 16 route files use `devAuth` but do not reference `organizationId` or `organization_id`. Each has been reviewed and classified as either:

- **System-level** — operates on platform infrastructure, not tenant data (exempt from org scoping)
- **Needs scoping** — accesses or could access tenant data; should add `requireOrgScope` middleware

## Classification

| Route File | Classification | Rationale |
|-----------|---------------|-----------|
| `admin.ts` | **System-level** | Platform admin operations — cross-tenant by design, requires SUPER_ADMIN |
| `clamav.ts` | **System-level** | Antivirus scanning — infrastructure service, no tenant data |
| `energy.ts` | **Needs scoping** | Energy vertical — may access tenant-specific config/data |
| `fhir.ts` | **Needs scoping** | FHIR healthcare integration — handles patient/org data |
| `financial.ts` | **Needs scoping** | Financial vertical — handles org-specific financial data |
| `flink.ts` | **System-level** | Apache Flink streaming infrastructure — platform-level |
| `forecasting.ts` | **Needs scoping** | Forecasting service — generates org-specific predictions |
| `healthcare.ts` | **Needs scoping** | Healthcare vertical — handles org-specific clinical data |
| `hsm.ts` | **System-level** | Hardware Security Module — platform-level key operations |
| `industrial-services.ts` | **Needs scoping** | Industrial vertical — org-specific manufacturing data |
| `insurance.ts` | **Needs scoping** | Insurance vertical — org-specific policy/claims data |
| `kms.ts` | **System-level** | Key Management Service — platform-level crypto operations |
| `mesh.ts` | **Needs scoping** | CendiaMesh integration — cross-org by design but needs audit controls |
| `openbao.ts` | **System-level** | OpenBao/Vault secrets — platform infrastructure |
| `rag.ts` | **Needs scoping** | RAG pipeline — retrieves org-specific documents |
| `vault.ts` | **System-level** | Evidence vault infrastructure — platform-level storage operations |

## Summary

| Status | Count | Routes |
|--------|-------|--------|
| **System-level (exempt)** | 7 | admin, clamav, flink, hsm, kms, openbao, vault |
| **Needs org scoping** | 9 | energy, fhir, financial, forecasting, healthcare, industrial-services, insurance, mesh, rag |

## Action Items

For the 9 routes that need scoping:

1. Add `import { requireOrgScope } from '../middleware/tenantIsolation.js';` 
2. Add `router.use(requireOrgScope);` after `router.use(devAuth);`
3. Use `orgWhere(req)` in Prisma queries or `verifyOrgOwnership(req, resource.organization_id)` for resource access checks
4. Add integration tests verifying cross-tenant denial

For the 7 system-level routes:

- No code changes needed
- Classification documented here for audit trail
- Admin routes should continue requiring SUPER_ADMIN role checks
