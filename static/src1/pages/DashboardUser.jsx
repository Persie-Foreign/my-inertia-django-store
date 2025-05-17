import React, { useState } from 'react'

export default function DashboardUser() {
    const [activeTab, setActiveTab] = useState('orders');

    const renderContent = () => {
        switch (activeTab) {
case 'orders':
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
            <div className="space-y-4">
                {[1, 2, 3].map((order) => (
                    <div
                        key={order}
                        className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition"
                    >
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Order ID:</p>
                                <p className="font-semibold text-gray-800">#ORD12345</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date:</p>
                                <p className="text-gray-700">May 10, 2025</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Items:</p>
                                <p className="text-gray-700">2 products</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total:</p>
                                <p className="text-gray-800 font-medium">$89.98</p>
                            </div>
                            <div>
                                <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700">
                                    Delivered
                                </span>
                            </div>
                            <div className="flex gap-2">
                                <button className="text-sm text-blue-600 hover:underline">View</button>
                                <button className="text-sm text-gray-600 hover:underline">Track</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

case 'saved':
    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Saved Items</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4].map((item) => (
                    <div
                        key={item}
                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition"
                    >
                        <img
                            src="/images/sample-product.jpg"
                            alt="Product"
                            className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-4 space-y-2">
                            <h3 className="text-md font-medium text-gray-800">
                                Product Name #{item}
                            </h3>
                            <p className="text-sm text-gray-500">Category: Electronics</p>
                            <p className="text-lg font-semibold text-black">$99.99</p>
                            <div className="flex justify-between items-center pt-2">
                                <button className="text-sm text-white bg-black px-4 py-1 rounded hover:bg-gray-800">
                                    Add to Cart
                                </button>
                                <button className="text-sm text-red-500 hover:underline">
                                    Remove
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

case 'account':
    return (
        <div className="bg-white p-6 rounded-md shadow-md max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Account Settings</h2>
            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                        type="email"
                        placeholder="john@example.com"
                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    />
                </div>
                <div className="pt-2">
                    <button
                        type="submit"
                        className="bg-black hover:bg-gray-800 text-white px-6 py-2 rounded transition duration-200"
                    >
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );

case 'support':
    return (
        <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Support Tickets</h2>
            <ul className="space-y-4">
                {[
                    { id: '#34567', issue: 'Late Delivery', status: 'Resolved' },
                    { id: '#34568', issue: 'Wrong Item', status: 'In Progress' },
                ].map((ticket, index) => (
                    <li
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center"
                    >
                        <div>
                            <p className="text-base font-medium text-gray-800">{ticket.id} - {ticket.issue}</p>
                            <p className="text-sm text-gray-500 mt-1">Submitted on 2025-05-10</p>
                        </div>
                        <span
                            className={`text-sm font-semibold px-3 py-1 rounded-full ${
                                ticket.status === 'Resolved'
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                            }`}
                        >
                            {ticket.status}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex mt-50">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md p-6 space-y-6">
                <h1 className="text-2xl font-bold mb-4">Buyer Dashboard</h1>
                <ul className="space-y-2">
                    <li>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'orders' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                        >
                            My Orders
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'saved' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                        >
                            Saved Items
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'account' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                        >
                            Account Settings
                        </button>
                    </li>
                    <li>
                        <button
                            onClick={() => setActiveTab('support')}
                            className={`w-full text-left px-4 py-2 rounded ${activeTab === 'support' ? 'bg-black text-white' : 'hover:bg-gray-200'}`}
                        >
                            Support Tickets
                        </button>
                    </li>
                    <li>
                        <button className="w-full text-left px-4 py-2 rounded hover:bg-red-100 text-red-500">
                            Logout
                        </button>
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-8 overflow-y-auto">{renderContent()}</div>
        </div>
    );
}
