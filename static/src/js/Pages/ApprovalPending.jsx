import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function ApprovalPending() {
    return (
        <>
            <Head title="Approval Pending" />
            <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
                <h1 className="text-3xl font-semibold mb-4">Approval Pending</h1>
                <p className="text-gray-700 mb-2">
                    Your email has been successfully confirmed.<br />
                    Your account is now awaiting administrative approval.
                </p>
                <p className="text-gray-700 mb-6">
                    You will receive an email notification once your account has been approved.
                </p>
                <Link
                    href="/accounts/login/"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Login
                </Link>
            </div>
        </>
    );
}
