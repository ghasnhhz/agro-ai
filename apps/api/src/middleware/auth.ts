import type { NextFunction, Request, Response } from 'express';
import type { User } from '@yerlab/types';
import { HttpError } from '../lib/http.js';
import { verifyToken } from '../lib/token.js';
import { getUserById } from '../store/users.js';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

/** Require a valid session token (issued by POST /auth/telegram). */
export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.header('authorization') ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'UNAUTHENTICATED', 'Missing session token.');

  const payload = verifyToken(token);
  if (!payload) throw new HttpError(401, 'UNAUTHENTICATED', 'Invalid or expired session.');

  const user = getUserById(payload.userId);
  if (!user) {
    throw new HttpError(401, 'UNAUTHENTICATED', 'Session user not found. Please re-open the app.');
  }
  req.user = user;
  next();
}
