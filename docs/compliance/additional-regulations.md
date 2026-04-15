# Additional Regulations — Extended Survey
**Supplements `global-regulatory-landscape.md` and `us-state-privacy-laws.md`**
**Document Owner:** Legal | Version: 1.0 | April 2026

---

## US — AI-Specific Laws (State Level)

### Colorado SB 205 — Colorado AI Act
- **Enacted:** May 2024 | **In Force:** February 1, 2026
- **First comprehensive US state AI law** — closest US equivalent to EU AI Act
- **Scope:** Developers and deployers of "high-risk AI systems" — defined as AI that makes or substantially contributes to "consequential decisions" affecting:
  - Education/vocational training, employment, essential government services, financial/lending services, healthcare, housing, insurance, legal services
- **Applicability to Datacendia:** **HIGH** — AI deliberation platform used for any of these domains triggers obligations
- **Key obligations:**
  - Disclose use of high-risk AI to consumers
  - Risk management programme (similar to EU AI Act)
  - Annual impact assessments for high-risk systems
  - Opt out of consequential AI decisions and appeal mechanism
  - Discrimination protections (must test for bias before deployment)
  - Regulator: Colorado AG (enforcement begins Jul 2026)
- **Gap vs current implementation:** No consumer-facing appeal mechanism for AI decisions; no bias testing attestation for Colorado use cases
- **Action:**
  - [ ] Add `POST /api/v1/privacy/appeal-ai-decision` endpoint (SB 205 §6-1-1703)
  - [ ] Implement bias impact assessment workflow for high-risk AI use cases
  - [ ] Add Colorado-specific disclosure to AI transparency metadata

### New York City — Local Law 144 (Automated Employment Decision Tools — AEDT)
- **In Force:** July 5, 2023 (active enforcement)
- **Scope:** Employers and employment agencies using automated tools to screen or rank job candidates/employees in NYC
- **Applicability:** **Directly relevant** — Datacendia AI can be used for HR/hiring decisions by NYC employers
- **Key obligations:**
  - **Bias audit** required annually by independent auditor before use
  - **Public notice** on company website: what tool is used, what data collected, bias audit summary
  - **Individual notice** to NYC candidates/employees: they're being screened by an AEDT; right to alternative process
  - Regulator: NYC Department of Consumer and Worker Protection (DCWP)
  - Fine: $375–$1,500 per violation per day
- **Action:**
  - [ ] Add AEDT disclosure API field to HR-related deliberation outputs
  - [ ] Document: Datacendia customers using platform for NYC employment screening must conduct LL 144 bias audits
  - [ ] Add LL 144 warning to any "employment" or "hiring" deliberation template
  - [ ] Consider partnering with bias audit firm (FairNow, Parity AI, etc.)

### Illinois — AI Video Interview Assessment Act
- **In Force:** Jan 2020 (one of the first AI laws anywhere)
- **Scope:** Employers using AI to analyse video interviews of Illinois job candidates
- **Requirements:** Notify candidates AI is being used; explain how it works; obtain consent; limit who sees analysis
- **Applicability:** Low unless Datacendia integrates with video interview platforms
- **Action:** Add notice if video analysis features ever added

### Illinois BIPA — Amendment (HB 3773, 2024)
- **Change:** Statute of limitations clarification — each scan is separate violation ($1,000–$5,000 each)
- **Risk:** Class action risk for any biometric processing in Illinois
- **Action:** EU AI Act Art. 5 guardrail already prevents biometric surveillance — sufficient protection

### Texas HB 4 — Texas Responsible AI Governance Act (Proposed 2025)
- **Status:** Bill filed; not yet law as of April 2026
- **Similar to Colorado SB 205** — watch for enactment
- **Action:** Monitor; implement Colorado SB 205 controls which will likely satisfy Texas too

### Virginia — AI Legislation (Pending)
- **Status:** Multiple AI bills proposed in 2024–2025 sessions; none passed as of April 2026
- **Action:** Monitor — Virginia enacted CDPA quickly; AI law likely coming

---

## US — Sectoral Regulations

### NY DFS — 23 NYCRR Part 500 (Cybersecurity Regulation)
- **In Force:** 2017; major amendments effective Nov 2023 / May 2024
- **Applicability:** Any entity regulated by the NY Department of Financial Services — banks, insurers, investment firms, money transmitters
- **Relevance to Datacendia:** If Datacendia is used as a service provider by NY DFS-regulated entities, those entities must:
  - Ensure Datacendia has "adequate" cybersecurity
  - Include cybersecurity requirements in vendor contracts
  - Conduct periodic risk assessments of Datacendia
