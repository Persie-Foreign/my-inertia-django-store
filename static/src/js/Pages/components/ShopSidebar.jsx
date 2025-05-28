// resources/js/Pages/ShopSidebar.jsx

import React, {useState} from 'react';
import ShopSection from "./ShopSection.jsx";
import {Head, usePage} from '@inertiajs/react'; // ✅ Needed for Inertia pages

const ShopSidebar = ({ isOpen, onClose, cart, setCart, handleRemoveFromCart }) => {
    const { productsByCategory = {} } = usePage().props;
    const categories = Object.keys(productsByCategory);
    const [activeTab, setActiveTab] = useState(categories[0]);
    return (
        <>
            <Head title="Your Cart" /> {/* Optional: sets the page title */}
            <div className={`fixed inset-0 z-50 ${isOpen ? '' : 'pointer-events-none'}`}>
                {/* Backdrop */}
                <div
                    className={`fixed inset-0 bg-black/50 bg-opacity-50 transition-opacity duration-300 ${
                        isOpen ? 'opacity-50' : 'opacity-0'
                    }`}
                    onClick={onClose}
                ></div>

                {/* Sidebar */}
                <div
                    className={`fixed top-0 right-0 w-full sm:w-[430px] bg-white h-full shadow-lg transform transition-transform duration-300 ${
                        isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                >
                    <ShopSection
                        isOpen={isOpen}
                        onClose={onClose}
                        cart={cart}
                        setCart={setCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                        selectedCategory={activeTab}
                    />
                </div>
            </div>
        </>
    );
};

export default ShopSidebar;
