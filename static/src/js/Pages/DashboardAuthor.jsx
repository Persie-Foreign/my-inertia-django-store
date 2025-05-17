import React from 'react';
import { Head } from '@inertiajs/react';

export default function DashboardAuthor({ auth }) {
    return (
        <>
            <Head title="Author Dashboard" />
            <h1>Welcome, {auth.user.username}</h1>
            <p>You’re an Author—create and manage products here.</p>
        </>
    );
}