- **Key 2023 amendments:**
  - CISO now required to report to board annually
  - 72-hour incident notification to NYDFS
  - New class of "Class A" companies with stricter requirements
  - Multi-factor authentication mandatory for all privileged access
- **Datacendia action:**
  - [ ] Draft NYDFS-compliant vendor security addendum for NY financial institution customers
  - [ ] Confirm MFA enforcement for all privileged accounts (already done ✅)
  - [ ] Ensure 72-hour incident notification to customer covers NYDFS timeline
  - [ ] ISO 27001 certification will satisfy NYDFS vendor assessment requirements

### SEC Cybersecurity Disclosure Rules (2023)
- **In Force:** Dec 2023 (large accelerated filers); Jun 2024 (smaller filers)
- **Scope:** All SEC-registered public companies
- **Relevance:** If Datacendia or its customers are public companies
  - Public companies must disclose **material** cybersecurity incidents within 4 business days (Form 8-K Item 1.05)
  - Annual disclosure of cybersecurity risk management, strategy, governance (Form 10-K)
- **Action:**
  - [ ] If Datacendia plans to go public: implement material breach assessment in IR policy
  - [ ] For public company customers: their IR policy integration with Datacendia audit logs must support 4-day disclosure
  - [ ] Add "material cybersecurity incident" assessment step to IR policy

### CMMC 2.0 (Cybersecurity Maturity Model Certification)
- **In Force:** Dec 2024 (rulemaking finalised); contract requirements rolling in 2025–2026
- **Scope:** DoD contractors and subcontractors handling Controlled Unclassified Information (CUI) or Federal Contract Information (FCI)
- **Levels:** Level 1 (basic, self-attest), Level 2 (advanced, NIST SP 800-171), Level 3 (expert, NIST SP 800-172)
- **Applicability:** If Datacendia sells to defence contractors or handles defence-related AI deliberations
- **Required for:** Any DoD contract worth pursuing
- **CMMC Level 2 = 110 controls from NIST SP 800-171** — significant but largely overlaps with ISO 27001
- **Action:**
  - [ ] Gap assessment: map ISO 27001 SoA to NIST SP 800-171 (110 controls)
  - [ ] Only pursue if defence customer confirmed — $50K–$200K to achieve Level 2

### FTC Health Breach Notification Rule (Amended 2024)
- **In Force:** Jul 2024 (amended rule)
- **Scope:** Vendors of personal health records (PHR) and related entities — BROADER than HIPAA
- **Covers:** Health apps, fitness trackers, wellness platforms — even if not HIPAA-covered
- **Applicability:** If Datacendia's AI processes any consumer health data outside a HIPAA BAA context
- **Breach notification:** Within 60 days to FTC + affected individuals + media (if >500 affected)
- **Action:**
  - [ ] Add FTC HBNR notification to IR policy (60-day timeline)
  - [ ] Confirm: Washington MHMDA + FTC HBNR apply to any health-adjacent features; PHI de-identification endpoint mitigates

### FISMA (Federal Information Security Management Act)
- **Scope:** US federal agencies and their contractors/service providers
- **Relevance:** If Datacendia provides services to federal agencies (pre-FedRAMP)
- **Key requirement:** Systems must implement NIST SP 800-53 controls; have an Authority to Operate (ATO)
- **Action:** Prerequisite is FedRAMP; already assessed in `docs/legal/fedramp-gap-assessment.md`

### NERC CIP (North American Electric Reliability Corporation — Critical Infrastructure Protection)
- **Scope:** Bulk electric system (utilities, grid operators) in North America
- **Applicability:** If Datacendia AI is used by electric utility companies for operational decisions
- **Key standards:** CIP-002 through CIP-014 — asset identification, access, incident response, supply chain
- **Action:** Low priority until energy sector customer; note in customer onboarding questionnaire

### DFARS (Defense Federal Acquisition Regulation Supplement)
- **Scope:** DoD contractors
- **Key clause:** DFARS 252.204-7012 — safeguarding covered defence information; 72-hour cyber incident report to DoD DCSA
- **Action:** Same as CMMC — only relevant for DoD contracts

---

## US — Financial Sector AI Rules

### OCC AI Guidance (2021 Principles for Climate Risk + AI)
- **Status:** Non-binding guidance for national banks
- **Relevance:** If banking customers use Datacendia AI for credit, model risk, or fraud

### FRB SR 11-7 (Model Risk Management)
- **Status:** Supervisory guidance (not regulation) — but treated as mandatory by examiners
- **Scope:** Banks using models for credit, market risk, operational risk decisions
- **Key requirements:** Model validation; documentation; ongoing monitoring
- **Relevance:** Datacendia AI deliberation outputs used in banking model decisions must meet SR 11-7 standards
- **Action:** Add SR 11-7 model documentation metadata to AI deliberation outputs for banking customers

