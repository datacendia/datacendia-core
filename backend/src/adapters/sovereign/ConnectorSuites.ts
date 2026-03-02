/**
 * Data Adapter — Connector Suites
 *
 * Data transformation adapter between internal and external formats.
 *
 * @exports ConnectorSuiteManager, SalesforceSuite, SAPSuite, WorkdaySuite, ServiceNowSuite, Microsoft365Suite, OracleSuite, SnowflakeSuite
 * @module adapters/sovereign/ConnectorSuites
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * CONNECTOR SUITES - Pre-configured Adapter Templates
 * =============================================================================
 * 
 * 16 Connector Suites built on 6 Universal Adapters:
 * 
 * Universal Adapters (6):
 *   1. Database Adapter
 *   2. Webhook Adapter
 *   3. File Watcher Adapter
 *   4. FHIR Adapter
 *   5. FIX Adapter
 *   6. MQTT Adapter
 * 
 * Connector Suites (10 additional pre-configured templates):
 *   7. Salesforce Suite
 *   8. SAP Suite
 *   9. Workday Suite
 *   10. ServiceNow Suite
 *   11. Microsoft 365 Suite
 *   12. Oracle Suite
 *   13. Snowflake Suite
 *   14. Atlassian Suite
 *   15. HubSpot Suite
 *   16. Zendesk Suite
 * 
 * Each suite is a pre-configured template that uses one or more universal adapters
 * with vendor-specific schemas, endpoints, and field mappings.
 * 
 * IMPORTANT: Client must provide their own credentials for all suites.
 * We provide the configuration template; they provide the authentication.
 */

import { DatabaseConfig } from './DatabaseAdapter.js';
import { WebhookConfig } from './WebhookIngestAdapter.js';
import { FileWatcherConfig } from './FileWatcherAdapter.js';
import { RiskTier } from './SovereignAdapter.js';

// =============================================================================
// CONNECTOR SUITE TYPES
// =============================================================================

export interface ConnectorSuiteConfig {
  id: string;
  name: string;
  description: string;
  vendor: string;
  category: 'CRM' | 'ERP' | 'HR' | 'ITSM' | 'Productivity' | 'DataWarehouse' | 'Support' | 'Marketing';
  riskTier: RiskTier;
  underlyingAdapters: string[];
  requiredCredentials: string[];
  optionalCredentials: string[];
  defaultConfig: Record<string, unknown>;
  fieldMappings: Record<string, string>;
  webhookEvents?: string[];
  apiEndpoints?: Record<string, string>;
  documentation: string;
}

export interface ConnectorSuiteInstance {
  suiteId: string;
  config: ConnectorSuiteConfig;
  credentials: Record<string, string>;
  customMappings: Record<string, string> | undefined;
  enabled: boolean;
  lastSync: Date | undefined;
  status: 'configured' | 'connected' | 'error' | 'disconnected';
}

// =============================================================================
// SALESFORCE SUITE
// =============================================================================

export const SalesforceSuite: ConnectorSuiteConfig = {
  id: 'salesforce',
  name: 'Salesforce Suite',
  description: 'Connect to Salesforce CRM for accounts, contacts, opportunities, and custom objects',
  vendor: 'Salesforce',
  category: 'CRM',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook', 'database'],
  requiredCredentials: [
    'SALESFORCE_CLIENT_ID',
    'SALESFORCE_CLIENT_SECRET',
    'SALESFORCE_INSTANCE_URL',
  ],
  optionalCredentials: [
    'SALESFORCE_REFRESH_TOKEN',
    'SALESFORCE_USERNAME',
    'SALESFORCE_SECURITY_TOKEN',
  ],
  defaultConfig: {
    apiVersion: 'v59.0',
    objects: ['Account', 'Contact', 'Opportunity', 'Lead', 'Case'],
    pollIntervalMs: 300000, // 5 minutes
    batchSize: 2000,
  },
  fieldMappings: {
    'Account.Name': 'company_name',
    'Account.Industry': 'industry',
    'Contact.Email': 'email',
    'Contact.FirstName': 'first_name',
    'Contact.LastName': 'last_name',
    'Opportunity.Amount': 'deal_value',
    'Opportunity.StageName': 'deal_stage',
    'Opportunity.CloseDate': 'expected_close_date',
  },
  webhookEvents: [
    'Account.created', 'Account.updated', 'Account.deleted',
    'Contact.created', 'Contact.updated', 'Contact.deleted',
    'Opportunity.created', 'Opportunity.updated', 'Opportunity.deleted',
  ],
  apiEndpoints: {
    query: '/services/data/{version}/query',
    sobjects: '/services/data/{version}/sobjects',
    composite: '/services/data/{version}/composite',
  },
  documentation: 'https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/',
};

