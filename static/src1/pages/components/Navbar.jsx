import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useCurrency } from './CurrencyContext.jsx';

export default function Navbar({ setIsCartOpen }) {
    // 1) Get current URL from Inertia
    const { url } = usePage();
    const pathname = new URL(url, window.location.origin).pathname;
    const isHomePage = pathname === '/';
    const isAlwaysWhitePage = ['/shop', '/story'].includes(pathname);
    const isProductDetailPage = pathname.startsWith('/product/');

    // 2) State for warning carousel
    const messages = [
        { text: 'Beware of Fake Website', icon: 'fas fa-exclamation-triangle', color: 'text-red-500' },
        { text: 'FREE SHIPPING ON ORDERS OVER $50', icon: 'fas fa-tag', color: 'text-blue-500' },
        { text: 'Limited Time Offer - 20% OFF!', icon: 'fas fa-tag', color: 'text-yellow-400' },
        { text: 'Get 15% Off Your First Purchase, Subscribe now!', icon: 'fas fa-tag', color: 'text-yellow-400' },
    ];
    const [currentIndex, setCurrentIndex] = useState(0);

    // 3) Scroll & hover detection
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    // 4) Currency & search toggles
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

    // 5) Search internals
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [products, setProducts] = useState([]);
    const searchBarRef = useRef(null);

    const mockSuggestions = ['T-shirt', 'Shoes', 'Socks', 'Hat', 'Hoodie'];
    const mockProducts = [
        { name: 'Blue T‑shirt', image: 'https://via.placeholder.com/80' },
        { name: 'Running Shoes', image: 'https://via.placeholder.com/80' },
    ];

    // Message carousel auto‑advance
    useEffect(() => {
        const iv = setInterval(() => {
            setCurrentIndex((i) => (i + 1) % messages.length);
        }, 4000);
        return () => clearInterval(iv);
    }, []);

    // Scroll only on home page
    useEffect(() => {
        if (!isHomePage) return;
        const onScroll = () => setIsScrolled(window.scrollY > 200);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, [isHomePage]);

    // Click‑outside to close search
    useEffect(() => {
        const onClick = (e) => {
            if (isSearchOpen && searchBarRef.current && !searchBarRef.current.contains(e.target)) {
                setIsSearchOpen(false);
            }
        };
        document.addEventListener('mousedown', onClick);
        return () => document.removeEventListener('mousedown', onClick);
    }, [isSearchOpen]);

    // Prevent background scroll when search is open
    useEffect(() => {
        document.body.style.overflow = isSearchOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isSearchOpen]);

    // Handle input changes
    const handleSearchChange = (e) => {
        const v = e.target.value;
        setSearchQuery(v);
        if (!v.trim()) {
            setSuggestions([]);
            setProducts([]);
        } else {
            setSuggestions(mockSuggestions.filter(s =>
                s.toLowerCase().includes(v.toLowerCase())
            ));
            setProducts(mockProducts.filter(p =>
                p.name.toLowerCase().includes(v.toLowerCase())
            ));
        }
    };

    // Determine navbar styling
    const white = isAlwaysWhitePage
        || isProductDetailPage
        || isCurrencyOpen
        || isSearchOpen
        || (isHomePage && (isScrolled || isHovered));
    const navbarClass = white
        ? 'bg-white text-black shadow-md'
        : 'bg-transparent text-white';

    const currentMessage = messages[currentIndex];

    return (
        <div className="w-full fixed top-0 left-0 z-50">
            {/* Warning bar */}
            <div className="bg-gray-800 text-white p-2 flex justify-center">
                <div className="flex items-center space-x-2 font-bold">
                    <i className="fas fa-chevron-left" />
                    <span className={`${currentMessage.color}`}>
            <i className={currentMessage.icon} />
          </span>
                    <span>{currentMessage.text}</span>
                    <i className="fas fa-chevron-right" />
                </div>
            </div>

            {/* Main navbar */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`transition duration-500 ease-in-out p-4 flex items-center justify-between ${navbarClass}`}
            >
                {/* Logo */}
                <div className="text-2xl font-bold">
                    <Link href="/">DevShop</Link>
                </div>

                {/* Links */}
                <div className="flex space-x-6">
                    <Link href="/" className="hover:opacity-70">Home</Link>
                    <Link href="/shop" className="hover:opacity-70">SHOP ALL</Link>
                    <Link href="/story" className="hover:opacity-70">About</Link>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-6">
                    {/* Currency */}
                    <div className="relative">
                        <button
                            onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                            className="flex items-center hover:opacity-70"
                        >
                            <img
                                src={selectedCurrency.icon}
                                alt={selectedCurrency.country}
                                className="w-5 h-5 mr-1"
                            />
                            <span>{selectedCurrency.code} {selectedCurrency.symbol}</span>
                            <i className="fas fa-chevron-down ml-1" />
                        </button>
                        {isCurrencyOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white text-black shadow-lg border border-gray-200 rounded">
                                {currencies.map((c) => (
                                    <button
                                        key={c.code}
                                        onClick={() => {
                                            setSelectedCurrency(c);
                                            setIsCurrencyOpen(false);
                                        }}
                                        className="w-full text-left px-3 py-2 flex items-center hover:bg-gray-100"
                                    >
                                        <img src={c.icon} alt={c.country} className="w-5 h-5 mr-2" />
                                        <span className="flex-1">{c.country} <span className="text-gray-600">({c.code})</span></span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* User, Cart, Search */}
                    <Link href="/login"><i className="far fa-user text-xl" /></Link>
                    <button onClick={() => setIsCartOpen(true)}><i className="fas fa-shopping-bag text-xl" /></button>
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)}><i className="fas fa-search text-xl" /></button>
                </div>
            </div>

            {/* Search overlay */}
            {isSearchOpen && (
                <div
                    ref={searchBarRef}
                    className="absolute top-full w-full bg-white shadow-md p-4 border-t border-gray-200 z-40"
                >
                    <button
                        className="absolute right-4"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <i className="fas fa-times text-gray-500" />
                    </button>
                    <div className="relative">
                        <i className="fas fa-search text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for..."
                            className="w-full pl-8 py-2 border border-gray-300 rounded focus:outline-none"
                        />
                    </div>
                    {(suggestions.length > 0 || products.length > 0) && (
                        <div className="mt-4 grid grid-cols-4 gap-4">
                            {/* Suggestions */}
                            <div>
                                <h4 className="font-semibold mb-2">Suggestions</h4>
                                <ul className="space-y-1">
                                    {suggestions.map((s, i) => (
                                        <li key={i} className="cursor-pointer hover:underline text-gray-700">{s}</li>
                                    ))}
                                </ul>
                            </div>
                            {/* Products */}
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                                {products.map((p, i) => (
                                    <div key={i} className="border rounded shadow-sm overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full h-24 object-cover" />
                                        <div className="p-2">
                                            <p className="font-semibold">{p.name}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
