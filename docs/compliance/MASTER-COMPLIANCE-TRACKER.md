# MASTER COMPLIANCE TRACKER
**Single source of truth — all frameworks, all jurisdictions**
**Last Updated:** April 15, 2026 | **Owner:** CEO + Engineering Lead + Legal
**Update after every compliance sprint, regulatory change, or audit finding**

---

## Legend
- ✅ **Done** — Control/document fully implemented
- 🟡 **Partial** — In progress or partially implemented
- 🔴 **Gap** — Not yet started; blocking risk
- 📋 **Planned** — Scheduled with target date
- ❌ **Excluded** — Out of scope with justification
- 🔒 **External** — Action required by Legal/CEO, not Engineering

---

## SECTION 1 — PRIVACY (Data Subject Rights)

| Framework | Right / Obligation | Endpoint / Document | Status | Owner | Target |
|---|---|---|---|---|---|
| GDPR Art. 15 | Right of Access | `GET /api/v1/privacy/access` | ✅ | Engineering | Done |
| GDPR Art. 16 | Right to Rectification | `PATCH /api/v1/privacy/rectify` | ✅ | Engineering | Done |
| GDPR Art. 17 | Right to Erasure | `DELETE /api/v1/privacy/erasure` | ✅ | Engineering | Done |
| GDPR Art. 18 | Right to Restriction | `POST /api/v1/privacy/restrict` | ✅ | Engineering | Done |
| GDPR Art. 20 | Right to Portability | `GET /api/v1/privacy/export` | ✅ | Engineering | Done |
| GDPR Art. 28 | DPA with subprocessors | `docs/legal/subprocessor-dpa-checklist.md` | 🔴 | Legal | **May 2026** |
| GDPR Art. 37 | DPO Appointment | `docs/legal/dpo-appointment-letter.md` | 🔴 | CEO | **May 2026** |
| GDPR Art. 30 | ROPA | `docs/legal/ropa-record-of-processing-activities.md` | ✅ | Engineering | Done |
| GDPR Art. 35 | DPIA | `docs/legal/dpia-template.md` | ✅ | Engineering | Done |
| GDPR Art. 13/14 | Privacy Notice | `GET /api/v1/privacy/policy` | 🟡 | Legal | Q2 2026 (publish page) |
| UK GDPR | ICO Registration | `docs/legal/ico-registration-guide.md` | 🔴 | Legal | **May 2026** |
| UK GDPR | UK IDTA (transfer mechanism) | With each DPA | 🔴 | Legal | **May 2026** |
| CCPA §1798.100 | Right to Know | `GET /api/v1/privacy/access` | ✅ | Engineering | Done |
| CCPA §1798.105 | Right to Delete | `DELETE /api/v1/privacy/erasure` | ✅ | Engineering | Done |
| CCPA §1798.120 | Do Not Sell/Share | `POST /api/v1/privacy/ccpa/opt-out` | ✅ | Engineering | Done |
| CCPA §1798.135(b) | Global Privacy Control | GPC middleware in `index.ts` | ✅ | Engineering | Done |
| CPRA §1798.121 | Limit Sensitive PI Use | `POST /api/v1/privacy/ccpa/limit-sensitive` | ✅ | Engineering | Done |
| TX/VA/CO CDPA | Profiling Opt-Out | `POST /api/v1/privacy/opt-out-profiling` | ✅ | Engineering | Done |
| WA MHMDA | Health Data Consent | `POST /api/v1/privacy/wa-mhmda-consent` | ✅ | Engineering | Done |
| Quebec Law 25 | Privacy Officer Publication | DPO appointment + website | 🔴 | CEO | **May 2026** |
| Quebec Law 25 | Privacy Impact Assessment | `docs/legal/quebec-pia-template.md` | ✅ | Engineering | Done |
| LGPD Art. 41 | Encarregado (DPO) | `docs/legal/dpo-appointment-letter.md` | 🔴 | CEO | **May 2026** |
| PIPEDA | Privacy Officer | `docs/legal/dpo-appointment-letter.md` | 🔴 | CEO | **May 2026** |
| India DPDP | Data Fiduciary obligations | Monitor rules | 📋 | Legal | 2026 |
| Japan APPI | PPC breach notification (3 days) | IR policy v2.0 — §7 regulatory contacts | ✅ | Engineering | Done |
| Singapore PDPA | PDPC breach notification (3 days) | IR policy v2.0 — §7 regulatory contacts | ✅ | Engineering | Done |
| Mexico LFPDPPP | Spanish Aviso de Privacidad | Translation needed | 📋 | Legal | Q3 2026 |

