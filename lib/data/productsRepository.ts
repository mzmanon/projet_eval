import "server-only";
import { createPublicSupabaseClient } from "@/lib/supabase/public";
import { mapProductRows } from "@/lib/data/productsMapper";
import type { Champagne } from "@/types/champagne";

export async function getProductsFromDatabase(): Promise<Champagne[]> {
  const supabase = createPublicSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select("id,name,description,price,image_url,stock,category,is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error("Impossible de charger les produits Supabase :", error.message);
    return [];
  }

  return mapProductRows(data ?? []);
}

export async function getProductFromDatabaseBySlug(
  slug: string
): Promise<Champagne | undefined> {
  return (await getProductsFromDatabase()).find((product) => product.slug === slug);
}
