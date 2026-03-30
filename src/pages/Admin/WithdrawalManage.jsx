import React, { useState, useEffect, useCallback, useRef } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useToast } from '../../contexts/ToastContext';
import managerApi from '../../api/manager.api';

const WithdrawalManage = () => {
    const { showToast } = useToast();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('PENDING'); // PENDING, APPROVED, REJECTED, ALL
    
    // Modal State
    const [modalConfig, setModalConfig] = useState({ isOpen: false, request: null, status: null });
    const [adminNote, setAdminNote] = useState('');
    const [proofImage, setProofImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const fileInputRef = useRef(null);

    const fetchRequests = useCallback(async () => {
        try {
            setLoading(true);
            const res = await managerApi.getWithdrawals();
            setRequests(res.data || []);
        } catch (error) {
            console.error(error);
            showToast('Failed to fetch withdrawal requests', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchRequests();
    }, [fetchRequests]);

    const openModal = (request, status) => {
        setModalConfig({ isOpen: true, request, status });
        // If viewing OR re-editing a processed request, populate existing data
        if (status === 'VIEW' || request.status !== 'PENDING') {
            setAdminNote(request.admin_note || '');
            setProofImage(request.proof_image_url || null);
        } else {
            setAdminNote('');
            setProofImage(null);
        }
    };

    const closeModal = () => {
        setModalConfig({ isOpen: false, request: null, status: null });
        setAdminNote('');
        setProofImage(null);
        setUploading(false);
        setProcessing(false);
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setUploading(true);
            const res = await managerApi.uploadFile(file);
            setProofImage(res.url);
            showToast('Proof image uploaded', 'success');
        } catch (error) {
            console.error(error);
            showToast('Upload failed', 'error');
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmProcess = async () => {
        const { request, status } = modalConfig;
        if (!request) return;

        if (status === 'APPROVED' && !proofImage) {
            showToast('Please upload a proof image for approval', 'warning');
            return;
        }

        try {
            setProcessing(true);
            console.log('DEBUG: Processing withdrawal:', { id: request.id, status, adminNote, proofImage });
            await managerApi.processWithdrawal(request.id, {
                status,
                admin_note: adminNote,
                proof_image_url: proofImage
            });
            showToast(`Request ${status.toLowerCase()} successfully`, 'success');
            fetchRequests();
            closeModal();
        } catch (error) {
            console.error(error);
            showToast('Failed to process request', 'error');
        } finally {
            setProcessing(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN').format(amount || 0);
    };

    const filteredRequests = requests.filter(r => {
        if (filter === 'ALL') return true;
        return r.status === filter;
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/30';
            case 'APPROVED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-500 border-rose-500/30';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/30';
        }
    };

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-indigo-500/30">
            <AdminSidebar />
            
            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
                
                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                            <span className="w-2 h-8 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                            WITHDRAWAL_MANAGEMENT
                        </h1>
                        <p className="mt-1 text-[10px] text-slate-500 uppercase tracking-widest ml-5 font-mono">
                            Review and authorize outbound financial transactions.
                        </p>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto relative z-0">
                    <div className="mb-6 flex items-center justify-between">
                        <div className="flex gap-2">
                            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded border text-[10px] font-black tracking-widest transition-all ${
                                        filter === f 
                                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]'
                                        : 'bg-[#090e17] text-slate-500 border-[#1e293b] hover:border-indigo-500/30 hover:text-indigo-300'
                                    }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <button 
                            onClick={fetchRequests}
                            className="p-2 rounded border border-[#1e293b] hover:border-indigo-500/50 text-slate-500 hover:text-indigo-400 transition-all"
                        >
                            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                        </button>
                    </div>

                    <div className="bg-[#090e17] rounded-xl border border-[#1e293b] overflow-hidden shadow-2xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-[#02040a] border-b border-[#1e293b]">
                                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 font-mono">
                                        <th className="px-6 py-4 text-center">ID</th>
                                        <th className="px-6 py-4">USER / IDENTITY</th>
                                        <th className="px-6 py-4">AMOUNT</th>
                                        <th className="px-6 py-4">METHOD / PROOF</th>
                                        <th className="px-6 py-4">STATUS</th>
                                        <th className="px-6 py-4 text-right">COMMANDS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]">
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center">
                                                <div className="inline-block w-8 h-8 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                                <p className="mt-4 text-[10px] font-black text-indigo-400 animate-pulse tracking-widest uppercase">FETCHING_DATA...</p>
                                            </td>
                                        </tr>
                                    ) : filteredRequests.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-20 text-center text-slate-600 font-bold uppercase tracking-widest italic">
                                                NO_WITHDRAWAL_REQUESTS_FOUND
                                            </td>
                                        </tr>
                                    ) : filteredRequests.map(r => (
                                        <tr key={r.id} className="group hover:bg-white/[0.01] transition-colors border-b border-[#1e293b]/50">
                                            <td className="px-6 py-5 text-center font-bold text-slate-500">#{r.id}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase font-mono">
                                                        {r.full_name?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors uppercase">{r.full_name || 'Unknown User'}</p>
                                                        <p className="text-[9px] text-slate-600 font-mono">{r.user_email || 'node@faf.network'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <p className="text-sm font-black text-white">{formatCurrency(r.amount)} <span className="text-[10px] text-slate-500">CRED</span></p>
                                                <p className="text-[8px] text-slate-600 font-bold uppercase mt-0.5">EST: {formatCurrency(r.amount * 1000)} VND</p>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col gap-2">
                                                    <div className="bg-[#02040a] border border-[#1e293b] p-2 rounded text-[10px] font-mono leading-relaxed">
                                                        <p className="text-indigo-400 font-bold uppercase tracking-widest text-[9px] mb-1">
                                                            {r.bank_info?.method?.toUpperCase() === 'MOMO' ? 'MoMo E-Wallet' : 'Banking (ATM)'}
                                                        </p>
                                                        {r.bank_info?.method === 'momo' ? (
                                                            <p className="text-slate-400">PHONE: <span className="text-white">{r.bank_info.phone}</span></p>
                                                        ) : (
                                                            <>
                                                                <p className="text-slate-500">BANK: <span className="text-slate-300">{r.bank_info?.bank_name}</span></p>
                                                                <p className="text-slate-500">ACC: <span className="text-slate-300">{r.bank_info?.account_number}</span></p>
                                                            </>
                                                        )}
                                                    </div>
                                                    {r.proof_image_url && (
                                                        <a 
                                                            href={r.proof_image_url} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-2 text-[9px] font-black text-emerald-400 hover:text-emerald-300 transition-colors uppercase italic"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                            VIEW_PROOF_ID_{r.id.slice(-4)}
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold tracking-widest uppercase ${getStatusStyle(r.status)}`}>
                                                    {r.status}
                                                </span>
                                                {r.admin_note && (
                                                    <p className="mt-1 text-[8px] text-slate-500 italic max-w-[150px] truncate" title={r.admin_note}>
                                                        Note: {r.admin_note}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                {r.status === 'PENDING' ? (
                                                    <div className="flex justify-end gap-2">
                                                        <button 
                                                            onClick={() => openModal(r, 'APPROVED')}
                                                            className="px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded text-[9px] font-black tracking-widest transition-all uppercase shadow-[0_0_10px_rgba(16,185,129,0.1)]"
                                                        >
                                                            APPROVE
                                                        </button>
                                                        <button 
                                                            onClick={() => openModal(r, 'REJECTED')}
                                                            className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/30 rounded text-[9px] font-black tracking-widest transition-all uppercase"
                                                        >
                                                            REJECT
                                                        </button>
                                                    </div>
                                                ) : (
                                                        <div className="flex flex-col items-end gap-1">
                                                            <span className="text-[9px] text-slate-600 font-bold uppercase italic font-mono">
                                                                PROCESSED_AT_{new Date(r.updated_at).toLocaleDateString()}
                                                            </span>
                                                            <div className="flex gap-2">
                                                                <button 
                                                                    onClick={() => openModal(r, 'VIEW')}
                                                                    className="text-[9px] font-black text-indigo-400 hover:text-indigo-300 hover:underline tracking-widest uppercase transition-all"
                                                                >
                                                                    [DETAILS]
                                                                </button>
                                                                <button 
                                                                    onClick={() => openModal(r, r.status)}
                                                                    className="text-[9px] font-black text-slate-500 hover:text-white hover:underline tracking-widest uppercase transition-all"
                                                                >
                                                                    [RE-EDIT]
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            {/* Custom Modal */}
            {modalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-[#02040a]/90 backdrop-blur-md" onClick={closeModal}></div>
                    <div className="relative bg-[#090e17] border border-[#1e293b] rounded-2xl w-full max-w-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                        {/* Modal Header */}
                        <div className={`px-6 py-4 border-b border-[#1e293b] flex items-center justify-between ${
                            modalConfig.status === 'VIEW' ? 'bg-indigo-500/5' :
                            modalConfig.status === 'APPROVED' ? 'bg-emerald-500/5' : 'bg-rose-500/5'
                        }`}>
                            <div>
                                <h3 className={`text-lg font-black uppercase tracking-widest ${
                                    modalConfig.status === 'VIEW' ? 'text-indigo-400' :
                                    modalConfig.status === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'
                                }`}>
                                    {modalConfig.status === 'VIEW' ? 'REQUEST_DETAILS' : `${modalConfig.status}_SEQUENCE`}
                                </h3>
                                <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {modalConfig.request?.id}</p>
                            </div>
                            <button onClick={closeModal} className="text-slate-500 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-6">
                            {/* Summary Card */}
                            <div className="bg-[#02040a] rounded-xl p-4 border border-[#1e293b] space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">USER_NODE</span>
                                    <span className="text-xs font-bold text-white uppercase">{modalConfig.request?.full_name}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">TRANSFER_VAL</span>
                                    <span className="text-sm font-black text-indigo-400">{formatCurrency(modalConfig.request?.amount)} CRED</span>
                                </div>
                            </div>

                            {/* Note Input */}
                            <div>
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">ADMIN_NOTE</label>
                                <textarea 
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    readOnly={modalConfig.status === 'VIEW'}
                                    placeholder={modalConfig.status === 'VIEW' ? "No admin notes recorded." : "Add processing details or reason for action..."}
                                    className="w-full bg-[#02040a] border border-[#1e293b] rounded-xl p-3 text-sm text-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all outline-none h-24"
                                />
                            </div>

                            {/* Proof Display / Upload */}
                            {(modalConfig.status === 'APPROVED' || modalConfig.status === 'VIEW') && (
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block">
                                        TRANSACTION_PROOF
                                    </label>
                                    <div 
                                        onClick={modalConfig.status !== 'VIEW' ? () => fileInputRef.current?.click() : undefined}
                                        className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-all ${
                                            proofImage 
                                            ? 'border-emerald-500/50 bg-emerald-500/5' 
                                            : modalConfig.status === 'VIEW' ? 'border-[#1e293b]' : 'border-[#1e293b] hover:border-indigo-500/50 hover:bg-white/[0.02]'
                                        } ${modalConfig.status !== 'VIEW' ? 'cursor-pointer' : ''}`}
                                    >
                                        {modalConfig.status !== 'VIEW' && (
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                className="hidden" 
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        )}
                                        {uploading ? (
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
                                                <span className="text-[10px] font-black text-indigo-400 animate-pulse">UPLOADING...</span>
                                            </div>
                                        ) : proofImage ? (
                                            <div className="flex flex-col items-center gap-4 text-emerald-400 w-full animate-in fade-in duration-500">
                                                <div className="flex flex-col items-center gap-2">
                                                    <svg className="w-8 h-8 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">PROOF_VERIFIED</span>
                                                </div>
                                                <div className="w-full relative group/img">
                                                    <div className="w-full h-48 overflow-hidden rounded-xl border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                                                        <img 
                                                            src={proofImage} 
                                                            alt="Proof" 
                                                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = 'https://placehold.co/600x400/090e17/475569?text=IMAGE_LOAD_FAILED';
                                                            }}
                                                        />
                                                    </div>
                                                    <a 
                                                        href={proofImage} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity rounded-xl backdrop-blur-sm"
                                                    >
                                                        <span className="bg-white text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest translate-y-2 group-hover/img:translate-y-0 transition-transform">EXPAND_NODE</span>
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-slate-600 italic">
                                                <svg className="w-8 h-8 opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                <span className="text-[10px] font-black uppercase tracking-widest">{modalConfig.status === 'VIEW' ? 'NO_PROOF_CAPTURED' : 'AWAITING_FILE_UPLOAD'}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-[#02040a] border-t border-[#1e293b] flex gap-3">
                            {modalConfig.status === 'VIEW' ? (
                                <button 
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2 rounded-xl bg-indigo-500 text-white font-black text-[10px] tracking-widest hover:bg-indigo-400 transition-all uppercase shadow-lg shadow-indigo-500/20"
                                >
                                    CLOSE_DETAILS
                                </button>
                            ) : (
                                <>
                                    <button 
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 rounded-xl border border-[#1e293b] text-slate-500 font-black text-[10px] tracking-widest hover:text-white hover:border-slate-500 transition-all uppercase"
                                    >
                                        CANCEL
                                    </button>
                                    <button 
                                        onClick={handleConfirmProcess}
                                        disabled={processing || uploading}
                                        className={`flex-1 px-4 py-2 rounded-xl font-black text-[10px] tracking-widest transition-all uppercase shadow-lg ${
                                            modalConfig.status === 'APPROVED' 
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-400 shadow-emerald-500/20' 
                                            : 'bg-rose-500 text-white hover:bg-rose-400 shadow-rose-500/20'
                                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {processing ? 'EXECUTING...' : `CONFIRM_${modalConfig.status}`}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WithdrawalManage;
