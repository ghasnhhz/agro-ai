import type { ReactNode } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useSession } from './app/session';
import { ErrorState, Loading } from './components/states';
import { ComingSoon } from './components/ComingSoon';
import { useI18n } from './i18n';
import { CalculatorProvider } from './features/calculator/context';
import { DiseaseProvider } from './features/disease/context';
import Home from './screens/Home';
import CalculatorInput from './screens/calculator/CalculatorInput';
import CalculatorResults from './screens/calculator/CalculatorResults';
import CropDetail from './screens/calculator/CropDetail';
import DiagnoseUpload from './screens/diagnose/DiagnoseUpload';
import DiagnoseResult from './screens/diagnose/DiagnoseResult';

function AuthGate({ children }: { children: ReactNode }) {
  const { status, error, retry } = useSession();
  if (status === 'loading') return <Loading />;
  if (status === 'error') return <ErrorState message={error ?? undefined} onRetry={retry} />;
  return <>{children}</>;
}

function MarketPlaceholder() {
  const { t } = useI18n();
  return <ComingSoon title={t('home.market.title')} />;
}

export default function App() {
  return (
    <AuthGate>
      <BrowserRouter>
        <CalculatorProvider>
          <DiseaseProvider>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/calculator" element={<CalculatorInput />} />
              <Route path="/calculator/results" element={<CalculatorResults />} />
              <Route path="/calculator/crop/:id" element={<CropDetail />} />
              <Route path="/diagnose" element={<DiagnoseUpload />} />
              <Route path="/diagnose/result" element={<DiagnoseResult />} />
              <Route path="/market" element={<MarketPlaceholder />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </DiseaseProvider>
        </CalculatorProvider>
      </BrowserRouter>
    </AuthGate>
  );
}
