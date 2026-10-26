import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAdminConfig } from "@/lib/supabase/config";

/**
 * Client Supabase à privilèges élevés.
 * À utiliser uniquement dans des Route Handlers / Server Actions.
 * Le service role contourne les politiques RLS : ne jamais l'exposer au navigateur.
 */
export function createAdminClient(): SupabaseClient {
  const { url, serviceRoleKey, adminConfigured } = getSupabaseAdminConfig();

  if (!adminConfigured) {
    throw new Error(
      "Supabase n'est pas configuré côté serveur. Renseignez NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY et SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
