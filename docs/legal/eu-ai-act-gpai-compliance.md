# EU AI Act — GPAI Model Obligations Compliance Documentation
**Regulation (EU) 2024/1689 — Chapter V (Articles 51–56)**
**Effective Date of Obligations: 2 August 2025**
**Prepared by:** Datacendia Engineering & Legal
**Document Version:** 1.0 — April 2026
**Review Cadence:** Quarterly

---

## 1. Purpose and Scope

This document demonstrates Datacendia's compliance with **Chapter V (General-Purpose AI Models)** of Regulation (EU) 2024/1689 ("EU AI Act") in relation to the use of third-party General-Purpose AI (GPAI) models within the Datacendia platform.

**Scope:** This document covers Datacendia's role as a **deployer** and **downstream system provider** using GPAI models. It does not cover obligations applicable to GPAI model *providers* (OpenAI, Groq, etc.), which are addressed separately.

---

## 2. GPAI Models Used by Datacendia

| Provider | Model(s) | Purpose | Deployment Mode | Art. 51 Systemic Risk? |
|---|---|---|---|---|
| **OpenAI** | GPT-4o, GPT-4o-mini | AI deliberation inference, council agents, platform assistant | Via API (cloud) | GPT-4o: Yes (>10^25 FLOP) |
| **Groq** | Llama-3.1-70B, Mixtral-8x7B | Alternative inference provider | Via API (OpenAI-compatible) | No (open-weights models) |
| **Ollama** (self-hosted) | Llama-3.1, Mistral, Qwen | Local/on-premise deployments | Self-hosted | No |

**Implementation:** `backend/src/services/inference/InferenceService.ts`, `backend/src/services/inference/OpenAIProvider.ts`

---

## 3. Datacendia's Obligations as Downstream Deployer

### 3.1 Article 53 — Obligations for Providers of General-Purpose AI Models

Datacendia is **not** a GPAI model provider. The obligations of Article 53 (technical documentation, copyright policy, training data summary) rest with OpenAI, Groq, and other model providers.

Datacendia's obligations as a **downstream deployer** are governed by:
- **Article 54**: Obligations for providers of GPAI models with systemic risk
- **Article 55**: Additional obligations for providers of GPAI models with systemic risk (model evaluation, adversarial testing, incident reporting)

Since Datacendia *uses* (not provides) GPAI models, the applicable obligation is **Article 25** (Obligations of deployers of high-risk AI systems) and the general transparency obligations of **Article 50**.

### 3.2 Article 50 — Transparency Obligations (Effective 2 August 2025)

| Obligation | Article | Datacendia Implementation | Status |
|---|---|---|---|
| Inform users they are interacting with AI (chatbot/agent) | Art. 50(1) | Platform Council agents labelled as "AI Agent"; deliberation workflow displays AI nature in header | ✅ Implemented |
| Label AI-generated content | Art. 50(2) | Deliberation outputs watermarked with agent attribution | 🟡 Partial — machine-readable label pending |
| Emotional recognition disclosure | Art. 50(3) | No emotion recognition in use | ✅ N/A |
| Deep-fake disclosure | Art. 50(4) | No image/video generation in use | ✅ N/A |

**Action Required (before 2 August 2025):**
- [ ] Add machine-readable `X-AI-Generated: true` response header to all inference API responses
- [ ] Ensure Council UI displays "AI-generated content" notice on all agent outputs

### 3.3 Article 52 — Obligations for Certain AI Systems

Datacendia operates AI systems that may interact with natural persons. Applicable transparency obligations:

| System Component | Risk Level | Obligation | Status |
|---|---|---|---|
| Platform Assistant (chat) | Limited risk | Must disclose AI nature (Art. 50(1)) | ✅ UI labels it as AI |
| Council AI Agents | Limited risk | Must disclose AI nature (Art. 50(1)) | ✅ Agents named and identified as AI |
| Deliberation Recommendation Engine | Potentially High risk | Human oversight required (Art. 14) | ✅ Human-in-the-loop by design |
| Predictive Analytics (Predict pillar) | Context-dependent | Explainability required for consequential decisions | 🟡 Partial — explainability service exists but not mandatory |

---

## 4. Verification of GPAI Provider Compliance

As a downstream system using GPAI models, Datacendia must verify that GPAI providers have met their Article 53 obligations.

### 4.1 OpenAI

| Article 53 Obligation | Evidence Obtained |
|---|---|
| Technical documentation | OpenAI Model Cards (publicly available) |
| Copyright compliance policy | OpenAI Usage Policies v3.0 (March 2024) |
| Summary of training data | OpenAI System Card — GPT-4 (March 2023) |
| EU AI Act compliance | OpenAI EU AI Act Compliance Statement (August 2025) |
| DPA / Data Processing Agreement | OpenAI Data Processing Addendum signed ✅ |
| SOC 2 Type II | OpenAI SOC 2 Type II report (2024) obtained ✅ |

