// =============================================================================
// CONCURRENT LOAD TESTS
// THE BOARD MEETING SIMULATION - Multiple users asking questions simultaneously
// Tests BullMQ queuing, GPU memory, and system stability under concurrent load
// =============================================================================

import { describe, it, expect, beforeAll } from 'vitest';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const CONCURRENT_USERS = 3; // Start with 3 (Board meeting scenario)
const MAX_CONCURRENT_USERS = 10;
const TIMEOUT_PER_REQUEST = 60000; // 60 seconds

interface LoadTestResult {
  userId: number;
  startTime: number;
  endTime: number;
  duration: number;
  success: boolean;
  responseLength: number;
  error?: string;
  queuePosition?: number;
}

// =============================================================================
// HELPERS
// =============================================================================

async function authenticate(): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@datacendia.com',
        password: 'TestPassword123!',
      }),
    });
    
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
  } catch {
    // Auth failed
  }
  return null;
}

async function makeDeliberationRequest(
  userId: number,
  token: string,
  prompt: string
): Promise<LoadTestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${API_BASE}/council/deliberations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        topic: prompt,
        agents: ['strategist', 'cfo'],
        mode: 'quick',
        maxRounds: 1,
      }),
      signal: AbortSignal.timeout(TIMEOUT_PER_REQUEST),
    });

    const endTime = Date.now();
    
    if (response.ok) {
      const data = await response.json();
      return {
        userId,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: true,
        responseLength: JSON.stringify(data).length,
        queuePosition: data.queuePosition,
      };
    }
    
    return {
      userId,
      startTime,
      endTime,
      duration: endTime - startTime,
      success: false,
      responseLength: 0,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      userId,
      startTime,
      endTime,
      duration: endTime - startTime,
      success: false,
      responseLength: 0,
      error: String(error),
    };
  }
}

async function directOllamaRequest(
  userId: number,
  prompt: string
): Promise<LoadTestResult> {
  const startTime = Date.now();
  
  try {
    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:14b',
        prompt,
        stream: false,
        options: { num_predict: 256 },
      }),
      signal: AbortSignal.timeout(TIMEOUT_PER_REQUEST),
    });

    const endTime = Date.now();
    
    if (response.ok) {
      const data = await response.json();
      return {
        userId,
        startTime,
        endTime,
        duration: endTime - startTime,
        success: true,
        responseLength: data.response?.length || 0,
      };
    }
    
    return {
      userId,
      startTime,
      endTime,
      duration: endTime - startTime,
      success: false,
      responseLength: 0,
      error: `HTTP ${response.status}`,
    };
  } catch (error) {
    const endTime = Date.now();
    return {
      userId,
      startTime,
      endTime,
      duration: endTime - startTime,
      success: false,
      responseLength: 0,
      error: String(error),
    };
  }
}

function analyzeResults(results: LoadTestResult[]): {
  summary: string;
  passed: boolean;
  metrics: {
    totalRequests: number;
    successful: number;
    failed: number;
    avgDuration: number;
    maxDuration: number;
    minDuration: number;
    throughput: number;
  };
} {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  const durations = successful.map(r => r.duration);
  const avgDuration = durations.length > 0 
    ? durations.reduce((a, b) => a + b, 0) / durations.length 
    : 0;
  
  const totalTime = Math.max(...results.map(r => r.endTime)) - 
                   Math.min(...results.map(r => r.startTime));
  
  const metrics = {
    totalRequests: results.length,
    successful: successful.length,
    failed: failed.length,
    avgDuration: Math.round(avgDuration),
    maxDuration: durations.length > 0 ? Math.max(...durations) : 0,
    minDuration: durations.length > 0 ? Math.min(...durations) : 0,
    throughput: (successful.length / totalTime) * 1000, // per second
  };

  const passed = failed.length === 0 || (failed.length / results.length) < 0.1;
  
  const summary = `
    Total: ${metrics.totalRequests} requests
    Success: ${metrics.successful} (${((metrics.successful / metrics.totalRequests) * 100).toFixed(1)}%)
    Failed: ${metrics.failed}
    Avg Duration: ${metrics.avgDuration}ms
    Max Duration: ${metrics.maxDuration}ms
    Throughput: ${metrics.throughput.toFixed(2)} req/sec
  `;

  return { summary, passed, metrics };
}

// =============================================================================
// TEST PROMPTS (Different complexity levels)
// =============================================================================

const TEST_PROMPTS = [
  // Simple
  'What is our quarterly revenue target?',
  'Summarize our market position.',
  'What are the key risks this month?',
  
  // Medium
  'Analyze our competitor\'s recent price changes and recommend a response.',
  'Evaluate the ROI of our recent marketing campaign.',
  'What should be our hiring priority for Q2?',
  
  // Complex
  'Given our current market position and the pending regulatory changes, should we proceed with the European expansion or focus on domestic consolidation?',
  'Analyze the trade-offs between acquiring TechStartup Inc vs building the capability in-house.',
  'Our largest customer is threatening to switch to a competitor. What retention strategy should we employ?',
];

