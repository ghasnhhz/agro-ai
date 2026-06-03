import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { getCrops, getRegions } from '../store/reference.js';
import { calculateProfitability } from '../services/profitability.js';

export const referenceRouter = Router();

// GET /api/regions — reference list (auth-protected; client caches it).
referenceRouter.get(
  '/regions',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(getRegions());
  }),
);

// GET /api/crops — full crop reference (optional browsing).
referenceRouter.get(
  '/crops',
  requireAuth,
  asyncHandler(async (_req, res) => {
    res.json(getCrops());
  }),
);

const calcSchema = z.object({
  regionId: z.number().int().positive(),
  size: z.number().positive().max(100000),
  sizeUnit: z.enum(['sotka', 'hectare', 'm2']),
  waterLevel: z.enum(['none', 'rain', 'limited', 'reliable']),
  goal: z.enum(['consumption', 'profit']),
  locale: z.enum(['uz', 'ru', 'en']).optional(),
});

export const profitabilityRouter = Router();

// POST /api/profitability/calculate — ranked, size-scaled crop estimates.
profitabilityRouter.post(
  '/calculate',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = calcSchema.parse(req.body ?? {});
    res.json(calculateProfitability(input));
  }),
);
