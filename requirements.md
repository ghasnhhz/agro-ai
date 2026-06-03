# YerLab — Requirements Specification

> Telegram Mini App that helps people in Uzbekistan get more value from their land.
> Working codename: **YerLab** ("yer" = land). Rename freely.

**Document status:** Draft v1.0 — pre-development. Awaiting approval before implementation.
**Context:** Hackathon MVP. Bias toward fast implementation, a working demo, clean UI, and real-world usefulness. Avoid overengineering.

---

## 1. Product Vision

**Mission:** Help people get more value from their land.

Millions of people in Uzbekistan own or control land that is underused. They face four recurring problems:

1. They don't know *what* to plant for their conditions and goals.
2. They can't judge whether a crop is *worth* it (cost, effort, yield, money).
3. When plants get sick, they can't identify the problem and often buy the *wrong* chemical recommended by a local seller.
4. When they don't want to farm at all, renting the land out happens slowly through personal contacts.

YerLab is a single Telegram Mini App that addresses all four through three focused tools:

- **Profitability Calculator** — decision support for what to grow.
- **AI Disease Detection** — photo-based diagnosis and *careful* treatment guidance.
- **Unused Land Marketplace** — list idle land and connect renters directly via Telegram.

**Why a Telegram Mini App:** Telegram is already installed and trusted across Uzbekistan. There is no app-store friction, no separate login, and instant sharing inside chats and groups (mahalla groups, farming groups). Identity and reach come for free.

**Design principles**
- **Serve two user types equally** — families growing food for themselves *and* people growing for profit. The product never assumes commercial intent.
- **Safe by default** — the AI gives guidance, never dangerous certainty about chemicals.
- **Low literacy / low bandwidth friendly** — big tap targets, minimal typing, works on cheap phones.
- **Local first** — Uzbek and Russian language, Uzbekistan regions, locally relevant crops.

**One-line pitch:** *Tell us about your land — we'll tell you what to grow, diagnose what's wrong with it, or help you rent it out.*

---

## 2. User Personas

**P1 — Dilnoza, family gardener (primary)**
38, lives in a house in Xorazm with ~4 sotka (≈400 m²) of yard. Wants to grow vegetables to feed her family and cut grocery costs. Not interested in selling. Low farming confidence, moderate phone skill, uses Telegram daily. *Needs:* simple, low-risk crop suggestions and reassurance she's doing it right.

**P2 — Akmal, small profit-minded grower (primary)**
45, has ~0.2 ha and reliable water. Already sells some produce at the bazaar but guesses at what's profitable. *Needs:* honest numbers — investment, harvest window, expected revenue — to choose crops and avoid losing a season.

**P3 — Sardor, the worried farmer (primary)**
52, finds spots and curling on his tomato leaves. A shop owner sells him an insecticide that doesn't help. *Needs:* a fast, plain-language second opinion from a photo, and to know which *category* of treatment is appropriate — with clear warnings.

**P4 — Gulnora, idle-land owner (primary)**
60, inherited ~0.5 ha she can't farm. Would rent it out but only knows to ask neighbors. *Needs:* an easy way to post the land and be contacted.

**P5 — Bekzod, land seeker / micro-entrepreneur (secondary)**
29, wants to lease a plot near a city to start growing. *Needs:* to browse and filter available land and contact owners directly.

---

## 3. User Stories

**Profitability Calculator**
- As a family gardener, I want to enter my region, land size, and water situation and pick "feed my family," so I get easy crops that suit a home garden.
- As a profit grower, I want to pick "maximum profit" and see expected revenue and investment per crop, so I can choose what to plant this season.
- As any user, I want to open a crop and see its difficulty, water needs, and harvest period, so I know what I'm committing to.

**AI Disease Detection**
- As a worried farmer, I want to photograph a sick leaf and get a likely diagnosis, so I understand what's wrong.
- As a user, I want to see a confidence level and other possibilities, so I don't over-trust one answer.
- As a user, I want a recommended treatment *category* plus a safety disclaimer, so I act carefully and verify before spraying chemicals.