---

## SECTION 2 — AI REGULATION

| Framework | Obligation | Implementation | Status | Owner | Deadline |
|---|---|---|---|---|---|
| EU AI Act Art. 5 | Prohibited practices | `NeMoGuardrailsEngine` guardrail | ✅ | Engineering | Done |
| EU AI Act Art. 50(1) | Disclose AI to users | UI labels + response header | ✅ | Engineering | Done |
| EU AI Act Art. 50(2) | `X-AI-Generated` header | `aiTransparencyMiddleware` in index.ts | ✅ | Engineering | Done |
| EU AI Act Art. 9 | AI Risk Management | `docs/iso42001/ai-policy.md` | ✅ | Engineering | Done |
| EU AI Act Art. 53 | GPAI model verification | `docs/legal/eu-ai-act-gpai-compliance.md` | 🟡 | Legal | **Aug 2025** |
| EU AI Act Art. 6 | Annex III high-risk classification | `AIRegulatoryClassifier.ts` auto-classifies | ✅ | Engineering | Done |
| EU Data Act Art. 23 | Cloud switching / org export | `GET /api/v1/privacy/org-export` (full) | ✅ | Engineering | Done |
| EU AI Liability Directive | Liability limitation clauses; evidence preservation | `docs/compliance/eu-data-act-ai-liability.md` | 🟡 | Legal | Q2 2026 |
| NIST AI RMF | GOVERN/MAP/MEASURE/MANAGE (68% aligned) | `docs/nist-ai-rmf/ai-rmf-profile.md` | 🟡 | Engineering | Q3 2026 |
| NIST CSF 2.0 | 87-control GOVERN/ID/PR/DE/RS/RC mapping | `docs/compliance/nist-csf2-mapping.md` | ✅ | Engineering | Done |
| ISO 42001 | AI Policy | `docs/iso42001/ai-policy.md` | ✅ | Engineering | Done |
| ISO 42001 | AI Impact Assessment endpoint | `POST /api/v1/privacy/ai-impact-assessment` | ✅ | Engineering | Done |
| ISO 42001 | AI Incident Registry | In `ai-policy.md` | ✅ | Engineering | Done |
| Colorado AI Act SB 205 | Consequential decision appeal | `POST /api/v1/privacy/appeal-ai-decision` | ✅ | Engineering | Done |
| Colorado AI Act SB 205 | Annual impact assessment | `POST /api/v1/privacy/ai-impact-assessment` | ✅ | Engineering | Done |
| Colorado AI Act SB 205 | Auto-classification middleware | `AIRegulatoryClassifier.ts` + `aiRegulatoryMiddleware.ts` | ✅ | Engineering | Done |
| NYC Local Law 144 | AEDT disclosure notice | `GET /api/v1/privacy/aedt-disclosure` | ✅ | Engineering | Done |
| NYC Local Law 144 | Bias audit warning in AEDT detection | `aiRegulatoryMiddleware.ts` + classifier | ✅ | Engineering | Done |
| Illinois AI Video Interview Act | Consent gate (hard block) | `aiRegulatoryMiddleware.ts` | ✅ | Engineering | Done |
| Germany BDSG §26 | Works council AI disclosure template | `docs/compliance/germany-bdsg-france-cnil.md` | ✅ | Legal | Done |
| France CNIL AI guidance | No-training-on-customer-data clause | `docs/compliance/germany-bdsg-france-cnil.md` | 🔴 | Legal | Q2 2026 |
| MITRE ATT&CK v15 | 79% tactic coverage; ATLAS AI threats | `docs/compliance/mitre-attack-mapping.md` | ✅ | Engineering | Done |
| CSA STAR Level 1 | CAIQ self-assessment (ready to submit) | `docs/compliance/csa-star-caiq.md` | 🔴 | CEO | **Submit — May 2026** |
| CIS Controls v8 | IG1 + IG2 full mapping; 57% compliant | `docs/compliance/cis-controls-v8.md` | ✅ | Engineering | Done |
| ISO 27017/27018 | Cloud security controls mapping | `docs/iso27017/cloud-security-controls.md` | 🟡 | Engineering | Q2 2027 (cert) |

