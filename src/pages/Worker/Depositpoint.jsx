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

    const handlePayment = () => {
        setShowToast(true)
        setTimeout(() => {
            navigate('/wallet')
        }, 2000)
    }

    return (
        <div className="w-full min-h-screen bg-[#020617] text-slate-300 relative flex flex-col font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            {/* Toast Notification */}
            {showToast && (
                <div className="fixed top-4 right-4 z-50 animate-[slideInRight_0.3s_ease-out]">
                    <div className="bg-[#090e17] rounded-xl shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-500/40 p-4 flex items-center gap-4 min-w-[320px] relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />
                        <div className="h-10 w-10 rounded-lg bg-emerald-900/40 border border-emerald-500/50 flex flex-col items-center justify-center shrink-0">
                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1">
                            <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest font-mono">TRANSACTION_SUCCESS</div>
                            <div className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">
                                +{points} CREDITS ADDED TO WALLET
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-12 relative z-10">
                {/* Header */}
                <div className="mb-8 pl-2">
                    <button
                        onClick={() => navigate('/wallet')}
                        className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest mb-6 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ABORT_AND_RETURN_TO_WALLET
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                            <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wider">ACQUIRE_FUNDS</h1>
                            <p className="text-[11px] font-mono text-cyan-500/70 uppercase tracking-widest mt-1">Initiate secure currency exchange to FAF_CREDITS</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl border p-8 bg-[#090e17]/80 backdrop-blur-md relative overflow-hidden shadow-2xl" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                    {/* Cyber accents */}
                    <div className="absolute top-0 right-10 w-32 h-px bg-cyan-400/50" />
                    <div className="absolute top-0 right-10 w-px h-8 bg-cyan-400/50" />
                    <div className="absolute bottom-0 left-10 w-32 h-px bg-cyan-400/50" />
                    <div className="absolute bottom-0 left-10 w-px h-8 bg-cyan-400/50" />

                    <div className="space-y-8">
                        {/* Amount Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 relative">
                            <div className="absolute -left-px top-6 bottom-6 w-0.5 bg-cyan-500" />
                            <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono mb-4">EXCHANGE_VOLUME</label>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 w-full relative group">
                                    <input
                                        type="number"
                                        value={points}
                                        onChange={handlePointsChange}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 pl-16 text-lg font-black font-mono text-cyan-300 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/20 transition-all text-right"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-cyan-500 font-mono tracking-widest bg-cyan-900/30 px-2 py-1 rounded">CREDITS</span>
                                </div>
                                
                                <div className="text-cyan-500/50 shrink-0 rotate-90 md:rotate-0">
                                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                    </svg>
                                </div>
                                
                                <div className="flex-1 w-full relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-emerald-500 font-mono tracking-widest bg-emerald-900/30 px-2 py-1 rounded">USD</span>
                                    <input
                                        type="number"
                                        value={usdAmount.toFixed(2)}
                                        onChange={handleUsdChange}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 pl-[4.5rem] text-lg font-black font-mono text-emerald-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-right"
                                    />
                                </div>
                            </div>
                            <p className="mt-3 text-[10px] font-mono font-black text-slate-500 tracking-widest uppercase">
                                RATE: 1_CREDIT = ${exchangeRate.toFixed(2)}_USD
                            </p>
                        </div>

                        {/* Payment Method Section */}
                        <div>
                            <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono mb-4">PAYMENT_GATEWAY</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Credit Card Option */}
                                <button
                                    onClick={() => setPaymentMethod('credit-card')}
                                    className={`relative rounded-xl border p-4 text-left transition-all ${paymentMethod === 'credit-card'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    {paymentMethod === 'credit-card' && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded border flex items-center justify-center transition-colors ${paymentMethod === 'credit-card' ? 'bg-cyan-500/10 border-cyan-500/50' : 'bg-slate-900 border-slate-700'}`}>
                                            <svg className={`w-5 h-5 ${paymentMethod === 'credit-card' ? 'text-cyan-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black tracking-widest uppercase font-mono text-slate-200">
                                                CREDIT_CARD
                                            </div>
                                            <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">INSTANT_PROCESS</div>
                                        </div>
                                    </div>
                                </button>

                                {/* PayPal Option */}
                                <button
                                    onClick={() => setPaymentMethod('paypal')}
                                    className={`relative rounded-xl border p-4 text-left transition-all ${paymentMethod === 'paypal'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    {paymentMethod === 'paypal' && (
                                        <div className="absolute top-3 right-3">
                                            <div className="h-4 w-4 rounded-full bg-cyan-500 flex items-center justify-center">
                                                <svg className="w-2.5 h-2.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className={`h-10 w-10 rounded border flex items-center justify-center transition-colors ${paymentMethod === 'paypal' ? 'bg-blue-600/20 border-blue-500/50' : 'bg-slate-900 border-slate-700'}`}>
                                            <svg className={`w-5 h-5 ${paymentMethod === 'paypal' ? 'text-blue-400' : 'text-slate-500'}`} fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.805.805 0 0 0-.606-.274h-3.01c-.524 0-.968.382-1.05.9l-1.12 7.106c-.082.518.109.74.633.74h1.47c.524 0 .968-.382 1.05-.9l1.12-7.106a.805.805 0 0 0 .023-.166z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-[11px] font-black tracking-widest uppercase font-mono text-slate-200">
                                                PAYPAL_NET
                                            </div>
                                            <div className="text-[9px] font-mono text-slate-500 mt-1 uppercase tracking-widest">OAUTH_CONNECT</div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Order Summary Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 space-y-4 font-mono">
                            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-widest">
                                <span>SUBTOTAL ({points}_CRED)</span>
                                <span className="text-white">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-widest">
                                <span>NETWORK_FEE</span>
                                <span className="text-white">${processingFee.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <div>
                                    <div className="text-[12px] font-black text-cyan-400 tracking-widest uppercase">TRANSACTION_TOTAL</div>
                                </div>
                                <span className="text-2xl font-black text-white">${totalDue.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Pay Button */}
                        <button
                            onClick={handlePayment}
                            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 py-4 text-[12px] font-black tracking-widest font-mono text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 uppercase"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            AUTHORIZE_PAYMENT [ ${totalDue.toFixed(2)} ]
                        </button>

                        {/* Security Message */}
                        <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>SECURE_ENCRYPTED_GATEWAY_STRIPE</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Depositpoint
