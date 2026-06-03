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

  // ---- Calculator ----
  'calc.title': {
    uz: 'Foydalilik kalkulyatori',
    ru: 'Калькулятор выгоды',
    en: 'Profitability Calculator',
  },
  'calc.region': { uz: 'Viloyat', ru: 'Регион', en: 'Region' },
  'calc.region.placeholder': { uz: 'Viloyatni tanlang', ru: 'Выберите регион', en: 'Select a region' },
  'calc.size': { uz: 'Yer maydoni', ru: 'Площадь земли', en: 'Land size' },
  'calc.unit.sotka': { uz: 'sotka', ru: 'сотка', en: 'sotka' },
  'calc.unit.hectare': { uz: 'gektar', ru: 'гектар', en: 'hectare' },
  'calc.unit.m2': { uz: 'm²', ru: 'м²', en: 'm²' },
  'calc.water': { uz: 'Suv ta’minoti', ru: 'Водоснабжение', en: 'Water availability' },
  'calc.water.none': { uz: 'Yo‘q', ru: 'Нет', en: 'None' },
  'calc.water.rain': { uz: 'Yomg‘ir', ru: 'Дождь', en: 'Rain-only' },
  'calc.water.limited': { uz: 'Cheklangan', ru: 'Ограниченное', en: 'Limited' },
  'calc.water.reliable': { uz: 'Yetarli', ru: 'Надёжное', en: 'Reliable' },
  'calc.goal': { uz: 'Maqsad', ru: 'Цель', en: 'Goal' },
  'calc.goal.consumption': { uz: 'Oila uchun', ru: 'Для семьи', en: 'Feed my family' },
  'calc.goal.profit': { uz: 'Maksimal foyda', ru: 'Макс. прибыль', en: 'Maximum profit' },
  'calc.submit': { uz: 'Hisoblash', ru: 'Рассчитать', en: 'Calculate' },
  'calc.results.title': { uz: 'Tavsiya etilgan ekinlar', ru: 'Рекомендуемые культуры', en: 'Recommended crops' },
  'calc.results.empty.title': {
    uz: 'Mos ekin topilmadi',
    ru: 'Подходящих культур нет',
    en: 'No suitable crops',
  },
  'calc.results.empty.hint': {
    uz: 'Suvsiz ekin yetishtirish qiyin. Kamida yomg‘ir suvini tanlab ko‘ring.',
    ru: 'Без воды выращивать трудно. Попробуйте выбрать хотя бы дождевой полив.',
    en: 'Growing without water is hard. Try selecting at least rain-fed water.',
  },
  'calc.days': { uz: 'kun', ru: 'дней', en: 'days' },
  'calc.invest': { uz: 'Sarmoya', ru: 'Вложение', en: 'Investment' },
  'calc.revenue': { uz: 'Daromad', ru: 'Выручка', en: 'Revenue' },
  'calc.profit': { uz: 'Sof foyda', ru: 'Чистая прибыль', en: 'Net profit' },
  'calc.yield': { uz: 'Hosil', ru: 'Урожай', en: 'Yield' },
  'calc.harvest': { uz: 'Yetilish', ru: 'Созревание', en: 'Harvest' },
  'calc.price': { uz: 'Narx (kg)', ru: 'Цена (кг)', en: 'Price (kg)' },
  'calc.difficulty': { uz: 'Murakkablik', ru: 'Сложность', en: 'Difficulty' },
  'calc.water.need': { uz: 'Suv talabi', ru: 'Потребность в воде', en: 'Water need' },
  'calc.suitability': { uz: 'Moslik', ru: 'Пригодность', en: 'Suitability' },
  'calc.notes': { uz: 'Yetishtirish bo‘yicha maslahat', ru: 'Советы по выращиванию', en: 'Growing notes' },
  'calc.estimate.disclaimer': {
    uz: 'Bu taxminiy hisob (UZS). Haqiqiy natija ob-havo, parvarish va bozorga bog‘liq.',
    ru: 'Это оценка (UZS). Реальный результат зависит от погоды, ухода и рынка.',
    en: 'This is an estimate (UZS). Real results depend on weather, care, and the market.',
  },

  // ---- Disease detection ----
  'dx.title': { uz: 'Kasallikni aniqlash', ru: 'Диагностика болезней', en: 'Disease Detection' },
  'dx.upload.cta': { uz: 'Rasm yuklash yoki suratga olish', ru: 'Загрузить или сделать фото', en: 'Upload or take a photo' },
  'dx.upload.tips.title': { uz: 'Yaxshi natija uchun', ru: 'Для лучшего результата', en: 'For the best result' },
  'dx.upload.tip1': {
    uz: "Kasallangan bargni kadr to'ldirib oling",
    ru: 'Заполните кадр поражённым листом',
    en: 'Fill the frame with the affected leaf',
  },
  'dx.upload.tip2': {
    uz: "Yorug', tiniq joyda suratga oling",
    ru: 'Снимайте при хорошем, чётком свете',
    en: 'Shoot in good, sharp light',
  },
  'dx.upload.tip3': {
    uz: 'Bitta o‘simlikka e’tibor qarating',
    ru: 'Сфокусируйтесь на одном растении',
    en: 'Focus on a single plant',
  },
  'dx.analyze': { uz: 'Tahlil qilish', ru: 'Анализировать', en: 'Analyze' },
  'dx.change': { uz: 'Boshqa rasm', ru: 'Другое фото', en: 'Change photo' },
  'dx.loading': { uz: 'Rasm tahlil qilinmoqda…', ru: 'Анализируем фото…', en: 'Analyzing the photo…' },
  'dx.loading.hint': {
    uz: 'Bu bir necha soniya olishi mumkin',
    ru: 'Это может занять несколько секунд',
    en: 'This may take a few seconds',
  },
  'dx.err.type': {
    uz: 'Bu fayl turi qo‘llab-quvvatlanmaydi. JPEG, PNG yoki WebP yuklang.',
    ru: 'Этот тип файла не поддерживается. Загрузите JPEG, PNG или WebP.',
    en: 'That file type is not supported. Use JPEG, PNG, or WebP.',
  },
  'dx.err.large': {
    uz: 'Rasm juda katta. Kichikroq rasm tanlang.',
    ru: 'Изображение слишком большое. Выберите файл поменьше.',
    en: 'The image is too large. Please choose a smaller photo.',
  },
  'dx.result.title': { uz: 'Tahlil natijasi', ru: 'Результат анализа', en: 'Analysis result' },
  'dx.confidence': { uz: 'Ishonch darajasi', ru: 'Уровень уверенности', en: 'Confidence' },
  'dx.alternatives': { uz: 'Boshqa ehtimollar', ru: 'Другие возможности', en: 'Other possibilities' },
  'dx.cause': { uz: 'Ehtimoliy sabab', ru: 'Вероятная причина', en: 'Probable cause' },
  'dx.treatment': { uz: 'Tavsiya etilgan chora (turi)', ru: 'Рекомендуемая мера (категория)', en: 'Recommended treatment (category)' },
  'dx.guidance': { uz: 'Maslahat', ru: 'Рекомендация', en: 'Guidance' },
  'dx.prevention': { uz: 'Oldini olish', ru: 'Профилактика', en: 'Prevention' },
  'dx.again': { uz: 'Yana bir rasm tahlil qilish', ru: 'Проанализировать ещё', en: 'Analyze another photo' },
  'dx.type.disease': { uz: 'Kasallik', ru: 'Болезнь', en: 'Disease' },
  'dx.type.pest': { uz: 'Zararkunanda', ru: 'Вредитель', en: 'Pest' },
  'dx.type.damage': { uz: 'Barg shikasti', ru: 'Повреждение', en: 'Leaf damage' },
  'dx.type.deficiency': { uz: 'Ozuqa yetishmovchiligi', ru: 'Нехватка питания', en: 'Nutrient deficiency' },
  'dx.type.unknown': { uz: 'Noma’lum', ru: 'Неизвестно', en: 'Unknown' },
  'dx.fallback.note': {
    uz: 'Avtomatik tahlil hozir cheklangan — bu umumiy, ehtiyotkor maslahat.',
    ru: 'Автоанализ сейчас ограничен — это общий осторожный совет.',
    en: 'Automatic analysis is limited right now — this is general, cautious advice.',
  },

  // shared value labels
  'level.easy': { uz: 'Oson', ru: 'Лёгкая', en: 'Easy' },
  'level.medium': { uz: 'O‘rtacha', ru: 'Средняя', en: 'Medium' },
  'level.hard': { uz: 'Qiyin', ru: 'Сложная', en: 'Hard' },
  'level.low': { uz: 'Past', ru: 'Низкая', en: 'Low' },
  'level.high': { uz: 'Yuqori', ru: 'Высокая', en: 'High' },
};
