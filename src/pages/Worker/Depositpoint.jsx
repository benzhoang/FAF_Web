import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const Depositpoint = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const initialPoints = location.state?.points || 500

    const [points, setPoints] = useState(initialPoints)
    const [usdAmount, setUsdAmount] = useState(initialPoints)
    const [paymentMethod, setPaymentMethod] = useState('credit-card')
    const [processingFee, setProcessingFee] = useState(15.00)
    const [showToast, setShowToast] = useState(false)

    const exchangeRate = 1.00 // 1 Point = $1.00 USD

    useEffect(() => {
        // Calculate USD amount when points change
        setUsdAmount(points)
    }, [points])

    const handlePointsChange = (e) => {
        const value = parseInt(e.target.value) || 0
        setPoints(value)
    }

    const handleUsdChange = (e) => {
        const value = parseFloat(e.target.value) || 0
        setUsdAmount(value)
        setPoints(Math.round(value / exchangeRate))
    }

    const subtotal = points * exchangeRate
    const totalDue = subtotal + processingFee

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
                            <div className="text-sm font-extrabold text-gray-900">Payment Successful!</div>
                            <div className="text-xs font-semibold text-gray-500 mt-0.5">
                                {points} points have been added to your account.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate('/wallet')}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Wallet
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-extrabold text-gray-900">Deposit Points</h1>
                            <p className="text-sm text-gray-600 mt-0.5">Add funds to your FAF account securely to unlock premium features.</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                    <div className="px-6 py-6 space-y-6">
                        {/* Amount to Deposit Section */}
                        <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-3">Amount to Deposit</label>
                            <div className="flex items-center gap-3">
                                <div className="flex-1">
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={points}
                                            onChange={handlePointsChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-16 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">POINTS</span>
                                    </div>
                                </div>
                                <div className="text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">$</span>
                                        <input
                                            type="number"
                                            value={usdAmount.toFixed(2)}
                                            onChange={handleUsdChange}
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 pl-8 py-3 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                        />
                                    </div>
                                </div>
                            </div>
                            <p className="mt-2 text-xs font-semibold text-blue-600">
                                • Exchange Rate: 1 Point = ${exchangeRate.toFixed(2)} USD
                            </p>
                        </div>

                        {/* Select Payment Method Section */}
                        <div>
                            <label className="block text-xs font-extrabold text-gray-700 mb-3">Select Payment Method</label>
                            <div className="grid grid-cols-2 gap-3">
                                {/* Credit Card Option */}
                                <button
                                    onClick={() => setPaymentMethod('credit-card')}
                                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${paymentMethod === 'credit-card'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    {paymentMethod === 'credit-card' && (
                                        <div className="absolute top-2 right-2">
                                            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === 'credit-card' ? 'bg-blue-600' : 'bg-gray-100'
                                            }`}>
                                            <svg className={`w-5 h-5 ${paymentMethod === 'credit-card' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className={`text-sm font-extrabold ${paymentMethod === 'credit-card' ? 'text-gray-900' : 'text-gray-700'}`}>
                                                Credit Card
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500 mt-0.5">Instant deposit</div>
                                        </div>
                                    </div>
                                </button>

                                {/* PayPal Option */}
                                <button
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`relative rounded-xl border-2 p-4 text-left transition-all ${paymentMethod === 'paypal'
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                        }`}
                                >
                                    {paymentMethod === 'paypal' && (
                                        <div className="absolute top-2 right-2">
                                            <div className="h-5 w-5 rounded-full bg-blue-600 flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${paymentMethod === 'paypal' ? 'bg-blue-600' : 'bg-gray-100'
                                            }`}>
                                            <svg className={`w-5 h-5 ${paymentMethod === 'paypal' ? 'text-white' : 'text-gray-600'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.805.805 0 0 0-.606-.274h-3.01c-.524 0-.968.382-1.05.9l-1.12 7.106c-.082.518.109.74.633.74h1.47c.524 0 .968-.382 1.05-.9l1.12-7.106a.805.805 0 0 0 .023-.166z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className={`text-sm font-extrabold ${paymentMethod === 'paypal' ? 'text-gray-900' : 'text-gray-700'}`}>
                                                PayPal
                                            </div>
                                            <div className="text-xs font-semibold text-gray-500 mt-0.5">Connect account</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="border-t border-dashed border-gray-200 pt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-600">Subtotal ({points} Points)</span>
                                <span className="text-sm font-extrabold text-gray-900">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-600">Processing Fee</span>
                                    <button className="text-gray-400 hover:text-gray-600" title="Processing fee information">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </button>
                                </div>
                                <span className="text-sm font-extrabold text-gray-900">${processingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                                <div>
                                    <div className="text-base font-extrabold text-gray-900">Total Due</div>
                                    <div className="text-xs font-semibold text-gray-500 mt-0.5">Includes all taxes</div>
                                </div>
                                <span className="text-2xl font-extrabold text-gray-900">${totalDue.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={() => {
                                // Simulate successful payment
                                // In a real app, you would make an API call here to process the payment
                                setShowToast(true)
                                setTimeout(() => {
                                    navigate('/wallet')
                                }, 2000) // Navigate after 2 seconds
                            }}
                            className="w-full rounded-xl bg-blue-600 px-4 py-4 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            Pay ${totalDue.toFixed(2)} & Deposit
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>

                        {/* Security Message */}
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>Payments processed securely via Stripe</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Depositpoint
