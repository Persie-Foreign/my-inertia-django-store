import React from 'react';
import {Link} from "react-router-dom";
import {useCart} from "./CartContext.jsx";
import {useCurrency} from './CurrencyContext.jsx';

const ShopSection = ({ isOpen, onClose, handleRemoveFromCart }) => {

    const { cart, setCart, calculateSubtotal } = useCart();

    if (!isOpen) return null;



    const calculateTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };


    const handleSizeChange = (productId, newSize) => {
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, size: newSize } : item
            )
        );
    };

    const handleIncrementQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            )
        );
    };

    const handleDecrementQuantity = (productId) => {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === productId && item.quantity > 1
                    ? { ...item, quantity: item.quantity - 1 }
                    : item
            )
        );
    };

    const frequentlyBoughtProducts = [
        {
            id: 1,
            name: 'NIACINAMIDE 10%+TXA 4% Serum',
            price: '$22.00',
            image: '/src/assets/images/dev4.jpg',
        },
        {
            id: 2,
            name: 'Heartleaf Quercetinol Pore Deep Cleansing Foam',
            price: '$20.00',
            image: '/src/assets/images/dev2.jpg',
        },
        {
            id: 3,
            name: 'Vitamin C Brightening Serum',
            price: '$25.00',
            image: '/src/assets/images/dev5.jpg',
        },
        {
            id: 4,
            name: 'Centella Asiatica Calming Toner',
            price: '$18.00',
            image: '/src/assets/images/dev4.jpg',
        },
        {
            id: 5,
            name: 'Retinol 0.5% Refining Serum',
            price: '$27.00',
            image: '/src/assets/images/dev5.jpg',
        },
    ];

    const handleAddFrequentlyBoughtProduct = (productToAdd) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === productToAdd.id);

            if (existingProduct) {
                // Product already in cart -> increment quantity
                return prevCart.map(item =>
                    item.id === productToAdd.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Product not in cart -> add with quantity 1 and empty size
                return [...prevCart, { ...productToAdd, quantity: 1, size: '' }];
            }
        });
    };

    const FREE_SHIPPING_THRESHOLD = 60.00;

    const calculateAmountRemainingForFreeShipping = () => {
        const subtotal = parseFloat(calculateSubtotal());
        const remaining = FREE_SHIPPING_THRESHOLD - subtotal;
        return remaining > 0 ? remaining.toFixed(2) : 0;
    };

    const { selectedCurrency, convertAmount } = useCurrency();
    const subtotalUSD = calculateSubtotal(); // Your base subtotal in USD
    const converted = convertAmount(subtotalUSD, selectedCurrency.code);




    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-white w-full h-full flex flex-col absolute right-0 top-0">

                {/* Header (fixed height) */}
                <div className="border-b border-gray-200 p-4 flex items-center justify-between h-16 flex-shrink-0">
                    <h2 className="text-md font-bold mx-auto">
                        YOUR CART ({calculateTotalItems()})
                    </h2>
                    <button className="text-gray-500 hover:text-gray-700 ml-auto" onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Scrollable middle content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {/* --- ALL your current scrollable content goes here --- */}

                    {/* Free Shipping Message */}
                    <div className="border-b border-gray-200 pb-4">
                        <h3 className="text-md font-bold text-center">
                            {calculateAmountRemainingForFreeShipping() > 0 ? (
                                <>YOU ARE ${calculateAmountRemainingForFreeShipping()} AWAY FROM FREE SHIPPING!</>
                            ) : (
                                <>CONGRATS! YOU HAVE UNLOCKED FREE SHIPPING!</>
                            )}
                        </h3>

                        <div className="mt-2 flex items-center justify-center">
                            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="bg-black h-3 rounded-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min((parseFloat(calculateSubtotal()) / FREE_SHIPPING_THRESHOLD) * 100, 100)}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="mt-4">
                        {cart.map((product) => (
                            <div key={product.id} className="flex items-center border-b border-gray-200 pb-5 mb-4">
                                <div className="w-20 mr-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-32 object-cover"
                                    />
                                </div>
                                <div className="w-3/5">
                                    {/* Name and Trash Icon - same row */}
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-md font-bold">{product.name}</h4>
                                        <button
                                            className="text-red-500 hover:text-red-700 ml-2 -mr-10"
                                            onClick={() => handleRemoveFromCart(product.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>

                                    {/* Size info */}
                                    <div className="mt-1 flex items-center space-x-2">
                                        <label className="text-gray-600 text-sm font-medium" htmlFor={`size-${product.id}`}>
                                            Size:
                                        </label>
                                        <input
                                            type="text"
                                            id={`size-${product.id}`}
                                            value={product.size || ''}
                                            onChange={(e) => handleSizeChange(product.id, e.target.value)}
                                            placeholder="e.g. 30ml"
                                            className="border border-gray-300 rounded px-2 py-1 text-sm w-24"
                                        />
                                    </div>

                                    {/* Quantity selector and Price - same row */}
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
                                            >+</button>
                                        </div>
                                        <p className="text-lg font-bold">{product.price}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Frequently Bought Together */}
                    <div className="mt-10">
                        <h3 className="text-xl font-bold text-center mb-6">FREQUENTLY BOUGHT TOGETHER</h3>
                        <div className="grid grid-cols-1 gap-5">
                            {frequentlyBoughtProducts.map((product) => (
                                <div key={product.id} className="flex items-center bg-gray-100 p-5 rounded-lg">
                                    <div className="w-1/4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-[100px] object-cover"
                                        />
                                    </div>
                                    <div className="w-full">
                                        <h4 className="text-md font-bold mb-4 ml-2">{product.name}</h4>
                                        <div className="flex items-center justify-between space-x-4">
                                            <p className="text-md font-bold ml-2">{product.price}</p>
                                            <button
                                                className="bg-black text-white px-4 py-2"
                                                onClick={() => handleAddFrequentlyBoughtProduct(product)}
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

                {/* Footer (fixed height) */}
                <div className="border-t border-gray-200 p-5 flex-shrink-0">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold">SUBTOTAL</h3>
                        <p className="text-lg font-bold">
                            {selectedCurrency.symbol} {converted.toFixed(2)}
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

                    <Link to="/checkout">
                        <button className="bg-black text-white py-3 px-6 text-xl font-bold hover:bg-gray-800 w-full flex items-center justify-center mb-3">
                            <i className="fas fa-lock mr-2"></i>
                            CHECKOUT • {selectedCurrency.symbol} {converted.toFixed(2)}
                        </button>
                    </Link>

                    <a href="/">
                        <button className="text-black hover:text-gray-600 flex items-center justify-center w-full underline">
                            CONTINUE SHOPPING
                        </button>
                    </a>
                </div>

            </div>
        </div>
    );
};

export default ShopSection;
