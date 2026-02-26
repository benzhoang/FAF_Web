import React from "react";
import ManagerSidebar from "../../components/ManagerSidebar";

const Finances = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <ManagerSidebar />

            <main className="flex-1 p-8">
                {/* Header */}
                <header className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Financial Trends</h1>
                        <p className="text-gray-500 mt-1">
                            Overview of platform revenue, deposits, withdrawals, and fee collection.
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
                            Export PDF
                        </button>
                        <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700">
                            Export CSV
                        </button>
                    </div>
                </header>

                {/* Top summary cards */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    {/* Total Deposits */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Total Deposits
                            </span>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                +8.3% vs last mo
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">$1,245,000.00</p>
                    </div>

                    {/* Total Withdrawals */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Total Withdrawals
                            </span>
                            <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
                                +2.1% vs last mo
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">$820,000.00</p>
                    </div>

                    {/* Total Revenue */}
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-3">
                            <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-semibold">
                                5%
                            </span>
                            <span className="text-xs font-semibold text-blue-700 bg-white/70 px-2 py-0.5 rounded-full">
                                +12.4% vs last mo
                            </span>
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-blue-700 mb-1">
                                Total Revenue (5% Fee)
                            </p>
                            <p className="text-2xl font-bold text-blue-700">$62,250.00</p>
                        </div>
                    </div>
                </section>

                {/* Charts section */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Revenue Growth (Line chart style) */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Revenue Growth</h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Weekly revenue performance over the last 6 weeks.
                                </p>
                            </div>
                            <span className="text-xs text-gray-500">USD</span>
                        </div>
                        {/* Simple SVG line chart mock */}
                        <div className="h-56">
                            <svg viewBox="0 0 400 160" className="w-full h-full">
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#2563eb" stopOpacity="0.18" />
                                        <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                {/* Area */}
                                <path
                                    d="M0 110 C 50 80, 90 90, 140 70 C 190 100, 230 60, 280 90 C 320 140, 360 80, 400 120 L 400 160 L 0 160 Z"
                                    fill="url(#revenueGradient)"
                                />
                                {/* Line */}
                                <path
                                    d="M0 110 C 50 80, 90 90, 140 70 C 190 100, 230 60, 280 90 C 320 140, 360 80, 400 120"
                                    fill="none"
                                    stroke="#2563eb"
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                />
                                {/* Example peak point */}
                                <g transform="translate(230,60)">
                                    <circle r="5" fill="#2563eb" />
                                    <rect
                                        x="-40"
                                        y="-40"
                                        width="80"
                                        height="26"
                                        rx="6"
                                        fill="white"
                                        stroke="#e5e7eb"
                                    />
                                    <text
                                        x="0"
                                        y="-24"
                                        textAnchor="middle"
                                        className="text-[10px]"
                                        fill="#111827"
                                    >
                                        $8,420.00
                                    </text>
                                    <text
                                        x="0"
                                        y="-12"
                                        textAnchor="middle"
                                        className="text-[9px]"
                                        fill="#6b7280"
                                    >
                                        June 26
                                    </text>
                                </g>
                            </svg>
                        </div>
                        {/* X axis labels */}
                        <div className="flex justify-between text-[11px] text-gray-400 mt-3 px-1">
                            <span>Jun 01</span>
                            <span>Jun 10</span>
                            <span>Jun 20</span>
                            <span>Jun 30</span>
                        </div>
                    </div>

                    {/* Cash Flow Volume (Bar chart style) */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h2 className="text-sm font-semibold text-gray-900">Cash Flow Volume</h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Comparison of deposits vs withdrawals.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-green-500" />
                                    Dep
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] text-gray-500">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    Wd
                                </span>
                            </div>
                        </div>

                        <div className="h-56 flex items-end justify-between gap-3 px-2">
                            {["W1", "W2", "W3", "W4"].map((label, idx) => (
                                <div key={label} className="flex flex-col items-center gap-2 flex-1">
                                    <div className="flex items-end gap-1 w-full justify-center">
                                        <div
                                            className={`w-3 rounded-full bg-green-500 ${["h-16", "h-24", "h-10", "h-20"][idx]
                                                }`}
                                        />
                                        <div
                                            className={`w-3 rounded-full bg-blue-500 ${["h-14", "h-18", "h-8", "h-24"][idx]
                                                }`}
                                        />
                                    </div>
                                    <span className="text-[11px] text-gray-400">{label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* System Activity table */}
                <section className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">System Activity</h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Latest financial transactions on the platform.
                            </p>
                        </div>
                        <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                            View All Logs
                        </button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 text-xs text-gray-500">
                                    <th className="py-2 text-left font-medium">Status</th>
                                    <th className="py-2 text-left font-medium">User</th>
                                    <th className="py-2 text-left font-medium">Action</th>
                                    <th className="py-2 text-right font-medium">Amount</th>
                                    <th className="py-2 text-right font-medium">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-3">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                                                AF
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Alice Freeman</p>
                                                <p className="text-xs text-gray-500">Job Milestone Deposit</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-gray-600">Deposit</td>
                                    <td className="py-3 text-right font-semibold text-emerald-600">+ $500.00</td>
                                    <td className="py-3 text-right text-xs text-gray-500">3 min ago</td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-50">
                                            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">
                                                MC
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Marcus Chen</p>
                                                <p className="text-xs text-gray-500">Freelancer Withdrawal</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-gray-600">Withdrawal</td>
                                    <td className="py-3 text-right font-semibold text-red-600">- $250.00</td>
                                    <td className="py-3 text-right text-xs text-gray-500">5 min ago</td>
                                </tr>
                                <tr>
                                    <td className="py-3">
                                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-50">
                                            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">
                                                JD
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">Jessica Drew</p>
                                                <p className="text-xs text-gray-500">Platform Fee</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-gray-600">Fee Collected</td>
                                    <td className="py-3 text-right font-semibold text-emerald-600">+ $32.50</td>
                                    <td className="py-3 text-right text-xs text-gray-500">12 min ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Finances;
