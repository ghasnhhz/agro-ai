import type { Region } from '@yerlab/types';

// Uzbekistan: 12 provinces + Karakalpakstan + Tashkent city.
export const regions: Region[] = [
  { id: 1, name_uz: 'Andijon', name_ru: 'Андижан', name_en: 'Andijan' },
  { id: 2, name_uz: 'Buxoro', name_ru: 'Бухара', name_en: 'Bukhara' },
  { id: 3, name_uz: "Farg'ona", name_ru: 'Фергана', name_en: 'Fergana' },
  { id: 4, name_uz: 'Jizzax', name_ru: 'Джизак', name_en: 'Jizzakh' },
  { id: 5, name_uz: 'Xorazm', name_ru: 'Хорезм', name_en: 'Khorezm' },
  { id: 6, name_uz: 'Namangan', name_ru: 'Наманган', name_en: 'Namangan' },
  { id: 7, name_uz: 'Navoiy', name_ru: 'Навои', name_en: 'Navoi' },
  { id: 8, name_uz: 'Qashqadaryo', name_ru: 'Кашкадарья', name_en: 'Kashkadarya' },
  {
    id: 9,
    name_uz: "Qoraqalpog'iston",
    name_ru: 'Каракалпакстан',
    name_en: 'Karakalpakstan',
  },
  { id: 10, name_uz: 'Samarqand', name_ru: 'Самарканд', name_en: 'Samarkand' },
  { id: 11, name_uz: 'Sirdaryo', name_ru: 'Сырдарья', name_en: 'Syrdarya' },
  { id: 12, name_uz: 'Surxondaryo', name_ru: 'Сурхандарья', name_en: 'Surkhandarya' },
  { id: 13, name_uz: 'Toshkent viloyati', name_ru: 'Ташкентская область', name_en: 'Tashkent Region' },
  { id: 14, name_uz: 'Toshkent shahri', name_ru: 'город Ташкент', name_en: 'Tashkent City' },
];
