import React, { useRef, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function ReviewSubmissionPage({ product }) {
    const fileInputRef = useRef(null);

    // State variables
    const [reviewTitle, setReviewTitle] = useState('');
    const [reviewDescription, setReviewDescription] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [skinType, setSkinType] = useState('');
    const [selectedConcerns, setSelectedConcerns] = useState([]);

    const [hoveredStar, setHoveredStar] = useState(0);
    const [selectedStar, setSelectedStar] = useState(0);

    const { data, setData, post, reset } = useForm({
        reviewTitle: '',
        reviewDescription: '',
        name: '',
        email: '',
        age: '',
        skinType: '',
        rating: 0,
        concerns: [],
        media: []
    });

    const concernOptions = [
        'Acne', 'Ageing', 'Pigmentation', 'Redness', 'Sensitivity',
        'Scarring', 'Blackheads', 'Dryness', 'Oiliness', 'Large Pores',
        'Wrinkles', 'Sun Damage', 'Irritation', 'Texture',
    ];

    const skinTypeOptions = [
        'Normal', 'Super Dry', 'Dry', 'Oily', 'Combination',
    ];

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const [mediaFiles, setMediaFiles] = useState([]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'image',
            file,
        }));
        setMediaFiles((prev) => [...prev, ...previews]);
        setData('media', [...data.media, ...files]);
    };

    const handleRemove = (urlToRemove) => {
        setMediaFiles((prev) => prev.filter((file) => file.url !== urlToRemove));
    };

    const handleConcernToggle = (concern) => {
        let updatedConcerns = [...selectedConcerns];
        if (updatedConcerns.includes(concern)) {
            updatedConcerns = updatedConcerns.filter(c => c !== concern);
        } else if (updatedConcerns.length < 5) {
            updatedConcerns.push(concern);
        }
        setSelectedConcerns(updatedConcerns);
        setData('concerns', updatedConcerns);
    };

    const image = product.image || (product.images && product.images.length > 0 ? product.images[0] : null);
    console.log('product:', product);
    console.log('image:', image);

    const title = product.title || product.name || '';

    // Utility to grab the CSRF token cookie
    function getCookie(name) {
        const match = document.cookie.match(
            new RegExp('(^| )' + name + '=([^;]+)')
        );
        return match ? match[2] : '';
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('reviewTitle', reviewTitle);
        formData.append('reviewDescription', reviewDescription);
        formData.append('name', name);
        formData.append('email', email);
        formData.append('age', age);
        formData.append('skinType', skinType);
        formData.append('rating', selectedStar);
        formData.append('concerns', JSON.stringify(selectedConcerns));

        // Append media Files
        mediaFiles.forEach((m) => formData.append('media', m.file));

        try {
            const response = await fetch(
                `/api/products/${product.id}/submit-review/`,
                {
                    method: 'POST',
                    credentials: 'include',              // send cookies
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken')
                    },
                    body: formData,
                }
            );
            if (response.ok) {
                // redirect to the thank-you page
                window.location.href = `/products/${product.id}/review/thanks/`;
            } else {
                console.error('Failed to submit review', await response.text());
            }
        } catch (err) {
            console.error('Error submitting review:', err);
        }
    };



    return (
        <div className="bg-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-4 border-x border-gray-300 bg-white">
                <header className="border-b border-gray-200 py-4">
                    <Link href="/" className="text-center text-4xl font-bold">DevShop</Link>
                </header>

                <main className="py-8">
                    <div className="max-w-2xl mx-auto">
                        <div className="flex items-start mb-6">
                            <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center mr-6">
                                {image && (
                                    <img src={image} alt={product.title} className="max-h-full object-contain" />
                                )}
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
                                                className="text-gray-300"
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

                        <form className="space-y-6" onSubmit={handleSubmit}>
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
                                    value={reviewDescription}
                                    onChange={(e) => setReviewDescription(e.target.value)}
                                    className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 h-64"
                                />
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

                            {/* Age Select */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold mb-4">How old are you? (Optional)</h3>
                                <select className="w-3/5 px-3 py-4 border border-gray-300 rounded-md">
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

                            {/* Concerns */}
                            <div className="mb-8 mt-10">
                                <h3 className="text-lg font-semibold mb-1">What are your skin concerns? (Optional)</h3>
                                <p className="text-gray-700 mb-4">Choose up to 5 options</p>

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
                            <div>
                                <h3 className="text-lg font-semibold mb-2">What is your skin type? (Optional)</h3>
                                <select
                                    value={skinType}
                                    onChange={(e) => setSkinType(e.target.value)}
                                    className="w-3/5 px-3 py-3 border border-gray-300 rounded-md"
                                >
                                    <option value="">Select an option</option>
                                    {skinTypeOptions.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-sm text-center text-gray-500 mt-6">
                                By continuing, you agree to our{" "}
                                <a href="#" className="text-blue-600 underline">Terms and Conditions</a> and{" "}
                                <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-4 bg-green-900 text-white px-4 py-3 text-lg font-semibold rounded hover:bg-green-800"
                            >
                                Agree & Submit
                            </button>
                        </form>
                    </div>
                </main>
            </div>
        </div>
    );
}
