import React, { useState } from 'react';

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('overview');

    const orders = [
        { id: "#00123", customer: "John Doe", status: "Delivered", total: "$150" },
        { id: "#00124", customer: "Jane Smith", status: "Processing", total: "$99" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card title="Total Orders" value="124" />
                            <Card title="Products" value="57" />
                            <Card title="Pending Deliveries" value="16" />
                        </div>

                        <Section title="Recent Orders">
                            <OrderTable orders={orders} />
                        </Section>

                        <Section title="Product Management">
                            <p className="text-gray-600">Add, update or remove products from your shop.</p>
                            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Add Product</button>
                        </Section>

                        <Section title="Filter Settings">
                            <p className="text-gray-600">Configure categories, price ranges, and more for filtering.</p>
                            <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Update Filters</button>
                        </Section>
                    </>
                );

            case 'orders':
                return (
                    <Section title="Manage Orders">
                        <OrderTable orders={orders} />
                    </Section>
                );

            case 'products':
                return (
                    <Section title="Manage Products">
                        <p className="text-gray-600">Here you can manage your products.</p>
                    </Section>
                );

            case 'filters':
                return (
                    <Section title="Filter Settings">
                        <p className="text-gray-600">Manage filter criteria such as categories and price ranges.</p>
                    </Section>
                );

            default:
                return <p>Section not found.</p>;
        }
    };

    return (
        <div className="min-h-screen flex bg-gray-100 mt-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md h-screen sticky top-0 hidden md:block">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-gray-800">DevShop Dashboard</h1>
                </div>
                <nav className="p-6 space-y-4 text-gray-700">
                    <SidebarLink label="Overview" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                    <SidebarLink label="Manage Orders" active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} />
                    <SidebarLink label="Manage Products" active={activeTab === 'products'} onClick={() => setActiveTab('products')} />
                    <SidebarLink label="Filter Settings" active={activeTab === 'filters'} onClick={() => setActiveTab('filters')} />
                </nav>
            </aside>

            {/* Main Panel */}
            <main className="flex-1 p-6 overflow-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 capitalize">{activeTab.replace('-', ' ')}</h2>
                    <button className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">Logout</button>
                </div>
                {renderContent()}
            </main>
        </div>
    );
}

/* --- Reusable Components --- */

function SidebarLink({ label, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`block w-full text-left px-2 py-1 rounded hover:text-black ${active ? 'font-semibold text-black' : ''}`}
        >
            {label}
        </button>
    );
}

function Card({ title, value }) {
    return (
        <div className="bg-white p-4 shadow rounded">
            <h4 className="text-gray-500 text-sm">{title}</h4>
            <p className="text-xl font-bold">{value}</p>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <div className="bg-white p-4 shadow rounded mb-6">
            <h3 className="text-lg font-semibold mb-2">{title}</h3>
            {children}
        </div>
    );
}

function OrderTable({ orders }) {
    return (
        <div className="overflow-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b text-gray-600">
                        <th className="py-2">Order ID</th>
                        <th className="py-2">Customer</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="py-2">{order.id}</td>
                            <td className="py-2">{order.customer}</td>
                            <td className={`py-2 ${order.status === 'Delivered' ? 'text-green-600' : 'text-yellow-600'}`}>{order.status}</td>
                            <td className="py-2">{order.total}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