### CFPB UDAAP + AI (2023 guidance)
- **Status:** Guidance (not regulation) on fair lending + AI
- **Relevance:** AI-based credit/lending decisions must not discriminate; UDAAP violations possible
- **Action:** Colorado SB 205 bias testing + existing `NLPBiasDetectionService` likely sufficient

---

## ADDITIONAL EUROPE

### Germany — BDSG (Bundesdatenschutzgesetz)
- **In Force:** Amended with GDPR; national GDPR implementation
- **Key additions to GDPR:**
  - Art. 26 BDSG: Automated individual decisions — stricter than GDPR Art. 22; must provide human review
  - Works council involvement required for employee monitoring AI
  - Employee data processing requires works council agreement
- **Action:** German enterprise customers using AI for employee decisions need works council disclosure

### France — RGPD Implementation (LIL)
- **CNIL guidance on AI:** CNIL (French DPA) published AI compliance guidelines in 2024
- **Key:** Purpose limitation, data minimisation, transparency requirements — all covered by GDPR compliance
- **Action:** No additional code required; monitor CNIL AI guidance updates

### EU — AI Liability Directive (AIA Directive — Proposed)
- **Status:** Proposal issued Sep 2022; still in legislative process as of April 2026
- **Purpose:** Civil liability rules for AI damage (complements EU AI Act)
- **Relevance:** If Datacendia AI causes damage to a third party, this directive determines liability
- **Action:** Monitor; ensure ToS includes appropriate liability limitation; professional liability insurance review

### EU — Artificial Intelligence Act — Remaining Timelines
| Provision | Date |
|---|---|
| Art. 5 prohibited practices | ✅ Feb 2025 |
| Art. 50 transparency | **Aug 2, 2025** ← imminent |
| Governance + general provisions | Aug 2025 |
| GPAI model obligations (Art. 53–56) | Aug 2025 |
| High-risk AI (Annex III) obligations | Aug 2, 2026 |
| High-risk AI (Annex I — regulated products) | Aug 2, 2027 |

### EU — Data Act (Regulation (EU) 2023/2854)
- **In Force:** Sep 2025
- **Scope:** IoT data sharing, cloud service switching, smart contracts
- **Relevance to Datacendia:**
  - **Art. 23–31 (Cloud switching):** Cloud service providers must enable customer data portability and switching without excessive cost — applies to Datacendia as a cloud service
  - Customers must be able to export all their data and switch to another provider within 30 days
  - Switching fees prohibited after 3-year transition (Sep 2027)
- **Action:**
  - [ ] Ensure existing data export endpoint (`GET /api/v1/privacy/export`) covers ALL customer data (organisations, deliberations, config)
  - [ ] Develop full organisation data export for Data Act Art. 23 compliance by Sep 2025
  - [ ] Add Data Act switching notice to customer agreements

### EU — Payment Services Regulation (PSR, 2024)
- **Status:** Replaces PSD2; adopted 2024
- **Relevance:** Only if Datacendia handles payment data or serves payment institutions
- **Action:** Not currently applicable; monitor if payment features added

---

## ADDITIONAL ASIA-PACIFIC

### Vietnam — PDPD (Personal Data Protection Decree 13/2023/ND-CP)
- **In Force:** July 1, 2023
- **Scope:** Processing personal data of Vietnamese residents
- **Key requirements:**
  - Consent required for all processing (very broad)
  - Cross-border transfers: must notify Ministry of Public Security (MPS) and receive approval
  - DPO appointment mandatory for "large-scale" processors
  - Data breach notification to MPS within 72 hours
  - Data localisation: Certain data must be stored locally (implementing rules pending clarity)
- **Regulator:** Ministry of Public Security — Department A05
- **Action:** Low priority; high compliance cost if Vietnamese customers; cross-border transfer approval is significant barrier

### Philippines — Data Privacy Act 2012 (Republic Act 10173)
- **In Force:** 2012; actively enforced since 2016
- **Scope:** Processing personal information of Philippine nationals
- **GDPR-aligned:** Yes — consent, rights, DPO, breach notification
- **DPO:** Mandatory registration of DPO with National Privacy Commission (NPC)
- **Breach notification:** NPC within 72 hours; affected individuals within 5 days
- **Action:** NPC DPO registration when Philippine customers onboarded

