import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Step2 = ({ onBack, onNext }) => {
    const navigate = useNavigate()
    const [notes, setNotes] = useState({
        milestone1: 'e.g., I will arrive 30 mins early for setup...',
        milestone2: '',
        milestone3: ''
    })

    const handleNoteChange = (milestone, value) => {
        setNotes(prev => ({ ...prev, [milestone]: value }))
    }

    const milestones = [
        {
            id: 'milestone1',
            day: 'Day 1: Setup & Morning Keynotes',
            description: 'Submission of first 50 unedited highlight shots by 2:00 PM EST.',
            points: '250 Pts',
            note: notes.milestone1
        },
        {
            id: 'milestone2',
            day: 'Day 2: Full Event Coverage',
            description: 'Coverage of networking event and closing ceremony. Raw files backup.',
            points: '250 Pts',
            note: notes.milestone2
        },
        {
            id: 'milestone3',
            day: 'Final Delivery & Gallery',
            description: 'High-res edited files uploaded to studio portal. Transfer of rights.',
            points: '500 Pts',
            note: notes.milestone3
        }
    ]

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-10 py-8">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                                Review Milestones
                            </h1>
                            <p className="text-sm text-slate-500">
                                Please confirm the milestones proposed by Creative Studio Inc. You can add notes to each step if you have specific requirements or questions.
                            </p>
                        </div>

                        {/* Proposed Schedule */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-extrabold text-slate-900">Proposed Schedule</h2>
                                <div className="text-sm font-extrabold text-slate-900">Total: 1,000 FAF Pts</div>
                            </div>

                            <div className="space-y-6">
                                {milestones.map((milestone, index) => (
                                    <div key={milestone.id} className="border border-slate-200 rounded-2xl p-6 bg-slate-50">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-base font-extrabold text-slate-900">{milestone.day}</h3>
                                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
                                                        FUNDED
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-4">{milestone.description}</p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-base font-extrabold text-slate-900">{milestone.points}</div>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                                                Add a note (optional)
                                            </label>
                                            <textarea
                                                value={milestone.note}
                                                onChange={(e) => handleNoteChange(milestone.id, e.target.value)}
                                                placeholder={milestone.id === 'milestone1' ? 'e.g., I will arrive 30 mins early for setup...' : 'Type here...'}
                                                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                                rows="3"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                            <button
                                onClick={onBack || (() => navigate(-1))}
                                className="text-sm text-slate-600 hover:text-slate-900 font-medium"
                            >
                                Back forward
                            </button>
                            <button
                                onClick={onNext}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-extrabold shadow-md"
                            >
                                Confirm & Submit Proposal
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-5 h-5 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-extrabold text-slate-900">Summary</h3>
                            </div>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Service Fee (5%)</span>
                                    <span className="text-sm font-extrabold text-slate-900">-50 Pts</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Escrow Protection</span>
                                    <span className="text-sm font-extrabold text-emerald-600">Free</span>
                                </div>
                                <div className="pt-3 border-t border-slate-200">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-extrabold text-slate-900">Est. Earnings</span>
                                        <span className="text-base font-extrabold text-blue-600">950 Pts</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-slate-500">-$950.00 USD</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FAF Secure Escrow Card */}
                        <div className="bg-blue-50 rounded-3xl border border-blue-100 p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 text-center mb-2">FAF Secure Escrow</h3>
                            <p className="text-xs text-slate-600 text-center">
                                Your payment is already funded by the client. Funds are released to you automatically upon milestone completion.
                            </p>
                        </div>

                        {/* Applying to Section */}
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <div className="w-5 h-5 flex items-center justify-center">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <span>Applying to <span className="font-semibold text-slate-900">Event Photographer - 2 Day Gig</span></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step2
