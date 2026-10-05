export const PROGRAM = {
  name: "BSS Flow Academy",
  tagline: "Build. Scale. Ship.",
  currency: "NGN",
  standardPrice: 80000,
  firstCohort: "Cohort 1",
  // The Telegram invite link is deliberately not here: this object is
  // bundled into client components. It comes from TELEGRAM_INVITE_LINK,
  // read server-side by the welcome page only.
} as const;
