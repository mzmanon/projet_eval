export interface ChampagneLocation {
  id: string;
  village: string;
  area: string;
  description: string;
  lat: number;
  lng: number;
  champagneSlugs: string[];
}

export const CHAMPAGNE_LOCATIONS: ChampagneLocation[] = [
  {
    id: "reims",
    village: "Reims",
    area: "Montagne de Reims",
    description:
      "Capitale historique de la Champagne, où les grandes maisons vieillissent leurs cuvées dans les crayères gallo-romaines.",
    lat: 49.2583,
    lng: 4.0317,
    champagneSlugs: [
      "ruinart-blanc-de-blancs",
      "taittinger-brut-reserve",
      "veuve-clicquot-rich",
      "veuve-clicquot-yellow-label",
      "veuve-clicquot-vintage-rose",
    ],
  },
  {
    id: "epernay",
    village: "Épernay",
    area: "Vallée de la Marne",
    description:
      "Ville de grandes maisons champenoises, dont Moët & Chandon et Perrier-Jouët.",
    lat: 49.0438,
    lng: 3.9598,
    champagneSlugs: [
      "moet-et-chandon-ice-imperial",
      "moet-et-chandon-brut-imperial",
      "perrier-jouet-grand-brut",
    ],
  },
  {
    id: "tours-sur-marne",
    village: "Tours-sur-Marne",
    area: "Montagne de Reims",
    description:
      "Village où la Maison Laurent-Perrier est installée depuis 1812.",
    lat: 49.0544,
    lng: 4.1206,
    champagneSlugs: ["laurent-perrier-cuvee-rose"],
  },
  {
    id: "chouilly",
    village: "Chouilly",
    area: "Côte des Blancs",
    description:
      "Au cœur de la Côte des Blancs, Chouilly accueille la Maison Nicolas Feuillatte.",
    lat: 49.0239,
    lng: 4.0178,
    champagneSlugs: ["nicolas-feuillatte-reserve-exclusive-brut"],
  },
  {
    id: "hautvillers",
    village: "Hautvillers",
    area: "Montagne de Reims",
    description:
      "Village de l'abbaye bénédictine associé à l'histoire de l'assemblage champenois.",
    lat: 49.0833,
    lng: 3.9333,
    champagneSlugs: [],
  },
  {
    id: "ay",
    village: "Aÿ",
    area: "Vallée de la Marne",
    description:
      "Grand cru historique de la Vallée de la Marne, réputé pour ses pinots noirs de grande garde.",
    lat: 49.05,
    lng: 4.0,
    champagneSlugs: [],
  },
  {
    id: "mareuil-sur-ay",
    village: "Mareuil-sur-Aÿ",
    area: "Vallée de la Marne",
    description:
      "Coteau de la Vallée de la Marne aux sols propices aux pinots champenois.",
    lat: 49.05,
    lng: 4.0333,
    champagneSlugs: [],
  },
  {
    id: "le-mesnil-sur-oger",
    village: "Le Mesnil-sur-Oger",
    area: "Côte des Blancs",
    description:
      "Grand cru de la Côte des Blancs, réputé pour ses chardonnays sur sol calcaire.",
    lat: 48.95,
    lng: 3.9833,
    champagneSlugs: [],
  },
];
