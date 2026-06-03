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
- [ ] Create Telegram bot via BotFather; set Mini App URL + menu button
- [ ] Install Telegram Mini App SDK in web app
- [ ] On launch, read `initData`, theme params, and `language_code`
- [ ] Apply Telegram theme params to the UI
- [ ] Wire native BackButton / MainButton helpers
- [ ] Build `POST /auth/telegram`: validate `initData` HMAC signature server-side
- [ ] Upsert user record; return session token + user
- [ ] Add auth middleware protecting all non-public routes
- [ ] Confirm app launches inside Telegram and authenticates end-to-end
- [ ] Commit, push, open MR, merge, update todo.md

## feature/land-profitability  (M2)
- [ ] Write `db/schema.sql` for users, regions, crops, crop_region
- [ ] Create Supabase project; apply schema
- [ ] Seed `regions` with Uzbekistan regions (uz/ru/en)
- [ ] Seed `crops` (~15–25) with all economic fields
- [ ] Seed `crop_region` suitability mappings
- [ ] Build `GET /regions` endpoint
- [ ] Build `POST /profitability/calculate` (filter by region + water, rank by goal, scale by size)
- [ ] Validate request body (Zod) and return labeled estimates + assumptions
- [ ] Build Calculator Input screen (region, size+unit, water, goal)
- [ ] Build Calculator Results screen (ranked crop cards)
- [ ] Build Crop Detail screen with full breakdown + estimate disclaimer
- [ ] Verify numbers scale correctly for several sizes and both goals
- [ ] Commit, push, open MR, merge, update todo.md

## feature/disease-detection  (M3)
- [ ] Add `disease_scans` table to schema
- [ ] Configure image upload + storage (Supabase Storage)
- [ ] Build Diagnose Upload screen (camera/upload + tips)
- [ ] Client-side image compression + size/type validation
- [ ] Build `POST /disease/analyze` calling the AI vision model
- [ ] Write the safety-enforcing prompt (no certainty; confidence + alternatives + category + disclaimer)
- [ ] Parse + validate AI JSON; normalize confidence band; always inject disclaimer
- [ ] Add per-user rate limiting on the analyze endpoint
- [ ] Build Diagnose Loading state
- [ ] Build Diagnose Result screen (primary, confidence, alternatives, treatment category, prevention, prominent disclaimer)
- [ ] Add graceful fallback if AI provider fails
- [ ] Verify result NEVER shows false certainty and disclaimer always appears
- [ ] Commit, push, open MR, merge, update todo.md

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
