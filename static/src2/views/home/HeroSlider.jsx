import React, { useState, useEffect } from 'react';

const HeroSlider = ({ slides }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const slideCount = slides.length;
    const slideDuration = 5000; // 5 seconds per slide

    // Automatically cycle slides
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slideCount);
        }, slideDuration);

        return () => clearInterval(interval);
    }, [slideCount]);

    return (
        <section className="relative h-screen overflow-hidden">
            {/* Image */}
            <div className="absolute inset-0 transition-all duration-500 ease-in-out">
                <img
                    src={slides[currentSlide].image}
                    alt="Hero"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Text Content */}
            <div className="absolute inset-0 flex items-center px-10">
                <div className="max-w-2xl text-white">
                    <h1 className="text-5xl font-bold mb-4">{slides[currentSlide].heading}</h1>
                    <p className="text-xl mb-8">{slides[currentSlide].subheading}</p>
                    <button className="bg-black text-white px-6 py-3 text-lg font-bold">
                        {slides[currentSlide].buttonText}
                    </button>
                </div>
            </div>

            {/* Dots */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-4">
                {slides.map((_, index) => (
                    <div
                        key={index}
                        className="relative w-4 h-4 rounded-full border-2 border-white"
                    >
                        {/* Active dot has an animated inner fill */}
                        {index === currentSlide && (
                            <div
                                className="absolute inset-0 rounded-full bg-white animate-fill"
                                style={{ animationDuration: `${slideDuration}ms` }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Tailwind custom animation */}
            <style>{`
                @keyframes fill {
                    0% { transform: scaleX(0); opacity: 0.5; }
                    100% { transform: scaleX(1); opacity: 1; }
                }
                .animate-fill {
                    transform-origin: left;
                    animation: fill linear forwards;
                }
            `}</style>
        </section>
    );
};

export default HeroSlider;
