import React from 'react';

export default function SortDropdown({ sortOption = '', onSortChange = () => {} }) {
    return (
        <div className="relative mb-4">
            <select
                value={sortOption}
                onChange={onSortChange}
                className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
                aria-label="Sort Products"
            >
                <option value="" disabled>Sort by</option>
                <optgroup label="Featured">
                    <option value="best-selling">Best Selling</option>
                    <option value="price-low-to-high">Price: Low to High</option>
                    <option value="price-high-to-low">Price: High to Low</option>
                    <option value="az">Alphabetically A-Z</option>
                    <option value="za">Alphabetically Z-A</option>
                    <option value="date-new-to-old">Date: New to Old</option>
                    <option value="date-old-to-new">Date: Old to New</option>
                </optgroup>
            </select>
        </div>
    );
}