// =============================================================================
// SAP SUITE
// =============================================================================

export const SAPSuite: ConnectorSuiteConfig = {
  id: 'sap',
  name: 'SAP Suite',
  description: 'Connect to SAP S/4HANA, ECC, or BW via OData or RFC',
  vendor: 'SAP',
  category: 'ERP',
  riskTier: RiskTier.REGULATED,
  underlyingAdapters: ['database', 'webhook'],
  requiredCredentials: [
    'SAP_HOST',
    'SAP_CLIENT',
    'SAP_USERNAME',
    'SAP_PASSWORD',
  ],
  optionalCredentials: [
    'SAP_SYSTEM_NUMBER',
    'SAP_ROUTER_STRING',
    'SAP_LANGUAGE',
  ],
  defaultConfig: {
    protocol: 'odata', // 'odata' or 'rfc'
    apiVersion: 'v4',
    entities: ['BusinessPartner', 'SalesOrder', 'PurchaseOrder', 'Material', 'CostCenter'],
    pollIntervalMs: 600000, // 10 minutes
  },
  fieldMappings: {
    'BusinessPartner.BusinessPartner': 'partner_id',
    'BusinessPartner.BusinessPartnerName': 'partner_name',
    'SalesOrder.SalesOrder': 'order_id',
    'SalesOrder.TotalNetAmount': 'order_total',
    'Material.Material': 'material_id',
    'Material.MaterialDescription': 'material_name',
  },
  apiEndpoints: {
    metadata: '/sap/opu/odata/sap/{service}/$metadata',
    entity: '/sap/opu/odata/sap/{service}/{entity}',
  },
  documentation: 'https://api.sap.com/',
};

// =============================================================================
// WORKDAY SUITE
// =============================================================================

export const WorkdaySuite: ConnectorSuiteConfig = {
  id: 'workday',
  name: 'Workday Suite',
  description: 'Connect to Workday HCM for employee, organization, and compensation data',
  vendor: 'Workday',
  category: 'HR',
  riskTier: RiskTier.REGULATED,
  underlyingAdapters: ['webhook', 'database'],
  requiredCredentials: [
    'WORKDAY_TENANT',
    'WORKDAY_CLIENT_ID',
    'WORKDAY_CLIENT_SECRET',
    'WORKDAY_REFRESH_TOKEN',
  ],
  optionalCredentials: [
    'WORKDAY_USERNAME',
    'WORKDAY_PASSWORD',
  ],
  defaultConfig: {
    apiVersion: 'v40.0',
    resources: ['workers', 'organizations', 'jobProfiles', 'compensationPlans'],
    pollIntervalMs: 3600000, // 1 hour (HR data doesn't change frequently)
  },
  fieldMappings: {
    'Worker.workerID': 'employee_id',
    'Worker.primaryWorkEmail': 'email',
    'Worker.legalName.firstName': 'first_name',
    'Worker.legalName.lastName': 'last_name',
    'Worker.primarySupervisoryOrganization': 'department',
    'Worker.businessTitle': 'job_title',
  },
  apiEndpoints: {
    workers: '/ccx/api/v1/{tenant}/workers',
    organizations: '/ccx/api/v1/{tenant}/organizations',
    reports: '/ccx/service/customreport2/{tenant}/{report}',
  },
  documentation: 'https://community.workday.com/sites/default/files/file-hosting/restapi/',
};

// =============================================================================
// SERVICENOW SUITE
// =============================================================================

