/**
 * Performance utilities for Datacendia Web Components
 * Provides lazy loading, virtualization, and optimization helpers
 */

/**
 * Lazy load components when they enter viewport
 */
export function lazyLoadComponent(
  element: Element,
  callback: () => void,
  options: IntersectionObserverInit = {}
): () => void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      });
    },
    { threshold: 0.1, rootMargin: '50px', ...options }
  );

  observer.observe(element);
  return () => observer.disconnect();
}

/**
 * Virtual list renderer for large datasets
 */
export class VirtualList<T> {
  private items: T[] = [];
  private itemHeight: number;
  private containerHeight: number;
  private scrollTop = 0;
  private visibleStart = 0;
  private visibleEnd = 0;
  private renderCallback: (items: T[], startIndex: number) => void;

  constructor(
    itemHeight: number,
    containerHeight: number,
    renderCallback: (items: T[], startIndex: number) => void
  ) {
    this.itemHeight = itemHeight;
    this.containerHeight = containerHeight;
    this.renderCallback = renderCallback;
  }

  setItems(items: T[]) {
    this.items = items;
    this.updateVisibleRange();
    this.render();
  }

  setScrollTop(scrollTop: number) {
    this.scrollTop = scrollTop;
    this.updateVisibleRange();
    this.render();
  }

  private updateVisibleRange() {
    this.visibleStart = Math.floor(this.scrollTop / this.itemHeight);
    const visibleCount = Math.ceil(this.containerHeight / this.itemHeight);
    this.visibleEnd = Math.min(this.visibleStart + visibleCount + 1, this.items.length);
  }

  private render() {
    const visibleItems = this.items.slice(this.visibleStart, this.visibleEnd);
    this.renderCallback(visibleItems, this.visibleStart);
  }

  getTotalHeight(): number {
    return this.items.length * this.itemHeight;
  }
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  keyGenerator?: (...args: Parameters<T>) => string
): T {
  const cache = new Map<string, ReturnType<T>>();
  
  return ((...args: Parameters<T>) => {
    const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Performance monitor for component rendering
 */
export class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => number {
    const start = performance.now();
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
      return duration;
    };
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  }

  getMetricsSummary(): Record<string, { avg: number; count: number }> {
    const summary: Record<string, { avg: number; count: number }> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      summary[name] = {
        avg: values.reduce((a, b) => a + b, 0) / values.length,
        count: values.length
      };
    }
    
    return summary;
  }
}

/**
 * RequestIdleCallback wrapper for non-critical updates
 */
export function scheduleIdleCallback(
  callback: () => void,
  options?: IdleRequestOptions
): number {
  if ('requestIdleCallback' in window) {
    return requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    return setTimeout(callback, 1) as unknown as number;
  }
}

/**
 * Cancel idle callback
 */
export function cancelIdleCallback(handle: number) {
  if ('cancelIdleCallback' in window) {
    cancelIdleCallback(handle);
  } else {
    clearTimeout(handle);
  }
}
