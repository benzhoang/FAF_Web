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
            amount: '+ 500 pts',
            status: 'Completed',
            statusColor: 'text-emerald-600',
            icon: 'down'
        },
        {
            id: 2,
            type: 'outgoing',
            title: 'Withdrawal to PayPal',
            date: 'Oct 23, 2023 • 9:15 AM',
            amount: '- 200 pts',
            status: 'Pending',
            statusColor: 'text-orange-600',
            icon: 'up'
        },
        {
            id: 3,
            type: 'outgoing',
            title: 'Platform Fee',
            date: 'Oct 23, 2023 • 9:15 AM',
            amount: '- 5 pts',
            status: 'Processed',
            statusColor: 'text-gray-600',
            icon: 'document'
        },
        {
            id: 4,
            type: 'incoming',
            title: 'Deposit from Visa •••• 4242',
            date: 'Oct 20, 2023 • 11:00 AM',
            amount: '+ 1,000 pts',
            status: 'Completed',
            statusColor: 'text-emerald-600',
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
            // Fallback for older browsers
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
                    <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center">
                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-extrabold text-gray-900">Wallet Overview</h1>
                    <p className="mt-1 text-sm text-gray-600">Manage earnings, top-ups, and payout methods securely.</p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Column */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Total Balance Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="text-sm font-semibold text-blue-100 mb-2">Total Balance</div>
                                    <div className="text-4xl font-extrabold mb-1">{totalBalance.toLocaleString()} pts</div>
                                    <div className="text-lg font-semibold text-blue-100">${usdBalance} USD</div>

                                    <div className="mt-6 flex items-center gap-3">
                                        <div>
                                            <div className="text-xs font-semibold text-blue-100 mb-1">WALLET ID</div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-mono font-semibold">{walletId}</span>
                                                <button
                                                    onClick={copyWalletId}
                                                    className="text-blue-100 hover:text-white transition-colors cursor-pointer p-1 rounded hover:bg-white/10 active:scale-95"
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
                                        </div>
                                        <span className="inline-flex items-center rounded-full bg-emerald-500/20 border border-emerald-300/30 px-3 py-1 text-xs font-extrabold text-emerald-100">
                                            Active Status
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Transactions */}
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h2 className="text-sm font-extrabold text-gray-900">Recent Transactions</h2>
                            </div>
                            <div className="px-6 pt-4">
                                {/* Tabs */}
                                <div className="flex gap-2 mb-4">
                                    {['All', 'Incoming', 'Outgoing'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setSelectedTab(tab)}
                                            className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-colors ${selectedTab === tab
                                                ? 'bg-gray-900 text-white'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {tab}
                                        </button>
                                    ))}
                                </div>

                                {/* Transactions List */}
                                <div className="space-y-3 pb-6">
                                    {filteredTransactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
                                        >
                                            <div className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl ${transaction.icon === 'plus'
                                                ? 'bg-blue-50 text-blue-600'
                                                : transaction.type === 'incoming'
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {getTransactionIcon(transaction.icon)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-extrabold text-gray-900 truncate">
                                                            {transaction.title}
                                                        </div>
                                                        <div className="mt-1 text-xs font-semibold text-gray-500">
                                                            {transaction.date}
                                                        </div>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <div className={`text-sm font-extrabold ${transaction.type === 'incoming' ? 'text-emerald-600' : 'text-gray-900'
                                                            }`}>
                                                            {transaction.amount}
                                                        </div>
                                                        <div className={`mt-1 text-xs font-semibold ${transaction.statusColor}`}>
                                                            {transaction.status}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="pb-4">
                                    <button className="text-sm font-extrabold text-blue-600 hover:text-blue-700 transition-colors">
                                        View All Transactions →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Buy Points Card */}
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <h2 className="text-sm font-extrabold text-gray-900">Buy Points</h2>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Instant deposit via Card or Bank</p>
                            </div>
                            <div className="px-6 py-5 space-y-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        { id: 'Starter', label: 'Starter', points: '+100' },
                                        { id: 'Pro', label: 'Pro', points: '+500' },
                                        { id: 'Expert', label: 'Expert', points: '+1k' }
                                    ].map((pkg) => (
                                        <div key={pkg.id} className="relative">
                                            {pkg.id === 'Pro' && (
                                                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-10">
                                                    <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-extrabold text-white">
                                                        POPULAR
                                                    </span>
                                                </div>
                                            )}
                                            <button
                                                onClick={() => setSelectedPackage(pkg.id)}
                                                className={`w-full rounded-xl border-2 px-3 py-3 text-xs font-extrabold transition-colors ${selectedPackage === pkg.id
                                                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div>{pkg.label}</div>
                                                <div className="mt-1 text-[10px]">{pkg.points}</div>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-gray-700 mb-2">Custom Amount</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => setCustomAmount(e.target.value)}
                                            placeholder="0"
                                            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                        />
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">pts</span>
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
                                    className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-blue-700 transition-colors"
                                >
                                    Proceed to Payment →
                                </button>

                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>Payments processed securely</span>
                                </div>
                            </div>
                        </div>

                        {/* Withdraw Funds Card */}
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-sm font-extrabold text-gray-900">Withdraw Funds</h2>
                                </div>
                                <p className="mt-1 text-xs text-gray-500">Transfer earnings to your account</p>
                            </div>
                            <div className="px-6 py-5 space-y-4">
                                <div>
                                    <div className="text-xs font-extrabold text-gray-700 mb-2">Available to withdraw</div>
                                    <div className="rounded-xl bg-blue-50 border border-blue-100 px-4 py-3">
                                        <div className="text-lg font-extrabold text-blue-700">{totalBalance.toLocaleString()} pts</div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-gray-700 mb-2">Amount</label>
                                    <input
                                        type="number"
                                        value={withdrawAmount}
                                        onChange={(e) => setWithdrawAmount(e.target.value)}
                                        placeholder="Minimum 100 pts"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-extrabold text-gray-700 mb-2">Destination</label>
                                    <select className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20">
                                        <option>Bank Account (**** 8821)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
                                    <span className="text-xs font-extrabold text-gray-700">Transaction Fee</span>
                                    <span className="text-sm font-extrabold text-gray-900">$2.50 USD</span>
                                </div>

                                <button
                                    onClick={() => navigate('/withdraw-points')}
                                    className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-extrabold text-white hover:bg-gray-800 transition-colors"
                                >
                                    Request Withdrawal
                                </button>
                            </div>
                        </div>

                        {/* Need Help Section */}
                        <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-6">
                            <div className="flex items-start gap-3">
                                <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <div className="text-sm font-extrabold text-gray-900 mb-1">Need help?</div>
                                    <p className="text-xs text-gray-600 mb-3">
                                        If you have any issues with payments, contact our billing support.
                                    </p>
                                    <button className="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors">
                                        Contact Support →
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Wallet
