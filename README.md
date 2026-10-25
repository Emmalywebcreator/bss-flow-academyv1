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
   `supabase/migrations/`, then `supabase/seed.sql` (local-only data).
   Studio, the database UI, is at
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
   only to enrolled students, on the learning page.
   Leave `RESEND_API_KEY` empty locally: login codes are then printed
   to the dev server console instead of emailed.

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

For login codes, add your domain in Resend (Domains → Add domain) and
create the DNS records it lists; your existing mail records stay as
they are. Then set `RESEND_API_KEY` and `EMAIL_FROM` (an address on
that domain) in Vercel. Without them, login in production fails with
"Could not send a login code".

In the Paystack dashboard (Settings → API Keys & Webhooks), set the
webhook URL to `https://<your-domain>/api/payment/webhook`, so students
who close the tab right after paying are still enrolled.

`db push` applies the migrations only — `seed.sql` is never pushed.

Learning is free for now: registering enrolls the learner straight
away (`access_type = 'free'`). The site doesn't offer payment, but the
Paystack routes stay in place for when a fee returns. Sponsor codes
were retired in `20261025000000_free_enrollment.sql`.

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
- `app/learn/page.tsx` — learning page: where to start, and the community link
- `app/welcome/page.tsx` — redirects old links to `/learn`
- `app/login/page.tsx` — log in with an emailed code, on any device
- `app/api/login/request/route.ts` — emails an enrolled student a login code
- `app/api/login/verify/route.ts` — checks the code, sets the enrollment cookie
- `app/api/logout/route.ts` — clears the enrollment cookie
- `app/api/registration/route.ts` — creates a registration, enrolls it for free, sets the enrollment cookie
- `app/api/payment/initialize/route.ts` — starts a Paystack transaction
- `app/api/payment/verify/route.ts` — verifies a Paystack transaction, creates paid enrollment
- `lib/paystack.ts` — Paystack API helper
- `lib/email.ts` — sends login code emails through Resend
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
