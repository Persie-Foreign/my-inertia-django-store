// static/src/js/Pages/components/CartContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // persist
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const SUBTOTAL = cart.reduce((sum, p) => sum + p.price * p.quantity, 0);
    const FREE_SHIPPING_THRESHOLD = 60;  // you choose

    return (
        <CartContext.Provider value={{
            cart, setCart,
            subtotal: SUBTOTAL,
            freeShippingThreshold: FREE_SHIPPING_THRESHOLD
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