export const ServiceNowSuite: ConnectorSuiteConfig = {
  id: 'servicenow',
  name: 'ServiceNow Suite',
  description: 'Connect to ServiceNow ITSM for incidents, changes, and CMDB',
  vendor: 'ServiceNow',
  category: 'ITSM',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook', 'database'],
  requiredCredentials: [
    'SERVICENOW_INSTANCE',
    'SERVICENOW_USERNAME',
    'SERVICENOW_PASSWORD',
  ],
  optionalCredentials: [
    'SERVICENOW_CLIENT_ID',
    'SERVICENOW_CLIENT_SECRET',
  ],
  defaultConfig: {
    tables: ['incident', 'change_request', 'cmdb_ci', 'sys_user', 'kb_knowledge'],
    pollIntervalMs: 60000, // 1 minute (incidents need fast updates)
    sysparmLimit: 1000,
  },
  fieldMappings: {
    'incident.number': 'ticket_number',
    'incident.short_description': 'title',
    'incident.description': 'description',
    'incident.priority': 'priority',
    'incident.state': 'status',
    'incident.assigned_to': 'assignee',
    'change_request.number': 'change_number',
    'cmdb_ci.name': 'asset_name',
  },
  webhookEvents: [
    'incident.created', 'incident.updated', 'incident.resolved',
    'change_request.created', 'change_request.approved', 'change_request.implemented',
  ],
  apiEndpoints: {
    table: '/api/now/table/{table}',
    import: '/api/now/import/{table}',
    attachment: '/api/now/attachment',
  },
  documentation: 'https://developer.servicenow.com/dev.do#!/reference/api',
};

// =============================================================================
// MICROSOFT 365 SUITE
// =============================================================================

export const Microsoft365Suite: ConnectorSuiteConfig = {
  id: 'microsoft365',
  name: 'Microsoft 365 Suite',
  description: 'Connect to SharePoint, Teams, Outlook, and OneDrive via Microsoft Graph',
  vendor: 'Microsoft',
  category: 'Productivity',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook', 'file-watcher'],
  requiredCredentials: [
    'AZURE_TENANT_ID',
    'AZURE_CLIENT_ID',
    'AZURE_CLIENT_SECRET',
  ],
  optionalCredentials: [
    'AZURE_REDIRECT_URI',
    'SHAREPOINT_SITE_ID',
  ],
  defaultConfig: {
    scopes: ['https://graph.microsoft.com/.default'],
    resources: ['sites', 'drives', 'teams', 'users', 'messages'],
    pollIntervalMs: 300000, // 5 minutes
  },
  fieldMappings: {
    'user.displayName': 'full_name',
    'user.mail': 'email',
    'user.department': 'department',
    'driveItem.name': 'file_name',
    'driveItem.webUrl': 'file_url',
    'message.subject': 'email_subject',
    'message.from': 'sender',
  },
  webhookEvents: [
    'driveItem.created', 'driveItem.updated', 'driveItem.deleted',
    'message.created',
    'team.created', 'channel.created',
  ],
  apiEndpoints: {
    me: '/v1.0/me',
    users: '/v1.0/users',
    sites: '/v1.0/sites',
    drives: '/v1.0/drives',
    teams: '/v1.0/teams',
  },
  documentation: 'https://learn.microsoft.com/en-us/graph/api/overview',
};

// =============================================================================
// ORACLE SUITE
// =============================================================================

export const OracleSuite: ConnectorSuiteConfig = {
  id: 'oracle',
  name: 'Oracle Suite',
  description: 'Connect to Oracle ERP Cloud, HCM Cloud, or on-prem Oracle DB',
  vendor: 'Oracle',
  category: 'ERP',
  riskTier: RiskTier.REGULATED,
  underlyingAdapters: ['database'],
  requiredCredentials: [
    'ORACLE_HOST',
    'ORACLE_PORT',
    'ORACLE_SERVICE_NAME',
    'ORACLE_USERNAME',
    'ORACLE_PASSWORD',
  ],
  optionalCredentials: [
    'ORACLE_WALLET_LOCATION',
    'ORACLE_TNS_ADMIN',
  ],
  defaultConfig: {
    connectionType: 'thin', // 'thin' or 'oci8'
    poolMin: 2,
    poolMax: 10,
    prefetchRows: 1000,
  },
  fieldMappings: {
    'HR.EMPLOYEES.EMPLOYEE_ID': 'employee_id',
    'HR.EMPLOYEES.FIRST_NAME': 'first_name',
    'HR.EMPLOYEES.LAST_NAME': 'last_name',
    'HR.EMPLOYEES.EMAIL': 'email',
    'HR.EMPLOYEES.DEPARTMENT_ID': 'department_id',
  },
  apiEndpoints: {
    // For Oracle Cloud
    erp: '/fscmRestApi/resources/latest',
    hcm: '/hcmRestApi/resources/latest',
  },
  documentation: 'https://docs.oracle.com/en/cloud/saas/index.html',
};

