/**
 * Council Chat — Unit Tests
 * The Council page's model turns, run on the API's provider for deployments
 * with no Ollama beside the browser.
 *
 * Run: npx vitest run tests/backend/council-chat.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import express, { type NextFunction, type Request, type Response } from 'express';
import request from 'supertest';

const { chat, getStatus } = vi.hoisted(() => ({
  chat: vi.fn(),
  getStatus: vi.fn(),
}));
vi.mock('../../backend/src/services/inference/InferenceService.js', () => ({ inference: { chat, getStatus } }));

async function app() {
  vi.resetModules(); // a fresh rate limiter per app
  const { default: councilChat } = await import('../../backend/src/routes/council-chat');
  const server = express();
  server.use(express.json());
  server.use('/council/chat', councilChat);
  server.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    res.status(err.name === 'ZodError' ? 400 : 500).json({ success: false, error: { message: err.message } });
  });
  return server;
}

const turn = {
  messages: [
    { role: 'system', content: 'You are the CFO agent.' },
    { role: 'user', content: "What's our exposure?" },
  ],
  model: 'qwen2.5:14b',
  options: { temperature: 0.7, num_predict: 512 },
};

describe('POST /council/chat', () => {
  beforeEach(() => {
    chat.mockReset().mockResolvedValue({ role: 'assistant', content: 'Exposure is moderate.' });
    getStatus.mockReset().mockReturnValue({ activeProvider: 'ollama' });
  });

  it("runs the turn on the API's provider and returns the reply", async () => {
    const res = await request(await app()).post('/council/chat').send(turn);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, data: { message: { role: 'assistant', content: 'Exposure is moderate.' } } });
    expect(chat).toHaveBeenCalledWith(turn.messages, { model: 'qwen2.5:14b', temperature: 0.7, top_p: undefined, max_tokens: 512 });
  });

  it("leaves the model to providers that don't serve Ollama models", async () => {
    getStatus.mockReturnValue({ activeProvider: 'anthropic' });
    await request(await app()).post('/council/chat').send(turn);
    expect(chat.mock.calls[0][1].model).toBeUndefined();
  });

  it('rejects a malformed turn', async () => {
    const res = await request(await app()).post('/council/chat').send({ messages: [{ role: 'tool', content: 'x' }] });
    expect(res.status).toBe(400);
    expect(chat).not.toHaveBeenCalled();
  });

  it('limits each caller to 60 turns a minute', async () => {
    const server = await app();
    for (let i = 0; i < 60; i++) {
      expect((await request(server).post('/council/chat').send(turn)).status).toBe(200);
    }
    expect((await request(server).post('/council/chat').send(turn)).status).toBe(429);
  });
});
