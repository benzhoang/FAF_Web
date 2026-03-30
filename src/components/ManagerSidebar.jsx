import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FAFLogo from "../assets/FAF-Logo.png";
import { useAuth } from "../auth/AuthContext";
import { useTranslation } from "react-i18next";

const ManagerSidebar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getInitials = (u) => {
        if (u?.full_name) return u.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        return 'MG';
    };

    const menuItems = [
        {
            label: t("navbar.requests"),
            path: "/manager/request",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                </svg>
            ),
        },
        {
            label: "Work Hub",
            path: "/manager/management/jobs",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                </svg>
            ),
        },
        {
            label: t("navbar.employees"),
            path: "/manager/employees",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                    />
                </svg>
            ),
        },
        {
            label: t("navbar.finances"),
            path: "/manager/finances",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h4v11H3V10zm7-4h4v15h-4V6zm7-3h4v18h-4V3z"
                    />
                </svg>
            ),
        },
        {
            label: t("navbar.disputes") || "DISPUTES",
            path: "/manager/disputes",
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                </svg>
            ),
        },
    ];

    return (
        <aside className="w-72 min-h-screen bg-[#050810] border-r border-[#00f0ff]/20 flex flex-col relative overflow-hidden group">
            {/* Ambient Background Glow */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#00f0ff]/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            {/* Sidebar Content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header Section */}
                <div className="p-8 pb-4">
                    <div className="flex items-center gap-3 mb-10">
                        <img src={FAFLogo} alt="FAF" className="h-8 w-auto invert brightness-0" />
                        <div className="h-4 w-px bg-[#00f0ff]/30"></div>
                        <span className="text-[10px] font-black font-mono tracking-[0.3em] text-[#00f0ff] uppercase shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                            Admin_Node
                        </span>
                    </div>

                    {/* Manager Identity Card */}
                    <div className="relative mb-10 flex flex-col items-center">
                         {/* Avatar container */}
                         <div className="relative mb-4 group/avt cursor-pointer">
                            {/* Rotating Tech Border */}
                            <div className="absolute -inset-1 border border-[#00f0ff]/40 rounded-full animate-[spin_12s_linear_infinite] border-dashed"></div>
                            <div className="absolute -inset-2 border border-[#bf00ff]/30 rounded-full animate-[spin_20s_linear_infinite] border-dotted"></div>
                            
                            <div className="absolute inset-0 bg-[#00f0ff] rounded-full blur-md opacity-20 animate-pulse"></div>
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#050810] via-[#0a1128] to-[#1e1b4b] flex items-center justify-center text-[#00f0ff] text-3xl font-black shadow-[0_0_30px_rgba(0,240,255,0.3)] relative border border-[#00f0ff]/50 group-hover/avt:border-[#bf00ff] transition-all duration-500">
                                <span className="relative z-10 group-hover/avt:scale-110 transition-transform bg-clip-text text-transparent bg-gradient-to-r from-[#00f0ff] to-[#bf00ff]">
                                    {getInitials(user)}
                                </span>
                            </div>
                        </div>

                        <div className="text-center">
                            <h2 className="text-sm font-black text-white uppercase tracking-widest font-mono">
                                {user?.full_name || "MASTER_MGR"}
                            </h2>
                            <p className="text-[9px] font-mono font-bold text-[#00f0ff]/80 uppercase tracking-widest flex items-center justify-center gap-1.5 mt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.8)] animate-pulse"></span>
                                LEVEL_04_OVERSEER
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <p className="text-[9px] font-black font-mono tracking-widest text-[#94a3b8] uppercase px-4 mb-3">COMMAND_MENU</p>
                        {menuItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end
                                className={({ isActive }) =>
                                    `group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-mono text-[11px] font-black tracking-widest uppercase relative overflow-hidden ${
                                        isActive 
                                            ? "bg-[#00f0ff]/10 text-[#00f0ff] shadow-[inset_0_0_20px_rgba(0,240,255,0.15)] border border-[#00f0ff]/40" 
                                            : "text-slate-500 hover:text-white hover:bg-[#bf00ff]/10 hover:border hover:border-[#bf00ff]/20 border border-transparent"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span className={`relative z-10 transition-colors ${isActive ? "text-[#00f0ff] drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" : "group-hover:text-[#bf00ff]"}`}>{item.icon}</span>
                                        <span className="relative z-10">{item.label}</span>
                                        
                                        {/* Active Indicator Bar */}
                                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00f0ff] to-[#bf00ff] transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`} />
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <div className="mt-auto p-6 border-t border-[#00f0ff]/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[10px] font-black font-mono tracking-[0.2em] uppercase text-rose-500 hover:text-white hover:bg-rose-600 transition-all border border-rose-500/30 hover:shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        TERMINATE_SESSION
                    </button>
                    <p className="text-[7px] font-mono text-[#00f0ff]/50 text-center mt-4 tracking-tighter uppercase opacity-50">
                        FAF_NET // MANAGER_v3.0 // SYSTEM_STABLE
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default ManagerSidebar;

