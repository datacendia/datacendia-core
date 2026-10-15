// @vitest-environment node
/**
 * Environment Editor — Unit Tests
 * /api/v1/admin/env-config reads and writes the server's .env. Secrets leave
 * the server masked (read and download), a masked value saved back unchanged
 * keeps the stored secret, writes take only variable names and single-line
 * values, and production refuses writes. (The mount in
 * platform.domain.ts limits the whole route to SUPER_ADMIN.)
 *
 * Run: npx vitest run tests/backend/env-config.test.ts
 */

// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import express from 'express';
import request from 'supertest';

// An in-memory .env, so the test never touches a real file
const files = vi.hoisted(() => new Map<string, string>());
const modes = vi.hoisted(() => new Map<string, number>());
vi.mock('fs', () => {
  const api = {
    existsSync: (p: string) => files.has(String(p)),
    readFileSync: (p: string) => {
      const v = files.get(String(p));
      if (v === undefined) throw Object.assign(new Error('ENOENT'), { code: 'ENOENT' });
      return v;
    },
    writeFileSync: (p: string, data: string, opts?: string | { mode?: number }) => {
      files.set(String(p), String(data));
      if (typeof opts === 'object' && opts.mode !== undefined) {
        modes.set(String(p), opts.mode);
      }
    },
    copyFileSync: (from: string, to: string) => void files.set(String(to), files.get(String(from)) ?? ''),
    statSync: () => ({ mtime: new Date('2026-10-14T00:00:00Z') }),
  };
  return { default: api, ...api };
});
vi.mock('../../backend/src/utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

import envConfigRoutes from '../../backend/src/routes/env-config';

const app = express();
app.use(express.json());
app.use('/env', envConfigRoutes);

const ENV = ['NODE_ENV=development', 'PORT=3001', 'JWT_SECRET=super-secret-signing-key', 'DATABASE_URL=postgres://u:p@db/x', ''].join('\n');
const envPath = () => [...files.keys()].find((k) => k.endsWith('.env'))!;
const nodeEnv = process.env.NODE_ENV;

beforeEach(() => {
  files.clear();
  modes.clear();
  // ENV_PATH is resolved inside the module; seed it on first lookup
  files.set(require('path').resolve(__dirname, '../../.env'), ENV);
});
afterEach(() => {
  process.env.NODE_ENV = nodeEnv;
});

describe('env-config', () => {
  it('masks secrets when reading', async () => {
    const res = await request(app).get('/env');

    expect(res.status).toBe(200);
    const byKey = Object.fromEntries(res.body.data.variables.map((v: { key: string; value: string }) => [v.key, v.value]));
    expect(byKey.JWT_SECRET).toBe('su••••••••ey');
    expect(byKey.PORT).toBe('3001');
    expect(JSON.stringify(res.body)).not.toContain('super-secret-signing-key');
  });

  it('masks secrets in the download', async () => {
    const res = await request(app).get('/env/download');

    expect(res.status).toBe(200);
    expect(res.text).toContain('JWT_SECRET=su••••••••ey');
    expect(res.text).not.toContain('super-secret-signing-key');
    expect(res.text).toContain('PORT=3001');
  });

  it('keeps a stored secret when its masked value comes back unchanged', async () => {
    const res = await request(app)
      .post('/env')
      .send({ variables: { NODE_ENV: 'development', PORT: '4000', JWT_SECRET: 'su••••••••ey' } });

    expect(res.status).toBe(200);
    const written = files.get(envPath())!;
    expect(written).toContain('JWT_SECRET=super-secret-signing-key');
    expect(written).toContain('PORT=4000');
  });

  it('writes a secret that was actually changed', async () => {
    await request(app).post('/env').send({ variables: { JWT_SECRET: 'a-brand-new-secret-value' } });

    expect(files.get(envPath())).toContain('JWT_SECRET=a-brand-new-secret-value');
  });

  it('refuses to write in production', async () => {
    process.env.NODE_ENV = 'production';

    const res = await request(app).post('/env').send({ variables: { JWT_SECRET: 'attacker-chosen' } });

    expect(res.status).toBe(403);
    expect(files.get(envPath())).toBe(ENV);
  });

  it('rejects names that are not environment variable names', async () => {
    for (const body of ['{"variables":{"__proto__":"x"}}', '{"variables":{"lower_case":"x"}}', '{"variables":{"A=B":"x"}}']) {
      const res = await request(app).post('/env').set('Content-Type', 'application/json').send(body);

      expect(res.status).toBe(400);
    }
    expect(files.get(envPath())).toBe(ENV);
  });

  it('rejects values that would add lines to the file', async () => {
    const res = await request(app).post('/env').send({ variables: { PORT: '3001\nJWT_SECRET=attacker-chosen' } });

    expect(res.status).toBe(400);
    expect(files.get(envPath())).toBe(ENV);
  });

  it('backs up the file it replaced owner-only, and creates one owner-only when none exists', async () => {
    await request(app).post('/env').send({ variables: { PORT: '4000' } });
    const backups = [...files.keys()].filter((k) => k.includes('.env.backup.'));
    expect(backups).toHaveLength(1);
    expect(files.get(backups[0])).toBe(ENV);
    expect(modes.get(backups[0])).toBe(0o600);

    files.clear();
    const res = await request(app).post('/env').send({ variables: { PORT: '5000' } });
    expect(res.status).toBe(200);
    expect([...files.keys()].filter((k) => k.includes('.env.backup.'))).toHaveLength(0);
    expect(files.get(envPath())).toContain('PORT=5000');
    expect(modes.get(envPath())).toBe(0o600);
  });
});
