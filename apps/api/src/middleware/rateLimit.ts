import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/http.js';

interface Counter {
  day: string;
  count: number;
}
const counters = new Map<string, Counter>();

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Per-user daily cap (cost control for the AI endpoint). */
export function dailyLimit(max: number) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const userId = req.user?.id ?? 'anon';
    const day = today();
    const current = counters.get(userId);
    if (!current || current.day !== day) {
      counters.set(userId, { day, count: 1 });
      return next();
    }
    if (current.count >= max) {
      throw new HttpError(
        429,
        'RATE_LIMITED',
        `Daily analysis limit reached (${max}/day). Please try again tomorrow.`,
      );
    }
    current.count += 1;
    next();
  };
}
