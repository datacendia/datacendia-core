// =============================================================================
// PACT CONSUMER CONTRACT TESTS
// Frontend (consumer) contract tests against Backend (provider) API
// =============================================================================

import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import path from 'path';

const { like, eachLike, string, integer, boolean, timestamp, uuid } = MatchersV3;

// Helper for ISO datetime matching
const isoDateTime = () => timestamp("yyyy-MM-dd'T'HH:mm:ss.SSSX", '2024-12-16T18:00:00.000Z');

// =============================================================================
// PACT CONFIGURATION
// =============================================================================

const provider = new PactV3({
  consumer: 'DatacendiaFrontend',
  provider: 'DatacendiaBackend',
  dir: path.resolve(process.cwd(), 'pacts'),
  logLevel: 'warn',
});

// =============================================================================
// API CLIENT (simplified for testing)
// =============================================================================

async function apiClient(baseUrl: string, endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${baseUrl}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test-token',
      ...options.headers,
    },
    ...options,
  });
  return {
    status: response.status,
    data: await response.json().catch(() => null),
  };
}

// =============================================================================
// HEALTH CHECK CONTRACT
// =============================================================================

describe('Health Check API Contract', () => {
  it('should return health status', async () => {
    await provider
      .given('the API is healthy')
      .uponReceiving('a request for health status')
      .withRequest({
        method: 'GET',
        path: '/health',
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          status: string('healthy'),
          version: string('1.0.0'),
          timestamp: isoDateTime(),
          services: like({
            database: string('connected'),
            redis: string('connected'),
          }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/health');
      expect(result.status).toBe(200);
      expect(result.data.status).toBe('healthy');
    });
  });
});

// =============================================================================
// DECISIONS API CONTRACT
// =============================================================================

describe('Decisions API Contract', () => {
  it('should list decisions with pagination', async () => {
    await provider
      .given('decisions exist in the system')
      .uponReceiving('a request to list decisions')
      .withRequest({
        method: 'GET',
        path: '/api/v1/decisions',
        query: { page: '1', limit: '20' },
        headers: { Authorization: 'Bearer test-token' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: eachLike({
            id: uuid(),
            title: string('Strategic Decision'),
            description: string('Decision description'),
            status: string('PENDING'),
            priority: string('HIGH'),
            department: string('Engineering'),
            created_at: isoDateTime(),
            updated_at: isoDateTime(),
          }),
          pagination: {
            page: integer(1),
            limit: integer(20),
            total: integer(100),
            totalPages: integer(5),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/decisions?page=1&limit=20');
      expect(result.status).toBe(200);
      expect(result.data.success).toBe(true);
      expect(Array.isArray(result.data.data)).toBe(true);
    });
  });

  it('should create a new decision', async () => {
    const newDecision = {
      title: 'New Strategic Initiative',
      description: 'Evaluate market expansion',
      priority: 'HIGH',
      department: 'Strategy',
    };

    await provider
      .given('user is authenticated')
      .uponReceiving('a request to create a decision')
      .withRequest({
        method: 'POST',
        path: '/api/v1/decisions',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: newDecision,
      })
      .willRespondWith({
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: {
            id: uuid(),
            title: string(newDecision.title),
            description: string(newDecision.description),
            status: string('PENDING'),
            priority: string(newDecision.priority),
            department: string(newDecision.department),
            created_at: isoDateTime(),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/decisions', {
        method: 'POST',
        body: JSON.stringify(newDecision),
      });
      expect(result.status).toBe(201);
      expect(result.data.success).toBe(true);
      expect(result.data.data.title).toBe(newDecision.title);
    });
  });

  it('should get a decision by ID', async () => {
    const decisionId = '123e4567-e89b-12d3-a456-426614174000';

    await provider
      .given('decision exists')
      .uponReceiving('a request to get a decision by ID')
      .withRequest({
        method: 'GET',
        path: `/api/v1/decisions/${decisionId}`,
        headers: { Authorization: 'Bearer test-token' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: {
            id: string(decisionId),
            title: string('Strategic Decision'),
            description: string('Full decision details'),
            status: string('PENDING'),
            priority: string('HIGH'),
            activities: eachLike({
              id: uuid(),
              action: string('CREATED'),
              actor: string('John Doe'),
              timestamp: isoDateTime(),
            }),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, `/api/v1/decisions/${decisionId}`);
      expect(result.status).toBe(200);
      expect(result.data.data.id).toBe(decisionId);
    });
  });
});

// =============================================================================
// COUNCIL API CONTRACT
// =============================================================================

describe('Council API Contract', () => {
  it('should start a council deliberation', async () => {
    const query = {
      topic: 'Should we expand to European market?',
      context: 'Current revenue is $10M, growth rate 20% YoY',
      agents: ['strategist', 'analyst', 'skeptic'],
    };

    await provider
      .given('council agents are available')
      .uponReceiving('a request to start deliberation')
      .withRequest({
        method: 'POST',
        path: '/api/v1/council/query',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer test-token',
        },
        body: query,
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: {
            id: uuid(),
            topic: string(query.topic),
            status: string('in_progress'),
            responses: eachLike({
              agent: string('strategist'),
              role: string('Strategic Advisor'),
              response: string('Based on the data...'),
              confidence: like(0.85),
              timestamp: isoDateTime(),
            }),
            consensus: like({
              recommendation: string('Proceed with caution'),
              confidence: like(0.75),
              dissenting_views: eachLike(string('Risk considerations')),
            }),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/council/query', {
        method: 'POST',
        body: JSON.stringify(query),
      });
      expect(result.status).toBe(200);
      expect(result.data.success).toBe(true);
    });
  });

  it('should list available council agents', async () => {
    await provider
      .given('agents are configured')
      .uponReceiving('a request to list agents')
      .withRequest({
        method: 'GET',
        path: '/api/v1/council/agents',
        headers: { Authorization: 'Bearer test-token' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: eachLike({
            id: string('strategist'),
            name: string('Strategic Advisor'),
            role: string('Provides strategic analysis'),
            personality: string('analytical'),
            expertise: eachLike(string('strategy')),
            available: boolean(true),
          }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/council/agents');
      expect(result.status).toBe(200);
      expect(Array.isArray(result.data.data)).toBe(true);
    });
  });
});

// =============================================================================
// ALERTS API CONTRACT
// =============================================================================

describe('Alerts API Contract', () => {
  it('should list active alerts', async () => {
    await provider
      .given('alerts exist')
      .uponReceiving('a request to list alerts')
      .withRequest({
        method: 'GET',
        path: '/api/v1/alerts',
        query: { acknowledged: 'false' },
        headers: { Authorization: 'Bearer test-token' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: eachLike({
            id: uuid(),
            title: string('High Priority Alert'),
            message: string('Alert description'),
            severity: string('warning'),
            source: string('system'),
            acknowledged: boolean(false),
            created_at: isoDateTime(),
          }),
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/alerts?acknowledged=false');
      expect(result.status).toBe(200);
      expect(result.data.success).toBe(true);
    });
  });
});

// =============================================================================
// AUTHENTICATION API CONTRACT
// =============================================================================

describe('Authentication API Contract', () => {
  it('should authenticate user with valid credentials', async () => {
    await provider
      .given('user exists')
      .uponReceiving('a login request with valid credentials')
      .withRequest({
        method: 'POST',
        path: '/api/v1/auth/login',
        headers: { 'Content-Type': 'application/json' },
        body: {
          email: 'user@example.com',
          password: 'SecurePassword123!',
        },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(true),
          data: {
            token: string('eyJhbGciOiJIUzI1NiIs...'),
            refreshToken: string('refresh-token-value'),
            user: {
              id: uuid(),
              email: string('user@example.com'),
              name: string('Test User'),
              role: string('analyst'),
            },
            expiresIn: integer(3600),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'SecurePassword123!',
        }),
      });
      expect(result.status).toBe(200);
      expect(result.data.data.token).toBeDefined();
    });
  });

  it('should reject invalid credentials', async () => {
    await provider
      .given('user exists')
      .uponReceiving('a login request with invalid credentials')
      .withRequest({
        method: 'POST',
        path: '/api/v1/auth/login',
        headers: { 'Content-Type': 'application/json' },
        body: {
          email: 'user@example.com',
          password: 'wrongpassword',
        },
      })
      .willRespondWith({
        status: 401,
        headers: { 'Content-Type': 'application/json' },
        body: {
          success: boolean(false),
          error: {
            code: string('UNAUTHORIZED'),
            message: string('Invalid credentials'),
          },
        },
      });

    await provider.executeTest(async (mockServer) => {
      const result = await apiClient(mockServer.url, '/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'user@example.com',
          password: 'wrongpassword',
        }),
      });
      expect(result.status).toBe(401);
    });
  });
});