**Marketplace**
- As an idle-land owner, I want to post my land with photos, size, water, and asking terms, so renters can find it.
- As a land seeker, I want to filter listings by region, size, and water, so I find suitable plots fast.
- As a land seeker, I want one tap to message the owner on Telegram, so contact is instant.
- As an owner, I want to edit or close my listing, so it stays accurate.

**Cross-cutting**
- As a user, I want the app in Uzbek or Russian, so I can use it comfortably.
- As a user, I want to sign in automatically through Telegram, so there's no separate account.

---

## 4. Functional Requirements

**Authentication**
- FR-1 The app authenticates the user from Telegram `initData`; no separate login.
- FR-2 The backend validates `initData` (HMAC signature against the bot token) on every protected request path.

**Profitability Calculator**
- FR-3 User selects region, land size (with unit: sotka / hectare / m²), water availability (none / rain-only / limited / reliable), and goal (consumption / max profit).
- FR-4 System returns a ranked list of recommended crops filtered to the user's region and water level.
- FR-5 Ranking respects the goal: profit → sort by expected net revenue; consumption → sort by ease + suitability for home use.
- FR-6 Each result shows: estimated investment, harvest period, expected yield, expected revenue (if sold), difficulty level, water requirement — scaled to the user's land size.
- FR-7 A crop detail view shows the full breakdown and short growing notes.
- FR-8 All money figures are clearly labeled as estimates with currency (UZS) and a stated basis.

**AI Disease Detection**
- FR-9 User uploads or takes a photo of an affected plant.
- FR-10 Backend sends the image to the AI vision model and returns a structured result.
- FR-11 Result identifies the most likely issue across: disease, pest, leaf damage, nutrient deficiency.
- FR-12 Result **always** includes: confidence level, 1–2 alternative possibilities, probable cause, recommended treatment, recommended insecticide/treatment *category* (not a brand/dose), prevention advice.
- FR-13 The AI **must not** state certainty. Every result carries a disclaimer to verify with an agronomist before applying chemicals. (See NFR safety.)
- FR-14 Image size is validated and capped before upload; unsupported files are rejected with a friendly message.

**Marketplace**
- FR-15 An owner can create a listing with: title, region, location (text + optional pin), land size, water availability, rental expectation (price/terms, free text), photos (1–5), and contact (defaults to their Telegram).
- FR-16 Listings are browsable in a feed and filterable by region, size range, and water level.
- FR-17 A listing detail view shows all fields, a photo gallery, and a "Contact owner" action.
- FR-18 "Contact owner" opens a Telegram chat / deep link to the owner — no in-app chat or payments in MVP.
- FR-19 An owner can view, edit, close/reopen, and delete their own listings.

**General**
- FR-20 The app supports Uzbek and Russian (English optional); language follows Telegram `language_code` and can be switched.
- FR-21 The app uses Telegram theme params and native BackButton/MainButton.

---

## 5. Non-Functional Requirements

**Performance** — Mini App interactive in < 3 s on a mid-range Android over 3G; calculator responds in < 1 s; disease analysis returns within ~10 s with a clear loading state.

**Safety (AI) — highest priority**
- The AI is prompted and post-processed so it never asserts certainty.
- Confidence is shown as a band (e.g., Low / Medium / High), not false precision.
- Treatment output is limited to a *category* of action (e.g., "a copper-based fungicide" / "an organic insecticidal soap") and explicitly avoids exact doses or brand endorsements.
- Every analysis ends with a disclaimer: recommendations are not a substitute for a professional agronomist, and chemicals must be verified and applied per label and local regulation.
- If the image is unclear or off-topic, the AI says so rather than guessing.

