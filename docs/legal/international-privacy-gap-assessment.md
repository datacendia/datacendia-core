# International Privacy Law Gap Assessment
**Document Owner:** Legal / Data Protection
**Version:** 1.0 | April 2026
**Jurisdictions Covered:** UK GDPR, PIPEDA (Canada), LGPD (Brazil), PDPA (Thailand/Singapore), Australia Privacy Act

---

## Executive Summary

Datacendia's GDPR compliance posture (DSR endpoints, DPAs, PHI de-identification, privacy policy) provides a **strong baseline** that substantially satisfies most international privacy laws. This document identifies the incremental gaps for each jurisdiction.

---

## 1. UK GDPR / Data Protection Act 2018

**Applicability:** If Datacendia offers services to UK residents or monitors UK residents' behaviour (Article 3 UK GDPR)

### Key Differences from EU GDPR

| Area | EU GDPR | UK GDPR | Gap | Action Required |
|---|---|---|---|---|
| Data transfers | SCCs (2021/914) | UK International Data Transfer Agreement (IDTA) | IDTA not yet in place | Add UK IDTA to all EU SCCs |
| ICO registration | Not required for processors | UK data controllers must register with ICO (fee applies) | Not registered | Register with ICO (approx £40/year) |
| DPO requirement | Same threshold as EU | Same threshold as EU | No gap | N/A |
| Legal bases | Articles 6, 9 EU GDPR | Equivalent UK GDPR provisions | No substantive gap | Align privacy policy to reference UK GDPR |
| Children's data | GDPR Art. 8 (age 16 or lower) | UK Children's Code — stricter | N/A if no child users | Add age verification if children targeted |
| Data subject rights | Art. 15–22 | Equivalent; same mechanism | No gap — existing DSR endpoints cover UK | Update privacy policy to mention UK ICO |

