import "server-only";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { mapChampagneRows } from "@/lib/data/champagnesMapper";
import type { Champagne } from "@/types/champagne";

export async function getChampagnesFromDatabase(): Promise<Champagne[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("champagnes")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Impossible de charger le catalogue Supabase :", error.message);
    return [];
  }

  return mapChampagneRows(data ?? []);
}

export async function getChampagneFromDatabaseBySlug(
  slug: string
): Promise<Champagne | undefined> {
  const champagnes = await getChampagnesFromDatabase();
  return champagnes.find((champagne) => champagne.slug === slug);
}
