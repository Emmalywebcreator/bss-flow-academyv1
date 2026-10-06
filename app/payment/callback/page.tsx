"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SupportEmail } from "@/app/support-email";

type Status = "verifying" | "success" | "pending" | "failed" | "error";

const primaryButton =
  "rounded-full bg-zinc-950 px-6 py-3 text-sm font-medium text-zinc-50 transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200";
const secondaryButton =
  "rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const [status, setStatus] = useState<Status>(reference ? "verifying" : "error");
  // Bumped by "Check again" to re-run verification, which is safe to
  // repeat: it never charges, and enrolls at most once.
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!reference) return;

    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference }),
        });
        const data = await response.json();

        if (cancelled) return;

        if (!response.ok) {
          setStatus("error");
          return;
        }

        if (data.verified) {
          setStatus("success");
          router.replace("/welcome");
        } else if (data.pending) {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [reference, router, attempt]);

  function checkAgain() {
    setStatus("verifying");
    setAttempt((n) => n + 1);
  }

  const referenceNote = reference && (
    <p className="text-xs text-zinc-500 dark:text-zinc-500">
      Payment reference: <span className="font-mono select-all">{reference}</span>
    </p>
  );

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
      <div className="max-w-md text-center">
        {status === "verifying" && (
          <p className="text-zinc-600 dark:text-zinc-400">Verifying your payment...</p>
        )}
        {status === "success" && (
          <p className="text-zinc-600 dark:text-zinc-400">Payment confirmed. Redirecting...</p>
        )}
        {status === "pending" && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">Your payment is still processing.</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Some payments, such as bank transfers, take a few minutes to confirm. Check again in a
              few minutes to continue — please don&apos;t pay again.
            </p>
            {referenceNote}
            <button onClick={checkAgain} className={`mt-2 ${primaryButton}`}>
              Check again
            </button>
          </div>
        )}
        {status === "failed" && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">
              We couldn&apos;t confirm this payment.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              If money left your account, contact support at <SupportEmail /> with the reference
              below before trying again. Otherwise, you can go back and try paying again.
            </p>
            {referenceNote}
            <Link href="/register" className={`mt-2 ${primaryButton}`}>
              Back to registration
            </Link>
          </div>
        )}
        {status === "error" && reference && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">
              Something went wrong while verifying your payment.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              This is usually temporary, and checking again won&apos;t charge you twice. If it keeps
              happening, contact support at <SupportEmail /> with the
              reference below.
            </p>
            {referenceNote}
            <button onClick={checkAgain} className={`mt-2 ${primaryButton}`}>
              Check again
            </button>
          </div>
        )}
        {status === "error" && !reference && (
          <div className="flex flex-col items-center gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">
              This page is missing a payment reference.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              It should open automatically after you pay on Paystack. If you&apos;ve paid, contact
              support at <SupportEmail /> with the reference from your Paystack receipt.
            </p>
            <Link href="/register" className={`mt-2 ${secondaryButton}`}>
              Back to registration
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-24 dark:bg-black">
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
