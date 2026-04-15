# CMMC 2.0 & FTC Health Breach Notification Rule — Implementation Guide
**Document Owner:** Engineering Lead + Legal | Version: 1.0 | April 2026

---

## Part 1 — CMMC 2.0 (Cybersecurity Maturity Model Certification)

### Overview

- **Authority:** Department of Defense (DoD); 32 CFR Part 170
- **Final Rule:** Effective December 16, 2024
- **Contract Requirement:** Required in DoD contracts by mid-2025 (phase-in through 2026)
- **Applicability:** Any organisation bidding on or holding DoD contracts involving:
  - Federal Contract Information (FCI) — Level 1
  - Controlled Unclassified Information (CUI) — Level 2 or 3

**Datacendia current status:** Not a DoD contractor. CMMC applies only when pursuing DoD contracts or serving DoD prime contractors as a subcontractor.

---

### CMMC Level Structure

| Level | Foundation | Controls | Assessment | When Required |
|---|---|---|---|---|
| **Level 1** — Foundational | FAR 52.204-21 | 17 basic cyber hygiene controls | Annual self-assessment | FCI only (no CUI) |
| **Level 2** — Advanced | NIST SP 800-171 Rev 2 | 110 practices | Triennial C3PAO assessment OR annual self-assessment | CUI — most DoD programs |
| **Level 3** — Expert | NIST SP 800-172 | 110 + 24 enhanced | DCSA government-led assessment | Critical national security programs |

**Datacendia target level:** Level 2 (if DoD contract pursued that involves CUI)

---

### CMMC Level 2 — NIST SP 800-171 Gap Assessment

The 110 controls map to 14 families. Current Datacendia status:

| Family | Controls | Estimated Compliant | Key Gaps |
|---|---|---|---|
| AC — Access Control | 22 | 18 (82%) | AC.2.006: limit use of portable storage (n/a cloud); AC.3.017: separate duties |
| AT — Awareness & Training | 3 | 1 (33%) | AT.2.056: training for privileged users; AT.3.058: insider threat training |
| AU — Audit & Accountability | 9 | 7 (78%) | AU.3.045: audit log protection from modification; AU.3.051: report/review |
| CM — Configuration Management | 9 | 5 (56%) | CM.2.062: control baseline configurations; CM.3.068: blacklist unnecessary software |
| IA — Identification & Authentication | 11 | 9 (82%) | IA.3.083: use of FIPS-validated cryptography; IA.3.086: disable inactive accounts (already done) |
| IR — Incident Response | 3 | 2 (67%) | IR.2.093: test incident response capability; IR.3.098: track/document all IR activities |
| MA — Maintenance | 6 | 3 (50%) | MA.2.111: sanitize equipment before disposal; MA.3.116: MFA for remote maintenance |
| MP — Media Protection | 9 | 5 (56%) | MP.2.120: control access to CUI on media; MP.3.125: sanitize media before disposal |
| PE — Physical Protection | 6 | 6 (100%) | Cloud-delegated (Railway/Neon) — passes |
| PS — Personnel Security | 2 | 1 (50%) | PS.2.127: screen individuals prior to authorising CUI access |
| RA — Risk Assessment | 3 | 2 (67%) | RA.3.077: periodically scan for vulnerabilities and remediate |
| CA — Security Assessment | 4 | 2 (50%) | CA.2.158: periodic security assessment; CA.3.161: manage exchange of CUI |
| SC — System & Comms Protection | 16 | 11 (69%) | SC.3.187: FIPS-validated cryptography; SC.3.190: CUI isolation in multi-tenant |
| SI — System & Info Integrity | 7 | 5 (71%) | SI.3.218: apply security patches within 14 days (critical); SI.3.220: detect unauthorised changes |

**Overall: ~72% compliant — 31 controls require remediation for Level 2**

### Gap Remediation Plan (if DoD contract pursued)

**Phase 1 — Pre-assessment preparation (6 months)**

| Gap | Action | Effort |
|---|---|---|
| FIPS 140-2 validated cryptography | Replace Node.js crypto with FIPS-validated module; evaluate AWS GovCloud | High |
| CUI isolation in multi-tenant | Implement dedicated tenant databases or schema isolation for CUI | Very High |
| Insider threat training | Add insider threat module to security awareness training | Low |
| Privileged user training | Role-specific training for ADMIN/OWNER users | Low |
| Configuration baseline documentation | Document all Railway environment configurations formally | Medium |
| Vulnerability patching — 14 days for critical | Extend Dependabot to enforce 14-day patch deadline | Low |
| Personnel screening documentation | Formal background check policy for CUI access roles | Low |
| Incident response capability testing | Annual IR tabletop (already planned Q4 2026) | Low |
| Media sanitisation procedures | Digital media disposal policy for laptops/USB | Low |

**Phase 2 — C3PAO Assessment**

- Engage DoD-accredited Certified Third-Party Assessment Organisation (C3PAO)
- Assessment typically takes 3–6 months
- Cost: $75K–$200K for Level 2 assessment
- Recommended C3PAOs: A-LIGN (also does FedRAMP), Coalfire, Schellman

**Estimated timeline from decision to contract:**
- Month 0: Decision to pursue DoD contract
- Month 1–6: Gap remediation
- Month 7–12: C3PAO assessment
- Month 12–18: Conditional CMMC Level 2 certification in SPRS

### CUI Handling Requirements (if applicable)

If Datacendia processes Controlled Unclassified Information:
1. Mark all CUI with required banner markings (per 32 CFR Part 2002)
2. Store CUI only in CUI-designated systems (separate from commercial customer data)
3. Transmit CUI only over FIPS-validated encrypted channels
4. Report CUI spills to DoD Contracting Officer immediately

