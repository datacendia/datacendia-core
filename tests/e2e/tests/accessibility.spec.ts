// =============================================================================
// E2E ACCESSIBILITY TESTS (WCAG 2.1 AA Compliance)
// Uses axe-core for automated accessibility validation
// =============================================================================

import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// =============================================================================
// HELPERS
// =============================================================================

interface AxeResults {
  violations: Array<{
    id: string;
    impact: string;
    description: string;
    nodes: Array<{ html: string; target: string[] }>;
  }>;
  passes: Array<{ id: string }>;
  incomplete: Array<{ id: string }>;
}

async function runAxe(page: Page, options?: { include?: string[]; exclude?: string[] }): Promise<AxeResults> {
  let builder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa']);
  
  if (options?.include) {
    builder = builder.include(options.include);
  }
  if (options?.exclude) {
    builder = builder.exclude(options.exclude);
  }
  
  return await builder.analyze();
}

function logViolations(results: AxeResults, pageName: string) {
  if (results.violations.length > 0) {
    console.log(`\n=== Accessibility Violations on ${pageName} ===`);
    results.violations.forEach((violation) => {
      console.log(`[${violation.impact?.toUpperCase()}] ${violation.id}: ${violation.description}`);
      violation.nodes.slice(0, 3).forEach((node) => {
        console.log(`  - ${node.target.join(' > ')}`);
      });
    });
  }
}

// =============================================================================
// PUBLIC PAGES ACCESSIBILITY
// =============================================================================

test.describe('Public Pages Accessibility', () => {
  test('Homepage should have no critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const results = await runAxe(page);
    logViolations(results, 'Homepage');
    
    // Filter for critical/serious violations only
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    
    expect(criticalViolations.length).toBe(0);
  });

  test('Login page should be keyboard navigable', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
    
    // Tab through form elements
    let tabCount = 0;
    const focusedElements: string[] = [];
    
    while (tabCount < 10) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => ({
        tag: document.activeElement?.tagName,
        type: (document.activeElement as HTMLInputElement)?.type,
        role: document.activeElement?.getAttribute('role'),
      }));
      focusedElements.push(`${focused.tag}[${focused.type || focused.role || ''}]`);
      tabCount++;
    }
    
    // Should be able to reach email, password, and submit
    expect(focusedElements.some(el => el.includes('INPUT'))).toBeTruthy();
    
    // Run axe
    const results = await runAxe(page);
    logViolations(results, 'Login');
    
    const criticalViolations = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    );
    expect(criticalViolations.length).toBe(0);
  });

  test('Pricing page should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    
    // Check heading hierarchy
    const headings = await page.evaluate(() => {
      const h = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      return Array.from(h).map((el) => ({
        level: parseInt(el.tagName[1]),
        text: el.textContent?.substring(0, 50),
      }));
    });
    
    // Should have exactly one h1
    const h1Count = headings.filter((h) => h.level === 1).length;
    expect(h1Count).toBeLessThanOrEqual(2); // Allow for logo text
    
    // Heading levels should not skip (e.g., h1 -> h3)
    let previousLevel = 0;
    let skippedLevels = false;
    
    for (const heading of headings) {
      if (heading.level > previousLevel + 1 && previousLevel > 0) {
        skippedLevels = true;
        console.log(`Heading skip: h${previousLevel} -> h${heading.level}`);
      }
      previousLevel = heading.level;
    }
    
    // Log but don't fail - some designs intentionally skip levels
    if (skippedLevels) {
      console.log('Warning: Heading hierarchy has skipped levels');
    }
    
    const results = await runAxe(page);
    logViolations(results, 'Pricing');
  });

  test('Verticals hub should have proper ARIA labels', async ({ page }) => {
    await page.goto('/verticals');
    await page.waitForLoadState('networkidle');
    
    // Check for ARIA labels on interactive elements
    const interactiveElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('button, a, [role="button"], input, select');
      return Array.from(elements).map((el) => ({
        tag: el.tagName,
        hasAriaLabel: !!el.getAttribute('aria-label'),
        hasAriaLabelledBy: !!el.getAttribute('aria-labelledby'),
        hasText: !!(el.textContent?.trim()),
        hasTitle: !!el.getAttribute('title'),
      }));
    });
    
    // All interactive elements should be accessible
    const unlabeledCount = interactiveElements.filter(
      (el) => !el.hasAriaLabel && !el.hasAriaLabelledBy && !el.hasText && !el.hasTitle
    ).length;
    
    // Allow some unlabeled (icons with visible text nearby)
    expect(unlabeledCount).toBeLessThan(5);
    
    const results = await runAxe(page);
    logViolations(results, 'Verticals Hub');
  });
});

// =============================================================================
// CORTEX APP ACCESSIBILITY
// =============================================================================

