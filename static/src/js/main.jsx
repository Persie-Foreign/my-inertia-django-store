// static/src/js/main.jsx

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import AppLayout from './Pages/components/AppLayout.jsx';
import '../css/app.css';
import { CartProvider } from './Pages/components/CartContext.jsx';
import {CurrencyProvider} from "./Pages/components/CurrencyContext.jsx";
import {MegaMenuProvider} from "./Pages/components/MegaMenuContext.jsx";

createInertiaApp({
    resolve: (name) => {
        // 1) Eagerly import all your Pages
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        const page = pages[`./Pages/${name}.jsx`].default;

        // 2) If the page component doesn't declare its own layout,
        //    attach AppLayout as the default:
        if (!page.layout) {
            page.layout = (pageContent) => <AppLayout>{pageContent}</AppLayout>;
        }

        return page;
    },
    setup({ el, App, props }) {
        // 3) Render Inertia's <App /> — it will automatically call
        //    page.layout(<Page />) for each page under the hood.
        const root = createRoot(el);
        root.render(
            <CurrencyProvider>
                <CartProvider>
                    <MegaMenuProvider>
                        <App {...props} />
                    </MegaMenuProvider>
                </CartProvider>
            </CurrencyProvider>
        );
    },
});
