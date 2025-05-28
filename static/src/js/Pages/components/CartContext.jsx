import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    // Add discountCode state here
    const [discountCode, setDiscountCode] = useState('');

    // Persist cart to localStorage
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    // (Optional) persist discountCode if you want
    useEffect(() => {
        localStorage.setItem('discountCode', discountCode);
    }, [discountCode]);

    // (Optional) load discountCode from localStorage on mount
    useEffect(() => {
        const savedCode = localStorage.getItem('discountCode');
        if (savedCode) setDiscountCode(savedCode);
    }, []);

    const FREE_SHIPPING_THRESHOLD = 5000;

    const calculateSubtotal = () => {
        return cart.reduce((sum, product) => {
            let price = product.price;

            // Safely parse price if it's a string
            if (typeof price === 'string') {
                price = parseFloat(price.replace(/[^0-9.]/g, ''));
            }

            return sum + (price * product.quantity);
        }, 0);
    };

    const calculateAmountRemainingForFreeShipping = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        return remaining > 0 ? remaining.toFixed(2) : 0;
    };

    return (
        <CartContext.Provider value={{
            cart,
            setCart,
            calculateSubtotal,
            freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
            calculateAmountRemainingForFreeShipping,
            discountCode,         // <--- added here
            setDiscountCode       // <--- added here
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
export default CartContext;
