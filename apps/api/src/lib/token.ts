import crypto from 'node:crypto';
import { config } from '../config.js';

export interface SessionPayload {
  userId: string;
  telegramId: number;
  exp: number; // unix seconds
}

const TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/** Issue a compact signed session token (payload.signature). */
export function signToken(data: Omit<SessionPayload, 'exp'>): string {
  const payload: SessionPayload = {
    ...data,
    exp: Math.floor(Date.now() / 1000) + TTL_SECONDS,
  };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(body)
    .digest('base64url');
  return `${body}.${sig}`;
}

/** Verify a session token; returns the payload or null if invalid/expired. */
export function verifyToken(token: string): SessionPayload | null {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  const expected = crypto
    .createHmac('sha256', config.sessionSecret)
    .update(body)
    .digest('base64url');
  if (
    sig.length !== expected.length ||
    !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))
  ) {
    return null;
  }
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString()) as SessionPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}
