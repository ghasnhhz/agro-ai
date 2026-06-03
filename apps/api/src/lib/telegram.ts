import crypto from 'node:crypto';
import type { Locale } from '@yerlab/types';

export interface TelegramUser {
  telegramId: number;
  username: string | null;
  firstName: string | null;
  languageCode: Locale | null;
}

const ALLOWED_LOCALES: Locale[] = ['uz', 'ru', 'en'];

function normalizeLocale(code: string | undefined): Locale | null {
  if (!code) return null;
  const short = code.slice(0, 2).toLowerCase();
  return (ALLOWED_LOCALES as string[]).includes(short) ? (short as Locale) : null;
}

/**
 * Validate Telegram Mini App `initData` against the bot token (HMAC-SHA256).
 * Returns the parsed user on success, or throws on failure.
 *
 * Spec: secret_key = HMAC_SHA256(key="WebAppData", msg=bot_token);
 *       hash       = HMAC_SHA256(key=secret_key,   msg=data_check_string).
 */
export function validateInitData(
  initData: string,
  botToken: string,
  maxAgeSeconds = 86400,
): TelegramUser {
  const params = new URLSearchParams(initData);
  const hash = params.get('hash');
  if (!hash) throw new Error('Missing hash in initData');
  params.delete('hash');

  const dataCheckString = [...params.entries()]
    .map(([k, v]) => [k, v] as const)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${v}`)
    .join('\n');

  const secretKey = crypto.createHmac('sha256', 'WebAppData').update(botToken).digest();
  const computedHash = crypto
    .createHmac('sha256', secretKey)
    .update(dataCheckString)
    .digest('hex');

  const valid =
    computedHash.length === hash.length &&
    crypto.timingSafeEqual(Buffer.from(computedHash), Buffer.from(hash));
  if (!valid) throw new Error('Invalid initData signature');

  // Freshness check (replay protection).
  const authDate = Number(params.get('auth_date') ?? 0);
  if (authDate && Date.now() / 1000 - authDate > maxAgeSeconds) {
    throw new Error('initData is expired');
  }

  const userJson = params.get('user');
  if (!userJson) throw new Error('Missing user in initData');
  const u = JSON.parse(userJson) as {
    id: number;
    username?: string;
    first_name?: string;
    language_code?: string;
  };

  return {
    telegramId: u.id,
    username: u.username ?? null,
    firstName: u.first_name ?? null,
    languageCode: normalizeLocale(u.language_code),
  };
}

/** A deterministic mock user for dev mode (no bot token configured). */
export function devUser(): TelegramUser {
  return {
    telegramId: 777000777,
    username: 'demo_user',
    firstName: 'Demo',
    languageCode: 'uz',
  };
}
