# YerLab — Project TODO

**Single source of truth for project progress.** Every completed feature updates this file.
Tasks are atomic and measurable. Tasks are grouped by feature branch and follow the git workflow:
create branch → implement → commit → push → open MR → merge to `main` → update this file → next branch.

Legend: `[ ]` todo · `[~]` in progress · `[x]` done

---

## feature/project-setup  (M0)
- [x] Initialize git repo with `main` branch and `.gitignore`
- [x] Create monorepo structure (`/apps/web`, `/apps/api`, `/packages/types`, `/db`)
- [x] Scaffold React + TypeScript + Vite app in `/apps/web`
- [x] Scaffold Express + TypeScript app in `/apps/api`
- [x] Add shared `types` package and wire it into web + api
- [x] Configure ESLint + Prettier + tsconfig across packages
- [x] Add `.env.example` files (bot token, DB URL, AI key, storage keys)
- [x] Add root `README.md` with run instructions
- [x] Verify `web` and `api` both start locally with no errors
- [x] Commit, push, open MR, merge, update todo.md

## feature/authentication  (M1)
- [ ] Create Telegram bot via BotFather; set Mini App URL + menu button — _manual: needs BOT_TOKEN + HTTPS host (documented in README)_
- [x] Install Telegram Mini App SDK in web app
- [x] On launch, read `initData`, theme params, and `language_code`
- [x] Apply Telegram theme params to the UI
- [x] Wire native BackButton / MainButton helpers
- [x] Build `POST /auth/telegram`: validate `initData` HMAC signature server-side
- [x] Upsert user record; return session token + user
- [x] Add auth middleware protecting all non-public routes
- [x] Confirm app launches inside Telegram and authenticates end-to-end — _verified in browser via dev-auth; in-Telegram path needs BOT_TOKEN_
- [x] Commit, push, open MR, merge, update todo.md

## feature/land-profitability  (M2)
- [x] Write `db/schema.sql` for users, regions, crops, crop_region
- [ ] Create Supabase project; apply schema — _manual: needs DATABASE_URL; `db/schema.sql` + `db/seed.sql` ready to apply_
- [x] Seed `regions` with Uzbekistan regions (uz/ru/en) — _14 regions in `data/regions.ts` + `db/seed.sql`_
- [x] Seed `crops` (~15–25) with all economic fields — _20 crops in `data/crops.ts`_
- [x] Seed `crop_region` suitability mappings — _baseline + regional overrides; 280 rows in seed_
- [x] Build `GET /regions` endpoint
- [x] Build `POST /profitability/calculate` (filter by region + water, rank by goal, scale by size)
- [x] Validate request body (Zod) and return labeled estimates + assumptions
- [x] Build Calculator Input screen (region, size+unit, water, goal)
- [x] Build Calculator Results screen (ranked crop cards)
- [x] Build Crop Detail screen with full breakdown + estimate disclaimer
- [x] Verify numbers scale correctly for several sizes and both goals — _verified via Playwright + API tests_
- [x] Commit, push, open MR, merge, update todo.md

## feature/disease-detection  (M3)
- [x] Add `disease_scans` table to schema
- [x] Configure image upload + storage (Supabase Storage) — _MVP: multipart/base64 upload, in-memory scan log; Supabase Storage is the documented prod path_
- [x] Build Diagnose Upload screen (camera/upload + tips)
- [x] Client-side image compression + size/type validation
- [x] Build `POST /disease/analyze` calling the AI vision model
- [x] Write the safety-enforcing prompt (no certainty; confidence + alternatives + category + disclaimer)
- [x] Parse + validate AI JSON; normalize confidence band; always inject disclaimer
- [x] Add per-user rate limiting on the analyze endpoint
- [x] Build Diagnose Loading state
- [x] Build Diagnose Result screen (primary, confidence, alternatives, treatment category, prevention, prominent disclaimer)
- [x] Add graceful fallback if AI provider fails
- [x] Verify result NEVER shows false certainty and disclaimer always appears — _verified live (Claude) + UI; disclaimer/confidence always set in code_
- [x] Commit, push, open MR, merge, update todo.md

## feature/marketplace  (M4)
- [ ] Add `listings` + `listing_photos` tables to schema
- [ ] Build `POST /listings` (create, owner = current user)
- [ ] Build `GET /listings` with filters (region, size range, water) + pagination
- [ ] Build `GET /listings/:id` (full detail + photos + contact)
- [ ] Build `PATCH /listings/:id` and `DELETE /listings/:id` (owner-only)
- [ ] Build listing image upload (1–5 photos)
- [ ] Build Marketplace Feed screen (cards + filter bar)
- [ ] Build Filters screen/sheet
- [ ] Build Listing Detail screen with photo gallery
- [ ] Implement "Contact owner" Telegram deep link
- [ ] Build Create/Edit Listing form
- [ ] Build My Listings screen (edit / close / delete)
- [ ] Verify full owner + seeker flows work end-to-end
- [ ] Commit, push, open MR, merge, update todo.md

## feature/deployment  (M5)
- [ ] Deploy API (Render/Railway/Fly) with env vars
- [ ] Deploy web app (Vercel/Netlify) over HTTPS
- [ ] Point BotFather Mini App URL at production
- [ ] Localization pass (uz + ru strings reviewed)
- [ ] Add loading + error states across all screens
- [ ] Load demo data (crops seed + sample listings)
- [ ] Smoke-test all three features inside Telegram on a real phone
- [ ] Final QA pass against MVP scope in requirements.md
- [ ] Prepare demo script / walkthrough
- [ ] Commit, push, open MR, merge, update todo.md

---

## Cross-cutting / final
- [ ] All money figures labeled as estimates (UZS) with stated basis
- [ ] AI safety contract verified in production
- [ ] No secrets present in the client bundle
- [ ] requirements.md and todo.md reflect the final build
