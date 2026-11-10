import { useMemo } from "react";
import { useAuth } from "@clerk/react";
import { createMarketplaceClient } from "./supabase";

/** Use only inside ClerkProvider, when the corresponding production screens exist.
 * Clerk supplies the current session token; Supabase verifies it via Third-Party Auth.
 * This intentionally does not use the deprecated Supabase JWT template.
 */
export function useMarketplaceClient() {
  const { getToken } = useAuth();
  return useMemo(() => createMarketplaceClient(() => getToken()), [getToken]);
}
