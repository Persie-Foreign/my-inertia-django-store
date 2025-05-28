import React, {useEffect, useState} from 'react';
import {useCart} from "../../components/CartContext.jsx";
import ShopSidebar from "../../components/ShopSidebar.jsx";
import { heartleafProducts, riceProducts, peachProducts } from '../../components/Products.jsx';
import { Link } from 'react-router-dom';



// COMPONENT FOR A SINGLE PRODUCT CARD
function ProductCard({ id, image, name: title, reviews, price, originalPrice, showSaveBadge, isCartOpen, setIsCartOpen }) {

    const product = { id, image, name: title, reviews, price, originalPrice };


    const { cart, setCart } = useCart();

    const handleAddToCart = (product) => {
        setCart((prevCart) => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                // Product already in cart -> increment quantity
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Product not in cart -> add with quantity 1 and empty size
                return [...prevCart, { ...product, quantity: 1, size: '' }];
            }
        });

        setIsCartOpen(true);
    };



    const handleRemoveFromCart = (id) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== id));
    };

    const handleCloseCart = () => {
        setIsCartOpen(false);
    };

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        // Clean up when component unmounts (always good practice)
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);


    return (
        <div className="rounded-lg overflow-hidden shadow-sm w-full bg-gray-100 relative">
            <div className="flex flex-col justify-between mb-2 px-2 space-y-1 absolute top-2 left-2 z-10">
                <span className="bg-black text-white text-xs px-2 py-1 font-bold w-10 text-center">BEST</span>
                {showSaveBadge && originalPrice && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 font-bold w-20 text-center mt-1">
                        SAVE ${Math.abs(parseFloat(originalPrice.replace('$', '')) - parseFloat(price.replace('$', '')))}.00
                    </span>
                )}
            </div>

            <Link to={`/product/${id}`}>
                <img
                    src={image}
                    alt={title}
                    className="w-full h-64 object-cover"
                />
            </Link>
            <div className="p-4">
                <h3 className="text-lg font-bold text-center">{title}</h3>
                <div className="flex items-center justify-center mt-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-green-500 mr-1">★</span>
                    ))}
                    <span className="ml-2 text-gray-600">{reviews} Reviews</span>
                </div>
                <div className="text-center mt-2">
                    <span className="font-bold mr-2">{price}</span>
                    {originalPrice && (
                        <span className="text-gray-400 line-through">{originalPrice}</span>
                    )}
                </div>
                <button
                    aria-label="Add to cart"
                    className="w-full relative border py-2 text-center uppercase font-bold overflow-hidden group add-to-cart-btn"
                    onClick={() => handleAddToCart(product)}
                >
                    <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        Add to cart
                    </span>
                    <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                </button>
            </div>

            {/* Cart Sidebar */}
            <ShopSidebar
                isOpen={isCartOpen}
                onClose={handleCloseCart}
                cart={cart}
                setCart={setCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />

        </div>
    );
}

export default function ProductTabs({ setIsCartOpen, isCartOpen }) {
    const [activeTab, setActiveTab] = useState('Heartleaf');

    // Tab product + image map
    const tabProducts = {
        Heartleaf: heartleafProducts,
        Rice: riceProducts,
        Peach: peachProducts,
    };

    const tabImages = {
        Heartleaf: '/src/assets/images/dev2.jpg',
        Rice: '/src/assets/images/dev4.jpg',
        Peach: '/src/assets/images/dev5.jpg',
    };

    return (
        <div>
            {/* TAB NAVIGATION */}
            <nav className="flex">
                {['Heartleaf', 'Rice', 'Peach'].map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-4 text-lg font-bold transition  ${
                            activeTab === tab
                                ? 'text-gray-900 border-gray-900'
                                : 'text-gray-500 border-transparent hover:border-gray-300'
                        }`}
                    >
                        {tab}
                    </button>
                ))}
            </nav>

            {/* CONTENT */}
            <div className="grid grid-cols-4 gap-5 mt-2">
                {/* Left Image */}
                <div className="col-span-2">
                    <img
                        src={tabImages[activeTab]}
                        alt={`${activeTab} Model`}
                        className="w-full h-full rounded-lg"
                    />
                </div>


                {/* Dynamic Product Cards */}
                <div className="col-span-2 grid grid-cols-2 gap-5">
                    {tabProducts[activeTab].map((product, index) => (
                        <ProductCard
                            key={product.id}
                            id={product.id}
                            image={product.image}
                            name={product.title}
                            reviews={product.reviews}
                            price={product.price}
                            originalPrice={product.originalPrice}
                            showSaveBadge={index === 0 || index === 3}
                            isCartOpen={isCartOpen}
                            setIsCartOpen={setIsCartOpen}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
