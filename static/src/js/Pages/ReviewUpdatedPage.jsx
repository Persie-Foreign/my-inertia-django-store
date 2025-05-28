import React from 'react';
import {Link, usePage} from "@inertiajs/react";


export default function ReviewUpdatedPage() {
    // Get the current product and the list of top-reviewed products
    const { product, products } = usePage().props;
    const { reviews = [] } = usePage().props;



    return (
        <div className="bg-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-4 border-x border-gray-300 bg-white">
                {/* Header */}
                <header className="flex justify-center items-center border-b border-gray-200 py-4">
                    <h1 className="text-4xl font-bold">DevShop</h1>
                </header>

                {/* Main Content */}
                <main className="py-10">
                    {/* Confirmation Message */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="mb-4 text-4xl">🎉</div>
                        <div>
                            <h2 className="text-xl text-center font-semibold mb-2">Review Updated!</h2>
                            <p className="text-gray-600">Thanks for sharing your feedback with us!</p>
                        </div>
                    </div>

                    {/* Verification Message */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <h3 className="text-xl font-semibold mb-2">Please Verify Your Email Address</h3>
                        <p className="text-gray-600">You will receive an email with a verification link soon</p>
                    </div>

                    {/* Continue Shopping Button */}
                    <Link href="/products">
                        <button className="w-full bg-green-700 text-white px-4 py-3 text-lg font-semibold rounded hover:bg-green-800 transition duration-300 mt-8">
                            Continue Shopping
                        </button>
                    </Link>

                    {/* Top-Reviewed Products Section */}
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <h2 className="text-2xl font-semibold mb-6">Shop More Top-Reviewed Products</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Array.isArray(products) && products.map((item) => {
                                const MAX_REVIEWS = 20; // Adjust depending on your logic
                                const filledStars = Math.min(5, (item.reviews / MAX_REVIEWS) * 5);

                                return (
                                    <div key={item.id} className="bg-gray-100 p-2 border border-gray-200">
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="w-20 h-20 object-cover mb-4"
                                        />
                                        <h3 className="text-lg font-semibold">{item.title}</h3>

                                        {/* Stars based on each product's review count */}
                                        <div className="flex items-center mb-2">
                                            {[...Array(5)].map((_, i) => (
                                                <svg
                                                    key={i}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-8 h-8"
                                                    viewBox="0 0 24 24"
                                                    fill={i < Math.round(filledStars) ? '#14532d' : 'none'}
                                                    stroke='#9ca3af'
                                                    strokeWidth="1"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1
                               1 0 00.95.69h4.905c.969 0 1.371 1.24.588
                               1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518
                               4.674c.3.921-.755 1.688-1.54
                               1.118l-3.974-2.89a1 1 0 00-1.176
                               0l-3.974 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1
                               1 0 00-.364-1.118l-3.974-2.89c-.783-.57-.38-1.81.588-1.81h4.905a1
                               1 0 00.95-.69l1.518-4.674z"
                                                    />
                                                </svg>
                                            ))}
                                        </div>

                                        <div className="text-gray-500">
                                            <span className="font-medium">{item.reviews} Reviews</span>
                                        </div>

                                        <Link href={`/products/${item.slug}`}>
                                            <button className="w-full bg-green-700 text-white py-2 mt-2 text-lg font-semibold rounded hover:bg-green-800 transition duration-300">
                                                Shop Now
                                            </button>
                                        </Link>

                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