---

## SECTION 3 — HIPAA

| Obligation | Implementation | Status | Owner | Target |
|---|---|---|---|---|
| HIPAA BAA template | `docs/legal/hipaa-baa-template.md` | ✅ | Legal | Done |
| HIPAA BAA signed with customers | Per customer | 🔴 | Legal | Before healthcare customer live |
| PHI de-identification (Safe Harbor) | `POST /api/v1/privacy/deidentify` | ✅ | Engineering | Done |
| PHI before AI enforcement | `phiEnforcementMiddleware.ts` — all AI routes | ✅ | Engineering | Done |
| HIPAA audit controls | `audit_logs` + 7-year retention | ✅ | Engineering | Done |
| HIPAA BAA with Neon | Neon security@neon.tech | 🔴 | Legal | **May 2026** |
| HIPAA BAA with OpenAI | OpenAI enterprise | 🔴 | Legal | **May 2026** |

---

## SECTION 4 — ISO 27001:2022

| Document | Status | Owner | Target |
|---|---|---|---|
| ISMS Scope | ✅ `docs/iso27001/isms-scope.md` | Engineering | Done |
| Information Asset Register | ✅ `docs/iso27001/information-asset-register.md` | Engineering | Done |
| Statement of Applicability | ✅ `docs/iso27001/statement-of-applicability.md` | Engineering | Done |
| Risk Register | ✅ `docs/iso27001/risk-register.md` | Engineering | Done |
| Supplier Security Questionnaire | ✅ `docs/iso27001/supplier-security-questionnaire.md` | Engineering | Done |
| Management sign-off on all docs | 🔴 | CEO | May 2026 |
| Employee security training | � `docs/iso27001/employee-security-training-record.md` | Engineering Lead | Sep 2026 |
| Annual Internal Audit | 📋 | External auditor | Q4 2026 |
| Management Review minutes | ✅ `docs/iso27001/management-review-template.md` | CEO + Eng Lead | Oct 2026 |
| Stage 1 Audit | 📋 | Certification body | Q4 2026 |
| Stage 2 Audit / Certificate | 📋 | Certification body | Q1 2027 |

---

## SECTION 5 — SOC 2 TYPE II

| Milestone | Status | Owner | Target |
|---|---|---|---|
| Select auditor firm | 📋 | CEO | Sep 2026 |
| Pre-assessment / readiness review | 📋 | Auditor | Oct 2026 |
| Observation period start | 📋 | All | **Nov 1, 2026** |
| Monthly evidence collection ×6 | 📋 | Engineering | Nov 2026–Apr 2027 |
| Quarterly access review ×2 | 📋 | Engineering | Jan + Apr 2027 |
| Backup restore test ×2 | 📋 | Engineering | Jan + Mar 2027 |
| Management review ×2 in period | 📋 | CEO | Jan + Apr 2027 |
| Vendor SOC 2 reports obtained | 🔴 | Legal | May 2026 |
| Auditor fieldwork | 📋 | Auditor | May 2027 |
| SOC 2 Type II report issued | 📋 | Auditor | Jul 2027 |

---

## SECTION 5B — US SECTORAL REGULATIONS