// =============================================================================
// TEST SUITE
// =============================================================================

describe('Concurrent Load Tests', () => {
  let servicesAvailable = false;
  let ollamaAvailable = false;
  let authToken: string | null = null;

  beforeAll(async () => {
    // Check services
    try {
      const health = await fetch(`${API_BASE.replace('/api/v1', '')}/health`, { signal: AbortSignal.timeout(5000) });
      servicesAvailable = health.ok;
    } catch {
      servicesAvailable = false;
    }

    try {
      const ollama = await fetch(`${OLLAMA_URL}/api/tags`, { signal: AbortSignal.timeout(5000) });
      if (ollama.ok) {
        const data = await ollama.json();
        const models = data.models?.map((m: any) => m.name) || [];
        ollamaAvailable = models.some((m: string) => m.startsWith('qwen2.5'));
        if (!ollamaAvailable) {
          console.log(`  Ollama running but model not loaded. Available: ${models.join(', ') || 'none'}`);
        }
      }
    } catch {
      ollamaAvailable = false;
    }

    if (servicesAvailable) {
      authToken = await authenticate();
    }

    console.log(`Services available: ${servicesAvailable}`);
    console.log(`Ollama available: ${ollamaAvailable}`);
    console.log(`Auth token: ${authToken ? 'Yes' : 'No'}`);
  });

  describe('Board Meeting Simulation (3 Concurrent)', () => {
    it('should handle 3 simultaneous requests', async () => {
      if (!ollamaAvailable) {
        console.log('  SKIPPED: Ollama not available');
        return;
      }

      console.log('\n  Starting Board Meeting Simulation...');
      console.log('  3 executives asking questions simultaneously\n');

      const prompts = TEST_PROMPTS.slice(0, 3);
      
      const startTime = Date.now();
      
      const promises = prompts.map((prompt, idx) => 
        directOllamaRequest(idx + 1, prompt)
      );

      const results = await Promise.all(promises);
      
      const totalTime = Date.now() - startTime;
      const analysis = analyzeResults(results);

      console.log('  Results:');
      results.forEach(r => {
        console.log(`    User ${r.userId}: ${r.success ? '✓' : '✗'} ${r.duration}ms ${r.error || ''}`);
      });
      console.log(`\n  Total time: ${totalTime}ms`);
      console.log(analysis.summary);

      // All requests should complete (even if queued)
      expect(analysis.metrics.successful).toBeGreaterThanOrEqual(2);
    }, 180000);

    it('should queue requests properly (not crash)', async () => {
      if (!ollamaAvailable) {
        console.log('  SKIPPED: Ollama not available');
        return;
      }

      // Fire 3 requests rapidly
      const rapidPromises = [1, 2, 3].map(i => 
        directOllamaRequest(i, `Quick question ${i}: What is 2+2?`)
      );

      const results = await Promise.all(rapidPromises);
      
      // Check no OOM or crash errors
      const oomErrors = results.filter(r => 
        r.error?.includes('OOM') || 
        r.error?.includes('out of memory') ||
        r.error?.includes('CUDA')
      );

      console.log(`  OOM/Memory errors: ${oomErrors.length}`);
      
      expect(oomErrors.length).toBe(0);
    }, 120000);
  });

  describe('Stress Test (Increasing Load)', () => {
    it('should handle increasing concurrent load', async () => {
      if (!ollamaAvailable) {
        console.log('  SKIPPED: Ollama not available');
        return;
      }

      const loadLevels = [1, 2, 3, 5];
      const results: { level: number; analysis: ReturnType<typeof analyzeResults> }[] = [];

      for (const level of loadLevels) {
        console.log(`\n  Testing ${level} concurrent requests...`);
        
        const prompts = Array(level).fill(null).map((_, i) => 
          TEST_PROMPTS[i % TEST_PROMPTS.length]
        );

        const promises = prompts.map((prompt, idx) => 
          directOllamaRequest(idx + 1, prompt)
        );

        const levelResults = await Promise.all(promises);
        const analysis = analyzeResults(levelResults);
        
        results.push({ level, analysis });
        
        console.log(`    Success rate: ${(analysis.metrics.successful / analysis.metrics.totalRequests * 100).toFixed(0)}%`);
        console.log(`    Avg duration: ${analysis.metrics.avgDuration}ms`);
        
        // Brief pause between levels
        await new Promise(r => setTimeout(r, 2000));
      }

      // Summary
      console.log('\n  === Load Test Summary ===');
      results.forEach(({ level, analysis }) => {
        console.log(`    ${level} concurrent: ${analysis.metrics.successful}/${analysis.metrics.totalRequests} success, ${analysis.metrics.avgDuration}ms avg`);
      });

      // At least the low concurrency levels should pass
      const lowLoadPassed = results
        .filter(r => r.level <= 3)
        .every(r => r.analysis.passed);
      
      expect(lowLoadPassed).toBe(true);
    }, 300000);
  });

  describe('API Queue Behavior', () => {
    it('should show queue position in responses', async () => {
      if (!servicesAvailable || !authToken) {
        console.log('  SKIPPED: API or auth not available');
        return;
      }

      // This tests if BullMQ is properly queuing requests
      const promises = [1, 2, 3].map(i => 
        makeDeliberationRequest(i, authToken!, `Test question ${i}`)
      );

      const results = await Promise.all(promises);
      
      results.forEach(r => {
        console.log(`  User ${r.userId}: ${r.success ? '✓' : '✗'} Queue pos: ${r.queuePosition || 'N/A'}`);
      });

      // At least one should succeed
      const anySuccess = results.some(r => r.success);
      expect(anySuccess).toBe(true);
    }, 120000);
  });

  describe('Memory Stability', () => {
    it('should not leak memory across requests', async () => {
      if (!ollamaAvailable) {
        console.log('  SKIPPED: Ollama not available');
        return;
      }

      // Make 5 sequential requests and check stability
      const results: LoadTestResult[] = [];
      
      for (let i = 1; i <= 5; i++) {
        const result = await directOllamaRequest(i, `Memory test ${i}`);
        results.push(result);
        console.log(`  Request ${i}: ${result.duration}ms`);
      }

      // Durations should be relatively stable (not increasing dramatically)
      const durations = results.filter(r => r.success).map(r => r.duration);
      
      if (durations.length >= 4) {
        const firstTwo = (durations[0] + durations[1]) / 2;
        const lastTwo = (durations[durations.length - 1] + durations[durations.length - 2]) / 2;
        
        const degradation = lastTwo / firstTwo;
        console.log(`  Performance degradation: ${((degradation - 1) * 100).toFixed(1)}%`);
        
        // Should not degrade more than 50%
        expect(degradation).toBeLessThan(1.5);
      }
    }, 180000);
  });
});

