import React from 'react';
import { Link } from '@inertiajs/react';

const PromoSection = () => {
    return (
        <div className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-2 ">
                {/* Left Promo Card */}
                <div className="relative bg-white overflow-hidden shadow-sm">
                    <img
                        src="/static/images/dev5.jpg"
                        alt="Clothes"
                        className="w-full h-[520px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Link
                            href="/products?category=Clothes"
                            className="w-48 relative border border-black py-2 text-center uppercase font-bold overflow-hidden group bg-black text-white"
                        >
                            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                                Shop Clothes
                            </span>
                            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    </div>
                </div>

                {/* Right Promo Card */}
                <div className="relative bg-white overflow-hidden shadow-sm">
                    <img
                        src="/static/images/dev2.jpg"
                        alt="Cleansers"
                        className="w-full h-[520px] object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Link
                            href="/products?category=Electronics"
                            className="w-48 relative border border-black py-2 text-center uppercase font-bold overflow-hidden group bg-black text-white"
                        >
                            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                                Shop Electronics
                            </span>
                            <span className="absolute inset-0 bg-white transform scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromoSection;
