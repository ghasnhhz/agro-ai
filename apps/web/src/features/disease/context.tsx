import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DiseaseResult } from '@yerlab/types';
import { api } from '../../lib/api';
import { compressImage, ImageError } from '../../lib/image';
import { useI18n } from '../../i18n';

interface DiseaseState {
  previewUrl: string | null;
  result: DiseaseResult | null;
  loading: boolean;
  error: string | null;
  analyze: (file: File) => Promise<'ok' | 'error'>;
  reset: () => void;
}

const Ctx = createContext<DiseaseState | null>(null);

export function DiseaseProvider({ children }: { children: ReactNode }) {
  const { t, locale } = useI18n();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (file: File): Promise<'ok' | 'error'> => {
      setError(null);
      setLoading(true);
      try {
        const img = await compressImage(file);
        setPreviewUrl(img.previewUrl);
        const res = await api.post<DiseaseResult>('/disease/analyze', {
          imageBase64: img.base64,
          mediaType: img.mediaType,
          locale,
        });
        setResult(res);
        return 'ok';
      } catch (e) {
        if (e instanceof ImageError) {
          setError(e.message === 'too-large' ? t('dx.err.large') : t('dx.err.type'));
        } else {
          setError(e instanceof Error ? e.message : t('common.error'));
        }
        return 'error';
      } finally {
        setLoading(false);
      }
    },
    [locale, t],
  );

  const reset = useCallback(() => {
    setPreviewUrl(null);
    setResult(null);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({ previewUrl, result, loading, error, analyze, reset }),
    [previewUrl, result, loading, error, analyze, reset],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useDisease(): DiseaseState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useDisease must be used within DiseaseProvider');
  return ctx;
}
