import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';

const ContractDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContractDetails();
    }, [id]);

    const fetchContractDetails = async () => {
        try {
            setLoading(true);
            const res = await contractsApi.getContractById(id);
            if (res.data) {
                setContract(res.data);
            } else {
                toast.error('Contract not found');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error fetching contract details:', error);
            toast.error('Failed to load contract details');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-gray-100 text-gray-700';
            case 'SUBMITTED': return 'bg-yellow-100 text-yellow-700';
            case 'APPROVED': return 'bg-green-100 text-green-700';
            case 'REJECTED': return 'bg-red-100 text-red-700';
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
                <p className="text-gray-500">Loading contract details...</p>
            </div>
        );
    }

    if (!contract) return null;

    // Calculate checkpoint progress
    const totalCheckpoints = contract.checkpoints?.length || 0;
    const completedCheckpoints = contract.checkpoints?.filter(cp => cp.status === 'APPROVED').length || 0;
    const progress = totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-gray-600 hover:text-gray-900 font-medium text-sm flex items-center gap-2 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Go Back
                        </button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-6">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-3xl font-bold text-gray-900">{contract.job_title}</h1>
                                <span className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 ${
                                    contract.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                                    contract.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                    contract.status === 'CANCELLED' || contract.status === 'TERMINATED' ? 'bg-red-100 text-red-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        contract.status === 'ACTIVE' ? 'bg-blue-600' :
                                        contract.status === 'COMPLETED' ? 'bg-green-600' :
                                        contract.status === 'CANCELLED' || contract.status === 'TERMINATED' ? 'bg-red-600' :
                                        'bg-gray-600'
                                    }`}></div>
                                    {contract.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-6">{contract.job_description}</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Details Block */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-gray-100 rounded-lg">
                                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Task Owner</p>
                                            <p className="font-bold text-gray-900">{contract.client_name || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-green-100 rounded-lg">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Total Value</p>
                                            <p className="font-black text-green-600">${Number(contract.total_amount || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Duration</p>
                                            <p className="font-bold text-gray-900">
                                                {contract.job_start_date ? new Date(contract.job_start_date).toLocaleDateString() : 'Pending'} - {contract.job_end_date ? new Date(contract.job_end_date).toLocaleDateString() : 'Open'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 font-semibold uppercase">Signatures</p>
                                            <div className="flex gap-2">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${contract.signature_worker ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Worker</span>
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${contract.signature_client ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>Employer</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

                {/* Checkpoints List (Read Only) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Checkpoints</h2>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 font-bold text-xs uppercase rounded-lg">Read Only</span>
                    </div>
                    
                    <div className="space-y-4">
                        {contract.checkpoints && contract.checkpoints.length > 0 ? (
                            contract.checkpoints.map((checkpoint) => (
                                <div 
                                    key={checkpoint.id}
                                    className={`border-2 rounded-xl p-5 transition-all ${
                                        checkpoint.status === 'APPROVED' ? 'border-green-200 bg-green-50/30' :
                                        checkpoint.status === 'SUBMITTED' ? 'border-yellow-200 bg-yellow-50/30' :
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
                                            <p className="text-xs font-semibold text-gray-600 mb-1">Worker Submission:</p>
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
                                                    Submitted: {new Date(checkpoint.submitted_at).toLocaleString()}
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
                                                    Reviewed: {new Date(checkpoint.reviewed_at).toLocaleString()}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic text-center py-8">No checkpoints defined for this contract</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContractDetail;
