# BSS Flow Academy — API

## POST /api/registration

Creates a registration.

The server validates the submitted information.

## POST /api/cohort/validate

Validates a cohort sponsorship code.

The server determines whether the code is valid.

The client cannot determine sponsorship eligibility.

## POST /api/payment/initialize

Initializes a Paystack transaction.

The server determines the amount.

The client cannot submit its own trusted price.

## POST /api/payment/verify

Verifies a Paystack transaction with Paystack.

The server verifies:

- reference
- transaction status
- amount
- currency
- associated registration

Only verified transactions may result in paid enrollment.

## POST /api/payment/webhook

Receives Paystack webhook events.

The server verifies the `x-paystack-signature` header (HMAC-SHA512 of
the raw body with the Paystack secret key) and rejects unsigned or
wrongly signed requests.

On `charge.success`, the server verifies the transaction with Paystack
exactly as `/api/payment/verify` does, then creates the paid enrollment.
This enrolls students who paid but never reached the callback page.

A non-200 response makes Paystack retry, so only failures on the
server's side return one.

## POST /api/login/request

Emails a 6-digit login code to an enrolled student.

The server creates a code only for an email with an active enrollment,
but answers `{ sent: true }` either way, so the endpoint can't reveal
who has registered. Only the code's SHA-256 hash is stored.

Limits: 3 requests per email and 10 per IP in any 15 minutes (429).

## POST /api/login/verify

Checks an emailed login code and sets the enrollment cookie.

A code lasts 10 minutes, works once, stops working after 5 wrong tries,
and only logs in an enrollment that is still active. A new code
replaces any earlier unused one.

Limit: 20 checks per IP in any 15 minutes (429).

## POST /api/logout

Clears the enrollment cookie and redirects (303) to the homepage.

## Future endpoints

Future versions may introduce:

- /api/student
- /api/admin
- /api/resources
- /api/progress
