// ProductCarousel.jsx
import React, { useCallback, useEffect } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from './CartContext.jsx';

const ProductCarousel = ({ setIsCartOpen, isCartOpen, products = [] }) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        slidesToScroll: 1,
        containScroll: 'trimSnaps',
        loop: true,
        align: 'start',
    });

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    // Auto-scroll every 4s
    useEffect(() => {
        if (!emblaApi) return;
        const interval = setInterval(() => emblaApi.scrollNext(), 4000);
        return () => clearInterval(interval);
    }, [emblaApi]);

    const { cart, setCart } = useCart();

    const handleAddToCart = (product) => {
        setCart(prevCart => {
            const existingProduct = prevCart.find(item => item.id === product.id);
            if (existingProduct) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevCart, {
                    ...product,
                    image_url: product.images?.[0] || '',
                    quantity: 1,
                    size: '',
                    category: product.category?.name || '',
                    price: product.price,
                    original_price: product.original_price,
                }];
            }
        });
        setIsCartOpen(true);
    };

    return (
        <div className="mt-6">
            <h3 className="text-md font-bold text-center mb-6">YOU'LL LOVE THESE</h3>

            <div className="relative">
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex gap-4">
                        {products.map((product) => (
                            <div
                                className="basis-1/3 flex-shrink-0 bg-white p-3 rounded-lg shadow-sm"
                                key={product.id}
                            >
                                <img
                                    src={product.images?.[0] || '/fallback.jpg'}
                                    alt={product.title}
                                    className="w-full h-[7rem] object-cover mb-3 rounded"
                                />
                                <h4 className="text-xs font-bold">{product.title}</h4>
                                <p className="text-gray-700 font-bold">
                                    ${product.price?.toFixed(2)}
                                </p>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="mt-1 bg-black text-white py-2 w-full hover:bg-gray-800 text-sm rounded"
                                >
                                    ADD
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronLeft size={20} />
                </button>
                <button
                    onClick={scrollNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-2 hover:bg-gray-100"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
};

export default ProductCarousel;
