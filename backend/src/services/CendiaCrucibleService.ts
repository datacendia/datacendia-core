// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { withFallback } from './_serviceProxy.js';

export const cendiaCrucibleService: any = withFallback({});

export const SCENARIO_TEMPLATES: Record<string, any> = {};

export default cendiaCrucibleService;
