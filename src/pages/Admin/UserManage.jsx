import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import AddManagerModal from '../../components/AddManagerModal';
import managerApi from '../../api/manager.api';

const UserManage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('ALL_NODES');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const itemsPerPage = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, activeFilter]); // Refetch when page or filter changes

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await managerApi.listUsers(currentPage, itemsPerPage);
            const { users, total } = response.data;
            setUsers(users || []);
            setTotalUsers(total || 0);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getRiskLevel = (user) => {
        // Since riskScore isn't in DB yet, mock it dynamically for UI based on id length or role
        let score = user.riskScore;
        if (score === undefined) {
             score = Math.floor(Math.random() * 100);
        }
        if (score >= 70) return { score, label: 'CRITICAL', textColor: 'text-red-500', barColor: 'bg-red-500 box-shadow-[0_0_10px_rgba(239,68,68,0.8)]' };
        if (score >= 40) return { score, label: 'WARNING', textColor: 'text-amber-500', barColor: 'bg-amber-500 box-shadow-[0_0_10px_rgba(245,158,11,0.8)]' };
        if (score >= 20) return { score, label: 'NORMAL', textColor: 'text-emerald-500', barColor: 'bg-emerald-500 box-shadow-[0_0_10px_rgba(16,185,129,0.8)]' };
        return { score, label: 'SAFE', textColor: 'text-cyan-500', barColor: 'bg-cyan-500 box-shadow-[0_0_10px_rgba(6,182,212,0.8)]' };
    };

    const getInitials = (name) => {
        if (!name) return '??';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusBadge = (status) => {
        if (status === 'Active' || status === 'ACTIVE') {
            return <span className="text-[10px] font-bold px-2 py-1 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">ACTIVE</span>;
        }
        return <span className="text-[10px] font-bold px-2 py-1 rounded border bg-slate-500/10 text-slate-400 border-slate-500/30">{status ? status.toUpperCase() : 'UNKNOWN'}</span>;
    };

    const totalPages = Math.ceil(totalUsers / itemsPerPage) || 1;
    const currentUsers = users.filter(u => {
        if (activeFilter === 'ACTIVE_ONLY') return u.status === 'ACTIVE';
        if (activeFilter === 'LOCKED') return u.status !== 'ACTIVE';
        return true;
    }).filter(u => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (u.name && u.name.toLowerCase().includes(term)) || 
               (u.email && u.email.toLowerCase().includes(term)) ||
               (u.role && u.role.toLowerCase().includes(term));
    });

    const activeJobs = 842;
    const systemHealth = 98.9;

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
                                    placeholder="Search users, protocols, or system IDs..."
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
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
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                <span className="w-2 h-8 bg-cyan-500 rounded-sm shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                                NODE_REGISTRY
                            </h1>
                            <div className="flex items-center gap-3">
                                <button className="inline-flex items-center gap-2 px-4 py-2 border border-[#1e293b] rounded-lg bg-[#090e17] text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 transition-colors text-sm font-semibold">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    EXTRACT_DATA
                                </button>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded-lg hover:bg-cyan-500/30 hover:border-cyan-400 transition-colors text-sm font-semibold shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    INIT_MANAGER
                                </button>
                            </div>
                        </div>
                        <p className="text-slate-400 ml-5">Monitor node activity, assign protocols, and mitigate system threats.</p>
                    </div>

                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* Total Users */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-cyan-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-cyan-500/70 mb-1 tracking-widest uppercase">Total Nodes</p>
                                <p className="text-3xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{totalUsers.toLocaleString()}</p>
                                <p className="text-xs text-cyan-400 font-semibold">+5.2% Since last cycle</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400/20 to-cyan-500"></div>
                        </div>

                        {/* Active Jobs */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-emerald-500/70 mb-1 tracking-widest uppercase">Active Contracts</p>
                                <p className="text-3xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{activeJobs}</p>
                                <p className="text-xs text-emerald-400 font-semibold">+1.8% Contracts running</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/20 to-emerald-500"></div>
                        </div>

                        {/* System Health */}
                        <div className="bg-[#090e17] rounded-xl p-6 border border-[#1e293b] relative overflow-hidden group hover:border-emerald-500/50 transition-colors shadow-lg">
                            <div className="relative z-10">
                                <p className="text-xs font-bold text-emerald-500/70 mb-1 tracking-widest uppercase">System Core Health</p>
                                <p className="text-3xl font-black text-white mb-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{systemHealth}%</p>
                                <p className="text-xs text-emerald-400 font-semibold">OPERATIONAL</p>
                            </div>
                            <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-20 transition-opacity">
                                <svg className="w-16 h-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400/20 to-emerald-500"></div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-[#090e17] rounded-xl p-4 border border-[#1e293b] mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search Bar already handled in logic, but UI filter buttons remain here */}
                        <div className="flex items-center gap-2">
                            {['ALL_NODES', 'HIGH_RISK', 'ACTIVE_ONLY', 'LOCKED'].map((filter) => (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={`px-4 py-2 rounded border transition-all text-xs font-bold tracking-widest uppercase ${activeFilter === filter
                                        ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                        : 'bg-transparent text-slate-500 border-[#1e293b] hover:border-cyan-500/30 hover:text-cyan-300'
                                    }`}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* User Table */}
                    <div className="bg-[#090e17] rounded-xl border border-[#1e293b] overflow-hidden shadow-lg relative">
                        {loading && (
                            <div className="absolute inset-0 bg-[#02040a]/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                                <p className="text-cyan-400 font-bold tracking-widest animate-pulse mt-4">FETCHING_RECORDS...</p>
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#02040a] border-b border-[#1e293b]">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500/70 uppercase tracking-widest">NODE_ID / IDENTITY</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500/70 uppercase tracking-widest">PROTOCOL/ROLE</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500/70 uppercase tracking-widest">STATUS</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500/70 uppercase tracking-widest">RISK_METRICS</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-cyan-500/70 uppercase tracking-widest">ACTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1e293b]">
                                    {currentUsers.length === 0 && !loading ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-12 text-center">
                                                <p className="text-slate-500 uppercase tracking-widest font-bold">No nodes found matching criteria.</p>
                                            </td>
                                        </tr>
                                    ) : (
                                        currentUsers.map((user) => {
                                            const risk = getRiskLevel(user);
                                            const displayName = user.name || user.email.split('@')[0];
                                            
                                            // Filtering risk visually based on the UI dropdown if needed
                                            if (activeFilter === 'HIGH_RISK' && risk.score < 40) return null;

                                            return (
                                                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            {user.avatar ? (
                                                                <img src={user.avatar} alt={displayName} className="w-10 h-10 rounded border border-[#1e293b] group-hover:border-cyan-500/50 transition-colors" />
                                                            ) : (
                                                                <div className="w-10 h-10 rounded bg-[#02040a] border border-[#1e293b] flex items-center justify-center group-hover:border-cyan-500/50 transition-colors">
                                                                    <span className="text-slate-400 group-hover:text-cyan-400 font-bold text-sm tracking-wider">{getInitials(displayName)}</span>
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{displayName}</p>
                                                                <p className="text-[10px] text-slate-500 tracking-wider uppercase font-mono mt-0.5">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">{user.role}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {getStatusBadge(user.status)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 min-w-[120px]">
                                                                <div className="flex items-center justify-between mb-1">
                                                                    <span className={`text-[10px] font-bold ${risk.textColor} uppercase tracking-widest`}>
                                                                        {risk.label}
                                                                    </span>
                                                                    <span className={`text-[10px] font-bold ${risk.textColor}`}>
                                                                        {risk.score}%
                                                                    </span>
                                                                </div>
                                                                <div className="w-full bg-[#02040a] border border-[#1e293b] rounded-full h-1.5 overflow-hidden">
                                                                    <div
                                                                        className={`h-full rounded-full ${risk.barColor} transition-all duration-500`}
                                                                        style={{ width: `${risk.score}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-cyan-400 font-bold border border-transparent hover:border-cyan-500/30 bg-transparent hover:bg-cyan-500/10 px-3 py-1.5 rounded transition-all">
                                                            [INSPECT]
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 border-t border-[#1e293b] bg-[#02040a] flex items-center justify-between">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                                DISPLAYING {(currentPage - 1) * itemsPerPage + 1} &rarr; {Math.min(currentPage * itemsPerPage, totalUsers)} | TOTAL: {totalUsers}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="p-1.5 border border-[#1e293b] rounded bg-[#090e17] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold transition-all border ${currentPage === pageNum
                                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                                : 'bg-[#090e17] text-slate-400 border-[#1e293b] hover:border-cyan-500/30 hover:text-cyan-300'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <span className="px-2 text-slate-500 tracking-widest">...</span>
                                )}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-1.5 border border-[#1e293b] rounded bg-[#090e17] text-slate-400 hover:border-cyan-500/50 hover:text-cyan-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Add Manager Modal */}
            <AddManagerModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    fetchUsers();
                }}
            />
        </div>
    );
};

export default UserManage;
