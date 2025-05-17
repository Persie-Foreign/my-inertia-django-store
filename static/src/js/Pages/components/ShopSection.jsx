// ShopSection.jsx
import React from 'react';
import { useCart } from './CartContext.jsx';  // adjust path

export default function ShopSection() {
    let cart = [];
    let setCart = () => {};

    // Try to read from context; if undefined, fall back
    try {
        const ctx = useCart();
        cart = ctx.cart;
        setCart = ctx.setCart;
    } catch (e) {
        console.warn('ShopSection rendered outside CartProvider:', e);
    }

    if (cart.length === 0) {
        return <p>Your cart is empty.</p>;
    }

    return (
        <section>
            <h2>Your Cart</h2>
            <ul>
                {cart.map(item => (
                    <li key={item.id}>
                        {item.name} × {item.quantity}
                    </li>
                ))}
            </ul>
        </section>
    );
}