**Security & privacy** — Validate `initData` server-side; rate-limit the AI endpoint per user to control cost and abuse; sanitize and size-limit uploads; store only what's needed; uploaded plant photos are not personal data but are still access-controlled; contact info shown in the marketplace is consented to by the lister.

**Cost control** — Cache crop reference data client-side; compress images before sending to the AI; cap AI calls per user per day.

**Reliability** — Graceful errors with retry; if the AI provider fails, show a friendly fallback rather than a crash.

**Usability / accessibility** — Minimum typing, large tap targets (≥ 44px), high contrast, number-pad inputs for sizes, works one-handed.

**Localization** — All user-facing strings externalized; units shown in locally familiar forms (sotka and hectare).

**Maintainability** — TypeScript end-to-end, shared types between client and server, environment-based config, no secrets in the client.

---

## 6. Database Schema

PostgreSQL (via Supabase for MVP — gives DB, storage, and auth helpers fast). Tables:

**users**
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| telegram_id | bigint unique | from initData |
| username | text null | |
| first_name | text null | |
| language_code | text null | uz / ru / en |
| created_at | timestamptz default now() | |

**regions** (reference / seed)
| column | type | notes |
|---|---|---|
| id | serial PK | |
| name_uz | text | e.g., "Xorazm" |
| name_ru | text | |
| name_en | text | |

**crops** (reference / seed — the heart of the calculator)
| column | type | notes |
|---|---|---|
| id | serial PK | |
| name_uz / name_ru / name_en | text | |
| difficulty | text | easy / medium / hard |
| water_need | text | low / medium / high |
| min_water_level | int | maps to water availability tier |
| harvest_days_min / harvest_days_max | int | growing window |
| investment_per_sotka_uzs | int | seed/inputs estimate |
| yield_kg_per_sotka | numeric | expected yield |
| price_per_kg_uzs | int | typical bazaar price |
| good_for_consumption | bool | suits home gardens |
| good_for_profit | bool | viable to sell |
| notes_uz / notes_ru | text | short growing tips |

**crop_region** (which crops suit which region — many-to-many)
| crop_id | region_id | suitability | (high/medium/low) |

**listings** (marketplace)
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| owner_id | uuid FK → users | |
| title | text | |
| region_id | int FK → regions | |
| location_text | text | free text address |
| lat / lng | numeric null | optional pin |
| size_sotka | numeric | normalized to sotka |
| water_availability | text | none/rain/limited/reliable |
| rental_terms | text | free text (price/expectation) |
| contact_telegram | text | username or tg id |
| status | text | active / closed |
| created_at | timestamptz | |

**listing_photos**
| id | uuid PK | listing_id FK | url | sort_order |

**disease_scans** (log + optional history)
| column | type | notes |
|---|---|---|
| id | uuid PK | |
| user_id | uuid FK | |
| image_url | text | |
| result_json | jsonb | full structured AI output |
| confidence_band | text | low/medium/high |
| created_at | timestamptz | |

*Calculator queries need not be persisted for MVP (stateless compute). Optionally log them for analytics later.*

---

## 7. API Specification

Base URL: `/api`. JSON. All protected routes require a valid Telegram session (validated `initData` → short-lived session token). Errors use `{ error: { code, message } }`.

**Auth**
- `POST /auth/telegram` — body `{ initData }` → validates signature, upserts user, returns `{ token, user }`.

**Reference**
- `GET /regions` → `[{ id, name_uz, name_ru, name_en }]`
- `GET /crops` → crop reference list (optional, for browsing)

**Profitability**
- `POST /profitability/calculate`
  - body `{ regionId, size, sizeUnit, waterLevel, goal }`
  - returns `{ results: [{ cropId, name, investmentUzs, harvestPeriod, expectedYieldKg, expectedRevenueUzs, difficulty, waterNeed }], assumptions }`
  - All figures scaled to provided size; `assumptions` documents the basis (per-sotka rates, prices) and an estimate disclaimer.

