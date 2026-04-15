# US State AI Laws — Full Implementation Guide
**Colorado SB 205 | NYC Local Law 144 | Illinois AI Video Interview Act**
**Document Owner:** Engineering Lead + Legal | Version: 1.0 | April 2026

---

## 1. Colorado AI Act — SB 205

### Overview
- **Statute:** Colo. Rev. Stat. §6-1-1701 et seq.
- **In Force:** February 1, 2026
- **Enforcer:** Colorado Attorney General
- **Penalty:** Up to $20,000 per violation; $500K cap per investigation
- **Who is covered:** Developers AND deployers of high-risk AI systems

### What is a "Consequential Decision"?

AI that makes or substantially contributes to decisions with legal or similarly significant effects in:

| Domain | Examples in Datacendia context |
|---|---|
| Education | Admission decisions, academic progression, tutoring recommendations |
| Employment | Hiring, firing, promotion, task allocation, performance evaluation |
| Financial services | Credit approval, insurance underwriting, loan decisions |
| Government services | Benefit eligibility, permits, public service allocation |
| Healthcare | Treatment recommendations, care plans, triage priority |
| Housing | Rental applications, mortgage decisions, tenant screening |
| Legal services | Case outcome prediction, bail/sentencing recommendations |

### Developer Obligations (Datacendia as Developer)

| Obligation | Implementation | Status |
|---|---|---|
| Provide deployers with documentation about AI system | Include use case classification in API response (`X-AI-Consequential-Domain` header) | ✅ |
| Disclose high-risk designation to deployers | `AIRegulatoryClassifier` output in API metadata | ✅ |
| Use reasonable care to protect consumers from algorithmic discrimination | Bias detection via `NLPBiasDetectionService`; guardrails via NeMo | ✅ |
| Provide technical documentation for impact assessment | This document + API documentation | ✅ |

### Deployer Obligations (Datacendia Customers as Deployers)

When a customer uses Datacendia for a consequential decision domain, they must:

| Obligation | Timing | How Datacendia Helps |
|---|---|---|
| Conduct annual AI Impact Assessment | Before deployment + annually | Template: `docs/compliance/state-ai-laws-implementation.md#impact-assessment-template` |
| Disclose to consumers AI is used | Before decision | `POST /api/v1/privacy/appeal-ai-decision` disclosure included in response |
| Provide opportunity to correct data | Before decision | `PATCH /api/v1/privacy/rectify` |
| Provide explanation of principal reasons | On request | AI deliberation output includes reasoning chain |
| Provide appeal / human review mechanism | Within 45 days | `POST /api/v1/privacy/appeal-ai-decision` endpoint |
| Implement risk management programme | Ongoing | ISO 27001 + ISO 42001 aligned |

### API Behaviour Under SB 205

All AI inference/deliberation routes now automatically:
1. Classify the request topic against consequential domains (`AIRegulatoryClassifier`)
2. Attach `X-AI-Consequential-Domain` header if high-risk domain detected
3. Attach `X-AI-Regulatory-Risk` header (CRITICAL/HIGH/MEDIUM/LOW/NONE)
4. Include appeal mechanism link in `X-AI-Frameworks` header
5. Log high-risk classifications to audit trail (`ai.regulatory_classified` event)

**API consumer example:**
```http
POST /api/v1/deliberations
Content-Type: application/json

{
  "topic": "Evaluate candidate applications for engineering positions",
  "useCase": "Employment hiring screening",
  "coloradoSB205NoticeAcknowledged": true
}

Response headers:
X-AI-Consequential-Domain: EMPLOYMENT
X-AI-Regulatory-Risk: HIGH
X-AI-AEDT: true; see GET /api/v1/privacy/aedt-disclosure
X-AI-Frameworks: Colorado AI Act SB 205 (Feb 2026); NYC Local Law 144 (Jul 2023)
X-GDPR-Article-22: automated-decision; human-review-available; see POST /api/v1/privacy/appeal-ai-decision
```