### Taiwan — PDPA (Personal Data Protection Act)
- **Amendments:** Major revision enacted 2023; in force 2023
- **Scope:** Processing personal data of Taiwan residents
- **Penalty:** Up to NT$15M (~USD $470K) for violations; criminal penalties possible
- **Key:** Consent basis; data subject rights; cross-border transfer restrictions (whitelist approach)
- **Action:** Monitor; GDPR framework largely sufficient

### Hong Kong — PDPO (Personal Data (Privacy) Ordinance)
- **In Force:** 1996; amended 2021 (doxxing provisions)
- **Scope:** Processing personal data of Hong Kong residents
- **DPP (Data Protection Principles):** Similar to Australian APPs
- **Key:** Accuracy, retention limits, access/correction rights
- **Action:** GDPR compliance largely covers PDPO requirements

### Malaysia — PDPA 2010
- **In Force:** 2013; review ongoing
- **Scope:** Commercial processing of personal data in Malaysia
- **Key requirements:** Notice, consent, security, retention, data subject rights
- **Regulator:** Personal Data Protection Department (JPDP)
- **Action:** GDPR framework largely covers; monitor modernisation amendments

---

## AFRICA

### Nigeria — Nigeria Data Protection Act 2023 (NDPA)
- **In Force:** Jun 2023
- **Scope:** Processing personal data of Nigeria residents (largest African economy, 220M+ population)
- **GDPR-aligned:** Yes — most comprehensive African privacy law
- **Key requirements:**
  - Lawful basis for processing; consent
  - Data Subject rights: access, correction, deletion, portability, objection
  - DPO mandatory for large-scale/sensitive processing
  - Cross-border transfers: only to countries with adequate protection or contractual mechanisms
  - Breach notification: Nigeria Data Protection Commission (NDPC) within 72 hours
  - Data protection compliance organisation (DPCO) — must use licensed DPCO for compliance
