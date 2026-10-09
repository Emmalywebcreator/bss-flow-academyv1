export const PROGRAM = {
  name: "BSS Flow Academy",
  tagline: "Build. Scale. Ship.",
  currency: "NGN",
  // The enrollment fee in naira — the single source of truth for both the
  // amount charged (payment/initialize) and the price shown on the site.
  standardPrice: 80000,
  firstCohort: "Cohort 1",
  topic: "Web Development with AI",
  firstCohortStart: "15 October 2026",
  duration: "6 weeks",
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
