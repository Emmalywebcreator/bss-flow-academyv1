"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeReturnTo, withReturnTo } from "@/lib/return-to";
import { PROGRAM } from "@/constants/program";
import { experienceLevels } from "@/lib/schemas";

export default function RegisterPage() {
  const router = useRouter();
  // The learning page that sent them here, if any (see requireEnrollment).
  const next = useSearchParams().get("next");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

      // Learning is free for now, so registering also enrolls and signs in.
      router.push(safeReturnTo(next) ?? "/learn");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Register as a learner
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Learning with {PROGRAM.name} is free. Register to open the lessons, follow them at your
            own pace and join the learner community.
          </p>

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
            {submitting ? "Registering..." : "Register for free"}
          </button>

          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">
            By registering, you agree to our{" "}
            <Link href="/terms" className="underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            .
          </p>

          <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link
              href={withReturnTo("/login", next)}
              className="font-medium text-zinc-950 underline dark:text-zinc-50"
            >
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
