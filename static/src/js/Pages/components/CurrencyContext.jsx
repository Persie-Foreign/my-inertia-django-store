import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context
const CurrencyContext = createContext();

// List of supported currencies
export const currencies = [
    {
        country: 'United States',
        code: 'USD',
        symbol: '$',
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/us.svg',
    },
    {
        country: 'Canada',
        code: 'CAD',
        symbol: '$',
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/ca.svg',
    },
    {
        country: 'Cameroon',
        code: 'XAF',
        symbol: 'FCFA',
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/cm.svg',
    },
    {
        country: 'France',
        code: 'EUR',
        symbol: '€',
        icon: 'https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/fr.svg',
    },
];

export const CurrencyProvider = ({ children }) => {
    const defaultCurrency = currencies.find(c => c.code === 'XAF');
    const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
    const [exchangeRates, setExchangeRates] = useState({ XAF: 1 });

    // Fetch exchange rates on mount and periodically refresh
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://api.exchangerate.host/latest?base=XAF');
                const data = await response.json();

                const filteredRates = {};
                ['USD', 'CAD', 'XAF', 'EUR'].forEach(code => {
                    filteredRates[code] = data.rates[code];
                });

                setExchangeRates(filteredRates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                setExchangeRates({
                    XAF: 1,
                    USD: 0.0017,
                    CAD: 0.0023,
                    EUR: 0.0016,
                });
            }
        };

        fetchRates();
        const interval = setInterval(fetchRates, 10 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    // Convert amount from FCFA to selected currency
    const convertAmount = (amountInXAF) => {
        const rate = exchangeRates[selectedCurrency.code] || 1;
        return amountInXAF * rate;
    };

    return (
        <CurrencyContext.Provider value={{
            selectedCurrency,
            setSelectedCurrency,
            currencies,
            exchangeRates,
            convertAmount,
        }}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Hook to use currency context
export const useCurrency = () => useContext(CurrencyContext);
