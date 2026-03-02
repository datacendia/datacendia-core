/**
 * API Routes — Upload
 *
 * Express route handler defining REST endpoints.
 * @module routes/upload
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - FILE UPLOAD ROUTES
// CSV/Excel upload API for enterprise data import
// =============================================================================

import { Router, Request, Response } from 'express';
import multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { spreadsheetConnector } from '../core/connectors/implementations/SpreadsheetConnector.js';
import { getErrorMessage } from '../utils/errors.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

const router = Router();

// Configure multer for file uploads
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req: Express.Request, _file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, uploadDir);
  },
  filename: (_req: Express.Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(deterministicFloat('upload-1') * 1E9)}`;
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedExtensions = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  
  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed: ${allowedExtensions.join(', ')}`));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
  },
});

// =============================================================================
// ENDPOINTS
// =============================================================================

/**
 * GET /api/v1/upload/status
 * Check upload service status
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const isReady = await spreadsheetConnector.testConnection();
    res.json({
      success: true,
      status: isReady ? 'ready' : 'error',
      capabilities: spreadsheetConnector.getCapabilities(),
      supportedFormats: ['.csv', '.xlsx', '.xls'],
      maxFileSizeMB: 100,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/upload/preview
 * Upload a file and preview its contents before importing
 */
router.post('/preview', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
      });
    }

    const preview = await spreadsheetConnector.previewImport(file.path, {
      hasHeaders: req.body.hasHeaders !== 'false',
      skipRows: parseInt(req.body.skipRows || '0', 10),
      sheet: req.body.sheet,
    });

    // Clean up file after preview
    // fs.unlinkSync(file.path); // Keep for potential import

    res.json({
      success: true,
      filename: file.originalname,
      filePath: file.path,
      preview,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/upload/import
 * Import a previously uploaded file
 */
router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    const file = (req as any).file;
    const filePath = req.body.filePath || (file ? file.path : null);
    
    if (!filePath) {
      return res.status(400).json({
        success: false,
        error: 'No file path provided',
      });
    }

    const tableName = req.body.tableName || path.basename(filePath, path.extname(filePath));
    const organizationId = req.body.organizationId || req.organizationId!;
    const userId = req.body.userId || 'demo-user';

    // Parse the file
    const parseResult = await spreadsheetConnector.parseFile(filePath, {
      hasHeaders: req.body.hasHeaders !== 'false',
      skipRows: parseInt(req.body.skipRows || '0', 10),
      sheet: req.body.sheet,
    });

    if (!parseResult.success) {
      return res.status(400).json({
        success: false,
        error: parseResult.errors[0]?.message || 'Parse failed',
        errors: parseResult.errors,
      });
    }

    // Import to storage
    const importResult = await spreadsheetConnector.importToDatabase(
      parseResult,
      tableName,
      {
        appendIfExists: req.body.appendIfExists === 'true',
        organizationId,
        userId,
      }
    );

    // Clean up uploaded file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({
      success: importResult.success,
      tableName: importResult.tableName,
      rowsImported: importResult.rowsImported,
      columnsCreated: importResult.columnsCreated,
      columns: parseResult.columns,
      errors: importResult.errors,
      warnings: [...parseResult.warnings, ...importResult.warnings],
      duration: importResult.duration,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/upload/tables
 * List all imported tables for an organization
 */
router.get('/tables', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo-org';
    const tables = spreadsheetConnector.listImportedTables(organizationId);

    res.json({
      success: true,
      tables,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * GET /api/v1/upload/tables/:tableName
 * Get data from an imported table
 */
router.get('/tables/:tableName', async (req: Request, res: Response) => {
  try {
    const organizationId = (req.query.organizationId as string) || 'demo-org';
    const tableName = req.params.tableName;
    const limit = parseInt((req.query.limit as string) || '100', 10);
    const offset = parseInt((req.query.offset as string) || '0', 10);

    const data = spreadsheetConnector.getImportedData(organizationId, tableName);
    
    if (!data) {
      return res.status(404).json({
        success: false,
        error: 'Table not found',
      });
    }

    const queryResult = spreadsheetConnector.queryImportedData(organizationId, tableName, {
      limit,
      offset,
    });

    res.json({
      success: true,
      tableName,
      metadata: data.metadata,
      rows: queryResult.rows,
      total: queryResult.total,
      limit,
      offset,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

/**
 * POST /api/v1/upload/tables/:tableName/query
 * Query an imported table with filters
 */
router.post('/tables/:tableName/query', async (req: Request, res: Response) => {
  try {
    const organizationId = req.body.organizationId || req.organizationId!;
    const tableName = req.params.tableName;

    const queryResult = spreadsheetConnector.queryImportedData(organizationId, tableName, {
      limit: req.body.limit,
      offset: req.body.offset,
      filters: req.body.filters,
      orderBy: req.body.orderBy,
    });

    res.json({
      success: true,
      tableName,
      rows: queryResult.rows,
      total: queryResult.total,
    });
  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      error: getErrorMessage(error),
    });
  }
});

export default router;
