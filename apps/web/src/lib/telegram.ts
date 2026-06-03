import WebApp from '@twa-dev/sdk';

export const tg = WebApp;

/** Apply Telegram theme params to CSS variables so the UI matches the client. */
function applyTheme() {
  const tp = WebApp.themeParams ?? {};
  const root = document.documentElement.style;
  const set = (cssVar: string, value?: string) => {
    if (value) root.setProperty(cssVar, value);
  };
  set('--tg-theme-bg-color', tp.bg_color);
  set('--tg-theme-text-color', tp.text_color);
  set('--tg-theme-hint-color', tp.hint_color);
  set('--tg-theme-link-color', tp.link_color);
  set('--tg-theme-button-color', tp.button_color);
  set('--tg-theme-button-text-color', tp.button_text_color);
  set('--tg-theme-secondary-bg-color', tp.secondary_bg_color);
  // section_bg_color exists on newer clients
  set('--tg-theme-section-bg-color', (tp as unknown as Record<string, string>).section_bg_color);
}

/** Initialise the Mini App: signal ready, expand, apply + track theme. */
export function initTelegram() {
  try {
    WebApp.ready();
    WebApp.expand();
  } catch {
    // Running outside Telegram (plain browser) — safe to ignore.
  }
  applyTheme();
  try {
    WebApp.onEvent('themeChanged', applyTheme);
  } catch {
    // no-op outside Telegram
  }
}

export function getInitData(): string {
  return WebApp.initData ?? '';
}

export function getTelegramLanguage(): string {
  return WebApp.initDataUnsafe?.user?.language_code ?? '';
}

/** Show the native Back button wired to `onClick`; returns a cleanup fn. */
export function showBackButton(onClick: () => void): () => void {
  try {
    WebApp.BackButton.show();
    WebApp.BackButton.onClick(onClick);
  } catch {
    // no-op outside Telegram
  }
  return () => {
    try {
      WebApp.BackButton.offClick(onClick);
      WebApp.BackButton.hide();
    } catch {
      // no-op
    }
  };
}

/** Show the native Main button; returns a cleanup fn. */
export function showMainButton(text: string, onClick: () => void): () => void {
  try {
    WebApp.MainButton.setText(text);
    WebApp.MainButton.show();
    WebApp.MainButton.enable();
    WebApp.MainButton.onClick(onClick);
  } catch {
    // no-op outside Telegram
  }
  return () => {
    try {
      WebApp.MainButton.offClick(onClick);
      WebApp.MainButton.hide();
    } catch {
      // no-op
    }
  };
}

export function hapticImpact(style: 'light' | 'medium' | 'heavy' = 'light') {
  try {
    WebApp.HapticFeedback.impactOccurred(style);
  } catch {
    // no-op
  }
}

/** Open a Telegram deep link (e.g. to contact a listing owner). */
export function openTelegramLink(url: string) {
  try {
    WebApp.openTelegramLink(url);
  } catch {
    window.open(url, '_blank');
  }
}
