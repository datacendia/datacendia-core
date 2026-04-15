# EU Data Act & EU AI Liability Directive — Implementation Guide
**Document Owner:** Legal + Engineering Lead | Version: 1.0 | April 2026

---

## Part 1 — EU Data Act (Regulation (EU) 2023/2854)

### Overview

- **In Force:** September 12, 2023 (entered into force); **obligations apply from September 12, 2025** ← ALREADY PAST
- **Scope:** Data sharing, cloud service switching, and smart contracts across the EU
- **Enforcer:** EU member state national authorities; fines up to €10M or 2% of global turnover

### Chapters Relevant to Datacendia

#### Chapter VII (Articles 23–31) — Cloud Switching and Porting

**This is the primary obligation for Datacendia as a cloud service provider.**

| Article | Obligation | Deadline | Status |
|---|---|---|---|
| Art. 23 | Enable customers to switch to another provider | In force Sep 2025 | 🔴 Must implement now |
| Art. 24 | Remove obstacles to effective switching | In force Sep 2025 | 🟡 Partial |
| Art. 25 | Equivalent technical conditions for transition | In force Sep 2025 | 🟡 Partial |
| Art. 26 | Switching charges — none after 3 years (Sep 2027) | Transition through Sep 2027 | ✅ No switching fees currently |
| Art. 27 | Data portability for cloud customers | In force Sep 2025 | ✅ Org export endpoint |
| Art. 29 | Smart contract requirements | In force Sep 2025 | ❌ N/A — no smart contracts |

#### Art. 23 — Switching Assistance Obligations

