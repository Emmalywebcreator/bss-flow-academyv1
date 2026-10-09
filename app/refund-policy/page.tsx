import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LegalPage } from "@/app/legal-page";
import { SupportEmail } from "@/app/support-email";

export const metadata: Metadata = {
  title: `Refund Policy — ${PROGRAM.name}`,
  description: `When you can get a refund of the ${PROGRAM.name} enrollment fee, and how to ask for one.`,
};

export default function RefundPolicyPage() {
  const fee = `₦${PROGRAM.standardPrice.toLocaleString()}`;

  return (
    <LegalPage title="Refund Policy" updated="9 October 2026">
      <p>
        This policy covers the {fee} enrollment fee for {PROGRAM.name}, run by {PROGRAM.operator}.
        Each cohort is a {PROGRAM.duration} online program; {PROGRAM.firstCohort} starts on{" "}
        {PROGRAM.firstCohortStart}.
      </p>

      <h2>When you can get a refund</h2>
      <ul>
        <li>
          <strong>Before the cohort starts:</strong> a full refund, if you ask by the day before
          the cohort&apos;s start date.
        </li>
        <li>
          <strong>During the first week:</strong> a 50% refund, if you ask within the first 7 days
          of the cohort.
        </li>
        <li>
          <strong>After the first week:</strong> no refund.
        </li>
        <li>
          <strong>If we cancel or postpone the cohort</strong> and you can&apos;t join the new
          dates: a full refund, whenever you ask.
        </li>
      </ul>
      <p>
        Sponsored places, enrolled with a sponsor code, are free, so there is nothing to refund.
      </p>

      <h2>How to ask for a refund</h2>
      <p>
        Email <SupportEmail /> from the address you registered with, and include your full name
        and your payment reference (it starts with <code>bss-</code> and is in your Paystack
        receipt). We reply within 2 working days.
      </p>

      <h2>How you are refunded</h2>
      <p>
        Refunds go back to the card or account you paid with, through Paystack. Once approved,
        they usually arrive within 5–10 working days, depending on your bank. When a refund is
        issued, your enrollment ends and you are removed from the cohort&apos;s community.
      </p>
    </LegalPage>
  );
}
