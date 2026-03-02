/**
 * API Routes — Sample Data
 *
 * Express route handler defining REST endpoints.
 * @module routes/sample-data
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// SAMPLE DATA API ROUTES
// Auto-populate demo data for data sources
// =============================================================================

import { Router } from 'express';
import { sampleDataService } from '../services/SampleDataService';

const router = Router();

// =============================================================================
// GET /api/v1/sample-data/datasets
// List all available sample datasets
// =============================================================================
router.get('/datasets', (_req, res) => {
  try {
    const datasets = sampleDataService.getAvailableDatasets();
    res.json({
      success: true,
      data: {
        datasets,
        totalDatasets: datasets.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get datasets',
    });
  }
});

// =============================================================================
// GET /api/v1/sample-data/datasets/:id
// Get details about a specific dataset
// =============================================================================
router.get('/datasets/:id', (req, res) => {
  try {
    const id = String(req.params['id'] || '');
    if (!id) {
      res.status(400).json({ success: false, error: 'Dataset ID required' });
      return;
    }
    
    const dataset = sampleDataService.getDataset(id);
    
    if (!dataset) {
      res.status(404).json({
        success: false,
        error: `Dataset not found: ${id}`,
      });
      return;
    }
    
    res.json({
      success: true,
      data: dataset,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get dataset',
    });
  }
});

// =============================================================================
// GET /api/v1/sample-data/datasets/:id/stats
// Get statistics about a dataset (without generating full data)
// =============================================================================
router.get('/datasets/:id/stats', (req, res) => {
  try {
    const id = String(req.params['id'] || '');
    const scaleStr = req.query['scale'];
    const scale = typeof scaleStr === 'string' ? parseFloat(scaleStr) : 1;
    
    if (!id) {
      res.status(400).json({ success: false, error: 'Dataset ID required' });
      return;
    }
    
    const stats = sampleDataService.getDatasetStats(id, scale);
    
    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get dataset stats',
    });
  }
});

// =============================================================================
// POST /api/v1/sample-data/datasets/:id/generate
// Generate sample data for a dataset
// =============================================================================
router.post('/datasets/:id/generate', (req, res) => {
  try {
    const id = String(req.params['id'] || '');
    const { scale = 1, format = 'json' } = req.body || {};
    
    if (!id) {
      res.status(400).json({ success: false, error: 'Dataset ID required' });
      return;
    }
    
    const dataset = sampleDataService.getDataset(id);
    if (!dataset) {
      res.status(404).json({
        success: false,
        error: `Dataset not found: ${id}`,
      });
      return;
    }
    
    if (format === 'sql') {
      const sql = sampleDataService.generateSQL(id, scale);
      res.json({
        success: true,
        data: {
          dataset: dataset.name,
          format: 'sql',
          sql,
        },
      });
    } else {
      const data = sampleDataService.generateDataset(id, scale);
      const totalRecords = data.reduce((sum, t) => sum + t.records.length, 0);
      
      res.json({
        success: true,
        data: {
          dataset: dataset.name,
          format: 'json',
          tables: data.map(t => ({
            tableName: t.tableName,
            schema: t.schema,
            recordCount: t.records.length,
            records: t.records,
          })),
          totalRecords,
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate data',
    });
  }
});

// =============================================================================
// POST /api/v1/sample-data/datasets/:id/preview
// Generate a small preview of the dataset (first 10 records per table)
// =============================================================================
router.post('/datasets/:id/preview', (req, res) => {
  try {
    const id = String(req.params['id'] || '');
    
    if (!id) {
      res.status(400).json({ success: false, error: 'Dataset ID required' });
      return;
    }
    
    const dataset = sampleDataService.getDataset(id);
    if (!dataset) {
      res.status(404).json({
        success: false,
        error: `Dataset not found: ${id}`,
      });
      return;
    }
    
    // Generate with small scale
    const data = sampleDataService.generateDataset(id, 0.01);
    
    res.json({
      success: true,
      data: {
        dataset: dataset.name,
        preview: true,
        tables: data.map(t => ({
          tableName: t.tableName,
          schema: t.schema,
          sampleRecords: t.records.slice(0, 10),
          totalInPreview: Math.min(t.records.length, 10),
        })),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate preview',
    });
  }
});

// =============================================================================
// POST /api/v1/sample-data/quick-load/:datasetId
// Quick load sample data into a connected data source
// =============================================================================
router.post('/quick-load/:datasetId', (req, res) => {
  try {
    const datasetId = String(req.params['datasetId'] || '');
    const { connectionId, scale = 0.1 } = req.body || {};
    
    if (!datasetId) {
      res.status(400).json({ success: false, error: 'Dataset ID required' });
      return;
    }
    
    const dataset = sampleDataService.getDataset(datasetId);
    if (!dataset) {
      res.status(404).json({
        success: false,
        error: `Dataset not found: ${datasetId}`,
      });
      return;
    }
    
    // Generate the data
    const data = sampleDataService.generateDataset(datasetId, scale);
    const totalRecords = data.reduce((sum, t) => sum + t.records.length, 0);
    
    res.json({
      success: true,
      message: `Ready to load ${totalRecords} records into ${data.length} tables`,
      data: {
        datasetId,
        datasetName: dataset.name,
        connectionId: connectionId || 'demo-connection',
        tables: data.map(t => ({
          tableName: t.tableName,
          recordCount: t.records.length,
          schema: t.schema,
        })),
        totalRecords,
        status: connectionId ? 'ready_to_load' : 'preview_only',
        instructions: connectionId 
          ? 'Data will be loaded into the connected database'
          : 'Connect a data source first to load this data',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to prepare data load',
    });
  }
});

export default router;