// =============================================================================
// SNOWFLAKE SUITE
// =============================================================================

export const SnowflakeSuite: ConnectorSuiteConfig = {
  id: 'snowflake',
  name: 'Snowflake Suite',
  description: 'Connect to Snowflake Data Cloud for analytics and data sharing',
  vendor: 'Snowflake',
  category: 'DataWarehouse',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['database'],
  requiredCredentials: [
    'SNOWFLAKE_ACCOUNT',
    'SNOWFLAKE_USERNAME',
    'SNOWFLAKE_PASSWORD',
    'SNOWFLAKE_WAREHOUSE',
    'SNOWFLAKE_DATABASE',
  ],
  optionalCredentials: [
    'SNOWFLAKE_SCHEMA',
    'SNOWFLAKE_ROLE',
    'SNOWFLAKE_PRIVATE_KEY',
  ],
  defaultConfig: {
    authenticator: 'snowflake', // 'snowflake', 'externalbrowser', 'oauth'
    clientSessionKeepAlive: true,
    queryTimeout: 300000, // 5 minutes
  },
  fieldMappings: {
    // User-defined based on their schema
  },
  apiEndpoints: {
    sql: '/api/v2/statements',
    warehouse: '/api/v2/warehouses',
  },
  documentation: 'https://docs.snowflake.com/en/developer-guide/sql-api',
};

// =============================================================================
// ATLASSIAN SUITE
// =============================================================================

export const AtlassianSuite: ConnectorSuiteConfig = {
  id: 'atlassian',
  name: 'Atlassian Suite',
  description: 'Connect to Jira, Confluence, and Bitbucket',
  vendor: 'Atlassian',
  category: 'Productivity',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook'],
  requiredCredentials: [
    'ATLASSIAN_DOMAIN',
    'ATLASSIAN_EMAIL',
    'ATLASSIAN_API_TOKEN',
  ],
  optionalCredentials: [
    'JIRA_PROJECT_KEY',
    'CONFLUENCE_SPACE_KEY',
  ],
  defaultConfig: {
    products: ['jira', 'confluence'],
    pollIntervalMs: 60000, // 1 minute
    maxResults: 100,
  },
  fieldMappings: {
    'issue.key': 'ticket_id',
    'issue.summary': 'title',
    'issue.description': 'description',
    'issue.status.name': 'status',
    'issue.priority.name': 'priority',
    'issue.assignee.displayName': 'assignee',
    'page.title': 'page_title',
    'page.space.key': 'space',
  },
  webhookEvents: [
    'jira:issue_created', 'jira:issue_updated', 'jira:issue_deleted',
    'page_created', 'page_updated', 'page_removed',
    'comment_created', 'comment_updated',
  ],
  apiEndpoints: {
    jiraIssue: '/rest/api/3/issue',
    jiraSearch: '/rest/api/3/search',
    confluencePage: '/wiki/rest/api/content',
    confluenceSearch: '/wiki/rest/api/search',
  },
  documentation: 'https://developer.atlassian.com/cloud/jira/platform/rest/v3/',
};

// =============================================================================
// HUBSPOT SUITE
// =============================================================================

export const HubSpotSuite: ConnectorSuiteConfig = {
  id: 'hubspot',
  name: 'HubSpot Suite',
  description: 'Connect to HubSpot CRM, Marketing, and Sales Hub',
  vendor: 'HubSpot',
  category: 'Marketing',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook'],
  requiredCredentials: [
    'HUBSPOT_ACCESS_TOKEN',
  ],
  optionalCredentials: [
    'HUBSPOT_CLIENT_ID',
    'HUBSPOT_CLIENT_SECRET',
    'HUBSPOT_REFRESH_TOKEN',
  ],
  defaultConfig: {
    objects: ['contacts', 'companies', 'deals', 'tickets'],
    pollIntervalMs: 300000, // 5 minutes
    limit: 100,
  },
  fieldMappings: {
    'contact.email': 'email',
    'contact.firstname': 'first_name',
    'contact.lastname': 'last_name',
    'contact.company': 'company_name',
    'company.name': 'company_name',
    'company.domain': 'website',
    'deal.dealname': 'deal_name',
    'deal.amount': 'deal_value',
    'deal.dealstage': 'deal_stage',
  },
  webhookEvents: [
    'contact.creation', 'contact.propertyChange', 'contact.deletion',
    'company.creation', 'company.propertyChange', 'company.deletion',
    'deal.creation', 'deal.propertyChange', 'deal.deletion',
  ],
  apiEndpoints: {
    contacts: '/crm/v3/objects/contacts',
    companies: '/crm/v3/objects/companies',
    deals: '/crm/v3/objects/deals',
    search: '/crm/v3/objects/{objectType}/search',
  },
  documentation: 'https://developers.hubspot.com/docs/api/overview',
};

// =============================================================================
// ZENDESK SUITE
// =============================================================================

export const ZendeskSuite: ConnectorSuiteConfig = {
  id: 'zendesk',
  name: 'Zendesk Suite',
  description: 'Connect to Zendesk Support, Guide, and Chat',
  vendor: 'Zendesk',
  category: 'Support',
  riskTier: RiskTier.ENTERPRISE,
  underlyingAdapters: ['webhook'],
  requiredCredentials: [
    'ZENDESK_SUBDOMAIN',
    'ZENDESK_EMAIL',
    'ZENDESK_API_TOKEN',
  ],
  optionalCredentials: [
    'ZENDESK_OAUTH_TOKEN',
  ],
  defaultConfig: {
    resources: ['tickets', 'users', 'organizations', 'articles'],
    pollIntervalMs: 60000, // 1 minute (support tickets need fast updates)
    perPage: 100,
  },
  fieldMappings: {
    'ticket.id': 'ticket_id',
    'ticket.subject': 'title',
    'ticket.description': 'description',
    'ticket.status': 'status',
    'ticket.priority': 'priority',
    'ticket.assignee_id': 'assignee_id',
    'user.name': 'customer_name',
    'user.email': 'customer_email',
  },
  webhookEvents: [
    'ticket.created', 'ticket.updated', 'ticket.solved',
    'user.created', 'user.updated',
    'organization.created', 'organization.updated',
  ],
  apiEndpoints: {
    tickets: '/api/v2/tickets',
    users: '/api/v2/users',
    organizations: '/api/v2/organizations',
    search: '/api/v2/search',
  },
  documentation: 'https://developer.zendesk.com/api-reference/',
};

// =============================================================================
// CONNECTOR SUITE REGISTRY
// =============================================================================

export const ConnectorSuites: Record<string, ConnectorSuiteConfig> = {
  salesforce: SalesforceSuite,
  sap: SAPSuite,
  workday: WorkdaySuite,
  servicenow: ServiceNowSuite,
  microsoft365: Microsoft365Suite,
  oracle: OracleSuite,
  snowflake: SnowflakeSuite,
  atlassian: AtlassianSuite,
  hubspot: HubSpotSuite,
  zendesk: ZendeskSuite,
};

// =============================================================================
// CONNECTOR SUITE MANAGER
// =============================================================================

export class ConnectorSuiteManager {
  private static instance: ConnectorSuiteManager;
  private instances: Map<string, ConnectorSuiteInstance> = new Map();

  private constructor() {}

  static getInstance(): ConnectorSuiteManager {
    if (!ConnectorSuiteManager.instance) {
      ConnectorSuiteManager.instance = new ConnectorSuiteManager();
    }
    return ConnectorSuiteManager.instance;
  }

  /**
   * List all available connector suites
   */
  listSuites(): ConnectorSuiteConfig[] {
    return Object.values(ConnectorSuites);
  }

  /**
   * Get a specific suite configuration
   */
  getSuite(id: string): ConnectorSuiteConfig | undefined {
    return ConnectorSuites[id];
  }

