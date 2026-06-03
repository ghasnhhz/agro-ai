import { useI18n } from '../i18n';

export function Loading({ label }: { label?: string }) {
  const { t } = useI18n();
  return (
    <div className="center-state">
      <div className="spinner" aria-hidden />
      <p className="muted">{label ?? t('common.loading')}</p>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <div className="center-state">
      <div className="state-emoji">😕</div>
      <p>{message ?? t('common.error')}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          {t('common.retry')}
        </button>
      )}
    </div>
  );
}

export function EmptyState({ emoji, title, hint }: { emoji: string; title: string; hint?: string }) {
  return (
    <div className="center-state">
      <div className="state-emoji">{emoji}</div>
      <p style={{ fontWeight: 600, margin: 0 }}>{title}</p>
      {hint && <p className="muted">{hint}</p>}
    </div>
  );
}
