import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const ForgotOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return; // Chỉ cho phép số
        if (value.length > 1) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError(''); // Xóa lỗi khi người dùng nhập

        // Auto focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
            setOtp(newOtp.slice(0, 6));
            const nextEmptyIndex = pastedData.length < 6 ? pastedData.length : 5;
            const nextInput = document.getElementById(`otp-${nextEmptyIndex}`);
            if (nextInput) nextInput.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        if (otpCode.length !== 6) {
            setError('Vui lòng nhập đầy đủ 6 chữ số OTP');
            return;
        }

        // TODO: Gọi API xác thực OTP ở đây
        // Ví dụ: const isValid = await verifyOTP(otpCode);
        // if (isValid) {
        //     navigate('/reset-password');
        // } else {
        //     setError('Mã OTP không đúng. Vui lòng thử lại.');
        // }

        // Tạm thời: Giả sử OTP hợp lệ nếu là 123456 (để test)
        if (otpCode === '123456') {
            navigate('/reset-password');
        } else {
            setError('Mã OTP không đúng. Vui lòng thử lại.');
        }
    };

    const handleResend = () => {
        // TODO: Gọi API gửi lại OTP
        setOtp(['', '', '', '', '', '']);
        setError('');
        // Focus vào input đầu tiên
        const firstInput = document.getElementById('otp-0');
        if (firstInput) firstInput.focus();
        alert('Đã gửi lại mã OTP!');
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col items-center">
            <header className="w-full flex items-center justify-between px-10 py-8 text-sm text-gray-600">
                <div className="flex items-center">
                    <img src={FAFLogo} alt="FAF logo" className="h-12 w-auto object-contain" />
                </div>
                <button className="text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors">
                    Need help?
                </button>
            </header>

            <main className="w-full px-4 pb-16 flex justify-center">
                <div className="w-full max-w-xl mt-10 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    {/* Top border highlight */}
                    <div className="h-1 w-full bg-blue-600" />

                    <div className="px-10 py-12">
                        {/* Icon */}
                        <div className="w-12 h-12 mx-auto mb-6 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h18v14H3z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9 6 9-6" />
                            </svg>
                        </div>

                        {/* Title & description */}
                        <div className="text-center space-y-2 mb-8">
                            <h1 className="text-2xl font-bold text-gray-900">Verify OTP Code</h1>
                            <p className="text-sm text-gray-500 max-w-md mx-auto">
                                We've sent a 6-digit verification code to your email. Please enter it below to reset your password.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            <div className="flex justify-center gap-3">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition"
                                    />
                                ))}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition"
                            >
                                Verify OTP
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600 mb-2">
                                Didn't receive the code?
                            </p>
                            <button
                                type="button"
                                onClick={handleResend}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                            >
                                Resend OTP Code
                            </button>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                            <button
                                onClick={() => navigate('/forgot-password')}
                                className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                                Back to Forgot Password
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForgotOTP;
