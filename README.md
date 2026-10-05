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

2. Copy the environment template and fill in real values:

   ```bash
   cp .env.example .env.local
   ```

   You'll need a Supabase project (URL + service role key) and a
   Paystack account (secret key). See `.env.example` for the full list.

3. Set up the database — run `supabase/schema.sql` in your Supabase
   project's SQL editor. This creates `cohorts`, `registrations`,
   `payments`, and `enrollments`, and seeds a `Cohort 1` row with no
   sponsor code — sponsored enrollment is disabled until you set one.
   Pick a hard-to-guess code and set it in the SQL editor (never commit
   it to the repo):

   ```sql
   update cohorts set sponsor_code = '<your-secret-code>' where name = 'Cohort 1';
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

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
- `supabase/schema.sql` — database schema

## What's not in V1

Student dashboard, course progress, online lessons, assignments,
certificates, admin dashboard, automated emails, a Telegram bot, video
hosting, and general LMS functionality — see `docs/mvp-scope.md`. These
are natural next steps once V1 is live, but deliberately excluded for
now to keep the first version shippable.
