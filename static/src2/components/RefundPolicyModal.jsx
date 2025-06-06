import React, {useEffect} from 'react';

const RefundPolicyModal = ({ isOpen, onClose }) => {

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
                <h2 className="text-2xl font-bold mb-6">Refund Policy</h2>

                <div className="overflow-y-auto max-h-[60vh] pb-4 space-y-4 text-gray-700 text-base">
                    <h3 className="text-xl font-semibold">DOMESTIC</h3>

                    <p>Unfortunately, we are not offering exchanges at the moment. Please contact the customer service to request a return, and place a new order.</p>

                    <p>In order to return any items, you must comply with the following:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Return requests should be done within 14 days from the day of arrival.</li>
                        <li>The items must be sealed, unused, and in the same condition that you received them.</li>
                        <li>Any gifts that were given for free should be included as well.</li>
                        <li>You must inform the customer service about the return in advance, and receive confirmation.</li>
                    </ul>

                    <p>
                        To start a return, you can contact us at <a href="mailto:help@anua.us" className="underline text-blue-600">help@anua.us</a>.
                        If your return is accepted, we’ll send you a return shipping label, as well as instructions on how and where to send your package.
                        Items sent back to us without first requesting a return will not be accepted.
                    </p>

                    <p>The return process is as follows:</p>
                    <ul className="list-decimal list-inside space-y-1">
                        <li>Once you reach out to the customer service team regarding the return, you will receive a return label via e-mail. (Customer service email: help@anua.us)</li>
                        <li>Please print out and bring the return label to the USPS center, where you will submit the returning package. (You can print the return label at their center as well).</li>
                        <li>The refund will be processed once the package is returned and inspected by our warehouse, and they have confirmed that there are no issues found.</li>
                    </ul>

                    <p>If the return is based on change of mind (ex. no longer need, not expected product), the customer is responsible for the round shipping fee:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li><strong>Orders under $60:</strong> The value corresponding to the return label will be excluded from the refund, and so will the first standard shipping fee that you paid when placing the order.</li>
                        <li><strong>Orders over $60:</strong> The value corresponding to the return label will be excluded from the refund, and so will the first standard shipping fee that you were not charged, for receiving free shipping.</li>
                        <li><strong>Partial returns:</strong> The customer will be responsible for the return shipping fee of $6.99 (variable depending on the region).</li>
                    </ul>

                    <p>Please read the regulations carefully and contact our customer service regarding the return.</p>

                    <p>You can always contact us for any return question at <a href="mailto:help@anua.us" className="underline text-blue-600">help@anua.us</a>.</p>

                    <h4 className="font-semibold">DAMAGES OR MISSING ITEMS</h4>
                    <p>
                        Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
                    </p>
                    <p>Also, you will be asked to provide the following:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>A picture of the exterior packaging, with the tracking number showing on the shipping label.</li>
                        <li>A picture of all the items inside the original packaging.</li>
                        <li>A picture of the actual item that was damaged.</li>
                    </ul>
                    <p>
                        Please note that compensation may not be offered if the aforementioned pictures are not provided.
                        Make sure to take the pictures first, and then discard the packaging. We appreciate your cooperation on this matter.
                    </p>

                    <h4 className="font-semibold">REFUNDS</h4>
                    <p>
                        We will notify you once we’ve received and inspected your return, and let you know if the refund was approved or not.
                        If approved, you’ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
                    </p>

                    <h3 className="text-xl font-semibold pt-6">INTERNATIONAL</h3>
                    <p>
                        Please note that we do not currently accept returns or exchanges for international orders. Should you receive a damaged or incorrect product, kindly contact us at <a href="mailto:help@anua.us" className="underline text-blue-600">help@anua.us</a> for further assistance.
                        For prompt processing, please ensure that you include your order number in all correspondence with our customer service team.
                    </p>
                    <p>Also, you will be asked to provide the following:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>A picture of the exterior packaging, with the tracking number showing on the shipping label.</li>
                        <li>A picture of all the items inside the original packaging.</li>
                        <li>A picture of the actual item that was damaged.</li>
                    </ul>
                    <p>
                        Please note that compensation may not be offered if the aforementioned pictures are not provided.
                        Make sure to take the pictures first, and then discard the packaging. We appreciate your cooperation on this matter.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyModal;
