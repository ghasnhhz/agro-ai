import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useDisease } from '../../features/disease/context';
import { hapticImpact } from '../../lib/telegram';

export default function DiagnoseUpload() {
  useBackButton('/');
  const { t } = useI18n();
  const navigate = useNavigate();
  const { analyze, previewUrl, error, loading } = useDisease();
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    hapticImpact('medium');
    navigate('/diagnose/result');
    await analyze(file);
  };

  const TIPS = ['dx.upload.tip1', 'dx.upload.tip2', 'dx.upload.tip3'];

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>🔬 {t('dx.title')}</h1>
      </header>

      <button
        className="upload-zone"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="" className="upload-preview" />
        ) : (
          <>
            <span className="upload-emoji">📷</span>
            <span className="upload-cta">{t('dx.upload.cta')}</span>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => onFile(e.target.files?.[0])}
      />

      {error && <p className="disclaimer" style={{ borderColor: '#c0392b55', background: '#c0392b14' }}>{error}</p>}

      <div className="section-title">{t('dx.upload.tips.title')}</div>
      <div className="card">
        {TIPS.map((tip, i) => (
          <div key={tip} className="tip-row">
            <span className="tip-num">{i + 1}</span>
            <span>{t(tip)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
