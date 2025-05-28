import React, { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SkinProfileForm from "./SkinProfileForm.jsx";

export default function ReviewSubmissionPage() {
    const [searchParams] = useSearchParams();
    const productId = searchParams.get('productId');
    const title = searchParams.get('title');
    const image = searchParams.get('image');
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDescription, setReviewDescription] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [age, setAge] = useState("");

    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);

    const fileInputRef = useRef(null);

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const [mediaFiles, setMediaFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newMedia = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith("video") ? "video" : "image",
        }));
        setMediaFiles((prev) => [...prev, ...newMedia]);
    };

    const handleRemove = (urlToRemove) => {
        setMediaFiles((prev) => prev.filter((file) => file.url !== urlToRemove));
    };

    const [selectedConcerns, setSelectedConcerns] = useState([]);
    const [skinType, setSkinType] = useState('');

    const concernOptions = [
        'Acne', 'Ageing', 'Pigmentation', 'Redness', 'Sensitivity',
        'Scarring', 'Blackheads', 'Dryness', 'Oiliness', 'Large Pores',
        'Wrinkles', 'Sun Damage', 'Irritation', 'Texture'
    ];

    const skinTypeOptions = [
        'Normal', 'Super Dry', 'Dry', 'Oily', 'Combination'
    ];

    const handleConcernToggle = (concern) => {
        // Prevent full page refresh or re-rendering
        if (selectedConcerns.includes(concern)) {
            setSelectedConcerns(prev => prev.filter(c => c !== concern));
        } else if (selectedConcerns.length < 5) {
            setSelectedConcerns(prev => [...prev, concern]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reviewData = {
            productId,
            title: reviewTitle,
            description: reviewDescription,
            rating: selectedStar,
            media: mediaFiles,  // note: better to upload these to backend or S3, not just keep URLs
            name,
            email,
            age,
            concerns: selectedConcerns,
            skinType,
            date: new Date().toISOString(),
        };

        // Send `reviewData` to your backend or local storage
        await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reviewData),
        });

        // Optionally redirect or show a success message
        alert('Review submitted successfully!');};


    return (
        <div className="bg-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-8 border-x border-gray-300 bg-white">
                <header className="border-b border-gray-200 py-4">
                    <h1 className="text-center text-4xl font-bold">DevShop</h1>
                </header>

                <main className="py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-start mb-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mr-6">
                                <img src={image} alt="Product" className="max-h-full" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-semibold mb-2">{title}</h2>
                                <div className="flex items-center mb-4 space-x-2">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isActive = hoveredStar >= star || (!hoveredStar && selectedStar >= star);
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onMouseEnter={() => setHoveredStar(star)}
                                                onMouseLeave={() => setHoveredStar(0)}
                                                onClick={() => setSelectedStar(star)}
                                                className="group text-gray-300"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-8 h-8 transition-colors"
                                                    viewBox="0 0 24 24"
                                                    fill={isActive ? '#14532d' : 'none'}
                                                    stroke={isActive ? '#14532d' : '#9ca3af'}
                                                    strokeWidth={1.5}
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.316 7.16h7.497c.969 0 1.371 1.24.588 1.81l-6.06 4.404 2.316 7.16c.3.921-.755 1.688-1.54 1.13L12 19.347l-6.07 4.244c-.784.558-1.838-.209-1.539-1.13l2.316-7.16-6.06-4.404c-.783-.57-.38-1.81.588-1.81h7.497l2.316-7.16z" />
                                                </svg>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* ✅ Outer single form starts here */}
                        <form className="space-y-6">
                            {/* Review Title */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Review Title</label>
                                <input
                                    type="text"
                                    value={reviewTitle}
                                    onChange={(e) => setReviewTitle(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                />
                            </div>

                            {/* Review Description */}
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-900">Review Description</label>
                                <textarea
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 h-64"
                                    placeholder="Review Description"
                                ></textarea>
                            </div>

                            {/* Media Upload */}
                            <div
                                onClick={handleClick}
                                className="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center space-x-4 cursor-pointer min-h-[80px]"
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*,video/*"
                                    className="hidden"
                                    multiple
                                />

                                {mediaFiles.length > 0 ? (
                                    <div className="flex items-center space-x-2 overflow-x-auto">
                                        {mediaFiles.map((file, index) => (
                                            <div key={index} className="relative w-16 h-16 rounded overflow-hidden">
                                                {file.type === "video" ? (
                                                    <video src={file.url} className="w-full h-full object-cover" controls muted />
                                                ) : (
                                                    <img src={file.url} alt={`preview-${index}`} className="w-full h-full object-cover" />
                                                )}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove(file.url);
                                                    }}
                                                    className="absolute top-1 right-1 bg-gray-800 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center shadow"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                        <div className="bg-gray-200 p-3 rounded-md flex items-center justify-center w-16 h-16">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-gray-700"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2zM5 5h14v10H5V5zm14 14H5a2 2 0 01-2-2v-1h18v1a2 2 0 01-2 2zM8 11l2.03 2.71L13 10l4 5H5l3-4z" />
                                            </svg>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="bg-gray-200 p-3 rounded-md">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-gray-700"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M21 15V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2zM5 5h14v10H5V5zm14 14H5a2 2 0 01-2-2v-1h18v1a2 2 0 01-2 2zM8 11l2.03 2.71L13 10l4 5H5l3-4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="block font-medium text-sm text-gray-800">Add Photos or Videos</span>
                                            <span className="block text-sm text-gray-600">Click here or drag to upload</span>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Profile Info (not in a nested form!) */}
                            <div className="max-w-full mx-auto px-4 py-4">
                                <h2 className="text-xl font-bold mb-4">Your Profile</h2>

                                {/* Social Buttons */}
                                <div className="flex justify-center gap-4 mb-6 border border-gray-300 py-4">
                                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:shadow-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-6 h-6 text-black mr-2"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.207 11.387.6.113.793-.26.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.083-.73.083-.73 1.205.084 1.84 1.24 1.84 1.24 1.07 1.834 2.809 1.304 3.495.997.108-.775.42-1.305.762-1.604-2.665-.304-5.467-1.333-5.467-5.93 0-1.31.468-2.382 1.236-3.222-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.3 1.23a11.53 11.53 0 0 1 3.003-.403c1.018.005 2.044.138 3.003.403 2.29-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.874.12 3.176.77.84 1.235 1.912 1.235 3.222 0 4.61-2.807 5.624-5.48 5.921.43.37.823 1.102.823 2.222v3.293c0 .32.192.694.8.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {/* GitHub icon */}
                                        Continue with Github
                                    </button>
                                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:shadow-sm">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 48 48"
                                            className="w-6 h-6 mr-2"
                                        >
                                            <path
                                                fill="#EA4335"
                                                d="M24 9.5c3.54 0 6.68 1.23 9.18 3.62l6.84-6.84C35.21 2.55 29.98 0 24 0 14.64 0 6.67 5.63 2.69 13.78l7.98 6.21C12.37 13.17 17.74 9.5 24 9.5z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M46.5 24c0-1.64-.15-3.23-.43-4.76H24v9.01h12.63c-.55 2.95-2.19 5.44-4.61 7.12l7.32 5.69C43.98 37.47 46.5 31.2 46.5 24z"
                                            />
                                            <path
                                                fill="#4A90E2"
                                                d="M9.23 28.24c-1.18-3.15-1.18-6.53 0-9.68L1.25 12.36c-3.01 6.02-3.01 13.26 0 19.28l7.98-6.21z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M24 46.5c6.52 0 12.02-2.16 16.01-5.86l-7.32-5.69c-2.01 1.35-4.59 2.11-8.69 2.11-6.26 0-11.63-3.67-13.33-8.49l-7.98 6.21C6.67 42.37 14.64 48 24 48z"
                                            />
                                        </svg>
                                        {/* Google icon */}
                                        Continue with Google
                                    </button>
                                </div>

                                <div className="relative flex items-center mb-6">
                                    <div className="w-full h-px bg-gray-200"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <span className="px-4 bg-white text-gray-600 font-medium">OR</span>
                                    </div>
                                </div>

                                {/* Inputs */}
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Name"
                                        className="w-full px-3 py-4 border border-gray-300 rounded-md"
                                    />
                                </div>
                                <div className="mb-4">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full px-3 py-4 border border-gray-300 rounded-md"
                                    />
                                </div>

                                {/* Age Select */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-semibold mb-4">How old are you? (Optional)</h3>
                                    <select className="w-full px-3 py-4 border border-gray-300 rounded-md">
                                        <option>Select an option</option>
                                        <option>18-24</option>
                                        <option>25-30</option>
                                        <option>31-40</option>
                                        <option>41-45</option>
                                        <option>46-50</option>
                                        <option>51-55</option>
                                        <option>56-60</option>
                                        <option>Over 60</option>
                                    </select>
                                </div>
                            </div>

                            {/* 🔄 External Form Component (No <form> inside!) */}
                            <div className="max-w-full mx-auto px-4 pt-8">
                                {/* Skin Concerns */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-1">What are your skin concerns? (Optional)</h3>
                                    <p className="text-gray-500 mb-4">Choose up to 5 options</p>

                                    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                                        {concernOptions.map((option) => {
                                            const isSelected = selectedConcerns.includes(option);
                                            return (
                                                <button
                                                    key={option}
                                                    type="button"
                                                    onClick={() => handleConcernToggle(option)}
                                                    className={`px-2 py-1 border rounded text-left transition duration-200 ease-in-out ${
                                                        isSelected
                                                            ? 'bg-green-900 text-white border-green-700 font-medium'
                                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {option}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Skin Type */}
                                <div className="mb-8">
                                    <h3 className="text-lg font-semibold mb-4">What is your skin type? (Optional)</h3>
                                    <select
                                        value={skinType}
                                        onChange={(e) => setSkinType(e.target.value)}
                                        className="w-full max-w-sm px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    >
                                        <option value="">Select an option</option>
                                        {skinTypeOptions.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Disclaimer */}
                                <div className="text-center mt-[5rem] text-gray-600">
                                    By continuing you agree to Devshop's{' '}
                                    <a href="#" className="underline text-blue-600">Terms and Conditions</a> and{' '}
                                    <a href="#" className="underline text-blue-600">Privacy Policy</a>.
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-green-900 text-white px-4 py-3 text-lg font-semibold rounded hover:bg-green-800 transition duration-300">
                                Agree & Submit
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
