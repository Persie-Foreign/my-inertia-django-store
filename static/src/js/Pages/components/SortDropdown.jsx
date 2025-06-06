import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function SortDropdown({
    sortOption,
    onSortChange,
}) {
    const [isOpen, setIsOpen] = useState(false);

    const handleFocus = () => setIsOpen(true);
    const handleBlur = () => setIsOpen(false);

    return (
        <div className="relative mb-4 w-30"> {/* Control width as needed */}
            <select
                value={sortOption}
                onChange={onSortChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                className="w-full appearance-none px-4 py-2 pr-10 rounded text-gray-600  "
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
            {/* ChevronDown icon */}
            {isOpen ? (
                <ChevronUp className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            ) : (
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
            )}
        </div>
    );
}
