# ISO 27017:2015 + ISO 27018:2019 — Cloud Security Controls
**Cloud-Specific Extensions to ISO 27001**
**Document Owner:** Engineering Lead | Version: 1.0 | April 2026
**Target:** Add to ISO 27001 certification scope in Phase 2 (Q2 2027)

---

## ISO 27017:2015 — Information Security for Cloud Services

### Overview

ISO 27017 provides guidance on information security controls for cloud service providers (CSPs) and cloud service customers. It builds on ISO 27001 Annex A with 7 additional cloud-specific controls and implementation guidance for 37 existing controls.

**Certification:** Can be certified alongside ISO 27001 as an extension. Same certification body.

**Why it matters for Datacendia:** Enterprise customers (especially EU and APAC) increasingly ask "are you ISO 27017 certified?" alongside ISO 27001 and SOC 2.

---

### The 7 Additional Cloud-Specific Controls

#### CLD.6.3.1 — Shared Roles and Responsibilities in Cloud Computing

**Guidance:** Document and communicate the division of responsibilities between Datacendia (CSP) and customers (CSC).

**Implementation:**

```markdown
SHARED RESPONSIBILITY MODEL — DATACENDIA

DATACENDIA (Cloud Service Provider) RESPONSIBILITIES:
✅ Physical security of infrastructure (delegated to Railway/Neon)
✅ Hypervisor/host OS security (Railway)
✅ Database security and encryption (Neon PostgreSQL)
✅ Network controls and firewalls (Railway)
✅ Platform application security (Datacendia code)
✅ Access control and authentication infrastructure
✅ Backup and recovery of platform data
✅ Security monitoring and incident detection
✅ Patch management for Datacendia application
✅ RBAC implementation and enforcement

CUSTOMER (Cloud Service Customer) RESPONSIBILITIES:
✅ User identity and access management within their tenant
✅ Data classification and handling of their content
✅ Configuration of deliberation settings and AI parameters
✅ Compliance with laws applicable to their industry/jurisdiction
✅ Employee training on using Datacendia securely
✅ Conducting their own AEDT bias audits (NYC LL 144)
✅ DPIA for their processing activities using Datacendia
✅ Secure storage of any exported data

SHARED RESPONSIBILITIES:
🤝 Data protection (Datacendia provides controls; customer must use them)
🤝 Incident response (Datacendia detects + notifies; customer responds to their obligations)
🤝 Regulatory compliance (Datacendia provides compliance infrastructure; customer applies)
```

#### CLD.8.1.5 — Removal of Cloud Customer Assets

**Guidance:** CSP must ensure cloud service customer assets are removed upon contract termination.

**Implementation:**
- Upon contract termination: all customer data deleted within 30 days (except where legally required to retain)
- Confirmation of deletion provided to customer in writing
- Audit log of deletion retained for 7 years
- Endpoint: `DELETE /api/v1/privacy/erasure` with `scope: 'organisation'` for OWNER role

**Action:** Create `DELETE /api/v1/organisations/:id/data-purge` endpoint for OWNER role with confirmation email and audit log.

#### CLD.9.5.1 — Segregation in Virtual Computing Environments

**Guidance:** CSP must ensure environments are separated between different CSC tenants.

**Implementation:**
- Multi-tenant isolation: `organizationId` enforced on all database queries via Prisma tenant middleware
- No cross-tenant data access possible — validated in security tests
- Separate Redis keyspace per organisation (Upstash key prefix includes `orgId`)
- Audit logs scoped to `organizationId`

**Evidence for auditor:** Demonstrate multi-tenant isolation in code review; show Prisma middleware in security walkthrough.

#### CLD.9.5.2 — Virtual Machine Hardening

**Guidance:** Harden virtual machines used in cloud environments.

**Implementation (delegated to Railway):**
- Railway containers use minimal base images
- Only required ports exposed (3000 application, not SSH)
- No direct access to production containers
- Environment variables in Railway secrets (not in container images)

**Evidence:** Railway security documentation; no SSH access policy.

#### CLD.12.1.5 — Administrator's Operational Security

**Guidance:** Control and log all administrative actions in the cloud environment.

**Implementation:**
- All SUPER_ADMIN and OWNER actions logged in `audit_logs` at severity 'warning' minimum
- Railway administrative access requires Railway account MFA
- No shared administrative credentials
- Neon administrative access requires Neon account MFA

#### CLD.12.4.5 — Monitoring of Cloud Services

**Guidance:** CSP monitors all cloud service components and makes monitoring data available to CSC.

