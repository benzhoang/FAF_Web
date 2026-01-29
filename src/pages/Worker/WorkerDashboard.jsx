import React, { useMemo } from 'react'

import warehouseImg from '../../assets/istockphoto-1947499362-612x612.jpg'

const WorkerDashboard = () => {
    const todayGreeting = useMemo(() => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }, [])

    const userName = useMemo(() => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || 'null')
            return user?.fullName || user?.email || 'Worker'
        } catch {
            return 'Worker'
        }
    }, [])

    const recommendedJobs = useMemo(
        () => [
            {
                id: 'event-staff',
                title: 'Event Staff Assistant',
                company: 'Downtown Convention Center',
                price: '$25/hr',
                meta: [
                    { icon: 'calendar', text: 'Oct 24 - 26' },
                    { icon: 'clock', text: '9:00 AM - 5:00 PM' },
                    { icon: 'map', text: '2.5mi away' }
                ],
                badge: 'ESCROW FUNDED',
                extra: '3 others applied',
                img: warehouseImg
            },
            {
                id: 'warehouse-sorter',
                title: 'Warehouse Sorter',
                company: 'Logistics Hub A',
                price: '$22/hr',
                meta: [
                    { icon: 'bolt', text: 'Starts Tomorrow' },
                    { icon: 'moon', text: 'Night Shift' },
                    { icon: 'map', text: '5.1mi away' }
                ],
                badge: 'ESCROW FUNDED',
                extra: 'Be the first to apply',
                img: warehouseImg
            },
            {
                id: 'admin-temp',
                title: 'Admin Temp',
                company: 'City Services Corp',
                price: '$20/hr',
                meta: [
                    { icon: 'spark', text: 'Flexible' },
                    { icon: 'home', text: 'Remote' }
                ],
                extra: 'High demand',
                img: warehouseImg
            }
        ],
        []
    )

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* Left Sidebar */}
                    <aside className="lg:col-span-3">
                        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                            <div className="mb-6 min-w-0">
                                <p className="truncate text-sm font-semibold text-gray-900">{userName}</p>
                                <p className="truncate text-xs text-gray-500">Worker</p>
                            </div>

                            <div className="space-y-5">
                                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-900">Upcoming Checkpoints</p>
                                        <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                            2 Active
                                        </span>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                            <div className="flex items-start gap-3">
                                                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path
                                                            d="M12 2l4 8H8l4-8Z"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M3 22h18"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-900">Site Clean-up</p>
                                                    <p className="text-xs text-gray-500">Today • 2:00 PM</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                                            <div className="flex items-start gap-3">
                                                <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path
                                                            d="M3 7h14v10H3V7Z"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                        <path
                                                            d="M17 10h4l-2 3-2-3Z"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-semibold text-gray-900">Deliveries</p>
                                                    <p className="text-xs text-gray-500">Tomorrow • 9:00 AM</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50">
                                        View Full Schedule
                                    </button>
                                </div>

                                <div className="rounded-xl border border-gray-100 bg-gray-50/40 p-4">
                                    <p className="mb-3 text-sm font-semibold text-gray-900">Top Categories</p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Construction', 'Events', 'Logistics', 'Admin', 'Retail'].map((c) => (
                                            <button
                                                key={c}
                                                className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:border-blue-200 hover:text-blue-700"
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <section className="lg:col-span-9">
                        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                                <div className="min-w-0">
                                    <h1 className="truncate text-2xl font-bold text-gray-900">
                                        {todayGreeting}, {userName}!
                                    </h1>
                                    <p className="mt-1 text-sm text-gray-500">Ready for your next gig?</p>
                                </div>

                                <div className="w-full md:w-auto">
                                    <div className="rounded-2xl border border-gray-100 bg-gradient-to-r from-white to-blue-50 p-4">
                                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-700">
                                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path
                                                            d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27Z"
                                                            strokeWidth="2"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                </span>
                                                <div>
                                                    <p className="text-xl font-extrabold text-gray-900">1,250 pts</p>
                                                    <p className="text-xs text-gray-500">Current Points Balance</p>
                                                </div>
                                            </div>
                                            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700">
                                                Redeem Points
                                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path
                                                        d="M5 12h14"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M13 5l7 7-7 7"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-bold text-gray-900">Recommended for You</h2>
                                    <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                        View All
                                    </button>
                                </div>

                                <div className="mt-4 space-y-4">
                                    {recommendedJobs.map((job) => (
                                        <div
                                            key={job.id}
                                            className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                                <div className="relative h-28 w-full overflow-hidden rounded-xl sm:h-24 sm:w-44">
                                                    <img
                                                        src={job.img}
                                                        alt={job.title}
                                                        className="h-full w-full object-cover"
                                                        loading="lazy"
                                                    />
                                                    {job.badge ? (
                                                        <span className="absolute left-2 top-2 rounded-lg bg-emerald-50 px-2 py-1 text-[10px] font-extrabold text-emerald-700">
                                                            {job.badge}
                                                        </span>
                                                    ) : null}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <p className="truncate text-base font-bold text-gray-900">{job.title}</p>
                                                            <p className="truncate text-sm text-gray-500">{job.company}</p>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <p className="text-base font-extrabold text-gray-900">{job.price}</p>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-600">
                                                        {job.meta.map((m, idx) => (
                                                            <span key={`${job.id}-${idx}`} className="inline-flex items-center gap-1.5">
                                                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-50 text-gray-500">
                                                                    <svg
                                                                        className="h-3.5 w-3.5"
                                                                        viewBox="0 0 24 24"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            d="M8 7V3m8 4V3M4 11h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                        />
                                                                    </svg>
                                                                </span>
                                                                {m.text}
                                                            </span>
                                                        ))}
                                                    </div>

                                                    <div className="mt-3 flex items-center justify-between gap-3">
                                                        <p className="text-xs text-gray-500">{job.extra}</p>
                                                        <button className="inline-flex items-center justify-center rounded-xl border border-blue-200 bg-white px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50">
                                                            Apply Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default WorkerDashboard