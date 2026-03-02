// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA LOAD TESTING - K6
// Enterprise performance validation
// Target: 200 concurrent users, 50 Monte Carlo sims/min, 10 Council debates/sec
// =============================================================================

import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { Counter, Rate, Trend } from 'k6/metrics';

// =============================================================================
// CONFIGURATION
// =============================================================================

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3001';
const API_URL = `${BASE_URL}/api`;

// Custom metrics
const decisionLatency = new Trend('decision_latency');
const councilLatency = new Trend('council_deliberation_latency');
const monteCarloLatency = new Trend('monte_carlo_latency');
const chronosLatency = new Trend('chronos_query_latency');
const errorRate = new Rate('errors');
const decisionsProcessed = new Counter('decisions_processed');
const deliberationsCompleted = new Counter('deliberations_completed');
const simulationsRun = new Counter('simulations_run');

// =============================================================================
// TEST OPTIONS
// =============================================================================

export const options = {
  scenarios: {
    // Scenario 1: Baseline load
    baseline: {
      executor: 'constant-vus',
      vus: 50,
      duration: '5m',
      startTime: '0s',
    },
    
    // Scenario 2: Ramp up to target
    ramp_to_target: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 100 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 200 },
        { duration: '2m', target: 0 },
      ],
      startTime: '5m',
    },
    
    // Scenario 3: Spike test
    spike: {
      executor: 'ramping-vus',
      startVUs: 50,
      stages: [
        { duration: '30s', target: 500 },
        { duration: '1m', target: 500 },
        { duration: '30s', target: 50 },
      ],
      startTime: '16m',
    },
    
    // Scenario 4: Council deliberation stress
    council_stress: {
      executor: 'constant-arrival-rate',
      rate: 10, // 10 deliberations per second
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 50,
      maxVUs: 100,
      startTime: '18m',
    },
    
    // Scenario 5: Monte Carlo simulation stress
    monte_carlo_stress: {
      executor: 'constant-arrival-rate',
      rate: 50, // 50 simulations per minute
      timeUnit: '1m',
      duration: '5m',
      preAllocatedVUs: 20,
      maxVUs: 50,
      startTime: '23m',
    },
  },
  
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.01'], // Less than 1% errors
    decision_latency: ['p(95)<3000'], // Decisions under 3s
    council_deliberation_latency: ['p(95)<30000'], // Deliberations under 30s
    monte_carlo_latency: ['p(95)<10000'], // Simulations under 10s
    errors: ['rate<0.05'], // Less than 5% error rate
  },
};

// =============================================================================
// AUTHENTICATION
// =============================================================================

let authToken = null;

