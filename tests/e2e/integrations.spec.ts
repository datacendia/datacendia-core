import { test, expect } from '@playwright/test';

test.describe('Enterprise Integrations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    await page.waitForURL(/cortex/);
  });

  test('should display available integrations', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/integrations');
    await expect(page.locator('h1')).toContainText('Integrations');
    const integrationCards = await page.locator('[data-testid="integration-card"]').count();
    expect(integrationCards).toBeGreaterThan(10);
  });

  test('should show connector details', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/integrations');
    await page.click('text=Salesforce');
    await expect(page.locator('text=OAuth 2.0')).toBeVisible();
    await expect(page.locator('text=Connect')).toBeVisible();
  });

  test('should filter integrations by category', async ({ page }) => {
    await page.goto('http://localhost:5173/cortex/integrations');
    await page.click('button:has-text("CRM")');
    const crmIntegrations = await page.locator('[data-category="crm"]').count();
    expect(crmIntegrations).toBeGreaterThan(3);
  });
});
