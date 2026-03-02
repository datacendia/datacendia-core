import { test, expect } from '@playwright/test';

test.describe('api-keys', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/cortex/);
  });

  test('should load api-keys page', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/api-keys');
    await expect(page.locator('h1,h2')).toBeVisible({ timeout: 10000 });
  });
});
