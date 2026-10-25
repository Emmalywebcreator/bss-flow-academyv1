export const PROGRAM = {
  name: "BSS Flow Academy",
  tagline: "Build. Scale. Ship.",
  currency: "NGN",
  // The enrollment fee in naira, charged by payment/initialize. Learning
  // is free for now (since 2026-10-25), so the site doesn't offer payment
  // and doesn't show this price; the payment code stays for when it returns.
  standardPrice: 80000,
  // The database row every registration and enrollment belongs to. Left
  // from when learning ran in cohorts; never shown to learners.
  enrollmentCohort: "Cohort 1",
  topic: "Web Development with AI",
  format: "Online",
  // The person who runs the academy (not CAC registered). Named in the
  // terms, privacy and refund pages, and must match the Paystack account.
  operator: "Emmanuel Ohwoka",
  location: "Benin City, Edo State, Nigeria",
  // Shown beside every "contact support" message.
  supportEmail: "admin@bssflow.cloud",
  // Public contact number, shown in the footer and on the terms page.
  supportPhone: "0703 930 1841",
  supportPhoneLink: "tel:+2347039301841",
  // The Telegram invite link is deliberately not here: this object is
  // bundled into client components. It comes from TELEGRAM_INVITE_LINK,
  // read server-side by the welcome page only.
} as const;
