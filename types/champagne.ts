export type Dosage =
  | "Brut Nature"
  | "Extra-Brut"
  | "Brut"
  | "Blanc de Blancs"
  | "Blanc de Noirs"
  | "Rosé";

export type Format = "Bouteille (75cl)" | "Magnum (1.5L)" | "Jéroboam (3L)";

export interface TastingNotes {
  robe: string; // La couleur et l'effervescence
  nez: string;  // Les arômes primaires et complexes
  bouche: string; // L'attaque, la minéralité et la longueur
  accords: string[]; // Accords gastronomiques
  service: string; // Température idéale et verres conseillés
}

export interface Champagne {
  id: string;
  slug: string;
  name: string;
  house: string;
  vintage: string | "Non Millésimé";
  dosage: Dosage;
  format: Format;
  price: number;
  stock: number;
  alcoholByVolume: string; // e.g. "12.5% vol."
  terroir: string; // e.g. "Côte des Blancs, Grand Cru"
  grapes: string; // e.g. "100% Chardonnay"
  cellarAging: string; // e.g. "6 ans sur lies"
  description: string;
  tastingNotes: TastingNotes;
  imageUrl: string;
  isFeatured?: boolean;
  isRare?: boolean;
  score?: number; // Note Bettane & Desseauve ou Parker / Revue du Vin de France (ex: 97)
}

export interface ReviewReply {
  id: string;
  author: string;
  message: string;
  createdAt: string;
  isHouse?: boolean;
}

export interface ProductReview {
  id: string;
  champagneId: string;
  author: string;
  rating: number; // Note du client sur 5 étoiles
  title?: string;
  message: string;
  createdAt: string;
  verified?: boolean;
  replies: ReviewReply[];
}

export interface CartItem {
  champagne: Champagne;
  quantity: number;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  items: {
    champagneId: string;
    name: string;
    house: string;
    vintage: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }[];
  totalAmount: number;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered";
  createdAt: string;
}

export interface AdminKPIs {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  bottlesSold: number;
  lowStockCount: number;
}
