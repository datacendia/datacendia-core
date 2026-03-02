// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

// =============================================================================
// PLATFORM DOMAIN ROUTER - Platform, Admin & Core Services
// =============================================================================

import { Router } from 'express';
import { mountEnterpriseRoutes } from './_enterprise.js';
import platformRoutes from '../platform.js';
import coreRoutes from '../core.js';
import adminSettingsRoutes from '../admin-settings.js';
import adminRoutes from '../admin.js';
import settingsRoutes from '../settings.js';
import healthRoutes from '../health.js';
import i18nRoutes from '../i18n.js';
import notificationsRoutes from '../notifications.js';
import errorRoutes from '../errors.js';
import contactRoutes from '../contact.js';
import uploadRoutes from '../upload.js';
import schemaRoutes from '../schema.js';
import commandRoutes from '../command.js';
import envConfigRoutes from '../env-config.js';
import marketingStudioRoutes from '../marketing-studio.js';
import platformAssistantRoutes from '../platform-assistant.js';
import marketingLeadsRoutes from '../marketing-leads.js';
import autoHealRoutes from '../auto-heal.js';

const router = Router();

// Community routes
router.use('/platform', platformRoutes);
router.use('/core', coreRoutes);
router.use('/admin/settings', adminSettingsRoutes); // Must come BEFORE /admin
router.use('/admin', adminRoutes);
router.use('/settings', settingsRoutes);
router.use('/health', healthRoutes);
router.use('/i18n', i18nRoutes);
router.use('/notifications', notificationsRoutes);
router.use('/errors', errorRoutes);
router.use('/contact', contactRoutes);
router.use('/upload', uploadRoutes);
router.use('/schema', schemaRoutes);
router.use('/command', commandRoutes);
router.use('/admin/env-config', envConfigRoutes);
router.use('/marketing-studio', marketingStudioRoutes);
router.use('/platform-assistant', platformAssistantRoutes);
router.use('/marketing-leads', marketingLeadsRoutes);
router.use('/auto-heal', autoHealRoutes);

// Enterprise routes
mountEnterpriseRoutes(router, [
  ['/cortex', () => import('../cortex-core.js')],
  ['/omnitranslate', () => import('../omnitranslate.js')],
]);

export default router;
