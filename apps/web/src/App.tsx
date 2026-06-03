import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSession } from './app/session';
import { ErrorState, Loading } from './components/states';
import { ComingSoon } from './components/ComingSoon';
import { useI18n } from './i18n';
import Home from './screens/Home';

function AuthGate({ children }: { children: ReactNode }) {
  const { status, error, retry } = useSession();
  if (status === 'loading') return <Loading />;
  if (status === 'error') return <ErrorState message={error ?? undefined} onRetry={retry} />;
  return <>{children}</>;
}

function CalculatorPlaceholder() {
  const { t } = useI18n();
  return <ComingSoon title={t('home.calculator.title')} />;
}
function DiagnosePlaceholder() {
  const { t } = useI18n();
  return <ComingSoon title={t('home.diagnose.title')} />;
}
function MarketPlaceholder() {
  const { t } = useI18n();
  return <ComingSoon title={t('home.market.title')} />;
}

export default function App() {
  return (
    <AuthGate>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CalculatorPlaceholder />} />
          <Route path="/diagnose" element={<DiagnosePlaceholder />} />
          <Route path="/market" element={<MarketPlaceholder />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </AuthGate>
  );
}
