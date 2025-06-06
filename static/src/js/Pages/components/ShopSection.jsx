// resources/js/Pages/ShopSection.jsx

import React from 'react';
import { Link, Head, usePage } from '@inertiajs/react';
import { useCart } from "./CartContext.jsx";
import { useCurrency } from './CurrencyContext.jsx';

const ShopSection = ({ isOpen, onClose, selectedCategory }) => {
    const {
        cart,
        setCart,
        calculateSubtotal,
        calculateAmountRemainingForFreeShipping,
        freeShippingThreshold
    } = useCart();

    const { selectedCurrency, convertAmount } = useCurrency();
    const { url, productsByCategory = {}, relatedProducts = [] } = usePage().props;

    // ✅ Don't render on /checkout route
    if (url === '/checkout') return null;
    if (!isOpen) return null;


    const latestCategory =
        cart.length > 0 && cart[cart.length - 1].category
            ? cart[cart.length - 1].category
            : selectedCategory;

    const filteredRelatedProducts = relatedProducts.filter(
        p =>
            p.category?.name === latestCategory
    );

    const rawCategoryProducts = productsByCategory[latestCategory];


    const categoryList = filteredRelatedProducts.length > 0
        ? filteredRelatedProducts
        : rawCategoryProducts && typeof rawCategoryProducts === 'object'
            ? Object.values(rawCategoryProducts).flat()
            : [];



    const frequentlyBoughtProducts = categoryList
        .filter(p => !cart.find(item => item.id === p.id))
        .slice(0, 5);

    const calculateTotalItems = () =>
        cart.reduce((sum, item) => sum + item.quantity, 0);

    const handleSizeChange = (productId, newSize) =>
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, size: newSize } : item
        ));

    const handleIncrementQuantity = (productId) =>
        setCart(prev => {
            const totalQuantity = prev.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQuantity >= 10) return prev;
            return prev.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        });

    const handleDecrementQuantity = (productId) =>
        setCart(prev => prev.map(item =>
            item.id === productId && item.quantity > 1
                ? { ...item, quantity: item.quantity - 1 }
                : item
        ));

    const subtotal = calculateSubtotal();
    const convertedSubtotal = convertAmount(subtotal, selectedCurrency.code);
    const totalQuantity = calculateTotalItems();
    const isLimitReached = totalQuantity >= 10;

    const handleAddToCart = (product) => {
        setCart(prev => {
            const total = prev.reduce((sum, x) => sum + x.quantity, 0);
            if (total >= 10) {
                toast.error('Cart limit reached.');
                return prev;
            }

            const found = prev.find(x => x.id === product.id);
            if (found) {
                return prev.map(x =>
                    x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x
                );
            }

            return [
                ...prev,
                {
                    ...product,
                    quantity: 1,
                    size: '',
                    // ensure all necessary fields exist here, like image_url or price
                },
            ];
        });
    };


    return (
        <>
            <Head title="Your Cart" />
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
                <div className="bg-white w-full h-full flex flex-col absolute right-0 top-0">

                    {/* Header */}
                    <div className="border-b border-gray-200 p-4 flex items-center justify-between h-16 flex-shrink-0">
                        <h2 className="text-md font-bold mx-auto">
                            YOUR CART ({totalQuantity})
                        </h2>
                        <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-y-auto p-5">
                        {/* Free Shipping Bar */}
                        <div className="border-b border-gray-200 pb-4">
                            <h3 className="text-md font-bold text-center">
                                {subtotal < freeShippingThreshold ? (
                                    <>YOU ARE FCFA{calculateAmountRemainingForFreeShipping()} AWAY FROM FREE SHIPPING!</>
                                ) : (
                                    <>CONGRATS! YOU HAVE UNLOCKED FREE SHIPPING!</>
                                )}
                            </h3>
                            <div className="mt-2 flex items-center justify-center">
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="bg-black h-3 rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${Math.min((subtotal / freeShippingThreshold) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cart Items */}
                        <div className="mt-4">
                            {cart.map(product => (
                                <div key={product.id} className="flex items-center border-b border-gray-200 pb-5 mb-4">
                                    <div className="w-20 mr-4">
                                        <img
                                            src={product.image_url || product.image}
                                            alt={product.title || product.name}
                                            className="w-full h-32 object-cover"
                                        />
                                    </div>
                                    <div className="w-3/5">
                                        <div className="flex justify-between items-start">
                                            <h4 className="text-sm font-bold">{product.title || product.name}</h4>
                                            <button
                                                className="text-red-500 hover:text-red-700 ml-2 -mr-10"
                                                onClick={() => setCart(prev => prev.filter(i => i.id !== product.id))}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <div className="mt-1 flex items-center space-x-2">
                                            <label className="text-gray-600 text-sm font-medium" htmlFor={`size-${product.id}`}>
                                                Size:
                                            </label>
                                            <input
                                                type="text"
                                                id={`size-${product.id}`}
                                                value={product.size || ''}
                                                onChange={e => handleSizeChange(product.id, e.target.value)}
                                                placeholder="e.g. 30ml"
                                                className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                                            />
                                        </div>
                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <button
                                                    className="border border-gray-300 px-2 py-1"
                                                    onClick={() => handleDecrementQuantity(product.id)}
                                                >-</button>
                                                <span className="px-2 py-1 mx-2">{product.quantity}</span>
                                                <button
                                                    className="border border-gray-300 px-2 py-1"
                                                    onClick={() => handleIncrementQuantity(product.id)}
                                                    disabled={isLimitReached}
                                                >+</button>
                                            </div>
                                            <p className="text-lg font-bold text-right">
                                                {selectedCurrency.symbol}{' '}
                                                {convertAmount(product.price, selectedCurrency.code).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Frequently Bought Together */}
                        <div className="mt-10">
                            <h3 className="text-xl font-bold text-center mb-6">FREQUENTLY BOUGHT TOGETHER</h3>
                            <div className="grid grid-cols-1 gap-5">
                                {frequentlyBoughtProducts.map(p => (
                                    <div key={p.id} className="flex items-center bg-gray-100 p-5 rounded-lg">
                                        <div className="w-1/4">
                                            <img
                                                src={p.image || p.image_url}
                                                alt={p.title}
                                                className="w-full h-[100px] object-cover"
                                            />
                                        </div>
                                        <div className="w-full">
                                            <h4 className="text-lg font-bold mb-4 ml-2">{p.title}</h4>
                                            <div className="flex items-center justify-between space-x-4">
                                                <div className='ml-2'>
                                                    <span className="font-bold">
                                                        {selectedCurrency.symbol}{convertAmount(p.price, selectedCurrency.code).toFixed(2)}
                                                    </span>
                                                </div>
                                                <button
                                                    disabled={isLimitReached}
                                                    className={`bg-black text-white px-4 py-2 ${isLimitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    onClick={() => handleAddToCart(p)}
                                                >
                                                    ADD
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-200 p-5 flex-shrink-0">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-bold">SUBTOTAL</h3>
                            <p className="text-lg font-bold">
                                {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                            </p>
                        </div>
                        <div className="flex mb-3">
                            <input
                                type="text"
                                placeholder="eg. Discount Code"
                                className="w-3/4 p-2 border border-gray-300 rounded-l"
                            />
                            <button className="w-1/4 bg-black text-white py-2 px-4 font-bold hover:bg-gray-800 rounded-r">
                                Apply
                            </button>
                        </div>
                        <Link href="/checkout">
                            <button className="bg-black text-white py-3 px-6 text-xl font-bold hover:bg-gray-800 w-full flex items-center justify-center mb-3">
                                <i className="fas fa-lock mr-2"></i>
                                CHECKOUT • {selectedCurrency.symbol} {convertedSubtotal.toFixed(2)}
                            </button>
                        </Link>
                        <Link href="/">
                            <button className="text-black hover:text-gray-600 flex items-center justify-center w-full underline">
                                CONTINUE SHOPPING
                            </button>
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
};

export default ShopSection;
