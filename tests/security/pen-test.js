// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DATACENDIA PLATFORM - SECURITY PENETRATION TEST SUITE
 * =============================================================================
 * Automated security testing covering OWASP Top 10 + platform-specific vectors
 * 
 * How to run:
 *   node tests/security/pen-test.js [--url http://localhost:3001] [--verbose]
 * 
 * Categories:
 *   1. Authentication & Authorization
 *   2. Injection (SQL, NoSQL, Command, XSS)
 *   3. Broken Access Control
 *   4. Security Misconfiguration
 *   5. Cryptographic Failures
 *   6. SSRF / CSRF
 *   7. Rate Limiting
 *   8. API-specific attacks
 */

const BASE_URL = process.argv.find(a => a.startsWith('--url='))?.split('=')[1]
  || process.argv[process.argv.indexOf('--url') + 1]
  || 'http://localhost:3001';
const VERBOSE = process.argv.includes('--verbose');

let passed = 0;
let failed = 0;
let warnings = 0;
const results = [];

function log(level, category, test, details) {
  const entry = { level, category, test, details, timestamp: new Date().toISOString() };
  results.push(entry);
  if (level === 'PASS') { passed++; if (VERBOSE) console.log(`  ✅ ${test}`); }
  else if (level === 'FAIL') { failed++; console.log(`  ❌ ${test}: ${details}`); }
  else if (level === 'WARN') { warnings++; console.log(`  ⚠️  ${test}: ${details}`); }
}

async function request(method, path, body, headers = {}) {
  const url = `${BASE_URL}${path}`;
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let json = null;
    try { json = JSON.parse(text); } catch {}
    return { status: res.status, headers: Object.fromEntries(res.headers.entries()), text, json };
  } catch (err) {
    return { status: 0, headers: {}, text: '', json: null, error: err.message };
  }
}

