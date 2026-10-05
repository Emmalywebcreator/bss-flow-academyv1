# BSS Flow Academy — System Architecture

## Overview

BSS Flow Academy is a Next.js application backed by Supabase.
Paystack handles paid enrollment and Telegram provides the initial
student community.

## High-level flow

Landing
    ↓
Registration
    ↓
Server validation
    ↓
Cohort code OR Paystack
    ↓
Verification
    ↓
Enrollment
    ↓
Welcome page
    ↓
Telegram

## Architecture principles

### 1. Server is authoritative

The browser must never determine:

- final price
- payment success
- enrollment status
- access status

### 2. Payment and enrollment are separate concepts

A student may be enrolled through:

- paid enrollment
- sponsored enrollment

A sponsored student does not require a fake ₦0 payment transaction.

### 3. External services are isolated

Paystack logic belongs in the payment service.

Supabase access belongs in the data/service layer.

Telegram is an external community destination and is not the source
of truth for enrollment.

### 4. V1 should remain small

The architecture should allow future expansion without implementing
future features prematurely.
