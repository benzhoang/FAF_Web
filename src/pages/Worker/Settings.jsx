import React, { useMemo } from 'react'

const getInitials = (user) => {
    const fullName = user?.fullName || user?.name
    if (fullName) {
        return fullName
            .trim()
            .split(/\s+/)
            .filter(Boolean)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }
    if (user?.email) return String(user.email)[0]?.toUpperCase() || 'U'
    return 'U'
}

const Stat = ({ value, label }) => (
    <div className="flex-1 rounded-xl bg-white border border-gray-100 px-4 py-4 text-center">
        <div className="text-lg font-extrabold text-blue-600">{value}</div>
        <div className="mt-1 text-[11px] font-semibold tracking-wide text-gray-500 uppercase">
            {label}
        </div>
    </div>
)

const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-gray-50 border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700">
        {children}
    </span>
)

const Card = ({ title, children, right }) => (
    <section className="rounded-2xl bg-white border border-gray-100 shadow-sm">
        {title ? (
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-extrabold tracking-wide text-gray-900">{title}</h2>
                {right}
            </div>
        ) : null}
        <div className="px-6 py-5">{children}</div>
    </section>
)

const Settings = () => {
    const user = useMemo(() => {
        try {
            const raw = localStorage.getItem('user')
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    }, [])

    const displayName = user?.fullName || user?.name || user?.email || 'User'
    const title = user?.title || 'Senior Product Designer & UI Developer'
    const location = user?.location || 'Brooklyn, NY'
    const memberSince = user?.memberSince || 'Member since 2022'

    const skillsDesign = user?.skills?.design || ['UI Design', 'UX Research', 'Figma', 'Prototyping', 'Branding']
    const skillsDev = user?.skills?.dev || ['React', 'Tailwind CSS', 'Next.js', 'TypeScript']

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left column */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="rounded-2xl bg-white border border-gray-100 shadow-sm">
                            <div className="p-6">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl shadow-sm">
                                                {getInitials(user)}
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center">
                                                <span className="h-3 w-3 rounded-full bg-blue-600" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <h1 className="text-xl font-extrabold text-gray-900">{displayName}</h1>
                                                <span className="text-[10px] font-extrabold tracking-wide uppercase rounded-full bg-blue-50 text-blue-700 border border-blue-100 px-2 py-1">
                                                    Top Rated
                                                </span>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600 font-semibold">{title}</p>
                                            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold text-gray-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                                                    </svg>
                                                    {location}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                                    </svg>
                                                    {memberSince}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        className="h-10 w-10 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors flex items-center justify-center"
                                        aria-label="More"
                                    >
                                        <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6h.01M12 12h.01M12 18h.01" />
                                        </svg>
                                    </button>
                                </div>

                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                    <button className="inline-flex items-center justify-center rounded-xl bg-blue-600 text-white px-5 py-3 font-extrabold text-sm hover:bg-blue-700 transition-colors">
                                        Hire Now
                                    </button>
                                    <button className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-5 py-3 font-extrabold text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                                        Save Profile
                                    </button>
                                </div>
                            </div>

                            <div className="px-6 pb-6">
                                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5">
                                    <div className="text-[11px] font-extrabold tracking-wide text-gray-500 uppercase">About</div>
                                    <p className="mt-2 text-sm text-gray-700 leading-relaxed">
                                        Passionate about building digital products that solve real problems. I specialize in bridging the gap between complex engineering and human-centric design.
                                        With 6+ years of experience, I help startups scale their design systems and interactive interfaces.
                                    </p>
                                </div>

                                <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <Stat value="124" label="Jobs Done" />
                                    <Stat value="4.9★" label="Rating" />
                                    <Stat value="100%" label="On Time" />
                                    <Stat value="$85" label="Hourly Rate" />
                                </div>
                            </div>
                        </section>

                        <Card
                            title="Featured Portfolio"
                            right={
                                <button className="text-xs font-extrabold text-blue-600 hover:text-blue-700 transition-colors">
                                    View all →
                                </button>
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { tag: 'UI/UX Design', title: 'Nova Banking Dashboard', sub: 'Responsive SaaS platform for enterprise finance.' },
                                    { tag: 'Mobile Development', title: 'GourmetGo App', sub: 'React Native food delivery integration.' },
                                    { tag: 'Branding', title: 'FreshBite Identity', sub: 'A complete visual identity system.' },
                                ].map((p) => (
                                    <div key={p.title} className="group rounded-2xl border border-gray-100 overflow-hidden bg-white">
                                        <div className="h-24 bg-gradient-to-br from-gray-100 to-gray-200" />
                                        <div className="p-4">
                                            <div className="text-[10px] font-extrabold tracking-wide uppercase text-blue-600">
                                                {p.tag}
                                            </div>
                                            <div className="mt-1 text-sm font-extrabold text-gray-900">{p.title}</div>
                                            <div className="mt-1 text-xs text-gray-600">{p.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card title="Recent History & Reviews">
                            <div className="space-y-4">
                                {[
                                    { title: 'E-commerce Landing Page Re-design', amount: '$1,200', quote: 'Alex is a world-class designer. He understood our complex requirements immediately and delivered high quality prototypes in record time.', meta: 'Feb 2024 · Short-term Contract' },
                                    { title: 'React Component Library Development', amount: '$3,450', quote: 'Clean code and great documentation. Helped our team move much faster.', meta: 'Jan 2024 · 3-week Sprint' },
                                ].map((r) => (
                                    <div key={r.title} className="rounded-2xl border border-gray-100 bg-white p-5">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <div className="text-sm font-extrabold text-gray-900">{r.title}</div>
                                                <div className="mt-1 text-xs font-semibold text-gray-500">{r.meta}</div>
                                            </div>
                                            <div className="text-sm font-extrabold text-gray-900">{r.amount}</div>
                                        </div>
                                        <div className="mt-3 flex items-center gap-1 text-yellow-500">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.955a1 1 0 00.95.69h4.157c.969 0 1.371 1.24.588 1.81l-3.363 2.444a1 1 0 00-.364 1.118l1.286 3.955c.3.921-.755 1.688-1.539 1.118l-3.363-2.444a1 1 0 00-1.175 0l-3.363 2.444c-.783.57-1.838-.197-1.539-1.118l1.286-3.955a1 1 0 00-.364-1.118L2.07 9.382c-.783-.57-.38-1.81.588-1.81h4.157a1 1 0 00.95-.69l1.286-3.955z" />
                                                </svg>
                                            ))}
                                        </div>
                                        <p className="mt-3 text-sm text-gray-700 leading-relaxed">“{r.quote}”</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="space-y-6">
                        <Card title="Skills & Expertise">
                            <div className="space-y-4">
                                <div>
                                    <div className="text-[11px] font-extrabold tracking-wide text-gray-500 uppercase">Design</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {skillsDesign.map((s) => (
                                            <Pill key={s}>{s}</Pill>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-[11px] font-extrabold tracking-wide text-gray-500 uppercase">Development</div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {skillsDev.map((s) => (
                                            <Pill key={s}>{s}</Pill>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card title="Details">
                            <div className="space-y-4 text-sm">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold tracking-wide text-gray-500 uppercase">Languages</div>
                                        <div className="mt-1 font-semibold text-gray-900">{user?.languages || 'English (Fluent), Spanish (Fluent)'}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
                                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 .334-.01.667-.03 1" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l-6.16-3.422A12.083 12.083 0 003 17.5c0 .334.01.667.03 1" />
                                        </svg>
                                    </div>
                                    <div>
                                        <div className="text-xs font-extrabold tracking-wide text-gray-500 uppercase">Education</div>
                                        <div className="mt-1 font-semibold text-gray-900">{user?.education || 'BFA in Communication Design'}</div>
                                        <div className="mt-0.5 text-xs text-gray-500">{user?.educationSub || 'Pratt Institute, NY'}</div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <section className="rounded-2xl bg-gradient-to-b from-blue-50 to-white border border-blue-100 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <div className="h-10 w-10 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-blue-700 shadow-sm">
                                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M4 11h16M5 7h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2z" />
                                    </svg>
                                </div>
                                <div className="mt-4 text-sm font-extrabold text-gray-900">Available for Projects</div>
                                <div className="mt-1 text-xs font-semibold text-gray-600">
                                    Taking new clients for April 2024
                                </div>
                                <button className="mt-4 w-full rounded-xl bg-blue-600 text-white px-4 py-3 text-sm font-extrabold hover:bg-blue-700 transition-colors">
                                    Check Calendar
                                </button>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings