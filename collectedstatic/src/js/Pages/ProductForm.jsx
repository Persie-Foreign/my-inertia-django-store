import React, { useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ProductForm() {
    const { form, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        price: '',
        category: '',
        images: [],
        csrfmiddlewaretoken: '',
    });

    useEffect(() => {
        setData('csrfmiddlewaretoken', document.querySelector('meta[name="csrf-token"]').content);
    }, []);

    const submit = e => {
        e.preventDefault();
        post('/products/create/', {
            onSuccess: () => reset('title','description','price','category','images'),
        });
    };

    return (
        <>
            <Head title="Add Product" />
            <form onSubmit={submit} encType="multipart/form-data" style={{ maxWidth:600,margin:'2rem auto' }}>
                <input type="hidden" name="csrfmiddlewaretoken" value={form.csrfmiddlewaretoken} />

                <div>
                    <label>Title</label>
                    <input type="text" value={form.title} onChange={e => setData('title', e.target.value)} required />
                    {errors.title && <p style={{color:'red'}}>{errors.title[0].message}</p>}
                </div>

                <div>
                    <label>Description</label>
                    <textarea rows="4" value={form.description} onChange={e => setData('description', e.target.value)} required/>
                    {errors.description && <p style={{color:'red'}}>{errors.description[0].message}</p>}
                </div>

                <div>
                    <label>Price</label>
                    <input type="number" step="0.01" value={form.price} onChange={e => setData('price', e.target.value)} required />
                    {errors.price && <p style={{color:'red'}}>{errors.price[0].message}</p>}
                </div>

                <div>
                    <label>Category</label>
                    <select value={form.category} onChange={e => setData('category', e.target.value)} required>
                        <option value="">Select</option>
                        {usePage().props.categories.map(c => (
                            <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                    </select>
                    {errors.category && <p style={{color:'red'}}>{errors.category[0].message}</p>}
                </div>

                <div>
                    <label>Images</label>
                    <input
                        type="file"
                        multiple
                        onChange={e => setData('images', [...e.target.files])}
                    />
                    {errors.images && <p style={{color:'red'}}>{errors.images[0].message}</p>}
                </div>

                <button disabled={processing}>{processing ? 'Saving…' : 'Save Product'}</button>
            </form>
        </>
    );
}
