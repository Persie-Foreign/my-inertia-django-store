// static/src/js/Pages/components/CurrencyContext.jsx
import React, {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

// 1) Available currencies
export const currencies = [
    {
        country: "United States",
        code: "USD",
        symbol: "$",
        icon:
            "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/us.svg"
    },
    {
        country: "Canada",
        code: "CAD",
        symbol: "$",
        icon:
            "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/ca.svg"
    },
    {
        country: "Cameroon",
        code: "XAF",
        symbol: "FCFA",
        icon:
            "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/cm.svg"
    },
    {
        country: "France",
        code: "EUR",
        symbol: "€",
        icon:
            "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/6.6.6/flags/4x3/fr.svg"
    }
];

const CurrencyContext = createContext();

export function useCurrency() {
    return useContext(CurrencyContext);
}

export function CurrencyProvider({ children }) {
    // 2) load saved or default to XAF
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        const stored = localStorage.getItem("currency");
        return currencies.find((c) => c.code === stored) || currencies[2];
    });

    // 3) initialize all rates to 1 so convert() never reads undefined
    const [exchangeRates, setExchangeRates] = useState({
        USD: 1,
        CAD: 1,
        XAF: 1,
        EUR: 1
    });

    // 4) fetch live rates (base XAF) every 10m
    useEffect(() => {
        let mounted = true;
        async function fetchRates() {
            try {
                const res = await fetch(
                    "https://api.exchangerate.host/latest?base=XAF&symbols=USD,CAD,XAF,EUR"
                );
                const data = await res.json();
                if (
                    data?.rates &&
                    typeof data.rates === "object" &&
                    ["USD", "CAD", "XAF", "EUR"].every((c) => c in data.rates)
                ) {
                    if (mounted) setExchangeRates(data.rates);
                } else {
                    throw new Error("Rates missing or malformed");
                }
            } catch (err) {
                console.error("Failed to fetch exchange rates:", err);
                // leave fallback {1,1,1,1} or set approximate defaults here
            }
        }
        fetchRates();
        const id = setInterval(fetchRates, 10 * 60 * 1000);
        return () => {
            mounted = false;
            clearInterval(id);
        };
    }, []);

    // 5) persist user choice
    useEffect(() => {
        localStorage.setItem("currency", selectedCurrency.code);
    }, [selectedCurrency]);

    // 6) convert XAF → selected currency, formatted to 2 decimals
    function convertAmount(amountInXAF) {
        const rate = exchangeRates[selectedCurrency.code] || 1;
        const converted = amountInXAF * rate;
        return converted.toFixed(2);
    }

    return (
        <CurrencyContext.Provider
            value={{
                currencies,
                selectedCurrency,
                setSelectedCurrency,
                convertAmount,
                exchangeRates
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
}