### Impact Assessment Template (Annual — per SB 205 §6-1-1702)

Complete this annually for each high-risk AI use case deployed:

```
COLORADO AI ACT — AI IMPACT ASSESSMENT
Use Case: [Name]
Assessment Date: [Date]
Assessor: [Name, Role]
Review Date: [Next Annual Review]

1. SYSTEM DESCRIPTION
   Purpose and intended use: [describe]
   Consequential decision domain: [Education/Employment/Financial/etc.]
   
2. BENEFITS
   Expected benefits to consumers: [list]
   Expected benefits to deployer: [list]
   
3. RISKS OF ALGORITHMIC DISCRIMINATION
   Protected characteristics potentially affected: race, sex, age, disability, religion, national origin
   Data sources used: [list training data sources]
   Known biases in training data: [describe]
   Bias testing conducted: [method, results, date]
   Mitigation measures: [list]
   
4. DATA GOVERNANCE
   Personal data collected: [types]
   Retention period: [days/years]
   Access controls: [describe]
   Data subject rights available: access, correct, delete, appeal
   
5. PERFORMANCE METRICS
   Accuracy: [%]
   False positive/negative rates: [%]
   Equity metrics by demographic group: [results]
   
6. MONITORING PLAN
   Ongoing performance monitoring: [method, frequency]
   Drift detection: [method]
   Incident escalation: [process]
   
7. HUMAN OVERSIGHT
   Human review available: Yes / No
   Human review process: [describe]
   Appeal process: POST /api/v1/privacy/appeal-ai-decision

Signed: _________________ Date: _________
```

---

## 2. NYC Local Law 144 — Automated Employment Decision Tools (AEDT)

### Overview
- **Statute:** NYC Admin. Code §20-870 et seq.
- **In Force:** July 5, 2023 (active enforcement)
- **Enforcer:** NYC Department of Consumer and Worker Protection (DCWP)
- **Penalty:** $375 first violation; $1,500 subsequent violations (per day)
- **Who is covered:** Employers and employment agencies using AEDT for NYC candidates/employees

### What is an AEDT?

Any computational process derived from machine learning, statistical modelling, data analytics, or AI that **issues simplified output** (score, classification, recommendation) used to **screen or rank** job candidates or employees for employment decisions.

Datacendia's deliberation platform **IS an AEDT** when configured for employment use cases.

### Employer Obligations (Checklist)

**Before deploying for NYC employment:**

- [ ] Conduct independent **bias audit** before first use
  - Must be performed by independent third party (not an employee)
  - Must calculate selection rates by race/sex category
  - Comparison: selection rate ÷ most-favoured group rate ≥ 80% (4/5 rule)
  - Results published on company website
  - Recommended auditors: FairNow (`fairnow.ai`), BABL AI (`bablai.com`), Parity AI

- [ ] Publish bias audit results publicly on company website within 10 days of audit

- [ ] Provide **advance notice** to candidates/employees at least **10 business days before** use:
  ```
  We use an automated employment decision tool (AEDT) to assist in evaluating 
  candidates. You may request an alternative process by contacting [HR email].
  The AEDT evaluates the following job qualifications: [list characteristics].
  Data categories used: [list].
  ```

- [ ] Provide **individual notice** to NYC-based candidates/employees before using AEDT

- [ ] Offer **alternative selection process** to any candidate who requests one

### Datacendia API Support for LL 144 Compliance

| Endpoint | Purpose |
|---|---|
| `GET /api/v1/privacy/aedt-disclosure` | Returns LL 144 disclosure notice for embedding in employer communications |
| `POST /api/v1/deliberations` with `useCase: 'employment'` | Triggers AEDT detection, adds `X-AI-AEDT` header and LL 144 warning |
| Response metadata | Includes `isAEDT: true` and bias audit requirement notification |

### Bias Audit Schedule

| Event | Timing | Action |
|---|---|---|
| First deployment for NYC employment | Before use | Commission bias audit |
| Annual renewal | Each calendar year | Repeat bias audit |
| Significant change to model | After modification | Commission new audit |
| New data source added | After addition | Commission new audit |

