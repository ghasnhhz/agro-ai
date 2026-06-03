import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useCalculator } from '../../features/calculator/context';
import { DifficultyBadge, SuitabilityBadge, WaterBadge } from '../../components/Badge';
import { EmptyState } from '../../components/states';
import { formatUzs } from '../../lib/format';
import { hapticImpact } from '../../lib/telegram';

export default function CalculatorResults() {
  useBackButton('/calculator');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { input, response } = useCalculator();

  // If the user deep-links here without results, send them to the form.
  useEffect(() => {
    if (!response) navigate('/calculator', { replace: true });
  }, [response, navigate]);
  if (!response) return null;

  const isProfit = input.goal === 'profit';

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{t('calc.results.title')}</h1>
        <p className="muted" style={{ margin: '4px 0 0' }}>
          {response.assumptions.basis}
        </p>
      </header>

      {response.results.length === 0 ? (
        <EmptyState
          emoji="🏜️"
          title={t('calc.results.empty.title')}
          hint={t('calc.results.empty.hint')}
        />
      ) : (
        <div className="feature-grid">
          {response.results.map((c) => (
            <button
              key={c.cropId}
              className="card crop-card"
              onClick={() => {
                hapticImpact('light');
                navigate(`/calculator/crop/${c.cropId}`);
              }}
            >
              <div className="crop-card-head">
                <span className="crop-name">{c.name}</span>
                <span className="crop-harvest muted">
                  {c.harvestPeriod} {t('calc.days')}
                </span>
              </div>
              <div className="crop-badges">
                <DifficultyBadge value={c.difficulty} />
                <WaterBadge value={c.waterNeed} />
                <SuitabilityBadge value={c.suitability} />
              </div>
              <div className="crop-money">
                {isProfit ? (
                  <>
                    <span className="muted">{t('calc.profit')}</span>
                    <strong className={c.expectedProfitUzs >= 0 ? 'pos' : 'neg'}>
                      {formatUzs(c.expectedProfitUzs, locale)}
                    </strong>
                  </>
                ) : (
                  <>
                    <span className="muted">{t('calc.yield')}</span>
                    <strong>
                      {c.expectedYieldKg} {locale === 'ru' ? 'кг' : 'kg'}
                    </strong>
                  </>
                )}
              </div>
            </button>
          ))}
        </div>
      )}

      <p className="disclaimer">{t('calc.estimate.disclaimer')}</p>
    </div>
  );
}
