import type { ProductReview } from "@/types/champagne";

/**
 * Avis clients de démonstration, rattachés aux cuvées de la collection.
 * Les nouveaux avis et réponses sont conservés côté navigateur (localStorage).
 */
export const SEED_REVIEWS: ProductReview[] = [
  /* ------------------------------------------------------------------ */
  /* Dom Pérignon Vintage 2013                                          */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-dom-perignon-2013-1",
    champagneId: "dom-perignon-2013",
    author: "Camille Bertrand",
    rating: 5,
    title: "Une précision minérale rare",
    message:
      "Ouvert une heure avant le service, ce 2013 a livré une tension incroyable. La mousse est d'une finesse presque irréelle et la finale saline persiste longuement. Un très grand moment de dégustation.",
    createdAt: "2026-09-18T19:30:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-dom-perignon-2013-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci pour ce retour si précis, Camille. Le 2013 gagne effectivement à être ouvert en amont : une heure de carafe douce révèle toute sa craie.",
        createdAt: "2026-09-19T09:12:00.000Z",
      },
      {
        id: "rep-dom-perignon-2013-1-2",
        author: "Antoine de Vigny",
        message:
          "Je confirme, dans un verre tulipe large c'est encore plus expressif. Belle dégustation !",
        createdAt: "2026-09-20T18:45:00.000Z",
      },
    ],
  },
  {
    id: "rev-dom-perignon-2013-2",
    champagneId: "dom-perignon-2013",
    author: "Élodie Roussel",
    rating: 5,
    title: "Le 2013 en pleine lumière",
    message:
      "Accord parfait avec un turbot rôti au beurre noisette. Les notes de mirabelle et d'eucalyptus s'expriment avec une netteté remarquable, sans jamais masquer la minéralité.",
    createdAt: "2026-08-02T20:05:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-dom-perignon-2013-2-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Un accord de toute beauté. Le gras du turbot sublime la tension du millésime : merci de partager cette expérience avec la communauté.",
        createdAt: "2026-08-03T10:20:00.000Z",
      },
    ],
  },
  {
    id: "rev-dom-perignon-2013-3",
    champagneId: "dom-perignon-2013",
    author: "Marc Delaunay",
    rating: 4,
    title: "Grand vin, à laisser respirer",
    message:
      "Premier verre un peu fermé, puis tout se déploie après trente minutes. Un champagne de patience qui récompense largement l'attente, même si j'aurais aimé un peu plus de générosité immédiate.",
    createdAt: "2026-06-27T18:40:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-dom-perignon-2013-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Marc. Ce millésime est encore dans sa phase de retenue : un léger passage en carafe ou un service à 12 °C lui permet de s'ouvrir plus vite.",
        createdAt: "2026-06-28T11:05:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Krug Grande Cuvée 171ème Édition                                   */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-krug-171-1",
    champagneId: "krug-grande-cuvee-171",
    author: "Antoine de Vigny",
    rating: 5,
    title: "La générosité Krug",
    message:
      "Brioche tiède, noisette torréfiée et une texture presque crémeuse. Cette 171ème édition est d'une ampleur folle tout en gardant une vraie tension. Le champagne que l'on garde pour les grandes occasions.",
    createdAt: "2026-09-30T21:15:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-krug-171-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Antoine. Les 131 vins de réserve donnent précisément cette profondeur unique. À déguster idéalement autour de 11 °C pour préserver la fraîcheur.",
        createdAt: "2026-10-01T08:55:00.000Z",
      },
    ],
  },
  {
    id: "rev-krug-171-2",
    champagneId: "krug-grande-cuvee-171",
    author: "Sophie Lambert",
    rating: 5,
    title: "Un assemblage envoûtant",
    message:
      "Servi avec un vieux Comté affiné 36 mois, c'est une révélation. Les notes de miel d'acacia et de gingembre confit répondent parfaitement aux accents lactiques du fromage. Une bouteille qui crée l'événement.",
    createdAt: "2026-07-14T19:50:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-krug-171-2-1",
        author: "Hugo Marchand",
        message:
          "Exactement mon accord préféré ! J'ajoute parfois quelques amandes fraîches, cela prolonge la finale de façon étonnante.",
        createdAt: "2026-07-16T12:30:00.000Z",
      },
    ],
  },
  {
    id: "rev-krug-171-3",
    champagneId: "krug-grande-cuvee-171",
    author: "Hugo Marchand",
    rating: 4,
    title: "Puissant, presque gastronomique",
    message:
      "Un champagne qui a besoin de table : seul à l'apéritif, il peut sembler intense. Avec un jambon Jabugo, l'équilibre est parfait. Je conseille de le carafer quelques minutes.",
    createdAt: "2026-05-19T20:25:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-krug-171-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Très juste, Hugo. Krug est un vin de gastronomie avant tout. Merci pour cette recommandation de carafage mesuré.",
        createdAt: "2026-05-20T09:40:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Louis Roederer Cristal 2015                                        */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-cristal-2015-1",
    champagneId: "louis-roederer-cristal-2015",
    author: "Isabelle Nadeau",
    rating: 5,
    title: "La droiture du cristal",
    message:
      "Un nez de cédrat et de craie humide d'une pureté saisissante. En bouche, la densité est remarquable mais jamais lourde. Avec un homard rôti, c'est simplement parfait.",
    createdAt: "2026-09-05T20:10:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-cristal-2015-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Isabelle. Le travail biodynamique du domaine donne cette énergie si particulière au 2015. Un flacon à savourer sans se presser.",
        createdAt: "2026-09-06T10:15:00.000Z",
      },
    ],
  },
  {
    id: "rev-cristal-2015-2",
    champagneId: "louis-roederer-cristal-2015",
    author: "Jean-Baptiste Clément",
    rating: 5,
    title: "Biodynamie et tension",
    message:
      "Un millésime solaire qui conserve une fraîcheur étonnante. La colonne crayeuse traverse tout le vin et la finale revient sur des notes d'agrumes confits. Superbe bouteille de garde.",
    createdAt: "2026-08-21T18:35:00.000Z",
    verified: true,
    replies: [],
  },
  {
    id: "rev-cristal-2015-3",
    champagneId: "louis-roederer-cristal-2015",
    author: "Léa Perrin",
    rating: 4,
    title: "Superbe mais exigeant",
    message:
      "Très belle expression, mais encore un peu réservée aujourd'hui. Je lui donnerais volontiers deux ou trois années supplémentaires pour gagner en tendreté. Un vin d'une précision rare.",
    createdAt: "2026-04-10T19:20:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-cristal-2015-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Votre analyse est juste, Léa : Cristal 2015 a une longue vie devant lui. Si vous l'ouvrez aujourd'hui, laissez-le respirer une heure à 11 °C.",
        createdAt: "2026-04-11T09:10:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Ruinart Blanc de Blancs                                            */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-ruinart-bdb-1",
    champagneId: "ruinart-blanc-de-blancs",
    author: "Claire Moreau",
    rating: 5,
    title: "Fraîcheur et élégance",
    message:
      "Pamplemousse rose, menthe poivrée et une texture soyeuse. C'est le champagne que j'ouvre sans hésiter à l'apéritif : accessible, raffiné et toujours consensuel.",
    createdAt: "2026-09-12T18:00:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-ruinart-bdb-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Claire. Sa silhouette historique et sa fraîcheur en font effectivement un compagnon idéal pour les débuts de soirée.",
        createdAt: "2026-09-13T09:25:00.000Z",
      },
    ],
  },
  {
    id: "rev-ruinart-bdb-2",
    champagneId: "ruinart-blanc-de-blancs",
    author: "Thomas Girard",
    rating: 4,
    title: "Un blanc de blancs accessible",
    message:
      "Belle finesse de bulles et beaucoup de droiture. Un peu moins profond que certains grands crus de la Côte des Blancs, mais le rapport plaisir-prix reste excellent.",
    createdAt: "2026-07-30T20:45:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-ruinart-bdb-2-1",
        author: "Nathalie Fontaine",
        message:
          "D'accord avec vous sur la finesse. Pour gagner en ampleur, essayez-le dans un verre à vin plutôt qu'une flûte : la différence est nette.",
        createdAt: "2026-08-01T17:20:00.000Z",
      },
    ],
  },
  {
    id: "rev-ruinart-bdb-3",
    champagneId: "ruinart-blanc-de-blancs",
    author: "Nathalie Fontaine",
    rating: 5,
    title: "Parfait à l'apéritif",
    message:
      "Servi avec des gougères au Comté, tout le monde a été conquis. Sa vivacité saline nettoie le palais et prépare merveilleusement au repas.",
    createdAt: "2026-06-08T19:10:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-ruinart-bdb-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Un accord simple et redoutablement efficace ! Merci Nathalie, ravi que ce flacon ait accompagné un si bon moment.",
        createdAt: "2026-06-09T08:50:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Taittinger Comtes de Champagne 2012                                */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-taittinger-2012-1",
    champagneId: "taittinger-comtes-de-champagne-2012",
    author: "Paul Hébert",
    rating: 5,
    title: "Une ode à la Côte des Blancs",
    message:
      "Après dix ans de caves, ce Comtes 2012 est dans une phase splendide. La brioche fumée, la mandarine et la tension saline se répondent avec une grande classe. Un de mes plus beaux souvenirs de l'année.",
    createdAt: "2026-09-22T21:00:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-taittinger-2012-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Paul. Les cinq Grands Crus de la Côte des Blancs donnent effectivement une persistance minérale exceptionnelle à ce millésime.",
        createdAt: "2026-09-23T10:05:00.000Z",
      },
    ],
  },
  {
    id: "rev-taittinger-2012-2",
    champagneId: "taittinger-comtes-de-champagne-2012",
    author: "Margaux Vasseur",
    rating: 5,
    title: "Dix ans de patine",
    message:
      "La texture est crémeuse, presque veloutée, tout en conservant une énergie folle. La finale s'étire sur des notes de fleurs blanches et de craie. Superbe avec une poularde aux morilles.",
    createdAt: "2026-08-16T20:30:00.000Z",
    verified: true,
    replies: [],
  },
  {
    id: "rev-taittinger-2012-3",
    champagneId: "taittinger-comtes-de-champagne-2012",
    author: "Olivier Tremblay",
    rating: 4,
    title: "Très beau, encore jeune",
    message:
      "Un grand champagne qui mérite encore un peu de repos. Ouvert deux heures avant le repas, il a gagné en ampleur mais reste sur une réserve élégante. À revoir dans deux ans.",
    createdAt: "2026-05-02T19:55:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-taittinger-2012-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Olivier. Votre patience sera récompensée : ce 2012 possède une belle réserve de fruits et de minéralité pour évoluer encore.",
        createdAt: "2026-05-03T09:35:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Bollinger La Grande Année 2014                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-bollinger-2014-1",
    champagneId: "bollinger-la-grande-annee-2014",
    author: "Franck Bastien",
    rating: 5,
    title: "La puissance du Pinot Noir",
    message:
      "Cerise burlat, cannelle et noisette grillée : un vrai champagne de table. Avec un canard aux griottes, l'accord est bouleversant. La finale sur l'amande amère est magnifique.",
    createdAt: "2026-09-08T20:40:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-bollinger-2014-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Franck. La vinification sous bois et le long vieillissement sous liège donnent justement cette texture vineuse si reconnaissable.",
        createdAt: "2026-09-09T09:15:00.000Z",
      },
    ],
  },
  {
    id: "rev-bollinger-2014-2",
    champagneId: "bollinger-la-grande-annee-2014",
    author: "Amélie Dufour",
    rating: 5,
    title: "Boisé noble et longueur",
    message:
      "Le boisé est parfaitement intégré, sans excès. Beaucoup de matière, de la fraîcheur et une longueur impressionnante. Un champagne de grande gastronomie, à servir dans un grand verre.",
    createdAt: "2026-07-11T19:25:00.000Z",
    verified: true,
    replies: [],
  },
  {
    id: "rev-bollinger-2014-3",
    champagneId: "bollinger-la-grande-annee-2014",
    author: "Sébastien Roy",
    rating: 4,
    title: "Un champagne de table",
    message:
      "Moins aérien que certains blancs de blancs, mais quelle présence ! Je le réserverais aux repas de fête plutôt qu'à l'apéritif. Une très belle bouteille pour les amateurs de vins amples.",
    createdAt: "2026-03-26T20:15:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-bollinger-2014-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Tout à fait, Sébastien : La Grande Année est un vin de gastronomie. Merci d'avoir partagé votre expérience de dégustation.",
        createdAt: "2026-03-27T10:00:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Billecart-Salmon Brut Rosé                                         */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-billecart-rose-1",
    champagneId: "billecart-salmon-brut-rose",
    author: "Chloé Arnaud",
    rating: 5,
    title: "Le rosé de nos plus belles tables",
    message:
      "Une robe rose pâle magnifique et un nez de fraises des bois. Servi avec un saumon fumé minute, c'est d'une élégance rare. Mon rosé préféré, tout simplement.",
    createdAt: "2026-09-25T19:45:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-billecart-rose-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Chloé. La petite part de vin rouge de Mareuil-sur-Aÿ signe effectivement ce fruité si délicat. Un grand classique de la maison.",
        createdAt: "2026-09-26T09:30:00.000Z",
      },
    ],
  },
  {
    id: "rev-billecart-rose-2",
    champagneId: "billecart-salmon-brut-rose",
    author: "Vincent Lefèvre",
    rating: 4,
    title: "Délicat et désaltérant",
    message:
      "Très digeste, avec une bulle fine et un fruité frais. Je lui trouve peut-être une finale un peu courte face aux grands rosés de garde, mais pour un apéritif estival il est imbattable.",
    createdAt: "2026-08-05T18:20:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-billecart-rose-2-1",
        author: "Emma Sanchez",
        message:
          "Je le trouve aussi très accessible. Testez-le avec une tartelette aux framboises, la finale fruitée revient d'un coup !",
        createdAt: "2026-08-06T14:10:00.000Z",
      },
    ],
  },
  {
    id: "rev-billecart-rose-3",
    champagneId: "billecart-salmon-brut-rose",
    author: "Emma Sanchez",
    rating: 5,
    title: "Fraises des bois et dentelle",
    message:
      "Parfait pour un brunch entre amis. La texture est délicate, presque aérienne, et le fruit reste frais sans lourdeur. Tout le monde en a redemandé !",
    createdAt: "2026-06-18T12:40:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-billecart-rose-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Emma ! C'est exactement l'esprit de ce rosé : la légèreté d'un grand champagne et la générosité d'un fruité sincère.",
        createdAt: "2026-06-19T09:00:00.000Z",
      },
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Salon Cuvée 'S' Le Mesnil 2012                                     */
  /* ------------------------------------------------------------------ */
  {
    id: "rev-salon-2012-1",
    champagneId: "salon-le-mesnil-2012",
    author: "Alexandre Pichon",
    rating: 5,
    title: "Le mythe, sans exagération",
    message:
      "Craie concassée, fleur de sel et une finale qui semble ne jamais vouloir s'arrêter. Ce Salon 2012 est d'une précision presque chirurgicale. Une expérience à part, à vivre au moins une fois.",
    createdAt: "2026-09-28T20:50:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-salon-2012-1-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Alexandre. Le Mesnil-sur-Oger exprime ici toute sa droiture. Un flacon rare, à servir autour de 12 °C dans un grand verre de dégustation.",
        createdAt: "2026-09-29T09:20:00.000Z",
      },
    ],
  },
  {
    id: "rev-salon-2012-2",
    champagneId: "salon-le-mesnil-2012",
    author: "Béatrice Colin",
    rating: 5,
    title: "Une expérience contemplative",
    message:
      "Nous l'avons ouvert sans accompagnement, dans le silence, pour prendre le temps. Chaque gorgée révèle une nouvelle facette minérale. Rare et intimidant, mais quelle émotion.",
    createdAt: "2026-07-19T21:10:00.000Z",
    verified: true,
    replies: [],
  },
  {
    id: "rev-salon-2012-3",
    champagneId: "salon-le-mesnil-2012",
    author: "Nicolas Joly",
    rating: 4,
    title: "Rare et intimidant",
    message:
      "Immense concentration et une énergie folle, mais il faut accepter de ne pas tout comprendre au premier verre. Un champagne de contemplation, pas de soirée décontractée.",
    createdAt: "2026-04-30T19:35:00.000Z",
    verified: true,
    replies: [
      {
        id: "rep-salon-2012-3-1",
        author: "LA CAVE",
        isHouse: true,
        message:
          "Merci Nicolas. Salon demande effectivement du temps et de l'attention : c'est un vin qui se mérite et se découvre par petites touches.",
        createdAt: "2026-05-01T10:40:00.000Z",
      },
    ],
  },
];

export function getSeedReviews(champagneId: string): ProductReview[] {
  return SEED_REVIEWS.filter((review) => review.champagneId === champagneId);
}
