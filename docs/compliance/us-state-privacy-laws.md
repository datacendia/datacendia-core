# US State Privacy Laws — Comprehensive Gap Assessment
**Document Owner:** Legal / Engineering Lead
**Version:** 1.0 | April 2026
**Coverage:** 25 states with comprehensive privacy laws in force or enacted

---

## Overview

Since CCPA (2020), a wave of state privacy laws has swept the US. Datacendia's existing GDPR + CCPA compliance infrastructure covers **~80% of requirements** across all state laws — they share a common framework. This document identifies the incremental gaps.

---

## Common Framework (Already Implemented)

All US state privacy laws share these rights — all served by existing `/api/v1/privacy/*` endpoints:

| Right | Endpoint | States |
|---|---|---|
| Right to Know/Access | `GET /api/v1/privacy/access` | All 25 states |
| Right to Delete | `DELETE /api/v1/privacy/erasure` | All 25 states |
| Right to Correct | `PATCH /api/v1/privacy/rectify` | All except Nevada |
| Right to Data Portability | `GET /api/v1/privacy/export` | All 25 states |
| Right to Opt Out of Sale | `POST /api/v1/privacy/ccpa/opt-out` | All 25 states |
| Non-discrimination | Built into policy | All 25 states |

**The key variable across states is: applicability thresholds, sensitive data definitions, and opt-out scope.**

---

## State-by-State Analysis

### Tier 1 — High Priority (Large population + active enforcement)

#### California — CCPA/CPRA
- **In Force:** Jan 2020 (CCPA); Jan 2023 (CPRA)
- **Threshold:** Any business serving CA residents + $25M revenue OR 100K consumer records OR 50%+ revenue from selling data
- **Enforcer:** California Privacy Protection Agency (CPPA) + AG
- **Status:** ✅ Implemented — CCPA endpoints + CPRA sensitive PI categories
- **Unique requirements:** Sensitive PI limit use (`CPRA §1798.121`) — endpoint marked "coming soon"; **add by Q3 2026**
- **Gap:** Opt-out via Global Privacy Control (GPC) browser signal must be honoured automatically — **not yet implemented**

#### Texas — TDPSA (Texas Data Privacy and Security Act)
- **In Force:** Jul 2024
- **Threshold:** >$25M annual revenue AND (processes >100K consumers OR derives >50% revenue from data)
- **Enforcer:** Texas AG (no private right of action)
- **Key rights:** Same as GDPR model — access, correct, delete, portability, opt-out of sale/profiling
- **Unique:** Opt out of profiling for **solely automated decisions with legal/significant effects**
- **Gap:** No profiling opt-out mechanism — add `POST /api/v1/privacy/opt-out-profiling` endpoint
- **Data Protection Assessment:** Required for high-risk processing (profiling, sensitive data, targeted advertising)
- **Status:** 🟡 Mostly covered; profiling opt-out and DPA needed

#### Florida — FDBR (Florida Digital Bill of Rights)
- **In Force:** Jul 2024
- **Threshold:** Global annual revenue >$1B AND one of: (a) >50% revenue from online ads, OR (b) operates an app store, OR (c) operates a search engine
- **Applicability to Datacendia:** ❌ Very likely NOT applicable (revenue threshold eliminates most SaaS startups)
- **Status:** ✅ Out of scope — monitor if revenue grows

#### New York — SHIELD Act
- **In Force:** Mar 2020
- **Scope:** Data security; breach notification — NOT a comprehensive privacy law
- **Requirements:** Reasonable security; notify NY AG + affected residents within 30 days of breach
- **Status:** ✅ Covered by existing IR policy — add 30-day NY breach notification to IR policy

#### Illinois — BIPA (Biometric Information Privacy Act)
- **In Force:** 2008; actively enforced
- **Scope:** Biometric data ONLY (fingerprints, retina scans, facial geometry, voiceprints)
- **Datacendia applicability:** ✅ No biometric processing — not applicable
- **Critical note:** EU AI Act Art. 5 guardrail (already implemented) prevents biometric mass surveillance use cases
- **Status:** ✅ N/A — monitor if any biometric features added

