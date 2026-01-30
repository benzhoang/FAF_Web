import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const Withdrawpoint = () => {
    const navigate = useNavigate()
    const [withdrawalAmount, setWithdrawalAmount] = useState(1000.00)
    const [selectedDestination, setSelectedDestination] = useState('visa-4242')
    const [showToast, setShowToast] = useState(false)

    const availableBalance = 1250.00
    const systemFeePercent = 5
    const systemFee = (withdrawalAmount * systemFeePercent) / 100
    const netReceive = withdrawalAmount - systemFee

    const handleMaxClick = () => {
        setWithdrawalAmount(availableBalance)
    }

    const handleAmountChange = (e) => {
        const value = parseFloat(e.target.value) || 0
        if (value <= availableBalance) {
            setWithdrawalAmount(value)
        }
    }

    return (
        <div className="w-full min-h-screen bg-blue-100">
            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-slide-in">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center gap-3 min-w-[320px]">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-sm font-extrabold text-gray-900">Withdrawal Request Successful!</div>
                            <div className="text-xs font-semibold text-gray-500 mt-0.5">
                                Your withdrawal request has been submitted. Processing time: 1-3 business days.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Wallet
                    </button>
                    <div>
                        <h1 className="text-2xl font-extrabold text-gray-900">Withdraw Funds</h1>
                        <p className="text-sm text-gray-600 mt-0.5">Transfer earnings to your preferred method.</p>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="px-6 py-6 space-y-6">
                        {/* Available Balance Section */}
                        <div>
                            <div className="text-xs font-extrabold tracking-wide text-blue-600 uppercase mb-2">
                                Available Balance
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-3xl font-extrabold text-gray-900">
                                    ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                                <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Withdrawal Amount Section */}
                        <div>
                            <label className="block text-xs font-extrabold tracking-wide text-gray-700 uppercase mb-3">
                                Withdrawal Amount
                            </label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">$</span>
                                <input
                                    type="number"
                                    value={withdrawalAmount.toFixed(2)}
                                    onChange={handleAmountChange}
                                    step="0.01"
                                    max={availableBalance}
                                    className="w-full rounded-xl border border-gray-200 bg-white px-4 pl-8 pr-20 py-3 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                />
                                <button
                                    onClick={handleMaxClick}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-blue-700 transition-colors"
                                >
                                    MAX
                                </button>
                            </div>
                        </div>

                        {/* Withdrawal Summary Section */}
                        <div className="border-t border-gray-200 pt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600">Requested Amount</span>
                                <span className="text-sm font-extrabold text-gray-900">
                                    ${withdrawalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-600">System Fee ({systemFeePercent}%)</span>
                                    <button className="text-gray-400 hover:text-gray-600" title="System fee information">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-sm font-extrabold text-red-600">
                                    -${systemFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <span className="text-base font-extrabold text-gray-900">Net Receive</span>
                                <span className="text-xl font-extrabold text-blue-600">
                                    ${netReceive.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </span>
                            </div>
                        </div>

                        {/* Select Destination Section */}
                        <div>
                            <label className="block text-xs font-extrabold tracking-wide text-gray-700 uppercase mb-3">
                                Select Destination
                            </label>
                            <div className="space-y-3">
                                {/* Visa Card Option */}
                                <button
                                    onClick={() => setSelectedDestination('visa-4242')}
                                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedDestination === 'visa-4242'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedDestination === 'visa-4242'
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            {selectedDestination === 'visa-4242' && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="h-10 w-16 rounded-lg bg-blue-600 flex items-center justify-center">
                                                <span className="text-xs font-extrabold text-white">VISA</span>
                                            </div>
                                            <div>
                                                <div className="text-sm font-extrabold text-gray-900">Visa ending in 4242</div>
                                                <div className="text-xs font-semibold text-gray-500 mt-0.5">Expires 12/25</div>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Add New Method Option */}
                                <button
                                    onClick={() => setSelectedDestination('new')}
                                    className={`w-full rounded-xl border-2 p-4 text-left transition-all ${selectedDestination === 'new'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedDestination === 'new'
                                            ? 'border-blue-600 bg-blue-600'
                                            : 'border-gray-300 bg-white'
                                            }`}>
                                            {selectedDestination === 'new' && (
                                                <div className="h-2 w-2 rounded-full bg-white"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-sm font-extrabold text-gray-900">Add new withdrawal method</div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Request Withdrawal Button */}
                        <button
                            onClick={() => {
                                // Simulate successful withdrawal request
                                // In a real app, you would make an API call here
                                setShowToast(true)
                                setTimeout(() => {
                                    navigate('/wallet')
                                }, 2000) // Navigate after 2 seconds
                            }}
                            className="w-full rounded-xl bg-blue-600 px-4 py-4 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Request Withdrawal
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>

                        {/* Processing Time Note */}
                        <div className="flex items-start gap-2 text-xs text-gray-500">
                            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Processing time: 1-3 business days. Large withdrawals may require additional verification.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Withdrawpoint
