import { test, expect } from '@playwright/test';

test.describe('Council Deliberation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/cortex/);
  });

  test('should navigate to Council page', async ({ page }) => {
    await page.click('text=The Council');
    await expect(page).toHaveURL(/council/);
    await expect(page.locator('h1')).toContainText('Council');
  });

  test('should display available agents', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/council');
    await expect(page.locator('[data-testid="agent-card"]').first()).toBeVisible({ timeout: 10000 });
    const agentCount = await page.locator('[data-testid="agent-card"]').count();
    expect(agentCount).toBeGreaterThan(5);
  });

  test('should create new deliberation', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/council');
    await page.click('text=New Deliberation');
    await page.fill('textarea[name="question"]', 'Should we expand to European markets?');
    await page.click('[data-agent="cfo"]');
    await page.click('[data-agent="coo"]');
    await page.click('[data-agent="risk"]');
    await page.click('button:has-text("Start Deliberation")');
    
    await expect(page.locator('text=Deliberation started')).toBeVisible({ timeout: 5000 });
  });
});
