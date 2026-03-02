// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA PLATFORM - K6 LOAD TEST
 * =============================================================================
 * Tests API performance under load
 * 
 * What this does:
 * - Simulates 100-500 concurrent users
 * - Tests API response times
 * - Measures throughput (requests per second)
 * - Identifies performance bottlenecks
 * 
 * How to run:
 * k6 run tests/load/k6-api-load-test.js
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const apiDuration = new Trend('api_duration');
const requestCount = new Counter('requests');

// Test configuration
export const options = {
  stages: [
    { duration: '1m', target: 50 },   // Ramp up to 50 users over 1 minute
    { duration: '3m', target: 50 },   // Stay at 50 users for 3 minutes
    { duration: '1m', target: 100 },  // Ramp up to 100 users
    { duration: '3m', target: 100 },  // Stay at 100 users for 3 minutes
    { duration: '1m', target: 200 },  // Spike to 200 users
    { duration: '2m', target: 200 },  // Stay at 200 users
    { duration: '1m', target: 0 },    // Ramp down to 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500', 'p(99)<1000'], // 95% of requests under 500ms, 99% under 1s
    'http_req_failed': ['rate<0.01'],                 // Less than 1% errors
    'errors': ['rate<0.05'],                          // Less than 5% application errors
  },
};

const BASE_URL = __ENV.API_URL || 'http://localhost:3001';

// Test data
const testCredentials = {
  email: 'admin@datacendia.com',
  password: 'DatacendiaAdmin2024!',
};

let authToken = '';

export function setup() {
  // Login once to get auth token
  const loginRes = http.post(`${BASE_URL}/api/v1/auth/login`, JSON.stringify(testCredentials), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    authToken = body.data?.accessToken || body.accessToken || '';
  }
  
  return { authToken };
}

export default function (data) {
  const token = data.authToken || authToken;
  
  // Test 1: Health check (no auth required)
  {
    const res = http.get(`${BASE_URL}/api/v1/health`);
    const success = check(res, {
      'health check status 200': (r) => r.status === 200,
      'health check has status field': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.data?.status !== undefined;
        } catch {
          return false;
        }
      },
    });
    
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
    requestCount.add(1);
  }
  
  sleep(0.5);
  
  // Test 2: List languages (no auth required)
  {
    const res = http.get(`${BASE_URL}/api/v1/i18n/languages`);
    const success = check(res, {
      'languages status 200': (r) => r.status === 200,
      'languages returns array': (r) => {
        try {
          const body = JSON.parse(r.body);
          return Array.isArray(body.languages);
        } catch {
          return false;
        }
      },
    });
    
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
    requestCount.add(1);
  }
  
  sleep(0.5);
  
  // Test 3: List integrations (no auth required)
  {
    const res = http.get(`${BASE_URL}/api/v1/integrations`);
    const success = check(res, {
      'integrations status 200': (r) => r.status === 200,
    });
    
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
    requestCount.add(1);
  }
  
  sleep(0.5);
  
  // Test 4: Get current user (auth required)
  if (token) {
    const res = http.get(`${BASE_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const success = check(res, {
      'auth/me status 200': (r) => r.status === 200,
      'auth/me returns user': (r) => {
        try {
          const body = JSON.parse(r.body);
          return body.data?.email !== undefined || body.email !== undefined;
        } catch {
          return false;
        }
      },
    });
    
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
    requestCount.add(1);
  }
  
  sleep(0.5);
  
  // Test 5: List council agents (auth required)
  if (token) {
    const res = http.get(`${BASE_URL}/api/v1/council/agents`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    const success = check(res, {
      'council/agents status 200': (r) => r.status === 200,
    });
    
    errorRate.add(!success);
    apiDuration.add(res.timings.duration);
    requestCount.add(1);
  }
  
  sleep(1);
}

export function teardown(data) {
  console.log('Load test completed');
  console.log(`Auth token was: ${data.authToken ? 'obtained' : 'not obtained'}`);
}
