"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status = "verifying" | "success" | "pending" | "failed" | "error";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref");
  const [status, setStatus] = useState<Status>(reference ? "verifying" : "error");

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
  }, [reference, router]);

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
          <div className="flex flex-col gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">Your payment is still processing.</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Some payments, such as bank transfers, take a few minutes to confirm. Refresh this
              page in a few minutes to continue — please don&apos;t pay again.
            </p>
          </div>
        )}
        {status === "failed" && (
          <div className="flex flex-col gap-3">
            <p className="text-zinc-950 dark:text-zinc-50">
              We couldn&apos;t confirm this payment.
            </p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              If money left your account, contact support before trying again.
            </p>
          </div>
        )}
        {status === "error" && (
          <p className="text-zinc-600 dark:text-zinc-400">
            Something went wrong while verifying your payment. Please contact support with your
            payment reference.
          </p>
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
