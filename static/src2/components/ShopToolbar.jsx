// ShopToolbar.jsx
import React from 'react';

const ShopToolbar = () => {
    return (
        <div className=" border-b-2 border-gray-300 py-2.5 flex items-center justify-between bg-white w-full z-40">
            {/* View options */}
            <div className="flex items-center ml-6 border-r-2 border-gray-300">
                <button className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2v-4a1 1 0 011-1h2V5H5v5z" />
                    </svg>
                </button>
                <button className="mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 3a2 2 0 00-2 2v4a2 2 0 002 2h2v4a2 2 0 002 2h4a2 2 0 002-2v-4a2 2 0 00-2-2H9V5a2 2 0 00-2-2H5zm0 2h4v12h-4V5z" />
                    </svg>
                </button>
                <button>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2h14a1 1 0 100-2H3zm11.586 5.586a1 1 0 10-1.414-1.414l3-3a1 1 0 00-1.414-1.414l-3 3a1 1 0 001.414 1.414zM5 11a1 1 0 100 2h2a1 1 0 100-2H5z" clipRule="evenodd" />
                    </svg>
                </button>
            </div>

            {/* Sort and Filter options */}
            <div className="flex items-center mr-6">
                <div className="flex items-center mr-6">
                    <span className="text-gray-600 mr-2 border-l-2 border-gray-300 pl-4">Sort by</span>
                </div>
                <button className="text-gray-600 hover:text-gray-800 border-l-2 border-gray-300 pl-4 mx-4">
                    Filter
                </button>
            </div>
        </div>
    );
};

export default ShopToolbar;
