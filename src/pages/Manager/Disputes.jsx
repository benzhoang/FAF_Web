import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const Disputes = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const [disputes, setDisputes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchDisputes();
    }, []);

    const fetchDisputes = async () => {
        try {
            setLoading(true);
            const response = await managerApi.listDisputes();
            setDisputes(response.data || []);
        } catch (error) {
            console.error("Failed to fetch disputes:", error);
            toast.error("Hệ thống: Không thể tải danh sách tranh chấp.");
        } finally {
            setLoading(false);
        }
    };

    const filteredDisputes = disputes.filter(d => 
        d.id.toString().includes(query) || 
        d.reason?.toLowerCase().includes(query.toLowerCase()) ||
        d.raiser_email?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)] animate-pulse"></span>
                        <p className="text-[10px] font-black font-mono tracking-[0.3em] text-rose-500 uppercase">Conflict_Resolution_Protocol</p>
                    </div>
                    <h1 className="text-4xl font-black text-white uppercase tracking-tighter leading-none mb-2">
                        System <span className="text-rose-500 underline decoration-rose-500/30 underline-offset-8 decoration-4">Disputes</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">
                        Monitoring active conflicts between nodes. Intervention required for protocol stability.
                    </p>
                </div>

                <div className="w-full lg:w-[480px] relative group">
                    <div className="absolute -inset-0.5 bg-rose-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500"></div>
                    <div className="relative flex items-center bg-transparent/50 border border-rose-500/10 rounded-xl overflow-hidden backdrop-blur-md">
                        <div className="pl-4 text-rose-500/50">
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="SEARCH_BY_ID_OR_RAISER..."
                            className="w-full bg-transparent px-4 py-4 text-xs font-mono font-black text-rose-400 placeholder:text-slate-700 outline-none uppercase tracking-widest"
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <div className="py-20 text-center font-mono text-rose-500 animate-pulse uppercase tracking-[0.3em]">
                        Scanning_Conflict_Nodes...
                    </div>
                ) : filteredDisputes.length > 0 ? (
                    filteredDisputes.map((d) => (
                        <div 
                            key={d.id}
                            onClick={() => navigate(`/dispute/${d.id}`)}
                            className="group relative bg-transparent/40 border border-rose-500/10 rounded-2xl p-6 hover:border-rose-500/40 hover:bg-rose-500/[0.03] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >
                            <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 font-mono font-black text-lg">
                                    !
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="text-white font-black uppercase tracking-tight group-hover:text-rose-400 transition-colors text-sm">
                                            #{d.id} - {d.reason || "NO_REASON_PROVIDED"}
                                        </h3>
                                        <span className={`px-2 py-0.5 rounded text-[8px] font-black font-mono tracking-widest uppercase ${d.status === 'PENDING' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            {d.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
                                        RAISED_BY: <span className="text-slate-300">{d.raiser_email}</span> • {new Date(d.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden md:block">
                                    <p className="text-[8px] font-mono font-black text-slate-600 tracking-widest uppercase">CONCERN_LEVEL</p>
                                    <p className="text-xs font-mono font-black text-rose-400 uppercase">CRITICAL</p>
                                </div>
                                <svg className="w-5 h-5 text-slate-700 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-20 text-center rounded-3xl border border-dashed border-rose-500/20 bg-rose-500/[0.01]">
                        <p className="text-slate-500 text-xs font-mono font-black uppercase tracking-widest">NO_ACTIVE_DISPUTES_DETECTED</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Disputes;
