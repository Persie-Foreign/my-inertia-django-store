import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import '../src/assets/css/global.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './components/CartContext.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <CartProvider>
                <App />
            </CartProvider>
        </BrowserRouter>
    </StrictMode>
);
