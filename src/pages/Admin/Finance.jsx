import React from 'react';
import AdminSidebar from '../../components/AdminSidebar';

const Finance = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Escrow &amp; Finance</h1>
                            <p className="mt-1 text-sm text-gray-500">
                                Quản lý dòng tiền, điểm thưởng và các tranh chấp liên quan đến thanh toán trên nền tảng.
                            </p>
                        </div>

                        <div className="inline-flex items-center rounded-full bg-white p-1 text-xs font-medium text-gray-600 shadow-sm border border-gray-200">
                            <button className="rounded-full bg-blue-600 px-4 py-1.5 text-white shadow-sm">
                                Real-time
                            </button>
                            <button className="rounded-full px-4 py-1.5 hover:text-gray-900">
                                Last 24h
                            </button>
                            <button className="rounded-full px-4 py-1.5 hover:text-gray-900">
                                7 Days
                            </button>
                        </div>
                    </div>

                    {/* Top stats */}
                    <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {/* Points in Circulation */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Points in Circulation
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">1,450,200</p>
                            <div className="mt-2 flex items-center gap-1 text-xs">
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600 font-semibold">
                                    +5.2%
                                </span>
                                <span className="text-gray-500">so với tháng trước</span>
                            </div>
                        </div>

                        {/* Locked in Escrow */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Locked in Escrow
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">45,000</p>
                            <div className="mt-2 flex items-center gap-1 text-xs">
                                <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-amber-600 font-semibold">
                                    +12.5%
                                </span>
                                <span className="text-gray-500">job đang chờ xử lý</span>
                            </div>
                        </div>

                        {/* Active Disputes */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Active Disputes
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">12</p>
                            <div className="mt-2 flex items-center gap-1 text-xs">
                                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 font-semibold">
                                    0%
                                </span>
                                <span className="text-gray-500">không đổi</span>
                            </div>
                        </div>

                        {/* Avg Resolution Time */}
                        <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-200">
                            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                Avg Resolution Time
                            </p>
                            <p className="mt-2 text-2xl font-bold text-gray-900">4.2h</p>
                            <div className="mt-2 flex items-center gap-1 text-xs">
                                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-600 font-semibold">
                                    -15%
                                </span>
                                <span className="text-gray-500">nhanh hơn</span>
                            </div>
                        </div>
                    </div>

                    {/* Middle section: Summary + Urgent attention */}
                    <div className="mb-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        {/* Points movement summary with chart */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200 flex flex-col justify-between">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-900">Points Movement Summary</h2>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Tổng quan Inflow vs Outflow trong 30 ngày gần nhất. Thay biểu đồ bằng số liệu tóm tắt.
                                    </p>
                                </div>
                                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                    Full report &rarr;
                                </button>
                            </div>

                            {/* Line chart giống hình minh họa */}
                            <div className="mt-4 rounded-xl bg-[#020617] px-4 pt-4 pb-3 border border-slate-800">
                                <div className="mb-3 flex items-center justify-between text-[11px] text-slate-400">
                                    <span>Points movement</span>
                                    <div className="flex items-center gap-3">
                                        <span className="inline-flex items-center gap-1">
                                            <span className="h-1 w-5 rounded-full bg-emerald-400" />
                                            <span>Inflow</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <span className="h-1 w-5 rounded-full border border-slate-500 border-dashed" />
                                            <span>Outflow</span>
                                        </span>
                                    </div>
                                </div>

                                <div className="h-32">
                                    <svg viewBox="0 0 400 140" className="h-full w-full">
                                        {/* gradient fill */}
                                        <defs>
                                            <linearGradient id="pointsArea" x1="0" x2="0" y1="0" y2="1">
                                                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.25" />
                                                <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* area under main line */}
                                        <path
                                            d="M0 90 C 60 60, 110 70, 160 45 C 210 80, 260 70, 310 95 C 350 120, 380 70, 400 40 L 400 140 L 0 140 Z"
                                            fill="url(#pointsArea)"
                                        />

                                        {/* dashed comparison line */}
                                        <path
                                            d="M0 100 C 60 85, 110 88, 160 75 C 210 95, 260 90, 310 100 C 350 110, 380 95, 400 85"
                                            fill="none"
                                            stroke="#4b5563"
                                            strokeWidth="2"
                                            strokeDasharray="6 6"
                                            strokeLinecap="round"
                                        />

                                        {/* main teal line */}
                                        <path
                                            d="M0 90 C 60 60, 110 70, 160 45 C 210 80, 260 70, 310 95 C 350 120, 380 70, 400 40"
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                        />

                                        {/* vertical hover line + tooltip point (May 16) */}
                                        <g>
                                            {/* x ≈ 160 (giữa biểu đồ) */}
                                            <line
                                                x1="160"
                                                y1="20"
                                                x2="160"
                                                y2="130"
                                                stroke="#1e293b"
                                                strokeWidth="1"
                                                strokeDasharray="4 4"
                                            />
                                            <circle cx="160" cy="45" r="4.5" fill="#22c55e" />

                                            {/* tooltip box */}
                                            <g transform="translate(190,30)">
                                                <rect
                                                    x="-55"
                                                    y="-18"
                                                    width="110"
                                                    height="32"
                                                    rx="6"
                                                    fill="#020617"
                                                    stroke="#0f172a"
                                                />
                                                <text
                                                    x="0"
                                                    y="-4"
                                                    textAnchor="middle"
                                                    fontSize="10"
                                                    fill="#e5e7eb"
                                                >
                                                    May 16
                                                </text>
                                                <text
                                                    x="0"
                                                    y="8"
                                                    textAnchor="middle"
                                                    fontSize="9"
                                                    fill="#22c55e"
                                                >
                                                    +22,400 pts
                                                </text>
                                            </g>
                                        </g>
                                    </svg>
                                </div>
                            </div>

                            <div className="mt-4 grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                                        Tổng Inflow
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">+320,500 pts</p>
                                    <p className="mt-1 text-xs text-emerald-600">+18% vs 30 ngày trước</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                                        Tổng Outflow
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">-298,400 pts</p>
                                    <p className="mt-1 text-xs text-amber-600">+9% chi tiêu</p>
                                </div>
                                <div>
                                    <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500">
                                        Net Movement
                                    </p>
                                    <p className="mt-1 text-lg font-semibold text-gray-900">+22,100 pts</p>
                                    <p className="mt-1 text-xs text-gray-500">Ổn định, không rủi ro lớn</p>
                                </div>
                            </div>
                        </div>

                        {/* Urgent attention */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-200 flex flex-col">
                            <div className="mb-4 flex items-center justify-between">
                                <h2 className="text-sm font-semibold text-gray-900">Urgent Attention</h2>
                                <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-red-600">
                                    Critical
                                </span>
                            </div>

                            <div className="rounded-xl border border-red-100 bg-red-50/40 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-mono text-gray-500">#DTS-9921</p>
                                    <p className="text-xs text-gray-400">2 giờ trước</p>
                                </div>
                                <p className="mt-2 text-sm font-semibold text-gray-900">
                                    Logo Design - Rebranding
                                </p>
                                <p className="mt-1 text-xs text-gray-600">
                                    Client khiếu nại về việc sử dụng AI, Artist phủ nhận. Cần kiểm tra log và file bàn giao.
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
                                            C
                                        </div>
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white ring-2 ring-white">
                                            F
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Finance &amp; Trust team đang xử lý</p>
                                </div>

                                <button className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gray-900 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black">
                                    Review Evidence
                                    <span className="text-[10px]">↗</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Dispute queue */}
                    <div className="rounded-2xl bg-white shadow-sm border border-gray-200">
                        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm font-semibold text-gray-900">Dispute Queue</h2>
                                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    12
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <button className="rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
                                    Tất cả
                                </button>
                                <button className="rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
                                    Đang tranh chấp
                                </button>
                                <button className="rounded-full border border-gray-200 bg-white px-3 py-1 hover:bg-gray-50">
                                    Cần action
                                </button>
                            </div>
                        </div>

                        {/* Table header */}
                        <div className="hidden border-b border-gray-100 px-5 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 md:grid md:grid-cols-[1.2fr_1.6fr_1fr_1.1fr_1fr]">
                            <div>Job ID</div>
                            <div>Parties</div>
                            <div>Escrow</div>
                            <div>Status</div>
                            <div className="text-right">Actions</div>
                        </div>

                        {/* Rows */}
                        <div className="divide-y divide-gray-100">
                            {/* Row 1 */}
                            <div className="px-5 py-4 text-sm md:grid md:grid-cols-[1.2fr_1.6fr_1fr_1.1fr_1fr] md:items-center md:gap-3">
                                <div className="mb-2 md:mb-0">
                                    <p className="font-medium text-gray-900">#JOB-8842</p>
                                    <p className="text-xs text-gray-500">Web Dev</p>
                                </div>

                                <div className="mb-3 flex items-center gap-3 md:mb-0">
                                    <div className="flex -space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                                            C
                                        </div>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-semibold text-white ring-2 ring-white">
                                            A
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">Client vs. Anna K.</p>
                                        <p className="text-[11px] text-gray-500">Thanh toán milestone cuối cùng bị giữ</p>
                                    </div>
                                </div>

                                <div className="mb-3 md:mb-0">
                                    <p className="text-sm font-semibold text-gray-900">2,500 pts</p>
                                    <p className="text-xs text-gray-500">Escrow</p>
                                </div>

                                <div className="mb-3 flex items-center gap-2 md:mb-0">
                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                                        Disputed
                                    </span>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                        View logs (4)
                                    </button>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        Revoke
                                    </button>
                                    <button className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white hover:bg-emerald-700">
                                        Unlock
                                    </button>
                                </div>
                            </div>

                            {/* Row 2 */}
                            <div className="px-5 py-4 text-sm md:grid md:grid-cols-[1.2fr_1.6fr_1fr_1.1fr_1fr] md:items-center md:gap-3">
                                <div className="mb-2 md:mb-0">
                                    <p className="font-medium text-gray-900">#JOB-9921</p>
                                    <p className="text-xs text-gray-500">Logo Design</p>
                                </div>

                                <div className="mb-3 flex items-center gap-3 md:mb-0">
                                    <div className="flex -space-x-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-900 text-xs font-semibold text-white">
                                            C
                                        </div>
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-semibold text-white ring-2 ring-white">
                                            T
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs font-medium text-gray-900">TechCorp vs. Jay</p>
                                        <p className="text-[11px] text-gray-500">Tranh chấp về phạm vi công việc &amp; IP</p>
                                    </div>
                                </div>

                                <div className="mb-3 md:mb-0">
                                    <p className="text-sm font-semibold text-gray-900">500 pts</p>
                                    <p className="text-xs text-gray-500">Escrow</p>
                                </div>

                                <div className="mb-3 flex items-center gap-2 md:mb-0">
                                    <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                                        Escalated
                                    </span>
                                    <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                                        Files (2)
                                    </button>
                                </div>

                                <div className="flex justify-end gap-2">
                                    <button className="rounded-full border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                                        Revoke
                                    </button>
                                    <button className="rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white hover:bg-black">
                                        Unlock
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Finance;

