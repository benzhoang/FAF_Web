import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import { chatApi } from '../../api/chat.api';
import { useChatContext } from '../../contexts/ChatContext';

const ActiveJob = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { openChat } = useChatContext();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [submissionNotes, setSubmissionNotes] = useState('');
    const [showSubmitModal, setShowSubmitModal] = useState(false);

    useEffect(() => {
        fetchActiveContract();
    }, []);

    const fetchActiveContract = async () => {
        try {
            setLoading(true);
            console.log('🔍 [ActiveJob] Fetching active contract...');
            const res = await contractsApi.getMyActiveContract();
            // axiosClient interceptor unwraps response.data, so res = { data: contract }
            console.log('📦 [ActiveJob] Full response from getMyActiveContract:', res);
            console.log('📄 [ActiveJob] res.data:', res?.data);
            if (res.data) {
                console.log('✅ [ActiveJob] Contract found, id:', res.data.id, 'status:', res.data.status);
                setContract(res.data);
            } else {
                console.warn('⚠️ [ActiveJob] No contract from primary API. Trying fallback via getMyContracts...');
                // Fallback: look through all my contracts for one that's not completed/cancelled
                const allRes = await contractsApi.getMyContracts();
                console.log('📦 [ActiveJob] All contracts:', allRes?.data);
                const contracts = allRes?.data ?? [];
                // Log each contract detail for debugging
                contracts.forEach((c, i) => {
                    console.log(`📋 [ActiveJob] Contract[${i}]:`, {
                        id: c.id, status: c.status, 
                        worker_id: c.worker_id, client_id: c.client_id,
                        sig_worker: !!c.signature_worker, sig_client: !!c.signature_client
                    });
                });
                // Accept any contract where user is worker and not terminated
                const active = contracts.find(c =>
                    !['COMPLETED', 'CANCELLED'].includes(c.status) &&
                    c.worker_id != null
                );
                console.log('🔎 [ActiveJob] Fallback found:', active);
                if (active) {
                    // Fetch full contract data (with checkpoints)
                    const fullRes = await contractsApi.getContractById(active.id);
                    console.log('📦 [ActiveJob] Full contract data:', fullRes?.data);
                    setContract(fullRes?.data ?? null);
                } else {
                    console.error('❌ [ActiveJob] No active contract found anywhere!');
                    setContract(null);
                }
            }
        } catch (error) {
            console.error('❌ [ActiveJob] Error fetching active contract:', error);
            setContract(null);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSubmitModal = (checkpoint) => {
        setSelectedCheckpoint(checkpoint);
        setSubmissionUrl('');
        setSubmissionNotes('');
        setShowSubmitModal(true);
    };

    const handleSubmitCheckpoint = async () => {
        if (!submissionUrl.trim()) {
            toast.warning('Please provide a submission URL');
            return;
        }

        try {
            setSubmitting(true);
            await contractsApi.submitCheckpoint(selectedCheckpoint.id, {
                submission_url: submissionUrl,
                submission_notes: submissionNotes
            });
            
            toast.success('Checkpoint submitted successfully!');
            setShowSubmitModal(false);
            fetchActiveContract(); // Refresh
        } catch (error) {
            console.error('Error submitting checkpoint:', error);
            toast.error(error.response?.data?.message || 'Failed to submit checkpoint');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-700';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'PENDING': 
                return (
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'SUBMITTED':
                return (
                    <div className="p-2 bg-yellow-100 rounded-lg">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                );
            case 'APPROVED':
                return (
                    <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className="p-2 bg-red-100 rounded-lg">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default: 
                return (
                    <div className="p-2 bg-gray-100 rounded-lg">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading your active job...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-md p-8 bg-white rounded-xl shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">No Active Job</h2>
                    <p className="text-gray-600 mb-6">You don't have any active job at the moment.</p>
                    <button 
                        onClick={() => navigate('/find-work')}
                        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                    >
                        Browse Available Jobs
                    </button>
                </div>
            </div>
        );
    }

    // Check if both parties signed the contract
    const bothSigned = contract.signature_worker && contract.signature_client;
    
    // Calculate checkpoint progress
    const totalCheckpoints = contract.checkpoints?.length || 0;
    const completedCheckpoints = contract.checkpoints?.filter(cp => cp.status === 'APPROVED').length || 0;
    const progress = totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;

    // Check for expiration
    const isExpired = contract.job_end_date && new Date() > new Date(contract.job_end_date) && contract.status === 'ACTIVE';

    const handleRequestSettlement = async () => {
        try {
            if (contract.settlement_requested_at) {
                toast.info("Settlement already requested.");
                return;
            }
            if (!window.confirm("Are you sure you want to request settlement for this expired job?")) return;
            
            await contractsApi.requestSettlement(contract.id);
            toast.success("Settlement request sent to employer!");
            fetchActiveContract();
        } catch (error) {
            console.error(error);
            toast.error("Failed to request settlement");
        }
    };

    const handleStartChat = async () => {
        try {
            console.log('🔍 Opening floating chat with client_id:', contract.client_id);
            await openChat(contract.client_id);
        } catch (error) {
            console.error('Error starting chat:', error);
            toast.error('Failed to open chat');
        }
    };

    const handleTerminateContract = async () => {
        if (!window.confirm("WARNING: Are you sure you want to cancel this job? This will refund remaining funds to the employer and you won't be paid for pending checkpoints.")) return;
        
        try {
            setLoading(true);
            await contractsApi.terminateContract(contract.id);
            toast.success("Job cancelled successfully. Remaining funds refunded to employer.");
            navigate('/dashboard');
        } catch (error) {
            console.error('Error terminating contract:', error);
            toast.error(error.response?.data?.message || 'Failed to cancel job');
        } finally {
            setLoading(false);
        }
    };

    // If job is finished (COMPLETED or CANCELLED), show ended state
    const isFinished = ['COMPLETED', 'CANCELLED'].includes(contract.status);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Job Finished Banner */}
                {isFinished && (
                    <div className={`mb-6 p-6 rounded-2xl border-2 flex items-center justify-between ${
                        contract.status === 'COMPLETED' 
                            ? 'bg-green-50 border-green-200' 
                            : 'bg-red-50 border-red-200'
                    }`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${
                                contract.status === 'COMPLETED' ? 'bg-green-100' : 'bg-red-100'
                            }`}>
                                <svg className={`w-8 h-8 ${
                                    contract.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {contract.status === 'COMPLETED' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black ${
                                    contract.status === 'COMPLETED' ? 'text-green-900' : 'text-red-900'
                                }`}>
                                    This Job is {contract.status}
                                </h2>
                                <p className={contract.status === 'COMPLETED' ? 'text-green-700' : 'text-red-700'}>
                                    {contract.status === 'COMPLETED' 
                                        ? 'Great work! This contract has been finalized and fully paid.' 
                                        : 'This contract was cancelled. No further work can be submitted.'}
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className={`px-6 py-3 rounded-xl font-bold transition-all shadow-sm hover:shadow-md ${
                                contract.status === 'COMPLETED'
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-red-600 text-white hover:bg-red-700'
                            }`}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
                {/* Signature Warning if not both signed */}
                {!bothSigned && (
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-yellow-100 rounded-xl">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-yellow-900 mb-2">Contract Signing Required</h3>
                                <p className="text-yellow-800 mb-3">
                                    {!contract.signature_worker && !contract.signature_client && 
                                        "Both you and the employer need to sign the contract before you can start working."}
                                    {!contract.signature_worker && contract.signature_client && 
                                        "You need to sign the contract before you can start working."}
                                    {contract.signature_worker && !contract.signature_client && 
                                        "Waiting for the employer to sign the contract. You'll be notified once they sign."}
                                </p>
                                <div className="flex gap-3 text-sm">
                                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold ${contract.signature_worker ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {contract.signature_worker ? (
                                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> You signed</>
                                        ) : (
                                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Not signed</>
                                        )}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold ${contract.signature_client ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {contract.signature_client ? (
                                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Employer signed</>
                                        ) : (
                                            <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Employer pending</>
                                        )}
                                    </span>
                                </div>
                                {!contract.signature_worker && (
                                    <button
                                        onClick={() => navigate(`/contract/${contract.id}/sign`)}
                                        className="mt-4 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        Sign Contract Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Expiration Warning */}
                {isExpired && (
                    <div className="bg-red-50 border-2 border-red-300 rounded-xl p-6 mb-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 bg-red-100 rounded-xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-900 mb-2">Job Contract Expired</h3>
                                <p className="text-red-800 mb-3">
                                    The job end date ({new Date(contract.job_end_date).toLocaleDateString()}) has passed. 
                                    {contract.settlement_requested_at 
                                        ? " Settlement requested on " + new Date(contract.settlement_requested_at).toLocaleDateString()
                                        : " You can request a settlement based on completed checkpoints."}
                                </p>
                                <button
                                    onClick={handleRequestSettlement}
                                    disabled={!!contract.settlement_requested_at}
                                    className={`px-6 py-2.5 font-semibold rounded-lg flex items-center gap-2 ${
                                        contract.settlement_requested_at 
                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                            : "bg-red-600 text-white hover:bg-red-700"
                                    }`}
                                >
                                    {contract.settlement_requested_at ? "Settlement Requested" : "Request Settlement"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        
                        {/* Chat Button */}
                        <button 
                            onClick={handleStartChat}
                            className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Chat with Employer
                        </button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{contract.job_title}</h1>
                                {contract.status === 'ACTIVE' && !isFinished && (
                                    <button
                                        onClick={handleTerminateContract}
                                        className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Hủy việc (Cancel)
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4">{contract.job_description}</p>
                            
                            <div className="flex items-center gap-6 text-sm mb-4">
                                {contract.job_start_date && (
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="font-semibold text-gray-900">
                                            {new Date(contract.job_start_date).toLocaleDateString()} - {contract.job_end_date ? new Date(contract.job_end_date).toLocaleDateString() : 'Open'}
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 rounded">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-500">Client:</span>
                                    <span className="font-semibold text-gray-900">{contract.client_name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 rounded">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-gray-500">Total Value:</span>
                                    <span className="font-bold text-green-600">${Number(contract.total_amount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${
                            contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                            contract.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                contract.status === 'ACTIVE' ? 'bg-blue-600' :
                                contract.status === 'COMPLETED' ? 'bg-green-600' :
                                'bg-gray-600'
                            }`}></div>
                            {contract.status}
                        </span>
                    </div>
                </div>

                {/* Progress */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-lg font-bold text-gray-900">Overall Progress</h2>
                        <span className="text-sm font-semibold text-gray-600">
                            {completedCheckpoints} / {totalCheckpoints} Checkpoints Completed
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{progress.toFixed(0)}% Complete</p>
                </div>

                {/* Checkpoints List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Checkpoints</h2>
                    
                    <div className="space-y-4">
                        {contract.checkpoints && contract.checkpoints.length > 0 ? (
                            contract.checkpoints.map((checkpoint, index) => {
                                const canSubmit = bothSigned && 
                                    checkpoint.status === 'PENDING' && 
                                    (index === 0 || contract.checkpoints[index - 1]?.status === 'APPROVED');
                                
                                return (
                                    <div 
                                        key={checkpoint.id}
                                        className={`border-2 rounded-xl p-5 transition-all ${
                                            checkpoint.status === 'APPROVED' ? 'border-green-200 bg-green-50/30' :
                                            checkpoint.status === 'SUBMITTED' ? 'border-yellow-200 bg-yellow-50/30' :
                                            canSubmit ? 'border-blue-200 bg-blue-50/30' :
                                            'border-gray-200 bg-gray-50/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className="flex items-start gap-3">
                                                {getStatusIcon(checkpoint.status)}
                                                <div>
                                                    <h3 className="font-bold text-gray-900 text-lg">
                                                        Checkpoint {checkpoint.checkpoint_index}: {checkpoint.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1">{checkpoint.description}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-gray-900">${Number(checkpoint.amount).toLocaleString()}</p>
                                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(checkpoint.status)}`}>
                                                    {checkpoint.status}
                                                </span>
                                            </div>
                                        </div>

                                        {checkpoint.due_date && (
                                            <p className="text-xs text-gray-500 mb-3 flex items-center gap-1.5">
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                Due: {new Date(checkpoint.due_date).toLocaleDateString()}
                                            </p>
                                        )}

                                        {/* Submission Info */}
                                        {checkpoint.submission_url && (
                                            <div className="bg-white rounded-lg p-3 mt-3 border border-gray-200">
                                                <p className="text-xs font-semibold text-gray-600 mb-1">Your Submission:</p>
                                                <a 
                                                    href={checkpoint.submission_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-700 text-sm underline break-all"
                                                >
                                                    {checkpoint.submission_url}
                                                </a>
                                                {checkpoint.submission_notes && (
                                                    <p className="text-sm text-gray-700 mt-2">{checkpoint.submission_notes}</p>
                                                )}
                                                {checkpoint.submitted_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Submitted on {new Date(checkpoint.submitted_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Review Notes */}
                                        {checkpoint.review_notes && (
                                            <div className={`rounded-lg p-3 mt-3 border ${
                                                checkpoint.status === 'APPROVED' 
                                                    ? 'bg-green-50 border-green-200' 
                                                    : 'bg-red-50 border-red-200'
                                            }`}>
                                                <p className="text-xs font-semibold text-gray-700 mb-1">Client Review:</p>
                                                <p className="text-sm text-gray-800">{checkpoint.review_notes}</p>
                                                {checkpoint.reviewed_at && (
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Reviewed on {new Date(checkpoint.reviewed_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        {canSubmit && !isFinished && (
                                            <button
                                                onClick={() => handleOpenSubmitModal(checkpoint)}
                                                className="mt-4 w-full py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Submit Work
                                            </button>
                                        )}

                                        {!canSubmit && checkpoint.status === 'PENDING' && index > 0 && (
                                            <p className="mt-4 text-sm text-gray-500 italic text-center">
                                                Complete previous checkpoint first
                                            </p>
                                        )}

                                        {checkpoint.status === 'SUBMITTED' && (
                                            <p className="mt-4 text-sm text-yellow-700 font-medium text-center flex items-center justify-center gap-2">
                                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                                </svg>
                                                Waiting for client review...
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <p className="text-gray-500 italic text-center py-8">No checkpoints defined</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Modal */}
            {showSubmitModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-lg w-full p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Submit Checkpoint: {selectedCheckpoint?.title}
                        </h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Submission URL <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="url"
                                value={submissionUrl}
                                onChange={(e) => setSubmissionUrl(e.target.value)}
                                placeholder="https://drive.google.com/... or GitHub link"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Link to your deliverable (Google Drive, GitHub, etc.)
                            </p>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Notes (Optional)
                            </label>
                            <textarea
                                value={submissionNotes}
                                onChange={(e) => setSubmissionNotes(e.target.value)}
                                placeholder="Any additional notes for the client..."
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowSubmitModal(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                disabled={submitting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitCheckpoint}
                                className="flex-1 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                disabled={submitting}
                            >
                                {submitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveJob;
