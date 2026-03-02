// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * SCHEMA MAPPING API ROUTES
 * Endpoints for managing client database schema mappings
 * =============================================================================
 */

import { Router, Request, Response } from 'express';
import { schemaMapper, SchemaMapping } from '../services/schema/index.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// =============================================================================
// GET /api/v1/schema/mappings/:dataSourceId
// Get schema mapping for a data source
// =============================================================================
router.get('/mappings/:dataSourceId', async (req: Request, res: Response) => {
  try {
    const dataSourceId = req.params['dataSourceId'] || '';
    const mapping = await schemaMapper.getMapping(dataSourceId);

    if (!mapping) {
      res.status(404).json({
        success: false,
        error: 'No mapping found for this data source',
      });
      return;
    }

    res.json({
      success: true,
      mapping,
    });
  } catch (error: unknown) {
    logger.error('Failed to get schema mapping', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/schema/mappings
// Save a schema mapping
// =============================================================================
router.post('/mappings', async (req: Request, res: Response) => {
  try {
    const mapping: SchemaMapping = req.body;

    if (!mapping.dataSourceId || !mapping.organizationId) {
      res.status(400).json({
        success: false,
        error: 'dataSourceId and organizationId are required',
      });
      return;
    }

    const saved = await schemaMapper.saveMapping(mapping);

    res.json({
      success: true,
      mapping: saved,
    });
  } catch (error: unknown) {
    logger.error('Failed to save schema mapping', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/schema/suggest
// Auto-suggest mappings for source tables
// =============================================================================
router.post('/suggest', async (req: Request, res: Response) => {
  try {
    const { dataSourceId, tables } = req.body;

    if (!dataSourceId || !tables || !Array.isArray(tables)) {
      res.status(400).json({
        success: false,
        error: 'dataSourceId and tables array are required',
      });
      return;
    }

    const suggestions = await schemaMapper.suggestMappings(dataSourceId, tables);

    res.json({
      success: true,
      suggestions,
      totalTables: tables.length,
      mappedTables: suggestions.length,
    });
  } catch (error: unknown) {
    logger.error('Failed to suggest mappings', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/schema/transform-query
// Transform a canonical query to source-specific SQL
// =============================================================================
router.post('/transform-query', async (req: Request, res: Response) => {
  try {
    const { dataSourceId, entity, fields, filters } = req.body;

    if (!dataSourceId || !entity || !fields) {
      res.status(400).json({
        success: false,
        error: 'dataSourceId, entity, and fields are required',
      });
      return;
    }

    const mapping = await schemaMapper.getMapping(dataSourceId);
    if (!mapping) {
      res.status(404).json({
        success: false,
        error: 'No mapping found for this data source',
      });
      return;
    }

    const tableMapping = mapping.tableMappings.find(
      (t) => t.canonicalEntity === entity
    );
    if (!tableMapping) {
      res.status(404).json({
        success: false,
        error: `No mapping found for entity: ${entity}`,
      });
      return;
    }

    const { sql, params } = schemaMapper.transformQuery(
      tableMapping,
      fields,
      filters
    );

    res.json({
      success: true,
      sql,
      params,
      sourceTable: `${tableMapping.sourceSchema}.${tableMapping.sourceTable}`,
    });
  } catch (error: unknown) {
    logger.error('Failed to transform query', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// GET /api/v1/schema/canonical-model
// Get the canonical data model definition
// =============================================================================
router.get('/canonical-model', async (_req: Request, res: Response) => {
  try {
    const { CANONICAL_ENTITIES, CANONICAL_FIELDS } = await import('../services/schema/index.js');

    res.json({
      success: true,
      entities: CANONICAL_ENTITIES,
      fields: CANONICAL_FIELDS,
    });
  } catch (error: unknown) {
    logger.error('Failed to get canonical model', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

// =============================================================================
// POST /api/v1/schema/validate
// Validate a mapping configuration
// =============================================================================
router.post('/validate', async (req: Request, res: Response) => {
  try {
    const { mapping } = req.body;

    const issues: Array<{ type: 'error' | 'warning'; message: string; path: string }> = [];

    // Validate table mappings
    if (!mapping.tableMappings || mapping.tableMappings.length === 0) {
      issues.push({
        type: 'error',
        message: 'At least one table mapping is required',
        path: 'tableMappings',
      });
    }

    for (const table of mapping.tableMappings || []) {
      // Check for unmapped columns
      const unmapped = table.columnMappings.filter(
        (c: any) => c.confidence < 0.5 && !c.isManual
      );
      if (unmapped.length > 0) {
        issues.push({
          type: 'warning',
          message: `${unmapped.length} columns have low-confidence mappings`,
          path: `tableMappings.${table.sourceTable}`,
        });
      }

      // Check for missing key fields
      const hasId = table.columnMappings.some(
        (c: any) => c.canonicalField === 'id'
      );
      if (!hasId) {
        issues.push({
          type: 'warning',
          message: 'No column mapped to "id" field',
          path: `tableMappings.${table.sourceTable}`,
        });
      }
    }

    res.json({
      success: true,
      valid: issues.filter((i) => i.type === 'error').length === 0,
      issues,
    });
  } catch (error: unknown) {
    logger.error('Failed to validate mapping', { error: getErrorMessage(error) });
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
