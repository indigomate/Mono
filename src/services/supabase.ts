import { createClient } from "@supabase/supabase-js";

export type SessionTokenProvider = () => Promise<string | null>;
/** Production service factory. Never falls back to sample inventory. */
export function createMarketplaceClient(accessToken: SessionTokenProvider) {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim();
  if (!url || !key)
    throw new Error(
      "Supabase is not configured. Set its public URL and publishable key.",
    );
  if (!key.startsWith("sb_publishable_"))
    throw new Error(
      "Use a Supabase publishable key; secret and service-role keys are forbidden in the browser.",
    );
  return createClient(url, key, {
    accessToken,
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