export function setup() {
  // Login to get auth token
  const loginRes = http.post(`${API_URL}/auth/login`, JSON.stringify({
    email: 'loadtest@datacendia.com',
    password: 'LoadTest123!',
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
  
  if (loginRes.status === 200) {
    const body = JSON.parse(loginRes.body);
    return { token: body.token };
  }
  
  console.error('Failed to authenticate for load test');
  return { token: null };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getHeaders(data) {
  return {
    'Content-Type': 'application/json',
    'Authorization': data.token ? `Bearer ${data.token}` : '',
  };
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// =============================================================================
// TEST SCENARIOS
// =============================================================================

export default function(data) {
  const headers = getHeaders(data);
  
  group('Health Check', () => {
    const res = http.get(`${BASE_URL}/health`);
    check(res, {
      'health check status is 200': (r) => r.status === 200,
    });
  });
  
  group('Dashboard Load', () => {
    const res = http.get(`${API_URL}/dashboard/summary`, { headers });
    check(res, {
      'dashboard status is 200': (r) => r.status === 200,
      'dashboard has data': (r) => r.json() !== null,
    });
    
    if (res.status !== 200) errorRate.add(1);
  });
  
  group('Decision Operations', () => {
    // List decisions
    const listRes = http.get(`${API_URL}/decisions?limit=20`, { headers });
    check(listRes, {
      'list decisions status is 200': (r) => r.status === 200,
    });
    
    // Create decision
    const startTime = Date.now();
    const createRes = http.post(`${API_URL}/decisions`, JSON.stringify({
      title: `Load Test Decision ${Date.now()}`,
      description: 'Automated load test decision',
      type: randomChoice(['strategic', 'operational', 'tactical']),
      priority: randomChoice(['critical', 'high', 'medium', 'low']),
      stakeholders: ['loadtest-user'],
    }), { headers });
    
    const latency = Date.now() - startTime;
    decisionLatency.add(latency);
    
    check(createRes, {
      'create decision status is 201': (r) => r.status === 201,
    });
    
    if (createRes.status === 201) {
      decisionsProcessed.add(1);
    } else {
      errorRate.add(1);
    }
  });
  
  sleep(randomChoice([0.5, 1, 1.5, 2]));
}

// =============================================================================
// COUNCIL DELIBERATION TEST
// =============================================================================

export function councilDeliberation(data) {
  const headers = getHeaders(data);
  
  group('Council Deliberation', () => {
    const startTime = Date.now();
    
    // Start deliberation
    const deliberationRes = http.post(`${API_URL}/council/deliberations`, JSON.stringify({
      topic: `Load Test Topic ${Date.now()}`,
      context: 'This is an automated load test deliberation for performance validation.',
      agents: ['strategist', 'analyst', 'skeptic'],
      maxRounds: 2,
    }), { headers, timeout: '60s' });
    
    const latency = Date.now() - startTime;
    councilLatency.add(latency);
    
    check(deliberationRes, {
      'deliberation status is 200 or 201': (r) => r.status === 200 || r.status === 201,
      'deliberation completed in time': () => latency < 30000,
    });
    
    if (deliberationRes.status === 200 || deliberationRes.status === 201) {
      deliberationsCompleted.add(1);
    } else {
      errorRate.add(1);
    }
  });
}

// =============================================================================
// MONTE CARLO SIMULATION TEST
// =============================================================================

export function monteCarloSimulation(data) {
  const headers = getHeaders(data);
  
  group('Monte Carlo Simulation', () => {
    const startTime = Date.now();
    
    // Run simulation
    const simRes = http.post(`${API_URL}/simulations/monte-carlo`, JSON.stringify({
      scenarioId: 'load-test-scenario',
      iterations: 1000,
      variables: [
        { name: 'revenue', min: 1000000, max: 5000000, distribution: 'normal' },
        { name: 'costs', min: 500000, max: 2000000, distribution: 'normal' },
        { name: 'growth', min: 0.05, max: 0.25, distribution: 'uniform' },
      ],
      confidenceLevel: 0.95,
    }), { headers, timeout: '30s' });
    
    const latency = Date.now() - startTime;
    monteCarloLatency.add(latency);
    
    check(simRes, {
      'simulation status is 200': (r) => r.status === 200,
      'simulation completed in time': () => latency < 10000,
    });
    
    if (simRes.status === 200) {
      simulationsRun.add(1);
    } else {
      errorRate.add(1);
    }
  });
}

// =============================================================================
// CHRONOS TIME TRAVEL TEST
// =============================================================================

export function chronosTimeline(data) {
  const headers = getHeaders(data);
  
  group('Chronos Timeline', () => {
    const startTime = Date.now();
    
    // Query historical state
    const historyRes = http.get(`${API_URL}/chronos/timeline?` + new URLSearchParams({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString(),
      granularity: 'day',
    }), { headers });
    
    const latency = Date.now() - startTime;
    chronosLatency.add(latency);
    
    check(historyRes, {
      'chronos status is 200': (r) => r.status === 200,
      'chronos returned data': (r) => r.json() !== null,
    });
    
    if (historyRes.status !== 200) errorRate.add(1);
  });
}

// =============================================================================
// CLEANUP
// =============================================================================

export function teardown(data) {
  // Cleanup test data if needed
  console.log('Load test completed');
  console.log(`Decisions processed: ${decisionsProcessed.name}`);
  console.log(`Deliberations completed: ${deliberationsCompleted.name}`);
  console.log(`Simulations run: ${simulationsRun.name}`);
}
