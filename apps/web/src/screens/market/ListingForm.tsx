import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { ListingInput, SizeUnit, WaterLevel } from '@yerlab/types';
import { useI18n } from '../../i18n';
import { useBackButton } from '../../lib/useBackButton';
import { regionName, useRegions } from '../../lib/useRegions';
import {
  createListing,
  fetchListing,
  updateListing,
  uploadImages,
} from '../../features/marketplace/api';
import { compressImageToFile } from '../../lib/image';
import { ErrorState, Loading } from '../../components/states';
import { hapticImpact } from '../../lib/telegram';

const UNITS: SizeUnit[] = ['sotka', 'hectare', 'm2'];
const WATER: WaterLevel[] = ['none', 'rain', 'limited', 'reliable'];

interface PhotoItem {
  url?: string; // existing (already uploaded)
  file?: File; // newly chosen
  preview: string;
}

export default function ListingForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  useBackButton(isEdit ? `/market/${id}` : '/market');
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const { regions } = useRegions();
  const inputRef = useRef<HTMLInputElement>(null);

  const [loadingExisting, setLoadingExisting] = useState(isEdit);
  const [title, setTitle] = useState('');
  const [regionId, setRegionId] = useState<number | ''>('');
  const [locationText, setLocationText] = useState('');
  const [size, setSize] = useState('');
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('sotka');
  const [water, setWater] = useState<WaterLevel | ''>('');
  const [rentalTerms, setRentalTerms] = useState('');
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !id) return;
    fetchListing(id)
      .then((l) => {
        setTitle(l.title);
        setRegionId(l.regionId);
        setLocationText(l.locationText);
        setSize(String(l.sizeSotka));
        setSizeUnit('sotka');
        setWater(l.waterAvailability);
        setRentalTerms(l.rentalTerms);
        setContact(l.contactTelegram);
        setPhotos(l.photos.map((p) => ({ url: p.url, preview: p.url })));
      })
      .catch((e) => setError(e instanceof Error ? e.message : 'error'))
      .finally(() => setLoadingExisting(false));
  }, [isEdit, id]);

  const canSubmit =
    title.trim().length >= 3 && regionId !== '' && Number(size) > 0 && water !== '' && rentalTerms.trim().length >= 2;

  const onPickFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = 5 - photos.length;
    const next = Array.from(files)
      .slice(0, remaining)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setPhotos((p) => [...p, ...next]);
  };

  const removePhoto = (i: number) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const submit = async () => {
    if (!canSubmit) return;
    hapticImpact('medium');
    setSubmitting(true);
    setError(null);
    try {
      // Upload any newly chosen files, preserving existing URLs.
      const newFiles = photos.filter((p) => p.file).map((p) => p.file!);
      let uploadedUrls: string[] = [];
      if (newFiles.length) {
        const compressed = await Promise.all(newFiles.map(compressImageToFile));
        uploadedUrls = await uploadImages(compressed);
      }
      const existingUrls = photos.filter((p) => p.url).map((p) => p.url!);
      const photoUrls = [...existingUrls, ...uploadedUrls].slice(0, 5);

      const payload: ListingInput = {
        title: title.trim(),
        regionId: Number(regionId),
        locationText: locationText.trim(),
        size: Number(size),
        sizeUnit,
        waterAvailability: water as WaterLevel,
        rentalTerms: rentalTerms.trim(),
        contactTelegram: contact.trim() || undefined,
        photoUrls,
      };

      if (isEdit && id) {
        await updateListing(id, payload);
        navigate(`/market/${id}`);
      } else {
        const created = await createListing(payload);
        navigate(`/market/${created.id}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingExisting) return <div className="screen"><Loading /></div>;

  return (
    <div className="screen">
      <header className="hub-header">
        <h1 style={{ fontSize: 22 }}>{isEdit ? t('mk.form.edit') : t('mk.form.new')}</h1>
      </header>

      <div className="field">
        <label>{t('mk.form.titleField')}</label>
        <input className="input" value={title} maxLength={120} placeholder={t('mk.form.titlePh')} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="field">
        <label>{t('mk.form.region')}</label>
        <select className="select" value={regionId} onChange={(e) => setRegionId(Number(e.target.value))}>
          <option value="" disabled>
            {t('calc.region.placeholder')}
          </option>
          {regions.map((r) => (
            <option key={r.id} value={r.id}>
              {regionName(r, locale)}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>{t('mk.location')}</label>
        <input className="input" value={locationText} maxLength={300} placeholder={t('mk.form.locationPh')} onChange={(e) => setLocationText(e.target.value)} />
      </div>

      <div className="field">
        <label>{t('mk.form.size')}</label>
        <input className="input" type="number" inputMode="decimal" min={0} placeholder="0" value={size} onChange={(e) => setSize(e.target.value)} style={{ marginBottom: 8 }} />
        <div className="option-row">
          {UNITS.map((u) => (
            <button key={u} className={`option-chip ${sizeUnit === u ? 'active' : ''}`} onClick={() => setSizeUnit(u)}>
              {t(`calc.unit.${u}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{t('calc.water')}</label>
        <div className="option-row">
          {WATER.map((w) => (
            <button key={w} className={`option-chip ${water === w ? 'active' : ''}`} onClick={() => setWater(w)}>
              {t(`calc.water.${w}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label>{t('mk.terms')}</label>
        <textarea className="textarea" value={rentalTerms} maxLength={500} placeholder={t('mk.form.termsPh')} onChange={(e) => setRentalTerms(e.target.value)} />
      </div>

      <div className="field">
        <label>{t('mk.form.contact')}</label>
        <input className="input" value={contact} maxLength={64} placeholder={t('mk.form.contactPh')} onChange={(e) => setContact(e.target.value)} />
      </div>

      <div className="field">
        <label>{t('mk.form.photos')}</label>
        <div className="photo-grid">
          {photos.map((p, i) => (
            <div key={i} className="photo-thumb">
              <img src={p.preview} alt="" />
              <button className="photo-remove" onClick={() => removePhoto(i)} aria-label="remove">
                ×
              </button>
            </div>
          ))}
          {photos.length < 5 && (
            <button className="photo-add" onClick={() => inputRef.current?.click()}>
              {t('mk.form.addPhoto')}
            </button>
          )}
        </div>
        <input ref={inputRef} type="file" accept="image/*" multiple hidden onChange={(e) => onPickFiles(e.target.files)} />
      </div>

      {error && <ErrorState message={error} />}

      <button className="btn btn-primary" disabled={!canSubmit || submitting} onClick={submit}>
        {submitting ? t('mk.form.uploading') : isEdit ? t('mk.form.save') : t('mk.form.submit')}
      </button>
    </div>
  );
}
