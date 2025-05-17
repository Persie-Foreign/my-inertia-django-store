import React, { useEffect } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function ProductForm() {
    const { categories, errors: initialErrors, old } = usePage().props;

    // Initialize form state with old input (if any)
    const { data, setData, post, processing, errors, reset } = useForm({
        title:       old.title       || '',
        description: old.description || '',
        price:       old.price       || '',
        category:    old.category    || '',
        images:      [],
        csrfmiddlewaretoken: document.querySelector('meta[name="csrf-token"]').content,
    });

    // Merge server-provided errors on mount
    useEffect(() => {
        Object.entries(initialErrors).forEach(([field, errs]) => {
            // inertia’s errors state is an object { field: [ { message } ] }
            setData(field, data[field]); // trigger internal tracking
        });
    }, []);

    function handleSubmit(e) {
        e.preventDefault();
        post('/products/create/', {
            onSuccess: () => reset('title', 'description', 'price', 'category', 'images'),
        });
    }

    return (
        <>
            <Head title="Add Product" />
            <div style={{ maxWidth: 600, margin: '2rem auto' }}>
                <h1>Add New Product</h1>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <input
                        type="hidden"
                        name="csrfmiddlewaretoken"
                        value={data.csrfmiddlewaretoken}
                    />

                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            required
                        />
                        {errors.title && <p style={{ color: 'red' }}>{errors.title[0].message}</p>}
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            required
                        />
                        {errors.description && <p style={{ color: 'red' }}>{errors.description[0].message}</p>}
                    </div>

                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            step="0.01"
                            value={data.price}
                            onChange={e => setData('price', e.target.value)}
                            required
                        />
                        {errors.price && <p style={{ color: 'red' }}>{errors.price[0].message}</p>}
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            value={data.category}
                            onChange={e => setData('category', e.target.value)}
                            required
                        >
                            <option value="">Select a sub-category</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.label}</option>
                            ))}
                        </select>
                        {errors.category && <p style={{ color: 'red' }}>{errors.category[0].message}</p>}
                    </div>

                    <div>
                        <label>Images</label>
                        <input
                            type="file"
                            multiple
                            onChange={e => setData('images', [...e.target.files])}
                        />
                        {errors.images && <p style={{ color: 'red' }}>{errors.images[0].message}</p>}
                    </div>

                    <button type="submit" disabled={processing}>
                        {processing ? 'Saving…' : 'Save Product'}
                    </button>
                </form>
            </div>
        </>
    );
}

