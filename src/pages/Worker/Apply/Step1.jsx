import React from 'react'
import { useNavigate } from 'react-router-dom'

const Step1 = () => {
    const navigate = useNavigate()
    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-10 py-8">
            {/* Title */}
            <div className="text-center mb-8">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                    Confirm your application profile
                </h1>
                <p className="text-sm text-slate-500">
                    This is how the employer will see you. Make sure your details are up to date.
                </p>
            </div>

            {/* Profile Card */}
            <div className="max-w-xl mx-auto bg-slate-50 rounded-3xl border border-slate-100 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-6">
                    {/* Avatar + name */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-20 rounded-2xl bg-amber-100 shadow-md flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-amber-300" />
                        </div>
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Alex Chen</h2>
                            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700">
                                Professional Event Photographer
                            </button>
                            <div className="flex items-center gap-1 mt-2 text-xs text-slate-600">
                                <span className="text-amber-400">★★★★★</span>
                                <span className="font-semibold text-slate-900">4.9</span>
                                <span>(124 reviews)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Skills + Verified */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                    {/* Top skills */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Top skills</div>
                        <div className="flex flex-wrap gap-2">
                            {['Event Photography', 'Adobe Lightroom', 'Portraiture', '4K Video'].map((tag) => (
                                <span
                                    key={tag}
                                    className="px-3 py-1 rounded-full bg-blue-50 text-[11px] font-semibold text-blue-700"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Verified info */}
                    <div>
                        <div className="text-xs font-bold text-slate-500 uppercase mb-2">Verified info</div>
                        <div className="space-y-1.5 text-xs text-slate-700">
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>Identity Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>Payment Method Verified</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                </span>
                                <span>98% Job Success Score</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-center gap-4">
                    <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-md">
                        Continue to Milestones
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-xs text-slate-500 hover:text-slate-700 font-medium"
                    >
                        Cancel Application
                    </button>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                        <div className="w-4 h-4 rounded-full bg-blue-50 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                        </div>
                        <span>Your profile information is shared securely with the recruiter.</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step1

