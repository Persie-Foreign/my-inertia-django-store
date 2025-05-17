import React, { useEffect } from 'react';

const ContactInfoModal = ({ isOpen, onClose }) => {
    // Lock/unlock scroll when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/25 bg-opacity-20 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-4">Contact information</h2>

                <div className="space-y-2">
                    <p className="text-lg">Trade Name: DevShop</p>
                    <p className="text-lg">Phone Number: +82-2-412-3371</p>
                    <p className="text-lg">
                        Email: <a href="mailto:help@devshop.com" className="text-blue-600 hover:text-blue-800">help@devshop.com</a>
                    </p>
                    <p className="text-lg">
                        Address: 8F, 10F, Parnas Tower, 521, Teheran-ro, Gangnam-gu, Seoul, Republic of Korea
                    </p>
                    <p className="text-lg">VAT Number: 814-86-00820</p>
                </div>
            </div>
        </div>
    );
};

export default ContactInfoModal;