- **Regulator:** Nigeria Data Protection Commission (NDPC) — [https://ndpc.gov.ng](https://ndpc.gov.ng)
- **Action:** Medium priority — significant tech market; appoint DPO (shared with GDPR DPO); register DPCO if needed

### Kenya — Data Protection Act 2019
- **In Force:** Nov 2019
- **Regulator:** Office of the Data Protection Commissioner (ODPC)
- **GDPR-aligned:** Yes — consent, rights, DPO, breach notification (72h)
- **Action:** Low priority; monitor

### Rwanda — Data Protection and Privacy Law 2021
- **In Force:** 2021
- **Regulator:** Rwanda Utilities Regulatory Authority (RURA)
- **Action:** Very low priority

---

## STANDARDS (Not Regulations — But Enterprise Deal Requirements)

### ISO 27017:2015 — Cloud Security Controls
- **Purpose:** Extension of ISO 27001 specifically for cloud services (both providers and customers)
- **Additional controls:** 7 cloud-specific controls covering: cloud service customer/provider relationship, removal of assets, segregation of virtual environments, operations security, monitoring, encryption
- **Why relevant:** Enterprise customers often ask "are you ISO 27017 certified?" alongside ISO 27001
- **Cost:** Relatively low once ISO 27001 is in place — ~30% additional effort
- **Action:** Add ISO 27017 to Phase 2 of ISO 27001 certification roadmap (Q2 2027)

### ISO 27018:2019 — PII in Cloud
- **Purpose:** Code of practice for PII processors in public cloud
- **GDPR alignment:** Explicitly designed to satisfy GDPR processor obligations (Art. 28)
- **Why relevant:** Demonstrates GDPR processor compliance; replaces need for some contractual negotiations
- **Action:** Add ISO 27018 to Phase 2 of ISO 27001 certification roadmap

### ISO 27701:2019 — Privacy Information Management System (PIMS)
- **Purpose:** Extension of ISO 27001 for privacy — creates a PIMS
- **GDPR mapping:** Annex D maps ISO 27701 controls to GDPR articles
- **Why relevant:** The most credible privacy governance standard globally; satisfies "appropriate technical and organisational measures" (GDPR Art. 32)
- **Action:** Target after ISO 27001 certification — add as Phase 3 (2027–2028)

### CSA STAR (Cloud Security Alliance — Security Trust Assurance and Risk)
- **Levels:** Level 1 (self-assessment, free), Level 2 (third-party audit, ~$10K–$30K)
- **Based on:** CSA Cloud Controls Matrix (CCM) v4 — 197 controls
- **Why relevant:** Many enterprise customers require CSA STAR alongside SOC 2
- **Level 1:** Complete CSA STAR self-assessment questionnaire and publish on CSA registry — can do immediately
- **Action:**
  - [ ] Complete CSA CAIQ (Consensus Assessments Initiative Questionnaire) — free, ~8 hours
  - [ ] Submit to CSA STAR registry — free, demonstrates transparency
  - [ ] Level 2 audit: target Q1 2028 alongside ISO 27001 surveillance

### NIST CSF 2.0 (Cybersecurity Framework)
- **Released:** Feb 2024 (updated from v1.1)
- **Key change:** Added "GOVERN" function (making it 6 functions: GOVERN, IDENTIFY, PROTECT, DETECT, RESPOND, RECOVER)
- **Not a regulation** — but widely referenced in enterprise security questionnaires, government contracts, and CISO conversations
- **Datacendia alignment:** Strong — ISO 27001 + NIST AI RMF + current security stack covers most
- **Action:**
  - [ ] Map ISO 27001 SoA to NIST CSF 2.0 (Identify, Protect, Detect, Respond, Recover, Govern) — creates marketing-friendly one-pager for enterprise customers

### CIS Controls v8 (Center for Internet Security)
- **Purpose:** 18 prioritised security controls for cyber hygiene
- **Why relevant:** Often required by enterprise security questionnaires; maps to SOC 2 TSC
- **Top gaps vs current state:**
  - CIS 1: Asset inventory ✅ (information-asset-register.md)
  - CIS 4: Secure configuration of enterprise assets 🟡 (not fully documented)
  - CIS 6: Access control management ✅ (RBAC + MFA)
  - CIS 7: Continuous vulnerability management 🟡 (npm audit only)
  - CIS 11: Data recovery 🟡 (backup policy exists; restore testing needed)
  - CIS 17: Incident response management ✅ (IR policy)
- **Action:** Use CIS Controls as checklist for SOC 2 prep; gaps already visible in SoA

### MITRE ATT&CK Framework
- **Not a regulation** — adversarial tactics and techniques knowledge base
- **Why relevant:** Enterprise security teams ask "do you map your defences to MITRE ATT&CK?"
- **Current implementation:** `AdversarialRedTeamService` already references ATT&CK-style techniques
- **Action:** Map `DefenseInDepth.ts` controls to ATT&CK techniques; creates compelling security story

---

## EMERGING / WATCH LIST (2026–2028)

| Regulation | Jurisdiction | Expected | Risk Level |
|---|---|---|---|
| Canada CPPA (Bill C-27) | Canada federal | 2026–2027 if passed | Medium |
| US Federal Privacy Law | USA | Unlikely before 2028 | Low |
| EU AI Liability Directive | EU | 2026–2027 | Medium |
| Texas AI Act | Texas | 2025–2026 | Medium |
| US ADPPA (American Data Privacy Protection Act) | USA | Stalled; monitor | Low |
| India DPDP implementing rules | India | 2025–2026 | Medium |
| Argentina PDPA modernisation | Argentina | 2026 | Low |
| China AI regulations (additional) | China | Ongoing | High (if China ops) |
| UK Pro-innovation AI Regulation | UK | 2026–2027 | Medium |
| EU CRA delegated acts | EU | 2026 | Medium |
| Singapore AI Governance Framework (binding version) | Singapore | 2026 | Low |
| Brazil AI Bill | Brazil | 2026 | Medium |
| Japan APPI further amendments | Japan | 2025 | Low |
| Australia Privacy Act reform | Australia | 2025–2026 | Medium |
| EU Data Spaces (EHDS, EDIB) | EU | 2025–2026 | Low for now |

---

## Action Priority Supplement

### Implement in Code (Q2–Q3 2026)

| Regulation | Code Action | Effort |
|---|---|---|
| Colorado SB 205 | Appeal mechanism `POST /api/v1/privacy/appeal-ai-decision` + bias attestation | Medium |
| NYC LL 144 | AEDT disclosure metadata in AI deliberation responses for employment use cases | Small |
| EU Data Act Art. 23 | Full organisation data export (all data, not just user data) | Medium |
| NIST CSF 2.0 | Create one-pager mapping ISO controls to CSF functions | Small (doc) |
| CSA STAR | Complete CAIQ questionnaire + submit to CSA registry | Small (doc) |

### Legal Documents Needed (Q3 2026)

| Regulation | Document | Effort |
|---|---|---|
| NYDFS 23 NYCRR 500 | Vendor security addendum for NY financial customers | Small |
| SEC Cybersecurity | Material incident assessment criteria in IR policy | Small |
| GLBA | Service provider agreement addendum | Small |
| SR 11-7 | Model documentation template for banking AI use cases | Medium |
| Colorado SB 205 | Impact assessment template for high-risk AI use cases | Medium |
| NYC LL 144 | Customer-facing AEDT bias audit guidance document | Medium |
