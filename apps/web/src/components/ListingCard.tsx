import type { Listing } from '@yerlab/types';
import { useI18n } from '../i18n';
import { regionName, useRegions } from '../lib/useRegions';

export function ListingCard({ listing, onClick }: { listing: Listing; onClick: () => void }) {
  const { t, locale } = useI18n();
  const { regions } = useRegions();
  const region = regions.find((r) => r.id === listing.regionId);
  const cover = listing.photos[0]?.url;

  return (
    <button className="card listing-card" onClick={onClick}>
      <div className="listing-cover">
        {cover ? <img src={cover} alt="" /> : <span className="listing-cover-ph">🌳</span>}
        {listing.status === 'closed' && (
          <span className="listing-status-pill">{t('mk.status.closed')}</span>
        )}
      </div>
      <div className="listing-body">
        <span className="listing-title">{listing.title}</span>
        <span className="muted listing-loc">
          📍 {region ? regionName(region, locale) : ''}
          {listing.locationText ? `, ${listing.locationText}` : ''}
        </span>
        <div className="listing-meta">
          <span className="badge badge-neutral">
            {listing.sizeSotka} {t('mk.sotka')}
          </span>
          <span className="badge badge-neutral">💧 {t(`calc.water.${listing.waterAvailability}`)}</span>
        </div>
        {listing.rentalTerms && <span className="listing-terms">{listing.rentalTerms}</span>}
      </div>
    </button>
  );
}
