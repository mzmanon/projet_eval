import type { Champagne, Dosage } from "@/types/champagne";

type ProductRow = {
  id?: unknown;
  name?: unknown;
  description?: unknown;
  price?: unknown;
  image_url?: unknown;
  stock?: unknown;
  category?: unknown;
  is_active?: unknown;
};

const imageHostAllowlist = new Set([
  "vinnalia.fr",
  "d2i4pzk02r8gti.cloudfront.net",
  "www.perrier-jouet.com",
  "medias.taittinger.com",
  "nicolas-feuillatte.com",
  "www.moet.com",
]);

const fallbackImages: Record<string, string> = {
  "moet & chandon ice imperial":
    "https://www.moet.com/sites/default/files/styles/portrait_bottle/public/2024-10/IMAGE%20PRODUIT%20SANS%20FOND%20-%20Ice%20Imperial-min_0.png?itok=ufPwn4jh",
  "perrier-jouet grand brut":
    "https://www.perrier-jouet.com/sites/default/files/styles/product_bottle_mobile/public/2022-04/Grand%20Brut%20Solar%20Packshot%20RGB%20PNG_0.png?h=11589cda&itok=lMwcVHe7",
  "moet & chandon brut imperial":
    "https://www.moet.com/sites/default/files/styles/portrait_bottle/public/2024-01/Moet-imperial-Bottle.png?itok=n64yqsc0",
  "taittinger brut reserve":
    "https://medias.taittinger.com/files/style/large/brut-reserve-page-produit-696f406be1e26423227700-69e61e96b0b17746371090.jpg.png",
  "nicolas feuillatte reserve exclusive brut":
    "https://nicolas-feuillatte.com/cdn/shop/files/reserve-exclusive-brut-nf-main.png?height=1290&v=1775117718",
};

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown): number | null {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function getImageUrl(name: string, source: string): string {
  const candidates =
    source.match(/https?:\/\/[^\s]*?(?=https?:\/\/|\s|$)/g) ?? [];
  for (const rawCandidate of candidates) {
    const candidate = rawCandidate.replace(/[),.;]+$/, "");
    try {
      const url = new URL(candidate);
      const hasImageExtension = /\.(png|jpe?g|webp|avif)$/i.test(url.pathname);
      if (
        url.protocol === "https:" &&
        hasImageExtension &&
        imageHostAllowlist.has(url.hostname)
      ) {
        if (url.searchParams.get("width") === "800c") {
          url.searchParams.set("width", "800");
        }
        return url.toString();
      }
    } catch {
      // Ignore malformed or concatenated page URLs in the database field.
    }
  }

  return fallbackImages[normalizeName(name)] ?? "";
}

function getHouse(name: string): string {
  const houses = [
    "Moët & Chandon",
    "Veuve Clicquot",
    "Perrier-Jouët",
    "Laurent-Perrier",
    "Nicolas Feuillatte",
    "Taittinger",
    "Ruinart",
  ];
  return houses.find((house) => normalizeName(name).startsWith(normalizeName(house))) ?? "Champagne";
}

function getSlug(name: string): string {
  return normalizeName(name)
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getDosage(category: string): Dosage {
  if (normalizeName(category) === "brut") return "Brut";
  if (normalizeName(category) === "demi-sec") return "Demi-Sec";
  return "Non renseigné";
}

export function mapProductRow(value: unknown): Champagne | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const row = value as ProductRow;
  const id = asString(row.id);
  const name = asString(row.name);
  const price = asNumber(row.price);
  if (!id || !name || price === null) return null;

  const category = asString(row.category);
  const year = name.match(/\b(?:19|20)\d{2}\b/)?.[0];
  const isVintageRosé = normalizeName(category) === "rose millesime";
  const imageUrl = getImageUrl(name, asString(row.image_url));

  return {
    id,
    slug: getSlug(name),
    name,
    house: getHouse(name),
    vintage: year ?? (isVintageRosé ? "Millésime non précisé" : "Non renseigné"),
    dosage: getDosage(category),
    format: "Non renseigné",
    price,
    stock: Math.max(0, Math.trunc(asNumber(row.stock) ?? 0)),
    alcoholByVolume: "Non renseigné",
    terroir: "Non renseigné",
    grapes: "Non renseigné",
    cellarAging: "Non renseigné",
    description: asString(row.description),
    tastingNotes: {
      robe: "Non renseigné",
      nez: "Non renseigné",
      bouche: "Non renseigné",
      accords: [],
      service: "Non renseigné",
    },
    imageUrl,
    category,
    isFeatured: false,
    isRare: false,
  };
}

export function mapProductRows(rows: unknown[]): Champagne[] {
  return rows
    .map(mapProductRow)
    .filter((product): product is Champagne => product !== null);
}
