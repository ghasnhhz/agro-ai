import { useNavigate } from 'react-router-dom';
import type { Goal, SizeUnit, WaterLevel } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useRegions, regionName } from '../../lib/useRegions';
import { useCalculator } from '../../features/calculator/context';
import { ErrorState } from '../../components/states';
import { hapticImpact } from '../../lib/telegram';

const UNITS: SizeUnit[] = ['sotka', 'hectare', 'm2'];
const WATER: WaterLevel[] = ['none', 'rain', 'limited', 'reliable'];
const GOALS: Goal[] = ['consumption', 'profit'];

export default function CalculatorInput() {
  useBackButton('/');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { regions, error: regionsError } = useRegions();
  const { input, setInput, calculate, loading, error } = useCalculator();

  const canSubmit =
    input.regionId != null && input.waterLevel != null && Number(input.size) > 0;

  const onSubmit = async () => {
    hapticImpact('medium');
    const ok = await calculate();
    if (ok) navigate('/calculator/results');
  };

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>🌾 {t('calc.title')}</h1>
      </header>

      <div className="field">
        <label htmlFor="region">{t('calc.region')}</label>
        <select
          id="region"
          className="select"
          value={input.regionId ?? ''}
          onChange={(e) => setInput({ regionId: Number(e.target.value) })}
        >
          <option value="" disabled>
            {t('calc.region.placeholder')}
          </option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {regionName(r, locale)}
            </option>
          ))}
        </select>
        {regionsError && <ErrorState message={regionsError} />}
      </div>

      <div className="field">
        <label htmlFor="size">{t('calc.size')}</label>
        <input
          id="size"
          className="input"
          type="number"
          inputMode="decimal"
          min={0}
          placeholder="0"
          value={input.size}
          onChange={(e) => setInput({ size: e.target.value })}
          style={{ marginBottom: 8 }}
        />
        <div className="option-row">
          {UNITS.map((u) => (
            <button
              key={u}
              className={`option-chip ${input.sizeUnit === u ? 'active' : ''}`}
              onClick={() => setInput({ sizeUnit: u })}
            >
              {t(`calc.unit.${u}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{t('calc.water')}</label>
        <div className="option-row">
          {WATER.map((w) => (
            <button
              key={w}
              className={`option-chip ${input.waterLevel === w ? 'active' : ''}`}
              onClick={() => setInput({ waterLevel: w })}
            >
              {t(`calc.water.${w}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{t('calc.goal')}</label>
        <div className="option-row">
          {GOALS.map((g) => (
            <button
              key={g}
              className={`option-chip ${input.goal === g ? 'active' : ''}`}
              onClick={() => setInput({ goal: g })}
            >
              {t(`calc.goal.${g}`)}
            </button>
          ))}
        </div>
      </div>

      {error && <ErrorState message={error} />}

      <button className="btn btn-primary" disabled={!canSubmit || loading} onClick={onSubmit}>
        {loading ? t('common.loading') : t('calc.submit')}
      </button>
    </div>
  );
}
