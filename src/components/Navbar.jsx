import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        // Kiểm tra user từ localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        if (showDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDropdown]);

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        setShowDropdown(false);
        navigate('/');
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const getInitials = (userData) => {
        if (userData?.fullName) {
            return userData.fullName
                .split(' ')
                .map(n => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        if (userData?.email) {
            return userData.email[0].toUpperCase();
        }
        return 'U';
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-gray-100 backdrop-blur-md bg-white/80">
            <div className="w-full px-4 h-20 flex items-center justify-between gap-8">
                <div className="flex items-center gap-12">
                    {/* Logo */}
                    <NavLink to="/" className="flex items-center" aria-label="Trang chủ">
                        <img src={FAFLogo} alt="FAF" className="h-10 w-auto" />
                    </NavLink>

                    {/* Search Bar */}
                    <div className="hidden lg:flex flex-1 min-w-[320px]">
                        <div className="relative w-full group">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                className="w-full bg-white border border-gray-500 rounded-lg pl-11 pr-4 py-2.5 text-sm transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-600/20"
                                placeholder="Search for roles, skills, or companies..."
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
                        <NavLink
                            to="/find-work"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            Find Work
                        </NavLink>
                        <NavLink
                            to="/dashboard"
                            className={({ isActive }) =>
                                `transition-colors ${isActive ? 'text-blue-600' : 'hover:text-blue-600'}`
                            }
                        >
                            Dashboard
                        </NavLink>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        {user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={toggleDropdown}
                                    className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold cursor-pointer hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    aria-label="User menu"
                                >
                                    {getInitials(user)}
                                </button>
                                
                                {showDropdown && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <div className="px-4 pb-2 text-sm text-gray-600">
                                            <p className="font-semibold text-gray-800">
                                                Hello, {user?.fullName || user?.email || 'User'}
                                            </p>
                                        </div>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={() => {
                                                setShowDropdown(false);
                                                // Navigate to settings page (you can change this route)
                                                navigate('/settings');
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            Settings
                                        </button>
                                        <div className="border-t border-gray-200 my-1"></div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Log Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <NavLink
                                to="/signin"
                                className="hidden sm:block text-sm font-bold px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Log In
                            </NavLink>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
