import crypto from 'node:crypto';
import type {
  Listing,
  ListingPhoto,
  ListingStatus,
  SizeUnit,
  WaterLevel,
} from '@yerlab/types';

const SOTKA_PER_UNIT: Record<SizeUnit, number> = { sotka: 1, hectare: 100, m2: 0.01 };

export function toSotka(size: number, unit: SizeUnit): number {
  return Math.round(size * SOTKA_PER_UNIT[unit] * 100) / 100;
}

export interface CreateListingData {
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
  photoUrls: string[];
}

const listings = new Map<string, Listing>();

function photo(url: string, i: number): ListingPhoto {
  return { id: crypto.randomUUID(), url, sortOrder: i };
}

export function createListing(data: CreateListingData): Listing {
  const listing: Listing = {
    id: crypto.randomUUID(),
    ownerId: data.ownerId,
    title: data.title,
    regionId: data.regionId,
    locationText: data.locationText,
    lat: data.lat,
    lng: data.lng,
    sizeSotka: data.sizeSotka,
    waterAvailability: data.waterAvailability,
    rentalTerms: data.rentalTerms,
    contactTelegram: data.contactTelegram,
    status: 'active',
    photos: data.photoUrls.map(photo),
    createdAt: new Date().toISOString(),
  };
  listings.set(listing.id, listing);
  return listing;
}

export interface ListFilters {
  region?: number;
  minSize?: number;
  maxSize?: number;
  water?: WaterLevel;
  ownerId?: string; // when set, returns only this owner's listings (any status)
}

export function listListings(filters: ListFilters): Listing[] {
  let items = [...listings.values()];
  if (filters.ownerId) {
    items = items.filter((l) => l.ownerId === filters.ownerId);
  } else {
    items = items.filter((l) => l.status === 'active');
  }
  if (filters.region) items = items.filter((l) => l.regionId === filters.region);
  if (filters.water) items = items.filter((l) => l.waterAvailability === filters.water);
  if (filters.minSize != null) items = items.filter((l) => l.sizeSotka >= filters.minSize!);
  if (filters.maxSize != null) items = items.filter((l) => l.sizeSotka <= filters.maxSize!);
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getListing(id: string): Listing | undefined {
  return listings.get(id);
}

export interface UpdateListingData {
  title?: string;
  regionId?: number;
  locationText?: string;
  lat?: number | null;
  lng?: number | null;
  sizeSotka?: number;
  waterAvailability?: WaterLevel;
  rentalTerms?: string;
  contactTelegram?: string;
  status?: ListingStatus;
  photoUrls?: string[];
}

export function updateListing(listing: Listing, patch: UpdateListingData): Listing {
  if (patch.title !== undefined) listing.title = patch.title;
  if (patch.regionId !== undefined) listing.regionId = patch.regionId;
  if (patch.locationText !== undefined) listing.locationText = patch.locationText;
  if (patch.lat !== undefined) listing.lat = patch.lat;
  if (patch.lng !== undefined) listing.lng = patch.lng;
  if (patch.sizeSotka !== undefined) listing.sizeSotka = patch.sizeSotka;
  if (patch.waterAvailability !== undefined) listing.waterAvailability = patch.waterAvailability;
  if (patch.rentalTerms !== undefined) listing.rentalTerms = patch.rentalTerms;
  if (patch.contactTelegram !== undefined) listing.contactTelegram = patch.contactTelegram;
  if (patch.status !== undefined) listing.status = patch.status;
  if (patch.photoUrls !== undefined) listing.photos = patch.photoUrls.map(photo);
  return listing;
}

export function deleteListing(id: string): void {
  listings.delete(id);
}

// ---- Demo seed data (sample listings by other owners) ----
const SEED_OWNER = 'seed-owner-0000';

function seed() {
  if (listings.size > 0) return;
  const samples: Omit<CreateListingData, 'ownerId'>[] = [
    {
      title: "Xorazmda sug'oriladigan 50 sotka yer",
      regionId: 5,
      locationText: "Xonqa tumani, kanal yaqinida",
      lat: null,
      lng: null,
      sizeSotka: 50,
      waterAvailability: 'reliable',
      rentalTerms: "Yiliga 8 mln so'm, kelishilgan holda",
      contactTelegram: 'yerlab_demo',
      photoUrls: ['https://picsum.photos/seed/yerlab-xorazm/600/400'],
    },
    {
      title: '0.5 gektar bahor uchun bo‘sh maydon',
      regionId: 10,
      locationText: "Samarqand, Urgut yo'li",
      lat: null,
      lng: null,
      sizeSotka: 50,
      waterAvailability: 'limited',
      rentalTerms: 'Mavsumga kelishamiz, hosildan ulush ham mumkin',
      contactTelegram: 'yerlab_demo',
      photoUrls: [
        'https://picsum.photos/seed/yerlab-sam1/600/400',
        'https://picsum.photos/seed/yerlab-sam2/600/400',
      ],
    },
    {
      title: 'Toshkent yaqinida 20 sotka tomorqa',
      regionId: 13,
      locationText: "Qibray tumani",
      lat: null,
      lng: null,
      sizeSotka: 20,
      waterAvailability: 'reliable',
      rentalTerms: "Oyiga 1.2 mln so'm",
      contactTelegram: 'yerlab_demo',
      photoUrls: ['https://picsum.photos/seed/yerlab-tash/600/400'],
    },
    {
      title: 'Farg‘onada 1 gektar dehqonchilik yeri',
      regionId: 3,
      locationText: "Quva tumani",
      lat: null,
      lng: null,
      sizeSotka: 100,
      waterAvailability: 'limited',
      rentalTerms: 'Uzoq muddatga ijara, narx kelishiladi',
      contactTelegram: 'yerlab_demo',
      photoUrls: ['https://picsum.photos/seed/yerlab-fargona/600/400'],
    },
  ];
  for (const s of samples) {
    createListing({ ...s, ownerId: SEED_OWNER });
  }
}

seed();
