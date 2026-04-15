# Germany BDSG & France CNIL — National GDPR Implementations
**Supplement to GDPR Compliance for DE/FR Enterprise Customers**
**Document Owner:** Legal | Version: 1.0 | April 2026

---

## Part 1 — Germany: BDSG (Bundesdatenschutzgesetz)

### Overview

- **Statute:** Bundesdatenschutzgesetz (Federal Data Protection Act) — new BDSG 2018, amended 2023
- **Regulator:** BfDI (Bundesbeauftragter für den Datenschutz und die Informationsfreiheit) — Federal DPA
  - URL: [https://www.bfdi.bund.de](https://www.bfdi.bund.de)
  - State DPAs (Landesbeauftragten) for state-specific matters — 16 state DPAs
- **Framework:** GDPR + BDSG (national additions/derogations)
- **AI-specific guidance:** ULD (Unabhängiges Landeszentrum für Datenschutz Schleswig-Holstein) AI guidelines

### Key BDSG Additions to GDPR

#### § 22 BDSG — Processing of Special Categories (Sensitive Data)

Germany requires ADDITIONAL safeguards beyond GDPR Art. 9:
- Appointment of a DPO is mandatory more broadly (not just the GDPR Art. 37 threshold)
- If processing sensitive data of 20+ data subjects regularly → DPO mandatory
- **Action:** Existing DPO appointment satisfies this.

#### § 26 BDSG — Employee Data Processing (Critical for AI)

**The most important BDSG provision for Datacendia's AI use cases.**

Any AI-based processing of employee data requires:

1. **Legal basis:** Necessity for employment relationship (§26 BDSG) OR collective agreement OR works council agreement (Betriebsvereinbarung)

2. **Works council (Betriebsrat) co-determination:**
   - § 87 (1) Nr. 6 BetrVG (Works Constitution Act): Works council has mandatory co-determination right over **"technical systems for monitoring employee performance or conduct"**
   - This covers: AI performance monitoring, productivity tracking, attendance analysis, communication monitoring, any AI that assesses employee behaviour
   - **Without works council consent, such AI use is INVALID and injunctions can be obtained**

3. **Specific requirements for AI in employment:**
   - Must disclose to employees that AI analyses their data
   - Must specify what data, what AI system, what conclusions drawn
   - Right to human review of AI-assisted employment decisions (§26 BDSG + BDSG §31)

4. **§ 31 BDSG — Scoring:**
   - Restrictions on using AI scoring (similar to GDPR Art. 22 but stricter)
   - Credit scoring providers must disclose mathematical-statistical method

### Works Council AI Disclosure Template (Betriebsvereinbarung Excerpt)

German enterprise customers using Datacendia AI for employee decisions must negotiate a works council agreement. Provide this template on request:

```
BETRIEBSVEREINBARUNG — KI-SYSTEME (WORKS COUNCIL AGREEMENT — AI SYSTEMS)

Between: [Company] and [Works Council]

§ 1 PURPOSE AND SCOPE
This agreement governs the deployment of Datacendia LLC's AI deliberation 
platform for HR and operational decisions affecting employees.

§ 2 AI SYSTEM DESCRIPTION
- System: Datacendia AI Deliberation Platform (app.datacendia.com)
- Provider: Datacendia, LLC (USA) — DPA/SCC in place
- Purpose: [specify: e.g., performance review support, project allocation]
- Data processed: [specify: name, performance metrics, project data]
- AI output: [specify: scoring, ranking, recommendation, classification]

§ 3 EMPLOYEE RIGHTS
(1) Employees will be informed when AI analyses their data for HR decisions.
(2) Employees may request human review of any AI-assisted decision
    via POST /api/v1/privacy/appeal-ai-decision.
(3) Employees may access their data via GET /api/v1/privacy/access.
(4) Employees may correct inaccurate data via PATCH /api/v1/privacy/rectify.

§ 4 PROHIBITED USES
The AI system shall NOT be used for:
- Continuous behavioural monitoring
- Social scoring or employee ranking for non-performance purposes
- Emotion recognition in the workplace
- Any purpose listed as prohibited under EU AI Act Article 5

§ 5 OVERSIGHT AND AUDIT
The works council has the right to:
- Annual review of AI system performance data
- Review of bias audit results
- Consultation prior to significant changes to the AI system

§ 6 TERM AND TERMINATION
This agreement is valid for [2 years] and automatically renewable unless 
terminated by 3 months' written notice.

[Signatures: Management + Works Council Chair]
```

### German AI Regulatory Watch

| Development | Status | Relevance |
|---|---|---|
| BfDI guidance on ChatGPT/AI systems | Published 2023; updated 2024 | AI in workplace; DPO review needed |
| DSK (Conference of DPAs) AI position paper | Published 2023 | GDPR Art. 22 + Art. 5(1)(a) lawful basis for AI decisions |
| Hamburg DPA: AI and employer rights | Guidance 2024 | Applies to Hamburg-based employers |
| EU AI Act national implementation | Germany designating national competent authority | BfDI likely notified body for horizontal AI oversight |

### Germany-Specific Privacy Notice Requirements

German privacy notices (Datenschutzerklärung) must be:
- Written in clear German (or provide certified translation)
- Accessible from every page of the application
- Include: all GDPR Art. 13/14 elements + BfDI contact information
- If AI profiling is used: disclose automated decision-making, logic involved, consequences

**Action:** Provide German-language privacy policy for German enterprise customers. Add `Accept-Language: de` branch to privacy notice endpoint.

---

## Part 2 — France: CNIL (Commission Nationale de l'Informatique et des Libertés)

### Overview

- **Regulator:** CNIL — [https://www.cnil.fr](https://www.cnil.fr)
- **National law:** Loi Informatique et Libertés (LIL) — amended by GDPR implementation law
- **France is Datacendia's GDPR lead supervisory authority** if Datacendia has its EU establishment in France (or the EU DPA of the member state of main establishment)
- **AI-specific:** CNIL published major AI compliance guidelines in 2023–2024

### CNIL AI Compliance Recommendations (2023–2024)

CNIL published "AI compliance approach" guidance covering:

#### 1. Lawful Basis for AI Training Data

CNIL position:
- Training AI on publicly scraped data without consent may violate GDPR Art. 6
- Legitimate interest requires strict necessity test
- **For Datacendia:** AI models used are OpenAI models trained externally — Datacendia does not train models on customer data
- **Documentation needed:** Confirm and document that no customer data is used for model training

#### 2. Purpose Limitation for AI

CNIL requires:
- AI system must have specified, explicit, and legitimate purposes
- AI output cannot be repurposed for different decisions
- **Implementation:** AI deliberation purpose must be specified in request (`useCase` field); `AIRegulatoryClassifier` enforces domain classification

#### 3. Data Minimisation in AI

CNIL guidance:
- Only personal data strictly necessary for the AI purpose may be processed
- Anonymise or pseudonymise data before AI processing where possible
- **Implementation:** `POST /api/v1/privacy/deidentify` — PHI de-identification before AI inference

#### 4. CNIL AI Audit Framework

CNIL recommends organisations conduct an AI audit covering:
- Inventory of AI systems processing personal data
- Lawful basis for each system
- Data subjects affected
- Measures to ensure rights and freedoms

Use the ISO 42001 AI Policy + NIST AI RMF profile as the audit evidence base.

### CNIL Enforcement History (AI-Relevant)

| Case | Date | Fine | Lesson |
|---|---|---|---|
| Clearview AI | 2022 | €20M | Facial recognition scraping unlawful |
| TikTok | 2023 | €5M | Cookie consent + children's data |
| ChatGPT investigation | 2023 | Ongoing | AI model training on EU personal data |
| San Francisco tracking app | 2024 | Under investigation | Location data + AI profiling |

### French Labour Law and AI

**Code du travail — Employee Monitoring:**

- **Art. L.1222-4:** Employees must be individually informed of all methods of professional evaluation (any automated system assessing employee performance)
- **Art. L.2323-4:** Works council (Comité Social et Économique — CSE) must be consulted before deployment of any system for remote collection of professional evaluation data
- **Art. L.1132-1:** Prohibition of employment discrimination — AI outputs must not discriminate on protected grounds

**CNIL guidance on employee monitoring (2022):**
- Geolocation and productivity monitoring require justification
- Email/communication monitoring: only in specific, limited circumstances
- Biometric access control: requires CNIL authorisation

**For French enterprise customers using Datacendia AI for HR:**
1. Consult CSE (Comité Social et Économique) before deployment
2. Include AI use in employee information and consultation (Art. L.2323-4)
3. Add to internal data protection register (ROPA)
4. Update individual employment contracts or collective agreement

### French-Language Requirements

**Documents that must be available in French for French customers:**
- Privacy policy (Politique de confidentialité)
- Cookie notice (Avertissement relatif aux cookies)
- Terms of Service (Conditions Générales d'Utilisation)
- AEDT disclosure (Déclaration d'outil de décision automatisée)

**Action:** Add `Accept-Language: fr` branch to privacy notice endpoint; provide French translations on request.

---

## Cross-National DE/FR Action Plan

| Action | Regulation | Owner | Target |
|---|---|---|---|
| Works council agreement template (DE) | BDSG §26; BetrVG §87 | Legal | Q3 2026 |
| German-language privacy notice | BDSG; GDPR Art. 13 | Legal | Q3 2026 |
| French-language privacy notice | LIL; GDPR Art. 13 | Legal | Q3 2026 |
| CSE consultation template (FR) | Code du travail | Legal | Q3 2026 |
| No-training-on-customer-data attestation | CNIL AI guidance | Engineering | Q2 2026 (document) |
| Privacy notice language detection (`Accept-Language`) | GDPR Art. 13; LIL; BDSG | Engineering | Q3 2026 |
| AI audit inventory per CNIL framework | CNIL AI audit | Engineering | Q3 2026 |
| BfDI DPO registration notification | BDSG | Legal (DPO) | On DPO appointment |
