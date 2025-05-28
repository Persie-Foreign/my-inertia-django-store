import React from 'react';
import { Head } from '@inertiajs/react';
import CartSection from './CartSection.jsx';

const CartSidebar = ({ isOpen, onClose }) => {
    return (
        <>
            <Head title="Cart" />

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-transparent bg-opacity-50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed top-0 right-0 w-full sm:w-[430px] h-full bg-white shadow-lg z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <CartSection onClose={onClose} />
            </div>
        </>
    );
};

export default CartSidebar;
