# Backup & Disaster Recovery Policy
**Datacendia, LLC**
**Version:** 1.0 | **Effective:** April 2026 | **Owner:** Engineering Lead
**Review Cadence:** Annual + after any recovery event
**SOC 2 Criteria:** A1.2, A1.3

---

## 1. Recovery Objectives

| Metric | Target | Notes |
|---|---|---|
| **RPO** (Recovery Point Objective) | ≤ 24 hours | Maximum tolerable data loss |
| **RTO** (Recovery Time Objective) | ≤ 4 hours | Maximum tolerable downtime |
| **Backup Frequency** | Continuous (Neon PITR) + Daily pg_dump | |
| **Retention** | 7 days PITR, 90 days daily exports | |

---

## 2. Backup Architecture

### 2.1 Primary — Neon Postgres Point-in-Time Recovery (PITR)
- **Provider:** Neon (Railway PostgreSQL add-on or standalone Neon project)
- **Coverage:** Continuous WAL archiving — restores to any point within 7 days
- **Verification:** Monthly restore test to a staging branch
- **Configuration:** Enabled at Neon project level → Settings → Backup

### 2.2 Secondary — pg_dump Daily Export
- **Schedule:** Daily at 02:00 UTC (via `BACKUP_ENABLED=true` env var)
- **Destination:** S3-compatible object storage (R2 / AWS S3 / Backblaze)
- **Format:** `pg_dump --format=custom` (compressed, supports parallel restore)
- **Encryption:** AES-256 using `BACKUP_ENCRYPTION_KEY` env var before upload
- **Retention:** 90 days, then deleted
- **Implemented in:** `backend/src/services/backup/index.ts`

### 2.3 Configuration Backup
- All infrastructure-as-code stored in Git (`railway.json`, `Dockerfile.allinone`)
- Environment variables documented in `docs/runbooks/env-vars.md` (no secrets in docs)
- Secrets stored in Railway environment (not in Git)

---

## 3. Required Environment Variables

| Variable | Description | Required For |
|---|---|---|
| `BACKUP_ENABLED` | Set `true` to activate daily exports | Secondary backup |
| `BACKUP_S3_BUCKET` | S3/R2 bucket name | Secondary backup |
| `BACKUP_S3_ENDPOINT` | Endpoint URL (for R2/Backblaze) | Secondary backup |
| `BACKUP_S3_ACCESS_KEY` | Access key ID | Secondary backup |
| `BACKUP_S3_SECRET_KEY` | Secret access key | Secondary backup |
| `BACKUP_ENCRYPTION_KEY` | AES-256 key for export encryption | Secondary backup |
| `DATABASE_URL` | Postgres connection string | All |

---

## 4. Backup Verification Schedule

| Test | Frequency | Owner | Evidence |
|---|---|---|---|
| Neon PITR restore to staging branch | Monthly | Engineering Lead | Restore log + row count verification |
| pg_dump restore to staging | Quarterly | Engineering Lead | Restore duration + integrity check |
| Full DR drill (prod failover simulation) | Annually | Engineering Lead | Written DR test report |

All test results must be logged in `docs/evidence/backup-tests/YYYY-MM.md` for SOC 2 auditor review.

---

## 5. Recovery Procedures

### 5.1 Neon PITR Recovery
1. Log in to Neon console → Project → Branches
2. Click **Restore** → select target timestamp
3. Neon creates a new branch at that point in time
4. Update `DATABASE_URL` in Railway to point to restored branch
5. Verify application health at `/health` endpoint
6. Promote restored branch to primary once verified
7. Document: date/time of restore, RPO achieved, rows verified

### 5.2 pg_dump Recovery
```bash
# 1. Download and decrypt backup
aws s3 cp s3://$BACKUP_S3_BUCKET/datacendia-$(date +%Y%m%d).dump.enc ./backup.enc
openssl enc -d -aes-256-cbc -in backup.enc -out backup.dump -pass env:BACKUP_ENCRYPTION_KEY

# 2. Restore to target database
pg_restore --clean --if-exists --no-owner \
  --dbname="$TARGET_DATABASE_URL" \
  backup.dump

# 3. Verify row counts
psql $TARGET_DATABASE_URL -c "SELECT count(*) FROM audit_logs;"
psql $TARGET_DATABASE_URL -c "SELECT count(*) FROM users;"
```

### 5.3 Full Infrastructure Recovery
1. Redeploy Railway service from `production` branch (automatic via Railway CD)
2. Verify all env vars are set in Railway dashboard
3. Run `npm run prisma:migrate:deploy` to ensure schema is current
4. Restore database using 5.1 or 5.2 above
5. Verify `/health`, `/liveness`, `/readiness` endpoints return 200
6. Smoke test: login, create deliberation, check audit log

---

## 6. Subprocessor Backup Responsibilities

| Service | Their Backup Commitment | Our Verification |
|---|---|---|
| Neon | 7-day PITR, auto-backups | Check Neon dashboard monthly |
| Railway | Platform-level redundancy | Verify in Railway docs |
| Redis/Upstash | Redis persistence (RDB/AOF) | Verify AOF enabled in config |

We do **not** rely solely on subprocessor backups — we maintain our own secondary exports (see 2.2).

---

## 7. Review and Approval

| Role | Name | Date |
|---|---|---|
| Engineering Lead | ___________________ | April 2026 |
| CEO | ___________________ | April 2026 |
