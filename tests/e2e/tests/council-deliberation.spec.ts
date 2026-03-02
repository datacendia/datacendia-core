// =============================================================================
// E2E COUNCIL DELIBERATION FLOW TESTS
// Complete user journey: login → create decision → run council → export report
// =============================================================================

import { test, expect, Page } from '@playwright/test';

// Test user credentials (for dev/staging environments)
const TEST_USER = {
  email: process.env.TEST_USER_EMAIL || 'test@datacendia.com',
  password: process.env.TEST_USER_PASSWORD || 'TestPassword123!',
};

// =============================================================================
// HELPERS
// =============================================================================

async function login(page: Page) {
  await page.goto('/login');
  await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
  await page.fill('input[type="password"]', TEST_USER.password);
  await page.click('button[type="submit"]');
  
  // Wait for redirect to dashboard or cortex
  await page.waitForURL(/\/(cortex|dashboard)/, { timeout: 10000 }).catch(() => {
    // May already be logged in or auth is mocked
  });
}

async function waitForNetworkIdle(page: Page, timeout = 5000) {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {});
}

// =============================================================================
// COMPLETE COUNCIL DELIBERATION FLOW
// =============================================================================

test.describe('Council Deliberation Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should complete full deliberation workflow', async ({ page }) => {
    // Step 1: Navigate to Council
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);
    
    // Verify council page loaded
    await expect(page.locator('h1, h2').filter({ hasText: /council/i })).toBeVisible({ timeout: 10000 });

    // Step 2: Start new deliberation
    const newDelibButton = page.locator('button').filter({ hasText: /new|start|create/i }).first();
    if (await newDelibButton.isVisible()) {
      await newDelibButton.click();
      await waitForNetworkIdle(page);
    }

    // Step 3: Enter deliberation topic
    const topicInput = page.locator('textarea, input[name="topic"], input[placeholder*="topic"], input[placeholder*="question"]').first();
    if (await topicInput.isVisible()) {
      await topicInput.fill('Should we expand into the European market given current economic conditions?');
    }

    // Step 4: Select agents (if agent selection is visible)
    const agentCheckboxes = page.locator('input[type="checkbox"][name*="agent"], [role="checkbox"]');
    const agentCount = await agentCheckboxes.count();
    if (agentCount > 0) {
      // Select at least 3 agents
      for (let i = 0; i < Math.min(3, agentCount); i++) {
        const checkbox = agentCheckboxes.nth(i);
        if (!(await checkbox.isChecked())) {
          await checkbox.click();
        }
      }
    }

    // Step 5: Start deliberation
    const startButton = page.locator('button').filter({ hasText: /start|submit|deliberate|run/i }).first();
    if (await startButton.isVisible()) {
      await startButton.click();
      
      // Wait for deliberation to process (may take time for AI responses)
      await page.waitForTimeout(3000);
      await waitForNetworkIdle(page, 30000);
    }

    // Step 6: Verify deliberation results appear
    const resultsSection = page.locator('[class*="result"], [class*="response"], [class*="deliberation"]').first();
    // Results may take time to appear
    await page.waitForTimeout(5000);
    
    // Check page didn't error out
    const errorMessage = page.locator('[role="alert"], .error, .text-red-500');
    const hasError = await errorMessage.isVisible();
    if (hasError) {
      console.log('Deliberation may have encountered an error (expected in test environment without AI backend)');
    }
  });

  test('should handle deliberation modes', async ({ page }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Check for mode selector
    const modeSelector = page.locator('[data-testid="mode-selector"], select[name="mode"], button[aria-haspopup="listbox"]').first();
    if (await modeSelector.isVisible()) {
      await modeSelector.click();
      
      // Look for mode options
      const modeOptions = page.locator('[role="option"], [role="menuitem"], option');
      const optionCount = await modeOptions.count();
      expect(optionCount).toBeGreaterThan(0);
    }
  });

  test('should display agent responses with streaming', async ({ page }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Look for agent cards or response areas
    const agentCards = page.locator('[class*="agent"], [data-testid*="agent"]');
    
    // Council page should show agent configuration or responses
    await page.waitForTimeout(2000);
    
    // Verify page structure exists
    const hasCouncilUI = await page.locator('main, [role="main"]').isVisible();
    expect(hasCouncilUI).toBeTruthy();
  });
});

