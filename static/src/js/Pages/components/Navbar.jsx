import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {Link, router, usePage} from '@inertiajs/react';
import { useCurrency } from './CurrencyContext.jsx';
import Previewpage from "./Previewpage.jsx";
import {useMegaMenu} from "./MegaMenuContext.jsx";
import ShopToolbar from "./ShopToolbar.jsx";
import {useFilter} from "./FilterContext.jsx";
import {useCart} from "./CartContext.jsx";
import debounce from 'lodash.debounce';

const Navbar = ({ setIsCartOpen, auth }) => {
    const { isMegaOpen } = useMegaMenu();
    const { url } = usePage();
    const { activeCategories = [], categories = {} } = usePage().props;
    const [products, setProducts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const searchBarRef = useRef(null);

    const [mobileOpen, setMobileOpen]     = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [userOpen, setUserOpen]         = useState(false);

    const currencyRef = useRef();
    const userRef     = useRef();

    const { cart } = useCart();

    const productCount = cart.reduce((sum, item) => sum + item.quantity, 0);


    const filterContext = useFilter();

    // Safely destructure with defaults
    const {
        filters = { categories: activeCategories, priceRange: [0, 1000000] },
        setFilters,
        sortOption = '',
        setSortOption,
        setLayout
    } = filterContext || {};

    const highlightMatch = (text, query) => {
        if (!query) return text;
        const regex = new RegExp(`(${query})`, 'gi');
        return text.split(regex).map((part, i) =>
            regex.test(part) ? <span key={i} className="bg-yellow-200 font-semibold">{part}</span> : part
        );
    };

    const getNormalizedPath = (path) => path.replace(/\/$/, '') || '/';

    const locationPath = typeof window !== 'undefined' ? window.location.pathname : url;
    const normalizedPath = getNormalizedPath(locationPath);
    const isAlwaysWhitePage = ['/products', '/about'].includes(normalizedPath);

    const isHomePage = locationPath === '/';
    const isProductDetailPage = locationPath.startsWith('/products/');

    const messages = [
        { text: 'Beware of Fake Website', icon: 'fas fa-exclamation-triangle', color: 'text-red-500' },
        { text: 'FREE SHIPPING ON ORDERS OVER $50', icon: 'fas fa-tag', color: 'text-blue-500' },
        { text: 'Limited Time Offer - 20% OFF!', icon: 'fas fa-tag', color: 'text-yellow-400' },
        { text: 'Get 15% Off Your First Purchase, Subscribe now !', icon: 'fas fa-tag', color: 'text-yellow-400' },
    ];



    useEffect(() => {
        const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % messages.length), 4000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!isHomePage) return;
        const handleScroll = () => setIsScrolled(window.scrollY > 200);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isHomePage]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isSearchOpen]);

    useEffect(() => {
        document.body.style.overflow = isSearchOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isSearchOpen]);

    const shouldShowWhiteNavbar = isAlwaysWhitePage || isProductDetailPage || isCurrencyOpen || isSearchOpen || (isHomePage && (isScrolled || isHovered));
    const navbarStyle = shouldShowWhiteNavbar ? 'bg-white text-black shadow-md' : 'bg-transparent text-white';
    const linkTextColor = shouldShowWhiteNavbar ? 'text-black' : 'text-white';

    const currentMessage = messages[currentIndex];
    const renderStars = () => '★★★★★';

    const menuRef = useRef(null);
    const toggleButtonRef = useRef(null);


    useEffect(() => {
        function handler(e) {
            if (currencyRef.current && !currencyRef.current.contains(e.target)) {
                setCurrencyOpen(false);
            }
            if (userRef.current && !userRef.current.contains(e.target)) {
                setUserOpen(false);
            }
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

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

    // 3) Toolbar & sidebar visibility
    const pathname =
        typeof window !== 'undefined'
            ? window.location.pathname.replace(/\/+$/, '')
            : '/';

// Use these after pathname is defined
    const isProductDetail = /^\/products\/[^/]+$/.test(pathname); // e.g., /products/shoe-123
    const isShopAllPage = pathname === '/products';

    const hideLayoutPatterns = [/^\/checkout$/, /^\/products\/\d+\/review/];
    const shouldHideLayout = hideLayoutPatterns.some(rx => rx.test(pathname));


    return (
        <div className="w-full fixed top-0 left-0 z-50">
            {/* Warning Bar */}
            <div className="bg-gray-800 text-white p-3 flex items-center justify-center space-x-2">
                <div className="flex items-center font-bold space-x-2">
                    <i className="fas fa-chevron-left"></i>
                    <span className={`${currentMessage.color}`}><i className={currentMessage.icon}></i></span>
                    <span>{currentMessage.text}</span>
                    <i className="fas fa-chevron-right"></i>
                </div>
            </div>

            {/* Navbar */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-4 flex items-center justify-between transition-all duration-500 ease-in-out ${navbarStyle}`}
            >
                {/* Logo */}
                <div className="text-4xl font-bold flex-1">
                    <Link href="/" className="text-sky-500 px-5">DevShop</Link>
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center justify-between flex-1">
                    <div className="hidden md:flex space-x-8 absolute left-1/2 transform -translate-x-1/2">
                        <Link href="/" className={`hover:opacity-70 text-lg font-semibold hover:text-blue-500 ${linkTextColor}`}>Home</Link>
                        <Previewpage linkTextColor={linkTextColor} />
                        <Link href="/about" className={`hover:opacity-70 text-lg font-semibold hover:text-blue-500 ${linkTextColor}`}>About</Link>
                    </div>

                    {/* Icons */}
                    <div className="flex ms-auto items-center space-x-8">
                        <div className="relative"  ref={currencyRef}>
                            <button onClick={() => setIsCurrencyOpen(!isCurrencyOpen)} className={`flex items-center hover:opacity-70 ${linkTextColor}`}>
                                <img src={selectedCurrency.icon} alt={selectedCurrency.country} className="w-4 h-4 mr-2 object-cover" />
                                <span>{selectedCurrency.code} {selectedCurrency.symbol}</span>
                                <i className="fas fa-chevron-down ml-1"></i>
                            </button>
                            {isCurrencyOpen && (
                                <div className="absolute right-0 mt-2 w-68 bg-white shadow-lg z-60 text-black max-h-[360px] overflow-y-auto border border-gray-300">
                                    {currencies.map(currency => (
                                        <button key={currency.code} className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                                                onClick={() => {
                                                    setSelectedCurrency(currency);
                                                    setIsCurrencyOpen(false);
                                                }}>
                                            <img src={currency.icon} alt={currency.country} className="w-5 h-5 mr-3 object-cover" />
                                            <span className="flex-1 text-left">
                                                {currency.country}
                                                <span className="text-gray-600"> ({currency.code} {currency.symbol})</span>
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* User / Login */}
                        <div ref={userRef} className="relative">
                            {auth && auth.user ? (
                                <button
                                    onClick={() => setUserOpen(o => !o)}
                                    className="hover:text-gray-700"
                                >
                                    <i className={`far fa-user text-xl ${linkTextColor}`}></i>
                                </button>
                            ) : (
                                <a href="/accounts/login/" className="hover:text-gray-700">
                                    <i className={`far fa-user text-xl ${linkTextColor}`}></i>
                                </a>
                            )}

                            {userOpen && auth && auth.user && (
                                <ul className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg text-sm">
                                    <li>
                                        <Link
                                            href="/dashboard/"
                                            className="block px-4 py-2 hover:bg-gray-100"
                                        >
                                            My Dashboard
                                        </Link>
                                    </li>
                                    <li className="border-t">
                                        <a
                                            href="/accounts/logout/"
                                            className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                                        >
                                            <i className={`far fa-user text-xl ${linkTextColor}`}></i> Logout
                                        </a>
                                    </li>
                                </ul>
                            )}
                        </div>
                        <button onClick={() => setIsCartOpen(true)} className="relative">
                            <i className="fas fa-shopping-bag text-xl"></i>
                            {productCount > 0 && (
                                <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {productCount}
                                </span>
                            )}
                        </button>

                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    ref={toggleButtonRef}
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    className={`md:hidden text-2xl focus:outline-none ${linkTextColor}`}
                    aria-label="Toggle menu"
                >
                    <i className={isMenuOpen ? "fas fa-times" : "fas fa-bars"}></i>
                </button>
            </div>

            {/* Mobile Dropdown Menu */}
            {isMenuOpen && (
                <div ref={menuRef} className="md:hidden absolute top-full left-0 w-full bg-white shadow-lg z-60">
                    <div className="p-4 flex flex-col space-y-4 border-t border-gray-200">
                        <Link href="/" className="p-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={() => setIsMenuOpen(false)}>Home</Link>
                        <Link href="/products" className="p-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={() => setIsMenuOpen(false)}>SHOP ALL</Link>
                        <Link href="/story" className="p-2 hover:bg-gray-100 rounded-md text-gray-700" onClick={() => setIsMenuOpen(false)}>About</Link>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Nav */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 flex justify-around items-center py-2 md:hidden z-50 shadow-md">
                <Link href="/login" className="text-black"><i className="far fa-user text-xl"></i></Link>
                <button onClick={() => setIsCartOpen(true)} className="relative text-black">
                    <i className="fas fa-shopping-bag text-xl"></i>
                    {productCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {productCount}
                        </span>
                    )}
                </button>
            </div>

            {/* Toolbar */}
            {!shouldHideLayout && isShopAllPage && !isMegaOpen && filterContext && !isProductDetail && (
                <div className="fixed top-[116px] w-full z-50 border-t border-b border-gray-300">
                    <ShopToolbar
                        sortOption={sortOption}
                        onSortChange={handleSortChange}
                        onFilterChange={handleFilterChange}
                        onLayoutChange={setLayout}
                        categories={categories} // Make sure this is passed from parent
                        activeCategories={filters.categories}
                    />
                </div>
            )}

        </div>
    );
};

export default Navbar;