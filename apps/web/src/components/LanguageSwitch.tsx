import { useI18n } from '../i18n';
import { LOCALES, LOCALE_LABELS } from '../i18n/strings';
import { hapticImpact } from '../lib/telegram';

export function LanguageSwitch() {
  const { locale, setLocale } = useI18n();
  return (
    <div className="lang-switch" role="group" aria-label="Language">
      {LOCALES.map((l) => (
        <button
          key={l}
          className={`lang-chip ${l === locale ? 'active' : ''}`}
          onClick={() => {
            hapticImpact('light');
            setLocale(l);
          }}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
