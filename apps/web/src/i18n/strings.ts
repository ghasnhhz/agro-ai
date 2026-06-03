import type { Locale } from '@yerlab/types';

export const LOCALES: Locale[] = ['uz', 'ru', 'en'];

export const LOCALE_LABELS: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: 'Русский',
  en: 'English',
};

type Entry = Record<Locale, string>;

// User-facing strings. Uzbek is the primary locale; Russian and English follow.
export const strings: Record<string, Entry> = {
  'app.tagline': {
    uz: "Yeringizdan ko'proq foyda oling",
    ru: 'Получите больше пользы от своей земли',
    en: 'Get more value from your land',
  },
  'common.loading': { uz: 'Yuklanmoqda…', ru: 'Загрузка…', en: 'Loading…' },
  'common.retry': { uz: 'Qayta urinish', ru: 'Повторить', en: 'Retry' },
  'common.back': { uz: 'Orqaga', ru: 'Назад', en: 'Back' },
  'common.error': {
    uz: 'Xatolik yuz berdi',
    ru: 'Произошла ошибка',
    en: 'Something went wrong',
  },
  'common.language': { uz: 'Til', ru: 'Язык', en: 'Language' },

  'home.title': { uz: 'YerLab', ru: 'YerLab', en: 'YerLab' },
  'home.greeting': { uz: 'Salom', ru: 'Привет', en: 'Hi' },
  'home.calculator.title': {
    uz: 'Foydalilik kalkulyatori',
    ru: 'Калькулятор выгоды',
    en: 'Profitability Calculator',
  },
  'home.calculator.desc': {
    uz: 'Nima ekish foydali — hisoblang',
    ru: 'Узнайте, что выгодно посадить',
    en: 'See what is worth growing',
  },
  'home.diagnose.title': {
    uz: 'Kasallikni aniqlash',
    ru: 'Диагностика болезней',
    en: 'Disease Detection',
  },
  'home.diagnose.desc': {
    uz: "Rasmdan o'simlik kasalligini aniqlang",
    ru: 'Определите болезнь растения по фото',
    en: 'Diagnose a plant from a photo',
  },
  'home.market.title': {
    uz: 'Yer bozori',
    ru: 'Земельная биржа',
    en: 'Land Marketplace',
  },
  'home.market.desc': {
    uz: "Bo'sh yerni ijaraga bering yoki toping",
    ru: 'Сдайте или найдите свободную землю',
    en: 'Rent out or find idle land',
  },
  'home.devBadge': {
    uz: 'Demo rejimi',
    ru: 'Демо-режим',
    en: 'Demo mode',
  },
};
