"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { PROGRAM } from "@/constants/program";
import { experienceLevels } from "@/lib/schemas";

type Step = "form" | "choose-path" | "code" | "redirecting";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [cohortCode, setCohortCode] = useState("");
  const [codeResult, setCodeResult] = useState<"valid" | "invalid" | null>(null);

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);
    const payload = {
      fullName: String(form.get("fullName") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      experienceLevel: String(form.get("experienceLevel") ?? ""),
      learningGoal: String(form.get("learningGoal") ?? "") || undefined,
    };

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setRegistrationId(data.registrationId);
      setStep("choose-path");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCohortCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!registrationId) return;
    setError(null);
    setSubmitting(true);
    setCodeResult(null);

    try {
      const response = await fetch("/api/cohort/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId, code: cohortCode }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Could not validate that code.");
        return;
      }

      if (data.valid) {
        router.push("/welcome");
      } else {
        setCodeResult("invalid");
      }
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePay() {
    if (!registrationId) return;
    setError(null);
    setSubmitting(true);
    setStep("redirecting");

    try {
      const response = await fetch("/api/payment/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId }),
      });
      const data = await response.json();

      if (data.alreadyEnrolled) {
        router.push("/welcome");
        return;
      }

      if (!response.ok) {
        setError(data.error ?? "Could not start payment.");
        setStep("choose-path");
        return;
      }

      window.location.href = data.authorizationUrl;
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setStep("choose-path");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        {step === "form" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Register for {PROGRAM.firstCohort}
            </h1>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Full name
              <input
                name="fullName"
                required
                minLength={2}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Email
              <input
                type="email"
                name="email"
                required
                className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Phone
              <input
                type="tel"
                name="phone"
                required
                minLength={7}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Experience level
              <select
                name="experienceLevel"
                required
                defaultValue=""
                className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              >
                <option value="" disabled>
                  Select one
                </option>
                {experienceLevels.map((level) => (
                  <option key={level} value={level}>
                    {level[0].toUpperCase() + level.slice(1)}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              What do you want to be able to build? (optional)
              <textarea
                name="learningGoal"
                maxLength={500}
                rows={3}
                className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              />
            </label>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {submitting ? "Submitting..." : "Continue"}
            </button>
          </form>
        )}

        {step === "choose-path" && (
          <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              How would you like to enroll?
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Use a sponsor code if you have one, or pay the standard fee of
              &#8358;{PROGRAM.standardPrice.toLocaleString()}.
            </p>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
              onClick={handlePay}
              disabled={submitting}
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Pay &#8358;{PROGRAM.standardPrice.toLocaleString()} with Paystack
            </button>

            <button
              onClick={() => setStep("code")}
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
            >
              I have a sponsor code
            </button>
          </div>
        )}

        {step === "code" && (
          <form onSubmit={handleCohortCode} className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
              Enter your sponsor code
            </h1>

            <input
              value={cohortCode}
              onChange={(event) => setCohortCode(event.target.value)}
              required
              className="rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              aria-label="Sponsor code"
              placeholder="Enter the code from your sponsor"
            />

            {codeResult === "invalid" && (
              <p className="text-sm text-red-600 dark:text-red-400">
                That code isn&apos;t valid. Double-check it, or pay the standard fee instead.
              </p>
            )}
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {submitting ? "Checking..." : "Validate code"}
            </button>

            <button
              type="button"
              onClick={() => setStep("choose-path")}
              className="text-sm text-zinc-500 underline dark:text-zinc-400"
            >
              Back
            </button>
          </form>
        )}

        {step === "redirecting" && (
          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Redirecting you to Paystack...
          </p>
        )}
      </div>
    </div>
  );
}
