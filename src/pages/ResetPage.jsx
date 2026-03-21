import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const ResetPage = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const checks = useMemo(() => {
        const length = password.length >= 8;
        const number = /\d/.test(password);
        const symbol = /[^A-Za-z0-9]/.test(password);
        const score = [length, number, symbol].filter(Boolean).length;
        let label = 'Weak';
        if (score === 2) label = 'Fair';
        if (score === 3) label = 'Good';
        return { length, number, symbol, score, label };
    }, [password]);

    const bars = useMemo(() => {
        const total = 4;
        const active = Math.max(checks.score, 1);
        return Array.from({ length: total }, (_, idx) => idx < active);
    }, [checks.score]);

    const isMatch = confirmPassword.length === 0 || password === confirmPassword;
    const canSubmit = checks.score === 3 && isMatch && password.length > 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: Gọi API cập nhật mật khẩu tại đây
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col items-center">
            <main className="w-full px-4 py-12 flex justify-center">
                <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <div className="px-10 py-12">
                        <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.657 0 3-1.343 3-3V6a3 3 0 10-6 0v2c0 1.657 1.343 3 3 3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 11h14v8H5z" />
                            </svg>
                        </div>

                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                Your new password must be different from previously used passwords.
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">New password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showPassword ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.5-7 0-.5 1.5-5 7.5-7a9.98 9.98 0 014.61-.28m4.27 1.75C20.81 7.42 22.5 11 22.5 12c-1.03 3.15-3.73 5.66-7 6.58M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
                                    <span>Strength</span>
                                    <span className={checks.score === 3 ? 'text-blue-600' : 'text-gray-500'}>{checks.label}</span>
                                </div>
                                <div className="flex gap-2">
                                    {bars.map((active, idx) => (
                                        <div
                                            key={idx}
                                            className={`h-1.5 flex-1 rounded-full transition ${active
                                                ? checks.score === 3
                                                    ? 'bg-blue-600'
                                                    : checks.score === 2
                                                        ? 'bg-yellow-400'
                                                        : 'bg-red-400'
                                                : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600">
                                    <RequirementItem label="8+ chars" met={checks.length} />
                                    <RequirementItem label="1 Number" met={checks.number} />
                                    <RequirementItem label="1 Symbol" met={checks.symbol} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700">Confirm password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? 'text' : 'password'}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter your password"
                                        className={`w-full border rounded-lg px-4 py-3 pr-12 text-sm text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${isMatch ? 'border-gray-300' : 'border-red-400'
                                            }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirm((v) => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            {showConfirm ? (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9.27-3.11-10.5-7 0-.5 1.5-5 7.5-7a9.98 9.98 0 014.61-.28m4.27 1.75C20.81 7.42 22.5 11 22.5 12c-1.03 3.15-3.73 5.66-7 6.58M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            ) : (
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z" />
                                            )}
                                        </svg>
                                    </button>
                                </div>
                                {!isMatch && (
                                    <p className="text-xs text-red-500 font-medium">Passwords do not match.</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!canSubmit}
                                className={`w-full text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition ${canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-300 cursor-not-allowed'
                                    }`}
                            >
                                Update Password
                            </button>
                        </form>

                        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
                            <Link
                                to="/signin"
                                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="pb-10">
                <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-3">
                    <button type="button" className="hover:text-gray-700">Privacy Policy</button>
                    <span>|</span>
                    <button type="button" className="hover:text-gray-700">Terms of Service</button>
                </div>
            </footer>
        </div>
    );
};

const RequirementItem = ({ label, met }) => (
    <div className={`flex items-center gap-1 ${met ? 'text-green-600' : 'text-gray-500'}`}>
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {met ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m7-7H5" />
            )}
        </svg>
        <span>{label}</span>
    </div>
);

export default ResetPage;