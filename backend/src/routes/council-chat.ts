// Copyright (c) 2024-2026 Datacendia, LLC. Licensed under Apache 2.0.
// See LICENSE file for details.

/**
 * Route — Council Chat
 *
 * One model turn of a Council deliberation, run on the API's own AI provider.
 *
 * @module routes/council-chat
 */

import { Router, type NextFunction, type Request, type Response } from 'express';
import { z } from 'zod';
import { inference } from '../services/inference/InferenceService.js';
import { endpointRateLimiter } from '../middleware/rateLimiter.js';

// The Council page runs a deliberation in the browser and makes one model call
// per agent turn. Next to a local Ollama it calls it directly, but a hosted
// deployment has no Ollama beside the visitor, so the page sends the turns here
// and they run on the API's provider (Ollama, OpenAI, Anthropic, ...).
// Mounted behind the council domain's authentication, and limited per user:
// on a hosted provider every call costs money, and a 14-agent deliberation
// makes about 20 of them.
const councilChatLimiter = endpointRateLimiter(60, 60_000);

const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(['system', 'user', 'assistant']), content: z.string().max(32_000) }))
    .min(1)
    .max(40),
  model: z.string().max(100).optional(),
  options: z
    .object({
      temperature: z.number().min(0).max(2).optional(),
      top_p: z.number().min(0).max(1).optional(),
      num_predict: z.number().int().min(1).max(4096).optional(),
    })
    .optional(),
});

const router = Router();

router.post('/', councilChatLimiter, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { messages, model, options } = chatSchema.parse(req.body);
    // Agents name the Ollama model they were tuned on (qwen2.5:14b); Ollama maps
    // that to the closest installed model, other providers use their own default.
    const onOllama = inference.getStatus().activeProvider === 'ollama';
    const reply = await inference.chat(messages, {
      model: onOllama ? model : undefined,
      temperature: options?.temperature,
      top_p: options?.top_p,
      max_tokens: options?.num_predict,
    });
    res.json({ success: true, data: { message: { role: 'assistant', content: reply.content } } });
  } catch (error) {
    next(error);
  }
});

export default router;
