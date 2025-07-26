// Liste centralisée des produits
const produits = [
  {
    id: 1,
    nom: 'Robe d\'été fleurie',
    prix: 49.99,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=80',
    description: 'Une robe légère et fleurie parfaite pour l\'été. Tissu doux, coupe flatteuse et motif délicat.',
    matiere: 'Coton bio',
    couleur: 'Rose pastel',
    tailles: [
      { taille: 'S', stock: 5 },
      { taille: 'M', stock: 0 },
      { taille: 'L', stock: 2 },
      { taille: 'XL', stock: 8 }
    ],
    disponibilite: 'En stock',
    nouveaute: true
  },
  {
    id: 2,
    nom: 'Blouse légère',
    prix: 29.99,
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=81',
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
    image: 'https://images.unsplash.com/photo-1469398715555-76331a6c7b29?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=81',
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
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=81',
    description: 'Short léger en lin, parfait pour l\'été.',
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
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=400&q=80',
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
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=400&q=82',
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
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=82',
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
    image: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80',
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
];

export default produits; 