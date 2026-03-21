import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import { chatApi } from '../../api/chat.api';

const CheckpointReview = () => {
    const { contractId } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewing, setReviewing] = useState(false);
    const [selectedCheckpoint, setSelectedCheckpoint] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [reviewNotes, setReviewNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);

    console.log('CheckpointReview mounted, contractId:', contractId);

    useEffect(() => {
        if (contractId) {
            fetchContract();
        } else {
            console.error('CheckpointReview: No contractId provided');
            setError('Invalid contract link');
            setLoading(false);
        }
    }, [contractId]);

    const fetchContract = async () => {
        try {
            setLoading(true);
            const res = await contractsApi.getContract(contractId);
            setContract(res.data);
        } catch (error) {
            console.error('Error fetching contract:', error);
            toast.error('Failed to load contract');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        try {
            setReviewing(true);
            await contractsApi.approveCheckpoint(selectedCheckpoint.id, reviewNotes);
            toast.success('Checkpoint approved! Payment released.');
            setShowApproveModal(false);
            setReviewNotes('');
            fetchContract();
        } catch (error) {
            console.error('Error approving checkpoint:', error);
            toast.error(error.response?.data?.message || 'Failed to approve checkpoint');
        } finally {
            setReviewing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            toast.warning('Please provide a reason for rejection');
            return;
        }

        try {
            setReviewing(true);
            await contractsApi.rejectCheckpoint(selectedCheckpoint.id, reviewNotes, rejectReason);
            toast.success('Checkpoint rejected with feedback');
            setShowRejectModal(false);
            setReviewNotes('');
            setRejectReason('');
            fetchContract();
        } catch (error) {
            console.error('Error rejecting checkpoint:', error);
            toast.error(error.response?.data?.message || 'Failed to reject checkpoint');
        } finally {
            setReviewing(false);
        }
    };

    const openApproveModal = (checkpoint) => {
        setSelectedCheckpoint(checkpoint);
        setReviewNotes('');
        setShowApproveModal(true);
    };

    const openRejectModal = (checkpoint) => {
        setSelectedCheckpoint(checkpoint);
        setReviewNotes('');
        setRejectReason('');
        setShowRejectModal(true);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex">
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading checkpoints...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-transparent flex">
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contract Not Found</h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Unable to load contract details.</p>
                        <button
                            onClick={() => navigate('/task-owner')}
                            className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const totalCheckpoints = contract.checkpoints?.length || 0;
    const isExpired = contract.job_end_date && new Date() > new Date(contract.job_end_date) && contract.status === 'ACTIVE';
    const completedCheckpoints = contract.checkpoints?.filter(cp => cp.status === 'APPROVED').length || 0;
    const pendingReview = contract.checkpoints?.filter(cp => cp.status === 'SUBMITTED').length || 0;
    const progress = totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;



    const handleFinalizeSettlement = async () => {
        if (!window.confirm("This will close the contract, cancel pending checkpoints, and refund the remaining budget to your wallet. Continue?")) return;

        try {
            setActionLoading(true);
            await contractsApi.finalizeSettlement(contract.id);
            toast.success("Settlement finalized. Remaining budget refunded.");
            fetchContract();
        } catch (error) {
            console.error('Error finalizing settlement:', error);
            toast.error(error.response?.data?.message || 'Failed to finalize settlement');
        } finally {
            setActionLoading(false);
        }
    };

    const handleStartChat = async () => {
        try {
            const res = await chatApi.startChat(contract.worker_id);
            navigate('/messages');
        } catch (error) {
            console.error('Error starting chat:', error);
            toast.error('Failed to open chat');
        }
    };

    const handleTerminateContract = async () => {
        if (!window.confirm("WARNING: Are you sure you want to terminate this contract? All pending milestone funds will be refunded to your wallet, and the job will be re-opened for other workers.")) return;
        
        try {
            setActionLoading(true);
            await contractsApi.terminateContract(contract.id);
            toast.success("Contract terminated and funds refunded.");
            navigate('/task-owner');
        } catch (error) {
            console.error('Error terminating contract:', error);
            toast.error(error.response?.data?.message || 'Failed to terminate contract');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent flex">
            
            <div className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-6 py-8">
                    {/* Dispute Warning */}
                    {contract.status === 'DISPUTED' && (
                        <div className="bg-rose-50 dark:bg-rose-900/30 border-2 border-rose-300 dark:border-rose-800/50 rounded-xl p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-3 bg-rose-100 dark:bg-rose-900/40 rounded-xl">
                                    <svg className="w-6 h-6 text-rose-600 dark:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-rose-900 dark:text-rose-100 mb-2">Contract in Dispute</h3>
                                    <p className="text-rose-800 dark:text-rose-200 mb-3 text-sm">
                                        This contract is currently under dispute. A Manager is overseeing the resolution process. 
                                        Please participate in the 3-party chat to provide your evidence or feedback.
                                    </p>
                                    <button
                                        onClick={() => navigate(`/disputes/search?contractId=${contract.id}`)}
                                        className="px-6 py-2.5 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700 transition-colors flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                        </svg>
                                        Go to Dispute Chat
                                    </button>
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
                                    <h3 className="text-lg font-bold text-red-900 mb-2">Contract Expired</h3>
                                    <p className="text-red-800 mb-3">
                                        The contract end date ({new Date(contract.job_end_date).toLocaleDateString()}) has passed. 
                                        You should review remaining work and settle the contract.
                                        {contract.settlement_requested_at && (
                                            <span className="block font-semibold mt-1">
                                                Worker requested settlement on {new Date(contract.settlement_requested_at).toLocaleDateString()}.
                                            </span>
                                        )}
                                    </p>
                                    <button
                                        onClick={handleFinalizeSettlement}
                                        disabled={actionLoading}
                                        className="px-6 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 flex items-center gap-2"
                                    >
                                        {actionLoading ? "Processing..." : "Finalize Settlement & Refund Remaining"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/task-owner')}
                            className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium text-sm mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Checkpoint Review</h1>
                                    <p className="text-gray-600 dark:text-gray-400">{contract.job_title}</p>
                                </div>
                                {contract.status === 'ACTIVE' && (
                                    <button
                                        onClick={handleTerminateContract}
                                        className="mt-1 text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Terminate Contract
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleStartChat}
                                    className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-2 border border-transparent dark:border-blue-800/50"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Chat with Worker
                                </button>

                                {pendingReview > 0 && (
                                    <div className="px-4 py-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 rounded-lg font-semibold flex items-center gap-2 border border-transparent dark:border-yellow-700/50">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {pendingReview} Pending Review
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contract Info Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 mb-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Worker</p>
                                <p className="font-semibold text-gray-900 dark:text-white">{contract.worker_name || 'Unknown'}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">Total Contract Value</p>
                                <p className="font-bold text-green-600 text-xl">${Number(contract.total_amount || 0).toLocaleString()}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Progress</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{progress.toFixed(0)}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkpoints List */}
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Checkpoints</h2>
                        
                        <div className="space-y-4">
                            {contract.checkpoints && contract.checkpoints.length > 0 ? (
                                contract.checkpoints.map((checkpoint, index) => {
                                    const isSubmitted = checkpoint.status === 'SUBMITTED';
                                    const isApproved = checkpoint.status === 'APPROVED';
                                    const isRejected = checkpoint.status === 'REJECTED';
                                    const isDisputed = checkpoint.status === 'DISPUTED';

                                    
                                    return (
                                        <div 
                                            key={checkpoint.id}
                                            className={`border-2 rounded-xl p-6 transition-all ${
                                                isApproved ? 'border-green-200 dark:border-green-900/50 bg-green-50/30 dark:bg-green-900/20' :
                                                isSubmitted ? 'border-yellow-200 dark:border-yellow-900/50 bg-yellow-50/30 dark:bg-yellow-900/20 shadow-md' :
                                                isRejected ? 'border-red-200 dark:border-red-900/50 bg-red-50/30 dark:bg-red-900/20' :
                                                isDisputed ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/20 shadow-[0_0_15px_rgba(244,63,94,0.1)]' :
                                                'border-gray-200 dark:border-slate-700 bg-gray-50/30 dark:bg-slate-700/30'

                                            }`}
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-start gap-3 flex-1">
                                                    {/* Status Icon */}
                                                    <div className={`p-2 rounded-lg ${
                                                        isApproved ? 'bg-green-100 dark:bg-green-900' :
                                                        isSubmitted ? 'bg-yellow-100 dark:bg-yellow-900' :
                                                        isRejected ? 'bg-red-100 dark:bg-red-900' :
                                                        'bg-gray-100 dark:bg-slate-700'
                                                    }`}>
                                                        <svg className={`w-5 h-5 ${
                                                            isApproved ? 'text-green-600' :
                                                            isSubmitted ? 'text-yellow-600' :
                                                            isRejected ? 'text-red-600' :
                                                            isDisputed ? 'text-rose-600' :
                                                            'text-gray-500'
                                                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            {isApproved && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />}
                                                            {isSubmitted && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />}
                                                            {isRejected && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />}
                                                            {isDisputed && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />}
                                                            {!isApproved && !isSubmitted && !isRejected && !isDisputed && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                                        </svg>
                                                    </div>
                                                    
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
                                                            Checkpoint {checkpoint.checkpoint_index}: {checkpoint.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{checkpoint.description}</p>
                                                        
                                                        {checkpoint.due_date && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                </svg>
                                                                Due: {new Date(checkpoint.due_date).toLocaleDateString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <p className="font-bold text-gray-900 dark:text-white text-lg mb-2">${Number(checkpoint.amount).toLocaleString()}</p>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                                                        isApproved ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' :
                                                        isSubmitted ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                                                        isRejected ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                                                        isDisputed ? 'bg-rose-100 dark:bg-rose-900 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' :
                                                        'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {checkpoint.status === 'DISPUTED' ? 'TRANH CHẤP' : checkpoint.status}
                                                    </span>
                                                    {isDisputed && (
                                                        <button 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/disputes/search?contractId=${contract.id}`);
                                                            }}
                                                            className="block mt-3 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-[10px] rounded shadow-sm transition-colors ml-auto flex items-center gap-1.5"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"/></svg>
                                                            View Dispute Chat
                                                        </button>
                                                    )}

                                                    {isSubmitted && checkpoint.updated_at && (
                                                        <div className="mt-4 p-2.5 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50 rounded-lg text-right max-w-[200px] ml-auto animate-pulse">
                                                            <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">
                                                                ⚠️ Requires Review By:
                                                            </p>
                                                            <p className="text-xs text-red-700 dark:text-red-300 font-semibold mb-1">
                                                                {new Date(new Date(checkpoint.updated_at).getTime() + 3*24*60*60*1000).toLocaleString()}
                                                            </p>
                                                            <p className="text-[10px] text-red-500 dark:text-red-400/80 leading-tight">
                                                                (If no action is taken, funds will auto-release)
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Submission Details */}
                                            {checkpoint.submission_url && (
                                                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700 mb-4">
                                                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Worker Submission:</p>
                                                    <a 
                                                        href={checkpoint.submission_url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="text-blue-600 hover:text-blue-700 font-medium text-sm underline break-all flex items-center gap-2"
                                                    >
                                                        <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                        </svg>
                                                        {checkpoint.submission_url}
                                                    </a>
                                                    {checkpoint.submission_notes && (
                                                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-slate-700">
                                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                                                            <p className="text-sm text-gray-700 dark:text-gray-300">{checkpoint.submission_notes}</p>
                                                        </div>
                                                    )}
                                                    {checkpoint.submitted_at && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            Submitted: {new Date(checkpoint.submitted_at).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {checkpoint.review_notes && (
                                                <div className={`rounded-lg p-4 border ${
                                                    isApproved 
                                                        ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800/50' 
                                                        : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800/50'
                                                }`}>
                                                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Your Review:</p>
                                                    <p className="text-sm text-gray-800 dark:text-gray-200">{checkpoint.review_notes}</p>
                                                    {checkpoint.reviewed_at && (
                                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                                            Reviewed: {new Date(checkpoint.reviewed_at).toLocaleString()}
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            {isSubmitted && (
                                                <div className="flex gap-3 mt-4">
                                                    <button
                                                        onClick={() => openApproveModal(checkpoint)}
                                                        className="flex-1 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        Approve & Release Payment
                                                    </button>
                                                    <button
                                                        onClick={() => openRejectModal(checkpoint)}
                                                        className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                        Request Changes
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-gray-500 dark:text-gray-400 italic text-center py-8">No checkpoints defined</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && selectedCheckpoint && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-transparent dark:border-slate-700">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 p-3 bg-green-100 dark:bg-green-900/40 rounded-xl">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Approve Checkpoint</h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                                    Checkpoint: <span className="font-semibold text-gray-900 dark:text-white">{selectedCheckpoint.title}</span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                    Amount to release: <span className="font-bold text-green-600 dark:text-green-400">${Number(selectedCheckpoint.amount).toLocaleString()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Review Notes (Optional)
                            </label>
                            <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add any feedback or comments..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                rows="4"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                disabled={reviewing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                className="flex-1 px-4 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                disabled={reviewing}
                            >
                                {reviewing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Approving...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Approve & Release
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedCheckpoint && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl border border-transparent dark:border-slate-700">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 p-3 bg-red-100 dark:bg-red-900/40 rounded-xl">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Changes</h3>
                                <p className="text-gray-700 dark:text-gray-300 text-sm">
                                    Checkpoint: <span className="font-semibold text-gray-900 dark:text-white">{selectedCheckpoint.title}</span>
                                </p>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Reason for Rejection <span className="text-red-600 dark:text-red-400">*</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Explain what needs to be changed or improved..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                rows="4"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Additional Notes (Optional)
                            </label>
                            <textarea
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Any other feedback..."
                                className="w-full px-4 py-3 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                rows="3"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                disabled={reviewing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                disabled={reviewing}
                            >
                                {reviewing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Send Feedback
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CheckpointReview;
