import React, {useEffect, useState} from 'react';
import ContactInfoModal from "./ContactInfoModal.jsx";
import TermsOfServiceModal from "./TermsOfServiceModal.jsx";
import PrivacyPolicyModal from "./PrivacyPolicyModal.jsx";
import ShippingPolicyModal from "./ShippingPolicyModal.jsx";
import RefundPolicyModal from "./RefundPolicyModal.jsx";
import {useCart} from "./CartContext.jsx";
import {useCurrency} from './CurrencyContext.jsx';


const CheckoutSection = () => {

    const { cart,setCart, calculateSubtotal, discountCode, setDiscountCode } = useCart();

    const [isTaxesExpanded, setIsTaxesExpanded] = useState(false);
    const [isAttentionExpanded, setIsAttentionExpanded] = useState(false);

    const [selectedMethod, setSelectedMethod] = useState('card');

    const handleSelect = (method) => {
        setSelectedMethod(method);
    };

    const [useShippingAsBilling, setUseShippingAsBilling] = useState(true);

    const [useDifferentAddress, setUseDifferentAddress] = useState(false);

    const [isContactModalOpen, setIsContactModalOpen] = React.useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);
    const [isShippingModalOpen, setIsShippingModalOpen] = React.useState(false);
    const [isRefundModalOpen, setIsRefundModalOpen] = React.useState(false);

    const calculateTotalItems = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };


    const isInputFilled = discountCode.trim().length > 0;


    const [paymentInfo, setPaymentInfo] = useState(() => {
        const saved = localStorage.getItem('paymentInfo');
        return saved ? JSON.parse(saved) : { cardNumber: '', nameOnCard: '' };
    });

    const [shippingAddress, setShippingAddress] = useState(() => {
        const saved = localStorage.getItem('shippingAddress');
        return saved ? JSON.parse(saved) : { address: '', city: '', zip: '' };
    });

// Persist paymentInfo
    useEffect(() => {
        localStorage.setItem('paymentInfo', JSON.stringify(paymentInfo));
    }, [paymentInfo]);

