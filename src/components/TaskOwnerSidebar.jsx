import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const TaskOwnerSidebar = () => {
    const { user } = useAuth();

    const getInitials = (userData) => {
        if (userData?.full_name) {
            return userData.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        if (userData?.email) return userData.email[0].toUpperCase();
        return 'U';
    };

    return (
        <aside className="w-[280px] hidden lg:flex flex-col gap-4 p-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
            
            {/* Identity Card */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm relative text-center pb-4">
                {/* Banner Background */}
                <div className="h-16 w-full bg-gradient-to-r from-blue-500 to-indigo-600 relative">
                    <svg className="absolute inset-0 w-full h-full opacity-20" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,100 C20,90 40,110 60,90 C80,70 100,100 100,100 L100,0 L0,0 Z" fill="white" />
                    </svg>
                </div>
                
                {/* Avatar */}
                <div className="relative -mt-8 flex justify-center">
                    <div className="w-16 h-16 rounded-full bg-blue-600 border-4 border-white flex items-center justify-center text-white text-xl font-bold shadow-sm">
                        {getInitials(user)}
                    </div>
                </div>

                {/* Info */}
                <div className="mt-3 px-4">
                    <h2 className="text-base font-semibold text-gray-900 leading-tight">
                        {user?.full_name || 'Employer Name'}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        Task Owner • Hiring Manager
                    </p>
                </div>
                
                <div className="mt-4 border-t border-gray-100 pt-3 px-4 flex justify-between text-xs">
                    <span className="text-gray-500">Active Jobs</span>
                    <span className="font-semibold text-blue-600">3</span>
                </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <nav className="flex-1 py-2 flex flex-col text-sm font-medium text-gray-600">
                    <NavLink
                        to="/task-owner"
                        end
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Workspace Overview
                    </NavLink>
                    <NavLink
                        to="/task-owner/jobs"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        My Job Posts
                    </NavLink>
                    <NavLink
                        to="/task-owner/contracts"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Contracts & Escrow
                    </NavLink>
                    <NavLink
                        to="/task-owner/talent"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Saved Talent
                    </NavLink>
                    <NavLink
                        to="/task-owner/profiles"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 border-l-4 transition-colors ${
                                isActive
                                    ? 'bg-blue-50 border-blue-600 text-blue-700'
                                    : 'border-transparent hover:bg-gray-50 hover:text-gray-900'
                            }`
                        }
                    >
                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Company Profile
                    </NavLink>
                </nav>
            </div>
        </aside>
    );
};

export default TaskOwnerSidebar;
