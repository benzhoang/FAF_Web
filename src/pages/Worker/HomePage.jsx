import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PostForm from '../../components/Social/PostForm';
import PostCard from '../../components/Social/PostCard';
import { postsApi } from '../../api/posts.api';

/* ─── helpers ─── */
const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
};

/* ══════════════════════════════════════════════════════
   MATRIX RAIN CANVAS
══════════════════════════════════════════════════════ */
const MatrixCanvas = () => {
    const ref = useRef(null);
    useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = window.innerWidth;
        let H = canvas.height = window.innerHeight;
        const cols = Math.floor(W / 20);
        const drops = Array(cols).fill(1);
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;,.<>?/\\~`FAF⬡◈⬢✦⊕';

        let id;
        const draw = () => {
            ctx.fillStyle = 'rgba(2,6,23,0.07)';
            ctx.fillRect(0, 0, W, H);
            ctx.font = '13px monospace';
            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 20;
                const y = drops[i] * 20;
                // lead char is bright cyan, rest fade
                ctx.fillStyle = drops[i] * 20 < 40 ? '#67e8f9' : `rgba(6,182,212,${Math.random() * 0.5 + 0.1})`;
                ctx.fillText(char, x, y);
                if (y > H && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            }
            id = requestAnimationFrame(draw);
        };
        draw();
        const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize); };
    }, []);
    return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: 0.03 }} />;
};

/* ══════════════════════════════════════════════════════
   PARTICLE NET CANVAS (neural web)
══════════════════════════════════════════════════════ */
const ParticleNet = () => {
    const ref = useRef(null);
    useEffect(() => {
        const c = ref.current; if (!c) return;
        const ctx = c.getContext('2d');
        let W = c.width = window.innerWidth;
        let H = c.height = window.innerHeight;
        const N = 60;
        const pts = Array.from({ length: N }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
            r: Math.random() * 1.5 + .5,
        }));
        let id;
        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            for (let i = 0; i < N; i++) {
                for (let j = i + 1; j < N; j++) {
                    const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 130) {
                        const alpha = 0.25 * (1 - d / 130);
                        const g = ctx.createLinearGradient(pts[i].x, pts[i].y, pts[j].x, pts[j].y);
                        g.addColorStop(0, `rgba(6,182,212,${alpha})`);
                        g.addColorStop(1, `rgba(139,92,246,${alpha})`);
                        ctx.strokeStyle = g;
                        ctx.lineWidth = .8;
                        ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
                    }
                }
            }
            pts.forEach(p => {
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = Math.random() > .5 ? 'rgba(6,182,212,.6)' : 'rgba(139,92,246,.6)';
                ctx.fill();
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > W) p.vx *= -1;
                if (p.y < 0 || p.y > H) p.vy *= -1;
            });
            id = requestAnimationFrame(draw);
        };
        draw();
        const r = () => { W = c.width = window.innerWidth; H = c.height = window.innerHeight; };
        window.addEventListener('resize', r);
        return () => { cancelAnimationFrame(id); window.removeEventListener('resize', r); };
    }, []);
    return <canvas ref={ref} className="fixed inset-0 z-0 pointer-events-none" style={{ opacity: .55 }} />;
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK LEFT SIDEBAR
══════════════════════════════════════════════════════ */
const CyberSidebar = ({ user, navigate }) => {
    const role        = user?.role || 'worker';
    const displayName = user?.full_name || user?.email?.split('@')[0] || 'AGENT';
    const [time, setTime] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

    const navItems = role === 'worker'
        ? [
            { icon: '⬡', label: 'DASHBOARD',   sub: 'Performance metrics', path: '/dashboard', color: 'text-cyan-400' },
            { icon: '◈', label: 'FIND WORK',    sub: 'Browse active jobs',  path: '/find-work', color: 'text-purple-400' },
            { icon: '⬢', label: 'MESSAGES',     sub: 'Secure comm channel', path: '/messages',  color: 'text-green-400' },
            { icon: '✦', label: 'WALLET',       sub: 'Escrow vault',        path: '/wallet',    color: 'text-amber-400' },
            { icon: '⊕', label: 'SETTINGS',     sub: 'Node configuration',  path: '/settings',  color: 'text-slate-400' },
          ]
        : [
            { icon: '⬡', label: 'EMPLOYER HUB', sub: 'Manage operations',   path: '/task-owner',            color: 'text-cyan-400' },
            { icon: '◈', label: 'POST JOB',     sub: 'Deploy new contract', path: '/task-owner/post-job',   color: 'text-purple-400' },
            { icon: '⬢', label: 'MESSAGES',     sub: 'Secure comm channel', path: '/messages',              color: 'text-green-400' },
            { icon: '⊕', label: 'SETTINGS',     sub: 'Node configuration',  path: '/settings',              color: 'text-slate-400' },
          ];

    return (
        <aside className="hidden lg:flex flex-col w-[270px] shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-y-auto pb-6 scrollbar-hide gap-3 pt-4">

            {/* Profile HUD card */}
            <div className="relative rounded-xl overflow-hidden border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.07)]">
                {/* Top scan line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                {/* Corner brackets */}
                <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-cyan-400/70" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-cyan-400/70" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-cyan-400/70" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-cyan-400/70" />

                <div className="p-5">
                    {/* Status row */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-lg shadow-green-400/80" />
                            <span className="text-[10px] font-black tracking-widest text-green-400 uppercase">Node Online</span>
                        </div>
                        <span className="text-[10px] font-mono text-slate-500">
                            {time.toLocaleTimeString('en-US', { hour12: false })}
                        </span>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-black text-xl overflow-hidden shadow-lg shadow-cyan-500/30 ring-2 ring-cyan-500/40">
                                {user?.avatar_url
                                    ? <img src={user.avatar_url} alt="av" className="w-full h-full object-cover" />
                                    : getInitials(displayName)}
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-slate-900 shadow" />
                        </div>
                        <div>
                            <p className="font-black text-white text-[15px] tracking-wide uppercase leading-tight">{displayName}</p>
                            <p className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">{role} · FAF Network</p>
                            {user?.tier && (
                                <span className="inline-block mt-1 text-[8px] font-black tracking-widest px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                                    {user.tier}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Nav items */}
                <div className="border-t border-slate-700/50 py-1">
                    {navItems.map(item => (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className="w-full flex items-center gap-3 px-4 py-3 group hover:bg-cyan-500/5 transition-all border-l-2 border-transparent hover:border-cyan-400/60"
                        >
                            <span className={`text-xl font-bold ${item.color} group-hover:drop-shadow-[0_0_8px_currentColor] transition-all`}>{item.icon}</span>
                            <div className="text-left">
                                <p className="text-[12px] font-black tracking-widest text-slate-200 group-hover:text-white uppercase">{item.label}</p>
                                <p className="text-[10px] text-slate-500 group-hover:text-slate-400 font-mono">{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Bottom scan line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
            </div>

            {/* Escrow status */}
            <div className="relative rounded-xl overflow-hidden border border-green-500/20 bg-slate-900/80 backdrop-blur-md p-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-400/50 to-transparent" />
                <div className="text-[9px] font-black tracking-widest text-green-400 uppercase mb-2 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    ESCROW MODULE ACTIVE
                </div>
                <div className="font-mono text-[11px] text-slate-400 space-y-1">
                    <div className="flex justify-between"><span className="text-slate-500">protocol</span><span className="text-cyan-300">WEB3.v2</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">network</span><span className="text-green-300">MAINNET</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">status</span><span className="text-green-300">SECURED</span></div>
                    <div className="flex justify-between"><span className="text-slate-500">latency</span><span className="text-amber-300">{Math.floor(12 + Math.random() * 8)}ms</span></div>
                </div>
                {/* mini progress bar */}
                <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-[shimmer_2s_linear_infinite]" style={{ width: '78%' }} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono mt-1">78% escrow integrity</p>
            </div>
        </aside>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK RIGHT SIDEBAR
══════════════════════════════════════════════════════ */
const CyberRightPanel = ({ user, navigate }) => {
    const role = user?.role || 'worker';
    const links = role === 'worker'
        ? [
            { label: '► LAUNCH DASHBOARD', path: '/dashboard',  neon: 'cyan' },
            { label: '► FIND NEW JOBS',    path: '/find-work',  neon: 'purple' },
            { label: '► OPEN WALLET',      path: '/wallet',     neon: 'amber'  },
            { label: '► MESSAGES',         path: '/messages',   neon: 'green'  },
          ]
        : [
            { label: '► EMPLOYER PANEL',   path: '/task-owner',            neon: 'cyan'   },
            { label: '► DEPLOY JOB',       path: '/task-owner/post-job',   neon: 'purple' },
            { label: '► MESSAGES',         path: '/messages',              neon: 'green'  },
          ];

    const neonMap = {
        cyan:   'border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
        purple: 'border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',
        amber:  'border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        green:  'border-green-500/40 text-green-300 hover:border-green-400 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]',
    };

    const [tick, setTick] = useState(0);
    useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 2000); return () => clearInterval(t); }, []);
    const activity = ['New job posted: Frontend Dev', 'Contract #4821 secured', 'Escrow released: $520', 'New proposal received', 'User joined FAF network'];

    return (
        <aside className="hidden xl:flex flex-col w-[270px] shrink-0 sticky top-[56px] self-start h-[calc(100vh-56px)] overflow-y-auto pb-6 scrollbar-hide gap-3 pt-4">

            {/* Quick commands */}
            <div className="relative rounded-xl border border-purple-500/20 bg-slate-900/80 backdrop-blur-md overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
                <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400/60" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400/60" />

                <div className="px-4 pt-4 pb-2">
                    <h3 className="text-[9px] font-black tracking-widest text-purple-400 uppercase mb-3">// QUICK COMMANDS</h3>
                    <div className="flex flex-col gap-2">
                        {links.map(l => (
                            <button
                                key={l.path}
                                onClick={() => navigate(l.path)}
                                className={`w-full text-left px-3 py-2.5 rounded-lg border font-mono text-[11px] font-bold tracking-wider transition-all ${neonMap[l.neon]}`}
                            >
                                {l.label}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <div className="h-3" />
            </div>

            {/* Live activity feed */}
            <div className="relative rounded-xl border border-cyan-500/20 bg-slate-900/80 backdrop-blur-md overflow-hidden p-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
                <h3 className="text-[9px] font-black tracking-widest text-cyan-400 uppercase mb-3 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    LIVE ACTIVITY
                </h3>
                <div className="space-y-2 overflow-hidden">
                    {activity.slice(tick % activity.length, tick % activity.length + 4).concat(activity).slice(0, 4).map((a, i) => (
                        <div key={i} className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                            <span className="text-cyan-500 flex-shrink-0">{'>'}</span>
                            <span className="truncate">{a}</span>
                        </div>
                    ))}
                </div>
                <div className="mt-3 h-px bg-slate-800" />
                <p className="text-[9px] font-mono text-slate-600 mt-2">STREAM_ID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
            </div>

            {/* Trending tags */}
            <div className="relative rounded-xl border border-slate-700/50 bg-slate-900/80 backdrop-blur-md overflow-hidden p-4">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-500/40 to-transparent" />
                <h3 className="text-[9px] font-black tracking-widest text-slate-400 uppercase mb-3">// TRENDING SIGNALS</h3>
                {['#Web3Jobs', '#SmartEscrow', '#RemoteWork', '#FreelanceLife', '#FAFProtocol'].map((tag, i) => (
                    <div key={tag} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                        <span className="text-[12px] font-mono font-bold text-slate-300 hover:text-cyan-300 cursor-pointer transition-colors">{tag}</span>
                        <span className="text-[10px] text-slate-600 font-mono">{(i + 1) * 132 + 47} nodes</span>
                    </div>
                ))}
            </div>
        </aside>
    );
};

/* ══════════════════════════════════════════════════════
   FEED SECTION HEADER
══════════════════════════════════════════════════════ */
const FeedHeader = ({ user, navigate }) => {
    const role = user?.role || 'worker';
    const shortcuts = role === 'worker'
        ? [
            { emoji: '⬡', label: 'FIND WORK',  grad: 'from-cyan-500 to-blue-600',     path: '/find-work' },
            { emoji: '📊', label: 'DASHBOARD',  grad: 'from-purple-500 to-indigo-600', path: '/dashboard' },
            { emoji: '💬', label: 'MESSAGES',   grad: 'from-emerald-500 to-cyan-600',  path: '/messages'  },
            { emoji: '💰', label: 'WALLET',     grad: 'from-amber-500 to-orange-600',  path: '/wallet'    },
          ]
        : [
            { emoji: '➕', label: 'POST JOB',   grad: 'from-cyan-500 to-blue-600',     path: '/task-owner/post-job' },
            { emoji: '📁', label: 'MY JOBS',    grad: 'from-purple-500 to-indigo-600', path: '/task-owner' },
            { emoji: '💬', label: 'MESSAGES',   grad: 'from-emerald-500 to-cyan-600',  path: '/messages'   },
          ];

    return (
        <div className="relative rounded-xl border border-slate-700/50 bg-slate-900/70 backdrop-blur-md overflow-hidden p-4">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
            <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-3">// QUICK ACCESS</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
                {shortcuts.map(s => (
                    <button key={s.path} onClick={() => navigate(s.path)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-2xl shadow-lg group-hover:-translate-y-1 group-hover:shadow-xl transition-all relative overflow-hidden`}>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            {s.emoji}
                        </div>
                        <span className="text-[9px] font-black tracking-widest text-slate-400 group-hover:text-cyan-300 transition-colors uppercase">{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK POST WRAPPER (wraps existing PostCard)
══════════════════════════════════════════════════════ */
const CyberPostWrapper = ({ children }) => (
    <div className="relative group">
        {/* Neon border glow on hover */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-cyan-500/30 group-hover:via-purple-500/20 group-hover:to-cyan-500/30 transition-all duration-500 pointer-events-none blur-sm" />
        {/* Override PostCard to dark-ish */}
        <div className="relative [&_.bg-white]:bg-slate-900/90 [&_.bg-white]:text-slate-100 [&_.border-gray-100]:border-slate-700/50 [&_.border-gray-200]:border-slate-700/50 [&_.text-gray-900]:text-slate-100 [&_.text-gray-700]:text-slate-300 [&_.text-gray-600]:text-slate-400 [&_.text-gray-500]:text-slate-500 [&_.hover\\:bg-gray-100]:hover:bg-slate-800/60 [&_.rounded-xl]:rounded-2xl">
            {children}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════
   CYBERPUNK POSTFORM WRAPPER
══════════════════════════════════════════════════════ */
const CyberPostFormWrapper = ({ children }) => (
    <div className="relative group">
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/40 via-purple-500/30 to-cyan-500/40 blur-sm pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="relative [&_.bg-white\\/90]:bg-slate-900/90 [&_.bg-white\\/70]:bg-slate-900/90 [&_.bg-white]:bg-slate-900/90 [&_.border-white\\/60]:border-slate-700/60 [&_.border-white\\/70]:border-slate-700/60 [&_.border-gray-200]:border-slate-700/50 [&_.text-gray-500]:text-slate-400 [&_.text-gray-600]:text-slate-300 [&_.bg-gray-100]:bg-slate-800/60 [&_.bg-gray-200]:bg-slate-700/60 [&_.hover\\:bg-gray-100]:hover:bg-slate-800 [&_.hover\\:bg-gray-200]:hover:bg-slate-700 [&_.text-gray-900]:text-slate-100 [&_.border-gray-100]:border-slate-700/40 [&_.rounded-2xl]:rounded-2xl">
            {children}
        </div>
    </div>
);

/* ══════════════════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════════════════ */
const HomePage = () => {
    const { user }   = useAuth();
    const navigate   = useNavigate();
    const [posts, setPosts]         = useState([]);
    const [feedLoading, setFeedLoading] = useState(false);

    /* unauthenticated scroll */
    useEffect(() => {
        if (user) return;
        const obs = new IntersectionObserver((e) => e.forEach(e => e.target.classList.toggle('active', e.isIntersecting)), { threshold: .15 });
        document.querySelectorAll('.reveal,.reveal-left,.reveal-scale').forEach(el => obs.observe(el));
        return () => obs.disconnect();
    }, [user]);

    useEffect(() => {
        document.documentElement.style.scrollBehavior = user ? 'auto' : 'smooth';
        return () => { document.documentElement.style.scrollBehavior = 'auto'; };
    }, [user]);

    const fetchFeed = useCallback(async () => {
        try { setFeedLoading(true); const r = await postsApi.getFeed(); setPosts(r.data || []); }
        catch (e) { console.error(e); } finally { setFeedLoading(false); }
    }, []);
    useEffect(() => { if (user) fetchFeed(); }, [user, fetchFeed]);

    /* ════════ AUTHENTICATED ════════ */
    if (user) {
        const hour = new Date().getHours();
        const greeting = hour < 5 ? 'SYSTEM BOOT' : hour < 12 ? 'GOOD MORNING' : hour < 18 ? 'ONLINE' : 'GOOD EVENING';
        const displayName = user?.full_name || user?.email?.split('@')[0] || 'AGENT';

        return (
            <div className="min-h-screen relative overflow-x-hidden" style={{ background: '#020617' }}>
                {/* Layers */}
                <MatrixCanvas />
                <ParticleNet />

                {/* Scanlines overlay */}
                <div className="fixed inset-0 z-0 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,255,0.015) 0px, rgba(0,255,255,0.015) 1px, transparent 1px, transparent 3px)', backgroundSize: '100% 3px' }} />

                {/* Glow orbs */}
                <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] animate-[pulse_10s_ease-in-out_infinite_3s]" />
                </div>

                <div className="relative z-10">
                    <Navbar />

                    {/* SYSTEM STATUS BAR */}
                    <div className="bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-sm">
                        <div className="max-w-[1300px] mx-auto px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-md shadow-green-400/80" />
                                    <span className="text-[10px] font-black tracking-widest text-green-400 uppercase font-mono">{greeting}, {displayName.toUpperCase()}</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                                    <span className="text-cyan-500/60">|</span>
                                    <span>ROLE: <span className="text-cyan-300">{(user.role || 'WORKER').toUpperCase()}</span></span>
                                    <span className="text-cyan-500/60">|</span>
                                    <span>STATUS: <span className="text-green-300">AUTHENTICATED</span></span>
                                    <span className="text-cyan-500/60">|</span>
                                    <span>NETWORK: <span className="text-purple-300">FAF-MAINNET</span></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.role === 'worker' ? (
                                    <button onClick={() => navigate('/find-work')}
                                        className="text-[10px] font-black tracking-widest uppercase font-mono border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] px-3 py-1.5 rounded transition-all">
                                        ⬡ FIND JOBS
                                    </button>
                                ) : (
                                    <button onClick={() => navigate('/task-owner/post-job')}
                                        className="text-[10px] font-black tracking-widest uppercase font-mono border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-3 py-1.5 rounded transition-all">
                                        ◈ DEPLOY JOB
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main layout */}
                    <div className="max-w-[1300px] mx-auto px-4 py-4 flex gap-4">
                        <CyberSidebar user={user} navigate={navigate} />

                        {/* FEED */}
                        <main className="flex-1 max-w-[600px] mx-auto flex flex-col gap-4 min-w-0">
                            {/* Section: Feed stream label */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                                <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-cyan-400 uppercase font-mono">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    FEED STREAM ACTIVE
                                </div>
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                            </div>

                            <FeedHeader user={user} navigate={navigate} />

                            {/* Post form */}
                            <CyberPostFormWrapper>
                                <PostForm onPostCreated={fetchFeed} />
                            </CyberPostFormWrapper>

                            {/* Feed posts */}
                            {feedLoading ? (
                                <>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 animate-pulse">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-12 h-12 rounded-xl bg-slate-800" />
                                                <div className="flex-1 space-y-2">
                                                    <div className="h-3 bg-slate-800 rounded w-1/3" />
                                                    <div className="h-2 bg-slate-700 rounded w-1/4" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-800/60 rounded w-full" />
                                                <div className="h-3 bg-slate-800/40 rounded w-5/6" />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : posts.length === 0 ? (
                                <div className="relative rounded-2xl border border-cyan-500/20 bg-slate-900/70 backdrop-blur-md p-14 text-center overflow-hidden">
                                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                                    <div className="relative inline-block mb-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-4xl shadow-2xl shadow-cyan-500/30 mx-auto">
                                            📡
                                        </div>
                                        <div className="absolute -inset-3 rounded-2xl border border-cyan-400/30 animate-ping" />
                                    </div>
                                    <h3 className="text-[18px] font-black text-white tracking-widest uppercase mb-2">NO FEED DATA</h3>
                                    <p className="text-slate-500 text-[12px] font-mono max-w-xs mx-auto">Broadcast your first signal to activate the feed stream.</p>
                                    <div className="mt-4 text-[9px] font-mono text-cyan-500/60">STREAM_READY · WAITING FOR INPUT_</div>
                                </div>
                            ) : (
                                posts.map(post => (
                                    <CyberPostWrapper key={post.id}>
                                        <PostCard post={post} onUpdate={fetchFeed} />
                                    </CyberPostWrapper>
                                ))
                            )}
                        </main>

                        <CyberRightPanel user={user} navigate={navigate} />
                    </div>
                </div>
            </div>
        );
    }

    /* ════════ UNAUTHENTICATED (Web3 terminal — unchanged) ════════ */
    return (
        <div className="w-full bg-slate-950 text-slate-200 relative font-sans selection:bg-purple-500/30 overflow-x-hidden">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0 bg-slate-950" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
            </div>
            <div className="relative z-10 w-full">
                <section className="sticky top-0 w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-slate-950 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-10">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute bottom-[-10%] w-[150%] left-[-25%] h-[60%] web3-grid z-0" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] glow-orb-bg rounded-full z-0 mix-blend-screen animate-[pulse-ring_8s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/20 rounded-full z-0 mix-blend-screen blur-[80px]" />
                    </div>
                    <div className="relative z-20 text-center w-full max-w-4xl px-4 reveal-scale delay-200">
                        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-white leading-[1] tracking-tighter mb-6">
                            <span className="block text-glitch-effect cursor-crosshair">ENTER THE</span>
                            <span className="block text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-200 to-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">FUTURE OF WORK.</span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed font-mono">
                            Permissionless connections · <strong className="text-white">Cryptographic escrow</strong> · Cross-border settlements
                        </p>
                        <button onClick={() => navigate('/signup')} className="glass-card bg-slate-900/80 border hover:bg-slate-800 border-purple-500/50 text-white px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:shadow-[0_0_60px_rgba(168,85,247,0.6)] hover:scale-105 transition-all">
                            Initialize Web3 Profile
                        </button>
                    </div>
                </section>
                <section className="sticky top-0 w-full h-screen flex items-center justify-center bg-slate-950/90 backdrop-blur-md z-20 border-t border-white/5">
                    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8 reveal-left">
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight text-glitch-effect">CRYPTOGRAPHIC<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-600">SMART ESCROW</span></h2>
                            <p className="text-slate-400 text-lg font-medium leading-relaxed font-mono">Funds locked in decentralized smart contract. Payouts execute automatically upon milestone validation.</p>
                        </div>
                    </div>
                </section>
                <section className="sticky top-0 w-full h-screen flex flex-col items-center justify-center bg-slate-950 z-40 border-t border-white/10">
                    <h2 className="text-5xl md:text-8xl font-black text-white text-center tracking-tight mb-8 reveal-scale"><span className="text-glitch-effect">SYSTEM READY.</span></h2>
                    <div className="flex flex-col sm:flex-row gap-6 reveal-scale delay-300">
                        <button onClick={() => navigate('/signup')} className="glass-card bg-purple-600/30 border border-purple-500 hover:bg-purple-600 text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:scale-105">Mount Node (Register)</button>
                        <button onClick={() => navigate('/signin')} className="glass-card bg-transparent border border-slate-600 hover:border-white text-white px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all hover:scale-105">Access Terminal (Login)</button>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;
