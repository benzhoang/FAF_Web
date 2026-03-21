import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { jobsApi } from "../../api/jobs.api";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const RequestDetail = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        fetchJobDetail();
    }, [id]);

    const fetchJobDetail = async () => {
        try {
            setLoading(true);
            const response = await jobsApi.getJobDetail(id);
            setJob(response.data);
        } catch (error) {
            console.error("Failed to fetch job detail:", error);
            toast.error("Hệ thống: Không thể tải chi tiết yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    const handleAccept = async () => {
        try {
            setProcessing(true);
            await managerApi.approveJob(id);
            toast.success(`Packet #${id} injection authorized.`);
            navigate("/manager/request");
        } catch (error) {
            console.error("Failed to approve job:", error);
            toast.error("Hệ thống: Lỗi khi duyệt yêu cầu.");
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        const reason = prompt("Nhập lý do từ chối (REJECTION_REASON):");
        if (reason === null) return;
        
        try {
            setProcessing(true);
            await managerApi.rejectJob(id, reason || "No reason provided.");
            toast.success(`Packet #${id} rejection protocol executed.`);
            navigate("/manager/request");
        } catch (error) {
            console.error("Failed to reject job:", error);
            toast.error("Hệ thống: Lỗi khi từ chối yêu cầu.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center font-mono text-emerald-500 animate-pulse py-40 uppercase tracking-[0.3em]">
                Deep_Scanning_Packet_Header...
            </div>
        );
    }

    if (!job) {
        return (
            <div className="p-8 text-center font-mono text-rose-500 py-40 uppercase tracking-[0.3em]">
                Error: Packet_Not_Found_In_Registry
            </div>
        );
    }

    return (
        <div className={`p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700 ${processing ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* Header Section */}
            <header className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-2xl border border-emerald-500/10 bg-transparent/40 backdrop-blur-md overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <button 
                            onClick={() => navigate("/manager/request")}
                            className="group flex items-center gap-2 text-emerald-500/50 hover:text-emerald-400 transition-colors text-[10px] font-black font-mono tracking-widest uppercase"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                            BACK_TO_QUEUE
                        </button>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Packet <span className="text-emerald-500">#{job.id}</span> Analysis
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest max-w-xl">
                        Full structural scan of job deployment request. Verify parameters before authorization.
                    </p>
                </div>
                
                <div className="relative z-10 flex gap-4">
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[10px] font-black font-mono tracking-widest uppercase flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        {job.status}_PROTOCOL
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Data Section */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-transparent/40 border border-emerald-500/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <div className="p-6 border-b border-emerald-500/5 bg-emerald-500/[0.02]">
                            <h2 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] font-mono">Structural_Parameters</h2>
                        </div>
                        
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Job_Title</p>
                                    <p className="text-xl font-black text-white uppercase tracking-tight">{job.title}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Origin_Corporation</p>
                                    <p className="text-xl font-black text-emerald-400 uppercase tracking-tight">{job.client?.full_name || job.client?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-emerald-500/5">
                                {[
                                    { label: 'CATEGORY', val: job.category_name },
                                    { label: 'MAGNITUDE', val: `$${job.budget}` },
                                    { label: 'ENGAGEMENT', val: job.job_type },
                                    { label: 'TIMESTAMP', val: new Date(job.created_at).toLocaleDateString() }
                                ].map((item, i) => (
                                    <div key={i}>
                                        <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-xs font-black text-slate-200 uppercase tracking-tight">{item.val}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Skill_Vectors</p>
                                <div className="flex flex-wrap gap-2">
                                    {job.skills?.length > 0 ? job.skills.map(skill => (
                                        <span key={skill.id} className="px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-black font-mono uppercase tracking-widest ring-1 ring-emerald-500/10">
                                            {skill.name}
                                        </span>
                                    )) : (
                                        <span className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">No skill vectors detected</span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Description_Buffer</p>
                                <div className="p-6 rounded-xl bg-transparent/40 border border-emerald-500/5 text-xs text-slate-400 font-mono leading-relaxed uppercase tracking-wider">
                                    {job.description || "NO_DESCRIPTION_DATA"}
                                </div>
                            </div>

                            {job.checkpoints?.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest">Checkpoint_Pipeline</p>
                                    <div className="space-y-3">
                                        {job.checkpoints.map((cp, idx) => (
                                            <div key={cp.id} className="p-4 rounded-lg border border-emerald-500/5 bg-emerald-500/[0.01] space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-[9px] font-mono text-emerald-500/50">0{idx + 1}</span>
                                                        <span className="text-[10px] font-black font-mono text-white uppercase">{cp.name}</span>
                                                    </div>
                                                    <span className="text-[10px] font-black font-mono text-emerald-400">${cp.amount}</span>
                                                </div>
                                                
                                                {/* Submission Data */}
                                                {(cp.submission_url || cp.submission_notes) && (
                                                    <div className="mt-3 pt-3 border-t border-emerald-500/10 space-y-2">
                                                        <p className="text-[8px] font-mono font-black text-slate-600 uppercase tracking-widest">Submission_Evidence</p>
                                                        {cp.submission_url && (
                                                            <a 
                                                                href={cp.submission_url} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="block text-[10px] font-mono text-emerald-500 underline decoration-emerald-500/30 truncate"
                                                            >
                                                                {cp.submission_url}
                                                            </a>
                                                        )}
                                                        {cp.submission_notes && (
                                                            <p className="text-[9px] font-mono text-slate-400 bg-slate-950/50 p-2 rounded border border-emerald-500/5 italic">
                                                                {cp.submission_notes}
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Sidebar Actions Section */}
                <div className="space-y-8">
                    <section className="bg-transparent/40 border border-emerald-500/10 rounded-2xl p-8 backdrop-blur-sm sticky top-8">
                        <div className="mb-8 p-6 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10">
                            <p className="text-[9px] font-mono font-black text-slate-500 uppercase tracking-widest mb-4">Authorization_Status</p>
                            <div className="flex items-center gap-3">
                                <span className={`w-3 h-3 rounded-full ${job.status === 'PENDING' ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'} animate-pulse`}></span>
                                <span className={`text-lg font-black uppercase tracking-tighter ${job.status === 'PENDING' ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    {job.status === 'PENDING' ? 'WAITING_FOR_SIGNATURE' : 'PROTOCOL_STABLE'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 text-[10px] font-mono font-black uppercase tracking-[0.2em] mb-10">
                            <div className="flex justify-between border-b border-emerald-500/5 pb-4">
                                <span className="text-slate-600">PACKET_ID</span>
                                <span className="text-slate-300">#REQ_NODE_{job.id}</span>
                            </div>
                            <div className="flex justify-between border-b border-emerald-500/5 pb-4">
                                <span className="text-slate-600">SOURCE_SIG</span>
                                <span className="text-slate-300 text-[8px] truncate max-w-[120px]">{job.client?.email}</span>
                            </div>
                        </div>

                        {job.status === 'PENDING' && (
                            <div className="grid grid-cols-1 gap-4">
                                <button 
                                    onClick={handleReject}
                                    disabled={processing}
                                    className="w-full py-4 rounded-xl border border-rose-500/30 text-rose-500 text-[10px] font-black font-mono tracking-[0.3em] uppercase hover:bg-rose-500/10 transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'EXECUTING...' : 'ABORT_INJECTION'}
                                </button>
                                <button 
                                    onClick={handleAccept}
                                    disabled={processing}
                                    className="w-full py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-[#020617] text-[10px] font-black font-mono tracking-[0.3em] uppercase shadow-[0_0_30px_rgba(16,185,129,0.2)] transition-all active:scale-95 disabled:opacity-50"
                                >
                                    {processing ? 'PROCESSING...' : 'AUTHORIZE_PACKET'}
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default RequestDetail;

