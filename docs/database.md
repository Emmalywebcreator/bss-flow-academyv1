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

## Enrollment access types

- paid
- sponsored

## Important rule

A successful Paystack payment creates or activates an enrollment.

A valid sponsored cohort code creates or activates an enrollment
without creating a payment transaction.
