import type { Champagne, Format, TastingNotes, Dosage } from "@/types/champagne";

type Row = Record<string, unknown>;

function asRecord(value: unknown): Row {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Row)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function mapTastingNotes(value: unknown): TastingNotes {
  const notes = asRecord(value);
  return {
    robe: asString(notes.robe),
    nez: asString(notes.nez),
    bouche: asString(notes.bouche),
    accords: Array.isArray(notes.accords)
      ? notes.accords.filter((accord): accord is string => typeof accord === "string")
      : [],
    service: asString(notes.service),
  };
}

export function mapChampagneRow(value: unknown): Champagne | null {
  const row = asRecord(value);
  const id = asString(row.id);
  const slug = asString(row.slug);
  const name = asString(row.name);
  const house = asString(row.house);

  if (!id || !slug || !name || !house) return null;

  const score = row.score == null ? undefined : asNumber(row.score);
  return {
    id,
    slug,
    name,
    house,
    vintage: asString(row.vintage, "Non Millésimé"),
    dosage: asString(row.dosage, "Brut") as Dosage,
    format: asString(row.format, "Bouteille (75cl)") as Format,
    price: asNumber(row.price),
    stock: asNumber(row.stock),
    alcoholByVolume: asString(row.alcohol_by_volume, "12.0% vol."),
    terroir: asString(row.terroir),
    grapes: asString(row.grapes),
    cellarAging: asString(row.cellar_aging),
    description: asString(row.description),
    tastingNotes: mapTastingNotes(row.tasting_notes),
    imageUrl: asString(row.image_url),
    isFeatured: row.is_featured === true,
    isRare: row.is_rare === true,
    score,
  };
}

export function mapChampagneRows(rows: unknown[]): Champagne[] {
  return rows
    .map(mapChampagneRow)
    .filter((champagne): champagne is Champagne => champagne !== null);
}
