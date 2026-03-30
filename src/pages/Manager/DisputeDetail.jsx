import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../auth/AuthContext";

const DisputeDetail = () => {
    const toast = useToast();
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [dispute, setDispute] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [resolving, setResolving] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [summary, setSummary] = useState("");
    const [confirmModal, setConfirmModal] = useState({ open: false, resolution: '', message: '' });

    useEffect(() => {
        fetchData();
    }, [id]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const detailRes = await managerApi.getDisputeDetail(id);
            setDispute(detailRes.data);
            setMessages(detailRes.data?.messages || []);
            if (detailRes.data.resolution_summary) {
                setSummary(detailRes.data.resolution_summary);
            }
        } catch (error) {
            console.error("Failed to fetch dispute details:", error);
            toast.error("Hệ thống: Không thể tải chi tiết tranh chấp.");
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            await managerApi.addDisputeMessage(id, newMessage);
            setNewMessage("");
            fetchData();
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Hệ thống: Không thể gửi tin nhắn hòa giải.");
        }
    };

    const handleResolve = (resolution) => {
        if (!summary.trim()) {
            toast.error("Hệ thống: Vui lòng nhập bản tóm tắt phán quyết (RESOLUTION_SUMMARY).");
            return;
        }

        const confirmMsg = resolution === 'CLIENT_WINS' 
            ? "XÁC NHẬN: CHỦ DỰ ÁN THẮNG? TIỀN SẼ ĐƯỢC HOÀN LẠI CHO CHỦ DỰ ÁN. GIAO THỨC NÀY KHÔNG THỂ HOÀN TÁC." 
            : "XÁC NHẬN: WORKER THẮNG? TIỀN SẼ ĐƯỢC THANH TOÁN CHO WORKER. GIAO THỨC NÀY KHÔNG THỂ HOÀN TÁC.";
            
        setConfirmModal({
            open: true,
            resolution,
            message: confirmMsg
        });
    };

    const executeResolve = async () => {
        const { resolution } = confirmModal;
        setConfirmModal({ ...confirmModal, open: false });

        try {
            setResolving(true);
            await managerApi.resolveDispute(id, resolution, summary);
            toast.success("Hệ thống: Tranh chấp đã được xử lý thành công. Network_Sync_Complete.");
            navigate("/manager/disputes");
        } catch (error) {
            console.error("Failed to resolve dispute:", error);
            toast.error("Hệ thống: Lỗi nghiêm trọng khi thực thi giao thức xử lý.");
        } finally {
            setResolving(false);
        }
    };

    const isManager = user?.role?.toLowerCase() === 'manager' || user?.role?.toLowerCase() === 'admin';

    const handleBack = () => {
        if (isManager) {
            navigate("/manager/disputes");
        } else if (user?.role?.toLowerCase() === 'employer') {
            navigate("/task-owner/contracts");
        } else {
            navigate("/dashboard");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center font-mono text-rose-500 animate-pulse py-40 uppercase tracking-[0.3em]">
                Deep_Scanning_Conflict_Node...
            </div>
        );
    }

    if (!dispute) {
        return (
            <div className="p-8 text-center font-mono py-40 flex flex-col items-center gap-6">
                <div className="text-rose-500 text-4xl">⚠</div>
                <p className="text-rose-500 uppercase tracking-[0.3em] text-sm">
                    Error: Conflict_Registry_Not_Found
                </p>
                <p className="text-slate-500 text-xs uppercase tracking-widest">
                    Tranh chấp không tồn tại hoặc bạn không có quyền truy cập.
                </p>
                <div className="flex gap-4">
                    <button
                        onClick={fetchData}
                        className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-black font-mono tracking-widest uppercase hover:bg-rose-500/30 transition-all"
                    >
                        RETRY
                    </button>
                    <button
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 text-[10px] font-black font-mono tracking-widest uppercase hover:border-slate-500 hover:text-white transition-all"
                    >
                        {isManager ? 'BACK_TO_LIST' : 'QUAY LẠI'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ${resolving ? 'opacity-50 pointer-events-none' : ''}`}>
            <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl border border-rose-500/10 bg-transparent/40 backdrop-blur-md overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <button 
                            onClick={handleBack}
                            className="group flex items-center gap-2 text-rose-500/50 hover:text-rose-400 transition-colors text-[10px] font-black font-mono tracking-widest uppercase"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                            {isManager ? 'BACK_TO_CONFLICT_REGISTRY' : 'QUAY LẠI'}
                        </button>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Conflict <span className="text-rose-500">#{dispute.id}</span> Registry
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest max-w-xl">
                        Full structural analysis of dispute #{dispute.id}. Review evidence before arbitration.
                    </p>
                </div>
                
                <div className="relative z-10 flex gap-4">
                    <span className={`px-4 py-2 rounded-xl border text-[10px] font-black font-mono tracking-widest uppercase flex items-center gap-2 ${dispute.status === 'OPEN' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dispute.status === 'OPEN' ? 'bg-rose-500' : 'bg-emerald-500'} animate-pulse`}></span>
                        {dispute.status}_PROTOCOL
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* Core Evidence Section */}
                    <section className="bg-transparent/40 border border-rose-500/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="p-6 border-b border-rose-500/5 bg-rose-500/[0.02]">
                            <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] font-mono">Conflict_Parameters</h2>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Raiser_Entity</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">
                                        {dispute.raiser_email}
                                        <span className="ml-2 text-[8px] text-rose-500/50 uppercase">
                                            ({dispute.raiser_email === dispute.client_email ? 'Employer' : 'Worker'})
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Defendant_Entity</p>
                                    <p className="text-sm font-black text-white uppercase tracking-tight">
                                        {dispute.raiser_email === dispute.client_email ? dispute.worker_email : dispute.client_email}
                                        <span className="ml-2 text-[8px] text-rose-500/50 uppercase">
                                            ({dispute.raiser_email === dispute.client_email ? 'Worker' : 'Employer'})
                                        </span>
                                    </p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Reason_Vector</p>
                                    <p className="text-sm font-black text-rose-400 uppercase tracking-tight">{dispute.reason}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Evidence_Log</p>
                                <div className="p-6 rounded-xl bg-transparent/40 border border-rose-500/5 text-xs text-slate-400 font-mono leading-relaxed uppercase tracking-wider">
                                    {dispute.analysis || "OPEN_MANUAL_ANALYSIS"}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Chat Log Section */}
                    <section className="bg-transparent/40 border border-rose-500/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="p-6 border-b border-rose-500/5 bg-rose-500/[0.02] flex justify-between items-center">
                            <h2 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] font-mono">Neutral_Observer_Log</h2>
                            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest animate-pulse">Live_Feed_Enabled</span>
                        </div>
                        <div className="p-6 max-h-[400px] overflow-y-auto space-y-4 custom-scrollbar">
                            {messages.length > 0 ? messages.map((m, idx) => (
                                <div key={idx} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between mb-1 px-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[9px] font-mono font-black uppercase px-1.5 py-0.5 rounded ${
                                                m.role?.toLowerCase() === 'manager' || m.role?.toLowerCase() === 'admin' 
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                            }`}>
                                                {m.role}
                                            </span>
                                            <span className="text-[9px] font-mono text-slate-400 font-bold">{m.email}</span>
                                        </div>
                                        <span className="text-[8px] font-mono text-slate-500 uppercase tracking-tighter">
                                            [{new Date(m.created_at).toLocaleTimeString()}]
                                        </span>
                                    </div>
                                    <div className={`p-3 rounded-lg border text-[10px] font-mono uppercase leading-relaxed ${m.role === 'manager' || m.role === 'ADMIN' ? 'bg-emerald-500/[0.05] border-emerald-500/20 text-emerald-300' : 'bg-rose-500/[0.02] border-rose-500/5 text-slate-300'}`}>
                                        {m.message}
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center py-10 text-[10px] font-mono text-slate-600 uppercase tracking-widest italic">No communication logs detected in this node</p>
                            )}
                        </div>

                        {/* Mediation Input */}
                        {dispute.status === 'OPEN' && (
                            <form onSubmit={handleSendMessage} className="p-4 bg-rose-500/[0.03] border-t border-rose-500/10 flex gap-4">
                                <input 
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="ENTER_MEDIATION_COMMAND_OR_QUERY..."
                                    className="flex-1 bg-slate-950/50 border border-rose-500/20 rounded-xl px-4 py-3 text-[10px] font-mono text-rose-400 placeholder:text-rose-900 outline-none focus:border-rose-500/50 transition-all uppercase tracking-widest"
                                />
                                <button 
                                    type="submit"
                                    className="px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-500 text-[10px] font-black font-mono tracking-widest uppercase hover:bg-rose-500/30 transition-all shadow-[0_0_15px_rgba(244,63,94,0.1)] active:scale-95"
                                >
                                    TRANSMIT
                                </button>
                            </form>
                        )}
                    </section>
                </div>

                {/* Arbitration Actions */}
                {isManager && (
                <div className="space-y-8">
                    <section className="bg-transparent/40 border border-rose-500/10 rounded-2xl p-8 backdrop-blur-sm sticky top-8">
                        <div className="mb-8 p-6 rounded-xl bg-rose-500/[0.03] border border-rose-500/10">
                            <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest mb-4">Final_Arbitration</p>
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${dispute.status === 'OPEN' ? 'bg-rose-500' : 'bg-emerald-500'} shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse`}></span>
                                <span className={`text-lg font-black uppercase tracking-tighter ${dispute.status === 'OPEN' ? 'text-rose-400' : 'text-emerald-400'}`}>
                                    {dispute.status === 'OPEN' ? 'WAITING_FOR_DECISION' : 'PROTOCOL_RESOLVED'}
                                </span>
                            </div>
                        </div>

                        {dispute.status === 'OPEN' ? (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Resolution_Summary (Required)</p>
                                    <textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        placeholder="PROVIDE_FORMAL_ARBITRATION_RATIONALE..."
                                        className="w-full min-h-[120px] bg-slate-950/50 border border-rose-500/20 rounded-xl p-4 text-[10px] font-mono text-slate-300 placeholder:text-rose-900 outline-none focus:border-rose-500/50 transition-all uppercase tracking-wider leading-relaxed"
                                    />
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    <button 
                                        onClick={() => handleResolve('CLIENT_WINS')}
                                        disabled={resolving}
                                        className="w-full py-4 rounded-xl border border-rose-500/50 text-rose-500 text-[10px] font-black font-mono tracking-[0.3em] uppercase hover:bg-rose-500/10 transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {resolving ? 'ARBITRATING...' : 'CLIENT_WINS_PROTOCOL'}
                                    </button>
                                    <button 
                                        onClick={() => handleResolve('WORKER_WINS')}
                                        disabled={resolving}
                                        className="w-full py-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-[#020617] text-[10px] font-black font-mono tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all active:scale-95 disabled:opacity-50"
                                    >
                                        {resolving ? 'ARBITRATING...' : 'WORKER_WINS_PROTOCOL'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">Final_Ruling_Summary</p>
                                <div className="p-5 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/20 text-[10px] font-mono text-slate-300 italic leading-relaxed uppercase">
                                    {summary || "NO_SUMMARY_DATA_RECORDED"}
                                </div>
                            </div>
                        )}

                        <div className="mt-10 p-4 rounded-xl border border-rose-500/5 bg-rose-500/[0.01]">
                            <p className="text-[7px] font-mono text-slate-600 uppercase leading-relaxed tracking-wider">
                                CAUTION: Final arbitration will execute asset redistribution immediately. This action cannot be reverted through standard protocols.
                            </p>
                        </div>
                    </section>
                </div>
                )}
            </div>

            {/* Custom Confirmation Modal */}
            {confirmModal.open && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    <div 
                        className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
                        onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                    />
                    <div className="relative w-full max-w-md bg-[#020617] border border-rose-500/30 rounded-2xl shadow-[0_0_50px_rgba(244,63,94,0.3)] overflow-hidden animate-in zoom-in duration-300">
                        {/* Header decor */}
                        <div className="h-1 w-full bg-gradient-to-r from-rose-500 via-transparent to-rose-500" />
                        
                        <div className="p-8">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                                    <svg className="w-6 h-6 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-black text-white font-mono tracking-widest uppercase">AUTHORIZE_PROTOCOL?</h3>
                            </div>
                            
                            <p className="text-[11px] font-mono text-slate-400 leading-relaxed uppercase tracking-wider mb-8 bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 border-dashed">
                                <span className="text-rose-500 font-black mr-2">[ CRITICAL_WARNING ]</span>
                                {confirmModal.message}
                            </p>
                            
                            <div className="flex gap-4 mt-8">
                                <button
                                    onClick={() => setConfirmModal({ ...confirmModal, open: false })}
                                    className="flex-1 py-4 border border-slate-800 text-slate-500 font-black font-mono text-[10px] tracking-[0.2em] uppercase rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    ABORT
                                </button>
                                <button
                                    onClick={executeResolve}
                                    className="flex-1 py-4 bg-rose-600 text-[#020617] font-black font-mono text-[10px] tracking-[0.2em] uppercase rounded-xl hover:bg-rose-500 transition-all shadow-[0_0_20px_rgba(244,63,94,0.3)] active:scale-95"
                                >
                                    AUTHORIZE_PROT.
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisputeDetail;
