// Shared domain + API types for YerLab, imported by both web and api.

export type Locale = 'uz' | 'ru' | 'en';

export type WaterLevel = 'none' | 'rain' | 'limited' | 'reliable';
export type WaterNeed = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Goal = 'consumption' | 'profit';
export type SizeUnit = 'sotka' | 'hectare' | 'm2';
export type Suitability = 'low' | 'medium' | 'high';

// ---- Domain ----

export interface User {
  id: string;
  telegramId: number;
  username: string | null;
  firstName: string | null;
  languageCode: Locale | null;
  createdAt: string;
}

export interface Region {
  id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export interface Crop {
  id: number;
  name_uz: string;
  name_ru: string;
  name_en: string;
  difficulty: Difficulty;
  water_need: WaterNeed;
  min_water_level: number; // 0=none 1=rain 2=limited 3=reliable
  harvest_days_min: number;
  harvest_days_max: number;
  investment_per_sotka_uzs: number;
  yield_kg_per_sotka: number;
  price_per_kg_uzs: number;
  good_for_consumption: boolean;
  good_for_profit: boolean;
  notes_uz: string;
  notes_ru: string;
}

export interface CropRegion {
  crop_id: number;
  region_id: number;
  suitability: Suitability;
}

// ---- Auth ----

export interface AuthRequest {
  initData: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  devMode: boolean;
}

// ---- Profitability ----

export interface CalculateRequest {
  regionId: number;
  size: number;
  sizeUnit: SizeUnit;
  waterLevel: WaterLevel;
  goal: Goal;
}

export interface CropResult {
  cropId: number;
  name: string;
  difficulty: Difficulty;
  waterNeed: WaterNeed;
  suitability: Suitability;
  harvestPeriod: string; // e.g. "60–80 days"
  harvestDaysMin: number;
  harvestDaysMax: number;
  investmentUzs: number;
  expectedYieldKg: number;
  expectedRevenueUzs: number;
  expectedProfitUzs: number;
  pricePerKgUzs: number;
  notes: string;
}

export interface CalculateAssumptions {
  sizeSotka: number;
  currency: 'UZS';
  basis: string;
  disclaimer: string;
}

export interface CalculateResponse {
  results: CropResult[];
  assumptions: CalculateAssumptions;
}

// ---- Disease detection ----

export type DiseaseType = 'disease' | 'pest' | 'damage' | 'deficiency' | 'unknown';
export type ConfidenceBand = 'low' | 'medium' | 'high';

export interface DiseaseAlternative {
  name: string;
  type: DiseaseType;
}

export interface DiseaseResult {
  primary: {
    type: DiseaseType;
    name: string;
    probableCause: string;
  };
  confidence: ConfidenceBand;
  alternatives: DiseaseAlternative[];
  treatment: {
    category: string;
    guidance: string;
    prevention: string;
  };
  disclaimer: string;
  imageUnclear?: boolean;
  fallback?: boolean;
}

// ---- Marketplace ----

export type ListingStatus = 'active' | 'closed';

export interface ListingPhoto {
  id: string;
  url: string;
  sortOrder: number;
}

export interface Listing {
  id: string;
  ownerId: string;
  title: string;
  regionId: number;
  locationText: string;
  lat: number | null;
  lng: number | null;
  sizeSotka: number;
  waterAvailability: WaterLevel;
  rentalTerms: string;
  contactTelegram: string;
  status: ListingStatus;
  photos: ListingPhoto[];
  createdAt: string;
  isOwner?: boolean;
}

export interface ListingInput {
  title: string;
  regionId: number;
  locationText: string;
  lat?: number | null;
  lng?: number | null;
  size: number;
  sizeUnit: SizeUnit;
  waterAvailability: WaterLevel;
  rentalTerms: string;
  contactTelegram?: string;
  photoUrls?: string[];
}

export interface ListingsQuery {
  region?: number;
  minSize?: number;
  maxSize?: number;
  water?: WaterLevel;
  mine?: boolean;
  page?: number;
}

export interface ListingsResponse {
  items: Listing[];
  page: number;
  total: number;
  pageSize: number;
}

export interface UploadResponse {
  urls: string[];
}

export interface ApiError {
  error: { code: string; message: string };
}
