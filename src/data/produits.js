

const produits = [

  {
    id: 2,
    nom: 'Blouse légère',
    prix: 29.99,
    image: '/images/pexels-polina-tankilevitch-4725105.jpg',
    description: 'Blouse fluide et élégante, idéale pour les journées ensoleillées ou les soirées décontractées.',
    matiere: 'Viscose',
    couleur: 'Blanc cassé',
    tailles: [
      { taille: 'XS', stock: 3 },
      { taille: 'S', stock: 7 },
      { taille: 'M', stock: 4 },
      { taille: 'L', stock: 0 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },
  {
    id: 3,
    nom: 'Jean taille haute',
    prix: 59.99,
    image: '/images/pexels-payamrafiei56-6567927.jpg',
    description: 'Jean moderne à taille haute, confortable et stylé pour toutes les morphologies.',
    matiere: 'Denim',
    couleur: 'Bleu clair',
    tailles: [
      { taille: 'S', stock: 2 },
      { taille: 'M', stock: 6 },
      { taille: 'L', stock: 4 },
      { taille: 'XL', stock: 1 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },
  {
    id: 4,
    nom: 'Veste en jean',
    prix: 69.99,
    image: '/images/denim-jacket-6240825.jpg',
    description: 'Veste en jean intemporelle, parfaite pour compléter toutes vos tenues.',
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
    prix: 19.99,
    image: '/images/pexels-david-manzyk-253085053-20426347.jpg',
    description: 'T-shirt simple et confortable, un indispensable du dressing.',
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
    prix: 39.99,
    image: '/images/pexels-miyatavictor-19327673.jpg',
    description: 'Jupe élégante et féminine, idéale pour toutes les occasions.',
    matiere: 'Polyester recyclé',
    couleur: 'Noir',
    tailles: [
      { taille: 'S', stock: 4 },
      { taille: 'M', stock: 0 },
      { taille: 'L', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },
  {
    id: 7,
    nom: 'Pull en maille',
    prix: 44.99,
    image: '/images/pexels-vlada-karpovich-9968525.jpg',
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
    prix: 34.99,
    image: '/images/pexels-28488111-7945745.jpg',
    description: 'Chemise élégante à rayures, à porter au bureau ou en sortie.',
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
    prix: 54.99,
    image: '/images/pexels-cottonbro-9861655.jpg',
    description: 'Pantalon léger et fluide, pour un confort optimal.',
    matiere: 'Lin',
    couleur: 'Beige clair',
    tailles: [
      { taille: 'M', stock: 5 },
      { taille: 'L', stock: 8 },
      { taille: 'XL', stock: 3 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  },
  {
    id: 10,
    nom: 'Cardigan beige',
    prix: 39.99,
    image: '/images/pexels-valeriya-31747192.jpg',
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
    prix: 24.99,
    image: '/images/pexels-nai-de-vogue-2150938492-31410215.jpg',
    description: "Short léger en lin, parfait pour l'été.",
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
    prix: 89.99,
    image: '/images/woman-4290853.jpg',
    description: 'Manteau long et chaud, pour un hiver stylé.',
    matiere: 'Laine',
    couleur: 'Camel',
    tailles: [
      { taille: 'M', stock: 2 },
      { taille: 'L', stock: 1 },
      { taille: 'XL', stock: 0 }
    ],
    disponibilite: 'Stock limité',
    nouveaute: true
  },
  {
    id: 13,
    nom: 'Débardeur côtelé',
    prix: 17.99,
    image: '/images/woman-4390055.jpg',
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
    prix: 64.99,
    image: '/images/woman-6540891.jpg',
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
    prix: 42.99,
    image: '/images/fashion-3555648.jpg',
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
  // Nouveaux produits ajoutés à partir des photos fournies
  {
    id: 16,
    nom: 'Pull en maille rayé',
    prix: 49.99,
    image: '/images/fashion-1283863.jpg',
    description: 'Pull rayé en maille épaisse aux couleurs contrastées. Confortable et tendance, idéal pour les journées fraîches.',
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
    prix: 64.99,
    image: '/images/fashion-3555648.jpg',
    description: 'Robe courte sans manches avec encolure en V et ceinture métal. Chic et polyvalente pour la journée comme pour les soirées.',
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
    prix: 44.99,
    image: '/images/pexels-28488111-7945745.jpg',
    description: 'Sweat à capuche oversize au style décontracté. Tissu doux et confortable, avec poche kangourou et capuche ajustable.',
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
    prix: 74.99,
    image: '/images/pexels-cottonbro-9861655.jpg',
    description: 'Blazer tailleur élégant en tissu structuré. Coupe moderne et couleur vive pour dynamiser votre garde-robe professionnelle.',
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
    prix: 69.99,
    image: '/images/pexels-miyatavictor-19327673.jpg',
    description: 'Robe longue drapée avec ceinture nouée à la taille. Coupe fluide et couleur vibrante pour un look sophistiqué.',
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
    prix: 59.99,
    image: '/images/pexels-nai-de-vogue-2150938492-31410215.jpg',
    description: 'Combishort noir avec épaules dénudées et bretelles ornées. Idéal pour des soirées chics ou des sorties estivales.',
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
    id: 23,
    nom: 'Chemise blanche oversize',
    prix: 39.99,
    image: '/images/pexels-payamrafiei56-6567927.jpg',
    description: 'Chemise en coton ample à manches longues, à porter rentrée dans une jupe ou un pantalon pour un style minimaliste.',
    matiere: 'Coton',
    couleur: 'Blanc',
    tailles: [
      { taille: 'S', stock: 5 },
      { taille: 'M', stock: 7 },
      { taille: 'L', stock: 5 },
      { taille: 'XL', stock: 2 }
    ],
    disponibilite: 'En stock',
    nouveaute: false
  }
];

export default produits;