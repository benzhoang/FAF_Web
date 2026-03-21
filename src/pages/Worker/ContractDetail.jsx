import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { contractsApi } from '../../api/contracts.api';
import { reviewsApi } from '../../api/reviews.api';
import ReviewsList from './components/ReviewsList';
import axiosClient from '../../api/axiosClient';


const ContractDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const toast = useToast();
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviewsData, setReviewsData] = useState({ reviews: [], summary: null });
    const [disputeModal, setDisputeModal] = useState({ open: false, checkpointId: null });
    const [disputeReason, setDisputeReason] = useState('');
    const [submittingDispute, setSubmittingDispute] = useState(false);


    useEffect(() => {
        fetchContractDetails();
    }, [id]);

    const fetchContractDetails = async () => {
        try {
            setLoading(true);
            const res = await contractsApi.getContractById(id);
            if (res.data) {
                setContract(res.data);
                
                // Fetch reviews for this contract if it's completed (or generally to see if there are any)
                try {
                    const revRes = await reviewsApi.getContractReviews(id);
                    setReviewsData({ reviews: revRes.data || [], summary: revRes.summary || null });
                } catch(e) {
                    console.error('Failed to fetch contract reviews', e);
                }
            } else {
                toast.error('ERR: NO_CONTRACT_DATA_FOUND');
                navigate(-1);
            }
        } catch (error) {
            console.error('Error fetching contract details:', error);
            toast.error('ERR: DATA_RETRIEVAL_FAILED');
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-900/30 text-amber-500 border-amber-500/50';
            case 'SUBMITTED': return 'bg-blue-900/30 text-blue-400 border-blue-500/50';
            case 'APPROVED': return 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50';
            case 'REJECTED': return 'bg-rose-900/30 text-rose-400 border-rose-500/50';
            default: return 'bg-slate-800 text-slate-400 border-slate-700';
        }
    };

    const getStatusIconColor = (status) => {
        switch (status) {
            case 'PENDING': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
            case 'SUBMITTED': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
            case 'APPROVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
            case 'REJECTED': return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
            default: return 'text-slate-400 bg-slate-800 border-slate-700';
        }
    }

    const getStatusIcon = (status) => {
        const baseClasses = `p-2 rounded border flex items-center justify-center ${getStatusIconColor(status)}`;
        switch (status) {
            case 'PENDING': 
                return (
                    <div className={baseClasses}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'SUBMITTED':
                return (
                    <div className={baseClasses}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                );
            case 'APPROVED':
                return (
                    <div className={baseClasses}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                );
            case 'REJECTED':
                return (
                    <div className={baseClasses}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                );
            default: 
                return (
                    <div className={baseClasses}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent flex items-center justify-center relative overflow-hidden font-mono text-[10px] uppercase tracking-widest text-cyan-500">
                <div className="flex items-center gap-3 animate-pulse">
                    <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded flex animate-spin"></div>
                    ACCESSING_RECORDS...
                </div>
            </div>
        );
    }

    if (!contract) return <div className="min-h-screen bg-transparent flex items-center justify-center font-mono text-rose-500">ERROR_NO_DATA</div>;

    // Calculate checkpoint progress
    const totalCheckpoints = contract.checkpoints?.length || 0;
    const completedCheckpoints = contract.checkpoints?.filter(cp => cp.status === 'APPROVED').length || 0;
    const progress = totalCheckpoints > 0 ? (completedCheckpoints / totalCheckpoints) * 100 : 0;

    const handleSubmitDispute = async () => {
        if (!disputeReason.trim()) {
            toast.error('Vui lòng nhập lý do khiếu nại.');
            return;
        }
        try {
            setSubmittingDispute(true);
            await axiosClient.post('/disputes', {
                contractId: contract.id,
                checkpointId: disputeModal.checkpointId,
                reason: disputeReason.trim()
            });
            toast.success('Khiếu nại đã được gửi! Manager sẽ xem xét và phản hồi sớm.');
            setDisputeModal({ open: false, checkpointId: null });
            setDisputeReason('');
            fetchContractDetails(); // refresh to show DISPUTED status
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Không thể gửi khiếu nại. Vui lòng thử lại.');
        } finally {
            setSubmittingDispute(false);
        }
    };


    return (
        <div className="min-h-screen bg-transparent text-slate-300 relative font-sans">

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10 w-full">
                {/* Header Section */}
                <div className="bg-[#090e17]/80 backdrop-blur-md rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.1)] border p-6 mb-6 relative overflow-hidden" style={{ borderColor: 'rgba(6,182,212,0.2)' }}>
                    <div className="absolute top-0 right-10 w-32 h-px bg-cyan-400/50" />
                    
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => navigate(-1)}
                            className="text-[10px] font-black font-mono text-cyan-500 hover:text-cyan-400 uppercase tracking-widest flex items-center gap-2 transition-colors group"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            QUAY LẠI
                        </button>
                    </div>
                    
                    <div className="flex items-start justify-between">
                        <div className="flex-1 pr-6">
                            <div className="flex items-center gap-4 mb-3">
                                <h1 className="text-3xl font-black text-white tracking-widest uppercase font-mono">{contract.job_title}</h1>
                                <span className={`px-3 py-1 rounded inline-flex shrink-0 items-center justify-center text-[10px] font-black font-mono tracking-widest uppercase border ${
                                    contract.status === 'ACTIVE' ? 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50' :
                                    contract.status === 'COMPLETED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' :
                                    contract.status === 'CANCELLED' || contract.status === 'TERMINATED' ? 'bg-rose-900/30 text-rose-400 border-rose-500/50' :
                                    'bg-slate-800 text-slate-400 border-slate-700'
                                }`}>
                                    <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                                        contract.status === 'ACTIVE' ? 'bg-cyan-400 shadow-[0_0_5px_rgba(34,211,238,1)]' :
                                        contract.status === 'COMPLETED' ? 'bg-emerald-400 shadow-[0_0_5px_rgba(52,211,153,1)]' :
                                        contract.status === 'CANCELLED' || contract.status === 'TERMINATED' ? 'bg-rose-400 shadow-[0_0_5px_rgba(244,63,94,1)]' :
                                        'bg-slate-500'
                                    }`}></div>
                                    {contract.status === 'DISPUTED' ? 'TRANH CHẤP' : contract.status}
                                </span>
                            </div>
                            
                            {/* DISPUTE STATUS ACTION */}
                            {contract.status === 'DISPUTED' && (
                                <div className="mb-8 p-5 bg-rose-900/20 border-l-4 border-rose-500 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(244,63,94,0.1)]">
                                    <div>
                                        <h3 className="text-rose-400 font-bold font-mono tracking-widest text-sm mb-1 uppercase">Đang Tranh Chấp (Disputed)</h3>
                                        <p className="text-slate-300 text-xs">Hợp đồng này đang trong quá trình khiếu nại. Manager đang xem xét bằng chứng từ 2 bên.</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/disputes/search?contractId=${contract.id}`)}
                                        className="shrink-0 px-6 py-2.5 bg-rose-500 hover:bg-rose-400 text-white font-black text-xs font-mono tracking-widest uppercase rounded shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all"
                                    >
                                        Vào Phòng Chat Khiếu Nại
                                    </button>
                                </div>
                            )}

                            <p className="text-sm text-slate-400 mb-8 leading-relaxed max-w-4xl">{contract.job_description}</p>
                            
                            {/* PENDING SIGNATURE ACTION */}
                            {['PENDING', 'ACTIVE'].includes(contract.status) && !contract.signature_worker && (
                                <div className="mb-8 p-5 bg-amber-900/20 border-l-4 border-amber-500 rounded-lg flex items-center justify-between shadow-[0_0_15px_rgba(245,158,11,0.1)]">
                                    <div>
                                        <h3 className="text-amber-400 font-bold font-mono tracking-widest text-sm mb-1 uppercase">Yêu Cầu Chữ Ký (OTP)</h3>
                                        <p className="text-slate-300 text-xs">Khách hàng đã chấp nhận đề xuất. Vui lòng ký điện tử để bắt đầu hợp đồng.</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/contract/${contract.id}/sign`)}
                                        className="shrink-0 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black text-xs font-mono tracking-widest uppercase rounded shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all"
                                    >
                                        Ký Hợp Đồng Ngay
                                    </button>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#02040a] border border-slate-800 rounded-xl p-5">
                                {/* Details Block */}
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-indigo-900/20 border border-indigo-500/30 rounded flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest">KHÁCH HÀNG</p>
                                            <p className="text-[14px] font-bold text-slate-200 mt-1">{contract.client_name || 'Đang cập nhật'}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-emerald-900/20 border border-emerald-500/30 rounded flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest">TỔNG GIÁ TRỊ</p>
                                            <p className="text-[18px] font-black font-mono text-emerald-400 mt-1">${Number(contract.total_amount || 0).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-5">
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-blue-900/20 border border-blue-500/30 rounded flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest">THỜI GIAN</p>
                                            <p className="text-[12px] font-bold text-slate-300 mt-1 uppercase tracking-wider">
                                                {contract.job_start_date ? new Date(contract.job_start_date).toLocaleDateString() : 'CHƯA BẮT ĐẦU'} 
                                                <span className="text-cyan-500 mx-2">-</span> 
                                                {contract.job_end_date ? new Date(contract.job_end_date).toLocaleDateString() : 'MỞ'}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-4">
                                        <div className="p-2.5 bg-purple-900/20 border border-purple-500/30 rounded flex items-center justify-center shrink-0">
                                            <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-mono text-slate-500 font-black uppercase tracking-widest mb-1.5">CHỮ KÝ XÁC NHẬN</p>
                                            <div className="flex gap-2">
                                                <span className={`text-[9px] uppercase font-black px-2 py-1 rounded inline-flex items-center border ${
                                                    contract.signature_worker ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'
                                                }`}>NGƯỜI LÀM</span>
                                                <span className={`text-[9px] uppercase font-black px-2 py-1 rounded inline-flex items-center border ${
                                                    contract.signature_client ? 'bg-indigo-900/30 text-indigo-400 border-indigo-500/50' : 'bg-slate-800 text-slate-500 border-slate-700'
                                                }`}>KHÁCH HÀNG</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="bg-[#090e17] rounded-xl border border-slate-800 p-6 mb-6 shadow-xl relative overflow-hidden">
                    {/* decorative scanline */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 pointer-events-none"></div>

                    <div className="flex justify-between items-end mb-4 relative z-10">
                        <h2 className="text-[12px] font-black text-white font-mono uppercase tracking-widest flex items-center gap-2">
                            <svg className="w-4 h-4 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                            TIẾN ĐỘ CÔNG VIỆC
                        </h2>
                        <span className="text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono">
                            {completedCheckpoints} / {totalCheckpoints} HOÀN THÀNH
                        </span>
                    </div>
                    <div className="w-full bg-[#02040a] rounded h-2 relative border border-slate-800 overflow-hidden z-10 mb-2">
                        <div 
                            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(6,182,212,0.8)]"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono text-right flex justify-end gap-2 z-10 relative">
                        TIẾN ĐỘ: <span className="text-cyan-400 font-bold">{progress.toFixed(0)}%</span>
                    </p>
                </div>

                {/* Checkpoints List (Read Only) */}
                <div className="bg-[#090e17]/60 rounded-xl border border-slate-800 p-6 shadow-xl">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
                        <h2 className="text-sm font-black text-white font-mono uppercase tracking-widest">DANH SÁCH CHECKPOINT</h2>
                        <span className={`px-3 py-1 bg-slate-800 border-l-2 ${contract.status === 'ACTIVE' ? 'border-cyan-500 text-cyan-400' : 'border-slate-500 text-slate-400'} font-black text-[9px] uppercase tracking-widest font-mono`}>
                            {contract.status === 'ACTIVE' ? 'CẦN XỬ LÝ' : 'CHỈ XEM'}
                        </span>
                    </div>
                    
                    <div className="space-y-4">
                        {contract.checkpoints && contract.checkpoints.length > 0 ? (
                            contract.checkpoints.map((checkpoint, index) => {
                                const canSubmit = contract.status === 'ACTIVE' && checkpoint.status === 'PENDING' && (index === 0 || contract.checkpoints[index - 1].status === 'APPROVED');
                                return (
                                <div 
                                    key={checkpoint.id}
                                    className={`relative border rounded-xl overflow-hidden transition-all duration-300 ${
                                        checkpoint.status === 'APPROVED' ? 'border-emerald-500/30 bg-emerald-900/10' :
                                        checkpoint.status === 'SUBMITTED' ? 'border-blue-500/30 bg-blue-900/10 hover:border-blue-500/50' :
                                        'border-slate-800 bg-[#02040a] hover:border-slate-700'
                                    }`}
                                >
                                    {/* Left highlight bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                                        checkpoint.status === 'APPROVED' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                        checkpoint.status === 'SUBMITTED' ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                                        checkpoint.status === 'REJECTED' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' :
                                        'bg-slate-700'
                                    }`}></div>

                                    <div className="p-6 pl-8">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                            <div className="flex items-start gap-4 flex-1">
                                                <div className="mt-1">
                                                {getStatusIcon(checkpoint.status)}
                                                </div>
                                                <div>
                                                    <h3 className="font-black text-white text-lg tracking-wider font-mono flex items-center gap-2">
                                                        <span className="text-slate-500 text-[10px]">CHECKPOINT 0{checkpoint.checkpoint_index || index + 1}:</span> 
                                                        {checkpoint.title}
                                                    </h3>
                                                    <p className="text-sm text-slate-400 mt-2 leading-relaxed max-w-2xl">{checkpoint.description}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="text-left sm:text-right shrink-0 pl-14 sm:pl-0">
                                                <p className="font-black text-emerald-400 font-mono text-xl">${Number(checkpoint.amount).toLocaleString()}</p>
                                                <span className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded text-[9px] font-black font-mono tracking-widest uppercase border ${getStatusColor(checkpoint.status)}`}>
                                                    {checkpoint.status}
                                                </span>
                                                {checkpoint.status === 'DISPUTED' && (
                                                    <button 
                                                        onClick={() => navigate(`/disputes/search?contractId=${contract.id}`)}
                                                        className="block mt-3 px-3 py-1 bg-rose-500 hover:bg-rose-400 text-white font-black text-[9px] font-mono tracking-widest uppercase rounded shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all ml-auto"
                                                    >
                                                        Giải quyết tranh chấp
                                                    </button>
                                                )}
                                            </div>

                                        </div>

                                        {checkpoint.due_date && (
                                            <div className="pl-14">
                                                <p className="text-[10px] text-cyan-500/70 font-mono flex items-center gap-2 uppercase tracking-widest">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                                                    HẠN CHÓT: {new Date(checkpoint.due_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}

                                        {/* Submission Info */}
                                        {checkpoint.submission_url && (
                                            <div className="ml-14 mt-4 bg-[#090e17] rounded border border-slate-800 p-4 relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-blue-500/50"></div>
                                                <p className="text-[10px] font-black text-blue-400 mb-2 font-mono uppercase tracking-widest flex items-center gap-2">
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                                    BÀI NỘP CỦA BẠN
                                                </p>
                                                <a 
                                                    href={checkpoint.submission_url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-[12px] font-mono text-cyan-400 hover:text-cyan-300 underline break-all inline-block mb-3 bg-cyan-900/20 px-2 py-1 rounded"
                                                >
                                                    {checkpoint.submission_url}
                                                </a>
                                                {checkpoint.submission_notes && (
                                                    <div className="bg-[#02040a] p-3 rounded text-sm text-slate-300 border border-slate-800/50 mb-2">
                                                        <span className="text-slate-500 font-mono text-[10px] uppercase block mb-1">GHI CHÚ:</span>
                                                        {checkpoint.submission_notes}
                                                    </div>
                                                )}
                                                {checkpoint.submitted_at && (
                                                    <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                                                        THỜI GIAN NỘP: {new Date(checkpoint.submitted_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Review Notes */}
                                        {checkpoint.review_notes && (
                                            <div className={`ml-14 mt-4 rounded border p-4 relative overflow-hidden ${
                                                checkpoint.status === 'APPROVED' 
                                                    ? 'bg-emerald-900/10 border-emerald-500/20' 
                                                    : 'bg-rose-900/10 border-rose-500/20'
                                            }`}>
                                                <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${checkpoint.status === 'APPROVED' ? 'bg-emerald-500/50' : 'bg-rose-500/50'}`}></div>
                                                <p className={`text-[10px] font-black mb-2 font-mono uppercase tracking-widest flex items-center gap-2 ${checkpoint.status === 'APPROVED' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    ĐÁNH GIÁ TỪ KHÁCH HÀNG
                                                </p>
                                                <div className="bg-[#02040a] p-3 rounded text-sm text-slate-300 border border-slate-800/50 mb-2">
                                                    {checkpoint.review_notes}
                                                </div>
                                                {checkpoint.reviewed_at && (
                                                    <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase">
                                                        THỜI GIAN DUYỆT: {new Date(checkpoint.reviewed_at).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        {/* Submit Button */}
                                        {canSubmit && (
                                            <button
                                                onClick={() => navigate(`/workspace/checkpoint/${checkpoint.id}`)}
                                                className="mt-6 w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-black rounded-xl hover:from-cyan-500 hover:to-blue-500 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] transform active:scale-[0.98] text-[11px] font-mono tracking-widest uppercase border border-cyan-400/50"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                BẮT ĐẦU LÀM
                                            </button>
                                        )}

                                        {!canSubmit && contract.status === 'ACTIVE' && checkpoint.status === 'PENDING' && index > 0 && (
                                            <p className="mt-4 text-[10px] text-slate-500 font-mono tracking-widest uppercase text-center w-full block">
                                                Vui lòng hoàn thành checkpoint trước đó
                                            </p>
                                        )}

                                        {checkpoint.status === 'SUBMITTED' && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-col items-center gap-3">
                                                <p className="text-[10px] text-amber-500 font-mono tracking-widest uppercase flex items-center justify-center gap-2">
                                                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                                                    ĐANG CHỜ KHÁCH HÀNG KIỂM DUYỆT...
                                                </p>
                                                {contract.status === 'ACTIVE' && (
                                                    <button
                                                        onClick={() => navigate(`/workspace/checkpoint/${checkpoint.id}`)}
                                                        className="w-full py-3 border border-amber-500/50 text-amber-400 bg-amber-900/20 hover:bg-amber-900/40 hover:text-amber-300 font-black rounded-xl flex items-center justify-center gap-2 shadow-[0_0_10px_rgba(245,158,11,0.2)] text-[11px] font-mono uppercase tracking-widest transition-all"
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                        CHỈNH SỬA LẠI (EDIT)
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-12 bg-[#02040a] border border-slate-800 rounded-xl border-dashed">
                                <svg className="w-8 h-8 mx-auto text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                                <p className="text-[12px] font-mono text-slate-500 uppercase tracking-widest">NO_NODES_CONFIGURED</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contract Reviews Section */}
                {contract.status === 'COMPLETED' && reviewsData.reviews.length > 0 && (
                    <div className="mt-8">
                        <ReviewsList data={reviewsData} type="contract" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContractDetail;
