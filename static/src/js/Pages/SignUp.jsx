import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function SignUp() {
    const { data, setData, post, processing, errors, reset } = useForm({
        username: '',
        email: '',
        password1: '',
        password2: '',
        role: 'viewer',
        csrfmiddlewaretoken: '',
    });

    // grab CSRF on mount
    useEffect(() => {
        const token = document.querySelector('meta[name="csrf-token"]').content;
        setData('csrfmiddlewaretoken', token);
    }, []);

    const submit = e => {
        e.preventDefault();
        post('/accounts/signup/', {
            onSuccess: () => reset('password1','password2'),
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="Sign Up" />
            <h1>Sign Up</h1>
            <form onSubmit={submit}>
                <input type="hidden" name="csrfmiddlewaretoken" value={data.csrfmiddlewaretoken} />

                <div>
                    <label>Username</label>
                    <input
                        name="username"
                        value={data.username}
                        onChange={e => setData('username', e.target.value)}
                        required
                    />
                    {errors.username && <small>{errors.username}</small>}
                </div>

                <div>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        value={data.email}
                        onChange={e => setData('email', e.target.value)}
                        required
                    />
                    {errors.email && <small>{errors.email}</small>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        name="password1"
                        type="password"
                        value={data.password1}
                        onChange={e => setData('password1', e.target.value)}
                        required
                    />
                    {errors.password1 && <small>{errors.password1}</small>}
                </div>

                <div>
                    <label>Confirm Password</label>
                    <input
                        name="password2"
                        type="password"
                        value={data.password2}
                        onChange={e => setData('password2', e.target.value)}
                        required
                    />
                    {errors.password2 && <small>{errors.password2}</small>}
                </div>

                <div>
                    <label>Role</label>
                    <select
                        name="role"
                        value={data.role}
                        onChange={e => setData('role', e.target.value)}
                    >
                        <option value="viewer">Viewer</option>
                        <option value="author">Author</option>
                    </select>
                    {errors.role && <small>{errors.role}</small>}
                </div>

                <button disabled={processing}>{processing ? 'Signing up…' : 'Sign Up'}</button>
                {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
            </form>
            <p>
                Already have an account? <Link href="/accounts/login/">Log in</Link>
            </p>
        </>
    );
}