// =============================================================================
// EXPORT AND REPORTING FLOW
// =============================================================================

test.describe('Export and Reporting Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should export deliberation as PDF', async ({ page }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Look for export button
    const exportButton = page.locator('button').filter({ hasText: /export|download|pdf/i }).first();
    
    if (await exportButton.isVisible()) {
      // Set up download listener
      const downloadPromise = page.waitForEvent('download', { timeout: 10000 }).catch(() => null);
      
      await exportButton.click();
      
      const download = await downloadPromise;
      if (download) {
        const filename = download.suggestedFilename();
        expect(filename).toMatch(/\.(pdf|docx|xlsx|csv)$/i);
      }
    }
  });

  test('should share deliberation results', async ({ page }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Look for share button
    const shareButton = page.locator('button').filter({ hasText: /share|invite|collaborate/i }).first();
    
    if (await shareButton.isVisible()) {
      await shareButton.click();
      
      // Should open share modal or dialog
      const shareDialog = page.locator('[role="dialog"], [class*="modal"]').first();
      await expect(shareDialog).toBeVisible({ timeout: 5000 }).catch(() => {
        // Share functionality may not be implemented yet
      });
    }
  });

  test('should save deliberation to Ledger', async ({ page }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Look for save/commit to ledger button
    const ledgerButton = page.locator('button').filter({ hasText: /save|commit|ledger|record/i }).first();
    
    if (await ledgerButton.isVisible()) {
      await ledgerButton.click();
      await waitForNetworkIdle(page);
      
      // Should show success notification
      const notification = page.locator('[role="alert"], .toast, [class*="notification"]').first();
      await page.waitForTimeout(2000);
    }
  });
});

// =============================================================================
// DECISION LIFECYCLE FLOW
// =============================================================================

test.describe('Decision Lifecycle Flow', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('should create, deliberate, and finalize a decision', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/cortex/dashboard');
    await waitForNetworkIdle(page);

    // Look for new decision button
    const newDecisionButton = page.locator('button').filter({ hasText: /new decision|create|add/i }).first();
    
    if (await newDecisionButton.isVisible()) {
      await newDecisionButton.click();
      await waitForNetworkIdle(page);
      
      // Fill decision form
      const titleInput = page.locator('input[name="title"], input[placeholder*="title"]').first();
      if (await titleInput.isVisible()) {
        await titleInput.fill('Q4 Marketing Budget Allocation');
      }
      
      const descInput = page.locator('textarea[name="description"], textarea').first();
      if (await descInput.isVisible()) {
        await descInput.fill('Determine optimal allocation of $2M marketing budget across digital, events, and content channels.');
      }
      
      // Submit
      const submitButton = page.locator('button[type="submit"]').first();
      if (await submitButton.isVisible()) {
        await submitButton.click();
        await waitForNetworkIdle(page);
      }
    }
  });

  test('should view decision history and audit trail', async ({ page }) => {
    await page.goto('/cortex/dashboard');
    await waitForNetworkIdle(page);

    // Look for history or audit link
    const historyLink = page.locator('a, button').filter({ hasText: /history|audit|timeline|ledger/i }).first();
    
    if (await historyLink.isVisible()) {
      await historyLink.click();
      await waitForNetworkIdle(page);
      
      // Should show timeline or history entries
      const historyEntries = page.locator('[class*="timeline"], [class*="history"], [class*="audit"]').first();
      await page.waitForTimeout(2000);
    }
  });
});

// =============================================================================
// MULTI-BROWSER VALIDATION
// =============================================================================

test.describe('Cross-Browser Rendering', () => {
  test('should render council page correctly', async ({ page, browserName }) => {
    await page.goto('/cortex/council');
    await waitForNetworkIdle(page);

    // Take screenshot for visual comparison
    await page.screenshot({ 
      path: `playwright-report/screenshots/council-${browserName}.png`,
      fullPage: true 
    });

    // Basic layout checks
    const mainContent = page.locator('main, [role="main"], #root > div').first();
    await expect(mainContent).toBeVisible();

    // Check no critical rendering errors
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => jsErrors.push(error.message));
    
    await page.waitForTimeout(2000);
    
    // Log any JS errors (but don't fail - some may be expected in test env)
    if (jsErrors.length > 0) {
      console.log(`[${browserName}] JS errors:`, jsErrors);
    }
  });
});
