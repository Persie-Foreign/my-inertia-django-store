import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom'; // Import NavLink
import '../assets/css/global.css'; // Ensure Tailwind CSS is included in your global CSS

// Reusable Component: Mega Menu Column
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

// Reusable Component: Image Card
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

export default function Previewpage() {
    const [hidePreview, setHidePreview] = useState(false);
        const location = useLocation(); // ✅ Add this

            // ✅ Automatically hide preview on route change to /shop-all
    useEffect(() => {
        if (location.pathname === '/shop-all') {
            setHidePreview(true);
        } else {
            setHidePreview(false);
        }
    }, [location.pathname]);
    const skinConcerns = [
        "Acne",
        "Blackhead & Clogged Pores",
        "Dark Spots",
        "Dullness",
        "Dryness & Skin Barrier",
        "Sensitive",
        "Signs of Aging",
        "Textural Irregularities",
    ];

    const ingredients = [
        "Heartleaf (Houttuynia Cordata)",
        "Peach",
        "Rice",
        "Ceramide",
        "Niacinamide",
        "Tranexamic Acid",
        "Hyaluronic Acid",
        "AHA BHA PHA",
    ];

    const glassSkinRoutine = [
        "Cleanser",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
        "Toner",
    ];

    return (
        <li className="relative group" onMouseLeave={() => setHidePreview(false)}>
            <NavLink
                to="/shop-all"
                onClick={() => setHidePreview(true)}
                className={({ isActive }) =>
                    `relative inline-block pb-1 transition-colors ${isActive ? 'text-gray-900' : 'text-gray-600 hover:text-gray-900'}`
                }
            >
                <span className="transition-all gap-4 duration-300 ease-out border-b-2 border-transparent">SHOP ALL</span>
                <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-gray-800 transition-all duration-300 ease-out group-hover:w-full"></span>
            </NavLink>

            {/* Mega Menu */}
            <div className={`absolute left-1/2 top-full transform -translate-x-1/2 w-full md:w-[115vw] bg-white shadow-2xl border-t border-gray-200 mt-2 transition-all duration-300 ease-out z-50 ${hidePreview ? 'opacity-0 pointer-events-none' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'
                }`}>
                <div className="max-h-[580px] overflow-y-auto grid grid-cols-3 gap-10 px-70 py-16">
                    {/* Column 1: Skin Concerns */}
                    <MegaMenuColumn
                        title="Skin Concern"
                        items={skinConcerns}
                    />

                    {/* Column 2: Ingredients */}
                    <MegaMenuColumn
                        title="Gentle + Effective Ingredients"
                        items={ingredients}
                    />

                    {/* Column 3: Image Cards */}
                    <div className="col-span-1 w-130 flex flex-row justify-center space-x-6">
                        {/* Card 1 */}
                        <ImageCard
                            src="/src/public/images/gommage3.jpeg"
                            alt="Ultimate Serum"
                            label="ULTIMATE SERUM"
                        />

                        {/* Card 2 */}
                        <ImageCard
                            src="/src/public/images/gommage4.jpeg"
                            alt="Model"
                            label=""
                        />
                    </div>

                    {/* Column 4: Glass Skin Routine */}
                    <MegaMenuColumn
                        title="Glass Skin Routine"
                        items={glassSkinRoutine}
                    />
                </div>
            </div>
        </li>
    );
}