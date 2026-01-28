import React from 'react';
import { useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const ForgotPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Điều hướng sang trang nhập OTP sau khi nhập email
        navigate('/forgot-otp');
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col items-center">
            {/* Header */}
            <header className="w-full flex items-center justify-between px-10 py-8 text-sm text-gray-600">
                <div className="flex items-center">
                    <img src={FAFLogo} alt="FAF logo" className="h-12 w-auto object-contain" />
                </div>
                <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                    Need help?
                </button>
            </header>

            {/* Card */}
            <main className="w-full px-4 pb-16 flex justify-center">
                <div className="w-full max-w-xl mt-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Top border highlight */}
                    <div className="h-1 w-full bg-blue-600" />

                    <div className="px-10 py-12">
                        {/* Icon */}
                        <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h7l2 3h7v13H4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11v4m0 3h.01" />
                            </svg>
                        </div>

                        {/* Title & description */}
                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Reset your password</h1>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                Don't worry, it happens to the best of us. Enter your email below to recover your account.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18v14H3z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 6 9-6" />
                                    </svg>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition"
                            >
                                Send Reset Link
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </button>
                        </form>

                        {/* Back link */}
                        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                            <a
                                href="/signin"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Login
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotPage;
