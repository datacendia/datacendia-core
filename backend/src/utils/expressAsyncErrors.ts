/**
 * Utils — Express async errors
 *
 * Makes Express 4 send a rejected promise from any handler or middleware to
 * next(err), as Express 5 does itself. Import it before anything creates a
 * router: it is the first import in index.ts.
 *
 * @module utils/expressAsyncErrors
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.
//
// Same technique as express-async-errors (MIT, Alexei Bazhenov): wrap each
// function Express stores in a Layer. Layer is reached through a router
// instance rather than express/lib internals. Remove on moving to Express 5.

import express from 'express';

type Handler = (this: unknown, ...args: unknown[]) => unknown;

/**
 * Express 4 calls a handler and drops what it returns. When an async handler
 * rejects (a throw, a failed await, or any TypeError in its body), the request
 * gets no answer, and the logger's rejectionHandlers then exit the process, so
 * one bad request took the API down. Wrapped, the error reaches errorHandler.
 */
function wrap(fn: Handler): Handler {
  const wrapped = function (this: unknown, ...args: unknown[]): unknown {
    const result = fn.apply(this, args);
    if (result && typeof (result as Promise<unknown>).catch === 'function') {
      // (req, res, next) or (err, req, res, next): next is always last.
      const next = args[args.length - 1];
      (result as Promise<unknown>).catch((err: unknown) => {
        if (typeof next === 'function') {
          next(err ?? new Error('Handler rejected without a reason'));
        }
      });
    }
    return result;
  };
  // Express tells error handlers apart by arity (4); keep length and name.
  Object.defineProperty(wrapped, 'length', { value: fn.length });
  Object.defineProperty(wrapped, 'name', { value: fn.name });
  return wrapped;
}

const probe = express.Router();
probe.use((_req, _res, next) => next());
const layerPrototype = Object.getPrototypeOf(probe.stack[0]) as object;
const stored = Symbol('handle');
const installed = Symbol.for('datacendia.expressAsyncErrors');

if (!(installed in layerPrototype)) {
  // Layer's constructor assigns this.handle = fn; with this accessor on the
  // prototype, that assignment stores the wrapped function instead.
  Object.defineProperty(layerPrototype, 'handle', {
    configurable: true,
    enumerable: true,
    get(this: Record<symbol, Handler | undefined>) {
      return this[stored];
    },
    set(this: Record<symbol, Handler | undefined>, fn: Handler) {
      this[stored] = typeof fn === 'function' ? wrap(fn) : fn;
    },
  });
  Object.defineProperty(layerPrototype, installed, { value: true });
}

export {};
