import type { CropRegion, Suitability } from '@yerlab/types';

// Suitability defaults to 'medium' for every crop×region; these overrides capture
// well-known regional specialties (and poor fits) to shape ranking.
// Region ids: 1 Andijon, 2 Buxoro, 3 Fargona, 4 Jizzax, 5 Xorazm, 6 Namangan,
// 7 Navoiy, 8 Qashqadaryo, 9 Qoraqalpogiston, 10 Samarqand, 11 Sirdaryo,
// 12 Surxondaryo, 13 Toshkent viloyati, 14 Toshkent shahri.
export const cropRegionOverrides: CropRegion[] = [
  // Watermelon (9) — arid melon belt
  { crop_id: 9, region_id: 5, suitability: 'high' },
  { crop_id: 9, region_id: 2, suitability: 'high' },
  { crop_id: 9, region_id: 9, suitability: 'high' },
  { crop_id: 9, region_id: 7, suitability: 'high' },
  { crop_id: 9, region_id: 12, suitability: 'high' },
  // Melon (10) — famous Uzbek melon regions
  { crop_id: 10, region_id: 5, suitability: 'high' },
  { crop_id: 10, region_id: 2, suitability: 'high' },
  { crop_id: 10, region_id: 9, suitability: 'high' },
  { crop_id: 10, region_id: 12, suitability: 'high' },
  { crop_id: 10, region_id: 4, suitability: 'high' },
  // Grapes (19)
  { crop_id: 19, region_id: 10, suitability: 'high' },
  { crop_id: 19, region_id: 13, suitability: 'high' },
  { crop_id: 19, region_id: 3, suitability: 'high' },
  { crop_id: 19, region_id: 12, suitability: 'high' },
  // Tomato (1) — Fergana valley + market regions + warm south
  { crop_id: 1, region_id: 1, suitability: 'high' },
  { crop_id: 1, region_id: 3, suitability: 'high' },
  { crop_id: 1, region_id: 13, suitability: 'high' },
  { crop_id: 1, region_id: 14, suitability: 'high' },
  { crop_id: 1, region_id: 12, suitability: 'high' },
  // Cucumber (2)
  { crop_id: 2, region_id: 1, suitability: 'high' },
  { crop_id: 2, region_id: 6, suitability: 'high' },
  { crop_id: 2, region_id: 13, suitability: 'high' },
  // Bell pepper (6)
  { crop_id: 6, region_id: 12, suitability: 'high' },
  { crop_id: 6, region_id: 1, suitability: 'high' },
  { crop_id: 6, region_id: 13, suitability: 'high' },
  // Herbs & greens (17) — near big markets
  { crop_id: 17, region_id: 14, suitability: 'high' },
  { crop_id: 17, region_id: 13, suitability: 'high' },
  // Strawberry (18) — needs reliable water; poor in arid regions
  { crop_id: 18, region_id: 13, suitability: 'high' },
  { crop_id: 18, region_id: 10, suitability: 'high' },
  { crop_id: 18, region_id: 9, suitability: 'low' },
  { crop_id: 18, region_id: 5, suitability: 'low' },
  { crop_id: 18, region_id: 7, suitability: 'low' },
  { crop_id: 18, region_id: 2, suitability: 'low' },
  // Wheat (11) — grain regions
  { crop_id: 11, region_id: 8, suitability: 'high' },
  { crop_id: 11, region_id: 4, suitability: 'high' },
  { crop_id: 11, region_id: 11, suitability: 'high' },
  { crop_id: 11, region_id: 10, suitability: 'high' },
  // Cabbage (7) — water-hungry, poor in arid
  { crop_id: 7, region_id: 9, suitability: 'low' },
  { crop_id: 7, region_id: 7, suitability: 'low' },
];

const overrideMap = new Map<string, Suitability>(
  cropRegionOverrides.map((o) => [`${o.crop_id}:${o.region_id}`, o.suitability]),
);

export function getSuitability(cropId: number, regionId: number): Suitability {
  return overrideMap.get(`${cropId}:${regionId}`) ?? 'medium';
}
