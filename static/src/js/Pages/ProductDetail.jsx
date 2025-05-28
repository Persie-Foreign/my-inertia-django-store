// src/pages/ProductDetail.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import ShopSidebar from './components/ShopSidebar.jsx';
import { useCart } from './components/CartContext.jsx';
import Navigation from 'swiper';
import SwiperCore from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import { useSpring, animated } from '@react-spring/web';
import { currencies, useCurrency } from './components/CurrencyContext.jsx';
import toast from "react-hot-toast";
import { Pencil } from 'lucide-react';

SwiperCore.use([Navigation]);

function AnimatedImage({ selectedImage, productTitle }) {
    const [styles, api] = useSpring(() => ({
        opacity: 1,
        transform: 'translateX(0)',
        from: { opacity: 0, transform: 'translateX(100px)' },
        reset: true,
    }));

    useEffect(() => {
        api.start({
            opacity: 1,
            transform: 'translateX(0)',
            reset: true,
            from: { opacity: 0, transform: 'translateX(100px)' },
        });
    }, [selectedImage, api]);

    return (
        <animated.img
            src={selectedImage}
            alt={productTitle}
            style={{
                ...styles,
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain', // or 'cover' if you prefer
                borderRadius: '0.5rem',
                boxShadow: '0 0 10px rgba(0,0,0,0.2)',
            }}
        />

    );
}

export default function ProductDetail({ setIsCartOpen, isCartOpen }) {
    const product = usePage().props;
    const { cart, setCart } = useCart();
    const cartItem = cart.find(item => item.id === product.id);
    const quantityInCart = cartItem ? cartItem.quantity : 0;

    const [selectedImage, setSelectedImage] = useState(
        product.images && product.images.length ? product.images[0] : product.image
    );

    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const swiperRef = useRef(null);

    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    const buildCartItem = (base) => ({
        id: base.id,
        title: base.title || base.name || '',
        image: base.image || (base.images && base.images[0]) || '',
        image_url: base.image_url || base.image || (base.images && base.images[0]) || '',
        price: base.price,
        quantity: 1,
        size: '',
    });

    const handleAddToCart = () => {
        setCart(prevCart => {
            const totalQuantity = prevCart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQuantity >= 10) {
                toast.error('Cart limit reached. You can only have up to 10 items.');
                return prevCart;
            }
            const existing = prevCart.find(item => item.id === product.id);
            if (existing) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, buildCartItem(product)];
            }
        });
        setIsCartOpen(true);
    };

    const handleIncrementQuantity = () => {
        setCart(prevCart => {
            const totalQuantity = prevCart.reduce((sum, item) => sum + item.quantity, 0);
            if (totalQuantity >= 10) return prevCart;

            const existingItem = prevCart.find(item => item.id === product.id);

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, buildCartItem(product)];
            }
        });
    };

    const handleDecrementQuantity = () => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (!existingItem) return prevCart;

            if (existingItem.quantity > 1) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                );
            } else {
                return prevCart.filter(item => item.id !== product.id);
            }
        });
    };

    const totalCartQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const handleCloseCart = () => setIsCartOpen(false);

    if (!product) {
        return <div>Loading...</div>;
    }

    const { selectedCurrency, setSelectedCurrency, convertAmount } = useCurrency();
    useEffect(() => {
        const code = localStorage.getItem('currency');
        const cur = currencies.find(c => c.code === code);
        if (cur) setSelectedCurrency(cur);
    }, []);
    useEffect(() => {
        localStorage.setItem('currency', selectedCurrency.code);
    }, [selectedCurrency]);

    return (
        <>
            <Head title={product.title} />
            <div className="flex flex-col md:flex-row max-w-7xl mx-auto pt-6 md:pt-10 md:pb-10 px-0 md:px-6 bg-white mt-24">
            {/* Image Gallery */}
                <div className="md:w-1/2 p-4 mr-[-3rem] w-full">
                    <div className="relative w-full h-[20rem] md:w-[30rem] md:h-[30rem] bg-transparent">
                        <AnimatedImage selectedImage={selectedImage} productTitle={product.title} />
                    </div>
                    <div className="flex space-x-2 mt-4 cursor-pointer px-4 md:px-0">
                        {(product.images && product.images.length ? product.images : [product.image]).map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedImage(img)}
                                className={`rounded p-1 transition border ${
                                    selectedImage === img ? 'border-black' : 'border-transparent'
                                }`}
                            >
                                <img src={img} alt={`Thumbnail ${i}`} className="w-20 h-20 object-cover rounded" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Info */}
                <div className="md:w-1/2 px-4 md:px-4">
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{product.title}</h1>
                    <div className="text-2xl font-bold text-gray-800 mb-6">
                        {selectedCurrency.symbol} {convertAmount(product.price).toFixed(2)}
                    </div>
                    <p className="text-gray-700 mb-4">{product.description}</p>

                    {/* Quantity Controls */}
                    <div className="flex items-center mb-6">
                        <button className="border px-2 py-1" onClick={handleDecrementQuantity} disabled={quantityInCart === 0}>-</button>
                        <span className="px-4">{quantityInCart}</span>
                        <button
                            className="border px-2 py-1"
                            onClick={handleIncrementQuantity}
                            disabled={totalCartQuantity >= 10}
                        >+</button>
                    </div>

                    {totalCartQuantity >= 10 && (
                        <p className="text-sm text-red-600 mt-2">
                            Cart limit reached: You can only have a total of 10 items in your cart.
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="w-full bg-black text-white py-2 font-bold uppercase hover:opacity-90"
                    >
                        Add to Cart
                    </button>
                </div>

                <ShopSidebar
                    isOpen={isCartOpen}
                    onClose={handleCloseCart}
                    cart={cart}
                    setCart={setCart}
                    handleRemoveFromCart={(id) => setCart(prev => prev.filter(item => item.id !== id))}
                />
            </div>

            {/* Reviews Section */}
            <section className="max-w-4xl mx-auto px-4 mt-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold">Reviews</h2>
                    {product.can_review ? (
                        <a
                            href={`/products/${product.id}/review/?image=${encodeURIComponent(selectedImage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-black rounded hover:bg-gray-800"
                        >
                            <Pencil className="w-4 h-4 mr-2" /> Write a Review
                        </a>
                    ) : (
                        <Link href="/login" className="text-sm text-blue-600">
                            Log in to write a review
                        </Link>
                    )}

                </div>

                {product.reviews && product.reviews.length > 0 ? (
                    <div className="space-y-6">
                        {product.reviews.map((review) => (
                            <div key={review.id} className="border rounded p-4">
                                <h4 className="font-bold text-lg mb-2">{review.title}</h4>
                                <p className="text-gray-700 mb-2">{review.description}</p>
                                <div className="flex items-center text-sm text-gray-600 mb-2">
                                    <span className="mr-4">Rating: {review.rating} ★</span>
                                    <span>By: {review.user}</span>
                                </div>
                                {review.media && review.media.length > 0 && (
                                    <div className="flex flex-wrap gap-4">
                                        {review.media.map((m) =>
                                            m.type === 'video' ? (
                                                <video
                                                    key={m.id}
                                                    src={m.url}
                                                    controls
                                                    className="w-48 rounded"
                                                />
                                            ) : (
                                                <img
                                                    key={m.id}
                                                    src={m.url}
                                                    alt="Review media"
                                                    className="w-48 rounded object-cover"
                                                />
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to write one!</p>
                )}
            </section>

        </>
    );
}
