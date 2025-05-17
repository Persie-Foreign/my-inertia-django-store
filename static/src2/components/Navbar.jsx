import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCurrency } from './CurrencyContext.jsx';

const Navbar = ({ setIsCartOpen }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const isAlwaysWhitePage = ['/shop', '/story'].includes(location.pathname);
    const isProductDetailPage = location.pathname.startsWith('/product/');

    const messages = [
        { text: 'Beware of Fake Website', icon: 'fas fa-exclamation-triangle', color: 'text-red-500' },
        { text: 'FREE SHIPPING ON ORDERS OVER $50', icon: 'fas fa-tag', color: 'text-blue-500' },
        { text: 'Limited Time Offer - 20% OFF!', icon: 'fas fa-tag', color: 'text-yellow-400' },
        { text: 'Get 15% Off Your First Purchase, Subscribe now !', icon: 'fas fa-tag', color: 'text-yellow-400' },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { selectedCurrency, setSelectedCurrency, currencies } = useCurrency();

    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [products, setProducts] = useState([]);

    const searchBarRef = useRef(null);

    const mockSuggestions = ['T-shirt', 'Shoes', 'Socks', 'Hat', 'Hoodie'];
    const mockProducts = [
        { name: 'Blue T-shirt', image: 'https://via.placeholder.com/80' },
        { name: 'Running Shoes', image: 'https://via.placeholder.com/80' },
    ];

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (!value.trim()) {
            setSuggestions([]);
            setProducts([]);
            return;
        }
        setSuggestions(mockSuggestions.filter(s => s.toLowerCase().includes(value.toLowerCase())));
        setProducts(mockProducts.filter(p => p.name.toLowerCase().includes(value.toLowerCase())));
    };

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

    const currentMessage = messages[currentIndex];
    const renderStars = () => '★★★★★';

    return (
        <div className="w-full fixed top-0 left-0 z-50">
            {/* Warning Bar */}
            <div className="bg-gray-800 text-white p-3 flex items-center justify-center">
                <div className="flex items-center font-bold space-x-2">
                    <i className="fas fa-chevron-left mr-2"></i>
                    <span className={`${currentMessage.color} mr-2 ml-[20rem]`}>
                        <i className={currentMessage.icon}></i>
                    </span>
                    <span className='mr-[20rem]'>{currentMessage.text}</span>
                    <i className="fas fa-chevron-right ml-2"></i>
                </div>
            </div>

            {/* Main Navbar */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`p-4 flex items-center justify-between transition-all duration-500 ease-in-out ${navbarStyle}`}
            >
                <div className="text-3xl font-bold">
                    <Link to="/">DevShop</Link>
                </div>

                <div className="flex space-x-8">
                    <Link to="/" className="hover:opacity-70">Home</Link>
                    <Link to="/shop" className="hover:opacity-70">SHOP ALL</Link>
                    <Link to="/story" className="hover:opacity-70">About</Link>
                </div>

                <div className="flex items-center space-x-[3rem]">
                    {/* Currency Selector */}
                    <div className="relative">
                        <button onClick={() => setIsCurrencyOpen(!isCurrencyOpen)} className="flex items-center hover:opacity-70">
                            <img src={selectedCurrency.icon} alt={selectedCurrency.country} className="w-4 h-4 mr-2 object-cover" />
                            <span>{selectedCurrency.code} {selectedCurrency.symbol}</span>
                            <i className="fas fa-chevron-down ml-1"></i>
                        </button>
                        {isCurrencyOpen && (
                            <div className="absolute right-0 mt-2 w-68 bg-white shadow-lg z-50 text-black max-h-[360px] overflow-y-auto border border-gray-300">
                                {currencies.map(currency => (
                                    <button
                                        key={currency.code}
                                        className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            setSelectedCurrency(currency);
                                            setIsCurrencyOpen(false);
                                        }}
                                    >
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

                    <Link to="/login"><i className="far fa-user text-xl"></i></Link>
                    <button onClick={() => setIsCartOpen(true)}><i className="fas fa-shopping-bag text-xl"></i></button>
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)}><i className="fas fa-search text-xl cursor-pointer"></i></button>
                </div>
            </div>

            {/* Search Bar */}
            {isSearchOpen && (
                <div ref={searchBarRef} className="w-full bg-white shadow-md p-4 flex flex-col relative z-40 border-t border-gray-300">
                    <button className="absolute right-4 focus:outline-none cursor-pointer" onClick={() => setIsSearchOpen(false)}>
                        <i className="fas fa-times text-gray-500"></i>
                    </button>

                    <div className="relative w-full">
                        <i className="fas fa-search text-gray-500 absolute left-2 top-3"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                            placeholder="Search for..."
                            className="w-full pl-10 pt-2 bg-transparent focus:outline-none"
                        />
                    </div>

                    {(suggestions.length > 0 || products.length > 0) && (
                        <div className="grid grid-cols-4 gap-8 mt-8 w-full pl-10">
                            <div className="col-span-1">
                                <h3 className="font-semibold mb-2 text-gray-700 border-b border-gray-300 pb-2">Suggestions</h3>
                                <ul className="space-y-2 mt-4">
                                    {suggestions.map((s, index) => (
                                        <li key={index} className="hover:underline cursor-pointer text-gray-600">{s}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="col-span-3">
                                <h3 className="font-semibold mb-2 text-gray-700 border-b border-gray-300 pb-2">Products</h3>
                                <div className="grid grid-cols-4 gap-4 mt-4">
                                    {products.map((p, index) => (
                                        <div key={index} className="bg-white border rounded-lg shadow-sm overflow-hidden flex flex-col">
                                            <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
                                            <div className="p-2 flex-1 text-sm">
                                                <p className="text-gray-800 font-semibold mb-1">{p.name}</p>
                                                <div className="flex items-center text-yellow-400 text-xs mb-1">
                                                    {renderStars()}
                                                    <span className="text-gray-500 ml-1">(12 reviews)</span>
                                                </div>
                                                <p className="text-gray-900 font-bold">$99</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Navbar;
