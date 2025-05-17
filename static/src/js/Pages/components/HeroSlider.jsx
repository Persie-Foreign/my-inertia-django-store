// static/src/js/Components/HeroSlider.jsx

import React, { useState, useEffect } from 'react';
import { Link }                   from '@inertiajs/react';
import { usePage }                from '@inertiajs/react';

export default function HeroSlider({ slides, baseUrl = '/static/images/' }) {
    const slideDuration = 4000;
    const [current, setCurrent] = useState(0);
    const [active,  setActive]  = useState(0);
    const [busy,    setBusy]    = useState(false);

    const asset = usePage

    // auto‐advance dots
    useEffect(() => {
        if (busy) return;
        const t = setTimeout(
            () => setActive((d) => (d + 1) % slides.length),
            slideDuration
        );
        return () => clearTimeout(t);
    }, [active, busy, slides.length]);

    // update slide
    useEffect(() => {
        if (busy) return;
        const t = setTimeout(() => setCurrent(active), slideDuration);
        return () => clearTimeout(t);
    }, [active, busy]);

    const handleDot = (i) => {
        if (i === current || busy) return;
        setActive(i);
        setBusy(true);
        setTimeout(() => {
            setCurrent(i);
            setActive((i + 1) % slides.length);
            setBusy(false);
        }, slideDuration);
    };

    return (
        <section className="relative h-screen overflow-hidden">
            <img
                src={asset(slides[current].image)}
                alt={slides[current].heading}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-start px-10">
                <h1 className="text-5xl font-bold text-white mb-4">
                    {slides[current].heading}
                </h1>
                <p className="text-xl text-white mb-6">
                    {slides[current].subheading}
                </p>
                <Link
                    href={slides[current].href || '/products'}
                    className="bg-white text-black px-6 py-3 font-semibold hover:bg-gray-100"
                >
                    {slides[current].buttonText}
                </Link>
            </div>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => handleDot(i)}
                        className={`w-4 h-4 rounded-full ${
                            i === current
                                ? 'bg-white'
                                : 'bg-gray-400 bg-opacity-50'
                        }`}
                    />
                ))}
            </div>
        </section>
    );
}
