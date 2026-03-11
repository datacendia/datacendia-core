/**
 * CendiaGateway™ — Rate Limiter
 *
 * Token bucket rate limiter for per-user and per-department request caps.
 * Prevents abuse, controls costs, and enforces fair usage across the organization.
 *
 * Architecture: Dual-layer limiting
 *   Layer 1: Per-user limits (e.g., 100 req/hour)
 *   Layer 2: Per-department limits (e.g., 5000 req/hour)
 *
 * Zero external dependencies — in-memory token bucket with automatic refill.
 *
 * @module services/gateway/RateLimiter
 */

// =============================================================================
// TYPES
// =============================================================================

export interface RateLimitConfig {
  id: string;
  name: string;
  enabled: boolean;

  // Scope
  scope: 'user' | 'department' | 'organization' | 'global';
  scopeValue?: string;          // Specific user/department/org to target (empty = all)

  // Limits
  maxRequests: number;          // Max requests in the window
  windowMs: number;             // Time window in milliseconds
  maxTokensPerWindow?: number;  // Optional: limit by total tokens consumed

  // Burst allowance
  burstMultiplier: number;      // Allow brief bursts (e.g., 1.5 = 50% burst)

  // Action when exceeded
  action: 'block' | 'queue' | 'throttle';
  retryAfterMs?: number;        // Suggested retry delay
  notifyOnExceed: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
  retryAfterMs?: number;
  configId: string;
  configName: string;
  scope: string;
  scopeKey: string;
}

// =============================================================================
// DEFAULT CONFIGS
// =============================================================================

const DEFAULT_CONFIGS: RateLimitConfig[] = [
  {
    id: 'default-user-hourly',
    name: 'Default User Hourly Limit',
    enabled: true,
    scope: 'user',
    maxRequests: 200,
    windowMs: 60 * 60 * 1000,      // 1 hour
    burstMultiplier: 1.5,
    action: 'block',
    notifyOnExceed: false,
  },
  {
    id: 'default-user-daily',
    name: 'Default User Daily Limit',
    enabled: true,
    scope: 'user',
    maxRequests: 2000,
    windowMs: 24 * 60 * 60 * 1000, // 24 hours
    burstMultiplier: 1.0,
    action: 'block',
    notifyOnExceed: true,
  },
  {
    id: 'default-department-hourly',
    name: 'Default Department Hourly Limit',
    enabled: true,
    scope: 'department',
    maxRequests: 5000,
    windowMs: 60 * 60 * 1000,
    burstMultiplier: 1.2,
    action: 'throttle',
    retryAfterMs: 5000,
    notifyOnExceed: true,
  },
  {
    id: 'default-global-minute',
    name: 'Global Per-Minute Safety Valve',
    enabled: true,
    scope: 'global',
    maxRequests: 1000,
    windowMs: 60 * 1000,           // 1 minute
    burstMultiplier: 2.0,
    action: 'block',
    notifyOnExceed: true,
  },
];

// =============================================================================
// TOKEN BUCKET
// =============================================================================

interface Bucket {
  tokens: number;
  maxTokens: number;
  lastRefill: number;
  refillRate: number;   // tokens per ms
  requestCount: number;
  windowStart: number;
}

// =============================================================================
// RATE LIMITER
// =============================================================================

class GatewayRateLimiter {
  private configs: RateLimitConfig[] = [];
  private buckets: Map<string, Bucket> = new Map();

  constructor(configs?: RateLimitConfig[]) {
    this.configs = configs || [...DEFAULT_CONFIGS];
  }

  /**
   * Check if a request is allowed under all applicable rate limits.
   * Returns the most restrictive result.
   */
  check(params: {
    userId: string;
    userDepartment: string;
    organizationId: string;
  }): RateLimitResult {
    const results: RateLimitResult[] = [];

    for (const config of this.configs) {
      if (!config.enabled) continue;

      const scopeKey = this.getScopeKey(config, params);
      if (!scopeKey) continue;

      const result = this.checkBucket(config, scopeKey);
      results.push(result);
    }

    // Return the most restrictive (first denied, or the one with least remaining)
    const denied = results.find(r => !r.allowed);
    if (denied) return denied;

    // All allowed — return the one with fewest remaining
    if (results.length === 0) {
      return {
        allowed: true,
        remaining: Infinity,
        limit: Infinity,
        resetAt: new Date(Date.now() + 60000),
        configId: 'none',
        configName: 'No limits configured',
        scope: 'global',
        scopeKey: 'global',
      };
    }

    return results.sort((a, b) => a.remaining - b.remaining)[0]!;
  }

  /**
   * Consume a token after a request is processed.
   * Call this AFTER the request succeeds to decrement the bucket.
   */
  consume(params: {
    userId: string;
    userDepartment: string;
    organizationId: string;
    tokensUsed?: number;
  }): void {
    for (const config of this.configs) {
      if (!config.enabled) continue;
      const scopeKey = this.getScopeKey(config, params);
      if (!scopeKey) continue;

      const bucket = this.getOrCreateBucket(config, scopeKey);
      bucket.tokens = Math.max(0, bucket.tokens - 1);
      bucket.requestCount++;
    }
  }

