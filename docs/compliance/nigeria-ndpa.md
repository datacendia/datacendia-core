# Nigeria Data Protection Act 2023 (NDPA) — Implementation Guide
**Document Owner:** Legal | Version: 1.0 | April 2026

---

## Overview

- **Statute:** Nigeria Data Protection Act 2023 (Act No. 4 of 2023)
- **Signed:** June 12, 2023 (Democracy Day)
- **In Force:** June 2023 (transitional period for existing processors)
- **Regulator:** Nigeria Data Protection Commission (NDPC) — [https://ndpc.gov.ng](https://ndpc.gov.ng)
- **Penalties:** Up to 2% of annual gross revenue OR ₦10M (whichever is higher) per violation

**Why Nigeria matters:** Nigeria is Africa's largest economy (~220 million people) and a major tech market. The NDPA is the continent's most comprehensive privacy law and is GDPR-aligned.

---

## Applicability

NDPA applies to:
- Any organisation established in Nigeria
- Any organisation processing personal data of Nigerian data subjects, regardless of location
- Any organisation monitoring behaviour of persons in Nigeria

**Datacendia applicability:** If Nigerian enterprise customers use the platform → YES.

---

## NDPA vs GDPR — Key Differences

| Aspect | GDPR | NDPA |
|---|---|---|
| Legal basis | 6 bases including legitimate interest | Similar 6 bases; consent most common |
| Data subject rights | Access, rectify, erase, restrict, portability, object | Same rights (NDPA § 34–41) |
| Breach notification | 72 hours to DPA | **72 hours to NDPC** (§ 40) |
| DPO | Mandatory for certain controllers | DPO highly recommended; mandatory for large processors |
| Cross-border transfer | Adequacy / SCCs / BCRs / consent | Adequacy decisions OR contractual mechanisms OR consent |
| Data Protection Compliance Organisation | N/A | **DPCO system — unique to Nigeria** |

---

## The DPCO System (Data Protection Compliance Organisation)

**Unique to Nigeria** — NDPA requires that controllers use licensed Data Protection Compliance Organisations (DPCOs) registered with NDPC for:
- Conducting data protection audits
- Assisting with NDPA compliance programmes
- Filing annual data protection compliance reports with NDPC

**Mandatory for:** Controllers processing personal data of >2,000 Nigerian data subjects

### Steps to Engage a DPCO

1. Search NDPC DPCO register at [https://ndpc.gov.ng/dpco](https://ndpc.gov.ng/dpco)
2. Select a licensed DPCO (examples: DataPro Ltd, Privacylaw Interlink)
3. Engage DPCO to:
   - Conduct initial compliance assessment
   - Prepare NDPA compliance programme
   - File annual report to NDPC
4. Annual audit fee: typically ₦500K–₦2M (~$350–$1,400)

---

## NDPA Compliance Checklist

| Requirement | NDPA Section | Datacendia Implementation | Status | Action |
|---|---|---|---|---|
| Legal basis for processing | §25 | GDPR legal bases apply | ✅ | Document Nigeria-specific legal basis |
| Privacy notice | §24 | `GET /api/v1/privacy/policy` | 🟡 | Add NDPC contact details |
| Data subject rights: access | §34 | `GET /api/v1/privacy/access` | ✅ | — |
| Data subject rights: rectification | §35 | `PATCH /api/v1/privacy/rectify` | ✅ | — |
| Data subject rights: deletion | §36 | `DELETE /api/v1/privacy/erasure` | ✅ | — |
| Data subject rights: portability | §38 | `GET /api/v1/privacy/export` | ✅ | — |
| Data subject rights: objection | §37 | `POST /api/v1/privacy/restrict` | ✅ | — |
| DPO designation | §32 | `docs/legal/dpo-appointment-letter.md` | 🔴 | Sign DPO letter |
| DPO registration with NDPC | §32 | Not yet done | 🔴 | Register DPO at ndpc.gov.ng after appointment |
| Data breach notification to NDPC (72h) | §40 | IR policy (GDPR 72h applies) | 🟡 | Add NDPC to regulator contact list |
| Cross-border transfer safeguards | §43 | SCCs with subprocessors | 🟡 | Verify SCCs cover Nigeria |
| DPCO engagement | §42 | Not yet done | 🔴 | Engage DPCO when Nigerian customers > 2,000 |
| Annual compliance report via DPCO | §42 | Not yet done | 📋 | Via DPCO annually |
| Sensitive data processing restrictions | §30 | GDPR Art. 9 controls apply | ✅ | — |

---

## DPO Registration with NDPC

Once DPO is appointed (see `docs/legal/dpo-appointment-letter.md`):

1. Go to [https://ndpc.gov.ng](https://ndpc.gov.ng)
2. Select "Organisations" → "Register Data Controller/Processor"
3. Provide:
   - Organisation name: Datacendia, LLC
   - Country of incorporation: United States
   - Nature of business: AI governance SaaS platform
   - Categories of data: email, name, workplace role, AI deliberation outputs
   - DPO name and contact
   - Number of Nigerian data subjects (estimate)
4. Receive NDPC registration certificate
5. Publish NDPC registration number in privacy policy

---

## Privacy Notice Addition (for Nigerian Data Subjects)

Add to `GET /api/v1/privacy/policy` response:

```json
{
  "nigeria": {
    "regulator": "Nigeria Data Protection Commission (NDPC)",
    "regulatorUrl": "https://ndpc.gov.ng",
    "complaintUrl": "https://ndpc.gov.ng/complaint",
    "regulatorEmail": "info@ndpc.gov.ng",
    "ndpcRegistrationNumber": "[Pending registration]",
    "dataSubjectRights": [
      "Right to access your personal data (NDPA §34)",
      "Right to rectification (NDPA §35)",
      "Right to erasure (NDPA §36)",
      "Right to data portability (NDPA §38)",
      "Right to object to processing (NDPA §37)"
    ],
    "crossBorderTransfer": "Personal data may be transferred to Datacendia's US-based infrastructure protected by Standard Contractual Clauses",
    "dpco": "[DPCO name] — licensed by NDPC"
  }
}
```

---

## Breach Notification to NDPC

Add to `docs/policies/incident-response-policy.md`:

```
NIGERIA NDPA BREACH NOTIFICATION (§40)

Trigger: Breach affecting personal data of Nigerian data subjects

Timeline: 72 hours from discovery (same as GDPR)

How to notify:
1. Email: info@ndpc.gov.ng
2. Subject: "DATA BREACH NOTIFICATION — Datacendia, LLC — [DATE]"
3. Content: Same as GDPR Art. 33 notification (NDPA §40 requirements identical)
4. Copy to: Engaged DPCO

Individual notification: Notify affected Nigerian data subjects "without undue delay" if high risk of harm

Use IncidentMaterialityService.assess() with affectedJurisdictions: ['NG']
to auto-generate NDPC notification plan and draft notice.
```

---

## Other African Privacy Laws (Quick Reference)

| Country | Law | In Force | Regulator | GDPR-aligned | Priority |
|---|---|---|---|---|---|
| **Nigeria** | NDPA 2023 | Jun 2023 | NDPC | Yes | **Medium** |
| **South Africa** | POPIA | Jul 2021 | Information Regulator | Yes | Medium |
| **Kenya** | Data Protection Act 2019 | Nov 2019 | ODPC | Yes | Low |
| **Ghana** | Data Protection Act 2012 | 2012 | DPC | Partial | Low |
| **Egypt** | PDPL 2020 | 2020 | MCIT | Partial | Low |
| **Rwanda** | Law No. 058/2021 | 2021 | RURA | Yes | Low |
| **Morocco** | Law 09-08 | 2009 | CNDP | Partial | Low |
| **Tunisia** | Law 63-2004 | 2004 | INPDP | Partial | Low |
| **Senegal** | Law 2008-12 | 2008 | CDP | Partial | Low |

**Action for South Africa (POPIA — already active enforcement):**
- Add Information Regulator to breach notification contacts: `inforeg@justice.gov.za`
- South Africa is EU-adequate country — SCCs not required for EU→SA transfers
- POPIA §23 DPIA required for processing activities likely to result in high risks

---

## Action Timeline

| Action | Target | Priority |
|---|---|---|
| Add NDPC to breach notification contact list | May 2026 | High |
| Add Nigeria section to privacy notice API | May 2026 | High |
| Register DPO with NDPC (after DPO appointed) | Q2 2026 | High |
| Engage DPCO (when Nigerian customers > 2,000) | Q3 2026 | Medium |
| Add South Africa Information Regulator to breach contacts | May 2026 | Medium |
| Add POPIA condition 6 (access rights) confirmation | Q2 2026 | Medium |
| Monitor: Kenya, Ghana, Egypt enforcement | Quarterly | Low |
