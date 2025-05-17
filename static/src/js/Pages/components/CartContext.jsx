// static/src/js/Components/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    const [discountCode, setDiscountCode] = useState(() => {
        return localStorage.getItem('discountCode') || '';
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('discountCode', discountCode);
    }, [discountCode]);

    const clearCart = () => {
        localStorage.removeItem('cart');
        setCart([]);
    };

    const clearDiscount = () => {
        localStorage.removeItem('discountCode');
        setDiscountCode('');
    };

    // Now price is a number, so just multiply directly:
    const calculateSubtotal = () => {
        return cart
            .reduce((sum, item) => sum + (item.price * item.quantity), 0)
            .toFixed(2);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                setCart,
                calculateSubtotal,
                clearCart,
                discountCode,
                setDiscountCode,
                clearDiscount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
