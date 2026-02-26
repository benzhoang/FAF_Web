import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import TaskOwnerSidebar from '../../components/TaskOwnerSidebar';

const EmployerContractSign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchContract();
    }, [id]);

    const fetchContract = async () => {
        try {
            const res = await contractsApi.getContract(id);
            setContract(res.data);
        } catch (error) {
            console.error('Error fetching contract:', error);
            toast.error('Failed to load contract');
        } finally {
            setLoading(false);
        }
    };

    const handleSign = async () => {
        if (!agreed) {
            toast.warning('Please agree to the contract terms first');
            return;
        }

        try {
            setSigning(true);
            await contractsApi.signContract(id);
            toast.success('Contract signed successfully!');
            setShowConfirm(false);
            navigate('/task-owner');
        } catch (error) {
            console.error('Error signing contract:', error);
            toast.error(error.response?.data?.message || 'Failed to sign contract');
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 font-medium">Loading contract...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-gray-50 flex">
                <TaskOwnerSidebar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <svg className="w-24 h-24 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Found</h2>
                        <p className="text-gray-600 mb-6">The contract you're looking for doesn't exist or has been removed.</p>
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

    const workerSigned = !!contract.signature_worker;
    const employerSigned = !!contract.signature_client;
    const canSign = workerSigned && !employerSigned;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <TaskOwnerSidebar />
            
            <div className="flex-1 overflow-auto">
                <div className="max-w-4xl mx-auto px-6 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <button
                            onClick={() => navigate('/task-owner')}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm mb-4 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to Dashboard
                        </button>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-3 bg-blue-100 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Contract Review & Signature</h1>
                                <p className="text-gray-600 mt-1">Review the contract details and sign to activate the job</p>
                            </div>
                        </div>
                    </div>

                    {/* Contract Details Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">Contract Details</h2>
                        
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Job Title</p>
                                <p className="font-semibold text-gray-900 text-lg">{contract.job_title}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Worker</p>
                                <p className="font-semibold text-gray-900 text-lg">{contract.worker_name || 'Unknown'}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Total Amount</p>
                                <p className="font-bold text-green-600 text-2xl">${Number(contract.total_amount || 0).toLocaleString()}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-gray-500">Status</p>
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                    contract.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                    contract.status === 'DRAFT' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                }`}>
                                    <div className={`w-2 h-2 rounded-full ${
                                        contract.status === 'ACTIVE' ? 'bg-green-600' :
                                        contract.status === 'DRAFT' ? 'bg-yellow-600' :
                                        'bg-gray-600'
                                    }`}></div>
                                    {contract.status}
                                </span>
                            </div>
                        </div>

                        {/* Signature Status */}
                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Signature Status
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl border-2 transition-all ${workerSigned ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        {workerSigned ? (
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">Worker</p>
                                            <p className={`text-sm font-bold ${workerSigned ? 'text-green-700' : 'text-gray-500'}`}>
                                                {workerSigned ? 'Signed' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl border-2 transition-all ${employerSigned ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                                    <div className="flex items-center gap-3 mb-2">
                                        {employerSigned ? (
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <div className="p-2 bg-yellow-100 rounded-lg">
                                                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-gray-900 text-sm">You (Employer)</p>
                                            <p className={`text-sm font-bold ${employerSigned ? 'text-green-700' : 'text-yellow-700'}`}>
                                                {employerSigned ? 'Signed' : 'Pending'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Checkpoints */}
                    {contract.checkpoints && contract.checkpoints.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200 flex items-center gap-2">
                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                                Project Checkpoints ({contract.checkpoints.length})
                            </h2>
                            <div className="space-y-3">
                                {contract.checkpoints.map((checkpoint, idx) => (
                                    <div key={checkpoint.id} className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                                        <div className="flex items-start gap-3 flex-1">
                                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <span className="text-sm font-bold text-blue-600">{idx + 1}</span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-900">
                                                    {checkpoint.title}
                                                </p>
                                                <p className="text-sm text-gray-600 mt-1">{checkpoint.description}</p>
                                                {checkpoint.due_date && (
                                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                        Due: {new Date(checkpoint.due_date).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 text-lg">${Number(checkpoint.amount).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contract Content */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                        {/* Document Header */}
                        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white px-6 py-5 border-b-4 border-blue-500">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">Employment Agreement</h2>
                                        <p className="text-sm text-gray-300 mt-0.5">Legally binding contract between parties</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-300 uppercase tracking-wider">Contract ID</div>
                                    <div className="text-lg font-bold">#{contract.id}</div>
                                </div>
                            </div>
                        </div>

                        {/* Document Body */}
                        <div className="bg-gradient-to-b from-gray-50 to-white p-8">
                            <div className="max-w-4xl mx-auto">
                                {/* Contract Meta Info */}
                                <div className="grid grid-cols-2 gap-6 mb-8 p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Parties Involved</div>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <span className="text-sm font-medium text-gray-900 min-w-[80px]">Client:</span>
                                                <span className="text-sm text-gray-700">{contract.client_name || 'You'}</span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-sm font-medium text-gray-900 min-w-[80px]">Contractor:</span>
                                                <span className="text-sm text-gray-700">{contract.worker_name || 'Worker'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Agreement Value</div>
                                        <div className="text-3xl font-bold text-green-600">${Number(contract.total_amount || 0).toLocaleString()}</div>
                                        <div className="text-xs text-gray-500 mt-1">Total compensation amount</div>
                                    </div>
                                </div>

                                {/* Contract Terms */}
                                <div className="prose prose-sm max-w-none">
                                    <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
                                        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b border-gray-200">
                                            Terms & Conditions
                                        </div>
                                        <div 
                                            className="text-gray-700 leading-relaxed prose prose-sm max-w-none
                                                prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-3
                                                prose-h2:text-lg prose-h2:border-b prose-h2:border-gray-200 prose-h2:pb-2 prose-h2:mt-6
                                                prose-h3:text-base prose-h3:text-gray-800 prose-h3:mt-4
                                                prose-p:text-sm prose-p:text-gray-700 prose-p:mb-3
                                                prose-strong:text-gray-900 prose-strong:font-semibold
                                                prose-ul:list-disc prose-ul:ml-6 prose-ul:text-sm
                                                prose-ol:list-decimal prose-ol:ml-6 prose-ol:text-sm"
                                            style={{
                                                fontSize: '0.9375rem',
                                                lineHeight: '1.75',
                                                fontFamily: 'system-ui, -apple-system, sans-serif'
                                            }}
                                            dangerouslySetInnerHTML={{ 
                                                __html: contract.contract_content || 'No contract content available.' 
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Document Footer */}
                        <div className="bg-gray-100 px-8 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <span className="font-semibold">Secured by FAF Platform Escrow System</span>
                                </div>
                                {contract.created_at && (
                                    <span>Generated: {new Date(contract.created_at).toLocaleDateString('en-US', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Warning if worker hasn't signed */}
                    {!workerSigned && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-2 bg-yellow-100 rounded-lg">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-yellow-900 mb-2">Waiting for Worker Signature</h3>
                                    <p className="text-yellow-800 text-sm">
                                        The worker needs to review and sign this contract before you can sign it. 
                                        You will be notified once they sign.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Already signed message */}
                    {employerSigned && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 mb-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-green-900 mb-2">Contract Signed Successfully</h3>
                                    <p className="text-green-800 text-sm">
                                        You have already signed this contract. The work can now begin!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Sign Section */}
                    {canSign && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-start gap-3 mb-6">
                                <input
                                    type="checkbox"
                                    id="agree"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="mt-1 w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                />
                                <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer select-none">
                                    I have reviewed and agree to all terms and conditions outlined in this contract. 
                                    I understand that by signing, I commit to paying the agreed amounts upon checkpoint completion.
                                </label>
                            </div>
                            
                            <button
                                onClick={() => setShowConfirm(true)}
                                disabled={!agreed}
                                className={`w-full py-3 font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                                    agreed
                                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Sign Contract
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6">
                        <button
                            onClick={() => navigate('/task-owner')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="flex-shrink-0 p-3 bg-blue-100 rounded-xl">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Contract Signature</h3>
                                <p className="text-gray-700 text-sm">
                                    Are you sure you want to sign this contract? This action cannot be undone and commits you to the agreed terms.
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                                disabled={signing}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSign}
                                className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                disabled={signing}
                            >
                                {signing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Signing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        Confirm & Sign
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

export default EmployerContractSign;
