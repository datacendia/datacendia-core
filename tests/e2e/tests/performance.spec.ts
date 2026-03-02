// =============================================================================
// E2E PERFORMANCE TESTS
// Core Web Vitals and performance metrics validation
// =============================================================================

import { test, expect, Page } from '@playwright/test';

// =============================================================================
// PERFORMANCE THRESHOLDS
// =============================================================================

const THRESHOLDS = {
  // Core Web Vitals
  LCP: 2500,      // Largest Contentful Paint < 2.5s
  FID: 100,       // First Input Delay < 100ms
  CLS: 0.1,       // Cumulative Layout Shift < 0.1
  
  // Additional metrics
  FCP: 1800,      // First Contentful Paint < 1.8s
  TTFB: 800,      // Time to First Byte < 800ms
  TTI: 3800,      // Time to Interactive < 3.8s
  
  // Page-specific
  pageLoad: 5000,      // Full page load < 5s
  apiResponse: 2000,   // API responses < 2s
  deliberation: 30000, // Council deliberation < 30s
};

// =============================================================================
// HELPERS
// =============================================================================

interface PerformanceMetrics {
  ttfb: number;
  fcp: number;
  lcp: number;
  domContentLoaded: number;
  load: number;
  resourceCount: number;
  totalSize: number;
}

async function getPerformanceMetrics(page: Page): Promise<PerformanceMetrics> {
  return await page.evaluate(() => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    const fcp = paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0;
    
    // Get LCP from PerformanceObserver entries (if available)
    let lcp = 0;
    const lcpEntries = (performance as any).getEntriesByType?.('largest-contentful-paint') || [];
    if (lcpEntries.length > 0) {
      lcp = lcpEntries[lcpEntries.length - 1].startTime;
    }
    
    const totalSize = resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    
    return {
      ttfb: navigation.responseStart - navigation.requestStart,
      fcp,
      lcp,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.startTime,
      load: navigation.loadEventEnd - navigation.startTime,
      resourceCount: resources.length,
      totalSize: Math.round(totalSize / 1024), // KB
    };
  });
}

async function measureApiLatency(page: Page, endpoint: string): Promise<number> {
  const start = Date.now();
  
  await page.evaluate(async (url) => {
    const response = await fetch(url, {
      credentials: 'include',
    });
    return response.ok;
  }, endpoint);
  
  return Date.now() - start;
}

// =============================================================================
// CORE WEB VITALS TESTS
// =============================================================================

