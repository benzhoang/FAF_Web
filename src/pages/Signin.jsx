import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';
import Loading from '../components/Loading';

const Signin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Tài khoản giả
    const fakeAccounts = {
        worker: {
            email: 'worker@faf.com',
            password: 'password123',
            role: 'worker',
            redirect: '/'
        },
        taskOwner: {
            email: 'owner@faf.com',
            password: 'password123',
            role: 'taskOwner',
            redirect: '/task-owner'
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Kiểm tra tài khoản
        const account = Object.values(fakeAccounts).find(
            acc => acc.email === email && acc.password === password
        );

        if (account) {
            setLoading(true);
            // Lưu thông tin đăng nhập vào localStorage (tùy chọn)
            localStorage.setItem('user', JSON.stringify({
                email: account.email,
                role: account.role
            }));

            // Giả lập thời gian loading trước khi điều hướng
            setTimeout(() => {
                // Điều hướng theo role
                navigate(account.redirect);
                setLoading(false);
            }, 1000);
        } else {
            setError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        }
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col relative">
            {loading && <Loading />}
            <header className="flex items-center justify-between px-8 py-6 text-sm text-gray-600">
                <div className="flex items-center">
                    <img src={FAFLogo} alt="FAF logo" className="h-12 w-auto object-contain" />
                </div>
                <div className="flex items-center gap-2">
                    <span>Don't have an account yet?</span>
                    <a href="/signup" className="text-blue-600 font-semibold hover:underline">
                        Create account
                    </a>
                </div>
            </header>

            <div className={`flex-1 flex items-center justify-center px-4 pb-12 ${loading ? 'pointer-events-none opacity-60' : ''}`}>
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 px-10 py-12">
                    <div className="space-y-2 mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                        <p className="text-sm text-gray-500">Enter your details to access your candidate dashboard.</p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                Email address
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
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

                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="•••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                                    onClick={togglePasswordVisibility}
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-5-10-7 0-.695.395-1.77 1.17-2.992m4.229-3.63A9.966 9.966 0 0112 5c5.523 0 10 5 10 7 0 1.012-.54 2.41-1.558 3.77M15 12a3 3 0 00-3-3m0 0a2.99 2.99 0 00-1.354.322m0 0L9.171 9.171M9.171 9.171 4 4m5.646 5.646L4 4m9.354 9.354L20 20" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="inline-flex items-center gap-2 text-gray-600">
                                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                Remember me
                            </label>
                            <a href="/forgot-password" className="text-blue-600 font-semibold hover:underline">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition"
                        >
                            Sign in
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-6">
                        <span className="flex-1 h-px bg-gray-200" />
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em]">Or continue with</span>
                        <span className="flex-1 h-px bg-gray-200" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition font-semibold text-gray-700">
                            <span className="text-lg">G</span>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-3 hover:bg-gray-50 transition font-semibold text-gray-700">
                            <span className="text-blue-600">
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.48 8h4V24h-4zM8.48 8h3.84v2.18h.05c.54-1.02 1.87-2.1 3.85-2.1 4.12 0 4.88 2.71 4.88 6.23V24h-4v-8.18c0-1.95-.03-4.46-2.72-4.46-2.73 0-3.15 2.13-3.15 4.33V24h-4z" />
                                </svg>
                            </span>
                            LinkedIn
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="text-center">
                            <a
                                href="/"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Home
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
