import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useCalculator } from '../../features/calculator/context';
import { DifficultyBadge, SuitabilityBadge, WaterBadge } from '../../components/Badge';
import { formatKg, formatUzs } from '../../lib/format';

export default function CropDetail() {
  useBackButton('/calculator/results');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams();
  const { getCrop } = useCalculator();
  const crop = id ? getCrop(Number(id)) : undefined;

  useEffect(() => {
    if (!crop) navigate('/calculator/results', { replace: true });
  }, [crop, navigate]);
  if (!crop) return null;

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 24 }}>{crop.name}</h1>
        <div className="crop-badges" style={{ marginTop: 8 }}>
          <DifficultyBadge value={crop.difficulty} />
          <WaterBadge value={crop.waterNeed} />
          <SuitabilityBadge value={crop.suitability} />
        </div>
      </header>

      <div className="card">
        <div className="row">
          <span className="muted">{t('calc.invest')}</span>
          <strong>{formatUzs(crop.investmentUzs, locale)}</strong>
        </div>
        <div className="row">
          <span className="muted">{t('calc.yield')}</span>
          <strong>{formatKg(crop.expectedYieldKg, locale)}</strong>
        </div>
        <div className="row">
          <span className="muted">{t('calc.price')}</span>
          <strong>{formatUzs(crop.pricePerKgUzs, locale)}</strong>
        </div>
        <div className="row">
          <span className="muted">{t('calc.revenue')}</span>
          <strong>{formatUzs(crop.expectedRevenueUzs, locale)}</strong>
        </div>
        <div className="row">
          <span className="muted">{t('calc.profit')}</span>
          <strong className={crop.expectedProfitUzs >= 0 ? 'pos' : 'neg'}>
            {formatUzs(crop.expectedProfitUzs, locale)}
          </strong>
        </div>
        <div className="row">
          <span className="muted">{t('calc.harvest')}</span>
          <strong>
            {crop.harvestPeriod} {t('calc.days')}
          </strong>
        </div>
      </div>

      {crop.notes && (
        <>
          <div className="section-title">{t('calc.notes')}</div>
          <div className="card">
            <p style={{ margin: 0 }}>{crop.notes}</p>
          </div>
        </>
      )}

      <p className="disclaimer">{t('calc.estimate.disclaimer')}</p>
    </div>
  );
}
