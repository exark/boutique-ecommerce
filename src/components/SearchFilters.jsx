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
  useMediaQuery
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon
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
          <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <Typography variant="h6" style={{ fontWeight: 600 }}>
              Affinez votre sélection
            </Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              style={{
                color: '#666',
                borderColor: '#e0e0e0',
                textTransform: 'none',
                fontWeight: 400,
                fontSize: '0.8rem',
                padding: '6px 12px',
                opacity: hasActiveFilters ? 1 : 0,
                visibility: hasActiveFilters ? 'visible' : 'hidden',
                transition: 'opacity 0.2s ease, visibility 0.2s ease'
              }}
            >
              Réinitialiser
            </Button>
          </Box>
          <Box className="filters-grid">
            {/* Filtre par prix */}
            <Box className="filter-section">
              <Box 
                className="filter-header"
                onClick={() => isMobile && toggleFilter('price')}
                style={{ cursor: isMobile ? 'pointer' : 'default' }}
              >
                <Typography 
                  variant="subtitle2" 
                  style={{ 
                    fontWeight: 600, 
                    color: '#333', 
                    marginBottom: 12,
                    fontSize: '0.9rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  Prix : {priceRange[0]}€ - {priceRange[1]}€
                  {isMobile && (
                    <ExpandMoreIcon 
                      style={{ 
                        transform: expandedFilters.price ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
                      }} 
                    />
                  )}
                  {debouncedPriceRange[0] !== priceRange[0] || debouncedPriceRange[1] !== priceRange[1] ? (
                    <span className="searching-indicator">
                      ⏳ Recherche...
                    </span>
                  ) : null}
                </Typography>
              </Box>
              <Collapse in={!isMobile || expandedFilters.price} timeout={300} easing="ease-in-out">
                <Slider
                  value={priceRange}
                  onChange={handlePriceChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={200}
                  className="price-slider"
                />
              </Collapse>
            </Box>
            
            {/* Filtre par catégorie/matière */}
            <Box className="filter-section">
              <Box 
                className="filter-header"
                onClick={() => isMobile && toggleFilter('categories')}
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
                  Matière
                  {isMobile && (
                    <ExpandMoreIcon 
                      style={{ 
                        transform: expandedFilters.categories ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s ease'
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
              </Collapse>
            </Box>
            
            {/* Filtre par couleur */}
            <Box className="filter-section">
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
                  Couleur
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
                  Taille
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