**Disease Detection**
- `POST /disease/analyze`
  - multipart `image` (or `{ imageBase64 }`)
  - returns
    ```json
    {
      "primary": { "type": "disease|pest|damage|deficiency", "name": "...", "probableCause": "..." },
      "confidence": "low|medium|high",
      "alternatives": [{ "name": "...", "type": "..." }],
      "treatment": { "category": "...", "guidance": "...", "prevention": "..." },
      "disclaimer": "Not a substitute for an agronomist. Verify before applying chemicals."
    }
    ```
  - Rate-limited per user. Validates/compresses image. `disclaimer` and `confidence` are always present.

**Marketplace**
- `GET /listings` — query `region`, `minSize`, `maxSize`, `water`, `page` → `{ items, page, total }`
- `GET /listings/:id` → full listing + photos + owner contact
- `POST /listings` — create (auth, owner = current user)
- `PATCH /listings/:id` — edit own listing (status, fields)
- `DELETE /listings/:id` — delete own listing
- `POST /uploads` — image upload (returns stored URL) or use Supabase Storage signed uploads directly from client.

---

## 8. Telegram Mini App Architecture

```
Telegram client
   │  (opens Mini App via bot menu button / inline button / direct link)
   ▼
React + TS SPA  ──uses──►  @telegram-apps/sdk (or @twa-dev/sdk)
   │   - reads initData, theme params, language_code
   │   - native BackButton / MainButton
   │   - sends initData to backend on launch
   ▼
Node.js + Express API  ──validates initData (HMAC w/ bot token)──► issues session token
   │
   ├─► PostgreSQL / Supabase (users, crops, regions, listings, scans)
   ├─► Supabase Storage (listing & scan images)
   └─► AI provider (OpenAI / Claude vision) for /disease/analyze
```

- **Bot & app registration:** create bot via BotFather, set the Mini App URL and menu button.
- **Hosting:** SPA on Vercel/Netlify (HTTPS required); API on Render/Railway/Fly; DB+storage on Supabase.
- **Auth flow:** on launch the client posts `initData`; server verifies the HMAC signature, upserts the user, returns a short-lived token used for subsequent calls. Never trust client-sent user IDs.
- **Contact in marketplace:** open `https://t.me/<username>` or `tg://user?id=<id>` deep links — no custom messaging layer.
- **Theming:** apply Telegram theme params so the app matches the user's light/dark Telegram.

---

## 9. UI Screens

1. **Home / Hub** — header, three large feature cards (Calculator, Diagnose, Marketplace), language switch.
2. **Calculator — Input** — region picker, size + unit, water level (4 tap options), goal toggle (Family / Profit), primary "Calculate" button.
3. **Calculator — Results** — ranked crop cards (name, key numbers, difficulty/water badges); tap → detail.
4. **Calculator — Crop Detail** — full breakdown, growing notes, "estimate" disclaimer.
5. **Diagnose — Upload** — big camera/upload button, example tips ("fill the frame with the affected leaf").
6. **Diagnose — Loading** — friendly progress state.
7. **Diagnose — Result** — primary finding, confidence band, alternatives, treatment category + prevention, prominent safety disclaimer.
8. **Marketplace — Feed** — listing cards (photo, region, size, water, terms), filter bar.
9. **Marketplace — Filters** — region, size range, water level.
10. **Marketplace — Listing Detail** — gallery, all fields, "Contact owner" (Telegram).
11. **Marketplace — Create/Edit Listing** — form with photo upload, fields, submit.
12. **My Listings** — user's own listings with edit/close/delete.
13. **(Optional) Profile** — language, my scans history.

UI built per the frontend-design guidelines; clean, mobile-first, Telegram-native theming.

---

## 10. MVP Scope (hackathon deliverable)

