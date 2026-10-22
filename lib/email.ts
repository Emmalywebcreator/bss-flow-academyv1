import "server-only";
import { PROGRAM } from "@/constants/program";

const RESEND_URL = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 10_000;

/**
 * Emails a login code through Resend. Without RESEND_API_KEY outside
 * production, the code is printed to the server console instead, so
 * login can be tried locally without an email account.
 */
export async function sendLoginCodeEmail(to: string, fullName: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey && process.env.NODE_ENV !== "production") {
    console.info(`[dev] login code for ${to}: ${code}`);
    return;
  }
  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or EMAIL_FROM environment variable.");
  }

  const firstName = fullName.split(" ")[0];
  const text = [
    `Hi ${firstName},`,
    "",
    `Your ${PROGRAM.name} login code is ${code}`,
    "",
    "It expires in 10 minutes. If you didn't ask to log in, you can ignore this email.",
    "",
    `Questions? Reply to this email or write to ${PROGRAM.supportEmail}.`,
  ].join("\n");

  let response: Response;
  try {
    response = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to,
        reply_to: PROGRAM.supportEmail,
        subject: `${code} is your ${PROGRAM.name} login code`,
        text,
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new Error(`Resend timed out after ${REQUEST_TIMEOUT_MS / 1000}s.`);
    }
    throw new Error(`Resend request failed: ${String(err)}`);
  }

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend failed (HTTP ${response.status}): ${body.slice(0, 200)}`);
  }
}
