# Incident Response Policy
**Datacendia, LLC**
**Version:** 2.0 | **Effective:** April 2026 | **Owner:** Security Lead
**Frameworks:** GDPR Art. 33/34 · UK GDPR · HIPAA BNR · FTC HBNR · CCPA · SEC Rule 17 CFR §229.106 · NYDFS §500.17 · Nigeria NDPA §40 · Philippines DPA · Australia NDB · Japan APPI · Singapore PDPA
**Review Cadence:** Annual + after each P0/P1 incident

---

## 1. Purpose

Define clear procedures for detecting, containing, eradicating, recovering from, and learning from security incidents to minimise business impact and meet SOC 2 CC7.3–CC7.5 requirements.

---

## 2. Incident Classification

| Priority | Severity | Description | Response SLA | Notification |
|---|---|---|---|---|
| **P0** | Critical | Data breach, ransomware, unauthorized DB access, credential compromise, complete service outage | **1 hour** detect → contain | CEO, affected customers within 72 hours (GDPR), authorities if required |
| **P1** | High | Authentication bypass, privilege escalation, partial data exposure, >30 min service degradation | **4 hours** | Engineering Lead, CEO |
| **P2** | Medium | Brute-force attempts (mitigated), anomalous access patterns, third-party compromise | **24 hours** | Security Lead |
| **P3** | Low | Policy violations, isolated failed attacks, informational alerts | **72 hours** | Team log entry |

---

## 3. Incident Response Team

| Role | Responsibility |
|---|---|
| **Incident Commander (IC)** | Overall coordination, external communication, escalation decisions |
| **Security Lead** | Technical investigation, containment, forensics |
| **Engineering Lead** | System remediation, code fixes, deployment |
| **Communications Lead** | Customer notifications, PR, regulatory filings |

---

## 4. Response Phases

### Phase 1 — Identification
- Monitor `audit_logs` table for anomaly patterns
- Review `security_audit_logs` and Railway platform logs
- Alert sources: Sentry error tracking, `threatDetectionMiddleware` alerts, anomaly detection
- **Declare incident** if suspicious activity cannot be ruled benign within 15 minutes

### Phase 2 — Containment

**Short-term (< 1 hour):**
- For credential compromise: invalidate all active sessions via Redis blacklist flush
  ```sql
  -- Revoke all sessions for compromised user
  UPDATE sessions SET expires_at = NOW() WHERE user_id = '<id>';
  -- Redis: del all blacklist:* and session:* keys for the user
  ```
- For API key compromise: revoke via `api_keys.revoked_at = NOW()`
- For infrastructure breach: redeploy from clean state via Railway

**Long-term (< 24 hours):**
- Rotate all secrets: `JWT_SECRET`, `MFA_ENCRYPTION_KEY`, `DATABASE_URL` (create new credentials)
- Force password reset for affected accounts
- Enable enhanced audit logging

### Phase 3 — Eradication
- Identify root cause (code flaw, misconfiguration, compromised credential)
- Remove malicious code or backdoors
- Patch exploited vulnerability
- Verify no persistence mechanisms remain

### Phase 4 — Recovery
- Restore from verified clean backup (see `docs/policies/backup-recovery-policy.md`)
- Gradually restore services with enhanced monitoring
- Verify system integrity before full restoration
- Monitor closely for 48 hours post-recovery

### Phase 5 — Lessons Learned
- Post-incident review within **5 business days**
- Document: timeline, root cause, actions taken, improvements
- Update runbooks and detection rules
- File with Security Lead for audit evidence

---

## 5. Multi-Framework Regulatory Notification Matrix

> **Use `IncidentMaterialityService.assess()` to auto-generate the full notification plan and draft notices for any incident.**
> Located at: `backend/src/services/compliance/IncidentMaterialityService.ts`

### 5a. Regulator Notification Deadlines

| Framework | Regulator | Deadline | Threshold | How to Notify |
|---|---|---|---|---|
| **GDPR Art. 33** | Lead EU Supervisory Authority (DPA of main EU establishment) | **72 hours** from discovery | Any personal data breach | Online portal of lead EU DPA; edpb.europa.eu for contacts |
| **UK GDPR** | Information Commissioner's Office (ICO) | **72 hours** from discovery | Any personal data breach | ico.org.uk/make-a-complaint/data-security-and-personal-data-breach-reports/ |
| **HIPAA BNR** | HHS Office for Civil Rights (OCR) | **60 days** from discovery | Any PHI breach | HHS OCR portal: ocrportal.hhs.gov; OCRMail@hhs.gov |
| **FTC HBNR 2024** | Federal Trade Commission | **60 days** from discovery | Any health data breach (non-HIPAA apps) | ftc.gov/hbn (online form); hbn@ftc.gov |
| **CCPA §1798.82** | California Attorney General | **45 days** (expedient) | > 500 CA residents | oag.ca.gov/privacy/databreach/reporting |
| **SEC Rule** | Securities and Exchange Commission | **4 business days** (material only) | Material incident (public companies only) | Form 8-K Item 1.05 via SEC EDGAR |
| **NYDFS §500.17** | NY Dept. of Financial Services | **72 hours** from discovery | Any cybersecurity event | myportal.dfs.ny.gov; cybersecurity@dfs.ny.gov |
| **Australia NDB** | OAIC | **72 hours** from discovery | Likely serious harm | oaic.gov.au; enquiries@oaic.gov.au |
| **Nigeria NDPA §40** | Nigeria Data Protection Commission (NDPC) | **72 hours** from discovery | Any personal data breach | ndpc.gov.ng; info@ndpc.gov.ng |
| **Philippines DPA** | National Privacy Commission (NPC) | **72 hours** for sensitive PI; 5 days others | Sensitive personal information | privacy.gov.ph; complaints@privacy.gov.ph |
| **Singapore PDPA** | Personal Data Protection Commission (PDPC) | **3 calendar days** | > 500 affected OR significant harm | pdpc.gov.sg; pdpc_info@pdpc.gov.sg |
| **Japan APPI** | Personal Information Protection Commission (PPC) | **3–5 days** (preliminary) | Sensitive PI or > 1,000 affected | ppc.go.jp/en/ |
| **South Africa POPIA** | Information Regulator | **72 hours** | Any personal information breach | inforeg@justice.gov.za |
| **Brazil LGPD** | ANPD | **72 hours** | Any personal data breach | gov.br/anpd/pt-br |

