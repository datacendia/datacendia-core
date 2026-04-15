# Global Regulatory Landscape — Comprehensive Survey
**All Jurisdictions Relevant to Datacendia**
**Document Owner:** Legal / Engineering Lead
**Version:** 1.0 | April 2026
**Review Cadence:** Quarterly (regulatory landscape changes rapidly)

---

## Quick Reference — Priority Matrix

| Priority | Regulation | Jurisdiction | Deadline / In Force | Code Required |
|---|---|---|---|---|
| 🔴 **P0 — Blocking** | GDPR | EU/EEA | In force | ✅ Done |
| 🔴 **P0 — Blocking** | HIPAA | USA (healthcare) | In force | ✅ Done |
| 🔴 **P0 — Now** | Subprocessor DPAs | Global | Before EU/HC customers | Sign manually |
| 🔴 **P0 — Aug 2025** | EU AI Act Art. 50/5 | EU | 2 Aug 2025 | ✅ Done |
| 🟠 **P1 — Q2 2026** | UK GDPR + ICO | UK | In force | ICO registration |
| 🟠 **P1 — Q2 2026** | CCPA/CPRA | California | In force | ✅ Done + GPC pending |
| 🟠 **P1 — Q2 2026** | NIS2 Directive | EU | Oct 2024 | Assessment needed |
| 🟡 **P2 — Q3 2026** | Quebec Law 25 | Canada | In force | Privacy notice + consent |
| 🟡 **P2 — Q3 2026** | SOC 2 Type II | USA (enterprise) | Nov 2026 start | Evidence collection |
| 🟡 **P2 — Q3 2026** | ISO 27001 cert | Global | Q4 2026 target | ✅ Docs done |
| 🟡 **P2 — 2026** | India DPDP Act | India | 2025–2026 rules | Monitor |
| 🟡 **P2 — 2026** | DORA | EU (financial) | Jan 2025 | Assessment |
| 🟢 **P3 — Monitor** | China PIPL | China | In force | Only if China ops |
| 🟢 **P3 — Monitor** | FedRAMP | USA (federal) | On opportunity | ✅ Assessment done |

---

## EUROPE

### EU — NIS2 Directive (Network and Information Security)
- **Full name:** Directive (EU) 2022/2555
- **In force:** Member states had until Oct 2024 to transpose into national law
- **Applicability:** Datacendia is potentially an **ICT service provider** to entities in scope (essential/important entities)
- **Scope triggers:**
  - If Datacendia customers are critical infrastructure operators (energy, health, transport, finance, digital infrastructure)
  - If Datacendia itself is classified as "managed service provider" (MSP) — likely **YES** under Annex I/II
- **Key obligations:**
  - Cybersecurity risk management measures (Article 21) — ISO 27001 largely satisfies
  - Incident reporting to national CSIRT within **24 hours** (early warning) and **72 hours** (incident notification)
  - Supply chain security — vendor security assessments
  - Business continuity — already have BCP
- **Gap:** NIS2 incident reporting to EU national CSIRTs is not in current IR policy
- **Action:**
  - Add ENISA/national CSIRT contacts to IR policy
  - Determine if any customers are NIS2-essential entities (energy, health, banking, digital infra)
  - Consider self-registration as DSP (Digital Service Provider) in primary EU member state
- **Priority:** 🟠 P1 — if any EU enterprise customers in critical sectors

### EU — DORA (Digital Operational Resilience Act)
- **Full name:** Regulation (EU) 2022/2554
- **In force:** 17 January 2025
- **Applicability:** Applies to **financial entities** and **critical ICT third-party service providers (CTPPs)**
- **Datacendia applicability:**
  - If Datacendia's AI deliberation platform is used by EU financial institutions (banks, insurers, investment firms) — YES as ICT third-party service provider
  - CTPP designation (>60% EU financial entities using the same provider) — unlikely at current scale
- **Key obligations as ICT third-party provider:**
  - DORA-compliant contractual terms in agreements with financial institution customers
  - Provide audit rights, sub-outsourcing information, BCP/DR documentation
  - Register with relevant EU supervisory authority if designated CTPP
  - Incident reporting aligned with financial sector requirements
