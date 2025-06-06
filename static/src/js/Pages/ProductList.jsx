 // src/Pages/ProductList.jsx

import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import ShopToolbar from './components/ShopToolbar.jsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useMegaMenu } from './components/MegaMenuContext.jsx';
import toast from 'react-hot-toast';
import { useCart } from './components/CartContext.jsx';
import { currencies, useCurrency } from './components/CurrencyContext.jsx';
import ShopSidebar from './components/ShopSidebar.jsx';
import Filter from './components/Filter.jsx';
 import {useFilter} from "./components/FilterContext.jsx";

export default function ProductList({ setIsCartOpen, isCartOpen }) {
    const { products, activeCategories = [], categories = {} } = usePage().props;
    const { filters, setFilters, sortOption, layout } = useFilter();
    const { selectedCurrency, setSelectedCurrency, convertAmount } = useCurrency();

    // Initialize filters with server data
    useEffect(() => {
        if (activeCategories.length > 0) {
            setFilters({
                categories: activeCategories,
                priceRange: [0, 1000000]
            });
        }
    }, [activeCategories, setFilters]);


    // 1) Filtering & sorting
    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (filters.categories.length) {
            result = result.filter(p => filters.categories.includes(p.category.name));
        }

        result = result.filter(
            p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
        );

        switch (sortOption) {
            case 'price-low-to-high':
                return [...result].sort((a, b) => a.price - b.price);
            case 'price-high-to-low':
                return [...result].sort((a, b) => b.price - a.price);
            case 'az':
                return [...result].sort((a, b) => a.title.localeCompare(b.title));
            case 'za':
                return [...result].sort((a, b) => b.title.localeCompare(a.title));

            case 'best-selling':
                // Assuming "best selling" is based on is_best boolean
                return [...result].sort((a, b) => (b.is_best === true) - (a.is_best === true));

            case 'date-new-to-old':
                return [...result].sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return isNaN(dateB) || isNaN(dateA) ? 0 : dateB - dateA;
                });

            case 'date-old-to-new':
                return [...result].sort((a, b) => {
                    const dateA = new Date(a.created_at);
                    const dateB = new Date(b.created_at);
                    return isNaN(dateA) || isNaN(dateB) ? 0 : dateA - dateB;
                });

            default:
                return result;
        }

    }, [products, filters, sortOption]);



    // 2) Handlers
    const handleSortChange = e => setSortOption(e.target.value);
    const handleFilterChange = updated => {
        setFilters(updated);
        router.get(
            '/products',
            { category: updated.categories, min_price: updated.priceRange[0], max_price: updated.priceRange[1] },
            { preserveState: true, replace: true }
        );
    };
    const handleLayoutChange = l => setLayout(l);
    const handleRemoveCategory = cat => {
        handleFilterChange({
            ...filters,
            categories: filters.categories.filter(c => c !== cat),
        });
    };


    const handleClearAll = () => handleFilterChange({ categories: [], priceRange: [0, Infinity] });

    // 3) Toolbar & sidebar visibility
    const pathname = typeof window !== 'undefined'
        ? window.location.pathname.replace(/\/+$/, '')
        : '/';
    const hideLayoutPatterns = [/^\/checkout$/, /^\/products\/\d+\/review/];
    const shouldHideLayout = hideLayoutPatterns.some(rx => rx.test(pathname));
    const isShopAllPage = pathname.startsWith('/products');
    const { isMegaOpen } = useMegaMenu();

    // 4) Cart logic
    const { cart, setCart } = useCart();
    const handleAddToCart = (product) => {
        setCart(prev => {
            const total = prev.reduce((sum, x) => sum + x.quantity, 0);
            if (total >= 10) {
                toast.error('Cart limit reached.');
                return prev;
            }

            const found = prev.find(x => x.id === product.id);
            if (found) {
                return prev.map(x =>
                    x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    image_url: product.images[0] || '',
                    quantity: 1,
                    size: '',
                    category: product.category.name, // **Important!**
                    price: product.price,
                    original_price: product.original_price,
                },
            ];
        });

        setIsCartOpen(true);
    };


    const handleRemoveFromCart = id => setCart(c => c.filter(x => x.id !== id));

    // 5) Currency persistence
    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
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
        <>
            <Head title="Products" />


            {/* Product Grid */}
            <div className="container mx-auto px-4 py-10 mt-[10rem]">
                {(filters.categories || []).length > 0 && (
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            {(filters.categories || []).map(cat => (
                                <div
                                    key={cat}
                                    className="inline-flex items-center bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-lg hover:bg-purple-300 select-none"
                                    style={{ zIndex: 50, position: 'relative' }} // temporary
                                >
                                    <span>{cat}</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            console.log('Removing category:', cat);
                                            handleRemoveCategory(cat);
                                        }}
                                        className="ml-2 font-bold focus:outline-none cursor-pointer"
                                        aria-label={`Remove category ${cat}`}
                                        type="button"
                                    >
                                        X
                                    </button>

                                </div>
                            ))}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    console.log("Clear All clicked");
                                    handleClearAll();
                                }}
                                className="relative z-20 bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-lg cursor-pointer"
                                style={{ zIndex: 50, position: 'relative' }}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                )}

                <div className={`grid grid-cols-1 ${layout} gap-6`}>
                    <AnimatePresence>
                        {filteredProducts.length > 0
                            ? filteredProducts.map((p,i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: i * 0.05 }}
                                >
                                    {/* Click any part of this card to add & open sidebar */}
                                    <div
                                        className="bg-white shadow rounded overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                                    >
                                        <Link
                                            key={p.id}
                                            href={`/products/${p.slug}/`}
                                            className="block group relative overflow-hidden h-48 w-full"
                                        >
                                            <div className="relative w-full h-64 group">
                                                <img
                                                    src={p.images[0]}
                                                    alt={p.title}
                                                    className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out group-hover:opacity-0"
                                                />
                                                {p.images[1] && (
                                                    <img
                                                        src={p.images[1]}
                                                        alt={`${p.title} hover`}
                                                        className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out group-hover:opacity-100"
                                                    />
                                                )}
                                                <div className="absolute top-1 left-1 flex flex-col items-start space-y-0.5 z-20 w-max">
                                                    {p.is_new && (
                                                        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded inline-block">
                                                            NEW
                                                        </span>
                                                    )}
                                                    {p.is_best && (
                                                        <span className="bg-black text-white text-xs px-2 py-1 rounded inline-block">
                                                            BEST
                                                        </span>
                                                    )}
                                                    {p.save_amount != null && (
                                                        <span className="bg-red-600 text-white text-xs px-2 py-1 rounded inline-block">
                                                            SAVE FCFA{p.save_amount}
                                                        </span>
                                                    )}
                                                </div>

                                            </div>
                                        </Link>

                                        {/* Details */}
                                        {layout !== "grid-cols-6" && (
                                            <div className="p-4">
                                                <Link
                                                    href={`/products/${p.slug}`}
                                                    className="block text-xl font-semibold mb-2"
                                                >
                                                    <h4 className="text-lg font-semibold">{p.title}</h4>
                                                </Link>
                                                <p className="text-sm text-gray-600">{p.category.name}</p>
                                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <span
                                                            key={idx}
                                                            className={
                                                                idx < Math.round(p.reviews_count / 5)
                                                                    ? 'text-green-900 mr-1'
                                                                    : 'text-gray-300 mr-1'
                                                            }
                                                        >★</span>
                                                    ))}
                                                    <span>{p.reviews_count} Reviews</span>
                                                </div>
                                                <div className="flex items-baseline justify-center mb-4">
                                                    <span className="text-xl font-bold text-red-500">
                                                      {selectedCurrency.symbol}
                                                        {convertAmount(p.price).toFixed(2)}
                                                    </span>
                                                    {p.original_price && (
                                                        <span className="ml-2 text-gray-400 line-through">
                                                              {selectedCurrency.symbol}
                                                            {convertAmount(p.original_price).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center justify-between mt-2">
                                                    <button
                                                        onClick={() => handleAddToCart(p)}
                                                        className="w-full py-2 border border-gray-300 group relative overflow-hidden"
                                                    >
                            <span className="relative z-10 group-hover:text-white font-semibold">
                              Add to Cart
                            </span>
                                                        <span className="absolute inset-0 bg-black scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300"></span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))
                            : (
                                <motion.p
                                    className="col-span-full text-center text-gray-500 py-10"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    No products found.
                                </motion.p>
                            )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Slide-in Cart / Frequently-Bought */}
            <ShopSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                setCart={setCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        </>
    );
}