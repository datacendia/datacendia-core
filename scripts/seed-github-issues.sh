#!/bin/bash
# =============================================================================
# Seed GitHub Issues for datacendia-core
# Run: gh auth login && bash scripts/seed-github-issues.sh
# =============================================================================

REPO="datacendia/datacendia-core"

# Create labels first
gh label create "good first issue" --description "Good for newcomers" --color 7057ff --repo $REPO 2>/dev/null
gh label create "help wanted" --description "Extra attention is needed" --color 008672 --repo $REPO 2>/dev/null
gh label create "documentation" --description "Improvements or additions to documentation" --color 0075ca --repo $REPO 2>/dev/null
gh label create "enhancement" --description "New feature or request" --color a2eeef --repo $REPO 2>/dev/null
gh label create "testing" --description "Testing improvements" --color e4e669 --repo $REPO 2>/dev/null
gh label create "onboarding" --description "Improves first-time user experience" --color c5def5 --repo $REPO 2>/dev/null
gh label create "security" --description "Security-related" --color d73a4a --repo $REPO 2>/dev/null

echo "--- Creating Good First Issues ---"

gh issue create --repo $REPO \
  --title "Add Storybook stories for core UI components" \
  --body "We have 92 reusable React components in \`src/components/\` but zero Storybook stories. Storybook is configured (\`.storybook/\`) but the \`stories/\` directory is empty.

**Goal:** Add stories for the most commonly used components:
- Button, Input, Badge, Card (in \`src/components/ui/\`)
- StatCard, RiskBadge (used across wedge pages)
- Alert, Modal, Toast (in feedback layer)

**How to start:**
\`\`\`bash
npm run storybook
\`\`\`

Each story should show all variants and sizes." \
  --label "good first issue" --label "documentation"

gh issue create --repo $REPO \
  --title "Add unit tests for Council deliberation API routes" \
  --body "The Council deliberation engine is our core feature but has minimal test coverage. Add tests for the key API endpoints:

- \`POST /api/v1/council/deliberations\` — create a new deliberation
- \`GET /api/v1/council/deliberations/:id\` — get deliberation status
- \`GET /api/v1/council/deliberations/:id/transcript\` — get full transcript

**Files:** \`backend/src/routes/council.ts\`, \`backend/src/services/council/CouncilService.ts\`

Use Vitest. Mock the Ollama provider for deterministic results." \
  --label "good first issue" --label "testing"

gh issue create --repo $REPO \
  --title "Document which Ollama models work best for each agent role" \
  --body "Different Council agent roles (Financial Analyst, Legal Counsel, Risk Assessor, etc.) may perform better with different Ollama models.

**Goal:** Test and document model recommendations:
- Which models work at 3B, 8B, 32B, 70B parameter counts
- Quality vs speed tradeoffs per role
- Minimum VRAM requirements for each

Results should go in \`docs/ollama-model-guide.md\` and be linked from the README." \
  --label "good first issue" --label "documentation" --label "help wanted"

gh issue create --repo $REPO \
  --title "Add Docker Hub pre-built images for faster first-run experience" \
  --body "Currently every install requires building from source (\`docker compose build\`), which takes 5-15 minutes. Pre-built images on Docker Hub or GHCR would reduce first-run time to ~30 seconds.

**Scope:**
- Backend API image
- Frontend dev image
- Update \`docker-compose.demo.yml\` to use pre-built images
- CI workflow to build and push on release tags

See Dockerfile and Dockerfile.frontend for existing build configs." \
  --label "good first issue" --label "enhancement" --label "onboarding"

gh issue create --repo $REPO \
  --title "Add E2E tests for demo mode using Playwright" \
  --body "We need E2E tests to verify the demo mode works end-to-end:

1. \`docker compose -f docker-compose.demo.yml up -d\`
2. Navigate to \`http://localhost:5173\`
3. Verify demo login works (sarah.chen@acme.demo)
4. Verify Council dashboard shows 5 pre-seeded deliberations
5. Verify deliberation detail page loads with agent transcripts
6. Verify CendiaVerify page at \`/verify\` is accessible

**Stack:** Playwright + TypeScript. See \`playwright.config.ts\` if it exists, or create one." \
  --label "good first issue" --label "testing"

gh issue create --repo $REPO \
  --title "Fix 9 routes missing organization scoping (cross-tenant risk)" \
  --body "The following routes use dev auth but don't enforce \`organizationId\` on data queries, creating potential cross-tenant data access:

- \`energy.ts\`
- \`fhir.ts\`
- \`financial.ts\`
- \`forecasting.ts\`
- \`healthcare.ts\`
- \`industrial-services.ts\`
- \`insurance.ts\`
- \`mesh.ts\`
- \`rag.ts\`

**Documented in:** \`docs/UNSCOPED-ROUTES.md\`

Each route needs to extract \`organizationId\` from the authenticated user and scope all database queries accordingly." \
  --label "security" --label "help wanted"

gh issue create --repo $REPO \
  --title "Improve PII detection with test suite and accuracy benchmarks" \
  --body "The PII detector (\`backend/src/services/gateway/PIIDetector.ts\`) uses regex patterns for 10 PII types. We need:

1. A comprehensive test suite with true positive, true negative, and edge cases for each type
2. Accuracy benchmarks (precision/recall per PII type)
3. Document known false positive/negative patterns

**PII types:** SSN, Credit Card, Medical Record, Bank Account, Passport, Email, Phone, IP Address, Date of Birth

This helps us quantify detection quality and identify where ML-based detection (Enterprise tier) adds value." \
  --label "good first issue" --label "testing" --label "help wanted"

echo ""
echo "--- Done! Created 7 issues with labels ---"
echo "View at: https://github.com/$REPO/issues"
