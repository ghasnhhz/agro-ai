import type {
  CalculateRequest,
  CalculateResponse,
  Crop,
  CropResult,
  Locale,
  Suitability,
  WaterLevel,
} from '@yerlab/types';
import { getCrops, getSuitability } from '../store/reference.js';

const SOTKA_PER_UNIT: Record<string, number> = {
  sotka: 1,
  hectare: 100,
  m2: 0.01,
};

const WATER_TIER: Record<WaterLevel, number> = {
  none: 0,
  rain: 1,
  limited: 2,
  reliable: 3,
};

// Suitability nudges expected yield up/down for the chosen region.
const YIELD_FACTOR: Record<Suitability, number> = { high: 1.1, medium: 1.0, low: 0.85 };
const SUIT_SCORE: Record<Suitability, number> = { high: 3, medium: 2, low: 1 };
const EASE_SCORE: Record<Crop['difficulty'], number> = { easy: 3, medium: 2, hard: 1 };

function cropName(crop: Crop, locale: Locale): string {
  return locale === 'ru' ? crop.name_ru : locale === 'en' ? crop.name_en : crop.name_uz;
}
function cropNotes(crop: Crop, locale: Locale): string {
  return locale === 'ru' ? crop.notes_ru : crop.notes_uz;
}

function roundTo(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function calculateProfitability(input: CalculateRequest): CalculateResponse {
  const locale: Locale = input.locale ?? 'uz';
  const sizeSotka = input.size * (SOTKA_PER_UNIT[input.sizeUnit] ?? 1);
  const tier = WATER_TIER[input.waterLevel];

  const eligible = getCrops().filter((c) => c.min_water_level <= tier);

  const results: (CropResult & { _score: number })[] = eligible.map((crop) => {
    const suitability = getSuitability(crop.id, input.regionId);
    const yieldKg = crop.yield_kg_per_sotka * sizeSotka * YIELD_FACTOR[suitability];
    const investment = crop.investment_per_sotka_uzs * sizeSotka;
    const revenue = yieldKg * crop.price_per_kg_uzs;
    const profit = revenue - investment;
    const avgDays = (crop.harvest_days_min + crop.harvest_days_max) / 2;

    // Ranking score depends on the user's goal.
    let score: number;
    if (input.goal === 'profit') {
      // Net revenue, with non-commercial crops deprioritised.
      score = profit * (crop.good_for_profit ? 1 : 0.5);
    } else {
      // Easy, fast, well-suited, home-friendly crops first.
      const speedBonus = Math.max(0, (300 - avgDays) / 100); // 0..~2.75
      score =
        EASE_SCORE[crop.difficulty] * 2 +
        SUIT_SCORE[suitability] * 2 +
        speedBonus +
        (crop.good_for_consumption ? 2 : 0);
    }

    return {
      cropId: crop.id,
      name: cropName(crop, locale),
      difficulty: crop.difficulty,
      waterNeed: crop.water_need,
      suitability,
      harvestPeriod: `${crop.harvest_days_min}–${crop.harvest_days_max}`,
      harvestDaysMin: crop.harvest_days_min,
      harvestDaysMax: crop.harvest_days_max,
      investmentUzs: roundTo(investment, 1000),
      expectedYieldKg: Math.round(yieldKg * 10) / 10,
      expectedRevenueUzs: roundTo(revenue, 1000),
      expectedProfitUzs: roundTo(profit, 1000),
      pricePerKgUzs: crop.price_per_kg_uzs,
      notes: cropNotes(crop, locale),
      _score: score,
    };
  });

  results.sort((a, b) => b._score - a._score);

  const basis: Record<Locale, string> = {
    uz: '1 sotka = 100 m². Raqamlar mahalliy o‘rtacha narx va hosildorlikka asoslangan taxminlar.',
    ru: '1 сотка = 100 м². Цифры — оценки на основе средних местных цен и урожайности.',
    en: '1 sotka = 100 m². Figures are estimates based on average local prices and yields.',
  };
  const disclaimer: Record<Locale, string> = {
    uz: 'Bu faqat taxminiy hisob-kitob. Haqiqiy natija ob-havo, parvarish va bozorga bog‘liq.',
    ru: 'Это лишь приблизительный расчёт. Реальный результат зависит от погоды, ухода и рынка.',
    en: 'These are estimates only. Real results depend on weather, care, and the market.',
  };

  return {
    results: results.map(({ _score, ...r }) => {
      void _score;
      return r;
    }),
    assumptions: {
      sizeSotka: Math.round(sizeSotka * 100) / 100,
      currency: 'UZS',
      basis: basis[locale],
      disclaimer: disclaimer[locale],
    },
  };
}
