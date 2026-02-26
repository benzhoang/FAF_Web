import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { proposalsApi } from '../../api/proposals.api';
import { useAuth } from '../../auth/AuthContext';
import { jobsApi } from '../../api/jobs.api';

const ApplyToJob = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    
    const [formData, setFormData] = useState({
        coverLetter: '',
        proposedPrice: ''
    });

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const res = await jobsApi.getJobDetail(id);
            setJob(res.data);
            // Initialize proposed price with job budget as default
            setFormData(prev => ({
                ...prev,
                proposedPrice: res.data.budget || ''
            }));
        } catch (err) {
            console.error('Failed to fetch job:', err);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.coverLetter.trim()) {
            toast.warning('Please write a cover letter');
            return;
        }

        if (!formData.proposedPrice || parseFloat(formData.proposedPrice) <= 0) {
            toast.warning('Please enter a valid proposed price');
            return;
        }

        try {
            setSubmitting(true);
            const payload = {
                jobId: parseInt(id),
                coverLetter: formData.coverLetter,
                proposedPrice: parseFloat(formData.proposedPrice)
            };

            await proposalsApi.submitProposal(payload);
            
            toast.success('Proposal submitted successfully! It will be reviewed by moderators.');
            navigate('/dashboard'); // Or navigate to my proposals page
        } catch (err) {
            console.error('Failed to submit proposal:', err);
            const errorMsg = err.response?.data?.message || 'Failed to submit proposal';
            
            if (errorMsg.includes('ALREADY_APPLIED')) {
                toast.warning('You have already applied to this job.');
            } else if (errorMsg.includes('JOB_NOT_OPEN')) {
                toast.warning('This job is no longer accepting applications.');
            } else {
                toast.error(errorMsg);
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="text-center">
                        <div className="text-red-500 text-5xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
                        <button
                            onClick={() => navigate('/find-work')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                        >
                            Browse Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate(`/work/${id}`)}
                        className="text-blue-600 hover:text-blue-700 font-semibold mb-4 inline-flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Job Details
                    </button>
                    <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Apply to Job</h1>
                    <p className="text-lg text-gray-600">{job.title}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Job Summary Card */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Budget</div>
                                <div className="text-2xl font-bold text-gray-900">${Number(job.budget || 0).toLocaleString()}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Type</div>
                                <div className="text-lg font-bold text-gray-900">{job.job_type === 'SHORT_TERM' ? 'Short-term' : 'Long-term'}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-sm text-gray-600 mb-1">Category</div>
                                <div className="text-lg font-bold text-gray-900">{job.category_name || 'General'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Proposed Price */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <label className="block mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-lg font-bold text-gray-900">Your Proposed Price</span>
                                <span className="text-sm text-gray-500">Budget: ${Number(job.budget || 0).toLocaleString()}</span>
                            </div>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">$</span>
                                <input
                                    type="number"
                                    name="proposedPrice"
                                    value={formData.proposedPrice}
                                    onChange={handleChange}
                                    min="1"
                                    step="0.01"
                                    required
                                    className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl text-xl font-bold focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                                    placeholder="Enter your price"
                                />
                            </div>
                            <p className="mt-2 text-sm text-gray-600">
                                💡 Tip: Be competitive but fair. Employers typically expect proposals within 80-120% of the budget.
                            </p>
                        </label>
                    </div>

                    {/* Cover Letter */}
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                        <label className="block">
                            <span className="text-lg font-bold text-gray-900 mb-2 block">Cover Letter *</span>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleChange}
                                rows={10}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
                                placeholder="Tell the employer why you're the best fit for this job...

Include:
• Your relevant experience and skills
• Why you're interested in this project
• How you'll approach the work
• Any questions or clarifications you need"
                            ></textarea>
                            <div className="mt-2 flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {formData.coverLetter.length} characters
                                </span>
                                <span className="text-gray-500">
                                    ⚠️ Your cover letter will be reviewed by moderators
                                </span>
                            </div>
                        </label>
                    </div>

                    {/* Profile Preview */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
                                    {user?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                                </div>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Applying as:</h3>
                                <p className="text-gray-700 font-semibold">{user?.full_name || user?.email}</p>
                                {user?.bio && (
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">{user.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(`/work/${id}`)}
                            className="flex-1 bg-white border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-xl hover:bg-gray-50 transition-colors"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Submitting...
                                </span>
                            ) : (
                                'Submit Proposal'
                            )}
                        </button>
                    </div>

                    {/* Terms Notice */}
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                By submitting this proposal, you agree to FAF's Terms of Service and acknowledge that your cover letter will be reviewed by our moderation system. Approved proposals will be visible to the employer.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplyToJob;
