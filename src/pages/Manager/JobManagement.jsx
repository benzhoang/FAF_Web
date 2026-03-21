import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const JobManagement = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await managerApi.getJobsManagement();
            setJobs(response.data || []);
        } catch (error) {
            console.error("Failed to fetch jobs management:", error);
            toast.error("Hệ thống: Không thể tải danh sách quản lý công việc.");
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs.filter(j => 
        j.id.toString().includes(query) || 
        j.title?.toLowerCase().includes(query.toLowerCase()) ||
        j.client_email?.toLowerCase().includes(query.toLowerCase()) ||
        j.worker_email?.toLowerCase().includes(query.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'OPEN': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
            case 'PENDING': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            case 'COMPLETED': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
            case 'CANCELLED': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                        <p className="text-[10px] font-black font-mono tracking-[0.3em] text-emerald-500 uppercase">System_Work_Orchestrator</p>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        Work <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8 decoration-4">Hub</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
                        Global oversight of job lifecycles and contract execution. Monitoring node performance.
                    </p>
                </div>

                <div className="w-full lg:w-[480px] relative group">
                    <div className="absolute -inset-0.5 bg-emerald-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center bg-transparent/50 border border-emerald-500/10 rounded-xl overflow-hidden backdrop-blur-md">
                        <div className="pl-4 text-emerald-500/50">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH_BY_ID_CREATOR_OR_WORKER..."
                            className="w-full bg-transparent px-4 py-4 text-xs font-mono font-black text-emerald-400 placeholder:text-slate-700 outline-none uppercase tracking-widest"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center font-mono text-emerald-500 animate-pulse uppercase tracking-[0.3em]">
                        Scanning_Active_Contracts...
                    </div>
                ) : filteredJobs.length > 0 ? (
                    <div className="overflow-x-auto rounded-2xl border border-emerald-500/10 bg-transparent/40 backdrop-blur-md">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-emerald-500/10 bg-emerald-500/[0.02]">
                                    <th className="p-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Job_ID</th>
                                    <th className="p-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Status</th>
                                    <th className="p-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Entity_Nexus</th>
                                    <th className="p-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Progress</th>
                                    <th className="p-4 text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest text-right">Budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredJobs.map((j) => {
                                    const progress = j.total_checkpoints > 0 
                                        ? Math.round((j.approved_checkpoints / j.total_checkpoints) * 100) 
                                        : 0;
                                    
                                    return (
                                        <tr 
                                            key={j.id}
                                            onClick={() => navigate(`/manager/request/${j.id}`)}
                                            className="group border-b border-emerald-500/5 hover:bg-emerald-500/[0.03] transition-colors cursor-pointer"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-mono font-black text-white group-hover:text-emerald-400 transition-colors">#{j.id}</span>
                                                    {j.has_dispute && (
                                                        <span className="animate-pulse flex items-center justify-center w-4 h-4 rounded-full bg-rose-500/20 border border-rose-500/50 text-rose-500 text-[8px] font-black">!</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-md text-[9px] font-black font-mono tracking-widest border uppercase ${getStatusColor(j.status)}`}>
                                                    {j.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="space-y-1">
                                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Employer: <span className="text-white">{j.client_email}</span></p>
                                                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">Worker: <span className="text-emerald-500/70">{j.worker_email || 'UNASSIGNED'}</span></p>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="w-48 space-y-2">
                                                    <div className="flex justify-between items-center text-[8px] font-mono font-black text-slate-500 uppercase tracking-widest">
                                                        <span>{j.approved_checkpoints}/{j.total_checkpoints} CP</span>
                                                        <span>{progress}%</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-emerald-500/10">
                                                        <div 
                                                            className={`h-full transition-all duration-1000 ${j.has_dispute ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'}`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="text-xs font-mono font-black text-emerald-400">{Number(j.budget).toLocaleString()} PTS</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-20 text-center rounded-3xl border border-dashed border-emerald-500/20 bg-emerald-500/[0.01]">
                        <p className="text-slate-500 text-xs font-mono font-black uppercase tracking-widest">NO_JOBS_FOUND_IN_REGISTRY</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default JobManagement;