**In:**
- Telegram auth (initData validation).
- Calculator over a **seeded crop dataset (~15–25 crops)** with rule-based ranking and scaled estimates.
- AI disease detection with the **mandatory safety structure** (confidence, alternatives, category, disclaimer).
- Marketplace: create / browse / filter / detail / edit-close-delete, contact via Telegram deep link, image upload.
- Uzbek + Russian strings (at least one fully localized; second machine-assisted is acceptable for demo).
- Telegram theming, BackButton/MainButton.

**Out (explicitly deferred):**
- Payments / escrow.
- In-app chat.
- Map-based search / geolocation matching beyond an optional pin.
- User reviews/ratings.
- ML-trained crop model (rule-based is enough).
- Push notifications.
- Admin dashboard.

---

## 11. Future Scope

- Verified agronomist review of AI results; "ask an expert" escalation.
- Real-time / regional bazaar price feeds to sharpen revenue estimates.
- Weather and planting-calendar integration per region.
- Saved farms, season planning, and reminders (sowing, watering, harvest).
- Marketplace trust: verification, ratings, in-app messaging, optional payments.
- Larger crop database with input-cost breakdowns and supplier links.
- Offline-capable calculator.
- Group/cooperative features for mahalla-level coordination.

---

## 12. Technical Architecture

**Frontend:** React + TypeScript, Vite, Telegram Mini App SDK, React Router, lightweight state (Context/Zustand), i18n (uz/ru), Telegram-themed component styling.

**Backend:** Node.js + Express + TypeScript, layered as routes → controllers → services. `initData` validation middleware; per-route auth; rate limiting on `/disease/analyze`; centralized error handler; Zod for request validation.

**Data:** PostgreSQL via Supabase; Supabase Storage for images; seed scripts for `regions`, `crops`, `crop_region`.

**AI:** OpenAI or Claude vision via the disease service. The prompt enforces the safety contract (no certainty, always confidence + alternatives + category + disclaimer) and requests strict JSON; the service validates the JSON and injects/normalizes the disclaimer and confidence band before returning.

**Shared:** A shared `types` package (or folder) for request/response and domain types to keep client and server aligned.

**Environments / secrets:** `.env` for bot token, DB URL, AI key, storage keys — server-side only. Nothing sensitive in the client bundle.

**Deployment:** SPA → Vercel/Netlify; API → Render/Railway/Fly; DB/storage → Supabase. HTTPS everywhere (required by Telegram).

**Repo layout:**
```
/apps
  /web        # React + TS Mini App
  /api        # Express + TS
/packages
  /types      # shared TS types
/db
  schema.sql
  seed/       # regions, crops, crop_region
requirements.md
todo.md
```

---

## 13. Development Milestones

Milestones map 1:1 to the feature branches in the git workflow. Each ends with a working, demoable increment and a `todo.md` update.

- **M0 — Project setup** (`feature/project-setup`): monorepo, web + api scaffolds, shared types, lint/format, env config, deploy skeleton.
- **M1 — Telegram + Auth** (`feature/authentication`): Mini App launches in Telegram, reads initData, server validates it, session issued, theming + Back/Main buttons.
- **M2 — Calculator** (`feature/land-profitability`): DB schema + crop/region seed, `/profitability/calculate`, input + results + crop detail screens.
- **M3 — Disease Detection** (`feature/disease-detection`): upload screen, `/disease/analyze` with AI integration and enforced safety structure, result screen.
- **M4 — Marketplace** (`feature/marketplace`): listing CRUD, feed + filters + detail, image upload, contact deep link, my-listings.
- **M5 — Deploy & polish** (`feature/deployment`): production deploy, localization pass, error/loading states, demo data, final QA.

**Suggested hackathon order of value:** M0 → M1 → (M2 and M4 in parallel if team allows, as they're independent) → M3 → M5. The Calculator and Marketplace are the most reliable demo wins; Disease Detection is the highest-wow but most dependent on the AI provider, so build it with a graceful fallback.

---

*End of requirements.md — awaiting approval before implementation.*