---

### Tier 2 — Medium Priority (Enacted, in force, medium population)

#### Virginia — CDPA (Consumer Data Protection Act)
- **In Force:** Jan 2023
- **Threshold:** ≥100K consumers OR ≥25K consumers + >50% revenue from data
- **Enforcer:** Virginia AG (no private right of action)
- **Rights:** Access, correct, delete, portability, opt out of (sale, targeted advertising, profiling for legal decisions)
- **Unique:** Requires **Data Protection Assessment** for high-risk processing (profiling, sensitive data, targeted advertising)
- **Status:** 🟡 Rights covered; profiling opt-out + Data Protection Assessment template needed

#### Colorado — CPA (Colorado Privacy Act)
- **In Force:** Jul 2023
- **Threshold:** ≥100K consumers OR ≥25K consumers + >50% revenue from data
- **Enforcer:** Colorado AG (no private right of action)
- **Unique:** **Global Privacy Control (GPC) must be honoured** (same as CCPA/CPRA)
- **Universal opt-out mechanism:** Required — must honour browser-level opt-out signals
- **Status:** 🟡 GPC not yet implemented

#### Connecticut — CTDPA (Connecticut Data Privacy Act)
- **In Force:** Jul 2023
- **Threshold:** ≥100K consumers OR ≥25K consumers + >50% revenue from data
- **Rights:** Same framework as Virginia CDPA
- **Status:** 🟡 Rights covered; same gaps as Virginia

#### Oregon — OCPA (Oregon Consumer Privacy Act)
- **In Force:** Jul 2024
- **Threshold:** ≥100K consumers OR ≥25K consumers + >50% revenue from data
- **Unique:** Broadest "sale" definition; includes sharing for advertising; covers non-profits (rare)
- **Status:** 🟡 Same framework as other state laws

#### Montana — MCDPA (Montana Consumer Data Privacy Act)
- **In Force:** Oct 2024
- **Threshold:** ≥50K consumers (lowest threshold of wave-1 states)
- **Status:** 🟡 Rights covered by existing endpoints

#### Washington — My Health MY Data Act (MHMDA)
- **In Force:** Mar 2024 (large businesses); Jun 2024 (small businesses)
- **Scope:** Health data ONLY — broader than HIPAA; covers consumer health data outside traditional healthcare
- **Key difference from HIPAA:** Covers ANY health data (fitness apps, period tracking, weight loss, etc.), not just HIPAA-covered entities
- **Rights:** Consent required for collection; access, delete, withdraw consent, portability
- **Unique:** **No threshold** — applies to any entity processing Washington consumer health data
- **Significant:** Highest penalties of any state law ($7,500/violation)
- **Status:** 🔴 **Gap — needs dedicated health data consent mechanism if any health-adjacent use cases exist**
- **Action:** Add Washington health data consent flag to user preferences; review if any health data flows exist outside PHI de-identification

---

### Tier 3 — Lower Priority (Smaller population or recent enactment)

| State | Law | In Force | Threshold | Key Unique Requirement | Status |
|---|---|---|---|---|---|
| **Delaware** | DPDPA | Jan 2025 | ≥35K consumers | Same GDPR framework | 🟡 Covered |
| **Iowa** | ICDPA | Jan 2025 | ≥100K consumers | No right to correct | ✅ Covered (extra rights offered) |
| **Indiana** | INCDPA | Jan 2026 | ≥100K consumers | Same GDPR framework | 🟡 Covered |
| **Tennessee** | TIPA | Jul 2025 | ≥175K consumers | GDPR-aligned | 🟡 Covered |
| **Maryland** | MODPA | Oct 2025 | ≥35K consumers | Stricter data minimisation | 🟡 Covered |
| **Minnesota** | MNDPA | Jul 2025 | ≥100K consumers | Same GDPR framework | 🟡 Covered |
| **Nebraska** | NDPA | Jan 2025 | ≥100K consumers | Same GDPR framework | 🟡 Covered |
| **New Hampshire** | SB 255 | Jan 2025 | ≥35K consumers | Same GDPR framework | 🟡 Covered |
| **New Jersey** | NJDPA | Jan 2025 | ≥100K consumers | Same GDPR framework | 🟡 Covered |
| **Kentucky** | KCDPA | Jan 2026 | ≥100K consumers | Same GDPR framework | 🟡 Covered |
| **Maryland** | MODPA | Oct 2025 | ≥35K consumers | Data minimisation | 🟡 Covered |
| **Nevada** | SB 220 | Oct 2019 | Operates website | Opt out of sale only | ✅ CCPA opt-out covers |
| **Utah** | UCPA | Dec 2023 | ≥100K consumers | No opt-out of profiling | ✅ Covered |
| **Rhode Island** | RIDPA | Jan 2026 | ≥35K consumers | Same GDPR framework | 🟡 Covered |

