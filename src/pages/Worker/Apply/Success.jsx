import React from 'react'
import { useNavigate } from 'react-router-dom'

const Success = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-10 py-10 text-center">
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>

                    {/* Title & Description */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3">
                        Application Sent Successfully!
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        Your application for <span className="font-semibold text-slate-900">Event Photographer</span> has been
                        forwarded to Creative Studio. Good luck!
                    </p>

                    {/* What Happens Next */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 text-left px-5 py-4 mb-8">
                        <div className="text-xs font-bold text-slate-500 uppercase mb-3">What happens next?</div>
                        <div className="space-y-3 text-sm text-slate-700">
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-700">
                                    1
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">Employer Review</div>
                                    <div className="text-xs text-slate-500">The employer will review your profile and portfolio.</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs font-extrabold text-slate-700">
                                    2
                                </div>
                                <div>
                                    <div className="font-semibold text-slate-900">Notification</div>
                                    <div className="text-xs text-slate-500">You'll be notified via Messages if you're shortlisted.</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="w-full px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-md"
                        >
                            Go to Dashboard
                        </button>
                        <button
                            onClick={() => navigate('/find-work')}
                            className="w-full px-6 py-3 rounded-xl border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 hover:text-blue-700 text-slate-800 text-sm font-extrabold shadow-md transition-colors"
                        >
                            Browse More Jobs
                        </button>
                    </div>
                </div>

                {/* Footer note */}
                <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-500">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2-2 4-2 4m-2-4c0-1.105-.895-2-2-2s-2 .895-2 2 2 4 2 4m2-14a9 9 0 100 18 9 9 0 000-18z" />
                    </svg>
                    <span>Your data is secure with FAF Escrow Protection.</span>
                </div>
            </div>
        </div>
    )
}

export default Success