  /**
   * Configure a connector suite instance
   */
  configure(
    suiteId: string,
    credentials: Record<string, string>,
    customMappings?: Record<string, string>
  ): ConnectorSuiteInstance {
    const suite = ConnectorSuites[suiteId];
    if (!suite) {
      throw new Error(`Unknown connector suite: ${suiteId}`);
    }

    // Validate required credentials
    const missingCredentials = suite.requiredCredentials.filter(
      (cred) => !credentials[cred]
    );
    if (missingCredentials.length > 0) {
      throw new Error(
        `Missing required credentials for ${suite.name}: ${missingCredentials.join(', ')}`
      );
    }

    const instance: ConnectorSuiteInstance = {
      suiteId,
      config: suite,
      credentials,
      customMappings: customMappings || undefined,
      enabled: true,
      lastSync: undefined,
      status: 'configured',
    };

    this.instances.set(`${suiteId}-${Date.now()}`, instance);
    return instance;
  }

  /**
   * Get underlying adapter configurations for a suite
   */
  getAdapterConfigs(instance: ConnectorSuiteInstance): {
    database?: Partial<DatabaseConfig>;
    webhook?: Partial<WebhookConfig>;
    fileWatcher?: Partial<FileWatcherConfig>;
  } {
    const configs: {
      database?: Partial<DatabaseConfig>;
      webhook?: Partial<WebhookConfig>;
      fileWatcher?: Partial<FileWatcherConfig>;
    } = {};

    const suite = instance.config;

    if (suite.underlyingAdapters.includes('database')) {
      configs.database = {
        name: `${suite.id}-db`,
        // Database-specific config based on suite
      };
    }

    if (suite.underlyingAdapters.includes('webhook')) {
      configs.webhook = {
        name: `${suite.id}-webhook`,
        // Webhook-specific config based on suite
      };
    }

    if (suite.underlyingAdapters.includes('file-watcher')) {
      configs.fileWatcher = {
        name: `${suite.id}-files`,
        // File watcher config based on suite
      };
    }

    return configs;
  }

  /**
   * Get field mappings (default + custom)
   */
  getFieldMappings(instance: ConnectorSuiteInstance): Record<string, string> {
    return {
      ...instance.config.fieldMappings,
      ...instance.customMappings,
    };
  }

  /**
   * List configured instances
   */
  listInstances(): ConnectorSuiteInstance[] {
    return Array.from(this.instances.values());
  }

  /**
   * Get suite statistics
   */
  getStats(): {
    totalSuites: number;
    byCatgory: Record<string, number>;
    byRiskTier: Record<string, number>;
    configuredInstances: number;
  } {
    const suites = Object.values(ConnectorSuites);
    
    const byCategory: Record<string, number> = {};
    const byRiskTier: Record<string, number> = {};

    for (const suite of suites) {
      byCategory[suite.category] = (byCategory[suite.category] || 0) + 1;
      byRiskTier[suite.riskTier] = (byRiskTier[suite.riskTier] || 0) + 1;
    }

    return {
      totalSuites: suites.length,
      byCatgory: byCategory,
      byRiskTier: byRiskTier,
      configuredInstances: this.instances.size,
    };
  }
}

export const connectorSuiteManager = ConnectorSuiteManager.getInstance();

// =============================================================================
// SUMMARY
// =============================================================================

/**
 * 16 Connector Suites Total:
 * 
 * UNIVERSAL ADAPTERS (6):
 * 1. Database Adapter - SQL/ODBC connections
 * 2. Webhook Adapter - HTTP push events
 * 3. File Watcher Adapter - File-based ingest
 * 4. FHIR Adapter - Healthcare standard
 * 5. FIX Adapter - Financial trading
 * 6. MQTT Adapter - IoT/Industrial
 * 
 * PRE-CONFIGURED SUITES (10):
 * 7. Salesforce Suite - CRM
 * 8. SAP Suite - ERP
 * 9. Workday Suite - HR
 * 10. ServiceNow Suite - ITSM
 * 11. Microsoft 365 Suite - Productivity
 * 12. Oracle Suite - ERP/Database
 * 13. Snowflake Suite - Data Warehouse
 * 14. Atlassian Suite - Jira/Confluence
 * 15. HubSpot Suite - Marketing/CRM
 * 16. Zendesk Suite - Support
 * 
 * All suites require client-provided credentials.
 * We provide the configuration templates and field mappings.
 */