---

## Code Actions Required

### 1. Global Privacy Control (GPC) — Required for CA, CO, CT, OR, TX

GPC is a browser-level HTTP header: `Sec-GPC: 1` that signals the user's opt-out of data sale/sharing. Websites must honour it automatically without requiring explicit opt-out action.

**Implementation:** Add GPC detection middleware in `backend/src/index.ts`:

```typescript
// Global Privacy Control (GPC) — Cal. Civ. Code §1798.135(b); CO CPA §6-1-1306(2)
app.use('/api/', (req: any, res: any, next: any) => {
  const gpc = req.headers['sec-gpc'];
  if (gpc === '1') {
    // Attach GPC signal to request for downstream handlers
    req.gpcOptOut = true;
  }
  next();
});
```

Then in auth middleware, when `req.gpcOptOut === true`, automatically set `ccpa_opt_out = true` on the authenticated user on first authenticated request where GPC signal is seen.

### 2. Profiling Opt-Out — Required for TX, VA, CT, CO, OR, MN, NJ

Add `POST /api/v1/privacy/opt-out-profiling` endpoint:
- Stores `profiling_opt_out: true` on user preferences
- Disables AI-based profiling features for that user
- Required where profiling produces "legal or similarly significant effects"

### 3. CPRA Sensitive PI Limit Use — California

Add `POST /api/v1/privacy/ccpa/limit-sensitive` — currently returning "coming soon".
Sensitive PI categories under CPRA: SSN, DL number, financial account credentials, biometric, health/sex life, racial origin, communications content, precise geolocation.

### 4. Washington MHMDA Health Data Consent

If any wellness, health-adjacent, or EHR integration features are used by Washington residents:
- Require explicit opt-in consent before collecting consumer health data
- Separate from HIPAA — covers broader health data

---

## Applicability Self-Assessment

**Does Datacendia currently trigger any state law threshold?**

| Question | Answer |
|---|---|
| Annual revenue > $25M (TX threshold) | Likely No at current stage |
| Annual revenue > $1B (FL threshold) | No |
| Consumers processed > 100K | Possibly, as customer base grows |
| Consumers processed > 35K (DE, NH, NJ, RI threshold) | Possibly |
| Washington health data processed | Only if healthcare customers in WA use health features |

**Recommended posture:** Build for compliance now (it's largely done) so there is zero scramble when thresholds are crossed. The only new code needed is GPC middleware and profiling opt-out endpoint.

---

## Consolidated US State Action Plan

| Action | States | Priority | Owner | Target |
|---|---|---|---|---|
| GPC (Sec-GPC header) auto opt-out middleware | CA, CO, CT, OR, TX | **High** | Engineering | Q2 2026 |
| `POST /api/v1/privacy/opt-out-profiling` endpoint | TX, VA, CO, CT, OR | **High** | Engineering | Q2 2026 |
| `POST /api/v1/privacy/ccpa/limit-sensitive` implement | CA (CPRA) | Medium | Engineering | Q3 2026 |
| NY SHIELD Act breach notification (30-day) | NY | Medium | Legal | Add to IR policy |
| Washington MHMDA health consent mechanism | WA | Medium | Engineering | Q3 2026 if applicable |
| Data Protection Assessment template | VA, TX, CO, CT | Medium | Legal | Q3 2026 |
| Annual applicability threshold review | All | Low | Legal | Annually |
