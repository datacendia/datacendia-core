/**
 * Utility — Permissions
 *
 * Shared utility functions and helpers.
 * @module utils/permissions
 */

﻿// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import type { Request } from 'express';
import { featureControlService } from '../services/admin/FeatureControlService.js';
import { errors } from '../middleware/errorHandler.js';

const CAPABILITY_TO_FEATURE: Record<string, string> = {
  'persona.createTwin': 'cendia-persona',
  'autopilot.manageRules': 'cendia-autopilot',
};

const CAPABILITY_DEFAULTS: Record<string, string[]> = {
  'persona.createTwin': ['SUPER_ADMIN', 'ADMIN'],
  'autopilot.manageRules': ['SUPER_ADMIN', 'ADMIN'],
};

export async function assertCapability(req: Request, capability: string): Promise<void> {
  const user = req.user;

  if (!user) {
    throw errors.unauthorized();
  }

  const role = user.role;

  if (role === 'SUPER_ADMIN') {
    return;
  }

  let allowedRoles: string[] | undefined;

  const featureId = CAPABILITY_TO_FEATURE[capability];
  if (featureId) {
    const feature = await featureControlService.getFeature(featureId);
    const config = (feature?.config as any) || {};
    const permissions = (config.permissions as Record<string, string[]>) || undefined;
    if (permissions && permissions[capability]) {
      allowedRoles = permissions[capability];
    }
  }

  if (!allowedRoles) {
    allowedRoles = CAPABILITY_DEFAULTS[capability] || [];
  }

  if (!allowedRoles.includes(role)) {
    throw errors.forbidden('Insufficient permissions');
  }
}
