/**
 * API Routes — Vertical Config
 *
 * Express route handler defining REST endpoints.
 * @module routes/vertical-config
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * CENDIA VERTICAL CONFIGURATION API ROUTES
 * 
 * Manage industry verticals and toggleable service access
 */

import { Router, Request, Response } from 'express';
import { verticalConfigService } from '../services/enterprise/VerticalConfigService.js';
import { logger } from '../utils/logger.js';
import { getErrorMessage } from '../utils/errors.js';

const router = Router();

// Extract user/org info from request
const extractContext = (req: Request) => ({
  userId: req.headers['x-user-id'] as string || 'anonymous',
  organizationId: req.headers['x-organization-id'] as string || 'default-org',
});

// =============================================================================
// CATALOG & TEMPLATES
// =============================================================================

/**
 * GET /api/v1/vertical-config/services
 * Get full service catalog
 */
router.get('/services', async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = verticalConfigService.getServiceCatalog();
    res.json({ services });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting services:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/services/:id
 * Get specific service
 */
router.get('/services/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const serviceId = req.params['id'] as string;
    const service = verticalConfigService.getServiceById(serviceId);
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json(service);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting service:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/services/category/:category
 * Get services by category
 */
router.get('/services/category/:category', async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.params['category'] as string;
    const services = verticalConfigService.getServicesByCategory(category as any);
    res.json({ services });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting services by category:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/verticals
 * Get all vertical templates
 */
router.get('/verticals', async (_req: Request, res: Response): Promise<void> => {
  try {
    const verticals = verticalConfigService.getVerticalTemplates();
    res.json({ verticals });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting verticals:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/:id
 * Get specific vertical template
 */
router.get('/verticals/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const verticalId = req.params['id'] as string;
    const vertical = verticalConfigService.getVerticalById(verticalId);
    if (!vertical) {
      res.status(404).json({ error: 'Vertical not found' });
      return;
    }
    res.json(vertical);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting vertical:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/:id/recommended
 * Get recommended services for a vertical
 */
router.get('/verticals/:id/recommended', async (req: Request, res: Response): Promise<void> => {
  try {
    const verticalId = req.params['id'] as string;
    const services = verticalConfigService.getRecommendedServices(verticalId);
    res.json({ services });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting recommended services:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/verticals/compare/:id1/:id2
 * Compare two verticals
 */
router.get('/verticals/compare/:id1/:id2', async (req: Request, res: Response): Promise<void> => {
  try {
    const id1 = req.params['id1'] as string;
    const id2 = req.params['id2'] as string;
    const comparison = verticalConfigService.compareVerticals(id1, id2);
    res.json(comparison);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error comparing verticals:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// ORGANIZATION CONFIGURATION
// =============================================================================

/**
 * GET /api/v1/vertical-config/organization
 * Get organization's current configuration
 */
router.get('/organization', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = extractContext(req);
    const config = await verticalConfigService.getOrganizationConfig(organizationId);
    
    if (!config) {
      // Return default config for new organizations instead of 404
      res.json({
        id: 'default',
        organizationId,
        verticalId: 'general',
        enabledServices: ['council', 'ledger', 'graph', 'pulse', 'lens', 'bridge'],
        disabledServices: [],
        customizations: {},
        needsSetup: true,
      });
      return;
    }
    
    res.json(config);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting org config:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/vertical-config/organization
 * Create organization configuration
 */
router.post('/organization', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { verticalId, customEnabledServices } = req.body;

    if (!verticalId) {
      res.status(400).json({ error: 'verticalId is required' });
      return;
    }

    const config = await verticalConfigService.createOrganizationConfig(
      organizationId,
      verticalId,
      userId,
      customEnabledServices
    );

    res.status(201).json(config);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error creating org config:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * PUT /api/v1/vertical-config/organization
 * Update organization configuration
 */
router.put('/organization', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, organizationId } = extractContext(req);
    const updates = req.body;

    const config = await verticalConfigService.updateOrganizationConfig(
      organizationId,
      updates,
      userId
    );

    res.json(config);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error updating org config:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/vertical-config/organization/switch-vertical
 * Switch to a different vertical
 */
router.post('/organization/switch-vertical', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { verticalId, preserveCustomizations = true } = req.body;

    if (!verticalId) {
      res.status(400).json({ error: 'verticalId is required' });
      return;
    }

    const config = await verticalConfigService.switchVertical(
      organizationId,
      verticalId,
      userId,
      preserveCustomizations
    );

    res.json(config);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error switching vertical:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// =============================================================================
// SERVICE TOGGLES
// =============================================================================

/**
 * POST /api/v1/vertical-config/toggle/:serviceId
 * Toggle a single service
 */
router.post('/toggle/:serviceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, organizationId } = extractContext(req);
    const serviceId = req.params['serviceId'] as string;
    const { enabled, reason } = req.body;

    if (typeof enabled !== 'boolean') {
      res.status(400).json({ error: 'enabled (boolean) is required' });
      return;
    }

    const toggle = await verticalConfigService.toggleService(
      organizationId,
      serviceId,
      enabled,
      userId,
      reason
    );

    res.json(toggle);
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error toggling service:', error);
    res.status(getErrorMessage(error).includes('Core service') ? 400 : 500).json({ error: getErrorMessage(error) });
  }
});

/**
 * POST /api/v1/vertical-config/toggle-bulk
 * Toggle multiple services at once
 */
router.post('/toggle-bulk', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, organizationId } = extractContext(req);
    const { toggles } = req.body;

    if (!Array.isArray(toggles)) {
      res.status(400).json({ error: 'toggles array is required' });
      return;
    }

    const results = await verticalConfigService.bulkToggleServices(
      organizationId,
      toggles,
      userId
    );

    res.json({ results });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error bulk toggling services:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/enabled
 * Get all enabled services for organization
 */
router.get('/enabled', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = extractContext(req);
    const services = await verticalConfigService.getEnabledServices(organizationId);
    res.json({ services });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting enabled services:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/disabled
 * Get all disabled services for organization
 */
router.get('/disabled', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = extractContext(req);
    const services = await verticalConfigService.getDisabledServices(organizationId);
    res.json({ services });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error getting disabled services:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

/**
 * GET /api/v1/vertical-config/check/:serviceId
 * Check if a specific service is enabled
 */
router.get('/check/:serviceId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { organizationId } = extractContext(req);
    const serviceId = req.params['serviceId'] as string;
    const enabled = await verticalConfigService.isServiceEnabled(organizationId, serviceId);
    res.json({ serviceId, enabled });
  } catch (error: unknown) {
    logger.error('[VerticalConfig API] Error checking service:', error);
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

export default router;
