import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

const MOCK_JOBS = [
    {
        id: 'job_1',
        title: 'UI Designer for Web3 Dashboard',
        company: 'MetaLayer Labs',
        posted: 'Posted 2d ago',
        category: 'Design & Creative',
        type: 'short',
        verified: true,
        tags: ['Remote', '3–5 days'],
        description:
            'We need a high-fidelity UI designer to refine our governance dashboard. Experience with dark mode aesthetics and complex data visualizations is essential.',
        payType: 'Fixed Budget',
        payAmount: '$1,200',
        accent: 'blue',
    },
    {
        id: 'job_2',
        title: 'Technical Content Writer (Fintech)',
        company: 'Stripe Connect+',
        posted: 'Posted 5h ago',
        category: 'Writing',
        type: 'short',
        verified: true,
        tags: ['Urgent', 'Contract'],
        description:
            'Looking for a technical writer to produce 4 deep-dive articles about cross-border payment protocols. Must have previous experience in Fintech.',
        payType: 'Hourly Rate',
        payAmount: '$85/hr',
        accent: 'amber',
    },
    {
        id: 'job_3',
        title: 'Frontend Developer (React/Tailwind)',
        company: 'Nexus AI',
        posted: 'Posted 1d ago',
        category: 'Development',
        type: 'short',
        verified: true,
        tags: ['Intermediate', '2 weeks'],
        description:
            'Help us build the landing page for our new AI agent platform. Clean code and attention to micro-interactions are required.',
        payType: 'Fixed Budget',
        payAmount: '$2,500',
        accent: 'violet',
    },
    {
        id: 'job_4',
        title: 'Senior Product Designer (Contract)',
        company: 'Linear App+',
        posted: 'Posted 15m ago',
        category: 'Design & Creative',
        type: 'short',
        verified: true,
        tags: ['Expert', '1 month'],
        description:
            'Join our design system team for a month-long sprint. You will be responsible for refining our mobile component library and documentation.',
        payType: 'Premium Rate',
        payAmount: '$150/hr',
        accent: 'blue',
        featured: true,
    },
    {
        id: 'job_5',
        title: 'Growth Marketing Lead (SaaS)',
        company: 'Orbit CRM',
        posted: 'Posted 3d ago',
        category: 'Marketing',
        type: 'long',
        verified: false,
        tags: ['Full-time', 'Hybrid'],
        description:
            'Own acquisition and lifecycle marketing. Build experiments, improve conversion funnels, and partner with product to drive retention.',
        payType: 'Salary',
        payAmount: '$110k–$140k',
        accent: 'emerald',
    },
    {
        id: 'job_6',
        title: 'Backend Engineer (Node.js)',
        company: 'Kinetic Cloud',
        posted: 'Posted 6d ago',
        category: 'Development',
        type: 'long',
        verified: true,
        tags: ['Full-time', 'Remote'],
        description:
            'Design APIs and services with a focus on performance and reliability. Experience with distributed systems is a plus.',
        payType: 'Salary',
        payAmount: '$120k–$160k',
        accent: 'indigo',
    },
]

const CATEGORIES = ['All Categories', 'Development', 'Design & Creative', 'Marketing', 'Writing']
const DURATIONS = ['Any', 'Hourly', 'Fixed Price']

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n))
}