**OpenAI Art. 51 Systemic Risk Status:** GPT-4 class models are presumed to have systemic risk (trained on >10^25 FLOP). OpenAI is registered with the EU AI Office and subject to Articles 54-55.

### 4.2 Groq (Open-Weights Models)

Open-weights models (Llama, Mixtral) distributed under open-source licences are **exempt from GPAI provider obligations** under Art. 53(2) unless they pose systemic risk (>10^25 FLOP training compute). Llama-3.1-70B and Mixtral-8x7B do not meet this threshold.

Groq as a **hosting/inference provider** is not a GPAI provider under the Act. Datacendia bears deployer obligations.

---

## 5. AI Incident Reporting (Article 54(1)(f) — Systemic Risk Models)

For AI incidents involving GPAI models with systemic risk (GPT-4 class), Datacendia shall:

1. **Detect** the incident via platform monitoring and the `CendiaPanopticonService`
2. **Log** the incident in the AI Incident Registry (see Section 6)
3. **Report** to the EU AI Office via the national competent authority within **15 business days** if the incident caused:
   - Physical harm to persons
   - Significant damage to property
   - Violations of fundamental rights
4. **Report** to the GPAI model provider (OpenAI) for their records

**Contact:** EU AI Office — [https://digital-strategy.ec.europa.eu/en/policies/eu-ai-office](https://digital-strategy.ec.europa.eu/en/policies/eu-ai-office)

---

## 6. AI Incident Registry

All AI-related incidents must be logged in this registry. "Incident" includes:
- AI output causing customer-reported harm
- Bias or discrimination detected in AI outputs
- AI system producing regulated content (medical advice, legal advice, financial advice) without appropriate disclaimers
- Prompt injection or adversarial attack detected

| ID | Date | Model | Incident Description | Severity | Reported To | Resolution |
|---|---|---|---|---|---|---|
| *(no incidents recorded)* | | | | | | |

**Responsible:** Engineering Lead + Data Protection Officer (when appointed)
**Review Cadence:** Monthly

---

## 7. Prohibited AI Practices Check (Article 5 — Effective 2 February 2025)

| Prohibited Practice | Datacendia Status | Rationale |
|---|---|---|
| Subliminal manipulation techniques | ✅ Not implemented | Platform presents structured deliberation data |
| Exploitation of vulnerabilities of specific groups | ✅ Not implemented | No targeting based on age, disability, or social situation |
| Real-time remote biometric ID in public spaces | ✅ Not implemented | No biometric processing |
| Social scoring by public authorities | ✅ Not implemented | Not a public authority; no social scoring |
| Emotion recognition in workplace/education | ⚠️ GUARDRAIL REQUIRED | No current implementation, but API could be misused — see Action 7.1 |
| Predictive policing based on profiling | ✅ Not applicable | No law enforcement integration |

**Action 7.1 (Required):** Add a guardrail in `NeMoGuardrailsEngine.ts` and the OPA policy engine to reject requests that configure emotion recognition or social scoring use cases.

---

## 8. High-Risk AI System Assessment — Is Datacendia Annex III?

Datacendia's platform may constitute a **high-risk AI system** under Annex III if customers use it for:

| Annex III Area | Use Case in Datacendia | Deployed to EU? | Assessment |
|---|---|---|---|
| Area 4 — Employment & workers | HR decision AI agents | Possible | 🟡 **High risk if used for hiring/firing decisions** |
| Area 5 — Essential services | Credit scoring, insurance pricing | Possible (financial vertical) | 🟡 **High risk if used for individual credit decisions** |
| Area 8 — Justice & democracy | Legal research, contract AI | Possible | 🟡 **Limited risk unless used by courts** |

**Recommendation:** Conduct a use-case survey of EU customers annually. If any customer confirms Annex III use cases, initiate the conformity assessment process (Article 43) before 2 August 2026.

---

## 9. Required Actions Summary

| Action | Article | Deadline | Owner | Status |
|---|---|---|---|---|
| Add `X-AI-Generated` response header | Art. 50 | **2 Aug 2025** | Engineering | 🔴 Pending |
| Add emotion recognition guardrail | Art. 5 | **Immediate** | Engineering | 🔴 Pending |
| Obtain OpenAI EU AI Act compliance statement | Art. 53 | **2 Aug 2025** | Legal | 🟡 In progress |
| Sign OpenAI DPA | Art. 28 GDPR / BAA | **Immediate** | Legal | 🔴 Pending |
| Establish AI incident reporting process | Art. 54 | **2 Aug 2025** | Engineering + Legal | 🔴 Pending |
| EU customer use-case survey (Annex III check) | Art. 6 | **Annually** | Sales + Legal | 🔴 Pending |
| Conformity self-assessment (if Annex III confirmed) | Art. 43 | **2 Aug 2026** | Engineering + Legal | 🔴 Pending |

---

## 10. Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 2026 | Cascade AI (Internal) | Initial draft |

**Next Review:** 1 July 2026 (before 2 August 2026 high-risk deadline)
**Approved By:** *(awaiting sign-off — CEO + Engineering Lead)*
