import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { matchingApi } from '../../api/matching.api';
import { proposalsApi } from '../../api/proposals.api';
import { contractsApi } from '../../api/contracts.api';
import { reviewsApi } from '../../api/reviews.api';
import { useAuth } from '../../auth/AuthContext';
import warehouseImg from '../../assets/istockphoto-1947499362-612x612.jpg';
import StatCard from './components/StatCard';
import JobTable from './components/JobTable';
import ReviewsList from './components/ReviewsList';
import { useTranslation } from 'react-i18next';

const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-cyan-500 uppercase font-mono mb-3 flex items-center gap-1.5 border-b border-cyan-500/20 pb-2">
        <span className="text-cyan-400">//</span> {children}
    </p>
);

const AILaserRecommendJob = ({ job, navigate }) => {
    const [aiData, setAiData] = useState(null);
    const [scanning, setScanning] = useState(false);
    const [scanned, setScanned] = useState(false);

    const handleScan = async (e) => {
        e.stopPropagation();
        if (scanned || scanning) return;
        setScanning(true);
        try {
            const res = await matchingApi.getAIRecommendations(job.id);
            if (res.data) setAiData(res.data);
        } catch (err) {
            console.error("AI Scan failed", err);
        } finally {
            setScanning(false);
            setScanned(true);
        }
    };

    return (
        <div 
            className="p-3 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 bg-slate-800/30 transition-all cursor-pointer relative overflow-hidden group/ai"
            onClick={() => navigate(`/work/${job.id}`)}
        >
            {/* Laser scanning animation */}
            {scanning && (
                <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden rounded-xl">
                    <div className="w-full h-full bg-cyan-500/10 animate-pulse"></div>
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] animate-[scan_1.5s_ease-in-out_infinite]" />
                </div>
            )}

            <div className="flex justify-between items-start mb-1 relative z-20">
                <h4 className="text-[12px] font-bold text-white uppercase tracking-wider truncate pr-2">{job.title}</h4>
                <span className="text-[10px] font-black tracking-widest text-slate-500 font-mono shrink-0">{job.badge}</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase mb-2 relative z-20">{job.company} · {job.price}</div>
            
            <div className="relative z-20 mt-2 border-t border-slate-700/50 pt-2">
                {!scanned && !scanning ? (
                    <button 
                        onClick={handleScan}
                        className="w-full flex items-center justify-center gap-2 py-1.5 text-[9px] font-black font-mono tracking-widest uppercase text-purple-400 bg-purple-900/20 hover:bg-purple-900/40 border border-purple-500/30 hover:border-purple-400 rounded transition-all shadow-[0_0_10px_rgba(168,85,247,0.1)] group-hover/ai:shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                    >
                        <svg className="w-3 h-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        SYS.AI_SCAN_MATCH
                    </button>
                ) : scanning ? (
                    <div className="w-full text-center py-1.5 text-[9px] font-black font-mono tracking-widest uppercase text-cyan-400 animate-pulse">
                        <span className="inline-block animate-[bounce_1s_infinite]">.</span>
                        <span className="inline-block animate-[bounce_1s_infinite_100ms]">.</span>
                        <span className="inline-block animate-[bounce_1s_infinite_200ms]">.</span> PROCESSING_NEURAL_NET ...
                    </div>
                ) : (
                    <div className="w-full bg-[#02040a]/50 border border-emerald-500/30 rounded p-2 shadow-[inset_0_0_10px_rgba(16,185,129,0.1)]">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] font-black font-mono tracking-widest text-emerald-500 uppercase flex items-center gap-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                AI_TARGET_LOCK
                            </span>
                            <span className="text-[12px] font-black font-mono text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)]">{aiData?.match_score}%</span>
                        </div>
                        <p className="text-[10px] text-emerald-100/70 font-mono leading-tight border-l-2 border-emerald-500/50 pl-2">{aiData?.reason}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const WorkerDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
    const { user: authUser } = useAuth();
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [myProposals, setMyProposals] = useState([]);
    const [allContracts, setAllContracts] = useState([]);
    const [activeContract, setActiveContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const [proposalsLoading, setProposalsLoading] = useState(true);
    const [contractLoading, setContractLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [reviewsData, setReviewsData] = useState({ reviews: [], summary: null });
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const { t } = useTranslation();

    const todayGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'CHÀO BUỔI SÁNG';
        if (hour < 18) return 'CHÀO BUỔI CHIỀU';
        return 'CHÀO BUỔI TỐI';
    }, []);

    // Get user name from AuthContext (full_name is the field from backend)
    const userName = authUser?.full_name || authUser?.email || t('dashboard.you');
    const userObj = authUser || {};

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const res = await matchingApi.getRecommendedJobs({ limit: 5 });
                const mappedJobs = (res?.data ?? []).map(job => ({
                    id: job.id,
                    title: job.title,
                    company: job.category_name || t('dashboard.other'),
                    price: `$${Number(job.budget).toLocaleString()}`,
                    meta: [
                        { icon: 'calendar', text: new Date(job.created_at).toLocaleDateString() },
                        { icon: 'spark', text: `${job.job_type === 'SHORT_TERM' ? t('dashboard.short_term') : t('dashboard.long_term')}` }
                    ],
                    badge: `${job.match_score}${t('dashboard.match_percent')}`,
                    extra: `${job.matching_skills_count} ${t('dashboard.matching_skills')}`,
                    img: warehouseImg
                }));
                setRecommendedJobs(mappedJobs);
            } catch (error) {
                console.error("Error fetching recommendations:", error);
            } finally { setLoading(false); }
        };

        const fetchMyProposals = async () => {
            try {
                setProposalsLoading(true);
                const res = await proposalsApi.getMyProposals();
                setMyProposals(res.data || []);
            } catch (error) { console.error("Error fetching proposals:", error); } 
            finally { setProposalsLoading(false); }
        };

        const fetchContracts = async () => {
            try {
                setContractLoading(true);
                const [activeRes, allRes] = await Promise.all([
                    contractsApi.getMyActiveContract(),
                    contractsApi.getMyContracts()
                ]);
                setActiveContract(activeRes.data ?? null);
                setAllContracts(allRes.data || []);
            } catch (error) { console.error("Error fetching contracts:", error); } 
            finally { setContractLoading(false); }
        };
        
        const fetchReviews = async () => {
            try {
                setReviewsLoading(true);
                if (userObj.id) {
                    const res = await reviewsApi.getUserReviews(userObj.id);
                    setReviewsData({ reviews: res.data || [], summary: res.summary || null });
                }
            } catch (error) { console.error("Error fetching reviews:", error); } 
            finally { setReviewsLoading(false); }
        };

        fetchRecommendations();
        fetchMyProposals();
        fetchContracts();
        fetchReviews();
    }, [userObj.id]);

    return (
        <div className="w-full min-h-screen bg-transparent text-slate-300 relative">

            <div className="mx-auto max-w-7xl px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="lg:col-span-3">
                        <div className="rounded-2xl border p-5 relative overflow-hidden group" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                            <div className="mb-6 min-w-0">
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="truncate text-[10px] font-mono tracking-widest text-cyan-500 uppercase">{t('dashboard.your_profile')}</p>
                                    <h2 className="truncate text-lg font-black text-white uppercase tracking-wider">{userName}</h2>
                                </div>
                                {userObj.tier && (
                                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-widest ${
                                        userObj.tier === 'EXPERT' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' : 
                                        userObj.tier === 'PRO' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30' : 
                                        'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                        {t('dashboard.tier')} {userObj.tier}
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border p-4" style={{ background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-300 font-mono tracking-widest uppercase">{t('dashboard.active_contracts')}</p>
                                        <span className="rounded bg-cyan-900/30 border border-cyan-500/30 px-1.5 py-0.5 text-[9px] font-black text-cyan-400 font-mono">
                                            {activeContract ? t('dashboard.one_active') : t('dashboard.zero_active')}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic font-mono uppercase tracking-widest">
                                        {activeContract ? t('dashboard.tracking_contract') : t('dashboard.no_active_contract')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN CONTENT ── */}
                    <section className="lg:col-span-9 space-y-6">
                        {/* Header Panel */}
                        <div className="rounded-2xl border p-6 lg:p-8 relative overflow-hidden" style={{ background: 'radial-gradient(ellipse at bottom right, rgba(6,182,212,0.1) 0%, transparent 60%), linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-cyan-400/40 to-transparent" />
                            <div className="flex flex-col gap-2">
                                <p className="text-cyan-500 font-mono text-[10px] tracking-widest uppercase">{t('dashboard.status_online')}</p>
                                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                                    {todayGreeting}, <span className="text-cyan-400">{userName}</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-mono">{t('dashboard.ready_to_work')}</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-slate-700/50">
                            <nav className="-mb-px flex space-x-1 overflow-x-auto no-scrollbar scroll-smooth">
                                {[
                                    { id: 'overview', label: t('dashboard.overview') },
                                    { id: 'jobs', label: t('dashboard.active_jobs') },
                                    { id: 'applications', label: 'ỨNG TUYỂN CỦA TÔI' },
                                    { id: 'reviews', label: t('dashboard.performance_reviews') }
                                ].map((tabDef) => (
                                    <button key={tabDef.id} onClick={() => setActiveTab(tabDef.id)}
                                        className={`whitespace-nowrap px-6 py-3 border-b-2 font-black text-[11px] tracking-widest uppercase font-mono transition-all ${
                                            activeTab === tabDef.id
                                            ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                        }`}>
                                        {tabDef.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="pt-2">
                            {activeTab === 'overview' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    {/* Active Mission */}
                                    {activeContract && (
                                        <div className="rounded-2xl border p-6 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(145deg,#082f49,#0f172a)', borderColor: 'rgba(34,211,238,0.4)' }}>
                                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                                <svg className="w-32 h-32 text-cyan-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.8l7.2 14.2H4.8L12 5.8z"/></svg>
                                            </div>
                                            <div className="relative z-10">
                                                <SectionLabel>{t('dashboard.current_job')}</SectionLabel>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-white uppercase tracking-wider">{activeContract.job_title}</h3>
                                                        <p className="text-[12px] font-mono text-cyan-400 mt-1 uppercase tracking-widest">{activeContract.client_name || t('dashboard.anonymous_client')}</p>
                                                    </div>
                                                    <div className="flex flex-col md:items-end gap-2">
                                                        <span className={`inline-block px-3 py-1 rounded text-[10px] font-black font-mono tracking-widest uppercase border ring-1 blur-[0.3px] ${
                                                            (activeContract.status === 'PENDING' || !activeContract.signature_worker)
                                                                ? 'bg-amber-900/40 text-amber-400 border-amber-500/50 ring-amber-400/20' 
                                                                : 'bg-cyan-900/40 text-cyan-400 border-cyan-500/50 ring-cyan-400/20'
                                                        }`}>
                                                            {(activeContract.status === 'PENDING' || !activeContract.signature_worker) ? 'CHỜ KÝ HỢP ĐỒNG (OTP)' : t('dashboard.in_progress')}
                                                        </span>
                                                        <p className="text-lg font-black text-emerald-400 font-mono">${Number(activeContract.total_amount || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-6 flex flex-col sm:flex-row gap-3">
                                                    {!activeContract.signature_worker ? (
                                                        <button onClick={() => navigate(`/contract/${activeContract.id}/sign`)} className="w-full sm:w-auto px-6 py-2.5 text-[10px] font-black font-mono tracking-widest uppercase bg-amber-500 hover:bg-amber-400 text-slate-900 transition-colors rounded shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                                                            KÝ HỢP ĐỒNG
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => navigate(`/contract/${activeContract.id}/view`)} className="w-full sm:w-auto px-6 py-2.5 text-[10px] font-black font-mono tracking-widest uppercase bg-cyan-500 hover:bg-cyan-400 text-[#020617] transition-colors rounded shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                                            {t('dashboard.view_details')}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Grid */}
                                    {!contractLoading && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#082f49,#0f172a)', borderColor: 'rgba(56,189,248,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase mb-2">{t('dashboard.total_earnings')}</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">${allContracts.filter(c => c.status === 'COMPLETED').reduce((s, c) => s + Number(c.total_amount || 0), 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{t('dashboard.accumulated_earnings')}</div>
                                            </div>
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#4c1d95,#0f172a)', borderColor: 'rgba(167,139,250,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-purple-400 uppercase mb-2">{t('dashboard.completed_jobs')}</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">{allContracts.filter(c => c.status === 'COMPLETED').length}</div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{t('dashboard.approved_jobs')}</div>
                                            </div>
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#047857,#0f172a)', borderColor: 'rgba(52,211,153,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-2">{t('dashboard.success_rate')}</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">
                                                    {(allContracts.length > 0 
                                                        ? ((allContracts.filter(c => c.status === 'COMPLETED').length / allContracts.length) * 100).toFixed(0) 
                                                        : 100)}%
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{t('dashboard.work_efficiency')}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Grids */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <SectionLabel>{t('dashboard.pending_applications')}</SectionLabel>
                                                <button onClick={() => setActiveTab('applications')} className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-300">{t('dashboard.view_all')}</button>
                                            </div>
                                            {proposalsLoading ? (
                                                <div className="text-center py-6 text-[10px] font-mono tracking-widest text-cyan-500 uppercase animate-pulse">{t('dashboard.fetching_data')}</div>
                                            ) : myProposals.length > 0 ? (
                                                <div className="space-y-3">
                                                    {myProposals.slice(0,3).map(p => (
                                                        <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 bg-slate-800/30 transition-all cursor-pointer" onClick={() => navigate(`/work/${p.job_id}`)}>
                                                            <div className="min-w-0 flex-1 pr-4">
                                                                <h4 className="text-[12px] font-bold text-white uppercase tracking-wider truncate mb-1">{p.job_title}</h4>
                                                                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{t('dashboard.proposed_price')}{p.proposed_price?.toLocaleString()}</div>
                                                            </div>
                                                            <div className="shrink-0 text-right">
                                                                <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black font-mono tracking-widest uppercase ${
                                                                    p.status === 'PENDING' ? 'bg-amber-900/30 text-amber-400 border border-amber-500/30' : 
                                                                    p.status === 'ACCEPTED' ? 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/30' : 
                                                                    'bg-red-900/30 text-red-400 border border-red-500/30'
                                                                }`}>{p.status}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-500 italic font-mono uppercase tracking-widest">{t('dashboard.no_pending_applications')}</p>
                                            )}
                                        </div>

                                        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <SectionLabel>{t('dashboard.recommended_jobs')}</SectionLabel>
                                                <button onClick={() => navigate('/find-work')} className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-300">{t('dashboard.view_all')}</button>
                                            </div>
                                            {loading ? (
                                                <div className="text-center py-6 text-[10px] font-mono tracking-widest text-cyan-500 uppercase animate-pulse">{t('dashboard.loading_recommendations')}</div>
                                            ) : recommendedJobs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {recommendedJobs.slice(0,3).map(j => (
                                                        <AILaserRecommendJob key={j.id} job={j} navigate={navigate} />
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-500 italic font-mono uppercase tracking-widest">{t('dashboard.no_recommendations')}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'jobs' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                        <SectionLabel>LỊCH SỬ {'&'} HỢP ĐỒNG</SectionLabel>
                                        
                                        {/* Pass them to JobTable component */}
                                        <div className="mt-4 cyberpunk-datatable-wrapper">
                                            {contractLoading ? (
                                                <div className="py-10 text-center text-cyan-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Đang tải hợp đồng...</div>
                                            ) : (
                                                <JobTable contracts={allContracts} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'applications' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                        <SectionLabel>TẤT CẢ ĐƠN ỨNG TUYỂN</SectionLabel>
                                        {proposalsLoading ? (
                                            <div className="text-center py-10 text-[10px] font-mono tracking-widest text-cyan-500 uppercase animate-pulse">Đang tải...</div>
                                        ) : myProposals.length > 0 ? (
                                            <div className="space-y-3 mt-4">
                                                {myProposals.map(p => (
                                                    <div key={p.id} className="flex justify-between items-center p-4 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 bg-slate-800/30 transition-all cursor-pointer" onClick={() => navigate(`/work/${p.job_id}`)}>
                                                        <div className="min-w-0 flex-1 pr-4">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h4 className="text-[13px] font-bold text-white uppercase tracking-wider truncate">{p.job_title}</h4>
                                                                <span className="text-[10px] font-mono text-slate-500">#{p.id}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                                                                <span>{t('dashboard.proposed_price')}: <span className="text-cyan-400">${p.proposed_price?.toLocaleString()}</span></span>
                                                                <span>•</span>
                                                                <span>{new Date(p.created_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                        <div className="shrink-0 text-right">
                                                            <span className={`inline-block px-3 py-1 rounded text-[9px] font-black font-mono tracking-widest uppercase border ${
                                                                p.status === 'PENDING' ? 'bg-amber-900/30 text-amber-400 border-amber-500/30' : 
                                                                p.status === 'ACCEPTED' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 
                                                                'bg-red-900/30 text-red-400 border-red-500/30'
                                                            }`}>{p.status}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center py-10 text-[11px] text-slate-500 italic font-mono uppercase tracking-widest">Bạn chưa có đơn ứng tuyển nào.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                        <SectionLabel>{t('dashboard.your_reviews')}</SectionLabel>
                                        {reviewsLoading ? (
                                            <div className="py-10 text-center text-cyan-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">{t('dashboard.loading_reviews')}</div>
                                        ) : (
                                            <ReviewsList data={reviewsData} type="worker" />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default WorkerDashboard;