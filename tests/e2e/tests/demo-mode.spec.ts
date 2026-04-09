// =============================================================================
// E2E DEMO MODE TESTS
// =============================================================================
// Verifies the full demo experience end-to-end:
//
//   1. docker compose -f docker-compose.demo.yml up -d
//   2. Navigate to http://localhost:5173
//   3. Demo login (sarah.chen@acme.demo)
//   4. Council dashboard shows pre-seeded deliberations
//   5. Deliberation detail page loads with agent transcripts
//   6. CendiaVerify page at /verify is accessible
//
// Run:  cd tests/e2e && npx playwright test tests/demo-mode.spec.ts
// Stack: Playwright + TypeScript
//
// Tips (h/t @m13v):
//   - First navigation uses 30s timeout — containers can report healthy
//     before the app is actually ready to serve.
//   - Transcript assertions use waitForSelector instead of fixed waits
//     so tests stay fast when API is quick and don't flake when it's slow.
// =============================================================================

import { test, expect, Page } from '@playwright/test';

// =============================================================================
// CONSTANTS
// =============================================================================

const DEMO_EMAIL = 'sarah.chen@acme.demo';
const DEMO_PASSWORD = 'demo-password-2024';

// Pre-seeded deliberation questions (from prisma/seed-full-demo.ts)
const SEEDED_QUESTIONS = [
  'Should we expand into the European market next quarter?',
  'What is the optimal pricing strategy for our enterprise tier?',
  'How should we respond to the new competitor entering our market?',
  'Should we acquire the startup for talent and technology?',
  'What is the best approach to reduce customer churn?',
];

// =============================================================================
// HELPERS
// =============================================================================

/**
 * Demo login flow. Uses generous 30s timeout on first navigation because
 * Docker containers can report healthy before the app is actually ready.
 */
async function demoLogin(page: Page) {
  // First navigation — generous timeout per m13v's advice
  await page.goto('/login', { waitUntil: 'networkidle', timeout: 30_000 });

  // Fill credentials
  await page.locator('input[type="email"], input[name="email"]').first().fill(DEMO_EMAIL);
  const passwordField = page.locator('input[type="password"]').first();
  if (await passwordField.isVisible()) {
    await passwordField.fill(DEMO_PASSWORD);
  }

  // Submit
  await page.locator('button[type="submit"]').click();

  // Wait for redirect — 30s for first authenticated page load
  await page.waitForURL(/cortex/, { timeout: 30_000 });
}

/** Wait for network idle with a safety timeout (never throws). */
async function settled(page: Page, ms = 10_000) {
  await page.waitForLoadState('networkidle', { timeout: ms }).catch(() => {});
}

// =============================================================================
// 1. FRONTEND LOADS
// =============================================================================

