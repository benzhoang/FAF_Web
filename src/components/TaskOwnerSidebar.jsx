import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useTranslation } from 'react-i18next';

const TaskOwnerSidebar = () => {
    const { user } = useAuth();
    const { t } = useTranslation();

    const getInitials = (userData) => {
        if (userData?.full_name) {
            return userData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (userData?.email) return userData.email[0].toUpperCase();
        return 'U';
    };

    const navLinks = [
        {
            to: "/task-owner",
            end: true,
            label: t('task_owner.sidebar_overview', 'Workspace Overview'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
            )
        },
        {
            to: "/task-owner/jobs",
            label: t('task_owner.sidebar_jobs', 'My Job Posts'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            to: "/task-owner/contracts",
            label: t('task_owner.sidebar_contracts', 'Contracts & Escrow'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            to: "/task-owner/talent",
            label: t('task_owner.sidebar_talent', 'Saved Talent'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        },
        {
            to: "/task-owner/profiles",
            label: t('task_owner.sidebar_profile', 'Company Profile'),
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            )
        }
    ];

    return (
        <aside className="w-[280px] hidden lg:flex flex-col gap-6 p-6 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto bg-transparent border-r border-cyan-500/10">
            
            {/* Identity Card */}
            <div className="relative group rounded-2xl border p-5 overflow-hidden transition-all hover:border-cyan-500/40 shadow-[0_8px_32px_rgba(0,0,0,0.5)]" 
                 style={{ background: 'linear-gradient(145deg, #0f172a, #020617)', borderColor: 'rgba(6,182,212,0.2)' }}>
                
                {/* Ambient Glow */}
                <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-600/20 rounded-full blur-2xl group-hover:bg-cyan-600/30 transition-all"></div>
                
                <div className="relative z-10 flex flex-col items-center">
                    {/* Avatar */}
                    <div className="relative mb-4 group cursor-pointer">
                        {/* Rotating Tech Border */}
                        <div className="absolute -inset-1 border border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite] border-dashed"></div>
                        <div className="absolute -inset-2 border border-blue-500/10 rounded-full animate-[spin_15s_linear_infinite] border-dotted"></div>
                        
                        <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-20 animate-pulse"></div>
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#0f172a] via-cyan-950 to-blue-900 flex items-center justify-center text-cyan-400 text-3xl font-black shadow-[0_0_30px_rgba(6,182,212,0.3)] relative border border-cyan-500/40 group-hover:border-cyan-400 transition-all duration-500">
                            <span className="relative z-10 group-hover:scale-110 transition-transform">
                                {getInitials(user)}
                            </span>
                            {/* Inner Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="text-center space-y-1">
                        <p className="text-[10px] font-mono tracking-[0.2em] text-cyan-400 uppercase font-black">{t('task_owner.sidebar_employer', 'EMPLOYER')}</p>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight leading-tight">
                            {user?.full_name || 'FAF SYSTEM'}
                        </h2>
                        <div className="flex items-center justify-center gap-1.5 pt-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span>
                            <span className="text-[9px] font-mono text-slate-400 tracking-widest uppercase">{t('task_owner.sidebar_verified', 'NODE VERIFIED')}</span>
                        </div>
                    </div>
                </div>

                {/* Glass Footer Stat */}
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <div className="text-left">
                        <p className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{t('task_owner.sidebar_reputation', 'REPUTATION')}</p>
                        <p className="text-xs font-black text-white font-mono">98.4%</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{t('task_owner.sidebar_tier', 'TIER')}</p>
                        <p className="text-xs font-black text-cyan-400 font-mono">LEGACY</p>
                    </div>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="flex-1 flex flex-col gap-2">
                <p className="px-4 text-[9px] font-mono tracking-[0.3em] text-slate-500 uppercase font-black mb-1">
                    {t('task_owner.sidebar_navigation', 'COMMAND CENTER')}
                </p>
                
                <nav className="space-y-1">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.end}
                            className={({ isActive }) =>
                                `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-mono text-[11px] font-black tracking-widest uppercase ${
                                    isActive
                                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]'
                                        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'
                                }`
                            }
                        >
                            <span className={`transition-transform duration-300 group-hover:scale-110 ${window.location.pathname === link.to ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                {link.icon}
                            </span>
                            {link.label}
                            {window.location.pathname === link.to && (
                                <div className="ml-auto w-1 h-3 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Bottom Tech Detail */}
            <div className="mt-auto px-4 py-3 rounded-xl border border-white/5 bg-white/2 cursor-default">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
                    <p className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">System Status</p>
                </div>
                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 w-[85%] shadow-[0_0_5px_rgba(6,182,212,0.5)]"></div>
                </div>
                <p className="text-[8px] font-mono text-slate-600 mt-2 tracking-tighter uppercase italic">
                    Node ID: {String(user?.id || '').slice(0, 12)}...
                </p>
            </div>
        </aside>
    );
};

export default TaskOwnerSidebar;
