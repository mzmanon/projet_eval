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
      "krug-grande-cuvee-171eme-edition",
      "louis-roederer-cristal-2015",
      "ruinart-blanc-de-blancs",
      "taittinger-comtes-de-champagne-blanc-de-blancs-2012",
    ],
  },
  {
    id: "hautvillers",
    village: "Hautvillers",
    area: "Montagne de Reims",
    description:
      "Village de l'abbaye bénédictine où Dom Pérignon a posé les fondations de l'assemblage champenois.",
    lat: 49.0833,
    lng: 3.9333,
    champagneSlugs: ["dom-perignon-vintage-2013"],
  },
  {
    id: "ay",
    village: "Aÿ",
    area: "Vallée de la Marne",
    description:
      "Grand cru historique de la Vallée de la Marne, réputé pour ses pinots noirs de grande garde.",
    lat: 49.05,
    lng: 4.0,
    champagneSlugs: ["bollinger-la-grande-annee-2014"],
  },
  {
    id: "mareuil-sur-ay",
    village: "Mareuil-sur-Aÿ",
    area: "Vallée de la Marne",
    description:
      "Coteau de la Vallée de la Marne où la maison Billecart-Salmon cultive son style de fraîcheur.",
    lat: 49.05,
    lng: 4.0333,
    champagneSlugs: ["billecart-salmon-brut-rose"],
  },
  {
    id: "le-mesnil-sur-oger",
    village: "Le Mesnil-sur-Oger",
    area: "Côte des Blancs",
    description:
      "Grand cru mythique de la Côte des Blancs, porté par un chardonnay calcaire d'une tension rare.",
    lat: 48.95,
    lng: 3.9833,
    champagneSlugs: ["salon-cuvee-s-le-mesnil-blanc-de-blancs-2012"],
  },
];
