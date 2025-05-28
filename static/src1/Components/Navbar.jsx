import React from 'react';
import { NavLink } from 'react-router-dom'; // Import NavLink
import '../assets/css/global.css'; // Ensure Tailwind CSS is included in your global CSS
import Filter from '../../src/js/Pages/components/Filter';
import SortDropdown from '../pages/SortDropdown';
import Previewpage from '../pages/Previewpage';

export default function Navbar({ onFilterChange, sortOption, handleSortChange }) {
    return (
        <>
            {/* Top banner for free shipping */}
            <div className="bg-black text-white py-2 px-4 fixed w-full z-50 top-0">
                <div className="container mx-auto flex justify-between items-center">
                    <span className="text-sm">←</span>
                    <p className="flex items-center space-x-1">
                        <img src="path_to_free_shipping_icon" alt="Free Shipping" className="h-4 w-4" />
                        <span>Free Shipping Over $60+</span>
                    </p>
                    <span className="text-sm">→</span>
                </div>
            </div>

            {/* Main navigation bar */}
            <nav className="bg-white shadow-sm fixed w-full z-40 top-8">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    {/* Logo */}
                    <a href="/" className="text-2xl font-bold text-gray-800">DevShop</a>

                    {/* Navigation Links */}
                    <ul className="flex space-x-6">
                        {/* Use NavLink for dynamic routing */}
                        <li>
                            <NavLink
                                to="/"
                                className={({ isActive }) =>
                                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }
                            >
                                NEW
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/dashboard"
                                className={({ isActive }) =>
                                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }
                            >
                                DASHBOARD
                            </NavLink>
                        </li>

                        <Previewpage/>


                        <li>
                            <NavLink
                                to="/dashboarduser"
                                className={({ isActive }) =>
                                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }
                            >
                                DASHBOARDUSER
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/brand"
                                className={({ isActive }) =>
                                    isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'
                                }
                            >
                                BRAND
                            </NavLink>
                        </li>
                    </ul>

                    {/* Right-side elements */}
                    <div className="flex space-x-4">
                        {/* Currency Selector */}
                        <div className="relative">
                            <button className="text-gray-600 hover:text-gray-900 group flex items-center space-x-1">
                                <img src="path_to_currency_flag_icon" alt="Currency Flag" className="h-6 w-6" />
                                <span>USD $</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                            <div className="absolute hidden group-hover:block bg-white shadow-md py-2 px-4 rounded-md">
                                <a href="#" className="block text-gray-600 hover:text-gray-900">EUR €</a>
                                <a href="#" className="block text-gray-600 hover:text-gray-900">GBP £</a>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a2 2 0 002 2v4l-2-2v-4z" />
                                </svg>
                            </a>
                        </div>

                        {/* Search Icon */}
                        <div>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </a>
                        </div>

                        {/* Cart Icon */}
                        <div>
                            <a href="#" className="text-gray-600 hover:text-gray-900">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4l.6 2H5M7 13l-5-5m0 0l-5 5m5-5v5m0 0v-5" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Secondary bar for sorting and filtering */}
            <div className="bg-white shadow-sm fixed w-full z-30 top-20">
                <div className="container mx-auto px-4 py-2 flex justify-between items-center">
                    {/* Grid/List Toggles */}
                    <div className="flex space-x-4">
                        <button className="text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className='ml-auto'>
                        <SortDropdown sortOption={sortOption} onSortChange={handleSortChange} />
                    </div>


                    {/* Filter Button */}
                    <Filter onFilterChange={onFilterChange} />
                </div>
            </div>
        </>
    );
}