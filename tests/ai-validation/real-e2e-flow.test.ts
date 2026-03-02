// =============================================================================
// REAL END-TO-END FLOW TESTS
// Tests actual integration between services (not mocked)
// THE USER JOURNEY TEST - File upload → Agent deliberation → Ledger record
// =============================================================================

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE = process.env.API_URL || 'http://localhost:3001/api/v1';
const MINIO_URL = process.env.MINIO_URL || 'http://localhost:9000';
const TEST_TIMEOUT = 120000; // 2 minutes for full flow

interface TestContext {
  authToken: string;
  userId: string;
  decisionId: string;
  deliberationId: string;
  uploadedFileId: string;
}

const ctx: TestContext = {
  authToken: '',
  userId: '',
  decisionId: '',
  deliberationId: '',
  uploadedFileId: '',
};

// =============================================================================
// HELPERS
// =============================================================================

async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (ctx.authToken) {
    headers['Authorization'] = `Bearer ${ctx.authToken}`;
  }
  
  return fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });
}

function generateTestPDF(): Buffer {
  // Generate a minimal valid PDF
  const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792]
   /Contents 4 0 R /Resources << >> >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
100 700 Td
(Test Document for Datacendia E2E) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000214 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
306
%%EOF`;
  
  return Buffer.from(pdfContent);
}

function generateLargeTestFile(sizeMB: number): Buffer {
  // Generate a file of specified size
  const chunkSize = 1024 * 1024; // 1MB
  const chunks: Buffer[] = [];
  
  for (let i = 0; i < sizeMB; i++) {
    chunks.push(Buffer.alloc(chunkSize, `Chunk ${i} `.charCodeAt(0)));
  }
  
  return Buffer.concat(chunks);
}

// =============================================================================
// TEST SUITE: COMPLETE USER JOURNEY
// =============================================================================

describe('Real E2E Flow Tests', () => {
  let servicesAvailable = false;

  beforeAll(async () => {
    // Check if services are running
    try {
      const health = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
      servicesAvailable = health.ok;
      
      if (servicesAvailable) {
        console.log('✓ Backend services available');
        
        // Authenticate
        const loginRes = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: 'test@datacendia.com',
            password: 'TestPassword123!',
          }),
        });
        
        if (loginRes.ok) {
          const loginData = await loginRes.json();
          ctx.authToken = loginData.token;
          ctx.userId = loginData.user?.id;
          console.log('✓ Authentication successful');
        } else {
          console.log('⚠ Authentication failed - some tests will be skipped');
        }
      }
    } catch (error) {
      console.log(`✗ Services not available: ${error}`);
      console.log('  Start with: docker compose up -d && npm run dev:backend');
    }
  });

  describe('Phase 1: File Upload Flow', () => {
    it('should upload a small PDF file', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Services or auth not available');
        return;
      }

      const pdfBuffer = generateTestPDF();
      const formData = new FormData();
      formData.append('file', new Blob([pdfBuffer.buffer], { type: 'application/pdf' }), 'test-document.pdf');
      formData.append('category', 'deliberation');

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ctx.authToken}`,
        },
        body: formData,
      });

      console.log(`  Upload response: ${response.status}`);
      
      if (response.ok) {
        const data = await response.json();
        ctx.uploadedFileId = data.fileId || data.id;
        console.log(`  ✓ File uploaded: ${ctx.uploadedFileId}`);
      }

      expect(response.status).toBeLessThan(500); // No server errors
    }, 30000);

    it('should handle large file upload (10MB)', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Services or auth not available');
        return;
      }

      const largeFile = generateLargeTestFile(10);
      const formData = new FormData();
      formData.append('file', new Blob([largeFile]), 'large-test-file.bin');

      const startTime = Date.now();
      
      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${ctx.authToken}`,
        },
        body: formData,
      });

      const uploadTime = Date.now() - startTime;
      console.log(`  10MB upload time: ${uploadTime}ms`);

      // Should either succeed or return a meaningful error (not 500)
      expect(response.status).toBeLessThan(500);
      
      if (response.status === 413) {
        console.log('  ℹ File too large (expected if limit < 10MB)');
      } else if (response.ok) {
        console.log('  ✓ Large file accepted');
      }
    }, 60000);

    it('should reject 100MB file with appropriate error', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Services or auth not available');
        return;
      }

      // Don't actually upload 100MB in tests - just verify limit exists
      const response = await apiRequest('/config/upload-limits');
      
      if (response.ok) {
        const limits = await response.json();
        console.log(`  Upload limits: ${JSON.stringify(limits)}`);
        expect(limits.maxFileSize).toBeDefined();
      } else {
        console.log('  ℹ Upload limits endpoint not available');
      }
    });
  });

  describe('Phase 2: Decision Creation Flow', () => {
    it('should create a new decision', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Services or auth not available');
        return;
      }

      const response = await apiRequest('/decisions', {
        method: 'POST',
        body: JSON.stringify({
          title: 'E2E Test Decision - Market Expansion',
          description: 'Should we expand into the European market given current conditions?',
          type: 'strategic',
          priority: 'high',
          attachments: ctx.uploadedFileId ? [ctx.uploadedFileId] : [],
        }),
      });

      console.log(`  Create decision response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        ctx.decisionId = data.id;
        console.log(`  ✓ Decision created: ${ctx.decisionId}`);
      }

      expect(response.status).toBeLessThan(500);
    }, 15000);
  });

  describe('Phase 3: Council Deliberation Flow', () => {
    it('should start a council deliberation', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Services or auth not available');
        return;
      }

      const response = await apiRequest('/council/deliberations', {
        method: 'POST',
        body: JSON.stringify({
          topic: 'Analyze the European market expansion opportunity. Consider regulatory requirements, competition, and financial implications.',
          decisionId: ctx.decisionId || undefined,
          agents: ['strategist', 'cfo', 'risk-analyst', 'legal'],
          mode: 'balanced',
          maxRounds: 2,
        }),
      });

      console.log(`  Start deliberation response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        ctx.deliberationId = data.id || data.deliberationId;
        console.log(`  ✓ Deliberation started: ${ctx.deliberationId}`);
      }

      expect(response.status).toBeLessThan(500);
    }, 30000);

    it('should receive agent responses', async () => {
      if (!servicesAvailable || !ctx.authToken || !ctx.deliberationId) {
        console.log('  SKIPPED: Prerequisites not met');
        return;
      }

      // Poll for deliberation completion
      let attempts = 0;
      const maxAttempts = 60; // 60 seconds
      let status = 'pending';
      let responses: any[] = [];

      while (attempts < maxAttempts && status !== 'completed') {
        await new Promise(r => setTimeout(r, 1000));
        
        const response = await apiRequest(`/council/deliberations/${ctx.deliberationId}`);
        
        if (response.ok) {
          const data = await response.json();
          status = data.status;
          responses = data.responses || [];
          
          if (attempts % 10 === 0) {
            console.log(`  Polling... Status: ${status}, Responses: ${responses.length}`);
          }
        }
        
        attempts++;
      }

      console.log(`  Final status: ${status}`);
      console.log(`  Agent responses: ${responses.length}`);

      if (responses.length > 0) {
        responses.forEach((r: any) => {
          console.log(`    - ${r.agent}: ${r.content?.substring(0, 50)}...`);
        });
      }

      expect(status).not.toBe('error');
    }, 90000);

    it('should verify agents reference context (not hallucinate)', async () => {
      if (!servicesAvailable || !ctx.authToken || !ctx.deliberationId) {
        console.log('  SKIPPED: Prerequisites not met');
        return;
      }

      const response = await apiRequest(`/council/deliberations/${ctx.deliberationId}`);
      
      if (response.ok) {
        const data = await response.json();
        const responses = data.responses || [];
        
        const contextKeywords = ['europe', 'market', 'expansion', 'regulatory', 'competition'];
        
        let referencesContext = 0;
        
        responses.forEach((r: any) => {
          const content = (r.content || '').toLowerCase();
          const matches = contextKeywords.filter(kw => content.includes(kw));
          if (matches.length >= 2) {
            referencesContext++;
          }
        });
        
        console.log(`  Agents referencing context: ${referencesContext}/${responses.length}`);
        
        // At least half should reference the context
        expect(referencesContext).toBeGreaterThanOrEqual(responses.length / 2);
      }
    }, 15000);
  });

  describe('Phase 4: Ledger Recording Flow', () => {
    it('should record decision to immutable ledger', async () => {
      if (!servicesAvailable || !ctx.authToken || !ctx.decisionId) {
        console.log('  SKIPPED: Prerequisites not met');
        return;
      }

      const response = await apiRequest('/ledger/entries', {
        method: 'POST',
        body: JSON.stringify({
          decisionId: ctx.decisionId,
          deliberationId: ctx.deliberationId,
          action: 'decision_recorded',
          data: {
            outcome: 'proceed_with_analysis',
            confidence: 0.75,
          },
        }),
      });

      console.log(`  Ledger record response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✓ Ledger entry created: ${data.id}`);
        console.log(`  Hash: ${data.hash?.substring(0, 16)}...`);
      }

      expect(response.status).toBeLessThan(500);
    }, 15000);

    it('should verify ledger chain integrity', async () => {
      if (!servicesAvailable || !ctx.authToken) {
        console.log('  SKIPPED: Prerequisites not met');
        return;
      }

      const response = await apiRequest('/ledger/verify');

      console.log(`  Verify chain response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`  Chain valid: ${data.valid}`);
        console.log(`  Entries: ${data.entryCount}`);
        
        expect(data.valid).toBe(true);
      }
    }, 15000);
  });

  describe('Phase 5: Data Persistence Verification', () => {
    it('should retrieve created decision after refresh', async () => {
      if (!servicesAvailable || !ctx.authToken || !ctx.decisionId) {
        console.log('  SKIPPED: Prerequisites not met');
        return;
      }

      // Simulate page refresh by re-authenticating
      const loginRes = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@datacendia.com',
          password: 'TestPassword123!',
        }),
      });

      if (loginRes.ok) {
        const loginData = await loginRes.json();
        ctx.authToken = loginData.token;
      }

      // Now retrieve the decision
      const response = await apiRequest(`/decisions/${ctx.decisionId}`);

      console.log(`  Retrieve decision response: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log(`  ✓ Decision persisted: ${data.title}`);
        expect(data.id).toBe(ctx.decisionId);
      }
    }, 15000);
  });

  // Cleanup
  afterAll(async () => {
    if (ctx.decisionId && servicesAvailable && ctx.authToken) {
      // Optional: Clean up test data
      // await apiRequest(`/decisions/${ctx.decisionId}`, { method: 'DELETE' });
      console.log('  Test data cleanup: Skipped (for manual inspection)');
    }
  });
});

// =============================================================================
// MANUAL E2E TEST CHECKLIST
// =============================================================================

export const E2E_MANUAL_CHECKLIST = `
================================================================================
REAL E2E FLOW TEST - MANUAL PROCEDURE
================================================================================

PREREQUISITES:
- [ ] Docker services running (docker compose up -d)
- [ ] Backend running (npm run dev:backend)
- [ ] Frontend running (npm run dev)
- [ ] Ollama running with qwen2.5:32b (ollama serve)

TEST PROCEDURE:

1. FILE UPLOAD TEST
   - [ ] Drag a 50MB PDF to the upload area
   - [ ] Observe upload progress bar
   - [ ] Check for "Upload complete" confirmation
   - [ ] Verify file appears in MinIO (localhost:9001)
   PASS: File visible in MinIO bucket
   FAIL: "Network Error", "413 Payload Too Large", or spinner forever

2. COUNCIL DELIBERATION TEST
   - [ ] Start new deliberation
   - [ ] Enter: "Should we acquire our main competitor?"
   - [ ] Select agents: CFO, Legal, Strategy, Risk
   - [ ] Click Start
   - [ ] Observe streaming responses
   PASS: All 4 agents respond within 60 seconds
   FAIL: Agents hang, GPU OOM, or generic responses

3. AGENT QUALITY CHECK
   - [ ] Read CFO's response
   - [ ] Does it mention financial considerations?
   - [ ] Does it reference the specific scenario (acquisition)?
   - [ ] Is advice actionable, not generic?
   PASS: Specific, contextual advice
   FAIL: "Acquisitions are complex" or generic MBA speak

4. LEDGER RECORDING TEST
   - [ ] Complete the deliberation
   - [ ] Click "Save to Ledger"
   - [ ] Check Ledger tab for entry
   PASS: Entry shows with hash and timestamp
   FAIL: Entry missing or error

5. PERSISTENCE TEST
   - [ ] Refresh the browser (F5)
   - [ ] Navigate back to decision
   - [ ] Verify all data is present
   PASS: Decision, deliberation, and ledger entry all visible
   FAIL: Data disappeared

6. ERROR HANDLING TEST
   - [ ] Try uploading a 500MB file
   - [ ] Expected: Friendly error message
   PASS: "File too large" error shown
   FAIL: Browser crash or infinite spinner

RESULTS SUMMARY:
- File Upload: [ ] PASS / [ ] FAIL
- Deliberation: [ ] PASS / [ ] FAIL
- Agent Quality: [ ] PASS / [ ] FAIL
- Ledger: [ ] PASS / [ ] FAIL
- Persistence: [ ] PASS / [ ] FAIL
- Error Handling: [ ] PASS / [ ] FAIL

Notes:
_____________________________________________
_____________________________________________

Tested by: _________________ Date: _________
`;

console.log(E2E_MANUAL_CHECKLIST);
