import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Layout({ children }) {
    const { auth } = usePage().props;   // injected by our middleware

    // 1) Not logged in
    if (!auth.user) {
        return (
            <>
                <nav className="bg-blue-600 text-white p-4 flex justify-between">
                    <div className="space-x-4">
                        <Link href="/" className="font-bold hover:underline">Home</Link>
                        <Link href="/products" className="hover:underline">Products</Link>
                    </div>
                    <div className="space-x-4">
                        <a href="/accounts/login/"    className="hover:underline">Login</a>
                        <a href="/accounts/signup/"   className="hover:underline">Sign Up</a>
                    </div>
                </nav>
                <main className="p-6 bg-gray-50">{children}</main>
            </>
        );
    }

    // 2) Email not verified
    if (!auth.user.email_verified) {
        return (
            <>
                <nav className="bg-orange-600 text-white p-4 flex justify-between">
                    <div>
                        <Link href="/" className="font-bold hover:underline">Home</Link>
                    </div>
                    <div className="space-x-4">
                        <span>Hi, {auth.user.username}</span>
                        <a href="/accounts/confirm-email/" className="hover:underline">
                            Confirm Email
                        </a>
                        <form method="post" action="/accounts/logout/" className="inline">
                            <button type="submit" className="hover:underline">Logout</button>
                        </form>
                    </div>
                </nav>
                <main className="p-6 bg-gray-50">{children}</main>
            </>
        );
    }

    // 3) Verified but pending admin approval
    if (!auth.user.is_active) {
        return (
            <>
                <nav className="bg-yellow-600 text-white p-4 flex justify-between">
                    <div>
                        <Link href="/" className="font-bold hover:underline">Home</Link>
                    </div>
                    <div className="space-x-4">
                        <span>Hi, {auth.user.username}</span>
                        <Link href="/accounts/pending/" data-inertia="false" className="hover:underline">
                            Pending Approval
                        </Link>
                        <form method="post" action="/accounts/logout/" className="inline">
                            <button type="submit" className="hover:underline">Logout</button>
                        </form>
                    </div>
                </nav>
                <main className="p-6 bg-gray-50">{children}</main>
            </>
        );
    }

    // 4) Fully active user
    return (
        <>
            <nav className="bg-green-600 text-white p-4 flex justify-between">
                <div className="space-x-4">
                    <Link href="/" className="font-bold hover:underline">Home</Link>
                    <Link href="/products" className="hover:underline">Products</Link>
                    <Link href="/products/create" className="hover:underline">Sell Product</Link>
                    <Link href="/products/dashboard" className="hover:underline">My Dashboard</Link>
                </div>
                <div className="space-x-4">
                    <span>Hi, {auth.user.username}</span>
                    <form method="post" action="/accounts/logout/" className="inline">
                        <button type="submit" className="hover:underline">Logout</button>
                    </form>
                </div>
            </nav>
            <main className="p-6 bg-gray-50">{children}</main>
        </>
    );
}
