import React from 'react';

const BrandStorySection = () => {
    return (
        <div className="py-10">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                    {/* Image Section */}
                    <div className="relative">
                        <img
                            src="/static/images/dev2.jpg"
                            alt="Plant Leaf"
                            className="w-full max-w-lg mx-auto h-[400px] object-cover"
                        />
                    </div>

                    {/* Text Section */}
                    <div>
                        <p className="text-lg text-gray-600 mb-4 text-center md:text-left">
                            DISCOVER OUR STORY
                        </p>
                        <h2 className="text-2xl md:text-4xl font-bold text-black mb-6 text-center md:text-left">
                            DEVSHOP'S ORIGINAL
                        </h2>

                        <p className="text-lg text-gray-700 mb-8">
                            From the latest electronics and stylish fashion to smart home
                            essentials and beautiful décor, our products are carefully chosen
                            to bring quality, comfort, and inspiration into every part of your life.
                        </p>
                        <a
                            href="/about"
                            className="text-lg font-bold text-black hover:text-sky-600 border-b-2 border-black hover:border-sky-600 pb-1"
                        >
                            LEARN MORE
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BrandStorySection;
