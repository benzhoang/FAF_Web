import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobsApi } from '../../api/jobs.api';
import { contractsApi } from '../../api/contracts.api';
import { chatApi } from '../../api/chat.api';
import { useToast } from '../../contexts/ToastContext';
import { useChatContext } from '../../contexts/ChatContext';

const WorkDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const { openChat } = useChatContext();
    
    const [job, setJob] = useState(null);
    const [contractDetail, setContractDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const res = await jobsApi.getJobDetail(id);
            setJob(res.data);
            
            // 🔍 DEBUG: Log job data to console
            console.log('=== JOB DETAIL DATA ===');
            console.log('Full job data:', res.data);
            console.log('Contract:', res.data.contract);
            console.log('Checkpoints:', res.data.checkpoints);
            console.log('Client:', res.data.client);
            console.log('=======================');

            // Fetch full contract details if contract exists
            if (res.data.contract?.id) {
                try {
                    console.log('Fetching contract detail for ID:', res.data.contract.id);
                    const contractRes = await contractsApi.getContractById(res.data.contract.id);
                    console.log('Contract detail fetched:', contractRes.data);
                    setContractDetail(contractRes.data);
                } catch (contractErr) {
                    console.warn('Failed to fetch contract detail:', contractErr);
                    // Use basic contract info from job data as fallback
                    setContractDetail(res.data.contract);
                }
            }
        } catch (err) {
            console.error('Failed to fetch job:', err);
            setError('Failed to load job details');
        } finally {
            setLoading(false);
        }
    };

    const handleContactEmployer = async () => {
        if (!job?.client_id) {
            toast.error('Employer information not found');
            return;
        }
        try {
            console.log('🔍 Opening floating chat with client_id:', job.client_id);
            await openChat(job.client_id);
        } catch (err) {
            console.error('Failed to open chat:', err);
            toast.error('Failed to open chat with employer');
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-blue-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 font-semibold">Loading job details...</p>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="w-full min-h-screen bg-blue-100 flex items-center justify-center">
                <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                        <p className="text-gray-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
                        <button
                            onClick={() => navigate('/find-work')}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl"
                        >
                            Browse Jobs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-blue-100">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="bg-white/95 rounded-3xl shadow-sm border border-gray-100 p-6 lg:p-8">
                    {/* Breadcrumb */}
                    <nav className="mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
                            <span>›</span>
                            <Link to="/find-work" className="hover:text-blue-600 transition-colors">{job.category_name || 'Jobs'}</Link>
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
                                            {job.client && (
                                                <div className="text-sm text-gray-600">
                                                    <span className="font-bold text-gray-900">
                                                        Posted by: {job.client.full_name || job.client.email?.split('@')[0] || 'Employer'}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="text-sm text-gray-600">
                                                Type: <span className="font-semibold">{job.job_type === 'SHORT_TERM' ? 'Short-term' : 'Long-term'}</span>
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Duration: <span className="font-semibold">
                                                    {job.start_date ? new Date(job.start_date).toLocaleDateString() : 'ASAP'} - {job.end_date ? new Date(job.end_date).toLocaleDateString() : 'Open'}
                                                </span>
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

                            {/* Required Skills */}
                            {job.skills && job.skills.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-900 mb-4">Required Skills</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-sm font-semibold text-blue-900">{typeof skill === 'string' ? skill : skill.name}</span>
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Checkpoints/Milestones */}
                            {job.checkpoints && job.checkpoints.length > 0 && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                    <h2 className="text-xl font-extrabold text-gray-900 mb-4">Project Milestones</h2>
                                    <div className="space-y-4">
                                        {job.checkpoints.map((checkpoint, index) => (
                                            <div key={checkpoint.id || index} className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                                                <div className="flex items-start justify-between gap-4 mb-2">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="text-sm font-bold text-blue-600">Milestone {index + 1}</span>
                                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                                                                {checkpoint.status || 'PENDING'}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-base font-extrabold text-gray-900 mb-1">{checkpoint.name || `Checkpoint ${index + 1}`}</h3>
                                                        {checkpoint.description && (
                                                            <p className="text-sm text-gray-600">{checkpoint.description}</p>
                                                        )}
                                                    </div>
                                                    {checkpoint.amount && (
                                                        <div className="text-right shrink-0">
                                                            <div className="text-lg font-extrabold text-gray-900">${Number(checkpoint.amount).toLocaleString()}</div>
                                                        </div>
                                                    )}
                                                </div>
                                                {checkpoint.deadline && (
                                                    <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3M3 11h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Due: {new Date(checkpoint.deadline).toLocaleDateString()}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Contract Details */}
                            {contractDetail && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-xl font-extrabold text-gray-900">Contract Document</h2>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 rounded-full">
                                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                                            <span className="text-xs font-bold text-blue-700">{contractDetail.status || 'DRAFT'}</span>
                                        </div>
                                    </div>

                                    {/* Contract Summary */}
                                    <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Total Contract Value</div>
                                            <div className="text-2xl font-extrabold text-blue-600">${Number(contractDetail.total_amount || 0).toLocaleString()}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-500 uppercase mb-1">Contract ID</div>
                                            <div className="text-lg font-bold text-gray-900">#{contractDetail.id}</div>
                                        </div>
                                    </div>

                                    {/* Contract Content - Document Style */}
                                    {(contractDetail.contract_content || contractDetail.terms) && (
                                        <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                                            {/* Document Header */}
                                            <div className="bg-gray-800 text-white px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                    <div>
                                                        <div className="text-sm font-bold">FAF Platform Employment Contract</div>
                                                        <div className="text-xs text-gray-300">Legally binding agreement</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Document Body */}
                                            <div className="bg-white p-8">
                                                {/* Contract Content with HTML rendering */}
                                                <div 
                                                    className="prose prose-sm max-w-none
                                                    prose-headings:font-extrabold prose-headings:text-gray-900 prose-headings:mb-3
                                                    prose-h2:text-lg prose-h2:border-b-2 prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6
                                                    prose-h3:text-base prose-h3:text-blue-700 prose-h3:mt-4
                                                    prose-p:text-sm prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-3
                                                    prose-strong:text-gray-900 prose-strong:font-bold
                                                    prose-ul:list-disc prose-ul:ml-6 prose-ul:text-sm prose-ul:text-gray-700
                                                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:text-sm prose-ol:text-gray-700"
                                                    dangerouslySetInnerHTML={{ 
                                                        __html: contractDetail.contract_content || contractDetail.terms 
                                                    }}
                                                />
                                            </div>

                                            {/* Document Footer */}
                                            <div className="bg-gray-50 px-8 py-4 border-t-2 border-gray-200">
                                                <div className="flex items-center justify-between text-xs text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                        </svg>
                                                        <span className="font-semibold">Secured by FAF Escrow System</span>
                                                    </div>
                                                    {contractDetail.created_at && (
                                                        <span>Created: {new Date(contractDetail.created_at).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Contract Actions */}
                                    <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                                        <div className="flex items-start gap-3">
                                            <svg className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="flex-1">
                                                <div className="text-sm font-bold text-amber-900 mb-1">Important Notice</div>
                                                <p className="text-xs text-amber-800 leading-relaxed">
                                                    By submitting a proposal, you acknowledge that you have read and agree to the terms outlined in this contract. 
                                                    Payment will be processed through FAF's secure escrow system upon milestone completion.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Budget */}
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h2 className="text-xl font-extrabold text-gray-900 mb-4">Budget</h2>
                                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
                                    <div className="text-center">
                                        <div className="text-sm text-gray-600 mb-2">Total Budget</div>
                                        <div className="text-4xl font-extrabold text-blue-600">${Number(job.budget || 0).toLocaleString()}</div>
                                        <div className="mt-4 text-xs text-gray-500">Payment secured via FAF Escrow</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 h-fit space-y-6">
                            {/* Apply Now Button */}
                            <button
                                onClick={() => navigate(`/apply/${id}`)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 px-6 rounded-xl transition-all shadow-lg mb-4"
                            >
                                Apply Now
                            </button>

                            {/* Contact Employer Button */}
                            <button
                                onClick={handleContactEmployer}
                                className="w-full bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-extrabold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 mb-6"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                                Contact Employer
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
                            {job.client && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-4">ABOUT THE EMPLOYER</h3>

                                    {/* Employer Info */}
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center border-2 border-blue-200">
                                            <span className="text-white font-extrabold text-xl">
                                                {(job.client.full_name || job.client.email)?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-base font-extrabold text-gray-900 truncate">
                                                    {job.client.full_name || job.client.email?.split('@')[0] || 'Employer'}
                                                </h4>
                                                <svg className="w-5 h-5 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                {job.client.email}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Stats */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Posted Jobs</div>
                                            <div className="text-lg font-extrabold text-gray-900">{job.client.total_jobs || 1}</div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Member Since</div>
                                            <div className="text-sm font-extrabold text-gray-900">
                                                {job.client.created_at ? new Date(job.client.created_at).getFullYear() : '2024'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Terms Notice */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2">
                                            <svg className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                By applying, you agree to the FAF Contract Terms and Escrow Policy.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkDetail
