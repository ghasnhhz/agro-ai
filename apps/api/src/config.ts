import 'dotenv/config';

export const config = {
  port: Number(process.env.PORT ?? 4000),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  webOrigin: (process.env.WEB_ORIGIN ?? 'http://localhost:5173')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  sessionSecret: process.env.SESSION_SECRET ?? 'dev-insecure-secret-change-me',
  botToken: process.env.BOT_TOKEN ?? '',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY ?? '',
  anthropicModel: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
  diseaseDailyLimit: Number(process.env.DISEASE_DAILY_LIMIT ?? 20),
  databaseUrl: process.env.DATABASE_URL ?? '',
};

/** When true, Telegram initData is mocked so the app runs in a plain browser. */
export const DEV_AUTH = config.botToken === '';

/** When true, disease analysis uses a graceful fallback instead of calling Claude. */
export const AI_ENABLED = config.anthropicApiKey !== '';
