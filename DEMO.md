# 🎬 YerLab — Demo Walkthrough

A 3–4 minute script to show all three tools. Works in a plain browser (dev-auth
mock user) or inside Telegram once a `BOT_TOKEN` + HTTPS host are configured.

## Setup (local)

```bash
npm install
cp .env.example apps/api/.env     # add ANTHROPIC_API_KEY for real diagnosis
npm run dev                       # web :5173, api :4000
```

Open http://localhost:5173. A **Demo mode** badge confirms dev auth (no Telegram
needed). Switch language any time with the **uz / ru / en** chips on the Home hub.

## 1. The pitch (15s)

> "Millions in Uzbekistan have underused land. YerLab is one Telegram Mini App
> that tells you **what to grow**, **what's wrong with your plant**, and helps you
> **rent land out** — in Uzbek and Russian, on any cheap phone."

## 2. Profitability Calculator (60s)

1. Tap **Foydalilik kalkulyatori** (Calculator).
2. Region **Xorazm**, size **4 sotka**, water **Cheklangan** (Limited), goal **Maksimal foyda** (Profit).
3. Tap **Hisoblash** → ranked crops by **net profit** (Pomidor on top, ~11.8M so'm).
4. Switch goal to **Oila uchun** (Family) and recalculate → ordering changes to
   easy, fast home crops (Turp/radish, greens, cucumber).
5. Open a crop → full breakdown (investment, yield, revenue, harvest window) with a
   clear **UZS estimate disclaimer**.

> Talking point: figures scale with land size and are labelled estimates, not promises.

## 3. AI Disease Detection (60s)

1. Back to Home → **Kasallikni aniqlash** (Diagnose).
2. Tap the upload zone, pick a photo of an affected leaf.
3. Watch the loading state → result:
   - Primary finding + **confidence band** (Low/Medium/High) — never false certainty.
   - **1–2 alternatives**.
   - Treatment as a **category** (e.g. "copper-based fungicide"), not a brand or dose.
   - Prevention tips + a **prominent ⚠️ safety disclaimer** to verify with an agronomist.

> Talking point: safety-first by design — the disclaimer and confidence band appear
> on **every** result, enforced server-side.

## 4. Land Marketplace (60s)

1. Back to Home → **Yer bozori** (Marketplace).
2. Browse seeded listings; open **Filtrlar** and filter by region / water / size.
3. Open a listing → photo gallery + **Egasi bilan bog'lanish** (Contact owner) →
   opens a Telegram chat deep link.
4. Tap **+ Yer joylash** (Post land), fill the form, add a photo, **publish**.
5. Land on the new listing → owner actions: **Tahrirlash / Yopish / O'chirish**
   (edit / close / delete). Check **Mening e'lonlarim** (My listings).

## 5. Close (15s)

> "Telegram auth is automatic, it's fully localised, and it runs on a $50 phone.
> Three real problems, one app, ready to demo."

## Reset

Restart `npm run dev` to reset in-memory data (seed listings + crops reload).
