# 🌱 YerLab

> Telegram Mini App that helps people in Uzbekistan get more value from their land.

Three focused tools in one Mini App:

- **Profitability Calculator** — what to grow for your region, water, land size, and goal.
- **AI Disease Detection** — photo-based plant diagnosis with *careful*, safety-first guidance (Claude vision).
- **Unused Land Marketplace** — list idle land and connect with renters directly via Telegram.

Built for a hackathon: fast, working, clean, demo-ready. See [`requirements.md`](./requirements.md) and [`todo.md`](./todo.md).

---

## Monorepo layout

```
/apps
  /web        # React + TypeScript + Vite Mini App
  /api        # Node + Express + TypeScript API
/packages
  /types      # shared TypeScript types (client + server)
/db
  schema.sql  # PostgreSQL schema
  seed/       # regions, crops, crop_region seed data
```

npm **workspaces** are used; install once at the root.

## Prerequisites

- Node.js >= 18 (developed on Node 24)
- npm >= 9

## Quick start

```bash
# 1. Install all workspaces
npm install

# 2. Configure the API (optional for a basic demo — sensible fallbacks apply)
cp .env.example apps/api/.env
#   - BOT_TOKEN empty       -> dev auth (mock user), runs in a plain browser
#   - ANTHROPIC_API_KEY set -> real Claude vision disease detection
#   - DATABASE_URL empty    -> in-memory seeded store

# 3. Run web + api together
npm run dev
#   API -> http://localhost:4000   (health: /health)
#   Web -> http://localhost:5173
```

Open http://localhost:5173 in a browser. Without a `BOT_TOKEN`, the API runs in
**dev auth** mode (a mock Telegram user) so every feature is usable outside Telegram.

### Run individually

```bash
npm run dev:api
npm run dev:web
```

## Configuration

All secrets live in `apps/api/.env` (gitignored). Only `VITE_*` vars reach the web bundle.

| Variable | Purpose | If empty |
|---|---|---|
| `BOT_TOKEN` | Telegram bot token (validates `initData`) | Dev auth mock user |
| `ANTHROPIC_API_KEY` | Claude vision for disease detection | Graceful structured fallback |
| `ANTHROPIC_MODEL` | Claude model id | `claude-sonnet-4-6` |
| `DATABASE_URL` | Postgres / Supabase connection | In-memory seeded store |
| `SESSION_SECRET` | Signs the session token | Insecure dev default |
| `DISEASE_DAILY_LIMIT` | Per-user/day AI cap | `20` |

> ⚠️ Never commit `.env`. Keep the API key server-side only.

## Telegram setup (for in-Telegram testing)

1. Create a bot with [@BotFather](https://t.me/BotFather) → get the token → put it in `BOT_TOKEN`.
2. Host the web app over HTTPS (e.g. Vercel/Netlify, or `ngrok` for local).
3. In BotFather, set the **Mini App URL** / menu button to that HTTPS URL.
4. Open the bot in Telegram and launch the Mini App.

## Deployment

HTTPS is required by Telegram for Mini Apps. Config files are included:

| Target | File | Notes |
|---|---|---|
| Web → Vercel | `apps/web/vercel.json` | SPA rewrites. Root = repo; Build `npm run build -w @yerlab/web`; Output `apps/web/dist`. Set `VITE_API_BASE_URL`. |
| Web → Netlify | `netlify.toml` | Build + SPA fallback. Set `VITE_API_BASE_URL`. |
| API + Web → Render | `render.yaml` | Blueprint: API web service + static site. Set `BOT_TOKEN`, `ANTHROPIC_API_KEY`, `WEB_ORIGIN`. |
| API → Docker | `apps/api/Dockerfile` | `docker build -f apps/api/Dockerfile -t yerlab-api .` |

**Order:** deploy API first → copy its `https://…/api` URL into the web app's
`VITE_API_BASE_URL` → deploy web → set the web origin in the API's `WEB_ORIGIN`
→ point the BotFather Mini App URL at the web HTTPS URL.

> The MVP stores images on the API's local disk (`/uploads`) and data in memory.
> These reset on redeploy — fine for a demo. For production, wire `DATABASE_URL`
> (apply `db/schema.sql` + `db/seed.sql`) and Supabase Storage.

See [`DEMO.md`](./DEMO.md) for the demo walkthrough.

---

Working codename **YerLab** ("yer" = land). Rename freely.
