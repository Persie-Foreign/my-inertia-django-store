import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function ProductDetail() {
    const { product } = usePage().props;

    return (
        <>
            <Head title={product.title} />
            <div style={{ maxWidth: 800, margin: '2rem auto' }}>
                <Link href="/products/">← Back to Products</Link>
                <h1>{product.title}</h1>

                {product.images && product.images.length > 0 && (
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', margin: '1rem 0' }}>
                        {product.images.map((url, i) => (
                            <img
                                key={i}
                                src={url}
                                alt={`${product.title} #${i+1}`}
                                style={{ height: '200px', objectFit: 'contain' }}
                            />
                        ))}
                    </div>
                )}

                <p>{product.description}</p>
                <p><strong>${product.price}</strong></p>
                <p>
                    Category: {product.category.parent} → {product.category.name}
                </p>
                <p>Seller: {product.seller}</p>

                <section style={{ marginTop: '2rem' }}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && <p>No reviews yet.</p>}
                    {product.reviews.map(r => (
                        <div key={r.id} style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                            <strong>{r.user}</strong> <em>on {new Date(r.created).toLocaleString()}</em>
                            <p>{r.comment}</p>
                        </div>
                    ))}

                    {product.can_review ? (
                        <form method="post" action={`/products/${product.slug}/review/`} style={{ marginTop: '1rem' }}>
                            <textarea name="comment" rows="3" required placeholder="Write your review…" style={{ width: '100%' }} />
                            <button type="submit" style={{ marginTop: '0.5rem' }}>Submit Review</button>
                        </form>
                    ) : (
                        <p><Link href="/accounts/login/">Log in</Link> to leave a review.</p>
                    )}
                </section>
            </div>
        </>
    );
}

