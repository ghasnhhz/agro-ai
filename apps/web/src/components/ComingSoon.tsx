import { useI18n } from '../i18n';
import { useBackButton } from '../lib/useBackButton';

export function ComingSoon({ title }: { title: string }) {
  useBackButton('/');
  const { t } = useI18n();
  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{title}</h1>
      </header>
      <div className="center-state">
        <div className="state-emoji">🚧</div>
        <p className="muted">{t('common.loading')}</p>
      </div>
    </div>
  );
}
