import { z } from "zod";

export const experienceLevels = ["beginner", "intermediate", "advanced"] as const;

export const registrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),
  // Lowercased so a returning registrant is matched however they type it.
  email: z.string().trim().email("Enter a valid email address.").toLowerCase(),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  experienceLevel: z.enum(experienceLevels),
  learningGoal: z.string().trim().max(500).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const cohortCodeSchema = z.object({
  registrationId: z.string().uuid(),
  code: z.string().trim().min(1, "Enter a cohort code."),
});

export const paymentInitializeSchema = z.object({
  registrationId: z.string().uuid(),
});

export const paymentVerifySchema = z.object({
  reference: z.string().trim().min(1, "A payment reference is required."),
});