### CMMC Investment Decision Framework

```
INVEST in CMMC Level 2 when:
  ✅ A specific DoD contract opportunity > $500K is identified
  ✅ Customer explicitly requires CMMC Level 2 in RFP
  ✅ Prime contractor requires CMMC from subcontractors

DO NOT invest until:
  ❌ Speculative — no specific opportunity
  ❌ Revenue from DoD expected < $200K (cost > benefit)
  ❌ ISO 27001 + SOC 2 not yet certified (prerequisites)
```

---

## Part 2 — FTC Health Breach Notification Rule (2024 Amendment)

### Overview

- **Statute:** 16 CFR Part 318; FTC Act §5
- **Amended Rule:** Effective July 29, 2024
- **Enforcer:** Federal Trade Commission (FTC)
- **Civil penalty:** Up to $51,744 per violation per day

### Why This Is Different from HIPAA

| | HIPAA | FTC HBNR |
|---|---|---|
| Applies to | HIPAA Covered Entities + Business Associates | Vendors of Personal Health Records (PHR), apps, devices — any entity NOT covered by HIPAA |
| Scope | Protected Health Information (PHI) | Identifiable health information in PHR ecosystems |
| Examples | Hospital EHR systems, health insurers | Fitness apps, period trackers, wellness platforms, mental health apps, weight loss apps |
| Notification | HHS OCR | FTC + individuals + media |

**Key 2024 amendment expansion:** The amended rule explicitly covers **health apps, connected devices, and online services** that create or receive health information from multiple sources — even if they never deal with HIPAA-covered entities.

### Does FTC HBNR Apply to Datacendia?

**Apply the test:**
1. Does Datacendia create, receive, maintain, or transmit identifiable health information? → Possible — if healthcare customers use AI for patient-related deliberations
2. Is the health information drawn from multiple sources (e.g., the individual + a third party)? → Possible
3. Is Datacendia a HIPAA-covered entity or BA? → Only if signed BAA

**If answer is YES to 1–2 and NO to 3:** FTC HBNR applies in addition to HIPAA.

**Current risk:** LOW — PHI de-identification endpoint (`POST /api/v1/privacy/deidentify`) strips identifiers before any data reaches AI. Maintain this practice.

### Notification Requirements

**Who to notify:**

| Notification | Timing | Threshold |
|---|---|---|
| Affected individuals | Within 60 days of discovery | All affected (first-class mail or email) |
| FTC | Within 60 days of discovery | All breaches (online FTC form) |
| Prominent media in state | Within 60 days | > 500 affected in a single state |
| Consumer reporting agencies (Equifax, Experian, TransUnion) | Within 10 days | > 500 affected in multiple states |

**Notice content (mandatory elements under amended rule):**
1. Brief description of the breach
2. Types of health information involved
3. Steps individuals can take to protect themselves
4. What the entity is doing to investigate, mitigate, and prevent future breaches
5. Contact information (including toll-free number, website URL, postal address)

### FTC HBNR in the Incident Response Policy

Add to `docs/policies/incident-response-policy.md`:

```markdown
## FTC Health Breach Notification (16 CFR Part 318)

Trigger: Any breach of identifiable health information in a Personal Health Record 
ecosystem where Datacendia is NOT operating under a HIPAA BAA.

Assessment: Apply the "PHR vendor test":
- Is health data involved? → Check dataCategories in incident record
- Is it drawn from multiple sources? → Check data flow documentation
- Are we under a HIPAA BAA with this customer? → Check contracts/hipaa-baa-status.md

If FTC HBNR applies:
1. WITHIN 10 DAYS: Notify consumer reporting agencies if > 500 across multiple states
2. WITHIN 60 DAYS: Notify FTC at https://www.ftc.gov/hbn
3. WITHIN 60 DAYS: Notify all affected individuals (first-class mail or email)
4. WITHIN 60 DAYS: Notify prominent media outlets in affected states if > 500 in one state

Use IncidentMaterialityService.assess() with dataCategories: ['health_phi'] 
to auto-generate FTC HBNR notification plan and draft notice.
```

### PHI Safeguards (Prevention)

Current controls preventing FTC HBNR breach risk:

| Control | Implementation | Status |
|---|---|---|
| PHI de-identification before AI | `POST /api/v1/privacy/deidentify` — Safe Harbor method | ✅ |
| PHI de-identification before AI (enforcement) | Runtime check in AI inference routes — **PENDING** | 🔴 |
| BAA required for healthcare customers | `docs/legal/hipaa-baa-template.md` | ✅ Template |
| Audit log of all PHI access | `audit_logs` with 7-year retention | ✅ |
| PHI fields encrypted at rest | Neon AES-256 encryption | ✅ |

**Critical pending action:** Add runtime enforcement that blocks healthcare-domain AI requests unless either:
- Request went through `POST /api/v1/privacy/deidentify` first (tracking via session/request ID), OR
- Customer has a signed HIPAA BAA on file and explicit BAA flag set

---

## Action Summary

| Action | Framework | Owner | Target |
|---|---|---|---|
| CMMC investment decision gate | CMMC 2.0 | CEO | On DoD opportunity |
| FTC HBNR added to IR policy | FTC HBNR 2024 | Legal | Q2 2026 |
| PHI enforcement runtime check (AI routes) | HIPAA + FTC HBNR | Engineering | **May 2026** |
| CMMC Level 1 self-assessment (17 controls) | CMMC 2.0 L1 | Engineering | Q4 2026 if DoD interest |
| CMMC Level 2 C3PAO assessment | CMMC 2.0 L2 | Engineering + C3PAO | 12–18 months from decision |
| security.txt + vulnerability disclosure policy | NYDFS 500 | Engineering | May 2026 |
