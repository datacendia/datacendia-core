// Retention Management API Routes
// Provides endpoints for managing 7-year audit data retention

import { Router } from 'express';
import { getRetentionService } from '../services/compliance/RetentionService.js';
import { logger } from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();
const retentionService = getRetentionService(prisma);

/**
 * GET /api/v1/retention/config
 * Get current retention configuration
 */
router.get('/config', async (req, res) => {
  try {
    const config = await retentionService.getConfig();
    res.json({
      success: true,
      data: config
    });
  } catch (error) {
    logger.error('Failed to get retention config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve retention configuration'
    });
  }
});

/**
 * GET /api/v1/retention/status
 * Get retention status for all tables
 */
router.get('/status', async (req, res) => {
  try {
    const status = await retentionService.getRetentionStatus();
    res.json({
      success: true,
      data: status
    });
  } catch (error) {
    logger.error('Failed to get retention status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve retention status'
    });
  }
});

/**
 * POST /api/v1/retention/cleanup
 * Perform cleanup of expired audit data
 */
router.post('/cleanup', async (req, res) => {
  try {
    const result = await retentionService.performCleanup();
    logger.info(`Retention cleanup completed: ${result.deletedRecords} records deleted`);
    
    res.json({
      success: true,
      data: result,
      message: `Successfully cleaned up ${result.deletedRecords} expired records`
    });
  } catch (error) {
    logger.error('Failed to perform retention cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform retention cleanup'
    });
  }
});

/**
 * POST /api/v1/retention/schedule
 * Schedule automatic cleanup
 */
router.post('/schedule', async (req, res) => {
  try {
    const nextCleanup = await retentionService.scheduleCleanup();
    logger.info(`Retention cleanup scheduled for: ${nextCleanup.toISOString()}`);
    
    res.json({
      success: true,
      data: {
        nextCleanup,
        frequency: 'monthly'
      },
      message: 'Retention cleanup scheduled successfully'
    });
  } catch (error) {
    logger.error('Failed to schedule retention cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule retention cleanup'
    });
  }
});

/**
 * GET /api/v1/retention/storage
 * Get storage statistics for retention planning
 */
router.get('/storage', async (req, res) => {
  try {
    const stats = await retentionService.getStorageStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error('Failed to get storage stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve storage statistics'
    });
  }
});

/**
 * GET /api/v1/retention/validate
 * Validate retention configuration
 */
router.get('/validate', async (req, res) => {
  try {
    const validation = await retentionService.validateConfiguration();
    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    logger.error('Failed to validate retention configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate retention configuration'
    });
  }
});

/**
 * GET /api/v1/retention/report
 * Generate retention compliance report
 */
router.get('/report', async (req, res) => {
  try {
    const report = await retentionService.generateComplianceReport();
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    logger.error('Failed to generate retention report:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate retention compliance report'
    });
  }
});

/**
 * GET /api/v1/retention/export
 * Export retention configuration for backup
 */
router.get('/export', async (req, res) => {
  try {
    const exportData = await retentionService.exportConfiguration();
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="retention-config-${new Date().toISOString().split('T')[0]}.json"`);
    
    res.json(exportData);
  } catch (error) {
    logger.error('Failed to export retention configuration:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export retention configuration'
    });
  }
});

/**
 * GET /api/v1/retention/health
 * Health check for retention service
 */
router.get('/health', async (req, res) => {
  try {
    const validation = await retentionService.validateConfiguration();
    const status = await retentionService.getRetentionStatus();
    
    const health = {
      status: validation.isValid ? 'healthy' : 'unhealthy',
      timestamp: new Date(),
      retention: {
        period: 7,
        tables: status.length,
        totalRecords: status.reduce((sum, table) => sum + table.totalRecords, 0),
        expiredRecords: status.reduce((sum, table) => sum + table.recordsOverRetention, 0)
      },
      validation: {
        isValid: validation.isValid,
        issues: validation.issues.length,
        recommendations: validation.recommendations.length
      }
    };
    
    res.status(validation.isValid ? 200 : 503).json({
      success: true,
      data: health
    });
  } catch (error) {
    logger.error('Failed to get retention health:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get retention health status'
    });
  }
});

export default router;
