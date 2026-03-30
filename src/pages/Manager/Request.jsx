import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import managerApi from "../../api/manager.api";
import { useToast } from "../../contexts/ToastContext";

const Request = () => {
    const toast = useToast();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await managerApi.getPendingJobs();
            setRequests(response.data || []);
        } catch (error) {
            console.error("Failed to fetch pending jobs:", error);
            toast.error("Hệ thống: Không thể tải danh sách yêu cầu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <header className="relative p-8 rounded-2xl border border-[#00f0ff]/20 bg-[#050810]/80 backdrop-blur-xl overflow-hidden group shadow-[0_0_30px_rgba(0,240,255,0.05)]">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at center, #00f0ff 0%, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 group-hover:opacity-20 transition-all duration-700">
                    <svg className="w-40 h-40 text-[#00f0ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                </div>
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-4 inline-flex px-4 py-1.5 rounded-full border border-[#00f0ff]/30 bg-[#00f0ff]/5">
                            <span className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse"></span>
                            <p className="text-[10px] font-black font-mono tracking-[0.3em] text-[#00f0ff] uppercase">Command_Center_Active</p>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-widest leading-tight mb-2">
                            Job <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] drop-shadow-[0_0_15px_rgba(191,0,255,0.5)]">Requests</span>
                        </h1>
                        <p className="text-[#94a3b8] text-xs font-mono uppercase tracking-widest max-w-xl border-l-2 border-[#00f0ff] pl-3">
                            Overseeing incoming job deployment packets. Validate parameters before nexus injection.
                        </p>
                    </div>
                </div>
            </header>

            {/* Holographic Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'TOTAL_NODES', value: requests.length, color: '#00f0ff' },
                    { label: 'PENDING_MOD', value: requests.length, color: '#00f0ff' },
                    { label: 'RESOLVED_24H', value: '0', color: '#64748b' },
                    { label: 'AVG_LATENCY', value: '1.2s', color: '#64748b' }
                ].map((stat, i) => (
                    <div key={i} className="group relative bg-[#0a1128]/50 border border-gray-800 p-6 rounded-xl flex flex-col items-center justify-center hover:-translate-y-1 transition-all duration-300 hover:border-[#00f0ff]/40 hover:shadow-[0_10px_30px_rgba(0,240,255,0.1)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00f0ff]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        <p className="text-[10px] font-mono text-[#94a3b8] tracking-[0.2em] mb-2 relative z-10">{stat.label}</p>
                        <p className="text-3xl font-black font-mono relative z-10" style={{ color: stat.color, textShadow: stat.color === '#00f0ff' ? '0 0 15px rgba(0,240,255,0.5)' : 'none' }}>{stat.value}</p>
                        {/* Hexagon tech accent */}
                        <svg className="absolute bottom-[-10px] right-[-10px] w-16 h-16 opacity-5 group-hover:opacity-20 group-hover:rotate-45 transition-all duration-700" style={{ fill: stat.color }} viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                    </div>
                ))}
            </div>

            {/* Main Content: Encrypted Data Packets */}
            <div className="space-y-4 perspective-1000">
                {loading ? (
                    <div className="text-center py-20 font-mono text-[#00f0ff] animate-pulse uppercase tracking-[0.3em]">
                        <span className="inline-block border border-[#00f0ff]/30 px-6 py-3 bg-[#00f0ff]/5 shadow-[0_0_20px_rgba(0,240,255,0.2)]">
                            Scanning_Database_Registry...
                        </span>
                    </div>
                ) : (
                    requests.map((req, i) => (
                        <div 
                            key={req.id}
                            className="group relative p-6 bg-[#050810]/60 backdrop-blur-sm border border-gray-800 rounded-xl hover:border-[#00f0ff]/40 transition-all duration-500 overflow-hidden preserve-3d hover:translate-z-4 hover:shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {/* Glowing Left Status Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${req.budget > 1000 ? 'bg-[#fbbf24]' : 'bg-[#00f0ff]'} group-hover:w-2 transition-all shadow-[0_0_15px_rgba(0,240,255,0.8)]`}></div>
                            
                            {/* Scanning line effect on hover */}
                            <div className="absolute top-0 bottom-0 left-[-100%] w-1/2 bg-gradient-to-r from-transparent via-[#00f0ff]/10 to-transparent pointer-events-none group-hover:animate-[scanline_2s_linear_infinite]" />

                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 pl-4">
                                <div className="flex items-start gap-5 flex-1">
                                    {/* Tech Icon */}
                                    <div className="w-14 h-14 rounded-lg bg-[#0a1128] border border-[#00f0ff]/20 flex items-center justify-center text-[#00f0ff] shrink-0 group-hover:rotate-12 transition-transform duration-500 shadow-[inset_0_0_15px_rgba(0,240,255,0.1)] relative">
                                        <div className="absolute top-1 left-1 w-1 h-1 bg-[#00f0ff]" />
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-[10px] font-mono font-black text-[#bf00ff] uppercase tracking-widest border border-[#bf00ff]/30 px-2 py-0.5 bg-[#bf00ff]/10">
                                                [REQ_NODE_{req.id}]
                                            </span>
                                            <span className="text-[10px] font-mono text-[#94a3b8] uppercase tracking-widest">{new Date(req.created_at).toLocaleDateString()}</span>
                                            <span className={`px-2 py-0.5 text-[9px] font-black font-mono tracking-widest uppercase border ${req.budget > 1000 ? 'bg-[#fbbf24]/10 text-[#fbbf24] border-[#fbbf24]/30' : 'bg-[#00f0ff]/10 text-[#00f0ff] border-[#00f0ff]/30'}`}>
                                                {req.budget > 1000 ? 'HIGH' : 'NORMAL'}_PRIORITY
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-black text-white group-hover:text-[#00f0ff] transition-colors uppercase tracking-widest truncate mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                                            {req.title}
                                        </h3>
                                        <p className="text-xs text-[#94a3b8] font-mono flex items-center gap-2 uppercase tracking-widest">
                                            <svg className="w-4 h-4 text-[#bf00ff]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                                            Origin: <span className="text-white ml-1">{req.client_email}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 shrink-0 border-l border-gray-800 pl-6">
                                    <div className="flex flex-col items-end">
                                        <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1">Status</span>
                                        <span className="text-xs font-black font-mono tracking-widest uppercase text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                                            {req.status}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => navigate(`/manager/request/${req.id}`)}
                                        className="relative group/btn bg-transparent border border-[#00f0ff] px-6 py-3 font-black text-[10px] text-[#00f0ff] uppercase tracking-[0.2em] font-mono transition-all overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.1)] hover:shadow-[0_0_30px_rgba(0,240,255,0.4)]"
                                    >
                                        <div className="absolute inset-0 bg-[#00f0ff] scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-300 ease-out z-0 pointer-events-none" />
                                        <span className="relative z-10 group-hover/btn:text-black transition-colors duration-300 pointer-events-none">
                                            INITIALIZE
                                        </span>
                                        {/* Corner ticks */}
                                        <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-[#00f0ff] m-0.5 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-[#00f0ff] m-0.5 pointer-events-none" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {!loading && requests.length === 0 && (
                    <div className="p-20 text-center rounded-2xl border-2 border-dashed border-gray-800 bg-[#050810]/50 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                        <svg className="w-16 h-16 text-[#00f0ff]/20 mx-auto mb-6 group-hover:scale-110 group-hover:text-[#00f0ff]/40 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="text-[#00f0ff]/50 text-sm font-mono font-black uppercase tracking-[0.3em] group-hover:text-[#00f0ff] transition-colors duration-500 drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                            QUEUE_EMPTY // ALL_NODES_STABLE
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Request;

