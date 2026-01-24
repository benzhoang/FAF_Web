import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const Signup = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('worker');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        tos: false
    });

    const togglePassword = () => setShowPassword((prev) => !prev);
    const toggleConfirm = () => setShowConfirm((prev) => !prev);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.password.length < 6) {
            alert('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        if (!formData.tos) {
            alert('Vui lòng đồng ý với Điều khoản dịch vụ và Chính sách bảo mật');
            return;
        }

        // TODO: Gọi API đăng ký ở đây
        console.log('Signup data:', { ...formData, role });

        // Sau khi đăng ký thành công, chuyển đến trang OTP
        navigate('/otp');
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col items-center">
            <header className="w-full flex justify-center pt-10 pb-6">
                <div className="flex items-center gap-2">
                    <img src={FAFLogo} alt="FAF logo" className="h-10 w-auto object-contain" />
                </div>
            </header>

            <main className="w-full px-4 pb-12 flex justify-center">
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 px-10 py-12">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                        <p className="text-sm text-gray-500">
                            Join the future of work. Already have an account?{' '}
                            <a href="/signin" className="text-blue-600 font-semibold hover:underline">
                                Log in
                            </a>
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-8">
                        <button
                            type="button"
                            onClick={() => setRole('worker')}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${role === 'worker'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 21v-1a6 6 0 1112 0v1" />
                            </svg>
                            Worker
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('employer')}
                            className={`flex items-center justify-center gap-2 rounded-lg border px-4 py-3 font-semibold transition ${role === 'employer'
                                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                                : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                                }`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9l9-6 9 6-9 6-9-6z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15l9 6 9-6" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l9 6 9-6" />
                            </svg>
                            Employer
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid md:grid-cols-1 gap-5">
                            <div className="space-y-2">
                                <label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        placeholder="Jane Doe"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <svg
                                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M7 7V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7v10a2 2 0 002 2h6a2 2 0 002-2V7" />
                                    </svg>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="jane@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
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
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePassword}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
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

                            <div className="space-y-2">
                                <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">
                                    Confirm
                                </label>
                                <div className="relative">
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showConfirm ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirm}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiển thị mật khẩu'}
                                    >
                                        {showConfirm ? (
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
                        </div>

                        <div className="flex items-start gap-3 text-sm text-gray-600">
                            <input
                                type="checkbox"
                                id="tos"
                                name="tos"
                                checked={formData.tos}
                                onChange={handleChange}
                                className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="tos">
                                I agree to the <span className="font-semibold text-gray-800">Terms of Service</span> and{' '}
                                <span className="font-semibold text-gray-800">Privacy Policy</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition"
                        >
                            Create Account
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    </form>

                    <div className="flex items-center gap-4 my-8">
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

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
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
            </main>

            <footer className="pb-8 text-xs text-gray-400">
                © 2026 FAF Platform Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default Signup;
