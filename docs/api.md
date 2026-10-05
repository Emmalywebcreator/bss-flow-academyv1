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

## Future endpoints

Future versions may introduce:

- /api/student
- /api/admin
- /api/resources
- /api/progress