---

## 3. Illinois AI Video Interview Assessment Act (AIVIA)

### Overview
- **Statute:** 820 ILCS 42 (Illinois Compiled Statutes)
- **In Force:** January 1, 2020 (first AI-specific employment law in the US)
- **Enforcer:** Illinois AG; private right of action
- **Penalty:** $500–$20,000 per violation; class action exposure; attorneys' fees
- **Who is covered:** Any employer that uses AI to analyse recorded video job interviews of Illinois applicants

### What Triggers AIVIA?

AI analysis of video interviews — including:
- Facial expression analysis
- Tone/voice analysis
- Body language assessment
- Emotion recognition in video
- Any AI scoring of video interview content

**Datacendia triggers AIVIA** if used to analyse video interview recordings for Illinois-based applicants.

### Employer Obligations

**BEFORE the interview:**

1. **Notify** the applicant in writing that AI will be used to analyse the video
2. **Explain** what characteristics the AI will evaluate
3. **Provide** an explanation of the general process of how the AI works
4. **Obtain consent** — must be explicit written consent; no consent = no AI analysis
5. **Confirm** only authorized individuals will view AI analysis

**AFTER the interview:**

6. **Limit sharing** — AI analysis may only be shared with persons whose expertise is necessary for the hiring decision
7. **Delete** video and AI analysis within 30 days of applicant's written request

### API Consent Gate (Hard Block)

The `aiRegulatoryMiddleware` enforces this automatically:

```typescript
// Blocked — returns HTTP 451
POST /api/v1/inference
{
  "topic": "analyse video interview for software engineer candidate"
  // Missing: illinoisAIVIAConsent: true
}

// Allowed — proceeds
POST /api/v1/inference
{
  "topic": "analyse video interview for software engineer candidate",
  "illinoisAIVIAConsent": true  // OR header: X-Illinois-AIVIA-Consent: true
}
```

**Consent record:** Customer must retain proof of written consent. Datacendia logs the `illinoisAIVIAConsent` flag in the audit trail.

### Deletion Request Endpoint

When an applicant requests deletion of their video and AI analysis:
- Use `DELETE /api/v1/privacy/erasure` with `{ categories: ['video_interview', 'ai_analysis'] }`
- Must complete within 30 days of written request
- Log deletion in audit trail

### Practical Guidance for Customers

```
ILLINOIS AI VIDEO INTERVIEW DISCLOSURE (recommended language)

This interview will be recorded and analysed by artificial intelligence technology 
provided by Datacendia, LLC.

The AI will evaluate the following characteristics: [specify — e.g., communication 
clarity, response structure, key qualification indicators].

Only the following individuals will review the AI analysis: [list roles, e.g., 
HR Director, Hiring Manager].

You may decline AI analysis by notifying us before your interview. Declining will 
not affect your consideration for the position.

You may request deletion of your video and AI analysis at any time by contacting 
privacy@[employer].com. Requests will be fulfilled within 30 days.

By proceeding with this recorded interview, you consent to the above.
```

---

## Interaction Between State AI Laws and Existing Rights

| User Action | Endpoint | Covers |
|---|---|---|
| Appeal AI employment/hiring decision | `POST /api/v1/privacy/appeal-ai-decision` | CO SB 205 §6-1-1703; VA CDPA; TX TDPSA |
| Opt out of profiling | `POST /api/v1/privacy/opt-out-profiling` | CO, VA, TX, CT, OR |
| Request AEDT disclosure | `GET /api/v1/privacy/aedt-disclosure` | NYC LL 144 |
| Delete video interview data | `DELETE /api/v1/privacy/erasure` | IL AIVIA; GDPR Art. 17 |
| Access personal data used in decision | `GET /api/v1/privacy/access` | All 25 state laws |
| Correct inaccurate data | `PATCH /api/v1/privacy/rectify` | CO SB 205; all state laws |
