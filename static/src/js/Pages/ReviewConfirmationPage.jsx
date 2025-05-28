import React, {useEffect, useRef, useState} from 'react';
import {Link, useForm, usePage} from "@inertiajs/react";

export default function ReviewConfirmationPage() {

    const { product } = usePage().props;

    const fileInputRef = useRef(null);
    const handleClick = () => {
        fileInputRef.current.click();
    };

    const [mediaFiles, setMediaFiles] = useState([]);
    const [isUploading, setIsUploading] = useState(false);
    const [photoStepActive, setPhotoStepActive] = useState(false);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);

        const previews = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('video') ? 'video' : 'image',
            file,
        }));

        setTimeout(() => {
            setMediaFiles((prev) => [...prev, ...previews]);
            setIsUploading(false);
            setPhotoStepActive(true);
        }, 1000);
    };

    useEffect(() => {
        setPhotoStepActive(mediaFiles.length > 0);
    }, [mediaFiles]);

    const handleRemove = (urlToRemove) => {
        setMediaFiles((prev) => prev.filter((file) => file.url !== urlToRemove));
    };


    return (
        <div className="bg-gray-800 min-h-screen">
            <div className="max-w-3xl mx-auto px-4 py-4 border-x border-gray-300 bg-white">
                {/* Header */}
                <header className="flex justify-center items-center border-b border-gray-200 py-4">
                    <Link href="/" className="text-4xl font-bold">DevShop</Link>
                </header>

                {/* Main Content */}
                <main className="py-10">
                    {/* Confirmation Message */}
                    <div className="flex flex-col items-center justify-center mb-8">
                        <div className="mb-4 text-4xl">🎉</div>
                        <div>
                            <h2 className="text-xl text-center font-semibold mb-2">Review Submitted!</h2>
                            <p className="text-gray-600">Thanks for sharing your feedback with us!</p>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <nav className="relative">
                        <div className="absolute top-5 left-0 right-0 h-px bg-gray-200" />
                        <ul className="relative flex justify-between">
                            {[
                                { label: 'Write Review', active: true },
                                { label: 'Add Photo or Video', active: photoStepActive },
                                { label: 'Add Profile Picture', active: false },
                            ].map(({ label, active }, i) => (
                                <li key={i} className="relative z-10 flex flex-col items-center">
                                    <div
                                        className={`
                                            h-10 w-10 flex items-center justify-center rounded-full border-2
                                            ${active ? 'border-green-600 bg-green-50' : 'border-gray-300 bg-white'}
                                            ${i === 1 && isUploading ? 'animate-spin-slow' : ''}
                                        `}
                                    >
                                        {i === 0 ? (
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-5 w-5 ${active ? 'text-green-600' : 'text-gray-400'}`}
                                                fill={active ? 'currentColor' : 'none'}
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674a1 1 0 00.95.69h4.905c.969 0 1.371 1.24.588 1.81l-3.974 2.89a1 1 0 00-.364 1.118l1.518 4.674c.3.921-.755 1.688-1.54 1.118l-3.974-2.89a1 1 0 00-1.176 0l-3.974 2.89c-.785.57-1.84-.197-1.54-1.118l1.518-4.674a1 1 0 00-.364-1.118l-3.974-2.89c-.783-.57-.38-1.81.588-1.81h4.905a1 1 0 00.95-.69l1.518-4.674z"
                                                />
                                            </svg>
                                        ) : i === 1 ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7h18M3 12h18M3 17h18" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${active ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle cx="12" cy="7" r="4" strokeWidth="2" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={`mt-2 text-xs ${active ? 'text-green-600' : 'text-gray-500'}`}>
                                        {label}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Photos and Videos Section */}
                    <div className="mt-8 px-8">
                        <h2 className="text-xl font-semibold mb-4">Photos and Videos</h2>
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
                    </div>

                    <Link href={`/products/${product.id}/review-updated/`}>
                        <button className="w-full mt-10 bg-green-900 text-white px-4 py-3 text-lg font-semibold rounded hover:bg-green-800">
                            {photoStepActive ? 'Update Review' : 'Skip'}
                        </button>
                    </Link>
                </main>
            </div>
        </div>
    );
}