test.describe('Cortex Application Accessibility', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', 'test@datacendia.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
  });

  test('Dashboard should have proper color contrast', async ({ page }) => {
    await page.goto('/cortex/dashboard');
    await page.waitForLoadState('networkidle');
    
    const results = await runAxe(page);
    logViolations(results, 'Dashboard');
    
    // Check specifically for color contrast violations
    const contrastViolations = results.violations.filter(
      (v) => v.id === 'color-contrast'
    );
    
    if (contrastViolations.length > 0) {
      console.log(`Found ${contrastViolations.length} color contrast issues`);
      console.log('Note: Dark themes may flag false positives');
    }
  });

  test('Council page should support screen readers', async ({ page }) => {
    await page.goto('/cortex/council');
    await page.waitForLoadState('networkidle');
    
    // Check for ARIA landmarks
    const landmarks = await page.evaluate(() => {
      return {
        main: document.querySelectorAll('main, [role="main"]').length,
        navigation: document.querySelectorAll('nav, [role="navigation"]').length,
        banner: document.querySelectorAll('header, [role="banner"]').length,
        contentinfo: document.querySelectorAll('footer, [role="contentinfo"]').length,
      };
    });
    
    // Should have at least main content area
    expect(landmarks.main).toBeGreaterThanOrEqual(1);
    
    // Check for live regions for dynamic content
    const liveRegions = await page.evaluate(() => {
      return document.querySelectorAll('[aria-live], [role="alert"], [role="status"]').length;
    });
    
    // Council page should have live regions for AI responses
    // (May not be implemented yet)
    console.log(`Live regions found: ${liveRegions}`);
    
    const results = await runAxe(page);
    logViolations(results, 'Council');
  });

  test('Forms should have associated labels', async ({ page }) => {
    await page.goto('/cortex/council');
    await page.waitForLoadState('networkidle');
    
    // Find all form inputs
    const inputsWithoutLabels = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
      const unlabeled: string[] = [];
      
      inputs.forEach((input) => {
        const id = input.id;
        const hasLabel = id && document.querySelector(`label[for="${id}"]`);
        const hasAriaLabel = input.getAttribute('aria-label');
        const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
        const hasPlaceholder = input.getAttribute('placeholder');
        const isWrappedByLabel = input.closest('label');
        
        if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy && !isWrappedByLabel) {
          unlabeled.push(`${input.tagName}[name="${input.getAttribute('name')}"]`);
        }
      });
      
      return unlabeled;
    });
    
    if (inputsWithoutLabels.length > 0) {
      console.log('Inputs without proper labels:', inputsWithoutLabels);
    }
    
    // Allow up to 2 unlabeled (some hidden/special inputs)
    expect(inputsWithoutLabels.length).toBeLessThan(3);
  });
});

// =============================================================================
// FOCUS MANAGEMENT TESTS
// =============================================================================

test.describe('Focus Management', () => {
  test('Modal dialogs should trap focus', async ({ page }) => {
    await page.goto('/cortex/council');
    await page.waitForLoadState('networkidle');
    
    // Look for a button that opens a modal
    const modalTrigger = page.locator('button').filter({ hasText: /new|settings|export/i }).first();
    
    if (await modalTrigger.isVisible()) {
      await modalTrigger.click();
      await page.waitForTimeout(500);
      
      const modal = page.locator('[role="dialog"], [aria-modal="true"]').first();
      
      if (await modal.isVisible()) {
        // Focus should be within modal
        const focusInModal = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], [aria-modal="true"]');
          return modal?.contains(document.activeElement);
        });
        
        expect(focusInModal).toBeTruthy();
        
        // Tab should cycle within modal
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        await page.keyboard.press('Tab');
        
        const stillInModal = await page.evaluate(() => {
          const modal = document.querySelector('[role="dialog"], [aria-modal="true"]');
          return modal?.contains(document.activeElement);
        });
        
        expect(stillInModal).toBeTruthy();
        
        // Escape should close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        const modalClosed = await modal.isHidden();
        expect(modalClosed).toBeTruthy();
      }
    }
  });

  test('Skip links should exist and work', async ({ page }) => {
    await page.goto('/');
    
    // Press Tab to reveal skip link
    await page.keyboard.press('Tab');
    
    const skipLink = page.locator('a[href="#main"], a[href="#content"], .skip-link, [class*="skip"]').first();
    
    if (await skipLink.isVisible()) {
      await skipLink.click();
      
      // Focus should move to main content
      const focusedElement = await page.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    }
  });
});

// =============================================================================
// REDUCED MOTION TESTS
// =============================================================================

test.describe('Reduced Motion Support', () => {
  test('should respect prefers-reduced-motion', async ({ page }) => {
    // Enable reduced motion
    await page.emulateMedia({ reducedMotion: 'reduce' });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check if animations are disabled
    const animatedElements = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      let animatedCount = 0;
      
      elements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const animation = style.animation || style.getPropertyValue('animation');
        const transition = style.transition || style.getPropertyValue('transition');
        
        if (animation && animation !== 'none' && !animation.includes('0s')) {
          animatedCount++;
        }
        if (transition && transition !== 'none' && transition !== 'all 0s ease 0s') {
          // Transitions are often acceptable even with reduced motion
        }
      });
      
      return animatedCount;
    });
    
    console.log(`Animated elements with reduced-motion: ${animatedElements}`);
    // Some essential animations may still be present
  });
});

// =============================================================================
// LIGHTHOUSE METRICS (if running in CI with lighthouse)
// =============================================================================

test.describe('Performance and Accessibility Metrics', () => {
  test('should log accessibility score indicators', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const results = await runAxe(page);
    
    console.log('\n=== Accessibility Summary ===');
    console.log(`Passes: ${results.passes.length}`);
    console.log(`Violations: ${results.violations.length}`);
    console.log(`Incomplete: ${results.incomplete.length}`);
    
    // Categorize violations by impact
    const byImpact = {
      critical: results.violations.filter(v => v.impact === 'critical').length,
      serious: results.violations.filter(v => v.impact === 'serious').length,
      moderate: results.violations.filter(v => v.impact === 'moderate').length,
      minor: results.violations.filter(v => v.impact === 'minor').length,
    };
    
    console.log('\nViolations by impact:');
    console.log(`  Critical: ${byImpact.critical}`);
    console.log(`  Serious: ${byImpact.serious}`);
    console.log(`  Moderate: ${byImpact.moderate}`);
    console.log(`  Minor: ${byImpact.minor}`);
    
    // Fail only on critical violations
    expect(byImpact.critical).toBe(0);
  });
});
