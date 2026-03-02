/**
 * Connector — Index
 *
 * External system connector for third-party integrations.
 *
 * @exports HealthcareConnectorFactory, HEALTHCARE_CONNECTORS
 * @module connectors/healthcare/index
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * =============================================================================
 * HEALTHCARE CONNECTORS
 * =============================================================================
 * Clinical Systems, Public Health, Pharmaceutical, Insurance
 */

import { ConnectorMetadata } from '../BaseConnector.js';

export const HEALTHCARE_CONNECTORS: ConnectorMetadata[] = [
  // Clinical Standards
  {
    id: 'hl7-fhir',
    name: 'HL7 FHIR R4',
    description: 'Fast Healthcare Interoperability Resources',
    vertical: 'healthcare',
    category: 'clinical',
    provider: 'HL7 International',
    region: 'Global',
    dataTypes: ['patients', 'encounters', 'observations', 'medications', 'conditions'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://hl7.org/fhir/',
    requiredCredentials: ['client_id', 'client_secret'],
    complianceFrameworks: ['HIPAA', 'GDPR'],
    compatibilityLabel: 'native_protocol',
    integrationNotes: 'Native FHIR R4 protocol support via Sovereign FHIR Adapter',
  },
  {
    id: 'hl7-v2',
    name: 'HL7 v2.x',
    description: 'Legacy HL7 messaging standard',
    vertical: 'healthcare',
    category: 'clinical',
    provider: 'HL7 International',
    region: 'Global',
    dataTypes: ['adt', 'orm', 'oru', 'rde'],
    updateFrequency: 'real-time',
    requiredCredentials: ['mllp_host', 'mllp_port'],
    complianceFrameworks: ['HIPAA'],
    compatibilityLabel: 'native_protocol',
    integrationNotes: 'Native HL7 v2 MLLP protocol support',
  },
  {
    id: 'epic-ehr',
    name: 'Epic EHR',
    description: 'Epic Systems electronic health records',
    vertical: 'healthcare',
    category: 'ehr',
    provider: 'Epic Systems',
    region: 'Global',
    dataTypes: ['patients', 'encounters', 'orders', 'results', 'notes'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://fhir.epic.com/',
    requiredCredentials: ['client_id', 'private_key'],
    complianceFrameworks: ['HIPAA', 'HITRUST'],
    compatibilityLabel: 'client_gateway',
    integrationNotes: 'Requires Epic App Orchard registration and client FHIR endpoint',
  },
  {
    id: 'cerner-ehr',
    name: 'Oracle Cerner EHR',
    description: 'Cerner Millennium electronic health records',
    vertical: 'healthcare',
    category: 'ehr',
    provider: 'Oracle Health',
    region: 'Global',
    dataTypes: ['patients', 'encounters', 'orders', 'results'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://fhir.cerner.com/',
    requiredCredentials: ['client_id', 'client_secret'],
    complianceFrameworks: ['HIPAA', 'HITRUST'],
    compatibilityLabel: 'client_gateway',
    integrationNotes: 'Requires Cerner Code Console registration and client FHIR endpoint',
  },

  // Public Health
  {
    id: 'cdc-wonder',
    name: 'CDC WONDER',
    description: 'Wide-ranging Online Data for Epidemiologic Research',
    vertical: 'healthcare',
    category: 'public-health',
    provider: 'CDC',
    region: 'US',
    dataTypes: ['mortality', 'natality', 'disease-surveillance', 'vaccinations'],
    updateFrequency: 'weekly',
    documentationUrl: 'https://wonder.cdc.gov/',
    requiredCredentials: [],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no special licensing required',
  },
  {
    id: 'cdc-nndss',
    name: 'CDC NNDSS',
    description: 'National Notifiable Diseases Surveillance System',
    vertical: 'healthcare',
    category: 'public-health',
    provider: 'CDC',
    region: 'US',
    dataTypes: ['disease-cases', 'outbreaks', 'trends'],
    updateFrequency: 'weekly',
    documentationUrl: 'https://www.cdc.gov/nndss/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'who-gho',
    name: 'WHO Global Health Observatory',
    description: 'World Health Organization global health data',
    vertical: 'healthcare',
    category: 'public-health',
    provider: 'WHO',
    region: 'Global',
    dataTypes: ['disease-burden', 'health-indicators', 'sdg-health'],
    updateFrequency: 'annual',
    documentationUrl: 'https://www.who.int/data/gho',
    requiredCredentials: [],
    complianceFrameworks: [],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },

  // Pharmaceutical
  {
    id: 'fda-drugs',
    name: 'FDA Drug Database',
    description: 'Drug approvals, labels, adverse events',
    vertical: 'healthcare',
    category: 'pharmaceutical',
    provider: 'FDA',
    region: 'US',
    dataTypes: ['drug-labels', 'adverse-events', 'recalls', 'approvals'],
    updateFrequency: 'daily',
    documentationUrl: 'https://open.fda.gov/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
  {
    id: 'ema-medicines',
    name: 'EMA Medicines Database',
    description: 'European Medicines Agency drug data',
    vertical: 'healthcare',
    category: 'pharmaceutical',
    provider: 'EMA',
    region: 'EU',
    dataTypes: ['medicines', 'safety-reports', 'clinical-trials'],
    updateFrequency: 'daily',
    documentationUrl: 'https://www.ema.europa.eu/en/medicines',
    requiredCredentials: [],
    complianceFrameworks: ['GDPR'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API, no licensing required',
  },
  {
    id: 'ncpdp-script',
    name: 'NCPDP SCRIPT',
    description: 'E-prescribing standard',
    vertical: 'healthcare',
    category: 'pharmaceutical',
    provider: 'NCPDP',
    region: 'US',
    dataTypes: ['prescriptions', 'refills', 'prior-auth'],
    updateFrequency: 'real-time',
    documentationUrl: 'https://www.ncpdp.org/',
    requiredCredentials: ['ncpdp_id', 'certificate'],
    complianceFrameworks: ['HIPAA'],
    compatibilityLabel: 'license_required',
    integrationNotes: 'NCPDP membership and certification required',
  },

  // Insurance & Claims
  {
    id: 'x12-837',
    name: 'X12 837 Claims',
    description: 'Healthcare claims transaction standard',
    vertical: 'healthcare',
    category: 'insurance',
    provider: 'X12',
    region: 'US',
    dataTypes: ['claims', 'remittances', 'eligibility'],
    updateFrequency: 'real-time',
    requiredCredentials: ['isa_id', 'gs_id'],
    complianceFrameworks: ['HIPAA'],
    compatibilityLabel: 'native_protocol',
    integrationNotes: 'Native X12 EDI protocol support via file ingestion',
  },
  {
    id: 'cms-medicare',
    name: 'CMS Medicare Data',
    description: 'Medicare claims and provider data',
    vertical: 'healthcare',
    category: 'insurance',
    provider: 'CMS',
    region: 'US',
    dataTypes: ['claims', 'provider-data', 'quality-measures'],
    updateFrequency: 'monthly',
    documentationUrl: 'https://data.cms.gov/',
    requiredCredentials: ['api_key'],
    complianceFrameworks: ['FedRAMP', 'HIPAA'],
    compatibilityLabel: 'public_api',
    integrationNotes: 'Public API with free registration',
  },
];

export class HealthcareConnectorFactory {
  static getAvailableConnectors(): ConnectorMetadata[] {
    return HEALTHCARE_CONNECTORS;
  }
}
