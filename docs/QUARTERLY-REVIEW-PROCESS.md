# Quarterly Evidence & Trust Review Process

**Owner:** Engineering + Marketing  
**Cadence:** First week of January, April, July, October  
**Last Updated:** March 2026

## Purpose

Ensure all public-facing claims, trust artifacts, and documentation remain accurate, current, and verifiable across all 4 Datacendia repositories. Prevent claim-to-code drift that undermines credibility.

## Review Scope

| Repo | What to Review |
|------|---------------|
| **datacendia-marketing** | Trust center, llms.txt, pricing pages, README, SBOM, conformance PDFs |
| **datacendia-core** | SECURITY.md, README counts, trust-facts.json, ARCHITECTURE.md |
| **datacendia-components** | Enterprise inventory, tier-feature matrix, COMMUNITY.md, seed data labels |
| **decision-governance-infrastructure** | Traceability matrix, document status labels, framework version |

## Quarterly Checklist

### Week 1: Automated Scans

```bash
# 1. Regenerate trust facts from core codebase
cd datacendia-core
node scripts/generate-trust-facts.cjs
# Compare docs/TRUST-FACTS.json against previous quarter

# 2. Regenerate enterprise inventory
cd datacendia-components
node scripts/generate-enterprise-inventory.cjs
# Compare docs/ENTERPRISE-INVENTORY.json against previous quarter

# 3. Regenerate tier-feature matrix
node scripts/generate-tier-matrix.cjs
# Compare docs/TIER-FEATURE-MATRIX.md against pricing.html

# 4. Regenerate marketing content manifest
cd datacendia-marketing
node scripts/generate-content-manifest.js
# Review docs/content-manifest.json for drift/missing locales

# 5. Run marketing site audit
node scripts/test-site.js
```

### Week 1: Manual Reviews

#### A. Claim Registry Review

Open `datacendia-marketing/docs/CLAIM-REGISTRY.md` and for each claim:

- [ ] **CLM-001–014** (Marketing): Verify claim text matches current state
- [ ] **CLM-100–106** (Core): Run evidence commands, update verification dates
- [ ] **CLM-200–202** (Components): Verify inventory/boundary enforcement
- [ ] **CLM-300–303** (DGI): Verify traceability matrix, document status

For each claim, update:
- `Last verified` date
- `Status` (✅ Verified / ⚠️ Stale / ❌ Unverified)

#### B. Trust Center Review

- [ ] Test count matches `npm test` output
- [ ] Agent count is consistent across trust.html, llms.txt, index.html
- [ ] Language count is consistent across all surfaces
- [ ] Compliance roadmap dates are current (not past-due without update)
- [ ] Conformance statement PDFs still accurately describe architecture
- [ ] Penetration testing status is current
- [ ] SBOM component list matches actual platform dependencies

#### C. Security Review

- [ ] `SECURITY.md` auth modes table matches actual code behavior
- [ ] Token threat model mitigations are still accurate
- [ ] Tenant isolation model matches current implementation
- [ ] No new `devAuth` routes added without env guards
- [ ] Production compose files use `REQUIRE_AUTH=true`

#### D. Framework Review

- [ ] Traceability matrix file paths are still valid
- [ ] Primitive implementation status (Implemented/Partial/Conceptual) is accurate
- [ ] Document status labels in DGI docs are current
- [ ] No new superseded documents created without INDEX.md update

#### E. Pricing & Feature Review

- [ ] Tier-feature matrix matches `SubscriptionTiers.ts`
- [ ] Marketing pricing page matches code tier definitions
- [ ] No features marketed at a tier where they're flagged `false` in code

### Week 2: Remediation

- Fix any claims found to be stale or inaccurate
- Update all `Last verified` dates in claim registry
- Run `node scripts/sync-homepage-metrics.js` if marketing metrics changed
- Commit all updates with message: `chore: Q[N] 2026 quarterly evidence review`

## Review Owners

| Area | Primary Owner | Backup |
|------|--------------|--------|
| Trust center & marketing claims | Marketing | Engineering |
| Core security & auth | Engineering | Security |
| Enterprise features & tiers | Engineering | Product |
| DGI framework & traceability | Standards | Engineering |
| SBOM & supply chain | Engineering | Security |
| Compliance roadmap dates | Compliance | Engineering |

## Output Artifacts

After each quarterly review, produce:

1. **Updated `CLAIM-REGISTRY.md`** with new verification dates
2. **Regenerated `TRUST-FACTS.json`** committed to datacendia-core
3. **Regenerated `ENTERPRISE-INVENTORY.md`** committed to datacendia-components
4. **Review summary** added to this document's history section below

## Review History

| Quarter | Date | Reviewer | Findings | Commit |
|---------|------|----------|----------|--------|
| Q1 2026 | March 2026 | Initial setup | Baseline created; 32 claims registered | Multiple commits across 4 repos |

---

*This process is the enforcement mechanism for the [Claim Governance Process](../../datacendia-marketing/docs/CLAIM-GOVERNANCE.md) and [Product Maturity Taxonomy](MATURITY-TAXONOMY.md).*
