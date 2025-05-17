import React, {useEffect} from 'react';

const TermsOfServiceModal = ({ isOpen, onClose }) => {

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

                <h2 className="text-2xl font-bold mb-6">Terms of Service</h2>

                <div className="overflow-y-auto max-h-[55vh] pb-4">
                    <p className="mb-4">
                        OVERVIEW
                    </p>
                    <p className="mb-4">
                        This website is operated by ANUA INC. Throughout the site, the terms "we", "us" and "our" refer to ANUA INC. ANUA INC. offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.
                    </p>
                    <p className="mb-4">
                        By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions ("Terms of Service", "Terms"), including those additional terms and conditions and policies referenced herein and available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/or contributors of content.
                    </p>
                    <p className="mb-4">
                        Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.
                    </p>
                    <p className="mb-4">
                        Any new features or tools which are added to the current store shall also be subject to the Terms of Service. You can review the most current version of the Terms of Service at any time on this page. We reserve the right to update, change or replace any part of these Terms of Service by posting updates and changes to our website. It is your responsibility to check this page periodically for changes. Your continued use of or access to the website following the posting of any changes constitutes acceptance of those changes.
                    </p>
                    <p className="mb-4">
                        Our store is hosted on Shopify Inc. They provide us with the online e-commerce platform that allows us to sell our products and services to you.
                    </p>

                    {/* Add more sections of the terms of service here */}
                    {/* Make sure to include all the sections from your actual terms of service */}

                    <p className="mb-4">
                        SECTION 1 - ONLINE STORE TERMS
                    </p>
                    <p className="mb-4">
                        By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.
                    </p>
                    <p className="mb-4">
                        You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).
                    </p>
                    <p className="mb-4">
                        You must not transmit any worms or viruses or any code of a destructive nature.
                    </p>
                    <p className="mb-4">
                        A breach or violation of any of the Terms will result in an immediate termination of your Services.
                    </p>

                    <p className="mb-4">
                        SECTION 2 -  CONTACT INFORMATION
                    </p>
                    <p className="mb-4">
                        Questions about the Terms of Service should be sent to us at help@devshop.com
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServiceModal;