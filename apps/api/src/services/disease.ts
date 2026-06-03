import type {
  ConfidenceBand,
  DiseaseAlternative,
  DiseaseResult,
  DiseaseType,
  Locale,
} from '@yerlab/types';
import { AI_ENABLED } from '../config.js';
import { analyzeImageWithClaude } from '../lib/claude.js';

const DISCLAIMER: Record<Locale, string> = {
  uz: "Bu sun'iy intellekt fikri — agronom o'rnini bosmaydi. Har qanday kimyoviy vositani qo'llashdan oldin mutaxassis bilan tekshiring va yorliq hamda mahalliy qoidalarga amal qiling.",
  ru: 'Это мнение ИИ, а не замена профессионального агронома. Перед применением любого средства проверьте у специалиста и следуйте инструкции и местным правилам.',
  en: 'This is an AI second opinion, not a substitute for a professional agronomist. Verify before applying any chemical and follow the product label and local regulations.',
};

const UNCLEAR_NAME: Record<Locale, string> = {
  uz: "Rasm noaniq",
  ru: 'Изображение неясное',
  en: 'Image unclear',
};
const UNCLEAR_CAUSE: Record<Locale, string> = {
  uz: "Rasmni aniq tahlil qilib bo'lmadi. Kasallangan bargni yorug'da, kadrni to'ldirib qayta suratga oling.",
  ru: 'Не удалось чётко проанализировать фото. Сфотографируйте поражённый лист при хорошем свете, заполнив кадр.',
  en: 'The photo could not be analyzed clearly. Re-take it in good light, filling the frame with the affected leaf.',
};

const VALID_TYPES: DiseaseType[] = ['disease', 'pest', 'damage', 'deficiency', 'unknown'];

function normalizeType(value: unknown): DiseaseType {
  const v = String(value ?? '').toLowerCase();
  return (VALID_TYPES as string[]).includes(v) ? (v as DiseaseType) : 'unknown';
}

function normalizeConfidence(value: unknown): ConfidenceBand {
  const v = String(value ?? '').toLowerCase();
  if (v.includes('high')) return 'high';
  if (v.includes('med')) return 'medium';
  return 'low';
}

function extractJson(text: string): Record<string, unknown> | null {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end < start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function str(value: unknown, fallback = ''): string {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

/** A safe, structured fallback used when the AI is disabled or fails. */
export function fallbackResult(locale: Locale): DiseaseResult {
  const cause: Record<Locale, string> = {
    uz: "Avtomatik tahlil hozir mavjud emas. Iltimos, keyinroq qayta urinib ko'ring yoki mahalliy agronomga murojaat qiling.",
    ru: 'Автоматический анализ сейчас недоступен. Попробуйте позже или обратитесь к местному агроному.',
    en: 'Automatic analysis is unavailable right now. Please try again later or consult a local agronomist.',
  };
  const category: Record<Locale, string> = {
    uz: "Aniq tashxisdan oldin kimyoviy vosita ishlatmang; avval mutaxassisga ko'rsating.",
    ru: 'Не применяйте химию до точного диагноза; сначала покажите специалисту.',
    en: 'Do not apply chemicals before a clear diagnosis; show it to a specialist first.',
  };
  const prevention: Record<Locale, string> = {
    uz: "Sog'lom urug', to'g'ri sug'orish va navbatma-navbat ekish kasalliklarni kamaytiradi.",
    ru: 'Здоровые семена, правильный полив и севооборот снижают болезни.',
    en: 'Healthy seed, correct watering, and crop rotation reduce disease.',
  };
  return {
    primary: { type: 'unknown', name: UNCLEAR_NAME[locale], probableCause: cause[locale] },
    confidence: 'low',
    alternatives: [],
    treatment: { category: category[locale], guidance: cause[locale], prevention: prevention[locale] },
    disclaimer: DISCLAIMER[locale],
    fallback: true,
  };
}

/** Run disease analysis on an image, enforcing the safety contract on the output. */
export async function analyzeDisease(
  imageBase64: string,
  mediaType: string,
  locale: Locale,
): Promise<DiseaseResult> {
  if (!AI_ENABLED) return fallbackResult(locale);

  let raw: string;
  try {
    raw = await analyzeImageWithClaude(imageBase64, mediaType, locale);
  } catch (err) {
    console.error('[disease] Claude call failed:', err);
    return fallbackResult(locale);
  }

  const parsed = extractJson(raw);
  if (!parsed) {
    console.error('[disease] could not parse AI JSON:', raw.slice(0, 200));
    return fallbackResult(locale);
  }

  const imageUnclear = parsed.imageUnclear === true;
  const primaryRaw = (parsed.primary ?? {}) as Record<string, unknown>;
  const treatmentRaw = (parsed.treatment ?? {}) as Record<string, unknown>;

  const alternatives: DiseaseAlternative[] = Array.isArray(parsed.alternatives)
    ? (parsed.alternatives as Record<string, unknown>[])
        .slice(0, 2)
        .map((a) => ({ name: str(a.name, '—'), type: normalizeType(a.type) }))
        .filter((a) => a.name !== '—')
    : [];

  // The disclaimer and confidence band are ALWAYS set in code, never trusted to the model.
  return {
    primary: {
      type: imageUnclear ? 'unknown' : normalizeType(primaryRaw.type),
      name: imageUnclear ? UNCLEAR_NAME[locale] : str(primaryRaw.name, UNCLEAR_NAME[locale]),
      probableCause: imageUnclear
        ? UNCLEAR_CAUSE[locale]
        : str(primaryRaw.probableCause, UNCLEAR_CAUSE[locale]),
    },
    confidence: imageUnclear ? 'low' : normalizeConfidence(parsed.confidence),
    alternatives: imageUnclear ? [] : alternatives,
    treatment: {
      category: str(treatmentRaw.category),
      guidance: str(treatmentRaw.guidance),
      prevention: str(treatmentRaw.prevention),
    },
    disclaimer: DISCLAIMER[locale],
    imageUnclear: imageUnclear || undefined,
  };
}
