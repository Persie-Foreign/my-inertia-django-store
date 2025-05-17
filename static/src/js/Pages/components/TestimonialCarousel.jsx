import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TestimonialCarousel = () => {
    const [currentPage, setCurrentPage] = useState(1);

    const handleNextPage = () => {
        setCurrentPage(2);
    };

    const handlePrevPage = () => {
        setCurrentPage(1);
    };

    return (
        <div className="py-10">
            {currentPage === 1 && (
                <>
                    {/* Testimonial Grid - Page 1 */}
                    <div className="grid grid-cols-5 gap-5">
                        {/* Testimonial 1 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid1.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">NIACINAMIDE...</h3>
                                    <p className="text-sm">$22.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid2.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Rice Enzyme...</h3>
                                    <p className="text-sm">$18.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid3.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Azelaic Acid 10...</h3>
                                    <p className="text-sm">$22.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 4 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid4.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">NIACINAMIDE...</h3>
                                    <p className="text-sm">$22.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 5 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid5.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Double Cleansing D...</h3>
                                    <p className="text-sm">$34.00 <span className="text-gray-400 line-through">$40.00</span></p>
                                </div>
                            </div>
                            {/* Next Button Icon */}
                            <button
                                onClick={handleNextPage}
                                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-30"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </>
            )}

            {currentPage === 2 && (
                <>
                    {/* Testimonial Grid - Page 2 */}
                    <div className="grid grid-cols-5 gap-5">
                        {/* Testimonial 6 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid6.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Vitamin C Serum...</h3>
                                    <p className="text-sm">$26.00</p>
                                </div>
                            </div>
                            {/* Previous Button Icon */}
                            <button
                                onClick={handlePrevPage}
                                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition z-30"
                            >
                                <ChevronLeft size={20} />
                            </button>
                        </div>

                        {/* Testimonial 7 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid7.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Hydrating Cream...</h3>
                                    <p className="text-sm">$24.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 8 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid1.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Rose Water Toner...</h3>
                                    <p className="text-sm">$19.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 9 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid2.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">HA Moisturizer...</h3>
                                    <p className="text-sm">$25.00</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 10 */}
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm">
                            <video
                                autoPlay
                                loop
                                muted
                                className="w-full h-full object-cover"
                            >
                                <source src="/src/assets/videos/vid3.mp4" type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                                <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                    <img
                                        src="/src/assets/images/dev2.jpg"
                                        alt="Product"
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                </div>
                                <div className="text-white">
                                    <h3 className="text-sm font-bold">Ceramide Barrier...</h3>
                                    <p className="text-sm">$30.00 <span className="text-gray-400 line-through">$35.00</span></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TestimonialCarousel;