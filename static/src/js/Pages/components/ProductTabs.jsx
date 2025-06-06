import React, { useEffect, useState } from 'react';
import { useCart } from './CartContext.jsx';
import ShopSidebar from './ShopSidebar.jsx';
import { Head, Link, usePage } from '@inertiajs/react';
import { currencies, useCurrency } from './CurrencyContext.jsx';
import toast from 'react-hot-toast';

function ProductCard({
                         id,
                         slug,
                         image_url,
                         hover_image_url,
                         title,
                         reviews_count,
                         price,
                         original_price,
                         is_new,
                         is_best,
                         save_amount,
                         rating = 0,
                         setIsCartOpen,
                         isCartOpen,
                         category,
                     }) {
    const product = {
        id,
        image: image_url,
        title,
        reviews: reviews_count,
        price,
        originalPrice: original_price,
        quantity: 1,
        size: '',
    };

    const { cart, setCart } = useCart();
    const [isHovered, setIsHovered] = useState(false);

    const handleAddToCart = () => {
        setCart(prevCart => {
            const totalQuantity = prevCart.reduce((sum, item) => sum + item.quantity, 0);

            // Prevent adding more than 10 total items
            if (totalQuantity >= 10) {
                toast.error('Cart limit reached. You can only have up to 10 items.');
                return prevCart;
            }

            const existing = prevCart.find(i => i.id === product.id);

            if (existing) {
                // Only add if still under 10 limit
                if (totalQuantity + 1 > 10) {
                    toast.error('Cart limit reached. You can only have up to 10 items.');
                    return prevCart;
                }

                return prevCart.map(i =>
                    i.id === product.id
                        ? { ...i, quantity: i.quantity + 1 }
                        : i
                );
            }

            // Add new item if still under 10
            return [...prevCart, { ...product, quantity: 1 }];
        });

        setIsCartOpen(true);
    };


    const handleRemoveFromCart = id =>
        setCart(prev => prev.filter(i => i.id !== id));

    useEffect(() => {
        document.body.style.overflow = isCartOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCartOpen]);

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
        <div className="rounded-lg overflow-hidden shadow-sm w-full bg-gray-100 relative">
            <div className="absolute top-2 left-2 flex flex-col space-y-1 z-10 px-2">
                {is_new && <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">NEW</span>}
                {is_best && <span className="bg-black text-white text-xs px-2 py-1 rounded">BEST</span>}
                {save_amount != null && (
                    <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
            SAVE FCFA{save_amount}
          </span>
                )}
            </div>

            <Link href={`/products/${slug}`}>
                <img
                    src={isHovered && hover_image_url ? hover_image_url : image_url}
                    alt={title}
                    className="w-full h-48 object-cover transition duration-300"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                />
            </Link>

            <div className="p-4">
                <Link
                    href={`/products/${slug}`}
                    className="block"
                >
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                </Link>
                <p className="text-sm text-gray-600">{category?.name}</p>
                <div className="flex items-center text-sm text-gray-600 mb-2 justify-center">
                    {[...Array(5)].map((_, i) => (
                        <span
                            key={i}
                            className={i < Math.round(rating) ? "text-green-500 mr-1" : "text-gray-300 mr-1"}
                        >
              ★
            </span>
                    ))}
                    <span>{reviews_count} Reviews</span>
                </div>
                <div className="flex items-baseline justify-center mb-4">
          <span className="text-xl font-bold text-red-500">
            {selectedCurrency.symbol}{convertAmount(price).toFixed(2)}
          </span>
                    {original_price && (
                        <span className="ml-2 text-gray-400 line-through">
              {selectedCurrency.symbol}{convertAmount(original_price).toFixed(2)}
            </span>
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

export default function ProductTabs({ isCartOpen, setIsCartOpen }) {
    const { productsByCategory = {} } = usePage().props;
    const categories = Object.keys(productsByCategory);
    const [activeTab, setActiveTab] = useState(categories[0]);
    const [activeSubcat, setActiveSubcat] = useState(null);

    const subcategories = Object.keys(productsByCategory[activeTab] || {});
    useEffect(() => {
        setActiveSubcat(subcategories[0]); // Set first subcategory as default
    }, [activeTab]);

    const getTabImage = (category, subcategory) => {
        const arr = productsByCategory[category]?.[subcategory];
        return arr?.[0]?.image_url || '';
    };

    return (
        <>
            <Head title="Product Lines" />

            {/* Main category tabs */}
            <nav className="flex border-b mb-4 overflow-x-auto">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveTab(cat)}
                        className={`px-6 py-2 text-lg font-bold transition whitespace-nowrap ${
                            activeTab === cat
                                ? 'text-gray-900 border-b-2 border-gray-900'
                                : 'text-gray-500 hover:text-gray-800'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </nav>

            {/* Product grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mt-2">
                {/* Subcategory image */}
                <div className="md:col-span-2">
                    <img
                        src={getTabImage(activeTab, activeSubcat)}
                        alt={`${activeSubcat} Model`}
                        className="w-full h-96 md:h-[50rem] rounded-lg object-cover"
                    />
                </div>

                {/* Product cards */}
                <div className="md:col-span-2 grid grid-cols-2 gap-5">
                    {(productsByCategory[activeTab]?.[activeSubcat] || []).slice(0, 4).map(p => (
                        <ProductCard
                            key={p.id}
                            {...p}
                            setIsCartOpen={setIsCartOpen}
                            isCartOpen={isCartOpen}
                        />
                    ))}
                </div>
            </div>
        </>
    );
}

