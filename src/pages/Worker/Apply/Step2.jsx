import React from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { useNavigate } from 'react-router-dom';

const Step2 = ({ onBack, onNext, job, proposalData, setProposalData }) => {
    const toast = useToast();
    const navigate = useNavigate();

    const handleChange = (field, value) => {
        setProposalData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Validate before going to next step
        if (!proposalData.coverLetter.trim()) {
            toast.warning('Please write a cover letter');
            return;
        }
        if (!proposalData.proposedPrice || parseFloat(proposalData.proposedPrice) <= 0) {
            toast.warning('Please enter a valid proposed price');
            return;
        }
        onNext();
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 px-6 sm:px-10 py-8">
                        {/* Title */}
                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
                                Submit Your Proposal
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Tell the employer why you're the best fit for this job and propose your price.
                            </p>
                        </div>

                        {/* Proposed Price */}
                        <div className="mb-8">
                            <label className="block mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">Your Proposed Price</span>
                                    <span className="text-sm text-slate-500 dark:text-slate-400">Budget: ${Number(job?.budget || 0).toLocaleString()}</span>
                                </div>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 font-semibold">$</span>
                                    <input
                                        type="number"
                                        value={proposalData.proposedPrice}
                                        onChange={(e) => handleChange('proposedPrice', e.target.value)}
                                        min="1"
                                        step="0.01"
                                        required
                                        className="w-full pl-8 pr-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-xl font-bold focus:border-cyan-900/300 focus:ring-2 focus:ring-cyan-800/50 transition-all"
                                        placeholder="Enter your price"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                    💡 Tip: Be competitive but fair. Employers typically expect proposals within 80-120% of the budget.
                                </p>
                            </label>
                        </div>

                        {/* Cover Letter */}
                        <div className="mb-8">
                            <label className="block">
                                <span className="text-lg font-extrabold text-slate-900 dark:text-white mb-2 block">Cover Letter *</span>
                                <textarea
                                    value={proposalData.coverLetter}
                                    onChange={(e) => handleChange('coverLetter', e.target.value)}
                                    rows={12}
                                    required
                                    className="w-full px-4 py-3 border-2 border-slate-300 dark:border-slate-600 rounded-xl focus:border-cyan-900/300 focus:ring-2 focus:ring-cyan-800/50 transition-all resize-none text-sm text-slate-700 dark:text-slate-300"
                                    placeholder="Tell the employer why you're the best fit for this job...

Include:
• Your relevant experience and skills
• Why you're interested in this project
• How you'll approach the work
• Any questions or clarifications you need"
                                ></textarea>
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-slate-600 dark:text-slate-400">
                                        {proposalData.coverLetter.length} characters
                                    </span>
                                    <span className="text-slate-500 dark:text-slate-400">
                                        ⚠️ Your cover letter will be reviewed by moderators
                                    </span>
                                </div>
                            </label>
                        </div>

                        {/* Checkpoints/Milestones Info */}
                        {job?.checkpoints && job.checkpoints.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white mb-4">Project Milestones</h2>
                                <div className="space-y-3">
                                    {job.checkpoints.map((checkpoint, index) => (
                                        <div key={checkpoint.id || index} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-slate-50 dark:bg-slate-900">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-sm font-bold text-cyan-500">Milestone {index + 1}</span>
                                                        <span className="px-2 py-1 bg-cyan-900/50 text-cyan-400 text-xs font-bold rounded-full">
                                                            FUNDED
                                                        </span>
                                                    </div>
                                                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">
                                                        {checkpoint.name || `Checkpoint ${index + 1}`}
                                                    </h3>
                                                    {checkpoint.description && (
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">{checkpoint.description}</p>
                                                    )}
                                                </div>
                                                {checkpoint.amount && (
                                                    <div className="text-right shrink-0">
                                                        <div className="text-base font-extrabold text-slate-900 dark:text-white">
                                                            ${Number(checkpoint.amount).toLocaleString()}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={onBack || (() => navigate(-1))}
                                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:text-white font-medium"
                            >
                                ← Back to Profile
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-white text-sm font-extrabold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            >
                                Continue to Review
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-6">
                        {/* Job Info Card */}
                        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Job Details</h3>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Applying to</div>
                                    <div className="text-sm font-semibold text-slate-900 dark:text-white">{job?.title}</div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Budget</span>
                                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">${Number(job?.budget || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Type</span>
                                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                                        {job?.job_type === 'SHORT_TERM' ? 'Short-term' : 'Long-term'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* FAF Secure Escrow Card */}
                        <div className="bg-cyan-900/30 rounded-3xl border border-cyan-900/50 p-6">
                            <div className="flex items-center justify-center mb-4">
                                <div className="w-12 h-12 rounded-full bg-cyan-900/50 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white text-center mb-2">FAF Secure Escrow</h3>
                            <p className="text-xs text-slate-600 dark:text-slate-400 text-center">
                                Payment is secured by the client. Funds are released to you automatically upon milestone completion.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Step2;
