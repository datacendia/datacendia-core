# UK ICO Registration — Step-by-Step Guide
**Data Protection (Charges and Information) Regulations 2018**
**Required for all UK data controllers | Fee: £40–£2,900/year depending on size**

---

## Do We Need to Register?

**Yes**, if Datacendia:
- Processes personal data of UK residents (UK GDPR applies since Jan 2021)
- Has UK customers or monitors UK user behaviour
- Does not fall into an exemption (most commercial SaaS does not)

**Exemptions** (Datacendia likely does NOT qualify):
- Processing only for personal/family/household purposes
- Processing only for national security
- Only processing for payroll/accounts (not our case)

**Conclusion: Register with ICO. Fee tier: Tier 1 (£40/year) — small organisation with annual turnover ≤ £36M and ≤ 250 employees.**

---

## Registration Steps

### Step 1 — Create an ICO Account
1. Go to: **[https://ico.org.uk/registration/new/](https://ico.org.uk/registration/new/)**
2. Click **"Register now"**
3. Create account with email: **privacy@datacendia.com**
4. Verify email

### Step 2 — Complete the Registration Form

Fill in the following (have this document open):

| Field | Value |
|---|---|
| Organisation type | **Limited company / LLC** |
| Organisation name | **Datacendia, LLC** |
| Trading name (if different) | Datacendia |
| Registered address | [US registered agent address] |
| UK contact address | [If you have a UK contact or agent — otherwise US address] |
| Nature of processing | Provide software services (SaaS AI governance platform) to UK organisations; process personal data on behalf of customers |
| Number of staff | [Current headcount] |
| Annual turnover | [Annual turnover in GBP equivalent] |
| Data Protection Officer | [DPO name] — privacy@datacendia.com |

### Step 3 — Select the Tier

| Tier | Annual Turnover | Employees | Annual Fee |
|---|---|---|---|
| **Tier 1** | ≤ £36M | ≤ 250 | **£40** ← Datacendia |
| Tier 2 | ≤ £36M | > 250 OR > £36M turnover | £60 |
| Tier 3 | > £36M | > 250 | £2,900 |

**Select Tier 1: £40**

### Step 4 — Pay

Payment accepted by: Debit/credit card, direct debit
Renewal: Annual (set a calendar reminder)

### Step 5 — Receive ICO Registration Number

You will receive a **ZA-XXXXXX** registration number. This:
- Must be published on your website privacy policy
- Must be quoted in any ICO correspondence
- Confirms you are registered as a data controller in the UK

---

## Post-Registration Actions

1. **Add to privacy policy:**
   ```
   Datacendia LLC is registered with the UK Information Commissioner's Office
   under registration number ZA-XXXXXX.
   UK residents may lodge complaints with the ICO at https://ico.org.uk/make-a-complaint/
   ```

2. **Update `GET /api/v1/privacy/policy` endpoint** — add ICO number and UK supervisory authority contact

3. **Update IR policy** — ensure ICO breach notification process is documented (72-hour window)

4. **Store registration certificate** → `docs/legal/ico-registration-certificate-YYYY.pdf`

---

## UK ICO Breach Notification

After registration, all UK personal data breaches that risk individual rights must be reported to the ICO within **72 hours**.

**How to report:**
- Online: [https://ico.org.uk/make-a-complaint/data-security-and-personal-data-breach-reports/](https://ico.org.uk/make-a-complaint/data-security-and-personal-data-breach-reports/)
- Phone: 0303 123 1113
- Include: What happened, what data affected, what you've done, contact details

**Add ICO breach report URL to `docs/policies/incident-response-policy.md`**

---

## Useful ICO Links

| Resource | URL |
|---|---|
| Registration portal | https://ico.org.uk/registration/ |
| Check if registered | https://ico.org.uk/ESDWebPages/Search |
| Report a breach | https://ico.org.uk/make-a-complaint/data-security-and-personal-data-breach-reports/ |
| DPO notification | https://ico.org.uk/for-organisations/guide-to-data-protection/guide-to-the-general-data-protection-regulation-gdpr/accountability-and-governance/data-protection-officers/ |
| UK GDPR guidance | https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/ |

---

## Annual Renewal Reminder

**Set a recurring annual reminder:** ICO registration expires and must be renewed. The ICO will send reminders but calendar entries are recommended.

- Renewal month: [Month of initial registration]
- Renewal fee: £40 (Tier 1)
- Renewal URL: Same registration portal
