import React from 'react';
import { Link } from '@inertiajs/react';

export default function BrandStory() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-16 bg-gray-50 mt-20">
            {/* Heading Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About DevShop</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Welcome to <span className="font-semibold text-sky-600">DevShop</span> — your one-stop destination for premium electronics, fashion, home essentials, beauty, and more.
                    We are committed to curating high-quality products that enrich your lifestyle.
                </p>
            </div>

            {/* Mission Section */}
            <section className="mb-14 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-3">Our Mission</h2>
                <p className="text-gray-600 leading-relaxed">
                    At DevShop, we empower everyday living by offering a seamless shopping experience. Whether you're upgrading your tech, refreshing your wardrobe, or transforming your living space — we're here to help you make it happen.
                </p>
            </section>

            {/* What We Offer Section */}
            <section className="mb-14 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">What We Offer</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-600">
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Electronics</h3>
                        <p>Latest smartphones, laptops, TVs, and smart devices to keep you connected and entertained.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Home Appliances</h3>
                        <p>Durable appliances — refrigerators, washers, microwaves, and more for modern living.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Fashion</h3>
                        <p>Stylish apparel and accessories for men, women, and children — fit for every occasion.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Beauty & Skincare</h3>
                        <p>Top-notch skincare products, perfumes, and self-care essentials curated for your glow.</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-xl">
                        <h3 className="font-semibold text-gray-900 mb-2">Furniture & Décor</h3>
                        <p>Inspiring furniture and home décor to transform your spaces into elegant sanctuaries.</p>
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="mb-14 px-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Shop With Us?</h2>
                <ul className="space-y-4">
                    <li className="flex items-start pb-3 border-b border-gray-200 last:border-b-0">
            <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </span>
                        <div>
                            <span className="font-medium text-gray-900">Quality Guaranteed</span> — Handpicked products for reliability and satisfaction.
                        </div>
                    </li>
                    <li className="flex items-start pb-3 border-b border-gray-200 last:border-b-0">
            <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </span>
                        <div>
                            <span className="font-medium text-gray-900">Trusted Brands</span> — Only the best from global and local partners.
                        </div>
                    </li>
                    <li className="flex items-start pb-3 border-b border-gray-200 last:border-b-0">
            <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </span>
                        <div>
                            <span className="font-medium text-gray-900">Fast & Secure Delivery</span> — Quick, safe shipping to your doorstep.
                        </div>
                    </li>
                    <li className="flex items-start">
            <span className="flex items-center justify-center w-8 h-8 bg-green-100 text-green-700 rounded-full mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
            </span>
                        <div>
                            <span className="font-medium text-gray-900">Customer-Centric Support</span> — Friendly and responsive team at your service.
                        </div>
                    </li>
                </ul>
            </section>

            {/* Call to Action */}
            <div className="text-center px-4">
                <Link href="/products">
                    <button className="bg-black text-white px-6 py-3 text-lg font-bold rounded hover:bg-gray-800 transition duration-300 cursor-pointer">
                        Browse Our Collection
                    </button>
                </Link>
            </div>
        </div>
    );
}