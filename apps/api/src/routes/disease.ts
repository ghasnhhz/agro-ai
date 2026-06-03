import { Router } from 'express';
import multer from 'multer';
import { z } from 'zod';
import type { Locale } from '@yerlab/types';
import { config } from '../config.js';
import { asyncHandler, HttpError } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { dailyLimit } from '../middleware/rateLimit.js';
import { analyzeDisease } from '../services/disease.js';
import { logScan } from '../store/scans.js';

const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_BYTES = 6 * 1024 * 1024; // 6MB

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED.includes(file.mimetype)) cb(null, true);
    else cb(new HttpError(400, 'BAD_IMAGE', 'Unsupported image type. Use JPEG, PNG, or WebP.'));
  },
});

function resolveLocale(value: unknown, fallback: Locale): Locale {
  const v = String(value ?? '').toLowerCase();
  return v === 'uz' || v === 'ru' || v === 'en' ? (v as Locale) : fallback;
}

const base64Schema = z.object({
  imageBase64: z.string().min(16),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']).default('image/jpeg'),
  locale: z.enum(['uz', 'ru', 'en']).optional(),
});

export const diseaseRouter = Router();

// POST /api/disease/analyze — multipart `image` OR JSON `{ imageBase64, mediaType }`.
diseaseRouter.post(
  '/analyze',
  requireAuth,
  dailyLimit(config.diseaseDailyLimit),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const userLocale = (req.user?.languageCode as Locale | null) ?? 'uz';
    let imageBase64: string;
    let mediaType: string;
    let locale: Locale;

    if (req.file) {
      if (!ALLOWED.includes(req.file.mimetype)) {
        throw new HttpError(400, 'BAD_IMAGE', 'Unsupported image type. Use JPEG, PNG, or WebP.');
      }
      imageBase64 = req.file.buffer.toString('base64');
      mediaType = req.file.mimetype;
      locale = resolveLocale(req.body?.locale, userLocale);
    } else {
      const body = base64Schema.parse(req.body ?? {});
      // Strip a possible data: URL prefix.
      imageBase64 = body.imageBase64.replace(/^data:[^;]+;base64,/, '');
      mediaType = body.mediaType;
      locale = resolveLocale(body.locale, userLocale);
      const approxBytes = (imageBase64.length * 3) / 4;
      if (approxBytes > MAX_BYTES) {
        throw new HttpError(400, 'IMAGE_TOO_LARGE', 'Image is too large. Please use a smaller photo.');
      }
    }

    const result = await analyzeDisease(imageBase64, mediaType, locale);
    logScan(req.user!.id, result);
    res.json(result);
  }),
);
