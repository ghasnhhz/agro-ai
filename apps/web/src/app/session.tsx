import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '@yerlab/types';
import { authTelegram, setToken } from '../lib/api';
import { getInitData } from '../lib/telegram';

interface SessionState {
  status: 'loading' | 'ready' | 'error';
  user: User | null;
  devMode: boolean;
  error: string | null;
  retry: () => void;
}

const SessionContext = createContext<SessionState | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({
    status: 'loading',
    user: null,
    devMode: false,
    error: null,
    retry: () => {},
  });

  useEffect(() => {
    let cancelled = false;
    const authenticate = async () => {
      setState((s) => ({ ...s, status: 'loading', error: null }));
      try {
        const res = await authTelegram(getInitData());
        if (cancelled) return;
        setToken(res.token);
        setState({
          status: 'ready',
          user: res.user,
          devMode: res.devMode,
          error: null,
          retry: authenticate,
        });
      } catch (err) {
        if (cancelled) return;
        setState({
          status: 'error',
          user: null,
          devMode: false,
          error: err instanceof Error ? err.message : 'Authentication failed',
          retry: authenticate,
        });
      }
    };
    authenticate();
    return () => {
      cancelled = true;
    };
  }, []);

  return <SessionContext.Provider value={state}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionState {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}
