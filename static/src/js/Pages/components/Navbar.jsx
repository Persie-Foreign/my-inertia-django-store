// static/src/js/Pages/components/Navbar.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link, usePage } from "@inertiajs/react";
import { useCurrency, currencies } from "./CurrencyContext.jsx";
import {
    FiMenu,
    FiUser,
    FiChevronDown,
    FiShoppingBag
} from "react-icons/fi";

export default function Navbar({ onCartClick }) {
    const { auth } = usePage().props;       // from your Inertia share middleware
    const { selectedCurrency, setSelectedCurrency } = useCurrency();

    const [mobileOpen, setMobileOpen]     = useState(false);
    const [currencyOpen, setCurrencyOpen] = useState(false);
    const [userOpen, setUserOpen]         = useState(false);

    const currencyRef = useRef();
    const userRef     = useRef();

    // close menus when clicking outside
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

    return (
        <header className="bg-white shadow sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-2xl font-bold">DevShop</Link>

                {/* Desktop nav */}
                <nav className="hidden md:flex space-x-6">
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                    <Link href="/products" className="hover:text-gray-700">Shop All</Link>
                    <Link href="/about" className="hover:text-gray-700">About</Link>
                </nav>

                <div className="flex items-center space-x-4">
                    {/* Currency selector */}
                    <div ref={currencyRef} className="relative">
                        <button
                            onClick={() => setCurrencyOpen(o => !o)}
                            className="flex items-center hover:text-gray-700"
                        >
                            <img
                                src={selectedCurrency.icon}
                                alt={selectedCurrency.code}
                                className="w-5 h-5 rounded-sm mr-1"
                            />
                            <span className="font-medium">{selectedCurrency.code}</span>
                            <FiChevronDown className="ml-1" />
                        </button>
                        {currencyOpen && (
                            <ul className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg">
                                {currencies.map(c => (
                                    <li key={c.code}>
                                        <button
                                            onClick={() => {
                                                setSelectedCurrency(c);
                                                setCurrencyOpen(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                                        >
                                            <img
                                                src={c.icon}
                                                alt={c.code}
                                                className="w-5 h-5 rounded-sm mr-2"
                                            />
                                            <span>{c.code}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Cart icon */}
                    <button
                        onClick={onCartClick}
                        className="hover:text-gray-700"
                    >
                        <FiShoppingBag size={20} />
                    </button>

                    {/* User / Login */}
                    <div ref={userRef} className="relative">
                        {auth.user ? (
                            <button
                                onClick={() => setUserOpen(o => !o)}
                                className="hover:text-gray-700"
                            >
                                <FiUser size={20} />
                            </button>
                        ) : (
                            <Link href="/accounts/login/" className="hover:text-gray-700">
                                <FiUser size={20} />
                            </Link>
                        )}

                        {userOpen && auth.user && (
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
                                    <Link
                                        href="/accounts/logout/"
                                        className="block px-4 py-2 hover:bg-gray-100 flex items-center"
                                    >
                                        <FiUser className="mr-2" /> Logout
                                    </Link>
                                </li>
                            </ul>
                        )}
                    </div>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden hover:text-gray-700"
                    onClick={() => setMobileOpen(o => !o)}
                >
                    <FiMenu size={24} />
                </button>
            </div>

            {/* Mobile Nav */}
            {mobileOpen && (
                <nav className="md:hidden bg-white border-t border-gray-200">
                    <ul className="space-y-1 px-4 py-2">
                        <li>
                            <Link href="/" className="block py-2 hover:bg-gray-100">Home</Link>
                        </li>
                        <li>
                            <Link href="/products" className="block py-2 hover:bg-gray-100">Shop All</Link>
                        </li>
                        <li>
                            <Link href="/about" className="block py-2 hover:bg-gray-100">About</Link>
                        </li>
                        <li className="border-t">
                            <button
                                onClick={() => setCurrencyOpen(o => !o)}
                                className="w-full text-left py-2 hover:bg-gray-100 flex items-center"
                            >
                                <img
                                    src={selectedCurrency.icon}
                                    alt={selectedCurrency.code}
                                    className="w-5 h-5 rounded-sm mr-2"
                                />
                                <span>{selectedCurrency.code}</span>
                                <FiChevronDown className="ml-auto" />
                            </button>
                        </li>

                        {auth.user ? (
                            <>
                                <li className="border-t">
                                    <Link
                                        href="/dashboard/"
                                        className="block py-2 hover:bg-gray-100"
                                    >
                                        My Dashboard
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/accounts/logout/"
                                        className="block py-2 hover:bg-gray-100"
                                    >
                                        Logout
                                    </Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="border-t">
                                    <Link
                                        href="/accounts/login/"
                                        className="block py-2 hover:bg-gray-100"
                                    >
                                        Login
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/accounts/signup/"
                                        className="block py-2 hover:bg-gray-100"
                                    >
                                        Sign Up
                                    </Link>
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            )}
        </header>
    );
}
