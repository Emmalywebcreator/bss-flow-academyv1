"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Step = "email" | "code";

const inputClass =
  "rounded-lg border border-zinc-300 px-3 py-2 text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50";
const primaryButtonClass =
  "mt-2 rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function post(path: string, payload: unknown) {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: response.ok, data: await response.json() };
  }

  async function handleRequestCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { ok, data } = await post("/api/login/request", { email });
      if (!ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setCode("");
      setStep("code");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const { ok, data } = await post("/api/login/verify", { email, code });
      if (!ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      router.push("/welcome");
    } catch {
      setError("Something went wrong. Please check your connection and try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-950">
        {step === "email" && (
          <form onSubmit={handleRequestCode} className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Log in</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Enter the email you registered with and we&apos;ll send you a 6-digit login code.
            </p>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Email
              <input
                type="email"
                name="email"
                autoComplete="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
              />
            </label>

            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? "Sending..." : "Send login code"}
            </button>

            <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
              Not registered yet?{" "}
              <Link href="/register" className="font-medium text-zinc-950 underline dark:text-zinc-50">
                Register
              </Link>
            </p>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
            <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Check your email</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              If <strong className="text-zinc-950 dark:text-zinc-50">{email}</strong> belongs to an
              enrolled learner, we&apos;ve sent it a code. It expires in 10 minutes — check your spam
              folder if you can&apos;t see it.
            </p>

            <label className="flex flex-col gap-1 text-sm text-zinc-700 dark:text-zinc-300">
              Login code
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                required
                value={code}
                onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))}
                className={`${inputClass} font-mono text-lg tracking-[0.4em]`}
              />
            </label>

            {error && <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <button type="submit" disabled={submitting} className={primaryButtonClass}>
              {submitting ? "Checking..." : "Log in"}
            </button>

            <div className="flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setStep("email");
                }}
                className="underline"
              >
                Use a different email
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleRequestCode()}
                className="underline"
              >
                Send a new code
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
