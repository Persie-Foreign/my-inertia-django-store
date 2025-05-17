// static/src/js/Pages/Shared/ProductTabs.jsx

import React, { useEffect } from 'react';
import { useCart }       from './CartContext.jsx';
import ShopSidebar       from './ShopSidebar.jsx';
import { Head, Link, usePage } from '@inertiajs/react';

function ProductCard({
                         id,
                         image_url: image,
                         title,
                         reviews_count: reviews,
                         price,
                         original_price,
                         setIsCartOpen,
                         isCartOpen,
                     }) {
    const product = { id, image, name: title, reviews, price, originalPrice: original_price };
    const { cart, setCart } = useCart();

    const handleAddToCart = () => {
        setCart((prev) => {
            const exists = prev.find((i) => i.id === product.id);
            if (exists) {
                return prev.map((i) =>
                    i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        setIsCartOpen(true);
    };

    const handleRemoveFromCart = (id) =>
        setCart((prev) => prev.filter((i) => i.id !== id));

    // Prevent background scroll when cart is open
    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

    return (
        <div className="rounded-lg overflow-hidden shadow-sm w-full bg-gray-100 relative">
            {/* Badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1 px-2">
        <span className="bg-black text-white text-xs px-2 py-1 font-bold text-center w-10">
          BEST
        </span>
                {original_price && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 font-bold text-center w-20">
            SAVE ${Math.round(original_price - price)}
          </span>
                )}
            </div>

            {/* Image & Link */}
            <Link href={`/products/${id}`}>
                <img src={image} alt={title} className="w-full h-64 object-cover" />
            </Link>

            {/* Details */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-center mb-2">{title}</h3>
                <div className="flex items-center justify-center text-sm text-gray-600 mb-3">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-green-500 mr-1">★</span>
                    ))}
                    <span>{reviews} Reviews</span>
                </div>
                <div className="text-center mb-4">
                    <span className="font-bold">${price}</span>
                    {original_price && (
                        <span className="ml-2 text-gray-400 line-through">${original_price}</span>
                    )}
                </div>
                <button
                    onClick={handleAddToCart}
                    className="group relative w-full border py-2 text-center uppercase font-bold overflow-hidden"
                >
          <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
            Add to cart
          </span>
                    <span className="absolute inset-0 bg-black transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                </button>
            </div>

            {/* Cart Sidebar */}
            <ShopSidebar
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                setCart={setCart}
                handleRemoveFromCart={handleRemoveFromCart}
            />
        </div>
    );
}

export default function ProductTabs() {
    const { productsByCategory = {} } = usePage().props;
    const categories = Object.keys(productsByCategory); // e.g. ['Heartleaf','Rice','Peach']
    const [activeTab, setActiveTab] = React.useState(categories[0]);
    const [isCartOpen, setIsCartOpen] = React.useState(false);

    return (
        <>
            <Head title="Product Lines" />

            {/* Tab navigation */}
            <nav className="flex border-b mb-4">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-2 text-lg font-bold transition ${
                            activeTab === cat
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {/* Tab content */}
            <div className="grid grid-cols-4 gap-6">
                {productsByCategory[activeTab]?.map((p) => (
                    <ProductCard
                        key={p.id}
                        {...p}
                        setIsCartOpen={setIsCartOpen}
                        isCartOpen={isCartOpen}
                    />
                ))}
            </div>
        </>
    );
}
