import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Listing } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { fetchListings } from '../../features/marketplace/api';
import { ListingCard } from '../../components/ListingCard';
import { EmptyState, ErrorState, Loading } from '../../components/states';

export default function MyListings() {
  useBackButton('/market');
  const { t } = useI18n();
  const navigate = useNavigate();
  const [items, setItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchListings({ mine: true });
      setItems(res.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{t('mk.mine')}</h1>
      </header>

      <button className="btn btn-primary" onClick={() => navigate('/market/new')}>
        + {t('mk.new')}
      </button>

      <div style={{ height: 12 }} />

      {loading ? (
        <Loading />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : items.length === 0 ? (
        <EmptyState emoji="📭" title={t('mk.mine.empty')} hint={t('mk.feed.empty.hint')} />
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
