// resources/js/Pages/ProductList.jsx

import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ProductList() {
    const { products = [] } = usePage().props;

    // 1) Read ?category= from the URL
    let filterCat = '';
    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        filterCat = params.get('category') || '';
    }

    // 2) If we have a filter, only keep those products whose sub-category name matches
    const filtered = filterCat
        ? products.filter(
            p =>
                p.category?.name?.toLowerCase() === filterCat.toLowerCase()
        )
        : products;

    // (Optional) show a message if nothing matched
    const noMatches = filterCat && filtered.length === 0;

    // 3) Group by parent → subcategory
    const grouped = filtered.reduce((acc, p) => {
        const parentName = p.category?.parent || 'Uncategorized';
        const subName    = p.category?.name   || 'Uncategorized';
        acc[parentName] = acc[parentName] || {};
        acc[parentName][subName] = acc[parentName][subName] || [];
        acc[parentName][subName].push(p);
        return acc;
    }, {});

    return (
        <>
            <Head title="Products" />

            {filterCat && (
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-2xl font-bold">
                        Showing category “{filterCat}”
                    </h1>
                    <Link
                        href="/products"
                        className="text-blue-500 hover:underline text-sm"
                    >
                        View all products
                    </Link>
                </div>
            )}

            {noMatches && (
                <p className="text-center text-gray-500 py-10">
                    No products found in “{filterCat}.”
                </p>
            )}

            {Object.entries(grouped).map(([parent, subs]) => (
                <section key={parent} className="max-w-7xl mx-auto px-4 py-8">
                    <h2 className="text-xl font-semibold mb-4">{parent}</h2>

                    {Object.entries(subs).map(([sub, items]) => (
                        <div key={sub} className="mb-8">
                            <h3 className="text-lg font-medium mb-2">{sub}</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {items.map(p => (
                                    <Link
                                        key={p.id}
                                        href={`/products/${p.slug}/`}
                                        className="block border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                                    >
                                        {p.images && p.images.length > 0 ? (
                                            <div className="flex space-x-2 overflow-x-auto p-2 bg-gray-50">
                                                {p.images.map((url,i) => (
                                                    <img
                                                        key={i}
                                                        src={url}
                                                        alt={`${p.title} #${i+1}`}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-gray-200" />
                                        )}
                                        <div className="p-4">
                                            <h4 className="font-semibold">{p.title}</h4>
                                            <p className="mt-1 font-bold">${p.price.toFixed(2)}</p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </section>
            ))}
        </>
    );
}
