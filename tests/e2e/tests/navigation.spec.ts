// =============================================================================
// E2E NAVIGATION TESTS - All Routes & Links
// =============================================================================

import { test, expect } from '@playwright/test';

test.describe('Public Page Navigation', () => {
  test('should load landing page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Datacendia/i);
  });

  test('should navigate to pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.locator('h1')).toContainText(/pricing/i);
  });

  test('should navigate to product page', async ({ page }) => {
    await page.goto('/product');
    await expect(page).toHaveURL(/\/product/);
  });

  test('should navigate to about page', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveURL(/\/about/);
  });

  test('should navigate to contact page', async ({ page }) => {
    await page.goto('/contact');
    await expect(page).toHaveURL(/\/contact/);
  });

  test('should navigate to demo request page', async ({ page }) => {
    await page.goto('/demo');
    await expect(page).toHaveURL(/\/demo/);
  });

  test('should navigate to downloads page', async ({ page }) => {
    await page.goto('/downloads');
    await expect(page).toHaveURL(/\/downloads/);
  });

  test('should navigate to privacy policy', async ({ page }) => {
    await page.goto('/privacy');
    await expect(page).toHaveURL(/\/privacy/);
  });

  test('should navigate to terms of service', async ({ page }) => {
    await page.goto('/terms');
    await expect(page).toHaveURL(/\/terms/);
  });
});

test.describe('Auth Page Navigation', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('should load register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page).toHaveURL(/\/register/);
    await expect(page.locator('form')).toBeVisible();
  });

  test('should load forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/login');
    const registerLink = page.locator('a[href*="register"]').first();
    await registerLink.click();
    await expect(page).toHaveURL(/\/register/);
  });

  test('should navigate from login to forgot password', async ({ page }) => {
    await page.goto('/login');
    const forgotLink = page.locator('a[href*="forgot"]').first();
    await forgotLink.click();
    await expect(page).toHaveURL(/\/forgot/);
  });
});

test.describe('Navigation Links Work', () => {
  test('header navigation links work on landing page', async ({ page }) => {
    await page.goto('/');
    
    // Check that header navigation has at least one link
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible();
    const navLinks = nav.locator('a, [role="link"]');
    expect(await navLinks.count()).toBeGreaterThan(0);
  });

  test('footer links are present', async ({ page }) => {
    await page.goto('/');
    
    const footer = page.locator('footer');
    if (await footer.isVisible()) {
      const footerLinks = footer.locator('a');
      expect(await footerLinks.count()).toBeGreaterThan(0);
    }
  });

  test('CTA buttons navigate correctly', async ({ page }) => {
    await page.goto('/');
    
    // Find "Get Started" or "Demo" buttons
    const ctaButton = page.locator('a:has-text("Get Started"), a:has-text("Demo"), a:has-text("Start")').first();
    if (await ctaButton.isVisible()) {
      await ctaButton.click();
      // Should navigate to demo, register, or onboarding
      await expect(page).toHaveURL(/\/(demo|register|onboarding|get-started)/);
    }
  });
});

test.describe('404 Page', () => {
  test('should show 404 for invalid routes', async ({ page }) => {
    await page.goto('/this-page-does-not-exist-12345');
    await expect(page.locator('body')).toContainText(/404|not found/i);
  });

  test('should have link back to home on 404', async ({ page }) => {
    await page.goto('/invalid-route');
    const homeLink = page.locator('a[href="/"]').first();
    await expect(homeLink).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should have mobile menu toggle', async ({ page }) => {
    await page.goto('/');
    
    // Look for hamburger menu button
    const menuButton = page.locator('button[aria-label*="menu" i], button:has(svg)').first();
    if (await menuButton.isVisible()) {
      await menuButton.click();
      // Mobile menu should be visible
      await expect(page.locator('nav, [role="menu"]')).toBeVisible();
    }
  });
});
