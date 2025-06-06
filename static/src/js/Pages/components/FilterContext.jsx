// src/contexts/FilterContext.jsx
import React from 'react';
import { createContext, useContext, useState } from 'react';

// Create context with default values
const FilterContext = createContext({
    filters: { categories: [], priceRange: [0, 1000000] },
    setFilters: () => {},
    sortOption: '',
    setSortOption: () => {},
    layout: 'lg:grid-cols-4',
    setLayout: () => {}
});

export function FilterProvider({ children }) {
    const [filters, setFilters] = useState({
        categories: [],
        priceRange: [0, 1000000]
    });

    const [sortOption, setSortOption] = useState('');
    const [layout, setLayout] = useState('lg:grid-cols-4');

    const value = {
        filters,
        setFilters,
        sortOption,
        setSortOption,
        layout,
        setLayout
    };

    return (
        <FilterContext.Provider value={value}>
            {children}
        </FilterContext.Provider>
    );
}

export const useFilter = () => {
    const context = useContext(FilterContext);

    // Safety check to prevent undefined errors
    if (context === undefined) {
        throw new Error('useFilter must be used within a FilterProvider');
    }

    return context;
};