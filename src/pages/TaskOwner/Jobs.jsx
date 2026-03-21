import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../auth/AuthContext";
import { jobsApi } from "../../api/jobs.api";
import { useTranslation } from "react-i18next";

const Jobs = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const PAGE_SIZE = 8;

    useEffect(() => {
        if (user) {
            fetchMyJobs();
        }
    }, [user]);

    const fetchMyJobs = async () => {
        try {
            setLoading(true);
            const response = await jobsApi.getMyJobs(user.id);
            setJobs(response.data || []);
        } catch (error) {
            console.error("Error fetching my jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
    const paginatedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    const handleDeleteJob = async (id) => {
        if (window.confirm(t('task_owner.confirm_delete_job', 'Are you sure you want to delete this job?'))) {
            try {
                await jobsApi.deleteJob(id);
                fetchMyJobs(); 
                toast.success(t('task_owner.job_deleted_success', 'Job deleted successfully'));
            } catch (error) {
                console.error("Error deleting job:", error);
                toast.error(t('task_owner.job_deleted_error', 'Failed to delete job'));
            }
        }
    };

    return (
        <div className="w-full min-h-full text-slate-300 relative">
            <div className="flex-1 flex flex-col relative z-10">
                {/* Header */}
                <header className="px-8 py-6 flex items-center justify-between border-b border-white/5 bg-transparent/50 backdrop-blur-md sticky top-0 z-50">
                    <div className="flex flex-col">
                        <p className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-black">{t('task_owner.module_name', 'JOB COMMAND')}</p>
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">{t('task_owner.my_jobs_title', 'My Job Listings')}</h1>
                    </div>
                    <button
                        onClick={() => navigate("/task-owner/post-job")}
                        className="group relative px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-[#020617] font-black text-[11px] tracking-widest uppercase rounded shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all"
                    >
                        {t('task_owner.post_job_btn', '+ POST_NEW_JOB')}
                    </button>
                </header>

                <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
                    {/* Filter / Stats Bar */}
                    <div className="mb-8 flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t('task_owner.total_active', 'TOTAL_ACTIVE')}</span>
                                <span className="text-xl font-black text-white font-mono">{jobs.filter(j => j.status === 'OPEN').length}</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t('task_owner.in_progress_count', 'IN_PROGRESS')}</span>
                                <span className="text-xl font-black text-cyan-400 font-mono">{jobs.filter(j => j.status === 'IN_PROGRESS').length}</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-slate-600 uppercase tracking-widest italic">
                            {t('task_owner.last_sync', 'LAST_SYNC')}: {new Date().toLocaleTimeString()}
                        </div>
                    </div>

                    {/* Table / List Container */}
                    <div className="rounded-2xl border border-white/5 bg-white/[0.01] overflow-hidden shadow-2xl">
                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin mb-4" />
                                <p className="text-[10px] font-mono text-cyan-500 tracking-[0.3em] uppercase animate-pulse">{t('task_owner.loading_data', 'RETRIEVING_DATA_FROM_GRID...')}</p>
                            </div>
                        ) : jobs.length === 0 ? (
                            <div className="p-20 text-center space-y-4">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600 mb-2">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                </div>
                                <p className="text-slate-500 font-mono text-sm tracking-widest uppercase italic">{t('task_owner.no_jobs_found', 'NO_JOB_ENTRIES_DETECTED')}</p>
                                <button
                                    onClick={() => navigate("/task-owner/post-job")}
                                    className="text-cyan-400 hover:text-cyan-300 font-black text-[10px] tracking-widest uppercase underline underline-offset-4"
                                >
                                    {t('task_owner.initialize_first_job', 'INITIALIZE_FIRST_ENTRY')}
                                </button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-white/5 border-b border-white/5">
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{t('task_owner.col_job', 'JOB_DOSSIER')}</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{t('task_owner.col_specs', 'SPECS')}</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{t('task_owner.col_budget', 'FUNDING')}</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{t('task_owner.col_proposals', 'APPLICANTS')}</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono">{t('task_owner.col_status', 'STATUS')}</th>
                                            <th className="px-6 py-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] font-mono text-right">{t('task_owner.col_actions', 'OPERATIONS')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {paginatedJobs.map((job) => (
                                            <tr key={job.id} className="hover:bg-cyan-500/[0.02] transition-colors group">
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="font-black text-white uppercase tracking-wider text-sm group-hover:text-cyan-400 transition-colors cursor-pointer" onClick={() => navigate(`/task-owner/jobs/${job.id}`)}>
                                                            {job.title}
                                                        </span>
                                                        <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
                                                            ID: {String(job.id || '').slice(0, 8)}... · {new Date(job.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex flex-col gap-1">
                                                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-tight">{job.category_name}</span>
                                                        <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{job.job_type === 'SHORT_TERM' ? 'SHORT_TERM' : 'LONG_TERM'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className="text-sm font-black text-emerald-400 font-mono">${Number(job.budget).toLocaleString()}</span>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-black text-white font-mono">{job.proposal_count || 0}</span>
                                                        <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase ${
                                                        job.status === "OPEN" ? "bg-emerald-900/30 text-emerald-400 border border-emerald-500/30" :
                                                        job.status === "IN_PROGRESS" ? "bg-cyan-900/30 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]" :
                                                        job.status === "CANCELLED" ? "bg-red-900/30 text-red-400 border border-red-500/30" :
                                                        "bg-slate-800 text-slate-400 border border-slate-700"
                                                    }`}>
                                                        {job.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-3 opacity-60 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => navigate(`/task-owner/jobs/${job.id}`)}
                                                            className="text-[9px] font-black text-slate-300 uppercase tracking-widest hover:text-white transition-colors border border-white/10 px-2 py-1 rounded hover:bg-white/5"
                                                        >
                                                            {t('task_owner.view_btn', 'VIEW')}
                                                        </button>
                                                        <button
                                                            onClick={() => navigate(`/task-owner/jobs/${job.id}/edit`)}
                                                            className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:text-cyan-300 transition-colors border border-white/10 px-2 py-1 rounded hover:bg-white/5"
                                                        >
                                                            {t('task_owner.edit_btn', 'EDIT')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteJob(job.id)}
                                                            className="text-[9px] font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors border border-white/10 px-2 py-1 rounded hover:bg-white/5"
                                                        >
                                                            {t('task_owner.delete_btn', 'DESTRUCT')}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Pagination Area */}
                        {totalPages > 1 && (
                            <div className="px-8 py-6 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 text-[10px] font-black font-mono tracking-widest uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    {t('task_owner.prev_btn', '← PREV_NODE')}
                                </button>
                                <div className="flex items-center gap-3">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-8 h-8 text-[10px] font-black font-mono rounded transition-all ${
                                                page === currentPage
                                                    ? 'bg-cyan-600 text-[#020617] shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                                    : 'text-slate-500 hover:text-cyan-400'
                                            }`}
                                        >
                                            {page.toString().padStart(2, '0')}
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 text-[10px] font-black font-mono tracking-widest uppercase text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                >
                                    {t('task_owner.next_btn', 'NEXT_NODE →')}
                                </button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Jobs;
