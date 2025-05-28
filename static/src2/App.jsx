// App.jsx
import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ShopToolbar from './components/ShopToolbar';
import Home from "./views/home/Home";
import Shop from "./views/shop/Shop";
import Login from "./views/login/Login";
import CheckoutSection from "./components/CheckoutSection";
import BrandStory from "../src/js/Pages/BrandStory.jsx";
import ProductDetail from './views/shop/ProductDetail';
import { CurrencyProvider } from "./components/CurrencyContext.jsx";
import { useCart } from "./components/CartContext.jsx";
import ShopSidebar from "./components/ShopSidebar.jsx";
import CartSidebar from "./components/CartSidebar.jsx";

export default function App() {
    const location = useLocation();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart, setCart } = useCart();

    const hideLayoutRoutes = ['/checkout'];
    const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

    const isShopAllPage = location.pathname === '/shop';

    const handleRemoveFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    return (
        <CurrencyProvider>
            {!shouldHideLayout && <Navbar setIsCartOpen={setIsCartOpen} />}
            {!shouldHideLayout && isShopAllPage && (
                <div className="fixed top-[116px] w-full z-40">
                    <ShopToolbar />
                </div>
            )}

            <Routes>
                <Route index element={
                    <Home
                        setIsCartOpen={setIsCartOpen}
                        isCartOpen={isCartOpen}
                    />
                } />
                <Route path="/shop" element={<Shop />} />
                <Route path="/login" element={<Login />} />
                <Route path="/checkout" element={<CheckoutSection />} />
                <Route path="/story" element={<BrandStory />} />
                <Route path="/product/:id" element={<ProductDetail setIsCartOpen={setIsCartOpen} />} />
            </Routes>

            {!shouldHideLayout && <Footer />}

            {/* Conditional Sidebar */}
            {isCartOpen && (
                cart.length > 0 ? (
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
                    />
                )
            )}
        </CurrencyProvider>
    );
}
