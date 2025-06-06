import React, { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css'; // ✅ Make sure this is imported!
import { currencies, useCurrency } from './CurrencyContext.jsx';

export default function Filter({
                                   categories = {},
                                   activeCategories = [],
                                   onFilterChange,
                                   setIsCartOpen,
                                   isCartOpen
                               }) {
    const [openParent, setOpenParent] = useState(null);
    const [selected, setSelected] = useState({
        categories: activeCategories,
        priceRange: [0, 1000000]
    });

    const { selectedCurrency, setSelectedCurrency } = useCurrency();

    const handleCheckboxChange = (category) => {
        let newCategories;
        if (activeCategories.includes(category)) {
            newCategories = activeCategories.filter(c => c !== category);
        } else {
            newCategories = [...activeCategories, category];
        }

        setSelected(s => ({ ...s, categories: newCategories }));

        onFilterChange({
            categories: newCategories,
            priceRange: selected.priceRange
        });
    };

    const onPriceChange = (range) => {
        const updated = { ...selected, priceRange: range };
        setSelected(updated);
        onFilterChange({
            categories: updated.categories,
            priceRange: range
        });
    };


    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    useEffect(() => {
        const code = localStorage.getItem('currency');
        const saved = currencies.find(c => c.code === code);
        if (saved) setSelectedCurrency(saved);
    }, []);

    useEffect(() => {
        localStorage.setItem('currency', selectedCurrency.code);
    }, [selectedCurrency]);


    return (
        <div className="w-full max-w-xs p-4 bg-white rounded space-y-6">
            {/* Category Filters */}
            <div className="space-y-4">
                {Object.entries(categories).map(([parentName, children]) => {
                    const isOpen = openParent === parentName;
                    return (
                        <div key={parentName} className="border-b border-gray-300 px-1 pb-2">
                            <button
                                onClick={() => setOpenParent(isOpen ? null : parentName)}
                                className="w-full flex justify-between items-center text-left font-medium text-gray-800 hover:text-blue-500"
                            >
                                <span>{parentName}</span>
                                {isOpen ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                            {isOpen && (
                                <div className="pt-2 pl-4 space-y-2">
                                    {children.map(sub => (
                                        <label key={sub.name} className="flex items-center space-x-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={activeCategories.includes(sub.name)}
                                                onChange={() => handleCheckboxChange(sub.name)}
                                            />
                                            <span>{sub.name}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Price Range */}
            <div>
                <h3 className="font-semibold mb-2">Price Range</h3>
                <Slider
                    range
                    min={0}
                    max={1000000}
                    step={1000}
                    value={selected.priceRange}
                    onChange={onPriceChange}
                />
                <div className="flex justify-between text-sm mt-2">
                    <span>{selectedCurrency.symbol}{selected.priceRange[0].toLocaleString()}</span>
                    <span>{selectedCurrency.symbol}{selected.priceRange[1].toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
