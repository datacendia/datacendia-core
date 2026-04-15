# Business Continuity & Disaster Recovery Policy
**Datacendia, LLC**
**Version:** 1.0 | **Effective:** April 2026 | **Owner:** Engineering Lead + CEO
**Review Cadence:** Annual + after any DR activation
**SOC 2 Criteria:** A1.2, A1.3, CC7.5

---

## 1. Purpose

Ensure Datacendia can maintain or rapidly restore essential services following a disruptive event, meeting contractual and regulatory obligations to customers.

---

## 2. Recovery Objectives

| Tier | Services | RPO | RTO | Priority |
|---|---|---|---|---|
| **Tier 1 — Critical** | Authentication, deliberation API, audit logging | 1 hour | 4 hours | Highest |
| **Tier 2 — Important** | Reporting, search, notifications | 24 hours | 8 hours | High |
| **Tier 3 — Standard** | Analytics, AI inference, integrations | 24 hours | 24 hours | Medium |

---

## 3. Business Impact Analysis

| Scenario | Probability | Impact | Mitigation |
|---|---|---|---|
| Railway regional outage | Low | High | Railway multi-region or Fly.io failover |
| Neon database unavailability | Low | Critical | PITR restore to new branch; read replica |
| Redis failure | Medium | Medium | Fail-open mode; in-memory fallback |
| DDoS attack | Medium | High | Railway edge network; rate limiting |
| Data breach / ransomware | Low | Critical | Incident response + backup restore |
| DNS failure | Low | High | Namecheap → secondary registrar failover |
| SendGrid email failure | Medium | Low | SMTP fallback in `email.ts` |
| Developer credential compromise | Low | Critical | Immediate revocation; secret rotation |

---

## 4. Architecture Resilience

### 4.1 Application Layer
- Deployed on **Railway** (cloud-native, auto-restart on crash)
- Health checks at `/health`, `/liveness`, `/readiness`
- Zero-downtime deployments via Railway CD from `production` branch
- Automatic restarts on crash (Railway process management)

### 4.2 Database Layer
- **Primary:** Neon PostgreSQL with continuous WAL archiving (7-day PITR)
- **Secondary:** Daily `pg_dump` exports encrypted and uploaded to S3 storage
- Connection pooling via Prisma (handles transient connection drops)

### 4.3 Cache Layer
- Redis (Upstash or Railway Redis add-on)
- Application fails open if Redis is unavailable (rate limiter, session cache)
- No critical data stored only in Redis — all durable data is in PostgreSQL

### 4.4 Infrastructure as Code
- `Dockerfile.allinone`, `railway.json` in Git — full environment can be redeployed from scratch
- All environment variables documented (secrets in Railway dashboard only)

---

## 5. Continuity Plan by Scenario

### Scenario A — Railway Service Outage
1. Railway status page confirms outage
2. Communicate via status page / email to customers
3. If outage > 2 hours: initiate failover to secondary platform
   - Build Docker image locally: `docker build -f Dockerfile.allinone .`
   - Deploy to Fly.io or alternate provider using same `DATABASE_URL`
4. Update DNS CNAME from `xj2uqt7t.up.railway.app` to new service URL (TTL: 300s)
5. Verify `/health` on new deployment
6. Notify customers when service is restored

### Scenario B — Database Corruption / Accidental Deletion
1. Determine scope: which tables, which time window
2. **Neon PITR restore** (preferred — no data loss beyond WAL flush interval):
   - Neon console → Restore → select timestamp just before incident
   - Creates a new branch; update `DATABASE_URL` in Railway
3. If PITR unavailable: restore from latest `pg_dump` export
4. Run `npx prisma migrate deploy` to ensure schema is current
5. Verify data integrity (row counts, spot checks)
6. Document: RTO achieved, RPO achieved, root cause

### Scenario C — Complete Infrastructure Loss (Worst Case)
1. Stand up new Railway project from scratch (estimated: 30 min)
2. Set all environment variables from secure runbook
3. Deploy from `production` branch — Railway builds from `Dockerfile.allinone`
4. Restore database from latest `pg_dump` backup (estimated: 1–2 hours depending on size)
5. Update DNS records at Namecheap (TTL 300s → effective within 5 min)
6. Verify full functionality via smoke test checklist
7. **Estimated total RTO: 2–4 hours** ✓

### Scenario D — Key Person Unavailability
- All infrastructure credentials stored in **shared password manager** accessible to CEO + backup contact
- Deployment instructions documented in `.windsurf/workflows/railway-deploy.md`
- Recovery procedures in this document are sufficient for a second engineer to restore service

---

## 6. Communication Plan

| Audience | Channel | Timing |
|---|---|---|
| Internal team | Slack #incidents | Immediately on incident declaration |
| Affected customers (Tier 1) | Email from sales@datacendia.com | Within 1 hour of P0/P1 |
| All customers (extended outage) | Status page + email | If RTO > 2 hours |
| Regulators (data breach) | Written notification | Within 72 hours (GDPR Art. 33) |

---

## 7. Testing & Exercises

| Test | Frequency | Owner |
|---|---|---|
| Neon PITR restore test | Monthly | Engineering Lead |
| pg_dump restore drill | Quarterly | Engineering Lead |
| Full DR simulation (Scenario A or B) | Annually | Engineering Lead + CEO |
| Access revocation drill | Annually | Engineering Lead |
| Communication plan walkthrough | Annually | CEO |

Results logged to `docs/evidence/dr-tests/` as SOC 2 evidence.

---

## 8. Key Resources

| Resource | Location |
|---|---|
| Railway dashboard | railway.com/project/happy-reverence |
| Neon console | console.neon.tech |
| Namecheap DNS | namecheap.com → Domains → datacendia.com |
| SendGrid | app.sendgrid.com |
| Deployment workflow | `.windsurf/workflows/railway-deploy.md` |
| Backup recovery steps | `docs/policies/backup-recovery-policy.md` |
| Incident response steps | `docs/policies/incident-response-policy.md` |

---

## 9. Review and Approval

| Role | Name | Date |
|---|---|---|
| Engineering Lead | ___________________ | April 2026 |
| CEO | ___________________ | April 2026 |
