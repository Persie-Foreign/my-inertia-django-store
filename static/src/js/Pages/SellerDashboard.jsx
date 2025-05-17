import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function SellerDashboard() {
    const { products } = usePage().props;
    return (
        <>
            <Head title="My Products" />
            <div style={{ maxWidth:800, margin:'2rem auto' }}>
                <h1>My Products</h1>
                <Link href="/products/create/">+ Add New</Link>
                <table style={{ width:'100%', marginTop:'1rem',borderCollapse:'collapse' }}>
                    <thead>
                    <tr>
                        <th>Image</th><th>Title</th><th>Category</th><th>Price</th><th>Active</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map(p => (
                        <tr key={p.id}>
                            <td>{p.image_url ? <img src={p.image_url} style={{width:50}}/>:'−'}</td>
                            <td><Link href={`/products/${p.slug}/`}>{p.title}</Link></td>
                            <td>{p.category.parent} → {p.category.name}</td>
                            <td>${p.price}</td>
                            <td>{p.is_active ? 'Yes':'No'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}


