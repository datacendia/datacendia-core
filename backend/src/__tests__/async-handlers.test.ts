/**
 * Tests — async handlers can't take the API down
 *
 * Express 4 ignores the promise an async handler or middleware returns. If it
 * rejects, the request never gets an answer, and the logger's rejection
 * handler then exits the process. This scans the HTTP layer for async
 * functions that can reject: a `throw` or `await` outside a try block, in a
 * function not wrapped by asyncRoute() (or a local asyncHandler()).
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const SRC = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIRS = ['routes', 'routes/domains', 'middleware', 'security'];
const ROUTER_METHODS = new Set(['get', 'post', 'put', 'patch', 'delete', 'use', 'all', 'options', 'head']);
const WRAPPERS = new Set(['asyncRoute', 'asyncHandler']);

const isAsync = (n: ts.Node): n is ts.FunctionLikeDeclaration =>
  (ts.isArrowFunction(n) || ts.isFunctionExpression(n) || ts.isFunctionDeclaration(n)) &&
  (ts.getCombinedModifierFlags(n as ts.Declaration) & ts.ModifierFlags.Async) !== 0;

const calleeName = (call: ts.CallExpression): string | undefined =>
  ts.isIdentifier(call.expression) ? call.expression.text
    : ts.isPropertyAccessExpression(call.expression) ? call.expression.name.text : undefined;

/** An async function Express will call: a router callback, or a (req, res[, next]) function. */
function isHandler(fn: ts.FunctionLikeDeclaration): boolean {
  const parent = fn.parent;
  if (parent && ts.isCallExpression(parent)) {
    const name = calleeName(parent);
    if (name && WRAPPERS.has(name)) return false; // wrapped: rejections reach next()
    if (name && ROUTER_METHODS.has(name) && ts.isPropertyAccessExpression(parent.expression)) return true;
  }
  const names = fn.parameters.map((p) => (ts.isIdentifier(p.name) ? p.name.text : ''));
  return names.includes('next') || (/^_?req/.test(names[0] ?? '') && /^_?res/.test(names[1] ?? ''));
}

/** First throw/await that isn't inside a try block of this function. */
function unguarded(fn: ts.FunctionLikeDeclaration): ts.Node | undefined {
  let found: ts.Node | undefined;
  const visit = (node: ts.Node, inTry: boolean): void => {
    if (found || (node !== fn && ts.isFunctionLike(node))) return;
    if ((ts.isThrowStatement(node) || ts.isAwaitExpression(node)) && !inTry) {
      found = node;
      return;
    }
    if (ts.isTryStatement(node)) {
      visit(node.tryBlock, true);
      if (node.catchClause) visit(node.catchClause, inTry);
      if (node.finallyBlock) visit(node.finallyBlock, inTry);
      return;
    }
    ts.forEachChild(node, (child) => visit(child, inTry));
  };
  visit(fn, false);
  return found;
}

function scan(): string[] {
  const offenders: string[] = [];
  for (const dir of DIRS) {
    const abs = path.join(SRC, dir);
    if (!fs.existsSync(abs)) continue;
    for (const file of fs.readdirSync(abs).filter((f) => f.endsWith('.ts') && !f.endsWith('.test.ts'))) {
      const full = path.join(abs, file);
      const source = ts.createSourceFile(full, fs.readFileSync(full, 'utf8'), ts.ScriptTarget.Latest, true);
      const walk = (node: ts.Node): void => {
        if (isAsync(node) && isHandler(node)) {
          const bad = unguarded(node);
          if (bad) {
            const { line } = source.getLineAndCharacterOfPosition(bad.getStart(source));
            offenders.push(`${dir}/${file}:${line + 1}  ${bad.getText(source).split('\n')[0]!.slice(0, 80)}`);
          }
        }
        ts.forEachChild(node, walk);
      };
      walk(source);
    }
  }
  return offenders;
}

describe('async HTTP handlers', () => {
  it('forward every rejection to next() instead of leaving it unhandled', () => {
    expect(scan(), 'wrap these in asyncRoute() or catch and call next(error)').toEqual([]);
  });

  it('the scan catches the pattern it guards against', () => {
    const probe = ts.createSourceFile('probe.ts', `
      router.get('/a', async (req, res) => { await work(); res.json({}); });
      router.get('/b', asyncRoute(async (req, res) => { await work(); res.json({}); }));
      router.get('/c', async (req, res, next) => { try { await work(); } catch (e) { next(e); } });
    `, ts.ScriptTarget.Latest, true);
    const flagged: string[] = [];
    const walk = (node: ts.Node): void => {
      if (isAsync(node) && isHandler(node) && unguarded(node)) flagged.push(node.getText(probe));
      ts.forEachChild(node, walk);
    };
    walk(probe);
    expect(flagged).toEqual(['async (req, res) => { await work(); res.json({}); }']);
  });
});
