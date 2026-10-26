import ChampagnesCatalog from "@/components/product/ChampagnesCatalog";
import { getChampagnesFromDatabase } from "@/lib/data/champagnesRepository";

export default async function ChampagnesPage() {
  const champagnes = await getChampagnesFromDatabase();
  return <ChampagnesCatalog champagnes={champagnes} />;
}
