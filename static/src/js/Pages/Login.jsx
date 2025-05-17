import React, { useEffect } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        login: '',
        password: '',
        remember: false,
        csrfmiddlewaretoken: '',
    });

    useEffect(() => {
        setData('csrfmiddlewaretoken', document.querySelector('meta[name="csrf-token"]').content);
    }, []);

    const submit = e => {
        e.preventDefault();
        post('/accounts/login/', { preserveScroll: true });
    };

    return (
        <>
            <Head title="Login" />
            <h1>Login</h1>
            <form onSubmit={submit}>
                <input type="hidden" name="csrfmiddlewaretoken" value={data.csrfmiddlewaretoken} />

                <div>
                    <label>Username or Email</label>
                    <input
                        name="login"
                        value={data.login}
                        onChange={e => setData('login', e.target.value)}
                        required
                    />
                    {errors.login && <small>{errors.login}</small>}
                </div>

                <div>
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        value={data.password}
                        onChange={e => setData('password', e.target.value)}
                        required
                    />
                    {errors.password && <small>{errors.password}</small>}
                </div>

                <div>
                    <label>
                        <input
                            name="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={e => setData('remember', e.target.checked)}
                        />
                        Remember me
                    </label>
                </div>

                <button disabled={processing}>{processing ? 'Logging in…' : 'Login'}</button>
                {errors.non_field_errors && <p>{errors.non_field_errors}</p>}
            </form>
            <p>
                No account? <Link href="/accounts/signup/">Sign up</Link>
            </p>
        </>
    );
}
