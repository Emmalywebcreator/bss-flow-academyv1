import type { Metadata } from "next";
import Link from "next/link";
import { PROGRAM } from "@/constants/program";
import { LegalPage } from "@/app/legal-page";
import { SupportEmail } from "@/app/support-email";

export const metadata: Metadata = {
  title: `Terms and Conditions — ${PROGRAM.name}`,
};

export default function TermsPage() {
  const fee = `₦${PROGRAM.standardPrice.toLocaleString()}`;

  return (
    <LegalPage title="Terms and Conditions" updated="9 October 2026">
      <p>
        These terms apply when you register for or take part in {PROGRAM.name} (&quot;we&quot;,
        &quot;us&quot;), a training program run by {PROGRAM.operator} from {PROGRAM.location}. By
        registering, you agree to them.
      </p>

      <h2>The program</h2>
      <p>
        {PROGRAM.name} runs {PROGRAM.topic.toLowerCase()} training in cohorts. Each cohort is a{" "}
        {PROGRAM.duration} {PROGRAM.format.toLowerCase()} program. {PROGRAM.firstCohort} starts on{" "}
        {PROGRAM.firstCohortStart}. Session times, links and announcements are shared in the
        cohort&apos;s Telegram community. We may adjust the schedule or content to improve the
        program; we will tell you in the community first.
      </p>

      <h2>Registration</h2>
      <p>
        Give accurate details when you register, and use an email address you can access: we use
        it to identify your enrollment and to contact you. One registration is for one person.
      </p>

      <h2>Fees and payment</h2>
      <p>
        The enrollment fee is {fee}, paid once, in Nigerian naira, through Paystack. We never see
        or store your card details. You are enrolled once the payment is confirmed. Refunds follow
        our <Link href="/refund-policy">Refund Policy</Link>.
      </p>

      <h2>Sponsored places</h2>
      <p>
        Some places are sponsored and enrolled with a sponsor code instead of a payment. Codes are
        for the people they were given to, and each cohort has a limited number of sponsored
        places. We may cancel an enrollment made with a code that was shared or used without
        permission.
      </p>

      <h2>Your enrollment and the community</h2>
      <p>
        Your enrollment is personal. Don&apos;t share the Telegram invite link, session links or
        course materials with anyone who isn&apos;t enrolled. Be respectful to other students and
        instructors. We may remove anyone who harasses others, shares access, or disrupts the
        program, without a refund.
      </p>

      <h2>Course materials</h2>
      <p>
        Materials we provide are for your personal learning. Code you write during the program is
        yours.
      </p>

      <h2>No guarantees</h2>
      <p>
        We work hard to teach you well, but we can&apos;t guarantee a job, income or any
        particular result. Your progress depends on the effort you put in.
      </p>

      <h2>Liability</h2>
      <p>
        As far as the law allows, our total liability to you for anything to do with the program is
        limited to the fee you paid.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle your personal data is explained in our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        We may update these terms; the date at the top shows the latest version. These terms are
        governed by the laws of the Federal Republic of Nigeria.
      </p>

      <h2>Contact</h2>
      <p>
        Questions? Email <SupportEmail /> or call{" "}
        <a href={PROGRAM.supportPhoneLink}>{PROGRAM.supportPhone}</a>.
      </p>
    </LegalPage>
  );
}
