import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ProductDetail() {
    const { product } = usePage().props;
    return (
        <>
            <Head title={product.title} />
            <div style={{ maxWidth:800, margin:'2rem auto' }}>
                <Link href="/products/">← Back</Link>
                <h1>{product.title}</h1>
                <div style={{ display:'flex', gap:'1rem', overflowX:'auto' }}>
                    {product.images.map((url,i) => (
                        <img key={i} src={url} alt={`${product.title} ${i+1}`} style={{ maxHeight:300 }} />
                    ))}
                </div>
                <p>{product.description}</p>
                <p><strong>${product.price}</strong></p>
                <p>Category: {product.category.parent.name} → {product.category.name}</p>
                <p>Seller: {product.seller.username}</p>
            </div>
        </>
    );
}
