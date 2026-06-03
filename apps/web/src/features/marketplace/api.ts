import type {
  Listing,
  ListingInput,
  ListingsResponse,
  UploadResponse,
  WaterLevel,
} from '@yerlab/types';
import { api } from '../../lib/api';

export interface FeedFilters {
  region?: number;
  minSize?: number;
  maxSize?: number;
  water?: WaterLevel;
  mine?: boolean;
  page?: number;
}

export function fetchListings(filters: FeedFilters): Promise<ListingsResponse> {
  const q = new URLSearchParams();
  if (filters.region) q.set('region', String(filters.region));
  if (filters.minSize != null) q.set('minSize', String(filters.minSize));
  if (filters.maxSize != null) q.set('maxSize', String(filters.maxSize));
  if (filters.water) q.set('water', filters.water);
  if (filters.mine) q.set('mine', '1');
  if (filters.page) q.set('page', String(filters.page));
  const qs = q.toString();
  return api.get<ListingsResponse>(`/listings${qs ? `?${qs}` : ''}`);
}

export function fetchListing(id: string): Promise<Listing> {
  return api.get<Listing>(`/listings/${id}`);
}

export function createListing(input: ListingInput): Promise<Listing> {
  return api.post<Listing>('/listings', input);
}

export function updateListing(id: string, patch: Partial<ListingInput> & { status?: string }) {
  return api.patch<Listing>(`/listings/${id}`, patch);
}

export function deleteListing(id: string): Promise<{ ok: boolean }> {
  return api.delete<{ ok: boolean }>(`/listings/${id}`);
}

/** Upload up to 5 image files; returns stored URLs. */
export async function uploadImages(files: File[]): Promise<string[]> {
  const form = new FormData();
  for (const f of files) form.append('images', f);
  const res = await api.post<UploadResponse>('/uploads', form);
  return res.urls;
}
