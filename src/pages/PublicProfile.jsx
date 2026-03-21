import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../api/user.api';
import { postsApi } from '../api/posts.api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useChatContext } from '../contexts/ChatContext';
import { reviewsApi } from '../api/reviews.api';
import PostCard from '../components/Social/PostCard';
import { useTranslation } from 'react-i18next';


const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/* ── Cyber card shell ── */
const CyberCard = ({ children, className = '', accent = 'cyan' }) => {
    const colors = {
        cyan:   'border-cyan-500/20 shadow-[0_0_20px_rgba(6,182,212,0.04)]',
        purple: 'border-purple-500/20 shadow-[0_0_20px_rgba(139,92,246,0.04)]',
        amber:  'border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.04)]',
    };
    const topLine = {
        cyan:   'from-transparent via-cyan-400/50 to-transparent',
        purple: 'from-transparent via-purple-400/50 to-transparent',
        amber:  'from-transparent via-amber-400/50 to-transparent',
    };
    return (
        <div className={`relative rounded-xl border overflow-hidden ${colors[accent]} ${className}`}
            style={{ background: 'linear-gradient(145deg,#0d1224,#0f172a)' }}>
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${topLine[accent]}`} />
            {children}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-600/30 to-transparent" />
        </div>
    );
};

/* ── Section header ── */
const SectionLabel = ({ children }) => (
    <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase font-mono mb-3 flex items-center gap-2">
        <span className="text-cyan-500">//</span> {children}
    </p>
);

/* ── League of Legends–style Mastery Tier system (1–1000 scale) ── */
const MASTERY_TIERS = [
    { name: 'IRON',        min: 0,   max: 50,   color: '#8b7355', bg: 'rgba(139,115,85,0.15)',  border: 'rgba(139,115,85,0.35)',  icon: '🔩' },
    { name: 'BRONZE',      min: 51,  max: 150,  color: '#cd7f32', bg: 'rgba(205,127,50,0.15)',  border: 'rgba(205,127,50,0.35)',  icon: '🥉' },
    { name: 'SILVER',      min: 151, max: 300,  color: '#c0c0c0', bg: 'rgba(192,192,192,0.12)', border: 'rgba(192,192,192,0.3)',  icon: '🥈' },
    { name: 'GOLD',        min: 301, max: 499,  color: '#ffd700', bg: 'rgba(255,215,0,0.12)',   border: 'rgba(255,215,0,0.3)',    icon: '🥇' },
    { name: 'PLATINUM',    min: 500, max: 649,  color: '#00e5cc', bg: 'rgba(0,229,204,0.12)',   border: 'rgba(0,229,204,0.3)',    icon: '💎' },
    { name: 'DIAMOND',     min: 650, max: 799,  color: '#6cf',    bg: 'rgba(102,204,255,0.12)', border: 'rgba(102,204,255,0.3)',  icon: '💠' },
    { name: 'MASTER',      min: 800, max: 949,  color: '#b44be1', bg: 'rgba(180,75,225,0.15)',  border: 'rgba(180,75,225,0.35)',  icon: '⚔️' },
    { name: 'GRANDMASTER', min: 950, max: 999,  color: '#ff4444', bg: 'rgba(255,68,68,0.15)',   border: 'rgba(255,68,68,0.35)',   icon: '🏆' },
    { name: 'CHALLENGER',  min: 1000,max: 1000, color: '#00fff7', bg: 'rgba(0,255,247,0.15)',   border: 'rgba(0,255,247,0.4)',    icon: '👑' },
];

const getMasteryTier = (pts) => {
    const p = Math.min(1000, Math.max(0, pts || 0));
    return MASTERY_TIERS.find(t => p >= t.min && p <= t.max) || MASTERY_TIERS[0];
};

const getNextTier = (pts) => {
    const p = Math.min(1000, Math.max(0, pts || 0));
    const currentIdx = MASTERY_TIERS.findIndex(t => p >= t.min && p <= t.max);
    return currentIdx < MASTERY_TIERS.length - 1 ? MASTERY_TIERS[currentIdx + 1] : null;
};

const getTierProgress = (pts) => {
    const p = Math.min(1000, Math.max(0, pts || 0));
    const tier = getMasteryTier(p);
    const next = getNextTier(p);
    if (!next) return 100; // Challenger = full
    const range = tier.max - tier.min;
    const delta = p - tier.min;
    return Math.round((delta / range) * 100);
};

const PublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const { openChat } = useChatContext();
    const toast = useToast();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const [userPosts, setUserPosts] = useState([]);
    const [loadingPosts, setLoadingPosts] = useState(false);
    const [userReviews, setUserReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const fetchProfile = async () => {
            try { setLoading(true); const res = await userApi.getById(id); setProfile(res.data); }
            catch { setError(t('public_profile.error_load')); }
            finally { setLoading(false); }
        };
        const fetchFollow = async () => {
            if (currentUser && currentUser.id !== Number(id)) {
                try { const res = await userApi.checkFollowStatus(id); setIsFollowing(res.data?.is_following || false); }
                catch {}
            }
        };
        if (id) { fetchProfile(); fetchFollow(); }
    }, [id, currentUser]);

    useEffect(() => {
        if (activeTab === 'posts' && userPosts.length === 0) {
            (async () => {
                try { setLoadingPosts(true); const r = await postsApi.getPostsByUser(id); setUserPosts(r.data || []); }
                catch {} finally { setLoadingPosts(false); }
            })();
        }
        if (activeTab === 'reviews' && userReviews.length === 0) {
            (async () => {
                try { 
                    setLoadingReviews(true); 
                    const r = await reviewsApi.getUserReviews(id);
                    // axiosClient interceptor already unwraps to response.data
                    // Backend returns: { data: [...reviews], summary: {...} }
                    setUserReviews(r.data || []); 
                }
                catch (err) { console.error("Error fetching reviews:", err); } 
                finally { setLoadingReviews(false); }
            })();
        }
    }, [activeTab, id]);

    const handleMessageClick = async () => {
        if (!currentUser) { toast.error(t('public_profile.error_login_msg')); return; }
        try { await openChat(id); } catch { toast.error(t('public_profile.error_chat')); }
    };

    const handleFollowToggle = async () => {
        try {
            if (isFollowing) {
                await userApi.unfollowUser(id);
                setIsFollowing(false);
                setProfile(p => ({ ...p, followers_count: Math.max(0, Number(p.followers_count || 0) - 1) }));
            } else {
                await userApi.followUser(id);
                setIsFollowing(true);
                setProfile(p => ({ ...p, followers_count: Number(p.followers_count || 0) + 1 }));
            }
        } catch { toast.error(t('public_profile.error_action')); }
    };

    /* ── Loading / Error ── */
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center gap-3" >
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 font-mono text-sm">{t('public_profile.loading_profile')}</span>
        </div>
    );
    if (error || !profile) return (
        <div className="min-h-screen flex items-center justify-center text-red-400 font-mono" >
            {error || t('public_profile.not_found')}
        </div>
    );

    const isOwnProfile = currentUser?.id === Number(id);

    const statCards = [
        { label: t('public_profile.rating_score'), value: Number(profile.rating_avg || 0).toFixed(1), suffix: '/ 5', accent: 'cyan'   },
        { label: t('public_profile.jobs_done'),    value: profile.total_jobs_done || 0,               suffix: '',    accent: 'purple' },
        { label: t('public_profile.hourly_rate'),  value: `$${Number(profile.hourly_rate || 0).toLocaleString()}`, suffix: t('public_profile.per_hour'), accent: 'amber' },
    ];

    // skill_mastery comes from the new SQL JOIN (user_skills + skills)
    const skillMastery = profile.skill_mastery || [];
    // Merge with profile.skills (names without points)
    const allSkills = skillMastery.length > 0 ? skillMastery : (profile.skills || []).map(s => ({
        name: typeof s === 'object' ? s.name : s,
        skill_points: 0
    }));

    return (
        <div className="min-h-screen" style={{ marginTop: '-1px'  }}>

            <div className="relative z-10">

                {/* System bar */}
                <div className="border-b border-cyan-500/15" style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(8px)' }}>
                    <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors font-mono text-[11px] font-bold tracking-wider"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            {t('public_profile.go_back')}
                        </button>
                        <span className="text-slate-700 font-mono">|</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            {t('public_profile.profile_label')} <span className="text-cyan-400">{profile.full_name?.toUpperCase()}</span>
                        </span>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto px-4 py-6 space-y-4">

                    {/* ── HERO CARD ── */}
                    <CyberCard accent="cyan">
                        {/* Cover */}
                        <div className="h-40 relative overflow-hidden"
                            style={{ background: 'linear-gradient(135deg,#0e7490 0%,#6d28d9 50%,#1e40af 100%)' }}>
                            <div className="absolute inset-0" style={{
                                backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 40px),repeating-linear-gradient(0deg,rgba(255,255,255,0.02) 0px,rgba(255,255,255,0.02) 1px,transparent 1px,transparent 40px)'
                            }} />
                            {/* HUD corners */}
                            <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 border-cyan-400/60" />
                            <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 border-cyan-400/60" />
                            {profile.cover_url && <img src={profile.cover_url} alt="cover" className="w-full h-full object-cover mix-blend-overlay" />}
                        </div>

                        <div className="px-6 pb-6">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                {/* Avatar */}
                                <div className="flex items-end gap-4">
                                    <div className="w-24 h-24 rounded-2xl ring-4 overflow-hidden flex-shrink-0 -mt-12 relative z-10 shadow-2xl shadow-cyan-500/20"
                                        style={{ background: 'linear-gradient(135deg,#06b6d4,#9333ea)', ringColor: '#0d1224' }}>
                                        {profile.avatar_url
                                            ? <img src={profile.avatar_url} alt="av" className="w-full h-full object-cover" />
                                            : <span className="flex items-center justify-center w-full h-full text-3xl font-black text-white">{getInitials(profile.full_name)}</span>}
                                    </div>
                                    <div className="pb-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h1 className="text-2xl font-black text-white tracking-wide uppercase leading-tight">{profile.full_name}</h1>
                                            {profile.tier && (
                                                <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded border uppercase font-mono ${
                                                    profile.tier === 'EXPERT' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                                                    profile.tier === 'PRO'    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40' :
                                                    'bg-slate-700/50 text-slate-400 border-slate-600/40'
                                                }`}>{profile.tier}</span>
                                            )}
                                        </div>
                                        <p className="text-[11px] font-bold text-cyan-400 font-mono tracking-widest uppercase mt-0.5">
                                            {profile.role === 'worker' ? t('public_profile.role_worker') : profile.role === 'employer' ? t('public_profile.role_employer') : profile.role === 'manager' ? 'SYSTEM ADMIN ' : t('public_profile.role_user')}{t('public_profile.system_faf')}
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">{profile.title || profile.bio?.substring(0, 60) || t('public_profile.default_title')}</p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pb-1">
                                    <button onClick={handleMessageClick}
                                        className="px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5">
                                        {t('public_profile.btn_message')}
                                    </button>
                                    {currentUser && !isOwnProfile && (
                                        <button onClick={handleFollowToggle}
                                            className={`px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono transition-all border ${
                                                isFollowing
                                                    ? 'border-slate-600/50 text-slate-400 hover:border-red-500/50 hover:text-red-400 bg-slate-800/40'
                                                    : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400'
                                            }`}>
                                            {isFollowing ? t('public_profile.btn_following') : t('public_profile.btn_follow')}
                                        </button>
                                    )}
                                    <button onClick={() => window.print()}
                                        className="px-4 py-2 rounded-xl border border-slate-600/50 text-slate-400 hover:bg-slate-800/40 hover:text-white font-black text-[11px] tracking-widest uppercase font-mono transition-all flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                                        In CV
                                    </button>
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/40">
                                <div className="flex items-center gap-1.5 text-[12px] font-mono">
                                    <span className="font-black text-white">{profile.followers_count || 0}</span>
                                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">{t('public_profile.followers')}</span>
                                </div>
                                <div className="w-px h-4 bg-slate-700/60" />
                                <div className="flex items-center gap-1.5 text-[12px] font-mono">
                                    <span className="font-black text-white">{profile.following_count || 0}</span>
                                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">{t('public_profile.following')}</span>
                                </div>
                                {profile.location && (
                                    <>
                                        <div className="w-px h-4 bg-slate-700/60" />
                                        <span className="text-slate-500 text-[11px] font-mono">📍 {profile.location}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </CyberCard>

                    {/* ── TABS ── */}
                    <div className="flex gap-1 p-1 rounded-xl border border-slate-700/40"
                        style={{ background: 'rgba(15,23,42,0.8)' }}>
                        {[
                            { key: 'overview', label: t('public_profile.tab_overview', 'Tổng quan') },
                            { key: 'posts',    label: t('public_profile.tab_posts', 'Bài viết') },
                            { key: 'reviews',  label: 'Đánh giá' },
                        ].map(tab => (
                            <button key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex-1 py-2 px-4 rounded-lg font-mono font-black text-[10px] tracking-widest uppercase transition-all ${
                                    activeTab === tab.key
                                        ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                        : 'text-slate-500 hover:text-slate-300 border border-transparent hover:border-slate-600/40'
                                }`}>
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* ── OVERVIEW TAB ── */}
                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-3">
                                {statCards.map(s => (
                                    <CyberCard key={s.label} accent={s.accent} className="p-5 text-center">
                                        <SectionLabel>{s.label}</SectionLabel>
                                        <div className={`text-3xl font-black font-mono ${
                                            s.accent === 'cyan'   ? 'text-cyan-300' :
                                            s.accent === 'purple' ? 'text-purple-300' : 'text-amber-300'
                                        }`}>{s.value}</div>
                                        {s.suffix && <div className="text-[10px] font-mono text-slate-500 mt-1">{s.suffix}</div>}
                                    </CyberCard>
                                ))}
                            </div>

                            {/* About */}
                            <CyberCard className="p-6">
                                <SectionLabel>{t('public_profile.section_about')}</SectionLabel>
                                <p className="text-slate-300 text-[14px] leading-relaxed whitespace-pre-wrap font-mono">
                                    {profile.bio || `${t('public_profile.default_bio_prefix')}${profile.hourly_rate || 50}${t('public_profile.per_hour')}`}
                                </p>
                            </CyberCard>

                            {/* Skills / Mastery */}
                            {allSkills.length > 0 && (
                                <CyberCard accent="purple" className="p-6">
                                    <SectionLabel>{t('public_profile.section_skills')} // MASTERY RANK</SectionLabel>
                                    <div className="space-y-5">
                                        {allSkills.map((skill, idx) => {
                                            const name   = skill.name || (typeof skill === 'string' ? skill : '?');
                                            const pts    = skill.skill_points || 0;
                                            const tier   = getMasteryTier(pts);
                                            const next   = getNextTier(pts);
                                            const pct    = getTierProgress(pts);
                                            return (
                                                <div key={idx} className="group">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">{tier.icon}</span>
                                                            <span className="text-[13px] font-black text-slate-200 font-mono uppercase tracking-wide">{name}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span
                                                                className="text-[10px] font-black px-2.5 py-0.5 rounded-full font-mono tracking-widest uppercase"
                                                                style={{ color: tier.color, background: tier.bg, border: `1px solid ${tier.border}` }}
                                                            >
                                                                {tier.name}
                                                            </span>
                                                            <span className="text-[11px] font-mono text-slate-400">{pts.toLocaleString()}<span className="text-slate-600">/1000</span></span>
                                                        </div>
                                                    </div>
                                                    {/* Progress bar to next tier */}
                                                    <div className="relative h-2 rounded-full bg-slate-800/80 overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700"
                                                            style={{
                                                                width: `${pct}%`,
                                                                background: `linear-gradient(90deg, ${tier.color}80, ${tier.color})`
                                                            }}
                                                        />
                                                    </div>
                                                    {next && (
                                                        <div className="flex justify-between mt-1">
                                                            <span className="text-[9px] font-mono text-slate-600">{tier.name}</span>
                                                            <span className="text-[9px] font-mono" style={{ color: next.color }}>→ {next.name} ({next.min} pts)</span>
                                                        </div>
                                                    )}
                                                    {!next && <div className="text-[9px] font-mono text-center mt-1" style={{ color: tier.color }}>★ MAX RANK ★</div>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CyberCard>
                            )}

                            {/* Education Timeline */}
                            {profile.education?.length > 0 && (
                                <CyberCard accent="cyan" className="p-6">
                                    <SectionLabel>
                                        <div className="flex items-center gap-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.083 12.083 0 0121 17.5c0 .334-.01.667-.03 1" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-6.16-3.422A12.083 12.083 0 003 17.5c0 .334.01.667.03 1" /></svg>
                                            HỌC VẤN (EDUCATION)
                                        </div>
                                    </SectionLabel>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-500 before:via-cyan-500/50 before:to-transparent">
                                        {profile.education.map((edu, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-cyan-500 bg-slate-900 shadow-[0_0_10px_rgba(6,182,212,0.8)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-cyan-400 font-bold text-[8px] font-mono">
                                                    ●
                                                </div>
                                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-slate-700/50 bg-[#090e17]/80 hover:bg-slate-800/80 hover:border-cyan-500/50 transition-colors shadow-sm ml-4 md:ml-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-white text-sm font-sans">{edu.school}</h4>
                                                    </div>
                                                    <h5 className="text-[11px] font-mono text-cyan-400/90 mb-2 uppercase tracking-wide">{edu.degree}</h5>
                                                    <div className="text-[10px] text-slate-500 font-mono tracking-widest bg-slate-900/50 inline-block px-1.5 py-0.5 rounded border border-slate-800">
                                                        {edu.start_year && edu.end_year ? `${edu.start_year} - ${edu.end_year}` : edu.start_year || edu.end_year}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CyberCard>
                            )}

                            {/* Experience Timeline */}
                            {profile.experience?.length > 0 && (
                                <CyberCard accent="emerald" className="p-6">
                                    <SectionLabel>
                                        <div className="flex items-center gap-2 text-emerald-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                            KINH NGHIỆM (EXPERIENCE)
                                        </div>
                                    </SectionLabel>
                                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/50 before:to-transparent">
                                        {profile.experience.map((exp, idx) => (
                                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-500 bg-slate-900 shadow-[0_0_10px_rgba(16,185,129,0.8)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 text-emerald-400 font-bold text-[8px] font-mono">
                                                    ●
                                                </div>
                                                <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-4 rounded border border-slate-700/50 bg-[#090e17]/80 hover:bg-slate-800/80 hover:border-emerald-500/50 transition-colors shadow-sm ml-4 md:ml-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <h4 className="font-bold text-white text-sm font-sans">{exp.company}</h4>
                                                    </div>
                                                    <h5 className="text-[11px] font-mono text-emerald-400/90 mb-2 uppercase tracking-wide">{exp.role}</h5>
                                                    <div className="text-[10px] text-slate-500 font-mono tracking-widest bg-slate-900/50 inline-block px-1.5 py-0.5 rounded border border-slate-800 mb-2">
                                                        {exp.start_date && exp.end_date ? `${exp.start_date} - ${exp.end_date}` : exp.start_date || exp.end_date}
                                                    </div>
                                                    {exp.description && (
                                                        <p className="text-[11px] font-mono text-slate-400 leading-relaxed whitespace-pre-wrap">{exp.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CyberCard>
                            )}

                            {/* Portfolio */}
                            {profile.portfolio_items?.length > 0 && (
                                <CyberCard accent="amber" className="p-6">
                                    <SectionLabel>{t('public_profile.section_portfolio')}</SectionLabel>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {profile.portfolio_items.map((item, idx) => (
                                            <div key={idx} className="relative rounded-xl border border-slate-700/50 overflow-hidden aspect-video group">
                                                {item.image_url
                                                    ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    : <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-sm bg-slate-800/50">{t('public_profile.no_image')}</div>}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3">
                                                    <span className="text-white font-black text-sm font-mono uppercase">{item.title}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CyberCard>
                            )}
                        </div>
                    )}

                    {/* ── POSTS TAB ── */}
                    {activeTab === 'posts' && (
                        <div className="space-y-4">
                            {loadingPosts ? (
                                <CyberCard className="p-12 text-center">
                                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-slate-500 font-mono text-sm">{t('public_profile.loading_data')}</p>
                                </CyberCard>
                            ) : userPosts.length > 0 ? (
                                userPosts.map(post => (
                                    <div key={post.id} className="relative group">
                                        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-cyan-500/20 group-hover:via-purple-500/10 group-hover:to-cyan-500/20 pointer-events-none transition-all duration-500 blur-sm" />
                                        <div className="relative">
                                            <PostCard post={post} />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <CyberCard className="p-14 text-center">
                                    <div className="relative inline-block mb-5">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-3xl shadow-xl shadow-cyan-500/20 mx-auto">📡</div>
                                        <div className="absolute -inset-3 rounded-2xl border border-cyan-400/20 animate-ping" />
                                    </div>
                                    <h3 className="text-[16px] font-black text-white tracking-widest uppercase font-mono mb-2">{t('public_profile.no_posts_title')}</h3>
                                    <p className="text-slate-500 text-[12px] font-mono">{t('public_profile.no_posts_desc')}</p>
                                </CyberCard>
                            )}
                        </div>
                    )}

                    {/* ── REVIEWS TAB ── */}
                    {activeTab === 'reviews' && (
                        <div className="space-y-4">
                            {loadingReviews ? (
                                <CyberCard className="p-12 text-center">
                                    <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                    <p className="text-slate-500 font-mono text-sm">Đang tải đánh giá...</p>
                                </CyberCard>
                            ) : userReviews.length > 0 ? (
                                userReviews.map(review => (
                                    <CyberCard key={review.id} accent="purple" className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded bg-purple-900/30 border border-purple-500/30 flex items-center justify-center font-black font-mono text-purple-400">
                                                    {getInitials(review.reviewer_name || review.reviewer_email)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-200">{review.reviewer_name || review.reviewer_email?.split('@')[0]}</div>
                                                    <div className="text-[10px] text-slate-500 font-mono">{new Date(review.created_at).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div className="flex gap-1 text-amber-400 text-sm">
                                                {[1,2,3,4,5].map(star => (
                                                    <span key={star}>{star <= review.rating ? '★' : '☆'}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-slate-300 text-sm italic">"{review.comment}"</p>
                                        
                                        {review.skillRatings && review.skillRatings.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex flex-wrap gap-2">
                                                {review.skillRatings.map((sr, idx) => (
                                                    <span key={idx} className="text-[10px] font-mono px-2 py-1 rounded bg-cyan-900/20 text-cyan-400 border border-cyan-500/30 uppercase tracking-widest flex items-center gap-1">
                                                        {sr.skill_name}: <span className="text-amber-400">{sr.rating}★</span>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </CyberCard>
                                ))
                            ) : (
                                <CyberCard className="p-14 text-center">
                                    <div className="text-4xl mb-4">⭐</div>
                                    <h3 className="text-[16px] font-black text-white tracking-widest uppercase font-mono mb-2">Chưa có đánh giá</h3>
                                    <p className="text-slate-500 text-[12px] font-mono">Người dùng này chưa nhận được đánh giá nào từ các dự án đã hoàn thành.</p>
                                </CyberCard>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PublicProfile;
