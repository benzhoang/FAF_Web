import React from 'react';

const Step1SelectType = ({ selectedType, setSelectedType, onContinue, onCancel }) => {
    return (
        <div className="flex flex-col items-center">
            <div className="max-w-4xl w-full text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    What kind of job is it?
                </h1>
                <p className="text-sm text-gray-600">
                    Choose the workflow that best fits your needs. This determines how payments
                    and verification are handled.
                </p>
            </div>

            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                {/* Short-term Protected card */}
                <button
                    type="button"
                    onClick={() => setSelectedType('short-term')}
                    className={`text-left rounded-2xl border-2 p-6 transition-all bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 ${selectedType === 'short-term'
                        ? 'border-blue-600 ring-2 ring-blue-600/10'
                        : 'border-gray-200'
                        }`}
                >
                    <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                        <span className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                            <span
                                className={`w-2.5 h-2.5 rounded-full ${selectedType === 'short-term' ? 'bg-blue-600' : 'bg-transparent'
                                    }`}
                            />
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Short-term Protected
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Secure, milestone-based workflow for one-off projects and quick tasks.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>FAF Escrow Payment Protection</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>Automated Proof-of-Work Verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>Perfect for quick tasks or gigs</span>
                        </li>
                    </ul>
                </button>

                {/* Long-term Connection card */}
                <button
                    type="button"
                    onClick={() => setSelectedType('long-term')}
                    className={`text-left rounded-2xl border-2 p-6 transition-all bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 ${selectedType === 'long-term'
                        ? 'border-blue-600 ring-2 ring-blue-600/10'
                        : 'border-gray-200'
                        }`}
                >
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
                        <span className="w-5 h-5 rounded-lg border border-gray-500 flex items-center justify-center">
                            <span
                                className={`w-3 h-3 rounded-sm ${selectedType === 'long-term' ? 'bg-gray-700' : 'bg-transparent'
                                    }`}
                            />
                        </span>
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">
                        Long-term Connection
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Direct engagement model for recurring roles and ongoing partnerships.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>Direct hiring &amp; external payments</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>FAF acts as a specialized connector</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-blue-600 mt-0.5">✓</span>
                            <span>Ideal for full-time or recurring roles</span>
                        </li>
                    </ul>
                </button>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={onContinue}
                    className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-colors"
                >
                    Continue to Details
                </button>
                <button
                    onClick={onCancel}
                    className="text-xs text-gray-500 hover:text-gray-700 font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Step1SelectType;
