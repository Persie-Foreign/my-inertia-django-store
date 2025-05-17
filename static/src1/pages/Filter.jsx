import React, { useState, useEffect } from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

export default function Filter({ onFilterChange }) {
    const [showFilter, setShowFilter] = useState(false);
    const [priceRange, setPriceRange] = useState([10, 500]);
    const [selectedFilters, setSelectedFilters] = useState({
        categories: [],
        priceRange: [10, 500],
    });

    const sections = [
        {
            title: "Électroniques",
            options: ["Téléphone", "Montres Connectées", "Ordinateurs", "Écrans TV"],
        },
        {
            title: "Électroménagers",
            options: [
                "Réfrigérateurs",
                "Machines à laver",
                "Fers à repasser",
                "Micro-ondes",
                "Cuisinières",
                "Climatisations",
            ],
        },
        {
            title: "Vêtements",
            options: ["Hommes", "Femmes", "Enfants"],
        },
        {
            title: "Cosmétiques",
            options: ["Parfums", "Laits de toilette", "Savons", "Masques & Gommages"],
        },
        {
            title: "Meubles",
            options: ["Bureaux", "Chaises de bureau", "Salles à manger", "Lits & Matelas"],
        },
    ];

    // Only update local state without applying filters immediately
    const handlePriceChange = (value) => {
        setPriceRange(value);
        setSelectedFilters((prev) => ({
            ...prev,
            priceRange: value,
        }));
    };

    const handlePriceInputChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = value;
        setPriceRange(newRange);
        setSelectedFilters((prev) => ({
            ...prev,
            priceRange: newRange,
        }));
    };

    const handleCategoryChange = (option) => {
        const updatedCategories = selectedFilters.categories.includes(option)
            ? selectedFilters.categories.filter((cat) => cat !== option)
            : [...selectedFilters.categories, option];

        setSelectedFilters((prev) => ({
            ...prev,
            categories: updatedCategories,
        }));
    };

    // ← Add this effect to lock body scroll when sidebar is open:
    useEffect(() => {
        document.body.style.overflow = showFilter ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [showFilter]);


    // Apply filters only when user clicks "View Results"
    const handleViewResults = () => {
        onFilterChange(selectedFilters);
        setShowFilter(false);
    };

    return (
        <div className="relative">
            {/* Filter Button */}
            <div className="flex justify-between items-center px-4 py-3 bg-white shadow-sm sticky top-0 z-40">
                <button
                    onClick={() => setShowFilter(true)}
                    className="border border-gray-300 px-4 py-2 text-gray-600 hover:text-gray-900 hover:border-gray-500"
                >
                    Filter
                </button>
            </div>

            {/* Overlay */}
            {showFilter && (
                <div
                    className="fixed inset-0 bg-black/70 z-40"
                    onClick={() => setShowFilter(false)}
                />
            )}

            {/* Filter Sidebar */}
            <div
                className={`fixed top-20 right-0 w-80 max-h-[calc(100vh-5rem)] overflow-y-auto bg-white shadow-lg z-50 transform transition-transform duration-300 ${showFilter ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center px-4 py-4 border-b">
                    <h2 className="text-lg font-semibold">Filters</h2>
                    <button
                        onClick={() => setShowFilter(false)}
                        className="text-gray-600 hover:text-black text-xl"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-4 space-y-6">
                    {/* Category Filters */}
                    <div className="space-y-4">
                        {sections.map((section, index) => (
                            <details key={index} className="border-b pb-2 group">
                                <summary className="flex items-center justify-between px-4 py-2 font-medium cursor-pointer list-none">
                                    <span>{section.title}</span>
                                    <svg
                                        className="w-4 h-4 transform transition-transform duration-200 group-open:rotate-90"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                                    </svg>
                                </summary>
                                <div className="mt-2 pl-6 space-y-2">
                                    {section.options.map((opt, i) => (
                                        <label key={i} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox"
                                                checked={selectedFilters.categories.includes(opt)}
                                                onChange={() => handleCategoryChange(opt)}
                                            />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </details>
                        ))}
                    </div>

                    {/* Price Range Filter */}
                    <div className="space-y-4">
                        <h3 className="font-semibold">Price Range:</h3>
                        <Slider
                            range
                            min={0}
                            max={1000}
                            step={5}
                            value={priceRange}
                            onChange={handlePriceChange}
                            trackStyle={[{ backgroundColor: "#000" }]}
                            handleStyle={[
                                { borderColor: "#000", backgroundColor: "#fff" },
                                { borderColor: "#000", backgroundColor: "#fff" },
                            ]}
                        />
                        <div className="flex justify-between items-center space-x-2 mt-2">
                            <input
                                type="number"
                                min={0}
                                max={priceRange[1]}
                                value={priceRange[0]}
                                onChange={(e) =>
                                    handlePriceInputChange(0, Number(e.target.value))
                                }
                                className="w-1/2 border px-2 py-1 rounded text-sm"
                                placeholder="Min"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                min={priceRange[0]}
                                max={1000}
                                value={priceRange[1]}
                                onChange={(e) =>
                                    handlePriceInputChange(1, Number(e.target.value))
                                }
                                className="w-1/2 border px-2 py-1 rounded text-sm"
                                placeholder="Max"
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleViewResults}
                        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
                    >
                        View Results
                    </button>
                </div>
            </div>
        </div>
    );
}
