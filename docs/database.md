# BSS Flow Academy — Database

## Core entities

### registrations

Stores the student's registration information.

Fields:

- id
- full_name
- email
- phone
- experience_level
- learning_goal
- cohort_id
- created_at

### payments

Stores payment transactions.

Fields:

- id
- registration_id
- reference
- amount
- currency
- status
- provider
- paid_at
- created_at

### enrollments

Stores access to a cohort.

Fields:

- id
- registration_id
- cohort_id
- status
- access_type
- access_granted_at
- created_at

### login_codes

Emailed login codes for enrolled students. Only the SHA-256 hash of a
code is stored. Rows older than a day are pruned.

Fields:

- id
- registration_id
- code_hash
- attempts
- expires_at
- used_at
- created_at

### login_attempts

Login code requests and checks, kept for a day for rate limiting.

Fields:

- id
- kind (`request` or `verify`)
- ip
- email
- created_at

## Enrollment access types

- free — registered while learning is free (since 2026-10-25)
- paid
- sponsored — enrolled with a sponsor code; codes are retired, existing rows are kept

## Important rule

Registering creates a free enrollment, without a payment transaction.

A successful Paystack payment creates or activates an enrollment.
