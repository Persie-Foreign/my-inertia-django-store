// ShopToolbar.jsx
import React, { useState, useCallback } from 'react';
import SortDropdown from './SortDropdown.jsx';
import Filter from './Filter.jsx';

const ShopToolbar = () => {
    const [sortOption, setSortOption] = useState('default');

    const handleSortChange = useCallback((option) => {
        setSortOption(option);
        console.log('Sort changed to:', option);
        // You can update the URL via Inertia if needed here
    }, []);

    const onFilterChange = useCallback((filters) => {
        console.log('Filters applied:', filters);
        // You can update the URL via Inertia if needed here
        // Example:
        // router.get('/products', { ...filters }, { preserveState: true });
    }, []);

    return (
        <div className="bg-white shadow-sm fixed w-full z-30 top-30">
            <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                {/* Grid/List View Buttons (can be wired up later) */}
                <div className="flex space-x-4">
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <button className="text-gray-600 hover:text-gray-900">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>

                {/* Sort Dropdown */}
                <div className="ml-auto mr-4">
                    <SortDropdown sortOption={sortOption} onSortChange={handleSortChange} />
                </div>

                {/* Filter Sidebar */}
                <Filter onFilterChange={onFilterChange} />
            </div>
        </div>
    );
};

export default ShopToolbar;
