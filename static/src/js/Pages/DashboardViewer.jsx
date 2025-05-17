import React from 'react';
import { Head } from '@inertiajs/react';

export default function DashboardViewer({ auth }) {
    return (
        <>
            <Head title="Viewer Dashboard" />
            <h1>Welcome, {auth.user.username}</h1>
            <p>You’re a Viewer—browse and buy products here.</p>
        </>
    );
}
