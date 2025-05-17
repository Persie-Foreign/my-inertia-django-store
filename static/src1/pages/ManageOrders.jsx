import React from "react";

export default function ManageOrders() {
    const orders = [
        { id: "#00123", customer: "John Doe", status: "Delivered", total: "$150", date: "2025-05-10" },
        { id: "#00124", customer: "Jane Smith", status: "Processing", total: "$99", date: "2025-05-11" },
        { id: "#00125", customer: "Mike Johnson", status: "Cancelled", total: "$75", date: "2025-05-09" },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-green-100 text-green-700";
            case "Processing":
                return "bg-yellow-100 text-yellow-700";
            case "Cancelled":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="bg-white shadow-md rounded p-6 overflow-x-auto mt-50">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">Manage Orders</h2>
                <input
                    type="text"
                    placeholder="Search by Order ID or Customer"
                    className="border px-3 py-1 rounded w-64 text-sm"
                />
            </div>

            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 border-b text-gray-600">
                    <tr>
                        <th className="py-2 px-4">Order ID</th>
                        <th className="py-2 px-4">Customer</th>
                        <th className="py-2 px-4">Date</th>
                        <th className="py-2 px-4">Total</th>
                        <th className="py-2 px-4">Status</th>
                        <th className="py-2 px-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{order.id}</td>
                            <td className="py-2 px-4">{order.customer}</td>
                            <td className="py-2 px-4">{order.date}</td>
                            <td className="py-2 px-4">{order.total}</td>
                            <td className="py-2 px-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusClass(order.status)}`}>
                                    {order.status}
                                </span>
                            </td>
                            <td className="py-2 px-4">
                                <button className="text-blue-600 hover:underline text-sm">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination (UI only) */}
            <div className="mt-4 flex justify-end space-x-2 text-sm text-gray-600">
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Prev</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">1</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-100">Next</button>
            </div>
        </div>
    );
}
