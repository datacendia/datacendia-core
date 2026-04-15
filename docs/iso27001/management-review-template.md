# Information Security Management System — Management Review
**ISO 27001:2022 Clause 9.3 | SOC 2 CC1.2**
**Datacendia, LLC**

> **Frequency:** Minimum annually; recommended semi-annually during SOC 2 observation period
> **Attendees required:** CEO, Engineering Lead (minimum); DPO/Privacy Officer recommended
> **Retention:** 7 years (SOC 2 evidence + ISO 27001 audit evidence)

---

## Meeting Record — [QUARTER/YEAR]

| Field | Value |
|---|---|
| **Review Date** | _[e.g., 15 October 2026]_ |
| **Location / Format** | _[e.g., Video call / In-person — [location]]_ |
| **Facilitator** | _[Name, Role]_ |
| **Attendees** | _[Name — Role; Name — Role]_ |
| **Previous Review Date** | _[Date of last review]_ |
| **Document Reference** | MGT-REVIEW-[YYYY]-[NN] |

---

## AGENDA AND REVIEW ITEMS

### 1. Status of Actions from Previous Review

| Action | Owner | Due Date | Status | Notes |
|---|---|---|---|---|
| _[Previous action item]_ | _[Owner]_ | _[Date]_ | ✅ Complete / 🔴 Overdue / 🟡 In progress | _[Notes]_ |
| _[Previous action item]_ | _[Owner]_ | _[Date]_ | _[Status]_ | _[Notes]_ |

---

### 2. Changes in External and Internal Issues (ISO 27001 §4.1)

> Review any changes since the last management review that affect information security:

**External changes:**
```
[Record any changes: new regulations, market conditions, threat landscape, 
 competitor incidents, new data protection laws, etc.]

Examples:
- Canada CPPA watch-listed — monitor for royal assent
- OpenAI data processing terms updated March 2026 — reviewed and acceptable
- NYDFS Part 500 amendment effective date passed — compliance confirmed
```

**Internal changes:**
```
[Record any internal changes: new hires, system changes, new subprocessors, 
 office location changes, business model changes, etc.]

Examples:
- Engineering team grew from 2 to 4 — access review completed
- New subprocessor (Upstash Redis) added — DPA signed, added to ROPA
- Pivoted to enterprise SaaS — HIPAA BAA programme initiated
```

---

### 3. Information Security Performance (ISO 27001 §9.1)

#### 3a. Security Incidents and Near-Misses

| Incident | Date | Severity | Resolution | Lessons Learned |
|---|---|---|---|---|
| _[Incident description or "None"]_ | _[Date]_ | _[P0-P3]_ | _[Resolved/Ongoing]_ | _[Notes]_ |

**P0/P1 count (period):** ___
**P2 count (period):** ___
**P3 count (period):** ___
**Open incidents:** ___

#### 3b. Audit Log and Access Review

| Metric | Value | Target | Status |
|---|---|---|---|
| Access reviews completed | _[N]_ | Quarterly | _[On track / Behind]_ |
| Users with excessive permissions found | _[N]_ | 0 | _[Status]_ |
| Failed MFA events (unusual) | _[N]_ | < 10/month | _[Status]_ |
| Audit log integrity check | _[Pass/Fail]_ | Pass | _[Status]_ |
| API key review completed | _[Y/N]_ | Quarterly | _[Status]_ |

#### 3c. Vulnerability Management

| Metric | Value | Target | Status |
|---|---|---|---|
| npm audit critical CVEs open | _[N]_ | 0 | _[Status]_ |
| npm audit high CVEs open | _[N]_ | < 3 | _[Status]_ |
| Penetration test (last date) | _[Date]_ | Annual | _[Status]_ |
| Dependabot alerts resolved | _[N resolved / N open]_ | All criticals resolved | _[Status]_ |

#### 3d. Backup and Recovery

| Metric | Value | Target | Status |
|---|---|---|---|
| Last backup restore test | _[Date]_ | Bi-annual | _[Status]_ |
| Backup restore succeeded | _[Y/N]_ | Y | _[Status]_ |
| PITR tested to target RPO | _[Y/N]_ | Y | _[Status]_ |

---

### 4. Risk Assessment Review (ISO 27001 §6.1, §8.2)

#### 4a. Risk Register Review

| Risk ID | Risk | Previous Score | Current Score | Change | Notes |
|---|---|---|---|---|---|
| _[from risk register]_ | _[Risk]_ | _[Score]_ | _[Score]_ | ↑ / ↓ / → | _[Notes]_ |

**New risks identified this period:**
```
[Document any new risks added to the risk register]
```

**Risks exceeding risk appetite (score ≥ 12):**
```
[List any unacceptable risks and the planned treatment]
```

#### 4b. Risk Treatment Status

| Risk | Treatment | Owner | Status |
|---|---|---|---|
| _[Risk]_ | _[Accept / Mitigate / Transfer / Avoid]_ | _[Owner]_ | _[Status]_ |

---

### 5. Security Objectives Progress (ISO 27001 §6.2)

Review progress against the security objectives set in the previous review:

| Objective | Target | Actual | Status |
|---|---|---|---|
| ISO 27001 certification | Q1 2027 | _[Current status]_ | _[On track / At risk]_ |
| SOC 2 Type II observation start | Nov 1, 2026 | _[Status]_ | _[On track / At risk]_ |
| Employee security training | Sep 2026 | _[Status]_ | _[On track / At risk]_ |
| Annual pen test | Q4 2026 | _[Status]_ | _[On track / At risk]_ |
| DPA signing (all 5 subprocessors) | May 2026 | _[Status]_ | _[Complete / Incomplete]_ |
| _[Other objective]_ | _[Target]_ | _[Actual]_ | _[Status]_ |

---

### 6. Supplier and Third-Party Performance (ISO 27001 §A.5.22)

| Supplier | Last Review Date | SOC 2 / Cert Obtained | Issues | Action |
|---|---|---|---|---|
| Neon (database) | _[Date]_ | SOC 2 Type II | _[None / Issues]_ | _[Action]_ |
| OpenAI | _[Date]_ | _[Cert]_ | _[None / Issues]_ | _[Action]_ |
| Railway | _[Date]_ | SOC 2 Type II | _[None / Issues]_ | _[Action]_ |
| Upstash | _[Date]_ | SOC 2 Type II | _[None / Issues]_ | _[Action]_ |
| SendGrid (Twilio) | _[Date]_ | SOC 2 Type II | _[None / Issues]_ | _[Action]_ |

---

### 7. Compliance Status Review

| Regulation | Status | Action Required |
|---|---|---|
| GDPR / UK GDPR | _[Summary]_ | _[Action]_ |
| HIPAA BAA programme | _[Summary]_ | _[Action]_ |
| ISO 27001 audit readiness | _[Summary]_ | _[Action]_ |
| SOC 2 evidence collection | _[Summary]_ | _[Action]_ |
| State AI laws (CO/NYC/IL) | _[Summary]_ | _[Action]_ |
| NYDFS 500 | _[Summary]_ | _[Action]_ |

---

### 8. Resources Required (ISO 27001 §7.1)

```
[Document any additional resources, budget, or headcount needed for information security]

Examples:
- External pen tester budget: ~$8,000 (Q4 2026)
- ISO 27001 certification body fee: ~$5,000–$15,000
- Security training platform: $500/year
```

---

### 9. Opportunities for Improvement (ISO 27001 §10.1)

```
[Document any opportunities to improve the ISMS — not just problems, but positive improvements]

Examples:
- Implement automated compliance monitoring dashboard
- Add SIEM capability (currently using audit_logs; consider Datadog/Grafana)
- Expand API security testing to include fuzzing
```

---

### 10. Actions Arising from This Review

| # | Action | Owner | Due Date | Priority |
|---|---|---|---|---|
| 1 | _[Action]_ | _[Owner]_ | _[Date]_ | High / Medium / Low |
| 2 | _[Action]_ | _[Owner]_ | _[Date]_ | _[Priority]_ |
| 3 | _[Action]_ | _[Owner]_ | _[Date]_ | _[Priority]_ |

---

## CONCLUSIONS

**Overall ISMS health:** ☐ Good ☐ Acceptable ☐ Requires improvement ☐ Critical action needed

**Summary:**
```
[Brief narrative summary of the overall information security posture, 
 key achievements since last review, and priorities for next period]
```

---

## SIGN-OFF

| Role | Name | Signature | Date |
|---|---|---|---|
| CEO (Management Representative) | _____________ | _____________ | _____________ |
| Engineering Lead (ISMS Owner) | _____________ | _____________ | _____________ |
| DPO (if appointed) | _____________ | _____________ | _____________ |

**Next Review Date:** _____________

---

*File as: `docs/iso27001/management-reviews/MGT-REVIEW-[YYYY]-[NN]-[quarter].md`*
*Retain 7 years. Share with ISO 27001 auditor and SOC 2 auditor on request.*