- **DORA-compliant contract addendum required** for any EU financial institution customer
- **Action:** Draft DORA contractual addendum template; add to customer onboarding for EU financial sector
- **Priority:** 🟡 P2 — when first EU financial institution customer signed

### EU — ePrivacy Regulation (Pending)
- **Status:** Draft only — no final text as of April 2026; original directive (2002/58/EC) still in force
- **Relevance:** Cookie consent, electronic communications metadata
- **Datacendia:** SaaS B2B platform — cookies only for session management; minimal ePrivacy exposure
- **Action:** Monitor; ensure session cookies have `SameSite=Strict; Secure; HttpOnly` (already implemented)

### EU — Cyber Resilience Act (CRA)
- **Full name:** Regulation (EU) 2024/2847
- **In force:** Entered into force Dec 2024; most requirements apply Aug 2027
- **Applicability:** Products with digital elements — hardware and software products placed on EU market
- **Datacendia applicability:**
  - If Datacendia software is distributed/sold to EU customers as a product — possibly YES
  - SaaS is currently **debated** — CRA may apply to cloud services; awaiting delegated acts
- **Key obligations (if applicable):**
  - Cybersecurity by design and default (Article 13)
  - Vulnerability handling and disclosure
  - Software Bill of Materials (SBOM) — already have `crucible_sbom`
  - Security updates for 5 years
- **Action:** Monitor EU Commission implementing acts; engage EU counsel when customer contracts executed

---

## UNITED KINGDOM

### UK — Product Security and Telecommunications Infrastructure Act 2022 (PSTI)
- **In force:** Apr 2024
- **Scope:** Connected consumer products — IoT devices
- **Datacendia:** Cloud SaaS, not consumer IoT — **not applicable**

### UK — AI Regulation (Pro-innovation approach)
- **Status:** No dedicated AI Act; sector regulators apply existing rules
- **Approach:** FCA, CMA, ICO, Ofcom each publish AI guidance for their sectors
- **For Datacendia:** ICO AI guidance for data protection; FCA AI guidance if financial customers
- **Action:** Monitor ICO AI guidance; read FCA AI and Machine Learning Discussion Paper if fintech customers exist

### UK — Cyber Essentials / Cyber Essentials Plus
- **Not legislation** — government-backed certification scheme
- **Required for:** UK government contracts; some enterprise customers require it
- **Cost:** CE ~£300; CE+ ~£2K–£5K
- **Datacendia:** Good-to-have for UK government/enterprise sales; achievable within 3 months
- **Controls covered:** Boundary firewalls, secure configuration, user access control, malware protection, patch management
- **Action:** Consider Cyber Essentials Plus certification Q3 2026 if pursuing UK public sector

---

## CANADA

### Canada — Quebec Law 25 (Act 25 / Law 25)
- **Full name:** An Act to modernize legislative provisions as regards the protection of personal information
- **In force:** Phased: Sep 2022 (privacy incident reporting), Sep 2023 (most provisions), Sep 2023 (AI transparency)
- **Applicability:** Any organisation collecting personal information of **Quebec residents**
- **Key requirements unique to Law 25:**

| Requirement | Description | Datacendia Status | Action |
|---|---|---|---|
| Privacy Impact Assessment (PIA) | Required before any new collection project, use of technology, or outsourcing personal info outside Quebec | 📋 Not done | Complete PIA template |
| Communication outside Quebec | Must conduct PIA before communicating PI outside Quebec; must ensure equivalent protection | 🟡 Covered by DPAs | Document PIA per vendor |
| Right to data portability | Users can request PI in structured format — similar to GDPR | ✅ `/api/v1/privacy/export` | N/A |
| Right to de-indexing | Quebec-specific right to have personal info "de-indexed" from search | 📋 Not addressed | Add to erasure endpoint note |
| Profiling disclosure | Must disclose when making automated decisions using personal info | 🟡 Partial — AI transparency header added | Add explicit profiling disclosure |
| Privacy Officer | Must designate and publish Privacy Officer | 🔴 Not done | Use DPO appointment letter |
| Privacy policy in plain language | Privacy policy accessible and understandable | 🟡 API endpoint exists; no public page | Create public privacy page |
| CAI registration | Notify Commission d'accès à l'information (CAI) of personal info communication outside Quebec | 📋 Pending | Notify CAI when DPAs signed |