test.describe('Core Web Vitals', () => {
  test('Homepage should meet LCP threshold', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000); // Allow LCP to settle
    
    const metrics = await getPerformanceMetrics(page);
    
    console.log('\n=== Homepage Performance ===');
    console.log(`TTFB: ${metrics.ttfb.toFixed(0)}ms (threshold: ${THRESHOLDS.TTFB}ms)`);
    console.log(`FCP: ${metrics.fcp.toFixed(0)}ms (threshold: ${THRESHOLDS.FCP}ms)`);
    console.log(`LCP: ${metrics.lcp.toFixed(0)}ms (threshold: ${THRESHOLDS.LCP}ms)`);
    console.log(`Load: ${metrics.load.toFixed(0)}ms`);
    console.log(`Resources: ${metrics.resourceCount} (${metrics.totalSize}KB)`);
    
    // LCP should be under threshold
    expect(metrics.lcp).toBeLessThan(THRESHOLDS.LCP);
  });

  test('Dashboard should load within acceptable time', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input[type="email"], input[name="email"]', 'test@datacendia.com');
    await page.fill('input[type="password"]', 'TestPassword123!');
    await page.click('button[type="submit"]');
    await page.waitForTimeout(2000);
    
    // Navigate to dashboard
    const start = Date.now();
    await page.goto('/cortex/dashboard');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - start;
    
    const metrics = await getPerformanceMetrics(page);
    
    console.log('\n=== Dashboard Performance ===');
    console.log(`Total load: ${loadTime}ms (threshold: ${THRESHOLDS.pageLoad}ms)`);
    console.log(`FCP: ${metrics.fcp.toFixed(0)}ms`);
    console.log(`Resources: ${metrics.resourceCount} (${metrics.totalSize}KB)`);
    
    expect(loadTime).toBeLessThan(THRESHOLDS.pageLoad);
  });

  test('should have minimal Cumulative Layout Shift', async ({ page }) => {
    // Set up CLS observer before navigation
    await page.addInitScript(() => {
      (window as any).clsValue = 0;
      (window as any).clsEntries = [];
      
      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            (window as any).clsValue += (entry as any).value;
            (window as any).clsEntries.push({
              value: (entry as any).value,
              sources: (entry as any).sources?.map((s: any) => s.node?.tagName),
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Wait for any delayed shifts
    
    const cls = await page.evaluate(() => ({
      value: (window as any).clsValue,
      entries: (window as any).clsEntries,
    }));
    
    console.log('\n=== Layout Shift ===');
    console.log(`CLS: ${cls.value.toFixed(4)} (threshold: ${THRESHOLDS.CLS})`);
    
    if (cls.entries.length > 0) {
      console.log('Shift sources:');
      cls.entries.forEach((e: any) => {
        console.log(`  - ${e.value.toFixed(4)}: ${e.sources?.join(', ') || 'unknown'}`);
      });
    }
    
    expect(cls.value).toBeLessThan(THRESHOLDS.CLS);
  });
});

// =============================================================================
// PAGE LOAD PERFORMANCE
// =============================================================================

test.describe('Page Load Performance', () => {
  const criticalPages = [
    { path: '/', name: 'Homepage' },
    { path: '/pricing', name: 'Pricing' },
    { path: '/verticals', name: 'Verticals Hub' },
    { path: '/login', name: 'Login' },
  ];

  for (const { path, name } of criticalPages) {
    test(`${name} should load under ${THRESHOLDS.pageLoad}ms`, async ({ page }) => {
      const start = Date.now();
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - start;
      
      console.log(`${name}: ${loadTime}ms`);
      expect(loadTime).toBeLessThan(THRESHOLDS.pageLoad);
    });
  }
});

// =============================================================================
// BUNDLE SIZE ANALYSIS
// =============================================================================

test.describe('Bundle Size', () => {
  test('should have reasonable JavaScript bundle size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const bundleAnalysis = await page.evaluate(() => {
      const scripts = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter((r) => r.initiatorType === 'script');
      
      const jsSize = scripts.reduce((acc, r) => acc + (r.transferSize || 0), 0);
      const jsCount = scripts.length;
      
      const largestScripts = scripts
        .sort((a, b) => (b.transferSize || 0) - (a.transferSize || 0))
        .slice(0, 5)
        .map(s => ({
          name: s.name.split('/').pop(),
          size: Math.round((s.transferSize || 0) / 1024),
        }));
      
      return {
        totalJS: Math.round(jsSize / 1024),
        scriptCount: jsCount,
        largest: largestScripts,
      };
    });
    
    console.log('\n=== Bundle Analysis ===');
    console.log(`Total JS: ${bundleAnalysis.totalJS}KB`);
    console.log(`Script count: ${bundleAnalysis.scriptCount}`);
    console.log('Largest bundles:');
    bundleAnalysis.largest.forEach(s => {
      console.log(`  - ${s.name}: ${s.size}KB`);
    });
    
    // Total JS should be under 2MB compressed
    expect(bundleAnalysis.totalJS).toBeLessThan(2000);
  });

  test('should have reasonable CSS bundle size', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const cssAnalysis = await page.evaluate(() => {
      const styles = (performance.getEntriesByType('resource') as PerformanceResourceTiming[])
        .filter((r) => 
          r.initiatorType === 'link' && r.name.includes('.css'));
      
      const cssSize = styles.reduce((acc, r) => acc + (r.transferSize || 0), 0);
      
      return {
        totalCSS: Math.round(cssSize / 1024),
        styleCount: styles.length,
      };
    });
    
    console.log(`Total CSS: ${cssAnalysis.totalCSS}KB`);
    
    // CSS should be under 500KB compressed
    expect(cssAnalysis.totalCSS).toBeLessThan(500);
  });
});

// =============================================================================
// MEMORY USAGE
// =============================================================================

