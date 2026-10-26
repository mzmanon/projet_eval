import { Champagne } from "@/types/champagne";

export const CHAMPAGNES: Champagne[] = [
  {
    id: "dom-perignon-2013",
    slug: "dom-perignon-vintage-2013",
    name: "Dom Pérignon Vintage 2013",
    house: "Dom Pérignon",
    vintage: "2013",
    dosage: "Brut",
    format: "Bouteille (75cl)",
    price: 245,
    stock: 14,
    alcoholByVolume: "12.5% vol.",
    terroir: "Hautvillers, Ay, Bouzy, Cramant, Mesnil-sur-Oger (Grands Crus & Premier Cru historique)",
    grapes: "Assemblage précis de Pinot Noir (51%) et Chardonnay (49%)",
    cellarAging: "Près de 10 années de maturation lente dans les crayères d'Épernay",
    description:
      "Né d'une année tardive rappelant les vendanges glorieuses du passé, Dom Pérignon 2013 révèle une clarté absolue et une matière sculptée avec rigueur. Un millésime d'équilibre majestueux.",
    tastingNotes: {
      robe: "Dorée et lumineuse, animée d'un cordon de bulles infinitésimales et vives.",
      nez: "Bouquet d'agrumes confits, de mirabelle mûre, rehaussé de fleurs blanches fraîches et d'une pointe d'eucalyptus délicatement toastée.",
      bouche: "L'attaque est soyeuse et enveloppante, relayée par une trame minérale saline d'une précision exemplaire. Finale interminable aux accents iodés.",
      accords: [
        "Caviar Osciètre Impérial",
        "Turbot sauvage rôti au beurre noisette",
        "Langoustines de casier juste raidies au thym citron",
      ],
      service: "Servir entre 10°C et 12°C dans un verre tulipe à vin blanc ample.",
    },
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Dom_P%C3%A9rignon_Champagne_2012.jpg?width=800",
    isFeatured: true,
    isRare: false,
    score: 97,
  },
  {
    id: "krug-grande-cuvee-171",
    slug: "krug-grande-cuvee-171eme-edition",
    name: "Krug Grande Cuvée 171ème Édition",
    house: "Maison Krug",
    vintage: "Non Millésimé",
    dosage: "Brut",
    format: "Bouteille (75cl)",
    price: 275,
    stock: 9,
    alcoholByVolume: "12.0% vol.",
    terroir: "Mosaïque de plus de 25 crus d'exception en Champagne",
    grapes: "45% Pinot Noir, 37% Chardonnay, 18% Meunier (131 vins de réserve)",
    cellarAging: "Plus de 7 années de vieillissement sur lies dans les caves de Reims",
    description:
      "L'expression la plus généreuse du champagne. Recréée chaque année par la Maison Krug depuis 1843, cette 171ème édition est composée autour de la vendange 2015 enrichie de vins de réserve issus de 12 millésimes différents.",
    tastingNotes: {
      robe: "Or profond et scintillant, souligné par une effervescence d'une finesse incomparable.",
      nez: "Arômes de noisette torréfiée, de pâte d'amande, de brioche tiède et de compote de pommes dorées au miel d'acacia.",
      bouche: "Explosion de saveurs riches et ciselées : agrumes mûrs, pâte de coing, gingembre confit et minéralité vibrante.",
      accords: [
        "Jambon Jabugo Bellota 100% Pata Negra",
        "Noix de Saint-Jacques poêlées à la truffe blanche",
        "Vieux Comté affiné 36 mois",
      ],
      service: "Servir à 11°C dans un grand verre de dégustation.",
    },
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Champagne_Krug%2C_Penfolds_and_Bimbadgen_wines_%28Krug%29.jpg?width=800",
    isFeatured: true,
    isRare: true,
    score: 98,
  },
  {
    id: "louis-roederer-cristal-2015",
    slug: "louis-roederer-cristal-2015",
    name: "Louis Roederer Cristal 2015",
    house: "Louis Roederer",
    vintage: "2015",
    dosage: "Extra-Brut",
    format: "Bouteille (75cl)",
    price: 330,
    stock: 6,
    alcoholByVolume: "12.0% vol.",
    terroir: "100% Grands Crus : Verzenay, Verzy, Beaumont, Ay, Avize, Cramant et Le Mesnil-sur-Oger",
    grapes: "60% Pinot Noir, 40% Chardonnay (vignes cultivées en biodynamie)",
    cellarAging: "6 années de garde sur lattes complétées par 8 mois de repos après dégorgement",
    description:
      "Créée en 1876 pour le Tsar Alexandre II dans son flacon de cristal à fond plat légendaire. Cristal 2015 est un vin d'orfèvre, alliance suprême de pureté calcaire, d'amplitude charnelle et de tension infinie.",
    tastingNotes: {
      robe: "Jaune paille aux reflets ambrés chaleureux, éclat cristallin fascinant.",
      nez: "Notes pures de cédrat, de craie humide, de fleurs de tilleul et de fève de cacao subtilement vanillée.",
      bouche: "Toucher tactile soyeux d'une densité rare, traversé par une colonne vertébrale crayeuse éclatante et vivifiante.",
      accords: [
        "Homard bleu breton rôti et réduction de corail",
        "Tartare de veau aux huîtres creuses d'Utah Beach",
        "Sole de petit bateau meunière aux zestes de bergamote",
      ],
      service: "Servir à 10°C - 11°C.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isRare: true,
    score: 99,
  },
  {
    id: "ruinart-blanc-de-blancs",
    slug: "ruinart-blanc-de-blancs",
    name: "Ruinart Blanc de Blancs",
    house: "Maison Ruinart",
    vintage: "Non Millésimé",
    dosage: "Brut",
    format: "Bouteille (75cl)",
    price: 98,
    stock: 22,
    alcoholByVolume: "12.5% vol.",
    terroir: "Côte des Blancs et Montagne de Reims (Premiers et Grands Crus)",
    grapes: "100% Chardonnay issu de terroirs crayeux",
    cellarAging: "3 années de maturation dans les célèbres crayères médiévales de Reims",
    description:
      "L'emblème du goût Ruinart. Issu exclusivement du cépage Chardonnay, ce flacon d'une silhouette galbée historique séduit par sa fraîcheur éclatante, sa rondeur fruitée et son élégance intemporelle.",
    tastingNotes: {
      robe: "Jaune doré pâle aux reflets d'or blanc, effervescence lumineuse et persistante.",
      nez: "Arômes intenses d'agrumes frais (pamplemousse rose, citron jaune), de menthe poivrée et de pêche blanche.",
      bouche: "Attaque franche et souple, texture harmonieuse rehaussée d'une vivacité saline très fraîche.",
      accords: [
        "Carpaccio de Saint-Jacques aux baies roses",
        "Sashimi de bar de ligne et yuzu",
        "Gougères au Comté jeune",
      ],
      service: "Servir frais entre 8°C et 10°C.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isRare: false,
    score: 94,
  },
  {
    id: "taittinger-comtes-de-champagne-2012",
    slug: "taittinger-comtes-de-champagne-blanc-de-blancs-2012",
    name: "Taittinger Comtes de Champagne Blanc de Blancs 2012",
    house: "Taittinger",
    vintage: "2012",
    dosage: "Brut",
    format: "Bouteille (75cl)",
    price: 210,
    stock: 8,
    alcoholByVolume: "12.5% vol.",
    terroir: "100% Grands Crus de la Côte des Blancs (Avize, Chouilly, Cramant, Mesnil-sur-Oger, Oger)",
    grapes: "100% Chardonnay de première presse, 5% vinifié en fûts de chêne neufs",
    cellarAging: "10 années de repos dans les cryptes de l'ancienne Abbaye Saint-Nicaise à Reims",
    description:
      "La cuvée de prestige absolue de la Maison Taittinger. Composée uniquement des cinq villages mythiques classés Grand Cru de la Côte des Blancs, Comtes de Champagne 2012 est une ode à la pureté minérale et au raffinement absolu.",
    tastingNotes: {
      robe: "Or brillant aux reflets argentés subtils, bulles d'une finesse aérienne.",
      nez: "Notes florales délicates, aubépine, écorces de mandarine, amandes fraîches et touche de brioche fumée.",
      bouche: "Ampleur crémeuse et tension saline vibrante. La finale se déploie avec une persistance minérale exceptionnelle.",
      accords: [
        "Ris de veau caramélisés et mousseline de céleri",
        "Oursins de Méditerranée en coque",
        "Poularde de Bresse aux morilles",
      ],
      service: "Servir à 11°C dans une flûte large ou un verre à vin de dégustation.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1547595628-c61a29f496f0?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isRare: true,
    score: 97,
  },
  {
    id: "bollinger-la-grande-annee-2014",
    slug: "bollinger-la-grande-annee-2014",
    name: "Bollinger La Grande Année 2014",
    house: "Champagne Bollinger",
    vintage: "2014",
    dosage: "Extra-Brut",
    format: "Bouteille (75cl)",
    price: 175,
    stock: 11,
    alcoholByVolume: "12.0% vol.",
    terroir: "Aÿ et Verzenay pour les Pinots Noirs, Chouilly et Oiry pour les Chardonnays (86% Grands Crus)",
    grapes: "61% Pinot Noir, 39% Chardonnay, vinifié entièrement sous bois en petits fûts",
    cellarAging: "Vieillissement sous bouchon de liège pendant plus de 8 ans dans les caves d'Aÿ",
    description:
      "Témoin du savoir-faire artisanal inimitable de la Maison Bollinger. Vinifiée exclusivement en fûts de chêne anciens et remuée à la main, La Grande Année 2014 allie puissance vineuse, complexité fumée et finesse minérale.",
    tastingNotes: {
      robe: "Dorée aux nuances cuivrées chatoyantes, reflet de la prédominance du Pinot Noir.",
      nez: "Parfums de cerise burlat, d'abricot sec, de cannelle, de noisette grillée et de pain d'épices.",
      bouche: "Texture dense et vineuse, tanins soyeux très délicats, finale longue aux amers nobles et notes crayeuses.",
      accords: [
        "Canard colvert rôti aux cerises griottes",
        "Filet de bœuf Wellington",
        "Saint-Marcellin crémeux affiné",
      ],
      service: "Servir entre 10°C et 12°C.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?auto=format&fit=crop&w=800&q=80",
    isFeatured: false,
    isRare: false,
    score: 96,
  },
  {
    id: "billecart-salmon-brut-rose",
    slug: "billecart-salmon-brut-rose",
    name: "Billecart-Salmon Brut Rosé",
    house: "Billecart-Salmon",
    vintage: "Non Millésimé",
    dosage: "Brut",
    format: "Bouteille (75cl)",
    price: 88,
    stock: 18,
    alcoholByVolume: "12.0% vol.",
    terroir: "Vallée de la Marne et Montagne de Reims",
    grapes: "40% Chardonnay, 30% Pinot Noir, 30% Meunier (dont 8% de vin rouge de Mareuil-sur-Aÿ)",
    cellarAging: "36 mois sur lies dans les chais de Mareuil-sur-Aÿ",
    description:
      "La référence historique du champagne rosé dans les plus grandes tables gastronomiques du monde. Une alchimie secrète de vin rouge grand cru et de chardonnays ciselés pour un équilibre fruité d'une élégance rare.",
    tastingNotes: {
      robe: "Rose pâle nacré aux reflets chauds dorés, effervescence en dentelle.",
      nez: "Bouquet subtil de fraises des bois fraîches, de framboise écrasée et de zeste de mandarine.",
      bouche: "Attaque croquante et soyeuse, sensation de fraîcheur aérienne conclue par une finale désaltérante aux notes de petits fruits rouges.",
      accords: [
        "Saumon sauvage fumé minute",
        "Canard laqué aux cinq-épices",
        "Tartelette sablée aux framboises fraîches",
      ],
      service: "Servir à 9°C.",
    },
    imageUrl:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Billecart-Salmon_Brut_Rose_Champagne_with_other_Champagnes.jpg?width=800",
    isFeatured: false,
    isRare: false,
    score: 95,
  },
  {
    id: "salon-le-mesnil-2012",
    slug: "salon-cuvee-s-le-mesnil-blanc-de-blancs-2012",
    name: "Salon Cuvée 'S' Le Mesnil Blanc de Blancs 2012",
    house: "Champagne Salon",
    vintage: "2012",
    dosage: "Extra-Brut",
    format: "Bouteille (75cl)",
    price: 1150,
    stock: 2,
    alcoholByVolume: "12.0% vol.",
    terroir: "Le Mesnil-sur-Oger, Grand Cru (terroir calcaire mythique de la Côte des Blancs)",
    grapes: "100% Chardonnay d'une seule parcelle historique et d'un seul millésime d'exception",
    cellarAging: "Plus de 11 années de repos dans l'obscurité fraîche des caves de Salon",
    description:
      "Le mythe absolu de la Champagne. Un seul cépage (Chardonnay), un seul terroir (Le Mesnil-sur-Oger), une seule année d'exception (seulement 44 millésimes produits en plus d'un siècle). Un chef-d'œuvre de rareté et de pureté.",
    tastingNotes: {
      robe: "Or pâle chatoyant de reflets vert opale, cordon d'une finesse microscopique.",
      nez: "Cœur minéral pur de craie concassée, fleur de sel, zeste d'agrumes nobles, noisette fraîche et verveine.",
      bouche: "Précision chirurgicale. Une droiture et une énergie phénoménales qui vibrent sur la langue pendant plus d'une minute.",
      accords: [
        "Caviar Beluga Royal",
        "Carpaccio de langouste royale à l'huile d'olive de première pression",
        "Dégustation contemplative pure",
      ],
      service: "Servir entre 11°C et 13°C dans un grand verre œnologique de dégustation.",
    },
    imageUrl:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isRare: true,
    score: 100,
  },
];

export function getChampagneBySlug(slug: string): Champagne | undefined {
  return CHAMPAGNES.find((c) => c.slug === slug);
}

export function getFeaturedChampagnes(): Champagne[] {
  return CHAMPAGNES.filter((c) => c.isFeatured);
}

export function getChampagnesByHouse(house: string): Champagne[] {
  return CHAMPAGNES.filter((c) => c.house.toLowerCase() === house.toLowerCase());
}
