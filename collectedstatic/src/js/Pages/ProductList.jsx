import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ProductList() {
    const { products } = usePage().props;
    const grouped = products.reduce((acc, p) => {
        const par = p.category.parent.name;
        const sub = p.category.name;
        acc[par] = acc[par] || {};
        acc[par][sub] = acc[par][sub] || [];
        acc[par][sub].push(p);
        return acc;
    }, {});
    return (
        <>
            <Head title="Products" />
            {Object.entries(grouped).map(([par, subs]) => (
                <section key={par}>
                    <h2>{par}</h2>
                    {Object.entries(subs).map(([sub, items]) => (
                        <div key={sub}>
                            <h3>{sub}</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                {items.map(p => (
                                    <Link key={p.id} href={`/products/${p.slug}/`} style={{ width: '200px' }}>
                                        <div style={{ border: '1px solid #ddd', padding: '0.5rem' }}>
                                            {p.images[0]
                                                ? <img src={p.images[0]} alt={p.title} style={{ width: '100%' }} />
                                                : <div style={{ width:'100%',height:100,background:'#eee' }} />}
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
