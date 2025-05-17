import React, {useEffect} from 'react';

const ShippingPolicyModal = ({ isOpen, onClose }) => {

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500/25 bg-opacity-20 backdrop-blur-md z-50 flex items-center justify-center">
            <div className="bg-white w-full max-w-md rounded-lg p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                    aria-label="Close"
                >
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-bold mb-6">Shipping Policy</h2>

                <div className="overflow-y-auto max-h-[60vh] pb-4 space-y-4 text-gray-700 text-base">
                    <h3 className="text-xl font-semibold">DOMESTIC</h3>

                    <h4 className="font-semibold">SHIPPING DETAILS</h4>
                    <p>
                        We use USPS for the courier service and the delivery time varies by location.
                        It usually takes about 6-7 business days on average, but duly note that there may be delays for unforeseen factors that occur during the shipment process.
                    </p>

                    <h4 className="font-semibold">SHIPPING COST</h4>
                    <p>
                        For US residents, a flat rate of $6.99 will be charged for shipping. However, please be noted that it may vary depending on the region, such as Hawaii or Alaska.
                        Free shipping is offered for any orders above $60.
                    </p>

                    <h4 className="font-semibold">RECIPIENT'S ABSENCE/UNCLEAR ADDRESS</h4>
                    <p>
                        Please provide a physical address, as USPS does not ship to PO Box, FPO/DPO/APO addresses and ensure that your delivery details, including street number, apartment or building number, and zip code, are accurate.
                    </p>
                    <p>
                        Providing incorrect or incomplete address information may result in delays or delivery failure. We are not responsible for failed deliveries due to incomplete or unclear addresses.
                    </p>
                    <p>
                        Occasionally, a package may be returned to us due to the recipient’s absence at the time of delivery or an incomplete/unclear address. In such cases, a refund will be issued, with the return shipping fees deducted.
                    </p>

                    <h3 className="text-xl font-semibold pt-6">INTERNATIONAL</h3>

                    <h4 className="font-semibold">SHIPPING DETAILS</h4>
                    <p>
                        All international orders are shipped directly from Korea, except for Canada. All Canada orders will be shipped from the U.S.
                        ANUA offer international shipping to the following countries/regions: Canada, Switzerland, Sweden, Singapore, Saudi Arabia, Philippines, Norway, New Zealand, Netherlands, Macau, Ireland, Hungary, Hong Kong, Croatia, Bulgaria, Brunei, Belgium, Australia.
                    </p>
                    <p>
                        Our standard shipping method for international orders is DHL. Customers will automatically receive a tracking number via email once the shipment has been prepared.
                    </p>
                    <p>
                        International orders are processed on business days (Monday–Friday, KST) and shipped out excluding federal holidays in the respective countries/regions. Free standard shipping typically takes approximately 5-7 days for delivery.
                    </p>
                    <p>
                        If you have any questions or encounter issues with tracking your order after 7 business days, please feel free to contact us at help@anua.us.
                    </p>

                    <h4 className="font-semibold">SHIPPING COST</h4>
                    <p>
                        For international orders, a flat shipping rate of $25 will apply.
                        Free shipping is available for orders over $60.
                    </p>

                    <h4 className="font-semibold">DUTIES & TAXES NOT INCLUDED</h4>
                    <p>
                        Upon arrival at the destination, sales tax on imports, customs duties, and handling fees will be assessed by the respective customs office.
                        The recipient will receive an invoice from our logistics partner, DHL.
                    </p>
                    <p>
                        By placing an order and providing the necessary payment and/or information, you agree to the import regulations governing the respective items.
                    </p>
                    <p>
                        Customs duties, import sales tax, and handling fees charged by DHL on behalf of the customs office are non-refundable, even if the items are returned.
                    </p>
                    <p>
                        Additionally, if the shipment cannot be delivered due to unpaid customs fees and is subsequently disposed of by the local customs authority, ANUA will not be held responsible, and the order will be non-refundable.
                    </p>

                    <h4 className="font-semibold">MODIFYING SHIPPING ADDRESS</h4>
                    <p>
                        If you have placed an order with an incorrect shipping address, please contact our customer service center at help@anua.us as soon as possible.
                    </p>
                    <p>
                        Please note that if your order has already been fulfilled, we will be unable to assist further, and the order will not be eligible for a refund.
                    </p>
                    <p>
                        *For more information regarding shipping, please refer to our FAQs.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyModal;