| Regulation | Obligation | Implementation | Status | Owner | Target |
|---|---|---|---|---|---|
| NY DFS 23 NYCRR 500 | TPSP vendor addendum template | `docs/compliance/nydfs-sec-compliance.md` | ✅ | Legal | Done |
| NY DFS 23 NYCRR 500 | 72h incident notification (NYDFS) | `IncidentMaterialityService.ts` + IR policy | ✅ | Engineering | Done |
| NY DFS 23 NYCRR 500 | security.txt + vulnerability disclosure | `public/.well-known/security.txt` | ✅ | Engineering | Done |
| NY DFS 23 NYCRR 500 | Annual phishing simulation | Programme planned | 📋 | Engineering | Q3 2026 |
| SEC Cybersecurity Disclosure | Materiality assessment service | `IncidentMaterialityService.ts` | ✅ | Engineering | Done |
| SEC Cybersecurity Disclosure | 10-K Item 106 template for customers | `docs/compliance/nydfs-sec-compliance.md` | ✅ | Legal | Done |
| CMMC 2.0 | Gap assessment (72% compliant, 110 controls) | `docs/compliance/cmcc-ftc-hbnr.md` | ✅ | Engineering | Done |
| CMMC 2.0 | Level 1 self-assessment (17 controls) | On DoD opportunity | 📋 | Engineering | On opportunity |
| FTC Health Breach Notification Rule 2024 | FTC HBNR notification in IR policy | `docs/compliance/cmcc-ftc-hbnr.md` | ✅ | Legal | Done |
| FTC HBNR 2024 | PHI before AI enforcement (runtime check) | `phiEnforcementMiddleware.ts` applied to all AI routes | ✅ | Engineering | Done |

---

## SECTION 6 — EU SECTORAL (NIS2 / DORA / CRA)

| Regulation | Obligation | Status | Owner | Target |
|---|---|---|---|---|
| NIS2 | CSIRT incident notification process | 🔴 | Legal | Q3 2026 |
| NIS2 | Supply chain security (DPAs + questionnaire) | 🟡 | Legal | Q2 2026 |
| NIS2 | Self-assessment: MSP classification | 📋 | Legal | Q3 2026 |
| DORA | DORA contractual addendum for EU financial customers | 📋 | Legal | On first EU financial customer |
| DORA | ICT incident reporting aligned with DORA | 📋 | Legal | On first EU financial customer |
| CRA | Software product applicability assessment | 📋 | Legal | Q4 2026 (monitor delegated acts) |

---

## SECTION 6B — ASIA-PACIFIC / AFRICA REGULATIONS

| Regulation | Obligation | Implementation | Status | Owner | Target |
|---|---|---|---|---|---|
| Vietnam PDPD | MPS cross-border transfer approval | `docs/compliance/asia-pacific-supplement-2.md` | 🔴 | Legal | Before VN customers |
| Vietnam PDPD | Local representative appointment | Engage Vietnam counsel | 🔴 | CEO | Before VN customers |
| Philippines DPA | DPO registration with NPC | `docs/compliance/asia-pacific-supplement-2.md` | 🔴 | Legal | Q3 2026 |
| Philippines DPA | NPC breach notification (72h) | IR policy v2.0 — §7 regulatory contacts | ✅ | Engineering | Done |
| Taiwan PDPA | Cross-border transfer whitelist check | `docs/compliance/asia-pacific-supplement-2.md` | 📋 | Legal | Q3 2026 |
| Hong Kong PDPO | PICS statement for HK users | Add PICS to HK onboarding | 📋 | Legal | Q3 2026 |
| Malaysia PDPA | JPDP URL in privacy notice | Add to privacy policy | 📋 | Legal | Q3 2026 |
| Nigeria NDPA 2023 | NDPC DPO registration | `docs/compliance/nigeria-ndpa.md` | 🔴 | Legal | Q2 2026 |
| Nigeria NDPA 2023 | NDPC breach notification (72h) | IR policy v2.0 — §7 regulatory contacts | ✅ | Engineering | Done |
| Nigeria NDPA 2023 | DPCO engagement | Engage when NGA customers > 2,000 | 📋 | Legal | Q3 2026 |
| South Africa POPIA | Information Regulator breach notification | IR policy v2.0 — §7 regulatory contacts | ✅ | Engineering | Done |
| Emerging regulations | 15-item active watch list | `docs/compliance/emerging-regulations-watchlist.md` | ✅ | Legal | Monthly review |

---

## SECTION 7 — LEGAL DOCUMENTS (One-time)

