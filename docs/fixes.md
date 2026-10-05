# BSS Flow Academy — Fix list

Review of the V1 codebase on 2026-10-05. Work through these in order and
tick each one off as it is merged.

- **P0** — must fix before launch (money, access or data integrity)
- **P1** — should fix before launch
- **P2** — clean-up, can follow launch

## In progress

- [x] **0. Finish the local Supabase setup.** Uncommitted: schema moved to
  `supabase/migrations/`, `config.toml`, `seed.sql`, `db:*` scripts,
  README. Run `npm run db:start` to confirm the migration and seed load,
  then commit.

## P0 — Must fix before launch

- [x] **1. Enrollments can be duplicated.** `enrollments` has no unique
  constraint, so a refreshed callback, two concurrent verifies, or
  entering a sponsor code twice each create another row. Add
  `unique (registration_id, cohort_id)` in a new migration and make both
  enrollment inserts idempotent (upsert / ignore duplicate).
  — `supabase/migrations/`, `app/api/payment/verify/route.ts`,
  `app/api/cohort/validate/route.ts`

- [x] **2. Payment verify ignores database errors.** The payment
  `update` and enrollment `insert` results are never checked, so the
  route can return `verified: true` with no enrollment written.
  — `app/api/payment/verify/route.ts:51-73`

- [x] **3. Paid but not enrolled is unrecoverable.** If the cohort lookup
  fails or the enrollment insert fails after the payment is marked
  `success`, every later verify short-circuits at
  `payment.status === "success"` and never retries the enrollment. On
  that path, make sure the enrollment exists (create it if missing)
  before returning `verified: true`.
  — `app/api/payment/verify/route.ts:33-35, 61-71`

- [x] **4. Sponsor code endpoint can be brute-forced.**
  `/api/cohort/validate` has no rate limit, so codes can be guessed.
  Add per-IP and per-registration attempt limits, and use a long,
  random code in production.
  — `app/api/cohort/validate/route.ts`

- [x] **5. A sponsor code works for anyone, any number of times.** One
  shared code with no usage cap means a leaked code enrols unlimited
  people. Decided: a max-uses cap on `cohorts` (`sponsor_max_uses`),
  40 students for Cohort 1.
  — `supabase/migrations/`, `app/api/cohort/validate/route.ts`

- [x] **6. `/welcome` is open to everyone.** Anyone can open `/welcome`
  and get the Telegram link without enrolling, which breaks the
  architecture rule that the browser never decides access. Gate it
  server-side: pass a reference to the welcome page and confirm an
  active enrollment before showing the link.
  — `app/welcome/page.tsx`, the redirects in `app/register/page.tsx`
  and `app/payment/callback/page.tsx`

- [x] **7. No Paystack webhook.** If the student closes the tab after
  paying but before the callback page loads, the payment is never
  verified and they are never enrolled. Add `POST /api/payment/webhook`
  that checks the `x-paystack-signature` header and runs the same
  verify-and-enrol logic as fix 3 (move that logic into a shared
  function).

- [x] **8. Telegram link is still a placeholder.** The link now comes from
  the server-only `TELEGRAM_INVITE_LINK` environment variable (moved out
  of `constants/program.ts` in fix 6, because that file is bundled into
  the browser). Set in `.env.local` and in Vercel.

## P1 — Should fix before launch

- [x] **9. Tests for the payment routes.** `payment/initialize` and
  `payment/verify` have no tests. Cover the amount, currency and status
  mismatches, the already-verified path, and the error paths from
  fixes 1–3.

- [x] **10. A student can pay twice, or pay after using a sponsor code.**
  `payment/initialize` doesn't check whether the registration already has
  an enrollment, and creates a new pending payment on every click.
  Return "already enrolled" instead.
  — `app/api/payment/initialize/route.ts`

- [x] **11. Duplicate "Cohort 1" rows break lookups.** `on conflict do
  nothing` in the seed never fires, because `cohorts.name` isn't unique.
  A second "Cohort 1" row would make `.maybeSingle()` error in
  `payment/verify`. Add `unique (name)`.
  — `supabase/migrations/20261005000000_initial_schema.sql:61-63`

- [x] **12. Verify doesn't check the associated registration.**
  `docs/api.md` requires it. Compare the transaction's
  `metadata.registrationId` with `payment.registration_id`.
  — `app/api/payment/verify/route.ts`

- [x] **13. Pending payments are marked `failed`.** Paystack can return
  `ongoing`, `pending`, `processing` or `abandoned`, which the
  `PaystackVerifyData` type doesn't list. Leave the payment `pending`
  for in-progress statuses and only mark `failed` on a real failure or
  mismatch.
  — `lib/paystack.ts:26`, `app/api/payment/verify/route.ts:47-50`

- [x] **14. Dead end on the payment failure screen.** The callback page's
  `failed` and `error` states give no way to retry or go back, and don't
  show the reference the student is told to quote to support.
  — `app/payment/callback/page.tsx:62-77`

- [ ] **21. No support contact anywhere.** The callback and welcome pages
  tell students to "contact support" in five places, but the app shows no
  email, phone or WhatsApp number. A student charged without being
  enrolled has no way to reach anyone. Needs the contact details from the
  owner; then show them beside every "contact support" message.
  — `app/payment/callback/page.tsx`, `app/welcome/page.tsx`

## P2 — Clean-up

- [x] **15. Price is defined in two places.** The `cohorts.price` column
  and `PROGRAM.standardPrice` are both 80000. Decided: `PROGRAM.standardPrice`
  is the source of truth; the unused column is dropped.
- [ ] **16. `registrations.cohort_id` is never set.** Set it on
  enrollment, or drop it from the schema and docs.
- [ ] **17. Duplicate registrations.** The same email can register
  repeatedly, and refreshing `/register` mid-flow starts over. Decide
  whether to reuse an existing registration by email.
- [ ] **18. Paystack client robustness.** `response.json()` throws an
  unclear error on non-JSON responses, and `fetch` has no timeout.
  — `lib/paystack.ts`
- [ ] **19. Enforce server-only imports.** Add `import "server-only"` to
  `lib/supabase/server.ts` and `lib/paystack.ts` so the service-role
  client can never be bundled into the browser.
- [ ] **20. Tests for the callback and welcome pages.**
