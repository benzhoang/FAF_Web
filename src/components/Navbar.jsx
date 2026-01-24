import React from 'react';
import { NavLink } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const Navbar = () => {
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
                        <a className="hover:text-blue-600 transition-colors" href="#">Hire Talent</a>
                        <a className="hover:text-blue-600 transition-colors" href="#">Pricing</a>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center gap-3">
                        <NavLink
                            to="/signin"
                            className="hidden sm:block text-sm font-bold px-4 py-2.5 rounded-lg border border-gray-200 bg-white hover:border-blue-500 hover:text-blue-600 transition-colors"
                        >
                            Log In
                        </NavLink>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-all shadow-sm">Post a Job</button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
