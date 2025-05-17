import React, { useEffect, useState } from 'react';
import '../assets/css/global.css';
import { products as allProducts } from '../pages/Product';
import Navbar from '../Components/NavBar';
import SortDropdown from './SortDropdown';

export default function ShopAll() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [sortOption, setSortOption] = useState('');
    console.log("Sorted products after applying sort option:", sortOption);
    const [filters, setFilters] = useState({ categories: [], priceRange: [0, Infinity] });

    // Initial load of products
    useEffect(() => {
        const initialFiltered = filterProducts(allProducts);
        const initialSorted = sortProducts(initialFiltered);
        setFilteredProducts(initialSorted);
    }, []);


    // Filter products based on categories and price range
    const filterProducts = (items) => {
        return items.filter((product) => {
            const inCategory =
                filters.categories.length === 0 || filters.categories.includes(product.name);

            const inPriceRange =
                product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1];

            return inCategory && inPriceRange;
        });
    };



    // Sort products based on selected option
    const sortProducts = (items) => {
        const sorted = [...items];
        switch (sortOption) {
            case 'best-selling':
                sorted.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'price-low-to-high':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-high-to-low':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'az':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'za':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'date-new-to-old':
                sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'date-old-to-new':
                sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            default:
                break;
        }
        return sorted;
    };

    // Handle sorting change
    const handleSortChange = (e) => {
        console.log("User selected sort option:", e.target.value);
        setSortOption(e.target.value);
    };

    // Handle filter change
    const handleFilterChange = (updatedFilters) => {
        setFilters(updatedFilters);
    };

    // Re-render when filters or sortOption changes
    useEffect(() => {
        const filtered = filterProducts(allProducts);
        const sorted = sortProducts(filtered);
        setFilteredProducts(sorted);
    }, [filters, sortOption]);

    return (
        <div>
            <Navbar onFilterChange={handleFilterChange} />
            <div className="flex justify-end px-4 mt-20">
                <SortDropdown sortOption={sortOption} onSortChange={handleSortChange} />
            </div>

            <div className="container mx-auto mt-30 my-8 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div key={product.id} className="bg-white overflow-hidden relative">
                            <div className="relative w-full h-64">
                                <img
                                    src={product.image1}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                                    <img
                                        src={product.image2}
                                        alt={`Hover of ${product.title}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="absolute top-1 left-2">
                                    <span className="bg-black text-white text-xs font-semibold py-1 px-2 mr-2">NEW</span>
                                </div>
                                <div className="absolute top-7 left-2">
                                    <span className="text-white bg-red-500 text-xs font-semibold">SAVE ${product.discount}</span>
                                </div>
                                <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
                                <p>{product.category}</p>

                                <div className="flex items-center mt-2">
                                    <span className="text-yellow-500 text-lg mr-1">★★★★★</span>
                                    <span className="text-gray-600">{product.reviews}</span>
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="text-gray-600 line-through">${product.oldPrice}</span>
                                    <span className="text-red-500">${product.price}</span>
                                </div>

                                <button className="relative overflow-hidden border border-gray-300 mt-4 py-2 px-16 group">
                                    <span className="absolute left-0 top-0 h-full w-0 bg-black transition-all duration-300 ease-out group-hover:w-full"></span>
                                    <span className="relative z-10 text-gray-800 group-hover:text-white font-semibold">
                                        ADD TO CART
                                    </span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
