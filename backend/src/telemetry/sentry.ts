// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { logger } from '../utils/logger.js';
import type { RequestHandler, ErrorRequestHandler } from 'express';

export const sentry = {
  isEnabled(): boolean {
    return false;
  },
  errorHandler(): ErrorRequestHandler {
    return (err, _req, _res, next) => next(err);
  },
};
