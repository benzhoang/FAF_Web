import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import axiosClient from '../../api/axiosClient';

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [financials, setFinancials] = useState(null);
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentJobs, setRecentJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, finRes, usersRes, jobsRes] = await Promise.all([
                    axiosClient.get('/admin/stats'),
                    axiosClient.get('/admin/financials'),
                    axiosClient.get('/admin/users', { params: { page: 1, limit: 10 } }),
                    axiosClient.get('/admin/management/jobs', { params: { page: 1, limit: 10 } })
                ]);
                setStats(statsRes.data);
                setFinancials(finRes.data);
                setRecentUsers(usersRes.data.users || []);
                setRecentJobs(jobsRes.data || []);
            } catch (error) {
                console.error('Error fetching admin dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#02040a] flex items-center justify-center font-mono">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                <p className="text-cyan-400 font-bold tracking-widest animate-pulse">INIT_SYSTEM_VARS...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-cyan-500/30">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                {/* Background effects */}
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>
                
                {/* Header */}
                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10">
                    <div className="flex items-center justify-between">
                        <div className="hidden lg:flex flex-1 min-w-[320px] max-w-xl">
                            <div className="relative w-full group">
                                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input
                                    className="w-full bg-[#02040a] border border-[#1e293b] rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 text-white placeholder-slate-600 outline-none"
                                    placeholder="Search nodes, protocols, or system IDs..."
                                    type="text"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-xs text-cyan-500/70 tracking-wider font-semibold border border-cyan-500/20 px-3 py-1.5 rounded bg-cyan-500/5">
                                SYS_TIME: <span className="text-cyan-400">{new Date().toLocaleTimeString()}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto relative z-0">
                    {/* Greeting Section */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold tracking-tight text-white mb-2 flex items-center gap-3">
                            <span className="w-2 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                            SYS_ADMIN // DASHBOARD
                        </h1>
                        <p className="text-slate-400 ml-5">Initialize sequence complete. Monitoring active sub-routines.</p>
                    </div>

                    {/* Summary Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Users */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-cyan-500/70 mb-1 tracking-widest uppercase">Total Nodes</p>
                                <p className="text-4xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{stats?.total_users || 0}</p>
                                <p className="text-xs text-cyan-400 font-semibold">{stats?.total_managers || 0} SYS_MANAGERS</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400/20 to-cyan-500"></div>
                        </div>

                        {/* Active Jobs */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-emerald-500/70 mb-1 tracking-widest uppercase">Active Contracts</p>
                                <p className="text-4xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{stats?.open_jobs || 0}</p>
                                <p className="text-xs text-emerald-400 font-semibold">{stats?.completed_jobs || 0} COMPLETED</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/20 to-emerald-500"></div>
                        </div>

                        {/* Pending Approvals */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-amber-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-amber-500/70 mb-1 tracking-widest uppercase">Pending Queues</p>
                                <p className="text-4xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{stats?.pending_jobs || 0}</p>
                                <p className="text-xs text-amber-500 font-semibold">AWAITING_REVIEW</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400/20 to-amber-500"></div>
                        </div>

                        {/* Total Fees */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-indigo-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-indigo-500/70 mb-1 tracking-widest uppercase">Sys Vault</p>
                                <p className="text-3xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{parseFloat(financials?.total_fees || 0).toFixed(2)} pts</p>
                                <p className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider">Turnover: {parseFloat(financials?.total_turnover || 0).toFixed(2)} pts</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-400/20 to-indigo-500"></div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {/* Users List */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] flex flex-col h-[400px]">
                            <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>
                                    NODE_REGISTRY
                                </h2>
                                <button
                                    onClick={() => navigate('/admin/user-management')}
                                    className="text-xs text-cyan-400 font-semibold hover:text-cyan-300 hover:underline transition-all"
                                >
                                    [EXPAND_LIST]
                                </button>
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {recentUsers.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-4">NO_DATA_FOUND</p>
                                ) : recentUsers.map((u) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 bg-[#02040a] rounded border border-[#1e293b] hover:border-cyan-500/30 transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-[#090e17] border border-[#1e293b] rounded flex items-center justify-center font-bold text-white group-hover:border-cyan-500/50 transition-colors uppercase">
                                                {u.name ? u.name.split(' ').map(n=>n[0]).join('') : u.email.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-semibold text-slate-200">{u.name || u.email.split('@')[0]}</h3>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{u.role} &bull; {new Date(u.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-1 rounded border uppercase ${
                                            u.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                                            u.status === 'LOCKED' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                            'bg-slate-500/20 text-slate-400 border-slate-500/30'
                                        }`}>
                                            {u.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Jobs */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] flex flex-col h-[400px]">
                            <div className="flex items-center justify-between mb-4 border-b border-[#1e293b] pb-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    ACTIVE_CONTRACTS
                                </h2>
                                <button
                                    onClick={() => navigate('/admin/job-oversight')}
                                    className="text-xs text-indigo-400 font-semibold hover:text-indigo-300 hover:underline transition-all"
                                >
                                    [EXPAND_LIST]
                                </button>
                            </div>
                            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {recentJobs.length === 0 ? (
                                    <p className="text-xs text-slate-500 text-center py-4">NO_DATA_FOUND</p>
                                ) : recentJobs.map((j) => (
                                    <div key={j.id} className="flex items-center justify-between p-3 bg-[#02040a] rounded border border-[#1e293b] hover:border-indigo-500/30 transition-colors group">
                                        <div className="flex-1 min-w-0 pr-4">
                                            <h3 className="text-sm font-semibold text-slate-200 truncate group-hover:text-indigo-300">{j.title}</h3>
                                            <div className="flex gap-2 items-center mt-1">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                                                    j.status === 'OPEN' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' :
                                                    j.status === 'IN_PROGRESS' || j.status === 'PENDING' ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' :
                                                    j.status === 'COMPLETED' ? 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' :
                                                    'text-slate-400 bg-slate-500/10 border-slate-500/30'
                                                }`}>
                                                    {j.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm text-indigo-400 font-bold">{j.budget} <span className="text-[10px] text-slate-500">PTS</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* System Logs Preview */}
                    <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b]">
                        <div className="flex items-center justify-between mb-6 border-b border-[#1e293b] pb-4">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                SYSTEM_LOGS
                            </h2>
                            <button
                                onClick={() => navigate('/admin/system-log')}
                                className="text-xs text-slate-400 font-semibold hover:text-white hover:underline transition-all"
                            >
                                [VIEW_ALL]
                            </button>
                        </div>
                        <div className="space-y-3 font-mono text-xs">
                            <div className="flex items-start gap-4 p-3 bg-[#02040a] rounded border-l-2 border-l-emerald-500 border border-[#1e293b]">
                                <span className="text-emerald-500 font-bold w-16 shrink-0">[INFO]</span>
                                <div className="flex-1">
                                    <span className="text-slate-500 mr-3">2026-03-10 14:02:45</span>
                                    <span className="text-slate-300">User node 'admin@faf.com' authenticated successfully. Session ID: x29F...</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-[#02040a] rounded border-l-2 border-l-cyan-500 border border-[#1e293b]">
                                <span className="text-cyan-500 font-bold w-16 shrink-0">[SYS]</span>
                                <div className="flex-1">
                                    <span className="text-slate-500 mr-3">2026-03-10 13:45:11</span>
                                    <span className="text-slate-300">Automated garbage collection completed. Freed 1.2GB memory.</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 bg-[#02040a] rounded border-l-2 border-l-amber-500 border border-[#1e293b]">
                                <span className="text-amber-500 font-bold w-16 shrink-0">[WARN]</span>
                                <div className="flex-1">
                                    <span className="text-slate-500 mr-3">2026-03-10 12:30:05</span>
                                    <span className="text-amber-500/80">Multiple failed login attempts detected from IP 192.168.1.45.</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            
            {/* Custom scrollbar styles can go into App.css or index.css. Added minimal inline support if needed. */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #1e293b;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #06b6d4;
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
