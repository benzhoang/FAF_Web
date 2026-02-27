import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../contexts/ToastContext';
import { matchingApi } from '../../api/matching.api';
import { proposalsApi } from '../../api/proposals.api';
import { contractsApi } from '../../api/contracts.api';
import { reviewsApi } from '../../api/reviews.api';
import warehouseImg from '../../assets/istockphoto-1947499362-612x612.jpg';
import StatCard from './components/StatCard';
import JobTable from './components/JobTable';
import ReviewsList from './components/ReviewsList';

const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-cyan-500 uppercase font-mono mb-3 flex items-center gap-1.5 border-b border-cyan-500/20 pb-2">
        <span className="text-cyan-400">//</span> {children}
    </p>
);

const WorkerDashboard = () => {
    const navigate = useNavigate();
    const toast = useToast();
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

    const todayGreeting = useMemo(() => {
        const hour = new Date().getHours();
        if (hour < 12) return 'GOOD MORNING';
        if (hour < 18) return 'GOOD AFTERNOON';
        return 'GOOD EVENING';
    }, []);

    const userObj = useMemo(() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } 
        catch { return {}; }
    }, []);
    const userName = userObj.fullName || userObj.email || 'OPERATIVE';

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                const res = await matchingApi.getRecommendedJobs({ limit: 5 });
                const mappedJobs = (res?.data ?? []).map(job => ({
                    id: job.id,
                    title: job.title,
                    company: job.category_name || 'General',
                    price: `$${Number(job.budget).toLocaleString()}`,
                    meta: [
                        { icon: 'calendar', text: new Date(job.created_at).toLocaleDateString() },
                        { icon: 'spark', text: `${job.job_type === 'SHORT_TERM' ? 'SHORT TERM' : 'LONG TERM'}` }
                    ],
                    badge: `${job.match_score}% MATCH`,
                    extra: `${job.matching_skills_count} matching skills`,
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
        <div className="w-full min-h-screen bg-[#020617] text-slate-300 relative">
            {/* Ambient Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.008) 0px,rgba(0,255,255,0.008) 1px,transparent 1px,transparent 3px)' }} />
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8 relative z-10">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                    {/* ── LEFT SIDEBAR ── */}
                    <aside className="lg:col-span-3">
                        <div className="rounded-2xl border p-5 relative overflow-hidden group" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                            <div className="mb-6 min-w-0">
                                <div className="flex flex-col gap-1 mb-2">
                                    <p className="truncate text-[10px] font-mono tracking-widest text-cyan-500 uppercase">IDENTIFICATION RECORD</p>
                                    <h2 className="truncate text-lg font-black text-white uppercase tracking-wider">{userName}</h2>
                                </div>
                                {userObj.tier && (
                                    <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded font-mono uppercase tracking-widest ${
                                        userObj.tier === 'EXPERT' ? 'bg-purple-900/30 text-purple-400 border border-purple-500/30' : 
                                        userObj.tier === 'PRO' ? 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/30' : 
                                        'bg-slate-800 text-slate-400 border border-slate-700'
                                    }`}>
                                        {userObj.tier} RANK
                                    </span>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border p-4" style={{ background: 'rgba(15,23,42,0.6)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <p className="text-[10px] font-black text-slate-300 font-mono tracking-widest uppercase">ACTIVE CONTRACTS</p>
                                        <span className="rounded bg-cyan-900/30 border border-cyan-500/30 px-1.5 py-0.5 text-[9px] font-black text-cyan-400 font-mono">
                                            {activeContract ? '1 ACTIVE' : '0 ACTIVE'}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 italic font-mono uppercase tracking-widest">
                                        {activeContract ? 'Monitoring active engagement...' : 'No current engagements'}
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
                                <p className="text-cyan-500 font-mono text-[10px] tracking-widest uppercase">SYSTEM STATUS: ONLINE</p>
                                <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-wide">
                                    {todayGreeting}, <span className="text-cyan-400">{userName}</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-mono">Ready to initiate new work cycles?</p>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-slate-700/50">
                            <nav className="-mb-px flex space-x-1 overflow-x-auto no-scrollbar scroll-smooth">
                                {[
                                    { id: 'overview', label: 'OVERVIEW HUD' },
                                    { id: 'jobs', label: 'MISSIONS & LOGS' },
                                    { id: 'reviews', label: 'REPUTATION DATA' }
                                ].map((t) => (
                                    <button key={t.id} onClick={() => setActiveTab(t.id)}
                                        className={`whitespace-nowrap px-6 py-3 border-b-2 font-black text-[11px] tracking-widest uppercase font-mono transition-all ${
                                            activeTab === t.id
                                            ? 'border-cyan-400 text-cyan-400 bg-cyan-500/5'
                                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                                        }`}>
                                        {t.label}
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
                                                <SectionLabel>CURRENT ENGAGEMENT</SectionLabel>
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
                                                    <div>
                                                        <h3 className="text-xl font-black text-white uppercase tracking-wider">{activeContract.job_title}</h3>
                                                        <p className="text-[12px] font-mono text-cyan-400 mt-1 uppercase tracking-widest">{activeContract.client_name || 'UNKNOWN CLIENT'}</p>
                                                    </div>
                                                    <div className="flex flex-col md:items-end gap-2">
                                                        <span className="inline-block px-3 py-1 rounded text-[10px] font-black font-mono tracking-widest uppercase bg-cyan-900/40 text-cyan-400 border border-cyan-500/50 ring-1 ring-cyan-400/20 blur-[0.3px]">ACTIVE STATUS</span>
                                                        <p className="text-lg font-black text-emerald-400 font-mono">${Number(activeContract.total_amount || 0).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-6">
                                                    <button onClick={() => navigate(`/contract/${activeContract.id}/view`)} className="w-full sm:w-auto px-6 py-2.5 text-[10px] font-black font-mono tracking-widest uppercase bg-cyan-500 hover:bg-cyan-400 text-[#020617] transition-colors rounded shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                                                        ACCESS WORKSPACE
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Stats Grid */}
                                    {!contractLoading && (
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#082f49,#0f172a)', borderColor: 'rgba(56,189,248,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-sky-400 uppercase mb-2">Total Earned</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">${allContracts.filter(c => c.status === 'COMPLETED').reduce((s, c) => s + Number(c.total_amount || 0), 0).toLocaleString()}</div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Lifetime Yield</div>
                                            </div>
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#4c1d95,#0f172a)', borderColor: 'rgba(167,139,250,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-purple-400 uppercase mb-2">Completed Missions</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">{allContracts.filter(c => c.status === 'COMPLETED').length}</div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Successful Logs</div>
                                            </div>
                                            <div className="rounded-xl border p-5" style={{ background: 'linear-gradient(145deg,#047857,#0f172a)', borderColor: 'rgba(52,211,153,0.2)' }}>
                                                <div className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase mb-2">Success Rate</div>
                                                <div className="text-3xl font-black text-white mb-1 font-mono">
                                                    {(allContracts.length > 0 
                                                        ? ((allContracts.filter(c => c.status === 'COMPLETED').length / allContracts.length) * 100).toFixed(0) 
                                                        : 100)}%
                                                </div>
                                                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Operational Efficiency</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Sub-Grids */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <SectionLabel>ACTIVE PROPOSALS</SectionLabel>
                                                <button onClick={() => setActiveTab('jobs')} className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-300">View Logs ›</button>
                                            </div>
                                            {proposalsLoading ? (
                                                <div className="text-center py-6 text-[10px] font-mono tracking-widest text-cyan-500 uppercase animate-pulse">Scanning proposals...</div>
                                            ) : myProposals.length > 0 ? (
                                                <div className="space-y-3">
                                                    {myProposals.slice(0,3).map(p => (
                                                        <div key={p.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 bg-slate-800/30 transition-all cursor-pointer" onClick={() => navigate(`/work/${p.job_id}`)}>
                                                            <div className="min-w-0 flex-1 pr-4">
                                                                <h4 className="text-[12px] font-bold text-white uppercase tracking-wider truncate mb-1">{p.job_title}</h4>
                                                                <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Req: ${p.proposed_price?.toLocaleString()}</div>
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
                                                <p className="text-[11px] text-slate-500 italic font-mono uppercase tracking-widest">No active proposals in queue.</p>
                                            )}
                                        </div>

                                        <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                            <div className="flex items-center justify-between mb-4">
                                                <SectionLabel>SUGGESTED TARGETS</SectionLabel>
                                                <button onClick={() => navigate('/find-work')} className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest font-mono hover:text-cyan-300">Browse Matrix ›</button>
                                            </div>
                                            {loading ? (
                                                <div className="text-center py-6 text-[10px] font-mono tracking-widest text-cyan-500 uppercase animate-pulse">Syncing nodes...</div>
                                            ) : recommendedJobs.length > 0 ? (
                                                <div className="space-y-3">
                                                    {recommendedJobs.slice(0,3).map(j => (
                                                        <div key={j.id} className="p-3 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 bg-slate-800/30 transition-all cursor-pointer" onClick={() => navigate(`/work/${j.id}`)}>
                                                            <div className="flex justify-between items-start mb-1">
                                                                <h4 className="text-[12px] font-bold text-white uppercase tracking-wider truncate pr-2">{j.title}</h4>
                                                                <span className="text-[10px] font-black tracking-widest text-cyan-400 font-mono shrink-0">{j.badge}</span>
                                                            </div>
                                                            <div className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">{j.company} · {j.price}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-[11px] text-slate-500 italic font-mono uppercase tracking-widest">Awaiting algorithm optimization...</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'jobs' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                        <SectionLabel>TRANSACTION LOGS & CONTRACTS</SectionLabel>
                                        
                                        {/* Pass them to JobTable component */}
                                        <div className="mt-4 cyberpunk-datatable-wrapper">
                                            {contractLoading ? (
                                                <div className="py-10 text-center text-cyan-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Decrypting Contracts...</div>
                                            ) : (
                                                <JobTable contracts={allContracts} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'reviews' && (
                                <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
                                    <div className="rounded-2xl border p-6" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.2)' }}>
                                        <SectionLabel>REPUTATION MATRIX</SectionLabel>
                                        {reviewsLoading ? (
                                            <div className="py-10 text-center text-cyan-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">Loading Reputation...</div>
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