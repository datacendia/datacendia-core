# Subprocessor DPA Checklist & Status
**GDPR Article 28 / HIPAA §164.308(b) / UK GDPR**
**Maintained by:** Legal / Data Protection
**Last Updated:** April 2026

---

## Overview

Under GDPR Article 28, Datacendia (as Data Controller or Processor) must execute a **Data Processing Agreement (DPA)** with every subprocessor that processes personal data on its behalf. Under HIPAA §164.308(b), a **Business Associate Agreement (BAA)** is required for any subprocessor that may access PHI.

This document tracks the status of all required agreements.

---

## Subprocessor Register

### Critical Path — Must Be Signed Before EU/HIPAA Customer Onboarding

| Subprocessor | Purpose | Data Processed | GDPR DPA | HIPAA BAA | DPA Location | Status |
|---|---|---|---|---|---|---|
| **Neon** | PostgreSQL database hosting | All platform data including personal data | Required | Required (if PHI enabled) | Neon Privacy Portal → DPA | 🔴 **ACTION REQUIRED** |
| **Railway** | Application server hosting | Request logs, env vars (may contain PII) | Required | Required (if PHI enabled) | Railway Terms → DPA | 🔴 **ACTION REQUIRED** |
| **Upstash** | Redis cache (rate limits, sessions, MFA) | Session tokens, user IDs, MFA state | Required | Required (if PHI enabled) | Upstash Privacy Portal → DPA | 🔴 **ACTION REQUIRED** |
| **Twilio SendGrid** | Transactional email | Email addresses, names, email content | Required | Optional (no PHI in email) | SendGrid DPA (online) | 🔴 **ACTION REQUIRED** |
| **OpenAI** | AI inference (optional) | Prompt content (may contain PHI if not de-identified) | Required | Required (if PHI enabled) | OpenAI Privacy Portal → DPA | 🔴 **ACTION REQUIRED** |

---

### How to Sign Each DPA

#### Neon
1. Go to: https://neon.tech/docs/security/compliance
2. Navigate to **Privacy** → **Data Processing Agreement**
3. Sign via the Neon console or contact security@neon.tech
4. **Standard Contractual Clauses (SCCs):** Neon's DPA includes Module 2 (C2P) SCCs for EU data transfers
5. **HIPAA:** Neon offers HIPAA BAA — contact Neon sales

#### Railway
1. Go to: https://railway.app/legal/privacy
2. Contact privacy@railway.app to request a DPA
3. For HIPAA: Railway does not currently offer a HIPAA BAA — assess alternative hosting if PHI must be in scope
4. **Mitigation if no BAA available:** Ensure PHI is encrypted at application layer before storage; Railway only sees ciphertext

#### Upstash
1. Go to: https://upstash.com/trust
2. Download and sign the Upstash DPA
3. **Note:** Upstash does not store session content in cleartext — only TTL-keyed blobs. PHI should never be cached in Redis; enforce this in code.
4. **HIPAA:** Contact Upstash for BAA if required

#### Twilio SendGrid
1. Go to: https://sendgrid.com/policies/privacy/
2. Sign SendGrid DPA (available in account settings under **Settings → Data Processing Agreement**)
3. **Note:** Do not send PHI in email. Transactional emails (password reset, MFA codes) contain no PHI by design.

#### OpenAI
1. Go to: https://platform.openai.com/docs/privacy-and-terms
2. Sign OpenAI Data Processing Addendum (DPA) via API account settings
3. **HIPAA BAA:** OpenAI offers a HIPAA BAA for ChatGPT Enterprise and API — available via OpenAI sales (enterprise@openai.com)
4. **Critical:** PHI must be de-identified (using `POST /api/v1/privacy/deidentify`) before any prompt is sent to OpenAI API

---

### Secondary Subprocessors — Review Required

| Subprocessor | Purpose | Data Processed | DPA Required? | Status |
|---|---|---|---|---|
| **Groq** | AI inference (alternative provider) | Prompt content | Yes (if processing EU user data in prompts) | 🟡 Review needed |
| **Sentry** | Error monitoring | Stack traces (may contain PII in errors) | Yes | 🟡 Review needed |
| **Microsoft Presidio** | PII detection (sidecar Docker) | Input text containing PII | No (self-hosted, no data leaves system) | ✅ N/A |
| **Apache Druid** | Analytics | Aggregated metrics (no PII by design) | Assess | 🟡 Review if self-hosted |
| **Apache Kafka** | Event streaming | Event payloads (may contain PII) | Yes if cloud-hosted | 🟡 Assess deployment |

---

## Standard Contractual Clauses (SCCs)

For transfers of personal data from the EU/EEA to non-adequate third countries (primarily the US), SCCs under Commission Decision (EU) 2021/914 must be incorporated into each DPA.

**Applicable Module:**
- **Module 2 (C2P):** Where Datacendia is Controller and subprocessor is Processor — applicable for: Neon, Railway, Upstash, SendGrid
- **Module 3 (P2P):** Where Datacendia is Processor acting on behalf of a customer Controller and subprocessor is Sub-Processor — applicable for: All of the above when Datacendia processes customer data

**UK GDPR:** UK International Data Transfer Addendum (IDTA) required for UK data in addition to EU SCCs.

---

## Record of Processing Activities (ROPA) — Placeholder

Per GDPR Article 30, Datacendia must maintain a ROPA. Below is a starter template:

| Processing Activity | Purpose | Legal Basis | Categories of Data | Retention | Recipients |
|---|---|---|---|---|---|
| User account management | Service delivery | Contract (Art. 6(1)(b)) | Name, email, role, preferences | Account lifetime + 30 days | Neon, Railway |
| Authentication & MFA | Security | Legitimate interest (Art. 6(1)(f)) | Email, IP, session tokens, MFA state | 30 days | Neon, Upstash |
| Audit logging | Legal compliance | Legal obligation (Art. 6(1)(c)) | User ID, action, IP, timestamp | 7 years | Neon |
| Email communications | Service delivery | Contract (Art. 6(1)(b)) | Email address, name | 2 years | SendGrid |
| AI deliberation | Service delivery | Contract (Art. 6(1)(b)) | Deliberation content (customer-provided) | Per customer retention policy | Neon, OpenAI* |
| Analytics | Legitimate interest | Legitimate interest (Art. 6(1)(f)) | Aggregated usage data | 2 years | Neon |

*OpenAI receives prompt content only when explicitly enabled by the customer and only after de-identification if PHI is present.

---

## Action Log

| # | Action | Owner | Deadline | Status |
|---|---|---|---|---|
| 1 | Sign Neon DPA | Legal | 2026-05-01 | 🔴 Not started |
| 2 | Sign Railway DPA | Legal | 2026-05-01 | 🔴 Not started |
| 3 | Sign Upstash DPA | Legal | 2026-05-01 | 🔴 Not started |
| 4 | Sign SendGrid DPA | Legal | 2026-05-01 | 🔴 Not started |
| 5 | Sign OpenAI DPA + BAA | Legal | 2026-05-15 | 🔴 Not started |
| 6 | Review Groq, Sentry, Druid, Kafka | Legal + Engineering | 2026-06-01 | 🔴 Not started |
| 7 | Publish ROPA (full version) | Legal | 2026-06-01 | 🔴 Not started |
| 8 | Add UK IDTA to all SCCs | Legal | 2026-06-01 | 🔴 Not started |

---

*This document is a living record. Update after every new subprocessor is added or when DPA status changes. A subprocessor must not be permitted to process personal data until the relevant DPA/BAA is signed.*
