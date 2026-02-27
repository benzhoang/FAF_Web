import React, { useState } from 'react'
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

    const handleWithdraw = () => {
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
                            <div className="text-[11px] font-black text-emerald-400 uppercase tracking-widest font-mono">EXTRACTION_INITIATED</div>
                            <div className="text-[9px] font-mono text-slate-400 mt-1 uppercase tracking-widest leading-relaxed">
                                SIGNAL TRANSMITTED. EST PROCESSING: 1-3 CYCLES.
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-4xl px-4 py-12 relative z-10 w-full">
                {/* Header */}
                <div className="mb-8 pl-2">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest mb-6 transition-colors group"
                    >
                        <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        ABORT_AND_RETURN_TO_WALLET
                    </button>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-rose-900/50 to-indigo-900/50 border border-rose-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(225,29,72,0.2)]">
                            <svg className="w-6 h-6 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-white uppercase tracking-wider">WITHDRAW_FUNDS</h1>
                            <p className="text-[11px] font-mono text-rose-400/70 uppercase tracking-widest mt-1">Extract liquid assets to external gateway</p>
                        </div>
                    </div>
                </div>

                {/* Main Content Card */}
                <div className="rounded-2xl border p-8 bg-[#090e17]/80 backdrop-blur-md relative overflow-hidden shadow-2xl" style={{ borderColor: 'rgba(225,29,72,0.2)' }}>
                    {/* Cyber accents */}
                    <div className="absolute top-0 right-10 w-32 h-px bg-rose-400/50" />
                    <div className="absolute top-0 right-10 w-px h-8 bg-rose-400/50" />
                    <div className="absolute bottom-0 left-10 w-32 h-px bg-rose-400/50" />
                    <div className="absolute bottom-0 left-10 w-px h-8 bg-rose-400/50" />

                    <div className="space-y-8">
                        {/* Available Balance Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div className="text-[10px] font-black tracking-widest text-cyan-500 uppercase font-mono mb-2">
                                    AVAILABLE_LIQUIDITY
                                </div>
                                <div className="text-3xl font-black text-white font-mono tracking-tighter">
                                    ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </div>
                            </div>
                            <div className="h-12 w-12 rounded-xl bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.15)] shrink-0">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Withdrawal Amount Section */}
                        <div>
                            <label className="block text-[10px] font-black text-rose-400 uppercase tracking-widest font-mono mb-4">
                                EXTRACTION_VOLUME
                            </label>
                            <div className="relative group">
                                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-black text-slate-500 font-mono">$</span>
                                <input
                                    type="number"
                                    value={withdrawalAmount > 0 ? withdrawalAmount : ''}
                                    onChange={handleAmountChange}
                                    step="0.01"
                                    max={availableBalance}
                                    placeholder="0.00"
                                    className="w-full rounded-xl border border-slate-700 bg-[#02040a] px-5 pl-12 pr-24 py-4 text-xl font-black font-mono text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20 transition-all placeholder-slate-700"
                                />
                                <button
                                    onClick={handleMaxClick}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded bg-rose-900/30 border border-rose-500/50 px-3 py-1.5 text-[10px] font-black text-rose-400 hover:bg-rose-900/50 hover:text-rose-300 font-mono tracking-widest uppercase transition-colors"
                                >
                                    MAX_FILL
                                </button>
                            </div>
                        </div>

                        {/* Select Destination Section */}
                        <div>
                            <label className="block text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono mb-4">
                                DESTINATION_NODE
                            </label>
                            <div className="space-y-4">
                                {/* Visa Card Option */}
                                <button
                                    onClick={() => setSelectedDestination('visa-4242')}
                                    className={`w-full relative rounded-xl border p-5 text-left transition-all ${selectedDestination === 'visa-4242'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedDestination === 'visa-4242'
                                            ? 'border-cyan-500 bg-cyan-500/20'
                                            : 'border-slate-600 bg-transparent'
                                            }`}>
                                            {selectedDestination === 'visa-4242' && (
                                                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-10 w-16 rounded bg-gradient-to-r from-blue-700 to-blue-900 border border-blue-500/30 flex items-center justify-center shrink-0 shadow-inner">
                                                <span className="text-[11px] font-black italic text-white tracking-wider">VISA</span>
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-bold text-slate-200 uppercase tracking-wider font-mono">VISA_LINK_4242</div>
                                                <div className="text-[10px] font-mono text-slate-500 mt-1 tracking-widest uppercase">TTL: 12/25</div>
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Add New Method Option */}
                                <button
                                    onClick={() => setSelectedDestination('new')}
                                    className={`w-full relative rounded-xl border p-5 text-left transition-all ${selectedDestination === 'new'
                                        ? 'border-cyan-500 bg-cyan-900/10 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                                        : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex items-center gap-5">
                                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${selectedDestination === 'new'
                                            ? 'border-cyan-500 bg-cyan-500/20'
                                            : 'border-slate-600 bg-transparent'
                                            }`}>
                                            {selectedDestination === 'new' && (
                                                <div className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,1)]"></div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-4 flex-1">
                                            <div className="h-10 w-10 rounded bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-400">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <div className="text-[12px] font-bold text-slate-300 uppercase tracking-wider font-mono">NEW_ROUTING_TARGET</div>
                                                <div className="text-[10px] font-mono text-slate-500 mt-1 tracking-widest uppercase">ESTABLISH CONNECTION</div>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Withdrawal Summary Section */}
                        <div className="bg-[#02040a] rounded-xl border border-slate-800 p-6 space-y-4 font-mono">
                            <div className="flex items-center justify-between text-slate-400 text-[11px] uppercase tracking-widest">
                                <span>GROSS_EXTRACTION</span>
                                <span className="text-white">${withdrawalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex items-center justify-between text-rose-500/70 text-[11px] uppercase tracking-widest">
                                <span>NETWORK_TAX ({systemFeePercent}%)</span>
                                <span className="text-rose-400">-${systemFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                                <span className="text-[12px] font-black text-cyan-400 tracking-widest uppercase">NET_YIELD</span>
                                <span className="text-2xl font-black text-white">${netReceive.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                        </div>


                        {/* Request Withdrawal Button */}
                        <button
                            onClick={handleWithdraw}
                            disabled={withdrawalAmount <= 0 || withdrawalAmount > availableBalance}
                            className="w-full rounded-xl bg-gradient-to-r from-rose-700 to-indigo-700 hover:from-rose-600 hover:to-indigo-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:border-slate-700 disabled:shadow-none py-4 text-[12px] font-black tracking-widest font-mono text-white shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-rose-400/50 transition-all hover:scale-[1.02] flex items-center justify-center gap-3 uppercase"
                        >
                            EXECUTE_TRANSFER
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Processing Time Note */}
                        <div className="flex items-start gap-3 bg-indigo-900/10 border border-indigo-500/20 p-4 rounded-lg">
                            <svg className="w-5 h-5 mt-0.5 shrink-0 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] font-mono text-indigo-300 uppercase tracking-widest leading-relaxed">
                                TRANSMISSION DELAY: 1-3 CYCLES. LARGE ASSET TRANSFERS SUBJECT TO MANUAL VERIFICATION ALGORITHMS.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Withdrawpoint
