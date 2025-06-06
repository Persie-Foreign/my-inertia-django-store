// static/src/js/Pages/CheckoutSection.jsx

import React, { useEffect, useState } from 'react';
import { useCart } from "./components/CartContext.jsx";
import { useCurrency } from './components/CurrencyContext.jsx';
import { Link } from "@inertiajs/react";

const CheckoutSection = () => {
    const { cart, setCart, calculateSubtotal, discountCode, setDiscountCode, clearCart } = useCart();
    const [isTaxesExpanded, setIsTaxesExpanded] = useState(false);
    const [isAttentionExpanded, setIsAttentionExpanded] = useState(false);

    // We no longer need paymentMethod state—it's always COD.
    // const [selectedMethod, setSelectedMethod] = useState('card');

    // Shipping / Contact info
    const [shippingInfo, setShippingInfo] = useState(() => {
        const saved = localStorage.getItem('shippingInfo');
        return saved
            ? JSON.parse(saved)
            : {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                state: '',
                zip: '',
                country: '',
            };
    });

    // Persist shipping info
    useEffect(() => {
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }, [shippingInfo]);

    const handleShippingChange = (field, value) => {
        setShippingInfo((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const calculateTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

    const isDiscountFilled = (discountCode || '').trim().length > 0;

    const { selectedCurrency, convertAmount } = useCurrency();
    const subtotalUSD = calculateSubtotal(); // base subtotal in USD
    const converted = convertAmount(subtotalUSD, selectedCurrency.code);

    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderError, setOrderError] = useState(null);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const handlePlaceOrder = async () => {
        setOrderError(null);

        // Simple front-end validation
        const required = [
            'first_name',
            'last_name',
            'email',
            'phone',
            'address',
            'city',
            'state',
            'zip',
            'country',
        ];
        for (let field of required) {
            if (!shippingInfo[field]?.trim()) {
                setOrderError(`“${field.replace('_', ' ')}” is required.`);
                return;
            }
        }

        if (cart.length === 0) {
            setOrderError("Your cart is empty.");
            return;
        }

        setPlacingOrder(true);

        // Build payload
        const payload = {
            shipping: { ...shippingInfo },
            items: cart.map((item) => ({
                id: item.id,
                quantity: item.quantity,
            })),
        };

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/transactions/create-order/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken || '',
                },
                credentials: 'include',
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Unknown error");
            }
            const data = await res.json();
            if (data.success) {
                setOrderSuccess(true);
                clearCart();
            } else {
                throw new Error("Server did not return success.");
            }
        } catch (err) {
            setOrderError(err.message || "Failed to place order.");
        } finally {
            setPlacingOrder(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* DEVSHOP Title */}
            <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
                <div className="text-4xl sm:text-4xl md:text-6xl font-bold flex-1">
                    <Link href="/" className="text-sky-500 px-5">DevShop</Link>
                </div>
                <button className="text-gray-700 hover:text-black text-2xl sm:text-3xl mr-6 sm:mr-10 md:mr-16">
                    <i className="fas fa-shopping-bag"></i>
                </button>
            </div>

            {/* Flex container for left + right sections */}
            <div className="flex flex-col lg:flex-row gap-10 lg:ml-10">
                {/* Left: Shipping / Contact / Delivery form */}
                <div className="w-full lg:w-1/2 flex-1 overflow-y-auto ">
                    {/* “OR” Divider is omitted since we have no express checkout */}

                    {/* Contact & Shipping Form */}
                    <div className="mb-10">
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Contact &amp; Delivery</h2>
                            </div>
                            {/* First + Last Name */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="First name"
                                    value={shippingInfo.first_name}
                                    onChange={(e) => handleShippingChange('first_name', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                <input
                                    type="text"
                                    placeholder="Last name"
                                    value={shippingInfo.last_name}
                                    onChange={(e) => handleShippingChange('last_name', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                            </div>
                            {/* Email */}
                            <input
                                type="email"
                                placeholder="Email"
                                value={shippingInfo.email}
                                onChange={(e) => handleShippingChange('email', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />
                            {/* Phone */}
                            <div className="relative mb-4">
                                <input
                                    type="tel"
                                    placeholder="Phone"
                                    value={shippingInfo.phone}
                                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                                />
                                <div className="absolute inset-y-0 right-3 flex items-center group">
                                    <svg
                                        className="w-5 h-5 text-gray-400 cursor-pointer"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M8.22 9.22a4 4 0 117.56 2.12c-.43.68-1.11 1.11-1.56 1.47-.57.45-.97.88-1 1.54v.25m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                                        />
                                    </svg>
                                    <div className="absolute hidden group-hover:block w-[8rem] p-2 bg-gray-800 text-white text-xs text-center rounded-lg shadow-lg bottom-full right-[-2rem] z-10">
                                        In case we need to contact you about your order
                                        <div className="absolute bottom-0 right-1 w-2 h-2 bg-gray-800 rotate-45 transform translate-y-1/2"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Address (full width) */}
                            <input
                                type="text"
                                placeholder="Address"
                                value={shippingInfo.address}
                                onChange={(e) => handleShippingChange('address', e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4"
                            />

                            {/* City + State + Zip + Country */}
                            <div className="grid grid-cols-1 gap-4 mb-4">
                                <input
                                    type="text"
                                    placeholder="City"
                                    value={shippingInfo.city}
                                    onChange={(e) => handleShippingChange('city', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
                                    value={shippingInfo.state}
                                    onChange={(e) => handleShippingChange('state', e.target.value)}
                                >
                                    <option value="" disabled>State</option>
                                    <option>Baffoussam</option>
                                    <option>Bamenda</option>
                                    <option>British Columbia</option>
                                    <option>California</option>
                                    <option>Douala</option>
                                    <option>Florida</option>
                                    <option>New York</option>
                                    <option>Ontario</option>
                                    <option>Quebec</option>
                                    <option>Yaounde</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="Zip/Postal code"
                                    value={shippingInfo.zip}
                                    onChange={(e) => handleShippingChange('zip', e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-lg"
                                />
                                <select
                                    className="w-full p-3 border border-gray-300 rounded-lg text-gray-500"
                                    value={shippingInfo.country}
                                    onChange={(e) => handleShippingChange('country', e.target.value)}
                                >
                                    <option value="" disabled>Country/Region</option>
                                    <option>Cameroon</option>
                                    <option>Canada</option>
                                    <option>France</option>
                                    <option>United States</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customs & Taxes Info (collapsible) */}
                    <div className="mt-10">
                        <h3 className="text-lg font-bold mb-4">Shipping method</h3>
                        <div className="bg-gray-50 p-5 rounded-lg mb-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">
                    <i className="fas fa-info-circle"></i>
                  </span>
                                    <h4 className="font-medium">Customs Duties &amp; Taxes</h4>
                                </div>
                                <span className="text-gray-400">
                  <i className={`fas ${isTaxesExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
                            </div>
                            {isTaxesExpanded && (
                                <div className="mt-3 text-gray-700 ml-6 text-sm">
                                    <p>
                                        Orders shipped outside the CAMEROON may be subject to additional customs fees,
                                        which are determined by the customs authorities of the destination country.
                                        As customs duties and taxes vary by country, we are unable to estimate the exact
                                        charges in advance.
                                    </p>
                                    <p className="mt-4">
                                        The total amount displayed at checkout does not include duties and taxes.
                                        Upon arrival in the destination country, the recipient will receive an invoice
                                        from DHL for these charges. Therefore, please ensure that you provide a valid email
                                        address when placing your order to receive important notifications.
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="bg-gray-50 p-5 rounded-lg">
                            <div className="flex justify-between items-center" onClick={() => setIsAttentionExpanded(!isAttentionExpanded)}>
                                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">
                    <i className="fas fa-info-circle"></i>
                  </span>
                                    <h4 className="font-medium">Attention Before Checkout</h4>
                                </div>
                                <span className="text-gray-400">
                  <i className={`fas ${isAttentionExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
                </span>
                            </div>
                            {isAttentionExpanded && (
                                <div className="mt-3 text-gray-600 ml-6 text-sm">
                                    <p>
                                        Please ensure that your delivery details, including street number,
                                        apartment or building number, and zip code, are accurate. Providing
                                        incorrect or incomplete address information may result in delays or
                                        delivery failure. We are not responsible for failed deliveries due to
                                        incomplete or unclear addresses.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Order Summary */}
                <div className="w-full lg:w-1/2 bg-gray-50 lg:px-10 lg:pt-4 px-0 pt-0 rounded-lg flex-shrink-0 sticky top-0 h-screen overflow-hidden border-l border-gray-200 flex flex-col">
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-3xl font-bold">Order summary</h2>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto mb-6 max-h-[21rem] sm:max-h-none">
                        {cart.map((item) => (
                            <div key={item.id} className="flex items-center py-3">
                                <div className="w-20 relative">
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="w-full h-20 object-cover border border-gray-300 rounded"
                                    />
                                    <span className="absolute top-0 right-0 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                    {item.quantity}
                  </span>
                                </div>
                                <div className="w-3/5 pl-4">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-gray-500">{item.size || 'No size selected'}</p>
                                </div>
                                <div className="w-1/5 text-right">
                                    <p className="font-bold">
                                        {selectedCurrency.symbol} {convertAmount(item.price).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Discount + Subtotal + Shipping + Total */}
                    <div className="flex-shrink-0">
                        <div className="mb-6">
                            <div className="flex mb-3">
                                <input
                                    type="text"
                                    placeholder="Discount code or gift card"
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    className="w-3/4 h-[3rem] p-2 border border-gray-300 rounded-lg bg-white"
                                />
                                <button
                                    className={`w-[4.5rem] border border-gray-300 rounded-lg ml-4 py-2 px-4 font-bold transition-colors duration-300 ${
                                        isDiscountFilled
                                            ? 'bg-black text-white cursor-pointer'
                                            : 'bg-gray-200 text-gray-700 cursor-default'
                                    }`}
                                    disabled={!isDiscountFilled}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-2">
                <span>
                  Subtotal<span className="mx-1">·</span>{calculateTotalItems()} items
                </span>
                                <span>{selectedCurrency.symbol} {converted.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mb-2">
                <span className="inline-flex items-center space-x-1">
                  <span>Shipping</span>
                  <svg
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8.22 9.22a4 4 0 117.56 2.12c-.43.68-1.11 1.11-1.56 1.47-.57.45-.97.88-1 1.54v.25m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
                    />
                  </svg>
                </span>
                                <span>Enter shipping address</span>
                            </div>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span>Total</span>
                                <span>
                  <span className='text-sm text-gray-600 mr-2'>{selectedCurrency.code}</span>
                                    {selectedCurrency.symbol} {converted.toFixed(2)}
                </span>
                            </div>
                        </div>
                    </div>

                    {/* Place Order Button */}
                    <div className="mt-4 cursor-pointer">
                        <button
                            onClick={handlePlaceOrder}
                            className={`w-full text-2xl py-3 rounded-lg font-bold transition-colors ${
                                placingOrder ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-black text-white'
                            }`}
                            disabled={placingOrder}
                        >
                            {placingOrder ? 'Placing Order…' : 'Place Order (Cash on Delivery)'}
                        </button>
                        {orderError && (
                            <p className="mt-2 text-red-600 text-sm">{orderError}</p>
                        )}
                        {orderSuccess && (
                            <p className="mt-2 text-green-600 text-sm">Order placed successfully!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSection;
