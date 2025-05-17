import React from 'react';
import ProductCarousel from "./ProductCarousel.jsx";

const CartSection = ({ onClose }) => {
    return (
        <div className="w-full p-5">
            {/* Cart Header */}
            <div className="relative border-b border-gray-200 pb-2 h-10 flex items-center justify-center">
                <h2 className="text-md font-bold absolute left-1/2 transform -translate-x-1/2">
                    YOUR CART (0)
                </h2>
                <button className="absolute right-2 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Free Shipping Message */}
            <div className="mt-4 border-b border-gray-200 pb-4">
                <h3 className="text-md font-bold text-center">
                    YOU ARE $60.00 AWAY FROM FREE SHIPPING!
                </h3>
                <div className="mt-2">
                    <div className="flex items-center justify-center">
                        <div className="w-[23rem] bg-gray-200 h-2"></div>
                    </div>
                </div>
            </div>

            {/* Empty Cart Message */}
            <div className="mt-4 text-center">
                <h3 className="text-lg font-bold">YOUR CART IS EMPTY!</h3>
                <p className="mt-2 text-gray-600">
                    Add your favorite items to your cart.
                </p>
                <button className="mt-4 bg-black text-white py-2 px-6 text-xl font-bold hover:bg-gray-800 w-full">
                    Shop Now
                </button>
            </div>

            {/* Recommended Products */}
            <div className="mt-4">
                <ProductCarousel/>
            </div>
        </div>
    );
};

export default CartSection;