### 5b. Individual Notification Deadlines

| Framework | Deadline | Method |
|---|---|---|
| GDPR Art. 34 | Without undue delay (high risk cases) | Email + in-app |
| UK GDPR | Without undue delay | Email + in-app |
| HIPAA | 60 days from discovery | First-class mail or email |
| FTC HBNR | 60 days from discovery | First-class mail or email |
| CCPA §1798.82 | Expedient / without unreasonable delay | Plain-language notice |
| Australia NDB | As soon as practicable after OAIC notified | Email or letter |
| Nigeria NDPA | Without undue delay (high risk) | Email or letter |

### 5c. Customer (Processor → Controller) Notification

| Scenario | Timeline | Method |
|---|---|---|
| Personal data breach affecting customer data | **72 hours** from discovery | Email to customer DPO/security contact |
| Service outage > 1 hour | 24 hours | Email + status page |
| Security advisory (no data exposure) | Within 30 days | Email + release notes |
| NYDFS-regulated customer | **72 hours** (per DPA / NYDFS addendum) | Written notification to customer CISO |

### 5d. FTC Health Breach Notification Rule (16 CFR Part 318)

Triggered when health data in a non-HIPAA Personal Health Record ecosystem is breached.

**Assessment:** Run `IncidentMaterialityService.assess()` with `dataCategories: ['health_phi']`. If FTC HBNR applies and customer does NOT have a HIPAA BAA:
1. **Within 10 days:** Notify consumer reporting agencies if > 500 affected across multiple states
2. **Within 60 days:** Notify FTC at ftc.gov/hbn
3. **Within 60 days:** Notify all affected individuals (first-class mail or email)
4. **Within 60 days:** Prominent media notice in affected states if > 500 in one state

### 5e. SEC Materiality Assessment

For any P0 incident: run `IncidentMaterialityService.assess()` with `isPublicCompany: false` (current state). If Datacendia is ever public OR incident affects a public company customer:
- Securities counsel engaged within 2 hours
- Form 8-K Item 1.05 filed within **4 business days** of materiality determination
- Preservation hold on all incident documentation

---

## 6. Evidence Preservation

All evidence must be preserved for forensic investigation:
- Export relevant `audit_logs` rows to immutable storage
- Capture Railway deployment logs
- Screenshot anomalous Redis states before flushing
- Preserve original log timestamps — never modify audit records

---

## 7. Key Contacts

### Internal

| Contact | Role | Channel |
|---|---|---|
| Security Lead | First responder | Slack #security-incidents |
| Engineering Lead | Technical remediation | Slack #engineering |
| CEO / Incident Commander | Escalation, external comms | Direct / Phone |
| Legal Counsel | Regulatory notifications, privilege | External — [counsel email] |
| Cyber Insurance Carrier | Incident notification obligation | Policy no. [XXXX] |

### Infrastructure Vendors

| Vendor | Contact | Reason |
|---|---|---|
| Railway | railway.com/support | Application hosting |
| Neon | neon.tech/support | Database |
| Upstash | upstash.com/support | Redis cache |
| SendGrid | support.sendgrid.com | Email delivery |
| OpenAI | help.openai.com | AI inference |

### Regulatory Contacts (Breach Notification)

| Regulator | Contact | Deadline |
|---|---|---|
| EU Lead DPA | per EDPB map: edpb.europa.eu | 72 hours |
| UK ICO | casework@ico.org.uk | 72 hours |
| HHS OCR (HIPAA) | OCRMail@hhs.gov · ocrportal.hhs.gov | 60 days |
| FTC (HBNR) | hbn@ftc.gov · ftc.gov/hbn | 60 days |
| California AG (CCPA) | oag.ca.gov/privacy/databreach/reporting | 45 days |
| NY DFS (NYDFS §500) | cybersecurity@dfs.ny.gov · myportal.dfs.ny.gov | 72 hours |
| OAIC Australia (NDB) | enquiries@oaic.gov.au | 72 hours |
| NDPC Nigeria | info@ndpc.gov.ng · ndpc.gov.ng | 72 hours |
| NPC Philippines | complaints@privacy.gov.ph | 72 hours |
| PDPC Singapore | pdpc_info@pdpc.gov.sg | 3 days |
| PPC Japan | via ppc.go.jp/en/ | 3–5 days |
| SA Information Regulator | inforeg@justice.gov.za | 72 hours |
| ANPD Brazil | via gov.br/anpd/pt-br | 72 hours |

---

## 8. Test Exercises

- **Quarterly:** Tabletop exercise simulating P1 scenario
- **Annually:** Full IR drill including simulated breach, containment, and recovery
- Results documented and retained as SOC 2 evidence

---

## 9. Review and Approval

| Role | Name | Date |
|---|---|---|
| Security Lead | ___________________ | April 2026 |
| CEO | ___________________ | April 2026 |
