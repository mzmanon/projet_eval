import ChampagnesCatalog from "@/components/product/ChampagnesCatalog";
import { getProductsFromDatabase } from "@/lib/data/productsRepository";

export default async function ChampagnesCatalogPage() {
  const champagnes = await getProductsFromDatabase();
  return <ChampagnesCatalog champagnes={champagnes} />;
}
