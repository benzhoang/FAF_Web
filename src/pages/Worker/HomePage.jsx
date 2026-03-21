import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import PostForm from '../../components/Social/PostForm';
import PostCard from '../../components/Social/PostCard';
import { useTheme } from '../../contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const role        = user?.role || 'worker';
    const displayName = user?.full_name || user?.email?.split('@')[0] || 'AGENT';
    const [time, setTime] = useState(new Date());
    useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t); }, []);

    const navItems = role === 'worker'
        ? [
            { icon: '⬡', label: t('home.sidebar.dashboard'),   sub: t('home.sidebar.dashboard_sub_worker'), path: '/dashboard', color: 'text-cyan-400' },
            { icon: '◈', label: t('home.sidebar.find_work'),    sub: t('home.sidebar.find_work_sub'),  path: '/find-work', color: 'text-purple-400' },
            { icon: '⬢', label: t('home.sidebar.messages'),     sub: t('home.sidebar.messages_sub'), path: '/messages',  color: 'text-green-400' },
            { icon: '✦', label: t('home.sidebar.wallet'),       sub: t('home.sidebar.wallet_sub'),        path: '/wallet',    color: 'text-amber-400' },
            { icon: '⊕', label: t('home.sidebar.settings'),     sub: t('home.sidebar.settings_sub'),  path: '/settings',  color: 'text-slate-400' },
          ]
        : role === 'manager'
        ? [
            { icon: '⬡', label: 'COMMAND CENTER', sub: 'System Dashboard',   path: '/manager/request',            color: 'text-emerald-400' },
            { icon: '◈', label: 'WORK HUB',       sub: 'Active Contracts',    path: '/manager/management/jobs',    color: 'text-cyan-400' },
            { icon: '⬢', label: t('home.sidebar.messages'),     sub: t('home.sidebar.messages_sub'), path: '/messages',              color: 'text-green-400' },
            { icon: '⊕', label: t('home.sidebar.settings'),     sub: t('home.sidebar.settings_sub'),  path: '/settings',              color: 'text-slate-400' },
        ]
        : role === 'admin'
        ? [
            { icon: '⬡', label: 'SYS_ADMIN',      sub: 'Main Dashboard',      path: '/admin/dashboard',        color: 'text-cyan-400' },
            { icon: '◈', label: 'USER_REGISTRY',  sub: 'Node Management',      path: '/admin/user-management',   color: 'text-purple-400' },
            { icon: '⬢', label: 'SYS_MODERATION', sub: 'Control Center',      path: '/admin/moderation',        color: 'text-emerald-400' },
            { icon: '✦', label: 'FIN_ESCROW',     sub: 'Ledger Audit',        path: '/admin/finance',           color: 'text-amber-400' },
            { icon: '⊕', label: t('home.sidebar.settings'),     sub: t('home.sidebar.settings_sub'),  path: '/settings',              color: 'text-slate-400' },
          ]
        : [
            { icon: '⬡', label: t('home.sidebar.dashboard'), sub: t('home.sidebar.dashboard_sub_client'),   path: '/task-owner',            color: 'text-cyan-400' },
            { icon: '◈', label: t('home.sidebar.post_job'),     sub: t('home.sidebar.post_job_sub'), path: '/task-owner/post-job',   color: 'text-purple-400' },
            { icon: '⬢', label: t('home.sidebar.messages'),     sub: t('home.sidebar.messages_sub'), path: '/messages',              color: 'text-green-400' },
            { icon: '⊕', label: t('home.sidebar.settings'),     sub: t('home.sidebar.settings_sub'),  path: '/settings',              color: 'text-slate-400' },
          ];

    return (
        <aside className="hidden lg:flex flex-col w-[270px] shrink-0 h-full overflow-y-auto custom-scrollbar pb-6 gap-3">

            {/* Profile HUD card */}
            <div
                className={`shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-cyan-500/20 backdrop-blur-md shadow-[0_0_30px_rgba(6,182,212,0.07)]'}`}
                style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.8)' }}
            >
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
                            <span className={`text-[10px] font-black tracking-widest uppercase ${isLight ? 'text-green-600' : 'text-green-400'}`}>{t('home.sidebar.active')}</span>
                        </div>
                        <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-500'}`}>
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
                            <p className={`font-black text-[15px] tracking-wide uppercase leading-tight ${isLight ? 'text-slate-800' : 'text-white'}`}>{displayName}</p>
                            <p className={`text-[10px] font-bold tracking-widest uppercase ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>{role === 'worker' ? t('home.sidebar.role_worker') : role === 'manager' ? 'MASTER_OP' : role === 'admin' ? 'SYS_ADMIN' : t('home.sidebar.role_client')} · {t('home.sidebar.system')}</p>
                            {user?.tier && (
                                <span className={`inline-block mt-1 text-[8px] font-black tracking-widest px-2 py-0.5 rounded border uppercase ${isLight ? 'bg-cyan-100 text-cyan-800 border-cyan-200' : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'}`}>
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
                                <p className={`text-[12px] font-black tracking-widest uppercase transition-colors ${isLight ? 'text-slate-700 group-hover:text-slate-900' : 'text-slate-200 group-hover:text-white'}`}>{item.label}</p>
                                <p className={`text-[10px] font-mono transition-colors ${isLight ? 'text-slate-500 group-hover:text-slate-700' : 'text-slate-500 group-hover:text-slate-400'}`}>{item.sub}</p>
                            </div>
                        </button>
                    ))}
                </div>

                {/* Bottom scan line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/60 to-transparent" />
            </div>

            {/* Escrow status */}
            <div
                className={`shrink-0 relative rounded-xl overflow-hidden p-4 transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-green-500/20 backdrop-blur-md'}`}
                style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.8)' }}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLight ? 'via-green-500/30' : 'via-green-400/50'} to-transparent`} />
                <div className={`text-[9px] font-black tracking-widest uppercase mb-2 flex items-center gap-2 ${isLight ? 'text-green-700' : 'text-green-400'}`}>
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                    {t('home.escrow.title')}
                </div>
                <div className="font-mono text-[11px] space-y-1">
                    <div className="flex justify-between"><span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{t('home.escrow.protocol')}</span><span className={isLight ? 'text-cyan-700 font-bold' : 'text-cyan-300'}>WEB3.v2</span></div>
                    <div className="flex justify-between"><span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{t('home.escrow.network')}</span><span className={isLight ? 'text-green-700 font-bold' : 'text-green-300'}>{t('home.escrow.mainnet')}</span></div>
                    <div className="flex justify-between"><span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{t('home.escrow.status')}</span><span className={isLight ? 'text-green-700 font-bold' : 'text-green-300'}>{t('home.escrow.secure')}</span></div>
                    <div className="flex justify-between"><span className={isLight ? 'text-slate-500' : 'text-slate-500'}>{t('home.escrow.latency')}</span><span className={isLight ? 'text-amber-600 font-bold' : 'text-amber-300'}>{Math.floor(12 + Math.random() * 8)}ms</span></div>
                </div>
                {/* mini progress bar */}
                <div className="mt-3 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-cyan-400 rounded-full animate-[shimmer_2s_linear_infinite]" style={{ width: '100%' }} />
                </div>
                <p className="text-[9px] text-slate-500 font-mono mt-1">{t('home.escrow.integrity')}</p>
            </div>
        </aside>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK RIGHT SIDEBAR
