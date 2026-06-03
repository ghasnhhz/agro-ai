import crypto from 'node:crypto';
import type { User } from '@yerlab/types';
import type { TelegramUser } from '../lib/telegram.js';

// In-memory user store. Users re-authenticate on restart, which is fine for the
// MVP/demo (identity always comes from Telegram initData). Swap for Postgres by
// implementing the same two functions against the `users` table.
const byTelegramId = new Map<number, User>();
const byId = new Map<string, User>();

export function upsertUser(tg: TelegramUser): User {
  const existing = byTelegramId.get(tg.telegramId);
  if (existing) {
    existing.username = tg.username;
    existing.firstName = tg.firstName;
    if (tg.languageCode) existing.languageCode = tg.languageCode;
    return existing;
  }
  const user: User = {
    id: crypto.randomUUID(),
    telegramId: tg.telegramId,
    username: tg.username,
    firstName: tg.firstName,
    languageCode: tg.languageCode,
    createdAt: new Date().toISOString(),
  };
  byTelegramId.set(user.telegramId, user);
  byId.set(user.id, user);
  return user;
}

export function getUserById(id: string): User | undefined {
  return byId.get(id);
}
