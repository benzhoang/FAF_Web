import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';
import { useAuth } from '../auth/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useTheme } from '../contexts/ThemeContext';
import { chatApi } from '../api/chat.api';
import { notificationApi } from '../api/notification.api';
import { useTranslation } from 'react-i18next';

/* ─── helpers ─── */
const getInitials = (u) => {
    if (u?.full_name) return u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    if (u?.email) return u.email[0].toUpperCase();
    return 'U';
};
const timeAgo = (date) => {
    const s = Math.floor((Date.now() - new Date(date)) / 1000);
    if (s < 60)  return `${s}s`;
    if (s < 3600) return `${Math.floor(s/60)}m`;
    if (s < 86400) return `${Math.floor(s/3600)}h`;
    return `${Math.floor(s/86400)}d`;
};

/* ══════════════════════════════════════════════════════
   MESSAGES DROPDOWN  (Cyberpunk-style)
══════════════════════════════════════════════════════ */
const MessagesDropdown = ({ onClose, navigate, user }) => {
    const [convs, setConvs]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]       = useState('all'); // 'all' | 'unread'

    useEffect(() => {
        chatApi.getConversations()
            .then(r => setConvs(r?.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    const filtered = tab === 'unread' ? convs.filter(c => c.unread_count > 0) : convs;

    const isManager = user?.role === 'manager';
    const accentColor = isManager ? 'emerald' : 'cyan';
    const accentShadow = isManager ? 'rgba(16,185,129,0.15)' : 'rgba(6,182,212,0.15)';

    return (
        <div className={`absolute right-0 top-full mt-2 w-[360px] bg-[#090e17]/95 backdrop-blur-xl rounded-xl shadow-[0_0_30px_${accentShadow}] border ${isManager ? 'border-emerald-500/20' : 'border-cyan-500/20'} z-50 overflow-hidden animate-[dropIn_.18s_ease-out]`}
             style={{ transformOrigin: 'top right' }}>
            
            {/* Top neon line */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isManager ? 'via-emerald-400/50' : 'via-cyan-400/50'} to-transparent`} />

            {/* Header */}
            <div className="px-5 pt-5 pb-2">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                    <h2 className={`text-[14px] font-black ${isManager ? 'text-emerald-500 text-shadow-glow-emerald' : 'text-cyan-500 text-shadow-glow-cyan'} uppercase font-mono tracking-widest flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                        SYS.COMMS
                    </h2>
                    <button
                        onClick={() => { navigate('/messages'); onClose(); }}
                        className={`w-8 h-8 rounded shrink-0 bg-[#02040a] border ${isManager ? 'border-emerald-500/30 hover:border-emerald-400 hover:bg-emerald-900/30 text-emerald-400' : 'border-cyan-500/30 hover:border-cyan-400 hover:bg-cyan-900/30 text-cyan-400'} flex items-center justify-center transition-colors group`}
                        title="OPEN_TERMINAL"
                    >
                        <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                        </svg>
                    </button>
                </div>

                {/* Search */}
                <div className="relative mb-3 group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <svg className={`w-4 h-4 text-slate-500 ${isManager ? 'group-focus-within:text-emerald-400' : 'group-focus-within:text-cyan-400'} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                        </svg>
                    </div>
                    <input
                        placeholder="> QUERY_COMM_LINKS..."
                        className={`w-full pl-9 pr-4 py-2 bg-[#02040a] border border-slate-700 ${isManager ? 'focus:border-emerald-500/50 focus:ring-emerald-500/20' : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'} rounded text-xs font-mono text-slate-300 focus:outline-none focus:ring-1 placeholder-slate-600 uppercase tracking-wide transition-all`}
                    />
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {[{ id: 'all', label: 'ALL_NODES' }, { id: 'unread', label: 'UNREAD_PKTS' }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-1.5 rounded text-[10px] font-black font-mono tracking-widest uppercase transition-colors border ${
                                tab === t.id
                                    ? isManager 
                                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'bg-cyan-900/30 text-cyan-400 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                    : 'text-slate-500 border-transparent hover:border-slate-700 hover:text-slate-300'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Conversation list */}
            <div className="max-h-[340px] overflow-y-auto custom-scrollbar">
                {loading ? (
                    <div className="space-y-1 px-2 py-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                                <div className="w-10 h-10 border border-cyan-900/50 bg-[#02040a] rounded flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-2.5 bg-cyan-950/50 rounded w-1/2" />
                                    <div className="h-2 bg-slate-800 rounded w-3/4" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center">
                        <svg className="w-8 h-8 text-slate-600 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        <p className="text-slate-500 text-[10px] font-black font-mono tracking-widest uppercase">NO_ACTIVE_LINKS</p>
                    </div>
                ) : (
                    <div className="py-1 px-2">
                        {filtered.map(conv => {
                            const isUnread = conv.unread_count > 0;
                            const name = conv.other_user_name || conv.name || 'UNKNOWN_NODE';
                            const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => { navigate('/messages'); onClose(); }}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 ${isManager ? 'hover:bg-emerald-900/10' : 'hover:bg-cyan-900/10'} transition-colors rounded border-l-2 mb-1 group text-left ${
                                        isUnread 
                                            ? isManager ? 'border-emerald-400 bg-emerald-950/20' : 'border-cyan-400 bg-cyan-950/20' 
                                            : 'border-transparent hover:border-slate-700'
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <div className={`w-10 h-10 rounded border flex items-center justify-center text-white font-black text-xs font-mono overflow-hidden ${
                                            isUnread 
                                                ? isManager ? 'bg-emerald-950 border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-cyan-950 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                                                : 'bg-[#02040a] border-slate-700'
                                        }`}>
                                            {conv.other_user_avatar
                                                ? <img src={conv.other_user_avatar} alt={name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                : initials}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-1">
                                            <p className={`text-xs truncate font-mono uppercase tracking-wide ${isUnread ? isManager ? 'font-black text-emerald-300' : 'font-black text-cyan-300' : 'font-bold text-slate-300'}`}>
                                                {name}
                                            </p>
                                            <span className="text-[9px] font-mono text-slate-500 flex-shrink-0 tracking-widest">
                                                {conv.last_message_at ? timeAgo(conv.last_message_at) : ''}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between gap-1 mt-1">
                                            <p className={`text-[10px] font-mono truncate ${isUnread ? isManager ? 'text-emerald-100' : 'text-cyan-100' : 'text-slate-500'}`}>
                                                {conv.last_message ? `> ${conv.last_message}` : '> AWAITING_INPUT'}
                                            </p>
                                            {isUnread && (
                                                <span className={`w-1.5 h-1.5 rounded-full ${isManager ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,1)]' : 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]'} flex-shrink-0 animate-pulse`} />
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 bg-[#02040a]/50 p-2">
                <button
                    onClick={() => { navigate('/messages'); onClose(); }}
                    className={`w-full py-2.5 text-center text-[10px] font-black font-mono tracking-widest uppercase ${isManager ? 'text-emerald-500 hover:text-emerald-300 hover:bg-emerald-950/30' : 'text-cyan-500 hover:text-cyan-300 hover:bg-cyan-950/30'} rounded transition-colors`}
                >
                    INITIALIZE_FULL_TERMINAL
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   NOTIFICATIONS DROPDOWN  (Cyberpunk-style)
══════════════════════════════════════════════════════ */
const NotificationsDropdown = ({ onClose, navigate, onMarkAllRead, user }) => {
    const [notifs, setNotifs]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab]         = useState('all');

    const fetchNotifs = useCallback(() => {
        notificationApi.getNotifications()
            .then(r => setNotifs(r?.data || []))
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => { fetchNotifs(); }, [fetchNotifs]);

    const handleMarkAll = async () => {
        try {
            await notificationApi.markAllAsRead();
            setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
            onMarkAllRead?.();
        } catch {}
    };

    const handleClick = async (n) => {
        if (!n.is_read) {
            await notificationApi.markAsRead(n.id).catch(() => {});
            setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, is_read: true } : x));
        }

        let path = '';
        const data = n.data || {};
        
        switch (n.type) {
            case 'JOB_MATCH':
                path = '/find-work';
                break;
            case 'PROPOSAL_RECEIVED':
                path = '/task-owner/jobs';
                break;
            case 'PROPOSAL_ACCEPTED':
            case 'CONTRACT_CREATED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/dashboard';
                break;
            case 'CONTRACT_SIGNED':
            case 'CONTRACT_ACTIVATED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'MILESTONE_SUBMITTED':
            case 'CHECKPOINT_SUBMITTED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'MILESTONE_APPROVED':
            case 'CHECKPOINT_APPROVED':
            case 'PAYMENT_RELEASED':
                path = user?.role === 'employer' ? '/task-owner/contracts' : '/my-job';
                break;
            case 'DISPUTE_RAISED':
            case 'NEW_MESSAGE':
                path = '/messages';
                break;
            default:
                break;
        }

        if (path) navigate(path);
        else if (n.link) navigate(n.link);

        onClose();
    };

    const today    = notifs.filter(n => new Date(n.created_at) > new Date(Date.now() - 86400000));
    const earlier  = notifs.filter(n => new Date(n.created_at) <= new Date(Date.now() - 86400000));
    const filtered = tab === 'unread' ? notifs.filter(n => !n.is_read) : notifs;
    const todayF   = tab === 'unread' ? filtered : today;
    const earlierF = tab === 'unread' ? [] : earlier;

    const isManager = user?.role === 'manager';
    const accentPrefix = isManager ? 'emerald' : 'indigo';
    const accentShadow = isManager ? 'rgba(16,185,129,0.3)' : 'rgba(99,102,241,0.3)';
    const dotShadow = isManager ? 'rgba(16,185,129,1)' : 'rgba(129,140,248,1)';

    const NotifItem = ({ n }) => (
        <button
            onClick={() => handleClick(n)}
            className={`w-full flex items-start gap-3 px-3 py-2.5 hover:bg-${accentPrefix}-900/10 transition-colors rounded border-l-2 mb-1 group text-left ${
                !n.is_read ? `border-${accentPrefix}-400 bg-${accentPrefix}-950/20` : 'border-transparent hover:border-slate-700'
            }`}
        >
            {/* Icon / Avatar */}
            <div className="relative flex-shrink-0 mt-0.5">
                <div className={`w-8 h-8 rounded border flex items-center justify-center text-sm overflow-hidden ${
                    !n.is_read ? `bg-${accentPrefix}-950 border-${accentPrefix}-500 shadow-[0_0_10px_${accentShadow}] text-${accentPrefix}-300` : 'bg-[#02040a] border-slate-700 text-slate-500'
                }`}>
                    {n.icon || '(!)'}
                </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
                <p className={`text-[11px] font-mono leading-tight uppercase tracking-wide ${!n.is_read ? `text-${accentPrefix}-100 font-bold` : 'text-slate-400'}`}>
                    {n.message || n.title || 'SYS.LOGS_RECEIVED'}
                </p>
                <p className={`text-[9px] mt-1 font-mono tracking-widest ${!n.is_read ? `text-${accentPrefix}-400 font-bold` : 'text-slate-600'}`}>
                    T-{timeAgo(n.created_at)}
                </p>
            </div>

            {/* Unread dot */}
            {!n.is_read && (
                <div className="flex-shrink-0 mt-1">
                    <div className={`w-1.5 h-1.5 rounded-full bg-${accentPrefix}-400 shadow-[0_0_8px_${dotShadow}] animate-pulse`} />
                </div>
            )}
        </button>
    );

    const containerShadow = isManager ? 'rgba(16,185,129,0.15)' : 'rgba(99,102,241,0.15)';

    return (
        <div className={`absolute right-0 top-full mt-2 w-[380px] bg-[#090e17]/95 backdrop-blur-xl rounded-xl shadow-[0_0_30px_${containerShadow}] border ${isManager ? 'border-emerald-500/20' : 'border-indigo-500/20'} z-50 overflow-hidden animate-[dropIn_.18s_ease-out]`}
             style={{ transformOrigin: 'top right' }}>
            
            {/* Top neon line */}
            <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${isManager ? 'via-emerald-400/50' : 'via-indigo-400/50'} to-transparent`} />

            {/* Header */}
            <div className="px-5 pt-5 pb-2">
                <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-3">
                    <h2 className={`text-[14px] font-black ${isManager ? 'text-emerald-500 text-shadow-glow-emerald' : 'text-indigo-500 text-shadow-glow-indigo'} uppercase font-mono tracking-widest flex items-center gap-2`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                        SYS.LOGS
                    </h2>
                    <button
                        onClick={handleMarkAll}
                        className={`text-[9px] font-black font-mono tracking-widest uppercase text-slate-500 ${isManager ? 'hover:text-emerald-400' : 'hover:text-indigo-400'} transition-colors`}
                    >
                        ACKNOWLEDGE_ALL
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {[{ id: 'all', label: 'ALL_EVENTS' }, { id: 'unread', label: 'CRITICAL' }].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setTab(t.id)}
                            className={`px-3 py-1.5 rounded text-[10px] font-black font-mono tracking-widest uppercase transition-colors border ${
                                tab === t.id
                                    ? isManager
                                        ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : 'bg-indigo-900/30 text-indigo-400 border-indigo-500/50 shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                    : 'text-slate-500 border-transparent hover:border-slate-700 hover:text-slate-300'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="max-h-[360px] overflow-y-auto custom-scrollbar px-2 py-1">
                {loading ? (
                    <div className="space-y-1 py-2">
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                                <div className="w-8 h-8 border border-indigo-900/50 bg-[#02040a] rounded flex-shrink-0" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-2.5 bg-indigo-950/50 rounded w-4/5" />
                                    <div className="h-2 bg-slate-800 rounded w-2/5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="py-10 text-center flex flex-col items-center">
                        <svg className={`w-8 h-8 ${isManager ? 'text-emerald-900/50' : 'text-slate-600'} mb-3`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        <p className="text-slate-500 text-[10px] font-black font-mono tracking-widest uppercase">LOGS_CLEAR</p>
                    </div>
                ) : (
                    <>
                        {todayF.length > 0 && (
                            <>
                                <p className="px-3 py-2 text-[9px] font-black font-mono tracking-widest uppercase text-slate-600">CURRENT_CYCLE</p>
                                {todayF.map(n => <NotifItem key={n.id} n={n} />)}
                            </>
                        )}
                        {earlierF.length > 0 && (
                            <>
                                <div className="flex items-center justify-between px-3 py-2 mt-2 border-t border-slate-800">
                                    <p className="text-[9px] font-black font-mono tracking-widest uppercase text-slate-600">PREV_CYCLES</p>
                                </div>
                                {earlierF.map(n => <NotifItem key={n.id} n={n} />)}
                            </>
                        )}
                    </>
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-slate-800 bg-[#02040a]/50 p-2">
                <button
                    onClick={() => { navigate('/notifications'); onClose(); }}
                    className={`w-full py-2.5 text-center text-[10px] font-black font-mono tracking-widest uppercase ${isManager ? 'text-emerald-500 hover:text-emerald-300 hover:bg-emerald-950/30' : 'text-indigo-500 hover:text-indigo-300 hover:bg-indigo-950/30'} rounded transition-colors`}
                >
                    ACCESS_FULL_ARCHIVE
                </button>
            </div>
        </div>
    );
};

/* ══════════════════════════════════════════════════════
   NAVBAR
══════════════════════════════════════════════════════ */
const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount, unreadNotifications, setUnreadNotifications } = useChatContext();
    const [openPanel, setOpenPanel] = useState(null); // 'messages' | 'notifications' | 'profile' | null
    const navigate = useNavigate();
    const panelRef = useRef(null);

    // --- State for Language & Theme ---
    const { theme, toggleTheme } = useTheme();
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'vi');
    const { t, i18n } = useTranslation();

    useEffect(() => {
        localStorage.setItem('lang', lang);
        i18n.changeLanguage(lang);
    }, [lang, i18n]);

    const toggleLang = () => setLang(prev => prev === 'vi' ? 'en' : 'vi');

    /* close on outside click */
    useEffect(() => {
        if (!openPanel) return;
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpenPanel(null);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [openPanel]);

    const toggle = (panel) => setOpenPanel(prev => prev === panel ? null : panel);
    const close  = () => setOpenPanel(null);

    const handleLogout = () => {
        logout();
        close();
        navigate('/');
    };

    const IconBtn = ({ id, badge = 0, children, title, color = 'cyan' }) => {
        const active = openPanel === id;
        const colorClasses = {
            cyan: {
                active: 'bg-cyan-900/30 text-cyan-400 border border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
                badge: 'bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
            },
            indigo: {
                active: 'bg-indigo-900/30 text-indigo-400 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]',
                badge: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]'
            },
            emerald: {
                active: 'bg-emerald-900/30 text-emerald-400 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]',
                badge: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
            }
        };

        return (
            <button
                title={title}
                onClick={() => toggle(id)}
                className={`relative w-9 h-9 rounded flex items-center justify-center transition-all ${
                    active
                        ? colorClasses[color].active
                        : 'bg-[#02040a] border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-slate-200'
                }`}
            >
                {children}
                {badge > 0 && (
                    <span className={`absolute -top-1.5 -right-1.5 flex items-center justify-center text-[#02040a] text-[9px] font-black font-mono h-[18px] min-w-[18px] px-1 rounded border-2 border-[#090e17] ${colorClasses[color].badge}`}>
                        {badge > 9 ? '9+' : badge}
                    </span>
                )}
            </button>
        );
    };

    const isManager = user?.role === 'manager';
    const accentColor = isManager ? 'emerald' : 'cyan';

    return (
        <nav className="sticky top-0 z-50 w-full border-b" style={{ background: 'rgba(2,6,23,0.95)', borderColor: isManager ? 'rgba(16,185,129,0.15)' : 'rgba(6,182,212,0.15)', backdropFilter: 'blur(12px)' }} ref={panelRef}>
            {/* Top scanning line for extra cyberpunk feel */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] ${isManager ? 'bg-gradient-to-r from-emerald-500/0 via-emerald-400/50 to-emerald-500/0' : 'bg-gradient-to-r from-cyan-500/0 via-cyan-400/50 to-cyan-500/0'} opacity-50`} />
            
            <div className="max-w-[1300px] mx-auto px-4 h-[56px] flex items-center justify-between gap-4">

                {/* ── LEFT: Logo + Search ── */}
                <div className="flex items-center gap-4 flex-shrink-0">
                    <NavLink to="/" aria-label="Home" className="relative flex items-center group">
                        <div className={`absolute inset-0 rounded ${isManager ? 'group-hover:bg-emerald-500/20' : 'group-hover:bg-cyan-500/20'} blur transition-all duration-300`} />
                        <img
                            src={FAFLogo}
                            alt="FAF"
                            className="relative h-7 w-auto object-contain transition-all duration-300"
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                        <span className={`ml-2 font-black font-mono text-[14px] tracking-widest text-white uppercase ${isManager ? 'group-hover:text-emerald-400' : 'group-hover:text-cyan-400'} transition-colors`}>FAF<span className={`${isManager ? 'text-emerald-500' : 'text-cyan-500'}`}>_</span>NET</span>
                    </NavLink>


                    <div className="hidden lg:block relative group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <svg className={`h-3.5 w-3.5 text-slate-600 ${isManager ? 'group-focus-within:text-emerald-400' : 'group-focus-within:text-cyan-400'} transition-colors`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                            </svg>
                        </div>
                        <input
                            className={`w-[240px] pl-9 pr-3 py-1.5 rounded bg-[#02040a] border border-slate-800 text-[11px] placeholder-slate-600 focus:outline-none ${isManager ? 'focus:border-emerald-500/50 focus:ring-emerald-500/20' : 'focus:border-cyan-500/50 focus:ring-cyan-500/20'} focus:ring-1 transition-all font-mono text-slate-300 uppercase tracking-widest`}
                            placeholder={t('navbar.search_placeholder')}
                            type="search"
                        />
                    </div>
                </div>

                {/* ── CENTER: Nav tabs ── */}
                {user && (
                    <div className="flex items-center h-full flex-1 justify-center gap-1 sm:gap-2">
                        {[
                            { to: '/', label: t('navbar.home'), exact: true,
                              icon: <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
                            },
                            ...(isManager ? [
                                { to: '/manager/management/jobs', label: 'DASHBOARD',
                                  icon: <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                                },
                            ] : user.role !== 'employer' ? [
                                { to: '/find-work', label: t('navbar.market'),
                                  icon: <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                },
                                { to: '/dashboard', label: t('navbar.dash'),
                                  icon: <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                                },
                            ] : [
                                { to: '/task-owner', label: t('navbar.cmd_cntr'),
                                  icon: <svg className="w-5 h-5 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                                },
                            ]),
                        ]
                        .map(({ to, label, exact, icon }) => {
                            const loc = window.location.pathname;
                            const active = exact ? loc === to : (to === '/manager/management/jobs' ? loc.startsWith('/manager') : loc.startsWith(to) && to !== '/');
                            return (
                                <NavLink
                                    key={to}
                                    to={to}
                                    className={`hidden sm:flex flex-col items-center justify-center px-4 h-full border-b-2 transition-all font-mono ${
                                        active
                                            ? isManager 
                                                ? 'border-emerald-400 text-emerald-400 bg-emerald-900/10 shadow-[inset_0_-10px_20px_-15px_rgba(16,185,129,0.3)]'
                                                : 'border-cyan-400 text-cyan-400 bg-cyan-900/10 shadow-[inset_0_-10px_20px_-15px_rgba(6,182,212,0.3)]'
                                            : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/30'
                                    }`}
                                >
                                    {icon}
                                    <span className="text-[9px] font-black tracking-widest hidden xl:block">{label}</span>
                                </NavLink>
                            );
                        })}
                    </div>
                )}

                {/* ── RIGHT: Action buttons ── */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 relative">
                    {user ? (
                        <>
                            {/* Language Switcher */}
                            <button
                                onClick={toggleLang}
                                title={lang === 'vi' ? 'Chuyển sang Tiếng Anh' : 'Switch to Vietnamese'}
                                className="w-9 h-9 flex items-center justify-center rounded bg-[#02040a] border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 font-mono text-[10px] font-black transition-all"
                            >
                                {lang === 'vi' ? 'VI' : 'EN'}
                            </button>

                            {/* Theme Switcher */}
                            <button
                                onClick={toggleTheme}
                                title={theme === 'dark' ? 'Chế độ Sáng' : 'Chế độ Tối'}
                                className="w-9 h-9 flex items-center justify-center rounded bg-[#02040a] border border-slate-800 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-400 transition-all"
                            >
                                {theme === 'dark' ? (
                                    <svg className="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                ) : (
                                    <svg className="w-4 h-4 mb-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                                )}
                            </button>

                             {/* Messages */}
                            <div className="relative">
                                <IconBtn id="messages" badge={unreadCount} title="SYS.COMMS" color={accentColor}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </IconBtn>
                                {openPanel === 'messages' && (
                                    <MessagesDropdown onClose={close} navigate={navigate} user={user} />
                                )}
                            </div>

                             {/* Notifications */}
                            <div className="relative">
                                <IconBtn id="notifications" badge={unreadNotifications} title="SYS.LOGS" color={isManager ? 'emerald' : 'indigo'}>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                </IconBtn>
                                {openPanel === 'notifications' && (
                                    <NotificationsDropdown
                                        onClose={close}
                                        navigate={navigate}
                                        onMarkAllRead={() => setUnreadNotifications(0)}
                                        user={user}
                                    />
                                )}
                            </div>

                            <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block"></div>

                            {/* Profile */}
                            <div className="relative">
                                <button
                                    onClick={() => toggle('profile')}
                                    className={`relative w-9 h-9 flex items-center justify-center transition-all group/navavt`}
                                >
                                     {/* Tech Frame Background */}
                                    <div className={`absolute inset-0 rounded border transition-all duration-300 ${
                                        openPanel === 'profile' 
                                            ? isManager
                                                ? 'border-emerald-400 bg-emerald-950/20 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110'
                                                : 'border-cyan-400 bg-cyan-950/20 shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110' 
                                            : isManager
                                                ? 'border-slate-700 bg-[#02040a] group-hover/navavt:border-emerald-500/50'
                                                : 'border-slate-700 bg-[#02040a] group-hover/navavt:border-cyan-500/50'
                                    }`}></div>

                                    <div className={`relative w-7 h-7 rounded overflow-hidden flex items-center justify-center ${isManager ? 'text-emerald-400' : 'text-cyan-400'} font-black font-mono text-[10px] transition-all ${
                                        openPanel === 'profile' ? 'scale-110' : ''
                                    }`}>
                                        {user?.avatar_url
                                            ? <img src={user.avatar_url} alt="av" className="w-full h-full object-cover mix-blend-luminosity hover:mix-blend-normal transition-all duration-500" />
                                            : getInitials(user)}
                                    </div>
                                    
                                    {/* Status Dot */}
                                    <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border-2 border-[#090e17] shadow-[0_0_5px_rgba(16,185,129,0.8)] z-10 animate-pulse"></div>
                                </button>

                                 {openPanel === 'profile' && (
                                    <div className={`absolute right-0 top-full mt-2 w-[240px] rounded bg-[#090e17]/95 backdrop-blur-xl shadow-[0_0_30px_${isManager ? 'rgba(16,185,129,0.1)' : 'rgba(6,182,212,0.1)'}] z-50 overflow-hidden animate-[dropIn_.18s_ease-out] border ${isManager ? 'border-emerald-500/30' : 'border-cyan-500/30'}`}>
                                        {/* Top neon line */}
                                        <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent ${isManager ? 'via-emerald-400' : 'via-cyan-400'} to-transparent`} />
                                        
                                        {/* Profile header */}
                                         <div className="px-4 pt-5 pb-3 border-b border-slate-800/80 bg-slate-900/30">
                                            <div className="flex flex-col mb-3">
                                                <p className={`font-black text-white text-sm uppercase tracking-widest font-mono ${isManager ? 'text-shadow-glow-emerald' : 'text-shadow-glow-cyan'} leading-tight`}>{user?.full_name || 'UNKNOWN_NODE'}</p>
                                                <p className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-1">
                                                    <span className={`w-1.5 h-1.5 rounded-full ${user?.role === 'employer' ? 'bg-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.8)]' : isManager ? 'bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.8)]' : 'bg-cyan-500 shadow-[0_0_5px_rgba(34,211,238,0.8)]'}`}></span>
                                                    {user?.role === 'employer' ? 'CLIENT_OP' : isManager ? 'MASTER_OP' : 'WORKER_OP'}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => { close(); navigate(user?.role === 'employer' ? '/task-owner/profiles' : isManager ? '/manager/request' : '/dashboard'); }}
                                                className={`w-full py-1.5 rounded font-black text-[9px] tracking-widest uppercase font-mono transition-all bg-[#02040a] ${isManager ? 'hover:bg-emerald-950 text-emerald-500 hover:text-emerald-300 hover:border-emerald-500/50' : 'hover:bg-cyan-950 text-cyan-500 hover:text-cyan-300 hover:border-cyan-500/50'} border border-slate-700`}
                                            >
                                                VIEW_DETAILS
                                            </button>
                                        </div>

                                         <div className="py-1">
                                            {[
                                                { label: 'OP_SETTINGS', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>, path: '/settings' },
                                                { label: 'FUNDS_GRID', icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,  path: '/wallet'   },
                                            ].map(item => (
                                                <button
                                                    key={item.path}
                                                    onClick={() => { close(); navigate(item.path); }}
                                                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-[10px] font-black font-mono tracking-widest uppercase text-slate-400 ${isManager ? 'hover:text-emerald-400 hover:bg-emerald-950/20 hover:border-emerald-400' : 'hover:text-cyan-400 hover:bg-cyan-950/20 hover:border-cyan-400'} transition-colors border-l-2 border-transparent`}
                                                >
                                                    <span className="text-slate-500">{item.icon}</span>
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="border-t border-slate-800/80 p-2">
                                            <button
                                                onClick={handleLogout}
                                                className="w-full flex items-center justify-center gap-2 py-2 rounded text-[10px] font-black font-mono tracking-widest uppercase text-rose-500/80 hover:text-rose-400 hover:bg-rose-950/30 transition-colors border border-transparent hover:border-rose-500/30"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                TERMINATE_LINK
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2">
                            <NavLink to="/signin" className="text-[10px] font-black font-mono tracking-widest uppercase text-slate-400 hover:text-cyan-400 px-3 py-1.5 rounded transition-colors">
                                {t('navbar.auth')}
                            </NavLink>
                            <NavLink to="/signup" className="text-[10px] font-black font-mono tracking-widest uppercase bg-cyan-900/40 hover:bg-cyan-900/60 text-cyan-400 border border-cyan-500/50 px-4 py-1.5 rounded transition-colors shadow-[0_0_10px_rgba(6,182,212,0.2)] flex items-center gap-1.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                {t('navbar.init_node')}
                            </NavLink>
                        </div>
                    )}
                </div>

            </div>
            {/* custom styles for scrollbar embedded here or rely on global index.css */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                    height: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: ${isManager ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)'};
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: ${isManager ? 'rgba(16, 185, 129, 0.5)' : 'rgba(6, 182, 212, 0.5)'};
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