**Implementation:**
- `CendiaPanopticonService` monitors service health, error rates, latency
- Customer-accessible: `GET /api/v1/health` (public) and audit log export
- Railway uptime dashboard: [https://status.railway.app](https://status.railway.app)
- Neon status: [https://status.neon.tech](https://status.neon.tech)

**Action:** Create customer-facing status/uptime endpoint or link to Railway status page in app.

#### CLD.13.1.4 — Alignment of Security Management for Virtual and Physical Networks

**Guidance:** Ensure network security controls are consistently applied across virtual environments.

**Implementation:**
- All traffic encrypted (TLS 1.3 minimum)
- CORS policy restricts origins to datacendia.com domains
- Rate limiting applied to all API endpoints
- No unencrypted inter-service communication

---

### ISO 27001 Control Implementation Guidance (Cloud-Specific)

ISO 27017 provides cloud-specific implementation guidance for these ISO 27001 controls:

| ISO 27001 Control | Cloud-Specific Guidance | Datacendia Status |
|---|---|---|
| A.5.10 — Acceptable use | Cloud service usage policy for employees | 📋 Add to Acceptable Use Policy |
| A.8.2 — Information classification | Classification applies to cloud-stored data | ✅ 4-tier classification |
| A.8.10 — Information deletion | Data erasure on contract end + tenant deletion | 🟡 Need org purge endpoint |
| A.8.11 — Data masking | Masking in non-production environments | 📋 Anonymise data in dev/staging |
| A.9.2 — User provisioning | Provisioning/deprovisioning lifecycle in cloud | ✅ RBAC + offboarding |
| A.12.1 — Operational procedures | Cloud operations procedures documented | 🟡 Partial |
| A.17.2 — Availability of IT facilities | Cloud HA; failover; SLA monitoring | 🟡 Railway HA; no formal SLA yet |

---

## ISO 27018:2019 — PII Protection in Cloud (Public Cloud)

### Overview

ISO 27018 is a Code of Practice for protection of Personally Identifiable Information (PII) in public cloud services. It directly maps to GDPR Article 28 processor obligations.

**Purpose:** Demonstrates GDPR-compliant data processing in cloud to EU regulators and customers — can replace or supplement lengthy DPA negotiations.

### Key ISO 27018 Controls

#### A.1 — Consent and Choice

**Requirement:** CSP shall not use PII for advertising or marketing without explicit consent from CSC.

**Implementation:**
- No advertising on Datacendia platform
- No use of customer data for AI model training
- No sale or sharing of customer PII with third parties for marketing

**Documentation:** Add explicit statement to ToS: "Datacendia does not use customer data for advertising, marketing, or AI model training."

#### A.2 — Purpose Limitation

**Requirement:** CSP shall process PII only for the purpose specified in the customer contract.

**Implementation:**
- Prisma queries limited to serving contracted features
- No background analytics on customer content
- OpenAI requests: prompt data only; no persistent storage at OpenAI (verify via API settings)

#### A.3 — Transparency About Subprocessors

**Requirement:** CSP shall disclose all subprocessors and their roles.

**Implementation:** `GET /api/v1/privacy/policy` lists all 5 subprocessors with purpose, location, and SOC 2 status.

#### A.4 — PII Deletion

**Requirement:** Upon request, CSP shall delete PII within a defined timeframe.

**Implementation:** `DELETE /api/v1/privacy/erasure` — 30 days processing time.

#### A.5 — Breach Notification

**Requirement:** CSP shall promptly notify CSC of PII breaches.

**Implementation:** DPA with each customer includes notification SLA (72 hours to match GDPR).

#### A.6 — PII Disclosure to Third Parties

**Requirement:** CSP shall not disclose PII to third parties without CSC consent or legal compulsion.

**Implementation:**
- PII only shared with listed subprocessors under DPA
- Law enforcement requests: logged; CSC notified (unless prohibited)
- No sale of PII

#### A.7 — PII Sub-Processor Controls

**Requirement:** CSP shall ensure sub-processors provide same level of protection.

**Implementation:** Supplier Security Questionnaire sent to each subprocessor; DPAs include appropriate processor clauses.

#### A.8 — Country of Processing

**Requirement:** CSP shall disclose countries where PII may be processed.

**Implementation:** 
- Database: US (Neon), optionally EU if EU region selected
- Application: US (Railway US region)
- Cache: Global (Upstash) — consider EU-only for EU customers
- Email: US (SendGrid)
- AI: US (OpenAI)

**Action:** Add geographical processing map to privacy policy; offer EU-region database option for EU enterprise customers.

---

## Certification Roadmap

| Phase | Certification | Target | Prerequisites |
|---|---|---|---|
| Phase 1 | ISO 27001:2022 | Q1 2027 | Stage 1 audit Q4 2026 |
| Phase 2 | ISO 27017:2015 | Q2 2027 | ISO 27001 cert; implement 7 CLD controls |
| Phase 2 | ISO 27018:2019 | Q2 2027 | ISO 27001 cert; implement A.1–A.10 controls |
| Phase 3 | ISO 27701:2019 (PIMS) | 2028 | ISO 27001 cert; full ROPA; DPIA process |
| Phase 3 | CSA STAR Level 2 | 2028 | SOC 2 Type II; CAIQ Level 1 done |

**Combined ISO 27001 + 27017 + 27018 audit** can be performed by the same certification body simultaneously — marginal cost of 27017/27018 is ~20–30% on top of 27001.

---

## Action Items

| Action | Standard | Owner | Target |
|---|---|---|---|
| Create shared responsibility model document (above) | ISO 27017 CLD.6.3.1 | Engineering | Q2 2026 |
| Create `DELETE /api/v1/organisations/:id/data-purge` endpoint | ISO 27017 CLD.8.1.5 | Engineering | Q2 2026 |
| Anonymise data in development/staging environments | ISO 27001 A.8.11 | Engineering | Q3 2026 |
| Add "no AI training on customer data" clause to ToS | ISO 27018 A.1 | Legal | Q2 2026 |
| Add geographical processing map to privacy policy | ISO 27018 A.8 | Engineering | Q2 2026 |
| EU-region database option for EU enterprise customers | ISO 27018 A.8 | Engineering | Q4 2026 |
| ISO 27017/27018 added to Stage 2 audit scope | Both | CEO | Oct 2026 |
