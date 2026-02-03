import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'

// Mock data - trong thực tế sẽ lấy từ API hoặc state management
const MOCK_JOB_DETAIL = {
    id: 'job_1',
    title: 'Event Photographer – 2 Day Gig',
    company: 'Creative Studio',
    companyFull: 'Creative Studio Inc.',
    location: 'New York, NY (On-site)',
    category: 'Short-term Gigs',
    verified: true,
    rating: 4.9,
    reviews: 124,
    successRate: '100%',
    activeGigs: 4,
    responseTime: 'Under 2 hours',
    paymentVerified: true,
    description: 'We are looking for a professional photographer to cover our annual 2-day creative summit. You will be responsible for capturing keynote sessions, networking mixers, and high-quality portraits of speakers. The atmosphere is fast-paced, and we need someone who can capture the energy of the event while maintaining a low profile.',
    requirements: [
        'Must have own professional grade gear (DSLR/Mirrorless, various lenses)',
        '3+ years experience in corporate or large event photography',
        'Ability to provide a digital gallery within 48 hours post-event'
    ],
    milestones: [
        {
            title: 'Day 1: Setup & Morning Keynotes',
            description: 'Submission of first 50 unedited highlight shots',
            payment: '250 FAF Pts',
            status: 'Held in Escrow'
        },
        {
            title: 'Day 2: Full Event Coverage',
            description: 'Coverage of networking event and closing ceremony',
            payment: '250 FAF Pts',
            status: 'Held in Escrow'
        },
        {
            title: 'Final Delivery & Gallery',
            description: 'High-res edited files uploaded to studio portal',
            payment: '500 FAF Pts',
            status: 'Held in Escrow'
        }
    ],
    totalEscrow: '1,000 Pts',
    totalEscrowUSD: '$1,000 USD'
}

const WorkDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const job = MOCK_JOB_DETAIL // Trong thực tế sẽ fetch dựa trên id

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="bg-white/95 rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                            <span>›</span>
                            <Link to="/find-work" className="hover:text-blue-600 transition-colors">{job.category}</Link>
                            <span>›</span>
                            <span className="text-gray-900 font-semibold">{job.title}</span>
                        </div>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
                        {/* Main Content */}
                        <div className="min-w-0">
                            {/* Header */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex-1 min-w-0">
                                        <h1 className="text-3xl font-extrabold text-gray-900 mb-3">{job.title}</h1>
                                        <div className="flex items-center gap-4 flex-wrap">
                                            <div className="text-sm text-gray-600">
                                                <span className="font-bold text-gray-900">{job.company}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {job.location}
                                            </div>
                                        </div>
                                    </div>
                                    <button className="shrink-0 flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                        </svg>
                                        <span className="text-sm font-semibold">Share</span>
                                    </button>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Job Description</h2>
                                <p className="text-sm text-gray-700 leading-relaxed">{job.description}</p>
                            </div>

                            {/* Requirements */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Requirements</h2>
                                <ul className="space-y-3">
                                    {job.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-sm text-gray-700">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Payment Milestones */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Payment Milestones</h2>
                                <div className="space-y-4">
                                    {job.milestones.map((milestone, index) => (
                                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <h3 className="text-base font-extrabold text-gray-900">{milestone.title}</h3>
                                                <div className="text-right shrink-0">
                                                    <div className="text-base font-extrabold text-gray-900">{milestone.payment}</div>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{milestone.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                            {/* Apply Now Button */}
                            <button
                                onClick={() => navigate('/apply')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg"
                            >
                                Apply Now
                            </button>

                            {/* FAF Secure Escrow */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <div className="flex items-center gap-2 mb-3">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <h3 className="text-base font-extrabold text-gray-900">FAF Secure Escrow</h3>
                                </div>
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    <span className="font-bold text-gray-900">{job.totalEscrow}</span> ({job.totalEscrowUSD}) have been pre-funded by the employer and are currently locked. Payment is released automatically as you hit milestones.
                                </p>
                            </div>

                            {/* About the Employer */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4">ABOUT THE EMPLOYER</h3>

                                {/* Employer Logo */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center border-2 border-amber-200">
                                        <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                                            <span className="text-amber-800 font-extrabold text-lg">CS</span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-base font-extrabold text-gray-900 truncate">{job.companyFull}</h4>
                                            {job.verified && (
                                                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-1">
                                            <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                            <span className="text-sm font-bold text-gray-900">{job.rating}</span>
                                            <span className="text-sm text-gray-600">({job.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-2 gap-3 mb-4">
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Success Rate</div>
                                        <div className="text-lg font-extrabold text-gray-900">{job.successRate}</div>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Active Gigs</div>
                                        <div className="text-lg font-extrabold text-gray-900">{job.activeGigs}</div>
                                    </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Response Time:</span>
                                        <span className="font-bold text-gray-900">{job.responseTime}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span className="font-bold text-green-600">✔ Verified</span>
                                    </div>
                                </div>

                                {/* Terms Notice */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-start gap-2">
                                        <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-xs text-gray-500 leading-relaxed">
                                            By applying, you agree to the FAF Short-term Contract Terms and Escrow Policy.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkDetail
