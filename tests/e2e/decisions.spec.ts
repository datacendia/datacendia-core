import { test, expect } from '@playwright/test';

test.describe('Decision Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/cortex/);
  });

  test('should view decisions list', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/decisions');
    await expect(page.locator('h1')).toContainText('Decisions');
  });

  test('should create new decision', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/decisions');
    await page.click('text=New Decision');
    await page.fill('input[name="title"]', 'Test Decision');
    await page.fill('textarea[name="context"]', 'This is a test decision for E2E testing');
    await page.click('button:has-text("Create")');
    
    await expect(page.locator('text=Decision created')).toBeVisible({ timeout: 5000 });
  });

  test('should export decision', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/decisions');
    await page.locator('[data-testid="decision-item"]').first().click();
    await page.click('button:has-text("Export")');
    await page.click('text=PDF');
    
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Download")');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('.pdf');
  });
});
