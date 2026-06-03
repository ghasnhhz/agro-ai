import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { showBackButton } from './telegram';

/** Wire the native Telegram Back button to navigate back (or to a fallback path). */
export function useBackButton(fallback = '/') {
  const navigate = useNavigate();
  useEffect(() => {
    const cleanup = showBackButton(() => {
      if (window.history.length > 1) navigate(-1);
      else navigate(fallback);
    });
    return cleanup;
  }, [navigate, fallback]);
}