// Persist shippingAddress
    useEffect(() => {
        localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    }, [shippingAddress]);

    /*const clearCheckoutData = () => {
        clearDiscount();
        localStorage.removeItem('paymentInfo');
        localStorage.removeItem('shippingAddress');
        clearCart(); // ← Your existing clearCart
    };*/

    const { selectedCurrency, convertAmount } = useCurrency();
    const subtotalUSD = calculateSubtotal(); // Your base subtotal in USD
    const converted = convertAmount(subtotalUSD, selectedCurrency.code);



    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* DEVSHOP Title - full width on top */}
            <div className="w-full flex items-center justify-between border-b border-gray-200 pb-4">
                <h1 className="text-5xl font-bold">DEVSHOP</h1>
                <button className="text-gray-700 hover:text-black text-3xl mr-16">
                    <i className="fas fa-shopping-bag"></i>
                </button>
            </div>

            {/* Flex container for left + right sections */}
            <div className="flex flex-col lg:flex-row gap-10 ml-10">
                {/* Left Checkout Form */}
                <div className="w-full lg:w-1/2 flex-1 overflow-y-auto ">
                    {/* Express Checkout Options */}
                    <div className="mb-6 mt-10">
                        <p className="text-sm text-center text-gray-500">Express checkout</p>
                        <div className="mt-2 flex space-x-4">
                            {/* Shop Pay Logo */}
                            <button className="bg-purple-600 w-1/3 p-3 rounded-lg flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120" className="h-6">
                                    <rect width="400" height="120" rx="16" fill="#5A31F4"/>
                                    <g transform="translate(40,35) scale(2.8)">
                                        <path fill="#fff" d="M4.86 8.36a3.38 3.38 0 0 1-2.8-1.37l1.4-1.08c.37.53.76.81 1.44.81.53 0 .88-.21.88-.58v-.01c0-.33-.19-.5-1.1-.77C3.14 5 2.19 4.67 2.19 3.64v-.01c0-1.06.83-1.77 1.99-1.77.86 0 1.51.26 2.03.8L5.18 4.5a1.4 1.4 0 0 0-1.1-.52c-.49 0-.76.22-.76.52v.01c0 .39.25.52 1.22.8 1.11.32 1.73.77 1.73 1.73v.01c0 1.12-.89 1.79-2.21 1.79Zm5.51-2.55V3.6h.91c.62 0 .96.3.96.84v.01c0 .53-.4.85-.99.85h-.88Zm-1.62 2.46h1.62V7.15h.82c.78 0 1.51-.26 1.51-1.3v-.01c0-.88-.68-1.39-1.75-1.39H8.75v4.86Zm4.78.12h1.62v-2l.74-.78 1.33 2.78h1.77l-2.05-3.72 1.93-2.07h-1.8l-1.95 2.15V3.6h-1.62v5.79Zm7.7.05c1.07 0 1.92-.38 2.56-1.01l-1.01-1.1c-.46.43-.96.7-1.51.7-.85 0-1.47-.7-1.47-1.59v-.01c0-.89.61-1.58 1.47-1.58.51 0 .94.23 1.4.62l1-1.16a3.36 3.36 0 0 0-2.41-.92c-1.93 0-3.29 1.37-3.29 3.06v.01c0 1.7 1.35 3.06 3.28 3.06Z"/>
                                    </g>
                                    <g transform="translate(250,30)">
                                        <rect x="0" y="0" width="100" height="60" rx="12" fill="#fff"/>
                                        <text x="50" y="38" textAnchor="middle" fontSize="28" fontFamily="Arial, sans-serif" fill="#5A31F4">Pay</text>
                                    </g>
                                </svg>

                            </button>

                            {/* PayPal Logo */}
                            <button className="bg-yellow-400 w-1/3 p-3 rounded-lg flex items-center justify-center">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                    alt="PayPal"
                                    className="h-6"
                                />
                            </button>

                            {/* Google Pay Logo */}
                            <button className="bg-black w-1/3 p-3 rounded-lg flex items-center justify-center">
                                <img
                                    src=""
                                    alt="Google Pay"
                                    className="h-6"
                                />
                            </button>
                        </div>
                    </div>

                    {/* OR Divider */}
                    <div className="relative my-10">
                        <div className="border-t border-gray-200" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-white px-4 text-gray-500">OR</span>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="mb-10">
                        <div className="mb-10">
                            {/* Row with Contact + Log in */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold">Contact</h2>
                                <a href="/login" className="text-black text-sm underline">
                                    Log in
                                </a>
                            </div>

                            {/* Email Input Full Width */}
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 cusor-pointer"
                            />

                            {/* Checkbox Row */}
                            <div className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <p className="text-sm text-gray-500">
                                    Email me with news and offers
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Form */}
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold mb-4">Delivery</h2>
                        <div className="grid grid-cols-1 gap-4">
                            {/* Country/Region (full width, top of all inputs) */}
                            <div className="w-full">
                                <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500">
                                    <option value="" disabled selected>Country/Region</option>
                                    <option>Cameroon</option>
                                    <option>Canada</option>
                                    <option>France</option>
                                    <option>United States</option>
                                </select>
                            </div>

                            {/* Other Inputs (remaining fields) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg "
                                        placeholder="First name"
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Last name"
                                    />
                                </div>

                                {/* Address full-width row with search icon */}
                                <div className="col-span-2 relative">
                                    <input
                                        type="text"
                                        className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                                        placeholder="Address"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <input
                                        type="text"
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                        placeholder="Apartment, suite, etc. (optional)"
                                    />
                                </div>

                                {/* Row with City, State, Zip */}
                                <div className="col-span-2 grid grid-cols-3 gap-4">
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="City"
                                        />
                                    </div>
                                    <div>
                                        <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500">
                                            <option value="" disabled selected>State</option>
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
                                    </div>

                                    <div>
                                        <input
                                            type="text"
                                            className="w-full p-3 border border-gray-300 rounded-lg"
                                            placeholder="Zip/Postal code"
                                        />
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg"
                                            placeholder="Phone"
                                        />

                                        {/* Icon inside the input */}
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

                                            {/* Tooltip bubble */}
                                            <div className="absolute hidden group-hover:block w-[8rem] p-2 bg-gray-800 text-white text-xs text-center rounded-lg shadow-lg bottom-full right-[-3.5rem] z-10">
                                                In case we need to contact you about your order

                                                {/* Triangle arrow stays near center */}
                                                <div className="absolute bottom-0 right-[50%] w-2 h-2 bg-gray-800 rotate-45 transform translate-y-1/2"></div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h3 className="text-lg font-bold mb-4">Shipping method</h3>

                        {/* Shipping Address Message */}
                        <div className="bg-gray-100 p-5 rounded-lg mb-5">
                            <p className="text-center text-gray-600">
                                Enter your shipping address to view available shipping methods.
                            </p>
                        </div>

                        {/* Customs Duties & Taxes Accordion */}
                        <div className="bg-gray-50 p-5 rounded-lg mb-5">
                            <div className="flex justify-between items-center" onClick={() => setIsTaxesExpanded(!isTaxesExpanded)}>
                                <div className="flex items-center">
                                    <span className="text-gray-400 mr-2">
                                      <i className="fas fa-info-circle"></i>
                                    </span>
                                    <h4 className="font-medium">Customs Duties & Taxes</h4>
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
                                    <p className="mt-4">
                                        By placing an order, you acknowledge and agree that these additional fees may apply before delivery.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Attention Before Checkout Accordion */}
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

                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-2">Payment</h2>
                        <p className="text-gray-500 mb-6">All transactions are secure and encrypted.</p>

                        <div className="space-y-0">
                            {/* Card option */}
                            <div className={`border mb-0 rounded-t-lg bg-gray-50 overflow-hidden ${selectedMethod === 'card' ? 'border-black' : 'border-gray-300'}`}>
                                <button
                                    onClick={() => handleSelect('card')}
                                    className="flex items-center justify-between w-full p-4 focus:outline-none border-gray-300 rounded-t-lg"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'card'}
                                            onChange={() => handleSelect('card')}
                                            className="mr-2 accent-black cursor-pointer"
                                        />
                                        <span className="font-medium cursor-pointer">Credit card</span>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" className="h-7 w-auto">
                                            <rect width="160" height="60" fill="#2e77bc"/>
                                            <path fill="#fff" d="M59.3 47.3l6.1-35.5h9.7l-6.1 35.5h-9.7zm36.3-34.7c-1.9-.7-5-1.4-8.8-1.4-9.7 0-16.6 4.9-16.7 12-.1 5.2 4.9 8.1 8.7 9.8 3.9 1.8 5.2 3 5.2 4.6 0 2.5-3.1 3.7-6 3.7-4 0-6.1-.6-9.4-2l-1.3-.6-1.4 8.4c2.4 1 6.8 1.9 11.4 2 10.8 0 17.8-4.8 17.9-12.2.1-4-2.7-7.1-8.5-9.6-3.5-1.7-5.6-2.8-5.6-4.6 0-1.5 1.8-3.1 5.6-3.1 3.2-.1 5.6.6 7.5 1.2l.9.4 1.4-8.2m18.5-1h-7.4c-2.3 0-4 .6-5 3l-14.2 32.5h10c1.6 0 3-.9 3.6-2.2l1.9-5h11.9c.3 1.2 1.1 5 1.1 5 0 1.6 1.5 2.8 3 2.8h8.9l-7.7-36.1zm-11.5 23.2c.1 0 4.1-10.6 4.1-10.6l1.7 10.6h-5.8zM45.2 11.8l-9.6 24.2-.9-4.6c-1.7-5.6-7-11.8-12.9-14.8l8.8 32.4 10.4-.1 15.5-37.1H45.2zM10.7 11.8H-9.3L-9.8 14.3c11.7 2.9 19.5 9.9 22.7 18.4l-3.3-16.8z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" className="h-6 w-10">
                                            <circle cx="300" cy="250" r="200" fill="#eb001b"/>
                                            <circle cx="480" cy="250" r="200" fill="#f79e1b"/>
                                            <path fill="#ff5f00" d="M380 50a200 200 0 0 0 0 400 200 200 0 0 0 0-400z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 32" className="h-6 w-auto">
                                            <rect width="50" height="32" rx="4" fill="#2e77bc"/>
                                            <text x="50%" y="60%" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">AMEX</text>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" className="h-6 w-16">
                                            <rect width="1100" height="500" fill="#fff"/>
                                            <path fill="#ff6000" d="M390 250a150 150 0 1 1-300 0 150 150 0 0 1 300 0z"/>
                                            <text x="420" y="290" font-family="Arial, sans-serif" font-size="110" fill="#000">DISCOVER</text>
                                        </svg>
                                    </div>
                                </button>

                                {selectedMethod === 'card' && (
                                    <div className="bg-gray-50 px-4 py-4 space-y-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                placeholder="Card number"
                                                className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-white"
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <button className="text-gray-700 hover:text-black text-xl">
                                                    <i className="fas fa-lock"></i>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Expiration date (MM / YY)"
                                                className="p-3 border border-gray-300 rounded-lg w-full bg-white"
                                            />
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Security code"
                                                    className="p-3 border border-gray-300 rounded-lg w-full bg-white"
                                                />

                                                {/* Icon inside the input */}
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

                                                    {/* Tooltip bubble */}
                                                    <div className="absolute hidden group-hover:block w-[8rem] p-2 bg-gray-800 text-white text-xs text-center rounded-lg shadow-lg bottom-full right-[-1.5rem] z-10">
                                                        3-digit security code usually found on the back of your card. American Express cards have a 4-digit code located on the front.

                                                        {/* Triangle arrow stays near center */}
                                                        <div className="absolute bottom-0 right-[25%] w-2 h-2 bg-gray-800 rotate-45 transform translate-y-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        <input
                                            type="text"
                                            placeholder="Name on card"
                                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                        />

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                className="mr-2 accent-black"
                                                checked={useShippingAsBilling}
                                                onChange={(e) => setUseShippingAsBilling(e.target.checked)}
                                            />
                                            <label className="text-gray-700">Use shipping address as billing address</label>
                                        </div>

                                        {/* Conditionally render billing address form */}
                                        {!useShippingAsBilling && (
                                            <div className="grid grid-cols-1 gap-4">

                                                <h2 className="text-lg font-bold mb-2">Billing Address</h2>
                                                {/* Country/Region */}
                                                <div className="w-full">
                                                    <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 bg-white">
                                                        <option value="" disabled selected>Country/Region</option>
                                                        <option>Cameroon</option>
                                                        <option>Canada</option>
                                                        <option>France</option>
                                                        <option>United States</option>
                                                    </select>
                                                </div>

                                                {/* First + Last Name */}
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        type="text"
                                                        placeholder="First name"
                                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Last name"
                                                        className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                    />

                                                    {/* Address full-width */}
                                                    <div className="col-span-2 relative">
                                                        <input
                                                            type="text"
                                                            placeholder="Address"
                                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-white"
                                                        />
                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Apartment, suite, etc. (optional)"
                                                        className="col-span-2 w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                    />

                                                    {/* City + State + Zip */}
                                                    <div className="col-span-2 grid grid-cols-3 gap-4">
                                                        <input
                                                            type="text"
                                                            placeholder="City"
                                                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                        />
                                                        <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 bg-white">
                                                            <option value="" disabled selected>State</option>
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
                                                            className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                        />
                                                    </div>

                                                    {/* Phone */}
                                                    <div className="col-span-2 relative">
                                                        <input
                                                            type="tel"
                                                            placeholder="Phone"
                                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-white"
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

                                                            {/* Tooltip bubble */}
                                                            <div className="absolute hidden group-hover:block w-[8rem] p-2 bg-gray-800 text-white text-xs text-center rounded-lg shadow-lg bottom-full right-[-3.5rem] z-10">
                                                                In case we need to contact you about your order
                                                                <div className="absolute bottom-0 right-[50%] w-2 h-2 bg-gray-800 rotate-45 transform translate-y-1/2"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* PayPal option */}
                            <div className={`border mb-0 overflow-hidden ${selectedMethod === 'paypal' ? 'border-black' : 'border-gray-300'}`}>
                                <button
                                    onClick={() => handleSelect('paypal')}
                                    className="flex items-center justify-between w-full p-4 focus:outline-none  border-gray-300"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'paypal'}
                                            onChange={() => handleSelect('paypal')}
                                            className="mr-2 accent-black cursor-pointer"
                                        />
                                        <span className="font-medium cursor-pointer">PayPal</span>
                                    </div>
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg"
                                        alt="PayPal"
                                        className="h-6 cursor-pointer"
                                    />
                                </button>
                                {selectedMethod === 'paypal' && (
                                    <div className="mt-4 p-5 text-center">
                                        <div className="flex justify-center mb-5 relative">
                                            <div className="relative">
                                                {/* Browser window image */}
                                                <div className="w-40 h-24 border-2 border-black rounded-lg flex items-center justify-center">
                                                    {/* 3 dots */}
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-1 mt-1"></div>
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-3 mt-1"></div>
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-5 mt-1"></div>
                                                    {/* Top border line */}
                                                    <div className="border-b-2 border-black w-full -mt-14"></div>
                                                </div>

                                                {/* Arrow OVER the image (right edge) */}
                                                <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 flex items-center">
                                                    <div className="w-8 h-1 bg-black"></div>
                                                    <div className="w-3 h-3 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-600">
                                            After clicking "Pay with PayPal", you will be redirected to PayPal to complete your purchase securely.
                                        </p>
                                    </div>

                                )}

                            </div>

                            {/* Eximbay option */}
                            <div className={`border mt-0 border-b rounded-b overflow-hidden ${selectedMethod === 'eximbay' ? 'border-black' : 'border-gray-300'}`}>
                                <button
                                    onClick={() => handleSelect('eximbay')}
                                    className="flex items-center justify-between w-full p-4 focus:outline-none  border-gray-300"
                                >
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            name="payment"
                                            checked={selectedMethod === 'eximbay'}
                                            onChange={() => handleSelect('eximbay')}
                                            className="mr-2 accent-black cursor-pointer"
                                        />
                                        <span className="font-medium cursor-pointer">Eximbay (Global Payment)</span>
                                    </div>
                                    <div className="flex space-x-2 items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 60" className="h-7 w-auto">
                                            <rect width="160" height="60" fill="#2e77bc"/>
                                            <path fill="#fff" d="M59.3 47.3l6.1-35.5h9.7l-6.1 35.5h-9.7zm36.3-34.7c-1.9-.7-5-1.4-8.8-1.4-9.7 0-16.6 4.9-16.7 12-.1 5.2 4.9 8.1 8.7 9.8 3.9 1.8 5.2 3 5.2 4.6 0 2.5-3.1 3.7-6 3.7-4 0-6.1-.6-9.4-2l-1.3-.6-1.4 8.4c2.4 1 6.8 1.9 11.4 2 10.8 0 17.8-4.8 17.9-12.2.1-4-2.7-7.1-8.5-9.6-3.5-1.7-5.6-2.8-5.6-4.6 0-1.5 1.8-3.1 5.6-3.1 3.2-.1 5.6.6 7.5 1.2l.9.4 1.4-8.2m18.5-1h-7.4c-2.3 0-4 .6-5 3l-14.2 32.5h10c1.6 0 3-.9 3.6-2.2l1.9-5h11.9c.3 1.2 1.1 5 1.1 5 0 1.6 1.5 2.8 3 2.8h8.9l-7.7-36.1zm-11.5 23.2c.1 0 4.1-10.6 4.1-10.6l1.7 10.6h-5.8zM45.2 11.8l-9.6 24.2-.9-4.6c-1.7-5.6-7-11.8-12.9-14.8l8.8 32.4 10.4-.1 15.5-37.1H45.2zM10.7 11.8H-9.3L-9.8 14.3c11.7 2.9 19.5 9.9 22.7 18.4l-3.3-16.8z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 780 500" className="h-6 w-10">
                                            <circle cx="300" cy="250" r="200" fill="#eb001b"/>
                                            <circle cx="480" cy="250" r="200" fill="#f79e1b"/>
                                            <path fill="#ff5f00" d="M380 50a200 200 0 0 0 0 400 200 200 0 0 0 0-400z"/>
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 32" className="h-6 w-auto">
                                            <rect width="50" height="32" rx="4" fill="#2e77bc"/>
                                            <text x="50%" y="60%" text-anchor="middle" fill="#fff" font-family="Arial, sans-serif" font-size="14" font-weight="bold">AMEX</text>
                                        </svg>
                                    </div>
                                </button>
                                {selectedMethod === 'eximbay' && (
                                    <div className="mt-4 p-5 text-center">
                                        <div className="flex justify-center mb-5 relative">
                                            <div className="relative">
                                                {/* Browser window image */}
                                                <div className="w-40 h-24 border-2 border-black rounded-lg flex items-center justify-center">
                                                    {/* 3 dots */}
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-1 mt-1"></div>
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-3 mt-1"></div>
                                                    <div className="absolute top-0 left-0 w-2 h-2 bg-black rounded-full ml-5 mt-1"></div>
                                                    {/* Top border line */}
                                                    <div className="border-b-2 border-black w-full -mt-14"></div>
                                                </div>

                                                {/* Arrow OVER the image (right edge) */}
                                                <div className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 flex items-center">
                                                    <div className="w-8 h-1 bg-black"></div>
                                                    <div className="w-3 h-3 border-t-2 border-r-2 border-black transform rotate-45 -mt-1"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-600">
                                            After clicking “Pay now”, you will be redirected to Eximbay (Global Payment) to complete your purchase securely.
                                        </p>
                                    </div>

                                )}

                            </div>
                        </div>
                    </div>

                    <div className="mt-10">
                        <h2 className="text-lg font-bold mb-4">Billing address</h2>

                        <div className="bg-white p-5 rounded-lg border border-gray-200">
                            {/* Same as shipping address card */}
                            <div
                                className={`flex items-center mb-3 p-4 rounded-lg border ${
                                    !useDifferentAddress ? 'border-black' : 'border-gray-300'
                                } cursor-pointer`}
                                onClick={() => setUseDifferentAddress(false)}
                            >
                                <input
                                    type="radio"
                                    name="billingAddress"
                                    id="sameAsShipping"
                                    checked={!useDifferentAddress}
                                    onChange={() => setUseDifferentAddress(false)}
                                    className="mr-2"
                                />
                                <label htmlFor="sameAsShipping" className="font-medium cursor-pointer">
                                    Same as shipping address
                                </label>
                            </div>

                            {/* Different billing address card */}
                            <div
                                className={`flex flex-col p-4 rounded-lg border ${
                                    useDifferentAddress ? 'border-black' : 'border-gray-300'
                                } cursor-pointer`}
                                onClick={() => setUseDifferentAddress(true)}
                            >
                                <div className="flex items-center mb-3">
                                    <input
                                        type="radio"
                                        name="billingAddress"
                                        id="differentAddress"
                                        checked={useDifferentAddress}
                                        onChange={() => setUseDifferentAddress(true)}
                                        className="mr-2"
                                    />
                                    <label htmlFor="differentAddress" className="font-medium cursor-pointer">
                                        Use a different billing address
                                    </label>
                                </div>

                                {/* Conditional form rendering */}
                                {useDifferentAddress && (
                                    <div className="grid grid-cols-1 gap-4 mt-2">
                                        {/* Country/Region */}
                                        <div className="w-full">
                                            <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 bg-white">
                                                <option value="" disabled selected>
                                                    Country/Region
                                                </option>
                                                <option>Cameroon</option>
                                                <option>Canada</option>
                                                <option>France</option>
                                                <option>United States</option>
                                            </select>
                                        </div>

                                        {/* First + Last Name */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="First name"
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Last name"
                                                className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                            />

                                            {/* Address full-width */}
                                            <div className="col-span-2 relative">
                                                <input
                                                    type="text"
                                                    placeholder="Address"
                                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-white"
                                                />
                                            </div>

                                            <input
                                                type="text"
                                                placeholder="Apartment, suite, etc. (optional)"
                                                className="col-span-2 w-full p-3 border border-gray-300 rounded-lg bg-white"
                                            />

                                            {/* City + State + Zip */}
                                            <div className="col-span-2 grid grid-cols-3 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="City"
                                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                />
                                                <select className="w-full p-3 border border-gray-300 rounded-lg text-gray-500 bg-white">
                                                    <option value="" disabled selected>
                                                        State
                                                    </option>
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
                                                    className="w-full p-3 border border-gray-300 rounded-lg bg-white"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="col-span-2 relative">
                                                <input
                                                    type="tel"
                                                    placeholder="Phone"
                                                    className="w-full p-3 pr-12 border border-gray-300 rounded-lg bg-white"
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

                                                    {/* Tooltip bubble */}
                                                    <div className="absolute hidden group-hover:block w-[8rem] p-2 bg-gray-800 text-white text-xs text-center rounded-lg shadow-lg bottom-full right-[-3.5rem] z-10">
                                                        In case we need to contact you about your order
                                                        <div className="absolute bottom-0 right-[50%] w-2 h-2 bg-gray-800 rotate-45 transform translate-y-1/2"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 cursor-pointer">
                        <button
                            className={`w-full text-2xl py-3 rounded-lg font-bold transition-colors cursor-pointer ${
                                selectedMethod === 'paypal'
                                    ? 'bg-blue-600 text-white'
                                    : (selectedMethod === 'card' || selectedMethod === 'eximbay')
                                        ? 'bg-black text-white'
                                        : 'bg-gray-400 text-white cursor-not-allowed'
                            }`}
                            disabled={!['paypal', 'card', 'eximbay'].includes(selectedMethod)}
                        >
                            {selectedMethod === 'paypal'
                                ? 'Pay with PayPal'
                                : (selectedMethod === 'card' || selectedMethod === 'eximbay')
                                    ? 'Pay Now'
                                    : 'Select Payment Method'}
                        </button>
                    </div>

                    <div className="mt-[5rem] space-x-2 border-t border-gray-300 pt-4">
                        <a href="#" className="underline text-sm cursor-pointer" onClick={() => setIsRefundModalOpen(true)}>Refund Policy</a>
                        <a href="#" className="underline text-sm cursor-pointer" onClick={() => setIsShippingModalOpen(true)}>Shipping Policy</a>
                        <a href="#" className="underline text-sm cursor-pointer" onClick={() => setIsPrivacyModalOpen(true)}>Privacy Policy</a>
                        <a href="#" className="underline text-sm cursor-pointer" onClick={() => setIsTermsModalOpen(true)}>Terms of Service</a>
                        <a href="#" className="underline text-sm cursor-pointer" onClick={() => setIsContactModalOpen(true)}>Contact Information</a>
                    </div>

                    <ContactInfoModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
                    <TermsOfServiceModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />
                    <PrivacyPolicyModal isOpen={isPrivacyModalOpen} onClose={() => setIsPrivacyModalOpen(false)} />
                    <ShippingPolicyModal isOpen={isShippingModalOpen} onClose={() => setIsShippingModalOpen(false)} />
                    <RefundPolicyModal isOpen={isRefundModalOpen} onClose={() => setIsRefundModalOpen(false)} />


                </div>

                {/* Right Sidebar Summary */}
                <div className="w-full lg:w-1/2 bg-gray-50 px-10 pt-4 rounded-lg flex-shrink-0 sticky top-0 h-screen overflow-hidden border-l border-gray-200 flex flex-col">

                    {/* Order Summary Title - Fixed Top */}
                    <div className="flex justify-between items-center mb-4 flex-shrink-0">
                        <h2 className="text-3xl font-bold">Order summary</h2>
                    </div>

                    {/* Cart Items - Scrollable */}
                    <div className="flex-1 overflow-y-auto mb-6">
                        {cart.map((product) => (
                            <div key={product.id} className="flex items-center py-3">
                                <div className="w-20 relative">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-20 object-cover border border-gray-300 rounded"
                                    />
                                    <span className="absolute top-0 right-0 bg-gray-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/3 -translate-y-1/3">
                        {product.quantity}
                    </span>
                                </div>
                                <div className="w-3/5 pl-4">
                                    <h4 className="font-medium">{product.name}</h4>
                                    <p className="text-sm text-gray-500">{product.size || 'No size selected'}</p>
                                </div>
                                <div className="w-1/5 text-right">
                                    <p className="font-bold">{product.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Discount Code + Order Summary - Fixed Bottom */}
                    <div className="flex-shrink-0">

                        {/* Discount Code */}
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
                                        isInputFilled
                                            ? 'bg-black text-white cursor-pointer'
                                            : 'bg-gray-200 text-gray-700 cursor-default'
                                    }`}
                                    disabled={!isInputFilled}
                                >
                                    Apply
                                </button>
                            </div>
                        </div>

                        {/* Order Summary */}
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
                                <span><span className='text-sm text-gray-600 mr-2'>{selectedCurrency.code}</span>{selectedCurrency.symbol} {converted.toFixed(2)}</span>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default CheckoutSection;
