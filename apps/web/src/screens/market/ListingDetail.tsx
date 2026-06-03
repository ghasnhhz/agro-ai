import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { Listing } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { regionName, useRegions } from '../../lib/useRegions';
import {
  deleteListing,
  fetchListing,
  updateListing,
} from '../../features/marketplace/api';
import { ErrorState, Loading } from '../../components/states';
import { hapticImpact, openTelegramLink } from '../../lib/telegram';

export default function ListingDetail() {
  useBackButton('/market');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { id } = useParams();
  const { regions } = useRegions();

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setListing(await fetchListing(id));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div className="screen"><Loading /></div>;
  if (error || !listing)
    return <div className="screen"><ErrorState message={error ?? undefined} onRetry={load} /></div>;

  const region = regions.find((r) => r.id === listing.regionId);

  const contact = () => {
    hapticImpact('medium');
    openTelegramLink(`https://t.me/${listing.contactTelegram.replace(/^@/, '')}`);
  };

  const toggleStatus = async () => {
    setBusy(true);
    try {
      const updated = await updateListing(listing.id, {
        status: listing.status === 'active' ? 'closed' : 'active',
      });
      setListing(updated);
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!confirm(t('mk.delete.confirm'))) return;
    setBusy(true);
    try {
      await deleteListing(listing.id);
      navigate('/market');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="screen">
      {listing.photos.length > 0 && (
        <div className="gallery">
          {listing.photos.map((p) => (
            <img key={p.id} src={p.url} alt="" className="gallery-img" />
          ))}
        </div>
      )}

      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{listing.title}</h1>
        {listing.status === 'closed' && (
          <span className="badge badge-hard">{t('mk.status.closed')}</span>
        )}
      </header>

      <div className="card">
        <div className="row">
          <span className="muted">{t('mk.location')}</span>
          <strong style={{ textAlign: 'right' }}>
            {region ? regionName(region, locale) : ''}
            {listing.locationText ? `, ${listing.locationText}` : ''}
          </strong>
        </div>
        <div className="row">
          <span className="muted">{t('mk.size')}</span>
          <strong>
            {listing.sizeSotka} {t('mk.sotka')}
          </strong>
        </div>
        <div className="row">
          <span className="muted">{t('mk.water')}</span>
          <strong>{t(`calc.water.${listing.waterAvailability}`)}</strong>
        </div>
      </div>

      {listing.rentalTerms && (
        <>
          <div className="section-title">{t('mk.terms')}</div>
          <div className="card">
            <p style={{ margin: 0 }}>{listing.rentalTerms}</p>
          </div>
        </>
      )}

      {listing.isOwner ? (
        <div className="owner-actions">
          <button className="btn btn-secondary" disabled={busy} onClick={() => navigate(`/market/${listing.id}/edit`)}>
            {t('mk.edit')}
          </button>
          <button className="btn btn-secondary" disabled={busy} onClick={toggleStatus}>
            {listing.status === 'active' ? t('mk.close') : t('mk.reopen')}
          </button>
          <button className="btn btn-danger" disabled={busy} onClick={remove}>
            {t('mk.delete')}
          </button>
        </div>
      ) : (
        <button className="btn btn-primary" style={{ marginTop: 16 }} onClick={contact}>
          💬 {t('mk.contact')}
        </button>
      )}
    </div>
  );
}