| Document | Status | Owner | Action |
|---|---|---|---|
| HIPAA BAA template | ✅ `docs/legal/hipaa-baa-template.md` | Legal | Send to healthcare customers |
| EU AI Act GPAI compliance | ✅ `docs/legal/eu-ai-act-gpai-compliance.md` | Engineering | Review quarterly |
| Subprocessor DPA checklist | ✅ `docs/legal/subprocessor-dpa-checklist.md` | Legal | **Sign all 5 — May 2026** |
| DPA signing guide | ✅ `docs/legal/dpa-signing-guide.md` | Legal | Follow step-by-step |
| DPO appointment letter | ✅ `docs/legal/dpo-appointment-letter.md` | CEO | **Sign — May 2026** |
| ICO registration guide | ✅ `docs/legal/ico-registration-guide.md` | Legal | **Register — May 2026** |
| International privacy gap assessment | ✅ `docs/legal/international-privacy-gap-assessment.md` | Legal | Review quarterly |
| PCI DSS scoping | ✅ `docs/legal/pci-dss-scoping.md` | Engineering | Reassess if billing introduced |
| FedRAMP gap assessment | ✅ `docs/legal/fedramp-gap-assessment.md` | Engineering | Revisit on federal opportunity |

---

## SECTION 8 — UPCOMING COMPLIANCE CALENDAR

| Date | Event | Action | Owner |
|---|---|---|---|
| **May 2026** | Sign 5 subprocessor DPAs | `docs/legal/dpa-signing-guide.md` | Legal |
| **May 2026** | Register with UK ICO | `docs/legal/ico-registration-guide.md` | Legal |
| **May 2026** | Sign DPO appointment letter | `docs/legal/dpo-appointment-letter.md` | CEO |
| **May 2026** | Management sign-off on ISO 27001 docs | ISMS documents | CEO |
| **May 2026** | Submit CSA STAR Level 1 CAIQ | `docs/compliance/csa-star-caiq.md` | CEO |
| **✅ Done** | Create security.txt (NYDFS 500) | `public/.well-known/security.txt` | Engineering |
| **✅ Done** | Add NDPC + NPC + OAIC + SA Information Regulator to IR policy | IR policy v2.0 §5 & §7 | Engineering |
| **May 2026** | No-training-on-customer-data ToS clause (CNIL) | ToS update | Legal |
| **✅ Done** | FTC HBNR + PHI enforcement middleware | `phiEnforcementMiddleware.ts` | Engineering |
| **Jun 2026** | NIS2 CSIRT contacts added to IR policy | IR policy update | Legal |
| **Aug 2, 2025** | EU AI Act Art. 50 transparency | ✅ Already done | — |
| **Sep 2026** | Employee security training completed | Training platform | Eng Lead |
| **Sep 2026** | Select SOC 2 auditor | RFP to 3 firms | CEO |
| **Oct 2026** | First management review meeting | Minutes document | CEO + Eng Lead |
| **Nov 1, 2026** | SOC 2 Type II observation period STARTS | Evidence collection begins | Engineering |
| **Q4 2026** | ISO 27001 Stage 1 audit | Engage certification body | Engineering |
| **Q1 2027** | ISO 27001 Stage 2 audit | Certification | Cert body |
| **Jul 2027** | SOC 2 Type II report issued | Auditor delivers report | Auditor |

---

## SECTION 9 — MONITORING (On-going)

| Regulation | Change Expected | Monitor Source | Frequency |
|---|---|---|---|
| India DPDP Act rules | 2025–2026 | MEITY website; India counsel | Monthly |
| Canada CPPA / Bill C-27 | 2026–2027 if passed | Parliament of Canada | Monthly |
| China PIPL implementing rules | Ongoing | CAC website; China counsel | Monthly |
| EU ePrivacy Regulation | Still pending | EU Council tracker | Quarterly |
| EU AI Act delegated acts | 2025–2026 | EU Commission; EU AI Office | Monthly |
| EU CRA delegated acts | 2026 | EU Commission | Quarterly |
| US state laws (new enactments) | Ongoing | IAPP tracker; Husch Blackwell | Monthly |
| Chile PDPA implementing regulations | 2026 | CPLT | Quarterly |

