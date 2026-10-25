import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LegalPage } from "@/app/legal-page";
import { SupportEmail } from "@/app/support-email";

export const metadata: Metadata = {
  title: `Refund Policy — ${PROGRAM.name}`,
  description: `When you can get a refund of a fee paid to ${PROGRAM.name}, and how to ask for one.`,
};

export default function RefundPolicyPage() {
  return (
    <LegalPage title="Refund Policy" updated="25 October 2026">
      <p>
        Learning with {PROGRAM.name}, run by {PROGRAM.operator}, is currently free, so there is
        nothing to pay and nothing to refund. This policy covers any fee you have paid us, and
        any fee we introduce in future.
      </p>

      <h2>When you can get a refund</h2>
      <ul>
        <li>
          <strong>Within 7 days of paying:</strong> a full refund.
        </li>
        <li>
          <strong>From day 8 to day 14:</strong> a 50% refund.
        </li>
        <li>
          <strong>After 14 days:</strong> no refund.
        </li>
      </ul>

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
        issued, your enrollment ends and you are removed from the learner community.
      </p>
    </LegalPage>
  );
}
