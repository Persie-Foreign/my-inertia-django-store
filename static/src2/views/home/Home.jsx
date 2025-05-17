import React, { useState, useEffect } from 'react';
import ProductTabs from "./ProductTabs.jsx";
import TestimonialCarousel from "./TestimonialCarousel.jsx";
import PromoSection from "./PromoSection.jsx";
import BrandStorySection from "./BrandStorySection.jsx";
import ShopSidebar from "../../components/ShopSidebar.jsx";
import {useCart} from "../../components/CartContext.jsx";
import {Link} from "react-router-dom";
import {products} from "../../components/Products.jsx";


export default function Home({ setIsCartOpen, isCartOpen }) {
    const slides = [
        {
            image: '/src/assets/images/dev2.jpg',
            heading: 'Glowing Skin Starts Here',
            subheading: 'Discover our premium skincare products designed for all skin types',
            buttonText: 'Shop Now',
        },
        {
            image: '/src/assets/images/dev4.jpg',
            heading: 'Professional Makeup',
            subheading: 'Enhance your natural beauty with our high-quality makeup collection',
            buttonText: 'Explore',
        },
        {
            image: '/src/assets/images/dev5.jpg',
            heading: 'Signature Fragrances',
            subheading: 'Find your signature scent from our exclusive fragrance collection',
            buttonText: 'Discover',
        },
        {
            image: '/src/assets/images/dev7.jpg',
            heading: 'Signature Fragrances',
            subheading: 'Find your signature scent from our exclusive fragrance collection',
            buttonText: 'Discover',
        },
    ];

    const chunkSize = 4;
    const productChunks = [];
    for (let i = 0; i < products.length; i += chunkSize) {
        productChunks.push(products.slice(i, i + chunkSize));
    }

    const [currentProductChunk, setCurrentProductChunk] = useState(0);
    const nextChunk = () => {
        setCurrentProductChunk((prev) => (prev + 1) % productChunks.length);
    };
    const prevChunk = () => {
        setCurrentProductChunk((prev) => (prev - 1 + productChunks.length) % productChunks.length);
    };

    const [isHovered, setIsHovered] = useState(false);

    // -------- HERO SLIDER LOGIC --------
    const slideDuration = 4000; // 4s spinner duration
    const [displayedSlide, setDisplayedSlide] = useState(0);
    const [activeDot, setActiveDot] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Auto-advance dots (only if not loading manually)
    useEffect(() => {
        if (isLoading) return;
        const timer = setTimeout(() => {
            setActiveDot((prev) => (prev + 1) % slides.length);
        }, slideDuration);
        return () => clearTimeout(timer);
    }, [activeDot, isLoading]);

    // After active dot finishes spinner → update displayed image
    useEffect(() => {
        if (isLoading) return;
        const timer = setTimeout(() => {
            setDisplayedSlide(activeDot);
        }, slideDuration);
        return () => clearTimeout(timer);
    }, [activeDot, isLoading]);

    // Click handler for dot
    const handleDotClick = (index) => {
        if (index === displayedSlide || isLoading) return;

        setActiveDot(index);
        setIsLoading(true);

        const timer = setTimeout(() => {
            setDisplayedSlide(index);
            setActiveDot((index + 1) % slides.length);  // advance to next dot after load finishes
            setIsLoading(false);
        }, slideDuration);
    };

    // Cart management states
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
        <div>
            {/* Hero Section */}
            <section className="relative h-screen overflow-hidden">

                {/* Image (always visible) */}
                <div className="absolute inset-0 transition-all duration-500 ease-in-out">
                    <img
                        src={slides[displayedSlide].image}
                        alt={slides[displayedSlide].heading}
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Text Content */}
                <div className="absolute inset-0 flex items-center px-10">
                    <div className="max-w-2xl text-white">
                        <h1 className="text-5xl font-bold mb-4">{slides[displayedSlide].heading}</h1>
                        <p className="text-xl mb-8">{slides[displayedSlide].subheading}</p>
                        <button className="bg-black text-white px-6 py-3 text-lg font-bold">
                            {slides[displayedSlide].buttonText}
                        </button>
                    </div>
                </div>

                {/* Dots with Progress Ring */}
                <div className="absolute bottom-[1rem] right-[1%] transform -translate-x-1/2 flex space-x-1">
                    {slides.map((_, index) => (
                        <div
                            key={index}
                            className="relative w-5 h-5 flex items-center justify-center cursor-pointer"
                            onClick={() => handleDotClick(index)}
                        >
                            <div className="absolute inset-0 rounded-full opacity-40"></div>

                            <div className={`w-2.5 h-2.5 rounded-full ${index === displayedSlide ? 'bg-gray-400' : 'bg-white opacity-50'}`}></div>

                            {index === activeDot && (
                                <svg className="absolute w-full h-full rotate-[-90deg]">
                                    <circle
                                        cx="10"
                                        cy="10"
                                        r="6"
                                        fill="none"
                                        stroke="grey"
                                        strokeWidth="2"
                                        strokeDasharray={2 * Math.PI * 6}
                                        strokeDashoffset={2 * Math.PI * 6}
                                        style={{ animation: `progress ${slideDuration}ms linear forwards` }}
                                    />
                                </svg>
                            )}
                        </div>
                    ))}
                </div>

                <style>{`
                    @keyframes progress {
                        from { stroke-dashoffset: ${2 * Math.PI * 6}; }
                        to { stroke-dashoffset: 0; }
                    }
                `}</style>
            </section>

            {/* Product Carousel Section */}
            <section
                className="mt-20 max-w-7xl mx-auto px-4 relative  mb-15"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="grid grid-cols-3 items-center mb-6">
                    {/* Empty left column (for balance) */}
                    <div></div>

                    {/* Center heading */}
                    <h2 className="text-4xl font-bold text-center">BEST SELLERS</h2>

                    {/* View All link on the right */}
                    <div className="flex justify-end">
                        <a href="/shop" className="text-green-700 font-semibold underline underline-offset-4">
                            View All →
                        </a>
                    </div>
                </div>

                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-500">
                        {productChunks[currentProductChunk].map((product) => (
                            <div key={product.id} className="bg-gray-100 rounded-lg shadow hover:shadow-lg transition relative overflow-hidden">
                                {/* Position span on top of the image */}
                                <div className="flex flex-col justify-between mb-2 px-2 space-y-1 absolute top-2 left-2 z-20">
                                    {product.id === 1 || product.id === 3 ? (
                                        <span className="bg-blue-500 text-white text-xs px-2 py-1 font-bold w-10 text-center">NEW</span>
                                    ) : null}
                                    <span className="bg-black text-white text-xs px-2 py-1 font-bold w-10 text-center">BEST</span>
                                    {product.id === 1 || product.id === 4 ? (
                                        <span className="bg-red-500 text-white text-xs px-2 py-1 font-bold w-20 text-center mt-1">SAVE $6.00</span>
                                    ) : null}
                                </div>

                                <div className="bg-gray-100 rounded-lg shadow hover:shadow-lg transition relative overflow-hidden">

                                    {/* Image + Hover Overlay wrapped with Link */}
                                    <Link to={`/product/${product.id}`} className="block group relative overflow-hidden">
                                        {/* Default Image */}
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-auto object-cover mb-4 transition-transform duration-300 ease-in-out transform group-hover:scale-150"
                                        />

                                        {/* Zoomed Image (appears on hover) */}
                                        <img
                                            src={product.zoomedImage}
                                            alt={product.name}
                                            className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100 group-hover:scale-150"
                                        />
                                    </Link>

                                    {/* Product details below */}
                                    <div className="p-4">

                                        {/* Product title with Link */}
                                        <Link to={`/product/${product.id}`}>
                                            <h3 className="text-lg font-semibold mb-2 text-center hover:underline">{product.name}</h3>
                                        </Link>

                                        {/* Ratings */}
                                        <div className="flex items-center justify-center mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className="text-yellow-500 mr-1">★</span>
                                            ))}
                                            <span className="ml-2 text-gray-600 text-sm">{product.reviews} Reviews</span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-center mb-4">
                                            <span className="font-bold mr-2">{product.price}</span>
                                            {product.originalPrice && (
                                                <span className="text-gray-400 line-through">{product.originalPrice}</span>
                                            )}
                                        </div>

                                        {/* Add to Cart Button (outside of Link) */}
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

                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Carousel Buttons */}
                    {isHovered && (
                        <>
                            {/* Show prev button only if it's not the first chunk */}
                            {currentProductChunk > 0 && (
                                <button
                                    onClick={prevChunk}
                                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white rounded-[20rem] p-2 opacity-75 hover:opacity-100 transition duration-300 ml-2"
                                >
                                    <i className="fas fa-chevron-left" style={{ fontSize: '1.5rem' }}></i>
                                </button>
                            )}

                            {/* Show next button only if it's not the last chunk */}
                            {currentProductChunk < productChunks.length - 1 && (
                                <button
                                    onClick={nextChunk}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white rounded-[20rem] p-2 opacity-75 hover:opacity-100 transition duration-300 mr-2"
                                >
                                    <i className="fas fa-chevron-right" style={{ fontSize: '1.5rem' }}></i>
                                </button>
                            )}
                        </>
                    )}

                </div>
            </section>

            {/* Cart Sidebar */}
            <ShopSidebar
                isOpen={isCartOpen}
                onClose={handleCloseCart}
                cart={cart}
                setCart={setCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />


            <section className="mt-20 max-w-7xl mx-auto px-4 relative  mb-15">
                <div className="grid grid-cols-3 items-center">
                    <div></div>
                    <h2 className="text-4xl font-bold text-center">PRODUCT LINES</h2>
                    <div className="flex justify-end">
                        <a href="/shop" className="text-green-700 font-semibold underline underline-offset-4">
                            View More →
                        </a>
                    </div>
                </div>
                <div className="py-10">
                    <ProductTabs
                        setIsCartOpen={setIsCartOpen}
                        isCartOpen={isCartOpen}
                    />
                </div>
            </section>

            <section className="mt-20 max-w-7xl mx-auto px-4 relative  mb-15">
                <div className="grid grid-cols-3 items-center mb-6">
                    <div></div>
                    <h2 className="text-4xl font-bold text-center">AS SEEN ON SOCIAL</h2>
                </div>
                <TestimonialCarousel />
            </section>

            <section className="max-w-7xl mx-auto px-4 relative  mb-8">
                <PromoSection />
            </section>

            <section className="max-w-7xl mx-auto px-4 relative  mb-8">
                <BrandStorySection />
            </section>
        </div>
    );
}