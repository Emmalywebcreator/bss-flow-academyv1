import "server-only";
import { createHash, randomInt } from "crypto";

/** A random 6-digit code, zero-padded. */
export function generateLoginCode() {
  return randomInt(0, 1_000_000).toString().padStart(6, "0");
}

/** Codes are stored and compared only as this hash. */
export function hashLoginCode(code: string) {
  return createHash("sha256").update(code).digest("hex");
}

/** The caller's IP for rate limiting. The host (e.g. Vercel) sets x-forwarded-for. */
export function requestIp(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
