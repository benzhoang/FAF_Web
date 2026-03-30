import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import disputeApi from '../../api/dispute.api';
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
    
    // Dispute states
    const [showDisputeModal, setShowDisputeModal] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [disputingCheckpoint, setDisputingCheckpoint] = useState(null);

    useEffect(() => {
        fetchActiveContract();
    }, []);

    const fetchActiveContract = async () => {
        try {
            setLoading(true);
            console.log('🔍 [ActiveJob] Fetching active contract...');
            const res = await contractsApi.getMyActiveContract();
            if (res.data) {
                setContract(res.data);
            } else {
                const allRes = await contractsApi.getMyContracts();
                const contracts = allRes?.data ?? [];
                const active = contracts.find(c =>
                    !['COMPLETED', 'CANCELLED'].includes(c.status) &&
                    c.worker_id != null
                );
                if (active) {
                    const fullRes = await contractsApi.getContractById(active.id);
                    setContract(fullRes?.data ?? null);
                } else {
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

    const handleOpenDisputeModal = (checkpoint) => {
        setDisputingCheckpoint(checkpoint);
        setDisputeReason('');
        setShowDisputeModal(true);
    };

    const handleSubmitDispute = async () => {
        if (!disputeReason.trim()) {
            toast.warning('Vui lòng nhập lý do khiếu nại');
            return;
        }

        try {
            setSubmitting(true);
            await disputeApi.create(contract.id, disputingCheckpoint.id, disputeReason);
            toast.success('Hệ thống: Đã gửi khiếu nại thành công. Admin sẽ kiểm tra và phản hồi sớm nhất.');
            setShowDisputeModal(false);
            fetchActiveContract(); // Refresh to see DISPUTED status
        } catch (error) {
            console.error('Error submitting dispute:', error);
            toast.error(error.response?.data?.message || 'Lỗi: Gửi khiếu nại thất bại.');
        } finally {
            setSubmitting(false);
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
                    <div className="p-2 bg-rose-500/20 border border-rose-500/50 rounded-lg shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                        <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            case 'DISPUTED':
                return (
                    <div className="p-2 bg-amber-500/20 border border-amber-500/50 rounded-lg shadow-[0_0_10px_rgba(245,158,11,0.3)] animate-pulse">
                        <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
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

    const bothSigned = contract.signature_worker && contract.signature_client;
    const totalCheckpoints = contract.checkpoints?.length || 0;
    const completedCheckpoints = contract.checkpoints?.filter(cp => cp.status === 'APPROVED').length || 0;
    const progress = totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;
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

    const isFinished = ['COMPLETED', 'CANCELLED'].includes(contract.status);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Job Finished Banner */}
                {isFinished && (
                    <div className={`mb-8 p-8 rounded-[2rem] border flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow ${
                        contract.status === 'COMPLETED' 
                            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200'
                    }`}>
                        <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl shadow-sm ${
                                contract.status === 'COMPLETED' ? 'bg-white text-green-600' : 'bg-white text-red-600'
                            }`}>
                                <svg className={`w-8 h-8 ${contract.status === 'COMPLETED' ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {contract.status === 'COMPLETED' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                    )}
                                </svg>
                            </div>
                            <div>
                                <h2 className={`text-2xl font-black ${contract.status === 'COMPLETED' ? 'text-green-900' : 'text-red-900'}`}>
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
                            className={`px-8 py-3.5 rounded-xl font-bold transition-all shadow-md hover:shadow-lg transform active:scale-95 whitespace-nowrap ${
                                contract.status === 'COMPLETED'
                                    ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-green-500/20'
                                    : 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-red-500/20'
                            }`}
                        >
                            Return to Dashboard
                        </button>
                    </div>
                )}
                {/* Signature Warning */}
                {!bothSigned && (
                    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-[2rem] p-8 mb-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0 p-4 bg-white rounded-2xl shadow-sm">
                                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-yellow-900 mb-2">Contract Signing Required</h3>
                                <p className="text-yellow-800 mb-3">
                                    {!contract.signature_worker && !contract.signature_client && "Both you and the employer need to sign the contract before you can start working."}
                                    {!contract.signature_worker && contract.signature_client && "You need to sign the contract before you can start working."}
                                    {contract.signature_worker && !contract.signature_client && "Waiting for the employer to sign the contract. You'll be notified once they sign."}
                                </p>
                                <div className="flex gap-3 text-sm">
                                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold ${contract.signature_worker ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {contract.signature_worker ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> You signed</> : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Not signed</>}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-semibold ${contract.signature_client ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {contract.signature_client ? <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg> Employer signed</> : <><svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Employer pending</>}
                                    </span>
                                </div>
                                {!contract.signature_worker && (
                                    <button onClick={() => navigate(`/contract/${contract.id}/sign`)} className="mt-6 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-indigo-500 flex items-center gap-2 shadow-md shadow-blue-500/20 transform active:scale-95 transition-all">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        Sign Contract Now
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {/* Expiration Warning */}
                {isExpired && (
                    <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-[2rem] p-8 mb-8 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-5">
                            <div className="flex-shrink-0 p-4 bg-white rounded-2xl shadow-sm">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-red-900 mb-2">Job Contract Expired</h3>
                                <p className="text-red-800 mb-3">
                                    The job end date ({new Date(contract.job_end_date).toLocaleDateString()}) has passed. 
                                    {contract.settlement_requested_at ? " Settlement requested on " + new Date(contract.settlement_requested_at).toLocaleDateString() : " You can request a settlement based on completed checkpoints."}
                                </p>
                                <button onClick={handleRequestSettlement} disabled={!!contract.settlement_requested_at} className={`mt-4 px-8 py-3 font-bold rounded-xl flex items-center gap-2 transition-all shadow-md ${contract.settlement_requested_at ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" : "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-500 hover:to-rose-500 shadow-red-500/20 transform active:scale-95"}`}>
                                    {contract.settlement_requested_at ? "Settlement Requested" : "Request Settlement"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* Header */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                            Back to Dashboard
                        </button>
                        <button onClick={handleStartChat} className="px-4 py-2 bg-blue-50 text-blue-600 font-semibold rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                            Chat with Employer
                        </button>
                    </div>
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{contract.job_title}</h1>
                                {contract.status === 'ACTIVE' && !isFinished && (
                                    <button onClick={handleTerminateContract} className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        Hủy việc (Cancel)
                                    </button>
                                )}
                            </div>
                            <p className="text-gray-600 mb-4">{contract.job_description}</p>
                            <div className="flex items-center gap-6 text-sm mb-4">
                                {contract.job_start_date && (
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-blue-100 rounded">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                        <span className="text-gray-500">Duration:</span>
                                        <span className="font-semibold text-gray-900">{new Date(contract.job_start_date).toLocaleDateString()} - {contract.job_end_date ? new Date(contract.job_end_date).toLocaleDateString() : 'Open'}</span>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-gray-100 rounded">
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                    </div>
                                    <span className="text-gray-500">Client:</span>
                                    <span className="font-semibold text-gray-900">{contract.client_name || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="p-1.5 bg-green-100 rounded">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </div>
                                    <span className="text-gray-500">Total Value:</span>
                                    <span className="font-bold text-green-600">${Number(contract.total_amount || 0).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                        <span className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' : contract.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                            <div className={`w-2 h-2 rounded-full ${contract.status === 'ACTIVE' ? 'bg-blue-600' : contract.status === 'COMPLETED' ? 'bg-green-600' : 'bg-gray-600'}`}></div>
                            {contract.status}
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 mb-8 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Overall Progress</h2>
                        <span className="text-sm font-semibold text-gray-600">{completedCheckpoints} / {totalCheckpoints} Checkpoints Completed</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        <div className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{progress.toFixed(0)}% Complete</p>
                </div>

                {/* Checkpoints List */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 hover:shadow-md transition-shadow">
                    <h2 className="text-2xl font-black text-gray-900 mb-6">Checkpoints</h2>
                    <div className="space-y-4">
                        {contract.checkpoints && contract.checkpoints.length > 0 ? (
                            contract.checkpoints.map((checkpoint, index) => {
                                const canSubmit = bothSigned && checkpoint.status === 'PENDING' && (index === 0 || contract.checkpoints[index - 1]?.status === 'APPROVED');
                                return (
                                    <div key={checkpoint.id} className="rounded-2xl border p-6 relative overflow-hidden flex flex-col transition-all hover:bg-slate-800/20" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(51,65,85,0.7)' }}>
                                        {/* Status top border */}
                                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${
                                            checkpoint.status === 'APPROVED' ? 'from-emerald-600 via-emerald-400 to-emerald-600' :
                                            checkpoint.status === 'REJECTED' ? 'from-rose-600 via-rose-400 to-rose-600' :
                                            checkpoint.status === 'DISPUTED' ? 'from-amber-600 via-amber-400 to-amber-600' :
                                            checkpoint.status === 'SUBMITTED' ? 'from-amber-600 via-amber-400 to-amber-600' :
                                            checkpoint.status === 'IN_PROGRESS' || canSubmit ? 'from-cyan-600 via-cyan-400 to-cyan-600' :
                                            'from-slate-700 via-slate-600 to-slate-700'
                                        }`} />
                                        <div className="flex justify-between items-start gap-5">
                                            <div className="flex items-start gap-4">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded shrink-0 border bg-[#02040a] ${
                                                    checkpoint.status === 'APPROVED' ? 'text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' :
                                                    checkpoint.status === 'REJECTED' ? 'text-rose-400 border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.2)]' :
                                                    checkpoint.status === 'DISPUTED' ? 'text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                                                    checkpoint.status === 'SUBMITTED' ? 'text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]' :
                                                    checkpoint.status === 'IN_PROGRESS' || canSubmit ? 'text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]' :
                                                    'text-slate-500 border-slate-700'
                                                }`}>
                                                    {checkpoint.status === 'APPROVED' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg> :
                                                     checkpoint.status === 'REJECTED' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg> :
                                                     checkpoint.status === 'DISPUTED' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> :
                                                     checkpoint.status === 'SUBMITTED' ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
                                                     checkpoint.status === 'IN_PROGRESS' || canSubmit ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> :
                                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <span className="text-[10px] font-black font-mono text-cyan-500 uppercase tracking-widest">CHECKPOINT 0{index + 1}</span>
                                                        <span className={`px-2 py-0.5 rounded border text-[9px] font-black font-mono tracking-widest uppercase ${
                                                            checkpoint.status === 'APPROVED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' :
                                                            checkpoint.status === 'REJECTED' ? 'bg-rose-900/30 text-rose-400 border-rose-500/30' :
                                                            checkpoint.status === 'DISPUTED' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                                                            checkpoint.status === 'SUBMITTED' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' :
                                                            checkpoint.status === 'IN_PROGRESS' || canSubmit ? 'bg-indigo-900/30 text-indigo-400 border-indigo-500/30' :
                                                            'bg-slate-800 text-slate-400 border-slate-600'
                                                        }`}>{checkpoint.status || 'PENDING'}</span>
                                                    </div>
                                                    <h3 className="text-sm font-black text-white tracking-wide uppercase">{checkpoint.title || `Phase ${index + 1}`}</h3>
                                                    {checkpoint.description && <p className="text-[12px] text-slate-400 font-mono mt-2">{checkpoint.description}</p>}
                                                </div>
                                            </div>
                                            {checkpoint.amount && <div className="text-lg font-black text-cyan-400 font-mono">${Number(checkpoint.amount).toLocaleString()}</div>}
                                        </div>

                                        {/* Submission details */}
                                        {checkpoint.submission_url && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/50 bg-slate-900/30 rounded-lg p-3">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                    <span className="text-[10px] font-black tracking-widest text-cyan-500 uppercase font-mono">YOUR SUBMISSION</span>
                                                </div>
                                                <div className="bg-[#02040a] border border-cyan-500/20 p-2.5 rounded text-[11px] font-mono break-all mb-2">
                                                    <a href={checkpoint.submission_url} target="_blank" rel="noreferrer" className="text-cyan-400 hover:text-cyan-300 underline">{checkpoint.submission_url}</a>
                                                </div>
                                                {checkpoint.submission_notes && <p className="text-[12px] text-slate-400 font-mono italic">"{checkpoint.submission_notes}"</p>}
                                            </div>
                                        )}

                                        {/* Review details with Dispute button */}
                                        {checkpoint.review_notes && (
                                            <div className={`mt-3 border-l-[3px] p-3 rounded-r-lg ${checkpoint.status === 'APPROVED' ? 'border-emerald-500 bg-emerald-900/10' : 'border-rose-500 bg-rose-900/10'}`}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-[9px] font-black tracking-widest text-slate-400 uppercase font-mono block">CLIENT REVIEW</span>
                                                    {checkpoint.status === 'REJECTED' && !isFinished && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleOpenDisputeModal(checkpoint); }}
                                                            className="text-[10px] bg-rose-500/20 hover:bg-rose-500/40 text-rose-500 px-2 py-1 rounded border border-rose-500/50 font-black font-mono tracking-widest uppercase transition-all flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                            MỞ KHIẾU NẠI (DISPUTE)
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-sm text-slate-200 font-mono italic">"{checkpoint.review_notes}"</p>
                                            </div>
                                        )}

                                        {/* Disputed Status Banner */}
                                        {checkpoint.status === 'DISPUTED' && (
                                            <div className="mt-3 bg-amber-900/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 border border-amber-500/30">
                                                    <svg className="w-5 h-5 text-amber-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                                </div>
                                                <div>
                                                    <h4 className="text-[10px] font-black font-mono text-amber-500 uppercase tracking-widest mb-1">ĐANG TRONG QUÁ TRÌNH KHIẾU NẠI</h4>
                                                    <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                                                        &gt; Hệ thống đang xem xét yêu cầu của bạn. Admin sẽ tham gia phân xử dựa trên kết quả bàn giao và yêu cầu của khách hàng. <br/>
                                                        &gt; Vui lòng giữ liên lạc qua hộp thư hỗ trợ.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        {canSubmit && !isFinished && (
                                            <button onClick={() => navigate(`/workspace/checkpoint/${checkpoint.id}`)} className="mt-6 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-xl hover:from-cyan-500 hover:to-blue-500 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transform active:scale-[0.98] text-[11px] font-mono tracking-widest uppercase border border-cyan-400/50">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                BẮT ĐẦU LÀM
                                            </button>
                                        )}

                                        {checkpoint.status === 'SUBMITTED' && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col items-center gap-3">
                                                <p className="text-[10px] text-amber-500 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    ĐANG CHỜ KHÁCH HÀNG KIỂM DUYỆT...
                                                </p>
                                                {!isFinished && (
                                                    <button onClick={() => navigate(`/workspace/checkpoint/${checkpoint.id}`)} className="w-full py-3 border border-amber-500/50 text-amber-400 bg-amber-900/20 hover:bg-amber-900/40 hover:text-amber-300 font-black rounded-xl text-[11px] font-mono transition-all">
                                                        CHỈNH SỬA BÀI NỘP
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {checkpoint.status === 'REJECTED' && !isFinished && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col items-center gap-2">
                                                <p className="text-[10px] text-rose-500 font-mono tracking-widest uppercase mb-2 text-center">BÀI NỘP ĐÃ BỊ TỪ CHỐI. VUI LÒNG CHỈNH SỬA HOẶC KHIẾU NẠI.</p>
                                                <button onClick={() => navigate(`/workspace/checkpoint/${checkpoint.id}`)} className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-black rounded-xl hover:from-rose-500 hover:to-rose-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.3)] transform active:scale-[0.98] text-[11px] font-mono tracking-widest uppercase border border-rose-400/50">
                                                    SỬA LẠI VÀ NỘP LẠI (REWORK)
                                                </button>
                                            </div>
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

            {/* Dispute Modal */}
            {showDisputeModal && (
                <div className="fixed inset-0 bg-[#02040a]/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 font-mono">
                    <div className="bg-[#090e17] border border-rose-500/30 rounded-2xl max-w-lg w-full p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-600 via-rose-400 to-rose-600"></div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-white uppercase tracking-widest">MỞ KHIẾU NẠI</h3>
                                <p className="text-[10px] text-rose-500/70 font-mono uppercase tracking-[0.2em] mt-1">CHECKPOINT ID: #{disputingCheckpoint?.id}</p>
                            </div>
                        </div>
                        <div className="mb-8 p-4 bg-rose-900/10 border border-rose-500/20 rounded-xl">
                            <p className="text-[11px] text-rose-400 leading-relaxed">
                                &gt; CẢNH BÁO: KHIẾU NẠI SẼ TẠM DỪNG HỢP ĐỒNG ĐỂ ADMIN PHÂN XỬ. <br/>
                                &gt; VUI LÒNG GIẢI THÍCH LÝ DO BẠN CHO RẰNG BẢN NỘP NÀY ĐẠT YÊU CẦU.
                            </p>
                        </div>
                        <div className="mb-8">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">LÝ DO KHIẾU NẠI <span className="text-rose-500">*</span></label>
                            <textarea
                                value={disputeReason}
                                onChange={(e) => setDisputeReason(e.target.value)}
                                placeholder="Nhập chi tiết lý do..."
                                rows={5}
                                className="w-full px-4 py-3 bg-[#02040a] border border-rose-500/30 rounded-xl focus:outline-none focus:border-rose-400 text-white font-mono text-sm"
                            />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setShowDisputeModal(false)} className="flex-1 px-6 py-4 border border-slate-700 text-slate-500 font-black text-[12px] uppercase rounded-xl hover:bg-slate-800 transition-all">HỦY BỎ</button>
                            <button onClick={handleSubmitDispute} disabled={submitting} className="flex-[2] px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-700 text-white font-black text-[12px] uppercase rounded-xl hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] border border-rose-400/50">
                                {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'GỬI KHIẾU NẠI'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ActiveJob;
