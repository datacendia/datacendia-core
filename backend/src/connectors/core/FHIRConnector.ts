// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * FHIR CONNECTOR - HL7 FHIR R4 Healthcare Interoperability
 * =============================================================================
 * Enterprise FHIR client supporting SMART on FHIR authorization,
 * bulk data export, and standard FHIR operations.
 */

import { HttpConnector, HttpConnectorConfig } from './HttpConnector.js';
import { ConnectorMetadata } from '../BaseConnector.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export interface FHIRConnectorConfig extends HttpConnectorConfig {
  fhirVersion: 'R4' | 'STU3' | 'DSTU2';
  smartAuth?: {
    clientId: string;
    privateKey: string;
    tokenUrl: string;
    scope: string;
  };
  tenant?: string;
}

export interface FHIRResource {
  resourceType: string;
  id?: string;
  meta?: {
    versionId?: string;
    lastUpdated?: string;
    profile?: string[];
  };
  [key: string]: unknown;
}

export interface FHIRBundle {
  resourceType: 'Bundle';
  type: 'searchset' | 'batch' | 'transaction' | 'history' | 'collection';
  total?: number;
  link?: Array<{ relation: string; url: string }>;
  entry?: Array<{
    fullUrl?: string;
    resource: FHIRResource;
    search?: { mode: string; score?: number };
  }>;
}

export interface FHIROperationOutcome {
  resourceType: 'OperationOutcome';
  issue: Array<{
    severity: 'fatal' | 'error' | 'warning' | 'information';
    code: string;
    diagnostics?: string;
    details?: { text: string };
  }>;
}

// =============================================================================
// FHIR CONNECTOR
// =============================================================================

export abstract class FHIRConnector extends HttpConnector {
  protected fhirConfig: FHIRConnectorConfig;
  protected capabilityStatement?: FHIRResource;

  constructor(config: FHIRConnectorConfig) {
    super({
      ...config,
      headers: {
        'Accept': 'application/fhir+json',
        'Content-Type': 'application/fhir+json',
        ...config.headers,
      },
    });
    this.fhirConfig = config;
  }

  // ---------------------------------------------------------------------------
  // SMART ON FHIR AUTH
  // ---------------------------------------------------------------------------

  protected override async getAuthHeaders(): Promise<Record<string, string>> {
    if (this.fhirConfig.smartAuth) {
      const token = await this.getSmartToken();
      return { 'Authorization': `Bearer ${token}` };
    }
    return super.getAuthHeaders();
  }

  protected async getSmartToken(): Promise<string> {
    const smart = this.fhirConfig.smartAuth!;

    // Check cache
    if (this.tokenCache && this.tokenCache.expiresAt > Date.now() + 60000) {
      return this.tokenCache.accessToken;
    }

    // Create client assertion JWT
    const jwt = await this.createClientAssertion(smart);

    // Request token
    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
      client_assertion: jwt,
      scope: smart.scope,
    });

    const response = await fetch(smart.tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
    });

    if (!response.ok) {
      throw new Error(`SMART token request failed: ${response.status}`);
    }

    const data = await response.json() as { access_token: string; expires_in: number };

    this.tokenCache = {
      accessToken: data.access_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };

    return this.tokenCache.accessToken;
  }

  protected async createClientAssertion(smart: NonNullable<FHIRConnectorConfig['smartAuth']>): Promise<string> {
    const header = { alg: 'RS384', typ: 'JWT' };
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: smart.clientId,
      sub: smart.clientId,
      aud: smart.tokenUrl,
      jti: crypto.randomUUID(),
      exp: now + 300,
      iat: now,
    };

    const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url');
    const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const unsigned = `${headerB64}.${payloadB64}`;

    const sign = crypto.createSign('RSA-SHA384');
    sign.update(unsigned);
    const signature = sign.sign(smart.privateKey, 'base64url');

    return `${unsigned}.${signature}`;
  }

  // ---------------------------------------------------------------------------
  // FHIR OPERATIONS
  // ---------------------------------------------------------------------------

  async getCapabilityStatement(): Promise<FHIRResource> {
    if (this.capabilityStatement) {
      return this.capabilityStatement;
    }

    this.capabilityStatement = await this.request<FHIRResource>('GET', '/metadata');
    return this.capabilityStatement;
  }

  async read(resourceType: string, id: string): Promise<FHIRResource> {
    return this.request<FHIRResource>('GET', `/${resourceType}/${id}`);
  }

  async vread(resourceType: string, id: string, versionId: string): Promise<FHIRResource> {
    return this.request<FHIRResource>('GET', `/${resourceType}/${id}/_history/${versionId}`);
  }

  async search(
    resourceType: string,
    params: Record<string, string | string[]>
  ): Promise<FHIRBundle> {
    const searchParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      searchParams[key] = Array.isArray(value) ? value.join(',') : value;
    }
    return this.request<FHIRBundle>('GET', `/${resourceType}`, { params: searchParams });
  }

  async searchAll(
    resourceType: string,
    params: Record<string, string | string[]>,
    maxPages = 100
  ): Promise<FHIRResource[]> {
    const resources: FHIRResource[] = [];
    let bundle = await this.search(resourceType, params);
    let pageCount = 0;

    while (bundle.entry && pageCount < maxPages) {
      resources.push(...bundle.entry.map(e => e.resource));

      const nextLink = bundle.link?.find(l => l.relation === 'next');
      if (!nextLink) break;

      // Fetch next page
      const nextUrl = new URL(nextLink.url);
      const nextPath = nextUrl.pathname + nextUrl.search;
      bundle = await this.request<FHIRBundle>('GET', nextPath);
      pageCount++;
    }

    return resources;
  }

  async create(resource: FHIRResource): Promise<FHIRResource> {
    return this.request<FHIRResource>('POST', `/${resource.resourceType}`, { body: resource });
  }

  async update(resource: FHIRResource): Promise<FHIRResource> {
    if (!resource.id) {
      throw new Error('Resource must have an id for update');
    }
    return this.request<FHIRResource>('PUT', `/${resource.resourceType}/${resource.id}`, { body: resource });
  }

  async delete(resourceType: string, id: string): Promise<void> {
    await this.request<void>('DELETE', `/${resourceType}/${id}`);
  }

  async history(resourceType: string, id?: string): Promise<FHIRBundle> {
    const path = id ? `/${resourceType}/${id}/_history` : `/${resourceType}/_history`;
    return this.request<FHIRBundle>('GET', path);
  }

  async operation(
    name: string,
    params?: FHIRResource,
    resourceType?: string,
    id?: string
  ): Promise<FHIRResource> {
    let path = '';
    if (resourceType && id) {
      path = `/${resourceType}/${id}/$${name}`;
    } else if (resourceType) {
      path = `/${resourceType}/$${name}`;
    } else {
      path = `/$${name}`;
    }

    if (params) {
      return this.request<FHIRResource>('POST', path, { body: params });
    }
    return this.request<FHIRResource>('GET', path);
  }

  // ---------------------------------------------------------------------------
  // BULK DATA EXPORT
  // ---------------------------------------------------------------------------

  async initiateExport(options?: {
    resourceTypes?: string[];
    since?: string;
    outputFormat?: string;
  }): Promise<string> {
    const params: Record<string, string> = {
      _outputFormat: options?.outputFormat || 'application/fhir+ndjson',
    };

    if (options?.resourceTypes) {
      params._type = options.resourceTypes.join(',');
    }
    if (options?.since) {
      params._since = options.since;
    }

    const response = await this.request<{ headers: Record<string, string> }>(
      'GET',
      '/$export',
      { params, headers: { 'Prefer': 'respond-async' } }
    );

    // The content-location header contains the status URL
    return (response as any).headers?.['content-location'] || '';
  }

  async checkExportStatus(statusUrl: string): Promise<{
    status: 'in-progress' | 'completed' | 'error';
    output?: Array<{ type: string; url: string }>;
    error?: FHIROperationOutcome;
  }> {
    try {
      const response = await fetch(statusUrl, {
        headers: await this.getAuthHeaders(),
      });

      if (response.status === 202) {
        return { status: 'in-progress' };
      }

      if (response.ok) {
        const data = await response.json() as { output: Array<{ type: string; url: string }> };
        return { status: 'completed', output: data.output };
      }

      const error = await response.json() as FHIROperationOutcome;
      return { status: 'error', error };
    } catch (error) {
      return { status: 'error' };
    }
  }

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  protected async performHealthCheck(): Promise<void> {
    await this.getCapabilityStatement();
  }

  // ---------------------------------------------------------------------------
  // DATA FETCH
  // ---------------------------------------------------------------------------

  async fetchData(params?: Record<string, unknown>): Promise<FHIRResource[]> {
    const resourceType = (params?.resourceType as string) || 'Patient';
    const searchParams = (params?.search as Record<string, string>) || { _count: '100' };
    return this.searchAll(resourceType, searchParams);
  }
}
