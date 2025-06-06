// src/components/AppLayout.jsx
import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ShopSidebar from './ShopSidebar.jsx';
import CartSidebar from './CartSidebar.jsx';
import { Toaster } from 'react-hot-toast';
import { useCart } from './CartContext.jsx';
import {FilterProvider} from "./FilterContext.jsx";

export default function AppLayout({ children }) {
    const { auth, url: inertiaUrl } = usePage().props;
    const { products = [] } = usePage().props;
    const filteredProducts = products.slice(0, 10);
    // Normalize pathname without trailing slash
    const getPathname = () => {
        if (typeof window !== 'undefined') {
            return window.location.pathname.replace(/\/+$/, '');
        }
        return inertiaUrl
            ? new URL(inertiaUrl, 'http://dummy').pathname.replace(/\/+$/, '')
            : '/';
    };
    const pathname = getPathname();

    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart, setCart } = useCart();

    // Patterns for routes where we want NO Navbar or Footer
    const hideLayoutPatterns = [
        /^\/checkout$/,
        /^\/products\/\d+\/review$/,         // the “write a review” form
        /^\/products\/\d+\/review\/thanks$/, // the confirmation page
        /^\/products\/\d+\/review-updated$/, // <-- add this line for review-updated
    ];


    const shouldHideLayout = hideLayoutPatterns.some((rx) =>
        rx.test(pathname)
    );
    const isShopAllPage = pathname.startsWith('/products');

    useEffect(() => {
        const onStart = () => setIsCartOpen(false);
        router.on('start', onStart);
        return () => {
            router.off('start', onStart);
        };
    }, []);

    const handleRemoveFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };


    return (
        <FilterProvider>
            {!shouldHideLayout && (
                <Navbar auth={auth} setIsCartOpen={setIsCartOpen} />
            )}

            <Toaster position="top-center" />

            <main className="bg-gray-50 min-h-screen overflow-x-clip">
                {React.cloneElement(children, { isCartOpen, setIsCartOpen })}
            </main>

            {!shouldHideLayout && <Footer />}

            {isCartOpen &&
                (cart.length > 0 ? (
                    <ShopSidebar
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        cart={cart}
                        setCart={setCart}
                        handleRemoveFromCart={handleRemoveFromCart}
                    />
                ) : (
                    <CartSidebar
                        isOpen={isCartOpen}
                        onClose={() => setIsCartOpen(false)}
                        filteredProducts={filteredProducts}
                    />
                ))}
        </FilterProvider>
    );
}
