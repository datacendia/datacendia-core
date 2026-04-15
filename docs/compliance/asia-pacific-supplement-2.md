# Asia-Pacific Privacy Laws — Supplement 2
**Vietnam PDPD | Philippines DPA | Taiwan PDPA | Hong Kong PDPO | Malaysia PDPA**
**Document Owner:** Legal | Version: 1.0 | April 2026

---

## Vietnam — PDPD (Personal Data Protection Decree)

### Overview

- **Statute:** Decree No. 13/2023/ND-CP
- **In Force:** July 1, 2023
- **Regulator:** Ministry of Public Security (MPS) — Department A05
  - URL: [https://mps.gov.vn](https://mps.gov.vn)
- **Penalty:** Up to VND 5B (~$200K USD) per violation; criminal prosecution possible

### Applicability

Applies to any organisation that:
- Processes personal data of Vietnamese residents (inside OR outside Vietnam)
- Provides goods/services to Vietnamese residents
- Has a representative or agent in Vietnam

**Datacendia applicability:** If Vietnamese enterprise customers use the platform, YES.

### Unique Requirements (High Complexity)

| Requirement | Description | Complexity | Action |
|---|---|---|---|
| MPS cross-border transfer approval | Personal data cannot leave Vietnam without MPS notification AND approval | **Very High** | Notify MPS before processing Vietnam data on Railway/Neon (US infrastructure) |
| Data processing registration | Controllers must register data processing activities with MPS | High | File PDPD registration form with MPS A05 |
| Consent-first approach | ALL processing requires explicit consent (no legitimate interest basis) | High | Add Vietnam-specific consent flag to user onboarding |
| Sensitive data — separate consent | Health, financial, biometric, religious, political data requires separate explicit consent | High | Separate consent forms per category |
| DPO appointment | Required for large-scale/sensitive data processors | Medium | Use existing DPO appointment |
| Local representative | Required for foreign entities processing Vietnam data without local establishment | Medium | Appoint local Vietnamese representative |
| Data localisation (limited) | Critical data may need to be stored locally; implementing regulations pending clarity | Medium | Monitor MPS implementing circulars |
| Security assessment before transfer | Impact assessment required before any cross-border data transfer | High | Vietnam-specific DPIA |

### Cross-Border Transfer Process

Vietnam's cross-border transfer is the most restrictive outside China:

**Step 1:** Conduct Privacy Impact Assessment (PDPD Art. 25)
**Step 2:** Prepare transfer impact assessment documenting:
- Types of personal data
- Purpose of transfer
- Recipient countries (US, Ireland — Railway/Neon locations)
- Security measures in place
**Step 3:** Submit notification to MPS Department A05
**Step 4:** Await approval (no stated timeline in Decree)
**Step 5:** Sign Standard Contractual Clauses or equivalent with recipients

**Note:** As of April 2026, MPS has not published implementing circulars for transfer approval. Monitor MPS guidance; engage Vietnam-specialist legal counsel before onboarding Vietnamese customers.

### Consent Requirements

PDPD requires **broad, explicit, informed consent** for ALL processing (no legitimate interest):

```json
// Required consent capture for Vietnamese users
{
  "vietnamPDPDConsent": {
    "version": "1.0",
    "capturedAt": "2026-04-15T00:00:00Z",
    "purposeAccepted": ["platform_operation", "analytics", "ai_deliberation"],
    "sensitiveCategories": [],
    "consentText": "Tôi đồng ý cho Datacendia xử lý dữ liệu cá nhân của tôi...",
    "withdrawalMechanism": "POST /api/v1/privacy/erasure"
  }
}
```

### Practical Recommendation

**Investment level:** HIGH — Vietnam PDPD is complex and penalties are significant. Do not onboard Vietnamese customers until:
1. Local counsel retained in Vietnam
2. MPS transfer notification submitted and approved
3. Local representative appointed
4. Vietnam-specific consent UI implemented

**Estimated compliance cost:** $30K–$80K first year (legal + implementation)

---

## Philippines — Data Privacy Act 2012 (Republic Act 10173)

### Overview

- **Statute:** Republic Act No. 10173 (DPA 2012); amended by RA 11032 (2018)
- **In Force:** 2012; implementing rules since 2016
- **Regulator:** National Privacy Commission (NPC) — [https://www.privacy.gov.ph](https://www.privacy.gov.ph)
- **Penalty:** PHP 500K–PHP 5M (~$9K–$90K) per violation; imprisonment 1–6 years possible

### Applicability

Applies to processing personal information of Philippine nationals regardless of where processing occurs.

### Key Requirements

| Requirement | Description | Datacendia Status | Action |
|---|---|---|---|
| Lawful basis | Consent, contract, legal obligation, legitimate interest, vital interests, public interest | 🟡 GDPR framework covers this | Document for Philippines specifically |
| NPC DPO registration | DPO must be registered with NPC | 🔴 Not done | Register DPO at privacy.gov.ph |
| Privacy notice | Must include NPC contact details | 🟡 API endpoint exists | Add NPC URL to privacy notice |
| Breach notification | NPC within 72 hours if sensitive PI; individuals within 72 hours if high risk | 🟡 IR policy covers GDPR timeline | Add NPC to regulator contact list |
| Privacy Impact Assessment | Required for high-risk processing | 📋 Planned | Complete PIA for Philippines context |
| Physical infrastructure | NPC guidance suggests local storage consideration for sensitive data | 🟡 Monitor | No current requirement; monitor |

### Data Subject Rights

Philippine DPA rights (all served by existing endpoints):
- Right to be informed (Art. 16a) — `GET /api/v1/privacy/policy`
- Right to access (Art. 16b) — `GET /api/v1/privacy/access`
- Right to object (Art. 16f) — `POST /api/v1/privacy/restrict`
- Right to erasure/blocking (Art. 16e) — `DELETE /api/v1/privacy/erasure`
- Right to rectification (Art. 16c) — `PATCH /api/v1/privacy/rectify`
- Right to data portability (Art. 16g) — `GET /api/v1/privacy/export`
- Right to file complaint (NPC) — Add NPC URL to privacy policy

### NPC DPO Registration Process

1. Go to [https://www.privacy.gov.ph/dpo-registration/](https://www.privacy.gov.ph/dpo-registration/)
2. Create NPC account
3. Submit DPO Registration Form with:
   - Organisation details (Datacendia, LLC)
   - DPO name and contact information
   - Nature of processing activities
   - Number of data subjects (estimate)
4. Receive NPC DPO registration number
5. Publish NPC registration number in privacy policy

**Timeline:** 2–4 weeks processing

### Sensitive Personal Information

Philippines DPA has a broad definition of "sensitive PI" that includes:
- Race, ethnic origin, marital status, age, colour, religious, philosophical or political affiliations
- Health, education, genetic or sexual life
- Government-issued IDs
- **Financial information** (broader than GDPR)

For sensitive PI: explicit consent required; enhanced security; 5-year minimum retention for certain records.

---

## Taiwan — Personal Data Protection Act (PDPA 2023)

### Overview

- **Statute:** Personal Data Protection Act (個人資料保護法) — amended 2023
- **In Force:** Amended provisions effective 2023
- **Regulator:** Personal Data Protection Commission (PDPC) — [https://www.pdpc.gov.tw](https://www.pdpc.gov.tw)
- **Penalty:** Up to NT$15M (~$470K USD) for violations; criminal liability for intentional violations

### Key Requirements

| Requirement | Description | Gap Status |
|---|---|---|
| Explicit consent for sensitive data | Health, genetics, sexual orientation, criminal records, medical data | 🟡 GDPR-aligned — supplement with Taiwan-specific consent |
| Prior written notice | Data subjects must be notified before collection | ✅ Privacy notice endpoint |
| Purpose limitation | Data may only be used for stated purpose | ✅ Implemented |
| Right to delete, correct, stop processing | Data subject rights | ✅ All endpoints exist |
| Cross-border transfer whitelist | PDPC maintains list of approved transfer countries | 🔴 Check if US is on approved list |
| 72-hour breach notification to PDPC | If >500 affected or serious harm | 🟡 Add PDPC to regulator list |
| Security measures | Technical and administrative controls | ✅ ISO 27001-aligned |

### Cross-Border Transfer

Taiwan uses a whitelist approach. Check [https://www.pdpc.gov.tw](https://www.pdpc.gov.tw) for current approved countries. If US is not on the list, a case-by-case PDPC approval is needed OR contractual mechanisms (similar to SCCs) may be used.

**Action:** Verify US is on approved transfer list; if not, prepare Taiwan-specific SCCs.

---

## Hong Kong — PDPO (Personal Data (Privacy) Ordinance)

### Overview

- **Statute:** Cap. 486 — Personal Data (Privacy) Ordinance
- **Regulator:** Privacy Commissioner for Personal Data (PCPD) — [https://www.pcpd.org.hk](https://www.pcpd.org.hk)
- **Penalty:** Up to HKD 1M (~$130K) + prison; class action possible after 2021 amendments (doxxing provisions)
- **Six Data Protection Principles (DPPs):** Analogous to GDPR's principles

### DPP Compliance

| DPP | Principle | Datacendia Implementation |
|---|---|---|
| DPP 1 | Data collection for lawful, necessary purpose | ✅ Privacy notice specifies purpose |
| DPP 2 | Accuracy and retention limits | ✅ Retention policy; rectify endpoint |
| DPP 3 | Use limitation (purpose limitation) | ✅ Enforced in processing design |
| DPP 4 | Security safeguards | ✅ TLS, encryption, access controls |
| DPP 5 | Openness about policies | ✅ `GET /api/v1/privacy/policy` |
| DPP 6 | Data access and correction | ✅ `GET /api/v1/privacy/access`; `PATCH /api/v1/privacy/rectify` |

### PICS (Personal Information Collection Statement)

Hong Kong requires a Privacy Collection Statement when collecting data from individuals:

```
PERSONAL INFORMATION COLLECTION STATEMENT (PICS) — HONG KONG

1. PURPOSE
Datacendia collects personal data for: (a) account management; (b) platform 
service delivery; (c) AI-assisted deliberation (where requested); 
(d) security and fraud prevention; (e) legal compliance.

2. TRANSFER
Data may be transferred to subprocessors in the USA (listed at 
GET /api/v1/privacy/policy). Transfers are protected by standard 
contractual clauses equivalent to the SCCs under GDPR.

3. YOUR RIGHTS
You may access, correct, or request deletion of your data.
Contact: privacy@datacendia.com
Privacy Commissioner for Personal Data: www.pcpd.org.hk

4. VOLUNTARY PROVISION
Provision of personal data is voluntary. Failure to provide may prevent 
use of certain platform features.
```

**Action:** Add PICS to Hong Kong user onboarding; add PCPD URL to privacy policy.

---

## Malaysia — Personal Data Protection Act 2010 (PDPA)

### Overview

- **Statute:** Personal Data Protection Act 2010 (Act 709)
- **In Force:** 2013; amendments ongoing (2024 amendment bill)
- **Regulator:** Personal Data Protection Department (JPDP / Jabatan Perlindayaan Data Peribadi) — [https://www.pdp.gov.my](https://www.pdp.gov.my)
- **Penalty:** Up to MYR 500K (~$110K) + prison

### Seven Personal Data Protection Principles

| Principle | Requirement | Status |
|---|---|---|
| General | Consent + notice before collection | 🟡 GDPR consent framework; add Malaysia-specific |
| Notice and choice | Privacy notice including JPDP contact | 🟡 Add JPDP URL |
| Disclosure | Data shared only for original purpose or with consent | ✅ |
| Security | Practical security steps | ✅ ISO 27001-aligned |
| Retention | Delete when no longer necessary | ✅ Retention policy |
| Data integrity | Ensure accuracy | ✅ Rectify endpoint |
| Access | Right to access and correct | ✅ Access + rectify endpoints |

### Commercial Sector Only

Malaysia PDPA applies ONLY to commercial transactions. Government processing is exempt. Datacendia is commercial — applies.

### 2024 Amendment Bill (Pending)

The 2024 amendment bill (at committee stage as of April 2026) proposes:
- Mandatory DPO appointment (for large processors)
- Data breach notification (72 hours to JPDP)
- Right to data portability
- Enhanced penalties (up to MYR 1M)

**Action:** Implement as if already in force — existing GDPR compliance satisfies most proposed requirements.

---

## Priority Matrix

| Country | Market Priority | Compliance Complexity | Action |
|---|---|---|---|
| **Philippines** | Medium | Low-Medium | Register DPO with NPC |
| **Hong Kong** | Medium | Low | Add PICS; PCPD to breach contacts |
| **Malaysia** | Medium | Low-Medium | Add JPDP URL; monitor 2024 amendment |
| **Taiwan** | Low-Medium | Medium | Verify cross-border transfer list |
| **Vietnam** | Low | **Very High** | Engage local counsel before any customers |
