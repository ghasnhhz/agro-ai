import { Router } from 'express';
import { z } from 'zod';
import type { Listing, ListingsResponse } from '@yerlab/types';
import { asyncHandler, HttpError } from '../lib/http.js';
import { requireAuth } from '../middleware/auth.js';
import {
  createListing,
  deleteListing,
  getListing,
  listListings,
  toSotka,
  updateListing,
} from '../store/listings.js';

const PAGE_SIZE = 20;

const waterEnum = z.enum(['none', 'rain', 'limited', 'reliable']);
const unitEnum = z.enum(['sotka', 'hectare', 'm2']);

const createSchema = z.object({
  title: z.string().trim().min(3).max(120),
  regionId: z.number().int().positive(),
  locationText: z.string().trim().min(2).max(300),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  size: z.number().positive().max(100000),
  sizeUnit: unitEnum,
  waterAvailability: waterEnum,
  rentalTerms: z.string().trim().min(2).max(500),
  contactTelegram: z.string().trim().max(64).optional(),
  photoUrls: z.array(z.string().url()).max(5).optional(),
});

const patchSchema = z.object({
  title: z.string().trim().min(3).max(120).optional(),
  regionId: z.number().int().positive().optional(),
  locationText: z.string().trim().min(2).max(300).optional(),
  lat: z.number().nullable().optional(),
  lng: z.number().nullable().optional(),
  size: z.number().positive().max(100000).optional(),
  sizeUnit: unitEnum.optional(),
  waterAvailability: waterEnum.optional(),
  rentalTerms: z.string().trim().min(2).max(500).optional(),
  contactTelegram: z.string().trim().max(64).optional(),
  status: z.enum(['active', 'closed']).optional(),
  photoUrls: z.array(z.string().url()).max(5).optional(),
});

const querySchema = z.object({
  region: z.coerce.number().int().positive().optional(),
  minSize: z.coerce.number().nonnegative().optional(),
  maxSize: z.coerce.number().positive().optional(),
  water: waterEnum.optional(),
  mine: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
});

export const listingsRouter = Router();

function withOwner(listing: Listing, userId: string): Listing {
  return { ...listing, isOwner: listing.ownerId === userId };
}

// GET /api/listings — filtered, paginated feed (or the user's own with ?mine=1).
listingsRouter.get(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const q = querySchema.parse(req.query);
    const all = listListings({
      region: q.region,
      minSize: q.minSize,
      maxSize: q.maxSize,
      water: q.water,
      ownerId: q.mine ? req.user!.id : undefined,
    });
    const start = (q.page - 1) * PAGE_SIZE;
    const items = all.slice(start, start + PAGE_SIZE).map((l) => withOwner(l, req.user!.id));
    const body: ListingsResponse = {
      items,
      page: q.page,
      total: all.length,
      pageSize: PAGE_SIZE,
    };
    res.json(body);
  }),
);

// GET /api/listings/:id — full detail (+ photos + contact).
listingsRouter.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = getListing(req.params.id);
    if (!listing) throw new HttpError(404, 'NOT_FOUND', 'Listing not found.');
    res.json(withOwner(listing, req.user!.id));
  }),
);

// POST /api/listings — create (owner = current user).
listingsRouter.post(
  '/',
  requireAuth,
  asyncHandler(async (req, res) => {
    const input = createSchema.parse(req.body ?? {});
    const contact =
      input.contactTelegram?.replace(/^@/, '') || req.user!.username || String(req.user!.telegramId);
    const listing = createListing({
      ownerId: req.user!.id,
      title: input.title,
      regionId: input.regionId,
      locationText: input.locationText,
      lat: input.lat ?? null,
      lng: input.lng ?? null,
      sizeSotka: toSotka(input.size, input.sizeUnit),
      waterAvailability: input.waterAvailability,
      rentalTerms: input.rentalTerms,
      contactTelegram: contact,
      photoUrls: input.photoUrls ?? [],
    });
    res.status(201).json(withOwner(listing, req.user!.id));
  }),
);

// PATCH /api/listings/:id — edit own listing (fields / status).
listingsRouter.patch(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = getListing(req.params.id);
    if (!listing) throw new HttpError(404, 'NOT_FOUND', 'Listing not found.');
    if (listing.ownerId !== req.user!.id) {
      throw new HttpError(403, 'FORBIDDEN', 'You can only edit your own listing.');
    }
    const input = patchSchema.parse(req.body ?? {});
    const sizeSotka =
      input.size !== undefined && input.sizeUnit !== undefined
        ? toSotka(input.size, input.sizeUnit)
        : undefined;
    const updated = updateListing(listing, {
      title: input.title,
      regionId: input.regionId,
      locationText: input.locationText,
      lat: input.lat,
      lng: input.lng,
      sizeSotka,
      waterAvailability: input.waterAvailability,
      rentalTerms: input.rentalTerms,
      contactTelegram: input.contactTelegram?.replace(/^@/, ''),
      status: input.status,
      photoUrls: input.photoUrls,
    });
    res.json(withOwner(updated, req.user!.id));
  }),
);

// DELETE /api/listings/:id — delete own listing.
listingsRouter.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req, res) => {
    const listing = getListing(req.params.id);
    if (!listing) throw new HttpError(404, 'NOT_FOUND', 'Listing not found.');
    if (listing.ownerId !== req.user!.id) {
      throw new HttpError(403, 'FORBIDDEN', 'You can only delete your own listing.');
    }
    deleteListing(listing.id);
    res.json({ ok: true });
  }),
);
