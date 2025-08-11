import React, { useState, useEffect } from 'react';
import {
  TextField,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
  Collapse,
  CircularProgress,
  useMediaQuery,
  Divider,
  Badge,
  Checkbox,
  ListItemText
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon,
  Tune as TuneIcon,
  LocalOffer as LocalOfferIcon,
  Palette as PaletteIcon,
  Straighten as StraightenIcon
} from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';
import './SearchFilters.css';

export default function SearchFilters({ onFiltersChange, produits, alwaysOpen = false, selectedCategories = [] }) {
  // Fonction pour charger les filtres depuis localStorage
  const loadFiltersFromStorage = () => {
    try {
      const savedFilters = localStorage.getItem('searchFilters');
      if (savedFilters) {
        return JSON.parse(savedFilters);
      }
    } catch (error) {
      console.log('Erreur lors du chargement des filtres:', error);
    }
    return {
      searchTerm: '',
      priceRange: [0, 200],
      selectedMatieres: [],
      selectedColors: [],
      selectedSizes: []
    };
  };

  // Fonction pour sauvegarder les filtres dans localStorage
  const saveFiltersToStorage = (filters) => {
    try {
      localStorage.setItem('searchFilters', JSON.stringify(filters));
    } catch (error) {
      console.log('Erreur lors de la sauvegarde des filtres:', error);
    }
  };

  // Charger les filtres sauvegardés au démarrage
  const savedFilters = loadFiltersFromStorage();
  
  const [searchTerm, setSearchTerm] = useState(savedFilters.searchTerm);
  const [isSearching, setIsSearching] = useState(false);
  const [priceRange, setPriceRange] = useState(savedFilters.priceRange);
  const [selectedMatieres, setSelectedMatieres] = useState(savedFilters.selectedMatieres);
  const [selectedColors, setSelectedColors] = useState(savedFilters.selectedColors);
  const [selectedSizes, setSelectedSizes] = useState(savedFilters.selectedSizes);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedFilters, setExpandedFilters] = useState({
    price: true,
    categories: true,
    colors: true,
    sizes: true
  });

  // Détecter si on est sur mobile
  const isMobile = useMediaQuery('(max-width:1024px)');

  // Debounce le terme de recherche avec 400ms de délai
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  // Debounce le prix avec 500ms de délai
  const debouncedPriceRange = useDebounce(priceRange, 500);

  // Appliquer les filtres quand les valeurs debounced changent
  useEffect(() => {
    // Appliquer les filtres si :
    // - Recherche vide OU recherche >= 2 caractères
    // - OU si d'autres filtres sont actifs (prix, matières, couleurs, tailles)
    const shouldApplyFilters =
      debouncedSearchTerm.length === 0 ||
      debouncedSearchTerm.length >= 2 ||
      debouncedPriceRange[0] > 0 ||
      debouncedPriceRange[1] < 200 ||
      selectedMatieres.length > 0 ||
      selectedColors.length > 0 ||
      selectedSizes.length > 0 ||
      selectedCategories.length > 0;

    if (shouldApplyFilters) {
      setIsSearching(debouncedSearchTerm.length > 0 && debouncedSearchTerm.length < 2 ? false : true);
      // Petit délai pour montrer l'indicateur de recherche
      setTimeout(() => {
        applyFilters(debouncedSearchTerm, debouncedPriceRange, selectedMatieres, selectedColors, selectedSizes);
        setIsSearching(false);
      }, debouncedSearchTerm.length > 0 && debouncedSearchTerm.length < 2 ? 0 : 100);
    }
  }, [debouncedSearchTerm, debouncedPriceRange, selectedCategories, selectedMatieres, selectedColors, selectedSizes]);

  // Appliquer les filtres initiaux au montage du composant
  useEffect(() => {
    applyFilters('', [0, 200], [], [], []);
  }, []);

  // Filtrer les produits selon les catégories sélectionnées pour adapter les autres filtres
  const productsForFilters = selectedCategories.length > 0
    ? produits.filter(p => selectedCategories.includes(p.categorie))
    : produits;

  // Extraction des options uniques depuis les produits filtrés par catégories
  const categories = [...new Set(productsForFilters.map(p => p.matiere))];
  const colors = [...new Set(productsForFilters.map(p => p.couleur))];
  const sizes = [...new Set(productsForFilters.flatMap(p => p.tailles.map(t => t.taille)))];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    // Sauvegarder immédiatement le terme de recherche
    const currentFilters = {
      searchTerm: value,
      priceRange,
      selectedMatieres,
      selectedColors,
      selectedSizes
    };
    saveFiltersToStorage(currentFilters);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    
    // Sauvegarder immédiatement le prix
    const currentFilters = {
      searchTerm,
      priceRange: newValue,
      selectedMatieres,
      selectedColors,
      selectedSizes
    };
    saveFiltersToStorage(currentFilters);
  };

  const handleMatiereChange = (event) => {
    const value = event.target.value;
    setSelectedMatieres(value);

    // Sauvegarder immédiatement les matières
    const currentFilters = {
      searchTerm,
      priceRange,
      selectedMatieres: value,
      selectedColors,
      selectedSizes
    };
    saveFiltersToStorage(currentFilters);

    // Sur mobile, fermer automatiquement le filtre après sélection
    if (isMobile && !alwaysOpen) {
      setTimeout(() => {
        setExpandedFilters(prev => ({ ...prev, categories: false }));
      }, 300); // Délai pour permettre à l'animation de se terminer
    }
  };

  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);

    // Sauvegarder immédiatement les couleurs
    const currentFilters = {
      searchTerm,
      priceRange,
      selectedMatieres,
      selectedColors: value,
      selectedSizes
    };
    saveFiltersToStorage(currentFilters);

    // Sur mobile, fermer automatiquement le filtre après sélection
    if (isMobile && !alwaysOpen) {
      setTimeout(() => {
        setExpandedFilters(prev => ({ ...prev, colors: false }));
      }, 300);
    }
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    setSelectedSizes(value);

    // Sauvegarder immédiatement les tailles
    const currentFilters = {
      searchTerm,
      priceRange,
      selectedMatieres,
      selectedColors,
      selectedSizes: value
    };
    saveFiltersToStorage(currentFilters);

    // Sur mobile, fermer automatiquement le filtre après sélection
    if (isMobile && !alwaysOpen) {
      setTimeout(() => {
        setExpandedFilters(prev => ({ ...prev, sizes: false }));
      }, 300);
    }
  };

  const toggleFilter = (filterName) => {
    setExpandedFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const applyFilters = (search, price, matieres, colors, sizes) => {
    let filtered = produits;

    // PREMIER : Filtre par catégories sélectionnées (depuis navbar)
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(produit => selectedCategories.includes(produit.categorie));
    }

    // Filtre par recherche textuelle
    if (search) {
      filtered = filtered.filter(produit =>
        produit.nom.toLowerCase().includes(search.toLowerCase()) ||
        produit.description.toLowerCase().includes(search.toLowerCase()) ||
        produit.matiere.toLowerCase().includes(search.toLowerCase()) ||
        produit.couleur.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filtre par prix
    filtered = filtered.filter(produit => produit.prix >= price[0] && produit.prix <= price[1]);

    // Filtre par matière
    if (matieres.length > 0) {
      filtered = filtered.filter(produit => matieres.includes(produit.matiere));
    }

    // Filtre par couleur
    if (colors.length > 0) {
      filtered = filtered.filter(produit => colors.includes(produit.couleur));
    }

    // Filtre par taille
    if (sizes.length > 0) {
      filtered = filtered.filter(produit =>
        produit.tailles.some(taille => sizes.includes(taille.taille))
      );
    }

    onFiltersChange(filtered);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 200]);
    setSelectedMatieres([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    
    // Effacer aussi les filtres du localStorage
    const clearedFilters = {
      searchTerm: '',
      priceRange: [0, 200],
      selectedMatieres: [],
      selectedColors: [],
      selectedSizes: []
    };
    saveFiltersToStorage(clearedFilters);
  };

  const hasActiveFilters = searchTerm || priceRange[0] > 0 || priceRange[1] < 200 ||
    selectedMatieres.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0;

  return (
    <div className="search-filters">


      {/* Barre de recherche */}
      <div className="search-container">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: '#666', marginRight: 1 }} />,
            endAdornment: isSearching ? <CircularProgress size={20} /> : null,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }
            }
          }}
        />
      </div>

      {/* Bouton pour afficher/masquer les filtres sur mobile */}
      {!alwaysOpen && (
        <div className="filter-toggle">
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{
              borderRadius: '20px',
              textTransform: 'none',
              backgroundColor: showFilters ? 'rgba(102, 126, 234, 0.1)' : 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              '&:hover': {
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
              }
            }}
          >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
          </Button>

          {hasActiveFilters && (
            <Button
              variant="text"
              startIcon={<ClearIcon />}
              onClick={clearFilters}
              sx={{
                marginLeft: 1,
                borderRadius: '20px',
                textTransform: 'none',
                color: '#f56565',
                '&:hover': {
                  backgroundColor: 'rgba(245, 101, 101, 0.1)'
                }
              }}
            >
              Réinitialiser
            </Button>
          )}
        </div>
      )}

      {/* Filtres */}
      {(alwaysOpen || (!isMobile && showFilters)) ? (
        <Box className="filters-desktop">
          <Box sx={{
            padding: '20px'
          }}>
            {/* Titre et bouton réinitialiser */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '1.1rem' }}>
                Filtres
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="text"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  sx={{
                    borderRadius: '20px',
                    textTransform: 'none',
                    color: '#f56565',
                    fontSize: '0.85rem',
                    '&:hover': {
                      backgroundColor: 'rgba(245, 101, 101, 0.1)'
                    }
                  }}
                >
                  Réinitialiser
                </Button>
              )}
            </Box>

            {/* Filtres en grille horizontale */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2 }}>
              {/* Filtre par prix */}
              <Box sx={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <LocalOfferIcon sx={{ fontSize: 16, color: '#667eea' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem' }}>
                    Prix: {priceRange[0]}€ - {priceRange[1]}€
                  </Typography>
                </Box>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  sx={{
                    color: '#667eea',
                    height: 4,
                    '& .MuiSlider-thumb': {
                      width: 16,
                      height: 16
                    }
                  }}
                />
              </Box>

              {/* Filtre par matière */}
              <Box sx={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <TuneIcon sx={{ fontSize: 16, color: '#f093fb' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem' }}>
                    Matière
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedMatieres}
                    onChange={handleMatiereChange}
                    displayEmpty
                    sx={{
                      fontSize: '0.8rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(224, 224, 224, 0.6)'
                      }
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>Toutes</Typography>
                        ) : (
                          selected.slice(0, 2).map((value) => (
                            <Chip key={value} label={value} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                          ))
                        )}
                        {selected.length > 2 && (
                          <Chip label={`+${selected.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category} sx={{ fontSize: '0.8rem' }}>
                        <Checkbox checked={selectedMatieres.indexOf(category) > -1} size="small" sx={{ padding: '2px 6px' }} />
                        <ListItemText primary={category} primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par couleur */}
              <Box sx={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <PaletteIcon sx={{ fontSize: 16, color: '#4facfe' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem' }}>
                    Couleur
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedColors}
                    onChange={handleColorChange}
                    displayEmpty
                    sx={{
                      fontSize: '0.8rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(224, 224, 224, 0.6)'
                      }
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>Toutes</Typography>
                        ) : (
                          selected.slice(0, 2).map((value) => (
                            <Chip key={value} label={value} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                          ))
                        )}
                        {selected.length > 2 && (
                          <Chip label={`+${selected.length - 2}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    )}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color} sx={{ fontSize: '0.8rem' }}>
                        <Checkbox checked={selectedColors.indexOf(color) > -1} size="small" sx={{ padding: '2px 6px' }} />
                        <ListItemText primary={color} primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par taille */}
              <Box sx={{
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '12px'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, marginBottom: 1 }}>
                  <StraightenIcon sx={{ fontSize: 16, color: '#43e97b' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a', fontSize: '0.85rem' }}>
                    Taille
                  </Typography>
                </Box>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={selectedSizes}
                    onChange={handleSizeChange}
                    displayEmpty
                    sx={{
                      fontSize: '0.8rem',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(224, 224, 224, 0.6)'
                      }
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <Typography sx={{ color: '#999', fontSize: '0.8rem' }}>Toutes</Typography>
                        ) : (
                          selected.slice(0, 3).map((value) => (
                            <Chip key={value} label={value} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                          ))
                        )}
                        {selected.length > 3 && (
                          <Chip label={`+${selected.length - 3}`} size="small" sx={{ height: 20, fontSize: '0.7rem' }} />
                        )}
                      </Box>
                    )}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size} sx={{ fontSize: '0.8rem' }}>
                        <Checkbox checked={selectedSizes.indexOf(size) > -1} size="small" sx={{ padding: '2px 6px' }} />
                        <ListItemText primary={size} primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Collapse in={alwaysOpen || showFilters} timeout={300} easing="ease-in-out">
          <Box className="filters-content">
            <Typography variant="h6" sx={{ marginBottom: 2, fontWeight: 600, fontSize: '0.95rem' }}>
              Filtres
            </Typography>

            {/* Version mobile simplifiée */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Prix mobile */}
              <Box sx={{ background: 'rgba(255, 255, 255, 0.9)', border: '1px solid rgba(224, 224, 224, 0.5)', borderRadius: '8px', padding: '12px' }}>
                <Typography variant="body2" sx={{ fontWeight: 600, marginBottom: 1, fontSize: '0.85rem' }}>
                  Prix: {priceRange[0]}€ - {priceRange[1]}€
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  sx={{ color: '#667eea', height: 4 }}
                />
              </Box>

              {/* Autres filtres mobile */}
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                <FormControl size="small">
                  <Typography variant="caption" sx={{ marginBottom: 0.5, fontWeight: 600 }}>Matière</Typography>
                  <Select
                    multiple
                    value={selectedMatieres}
                    onChange={handleMatiereChange}
                    displayEmpty
                    sx={{ fontSize: '0.8rem' }}
                    renderValue={(selected) => (
                      <Typography sx={{ fontSize: '0.8rem', color: selected.length ? '#1a1a1a' : '#999' }}>
                        {selected.length ? `${selected.length} sélect.` : 'Toutes'}
                      </Typography>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category} sx={{ fontSize: '0.8rem' }}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small">
                  <Typography variant="caption" sx={{ marginBottom: 0.5, fontWeight: 600 }}>Couleur</Typography>
                  <Select
                    multiple
                    value={selectedColors}
                    onChange={handleColorChange}
                    displayEmpty
                    sx={{ fontSize: '0.8rem' }}
                    renderValue={(selected) => (
                      <Typography sx={{ fontSize: '0.8rem', color: selected.length ? '#1a1a1a' : '#999' }}>
                        {selected.length ? `${selected.length} sélect.` : 'Toutes'}
                      </Typography>
                    )}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color} sx={{ fontSize: '0.8rem' }}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <FormControl size="small">
                <Typography variant="caption" sx={{ marginBottom: 0.5, fontWeight: 600 }}>Taille</Typography>
                <Select
                  multiple
                  value={selectedSizes}
                  onChange={handleSizeChange}
                  displayEmpty
                  sx={{ fontSize: '0.8rem' }}
                  renderValue={(selected) => (
                    <Typography sx={{ fontSize: '0.8rem', color: selected.length ? '#1a1a1a' : '#999' }}>
                      {selected.length ? `${selected.length} sélectionnées` : 'Toutes'}
                    </Typography>
                  )}
                >
                  {sizes.map((size) => (
                    <MenuItem key={size} value={size} sx={{ fontSize: '0.8rem' }}>
                      <Checkbox checked={selectedSizes.indexOf(size) > -1} size="small" sx={{ padding: '2px 6px' }} />
                      <ListItemText primary={size} primaryTypographyProps={{ sx: { fontSize: '0.8rem' } }} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Collapse>
      )}
    </div>
  );
}
