/**
 * Utils — Async Route
 *
 * Wraps an async Express handler so a rejected promise reaches the error
 * handler.
 *
 * @exports asyncRoute
 * @module utils/asyncRoute
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import type { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Express 4 ignores the promise an async handler returns. If it rejects, no
 * response is sent, and the logger's rejection handler then exits the process:
 * one failed request takes the API down. Wrap handlers whose awaits aren't
 * inside a try, or write them with try/catch and next(error).
 * backend/src/__tests__/async-handlers.test.ts enforces one or the other.
 */
export function asyncRoute(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
