import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  CalculateRequest,
  CalculateResponse,
  CropResult,
  Goal,
  SizeUnit,
  WaterLevel,
} from '@yerlab/types';
import { api } from '../../lib/api';
import { useI18n } from '../../i18n';

export interface CalcInput {
  regionId: number | null;
  size: string;
  sizeUnit: SizeUnit;
  waterLevel: WaterLevel | null;
  goal: Goal;
}

interface CalculatorState {
  input: CalcInput;
  setInput: (patch: Partial<CalcInput>) => void;
  response: CalculateResponse | null;
  loading: boolean;
  error: string | null;
  calculate: () => Promise<boolean>;
  getCrop: (id: number) => CropResult | undefined;
}

const defaultInput: CalcInput = {
  regionId: null,
  size: '',
  sizeUnit: 'sotka',
  waterLevel: null,
  goal: 'consumption',
};

const Ctx = createContext<CalculatorState | null>(null);

export function CalculatorProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n();
  const [input, setInputState] = useState<CalcInput>(defaultInput);
  const [response, setResponse] = useState<CalculateResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setInput = useCallback((patch: Partial<CalcInput>) => {
    setInputState((prev) => ({ ...prev, ...patch }));
  }, []);

  const calculate = useCallback(async (): Promise<boolean> => {
    if (input.regionId == null || input.waterLevel == null || !input.size) return false;
    setLoading(true);
    setError(null);
    try {
      const body: CalculateRequest = {
        regionId: input.regionId,
        size: Number(input.size),
        sizeUnit: input.sizeUnit,
        waterLevel: input.waterLevel,
        goal: input.goal,
        locale,
      };
      const res = await api.post<CalculateResponse>('/profitability/calculate', body);
      setResponse(res);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'error');
      return false;
    } finally {
      setLoading(false);
    }
  }, [input, locale]);

  const getCrop = useCallback(
    (id: number) => response?.results.find((r) => r.cropId === id),
    [response],
  );

  const value = useMemo(
    () => ({ input, setInput, response, loading, error, calculate, getCrop }),
    [input, setInput, response, loading, error, calculate, getCrop],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCalculator(): CalculatorState {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCalculator must be used within CalculatorProvider');
  return ctx;
}
