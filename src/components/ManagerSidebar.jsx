import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import FAFLogo from "../assets/FAF-Logo.png";

const ManagerSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const menuItems = [
        {
            label: "Yêu cầu đăng job",
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
            label: "Quản lý nhân viên",
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
            label: "Finance",
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
    ];

    return (
        <aside className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col">
            {/* Logo + User Profile + Menu Section */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <img src={FAFLogo} alt="FAF" className="h-13 w-auto" />
                    </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                            MG
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">Manager</p>
                            <p className="text-xs text-gray-500 truncate">FAF Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        aria-label="Log out"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H9m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                    </button>
                </div>

                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">MENU</h2>
                <nav className="space-y-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                                }`
                            }
                        >
                            {item.icon}
                            <span className="font-semibold">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>
            </div>

            {/* Thống kê / Info Section (optional) */}
            <div className="p-6 border-b border-gray-200 flex-1 overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">TỔNG QUAN</h2>
                </div>
                <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm text-gray-900 mb-1">Yêu cầu chờ duyệt</h3>
                                <p className="text-xs text-gray-600 mb-1">Số lượng job đang chờ phê duyệt</p>
                            </div>
                            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">--</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default ManagerSidebar;
