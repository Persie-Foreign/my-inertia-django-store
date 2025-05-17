import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const CurrencyContext = createContext();

// List of currencies available
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

// Currency Provider component that will provide context
export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[2]); // default XAF (CFA Franc)
    const [exchangeRates, setExchangeRates] = useState({ XAF: 1 }); // default rates with XAF as 1

    // Fetch live rates with XAF as the base currency and update every 10 minutes
    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch('https://api.exchangerate.host/latest?base=XAF');
                const data = await response.json();

                // Only keep rates we care about (USD, CAD, XAF, EUR)
                const filteredRates = {};
                ['USD', 'CAD', 'XAF', 'EUR'].forEach(code => {
                    filteredRates[code] = data.rates[code];
                });

                setExchangeRates(filteredRates);
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
                // fallback to defaults if fetch fails (with XAF as base)
                setExchangeRates({
                    XAF: 1,
                    USD: 0.0017, // Approximate XAF to USD rate
                    CAD: 0.0023, // Approximate XAF to CAD rate
                    EUR: 0.0016, // Approximate XAF to EUR rate
                });
            }
        };

        fetchRates();
        const interval = setInterval(fetchRates, 10 * 60 * 1000); // refresh every 10 minutes

        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this runs only once on mount

    const convertAmount = (amountInXAF, currencyCode) => {
        const rate = exchangeRates[currencyCode] || 1;
        return amountInXAF * rate;
    };

    return (
        <CurrencyContext.Provider value={{ selectedCurrency, setSelectedCurrency, currencies, convertAmount }}>
            {children}
        </CurrencyContext.Provider>
    );
};

// Custom hook to access the Currency Context
export const useCurrency = () => useContext(CurrencyContext);
