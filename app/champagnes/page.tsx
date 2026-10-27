import ChampagnesCatalog from "@/components/product/ChampagnesCatalog";
import { getProductsFromDatabase } from "@/lib/data/productsRepository";

// La collection doit toujours refléter les articles présents dans Supabase.
export const dynamic = "force-dynamic";

export default async function ChampagnesCatalogPage() {
  const champagnes = await getProductsFromDatabase();
  return <ChampagnesCatalog champagnes={champagnes} />;
}
