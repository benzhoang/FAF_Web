import React, { useState, useEffect, useCallback } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import { useToast } from '../../contexts/ToastContext';
import managerApi from '../../api/manager.api';

const Moderation = () => {
    const { showToast } = useToast();
    const [tasks, setTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterReason, setFilterReason] = useState('All Reasons');
    const [sortBy, setSortBy] = useState('Newest First');
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const [disputesRes, jobsRes] = await Promise.all([
                managerApi.listDisputes(),
                managerApi.getPendingJobs()
            ]);

            const disputes = (disputesRes.data || []).map(d => ({
                id: `dispute-${d.id}`,
                realId: d.id,
                type: 'DISPUTE',
                status: (d.status === 'open' || !d.status) ? 'FLAGGED' : d.status.toUpperCase(),
                time: d.created_at ? new Date(d.created_at).toLocaleString() : 'Recently',
                jobTitle: d.contract?.job?.title || 'Unknown Contract',
                company: d.contract?.employer?.name || 'Unknown Employer',
                location: d.contract?.job?.location || 'Remote',
                reasonType: 'REPORTED REASON',
                reasonText: d.reason || 'No reason provided',
                reasonIcon: '⚖️'
            }));

            const pendingJobs = (jobsRes.data || []).map(j => ({
                id: `job-${j.id}`,
                realId: j.id,
                type: 'JOB',
                status: 'PENDING',
                time: j.created_at ? new Date(j.created_at).toLocaleString() : 'Recently',
                jobTitle: j.title,
                company: j.employer?.name || 'New Employer',
                location: j.location || 'Remote',
                reasonType: 'AUTO-FLAG REASON',
                reasonText: 'New job posting awaiting approval.',
                reasonIcon: '📝'
            }));

            const allTasks = [...disputes, ...pendingJobs];
            setTasks(allTasks);
            setFilteredTasks(allTasks);
        } catch (error) {
            console.error(error);
            showToast('Failed to sync moderation queue', 'error');
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        let filtered = [...tasks];
        
        if (activeTab === 'Flagged Only') {
            filtered = filtered.filter(task => task.status === 'FLAGGED');
        } else if (activeTab === 'Pending Review') {
            filtered = filtered.filter(task => task.status === 'PENDING');
        }

        if (searchTerm) {
            const lowSearch = searchTerm.toLowerCase();
            filtered = filtered.filter(task =>
                task.jobTitle.toLowerCase().includes(lowSearch) ||
                task.company.toLowerCase().includes(lowSearch) ||
                task.reasonText.toLowerCase().includes(lowSearch)
            );
        }

        if (filterReason !== 'All Reasons') {
            filtered = filtered.filter(task => task.reasonType === filterReason);
        }

        if (sortBy === 'Newest First') {
            filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
        } else if (sortBy === 'Oldest First') {
            filtered.sort((a, b) => new Date(a.time) - new Date(b.time));
        }

        setFilteredTasks(filtered);
    }, [activeTab, searchTerm, filterReason, sortBy, tasks]);

    const handleApprove = async (task) => {
        try {
            if (task.type === 'JOB') {
                await managerApi.approveJob(task.realId);
                showToast('Job approved successfully', 'success');
            } else {
                showToast('Please resolve disputes via the detailed view', 'info');
                return;
            }
            fetchData();
        } catch (error) {
            showToast('Action failed', 'error');
        }
    };

    const handleHide = async (task) => {
        try {
            if (task.type === 'JOB') {
                await managerApi.rejectJob(task.realId, 'Rejected by Administrator');
                showToast('Job rejected', 'success');
            } else {
                showToast('Dispute quarantine initiated', 'info');
            }
            fetchData();
        } catch (error) {
            showToast('Action failed', 'error');
        }
    };

    const pendingCount = tasks.filter(t => t.status === 'PENDING').length;
    const criticalCount = tasks.filter(t => t.status === 'FLAGGED').length;

    return (
        <div className="min-h-screen bg-[#02040a] flex font-mono text-slate-300 selection:bg-amber-500/30">
            <AdminSidebar />

            <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
                <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none"></div>

                <header className="bg-[#090e17]/80 backdrop-blur-md border-b border-[#1e293b] px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
                    <div className="hidden lg:flex flex-1 min-w-[320px] max-w-xl">
                        <div className="relative w-full group">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                className="w-full bg-[#02040a] border border-[#1e293b] rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-amber-500 focus:ring-1 focus:ring-amber-500/50 text-white placeholder-slate-600 outline-none"
                                placeholder="Search users, jobs, or system logs..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-xs text-amber-500/70 tracking-wider font-semibold border border-amber-500/20 px-3 py-1.5 rounded bg-amber-500/5">
                            SYS_TIME: <span className="text-amber-400">{new Date().toLocaleTimeString()}</span>
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 overflow-y-auto relative z-0">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                                <span className="w-2 h-8 bg-amber-500 rounded-sm shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
                                MODERATION_QUEUE
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2 bg-amber-500/10 text-amber-400 px-3 py-1.5 rounded-full border border-amber-500/20">
                                        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.8)]"></div>
                                        <span className="text-xs font-bold tracking-widest">{pendingCount} PENDING</span>
                                    </div>
                                    <div className="flex items-center gap-2 bg-red-500/10 text-red-400 px-3 py-1.5 rounded-full border border-red-500/20">
                                        <div className="w-2 h-2 bg-red-500 rounded-full animate-ping shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                                        <span className="text-xs font-bold tracking-widest">{criticalCount} CRITICAL</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 ml-5 uppercase text-[10px] tracking-[0.2em]">Evaluate protocol violations and maintain system integrity.</p>
                    </div>

                    <div className="bg-[#090e17] rounded-xl p-4 border border-[#1e293b] mb-8 flex flex-wrap items-center gap-4 justify-between transition-all group hover:border-[#334155]">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative group/select">
                                <select
                                    value={filterReason}
                                    onChange={(e) => setFilterReason(e.target.value)}
                                    className="appearance-none bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 pr-10 text-xs font-bold text-slate-400 hover:text-white hover:border-amber-500/50 focus:border-amber-500 outline-none cursor-crosshair transition-all"
                                >
                                    <option value="All Reasons">FILTER_BY_REASON</option>
                                    <option value="REPORTED REASON">REPORTED_REASON</option>
                                    <option value="AUTO-FLAG REASON">AUTO_FLAG_REASON</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover/select:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            <div className="relative group/select">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="appearance-none bg-[#02040a] border border-[#1e293b] rounded-lg px-4 py-2 pr-10 text-xs font-bold text-slate-400 hover:text-white hover:border-amber-500/50 focus:border-amber-500 outline-none cursor-crosshair transition-all"
                                >
                                    <option value="Newest First">SORT_NEWEST</option>
                                    <option value="Oldest First">SORT_OLDEST</option>
                                </select>
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none group-hover/select:text-amber-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {['All', 'Flagged Only', 'Pending Review'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-all border ${activeTab === tab
                                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                        : 'bg-[#02040a] text-slate-500 border-[#1e293b] hover:border-amber-500/30 hover:text-amber-300'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                            <p className="text-amber-400 font-bold tracking-[0.3em] animate-pulse mt-6 uppercase">SYNCING_QUEUE...</p>
                        </div>
                    ) : filteredTasks.length === 0 ? (
                        <div className="text-center py-20 border border-dashed border-[#1e293b] rounded-xl bg-[#090e17]/50">
                            <p className="text-slate-500 uppercase tracking-widest font-bold">No tasks found in sector.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {filteredTasks.map((task) => (
                                <div key={task.id} className="bg-[#090e17] rounded-2xl border border-[#1e293b] shadow-xl overflow-hidden hover:border-amber-500/50 transition-all group relative">
                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent group-hover:via-amber-400 transition-all"></div>
                                    
                                    <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#02040a]/40">
                                        <span className={`px-3 py-1 rounded text-[10px] font-black tracking-widest uppercase border ${task.status === 'FLAGGED'
                                            ? 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                                            }`}>
                                            [{task.status}]
                                        </span>
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">{task.time}</span>
                                    </div>

                                    <div className="p-5">
                                        <h3 className="font-bold text-white mb-2 text-lg group-hover:text-amber-400 transition-colors uppercase tracking-tight line-clamp-2 min-h-[56px]">{task.jobTitle}</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-5 uppercase tracking-wide">
                                            <span className="text-amber-500/70 truncate max-w-[120px]">{task.company}</span>
                                            <span className="opacity-30">•</span>
                                            <span className="truncate max-w-[120px]">{task.location}</span>
                                        </div>

                                        <div className="bg-[#02040a] rounded-xl border border-[#1e293b] p-4 mb-5 group/reason hover:border-amber-500/30 transition-all">
                                            <div className="flex items-start gap-3">
                                                <span className="text-xl filter drop-shadow-[0_0_3px_rgba(255,255,255,0.3)]">{task.reasonIcon}</span>
                                                <div className="flex-1">
                                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1 group-hover/reason:text-amber-500 transition-colors">
                                                        {task.reasonType}
                                                    </p>
                                                    <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-3 min-h-[48px]">{task.reasonText}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => handleApprove(task)}
                                                className="flex-1 bg-amber-500/10 text-amber-400 border border-amber-500/50 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-amber-500/20 hover:border-amber-400 transition-all font-mono"
                                            >
                                                {task.type === 'JOB' ? 'APPROVE' : 'VIEW_DETAIL'}
                                            </button>
                                            <button
                                                onClick={() => handleHide(task)}
                                                className="flex-1 bg-transparent border border-[#1e293b] text-slate-500 px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all flex items-center justify-center gap-2 font-mono"
                                            >
                                                {task.type === 'JOB' ? 'REJECT' : 'QUARANTINE'}
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-all"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredTasks.length > 0 && (
                        <div className="text-center mt-12 pb-10">
                            <button className="inline-flex items-center gap-3 px-8 py-3 bg-[#090e17] border border-[#1e293b] rounded-xl text-slate-400 text-xs font-bold tracking-[0.3em] uppercase hover:text-amber-400 hover:border-amber-500/50 hover:bg-[#02040a] transition-all shadow-xl group font-mono">
                                LOAD_MORE_DATA
                                <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Moderation;
