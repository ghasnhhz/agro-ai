import { useEffect, useState } from 'react';
import type { Region } from '@yerlab/types';
import { api } from './api';

// Module-level cache so the reference list is fetched once per session.
let cache: Region[] | null = null;

export function useRegions() {
  const [regions, setRegions] = useState<Region[]>(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    let cancelled = false;
    api
      .get<Region[]>('/regions')
      .then((data) => {
        cache = data;
        if (!cancelled) setRegions(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'error');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { regions, loading, error };
}

export function regionName(region: Region, locale: string): string {
  return locale === 'ru' ? region.name_ru : locale === 'en' ? region.name_en : region.name_uz;
}
