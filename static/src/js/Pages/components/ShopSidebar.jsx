import React from 'react';
import ShopSection from "./ShopSection.jsx";

const ShopSidebar = ({ isOpen, onClose, cart, setCart, handleRemoveFromCart }) => {

    return (
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
                    isOpen={isOpen}  // ✅ Pass this
                    onClose={onClose}
                    cart={cart} // ✅ Pass this
                    setCart={setCart}
                    handleRemoveFromCart={handleRemoveFromCart}  // ✅ Pass this
                />
            </div>
        </div>
    );
};

export default ShopSidebar;
