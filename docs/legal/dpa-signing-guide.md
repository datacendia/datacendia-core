# Subprocessor DPA Signing Guide — Step-by-Step
**GDPR Article 28 / HIPAA §164.308(b) / UK GDPR**
**Owner: Legal / Engineering Lead**
**Complete all 5 before first EU or healthcare customer goes live**

---

## 1. Neon (PostgreSQL Database)

**Why:** Stores all platform data including personal data of EU residents.
**Time required:** ~20 minutes

### Steps:
1. Log in to Neon Console → [https://console.neon.tech](https://console.neon.tech)
2. Go to **Organization Settings** (top-right dropdown)
3. Navigate to **Privacy & Compliance** → **Data Processing Agreement**
4. Click **"Download DPA"** — review and sign electronically
5. For HIPAA BAA: Email **security@neon.tech** with subject: "HIPAA BAA Request — Datacendia LLC"
6. Upload signed DPA to `docs/legal/signed-dpas/neon-dpa-YYYY-MM-DD.pdf`
7. Update `docs/legal/subprocessor-dpa-checklist.md` status

**SCCs included:** Yes — Neon DPA includes EU SCCs Module 2 (Controller → Processor)
**UK IDTA:** Request separately from security@neon.tech
**Neon SOC 2 Type II report:** Request from same email

---

## 2. Railway (Application Hosting)

**Why:** Hosts the application server; processes all inbound requests including personal data in transit.
**Time required:** ~30 minutes (involves email exchange)

### Steps:
1. Email **privacy@railway.app** with the following:
   ```
   Subject: Data Processing Agreement Request — Datacendia LLC
   
   Hi Railway team,
   
   We are Datacendia LLC (app.datacendia.com), a customer on your Hobby/Pro plan.
   We require a Data Processing Agreement (DPA) under GDPR Article 28 as we process
   personal data of EU residents via your infrastructure.
   
   Could you please provide:
   1. Your standard DPA or point us to where to sign it
   2. Confirmation of EU Standard Contractual Clauses (SCCs) coverage
   3. UK International Data Transfer Agreement (IDTA) addendum
   4. A copy of your most recent SOC 2 report
   
   Our DPO contact: [NAME] <privacy@datacendia.com>
   ```
2. Railway will respond with DPA terms — review and countersign
3. **Important:** Railway does not currently offer a HIPAA BAA. If healthcare customers require PHI storage in Railway infrastructure, consider architectural alternatives (application-layer encryption where Railway only sees ciphertext)
4. Upload signed DPA to `docs/legal/signed-dpas/railway-dpa-YYYY-MM-DD.pdf`

**Note:** Railway's privacy infrastructure is less mature than Neon/AWS. If they cannot provide DPA, escalate to evaluate migration to AWS Fargate (FedRAMP-adjacent).

---

## 3. Upstash (Redis Cache)

**Why:** Stores session tokens, MFA state, rate limit counters — contains user identifiers.
**Time required:** ~15 minutes

### Steps:
1. Go to Upstash Trust Center → [https://upstash.com/trust](https://upstash.com/trust)
2. Download the **Data Processing Agreement** PDF
3. Sign (DocuSign or wet signature scan)
4. Email signed copy to **privacy@upstash.com** for countersignature
5. For HIPAA: Email **privacy@upstash.com** with subject "HIPAA BAA Request — Datacendia LLC"
   - Note: Upstash recommends not caching PHI in Redis; enforce this in code
6. Upload to `docs/legal/signed-dpas/upstash-dpa-YYYY-MM-DD.pdf`

**SCCs:** Included in Upstash DPA
**Practical note:** Since Upstash only receives hashed/opaque token values, DPA risk is low — but still required for GDPR compliance

---

## 4. Twilio SendGrid (Email)

**Why:** Processes email addresses and message content for transactional emails.
**Time required:** ~10 minutes (fully self-serve)

### Steps:
1. Log in to SendGrid → [https://app.sendgrid.com](https://app.sendgrid.com)
2. Go to **Settings** (left sidebar) → **Privacy** → **Data Processing Agreement**
3. Click **"Sign DPA"** — fully electronic, instant countersignature
4. Download confirmation PDF
5. Upload to `docs/legal/signed-dpas/sendgrid-dpa-YYYY-MM-DD.pdf`

**Note on HIPAA:** Do NOT send PHI in transactional emails. MFA codes, password resets — no PHI. No BAA required for current use.
**UK IDTA:** Included in Twilio's DPA automatically.

---

## 5. OpenAI (AI Inference)

**Why:** Receives prompt content which may contain personal data; highest-risk subprocessor.
**Time required:** ~20 minutes + possible enterprise contact

### Steps:
1. Log in to OpenAI Platform → [https://platform.openai.com](https://platform.openai.com)
2. Go to **Settings** → **Organization** → **Privacy**
3. Look for **"Data Processing Addendum"** — sign electronically if available for your plan tier
4. If not available on your current plan: Email **privacy@openai.com** or contact via [https://privacy.openai.com/policies](https://privacy.openai.com/policies)
5. For **HIPAA BAA** (required before healthcare use):
   - Email **enterprise@openai.com**: "HIPAA BAA Request — Datacendia LLC API Customer"
   - OpenAI HIPAA BAA is available for API customers processing de-identified data
   - **Prerequisite:** PHI MUST be de-identified via `POST /api/v1/privacy/deidentify` before any prompt reaches OpenAI
6. Upload to `docs/legal/signed-dpas/openai-dpa-YYYY-MM-DD.pdf`

**Critical requirement:** Until OpenAI HIPAA BAA is signed, block all healthcare-tenant requests to AI inference endpoints.

---

## Post-Signing Checklist

After all 5 DPAs are signed:

- [ ] All signed PDFs uploaded to `docs/legal/signed-dpas/`
- [ ] `docs/legal/subprocessor-dpa-checklist.md` updated with dates and signatory names
- [ ] Calendar reminders set for annual DPA review (same month each year)
- [ ] SOC 2 reports obtained from each subprocessor and stored in `docs/soc2/vendor-reports/`
- [ ] DPO / Privacy Officer notified of completion
- [ ] Notify customer success: EU customers can now be onboarded

---

## DPO Appointment Letter Template

Sign and date the letter in `docs/legal/dpo-appointment-letter.md` and:
1. Keep original on file
2. Send copy to appointed DPO
3. Publish DPO contact on privacy policy page (required by GDPR Art. 37(7))