test.describe('Memory Usage', () => {
  test('should not leak memory during navigation', async ({ page }) => {
    // Get initial memory
    const getMemory = async () => {
      return await page.evaluate(() => {
        if ((performance as any).memory) {
          return {
            usedJSHeapSize: (performance as any).memory.usedJSHeapSize / 1024 / 1024,
            totalJSHeapSize: (performance as any).memory.totalJSHeapSize / 1024 / 1024,
          };
        }
        return null;
      });
    };
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const initial = await getMemory();
    
    // Navigate through several pages
    const pages = ['/pricing', '/verticals', '/login', '/', '/pricing'];
    
    for (const path of pages) {
      await page.goto(path);
      await page.waitForLoadState('networkidle');
    }
    
    const final = await getMemory();
    
    if (initial && final) {
      console.log('\n=== Memory Usage ===');
      console.log(`Initial: ${initial.usedJSHeapSize.toFixed(2)}MB`);
      console.log(`Final: ${final.usedJSHeapSize.toFixed(2)}MB`);
      console.log(`Difference: ${(final.usedJSHeapSize - initial.usedJSHeapSize).toFixed(2)}MB`);
      
      // Memory should not grow excessively (< 50MB increase)
      expect(final.usedJSHeapSize - initial.usedJSHeapSize).toBeLessThan(50);
    } else {
      console.log('Memory API not available in this browser');
    }
  });
});

// =============================================================================
// NETWORK REQUESTS
// =============================================================================

test.describe('Network Efficiency', () => {
  test('should minimize number of requests', async ({ page }) => {
    const requests: string[] = [];
    
    page.on('request', (request) => {
      requests.push(request.url());
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const requestsByType = {
      js: requests.filter(r => r.match(/\.js(\?|$)/)).length,
      css: requests.filter(r => r.match(/\.css(\?|$)/)).length,
      images: requests.filter(r => r.match(/\.(png|jpg|jpeg|gif|svg|webp)(\?|$)/)).length,
      fonts: requests.filter(r => r.match(/\.(woff|woff2|ttf|eot)(\?|$)/)).length,
      api: requests.filter(r => r.includes('/api/')).length,
      total: requests.length,
    };
    
    console.log('\n=== Network Requests ===');
    console.log(`Total: ${requestsByType.total}`);
    console.log(`JS: ${requestsByType.js}`);
    console.log(`CSS: ${requestsByType.css}`);
    console.log(`Images: ${requestsByType.images}`);
    console.log(`Fonts: ${requestsByType.fonts}`);
    console.log(`API: ${requestsByType.api}`);
    
    // Should have reasonable number of requests
    expect(requestsByType.total).toBeLessThan(100);
  });

  test('should use caching effectively', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const firstVisitResources = await page.evaluate(() => 
      performance.getEntriesByType('resource').length
    );
    
    // Second visit (should use cache)
    await page.goto('/pricing');
    await page.waitForLoadState('networkidle');
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for cached responses
    const cacheHits = await page.evaluate(() => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const cached = resources.filter(r => r.transferSize === 0 && r.decodedBodySize > 0);
      return {
        total: resources.length,
        cached: cached.length,
        cacheRatio: (cached.length / resources.length * 100).toFixed(1),
      };
    });
    
    console.log('\n=== Cache Efficiency ===');
    console.log(`First visit resources: ${firstVisitResources}`);
    console.log(`Cached resources: ${cacheHits.cached}/${cacheHits.total} (${cacheHits.cacheRatio}%)`);
  });
});

// =============================================================================
// INTERACTION RESPONSIVENESS
// =============================================================================

test.describe('Interaction Responsiveness', () => {
  test('should respond to clicks within 100ms', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Find a clickable element
    const button = page.locator('button, a').first();
    
    if (await button.isVisible()) {
      const start = Date.now();
      
      // Measure click response
      await button.click({ trial: true }); // Just measure, don't actually click
      
      const responseTime = Date.now() - start;
      
      console.log(`Click response time: ${responseTime}ms`);
      expect(responseTime).toBeLessThan(THRESHOLDS.FID);
    }
  });

  test('should handle rapid interactions', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const start = Date.now();
    
    // Simulate rapid scrolling
    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(50);
    }
    
    const scrollTime = Date.now() - start;
    
    console.log(`Rapid scroll time: ${scrollTime}ms for 10 scrolls`);
    
    // Should complete within 2 seconds
    expect(scrollTime).toBeLessThan(2000);
  });
});
