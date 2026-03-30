import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchingApi } from '../../api/matching.api';
import { jobsApi } from '../../api/jobs.api';
import { useTranslation } from 'react-i18next';

function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

/* ── Score ring ── */
function MatchRing({ score }) {
    const { t } = useTranslation();
    const color = score >= 80 ? '#22d3ee' : score >= 50 ? '#f59e0b' : '#64748b';
    const label = score >= 80 ? 'text-cyan-300' : score >= 50 ? 'text-amber-300' : 'text-slate-400';
    return (
        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-black font-mono uppercase tracking-widest ${
            score >= 80 ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300' :
            score >= 50 ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' :
            'bg-slate-700/50 border-slate-600/40 text-slate-400'
        }`}>
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            {score}{t('find_work.match_percent')}
        </div>
    );
}

/* ── Skill tag ── */
function SkillTag({ children }) {
    return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black font-mono tracking-wide border bg-cyan-500/8 border-cyan-500/20 text-cyan-400">
            {children}
        </span>
    );
}

/* ── Section label ── */
const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono mb-2 flex items-center gap-1.5">
        <span className="text-cyan-500">//</span> {children}
    </p>
);

/* ── Filter input ── */
const FilterInput = ({ ...props }) => (
    <input
        {...props}
        className="w-full px-3 py-2 rounded-lg text-sm font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
        style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(6,182,212,0.15)', color: '#cbd5e1' }}
    />
);

const FindWork = () => {
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('SHORT_TERM');
    const [sort, setSort] = useState('match');
    const [categoryId, setCategoryId] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 20000]);
    const [minMatchScore, setMinMatchScore] = useState(0);
    const [page, setPage] = useState(1);
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

    useEffect(() => {
        jobsApi.getCate().then(res => setCategories(res.data || [])).catch(() => {});
    }, []);

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await matchingApi.getRecommendedJobs({
                    jobType: tab, categoryId: categoryId || undefined,
                    minBudget: budgetRange[0] || undefined, maxBudget: budgetRange[1] || undefined,
                    minMatchScore: minMatchScore || 0, limit: 100
                });
                setJobs(res.data || []);
            } catch { setJobs([]); } finally { setLoading(false); }
        };
        fetch();
    }, [tab, categoryId, budgetRange, minMatchScore]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return jobs;
        return jobs.filter(j => j.title.toLowerCase().includes(q) || j.description?.toLowerCase().includes(q) || j.category_name?.toLowerCase().includes(q));
    }, [jobs, query]);

    const sorted = useMemo(() => [...filtered].sort((a, b) => {
        if (sort === 'match')   return (b.match_score || 0) - (a.match_score || 0);
        if (sort === 'payHigh') return (b.budget || 0) - (a.budget || 0);
        if (sort === 'payLow')  return (a.budget || 0) - (b.budget || 0);
        return new Date(b.created_at) - new Date(a.created_at);
    }), [filtered, sort]);

    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = clamp(page, 1, totalPages);
    const pageItems = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    useEffect(() => { if (safePage !== page) setPage(safePage); }, [page, safePage]);

    return (
        <div className="w-full min-h-screen" >

            <div className="relative z-10 w-full max-w-screen-xl mx-auto px-4 sm:px-6 py-8">
                {/* Page header */}
                <div className="mb-6">
                    <p className="text-[9px] font-black tracking-widest text-cyan-500 font-mono uppercase mb-1">{t('find_work.find_freelance_work')}</p>
                    <h1 className="text-2xl font-black text-white uppercase tracking-wide">{t('find_work.find_new_work')}</h1>
                    <p className="text-slate-500 text-sm font-mono mt-1">
                        {loading ? t('find_work.scanning_jobs') : `${filtered.length} ${t('find_work.jobs_available')}`}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

                    {/* ── SIDEBAR ── */}
                    <aside className="lg:sticky lg:top-20 h-fit space-y-4">
                        {/* Category */}
                        <div className="rounded-xl border p-4" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.18)' }}>
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent pointer-events-none" />
                            <SectionLabel>{t('find_work.category_label')}</SectionLabel>
                            <div className="space-y-0.5">
                                {[{ id: '', name: t('find_work.all_categories') }, ...categories].map(cat => (
                                    <button key={cat.id} onClick={() => { setCategoryId(cat.id); setPage(1); }}
                                        className={`w-full text-left px-3 py-1.5 rounded-lg text-[12px] font-mono font-bold transition-all ${
                                            categoryId === cat.id
                                                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                                                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent'
                                        }`}>
                                        {cat.id === '' ? '⬡ ' : '·  '}{cat.name}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Budget */}
                        <div className="rounded-xl border p-4" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.18)' }}>
                            <SectionLabel>{t('find_work.budget_label')}</SectionLabel>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">{t('find_work.from_label')}</label>
                                    <FilterInput type="number" min={0} step={100} value={budgetRange[0]}
                                        onChange={e => { setBudgetRange([Number(e.target.value), budgetRange[1]]); setPage(1); }} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block mb-1">{t('find_work.to_label')}</label>
                                    <FilterInput type="number" min={0} step={100} value={budgetRange[1]}
                                        onChange={e => { setBudgetRange([budgetRange[0], Number(e.target.value)]); setPage(1); }} />
                                </div>
                            </div>
                        </div>

                        {/* Match Score */}
                        <div className="rounded-xl border p-4" style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.18)' }}>
                            <SectionLabel>{t('find_work.min_match_score')}</SectionLabel>
                            <input type="range" min={0} max={100} step={10} value={minMatchScore}
                                onChange={e => { setMinMatchScore(Number(e.target.value)); setPage(1); }}
                                className="w-full accent-cyan-500" />
                            <div className="flex justify-between text-[10px] font-mono mt-1">
                                <span className="text-slate-600">0%</span>
                                <span className="text-cyan-400 font-black">{minMatchScore}%</span>
                            </div>
                        </div>
                    </aside>

                    {/* ── MAIN ── */}
                    <section className="min-w-0 space-y-4">
                        {/* Search + Sort */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }}
                                    placeholder={t('find_work.search_placeholder_jobs')}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl font-mono text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all"
                                    style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(6,182,212,0.2)', color: '#e2e8f0' }} />
                            </div>
                            <select value={sort} onChange={e => setSort(e.target.value)}
                                className="px-4 py-3 rounded-xl font-mono font-black text-[11px] tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-cyan-500/50 transition-all shrink-0"
                                style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(6,182,212,0.2)', color: '#94a3b8' }}>
                                <option value="match">{t('find_work.best_match')}</option>
                                <option value="newest">{t('find_work.newest')}</option>
                                <option value="payHigh">{t('find_work.price_high_low')}</option>
                                <option value="payLow">{t('find_work.price_low_high')}</option>
                            </select>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'rgba(15,23,42,0.8)', borderColor: 'rgba(51,65,85,0.5)' }}>
                            {[
                                { key: 'SHORT_TERM', label: t('find_work.short_term') },
                                { key: 'LONG_TERM',  label: t('find_work.long_term')  },
                            ].map(t => (
                                <button key={t.key} onClick={() => { setTab(t.key); setPage(1); }}
                                    className={`flex-1 py-2 px-4 rounded-lg font-mono font-black text-[10px] tracking-widest uppercase transition-all ${
                                        tab === t.key
                                            ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                            : 'text-slate-500 hover:text-slate-300 border border-transparent'
                                    }`}>
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* Results */}
                        <div className="space-y-3">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                                    <span className="text-slate-500 font-mono text-sm tracking-widest">{t('find_work.searching_jobs')}</span>
                                </div>
                            ) : pageItems.length === 0 ? (
                                <div className="rounded-xl border p-14 text-center" style={{ background: 'rgba(13,18,36,0.8)', borderColor: 'rgba(6,182,212,0.15)' }}>
                                    <div className="text-4xl mb-4">📡</div>
                                    <p className="text-[14px] font-black text-white uppercase tracking-widest font-mono mb-2">{t('find_work.no_results_found')}</p>
                                    <p className="text-slate-500 text-[12px] font-mono">{t('find_work.try_different_filter')}</p>
                                </div>
                            ) : pageItems.map(job => (
                                <Link key={job.id} to={`/work/${job.id}`}
                                    className="block group relative overflow-hidden rounded-xl border transition-all duration-300 hover:-translate-y-0.5"
                                    style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)', borderColor: 'rgba(6,182,212,0.18)' }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.45)'}
                                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(6,182,212,0.18)'}>

                                    {/* Hover glow */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        style={{ background: 'radial-gradient(ellipse at top left, rgba(6,182,212,0.04), transparent 60%)' }} />
                                    {/* Top neon line */}
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                    <div className="relative p-5 flex gap-4">
                                        {/* Icon */}
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3 mb-2">
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                                        <span className="text-[15px] font-black text-white group-hover:text-cyan-300 transition-colors uppercase tracking-wide">
                                                            {job.title}
                                                        </span>
                                                        {job.match_score > 0 && <MatchRing score={job.match_score} />}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
                                                        <span className="text-cyan-500/70">{job.category_name || t('find_work.uncategorized')}</span>
                                                        <span>·</span>
                                                        <span>{new Date(job.created_at).toLocaleDateString()}</span>
                                                        {job.matching_skills_count > 0 && (
                                                            <>
                                                                <span>·</span>
                                                                <span className="text-cyan-400">{job.matching_skills_count}/{job.total_required_skills} {t('find_work.matching_skills')}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right flex-shrink-0">
                                                    <div className="text-[16px] font-black text-white font-mono">
                                                        ${Number(job.budget || 0).toLocaleString()}
                                                    </div>
                                                    <div className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono">
                                                        {job.job_type === 'SHORT_TERM' ? t('find_work.fixed_price') : t('find_work.project_type')}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Skills */}
                                            {job.skills?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mb-2">
                                                    {job.skills.map(s => <SkillTag key={s.id}>{s.name}</SkillTag>)}
                                                </div>
                                            )}

                                            {/* Description */}
                                            <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 font-mono">
                                                {job.description || t('find_work.no_description')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-1.5 pt-4">
                                <button onClick={() => setPage(p => clamp(p - 1, 1, totalPages))} disabled={safePage === 1}
                                    className="w-9 h-9 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30 hover:border-cyan-500/40 hover:text-cyan-400 transition-all font-mono">‹</button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let pn = totalPages <= 7 ? i + 1 : safePage <= 4 ? i + 1 : safePage >= totalPages - 3 ? totalPages - 6 + i : safePage - 3 + i;
                                    return (
                                        <button key={pn} onClick={() => setPage(pn)}
                                            className={`w-9 h-9 rounded-lg text-[11px] font-black font-mono transition-all ${
                                                pn === safePage
                                                    ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-500/40'
                                                    : 'border border-slate-700/50 text-slate-500 hover:text-slate-200 hover:border-slate-500'
                                            }`}>{pn}</button>
                                    );
                                })}
                                <button onClick={() => setPage(p => clamp(p + 1, 1, totalPages))} disabled={safePage === totalPages}
                                    className="w-9 h-9 rounded-lg border border-slate-700/50 text-slate-400 disabled:opacity-30 hover:border-cyan-500/40 hover:text-cyan-400 transition-all font-mono">›</button>
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default FindWork;
