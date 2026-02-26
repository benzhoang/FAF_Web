import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { matchingApi } from '../../api/matching.api';
import { jobsApi } from '../../api/jobs.api';

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

function Badge({ children, tone = 'gray' }) {
    const tones = {
        gray: 'bg-gray-100 text-gray-700 border-gray-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        amber: 'bg-amber-50 text-amber-700 border-amber-100',
        violet: 'bg-violet-50 text-violet-700 border-violet-100',
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold rounded-full border ${
                tones[tone] || tones.gray
            }`}
        >
            {children}
        </span>
    );
}

function MatchScoreBadge({ score }) {
    let tone = 'gray';
    if (score >= 80) tone = 'emerald';
    else if (score >= 50) tone = 'amber';
    
    return (
        <Badge tone={tone}>
            {score}% MATCH
        </Badge>
    );
}

function JobIcon({ tone = 'blue' }) {
    const tones = {
        blue: 'bg-blue-100 text-blue-700',
        emerald: 'bg-emerald-100 text-emerald-700',
        amber: 'bg-amber-100 text-amber-700',
        violet: 'bg-violet-100 text-violet-700',
        indigo: 'bg-indigo-100 text-indigo-700',
        gray: 'bg-gray-100 text-gray-700',
    };
    return (
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tones[tone] || tones.gray}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        </div>
    );
}

const FindWork = () => {
    const [query, setQuery] = useState('');
    const [tab, setTab] = useState('SHORT_TERM');
    const [sort, setSort] = useState('match'); // match | newest | payHigh | payLow
    const [categoryId, setCategoryId] = useState('');
    const [budgetRange, setBudgetRange] = useState([0, 20000]);
    const [minMatchScore, setMinMatchScore] = useState(0);
    const [page, setPage] = useState(1);
    
    const [jobs, setJobs] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch categories
    useEffect(() => {
        jobsApi.getCate()
            .then(res => setCategories(res.data || []))
            .catch(err => console.error('Failed to load categories:', err));
    }, []);

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const filters = {
                    jobType: tab,
                    categoryId: categoryId || undefined,
                    minBudget: budgetRange[0] || undefined,
                    maxBudget: budgetRange[1] || undefined,
                    minMatchScore: minMatchScore || 0,
                    limit: 100
                };
                
                const res = await matchingApi.getRecommendedJobs(filters);
                console.log(res.data);
                setJobs(res.data || []);
            } catch (err) {
                console.error('Failed to fetch jobs:', err);
                setJobs([]);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [tab, categoryId, budgetRange, minMatchScore]);

    // Filter by search query (client-side)
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return jobs;
        
        return jobs.filter(job => 
            job.title.toLowerCase().includes(q) ||
            job.description?.toLowerCase().includes(q) ||
            job.category_name?.toLowerCase().includes(q)
        );
    }, [jobs, query]);

    // Sort jobs
    const sorted = useMemo(() => {
        return [...filtered].sort((a, b) => {
            if (sort === 'match') {
                return (b.match_score || 0) - (a.match_score || 0);
            }
            if (sort === 'payHigh') {
                return (b.budget || 0) - (a.budget || 0);
            }
            if (sort === 'payLow') {
                return (a.budget || 0) - (b.budget || 0);
            }
            // newest
            return new Date(b.created_at) - new Date(a.created_at);
        });
    }, [filtered, sort]);

    // Pagination
    const pageSize = 10;
    const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
    const safePage = clamp(page, 1, totalPages);
    const pageItems = sorted.slice((safePage - 1) * pageSize, safePage * pageSize);

    useEffect(() => {
        if (safePage !== page) setPage(safePage);
    }, [page, safePage]);

    return (
        <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
                <div className="bg-white/95 rounded-3xl shadow-xl border border-gray-100 p-6 lg:p-8">
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                        {/* Sidebar */}
                        <aside className="lg:sticky lg:top-24 h-fit">
                            <div className="text-sm font-extrabold text-gray-900 mb-4">Find your next role</div>
                            <div className="text-xs text-gray-500 mb-6">
                                {loading ? 'Loading...' : `${filtered.length} opportunities`}
                            </div>

                            <div className="space-y-6">
                                {/* Category Filter */}
                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-2">
                                        Category
                                    </div>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => {
                                                setCategoryId('');
                                                setPage(1);
                                            }}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                                categoryId === ''
                                                    ? 'bg-blue-50 text-blue-700'
                                                    : 'hover:bg-gray-50 text-gray-700'
                                            }`}
                                        >
                                            All Categories
                                        </button>
                                        {categories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => {
                                                    setCategoryId(cat.id);
                                                    setPage(1);
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                                                    categoryId === cat.id
                                                        ? 'bg-blue-50 text-blue-700'
                                                        : 'hover:bg-gray-50 text-gray-700'
                                                }`}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Budget Range */}
                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                                        Budget Range ($)
                                    </div>
                                    <div className="px-1 space-y-3">
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Min</label>
                                            <input
                                                type="number"
                                                min={0}
                                                step={100}
                                                value={budgetRange[0]}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setBudgetRange([val, budgetRange[1]]);
                                                    setPage(1);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-600 mb-1 block">Max</label>
                                            <input
                                                type="number"
                                                min={0}
                                                step={100}
                                                value={budgetRange[1]}
                                                onChange={(e) => {
                                                    const val = Number(e.target.value);
                                                    setBudgetRange([budgetRange[0], val]);
                                                    setPage(1);
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Match Score Filter */}
                                <div>
                                    <div className="text-[11px] font-extrabold text-gray-500 uppercase tracking-wider mb-3">
                                        Minimum Match Score
                                    </div>
                                    <div className="px-1">
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            step={10}
                                            value={minMatchScore}
                                            onChange={(e) => {
                                                setMinMatchScore(Number(e.target.value));
                                                setPage(1);
                                            }}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                                            <span>0%</span>
                                            <span className="font-bold text-gray-700">{minMatchScore}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Main */}
                        <section className="min-w-0">
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                    {/* Search */}
                                    <div className="relative flex-1">
                                        <svg
                                            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                            />
                                        </svg>
                                        <input
                                            value={query}
                                            onChange={(e) => {
                                                setQuery(e.target.value);
                                                setPage(1);
                                            }}
                                            className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                            placeholder="Search job titles, keywords, or companies..."
                                            type="text"
                                        />
                                    </div>

                                    {/* Sort */}
                                    <div className="flex items-center gap-2 justify-end">
                                        <span className="text-xs font-bold text-gray-500">Sort by:</span>
                                        <select
                                            value={sort}
                                            onChange={(e) => setSort(e.target.value)}
                                            className="text-sm font-bold text-gray-900 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
                                        >
                                            <option value="match">Best Match</option>
                                            <option value="newest">Newest First</option>
                                            <option value="payHigh">Budget: High to Low</option>
                                            <option value="payLow">Budget: Low to High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Tabs */}
                                <div className="flex items-center gap-6 border-b border-gray-100">
                                    <button
                                        onClick={() => {
                                            setTab('SHORT_TERM');
                                            setPage(1);
                                        }}
                                        className={`pb-3 text-sm font-extrabold transition-colors ${
                                            tab === 'SHORT_TERM'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Short-term Projects
                                    </button>
                                    <button
                                        onClick={() => {
                                            setTab('LONG_TERM');
                                            setPage(1);
                                        }}
                                        className={`pb-3 text-sm font-extrabold transition-colors ${
                                            tab === 'LONG_TERM'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-800'
                                        }`}
                                    >
                                        Long-term
                                    </button>
                                </div>

                                {/* Results */}
                                <div className="space-y-4 pt-2">
                                    {loading ? (
                                        <div className="text-center py-10 text-gray-500">Loading jobs...</div>
                                    ) : pageItems.length === 0 ? (
                                        <div className="rounded-2xl border border-gray-100 p-10 text-center">
                                            <div className="text-lg font-extrabold text-gray-900">
                                                No matching jobs found
                                            </div>
                                            <div className="text-sm text-gray-500 mt-2">
                                                Try adjusting your filters or search criteria
                                            </div>
                                        </div>
                                    ) : (
                                        pageItems.map((job) => (
                                            <Link
                                                key={job.id}
                                                to={`/work/${job.id}`}
                                                className="block rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all"
                                            >
                                                <div className="p-5 sm:p-6 flex gap-4">
                                                    <JobIcon tone="blue" />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-center gap-2 flex-wrap mb-2">
                                                                    <div className="text-base sm:text-lg font-extrabold text-gray-900">
                                                                        {job.title}
                                                                    </div>
                                                                    {job.match_score !== undefined && job.match_score > 0 && (
                                                                        <MatchScoreBadge score={job.match_score} />
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    <span className="font-bold text-gray-700">
                                                                        {job.category_name || 'Uncategorized'}
                                                                    </span>{' '}
                                                                    •{' '}
                                                                    {new Date(job.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <div className="text-lg font-extrabold text-gray-900">
                                                                    ${Number(job.budget || 0).toLocaleString()}
                                                                </div>
                                                                <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                                                                    {job.job_type === 'SHORT_TERM' ? 'Fixed Price' : 'Project'}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Skills */}
                                                        {job.skills && job.skills.length > 0 && (
                                                            <div className="flex items-center gap-2 flex-wrap mb-3">
                                                                {job.skills.map((skill) => (
                                                                    <Badge key={skill.id} tone="gray">
                                                                        {skill.name}
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                                            {job.description || 'No description provided.'}
                                                        </p>

                                                        {/* Match Info */}
                                                        {job.matching_skills_count > 0 && (
                                                            <div className="mt-3 text-xs text-gray-500">
                                                                <span className="font-semibold text-blue-600">
                                                                    {job.matching_skills_count}/{job.total_required_skills}
                                                                </span>{' '}
                                                                required skills matched
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}
                                </div>

                                {/* Pagination */}
                                {sorted.length > 0 && totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-2 pt-6">
                                        <button
                                            onClick={() => setPage((p) => clamp(p - 1, 1, totalPages))}
                                            disabled={safePage === 1}
                                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                            aria-label="Previous page"
                                        >
                                            ‹
                                        </button>
                                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 7) {
                                                pageNum = i + 1;
                                            } else if (safePage <= 4) {
                                                pageNum = i + 1;
                                            } else if (safePage >= totalPages - 3) {
                                                pageNum = totalPages - 6 + i;
                                            } else {
                                                pageNum = safePage - 3 + i;
                                            }
                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => setPage(pageNum)}
                                                    className={`w-9 h-9 rounded-lg text-sm font-extrabold transition-colors ${
                                                        pageNum === safePage
                                                            ? 'bg-blue-600 text-white'
                                                            : 'border border-transparent text-gray-700 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                        <button
                                            onClick={() => setPage((p) => clamp(p + 1, 1, totalPages))}
                                            disabled={safePage === totalPages}
                                            className="w-9 h-9 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                                            aria-label="Next page"
                                        >
                                            ›
                                        </button>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindWork;
