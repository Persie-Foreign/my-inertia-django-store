import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';


export default function ProductList() {
    const { products } = usePage().props;

    const grouped = products.reduce((acc, p) => {
        const parentName = p.category.parent || 'Uncategorized';
        const subName    = p.category.name;
        if (!acc[parentName]) acc[parentName] = {};
        if (!acc[parentName][subName]) acc[parentName][subName] = [];
        acc[parentName][subName].push(p);
        return acc;
    }, {});

    return (
        <>
            <Head title="Products" />
            {Object.entries(grouped).map(([parent, subs]) => (
                <section key={parent}>
                    <h2>{parent}</h2>
                    {Object.entries(subs).map(([sub, items]) => (
                        <div key={sub}>
                            <h3>{sub}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {items.map(p => (
                                    <Link key={p.id} href={`/products/${p.slug}/`} style={{ width: '200px' }}>
                                        <div style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {p.images && p.images.length > 0 ? (
                                                <div style={{ display: 'flex', overflowX: 'auto', gap: 4 }}>
                                                    {p.images.map((url, i) => (
                                                        <img
                                                            key={i}
                                                            src={url}
                                                            alt={`${p.title} #${i+1}`}
                                                            style={{ width: 60, height: 60, objectFit: 'cover' }}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                <div style={{ width: '100%', height: 100, background: '#eee' }} />
                                            )}
                                            <h4>{p.title}</h4>
                                            <p><strong>${p.price}</strong></p>
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

