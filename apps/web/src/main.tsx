import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { I18nProvider, resolveInitialLocale } from './i18n';
import { SessionProvider } from './app/session';
import { getTelegramLanguage, initTelegram } from './lib/telegram';
import './styles/global.css';

initTelegram();
const initialLocale = resolveInitialLocale(getTelegramLanguage());

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <I18nProvider initialLocale={initialLocale}>
      <SessionProvider>
        <App />
      </SessionProvider>
    </I18nProvider>
  </React.StrictMode>,
);