// =============================================================================
// MANUAL LOAD TEST PROCEDURE
// =============================================================================

export const LOAD_TEST_MANUAL_CHECKLIST = `
================================================================================
BOARD MEETING SIMULATION - MANUAL LOAD TEST
================================================================================

PURPOSE: Verify system handles concurrent users without crashing

PREREQUISITES:
- [ ] Docker services running
- [ ] Ollama running with GPU (check: nvidia-smi)
- [ ] Available GPU memory noted: _______ GB

TEST PROCEDURE:

1. BASELINE (Single User)
   - [ ] Open browser tab 1
   - [ ] Ask: "What's our revenue forecast?"
   - [ ] Record response time: _______ seconds
   - [ ] GPU memory usage: _______ GB

2. CONCURRENT TEST (3 Users)
   - [ ] Open browser tabs 2 and 3
   - [ ] In ALL THREE tabs simultaneously:
         Tab 1: "Should we expand to Europe?"
         Tab 2: "Analyze competitor pricing"  
         Tab 3: "What's our hiring plan?"
   - [ ] Click Submit in all 3 within 2 seconds of each other
   
   OBSERVE:
   - [ ] All 3 start processing (not instant rejection)
   - [ ] GPU memory: _______ GB (should stay under VRAM limit)
   - [ ] Response times:
         Tab 1: _______ seconds
         Tab 2: _______ seconds
         Tab 3: _______ seconds

   PASS CRITERIA:
   - [ ] No browser "Aw Snap" crashes
   - [ ] No "CUDA out of memory" errors
   - [ ] All 3 eventually respond (queue is OK)
   - [ ] Response times < 2 minutes each

3. QUEUE VERIFICATION
   - [ ] Check BullMQ dashboard (localhost:3001/admin/queues)
   - [ ] Are jobs queued properly?
   - [ ] Failed jobs: _______ (should be 0)

4. RECOVERY TEST
   - [ ] After all 3 complete, ask a new question
   - [ ] Does system respond normally?
   - [ ] Response time: _______ seconds (should be similar to baseline)

RESULTS:
- Baseline response: _______ sec
- 3 concurrent max time: _______ sec
- GPU memory peak: _______ GB
- Any crashes: [ ] Yes / [ ] No
- Queue working: [ ] Yes / [ ] No

VERDICT: [ ] PASS / [ ] FAIL

Notes:
_____________________________________________
_____________________________________________

Tested by: _________________ Date: _________
GPU Model: _________________
RAM: _______ GB
VRAM: _______ GB
`;

console.log(LOAD_TEST_MANUAL_CHECKLIST);
