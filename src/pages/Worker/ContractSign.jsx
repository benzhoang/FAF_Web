import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import { userApi } from '../../api/user.api';

const ContractSign = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [signing, setSigning] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [contractRes, profileRes] = await Promise.all([
                contractsApi.getContractById(id),
                userApi.getMe()
            ]);
            setContract(contractRes.data);
            setUserProfile(profileRes);
        } catch (error) {
            console.error('Error fetching contract:', error);
            toast.error('Failed to load contract');
        } finally {
            setLoading(false);
        }
    };

    const handleSignContract = async () => {
        if (!showConfirm) {
            setShowConfirm(true);
            return;
        }

        try {
            setSigning(true);
            await contractsApi.signContract(id);
            toast.success('Contract signed successfully!');
            setShowConfirm(false);
            navigate('/my-job'); // Redirect to active job page
        } catch (error) {
            console.error('Error signing contract:', error);
            toast.error(error.response?.data?.message || 'Failed to sign contract');
        } finally {
            setSigning(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500">Loading contract...</p>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-red-500">Contract not found</p>
            </div>
        );
    }

    // Fill in worker information in contract content
    const filledContract = contract.contract_content
        ? contract.contract_content
            .replace(/\.{10,}/g, userProfile?.full_name || '[Worker Name]')
            .replace(/Họ và tên:.*?\n/g, `Họ và tên: ${userProfile?.full_name || '[Worker Name]'}\n`)
            .replace(/Email đăng ký.*?:\s*\.+/g, `Email đăng ký trên hệ thống FAF: ${userProfile?.email || '[Email]'}`)
            .replace(/ID người dùng FAF:\s*\.+/g, `ID người dùng FAF: ${userProfile?.id || '[ID]'}`)
        : 'No contract content available';

    const bothSigned = contract.signature_worker && contract.signature_client;
    const workerSigned = contract.signature_worker;
    const clientSigned = contract.signature_client;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm mb-4"
                    >
                        ← Back to Dashboard
                    </button>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contract Agreement</h1>
                            <p className="text-gray-600">Job: {contract.job_title}</p>
                            <p className="text-sm text-gray-500 mt-1">Contract Value: <span className="font-bold text-green-600">${Number(contract.total_amount || 0).toLocaleString()}</span></p>
                        </div>
                        <div className="text-right">
                            <div className="flex flex-col gap-2">
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                                    workerSigned ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {workerSigned ? '✅ You Signed' : '⏳ Your Signature Pending'}
                                </span>
                                <span className={`px-4 py-2 rounded-lg text-sm font-bold ${
                                    clientSigned ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                    {clientSigned ? '✅ Client Signed' : '⏳ Client Signature Pending'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contract Document */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                        <h2 className="text-white font-bold text-xl">📜 Contract Document</h2>
                        <p className="text-blue-100 text-sm mt-1">Please review carefully before signing</p>
                    </div>
                    
                    <div className="p-8 max-h-[600px] overflow-y-auto">
                        <div 
                            className="prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: filledContract }}
                        />
                    </div>

                    {/* Contract Footer */}
                    <div className="border-t border-gray-200 bg-gray-50 px-8 py-4">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <p className="text-gray-600">Contract ID: <span className="font-mono font-semibold">#{contract.id}</span></p>
                                <p className="text-gray-600">Created: {new Date(contract.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-gray-500 text-xs">🔒 Secured by FAF Escrow</p>
                                {bothSigned && contract.signed_at && (
                                    <p className="text-green-600 font-semibold">
                                        Fully Executed on {new Date(contract.signed_at).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!workerSigned ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        {!showConfirm ? (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Ready to Sign?</h3>
                                <p className="text-gray-600 mb-6">
                                    By signing this contract, you agree to complete the job as described above. 
                                    Your signature is legally binding.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSignContract}
                                        className="flex-1 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        ✍️ Sign Contract
                                    </button>
                                    <button
                                        onClick={() => navigate('/dashboard')}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6">
                                <h3 className="text-xl font-bold text-yellow-900 mb-3">⚠️ Final Confirmation</h3>
                                <p className="text-yellow-800 mb-6">
                                    Are you absolutely sure you want to sign this contract? This action cannot be undone.
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSignContract}
                                        className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                        disabled={signing}
                                    >
                                        {signing ? 'Signing...' : '✅ Yes, Sign Contract'}
                                    </button>
                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
                                        disabled={signing}
                                    >
                                        Go Back
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                        <h3 className="text-2xl font-bold text-green-900 mb-3">✅ You've Signed the Contract!</h3>
                        <p className="text-green-800 mb-6">
                            {clientSigned 
                                ? 'Both parties have signed. You can now start working on the job!' 
                                : 'Waiting for client signature to activate the contract.'}
                        </p>
                        {bothSigned && (
                            <button
                                onClick={() => navigate('/my-job')}
                                className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors"
                            >
                                🚀 Start Working
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractSign;
