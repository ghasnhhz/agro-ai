import type { Crop, Region } from '@yerlab/types';
import { regions } from '../data/regions.js';
import { crops } from '../data/crops.js';

export { getSuitability } from '../data/cropRegion.js';

export function getRegions(): Region[] {
  return regions;
}

export function getCrops(): Crop[] {
  return crops;
}

const regionById = new Map(regions.map((r) => [r.id, r]));
const cropById = new Map(crops.map((c) => [c.id, c]));

export function getRegionById(id: number): Region | undefined {
  return regionById.get(id);
}

export function getCropById(id: number): Crop | undefined {
  return cropById.get(id);
}
