# Emerging Regulations — Active Watch List
**Document Owner:** Legal | Version: 1.0 | April 2026
**Review Cadence:** Monthly — update status column and flag anything requiring immediate action

---

## Monitoring Protocol

Each regulation below is assigned a **trigger condition** — the point at which Datacendia must take action. Before the trigger condition is met, monitor only. After it is met, begin implementation sprint.

**Monitor sources:**
- IAPP Global Legislative Tracker: [https://iapp.org/resources/article/global-privacy-legislation/](https://iapp.org/resources/article/global-privacy-legislation/)
- Hunton Andrews Kurth Privacy Blog: [https://www.huntonprivacyblog.com](https://www.huntonprivacyblog.com)
- Future of Privacy Forum: [https://fpf.org](https://fpf.org)
- EU AI Office: [https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence](https://digital-strategy.ec.europa.eu/en/policies/european-approach-artificial-intelligence)
- Bird & Bird Tech/Data tracker: [https://www.twobirds.com](https://www.twobirds.com)

---

## Tier 1 — High Probability of Impact (Monitor Monthly)

### 1. Canada — CPPA / Bill C-27 (Consumer Privacy Protection Act)
- **Status:** Before Parliament Senate as of April 2026; likely royal assent 2026–2027
- **Jurisdiction:** Federal Canada (replaces PIPEDA)
- **What changes:** GDPR-style fines (up to 5% global revenue / C$25M), enhanced breach notification, AI transparency (Part 3 — Artificial Intelligence and Data Act), data mobility rights, right to erasure
- **Trigger condition:** Royal assent passed; 2-year transition period begins
- **Estimated action required:** 2–3 weeks to update PIPEDA → CPPA compliance documentation; no new code needed (GDPR rights already implemented)
- **Monitor at:** [https://www.parl.ca/LegisInfo/en/bill/44-1/C-27](https://www.parl.ca/LegisInfo/en/bill/44-1/C-27)

### 2. Brazil — AI Bill (Bill 2338/2023)
- **Status:** Senate committee approval 2024; House of Representatives review 2025–2026
- **Jurisdiction:** Brazil (federal)
- **What it does:** GDPR-aligned AI regulation; high-risk AI classification similar to EU AI Act; audit requirements; civil liability for AI damage; 2-year implementation period
- **Key provision:** "High-risk AI" includes credit scoring, hiring, healthcare, public safety — same domains as Colorado SB 205
- **Trigger condition:** Enacted by both chambers + presidential signature
- **Action when triggered:** 2–3 weeks to map Brazil AI Bill obligations to existing CO SB 205 implementation (likely reuses most controls)
- **Monitor at:** Senate website + LGPD counsel in Brazil

### 3. India — DPDP Act 2023 Implementing Rules
- **Status:** Rules drafted by MEITY; expected 2025–2026 (delayed multiple times)
- **Jurisdiction:** India (federal)
- **What implementing rules will specify:**
  - Categories of Significant Data Fiduciaries (SDFs) — requiring DPO, DPIA, annual audit
  - Approved countries for cross-border data transfer (is US on the list?)
  - Consent Manager requirements
  - Data Protection Board establishment and procedures
  - Age verification mechanisms for children's data
- **Trigger condition:** Rules gazette notification published
- **Action when triggered:**
  - Check US on approved transfer list → if not, prepare consent-based transfer mechanism
  - If Datacendia classified as SDF → DPO + annual audit + DPIA required
  - Add Data Protection Board to breach notification contacts
- **Monitor at:** [https://www.meity.gov.in](https://www.meity.gov.in); Khaitan & Co. India privacy updates

### 4. Australia — Privacy Act Reform (Privacy and Other Legislation Amendment Act)
- **Status:** Privacy and Other Legislation Amendment Act 2024 (commenced 29 November 2024) — Phase 1 enacted; Phase 2 reform ongoing
- **Jurisdiction:** Australia (federal)
- **Phase 1 changes (IN FORCE):**
  - New statutory tort for serious invasions of privacy (first in Australia)
  - Enhanced criminal penalties for doxxing
  - New rules for automated decision-making
  - Children's Online Privacy Code (draft, coming 2026)
  - Stronger enforcement powers for OAIC
- **Phase 2 expected changes (pending):**
  - Right to erasure (new)
  - Right to object to automated decisions affecting significant interests
  - Small business exemption removal ($3M revenue threshold eliminated)
  - Direct action right for individuals (private right of action)
- **Trigger condition for Datacendia:** Phase 2 enacted (automated decision-making right to object)
- **Action:** Add Australia to `appeal-ai-decision` endpoint legal basis; update `international-privacy-gap-assessment.md`
- **Monitor at:** [https://www.oaic.gov.au/privacy/future-of-privacy](https://www.oaic.gov.au/privacy/future-of-privacy)

### 5. EU — AI Liability Directive (Proposed 2022/0303/COD)
- **Status:** Trilogue ongoing as of April 2026; adoption expected 2026–2027
- **What it does:** Civil liability rules for AI damage; rebuttable presumption of fault; court-ordered evidence disclosure of AI documentation
- **Trigger condition:** Formal adoption in EU Official Journal + 2-year transposition deadline
- **Action when triggered:**
  - Add AI liability limitation clauses to all EU customer contracts
  - Retain AI deliberation logs for extended period (discovery risk)
  - Review professional liability insurance for AI coverage
  - See `docs/compliance/eu-data-act-ai-liability.md` Part 2 — template already prepared
- **Monitor at:** [https://eur-lex.europa.eu/legal-content/EN/HDP/?uri=CELEX:52022PC0496](https://eur-lex.europa.eu/legal-content/EN/HDP/?uri=CELEX:52022PC0496)

---

## Tier 2 — Medium Probability of Impact (Monitor Quarterly)

### 6. Texas — Responsible AI Governance Act (TRAIGA)
- **Status:** HB 1709 / SB 2024 filed 2025 session; status uncertain as of April 2026
- **What it does:** Similar to Colorado SB 205 — consequential decisions, impact assessments, anti-discrimination
- **Trigger condition:** Enacted; effective date passed
- **Action when triggered:** Colorado SB 205 controls already satisfy ~85% of expected Texas requirements; minor documentation updates
- **Monitor at:** [https://capitol.texas.gov](https://capitol.texas.gov)

### 7. EU — ePrivacy Regulation
- **Status:** Original ePR proposal (2017) stalled; new approach under Council of EU 2025
- **What it will do:** Replace ePrivacy Directive; new cookie/tracking rules; electronic communications metadata rules
- **Trigger condition:** Council agreement reached + formal adoption
- **Action when triggered:** Review cookie implementation; session cookie compliance already strong (HttpOnly, Secure, SameSite)
- **Monitor at:** EU Council tracker

### 8. Chile — New PDPA (Law 21.719) Implementation
- **Status:** Law 21.719 enacted 2024; 24-month transition period running through late 2026
- **What it does:** Replaces 1999 law; GDPR-aligned; DPO; DPIA; breach notification to CPLT; fines up to 10,000 UTM (~$600K)
- **Trigger condition:** Transition period ends (expected Q4 2026); enforcement begins
- **Action when triggered:** Register DPO with CPLT; file ROPA equivalent; add CPLT to breach notification contacts
- **Monitor at:** [https://www.cplt.cl](https://www.cplt.cl)

### 9. Argentina — PDPA Modernisation Bill
- **Status:** Reform bill in Congress; draft circulated 2024
- **What it does:** Updates Law 25.326 to GDPR standard; new rights; DPO; fines up to 5% revenue
- **Trigger condition:** Enacted
- **Action when triggered:** Current GDPR compliance largely sufficient; update Argentina section of international assessment
- **Monitor at:** AAIP (Argentine DPA) updates

### 10. UK — Pro-Innovation AI Regulatory Framework
- **Status:** UK government published AI Regulation White Paper 2023; no dedicated AI Act expected near-term; sectoral approach
- **What it does:** Each regulator (FCA, CMA, ICO, Ofcom) applies existing rules to AI + publishes AI guidance
- **Trigger condition:** ICO updates AI guidance to include binding obligations; OR new UK AI legislation enacted
- **Key current ICO guidance:** "Explaining decisions made with AI" (binding); GDPR Art. 22 applies fully in UK
- **Action now:** Review ICO "Explaining AI" guidance — GDPR Art. 22 disclosures already implemented
- **Monitor at:** [https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/artificial-intelligence/)

### 11. Singapore — Model AI Governance Framework (Binding Version)
- **Status:** MAS (Monetary Authority of Singapore) Fairness, Ethics, Accountability, and Transparency (FEAT) principles are binding for financial institutions; broader framework voluntary
- **What changes:** Singapore PDPC published AI governance framework 2.0; move toward binding AI regulation expected 2026+
- **Trigger condition:** Singapore parliament introduces AI regulation bill
- **Action when triggered:** FEAT compliance for financial institution customers in SG; CO SB 205 controls likely reusable
- **Monitor at:** PDPC Singapore + MAS

---

## Tier 3 — Lower Probability or Longer Timeline (Monitor Quarterly)

### 12. US — Federal Privacy Law (ADPPA)
- **Status:** American Data Privacy and Protection Act — stalled in Congress; no movement as of April 2026
- **What it would do:** National US privacy law; preempts some state laws; GDPR-equivalent rights
- **Trigger condition:** House + Senate passage + Presidential signature (currently very unlikely)
- **Action when triggered:** Existing GDPR + state law compliance satisfies ~90% of ADPPA requirements
- **Assessment:** Very low probability in near term given political environment; state laws will continue to proliferate

### 13. Japan — APPI Further Amendments
- **Status:** Japan PPC reviewing APPI 2024–2025 for potential 2025 amendment
- **Expected changes:** Enhanced data transfer restrictions; possibly GDPR adequacy-equivalent conditions
- **Trigger condition:** PPC publishes amendment bill
- **Action when triggered:** Update Japan APPI section of international assessment; review cross-border transfer mechanism

### 14. EU — Data Spaces (European Health Data Space — EHDS)
- **Status:** EHDS Regulation under negotiation; expected 2025–2026
- **Scope:** Patient health data sharing across EU member states; electronic health records portability
- **Relevance to Datacendia:** If any AI deliberation involves EU patient health data for research or secondary use
- **Trigger condition:** EHDS adopted + healthcare customer onboarded for health data AI
- **Action when triggered:** EHDS data access and secondary use compliance; PHI de-identification already implemented

### 15. China — Additional AI Regulations
- **Status:** Ongoing; multiple regulations published in 2023–2024 (Generative AI Regulation; Algorithm Recommendation Regulation; Deep Synthesis Regulation)
- **What exists:**
  - Generative AI Regulation (Aug 2023): Registration with CAC; safety assessment; content filtering
  - Algorithm Recommendation Regulation (Mar 2022): Transparency; opt-out; user labelling
  - Deep Synthesis Regulation (Jan 2023): Labels on AI-generated content
- **Trigger condition:** Any China market entry or serving Chinese enterprise customers
- **Action when triggered:** Engage China-specialist legal counsel immediately; compliance cost very high; see `global-regulatory-landscape.md` China section
- **Assessment:** Do not enter China market without dedicated China compliance team

---

## Watchlist Review Log

| Review Date | Reviewer | Changes | Next Actions |
|---|---|---|---|
| April 2026 | Engineering Lead | Initial watchlist created | Monthly review of Tier 1 items |
| _[next month]_ | | | |

---

## Watchlist Escalation Criteria

**Escalate to immediate action sprint when:**
- Any Tier 1 item has a firm enforcement date within 6 months
- Any item with "Trigger condition: already met" status
- Any item where a customer asks "are you compliant with [X]?" and current answer is unclear
- Any fine issued against a similar SaaS company for a listed regulation

**Escalation contact:** CEO + Engineering Lead + Legal

**Sprint duration estimate:** 2–4 weeks per new regulation (most reuse existing GDPR infrastructure)
