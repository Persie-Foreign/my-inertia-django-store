import React, { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import '../../../css/app.css';
import {useMegaMenu} from "./MegaMenuContext.jsx";

const MegaMenuColumn = ({ title, items }) => (
    <div>
        <h4 className="font-bold text-gray-800 mb-3 uppercase text-sm">{title}</h4>
        <ul className="space-y-2 text-sm text-gray-600">
            {items.map((item, index) => (
                <li key={index}><a href="#">{item}</a></li>
            ))}
        </ul>
    </div>
);

const ImageCard = ({ src, alt, label }) => (
    <div className="bg-white overflow-hidden">
        <div className="overflow-hidden">
            <img
                src={src}
                alt={alt}
                className="w-120 h-80 object-cover transform transition-transform duration-6000 ease-in-out hover:scale-110"
            />
        </div>
        <div className="p-4 text-center">
            <p className="text-sm font-semibold text-gray-800">{label}</p>
        </div>
    </div>
);
export default function Previewpage({ linkTextColor }) {
    const { isMegaOpen, setMegaOpen } = useMegaMenu();
    const [currentPath, setCurrentPath] = useState(
        typeof window !== 'undefined' ? window.location.pathname : '/'
    );

    useEffect(() => {
        const onLoc = () => setCurrentPath(window.location.pathname);
        window.addEventListener('popstate', onLoc);
        return () => window.removeEventListener('popstate', onLoc);
    }, []);

    // hideDropdown whenever we navigate
    useEffect(() => setMegaOpen(currentPath === '/products'), [currentPath]);

    const Electronics = [
        "Phones", "Watches", "Computers", "TV",
        "Dryness & Skin Barrier", "Sensitive", "Signs of Aging", "Textural Irregularities",
    ];

    const ingredients = [
        "Heartleaf (Houttuynia Cordata)", "Peach", "Rice", "Ceramide",
        "Niacinamide", "Tranexamic Acid", "Hyaluronic Acid", "AHA BHA PHA",
    ];

    const glassSkinRoutine = [
        "Cleanser", "Toner", "Toner", "Toner", "Toner", "Toner", "Toner", "Toner", "Toner", "Toner", "Toner",
    ];


    return (
        <li
            className="relative group list-none"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
        >
            <Link
                href="/products"
                onClick={() => setMegaOpen(false)}
                className={`
          inline-block pb-1 transition-colors
          ${currentPath === '/products'
                    ? 'text-black'
                    : `${linkTextColor} hover:text-blue-400`}
        `}
            >
                <span className="text-lg font-semibold">Shop All</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-800
                         transition-all duration-300 ease-out
                         group-hover:w-full" />
            </Link>


            <div
                className={`
                  absolute left-1/2 top-full transform -translate-x-1/2
                  w-screen max-w-screen-xl bg-white shadow-2xl border-t border-gray-200 mt-2
                  transition-all duration-300 ease-out z-50 overflow-x-hidden
                  ${isMegaOpen
                            ? 'opacity-100 pointer-events-auto'
                            : 'opacity-0 pointer-events-none'}
                `}
            >
                <div className="max-h-[580px] overflow-y-auto grid grid-cols-3 gap-10 px-6 md:px-12 py-16">
                    <MegaMenuColumn title="Electronics" items={Electronics} />
                    <MegaMenuColumn title="Gentle + Effective Ingredients" items={ingredients} />
                    <div className="col-span-1 flex flex-row justify-center  space-x-6">
                        <ImageCard
                            src="/static/images/dev4.jpg"
                            alt="Electronics"
                            label="Electronics"
                        />
                        <ImageCard
                            src="/static/images/dev2.jpg"
                            alt="Cosmetics"
                            label=""
                        />
                    </div>
                    <MegaMenuColumn title="Glass Skin Routine" items={glassSkinRoutine} />
                </div>
            </div>

        </li>
    );
}
