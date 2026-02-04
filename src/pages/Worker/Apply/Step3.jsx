import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Step3 = ({ onBack }) => {
    const navigate = useNavigate()
    const [isEditingNote, setIsEditingNote] = useState(false)
    const [proposalNote, setProposalNote] = useState(
        'I have over 5 years of experience in event photography and have covered similar corporate summits in the past. I will arrive 30 minutes before the keynote each day to ensure lighting is perfectly calibrated. Looking forward to working with Creative Studio Inc.'
    )
    const [agreements, setAgreements] = useState({
        terms: false,
        escrow: false
    })

    const milestones = [
        {
            id: 1,
            title: 'Day 1: Setup & Morning Keynotes',
            points: '250 Pts'
        },
        {
            id: 2,
            title: 'Day 2: Full Event Coverage',
            points: '250 Pts'
        },
        {
            id: 3,
            title: 'Final Delivery & Gallery',
            points: '500 Pts'
        }
    ]

    const handleAgreementChange = (key) => {
        setAgreements(prev => ({ ...prev, [key]: !prev[key] }))
    }

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 px-6 sm:px-10 py-8">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
                                Final Review
                            </h1>
                            <p className="text-sm text-slate-500">
                                You're almost there! Review your proposal and the agreed milestones before submitting your application.
                            </p>
                        </div>

                        {/* Your Proposal Note */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-extrabold text-slate-900">Your Proposal Note</h2>
                                <button
                                    onClick={() => setIsEditingNote(!isEditingNote)}
                                    className="text-sm font-extrabold text-blue-600 hover:text-blue-700"
                                >
                                    Edit
                                </button>
                            </div>
                            {isEditingNote ? (
                                <textarea
                                    value={proposalNote}
                                    onChange={(e) => setProposalNote(e.target.value)}
                                    onBlur={() => setIsEditingNote(false)}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows="4"
                                    autoFocus
                                />
                            ) : (
                                <div className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 min-h-[100px]">
                                    {proposalNote}
                                </div>
                            )}
                        </div>

                        {/* Milestone Summary */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-extrabold text-slate-900">Milestone Summary</h2>
                                <span className="px-3 py-1 rounded-full bg-blue-100 text-xs font-extrabold text-blue-700">
                                    3 Milestones
                                </span>
                            </div>
                            <div className="space-y-3">
                                {milestones.map((milestone) => (
                                    <div key={milestone.id} className="flex items-center justify-between py-3 border-b border-slate-200 last:border-0">
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-extrabold text-slate-900">{milestone.id}.</span>
                                            <span className="text-sm text-slate-700">{milestone.title}</span>
                                        </div>
                                        <span className="text-sm font-extrabold text-slate-900">{milestone.points}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Legal Agreements */}
                        <div className="mb-8">
                            <h2 className="text-lg font-extrabold text-slate-900 mb-4">Legal Agreements</h2>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="terms"
                                        checked={agreements.terms}
                                        onChange={() => handleAgreementChange('terms')}
                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="terms" className="text-sm text-slate-700 cursor-pointer">
                                        I agree to the{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                            FAF Terms of Service
                                        </a>{' '}
                                        and acknowledge that this contract is subject to the platform's resolution policies.
                                    </label>
                                </div>
                                <div className="flex items-start gap-3">
                                    <input
                                        type="checkbox"
                                        id="escrow"
                                        checked={agreements.escrow}
                                        onChange={() => handleAgreementChange('escrow')}
                                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="escrow" className="text-sm text-slate-700 cursor-pointer">
                                        I understand that payments are held in{' '}
                                        <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold underline">
                                            FAF Secure Escrow
                                        </a>{' '}
                                        and will be released only upon milestone approval or completion of the contract.
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200">
                            <button
                                onClick={onBack || (() => navigate(-1))}
                                className="text-sm text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1"
                            >
                                <span>←</span> Back to Milestones
                            </button>
                            <button
                                disabled={!agreements.terms || !agreements.escrow}
                                onClick={() => navigate('/apply/success')}
                                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-extrabold shadow-md flex items-center gap-2"
                            >
                                Confirm & Submit Proposal
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Applying For Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                                    <div className="w-6 h-6 rounded-full bg-amber-300" />
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-500 uppercase mb-1">APPLYING FOR</div>
                                    <div className="text-sm font-extrabold text-slate-900">Event Photographer - 2 Day Gig</div>
                                </div>
                            </div>
                        </div>

                        {/* Total Estimated Earnings */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                            <div className="text-sm font-extrabold text-slate-600 mb-2">Total Estimated Earnings</div>
                            <div className="text-3xl font-extrabold text-blue-600 mb-1">950 Pts</div>
                            <div className="text-sm text-slate-500">=$950.00 USD</div>
                        </div>

                        {/* Contract Details */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                            <h3 className="text-sm font-extrabold text-slate-900 mb-4">Contract Details</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Total Contract</span>
                                    <span className="text-sm font-extrabold text-slate-900">1,000 Pts</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Service Fee (5%)</span>
                                    <span className="text-sm font-extrabold text-red-600">-50 Pts</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600">Secure Escrow</span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-sm font-extrabold text-emerald-600">INCLUDED</span>
                                        <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Information */}
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Timeline: <span className="font-semibold">2 days (Oct 12-14)</span></span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-700">
                                    <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="font-semibold text-emerald-600">FAF Payment Protection active</span>
                                </div>
                            </div>
                        </div>

                        {/* Submission Disclaimer */}
                        <div className="text-xs text-slate-500 text-center">
                            By clicking 'Confirm & Submit', you agree to begin the contract once the client approves your proposal.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Step3
