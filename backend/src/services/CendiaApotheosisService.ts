// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { withFallback } from './_serviceProxy.js';

export interface ApotheosisConfig { [key: string]: any; }

export class ApotheosisRun { [key: string]: any; }

export class ApotheosisScore { [key: string]: any; }

export class Escalation { [key: string]: any; }

export class PatternBan { [key: string]: any; }

export class UpskillAssignment { [key: string]: any; }

export class WeaknessItem { [key: string]: any; }

export class AutoPatch { [key: string]: any; }

export const apotheosisService: any = withFallback({});
