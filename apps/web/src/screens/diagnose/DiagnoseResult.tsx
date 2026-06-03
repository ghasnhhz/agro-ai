import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ConfidenceBand } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useDisease } from '../../features/disease/context';
import { Loading } from '../../components/states';

const CONFIDENCE_CLASS: Record<ConfidenceBand, string> = {
  low: 'badge-hard',
  medium: 'badge-medium',
  high: 'badge-easy',
};

export default function DiagnoseResult() {
  useBackButton('/diagnose');
  const { t } = useI18n();
  const navigate = useNavigate();
  const { result, loading, error, previewUrl, reset } = useDisease();

  // No active analysis and no result -> go back to upload.
  useEffect(() => {
    if (!loading && !result && !error) navigate('/diagnose', { replace: true });
  }, [loading, result, error, navigate]);

  if (loading) {
    return (
      <div className="screen">
        {previewUrl && (
          <img src={previewUrl} alt="" className="upload-preview" style={{ marginTop: 16 }} />
        )}
        <Loading label={t('dx.loading')} />
        <p className="muted" style={{ textAlign: 'center' }}>
          {t('dx.loading.hint')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="screen">
        <div className="center-state">
          <div className="state-emoji">😕</div>
          <p>{error}</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              reset();
              navigate('/diagnose');
            }}
          >
            {t('dx.change')}
          </button>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{t('dx.result.title')}</h1>
      </header>

      {previewUrl && <img src={previewUrl} alt="" className="upload-preview" />}

      {result.fallback && <p className="disclaimer">{t('dx.fallback.note')}</p>}

      <div className="card" style={{ marginTop: 14 }}>
        <div className="dx-primary-head">
          <span className="badge badge-neutral">{t(`dx.type.${result.primary.type}`)}</span>
          <span className={`badge ${CONFIDENCE_CLASS[result.confidence]}`}>
            {t('dx.confidence')}: {t(`level.${result.confidence}`)}
          </span>
        </div>
        <h2 className="dx-name">{result.primary.name}</h2>
        <p className="muted" style={{ margin: 0 }}>
          <strong style={{ color: 'var(--text)' }}>{t('dx.cause')}:</strong>{' '}
          {result.primary.probableCause}
        </p>
      </div>

      {result.alternatives.length > 0 && (
        <>
          <div className="section-title">{t('dx.alternatives')}</div>
          <div className="card">
            {result.alternatives.map((a, i) => (
              <div key={i} className="row">
                <span>{a.name}</span>
                <span className="badge badge-neutral">{t(`dx.type.${a.type}`)}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {result.treatment.category && (
        <>
          <div className="section-title">{t('dx.treatment')}</div>
          <div className="card">
            <p style={{ margin: '0 0 10px', fontWeight: 600 }}>{result.treatment.category}</p>
            {result.treatment.guidance && (
              <p style={{ margin: '0 0 10px' }}>{result.treatment.guidance}</p>
            )}
            {result.treatment.prevention && (
              <p className="muted" style={{ margin: 0 }}>
                <strong style={{ color: 'var(--text)' }}>{t('dx.prevention')}:</strong>{' '}
                {result.treatment.prevention}
              </p>
            )}
          </div>
        </>
      )}

      <p className="disclaimer">⚠️ {result.disclaimer}</p>

      <button
        className="btn btn-primary"
        style={{ marginTop: 16 }}
        onClick={() => {
          reset();
          navigate('/diagnose');
        }}
      >
        {t('dx.again')}
      </button>
    </div>
  );
}
