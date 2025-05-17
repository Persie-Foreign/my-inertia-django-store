// static/src/js/Components/AppLayout.jsx

import React from 'react';
import { usePage } from '@inertiajs/react';
import Navbar from './Navbar.jsx';
import {CurrencyProvider} from './CurrencyContext.jsx';


export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    return (
        <>
            <CurrencyProvider>
            <Navbar auth={auth} />
            <main className="bg-gray-50 min-h-screen  overflow-x-clip ">{children}</main>
            </CurrencyProvider>

        </>
    );
}