- **Regulator:** Commission d'accès à l'information (CAI) — [https://www.cai.gouv.qc.ca](https://www.cai.gouv.qc.ca)
- **Priority:** 🟡 P2 — if any Quebec-based customers

### Canada — Bill C-27 / CPPA (Consumer Privacy Protection Act)
- **Status:** As of April 2026, Bill C-27 is still before Parliament — NOT yet law
- **Expected:** 2026–2027 if passed — would replace PIPEDA federally
- **Key additions vs. PIPEDA:**
  - GDPR-style rights framework
  - Mandatory breach notification (already in IR policy)
  - AI and automated decision-making transparency requirements
  - Fines up to 5% of global revenue or C$25M
- **Action:** Monitor; existing GDPR infrastructure will largely satisfy CPPA when enacted

---

## LATIN AMERICA

### Mexico — LFPDPPP
- **Full name:** Ley Federal de Protección de Datos Personales en Posesión de los Particulares
- **In force:** Jul 2010 (mature law; amendments ongoing)
- **Applicability:** Processing personal data of Mexican residents
- **Key requirements:**
  - Privacy notice (Aviso de Privacidad) — required before collection
  - Consent for processing (ARCO rights: Access, Rectification, Cancellation, Opposition)
  - Data localisation: No specific restriction, but transfers require adequate protection
  - Regulator: INAI (Instituto Nacional de Transparencia, Acceso a la Información y Protección de Datos Personales)
- **Datacendia status:** 🟡 GDPR-based rights cover ARCO; Spanish-language privacy notice needed
- **Action:** Translate privacy policy to Spanish; add INAI contact to breach notification list

### Argentina — PDPA (Law 25.326)
- **Status:** Law 25.326 (2000) — modernisation bill pending (aligned to GDPR)
- **Applicability:** Processing personal data of Argentine residents
- **Key gap vs. GDPR:** Cross-border transfer restrictions (data must stay in Argentina or go to "adequate" countries)
- **Adequate countries list:** Argentina is an EU-adequate country; US is NOT adequate
- **Action:** For Argentine customers, ensure data residency options or contractual SCC equivalent
- **Regulator:** AAIP (Agencia de Acceso a la Información Pública) — [https://www.argentina.gob.ar/aaip](https://www.argentina.gob.ar/aaip)

### Brazil — LGPD *(Already assessed — see `docs/legal/international-privacy-gap-assessment.md`)*

### Colombia — Habeas Data / Law 1581 + Decree 1377
- **In force:** 2012
- **Applicability:** Processing personal data of Colombian residents
- **Key requirements:** Privacy notice; consent; access/correction/deletion rights; data transfer restrictions
- **Regulator:** SIC (Superintendencia de Industria y Comercio)
- **Status:** 🟢 GDPR rights cover core requirements; Spanish privacy notice needed

### Chile — PDPA (in reform)
- **Status:** New comprehensive privacy law enacted 2024 (Law 21.719) — transitional period through 2026
- **Key requirements:** GDPR-aligned; consent; data subject rights; DPO for large-scale processing; breach notification 72h to CPLT
- **Regulator:** CPLT (Consejo para la Transparencia) gains privacy enforcement power
- **Action:** Monitor implementation regulations; existing GDPR framework largely sufficient

### Peru — Law 29733
- **In force:** 2013
- **Basic requirements:** Consent; security; data subject rights; registration of data banks with ANPD Peru
- **Status:** 🟢 Low complexity; GDPR framework covers requirements

---

## ASIA-PACIFIC

### China — PIPL (Personal Information Protection Law)
- **In force:** Nov 2021
- **Applicability:** Processing personal information of individuals within China; cross-border transfers of China PI
- **Severity:** Most restrictive major privacy law globally
- **Key requirements:**

| Requirement | Description | Compliance Difficulty |
|---|---|---|
| Legal basis | Consent (purpose-specific, withdrawable) OR contract, legal obligation, vital interests, public interest | High — must map each processing activity |
| Separate consent | Processing sensitive PI requires separate explicit consent | High |
| Data localisation | Critical information infrastructure operators must store PI in China | N/A unless CIIO |
| Cross-border transfer | Must pass: Standard Contract (SCC equivalent), certification by CAC-approved body, OR security assessment | **Very High** |
| CAC security assessment | Required if: processed >1M individuals OR cumulatively transferred 100K individuals outside China | High |
| DPO equivalent | Must designate Personal Information Protection Officer | Required |
| Regulator | CAC (Cyberspace Administration of China) | Active enforcement; multi-million RMB fines |

- **Action for Datacendia:** Do NOT onboard Chinese customers or process China-origin PI without engaging China-specialist legal counsel. The compliance cost is very high and the legal landscape is evolving rapidly.
- **Priority:** 🟢 P3 — only when China market entry is confirmed

### China — DSL (Data Security Law)
- **In force:** Sep 2021
- **Scope:** All data (not just personal information); data classified by importance to national security
- **Relevance:** AI deliberation data about Chinese entities may be classified as "important data"
- **Action:** Same as PIPL — China-specialist counsel required before any China operations

### China — MLPS 2.0 (Multi-Level Protection Scheme)
- **Scope:** Cybersecurity compliance for systems operating in China
- **Relevance:** Any Datacendia infrastructure deployed in China must be assessed and certified under MLPS
- **Action:** Only relevant if China-hosted deployment; Railway-based SaaS is out of scope

### Japan — APPI (Act on Protection of Personal Information)
- **Amendments:** Major reforms in 2022 (in force Apr 2022); further amendments expected
- **Applicability:** Processing personal information of Japanese residents
- **Key requirements:**
  - Consent for third-party sharing and cross-border transfers
  - Appointment of Personal Information Protection Manager
  - Breach notification to PPC (Personal Information Protection Commission) within 3–5 days
  - Pseudonymously processed information provisions
  - PPC registration for certain handlers
- **Cross-border transfer:** Japan is EU-adequate (mutual adequacy); transfers between Japan and EU are straightforward
- **Datacendia status:** 🟡 GDPR framework largely sufficient; Japanese-language privacy notice needed for JP customers; PPC breach notification timeline is 3–5 days (faster than GDPR's 72h)
- **Action:** Add PPC to breach notification contacts; Japanese privacy notice translation

### South Korea — PIPA (Personal Information Protection Act)
- **Status:** Heavily amended 2023 (effective Sep 2023) — now GDPR-equivalent
- **Applicability:** Processing personal information of Korean residents
- **Key requirements:**
  - GDPR-equivalent rights (access, correction, deletion, portability, objection)
  - Appointment of Chief Privacy Officer (CPO) if >5 employees
  - Breach notification to PIPC within 72 hours (same as GDPR)
  - Cross-border transfer: consent OR contract with adequate protection
  - Local representative in Korea if processing Korean resident data without a Korean establishment
- **Regulator:** PIPC (Personal Information Protection Commission) — [https://www.pipc.go.kr](https://www.pipc.go.kr)
- **Action:** If Korean customers: appoint local representative; Korean CPO; translate privacy notice

### India — DPDP Act 2023 (Digital Personal Data Protection Act)
- **Enacted:** Aug 2023 (passed Parliament)
- **Implementation rules:** Still being drafted by MEITY as of April 2026 — law not yet fully enforceable
- **Applicability:** Processing digital personal data of Indian residents; cross-border if offering services to India
- **Key requirements:**
  - Consent-based processing (verifiable, specific consent)
  - Data Fiduciary obligations (controller equivalent)
  - Data Principal rights: access, correction, erasure, grievance redressal
  - Significant Data Fiduciaries (SDFs): higher obligations (DPO, data audit, DPIA)
  - Cross-border transfers: only to countries approved by Central Government (list pending)
  - No general prohibition on cross-border transfer (unlike China) — pending approved country list
  - Breach notification to Data Protection Board within 72 hours
- **Regulator:** Data Protection Board of India (yet to be constituted)
- **Action:** Monitor rules; existing GDPR DSR endpoints satisfy core rights; watch approved country list for US
- **Priority:** 🟡 P2 — significant Indian tech sector customer base likely

### Singapore — PDPA (Personal Data Protection Act)
- **Amendments:** 2021 amendments significantly strengthened enforcement
- **Applicability:** Processing personal data of Singapore residents
- **Key requirements:**
  - Consent / legitimate interest / contractual necessity
  - Data Protection Officer appointment (if >250 employees — Datacendia likely exempt but best practice)
  - Mandatory breach notification to PDPC within 3 days if >500 affected OR likely significant harm
  - Cross-border transfers: require adequate protection or binding corporate rules
  - Do Not Call registry compliance (for marketing — not relevant for B2B)
- **Regulator:** PDPC (Personal Data Protection Commission) — [https://www.pdpc.gov.sg](https://www.pdpc.gov.sg)
- **Status:** 🟡 GDPR framework largely sufficient; 3-day breach notification is faster than 72h — add to IR policy

### Thailand — PDPA (Personal Data Protection Act)
- **In force:** Jun 2022 (fully in force)
- **Applicability:** Processing personal data of Thailand residents
- **Key requirements:** GDPR-equivalent; consent basis; DPO for certain controllers; cross-border adequacy
- **Action:** Monitor; GDPR framework largely sufficient

### Indonesia — PDPA (Law No. 27 of 2022)
- **In force:** 2022; implementing regulations pending
- **GDPR-aligned:** Yes — similar rights framework
- **Action:** Monitor; low priority until Indonesian customers

### Australia *(assessed in international-privacy-gap-assessment.md)*

### New Zealand — Privacy Act 2020
- **In force:** Dec 2020 (replacing 1993 Act)
- **Key changes from 1993:** Mandatory breach notification (72h to OPC); new privacy principles; data localisation considerations for sensitive data
- **Regulator:** Office of the Privacy Commissioner (OPC NZ) — [https://www.privacy.org.nz](https://www.privacy.org.nz)
- **Status:** 🟢 GDPR framework largely sufficient; add OPC NZ to breach notification list

---

## MIDDLE EAST & AFRICA

### UAE — PDPL (Personal Data Protection Law — DIFC and ADGM)
- **DIFC PDPL:** In force 2020; GDPR-equivalent for Dubai International Financial Centre
- **ADGM:** Abu Dhabi Global Market — similar framework
- **Federal UAE:** Federal Decree-Law No. 45/2021 — covers mainland UAE
- **Relevance:** If UAE financial or government customers — possible given AI governance focus
- **Status:** 🟢 GDPR framework largely sufficient for DIFC/ADGM; monitor federal implementation

### Saudi Arabia — PDPL (Personal Data Protection Law)
- **In force:** Sep 2023 (enforced Sep 2024)
- **GDPR-aligned:** Yes — consent, data subject rights, DPO, breach notification
- **Cross-border:** Requires NDMO approval for transfers outside KSA — complex
- **Status:** 🟢 Low priority; high complexity if Saudi customer requires local data residency

### South Africa — POPIA (Protection of Personal Information Act)
- **In force:** Jul 2021 (enforcement began Jul 2021)
- **GDPR-aligned:** Yes — eight conditions for lawful processing, responsible party obligations
- **Regulator:** Information Regulator — [https://www.justice.gov.za/inforeg/](https://www.justice.gov.za/inforeg/)
- **Status:** 🟢 GDPR framework largely sufficient; add Information Regulator to breach contacts if SA customers

---

## Sectoral Regulations (US + Global)

### FERPA (Family Educational Rights and Privacy Act — US)
- **Scope:** Educational institutions receiving federal funding; student education records
- **Applicability:** If Datacendia AI is used by US educational institutions for student decisions
- **Key risk:** Using AI deliberation on student data without FERPA compliance
- **Action:** Add FERPA to AI prohibited use cases if platform is used for student academic decisions; BAA-equivalent (agreement with school official) required

### GLBA (Gramm-Leach-Bliley Act — US)
- **Scope:** Financial institutions (banks, insurance, securities firms)
- **Relevance:** US financial institution customers are subject to GLBA Safeguards Rule
- **Datacendia obligation:** As service provider to GLBA-covered institutions, must: (1) have written security program; (2) agree to safeguard customer NPI; (3) be subject to oversight
- **Action:** Draft GLBA service provider addendum for US financial institution customers; ISO 27001 satisfies Safeguards Rule requirements

### COPPA (Children's Online Privacy Protection Act — US)
- **Scope:** Online collection of personal information from children under 13
- **Datacendia:** B2B platform — children should not be platform users
- **Action:** Add age verification / terms prohibition on under-18 use; already in ToS presumably

### SOX (Sarbanes-Oxley — US)
- **Relevance:** If Datacendia is used by public US companies for financial reporting AI decisions
- **AI obligation:** Datacendia AI used in financial reporting workflows must have audit trails (already have comprehensive audit logging)
- **Action:** AI deliberation outputs used in financial reporting contexts should be flagged with SOX audit metadata

### ITAR/EAR (Export Controls — US)
- **Relevance:** AI models, dual-use technology, defence sector customers
- **ITAR:** Controls defence articles and services on US Munitions List
- **EAR:** Controls commercial items with potential military applications (including some AI technology)
- **Risk:** If Datacendia AI deliberation is used for defence procurement decisions with classified or controlled info
- **Action:** Add ITAR/EAR review requirement for defence sector customers; confirm no Export Control Classification Number (ECCN) applies to Datacendia software

---

## Master Action Plan — All Regulations

### Immediate (Q2 2026)
| Action | Regulations | Owner |
|---|---|---|
| Sign 5 subprocessor DPAs | GDPR, HIPAA, all | Legal |
| Register with UK ICO | UK GDPR | Legal |
| Appoint and publish DPO | GDPR, LGPD, PIPEDA, Law 25, PDPA | CEO |
| GPC header opt-out middleware | CA, CO, CT, TX, OR | Engineering |
| Profiling opt-out endpoint | TX, VA, CO, CT, OR | Engineering |

### Q3 2026
| Action | Regulations | Owner |
|---|---|---|
| NIS2 CSIRT contacts in IR policy | EU NIS2 | Legal + Engineering |
| Quebec Law 25 PIA template | Quebec Law 25 | Legal |
| DORA contractual addendum template | EU DORA | Legal |
| Spanish-language privacy notice | Mexico LFPDPPP, Colombia, Chile | Legal |
| UK Cyber Essentials Plus certification | UK enterprise/gov | Engineering |
| CPRA sensitive PI limit-use endpoint | California CPRA | Engineering |
| Washington MHMDA health consent | WA MHMDA | Engineering |
| Add PPC, PDPC, OPC NZ to IR policy | Japan, Singapore, NZ | Legal |

### Q4 2026
| Action | Regulations | Owner |
|---|---|---|
| SOC 2 observation period start (Nov 1) | SOC 2 Type II | All |
| ISO 27001 Stage 1 audit | ISO 27001 | Engineering |
| India DPDP Act rules — review and implement | India DPDP | Legal |
| GLBA service provider addendum | US GLBA | Legal |
| FERPA restriction on student data AI use | FERPA | Legal + Engineering |

### 2027+
| Action | Regulations | Owner |
|---|---|---|
| SOC 2 Type II report issued | SOC 2 | External auditor |
| ISO 27001 Stage 2 audit + certification | ISO 27001 | Certification body |
| Canada CPPA — implement when enacted | Canada CPPA | Legal |
| Chile new PDPA — implement | Chile Law 21.719 | Legal |
| China PIPL — only on China market entry | China PIPL/DSL | China-specialist counsel |
| FedRAMP Ready — only on federal opportunity | FedRAMP | Engineering + consultant |
| Saudi PDPL / UAE PDPL — on MENA customer | PDPL | Legal |
