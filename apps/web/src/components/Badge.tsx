import type { Difficulty, Suitability, WaterNeed } from '@yerlab/types';
import { useI18n } from '../i18n';

export function DifficultyBadge({ value }: { value: Difficulty }) {
  const { t } = useI18n();
  return <span className={`badge badge-${value}`}>{t(`level.${value}`)}</span>;
}

export function WaterBadge({ value }: { value: WaterNeed }) {
  const { t } = useI18n();
  return <span className="badge badge-neutral">💧 {t(`level.${value}`)}</span>;
}

export function SuitabilityBadge({ value }: { value: Suitability }) {
  const { t } = useI18n();
  const cls = value === 'high' ? 'badge-easy' : value === 'low' ? 'badge-hard' : 'badge-medium';
  return <span className={`badge ${cls}`}>★ {t(`level.${value}`)}</span>;
}
