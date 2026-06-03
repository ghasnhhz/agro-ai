import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/http.js';
import { authenticateTelegram } from '../services/auth.js';

export const authRouter = Router();

const bodySchema = z.object({
  initData: z.string().default(''),
});

// POST /api/auth/telegram — validate initData, upsert user, return session token.
authRouter.post(
  '/telegram',
  asyncHandler(async (req, res) => {
    const { initData } = bodySchema.parse(req.body ?? {});
    const result = authenticateTelegram(initData);
    res.json(result);
  }),
);
