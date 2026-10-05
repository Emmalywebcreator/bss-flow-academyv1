# BSS Flow Academy

Build. Scale. Ship.

Registration and enrollment app for BSS Flow Academy's web development
training program — see `docs/mvp-scope.md` for the full V1 scope,
`docs/architecture.md` for the system design, `docs/database.md` for
the schema, and `docs/api.md` for the API contract.

## Stack

- Next.js (App Router) + TypeScript
- Supabase (Postgres) for registrations, payments, and enrollments
- Paystack for paid enrollment
- Zod for request validation

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the local database (requires Docker — no Supabase account
   needed for development):

   ```bash
   npm run db:start
   ```

   This runs Supabase locally and applies everything in
   `supabase/migrations/`, then `supabase/seed.sql` (local-only data:
   it sets the sponsor code `local-dev-code` so you can test sponsored
   enrollment). Studio, the database UI, is at
   [http://localhost:54323](http://localhost:54323).

   `npm run db:reset` rebuilds the database from scratch; `npm run db:stop`
   shuts it down.

3. Copy the environment template and fill it in:

   ```bash
   cp .env.example .env.local
   ```

   For local development, take `SUPABASE_URL` (the "Project URL") and
   `SUPABASE_SERVICE_ROLE_KEY` (the "Secret" key) from `npm run db:status`.
   You'll also need a Paystack secret key — use a test key
   (`sk_test_...`) in development.
   Set `TELEGRAM_INVITE_LINK` to the community invite; it is shown
   only to enrolled students, on the welcome page.

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Going live with a hosted Supabase project

Create a project at [supabase.com](https://supabase.com), then:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

In Vercel, set the same environment variables as `.env.local`
(Project Settings → Environment Variables), with the hosted Supabase
values and your live Paystack key.

`db push` applies the migrations only — `seed.sql` is never pushed, so
the hosted Cohort 1 starts with no sponsor code. Set a hard-to-guess
code in the hosted project's SQL editor (never commit it to the repo):

```sql
update cohorts set sponsor_code = '<your-secret-code>' where name = 'Cohort 1';
```

A sponsor code enrolls at most `sponsor_max_uses` students (40 for
Cohort 1); after that, students are asked to pay the standard fee.
Revoking a sponsored enrollment frees its place. To change the cap:

```sql
update cohorts set sponsor_max_uses = <number> where name = 'Cohort 1';
```

## Learner journey (V1)

Landing → Register → Cohort code **or** Paystack payment → server
verification → enrollment created → Welcome page → Telegram community.

See `docs/architecture.md` for the full flow and the principles behind
it (server-authoritative pricing/enrollment, payment and enrollment as
separate concepts, isolated external services).

## Project structure

- `app/page.tsx` — landing page
- `app/register/page.tsx` — registration form + cohort code / payment choice
- `app/payment/callback/page.tsx` — Paystack redirect target, verifies payment
- `app/welcome/page.tsx` — post-enrollment success page
- `app/api/registration/route.ts` — creates a registration
- `app/api/cohort/validate/route.ts` — validates a sponsor code, creates sponsored enrollment
- `app/api/payment/initialize/route.ts` — starts a Paystack transaction
- `app/api/payment/verify/route.ts` — verifies a Paystack transaction, creates paid enrollment
- `lib/paystack.ts` — Paystack API helper
- `lib/schemas.ts` — Zod request schemas
- `lib/supabase/server.ts` — server-only Supabase client
- `supabase/migrations/` — database schema, as ordered migrations
- `supabase/seed.sql` — local-only development data
- `supabase/config.toml` — local Supabase configuration

## What's not in V1

Student dashboard, course progress, online lessons, assignments,
certificates, admin dashboard, automated emails, a Telegram bot, video
hosting, and general LMS functionality — see `docs/mvp-scope.md`. These
are natural next steps once V1 is live, but deliberately excluded for
now to keep the first version shippable.
