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
  Badge
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

export default function SearchFilters({ onFiltersChange, produits, alwaysOpen = false, resetTrigger = 0 }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
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
    // Ne chercher que si on a au moins 2 caractères ou si c'est vide
    if (debouncedSearchTerm.length >= 2 || debouncedSearchTerm.length === 0) {
      setIsSearching(true);
      // Petit délai pour montrer l'indicateur de recherche
      setTimeout(() => {
        applyFilters(debouncedSearchTerm, debouncedPriceRange, selectedCategories, selectedColors, selectedSizes);
        setIsSearching(false);
      }, 100);
    }
  }, [debouncedSearchTerm, debouncedPriceRange, selectedCategories, selectedColors, selectedSizes]);

  // Réinitialiser les filtres quand resetTrigger change
  useEffect(() => {
    if (resetTrigger > 0) {
      clearFilters();
    }
  }, [resetTrigger]);

  // Extraction des options uniques depuis les produits
  const categories = [...new Set(produits.map(p => p.matiere))];
  const colors = [...new Set(produits.map(p => p.couleur))];
  const sizes = [...new Set(produits.flatMap(p => p.tailles.map(t => t.taille)))];

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    // Ne pas appliquer les filtres immédiatement, le debounce s'en charge
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleCategoryChange = (event) => {
    const value = event.target.value;
    setSelectedCategories(value);
    
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

  const applyFilters = (search, price, categories, colors, sizes) => {
    const filteredProducts = produits.filter(produit => {
      // Filtre par recherche textuelle
      const matchesSearch = search === '' || 
        produit.nom.toLowerCase().includes(search.toLowerCase()) ||
        produit.description.toLowerCase().includes(search.toLowerCase());

      // Filtre par prix
      const matchesPrice = produit.prix >= price[0] && produit.prix <= price[1];

      // Filtre par catégorie/matière
      const matchesCategory = categories.length === 0 || categories.includes(produit.matiere);

      // Filtre par couleur
      const matchesColor = colors.length === 0 || colors.includes(produit.couleur);

      // Filtre par taille
      const matchesSize = sizes.length === 0 || 
        sizes.some(size => produit.tailles.some(t => t.taille === size));

      return matchesSearch && matchesPrice && matchesCategory && matchesColor && matchesSize;
    });

    onFiltersChange(filteredProducts);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 200]);
    setSelectedCategories([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    // Les filtres seront appliqués automatiquement par le useEffect
  };

  const hasActiveFilters = Boolean(searchTerm || 
    priceRange[0] > 0 || 
    priceRange[1] < 200 || 
    selectedCategories.length > 0 || 
    selectedColors.length > 0 || 
    selectedSizes.length > 0);

  return (
    <div className="search-filters">
      <Box className="search-header">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Rechercher un produit..."
          value={searchTerm}
          onChange={handleSearchChange}
          autoComplete="off"
          InputProps={{
            startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            endAdornment: (
              <Box sx={{ width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 1 }}>
                {isSearching && (
                  <CircularProgress size={16} sx={{ color: 'var(--color-accent)' }} />
                )}
              </Box>
            ),
          }}
          className="search-input"
        />
        {!alwaysOpen && (
          <IconButton 
            onClick={() => setShowFilters(!showFilters)}
            className={`filter-toggle ${hasActiveFilters ? 'active' : ''}`}
          >
            <FilterIcon />
          </IconButton>
        )}

      </Box>
      {alwaysOpen ? (
        <Box className="filters-content">
          <Box className="filters-header" sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: 2,
            padding: '12px 0'
          }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600,
                fontSize: '0.95rem',
                color: '#1a1a1a',
                letterSpacing: '0.3px'
              }}
            >
              Filtres
            </Typography>
            {hasActiveFilters && (
              <Button
                variant="text"
                size="small"
                onClick={clearFilters}
                startIcon={<ClearIcon />}
                sx={{
                  color: '#d32f2f',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.8rem',
                  padding: '4px 8px',
                  minWidth: 'auto',
                  '&:hover': {
                    backgroundColor: 'rgba(211, 47, 47, 0.04)'
                  }
                }}
              >
                Effacer
              </Button>
            )}
          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {/* Filtre par prix */}
            <Box sx={{
              background: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(224, 224, 224, 0.5)',
              borderRadius: '12px',
              padding: '16px',
              backdropFilter: 'blur(5px)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalOfferIcon sx={{ fontSize: 18, color: '#667eea' }} />
                  <Typography variant="body2" sx={{ fontWeight: 600, color: '#1a1a1a' }}>
                    Prix: {priceRange[0]}€ - {priceRange[1]}€
                  </Typography>
                </Box>
                {debouncedPriceRange[0] !== priceRange[0] || debouncedPriceRange[1] !== priceRange[1] && (
                  <CircularProgress size={14} sx={{ color: '#667eea' }} />
                )}
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
                    height: 16,
                    width: 16,
                    backgroundColor: '#667eea'
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#667eea'
                  }
                }}
              />
            </Box>
            
            {/* Filtres horizontaux compacts */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 2,
              '@media (max-width: 768px)': {
                gridTemplateColumns: '1fr'
              }
            }}>
              {/* Filtre par catégorie/matière */}
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(224, 224, 224, 0.5)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(5px)'
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
                    value={selectedCategories}
                    onChange={handleCategoryChange}
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
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par couleur */}
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(224, 224, 224, 0.5)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(5px)'
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
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              {/* Filtre par taille */}
              <Box sx={{
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(224, 224, 224, 0.5)',
                borderRadius: '12px',
                padding: '12px',
                backdropFilter: 'blur(5px)'
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
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Collapse in={showFilters} timeout={300} easing="ease-in-out">
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
                    value={selectedCategories}
                    onChange={handleCategoryChange}
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
                      {size}
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
                    <ExpandMoreIcon 
                      sx={{ 
                        transform: expandedFilters.categories ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease',
                        color: '#666'
                      }} 
                    />
                  )}
                </Typography>
              </Box>
              <Collapse in={!isMobile || expandedFilters.categories} timeout={300} easing="ease-in-out">
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedCategories}
                    onChange={handleCategoryChange}
                    displayEmpty
                    sx={{
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(224, 224, 224, 0.6)',
                        borderRadius: '12px'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f093fb'
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f093fb',
                        borderWidth: '2px'
                      }
                    }}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <Typography sx={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une matière</Typography>
                        ) : (
                          selected.map((value) => (
                            <Chip 
                              key={value} 
                              label={value} 
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                '& .MuiChip-deleteIcon': {
                                  color: 'rgba(255, 255, 255, 0.8)',
                                  '&:hover': {
                                    color: '#fff'
                                  }
                                }
                              }}
                            />
                          ))
                        )}
                      </Box>
                    )}
                  >
                    {categories.map((category) => (
                      <MenuItem 
                        key={category} 
                        value={category}
                        sx={{
                          '&:hover': {
                            backgroundColor: 'rgba(240, 147, 251, 0.1)'
                          },
                          '&.Mui-selected': {
                            backgroundColor: 'rgba(240, 147, 251, 0.2)',
                            '&:hover': {
                              backgroundColor: 'rgba(240, 147, 251, 0.3)'
                            }
                          }
                        }}
                      >
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Collapse>
            </Box>
            
            {/* Filtre par couleur */}
            <Box className="filter-section" sx={{ 
              background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
              border: '1px solid rgba(224, 224, 224, 0.4)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '16px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                borderColor: 'rgba(0, 0, 0, 0.2)'
              }
            }}>
              <Box 
                className="filter-header"
                onClick={() => isMobile && toggleFilter('colors')}
                style={{ cursor: isMobile ? 'pointer' : 'default' }}
              >
                <Typography 
                  variant="subtitle2" 
                  style={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    marginBottom: 8,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaletteIcon sx={{ fontSize: 16, color: '#666' }} />
                    Couleur
                  </Box>
                  {isMobile && (
                    <ExpandMoreIcon 
                      style={{ 
                        transform: expandedFilters.colors ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  )}
                </Typography>
              </Box>
              <Collapse in={!isMobile || expandedFilters.colors} timeout={300} easing="ease-in-out">
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedColors}
                    onChange={handleColorChange}
                    displayEmpty
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <span style={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une couleur</span>
                        ) : (
                          selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))
                        )}
                      </Box>
                    )}
                  >
                    {colors.map((color) => (
                      <MenuItem key={color} value={color}>
                        {color}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Collapse>
            </Box>
            
            {/* Filtre par taille */}
            <Box className="filter-section">
              <Box 
                className="filter-header"
                onClick={() => isMobile && toggleFilter('sizes')}
                style={{ cursor: isMobile ? 'pointer' : 'default' }}
              >
                <Typography 
                  variant="subtitle2" 
                  style={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    marginBottom: 8,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <StraightenIcon sx={{ fontSize: 16, color: '#666' }} />
                    Taille
                  </Box>
                  {isMobile && (
                    <ExpandMoreIcon 
                      style={{ 
                        transform: expandedFilters.sizes ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  )}
                </Typography>
              </Box>
              <Collapse in={!isMobile || expandedFilters.sizes} timeout={300} easing="ease-in-out">
                <FormControl fullWidth>
                  <Select
                    multiple
                    value={selectedSizes}
                    onChange={handleSizeChange}
                    displayEmpty
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.length === 0 ? (
                          <span style={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une taille</span>
                        ) : (
                          selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))
                        )}
                      </Box>
                    )}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Collapse>
            </Box>
          </Box>
        </Box>
      ) : (
        <Collapse in={showFilters} timeout={300} easing="ease-in-out">
          <Box className="filters-content">
            <Accordion defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="h6">Affinez votre sélection</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="filters-grid">
                  {/* Filtre par prix */}
                  <Box className="filter-section">
                    <Typography 
                      variant="subtitle2" 
                      style={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        marginBottom: 12,
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Prix : {priceRange[0]}€ - {priceRange[1]}€
                      {debouncedPriceRange[0] !== priceRange[0] || debouncedPriceRange[1] !== priceRange[1] ? (
                        <span className="searching-indicator">
                          ⏳ Recherche...
                        </span>
                      ) : null}
                    </Typography>
                    <Slider
                      value={priceRange}
                      onChange={handlePriceChange}
                      valueLabelDisplay="auto"
                      min={0}
                      max={200}
                      className="price-slider"
                    />
                  </Box>
                  {/* Filtre par catégorie/matière */}
                  <Box className="filter-section">
                    <Typography 
                      variant="subtitle2" 
                      style={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        marginBottom: 8,
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Matière
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={selectedCategories}
                        onChange={handleCategoryChange}
                        displayEmpty
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.length === 0 ? (
                              <span style={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une matière</span>
                            ) : (
                              selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))
                            )}
                          </Box>
                        )}
                      >
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {/* Filtre par couleur */}
                  <Box className="filter-section">
                    <Typography 
                      variant="subtitle2" 
                      style={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        marginBottom: 8,
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Couleur
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={selectedColors}
                        onChange={handleColorChange}
                        displayEmpty
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.length === 0 ? (
                              <span style={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une couleur</span>
                            ) : (
                              selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))
                            )}
                          </Box>
                        )}
                      >
                        {colors.map((color) => (
                          <MenuItem key={color} value={color}>
                            {color}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  {/* Filtre par taille */}
                  <Box className="filter-section">
                    <Typography 
                      variant="subtitle2" 
                      style={{ 
                        fontWeight: 600, 
                        color: '#333', 
                        marginBottom: 8,
                        fontSize: '0.9rem',
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase'
                      }}
                    >
                      Taille
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        multiple
                        value={selectedSizes}
                        onChange={handleSizeChange}
                        displayEmpty
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.length === 0 ? (
                              <span style={{ color: '#999', fontSize: '0.9rem' }}>Sélectionner une taille</span>
                            ) : (
                              selected.map((value) => (
                                <Chip key={value} label={value} size="small" />
                              ))
                            )}
                          </Box>
                        )}
                      >
                        {sizes.map((size) => (
                          <MenuItem key={size} value={size}>
                            {size}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Collapse>
      )}
    </div>
  );
} 