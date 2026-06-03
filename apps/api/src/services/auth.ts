import type { AuthResponse } from '@yerlab/types';
import { config, DEV_AUTH } from '../config.js';
import { devUser, validateInitData } from '../lib/telegram.js';
import { signToken } from '../lib/token.js';
import { upsertUser } from '../store/users.js';

/**
 * Authenticate a Telegram Mini App launch.
 * - Production: validates `initData` HMAC against the bot token.
 * - Dev (no BOT_TOKEN): accepts a mock user so the app runs in a browser.
 */
export function authenticateTelegram(initData: string): AuthResponse {
  const tgUser =
    DEV_AUTH || !initData ? devUser() : validateInitData(initData, config.botToken);
  const user = upsertUser(tgUser);
  const token = signToken({ userId: user.id, telegramId: user.telegramId });
  return { token, user, devMode: DEV_AUTH };
}
