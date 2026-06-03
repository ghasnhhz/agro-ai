import { useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useSession } from '../app/session';
import { LanguageSwitch } from '../components/LanguageSwitch';
import { hapticImpact } from '../lib/telegram';

interface Feature {
  to: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  accent: string;
}

const FEATURES: Feature[] = [
  {
    to: '/calculator',
    emoji: '🌾',
    titleKey: 'home.calculator.title',
    descKey: 'home.calculator.desc',
    accent: '#2e8b57',
  },
  {
    to: '/diagnose',
    emoji: '🔬',
    titleKey: 'home.diagnose.title',
    descKey: 'home.diagnose.desc',
    accent: '#c0563b',
  },
  {
    to: '/market',
    emoji: '🤝',
    titleKey: 'home.market.title',
    descKey: 'home.market.desc',
    accent: '#2a7de1',
  },
];

export default function Home() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const { user, devMode } = useSession();

  return (
    <div className="screen">
      <header className="hub-header">
        <div className="hub-top">
          <div>
            <h1>🌱 {t('home.title')}</h1>
            <p className="muted" style={{ margin: 0 }}>
              {t('app.tagline')}
            </p>
          </div>
          {devMode && <span className="badge-dev">{t('home.devBadge')}</span>}
        </div>
        {user?.firstName && (
          <p className="greeting">
            {t('home.greeting')}, {user.firstName} 👋
          </p>
        )}
      </header>

      <div className="feature-grid">
        {FEATURES.map((f) => (
          <button
            key={f.to}
            className="feature-card"
            style={{ ['--accent' as string]: f.accent }}
            onClick={() => {
              hapticImpact('medium');
              navigate(f.to);
            }}
          >
            <span className="feature-emoji">{f.emoji}</span>
            <span className="feature-text">
              <span className="feature-title">{t(f.titleKey)}</span>
              <span className="feature-desc">{t(f.descKey)}</span>
            </span>
            <span className="feature-arrow">›</span>
          </button>
        ))}
      </div>

      <footer className="hub-footer">
        <span className="muted">{t('common.language')}</span>
        <LanguageSwitch />
      </footer>
    </div>
  );
}
