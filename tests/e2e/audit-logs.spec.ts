import { test, expect } from '@playwright/test';

test.describe('audit-logs', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/cortex/);
  });

  test('should load audit-logs page', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/audit-logs');
    await expect(page.locator('h1,h2')).toBeVisible({ timeout: 10000 });
  });
});
