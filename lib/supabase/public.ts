import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

let publicClient: SupabaseClient | null = null;

/**
 * Client Supabase sans gestion de session, destiné aux lectures publiques
 * (catalogue, terroirs, fiches produits).
 *
 * Il ne dépend pas des cookies de la requête : le catalogue peut donc être
 * rendu de manière fiable en développement comme en production.
 */
export function createPublicSupabaseClient(): SupabaseClient {
  if (publicClient) return publicClient;

  const { url, anonKey } = getSupabasePublicConfig();

  publicClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          cache: "no-store",
        }),
    },
  });

  return publicClient;
}
