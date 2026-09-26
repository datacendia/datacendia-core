/**
 * Contract — every frontend API call has a backend route
 *
 * Pages catch API errors and render empty states, so a call to a route that
 * doesn't exist fails silently: the Policy Authoring lists, the Constitutional
 * Court and Regulatory Sandbox services (which prefixed /api/v1 twice) and the
 * feedback page (whose backend doubled /feedback) were all empty that way.
 *
 * This maps the mounted backend routes (index.ts, the domain routers, route
 * modules, lazy mounts) and every `api.<method>('/path')` call in src/, and
 * fails on a call no route answers. api-routes.baseline.json lists the known
 * gaps; a new gap fails, and so does a fixed gap still on the list.
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import ts from 'typescript';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const BACKEND = path.join(ROOT, 'backend', 'src');
const BASELINE = path.join(path.dirname(fileURLToPath(import.meta.url)), 'api-routes.baseline.json');
const METHODS = ['get', 'post', 'put', 'patch', 'delete'];

interface Route { method: string; path: string }

const parse = (file: string) =>
  ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
const literal = (n: ts.Node | undefined): string | null =>
  n && (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n)) ? n.text : null;
const join = (...parts: string[]) => ('/' + parts.join('/')).replace(/\/+/g, '/').replace(/(.)\/$/, '$1');
const toTs = (fromFile: string, spec: string) => {
  const base = path.resolve(path.dirname(fromFile), spec).replace(/\.js$/, '');
  return fs.existsSync(base + '.ts') ? base + '.ts' : path.join(base, 'index.ts');
};

function importsOf(src: ts.SourceFile, file: string): Record<string, string> {
  const map: Record<string, string> = {};
  for (const st of src.statements) {
    if (!ts.isImportDeclaration(st) || !st.importClause || !ts.isStringLiteral(st.moduleSpecifier)) continue;
    const spec = st.moduleSpecifier.text;
    if (!spec.startsWith('.')) continue;
    const target = toTs(file, spec);
    if (st.importClause.name) map[st.importClause.name.text] = target;
    const nb = st.importClause.namedBindings;
    if (nb && ts.isNamedImports(nb)) for (const el of nb.elements) map[el.name.text] = target;
  }
  return map;
}

function backendRoutes(): Route[] {
  const routes: Route[] = [];
  const seen = new Set<string>();
  const collect = (file: string, prefix: string, depth = 0): void => {
    const key = `${file}|${prefix}`;
    if (seen.has(key) || depth > 4 || !fs.existsSync(file)) return;
    seen.add(key);
    const src = parse(file);
    const imports = importsOf(src, file);
    const visit = (n: ts.Node): void => {
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression)) {
        const m = n.expression.name.text;
        const p = literal(n.arguments[0]);
        if (METHODS.includes(m) && p?.startsWith('/')) routes.push({ method: m.toUpperCase(), path: join(prefix, p) });
        if (m === 'all' && p !== null) for (const mm of METHODS) routes.push({ method: mm.toUpperCase(), path: join(prefix, p) });
        if (m === 'use') {
          for (const a of n.arguments) {
            if (ts.isIdentifier(a) && imports[a.text]) collect(imports[a.text]!, join(prefix, p ?? ''), depth + 1);
          }
        }
      }
      // Lazy mounts: mountEnterpriseRoutes(router, [['/prefix', () => import('../x.js')], ...])
      if (ts.isCallExpression(n) && ts.isIdentifier(n.expression) && /mount\w*Routes/.test(n.expression.text)) {
        const list = n.arguments[1];
        if (list && ts.isArrayLiteralExpression(list)) {
          for (const el of list.elements) {
            if (!ts.isArrayLiteralExpression(el)) continue;
            const sub = literal(el.elements[0]);
            const spec = (el.elements[1]?.getText(src).match(/import\(\s*['"]([^'"]+)['"]\s*\)/) ?? [])[1];
            if (sub !== null && spec) collect(toTs(file, spec), join(prefix, sub), depth + 1);
          }
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(src);
  };

  const indexFile = path.join(BACKEND, 'index.ts');
  const indexSrc = parse(indexFile);
  const imports = importsOf(indexSrc, indexFile);
  // Domain routers are re-exported from routes/domains/index.ts: council.domain.ts -> councilDomain.
  const domains = path.join(BACKEND, 'routes', 'domains');
  for (const f of fs.readdirSync(domains).filter((x) => x.endsWith('.domain.ts'))) {
    imports[f.replace('.domain.ts', '').replace(/-([a-z])/g, (_, c: string) => c.toUpperCase()) + 'Domain'] = path.join(domains, f);
  }
  const visitIndex = (n: ts.Node): void => {
    if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && n.expression.expression.getText(indexSrc) === 'app') {
      const m = n.expression.name.text;
      const p = literal(n.arguments[0]);
      if (p?.startsWith('/api/')) {
        if (METHODS.includes(m)) routes.push({ method: m.toUpperCase(), path: p });
        if (m === 'use') for (const a of n.arguments) if (ts.isIdentifier(a) && imports[a.text]) collect(imports[a.text]!, p);
      }
    }
    ts.forEachChild(n, visitIndex);
  };
  visitIndex(indexSrc);
  return routes;
}

function frontendCalls(): Route[] {
  const calls: Route[] = [];
  const walk = (d: string): string[] =>
    fs.readdirSync(d, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory()
        ? (['node_modules', '__tests__'].includes(e.name) ? [] : walk(path.join(d, e.name)))
        : /\.tsx?$/.test(e.name) && !/\.test\./.test(e.name) ? [path.join(d, e.name)] : []);
  for (const file of walk(path.join(ROOT, 'src'))) {
    const src = parse(file);
    const visit = (n: ts.Node): void => {
      if (ts.isCallExpression(n) && ts.isPropertyAccessExpression(n.expression) && METHODS.includes(n.expression.name.text)) {
        const a = n.arguments[0];
        if (/(^|\.)api$/i.test(n.expression.expression.getText(src)) && a) {
          let p: string | null = literal(a);
          if (p === null && ts.isTemplateExpression(a)) p = a.head.text + a.templateSpans.map((s) => ':p' + s.literal.text).join('');
          if (p?.startsWith('/')) calls.push({ method: n.expression.name.text.toUpperCase(), path: join('/api/v1', p.split('?')[0]!) });
        }
      }
      ts.forEachChild(n, visit);
    };
    visit(src);
  }
  return calls;
}

const segments = (p: string) => p.split('/').filter(Boolean);
const answers = (route: Route, call: Route) => {
  if (route.method !== call.method) return false;
  const a = segments(call.path);
  const b = segments(route.path);
  return a.length === b.length && a.every((s, i) => s === b[i] || s.includes(':p') || b[i]!.startsWith(':'));
};

describe('frontend ↔ backend API contract', () => {
  const routes = backendRoutes();
  const calls = frontendCalls();
  const unanswered = [...new Set(calls.filter((c) => !routes.some((r) => answers(r, c))).map((c) => `${c.method} ${c.path}`))].sort();
  const baseline: string[] = JSON.parse(fs.readFileSync(BASELINE, 'utf8'));

  it('finds the routes and calls it is meant to check', () => {
    expect(routes.length).toBeGreaterThan(1000);
    expect(calls.length).toBeGreaterThan(200);
  });

  it('adds no frontend call that no backend route answers', () => {
    expect(unanswered.filter((c) => !baseline.includes(c)), 'fix the path, or add the route').toEqual([]);
  });

  it('keeps the baseline to gaps that still exist', () => {
    expect(baseline.filter((c) => !unanswered.includes(c)), 'fixed: remove from api-routes.baseline.json').toEqual([]);
  });
});