---

---

## SECTION 10 — COMPLIANCE DOCUMENT LIBRARY

| Document | Path | Type |
|---|---|---|
| GDPR/CCPA/HIPAA Privacy Routes | `backend/src/routes/privacy.ts` | Code |
| AI Regulatory Classifier | `backend/src/services/compliance/AIRegulatoryClassifier.ts` | Code |
| Incident Materiality Service | `backend/src/services/compliance/IncidentMaterialityService.ts` | Code |
| AI Regulatory Middleware | `backend/src/middleware/aiRegulatoryMiddleware.ts` | Code |
| Retention Service | `backend/src/services/compliance/RetentionService.ts` | Code |
| ISO 27001 ISMS Scope | `docs/iso27001/isms-scope.md` | Policy |
| Information Asset Register | `docs/iso27001/information-asset-register.md` | Policy |
| Statement of Applicability | `docs/iso27001/statement-of-applicability.md` | Policy |
| Risk Register | `docs/iso27001/risk-register.md` | Policy |
| ISO 42001 AI Policy | `docs/iso42001/ai-policy.md` | Policy |
| ISO 27017/27018 Cloud Controls | `docs/iso27017/cloud-security-controls.md` | Policy |
| ROPA (GDPR Art. 30 / LGPD Art. 37) | `docs/legal/ropa-record-of-processing-activities.md` | Legal |
| HIPAA BAA Template | `docs/legal/hipaa-baa-template.md` | Legal |
| DPIA Template (GDPR Art. 35 / Law 25) | `docs/legal/dpia-template.md` | Legal |
| Quebec PIA Template (Law 25 §3.3) | `docs/legal/quebec-pia-template.md` | Legal |
| DPA Signing Guide | `docs/legal/dpa-signing-guide.md` | Legal |
| DPO Appointment Letter | `docs/legal/dpo-appointment-letter.md` | Legal |
| ICO Registration Guide | `docs/legal/ico-registration-guide.md` | Legal |
| ISO 27001 Management Review Template | `docs/iso27001/management-review-template.md` | Operational |
| ISO 27001 Employee Training Record | `docs/iso27001/employee-security-training-record.md` | Operational |
| SOC 2 Observation Period Kickoff | `docs/soc2/observation-period-kickoff.md` | Operational |
| State AI Laws (CO/NYC/IL) | `docs/compliance/state-ai-laws-implementation.md` | Compliance |
| NY DFS / SEC Compliance | `docs/compliance/nydfs-sec-compliance.md` | Compliance |
| CMMC / FTC HBNR | `docs/compliance/cmcc-ftc-hbnr.md` | Compliance |
| EU Data Act / AI Liability | `docs/compliance/eu-data-act-ai-liability.md` | Compliance |
| Germany BDSG / France CNIL | `docs/compliance/germany-bdsg-france-cnil.md` | Compliance |
| Asia-Pacific Supplement 2 | `docs/compliance/asia-pacific-supplement-2.md` | Compliance |
| Nigeria NDPA | `docs/compliance/nigeria-ndpa.md` | Compliance |
| US State Privacy Laws (25 states) | `docs/compliance/us-state-privacy-laws.md` | Compliance |
| Global Regulatory Landscape | `docs/compliance/global-regulatory-landscape.md` | Compliance |
| Additional Regulations Survey | `docs/compliance/additional-regulations.md` | Compliance |
| Emerging Regulations Watch List | `docs/compliance/emerging-regulations-watchlist.md` | Compliance |
| NIST CSF 2.0 Mapping | `docs/compliance/nist-csf2-mapping.md` | Compliance |
| CIS Controls v8 | `docs/compliance/cis-controls-v8.md` | Compliance |
| MITRE ATT&CK Mapping | `docs/compliance/mitre-attack-mapping.md` | Compliance |
| CSA STAR CAIQ (ready to submit) | `docs/compliance/csa-star-caiq.md` | Compliance |

---

*This tracker is the authoritative source. Any compliance change, signed document, or completed action must be recorded here on the same day.*
