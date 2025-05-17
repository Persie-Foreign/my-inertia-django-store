// static/src/js/Pages/Home.jsx

import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { useCart } from './components/CartContext.jsx';
import ShopSidebar from './components/ShopSidebar.jsx';
import ProductTabs from './components/ProductTabs.jsx';
import TestimonialCarousel from './components/TestimonialCarousel.jsx';
import PromoSection from './components/PromoSection.jsx';
import BrandStorySection from './components/BrandStorySection.jsx';

export default function Home() {
    // 1) Inertia‑shared props
    const { bestSellers = [], productsByCategory = {} } = usePage().props;

    // 2) Hero slider
    const slides = [
        { image: '/static/images/dev8.png', heading: 'Glowing Skin Starts Here', subheading: 'Discover our premium skincare collection for every skin type.', buttonText: 'Shop Now', href: '/products' },
        { image: '/static/images/dev4.jpg', heading: 'Professional Makeup', subheading: 'Elevate your look with our high‑quality makeup range.', buttonText: 'Explore', href: '/products' },
        { image: '/static/images/dev5.jpg', heading: 'Signature Fragrances', subheading: 'Find your signature scent among our exclusive lineup.', buttonText: 'Discover', href: '/products' },
        { image: '/static/images/dev7.jpg', heading: 'Limited‑Edition Sets', subheading: 'Shop seasonal bundles before they sell out.', buttonText: 'Browse Sets', href: '/products' },
    ];
    const slideDuration = 4000;
    const [currentSlide, setCurrentSlide] = useState(0);
    const [busy, setBusy] = useState(false);

    // auto‑advance slides
    useEffect(() => {
        if (busy) return;
        const t = setTimeout(() => {
            setCurrentSlide((s) => (s + 1) % slides.length);
        }, slideDuration);
        return () => clearTimeout(t);
    }, [currentSlide, busy]);

    // manual nav
    const goToSlide = (i) => {
        if (i === currentSlide) return;
        setBusy(true);
        setCurrentSlide(i);
        setTimeout(() => setBusy(false), 50);
    };

    // 3) Best sellers carousel
    const chunkSize = 4;
    const chunks = [];
    for (let i = 0; i < bestSellers.length; i += chunkSize) {
        chunks.push(bestSellers.slice(i, i + chunkSize));
    }
    const [chunkIndex, setChunkIndex] = useState(0);
    const [hovered, setHovered] = useState(false);
    const nextChunk = () => setChunkIndex((i) => (i + 1) % chunks.length);
    const prevChunk = () => setChunkIndex((i) => (i - 1 + chunks.length) % chunks.length);

    // 4) Cart sidebar via context
    let cart, setCart;
    try { ({ cart, setCart } = useCart()); }
    catch { cart = []; setCart = () => {}; }
    const [isCartOpen, setIsCartOpen] = useState(false);
    const handleAddToCart = (p) => {
        setCart((c) => {
            const found = c.find((x) => x.id === p.id);
            if (found) return c.map((x) => x.id === p.id ? { ...x, quantity: x.quantity + 1 } : x);
            return [...c, { ...p, quantity: 1 }];
        });
        setIsCartOpen(true);
    };
    const handleRemoveFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));

    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isCartOpen]);

    return (
        <>
            <Head title="Home" />

            {/* Hero */}
            <section className="relative w-full h-screen overflow-hidden">
                {slides.map((s, i) => (
                    <img
                        key={i}
                        src={s.image}
                        alt={s.heading}
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                            i === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    />
                ))}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-center items-start px-8 md:px-20">
                    <h1 className="text-white text-4xl md:text-6xl font-bold mb-4">{slides[currentSlide].heading}</h1>
                    <p className="text-white text-lg md:text-xl mb-6 max-w-lg">{slides[currentSlide].subheading}</p>
                    <Link href={slides[currentSlide].href} className="bg-white text-black px-6 py-3 font-semibold hover:bg-gray-200">
                        {slides[currentSlide].buttonText}
                    </Link>
                </div>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    {slides.map((_, i) => (
                        <button key={i} onClick={() => goToSlide(i)} className="relative w-4 h-4 focus:outline-none">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 20 20">
                                <circle cx="10" cy="10" r="8" fill="transparent" stroke="#fff" strokeWidth="2" opacity="0.3" />
                                {i === currentSlide && (
                                    <circle
                                        cx="10" cy="10" r="8"
                                        fill="transparent" stroke="#fff" strokeWidth="2"
                                        strokeDasharray={2 * Math.PI * 8}
                                        strokeDashoffset={2 * Math.PI * 8}
                                        style={{ animation: `progress ${slideDuration}ms linear forwards` }}
                                    />
                                )}
                            </svg>
                            <span
                                className={`absolute inset-0 m-1 rounded-full transition-colors ${
                                    i === currentSlide ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
                                }`}
                            />
                        </button>
                    ))}
                    <style>{`@keyframes progress { to { stroke-dashoffset: 0; } }`}</style>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="mt-20 max-w-7xl mx-auto px-4" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-4xl font-bold">BEST SELLERS</h2>
                    <Link href="/products" className="text-green-600 font-semibold hover:underline">View All →</Link>
                </div>
                <div className="relative">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {chunks[chunkIndex]?.map((p) => (
                            <div key={p.id} className="bg-white rounded-lg shadow hover:shadow-lg overflow-hidden relative">
                                <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10 px-2">
                                    {p.is_new && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">NEW</span>}
                                    {p.is_best && <span className="bg-black text-white text-xs px-2 py-1 rounded">BEST</span>}
                                    {p.save_amount != null && <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">SAVE ${p.save_amount}</span>}
                                </div>
                                <Link href={`/products/${p.slug}`} className="group block">
                                    <img src={p.image_url} alt={p.title} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" />
                                </Link>
                                <div className="p-4">
                                    <Link href={`/products/${p.slug}`} className="block text-lg font-semibold hover:underline mb-2">{p.title}</Link>
                                    <div className="flex items-center text-sm text-gray-600 mb-2">
                                        {[...Array(5)].map((_, i) => <span key={i} className="text-green-500 mr-1">★</span>)}
                                        <span>{p.reviews_count} Reviews</span>
                                    </div>
                                    <div className="flex items-baseline justify-center mb-4">
                                        <span className="text-xl font-bold">${p.price}</span>
                                        {p.original_price && <span className="ml-2 text-gray-400 line-through">${p.original_price}</span>}
                                    </div>
                                    <button onClick={() => handleAddToCart(p)} className="w-full bg-black text-white py-2 font-bold hover:bg-gray-800">Add to cart</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    {hovered && (
                        <>
                            {chunkIndex > 0 && <button onClick={prevChunk} className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">‹</button>}
                            {chunkIndex < chunks.length - 1 && <button onClick={nextChunk} className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow">›</button>}
                        </>
                    )}
                </div>
            </section>

            {/* Cart Sidebar */}
            <ShopSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                setCart={setCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />

            {/* Product Lines Tabs */}
            <section className="mt-20 max-w-7xl mx-auto px-4"><ProductTabs /></section>

            {/* Testimonials */}
            <section className="mt-20 max-w-7xl mx-auto px-4">
                <h2 className="text-4xl font-bold mb-6">AS SEEN ON SOCIAL</h2>
                <TestimonialCarousel />
            </section>

            {/* Promo */}
            <section className="mt-20 max-w-7xl mx-auto px-4"><PromoSection /></section>

            {/* Brand Story */}
            <section className="mt-20 max-w-7xl mx-auto px-4 mb-20"><BrandStorySection /></section>
        </>
    );
}
