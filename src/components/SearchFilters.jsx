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
  CircularProgress
} from '@mui/material';
import { 
  Search as SearchIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useDebounce } from '../hooks/useDebounce';
import './SearchFilters.css';

export default function SearchFilters({ onFiltersChange, produits }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

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

  // Extraction des options uniques depuis les produits
  const categories = [...new Set(produits.map(p => p.matiere))];
  const colors = [...new Set(produits.map(p => p.couleur))];
  const sizes = [...new Set(produits.flatMap(p => p.tailles))];

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
  };

  const handleColorChange = (event) => {
    const value = event.target.value;
    setSelectedColors(value);
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    setSelectedSizes(value);
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
        sizes.some(size => produit.tailles.includes(size));

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

  const hasActiveFilters = searchTerm || 
    priceRange[0] > 0 || 
    priceRange[1] < 200 || 
    selectedCategories.length > 0 || 
    selectedColors.length > 0 || 
    selectedSizes.length > 0;

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
            endAdornment: isSearching ? (
              <CircularProgress size={20} sx={{ color: 'var(--color-accent)', mr: 1 }} />
            ) : null,
          }}
          className="search-input"
        />
        <IconButton 
          onClick={() => setShowFilters(!showFilters)}
          className={`filter-toggle ${hasActiveFilters ? 'active' : ''}`}
        >
          <FilterIcon />
        </IconButton>
        {hasActiveFilters && (
          <IconButton onClick={clearFilters} className="clear-filters">
            <ClearIcon />
          </IconButton>
        )}
      </Box>

      <Collapse in={showFilters}>
        <Box className="filters-content">
          <Accordion defaultExpanded>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">Affinez votre sélection</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="filters-grid">
                {/* Filtre par prix */}
                <Box className="filter-section">
                  <Typography gutterBottom variant="subtitle1">
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
                  <FormControl fullWidth>
                    <InputLabel>Matière</InputLabel>
                    <Select
                      multiple
                      value={selectedCategories}
                      onChange={handleCategoryChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
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
                  <FormControl fullWidth>
                    <InputLabel>Couleur</InputLabel>
                    <Select
                      multiple
                      value={selectedColors}
                      onChange={handleColorChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
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
                  <FormControl fullWidth>
                    <InputLabel>Taille</InputLabel>
                    <Select
                      multiple
                      value={selectedSizes}
                      onChange={handleSizeChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} size="small" />
                          ))}
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
    </div>
  );
} 