function Badge({ children, tone = 'gray' }) {
    const tones = {
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        violet: 'bg-violet-50 text-violet-700 border-violet-100',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    }

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full border ${tones[tone] || tones.gray
                }`}
        >
            {children}
        </span>
    )
}

function JobIcon({ tone = 'blue' }) {
    const tones = {
        blue: 'bg-blue-100 text-blue-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        amber: 'bg-amber-100 text-amber-700',
        violet: 'bg-violet-100 text-violet-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        gray: 'bg-gray-100 text-gray-700',
    }
    return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone] || tones.gray}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
            </svg>
        </div>
    )
}

const FindWork = () => {
    const [query, setQuery] = useState('')
    const [tab, setTab] = useState('short') // 'short' | 'long'
    const [sort, setSort] = useState('newest') // newest | payHigh | payLow
    const [category, setCategory] = useState('All Categories')
    const [duration, setDuration] = useState('Any')
    const [payMax, setPayMax] = useState(5000)
    const [page, setPage] = useState(1)

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase()
        const inTab = MOCK_JOBS.filter((j) => (tab === 'short' ? j.type === 'short' : j.type === 'long'))

        const inCategory =
            category === 'All Categories' ? inTab : inTab.filter((j) => j.category.toLowerCase() === category.toLowerCase())

        const inDuration =
            duration === 'Any'
                ? inCategory
                : inCategory.filter((j) => {
                    const isHourly = j.payType.toLowerCase().includes('hour')
                    const isFixed = j.payType.toLowerCase().includes('fixed')
                    if (duration === 'Hourly') return isHourly
                    if (duration === 'Fixed Price') return isFixed
                    return true
                })

        const inQuery =
            !q
                ? inDuration
                : inDuration.filter((j) => {
                    return (
                        j.title.toLowerCase().includes(q) ||
                        j.company.toLowerCase().includes(q) ||
                        j.description.toLowerCase().includes(q)
                    )
                })

        // Pay filtering: very lightweight parse (only works for simple $N / $N/hr / $N,NNN)
        const parsePayNumber = (s) => {
            const m = String(s).replace(/,/g, '').match(/\$([0-9]+(?:\.[0-9]+)?)/)
            return m ? Number(m[1]) : null
        }
        const inPay = inQuery.filter((j) => {
            const n = parsePayNumber(j.payAmount)
            if (n == null) return true
            return n <= payMax
        })

        const sorted = [...inPay].sort((a, b) => {
            if (sort === 'payHigh') {
                return (parsePayNumber(b.payAmount) ?? -1) - (parsePayNumber(a.payAmount) ?? -1)
            }
            if (sort === 'payLow') {
                return (parsePayNumber(a.payAmount) ?? Number.MAX_SAFE_INTEGER) - (parsePayNumber(b.payAmount) ?? Number.MAX_SAFE_INTEGER)
            }
            // newest: featured first, then posted (mock)
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        })

        return sorted
    }, [query, tab, sort, category, duration, payMax])

    const pageSize = 4
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
    const safePage = clamp(page, 1, totalPages)
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)

    // keep page valid when filters change
    useEffect(() => {
        if (safePage !== page) setPage(safePage)
    }, [page, safePage])

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="bg-white/95 rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 h-fit">
                            <div className="text-sm font-extrabold text-gray-900 mb-4">Find your next role</div>
                            <div className="text-xs text-gray-500 mb-6">Browse {filtered.length} open opportunities</div>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">Category</div>
                                    <div className="space-y-1">
                                        {CATEGORIES.map((c) => (
                                            <button
                                                key={c}
                                                onClick={() => {
                                                    setCategory(c)
                                                    setPage(1)
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${category === c ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                                                    }`}
                                            >
                                                {c}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">Pay range ($)</div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min={50}
                                            max={5000}
                                            step={50}
                                            value={payMax}
                                            onChange={(e) => {
                                                setPayMax(Number(e.target.value))
                                                setPage(1)
                                            }}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>$50</span>
                                            <span className="font-bold text-gray-700">${payMax.toLocaleString()}+</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">Duration</div>
                                    <div className="flex flex-wrap gap-2">
                                        {DURATIONS.map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => {
                                                    setDuration(d)
                                                    setPage(1)
                                                }}
                                                className={`px-3 py-1.5 rounded-full text-xs font-extrabold border transition-colors ${duration === d
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main */}
                        <section className="min-w-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <svg
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            value={query}
                                            onChange={(e) => {
                                                setQuery(e.target.value)
                                                setPage(1)
                                            }}
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                            placeholder="Search job titles, keywords, or companies..."
                                            type="text"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs font-bold text-gray-500">Sort by:</span>
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                        >
                                            <option value="newest">Newest First</option>
                                            <option value="payHigh">Pay: High to Low</option>
                                            <option value="payLow">Pay: Low to High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex items-center gap-6 border-b border-gray-100">
                                    <button
                                        onClick={() => {
                                            setTab('short')
                                            setPage(1)
                                        }}
                                        className={`pb-3 text-sm font-extrabold transition-colors ${tab === 'short'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        Short-term (Protected)
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTab('long')
                                            setPage(1)
                                        }}
                                        className={`pb-3 text-sm font-extrabold transition-colors ${tab === 'long'
                                            ? 'text-blue-600 border-b-2 border-blue-600'
                                            : 'text-gray-500 hover:text-gray-800'
                                            }`}
                                    >
                                        Long-term
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="space-y-4 pt-2">
                                    {pageItems.map((job) => (
                                        <Link
                                            key={job.id}
                                            to={`/work/${job.id}`}
                                            className={`block rounded-2xl border transition-all cursor-pointer ${job.featured
                                                ? 'border-blue-200 bg-blue-50/50'
                                                : 'border-gray-100 bg-white hover:border-gray-200'
                                                }`}
                                        >
                                            <div className="p-5 sm:p-6 flex gap-4">
                                                <JobIcon tone={job.accent} />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="min-w-0">
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <div className="text-base sm:text-lg font-extrabold text-gray-900 truncate">
                                                                    {job.title}
                                                                </div>
                                                                {job.featured && <Badge tone="blue">Featured</Badge>}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                <span className="font-bold text-gray-700">{job.company}</span> •{' '}
                                                                {job.posted}
                                                            </div>
                                                        </div>
                                                        <div className="text-right shrink-0">
                                                            <div className="text-lg font-extrabold text-gray-900">{job.payAmount}</div>
                                                            <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                                {job.payType}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 flex-wrap mt-3">
                                                        {job.verified && <Badge tone="blue">Escrow Verified</Badge>}
                                                        {job.tags.map((t) => (
                                                            <Badge key={t} tone="gray">
                                                                {t}
                                                            </Badge>
                                                        ))}
                                                    </div>

                                                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">{job.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}

                                    {filtered.length === 0 && (
                                        <div className="rounded-2xl border border-gray-100 p-10 text-center">
                                            <div className="text-lg font-extrabold text-gray-900">Không có kết quả phù hợp</div>
                                            <div className="text-sm text-gray-500 mt-2">Thử đổi từ khóa, category hoặc pay range nhé.</div>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination */}
                                {filtered.length > 0 && (
                                    <div className="flex items-center justify-center gap-2 pt-6">
                                        <button
                                            onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
                                            disabled={safePage === 1}
                                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                                            aria-label="Previous page"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                            <button
                                                key={p}
                                                onClick={() => setPage(p)}
                                                className={`w-9 h-9 rounded-lg text-sm font-extrabold transition-colors ${p === safePage
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-transparent text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
                                            disabled={safePage === totalPages}
                                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50"
                                            aria-label="Next page"
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FindWork
