// static/src/js/Pages/components/ShopSidebar.jsx

import React, { useMemo, useState, useEffect } from 'react';
import { Link } from '@inertiajs/react'; // or 'react-router-dom' if not using Inertia
import { FiTrash2, FiX } from 'react-icons/fi';
import { useCart } from '../../components/CartContext.jsx';

export default function ShopSidebar({
                                        isOpen,
                                        onClose,
                                        cart,
                                        setCart,
                                        handleRemoveFromCart
                                    }) {
    const [discountCode, setDiscountCode] = useState('');
    const [appliedCode, setAppliedCode]   = useState(null);

    // Calculate subtotal
    const subtotal = useMemo(() => {
        return cart
            .reduce((sum, item) => sum + item.quantity * parseFloat(item.price.replace('$','')), 0)
            .toFixed(2);
    }, [cart]);

    // Free shipping threshold
    const FREE_SHIPPING = 50;
    const remaining = Math.max(0, FREE_SHIPPING - subtotal);

    // Save discount in localStorage
    useEffect(() => {
        if (appliedCode) localStorage.setItem('discountCode', appliedCode);
    }, [appliedCode]);

    const applyDiscount = () => {
        // TODO: validate discountCode server‑side
        setAppliedCode(discountCode);
        setDiscountCode('');
    };

    const increment = id =>
        setCart(c => c.map(x => x.id === id ? { ...x, quantity: x.quantity + 1 } : x));

    const decrement = id =>
        setCart(c => c.map(x => {
            if (x.id === id) {
                const qty = x.quantity - 1;
                return qty > 0 ? { ...x, quantity: qty } : x;
            }
            return x;
        }));

    return (
        <div
            className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">
                    Your Cart ({cart.length})
                </h2>
                <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                    <FiX size={24} />
                </button>
            </div>

            {/* Free shipping progress */}
            <div className="px-4 py-3">
                {remaining > 0 ? (
                    <>
                        <p className="text-sm mb-1">
                            You are <strong>${remaining.toFixed(2)}</strong> away from free shipping!
                        </p>
                        <div className="w-full bg-gray-200 h-2 rounded">
                            <div
                                className="bg-green-500 h-2 rounded"
                                style={{ width: `${((subtotal / FREE_SHIPPING) * 100).toFixed(0)}%` }}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-sm text-green-600 font-semibold">
                        Congratulations, you have free shipping!
                    </p>
                )}
            </div>

            {/* Cart items */}
            <div className="overflow-y-auto flex-1 px-4 py-2">
                {cart.map(item => (
                    <div key={item.id} className="flex items-center mb-4">
                        <img
                            src={item.image_url || item.image}
                            alt={item.title || item.name}
                            className="w-16 h-16 object-cover rounded"
                        />
                        <div className="ml-3 flex-1">
                            <h3 className="font-medium">{item.title || item.name}</h3>
                            <div className="flex items-center mt-1">
                                <button
                                    onClick={() => decrement(item.id)}
                                    className="px-2 py-1 border"
                                >–</button>
                                <span className="px-3">{item.quantity}</span>
                                <button
                                    onClick={() => increment(item.id)}
                                    className="px-2 py-1 border"
                                >+</button>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="font-semibold">${(item.quantity * parseFloat(item.price.replace('$',''))).toFixed(2)}</span>
                            <button
                                onClick={() => handleRemoveFromCart(item.id)}
                                className="text-gray-500 hover:text-red-600 mt-2"
                            >
                                <FiTrash2 />
                            </button>
                        </div>
                    </div>
                ))}
                {cart.length === 0 && (
                    <p className="text-center text-gray-500 mt-6">Your cart is empty.</p>
                )}
            </div>

            {/* Subtotal, discount, checkout */}
            <div className="px-4 py-3 border-t">
                <div className="flex justify-between mb-3">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">${subtotal}</span>
                </div>

                {/* Discount code */}
                <div className="mb-3">
                    <input
                        type="text"
                        placeholder="Discount Code"
                        value={discountCode}
                        onChange={e => setDiscountCode(e.target.value)}
                        className="w-full border px-2 py-1 mb-2"
                    />
                    <button
                        onClick={applyDiscount}
                        className="w-full bg-black text-white py-2 font-semibold"
                    >
                        Apply
                    </button>
                </div>

                {/* Checkout */}
                <Link
                    href="/checkout/"
                    className="block w-full text-center bg-green-600 text-white py-3 font-bold rounded"
                >
                    🛒 CHECKOUT • ${subtotal}
                </Link>
                <Link
                    to="/products"
                    className="block text-center text-gray-600 underline mt-3"
                    onClick={onClose}
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
