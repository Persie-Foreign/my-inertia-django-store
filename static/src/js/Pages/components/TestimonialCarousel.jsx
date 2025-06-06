import React from 'react';

const videoData = [
    { src: '/static/videos/vid1.mp4', title: 'NIACINAMIDE...', price: '$22.00' },
    { src: '/static/videos/vid2.mp4', title: 'Rice Enzyme...', price: '$18.00' },
    { src: '/static/videos/vid3.mp4', title: 'Azelaic Acid...', price: '$22.00' },
    { src: '/static/videos/vid4.mp4', title: 'Double Cleansing...', price: '$34.00', original: '$40.00' },
    { src: '/static/videos/vid5.mp4', title: 'Vitamin C Serum...', price: '$26.00' },
    { src: '/static/videos/vid6.mp4', title: 'Hydrating Cream...', price: '$24.00' },
    { src: '/static/videos/vid1.mp4', title: 'Rose Water Toner...', price: '$19.00' },
    { src: '/static/videos/vid2.mp4', title: 'HA Moisturizer...', price: '$25.00' },
    { src: '/static/videos/vid3.mp4', title: 'Ceramide Barrier...', price: '$30.00', original: '$35.00' },
];

const TestimonialCarousel = () => {
    return (
        <div className="py-10">
            <div className="flex overflow-x-auto space-x-4 snap-x scroll-smooth px-4 hide-scrollbar">
                {videoData.map((video, index) => (
                    <div
                        key={index}
                        className="snap-start flex-shrink-0 w-[90%] sm:w-1/2 md:w-1/3 lg:w-1/5 relative bg-white rounded-lg overflow-hidden shadow-sm"
                    >
                        <video autoPlay loop muted className="w-full h-full object-cover">
                            <source src={video.src} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                        <div className="flex items-center bg-transparent justify-between mb-2 absolute bottom-1 left-2 z-20">
                            <div className="w-8 h-8 rounded flex items-center justify-center mr-2">
                                <img
                                    src="/static/images/dev2.jpg"
                                    alt="Product"
                                    className="w-10 h-10 object-cover rounded"
                                />
                            </div>
                            <div className="text-white">
                                <h3 className="text-sm font-bold">{video.title}</h3>
                                <p className="text-sm">
                                    {video.price}{' '}
                                    {video.original && (
                                        <span className="text-gray-400 line-through">{video.original}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TestimonialCarousel;
