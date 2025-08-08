const produits = [

  {
    id: 2,
    nom: 'crop top orange',
    categorie: 'Blouses',
    prix: 99.99,
    image: 'sA8yYui',
    images: [
      'sA8yYui',
      'bbqurwk'
    ],
    description: 'Blouse élégante et confortable, parfaite pour toutes les occasions.',
    matiere: 'Viscose',
    couleur: 'Blanc cassé',
    tailles: [
      { taille: 'XS', stock: 3 },
      { taille: 'S', stock: 7 },
      { taille: 'M', stock: 4 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 3,
    nom: 'Jean taille haute',
    categorie: 'Pantalons',
    prix: 10.96,
    image: '3LYnlYV',
    images: [
      '3LYnlYV'
    ],
    description: 'Pantalon moderne et stylé, pour un look tendance.',
    matiere: 'Denim',
    couleur: 'Bleu clair',
    tailles: [
      { taille: 'S', stock: 2 },
      { taille: 'M', stock: 6 },
      { taille: 'L', stock: 4 },
      { taille: 'XL', stock: 1 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 4,
    nom: 'Veste en jean',
    categorie: 'Vestes',
    prix: 10.96,
    image: 'd2pA79w',
    images: [
      'd2pA79w'
    ],
    description: 'Veste intemporelle, idéale pour compléter vos tenues.',
    matiere: 'Denim',
    couleur: 'Bleu',
    tailles: [
      { taille: 'M', stock: 3 },
      { taille: 'L', stock: 1 }
    ],
    disponibilite: 'Stock limité',
    nouveaute: true
  },

  {
    id: 5,
    nom: 'T-shirt basique',
    categorie: 'T-shirts',
    prix: 10.96,
    image: 'bbqurwk',
    images: [
      'bbqurwk'
    ],
    description: 'T-shirt basique et confortable, un indispensable du dressing.',
    matiere: 'Coton',
    couleur: 'Blanc',
    tailles: [
      { taille: 'XS', stock: 8 },
      { taille: 'S', stock: 12 },
      { taille: 'M', stock: 15 },
      { taille: 'L', stock: 10 },
      { taille: 'XL', stock: 6 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 6,
    nom: 'Jupe plissée',
    categorie: 'Jupes',
    prix: 10.96,
    image: 'qzA5nws',
    images: [
      'qzA5nws'
    ],
    description: 'Jupe élégante et féminine, pour toutes les occasions.',
    matiere: 'Polyester recyclé',
    couleur: 'Noir',
    tailles: [
      { taille: 'S', stock: 4 },
      { taille: 'L', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 7,
    nom: 'Pull en maille',
    categorie: 'Pulls',
    prix: 10.99,
    image: 'egEkJT5',
    images: [
      'egEkJT5'
    ],
    description: 'Pull doux et chaud, parfait pour la mi-saison.',
    matiere: 'Laine mérinos',
    couleur: 'Beige',
    tailles: [
      { taille: 'S', stock: 6 },
      { taille: 'M', stock: 8 },
      { taille: 'L', stock: 5 },
      { taille: 'XL', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 8,
    nom: 'Chemise rayée',
    categorie: 'Chemises',
    prix: 69.96,
    image: 'dNDD8HN',
    images: [
      'dNDD8HN'
    ],
    description: 'Chemise élégante, à porter au bureau ou en sortie.',
    matiere: 'Coton',
    couleur: 'Rayé bleu et blanc',
    tailles: [
      { taille: 'S', stock: 3 },
      { taille: 'M', stock: 7 },
      { taille: 'L', stock: 4 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 9,
    nom: 'Pantalon fluide',
    categorie: 'Pantalons',
    prix: 54.99,
    image: 'dUqIgu0',
    images: [
      'dUqIgu0'
    ],
    description: 'Pantalon moderne et stylé, pour un look tendance.',
    matiere: 'Lin',
    couleur: 'Beige clair',
    tailles: [
      { taille: 'M', stock: 5 },
      { taille: 'L', stock: 8 },
      { taille: 'XL', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 10,
    nom: 'Cardigan beige',
    categorie: 'Cardigans',
    prix: 39.99,
    image: 'b0QwLUn',
    images: [
      'b0QwLUn'
    ],
    description: 'Cardigan doux et élégant, facile à assortir.',
    matiere: 'Acrylique',
    couleur: 'Beige',
    tailles: [
      { taille: 'S', stock: 4 },
      { taille: 'M', stock: 6 },
      { taille: 'L', stock: 2 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 11,
    nom: 'Short en lin',
    categorie: 'Shorts',
    prix: 24.99,
    image: 'e9ZCB9F',
    images: [
      'e9ZCB9F'
    ],
    description: 'Short léger et confortable, parfait pour l\'été.',
    matiere: 'Lin',
    couleur: 'Blanc',
    tailles: [
      { taille: 'S', stock: 8 },
      { taille: 'M', stock: 10 },
      { taille: 'L', stock: 6 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 12,
    nom: 'Manteau long',
    categorie: 'Manteaux',
    prix: 89.99,
    image: 'gybHo4J',
    images: [
      'gybHo4J'
    ],
    description: 'Manteau chaud et élégant, pour un hiver stylé.',
    matiere: 'Laine',
    couleur: 'Camel',
    tailles: [
      { taille: 'M', stock: 2 },
      { taille: 'L', stock: 1 }
    ],
    disponibilite: 'Stock limité',
    nouveaute: true
  },

  {
    id: 13,
    nom: 'Débardeur côtelé',
    categorie: 'Débardeurs',
    prix: 17.99,
    image: 'AoD7O2a',
    images: [
      'AoD7O2a'
    ],
    description: 'Débardeur tendance, à porter seul ou sous une veste.',
    matiere: 'Coton',
    couleur: 'Rose poudré',
    tailles: [
      { taille: 'XS', stock: 5 },
      { taille: 'S', stock: 8 },
      { taille: 'M', stock: 6 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 14,
    nom: 'Combinaison chic',
    categorie: 'Combinaisons',
    prix: 64.99,
    image: 'vtxv4cu',
    images: [
      'vtxv4cu'
    ],
    description: 'Combinaison élégante, idéale pour les soirées.',
    matiere: 'Polyester',
    couleur: 'Noir',
    tailles: [
      { taille: 'S', stock: 3 },
      { taille: 'M', stock: 5 },
      { taille: 'L', stock: 2 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 15,
    nom: 'Sweat à capuche',
    categorie: 'Sweats',
    prix: 42.99,
    image: 'rz3RXXf',
    images: [
      'rz3RXXf'
    ],
    description: 'Sweat confortable et stylé, pour un look décontracté.',
    matiere: 'Coton',
    couleur: 'Gris chiné',
    tailles: [
      { taille: 'S', stock: 7 },
      { taille: 'M', stock: 10 },
      { taille: 'L', stock: 8 },
      { taille: 'XL', stock: 4 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 16,
    nom: 'Pull en maille rayé',
    categorie: 'Pulls',
    prix: 49.99,
    image: 'cNCW5FL',
    images: [
      'cNCW5FL'
    ],
    description: 'Pull doux et chaud, parfait pour la mi-saison.',
    matiere: 'Mélange laine et acrylique',
    couleur: 'Violet et gris',
    tailles: [
      { taille: 'S', stock: 5 },
      { taille: 'M', stock: 8 },
      { taille: 'L', stock: 4 },
      { taille: 'XL', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 17,
    nom: 'Robe noire ceinturée',
    categorie: 'Robes',
    prix: 64.99,
    image: 'QsxaE0u',
    images: [
      'QsxaE0u'
    ],
    description: 'Robe élégante et féminine, pour toutes les occasions.',
    matiere: 'Polyester et élasthanne',
    couleur: 'Noir',
    tailles: [
      { taille: 'S', stock: 4 },
      { taille: 'M', stock: 6 },
      { taille: 'L', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 18,
    nom: 'Hoodie oversize beige',
    categorie: 'Sweats',
    prix: 44.99,
    image: '5K7cqRE',
    images: [
      '5K7cqRE'
    ],
    description: 'Sweat confortable et stylé, pour un look décontracté.',
    matiere: 'Coton et polyester',
    couleur: 'Beige',
    tailles: [
      { taille: 'S', stock: 5 },
      { taille: 'M', stock: 7 },
      { taille: 'L', stock: 4 },
      { taille: 'XL', stock: 2 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },

  {
    id: 19,
    nom: 'Blazer orange',
    categorie: 'Blazers',
    prix: 74.99,
    image: 'f4Bcg74',
    images: [
      'f4Bcg74'
    ],
    description: 'Blazer élégant et structuré, parfait pour le bureau.',
    matiere: 'Polyester',
    couleur: 'Orange',
    tailles: [
      { taille: 'S', stock: 2 },
      { taille: 'M', stock: 5 },
      { taille: 'L', stock: 3 },
      { taille: 'XL', stock: 1 }
    ],
    disponibilite: 'Stock limité',
    nouveaute: false
  },

  {
    id: 21,
    nom: 'Robe drapée verte',
    categorie: 'Robes',
    prix: 69.99,
    image: 'VPu05ub',
    images: [
      'VPu05ub'
    ],
    description: 'Robe élégante et féminine, pour toutes les occasions.',
    matiere: 'Polyester satiné',
    couleur: 'Vert éclatant',
    tailles: [
      { taille: 'S', stock: 3 },
      { taille: 'M', stock: 5 },
      { taille: 'L', stock: 2 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },

  {
    id: 22,
    nom: 'Combishort élégant',
    categorie: 'Combinaisons',
    prix: 59.99,
    image: 'gZhT8r8',
    images: [
      'gZhT8r8'
    ],
    description: 'Combinaison élégante, idéale pour les soirées.',
    matiere: 'Polyester et élasthanne',
    couleur: 'Noir',
    tailles: [
      { taille: 'S', stock: 4 },
      { taille: 'M', stock: 6 },
      { taille: 'L', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  }
];

export default produits;