══════════════════════════════════════════════════════ */
const CyberRightPanel = ({ user, navigate }) => {
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const role = user?.role || 'worker';
    const links = role === 'worker'
        ? [
            { label: t('home.right_panel.dash_worker') || '► ACCESS DASHBOARD', path: '/dashboard',  neon: 'cyan' },
            { label: t('home.right_panel.find_work') || '► SEARCH NEW CONTRACTS',    path: '/find-work',  neon: 'purple' },
            { label: t('home.right_panel.wallet') || '► OPEN WALLET',      path: '/wallet',     neon: 'amber'  },
            { label: t('home.right_panel.messages') || '► COMM LINKS',         path: '/messages',   neon: 'green'  },
          ]
        : role === 'manager'
        ? [
            { label: t('home.right_panel.messages') || '► COMM LINKS',         path: '/messages',              neon: 'green'  },
          ]
        : role === 'admin'
        ? [
            { label: '► SYS DASHBOARD',    path: '/admin/dashboard',        neon: 'cyan'   },
            { label: '► USER REGISTRY',    path: '/admin/user-management',   neon: 'purple' },
            { label: '► MODERATION HUB',   path: '/admin/moderation',        neon: 'green'  },
            { label: '► FINANCE LEDGER',   path: '/admin/finance',           neon: 'amber'  },
          ]
        : [
            { label: t('home.right_panel.dash_client') || '► CLIENT DASHBOARD',   path: '/task-owner',            neon: 'cyan'   },
            { label: t('home.right_panel.post_job') || '► POST NEW JOB',       path: '/task-owner/post-job',   neon: 'purple' },
            { label: t('home.right_panel.messages') || '► COMM LINKS',         path: '/messages',              neon: 'green'  },
          ];

    const neonMapLight = {
        cyan:   'border-cyan-300 text-[#075985] hover:border-cyan-400 hover:bg-cyan-50',
        purple: 'border-purple-300 text-[#5b21b6] hover:border-purple-400 hover:bg-purple-50',
        amber:  'border-amber-300 text-[#92400e] hover:border-amber-400 hover:bg-amber-50',
        green:  'border-green-300 text-[#166534] hover:border-green-400 hover:bg-green-50',
    };

    const neonMapDark = {
        cyan:   'border-cyan-500/40 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
        purple: 'border-purple-500/40 text-purple-300 hover:border-purple-400 hover:bg-purple-500/10 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]',
        amber:  'border-amber-500/40 text-amber-300 hover:border-amber-400 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]',
        green:  'border-green-500/40 text-green-300 hover:border-green-400 hover:bg-green-500/10 hover:shadow-[0_0_20px_rgba(74,222,128,0.2)]',
    };
    
    const neonMap = isLight ? neonMapLight : neonMapDark;

    const [tick, setTick] = useState(0);
    useEffect(() => { const t = setInterval(() => setTick(p => p + 1), 2000); return () => clearInterval(t); }, []);
    const activity = t('home.right_panel.activities', { returnObjects: true });

    return (
        <aside className="w-[320px] flex-shrink-0 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-6 pr-2">
            {/* Quick commands */}
            <div 
                className={`flex-shrink-0 relative rounded-xl overflow-hidden transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-purple-500/20 backdrop-blur-md'}`}
                style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.8)' }}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLight ? 'via-purple-500/30' : 'via-purple-400/60'} to-transparent`} />
                {!isLight && (
                    <>
                        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-purple-400/60" />
                        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-purple-400/60" />
                    </>
                )}

                <div className="px-4 pt-4 pb-2">
                    <h3 className={`text-[9px] font-black tracking-widest uppercase mb-3 ${isLight ? 'text-purple-700' : 'text-purple-400'}`}>{t('home.right_panel.quick_actions')}</h3>
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
            <div 
                className={`flex-shrink-0 relative rounded-xl overflow-hidden p-4 transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-cyan-500/20 backdrop-blur-md'}`}
                style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.8)' }}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLight ? 'via-cyan-500/30' : 'via-cyan-400/50'} to-transparent`} />
                <h3 className={`text-[9px] font-black tracking-widest uppercase mb-3 flex items-center gap-2 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`}>
                    <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isLight ? 'bg-cyan-600' : 'bg-cyan-400'}`} />
                    {t('home.right_panel.recent_activity')}
                </h3>
                <div className="space-y-2 overflow-hidden">
                    {Array.isArray(activity) && activity.slice(tick % activity.length, tick % activity.length + 4).concat(activity).slice(0, 4).map((a, i) => (
                        <div key={i} className={`flex items-center gap-2 font-mono text-[11px] ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>
                            <span className={isLight ? 'text-cyan-600 flex-shrink-0' : 'text-cyan-500 flex-shrink-0'}>{'>'}</span>
                            <span className="truncate">{a}</span>
                        </div>
                    ))}
                </div>
                <div className={`mt-3 h-px ${isLight ? 'bg-slate-200' : 'bg-slate-800'}`} />
                <p className={`text-[9px] font-mono mt-2 ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>STREAM_ID: 0x{Math.random().toString(16).slice(2, 10).toUpperCase()}</p>
            </div>

            {/* Trending tags */}
            <div 
                className={`flex-shrink-0 relative rounded-xl overflow-hidden p-4 transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-slate-700/50 backdrop-blur-md'}`}
                style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.8)' }}
            >
                <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLight ? 'via-slate-400/30' : 'via-slate-500/40'} to-transparent`} />
                <h3 className={`text-[9px] font-black tracking-widest uppercase mb-3 ${isLight ? 'text-slate-600' : 'text-slate-400'}`}>{t('home.right_panel.trending_tags', 'TRENDING PROJECTS')}</h3>
                {['#DubbingVN', '#SubtitleAnime', '#VoiceOver', '#AudioSync', '#VideoEditor'].map((tag, i) => (
                    <div key={tag} className={`flex items-center justify-between py-1.5 border-b last:border-0 ${isLight ? 'border-slate-200' : 'border-slate-800/50'}`}>
                        <span className={`text-[12px] font-mono font-bold cursor-pointer transition-colors ${isLight ? 'text-slate-700 hover:text-cyan-700' : 'text-slate-300 hover:text-cyan-300'}`}>{tag}</span>
                        <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-slate-600'}`}>{(i + 1) * 132 + 47} {t('home.right_panel.views')}</span>
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
    const { t } = useTranslation();
    const { theme } = useTheme();
    const isLight = theme === 'light';
    const role = user?.role || 'worker';
    const shortcuts = role === 'worker'
        ? [
            { emoji: '⬡', label: t('home.feed.find_work'),  grad: 'from-cyan-500 to-blue-600',     path: '/find-work' },
            { emoji: '📊', label: t('home.feed.dashboard'),  grad: 'from-purple-500 to-indigo-600', path: '/dashboard' },
            { emoji: '💬', label: t('home.feed.messages'),   grad: 'from-emerald-500 to-cyan-600',  path: '/messages'  },
            { emoji: '💰', label: t('home.feed.wallet'),     grad: 'from-amber-500 to-orange-600',  path: '/wallet'    },
          ]
        : role === 'manager'
        ? [
            { emoji: '🛡️', label: 'SHIELD_NET',      grad: 'from-emerald-500 to-teal-600',   path: '/manager/request' },
            { emoji: '👥', label: 'PERSONNEL',      grad: 'from-purple-500 to-indigo-600',  path: '/admin/user-management' },
            { emoji: '💬', label: t('home.feed.messages'),   grad: 'from-emerald-500 to-cyan-600',  path: '/messages'   },
          ]
        : role === 'admin'
        ? [
            { emoji: '🛡️', label: 'ADMIN_DASH',      grad: 'from-cyan-500 to-blue-600',      path: '/admin/dashboard' },
            { emoji: '👥', label: 'USERS',          grad: 'from-purple-500 to-indigo-600',  path: '/admin/user-management' },
            { emoji: '⚖️', label: 'MODERATION',     grad: 'from-emerald-500 to-teal-600',    path: '/admin/moderation' },
            { emoji: '💰', label: 'FINANCE',        grad: 'from-amber-500 to-orange-600',   path: '/admin/finance' },
          ]
        : [
            { emoji: '➕', label: t('home.feed.post_job'),   grad: 'from-cyan-500 to-blue-600',     path: '/task-owner/post-job' },
            { emoji: '📁', label: t('home.feed.my_jobs'),    grad: 'from-purple-500 to-indigo-600', path: '/task-owner' },
            { emoji: '💬', label: t('home.feed.messages'),   grad: 'from-emerald-500 to-cyan-600',  path: '/messages'   },
          ];

    return (
        <div 
            className={`relative rounded-xl p-4 pb-6 transition-all duration-300 ${isLight ? 'border border-transparent' : 'border border-slate-700/50 backdrop-blur-md'}`}
            style={{ background: isLight ? 'transparent' : 'rgba(15,23,42,0.7)' }}
        >
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isLight ? 'via-cyan-500/30' : 'via-cyan-400/40'} to-transparent`} />
            <p className={`text-[9px] font-black tracking-widest uppercase mb-3 ${isLight ? 'text-slate-600' : 'text-slate-500'}`}>{t('home.feed.quick_access')}</p>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide py-1">
                {shortcuts.map(s => (
                    <button key={s.path} onClick={() => navigate(s.path)}
                        className="flex-shrink-0 flex flex-col items-center gap-2 group"
                    >
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.grad} flex items-center justify-center text-2xl shadow-lg group-hover:-translate-y-1 transition-all relative overflow-hidden ${isLight ? 'shadow-slate-300' : ''}`}>
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                            {s.emoji}
                        </div>
                        <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${isLight ? 'text-slate-600 group-hover:text-cyan-700' : 'text-slate-400 group-hover:text-cyan-300'}`}>{s.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK POST WRAPPER (wraps existing PostCard)
══════════════════════════════════════════════════════ */
const CyberPostWrapper = ({ children }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    return (
        <div className="relative group">
            {/* Neon border glow on hover */}
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-cyan-500/0 group-hover:from-cyan-500/30 group-hover:via-purple-500/20 group-hover:to-cyan-500/30 transition-all duration-500 pointer-events-none blur-sm" />
            {/* Override PostCard to dark-ish in dark mode, or translucent in light mode */}
            <div className={!isLight 
                ? `relative [&_.bg-white]:bg-slate-900/90 [&_.bg-white]:text-slate-100 [&_.border-gray-100]:border-slate-700/50 [&_.border-gray-200]:border-slate-700/50 [&_.text-gray-900]:text-slate-100 [&_.text-gray-700]:text-slate-300 [&_.text-gray-600]:text-slate-400 [&_.text-gray-500]:text-slate-500 [&_.hover\\:bg-gray-100]:hover:bg-slate-800/60 [&_.rounded-xl]:rounded-2xl`
                : `relative [&_.bg-white]:!bg-white/50 [&_.bg-white]:!backdrop-blur-md [&_.border-gray-100]:border-slate-200/60 [&_.text-gray-900]:!text-slate-800 [&_.text-gray-500]:!text-slate-600 [&_.text-gray-600]:!text-slate-700 [&_.rounded-xl]:rounded-2xl shadow-sm hover:shadow-md transition-shadow`}>
                {children}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   CYBERPUNK POSTFORM WRAPPER
══════════════════════════════════════════════════════ */
const CyberPostFormWrapper = ({ children }) => {
    const { theme } = useTheme();
    const isLight = theme === 'light';
    return (
        <div className="relative group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-cyan-500/40 via-purple-500/30 to-cyan-500/40 blur-sm pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className={!isLight 
                ? `relative [&_.bg-white\/90]:bg-slate-900/90 [&_.bg-white\/70]:bg-slate-900/90 [&_.bg-white]:bg-slate-900/90 [&_.border-white\/60]:border-slate-700/60 [&_.border-white\/70]:border-slate-700/60 [&_.border-gray-200]:border-slate-700/50 [&_.text-gray-500]:text-slate-400 [&_.text-gray-600]:text-slate-300 [&_.bg-gray-100]:bg-slate-800/60 [&_.bg-gray-200]:bg-slate-700/60 [&_.hover\\:bg-gray-100]:hover:bg-slate-800 [&_.hover\\:bg-gray-200]:hover:bg-slate-700 [&_.text-gray-900]:text-slate-100 [&_.border-gray-100]:border-slate-700/40 [&_.rounded-2xl]:rounded-2xl` 
                : `relative [&_.bg-white]:!bg-white/50 [&_.bg-white]:!backdrop-blur-md [&_.border-gray-100]:border-slate-200/60 [&_.text-gray-900]:!text-slate-800 [&_.text-gray-500]:!text-slate-600 [&_.text-gray-600]:!text-slate-700 [&_.rounded-2xl]:rounded-2xl shadow-sm`}>
                {children}
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   MAIN HOME PAGE
══════════════════════════════════════════════════════ */
const HomePage = () => {
    const { t, i18n } = useTranslation();
    const { user }   = useAuth();
    const navigate   = useNavigate();
    
    // Auth-specific state
    const [posts, setPosts]         = useState([]);
    const [feedLoading, setFeedLoading] = useState(false);

    // Unauth-specific state
    const [isDark, setIsDark] = useState(true);

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
        const greeting = hour < 5 ? t('home.status_bar.morning_early') : hour < 12 ? t('home.status_bar.morning') : hour < 18 ? t('home.status_bar.afternoon') : t('home.status_bar.evening');
        const displayName = user?.full_name || user?.email?.split('@')[0] || 'AGENT';

        return (
            <div className="h-screen flex flex-col overflow-hidden relative bg-transparent" >
                {/* Layers */}
                
                

                {/* Scanlines overlay */}
                <div className="fixed inset-0 z-0 pointer-events-none"
                    style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,255,255,0.015) 0px, rgba(0,255,255,0.015) 1px, transparent 1px, transparent 3px)', backgroundSize: '100% 3px' }} />

                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    <Navbar />

                    {/* SYSTEM STATUS BAR */}
                    <div className="bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-sm shrink-0">
                        <div className="max-w-[1300px] mx-auto px-4 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-md shadow-green-400/80" />
                                    <span className="text-[10px] font-black tracking-widest text-green-400 uppercase font-mono">{greeting}, {displayName.toUpperCase()}</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                                    <span className="text-cyan-500/60">|</span>
                                    <span>{t('home.status_bar.role_label')} <span className="text-cyan-300">{user.role === 'worker' ? t('home.status_bar.role_worker') : user.role === 'manager' ? 'MASTER_OP' : user.role === 'admin' ? 'SYS_ADMIN' : t('home.status_bar.role_client')}</span></span>
                                    <span className="text-cyan-500/60">|</span>
                                    <span>{t('home.status_bar.status_label')} <span className="text-green-300">{t('home.status_bar.status_value')}</span></span>
                                    <span className="text-cyan-500/60">|</span>
                                    <span>{t('home.status_bar.system_label')} <span className="text-purple-300">FAF-MAINNET</span></span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {user.role === 'worker' ? (
                                    <button onClick={() => navigate('/find-work')}
                                        className="text-[10px] font-black tracking-widest uppercase font-mono border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] px-3 py-1.5 rounded transition-all">
                                        {t('home.status_bar.btn_find_work')}
                                    </button>
                                ) : user.role === 'manager' ? (
                                    <button onClick={() => navigate('/manager/request')}
                                        className="text-[10px] font-black tracking-widest uppercase font-mono border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 hover:border-emerald-400 hover:shadow-[0_0_15px_rgba(16,185,129,0.3)] px-3 py-1.5 rounded transition-all">
                                        COMMAND CENTER
                                    </button>
                                    ) : user.role === 'admin' ? (
                                        <button onClick={() => navigate('/admin/dashboard')}
                                            className="text-[10px] font-black tracking-widest uppercase font-mono border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/10 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] px-3 py-1.5 rounded transition-all">
                                            ADMIN_PANEL
                                        </button>
                                    ) : (
                                        <button onClick={() => navigate('/task-owner/post-job')}
                                            className="text-[10px] font-black tracking-widest uppercase font-mono border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 px-3 py-1.5 rounded transition-all">
                                            {t('home.status_bar.btn_post_job')}
                                        </button>
                                    )}
                            </div>
                        </div>
                    </div>

                    {/* Main layout */}
                    <div className="max-w-[1300px] mx-auto px-4 py-4 flex gap-4 flex-1 w-full min-h-0">
                        <CyberSidebar user={user} navigate={navigate} />

                        {/* FEED */}
                        <main className="flex-1 max-w-[600px] mx-auto flex flex-col gap-4 min-w-0 h-full overflow-y-auto custom-scrollbar pb-10 pr-2">
                            {/* Section: Feed stream label */}
                            <div className="flex items-center gap-3">
                                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
                                <div className="flex items-center gap-2 text-[9px] font-black tracking-widest text-cyan-400 uppercase font-mono">
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    {t('home.feed.active_feed')}
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
                                    <h3 className="text-[18px] font-black text-white tracking-widest uppercase mb-2">{t('home.feed.no_posts')}</h3>
                                    <p className="text-slate-500 text-[12px] font-mono max-w-xs mx-auto">{t('home.feed.no_posts_desc')}</p>
                                    <div className="mt-4 text-[9px] font-mono text-cyan-500/60">{t('home.feed.standby')}</div>
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
    /* ════════ UNAUTHENTICATED (Landing Page - NFT Game Style) ════════ */
    const toggleLang = () => i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');

    return (
        <div className="w-full min-h-screen relative font-sans bg-[#050810] text-[#e0e7ff] overflow-x-hidden selection:bg-[#00f0ff] selection:text-black">
            {/* Base Background Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <ParticleNet />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-10" />
                {/* Tech Grid Background */}
                <div className="absolute inset-0 z-0" style={{
                    backgroundImage: 'linear-gradient(to right, #00f0ff15 1px, transparent 1px), linear-gradient(to bottom, #00f0ff15 1px, transparent 1px)',
                    backgroundSize: '40px 40px',
                    perspective: '1000px',
                    transform: 'rotateX(60deg) scale(2.5)',
                    transformOrigin: 'top',
                    opacity: 0.3
                }} />
                {/* Glowing Orbs */}
                <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-[#bf00ff]/20 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-[#00f0ff]/15 rounded-full blur-[150px] mix-blend-screen" />
            </div>

            {/* Top HUD Controls */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-4 reveal-scale">
                <button onClick={toggleLang} className="relative group w-12 h-12 flex items-center justify-center bg-[#0a1128]/80 backdrop-blur-md border border-[#00f0ff]/30 text-[#00f0ff] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/10 to-transparent scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300" />
                    <span className="relative z-10 font-bold text-xs font-mono tracking-widest">{i18n.language.toUpperCase()}</span>
                    {/* Corner clips */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00f0ff]" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00f0ff]" />
                </button>
            </div>

            <div className="relative z-10 w-full flex flex-col items-center">
                
                {/* HERO SECTION */}
                <section className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden px-4">
                    <div className="text-center w-full max-w-6xl z-20">
                        {/* Status Badge */}
                        <div className="inline-flex items-center gap-3 mb-12 px-6 py-2 rounded-full border border-[#00f0ff]/40 bg-[#00f0ff]/5 backdrop-blur-md">
                            <div className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_10px_#00f0ff]" />
                            <span className="text-[#00f0ff] font-mono text-xs tracking-[0.2em] uppercase">
                                {i18n.language === 'vi' ? 'Hệ thống đang hoạt động' : 'System Online & Secure'}
                            </span>
                        </div>

                        {/* ================= NFT STYLE FAF TEXT ================= */}
                        <div className="relative flex justify-center items-center w-full mb-8 h-[180px] sm:h-[220px] md:h-[350px] overflow-visible group perspective-1000">
                            {/* Inner Glow */}
                            <div className="absolute inset-0 bg-[#00f0ff]/20 blur-[100px] rounded-full scale-110 group-hover:bg-[#bf00ff]/30 transition-colors duration-1000" />
                            
                            <svg width="0" height="0" className="absolute">
                                <defs>
                                    <clipPath id="faf-mask-nft">
                                        <text x="50%" y="75%" textAnchor="middle" className="text-[150px] sm:text-[200px] md:text-[300px] font-black" style={{ fontFamily: 'Impact, sans-serif' }}>FAF</text>
                                    </clipPath>
                                </defs>
                            </svg>
                            
                            <div className="relative w-full h-full flex justify-center items-center preserve-3d transition-transform duration-700 hover:rotate-y-12">
                                {/* The background video running over the text */}
                                <video 
                                    autoPlay 
                                    loop 
                                    muted 
                                    playsInline 
                                    className="w-full max-w-[1000px] h-full object-cover scale-110 opacity-90 mix-blend-screen" 
                                    style={{ clipPath: 'url(#faf-mask-nft)', filter: 'contrast(1.5) saturate(2) hue-rotate(-20deg)' }}
                                    src="https://cdn.pixabay.com/video/2019/11/17/29329-374668875_tiny.mp4" 
                                />
                                
                                {/* Outline Stroke */}
                                <svg className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_15px_rgba(0,240,255,0.8)]">
                                    <text x="50%" y="75%" textAnchor="middle" className="text-[150px] sm:text-[200px] md:text-[300px] font-black fill-transparent stroke-[#00f0ff] stroke-2" style={{ fontFamily: 'Impact, sans-serif' }}>FAF</text>
                                </svg>

                                {/* NFT Floating Particles */}
                                <div className="absolute inset-0 pointer-events-none overflow-visible">
                                     <div className="absolute top-[20%] left-[20%] w-3 h-3 bg-[#00f0ff] rounded-sm rotate-45 shadow-[0_0_20px_#00f0ff] animate-[bounce_3s_infinite]" />
                                     <div className="absolute top-[60%] right-[25%] w-2 h-2 bg-[#bf00ff] rounded-sm rotate-12 shadow-[0_0_15px_#bf00ff] animate-[ping_2s_infinite]" style={{ animationDelay: '1s' }} />
                                     <div className="absolute bottom-[30%] left-[45%] w-4 h-4 border border-[#00f0ff] rotate-45 shadow-[0_0_10px_#00f0ff] animate-[spin_4s_linear_infinite]" />
                                </div>
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight mb-6 uppercase">
                            {i18n.language === 'vi' ? 'Tiếp Năng Lượng Cho ' : 'Powering The '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#bf00ff] animate-pulse">
                                {i18n.language === 'vi' ? 'Sáng Tạo' : 'Creator Economy'}
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-[#94a3b8] max-w-3xl mx-auto mb-12 font-mono leading-relaxed border-l-2 border-[#00f0ff] pl-4 text-left inline-block">
                            {i18n.language === 'vi' ? 'Nền tảng phi tập trung kết nối chuyên gia Hậu Kỳ, Lồng Tiếng, VFX & Phụ Đề. Nâng tầm tài sản kỹ thuật số của bạn.' : 'The decentralized network connecting Video Editing, Voiceover, VFX & Subtitle experts. Elevate your digital assets.'}
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
                            <button onClick={() => navigate('/signup')} className="relative group bg-[#00f0ff]/10 border border-[#00f0ff] px-12 py-5 font-bold uppercase tracking-widest text-[#00f0ff] overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.2)] hover:shadow-[0_0_50px_rgba(0,240,255,0.4)] transition-all duration-300">
                                {/* Scanline effect */}
                                <div className="absolute inset-0 w-full h-[2px] bg-[#00f0ff]/50 -translate-y-full group-hover:animate-[scanline_2s_linear_infinite]" />
                                <div className="absolute inset-0 bg-[#00f0ff] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-300 ease-out z-0" />
                                <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                                    {i18n.language === 'vi' ? 'Kết Nối Ví / Bắt Đầu' : 'Connect & Start'}
                                </span>
                                {/* Tech Accents */}
                                <div className="absolute top-0 right-0 w-2 h-2 bg-[#00f0ff] m-1" />
                                <div className="absolute bottom-0 left-0 w-2 h-2 bg-[#00f0ff] m-1" />
                            </button>

                            <button onClick={() => navigate('/signin')} className="relative group bg-transparent border border-gray-700 px-12 py-5 font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:border-[#bf00ff] transition-all duration-300">
                                <span className="relative z-10">
                                    {t('home.unauth.login')}
                                </span>
                                <div className="absolute inset-0 border border-[#bf00ff] scale-[1.05] opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[inset_0_0_20px_rgba(191,0,255,0.3)]" />
                            </button>
                        </div>
                    </div>

                    {/* HUD Scroll Down */}
                    <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-60">
                        <span className="text-[10px] font-mono tracking-[0.3em] text-[#00f0ff] uppercase">Scroll</span>
                        <div className="w-[1px] h-16 bg-gradient-to-b from-[#00f0ff] to-transparent" />
                        <svg className="w-4 h-4 text-[#00f0ff] animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                </section>

                {/* SERVICES SECTION - NFT CARDS */}
                <section className="w-full py-32 px-6 lg:px-12 relative z-20">
                    <div className="max-w-7xl mx-auto reveal">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-gray-800 pb-8 relative">
                            <div className="absolute bottom-[-1px] left-0 w-32 h-[1px] bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]" />
                            <div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase mb-2">
                                    <span className="text-[#bf00ff]">{'// '}</span>
                                    {i18n.language === 'vi' ? 'Tài Sản Số' : 'Digital Assets'}
                                </h2>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-[#94a3b8] uppercase">
                                    {i18n.language === 'vi' ? 'Trạm Chế Tác' : 'Crafting Hub'}
                                </h2>
                            </div>
                            <p className="font-mono text-xs tracking-widest mt-6 md:mt-0 text-[#00f0ff] border border-[#00f0ff]/30 px-4 py-2 bg-[#00f0ff]/5">
                                MODULE_01 :: SERVICES_ONLINE
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10 perspective-1000">
                            {[
                                { id: '#A01', title: i18n.language === 'vi' ? 'Video Editing' : 'Video Editing', desc: i18n.language === 'vi' ? 'Cắt ghép chuyên sâu, Color Grading chuẩn điện ảnh.' : 'Pro cuts and cinematic color grading.', color: '#00f0ff' },
                                { id: '#A02', title: i18n.language === 'vi' ? 'Voice & Sub' : 'Voice & Sub', desc: i18n.language === 'vi' ? 'Lồng tiếng chất lượng cao, căn chỉnh phụ đề AI/Manual.' : 'High-fidelity dubbing and precision subtitling.', color: '#bf00ff' },
                                { id: '#A03', title: i18n.language === 'vi' ? 'VFX & Motion' : 'VFX & Motion', desc: i18n.language === 'vi' ? 'Tạo hiệu ứng hình ảnh, đồ họa chuyển động 2D/3D.' : 'Visual effects bridging reality and imagination.', color: '#fbbf24' }
                            ].map((s, i) => (
                                <div key={i} className="group relative bg-[#0a1128]/80 backdrop-blur-xl border border-gray-800 p-8 pt-12 cursor-pointer transition-all duration-500 hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] preserve-3d">
                                    {/* Glowing Border effect */}
                                    <div className="absolute inset-0 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ borderColor: s.color, boxShadow: `inset 0 0 20px ${s.color}20` }} />
                                    
                                    {/* Abstract Tech Background */}
                                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20" />

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-8">
                                            <div className="font-mono text-xs tracking-widest backdrop-blur-sm px-2 py-1" style={{ color: s.color, backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                                                {s.id}
                                            </div>
                                            <div className="w-8 h-8 rounded-full border flex items-center justify-center" style={{ borderColor: s.color }}>
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                                            </div>
                                        </div>
                                        
                                        <h3 className="text-2xl font-black uppercase text-white mb-4 tracking-wide group-hover:tracking-widest transition-all duration-300">
                                            {s.title}
                                        </h3>
                                        <p className="font-mono text-sm text-[#94a3b8] leading-relaxed mb-8">
                                            {s.desc}
                                        </p>

                                        <div className="w-full h-[1px] bg-gradient-to-r to-transparent mb-4" style={{ from: s.color }} />
                                        
                                        <div className="flex items-center text-xs font-mono font-bold uppercase transition-colors" style={{ color: s.color }}>
                                            {i18n.language === 'vi' ? 'Khám phá thuộc tính' : 'Explore Attributes'} <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                                        </div>
                                    </div>
                                    
                                    {/* Hexagon tech accent */}
                                    <svg className="absolute bottom-4 right-4 w-12 h-12 opacity-10 group-hover:opacity-30 group-hover:rotate-90 transition-all duration-700" style={{ fill: s.color }} viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* HOW IT WORKS SECTION - PROTOCOL SEQUENCE */}
                <section className="w-full py-32 px-6 lg:px-12 relative z-20 bg-[#0a1128]">
                    <div className="max-w-7xl mx-auto reveal-scale">
                        <div className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-widest mb-4">
                                OPERATING <span className="text-[#00f0ff]">PROTOCOL</span>
                            </h2>
                            <p className="font-mono text-[#94a3b8] uppercase tracking-widest text-sm">
                                {i18n.language === 'vi' ? 'Quy Trình Hoạt Động Cốt Lõi' : 'Core Operational Sequence'}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-4 gap-6 relative">
                            {/* Connecting line behind steps */}
                            <div className="hidden md:block absolute top-[60px] left-10 right-10 h-[2px] bg-gradient-to-r from-[#00f0ff]/20 via-[#bf00ff]/50 to-[#00f0ff]/20 z-0" />

                            {[
                                { step: '01', title: i18n.language === 'vi' ? 'Khởi Tạo Contract' : 'Initialize Contract', desc: i18n.language === 'vi' ? 'Khách hàng đăng tải dự án (Video, Voice, VFX) với ngân sách rõ ràng.' : 'Clients post projects (Video, Voice, VFX) with clear budget parameters.', icon: '📝' },
                                { step: '02', title: i18n.language === 'vi' ? 'Khớp Lệnh Node' : 'Node Matching', desc: i18n.language === 'vi' ? 'Hệ thống gợi ý Freelancer phù hợp nhất hoặc Freelancer tự ứng tuyển.' : 'System suggests optimal Freelancers or Freelancers self-apply for gigs.', icon: '⚡' },
                                { step: '03', title: i18n.language === 'vi' ? 'Ký Quỹ Escrow' : 'Secure Escrow', desc: i18n.language === 'vi' ? 'Tiền được khóa an toàn trên hệ thống Escrow trong suốt thời gian làm việc.' : 'Funds are securely locked in the Escrow protocol during active development.', icon: '🔒' },
                                { step: '04', title: i18n.language === 'vi' ? 'Chuyển Giao & Mint' : 'Deliver & Release', desc: i18n.language === 'vi' ? 'Bàn giao sản phẩm, khách hàng nghiệm thu và hệ thống nhả tiền tự động.' : 'Assets delivered, client approves, and smart contract releases funds.', icon: '💎' }
                            ].map((s, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                                    {/* Step Hexagon Number */}
                                    <div className="w-24 h-24 mb-8 relative flex flex-col justify-center items-center bg-[#050810] border-2 border-gray-800 group-hover:border-[#00f0ff] transition-colors duration-500 transform group-hover:-translate-y-2 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                                        {/* Corner accents */}
                                        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity" />
                                        
                                        <span className="text-3xl filter grayscale group-hover:grayscale-0 transition-all mb-1">{s.icon}</span>
                                        <span className="font-mono text-xs font-bold text-[#00f0ff]">STEP {s.step}</span>
                                    </div>

                                    <h3 className="text-xl font-black text-white uppercase mb-4 tracking-wide group-hover:text-[#00f0ff] transition-colors">
                                        {s.title}
                                    </h3>
                                    <p className="font-mono text-sm text-[#94a3b8] px-4 max-w-[250px]">
                                        {s.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PLATFORM STATS SECTION - NETWORK STATUS */}
                <section className="w-full py-24 px-6 relative z-20 border-y border-[#bf00ff]/20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat overflow-hidden text-center">
                    <div className="absolute inset-0 bg-[#050810]/95 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/5 via-transparent to-[#bf00ff]/5" />

                    <div className="relative z-10 max-w-6xl mx-auto flex flex-col md:flex-row justify-around items-center gap-12">
                        {[
                            { value: '1.2M+', label: i18n.language === 'vi' ? 'Giao Dịch Đảm Bảo' : 'Secured Volume', color: '#00f0ff' },
                            { value: '8,500+', label: i18n.language === 'vi' ? 'Node Đang Hoạt Động' : 'Active Nodes', color: '#bf00ff' },
                            { value: '99.9%', label: i18n.language === 'vi' ? 'Uptime Mạng Lưới' : 'Network Uptime', color: '#fbbf24' },
                            { value: '42K+', label: i18n.language === 'vi' ? 'Sản Phẩm Đã Bàn Giao' : 'Assets Delivered', color: '#10b981' }
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center group">
                                <div className="text-5xl md:text-6xl font-black mb-2 animate-pulse" style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}60` }}>
                                    {stat.value}
                                </div>
                                <div className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-[#94a3b8] group-hover:text-white transition-colors">
                                    {stat.label}
                                </div>
                                <div className="w-8 h-[2px] mt-4 transition-all duration-300 group-hover:w-full" style={{ backgroundColor: stat.color }} />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ROADMAP SECTION - TECH TREE */}
                <section className="w-full py-32 px-6 lg:px-12 relative z-20 bg-[#050810] overflow-hidden border-t border-gray-900">
                    {/* Background Network lines */}
                    <div className="absolute inset-0 z-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #00f0ff 0%, transparent 1px)', backgroundSize: '50px 50px' }} />

                    <div className="max-w-6xl mx-auto reveal-scale relative z-10">
                        <div className="mb-20 text-center">
                            <h2 className="text-5xl md:text-7xl font-black text-white tracking-widest uppercase mb-4" style={{ textShadow: '0 0 20px rgba(191,0,255,0.5)' }}>
                                ARCHITECTURE <span className="text-[#bf00ff]">MAP</span>
                            </h2>
                            <p className="font-mono text-[#00f0ff] uppercase tracking-widest text-sm">Deployment Phases</p>
                        </div>

                        <div className="relative border-l border-[#00f0ff]/20 ml-4 md:ml-[50%]">
                            {/* Moving packet on the line (CSS animation would be complex here, pseudo-element used instead in global css if needed, simulating it static for now) */}
                            <div className="absolute top-0 bottom-0 left-[-1px] w-[2px] bg-gradient-to-b from-[#00f0ff] to-transparent h-1/3 animate-pulse" />

                            {[
                                { stat: 'Q1', title: 'Genesis Start', text: i18n.language==='vi'?'Khởi chạy nền tảng FAF Core, tập trung lõi dịch vụ Video Editing và UI/UX Cyberpunk.':'Launch FAF Core platform, focusing on Video Editing services and Cyberpunk UI/UX.', active: true, color: '#00f0ff' },
                                { stat: 'Q2', title: 'Mediation Hub', text: i18n.language==='vi'?'Hệ thống quản lý xung đột, Manager giám sát và trọng tài 3 bên chính thức hoạt động.':'Official launch of Dispute System, Manager oversight, and 3-way arbitration.', active: true, color: '#bf00ff' },
                                { stat: 'Q3', title: 'AI Integrations', text: i18n.language==='vi'?'Tích hợp AI tạo phụ đề tự động (Speech-to-Text) và phân tích rủi ro hợp đồng thông minh.':'Auto-subtitle AI integration (Speech-to-Text) and smart contract risk analysis.', active: false, color: '#475569' },
                                { stat: 'Q4', title: 'Global Escrow', text: i18n.language==='vi'?'Mở rộng cổng thanh toán quốc tế và hệ thống Escrow đa tiền tệ bảo mật cao.':'Expansion of global payment gateways and high-security multi-currency Escrow.', active: false, color: '#475569' },
                                { stat: 'Q1+', title: 'Metaverse Nexus', text: i18n.language==='vi'?'Tích hợp NFT tài sản số và Marketplace dành riêng cho các tác phẩm VFX độc quyền.':'Integrate digital asset NFTs and a dedicated Marketplace for exclusive VFX works.', active: false, color: '#475569' },
                            ].map((node, i) => (
                                <div key={i} className={`relative flex items-center mb-16 last:mb-0 group reveal-${i % 2 === 0 ? 'left' : 'right'}`}>
                                    {/* Desktop alignment */}
                                    <div className={`hidden md:block absolute w-[calc(100%-60px)] ${i % 2 === 0 ? 'right-[60px] text-right' : 'left-[60px] text-left'} top-1/2 -translate-y-1/2`}>
                                        <div className="font-mono text-xs tracking-widest mb-1" style={{ color: node.color }}>{node.stat}</div>
                                        <h4 className="text-2xl font-black uppercase tracking-wide text-white group-hover:tracking-widest transition-all duration-300 shadow-sm">{node.title}</h4>
                                        <div className={`mt-3 font-mono text-sm max-w-sm inline-block p-4 border border-gray-800 bg-[#0a1128]/50 backdrop-blur-sm group-hover:border-[${node.color}]/50 transition-colors ${i % 2 === 0 ? 'ml-auto text-right' : 'text-left'}`}>
                                            <p className={node.active ? "text-[#94a3b8]" : "text-gray-600"}>{node.text}</p>
                                        </div>
                                    </div>

                                    {/* Mobile alignment */}
                                    <div className="md:hidden ml-12 pb-4">
                                        <div className="font-mono text-xs tracking-widest mb-1" style={{ color: node.color }}>{node.stat}</div>
                                        <h4 className="text-xl font-black uppercase text-white mb-2">{node.title}</h4>
                                        <p className={`font-mono text-sm p-4 border border-gray-800 bg-[#0a1128]/50 ${node.active ? "text-[#94a3b8]" : "text-gray-600"}`}>{node.text}</p>
                                    </div>

                                    {/* HUD Node Box */}
                                    <div className={`absolute left-[-20px] w-10 h-10 bg-[#050810] border-2 rotate-45 flex items-center justify-center transition-all duration-500 z-10 group-hover:scale-110 shadow-[0_0_15px_rgba(0,0,0,0.5)]`} style={{ borderColor: node.active ? node.color : '#334155' }}>
                                        <div className="w-3 h-3 bg-transparent border rotate-45" style={{ borderColor: node.active ? node.color : '#334155', backgroundColor: node.active ? `${node.color}40` : 'transparent' }} />
                                    </div>
                                    
                                    {/* Connecting horizontal line to HUD node for desktop */}
                                    <div className={`hidden md:block absolute w-[40px] h-[1px] ${i % 2 === 0 ? 'right-[20px]' : 'left-[20px]'} top-1/2`} style={{ backgroundColor: node.active ? `${node.color}50` : '#334155' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
                
                {/* FINAL CTA - SECURE PANEL */}
                <section className="w-full py-32 px-6 relative z-20 flex flex-col items-center border-t border-[#00f0ff]/20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat overflow-hidden">
                    <div className="absolute inset-0 bg-[#0a1128]/95 mix-blend-multiply" />
                    
                    {/* Glowing background accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] h-[300px] bg-[#00f0ff]/5 blur-[100px] rounded-full" />
                    
                    <div className="relative z-10 p-1 md:p-px bg-gradient-to-b from-[#00f0ff] to-[#bf00ff] rounded-sm transform hover:scale-[1.02] transition-transform duration-500 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
                        <div className="bg-[#050810] p-12 md:p-24 flex flex-col items-center text-center">
                            <h2 className="text-4xl md:text-6xl font-black uppercase mb-6 text-white tracking-widest">
                                {i18n.language === 'vi' ? 'Sẵn sàng Khởi Chạy?' : 'Ready to Launch?'}
                            </h2>
                            <p className="font-mono text-[#94a3b8] max-w-lg mb-12">
                                {i18n.language === 'vi' ? 'Truy cập vào mạng lưới tài nguyên sáng tạo phi tập trung FAF.' : 'Gain access to the FAF decentralized creative resource network.'}
                            </p>
                            
                            <button onClick={() => navigate('/signup')} className="relative group bg-[#00f0ff] text-black px-12 py-4 font-black uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300">
                                {i18n.language === 'vi' ? 'Xác Nhận Tham Gia [Y]' : 'Confirm Entry [Y]'}
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative z-10 mt-16 text-[10px] font-mono text-[#475569] uppercase flex flex-col md:flex-row items-center justify-center gap-8">
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#00f0ff] animate-pulse"/> END-TO-END ENCRYPTED ESCROW</span>
                        <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#bf00ff] animate-pulse"/> VERIFIED NODE EXPERTS</span>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default HomePage;

