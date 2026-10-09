import type { Metadata } from "next";
import { PROGRAM } from "@/constants/program";
import { LegalPage } from "@/app/legal-page";
import { SupportEmail } from "@/app/support-email";

export const metadata: Metadata = {
  title: `Privacy Policy — ${PROGRAM.name}`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="9 October 2026">
      <p>
        {PROGRAM.name} is run by {PROGRAM.operator} from {PROGRAM.location}, who is responsible for
        your personal data. This policy explains what we collect and why, in line with the Nigeria
        Data Protection Act 2023.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Registration details:</strong> your full name, email address, phone number,
          experience level, and (if you tell us) what you want to build.
        </li>
        <li>
          <strong>Payment records:</strong> the payment reference, amount, currency and status.
          Card and bank details are handled by Paystack; we never see or store them.
        </li>
        <li>
          <strong>Enrollment records:</strong> which cohort you joined, and whether through payment
          or a sponsor code.
        </li>
        <li>
          <strong>Security data:</strong> your IP address when you enter a sponsor code, used only to
          limit repeated guessing.
        </li>
      </ul>

      <h2>Why we use it</h2>
      <ul>
        <li>To register and enroll you, and confirm your payment.</li>
        <li>To contact you about your registration, the cohort and support requests.</li>
        <li>To keep the sponsor code system and payments secure.</li>
        <li>To keep financial records the law requires.</li>
      </ul>
      <p>
        We use your data to provide the program you signed up for. We don&apos;t sell it, and we
        don&apos;t use it for advertising.
      </p>

      <h2>Who we share it with</h2>
      <p>Only the services that run the program, each for their part:</p>
      <ul>
        <li>
          <strong>Paystack</strong> — processes payments.
        </li>
        <li>
          <strong>Supabase</strong> — stores our database (servers in the United States).
        </li>
        <li>
          <strong>Vercel</strong> — hosts this website.
        </li>
        <li>
          <strong>Zoho</strong> — handles our email.
        </li>
        <li>
          <strong>Telegram</strong> — hosts the cohort community, if you choose to join it.
        </li>
      </ul>
      <p>
        Some of these services store data outside Nigeria. We use them because they protect data
        with security standards such as encryption.
      </p>

      <h2>Cookies</h2>
      <p>
        We set one cookie, <code>bss_enrollment</code>, after you enroll. It lets the welcome page
        confirm your enrollment, and it expires after 90 days. We don&apos;t use advertising or
        tracking cookies.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep registration and enrollment details while you take part in the program and for up
        to 2 years after your cohort ends, so we can confirm your participation. Payment records
        are kept for as long as tax and accounting law requires. Sponsor code security data is
        deleted after about a day.
      </p>

      <h2>Your rights</h2>
      <p>
        You can ask to see the data we hold about you, correct it, delete it, or object to how we
        use it. Email <SupportEmail /> and we will reply within 30 days. Deleting your data ends
        your enrollment. If you&apos;re unhappy with how we handled your data, you can complain to
        the Nigeria Data Protection Commission.
      </p>

      <h2>Changes</h2>
      <p>
        We may update this policy; the date at the top shows the latest version.
      </p>
    </LegalPage>
  );
}
