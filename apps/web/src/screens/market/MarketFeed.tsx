import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Listing, WaterLevel } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { useRegions, regionName } from '../../lib/useRegions';
import { fetchListings, type FeedFilters } from '../../features/marketplace/api';
import { ListingCard } from '../../components/ListingCard';
import { EmptyState, ErrorState, Loading } from '../../components/states';
import { hapticImpact } from '../../lib/telegram';

const WATER: WaterLevel[] = ['none', 'rain', 'limited', 'reliable'];

export default function MarketFeed() {
  useBackButton('/');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { regions } = useRegions();

  const [filters, setFilters] = useState<FeedFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (f: FeedFilters) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchListings(f);
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(filters);
  }, [filters, load]);

  return (
    <div className="screen">
      <header className="hub-header">
        <div className="hub-top">
          <h1 style={{ fontSize: 22 }}>🤝 {t('mk.title')}</h1>
          <button className="btn-link" onClick={() => navigate('/market/mine')}>
            {t('mk.mine')}
          </button>
        </div>
      </header>

      <div className="market-actions">
        <button
          className="btn btn-primary"
          onClick={() => {
            hapticImpact('medium');
            navigate('/market/new');
          }}
        >
          + {t('mk.new')}
        </button>
        <button className="btn btn-secondary filter-btn" onClick={() => setShowFilters((v) => !v)}>
          ⚙ {t('mk.filters')}
        </button>
      </div>

      {showFilters && (
        <FilterPanel
          regions={regions}
          locale={locale}
          initial={filters}
          onApply={(f) => {
            setFilters(f);
            setShowFilters(false);
          }}
          onClear={() => {
            setFilters({});
            setShowFilters(false);
          }}
        />
      )}

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={() => load(filters)} />
      ) : items.length === 0 ? (
        <EmptyState emoji="🌾" title={t('mk.feed.empty.title')} hint={t('mk.feed.empty.hint')} />
      ) : (
        <div className="feature-grid">
          {items.map((l) => (
            <ListingCard key={l.id} listing={l} onClick={() => navigate(`/market/${l.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  regions,
  locale,
  initial,
  onApply,
  onClear,
}: {
  regions: ReturnType<typeof useRegions>['regions'];
  locale: string;
  initial: FeedFilters;
  onApply: (f: FeedFilters) => void;
  onClear: () => void;
}) {
  const { t } = useI18n();
  const [region, setRegion] = useState(initial.region ?? '');
  const [water, setWater] = useState<WaterLevel | ''>(initial.water ?? '');
  const [minSize, setMinSize] = useState(initial.minSize?.toString() ?? '');
  const [maxSize, setMaxSize] = useState(initial.maxSize?.toString() ?? '');

  return (
    <div className="card filter-panel">
      <div className="field">
        <select className="select" value={region} onChange={(e) => setRegion(e.target.value)}>
          <option value="">{t('mk.filter.allRegions')}</option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {regionName(r, locale)}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <select className="select" value={water} onChange={(e) => setWater(e.target.value as WaterLevel | '')}>
          <option value="">{t('mk.filter.anyWater')}</option>
          {WATER.map((w) => (
            <option key={w} value={w}>
              {t(`calc.water.${w}`)}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-sizes">
        <input
          className="input"
          type="number"
          inputMode="decimal"
          placeholder={t('mk.filter.minSize')}
          value={minSize}
          onChange={(e) => setMinSize(e.target.value)}
        />
        <input
          className="input"
          type="number"
          inputMode="decimal"
          placeholder={t('mk.filter.maxSize')}
          value={maxSize}
          onChange={(e) => setMaxSize(e.target.value)}
        />
      </div>
      <div className="market-actions" style={{ marginTop: 4 }}>
        <button
          className="btn btn-primary"
          onClick={() =>
            onApply({
              region: region ? Number(region) : undefined,
              water: water || undefined,
              minSize: minSize ? Number(minSize) : undefined,
              maxSize: maxSize ? Number(maxSize) : undefined,
            })
          }
        >
          {t('mk.filter.apply')}
        </button>
        <button className="btn btn-secondary" onClick={onClear}>
          {t('mk.filter.clear')}
        </button>
      </div>
    </div>
  );
}