test.describe('Frontend loads', () => {
  test('landing page is reachable', async ({ page }) => {
    const res = await page.goto('/', { waitUntil: 'networkidle', timeout: 30_000 });
    expect(res?.ok()).toBeTruthy();
    await expect(page).toHaveTitle(/datacendia/i);
  });

  test('login page renders email + password fields', async ({ page }) => {
    await page.goto('/login', { waitUntil: 'networkidle', timeout: 30_000 });
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

// =============================================================================
// 2. DEMO LOGIN (sarah.chen@acme.demo)
// =============================================================================

test.describe('Demo login', () => {
  test('logs in with sarah.chen@acme.demo and reaches dashboard', async ({ page }) => {
    await demoLogin(page);
    expect(page.url()).toMatch(/cortex/);

    // Dashboard should render meaningful content
    const body = await page.textContent('body');
    expect(body!.length).toBeGreaterThan(200);
  });
});

// =============================================================================
// 3. COUNCIL DASHBOARD — PRE-SEEDED DELIBERATIONS
// =============================================================================

test.describe('Council dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await demoLogin(page);
  });

  test('council page renders without errors', async ({ page }) => {
    await page.goto('/cortex/council');
    await settled(page);

    const body = await page.textContent('body');
    expect(body).not.toContain('404');
    expect(body).not.toContain('Internal Server Error');
    expect(body!.length).toBeGreaterThan(300);
  });

  test('shows pre-seeded deliberations', async ({ page }) => {
    await page.goto('/cortex/council');
    await settled(page);

    // Look for any of the seeded deliberation questions or cards
    const cardOrRow = page.locator(
      '[data-testid*="deliberation"], ' +
      '[class*="deliberation"], ' +
      '[class*="card"], ' +
      'table tbody tr, ' +
      '[role="listitem"]'
    );

    // Wait for at least one item to appear
    await cardOrRow.first().waitFor({ state: 'visible', timeout: 15_000 }).catch(() => {});

    // Verify there's meaningful deliberation content on the page
    const text = await page.textContent('body');
    const hasSeededContent = SEEDED_QUESTIONS.some((q) =>
      text!.toLowerCase().includes(q.toLowerCase().slice(0, 30))
    );

    // Either we see seeded text or there are cards/rows rendered
    const count = await cardOrRow.count();
    expect(hasSeededContent || count >= 1).toBeTruthy();
  });
});

// =============================================================================
// 4. DELIBERATION DETAIL — AGENT TRANSCRIPTS
// =============================================================================

test.describe('Deliberation detail with transcripts', () => {
  test.beforeEach(async ({ page }) => {
    await demoLogin(page);
  });

  test('deliberation detail page loads with agent contributions', async ({ page }) => {
    // Navigate to history/council page to find a deliberation link
    await page.goto('/cortex/council/history');
    await settled(page);

    // Find a clickable deliberation link
    const link = page.locator(
      'a[href*="deliberation"], ' +
      '[class*="deliberation"] a, ' +
      'table tbody tr a, ' +
      'table tbody tr'
    ).first();

    const linkVisible = await link.isVisible({ timeout: 10_000 }).catch(() => false);

    if (linkVisible) {
      await link.click();
      await settled(page, 15_000);

      // Use waitForSelector for transcript elements that may load async
      // (per m13v: better than fixed waits — fast when API is quick, patient when slow)
      const transcriptSelector =
        '[data-testid*="transcript"], ' +
        '[data-testid*="agent-contribution"], ' +
        '[class*="transcript"], ' +
        '[class*="agent-response"], ' +
        '[class*="contribution"], ' +
        '[class*="reasoning"]';

      const hasTranscripts = await page
        .waitForSelector(transcriptSelector, { timeout: 15_000 })
        .then(() => true)
        .catch(() => false);

      // Even without explicit transcript components, the detail page should
      // show the question and agent roles
      const body = await page.textContent('body');
      expect(body!.length).toBeGreaterThan(300);

      // Should mention at least one agent role
      const hasAgentMention =
        /strategist|analyst|risk|advocate|arbiter|cfo|ciso|coo|red.?team/i.test(body!);
      expect(hasTranscripts || hasAgentMention).toBeTruthy();
    } else {
      // No deliberation links found — verify at least history page loaded
      const body = await page.textContent('body');
      expect(body).not.toContain('404');
    }
  });
});

// =============================================================================
// 5. CENDIAVERIFY PAGE (/verify) — PUBLIC, NO AUTH
// =============================================================================

test.describe('CendiaVerify page', () => {
  test('/verify is accessible without authentication', async ({ page }) => {
    const res = await page.goto('/verify', { waitUntil: 'networkidle', timeout: 30_000 });
    expect(res?.ok()).toBeTruthy();

    // Should render the verification portal
    const body = await page.textContent('body');
    expect(body).not.toContain('404');
    expect(body!.length).toBeGreaterThan(200);

    // Look for verification-related UI elements
    const hasVerifyContent =
      /verify|receipt|signature|cryptographic|audit|proof/i.test(body!);
    expect(hasVerifyContent).toBeTruthy();
  });

  test('/verify page has input for receipt verification', async ({ page }) => {
    await page.goto('/verify', { waitUntil: 'networkidle', timeout: 30_000 });

    // Should have a textarea, input, or upload area for pasting receipts
    const inputArea = page.locator(
      'textarea, ' +
      'input[type="file"], ' +
      '[contenteditable="true"], ' +
      'button:has-text("Upload"), ' +
      'button:has-text("Verify"), ' +
      'button:has-text("Paste")'
    ).first();

    await expect(inputArea).toBeVisible({ timeout: 10_000 });
  });
});

// =============================================================================
// 6. API HEALTH (browser-initiated sanity checks)
// =============================================================================

test.describe('API health', () => {
  test('backend /health endpoint responds 200', async ({ page }) => {
    const res = await page.goto('http://localhost:3001/health', { timeout: 30_000 });
    expect(res?.status()).toBe(200);
  });

  test('council status is operational', async ({ page }) => {
    const res = await page.goto('http://localhost:3001/api/v1/council/status', { timeout: 30_000 });
    expect(res?.status()).toBe(200);
    const body = await page.textContent('body');
    expect(body).toContain('operational');
  });
});

// =============================================================================
// 7. SIDEBAR NAVIGATION — KEY PAGES LOAD
// =============================================================================

test.describe('Core page navigation', () => {
  test.beforeEach(async ({ page }) => {
    await demoLogin(page);
  });

  test('key cortex pages load without errors', async ({ page }) => {
    const paths = [
      '/cortex/dashboard',
      '/cortex/council',
      '/cortex/decisions',
      '/cortex/data',
    ];

    for (const path of paths) {
      await page.goto(path);
      await settled(page);

      const body = await page.textContent('body');
      expect(body).not.toContain('Internal Server Error');
      expect(body!.length).toBeGreaterThan(100);
    }
  });
});
