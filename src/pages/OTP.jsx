import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FAFLogo from '../assets/FAF-Logo.png';

const OTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (value.length > 1) return;
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

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
            alert('Vui lòng nhập đầy đủ 6 chữ số OTP');
            return;
        }

        // TODO: Gọi API xác thực OTP ở đây
        console.log('OTP Code:', otpCode);
        
        // Sau khi xác thực thành công, chuyển đến trang đăng nhập hoặc trang chủ
        // navigate('/signin');
        alert('Xác thực OTP thành công!');
    };

    const handleResend = () => {
        // TODO: Gọi API gửi lại OTP
        alert('Đã gửi lại mã OTP!');
    };

    return (
        <div className="min-h-screen auth-gradient flex flex-col items-center">
            <header className="w-full flex justify-center pt-10 pb-6">
                <div className="flex items-center gap-2">
                    <img src={FAFLogo} alt="FAF logo" className="h-10 w-auto object-contain" />
                </div>
            </header>

            <main className="w-full px-4 pb-12 flex justify-center">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-100 px-10 py-12">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Xác thực OTP</h1>
                        <p className="text-sm text-gray-500">
                            Chúng tôi đã gửi mã xác thực 6 chữ số đến email của bạn
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
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
                            Xác thực
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600 mb-2">
                            Không nhận được mã?
                        </p>
                        <button
                            type="button"
                            onClick={handleResend}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                        >
                            Gửi lại mã OTP
                        </button>
                    </div>

                    <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                        <button
                            onClick={() => navigate('/signin')}
                            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </main>

            <footer className="pb-8 text-xs text-gray-400">
                © 2026 FAF Platform Inc. All rights reserved.
            </footer>
        </div>
    );
};

export default OTP;
