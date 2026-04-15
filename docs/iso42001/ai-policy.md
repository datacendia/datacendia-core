# Artificial Intelligence Policy
**ISO/IEC 42001:2023 — Clause 5.2 / NIST AI RMF GOVERN 2.1 / EU AI Act Art. 5, 9**
**Document Owner:** CEO / Engineering Lead
**Version:** 1.0 | April 2026
**Review Cadence:** Annually

---

## 1. Purpose

This policy establishes Datacendia's principles, obligations, and governance framework for the responsible development, deployment, and use of Artificial Intelligence (AI) and Machine Learning (ML) systems. It applies to all AI used within the Datacendia platform and any AI used by Datacendia employees in performing their duties.

---

## 2. Scope

This policy applies to:
- All AI and ML models integrated into the Datacendia platform
- All third-party AI services used by Datacendia (OpenAI, Groq, etc.)
- All employees, contractors, and partners who develop, deploy, or use AI systems on behalf of Datacendia
- AI systems provided to customers as part of the Datacendia service

---

## 3. AI Governance Principles

Datacendia commits to the following principles in all AI development and use:

### 3.1 Human Oversight
All consequential AI decisions must remain subject to human review and override. The Datacendia deliberation workflow is designed as a **human-in-the-loop** system. No AI output shall be used as a final, automated decision without human consideration where the decision materially affects a person.

### 3.2 Fairness and Non-Discrimination
AI systems shall not produce outputs that discriminate against individuals or groups based on protected characteristics (race, ethnicity, gender, age, religion, disability, sexual orientation, or national origin). Bias detection is mandatory for all AI components that produce outputs affecting individual persons.

### 3.3 Transparency
- Users must always know when they are interacting with an AI system (EU AI Act Art. 50)
- AI-generated content shall be labelled (`X-AI-Generated: true` response header)
- The basis for AI recommendations shall be explainable and auditable

### 3.4 Privacy by Design
- Personal data, and especially Protected Health Information (PHI), shall be de-identified before being included in AI prompts
- The Presidio PII detection service is mandatory before sending user-provided content to external AI models
- AI outputs shall not reproduce or reconstruct personal data

### 3.5 Security
- All AI models used in the platform are evaluated for security risks before deployment
- Adversarial red-teaming is performed on AI components before major releases
- Prompt injection attacks are mitigated via input sanitisation middleware

### 3.6 Accountability
- Every AI output in the deliberation workflow is logged with attribution (which model, which agent, which version)
- The Model Registry (`ModelRegistryService`) tracks all AI models, their versions, and their lifecycle status
- AI incidents are logged in the AI Incident Registry (Section 6)

---

## 4. Prohibited AI Uses (EU AI Act Art. 5)

The following uses are **absolutely prohibited** within the Datacendia platform and by Datacendia employees. Guardrails are implemented in the OPA policy engine and NeMo Guardrails to enforce these prohibitions technically:

| # | Prohibited Use | EU AI Act Reference | Technical Control |
|---|---|---|---|
| 1 | Subliminal manipulation techniques that distort decision-making without the person's awareness | Art. 5(1)(a) | OPA policy rule |
| 2 | Exploitation of vulnerabilities of specific groups (age, disability, social situation) | Art. 5(1)(b) | OPA policy rule |
| 3 | Real-time remote biometric identification in publicly accessible spaces | Art. 5(1)(d) | OPA policy rule; no biometric integration |
| 4 | Social scoring by public authorities | Art. 5(1)(c) | OPA policy rule |
| 5 | Emotion recognition in the workplace or educational institutions | Art. 5(1)(f) | OPA policy rule; NeMo guardrail |
| 6 | AI that creates or expands facial recognition databases through untargeted scraping | Art. 5(1)(e) | No image processing in platform |
| 7 | Predictive policing based solely on profiling individuals | Art. 5(1)(g) | OPA policy rule |

**Violation of this section by any employee or contractor is grounds for immediate termination.**

---

## 5. AI Risk Classification

All AI systems integrated into the Datacendia platform are classified using the EU AI Act risk levels and the NIST AI RMF risk taxonomy before deployment:

| Risk Level | Examples | Requirements |
|---|---|---|
| **Unacceptable** | Prohibited uses listed in Section 4 | Not permitted |
| **High Risk** | AI used for credit/insurance/hiring decisions (Annex III) | Technical documentation; conformity assessment; human oversight; bias testing; logging |
| **Limited Risk** | Chatbots, recommendation engines | Transparency disclosure; AI labelling |
| **Minimal Risk** | Spam filters, internal analytics | Standard testing; model card recommended |

**Process:** All new AI integrations must complete an **AI Impact Assessment** (template in `docs/iso42001/ai-impact-assessment-template.md`) before production deployment.

---

## 6. AI Incident Registry

All AI-related incidents must be reported to **security@datacendia.com** and logged here within 24 hours of detection.

**AI Incident** means any of the following:
- AI output that causes or could cause harm to a person
- Bias or discrimination detected in AI outputs
- AI producing regulated professional advice (medical, legal, financial) without appropriate disclaimers
- Prompt injection or adversarial attack that manipulates AI behaviour
- AI system outage affecting customer operations
- Breach of this AI Policy

| ID | Date | System | Incident | Severity | Reported To | Status | Resolution |
|---|---|---|---|---|---|---|---|
| *(No incidents recorded)* | | | | | | | |

**Severity Levels:** Critical (harm occurred) / High (potential harm) / Medium (policy violation) / Low (near miss)

**Reporting Timeline:**
- Critical: Report to management within **1 hour**; EU AI Office within **15 business days** (if systemic risk model involved)
- High: Report within **24 hours**
- Medium/Low: Log within **7 days**

---

## 7. AI Supplier Management

Third-party AI model providers are assessed using the Supplier Security Questionnaire (Section J — AI-specific questions). Specific requirements:

| Provider | Assessment Frequency | Data Processing Agreement | GPAI Compliance |
|---|---|---|---|
| OpenAI | Annually | Required (sign via OpenAI DPA) | EU AI Act GPAI provisions apply to GPT-4 class |
| Groq | Annually | Required | Open-weights models; limited GPAI obligations |
| Future providers | Before onboarding | Required | Assess before integration |

**Prohibition:** No AI provider shall be permitted to train on Datacendia customer data without explicit written consent from the relevant customer.

---

## 8. Model Lifecycle Management

All AI models used in the platform are tracked in the Model Registry (`ModelRegistryService`):

| Stage | Requirement |
|---|---|
| **Evaluation** | AI Impact Assessment; bias testing; red-team evaluation |
| **Staging** | Limited deployment; monitoring; human review of outputs |
| **Production** | Full logging; bias monitoring; post-market monitoring |
| **Deprecated** | Blocked from new use; existing uses migrated within 90 days |
| **Retired** | Removed from registry; no further use |

---

## 9. Responsibilities

| Role | AI Responsibility |
|---|---|
| **CEO** | Policy approval; AI risk acceptance; public accountability |
| **Engineering Lead** | Technical implementation; bias testing; model registry maintenance |
| **All Employees** | Comply with prohibited use list; report AI incidents |
| **Customer Success** | Ensure customers understand AI limitations; capture feedback |

---

## 10. Review and Compliance

- This policy is reviewed annually and after any significant AI incident
- Compliance is assessed quarterly as part of the ISMS internal audit
- Customers may request evidence of AI policy compliance for due diligence

---

## Document Control

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 2026 | Engineering Lead | Initial AI Policy |

**Approved By:** *(CEO signature required)*
**Next Review:** April 2027
