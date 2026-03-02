import { test, expect } from '@playwright/test';

test.describe('User Login', () => {
  test('should login with valid credentials and view dashboard', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL(/cortex/, { timeout: 10000 });
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });

  test('should reject invalid credentials', async ({ page }) => {
    await page.goto('http://localhost:5173');
    
    await page.fill('input[name="email"]', 'wrong@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid credentials')).toBeVisible({ timeout: 5000 });
  });

  test('should logout successfully', async ({ page }) => {
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'stuart@datacendia.com');
    await page.fill('input[name="password"]', 'DatacendiaOwner2024!');
    await page.click('button[type="submit"]');
    
    await page.waitForURL(/cortex/);
    
    await page.click('[aria-label="User menu"]');
    await page.click('text=Logout');
    
    await expect(page).toHaveURL('/auth/login');
  });
});