**ICO Contact (for breach notification):** [https://ico.org.uk/report-a-breach/](https://ico.org.uk/report-a-breach/)
**72-hour breach notification:** Same as EU GDPR — already in IR policy.

**Actions (Priority: High — if UK customers exist):**
- [ ] Register with ICO as data controller
- [ ] Add UK IDTA addendum to all DPAs with US subprocessors
- [ ] Update privacy policy to reference UK GDPR and ICO as supervisory authority for UK residents

---

## 2. PIPEDA — Personal Information Protection and Electronic Documents Act (Canada)

**Applicability:** Datacendia processes personal information of Canadian residents in the course of commercial activity

### Key Differences from GDPR

| Area | PIPEDA | Datacendia Status | Gap | Action |
|---|---|---|---|---|
| Legal basis | Consent-based (opt-in) or legitimate purpose | GDPR consent model is compatible | No substantive gap | Ensure consent flows work for Canadian users |
| Accountability | Must designate a Privacy Officer | Engineering Lead acting as Privacy Officer | 🟡 Not formally designated | Formally designate and publish Privacy Officer contact |
| Openness principle | Privacy practices must be publicly available | Privacy policy endpoint exists at `/api/v1/privacy/policy` | ✅ No gap | N/A |
| Individual access | Must provide access within 30 days | DSAR generates immediately | ✅ No gap | N/A |
| Accuracy | Must ensure personal information is accurate | Users can update profile; no self-correction endpoint for all fields | 🟡 Partial — GDPR Art. 16 rectification endpoint missing | Add `/api/v1/privacy/rectify` endpoint |
| Safeguards | Security safeguards appropriate to sensitivity | Full security stack; encryption; MFA | ✅ No gap | N/A |
| Breach notification | Notify OPC and affected individuals if "real risk of significant harm" | IR policy covers breach detection | 🟡 OPC notification process not documented | Add OPC notification step to IR policy |
| CASL (email) | Anti-spam law for commercial email | Transactional only via SendGrid | ✅ Compliant | N/A |

**Office of the Privacy Commissioner (OPC):** [https://priv.gc.ca](https://priv.gc.ca)

**Actions:**
- [ ] Formally designate Privacy Officer; publish contact
- [ ] Implement GDPR Art. 16 rectification endpoint
- [ ] Add OPC breach notification to IR policy

---

## 3. LGPD — Lei Geral de Proteção de Dados (Brazil)

**Applicability:** Processing of personal data of Brazilian data subjects

### Key Differences from GDPR

| Area | LGPD | Datacendia Status | Gap | Action |
|---|---|---|---|---|
| Legal bases | 10 legal bases (broadly equivalent to GDPR Art. 6) | GDPR legal bases largely map to LGPD | ✅ No material gap | Update privacy policy to reference LGPD |
| Data subject rights | Similar to GDPR (access, correction, deletion, portability, etc.) | DSR endpoints cover all LGPD rights | ✅ No gap | N/A |
| DPO (Encarregado) | Required for all controllers | Not yet appointed | 🟡 Gap | Appoint DPO / Encarregado; publish contact on website |
| ANPD notification | Breach notification to ANPD within "reasonable timeframe" (expect 72h) | IR policy covers detection | 🟡 ANPD contact not in IR policy | Add ANPD to breach notification list |
| Data transfers | Require adequate protection or contractual mechanisms | SCCs sufficient; ANPD has not issued adequacy decisions | 🟡 Partial | Monitor ANPD guidance; use SCCs for Brazil |
| Sensitive data | Stricter requirements for health, biometric, political data | PHI de-identification; no biometric processing | ✅ No gap for current scope | Monitor if use cases expand |

**ANPD (Autoridade Nacional de Proteção de Dados):** [https://www.gov.br/anpd](https://www.gov.br/anpd)

**Actions:**
- [ ] Appoint Encarregado (can be same person as GDPR DPO)
- [ ] Add ANPD to breach notification contacts in IR policy
- [ ] Update privacy policy to reference LGPD

---

## 4. PDPA — Thailand / Singapore Personal Data Protection Acts

**Applicability:** Low priority unless active customer base in SE Asia

| Jurisdiction | Applicability Threshold | GDPR Alignment | Key Gap |
|---|---|---|---|
| Singapore PDPA | Any organisation collecting/using Singapore personal data | High — similar consent/purpose framework | Mandatory Data Protection Officer designation; PDPC registration not required but breach notification required |
| Thailand PDPA | Similar to GDPR in structure | High | Consent management; DPO appointment if large-scale processing |

**Recommended Action:** Low priority. Monitor if SE Asia customers acquired. Existing GDPR infrastructure largely compliant.

---

## 5. Australia Privacy Act 1988 / APP

**Applicability:** If annual revenue > AUD $3M or if a health service provider

| Area | Australian Privacy Principles | Datacendia Status | Gap |
|---|---|---|---|
| Open and transparent management | Must have privacy policy | ✅ Privacy policy endpoint exists | Update to reference OAIC |
| Anonymity / pseudonymity | Must offer pseudonymous interaction where practicable | ✅ Soft-delete with pseudonymisation | N/A |
| Collection | Must collect only necessary information | ✅ Minimum necessary principle | N/A |
| Cross-border disclosure | Must ensure overseas recipient provides equivalent protection | 🟡 SCCs cover this; App 8 notification needed | Add Australian cross-border disclosure clause |
| Access and correction | Similar to GDPR Art. 15/16 | 🟡 Access endpoint exists; rectification pending | Add `/api/v1/privacy/rectify` |
| Breach notification | Notifiable Data Breaches scheme | 🟡 Not specifically mentioned in IR policy | Add OAIC to breach notification list |

**OAIC (Office of the Australian Information Commissioner):** [https://oaic.gov.au](https://oaic.gov.au)

---

## 6. Missing Endpoint: GDPR Art. 16 / PIPEDA / LGPD — Right to Rectification

All three frameworks (GDPR, PIPEDA, LGPD) require a right to **correction / rectification** of inaccurate personal data. This is not yet implemented.

**Required endpoint:** `PATCH /api/v1/privacy/rectify`

**Fields to allow self-correction:** `name`, `preferences`, `notification_preferences`, `language_preferences`

**Fields NOT user-editable:** `email` (requires verified re-confirmation), `role` (admin-only), security fields

This should be added to the privacy route as the next implementation task.

---

## 7. Consolidated Action Plan

| Action | Jurisdictions | Priority | Owner | Target |
|---|---|---|---|---|
| Register with UK ICO | UK GDPR | **High** | Legal | Q2 2026 |
| Add UK IDTA to all US subprocessor DPAs | UK GDPR | **High** | Legal | Q2 2026 |
| Formally designate Privacy Officer / DPO | PIPEDA, LGPD, PDPA | **High** | CEO | Q2 2026 |
| Implement `PATCH /api/v1/privacy/rectify` | GDPR Art. 16, PIPEDA, LGPD, APP | **High** | Engineering | Q2 2026 |
| Add OPC, ANPD, OAIC to IR breach notification list | CA, BR, AU | Medium | Legal | Q2 2026 |
| Update privacy policy for international jurisdictions | All | Medium | Legal | Q2 2026 |
| Monitor ANPD data transfer guidance | LGPD | Low | Legal | Ongoing |
| Review SE Asia applicability when customers acquired | Singapore/Thailand PDPA | Low | Legal | On acquisition |
