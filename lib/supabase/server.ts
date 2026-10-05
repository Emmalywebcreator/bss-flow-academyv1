import { createClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key.
 *
 * This client bypasses Row Level Security and must never be imported
 * into a client component, a browser bundle, or exposed to the client
 * in any way. Only use it inside route handlers / server code.
 */
export function getSupabaseServerClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false },
  });
}
