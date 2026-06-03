import crypto from 'node:crypto';
import path from 'node:path';
import { Router } from 'express';
import multer from 'multer';
import type { UploadResponse } from '@yerlab/types';
import { asyncHandler, HttpError } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import { publicUploadUrl, uploadsDir } from '../lib/paths.js';

const ALLOWED: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = ALLOWED[file.mimetype] ?? path.extname(file.originalname) ?? '.jpg';
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 6 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED[file.mimetype]) cb(null, true);
    else cb(new HttpError(400, 'BAD_IMAGE', 'Unsupported image type. Use JPEG, PNG, or WebP.'));
  },
});

export const uploadsRouter = Router();

// POST /api/uploads — up to 5 images (field `images`); returns stored URLs.
uploadsRouter.post(
  '/',
  requireAuth,
  upload.array('images', 5),
  asyncHandler(async (req, res) => {
    const files = (req.files as Express.Multer.File[]) ?? [];
    if (files.length === 0) throw new HttpError(400, 'NO_FILES', 'No images uploaded.');
    const host = req.get('host') ?? `localhost`;
    const protocol = req.protocol;
    const urls = files.map((f) => publicUploadUrl(host, protocol, f.filename));
    const body: UploadResponse = { urls };
    res.json(body);
  }),
);
