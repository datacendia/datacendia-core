# Datacendia — Enterprise Demo Playbook
## Sales and Pre-Sales Reference — v0.2.4-alpha (April 2026)

> **Audience:** Sales Engineers, Account Executives, Pre-Sales, Solutions Architects.
> **Purpose:** Structured playbook for demonstrating Datacendia to enterprise prospects.

---

## Table of Contents

1. [Before the Demo — Preparation Checklist](#1-before-the-demo)
2. [Universal Opening — 5 Minutes](#2-universal-opening)
3. [Persona Tracks](#3-persona-tracks)
4. [Core Demo Flows](#4-core-demo-flows)
5. [Industry Scenario Library](#5-industry-scenario-library)
6. [Objection Handling](#6-objection-handling)
7. [Closing Sequences](#7-closing-sequences)
8. [Technical Deep-Dive Track](#8-technical-deep-dive-track)
9. [Demo Environment Setup](#9-demo-environment-setup)

---

## 1. Before the Demo

### 48 Hours Before

- [ ] Research the prospect's industry, recent regulatory actions, and any public AI incidents in their sector
- [ ] Check if they have a known compliance framework obligation (HIPAA, SEC, NYDFS, EU AI Act, CMMC)
- [ ] Pre-seed the relevant industry scenario (see §5)
- [ ] Confirm demo environment is live at `app.datacendia.com`
- [ ] Review their LinkedIn/company page: company size, existing AI tools, recent news

### 30 Minutes Before

- [ ] Log in as `demo.ceo@datacendia.com` — confirm deliberation history is visible
- [ ] Test inference: `GET /api/v1/inference/status` — confirm AI is responding
- [ ] Prepare the "hardest question" scenario relevant to their industry
- [ ] Have the Datacendia Bible open on a secondary screen
- [ ] Mute notifications. Close unrelated tabs.

### Know Your Audience

| Role | Primary Pain | Desired Outcome |
|------|-------------|----------------|
| CISO / CTO | Audit exposure, uncontrolled AI | Proof of control and evidence chain |
| Chief Compliance Officer | Regulatory violations, unexplainable AI decisions | Multi-framework coverage, automatable documentation |
| CFO | Cost of compliance failures, legal liability | ROI calculation, insurance premium reduction |
| General Counsel | Cannot produce AI evidence in discovery | Decision Packet as litigation-ready artifact |
| CHRO | Employment AI liability (NYC LL 144, IL AIVIA, CO SB 205) | AEDT disclosure, human override, appeal workflow |
| Board Member | Fiduciary duty, reputational risk | Governance maturity scorecard |
| Head of AI | Governance overhead slowing deployment | Governance as value-add, not a tax |

---

## 2. Universal Opening

### The 60-Second Framing

"Let me ask you a question: If your largest AI decision from last quarter was challenged in a regulatory audit tomorrow — could you produce a complete record of who was involved, what information they had, what was debated, what was rejected, and why you chose what you did? Not just the output — the entire process.

Most organizations can't. Datacendia solves that. We turn AI decisions into structured, multi-agent deliberations with cryptographic evidence chains — so every high-stakes AI decision is auditable, explainable, and defensible."

### Opening Questions by Persona

**For Compliance Officers:**
"What is your current process when a regulator asks you to explain an AI-assisted decision? How long does that take your team?"

**For CISOs:**
"How many AI tools are running in your organization that you have not formally approved? Shadow AI is typically 3 to 5 times what IT knows about."

**For General Counsels:**
"Have you had to produce AI decision records in litigation or regulatory response in the past 24 months? What was that process like?"

**For CFOs:**
"Do you have a line item for AI compliance risk? Most organizations don't — until they have their first regulatory action, which averages $4.2M in direct costs."

---

## 3. Persona Tracks

### Track A — Compliance Officer (30 min)

Focus: Regulatory coverage, automated evidence, GDPR/HIPAA/SEC proof

1. Universal Opening (5 min)
2. Compliance Middleware Demo — AI regulatory classification live (8 min)
3. Privacy API walkthrough — data subject rights, breach notification planner (7 min)
4. Decision Packet — show a completed deliberation, download the evidence package (5 min)
5. Questions and close (5 min)

**Key messages:**
- Every AI decision produces litigation-ready documentation automatically
- 40+ compliance frameworks enforced in the middleware — not bolted on after
- Breach notification planner generates regulator-ready notices in minutes, not weeks

### Track B — CISO / Security Track (30 min)

Focus: Shadow AI control, cryptographic audit trail, threat detection

1. Universal Opening (5 min)
2. Shadow AI Scanner demo — show detection of unauthorized AI tools (8 min)
3. Security middleware chain walkthrough — 9 layers of defense (5 min)
4. Cryptographic audit log — Merkle chain integrity proof (7 min)
5. Questions and close (5 min)

**Key messages:**
- Shadow AI detection across SIEM, proxy, and browser — not just theoretical
- Every API request is logged in a tamper-evident Merkle chain
- demoGuardMiddleware shows how data isolation works at the architecture level

### Track C — General Counsel / Legal Track (30 min)

Focus: Discovery-readiness, regulatory defense, evidence packaging

1. Universal Opening (5 min)
2. Decision Packet download — show the self-contained HTML + JSON evidence package (8 min)
3. CendiaVerify public portal — third-party verification without platform access (7 min)
4. Dissent ledger — show immutable dissent records, chain of custody (5 min)
5. Questions and close (5 min)

**Key messages:**
- "Regulator's Receipt" — a self-contained verifiable artifact, like a blockchain receipt for a decision
- Dissent records are immutable. You can prove what was debated and what was overruled.
- The public verification portal means auditors and opposing counsel can verify without a platform account

### Track D — Full Platform Demo (60 min)

1. Universal Opening (5 min)
2. Live deliberation — submit a real decision question for the industry (15 min)
3. Decision Packet + Evidence Package (8 min)
4. Compliance enforcement middleware live (7 min)
5. Shadow AI scanner (5 min)
6. Governance report + pillar scores (5 min)
7. Pricing, tiers, deployment options (5 min)
8. Q&A and next steps (10 min)

---

## 4. Core Demo Flows

### 4.1 — Live Deliberation (The Money Shot)

This is the most powerful demo moment. Run a real deliberation live.

**Steps:**
1. Navigate to `app.datacendia.com` — Council module
2. Click "New Deliberation"
3. Enter an industry-relevant question from §5
4. Set agents: all 6 (CFO, Legal, Risk, Strategist, Ethics, Operations)
5. Click "Begin Deliberation"
6. Talk through what's happening as agents respond:
   - "Each agent is analyzing independently — there's no prior coordination"
   - "Notice the Legal agent is flagging regulatory exposure the CFO agent didn't flag"
   - "This cross-examination phase is where the real governance value is"
7. Wait for synthesis — highlight the confidence score
8. Show dissent record if any agent dissented
9. Click "View Decision Packet"

**Talk track during deliberation:**
"What you're watching is six AI personas with different mandates independently analyzing this decision. The CFO is looking at capital allocation. The Legal agent is checking regulatory exposure. The Ethics officer is checking for bias and fairness. None of them see each other's responses in the analysis phase — only in the cross-examination phase that follows. This is structural adversarial analysis, not one AI trying to appear balanced."

### 4.2 — Decision Packet and Evidence Package

After any deliberation is complete:

1. Click "Download Evidence Package"
2. Show the ZIP contents: HTML verifier, JSON data, PDF summary
3. Open the HTML verifier in a browser — it works completely offline
4. Point out: SHA-256 hash, Merkle root, customer signature field, timestamp
5. Navigate to `/verify` — paste the receipt hash
6. "This is what you give to your regulator, your auditor, or opposing counsel"

**Talk track:**
"This is what we call the Regulator's Receipt. It is a completely self-contained, cryptographically verifiable record of the decision. It doesn't require a Datacendia account to verify. The hash matches the packet stored in our system. You can give this to the SEC, the ICO, your board, or your legal team — and they can verify independently that nothing has been altered."

### 4.3 — Compliance Middleware Live

This demonstrates the regulatory enforcement layer.

1. Open the API documentation (or use Postman)
2. Show `POST /api/v1/deliberations` with a health-domain question
3. Without the `X-PHI-Deidentified: true` header — show 451 response
4. Add the header — show the request proceeding
5. Show the `X-AI-Regulatory-Risk` response header
6. Navigate to `/api/v1/privacy/classify-ai-use-case` — classify a use case live

**Talk track:**
"The compliance enforcement is not an overlay or an audit tool — it's in the middleware. Before any AI inference happens, the system classifies the use case against six regulatory frameworks. If it detects a prohibited practice under the EU AI Act, it returns HTTP 451 — Unavailable For Legal Reasons — and the request never reaches the model. If it detects PHI in a health domain without de-identification, same result. Your developers cannot accidentally violate HIPAA even if they try."

### 4.4 — Shadow AI Scanner

1. Navigate to Shadow AI Scanner in the Wedge section
2. Show the detection dashboard — simulated discovery of 14 unauthorized AI tools
3. Click into one tool — show risk classification (CRITICAL: employee data sent to external AI)
4. Show the remediation recommendation
5. Show the governance gap this creates (no DPA, no DPIA, potential GDPR Art. 28 violation)

**Talk track:**
"This is what shadow AI looks like in practice. Your IT team knows about ChatGPT. They probably don't know about the 14 other AI tools your employees are using right now — some of them processing customer PII, some processing HR data, some connected to your CRM. Shadow AI is the single largest unmanaged risk in enterprise AI governance. This scanner finds it."

### 4.5 — Dissent Ledger

1. Open any completed deliberation with a dissent
2. Show the dissent record: agent, reasoning, timestamp, vote
3. Explain: "This cannot be deleted — it's in the Merkle chain"
4. Show the acknowledgment workflow — who saw the dissent and when

**Talk track:**
"When the Ethics agent disagrees with the consensus — and that happens — the dissent is permanently recorded. Not just noted and dismissed. The dissent is cryptographically hashed into the Decision Packet. In a regulatory inquiry, you can prove not only what decision was made, but what objections were raised, by whom, on what basis, and how they were addressed. That is the difference between a defensible decision and an indefensible one."

### 4.6 — Privacy API and Breach Notification

1. Navigate to the Privacy API section in developer docs
2. Show `POST /api/v1/privacy/ai-impact-assessment` — generate a CO SB 205 impact assessment
3. Show output: risk level, applicable regulations, required mitigations, review schedule
4. Show `POST /api/v1/privacy/wa-mhmda-consent` — demonstrate state AI law breadth
5. Run the breach notification planner: describe a hypothetical incident
6. Show output: 14 jurisdictions, sorted by deadline, with draft notices

**Talk track:**
"The breach notification planner — when you describe an incident, it tells you exactly which regulators you need to notify, in what order, by what deadline, with a draft notice for each. SEC 4-day Form 8-K. NYDFS 72 hours. GDPR 72 hours. HIPAA 60 days. All of them, simultaneously, with the contacts pre-filled. That is the difference between a well-managed incident and a regulatory catastrophe."

---

## 5. Industry Scenario Library

### 5.1 — Financial Services (Primary: Meridian Capital Demo)

**Pre-seeded org:** `tr-demo-meridian` (Meridian Capital Partners)

**Recommended deliberation question:**
"Should we proceed with the $180M senior secured credit facility for Hargreaves & Thornton given the PEP status of three beneficial owners? Our AML program flags this as elevated risk but the commercial relationship has been in good standing for 8 years."

**Why this works:**
- Immediately relevant: AML, FATF, PEP exposure is a daily reality for financial firms
- Multi-agent tension is natural: CFO (commercial value) vs Legal (regulatory exposure) vs Risk (AML flags)
- Produces a strong dissent record almost every time
- Regulatory enforcement fires: SEC, FINRA, OFAC references appear in the response

**Regulatory hooks to highlight:**
- BSA/AML § 1026.11, FATF Recommendation 12 (PEP due diligence)
- SEC Rule 17a-4 (record retention for broker-dealers)
- NYDFS 23 NYCRR §504 (transaction monitoring)

### 5.2 — Healthcare / Life Sciences

**Recommended deliberation question:**
"Our clinical decision support AI is recommending higher opioid dosages for patients with chronic pain who are also flagged in our social determinants of health model as living in high-poverty ZIP codes. The recommendation improves short-term pain scores but may be perpetuating disparate treatment. Should we proceed with deployment to all 47 hospitals?"

**Why this works:**
- Immediate tension: clinical outcomes vs algorithmic bias vs regulatory risk
- Fires: phiEnforcementMiddleware, HIPAA, FTC HBNR, CO SB 205 (health AEDT)
- Ethics agent dissent almost certain
- Strong demonstration of the bias detection and health-domain compliance enforcement

**Regulatory hooks to highlight:**
- HIPAA §164.514(b) (PHI de-identification before AI)
- FTC HBNR 2024 (health breach notification)
- Section 1557 ACA (algorithmic bias in clinical AI)
- ONC HTI-1 Final Rule (CDSS transparency)

### 5.3 — Defense / Government (CMMC Scenario)

**Recommended deliberation question:**
"We need to select a cloud AI provider for processing CUI across our DoD contracts. The leading candidate is a hyperscaler with FedRAMP High authorization but no CMMC Level 2 certification. The contract award requires deployment in 90 days. Should we accept interim risk or delay?"

**Why this works:**
- Immediate time pressure creates authentic deliberation tension
- Fires: CMMC 2.0, ITAR, DoD DIBCAC, FedRAMP references
- Risk agent and Legal agent will produce strong dissents
- Shows the "Sovereign" air-gap option naturally

**Regulatory hooks to highlight:**
- CMMC 2.0 Level 2 (110 NIST SP 800-171 controls)
- DFARS 252.204-7012 (safeguarding CUI)
- ITAR §126.1 (prohibited destinations)

### 5.4 — Legal / Professional Services

**Recommended deliberation question:**
"Our AI contract review tool is recommending non-standard indemnification clauses in M&A agreements based on training data from prior deals. Three partners have flagged that the AI recommendations are consistently more aggressive than our standard risk posture. Do we continue using the AI-generated clauses or revert to manual review?"

**Why this works:**
- Directly relevant to law firms and corporate legal departments
- Generates strong agent disagreement between Risk and Operations
- Naturally leads to the Precedent matching feature (similar past decisions)
- Strong connection to EU AI Act Art. 22 (automated decision-making)

### 5.5 — Manufacturing / Critical Infrastructure

**Recommended deliberation question:**
"Our predictive maintenance AI is recommending we take Line 4 offline for 72 hours of unscheduled maintenance, citing a 78% probability of bearing failure within 14 days. The cost of downtime is $2.8M. The AI has a 12% false positive rate. We have an alternative: increase monitoring frequency and accept residual risk. What is the recommended course of action?"

**Why this works:**
- Classic safety-vs-cost tension where multi-agent deliberation adds undeniable value
- Operations agent and CFO agent will naturally conflict
- Risk agent will quantify the actuarial exposure
- Ethics agent raises workforce safety obligations
- Shows how Datacendia handles operational AI decisions, not just compliance-pure use cases

### 5.6 — Thomson Reuters (Meridian Capital — Pre-Built)

The Meridian Capital Partners scenario is fully pre-seeded with:
- 4 users (CEO, Head of Risk, Legal Counsel, CFO)
- 12 deliberations (M&A deals, AML flags, regulatory reporting, ESG reporting)
- Full metrics history and compliance scores
- Dashboard populated with real-looking financial governance data

Seed with: `POST /api/v1/demo/seed/tr` (SUPER_ADMIN)

---

## 6. Objection Handling

### "We already have a governance process"

"Tell me about it. How is the output documented? Is it machine-readable? Can you produce it in 24 hours when a regulator asks? Most governance processes produce meeting minutes — not cryptographic evidence. We augment your existing process with structure and proof."

### "This is overkill for our current AI maturity"

"That is exactly when to implement it — before you have incidents. The organizations calling us after a regulatory action wish they had implemented governance before. The cost of retroactive documentation is 10x the cost of proactive governance. And most of our customers say the governance discipline improves decision quality from day one."

### "We're worried about AI making our decisions"

"The AI agents do not make decisions. They provide structured analysis. Every deliberation requires human review and approval before anything is implemented. The Council's output is a recommendation with a dissent record — a human always holds the final decision authority. That is architecturally enforced, not a policy."

### "What about our proprietary data?"

"Your deliberation data never leaves your tenancy. Each organization's data is isolated by organization ID at the database level — not just by access control. We maintain a strict policy: zero training on customer data. That is in our Terms of Service, required by French CNIL guidance, and technically enforced in our inference pipeline."

### "The price is too high"

"Let me ask you this: what is your current cost of regulatory non-compliance? A single SEC action for inadequate AI governance documentation averages $8M in direct fines and 18 months of remediation. A GDPR enforcement action for unexplainable automated decisions carries up to 4% of global annual turnover. Datacendia's annual cost is a rounding error in that risk equation."

### "We need to evaluate alternatives"

"Great — I encourage that. The shortlist you should evaluate us against is: manual governance processes (which produce narrative, not evidence), bolt-on audit tools (which create documentation after the fact, not during), and general GRC platforms (which are not AI-specific and do not produce cryptographic evidence). Ask each of them: can you show me the Merkle root of a past decision? If they cannot, you are comparing different product categories."

### "Can this integrate with our existing tools?"

"Yes. We have 35+ pre-built connectors: Salesforce, SAP, ServiceNow, SIEM systems (Splunk, Sentinel, QRadar, Elastic), HR systems, and industry-specific platforms. We also expose a full REST API so any system your team builds can produce Datacendia-governed decisions. The integration question is which systems you want to feed into the Council context — not whether integration is possible."

---

## 7. Closing Sequences

### The POC Close (preferred for enterprise)

"Based on what you've seen today, the most productive next step is a 30-day proof of concept where we deploy the platform in your environment against one real use case from your current AI portfolio. You'll have a signed Decision Packet within the first week — something you can put in front of your legal team, your auditors, or your board. Can we get that scheduled?"

**POC structure:**
- Week 1: Deploy + connect one data source + first live deliberation
- Week 2: Compliance assessment against your top 3 regulatory obligations
- Week 3: Evidence package review with your legal/compliance team
- Week 4: ROI calculation and procurement presentation

### The Architecture Review Close (for technical audiences)

"Let's schedule a 2-hour architecture review with your security and engineering teams. We will walk through the full middleware chain, data isolation model, cryptographic evidence pipeline, and deployment options — including air-gap for your sovereign requirements. This gives your team the technical depth they need to evaluate and champion internally."

### The Board Brief Close (for C-suite)

"I can prepare a one-page board brief that maps Datacendia's governance capabilities directly to your current regulatory exposure — specifically [named frameworks from their industry]. This gives you a concrete agenda item for your next board meeting under AI Risk Management. Would that be useful?"

---

## 8. Technical Deep-Dive Track

For audiences with technical depth (CTO, Head of Engineering, Security Architecture).

### Topics to Cover (60 min)

1. **Architecture overview** (15 min) — Request flow: Helmet → Auth + demoGuard → requireOrgScope → aiRegulatoryMiddleware → Route → Service → DB
2. **Cryptographic pipeline** (15 min) — SHA-256 → Merkle tree → RSA-SHA256 signing → Decision Packet → ContentAddressedReceipt
3. **Multi-tenancy model** (5 min) — organization_id isolation, Prisma query scoping, verifyOrgOwnership
4. **Inference layer** (10 min) — InferenceService provider chain, air-gap fallback, per-agent model config
5. **Deployment options** (10 min) — Railway SaaS, self-hosted Docker, air-gapped sovereign
6. **Security controls** (5 min) — 9-layer middleware chain, RBAC, audit chain

### Key Technical Differentiators to Highlight

- "The audit log is a Merkle chain — modifying any past event changes the root hash and is immediately detectable"
- "demoGuardMiddleware is in the middleware chain, not in each route handler — it is structurally impossible to accidentally write to demo data from production code"
- "InferenceService is a singleton facade — all 45+ consumers get cloud AI support through a single provider swap, zero code changes to individual services"
- "express.static is registered before Helmet — this is intentional. We learned this the hard way in production. Asset requests cannot pass through security middleware."

---

## 9. Demo Environment Setup

### Credentials

| Account | Email | Password | Role |
|---------|-------|---------|------|
| Demo Admin | `demo.ceo@datacendia.com` | `DemoAccess2026!` | ADMIN |
| Demo Analyst | `demo.cfo@datacendia.com` | `DemoAccess2026!` | ANALYST |

### Seeding Commands (SUPER_ADMIN required)

```bash
# Seed main demo org (Apex Industries)
POST /api/v1/demo/seed

# Seed Meridian Capital (Thomson Reuters scenario)
POST /api/v1/demo/seed/tr

# Check status
GET /api/v1/demo/status

# Clear main demo data
DELETE /api/v1/demo/clear

# Clear Meridian Capital data
DELETE /api/v1/demo/clear/tr
```

### Inference Status Check

```bash
GET /api/v1/inference/status
```

Response:
```json
{
  "available": true,
  "provider": "openai",
  "primaryProvider": "openai",
  "failoverActive": false,
  "latencyMs": 340,
  "modelsLoaded": ["gpt-4o-mini"]
}
```

If `available: false` — check `OPENAI_API_KEY` environment variable on Railway.

### Fallback: Demo Without Live AI

If AI is unavailable, use pre-completed deliberations in the demo org. Navigate to:
- Council History — 12 completed deliberations for Meridian Capital
- Decision Packets — all downloadable as evidence packages
- Compliance scores — pre-populated dashboards

The evidence package download, CendiaVerify portal, and compliance middleware demos all work without live AI.

---

*Last updated: April 2026 — v0.2.4-alpha*
*Contact: sales@datacendia.com | Demo environment: app.datacendia.com*
*See also: [Datacendia Bible](./DATACENDIA-BIBLE.md) | [PRICING.md](./PRICING.md)*
