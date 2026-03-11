# MRC Meeting Preparation

## Meeting Context
- **Who:** MRC — personal connection who wants to test the platform
- **Format:** Live demo + hands-on testing
- **Goal:** Let them experience the platform, build confidence, generate word-of-mouth

---

## Pre-Meeting Checklist

- [ ] Railway deployment live at `app.datacendia.com`
- [ ] `DATACENDIA_LICENSE_TIER=sovereign` set in Railway env
- [ ] `INFERENCE_PROVIDER=openai` + `OPENAI_API_KEY` set for live deliberations
- [ ] Demo seed data loaded (sector-appropriate)
- [ ] Test login flow end-to-end before the meeting
- [ ] Time the demo path — aim for 15 minutes max before handing them the keyboard

---

## 15-Minute Demo Path

### 1. Dashboard (2 min)
Open with the main dashboard. Show:
- Active decisions, alerts, metrics at a glance
- Real-time system status
- "This is what a governed AI organization looks like from day one"

### 2. Council Deliberation (5 min)
Navigate to a completed deliberation. Walk through:
- The question that was asked
- Which agents participated and their roles
- The arguments made by each agent
- **The dissent** — show where an agent disagreed and why
- The consensus recommendation + confidence score
- The cryptographic evidence hash at the bottom

**Key line:** "Every argument, every position, every dissent is recorded. Not just the final answer — the entire reasoning process."

### 3. Audit Trail (3 min)
Open the audit logs. Show:
- Timestamped, attributed events
- Cryptographic signatures on each entry
- Filter by user, by action type, by date range

**Key line:** "When a regulator asks 'show me how this decision was made' — this is what you show them."

### 4. Regulator's Receipt (3 min)
Export a Regulator's Receipt from the deliberation. Show:
- The three PDFs: Court-Admissible Record, Evidence Package, Executive Summary
- SHA-256 hash + Merkle root
- Ed25519 signature — verifiable with standard openssl
- Compliance gates: SOC 2, GDPR, EU AI Act

**Key line:** "This is court-admissible evidence that this decision was governed. Generated automatically. No manual documentation."

### 5. CendiaGateway Dashboard (2 min)
Show the Gateway interaction logs:
- Every AI interaction logged with user, model, timestamp
- PII detection flags
- Policy enforcement status

**Key line:** "This is running right now. Every employee, every AI tool, every interaction — governed from day one."

---

## Hand-Off: Let Them Test

After the 15-minute walkthrough, hand them the keyboard:
- Give them login credentials
- Let them run a live deliberation on a question of their choosing
- Let them explore the dashboard
- Let them export a Regulator's Receipt

**What to watch for:** Their questions reveal what matters to them. Listen more than you talk.

---

## Talking Points by Audience Type

### If they're a potential customer:
- "We're looking for pilot partners. 60 days, prove value before scaling."
- "Deploys in 30 minutes via DNS change. No software on devices."
- "What AI tools does your organization use today?"

### If they're a potential investor:
- "603,000 lines of production code. Clean build. 30 industry verticals."
- "The regulatory tailwind is structural — EU AI Act, DS 115-2025-PCM, every jurisdiction is converging on the same requirement."
- "We're pre-revenue, seeking pilot partners. FEPCMAC conversation is active."

### If they're a potential partner:
- "CendiaGateway is the enforcement layer — it makes governance frameworks executable."
- "We complement Big 4 advisory. They design the policy, we enforce it technically."
- "Open-core model. Community edition on GitHub, enterprise features licensed."

### If they're just curious:
- Let the platform speak for itself
- Focus on the Council deliberation — it's the most visually impressive feature
- Show the Regulator's Receipt — it's the most tangible output

---

## Questions You Should Be Ready For

| Question | Answer |
|----------|--------|
| "Is this production-ready?" | "The community edition has a clean build with zero TypeScript errors. We're in alpha — seeking pilot partners to validate in production." |
| "Who's using it?" | "We're in active conversations with FEPCMAC (Peru's microfinance federation) and pursuing Big 4 partnerships. No paying customers yet — we're honest about that." |
| "How much does it cost?" | "POC is $20K for 60 days, credited to the first annual contract. Enterprise pricing is custom." |
| "What models does it use?" | "Model-agnostic. OpenAI, Anthropic, Google, Ollama, any model. We govern whatever AI you use." |
| "Can it run on-premises?" | "Yes. Full air-gapped deployment. 21-service Docker Compose stack. Zero data egress." |
| "Did you build this alone?" | "Yes. 18 months, solo. The audit confirms 603K lines of source code. NVIDIA Inception member." |

---

## After the Meeting

- Send a thank-you email within 24 hours
- If they expressed interest in a specific use case, follow up with the relevant one-pager
- If they want to introduce you to someone, make it easy — provide a 2-sentence description they can forward
- If they just wanted to see it, that's fine too — plant the seed and move on

---

## The 2-Sentence Forward

> "Stuart built an AI governance platform that creates cryptographic proof of how AI decisions are made — so when regulators ask, you have an irrefutable answer. It deploys in 30 minutes and generates court-admissible evidence from day one."
