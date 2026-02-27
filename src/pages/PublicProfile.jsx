import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../api/user.api';
import { postsApi } from '../api/posts.api';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useChatContext } from '../contexts/ChatContext';
import PostCard from '../components/Social/PostCard';


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

    useEffect(() => {
        const fetchProfile = async () => {
            try { setLoading(true); const res = await userApi.getById(id); setProfile(res.data); }
            catch { setError('Could not load profile.'); }
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
    }, [activeTab, id]);

    const handleMessageClick = async () => {
        if (!currentUser) { toast.error('Please log in to send a message.'); return; }
        try { await openChat(id); } catch { toast.error('Failed to open chat.'); }
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
        } catch { toast.error('Action failed'); }
    };

    /* ── Loading / Error ── */
    if (loading) return (
        <div className="min-h-screen flex items-center justify-center gap-3" style={{ background: '#020617' }}>
            <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-slate-400 font-mono text-sm">Loading node data...</span>
        </div>
    );
    if (error || !profile) return (
        <div className="min-h-screen flex items-center justify-center text-red-400 font-mono" style={{ background: '#020617' }}>
            {error || 'Node not found.'}
        </div>
    );

    const isOwnProfile = currentUser?.id === Number(id);

    const statCards = [
        { label: 'AVG RATING',      value: Number(profile.rating_avg || 0).toFixed(1), suffix: '/ 5', accent: 'cyan'   },
        { label: 'JOBS COMPLETED',  value: profile.total_jobs_done || 0,               suffix: '',    accent: 'purple' },
        { label: 'HOURLY RATE',     value: `$${Number(profile.hourly_rate || 0).toLocaleString()}`, suffix: '/ hr', accent: 'amber' },
    ];

    return (
        <div className="min-h-screen" style={{ background: '#020617', marginTop: '-1px' }}>
            {/* Scanlines */}
            <div className="fixed inset-0 pointer-events-none z-0"
                style={{ backgroundImage: 'repeating-linear-gradient(0deg,rgba(0,255,255,0.012) 0px,rgba(0,255,255,0.012) 1px,transparent 1px,transparent 3px)', backgroundSize: '100% 3px' }} />
            {/* Glow orbs */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[80px]" />
            </div>

            <div className="relative z-10">

                {/* System bar */}
                <div className="border-b border-cyan-500/15" style={{ background: 'rgba(2,6,23,0.9)', backdropFilter: 'blur(8px)' }}>
                    <div className="max-w-5xl mx-auto px-4 py-2 flex items-center gap-3">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors font-mono text-[11px] font-bold tracking-wider"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            BACK
                        </button>
                        <span className="text-slate-700 font-mono">|</span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                            NODE / <span className="text-cyan-400">{profile.full_name?.toUpperCase()}</span>
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
                                            {profile.role || 'WORKER'} · FAF NETWORK
                                        </p>
                                        <p className="text-slate-400 text-sm mt-1">{profile.title || profile.bio?.substring(0, 60) || 'Professional on FAF Platform'}</p>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-2 pb-1">
                                    <button onClick={handleMessageClick}
                                        className="px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono transition-all bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 hover:-translate-y-0.5">
                                        ► MSG
                                    </button>
                                    {currentUser && !isOwnProfile && (
                                        <button onClick={handleFollowToggle}
                                            className={`px-4 py-2 rounded-xl font-black text-[11px] tracking-widest uppercase font-mono transition-all border ${
                                                isFollowing
                                                    ? 'border-slate-600/50 text-slate-400 hover:border-red-500/50 hover:text-red-400 bg-slate-800/40'
                                                    : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400'
                                            }`}>
                                            {isFollowing ? '✓ FOLLOWING' : '+ FOLLOW'}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Stats row */}
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-700/40">
                                <div className="flex items-center gap-1.5 text-[12px] font-mono">
                                    <span className="font-black text-white">{profile.followers_count || 0}</span>
                                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">FOLLOWERS</span>
                                </div>
                                <div className="w-px h-4 bg-slate-700/60" />
                                <div className="flex items-center gap-1.5 text-[12px] font-mono">
                                    <span className="font-black text-white">{profile.following_count || 0}</span>
                                    <span className="text-slate-500 text-[10px] uppercase tracking-wider">FOLLOWING</span>
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
                            { key: 'overview', label: '⬡ OVERVIEW' },
                            { key: 'posts',    label: '◈ POSTS & ACTIVITY' },
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
                                <SectionLabel>ABOUT NODE</SectionLabel>
                                <p className="text-slate-300 text-[14px] leading-relaxed whitespace-pre-wrap font-mono">
                                    {profile.bio || `Experienced professional on FAF Platform. Hourly rate: $${profile.hourly_rate || 50}/hr.`}
                                </p>
                            </CyberCard>

                            {/* Skills */}
                            {profile.skills?.length > 0 && (
                                <CyberCard accent="purple" className="p-6">
                                    <SectionLabel>SKILL MATRIX</SectionLabel>
                                    <div className="space-y-4">
                                        {profile.skills.map((skill, idx) => {
                                            const name  = typeof skill === 'object' ? skill.name : skill;
                                            const score = Math.min(99, 80 + (name.length % 20));
                                            return (
                                                <div key={idx}>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="text-[13px] font-black text-slate-200 font-mono uppercase tracking-wide">{name}</span>
                                                        <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">{score}/100</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                                        <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" style={{ width: `${score}%` }} />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CyberCard>
                            )}

                            {/* Portfolio */}
                            {profile.portfolio_items?.length > 0 && (
                                <CyberCard accent="amber" className="p-6">
                                    <SectionLabel>PORTFOLIO ARCHIVE</SectionLabel>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {profile.portfolio_items.map((item, idx) => (
                                            <div key={idx} className="relative rounded-xl border border-slate-700/50 overflow-hidden aspect-video group">
                                                {item.image_url
                                                    ? <img src={item.image_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    : <div className="w-full h-full flex items-center justify-center text-slate-600 font-mono text-sm bg-slate-800/50">NO PREVIEW</div>}
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
                                    <p className="text-slate-500 font-mono text-sm">LOADING STREAM...</p>
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
                                    <h3 className="text-[16px] font-black text-white tracking-widest uppercase font-mono mb-2">NO SIGNAL</h3>
                                    <p className="text-slate-500 text-[12px] font-mono">This node has not broadcast any posts yet.</p>
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
