import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

const Wallet = () => {
    const navigate = useNavigate()
    const [selectedTab, setSelectedTab] = useState('All')
    const [selectedPackage, setSelectedPackage] = useState('Pro')
    const [customAmount, setCustomAmount] = useState('')
    const [withdrawAmount, setWithdrawAmount] = useState('')
    const [copied, setCopied] = useState(false)

    const user = useMemo(() => {
        try {
            const raw = localStorage.getItem('user')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }, [])

    const walletId = user?.walletId || 'faf_8823_xk92_mn44'
    const totalBalance = user?.walletBalance || 4500
    const usdBalance = (totalBalance * 0.01).toFixed(2)

    const transactions = [
        {
            id: 1,
            type: 'incoming',
            title: 'Project: Website Redesign',
            date: 'Oct 24, 2023 • 2:30 PM',
            amount: '+ 500 CRED',
            status: 'COMPLETED',
            statusColor: 'text-emerald-400',
            icon: 'down'
        },
        {
            id: 2,
            type: 'outgoing',
            title: 'Withdrawal to PayPal',
            date: 'Oct 23, 2023 • 9:15 AM',
            amount: '- 200 CRED',
            status: 'PENDING',
            statusColor: 'text-amber-400',
            icon: 'up'
        },
        {
            id: 3,
            type: 'outgoing',
            title: 'Platform Fee',
            date: 'Oct 23, 2023 • 9:15 AM',
            amount: '- 5 CRED',
            status: 'PROCESSED',
            statusColor: 'text-slate-500',
            icon: 'document'
        },
        {
            id: 4,
            type: 'incoming',
            title: 'Deposit from Visa •••• 4242',
            date: 'Oct 20, 2023 • 11:00 AM',
            amount: '+ 1,000 CRED',
            status: 'COMPLETED',
            statusColor: 'text-emerald-400',
            icon: 'plus'
        }
    ]

    const filteredTransactions = useMemo(() => {
        if (selectedTab === 'All') return transactions
        return transactions.filter(t => t.type === selectedTab.toLowerCase())
    }, [selectedTab])

    const copyWalletId = async () => {
        try {
            await navigator.clipboard.writeText(walletId)
            setCopied(true)
            setTimeout(() => {
                setCopied(false)
            }, 2000)
        } catch (err) {
            const textArea = document.createElement('textarea')
            textArea.value = walletId
            textArea.style.position = 'fixed'
            textArea.style.opacity = '0'
            document.body.appendChild(textArea)
            textArea.select()
            try {
                document.execCommand('copy')
                setCopied(true)
                setTimeout(() => {
                    setCopied(false)
                }, 2000)
            } catch (err) {
                console.error('Failed to copy:', err)
            }
            document.body.removeChild(textArea)
        }
    }

    const getTransactionIcon = (iconType) => {
        switch (iconType) {
            case 'down':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                )
            case 'up':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                )
            case 'document':
                return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                )
            case 'plus':
                return (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#020617] text-slate-300 relative font-sans">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 relative z-10 w-full">
                {/* Header */}
                <div className="mb-8 flex items-center gap-4">
                    <div className="h-12 w-12 flex items-center justify-center bg-cyan-900/40 border border-cyan-500/30 rounded xl">
                        <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-widest font-mono text-shadow-glow-cyan">WALLET_OVERVIEW</h1>
                        <p className="mt-1 text-[10px] text-cyan-500/70 font-mono tracking-widest uppercase">Manage network earnings, deposits, and routing targets</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Total Balance Card */}
                        <div className="rounded-2xl border p-8 bg-[#090e17]/80 backdrop-blur-md relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.1)]" style={{ borderColor: 'rgba(6,182,212,0.3)' }}>
                            <div className="absolute top-0 right-10 w-32 h-px bg-cyan-400/50" />
                            <div className="absolute overflow-hidden inset-0 pointer-events-none bg-gradient-to-br from-cyan-900/10 to-indigo-900/10" />

                            <div className="flex flex-col md:flex-row md:items-start justify-between relative z-10 gap-6">
                                <div>
                                    <div className="text-[10px] font-black text-cyan-500 font-mono uppercase tracking-widest mb-3">TOTAL_ASSET_VALUE</div>
                                    <div className="text-4xl md:text-5xl font-black text-white mb-2 font-mono tracking-tighter">
                                        {totalBalance.toLocaleString()} <span className="text-xl text-cyan-500 tracking-widest">CRED</span>
                                    </div>
                                    <div className="text-lg font-bold text-slate-400 font-mono">~ ${usdBalance} USD</div>

                                    <div className="mt-8 flex flex-wrap items-center gap-4">
                                        <div className="bg-[#02040a] border border-slate-800 rounded px-4 py-2 flex items-center gap-3 w-max">
                                            <div>
                                                <div className="text-[9px] font-black text-slate-500 mb-1 font-mono uppercase tracking-widest">WALLET_ID</div>
                                                <div className="text-[12px] font-mono font-bold text-slate-300">{walletId}</div>
                                            </div>
                                            <button
                                                onClick={copyWalletId}
                                                className="text-cyan-500 hover:text-cyan-400 transition-colors p-1.5 rounded hover:bg-cyan-900/30 active:scale-95"
                                                aria-label="Copy wallet ID"
                                                title={copied ? 'Copied!' : 'Copy wallet ID'}
                                            >
                                                {copied ? (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <span className="inline-flex items-center rounded bg-emerald-900/30 border border-emerald-500/30 px-3 py-1.5 text-[9px] font-black text-emerald-400 font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                            [OK] NETWORK_ACTIVE
                                        </span>
                                    </div>
                                </div>

                                <div className="hidden md:flex flex-col gap-3 shrink-0">
                                   <button 
                                      onClick={() => document.getElementById('buy-points-section').scrollIntoView({ behavior: 'smooth' })}
                                      className="px-6 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 text-cyan-400 text-[10px] font-black font-mono tracking-widest uppercase rounded flex items-center gap-2 transition-colors">
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
                                       ACQUIRE_FUNDS
                                   </button>
                                   <button 
                                    onClick={() => document.getElementById('withdraw-section').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-6 py-3 bg-[#02040a] hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] font-black font-mono tracking-widest uppercase rounded flex items-center gap-2 transition-colors">
                                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                       ROUTE_FUNDS
                                   </button>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="rounded-2xl border border-slate-800 bg-[#090e17] shadow-xl overflow-hidden relative">
                            <div className="px-6 py-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <h2 className="text-[12px] font-black text-white font-mono uppercase tracking-widest flex items-center gap-2">
                                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                    TRANSACTION_LOGS
                                </h2>
                                
                                {/* Tabs */}
                                <div className="flex bg-[#02040a] p-1 rounded border border-slate-800 w-max">
                                    {['All', 'Incoming', 'Outgoing'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedTab(tab)}
                                            className={`px-4 py-1.5 rounded text-[10px] font-black font-mono transition-colors uppercase tracking-widest ${selectedTab === tab
                                                ? 'bg-cyan-900/40 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                                : 'text-slate-500 border border-transparent hover:text-slate-300'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-6">
                                {/* Transactions List */}
                                <div className="space-y-4">
                                    {filteredTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="group flex flex-col sm:flex-row sm:items-center gap-4 rounded-xl border border-slate-800 bg-[#02040a] p-5 hover:border-cyan-500/30 transition-colors relative"
                                        >
                                            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-slate-800 group-hover:bg-cyan-500/50 transition-colors" />
                                            
                                            <div className={`shrink-0 flex h-10 w-10 items-center justify-center rounded border ${
                                                    transaction.icon === 'plus' ? 'bg-blue-900/20 text-blue-400 border-blue-500/30' : 
                                                    transaction.type === 'incoming' ? 'bg-emerald-900/20 text-emerald-400 border-emerald-500/30' : 
                                                    'bg-amber-900/20 text-amber-400 border-amber-500/30'
                                                }`}>
                                                {getTransactionIcon(transaction.icon)}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                                <div className="min-w-0 pr-4">
                                                    <div className="text-[12px] font-bold text-slate-200 truncate uppercase font-mono tracking-wider">
                                                        {transaction.title}
                                                    </div>
                                                    <div className="mt-1 text-[9px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                                                        {transaction.date}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0">
                                                    <div className={`text-lg font-black font-mono tracking-tighter ${transaction.type === 'incoming' ? 'text-emerald-400' : 'text-slate-300'
                                                        }`}>
                                                        {transaction.amount}
                                                    </div>
                                                    <div className={`mt-0.5 text-[9px] font-black font-mono uppercase tracking-widest ${transaction.statusColor}`}>
                                                        [{transaction.status}]
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 text-center">
                                    <button className="text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest items-center inline-flex gap-2 group">
                                        EXPAND_FULL_LEDGER
                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Buy Points Card */}
                        <div id="buy-points-section" className="rounded-2xl bg-[#090e17] border border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] pointer-events-none" />
                            
                            <div className="px-6 py-5 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded border border-cyan-500/30 bg-cyan-900/20 text-cyan-400 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-[12px] font-black text-white font-mono uppercase tracking-widest">ACQUIRE_CREDITS</h2>
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500 font-mono tracking-widest uppercase">Select volume tier to establish link</p>
                            </div>
                            
                            <div className="px-6 py-5 space-y-5">
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'Starter', label: 'TIER_1', points: '100C' },
                                        { id: 'Pro', label: 'TIER_2', points: '500C' },
                                        { id: 'Expert', label: 'TIER_3', points: '1000C' }
                                    ].map((pkg) => (
                                        <div key={pkg.id} className="relative">
                                            {pkg.id === 'Pro' && (
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 w-full text-center">
                                                    <span className="inline-flex rounded bg-cyan-500 px-1.5 py-0.5 text-[8px] font-black text-black font-mono tracking-widest">
                                                        REC
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setSelectedPackage(pkg.id)}
                                                className={`w-full rounded border px-2 py-3 text-center transition-colors relative overflow-hidden ${selectedPackage === pkg.id
                                                    ? 'border-cyan-500 bg-cyan-900/20 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                                    : 'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                                    }`}
                                            >
                                                {selectedPackage === pkg.id && <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 to-transparent pointer-events-none" />}
                                                <div className={`text-[9px] font-black uppercase tracking-wider font-mono ${selectedPackage === pkg.id ? 'text-cyan-400' : 'text-slate-400'}`}>{pkg.label}</div>
                                                <div className={`mt-1.5 text-sm font-black font-mono ${selectedPackage === pkg.id ? 'text-white' : 'text-slate-300'}`}>{pkg.points}</div>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-cyan-500 mb-2 font-mono uppercase tracking-widest">CUSTOM_VOLUME</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded-lg border border-slate-700 bg-[#02040a] px-4 py-3 pr-16 text-sm font-black font-mono text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-colors"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black font-mono text-slate-500 uppercase">CRED</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        const packagePoints = {
                                            'Starter': 100,
                                            'Pro': 500,
                                            'Expert': 1000
                                        }
                                        const points = customAmount ? parseInt(customAmount) : packagePoints[selectedPackage] || 500
                                        navigate('/deposit-points', { state: { points, package: selectedPackage } })
                                    }}
                                    className="w-full rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-4 py-4 text-[11px] font-black text-white transition-colors shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/50 uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                                >
                                    AUTHORIZE_PURCHASE
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Withdraw Funds Card */}
                        <div id="withdraw-section" className="rounded-2xl bg-[#090e17] border border-slate-800 shadow-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-[40px] pointer-events-none" />
                            
                            <div className="px-6 py-5 border-b border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded border border-rose-500/30 bg-rose-900/20 text-rose-400 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-[12px] font-black text-white font-mono uppercase tracking-widest">ROUTE_FUNDS_OUT</h2>
                                </div>
                                <p className="mt-2 text-[10px] text-slate-500 font-mono tracking-widest uppercase">Target external fiat gateways</p>
                            </div>
                            
                            <div className="px-6 py-5 space-y-5">
                                <div>
                                    <div className="text-[9px] font-black text-slate-500 mb-2 font-mono uppercase tracking-widest">LIQUIDITY_AVAILABLE</div>
                                    <div className="rounded border border-slate-800 bg-[#02040a] px-4 py-3 flex items-center justify-between">
                                        <div className="text-xl font-black text-rose-400 font-mono">{totalBalance.toLocaleString()}</div>
                                        <div className="text-[10px] text-slate-500 font-mono">CRED</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 mb-2 font-mono uppercase tracking-widest">EXTRACTION_AMOUNT</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="MIN LIMIT: 100 CRED"
                                        className="w-full rounded-lg border border-slate-700 bg-[#02040a] px-4 py-3 text-sm font-black font-mono text-white focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-colors uppercase placeholder-slate-700"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[9px] font-black text-slate-500 mb-2 font-mono uppercase tracking-widest">TARGET_NODE</label>
                                    <select className="w-full rounded-lg border border-slate-700 bg-[#02040a] px-4 py-3 text-[11px] font-black font-mono text-slate-300 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500/50 transition-colors uppercase appearance-none">
                                        <option>BANK_LINK [ **** 8821 ]</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between rounded bg-[#02040a] border border-slate-800 px-4 py-3 font-mono">
                                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">NETWORK_TAX</span>
                                    <span className="text-[11px] font-black text-white">$2.50 USD</span>
                                </div>

                                <button
                                    onClick={() => navigate('/withdraw-points')}
                                    className="w-full rounded-lg bg-gradient-to-r from-rose-700 to-indigo-700 hover:from-rose-600 hover:to-indigo-600 px-4 py-4 text-[11px] font-black text-white transition-colors shadow-[0_0_20px_rgba(225,29,72,0.3)] border border-rose-400/50 uppercase tracking-widest font-mono flex items-center justify-center gap-2"
                                >
                                    EXECUTE_TRANSFER
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                                </button>
                            </div>
                        </div>

                        {/* Need Help Section */}
                        <div className="rounded-xl border border-slate-800 bg-[#090e17] p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-900 group-hover:bg-cyan-500 transition-colors" />
                            <div className="flex flex-col gap-3 relative z-10 pl-2">
                                <div className="flex items-center gap-3">
                                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                    <div className="text-[11px] font-black text-white font-mono uppercase tracking-widest">SUPPORT_BEACON</div>
                                </div>
                                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase leading-relaxed">
                                    ROUTING ERRORS? PING SYSTEM ADMINISTRATORS FOR MANUAL RESOLUTION LOGS.
                                </p>
                                <button className="text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest self-start mt-2 border-b border-cyan-500/30 hover:border-cyan-400 pb-0.5 transition-colors">
                                    INITIATE_COMMS_LINK
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Minimal styling for custom scrollbars missing from utility class */}
            <style jsx="true">{`
              select {
                background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
                background-position: right 0.5rem center;
                background-repeat: no-repeat;
                background-size: 1.5em 1.5em;
              }
            `}</style>
        </div>
    )
}

export default Wallet
