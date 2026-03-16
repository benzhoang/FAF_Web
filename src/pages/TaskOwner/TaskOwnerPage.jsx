import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { jobsApi } from "../../api/jobs.api";
import { contractsApi } from "../../api/contracts.api";
import { useTranslation } from "react-i18next";
import { useChatContext } from "../../contexts/ChatContext";

const SectionLabel = ({ children }) => (
  <p className="text-[9px] font-black tracking-[0.3em] text-cyan-500 uppercase font-mono mb-4 flex items-center gap-2 border-b border-cyan-500/10 pb-2">
      <span className="text-cyan-400 opacity-50">//</span> {children}
  </p>
);

const TaskOwnerPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { unreadMessages } = useChatContext();

  // Dynamic calculations based on loaded contracts
  const activeContractsCount = contracts.filter(c => c.status === 'ACTIVE').length;
  const totalSpentInEscrow = contracts
    .filter(c => c.status === 'ACTIVE' || c.status === 'COMPLETED')
    .reduce((sum, contract) => sum + Number(contract.total_amount || 0), 0);
  
  const todayGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.greeting_morning', 'GOOD MORNING');
    if (hour < 18) return t('dashboard.greeting_afternoon', 'GOOD AFTERNOON');
    return t('dashboard.greeting_evening', 'GOOD EVENING');
  }, [t]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [jobsRes, contractsRes] = await Promise.all([
          jobsApi.getAllJobs(),
          contractsApi.getMyContracts()
        ]);
        setJobs(jobsRes.data || []);
        setContracts(contractsRes.data || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const displayName = user?.full_name || user?.email?.split("@")[0] || t("task_owner.default_user");

  return (
    <div className="w-full min-h-full text-slate-300 relative">
      <div className="flex-1 flex flex-col relative z-10">
        {/* Top Navigation / Actions */}
        <header className="px-8 py-4 flex items-center justify-between border-b border-white/5 bg-transparent/50 backdrop-blur-md sticky top-0 z-50">
            <div className="flex flex-col">
              <p className="text-[10px] font-mono tracking-widest text-cyan-500 uppercase font-black">{t('task_owner.system_status', 'SYSTEM NODE ACTIVE')}</p>
              <h1 className="text-xl font-black text-white uppercase tracking-wider">
                {todayGreeting}, <span className="text-cyan-400">{displayName}</span>
              </h1>
            </div>
            <button
              className="group relative px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-[#020617] font-black text-[11px] tracking-widest uppercase rounded shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all hover:scale-105"
              onClick={() => navigate("/task-owner/post-job")}
            >
              {t("task_owner.post_job_btn")}
            </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8 space-y-10 max-w-7xl mx-auto w-full">
          
          {/* Dashboard Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="group relative rounded-2xl border p-6 overflow-hidden transition-all hover:border-cyan-500/30" 
                 style={{ background: 'linear-gradient(145deg, #0f172a, #020617)', borderColor: 'rgba(6,182,212,0.1)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <svg className="w-24 h-24 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black mb-2">{t('task_owner.active_job_posts_stat', 'ACTIVE DUBBING PROJECTS')}</p>
              <div className="flex items-baseline gap-3 relative z-10">
                <p className="text-4xl font-black text-white font-mono">{jobs.length}</p>
                <p className="text-[10px] text-cyan-400 font-black bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {t('task_owner.plus_one_week')}
                </p>
              </div>
              <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500 w-[65%] shadow-[0_0_8px_rgba(6,182,212,0.5)]"></div>
              </div>
            </div>

            <div className="group relative rounded-2xl border p-6 overflow-hidden transition-all hover:border-blue-500/30" 
                 style={{ background: 'linear-gradient(145deg, #1e293b, #0f172a)', borderColor: 'rgba(59,130,246,0.1)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <svg className="w-24 h-24 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black mb-2">{t('task_owner.total_spent', 'MINUTES PROCESSED')}</p>
              <div className="flex items-baseline gap-3 relative z-10">
                <p className="text-4xl font-black text-white font-mono">${Number(totalSpentInEscrow).toLocaleString()}</p>
              </div>
              <p className="mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest">{t('task_owner.across_active', 'ACROSS')} {activeContractsCount} {t('task_owner.active_contracts', 'ACTIVE CONTRACTS')}</p>
            </div>

            <div className="group relative rounded-2xl border p-6 overflow-hidden transition-all hover:border-emerald-500/30" 
                 style={{ background: 'linear-gradient(145deg, #064e3b, #0f172a)', borderColor: 'rgba(16,185,129,0.1)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
                <svg className="w-24 h-24 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-[10px] font-mono tracking-widest text-slate-500 uppercase font-black mb-2">{t('task_owner.unread_messages', 'STUDIO ALERTS')}</p>
              <div className="flex items-baseline gap-3 relative z-10">
                <p className="text-4xl font-black text-white font-mono">{unreadMessages}</p>
              </div>
              <div className="mt-4">
                <button 
                  onClick={() => navigate('/messages')}
                  className="text-[10px] font-black text-emerald-400 uppercase tracking-widest font-mono hover:text-emerald-300 transition-colors flex items-center gap-1 group/btn"
                >
                  {t('task_owner.go_to_inbox')} 
                  <svg className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          {/* Pending Reviews Section (High Importance) */}
          {contracts.some(c => c.status === 'ACTIVE' && c.checkpoints?.some(cp => cp.status === 'SUBMITTED')) && (
            <div className="space-y-4">
              <SectionLabel>{t('task_owner.pending_actions', 'CRITICAL REVIEWS')}</SectionLabel>
              <div className="grid grid-cols-1 gap-4">
                {contracts
                  .filter(c => c.status === 'ACTIVE' && c.checkpoints?.some(cp => cp.status === 'SUBMITTED'))
                  .map((contract) => {
                    const pendingCount = contract.checkpoints.filter(cp => cp.status === 'SUBMITTED').length;
                    return (
                      <div key={contract.id} className="relative group rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-5 hover:bg-cyan-500/10 transition-all">
                        <div className="flex items-center justify-between gap-6">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-black text-white uppercase tracking-wider truncate mb-1">{contract.job_title}</h3>
                              <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5">
                                  <span className="text-cyan-500 opacity-50">#</span> {t("task_owner.worker")} <span className="text-slate-300">{contract.worker_name || t("task_owner.unknown_worker")}</span>
                                </span>
                                <span className="text-amber-500 font-black animate-pulse">
                                  {pendingCount === 1 ? t('task_owner.pending_submissions_single', {count: pendingCount}) : t('task_owner.pending_submissions_plural', {count: pendingCount})}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => navigate(`/task-owner/contracts/${contract.id}/review`)}
                            className="shrink-0 px-6 py-2 bg-white text-[#020617] font-black text-[10px] tracking-widest uppercase rounded hover:bg-cyan-400 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                          >
                            {t("task_owner.review_btn")}
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Grid for Jobs and Contracts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            
            {/* Active Job Posts */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <SectionLabel>{t('task_owner.active_job_posts')}</SectionLabel>
                <button className="text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-400 transition-colors mb-4">{t('task_owner.view_all')}</button>
              </div>
              
              <div className="space-y-3">
                {jobs.map((job) => (
                  <div key={job.id} className={`group p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] border-l-2 ${job.status === 'DISPUTED' ? 'border-l-rose-500 animate-pulse bg-rose-500/5' : 'hover:border-l-cyan-500'} transition-all flex items-center justify-between`}>

                    <div className="flex items-center gap-4 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 transition-colors shrink-0">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-black text-white uppercase tracking-tight truncate mb-1">{job.title}</h3>
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                          {t('task_owner.posted_on', 'POSTED')}: {new Date(job.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-500 hover:text-cyan-400 font-mono text-[9px] font-black tracking-widest uppercase border border-white/5 rounded-lg hover:border-cyan-500/30 transition-all">
                      {t('task_owner.manage_btn')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contracts in Escrow */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <SectionLabel>{t('task_owner.contracts_escrow')}</SectionLabel>
                <button className="text-[10px] font-black text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-400 transition-colors mb-4">{t('task_owner.view_contracts')}</button>
              </div>

              <div className="space-y-4">
                {contracts.slice(0, 2).map((contract) => (
                  <div key={contract.id} className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-white uppercase tracking-wider">{contract.job_title}</h3>
                          <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t('task_owner.contract_with', { name: contract.worker_name || 'ANON OPERATIVE' })}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded text-[9px] font-black font-mono tracking-widest uppercase ${
                        contract.status === 'ACTIVE' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30' : 
                        contract.status === 'DISPUTED' ? 'bg-rose-900/30 text-rose-400 border border-rose-500/50 animate-pulse' :
                        'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {contract.status === 'ACTIVE' ? t('task_owner.in_progress_status') : 
                         contract.status === 'DISPUTED' ? 'ĐANG TRANH CHẤP' : contract.status}
                      </span>

                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest">
                        <span className="text-slate-500">{t('task_owner.escrow_allocation', 'ALLOCATION')}</span>
                        <span className="text-white font-black">${Number(contract.total_amount || 0).toLocaleString()}</span>
                      </div>
                      <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 w-[45%] shadow-[0_0_8px_rgba(139,92,246,0.5)]"></div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <div>
                        <p className="text-[8px] font-mono text-slate-600 uppercase tracking-widest mb-1">{t('task_owner.next_milestone')}</p>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-tight italic">
                          {contract.next_milestone || 'PHASE_ALPHA_COMPLETE'}
                        </p>
                      </div>
                      <button className="text-[10px] font-black text-violet-400 uppercase tracking-widest font-mono hover:text-violet-300 transition-colors">
                        DETAILS_ACCESS
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommended Talent - Horizon Scroll or Grid */}
          <div className="space-y-6">
            <SectionLabel>{t('task_owner.recommended_talent')}</SectionLabel>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="relative group p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-cyan-500/20 transition-all overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl -translate-x-10 -translate-y-10 group-hover:bg-cyan-500/10 transition-all"></div>
                  
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white font-black text-xl shadow-lg border border-white/10">
                      {i === 1 ? 'MT' : 'ER'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-black text-white uppercase tracking-wider truncate">
                          {i === 1 ? 'Michael T.' : 'Emily R.'}
                        </h3>
                        <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-[8px] font-black font-mono tracking-widest uppercase border border-cyan-500/20">
                          {t('task_owner.verified')}
                        </span>
                      </div>
                      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">
                        {i === 1 ? 'Senior DevOps Engineer' : 'Illustrator & Graphic Artist'}
                      </p>
                      
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1 font-mono text-xs">
                          <span className="text-cyan-500 font-black">★</span>
                          <span className="text-white font-black">{i === 1 ? '5.0' : '4.9'}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest">
                          {t('task_owner.jobs_count', { count: i === 1 ? 42 : 18 })}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {['AWS', 'K8S', 'CI/CD'].map(skill => (
                          <span key={skill} className="text-[8px] font-mono bg-white/5 text-slate-400 px-2 py-1 rounded border border-white/5 uppercase font-black">
                            {skill}
                          </span>
                        ))}
                      </div>

                      <button className="w-full py-2 border border-cyan-500/20 text-cyan-400 font-mono text-[10px] font-black tracking-widest uppercase hover:bg-cyan-500 hover:text-[#020617] transition-all rounded">
                        {t('task_owner.view_profile', 'ACCESS_DOSSIER')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center pt-4">
              <button className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono hover:text-white transition-colors border-b border-transparent hover:border-white/20 pb-1">
                {t('task_owner.view_more_talent')}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskOwnerPage;
