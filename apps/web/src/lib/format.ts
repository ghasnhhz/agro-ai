import type { Locale } from '@yerlab/types';

const CURRENCY_LABEL: Record<Locale, string> = {
  uz: "so'm",
  ru: 'сум',
  en: 'UZS',
};

/** Group digits with spaces, e.g. 1 200 000. */
function groupDigits(value: number): string {
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function formatUzs(value: number, locale: Locale): string {
  return groupDigits(value) + ' ' + CURRENCY_LABEL[locale];
}

export function formatKg(value: number, locale: Locale): string {
  const unit = locale === 'ru' ? 'кг' : 'kg';
  const n = Math.round(value * 10) / 10;
  return groupDigits(n) + ' ' + unit;
}