  // =========================================================================
  // BUCKET OPERATIONS
  // =========================================================================

  private checkBucket(config: RateLimitConfig, scopeKey: string): RateLimitResult {
    const bucket = this.getOrCreateBucket(config, scopeKey);
    this.refillBucket(bucket, config);

    const effectiveMax = Math.floor(config.maxRequests * config.burstMultiplier);
    const allowed = bucket.tokens > 0;
    const resetAt = new Date(bucket.windowStart + config.windowMs);

    return {
      allowed,
      remaining: Math.max(0, Math.floor(bucket.tokens)),
      limit: config.maxRequests,
      resetAt,
      retryAfterMs: allowed ? undefined : config.retryAfterMs || Math.max(0, resetAt.getTime() - Date.now()),
      configId: config.id,
      configName: config.name,
      scope: config.scope,
      scopeKey,
    };
  }

  private getOrCreateBucket(config: RateLimitConfig, scopeKey: string): Bucket {
    const key = `${config.id}:${scopeKey}`;
    let bucket = this.buckets.get(key);

    if (!bucket) {
      const effectiveMax = Math.floor(config.maxRequests * config.burstMultiplier);
      bucket = {
        tokens: effectiveMax,
        maxTokens: effectiveMax,
        lastRefill: Date.now(),
        refillRate: config.maxRequests / config.windowMs,
        requestCount: 0,
        windowStart: Date.now(),
      };
      this.buckets.set(key, bucket);
    }

    return bucket;
  }

  private refillBucket(bucket: Bucket, config: RateLimitConfig): void {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;

    // Reset window if expired
    if (now - bucket.windowStart >= config.windowMs) {
      bucket.tokens = Math.floor(config.maxRequests * config.burstMultiplier);
      bucket.windowStart = now;
      bucket.requestCount = 0;
      bucket.lastRefill = now;
      return;
    }

    // Gradual refill within window
    const refillAmount = elapsed * bucket.refillRate;
    bucket.tokens = Math.min(bucket.maxTokens, bucket.tokens + refillAmount);
    bucket.lastRefill = now;
  }

  // =========================================================================
  // SCOPE RESOLUTION
  // =========================================================================

  private getScopeKey(config: RateLimitConfig, params: {
    userId: string;
    userDepartment: string;
    organizationId: string;
  }): string | null {
    switch (config.scope) {
      case 'user':
        if (config.scopeValue && config.scopeValue !== params.userId) return null;
        return `user:${params.organizationId}:${params.userId}`;
      case 'department':
        if (config.scopeValue && config.scopeValue !== params.userDepartment) return null;
        return `dept:${params.organizationId}:${params.userDepartment}`;
      case 'organization':
        if (config.scopeValue && config.scopeValue !== params.organizationId) return null;
        return `org:${params.organizationId}`;
      case 'global':
        return 'global';
      default:
        return null;
    }
  }

  // =========================================================================
  // CONFIG MANAGEMENT
  // =========================================================================

  getConfigs(): RateLimitConfig[] { return this.configs; }

  addConfig(config: RateLimitConfig): void { this.configs.push(config); }

  updateConfig(id: string, updates: Partial<RateLimitConfig>): RateLimitConfig | null {
    const idx = this.configs.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.configs[idx] = { ...this.configs[idx]!, ...updates };
    return this.configs[idx]!;
  }

  removeConfig(id: string): boolean {
    const idx = this.configs.findIndex(c => c.id === id);
    if (idx === -1) return false;
    this.configs.splice(idx, 1);
    return true;
  }

  /**
   * Get current usage stats for all active buckets.
   */
  getUsageStats(): Array<{
    configId: string;
    scopeKey: string;
    tokensRemaining: number;
    maxTokens: number;
    requestCount: number;
    utilizationPercent: number;
  }> {
    const stats: any[] = [];
    for (const [key, bucket] of this.buckets.entries()) {
      stats.push({
        configId: key.split(':')[0],
        scopeKey: key.split(':').slice(1).join(':'),
        tokensRemaining: Math.floor(bucket.tokens),
        maxTokens: bucket.maxTokens,
        requestCount: bucket.requestCount,
        utilizationPercent: Math.round((1 - bucket.tokens / bucket.maxTokens) * 100),
      });
    }
    return stats.sort((a, b) => b.utilizationPercent - a.utilizationPercent);
  }

  /**
   * Prune expired buckets to prevent memory growth.
   */
  prune(): number {
    const now = Date.now();
    let pruned = 0;
    for (const [key, bucket] of this.buckets.entries()) {
      // Remove buckets that haven't been used for 2x their window
      const config = this.configs.find(c => key.startsWith(c.id));
      const maxAge = config ? config.windowMs * 2 : 24 * 60 * 60 * 1000;
      if (now - bucket.lastRefill > maxAge) {
        this.buckets.delete(key);
        pruned++;
      }
    }
    return pruned;
  }
}

export default GatewayRateLimiter;