Datacendia must:
1. Provide a **complete export** of all customer data in a machine-readable format
2. Maintain exported data for **30 days** after switching request
3. Make the export available for download (not dependent on Datacendia's infrastructure)
4. Assist the customer in migrating to a new provider on request

**Implementation: `GET /api/v1/privacy/org-export` already built.**

Verify the export covers ALL customer data:

| Data Category | Covered by org-export | Status |
|---|---|---|
| Organisation metadata | ✅ `organizations` table | Done |
| Team members and user data | ✅ `team_members` + `users` | Done |
| API keys | ✅ `api_keys` | Done |
| Audit logs (last 1000 events) | ✅ Sample + note for full archive | Done |
| Deliberations and AI outputs | ❌ Not yet included | **Add** |
| Agent configurations | ❌ Not yet included | **Add** |
| Organisation settings and policies | ❌ Not yet included | **Add** |

**Action — enhance org-export endpoint to include deliberations and configs:**

```typescript
// Add to org-export in privacy.ts:
const [deliberations, agentConfigs, orgSettings] = await Promise.all([
  prisma.deliberations.findMany({ where: { organization_id: orgId }, orderBy: { created_at: 'desc' }, take: 10000 }),
  prisma.agents?.findMany({ where: { organization_id: orgId } }) ?? [],
  prisma.organization_settings?.findFirst({ where: { organization_id: orgId } }),
]);
// Add to exportPayload: deliberations, agentConfigs, orgSettings
```

#### Art. 24 — Obstacles to Switching

Prohibited obstacles:
- Contract clauses that deter switching (lengthy notice periods, exit fees, data deletion before export)
- Technical barriers (non-standard formats, missing documentation)
- Commercial barriers (tiered support degradation for switchers)

**Action — add to Terms of Service:**
```
DATA PORTABILITY AND SWITCHING (EU Data Act Art. 23-27)

Customers may request a complete export of all their data at any time via 
GET /api/v1/privacy/org-export. This export is provided free of charge.

Upon giving notice of intent to switch to another provider:
- Complete data export will be made available within 30 days
- Exported data will remain accessible for 30 days post-export
- Datacendia will not delete customer data during the switching period
- Datacendia will cooperate with the incoming provider for technical migration
- No switching fees apply

This provision is required by EU Data Act Regulation (EU) 2023/2854 Articles 23-27
and applies to all customers processing data subject to EU law.
```

#### Art. 25 — Equivalent Functionality During Transition

During a customer's 30-day switching window:
- All features remain available
- No throttling or service degradation
- Export API remains fully functional

**Current implementation:** No throttling mechanisms exist — compliant by design.

### Chapter II (Articles 4–6) — IoT Data Access (Not Applicable)

Datacendia does not manufacture IoT products — Chapter II obligations do not apply.

### Customer Communication Template

Send to EU enterprise customers on request:

```
DATA ACT COMPLIANCE NOTICE

Datacendia, LLC complies with Regulation (EU) 2023/2854 (EU Data Act) for 
cloud service switching and data portability as follows:

SWITCHING RIGHTS
You may switch to a different cloud service provider at any time. To initiate:
1. Download all your organisation data: GET /api/v1/privacy/org-export
2. Notify us at support@datacendia.com of your intent to switch
3. Your data export will remain available for 30 days
4. We will cooperate with your new provider for technical migration

PORTABILITY
All your data is available in JSON format via the org-export endpoint.
The export includes: organisation metadata, team members, deliberations,
agent configurations, audit logs, and API key listings.

FEES
No fee is charged for data export or switching assistance.
Reduced switching fees apply until September 2027 per Art. 26 transition.
Contact privacy@datacendia.com for Data Act compliance documentation.
```

---

## Part 2 — EU AI Liability Directive (Proposed)

### Overview

- **Status:** European Commission proposal (September 2022); still under legislative negotiation as of April 2026
- **Expected adoption:** 2026–2027 (delayed; trilogue ongoing)
- **Purpose:** Civil liability rules for AI-caused damage — COMPLEMENTS EU AI Act (which is regulatory/administrative)
- **Scope:** AI-related tort claims in EU courts

### Key Provisions of the Proposal

#### Article 4 — Rebuttable Presumption of Fault

When a claimant can show:
1. The defendant did not comply with a duty of care (e.g., EU AI Act obligations), AND
2. The AI output caused the damage

→ The court **presumes** the non-compliance caused the damage.

**Impact:** Non-compliance with EU AI Act is now automatically linked to civil liability.

#### Article 3 — Disclosure of Evidence

Courts can order AI providers to disclose documentation, training data, and logs relevant to the AI system that caused damage.

**Impact:** Audit logs and AI deliberation outputs MUST be retained and producible in court.

### Risk Assessment for Datacendia

| Risk Scenario | Likelihood | Financial Exposure |
|---|---|---|
| Customer uses Datacendia AI for consequential decision; decision causes harm | Medium | Depends on AI Act compliance |
| Third party harmed by customer's use of Datacendia AI | Low | Indemnification via ToS |
| Datacendia AI misclassifies a medical condition (if healthcare use) | Low | High if HIPAA + AI Liability Directive both apply |
| Bias in hiring recommendation causes employment discrimination | Medium | Class action risk; LL 144 + AI Liability |

### Contractual Liability Limitation

Add to Terms of Service and customer contracts:

```
AI LIABILITY AND INDEMNIFICATION (EU AI Liability Directive — Pending)

1. DEPLOYER CLASSIFICATION
Customer acknowledges that it acts as a "deployer" of AI systems provided by
Datacendia. As deployer, Customer is responsible under:
(a) EU AI Act Article 26 for ensuring appropriate use within Customer's context;
(b) The proposed EU AI Liability Directive for consequential decisions made using
    Datacendia's AI outputs.

2. LIMITATION OF DATACENDIA LIABILITY FOR AI OUTPUTS
Datacendia's AI outputs are advisory in nature and do not constitute final
decisions. All AI-assisted decisions remain subject to human review by Customer.
Datacendia's liability for AI-related claims is limited to direct damages not
exceeding 12 months of fees paid by Customer.

3. AI ACT COMPLIANCE EVIDENCE
Datacendia maintains and provides upon request:
(a) Technical documentation per EU AI Act Article 11
(b) Bias and accuracy testing results
(c) Human oversight mechanisms (POST /api/v1/privacy/appeal-ai-decision)
(d) Audit logs for all AI-assisted decisions (7-year retention)
This documentation supports Customer's due diligence defence.

4. INDEMNIFICATION
Customer indemnifies Datacendia against third-party claims arising from
Customer's deployment of Datacendia AI for purposes not contemplated in
documentation, without required disclosures (e.g., LL 144, SB 205, IL AIVIA),
or in violation of applicable AI laws.
```

### Evidence Preservation for AI Liability

The EU AI Liability Directive's disclosure obligation requires:

| Evidence Type | Location | Retention | Status |
|---|---|---|---|
| AI deliberation inputs and outputs | `deliberations` table | 7 years | ✅ |
| Audit logs of all AI decisions | `audit_logs` | 7 years | ✅ |
| AI regulatory classification results | `audit_logs` (ai.regulatory_classified events) | 7 years | ✅ |
| Bias testing results | `docs/compliance/bias-testing/` | Indefinite | 📋 Create |
| Training data documentation | OpenAI model cards + Datacendia prompt documentation | Indefinite | 📋 Create |
| Human review records (appeals) | `audit_logs` (ai.regulatory_blocked events) | 7 years | ✅ |

### Professional Liability Insurance

When AI Liability Directive is adopted:
- Review existing cyber liability policy for AI coverage
- Specifically ask insurer: does policy cover "AI liability" per EU AI Liability Directive?
- Consider AI-specific riders: Willis Towers Watson AI Liability, Marsh AI Policy
- Recommended coverage: €5M minimum for enterprise AI deployments

---

## Action Summary

| Action | Regulation | Owner | Target |
|---|---|---|---|
| Enhance org-export to include deliberations + agent configs | EU Data Act Art. 23 | Engineering | **May 2026** |
| Add Data Act switching notice to Terms of Service | EU Data Act Art. 24 | Legal | Q2 2026 |
| Add AI liability limitation clauses to ToS and contracts | EU AI Liability Directive | Legal | Q2 2026 |
| Create security.txt vulnerability disclosure | NYDFS 500 | Engineering | May 2026 |
| Bias testing results documentation folder | EU AI Liability / CO SB 205 | Engineering | Q3 2026 |
| AI training data documentation | EU AI Liability / EU AI Act | Engineering | Q3 2026 |
| Professional liability insurance AI coverage review | EU AI Liability Directive | CEO | Q3 2026 |
| Monitor EU AI Liability Directive trilogue | EU AI Liability Directive | Legal | Quarterly |