// =============================================================================
// 1. AUTHENTICATION & AUTHORIZATION
// =============================================================================
async function testAuth() {
  console.log('\n📋 1. Authentication & Authorization');

  // 1.1 Login with invalid credentials should fail
  const bad = await request('POST', '/api/v1/auth/login', { email: 'fake@test.com', password: 'wrong' });
  if (bad.status === 401 || bad.status === 400 || bad.status === 403) {
    log('PASS', 'auth', 'Invalid credentials rejected');
  } else {
    log('FAIL', 'auth', 'Invalid credentials not properly rejected', `Got status ${bad.status}`);
  }

  // 1.2 Empty credentials
  const empty = await request('POST', '/api/v1/auth/login', { email: '', password: '' });
  if (empty.status >= 400) {
    log('PASS', 'auth', 'Empty credentials rejected');
  } else {
    log('FAIL', 'auth', 'Empty credentials accepted', `Got status ${empty.status}`);
  }

  // 1.3 SQL injection in login
  const sqli = await request('POST', '/api/v1/auth/login', { email: "admin'--", password: "' OR 1=1--" });
  if (sqli.status >= 400 && sqli.status !== 500) {
    log('PASS', 'auth', 'SQL injection in login rejected safely');
  } else if (sqli.status === 500) {
    log('WARN', 'auth', 'SQL injection caused server error', 'Should return 400/401 not 500');
  } else {
    log('FAIL', 'auth', 'SQL injection may have succeeded', `Got status ${sqli.status}`);
  }

  // 1.4 JWT manipulation - invalid token
  const fakeJwt = await request('GET', '/api/v1/auth/me', null, { Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYWNrZXIifQ.fakesig' });
  if (fakeJwt.status === 401 || fakeJwt.status === 403) {
    log('PASS', 'auth', 'Forged JWT rejected');
  } else {
    log('FAIL', 'auth', 'Forged JWT not rejected', `Got status ${fakeJwt.status}`);
  }

  // 1.5 No auth header
  const noAuth = await request('GET', '/api/v1/auth/me');
  if (noAuth.status === 401 || noAuth.status === 403) {
    log('PASS', 'auth', 'Missing auth header rejected');
  } else {
    log('FAIL', 'auth', 'Missing auth header not rejected', `Got status ${noAuth.status}`);
  }

  // 1.6 Algorithm confusion (none alg)
  const noneAlg = await request('GET', '/api/v1/auth/me', null, {
    Authorization: 'Bearer eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiJ9.'
  });
  if (noneAlg.status === 401 || noneAlg.status === 403) {
    log('PASS', 'auth', 'JWT none algorithm rejected');
  } else {
    log('FAIL', 'auth', 'JWT none algorithm accepted', `Got status ${noneAlg.status}`);
  }
}

// =============================================================================
// 2. INJECTION ATTACKS
// =============================================================================
async function testInjection() {
  console.log('\n📋 2. Injection Attacks');

  const injectionPayloads = [
    { name: 'SQL UNION', payload: "' UNION SELECT * FROM users--" },
    { name: 'SQL DROP', payload: "'; DROP TABLE users;--" },
    { name: 'NoSQL injection', payload: '{"$gt":""}' },
    { name: 'Command injection', payload: '; cat /etc/passwd' },
    { name: 'XSS script tag', payload: '<script>alert(1)</script>' },
    { name: 'XSS img onerror', payload: '<img src=x onerror=alert(1)>' },
    { name: 'XSS event handler', payload: '" onmouseover="alert(1)"' },
    { name: 'Path traversal', payload: '../../../etc/passwd' },
    { name: 'LDAP injection', payload: '*)(&' },
    { name: 'Template injection', payload: '{{7*7}}' },
  ];

  for (const { name, payload } of injectionPayloads) {
    const res = await request('POST', '/api/v1/auth/login', { email: payload, password: payload });
    if (res.status !== 500 && res.status !== 200) {
      log('PASS', 'injection', `${name} rejected safely`);
    } else if (res.status === 500) {
      log('WARN', 'injection', `${name} caused server error`, 'Should sanitize input');
    } else {
      log('FAIL', 'injection', `${name} may have been processed`, `Status ${res.status}`);
    }
  }

  // Test XSS in query params
  const xssQuery = await request('GET', '/api/v1/health?callback=<script>alert(1)</script>');
  if (!xssQuery.text.includes('<script>alert(1)</script>')) {
    log('PASS', 'injection', 'XSS in query params not reflected');
  } else {
    log('FAIL', 'injection', 'XSS reflected in response', 'Output not sanitized');
  }
}

// =============================================================================
// 3. BROKEN ACCESS CONTROL
// =============================================================================
async function testAccessControl() {
  console.log('\n📋 3. Broken Access Control');

  // 3.1 IDOR - try to access other users
  const idor = await request('GET', '/api/v1/users/00000000-0000-0000-0000-000000000001');
  if (idor.status === 401 || idor.status === 403 || idor.status === 404) {
    log('PASS', 'access', 'IDOR protected - cannot access arbitrary user');
  } else {
    log('WARN', 'access', 'IDOR may be possible', `Got status ${idor.status}`);
  }

  // 3.2 Admin endpoint without auth
  const adminEndpoints = [
    '/api/v1/admin/users',
    '/api/v1/admin/settings',
    '/api/v1/admin/audit',
    '/api/v1/organizations',
  ];

  for (const endpoint of adminEndpoints) {
    const res = await request('GET', endpoint);
    if (res.status === 401 || res.status === 403 || res.status === 404) {
      log('PASS', 'access', `Admin endpoint ${endpoint} protected`);
    } else {
      log('FAIL', 'access', `Admin endpoint ${endpoint} not protected`, `Got status ${res.status}`);
    }
  }

  // 3.3 HTTP method tampering
  const methodTamper = await request('DELETE', '/api/v1/auth/me');
  if (methodTamper.status !== 200) {
    log('PASS', 'access', 'HTTP method tampering handled');
  } else {
    log('FAIL', 'access', 'DELETE on auth/me succeeded', 'Unexpected method allowed');
  }
}

// =============================================================================
// 4. SECURITY MISCONFIGURATION
// =============================================================================
async function testMisconfiguration() {
  console.log('\n📋 4. Security Misconfiguration');

  const health = await request('GET', '/api/v1/health');

  // 4.1 Security headers
  const requiredHeaders = {
    'x-content-type-options': 'nosniff',
    'x-frame-options': ['DENY', 'SAMEORIGIN'],
  };

  for (const [header, expected] of Object.entries(requiredHeaders)) {
    const value = health.headers[header];
    if (value) {
      const matches = Array.isArray(expected) ? expected.includes(value) : value === expected;
      if (matches) {
        log('PASS', 'config', `Security header ${header} set correctly`);
      } else {
        log('WARN', 'config', `Security header ${header} value unexpected`, `Got: ${value}`);
      }
    } else {
      log('WARN', 'config', `Security header ${header} missing`);
    }
  }

  // 4.2 Server header information disclosure
  if (!health.headers['server'] || !health.headers['server'].includes('version')) {
    log('PASS', 'config', 'Server version not disclosed in headers');
  } else {
    log('WARN', 'config', 'Server version disclosed', health.headers['server']);
  }

  // 4.3 Error detail disclosure
  const badRoute = await request('GET', '/api/v1/nonexistent-endpoint-xyz');
  if (badRoute.text && !badRoute.text.includes('stack') && !badRoute.text.includes('node_modules')) {
    log('PASS', 'config', 'Stack traces not leaked in errors');
  } else {
    log('FAIL', 'config', 'Stack trace potentially leaked in error response');
  }

  // 4.4 CORS configuration
  const cors = await request('GET', '/api/v1/health', null, { Origin: 'https://evil.com' });
  const acao = cors.headers['access-control-allow-origin'];
  if (!acao || acao !== '*') {
    log('PASS', 'config', 'CORS not wildcard open');
  } else {
    log('WARN', 'config', 'CORS allows all origins', 'Consider restricting');
  }

  // 4.5 Debug endpoints
  const debugEndpoints = ['/debug', '/api/debug', '/_debug', '/api/v1/debug', '/env', '/api/env'];
  for (const ep of debugEndpoints) {
    const res = await request('GET', ep);
    if (res.status === 404 || res.status === 401 || res.status === 403) {
      log('PASS', 'config', `Debug endpoint ${ep} not exposed`);
    } else {
      log('FAIL', 'config', `Debug endpoint ${ep} accessible`, `Status ${res.status}`);
    }
  }
}

// =============================================================================
// 5. RATE LIMITING
// =============================================================================
async function testRateLimiting() {
  console.log('\n📋 5. Rate Limiting');

  // 5.1 Brute force login attempts
  const attempts = 20;
  let blocked = false;
  for (let i = 0; i < attempts; i++) {
    const res = await request('POST', '/api/v1/auth/login', {
      email: 'bruteforce@test.com',
      password: `wrong-password-${i}`,
    });
    if (res.status === 429) {
      blocked = true;
      log('PASS', 'ratelimit', `Login rate limiting triggered after ${i + 1} attempts`);
      break;
    }
  }
  if (!blocked) {
    log('WARN', 'ratelimit', `No rate limiting after ${attempts} login attempts`, 'Consider adding rate limiting to auth endpoints');
  }

  // 5.2 General API rate limiting
  const rapidRequests = 50;
  let apiBlocked = false;
  for (let i = 0; i < rapidRequests; i++) {
    const res = await request('GET', '/api/v1/health');
    if (res.status === 429) {
      apiBlocked = true;
      log('PASS', 'ratelimit', `API rate limiting triggered after ${i + 1} rapid requests`);
      break;
    }
  }
  if (!apiBlocked) {
    log('WARN', 'ratelimit', 'No general API rate limiting detected', 'Consider adding rate limiting');
  }
}

// =============================================================================
// 6. SSRF & REQUEST SMUGGLING
// =============================================================================
async function testSSRF() {
  console.log('\n📋 6. SSRF & Request Smuggling');

  // 6.1 SSRF via URL parameters
  const ssrfPayloads = [
    'http://169.254.169.254/latest/meta-data/',
    'http://localhost:6379/',
    'http://127.0.0.1:5432/',
    'file:///etc/passwd',
    'http://[::1]:3001/',
  ];

  for (const payload of ssrfPayloads) {
    const res = await request('POST', '/api/v1/integrations/test', { url: payload });
    if (res.status !== 200 || (res.json && !res.json.success)) {
      log('PASS', 'ssrf', `SSRF payload blocked: ${payload.substring(0, 40)}`);
    } else {
      log('FAIL', 'ssrf', `SSRF payload may have reached internal service`, payload);
    }
  }
}

// =============================================================================
// 7. API-SPECIFIC ATTACKS
// =============================================================================
async function testAPISpecific() {
  console.log('\n📋 7. API-Specific Security');

  // 7.1 Mass assignment
  const massAssign = await request('POST', '/api/v1/auth/register', {
    email: 'test@test.com',
    password: 'Test123!',
    role: 'admin',
    isAdmin: true,
    permissions: ['*'],
  });
  if (massAssign.status !== 200 || (massAssign.json && massAssign.json.role !== 'admin')) {
    log('PASS', 'api', 'Mass assignment of role/admin prevented');
  } else {
    log('FAIL', 'api', 'Mass assignment may be possible', 'Role escalation via registration');
  }

  // 7.2 Oversized payload
  const bigPayload = { data: 'x'.repeat(10 * 1024 * 1024) }; // 10MB
  const bigRes = await request('POST', '/api/v1/auth/login', bigPayload);
  if (bigRes.status === 413 || bigRes.status === 400 || bigRes.status === 0) {
    log('PASS', 'api', 'Oversized payload rejected');
  } else {
    log('WARN', 'api', 'Oversized payload may have been processed', `Status ${bigRes.status}`);
  }

  // 7.3 Content-type confusion
  const htmlRes = await request('POST', '/api/v1/auth/login', null, { 'Content-Type': 'text/html' });
  if (htmlRes.status >= 400) {
    log('PASS', 'api', 'Content-type confusion handled');
  } else {
    log('WARN', 'api', 'Server accepted non-JSON content type', `Status ${htmlRes.status}`);
  }
}

// =============================================================================
// MAIN RUNNER
// =============================================================================
async function main() {
  console.log('='.repeat(70));
  console.log('  DATACENDIA PLATFORM - SECURITY PENETRATION TEST');
  console.log(`  Target: ${BASE_URL}`);
  console.log(`  Started: ${new Date().toISOString()}`);
  console.log('='.repeat(70));

  // Check if server is reachable
  const health = await request('GET', '/api/v1/health');
  if (health.status === 0) {
    console.error(`\n❌ Server not reachable at ${BASE_URL}`);
    console.error('Start the server first: npm run dev');
    process.exit(1);
  }

  await testAuth();
  await testInjection();
  await testAccessControl();
  await testMisconfiguration();
  await testRateLimiting();
  await testSSRF();
  await testAPISpecific();

  console.log('\n' + '='.repeat(70));
  console.log('  RESULTS SUMMARY');
  console.log('='.repeat(70));
  console.log(`  ✅ Passed:   ${passed}`);
  console.log(`  ❌ Failed:   ${failed}`);
  console.log(`  ⚠️  Warnings: ${warnings}`);
  console.log(`  Total:      ${passed + failed + warnings}`);
  console.log('='.repeat(70));

  if (failed > 0) {
    console.log('\n❌ CRITICAL: Security issues detected. Review failures above.');
    process.exit(1);
  } else if (warnings > 0) {
    console.log('\n⚠️  Security hardening recommended. Review warnings above.');
    process.exit(0);
  } else {
    console.log('\n✅ All security checks passed.');
    process.exit(0);
  }
}

main().catch(err => {
  console.error('Pen test failed:', err);
  process.exit(1);
});
